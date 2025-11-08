import { PlayerState } from "@/systems";
import React, { useMemo } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { extendPixiComponents } from "../../../utils/pixiExtensions";

// Ensure PixiJS components are extended
extendPixiComponents();

// Extract background drawing logic with enhanced visual effects
const createBackgroundDrawer = (
  width: number,
  height: number,
  isTraining: boolean
) => (g: PIXI.Graphics) => {
  g.clear();
  
  // More transparent background
  g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.75 });
  g.roundRect(0, 0, width, height, 8);
  g.fill();

  // Border with training indicator and enhanced glow
  const borderColor = isTraining
    ? KOREAN_COLORS.ACCENT_GREEN
    : KOREAN_COLORS.PRIMARY_CYAN;
  const borderAlpha = isTraining ? 0.9 : 0.7;
  g.stroke({ width: 2, color: borderColor, alpha: borderAlpha });
  g.roundRect(0, 0, width, height, 8);
  g.stroke();

  // Training status indicator banner
  if (isTraining) {
    const pulse = 0.3 + Math.sin(Date.now() * 0.005) * 0.15;
    g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: pulse });
    g.roundRect(5, 5, width - 10, 20, 4);
    g.fill();
    
    // Inner glow
    g.stroke({ width: 1, color: KOREAN_COLORS.TEXT_BRIGHT, alpha: 0.3 });
    g.roundRect(5, 5, width - 10, 20, 4);
    g.stroke();
  }
  
  // Corner accents
  const corners = [
    { x: 10, y: 10 },
    { x: width - 10, y: 10 },
    { x: 10, y: height - 10 },
    { x: width - 10, y: height - 10 },
  ];
  
  corners.forEach((corner) => {
    g.stroke({ width: 1.5, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.5 });
    g.moveTo(corner.x - 3, corner.y);
    g.lineTo(corner.x + 3, corner.y);
    g.moveTo(corner.x, corner.y - 3);
    g.lineTo(corner.x, corner.y + 3);
    g.stroke();
  });
};

// Extract resource bar drawer with enhanced visuals
const createResourceBarDrawer = (
  current: number,
  max: number,
  color: number,
  width: number = 70
) => (g: PIXI.Graphics) => {
  g.clear();
  
  // Background with inner shadow effect
  g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });
  g.rect(0, 10, width, 6);
  g.fill();
  
  // Inner shadow
  g.fill({ color: KOREAN_COLORS.BLACK, alpha: 0.3 });
  g.rect(0, 10, width, 2);
  g.fill();

  // Resource fill with gradient simulation
  const percent = max > 0 ? current / max : 0;
  const fillWidth = width * percent;
  
  if (fillWidth > 0) {
    // Main fill
    g.fill({ color, alpha: 0.95 });
    g.rect(0, 10, fillWidth, 6);
    g.fill();
    
    // Highlight on top
    g.fill({ color: KOREAN_COLORS.TEXT_BRIGHT, alpha: 0.3 });
    g.rect(0, 10, fillWidth, 2);
    g.fill();
    
    // Border for filled portion
    g.stroke({ width: 1, color, alpha: 0.6 });
    g.rect(0, 10, fillWidth, 6);
    g.stroke();
  }
  
  // Outer border
  g.stroke({ width: 1, color: KOREAN_COLORS.TEXT_SECONDARY, alpha: 0.5 });
  g.rect(0, 10, width, 6);
  g.stroke();
};

export interface TrainingStatsPanelProps {
  readonly player: PlayerState;
  readonly score: number;
  readonly combo: number;
  readonly isTraining: boolean;
  readonly width?: number;
  readonly height?: number;
  readonly isMobile?: boolean;
}

export const TrainingStatsPanel: React.FC<TrainingStatsPanelProps> = ({
  player,
  score,
  combo,
  isTraining,
  width = 300,
  height = 120,
  isMobile = false,
}) => {
  const backgroundDrawer = useMemo(
    () => createBackgroundDrawer(width, height, isTraining),
    [width, height, isTraining]
  );

  const kiBarDrawer = useMemo(
    () => createResourceBarDrawer(player.ki, player.maxKi, KOREAN_COLORS.PRIMARY_CYAN),
    [player.ki, player.maxKi]
  );

  const staminaBarDrawer = useMemo(
    () => createResourceBarDrawer(player.stamina, player.maxStamina, KOREAN_COLORS.SECONDARY_YELLOW),
    [player.stamina, player.maxStamina]
  );

  return (
    <pixiContainer data-testid="training-stats-panel">
      {/* Enhanced Background */}
      <pixiGraphics draw={backgroundDrawer} />

      {/* Header */}
      <pixiContainer x={10} y={10}>
        <pixiText
          text="훈련 통계"
          style={{
            fontSize: isMobile ? 12 : 16,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
          }}
        />
        <pixiText
          text="Training Statistics"
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
          }}
          y={isMobile ? 15 : 18}
        />

        {/* Training Status */}
        <pixiText
          text={isTraining ? "훈련 중..." : "대기 중"}
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: isTraining
              ? KOREAN_COLORS.ACCENT_GREEN
              : KOREAN_COLORS.TEXT_SECONDARY,
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
          }}
          x={width - 20}
          y={0}
          anchor={{ x: 1, y: 0 }}
        />
      </pixiContainer>

      {/* Player Info */}
      <pixiContainer x={10} y={isMobile ? 35 : 40}>
        <pixiText
          text={`수련생: ${player.name?.korean || player.archetype}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "bold",
          }}
        />
      </pixiContainer>

      {/* Player Resource Bars */}
      <pixiContainer x={width - 90} y={isMobile ? 35 : 40}>
        <pixiContainer>
          <pixiText
            text="기력"
            style={{
              fontSize: isMobile ? 8 : 9,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: FONT_FAMILY.KOREAN,
            }}
          />
          <pixiGraphics draw={kiBarDrawer} />
        </pixiContainer>

        <pixiContainer y={20}>
          <pixiText
            text="체력"
            style={{
              fontSize: isMobile ? 8 : 9,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: FONT_FAMILY.KOREAN,
            }}
          />
          <pixiGraphics draw={staminaBarDrawer} />
        </pixiContainer>
      </pixiContainer>

      {/* Score and Combo Display */}
      <pixiContainer x={10} y={height - 35}>
        <pixiContainer>
          <pixiText
            text={`점수: ${score}`}
            style={{
              fontSize: isMobile ? 11 : 14,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
            }}
          />
        </pixiContainer>

        <pixiContainer x={width / 2}>
          <pixiText
            text={`연타: ${combo}`}
            style={{
              fontSize: isMobile ? 11 : 14,
              fill: combo > 1 ? KOREAN_COLORS.ACCENT_RED : KOREAN_COLORS.TEXT_SECONDARY,
              fontWeight: combo > 1 ? "bold" : "normal",
              fontFamily: FONT_FAMILY.KOREAN,
            }}
          />
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
};

export default TrainingStatsPanel;