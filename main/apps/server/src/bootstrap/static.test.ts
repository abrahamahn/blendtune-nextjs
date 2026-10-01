import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

describe('production static hosting', () => {
  it('boots the installed plugin, serves the SPA and keeps missing API routes private', () => {
    const root = mkdtempSync(join(tmpdir(), 'blendtune-static-'));
    try {
      writeFileSync(join(root, 'index.html'), '<!doctype html><title>Release fixture</title>');
      // Exercise real Node/tsx module loading, including the plugin's ESM-only
      // dependencies. Jest 29's CommonJS VM is not the production module loader.
      const result = spawnSync(process.execPath, ['--import', 'tsx', '-e', `
        const assert = require('node:assert/strict');
        const Fastify = require('fastify');
        const { registerStaticWeb } = require('./main/apps/server/src/bootstrap/static.ts');
        (async () => {
          const app = Fastify({ logger: false });
          try {
            assert.equal(await registerStaticWeb(app), true);
            await app.ready();
            for (const url of ['/', '/tracks/example']) {
              const response = await app.inject({ method: 'GET', url });
              assert.equal(response.statusCode, 200);
              assert.match(response.body, /Release fixture/);
            }
            for (const url of ['/api/missing', '/health/missing']) {
              const response = await app.inject({ method: 'GET', url });
              assert.equal(response.statusCode, 404);
              assert.match(response.headers['content-type'], /application\\/json/);
            }
          } finally { await app.close(); }
        })().catch(error => { console.error(error); process.exitCode = 1; });
      `], { encoding: 'utf8', timeout: 30000, env: { ...process.env, WEB_DIST: root } });
      expect({ status: result.status, error: result.error, stderr: result.stderr }).toEqual({
        status: 0, error: undefined, stderr: '',
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
