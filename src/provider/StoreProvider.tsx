"use client";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { RootStore } from "@/redux/store";

interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <Provider store={RootStore}>{children}</Provider>;
};

export default StoreProvider;
