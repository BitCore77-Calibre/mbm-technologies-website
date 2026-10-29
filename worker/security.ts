/** HTTP security headers and small crypto helpers shared by the Worker. */

const SITE_CSP = [
  "default-src 'self'",
  // Next/vinext streams page data through inline scripts, so 'unsafe-inline' is required.
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com",
  "frame-src https://challenges.cloudflare.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

export const ADMIN_CSP = [
  "default-src 'none'",
  "style-src 'unsafe-inline'",
  "img-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
].join("; ");

/** Adds security headers to a response without overwriting ones it already has. */
export function withSecurityHeaders(response: Response, request: Request): Response {
  // WebSocket upgrades and other special responses must pass through untouched.
  if (response.status === 101) return response;

  const secured = new Response(response.body, response);
  const headers = secured.headers;
  const set = (name: string, value: string) => {
    if (!headers.has(name)) headers.set(name, value);
  };

  set("X-Content-Type-Options", "nosniff");
  set("X-Frame-Options", "DENY");
  set("Referrer-Policy", "strict-origin-when-cross-origin");
  set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()");
  set("Cross-Origin-Opener-Policy", "same-origin");
  // Only on HTTPS: on plain-HTTP local Docker this would break the page's own files.
  const isHttps = new URL(request.url).protocol === "https:";
  set("Content-Security-Policy", isHttps ? `${SITE_CSP}; upgrade-insecure-requests` : SITE_CSP);
  if (isHttps) set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  return secured;
}

export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

/** Compares two strings without leaking where they differ through timing. */
export async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256Hex(a), sha256Hex(b)]);
  let diff = 0;
  for (let i = 0; i < ha.length; i++) diff |= ha.charCodeAt(i) ^ hb.charCodeAt(i);
  return diff === 0;
}

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Rejects cross-site form posts. Browsers send Origin on POST and
 * Sec-Fetch-Site on modern versions; either one being foreign is enough.
 */
export function isSameOriginPost(request: Request): boolean {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return false;
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return false;
  return true;
}
