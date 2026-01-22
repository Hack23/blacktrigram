/**
 * BackButton - Shared back/return button for screens
 * 
 * Provides a consistent bilingual button for returning to menu or previous screen.
 * Uses BaseButtonOverlayHtml for consistency and maintainability.
 * 
 * @module components/shared/ui
 * @category UI Components
 * @korean 뒤로가기버튼
 */

import React from "react";
import { BaseButtonOverlayHtml } from "../../shared/base/BaseButtonOverlayHtml";

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
 * Reusable bilingual back/return button using BaseButtonOverlayHtml.
 * Provides consistent Korean theming and responsive sizing.
 * 
 * Refactored to use BaseButtonOverlayHtml for better consistency.
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
  return (
    <BaseButtonOverlayHtml
      korean={korean}
      english={english}
      onClick={onClick}
      variant="primary"
      size="md"
      isMobile={isMobile}
      testId={testId}
    />
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
 * Secondary action button using BaseButtonOverlayHtml with secondary variant.
 * Used for links and secondary actions like ISMS policy links.
 * 
 * Refactored to use BaseButtonOverlayHtml for better consistency.
 * 
 * @example
 * ```tsx
 * <LinkButton
 *   onClick={() => window.open(url)}
 *   korean="보안 정책"
 *   english="Security Policy"
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
  const labelKorean = icon ? `${icon} ${korean}` : korean;
  
  return (
    <BaseButtonOverlayHtml
      korean={labelKorean}
      english={english}
      onClick={onClick}
      variant="secondary"
      size="sm"
      isMobile={isMobile}
      testId={testId}
    />
  );
};

export default { BackButton, LinkButton };
