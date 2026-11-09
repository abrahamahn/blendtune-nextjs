// main/shared/src/validation/passwordPatterns.ts
const COMMON_PASSWORDS: ReadonlySet<string> = new Set([
  'password',
  '123456',
  '12345678',
  '123456789',
  '1234567890',
  'qwerty',
  'abc123',
  '111111',
  'password1',
  'iloveyou',
  'admin',
  'welcome',
  'monkey',
  'dragon',
  'master',
  'letmein',
  'login',
  'princess',
  'football',
  'shadow',
  'sunshine',
  'trustno1',
  'batman',
  'access',
  'hello',
  'charlie',
  'donald',
  '!@#$%^&*',
  'passw0rd',
  'qwerty123',
]);

const KEYBOARD_PATTERNS: readonly string[] = [
  'qwerty',
  'qwertz',
  'azerty',
  'asdf',
  'asdfgh',
  'zxcv',
  'zxcvbn',
  'qazwsx',
  '1qaz2wsx',
  '1234',
  '12345',
  '123456',
  '1234567',
  '12345678',
  '0987',
  '09876',
  '098765',
  '0987654',
  '09876543',
] as const;

/**
 * Penalties structure for password scoring
 */
export interface PasswordPenalties {
  isCommon: boolean;
  hasRepeats: boolean;
  hasSequence: boolean;
  hasKeyboard: boolean;
  containsInput: boolean;
}

/**
 * Check for repeated characters (e.g., "aaa", "111")
 */
function hasRepeatedChars(password: string, minLength = 3): boolean {
  if (minLength <= 1) return password.length > 0;
  let runLength = 1;
  for (let i = 1; i < password.length; i++) {
    if (password.charCodeAt(i) === password.charCodeAt(i - 1)) {
      runLength++;
      if (runLength >= minLength) return true;
    } else {
      runLength = 1;
    }
  }
  return false;
}

/**
 * Check for sequential characters (e.g., "abc", "123")
 */
function hasSequentialChars(password: string, minLength = 3): boolean {
  const lower = password.toLowerCase();
  for (let i = 0; i <= lower.length - minLength; i++) {
    let isSequence = true;
    let isReverseSequence = true;

    for (let j = 1; j < minLength; j++) {
      if (lower.charCodeAt(i + j) !== lower.charCodeAt(i + j - 1) + 1) {
        isSequence = false;
      }
      if (lower.charCodeAt(i + j) !== lower.charCodeAt(i + j - 1) - 1) {
        isReverseSequence = false;
      }
    }

    if (isSequence || isReverseSequence) {
      return true;
    }
  }
  return false;
}

/**
 * Check for keyboard patterns
 */
function hasKeyboardPattern(password: string): boolean {
  const lower = password.toLowerCase();
  return KEYBOARD_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Check if password is a common password or variation
 */
function isCommonPassword(password: string): boolean {
  const lower = password.toLowerCase();

  if (COMMON_PASSWORDS.has(lower)) {
    return true;
  }

  const normalized = lower
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/!/g, 'i');

  if (COMMON_PASSWORDS.has(normalized)) {
    return true;
  }

  let trimIndex = lower.length;
  while (trimIndex > 0) {
    const code = lower.charCodeAt(trimIndex - 1);
    if (code < 48 || code > 57) break;
    trimIndex--;
  }
  const withoutTrailingNumbers = lower.slice(0, trimIndex);
  if (withoutTrailingNumbers.length >= 4 && COMMON_PASSWORDS.has(withoutTrailingNumbers)) {
    return true;
  }

  return false;
}

/**
 * Check if password contains user inputs
 */
function containsUserInput(password: string, userInputs: string[]): boolean {
  const lower = password.toLowerCase();
  return userInputs.some((input) => {
    const inputLower = input.toLowerCase();
    return inputLower.length >= 3 && lower.includes(inputLower);
  });
}

export function detectPasswordPenalties(
  password: string,
  userInputs: string[] = [],
): PasswordPenalties {
  return {
    isCommon: isCommonPassword(password),
    hasRepeats: hasRepeatedChars(password),
    hasSequence: hasSequentialChars(password),
    hasKeyboard: hasKeyboardPattern(password),
    containsInput: containsUserInput(password, userInputs),
  };
}
