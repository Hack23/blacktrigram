import React, { useMemo } from "react";
import type { KoreanText } from "../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import {
  getNeonTextShadow,
  getKoreanFontOptimization,
} from "../../../utils/visualEffects";
import "./KoreanHeaderOverlayHtml.css";

export interface KoreanHeaderOverlayHtmlProps {
  readonly title: KoreanText;
  readonly subtitle?: KoreanText;
  readonly size?: "small" | "medium" | "large";
  readonly alignment?: "left" | "center" | "right";
  readonly showUnderline?: boolean;
  readonly animated?: boolean;
  readonly glowIntensity?: number;
}

/**
 * HTML-based KoreanHeader component for Three.js integration
 */
export const KoreanHeaderOverlayHtml: React.FC<KoreanHeaderOverlayHtmlProps> = ({
  title,
  subtitle,
  size = "medium",
  alignment = "center",
  showUnderline = true,
  animated = true,
  glowIntensity = 1.0,
}) => {
  const titleSize = size === "large" ? 32 : size === "medium" ? 24 : 18;
  const subtitleSize = titleSize * 0.7;

  const alignmentStyle =
    alignment === "center" ? "center" : alignment === "right" ? "flex-end" : "flex-start";

  // Use enhanced neon text shadow utilities
  const titleTextShadow = getNeonTextShadow(
    KOREAN_COLORS.ACCENT_GOLD, 
    glowIntensity >= 1.0 ? "strong" : glowIntensity >= 0.6 ? "medium" : "subtle"
  );

  const subtitleTextShadow = getNeonTextShadow(
    KOREAN_COLORS.PRIMARY_CYAN,
    glowIntensity >= 0.6 ? "medium" : "subtle"
  );

  // Memoize RGBA color calculations with glowIntensity
  const colors = useMemo(() => ({
    titleStroke: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8),
    svgCircleFill: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.3),
    svgCircleCenterFill: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6),
  }), []);

  // Korean font optimization
  const fontOptimization = getKoreanFontOptimization(titleSize, "bold");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: alignmentStyle,
        gap: "8px",
        position: "relative",
      }}
      data-testid="korean-header"
    >
      {/* Main Korean title */}
      <div
        style={{
          ...fontOptimization,
          fontFamily: FONT_FAMILY.KOREAN,
          color: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
          textAlign: alignment,
          textShadow: titleTextShadow,
          animation: animated ? "pulse 2s ease-in-out infinite" : "none",
          WebkitTextStroke: `1px ${colors.titleStroke}`,
        }}
      >
        {title.korean}
      </div>

      {/* English subtitle */}
      <div
        style={{
          fontFamily: FONT_FAMILY.KOREAN,
          fontSize: `${titleSize * 0.6}px`,
          color: `#${KOREAN_COLORS.TEXT_TERTIARY.toString(16).padStart(6, "0")}`,
          fontStyle: "italic",
          textAlign: alignment,
          textShadow: subtitleTextShadow,
          opacity: 0.9,
        }}
      >
        {title.english}
      </div>

      {/* Enhanced Korean traditional + cyberpunk underline */}
      {showUnderline && (
        <div
          style={{
            width: `${titleSize * 6}px`,
            height: "30px",
            position: "relative",
            marginTop: "10px",
          }}
        >
          {/* Traditional Korean curve (태극 inspired) */}
          <svg
            width={titleSize * 6}
            height={30}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            {/* Main golden curve */}
            <path
              d={`M 0 8 Q ${titleSize * 1.5} 2, ${titleSize * 4.5} 14 T ${titleSize * 6} 8`}
              stroke={`#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`}
              strokeWidth="3"
              fill="none"
              opacity="0.8"
              style={{
                animation: animated ? "glow 2s ease-in-out infinite" : "none",
              }}
            />

            {/* Secondary cyan accent line */}
            <path
              d={`M ${titleSize * 0.6} 11 Q ${titleSize * 1.8} 8, ${titleSize * 4.2} 17 T ${titleSize * 5.4} 11`}
              stroke={`#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`}
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
              style={{
                animation: animated ? "glow-alt 3s ease-in-out infinite" : "none",
              }}
            />

            {/* Left trigram (☰ - Heaven) */}
            <g opacity="0.4">
              <line
                x1={-8}
                y1={20}
                x2={-2}
                y2={20}
                stroke={`#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`}
                strokeWidth="2"
              />
              <line
                x1={-8}
                y1={23}
                x2={-2}
                y2={23}
                stroke={`#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`}
                strokeWidth="2"
              />
              <line
                x1={-8}
                y1={26}
                x2={-2}
                y2={26}
                stroke={`#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`}
                strokeWidth="2"
              />
            </g>

            {/* Right trigram (☷ - Earth) - broken lines */}
            <g opacity="0.4">
              <line
                x1={titleSize * 6 + 2}
                y1={20}
                x2={titleSize * 6 + 4}
                y2={20}
                stroke={`#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`}
                strokeWidth="2"
              />
              <line
                x1={titleSize * 6 + 5}
                y1={20}
                x2={titleSize * 6 + 8}
                y2={20}
                stroke={`#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`}
                strokeWidth="2"
              />

              <line
                x1={titleSize * 6 + 2}
                y1={23}
                x2={titleSize * 6 + 4}
                y2={23}
                stroke={`#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`}
                strokeWidth="2"
              />
              <line
                x1={titleSize * 6 + 5}
                y1={23}
                x2={titleSize * 6 + 8}
                y2={23}
                stroke={`#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`}
                strokeWidth="2"
              />

              <line
                x1={titleSize * 6 + 2}
                y1={26}
                x2={titleSize * 6 + 4}
                y2={26}
                stroke={`#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`}
                strokeWidth="2"
              />
              <line
                x1={titleSize * 6 + 5}
                y1={26}
                x2={titleSize * 6 + 8}
                y2={26}
                stroke={`#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`}
                strokeWidth="2"
              />
            </g>

            {/* Central energy orb */}
            <circle
              cx={titleSize * 3}
              cy={14}
              r="6"
              fill={colors.svgCircleFill}
              style={{
                animation: animated ? "pulse 2.5s ease-in-out infinite" : "none",
              }}
            />
            <circle
              cx={titleSize * 3}
              cy={14}
              r="3"
              fill={colors.svgCircleCenterFill}
              style={{
                animation: animated ? "pulse 2.5s ease-in-out infinite" : "none",
              }}
            />
          </svg>
        </div>
      )}

      {/* Subtitle section with traditional spacing */}
      {subtitle && (
        <>
          <div
            style={{
              fontFamily: FONT_FAMILY.KOREAN,
              fontSize: `${subtitleSize}px`,
              color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
              textAlign: alignment,
              textShadow: getNeonTextShadow(KOREAN_COLORS.TEXT_SECONDARY, "subtle"),
              marginTop: "10px",
            }}
          >
            {subtitle.korean}
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY.KOREAN,
              fontSize: `${subtitleSize * 0.8}px`,
              color: `#${KOREAN_COLORS.TEXT_TERTIARY.toString(16).padStart(6, "0")}`,
              fontStyle: "italic",
              textAlign: alignment,
            }}
          >
            {subtitle.english}
          </div>
        </>
      )}
    </div>
  );
};

export default KoreanHeaderOverlayHtml;
