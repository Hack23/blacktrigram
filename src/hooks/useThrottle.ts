/**
 * useThrottle Hook
 * 
 * Throttles a function to execute at most once per specified interval.
 * Useful for high-frequency events like scroll, resize, or touch move.
 * 
 * @module hooks/useThrottle
 * @category Performance
 * @korean 쓰로틀 훅
 */

import { useCallback, useRef } from 'react';

/**
 * Hook to throttle a callback function
 * 
 * @param callback - Function to throttle
 * @param delay - Minimum delay between executions in milliseconds
 * @returns Throttled function
 * 
 * @example
 * ```tsx
 * const handleTouchMove = useThrottle((event: TouchEvent) => {
 *   // Handle touch move
 * }, 16); // ~60fps
 * ```
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRunRef.current;

      if (timeSinceLastRun >= delay) {
        // Execute immediately if enough time has passed
        lastRunRef.current = now;
        callback(...args);
      } else if (!timeoutRef.current) {
        // Schedule execution for later
        const timeUntilNext = delay - timeSinceLastRun;
        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          timeoutRef.current = null;
          callback(...args);
        }, timeUntilNext);
      }
    },
    [callback, delay]
  );
}

export default useThrottle;
