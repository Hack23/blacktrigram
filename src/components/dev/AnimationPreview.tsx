/**
 * Animation Preview Component for Visual Testing
 * 
 * Developer tool for testing and previewing attack animations.
 * Displays all 8 attack animations with playback controls.
 * 
 * @module components/dev/AnimationPreview
 * @category Development Tools
 * @korean 애니메이션미리보기
 */

import React, { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, PerspectiveCamera, Grid, OrbitControls } from "@react-three/drei";
import { ATTACK_ANIMATIONS } from "../../systems/animation/AttackAnimations";
import { KOREAN_COLORS } from "../../types/constants";
import { toHexColor } from "../../utils/colorHelpers";

/**
 * Props for AnimationPreview component
 */
export interface AnimationPreviewProps {
  /** Width of the preview canvas */
  readonly width?: number;
  /** Height of the preview canvas */
  readonly height?: number;
}

/**
 * Animation Preview Component
 * 
 * Visual testing tool for attack animations.
 * Shows list of all animations with playback controls.
 * 
 * Features:
 * - Preview all 8 attack animations
 * - Play/pause/loop controls
 * - Speed adjustment (0.5x - 2x)
 * - Korean and English animation names
 * - Grid floor for spatial reference
 * - Orbit camera controls
 * 
 * @example
 * \`\`\`tsx
 * <AnimationPreview width={800} height={600} />
 * \`\`\`
 * 
 * @public
 * @korean 애니메이션미리보기컴포넌트
 */
export const AnimationPreview: React.FC<AnimationPreviewProps> = ({
  width = 1200,
  height = 800,
}) => {
  const [selectedAnimation, setSelectedAnimation] = useState<string>("jab");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [loop, setLoop] = useState(true);

  // Get list of attack animations
  const attackAnimations = Array.from(ATTACK_ANIMATIONS.entries())
    .filter(([name]) => 
      ["jab", "cross", "front_kick", "roundhouse_kick", "side_kick", 
       "elbow_strike", "elbow_uppercut", "knee_strike"].includes(name)
    );

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleSelectAnimation = useCallback((animName: string) => {
    setSelectedAnimation(animName);
    setIsPlaying(false);
  }, []);

  const currentAnim = ATTACK_ANIMATIONS.get(selectedAnimation);

  const cyanHex = toHexColor(KOREAN_COLORS.PRIMARY_CYAN).substring(1);
  const goldHex = toHexColor(KOREAN_COLORS.ACCENT_GOLD).substring(1);
  const darkHex = toHexColor(KOREAN_COLORS.UI_BACKGROUND_DARK).substring(1);

  return (
    <div style={{ width, height, position: "relative" }}>
      <Canvas style={{ width, height }}>
        <color attach="background" args={[KOREAN_COLORS.UI_BACKGROUND_DARK]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, 5, -5]} intensity={0.3} />

        {/* Camera */}
        <PerspectiveCamera makeDefault position={[3, 2, 5]} />
        <OrbitControls />

        {/* Grid floor */}
        <Grid
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#444444"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#666666"
          fadeDistance={20}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />

        {/* Character placeholder */}
        <mesh position={[0, 1, 0]} castShadow>
          <capsuleGeometry args={[0.3, 1.2, 8, 16]} />
          <meshStandardMaterial
            color={KOREAN_COLORS.PRIMARY_CYAN}
            emissive={KOREAN_COLORS.PRIMARY_CYAN}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* UI Overlay */}
        <Html fullscreen>
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              backgroundColor: `#${darkHex}dd`,
              border: `2px solid #${cyanHex}`,
              borderRadius: "8px",
              padding: "20px",
              color: "#ffffff",
              fontFamily: "'Nanum Gothic', 'Noto Sans KR', sans-serif",
              maxWidth: "350px",
            }}
          >
            <h2 style={{ margin: "0 0 15px 0", color: `#${goldHex}` }}>
              Animation Preview | 애니메이션 미리보기
            </h2>

            {/* Animation List */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                Animations (8 총 공격 애니메이션)
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {attackAnimations.map(([name, anim]) => (
                  <button
                    key={name}
                    onClick={() => handleSelectAnimation(name)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: selectedAnimation === name ? `#${cyanHex}` : "#333333",
                      color: "#ffffff",
                      border: "1px solid #555555",
                      borderRadius: "4px",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{anim.koreanName}</div>
                    <div style={{ fontSize: "12px", opacity: 0.8 }}>
                      {name} - {Math.round(anim.duration * 1000)}ms
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Animation Info */}
            {currentAnim && (
              <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#222222", borderRadius: "4px" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                  Current: {currentAnim.koreanName}
                </h3>
                <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  <div>Name: {selectedAnimation}</div>
                  <div>Duration: {Math.round(currentAnim.duration * 1000)}ms</div>
                  <div>Frames: {Math.round(currentAnim.duration * 60)} @ 60fps</div>
                  <div>Keyframes: {currentAnim.keyframes.length}</div>
                  <div>Type: {currentAnim.type}</div>
                  <div>Loop: {currentAnim.loop ? "Yes" : "No"}</div>
                </div>
              </div>
            )}

            {/* Playback Controls */}
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                Playback Controls
              </h3>
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <button
                  onClick={handlePlay}
                  disabled={isPlaying}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: isPlaying ? "#555555" : `#${goldHex}`,
                    color: "#000000",
                    border: "none",
                    borderRadius: "4px",
                    cursor: isPlaying ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ▶ Play
                </button>
                <button
                  onClick={handlePause}
                  disabled={!isPlaying}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: !isPlaying ? "#555555" : "#ff4444",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: !isPlaying ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ⏸ Pause
                </button>
              </div>

              {/* Speed Control */}
              <div style={{ marginTop: "15px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>
                  Speed: {speed.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Loop Control */}
              <div style={{ marginTop: "15px" }}>
                <label style={{ display: "flex", alignItems: "center", fontSize: "14px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={loop}
                    onChange={(e) => setLoop(e.target.checked)}
                    style={{ marginRight: "8px" }}
                  />
                  Loop Animation
                </label>
              </div>
            </div>

            {/* Instructions */}
            <div style={{ fontSize: "12px", opacity: 0.7, lineHeight: "1.5" }}>
              <strong>Controls:</strong>
              <ul style={{ margin: "5px 0", paddingLeft: "20px" }}>
                <li>Mouse drag: Rotate view</li>
                <li>Mouse wheel: Zoom</li>
                <li>Select animation from list to preview</li>
              </ul>
            </div>
          </div>
        </Html>
      </Canvas>

      {/* Status Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#000000dd",
          padding: "10px 20px",
          color: "#ffffff",
          fontSize: "12px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>Status: {isPlaying ? "Playing" : "Paused"}</div>
        <div>Animation Library: 8 Attack Animations</div>
        <div>Dev Tool v1.0</div>
      </div>
    </div>
  );
};

export default AnimationPreview;
