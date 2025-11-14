# Database Schema Documentation

Complete reference for Blendtune's PostgreSQL database schema.

## Overview

Blendtune uses PostgreSQL with three separate schemas for logical separation:

1. **meekah** - Track metadata and music catalog
2. **auth** - User authentication and sessions
3. **users** - User profiles and application data

## Database Configuration

**PostgreSQL Version**: 14+
**Character Set**: UTF-8
**Timezone**: UTC

### Connection Pools

Three separate connection pools are maintained:

```typescript
// Tracks database (meekah schema)
TRACKS_DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=meekah

// Auth database (auth schema)
AUTH_DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=auth

// Users database (users schema)
USERS_DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=users
```

---

## Schema: meekah (Track Data)

### Table: track_info

Primary table containing track metadata.

```sql
CREATE TABLE meekah.track_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  duration INTEGER NOT NULL, -- in seconds
  tempo INTEGER, -- BPM
  musical_key VARCHAR(10), -- e.g., 'C', 'D#', 'A'
  scale VARCHAR(10), -- 'major' or 'minor'
  genre VARCHAR(100),
  subgenre VARCHAR(100),
  mood VARCHAR(255)[], -- array of mood tags
  tags VARCHAR(100)[], -- array of general tags
  description TEXT,
  audio_filename VARCHAR(255) NOT NULL UNIQUE,
  cover_art_url VARCHAR(500),
  catalog_number VARCHAR(50),
  isrc VARCHAR(20),
  release_date DATE,
  popularity_score NUMERIC(5,2) DEFAULT 0,
  play_count BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_track_genre ON meekah.track_info(genre);
CREATE INDEX idx_track_tempo ON meekah.track_info(tempo);
CREATE INDEX idx_track_key ON meekah.track_info(musical_key);
CREATE INDEX idx_track_scale ON meekah.track_info(scale);
CREATE INDEX idx_track_release_date ON meekah.track_info(release_date);
CREATE INDEX idx_track_mood ON meekah.track_info USING GIN(mood);
CREATE INDEX idx_track_tags ON meekah.track_info USING GIN(tags);

-- Composite index for common filter combinations
CREATE INDEX idx_track_filters ON meekah.track_info(genre, tempo, musical_key);
```

**Example Row**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Summer Vibes",
  "artist": "John Producer",
  "duration": 180,
  "tempo": 120,
  "musical_key": "C",
  "scale": "major",
  "genre": "Electronic",
  "subgenre": "House",
  "mood": ["uplifting", "energetic", "summer"],
  "tags": ["synth", "dance", "party"],
  "description": "Uplifting house track perfect for summer videos",
  "audio_filename": "summer-vibes-120bpm-cmaj.mp3",
  "cover_art_url": "https://cdn.example.com/covers/summer-vibes.jpg",
  "catalog_number": "BT-2024-001",
  "isrc": "USXXX2400001",
  "release_date": "2024-01-15",
  "popularity_score": 87.5,
  "play_count": 1523,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

---

### Table: track_arrangement

Song sections with timestamps for detailed track structure.

```sql
CREATE TABLE meekah.track_arrangement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES meekah.track_info(id) ON DELETE CASCADE,
  section_name VARCHAR(50) NOT NULL, -- 'intro', 'verse', 'chorus', 'bridge', 'outro'
  start_time INTEGER NOT NULL, -- seconds from start
  end_time INTEGER NOT NULL, -- seconds from start
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_arrangement_track ON meekah.track_arrangement(track_id);
CREATE INDEX idx_arrangement_section ON meekah.track_arrangement(section_name);
```

**Example Rows**:

```json
[
  {
    "id": "...",
    "track_id": "550e8400-e29b-41d4-a716-446655440000",
    "section_name": "intro",
    "start_time": 0,
    "end_time": 8,
    "description": "Ambient synth introduction"
  },
  {
    "id": "...",
    "track_id": "550e8400-e29b-41d4-a716-446655440000",
    "section_name": "verse",
    "start_time": 8,
    "end_time": 32,
    "description": "Main melodic theme"
  },
  {
    "id": "...",
    "track_id": "550e8400-e29b-41d4-a716-446655440000",
    "section_name": "chorus",
    "start_time": 32,
    "end_time": 64,
    "description": "Full instrumentation, energetic"
  }
]
```

---

### Table: track_creator

Creator and rights holder information.

```sql
CREATE TABLE meekah.track_creator (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES meekah.track_info(id) ON DELETE CASCADE,
  creator_name VARCHAR(255) NOT NULL,
  role VARCHAR(100), -- 'producer', 'composer', 'songwriter', 'performer'
  ipi_number VARCHAR(20), -- Interested Party Information number
  pro VARCHAR(100), -- Performing Rights Organization (ASCAP, BMI, etc.)
  split_percentage NUMERIC(5,2), -- ownership percentage
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_creator_track ON meekah.track_creator(track_id);
CREATE INDEX idx_creator_name ON meekah.track_creator(creator_name);
CREATE INDEX idx_creator_ipi ON meekah.track_creator(ipi_number);
```

