import { Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo } from "react";
import { useAudio } from "../../audio/AudioProvider";
import { useWebGLContextLossHandler } from "../../hooks/useWebGLContextLossHandler";
import { useWindowSize } from "../../hooks/useWindowSize";
import { PLAYER_ARCHETYPES_DATA } from "../../systems";
import { KoreanCulture } from "../../systems/trigram/KoreanCulture";
import { TRIGRAM_DATA } from "../../systems/trigram/types";
import { TrigramStance } from "../../types";
import { Z_INDEX } from "../../types/LayoutTypes";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";
import { BackgroundScene3D } from "../three/BackgroundScene3D";
import { VolumeControl } from "../ui/VolumeControl";

export interface PhilosophyScreenThreeJSProps {
  readonly onReturnToMenu: () => void;
  readonly width?: number;
  readonly height?: number;
}

/**
 * Three.js-based PhilosophyScreen Component
 */
export const PhilosophyScreenThreeJS: React.FC<
  PhilosophyScreenThreeJSProps
> = ({ onReturnToMenu, width: propWidth, height: propHeight }) => {
  // Content is always mounted/visible (no loading gate)
  const isMounted = true;

  // Handle WebGL context loss and restoration (for 3D background only)
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn("⚠️ WebGL context lost in PhilosophyScreen");
    },
    onContextRestored: () => {
      console.log("✓ WebGL context restored in PhilosophyScreen");
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
      footerHeight: isMobile ? 90 : isTablet ? 100 : isLargeDesktop ? 75 : 100,
      sectionSpacing: isMobile ? 15 : isTablet ? 18 : isLargeDesktop ? 12 : 18,
    }),
    [isMobile, isTablet, isLargeDesktop]
  );

  // Memoize colors for performance
  const colors = useMemo(
    () => ({
      background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
      headerBg: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
      sectionBg: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.8),
      borderGold: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8),
      borderCyan: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6),
      borderMagenta: hexToRgbaString(KOREAN_COLORS.SECONDARY_MAGENTA, 0.6),
      borderRed: hexToRgbaString(KOREAN_COLORS.KOREAN_RED, 0.6),
      textPrimary: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(
        6,
        "0"
      )}`,
      textSecondary: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(
        6,
        "0"
      )}`,
      textTertiary: `#${KOREAN_COLORS.TEXT_TERTIARY.toString(16).padStart(
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

  // Audio lifecycle management for philosophy screen
  useEffect(() => {
    const startMusic = async () => {
      await audio.fadeIn("underground_theme", 2000);
    };
    void startMusic().catch((err) =>
      console.warn("Failed to start philosophy music:", err)
    );

    return () => {
      void audio
        .fadeOut(2000)
        .then(() => audio.stopMusic())
        .catch((err) => console.warn("Failed to stop philosophy music:", err));
    };
  }, [audio]);

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

  // Handle ISMS link click
  const handleISMSClick = useCallback(() => {
    audio.playSFX("menu_select");
    window.open("https://github.com/Hack23/ISMS-PUBLIC", "_blank");
  }, [audio]);

  // Get philosophy data
  const martialValues = useMemo(
    () => Object.entries(KoreanCulture.MARTIAL_VALUES),
    []
  );

  const trigramPhilosophies = useMemo(
    () =>
      Object.entries(TRIGRAM_DATA).map(([stance, data]) => ({
        stance: stance as TrigramStance,
        ...data,
      })),
    []
  );

  const archetypes = useMemo(() => Object.entries(PLAYER_ARCHETYPES_DATA), []);

  // Grid layout calculations
  const valuesPerRow = isMobile ? 3 : 6;
  const trigramsPerRow = isMobile ? 2 : 4;

  return (
    <div
      style={{
        width: screenWidth,
        height: screenHeight,
        position: "relative",
        overflow: "hidden",
      }}
      data-testid="philosophy-screen"
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
        <BackgroundScene3D theme="philosophy" />

        {/* HTML Overlay for UI - only render when content is ready */}
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
                borderBottom: `3px solid ${colors.borderGold}`,
                padding: `${layoutConstants.padding}px`,
                position: "relative",
              }}
              data-testid="philosophy-header"
            >
              <h1
                style={{
                  fontSize: isMobile ? "28px" : "36px",
                  fontWeight: "bold",
                  color: colors.accentGold,
                  margin: 0,
                  textShadow: `0 0 15px ${hexToRgbaString(
                    KOREAN_COLORS.ACCENT_GOLD,
                    0.6
                  )}`,
                }}
              >
                흑괘 무도 철학
              </h1>
              <p
                style={{
                  fontSize: isMobile ? "14px" : "18px",
                  color: colors.textSecondary,
                  margin: "8px 0 0 0",
                }}
              >
                Black Trigram Martial Philosophy
              </p>

              {/* Decorative line */}
              <div
                style={{
                  width: "80%",
                  height: "2px",
                  background: `linear-gradient(90deg, transparent, ${colors.borderGold}, transparent)`,
                  marginTop: "10px",
                }}
              />
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
              data-testid="philosophy-content"
            >
              {/* Martial Values Section */}
              <div
                style={{
                  marginBottom: `${layoutConstants.sectionSpacing}px`,
                  background: colors.sectionBg,
                  borderRadius: "10px",
                  border: `2px solid ${colors.borderRed}`,
                  padding: "20px",
                }}
                data-testid="martial-values"
              >
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "bold",
                    color: colors.accentGold,
                    margin: "0 0 20px 0",
                  }}
                >
                  무도 가치관 (Martial Values)
                </h2>

                {/* Values Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${valuesPerRow}, 1fr)`,
                    gap: "10px",
                  }}
                >
                  {martialValues.map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        background: hexToRgbaString(
                          KOREAN_COLORS.UI_BACKGROUND_DARK,
                          0.7
                        ),
                        borderRadius: "6px",
                        border: `1px solid ${colors.borderGold}`,
                        padding: "12px",
                        textAlign: "center",
                      }}
                      data-testid={`martial-value-${key}`}
                    >
                      <div
                        style={{
                          fontSize: isMobile ? "16px" : "18px",
                          fontWeight: "bold",
                          color: colors.textPrimary,
                          marginBottom: "4px",
                        }}
                      >
                        {value.korean}
                      </div>
                      <div
                        style={{
                          fontSize: isMobile ? "11px" : "13px",
                          color: colors.textSecondary,
                        }}
                      >
                        {value.english}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trigram Philosophy Section */}
              <div
                style={{
                  marginBottom: `${layoutConstants.sectionSpacing}px`,
                  background: colors.sectionBg,
                  borderRadius: "10px",
                  border: `2px solid ${colors.borderCyan}`,
                  padding: "20px",
                }}
                data-testid="trigram-philosophy"
              >
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "bold",
                    color: colors.accentGold,
                    margin: "0 0 20px 0",
                  }}
                >
                  팔괘 철학 (Eight Trigrams Philosophy)
                </h2>

                {/* Trigrams Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${trigramsPerRow}, 1fr)`,
                    gap: "15px",
                  }}
                >
                  {trigramPhilosophies.map((trigram) => (
                    <div
                      key={trigram.stance}
                      style={{
                        background: hexToRgbaString(
                          trigram.theme.primary,
                          0.25
                        ),
                        borderRadius: "8px",
                        border: `2px solid #${trigram.theme.primary
                          .toString(16)
                          .padStart(6, "0")}`,
                        padding: "15px",
                      }}
                      data-testid={`trigram-${trigram.stance}`}
                    >
                      {/* Trigram Symbol */}
                      <div
                        style={{
                          fontSize: isMobile ? "32px" : "40px",
                          color: `#${trigram.theme.primary
                            .toString(16)
                            .padStart(6, "0")}`,
                          textAlign: "center",
                          marginBottom: "10px",
                        }}
                      >
                        {trigram.symbol}
                      </div>

                      {/* Name with Chinese character */}
                      <div
                        style={{
                          fontSize: isMobile ? "12px" : "14px",
                          fontWeight: "bold",
                          color: colors.textPrimary,
                          textAlign: "center",
                          marginBottom: "4px",
                        }}
                      >
                        {trigram.name.korean} ({trigram.name.english})
                      </div>

                      {/* Chinese character and attribute */}
                      <div
                        style={{
                          fontSize: isMobile ? "11px" : "13px",
                          color: colors.accentGold,
                          textAlign: "center",
                          marginBottom: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        {trigram.chinese} - {trigram.attribute.chinese},{" "}
                        {trigram.attribute.korean}
                      </div>

                      {/* Core meaning */}
                      <div
                        style={{
                          fontSize: isMobile ? "10px" : "11px",
                          color: colors.accentCyan,
                          textAlign: "center",
                          marginBottom: "8px",
                        }}
                      >
                        {trigram.meaning.korean} | {trigram.meaning.english}
                      </div>

                      {/* Philosophy */}
                      <div
                        style={{
                          fontSize: isMobile ? "10px" : "11px",
                          color: colors.textSecondary,
                          textAlign: "center",
                          marginBottom: "6px",
                        }}
                      >
                        {trigram.philosophy.korean}
                      </div>

                      {/* Combat description */}
                      <div
                        style={{
                          fontSize: isMobile ? "9px" : "10px",
                          color: colors.textTertiary,
                          textAlign: "center",
                          fontStyle: "italic",
                        }}
                      >
                        {trigram.combat.english}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Archetype Philosophy Section */}
              <div
                style={{
                  marginBottom: `${layoutConstants.sectionSpacing}px`,
                  background: colors.sectionBg,
                  borderRadius: "10px",
                  border: `2px solid ${colors.borderMagenta}`,
                  padding: "20px",
                }}
                data-testid="archetype-philosophy"
              >
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: "bold",
                    color: colors.accentGold,
                    margin: "0 0 20px 0",
                  }}
                >
                  무사 유형 철학 (Warrior Archetype Philosophy)
                </h2>

                {/* Archetypes List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {archetypes.map(([archetype, data]) => (
                    <div
                      key={archetype}
                      style={{
                        background: hexToRgbaString(data.colors.primary, 0.2),
                        borderRadius: "6px",
                        border: `1px solid #${data.colors.primary
                          .toString(16)
                          .padStart(6, "0")}`,
                        padding: "15px",
                      }}
                      data-testid={`archetype-${archetype}`}
                    >
                      {/* Name */}
                      <div
                        style={{
                          fontSize: isMobile ? "16px" : "18px",
                          fontWeight: "bold",
                          color: `#${data.colors.primary
                            .toString(16)
                            .padStart(6, "0")}`,
                          marginBottom: "8px",
                        }}
                      >
                        {data.name.korean} ({data.name.english})
                      </div>

                      {/* Description */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: isMobile ? "11px" : "13px",
                            color: colors.textPrimary,
                          }}
                        >
                          {data.description.korean}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "10px" : "12px",
                            color: colors.textSecondary,
                          }}
                        >
                          {data.description.english}
                        </div>
                      </div>

                      {/* Specialist tag */}
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: isMobile ? "9px" : "11px",
                          color: colors.textTertiary,
                        }}
                      >
                        전통 무예 전문가
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                minHeight: `${layoutConstants.footerHeight}px`,
                background: colors.headerBg,
                borderTop: `3px solid ${colors.borderGold}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: `${layoutConstants.padding}px`,
                gap: "15px",
              }}
              data-testid="philosophy-footer"
            >
              {/* Motivation Quote */}
              <div
                style={{
                  background: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.15),
                  borderRadius: "8px",
                  border: `1px solid ${colors.borderGold}`,
                  padding: "15px",
                  textAlign: "center",
                  maxWidth: "90%",
                }}
              >
                <div
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: colors.accentGold,
                    fontStyle: "italic",
                    marginBottom: "4px",
                  }}
                >
                  무술은 단순한 격투가 아닌, 자신을 수양하고 상대를 존중하는
                  도(道)입니다
                </div>
                <div
                  style={{
                    fontSize: isMobile ? "10px" : "12px",
                    color: colors.textSecondary,
                    fontStyle: "italic",
                  }}
                >
                  Martial arts is not mere combat, but the Way (道) of
                  self-cultivation and respect for others
                </div>
              </div>

              {/* ISMS Link */}
              <button
                onClick={handleISMSClick}
                style={{
                  background: "transparent",
                  border: `1px solid ${colors.borderGold}`,
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: isMobile ? "10px" : "12px",
                  fontWeight: "bold",
                  color: colors.accentGold,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = hexToRgbaString(
                    KOREAN_COLORS.ACCENT_GOLD,
                    0.2
                  );
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                data-testid="isms-public-link"
              >
                🔐 공개 보안 정책 | View Security Policies
              </button>

              {/* Action Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "15px",
                }}
              >
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
                  data-testid="philosophy-back-button"
                >
                  돌아가기 | Return
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
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                  }}
                  data-testid="keyboard-shortcuts"
                >
                  <span>ESC</span>
                  <span>M</span>
                </div>
              </div>
            </div>
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

export default PhilosophyScreenThreeJS;
