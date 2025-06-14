import React, { useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { KOREAN_COLORS } from "../../../types/constants";
import {
  ResponsivePixiContainer,
  ResponsivePixiPanel,
} from "../../ui/base/ResponsivePixiComponents";
import type { TrainingStatistics } from "../types/training";

extend({ Container, Graphics, Text });

export interface TrainingStatisticsPanelProps {
  readonly stats: TrainingStatistics;
  readonly currentCombo: number;
  readonly selectedStance: string;
  readonly maxAttempts: number;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly isMobile: boolean;
}

const formatSessionTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const TrainingStatisticsPanel: React.FC<
  TrainingStatisticsPanelProps
> = ({
  stats,
  currentCombo,
  selectedStance,
  maxAttempts,
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
  isMobile,
}) => {
  const progressPercent = useMemo(() => {
    return maxAttempts > 0 ? Math.min(stats.attempts / maxAttempts, 1.0) : 0;
  }, [stats.attempts, maxAttempts]);

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid="training-statistics-panel"
    >
      <ResponsivePixiPanel
        title="훈련 통계"
        x={0}
        y={0}
        width={width}
        height={height}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      >
        <ResponsivePixiContainer
          x={10}
          y={30}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          data-testid="statistics-content"
        >
          {/* Attempts Count */}
          <pixiText
            text={`시도: ${stats.attempts}/${maxAttempts}`}
            style={{
              fontSize: isMobile ? 12 : 14,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
            }}
            x={5}
            y={isMobile ? 45 : 50}
            data-testid="attempts-count"
          />

          {/* Progress Bar */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              const progressWidth = Math.max(0, (width - 30) * progressPercent);

              // Background
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
              g.roundRect(5, isMobile ? 65 : 75, width - 20, 12, 6);
              g.fill();

              // Progress
              if (progressWidth > 0) {
                g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: 0.9 });
                g.roundRect(5, isMobile ? 65 : 75, progressWidth, 12, 6);
                g.fill();
              }

              // Border
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.UI_BORDER,
                alpha: 0.6,
              });
              g.roundRect(5, isMobile ? 65 : 75, width - 20, 12, 6);
              g.stroke();
            }}
            data-testid="progress-bar"
          />

          {/* Additional Statistics */}
          <pixiContainer
            x={0}
            y={isMobile ? 90 : 100}
            data-testid="additional-stats"
          >
            <pixiText
              text={`정확도: ${Math.round(stats.accuracy)}%`}
              style={{
                fontSize: isMobile ? 11 : 13,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
              }}
              x={5}
              y={0}
              data-testid="accuracy-display"
            />

            <pixiText
              text={`완벽한 타격: ${stats.perfectStrikes}`}
              style={{
                fontSize: isMobile ? 11 : 13,
                fill: KOREAN_COLORS.ACCENT_GOLD,
              }}
              x={5}
              y={isMobile ? 15 : 18}
              data-testid="perfect-strikes-count"
            />

            <pixiText
              text={`현재 연속: ${currentCombo}회`}
              style={{
                fontSize: isMobile ? 11 : 13,
                fill: KOREAN_COLORS.PRIMARY_CYAN,
              }}
              x={5}
              y={isMobile ? 30 : 36}
              data-testid="current-combo-display"
            />
          </pixiContainer>

          {/* Session Time */}
          <pixiText
            text={formatSessionTime(stats.sessionTime)}
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            x={width - 10}
            y={height - 20}
            anchor={{ x: 1, y: 0 }}
            data-testid="session-time"
          />

          {/* Current Stance Display */}
          <pixiContainer
            x={10}
            y={isMobile ? 145 : 178}
            data-testid="current-stance-display"
          >
            <pixiText
              text={`현재 자세: ${stanceKorean[selectedStance]} (${selectedStance})`}
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.ACCENT_GOLD,
                fontWeight: "bold",
              }}
              x={0}
              y={0}
            />
          </pixiContainer>

          {/* Training Feedback Container */}
          <pixiContainer
            x={10}
            y={isMobile ? 160 : 196}
            data-testid="feedback-container"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_LIGHT,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, width - 20, 35, 4);
                g.fill();

                g.stroke({
                  width: 1,
                  color: KOREAN_COLORS.ACCENT_CYAN,
                  alpha: 0.6,
                });
                g.roundRect(0, 0, width - 20, 35, 4);
                g.stroke();
              }}
            />
            <pixiText
              text={feedbackMessage}
              style={{
                fontSize: isMobile ? 9 : 11,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                wordWrap: true,
                wordWrapWidth: width - 30,
              }}
              x={5}
              y={18}
              anchor={{ x: 0, y: 0.5 }}
              data-testid="feedback-message"
            />
          </pixiContainer>
        </ResponsivePixiContainer>
      </ResponsivePixiPanel>
    </ResponsivePixiContainer>
  );
};

export default TrainingStatisticsPanel;
