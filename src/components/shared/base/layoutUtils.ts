/**
 * layoutUtils - Layout calculation utilities for Korean-themed components
 * 
 * Provides responsive layout calculations and positioning utilities
 * 
 * @module components/base
 */

/**
 * Layout configuration for responsive design
 */
export interface LayoutConfig {
  readonly isMobile: boolean;
  readonly baseSize?: number;
  readonly mobileSizeScale?: number;
}

/**
 * Calculate responsive font size
 * 
 * @param baseSize - Base font size in pixels
 * @param isMobile - Whether the display is mobile
 * @returns Calculated font size
 */
export function calculateResponsiveFontSize(
  baseSize: number,
  isMobile: boolean
): number {
  return isMobile ? Math.round(baseSize * 0.8) : baseSize;
}

/**
 * Calculate responsive padding
 * 
 * @param basePadding - Base padding in pixels
 * @param isMobile - Whether the display is mobile
 * @returns Calculated padding value
 */
export function calculateResponsivePadding(
  basePadding: number,
  isMobile: boolean
): number {
  return isMobile ? Math.round(basePadding * 0.7) : basePadding;
}

/**
 * Calculate responsive spacing
 * 
 * @param baseSpacing - Base spacing in pixels
 * @param isMobile - Whether the display is mobile
 * @returns Calculated spacing value
 */
export function calculateResponsiveSpacing(
  baseSpacing: number,
  isMobile: boolean
): number {
  return isMobile ? Math.round(baseSpacing * 0.75) : baseSpacing;
}

/**
 * Calculate responsive dimensions
 * 
 * @param config - Layout configuration
 * @returns Calculated dimensions for responsive layout
 */
export function calculateResponsiveDimensions(config: LayoutConfig) {
  const {
    isMobile,
    baseSize = 16,
    mobileSizeScale = 0.8,
  } = config;

  const scale = isMobile ? mobileSizeScale : 1.0;

  return {
    fontSize: Math.round(baseSize * scale),
    padding: Math.round(baseSize * scale * 0.75),
    spacing: Math.round(baseSize * scale * 0.5),
    borderWidth: isMobile ? 1 : 2,
  };
}

/**
 * Get layout constants for screen size
 * 
 * @param isMobile - Whether the display is mobile
 * @returns Layout constants object
 */
export function getLayoutConstants(isMobile: boolean) {
  return {
    padding: isMobile ? 10 : 20,
    spacing: isMobile ? 8 : 15,
    headerHeight: isMobile ? 50 : 60,
    footerHeight: isMobile ? 50 : 60,
    buttonSize: isMobile ? 40 : 60,
    fontSize: {
      small: isMobile ? 12 : 14,
      medium: isMobile ? 14 : 16,
      large: isMobile ? 18 : 20,
      xlarge: isMobile ? 24 : 32,
    },
  };
}

/**
 * Convert pixel value to rem
 * 
 * @param px - Pixel value
 * @param baseFontSize - Base font size (default 16)
 * @returns Value in rem
 */
export function pxToRem(px: number, baseFontSize: number = 16): string {
  return `${px / baseFontSize}rem`;
}

/**
 * Calculate position for centered element
 * 
 * @param containerSize - Size of container
 * @param elementSize - Size of element
 * @returns Centered position
 */
export function calculateCenteredPosition(
  containerSize: number,
  elementSize: number
): number {
  return (containerSize - elementSize) / 2;
}

/**
 * Calculate grid layout dimensions
 * 
 * @param totalItems - Total number of items
 * @param columns - Number of columns
 * @param gap - Gap between items
 * @returns Grid layout dimensions
 */
export function calculateGridLayout(
  totalItems: number,
  columns: number,
  gap: number
) {
  const rows = Math.ceil(totalItems / columns);
  
  return {
    rows,
    columns,
    gap,
    totalGapWidth: (columns - 1) * gap,
    totalGapHeight: (rows - 1) * gap,
  };
}
