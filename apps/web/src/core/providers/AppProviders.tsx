import type { ReactNode } from 'react'
import StoreProvider from './StoreProvider'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Combines all app-level providers
 */
export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  )
}
