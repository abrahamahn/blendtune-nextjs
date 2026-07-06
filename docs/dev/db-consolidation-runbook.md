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

## After consolidation (my follow-up work)

Once you confirm §4, I will:
- Repoint the legacy `tracksPool` to the consolidated DB and then delete both `tracks.ts`/
  `auth.ts` pools in favour of the single `db` client (end of Phase 2).
- Proceed to Phase 1 migrations (`0100_tenants.sql`, …).
