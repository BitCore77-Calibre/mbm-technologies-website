# syntax=docker/dockerfile:1.7
# MBM Technologies website — local / self-hosted container.
# The public website runs on Cloudflare Workers (see docs/DEPLOYMENT.md);
# this image runs the same Worker locally with a local SQLite database.

FROM node:22-bookworm-slim AS build
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund

COPY . .

# Build-time settings (public, not secret). See .env.example.
ARG VITE_SITE_URL=""
ARG VITE_SHOW_LOCAL_PORTALS="true"
ARG VITE_CALIBRE_WEBSITE_URL=""
ARG VITE_CALIBRE_EXCHANGE_URL=""
ARG VITE_CALIBRE_SWAP_URL=""
ARG VITE_LOCAL_EXCHANGE_URL=""
ARG VITE_LOCAL_SWAP_URL=""
ARG VITE_TURNSTILE_SITE_KEY=""
ARG VITE_COMPANY_LEGAL_NAME=""
ARG VITE_COMPANY_REGISTRATION_NUMBER=""
ARG VITE_COMPANY_ADDRESS=""
ARG VITE_CONTACT_EMAIL=""
ARG VITE_PRIVACY_EMAIL=""
ARG VITE_LINKEDIN_URL=""
ARG VITE_GITHUB_URL=""
ARG VITE_X_URL=""
ENV VITE_SITE_URL=$VITE_SITE_URL \
    VITE_SHOW_LOCAL_PORTALS=$VITE_SHOW_LOCAL_PORTALS \
    VITE_CALIBRE_WEBSITE_URL=$VITE_CALIBRE_WEBSITE_URL \
    VITE_CALIBRE_EXCHANGE_URL=$VITE_CALIBRE_EXCHANGE_URL \
    VITE_CALIBRE_SWAP_URL=$VITE_CALIBRE_SWAP_URL \
    VITE_LOCAL_EXCHANGE_URL=$VITE_LOCAL_EXCHANGE_URL \
    VITE_LOCAL_SWAP_URL=$VITE_LOCAL_SWAP_URL \
    VITE_TURNSTILE_SITE_KEY=$VITE_TURNSTILE_SITE_KEY \
    VITE_COMPANY_LEGAL_NAME=$VITE_COMPANY_LEGAL_NAME \
    VITE_COMPANY_REGISTRATION_NUMBER=$VITE_COMPANY_REGISTRATION_NUMBER \
    VITE_COMPANY_ADDRESS=$VITE_COMPANY_ADDRESS \
    VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL \
    VITE_PRIVACY_EMAIL=$VITE_PRIVACY_EMAIL \
    VITE_LINKEDIN_URL=$VITE_LINKEDIN_URL \
    VITE_GITHUB_URL=$VITE_GITHUB_URL \
    VITE_X_URL=$VITE_X_URL

RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# CLOUDFLARE_INCLUDE_PROCESS_ENV passes container environment variables
# (ADMIN_PASSWORD, TELEGRAM_*, ...) to the Worker, so no secrets are baked
# into the image.
ENV NODE_ENV=production \
    PORT=3000 \
    CLOUDFLARE_INCLUDE_PROCESS_ENV=true \
    WRANGLER_SEND_METRICS=false \
    WRANGLER_WRITE_LOGS=false \
    WRANGLER_LOG_PATH=/app/.wrangler/logs \
    MINIFLARE_REGISTRY_PATH=/app/.wrangler/registry

COPY --from=build --chown=node:node /app /app

RUN mkdir -p /app/.wrangler/state /app/.wrangler/logs /app/.wrangler/registry \
    && chown -R node:node /app/.wrangler

USER node
EXPOSE 3000

HEALTHCHECK --interval=20s --timeout=5s --start-period=40s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "run", "docker:start"]
