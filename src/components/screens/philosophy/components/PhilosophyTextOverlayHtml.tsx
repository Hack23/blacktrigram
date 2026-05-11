import React, { useMemo } from "react";
import { TRIGRAM_DATA } from "../../../../systems/trigram/types";
import { TrigramStance } from "../../../../types";
import { KOREAN_COLORS } from "../../../../types/constants/colors";
import { hexToRgbaString } from "../../../../utils/colorUtils";

export interface PhilosophyTextOverlayHtmlProps {
  readonly selectedTrigram: TrigramStance | null;
  readonly onClose?: () => void;
  readonly isMobile?: boolean;
}

/**
 * Philosophy Text Overlay Component
 * 
 * **Korean**: 철학 텍스트 오버레이
 * 
 * Displays detailed information about a selected trigram including:
 * - Bilingual name (Korean | English)
 * - Chinese character and attribute
 * - Core meaning and philosophy
 * - Combat application description
 * - Technique details
 * 
 * Features:
 * - Glassmorphic design with Korean cyberpunk aesthetic
 * - Smooth entrance/exit animations
 * - Responsive layout for mobile and desktop
 * - Accessibility support with proper semantic HTML
 * 
 * @example
 * ```typescript
 * import { TrigramStance } from "../../../../types";
 * 
 * <PhilosophyTextOverlayHtml
 *   selectedTrigram={TrigramStance.GEON}
 *   onClose={() => clearSelection()}
 *   isMobile={false}
 * />
 * ```
 * 
 * @category Philosophy Components
 */
export const PhilosophyTextOverlayHtml: React.FC<
  PhilosophyTextOverlayHtmlProps
