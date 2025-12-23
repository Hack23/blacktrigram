/**
 * BloodDecals3D - Blood accumulation decal system for character models
 *
 * Projects blood decals onto 3D character surfaces using decal geometry for
 * persistent blood visualization. Decals fade over time and track injury
 * persistence across combat rounds.
 *
 * Features:
 * - Decal projection onto character meshes
 * - Blood accumulation from hits and lacerations
 * - Blood trail visualization
 * - Cross-round injury persistence
 * - Korean-themed blood visualization
 *
 * @module components/combat/BloodDecals3D
 * @category Combat Effects
 * @korean 피흔적3D
 */

import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../types/constants";

/**
 * Blood decal configuration
 */
export interface BloodDecal {
  /** Unique identifier */
  readonly id: string;
  /** Position in world space */
  readonly position: [number, number, number];
  /** Normal vector for surface projection */
  readonly normal: [number, number, number];
  /** Size of decal */
  readonly size: [number, number, number];
  /** Rotation around normal (radians) */
  readonly rotation: number;
  /** Opacity (0.0 to 1.0) */
  readonly opacity: number;
  /** Creation timestamp */
  readonly timestamp: number;
  /** Whether decal is from a laceration (adds blood trail) */
  readonly isLaceration?: boolean;
}

/**
 * Props for BloodDecals3D component
 */
export interface BloodDecals3DProps {
  /** Active blood decals to render */
  readonly decals: readonly BloodDecal[];
  /** Character mesh reference for decal projection */
  readonly targetMeshRef?: React.RefObject<THREE.Mesh>;
  /** Whether decals are enabled (violence settings) */
  readonly enabled?: boolean;
  /** Mobile mode (simplified decals) */
  readonly isMobile?: boolean;
  /** Decal fade duration in seconds */
  readonly fadeDuration?: number;
  /** Callback when decal fully fades */
  readonly onDecalComplete?: (decalId: string) => void;
}

/**
 * Blood decal constants
 */
const DECAL_CONSTANTS = {
  /** Default fade duration (seconds) */
  FADE_DURATION: 15.0,
  /** Base decal size */
  BASE_SIZE: [0.15, 0.15, 0.05] as [number, number, number],
  /** Laceration trail size multiplier */
  TRAIL_MULTIPLIER: 3.0,
  /** Maximum concurrent decals for performance */
  MAX_DECALS: 20,
  /** Mobile decal limit */
  MAX_DECALS_MOBILE: 10,
} as const;

/**
 * Generate blood decal texture (procedural)
 */
