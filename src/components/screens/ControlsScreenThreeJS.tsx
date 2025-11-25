import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useWebGLContextLossHandler } from "../../hooks/useWebGLContextLossHandler";
import { useAudio } from "../../audio/AudioProvider";
import { COMBAT_CONTROLS } from "../../systems";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";

export interface ControlsScreenThreeJSProps {
  readonly onReturnToMenu: () => void;
  readonly width?: number;
  readonly height?: number;
}

// Responsive dimensions hook
function useWindowSize() {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return size;
}

/**
 * Three.js-based Background Scene Component
 * Renders cyberpunk Korean-themed 3D background
 */
const BackgroundScene: React.FC = () => {
  const gridRef = useRef<THREE.GridHelper>(null);

  // Animate grid using useFrame for proper sync with render loop
  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color={KOREAN_COLORS.PRIMARY_CYAN} />

      {/* Directional lights for Korean aesthetic */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
      <pointLight
        position={[-10, 5, -5]}
        intensity={0.4}
        color={KOREAN_COLORS.ACCENT_BLUE}
      />

      {/* Cyberpunk grid plane */}
      <gridHelper
        ref={gridRef}
        args={[100, 50, KOREAN_COLORS.PRIMARY_CYAN, KOREAN_COLORS.UI_BACKGROUND_MEDIUM]}
        position={[0, -5, 0]}
        rotation={[0, 0, 0]}
      />

      {/* Fog for depth */}
      <fog attach="fog" args={[KOREAN_COLORS.UI_BACKGROUND_DARK, 10, 50]} />
    </>
  );
};

/**
 * Three.js-based ControlsScreen Component
 */
