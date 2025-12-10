/**
 * useWindowSize - Shared hook for responsive window dimensions
 *
 * @korean 윈도우크기훅 - 반응형 창 크기를 위한 공유 훅
 *
 * Eliminates duplication across screen components
 */

import { useCallback, useEffect, useState } from "react";

export interface WindowSize {
  readonly width: number;
  readonly height: number;
}

export interface UseWindowSizeOptions {
  /**
   * Initial width if window is not available (SSR)
   * @default 1200
   */
  readonly initialWidth?: number;

  /**
   * Initial height if window is not available (SSR)
   * @default 800
   */
  readonly initialHeight?: number;

  /**
   * Debounce delay in milliseconds
   * @default 0
   */
  readonly debounceMs?: number;
}

/**
 * Hook to track window dimensions with optional debouncing
 *
 * @korean 윈도우 크기를 추적하는 훅 (선택적 디바운싱 지원)
 *
 * @param options - Configuration options
 * @returns Current window dimensions
 *
 * @example
 * ```tsx
 * const { width, height } = useWindowSize();
 * const isMobile = width < 768;
 * ```
 */
export function useWindowSize(options: UseWindowSizeOptions = {}): WindowSize {
  const { initialWidth = 1200, initialHeight = 800, debounceMs = 0 } = options;

  const [size, setSize] = useState<WindowSize>(() => {
    // Check if window is available (SSR safety)
    if (typeof window !== "undefined") {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return {
      width: initialWidth,
      height: initialHeight,
    };
  });

  const handleResize = useCallback(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    // Safety check for SSR
    if (typeof window === "undefined") return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const debouncedResize = () => {
      if (debounceMs > 0) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(handleResize, debounceMs);
      } else {
        handleResize();
      }
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [handleResize, debounceMs]);

  return size;
}

/**
 * Hook to determine if current viewport is mobile-sized
 *
 * @korean 현재 뷰포트가 모바일 크기인지 확인하는 훅
 *
 * @param breakpoint - Width threshold for mobile (default: 768)
 * @returns True if viewport width is less than breakpoint
 *
 * @example
 * ```tsx
 * const isMobile = useIsMobile();
 * const isMobileCustom = useIsMobile(640);
 * ```
 */
export function useIsMobile(breakpoint = 768): boolean {
  const { width } = useWindowSize();
  return width < breakpoint;
}

export default useWindowSize;
