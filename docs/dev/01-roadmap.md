# Development Roadmap

This document outlines planned features, improvements, and technical debt that needs to be addressed in Blendtune.

## Current Status

**Version**: 1.0 (MVP)
**Last Updated**: January 2025

The current version includes core functionality:
- ✅ User authentication and session management
- ✅ Music catalog with advanced filtering
- ✅ Audio player with waveform visualization
- ✅ Real-time frequency equalizer
- ✅ Responsive design (mobile + desktop)
- ✅ PostgreSQL database integration
- ✅ CDN audio streaming

## Short-Term Goals (Q1 2025)

### Priority 1: User Experience Enhancements

#### Playlist Management
**Status**: Not started
**Priority**: High
**Description**: Allow users to create, edit, and manage playlists

**Tasks**:
- [ ] Design playlist database schema
- [ ] Create playlist API endpoints
- [ ] Build playlist UI components
- [ ] Implement drag-and-drop reordering
- [ ] Add playlist sharing functionality
- [ ] Create collaborative playlists feature

**Files to modify**:
- `main/server/db/src/migrations/` - Add playlist tables
- `main/apps/server/src/http/routes/` + `main/server/core/src/playlists/` - Routes and logic
- `main/apps/web/src/client/features/playlists/` - New feature module
- `main/shared/src/types/playlist.ts` - Type definitions

#### Favorites/Likes System
**Status**: Not started
**Priority**: High
**Description**: Let users mark tracks as favorites

**Tasks**:
- [ ] Add favorites table to database
- [ ] Create favorites API endpoints
- [ ] Add heart/like button to track cards
- [ ] Create favorites page/view
- [ ] Implement unfavorite functionality
- [ ] Add favorites count to tracks

**Files to modify**:
- `main/server/db/src/migrations/` - Add favorites/likes table
- `main/apps/server/src/http/routes/` - New API routes
- `main/apps/web/src/client/features/tracks/` - Add favorite button component
- `main/server/core/src/favorites/` - Business logic

#### Download Management
**Status**: Not started
**Priority**: Medium
**Description**: Enable track downloads with license tracking

**Tasks**:
- [ ] Implement download API endpoint
- [ ] Add license validation logic
- [ ] Create download history tracking
- [ ] Build download UI with progress indicator
- [ ] Add download limits per plan
- [ ] Generate watermarked preview downloads

**Files to modify**:
- `main/apps/server/src/http/routes/` - Download endpoints
- `main/server/core/src/licensing/` - License validation
- `main/apps/web/src/client/features/downloads/` - Download UI
- `main/server/db/src/migrations/` - Download history table

### Priority 2: Search & Discovery

#### Advanced Search
**Status**: Partial implementation
**Priority**: High
**Description**: Enhance search with autocomplete and suggestions

**Tasks**:
- [ ] Implement full-text search with PostgreSQL
- [ ] Add search autocomplete
- [ ] Create "similar tracks" recommendations
- [ ] Build search history
- [ ] Add trending searches
- [ ] Implement search analytics

**Files to modify**:
- `main/apps/server/src/http/routes/` - Enhanced search endpoints
- `main/apps/web/src/client/features/sounds/search/` - Improved search UI
- `main/server/core/src/search/` - Search algorithms
- `main/server/db/src/migrations/` - Search indexes

#### Personalized Recommendations
**Status**: Not started
**Priority**: Medium
**Description**: ML-based track recommendations

**Tasks**:
- [ ] Track user listening behavior
- [ ] Implement collaborative filtering
- [ ] Create recommendation engine
- [ ] Build "Recommended for You" section
- [ ] Add "Because you liked" feature
- [ ] A/B test recommendation algorithms

**Files to modify**:
- `main/server/core/src/recommendations/` - New service
- `main/apps/server/src/http/routes/` - API endpoints
- `main/apps/web/src/client/features/home/` - Recommendations UI
- `main/server/db/src/migrations/` - User behavior tracking tables

### Priority 3: Performance & Optimization

#### Audio Streaming Optimization
**Status**: Basic implementation complete
**Priority**: High
**Description**: Improve audio loading and buffering

