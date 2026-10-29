/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_SHOW_LOCAL_PORTALS?: string;
  readonly VITE_CALIBRE_WEBSITE_URL?: string;
  readonly VITE_CALIBRE_EXCHANGE_URL?: string;
  readonly VITE_CALIBRE_SWAP_URL?: string;
  readonly VITE_LOCAL_EXCHANGE_URL?: string;
  readonly VITE_LOCAL_SWAP_URL?: string;
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  readonly VITE_COMPANY_LEGAL_NAME?: string;
  readonly VITE_COMPANY_REGISTRATION_NUMBER?: string;
  readonly VITE_COMPANY_ADDRESS?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_PRIVACY_EMAIL?: string;
  readonly VITE_LINKEDIN_URL?: string;
  readonly VITE_GITHUB_URL?: string;
  readonly VITE_X_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
