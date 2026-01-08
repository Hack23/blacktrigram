/**
 * BodyPartHealthDisplay Component - Individual body part health visualization
 *
 * Displays health bars for all 8 body parts:
 * - Head (두부)
 * - Neck (경부)
 * - Torso Upper (상부 몸통)
 * - Torso Lower (하부 몸통)
 * - Left Arm (좌팔)
 * - Right Arm (우팔)
 * - Left Leg (좌다리)
 * - Right Leg (우다리)
 *
 * @module components/combat/BodyPartHealthDisplay
 * @category Combat UI
 * @korean 신체부위체력표시
 */

import React, { useMemo } from "react";
import { BodyPart, BodyPartHealth } from "../../../../../systems/bodypart/types";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../../types/constants";
import { hexToRgbaString } from "../../../../../utils/colorUtils";

export interface BodyPartHealthDisplayProps {
  /** Body part health data */
  readonly bodyPartHealth: BodyPartHealth;
  /** Player identifier for test IDs */
  readonly playerId: string;
  /** Position: 'left' for player 1, 'right' for player 2 */
  readonly position: "left" | "right";
  /** Whether to use mobile-optimized sizing */
  readonly isMobile: boolean;
}

/**
 * Body part names in Korean and English
 */
const BODY_PART_NAMES: Record<BodyPart, { korean: string; english: string }> = {
  [BodyPart.HEAD]: { korean: "두부", english: "Head" },
  [BodyPart.NECK]: { korean: "경부", english: "Neck" },
  [BodyPart.TORSO_UPPER]: { korean: "상부", english: "Upper" },
  [BodyPart.TORSO_LOWER]: { korean: "하부", english: "Lower" },
  [BodyPart.ARM_LEFT]: { korean: "좌팔", english: "L.Arm" },
  [BodyPart.ARM_RIGHT]: { korean: "우팔", english: "R.Arm" },
  [BodyPart.LEG_LEFT]: { korean: "좌다리", english: "L.Leg" },
  [BodyPart.LEG_RIGHT]: { korean: "우다리", english: "R.Leg" },
};

/**
 * Get health bar color based on health percentage
 */
const getHealthColor = (health: number): number => {
  if (health >= 80) return 0x00ff00; // Green
  if (health >= 60) return 0xffd700; // Yellow
  if (health >= 40) return 0xffa500; // Orange
  if (health >= 20) return 0xff6b6b; // Red
  return 0x8b0000; // Dark red
};

/**
 * BodyPartHealthDisplay - Shows health bars for all 8 body parts
 *
 * @example
 * ```tsx
 * <BodyPartHealthDisplay
 *   bodyPartHealth={player.bodyPartHealth}
 *   playerId="player-1"
 *   position="left"
 *   isMobile={false}
 * />
 * ```
 */
export const BodyPartHealthDisplay: React.FC<BodyPartHealthDisplayProps> = ({
  bodyPartHealth,
  playerId,
  position,
  isMobile,
}) => {
  const isLeft = position === "left";

  // Responsive sizing
  const barWidth = isMobile ? 100 : 140;
  const barHeight = isMobile ? 8 : 10;
  const fontSize = isMobile ? 9 : 10;
  const gap = isMobile ? "4px" : "5px";

  // Group body parts for display
  const bodyPartGroups = useMemo(
    () => [
      {
        label: "상체 | Upper",
        parts: [
          BodyPart.HEAD,
          BodyPart.NECK,
          BodyPart.TORSO_UPPER,
          BodyPart.TORSO_LOWER,
        ],
      },
      { label: "팔 | Arms", parts: [BodyPart.ARM_LEFT, BodyPart.ARM_RIGHT] },
      { label: "다리 | Legs", parts: [BodyPart.LEG_LEFT, BodyPart.LEG_RIGHT] },
    ],
    []
  );

  return (
    <div
      data-testid={`body-part-health-${playerId}`}
      style={{
        position: "absolute",
        // Position below PlayerHUD (which is ~140px tall on desktop, ~100px on mobile)
        // Account for VitalPoints controls which may be showing on left side
        top: isMobile ? "180px" : "240px",
        left: isLeft ? (isMobile ? "8px" : "12px") : "auto",
        right: isLeft ? "auto" : isMobile ? "8px" : "12px",
        display: "flex",
        flexDirection: "column",
        gap,
        backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
        borderRadius: "8px",
        padding: isMobile ? "6px" : "8px",
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.7)}`,
        boxShadow: `0 0 12px ${hexToRgbaString(
          KOREAN_COLORS.PRIMARY_CYAN,
          0.3
        )}`,
        pointerEvents: "none",
        zIndex: 100,
        maxWidth: isMobile ? "130px" : "160px",
        fontSize: isMobile ? "9px" : "10px",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: isMobile ? "10px" : "11px",
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
          color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
          textAlign: isLeft ? "left" : "right",
          marginBottom: "2px",
        }}
      >
        신체 | Body Parts
      </div>

      {/* Body part groups */}
      {bodyPartGroups.map((group) => (
        <div
          key={group.label}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          {/* Group label - optional, can be hidden for compact display */}
          <div
            style={{
              fontSize: `${fontSize - 1}px`,
              fontFamily: FONT_FAMILY.KOREAN,
              color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY, 0.8),
              textAlign: isLeft ? "left" : "right",
              marginTop: group.label === bodyPartGroups[0].label ? "0" : "4px",
            }}
          >
            {group.label}
          </div>

          {/* Body parts in group */}
          {group.parts.map((part) => {
            const health = bodyPartHealth[part];
            const names = BODY_PART_NAMES[part];
            const healthColor = getHealthColor(health);
            const shouldPulse = health < 20;

            return (
              <div
                key={part}
                data-testid={`body-part-${playerId}-${part}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                {/* Body part name and value */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: `${fontSize}px`,
                    fontFamily: FONT_FAMILY.KOREAN,
                    color: hexToRgbaString(healthColor, 1),
                  }}
                >
                  <span style={{ fontWeight: health < 40 ? "bold" : "normal" }}>
                    {isMobile
                      ? names.korean
                      : `${names.korean} | ${names.english}`}
                  </span>
                  <span style={{ fontSize: `${fontSize - 1}px` }}>
                    {Math.round(health)}%
                  </span>
                </div>

                {/* Health bar */}
                <div
                  style={{
                    width: `${barWidth}px`,
                    height: `${barHeight}px`,
                    backgroundColor: hexToRgbaString(
                      KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                      1
                    ),
                    borderRadius: "2px",
                    overflow: "hidden",
                    animation: shouldPulse
                      ? "healthPulse 0.8s infinite"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      width: `${health}%`,
                      height: "100%",
                      backgroundColor: hexToRgbaString(healthColor, 1),
                      transition:
                        "width 0.3s ease-in-out, background-color 0.3s ease-in-out",
                      boxShadow: `0 0 8px ${hexToRgbaString(healthColor, 0.4)}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default BodyPartHealthDisplay;
