/**
 * HitFeedbackEffect3D - Visual hit confirmation with damage numbers
 * 
 * Provides particle effects, color flashes, and floating damage numbers
 * for training hit feedback
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";

/**
 * Props for HitFeedbackEffect3D component
 */
export interface HitFeedbackEffect3DProps {
  /** 3D position where hit occurred */
  readonly position: [number, number, number];
  /** Type of hit (affects visual style) */
  readonly type: "success" | "perfect" | "miss";
  /** Damage dealt (if applicable) */
  readonly damage?: number;
  /** Whether effect is visible */
  readonly visible?: boolean;
  /** Callback when effect completes */
  readonly onComplete?: () => void;
  /** Duration in milliseconds */
  readonly duration?: number;
  /** Whether on mobile device */
  readonly isMobile?: boolean;
}

/**
 * Impact particle system
 */
const ImpactParticles: React.FC<{
  position: [number, number, number];
  color: number;
  count: number;
}> = ({ position, color, count }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Store velocities in a ref that persists across renders
  const velocitiesRef = useRef<Float32Array | null>(null);
  
  // Store initial position for seeded random - use useState to capture at mount
  // Note: This intentionally ignores position prop changes to maintain consistent
  // particle behavior throughout the effect's lifetime. To update particles when
  // position changes, add a key prop to the parent component to force remount.
  const [initialPosition] = useState(position);

  // Initialize particle positions and velocities - use seed based on initial position
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    // Use initial position as seed for deterministic but varying particles
    const seed = initialPosition[0] + initialPosition[1] * 10 + initialPosition[2] * 100;
    
    // Simple seeded random using position
    // Large multiplier (10000) ensures sufficient entropy for randomness while keeping values deterministic
    function seededRandom(index: number): number {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Start at center
      pos[i3] = 0;
      pos[i3 + 1] = 0;
      pos[i3 + 2] = 0;

      // Random outward velocities using seeded random
      const theta = seededRandom(i * 3) * Math.PI * 2;
      const phi = seededRandom(i * 3 + 1) * Math.PI;
      const speed = 0.5 + seededRandom(i * 3 + 2) * 1.5;

      vel[i3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i3 + 1] = Math.cos(phi) * speed + 1; // Upward bias
      vel[i3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
    }

    return { positions: pos, velocities: vel };
  }, [count, initialPosition]); // initialPosition is captured at mount and won't change
  
  // Update velocities ref in useEffect to avoid ref access during render
  useEffect(() => {
    velocitiesRef.current = velocities;
  }, [velocities]);

  // Animate particles
  useFrame((_, delta) => {
    if (!pointsRef.current || !velocitiesRef.current) return;

    const attr = pointsRef.current.geometry.attributes.position;
    const array = attr.array as Float32Array;
    const vel = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Update positions
      array[i3] += vel[i3] * delta * 10;
      array[i3 + 1] += vel[i3 + 1] * delta * 10;
      array[i3 + 2] += vel[i3 + 2] * delta * 10;

      // Apply gravity
      // Note: Intentionally mutating velocitiesRef.current (Float32Array) for performance.
      // This is safe and won't trigger React re-renders since it's a ref.
      vel[i3 + 1] -= 9.8 * delta;

      // Fade out particles that go too far
      if (array[i3 + 1] < -2) {
        array[i3 + 1] = -2;
      }
    }

    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

/**
 * Expanding ring effect
 */
const RingEffect: React.FC<{
  position: [number, number, number];
  color: number;
  maxRadius: number;
}> = ({ position, color, maxRadius }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useRef<number>(0);
  
  // Initialize start time on mount using useEffect
  useEffect(() => {
    if (startTime.current === 0) {
      startTime.current = Date.now();
    }
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = Math.min(elapsed / 0.5, 1); // 0.5 second duration

    // Expand ring
    const radius = progress * maxRadius;
    meshRef.current.scale.setScalar(radius);

    // Fade out
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 1 - progress;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1.0, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

/**
 * Floating damage number
 */
const DamageNumber: React.FC<{
  position: [number, number, number];
  damage: number;
  type: "perfect" | "normal" | "miss";
  isMobile: boolean;
  onComplete: () => void;
}> = ({ position, damage, type, isMobile, onComplete }) => {
  const [offset, setOffset] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const startTime = useRef<number>(0);
  const completedRef = useRef(false);
  
  // Initialize start time on mount using useEffect
  useEffect(() => {
    if (startTime.current === 0) {
      startTime.current = Date.now();
    }
  }, []);

  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = Math.min(elapsed / 1.5, 1); // 1.5 second duration

    // Float upward
    setOffset(progress * 1);

    // Fade out
    setOpacity(1 - progress);

    // Complete when done (only once)
    if (progress >= 1 && !completedRef.current && onComplete) {
      completedRef.current = true;
      onComplete();
    }
  });

  const color = type === "perfect" ? "#ffd700" : type === "normal" ? "#00ffff" : "#ff4444";
  const text = type === "miss" ? "빗나감 | MISS" : `${damage}`; // Korean: 빗나감 = miss/deflected

  return (
    <Html
      position={[position[0], position[1] + offset, position[2]]}
      center
      distanceFactor={10}
      style={{ pointerEvents: "none", opacity }}
    >
      <div
        style={{
          fontSize: isMobile ? "20px" : "28px",
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
          color,
          textShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
          whiteSpace: "nowrap",
        }}
        data-testid="damage-number"
      >
        {text}
      </div>
    </Html>
  );
};

/**
 * HitFeedbackEffect3D Component
 * Main hit feedback visualization
 */
export const HitFeedbackEffect3D: React.FC<HitFeedbackEffect3DProps> = ({
  position,
  type,
  damage,
  visible = true,
  onComplete,
  duration = 1500,
  isMobile = false,
}) => {
  const [showEffect, setShowEffect] = useState(visible);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get colors based on hit type
  const effectColor = useMemo(() => {
    switch (type) {
      case "perfect":
        return KOREAN_COLORS.ACCENT_GOLD;
      case "success":
        return KOREAN_COLORS.PRIMARY_CYAN;
      case "miss":
        return KOREAN_COLORS.TEXT_SECONDARY;
      default:
        return KOREAN_COLORS.PRIMARY_CYAN;
    }
  }, [type]);

  const particleCount = type === "perfect" ? 30 : type === "success" ? 20 : 10;
  const ringRadius = type === "perfect" ? 1.5 : 1.0;

  // Track completion to prevent multiple calls
  const completedRef = useRef(false);

  // Handle effect completion (only once)
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setShowEffect(false);
    onComplete?.();
  }, [onComplete]);

  // Auto-complete after duration
  useEffect(() => {
    if (visible && showEffect) {
      timeoutRef.current = setTimeout(handleComplete, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, showEffect, duration, handleComplete]);

  if (!showEffect) return null;

  return (
    <group data-testid={`hit-feedback-${type}`}>
      {/* Particle burst */}
      <ImpactParticles
        position={position}
        color={effectColor}
        count={particleCount}
      />

      {/* Expanding ring */}
      <RingEffect
        position={position}
        color={effectColor}
        maxRadius={ringRadius}
      />

      {/* Floating damage number */}
      {damage !== undefined && type !== "miss" && (
        <DamageNumber
          position={position}
          damage={damage}
          type={type === "perfect" ? "perfect" : "normal"}
          isMobile={isMobile}
          onComplete={handleComplete}
        />
      )}

      {/* Miss indicator */}
      {type === "miss" && (
        <DamageNumber
          position={position}
          damage={0}
          type="miss"
          isMobile={isMobile}
          onComplete={handleComplete}
        />
      )}
    </group>
  );
};

export default HitFeedbackEffect3D;
