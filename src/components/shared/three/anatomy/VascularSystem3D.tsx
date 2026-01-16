/**
 * VascularSystem3D - Blood vessel visualization with PBR materials
 *
 * Provides realistic blood vessel rendering with:
 * - PBR materials with transmission for glass-like blood vessels
 * - Animated blood flow pulsing at realistic heartbeat rate (1.2 beats per second = 72 BPM)
 * - Major arteries and veins with anatomically correct positioning
 * - High emissive intensity for bloom effects
 *
 * @module components/three/anatomy/VascularSystem3D
 * @category 3D Anatomy Components
 * @korean 혈관계3D컴포넌트
 */

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";

/**
 * Props for VascularSystem3D component
 *
 * @public
 * @korean 혈관계3D속성
 */
export interface VascularSystem3DProps {
  /**
   * Position of the vascular system (typically character position)
   * @korean 위치
   */
  readonly position?: [number, number, number];

  /**
   * Opacity of blood vessels (0-1)
   * @korean 불투명도
   */
  readonly opacity?: number;

  /**
   * Whether system is active (affects pulse intensity)
   * @korean 활성여부
   */
  readonly isActive?: boolean;

  /**
   * Heart rate multiplier (1.0 = normal, 1.5 = stressed, 0.5 = calm)
   * @korean 심박수배율
   */
  readonly heartRateMultiplier?: number;

  /**
   * Whether on mobile device (reduced geometry complexity)
   * @korean 모바일여부
   */
  readonly isMobile?: boolean;
}

/**
 * Heartbeat pulse constants
 */
const HEARTBEAT_BASE_RATE = 1.2; // 1.2 beats per second (72 BPM)
const PULSE_BASE_INTENSITY = 1.0; // Base emissive intensity
const PULSE_AMPLITUDE = 0.5; // Pulse variation (max 1.5 total)

/**
 * PBR material constants for blood vessels
 */
const VASCULAR_TRANSMISSION = 0.4; // Semi-transparent for realistic blood vessels
const VASCULAR_THICKNESS = 0.2; // Glass-like thickness for transmission
const VASCULAR_ROUGHNESS = 0.3; // Slight roughness for realistic surface
const VASCULAR_CLEARCOAT = 0.8; // Glossy coating for wet blood vessel appearance

/**
 * VascularSystem3D Component
 *
 * Renders anatomically accurate blood vessel system with realistic
 * PBR materials and animated blood flow pulsing.
 *
 * Design notes:
 * - Uses MeshPhysicalMaterial with transmission for glass-like vessels
 * - Emissive intensity pulses to simulate blood flow
 * - Heartbeat rate adjustable based on combat state (stressed/calm)
 * - Major arteries are thicker and brighter than branch vessels
 *
 * @example
 * ```tsx
 * <VascularSystem3D
 *   position={[0, 1.0, 0]}
 *   opacity={0.8}
 *   isActive={true}
 *   heartRateMultiplier={1.2}
 *   isMobile={false}
 * />
 * ```
 *
 * @korean 혈관계3D컴포넌트
 */
