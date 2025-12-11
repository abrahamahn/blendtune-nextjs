# Phase 1: Next.js to React/Vite Migration Plan

> Complete migration guide from Next.js to vanilla React with Vite, maintaining all functionality

**Start Date:** TBD
**Estimated Duration:** 10-15 days
**Goal:** Migrate from Next.js monolithic app to Vite (frontend) + Node.js/Fastify (backend) while preserving 100% of current functionality

---

## Table of Contents

- [Overview](#overview)
- [Migration Strategy](#migration-strategy)
- [Prerequisites](#prerequisites)
- [Phase 1 Complete Todo List](#phase-1-complete-todo-list)
- [Detailed Steps](#detailed-steps)
- [Code Examples](#code-examples)
- [Testing Checklist](#testing-checklist)
- [Rollback Plan](#rollback-plan)

---

## Overview

### Current Architecture
```
Next.js App (Monolithic)
├── Frontend (React components)
├── Backend (API routes)
├── Database connections
└── Authentication
```

### Target Architecture
```
Frontend (Vite + React)          Backend (Node.js + Fastify)
├── React 19                     ├── API routes
├── React Router                 ├── PostgreSQL connections
├── TanStack Query               ├── Authentication (JWT)
└── Zustand/Redux                └── Audio streaming
```

### What Will Be Preserved

✅ **100% Feature Parity:**
- Audio streaming with Range request support
- Real-time waveform & equalizer visualizations
- Authentication (email/password + Google OAuth)
- Track catalog browsing & filtering
- Music player with all controls
- Email verification & password reset
- User profiles
- PWA capabilities

### What Will Change

🔄 **Architecture Changes:**
- Next.js App Router → React Router
- API Routes → Separate Fastify backend
- Cookie-based sessions → JWT tokens (recommended)
- Next.js `cache()` → TanStack Query
- `next/image` → Standard `<img>` or custom optimization
- Server Components → Client Components (all)

---

## Migration Strategy

### Approach: Parallel Development

We'll build the new stack alongside the existing Next.js app, then switch over:

1. **Create new directories** (`apps/web`, `apps/api`) without touching existing code
2. **Migrate incrementally** - one feature at a time
3. **Test each feature** before moving to the next
4. **Cut over** when new stack reaches 100% parity
5. **Keep old code** for 1-2 weeks as backup

### Risk Mitigation

- **No destructive changes** until new stack is verified
- **Feature flags** to toggle between old/new code
- **Comprehensive testing** at each step
- **Rollback plan** documented and tested

---

## Prerequisites

### Required Tools

```bash
# Install these before starting:
node --version    # v20.x or v22.x LTS
pnpm --version    # 9.x (or npm 10.x)
git --version     # 2.x

# Optional but recommended:
docker --version  # For local PostgreSQL testing
```

### Required Knowledge

- React 19 & hooks
- TypeScript
- REST API design
- PostgreSQL basics
- Git branching strategies

### Create Backup

```bash
# Create backup branch before starting
git checkout -b backup/pre-migration
git push origin backup/pre-migration

# Create feature branch for migration
git checkout -b feature/migrate-to-vite
```

---

## Phase 1 Complete Todo List

### Milestone 1: Project Setup (Days 1-2)

#### 1.1 Monorepo Setup
- [ ] Install Turborepo: `pnpm add -g turbo`
- [ ] Create root `turbo.json` configuration
- [ ] Create workspace structure: `apps/`, `packages/`
- [ ] Update root `package.json` with workspaces
- [ ] Configure pnpm-workspace.yaml
- [ ] Test monorepo build: `turbo run build`

#### 1.2 Frontend (Vite + React) Setup
- [ ] Create `apps/web` directory
- [ ] Initialize Vite: `pnpm create vite@latest`
- [ ] Install React 19: `pnpm add react@19 react-dom@19`
- [ ] Install TypeScript: `pnpm add -D typescript @types/react @types/react-dom`
- [ ] Configure `vite.config.ts` with path aliases
- [ ] Configure `tsconfig.json` with same paths as Next.js
- [ ] Install React Router: `pnpm add react-router-dom`
- [ ] Install TailwindCSS: `pnpm add -D tailwindcss postcss autoprefixer`
- [ ] Copy `tailwind.config.js` from root
- [ ] Create `src/main.tsx` entry point
- [ ] Create `src/App.tsx` root component
- [ ] Test dev server: `pnpm dev`

#### 1.3 Backend (Fastify) Setup
- [ ] Create `apps/api` directory
- [ ] Initialize Node.js project: `pnpm init`
- [ ] Install Fastify: `pnpm add fastify`
- [ ] Install plugins: `@fastify/cors @fastify/helmet @fastify/jwt @fastify/cookie @fastify/multipart`
- [ ] Install PostgreSQL: `pnpm add pg`
- [ ] Install utilities: `pnpm add dotenv bcrypt jsonwebtoken uuid`
- [ ] Install dev tools: `pnpm add -D typescript tsx @types/node @types/pg @types/bcrypt`
- [ ] Create `src/index.ts` server entry point
- [ ] Configure TypeScript: `tsconfig.json`
- [ ] Create basic server with CORS
- [ ] Test server: `pnpm dev`

#### 1.4 Environment Configuration
- [ ] Create `apps/web/.env.local` for frontend
- [ ] Create `apps/api/.env` for backend
- [ ] Move database credentials to `apps/api/.env`
- [ ] Create `VITE_API_BASE_URL` in frontend env
- [ ] Update `.gitignore` to exclude `.env` files
- [ ] Document environment variables in `.env.example` files

#### 1.5 Shared Packages Setup
- [ ] Create `packages/shared-types`
- [ ] Create `packages/api-client`
- [ ] Create `packages/ui` (optional for now)
- [ ] Configure TypeScript for each package
- [ ] Set up build scripts

---

### Milestone 2: Backend Migration (Days 3-5)

#### 2.1 Database Connection Setup
- [ ] Create `apps/api/src/db/auth.ts` (auth database connection)
- [ ] Create `apps/api/src/db/tracks.ts` (tracks database connection)
- [ ] Implement connection pooling with `pg.Pool`
- [ ] Test database connections
- [ ] Create database utility functions
- [ ] Add connection error handling

#### 2.2 Authentication Routes
- [ ] Create `apps/api/src/routes/auth.ts`
- [ ] Migrate `POST /api/auth/login`
  - [ ] Extract bcrypt password comparison logic
  - [ ] Implement JWT token generation (access + refresh)
  - [ ] Set HTTP-only cookie for refresh token
  - [ ] Return access token in response body
  - [ ] Test login endpoint
- [ ] Migrate `POST /api/auth/signup`
  - [ ] Extract user creation logic
  - [ ] Hash password with bcrypt
  - [ ] Create email verification token
  - [ ] Send verification email
  - [ ] Test signup endpoint
- [ ] Migrate `POST /api/auth/logout`
  - [ ] Clear session/cookies
  - [ ] Invalidate refresh token
  - [ ] Test logout endpoint
- [ ] Migrate `POST /api/auth/security/check-session`
  - [ ] Validate JWT token
  - [ ] Return user session data
  - [ ] Test session check endpoint

#### 2.3 Email Verification Routes
- [ ] Create `apps/api/src/routes/security.ts`
- [ ] Migrate `POST /api/auth/security/confirm-email`
  - [ ] Extract email verification logic
  - [ ] Update user verified status
  - [ ] Test email confirmation
- [ ] Migrate password reset endpoints
  - [ ] `POST /api/auth/security/reset-password/create`
  - [ ] `POST /api/auth/security/reset-password/verify`
  - [ ] `POST /api/auth/security/reset-password`
  - [ ] Test complete password reset flow

#### 2.4 Account Routes
- [ ] Create `apps/api/src/routes/account.ts`
- [ ] Migrate `GET /api/account`
  - [ ] Extract account data retrieval
  - [ ] Protect with JWT middleware
  - [ ] Test account endpoint
- [ ] Migrate `GET /api/account/profile`
  - [ ] Extract profile data retrieval
  - [ ] Test profile endpoint
- [ ] Migrate `POST /api/account/profile`
  - [ ] Extract profile update logic
  - [ ] Test profile update

#### 2.5 Tracks Routes
- [ ] Create `apps/api/src/routes/tracks.ts`
- [ ] Migrate `GET /api/tracks`
  - [ ] Extract track catalog query
  - [ ] Implement pagination (optional optimization)
  - [ ] Add response caching headers
  - [ ] Test tracks endpoint

#### 2.6 Audio Streaming Route (CRITICAL)
- [ ] Create `apps/api/src/routes/audio.ts`
- [ ] Migrate `GET /api/audio/[file]` and `HEAD /api/audio/[file]`
  - [ ] Implement Range request handling (HTTP 206)
  - [ ] Support both local files and CDN streaming
  - [ ] Implement proper MIME type detection
  - [ ] Handle HEAD requests for metadata
  - [ ] Test streaming with player seek functionality
  - [ ] Test with different audio formats (MP3, OGG, FLAC, WebM)

#### 2.7 Middleware & Services
- [ ] Create `apps/api/src/middleware/auth.ts`
  - [ ] JWT verification middleware
  - [ ] Attach user to request object
- [ ] Create `apps/api/src/middleware/errorHandler.ts`
  - [ ] Global error handling
  - [ ] Standardized error responses
- [ ] Create `apps/api/src/services/authService.ts`
  - [ ] Token generation utilities
  - [ ] Password hashing utilities
  - [ ] Session management utilities
- [ ] Create `apps/api/src/services/emailService.ts`
  - [ ] Email sending logic (Nodemailer)
  - [ ] Email templates
- [ ] Create `apps/api/src/services/audioService.ts`
  - [ ] Audio streaming utilities
  - [ ] MIME type detection
  - [ ] CDN URL generation

#### 2.8 API Documentation
- [ ] Install Swagger: `pnpm add @fastify/swagger @fastify/swagger-ui`
- [ ] Configure Swagger for all routes
- [ ] Test Swagger UI at `/docs`
- [ ] Document all request/response schemas

---

### Milestone 3: Frontend Migration (Days 6-9)

#### 3.1 Routing Setup
- [ ] Create `apps/web/src/router.tsx`
- [ ] Define all routes (home, signin, signup, sounds, profile, etc.)
- [ ] Create route components structure
- [ ] Implement nested routes for auth pages
- [ ] Set up protected routes (require authentication)
- [ ] Test all route navigation

#### 3.2 API Client Setup
- [ ] Create `packages/api-client/src/index.ts`
- [ ] Install axios: `pnpm add axios`
- [ ] Create API client instance with base URL
- [ ] Implement request interceptors (add JWT token)
- [ ] Implement response interceptors (handle 401, refresh token)
- [ ] Create API methods for all endpoints:
  - [ ] `authAPI.login(credentials)`
  - [ ] `authAPI.signup(userData)`
  - [ ] `authAPI.logout()`
  - [ ] `authAPI.checkSession()`
  - [ ] `authAPI.confirmEmail(token)`
  - [ ] `authAPI.resetPassword(email)`
  - [ ] `accountAPI.getProfile()`
  - [ ] `accountAPI.updateProfile(data)`
  - [ ] `tracksAPI.getAll()`
  - [ ] `audioAPI.getStreamUrl(trackId)`
- [ ] Add TypeScript types for all requests/responses
- [ ] Test API client

#### 3.3 State Management Setup
- [ ] Install TanStack Query: `pnpm add @tanstack/react-query`
- [ ] Create `apps/web/src/lib/queryClient.ts`
- [ ] Wrap app with `QueryClientProvider`
- [ ] Keep existing Redux store (for auth state)
- [ ] Keep existing Context providers (player, filters)

#### 3.4 Copy Client Code
- [ ] Copy entire `src/client/` directory to `apps/web/src/`
- [ ] Update all import paths:
  - [ ] Remove `@/client/` prefix
  - [ ] Update to relative or absolute paths
  - [ ] Update `@/shared/` imports
- [ ] Copy `src/shared/` to `apps/web/src/shared/`
- [ ] Copy `src/server/lib/` client-safe utilities to `apps/web/src/lib/`

#### 3.5 Remove Next.js Dependencies
- [ ] Find all "use client" directives: `grep -r "use client"`
- [ ] Remove all "use client" directives
- [ ] Replace `next/image` with `<img>` or custom component
- [ ] Replace `next/link` with `react-router-dom` `<Link>`
- [ ] Replace `next/navigation` hooks:
  - [ ] `useRouter()` → `useNavigate()`
  - [ ] `usePathname()` → `useLocation()`
  - [ ] `useSearchParams()` → `useSearchParams()` (React Router)
- [ ] Remove `@vercel/functions` usage (IP detection)

#### 3.6 Update Data Fetching
- [ ] Migrate `src/client/features/tracks/core/hooks/fetchTracks.ts`
  - [ ] Remove Next.js `cache()` wrapper
  - [ ] Remove `next: { revalidate, tags }` options
  - [ ] Convert to TanStack Query:
    ```typescript
    export const useTracks = () => {
      return useQuery({
        queryKey: ['tracks'],
        queryFn: () => tracksAPI.getAll(),
        staleTime: 3600000, // 1 hour
      });
    };
    ```
- [ ] Update all components using `fetchTracks` to use `useTracks` hook
- [ ] Test track loading

#### 3.7 Authentication Flow
- [ ] Update `src/client/features/auth/hooks/useAuth.ts`
  - [ ] Replace fetch calls with `authAPI` client
  - [ ] Update login to store JWT token
  - [ ] Implement token refresh logic
- [ ] Update `SessionProvider` context
  - [ ] Use TanStack Query for session checking
  - [ ] Implement token storage (localStorage or memory)
- [ ] Update Redux `sessionSlice`
  - [ ] Store JWT access token
  - [ ] Store user data from token
- [ ] Test authentication flow:
  - [ ] Login
  - [ ] Logout
  - [ ] Session persistence
  - [ ] Auto token refresh

#### 3.8 Player Migration
- [ ] Update `PlayerProvider` context
  - [ ] Update audio streaming URLs to use backend API
  - [ ] Ensure Range requests work for seeking
- [ ] Test player functionality:
  - [ ] Play/pause
  - [ ] Next/previous track
  - [ ] Volume control
  - [ ] Seek (critical - tests Range requests)
  - [ ] Waveform visualization
  - [ ] Equalizer visualization

#### 3.9 Layout & Pages
- [ ] Create `apps/web/src/layouts/RootLayout.tsx`
  - [ ] Copy logic from `src/app/layout.tsx`
  - [ ] Remove Next.js metadata
  - [ ] Add React Helmet for `<head>` management
- [ ] Create page components:
  - [ ] `src/pages/Home.tsx` (from `src/app/page.tsx`)
  - [ ] `src/pages/SignIn.tsx` (from `src/app/auth/signin/page.tsx`)
  - [ ] `src/pages/SignUp.tsx` (from `src/app/auth/signup/page.tsx`)
  - [ ] `src/pages/Sounds.tsx` (from `src/app/sounds/page.tsx`)
  - [ ] `src/pages/Profile.tsx`
  - [ ] `src/pages/ResetPassword.tsx`
  - [ ] `src/pages/VerifyEmail.tsx`
  - [ ] `src/pages/PrivacyPolicy.tsx`
  - [ ] `src/pages/Terms.tsx`
  - [ ] `src/pages/Welcome.tsx`

#### 3.10 Static Assets
- [ ] Copy `public/` folder to `apps/web/public/`
- [ ] Update font loading if needed
- [ ] Update favicon references
- [ ] Test service worker (`sw.js`)

#### 3.11 Environment Variables
- [ ] Install react-helmet-async: `pnpm add react-helmet-async`
- [ ] Replace metadata exports with `<Helmet>` components
- [ ] Update all `process.env.NEXT_PUBLIC_*` to `import.meta.env.VITE_*`
- [ ] Create utility for environment variables

#### 3.12 Styling
- [ ] Ensure TailwindCSS works correctly
- [ ] Test all custom CSS files
- [ ] Verify FontAwesome icons load
- [ ] Test responsive layouts (mobile + desktop)

---

### Milestone 4: Testing & Validation (Days 10-12)

#### 4.1 Unit Testing
- [ ] Install Vitest: `pnpm add -D vitest @vitest/ui`
- [ ] Create test files for critical utilities
- [ ] Test API client methods
- [ ] Test authentication utilities
- [ ] Test player utilities
- [ ] Run unit tests: `pnpm test`

#### 4.2 Integration Testing
- [ ] Install Supertest: `pnpm add -D supertest @types/supertest`
- [ ] Create backend API tests
- [ ] Test all authentication endpoints
- [ ] Test tracks endpoint
- [ ] Test audio streaming endpoint
- [ ] Run integration tests

#### 4.3 E2E Testing
- [ ] Install Playwright: `pnpm add -D @playwright/test`
- [ ] Create E2E test suite
- [ ] Test authentication flow:
  - [ ] Sign up
  - [ ] Email verification
  - [ ] Login
  - [ ] Logout
  - [ ] Password reset
- [ ] Test track browsing:
  - [ ] Load catalog
  - [ ] Search tracks
  - [ ] Filter tracks
- [ ] Test audio player:
  - [ ] Play track
  - [ ] Pause
  - [ ] Seek (critical)
  - [ ] Volume control
  - [ ] Next/previous
- [ ] Test protected routes
- [ ] Run E2E tests: `pnpm test:e2e`

#### 4.4 Manual Testing
- [ ] Test on Chrome/Edge
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile (Chrome Android)
- [ ] Test on mobile (Safari iOS)
- [ ] Test all features end-to-end:
  - [ ] Complete user journey from signup to playing music
  - [ ] Verify waveform rendering
  - [ ] Verify equalizer visualization
  - [ ] Test all filter combinations
  - [ ] Test PWA install prompt

#### 4.5 Performance Testing
- [ ] Run Lighthouse audit
- [ ] Check bundle size: `pnpm build && du -sh dist/`
- [ ] Optimize large bundles if necessary
- [ ] Test audio streaming latency
- [ ] Test initial page load time
- [ ] Test Time to Interactive (TTI)

#### 4.6 Security Testing
- [ ] Test CORS configuration
- [ ] Verify JWT tokens are secure (HttpOnly cookies)
- [ ] Test rate limiting (if implemented)
- [ ] Test SQL injection protection
- [ ] Test XSS protection
- [ ] Run security headers check (securityheaders.com)

---

### Milestone 5: Deployment (Days 13-15)

#### 5.1 Backend Deployment
- [ ] Choose hosting (Railway, Render, DigitalOcean, AWS)
- [ ] Create production database (if not already exists)
- [ ] Set up environment variables in hosting platform
- [ ] Configure CORS to allow frontend domain
- [ ] Deploy backend API
- [ ] Test API endpoints in production
- [ ] Monitor logs for errors

#### 5.2 Frontend Deployment
- [ ] Choose hosting (Vercel, Netlify, Cloudflare Pages)
- [ ] Configure build command: `pnpm build`
- [ ] Set up environment variables (`VITE_API_BASE_URL`)
- [ ] Deploy frontend
- [ ] Test deployed app
- [ ] Verify API calls work correctly

#### 5.3 Database Migration (if schema changed)
- [ ] Create database migration scripts
- [ ] Test migrations on staging database
- [ ] Run migrations on production
- [ ] Verify data integrity

#### 5.4 DNS & SSL
- [ ] Point domain to new frontend
- [ ] Configure SSL/HTTPS
- [ ] Set up backend subdomain (api.blendtune.com)
- [ ] Test HTTPS on both frontend & backend

#### 5.5 Monitoring Setup
- [ ] Install Sentry: `pnpm add @sentry/react @sentry/node`
- [ ] Configure Sentry for frontend
- [ ] Configure Sentry for backend
- [ ] Set up error alerts
- [ ] Monitor for errors in first 24 hours

#### 5.6 Final Verification
- [ ] Test production app thoroughly
- [ ] Verify all features work in production
- [ ] Check analytics/monitoring
- [ ] Load test (optional - use tools like k6)
- [ ] Get user feedback

---

### Milestone 6: Cleanup & Documentation (Day 15+)

#### 6.1 Code Cleanup
- [ ] Remove old Next.js app code (keep for 1-2 weeks first)
- [ ] Update README.md with new setup instructions
- [ ] Document API endpoints
- [ ] Document environment variables
- [ ] Clean up unused dependencies

#### 6.2 Team Training (if applicable)
- [ ] Train team on new architecture
- [ ] Document development workflow
- [ ] Document deployment process
- [ ] Update contribution guidelines

#### 6.3 Post-Migration Monitoring
- [ ] Monitor error rates for 1 week
- [ ] Monitor performance metrics
- [ ] Gather user feedback
- [ ] Fix any reported issues
- [ ] Optimize based on real usage data

---

## Detailed Steps

### Step 1: Create Monorepo Structure

```bash
# In your project root
mkdir -p apps/web apps/api packages/shared-types packages/api-client

# Create workspace config
cat > pnpm-workspace.yaml << EOF
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# Update root package.json
# Add "private": true and workspaces config
```

### Step 2: Initialize Vite App

```bash
cd apps/web
pnpm create vite@latest . --template react-ts

# Install dependencies
pnpm install

# Install additional deps
pnpm add react-router-dom@7 @tanstack/react-query zustand axios
pnpm add @reduxjs/toolkit react-redux react-helmet-async
pnpm add @fortawesome/react-fontawesome @fortawesome/fontawesome-svg-core
pnpm add react-icons rc-slider date-fns lodash-es

# Dev dependencies
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D @types/lodash-es vitest @vitest/ui
pnpm add -D @playwright/test
```

### Step 3: Initialize Backend API

```bash
cd apps/api
pnpm init

# Install dependencies
pnpm add fastify @fastify/cors @fastify/helmet @fastify/jwt
pnpm add @fastify/cookie @fastify/multipart @fastify/swagger @fastify/swagger-ui
pnpm add pg ioredis bcrypt jsonwebtoken nodemailer
pnpm add dotenv pino pino-pretty uuid fluent-ffmpeg sharp

# Dev dependencies
pnpm add -D typescript tsx @types/node @types/pg @types/bcrypt
pnpm add -D @types/jsonwebtoken @types/nodemailer
pnpm add -D vitest supertest @types/supertest
```

### Step 4: Configure TypeScript

**`apps/web/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**`apps/web/vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

**`apps/api/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Code Examples

### Backend: Fastify Server Setup

**`apps/api/src/index.ts`:**
```typescript
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import routes
import authRoutes from './routes/auth.js'
import accountRoutes from './routes/account.js'
import tracksRoutes from './routes/tracks.js'
import audioRoutes from './routes/audio.js'

// Create Fastify instance
const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
})

// Register plugins
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})

await fastify.register(helmet, {
  contentSecurityPolicy: false, // Customize as needed
})

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
})

await fastify.register(cookie)
await fastify.register(multipart)

// Swagger documentation
await fastify.register(swagger, {
  openapi: {
    info: {
      title: 'BlendTune API',
      description: 'API documentation for BlendTune',
      version: '2.0.0',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
})

await fastify.register(swaggerUI, {
  routePrefix: '/docs',
})

// Register routes
await fastify.register(authRoutes, { prefix: '/api/auth' })
await fastify.register(accountRoutes, { prefix: '/api/account' })
await fastify.register(tracksRoutes, { prefix: '/api/tracks' })
await fastify.register(audioRoutes, { prefix: '/api/audio' })

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 5000
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 Server running at http://localhost:${port}`)
    console.log(`📚 API docs at http://localhost:${port}/docs`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
```

### Backend: Auth Route Example

**`apps/api/src/routes/auth.ts`:**
```typescript
import { FastifyPluginAsync } from 'fastify'
import bcrypt from 'bcrypt'
import { authDB } from '../db/auth.js'
import { generateTokens } from '../services/authService.js'

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Login
  fastify.post('/login', {
    schema: {
      description: 'User login',
      tags: ['auth'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string }

    // Find user
    const result = await authDB.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    if (result.rows.length === 0) {
      return reply.code(401).send({ error: 'Invalid credentials' })
    }

    const user = result.rows[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return reply.code(401).send({ error: 'Invalid credentials' })
    }

    // Check if email is verified
    if (!user.is_verified) {
      return reply.code(403).send({ error: 'Email not verified' })
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
    })

    // Set refresh token in HTTP-only cookie
    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    // Create session record (optional)
    await authDB.query(
      'INSERT INTO sessions (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    )

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  })

  // Logout
  fastify.post('/logout', async (request, reply) => {
    const refreshToken = request.cookies.refreshToken

    if (refreshToken) {
      // Delete session from database
      await authDB.query('DELETE FROM sessions WHERE refresh_token = $1', [refreshToken])
    }

    // Clear cookie
    reply.clearCookie('refreshToken')

    return { message: 'Logged out successfully' }
  })

  // Signup
  fastify.post('/signup', async (request, reply) => {
    const { email, password, name } = request.body as {
      email: string
      password: string
      name: string
    }

    // Check if user exists
    const existing = await authDB.query('SELECT id FROM users WHERE email = $1', [
      email.toLowerCase(),
    ])

    if (existing.rows.length > 0) {
      return reply.code(409).send({ error: 'Email already registered' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const result = await authDB.query(
      `INSERT INTO users (email, password_hash, name, is_verified, created_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name`,
      [email.toLowerCase(), passwordHash, name, false, new Date()]
    )

    const user = result.rows[0]

    // TODO: Send verification email

    return reply.code(201).send({
      message: 'User created successfully. Please verify your email.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  })
}

export default authRoutes
```

### Backend: Audio Streaming Route

**`apps/api/src/routes/audio.ts`:**
```typescript
import { FastifyPluginAsync } from 'fastify'
import fs from 'fs/promises'
import path from 'path'
import { createReadStream } from 'fs'

const audioRoutes: FastifyPluginAsync = async (fastify) => {
  // Stream audio file with Range request support
  fastify.get('/:filename', async (request, reply) => {
    const { filename } = request.params as { filename: string }

    // Sanitize filename (prevent directory traversal)
    const safeFilename = path.basename(filename)
    const filePath = path.join(process.env.AUDIO_FILES_PATH || './audio', safeFilename)

    // Check if file exists
    try {
      const stats = await fs.stat(filePath)
      const fileSize = stats.size

      // Get Range header
      const range = request.headers.range

      // Determine MIME type
      const ext = path.extname(safeFilename).toLowerCase()
      const mimeTypes: Record<string, string> = {
        '.mp3': 'audio/mpeg',
        '.ogg': 'audio/ogg',
        '.wav': 'audio/wav',
        '.flac': 'audio/flac',
        '.webm': 'audio/webm',
      }
      const mimeType = mimeTypes[ext] || 'application/octet-stream'

      // Handle Range request (for seeking)
      if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunkSize = end - start + 1

        reply.code(206) // Partial Content
        reply.header('Content-Range', `bytes ${start}-${end}/${fileSize}`)
        reply.header('Accept-Ranges', 'bytes')
        reply.header('Content-Length', chunkSize)
        reply.header('Content-Type', mimeType)

        const stream = createReadStream(filePath, { start, end })
        return reply.send(stream)
      } else {
        // Send entire file
        reply.header('Content-Length', fileSize)
        reply.header('Content-Type', mimeType)
        reply.header('Accept-Ranges', 'bytes')

        const stream = createReadStream(filePath)
        return reply.send(stream)
      }
    } catch (error) {
      return reply.code(404).send({ error: 'Audio file not found' })
    }
  })

  // HEAD request for metadata
  fastify.head('/:filename', async (request, reply) => {
    const { filename } = request.params as { filename: string }
    const safeFilename = path.basename(filename)
    const filePath = path.join(process.env.AUDIO_FILES_PATH || './audio', safeFilename)

    try {
      const stats = await fs.stat(filePath)
      const ext = path.extname(safeFilename).toLowerCase()
      const mimeTypes: Record<string, string> = {
        '.mp3': 'audio/mpeg',
        '.ogg': 'audio/ogg',
        '.wav': 'audio/wav',
        '.flac': 'audio/flac',
        '.webm': 'audio/webm',
      }
      const mimeType = mimeTypes[ext] || 'application/octet-stream'

      reply.header('Content-Length', stats.size)
      reply.header('Content-Type', mimeType)
      reply.header('Accept-Ranges', 'bytes')
      return reply.send()
    } catch (error) {
      return reply.code(404).send()
    }
  })
}

export default audioRoutes
```

### Frontend: API Client

**`packages/api-client/src/index.ts`:**
```typescript
import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // Send cookies
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor - add JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            // Refresh token endpoint (you'll need to implement this)
            const { data } = await axios.post(
              `${API_BASE_URL}/api/auth/refresh`,
              {},
              { withCredentials: true }
            )

            localStorage.setItem('accessToken', data.accessToken)

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            // Refresh failed, logout user
            localStorage.removeItem('accessToken')
            window.location.href = '/auth/signin'
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Auth API
  auth = {
    login: async (credentials: { email: string; password: string }) => {
      const { data } = await this.client.post('/api/auth/login', credentials)
      localStorage.setItem('accessToken', data.accessToken)
      return data
    },

    signup: async (userData: { email: string; password: string; name: string }) => {
      const { data } = await this.client.post('/api/auth/signup', userData)
      return data
    },

    logout: async () => {
      const { data } = await this.client.post('/api/auth/logout')
      localStorage.removeItem('accessToken')
      return data
    },

    checkSession: async () => {
      const { data } = await this.client.post('/api/auth/security/check-session')
      return data
    },

    confirmEmail: async (token: string) => {
      const { data } = await this.client.post('/api/auth/security/confirm-email', { token })
      return data
    },

    resetPassword: async (email: string) => {
      const { data } = await this.client.post('/api/auth/security/reset-password/create', {
        email,
      })
      return data
    },
  }

  // Account API
  account = {
    getProfile: async () => {
      const { data } = await this.client.get('/api/account/profile')
      return data
    },

    updateProfile: async (profileData: any) => {
      const { data } = await this.client.post('/api/account/profile', profileData)
      return data
    },
  }

  // Tracks API
  tracks = {
    getAll: async () => {
      const { data } = await this.client.get('/api/tracks')
      return data
    },
  }

  // Audio API
  audio = {
    getStreamUrl: (trackId: string) => {
      return `${API_BASE_URL}/api/audio/${trackId}`
    },
  }
}

export const apiClient = new APIClient()
export default apiClient
```

### Frontend: React Router Setup

**`apps/web/src/router.tsx`:**
```typescript
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Sounds from './pages/Sounds'
import Profile from './pages/Profile'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import Welcome from './pages/Welcome'
import ProtectedRoute from './components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'auth',
        children: [
          { path: 'signin', element: <SignIn /> },
          { path: 'signup', element: <SignUp /> },
          { path: 'reset-password', element: <ResetPassword /> },
          { path: 'verify-email', element: <VerifyEmail /> },
        ],
      },
      {
        path: 'sounds',
        element: (
          <ProtectedRoute>
            <Sounds />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
      {
        path: 'welcome',
        element: <Welcome />,
      },
    ],
  },
])
```

### Frontend: Main Entry

**`apps/web/src/main.tsx`:**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Provider as ReduxProvider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { router } from './router'
import { store } from './store'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ReduxProvider>
    </HelmetProvider>
  </React.StrictMode>
)
```

### Frontend: Using TanStack Query for Tracks

**`apps/web/src/hooks/useTracks.ts`:**
```typescript
import { useQuery } from '@tanstack/react-query'
import apiClient from '@blendtune/api-client'

export const useTracks = () => {
  return useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const data = await apiClient.tracks.getAll()
      return data
    },
    staleTime: 3600000, // 1 hour - equivalent to Next.js revalidate: 3600
    gcTime: 3600000, // Keep in cache for 1 hour
  })
}
```

**Usage in component:**
```typescript
import { useTracks } from '@/hooks/useTracks'

function SoundsPage() {
  const { data: tracks, isLoading, error } = useTracks()

  if (isLoading) return <div>Loading tracks...</div>
  if (error) return <div>Error loading tracks</div>

  return (
    <div>
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  )
}
```

---

## Testing Checklist

### Authentication Testing

- [ ] User can sign up with email/password
- [ ] User receives verification email
- [ ] User can verify email with token
- [ ] User can log in with verified account
- [ ] User cannot log in with unverified account
- [ ] User can log out
- [ ] User can request password reset
- [ ] User can reset password with token
- [ ] JWT tokens expire correctly
- [ ] Refresh token rotation works
- [ ] Protected routes redirect to login when not authenticated
- [ ] Sessions persist across page refreshes

### Audio Player Testing

- [ ] Audio plays when play button is clicked
- [ ] Audio pauses when pause button is clicked
- [ ] Seeking works correctly (tests Range requests)
- [ ] Volume control works
- [ ] Next/previous track navigation works
- [ ] Waveform renders correctly
- [ ] Equalizer visualizes frequency data
- [ ] Player state persists (current track, position)
- [ ] Audio streams from backend correctly
- [ ] Different audio formats play (MP3, OGG, FLAC, WebM)

### Track Catalog Testing

- [ ] Tracks load from backend API
- [ ] Search functionality works
- [ ] Filters work (genre, mood, BPM, key, instruments, etc.)
- [ ] Multiple filters can be applied
- [ ] Track cards display correctly
- [ ] Pagination works (if implemented)
- [ ] Sorting works (if implemented)

### UI/UX Testing

- [ ] All pages render correctly
- [ ] Navigation works (links, back button)
- [ ] Responsive layout works on mobile
- [ ] Responsive layout works on tablet
- [ ] Responsive layout works on desktop
- [ ] Dark mode works (if applicable)
- [ ] Fonts load correctly
- [ ] Icons display correctly (FontAwesome)
- [ ] Forms validate input
- [ ] Error messages display correctly
- [ ] Loading states display correctly

### Performance Testing

- [ ] Initial page load < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] Bundle size < 500KB (gzipped)
- [ ] Audio streaming starts < 1 second
- [ ] No memory leaks in player
- [ ] Lighthouse score > 90

### Security Testing

- [ ] HTTPS enforced in production
- [ ] CORS configured correctly
- [ ] JWT tokens stored securely
- [ ] Refresh tokens in HTTP-only cookies
- [ ] SQL injection protection verified
- [ ] XSS protection verified
- [ ] CSRF protection verified (if needed)
- [ ] Rate limiting works (if implemented)
- [ ] Security headers present (Helmet)

---

## Rollback Plan

### If Migration Fails

1. **Keep Next.js code intact** until migration is 100% verified
2. **Use feature branches** - never commit breaking changes to main
3. **DNS/Routing rollback** - point domain back to Next.js deployment
4. **Database rollback** - restore from backup if schema changed
5. **Monitor errors** - use Sentry to catch issues early

### Rollback Steps

```bash
# If deployed and need to rollback

# 1. Revert DNS/routing to old Next.js app
# (depends on your hosting provider)

# 2. Revert git commits
git revert HEAD~10..HEAD  # Revert last 10 commits
git push origin main

# 3. Restore database (if needed)
pg_restore -d blendtune < backup.dump

# 4. Redeploy old Next.js app
npm run build
npm run deploy
```

### Prevention Measures

- [ ] Create comprehensive backup before starting
- [ ] Use staging environment for testing
- [ ] Test rollback procedure in staging
- [ ] Have communication plan for users if downtime occurs
- [ ] Monitor error rates closely for first 48 hours

---

## Estimated Timeline

| Milestone | Duration | Days |
|-----------|----------|------|
| 1. Project Setup | 1-2 days | 1-2 |
| 2. Backend Migration | 3-5 days | 3-7 |
| 3. Frontend Migration | 3-4 days | 10-11 |
| 4. Testing & Validation | 2-3 days | 12-14 |
| 5. Deployment | 1-2 days | 13-15 |
| 6. Cleanup & Documentation | 1+ day | 15+ |

**Total: 10-15 days** (for one developer working full-time)

For a team or part-time work, adjust accordingly.

---

## Success Criteria

Migration is complete when:

- ✅ All features work identically to Next.js version
- ✅ All tests pass (unit, integration, E2E)
- ✅ Performance is equal or better
- ✅ No errors in production monitoring
- ✅ User feedback is positive
- ✅ Code is documented and maintainable

---

## Resources

### Documentation
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router v7](https://reactrouter.com/en/main)
- [Fastify Documentation](https://fastify.dev/docs/latest/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Turborepo Handbook](https://turbo.build/repo/docs)

### Migration Guides
- [Next.js to Vite Migration](https://vitejs.dev/guide/migration.html)
- [Express to Fastify Migration](https://fastify.dev/docs/latest/Guides/Migration-Guide-V3/)

### Community Support
- [Vite Discord](https://chat.vitejs.dev/)
- [Fastify Discord](https://discord.gg/fastify)
- [React Router Discord](https://rmx.as/discord)

---

**Document Maintained By:** Development Team
**Last Updated:** December 2025
**Next Review:** After Phase 1 completion

---

## Quick Start Commands

```bash
# Clone and setup monorepo
git clone <repo>
cd blendtune
pnpm install

# Start backend
cd apps/api
pnpm dev

# Start frontend (in new terminal)
cd apps/web
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

Good luck with your migration! 🚀
