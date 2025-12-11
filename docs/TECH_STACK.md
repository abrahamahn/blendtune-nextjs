# BlendTune Technology Stack

> Complete technology stack for BlendTune - A beat marketplace and DAW platform

**Version:** 2.0 (Migration Architecture)
**Last Updated:** December 2025
**Platform:** Web, Mobile (iOS/Android), Desktop (Windows/Mac/Linux)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Frontend Stack](#frontend-stack)
- [Audio Engine](#audio-engine)
- [Backend Stack](#backend-stack)
- [Database & Storage](#database--storage)
- [DevOps & Infrastructure](#devops--infrastructure)
- [Development Tools](#development-tools)
- [Security](#security)
- [Monitoring](#monitoring)
- [Complete Dependencies](#complete-dependencies)
- [Technology Decisions](#technology-decisions)

---

## Overview

BlendTune is a music platform with two main components:

1. **Beat Marketplace** - Browse, search, purchase, and stream instrumental beats
2. **DAW (Digital Audio Workstation)** - Record vocals, mix, master, and apply effects

### Target Platforms

- **Web** - Primary platform (marketplace + full DAW)
- **Desktop** - Electron wrapper (marketplace + full DAW)
- **Mobile** - iOS/Android via Expo (marketplace + basic DAW)

### Code Sharing Strategy

- **70-85%** code reuse across platforms
- Monorepo architecture with shared packages
- Platform-specific implementations for audio and UI where needed

---

## Architecture

### Monorepo Structure

```
blendtune/
├── apps/
│   ├── web/                 # Vite + React (marketplace + DAW)
│   ├── mobile/              # Expo (marketplace + limited DAW)
│   ├── desktop/             # Electron (marketplace + full DAW)
│   └── api/                 # Node.js backend
├── packages/
│   ├── ui/                  # Shared UI components (Tamagui)
│   ├── audio-engine/        # Cross-platform audio engine
│   │   ├── web/            # Web Audio API implementation
│   │   ├── mobile/         # React Native audio implementation
│   │   └── interface.ts    # Shared audio engine interface
│   ├── api-client/          # API client library
│   ├── shared-types/        # TypeScript types
│   ├── core/                # Business logic & utilities
│   │   ├── hooks/          # React hooks
│   │   ├── store/          # State management (Zustand)
│   │   └── utils/          # Pure functions
│   └── config/              # Shared configs (eslint, tsconfig)
├── infrastructure/          # Docker, K8s configs
└── docs/                    # Documentation
```

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND APPS                            │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Web (Vite)  │ Mobile (Expo)│Desktop (Electron)│ Admin      │
│  - Marketplace - Marketplace - Marketplace  │ - Dashboard   │
│  - Full DAW   - Basic DAW   - Full DAW      │ - Analytics   │
└──────┬───────┴──────┬───────┴──────┬───────┴────────────────┘
       │              │              │
       └──────────────┼──────────────┘
                      │ HTTPS/WSS
                      │
┌─────────────────────▼──────────────────────────────────────┐
│                   API GATEWAY / Load Balancer               │
│                   (Nginx or Cloudflare)                     │
└─────────────────────┬──────────────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────────────┐
│                 FASTIFY API SERVERS                         │
│  ┌────────────┬────────────┬────────────┬─────────────┐    │
│  │ REST API   │ WebSocket  │ Auth       │ File Upload │    │
│  │ Endpoints  │ (Socket.io)│ Service    │ Service     │    │
│  └────────────┴────────────┴────────────┴─────────────┘    │
└───┬─────────────┬──────────────┬────────────┬──────────────┘
    │             │              │            │
    │             │              │            │
┌───▼─────┐  ┌───▼──────┐  ┌───▼────┐  ┌───▼──────────┐
│PostgreSQL│  │  Redis   │  │BullMQ  │  │ Meilisearch  │
│ (Primary)│  │ (Cache + │  │(Jobs)  │  │  (Search)    │
│          │  │ Sessions)│  │        │  │              │
└──────────┘  └──────────┘  └────────┘  └──────────────┘
    │
    │
┌───▼──────────────────────────────────────────────────────┐
│              OBJECT STORAGE + CDN                         │
│  DigitalOcean Spaces / Cloudflare R2 → Cloudflare CDN    │
│  - Audio files (tracks, recordings, bounces)             │
│  - Images (artwork, avatars)                             │
│  - Waveform data                                         │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              BACKGROUND WORKERS                           │
│  ┌──────────────┬──────────────┬──────────────────────┐  │
│  │ Audio        │ Email        │ Analytics            │  │
│  │ Processing   │ Worker       │ Worker               │  │
│  │ (FFmpeg)     │              │                      │  │
│  └──────────────┴──────────────┴──────────────────────┘  │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│           MONITORING & OBSERVABILITY                      │
│  Sentry | Better Stack | BetterUptime | PostHog          │
└──────────────────────────────────────────────────────────┘
```

---

## Frontend Stack

### Web Application (Primary)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0.0 | UI library |
| **Vite** | 6.x | Build tool & dev server |
| **TypeScript** | 5.7+ | Type safety |
| **TanStack Router** | 1.x | Client-side routing |
| **Tamagui** | 1.x | Cross-platform UI framework |
| **TailwindCSS** | 4.x | Utility CSS (fallback) |
| **Zustand** | 5.x | Client state management |
| **TanStack Query** | 5.x | Server state management |
| **React Hook Form** | 7.x | Form handling |
| **Zod** | 3.24+ | Schema validation |
| **Framer Motion** | 11.x | Animations |

#### Key Libraries

```json
{
  "ui": ["tamagui", "framer-motion", "@fortawesome/react-fontawesome"],
  "routing": ["@tanstack/react-router"],
  "state": ["zustand", "@tanstack/react-query"],
  "forms": ["react-hook-form", "zod"],
  "audio": ["tone", "wavesurfer.js"],
  "realtime": ["socket.io-client"],
  "utils": ["axios", "date-fns", "lodash-es"]
}
```

### Mobile Application

| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo SDK** | 52+ | React Native framework |
| **React Native** | 0.76+ | Mobile UI |
| **Expo Router** | 4.0+ | Navigation |
| **Tamagui** | 1.x | UI components (shared with web) |
| **Zustand** | 5.x | State (shared with web) |
| **TanStack Query** | 5.x | Server state (shared with web) |

#### Expo Modules

```json
{
  "audio": ["expo-av", "react-native-track-player"],
  "storage": ["expo-file-system", "expo-media-library"],
  "notifications": ["expo-notifications"],
  "auth": ["expo-auth-session"],
  "realtime": ["socket.io-client"]
}
```

### Desktop Application

| Technology | Version | Purpose |
|------------|---------|---------|
| **Electron** | 33+ | Desktop wrapper |
| **Web App** | - | 90% code reuse from web |
| **electron-builder** | Latest | Packaging & distribution |
| **electron-updater** | Latest | Auto-updates |

**Why Electron over Tauri:**
- Better Node.js integration for audio processing
- Mature audio ecosystem
- Native module support (for future ASIO/CoreAudio if needed)
- Web Audio API works identically

---

## Audio Engine

### Web & Desktop Audio Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Web Audio API** | Native | Low-level audio processing |
| **Tone.js** | 15.x | High-level audio framework |
| **Wavesurfer.js** | 7.x | Waveform visualization |
| **MediaRecorder API** | Native | Audio recording |
| **RecordRTC** | Latest | Enhanced recording capabilities |
| **OfflineAudioContext** | Native | Offline rendering/export |

#### Audio Latency

- **Typical:** 10-20ms (acceptable for most users)
- **Target buffer size:** 256-512 samples
- **Sample rate:** 48kHz (professional standard)
- **Future:** Native module for <5ms latency if needed

#### Built-in Effects (Native Web Audio API)

All effects use native Web Audio API nodes:

```typescript
// No external dependencies needed for these effects:
- BiquadFilterNode        // EQ, filters (low-pass, high-pass, etc.)
- DynamicsCompressorNode  // Compression/limiting
- ConvolverNode           // Reverb (convolution)
- DelayNode               // Delay/echo
- GainNode                // Volume/panning
- WaveShaperNode          // Distortion/saturation
- PannerNode              // 3D spatial audio
- StereoPannerNode        // Stereo panning
- AnalyserNode            // Visualizations, metering
```

#### Additional Audio Libraries (Optional)

```json
{
  "effects": ["pizzicato", "tuna"],
  "analysis": ["essentia.js"],
  "midi": ["@tonejs/midi", "webmidi"]
}
```

### Mobile Audio Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **expo-av** | 14.x | Basic playback & recording |
| **react-native-track-player** | 4.x | Streaming & background playback |
| **react-native-audio-api** | Latest | Web Audio API for React Native |

**Note:** Mobile DAW features are limited compared to web/desktop. For professional mobile DAW, consider native modules (Superpowered SDK ~$499) in future phases.

### Audio Format Support

```json
{
  "streaming": ["MP3", "OGG", "WebM", "AAC"],
  "high_quality": ["FLAC", "WAV"],
  "export": ["MP3 (320kbps)", "WAV (16/24-bit)", "OGG"],
  "server_processing": "FFmpeg"
}
```

---

## Backend Stack

### Core Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20 LTS (or 22 LTS) | JavaScript runtime |
| **TypeScript** | 5.7+ | Type safety |
| **Fastify** | 5.x | Web framework |
| **Zod** | 3.24+ | Schema validation |
| **Pino** | 9.x | Logging |

**Why Fastify over Express:**
- 2-3x faster performance
- Better TypeScript support out of the box
- Built-in schema validation
- Modern API design
- Better error handling

### API Layer

| Plugin | Version | Purpose |
|--------|---------|---------|
| **@fastify/cors** | 10.x | CORS handling |
| **@fastify/helmet** | 12.x | Security headers |
| **@fastify/multipart** | 9.x | File uploads |
| **@fastify/rate-limit** | 10.x | Rate limiting |
| **@fastify/jwt** | 9.x | JWT authentication |
| **@fastify/cookie** | 11.x | Cookie handling |
| **@fastify/swagger** | 9.x | API documentation |
| **@fastify/swagger-ui** | 5.x | Interactive API docs |

### Real-time Communication

| Technology | Version | Purpose |
|------------|---------|---------|
| **Socket.io** | 4.8+ | WebSocket server |
| **socket.io-client** | 4.8+ | WebSocket client |

**Use Cases:**
- Real-time collaboration
- Live notifications
- DAW session sync
- User presence

### Background Jobs

| Technology | Version | Purpose |
|------------|---------|---------|
| **BullMQ** | 5.x | Job queue |
| **Redis** | 7.x | Queue storage |
| **Bull Board** | Latest | Job monitoring UI |

**Job Types:**
```typescript
enum JobType {
  AUDIO_TRANSCODE = 'audio:transcode',
  AUDIO_NORMALIZE = 'audio:normalize',
  WAVEFORM_GENERATE = 'audio:waveform',
  AUDIO_ANALYSIS = 'audio:analysis',  // BPM, key detection
  EMAIL_SEND = 'email:send',
  DAW_EXPORT = 'daw:export',
  BATCH_OPERATION = 'batch:operation'
}
```

### Server-Side Audio Processing

| Technology | Version | Purpose |
|------------|---------|---------|
| **FFmpeg** | Latest | Audio/video processing |
| **fluent-ffmpeg** | 2.1+ | Node.js FFmpeg wrapper |
| **Sharp** | 0.33+ | Image processing |

**FFmpeg Use Cases:**
- Format conversion (FLAC → MP3, WAV → OGG)
- Audio normalization
- Metadata extraction
- Waveform data generation
- Quality transcoding for streaming
- Trimming/splitting

### Email Service

| Technology | Purpose | Recommendation |
|------------|---------|----------------|
| **Nodemailer** | Current setup | Good for development |
| **Resend.com** | Recommended | Modern API, better deliverability |
| **SendGrid** | Alternative | Enterprise-grade |
| **React Email** | Email templates | Type-safe email templates |

**Resend Benefits:**
- 3,000 emails/month free tier
- Excellent deliverability
- Modern developer experience
- Built-in analytics

---

## Database & Storage

### Primary Database: PostgreSQL

| Component | Version | Purpose |
|-----------|---------|---------|
| **PostgreSQL** | 16+ | Primary database |
| **pg** | 8.x | Node.js driver |
| **pg-pool** | Latest | Connection pooling |
| **node-pg-migrate** | Latest | Migrations |
| **Drizzle ORM** | Latest (optional) | Type-safe queries |

#### Schema Structure

```sql
-- Three main schemas:

1. marketplace
   ├── tracks              # Track catalog
   ├── track_metadata      # Extended metadata
   ├── audio_files         # File references
   ├── instruments         # Instrument tags
   ├── arrangements        # Musical arrangements
   ├── genres              # Genre taxonomy
   ├── moods               # Mood taxonomy
   ├── licenses            # License types
   ├── purchases           # Transaction history
   └── reviews             # User reviews

2. auth
   ├── users               # User accounts
   ├── sessions            # Active sessions
   ├── refresh_tokens      # JWT refresh tokens
   ├── email_verifications # Email confirmation
   └── password_resets     # Password recovery

3. daw
   ├── projects            # DAW projects
   ├── project_tracks      # Tracks within projects
   ├── track_recordings    # Audio recordings
   ├── mix_settings        # Mixer state
   ├── automation_data     # Parameter automation
   ├── effect_chains       # Effects routing
   └── bounced_exports     # Rendered audio
```

#### PostgreSQL Extensions

```sql
-- Recommended extensions:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- Better indexing
CREATE EXTENSION IF NOT EXISTS "timescaledb";    -- Time-series data (optional)
```

### Cache & Session Store: Redis

| Component | Version | Purpose |
|-----------|---------|---------|
| **Redis** | 7.x | Cache & session store |
| **ioredis** | 5.x | Node.js Redis client |

**Use Cases:**
```typescript
{
  "sessions": "User session storage",
  "api_cache": "Response caching (tracks, metadata)",
  "rate_limiting": "Rate limit counters",
  "job_queue": "BullMQ backend storage",
  "websocket_state": "Socket.io adapter",
  "collaboration": "Real-time DAW collaboration state"
}
```

**Alternative:** **Valkey** (Redis fork, fully compatible)

### Search Engine

| Option | Version | Best For |
|--------|---------|----------|
| **Meilisearch** | 1.x | Recommended (easy setup) |
| **TypeSense** | Latest | Alternative (similar features) |
| **Elasticsearch** | - | Not recommended (overkill) |

**Search Indices:**
```typescript
{
  "tracks": ["title", "creator", "genre", "mood", "instruments", "bpm", "key"],
  "creators": ["name", "bio", "tags"],
  "projects": ["name", "description"] // DAW projects
}
```

### Object Storage

| Provider | Use Case | Cost |
|----------|----------|------|
| **DigitalOcean Spaces** | Current setup | $5/month + transfer |
| **Cloudflare R2** | Recommended | $0.015/GB (no egress fees) |
| **AWS S3** | Enterprise | Higher egress costs |
| **Backblaze B2** | Budget option | Cheapest storage |

**Storage Structure:**
```
/audio/
  /tracks/              # Original uploaded tracks
    /{track_id}/
      /original.flac    # Lossless master
      /320kbps.mp3      # High quality stream
      /128kbps.mp3      # Low quality stream
  /recordings/          # DAW vocal recordings
    /{user_id}/
      /{project_id}/
        /take-1.wav
        /take-2.wav
  /bounces/             # DAW exports
    /{user_id}/
      /{project_id}/
        /final-mix.wav
        /final-mix.mp3
  /waveforms/           # Generated waveform data
    /{track_id}.json
  /samples/             # Audio samples for DAW
    /drums/
    /synths/
    /vocals/

/images/
  /artwork/             # Track cover art
    /{track_id}/
      /original.jpg
      /thumb-small.jpg
      /thumb-large.jpg
  /avatars/             # User profile pictures
    /{user_id}/
      /avatar.jpg
```

### CDN

| Provider | Purpose | Cost |
|----------|---------|------|
| **Cloudflare CDN** | Recommended | Free tier available |
| **DigitalOcean CDN** | Current | Included with Spaces |

**CDN Configuration:**
- Cache audio files for 30 days
- Cache images for 90 days
- Cache waveform data for 7 days
- Gzip/Brotli compression enabled

---

## DevOps & Infrastructure

### Containerization

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Local development orchestration |
| **Kubernetes** (optional) | Production orchestration |

**Docker Images:**
```dockerfile
# Base images
node:20-alpine          # API server
postgres:16-alpine      # Database
redis:7-alpine          # Cache
nginx:alpine            # Reverse proxy
meilisearch/meilisearch # Search engine
```

### Deployment Options

#### Option 1: All-in-One Platform (Easiest)

| Component | Provider | Cost |
|-----------|----------|------|
| **Backend API** | Railway.app or Render.com | ~$20/month |
| **Frontend** | Vercel or Netlify | Free tier |
| **PostgreSQL** | Built-in | Included |
| **Redis** | Built-in | Included |
| **Storage** | DigitalOcean Spaces | $5/month |
| **CDN** | Cloudflare | Free |

**Total:** ~$25-30/month

#### Option 2: Self-Managed (More Control)

| Component | Provider | Cost |
|-----------|----------|------|
| **Compute** | DigitalOcean Droplets | $12-24/month |
| **Frontend** | Cloudflare Pages | Free |
| **PostgreSQL** | DigitalOcean Managed | $15/month |
| **Redis** | Upstash | Free tier |
| **Storage** | DigitalOcean Spaces | $5/month |
| **CDN** | Cloudflare | Free |

**Total:** ~$32-44/month

#### Option 3: Enterprise (Highly Scalable)

| Component | Provider | Cost |
|-----------|----------|------|
| **Compute** | AWS ECS or GCP Cloud Run | Variable |
| **Frontend** | Cloudflare Pages | Free |
| **PostgreSQL** | AWS RDS | ~$50+/month |
| **Redis** | AWS ElastiCache | ~$15+/month |
| **Storage** | AWS S3 or Cloudflare R2 | Variable |
| **CDN** | Cloudflare | Free |

**Total:** ~$100+/month

**Recommendation:** Start with Option 1 (Railway/Render), migrate to Option 2 or 3 as you scale.

### CI/CD Pipeline

**Platform:** GitHub Actions

```yaml
Pipeline Stages:
1. Lint & Format (ESLint, Prettier)
2. Type Check (TypeScript)
3. Unit Tests (Vitest)
4. Integration Tests (Vitest + Supertest)
5. E2E Tests (Playwright)
6. Build (Vite + Turbo)
7. Deploy to Staging (on push to main)
8. Deploy to Production (on git tag)
```

**Deployment Triggers:**
- **Staging:** Push to `main` branch
- **Production:** Create git tag (e.g., `v1.0.0`)

---

## Development Tools

### Code Quality

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 9.x | JavaScript/TypeScript linting |
| **Prettier** | 3.x | Code formatting |
| **Stylelint** | 16.x (optional) | CSS linting |
| **Husky** | Latest | Git hooks |
| **lint-staged** | Latest | Pre-commit linting |

**ESLint Configuration:**
```javascript
// eslint.config.mjs (flat config)
export default [
  js.configs.recommended,
  tseslint.configs.recommended,
  reactPlugin.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/react-in-jsx-scope': 'off', // React 19
    }
  }
]
```

### Testing Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **Vitest** | 2.x | Unit & integration tests |
| **Playwright** | 1.x | E2E tests |
| **Testing Library** | Latest | Component testing |
| **Supertest** | 7.x | API testing |
| **MSW** | 2.x | API mocking |

**Test Structure:**
```
src/
├── __tests__/
│   ├── unit/           # Unit tests (Vitest)
│   ├── integration/    # Integration tests (Vitest)
│   └── e2e/            # E2E tests (Playwright)
```

**Coverage Target:** 70%+ for critical paths

### Documentation Tools

| Tool | Purpose |
|------|---------|
| **Swagger/OpenAPI** | API documentation (via @fastify/swagger) |
| **Storybook** (optional) | Component documentation |
| **Markdown** | General documentation |

### Package Management

| Tool | Version | Purpose |
|------|---------|---------|
| **pnpm** | 9.x | Package manager (recommended) |
| **Turborepo** | 2.x | Monorepo build system |

**Why pnpm:**
- 2-3x faster than npm
- Disk space efficient (shared node_modules)
- Strict dependency management
- Built-in monorepo support

**Alternative:** npm workspaces (simpler, built-in)

---

## Security

### Authentication & Authorization

| Component | Implementation |
|-----------|----------------|
| **Strategy** | JWT + Refresh Tokens |
| **Password Hashing** | bcrypt (cost factor: 12) or Argon2 |
| **Session Storage** | Redis |
| **Token Library** | jsonwebtoken |
| **Token Expiry** | Access: 15min, Refresh: 7 days |

**Auth Flow:**
```
1. Login → JWT (15min) + Refresh Token (7 days, HTTP-only cookie)
2. API requests → JWT in Authorization header
3. JWT expires → Use refresh token to get new JWT
4. Refresh token rotation on renewal (security)
```

### Security Measures

| Measure | Implementation |
|---------|----------------|
| **HTTPS** | TLS 1.3 (enforced) |
| **Rate Limiting** | fastify-rate-limit + Redis |
| **SQL Injection** | Parameterized queries (pg prepared statements) |
| **XSS Prevention** | Content Security Policy (CSP) |
| **CSRF Protection** | CSRF tokens (csurf) |
| **CORS** | fastify-cors (whitelist origins) |
| **Security Headers** | fastify-helmet (HSTS, X-Frame-Options, etc.) |
| **Input Validation** | Zod schemas on all inputs |
| **File Upload Security** | MIME type validation, size limits, virus scanning |

**Rate Limits:**
```typescript
{
  "login": "5 attempts per 15 minutes",
  "signup": "3 attempts per hour",
  "api_general": "100 requests per minute",
  "api_audio_stream": "1000 requests per minute",
  "file_upload": "10 uploads per hour"
}
```

---

## Monitoring

### Application Performance Monitoring (APM)

| Tool | Purpose | Cost |
|------|---------|------|
| **Sentry** | Error tracking & performance | Free tier: 5k events/month |
| **Better Stack** | Log management | Free tier: 1GB/month |
| **BetterUptime** | Uptime monitoring | Free tier: 10 monitors |
| **PostHog** | Product analytics | Free tier: 1M events/month |
| **Plausible** (optional) | Privacy-friendly web analytics | $9/month |

### Metrics to Track

**Application Metrics:**
- Error rate
- Response time (p50, p95, p99)
- Request throughput
- Database query performance
- Cache hit rate
- Job queue latency

**Business Metrics:**
- User signups
- Track plays
- Purchases
- DAW project creations
- Active users (DAU, MAU)

**Audio Metrics:**
- Audio latency (Web Audio API baseLatency)
- Buffer underruns
- Recording failures
- Export success rate

### Logging Strategy

**Log Levels:**
```typescript
{
  "production": "info",    // Info, warn, error, fatal
  "staging": "debug",      // Debug and above
  "development": "trace"   // Everything
}
```

**Structured Logging (Pino):**
```typescript
logger.info({
  userId: user.id,
  action: 'track_play',
  trackId: track.id,
  duration: elapsed
}, 'User played track')
```

### Alerting

**Alert Triggers:**
- Error rate > 1% (5min window)
- API response time > 1s (p95)
- Database CPU > 80%
- Disk usage > 85%
- Job queue backlog > 1000 jobs
- Uptime check fails

**Alert Channels:**
- Email
- Slack
- SMS (critical only)

---

## Complete Dependencies

### Web App (`apps/web/package.json`)

```json
{
  "name": "@blendtune/web",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tanstack/react-router": "^1.80.0",
    "@tanstack/react-query": "^5.62.0",
    "tamagui": "^1.120.0",
    "zustand": "^5.0.2",
    "react-hook-form": "^7.54.0",
    "zod": "^3.24.1",
    "framer-motion": "^11.15.0",
    "tone": "^15.0.4",
    "wavesurfer.js": "^7.8.12",
    "recordrtc": "^5.6.2",
    "socket.io-client": "^4.8.1",
    "@fortawesome/fontawesome-svg-core": "^6.7.0",
    "@fortawesome/free-solid-svg-icons": "^6.7.0",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "axios": "^1.7.9",
    "date-fns": "^4.1.0",
    "lodash-es": "^4.17.21"
  },
  "devDependencies": {
    "vite": "^6.0.5",
    "typescript": "^5.7.2",
    "@vitejs/plugin-react": "^4.3.4",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/lodash-es": "^4.17.12",
    "vitest": "^2.1.8",
    "@vitest/ui": "^2.1.8",
    "playwright": "^1.50.0",
    "@playwright/test": "^1.50.0",
    "eslint": "^9.18.0",
    "prettier": "^3.4.2",
    "@tanstack/router-devtools": "^1.80.0",
    "@tanstack/react-query-devtools": "^5.62.0"
  }
}
```

### Backend API (`apps/api/package.json`)

```json
{
  "name": "@blendtune/api",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.ts\"",
    "test": "vitest",
    "migrate": "node-pg-migrate up"
  },
  "dependencies": {
    "fastify": "^5.2.0",
    "@fastify/cors": "^10.0.1",
    "@fastify/helmet": "^12.0.1",
    "@fastify/multipart": "^9.0.1",
    "@fastify/rate-limit": "^10.1.1",
    "@fastify/jwt": "^9.0.1",
    "@fastify/cookie": "^11.0.1",
    "@fastify/swagger": "^9.3.0",
    "@fastify/swagger-ui": "^5.0.1",
    "@fastify/static": "^8.0.2",
    "socket.io": "^4.8.1",
    "pg": "^8.14.0",
    "ioredis": "^5.4.2",
    "bullmq": "^5.29.3",
    "zod": "^3.24.1",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "fluent-ffmpeg": "^2.1.3",
    "sharp": "^0.33.5",
    "nodemailer": "^7.0.11",
    "dotenv": "^16.4.7",
    "pino": "^9.6.0",
    "pino-pretty": "^13.0.0",
    "uuid": "^11.0.5"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/node": "^22.10.5",
    "@types/pg": "^8.11.10",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/fluent-ffmpeg": "^2.1.27",
    "@types/nodemailer": "^7.0.0",
    "tsx": "^4.19.2",
    "vitest": "^2.1.8",
    "supertest": "^7.0.0",
    "@types/supertest": "^6.0.2",
    "node-pg-migrate": "^7.8.2"
  }
}
```

### Mobile App (`apps/mobile/package.json`)

```json
{
  "name": "@blendtune/mobile",
  "version": "2.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.{ts,tsx}\""
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "^19.0.0",
    "react-native": "^0.76.0",
    "tamagui": "^1.120.0",
    "zustand": "^5.0.2",
    "@tanstack/react-query": "^5.62.0",
    "expo-av": "~14.0.7",
    "react-native-track-player": "^4.1.1",
    "expo-file-system": "~18.0.4",
    "expo-media-library": "~17.0.3",
    "expo-notifications": "~0.29.7",
    "expo-auth-session": "~6.0.1",
    "socket.io-client": "^4.8.1",
    "axios": "^1.7.9",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.7.2",
    "prettier": "^3.4.2"
  }
}
```

### Desktop App (`apps/desktop/package.json`)

```json
{
  "name": "@blendtune/desktop",
  "version": "2.0.0",
  "private": true,
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build && electron-builder",
    "electron:dev": "concurrently \"vite\" \"electron .\"",
    "electron:build": "electron-builder"
  },
  "dependencies": {
    "electron-updater": "^6.3.9"
  },
  "devDependencies": {
    "electron": "^33.2.0",
    "electron-builder": "^25.1.8",
    "concurrently": "^9.1.0",
    "vite": "^6.0.5"
  },
  "build": {
    "appId": "com.blendtune.app",
    "productName": "BlendTune",
    "directories": {
      "output": "dist"
    },
    "files": [
      "dist-electron",
      "dist"
    ],
    "mac": {
      "category": "public.app-category.music",
      "target": ["dmg", "zip"]
    },
    "win": {
      "target": ["nsis", "portable"]
    },
    "linux": {
      "target": ["AppImage", "deb"]
    }
  }
}
```

### Shared Packages

#### `packages/audio-engine/package.json`

```json
{
  "name": "@blendtune/audio-engine",
  "version": "2.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    "./web": "./dist/web.js",
    "./mobile": "./dist/mobile.js"
  },
  "dependencies": {
    "tone": "^15.0.4",
    "standardized-audio-context": "^25.3.77"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
```

#### `packages/ui/package.json`

```json
{
  "name": "@blendtune/ui",
  "version": "2.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "dependencies": {
    "tamagui": "^1.120.0",
    "react": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "@types/react": "^19.0.0"
  }
}
```

#### `packages/api-client/package.json`

```json
{
  "name": "@blendtune/api-client",
  "version": "2.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "dependencies": {
    "axios": "^1.7.9",
    "socket.io-client": "^4.8.1",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
```

#### `packages/shared-types/package.json`

```json
{
  "name": "@blendtune/shared-types",
  "version": "2.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "dependencies": {
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "typescript": "^5.7.2"
  }
}
```

### Root `package.json` (Monorepo)

```json
{
  "name": "blendtune",
  "version": "2.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "test": "turbo run test",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.3.3",
    "prettier": "^3.4.2",
    "eslint": "^9.18.0",
    "typescript": "^5.7.2",
    "husky": "^9.1.7",
    "lint-staged": "^15.2.11"
  },
  "packageManager": "pnpm@9.15.0"
}
```

---

## Technology Decisions

### Key Decisions Summary

| Category | Choice | Rationale |
|----------|--------|-----------|
| **Monorepo** | Turborepo | Fast builds, simple setup, great caching |
| **Frontend** | React 19 + Vite | Modern, fast, excellent DX |
| **Mobile** | Expo | Easier than bare RN, rapid iteration |
| **Desktop** | Electron | Node.js integration, mature audio ecosystem |
| **UI** | Tamagui | Cross-platform (web + mobile), performant |
| **State** | Zustand + TanStack Query | Lightweight, works everywhere, simple |
| **Backend** | Fastify | Fast, type-safe, modern API design |
| **Database** | PostgreSQL 16 | Robust, proven, powerful queries |
| **Cache** | Redis 7 | Industry standard, fast, reliable |
| **Audio (Web)** | Web Audio API + Tone.js | Native, powerful, acceptable latency |
| **Audio (Mobile)** | expo-av + react-native-track-player | Reliable, Expo-compatible |
| **Jobs** | BullMQ | Modern, reliable, good monitoring |
| **Search** | Meilisearch | Fast, easy setup, great UX |
| **Storage** | Cloudflare R2 (recommended) | No egress fees, fast, affordable |
| **CDN** | Cloudflare | Free, fast, global network |
| **Auth** | JWT + Refresh tokens | Scalable, stateless, secure |
| **Testing** | Vitest + Playwright | Fast, modern, excellent TypeScript support |
| **Deployment** | Railway/Render + Vercel | Easy setup, affordable, scalable |

### Why Not Next.js?

While the current stack uses Next.js, we're migrating away because:

❌ **Cons for this use case:**
- Server Components add complexity for real-time audio
- SSR benefits minimal for logged-in audio app
- Heavier than needed for client-heavy DAW
- Harder to share code with mobile/desktop

✅ **Vite + React Benefits:**
- Faster development (HMR)
- Better for real-time audio (full client control)
- Easier code sharing across platforms
- Simpler deployment (separate frontend/backend)
- Lower latency for audio processing

### When to Scale/Upgrade

| Current | Upgrade To | When |
|---------|-----------|------|
| Web Audio API | Native module (ASIO/CoreAudio) | Pro users complain about latency |
| Single server | Horizontal scaling (load balancer) | >1000 concurrent users |
| PostgreSQL single | Read replicas | Database CPU >70% consistently |
| Redis single | Redis Cluster | Cache hit rate <80% |
| Object storage | CDN edge caching | High egress costs |
| Meilisearch | Elasticsearch | >10M indexed documents |

---

## Migration Path (from current Next.js app)

### Phase 1: Foundation (Months 1-2)
- [ ] Set up Turborepo monorepo
- [ ] Create Vite + React web app
- [ ] Migrate marketplace UI (browse, search, player)
- [ ] Set up Fastify backend
- [ ] Migrate API endpoints
- [ ] Test audio playback with Web Audio API

### Phase 2: DAW Features (Months 3-4)
- [ ] Implement audio engine (Web Audio API + Tone.js)
- [ ] Build waveform editor
- [ ] Add recording functionality
- [ ] Implement effects (reverb, delay, EQ, compression)
- [ ] Build mixer UI
- [ ] Add export/bounce functionality

### Phase 3: Desktop (Month 5)
- [ ] Wrap web app in Electron
- [ ] Add native features (file system access)
- [ ] Test audio latency
- [ ] Package for Windows/Mac/Linux

### Phase 4: Mobile (Months 6-7)
- [ ] Create Expo app
- [ ] Implement marketplace features
- [ ] Add basic audio playback
- [ ] Limited DAW features (recording, basic mixing)
- [ ] Submit to App Store & Google Play

### Phase 5: Polish & Launch (Month 8+)
- [ ] Performance optimization
- [ ] User testing & feedback
- [ ] Bug fixes
- [ ] Documentation
- [ ] Marketing & launch

---

## Resources & Documentation

### Official Documentation
- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Fastify](https://fastify.dev)
- [Tamagui](https://tamagui.dev)
- [Tone.js](https://tonejs.github.io)
- [Expo](https://docs.expo.dev)
- [Electron](https://electronjs.org/docs)
- [PostgreSQL](https://postgresql.org/docs)
- [Redis](https://redis.io/docs)

### Learning Resources
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Building Audio Applications](https://webaudioapi.com)
- [Monorepo Guide](https://turbo.build/repo/docs)

### Community
- Discord: [Create community server]
- GitHub Discussions: [Enable on repository]
- Stack Overflow: Tag questions with `blendtune`

---

**Document Maintained By:** Development Team
**Review Frequency:** Quarterly or on major architecture changes
**Last Review:** December 2025
