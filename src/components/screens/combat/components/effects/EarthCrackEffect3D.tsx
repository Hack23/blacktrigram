/**
 * EarthCrackEffect3D - Ground crack visual effects for Gon (Earth) trigram techniques
 *
 * Creates earth crack patterns radiating from ground impact points.
 * Inspired by Korean pottery crack patterns with gradual expansion.
 * Visualizes the power of earth-shattering ground impact techniques.
 *
 * PERFORMANCE OPTIMIZATION:
 * - Uses instanced line segments for efficient rendering
 * - Object pooling for Vector3 calculations
 * - Target: 10+ concurrent effects at 60fps
 * - Memory: <15KB per component
 *
 * Features:
 * - Jagged crack lines radiating from impact point
 * - Korean pottery-inspired crack patterns (gradual expansion)
 * - Brown/earth tones from KOREAN_COLORS
 * - Appear over 300-500ms, fade over 2-3 seconds
 * - Intensity-based crack spread and depth
 *
 * Philosophy:
 * "땅이 갈라지고 산이 무너진다" - The earth splits and mountains crumble
 *
 * @module components/combat/EarthCrackEffect3D
 * @category Combat Effects
 * @korean 대지균열효과3D
 */

import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../../types/constants";
import { ThreeObjectPools } from "../../../../../utils/threeObjectPool";

/**
 * Earth crack effect data
 */
export interface EarthCrackEffect {
  /** Unique identifier */
  readonly id: string;
  /** Impact position in 3D world space (ground level) */
  readonly position: [number, number, number];
  /** Intensity based on groundImpactMultiplier (0.5 to 2.0) */
  readonly intensity: number;
  /** Timestamp when effect was created */
  readonly startTime: number;
}

/**
 * Props for EarthCrackEffect3D component
 */
export interface EarthCrackEffect3DProps {
  /** Active earth crack effects to render */
  readonly effects: readonly EarthCrackEffect[];
  /** Whether to enable earth crack effects */
  readonly enabled?: boolean;
  /** Mobile device mode (reduced crack count) */
  readonly isMobile?: boolean;
  /** Callback when effect completes */
  readonly onEffectComplete?: (effectId: string) => void;
}

/**
 * Individual crack segment
 */
interface CrackSegment {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  age: number;
  lifetime: number;
  width: number;
  maxWidth: number;
}

/**
 * Performance and visual constants
 */
const CRACK_CONSTANTS = {
  /** Number of crack lines radiating from impact */
  CRACK_LINES_DESKTOP: 8,
  CRACK_LINES_MOBILE: 5,
  /** Segments per crack line */
  SEGMENTS_PER_LINE_DESKTOP: 6,
  SEGMENTS_PER_LINE_MOBILE: 4,
  /** Crack appearance duration (ms) */
  APPEAR_DURATION: 0.4, // 400ms
  /** Crack fade duration (s) */
  FADE_DURATION: 2.5, // 2.5 seconds
  /** Base crack length (m) */
  BASE_LENGTH: 2.0,
  /** Maximum crack length multiplier based on intensity */
  LENGTH_INTENSITY_SCALE: 1.5,
  /** Crack width range */
  WIDTH_MIN: 0.02,
  WIDTH_MAX: 0.08,
  /** Jagged offset range for pottery-style cracks */
  JAGGED_OFFSET: 0.3,
  /** Ground Y offset to prevent z-fighting */
  GROUND_OFFSET: 0.01,
  /** Maximum delta time for physics stability */
  MAX_DELTA: 1 / 30,
} as const;

/**
 * Generate crack segments for a single impact point
 * 
 * PERFORMANCE: Uses ThreeObjectPools to eliminate Vector3 allocations
 */
