/**
 * Safe area utilities for handling notched devices
 * 
 * Provides CSS safe area inset helpers for iOS and Android devices
 * with notches, home indicators, and other screen intrusions.
 * 
 * @module utils/safeAreaUtils
 * @category UI Utilities
 * @korean 안전영역유틸리티
 */

import { SAFE_AREA_INSETS } from "../types/constants/ui";

/**
 * Safe area edge types
 * 
 * @category Safe Area
 * @korean 안전영역가장자리타입
 */
export type SafeAreaEdge = "top" | "bottom" | "left" | "right";

/**
 * Get CSS safe area inset with fallback
 * Returns CSS `env()` with fallback to constant values
 * 
 * @param edge - Which edge to get inset for
 * @param fallback - Optional custom fallback value in pixels
 * @returns CSS string with env() and fallback
 * 
 * @example
 * ```typescript
 * getSafeAreaInset('top'); // "env(safe-area-inset-top, 44px)"
 * getSafeAreaInset('bottom', 20); // "env(safe-area-inset-bottom, 20px)"
 * ```
 * 
 * @public
 * @korean 안전영역삽입얻기
 */
export function getSafeAreaInset(
  edge: SafeAreaEdge,
  fallback?: number
): string {
  const defaultFallback =
    edge === "top"
      ? SAFE_AREA_INSETS.TOP
      : edge === "bottom"
      ? SAFE_AREA_INSETS.BOTTOM
      : edge === "left"
      ? SAFE_AREA_INSETS.LEFT
      : SAFE_AREA_INSETS.RIGHT;

  const fallbackValue = fallback ?? defaultFallback;
  return `env(safe-area-inset-${edge}, ${fallbackValue}px)`;
}

/**
 * Get safe area padding for a container
 * Returns CSS padding object with safe area support
 * 
 * @param edges - Which edges to apply safe area padding
 * @param additionalPadding - Additional padding to add (in pixels)
 * @returns CSS padding object
 * 
 * @example
 * ```typescript
 * getSafeAreaPadding(['top', 'bottom'], 16);
 * // {
 * //   paddingTop: "max(16px, env(safe-area-inset-top))",
 * //   paddingBottom: "max(16px, env(safe-area-inset-bottom))"
 * // }
 * ```
 * 
 * @public
 * @korean 안전영역패딩얻기
 */
export function getSafeAreaPadding(
  edges: readonly SafeAreaEdge[],
  additionalPadding = 0
): Partial<Record<`padding${Capitalize<SafeAreaEdge>}`, string>> {
  const result: Partial<Record<`padding${Capitalize<SafeAreaEdge>}`, string>> =
    {};

  for (const edge of edges) {
    const capitalizedEdge =
      (edge.charAt(0).toUpperCase() + edge.slice(1)) as Capitalize<SafeAreaEdge>;
    const key = `padding${capitalizedEdge}` as const;

    result[key] = `max(${additionalPadding}px, ${getSafeAreaInset(edge)})`;
  }

  return result;
}

/**
 * Get safe area aware positioning styles
 * Useful for fixed/absolute positioned elements
 * 
 * @param edge - Which edge to position from
 * @param baseOffset - Base offset in pixels
 * @returns CSS positioning string
 * 
 * @example
 * ```typescript
 * getSafeAreaPosition('bottom', 20);
 * // "calc(20px + env(safe-area-inset-bottom, 34px))"
 * ```
 * 
 * @public
 * @korean 안전영역위치얻기
 */
export function getSafeAreaPosition(
  edge: SafeAreaEdge,
  baseOffset = 0
): string {
  return `calc(${baseOffset}px + ${getSafeAreaInset(edge)})`;
}

/**
 * Get safe area aware height calculation
 * Useful for full-height containers
 * 
 * @param excludeEdges - Which edges to exclude from height
 * @returns CSS calc() string for height
 * 
 * @example
 * ```typescript
 * getSafeAreaHeight(['top', 'bottom']);
 * // "calc(100vh - env(safe-area-inset-top, 44px) - env(safe-area-inset-bottom, 34px))"
 * ```
 * 
 * @public
 * @korean 안전영역높이얻기
 */
export function getSafeAreaHeight(
  excludeEdges: readonly SafeAreaEdge[]
): string {
  const insets = excludeEdges.map((edge) => getSafeAreaInset(edge)).join(" - ");
  return `calc(100vh - ${insets})`;
}

/**
 * Check if device likely has safe area insets
 * Uses user agent detection (not perfect but useful)
 * 
 * @returns Whether device likely has safe area insets
 * 
 * @example
 * ```typescript
 * if (hasSafeAreaInsets()) {
 *   // Apply safe area styles
 * }
 * ```
 * 
 * @public
 * @korean 안전영역삽입여부
 */
export function hasSafeAreaInsets(): boolean {
  // Check if CSS env() is supported
  if (typeof CSS !== "undefined" && CSS.supports) {
    return CSS.supports("padding-top", "env(safe-area-inset-top)");
  }

  // Fallback: Check for iPhone X+ user agents
  const ua = navigator.userAgent;
  return (
    /iPhone/.test(ua) &&
    (screen.width === 375 && screen.height === 812) || // iPhone X, XS, 11 Pro
    (screen.width === 414 && screen.height === 896) || // iPhone XR, XS Max, 11, 11 Pro Max
    (screen.width === 390 && screen.height === 844) || // iPhone 12, 12 Pro, 13, 13 Pro, 14
    (screen.width === 393 && screen.height === 852) || // iPhone 14 Pro
    (screen.width === 428 && screen.height === 926) // iPhone 12/13/14 Pro Max
  );
}

/**
 * Get comprehensive safe area styles for a container
 * Combines padding and positioning for complete safe area support
 * 
 * @param options - Configuration options
 * @returns React CSSProperties object
 * 
 * @example
 * ```typescript
 * const styles = getSafeAreaStyles({
 *   applyPadding: ['top', 'bottom'],
 *   additionalPadding: 16,
 *   position: 'fixed'
 * });
 * ```
 * 
 * @public
 * @korean 안전영역스타일얻기
 */
export function getSafeAreaStyles(options: {
  readonly applyPadding?: readonly SafeAreaEdge[];
  readonly additionalPadding?: number;
  readonly position?: "fixed" | "absolute" | "sticky";
}): React.CSSProperties {
  const { applyPadding = [], additionalPadding = 0, position } = options;

  const paddingStyles = getSafeAreaPadding(applyPadding, additionalPadding);

  return {
    ...paddingStyles,
    ...(position && { position }),
  };
}
