-- 0100_tenants.sql
--
-- Multi-tenancy: tenants, memberships, invitations, settings.
--
-- Mirrors bslt's main/server/db/migrations/0100_tenants.sql so these tables port into the
-- monorepo unchanged. The only Blendtune adaptation: owner/user FKs reference the existing
-- auth.users(uuid) instead of bslt's public.users(id). A "creator workspace" in the product
-- UI is exactly a row in `tenants`.
--
-- Depends on: 0000_baseline.sql (pgcrypto, uuid-ossp, schemas).

-- ============================================================================
-- Shared trigger function (bslt defines this in 0000_users.sql)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Enums
-- ============================================================================

CREATE TYPE tenant_role AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'revoked', 'expired');

-- ============================================================================
-- Tenants (creator workspaces / organizations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tenants (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                  TEXT NOT NULL,
    slug                  TEXT NOT NULL UNIQUE,
    logo_url              TEXT,
    owner_id              UUID NOT NULL REFERENCES auth.users(uuid) ON DELETE RESTRICT,
    is_active             BOOLEAN NOT NULL DEFAULT TRUE,
    allowed_email_domains TEXT[] NOT NULL DEFAULT '{}',
    metadata              JSONB NOT NULL DEFAULT '{}',
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT tenants_slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT tenants_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
    CONSTRAINT tenants_slug_length CHECK (char_length(slug) BETWEEN 1 AND 100)
);

CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================================
-- Memberships (user ↔ tenant with role)
-- ============================================================================

CREATE TABLE IF NOT EXISTS memberships (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES auth.users(uuid) ON DELETE CASCADE,
    role       tenant_role NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT memberships_tenant_user_unique UNIQUE (tenant_id, user_id)
);

CREATE TRIGGER update_memberships_updated_at
    BEFORE UPDATE ON memberships
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================================
-- Invitations (pending membership offers)
-- ============================================================================

CREATE TABLE IF NOT EXISTS invitations (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email         TEXT NOT NULL,
    role          tenant_role NOT NULL DEFAULT 'member',
    status        invitation_status NOT NULL DEFAULT 'pending',
    invited_by_id UUID NOT NULL REFERENCES auth.users(uuid) ON DELETE CASCADE,
    expires_at    TIMESTAMPTZ NOT NULL,
    accepted_at   TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT invitations_pending_unique UNIQUE (tenant_id, email)
);

-- ============================================================================
-- Tenant settings (key-value store per tenant)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tenant_settings (
    tenant_id  UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    key        TEXT NOT NULL,
    value      JSONB NOT NULL DEFAULT 'null',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (tenant_id, key),
    CONSTRAINT tenant_settings_key_format CHECK (key ~ '^[a-z][a-z0-9_\.]{0,63}$')
);

CREATE TRIGGER update_tenant_settings_updated_at
    BEFORE UPDATE ON tenant_settings
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX idx_tenants_owner  ON tenants(owner_id);
CREATE INDEX idx_tenants_slug   ON tenants(slug);
CREATE INDEX idx_tenants_active ON tenants(is_active) WHERE is_active = TRUE;

CREATE INDEX idx_memberships_tenant ON memberships(tenant_id);
CREATE INDEX idx_memberships_user   ON memberships(user_id);
CREATE INDEX idx_memberships_role   ON memberships(tenant_id, role);

CREATE INDEX idx_invitations_tenant     ON invitations(tenant_id);
CREATE INDEX idx_invitations_email      ON invitations(email);
CREATE INDEX idx_invitations_pending    ON invitations(tenant_id, status) WHERE status = 'pending';
CREATE INDEX idx_invitations_expires    ON invitations(expires_at) WHERE status = 'pending';
CREATE INDEX idx_invitations_invited_by ON invitations(invited_by_id);

CREATE INDEX idx_tenant_settings_key ON tenant_settings(key);
