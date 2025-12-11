// src\client\core\providers\StoreProvider.tsx
"use client";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from '@core/store';

// Type definition for StoreProvider props
interface StoreProviderProps {
  children: ReactNode;
}

// StoreProvider component wraps the application with Redux store provider
const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
