/**
 * useThrottle Hook
 * 
 * Throttles a function to execute at most once per specified interval.
 * Useful for high-frequency events like scroll, resize, or touch move.
 * 
 * Uses a ref pattern to ensure the latest callback is always called
 * without recreating the throttled function on every render.
 * 
 * @module hooks/useThrottle
 * @category Performance
 * @korean 쓰로틀 훅
 */

import { useCallback, useRef, useLayoutEffect, useEffect } from 'react';

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
export function useThrottle<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  
  // Keep callback ref up to date
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // Cleanup pending timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    function(...args: Parameters<T>) {
      const now = Date.now();
      const timeSinceLastRun = now - lastRunRef.current;

      if (timeSinceLastRun >= delay) {
        // Execute immediately if enough time has passed
        lastRunRef.current = now;
        callbackRef.current(...args);
      } else if (!timeoutRef.current) {
        // Schedule execution for later
        const timeUntilNext = delay - timeSinceLastRun;
        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          timeoutRef.current = null;
          callbackRef.current(...args);
        }, timeUntilNext);
      }
    } as T,
    [delay]
  );
}

export default useThrottle;
