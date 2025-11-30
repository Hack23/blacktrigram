import { Html, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useAudio } from "../../audio/AudioProvider";
import { useWebGLContextLossHandler } from "../../hooks/useWebGLContextLossHandler";
import { PlayerState } from "../../systems";
import { MatchStatistics } from "../../systems/combat";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";
import { VolumeControl } from "../ui/VolumeControl";
import { MatchStatisticsDisplay } from "./components/MatchStatisticsDisplay";
import { VictoryAnimation3D } from "./components/VictoryAnimation3D";

export interface EndScreen3DProps {
  readonly winner: PlayerState;
  readonly matchStats: MatchStatistics;
  readonly onReturnToMenu: () => void;
  readonly onRematch?: () => void;
  readonly onViewReplay?: () => void;
  readonly width?: number;
  readonly height?: number;
}

/**
 * Helper to convert hex color to CSS string
 */
const toCssColor = (hex: number): string => hexToRgbaString(hex, 1);

/**
 * Three.js-based End Screen Component
 * Displays victory/defeat screen with match statistics and 3D effects
 */
const BackgroundParticles3D: React.FC<{ color: number }> = ({ color }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const count = 100;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 40;
      pos[i3 + 1] = (Math.random() - 0.5) * 30;
      pos[i3 + 2] = (Math.random() - 0.5) * 20;

      vel[i3] = (Math.random() - 0.5) * 0.5;
      vel[i3 + 1] = Math.random() * 0.3;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((_state, delta) => {
    if (!pointsRef.current) return;

    const attr = pointsRef.current.geometry.attributes.position;
    const array = attr.array as Float32Array;

    for (let i = 0; i < 100; i++) {
      const i3 = i * 3;

      array[i3] += velocities[i3] * delta;
      array[i3 + 1] += velocities[i3 + 1] * delta;
      array[i3 + 2] += velocities[i3 + 2] * delta;

      // Wrap around
      if (array[i3 + 1] > 15) {
        array[i3 + 1] = -15;
      }
      if (Math.abs(array[i3]) > 20) {
        array[i3] = -array[i3];
      }
      if (Math.abs(array[i3 + 2]) > 10) {
        array[i3 + 2] = -array[i3 + 2];
      }
    }

    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={new THREE.Color(color)}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

/**
 * Main Three.js background scene
 */
const EndScreenBackground3D: React.FC<{ isVictory: boolean }> = ({
  isVictory,
}) => {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.0005;
    }
  });

  const primaryColor = isVictory
    ? KOREAN_COLORS.ACCENT_GOLD
    : KOREAN_COLORS.ACCENT_RED;

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color={KOREAN_COLORS.PRIMARY_CYAN} />

      {/* Directional lights */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={isVictory ? 1.2 : 0.8}
        color={primaryColor}
      />
      <directionalLight
        position={[-10, 10, -5]}
        intensity={0.5}
        color={KOREAN_COLORS.PRIMARY_CYAN}
      />

      {/* Point light for dramatic effect */}
      <pointLight
        position={[0, 5, 0]}
        intensity={isVictory ? 2 : 1}
        distance={30}
        color={primaryColor}
      />

      {/* Grid for cyberpunk aesthetic */}
      <gridHelper
        ref={gridRef}
        args={[40, 40, primaryColor, KOREAN_COLORS.UI_BACKGROUND_MEDIUM]}
        position={[0, -5, 0]}
      />

      {/* Background particles */}
      <BackgroundParticles3D color={primaryColor} />

      {/* Victory animation if winner */}
      {isVictory && <VictoryAnimation3D />}
    </>
  );
};

/**
 * EndScreen3D Component
 * Three.js-based end screen with Korean theming
 */
