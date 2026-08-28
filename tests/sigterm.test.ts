import { describe, expect, it } from "bun:test";

/**
 * The container runs this app as PID 1 (`ENTRYPOINT ["bun", "src/index.ts"]`,
 * no init), and the kernel discards a signal PID 1 has registered no handler
 * for. Without one, `docker stop` did nothing and the daemon SIGKILLed the
 * process after the full 10s grace period; nginx served that stall as 502s on
 * every deploy and host restart.
 *
 * A test process is not PID 1, so "does it exit on SIGTERM?" proves nothing —
 * the default disposition terminates it either way. What distinguishes the two
 * is *how* it goes:
 *
 *   handler registered -> exitCode 0,    signalCode null
 *   no handler         -> exitCode null, signalCode "SIGTERM"
 *
 * so the assertion is on a clean exit status, not on exiting at all.
 */
const ENTRYPOINT = new URL("../src/index.ts", import.meta.url).pathname;

describe("SIGTERM handling", () => {
  it("registers a handler for both stop signals", async () => {
    const before = {
      term: process.listenerCount("SIGTERM"),
      int: process.listenerCount("SIGINT"),
    };

    // Importing does not start a server — Bun only serves the default export of
    // the entry module — so this observes registration and nothing else.
    await import(ENTRYPOINT);

    expect(process.listenerCount("SIGTERM")).toBeGreaterThan(before.term);
    expect(process.listenerCount("SIGINT")).toBeGreaterThan(before.int);
  });

  it("exits cleanly and promptly when the daemon sends SIGTERM", async () => {
    // Port 0 lets the OS pick a free one, so this cannot collide with a running
    // dev server or a parallel job.
    const proc = Bun.spawn(["bun", ENTRYPOINT], {
      env: { ...process.env, PORT: "0" },
      stdout: "ignore",
      stderr: "ignore",
    });

    // Long enough for the module to evaluate and register the handler.
    await Bun.sleep(1500);
    expect(proc.killed).toBe(false);

    const sentAt = Date.now();
    proc.kill("SIGTERM");
    await proc.exited;
    const took = Date.now() - sentAt;

    // A signalCode here would mean nothing handled it and the OS did the
    // killing — which is the defect, and what happens to PID 1 in a container
    // only after Docker gives up and escalates to SIGKILL.
    expect(proc.signalCode).toBeNull();
    expect(proc.exitCode).toBe(0);

    // Docker's default grace period is 10s. Anything close to that is the stall
    // this handler exists to remove.
    expect(took).toBeLessThan(2000);
  }, 15000);
});
