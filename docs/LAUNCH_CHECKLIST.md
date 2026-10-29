# Launch checklist

Status of what the website needs before it goes public.

## Done in the code

- [x] Removed the ChatGPT "Sites" hosting lock-in (OpenAI project file, ChatGPT
      sign-in helper, links to `*.chatgpt.site`, build scripts tied to it).
- [x] `localhost:3001` / `:3030` buttons hidden on the public build; shown only
      when `VITE_SHOW_LOCAL_PORTALS=true` (Docker on your computer).
- [x] CALIBRE post-quantum network added as the lead programme and portal.
- [x] Job profile no longer asks for Solidity (CALIBRE is not an EVM chain).
- [x] Images 8.9 MB → about 0.6 MB (WebP), trimmed logo, proper 1200×630
      social preview, Apple touch icon.
- [x] Security headers (CSP, HSTS, no framing, nosniff, referrer and
      permissions policies).
- [x] Search engines: `robots.txt`, `sitemap.xml`, canonical addresses,
      organization data (JSON-LD), custom 404 page. Preview addresses
      (`*.workers.dev`, localhost) are never indexed.
- [x] Form protection: honeypot, cross-site block, 5 submissions per hour per
      visitor (hashed IP, deleted within 48 h), optional Cloudflare Turnstile.
- [x] Private inbox at `/admin` (password, filter, status, delete, CSV).
- [x] Telegram alert for new submissions without personal data.
- [x] GDPR-style privacy notice (controller, purposes, legal bases,
      retention, recipients, rights, Cyprus authority).
- [x] Cloudflare deploy pipeline, CI with tests and a Docker smoke test.
- [x] "All rights reserved" licence.

## Needs the owner

- [ ] **Domain** — confirm the real domain (the site currently assumes
      `mbm-technologies.com`).
- [ ] **Company details** — legal name, registration number, registered
      address, public contact email, privacy email, LinkedIn/X/GitHub pages.
- [ ] **Cloudflare setup** — follow [DEPLOYMENT.md](DEPLOYMENT.md).
- [ ] **Legal review** of the privacy notice (retention periods, Telegram
      alerts, Cloudflare transfers) and of all CALIBRE / trading-lab wording
      (MiCA) before the site is public.
- [ ] **Content decisions** (see below).

## Content decisions

- [ ] Is **Nucleus Protocol** still a separate live programme, or an older
      name for CALIBRE? (Kept for now.)
- [ ] **Calibre Exchange** is described as a multichain exchange with bridges
      and solvers. How does it relate to the MBM DEX, and should "bridges"
      stay given CALIBRE's no-bridges direction?
- [ ] Should **Orbit City**, the **CALIBRE wallet** or the **developer
      SDKs** appear on the MBM site, or only on the CALIBRE website?
- [ ] Is the **Cyprus Blockchain Association** an MBM initiative or fully
      independent? The company page says "initiative", the portal says
      "independent".
- [ ] The three laboratory pictures look like generated illustrations. Replace
      them with real photos when available, or add a clear "illustration" note.
- [ ] Team / leadership section (names, photos, roles) — none yet.