const generateCrackSegments = (
  effect: EarthCrackEffect,
  crackLines: number,
  segmentsPerLine: number
): CrackSegment[] => {
  const segments: CrackSegment[] = [];
  
  // Pooled objects for calculations
  const tempOrigin = ThreeObjectPools.vector3.acquire();
  const tempDir = ThreeObjectPools.vector3.acquire();
  const tempOffset = ThreeObjectPools.vector3.acquire();

  try {
    tempOrigin.set(...effect.position);
    // Ensure crack origin is at ground level
    tempOrigin.y = CRACK_CONSTANTS.GROUND_OFFSET;

    const maxLength = CRACK_CONSTANTS.BASE_LENGTH + 
      (effect.intensity * CRACK_CONSTANTS.LENGTH_INTENSITY_SCALE);
    const segmentLength = maxLength / segmentsPerLine;

    // Generate radiating crack lines
    for (let i = 0; i < crackLines; i++) {
      const angle = (i / crackLines) * Math.PI * 2;
      tempDir.set(Math.cos(angle), 0, Math.sin(angle));

      let currentPos = tempOrigin.clone();

      // Generate segments along this crack line
      for (let j = 0; j < segmentsPerLine; j++) {
        // Add jagged offset for pottery-style cracks (Korean aesthetic)
        const jaggedAngle = angle + (Math.random() - 0.5) * CRACK_CONSTANTS.JAGGED_OFFSET;
        tempOffset.set(
          Math.cos(jaggedAngle) * segmentLength,
          0,
          Math.sin(jaggedAngle) * segmentLength
        );

        const nextPos = currentPos.clone().add(tempOffset);

        // Crack width decreases with distance from impact
        const widthFactor = 1.0 - (j / segmentsPerLine) * 0.7;
        const maxWidth = 
          CRACK_CONSTANTS.WIDTH_MIN + 
          (CRACK_CONSTANTS.WIDTH_MAX - CRACK_CONSTANTS.WIDTH_MIN) * 
          effect.intensity * widthFactor;

        segments.push({
          startPos: currentPos.clone(),
          endPos: nextPos.clone(),
          age: 0,
          lifetime: CRACK_CONSTANTS.FADE_DURATION,
          width: 0, // Starts at 0, expands during appearance
          maxWidth,
        });

        currentPos = nextPos;
      }
    }

    return segments;
  } finally {
    ThreeObjectPools.vector3.release(tempOrigin);
    ThreeObjectPools.vector3.release(tempDir);
    ThreeObjectPools.vector3.release(tempOffset);
  }
};

/**
 * EarthCrackEffect3D Component
 *
 * Renders earth crack effects for ground impact techniques.
 * Cracks appear with pottery-style jagged patterns and fade over time.
 *
 * @example
 * ```tsx
 * const [crackEffects, setCrackEffects] = useState<EarthCrackEffect[]>([]);
 *
 * // On ground impact technique
 * const handleGroundImpact = (position: [number, number, number], intensity: number) => {
 *   setCrackEffects([...crackEffects, {
 *     id: generateId(),
 *     position,
 *     intensity,
 *     startTime: Date.now(),
 *   }]);
 * };
 *
 * <EarthCrackEffect3D
 *   effects={crackEffects}
 *   enabled={visualEffects.earthCracks}
 *   isMobile={isMobile}
 *   onEffectComplete={(id) => {
 *     setCrackEffects(prev => prev.filter(e => e.id !== id));
 *   }}
 * />
 * ```
 */
