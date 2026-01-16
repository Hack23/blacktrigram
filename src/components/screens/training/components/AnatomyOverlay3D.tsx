/**
 * AnatomyOverlay3D - Toggleable anatomy visualization layers
 *
 * Provides skeleton, nerves, vascular, and surface anatomy overlays
 * for educational training visualization
 */

import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";

// Visual effect constants for bloom optimization
// Note: Emissive intensity values are balanced for visual clarity and performance.
// When applied to many simultaneous overlays/markers, emissive intensities above ~2.0 can
// increase rendering cost and bloom pass overhead. VitalPointMarker3D intentionally uses
// higher emissive values (up to ~3.5) for a small number of selected markers, which is
// acceptable because the total marker count is low. For dense anatomy overlays, prefer
// keeping emissive intensities at or below ~2.0 and consider implementing LOD or
// distance-based emissive scaling if brighter values or higher object counts are needed.
// See VitalPointMarker3D for a concrete example: it exposes a configurable
// `maxEmissiveIntensity` prop that caps per-marker glow. Use higher caps there for a
// small number of critical vital point markers, while keeping dense overlay layers like
// those in AnatomyOverlay3D within the ~2.0 guideline to maintain 60fps performance.
const SKELETON_EMISSIVE_INTENSITY = 1.0; // Enhanced glow for skeletal structure
const NERVE_EMISSIVE_INTENSITY = 1.5; // Balanced for bloom without performance impact
const VASCULAR_EMISSIVE_INTENSITY = 2.0; // Moderate intensity for blood vessels
const VASCULAR_PULSE_BASE = 1.0; // Base intensity for vascular pulse animation
const VASCULAR_PULSE_AMPLITUDE = 0.5; // Pulse variation amplitude (max 1.5 total)

// Transmission constants for glass-like anatomy layers
const SKELETON_MAJOR_TRANSMISSION = 0.1; // Reduced transmission for more solid bone appearance (was 0.3)
const SKELETON_MAJOR_THICKNESS = 0.5; // Increased thickness for realistic bone structure (was 0.3)
const SKELETON_LIMB_TRANSMISSION = 0.05; // Reduced transmission for limbs (was 0.2)
const SKELETON_LIMB_THICKNESS = 0.4; // Increased thickness for limb bones (was 0.2)
const VASCULAR_TRANSMISSION = 0.2; // All vascular system meshes
const VASCULAR_THICKNESS = 0.2;

/**
 * Anatomy layer types
 */
export type AnatomyLayer = "skeleton" | "nerves" | "vascular" | "surface";

/**
 * Props for AnatomyOverlay3D component
 */
export interface AnatomyOverlay3DProps {
  /** Position of the anatomy overlay (typically the dummy position) */
  readonly position: [number, number, number];
  /** Which anatomy layers to display */
  readonly visibleLayers: readonly AnatomyLayer[];
  /** Opacity of the overlay (0-1) */
  readonly opacity?: number;
  /** Whether on mobile device (reserved for future mobile-specific optimizations) */
  readonly isMobile?: boolean;
}

/**
 * Skeleton Layer Component
 * Simplified skeletal structure visualization with glass-like transmission
 */
