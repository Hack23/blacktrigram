/**
 * DamageNumbers - Floating damage number display component
 *
 * Displays floating damage numbers that animate upward and fade out.
 * Color-coded based on damage type: normal (cyan), critical (gold), vital (red).
 *
 * Uses Html overlays from @react-three/drei for rendering within 3D scenes.
 *
 * @module components/combat/components/DamageNumbers
 * @category Combat UI
 * @korean 피해숫자
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import { DamageNumber, DamageType } from "../../../hooks/useActionFeedback";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { hexColorToCSS, hexToRgbaString } from "../../../utils/colorUtils";

/**
 * Props for the DamageNumbers component
 */
export interface DamageNumbersProps {
  /** Array of damage numbers to display */
  readonly damages: readonly DamageNumber[];
  /** Whether to use mobile-optimized sizing */
  readonly isMobile?: boolean;
  /** Arena bounds for 3D positioning */
  readonly arenaBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Duration of animation in ms (default: 1500) */
  readonly animationDuration?: number;
}

/**
 * Get color based on damage type
 */
function getDamageColor(type: DamageType): string {
  switch (type) {
    case "critical":
      return hexColorToCSS(KOREAN_COLORS.ACCENT_GOLD);
    case "vital":
      return hexColorToCSS(KOREAN_COLORS.ACCENT_RED);
    case "normal":
    default:
      return hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN);
  }
}

/**
 * Get glow color based on damage type
 */
function getGlowColor(type: DamageType): string {
  switch (type) {
    case "critical":
      return hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8);
    case "vital":
      return hexToRgbaString(KOREAN_COLORS.ACCENT_RED, 0.8);
    case "normal":
    default:
      return hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8);
  }
}

/**
 * Individual damage number display
 */
interface SingleDamageNumberProps {
  readonly damage: DamageNumber;
  readonly isMobile: boolean;
  readonly arenaBounds: { x: number; y: number; width: number; height: number };
  readonly animationDuration: number;
}

const SingleDamageNumber: React.FC<SingleDamageNumberProps> = ({
  damage,
  isMobile,
  arenaBounds,
  animationDuration,
}) => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(damage.timestamp);

  // Calculate 3D position from 2D screen coordinates (direct calculation, not memoized)
  const relX = (damage.position.x - arenaBounds.x) / arenaBounds.width;
  const relZ = (damage.position.y - arenaBounds.y) / arenaBounds.height;
  const x = relX * 16 - 8; // Map 0-1 to -8 to 8
  const y = 2 + progress * 2; // Float upward
  const z = relZ * 8 - 4; // Map 0-1 to -4 to 4
  const position3D: [number, number, number] = [x, y, z];

  // Update progress using useFrame
  useFrame(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const newProgress = Math.min(elapsed / animationDuration, 1);
    setProgress(newProgress);
  });

  // Don't render if expired
  if (progress >= 1) return null;

  const opacity = 1 - progress;
  const scale = 1 + progress * 0.3; // Slight scale up during animation
  const fontSize = isMobile ? 20 : 28;
  // Calculate critical bonus based on damage type
  const getCriticalBonus = (): number => {
    if (damage.type === "critical") return 8;
    if (damage.type === "vital") return 4;
    return 0;
  };
  const criticalBonus = getCriticalBonus();

  return (
    <Html
      position={position3D}
      center
      distanceFactor={10}
      style={{ pointerEvents: "none" }}
    >
      <div
        data-testid={`damage-${damage.id}`}
        style={{
          fontSize: `${fontSize + criticalBonus}px`,
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
          color: getDamageColor(damage.type),
          opacity,
          transform: `scale(${scale})`,
          textShadow: `
            0 0 10px ${getGlowColor(damage.type)},
            0 0 20px ${getGlowColor(damage.type)},
            2px 2px 4px rgba(0, 0, 0, 0.8)
          `,
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        {damage.damage}
        {damage.type === "critical" && "!"}
        {damage.type === "vital" && "!!"}
      </div>
    </Html>
  );
};

/**
 * DamageNumbers Component
 *
 * Renders multiple floating damage numbers in the 3D scene.
 * Each number floats upward and fades out over time.
 *
 * @example
 * ```tsx
 * <DamageNumbers
 *   damages={damageNumbers}
 *   isMobile={isMobile}
 *   arenaBounds={arenaBounds}
 * />
 * ```
 */
export const DamageNumbers: React.FC<DamageNumbersProps> = ({
  damages,
  isMobile = false,
  arenaBounds = { x: 0, y: 0, width: 1200, height: 800 },
  animationDuration = 1500,
}) => {
  // Derive visible damages from props - no need for state sync
  const visibleDamages = useMemo(() => [...damages], [damages]);

  return (
    <group data-testid="damage-numbers-container">
      {visibleDamages.map((damage) => (
        <SingleDamageNumber
          key={damage.id}
          damage={damage}
          isMobile={isMobile}
          arenaBounds={arenaBounds}
          animationDuration={animationDuration}
        />
      ))}
    </group>
  );
};
