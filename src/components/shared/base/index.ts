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

export { BaseButton } from "./BaseButton";
export type { BaseButtonProps } from "./BaseButton";

export { BasePanel } from "./BasePanel";
export type { BasePanelProps } from "./BasePanel";

export { BaseText } from "./BaseText";
export type { BaseTextProps } from "./BaseText";

export { BaseButtonOverlayHtml } from "./BaseButtonOverlayHtml";
export type { BaseButtonOverlayHtmlProps } from "./BaseButtonOverlayHtml";

export { AccessibilityProvider, useAccessibility } from "./AccessibilityProvider";
export type { AccessibilityProviderProps, AccessibilityContextValue } from "./AccessibilityProvider";

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

