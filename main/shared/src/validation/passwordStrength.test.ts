// main/shared/src/validation/passwordStrength.test.ts
import { estimatePasswordStrength, getStrengthLabel } from './passwordStrength';

describe('estimatePasswordStrength', () => {
  it('returns score 0 for very weak passwords', () => {
    expect(estimatePasswordStrength('password').score).toBe(0);
  });

  it('returns score 4 for very strong passwords', () => {
    expect(estimatePasswordStrength('Xk9$mQ2@nL5!pR8*').score).toBe(4);
  });

  it('penalizes common passwords (including l33t variations)', () => {
    const common = estimatePasswordStrength('password123');
    const uncommon = estimatePasswordStrength('x7k9m2n5p8');
    expect(common.score).toBeLessThan(uncommon.score);
    expect(estimatePasswordStrength('p4ssw0rd').score).toBe(0);
  });

  it('penalizes keyboard patterns, repeats, and sequences', () => {
    expect(estimatePasswordStrength('qwertyuiop').score).toBeLessThanOrEqual(1);
    expect(estimatePasswordStrength('aaaaaaaaaa').score).toBeLessThanOrEqual(1);
    expect(estimatePasswordStrength('abcdefghij').score).toBeLessThanOrEqual(1);
  });

  it('penalizes passwords containing user inputs of 3+ chars', () => {
    const without = estimatePasswordStrength('johnsmith2024');
    const withInputs = estimatePasswordStrength('johnsmith2024', ['john', 'smith']);
    expect(withInputs.score).toBeLessThanOrEqual(without.score);
    // Short inputs (< 3 chars) are ignored
    expect(estimatePasswordStrength('abcdefgh12', ['ab']).score).toBeGreaterThan(0);
  });

  it('provides a warning and suggestions for weak passwords', () => {
    const result = estimatePasswordStrength('password');
    expect(result.feedback.warning).toContain('commonly used');
    expect(result.feedback.suggestions.length).toBeGreaterThan(0);
    expect(result.feedback.suggestions.length).toBeLessThanOrEqual(3);
  });

  it('reports entropy and a crack time display', () => {
    const result = estimatePasswordStrength('Xk9$mQ2@nL5!pR8*');
    expect(result.entropy).toBeGreaterThan(0);
    expect(result.crackTimeDisplay).toBe('centuries');
    expect(estimatePasswordStrength('a').crackTimeDisplay).toBe('less than a second');
  });
});

describe('getStrengthLabel', () => {
  it('maps scores to human-readable labels', () => {
    expect(getStrengthLabel(0)).toBe('Very Weak');
    expect(getStrengthLabel(1)).toBe('Weak');
    expect(getStrengthLabel(2)).toBe('Fair');
    expect(getStrengthLabel(3)).toBe('Strong');
    expect(getStrengthLabel(4)).toBe('Very Strong');
    expect(getStrengthLabel(9)).toBe('Unknown');
  });
});
