/**
 * Layout-related type definitions for unified positioning system
 *
 * Provides type-safe interfaces for grid-based layout, responsive positioning,
 * and z-index hierarchy management across all screens.
 *
 * @module types/LayoutTypes
 * @category Type Definitions
 * @korean 레이아웃타입
 */

import { Position } from "./common";

/**
 * Screen size breakpoints for responsive design
 *
 * @category Layout Types
 * @korean 화면크기
 */
export interface ScreenSize {
  /** Screen width in pixels */
  readonly width: number;
  /** Screen height in pixels */
  readonly height: number;
  /** Whether the device is mobile (<768px) */
  readonly isMobile: boolean;
  /** Whether the device is tablet (768-1199px) */
  readonly isTablet: boolean;
  /** Whether the device is desktop (≥1200px) */
  readonly isDesktop: boolean;
  /** Whether the screen is in landscape orientation */
  readonly isLandscape: boolean;
}

/**
 * Grid-based position configuration
 *
 * Uses 12-column grid system for consistent alignment.
 * 
 * **Important:** Valid combinations must satisfy:
 * - column: 0-11 (starting column)
 * - span: 1-12 (number of columns to span)
 * - column + span ≤ 12 (must not exceed grid width)
 * 
 * Invalid combinations (e.g., column: 10, span: 5) will throw runtime errors.
 * Use LayoutSystem.calculateGridPosition() which validates inputs.
 *
 * @category Layout Types
 * @korean 그리드위치
 * 
 * @example Valid positions
 * ```typescript
 * { column: 0, span: 12 }  // Full width
 * { column: 2, span: 8 }   // Centered 8 columns
 * { column: 0, span: 6 }   // Left half
 * { column: 6, span: 6 }   // Right half
 * ```
 * 
 * @example Invalid positions (will throw errors)
 * ```typescript
 * { column: 10, span: 5 }  // ERROR: 10 + 5 = 15 > 12
 * { column: -1, span: 6 }  // ERROR: column < 0
 * { column: 5, span: 0 }   // ERROR: span < 1
 * ```
 */
export interface GridPosition {
  /** Grid column to start from (0-11) */
  readonly column: number;
  /** Number of columns to span (1-12) */
  readonly span: number;
  /** Row index for vertical positioning (multiplied by DEFAULT_ROW_HEIGHT=100px) */
  readonly row?: number;
  /** Gutter size in pixels (default: 20) */
  readonly gutter?: number;
}

/**
 * Responsive position that adapts to screen size
 *
 * @category Layout Types
 * @korean 반응형위치
 */
export interface ResponsivePosition {
  /** Base position for desktop (1200px+) */
  readonly base: Position;
  /** Position override for tablet (768-1199px) */
  readonly tablet?: Position;
  /** Position override for mobile (<768px) */
  readonly mobile?: Position;
  /** Whether to scale proportionally based on screen width */
  readonly scaleProportionally?: boolean;
}

/**
 * Z-index hierarchy for layering UI elements
 *
 * Ensures consistent stacking order across all screens
 *
 * @category Layout Constants
 * @korean z인덱스계층
 */
export const Z_INDEX = {
  /** Background scenes and effects - 배경 */
  BACKGROUND: 0,
  /** Combat arena and training grounds - 경기장 */
  ARENA: 10,
  /** Player characters and enemies - 플레이어 */
  PLAYERS: 20,
  /** Visual effects and particles - 효과 */
  EFFECTS: 30,
  /** HUD elements (health bars, timers) - HUD */
  HUD: 40,
  /** Mobile touch controls - 모바일제어 */
  MOBILE_CONTROLS: 50,
  /** Modal dialogs and overlays - 모달 */
  MODAL: 60,
  /** Tooltips and hints - 툴팁 */
  TOOLTIP: 70,
  /** Debug and performance overlays - 디버그 */
  DEBUG: 80,
} as const;

/**
 * Type for Z_INDEX values
 *
 * @category Layout Types
 */
export type ZIndexValue = (typeof Z_INDEX)[keyof typeof Z_INDEX];

/**
 * Alignment options for positioning elements
 *
 * @category Layout Types
 * @korean 정렬
 */
export type HorizontalAlignment = "left" | "center" | "right";
export type VerticalAlignment = "top" | "middle" | "bottom";

/**
 * Layout configuration for a component
 *
 * @category Layout Types
 * @korean 레이아웃설정
 */
export interface LayoutConfig {
  /** Grid-based position (if using grid system) */
  readonly grid?: GridPosition;
  /** Responsive position (if not using grid) */
  readonly position?: ResponsivePosition;
  /** Z-index layer for stacking */
  readonly zIndex?: ZIndexValue;
  /** Horizontal alignment within container */
  readonly horizontalAlign?: HorizontalAlignment;
  /** Vertical alignment within container */
  readonly verticalAlign?: VerticalAlignment;
  /** Margin in pixels */
  readonly margin?: number;
  /** Padding in pixels */
  readonly padding?: number;
}

/**
 * Safe area insets for mobile devices with notches
 *
 * @category Layout Types
 * @korean 안전영역
 */
export interface SafeAreaInsets {
  /** Top inset (notch, status bar) */
  readonly top: number;
  /** Right inset (typically 0) */
  readonly right: number;
  /** Bottom inset (home indicator) */
  readonly bottom: number;
  /** Left inset (typically 0) */
  readonly left: number;
}

/**
 * Container bounds for positioning child elements
 *
 * @category Layout Types
 * @korean 컨테이너경계
 */
export interface ContainerBounds {
  /** X position in pixels */
  readonly x: number;
  /** Y position in pixels */
  readonly y: number;
  /** Width in pixels */
  readonly width: number;
  /** Height in pixels */
  readonly height: number;
  /** Scale factor (1.0 = no scaling) */
  readonly scale?: number;
}
