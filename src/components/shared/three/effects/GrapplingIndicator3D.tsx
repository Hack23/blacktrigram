/**
 * GrapplingIndicator3D - Visual indicator for grappling state and struggle
 *
 * **Korean**: 잡기 표시기 3D (Japgi Pyosigi 3D)
 *
 * Displays visual feedback during grappling interactions including:
 * - Struggle particle effects
 * - Grip strength meter (UI overlay)
 * - Bilingual state text (Korean-English)
 * - Shake effects during escape attempts
 *
 * Features:
 * - Particle system for struggle visualization
 * - HTML overlay for grip strength UI
 * - Smooth transitions between grapple states
 * - Performance optimized for 60fps
 * - Korean-English bilingual text support
 *
 * @module components/shared/three/effects/GrapplingIndicator3D
 * @category Combat Effects
 * @korean 잡기표시기3D
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";
import type { Position3D } from "../../../../types/physics";
import { GrappleControl, GrappleState } from "../../../../types/common";

/**
 * Props for GrapplingIndicator3D component
 */
export interface GrapplingIndicator3DProps {
  /** Current grapple control state (undefined if not grappling) */
  readonly grappleControl: GrappleControl | undefined;
  /** Character position in 3D space (meters) */
  readonly characterPosition: Position3D;
  /** Whether the character is the controller (attacker) */
  readonly isController: boolean;
  /** Whether to use mobile-optimized rendering */
  readonly isMobile?: boolean;
  /** Test ID for component testing */
  readonly "data-testid"?: string;
}

/**
 * Particle count based on grapple state
 */
const PARTICLE_COUNT_MAP: Record<string, number> = {
  [GrappleState.NONE]: 0,
  [GrappleState.GRABBING]: 20,
  [GrappleState.CONTROLLING]: 30,
  [GrappleState.ESCAPING]: 50,
  [GrappleState.THROWING]: 40,
  [GrappleState.LOCKING]: 35,
};

/**
 * Get bilingual text for grapple state
 *
 * @param state - Current grapple state
 * @param isController - Whether viewing as controller
 * @returns Korean and English text for the state
 */
function getGrappleStateText(
  state: GrappleState,
  isController: boolean
): { korean: string; english: string } {
  if (isController) {
    switch (state) {
      case GrappleState.NONE:
        return { korean: "없음", english: "None" };
      case GrappleState.GRABBING:
        return { korean: "잡기 중", english: "Grabbing" };
      case GrappleState.CONTROLLING:
        return { korean: "잡기 유지", english: "Controlling" };
      case GrappleState.ESCAPING:
        return { korean: "제어 상실", english: "Losing Control" };
      case GrappleState.THROWING:
        return { korean: "던지기", english: "Throwing" };
      case GrappleState.LOCKING:
        return { korean: "관절기", english: "Joint Lock" };
    }
  } else {
    switch (state) {
      case GrappleState.NONE:
        return { korean: "없음", english: "None" };
      case GrappleState.GRABBING:
        return { korean: "잡힘", english: "Grabbed" };
      case GrappleState.CONTROLLING:
        return { korean: "잡힘 상태", english: "Grappled" };
      case GrappleState.ESCAPING:
        return { korean: "탈출 중", english: "Escaping" };
      case GrappleState.THROWING:
        return { korean: "던져짐", english: "Being Thrown" };
      case GrappleState.LOCKING:
        return { korean: "관절기당함", english: "Locked" };
    }
  }
}

/**
 * Get color for grapple state visualization
 *
 * @param state - Current grapple state
 * @param isController - Whether viewing as controller
 * @returns Hex color value
 */
function getGrappleStateColor(
  state: GrappleState,
  isController: boolean
): number {
  if (isController) {
    switch (state) {
      case GrappleState.NONE:
        return KOREAN_COLORS.UI_GRAY;
      case GrappleState.GRABBING:
        return KOREAN_COLORS.ACCENT_CYAN;
      case GrappleState.CONTROLLING:
        return KOREAN_COLORS.ACCENT_GOLD;
      case GrappleState.ESCAPING:
        return KOREAN_COLORS.WARNING_ORANGE;
      case GrappleState.THROWING:
        return KOREAN_COLORS.ACCENT_PURPLE;
      case GrappleState.LOCKING:
        return KOREAN_COLORS.CRITICAL_HIT;
    }
  } else {
    switch (state) {
      case GrappleState.NONE:
        return KOREAN_COLORS.UI_GRAY;
      case GrappleState.GRABBING:
        return KOREAN_COLORS.WARNING_ORANGE;
      case GrappleState.CONTROLLING:
        return KOREAN_COLORS.NEGATIVE_RED;
      case GrappleState.ESCAPING:
        return KOREAN_COLORS.ACCENT_GREEN;
      case GrappleState.THROWING:
        return KOREAN_COLORS.WARNING_YELLOW;
      case GrappleState.LOCKING:
        return KOREAN_COLORS.NEGATIVE_RED;
    }
  }
}

/**
 * Struggle particle system component
 *
 * Displays particles during grappling to visualize struggle and resistance.
 * Particle count and movement intensity scale with grapple state.
 */
