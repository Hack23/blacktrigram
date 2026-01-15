/**
 * Korean Theme Helper Utilities for HTML Overlays
 * 
 * Provides consistent Korean martial arts cyberpunk theming across all HTML overlay components.
 * These utilities ensure color consistency, bilingual text formatting, and responsive spacing.
 * 
 * @module utils/koreanThemeHelpers
 * @category UI Utilities
 * @korean 한국테마도우미
 */

import {
  KOREAN_COLORS,
  FONT_FAMILY,
} from "../types/constants";
import {
  SPACING,
  BORDER_RADIUS,
} from "../types/constants/ui";
import { hexToRgbaString } from "./colorUtils";

/**
 * Bilingual text format options
 * @korean 이중언어형식
 */
export type BilingualFormat = "pipe" | "parentheses" | "bracket" | "slash";

/**
 * Button variant types for Korean theme
 * @korean 버튼변형
 */
export type KoreanButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning";

/**
 * Responsive spacing size
 * @korean 반응형간격크기
 */
export type SpacingSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

/**
 * Base styles for all Korean-themed overlays
 * 
 * Provides consistent dark background with cyan/gold accents
 * 
 * @param opacity - Background opacity (0-1), default 0.9
 * @returns React.CSSProperties object with Korean theme
 * 
 * @example
 * ```tsx
 * <div style={getKoreanOverlayBaseStyles(0.95)}>
 *   Content
 * </div>
 * ```
 * 
 * @korean 한국오버레이기본스타일얻기
 */
export function getKoreanOverlayBaseStyles(
  opacity: number = 0.9
): React.CSSProperties {
  return {
    backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, opacity),
    border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
    borderRadius: `${BORDER_RADIUS.MD}px`,
    fontFamily: FONT_FAMILY.KOREAN,
    color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY),
    boxShadow: `0 4px 20px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)}`,
  };
}

/**
 * Format bilingual text with Korean and English
 * 
 * Supports multiple formatting styles:
 * - pipe: "한글 | English"
 * - parentheses: "한글 (English)"
 * - bracket: "한글 [English]"
 * - slash: "한글 / English"
 * 
 * @param korean - Korean text
 * @param english - English text
 * @param format - Format style, default "pipe"
 * @returns Formatted bilingual string
 * 
 * @example
 * ```tsx
 * formatBilingualText('공격', 'Attack', 'pipe') // "공격 | Attack"
 * formatBilingualText('방어', 'Defense', 'parentheses') // "방어 (Defense)"
 * ```
 * 
 * @korean 이중언어텍스트형식화
 */
export function formatBilingualText(
  korean: string,
  english: string,
  format: BilingualFormat = "pipe"
): string {
  switch (format) {
    case "pipe":
      return `${korean} | ${english}`;
    case "parentheses":
      return `${korean} (${english})`;
    case "bracket":
      return `${korean} [${english}]`;
    case "slash":
      return `${korean} / ${english}`;
    default:
      return `${korean} | ${english}`;
  }
}

/**
 * Get Korean button styles with variant support
 * 
 * Returns consistent button styling based on variant:
 * - primary: Cyan border, gold text
 * - secondary: Gold border, white text
 * - danger: Red border, red text
 * - success: Green border, green text
 * - warning: Orange border, orange text
 * 
 * @param variant - Button variant type
 * @param isHovered - Whether button is hovered
 * @param isPressed - Whether button is pressed
 * @returns React.CSSProperties for button
 * 
 * @example
 * ```tsx
 * <button style={getKoreanButtonStyles('primary', isHovered, isPressed)}>
 *   {formatBilingualText('확인', 'Confirm')}
 * </button>
 * ```
 * 
 * @korean 한국버튼스타일얻기
 */
export function getKoreanButtonStyles(
  variant: KoreanButtonVariant = "primary",
  isHovered: boolean = false,
  isPressed: boolean = false
): React.CSSProperties {
  // Variant-specific colors
  const variantColors = {
    primary: {
      border: KOREAN_COLORS.PRIMARY_CYAN,
      text: KOREAN_COLORS.ACCENT_GOLD,
      hoverBg: KOREAN_COLORS.PRIMARY_CYAN,
    },
    secondary: {
      border: KOREAN_COLORS.ACCENT_GOLD,
      text: KOREAN_COLORS.TEXT_PRIMARY,
      hoverBg: KOREAN_COLORS.ACCENT_GOLD,
    },
    danger: {
      border: KOREAN_COLORS.ACCENT_RED,
      text: KOREAN_COLORS.ACCENT_RED,
      hoverBg: KOREAN_COLORS.ACCENT_RED,
    },
    success: {
      border: KOREAN_COLORS.ACCENT_GREEN,
      text: KOREAN_COLORS.ACCENT_GREEN,
      hoverBg: KOREAN_COLORS.ACCENT_GREEN,
    },
    warning: {
      border: KOREAN_COLORS.WARNING_ORANGE,
      text: KOREAN_COLORS.WARNING_ORANGE,
      hoverBg: KOREAN_COLORS.WARNING_ORANGE,
    },
  };

  const colors = variantColors[variant];

  let backgroundColor = hexToRgbaString(
    KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
    0.9
  );
  let borderColor = hexToRgbaString(colors.border, 0.8);
  const textColor = hexToRgbaString(colors.text);
  let boxShadow = "none";
  let transform = "scale(1)";

  if (isPressed) {
    backgroundColor = hexToRgbaString(colors.hoverBg, 0.2);
    transform = "scale(0.98)";
  } else if (isHovered) {
    backgroundColor = hexToRgbaString(colors.hoverBg, 0.1);
    borderColor = hexToRgbaString(colors.border, 1.0);
    boxShadow = `0 0 10px ${hexToRgbaString(colors.border, 0.5)}`;
  }

  return {
    backgroundColor,
    border: `2px solid ${borderColor}`,
    borderRadius: `${BORDER_RADIUS.SM}px`,
    color: textColor,
    fontFamily: FONT_FAMILY.KOREAN,
    fontWeight: "bold",
    padding: `${SPACING.SM}px ${SPACING.MD}px`,
    cursor: "pointer",
    transition: "all 0.2s ease",
    userSelect: "none",
    WebkitUserSelect: "none",
    boxShadow,
    transform,
    textShadow: `0 2px 4px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)}`,
  };
}

