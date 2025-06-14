import React, { useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { KOREAN_COLORS } from "../../../types/constants";
import { ResponsivePixiContainer, ResponsivePixiPanel } from "../../ui/base/ResponsivePixiComponents";
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
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const TrainingStatisticsPanel: React.FC<TrainingStatisticsPanelProps> = ({
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
          <pixiContainer x={0} y={isMobile ? 90 : 100} data-testid="additional-stats">
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
            x={0}
            y={isMobile ? 130 : 160}
            data-testid="current-stance-display"
          >
            <pixiText
              text={`현재 자세: ${selectedStance}`}
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.ACCENT_GOLD,
                fontWeight: "bold",
              }}
              x={5}
              y={0}
            />
          </pixiContainer>

          {/* Current Combo Display */}
          <pixiContainer
            x={10}
            y={isMobile ? 120 : 140}
            data-testid="current-combo-container"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                if (currentCombo > 1) {
                  g.fill({
                    color: KOREAN_COLORS.ACCENT_GOLD,
                    alpha: 0.3,
                  });
                  g.roundRect(0, 0, width - 20, 25, 4);
                  g.fill();
                }
              }}
            />
            <pixiText
              text={currentCombo > 1 ? `연속 ${currentCombo}회!` : ""}
              style={{
                fontSize: isMobile ? 12 : 14,
                fill: KOREAN_COLORS.ACCENT_GOLD,
                fontWeight: "bold",
              }}
              x={5}
              y={5}
              data-testid="current-combo-display"
            />
          </pixiContainer>
        </ResponsivePixiContainer>
      </ResponsivePixiPanel>
    </ResponsivePixiContainer>
  );
};

export default TrainingStatisticsPanel;
          }}
          y={isMobile ? 145 : 178}
          data-testid="current-stance-display"
        />

        {/* Enhanced feedback message with better styling */}
        <pixiContainer
          y={isMobile ? 160 : 196}
          data-testid="feedback-container"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.3 });
              g.roundRect(-2, -2, isMobile ? width * 0.4 : 200, 20, 4);
              g.fill();
            }}
          />
          <pixiText
            text={getCurrentFeedback()}
            style={{
              fontSize: isMobile ? 7 : 9,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontStyle: "italic",
              wordWrap: true,
              wordWrapWidth: isMobile ? width * 0.4 : 240,
            }}
            data-testid="feedback-message"
          />
        </pixiContainer>
      </pixiContainer>
    </ResponsivePixiPanel>
  );
};

export default TrainingStatisticsPanel;
        </pixiContainer>
      </pixiContainer>
    </ResponsivePixiPanel>
  );
};

export default TrainingStatisticsPanel;
    </ResponsivePixiPanel>
  );
};

export default TrainingStatisticsPanel;
      {/* Attempts Count */}
      <ResponsivePixiContainer
        x={10}
        y={isMobile ? 45 : 55}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        data-testid="attempts-container"
      >
        <pixiText
          text={`시도: ${stats.attempts}/${maxAttempts}`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
          }}
          data-testid="attempts-count"
        />

        {/* Progress Bar Background */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            // Background
            g.fill({
              color: KOREAN_COLORS.UI_BACKGROUND_DARK,
              alpha: 0.8,
            });
            g.roundRect(0, 25, width - 20, 12, 6);
            g.fill();

            // Progress fill
            const progressPercent = Math.min(stats.attempts / maxAttempts, 1.0);
            const fillWidth = (width - 20) * progressPercent;
            const progressColor =
              progressPercent >= 0.8
                ? KOREAN_COLORS.NEGATIVE_RED
                : progressPercent >= 0.6
                ? KOREAN_COLORS.WARNING_YELLOW
                : KOREAN_COLORS.ACCENT_GREEN;

            g.fill({ color: progressColor, alpha: 0.9 });
            g.roundRect(0, 25, fillWidth, 12, 6);
            g.fill();

            // Border
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.UI_BORDER,
              alpha: 0.6,
            });
            g.roundRect(0, 25, width - 20, 12, 6);
            g.stroke();
          }}
          data-testid="attempts-progress-bar"
        />
      </ResponsivePixiContainer>

      {/* Additional Statistics */}
      <ResponsivePixiContainer
        x={10}
        y={isMobile ? 90 : 110}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        data-testid="additional-stats"
      >
        <pixiText
          text={`정확도: ${Math.round(stats.accuracy)}%`}
          style={{
            fontSize: isMobile ? 11 : 13,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          y={isMobile ? 70 : 88}
          data-testid="accuracy-display"
        />

        <pixiText
          text={`완벽한 타격: ${stats.perfectStrikes}`}
          style={{
            fontSize: isMobile ? 11 : 13,
            fill: KOREAN_COLORS.ACCENT_GOLD,
          }}
          y={isMobile ? 85 : 103}
          data-testid="perfect-strikes-count"
        />

        <pixiText
          text={`현재 연속: ${currentCombo}회`}
          style={{
            fontSize: isMobile ? 11 : 13,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
          }}
          y={isMobile ? 100 : 118}
          data-testid="current-combo-display"
        />

        <pixiText
          text={`세션 시간: ${Math.floor(stats.sessionTime / 60)}:${(
            stats.sessionTime % 60
          )
            .toString()
            .padStart(2, "0")}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
          }}
          y={isMobile ? 115 : 133}
          data-testid="session-time"
        />

        {/* Current Stance Display */}
        <pixiContainer
          y={isMobile ? 130 : 160}
          data-testid="current-stance-container"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
                alpha: 0.3,
              });
              g.roundRect(0, 0, width - 20, 30, 8);
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.8,
              });
              g.roundRect(0, 0, width - 20, 30, 8);
              g.stroke();
            }}
          />
          <pixiText
            text={`현재 자세: ${selectedStance}`}
            style={{
              fontSize: isMobile ? 12 : 14,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              align: "center",
            }}
            x={(width - 20) / 2}
            y={15}
            anchor={0.5}
            data-testid="current-stance-display"
          />
        </pixiContainer>
      </ResponsivePixiContainer>
    </ResponsivePixiPanel>
  );
};

export default TrainingStatisticsPanel;
