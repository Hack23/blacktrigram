import React, { useCallback, useMemo } from "react";
import { KOREAN_VITAL_POINTS } from "../../../systems/vitalpoint/KoreanVitalPoints";
import { VitalPoint } from "../../../systems/vitalpoint/types";
import { VitalPointSeverity } from "../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
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
  // Use first 8 vital points for training panel
  const availableVitalPoints = useMemo(() => {
    return KOREAN_VITAL_POINTS.slice(0, isMobile ? 4 : 8);
  }, [isMobile]);

  const getSeverityColor = useCallback(
    (severity: VitalPointSeverity): number => {
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
    },
    []
  );

  const getDifficultyStars = useCallback((difficulty: number): string => {
    const stars = Math.ceil(difficulty * 5);
    return "★".repeat(Math.min(stars, 5)) + "☆".repeat(5 - Math.min(stars, 5));
  }, []);

  const selectedPoint = useMemo(() => {
    return availableVitalPoints.find(
      (point) => point.id === selectedVitalPoint
    );
  }, [availableVitalPoints, selectedVitalPoint]);

  // Enhanced background drawer with proper animation
  const drawPanelBackground = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
      g.roundRect(0, 0, width, height, 12);
      g.fill();

      g.stroke({
        width: 2,
        color: KOREAN_COLORS.SECONDARY_MAGENTA,
        alpha: 0.8,
      });
      g.roundRect(0, 0, width, height, 12);
      g.stroke();

      // Inner accent
      g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.4 });
      g.roundRect(2, 2, width - 4, height - 4, 10);
      g.stroke();

      // Corner decorations
      [10, width - 10].forEach((x) => {
        [10, height - 10].forEach((y) => {
          g.stroke({
            width: 2,
            color: KOREAN_COLORS.PRIMARY_CYAN,
            alpha: 0.6,
          });
          g.moveTo(x - 5, y);
          g.lineTo(x + 5, y);
          g.moveTo(x, y - 5);
          g.lineTo(x, y + 5);
          g.stroke();
        });
      });
    },
    [width, height]
  );

  // Enhanced selection background drawer with proper pulse animation
  const createSelectionBackgroundDrawer = useCallback(
    (isSelected: boolean, itemWidth: number, itemHeight: number) => {
      return (g: PIXI.Graphics) => {
        g.clear();
        if (isSelected) {
          // Gradient selection effect
          g.fill({
            color: KOREAN_COLORS.SECONDARY_MAGENTA,
            alpha: 0.4,
          });
          g.roundRect(0, 0, itemWidth, itemHeight - 2, 6);
          g.fill();

          // Animated border with proper pulse calculation
          const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.3;
          g.stroke({
            width: 2 * pulse, // Apply pulse to stroke width
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.8,
          });
          g.roundRect(-2, -2, itemWidth + 4, itemHeight + 2, 8);
          g.stroke();
        }
      };
    },
    []
  );

  // Enhanced severity indicator drawer
  const createSeverityIndicatorDrawer = useCallback(
    (point: VitalPoint, itemHeight: number) => {
      return (g: PIXI.Graphics) => {
        g.clear();
        const severityColor = getSeverityColor(point.severity);

        // Outer ring
        g.stroke({ width: 2, color: severityColor, alpha: 0.6 });
        g.circle(12, itemHeight / 2, 8);
        g.stroke();

        // Inner fill
        g.fill({ color: severityColor, alpha: 0.8 });
        g.circle(12, itemHeight / 2, 5);
        g.fill();
      };
    },
    [getSeverityColor]
  );

  // Enhanced selected point details drawer
  const drawSelectedPointDetails = useCallback(
    (g: PIXI.Graphics) => {
      if (!selectedPoint) return;

      g.clear();
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });
      g.roundRect(0, 0, width - 30, 80, 8);
      g.fill();

      g.stroke({
        width: 1,
        color: KOREAN_COLORS.ACCENT_GOLD,
        alpha: 0.8,
      });
      g.roundRect(0, 0, width - 30, 80, 8);
      g.stroke();

      // Inner highlight
      g.stroke({
        width: 1,
        color: KOREAN_COLORS.PRIMARY_CYAN,
        alpha: 0.4,
      });
      g.roundRect(2, 2, width - 34, 76, 6);
      g.stroke();
    },
    [selectedPoint, width]
  );

  return (
    <pixiContainer data-testid="vital-point-training-panel">
      {/* Enhanced Panel Background */}
      <pixiGraphics draw={drawPanelBackground} />

      {/* Header with icon */}
      <pixiContainer x={15} y={15}>
        <pixiText
          text="🎯"
          style={{
            fontSize: isMobile ? 16 : 20,
          }}
        />

        <pixiText
          text="급소 훈련"
          style={{
            fontSize: isMobile ? 14 : 16,
            fill: KOREAN_COLORS.SECONDARY_MAGENTA,
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
          }}
          x={25}
        />

        <pixiText
          text="Vital Point Training"
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
          }}
          x={25}
          y={isMobile ? 16 : 18}
        />
      </pixiContainer>

      {/* Vital Points List with enhanced styling */}
      <pixiContainer x={15} y={isMobile ? 45 : 55}>
        {availableVitalPoints.map((point: VitalPoint, index: number) => {
          const isSelected = selectedVitalPoint === point.id;
          const itemHeight = isMobile ? 25 : 30;
          const itemY = index * itemHeight;
          const itemWidth = width - 30;

          return (
            <pixiContainer
              key={point.id}
              y={itemY}
              interactive={true}
              onPointerDown={() => onVitalPointSelect(point.id)}
              data-testid={`vital-point-${point.id}`}
            >
              {/* Enhanced selection background */}
              <pixiGraphics
                draw={createSelectionBackgroundDrawer(
                  isSelected,
                  itemWidth,
                  itemHeight
                )}
              />

              {/* Severity indicator with enhanced design */}
              <pixiGraphics
                draw={createSeverityIndicatorDrawer(point, itemHeight)}
              />

              {/* Korean name with enhanced typography */}
              <pixiText
                text={point.names.korean}
                style={{
                  fontSize: isMobile ? 11 : 13,
                  fill: isSelected
                    ? KOREAN_COLORS.ACCENT_GOLD
                    : KOREAN_COLORS.TEXT_PRIMARY,
                  fontWeight: isSelected ? "bold" : "normal",
                  fontFamily: FONT_FAMILY.KOREAN,
                }}
                x={30}
                y={itemHeight / 2 - 8}
              />

              {/* English name */}
              <pixiText
                text={point.names.english}
                style={{
                  fontSize: isMobile ? 8 : 10,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  fontStyle: "italic",
                }}
                x={30}
                y={itemHeight / 2 + 6}
              />

              {/* Difficulty indicator */}
              <pixiText
                text={getDifficultyStars(point.targetingDifficulty)}
                style={{
                  fontSize: isMobile ? 8 : 10,
                  fill: KOREAN_COLORS.ACCENT_GOLD,
                }}
                x={width - 70}
                y={itemHeight / 2}
                anchor={0.5}
              />

              {/* Category abbreviation */}
              <pixiText
                text={point.category.substring(0, 3).toUpperCase()}
                style={{
                  fontSize: isMobile ? 7 : 8,
                  fill: KOREAN_COLORS.TEXT_TERTIARY,
                  fontWeight: "bold",
                }}
                x={width - 35}
                y={itemHeight / 2}
                anchor={0.5}
              />
            </pixiContainer>
          );
        })}
      </pixiContainer>

      {/* Enhanced Selected Point Details */}
      {selectedPoint && (
        <pixiContainer x={15} y={height - 100}>
          <pixiGraphics draw={drawSelectedPointDetails} />

          <pixiText
            text="📍 선택된 급소:"
            style={{
              fontSize: isMobile ? 9 : 11,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: FONT_FAMILY.KOREAN,
            }}
            x={10}
            y={8}
          />

          <pixiText
            text={`${selectedPoint.names.korean} (${selectedPoint.names.english})`}
            style={{
              fontSize: isMobile ? 11 : 13,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
            }}
            x={10}
            y={25}
          />

          <pixiText
            text={`범주: ${selectedPoint.category} | 심각도: ${selectedPoint.severity}`}
            style={{
              fontSize: isMobile ? 8 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: FONT_FAMILY.KOREAN,
            }}
            x={10}
            y={45}
          />

          <pixiText
            text={`난이도: ${Math.round(
              selectedPoint.targetingDifficulty * 100
            )}% | 기본 피해: ${selectedPoint.baseDamage || 0}`}
            style={{
              fontSize: isMobile ? 8 : 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: FONT_FAMILY.KOREAN,
            }}
            x={10}
            y={62}
          />
        </pixiContainer>
      )}

      {/* Instructions when no point selected */}
      {!selectedPoint && (
        <pixiContainer x={width / 2} y={height - 50}>
          <pixiText
            text="급소를 선택하여 표적 훈련을 시작하세요"
            style={{
              fontSize: isMobile ? 9 : 11,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              fontFamily: FONT_FAMILY.KOREAN,
              align: "center",
            }}
            anchor={0.5}
          />
          <pixiText
            text="Select a vital point to begin targeting practice"
            style={{
              fontSize: isMobile ? 8 : 9,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              fontStyle: "italic",
              align: "center",
            }}
            anchor={0.5}
            y={15}
          />
        </pixiContainer>
      )}

      {/* Enhanced Legend */}
      <pixiContainer x={15} y={height - 25}>
        <pixiText
          text="범례: ● 심각도 색상 | ★ 난이도 (1-5) | 카테고리 약자"
          style={{
            fontSize: isMobile ? 7 : 9,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
            fontFamily: FONT_FAMILY.KOREAN,
          }}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default VitalPointTrainingPanel;