const SkeletonLayer: React.FC<{ opacity: number }> = ({ opacity }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Pulsing emissive animation for skeleton layer
  useFrame((state) => {
    if (!groupRef.current) return;

    // Enhanced pulse for better visibility (amplitude increased from 0.2 to 0.4)
    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.4 + 0.6;

    // Rebuild mesh cache each frame to ensure all meshes are captured
    const meshes: THREE.Mesh[] = [];
    groupRef.current.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshPhysicalMaterial
      ) {
        meshes.push(child);
      }
    });

    // Update all meshes with pulsing emissive
    meshes.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshPhysicalMaterial) {
        mesh.material.emissiveIntensity = pulse;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Spine - vertical line */}
      <mesh position={[0, 1.0, -0.05]}>
        <cylinderGeometry args={[0.03, 0.03, 1.6, 8]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.WHITE_SOLID}
          transparent
          opacity={opacity}
          transmission={SKELETON_MAJOR_TRANSMISSION}
          thickness={SKELETON_MAJOR_THICKNESS}
          roughness={0.4} // Increased roughness for bone texture (was 0.1)
          clearcoat={0.3}
          metalness={0} // Bone is non-metallic
          emissive={KOREAN_COLORS.PRIMARY_CYAN}
          emissiveIntensity={SKELETON_EMISSIVE_INTENSITY}
          // Bone surface detail
          ior={1.55} // Index of refraction for bone
          sheen={0.1} // Slight sheen for bone surface
          sheenRoughness={0.9}
        />
      </mesh>

      {/* Skull - wireframe sphere */}
      <lineSegments position={[0, 1.6, 0]}>
        <edgesGeometry args={[new THREE.SphereGeometry(0.25, 16, 16)]} />
        <lineBasicMaterial
          color={KOREAN_COLORS.WHITE_SOLID}
          transparent
          opacity={opacity}
        />
      </lineSegments>

      {/* Rib cage - horizontal lines */}
      {[1.3, 1.15, 1.0, 0.85, 0.7].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.25 - i * 0.02, 0.02, 8, 16]} />
          <meshPhysicalMaterial
            color={KOREAN_COLORS.WHITE_SOLID}
            transparent
            opacity={opacity * 0.7}
            transmission={SKELETON_MAJOR_TRANSMISSION}
            thickness={SKELETON_MAJOR_THICKNESS}
            roughness={0.4} // Bone texture (consistent with spine)
            clearcoat={0.3}
            metalness={0} // Bone is non-metallic
            emissive={KOREAN_COLORS.PRIMARY_CYAN}
            emissiveIntensity={SKELETON_EMISSIVE_INTENSITY}
            // Bone surface detail
            ior={1.55} // Index of refraction for bone
            sheen={0.1} // Slight sheen for bone surface
            sheenRoughness={0.9}
          />
        </mesh>
      ))}

      {/* Pelvis - simplified structure */}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.25, 0.03, 8, 16]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.WHITE_SOLID}
          transparent
          opacity={opacity}
          transmission={SKELETON_MAJOR_TRANSMISSION}
          thickness={SKELETON_MAJOR_THICKNESS}
          roughness={0.4} // Bone texture (consistent with spine)
          clearcoat={0.3}
          metalness={0} // Bone is non-metallic
          emissive={KOREAN_COLORS.PRIMARY_CYAN}
          emissiveIntensity={SKELETON_EMISSIVE_INTENSITY}
          // Bone surface detail
          ior={1.55} // Index of refraction for bone
          sheen={0.1} // Slight sheen for bone surface
          sheenRoughness={0.9}
        />
      </mesh>

      {/* Left arm bones */}
      <mesh position={[-0.4, 1.0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.WHITE_SOLID}
          transparent
          opacity={opacity * 0.8}
          transmission={SKELETON_LIMB_TRANSMISSION}
          thickness={SKELETON_LIMB_THICKNESS}
          roughness={0.4} // Bone texture (consistent with spine)
          metalness={0} // Bone is non-metallic
          emissive={KOREAN_COLORS.PRIMARY_CYAN}
          emissiveIntensity={SKELETON_EMISSIVE_INTENSITY}
          // Bone surface detail
          ior={1.55} // Index of refraction for bone
          sheen={0.1} // Slight sheen for bone surface
          sheenRoughness={0.9}
        />
      </mesh>

      {/* Right arm bones */}
      <mesh position={[0.4, 1.0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.WHITE_SOLID}
          transparent
          opacity={opacity * 0.8}
          transmission={SKELETON_LIMB_TRANSMISSION}
          thickness={SKELETON_LIMB_THICKNESS}
          roughness={0.4} // Bone texture (consistent with spine)
          metalness={0} // Bone is non-metallic
          emissive={KOREAN_COLORS.PRIMARY_CYAN}
          emissiveIntensity={SKELETON_EMISSIVE_INTENSITY}
          // Bone surface detail
          ior={1.55} // Index of refraction for bone
          sheen={0.1} // Slight sheen for bone surface
          sheenRoughness={0.9}
        />
      </mesh>

      {/* Leg bones */}
      <mesh position={[-0.2, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.WHITE_SOLID}
          transparent
          opacity={opacity * 0.8}
          transmission={SKELETON_LIMB_TRANSMISSION}
          thickness={SKELETON_LIMB_THICKNESS}
          roughness={0.4} // Bone texture (consistent with spine)
          metalness={0} // Bone is non-metallic
          emissive={KOREAN_COLORS.PRIMARY_CYAN}
          emissiveIntensity={SKELETON_EMISSIVE_INTENSITY}
          // Bone surface detail
          ior={1.55} // Index of refraction for bone
          sheen={0.1} // Slight sheen for bone surface
          sheenRoughness={0.9}
        />
      </mesh>
      <mesh position={[0.2, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.WHITE_SOLID}
          transparent
          opacity={opacity * 0.8}
          transmission={SKELETON_LIMB_TRANSMISSION}
          thickness={SKELETON_LIMB_THICKNESS}
          roughness={0.4} // Bone texture (consistent with spine)
          metalness={0} // Bone is non-metallic
          emissive={KOREAN_COLORS.PRIMARY_CYAN}
          emissiveIntensity={SKELETON_EMISSIVE_INTENSITY}
          // Bone surface detail
          ior={1.55} // Index of refraction for bone
          sheen={0.1} // Slight sheen for bone surface
          sheenRoughness={0.9}
        />
      </mesh>
    </group>
  );
};

/**
 * Nerves Layer Component
 * Nervous system pathways visualization
 */
const NervesLayer: React.FC<{ opacity: number }> = ({ opacity }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Pulsing animation for nerve pathways
  useFrame((state) => {
    if (!groupRef.current) return;

    const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.5 + 0.5;
    const targetIntensity = 1.0 + pulse * 0.5;

    // Rebuild mesh cache each frame to ensure all meshes are captured
    const meshes: THREE.Mesh[] = [];
    groupRef.current.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshPhysicalMaterial
      ) {
        meshes.push(child);
      }
    });

    // Update all meshes with pulsing emissive
    meshes.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshPhysicalMaterial) {
        mesh.material.emissiveIntensity = targetIntensity;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Spinal cord - central nerve */}
      <mesh position={[0, 1.0, -0.08]}>
        <cylinderGeometry args={[0.025, 0.025, 1.6, 8]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.SECONDARY_YELLOW}
          transparent
          opacity={opacity}
          emissive={KOREAN_COLORS.SECONDARY_YELLOW}
          emissiveIntensity={NERVE_EMISSIVE_INTENSITY}
          roughness={0.2}
          clearcoat={1.0}
        />
      </mesh>

      {/* Nerve branches - from spine to limbs */}
      {/* Cervical nerves (neck area) */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh
          key={`cervical-${i}`}
          position={[x, 1.4, -0.08]}
          rotation={[0, 0, x > 0 ? -Math.PI / 4 : Math.PI / 4]}
        >
          <cylinderGeometry args={[0.015, 0.015, 0.2, 6]} />
          <meshPhysicalMaterial
            color={KOREAN_COLORS.ACCENT_GOLD}
            transparent
            opacity={opacity * 0.8}
            emissive={KOREAN_COLORS.ACCENT_GOLD}
            emissiveIntensity={1.5}
            roughness={0.2}
            clearcoat={1.0}
          />
        </mesh>
      ))}

      {/* Brachial plexus (arm nerves) */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh
          key={`brachial-${i}`}
          position={[x, 1.1, -0.08]}
          rotation={[0, 0, x > 0 ? -Math.PI / 3 : Math.PI / 3]}
        >
          <cylinderGeometry args={[0.015, 0.01, 0.3, 6]} />
          <meshPhysicalMaterial
            color={KOREAN_COLORS.ACCENT_GOLD}
            transparent
            opacity={opacity * 0.7}
            emissive={KOREAN_COLORS.ACCENT_GOLD}
            emissiveIntensity={NERVE_EMISSIVE_INTENSITY}
            roughness={0.2}
            clearcoat={1.0}
          />
        </mesh>
      ))}

      {/* Lumbar/sacral nerves (leg nerves) */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh
          key={`lumbar-${i}`}
          position={[x, 0.5, -0.08]}
          rotation={[0, 0, x > 0 ? -Math.PI / 6 : Math.PI / 6]}
        >
          <cylinderGeometry args={[0.015, 0.01, 0.4, 6]} />
          <meshPhysicalMaterial
            color={KOREAN_COLORS.ACCENT_GOLD}
            transparent
            opacity={opacity * 0.7}
            emissive={KOREAN_COLORS.ACCENT_GOLD}
            emissiveIntensity={NERVE_EMISSIVE_INTENSITY}
            roughness={0.2}
            clearcoat={1.0}
          />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Vascular Layer Component
 * Blood vessel system visualization with glass-like transmission
 */
const VascularLayer: React.FC<{ opacity: number }> = ({ opacity }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Pulsing animation simulating blood flow
  useFrame((state) => {
    if (!groupRef.current) return;

    const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.5 + 0.5;
    const targetIntensity = VASCULAR_PULSE_BASE + pulse * VASCULAR_PULSE_AMPLITUDE;

    // Rebuild mesh cache each frame to ensure all meshes are captured
    const meshes: THREE.Mesh[] = [];
    groupRef.current.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshPhysicalMaterial
      ) {
        meshes.push(child);
      }
    });

    // Update all meshes with pulsing emissive
    meshes.forEach((mesh) => {
      if (mesh.material instanceof THREE.MeshPhysicalMaterial) {
        mesh.material.emissiveIntensity = targetIntensity;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Aorta - main artery */}
      <mesh position={[0, 1.0, -0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.ACCENT_RED}
          transparent
          opacity={opacity}
          transmission={VASCULAR_TRANSMISSION}
          thickness={VASCULAR_THICKNESS}
          roughness={0.2}
          clearcoat={0.8}
          emissive={KOREAN_COLORS.ACCENT_RED}
          emissiveIntensity={VASCULAR_EMISSIVE_INTENSITY}
        />
      </mesh>

      {/* Carotid arteries (neck) */}
      {[-0.1, 0.1].map((x, i) => (
        <mesh key={`carotid-${i}`} position={[x, 1.4, -0.05]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 6]} />
          <meshPhysicalMaterial
            color={KOREAN_COLORS.ACCENT_RED}
            transparent
            opacity={opacity * 0.9}
            transmission={VASCULAR_TRANSMISSION}
            thickness={VASCULAR_THICKNESS}
            roughness={0.2}
            clearcoat={0.8}
            emissive={KOREAN_COLORS.ACCENT_RED}
            emissiveIntensity={VASCULAR_EMISSIVE_INTENSITY}
          />
        </mesh>
      ))}

      {/* Subclavian/axillary arteries (shoulder to arm) */}
      {[-0.25, 0.25].map((x, i) => (
        <mesh
          key={`subclavian-${i}`}
          position={[x, 1.15, -0.08]}
          rotation={[0, 0, x > 0 ? -Math.PI / 4 : Math.PI / 4]}
        >
          <cylinderGeometry args={[0.012, 0.012, 0.25, 6]} />
          <meshPhysicalMaterial
            color={KOREAN_COLORS.ACCENT_RED}
            transparent
            opacity={opacity * 0.8}
            transmission={VASCULAR_TRANSMISSION}
            thickness={VASCULAR_THICKNESS}
            roughness={0.2}
            clearcoat={0.8}
            emissive={KOREAN_COLORS.ACCENT_RED}
            emissiveIntensity={VASCULAR_EMISSIVE_INTENSITY}
          />
        </mesh>
      ))}

      {/* Femoral arteries (legs) */}
      {[-0.15, 0.15].map((x, i) => (
        <mesh key={`femoral-${i}`} position={[x, 0.4, -0.08]}>
          <cylinderGeometry args={[0.012, 0.012, 0.35, 6]} />
          <meshPhysicalMaterial
            color={KOREAN_COLORS.ACCENT_RED}
            transparent
            opacity={opacity * 0.8}
            transmission={VASCULAR_TRANSMISSION}
            thickness={VASCULAR_THICKNESS}
            roughness={0.2}
            clearcoat={0.8}
            emissive={KOREAN_COLORS.ACCENT_RED}
            emissiveIntensity={VASCULAR_EMISSIVE_INTENSITY}
          />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Surface Layer Component
 * Surface anatomy landmarks and skin layer
 */
const SurfaceLayer: React.FC<{ opacity: number }> = ({ opacity }) => {
  return (
    <group>
      {/* Glass Skin Shell - Slightly larger than dummy to envelop internals */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          roughness={0.2}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={opacity * 0.5}
        />
      </mesh>

      <mesh position={[0, 1.0, 0]}>
        <capsuleGeometry args={[0.31, 0.8, 8, 16]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          roughness={0.2}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={opacity * 0.5}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.4, 1.0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <capsuleGeometry args={[0.11, 0.6, 4, 8]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          roughness={0.2}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={opacity * 0.5}
        />
      </mesh>
      <mesh position={[0.4, 1.0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <capsuleGeometry args={[0.11, 0.6, 4, 8]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          roughness={0.2}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={opacity * 0.5}
        />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, 0.3, 0]}>
        <capsuleGeometry args={[0.13, 0.5, 4, 8]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          roughness={0.2}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={opacity * 0.5}
        />
      </mesh>
      <mesh position={[0.2, 0.3, 0]}>
        <capsuleGeometry args={[0.13, 0.5, 4, 8]} />
        <meshPhysicalMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          roughness={0.2}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={opacity * 0.5}
        />
      </mesh>
    </group>
  );
};

/**
 * AnatomyOverlay3D Component
 * Main component that manages all anatomy layers
 */
export const AnatomyOverlay3D: React.FC<AnatomyOverlay3DProps> = ({
  position,
  visibleLayers,
  opacity = 0.7,
}) => {
  // Memoize layer visibility checks
  const showSkeleton = useMemo(
    () => visibleLayers.includes("skeleton"),
    [visibleLayers]
  );
  const showNerves = useMemo(
    () => visibleLayers.includes("nerves"),
    [visibleLayers]
  );
  const showVascular = useMemo(
    () => visibleLayers.includes("vascular"),
    [visibleLayers]
  );
  const showSurface = useMemo(
    () => visibleLayers.includes("surface"),
    [visibleLayers]
  );

  return (
    <group position={position} name="anatomy-overlay-3d">
      {showSkeleton && <SkeletonLayer opacity={opacity} />}
      {showNerves && <NervesLayer opacity={opacity} />}
      {showVascular && <VascularLayer opacity={opacity} />}
      {showSurface && <SurfaceLayer opacity={opacity} />}
    </group>
  );
};

export default AnatomyOverlay3D;