const StruggleParticles: React.FC<{
  readonly particleCount: number;
  readonly color: number;
  readonly intensity: number;
  readonly position: Position3D;
}> = ({ particleCount, color, intensity, position }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, setPositions] = useState<Float32Array>(
    () => new Float32Array(particleCount * 3)
  );
  
  const velocitiesRef = useRef<Float32Array>(new Float32Array(particleCount * 3));

  useEffect(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 0.3 + Math.random() * 0.4; // 0.3-0.7m from center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = 1.2 + radius * Math.cos(phi); // Center at chest height
      pos[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      vel[i3] = (Math.random() - 0.5) * intensity * 2;
      vel[i3 + 1] = Math.random() * intensity;
      vel[i3 + 2] = (Math.random() - 0.5) * intensity * 2;
    }

    setPositions(pos);
    velocitiesRef.current = vel;

    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.attributes.position;
      (attr.array as Float32Array).set(pos);
      attr.needsUpdate = true;
    }
  }, [particleCount, intensity]);

  useEffect(() => {
    const points = pointsRef.current;
    return () => {
      if (points) {
        points.geometry.dispose();
        if (points.material instanceof THREE.Material) {
          points.material.dispose();
        }
      }
    };
  }, []);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;

    const attr = pointsRef.current.geometry.attributes.position;
    const array = attr.array as Float32Array;
    const velocities = velocitiesRef.current;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      array[i3] += velocities[i3] * delta;
      array[i3 + 1] += velocities[i3 + 1] * delta;
      array[i3 + 2] += velocities[i3 + 2] * delta;

      velocities[i3 + 1] -= 2.0 * delta;

      const y = array[i3 + 1];
      const distFromCenter = Math.sqrt(
        array[i3] * array[i3] + array[i3 + 2] * array[i3 + 2]
      );

      if (y < 0.5 || distFromCenter > 1.5) {
        const radius = 0.3 + Math.random() * 0.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        array[i3] = radius * Math.sin(phi) * Math.cos(theta);
        array[i3 + 1] = 1.2 + radius * Math.cos(phi);
        array[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

        velocities[i3] = (Math.random() - 0.5) * intensity * 2;
        velocities[i3 + 1] = Math.random() * intensity;
        velocities[i3 + 2] = (Math.random() - 0.5) * intensity * 2;
      }
    }

    attr.needsUpdate = true;
  });

  if (particleCount === 0) return null;

  return (
    <points ref={pointsRef} position={[position.x, position.y, position.z]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/**
 * Grip strength meter UI overlay
 *
 * Displays grip strength as a horizontal bar with bilingual labels.
 */
const GripStrengthMeter: React.FC<{
  readonly gripStrength: number;
  readonly maxGripStrength: number;
  readonly stateText: { korean: string; english: string };
  readonly color: number;
}> = ({ gripStrength, maxGripStrength, stateText, color }) => {
  const percentage = (gripStrength / maxGripStrength) * 100;
  const hexColor = `#${color.toString(16).padStart(6, "0")}`;

  return (
    <div
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.85)",
        border: `2px solid ${hexColor}`,
        borderRadius: "8px",
        padding: "8px 12px",
        minWidth: "200px",
        fontFamily: "'Noto Sans KR', 'Roboto', sans-serif",
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.6), 0 0 20px ${hexColor}40`,
      }}
      data-testid="grip-strength-meter"
    >
      {/* State text */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        <span style={{ color: hexColor }}>{stateText.korean}</span>
        <span style={{ color: hexColor }}>{stateText.english}</span>
      </div>

      {/* Grip strength bar */}
      <div
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "rgba(90, 101, 120, 0.3)",
          borderRadius: "4px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: hexColor,
            transition: "width 0.3s ease-out",
            boxShadow: `0 0 10px ${hexColor}`,
          }}
          data-testid="grip-bar-fill"
        />
      </div>

      {/* Grip strength value */}
      <div
        style={{
          textAlign: "center",
          marginTop: "4px",
          fontSize: "12px",
          color: "#cccccc",
          fontWeight: 500,
        }}
      >
        {Math.round(gripStrength)} / {maxGripStrength}
      </div>
    </div>
  );
};

/**
 * Main GrapplingIndicator3D component
 *
 * Renders struggle particles and grip strength UI during grappling.
 * Automatically adjusts visualization based on grapple state.
 */
export const GrapplingIndicator3D: React.FC<GrapplingIndicator3DProps> = ({
  grappleControl,
  characterPosition,
  isController,
  isMobile = false,
  "data-testid": testId = "grappling-indicator-3d",
}) => {
  if (!grappleControl) return null;

  const { state, gripStrength } = grappleControl;
  const maxGripStrength = 100; // TODO: Get from config

  const particleCount = isMobile
    ? Math.floor(PARTICLE_COUNT_MAP[state] * 0.6) // Reduce particles on mobile
    : PARTICLE_COUNT_MAP[state];

  const color = getGrappleStateColor(state, isController);
  const stateText = getGrappleStateText(state, isController);

  const intensity = state === GrappleState.ESCAPING ? 1.5 : 0.8;

  return (
    <group data-testid={testId}>
      {/* Struggle particle effect */}
      <StruggleParticles
        particleCount={particleCount}
        color={color}
        intensity={intensity}
        position={characterPosition}
      />

      {/* Grip strength meter overlay */}
      <Html
        position={[characterPosition.x, characterPosition.y + 2.2, characterPosition.z]}
        center
        distanceFactor={8}
        zIndexRange={[100, 0]}
      >
        <GripStrengthMeter
          gripStrength={gripStrength}
          maxGripStrength={maxGripStrength}
          stateText={stateText}
          color={color}
        />
      </Html>
    </group>
  );
};

export default GrapplingIndicator3D;
