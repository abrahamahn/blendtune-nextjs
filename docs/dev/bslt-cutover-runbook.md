# bslt-stack cutover runbook (M5)

Cutover from the Next.js deploy to the bslt stack (Fastify API + static Vite SPA) on the
droplet, single-origin: one PM2 Fastify process serves both `/api` and the SPA; Caddy proxies
`blendtune.com` to it.

Prereqs: SSH access to the droplet (`ssh blendtune-droplet`, multiplexed alias) and the app DB
password at `/root/.blendtune_app_pw`.

## 1. Pre-deploy (local)
- `pnpm build:web` → `main/apps/web/dist` (verify it exists).
- Confirm the working tree is committed.

## 2. Droplet: env + migrations (app still on old Next build)
```bash
ssh blendtune-droplet
cd /var/www/blendtune
# add the JWT secret (>=32 chars) to the production env — NOT in git
echo 'JWT_SECRET="'"$(openssl rand -hex 32)"'"' >> main/shared/src/config/.env.production
echo 'ACCESS_TOKEN_TTL="15m"' >> main/shared/src/config/.env.production
# apply new migrations with the superuser (app briefly stopped is NOT required — additive DDL,
# but 0600 backfills, so run during low traffic). Use psql -f per the DB runbook.
sudo -u postgres psql -d blendtune -f main/server/db/src/migrations/0500_refresh_tokens.sql
sudo -u postgres psql -d blendtune -f main/server/db/src/migrations/0600_profile_on_users.sql
```

## 3. Deploy code + build on the droplet
```bash
# from local:
rsync -az --delete -e 'ssh' --exclude node_modules --exclude .next --exclude .git \
  --exclude 'main/apps/web/dist' --exclude 'main/shared/src/config/.env.production' \
  ./ blendtune-droplet:/var/www/blendtune/
# on droplet:
cd /var/www/blendtune
NODE_OPTIONS=--max-old-space-size=1280 pnpm install --config.dangerouslyAllowAllBuilds=true
NODE_OPTIONS=--max-old-space-size=1280 pnpm build:web    # -> main/apps/web/dist
```

## 4. Switch PM2 to the Fastify process
```bash
pm2 start infra/ecosystem.bslt.config.js     # starts blendtune-api on :8080 (serves SPA + /api)
curl -s localhost:8080/health                 # {"ok":true}
curl -s localhost:8080/api/tracks | md5sum    # expect 643bd5a8793a3bf4d3567a24953ab3e5
pm2 delete blendtune                          # stop the old Next process (frees :3000)
pm2 save
```

## 5. Caddy: route blendtune.com → :8080
Append `infra/caddy/blendtune.caddy` to the demo Caddyfile (or import it), then reload Caddy.
Confirm the bridge gateway IP first (`docker exec bslt-demo-caddy-1 sh -c 'ip route | grep default'`).
Ensure Cloudflare SSL mode = **Full** (origin cert is self-signed).

## 6. Verify live, then decommission Next
- `https://blendtune.com/` (SPA), `/sounds`, `/c/<slug>`, `/api/tracks`, full auth flow.
- Once green: remove Next.js deps and `src/app`, `src/middleware.ts`, `next.config.ts` (separate commit).

## Rollback
`pm2 start blendtune && pm2 delete blendtune-api` restores the Next deploy; revert the Caddy block.
Migrations 0500/0600 are additive (no drops) so they need no rollback.
