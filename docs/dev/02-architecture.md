# Architecture Overview

This document provides a comprehensive overview of Blendtune's technical architecture, design decisions, and system organization.

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

Blendtune follows a modern **monolithic architecture** with clear separation between client and server code. Built on Next.js 15 with the App Router, it leverages both client-side React and server-side rendering capabilities.

```
┌─────────────────┐
│   Client App    │
│  (Browser/PWA)  │
└────────┬────────┘
         │
         │ HTTPS
         │
┌────────▼────────┐
│   Next.js App   │
│  (API Routes +  │
│   React Pages)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───────┐
│  DB  │  │   CDN    │
│(PG)  │  │(DO Space)│
└──────┘  └──────────┘
```

### Technology Decisions

**Why Next.js?**
- Server-side rendering for better SEO
- API routes eliminate need for separate backend
- File-based routing simplifies development
- Excellent TypeScript support
- Built-in optimization (image, font, code splitting)

**Why PostgreSQL?**
- Robust relational data model
- Complex querying capabilities (filters, joins)
- Excellent JSON support for flexible metadata
- Mature ecosystem and tooling
- ACID compliance for transactions

**Why Context API over Redux?**
- Simpler learning curve
- Less boilerplate code
- Sufficient for our state management needs
- Better tree-shaking
- More aligned with React's direction

## Frontend Architecture

### Feature-Based Organization

Code is organized by **feature modules** rather than technical layers:

```
src/client/features/
├── auth/           # Everything related to authentication
│   ├── components/ # Auth-specific components
│   ├── context/    # Auth state management
│   ├── hooks/      # Auth-related hooks
│   └── services/   # Auth business logic
├── player/         # Audio player feature
├── sounds/         # Music catalog feature
└── tracks/         # Track management feature
```

**Benefits**:
- Easier to locate related code
- Better encapsulation
- Simpler to delete features
- Clearer dependencies
- Team can own entire features

### State Management Strategy

**Three-Tier Approach**:

1. **Local Component State** (`useState`, `useReducer`)
   - UI-only state (modals, dropdowns)
   - Form inputs
   - Temporary view state

2. **Feature Context** (React Context)
   - Player state (`PlayerProvider`)
   - Filter state (`FilterProvider`)
   - Catalog state (`CatalogProvider`)
   - Track state (`TracksProvider`)

3. **Global Context**
   - Session state (`SessionProvider`)
   - App-wide settings
   - Theme preferences

**Redux Usage**:
- Minimal usage in current implementation
- Consider removing or expanding based on needs
- Currently used for some legacy state

### Component Architecture

**Component Hierarchy**:

```
<App>
  <SessionProvider>      # User authentication
    <TracksProvider>     # Track data
      <Page>
        <Header />
        <Content>
          <CatalogProvider>  # Catalog-specific state
            <FilterProvider> # Filter state
              <TrackList />
            </FilterProvider>
          </CatalogProvider>
        </Content>
        <PlayerProvider>   # Player state
          <MusicPlayer />
        </PlayerProvider>
      </Page>
    </TracksProvider>
  </SessionProvider>
</App>
```

**Component Types**:

1. **Layout Components** (`src/client/features/layout/`)
   - Header, Footer, Sidebars
   - Provide structure, no business logic

2. **Feature Components** (`src/client/features/*/components/`)
   - Domain-specific components
   - Contain business logic
   - Self-contained

3. **Shared Components** (`src/client/shared/components/`)
   - Reusable UI elements
   - No business logic
   - Generic and composable

### Routing Strategy

**Next.js App Router**:

```
src/app/
├── page.tsx                # Home page (/)
├── sounds/
│   └── page.tsx           # Catalog (/sounds)
├── auth/
│   ├── signin/page.tsx    # Sign in (/auth/signin)
│   └── signup/page.tsx    # Sign up (/auth/signup)
└── api/
    ├── tracks/route.ts    # API endpoint
    └── auth/*/route.ts    # Auth endpoints
```

**Benefits of App Router**:
- Layouts and nested routing
- Server Components by default
- Streaming and Suspense
- Better data fetching patterns

## Backend Architecture

### API Layer

**RESTful API Design**:

```
/api/tracks              # GET: List all tracks
/api/tracks/:id          # GET: Single track details
/api/audio/:file         # GET: Stream audio file
/api/auth/login          # POST: User login
/api/auth/signup         # POST: User registration
/api/auth/logout         # POST: End session
/api/account             # GET: User account info
/api/account/profile     # PUT: Update profile
```

**API Route Structure**:

