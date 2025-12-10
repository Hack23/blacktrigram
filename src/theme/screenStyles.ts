/**
 * screenStyles - Shared style constants for screen components
 *
 * @korean 화면스타일 - 화면 컴포넌트를 위한 공유 스타일 상수
 *
 * Eliminates inline style duplication across screens
 */

import { CSSProperties } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../types/constants";
import { hexToRgbaString } from "../utils/colorUtils";

/**
 * Base container styles for full-screen Canvas wrappers
 */
export const SCREEN_CONTAINER_STYLE: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
};

/**
 * Overlay container that sits on top of the Canvas
 */
export const OVERLAY_CONTAINER_STYLE: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  display: "flex",
  flexDirection: "column",
};

/**
 * Panel background style (dark with cyan border)
 */
export const PANEL_STYLE: CSSProperties = {
  background: "rgba(10, 10, 15, 0.85)",
  border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
  borderRadius: "12px",
  padding: "20px",
  fontFamily: FONT_FAMILY.KOREAN,
};

/**
 * Panel background style for mobile (compact)
 */
export const PANEL_STYLE_MOBILE: CSSProperties = {
  ...PANEL_STYLE,
  padding: "12px",
  borderRadius: "8px",
};

/**
 * Section title style (Korean-English bilingual)
 */
export const SECTION_TITLE_STYLE: CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
  fontFamily: FONT_FAMILY.KOREAN,
  marginBottom: "16px",
  textAlign: "center",
};

/**
 * Section title style for mobile
 */
export const SECTION_TITLE_STYLE_MOBILE: CSSProperties = {
  ...SECTION_TITLE_STYLE,
  fontSize: "18px",
  marginBottom: "12px",
};

/**
 * Body text style
 */
export const BODY_TEXT_STYLE: CSSProperties = {
  fontSize: "14px",
  color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 1),
  fontFamily: FONT_FAMILY.KOREAN,
  lineHeight: 1.6,
};

/**
 * Body text style for mobile
 */
export const BODY_TEXT_STYLE_MOBILE: CSSProperties = {
  ...BODY_TEXT_STYLE,
  fontSize: "12px",
  lineHeight: 1.5,
};

/**
 * Standard button style (cyan theme)
 */
export const BUTTON_STYLE: CSSProperties = {
  background: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.9),
  color: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1),
  border: "none",
  borderRadius: "8px",
  padding: "12px 24px",
  fontSize: "16px",
  fontFamily: FONT_FAMILY.KOREAN,
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s ease",
  minHeight: "44px", // Accessibility: minimum touch target
};

/**
 * Standard button style for mobile
 */
export const BUTTON_STYLE_MOBILE: CSSProperties = {
  ...BUTTON_STYLE,
  padding: "10px 16px",
  fontSize: "14px",
};

/**
 * Gold accent button style
 */
export const BUTTON_STYLE_GOLD: CSSProperties = {
  ...BUTTON_STYLE,
  background: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.9),
};

/**
 * Screen header style
 */
export const SCREEN_HEADER_STYLE: CSSProperties = {
  position: "absolute",
  top: "10px",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "24px",
  fontWeight: "bold",
  fontFamily: FONT_FAMILY.KOREAN,
  color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
  textShadow: "0 0 4px rgba(0,0,0,0.8)",
  zIndex: 200,
  pointerEvents: "none",
};

/**
 * Screen header style for mobile
 */
export const SCREEN_HEADER_STYLE_MOBILE: CSSProperties = {
  ...SCREEN_HEADER_STYLE,
  fontSize: "18px",
};

/**
 * Footer container style (for back buttons, etc.)
 */
export const FOOTER_CONTAINER_STYLE: CSSProperties = {
  position: "absolute",
  bottom: "30px",
  left: "50%",
  transform: "translateX(-50%)",
  pointerEvents: "auto",
  zIndex: 100,
};

/**
 * Footer container style for mobile
 */
export const FOOTER_CONTAINER_STYLE_MOBILE: CSSProperties = {
  ...FOOTER_CONTAINER_STYLE,
  bottom: "20px",
};

/**
 * Scrollable content area style
 */
export const SCROLLABLE_CONTENT_STYLE: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  padding: "20px",
  scrollbarWidth: "thin",
  scrollbarColor: `${hexToRgbaString(
    KOREAN_COLORS.PRIMARY_CYAN,
    0.5
  )} transparent`,
};

/**
 * Grid layout for cards/items
 */
export const CARD_GRID_STYLE: CSSProperties = {
  display: "grid",
  gap: "16px",
};

/**
 * Responsive grid columns helper
 */
export function getGridColumns(
  isMobile: boolean,
  isTablet: boolean,
  desktopColumns = 3
): string {
  if (isMobile) return "1fr";
  if (isTablet) return "repeat(2, 1fr)";
  return `repeat(${desktopColumns}, 1fr)`;
}

/**
 * Creates responsive padding based on viewport
 */
export function getResponsivePadding(
  isMobile: boolean,
  isTablet: boolean
): string {
  if (isMobile) return "10px";
  if (isTablet) return "15px";
  return "20px";
}

/**
 * Creates responsive font size based on viewport
 */
export function getResponsiveFontSize(
  baseSizeDesktop: number,
  isMobile: boolean,
  isTablet: boolean
): number {
  if (isMobile) return Math.round(baseSizeDesktop * 0.75);
  if (isTablet) return Math.round(baseSizeDesktop * 0.875);
  return baseSizeDesktop;
}

/**
 * CSS for button hover effects (to be used with <style> tag)
 */
export const BUTTON_HOVER_CSS = `
  .korean-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)};
  }
  .korean-btn:active {
    transform: scale(0.98);
  }
  .korean-btn-gold:hover {
    box-shadow: 0 0 20px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8)};
  }
`;

export default {
  SCREEN_CONTAINER_STYLE,
  OVERLAY_CONTAINER_STYLE,
  PANEL_STYLE,
  PANEL_STYLE_MOBILE,
  SECTION_TITLE_STYLE,
  SECTION_TITLE_STYLE_MOBILE,
  BODY_TEXT_STYLE,
  BODY_TEXT_STYLE_MOBILE,
  BUTTON_STYLE,
  BUTTON_STYLE_MOBILE,
  BUTTON_STYLE_GOLD,
  SCREEN_HEADER_STYLE,
  SCREEN_HEADER_STYLE_MOBILE,
  FOOTER_CONTAINER_STYLE,
  FOOTER_CONTAINER_STYLE_MOBILE,
  SCROLLABLE_CONTENT_STYLE,
  CARD_GRID_STYLE,
  BUTTON_HOVER_CSS,
  getGridColumns,
  getResponsivePadding,
  getResponsiveFontSize,
};
