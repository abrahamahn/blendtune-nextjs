// eslint.config.mjs
// eslint-config-next v16 ships native flat config; wrapping it in FlatCompat crashes
// (circular plugin references), so it is imported directly.
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  { ignores: ['**/node_modules/**', '**/.next/**', '**/out/**', '**/dist/**', '**/build/**'] },
  ...coreWebVitals,
  ...typescript,
  // CommonJS runtime loaders (e.g. loaded via require() from next.config) are plain .js
  // files and are not part of the TypeScript module graph, so require() is expected here.
  { files: ['**/*.js'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
];

export default config;
