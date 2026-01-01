/**
 * useDebounce Hook
 * 
 * Debounces a function to execute only after a delay since the last call.
 * Useful for search inputs, resize handlers, and other delayed actions.
 * 
 * Uses a ref pattern to ensure the latest callback is always called
 * without recreating the debounced function on every render.
 * 
 * @module hooks/useDebounce
 * @category Performance
 * @korean 디바운스 훅
 */

import { useCallback, useRef, useLayoutEffect, useEffect } from 'react';

/**
 * Hook to debounce a callback function
 * 
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds before execution
 * @returns Debounced function
 * 
 * @example
 * ```tsx
 * const handleSearch = useDebounce((query: string) => {
 *   // Perform search
 * }, 300);
 * ```
 */
export function useDebounce<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  
  // Keep callback ref up to date
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timeoutRef.current = null;
      }, delay);
    },
    [delay]
  );
}

export default useDebounce;
