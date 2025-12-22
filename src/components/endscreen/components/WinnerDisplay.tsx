import React from "react";
import { PlayerState } from "../../../systems";
import {
  ARCHETYPE_ASSETS,
  FONT_FAMILY,
  KOREAN_COLORS,
} from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { fadeInAnimation, scaleInAnimation } from "./animations";

export interface WinnerDisplayProps {
  readonly winner: PlayerState;
  readonly isVictory: boolean;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
}

/**
 * Helper to convert hex color to CSS string
 */
const toCssColor = (hex: number): string => hexToRgbaString(hex, 1);

/**
 * Winner Display Component
 * Shows winner announcement with archetype details
 */
export const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  winner,
  isVictory,
  isMobile,
  isTablet,
}) => {
  const titleFontSize = isMobile ? 28 : isTablet ? 36 : 44;
  const subtitleFontSize = isMobile ? 16 : isTablet ? 18 : 22;
  const detailFontSize = isMobile ? 12 : 14;
  const spacing = isMobile ? 10 : isTablet ? 12 : 15;

  const primaryColor = isVictory
    ? KOREAN_COLORS.ACCENT_GOLD
    : KOREAN_COLORS.ACCENT_RED;

  const resultText = isVictory
    ? { korean: "승리!", english: "Victory!" }
    : { korean: "패배", english: "Defeat" };

  // Get archetype asset info
  const archetypeKey =
    winner.archetype.toLowerCase() as keyof typeof ARCHETYPE_ASSETS;
  const archetypeAsset =
    ARCHETYPE_ASSETS[archetypeKey] || ARCHETYPE_ASSETS.musa;

  return (
    <div
      data-testid="winner-display"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: spacing,
        animation: "fadeIn 0.8s ease-in",
      }}
    >
      {/* Result Title with glow effect */}
      <div
        style={{
          fontSize: titleFontSize,
          fontWeight: "bold",
          color: toCssColor(primaryColor),
          textShadow: `0 0 20px ${hexToRgbaString(
            primaryColor,
            0.8
          )}, 0 0 40px ${hexToRgbaString(primaryColor, 0.4)}`,
          marginBottom: spacing,
          textAlign: "center",
          fontFamily: FONT_FAMILY.KOREAN,
          animation: "scaleIn 0.5s ease-out",
        }}
        data-testid="result-title"
      >
        {resultText.korean} | {resultText.english}
      </div>

      {/* Winner Name */}
      <div
        style={{
          fontSize: subtitleFontSize,
          color: toCssColor(KOREAN_COLORS.PRIMARY_CYAN),
          marginBottom: spacing / 2,
          textAlign: "center",
          fontFamily: FONT_FAMILY.KOREAN,
          fontWeight: "bold",
        }}
        data-testid="winner-name"
      >
        {winner.name.korean} | {winner.name.english}
      </div>

      {/* Archetype Display */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.6),
          border: `2px solid ${hexToRgbaString(primaryColor, 0.8)}`,
          borderRadius: "12px",
          padding: spacing,
          marginTop: spacing / 2,
          minWidth: isMobile ? "280px" : "320px",
        }}
        data-testid="winner-archetype-display"
      >
        {/* Archetype Name */}
        <div
          style={{
            fontSize: detailFontSize + 2,
            color: toCssColor(KOREAN_COLORS.ACCENT_GOLD),
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "bold",
            marginBottom: spacing / 2,
          }}
          data-testid="winner-archetype"
        >
          {archetypeAsset.name_korean} | {archetypeAsset.name_english}
        </div>

        {/* Archetype Code */}
        <div
          style={{
            fontSize: detailFontSize - 2,
            color: toCssColor(KOREAN_COLORS.TEXT_SECONDARY),
            fontFamily: FONT_FAMILY.KOREAN,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
          data-testid="archetype-code"
        >
          {winner.archetype.toUpperCase()}
        </div>

        {/* Combat Stats Summary */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: spacing,
            marginTop: spacing,
            fontSize: detailFontSize - 2,
            color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY),
          }}
          data-testid="combat-stats-summary"
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: toCssColor(KOREAN_COLORS.HEALTH_FULL),
                fontWeight: "bold",
              }}
            >
              {Math.round(winner.health)}
            </div>
            <div>체력 | HP</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: toCssColor(KOREAN_COLORS.KI_FULL),
                fontWeight: "bold",
              }}
            >
              {Math.round(winner.ki)}
            </div>
            <div>기력 | Ki</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: toCssColor(KOREAN_COLORS.STAMINA_FULL),
                fontWeight: "bold",
              }}
            >
              {Math.round(winner.stamina)}
            </div>
            <div>스태미나 | Stamina</div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        ${fadeInAnimation}
        ${scaleInAnimation}
      `}</style>
    </div>
  );
};
