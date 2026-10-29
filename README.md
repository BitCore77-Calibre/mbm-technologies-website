# MBM Technologies Website

Corporate website of MBM Technologies: capabilities, the CALIBRE post-quantum
network and laboratories, projects, research, careers and project enquiries.

- **Public website:** runs on Cloudflare Workers (see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)).
- **On your own computer:** runs in Docker with one command (below).
- **What is still needed before launch:** [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md).

## Run it on your computer (Docker)

Requirements: Docker Engine 24+ with Docker Compose v2.

```bash
cd ~/mbm-technologies-website && cp -n .env.example .env
```

```bash
cd ~/mbm-technologies-website && docker compose up --build -d
```

Open <http://localhost:3000>.

Check it is running, or watch the log (press `Ctrl+C` to stop watching):

```bash
cd ~/mbm-technologies-website && docker compose ps
```

```bash
cd ~/mbm-technologies-website && docker compose logs -f website
```

Stop it:

```bash
cd ~/mbm-technologies-website && docker compose down
```

Form submissions are kept in the Docker volume `mbm-technologies-data`, so
restarts and `docker compose down` keep them. `docker compose down -v`
deletes them.

After changing anything in `.env`, rebuild:

```bash
cd ~/mbm-technologies-website && docker compose up --build -d
```

### Settings (`.env`)

Everything is explained inside [.env.example](.env.example). The most useful:

| Setting | What it does |
| --- | --- |
| `MBM_WEB_PORT` | Port on your computer (default 3000). |
| `VITE_SHOW_LOCAL_PORTALS` | `true` shows buttons to Calibre Exchange (:3001) and Swap (:3030) running on the same computer. Always `false` on the public site. |
| `VITE_CALIBRE_WEBSITE_URL` | Public CALIBRE website address, once it has a domain. |
| `VITE_COMPANY_*`, `VITE_CONTACT_EMAIL` | Company details shown in the footer, contact page and privacy notice. |
| `ADMIN_PASSWORD` | Turns on the private inbox at `/admin` (12+ characters). |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Telegram alert for each new submission (no personal data in the alert). |
| `VITE_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Cloudflare spam check on the forms. |

## Reading form submissions

Set `ADMIN_PASSWORD` in `.env`, rebuild, then open <http://localhost:3000/admin>.
The browser asks for a user name (type anything, e.g. `admin`) and the password.
You can filter, change the status (new → reviewed → contacted → archived),
delete a submission (for privacy requests) and download everything as CSV.

## For developers

Requirements: Node.js 22.13+ and npm.

```bash
npm ci
npm run dev        # development server with hot reload
npm test           # production build + automated tests
npm run lint
```

Project layout:

```text
app/            Pages (Next.js App Router conventions, run by vinext on Vite)
components/     Shared interface components and the forms
lib/content.ts  All programme, project, laboratory and role texts
lib/site-config.ts  Site address, sister-site links, company details
worker/         Cloudflare Worker: form API, admin inbox, security headers, SEO
db/, drizzle/   Database schema and migrations (Cloudflare D1 / SQLite)
public/         Logo, images, social preview
tests/          Automated tests against the built Worker
.github/        CI (build, tests, Docker smoke test) and Cloudflare deploy
```

Technology: TypeScript, React 19, vinext (Next.js-compatible on Vite),
Tailwind CSS 4, Cloudflare Workers + D1, Drizzle.

## Licence

Proprietary — all rights reserved. See [LICENSE](LICENSE).
