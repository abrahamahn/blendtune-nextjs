# DB Consolidation Runbook (Phase 0)

> **You run this against your real database — I cannot reach it.** It is the one destructive
> step in Phase 0. Take a full backup first. After it succeeds, the app points at a single
> database and Phase 1 (tenancy) can proceed.

## Why

Blendtune currently uses **two databases**: `PG_*_DB_TRACKS` (schema `meekah`) and
`PG_*_DB_USERS` (schemas `auth`, `users`). PostgreSQL cannot enforce foreign keys or
Row-Level Security across databases, and the creator-marketplace model needs
`track → tenant → owner(user)` integrity. We therefore move `meekah` **into the users
database**, keeping all three schemas as namespaces (matches bslt's single-DB model).

## 0. Back up both databases

```bash
pg_dump "$USERS_DSN"  -Fc -f blendtune_users_$(date +%F).dump
pg_dump "$TRACKS_DSN" -Fc -f blendtune_tracks_$(date +%F).dump
```
`*_DSN` = a full `postgres://user:pw@host:port/dbname` for each database.

## 1. Copy the `meekah` schema into the users database

The `meekah` schema is self-contained (no cross-schema FKs today), so a schema-only move is safe.

```bash
# Dump just the meekah schema from the TRACKS database...
pg_dump "$TRACKS_DSN" --schema=meekah -Fc -f meekah_only.dump

# ...and restore it into the USERS database (now the single consolidated DB).
pg_restore --dbname="$USERS_DSN" --no-owner --no-privileges meekah_only.dump
```

Verify:
```bash
psql "$USERS_DSN" -c "\dn"                                   # expect: auth, users, meekah
psql "$USERS_DSN" -c "SELECT count(*) FROM meekah.track_info;"  # matches the old tracks DB
```

> Note: `meekah.track_info` is queried by the app as a table/view. If it is a **view** in the
> tracks DB, dump/restore recreates it, but confirm its dependencies came across:
> `psql "$USERS_DSN" -c "\dv meekah.*"`.

## 2. Point the app at the single database

Set the consolidated DB name (the code prefers these; falls back to `*_DB_USERS`):

```dotenv
# .env  — consolidated database (was PG_LOCAL_DB_USERS)
PG_LOCAL_DB=blendtune          # local
PG_CLOUD_DB=blendtune          # production
# Or, equivalently, a single DSN (bslt-parity, takes precedence):
# DATABASE_URL=postgres://user:pw@host:5432/blendtune
```

You can now remove `PG_*_DB_TRACKS` from the environment once §3 confirms nothing reads it.

## 3. Baseline the migration history

```bash
pnpm db:migrate        # records 0000_baseline (idempotent); creates the `migrations` table
```
Expected: `0000_baseline.sql` applied (or skipped on re-run). No data change.

## 4. Verify the app still works

- `pnpm dev`, hit `/api/tracks` — tracks still load (now from the consolidated DB).
- Sign in — auth/session still works.

## Rollback

Nothing in this runbook drops the original databases. To roll back, restore `.env` to the
two-DB values; the old `TRACKS` database is untouched. Drop the copied schema only if needed:
`psql "$USERS_DSN" -c "DROP SCHEMA meekah CASCADE;"` (destructive — re-restore from §0 backup).

## App DB role for RLS (Phase 3)

Row-Level Security is bypassed for superusers and table owners, so the app must connect as a
dedicated **non-superuser** role. After migrations (incl. `0900_rls.sql`, which creates the
`authenticated` group role + policies) are applied:

```bash
APPW=$(openssl rand -hex 16)          # save this
psql "$USERS_DSN" -c "CREATE ROLE blendtune_app LOGIN NOSUPERUSER NOBYPASSRLS PASSWORD '$APPW';"
psql "$USERS_DSN" -c "GRANT authenticated TO blendtune_app;"   # inherits table grants + policies
```

Then point the app at it (`.env.production`): `PG_CLOUD_USER=blendtune_app`, `PG_CLOUD_PW=$APPW`,
and restart. RLS: marketplace reads are open; `meekah.*` writes require `app.tenant_id` (set by
`RawDb.withSession`). Superuser `abe` is retained for migrations only.

> Gotcha: apply RLS migrations with the app briefly stopped (`pm2 stop`) — `ENABLE ROW LEVEL
> SECURITY` needs an ACCESS EXCLUSIVE lock that starves behind live `/api/tracks` reads. And run
> migrations via `psql -f`, not `pnpm db:migrate` (pnpm v11's pre-script deps check stalls).

## After consolidation (my follow-up work)

Once you confirm §4, I will:
- Repoint the legacy `tracksPool` to the consolidated DB and then delete both `tracks.ts`/
  `auth.ts` pools in favour of the single `db` client (end of Phase 2).
- Proceed to Phase 1 migrations (`0100_tenants.sql`, …).