export const EndScreen3D: React.FC<EndScreen3DProps> = ({
  winner,
  matchStats,
  onReturnToMenu,
  onRematch,
  onViewReplay,
  width = 1920,
  height = 1080,
}) => {
  // Handle WebGL context loss and restoration
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn("⚠️ WebGL context lost in EndScreen");
    },
    onContextRestored: () => {
      console.log("✅ WebGL context restored in EndScreen");
    },
    autoRestore: true,
  });

  const audio = useAudio();
  const [showStats, setShowStats] = useState(false);

  // Determine if this is a victory screen (winner is player 0 by convention - extracted from id)
  const winnerId = winner.id;
  const isVictory = winnerId === "player-0" || winnerId.endsWith("-0");

  // Responsive layout
  const isMobile = useMemo(() => width < 768, [width]);
  const isTablet = useMemo(() => width >= 768 && width < 1024, [width]);

  const layoutConstants = useMemo(
    () => ({
      titleFontSize: isMobile ? 36 : isTablet ? 48 : 64,
      subtitleFontSize: isMobile ? 18 : isTablet ? 24 : 32,
      buttonFontSize: isMobile ? 14 : isTablet ? 16 : 18,
      padding: isMobile ? 15 : isTablet ? 20 : 30,
      buttonPadding: isMobile
        ? "10px 20px"
        : isTablet
        ? "12px 24px"
        : "15px 30px",
      spacing: isMobile ? 15 : isTablet ? 20 : 30,
    }),
    [isMobile, isTablet]
  );

  // Play victory/defeat audio on mount
  useEffect(() => {
    if (isVictory) {
      audio.playSFX?.("victory_fanfare");
      const timeoutId = setTimeout(() => {
        audio.playMusic?.("victory_theme");
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
        audio.stopMusic?.();
      };
    } else {
      audio.playSFX?.("defeat_sound");
      audio.playMusic?.("defeat_theme");

      return () => {
        audio.stopMusic?.();
      };
    }
  }, [audio, isVictory]);

  const handleReturnToMenu = useCallback(() => {
    audio.playSFX?.("menu_select");
    onReturnToMenu();
  }, [audio, onReturnToMenu]);

  const handleRematch = useCallback(() => {
    if (onRematch) {
      audio.playSFX?.("menu_select");
      onRematch();
    }
  }, [audio, onRematch]);

  const handleViewReplay = useCallback(() => {
    if (onViewReplay) {
      audio.playSFX?.("menu_select");
      onViewReplay();
    }
  }, [audio, onViewReplay]);

  const toggleStats = useCallback(() => {
    audio.playSFX?.("menu_hover");
    setShowStats((prev) => !prev);
  }, [audio]);

  const resultText = isVictory
    ? { korean: "승리!", english: "Victory!" }
    : { korean: "패배", english: "Defeat" };

  const primaryColor = isVictory
    ? KOREAN_COLORS.ACCENT_GOLD
    : KOREAN_COLORS.ACCENT_RED;

  return (
    <div
      data-testid="end-screen-3d"
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Volume Control - outside Canvas to maintain AudioProvider context */}
      <VolumeControl position="top-right" compact={isMobile} />

      <Canvas
        style={{ width, height }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 1);
        }}
        data-testid="end-screen-canvas"
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />

        {/* Background scene */}
        <EndScreenBackground3D isVictory={isVictory} />

        {/* UI Overlay */}
        <Html fullscreen>
          <div
            data-testid="end-screen-overlay"
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_FAMILY.KOREAN,
              color: toCssColor(KOREAN_COLORS.TEXT_PRIMARY),
              padding: layoutConstants.padding,
              background: `linear-gradient(180deg, ${hexToRgbaString(
                KOREAN_COLORS.UI_BACKGROUND_DARK,
                0.3
              )} 0%, ${hexToRgbaString(
                KOREAN_COLORS.UI_BACKGROUND_DARK,
                0.8
              )} 100%)`,
            }}
          >
            {/* Result Title */}
            <div
              style={{
                fontSize: layoutConstants.titleFontSize,
                fontWeight: "bold",
                color: toCssColor(primaryColor),
                textShadow: `0 0 20px ${hexToRgbaString(primaryColor, 0.8)}`,
                marginBottom: layoutConstants.spacing,
                textAlign: "center",
              }}
              data-testid="result-title"
            >
              {resultText.korean} | {resultText.english}
            </div>

            {/* Winner Name */}
            <div
              style={{
                fontSize: layoutConstants.subtitleFontSize,
                color: toCssColor(KOREAN_COLORS.PRIMARY_CYAN),
                marginBottom: layoutConstants.spacing * 1.5,
                textAlign: "center",
              }}
              data-testid="winner-name"
            >
              {winner.name.korean} | {winner.name.english}
            </div>

            {/* Archetype Display */}
            <div
              style={{
                fontSize: isMobile ? 14 : 16,
                color: toCssColor(KOREAN_COLORS.TEXT_SECONDARY),
                marginBottom: layoutConstants.spacing,
                textAlign: "center",
              }}
              data-testid="winner-archetype"
            >
              {winner.archetype.toUpperCase()}
            </div>

            {/* Match Statistics Toggle */}
            <button
              onClick={toggleStats}
              onMouseEnter={() => audio.playSFX?.("menu_hover")}
              style={{
                background: hexToRgbaString(
                  KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  0.8
                ),
                border: `2px solid ${hexToRgbaString(
                  KOREAN_COLORS.PRIMARY_CYAN,
                  0.8
                )}`,
                borderRadius: "8px",
                padding: layoutConstants.buttonPadding,
                fontSize: layoutConstants.buttonFontSize,
                color: toCssColor(KOREAN_COLORS.PRIMARY_CYAN),
                fontFamily: FONT_FAMILY.KOREAN,
                fontWeight: "bold",
                cursor: "pointer",
                marginBottom: layoutConstants.spacing,
                transition: "all 0.2s ease",
              }}
              data-testid="toggle-stats-button"
            >
              {showStats
                ? "통계 숨기기 | Hide Stats"
                : "통계 보기 | View Stats"}
            </button>

            {/* Match Statistics Display */}
            {showStats && (
              <MatchStatisticsDisplay
                matchStats={matchStats}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            )}

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: layoutConstants.spacing / 2,
                marginTop: layoutConstants.spacing,
              }}
              data-testid="action-buttons"
            >
              <button
                onClick={handleReturnToMenu}
                onMouseEnter={() => audio.playSFX?.("menu_hover")}
                style={{
                  background: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.9),
                  border: "none",
                  borderRadius: "8px",
                  padding: layoutConstants.buttonPadding,
                  fontSize: layoutConstants.buttonFontSize,
                  color: toCssColor(KOREAN_COLORS.UI_BACKGROUND_DARK),
                  fontFamily: FONT_FAMILY.KOREAN,
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  minWidth: isMobile ? "200px" : "150px",
                }}
                data-testid="return-to-menu-button"
              >
                메뉴로 | Return to Menu
              </button>

              {onRematch && (
                <button
                  onClick={handleRematch}
                  onMouseEnter={() => audio.playSFX?.("menu_hover")}
                  style={{
                    background: hexToRgbaString(
                      KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                      0.8
                    ),
                    border: `2px solid ${hexToRgbaString(
                      KOREAN_COLORS.ACCENT_GOLD,
                      0.8
                    )}`,
                    borderRadius: "8px",
                    padding: layoutConstants.buttonPadding,
                    fontSize: layoutConstants.buttonFontSize,
                    color: toCssColor(KOREAN_COLORS.ACCENT_GOLD),
                    fontFamily: FONT_FAMILY.KOREAN,
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    minWidth: isMobile ? "200px" : "150px",
                  }}
                  data-testid="rematch-button"
                >
                  재대결 | Rematch
                </button>
              )}

              {onViewReplay && (
                <button
                  onClick={handleViewReplay}
                  onMouseEnter={() => audio.playSFX?.("menu_hover")}
                  style={{
                    background: hexToRgbaString(
                      KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                      0.8
                    ),
                    border: `2px solid ${hexToRgbaString(
                      KOREAN_COLORS.ACCENT_BLUE,
                      0.8
                    )}`,
                    borderRadius: "8px",
                    padding: layoutConstants.buttonPadding,
                    fontSize: layoutConstants.buttonFontSize,
                    color: toCssColor(KOREAN_COLORS.ACCENT_BLUE),
                    fontFamily: FONT_FAMILY.KOREAN,
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    minWidth: isMobile ? "200px" : "150px",
                  }}
                  data-testid="view-replay-button"
                >
                  리플레이 | View Replay
                </button>
              )}
            </div>
          </div>
        </Html>
      </Canvas>
    </div>
  );
};
