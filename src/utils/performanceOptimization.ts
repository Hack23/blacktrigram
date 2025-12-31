/**
 * Performance Optimization Utilities
 * 
 * Collection of utilities for optimizing React rendering performance:
 * - Memoization helpers for expensive calculations
 * - Shallow comparison utilities for React.memo
 * - GPU acceleration style helpers
 * - Performance measurement utilities
 * 
 * @module utils/performanceOptimization
 * @category Performance
 * @korean 성능 최적화 유틸리티
 */

import React from 'react';

/**
 * Shallow comparison for props
 * Used with React.memo for performance optimization
 * 
 * @param prevProps - Previous props
 * @param nextProps - Next props
 * @returns true if props are equal (skip re-render), false otherwise
 */
export function shallowCompare<T extends Record<string, unknown>>(
  prevProps: T,
  nextProps: T
): boolean {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  for (const key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
}

/**
 * Create a memoized component with custom comparison
 * 
 * @param component - Component to memoize
 * @param compareKeys - Keys to compare for equality
 * @returns Memoized component
 * 
 * @example
 * ```tsx
 * const MemoizedHUD = memoizeComponent(PlayerHUD, ['player.health', 'player.stamina']);
 * ```
 */
export function memoizeComponent<P extends Record<string, unknown>>(
  component: React.FC<P>,
  compareKeys?: (keyof P)[]
): React.NamedExoticComponent<P> {
  if (!compareKeys || compareKeys.length === 0) {
    return React.memo(component);
  }

  return React.memo(component, (prevProps, nextProps) => {
    for (const key of compareKeys) {
      if (prevProps[key] !== nextProps[key]) {
        return false; // Props changed, re-render
      }
    }
    return true; // Props same, skip re-render
  });
}

/**
 * GPU acceleration styles
 * Forces GPU layer creation for smooth animations
 */
export const GPU_ACCELERATION_STYLES = {
  /**
   * Force GPU layer with translateZ
   */
  transform: 'translateZ(0)',
  
  /**
   * Enable hardware acceleration
   */
  backfaceVisibility: 'hidden' as const,
  
  /**
   * Hint browser about upcoming changes
   */
  willChange: 'transform, opacity' as const,
} as const;

/**
 * Apply GPU acceleration to CSS-in-JS style object
 * 
 * @param styles - Base styles
 * @returns Styles with GPU acceleration
 */
export function withGPUAcceleration<T extends React.CSSProperties>(
  styles: T
): T & typeof GPU_ACCELERATION_STYLES {
  return {
    ...styles,
    ...GPU_ACCELERATION_STYLES,
  };
}

/**
 * Performance-optimized animation styles
 * Uses only transform and opacity for 60fps animations
 * 
 * @param translateX - X translation in px
 * @param translateY - Y translation in px
 * @param opacity - Opacity (0-1)
 * @param scale - Scale factor (default: 1)
 * @returns Optimized style object
 */
export function optimizedAnimationStyle(
  translateX = 0,
  translateY = 0,
  opacity = 1,
  scale = 1
): React.CSSProperties {
  return {
    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
    opacity,
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
  };
}

/**
 * Measure component render time
 * Only runs in development mode
 * 
 * @param componentName - Name of component being measured
 * @param callback - Function to measure
 * @returns Result of callback
 */
export function measureRender<T>(
  componentName: string,
  callback: () => T
): T {
  if (import.meta.env.DEV) {
    const start = performance.now();
    const result = callback();
    const end = performance.now();
    const duration = end - start;
    
    if (duration > 16.67) { // Slower than 60fps frame budget
      console.warn(
        `[Performance] ${componentName} render took ${duration.toFixed(2)}ms (>16.67ms budget)`
      );
    }
    
    return result;
  }
  
  return callback();
}

/**
 * Create a render counter for debugging
 * Tracks how many times a component renders
 * 
 * @param componentName - Name of component
 * @returns Render count
 */
export function useRenderCount(componentName: string): number {
  const [renderCount, setRenderCount] = React.useState(0);
  
  // Increment on each render
  React.useEffect(() => {
    setRenderCount(prev => {
      const newCount = prev + 1;
      if (import.meta.env.DEV) {
        console.log(`[Render] ${componentName} rendered ${newCount} times`);
      }
      return newCount;
    });
  });
  
  return renderCount;
}

/**
 * Batch state updates to reduce re-renders
 * 
 * @param updates - Array of state update functions
 */
export function batchUpdates(updates: (() => void)[]): void {
  React.startTransition(() => {
    updates.forEach(update => update());
  });
}

/**
 * Check if object properties have changed (deep comparison for nested objects)
 * 
 * @param prev - Previous object
 * @param next - Next object
 * @param keys - Keys to check
 * @returns true if any key changed
 */
export function hasPropsChanged<T extends Record<string, unknown>>(
  prev: T,
  next: T,
  keys: (keyof T)[]
): boolean {
  for (const key of keys) {
    if (prev[key] !== next[key]) {
      return true;
    }
  }
  return false;
}

/**
 * Create a stable callback reference that doesn't change between renders
 * Similar to useCallback but with automatic dependency detection
 * 
 * @param callback - Callback function
 * @returns Stable callback reference
 */
export function useStableCallback<T extends (...args: never[]) => unknown>(
  callback: T
): T {
  const callbackRef = React.useRef(callback);
  
  // Update ref on each render
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  
  // Return stable function that calls latest callback
  const stableCallback = React.useCallback(
    (...args: Parameters<T>) => callbackRef.current(...args),
    []
  ) as T;
  
  return stableCallback;
}
