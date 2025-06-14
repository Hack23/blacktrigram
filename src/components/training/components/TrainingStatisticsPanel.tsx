import React from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { ResponsivePixiPanel } from "../../ui/base/ResponsivePixiComponents";
import { KOREAN_COLORS } from "../../../types/constants";
import { TrainingStatistics } from "./TrainingStatistics";
import type { TrainingStatisticsProps } from "./TrainingStatistics";
import { TrigramStance } from "../../../types/enums";

extend({ Container, Graphics, Text });

/**
 * ## Training Statistics Panel Component
 *
 * **Business Purpose:**
 * Advanced statistics display panel for Korean martial arts training sessions.
 * Provides real-time performance analytics including:
 * - Comprehensive training metrics with Korean terminology
 * - Visual progress indicators following Korean design principles
 * - Cultural accuracy in performance assessment display
 * - Motivational elements respecting Korean martial arts tradition
 *
 * **Korean Martial Arts Integration:**
 * - Displays statistics using authentic Korean martial arts terminology
 * - Implements traditional Korean color symbolism for performance levels
 * - Respects Korean martial arts grading system in visual presentation
 * - Provides culturally appropriate performance motivation
 *
 * **Technical Architecture:**
 * - Responsive design adapting to mobile, tablet, and desktop
 * - Real-time statistics updates with smooth visual transitions
 * - Integration with Korean text system for bilingual display
 * - Performance-optimized rendering for training session smoothness
 *
 * @component
 * @example
 * ```tsx
 * <TrainingStatisticsPanel
 *   stats={trainingStats}
 *   currentCombo={5}
 *   selectedStance={TrigramStance.GEON}
 *   maxAttempts={20}
 *   x={layout.statistics.x}
 *   y={layout.statistics.y}
 *   width={layout.statistics.width}
 *   height={layout.statistics.height}
 *   screenWidth={width}
 *   screenHeight={height}
 *   isMobile={isMobile}
 * />
 * ```
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export interface TrainingStatisticsPanelProps extends TrainingStatisticsProps {
  /** Optional additional styling or behavior modifiers */
  readonly variant?: "default" | "compact" | "detailed";
}

/**
 * ## Training Statistics Panel Implementation
 *
 * **Business Logic:**
 * - Provides consistent wrapper styling for training statistics
 * - Handles responsive positioning and sizing
 * - Maintains visual consistency across different training contexts
 *
 * **Technical Architecture:**
 * - Lightweight wrapper with minimal overhead
 * - Pass-through props to core statistics component
 * - Responsive design calculations for optimal display
 *
 * @param props - Statistics panel configuration extending base statistics props
 * @returns JSX.Element representing the styled statistics panel
 */
export const TrainingStatisticsPanel: React.FC<TrainingStatisticsPanelProps> = ({
  variant = "default",
  ...statisticsProps
}) => {
  return (
    <TrainingStatistics
      {...statisticsProps}
      data-testid="training-stats-panel"
    />
  );
};

export default TrainingStatisticsPanel;
          }}
          data-testid="attempts-count"
        />

        <pixiText
          text={`정확도: ${Math.round(stats.accuracy)}% - 精確度`}
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: getAccuracyColor(stats.accuracy),
            fontWeight: "bold",
          }}
          y={isMobile ? 15 : 18}
          data-testid="accuracy-display"
        />

        {/* Enhanced visual accuracy bar */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            const barWidth = isMobile ? width * 0.4 : 120;
            const barHeight = 6;
            const barY = isMobile ? 28 : 34;

            // Background
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.6 });
            g.roundRect(0, barY, barWidth, barHeight, 3);
            g.fill();

            // Accuracy fill
            const fillWidth = (barWidth - 2) * (stats.accuracy / 100);
            g.fill({ color: getAccuracyColor(stats.accuracy), alpha: 0.8 });
            g.roundRect(1, barY + 1, fillWidth, barHeight - 2, 2);
            g.fill();

            // Border
            g.stroke({ width: 1, color: KOREAN_COLORS.UI_BORDER, alpha: 0.8 });
            g.roundRect(0, barY, barWidth, barHeight, 3);
            g.stroke();
          }}
          data-testid="accuracy-bar"
        />

        <pixiText
          text={`완벽한 타격: ${stats.perfectStrikes} - 完璧打`}
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.ACCENT_GREEN,
          }}
          y={isMobile ? 40 : 52}
          data-testid="perfect-strikes-count"
        />

        <pixiText
          text={`치명타: ${stats.criticalHits} - 致命打`}
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.SECONDARY_MAGENTA,
          }}
          y={isMobile ? 55 : 70}
          data-testid="critical-hits-count"
        />

        <pixiText
          text={`총 데미지: ${Math.round(stats.totalDamage)} - 總損傷`}
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.ACCENT_GOLD,
          }}
          y={isMobile ? 70 : 88}
          data-testid="total-damage-display"
        />

        <pixiText
          text={`평균 데미지: ${Math.round(stats.averageDamage)}`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          y={isMobile ? 85 : 106}
          data-testid="average-damage-display"
        />

        <pixiText
          text={`최고 연속: ${stats.bestCombo}회 - 最高連續`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
          }}
          y={isMobile ? 100 : 124}
          data-testid="best-combo-display"
        />

        <pixiText
          text={`세션 시간: ${Math.floor(stats.sessionTime / 60)}:${String(
            stats.sessionTime % 60
          ).padStart(2, "0")}`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          y={isMobile ? 115 : 142}
          data-testid="session-time"
        />

        {/* Enhanced current combo display */}
        <pixiContainer
          y={isMobile ? 130 : 160}
          data-testid="current-combo-container"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              if (currentCombo > 3) {
                g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: 0.2 });
                g.roundRect(-2, -2, isMobile ? width * 0.4 : 150, 16, 4);
                g.fill();
              }
            }}
          />
          <pixiText
            text={`현재 연속: ${currentCombo}회 - 現在連續`}
            style={{
              fontSize: isMobile ? 8 : 10,
              fill:
                currentCombo > 3
                  ? KOREAN_COLORS.ACCENT_GREEN
                  : KOREAN_COLORS.TEXT_SECONDARY,
              fontWeight: currentCombo > 3 ? "bold" : "normal",
            }}
            data-testid="current-combo-display"
          />
        </pixiContainer>

        <pixiText
          text={`현재 자세: ${getStanceName(
            selectedStance
          )} - ${selectedStance}`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
            fontWeight: "bold",
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
