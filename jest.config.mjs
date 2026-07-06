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
    '^@router$': '<rootDir>/main/client/react/src/router',
    '^@router/(.*)$': '<rootDir>/main/client/react/src/router/$1',
    '^@server/db$': '<rootDir>/main/server/db/src',
    '^@server/db/(.*)$': '<rootDir>/main/server/db/src/$1',
    '^@server/core/(.*)$': '<rootDir>/main/server/core/src/$1',
    '^@server/storage$': '<rootDir>/main/server/storage/src',
    '^@server/storage/(.*)$': '<rootDir>/main/server/storage/src/$1',
    '^@server/media$': '<rootDir>/main/server/media/src',
    '^@server/media/(.*)$': '<rootDir>/main/server/media/src/$1',
    '^@server/system/(.*)$': '<rootDir>/main/server/system/src/$1',
    '^@server/(.*)$': '<rootDir>/src/server/$1',
    '^@shared/(.*)$': '<rootDir>/main/shared/src/$1',
    '^@/shared/(.*)$': '<rootDir>/main/shared/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/main/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/src/test/'],
};

export default createJestConfig(config);
