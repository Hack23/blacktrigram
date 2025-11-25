/**
 * useWebGLContextLossHandler - React hook for handling WebGL context loss
 * 
 * This hook sets up event listeners for WebGL context loss and restoration,
 * which can occur due to GPU issues, memory pressure, or browser tab switching.
 * 
 * @example
 * ```tsx
 * const Canvas = () => {
 *   useWebGLContextLossHandler();
 *   return <Canvas>...</Canvas>;
 * };
 * ```
 */

import { useEffect } from 'react';

export interface WebGLContextLossOptions {
  /**
   * Callback when context is lost
   */
  readonly onContextLost?: () => void;
  
  /**
   * Callback when context is restored
   */
  readonly onContextRestored?: () => void;
  
  /**
   * Whether to attempt automatic restoration (default: true)
   */
  readonly autoRestore?: boolean;
}

/**
 * Hook to handle WebGL context loss and restoration
 */
export const useWebGLContextLossHandler = (
  options: WebGLContextLossOptions = {}
): void => {
  const { onContextLost, onContextRestored, autoRestore = true } = options;

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.warn('useWebGLContextLossHandler: No canvas element found');
      return;
    }

    const handleContextLost = (event: Event) => {
      console.warn('WebGL context lost - attempting to restore');
      
      // Prevent default behavior to allow restoration
      if (autoRestore) {
        event.preventDefault();
      }
      
      onContextLost?.();
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored successfully');
      onContextRestored?.();
    };

    // Add event listeners for context loss/restoration
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    // Cleanup
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [onContextLost, onContextRestored, autoRestore]);
};

/**
 * Check if WebGL is available in the current browser
 */
export const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch (e) {
    return false;
  }
};

/**
 * Check if WebGL2 is available in the current browser
 */
export const isWebGL2Available = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return gl !== null;
  } catch (e) {
    return false;
  }
};