```typescript
// src/app/api/tracks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTracksFromDB } from '@/server/services/tracks';

export async function GET(request: NextRequest) {
  try {
    const tracks = await getTracksFromDB();
    return NextResponse.json(tracks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}
```

### Service Layer

**Business Logic Organization**:

```
src/server/services/
├── audio/
│   └── streamingService.ts   # Audio streaming logic
├── auth/
│   ├── authService.ts         # Authentication
│   └── emailService.ts        # Email verification
├── session/
│   └── sessionService.ts      # Session management
└── tracks/
    └── trackMappingService.ts # Track data mapping
```

**Service Pattern**:
- Encapsulate business logic
- Separate from HTTP layer
- Reusable across API routes
- Easy to test in isolation

### Database Layer

**Connection Pooling**:

```typescript
// src/server/db/tracksDbPool.ts
import { Pool } from 'pg';

const tracksPool = new Pool({
  connectionString: process.env.TRACKS_DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default tracksPool;
```

**Multiple Database Pools**:
- `tracksDbPool`: For track metadata (meekah schema)
- `authDbPool`: For authentication (auth schema)
- `usersDbPool`: For user data (users schema)

**Why Separate Pools?**
- Independent scaling
- Fault isolation
- Different connection requirements

## Database Design

### Schema Organization

**Three-Schema Architecture**:

1. **meekah schema** - Track Data
   - `track_info`: Main track metadata
   - `track_arrangement`: Song sections
   - `track_creator`: Creator information
   - `track_instrument`: Instrument tags
   - `track_sample`: Sample information

2. **auth schema** - Authentication
   - `users`: User credentials
   - `sessions`: Active sessions
   - `email_verification`: Email tokens
   - `password_reset`: Reset tokens

3. **users schema** - User Profiles
   - `profile`: Extended user info
   - `roles`: User role assignments
   - `billing`: Subscription info
   - `playlists`: User playlists (future)

### Data Relationships

```
track_info (1) ──> (*) track_arrangement
           (1) ──> (*) track_creator
           (1) ──> (*) track_instrument
           (1) ──> (*) track_sample

auth.users (1) ──> (*) auth.sessions
           (1) ──> (1) users.profile
           (1) ──> (*) users.roles
```

### Indexing Strategy

**Primary Indexes**:
- Primary keys on all tables
- Foreign keys for relationships

**Performance Indexes**:
- `track_info.genre` - Frequent filtering
- `track_info.tempo` - BPM range queries
- `track_info.musical_key` - Key filtering
- `sessions.token` - Session lookups
- `sessions.expires_at` - Cleanup queries

**Composite Indexes** (needed):
- `(genre, tempo, musical_key)` - Multi-filter queries

## External Services

### DigitalOcean Spaces CDN

**Purpose**: Audio file storage and streaming

**Configuration**:
```typescript
const AUDIO_BASE_URL =
  'https://blendtune-public.nyc3.cdn.digitaloceanspaces.com';
```

**Benefits**:
- Global CDN for low latency
- Scalable storage
- S3-compatible API
- Built-in caching

**Audio Streaming Flow**:
```
Client → Next.js API → DO Spaces → Client
         (validates)   (CDN cache)
```

### Email Service (Nodemailer + Gmail)

**Purpose**: Transactional emails

**Email Types**:
- Email verification
- Password reset
- Welcome emails
- Security alerts

**Configuration**:
```typescript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

### Vercel Functions

**Purpose**: IP address detection for session tracking

**Usage**: Enhance security by tracking session IP addresses

## Security Architecture

### Authentication Flow

```
1. User submits credentials
   ↓
2. Server validates (bcrypt)
   ↓
3. Create session record in DB
   ↓
4. Generate session token
   ↓
5. Set HttpOnly cookie
   ↓
