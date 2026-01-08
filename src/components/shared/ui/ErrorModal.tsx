/**
 * ErrorModal - Korean-themed error dialog component
 * Provides user-friendly error recovery with retry functionality
 * Follows Korean cyberpunk aesthetic and accessibility best practices
 * 
 * Now uses BaseButtonHTML for consistent Korean theming
 */

import React, { useCallback, useEffect, useRef } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { toHex } from "../../../utils/colorUtils";
import { BaseButtonHTML } from "../base";

interface ErrorModalProps {
  readonly message: string;
  readonly onRetry: () => void;
  readonly onContinue: () => void;
}

// Pre-compute hex colors from Korean color constants
const HEX_COLORS = {
  PRIMARY_CYAN: toHex(KOREAN_COLORS.PRIMARY_CYAN),
  ACCENT_GOLD: toHex(KOREAN_COLORS.ACCENT_GOLD),
  UI_BACKGROUND_DARK: toHex(KOREAN_COLORS.UI_BACKGROUND_DARK),
  TEXT_ERROR: toHex(KOREAN_COLORS.TEXT_ERROR),
} as const;

/**
 * Error modal component with Korean cyberpunk styling
 * Provides retry and continue options for graceful error recovery
 * Includes keyboard navigation
 */
export const ErrorModal: React.FC<ErrorModalProps> = ({
  message,
  onRetry,
  onContinue,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRetry = useCallback(() => {
    onRetry();
  }, [onRetry]);

  const handleContinue = useCallback(() => {
    onContinue();
  }, [onContinue]);

  // Handle keyboard events (Escape key to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleContinue();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleContinue]);

  return (
    <div
      role="alertdialog"
      aria-labelledby="error-modal-title"
      aria-describedby="error-modal-description"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: FONT_FAMILY.CYBER,
      }}
      data-testid="error-modal"
    >
      <div
        style={{
          backgroundColor: `#${HEX_COLORS.UI_BACKGROUND_DARK}`,
          border: `2px solid #${HEX_COLORS.TEXT_ERROR}`,
          borderRadius: "8px",
          padding: "32px",
          maxWidth: "500px",
          boxShadow: `0 8px 32px #${HEX_COLORS.TEXT_ERROR}40`,
        }}
      >
        {/* Error Icon */}
        <div
          style={{
            textAlign: "center",
            fontSize: "48px",
            marginBottom: "16px",
          }}
          aria-hidden="true"
        >
          ⚠️
        </div>

        {/* Title */}
        <h2
          id="error-modal-title"
          style={{
            color: `#${HEX_COLORS.TEXT_ERROR}`,
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          오류 발생 | Error Occurred
        </h2>

        {/* Message */}
        <p
          id="error-modal-description"
          style={{
            color: `#${HEX_COLORS.PRIMARY_CYAN}`,
            fontSize: "16px",
            textAlign: "center",
            marginBottom: "32px",
            lineHeight: "1.5",
          }}
        >
          {message}
        </p>

        {/* Action Buttons - Now using BaseButtonHTML */}
        <div
          ref={containerRef}
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
          }}
        >
          <BaseButtonHTML
            korean="재시도"
            english="Retry"
            onClick={handleRetry}
            variant="primary"
            size="md"
            testId="error-modal-retry"
            autoFocus={true}
          />

          <BaseButtonHTML
            korean="무음으로 계속"
            english="Continue Without Sound"
            onClick={handleContinue}
            variant="secondary"
            size="md"
            testId="error-modal-continue"
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
