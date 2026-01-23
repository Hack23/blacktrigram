import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";

/**
 * Defeat Animation 3D Component
 * Displays somber 3D particle effects for defeat screen
 * Uses blue/cyan tones to contrast with gold victory effects
 * Optimized for 60fps performance with object reuse
 */
export const DefeatAnimation3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const spiralRef = useRef<THREE.Group>(null);

  // Reusable objects for animation calculations to avoid per-frame allocations
  // These are reused across all animation frames for scale and position updates
  const [reusableScale] = useState(() => new THREE.Vector3());
  const [reusablePosition] = useState(() => new THREE.Vector3());

  // Create defeat particles - use useState with lazy initializer
  const [particlePositions] = useState(() => {
    const count = 100; // Fewer particles than victory for subdued effect
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi) - 1; // Lower starting position
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    return positions;
  });

  // Animate defeat effects with slower, descending motion - optimized for 60fps
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Slow rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.15; // Slower than victory
    }

    // Fade particles downward - use reusable objects
    if (particlesRef.current) {
      const scale = 1 + Math.sin(time * 1.5) * 0.1; // Subtle pulsing
      reusableScale.setScalar(scale);
      particlesRef.current.scale.copy(reusableScale);
      
      // Slowly descend
      const yPos = Math.sin(time * 0.5) * 0.3 - 0.2;
      reusablePosition.set(0, yPos, 0);
      particlesRef.current.position.copy(reusablePosition);
    }

    // Spiral effect - slower, descending
    if (spiralRef.current) {
      spiralRef.current.rotation.y = -time * 0.2; // Counter-rotation
      spiralRef.current.rotation.z = Math.sin(time * 0.3) * 0.2;
    }
  });

  // Cleanup Three.js resources on unmount
  useEffect(() => {
    return () => {
      // Dispose geometries and materials to prevent memory leaks
      if (particlesRef.current) {
        particlesRef.current.geometry?.dispose();
        if (particlesRef.current.material) {
          (particlesRef.current.material as THREE.Material).dispose();
        }
      }
      if (spiralRef.current) {
        spiralRef.current.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (child.material) {
              (child.material as THREE.Material).dispose();
            }
          }
        });
      }
      // Additionally iterate over all group children to catch meshes/points without explicit refs
      if (groupRef.current) {
        groupRef.current.children.forEach((child) => {
          // Skip already-handled refs
          if (child === particlesRef.current || child === spiralRef.current) {
            return;
          }

          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (child.material) {
              (child.material as THREE.Material).dispose();
            }
          } else if (child instanceof THREE.Points) {
            child.geometry?.dispose();
            if (child.material) {
              (child.material as THREE.Material).dispose();
            }
          }
        });
      }
    };
  }, []);

  return (
    <group
      ref={groupRef}
      position={[0, 1, 0]}
      data-testid="defeat-animation-3d"
    >
      {/* Defeat particles - blue/cyan theme */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            itemSize={3}
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color={new THREE.Color(KOREAN_COLORS.ACCENT_BLUE)}
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Descending spiral rings */}
      <group ref={spiralRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.03, 12, 64]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.PRIMARY_CYAN}
            transparent
            opacity={0.4}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]} position={[0, -0.3, 0]}>
          <torusGeometry args={[2, 0.03, 12, 64]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.ACCENT_BLUE}
            transparent
            opacity={0.3}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, Math.PI / 2, 0]} position={[0, -0.6, 0]}>
          <torusGeometry args={[2.5, 0.03, 12, 64]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.PRIMARY_CYAN}
            transparent
            opacity={0.2}
          />
        </mesh>
      </group>

      {/* Central dimmed sphere */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.ACCENT_BLUE}
          emissive={KOREAN_COLORS.ACCENT_BLUE}
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Outer faint glow */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point light for subdued glow effect */}
      <pointLight
        position={[0, 0, 0]}
        intensity={1.5}
        distance={8}
        color={KOREAN_COLORS.ACCENT_BLUE}
      />
    </group>
  );
};
