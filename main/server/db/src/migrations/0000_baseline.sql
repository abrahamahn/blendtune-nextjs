-- 0000_baseline.sql
-- Baseline marker for the consolidated Blendtune database.
--
-- The full table DDL for the pre-existing schemas (auth, users, meekah) is the
-- authoritative pair of dumps in db/blendtune_users_backup.sql and
-- db/blendtune_tracks_backup.sql, restored into a SINGLE database by the consolidation
-- runbook (docs/dev/db-consolidation-runbook.md). This migration only guarantees the
-- prerequisites those dumps and later tenancy migrations depend on, and is idempotent:
-- a no-op on the existing database, correct foundation on a fresh rebuild.

-- gen_random_uuid() (used by auth.users.uuid, auth.sessions, etc.)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- uuid_generate_v4() parity with bslt migrations.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS meekah;
