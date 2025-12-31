/**
 * Type definitions for Three.js Html overlay positioning system
 * 
 * Provides type-safe interfaces for Html overlays from @react-three/drei
 * with Korean theming and cyberpunk styling.
 * 
 * @module types/HtmlOverlayTypes
 * @category Type Definitions
 * @korean HTML오버레이타입
 */

import type { ZIndexValue } from "./LayoutTypes";

/**
 * Html overlay layer categories for z-index management
 * Maps to Z_INDEX hierarchy in LayoutTypes
 * 
 * @category Html Overlay Types
 * @korean 오버레이계층
 */
export type HtmlOverlayLayer =
  | "background" // Z_INDEX.BACKGROUND (0)
  | "arena" // Z_INDEX.ARENA (10)
  | "players" // Z_INDEX.PLAYERS (20)
  | "effects" // Z_INDEX.EFFECTS (30)
  | "hud" // Z_INDEX.HUD (40)
  | "mobile-controls" // Z_INDEX.MOBILE_CONTROLS (50)
  | "modal" // Z_INDEX.MODAL (60)
  | "tooltip" // Z_INDEX.TOOLTIP (70)
  | "debug"; // Z_INDEX.DEBUG (80)

/**
 * Screen bounds for position calculations
 * Used to prevent Html overlays from clipping at screen edges
 * 
 * @category Html Overlay Types
 * @korean 화면경계
 */
export interface ScreenBounds {
  /** Screen width in pixels */
  readonly width: number;
  /** Screen height in pixels */
  readonly height: number;
  /** Safe area insets (for mobile notches) */
  readonly safeArea?: {
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly left: number;
  };
}

/**
 * Element bounds for positioning calculations
 * Represents the size and position of an Html overlay element
 * 
 * @category Html Overlay Types
 * @korean 요소경계
 */
export interface ElementBounds {
  /** Element width in pixels */
  readonly width: number;
  /** Element height in pixels */
  readonly height: number;
  /** Optional margin around element */
  readonly margin?: number;
}

/**
 * Safe position result after bounds checking
 * Ensures Html overlay stays within screen bounds
 * 
 * @category Html Overlay Types
 * @korean 안전위치
 */
export interface SafePosition {
  /** X coordinate in pixels */
  readonly x: number;
  /** Y coordinate in pixels */
  readonly y: number;
  /** Whether position was clamped to screen bounds */
  readonly wasClamped: boolean;
}

/**
 * Html overlay styling configuration
 * Standardized styles for Korean-themed Html overlays
 * 
 * @category Html Overlay Types
 * @korean 오버레이스타일
 */
export interface HtmlOverlayStyle {
  /** Z-index for layering */
  readonly zIndex: ZIndexValue;
  /** Pointer events setting ('none' | 'all' | 'auto') */
  readonly pointerEvents: "none" | "all" | "auto";
  /** Distance factor for Html scaling (default: 10) */
  readonly distanceFactor?: number;
  /** Whether to center the Html overlay */
  readonly center?: boolean;
  /** Whether to occlude behind 3D objects */
  readonly occlude?: boolean;
  /** Transform for positioning (translate, rotate, etc.) */
  readonly transform?: string;
}

/**
 * Korean text measurement result
 * Used for calculating text bounds before rendering
 * 
 * @category Html Overlay Types
 * @korean 텍스트측정
 */
export interface TextMeasurement {
  /** Total width in pixels */
  readonly width: number;
  /** Total height in pixels (including line-height) */
  readonly height: number;
  /** Korean text width */
  readonly koreanWidth: number;
  /** English text width */
  readonly englishWidth: number;
}

/**
 * Html overlay positioning options
 * Complete configuration for Html overlay placement
 * 
 * @category Html Overlay Types
 * @korean 오버레이위치설정
 */
export interface HtmlOverlayPositionOptions {
  /** 3D position [x, y, z] */
  readonly position: [number, number, number];
  /** Layer for z-index calculation */
  readonly layer: HtmlOverlayLayer;
  /** Screen bounds for clipping prevention */
  readonly screenBounds?: ScreenBounds;
  /** Element bounds for position calculation */
  readonly elementBounds?: ElementBounds;
  /** Whether on mobile device */
  readonly isMobile?: boolean;
  /** Additional z-index offset */
  readonly zIndexOffset?: number;
}

/**
 * Html overlay configuration result
 * Complete styling and positioning for Html overlay
 * 
 * @category Html Overlay Types
 * @korean 오버레이설정결과
 */
export interface HtmlOverlayConfig {
  /** Calculated safe position */
  readonly position: SafePosition;
  /** Styling configuration */
  readonly style: HtmlOverlayStyle;
  /** Original 3D position [x, y, z] */
  readonly position3D: [number, number, number];
}

/**
 * Html overlay performance options
 * Settings for optimizing Html overlay rendering
 * 
 * @category Html Overlay Types
 * @korean 오버레이성능설정
 */
export interface HtmlOverlayPerformanceOptions {
  /** Whether to use React.memo for component */
  readonly useMemo?: boolean;
  /** Whether to render only when visible */
  readonly renderWhenVisible?: boolean;
  /** Distance threshold for culling (meters) */
  readonly cullDistance?: number;
  /** Whether to use GPU acceleration */
  readonly useGPUAcceleration?: boolean;
}
