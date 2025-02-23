// src/client/core/store/hooks/useAppSelector.ts
import { useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState } from "..";

/**
 * useAppSelector Hook:
 * - A typed version of `useSelector` for Redux.
 * - Ensures only valid state selections.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
