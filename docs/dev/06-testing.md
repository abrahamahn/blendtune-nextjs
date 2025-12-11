# Testing Guide

Comprehensive guide for testing Blendtune applications.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Setup](#test-setup)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Test Coverage](#test-coverage)
7. [Best Practices](#best-practices)

## Testing Philosophy

### Testing Pyramid

```
        /\
       /  \
      / E2E \          Few, critical user flows
     /------\
    /        \
   / Integra  \       Moderate, feature testing
  /------------\
 /              \
/   Unit Tests   \    Many, fast, isolated
------------------
```

**Rationale**:
- **Unit tests**: Fast, many, test individual functions
- **Integration tests**: Moderate speed, test interactions
- **E2E tests**: Slow, few, test complete user flows

### Test-Driven Development (TDD)

**Recommended approach** for new features:

1. **Red**: Write failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

**Benefits**:
- Better designed code
- Higher test coverage
- Fewer bugs
- Living documentation

## Test Setup

### Test Framework

**Jest** - Unit and integration tests
**Playwright** - End-to-end tests

### Installation

```bash
# Already installed via package.json
npm install
```

### Configuration

**Jest** (`jest.config.js`):
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
};
```

**Playwright** (`playwright.config.ts`):
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
```

## Unit Testing

### What to Test

- **Utility functions**: Pure functions, helpers
- **Services**: Business logic, data transformations
- **Hooks**: Custom React hooks
- **Components**: User interactions, rendering

### Testing Utilities

**Example**: `src/client/shared/utils/formatDuration.test.ts`

```typescript
import { formatDuration } from './formatDuration';

describe('formatDuration', () => {
  it('formats seconds into MM:SS format', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(5)).toBe('0:05');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(3599)).toBe('59:59');
  });

  it('handles negative values by returning 0:00', () => {
    expect(formatDuration(-10)).toBe('0:00');
    expect(formatDuration(-100)).toBe('0:00');
  });

  it('handles large durations', () => {
    expect(formatDuration(36000)).toBe('600:00'); // 10 hours
  });
});
```

### Testing Services

**Example**: `src/server/services/tracks/trackMappingService.test.ts`

```typescript
import { mapTrackData } from './trackMappingService';

describe('trackMappingService', () => {
  describe('mapTrackData', () => {
    it('maps database track to API track format', () => {
      const dbTrack = {
        id: '123',
        title: 'Test Track',
        artist: 'Test Artist',
        duration: 180,
        tempo: 120,
        musical_key: 'C',
        scale: 'major',
        genre: 'Electronic',
        audio_filename: 'test.mp3',
      };

      const result = mapTrackData(dbTrack);

      expect(result).toEqual({
        id: '123',
        title: 'Test Track',
        artist: 'Test Artist',
        duration: 180,
        tempo: 120,
        musicalKey: 'C',
        scale: 'major',
        genre: 'Electronic',
        audioUrl: expect.stringContaining('test.mp3'),
      });
    });

    it('handles missing optional fields', () => {
      const dbTrack = {
        id: '123',
        title: 'Test Track',
        duration: 180,
        audio_filename: 'test.mp3',
      };

      const result = mapTrackData(dbTrack);

      expect(result.artist).toBeUndefined();
      expect(result.tempo).toBeUndefined();
    });
  });
});
```

### Testing React Components

**Example**: `src/client/features/player/components/PlayerControls.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerControls } from './PlayerControls';

describe('PlayerControls', () => {
  it('renders play button when paused', () => {
    render(
      <PlayerControls
        isPlaying={false}
        onPlay={jest.fn()}
        onPause={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
  });

  it('renders pause button when playing', () => {
    render(
      <PlayerControls
        isPlaying={true}
        onPlay={jest.fn()}
        onPause={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('calls onPlay when play button is clicked', () => {
    const onPlay = jest.fn();

    render(
      <PlayerControls
        isPlaying={false}
        onPlay={onPlay}
        onPause={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /play/i }));

    expect(onPlay).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Custom Hooks

**Example**: `src/client/features/player/hooks/usePlayer.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react';
import { usePlayer } from './usePlayer';

describe('usePlayer', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => usePlayer());

    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentTrack).toBeNull();
    expect(result.current.volume).toBe(1);
  });

  it('updates isPlaying state when play is called', () => {
    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.play({ id: '123', title: 'Test' });
    });

    expect(result.current.isPlaying).toBe(true);
    expect(result.current.currentTrack?.id).toBe('123');
  });

  it('updates volume when setVolume is called', () => {
    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.setVolume(0.5);
    });

    expect(result.current.volume).toBe(0.5);
  });
});
```

### Testing Context Providers

**Example**: `src/client/features/player/context/PlayerContext.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { PlayerProvider, usePlayerContext } from './PlayerContext';

