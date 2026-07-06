-- 0500_refresh_tokens.sql
--
-- Opaque rotating refresh tokens (mirrors bslt's refresh_tokens, adapted to the
-- auth schema and auth.users(uuid) FK). Only the SHA-256 hash of a token is
-- stored; rotated rows are kept until expiry for reuse detection.
--
-- Depends on: 0000_baseline.sql (pgcrypto, auth schema).

CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL REFERENCES auth.users(uuid) ON DELETE CASCADE,
    token_hash           TEXT UNIQUE NOT NULL,
    family_id            UUID NOT NULL,
    rotated_at           TIMESTAMPTZ,
    family_revoked_at    TIMESTAMPTZ,
    family_revoke_reason TEXT,
    user_agent           TEXT,
    ip                   TEXT,
    expires_at           TIMESTAMPTZ NOT NULL,
    created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON auth.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family_id ON auth.refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON auth.refresh_tokens(expires_at);
