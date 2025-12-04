import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../types/constants";

/**
 * Victory Animation 3D Component
 * Displays celebratory 3D particle effects for victory screen
 */
export const VictoryAnimation3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);

  // Create victory particles - use lazy initialization for random values
  const particleDataRef = useRef<Float32Array | null>(null);

  if (!particleDataRef.current) {
    const count = 150;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi);
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    particleDataRef.current = positions;
  }

  const particlePositions = particleDataRef.current;

  // Animate victory effects
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate entire group
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.3;
    }

    // Pulse particles
    if (particlesRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.2;
      particlesRef.current.scale.setScalar(scale);
    }

    // Rotate rings
    if (ringsRef.current) {
      ringsRef.current.rotation.x = time * 0.5;
      ringsRef.current.rotation.z = time * 0.3;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 2, 0]}
      data-testid="victory-animation-3d"
    >
      {/* Victory particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={150}
            itemSize={3}
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          color={new THREE.Color(KOREAN_COLORS.ACCENT_GOLD)}
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Rotating rings */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2, 0.05, 16, 100]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.PRIMARY_CYAN}
            transparent
            opacity={0.6}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
          <torusGeometry args={[2.5, 0.05, 16, 100]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.ACCENT_GOLD}
            transparent
            opacity={0.4}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, Math.PI / 2, 0]}>
          <torusGeometry args={[3, 0.05, 16, 100]} />
          <meshBasicMaterial
            color={KOREAN_COLORS.PRIMARY_CYAN}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>

      {/* Central glow sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.ACCENT_GOLD}
          emissive={KOREAN_COLORS.ACCENT_GOLD}
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point light for glow effect */}
      <pointLight
        position={[0, 0, 0]}
        intensity={3}
        distance={10}
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
    </group>
  );
};
