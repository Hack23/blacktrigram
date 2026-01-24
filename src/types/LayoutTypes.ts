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
 * **Usage Guidelines:**
 * - NEVER use arbitrary z-index values (e.g., 999)
 * - Use these constants to maintain consistent layer ordering
 * - Layer order: Scene → HUD → Overlay → Modal → Pause Menu
 *
 * @category Layout Constants
 * @korean z인덱스계층
 */
export const Z_INDEX = {
  // 3D Scene layers (0-30)
  /** Background scenes and effects - 배경 */
  BACKGROUND: 0,
  /** Combat arena and training grounds - 경기장 */
  ARENA: 10,
  /** Player characters and enemies - 플레이어 */
  PLAYERS: 20,
  /** Visual effects and particles - 효과 */
  EFFECTS: 30,

  // HUD layers (40-99)
  /** HUD background elements - HUD 배경 */
  HUD_BACKGROUND: 40,
  /** Main HUD elements (health bars, timers, stats) - 주 HUD */
  HUD: 50,
  /** TechniqueBar for combat techniques - 기술바 */
  TECHNIQUE_BAR: 55,
  /** HUD overlay elements (within HUD components) - HUD 오버레이 */
  HUD_OVERLAY: 60,

  // Top-level UI (100+)
  /** Mobile touch controls - 모바일제어 */
  MOBILE_CONTROLS: 100,
  /** Modal dialogs and overlays - 모달 */
  MODAL: 200,
  /** Tooltips and hints - 툴팁 */
  TOOLTIP: 300,
  /** Pause menu - 일시정지 메뉴 */
  PAUSE_MENU: 1000,
  /** Loading screens - 로딩 */
  LOADING: 2000,
  /** Debug and performance overlays - 디버그 */
  DEBUG: 9000,
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

/**
 * HUD Positioning Strategy Documentation
 *
 * This section defines the standardized approach for positioning HUD elements
 * across all screens in the Black Trigram game.
 *
 * **Screen-Level HUDs (Left/Right/Top/Bottom)**:
 * - Use `position: "absolute"` to anchor to screen edges
 * - Anchor directly to edges: `left: 0`, `right: 0`, `top: 0`, `bottom: 0`
 * - Size using percentage-based calculations: `width: ${width * 0.14}px`
 * - Use Z_INDEX.HUD for consistent layering
 * - Example: Combat Left/Right HUDs, Top/Bottom bars
 *
 * **HUD Internal Content**:
 * - Use `position: "relative"` for natural document flow
 * - Use Flexbox for vertical/horizontal layouts: `display: "flex"`, `flexDirection`, `gap`
 * - Use CSS Grid for complex multi-dimensional layouts
 * - Avoid absolute positioning within HUDs (except for special cases)
 * - Example: Player stats, technique cards, control buttons
 *
 * **Special Cases (Overlays/Tooltips)**:
 * - Use `position: "absolute"` for floating elements that must overlay content
 * - Position relative to parent container
 * - Use Z_INDEX.HUD_OVERLAY or Z_INDEX.TOOLTIP
 * - Example: Combat messages, feedback overlays, tooltips
 *
 * **Responsive Design**:
 * - All components must support `isMobile` prop
 * - Use responsive calculations: `isMobile ? 18 : 14` for mobile scaling
 * - Apply `positionScale` multiplier for 4K displays (1.0-1.5)
 *
 * @category Layout Guidelines
 * @korean HUD위치전략
 */

/**
 * HUD width percentages for screen-level HUDs
 *
 * These constants define the standard widths for left and right HUD panels.
 * Values are decimals (0.14 = 14% of screen width).
 *
 * **Usage:**
 * ```tsx
 * const hudWidth = width * HUD_WIDTH_PERCENT.LEFT_DESKTOP;
 * ```
 *
 * @category Layout Constants
 * @korean HUD너비
 */
export const HUD_WIDTH_PERCENT = {
  /** Left HUD width on desktop (14% = leaves 72% for arena) */
  LEFT_DESKTOP: 0.14,
  /** Left HUD width on mobile (18% for touch targets) */
  LEFT_MOBILE: 0.18,
  /** Right HUD width on desktop (14% = leaves 72% for arena) */
  RIGHT_DESKTOP: 0.14,
  /** Right HUD width on mobile (18% for touch targets) */
  RIGHT_MOBILE: 0.18,
  /** Top HUD width (full screen width) */
  TOP: 1.0,
  /** Bottom HUD width (full screen width) */
  BOTTOM: 1.0,
} as const;

/**
 * HUD height constants for top and bottom bars
 *
 * These constants define the standard heights for top and bottom HUD bars.
 * Values are in pixels and should be scaled with `positionScale` for 4K displays.
 *
 * **Usage:**
 * ```tsx
 * const hudHeight = HUD_HEIGHT.TOP_DESKTOP * positionScale;
 * ```
 *
 * @category Layout Constants
 * @korean HUD높이
 */
export const HUD_HEIGHT = {
  /** Top bar height on desktop (slim for minimal obstruction) */
  TOP_DESKTOP: 70,
  /** Top bar height on mobile (extra slim) */
  TOP_MOBILE: 50,
  /** Bottom bar height on desktop (fits technique cards) */
  BOTTOM_DESKTOP: 120,
  /** Bottom bar height on mobile (compact) */
  BOTTOM_MOBILE: 100,
  /** Combat-specific top bar height */
  COMBAT_TOP_DESKTOP: 70,
  /** Combat-specific top bar height on mobile */
  COMBAT_TOP_MOBILE: 55,
  /** Combat-specific bottom bar height */
  COMBAT_BOTTOM_DESKTOP: 120,
  /** Combat-specific bottom bar height on mobile */
  COMBAT_BOTTOM_MOBILE: 100,
  /** Training-specific top bar height */
  TRAINING_TOP_DESKTOP: 70,
  /** Training-specific top bar height on mobile */
  TRAINING_TOP_MOBILE: 50,
  /** Training-specific bottom bar height */
  TRAINING_BOTTOM_DESKTOP: 130,
  /** Training-specific bottom bar height on mobile */
  TRAINING_BOTTOM_MOBILE: 110,
} as const;

/**
 * HUD positioning configuration interface
 *
 * Defines the positioning strategy for a HUD component.
 *
 * @category Layout Types
 * @korean HUD위치설정
 */
export interface HUDPositionConfig {
  /** Positioning strategy */
  readonly strategy: "absolute" | "relative" | "flex" | "grid";
  /** Anchor point for absolute positioning */
  readonly anchor?: "left" | "right" | "top" | "bottom" | "center";
  /** Offset from anchor point */
  readonly offset?: { x?: number; y?: number };
  /** Size configuration */
  readonly size?: { width?: string | number; height?: string | number };
  /** Z-index layer */
  readonly zIndex?: ZIndexValue;
}
