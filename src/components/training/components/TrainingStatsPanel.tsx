import { PlayerState } from "@/systems";
import React from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { extendPixiComponents } from "../../../utils/pixiExtensions";

// Ensure PixiJS components are extended
extendPixiComponents();

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
  return (
    <pixiContainer data-testid="training-stats-panel">
      {/* Enhanced Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
          g.roundRect(0, 0, width, height, 8);
          g.fill();

          // Border with training indicator
          const borderColor = isTraining
            ? KOREAN_COLORS.ACCENT_GREEN
            : KOREAN_COLORS.PRIMARY_CYAN;
          g.stroke({ width: 2, color: borderColor, alpha: 0.8 });
          g.roundRect(0, 0, width, height, 8);
          g.stroke();

          // Training status indicator
          if (isTraining) {
            g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: 0.3 });
            g.roundRect(5, 5, width - 10, 20, 4);
            g.fill();
          }
        }}
      />

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
        <pixiText
          text={isTraining ? "Training..." : "Waiting"}
          style={{
            fontSize: isMobile ? 7 : 8,
            fill: isTraining
              ? KOREAN_COLORS.ACCENT_GREEN
              : KOREAN_COLORS.TEXT_TERTIARY,
            fontStyle: "italic",
          }}
          x={width - 20}
          y={12}
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
        <pixiText
          text={`Practitioner: ${player.name?.english || player.archetype}`}
          style={{
            fontSize: isMobile ? 8 : 9,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
          }}
          y={14}
        />
      </pixiContainer>

      {/* Score and Combo Display */}
      <pixiContainer x={10} y={height - 35}>
        {/* Score */}
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
          <pixiText
            text={`Score: ${score}`}
            style={{
              fontSize: isMobile ? 8 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontStyle: "italic",
            }}
            y={16}
          />
        </pixiContainer>

        {/* Combo */}
        <pixiContainer x={width / 2}>
          <pixiText
            text={`연타: ${combo}`}
            style={{
              fontSize: isMobile ? 11 : 14,
              fill:
                combo > 1
                  ? KOREAN_COLORS.ACCENT_RED
                  : KOREAN_COLORS.TEXT_SECONDARY,
              fontWeight: combo > 1 ? "bold" : "normal",
              fontFamily: FONT_FAMILY.KOREAN,
            }}
          />
          <pixiText
            text={`Combo: ${combo}`}
            style={{
              fontSize: isMobile ? 8 : 10,
              fill:
                combo > 1
                  ? KOREAN_COLORS.ACCENT_RED
                  : KOREAN_COLORS.TEXT_TERTIARY,
              fontStyle: "italic",
            }}
            y={16}
          />
        </pixiContainer>

        {/* Combo multiplier indicator */}
        {combo > 1 && (
          <pixiContainer x={width - 60} y={-5}>
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: 0.8 });
                g.roundRect(0, 0, 50, 25, 5);
                g.fill();

                g.stroke({ width: 1, color: KOREAN_COLORS.TEXT_PRIMARY });
                g.roundRect(0, 0, 50, 25, 5);
                g.stroke();
              }}
            />
            <pixiText
              text={`×${Math.floor(combo / 5) + 1}`}
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                fontWeight: "bold",
                align: "center",
              }}
              x={25}
              y={12}
              anchor={0.5}
            />
          </pixiContainer>
        )}
      </pixiContainer>

      {/* Player Resource Bars */}
      <pixiContainer x={width - 90} y={isMobile ? 35 : 40}>
        {/* Ki Bar */}
        <pixiContainer>
          <pixiText
            text="기력"
            style={{
              fontSize: isMobile ? 8 : 9,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: FONT_FAMILY.KOREAN,
            }}
          />
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
              g.rect(0, 10, 70, 6);
              g.fill();

              const kiPercent = player.maxKi > 0 ? player.ki / player.maxKi : 0;
              g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.9 });
              g.rect(0, 10, 70 * kiPercent, 6);
              g.fill();
            }}
          />
        </pixiContainer>

        {/* Stamina Bar */}
        <pixiContainer y={20}>
          <pixiText
            text="체력"
            style={{
              fontSize: isMobile ? 8 : 9,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: FONT_FAMILY.KOREAN,
            }}
          />
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
              g.rect(0, 10, 70, 6);
              g.fill();

              const staminaPercent =
                player.maxStamina > 0 ? player.stamina / player.maxStamina : 0;
              g.fill({ color: KOREAN_COLORS.SECONDARY_YELLOW, alpha: 0.9 });
              g.rect(0, 10, 70 * staminaPercent, 6);
              g.fill();
            }}
          />
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
};

export default TrainingStatsPanel;
