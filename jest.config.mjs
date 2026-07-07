// jest.config.mjs
/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  // Unit tests for server/shared/client logic (transformed by @swc/jest).
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
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
    '^@shared/(.*)$': '<rootDir>/main/shared/src/$1',
    '^@/shared/(.*)$': '<rootDir>/main/shared/src/$1',
  },
  testMatch: ['<rootDir>/main/**/*.test.ts'],
};

export default config;
