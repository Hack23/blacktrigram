/**
 * Responsive Type Definitions for Black Trigram
 * 
 * Comprehensive type system for responsive layout management across
 * all screen sizes from mobile (375px) to ultra-wide (2560px+).
 * 
 * Features:
 * - Five screen size categories (mobile, tablet, desktop, large, xlarge)
 * - Proportional scaling system (0.8x - 1.4x)
 * - Korean text readability (14-24px range)
 * - Smooth transitions for resize operations
 * 
 * @module types/ResponsiveTypes
 * @category Responsive Layout
 * @korean 반응형타입정의
 */

/**
 * Screen size categories for responsive design
 * Maps viewport width to device categories
 * 
 * @category Responsive Layout
 * @korean 화면크기범주
 */
export type ScreenSize = 'mobile' | 'tablet' | 'desktop' | 'large' | 'xlarge';

/**
 * Breakpoint values for responsive design transitions
 * Defines width thresholds for each screen size category
 * 
 * @category Responsive Layout
 * @korean 중단점값
 */
export interface ResponsiveBreakpoints {
  /** Small mobile devices (< 768px) - iPhone SE, standard phones */
  readonly MOBILE: number;
  /** Tablet devices (768-1024px) - iPad, Android tablets */
  readonly TABLET: number;
  /** Desktop devices (1024-1440px) - Standard monitors */
  readonly DESKTOP: number;
  /** Large desktop (1440-1920px) - HD/2K monitors */
  readonly LARGE: number;
  /** Extra large (≥1920px) - 4K monitors, ultra-wide displays */
  readonly XLARGE: number;
}

/**
 * Font scaling multipliers for each screen size
 * Ensures consistent readability across all devices
 * 
 * Base size (16px) * scale = final size
 * Clamped to readable range (14-24px)
 * 
 * @category Typography
 * @korean 글꼴스케일배수
 */
export interface FontScaleMap {
  /** Mobile scale (0.8x) - Compact for small screens */
  readonly mobile: number;
  /** Tablet scale (0.9x) - Slightly larger than mobile */
  readonly tablet: number;
  /** Desktop scale (1.0x) - Base reference size */
  readonly desktop: number;
  /** Large scale (1.2x) - Enhanced for large screens */
  readonly large: number;
  /** Extra large scale (1.4x) - Maximum for 4K displays */
  readonly xlarge: number;
}

/**
 * Spacing scaling multipliers for each screen size
 * Proportional spacing that adapts to screen size
 * 
 * Base spacing * scale = final spacing
 * 
 * @category Layout
 * @korean 간격스케일배수
 */
export interface SpacingScaleMap {
  /** Mobile spacing (0.5x) - Compact layout */
  readonly mobile: number;
  /** Tablet spacing (0.75x) - Moderate layout */
  readonly tablet: number;
  /** Desktop spacing (1.0x) - Standard reference */
  readonly desktop: number;
  /** Large spacing (1.25x) - Spacious layout */
  readonly large: number;
  /** Extra large spacing (1.5x) - Maximum for 4K */
  readonly xlarge: number;
}

/**
 * Font size configuration with min/max constraints
 * Ensures Korean and English text remain readable
 * 
 * @category Typography
 * @korean 글꼴크기설정
 */
export interface FontSizeConfig {
  /** Base font size in pixels (reference point) */
  readonly base: number;
  /** Minimum readable size (14px for body text) */
  readonly min: number;
  /** Maximum size before becoming too large (24px) */
  readonly max: number;
  /** Current calculated size for screen */
  readonly current: number;
}

/**
 * Responsive scaling configuration
 * Complete scaling system for all responsive elements
 * 
 * @category Responsive Layout
 * @korean 반응형스케일설정
 */
export interface ResponsiveScaleConfig {
  /** Current screen size category */
  readonly screenSize: ScreenSize;
  /** Font scaling multiplier */
  readonly fontScale: number;
  /** Spacing scaling multiplier */
  readonly spacingScale: number;
  /** Viewport dimensions */
  readonly viewport: {
    readonly width: number;
    readonly height: number;
  };
}

/**
 * Transition configuration for smooth resize operations
 * Ensures 60fps performance during window resize
 * 
 * @category Animation
 * @korean 전환설정
 */
export interface ResizeTransitionConfig {
  /** CSS transition duration (default: 300ms) */
  readonly duration: string;
  /** CSS transition timing function (default: ease-in-out) */
  readonly easing: string;
  /** Properties to transition (default: all) */
  readonly properties: readonly string[];
  /** Whether transitions are enabled */
  readonly enabled: boolean;
}

/**
 * Complete responsive configuration
 * All settings needed for responsive layout management
 * 
 * @category Responsive Layout
 * @korean 반응형설정완료
 */
export interface ResponsiveConfig {
  /** Screen size category */
  readonly screenSize: ScreenSize;
  /** Breakpoint values */
  readonly breakpoints: ResponsiveBreakpoints;
  /** Font scaling configuration */
  readonly fontScale: FontScaleMap;
  /** Spacing scaling configuration */
  readonly spacingScale: SpacingScaleMap;
  /** Transition configuration */
  readonly transitions: ResizeTransitionConfig;
}

/**
 * Calculated responsive values for a component
 * Ready-to-use values computed from configuration
 * 
 * @category Responsive Layout
 * @korean 계산된반응형값
 */
export interface ResponsiveValues {
  /** Calculated font sizes */
  readonly fontSize: {
    readonly small: number;
    readonly body: number;
    readonly title: number;
    readonly hero: number;
    readonly hud: number;
  };
  /** Calculated spacing values */
  readonly spacing: {
    readonly xs: number;
    readonly sm: number;
    readonly md: number;
    readonly lg: number;
    readonly xl: number;
  };
  /** CSS transition string for smooth resizing */
  readonly transition: string;
}

/**
 * Screen size test result
 * Used for testing responsive breakpoints
 * 
 * @category Testing
 * @korean 화면크기테스트결과
 */
export interface ScreenSizeTestResult {
  /** Tested width in pixels */
  readonly width: number;
  /** Tested height in pixels */
  readonly height: number;
  /** Determined screen size */
  readonly screenSize: ScreenSize;
  /** Whether this is mobile */
  readonly isMobile: boolean;
  /** Whether this is tablet */
  readonly isTablet: boolean;
  /** Whether this is desktop or larger */
  readonly isDesktop: boolean;
}
