# Deployment Guide

How Blendtune is deployed to production.

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Environment Setup](#environment-setup)
3. [Build & Release](#build--release)
4. [Process Management (PM2)](#process-management-pm2)
5. [Reverse Proxy (Caddy + Cloudflare)](#reverse-proxy-caddy--cloudflare)
6. [Database](#database)
7. [Environment Variables](#environment-variables)
8. [Monitoring & Logging](#monitoring--logging)
9. [Troubleshooting](#troubleshooting)

## Deployment Overview

Blendtune runs on a **single DigitalOcean droplet** as one Fastify process that serves both the API
and the built SPA (single origin). Caddy reverse-proxies the public domain to it, with Cloudflare in
front.

```
Cloudflare (Full SSL)
      │
      ▼
   Caddy (Docker)  ──►  Fastify  blendtune-api  (PM2, :8080)
                            │        serves /api/* AND the SPA (main/apps/web/dist)
                     ┌──────┴───────┐
                     ▼              ▼
                PostgreSQL     DO Spaces (CDN)
                  (RLS)        audio + images
```

There is no separate frontend host or build step. The SPA is a static Vite bundle; the server hosts
it directly.

> The full production cutover procedure is recorded in `bslt-cutover-runbook.md`.

## Environment Setup

### Prerequisites

1. DigitalOcean droplet with SSH access
2. Node.js 20+ and pnpm 9+ on the droplet
3. PostgreSQL (reachable from the droplet)
4. DigitalOcean Spaces (audio/image storage + CDN)
5. SMTP credentials (transactional email)
6. Caddy (Docker) and Cloudflare for the domain

## Build & Release

Deploy by syncing the repo to the droplet and building the SPA there. Do not commit
`main/apps/web/dist` or the production env file.

```bash
# From local: sync source (exclude build artifacts and secrets)
rsync -az --delete -e ssh \
  --exclude node_modules --exclude .git \
  --exclude 'main/apps/web/dist' \
  --exclude 'main/shared/src/config/.env.production' \
  ./ blendtune-droplet:/var/www/blendtune/

# On the droplet
cd /var/www/blendtune
pnpm install
pnpm build:web        # -> main/apps/web/dist
pnpm db:migrate       # apply any pending migrations
```

## Process Management (PM2)

The Fastify server runs under PM2 as `blendtune-api` (config: `infra/ecosystem.bslt.config.js`),
listening on `:8080` and serving the SPA + `/api`.

```bash
pm2 start infra/ecosystem.bslt.config.js
curl -s localhost:8080/health           # {"ok":true}
curl -s localhost:8080/api/tracks        # catalog JSON
pm2 save
```

### Rollback

Restart the previous release's process (or redeploy the prior commit) and reload Caddy. Additive
migrations (no drops) require no rollback.

## Reverse Proxy (Caddy + Cloudflare)

Caddy (running in Docker) proxies `blendtune.com` → `:8080`. The route block lives at
`infra/caddy/blendtune.caddy`; append/import it into the Caddyfile and reload.

- Cloudflare SSL mode must be **Full** (the origin certificate is self-signed).
- Cloudflare sits in front for CDN/DNS/TLS termination.

## Database

Single PostgreSQL database with Row-Level Security. Migrations are numbered SQL files in
`main/server/db/src/migrations/` applied by the runner:

```bash
pnpm db:migrate       # apply pending
pnpm db:migrate:dry   # preview
pnpm db:status        # inspect applied state
```

Superuser-only migrations (e.g. RLS policy or DDL changes) can be applied directly with
`psql -f <migration>` when required — see the database runbook.

## Environment Variables

Production values live in `main/shared/src/config/.env.production` on the droplet (never committed).
Required:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/blendtune

# Auth
JWT_SECRET=<random string, >=32 chars>
ACCESS_TOKEN_TTL=15m

# Server
API_PORT=8080
API_HOST=127.0.0.1

# Object storage (DigitalOcean Spaces)
DO_SPACES_KEY=...
DO_SPACES_SECRET=...
DO_SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
DO_SPACES_BUCKET=...

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
```

The server fails fast at startup if `JWT_SECRET` is missing or shorter than 32 characters.

### Generating the JWT secret

```bash
openssl rand -hex 32
```

## Monitoring & Logging

- **Application logs:** Fastify (Pino-style) structured logs, viewable via `pm2 logs blendtune-api`.
- **Process health:** `pm2 status` / `pm2 monit`; the `/health` endpoint returns `{"ok":true}`.
- **Uptime:** external checks against `https://blendtune.com/health`.

## Troubleshooting

### Server won't start
- Check `JWT_SECRET` is set (≥32 chars) in the production env.
- `pm2 logs blendtune-api` for the stack trace.
- Verify `main/apps/web/dist` exists (run `pnpm build:web`).

### Database connection issues
- Verify `DATABASE_URL` and that Postgres is reachable from the droplet.
- Confirm migrations are applied: `pnpm db:status`.

### Audio not loading
- Check DO Spaces credentials and CDN URL.
- Verify Spaces CORS allows the origin.
- Inspect the browser console and the `/api/media` (streaming) responses.

### Domain not resolving / TLS errors
- Confirm Cloudflare SSL mode is **Full**.
- Check the Caddy route block and reload Caddy.
- Verify Caddy is proxying to the correct droplet gateway IP.

## Post-Deployment Checklist

- [ ] Migrations applied (`pnpm db:status`)
- [ ] SPA built (`main/apps/web/dist` present)
- [ ] `blendtune-api` running under PM2, `/health` green
- [ ] `/api/tracks` returns catalog JSON
- [ ] Caddy routing + Cloudflare Full SSL active
- [ ] Full auth flow works (signup, verify, login, refresh)
- [ ] Audio playback works
- [ ] Email sending works

---

See [02-architecture.md](./02-architecture.md) for the system design and `bslt-cutover-runbook.md`
for the original migration steps.
