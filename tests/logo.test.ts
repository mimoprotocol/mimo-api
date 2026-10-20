import { describe, expect, it } from "bun:test";
import { safeLogoUrl } from "../src/lib/logo";

describe("safeLogoUrl", () => {
  it("keeps https logos on the token list's hosts", () => {
    const url = "https://iotexproject.iotex.io/iotex-token-metadata/master/images/io1abc.png";
    expect(safeLogoUrl(url)).toBe(url);
    expect(safeLogoUrl("https://cdn.dapp.works/x.png")).toBe("https://cdn.dapp.works/x.png");
  });

  it("trims whitespace the list carries for some entries", () => {
    expect(safeLogoUrl(" https://iotexproject.iotex.io/a.png")).toBe("https://iotexproject.iotex.io/a.png");
  });

  it("refuses hosts outside the allowlist", () => {
    expect(safeLogoUrl("https://attacker.com/fake-logo.png")).toBe("");
    expect(safeLogoUrl("https://iotexproject.iotex.io.attacker.com/a.png")).toBe("");
  });

  it("refuses non-https, credentials, relative and junk values", () => {
    expect(safeLogoUrl("http://iotexproject.iotex.io/a.png")).toBe("");
    expect(safeLogoUrl("javascript:alert(1)")).toBe("");
    expect(safeLogoUrl("https://user@iotexproject.iotex.io/a.png")).toBe("");
    expect(safeLogoUrl("/images/tokens/token_tex-c.png")).toBe("");
    expect(safeLogoUrl("")).toBe("");
    expect(safeLogoUrl(undefined)).toBe("");
  });
});
