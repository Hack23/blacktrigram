/**
 * DamageNumbers - Floating damage number display component
 *
 * Displays floating damage numbers that animate upward and fade out.
 * Color-coded based on damage type: normal (cyan), critical (gold), vital (red).
 *
 * Uses Html overlays from @react-three/drei for rendering within 3D scenes.
 * Performance optimized with React.memo to reduce unnecessary re-renders.
 *
 * @module components/shared/three/effects/DamageNumbers
 * @category Shared Effects
 * @korean 피해숫자
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import { DamageNumber, DamageType } from "../../../../hooks/useActionFeedback";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { DEFAULT_PHYSICS_ARENA_BOUNDS, type PhysicsArenaBounds } from "../../../../types/PhysicsTypes";
import { hexColorToCSS, hexToRgbaString } from "../../../../utils/colorUtils";
import { withGPUAcceleration } from "../../../../utils/performanceOptimization";

/**
 * Props for the DamageNumbers component
 */
export interface DamageNumbersProps {
  /** Array of damage numbers to display */
  readonly damages: readonly DamageNumber[];
  /** Whether to use mobile-optimized sizing */
  readonly isMobile?: boolean;
  /** Arena bounds for 3D positioning (physics-first with meter dimensions) */
  readonly arenaBounds?: PhysicsArenaBounds;
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
 * Memoized to prevent unnecessary re-renders
 */
interface SingleDamageNumberProps {
  readonly damage: DamageNumber;
  readonly isMobile: boolean;
  readonly arenaBounds: PhysicsArenaBounds;
  readonly animationDuration: number;
}

const SingleDamageNumber = React.memo<SingleDamageNumberProps>(({
  damage,
  isMobile,
  arenaBounds,
  animationDuration,
}) => {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(damage.timestamp);

  // Calculate 3D position from meter-based coordinates (physics-first architecture)
  // Position is in meters relative to arena center (0, 0)
  // Player models use meter coordinates directly: position={[playerPos.x, 0, playerPos.y]}
  // So we use meter coordinates directly too for alignment
  const halfWidth = arenaBounds.worldWidthMeters / 2;
  const halfDepth = arenaBounds.worldDepthMeters / 2;
  
  // Clamp position to arena boundaries in meters
  const clampedX = Math.min(halfWidth, Math.max(-halfWidth, damage.position.x));
  const clampedZ = Math.min(halfDepth, Math.max(-halfDepth, damage.position.y));
  
  // Use clamped meter coordinates directly in 3D space (no remapping)
  const x = clampedX; // Meter position X
  const y = 2 + progress * 2; // Float upward
  const z = clampedZ; // Meter position Z (depth)
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
        style={withGPUAcceleration({
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
        })}
      >
        {damage.damage}
        {damage.type === "critical" && "!"}
        {damage.type === "vital" && "!!"}
      </div>
    </Html>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: re-render only when props that affect rendering change
  const prevArena = prevProps.arenaBounds;
  const nextArena = nextProps.arenaBounds;

  const sameArenaBounds =
    prevArena?.x === nextArena?.x &&
    prevArena?.y === nextArena?.y &&
    prevArena?.width === nextArena?.width &&
    prevArena?.height === nextArena?.height &&
    prevArena?.worldWidthMeters === nextArena?.worldWidthMeters &&
    prevArena?.worldDepthMeters === nextArena?.worldDepthMeters;

  return (
    prevProps.damage.id === nextProps.damage.id &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.animationDuration === nextProps.animationDuration &&
    sameArenaBounds
  );
});

SingleDamageNumber.displayName = "SingleDamageNumber";

/**
 * DamageNumbers Component
 *
 * Renders multiple floating damage numbers in the 3D scene.
 * Each number floats upward and fades out over time.
 * Performance optimized with React.memo.
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
const DamageNumbersComponent: React.FC<DamageNumbersProps> = ({
  damages,
  isMobile = false,
  arenaBounds = DEFAULT_PHYSICS_ARENA_BOUNDS,
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

/**
 * Memoized DamageNumbers with custom comparison
 * Only re-renders when damage array changes
 */
export const DamageNumbers = React.memo(
  DamageNumbersComponent,
  (prevProps, nextProps) => {
    // Compare damages array length and contents
    if (prevProps.damages.length !== nextProps.damages.length) {
      return false;
    }
    
    // Check if array contents changed (compare IDs)
    for (let i = 0; i < prevProps.damages.length; i++) {
      if (prevProps.damages[i].id !== nextProps.damages[i].id) {
        return false;
      }
    }
    
    // Check other props
    return (
      prevProps.isMobile === nextProps.isMobile &&
      prevProps.animationDuration === nextProps.animationDuration &&
      prevProps.arenaBounds?.x === nextProps.arenaBounds?.x &&
      prevProps.arenaBounds?.y === nextProps.arenaBounds?.y &&
      prevProps.arenaBounds?.width === nextProps.arenaBounds?.width &&
      prevProps.arenaBounds?.height === nextProps.arenaBounds?.height
    );
  }
);

DamageNumbers.displayName = "DamageNumbers";

export default DamageNumbers;
