// src/client/features/auth/services/index.ts
/**
 * Export authentication service components and types
 * SessionProvider: Main authentication context provider
 * useSession: Custom hook for accessing session data
 * SessionContext: React context for session management
 * SessionContextValue: TypeScript interface for session context
 */
export { default as SessionProvider } from './sessionService';
export { useSession, SessionContext } from './useSession';
export type { SessionContextValue } from './useSession';