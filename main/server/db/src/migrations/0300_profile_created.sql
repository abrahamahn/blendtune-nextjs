-- 0300_profile_created.sql
-- The app reads/writes users.profile.profile_created (session validation + profile updates),
-- but the restored backup predates that column, so authenticated check-session/account calls
-- errored. Add it idempotently. Independent of tenancy; kept here so a fresh restore is correct.

ALTER TABLE users.profile ADD COLUMN IF NOT EXISTS profile_created boolean NOT NULL DEFAULT false;