**Tasks**:
- [ ] Implement adaptive bitrate streaming
- [ ] Add audio preloading for next track
- [ ] Optimize waveform rendering performance
- [ ] Cache waveform data
- [ ] Reduce initial load time
- [ ] Add service worker audio caching

**Files to modify**:
- `main/apps/web/src/client/features/player/services/AudioService.ts`
- `main/apps/web/src/client/features/player/visualizer/Waveform.tsx`
- `main/apps/server/src/http/routes/media.ts` + `main/server/media/` - Audio streaming

#### Database Query Optimization
**Status**: Not started
**Priority**: Medium
**Description**: Optimize slow database queries

**Tasks**:
- [ ] Add database indexes on commonly filtered columns
- [ ] Implement query result caching
- [ ] Optimize JOIN operations
- [ ] Add database connection pooling improvements
- [ ] Create materialized views for complex queries
- [ ] Profile and optimize N+1 queries

**Files to modify**:
- `db/` - Add indexes to schema
- `main/server/db/src/client.ts` - Connection handling
- `main/server/core/src/tracks/` - Query optimization
- Add Redis caching layer (new dependency)

#### Bundle Size Reduction
**Status**: Not started
**Priority**: Medium
**Description**: Reduce JavaScript bundle size

**Tasks**:
- [ ] Implement code splitting for routes
- [ ] Lazy load heavy components
- [ ] Tree-shake unused dependencies
- [ ] Optimize FontAwesome imports
- [ ] Replace heavy libraries with lighter alternatives
- [ ] Implement dynamic imports

**Files to modify**:
- `main/apps/web/vite.config.ts` - Build optimizations
- `main/apps/web/src/client/features/*/` - Dynamic imports
- `package.json` - Audit dependencies

## Medium-Term Goals (Q2-Q3 2025)

### Social Features

#### User Profiles
**Status**: Basic implementation
**Priority**: Medium
**Description**: Enhanced public user profiles

**Tasks**:
- [ ] Create public profile pages
- [ ] Add user bio and avatar
- [ ] Display public playlists
- [ ] Show listening statistics
- [ ] Add follow/followers system
- [ ] Create activity feed

#### Comments & Reviews
**Status**: Not started
**Priority**: Low
**Description**: Let users comment on tracks

**Tasks**:
- [ ] Design comments schema
- [ ] Build comments API
- [ ] Create comment UI components
- [ ] Add moderation tools
- [ ] Implement reporting system
- [ ] Add rating system (1-5 stars)

### Creator Tools

#### Artist Dashboard
**Status**: Not started
**Priority**: Medium
**Description**: Dashboard for music creators

**Tasks**:
- [ ] Create artist onboarding flow
- [ ] Build upload/submission system
- [ ] Add analytics dashboard
- [ ] Display streaming statistics
- [ ] Show revenue reports
- [ ] Implement track management

#### Licensing Management
**Status**: Basic implementation
**Priority**: High
**Description**: Comprehensive licensing system

**Tasks**:
- [ ] Define license types (sync, master, exclusive)
- [ ] Create licensing database schema
- [ ] Build license selection UI
- [ ] Implement license agreement generation
- [ ] Add custom licensing requests
- [ ] Create licensing documentation

### Mobile App

#### Progressive Web App Enhancements
**Status**: Basic PWA support
**Priority**: Medium
**Description**: Improve PWA capabilities

**Tasks**:
- [ ] Add offline track caching
- [ ] Implement background audio playback
- [ ] Create install prompts
- [ ] Add push notifications
- [ ] Improve mobile UI/UX
- [ ] Add media session API support

#### Native Mobile Apps
**Status**: Not started
**Priority**: Low (future consideration)
**Description**: iOS and Android native apps

**Tasks**:
- Research React Native vs native development
- Determine feature parity requirements
- Plan development timeline
- Consider using Capacitor/Ionic

## Long-Term Goals (Q4 2025+)

### Advanced Features

#### AI-Powered Features
- Automatic track tagging using ML
- Voice search for tracks
- AI-generated playlists based on mood/activity
- Automatic mastering/audio enhancement
- Copyright detection

#### Collaboration Tools
- Real-time collaborative playlists
- Project workspaces for teams
- Shared track collections
- Team licensing and billing
- Project-based organization

