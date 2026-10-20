/**
 * Logo URLs come straight from the upstream token list, which anyone able to
 * edit that list controls. `/api/image/:address` answers with a redirect to
 * that URL, so an unchecked entry turns this gateway into an open redirect
 * under our domain (one entry already points at attacker.com).
 *
 * Only https URLs on hosts the token list actually uses for logos are served.
 */
export const LOGO_HOSTS = new Set([
  "iotexproject.iotex.io",
  "cdn.dapp.works",
  "cdn-dapp-works.s3.us-east-1.amazonaws.com",
  "depinscan-prod.s3.amazonaws.com",
  "iopay.me",
  "ipfs.io",
  "d135ugxgwtnu1c.cloudfront.net",
]);

/** The logo URL if it is safe to send users to, otherwise "". */
export function safeLogoUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return "";
  }
  if (url.protocol !== "https:" || url.username || url.password) return "";
  if (!LOGO_HOSTS.has(url.hostname.toLowerCase())) return "";
  return url.toString();
}
