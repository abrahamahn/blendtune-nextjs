import { Provider } from 'react-redux'
import { store } from '../store'
import type { ReactNode } from 'react'

interface StoreProviderProps {
  children: ReactNode
}

export default function StoreProvider({ children }: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
