import React, { useMemo } from "react";
import { TrigramStance } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";
import { ResponsivePixiContainer } from "./base/ResponsivePixiComponents";

export interface StanceIndicatorProps {
  readonly stance: TrigramStance;
  readonly x: number;
  readonly y: number;
  readonly size?: number;
  readonly showDetails?: boolean;
}

const STANCE_INFO = {
  [TrigramStance.GEON]: {
    korean: "건",
    english: "Heaven",
    symbol: "☰",
    color: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    description: "직접적인 골격 타격",
    englishDescription: "Direct bone-striking force",
  },
  [TrigramStance.TAE]: {
    korean: "태",
    english: "Lake",
    symbol: "☱",
    color: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    description: "유동적인 관절 조작",
    englishDescription: "Fluid joint manipulation",
  },
  [TrigramStance.LI]: {
    korean: "리",
    english: "Fire",
    symbol: "☲",
    color: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
    description: "정밀한 신경 타격",
    englishDescription: "Precise nerve strikes",
  },
  [TrigramStance.JIN]: {
    korean: "진",
    english: "Thunder",
    symbol: "☳",
    color: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    description: "기절시키는 기술",
    englishDescription: "Stunning techniques",
  },
  [TrigramStance.SON]: {
    korean: "손",
    english: "Wind",
    symbol: "☴",
    color: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    description: "지속적인 압박",
    englishDescription: "Continuous pressure",
  },
  [TrigramStance.GAM]: {
    korean: "감",
    english: "Water",
    symbol: "☵",
    color: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
    description: "혈류 제한",
    englishDescription: "Blood flow restriction",
  },
  [TrigramStance.GAN]: {
    korean: "간",
    english: "Mountain",
    symbol: "☶",
    color: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
    description: "방어적 반격",
    englishDescription: "Defensive counters",
  },
  [TrigramStance.GON]: {
    korean: "곤",
    english: "Earth",
    symbol: "☷",
    color: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
    description: "지상 기술",
    englishDescription: "Ground techniques",
  },
};

export const StanceIndicator: React.FC<StanceIndicatorProps> = ({
  stance,
  x,
  y,
  size = 60,
  showDetails = true,
  ...props
}) => {
  const stanceInfo = STANCE_INFO[stance];
  const radius = size / 2;

  const pulseAnimation = useMemo(() => {
    return Math.sin(Date.now() * 0.003) * 0.1 + 0.9;
  }, []);

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={size * 2}
      screenHeight={showDetails ? size * 1.8 : size}
      data-testid={`stance-indicator-${stance}`}
      {...props}
    >
      <pixiGraphics
        draw={(g) => {
          g.clear();

          g.fill({
            color: stanceInfo.color,
            alpha: 0.3 * pulseAnimation,
          });
          g.circle(radius, radius, radius + 8);
          g.fill();

          // Main circle
          g.fill({
            color: stanceInfo.color,
            alpha: 0.8,
          });
          g.circle(radius, radius, radius);
          g.fill();

          // Border
          g.stroke({
            width: 3,
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.9,
          });
          g.circle(radius, radius, radius);
          g.stroke();

          // Inner highlight
          g.stroke({
            width: 2,
            color: KOREAN_COLORS.TEXT_PRIMARY,
            alpha: 0.6,
          });
          g.circle(radius, radius, radius - 6);
          g.stroke();
        }}
        data-testid={`stance-circle-${stance}`}
      />

      <pixiText
        text={stanceInfo.symbol}
        style={{
          fontSize: size * 0.4,
          fill: KOREAN_COLORS.TEXT_PRIMARY,
          fontWeight: "bold",
          align: "center",
        }}
        x={radius}
        y={radius}
        anchor={0.5}
        data-testid={`stance-symbol-${stance}`}
      />

      {showDetails && (
        <pixiContainer
          x={0}
          y={size + 10}
          data-testid={`stance-details-${stance}`}
        >
          <pixiText
            text={`${stanceInfo.korean} (${stanceInfo.english})`}
            style={{
              fontSize: size * 0.2,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              align: "center",
              fontFamily: "Noto Sans KR",
            }}
            x={radius}
            y={0}
            anchor={0.5}
            data-testid={`stance-name-${stance}`}
          />

          {/* Description */}
          <pixiText
            text={stanceInfo.description}
            style={{
              fontSize: size * 0.15,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
              fontFamily: "Noto Sans KR",
              wordWrap: true,
              wordWrapWidth: size * 2,
            }}
            x={radius}
            y={size * 0.25}
            anchor={0.5}
            data-testid={`stance-description-${stance}`}
          />

          <pixiText
            text={stanceInfo.englishDescription}
            style={{
              fontSize: size * 0.12,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              align: "center",
              fontStyle: "italic",
              wordWrap: true,
              wordWrapWidth: size * 2,
            }}
            x={radius}
            y={size * 0.45}
            anchor={0.5}
            data-testid={`stance-description-english-${stance}`}
          />
        </pixiContainer>
      )}

      {/* Active indicator */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({
            color: KOREAN_COLORS.ACCENT_GREEN,
            alpha: 0.8 * pulseAnimation,
          });
          g.circle(radius + radius * 0.7, radius - radius * 0.7, 4);
          g.fill();
        }}
        data-testid={`stance-active-indicator-${stance}`}
      />
    </ResponsivePixiContainer>
  );
};

export default StanceIndicator;
