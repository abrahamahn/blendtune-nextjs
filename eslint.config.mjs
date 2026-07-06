// eslint.config.mjs
// Native flat config for the migrated Vite (SPA) + Fastify stack. Replaces the former
// eslint-config-next preset, which is Next-coupled and cannot resolve without the `next`
// package installed.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const config = [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/playwright-report/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Parity with the former eslint-config-next baseline: unused vars are a warning, and
      // `_`-prefixed identifiers are intentionally-unused (kept for API compatibility).
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
  // CommonJS runtime loaders are plain .js files outside the TypeScript module graph, so
  // require() is expected there.
  { files: ['**/*.js'], languageOptions: { globals: globals.node }, rules: { '@typescript-eslint/no-require-imports': 'off' } },
];

export default config;
