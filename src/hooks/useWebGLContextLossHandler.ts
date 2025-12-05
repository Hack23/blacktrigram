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
import { useEffect, useRef } from "react";

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
}

/**
 * Hook to handle WebGL context loss and restoration
 */
export const useWebGLContextLossHandler = (
  options: WebGLContextLossOptions = {}
): void => {
  const {
    onContextLost,
    onContextRestored,
    autoRestore = true,
    canvasRef,
  } = options;

  // Use refs to store the latest callbacks to avoid re-registering event listeners
  const onContextLostRef = useRef(onContextLost);
  const onContextRestoredRef = useRef(onContextRestored);

  // Update refs when callbacks change
  useEffect(() => {
    onContextLostRef.current = onContextLost;
    onContextRestoredRef.current = onContextRestored;
  });

  useEffect(() => {
    let canvas = canvasRef?.current ?? document.querySelector("canvas");
    let cleanupFn: (() => void) | undefined;

    const handleContextLost = (event: Event) => {
      console.warn("WebGL context lost - attempting to restore");

      // Prevent default behavior to allow restoration
      if (autoRestore) {
        event.preventDefault();
      }

      onContextLostRef.current?.();
    };

    const handleContextRestored = () => {
      console.log("WebGL context restored successfully");
      onContextRestoredRef.current?.();
    };

    const attachListeners = (canvasEl: HTMLCanvasElement) => {
      canvasEl.addEventListener("webglcontextlost", handleContextLost, false);
      canvasEl.addEventListener(
        "webglcontextrestored",
        handleContextRestored,
        false
      );
      return () => {
        canvasEl.removeEventListener("webglcontextlost", handleContextLost);
        canvasEl.removeEventListener(
          "webglcontextrestored",
          handleContextRestored
        );
      };
    };

    if (canvas) {
      cleanupFn = attachListeners(canvas);
    } else {
      // Canvas not yet mounted, use MutationObserver to wait for it
      const observer = new MutationObserver(() => {
        canvas = document.querySelector("canvas");
        if (canvas) {
          observer.disconnect();
          cleanupFn = attachListeners(canvas);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Cleanup observer if component unmounts before canvas is found
      return () => {
        observer.disconnect();
        cleanupFn?.();
      };
    }

    // Cleanup
    return () => {
      cleanupFn?.();
    };
  }, [autoRestore, canvasRef]);
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
