/**
 * GamepadVisualization3D - 3D gamepad visualization with button labels
 *
 * Renders a simplified 3D gamepad shape with colored buttons and
 * bilingual Korean-English labels for each button.
 *
 * @module components/screens/controls/components
 */

import { Html } from "@react-three/drei";
import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { GAMEPAD_BUTTONS } from "../constants/ControlsConstants";

/**
 * Props for GamepadVisualization3D component
 */
export interface GamepadVisualization3DProps {
  /** Whether on mobile device (affects sizing) */
  readonly isMobile: boolean;
}

/**
 * GamepadVisualization3D Component
 *
 * 3D visualization of a gamepad with labeled buttons.
 * Displays simplified gamepad shape with colored circles for buttons.
 *
 * @example
 * ```tsx
 * <Canvas>
 *   <GamepadVisualization3D isMobile={false} />
 * </Canvas>
 * ```
 */
export const GamepadVisualization3D: React.FC<GamepadVisualization3DProps> = ({
  isMobile,
}) => {
  // Gamepad body material
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: KOREAN_COLORS.UI_STEEL_GRAY_DARK,
        metalness: 0.7,
        roughness: 0.3,
        transparent: true,
        opacity: 0.95,
      }),
    [],
  );

  // Cleanup material on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      bodyMaterial.dispose();
    };
  }, [bodyMaterial]);

  // Button positions (simplified layout)
  const buttonPositions = useMemo(
    () => ({
      // Face buttons (right side)
      0: { x: 1.5, y: 0.5, z: 0.15 }, // A
      1: { x: 2.0, y: 0.0, z: 0.15 }, // B
      2: { x: 1.0, y: 0.0, z: 0.15 }, // X
      3: { x: 1.5, y: -0.5, z: 0.15 }, // Y
      // Shoulder buttons (top)
      4: { x: -2.0, y: 1.0, z: 0.2 }, // LB
      5: { x: 2.0, y: 1.0, z: 0.2 }, // RB
      6: { x: -2.0, y: 1.4, z: 0.2 }, // LT
      7: { x: 2.0, y: 1.4, z: 0.2 }, // RT
      // Menu buttons (center)
      8: { x: -0.6, y: 0.0, z: 0.15 }, // Back
      9: { x: 0.6, y: 0.0, z: 0.15 }, // Start
      // Stick buttons (lower)
      10: { x: -1.5, y: -0.8, z: 0.15 }, // L3
      11: { x: 1.5, y: -0.8, z: 0.15 }, // R3
    }),
    [],
  );

  return (
    <group position={[0, 0, 0]} data-testid="gamepad-visualization">
      {/* Ambient light */}
      <ambientLight intensity={0.5} />

      {/* Directional lights */}
      <directionalLight position={[3, 3, 3]} intensity={0.8} />
      <directionalLight position={[-3, 2, 2]} intensity={0.4} />

      {/* Left body section (rounded rectangle) */}
      <mesh position={[-1.5, 0, 0]}>
        <boxGeometry args={[2.5, 2.5, 0.4]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* Right body section (rounded rectangle) */}
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[2.5, 2.5, 0.4]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* Center connector */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 1.5, 0.35]} />
        <primitive object={bodyMaterial} attach="material" />
      </mesh>

      {/* Render all buttons */}
      {GAMEPAD_BUTTONS.map((button) => {
        const pos =
          buttonPositions[button.index as keyof typeof buttonPositions];
        if (!pos) return null;

        return (
          <group key={button.index} position={[pos.x, pos.y, pos.z]}>
            {/* Button sphere */}
            <mesh>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial
                color={button.color}
                emissive={button.color}
                emissiveIntensity={1.5}
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>

            {/* Button label overlay */}
            <Html
              position={[0, 0.3, 0]}
              center
              distanceFactor={isMobile ? 3 : 2.5}
              style={{ pointerEvents: "none" }}
            >
              <div
                style={{
                  fontFamily: FONT_FAMILY.KOREAN,
                  fontSize: isMobile ? "10px" : "11px",
                  fontWeight: "bold",
                  color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY),
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  background: hexToRgbaString(
                    KOREAN_COLORS.UI_BACKGROUND_DARK,
                    0.8,
                  ),
                  padding: "4px 6px",
                  borderRadius: "4px",
                  border: `1px solid ${hexToRgbaString(button.color, 0.6)}`,
                  boxShadow: `0 0 8px ${hexToRgbaString(button.color, 0.4)}`,
                }}
              >
                {/* Button name */}
                <div
                  style={{
                    color: hexToRgbaString(button.color),
                    marginBottom: "2px",
                  }}
                >
                  {button.korean} | {button.english}
                </div>
                {/* Action */}
                <div
                  style={{
                    fontSize: isMobile ? "9px" : "10px",
                    color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY),
                  }}
                >
                  {button.actionKorean} | {button.action}
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

export default GamepadVisualization3D;