function TestComponent() {
  const { isPlaying } = usePlayerContext();
  return <div>{isPlaying ? 'Playing' : 'Paused'}</div>;
}

describe('PlayerProvider', () => {
  it('provides player context to children', () => {
    render(
      <PlayerProvider>
        <TestComponent />
      </PlayerProvider>
    );

    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const spy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('usePlayerContext must be used within PlayerProvider');

    spy.mockRestore();
  });
});
```

## Integration Testing

### What to Test

- **API routes**: Request handling, validation, database interaction
- **Feature workflows**: Multiple components working together
- **Database operations**: CRUD operations, queries

### Testing API Routes

**Example**: `src/app/api/tracks/route.test.ts`

```typescript
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock database
jest.mock('@/server/services/tracks', () => ({
  getTracksFromDB: jest.fn(),
}));

import { getTracksFromDB } from '@/server/services/tracks';

describe('GET /api/tracks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns tracks successfully', async () => {
    const mockTracks = [
      { id: '1', title: 'Track 1' },
      { id: '2', title: 'Track 2' },
    ];

    (getTracksFromDB as jest.Mock).mockResolvedValue(mockTracks);

    const request = new NextRequest('http://localhost:3000/api/tracks');
    const response = await GET(request);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.data).toEqual(mockTracks);
  });

  it('returns 500 on database error', async () => {
    (getTracksFromDB as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const request = new NextRequest('http://localhost:3000/api/tracks');
    const response = await GET(request);

    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data.error).toBeDefined();
  });
});
```

### Testing Database Operations

**Example**: `src/server/services/tracks/trackService.test.ts`

```typescript
import { Pool } from 'pg';
import { getTracksFromDB, getTrackById } from './trackService';

// Use test database
const testPool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL,
});

