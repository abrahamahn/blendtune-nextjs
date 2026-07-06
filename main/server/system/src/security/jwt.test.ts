// main/server/system/src/security/jwt.test.ts
import { decode, JwtError, sign, verify } from './jwt';

const SECRET = 'test-secret-that-is-long-enough-for-hs256';

describe('jwt', () => {
  it('signs and verifies a payload roundtrip', () => {
    const token = sign({ userId: 'u1', email: 'a@b.co' }, SECRET, { expiresIn: '15m' });
    const payload = verify(token, SECRET);

    expect(payload.userId).toBe('u1');
    expect(payload.email).toBe('a@b.co');
    expect(typeof payload.iat).toBe('number');
    expect(payload.exp).toBe((payload.iat as number) + 15 * 60);
  });

  it('rejects an expired token', () => {
    const token = sign({ userId: 'u1' }, SECRET, { expiresIn: 0 });
    expect(() => verify(token, SECRET)).toThrow('Token has expired');
  });

  it('honors clock tolerance for just-expired tokens', () => {
    const token = sign({ userId: 'u1' }, SECRET, { expiresIn: 0 });
    expect(verify(token, SECRET, { clockToleranceSeconds: 60 }).userId).toBe('u1');
  });

  it('rejects a tampered payload', () => {
    const token = sign({ userId: 'u1' }, SECRET, { expiresIn: '15m' });
    const [header, , signature] = token.split('.');
    const forged = Buffer.from(JSON.stringify({ userId: 'u2' })).toString('base64url');
    expect(() => verify(`${header}.${forged}.${signature}`, SECRET)).toThrow('Invalid signature');
  });

  it('rejects a token signed with a different secret', () => {
    const token = sign({ userId: 'u1' }, 'another-secret-that-is-also-long-enough');
    expect(() => verify(token, SECRET)).toThrow(JwtError);
  });

  it('rejects malformed tokens and the "none" algorithm', () => {
    expect(() => verify('not-a-jwt', SECRET)).toThrow('Invalid token format');

    const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString(
      'base64url',
    );
    const payload = Buffer.from(JSON.stringify({ userId: 'u1' })).toString('base64url');
    expect(() => verify(`${noneHeader}.${payload}.x`, SECRET)).toThrow('Algorithm not supported');
  });

  it('decodes without verification and returns null for garbage', () => {
    const token = sign({ userId: 'u1' }, SECRET);
    expect(decode(token)?.userId).toBe('u1');
    expect(decode('garbage')).toBeNull();
  });
});
