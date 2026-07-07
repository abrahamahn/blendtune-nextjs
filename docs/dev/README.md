# Developer Documentation

Technical documentation for developers working on Blendtune.

## Table of Contents

1. [Development Roadmap](./01-roadmap.md) - Future features and improvements
2. [Architecture Overview](./02-architecture.md) - System design and technical decisions
3. [API Documentation](./03-api-documentation.md) - API endpoints and usage
4. [Database Schema](./04-database-schema.md) - Database structure and relationships
5. [Contributing Guidelines](./05-contributing.md) - How to contribute to the project
6. [Testing Guide](./06-testing.md) - Testing strategy and best practices
7. [Deployment Guide](./07-deployment.md) - Production deployment procedures

## Quick Start for Developers

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL 14+
- Git

### Local Setup

```bash
# Clone and install
git clone https://github.com/yourusername/blendtune-nextjs.git
cd blendtune-nextjs
pnpm install

# Configure environment (see main/shared/src/config)
# Provide DATABASE_URL, JWT_SECRET (>=32 chars), DO Spaces + SMTP credentials

# Apply database migrations
pnpm db:migrate

# Run the API (Fastify, :8080) and the web dev server (Vite) in separate terminals
pnpm dev:api
pnpm dev:web
```

### Development Workflow

1. Create a feature branch from `main`
2. Make changes and write/update tests
3. Run lint, type-check, and tests locally
4. Commit with clear messages
5. Push and open a pull request
6. Wait for review and CI
7. Merge after approval

## Technology Stack Overview

### Frontend
- Vite 6 + React 19 single-page app
- Custom react-router-v6-style client router (`main/client/react/src/router`)
- Redux Toolkit for global state
- TypeScript (strict), TailwindCSS

### Backend
- Fastify 5 (`main/apps/server`) serving `/api/*` and the built SPA from one origin
- Framework-agnostic core packages under `main/server/*`
- PostgreSQL via postgres.js with Row-Level Security
- Argon2id auth, HS256 JWT access tokens, rotating refresh tokens
- Nodemailer for transactional email

### Infrastructure
- Single DigitalOcean droplet, PM2 (`blendtune-api`) on :8080
- Caddy reverse proxy, Cloudflare (Full SSL)
- DigitalOcean Spaces CDN for audio/image assets

## Key Concepts

### Monorepo with Framework-Agnostic Core
Business logic lives in `main/server/*` and `main/shared`; React renders and Fastify routes are thin
adapters. Dependency flow: `apps/*` → `server/*` or `client/*` → `shared/*`.

### Feature-Based Frontend
The SPA is organized by feature (auth, player, sounds, creator, tracks) under
`main/apps/web/src/client/features`.

### Multi-Tenancy
Tenants and memberships gate access; tenant-scoped queries run under Row-Level Security so isolation
is enforced at the database.

### Type Safety
Strict TypeScript throughout; runtime validation with Zod schemas defined in `main/shared`.

## Project Structure

```
main/
├── apps/
│   ├── web/            # Vite React SPA (entry src/main.tsx, routes src/app/App.tsx)
│   └── server/         # Fastify API (bootstrap + http/routes)
├── server/             # framework-agnostic packages: core, db, storage, media, system
├── client/react/src/router/   # custom client router
└── shared/             # contracts, validation, config
```

## Development Commands

```bash
# Development
pnpm dev:api         # Fastify API with tsx watch (:8080)
pnpm dev:web         # Vite dev server
pnpm start:api       # Run the API without watch

# Build
pnpm build:web       # Build the SPA -> main/apps/web/dist

# Database
pnpm db:migrate      # Apply pending migrations
pnpm db:migrate:dry  # Preview migrations
pnpm db:status       # Inspect migration state

# Code Quality
pnpm lint            # ESLint (flat config)
pnpm type-check      # tsc --noEmit
pnpm format          # Prettier

# Testing
pnpm test            # Jest unit tests
pnpm test:watch      # Watch mode
```

## Important Links

- [Architecture Details](./02-architecture.md)
- [API Reference](./03-api-documentation.md)
- [Database Schema](./04-database-schema.md)
- [Roadmap](./01-roadmap.md)

## Getting Help

- Check existing documentation
- Review closed issues/PRs
- Ask in team chat/discussions
- Contact maintainers
