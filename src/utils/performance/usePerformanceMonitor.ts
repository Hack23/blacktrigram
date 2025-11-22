/**
 * React hook for Three.js performance monitoring
 * 
 * Integrates PerformanceMonitor with useFrame for real-time FPS tracking
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PerformanceMonitor, PerformanceMetrics, PerformanceThresholds } from './PerformanceMonitor';

export interface UsePerformanceMonitorOptions {
  readonly enabled?: boolean;
  readonly thresholds?: Partial<PerformanceThresholds>;
  readonly updateInterval?: number; // Update interval in ms for React state
}

export interface PerformanceMonitorState {
  readonly metrics: PerformanceMetrics;
  readonly isGood: boolean;
  readonly warnings: readonly string[];
}

/**
 * Hook for monitoring Three.js performance in real-time
 * 
 * @param options Configuration options
 * @returns Current performance state
 * 
 * @example
 * ```tsx
 * function CombatScene() {
 *   const { metrics, isGood, warnings } = usePerformanceMonitor({
 *     enabled: import.meta.env.DEV,
 *     thresholds: { minAcceptableFps: 55 }
 *   });
 * 
 *   return (
 *     <>
 *       {import.meta.env.DEV && (
 *         <Html position={[0, 5, 0]}>
 *           <div>FPS: {metrics.fps.toFixed(1)}</div>
 *         </Html>
 *       )}
 *       {/* 3D content *\/}
 *     </>
 *   );
 * }
 * ```
 */
export function usePerformanceMonitor(
  options: UsePerformanceMonitorOptions = {}
): PerformanceMonitorState {
  const { enabled = true, thresholds, updateInterval = 1000 } = options;

  const gl = useThree((state) => state.gl);
  
  // Memoize thresholds to prevent unnecessary monitor recreation
  const stableThresholds = useMemo(
    () => thresholds,
    [
      thresholds?.targetFps,
      thresholds?.minAcceptableFps,
      thresholds?.maxMemoryMB,
      thresholds?.maxDrawCalls,
    ]
  );

  const monitor = useMemo(
    () => new PerformanceMonitor(stableThresholds),
    [stableThresholds]
  );

  const [state, setState] = useState<PerformanceMonitorState>(() => ({
    metrics: monitor.getMetrics(gl),
    isGood: monitor.isPerformanceGood(),
    warnings: monitor.getWarnings(),
  }));

  const lastUpdateRef = useRef(0);

  // Update performance monitor every frame
  useFrame(() => {
    if (!enabled) return;

    monitor.update(gl);

    // Update React state at specified interval
    const now = performance.now();
    if (now - lastUpdateRef.current >= updateInterval) {
      lastUpdateRef.current = now;
      
      setState({
        metrics: monitor.getMetrics(gl),
        isGood: monitor.isPerformanceGood(),
        warnings: monitor.getWarnings(),
      });
    }
  });

  // Reset monitor on unmount
  useEffect(() => {
    return () => {
      monitor.reset();
    };
  }, [monitor]);

  return state;
}

export default usePerformanceMonitor;