describe('trackService', () => {
  beforeAll(async () => {
    // Set up test data
    await testPool.query(`
      INSERT INTO meekah.track_info (id, title, duration, audio_filename)
      VALUES ('test-1', 'Test Track', 180, 'test.mp3')
    `);
  });

  afterAll(async () => {
    // Clean up
    await testPool.query(`DELETE FROM meekah.track_info WHERE id = 'test-1'`);
    await testPool.end();
  });

  it('retrieves all tracks', async () => {
    const tracks = await getTracksFromDB();

    expect(tracks).toBeInstanceOf(Array);
    expect(tracks.length).toBeGreaterThan(0);
  });

  it('retrieves track by ID', async () => {
    const track = await getTrackById('test-1');

    expect(track).toBeDefined();
    expect(track?.id).toBe('test-1');
    expect(track?.title).toBe('Test Track');
  });

  it('returns null for non-existent track', async () => {
    const track = await getTrackById('non-existent');

    expect(track).toBeNull();
  });
});
```

## End-to-End Testing

### What to Test

- **Critical user flows**: Sign up, login, playback
- **Cross-browser compatibility**: Chrome, Firefox, Safari
- **Responsive design**: Mobile, tablet, desktop
- **Accessibility**: Keyboard navigation, screen readers

### Authentication Flow

**Example**: `e2e/auth.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can sign up', async ({ page }) => {
    await page.goto('/auth/signup');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.check('input[name="acceptTerms"]');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/verify-email/);
    await expect(page.locator('text=check your email')).toBeVisible();
  });

  test('user can sign in', async ({ page }) => {
    await page.goto('/auth/signin');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/sounds');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'WrongPassword');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });
});
```

### Player Functionality

**Example**: `e2e/player.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Audio Player', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/sounds');
  });

  test('can play a track', async ({ page }) => {
    // Click first track
    await page.click('.track-card:first-child');

    // Wait for player to appear
    await expect(page.locator('.music-player')).toBeVisible();

    // Check play button changes to pause
    await expect(page.locator('button[aria-label="Pause"]')).toBeVisible();
  });

  test('can adjust volume', async ({ page }) => {
    await page.click('.track-card:first-child');

    // Click volume button
    await page.click('button[aria-label="Volume"]');

    // Adjust volume slider
    await page.fill('input[type="range"][aria-label="Volume"]', '50');

    // Verify volume changed (check aria-valuenow or similar)
    const volumeSlider = page.locator(
      'input[type="range"][aria-label="Volume"]'
    );
    await expect(volumeSlider).toHaveValue('50');
  });

  test('waveform is interactive', async ({ page }) => {
    await page.click('.track-card:first-child');

    // Wait for waveform to render
    await expect(page.locator('canvas.waveform')).toBeVisible();

    // Click on waveform
    const waveform = page.locator('canvas.waveform');
    await waveform.click({ position: { x: 100, y: 50 } });

    // Verify playback position changed
    // (This would require checking audio element currentTime)
  });
});
```

### Filter Testing

**Example**: `e2e/filters.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Catalog Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sounds');
  });

  test('can filter by genre', async ({ page }) => {
    // Open genre filter
    await page.click('text=Genre');

    // Select Electronic
    await page.click('text=Electronic');

    // Wait for results to update
    await page.waitForTimeout(500);

    // Verify filtered results
    const trackCards = page.locator('.track-card');
    await expect(trackCards.first()).toBeVisible();

    // Verify genre tag appears
    await expect(page.locator('text=Electronic')).toBeVisible();
  });

  test('can filter by tempo range', async ({ page }) => {
    // Open tempo filter
    await page.click('text=Tempo');

    // Set min tempo
    await page.fill('input[name="minTempo"]', '120');

    // Set max tempo
    await page.fill('input[name="maxTempo"]', '140');

    // Wait for results
    await page.waitForTimeout(500);

    // Verify results are shown
    const trackCards = page.locator('.track-card');
    await expect(trackCards.first()).toBeVisible();
  });

  test('can combine multiple filters', async ({ page }) => {
    // Select genre
    await page.click('text=Genre');
    await page.click('text=Hip-Hop');

    // Select key
    await page.click('text=Key');
    await page.click('text=C major');

    // Wait for results
    await page.waitForTimeout(500);

    // Verify both filters are active
    await expect(page.locator('text=Hip-Hop')).toBeVisible();
    await expect(page.locator('text=C major')).toBeVisible();
  });
});
```

## Test Coverage

### Running Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Goals

**Minimum Targets**:
- **Utilities**: 80% coverage
- **Services**: 75% coverage
- **Components**: 70% coverage
- **Overall**: 70% coverage

### Coverage Metrics

- **Line coverage**: Percentage of code lines executed
- **Branch coverage**: Percentage of conditional branches executed
- **Function coverage**: Percentage of functions called
- **Statement coverage**: Percentage of statements executed

## Best Practices

### General Principles

1. **Test behavior, not implementation**
   - Focus on what the code does, not how it does it
   - Avoid testing internal state or private methods

2. **Keep tests simple and readable**
   - One assertion per test (when possible)
   - Clear test names describing expected behavior
   - Use arrange-act-assert pattern

3. **Make tests independent**
   - Tests should not depend on execution order
   - Clean up after each test
   - Use fresh data for each test

4. **Test edge cases**
   - Empty arrays/strings
   - Null/undefined values
   - Boundary values
   - Error conditions

### Arrange-Act-Assert Pattern

```typescript
it('formats duration correctly', () => {
  // Arrange: Set up test data
  const seconds = 125;

  // Act: Execute the function
  const result = formatDuration(seconds);

  // Assert: Verify the result
  expect(result).toBe('2:05');
});
```

### Test Naming

**Format**: "should [expected behavior] when [condition]"

```typescript
// ✅ Good
it('should return empty array when no tracks match filters', () => {});
it('should throw error when user is not authenticated', () => {});
it('should format duration as MM:SS when seconds are provided', () => {});

// ❌ Bad
it('test track filtering', () => {});
it('works', () => {});
it('edge case', () => {});
```

### Mocking

**Mock external dependencies**:

```typescript
// Mock database
jest.mock('@/server/db/tracksDbPool', () => ({
  query: jest.fn(),
}));

// Mock API calls
jest.mock('node-fetch');
import fetch from 'node-fetch';
(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
  new Response(JSON.stringify({ data: 'test' }))
);
```

**Avoid over-mocking**:
```typescript
// ❌ Bad: Mocking everything defeats the purpose
jest.mock('./utilityFunction');
jest.mock('./helperFunction');
jest.mock('./anotherHelper');

// ✅ Good: Only mock external dependencies
jest.mock('external-api');
// Test actual implementation of internal functions
```

### Test Data

**Use factories for consistent test data**:

```typescript
// testFactories.ts
export function createMockTrack(overrides = {}) {
  return {
    id: '123',
    title: 'Test Track',
    duration: 180,
    tempo: 120,
    musicalKey: 'C',
    scale: 'major',
    ...overrides,
  };
}

// Usage in tests
const track = createMockTrack({ title: 'Custom Title' });
```

### Async Testing

**Use async/await for async tests**:

```typescript
it('fetches tracks from API', async () => {
  const tracks = await fetchTracks();

  expect(tracks).toHaveLength(10);
});
```

**Handle errors properly**:

```typescript
it('throws error when API fails', async () => {
  await expect(fetchTracks()).rejects.toThrow('API Error');
});
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage
      - run: npm run test:e2e
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "jest --findRelatedTests"]
  }
}
```

---

**Last Updated**: January 2025
