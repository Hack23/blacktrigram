/**
 * LimbExposureIndicator3D - Visual indicator for exposed limbs during combat
 *
 * **Korean**: 사지 노출 표시기 3D (Saji Nochul Pyosigi 3D)
 *
 * Displays a glowing effect on exposed limbs during attack execution,
 * indicating vulnerability windows for counter-attacks. The glow intensity
 * is based on the vulnerability multiplier (1.5x-2.5x).
 *
 * Features:
 * - Red/orange glow effect using pointLight
 * - Intensity scales with vulnerability multiplier
 * - Smooth fade in/out during exposure window
 * - Positioned at limb location on character model
 * - Performance optimized for 60fps
 *
 * @module components/shared/three/effects/LimbExposureIndicator3D
 * @category Combat Effects
 * @korean 사지노출표시기3D
 */

import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import { KOREAN_COLORS } from "../../../../types/constants";
import type {
  CounterOpportunity,
  ExposedLimbType,
  Position3D,
} from "../../../../types/physics";
import * as THREE from "three";

/**
 * Props for LimbExposureIndicator3D component
 */
export interface LimbExposureIndicator3DProps {
  /** Counter-attack opportunity with exposure data */
  readonly opportunity: CounterOpportunity | undefined;
  /** Character position in 3D space (meters) */
  readonly characterPosition: Position3D;
  /** Whether the character is facing left */
  readonly facingLeft?: boolean;
  /** Whether to use mobile-optimized rendering */
  readonly isMobile?: boolean;
  /** Current time in technique execution (ms) */
  readonly currentTime: number;
  /** Test ID for component testing */
  readonly "data-testid"?: string;
}

/**
 * Calculate limb position offset from character center
 *
 * Returns position offset in meters for the exposed limb.
 * Adjusts for character facing direction.
 *
 * @param limb - Type of exposed limb
 * @param facingLeft - Whether character is facing left
 * @returns Position offset [x, y, z] in meters
 */
function getLimbPositionOffset(
  limb: ExposedLimbType,
  facingLeft: boolean
): [number, number, number] {
  // Base offsets in meters (approximate human proportions)
  const leftMult = facingLeft ? -1 : 1;

  switch (limb) {
    // Arms (상체)
    case "left_arm":
      return [-0.3 * leftMult, 1.2, 0]; // Shoulder height
    case "right_arm":
      return [0.3 * leftMult, 1.2, 0];
    case "left_elbow":
      return [-0.4 * leftMult, 1.0, 0.1]; // Slightly forward
    case "right_elbow":
      return [0.4 * leftMult, 1.0, 0.1];
    case "left_wrist":
      return [-0.5 * leftMult, 0.9, 0.2]; // Extended forward
    case "right_wrist":
      return [0.5 * leftMult, 0.9, 0.2];

    // Legs (하체)
    case "left_leg":
      return [-0.15 * leftMult, 0.8, 0]; // Mid-thigh
    case "right_leg":
      return [0.15 * leftMult, 0.8, 0];
    case "left_knee":
      return [-0.2 * leftMult, 0.5, 0.15]; // Forward when kicking
    case "right_knee":
      return [0.2 * leftMult, 0.5, 0.15];
    case "left_ankle":
      return [-0.2 * leftMult, 0.1, 0.3]; // Foot position
    case "right_ankle":
      return [0.2 * leftMult, 0.1, 0.3];

    default:
      return [0, 1.0, 0]; // Default chest height
  }
}

/**
 * Calculate glow intensity from vulnerability multiplier
 *
 * Maps vulnerability multiplier (1.0-3.0) to light intensity (0-10).
 * Higher vulnerability = brighter glow.
 *
 * @param vulnerabilityMultiplier - Damage multiplier (1.0-3.0)
 * @param isMobile - Whether to use reduced intensity for mobile
 * @returns Light intensity (0-10)
 */
function calculateGlowIntensity(
  vulnerabilityMultiplier: number,
  isMobile: boolean
): number {
  // Clamp multiplier to valid range
  const clamped = Math.max(1.0, Math.min(3.0, vulnerabilityMultiplier));

  // Map to intensity range (1.0 -> 3, 3.0 -> 10)
  const baseIntensity = 3 + ((clamped - 1.0) / 2.0) * 7;

  // Reduce intensity on mobile for performance
  return isMobile ? baseIntensity * 0.7 : baseIntensity;
}

/**
 * Calculate fade factor based on current time and window timing
 *
 * Provides smooth fade in/out at window boundaries:
 * - Fade in: First 20% of window
 * - Sustained: Middle 60% of window
 * - Fade out: Last 20% of window
 *
 * @param currentTime - Current time in technique (ms)
 * @param windowStart - Window start time (ms)
 * @param windowDuration - Window duration (ms)
 * @returns Fade factor (0-1)
 */
function calculateFadeFactor(
  currentTime: number,
  windowStart: number,
  windowDuration: number
): number {
  // Guard against invalid window duration
  if (windowDuration <= 0) return 0;

  const elapsed = currentTime - windowStart;

  // Before window starts
  if (elapsed < 0) return 0;

  // After window ends
  if (elapsed > windowDuration) return 0;

  // Calculate progress through window (0-1)
  const progress = elapsed / windowDuration;

  // Fade in during first 20%
  if (progress < 0.2) {
    return progress / 0.2;
  }

  // Fade out during last 20%
  if (progress > 0.8) {
    return (1.0 - progress) / 0.2;
  }

  // Sustained at full intensity (20%-80%)
  return 1.0;
}

/**
 * Get glow color based on vulnerability level
 *
 * @param vulnerabilityMultiplier - Damage multiplier
 * @param allowsBreaking - Whether breaking techniques are allowed
 * @returns THREE.Color instance
 */
