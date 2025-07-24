import React from "react";
import { KOREAN_VITAL_POINTS } from "../../../systems/vitalpoint/KoreanVitalPoints";
import { VitalPoint } from "../../../systems/vitalpoint/types";
import { VitalPointSeverity } from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";
import { extendPixiComponents } from "../../../utils/pixiExtensions";

extendPixiComponents();

export interface VitalPointTrainingPanelProps {
  readonly selectedVitalPoint: string | null;
  readonly onVitalPointSelect: (vitalPointId: string) => void;
  readonly width: number;
  readonly height: number;
  readonly isMobile: boolean;
}

export const VitalPointTrainingPanel: React.FC<
  VitalPointTrainingPanelProps
> = ({ selectedVitalPoint, onVitalPointSelect, width, height, isMobile }) => {
  // Use actual Korean vital points data
  const availableVitalPoints = KOREAN_VITAL_POINTS.slice(0, isMobile ? 4 : 6);

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 0.3) return KOREAN_COLORS.POSITIVE_GREEN;
    if (difficulty <= 0.5) return KOREAN_COLORS.ACCENT_CYAN;
    if (difficulty <= 0.7) return KOREAN_COLORS.WARNING_YELLOW;
    if (difficulty <= 0.8) return KOREAN_COLORS.ACCENT_GOLD;
    return KOREAN_COLORS.ACCENT_RED;
  };

  const getSeverityColor = (severity: VitalPointSeverity) => {
    switch (severity) {
      case VitalPointSeverity.MINOR:
        return KOREAN_COLORS.POSITIVE_GREEN;
      case VitalPointSeverity.MODERATE:
        return KOREAN_COLORS.WARNING_YELLOW;
      case VitalPointSeverity.MAJOR:
        return KOREAN_COLORS.ACCENT_GOLD;
      case VitalPointSeverity.CRITICAL:
        return KOREAN_COLORS.ACCENT_RED;
      default:
        return KOREAN_COLORS.TEXT_SECONDARY;
    }
  };

  const getDifficultyStars = (difficulty: number): string => {
    const stars = Math.ceil(difficulty * 5);
    return "★".repeat(Math.min(stars, 5));
  };

  const selectedPoint = availableVitalPoints.find(
    (point) => point.id === selectedVitalPoint
  );

  return (
    <pixiContainer data-testid="vital-point-training-panel">
      {/* Panel Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
          g.roundRect(0, 0, width, height, 8);
          g.fill();

          g.stroke({
            width: 2,
            color: KOREAN_COLORS.SECONDARY_MAGENTA,
            alpha: 0.8,
          });
          g.roundRect(0, 0, width, height, 8);
          g.stroke();
        }}
      />

      {/* Header */}
      <pixiContainer x={10} y={10}>
        <pixiText
          text="급소 훈련"
          style={{
            fontSize: isMobile ? 12 : 16,
            fill: KOREAN_COLORS.SECONDARY_MAGENTA,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
          }}
        />
        <pixiText
          text="Vital Point Training"
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
          }}
          y={isMobile ? 15 : 18}
        />
      </pixiContainer>

      {/* Vital Points List */}
      <pixiContainer x={10} y={isMobile ? 35 : 45}>
        {availableVitalPoints.map((point: VitalPoint, index: number) => {
          const isSelected = selectedVitalPoint === point.id;
          const itemHeight = isMobile ? 20 : 25;

          return (
            <pixiContainer
              key={point.id}
              y={index * itemHeight}
              interactive={true}
              onPointerDown={() => onVitalPointSelect(point.id)}
              data-testid={`vital-point-${point.id}`}
            >
              {/* Selection background */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  if (isSelected) {
                    g.fill({
                      color: KOREAN_COLORS.SECONDARY_MAGENTA,
                      alpha: 0.3,
                    });
                    g.roundRect(0, 0, width - 20, itemHeight - 2, 4);
                    g.fill();
                  }
                }}
              />

              {/* Severity indicator circle */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: getSeverityColor(point.severity),
                    alpha: 0.8,
                  });
                  g.circle(8, itemHeight / 2, 4);
                  g.fill();
                }}
              />

              {/* Korean name */}
              <pixiText
                text={point.names.korean}
                style={{
                  fontSize: isMobile ? 9 : 11,
                  fill: isSelected
                    ? KOREAN_COLORS.SECONDARY_MAGENTA
                    : KOREAN_COLORS.TEXT_PRIMARY,
                  fontWeight: isSelected ? "bold" : "normal",
                  fontFamily: "Noto Sans KR",
                }}
                x={20}
                y={itemHeight / 2 - 6}
              />

              {/* English name */}
              <pixiText
                text={point.names.english}
                style={{
                  fontSize: isMobile ? 7 : 8,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  fontStyle: "italic",
                }}
                x={20}
                y={itemHeight / 2 + 4}
              />

              {/* Difficulty stars */}
              <pixiText
                text={getDifficultyStars(point.targetingDifficulty)}
                style={{
                  fontSize: isMobile ? 8 : 10,
                  fill: getDifficultyColor(point.targetingDifficulty),
                }}
                x={width - 60}
                y={itemHeight / 2}
                anchor={0.5}
              />

              {/* Category abbreviation */}
              <pixiText
                text={point.category.substring(0, 3).toUpperCase()}
                style={{
                  fontSize: isMobile ? 6 : 7,
                  fill: KOREAN_COLORS.TEXT_TERTIARY,
                  fontWeight: "bold",
                }}
                x={width - 90}
                y={itemHeight / 2}
                anchor={0.5}
              />
            </pixiContainer>
          );
        })}
      </pixiContainer>

      {/* Selected Point Details */}
      {selectedPoint && (
        <pixiContainer x={10} y={height - 80}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
              g.roundRect(0, 0, width - 20, 70, 5);
              g.fill();

              g.stroke({
                width: 1,
                color: KOREAN_COLORS.SECONDARY_MAGENTA,
                alpha: 0.6,
              });
              g.roundRect(0, 0, width - 20, 70, 5);
              g.stroke();
            }}
          />

          <pixiText
            text="선택된 급소:"
            style={{
              fontSize: isMobile ? 8 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
            x={5}
            y={5}
          />

          <pixiText
            text={`${selectedPoint.names.korean} (${selectedPoint.names.english})`}
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.SECONDARY_MAGENTA,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
            x={5}
            y={18}
          />

          <pixiText
            text={`범주: ${selectedPoint.category} | 심각도: ${selectedPoint.severity}`}
            style={{
              fontSize: isMobile ? 7 : 9,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
            x={5}
            y={35}
          />

          <pixiText
            text={`난이도: ${Math.round(
              selectedPoint.targetingDifficulty * 100
            )}% | 기본 피해: ${selectedPoint.baseDamage || 0}`}
            style={{
              fontSize: isMobile ? 7 : 9,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
            x={5}
            y={50}
          />
        </pixiContainer>
      )}

      {/* Instructions */}
      {!selectedPoint && (
        <pixiContainer x={width / 2} y={height - 40}>
          <pixiText
            text="급소를 선택하여 표적 훈련을 시작하세요"
            style={{
              fontSize: isMobile ? 8 : 10,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              fontFamily: "Noto Sans KR",
              align: "center",
            }}
            anchor={0.5}
          />
          <pixiText
            text="Select a vital point to begin targeting practice"
            style={{
              fontSize: isMobile ? 7 : 8,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              fontStyle: "italic",
              align: "center",
            }}
            anchor={0.5}
            y={12}
          />
        </pixiContainer>
      )}

      {/* Legend */}
      <pixiContainer x={10} y={height - 20}>
        <pixiText
          text="● 심각도: 미미/보통/주요/치명적 | 난이도: ★☆☆☆☆ ~ ★★★★★"
          style={{
            fontSize: isMobile ? 6 : 8,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
            fontFamily: "Noto Sans KR",
          }}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default VitalPointTrainingPanel;
