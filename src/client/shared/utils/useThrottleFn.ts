// src\client\shared\utils\useThrottleFn.ts
import { useRef, useCallback } from 'react';

/**
 * Returns a throttled version of the provided function.
 * The function will only be called at most once every `delay` milliseconds.
 *
 * @param fn The function to throttle.
 * @param delay The minimum delay (in ms) between calls.
 * @returns A throttled function.
 */
export function useThrottleFn<T extends (...args: any[]) => any>(fn: T, delay: number) {
  const lastCallRef = useRef(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      fn(...args);
    }
  }, [fn, delay]);
}