**Example Row**:

```json
{
  "id": "...",
  "track_id": "550e8400-e29b-41d4-a716-446655440000",
  "creator_name": "John Producer",
  "role": "producer",
  "ipi_number": "00123456789",
  "pro": "ASCAP",
  "split_percentage": 50.00,
  "contact_email": "john@example.com",
  "contact_phone": "+1-555-0100",
  "created_at": "2024-01-15T10:00:00Z"
}
```

---

### Table: track_instrument

Instruments featured in each track.

```sql
CREATE TABLE meekah.track_instrument (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES meekah.track_info(id) ON DELETE CASCADE,
  instrument_category VARCHAR(100), -- 'synth', 'drums', 'bass', 'guitar', 'vocals'
  instrument_type VARCHAR(100), -- specific type, e.g., '808', 'electric guitar'
  is_primary BOOLEAN DEFAULT FALSE, -- main instrument in the track
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_instrument_track ON meekah.track_instrument(track_id);
CREATE INDEX idx_instrument_category ON meekah.track_instrument(instrument_category);
CREATE INDEX idx_instrument_primary ON meekah.track_instrument(is_primary);
```

**Example Rows**:

```json
[
  {
    "id": "...",
    "track_id": "550e8400-e29b-41d4-a716-446655440000",
    "instrument_category": "synth",
    "instrument_type": "analog synth",
    "is_primary": true
  },
  {
    "id": "...",
    "track_id": "550e8400-e29b-41d4-a716-446655440000",
    "instrument_category": "drums",
    "instrument_type": "electronic drums",
    "is_primary": false
  }
]
```

---

### Table: track_sample

Sample pack and clearance information.

```sql
CREATE TABLE meekah.track_sample (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES meekah.track_info(id) ON DELETE CASCADE,
  sample_pack_name VARCHAR(255),
  sample_description TEXT,
  is_cleared BOOLEAN DEFAULT FALSE,
  clearance_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sample_track ON meekah.track_sample(track_id);
CREATE INDEX idx_sample_cleared ON meekah.track_sample(is_cleared);
```

---

## Schema: auth (Authentication)

### Table: users

Core user authentication data.

```sql
CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- bcrypt hash
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_users_email ON auth.users(LOWER(email));
CREATE INDEX idx_users_verified ON auth.users(email_verified);
```

**Example Row**:

```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "password_hash": "$2b$10$...",
  "email_verified": true,
  "email_verified_at": "2024-01-15T12:00:00Z",
  "failed_login_attempts": 0,
  "locked_until": null,
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

---

### Table: sessions

Active user sessions.

```sql
CREATE TABLE auth.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45), -- IPv6 compatible
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  last_activity TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX idx_sessions_token ON auth.sessions(token);
CREATE INDEX idx_sessions_user ON auth.sessions(user_id);
CREATE INDEX idx_sessions_expires ON auth.sessions(expires_at);
CREATE INDEX idx_sessions_activity ON auth.sessions(last_activity);
```

**Cleanup Query** (runs daily via cron):

```sql
DELETE FROM auth.sessions WHERE expires_at < NOW();
```

**Example Row**:

```json
{
  "id": "session-uuid",
  "user_id": "user-uuid",
  "token": "secure-random-token",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "created_at": "2024-01-15T10:00:00Z",
  "expires_at": "2024-01-22T10:00:00Z",
  "last_activity": "2024-01-15T15:30:00Z"
}
```

---

### Table: email_verification

Email verification tokens.

```sql
CREATE TABLE auth.email_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP
);

-- Indexes
CREATE UNIQUE INDEX idx_email_verification_token ON auth.email_verification(token);
CREATE INDEX idx_email_verification_user ON auth.email_verification(user_id);
CREATE INDEX idx_email_verification_expires ON auth.email_verification(expires_at);
```

**Token Expiration**: 24 hours

---

### Table: password_reset

Password reset tokens.

```sql
CREATE TABLE auth.password_reset (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP
);

