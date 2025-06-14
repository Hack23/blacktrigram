import React, { useCallback, useMemo } from "react";
import { TrigramStance } from "../../types/enums";
import { KOREAN_COLORS } from "../../types/constants";
import { ResponsivePixiContainer } from "./base/ResponsivePixiComponents";

export interface TrigramWheelProps {
  readonly selectedStance: TrigramStance;
  readonly onStanceChange: (stance: TrigramStance) => void;
  readonly onStanceSelect: (stance: TrigramStance) => void;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly interactive?: boolean;
}

const TRIGRAM_DATA = {
  [TrigramStance.GEON]: {
    korean: "건",
    symbol: "☰",
    angle: 0,
    color: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    technique: "천둥벽력",
  },
  [TrigramStance.TAE]: {
    korean: "태",
    symbol: "☱",
    angle: 45,
    color: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    technique: "유수연타",
  },
  [TrigramStance.LI]: {
    korean: "리",
    symbol: "☲",
    angle: 90,
    color: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
    technique: "화염지창",
  },
  [TrigramStance.JIN]: {
    korean: "진",
    symbol: "☳",
    angle: 135,
    color: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    technique: "벽력일섬",
  },
  [TrigramStance.SON]: {
    korean: "손",
    symbol: "☴",
    angle: 180,
    color: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    technique: "선풍연격",
  },
  [TrigramStance.GAM]: {
    korean: "감",
    symbol: "☵",
    angle: 225,
    color: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
    technique: "수류반격",
  },
  [TrigramStance.GAN]: {
    korean: "간",
    symbol: "☶",
    angle: 270,
    color: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
    technique: "반석방어",
  },
  [TrigramStance.GON]: {
    korean: "곤",
    symbol: "☷",
    angle: 315,
    color: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
    technique: "대지포옹",
  },
};

export const TrigramWheel: React.FC<TrigramWheelProps> = ({
  selectedStance,
  onStanceChange,
  onStanceSelect,
  x,
  y,
  size,
  interactive = true,
  ...props
}) => {
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  const handleStanceClick = useCallback(
    (stance: TrigramStance) => {
      onStanceChange(stance);
      onStanceSelect(stance);
    },
    [onStanceChange, onStanceSelect]
  );

  const stancePositions = useMemo(() => {
    return Object.entries(TRIGRAM_DATA).map(([stance, data]) => {
      const angleRad = (data.angle * Math.PI) / 180;
      const stanceRadius = radius * 0.7;
      const stanceX = centerX + Math.cos(angleRad) * stanceRadius;
      const stanceY = centerY + Math.sin(angleRad) * stanceRadius;

      return {
        stance: stance as TrigramStance,
        x: stanceX,
        y: stanceY,
        data,
      };
    });
  }, [radius, centerX, centerY]);

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={size}
      screenHeight={size}
      data-testid="trigram-wheel"
      {...props}
    >
      {/* Wheel Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          // Outer circle
          g.fill({
            color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
            alpha: 0.8,
          });
          g.circle(centerX, centerY, radius);
          g.fill();

          // Border
          g.stroke({
            width: 3,
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.8,
          });
          g.circle(centerX, centerY, radius);
          g.stroke();

          // Inner circle
          g.fill({
            color: KOREAN_COLORS.UI_BACKGROUND_DARK,
            alpha: 0.9,
          });
          g.circle(centerX, centerY, radius * 0.3);
          g.fill();
        }}
        data-testid="trigram-wheel-background"
      />

      {/* Center Symbol */}
      <pixiText
        text="태극"
        style={{
          fontSize: size / 8,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          fontWeight: "bold",
          align: "center",
          fontFamily: "Noto Sans KR",
        }}
        x={centerX}
        y={centerY}
        anchor={0.5}
        data-testid="trigram-wheel-center"
      />

      {/* Stance Positions */}
      {stancePositions.map(({ stance, x: stanceX, y: stanceY, data }) => {
        const isSelected = stance === selectedStance;
        const stanceSize = size / 12;

        return (
          <pixiContainer
            key={stance}
            x={stanceX}
            y={stanceY}
            data-testid={`trigram-stance-${stance}`}
          >
            {/* Stance Background */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: isSelected ? KOREAN_COLORS.ACCENT_GOLD : data.color,
                  alpha: isSelected ? 0.9 : 0.7,
                });
                g.circle(0, 0, stanceSize);
                g.fill();

                g.stroke({
                  width: 2,
                  color: isSelected
                    ? KOREAN_COLORS.PRIMARY_CYAN
                    : KOREAN_COLORS.ACCENT_GOLD,
                  alpha: 0.9,
                });
                g.circle(0, 0, stanceSize);
                g.stroke();

                // Glow effect for selected
                if (isSelected) {
                  g.stroke({
                    width: 4,
                    color: KOREAN_COLORS.PRIMARY_CYAN,
                    alpha: 0.5,
                  });
                  g.circle(0, 0, stanceSize + 2);
                  g.stroke();
                }
              }}
              interactive={interactive}
              onPointerDown={() => handleStanceClick(stance)}
              data-testid={`trigram-stance-bg-${stance}`}
            />

            {/* Trigram Symbol */}
            <pixiText
              text={data.symbol}
              style={{
                fontSize: stanceSize * 0.8,
                fill: isSelected
                  ? KOREAN_COLORS.BLACK_SOLID
                  : KOREAN_COLORS.TEXT_PRIMARY,
                fontWeight: "bold",
                align: "center",
              }}
              anchor={0.5}
              data-testid={`trigram-symbol-${stance}`}
            />

            {/* Korean Text */}
            <pixiText
              text={data.korean}
              style={{
                fontSize: stanceSize * 0.4,
                fill: isSelected
                  ? KOREAN_COLORS.BLACK_SOLID
                  : KOREAN_COLORS.TEXT_SECONDARY,
                fontWeight: "bold",
                align: "center",
                fontFamily: "Noto Sans KR",
              }}
              x={0}
              y={stanceSize + 8}
              anchor={0.5}
              data-testid={`trigram-korean-${stance}`}
            />
          </pixiContainer>
        );
      })}

      {/* Selected Stance Indicator */}
      {selectedStance && (
        <pixiContainer
          x={centerX}
          y={centerY + radius * 0.5}
          data-testid="selected-stance-indicator"
        >
          <pixiText
            text={TRIGRAM_DATA[selectedStance].technique}
            style={{
              fontSize: size / 16,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              fontWeight: "bold",
              align: "center",
              fontFamily: "Noto Sans KR",
            }}
            anchor={0.5}
            data-testid="selected-technique-name"
          />
        </pixiContainer>
      )}
    </ResponsivePixiContainer>
  );
};

export default TrigramWheel;
