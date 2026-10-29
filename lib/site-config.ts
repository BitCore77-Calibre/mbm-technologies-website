/**
 * Site-wide settings.
 *
 * Values that differ between your computer, Docker and the public Cloudflare
 * deployment come from build-time variables (VITE_*). Vite writes them into
 * the build, so change them in `.env` (local) or in the GitHub/Cloudflare
 * build settings, then rebuild. None of these values are secret.
 */

const env = import.meta.env;

function clean(value: string | undefined): string {
  return (value ?? "").trim();
}

function cleanUrl(value: string | undefined): string {
  return clean(value).replace(/\/+$/, "");
}

export const siteConfig = {
  /** Public address of this website, used for SEO, sitemap and social previews. */
  siteUrl: cleanUrl(env.VITE_SITE_URL) || "https://mbm-technologies.com",

  /**
   * When true, buttons to services running on the same computer
   * (Calibre Exchange on :3001, Calibre Swap on :3030) are shown.
   * Keep this false for the public website.
   */
  showLocalPortals: clean(env.VITE_SHOW_LOCAL_PORTALS) === "true",

  /** Public addresses of sister sites. Empty = not launched yet (button hidden). */
  calibreWebsiteUrl: cleanUrl(env.VITE_CALIBRE_WEBSITE_URL),
  calibreExchangeUrl: cleanUrl(env.VITE_CALIBRE_EXCHANGE_URL),
  calibreSwapUrl: cleanUrl(env.VITE_CALIBRE_SWAP_URL),

  /** Local development addresses (only used when showLocalPortals is true). */
  localExchangeUrl: cleanUrl(env.VITE_LOCAL_EXCHANGE_URL) || "http://localhost:3001",
  localSwapUrl: cleanUrl(env.VITE_LOCAL_SWAP_URL) || "http://localhost:3030",

  /** Cloudflare Turnstile site key (public). Empty = spam check widget not shown. */
  turnstileSiteKey: clean(env.VITE_TURNSTILE_SITE_KEY),
} as const;

/**
 * Company identity shown in the footer, contact page, privacy notice and
 * search-engine data. Empty values are simply not displayed.
 *
 * Fill these in once (they are the same everywhere), or set the matching
 * VITE_COMPANY_* variables.
 */
export const company = {
  brandName: "MBM Technologies",
  legalName: clean(env.VITE_COMPANY_LEGAL_NAME),
  registrationNumber: clean(env.VITE_COMPANY_REGISTRATION_NUMBER),
  address: clean(env.VITE_COMPANY_ADDRESS),
  country: "Cyprus",
  email: clean(env.VITE_CONTACT_EMAIL),
  privacyEmail: clean(env.VITE_PRIVACY_EMAIL) || clean(env.VITE_CONTACT_EMAIL),
  linkedinUrl: cleanUrl(env.VITE_LINKEDIN_URL),
  githubUrl: cleanUrl(env.VITE_GITHUB_URL),
  xUrl: cleanUrl(env.VITE_X_URL),
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Host name without protocol, e.g. "mbm-technologies.com". */
export function siteHost(): string {
  try {
    return new URL(siteConfig.siteUrl).host;
  } catch {
    return siteConfig.siteUrl;
  }
}
