# Contributing Guidelines

Thank you for considering contributing to Blendtune! This document provides guidelines and best practices for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Testing Requirements](#testing-requirements)
6. [Pull Request Process](#pull-request-process)
7. [Commit Message Guidelines](#commit-message-guidelines)
8. [Documentation](#documentation)

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Prioritize project goals over personal preferences
- Respect different viewpoints and experiences

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks or trolling
- Publishing private information
- Inappropriate or unwelcome advances
- Other unprofessional conduct

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18+ or 20+ installed
- PostgreSQL 14+ running locally
- Git configured with your name and email
- A code editor (VS Code recommended)
- Basic understanding of Next.js, React, and TypeScript

### Setting Up Development Environment

1. **Fork the Repository**

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/blendtune-nextjs.git
cd blendtune-nextjs
```

2. **Add Upstream Remote**

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/blendtune-nextjs.git
git fetch upstream
```

3. **Install Dependencies**

```bash
npm install
```

4. **Set Up Environment Variables**

```bash
cp .env.example .env.local
# Edit .env.local with your local configuration
```

5. **Initialize Database**

```bash
# Create database
createdb blendtune

# Import schemas
psql -d blendtune < db/blendtune_tracks_backup.sql
psql -d blendtune < db/blendtune_users_backup.sql
```

6. **Run Development Server**

```bash
npm run dev
```

7. **Verify Setup**

- Open http://localhost:3000
- Sign up for a test account
- Try playing a track
- Ensure no console errors

## Development Workflow

### 1. Choose an Issue

- Browse open issues labeled `good first issue` or `help wanted`
- Comment on the issue to claim it
- Wait for maintainer approval before starting work

### 2. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/short-description
# or
git checkout -b fix/bug-description
```

**Branch Naming Convention**:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions or fixes
- `chore/` - Maintenance tasks

### 3. Make Changes

- Write clean, readable code
- Follow coding standards (see below)
- Add tests for new functionality
- Update documentation as needed
- Commit frequently with clear messages

### 4. Test Your Changes

```bash
# Run linters
npm run lint
npm run stylelint

# Run type checking
npm run type-check

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/short-description

# Create PR on GitHub
# Fill out the PR template completely
```

## Coding Standards

### TypeScript

**Use TypeScript everywhere**:
```typescript
// ✅ Good
interface Track {
  id: string;
  title: string;
  duration: number;
}

function getTrack(id: string): Track {
  // ...
}

// ❌ Bad
function getTrack(id: any): any {
  // ...
}
```

**Avoid `any` type**:
```typescript
// ✅ Good
const tracks: Track[] = [];

// ❌ Bad
const tracks: any = [];
```

### React Components

**Use functional components with TypeScript**:
```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ❌ Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

**Use descriptive prop names**:
```typescript
// ✅ Good
<TrackCard track={track} onPlay={handlePlay} />

// ❌ Bad
<TrackCard data={track} onClick={handlePlay} />
```

### File Organization

**Feature-based structure**:
```
src/client/features/player/
├── components/
│   ├── PlayerControls.tsx
│   └── VolumeSlider.tsx
├── context/
│   └── PlayerContext.tsx
├── hooks/
│   └── usePlayer.ts
├── services/
│   └── AudioService.ts
└── types/
    └── player.types.ts
```

**One component per file**:
```typescript
// ✅ Good
// TrackCard.tsx
export function TrackCard() { }

// TrackList.tsx
export function TrackList() { }

// ❌ Bad
// Components.tsx
export function TrackCard() { }
export function TrackList() { }
```

### Naming Conventions

**Components**: PascalCase
```typescript
PlayerControls.tsx
TrackCard.tsx
FilterPanel.tsx
```

**Functions and variables**: camelCase
```typescript
const trackList = [];
function handlePlayback() { }
```

**Constants**: UPPER_SNAKE_CASE
```typescript
const MAX_TRACKS = 100;
const API_BASE_URL = '...';
```

**Types and Interfaces**: PascalCase
```typescript
interface Track { }
type PlayerState = { };
```

### Code Style

**Use Prettier** (automatic formatting):
```bash
npm run format
```

**ESLint rules** (enforced):
```bash
npm run lint
```

**Line length**: Maximum 100 characters (soft limit)

**Imports**: Group and order imports
```typescript
// 1. External libraries
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Internal modules
import { TrackCard } from '@/client/features/tracks';
import { usePlayer } from '@/client/features/player';

// 3. Types
import type { Track } from '@/shared/types';

// 4. Styles
import styles from './TrackList.module.css';
```

### Comments

**JSDoc for functions**:
```typescript
/**
 * Filters tracks by genre and tempo range
 * @param tracks - Array of tracks to filter
 * @param genre - Genre to filter by
 * @param minTempo - Minimum BPM
 * @param maxTempo - Maximum BPM
 * @returns Filtered array of tracks
 */
function filterTracks(
  tracks: Track[],
  genre: string,
  minTempo: number,
  maxTempo: number
): Track[] {
  // Implementation
}
```

**Inline comments for complex logic**:
```typescript
// Calculate half-time tempo (feels half as fast)
const halfTimeTempo = tempo / 2;

// Check if track matches tempo range, including half-time and double-time
const matchesTempo =
  (tempo >= minTempo && tempo <= maxTempo) ||
  (halfTimeTempo >= minTempo && halfTimeTempo <= maxTempo) ||
  (tempo * 2 >= minTempo && tempo * 2 <= maxTempo);
```

**Avoid obvious comments**:
```typescript
// ❌ Bad
// Set the track to playing
setIsPlaying(true);

// ✅ Good (no comment needed)
setIsPlaying(true);
```

## Testing Requirements

### Unit Tests

**Write tests for**:
- Utility functions
- Services and business logic
- Custom hooks
- Context providers

**Test file naming**: `ComponentName.test.tsx` or `functionName.test.ts`

**Example**:
```typescript
// src/client/shared/utils/formatDuration.test.ts
import { formatDuration } from './formatDuration';

describe('formatDuration', () => {
  it('formats seconds into MM:SS', () => {
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(3599)).toBe('59:59');
  });

  it('handles zero and negative values', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(-10)).toBe('0:00');
  });
});
```

### Integration Tests

**Test interactions between**:
- API routes and database
- Components and contexts
- Services and external APIs

### End-to-End Tests

**Test critical user flows**:
- Sign up and email verification
- Sign in and session creation
- Browse catalog and apply filters
- Play tracks and use player controls

**Example**:
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
  await page.goto('/auth/signup');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'TestPass123!');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/auth/verify-email');
});
```

### Test Coverage

**Aim for**:
- 80% coverage for utils and services
- 70% coverage for components
- 100% coverage for critical paths (auth, payments)

**Run coverage report**:
```bash
npm run test:coverage
```

## Pull Request Process

### Before Creating PR

- [ ] All tests pass
- [ ] Linters pass with no errors
- [ ] Code is formatted with Prettier
- [ ] Documentation is updated
- [ ] Commits follow message guidelines
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots or GIFs

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex logic
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
```

### Review Process

1. **Automated checks** run (CI/CD)
2. **Code review** by maintainers
3. **Feedback addressed** if needed
4. **Approval** from at least one maintainer
5. **Merge** to main branch

### After Merge

- Delete your feature branch
- Update your fork's main branch
- Close related issues

## Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Simple commit
git commit -m "feat(player): add waveform visualization"

# Detailed commit
git commit -m "fix(auth): prevent session fixation attack

- Regenerate session token after login
- Add session IP validation
- Implement session rotation

Closes #456"
```

### Rules

- Use present tense ("add" not "added")
- Use imperative mood ("move cursor" not "moves cursor")
- First line max 72 characters
- Reference issues and PRs in footer

## Documentation

### When to Update Docs

- Adding new features
- Changing APIs
- Updating configuration
- Fixing bugs that affect behavior
- Improving performance

### Documentation Types

1. **Code Comments**: Complex logic, algorithms
2. **README**: Project overview, quick start
3. **API Docs**: Endpoint reference
4. **User Manual**: End-user guides
5. **Developer Docs**: Architecture, contributing

### Writing Guidelines

- **Clear and concise**: Avoid jargon
- **Examples**: Show, don't just tell
- **Updated**: Keep in sync with code
- **Organized**: Logical structure
- **Searchable**: Use clear headings and keywords

## Getting Help

### Resources

- [Architecture Overview](./02-architecture.md)
- [API Documentation](./03-api-documentation.md)
- [Database Schema](./04-database-schema.md)
- [Testing Guide](./06-testing.md)

### Communication

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: Questions, ideas
- **Pull Request Comments**: Code-specific discussions

### Questions?

If you have questions:
1. Check existing documentation
2. Search closed issues
3. Ask in GitHub Discussions
4. Tag maintainers if urgent

## Recognition

Contributors are recognized:
- Listed in README contributors section
- Mentioned in release notes
- Given credit in commit history

Thank you for contributing to Blendtune! 🎵

---

**Last Updated**: January 2025
