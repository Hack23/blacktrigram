import React, { useMemo } from "react";
import { TRIGRAM_DATA } from "../../../../systems/trigram/types";
import { TrigramStance } from "../../../../types";
import { KOREAN_COLORS } from "../../../../types/constants/colors";
import { hexToRgbaString } from "../../../../utils/colorUtils";

export interface InteractiveTrigramGridProps {
  readonly selectedTrigram: TrigramStance | null;
  readonly onTrigramSelect: (stance: TrigramStance) => void;
  readonly isMobile?: boolean;
}

/**
 * Interactive Trigram Grid Component
 * 
 * **Korean**: 인터랙티브 트라이그램 그리드
 * 
 * Displays a clickable grid of all eight trigrams with:
 * - 2x4 or 4x2 responsive grid layout
 * - Visual selection indicators
 * - Hover effects with Korean cyberpunk styling
 * - Bilingual labels (Korean | English)
 * - Accessible keyboard navigation
 * 
 * Features:
 * - Theme colors from TRIGRAM_DATA
 * - Smooth transitions and animations
 * - Touch-friendly for mobile devices
 * - ARIA labels for screen readers
 * 
 * @example
 * ```typescript
 * <InteractiveTrigramGrid
 *   selectedTrigram={selectedTrigram}
 *   onTrigramSelect={(stance) => handleSelect(stance)}
 *   isMobile={false}
 * />
 * ```
 * 
 * @public
 * @category Philosophy Components
 */
export const InteractiveTrigramGrid: React.FC<
  InteractiveTrigramGridProps
> = ({ selectedTrigram, onTrigramSelect, isMobile = false }) => {
  // All eight trigrams in I Ching order
  const trigrams = useMemo(
    () => [
      TrigramStance.GEON,
      TrigramStance.TAE,
      TrigramStance.LI,
      TrigramStance.JIN,
      TrigramStance.SON,
      TrigramStance.GAM,
      TrigramStance.GAN,
      TrigramStance.GON,
    ],
    []
  );

  // Grid configuration based on device
  const columns = isMobile ? 2 : 4;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: isMobile ? "10px" : "15px",
        padding: isMobile ? "15px" : "20px",
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
        borderRadius: "12px",
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6)}`,
      }}
      role="grid"
      aria-label="Trigram selection grid"
      data-testid="trigram-grid"
    >
      {trigrams.map((stance) => {
        const trigram = TRIGRAM_DATA[stance];
        const isSelected = selectedTrigram === stance;

        return (
          <button
            key={stance}
            onClick={() => onTrigramSelect(stance)}
            style={{
              background: isSelected
                ? hexToRgbaString(trigram.theme.primary, 0.3)
                : hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.6),
              border: `2px solid ${
                isSelected
                  ? `#${trigram.theme.primary.toString(16).padStart(6, "0")}`
                  : hexToRgbaString(trigram.theme.primary, 0.4)
              }`,
              borderRadius: "8px",
              padding: isMobile ? "12px" : "15px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = hexToRgbaString(
                  trigram.theme.primary,
                  0.2
                );
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 0 20px ${hexToRgbaString(
                  trigram.theme.primary,
                  0.5
                )}`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = hexToRgbaString(
                  KOREAN_COLORS.UI_BACKGROUND_LIGHT,
                  0.6
                );
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
            role="gridcell"
            aria-label={`${trigram.name.korean} ${trigram.name.english} trigram`}
            aria-pressed={isSelected}
            data-testid={`trigram-grid-button-${stance}`}
          >
            {/* Glow effect when selected */}
            {isSelected && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle, ${hexToRgbaString(
                    trigram.theme.primary,
                    0.2
                  )} 0%, transparent 70%)`,
                  animation: "pulse 2s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Trigram symbol */}
            <div
              style={{
                fontSize: isMobile ? "36px" : "48px",
                color: `#${trigram.theme.primary.toString(16).padStart(6, "0")}`,
                textShadow: isSelected
                  ? `0 0 20px ${hexToRgbaString(trigram.theme.primary, 0.8)}`
                  : "none",
                fontWeight: "bold",
                transition: "all 0.3s ease",
              }}
            >
              {trigram.symbol}
            </div>

            {/* Korean name */}
            <div
              style={{
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "bold",
                color: isSelected
                  ? `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`
                  : `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
                transition: "all 0.3s ease",
              }}
            >
              {trigram.name.korean}
            </div>

            {/* English name */}
            <div
              style={{
                fontSize: isMobile ? "11px" : "13px",
                color: isSelected
                  ? `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`
                  : `#${KOREAN_COLORS.TEXT_TERTIARY.toString(16).padStart(6, "0")}`,
                transition: "all 0.3s ease",
              }}
            >
              {trigram.name.english}
            </div>

            {/* Chinese character */}
            <div
              style={{
                fontSize: isMobile ? "12px" : "14px",
                color: `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`,
                fontWeight: "bold",
                transition: "all 0.3s ease",
              }}
            >
              {trigram.chinese}
            </div>
          </button>
        );
      })}

      {/* Pulse animation for selected state */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
          }
        `}
      </style>
    </div>
  );
};

export default InteractiveTrigramGrid;
