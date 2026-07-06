// jest.config.mjs
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Load next.config.js and .env files in the test environment
  dir: './',
});

const config = {
  coverageProvider: 'v8',
  // Unit tests are server/shared logic; e2e browser tests run via `pnpm test:e2e` (Playwright).
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@server/(.*)$': '<rootDir>/src/server/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/test/'],
};

export default createJestConfig(config);
