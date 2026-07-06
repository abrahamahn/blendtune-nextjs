-- 0600_profile_on_users.sql
-- Consolidate users.profile onto auth.users (bslt inlines profile fields on the users
-- table). auth.users already carries first_name/last_name/email/username, so only the
-- profile-specific data columns are added; types mirror the legacy users.profile
-- definition (all text except date_of_birth date and the boolean flags).
--
-- Null semantics (behavior pin): the old queries returned NO row when a user had no
-- users.profile row (check-session -> 401, /api/account -> 404). profile_created is
-- therefore added as a NULLABLE boolean with no default: NULL means "no legacy
-- users.profile row existed", and the profile repository filters
-- `profile_created IS NOT NULL`, faithfully reproducing the missing-row behavior.
-- Users that had a profile row keep their true/false value from migration 0300.
--
-- users.profile is retired but intentionally NOT dropped (kept as an inert backup).

ALTER TABLE auth.users
  ADD COLUMN IF NOT EXISTS artist_creator_name text,
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS user_type text,
  ADD COLUMN IF NOT EXISTS occupation text,
  ADD COLUMN IF NOT EXISTS preferred_language text,
  ADD COLUMN IF NOT EXISTS marketing_consent boolean,
  ADD COLUMN IF NOT EXISTS profile_created boolean;

-- Backfill from the retired table (join key: users.profile.user_id = auth.users.uuid,
-- the key every profile repository query used).
UPDATE auth.users u
SET artist_creator_name = p.artist_creator_name,
    phone_number        = p.phone_number,
    gender              = p.gender,
    date_of_birth       = p.date_of_birth,
    city                = p.city,
    state               = p.state,
    country             = p.country,
    user_type           = p.user_type,
    occupation          = p.occupation,
    preferred_language  = p.preferred_language,
    marketing_consent   = p.marketing_consent,
    profile_created     = p.profile_created
FROM users.profile p
WHERE p.user_id = u.uuid;
