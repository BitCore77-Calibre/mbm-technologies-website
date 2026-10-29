# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl util-linux \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY scripts ./scripts

RUN npm ci --no-audit --no-fund

COPY . .

ENV SITES_BUILD_TIMEOUT=8m
RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl util-linux \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    PORT=3000 \
    WRANGLER_WRITE_LOGS=false \
    WRANGLER_LOG_PATH=/app/.wrangler/logs \
    MINIFLARE_REGISTRY_PATH=/app/.wrangler/registry

COPY --from=build --chown=node:node /app /app

RUN mkdir -p /app/.wrangler/state /app/.wrangler/logs /app/.wrangler/registry \
    && chown -R node:node /app/.wrangler

USER node

EXPOSE 3000

HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "run", "docker:start"]
