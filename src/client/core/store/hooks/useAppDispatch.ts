// src/client/core/store/hooks/useAppDispatch.ts
import { useDispatch } from "react-redux";
import type { AppDispatch } from "..";

/**
 * useAppDispatch Hook:
 * - Returns the typed version of `dispatch` for Redux.
 * - Ensures only valid actions are dispatched.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
