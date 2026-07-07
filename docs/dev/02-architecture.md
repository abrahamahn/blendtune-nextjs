# Architecture Overview

This document describes Blendtune's technical architecture, design decisions, and system organization.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Design](#database-design)
5. [External Services](#external-services)
6. [Security Architecture](#security-architecture)
7. [Performance Considerations](#performance-considerations)

## System Architecture

### High-Level Overview

Blendtune is a **pnpm workspace monorepo** modeled on the bslt reference stack: a Vite + React 19
single-page app served statically by a Fastify API, both from a single origin. Business logic lives
in framework-agnostic packages under `main/server/*`; React renders and Fastify routes are thin
adapters over them.

```
┌─────────────────┐
│   Browser SPA   │
│ (Vite + React)  │
└────────┬────────┘
         │ HTTPS (single origin)
         ▼
┌─────────────────┐
│  Fastify server │
│  /api/*  +  SPA │   ← serves built dist/ AND the API
└────────┬────────┘
    ┌────┴────────────┐
    ▼                 ▼
┌────────┐      ┌────────────┐
│Postgres│      │ DO Spaces  │
│  (RLS) │      │   (CDN)    │
└────────┘      └────────────┘
```

### Monorepo Layout

```
main/
├── apps/
│   ├── web/                # Vite React 19 SPA (entry src/main.tsx, routes src/app/App.tsx)
│   └── server/             # Fastify API — bootstrap + thin HTTP routes
├── server/                 # framework-agnostic backend packages
│   ├── core/               # business logic (auth, tracks, account, creator, sessions)
│   ├── db/                 # postgres.js client, migrations, repositories
│   ├── storage/            # object-storage port (DO Spaces)
│   ├── media/              # audio streaming / content-type helpers
│   └── system/             # security primitives (JWT)
├── client/
│   └── react/src/router/   # custom react-router-v6-style client router
└── shared/                 # contracts, validation, config shared by web + server
```

**Dependency flow (never reversed):** `apps/*` → `server/*` or `client/*` → `shared/*`. Apps never
import from each other.

### Technology Decisions

**Why Vite + Fastify (over the previous Next.js app)?**
- Full client control for a heavily interactive, audio-first UI (no Server Component overhead).
- Framework-agnostic core: business logic is testable in isolation and portable into the bslt monorepo.
- Single-origin deploy — one Fastify process serves the SPA and the API, so no CORS and no separate host.
- Faster dev loop (Vite HMR) and a leaner runtime.

**Why PostgreSQL?**
- Relational model with strong querying (multi-facet catalog filters), JSON support for flexible metadata.
- Row-Level Security enforces tenant isolation at the database.
- ACID transactions, mature tooling.

**Why Redux Toolkit?**
- Predictable global client state for the catalog, filters, and player.
- Colocated slices under `main/apps/web/src/client/core/store`.

## Frontend Architecture

### Feature-Based Organization

The SPA lives in `main/apps/web/src`:

```
main/apps/web/src/
├── main.tsx                # React entry — mounts <App/>
├── app/App.tsx             # provider tree + route table
├── pages/                  # one component per route (Home, Sounds, Creator, auth, security, static)
└── client/
    ├── core/               # providers, context, services, Redux store
    ├── features/           # auth, creator, home, layout, player, sounds, tracks
    └── shared/             # cross-feature hooks/components/utilities
```

Each feature owns its components, hooks, and view logic. React renders only — business rules and
validation live in `main/shared` and `main/server/core`.

### Routing

Routing uses a small **custom client router** at `main/client/react/src/router` with a
react-router-v6-style API (`Router`, `Routes`, `Route`, `Link`, `useNavigate`, `useParams`,
`useSearchParams`). Routes are declared centrally in `main/apps/web/src/app/App.tsx`:

```
/                               HomePage
/sounds                         SoundsPage (catalog)
/c/:slug                        CreatorPage (workspace-scoped)
/auth/signin | /auth/signup     auth pages
/auth/reset-password            password reset request
/auth/security/*                verify-email, new-password, confirm-email, reset-confirmed
/welcome | /terms | /privacy-policy
```

The server serves `index.html` for any non-`/api` path so client-side routing works on deep links.

### State Management

- **Redux Toolkit** (`react-redux`) for global client state — catalog, filters, and player.
- **React Context** for scoped concerns (session, providers under `client/core/providers`).
- **Local component state** for UI-only concerns (modals, inputs).

### Path Aliases

The web app uses path aliases (e.g. `@client`, `@features`, `@core`, `@shared`, `@router`) instead of
deep relative imports; they resolve via the Vite config and `tsconfig` `paths`.

## Backend Architecture

### Layering

Fastify is a thin transport layer. Each route validates input, resolves the request context (auth,
tenant), and delegates to a framework-agnostic core service.

```
HTTP route (apps/server/src/http/routes/*.ts)
      → core service (server/core/src/*)
            → repository (server/db/src/repositories/*)
                  → RawDb client (server/db/src/client.ts, postgres.js)
```

### Server Bootstrap

`main/apps/server/src/main.ts` loads env, fails fast if `JWT_SECRET` is missing, builds the app, and
listens (default `127.0.0.1:8080`). The app is assembled in `main/apps/server/src/bootstrap/`:

| File          | Responsibility                                             |
| ------------- | ---------------------------------------------------------- |
| `app.ts`      | Create Fastify instance, register plugins and routes       |
| `context.ts`  | Per-request context (authenticated user, active tenant)    |
| `refresh.ts`  | Transparent server-side access-token refresh               |
| `static.ts`   | Serve the built SPA (`main/apps/web/dist`) + SPA fallback  |
| `cron.ts`     | Scheduled jobs (`node-cron`)                               |

### HTTP Routes

Route modules in `main/apps/server/src/http/routes/`:

| Module       | Surface                                                        |
| ------------ | ------------------------------------------------------------- |
| `auth.ts`    | signup, login, logout, session check, email/password flows    |
| `account.ts` | account info, profile updates                                 |
| `tracks.ts`  | public catalog (`GET /api/tracks`)                            |
| `creator.ts` | tenant-scoped creator surface (workspaces, workspace catalog) |
| `media.ts`   | audio streaming with HTTP range support                      |

### Core Packages

`main/server/core/src` holds the business logic — `auth`, `account`, `tracks`, `creator`,
`sessions`, and request `context` — with no Fastify dependencies. Object storage
(`main/server/storage`, DO Spaces) and audio/media helpers (`main/server/media`) are exposed as ports,
so streaming and storage backends can change without touching route or core code.

## Database Design

### Client

A single PostgreSQL database accessed through **postgres.js** (porsager). The `RawDb` wrapper at
`main/server/db/src/client.ts` provides parameterized queries, transactions with automatic
commit/rollback, and RLS session scoping via `SET LOCAL app.user_id/tenant_id/role`
(`RawDb.withSession`).

### Migrations

Numbered SQL files in `main/server/db/src/migrations/` applied by a tiny runner
(`pnpm db:migrate`, dry run with `pnpm db:migrate:dry`, `pnpm db:status` to inspect state):

```
0000_baseline.sql          # consolidated schema
0100_tenants.sql           # tenants + memberships
0101_seed_tenants.sql
0200_tracks_tenant_id.sql  # tenant scoping for catalog
0300_profile_created.sql
0500_refresh_tokens.sql    # opaque rotating refresh tokens
0600_profile_on_users.sql
0900_rls.sql               # Row-Level Security policies
```

### Multi-Tenancy & RLS

Tenants and memberships gate access. Every tenant-scoped query runs inside a session where
`app.tenant_id` is set, and Postgres **Row-Level Security** enforces isolation at the database — even
a query bug cannot leak another workspace's rows. Repositories live in
`main/server/db/src/repositories/` (`tracks`, `users`, `profile`, `tenant`, `refreshTokens`).

See [04-database-schema.md](./04-database-schema.md) for the full schema.

## External Services

### DigitalOcean Spaces CDN

Audio and image assets are stored in DO Spaces and served through its CDN. The server accesses Spaces
through the storage port in `main/server/storage`; audio requests stream with HTTP range support via
`main/server/media`.

### Email (Nodemailer)

Transactional email (verification, password reset) is sent via Nodemailer for signup, verification,
and recovery flows.

## Security Architecture

### Authentication

- **Password hashing:** Argon2id, with lazy migration of legacy bcrypt hashes on successful login.
- **Access tokens:** zero-dependency HS256 JWTs (`main/server/system/src/security/jwt.ts`) carried in
  the `sessionToken` cookie; short-lived (`ACCESS_TOKEN_TTL`, default 15m).
- **Refresh tokens:** opaque, rotating tokens in the `refreshToken` cookie, tracked as a family with
  reuse detection — a replayed token invalidates the family.
- **Transparent refresh:** the server refreshes an expired access token server-side (`bootstrap/refresh.ts`)
  so clients stay signed in without a manual refresh call.

Auth logic lives in `main/server/core/src/auth`; `JWT_SECRET` (≥32 chars) is required at startup.

### Cookies

Auth cookies are `HttpOnly`, `Secure` in production, and `SameSite` scoped. Sessions cannot be read
from JavaScript.

### Data Protection

- Parameterized queries throughout (no string-built SQL).
- Row-Level Security for tenant isolation.
- Runtime validation of external input with Zod schemas in `main/shared`.

## Performance Considerations

### Frontend

- Vite production build with code splitting and tree-shaking.
- Static assets served with long-lived cache headers.

### Backend

- Fastify's low-overhead routing and JSON handling.
- postgres.js connection reuse and prepared statements.
- Audio streamed with HTTP range requests and CDN caching.

### Caching

```
Browser cache → CDN (DO Spaces) → Fastify → PostgreSQL
```

## Deployment

A single DigitalOcean droplet runs the Fastify process (`blendtune-api`) under PM2
(`infra/ecosystem.bslt.config.js`) on `:8080`, serving both the SPA and `/api`. Caddy (Docker)
reverse-proxies `blendtune.com` → `:8080`, with Cloudflare in front (Full SSL). See
[07-deployment.md](./07-deployment.md) and `bslt-cutover-runbook.md`.

## Development Principles

- **Type safety:** strict TypeScript, no `any`; types inferred from Zod schemas.
- **DRY:** shared contracts/validation in `main/shared`; no duplicated types.
- **Layer separation:** React renders, Fastify routes adapt, core packages own the logic.
- **Tests:** unit tests colocated as `*.test.ts` (Jest + `@swc/jest`).

---

**Next Steps**:
- Review [API Documentation](./03-api-documentation.md)
- Understand [Database Schema](./04-database-schema.md)
- Check [Development Roadmap](./01-roadmap.md)