const createBloodTexture = (): THREE.Texture => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    // Fallback: Return a basic transparent texture with matching dimensions
    console.warn("Blood decal texture generation failed: Could not get 2D context");
    const fallbackCanvas = document.createElement("canvas");
    fallbackCanvas.width = 256;
    fallbackCanvas.height = 256;
    return new THREE.CanvasTexture(fallbackCanvas);
  }

  // Background (transparent)
  ctx.clearRect(0, 0, 256, 256);

  // Blood splatter pattern
  const centerX = 128;
  const centerY = 128;

  // Create gradient from center
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    100
  );

  // Blood color (dark red)
  const bloodColor = new THREE.Color(KOREAN_COLORS.BLOODLOSS_INDICATOR);
  const r = Math.floor(bloodColor.r * 255);
  const g = Math.floor(bloodColor.g * 255);
  const b = Math.floor(bloodColor.b * 255);

  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1.0)`);
  gradient.addColorStop(0.6, `rgba(${r * 0.8}, ${g * 0.6}, ${b * 0.6}, 0.8)`);
  gradient.addColorStop(1, `rgba(${r * 0.5}, ${g * 0.3}, ${b * 0.3}, 0)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  // Add irregular edges for realistic look
  for (let i = 0; i < 30; i++) {
    const angle = (i / 30) * Math.PI * 2;
    const radius = 80 + Math.random() * 20;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    const size = 5 + Math.random() * 10;

    ctx.fillStyle = `rgba(${r * 0.7}, ${g * 0.4}, ${b * 0.4}, ${0.5 + Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

/**
 * Individual decal component
 */
const DecalMesh: React.FC<{
  decal: BloodDecal;
  texture: THREE.Texture;
  targetMesh?: THREE.Mesh;
  fadeDuration: number;
}> = ({ decal, texture, targetMesh, fadeDuration }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  // Create decal geometry
  useEffect(() => {
    if (!meshRef.current || !targetMesh) return;

    try {
      const position = new THREE.Vector3(...decal.position);
      const size = new THREE.Vector3(...decal.size);

      // Create decal geometry projected onto target mesh
      // DecalGeometry requires Euler angles for orientation
      const orientation = new THREE.Euler();
      orientation.copy(targetMesh.rotation);
      
      const decalGeometry = new DecalGeometry(
        targetMesh,
        position,
        orientation,
        size
      );

      meshRef.current.geometry = decalGeometry;
      
      // Apply rotation to the mesh itself
      meshRef.current.rotation.set(0, 0, decal.rotation);
    } catch (error) {
      // Handle decal projection failures
      // This can occur when target mesh geometry is complex or decal position is invalid
      // Decal will simply not render in this case
      if (process.env.NODE_ENV === "development") {
        // In development, log a diagnostic warning to help debug decal issues
        console.warn("BloodDecals3D: Failed to project blood decal onto target mesh.", {
          decalId: decal.id,
          position: decal.position,
          size: decal.size,
          error,
        });
      }
    }
  }, [decal, targetMesh]);

  // Fade animation - update material opacity in animation loop
  useFrame(() => {
    if (!materialRef.current) return;

    const age = (Date.now() - decal.timestamp) / 1000;
    const fadeProgress = Math.min(age / fadeDuration, 1);
    materialRef.current.opacity = decal.opacity * (1 - fadeProgress);
  });

  // Calculate current opacity for render check (outside useMemo to avoid impure function issue)
  const age = (Date.now() - decal.timestamp) / 1000;
  const fadeProgress = Math.min(age / fadeDuration, 1);
  const currentOpacity = decal.opacity * (1 - fadeProgress);

  // Don't render if fully faded
  if (currentOpacity <= 0.01) return null;

  return (
    <mesh ref={meshRef} data-testid={`blood-decal-${decal.id}`}>
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={currentOpacity}
        depthTest={true}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-4}
      />
    </mesh>
  );
};

/**
 * BloodDecals3D Component
 *
 * Renders persistent blood decals on 3D character models using decal projection.
 * Decals fade over time and can persist across combat rounds for injury tracking.
 *
 * Performance optimized:
 * - Limited concurrent decals (20 desktop, 10 mobile)
 * - Efficient decal geometry generation
 * - Texture reuse across all decals
 * - Automatic cleanup of faded decals
 *
 * @example
 * ```tsx
 * const [bloodDecals, setBloodDecals] = useState<BloodDecal[]>([]);
 * const characterMeshRef = useRef<THREE.Mesh>(null);
 *
 * // On hit event
 * const handleHit = (position: [number, number, number], normal: [number, number, number]) => {
 *   setBloodDecals([...bloodDecals, {
 *     id: generateId(),
 *     position,
 *     normal,
 *     size: [0.15, 0.15, 0.05],
 *     rotation: Math.random() * Math.PI * 2,
 *     opacity: 0.8,
 *     timestamp: Date.now(),
 *     isLaceration: false,
 *   }]);
 * };
 *
 * <mesh ref={characterMeshRef}>
 *   <capsuleGeometry args={[0.5, 1.6, 16, 32]} />
 *   <meshStandardMaterial color={0xcccccc} />
 * </mesh>
 *
 * <BloodDecals3D
 *   decals={bloodDecals}
 *   targetMeshRef={characterMeshRef}
 *   enabled={violenceSettings.blood}
 *   isMobile={isMobile}
 *   onDecalComplete={(id) => {
 *     setBloodDecals(prev => prev.filter(d => d.id !== id));
 *   }}
 * />
 * ```
 */
export const BloodDecals3D: React.FC<BloodDecals3DProps> = ({
  decals,
  targetMeshRef,
  enabled = true,
  isMobile = false,
  fadeDuration = DECAL_CONSTANTS.FADE_DURATION,
  onDecalComplete,
}) => {
  // Track completed decals
  const completedDecalsRef = useRef<Set<string>>(new Set());

  // Performance limits
  const maxDecals = isMobile
    ? DECAL_CONSTANTS.MAX_DECALS_MOBILE
    : DECAL_CONSTANTS.MAX_DECALS;

  // Create shared blood texture
  const bloodTexture = useMemo(() => createBloodTexture(), []);

  // Limit decals for performance
  const activeDecals = useMemo(() => {
    // Sort by timestamp (newest first) and take max count
    const sorted = [...decals].sort((a, b) => b.timestamp - a.timestamp);
    return sorted.slice(0, maxDecals);
  }, [decals, maxDecals]);

  // Check for completed decals
  useFrame(() => {
    const now = Date.now();
    
    activeDecals.forEach((decal) => {
      const age = (now - decal.timestamp) / 1000;
      const isExpired = age >= fadeDuration;

      if (
        isExpired &&
        onDecalComplete &&
        !completedDecalsRef.current.has(decal.id)
      ) {
        completedDecalsRef.current.add(decal.id);
        onDecalComplete(decal.id);
      }
    });
  });

  // Clean up texture on unmount
  useEffect(() => {
    return () => {
      bloodTexture.dispose();
    };
  }, [bloodTexture]);

  // Don't render if disabled or no decals
  if (!enabled || activeDecals.length === 0) {
    return null;
  }

  return (
    <group data-testid="blood-decals-3d">
      {activeDecals.map((decal) => (
        <DecalMesh
          key={decal.id}
          decal={decal}
          texture={bloodTexture}
          targetMesh={targetMeshRef?.current ?? undefined}
          fadeDuration={fadeDuration}
        />
      ))}
    </group>
  );
};

export default BloodDecals3D;
