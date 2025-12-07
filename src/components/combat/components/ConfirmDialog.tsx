/**
 * ConfirmDialog Component - Modal confirmation dialog
 * 
 * Features:
 * - Korean/English bilingual text
 * - Cyberpunk Korean theming
 * - Backdrop blur effect
 * - Responsive sizing
 * - Keyboard shortcuts (Enter = confirm, Esc = cancel)
 */

import React, { useEffect } from "react";
import { useAudio } from "../../../audio/AudioProvider";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";

export interface ConfirmDialogProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly titleKorean: string;
  readonly message: string;
  readonly messageKorean: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly isMobile: boolean;
}

/**
 * ConfirmDialog - Modal confirmation dialog with Korean theming
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  titleKorean,
  message,
  messageKorean,
  onConfirm,
  onCancel,
  isMobile,
}) => {
  const audio = useAudio();

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      data-testid="confirm-dialog"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.8),
        backdropFilter: "blur(8px)",
        zIndex: 1001,
        pointerEvents: "auto",
      }}
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        style={{
          padding: isMobile ? "24px" : "32px",
          backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1),
          border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
          borderRadius: "12px",
          maxWidth: isMobile ? "320px" : "400px",
          boxShadow: `0 0 30px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
        }}
      >
        {/* Title */}
        <h2
          data-testid="dialog-title"
          style={{
            fontSize: isMobile ? "20px" : "24px",
            color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "bold",
            margin: "0 0 16px 0",
            textAlign: "center",
            textShadow: `0 0 10px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.4)}`,
          }}
        >
          {titleKorean}
          <br />
          {title}
        </h2>

        {/* Message */}
        <p
          data-testid="dialog-message"
          style={{
            fontSize: isMobile ? "14px" : "16px",
            color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
            fontFamily: FONT_FAMILY.KOREAN,
            margin: "0 0 24px 0",
            lineHeight: "1.5",
            textAlign: "center",
          }}
        >
          {messageKorean}
          <br />
          {message}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            onClick={() => {
              audio.playSFX("menu_back");
              onCancel();
            }}
            onMouseEnter={() => audio.playSFX("menu_hover")}
            data-testid="cancel-button"
            style={{
              flex: 1,
              padding: isMobile ? "10px" : "12px",
              fontSize: isMobile ? "14px" : "16px",
              backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 1),
              color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
              border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
              borderRadius: "6px",
              fontFamily: FONT_FAMILY.KOREAN,
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgbaString(
                KOREAN_COLORS.PRIMARY_CYAN,
                0.2
              );
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgbaString(
                KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                1
              );
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            취소 | Cancel
          </button>
          <button
            onClick={() => {
              audio.playSFX("menu_select");
              onConfirm();
            }}
            onMouseEnter={() => audio.playSFX("menu_hover")}
            data-testid="confirm-button"
            style={{
              flex: 1,
              padding: isMobile ? "10px" : "12px",
              fontSize: isMobile ? "14px" : "16px",
              backgroundColor: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
              color: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1),
              border: "none",
              borderRadius: "6px",
              fontFamily: FONT_FAMILY.KOREAN,
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgbaString(
                KOREAN_COLORS.SECONDARY_YELLOW,
                1
              );
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgbaString(
                KOREAN_COLORS.ACCENT_GOLD,
                1
              );
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            확인 | Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
