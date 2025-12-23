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

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Global WebGL context state tracking
 * Helps coordinate context recovery across multiple Canvas components
 */
let globalContextLossCount = 0;
let globalIsContextLost = false;
let lastContextLossTime = 0;

/**
 * Minimum delay between context loss events to prevent thrashing
 */
export const MIN_CONTEXT_RECOVERY_DELAY = 100; // ms

/**
 * Get global WebGL context state
 */
export const getWebGLContextState = (): {
  isLost: boolean;
  lossCount: number;
  timeSinceLastLoss: number;
} => ({
  isLost: globalIsContextLost,
  lossCount: globalContextLossCount,
  timeSinceLastLoss: Date.now() - lastContextLossTime,
});

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

  /**
   * Optional canvas ref to attach to a specific canvas element
   * If not provided, will query for the first canvas in the document
   */
  readonly canvasRef?: React.RefObject<HTMLCanvasElement>;

  /**
   * Delay in ms before attempting to query for canvas (default: 50)
   * Helps avoid race conditions during screen transitions
   */
  readonly mountDelay?: number;

  /**
   * Maximum attempts to find canvas element (default: 5)
   */
  readonly maxRetries?: number;
}

export interface WebGLContextState {
  /** Whether context is currently lost */
  readonly isContextLost: boolean;
  /** Number of times context has been lost */
  readonly lossCount: number;
  /** Whether the canvas element has been found */
  readonly isCanvasMounted: boolean;
}

/**
 * Hook to handle WebGL context loss and restoration
 * Returns state information about the WebGL context
 */
export const useWebGLContextLossHandler = (
  options: WebGLContextLossOptions = {}
): WebGLContextState => {
  const {
    onContextLost,
    onContextRestored,
    autoRestore = true,
    canvasRef,
    mountDelay = 50,
    maxRetries = 5,
  } = options;

  const [contextState, setContextState] = useState<WebGLContextState>({
    isContextLost: globalIsContextLost,
    lossCount: globalContextLossCount,
    isCanvasMounted: false,
  });

  // Use refs to store the latest callbacks to avoid re-registering event listeners
  const onContextLostRef = useRef(onContextLost);
  const onContextRestoredRef = useRef(onContextRestored);
  const retryCountRef = useRef(0);
  const mountedRef = useRef(true);

  // Update refs when callbacks change
  useEffect(() => {
    onContextLostRef.current = onContextLost;
    onContextRestoredRef.current = onContextRestored;
  });

  // Track component mount state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleContextLost = useCallback(
    (event: Event) => {
      const now = Date.now();
      globalIsContextLost = true;
      globalContextLossCount++;
      lastContextLossTime = now;

      console.warn(
        `⚠️ WebGL context lost (count: ${globalContextLossCount}, time since mount: ${
          now - lastContextLossTime
        }ms)`
      );

      // Prevent default behavior to allow restoration
      if (autoRestore) {
        event.preventDefault();
      }

      if (mountedRef.current) {
        setContextState({
          isContextLost: true,
          lossCount: globalContextLossCount,
          isCanvasMounted: true,
        });
      }

      onContextLostRef.current?.();
    },
    [autoRestore]
  );

  const handleContextRestored = useCallback(() => {
    globalIsContextLost = false;
    console.log("✅ WebGL context restored successfully");

    if (mountedRef.current) {
      setContextState((prev) => ({
        ...prev,
        isContextLost: false,
      }));
    }

    onContextRestoredRef.current?.();
  }, []);

  useEffect(() => {
    let canvas = canvasRef?.current ?? document.querySelector("canvas");
    let cleanupFn: (() => void) | undefined;
    let retryTimeout: ReturnType<typeof setTimeout> | undefined;
    let observer: MutationObserver | undefined;

    const attachListeners = (canvasEl: HTMLCanvasElement) => {
      canvasEl.addEventListener("webglcontextlost", handleContextLost, false);
      canvasEl.addEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false
      );

      if (mountedRef.current) {
        setContextState((prev) => ({
          ...prev,
          isCanvasMounted: true,
        }));
      }

      return () => {
        canvasEl.removeEventListener("webglcontextlost", handleContextLost);
        canvasEl.removeEventListener(
          "webglcontextrestored",
          handleContextRestored
        );
      };
    };

    // Retry finding canvas with delay to handle screen transitions
    const tryFindCanvas = () => {
      if (!mountedRef.current) return;

      canvas = canvasRef?.current ?? document.querySelector("canvas");
      if (canvas) {
        cleanupFn = attachListeners(canvas);
        retryCountRef.current = 0;
      } else if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        retryTimeout = setTimeout(tryFindCanvas, mountDelay);
      } else {
        // Fall back to MutationObserver
        observer = new MutationObserver(() => {
          canvas = document.querySelector("canvas");
          if (canvas && mountedRef.current) {
            observer?.disconnect();
            cleanupFn = attachListeners(canvas);
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    };

    // Start with initial delay to let Canvas mount
    retryTimeout = setTimeout(tryFindCanvas, mountDelay);

    // Cleanup
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      observer?.disconnect();
      cleanupFn?.();
    };
  }, [
    autoRestore,
    canvasRef,
    handleContextLost,
    handleContextRestored,
    maxRetries,
    mountDelay,
  ]);

  return contextState;
};

/**
 * Check if WebGL is available in the current browser
 */
export const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    const available = gl !== null;
    // Help GC by cleaning up WebGL context
    if (gl && "getExtension" in gl) {
      const loseContext = gl.getExtension("WEBGL_lose_context");
      loseContext?.loseContext();
    }
    return available;
  } catch {
    return false;
  }
};

/**
 * Check if WebGL2 is available in the current browser
 */
export const isWebGL2Available = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    const available = gl !== null;
    // Help GC by cleaning up WebGL context
    if (gl && "getExtension" in gl) {
      const loseContext = gl.getExtension("WEBGL_lose_context");
      loseContext?.loseContext();
    }
    return available;
  } catch {
    return false;
  }
};
