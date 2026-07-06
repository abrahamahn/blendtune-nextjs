// src/server/core/auth/index.ts
export {
  getUserByEmail,
  login,
  signUpUser,
  requestPasswordReset,
  resetPassword,
  verifyResetPasswordToken,
  confirmEmail,
  type RequestMeta,
  type SignUpData,
  type SignUpResult,
  type LoginResult,
  type ResetVerificationResult,
  type EmailConfirmationResult,
} from './service';
export {
  rotateAuthTokens,
  verifyAccessToken,
  getJwtSecret,
  type AuthTokens,
  type RotatedTokens,
} from './tokens';
export { sendConfirmationEmail, type AuthEmailAction } from './email';
