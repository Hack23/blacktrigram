/**
 * HitFeedbackEffect3D - Visual hit confirmation with damage numbers
 * 
 * Provides particle effects, color flashes, and floating damage numbers
 * for training hit feedback
 */

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const velocitiesRef = useRef<Float32Array>(new Float32Array(count * 3));

  // Initialize particle positions and velocities
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Start at center
      pos[i3] = 0;
      pos[i3 + 1] = 0;
      pos[i3 + 2] = 0;

      // Random outward velocities
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const speed = 0.5 + Math.random() * 1.5;

      vel[i3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i3 + 1] = Math.cos(phi) * speed + 1; // Upward bias
      vel[i3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
    }

    return pos;
  }, [count]);

  // Animate particles
  useFrame((_, delta) => {
    if (!pointsRef.current) return;

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
  const startTime = useRef(Date.now());

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
  const startTime = useRef(Date.now());

  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = Math.min(elapsed / 1.5, 1); // 1.5 second duration

    // Float upward
    setOffset(progress * 1);

    // Fade out
    setOpacity(1 - progress);

    // Complete when done
    if (progress >= 1 && onComplete) {
      onComplete();
    }
  });

  const color = type === "perfect" ? "#ffd700" : type === "normal" ? "#00ffff" : "#ff4444";
  const text = type === "miss" ? "빗나감 | MISS" : `${damage}`;

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

  // Handle effect completion
  const handleComplete = useCallback(() => {
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
