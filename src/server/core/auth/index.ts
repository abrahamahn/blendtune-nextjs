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
  type ResetPasswordResult,
  type ResetVerificationResult,
  type EmailConfirmationResult,
} from './service';
export { sendConfirmationEmail, type AuthEmailAction } from './email';
