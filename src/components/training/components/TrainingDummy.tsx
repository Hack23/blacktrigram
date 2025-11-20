import "@pixi/layout";
import { extend } from "@pixi/react";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { KOREAN_VITAL_POINTS } from "../../../systems/vitalpoint/KoreanVitalPoints";
import { VitalPoint } from "../../../systems/vitalpoint/types";
import { Position, VitalPointSeverity } from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";

// Extend PixiJS components
extend({ Container, Graphics, Sprite, Text });

export interface TrainingDummyProps {
  readonly x: number;
  readonly y: number;
  readonly playerPosition: Position;
  readonly trainingMode: "basics" | "advanced" | "free";
  readonly onHit: (distance: number) => boolean;
  readonly isTraining: boolean;
  readonly selectedVitalPoint?: string | null;
  readonly scale?: number;
}

export const TrainingDummy: React.FC<TrainingDummyProps> = ({
  x,
  y,
  playerPosition,
  trainingMode,
  onHit,
  isTraining,
  selectedVitalPoint,
  scale = 1.0,
}) => {
  const [isHit, setIsHit] = useState(false);
  const [hitAnimation, setHitAnimation] = useState(0);
  const [hoveredVitalPoint, setHoveredVitalPoint] = useState<string | null>(null);
  const [recentHits, setRecentHits] = useState<Array<{ id: string; timestamp: number }>>([]);
  
  // Animation state for smooth glow effects
  const [animationTime, setAnimationTime] = useState(0);

  // Controlled animation loop
  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      setAnimationTime(elapsed);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Use existing Korean vital points data instead of inline definition
  const visibleVitalPoints = useMemo(() => {
    const points = KOREAN_VITAL_POINTS.slice(0, 8); // Use first 8 points for training
    
    switch (trainingMode) {
      case "basics":
        return points.filter(vp => 
          vp.severity !== VitalPointSeverity.CRITICAL && 
          vp.severity !== VitalPointSeverity.LETHAL
        );
      case "advanced":
        return points;
      case "free":
        return points.filter(vp => 
          vp.severity === VitalPointSeverity.MAJOR || 
          vp.severity === VitalPointSeverity.CRITICAL
        );
      default:
        return [];
    }
  }, [trainingMode]);

  // Calculate distance to player
  const distanceToPlayer = useMemo(() => {
    return Math.sqrt(
      Math.pow(playerPosition.x - x, 2) + Math.pow(playerPosition.y - y, 2)
    );
  }, [playerPosition, x, y]);

  // Handle dummy hit
  const handleDummyHit = useCallback(() => {
    if (!isTraining) return;

    const hit = onHit(distanceToPlayer);
    if (hit) {
      setIsHit(true);
      setHitAnimation(1);

      setRecentHits(prev => [
        { id: `hit_${Date.now()}`, timestamp: Date.now() },
        ...prev.slice(0, 4),
      ]);

      setTimeout(() => {
        setIsHit(false);
        setHitAnimation(0);
      }, 500);
    }
  }, [isTraining, onHit, distanceToPlayer]);

  // Handle vital point click
  const handleVitalPointClick = useCallback(
    (vitalPointId: string) => {
      if (!isTraining || trainingMode !== "advanced") return;

      const vitalPoint = visibleVitalPoints.find(vp => vp.id === vitalPointId);
      if (vitalPoint) {
        onHit(0); // Perfect hit for direct vital point clicks

        setRecentHits(prev => [
          { id: vitalPointId, timestamp: Date.now() },
          ...prev.slice(0, 4),
        ]);
      }
    },
    [isTraining, trainingMode, visibleVitalPoints, onHit]
  );

  // Get vital point color based on severity and state
  const getVitalPointColor = useCallback((vitalPoint: VitalPoint): number => {
    if (selectedVitalPoint === vitalPoint.id) {
      return KOREAN_COLORS.ACCENT_GOLD;
    }
    if (hoveredVitalPoint === vitalPoint.id) {
      return KOREAN_COLORS.PRIMARY_CYAN;
    }
    if (recentHits.some(hit => hit.id === vitalPoint.id && Date.now() - hit.timestamp < 2000)) {
      return KOREAN_COLORS.ACCENT_GREEN;
    }

    switch (vitalPoint.severity) {
      case VitalPointSeverity.LETHAL:
        return KOREAN_COLORS.ACCENT_RED;
      case VitalPointSeverity.CRITICAL:
        return KOREAN_COLORS.SECONDARY_MAGENTA;
      case VitalPointSeverity.MAJOR:
        return KOREAN_COLORS.ACCENT_GOLD;
      case VitalPointSeverity.MODERATE:
        return KOREAN_COLORS.SECONDARY_YELLOW;
      case VitalPointSeverity.MINOR:
        return KOREAN_COLORS.ACCENT_CYAN;
      default:
        return KOREAN_COLORS.TEXT_SECONDARY;
    }
  }, [selectedVitalPoint, hoveredVitalPoint, recentHits]);

  // Enhanced dummy body drawing with better feedback
  const drawDummyBody = useCallback((g: PIXI.Graphics) => {
    g.clear();

    const bodyColor = isHit ? KOREAN_COLORS.ACCENT_RED : KOREAN_COLORS.UI_BACKGROUND_MEDIUM;
    const bodyAlpha = 0.85 + hitAnimation * 0.15;
    const glowIntensity = hitAnimation * 0.5;

    // Outer glow when hit
    if (isHit && glowIntensity > 0) {
      g.fill({ color: KOREAN_COLORS.ACCENT_YELLOW, alpha: glowIntensity * 0.3 });
      g.circle(0, 0, 80 + hitAnimation * 20);
      g.fill();
    }

    // Enhanced body with Korean proportions
    g.fill({ color: bodyColor, alpha: bodyAlpha });

    // Head with enhanced details
    g.circle(0, -70, 25);
    g.fill();

    // Neck
    g.roundRect(-8, -50, 16, 20, 4);
    g.fill();

    // Torso with better shaping
    g.roundRect(-25, -30, 50, 80, 8);
    g.fill();

    // Arms with better proportions
    g.roundRect(-40, -20, 10, 40, 5); // Left arm
    g.roundRect(30, -20, 10, 40, 5);  // Right arm
    g.fill();

    // Legs with better shaping
    g.roundRect(-15, 45, 12, 50, 6); // Left leg
    g.roundRect(3, 45, 12, 50, 6);   // Right leg
    g.fill();

    // Enhanced outline with training state glow
    const outlineColor = isTraining ? KOREAN_COLORS.PRIMARY_CYAN : KOREAN_COLORS.TEXT_SECONDARY;
    const outlineAlpha = isTraining ? 0.9 : 0.7;
    const outlineWidth = isHit ? 3 : 2;
    
    g.stroke({ width: outlineWidth, color: outlineColor, alpha: outlineAlpha });
    
    // Outline each body part
    g.circle(0, -70, 25);      // Head
    g.roundRect(-8, -50, 16, 20, 4);    // Neck
    g.roundRect(-25, -30, 50, 80, 8);   // Torso
    g.roundRect(-40, -20, 10, 40, 5);   // Left arm
    g.roundRect(30, -20, 10, 40, 5);    // Right arm
    g.roundRect(-15, 45, 12, 50, 6);    // Left leg
    g.roundRect(3, 45, 12, 50, 6);      // Right leg
    g.stroke();

    // Inner highlights for depth
    if (!isHit) {
      g.fill({ color: KOREAN_COLORS.TEXT_BRIGHT, alpha: 0.1 });
      g.circle(0, -70, 22);      // Head highlight
      g.roundRect(-23, -28, 46, 10, 6);   // Torso highlight
      g.fill();
    }

    // Enhanced training glow effect with multiple rings using controlled animation
    if (isTraining) {
      const baseTime = animationTime * 3;
      
      // Outer ring
      g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.3 + Math.sin(baseTime) * 0.1 });
      g.circle(0, 0, 75 + Math.sin(baseTime) * 5);
      g.stroke();
      
      // Middle ring
      g.stroke({ width: 1, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.25 + Math.sin(baseTime + 1) * 0.1 });
      g.circle(0, 0, 70 + Math.sin(baseTime + 1) * 5);
      g.stroke();
      
      // Inner ring
      g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GREEN, alpha: 0.2 + Math.sin(baseTime + 2) * 0.1 });
      g.circle(0, 0, 65 + Math.sin(baseTime + 2) * 5);
      g.stroke();
    }
  }, [isHit, hitAnimation, isTraining, animationTime]);

  // Cleanup old hits
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setRecentHits(prev => prev.filter(hit => now - hit.timestamp < 5000));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <pixiContainer x={x} y={y} scale={scale} data-testid="training-dummy">
      {/* Main dummy body */}
      <pixiGraphics
        draw={drawDummyBody}
        interactive={isTraining}
        onPointerDown={handleDummyHit}
        cursor={isTraining ? "pointer" : "default"}
        data-testid="dummy-body"
      />

      {/* Vital points overlay for advanced mode */}
      {trainingMode === "advanced" && (
        <pixiContainer data-testid="vital-points-overlay">
          {visibleVitalPoints.map((vitalPoint) => (
            <pixiContainer
              key={vitalPoint.id}
              x={vitalPoint.position.x}
              y={vitalPoint.position.y}
              data-testid={`vital-point-${vitalPoint.id}`}
            >
              {/* Vital point marker */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  const color = getVitalPointColor(vitalPoint);
                  const isActive = selectedVitalPoint === vitalPoint.id || hoveredVitalPoint === vitalPoint.id;
                  const radius = (vitalPoint.radius || 8) * (isActive ? 1.3 : 1.0);

                  // Glow effect
                  g.fill({ color, alpha: 0.3 });
                  g.circle(0, 0, radius * 1.5);
                  g.fill();

                  // Main point
                  g.fill({ color, alpha: 0.8 });
                  g.circle(0, 0, radius);
                  g.fill();

                  // Center dot
                  g.fill({ color: KOREAN_COLORS.TEXT_BRIGHT, alpha: 0.9 });
                  g.circle(0, 0, Math.max(2, radius * 0.2));
                  g.fill();

                  // Border
                  g.stroke({ width: 1, color: KOREAN_COLORS.TEXT_PRIMARY, alpha: 0.7 });
                  g.circle(0, 0, radius);
                  g.stroke();
                }}
                interactive={isTraining}
                onPointerDown={() => handleVitalPointClick(vitalPoint.id)}
                onPointerOver={() => setHoveredVitalPoint(vitalPoint.id)}
                onPointerOut={() => setHoveredVitalPoint(null)}
                cursor={isTraining ? "crosshair" : "default"}
              />

              {/* Vital point label when hovered */}
              {(hoveredVitalPoint === vitalPoint.id || selectedVitalPoint === vitalPoint.id) && (
                <pixiContainer y={-35}>
                  <pixiGraphics
                    draw={(g) => {
                      g.clear();
                      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
                      g.roundRect(-40, -15, 80, 30, 6);
                      g.fill();

                      g.stroke({ width: 1, color: getVitalPointColor(vitalPoint), alpha: 0.8 });
                      g.roundRect(-40, -15, 80, 30, 6);
                      g.stroke();
                    }}
                  />

                  <pixiText
                    text={vitalPoint.names.korean}
                    style={{
                      fontSize: 10,
                      fill: KOREAN_COLORS.TEXT_PRIMARY,
                      fontWeight: "bold",
                      fontFamily: "Noto Sans KR",
                      align: "center",
                    }}
                    anchor={0.5}
                    y={-5}
                  />

                  <pixiText
                    text={vitalPoint.names.english}
                    style={{
                      fontSize: 8,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontStyle: "italic",
                      align: "center",
                    }}
                    anchor={0.5}
                    y={8}
                  />
                </pixiContainer>
              )}
            </pixiContainer>
          ))}
        </pixiContainer>
      )}

      {/* Dummy label */}
      <pixiContainer y={-120}>
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
            g.roundRect(-40, -10, 80, 20, 6);
            g.fill();

            g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.7 });
            g.roundRect(-40, -10, 80, 20, 6);
            g.stroke();
          }}
        />

        <pixiText
          text="훈련용 인형"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
            align: "center",
          }}
          anchor={0.5}
          y={0}
        />
      </pixiContainer>

      {/* Hit effects */}
      {isHit && (
        <pixiContainer data-testid="hit-effects">
          <pixiGraphics
            draw={(g) => {
              g.clear();
              const alpha = hitAnimation * 0.6;

              g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: alpha * 0.3 });
              g.circle(0, 0, 100 * hitAnimation);
              g.fill();

              g.fill({ color: KOREAN_COLORS.ACCENT_YELLOW, alpha });
              g.circle(0, 0, 60 * hitAnimation);
              g.fill();
            }}
          />

          <pixiText
            text="타격!"
            style={{
              fontSize: 16,
              fill: KOREAN_COLORS.ACCENT_RED,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
              align: "center",
            }}
            anchor={0.5}
            y={-140}
            alpha={hitAnimation}
            scale={1 + hitAnimation * 0.2}
          />
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default TrainingDummy;