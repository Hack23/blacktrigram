/**
 * ErrorModal - Korean-themed error dialog component
 * Provides user-friendly error recovery with retry functionality
 * Follows Korean cyberpunk aesthetic and accessibility best practices
 */

import React, { useCallback } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";

interface ErrorModalProps {
  readonly message: string;
  readonly onRetry: () => void;
  readonly onContinue: () => void;
}

/**
 * Error modal component with Korean cyberpunk styling
 * Provides retry and continue options for graceful error recovery
 */
export const ErrorModal: React.FC<ErrorModalProps> = ({
  message,
  onRetry,
  onContinue,
}) => {
  const handleRetry = useCallback(() => {
    onRetry();
  }, [onRetry]);

  const handleContinue = useCallback(() => {
    onContinue();
  }, [onContinue]);

  // Convert colors to hex for inline styles
  const toHex = (num: number): string => num.toString(16).padStart(6, "0");

  const HEX_COLORS = {
    PRIMARY_CYAN: toHex(KOREAN_COLORS.PRIMARY_CYAN),
    ACCENT_GOLD: toHex(KOREAN_COLORS.ACCENT_GOLD),
    UI_BACKGROUND_DARK: toHex(KOREAN_COLORS.UI_BACKGROUND_DARK),
    TEXT_ERROR: toHex(KOREAN_COLORS.TEXT_ERROR),
  };

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

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={handleRetry}
            style={{
              backgroundColor: `#${HEX_COLORS.PRIMARY_CYAN}`,
              color: "#000",
              border: "none",
              borderRadius: "4px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              fontFamily: FONT_FAMILY.CYBER,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = `0 4px 16px #${HEX_COLORS.PRIMARY_CYAN}80`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
            data-testid="error-modal-retry"
          >
            재시도 | Retry
          </button>

          <button
            onClick={handleContinue}
            style={{
              backgroundColor: "transparent",
              color: `#${HEX_COLORS.ACCENT_GOLD}`,
              border: `2px solid #${HEX_COLORS.ACCENT_GOLD}`,
              borderRadius: "4px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              fontFamily: FONT_FAMILY.CYBER,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `#${HEX_COLORS.ACCENT_GOLD}20`;
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "scale(1)";
            }}
            data-testid="error-modal-continue"
          >
            무음으로 계속 | Continue Without Sound
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
