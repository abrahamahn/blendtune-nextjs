// main/server/core/src/auth/password.test.ts
import bcrypt from 'bcrypt';

import { hashPassword, isBcryptHash, needsRehash, verifyPassword } from './password';

describe('password', () => {
  it('hashes with Argon2id and verifies the roundtrip', async () => {
    const hash = await hashPassword('correct horse battery staple');

    expect(hash.startsWith('$argon2id$')).toBe(true);
    await expect(verifyPassword('correct horse battery staple', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong password', hash)).resolves.toBe(false);
  });

  it('detects legacy bcrypt hashes and verifies against them', async () => {
    const bcryptHash = await bcrypt.hash('legacy-pass', 10);

    expect(isBcryptHash(bcryptHash)).toBe(true);
    await expect(verifyPassword('legacy-pass', bcryptHash)).resolves.toBe(true);
    await expect(verifyPassword('not-it', bcryptHash)).resolves.toBe(false);
  });

  it('flags bcrypt hashes for rehash but not fresh Argon2id hashes', async () => {
    const bcryptHash = await bcrypt.hash('legacy-pass', 10);
    const argonHash = await hashPassword('new-pass');

    expect(needsRehash(bcryptHash)).toBe(true);
    expect(needsRehash(argonHash)).toBe(false);
    expect(isBcryptHash(argonHash)).toBe(false);
  });

  it('returns false instead of throwing on malformed hashes', async () => {
    await expect(verifyPassword('anything', 'not-a-hash')).resolves.toBe(false);
  });
});