6. Return success to client
```

### Session Management

**Session Security**:
- HttpOnly cookies (prevent XSS)
- Secure flag (HTTPS only)
- SameSite attribute (CSRF protection)
- Short expiration times
- IP address tracking
- User-Agent validation

**Session Storage**:
```typescript
interface Session {
  id: string;
  user_id: string;
  token: string;
  ip_address: string;
  user_agent: string;
  created_at: Date;
  expires_at: Date;
  last_activity: Date;
}
```

### Password Security

**Hashing**:
- bcrypt with salt rounds (10-12)
- Never store plain text
- Validate strength on signup

**Reset Flow**:
1. User requests reset
2. Generate secure token
3. Send email with time-limited link
4. Validate token on reset
5. Hash new password
6. Invalidate token

### API Security

**Protection Mechanisms**:
- CORS configuration
- Rate limiting (needed)
- Input validation
- SQL injection prevention (parameterized queries)
- XSS protection (Content Security Policy)

**Middleware Stack**:
```typescript
// Planned middleware
- Rate limiter
- CORS handler
- Auth validator
- Request logger
```

## Performance Considerations

### Frontend Optimizations

1. **Code Splitting**
   - Route-based splitting
   - Dynamic imports for heavy components
   - Lazy loading visualizations

2. **Asset Optimization**
   - Image optimization with Next.js Image
   - Font optimization
   - CSS minification

3. **Caching Strategy**
   - Service worker for offline
   - Browser cache for static assets
   - Cache API for track metadata

### Backend Optimizations

1. **Database Queries**
   - Connection pooling
   - Query result caching (planned)
   - Prepared statements
   - Proper indexing

2. **API Response**
   - Gzip compression
   - JSON minification
   - Pagination for large datasets

3. **Audio Streaming**
   - HTTP range requests
   - CDN caching (1 year)
   - Efficient buffer sizes

### Caching Layers

```
Browser Cache
    ↓
Service Worker Cache
    ↓
CDN Cache (DO Spaces)
    ↓
Application Cache (planned - Redis)
    ↓
Database
```

## Scalability Considerations

### Current Bottlenecks

1. **Database**
   - Single PostgreSQL instance
   - No read replicas
   - Limited connection pool

2. **Audio Streaming**
   - All requests go through Next.js
   - Could bypass for better performance

3. **State Management**
   - All tracks loaded client-side
   - Need server-side pagination

### Future Improvements

1. **Database Scaling**
   - Read replicas for queries
   - Write master for mutations
   - Connection pool tuning

2. **Caching Layer**
   - Redis for session storage
   - Cache query results
   - Cache track metadata

3. **CDN Optimization**
   - Direct CDN links for audio
   - Edge caching for API responses
   - Multi-region deployment

## Development Principles

### Code Quality

- **Type Safety**: Comprehensive TypeScript usage
- **Linting**: ESLint + Stylelint
- **Formatting**: Prettier with consistent config
- **Testing**: Unit + Integration + E2E tests

### Best Practices

1. **DRY (Don't Repeat Yourself)**
   - Extract reusable logic
   - Shared utilities and hooks
   - Component composition

2. **SOLID Principles**
   - Single Responsibility
   - Open/Closed
   - Dependency Inversion

3. **Clean Code**
   - Meaningful names
   - Small functions
   - Clear comments
   - Consistent formatting

## Deployment Architecture

### Production Environment

```
GitHub → Vercel Build → Vercel Edge Network
                ↓
         ┌──────┴───────┐
         │              │
    PostgreSQL    DO Spaces CDN
  (Primary DB)   (Audio Files)
```

### Environment Variables

**Required**:
- `DATABASE_URL` - PostgreSQL connection
- `TRACKS_DATABASE_URL` - Tracks DB
- `AUTH_DATABASE_URL` - Auth DB
- `DO_SPACES_*` - DigitalOcean credentials
- `SMTP_*` - Email service credentials
- `SESSION_SECRET` - Session encryption key

### CI/CD Pipeline

**Automated Checks**:
1. Linting (ESLint)
2. Type checking (TypeScript)
3. Unit tests (Jest)
4. E2E tests (Playwright)
5. Build verification

**Deployment Flow**:
```
PR Created → CI Checks → Review → Merge → Deploy
```

## Monitoring & Observability

### Logging Strategy (Planned)

- **Application Logs**: Errors, warnings, info
- **Access Logs**: API requests, response times
- **Audit Logs**: User actions, security events

### Metrics to Track (Planned)

- Request latency
- Error rates
- Database query performance
- Audio streaming bandwidth
- User engagement

### Error Handling

**Current Approach**:
```typescript
try {
  // Operation
} catch (error) {
  console.error(error);
  return error response;
}
```

**Improved Approach** (planned):
- Centralized error handling
- Error categorization
- Error tracking service (Sentry)
- User-friendly error messages

## Conclusion

Blendtune's architecture balances simplicity with scalability. The monolithic Next.js approach provides rapid development while maintaining clear separation of concerns through feature-based organization. As the platform grows, consider migrating to microservices or adding caching layers for improved performance.

---

**Next Steps**:
- Review [API Documentation](./03-api-documentation.md)
- Understand [Database Schema](./04-database-schema.md)
- Check [Development Roadmap](./01-roadmap.md)
