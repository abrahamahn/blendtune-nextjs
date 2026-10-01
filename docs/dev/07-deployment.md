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
                PostgreSQL     Droplet /media files
                  (RLS)        audio + images via Caddy
```

There is no separate frontend host or build step. The SPA is a static Vite bundle; the server hosts
it directly.

> The full production cutover procedure is recorded in `bslt-cutover-runbook.md`.

## Environment Setup

### Prerequisites

1. DigitalOcean droplet with SSH access
2. Node.js 24 and the pinned pnpm 10.26.2 on the build workstation
3. PostgreSQL (reachable from the droplet)
4. Droplet-hosted public audio/images at `https://blendtune.com/media`
5. SMTP credentials (transactional email)
6. Caddy (Docker) and Cloudflare for the domain

## Build & Release

Push to `main`. The workstation's `droplet-app-deploy.timer` polls accepted GitHub
commits, performs a frozen dependency install, type/lint/unit/build checks, and
publishes immutable artifacts over SSH to `digital-ocean` (`143.198.174.88`).
No GitHub Actions or on-droplet build is needed. WSL must be online; the queue
catches missed pushes when it resumes. Do not commit built output or production
environment files. A failed gate keeps the current app unchanged.

```bash
bash /home/abe/projects/ops/auto-deploy/run.sh status blendtune
bash /home/abe/projects/ops/auto-deploy/run.sh run blendtune --force
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

The installer retains prior releases and restores the prior application on failed
public checks. `/var/www/blendtune` selects an immutable private release, and its
existing runtime environment is preserved. Caddy does not change during app
deployment. SQL migration changes are held for backup/review rather than applied
automatically; an application rollback never undoes database changes.

## Reverse Proxy (Caddy + Cloudflare)

Caddy (running in Docker) proxies `blendtune.com` → `:8080`. The route block lives at
`infra/caddy/blendtune.caddy`; append/import it into the Caddyfile and reload.

- Cloudflare SSL mode must be **Full** (the origin certificate is self-signed).
- Cloudflare sits in front for CDN/DNS/TLS termination.

## Database

Single PostgreSQL database with Row-Level Security. Migrations are numbered SQL files in
`main/server/db/src/migrations/`. Review and back up the database before applying them:

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

# Public file origin (default; no Spaces credentials required)
MEDIA_ORIGIN=https://blendtune.com/media

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
- Check `https://blendtune.com/media` and the local `blendtune-media-publish.timer`.
- New files under the sibling `blendtune-s3` public directories sync over SSH every 15 minutes.
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
