# Developer Documentation

Welcome to the Blendtune developer documentation. This guide provides technical information for developers working on the platform.

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
- Node.js 18+ or 20+
- PostgreSQL 14+
- Git
- Code editor (VS Code recommended)

### Local Setup

```bash
# Clone repository
git clone https://github.com/yourusername/blendtune-nextjs.git
cd blendtune-nextjs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Initialize database
psql -U postgres -d blendtune < db/blendtune_tracks_backup.sql
psql -U postgres -d blendtune < db/blendtune_users_backup.sql

# Run development server
npm run dev
```

### Development Workflow

1. Create feature branch from `main`
2. Make changes and write tests
3. Run linters and tests locally
4. Commit with clear messages
5. Push and create pull request
6. Wait for code review and CI checks
7. Merge after approval

## Technology Stack Overview

### Frontend
- Next.js 15.1.7 (App Router)
- React 19.0.0
- TypeScript 5.2.2
- TailwindCSS 3.4.17

### Backend
- Next.js API Routes
- PostgreSQL (3 schemas)
- Nodemailer
- bcrypt

### Infrastructure
- DigitalOcean Spaces CDN
- Vercel hosting (assumed)

## Key Concepts

### Feature-Based Architecture
Code is organized by feature (auth, player, sounds) rather than by type (components, services, utils).

### Context-First State Management
Primary state management uses React Context API. Redux is minimally used.

### Type Safety
Comprehensive TypeScript coverage with strict type checking.

### Progressive Enhancement
PWA capabilities with service worker for offline functionality.

## Project Structure

```
src/
├── app/              # Next.js App Router (pages & API routes)
├── client/           # Client-side code
│   ├── core/        # Global providers, contexts
│   ├── features/    # Feature modules
│   └── shared/      # Shared utilities
├── server/          # Server-side code
│   ├── config/      # Configuration
│   ├── db/          # Database connections
│   ├── lib/         # Server utilities
│   └── services/    # Business logic
└── shared/          # Shared types
```

## Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run stylelint    # Lint CSS/SCSS
npm run format       # Format with Prettier

# Testing
npm run test         # Run unit tests
npm run test:watch   # Watch mode
npm run test:e2e     # End-to-end tests
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

---

Let's build something great together! 🚀
