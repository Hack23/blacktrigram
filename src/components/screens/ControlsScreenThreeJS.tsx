import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo } from "react";
import { useAudio } from "../../audio/AudioProvider";
import { useWebGLContextLossHandler } from "../../hooks/useWebGLContextLossHandler";
import { useWindowSize } from "../../hooks/useWindowSize";
import { COMBAT_CONTROLS } from "../../systems";
import { Z_INDEX } from "../../types/LayoutTypes";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";
import { BackgroundScene3D } from "../three/BackgroundScene3D";
import { VolumeControl } from "../ui/VolumeControl";

export interface ControlsScreenThreeJSProps {
  readonly onReturnToMenu: () => void;
  readonly width?: number;
  readonly height?: number;
}

/**
 * Three.js-based ControlsScreen Component
 */
export const ControlsScreenThreeJS: React.FC<ControlsScreenThreeJSProps> = ({
  onReturnToMenu,
  width: propWidth,
  height: propHeight,
}) => {
  // Content is always mounted/visible (no loading gate)
  const isMounted = true;

  // Handle WebGL context loss and restoration (for 3D background only)
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn("⚠️ WebGL context lost in ControlsScreen");
    },
    onContextRestored: () => {
      console.log("✓ WebGL context restored in ControlsScreen");
    },
    autoRestore: true,
  });

  const audio = useAudio();
  const { width, height } = useWindowSize();

  // Use prop dimensions if provided, otherwise use window size
  const screenWidth = propWidth ?? width;
  const screenHeight = propHeight ?? height;

  // Responsive layout calculations with large desktop support
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isLargeDesktop = screenWidth >= 1920; // 4K/2K displays

  const layoutConstants = useMemo(
    () => ({
      padding: isMobile ? 20 : isTablet ? 25 : isLargeDesktop ? 18 : 25,
      headerHeight: isMobile ? 90 : isTablet ? 100 : isLargeDesktop ? 75 : 100,
      footerHeight: isMobile ? 75 : isTablet ? 85 : isLargeDesktop ? 65 : 85,
      sectionSpacing: isMobile ? 15 : isTablet ? 18 : isLargeDesktop ? 12 : 18,
      buttonArea: isMobile ? 75 : isTablet ? 85 : isLargeDesktop ? 65 : 85,
    }),
    [isMobile, isTablet, isLargeDesktop]
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
      textPrimary: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(
        6,
        "0"
      )}`,
      textSecondary: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(
        6,
        "0"
      )}`,
      accentGold: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
      accentCyan: `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(
        6,
        "0"
      )}`,
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
      {/* Volume Control - outside Canvas to maintain AudioProvider context */}
      <VolumeControl position="top-right" compact={isMobile} />

      {/* Three.js Canvas for 3D background */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: Z_INDEX.ARENA,
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
        <BackgroundScene3D theme="controls" />

        {/* HTML Overlay for UI - only render when content is ready */}
        <Html fullscreen>
          {/* WebKit Scrollbar Styling - Using !important to override global hide */}
          <style>{`
            .korean-scrollbar::-webkit-scrollbar {
              width: 12px !important;
              display: block !important;
            }
            .korean-scrollbar::-webkit-scrollbar-track {
              background: ${colors.sectionBg};
              border-radius: 6px;
            }
            .korean-scrollbar::-webkit-scrollbar-thumb {
              background: ${colors.accentGold};
              border-radius: 6px;
              border: 2px solid ${colors.sectionBg};
            }
            .korean-scrollbar::-webkit-scrollbar-thumb:hover {
              background: ${colors.accentCyan};
            }
          `}</style>

          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              color: colors.textPrimary,
              fontFamily: FONT_FAMILY.KOREAN,
              pointerEvents: "auto",
              opacity: isMounted ? 1 : 0,
              transition: "opacity 0.2s ease-out",
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
                  textShadow: `0 0 10px ${hexToRgbaString(
                    KOREAN_COLORS.ACCENT_GOLD,
                    0.5
                  )}`,
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
                ☯ 팔괘 철학과 급소술의 융합 | Eight Trigrams Philosophy & Vital
                Point Arts ☯
              </p>
            </div>

            {/* Content Area - Scrollable */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: `${layoutConstants.padding}px`,
                // Custom scrollbar styling for Korean aesthetic (Firefox)
                scrollbarWidth: "thin",
                scrollbarColor: `${colors.accentGold} ${colors.sectionBg}`,
              }}
              className="korean-scrollbar"
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
                  🗡️ 전통 한국 무예의 8가지 핵심 자세 | 8 Core Stances of
                  Traditional Korean Martial Arts 🗡️
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
                        background: `linear-gradient(135deg, ${hexToRgbaString(
                          KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                          0.9
                        )}, ${hexToRgbaString(
                          KOREAN_COLORS.UI_BACKGROUND_LIGHT,
                          0.9
                        )})`,
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
                            color: `#${KOREAN_COLORS.SECONDARY_MAGENTA.toString(
                              16
                            ).padStart(6, "0")}`,
                          }}
                        >
                          ⚔️ {value.combatFocus.korean}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "7px" : "8px",
                            color: `#${KOREAN_COLORS.SECONDARY_MAGENTA.toString(
                              16
                            ).padStart(6, "0")}`,
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
                          color: `#${KOREAN_COLORS.NEGATIVE_RED.toString(
                            16
                          ).padStart(6, "0")}`,
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
                          color: `#${KOREAN_COLORS.KOREAN_RED.toString(
                            16
                          ).padStart(6, "0")}`,
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
                        background: `linear-gradient(90deg, ${hexToRgbaString(
                          KOREAN_COLORS.UI_BACKGROUND_LIGHT,
                          0.9
                        )}, ${hexToRgbaString(
                          KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                          0.9
                        )})`,
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
                          background: hexToRgbaString(
                            KOREAN_COLORS.ACCENT_CYAN,
                            0.3
                          ),
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

              {/* Movement Controls Section */}
              <div
                style={{
                  marginBottom: `${layoutConstants.sectionSpacing}px`,
                  background: colors.sectionBg,
                  borderRadius: "12px",
                  border: `2px solid ${hexToRgbaString(
                    KOREAN_COLORS.SECONDARY_MAGENTA,
                    0.5
                  )}`,
                  padding: "20px",
                }}
                data-testid="movement-controls"
              >
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "bold",
                    color: `#${KOREAN_COLORS.SECONDARY_MAGENTA.toString(
                      16
                    ).padStart(6, "0")}`,
                    margin: "0 0 20px 0",
                  }}
                >
                  이동 조작 - Movement Controls
                </h2>

                {/* Movement Keys */}
                <div style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      fontSize: isMobile ? "12px" : "14px",
                      fontWeight: "bold",
                      color: colors.accentGold,
                      marginBottom: "10px",
                    }}
                  >
                    WASD 또는 방향키 | WASD or Arrow Keys
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
                      gap: "8px",
                    }}
                  >
                    {[
                      { key: "W/↑", korean: "전진", english: "Forward" },
                      { key: "S/↓", korean: "후퇴", english: "Backward" },
                      { key: "A/←", korean: "좌", english: "Left" },
                      { key: "D/→", korean: "우", english: "Right" },
                    ].map((move) => (
                      <div
                        key={move.key}
                        style={{
                          background: hexToRgbaString(
                            KOREAN_COLORS.UI_BACKGROUND_LIGHT,
                            0.8
                          ),
                          borderRadius: "6px",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: isMobile ? "11px" : "13px",
                            fontWeight: "bold",
                            color: colors.accentCyan,
                          }}
                        >
                          {move.key}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "8px" : "9px",
                            color: colors.textSecondary,
                          }}
                        >
                          {move.korean} | {move.english}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Footwork Section */}
              <div
                style={{
                  marginBottom: `${layoutConstants.sectionSpacing}px`,
                  background: colors.sectionBg,
                  borderRadius: "12px",
                  border: `2px solid ${hexToRgbaString(
                    KOREAN_COLORS.PRIMARY_CYAN,
                    0.5
                  )}`,
                  padding: "20px",
                }}
                data-testid="advanced-footwork"
              >
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "bold",
                    color: colors.accentCyan,
                    margin: "0 0 10px 0",
                  }}
                >
                  고급 보법 - Advanced Footwork
                </h2>
                <p
                  style={{
                    fontSize: isMobile ? "10px" : "12px",
                    color: colors.textSecondary,
                    fontStyle: "italic",
                    margin: "0 0 15px 0",
                  }}
                >
                  🥋 전통 한국 무예 발놀림 기법 | Traditional Korean martial arts footwork techniques
                </p>

                {/* Tactical Steps */}
                <div style={{ marginBottom: "20px" }}>
                  <h3
                    style={{
                      fontSize: isMobile ? "14px" : "16px",
                      fontWeight: "bold",
                      color: colors.accentGold,
                      marginBottom: "10px",
                    }}
                  >
                    ✅ 전술보법 (Shift + WASD) | Tactical Steps - IMPLEMENTED
                  </h3>
                  <p
                    style={{
                      fontSize: isMobile ? "9px" : "10px",
                      color: colors.textSecondary,
                      marginBottom: "10px",
                      fontStyle: "italic",
                    }}
                  >
                    Precise 30cm repositioning • 300ms duration • Non-interruptible • 5 stamina cost
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                      gap: "8px",
                    }}
                  >
                    {[
                      { key: "Shift+W", korean: "전진보법", english: "Forward Step" },
                      { key: "Shift+S", korean: "후퇴보법", english: "Retreat Step" },
                      { key: "Shift+A", korean: "좌측면보법", english: "Left Step" },
                      { key: "Shift+D", korean: "우측면보법", english: "Right Step" },
                      { key: "Shift+W+A", korean: "전좌측보법", english: "Forward-Left" },
                      { key: "Shift+W+D", korean: "전우측보법", english: "Forward-Right" },
                      { key: "Shift+S+A", korean: "후좌측보법", english: "Back-Left" },
                      { key: "Shift+S+D", korean: "후우측보법", english: "Back-Right" },
                    ].map((step) => (
                      <div
                        key={step.key}
                        style={{
                          background: hexToRgbaString(
                            KOREAN_COLORS.UI_BACKGROUND_LIGHT,
                            0.8
                          ),
                          borderRadius: "6px",
                          border: `1px solid ${colors.borderCyan}`,
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: isMobile ? "9px" : "10px",
                            fontWeight: "bold",
                            color: colors.accentGold,
                            marginBottom: "4px",
                          }}
                        >
                          {step.key}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "7px" : "8px",
                            color: colors.textPrimary,
                          }}
                        >
                          {step.korean}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "6px" : "7px",
                            color: colors.textSecondary,
                            fontStyle: "italic",
                          }}
                        >
                          {step.english}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footwork Patterns */}
                <div>
                  <h3
                    style={{
                      fontSize: isMobile ? "14px" : "16px",
                      fontWeight: "bold",
                      color: colors.accentGold,
                      marginBottom: "10px",
                    }}
                  >
                    보법 패턴 (Ctrl + WASD) | Footwork Patterns
                  </h3>
                  
                  {/* Circular Steps */}
                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        fontSize: isMobile ? "11px" : "12px",
                        fontWeight: "bold",
                        color: colors.textPrimary,
                        marginBottom: "6px",
                      }}
                    >
                      ✅ 원형보 (Wonhyeongbo) | Circular Step - IMPLEMENTED
                    </div>
                    <p
                      style={{
                        fontSize: isMobile ? "8px" : "9px",
                        color: colors.textSecondary,
                        marginBottom: "8px",
                        fontStyle: "italic",
                      }}
                    >
                      Lateral movement while maintaining guard • 30cm distance • 300ms
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { key: "Ctrl+A", korean: "원형보 좌", english: "Circular Left" },
                        { key: "Ctrl+D", korean: "원형보 우", english: "Circular Right" },
                      ].map((move) => (
                        <div
                          key={move.key}
                          style={{
                            flex: 1,
                            background: hexToRgbaString(
                              KOREAN_COLORS.ACCENT_CYAN,
                              0.2
                            ),
                            borderRadius: "6px",
                            border: `1px solid ${colors.borderCyan}`,
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: isMobile ? "10px" : "11px",
                              fontWeight: "bold",
                              color: colors.accentGold,
                            }}
                          >
                            {move.key}
                          </div>
                          <div
                            style={{
                              fontSize: isMobile ? "8px" : "9px",
                              color: colors.textPrimary,
                            }}
                          >
                            {move.korean}
                          </div>
                          <div
                            style={{
                              fontSize: isMobile ? "7px" : "8px",
                              color: colors.textSecondary,
                              fontStyle: "italic",
                            }}
                          >
                            {move.english}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slide Steps */}
                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        fontSize: isMobile ? "11px" : "12px",
                        fontWeight: "bold",
                        color: colors.textPrimary,
                        marginBottom: "6px",
                      }}
                    >
                      ✅ 미끄럼보 (Mikkeureombo) | Slide Step - IMPLEMENTED
                    </div>
                    <p
                      style={{
                        fontSize: isMobile ? "8px" : "9px",
                        color: colors.textSecondary,
                        marginBottom: "8px",
                        fontStyle: "italic",
                      }}
                    >
                      Both feet move together • 30cm distance • 200ms (faster!)
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[
                        { key: "Ctrl+W", korean: "미끄럼보 전", english: "Slide Forward" },
                        { key: "Ctrl+S", korean: "미끄럼보 후", english: "Slide Back" },
                      ].map((move) => (
                        <div
                          key={move.key}
                          style={{
                            flex: 1,
                            background: hexToRgbaString(
                              KOREAN_COLORS.ACCENT_CYAN,
                              0.2
                            ),
                            borderRadius: "6px",
                            border: `1px solid ${colors.borderCyan}`,
                            padding: "8px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: isMobile ? "10px" : "11px",
                              fontWeight: "bold",
                              color: colors.accentGold,
                            }}
                          >
                            {move.key}
                          </div>
                          <div
                            style={{
                              fontSize: isMobile ? "8px" : "9px",
                              color: colors.textPrimary,
                            }}
                          >
                            {move.korean}
                          </div>
                          <div
                            style={{
                              fontSize: isMobile ? "7px" : "8px",
                              color: colors.textSecondary,
                              fontStyle: "italic",
                            }}
                          >
                            {move.english}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pending Footwork */}
                  <div
                    style={{
                      marginTop: "15px",
                      padding: "10px",
                      background: hexToRgbaString(
                        KOREAN_COLORS.ACCENT_CYAN,
                        0.2
                      ),
                      borderRadius: "6px",
                      border: `1px solid ${colors.borderCyan}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: isMobile ? "10px" : "11px",
                        fontWeight: "bold",
                        color: colors.accentGold,
                        marginBottom: "6px",
                      }}
                    >
                      ✅ 추가 보법 (Advanced Patterns) - IMPLEMENTED
                    </div>
                    <p
                      style={{
                        fontSize: isMobile ? "8px" : "9px",
                        color: colors.textPrimary,
                        margin: "0 0 6px 0",
                      }}
                    >
                      <strong>축족회전 (Chukjok Hoejeon) | Pivot</strong>: Shift+Ctrl+A (left) / Shift+Ctrl+D (right) • 90° rotation on planted foot • 250ms
                    </p>
                    <p
                      style={{
                        fontSize: isMobile ? "8px" : "9px",
                        color: colors.textPrimary,
                        margin: 0,
                      }}
                    >
                      <strong>섞음보 (Seokkeumbo) | Shuffle</strong>: Shift+Ctrl+W or Shift+Ctrl+S • 15cm micro-adjustment • 100ms
                    </p>
                  </div>
                </div>
              </div>

              {/* Stance Side Switch Section */}
              <div
                style={{
                  marginBottom: `${layoutConstants.sectionSpacing}px`,
                  background: colors.sectionBg,
                  borderRadius: "12px",
                  border: `2px solid ${hexToRgbaString(
                    KOREAN_COLORS.ACCENT_GOLD,
                    0.5
                  )}`,
                  padding: "20px",
                }}
                data-testid="stance-side-switch"
              >
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "bold",
                    color: colors.accentGold,
                    margin: "0 0 10px 0",
                  }}
                >
                  자세 발 바꿈 - Stance Side Switch
                </h2>
                <p
                  style={{
                    fontSize: isMobile ? "10px" : "12px",
                    color: colors.textSecondary,
                    fontStyle: "italic",
                    margin: "0 0 15px 0",
                  }}
                >
                  ✅ 전방 발 전환 | Switch front foot position - IMPLEMENTED
                </p>

                <div
                  style={{
                    background: hexToRgbaString(
                      KOREAN_COLORS.ACCENT_GOLD,
                      0.2
                    ),
                    borderRadius: "6px",
                    border: `1px solid ${colors.borderGold}`,
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: isMobile ? "16px" : "18px",
                      fontWeight: "bold",
                      color: colors.accentGold,
                      marginBottom: "8px",
                    }}
                  >
                    H
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? "10px" : "11px",
                      color: colors.textPrimary,
                      marginBottom: "4px",
                    }}
                  >
                    발 바꿈 (Bal Bakkum)
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? "9px" : "10px",
                      color: colors.textSecondary,
                      fontStyle: "italic",
                    }}
                  >
                    Switch Front Foot
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? "7px" : "8px",
                      color: colors.textSecondary,
                      marginTop: "6px",
                      fontStyle: "italic",
                    }}
                  >
                    Mirrors your stance (left ↔ right) • 400ms duration
                  </div>
                </div>
              </div>

              {/* Technique Controls Section */}
              <div
                style={{
                  marginBottom: `${layoutConstants.sectionSpacing}px`,
                  background: colors.sectionBg,
                  borderRadius: "12px",
                  border: `2px solid ${hexToRgbaString(
                    KOREAN_COLORS.ACCENT_GOLD,
                    0.6
                  )}`,
                  padding: "20px",
                }}
                data-testid="technique-controls"
              >
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "bold",
                    color: colors.accentGold,
                    margin: "0 0 10px 0",
                  }}
                >
                  기술 실행 - Technique Execution
                </h2>
                <p
                  style={{
                    fontSize: isMobile ? "10px" : "12px",
                    color: colors.textSecondary,
                    fontStyle: "italic",
                    margin: "0 0 15px 0",
                  }}
                >
                  ⚡ 원형별 고유 기술 (최대 10개) | Archetype-specific techniques (up to 10)
                </p>

                {/* Technique Keys Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "repeat(5, 1fr)" : "repeat(10, 1fr)",
                    gap: isMobile ? "6px" : "8px",
                  }}
                >
                  {["Q", "E", "R", "T", "Y", "F", "G", "Z", "X", "C"].map(
                    (key, index) => (
                      <div
                        key={key}
                        style={{
                          background: `linear-gradient(135deg, ${hexToRgbaString(
                            KOREAN_COLORS.ACCENT_GOLD,
                            0.3
                          )}, ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.1)})`,
                          borderRadius: "6px",
                          border: `2px solid ${colors.borderGold}`,
                          padding: isMobile ? "8px 4px" : "10px 6px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: isMobile ? "14px" : "16px",
                            fontWeight: "bold",
                            color: colors.accentGold,
                          }}
                        >
                          {key}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "7px" : "8px",
                            color: colors.textSecondary,
                            marginTop: "2px",
                          }}
                        >
                          기술 {index + 1}
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Technique Notes */}
                <div
                  style={{
                    marginTop: "15px",
                    padding: "10px",
                    background: hexToRgbaString(
                      KOREAN_COLORS.UI_BACKGROUND_DARK,
                      0.6
                    ),
                    borderRadius: "6px",
                    fontSize: isMobile ? "9px" : "10px",
                    color: colors.textSecondary,
                    fontStyle: "italic",
                  }}
                >
                  💡 <strong>Tip</strong>: Keys positioned around WASD for easy access
                  without interfering with movement. Each archetype has unique techniques.
                </div>
              </div>

              {/* Special Features Section */}
              <div
                style={{
                  marginBottom: `${layoutConstants.sectionSpacing}px`,
                  background: colors.sectionBg,
                  borderRadius: "12px",
                  border: `2px solid ${colors.borderRed}`,
                  padding: "20px",
                }}
                data-testid="special-features"
              >
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "bold",
                    color: `#${KOREAN_COLORS.KOREAN_RED.toString(16).padStart(
                      6,
                      "0"
                    )}`,
                    margin: "0 0 20px 0",
                  }}
                >
                  특수 기능 - Special Features
                </h2>

                {/* Special Keys List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    {
                      key: "V",
                      korean: "급소 표시 전환",
                      english: "Toggle vital points overlay (70 points)",
                    },
                    {
                      key: "B",
                      korean: "방어 자세",
                      english: "Defensive guard position",
                    },
                    {
                      key: "F1",
                      korean: "조작법 힌트",
                      english: "Show control hints",
                    },
                    {
                      key: "ESC / M",
                      korean: "일시정지 / 메뉴",
                      english: "Pause menu / Return to menu",
                    },
                  ].map((special) => (
                    <div
                      key={special.key}
                      style={{
                        background: hexToRgbaString(
                          KOREAN_COLORS.UI_BACKGROUND_LIGHT,
                          0.8
                        ),
                        borderRadius: "8px",
                        border: `1px solid ${colors.borderRed}`,
                        padding: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          background: hexToRgbaString(KOREAN_COLORS.KOREAN_RED, 0.3),
                          borderRadius: "6px",
                          padding: "4px 10px",
                          fontSize: isMobile ? "12px" : "14px",
                          fontWeight: "bold",
                          color: colors.accentGold,
                          minWidth: "50px",
                          textAlign: "center",
                        }}
                      >
                        {special.key}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: isMobile ? "10px" : "12px",
                            fontWeight: "bold",
                            color: colors.textPrimary,
                          }}
                        >
                          {special.korean}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "8px" : "10px",
                            color: colors.textSecondary,
                            fontStyle: "italic",
                          }}
                        >
                          {special.english}
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
                  background: `linear-gradient(135deg, ${hexToRgbaString(
                    KOREAN_COLORS.ACCENT_GOLD,
                    0.8
                  )}, ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6)})`,
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
                  e.currentTarget.style.boxShadow = `0 0 15px ${hexToRgbaString(
                    KOREAN_COLORS.ACCENT_GOLD,
                    0.6
                  )}`;
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
                  background: hexToRgbaString(
                    KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                    0.9
                  ),
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: isMobile ? "11px" : "12px",
                  fontWeight: "bold",
                  color: `#${KOREAN_COLORS.SECONDARY_MAGENTA.toString(
                    16
                  ).padStart(6, "0")}`,
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
                background: hexToRgbaString(
                  KOREAN_COLORS.UI_BACKGROUND_DARK,
                  0.7
                ),
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