export const ControlsScreenThreeJS: React.FC<ControlsScreenThreeJSProps> = ({
  onReturnToMenu,
  width: propWidth,
  height: propHeight,
}) => {
  // Handle WebGL context loss and restoration
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn('⚠️ WebGL context lost in ControlsScreen');
    },
    onContextRestored: () => {
      console.log('✅ WebGL context restored in ControlsScreen');
    },
    autoRestore: true,
  });

  const audio = useAudio();
  const { width, height } = useWindowSize();

  // Use prop dimensions if provided, otherwise use window size
  const screenWidth = propWidth ?? width;
  const screenHeight = propHeight ?? height;

  // Responsive layout calculations
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;

  const layoutConstants = useMemo(
    () => ({
      padding: isMobile ? 20 : 30,
      headerHeight: isMobile ? 100 : 120,
      footerHeight: isMobile ? 80 : 90,
      sectionSpacing: isMobile ? 15 : 20,
      buttonArea: isMobile ? 80 : 90,
    }),
    [isMobile]
  );

  // Memoize colors for performance
  const colors = useMemo(
    () => ({
      background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
      headerBg: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
      sectionBg: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8),
      borderGold: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6),
      borderCyan: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.5),
      borderRed: hexToRgbaString(KOREAN_COLORS.KOREAN_RED, 0.8),
      textPrimary: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
      textSecondary: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
      accentGold: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
      accentCyan: `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`,
    }),
    []
  );

  // Enhanced keyboard handling for screen-level navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key.toLowerCase() === "m") {
        event.preventDefault();
        audio.playSFX("menu_back");
        onReturnToMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onReturnToMenu, audio]);

  // Handle back button click
  const handleBackClick = useCallback(() => {
    audio.playSFX("menu_back");
    onReturnToMenu();
  }, [audio, onReturnToMenu]);

  // Stance controls data
  const stanceControls = useMemo(
    () => Object.entries(COMBAT_CONTROLS.stanceControls),
    []
  );

  // Combat controls data
  const combatControls = useMemo(
    () => Object.entries(COMBAT_CONTROLS.combat),
    []
  );

  // Grid layout calculations
  const buttonsPerRow = isMobile ? 2 : isTablet ? 3 : 4;
  const buttonHeight = isMobile ? 120 : 140;

  return (
    <div
      style={{
        width: screenWidth,
        height: screenHeight,
        position: "relative",
        overflow: "hidden",
      }}
      data-testid="controls-screen"
    >
      {/* Three.js Canvas for 3D background */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 5, 10], fov: 75 }}
        onCreated={({ gl }) => {
          gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 1);
        }}
      >
        {/* 3D Background Scene */}
        <BackgroundScene />

        {/* HTML Overlay for UI */}
        <Html fullscreen>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              color: colors.textPrimary,
              fontFamily: FONT_FAMILY.KOREAN,
              pointerEvents: "auto",
            }}
          >
            {/* Header */}
            <div
              style={{
                height: `${layoutConstants.headerHeight}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: colors.headerBg,
                borderBottom: `3px solid ${colors.borderRed}`,
                padding: `${layoutConstants.padding}px`,
              }}
              data-testid="controls-header"
            >
              <h1
                style={{
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: "bold",
                  color: colors.accentGold,
                  margin: 0,
                  textShadow: `0 0 10px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.5)}`,
                }}
              >
                조작법 안내 - Controls Guide
              </h1>
              <p
                style={{
                  fontSize: isMobile ? "12px" : "16px",
                  color: colors.accentCyan,
                  margin: "8px 0 0 0",
                  fontStyle: "italic",
                }}
              >
                ☯ 팔괘 철학과 급소술의 융합 | Eight Trigrams Philosophy & Vital Point Arts ☯
              </p>
            </div>

            {/* Content Area - Scrollable */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: `${layoutConstants.padding}px`,
                scrollbarWidth: "thin",
                scrollbarColor: `${colors.accentGold} ${colors.sectionBg}`,
              }}
              data-testid="controls-content"
            >
              {/* Trigram Stances Section */}
              <div
                style={{
                  marginBottom: `${layoutConstants.sectionSpacing}px`,
                  background: colors.sectionBg,
                  borderRadius: "12px",
                  border: `2px solid ${colors.borderGold}`,
                  padding: "20px",
                }}
                data-testid="trigram-controls"
              >
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "bold",
                    color: colors.accentGold,
                    margin: "0 0 10px 0",
                  }}
                >
                  팔괘 무술 자세 - Eight Trigram Combat Stances
                </h2>
                <p
                  style={{
                    fontSize: isMobile ? "11px" : "14px",
                    color: colors.accentCyan,
                    fontStyle: "italic",
                    margin: "0 0 20px 0",
                  }}
                >
                  🗡️ 전통 한국 무예의 8가지 핵심 자세 | 8 Core Stances of Traditional Korean Martial Arts 🗡️
                </p>

                {/* Stance Controls Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${buttonsPerRow}, 1fr)`,
                    gap: "15px",
                  }}
                  data-testid="stance-controls-grid"
                >
                  {stanceControls.map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        background: `linear-gradient(135deg, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.9)}, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.9)})`,
                        borderRadius: "10px",
                        border: `2px solid ${colors.borderGold}`,
                        padding: "12px",
                        position: "relative",
                        minHeight: `${buttonHeight}px`,
                      }}
                      data-testid={`stance-control-${key}`}
                    >
                      {/* Key Badge */}
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          background: colors.accentGold,
                          borderRadius: "6px",
                          width: "25px",
                          height: "25px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: isMobile ? "14px" : "16px",
                          fontWeight: "bold",
                          color: "#000",
                        }}
                      >
                        {key}
                      </div>

                      {/* Trigram Symbol */}
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          fontSize: isMobile ? "18px" : "22px",
                          color: colors.accentGold,
                          fontWeight: "bold",
                        }}
                      >
                        {value.symbol}
                      </div>

                      {/* Stance Name */}
                      <div style={{ marginTop: "35px" }}>
                        <div
                          style={{
                            fontSize: isMobile ? "12px" : "14px",
                            fontWeight: "bold",
                            color: colors.textPrimary,
                          }}
                        >
                          {value.korean}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "9px" : "10px",
                            color: colors.textSecondary,
                            fontStyle: "italic",
                          }}
                        >
                          {value.english}
                        </div>
                      </div>

                      {/* Technique */}
                      <div style={{ marginTop: "8px" }}>
                        <div
                          style={{
                            fontSize: isMobile ? "9px" : "10px",
                            fontWeight: "bold",
                            color: colors.accentCyan,
                          }}
                        >
                          🥋 {value.technique.korean}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "8px" : "9px",
                            color: colors.accentCyan,
                            fontStyle: "italic",
                          }}
                        >
                          {value.technique.english}
                        </div>
                      </div>

                      {/* Combat Focus */}
                      <div style={{ marginTop: "6px" }}>
                        <div
                          style={{
                            fontSize: isMobile ? "8px" : "9px",
                            fontWeight: "bold",
                            color: `#${KOREAN_COLORS.SECONDARY_MAGENTA.toString(16).padStart(6, "0")}`,
                          }}
                        >
                          ⚔️ {value.combatFocus.korean}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "7px" : "8px",
                            color: `#${KOREAN_COLORS.SECONDARY_MAGENTA.toString(16).padStart(6, "0")}`,
                            fontStyle: "italic",
                          }}
                        >
                          {value.combatFocus.english}
                        </div>
                      </div>

                      {/* Combat Effects */}
                      <div
                        style={{
                          marginTop: "6px",
                          fontSize: isMobile ? "7px" : "8px",
                          fontWeight: "bold",
                          color: `#${KOREAN_COLORS.NEGATIVE_RED.toString(16).padStart(6, "0")}`,
                        }}
                      >
                        💥 {value.combatEffects.korean}
                      </div>

                      {/* Effectiveness Indicator */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          right: "8px",
                          fontSize: isMobile ? "7px" : "8px",
                          fontWeight: "bold",
                          color: `#${KOREAN_COLORS.KOREAN_RED.toString(16).padStart(6, "0")}`,
                        }}
                      >
                        급소술
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Combat Controls Section */}
              <div
                style={{
                  marginBottom: `${layoutConstants.sectionSpacing}px`,
                  background: colors.sectionBg,
                  borderRadius: "12px",
                  border: `2px solid ${colors.borderCyan}`,
                  padding: "20px",
                }}
                data-testid="combat-controls"
              >
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "bold",
                    color: colors.accentCyan,
                    margin: "0 0 20px 0",
                  }}
                >
                  실전 격투 조작 - Combat Actions
                </h2>

                {/* Combat Controls List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                  data-testid="combat-controls-list"
                >
                  {combatControls.map(([key, description]) => (
                    <div
                      key={key}
                      style={{
                        background: `linear-gradient(90deg, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.9)}, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.9)})`,
                        borderRadius: "8px",
                        border: `1px solid ${colors.borderCyan}`,
                        padding: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                      data-testid={`combat-control-${key}`}
                    >
                      {/* Key Badge */}
                      <div
                        style={{
                          background: hexToRgbaString(KOREAN_COLORS.ACCENT_CYAN, 0.3),
                          borderRadius: "6px",
                          padding: "4px 12px",
                          fontSize: isMobile ? "14px" : "16px",
                          fontWeight: "bold",
                          color: colors.accentGold,
                          minWidth: "60px",
                          textAlign: "center",
                        }}
                      >
                        {key}
                      </div>

                      {/* Description */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: isMobile ? "11px" : "13px",
                            fontWeight: "bold",
                            color: colors.textPrimary,
                          }}
                        >
                          {description.korean}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "9px" : "11px",
                            color: colors.textSecondary,
                            fontStyle: "italic",
                          }}
                        >
                          {description.english}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                height: `${layoutConstants.footerHeight}px`,
                background: colors.headerBg,
                borderTop: `3px solid ${colors.borderRed}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: `0 ${layoutConstants.padding}px`,
              }}
              data-testid="controls-footer"
            >
              {/* Philosophy Text */}
              <div
                style={{
                  fontSize: isMobile ? "10px" : "12px",
                  color: colors.accentGold,
                  fontStyle: "italic",
                }}
              >
                🥋 흑괘의 길을 걸어라 | Walk the Path of the Black Trigram 🥋
              </div>

              {/* Back Button */}
              <button
                onClick={handleBackClick}
                style={{
                  background: `linear-gradient(135deg, ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8)}, ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6)})`,
                  border: `2px solid ${colors.borderGold}`,
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "bold",
                  color: "#000",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = `0 0 15px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6)}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                data-testid="controls-back-button"
              >
                무도장 복귀 | Return to Dojang
              </button>

              {/* Keyboard Hint */}
              <div
                style={{
                  background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.9),
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: isMobile ? "11px" : "12px",
                  fontWeight: "bold",
                  color: `#${KOREAN_COLORS.SECONDARY_MAGENTA.toString(16).padStart(6, "0")}`,
                  border: `1px solid ${colors.borderGold}`,
                }}
                data-testid="keyboard-shortcuts"
              >
                ESC | M
              </div>
            </div>

            {/* Footer Instruction */}
            <div
              style={{
                textAlign: "center",
                padding: "10px",
                fontSize: isMobile ? "10px" : "12px",
                color: colors.textSecondary,
                fontStyle: "italic",
                background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.7),
              }}
            >
              ESC 또는 M 키로 메뉴로 돌아가기 - Press ESC or M to return to menu
            </div>
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

export default ControlsScreenThreeJS;
