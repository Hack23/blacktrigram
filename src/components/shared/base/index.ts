/**
 * Base Korean-themed UI components
 * 
 * Provides centralized Korean cyberpunk theming components
 * to eliminate code duplication across the application.
 * 
 * Enhanced with WCAG 2.1 AA accessibility features and Korean typography optimization
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
export { BaseButtonOverlayHtml } from "./BaseButtonOverlayHtml";
export type { BaseButtonOverlayHtmlProps } from "./BaseButtonOverlayHtml";

// Accessibility provider and hook
export { AccessibilityProvider, useAccessibility } from "./AccessibilityProvider";
export type { AccessibilityProviderProps, AccessibilityContextValue } from "./AccessibilityProvider";

// Hooks - useKoreanTheme is used by 5 files
export { useKoreanTheme } from "./useKoreanTheme";
export type {
  UseKoreanThemeConfig,
  ButtonVariantConfig,
  PanelVariantConfig,
  SizeDimensions,
  TextSizeConfig,
  KoreanTypographyConfig,
  AccessibilityConfig,
} from "./useKoreanTheme";

// Note: layoutUtils exports removed as they are unused in the application
// If needed, import directly from "./layoutUtils" in tests
