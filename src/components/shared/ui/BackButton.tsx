/**
 * BackButton - Shared back/return button for screens
 * 
 * Provides a consistent bilingual button for returning to menu or previous screen.
 * Uses Korean theming with gold accent and responsive sizing.
 * 
 * @module components/shared/ui
 * @category UI Components
 * @korean 뒤로가기버튼
 */

import React from "react";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { useKoreanTheme } from "../../shared/base/useKoreanTheme";

export interface BackButtonProps {
  /** Callback when button is clicked */
  readonly onClick: () => void;
  /** Korean text for the button */
  readonly korean?: string;
  /** English text for the button */
  readonly english?: string;
  /** Whether on mobile device */
  readonly isMobile: boolean;
  /** Test ID for the button */
  readonly testId?: string;
}

/**
 * BackButton Component
 * 
 * Reusable bilingual back/return button with Korean theming.
 * Features gradient gold background, hover effects, and responsive sizing.
 * 
 * Reduces code duplication by ~30 lines per usage (inline button styling)
 * 
 * @example
 * ```tsx
 * <BackButton
 *   onClick={() => navigate('/menu')}
 *   korean="돌아가기"
 *   english="Return"
 *   isMobile={false}
 * />
 * ```
 */
export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  korean = "돌아가기",
  english = "Return",
  isMobile,
  testId = "back-button",
}) => {
  const theme = useKoreanTheme({ variant: "primary", size: "md", isMobile });

  return (
    <button
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${hexToRgbaString(
          theme.colors.ACCENT_GOLD,
          0.8,
        )}, ${hexToRgbaString(theme.colors.ACCENT_GOLD, 0.6)})`,
        border: `2px solid ${hexToRgbaString(theme.colors.ACCENT_GOLD, 0.9)}`,
        borderRadius: "8px",
        padding: "10px 20px",
        fontSize: isMobile ? "12px" : "14px",
        fontWeight: "bold",
        color: "#000",
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontFamily: theme.koreanTypography.fontFamily,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = `0 0 15px ${hexToRgbaString(
          theme.colors.ACCENT_GOLD,
          0.6,
        )}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
      data-testid={testId}
      aria-label={`${korean} | ${english}`}
    >
      {korean} | {english}
    </button>
  );
};

export interface LinkButtonProps {
  /** Callback when button is clicked */
  readonly onClick: () => void;
  /** Korean text for the button */
  readonly korean: string;
  /** English text for the button */
  readonly english: string;
  /** Icon/emoji to display */
  readonly icon?: string;
  /** Whether on mobile device */
  readonly isMobile: boolean;
  /** Test ID for the button */
  readonly testId?: string;
}

/**
 * LinkButton Component
 * 
 * Transparent button with border, used for secondary actions like external links.
 * Features Korean theming with gold accent and hover effects.
 * 
 * Reduces code duplication by ~27 lines per usage (inline button styling)
 * 
 * @example
 * ```tsx
 * <LinkButton
 *   onClick={() => window.open(url)}
 *   korean="공개 보안 정책"
 *   english="View Security Policies"
 *   icon="🔐"
 *   isMobile={false}
 * />
 * ```
 */
export const LinkButton: React.FC<LinkButtonProps> = ({
  onClick,
  korean,
  english,
  icon,
  isMobile,
  testId = "link-button",
}) => {
  const theme = useKoreanTheme({ variant: "primary", size: "sm", isMobile });

  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: `1px solid ${hexToRgbaString(theme.colors.ACCENT_GOLD, 0.9)}`,
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: isMobile ? "10px" : "12px",
        fontWeight: "bold",
        color: hexToRgbaString(theme.colors.ACCENT_GOLD, 1),
        cursor: "pointer",
        transition: "all 0.3s ease",
        fontFamily: theme.koreanTypography.fontFamily,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hexToRgbaString(
          theme.colors.ACCENT_GOLD,
          0.2,
        );
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.transform = "scale(1)";
      }}
      data-testid={testId}
      aria-label={`${korean} | ${english}`}
    >
      {icon && `${icon} `}
      {korean} | {english}
    </button>
  );
};

export default { BackButton, LinkButton };
