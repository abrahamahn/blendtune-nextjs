# Testing Guide

How Blendtune is tested.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Setup](#test-setup)
3. [Unit Testing](#unit-testing)
4. [Testing Core Services & Repositories](#testing-core-services--repositories)
5. [Best Practices](#best-practices)

## Testing Philosophy

Tests are **Jest unit tests colocated with source** as `*.test.ts` files under `main/`. Because
business logic lives in framework-agnostic packages (`main/server/*`, `main/shared`), most behavior is
tested in isolation without booting Fastify or a browser.

**Principles:**
- Test behavior, not implementation.
- Every new source file needs tests; changed behavior needs updated tests.
- Keep tests fast and independent — no shared mutable state, no ordering assumptions.

## Test Setup

### Framework

**Jest** with the **`@swc/jest`** transform for TypeScript. Run:

```bash
pnpm test          # run all unit tests
pnpm test:watch    # watch mode
```

Tests live next to the code they cover, e.g.:

```
main/server/core/src/auth/password.test.ts
main/server/core/src/auth/tokens.test.ts
main/server/system/src/security/jwt.test.ts
main/server/db/src/repositories/profile.test.ts
main/shared/src/validation/track.test.ts
```

> The previous Playwright end-to-end harness was removed; there is no browser E2E suite.

## Unit Testing

### What to Test

- **Pure functions & validation** in `main/shared` (Zod schemas, formatters).
- **Core services** in `main/server/core` (auth, tracks, account, creator).
- **Security primitives** in `main/server/system` (JWT sign/verify).
- **Client utilities and hooks** with logic worth covering.

### Example: validation

```typescript
// main/shared/src/validation/track.test.ts
import { trackSchema } from './track';

describe('trackSchema', () => {
  it('accepts a valid track payload', () => {
    const result = trackSchema.safeParse({ catalog: 'mkh063', title: 'Playa' });
    expect(result.success).toBe(true);
  });

  it('rejects a missing catalog id', () => {
    const result = trackSchema.safeParse({ title: 'Playa' });
    expect(result.success).toBe(false);
  });
});
```

### Example: JWT primitive

```typescript
// main/server/system/src/security/jwt.test.ts
import { signJwt, verifyJwt } from './jwt';

describe('jwt', () => {
  it('round-trips a signed payload', () => {
    const token = signJwt({ sub: 'user-1' }, secret, { ttl: '15m' });
    expect(verifyJwt(token, secret).sub).toBe('user-1');
  });

  it('rejects a token signed with a different secret', () => {
    const token = signJwt({ sub: 'user-1' }, secret, { ttl: '15m' });
    expect(() => verifyJwt(token, 'other-secret')).toThrow();
  });
});
```

## Testing Core Services & Repositories

Core services depend on repositories through their interfaces, so pass a fake/mock repository (or a
stub `RawDb`) rather than hitting a real database. Keep the framework out of the test — call the core
function directly.

```typescript
// main/server/core/src/auth/password.test.ts (shape)
import { hashPassword, verifyPassword } from './password';

describe('password', () => {
  it('hashes and verifies with Argon2id', async () => {
    const hash = await hashPassword('SecurePass123!');
    expect(await verifyPassword('SecurePass123!', hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });
});
```

When a test does need the database (repository integration), scope it to a test database and clean up
in `afterEach`/`afterAll`. Prefer mocking the repository for pure service logic.

## Best Practices

### Arrange–Act–Assert

```typescript
it('formats duration as MM:SS', () => {
  const seconds = 125;              // arrange
  const result = formatDuration(seconds); // act
  expect(result).toBe('2:05');      // assert
});
```

### Naming

Describe expected behavior and condition:

```typescript
it('returns an empty result when no tracks match the filters', () => {});
it('throws when the user is not authenticated', () => {});
```

### Mocking

Mock only external dependencies (database, storage, email), not the internal function under test.
Test files may use `import *` where needed for `vi`/`jest` spying — this is the one place namespace
imports are allowed.

### Edge cases

Cover empty inputs, `null`/`undefined`, boundary values, and error paths.

## Continuous Integration

CI runs the same gates locally used before a PR:

```bash
pnpm lint
pnpm type-check
pnpm test
```

Pre-commit hooks run format → lint-staged → type-check.

---

See [05-contributing.md](./05-contributing.md) for the full contribution workflow.