/**
 * Get responsive spacing value
 * 
 * Returns SPACING constant value for consistent spacing across components.
 * Optionally scales for mobile devices.
 * 
 * @param size - Spacing size constant
 * @param isMobile - Whether to apply mobile scaling
 * @returns Spacing value in pixels
 * 
 * @example
 * ```tsx
 * const padding = getResponsiveSpacing('md', isMobile); // 16px desktop, 14px mobile
 * <div style={{ padding: `${padding}px` }}>Content</div>
 * ```
 * 
 * @korean 반응형간격얻기
 */
export function getResponsiveSpacing(
  size: SpacingSize,
  isMobile: boolean = false
): number {
  const spacingValue = SPACING[size.toUpperCase() as keyof typeof SPACING];
  const mobileScale = 0.875; // 87.5% for mobile
  return isMobile ? Math.round(spacingValue * mobileScale) : spacingValue;
}

/**
 * Get trigram symbol by name
 * 
 * Returns Unicode trigram symbol for visual embellishment
 * 
 * @param name - Trigram name in Korean
 * @returns Unicode trigram symbol
 * 
 * @example
 * ```tsx
 * <div>{getTrigramSymbol('건')} 건 (Heaven)</div>
 * ```
 * 
 * @korean 팔괘기호얻기
 */
export function getTrigramSymbol(
  name: "건" | "태" | "리" | "진" | "손" | "감" | "간" | "곤"
): string {
  const symbols = {
    건: "☰", // Heaven - 乾
    태: "☱", // Lake - 兌
    리: "☲", // Fire - 離
    진: "☳", // Thunder - 震
    손: "☴", // Wind - 巽
    감: "☵", // Water - 坎
    간: "☶", // Mountain - 艮
    곤: "☷", // Earth - 坤
  };
  return symbols[name];
}

/**
 * Get Korean color name for documentation
 * 
 * Maps hex color to Korean color name for better documentation
 * 
 * @param hexColor - Hex color value from KOREAN_COLORS
 * @returns Korean name and English translation
 * 
 * @internal Used primarily for JSDoc documentation
 * @korean 한국색상이름얻기
 */
export function getKoreanColorName(hexColor: number): {
  korean: string;
  english: string;
} {
  const colorNames: Record<
    number,
    { korean: string; english: string }
  > = {
    [KOREAN_COLORS.PRIMARY_CYAN]: { korean: "청록", english: "Cyan" },
    [KOREAN_COLORS.ACCENT_GOLD]: { korean: "금색", english: "Gold" },
    [KOREAN_COLORS.ACCENT_RED]: { korean: "빨강", english: "Red" },
    [KOREAN_COLORS.ACCENT_GREEN]: { korean: "초록", english: "Green" },
    [KOREAN_COLORS.WARNING_ORANGE]: { korean: "주황", english: "Orange" },
    [KOREAN_COLORS.TEXT_PRIMARY]: { korean: "흰색", english: "White" },
    [KOREAN_COLORS.UI_BACKGROUND_DARK]: {
      korean: "어두운배경",
      english: "Dark Background",
    },
  };

  return (
    colorNames[hexColor] ?? { korean: "알수없음", english: "Unknown" }
  );
}

/**
 * Format stat row with bilingual labels
 * 
 * Creates consistent stat row styling for training/combat statistics
 * 
 * @param korean - Korean label
 * @param english - English label
 * @param value - Stat value
 * @param valueColor - Hex color for value text
 * @param isMobile - Mobile responsive mode
 * @returns Stat row configuration object for React rendering
 * 
 * @example
 * ```tsx
 * const statConfig = formatStatRow('점수', 'Score', 1500, KOREAN_COLORS.ACCENT_GOLD, false);
 * ```
 * 
 * @korean 통계행형식화
 */
export function formatStatRow(
  korean: string,
  english: string,
  value: string | number,
  valueColor: number,
  isMobile: boolean
): {
  korean: string;
  english: string;
  value: string | number;
  valueColor: number;
  labelSize: string;
  subLabelSize: string;
  valueSize: string;
} {
  const labelSize = isMobile ? "11px" : "12px";
  const subLabelSize = isMobile ? "8px" : "9px";
  const valueSize = isMobile ? "16px" : "18px";

  return {
    korean,
    english,
    value,
    valueColor,
    labelSize,
    subLabelSize,
    valueSize,
  };
}