export const VascularSystem3D: React.FC<VascularSystem3DProps> = ({
  position = [0, 0, 0],
  opacity = 0.8,
  isActive = true,
  heartRateMultiplier = 1.0,
  isMobile = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Calculate heartbeat rate with multiplier
  const heartbeatRate = useMemo(
    () => HEARTBEAT_BASE_RATE * heartRateMultiplier,
    [heartRateMultiplier]
  );

  // Create reusable PBR material for blood vessels
  // Note: This single material instance is shared across all blood vessel meshes for
  // performance optimization. All vessels pulse in perfect synchronization as the
  // useFrame animation modifies emissiveIntensity on all meshes simultaneously.
  // If differentiated pulsing is desired (e.g., arterial vs venous flow with phase
  // offsets), consider creating separate materials or adding per-mesh timing offsets.
  const vascularMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        // Standard red accent color (0xff4444) for blood vessel visualization
        color: KOREAN_COLORS.ACCENT_RED,
        transparent: true,
        opacity: opacity,
        transmission: VASCULAR_TRANSMISSION,
        thickness: VASCULAR_THICKNESS,
        roughness: VASCULAR_ROUGHNESS,
        clearcoat: VASCULAR_CLEARCOAT,
        emissive: KOREAN_COLORS.ACCENT_RED,
        emissiveIntensity: PULSE_BASE_INTENSITY,
      }),
    [opacity]
  );

  // Clean up material on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      vascularMaterial.dispose();
    };
  }, [vascularMaterial]);

  // Animate blood flow pulsing with heartbeat simulation
  useFrame((state) => {
    if (!groupRef.current || !isActive) return;

    // Heartbeat pulse: sine wave at heartbeat rate
    const time = state.clock.elapsedTime * heartbeatRate;
    const pulse = Math.sin(time * Math.PI * 2) * 0.5 + 0.5; // 0-1 range
    const targetIntensity = PULSE_BASE_INTENSITY + pulse * PULSE_AMPLITUDE;

    // Update all vessel materials with pulsing emissive
    groupRef.current.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshPhysicalMaterial
      ) {
        child.material.emissiveIntensity = targetIntensity;
      }
    });
  });

  // Geometry segment counts (reduced for mobile)
  const radialSegments = isMobile ? 6 : 8;

  return (
    <group
      ref={groupRef}
      position={position}
      name="vascular-system-3d"
    >
      {/* Aorta - main artery from heart (largest vessel) */}
      <mesh position={[0, 1.0, -0.1]} name="aorta">
        <cylinderGeometry args={[0.02, 0.02, 1.4, radialSegments]} />
        <primitive object={vascularMaterial} attach="material" />
      </mesh>

      {/* Carotid arteries - neck blood supply (critical vital points) */}
      <mesh position={[-0.1, 1.4, -0.05]} name="carotid-left">
        <cylinderGeometry args={[0.015, 0.015, 0.3, radialSegments]} />
        <primitive object={vascularMaterial} attach="material" />
      </mesh>
      <mesh position={[0.1, 1.4, -0.05]} name="carotid-right">
        <cylinderGeometry args={[0.015, 0.015, 0.3, radialSegments]} />
        <primitive object={vascularMaterial} attach="material" />
      </mesh>

      {/* Subclavian/axillary arteries - shoulder to arm */}
      <mesh
        position={[-0.25, 1.15, -0.08]}
        rotation={[0, 0, Math.PI / 4]}
        name="subclavian-left"
      >
        <cylinderGeometry args={[0.012, 0.012, 0.25, radialSegments]} />
        <primitive object={vascularMaterial} attach="material" />
      </mesh>
      <mesh
        position={[0.25, 1.15, -0.08]}
        rotation={[0, 0, -Math.PI / 4]}
        name="subclavian-right"
      >
        <cylinderGeometry args={[0.012, 0.012, 0.25, radialSegments]} />
        <primitive object={vascularMaterial} attach="material" />
      </mesh>

      {/* Brachial arteries - upper arm (continued from subclavian) */}
      <mesh
        position={[-0.4, 0.9, -0.08]}
        rotation={[0, 0, Math.PI / 6]}
        name="brachial-left"
      >
        <cylinderGeometry args={[0.01, 0.01, 0.3, radialSegments]} />
        <primitive object={vascularMaterial} attach="material" />
      </mesh>
      <mesh
        position={[0.4, 0.9, -0.08]}
        rotation={[0, 0, -Math.PI / 6]}
        name="brachial-right"
      >
        <cylinderGeometry args={[0.01, 0.01, 0.3, radialSegments]} />
        <primitive object={vascularMaterial} attach="material" />
      </mesh>

      {/* Femoral arteries - legs (major vessels, vital points) */}
      <mesh position={[-0.15, 0.4, -0.08]} name="femoral-left">
        <cylinderGeometry args={[0.012, 0.012, 0.35, radialSegments]} />
        <primitive object={vascularMaterial} attach="material" />
      </mesh>
      <mesh position={[0.15, 0.4, -0.08]} name="femoral-right">
        <cylinderGeometry args={[0.012, 0.012, 0.35, radialSegments]} />
        <primitive object={vascularMaterial} attach="material" />
      </mesh>

      {/* Popliteal arteries - behind knee (critical strike point) */}
      {!isMobile && (
        <>
          <mesh position={[-0.15, 0.2, 0.05]} name="popliteal-left">
            <cylinderGeometry args={[0.01, 0.01, 0.15, radialSegments]} />
            <primitive object={vascularMaterial} attach="material" />
          </mesh>
          <mesh position={[0.15, 0.2, 0.05]} name="popliteal-right">
            <cylinderGeometry args={[0.01, 0.01, 0.15, radialSegments]} />
            <primitive object={vascularMaterial} attach="material" />
          </mesh>
        </>
      )}

      {/* Hepatic artery - liver blood supply */}
      {!isMobile && (
        <mesh
          position={[0.1, 0.9, -0.15]}
          rotation={[Math.PI / 4, 0, Math.PI / 6]}
          name="hepatic"
        >
          <cylinderGeometry args={[0.01, 0.01, 0.15, radialSegments]} />
          <primitive object={vascularMaterial} attach="material" />
        </mesh>
      )}

      {/* Renal arteries - kidney blood supply */}
      {!isMobile && (
        <>
          <mesh
            position={[-0.12, 0.8, -0.15]}
            rotation={[0, 0, Math.PI / 2]}
            name="renal-left"
          >
            <cylinderGeometry args={[0.008, 0.008, 0.12, radialSegments]} />
            <primitive object={vascularMaterial} attach="material" />
          </mesh>
          <mesh
            position={[0.12, 0.8, -0.15]}
            rotation={[0, 0, -Math.PI / 2]}
            name="renal-right"
          >
            <cylinderGeometry args={[0.008, 0.008, 0.12, radialSegments]} />
            <primitive object={vascularMaterial} attach="material" />
          </mesh>
        </>
      )}
    </group>
  );
};

export default VascularSystem3D;