> = ({ selectedTrigram, onClose, isMobile = false }) => {
  const trigram = selectedTrigram ? TRIGRAM_DATA[selectedTrigram] : null;

  const colors = useMemo(
    () => {
      if (!trigram) {
        return {
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
          border: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
          boxShadow: `0 0 30px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.5)}`,
          text: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
          textSecondary: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
          textTertiary: `#${KOREAN_COLORS.TEXT_TERTIARY.toString(16).padStart(6, "0")}`,
          accentGold: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
          accentCyan: `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`,
          symbolColor: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
        };
      }
      return {
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
        border: `#${trigram.theme.primary.toString(16).padStart(6, "0")}`,
        boxShadow: `0 0 30px ${hexToRgbaString(trigram.theme.primary, 0.5)}`,
        text: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
        textSecondary: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
        textTertiary: `#${KOREAN_COLORS.TEXT_TERTIARY.toString(16).padStart(6, "0")}`,
        accentGold: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
        accentCyan: `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`,
        symbolColor: `#${trigram.theme.primary.toString(16).padStart(6, "0")}`,
      };
    },
    [trigram]
  );

  if (!selectedTrigram || !trigram) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: isMobile ? "90%" : "600px",
        maxHeight: isMobile ? "80vh" : "70vh",
        overflowY: "auto",
        background: colors.background,
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        border: `3px solid ${colors.border}`,
        boxShadow: colors.boxShadow,
        padding: isMobile ? "20px" : "30px",
        zIndex: 1000,
        animation: "philosophyFadeIn 0.3s ease",
      }}
      data-testid="philosophy-text-overlay"
      role="dialog"
      aria-labelledby="trigram-title"
      aria-modal="true"
    >
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="philosophy-close-button"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8),
            border: `2px solid ${colors.accentGold}`,
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            color: colors.accentGold,
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          aria-label="Close overlay"
          data-testid="close-overlay"
        >
          ✕
        </button>
      )}

      {/* Trigram symbol */}
      <div
        style={{
          fontSize: isMobile ? "64px" : "80px",
          color: colors.symbolColor,
          textAlign: "center",
          marginBottom: "20px",
          textShadow: `0 0 30px ${colors.symbolColor}`,
        }}
      >
        {trigram.symbol}
      </div>

      {/* Title */}
      <h2
        id="trigram-title"
        style={{
          fontSize: isMobile ? "24px" : "28px",
          fontWeight: "bold",
          color: colors.accentGold,
          textAlign: "center",
          margin: "0 0 10px 0",
        }}
      >
        {trigram.name.korean} | {trigram.name.english}
      </h2>

      {/* Chinese character and attribute */}
      <div
        style={{
          fontSize: isMobile ? "16px" : "18px",
          color: colors.accentCyan,
          textAlign: "center",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        {trigram.chinese} - {trigram.attribute.chinese}, {trigram.attribute.korean}
      </div>

      {/* Meaning section */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.5),
          borderRadius: "8px",
          border: `1px solid ${colors.border}`,
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? "16px" : "18px",
            color: colors.accentGold,
            marginBottom: "10px",
          }}
        >
          의미 | Meaning
        </h3>
        <p
          style={{
            fontSize: isMobile ? "14px" : "16px",
            color: colors.text,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {trigram.meaning.korean}
        </p>
        <p
          style={{
            fontSize: isMobile ? "13px" : "15px",
            color: colors.textSecondary,
            margin: "8px 0 0 0",
            lineHeight: 1.6,
          }}
        >
          {trigram.meaning.english}
        </p>
      </div>

      {/* Philosophy section */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.5),
          borderRadius: "8px",
          border: `1px solid ${colors.border}`,
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? "16px" : "18px",
            color: colors.accentGold,
            marginBottom: "10px",
          }}
        >
          철학 | Philosophy
        </h3>
        <p
          style={{
            fontSize: isMobile ? "14px" : "16px",
            color: colors.text,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {trigram.philosophy.korean}
        </p>
        <p
          style={{
            fontSize: isMobile ? "13px" : "15px",
            color: colors.textSecondary,
            margin: "8px 0 0 0",
            lineHeight: 1.6,
          }}
        >
          {trigram.philosophy.english}
        </p>
      </div>

      {/* Combat application */}
      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.5),
          borderRadius: "8px",
          border: `1px solid ${colors.border}`,
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? "16px" : "18px",
            color: colors.accentGold,
            marginBottom: "10px",
          }}
        >
          전투 응용 | Combat Application
        </h3>
        <p
          style={{
            fontSize: isMobile ? "14px" : "16px",
            color: colors.text,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {trigram.combat.korean}
        </p>
        <p
          style={{
            fontSize: isMobile ? "13px" : "15px",
            color: colors.textSecondary,
            margin: "8px 0 0 0",
            lineHeight: 1.6,
          }}
        >
          {trigram.combat.english}
        </p>
      </div>

      {/* Primary technique */}
      <div
        style={{
          padding: "15px",
          background: hexToRgbaString(trigram.theme.primary, 0.15),
          borderRadius: "8px",
          border: `2px solid ${colors.border}`,
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? "16px" : "18px",
            color: colors.accentGold,
            marginBottom: "10px",
          }}
        >
          기본 기술 | Primary Technique
        </h3>
        <p
          style={{
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "bold",
            color: colors.text,
            margin: "0 0 10px 0",
          }}
        >
          {trigram.techniques.primary.korean} | {trigram.techniques.primary.english}
        </p>
        <p
          style={{
            fontSize: isMobile ? "13px" : "14px",
            color: colors.textSecondary,
            margin: "0 0 12px 0",
            lineHeight: 1.6,
          }}
        >
          {trigram.techniques.primary.description.korean}
        </p>
        <p
          style={{
            fontSize: isMobile ? "12px" : "13px",
            color: colors.textTertiary,
            margin: 0,
            fontStyle: "italic",
            lineHeight: 1.6,
          }}
        >
          {trigram.techniques.primary.description.english}
        </p>

        {/* Technique stats */}
        <div
          style={{
            marginTop: "15px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "10px",
          }}
        >
          <div>
            <span style={{ color: colors.textSecondary, fontSize: "12px" }}>
              데미지 | Damage:
            </span>
            <span
              style={{
                color: colors.accentGold,
                fontSize: "14px",
                fontWeight: "bold",
                marginLeft: "5px",
              }}
            >
              {trigram.techniques.primary.damage}
            </span>
          </div>
          <div>
            <span style={{ color: colors.textSecondary, fontSize: "12px" }}>
              명중률 | Hit Chance:
            </span>
            <span
              style={{
                color: colors.accentGold,
                fontSize: "14px",
                fontWeight: "bold",
                marginLeft: "5px",
              }}
            >
              {(trigram.techniques.primary.hitChance * 100).toFixed(0)}%
            </span>
          </div>
          <div>
            <span style={{ color: colors.textSecondary, fontSize: "12px" }}>
              기 소모 | Ki Cost:
            </span>
            <span
              style={{
                color: colors.accentCyan,
                fontSize: "14px",
                fontWeight: "bold",
                marginLeft: "5px",
              }}
            >
              {trigram.techniques.primary.kiCost}
            </span>
          </div>
          <div>
            <span style={{ color: colors.textSecondary, fontSize: "12px" }}>
              체력 소모 | Stamina:
            </span>
            <span
              style={{
                color: colors.accentCyan,
                fontSize: "14px",
                fontWeight: "bold",
                marginLeft: "5px",
              }}
            >
              {trigram.techniques.primary.staminaCost}
            </span>
          </div>
        </div>
      </div>

      {/* Fade in animation and hover styles */}
      <style>
        {`
          @keyframes philosophyFadeIn {
            from {
              opacity: 0;
              transform: translate(-50%, -48%) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
          
          .philosophy-close-button:hover {
            background: ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.2)} !important;
            transform: scale(1.1) !important;
          }
        `}
      </style>
    </div>
  );
};

export default PhilosophyTextOverlayHtml;