function getGlowColor(
  vulnerabilityMultiplier: number,
  allowsBreaking: boolean
): THREE.Color {
  // Breaking opportunities: bright red (NEGATIVE_RED for high danger)
  if (allowsBreaking) {
    return new THREE.Color(KOREAN_COLORS.NEGATIVE_RED);
  }

  // High vulnerability (>2.0): red
  if (vulnerabilityMultiplier >= 2.0) {
    return new THREE.Color(KOREAN_COLORS.ACCENT_RED);
  }

  // Medium vulnerability (1.5-2.0): orange
  if (vulnerabilityMultiplier >= 1.5) {
    return new THREE.Color(KOREAN_COLORS.SECONDARY_ORANGE);
  }

  // Low vulnerability (<1.5): yellow
  return new THREE.Color(KOREAN_COLORS.ACCENT_GOLD);
}

/**
 * LimbExposureIndicator3D Component
 *
 * Renders a glowing point light at the exposed limb position during
 * vulnerability windows. The light intensity and color reflect the
 * degree of vulnerability.
 *
 * Performance:
 * - Uses single point light (low overhead)
 * - Calculates fade factor once per frame
 * - Memoized offset calculations
 * - Early return if no opportunity
 *
 * @example
 * ```tsx
 * <LimbExposureIndicator3D
 *   opportunity={counterOpportunity}
 *   characterPosition={{ x: 2, y: 0, z: 0 }}
 *   facingLeft={false}
 *   isMobile={false}
 *   currentTime={450}
 * />
 * ```
 */
export const LimbExposureIndicator3D: React.FC<
  LimbExposureIndicator3DProps
> = ({
  opportunity,
  characterPosition,
  facingLeft = false,
  isMobile = false,
  currentTime,
  "data-testid": testId = "limb-exposure-indicator",
}) => {
  // Track animated intensity for smooth transitions
  const [animatedIntensity, setAnimatedIntensity] = useState(0);
  const intensityRef = useRef(0);

  // Calculate limb position offset (memoized, changes only when limb or facing changes)
  const limbOffset = useMemo(
    () =>
      opportunity
        ? getLimbPositionOffset(opportunity.exposedLimb, facingLeft)
        : [0, 0, 0],
    [opportunity?.exposedLimb, facingLeft]
  );

  // Calculate final 3D position
  const position3D: [number, number, number] = useMemo(
    () => [
      characterPosition.x + limbOffset[0],
      characterPosition.y + limbOffset[1],
      characterPosition.z + limbOffset[2],
    ],
    [characterPosition, limbOffset]
  );

  // Calculate target intensity based on opportunity
  const targetIntensity = useMemo(() => {
    if (!opportunity) return 0;

    const fadeFactor = calculateFadeFactor(
      currentTime,
      opportunity.windowStart,
      opportunity.windowDuration
    );

    if (fadeFactor === 0) return 0;

    const baseIntensity = calculateGlowIntensity(
      opportunity.vulnerabilityMultiplier,
      isMobile
    );

    return baseIntensity * fadeFactor;
  }, [opportunity, currentTime, isMobile]);

  // Get glow color
  const glowColor = useMemo(
    () =>
      opportunity
        ? getGlowColor(
            opportunity.vulnerabilityMultiplier,
            opportunity.allowsBreaking
          )
        : new THREE.Color(KOREAN_COLORS.ACCENT_RED),
    [opportunity]
  );

  // Smooth intensity transitions using useFrame
  useFrame((_, delta) => {
    // Lerp towards target intensity
    const lerpSpeed = 5.0; // Speed of intensity transition
    intensityRef.current = THREE.MathUtils.lerp(
      intensityRef.current,
      targetIntensity,
      delta * lerpSpeed
    );

    // Update state only if changed significantly (avoid unnecessary renders)
    if (Math.abs(intensityRef.current - animatedIntensity) > 0.01) {
      setAnimatedIntensity(intensityRef.current);
    }
  });

  // Don't render if no opportunity or intensity is near zero
  if (!opportunity || animatedIntensity < 0.01) {
    return null;
  }

  return (
    <group data-testid={testId} position={position3D}>
      {/* Point light for glow effect */}
      <pointLight
        color={glowColor}
        intensity={animatedIntensity}
        distance={2} // Light radius in meters
        decay={2} // Natural light falloff
        castShadow={false} // Don't cast shadows for performance
      />

      {/* Visual indicator sphere (optional, for debugging) */}
      {process.env.NODE_ENV === "development" && (
        <mesh>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={animatedIntensity / 10}
          />
        </mesh>
      )}
    </group>
  );
};

// Display name for debugging
LimbExposureIndicator3D.displayName = "LimbExposureIndicator3D";

// Memoize component to prevent unnecessary re-renders
export default React.memo(
  LimbExposureIndicator3D,
  (prevProps, nextProps) => {
    // Re-render only if relevant props change
    return (
      prevProps.opportunity?.exposedLimb === nextProps.opportunity?.exposedLimb &&
      prevProps.opportunity?.windowStart === nextProps.opportunity?.windowStart &&
      prevProps.opportunity?.windowDuration === nextProps.opportunity?.windowDuration &&
      prevProps.opportunity?.vulnerabilityMultiplier === nextProps.opportunity?.vulnerabilityMultiplier &&
      prevProps.opportunity?.allowsBreaking === nextProps.opportunity?.allowsBreaking &&
      prevProps.characterPosition.x === nextProps.characterPosition.x &&
      prevProps.characterPosition.y === nextProps.characterPosition.y &&
      prevProps.characterPosition.z === nextProps.characterPosition.z &&
      prevProps.facingLeft === nextProps.facingLeft &&
      prevProps.isMobile === nextProps.isMobile &&
      prevProps.currentTime === nextProps.currentTime
    );
  }
);
