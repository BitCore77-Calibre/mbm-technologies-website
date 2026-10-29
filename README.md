# MBM Technologies Website

Complete source code for the MBM Technologies corporate website.

The site presents MBM's cybersecurity, blockchain, artificial intelligence,
cryptography, DeFi, research, laboratories, projects, careers, talent-network,
and project-enquiry programmes. It includes the Calibre laboratory images and
the current portal links for Calibre Exchange, Calibre Swap, and the Cyprus
Blockchain Association.

## Fastest start with Docker

### Requirements

- Docker Engine 24 or newer
- Docker Compose v2

### Start

From this folder, run:

```bash
docker compose up --build -d
```

Open:

```text
http://localhost:3000
```

The first build downloads the locked Node.js packages and can take several
minutes. Later starts are faster.

### Check status and logs

```bash
docker compose ps
docker compose logs -f website
```

Press `Ctrl+C` to stop following the logs. The website continues running in
the background.

### Stop or restart

```bash
docker compose down
docker compose restart website
```

The registrations database is stored in the named Docker volume
`mbm-technologies-data`, so normal restarts and `docker compose down` do not
erase submissions.

To remove the containers and the locally stored registration data:

```bash
docker compose down -v
```

That last command deletes local form submissions, so use it only when you
intend to reset the local database.

## Use another port

Copy `.env.example` to `.env`, then change `MBM_WEB_PORT`:

```bash
cp .env.example .env
```

For example, `MBM_WEB_PORT=8080` makes the site available at
`http://localhost:8080`.

By default the container listens only on the local computer. To deliberately
make it reachable from other devices on the same network, set
`MBM_BIND_ADDRESS=0.0.0.0` and protect the service with the appropriate firewall
or reverse-proxy rules.

## Local development without Docker

Requirements:

- Node.js 22.13 or newer
- npm

```bash
npm ci
npm run dev
```

The development server is available at `http://localhost:5173` unless Vite
selects another free port.

## Production build check

```bash
npm ci
npm run build
```

The build produces the Cloudflare-compatible application in `dist/` and runs
the included artifact validation.

## Main project structure

```text
app/                    Website routes and pages
components/             Shared interface components and forms
db/                     Registration schema
drizzle/                SQL database migration
lib/                    Company, project, and portal content
public/                 Logo, laboratory images, and social preview
worker/                 Cloudflare Worker and registration API
scripts/                Build and validation scripts
tests/                  Rendered-output checks
Dockerfile              Container image definition
docker-compose.yml      One-command local deployment
```

## Local portal links

The company website uses port `3000`. Its current development gateway buttons
expect these separate services when they are running on the same computer:

- Calibre Exchange: `http://localhost:3001`
- Calibre Swap: `http://localhost:3030`

Those services are separate projects and are not bundled into this website
archive.

## Technology stack

- TypeScript
- React 19
- Next.js 16-compatible Vinext runtime
- Tailwind CSS 4
- Cloudflare Workers runtime
- Cloudflare D1-compatible local SQLite storage
- Drizzle schema and migration