#### Enterprise Features
- API for third-party integrations
- White-label solution for partners
- Bulk licensing for agencies
- Advanced analytics and reporting
- SSO/SAML authentication
- Custom branding options

### Infrastructure

#### Microservices Architecture
**Status**: Single Fastify process currently
**Priority**: Low
**Description**: Consider breaking into microservices

**Evaluation needed**:
- Split audio streaming into separate service
- Extract recommendation engine
- Separate authentication service
- Use message queue for async tasks

#### Multi-Region Support
**Status**: Single region
**Priority**: Low
**Description**: Global CDN and database distribution

**Tasks**:
- Implement multi-region CDN
- Add database replication
- Create edge caching
- Optimize for international users

## Technical Debt

### High Priority

1. **Error Handling Standardization**
   - Inconsistent error handling across API routes
   - Need centralized error logging
   - Improve user-facing error messages
   - **Files**: `main/apps/server/src/http/routes/`, `main/server/core/src/errors.ts`

2. **Test Coverage**
   - Current coverage is minimal
   - Need unit tests for core services
   - Add repository/integration tests against a test database
   - **Files**: Colocated `*.test.ts` files across `main/`

3. **Type Safety Hardening**
   - Strict mode is enabled; keep it zero-`any`
   - Continue inferring types from Zod schemas in `main/shared`
   - **Files**: `tsconfig.json`, any remaining loosely-typed modules

4. **Authentication Security Audit**
   - Refresh tokens (rotating, reuse-detected) are implemented — keep auditing the family logic
   - Add rate limiting to auth endpoints
   - Review CSRF protection
   - **Files**: `main/server/core/src/auth/`, `main/apps/server/src/http/routes/auth.ts`

### Medium Priority

5. **Code Documentation**
   - Add JSDoc comments to functions
   - Document complex algorithms
   - Create inline code comments
   - **Files**: All source files

6. **State Management Consistency**
   - Redux Toolkit is the primary global store (catalog, filters, player)
   - Keep scoped concerns in React Context; avoid duplicating state across both
   - **Files**: `main/apps/web/src/client/core/store/`

7. **CSS Architecture**
   - Inconsistent use of Tailwind utilities vs custom CSS
   - Standardize approach
   - Remove unused styles
   - **Files**: All `.css` and component files

8. **Environment Configuration**
   - Better validation of environment variables
   - Type-safe env vars
   - Clear documentation of required vars
   - **Files**: `.env.example`, config files

### Low Priority

9. **Code Splitting Optimization**
   - Review and optimize code splits
   - Lazy load more components
   - **Files**: Component imports

10. **Dependency Audit**
    - Remove unused dependencies
    - Update outdated packages
    - Check for security vulnerabilities
    - **Files**: `package.json`

## Feature Requests from Users

Track user-requested features here:

- [ ] Collaborative playlists (Requested: 5 times)
- [ ] Offline mode (Requested: 8 times)
- [ ] Crossfade between tracks (Requested: 3 times)
- [ ] Keyboard shortcuts (Requested: 2 times)
- [ ] Dark mode (Requested: 12 times)
- [ ] Lyrics display (Requested: 1 time)
- [ ] Export to Spotify/Apple Music (Requested: 4 times)

## Breaking Changes to Consider

### Database Schema Changes
- Normalize track metadata (breaking change)
- Add proper foreign key constraints
- (Done: consolidated to a single schema with Row-Level Security)

### API Changes
- Version API endpoints (v1, v2)
- Deprecate old session management
- Standardize response formats

## Contributing

Want to work on something from this roadmap?

1. Check if issue exists or create one
2. Comment on issue to claim it
3. Review technical design docs
4. Create feature branch
5. Submit PR with tests and documentation

## Priority Legend

- **High**: Critical for user experience or business goals
- **Medium**: Important but not urgent
- **Low**: Nice to have, future consideration

## Status Legend

- **Not started**: Planning phase
- **In progress**: Actively being developed
- **Blocked**: Waiting on dependencies
- **Complete**: Shipped to production

---

**Last Updated**: January 2025
**Next Review**: April 2025
