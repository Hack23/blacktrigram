/**
 * Hello3D - Test component for Three.js infrastructure
 *
 * This component verifies that Three.js, @react-three/fiber, and @react-three/drei
 * are properly installed and configured. It renders a simple 3D scene with:
 * - A pink rotating cube (Korean accent color)
 * - Orbit controls for interaction
 * - Ambient and directional lighting
 *
 * @module components/test
 */

import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import type { Mesh } from "three";
import { KOREAN_COLORS } from "@/types/constants";

/**
 * Props for the RotatingBox component
 */
interface RotatingBoxProps {
  readonly color: number;
}

/**
 * A rotating 3D box component that demonstrates Three.js animation
 */
const RotatingBox: React.FC<RotatingBoxProps> = ({ color }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} data-testid="rotating-cube">
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

/**
 * Props for the Hello3D component
 */
export interface Hello3DProps {
  readonly width?: number;
  readonly height?: number;
  readonly color?: number;
}

/**
 * Hello3D - Minimal test component for Three.js infrastructure
 *
 * Renders a simple 3D scene to verify:
 * - @react-three/fiber Canvas integration
 * - @react-three/drei OrbitControls functionality
 * - Three.js core rendering
 * - Korean theming with KOREAN_COLORS
 *
 * @example
 * ```tsx
 * <Hello3D width={800} height={600} color={KOREAN_COLORS.ACCENT_GOLD} />
 * ```
 */
export const Hello3D: React.FC<Hello3DProps> = ({
  width = 800,
  height = 600,
  color = KOREAN_COLORS.PRIMARY_CYAN,
}) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "#1a1a1a",
      }}
      data-testid="hello-threejs-container"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        data-testid="threejs-canvas"
      >
        {/* Ambient light for overall scene illumination */}
        <ambientLight intensity={0.5} />

        {/* Directional light for depth and shadows */}
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Rotating cube with Korean theming */}
        <RotatingBox color={color} />

        {/* Interactive orbit controls */}
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
};

Hello3D.displayName = "Hello3D";