-- Indexes
CREATE UNIQUE INDEX idx_password_reset_token ON auth.password_reset(token);
CREATE INDEX idx_password_reset_user ON auth.password_reset(user_id);
CREATE INDEX idx_password_reset_expires ON auth.password_reset(expires_at);
```

**Token Expiration**: 1 hour

---

## Schema: users (User Profiles & App Data)

### Table: profile

Extended user profile information.

```sql
CREATE TABLE users.profile (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(500),
  country VARCHAR(100),
  timezone VARCHAR(100),
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profile_display_name ON users.profile(display_name);
```

**Example Row**:

```json
{
  "user_id": "user-uuid",
  "first_name": "John",
  "last_name": "Doe",
  "display_name": "John D.",
  "bio": "Music enthusiast and video creator",
  "avatar_url": "https://cdn.example.com/avatars/user.jpg",
  "country": "United States",
  "timezone": "America/New_York",
  "language": "en",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

---

### Table: roles

User role assignments.

```sql
CREATE TABLE users.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- 'admin', 'user', 'artist', 'moderator'
  granted_at TIMESTAMP DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_roles_user ON users.roles(user_id);
CREATE INDEX idx_roles_role ON users.roles(role);
```

**Default Role**: 'user'

---

### Table: subscription (Planned)

User subscription and billing information.

```sql
CREATE TABLE users.subscription (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL, -- 'free', 'pro', 'enterprise'
  status VARCHAR(50) NOT NULL, -- 'active', 'cancelled', 'expired', 'past_due'
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscription_user ON users.subscription(user_id);
CREATE INDEX idx_subscription_status ON users.subscription(status);
CREATE INDEX idx_subscription_stripe_id ON users.subscription(stripe_subscription_id);
```

---

### Table: playlists (Planned)

User-created playlists.

```sql
CREATE TABLE users.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  is_collaborative BOOLEAN DEFAULT FALSE,
  cover_image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_playlists_user ON users.playlists(user_id);
CREATE INDEX idx_playlists_public ON users.playlists(is_public);
```

---

### Table: playlist_tracks (Planned)

Tracks in playlists with ordering.

```sql
CREATE TABLE users.playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES users.playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES meekah.track_info(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_playlist_tracks_playlist ON users.playlist_tracks(playlist_id);
CREATE INDEX idx_playlist_tracks_track ON users.playlist_tracks(track_id);
CREATE UNIQUE INDEX idx_playlist_tracks_unique ON users.playlist_tracks(playlist_id, track_id);
```

---

## Common Queries

### Get Tracks with Filters

```sql
SELECT
  t.*,
  ARRAY_AGG(DISTINCT i.instrument_category) as instruments,
  ARRAY_AGG(DISTINCT c.creator_name) as creators
FROM meekah.track_info t
LEFT JOIN meekah.track_instrument i ON t.id = i.track_id
LEFT JOIN meekah.track_creator c ON t.id = c.track_id
WHERE
  t.genre = $1
  AND t.tempo BETWEEN $2 AND $3
  AND t.musical_key = $4
GROUP BY t.id
ORDER BY t.popularity_score DESC
LIMIT 50;
```

### Get Track with Full Details

```sql
SELECT
  t.*,
  JSON_AGG(DISTINCT jsonb_build_object(
    'section', a.section_name,
    'startTime', a.start_time,
    'endTime', a.end_time
  )) as arrangement,
  JSON_AGG(DISTINCT jsonb_build_object(
    'name', c.creator_name,
    'role', c.role,
    'ipi', c.ipi_number
  )) as creators,
  JSON_AGG(DISTINCT jsonb_build_object(
    'category', i.instrument_category,
    'type', i.instrument_type
  )) as instruments
FROM meekah.track_info t
LEFT JOIN meekah.track_arrangement a ON t.id = a.track_id
LEFT JOIN meekah.track_creator c ON t.id = c.track_id
LEFT JOIN meekah.track_instrument i ON t.id = i.track_id
WHERE t.id = $1
GROUP BY t.id;
```

### Authenticate User

```sql
SELECT id, email, password_hash, email_verified
FROM auth.users
WHERE LOWER(email) = LOWER($1)
AND locked_until IS NULL OR locked_until < NOW();
```

### Validate Session

```sql
SELECT s.*, u.email, u.email_verified
FROM auth.sessions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.token = $1
AND s.expires_at > NOW();
```

---

## Migration Strategy

### Creating New Migrations

1. Use sequential numbering: `001_initial_schema.sql`, `002_add_playlists.sql`
2. Include both `up` and `down` migrations
3. Test migrations on development database first
4. Backup production data before running migrations

### Example Migration File

```sql
-- Migration: 002_add_playlists.sql
-- Description: Add playlist and playlist_tracks tables

-- UP
BEGIN;

CREATE TABLE users.playlists (
  -- table definition
);

CREATE TABLE users.playlist_tracks (
  -- table definition
);

COMMIT;

-- DOWN (rollback)
-- BEGIN;
-- DROP TABLE users.playlist_tracks;
-- DROP TABLE users.playlists;
-- COMMIT;
```

---

## Backup & Maintenance

### Backup Commands

```bash
# Full backup
pg_dump -U postgres -d blendtune > backup_$(date +%Y%m%d).sql

# Schema-only backup
pg_dump -U postgres -d blendtune -n meekah --schema-only > meekah_schema.sql

# Data-only backup
pg_dump -U postgres -d blendtune -n meekah --data-only > meekah_data.sql
```

### Maintenance Tasks

```sql
-- Analyze tables for query optimization
ANALYZE meekah.track_info;
ANALYZE auth.sessions;

-- Vacuum to reclaim storage
VACUUM ANALYZE;

-- Reindex for performance
REINDEX TABLE meekah.track_info;
```

---

## Performance Tuning

### Recommended PostgreSQL Settings

```ini
# postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB
maintenance_work_mem = 64MB
max_connections = 100
```

### Query Performance

Monitor slow queries:

```sql
-- Enable slow query logging
ALTER DATABASE blendtune SET log_min_duration_statement = 1000;

-- View slow queries
SELECT * FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

**Last Updated**: January 2025
