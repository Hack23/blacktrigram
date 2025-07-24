import "@pixi/layout";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js"; // ✅ Import FederatedPointerEvent directly
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Position,
  VitalPointCategory,
  VitalPointEffectType,
  VitalPointSeverity,
} from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";
import { extendPixiComponents } from "../../../utils/pixiExtensions";

// Extend PixiJS components
extend({ Container, Graphics, Text });
extendPixiComponents();

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

// Korean anatomy vital points based on traditional medicine
interface VitalPoint {
  id: string;
  name: {
    korean: string;
    english: string;
    romanized: string;
  };
  position: Position;
  category: VitalPointCategory;
  severity: VitalPointSeverity;
  effects: VitalPointEffectType[];
  description: {
    korean: string;
    english: string;
  };
  isVisible: boolean;
  radius: number;
}

// Core vital points for training dummy (subset of full 70 points)
const TRAINING_VITAL_POINTS: VitalPoint[] = [
  // Head region (머리)
  {
    id: "temple",
    name: { korean: "관자놀이", english: "Temple", romanized: "gwanja-nori" },
    position: { x: -25, y: -80 },
    category: VitalPointCategory.NEUROLOGICAL,
    severity: VitalPointSeverity.CRITICAL,
    effects: [VitalPointEffectType.UNCONSCIOUSNESS, VitalPointEffectType.STUN],
    description: {
      korean: "측두부 신경 집중 지점",
      english: "Temporal nerve concentration point",
    },
    isVisible: true,
    radius: 8,
  },
  {
    id: "jawline",
    name: { korean: "턱끝", english: "Jawline", romanized: "teokkeut" },
    position: { x: -15, y: -60 },
    category: VitalPointCategory.SKELETAL,
    severity: VitalPointSeverity.MAJOR,
    effects: [VitalPointEffectType.STUN, VitalPointEffectType.DISORIENTATION],
    description: {
      korean: "하악골 타격점",
      english: "Mandible strike point",
    },
    isVisible: true,
    radius: 6,
  },

  // Neck region (목)
  {
    id: "carotid",
    name: {
      korean: "경동맥",
      english: "Carotid Artery",
      romanized: "gyeongdongmaek",
    },
    position: { x: -20, y: -40 },
    category: VitalPointCategory.VASCULAR,
    severity: VitalPointSeverity.LETHAL,
    effects: [
      VitalPointEffectType.BLOOD_FLOW_RESTRICTION,
      VitalPointEffectType.UNCONSCIOUSNESS,
    ],
    description: {
      korean: "주요 혈관 압박점",
      english: "Major blood vessel pressure point",
    },
    isVisible: true,
    radius: 10,
  },

  // Torso region (몸통)
  {
    id: "solar_plexus",
    name: { korean: "명치", english: "Solar Plexus", romanized: "myeongchi" },
    position: { x: 0, y: 10 },
    category: VitalPointCategory.ORGAN,
    severity: VitalPointSeverity.MAJOR,
    effects: [VitalPointEffectType.BREATHLESSNESS, VitalPointEffectType.PAIN],
    description: {
      korean: "횡격막 신경총 충격점",
      english: "Diaphragm nerve cluster impact point",
    },
    isVisible: true,
    radius: 12,
  },
  {
    id: "heart_point",
    name: {
      korean: "심장점",
      english: "Heart Point",
      romanized: "simjang-jeom",
    },
    position: { x: -15, y: 0 },
    category: VitalPointCategory.ORGAN,
    severity: VitalPointSeverity.CRITICAL,
    effects: [VitalPointEffectType.ORGAN_DISRUPTION, VitalPointEffectType.PAIN],
    description: {
      korean: "심장 충격 반응점",
      english: "Cardiac impact response point",
    },
    isVisible: true,
    radius: 8,
  },
  {
    id: "floating_ribs",
    name: { korean: "늑골", english: "Floating Ribs", romanized: "neukgol" },
    position: { x: -25, y: 20 },
    category: VitalPointCategory.SKELETAL,
    severity: VitalPointSeverity.MAJOR,
    effects: [VitalPointEffectType.PAIN, VitalPointEffectType.BREATHLESSNESS],
    description: {
      korean: "부유늑골 타격점",
      english: "Floating rib strike point",
    },
    isVisible: true,
    radius: 10,
  },

  // Arm vital points (팔)
  {
    id: "brachial_plexus",
    name: {
      korean: "상완신경총",
      english: "Brachial Plexus",
      romanized: "sangwan-singyeong-chong",
    },
    position: { x: -40, y: -10 },
    category: VitalPointCategory.NERVE,
    severity: VitalPointSeverity.MAJOR,
    effects: [
      VitalPointEffectType.NERVE_DISRUPTION,
      VitalPointEffectType.PARALYSIS,
    ],
    description: {
      korean: "팔 신경 집중부",
      english: "Arm nerve concentration area",
    },
    isVisible: true,
    radius: 8,
  },

  // Leg vital points (다리)
  {
    id: "femoral_nerve",
    name: {
      korean: "대퇴신경",
      english: "Femoral Nerve",
      romanized: "daetoeshin-gyeong",
    },
    position: { x: -10, y: 60 },
    category: VitalPointCategory.NERVE,
    severity: VitalPointSeverity.MAJOR,
    effects: [VitalPointEffectType.PARALYSIS, VitalPointEffectType.WEAKNESS],
    description: {
      korean: "대퇴부 신경점",
      english: "Femoral nerve point",
    },
    isVisible: true,
    radius: 8,
  },
];

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
  const [hoveredVitalPoint, setHoveredVitalPoint] = useState<string | null>(
    null
  );
  const [recentHits, setRecentHits] = useState<
    Array<{ id: string; timestamp: number }>
  >([]);

  // Calculate distance to player
  const distanceToPlayer = useMemo(() => {
    return Math.sqrt(
      Math.pow(playerPosition.x - x, 2) + Math.pow(playerPosition.y - y, 2)
    );
  }, [playerPosition, x, y]);

  // Filter vital points based on training mode
  const visibleVitalPoints = useMemo(() => {
    switch (trainingMode) {
      case "basics":
        return TRAINING_VITAL_POINTS.filter(
          (vp) =>
            vp.severity !== VitalPointSeverity.LETHAL &&
            vp.category !== VitalPointCategory.ORGAN
        );
      case "advanced":
        return TRAINING_VITAL_POINTS;
      case "free":
        return TRAINING_VITAL_POINTS.filter(
          (vp) =>
            vp.severity === VitalPointSeverity.MAJOR ||
            vp.severity === VitalPointSeverity.CRITICAL
        );
      default:
        return [];
    }
  }, [trainingMode]);

  // Handle dummy hit
  const handleDummyHit = useCallback(() => {
    if (!isTraining) return;

    const hit = onHit(distanceToPlayer);
    if (hit) {
      setIsHit(true);
      setHitAnimation(1);

      // Add hit to recent hits
      setRecentHits((prev) => [
        { id: `hit_${Date.now()}`, timestamp: Date.now() },
        ...prev.slice(0, 4),
      ]);

      // Reset hit animation
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

      const vitalPoint = visibleVitalPoints.find(
        (vp) => vp.id === vitalPointId
      );
      if (vitalPoint) {
        // Perfect hit for direct vital point clicks (zero distance)
        onHit(0);

        setRecentHits((prev) => [
          { id: vitalPointId, timestamp: Date.now() },
          ...prev.slice(0, 4),
        ]);
      }
    },
    [isTraining, trainingMode, visibleVitalPoints, onHit]
  );

  // Get vital point color based on severity and state
  const getVitalPointColor = useCallback(
    (vitalPoint: VitalPoint): number => {
      if (selectedVitalPoint === vitalPoint.id) {
        return KOREAN_COLORS.ACCENT_GOLD;
      }
      if (hoveredVitalPoint === vitalPoint.id) {
        return KOREAN_COLORS.PRIMARY_CYAN;
      }
      if (
        recentHits.some(
          (hit) => hit.id === vitalPoint.id && Date.now() - hit.timestamp < 2000
        )
      ) {
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
    },
    [selectedVitalPoint, hoveredVitalPoint, recentHits]
  );

  // Draw dummy body
  const drawDummyBody = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Body color with hit animation
      const bodyColor = isHit
        ? KOREAN_COLORS.ACCENT_RED
        : KOREAN_COLORS.UI_BACKGROUND_MEDIUM;
      const bodyAlpha = 0.8 + hitAnimation * 0.2;

      // Enhanced body proportions based on Korean anatomy
      g.fill({ color: bodyColor, alpha: bodyAlpha });

      // Head (머리) - proportional to Korean standards
      g.circle(0, -70, 28);
      g.fill();

      // Neck (목) - slightly narrower
      g.roundRect(-8, -50, 16, 22, 4);
      g.fill();

      // Torso (몸통) - Korean body proportions
      g.roundRect(-28, -28, 56, 85, 8);
      g.fill();

      // Shoulders (어깨)
      g.circle(-40, -15, 18); // Left shoulder
      g.circle(40, -15, 18); // Right shoulder
      g.fill();

      // Arms (팔) - more realistic proportions
      g.roundRect(-48, -15, 12, 45, 6); // Left arm
      g.roundRect(36, -15, 12, 45, 6); // Right arm
      g.fill();

      // Hands (손)
      g.circle(-42, 35, 8); // Left hand
      g.circle(42, 35, 8); // Right hand
      g.fill();

      // Legs (다리) - Korean proportional spacing
      g.roundRect(-18, 52, 14, 55, 7); // Left leg
      g.roundRect(4, 52, 14, 55, 7); // Right leg
      g.fill();

      // Feet (발)
      g.ellipse(-11, 110, 12, 6); // Left foot
      g.ellipse(11, 110, 12, 6); // Right foot
      g.fill();

      // Training dummy stand (받침대)
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.6 });
      g.roundRect(-45, 115, 90, 12, 6);
      g.fill();
      g.roundRect(-6, 127, 12, 25, 4); // Base pole
      g.fill();

      // Enhanced outline with training state indication
      const outlineColor = isTraining
        ? KOREAN_COLORS.PRIMARY_CYAN
        : KOREAN_COLORS.TEXT_SECONDARY;
      const outlineAlpha = isTraining ? 0.9 : 0.6;
      const outlineWidth = isTraining ? 2.5 : 2;

      g.stroke({
        width: outlineWidth,
        color: outlineColor,
        alpha: outlineAlpha,
      });

      // Head outline
      g.circle(0, -70, 28);
      g.stroke();

      // Body outlines
      g.roundRect(-8, -50, 16, 22, 4); // Neck
      g.roundRect(-28, -28, 56, 85, 8); // Torso
      g.circle(-40, -15, 18); // Left shoulder
      g.circle(40, -15, 18); // Right shoulder
      g.roundRect(-48, -15, 12, 45, 6); // Left arm
      g.roundRect(36, -15, 12, 45, 6); // Right arm
      g.circle(-42, 35, 8); // Left hand
      g.circle(42, 35, 8); // Right hand
      g.roundRect(-18, 52, 14, 55, 7); // Left leg
      g.roundRect(4, 52, 14, 55, 7); // Right leg
      g.ellipse(-11, 110, 12, 6); // Left foot
      g.ellipse(11, 110, 12, 6); // Right foot
      g.stroke();

      // Training mode indicator glow
      if (isTraining) {
        g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.4 });
        g.circle(0, 0, 80 + Math.sin(Date.now() * 0.003) * 5); // Pulsing outer glow
        g.stroke();
      }
    },
    [isHit, hitAnimation, isTraining]
  );

  // Cleanup old hits
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setRecentHits((prev) => prev.filter((hit) => now - hit.timestamp < 5000));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <pixiContainer x={x} y={y} scale={scale} data-testid="training-dummy">
      {/* ✅ FIXED: Main dummy body with proper event handling */}
      <pixiGraphics
        draw={drawDummyBody}
        interactive={isTraining}
        onPointerDown={handleDummyHit} // ✅ No event parameter needed
        cursor={isTraining ? "pointer" : "default"}
        data-testid="dummy-body"
      />

      {/* ✅ ENHANCED: Vital points overlay with better interaction */}
      {trainingMode === "advanced" && (
        <pixiContainer data-testid="vital-points-overlay">
          {visibleVitalPoints.map((vitalPoint) => (
            <pixiContainer
              key={vitalPoint.id}
              x={vitalPoint.position.x}
              y={vitalPoint.position.y}
              data-testid={`vital-point-${vitalPoint.id}`}
            >
              {/* ✅ ENHANCED: Vital point marker with proper event handling */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  const color = getVitalPointColor(vitalPoint);
                  const isActive =
                    selectedVitalPoint === vitalPoint.id ||
                    hoveredVitalPoint === vitalPoint.id;
                  const radius = vitalPoint.radius * (isActive ? 1.3 : 1.0);

                  // Recent hit indication
                  const isRecentHit = recentHits.some(
                    (hit) =>
                      hit.id === vitalPoint.id &&
                      Date.now() - hit.timestamp < 2000
                  );

                  // Pulse animation for selected/recent hit points
                  const pulseScale =
                    selectedVitalPoint === vitalPoint.id || isRecentHit
                      ? 1 + Math.sin(Date.now() * 0.008) * 0.15
                      : 1;

                  // Outer glow - larger for important points
                  const glowRadius = radius * pulseScale * 1.8;
                  const glowAlpha =
                    vitalPoint.severity === VitalPointSeverity.LETHAL
                      ? 0.4
                      : 0.25;
                  g.fill({ color, alpha: glowAlpha });
                  g.circle(0, 0, glowRadius);
                  g.fill();

                  // Main point body
                  g.fill({ color, alpha: 0.85 });
                  g.circle(0, 0, radius * pulseScale);
                  g.fill();

                  // Center indicator dot
                  g.fill({ color: KOREAN_COLORS.TEXT_BRIGHT, alpha: 0.95 });
                  g.circle(0, 0, Math.max(2, radius * 0.15));
                  g.fill();

                  // Border with severity indication
                  const borderWidth =
                    vitalPoint.severity === VitalPointSeverity.LETHAL ? 2 : 1;
                  g.stroke({
                    width: borderWidth,
                    color: KOREAN_COLORS.TEXT_PRIMARY,
                    alpha: 0.7,
                  });
                  g.circle(0, 0, radius * pulseScale);
                  g.stroke();
                }}
                interactive={isTraining}
                onPointerDown={() => handleVitalPointClick(vitalPoint.id)} // ✅ Fixed - no event param
                onPointerOver={() => setHoveredVitalPoint(vitalPoint.id)}
                onPointerOut={() => setHoveredVitalPoint(null)}
                cursor={isTraining ? "crosshair" : "default"}
              />

              {/* ✅ ENHANCED: Korean vital point label with improved styling */}
              {(hoveredVitalPoint === vitalPoint.id ||
                selectedVitalPoint === vitalPoint.id) && (
                <pixiContainer y={-30}>
                  {/* Enhanced label background with Korean design elements */}
                  <pixiGraphics
                    draw={(g) => {
                      g.clear();

                      // Main background
                      g.fill({
                        color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                        alpha: 0.95,
                      });
                      g.roundRect(-45, -18, 90, 36, 6);
                      g.fill();

                      // Border with severity color
                      g.stroke({
                        width: 1.5,
                        color: getVitalPointColor(vitalPoint),
                        alpha: 0.9,
                      });
                      g.roundRect(-45, -18, 90, 36, 6);
                      g.stroke();

                      // Inner accent line
                      g.stroke({
                        width: 1,
                        color: KOREAN_COLORS.ACCENT_GOLD,
                        alpha: 0.4,
                      });
                      g.roundRect(-43, -16, 86, 32, 5);
                      g.stroke();
                    }}
                  />

                  {/* Korean name with enhanced typography */}
                  <pixiText
                    text={vitalPoint.name.korean}
                    style={{
                      fontSize: 11,
                      fill: KOREAN_COLORS.TEXT_PRIMARY,
                      fontWeight: "bold",
                      fontFamily: "Noto Sans KR",
                      align: "center",
                      dropShadow: {
                        color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                        distance: 1,
                        alpha: 0.8,
                      },
                    }}
                    anchor={0.5}
                    y={-8}
                  />

                  {/* English name */}
                  <pixiText
                    text={vitalPoint.name.english}
                    style={{
                      fontSize: 9,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontStyle: "italic",
                      align: "center",
                    }}
                    anchor={0.5}
                    y={6}
                  />

                  {/* Severity indicator */}
                  <pixiText
                    text={`[${vitalPoint.severity.toUpperCase()}]`}
                    style={{
                      fontSize: 7,
                      fill: getVitalPointColor(vitalPoint),
                      align: "center",
                      fontWeight: "bold",
                    }}
                    anchor={0.5}
                    y={14}
                  />
                </pixiContainer>
              )}
            </pixiContainer>
          ))}
        </pixiContainer>
      )}

      {/* ✅ ENHANCED: Training dummy label with Korean design */}
      <pixiContainer y={-130}>
        <pixiGraphics
          draw={(g) => {
            g.clear();

            // Background with Korean-inspired design
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
            g.roundRect(-50, -12, 100, 24, 6);
            g.fill();

            // Border
            g.stroke({
              width: 1.5,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.7,
            });
            g.roundRect(-50, -12, 100, 24, 6);
            g.stroke();

            // Corner accents (Korean knot pattern inspiration)
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.PRIMARY_CYAN,
              alpha: 0.5,
            });
            [-45, 45].forEach((cornerX) => {
              [-8, 8].forEach((cornerY) => {
                g.moveTo(cornerX, cornerY);
                g.lineTo(cornerX + (cornerX > 0 ? -6 : 6), cornerY);
                g.moveTo(cornerX, cornerY);
                g.lineTo(cornerX, cornerY + (cornerY > 0 ? -4 : 4));
              });
            });
            g.stroke();
          }}
        />

        <pixiText
          text="훈련용 인형"
          style={{
            fontSize: 13,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
            align: "center",
          }}
          anchor={0.5}
          y={-5}
        />

        <pixiText
          text="Training Dummy"
          style={{
            fontSize: 9,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
            align: "center",
          }}
          anchor={0.5}
          y={6}
        />
      </pixiContainer>

      {/* ✅ ENHANCED: Distance and training state indicator */}
      {isTraining && (
        <pixiContainer y={140}>
          {/* Distance indicator background */}
          <pixiGraphics
            draw={(g) => {
              g.clear();

              const inRange = distanceToPlayer < 120;
              const bgColor = inRange
                ? KOREAN_COLORS.ACCENT_GREEN
                : KOREAN_COLORS.UI_BACKGROUND_MEDIUM;

              g.fill({ color: bgColor, alpha: 0.8 });
              g.roundRect(-40, -10, 80, 20, 4);
              g.fill();

              g.stroke({
                width: 1,
                color: inRange
                  ? KOREAN_COLORS.TEXT_BRIGHT
                  : KOREAN_COLORS.TEXT_SECONDARY,
                alpha: 0.8,
              });
              g.roundRect(-40, -10, 80, 20, 4);
              g.stroke();
            }}
          />

          <pixiText
            text={`거리: ${Math.round(distanceToPlayer)}px`}
            style={{
              fontSize: 10,
              fill:
                distanceToPlayer < 120
                  ? KOREAN_COLORS.TEXT_BRIGHT
                  : KOREAN_COLORS.TEXT_PRIMARY,
              fontFamily: "Noto Sans KR",
              align: "center",
              fontWeight: "bold",
            }}
            anchor={0.5}
            y={-4}
          />

          <pixiText
            text={`Distance: ${Math.round(distanceToPlayer)}px`}
            style={{
              fontSize: 8,
              fill:
                distanceToPlayer < 120
                  ? KOREAN_COLORS.TEXT_SECONDARY
                  : KOREAN_COLORS.TEXT_TERTIARY,
              fontStyle: "italic",
              align: "center",
            }}
            anchor={0.5}
            y={4}
          />
        </pixiContainer>
      )}

      {/* ✅ ENHANCED: Hit effects with Korean martial arts styling */}
      {isHit && (
        <pixiContainer data-testid="hit-effects">
          {/* Impact flash with traditional Korean colors */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              const alpha = hitAnimation * 0.6;

              // Outer ring
              g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: alpha * 0.3 });
              g.circle(0, 0, 120 * hitAnimation);
              g.fill();

              // Inner impact
              g.fill({ color: KOREAN_COLORS.ACCENT_YELLOW, alpha });
              g.circle(0, 0, 80 * hitAnimation);
              g.fill();

              // Center flash
              g.fill({ color: KOREAN_COLORS.TEXT_BRIGHT, alpha: alpha * 1.5 });
              g.circle(0, 0, 40 * hitAnimation);
              g.fill();
            }}
          />

          {/* Korean hit text with traditional styling */}
          <pixiText
            text="타격!"
            style={{
              fontSize: 18,
              fill: KOREAN_COLORS.ACCENT_RED,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
              align: "center",
              dropShadow: {
                color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                distance: 2,
                alpha: 0.8,
              },
            }}
            anchor={0.5}
            y={-160}
            alpha={hitAnimation}
            scale={1 + hitAnimation * 0.2}
          />

          <pixiText
            text="HIT!"
            style={{
              fontSize: 14,
              fill: KOREAN_COLORS.ACCENT_RED,
              fontWeight: "bold",
              align: "center",
              dropShadow: {
                color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                distance: 1,
                alpha: 0.6,
              },
            }}
            anchor={0.5}
            y={-140}
            alpha={hitAnimation * 0.8}
            scale={1 + hitAnimation * 0.15}
          />
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default TrainingDummy;
