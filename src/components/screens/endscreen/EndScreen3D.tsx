import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useAudio } from "../../../audio/AudioProvider";
import { useWebGLContextLossHandler } from "../../../hooks/useWebGLContextLossHandler";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { PlayerState } from "../../../systems";
import { MatchStatistics } from "../../../systems/combat";
import { Z_INDEX } from "../../../types/LayoutTypes";
import { hexToRgbaString } from "../../../utils/colorUtils";
import {
  detectPlatform,
  shouldUseMobileControls,
} from "../../../utils/deviceDetection";
import { useKoreanTheme } from "../../shared/base/useKoreanTheme";
import { VolumeControl } from "../../shared/ui/VolumeControl";
import { MatchStatisticsDisplay } from "./components/MatchStatisticsDisplay";
import { NavigationButtons } from "./components/NavigationButtons";
import { PerformanceRating } from "./components/PerformanceRating";
import { VictoryAnimation3D } from "./components/VictoryAnimation3D";
import { WinnerDisplay } from "./components/WinnerDisplay";

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

  // Use useState with lazy initializer for random values - this is only called once
  const [particleData] = useState(() => {
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
  });

  const { positions, velocities } = particleData;

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
  const theme = useKoreanTheme({ variant: "primary", size: "md" });

  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.0005;
    }
  });

  const primaryColor = isVictory
    ? theme.colors.ACCENT_GOLD
    : theme.colors.ACCENT_RED;

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color={theme.colors.PRIMARY_CYAN} />

      {/* Directional lights */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={isVictory ? 1.2 : 0.8}
        color={primaryColor}
      />
      <directionalLight
        position={[-10, 10, -5]}
        intensity={0.5}
        color={theme.colors.PRIMARY_CYAN}
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
        args={[40, 40, primaryColor, theme.colors.UI_BACKGROUND_MEDIUM]}
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
  width: propWidth,
  height: propHeight,
}) => {
  // Handle WebGL context loss and restoration
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn("⚠️ WebGL context lost in EndScreen");
    },
    autoRestore: true,
  });

  const audio = useAudio();
  const [showStats, setShowStats] = useState(false);

  // Use window size for responsive layout with resize support
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const screenWidth = propWidth ?? windowWidth;
  // Note: windowHeight available but not currently used - screenWidth sufficient for current responsive logic
  void (propHeight ?? windowHeight); // Consumed but not stored

  // Determine if this is a victory screen (winner is player 0 by convention - extracted from id)
  const winnerId = winner.id;
  const isVictory = winnerId === "player-0" || winnerId.endsWith("-0");

  // Responsive layout with proper device detection
  // Uses user-agent detection for mobile controls (supports high-res phones)
  // User-agent doesn't change during session, so no dependencies needed
  const isMobile = useMemo(() => shouldUseMobileControls(), []);
  const platform = useMemo(() => detectPlatform(), []);
  const isTablet = useMemo(() => platform.isTablet, [platform]);
  const isLargeDesktop = useMemo(() => screenWidth >= 1920, [screenWidth]); // 4K/2K displays

  const layoutConstants = useMemo(
    () => ({
      titleFontSize: isMobile ? 36 : isTablet ? 44 : isLargeDesktop ? 44 : 54,
      subtitleFontSize: isMobile
        ? 18
        : isTablet
          ? 22
          : isLargeDesktop
            ? 22
            : 28,
      buttonFontSize: isMobile ? 14 : isTablet ? 15 : isLargeDesktop ? 14 : 16,
      padding: isMobile ? 15 : isTablet ? 18 : isLargeDesktop ? 15 : 20,
      buttonPadding: isMobile
        ? "10px 20px"
        : isTablet
          ? "11px 22px"
          : isLargeDesktop
            ? "10px 20px"
            : "12px 25px",
      spacing: isMobile ? 15 : isTablet ? 18 : isLargeDesktop ? 15 : 20,
    }),
    [isMobile, isTablet, isLargeDesktop],
  );

  // Use Korean theme hook for consistent theming
  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

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

  const toggleStats = useCallback(() => {
    audio.playSFX?.("menu_hover");
    setShowStats((prev) => !prev);
  }, [audio]);

  // Audio callbacks for NavigationButtons (inside Html portal which doesn't have AudioProvider context)
  const handlePlaySelectSound = useCallback(() => {
    audio.playSFX?.("menu_select");
  }, [audio]);

  const handlePlayHoverSound = useCallback(() => {
    audio.playSFX?.("menu_hover");
  }, [audio]);

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

      {/* 3D Background Canvas */}
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: Z_INDEX.ARENA,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(theme.colors.UI_BACKGROUND_DARK, 1);
        }}
        data-testid="end-screen-canvas"
      >
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />

        {/* Background scene */}
        <EndScreenBackground3D isVictory={isVictory} />
      </Canvas>

      {/* UI Overlay - outside Canvas for proper layout and AudioProvider context */}
      <div
        data-testid="end-screen-overlay"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: theme.koreanTypography.fontFamily,
          color: toCssColor(theme.colors.TEXT_PRIMARY),
          padding: layoutConstants.padding,
          boxSizing: "border-box",
          overflowY: "auto",
          zIndex: Z_INDEX.HUD,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxHeight: "100%",
            pointerEvents: "auto",
          }}
        >
          {/* Winner Display Component */}
          <WinnerDisplay
            winner={winner}
            isVictory={isVictory}
            isMobile={isMobile}
            isTablet={isTablet}
          />

          {/* Performance Rating Component */}
          <PerformanceRating
            matchStats={matchStats}
            isMobile={isMobile}
            isTablet={isTablet}
          />

          {/* Match Statistics Toggle */}
          <button
            onClick={toggleStats}
            onMouseEnter={() => audio.playSFX?.("menu_hover")}
            style={{
              background: hexToRgbaString(
                theme.colors.UI_BACKGROUND_MEDIUM,
                0.8,
              ),
              border: `2px solid ${hexToRgbaString(
                theme.colors.PRIMARY_CYAN,
                0.8,
              )}`,
              borderRadius: "8px",
              padding: layoutConstants.buttonPadding,
              fontSize: layoutConstants.buttonFontSize,
              color: toCssColor(theme.colors.PRIMARY_CYAN),
              fontFamily: theme.koreanTypography.fontFamily,
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: layoutConstants.spacing,
              transition: "all 0.2s ease",
            }}
            data-testid="toggle-stats-button"
          >
            {showStats ? "통계 숨기기 | Hide Stats" : "통계 보기 | View Stats"}
          </button>

          {/* Match Statistics Display */}
          {showStats && (
            <MatchStatisticsDisplay
              matchStats={matchStats}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          )}

          {/* Navigation Buttons Component */}
          <NavigationButtons
            onReturnToMenu={onReturnToMenu}
            onRematch={onRematch}
            onViewReplay={onViewReplay}
            isMobile={isMobile}
            isTablet={isTablet}
            onPlaySelectSound={handlePlaySelectSound}
            onPlayHoverSound={handlePlayHoverSound}
          />
        </div>
      </div>
    </div>
  );
};
