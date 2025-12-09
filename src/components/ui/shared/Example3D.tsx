/**
 * Example usage of shared HUD components with Three.js
 * 
 * This example demonstrates how to integrate HealthBar3D, StaminaBar3D,
 * and StatusIndicator3D with a Three.js scene using Html overlays.
 * 
 * @module components/ui/shared/Example3D
 * @example
 */

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, PerspectiveCamera } from "@react-three/drei";
import { HealthBar3D, StaminaBar3D, StatusIndicator3D } from "./index";
import { KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";

/**
 * Example 3D scene with HUD overlay
 * 
 * Shows how to use shared HUD components in a Three.js environment:
 * - HealthBar3D for player health
 * - StaminaBar3D for player stamina
 * - StatusIndicator3D for Ki/Energy display
 */
export const Example3DScene: React.FC = () => {
  // Example state
  const [health, setHealth] = useState(85);
  const [stamina, setStamina] = useState(45);
  const [ki, setKi] = useState(75);

  return (
    <Canvas
      style={{ width: "100%", height: "600px" }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      {/* 3D Scene lighting */}
      <ambientLight intensity={0.5} color={KOREAN_COLORS.PRIMARY_CYAN} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
      />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />

      {/* Example 3D mesh */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          emissive={KOREAN_COLORS.PRIMARY_CYAN}
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* HUD Overlay using Html */}
      <Html fullscreen>
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            pointerEvents: "auto",
          }}
        >
          {/* Player Health Bar */}
          <HealthBar3D
            current={health}
            max={100}
            playerId="player1"
            variant="player"
            showText={true}
            isMobile={false}
            screenWidth={1200}
          />

          {/* Player Stamina Bar */}
          <StaminaBar3D
            current={stamina}
            max={50}
            playerId="player1"
            variant="player"
            showText={true}
            isMobile={false}
            screenWidth={1200}
          />

          {/* Ki Status Indicator */}
          <StatusIndicator3D
            type="ki"
            labelKorean="기력"
            labelEnglish="Ki Energy"
            value={ki}
            maxValue={100}
            variant="player"
            isMobile={false}
            screenWidth={1200}
          />
        </div>

        {/* Demo Controls */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "10px",
            padding: "15px",
            backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
            borderRadius: "8px",
            border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1)}`,
          }}
        >
          <button
            onClick={() => setHealth(Math.max(0, health - 10))}
            style={{
              padding: "8px 16px",
              backgroundColor: hexToRgbaString(KOREAN_COLORS.NEGATIVE_RED, 1),
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "Noto Sans KR",
            }}
          >
            -10 Health
          </button>
          <button
            onClick={() => setStamina(Math.max(0, stamina - 5))}
            style={{
              padding: "8px 16px",
              backgroundColor: hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 1),
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "Noto Sans KR",
            }}
          >
            -5 Stamina
          </button>
          <button
            onClick={() => setKi(Math.max(0, ki - 10))}
            style={{
              padding: "8px 16px",
              backgroundColor: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
              color: "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "Noto Sans KR",
            }}
          >
            -10 Ki
          </button>
          <button
            onClick={() => {
              setHealth(100);
              setStamina(50);
              setKi(100);
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: hexToRgbaString(KOREAN_COLORS.POSITIVE_GREEN, 1),
              color: "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "Noto Sans KR",
            }}
          >
            Reset All
          </button>
        </div>
      </Html>
    </Canvas>
  );
};

export default Example3DScene;
