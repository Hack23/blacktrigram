/**
 * TrainingHitEffects3D - Optimized particle effects using InstancedMesh
 * 
 * Provides visual feedback for successful and missed strikes
 * Uses InstancedMesh for better performance with many particles
 */

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../types/constants";

/**
 * Props for TrainingHitEffects3D component
 */
export interface TrainingHitEffects3DProps {
  /** Position where the hit occurred */
  readonly position: [number, number, number];
  /** Type of hit effect */
  readonly type: "success" | "perfect" | "miss";
  /** Whether to show the effect */
  readonly visible: boolean;
  /** Callback when effect completes */
  readonly onComplete?: () => void;
}

/**
 * Single particle in the effect
 */
interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
}

/**
 * Get color based on hit type
 */
const getEffectColor = (type: "success" | "perfect" | "miss"): number => {
  switch (type) {
    case "perfect":
      return KOREAN_COLORS.ACCENT_GOLD;
    case "success":
      return KOREAN_COLORS.PRIMARY_CYAN;
    case "miss":
      return KOREAN_COLORS.UI_GRAY;
    default:
      return KOREAN_COLORS.PRIMARY_CYAN;
  }
};

/**
 * Get particle count based on hit type
 */
const getParticleCount = (type: "success" | "perfect" | "miss"): number => {
  switch (type) {
    case "perfect":
      return 30;
    case "success":
      return 20;
    case "miss":
      return 10;
    default:
      return 15;
  }
};

/**
 * TrainingHitEffects3D Component
 * Optimized particle burst effect using InstancedMesh for better performance
 */
export const TrainingHitEffects3D: React.FC<TrainingHitEffects3DProps> = ({
  position,
  type,
  visible,
  onComplete,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);
  
  // Reusable objects to avoid allocations in animation loop
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempVelocity = useMemo(() => new THREE.Vector3(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const tempScaleVector = useMemo(() => new THREE.Vector3(), []);

  const particleCount = useMemo(() => getParticleCount(type), [type]);
  const color = useMemo(() => new THREE.Color(getEffectColor(type)), [type]);

  // Initialize particles when effect becomes visible
  useEffect(() => {
    if (visible && !isActive) {
      setIsActive(true);
      
      particlesRef.current = Array.from({ length: particleCount }, () => {
        // Random direction in sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = type === "perfect" ? 5 : type === "success" ? 3 : 2;
        
        return {
          position: new THREE.Vector3(0, 0, 0),
          velocity: new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta) * speed,
            Math.sin(phi) * Math.sin(theta) * speed,
            Math.cos(phi) * speed
          ),
          life: 1.0,
          maxLife: 1.0,
          size: type === "perfect" ? 0.15 : 0.1,
        };
      });
    }
  }, [visible, type, isActive, particleCount]);

  // Animate particles
  useFrame((_, delta) => {
    const mesh = instancedMeshRef.current;
    if (!isActive || !mesh || particlesRef.current.length === 0) return;

    let allDead = true;

    particlesRef.current.forEach((particle, index) => {
      if (particle.life > 0) {
        allDead = false;
        
        // Update position using temp vector to avoid allocation
        tempVelocity.copy(particle.velocity).multiplyScalar(delta);
        particle.position.add(tempVelocity);
        
        // Apply gravity
        particle.velocity.y -= 9.8 * delta;
        
        // Decay life
        particle.life -= delta * 1.5;
        
        // Update instance matrix
        const opacity = Math.max(0, particle.life / particle.maxLife);
        const scale = particle.size * (0.5 + opacity * 0.5);
        
        tempMatrix.identity();
        tempMatrix.setPosition(particle.position);
        tempScaleVector.set(scale, scale, scale);
        tempMatrix.scale(tempScaleVector);
        mesh.setMatrixAt(index, tempMatrix);
        
        // Update color with opacity
        tempColor.copy(color);
        mesh.setColorAt(index, tempColor);
      } else {
        // Hide dead particles by scaling to 0
        tempMatrix.identity();
        tempScaleVector.set(0, 0, 0);
        tempMatrix.scale(tempScaleVector);
        mesh.setMatrixAt(index, tempMatrix);
      }
    });

    // Mark instances as needing update
    if (mesh.instanceMatrix) {
      mesh.instanceMatrix.needsUpdate = true;
    }
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }

    if (allDead) {
      setIsActive(false);
      particlesRef.current = [];
      onComplete?.();
    }
  });

  // Shared geometry and material
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      }),
    []
  );

  // Cleanup
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  if (!isActive || particlesRef.current.length === 0) {
    return null;
  }

  return (
    <group ref={groupRef} position={position}>
      {/* InstancedMesh for all particles - single draw call */}
      <instancedMesh
        ref={instancedMeshRef}
        args={[geometry, material, particleCount]}
        frustumCulled={false}
      />
      
      {/* Central flash for perfect hits */}
      {type === "perfect" && (
        <mesh scale={2}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color={KOREAN_COLORS.ACCENT_GOLD}
            transparent
            opacity={isActive ? 0.6 : 0}
            emissive={KOREAN_COLORS.ACCENT_GOLD}
            emissiveIntensity={2}
          />
        </mesh>
      )}
    </group>
  );
};

export default TrainingHitEffects3D;
