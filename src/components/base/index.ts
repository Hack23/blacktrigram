/**
 * Base Korean-themed UI components
 * 
 * Provides centralized Korean cyberpunk theming components
 * to eliminate code duplication across the application.
 * 
 * @module components/base
 */

// Three.js-based components (require Canvas context)
export { BaseButton } from "./BaseButton";
export type { BaseButtonProps } from "./BaseButton";

export { BasePanel } from "./BasePanel";
export type { BasePanelProps } from "./BasePanel";

export { BaseText } from "./BaseText";
export type { BaseTextProps } from "./BaseText";

// HTML-based components (no Three.js dependency)
export { BaseButtonHTML } from "./BaseButtonHTML";
export type { BaseButtonHTMLProps } from "./BaseButtonHTML";

// Hooks and utilities
export { useKoreanTheme } from "./useKoreanTheme";
export type {
  UseKoreanThemeConfig,
  ButtonVariantConfig,
  PanelVariantConfig,
  SizeDimensions,
  TextSizeConfig,
} from "./useKoreanTheme";

export {
  calculateResponsiveFontSize,
  calculateResponsivePadding,
  calculateResponsiveSpacing,
  calculateResponsiveDimensions,
  getLayoutConstants,
  pxToRem,
  calculateCenteredPosition,
  calculateGridLayout,
} from "./layoutUtils";
export type { LayoutConfig } from "./layoutUtils";