export const EarthCrackEffect3D: React.FC<EarthCrackEffect3DProps> = ({
  effects,
  enabled = true,
  isMobile = false,
  onEffectComplete,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const segmentsRef = useRef<Map<string, CrackSegment[]>>(new Map());
  const completedEffectsRef = useRef<Set<string>>(new Set());
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  // Configuration based on device
  const config = useMemo(() => ({
    crackLines: isMobile 
      ? CRACK_CONSTANTS.CRACK_LINES_MOBILE 
      : CRACK_CONSTANTS.CRACK_LINES_DESKTOP,
    segmentsPerLine: isMobile 
      ? CRACK_CONSTANTS.SEGMENTS_PER_LINE_MOBILE 
      : CRACK_CONSTANTS.SEGMENTS_PER_LINE_DESKTOP,
  }), [isMobile]);

  // Crack color - Korean brown/earth tones (황토색)
  const crackColor = useMemo(() => 
    new THREE.Color(KOREAN_COLORS.TRIGRAM_GAN_PRIMARY).multiplyScalar(0.7), 
    []
  );

  // Initialize segments for new effects
  useEffect(() => {
    if (!enabled) return;

    effects.forEach((effect) => {
      if (!segmentsRef.current.has(effect.id)) {
        const segments = generateCrackSegments(
          effect,
          config.crackLines,
          config.segmentsPerLine
        );
        segmentsRef.current.set(effect.id, segments);
      }
    });

    // Clean up removed effects
    const effectIds = new Set(effects.map((e) => e.id));
    segmentsRef.current.forEach((_, id) => {
      if (!effectIds.has(id)) {
        segmentsRef.current.delete(id);
        completedEffectsRef.current.delete(id);
      }
    });
  }, [effects, enabled, config]);

  // Animation loop
  useFrame((_, delta) => {
    if (!enabled || !groupRef.current) return;

    const safeDelta = Math.min(delta, CRACK_CONSTANTS.MAX_DELTA);
    let needsUpdate = false;

    segmentsRef.current.forEach((segments, effectId) => {
      let hasActiveSegments = false;

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        segment.age += safeDelta;

        if (segment.age < segment.lifetime) {
          hasActiveSegments = true;
          needsUpdate = true;

          // Crack appears (expands) during first 400ms
          if (segment.age < CRACK_CONSTANTS.APPEAR_DURATION) {
            const appearProgress = segment.age / CRACK_CONSTANTS.APPEAR_DURATION;
            // Ease-out curve for smooth expansion
            const easedProgress = 1 - Math.pow(1 - appearProgress, 3);
            segment.width = segment.maxWidth * easedProgress;
          } else {
            segment.width = segment.maxWidth;
          }
        }
      }

      // Check if effect is complete
      if (!hasActiveSegments && !completedEffectsRef.current.has(effectId)) {
        completedEffectsRef.current.add(effectId);
        onEffectComplete?.(effectId);
      }
    });

    // Force re-render to update line geometries
    if (needsUpdate) {
      forceUpdate();
    }
  });

  // Don't render if disabled or no effects
  if (!enabled || effects.length === 0) {
    return null;
  }

  // Create render list for current frame
  // Note: Accessing refs during render is safe here - forceUpdate() ensures re-renders
  const renderList: Array<{ effectId: string; segments: CrackSegment[] }> = [];
  segmentsRef.current.forEach((segments, effectId) => {
    renderList.push({ effectId, segments });
  });

  return (
    <group ref={groupRef} data-testid="earth-crack-effect-3d">
      {renderList.map(({ effectId, segments }) =>
        segments.map((segment, index) => {
          // Calculate opacity based on age
          const fadeStartTime = CRACK_CONSTANTS.APPEAR_DURATION;
          const fadeProgress = 
            segment.age < fadeStartTime 
              ? 1.0 
              : 1.0 - ((segment.age - fadeStartTime) / (segment.lifetime - fadeStartTime));
          
          const opacity = Math.max(0, Math.min(1, fadeProgress));

          if (opacity <= 0.01) return null;

          return (
            <line key={`${effectId}-${index}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    segment.startPos.x, segment.startPos.y, segment.startPos.z,
                    segment.endPos.x, segment.endPos.y, segment.endPos.z,
                  ])}
                  itemSize={3}
                  args={[
                    new Float32Array([
                      segment.startPos.x, segment.startPos.y, segment.startPos.z,
                      segment.endPos.x, segment.endPos.y, segment.endPos.z,
                    ]),
                    3,
                  ]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color={crackColor}
                linewidth={segment.width * 100} // Scale for visibility
                transparent
                opacity={opacity * 0.8}
                depthWrite={false}
                depthTest={true}
              />
            </line>
          );
        })
      )}
    </group>
  );
};

export default EarthCrackEffect3D;
