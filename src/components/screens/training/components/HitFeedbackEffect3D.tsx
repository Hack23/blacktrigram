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
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { ThreeObjectPools } from "../../../../utils/threeObjectPool";

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

  const velocitiesRef = useRef<Float32Array | null>(null);

  const [initialPosition] = useState(position);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    const seed =
      initialPosition[0] + initialPosition[1] * 10 + initialPosition[2] * 100;

    function seededRandom(index: number): number {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    }

    const tempVel = ThreeObjectPools.vector3.acquire();
    
    try {
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        pos[i3] = 0;
        pos[i3 + 1] = 0;
        pos[i3 + 2] = 0;

        const theta = seededRandom(i * 3) * Math.PI * 2;
        const phi = seededRandom(i * 3 + 1) * Math.PI;
        const speed = 0.5 + seededRandom(i * 3 + 2) * 1.5;

        tempVel.set(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        );
        tempVel.normalize().multiplyScalar(speed);
        
        vel[i3] = tempVel.x;
        vel[i3 + 1] = tempVel.y + 1;
        vel[i3 + 2] = tempVel.z;
      }
    } finally {
      ThreeObjectPools.vector3.release(tempVel);
    }

    return { positions: pos, velocities: vel };
  }, [count, initialPosition]); // initialPosition is captured at mount and won't change

  useEffect(() => {
    velocitiesRef.current = velocities;
  }, [velocities]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !velocitiesRef.current) return;

    const attr = pointsRef.current.geometry.attributes.position;
    const array = attr.array as Float32Array;
    const vel = velocitiesRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      array[i3] += vel[i3] * delta * 10;
      array[i3 + 1] += vel[i3 + 1] * delta * 10;
      array[i3 + 2] += vel[i3 + 2] * delta * 10;

      vel[i3 + 1] -= 9.8 * delta;

      if (array[i3 + 1] < -2) {
        array[i3 + 1] = -2;
      }
    }

    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={color}
        transparent
        opacity={1.0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
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

  useEffect(() => {
    if (startTime.current === 0) {
      startTime.current = Date.now();
    }
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = Math.min(elapsed / 0.5, 1); // 0.5 second duration

    const radius = progress * maxRadius;
    const tempScale = ThreeObjectPools.vector3.acquire();
    try {
      tempScale.setScalar(radius);
      meshRef.current.scale.copy(tempScale);
    } finally {
      ThreeObjectPools.vector3.release(tempScale);
    }

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

  useEffect(() => {
    if (startTime.current === 0) {
      startTime.current = Date.now();
    }
  }, []);

  useFrame(() => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = Math.min(elapsed / 1.5, 1); // 1.5 second duration

    setOffset(progress * 1);

    setOpacity(1 - progress);

    if (progress >= 1 && !completedRef.current && onComplete) {
      completedRef.current = true;
      onComplete();
    }
  });

  const color =
    type === "perfect" ? "#ffd700" : type === "normal" ? "#00ffff" : "#ff4444";
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const particleCount = useMemo(() => {
    const isPerfect = type === "perfect";
    const isSuccess = type === "success";

    if (isMobile) {
      return isPerfect ? 30 : isSuccess ? 20 : 10;
    }

    return isPerfect ? 80 : isSuccess ? 50 : 25;
  }, [type, isMobile]);
  const ringRadius = type === "perfect" ? 1.5 : 1.0;

  const completedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setShowEffect(false);
    onComplete?.();
  }, [onComplete]);

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
    <group name={`hit-feedback-${type}`}>
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
