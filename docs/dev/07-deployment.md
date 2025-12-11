# Deployment Guide

Guide for deploying Blendtune to production environments.

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Environment Setup](#environment-setup)
3. [Vercel Deployment](#vercel-deployment)
4. [Database Setup](#database-setup)
5. [CDN Configuration](#cdn-configuration)
6. [Environment Variables](#environment-variables)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Monitoring & Logging](#monitoring--logging)
9. [Troubleshooting](#troubleshooting)

## Deployment Overview

### Architecture

```
┌─────────────┐
│   GitHub    │
│ (Code Repo) │
└──────┬──────┘
       │ Push
       ▼
┌─────────────┐
│   Vercel    │ ← Builds & Deploys
│   (Hosting) │
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐  ┌─▼──────────┐
│ DB  │  │ DO Spaces  │
│(PG) │  │    (CDN)   │
└─────┘  └────────────┘
```

### Deployment Platforms

**Recommended**: Vercel (Next.js optimized)
**Alternatives**: AWS, Google Cloud, Azure, DigitalOcean

### Deployment Strategy

- **Development**: Auto-deploy on push to `develop` branch
- **Staging**: Auto-deploy on push to `staging` branch
- **Production**: Manual deploy from `main` branch after approval

## Environment Setup

### Prerequisites

1. **Vercel Account** (or alternative platform)
2. **PostgreSQL Database** (managed or self-hosted)
3. **DigitalOcean Spaces** (or alternative CDN/storage)
4. **Email Service** (Gmail SMTP or alternative)
5. **Domain Name** (optional but recommended)

### Required Accounts

- Vercel: https://vercel.com
- DigitalOcean: https://digitalocean.com
- GitHub: https://github.com

## Vercel Deployment

### Initial Setup

1. **Install Vercel CLI** (optional)

```bash
npm install -g vercel
```

2. **Connect GitHub Repository**

- Go to https://vercel.com/new
- Import your GitHub repository
- Select the repository
- Configure project settings

3. **Configure Build Settings**

**Framework Preset**: Next.js

**Build Command**:
```bash
npm run build
```

**Output Directory**:
```
.next
```

**Install Command**:
```bash
npm install
```

**Development Command**:
```bash
npm run dev
```

4. **Environment Variables**

Add all required environment variables (see below)

5. **Deploy**

Click "Deploy" - first deployment will begin automatically

### Subsequent Deployments

**Automatic**:
- Push to connected branch
- Vercel automatically builds and deploys

**Manual** (via CLI):
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Custom Domain

1. **Add Domain in Vercel**:
   - Go to Project Settings > Domains
   - Add your domain
   - Follow DNS configuration instructions

2. **Configure DNS**:
   - Add A record or CNAME as instructed
   - Wait for propagation (can take up to 48 hours)

3. **SSL Certificate**:
   - Vercel automatically provisions Let's Encrypt SSL
   - HTTPS enabled by default

## Database Setup

### PostgreSQL Options

**Option 1: Managed PostgreSQL** (Recommended)
- Vercel Postgres
- DigitalOcean Managed Database
- AWS RDS
- Google Cloud SQL
- Heroku Postgres

**Option 2: Self-Hosted**
- DigitalOcean Droplet
- AWS EC2
- Your own server

### Vercel Postgres Setup

```bash
# Install Vercel Postgres
vercel postgres create
```

Follow prompts to create database.

### Database Migration

1. **Export Local Database**

```bash
pg_dump -U postgres -d blendtune > backup.sql
```

2. **Import to Production**

```bash
# For Vercel Postgres
psql $POSTGRES_URL < backup.sql

# For other providers
psql -h hostname -U username -d database < backup.sql
```

3. **Run Migrations**

```bash
# Apply any pending migrations
npm run migrate
```

### Database Connection Pooling

**Recommended**: Use connection pooling for serverless environments

```typescript
// src/server/db/tracksDbPool.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.TRACKS_DATABASE_URL,
  max: 20, // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
```

## CDN Configuration

### DigitalOcean Spaces Setup

1. **Create Space**:
   - Log in to DigitalOcean
   - Create new Space
   - Choose region (closest to users)
   - Enable CDN

2. **Upload Audio Files**:

```bash
# Install s3cmd or use DigitalOcean CLI
s3cmd put --recursive ./audio/ s3://your-space-name/audio/
```

3. **Set CORS Policy**:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

4. **Set Cache Headers**:

```json
{
  "Cache-Control": "public, max-age=31536000, immutable"
}
```

### CDN URL Configuration

```bash
# .env.production
NEXT_PUBLIC_CDN_URL=https://your-space.nyc3.cdn.digitaloceanspaces.com
```

## Environment Variables

### Required Variables

Create `.env.production` file:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/blendtune
TRACKS_DATABASE_URL=postgresql://user:password@host:5432/blendtune?schema=meekah
AUTH_DATABASE_URL=postgresql://user:password@host:5432/blendtune?schema=auth
USERS_DATABASE_URL=postgresql://user:password@host:5432/blendtune?schema=users

# CDN
NEXT_PUBLIC_CDN_URL=https://your-space.nyc3.cdn.digitaloceanspaces.com
DO_SPACES_KEY=your-access-key
DO_SPACES_SECRET=your-secret-key
DO_SPACES_ENDPOINT=nyc3.digitaloceanspaces.com
DO_SPACES_BUCKET=your-bucket-name

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# Session
SESSION_SECRET=generate-strong-random-string-here
SESSION_EXPIRY=604800000

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Optional
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id
```

### Generating Secrets

```bash
# Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Setting Variables in Vercel

1. Go to Project Settings > Environment Variables
2. Add each variable
3. Select environment (Production, Preview, Development)
4. Save

**Via CLI**:
```bash
vercel env add SESSION_SECRET production
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linters
        run: |
          npm run lint
          npm run stylelint

      - name: Type check
        run: npm run type-check

      - name: Run tests
        run: npm run test:ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Pre-deployment Checks

```yaml
- name: Pre-deployment checks
  run: |
    npm run lint
    npm run type-check
    npm run test
    npm run build
```

### Deployment Notifications

**Slack Integration**:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

## Monitoring & Logging

### Error Tracking

**Sentry Setup**:

```bash
npm install @sentry/nextjs
```

**Configuration** (`sentry.client.config.ts`):

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

**Vercel Analytics**:

```bash
npm install @vercel/analytics
```

**Setup**:

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Logging

**Production Logging**:

```typescript
// src/server/lib/logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
});

export default logger;
```

**Usage**:

```typescript
import logger from '@/server/lib/logger';

logger.info('User logged in', { userId: user.id });
logger.error('Database error', { error: err.message });
```

### Uptime Monitoring

**Options**:
- Vercel built-in monitoring
- UptimeRobot
- Pingdom
- StatusCake

## Troubleshooting

### Common Issues

#### Build Failures

**Issue**: Build fails on Vercel

**Solutions**:
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Test build locally: `npm run build`
- Check for TypeScript errors
- Ensure all dependencies are in `package.json`

#### Database Connection Issues

**Issue**: Can't connect to database

**Solutions**:
- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel IPs
- Verify SSL requirements
- Check connection pool settings
- Test connection locally

#### CDN/Audio Not Loading

**Issue**: Audio files not playing

**Solutions**:
- Verify CDN URL is correct
- Check CORS configuration
- Ensure files are publicly accessible
- Check browser console for errors
- Verify audio file paths

#### Environment Variables Not Working

**Issue**: Environment variables undefined

**Solutions**:
- Redeploy after adding variables
- Check variable names (case-sensitive)
- Client variables need `NEXT_PUBLIC_` prefix
- Restart development server locally

### Debug Mode

Enable debug logging:

```bash
# .env.local
DEBUG=*
LOG_LEVEL=debug
```

### Health Check Endpoint

Create `/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/server/db';

export async function GET() {
  try {
    await testDatabaseConnection();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
```

### Rollback Procedure

**Vercel**:
1. Go to Deployments
2. Find previous working deployment
3. Click "..." menu
4. Select "Promote to Production"

**Via CLI**:
```bash
vercel rollback
```

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrated and seeded
- [ ] CDN configured with correct CORS
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Error tracking (Sentry) active
- [ ] Analytics tracking active
- [ ] Monitoring/alerts configured
- [ ] Health check endpoint working
- [ ] Test critical user flows
- [ ] Verify email sending works
- [ ] Check audio playback
- [ ] Test authentication flow
- [ ] Review security headers
- [ ] Check performance metrics

## Security Checklist

- [ ] HTTPS enforced
- [ ] Environment variables secured
- [ ] Database has strong password
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] CSP headers configured
- [ ] Session secrets rotated
- [ ] Dependencies updated
- [ ] Security headers set
- [ ] SQL injection prevention verified

## Performance Optimization

### Next.js Configuration

```javascript
// next.config.js
module.exports = {
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
      ],
    },
  ],
};
```

### CDN Caching

Set aggressive caching for static assets:

```
Cache-Control: public, max-age=31536000, immutable
```

---

**Last Updated**: January 2025
