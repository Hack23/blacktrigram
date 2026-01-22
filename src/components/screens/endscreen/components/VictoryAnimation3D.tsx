import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";

/**
 * Victory Animation 3D Component
 * Displays celebratory 3D particle effects for victory screen
 * Enhanced with additional Korean symbolism and dynamic effects
 */
export const VictoryAnimation3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const symbolsRef = useRef<THREE.Group>(null);

  // Create victory particles - use useState with lazy initializer
  const [particlePositions] = useState(() => {
    const count = 200; // Increased from 150 for more dramatic effect
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

    return positions;
  });

  // Create secondary particle layer for depth
  const [secondaryParticles] = useState(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;

      positions[i3] = radius * Math.cos(theta);
      positions[i3 + 1] = Math.random() * 4 - 2;
      positions[i3 + 2] = radius * Math.sin(theta);
    }

    return positions;
  });

  // Animate victory effects
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate entire group
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.3;
    }

    // Pulse particles with wave effect
    if (particlesRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.2;
      particlesRef.current.scale.setScalar(scale);
      
      // Rising motion
      particlesRef.current.position.y = Math.sin(time * 0.8) * 0.5;
    }

    // Rotate rings at different speeds
    if (ringsRef.current) {
      ringsRef.current.rotation.x = time * 0.5;
      ringsRef.current.rotation.z = time * 0.3;
    }

    // Rotate Korean symbols
    if (symbolsRef.current) {
      symbolsRef.current.rotation.y = -time * 0.4;
      symbolsRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 2, 0]}
      data-testid="victory-animation-3d"
    >
      {/* Primary victory particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
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

      {/* Secondary particle layer */}
      <points position={[0, 1, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={50}
            itemSize={3}
            args={[secondaryParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color={new THREE.Color(KOREAN_COLORS.PRIMARY_CYAN)}
          transparent
          opacity={0.6}
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

      {/* Korean symbol elements - octagonal shape representing 팔괘 (eight trigrams) */}
      <group ref={symbolsRef}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 4;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius,
              ]}
              rotation={[0, angle + Math.PI / 2, 0]}
            >
              <boxGeometry args={[0.8, 0.1, 0.1]} />
              <meshStandardMaterial
                color={KOREAN_COLORS.ACCENT_GOLD}
                emissive={KOREAN_COLORS.ACCENT_GOLD}
                emissiveIntensity={0.5}
                transparent
                opacity={0.7}
              />
            </mesh>
          );
        })}
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

      {/* Additional inner glow layer */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color={KOREAN_COLORS.ACCENT_GOLD}
          transparent
          opacity={0.3}
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

      {/* Secondary accent lights */}
      <pointLight
        position={[2, 2, 0]}
        intensity={1.5}
        distance={6}
        color={KOREAN_COLORS.PRIMARY_CYAN}
      />
      <pointLight
        position={[-2, 2, 0]}
        intensity={1.5}
        distance={6}
        color={KOREAN_COLORS.PRIMARY_CYAN}
      />
    </group>
  );
};
