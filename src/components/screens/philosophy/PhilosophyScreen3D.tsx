import { Canvas } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo } from "react";
import { useAudio } from "../../../audio/AudioProvider";
import { useWebGLContextLossHandler } from "../../../hooks/useWebGLContextLossHandler";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { PLAYER_ARCHETYPES_DATA } from "../../../systems";
import { KoreanCulture } from "../../../systems/trigram/KoreanCulture";
import { TRIGRAM_DATA } from "../../../systems/trigram/types";
import { TrigramStance } from "../../../types";
import { Z_INDEX } from "../../../types/LayoutTypes";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { shouldUseMobileControls } from "../../../utils/deviceDetection";
import { getLayoutConstants } from "../../../utils/responsiveLayoutHelpers";
import { useKoreanTheme } from "../../shared/base/useKoreanTheme";
import { BackgroundScene3D } from "../../shared/three";
import { BackButton, LinkButton } from "../../shared/ui/BackButton";
import { VolumeControl } from "../../shared/ui/VolumeControl";

export interface PhilosophyScreen3DProps {
  readonly onReturnToMenu: () => void;
  readonly width?: number;
  readonly height?: number;
}

/**
 * Three.js-based PhilosophyScreen Component
 */
export const PhilosophyScreen3D: React.FC<PhilosophyScreen3DProps> = ({
  onReturnToMenu,
  width: propWidth,
  height: propHeight,
}) => {

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

  const screenWidth = propWidth ?? width;
  const screenHeight = propHeight ?? height;

  const isMobile = shouldUseMobileControls();
  const isTablet = useMemo(
    () => !isMobile && screenWidth >= 768 && screenWidth < 1024,
    [isMobile, screenWidth],
  );
  const isLargeDesktop = useMemo(
    () => !isMobile && screenWidth >= 1920,
    [isMobile, screenWidth],
  ); // 4K/2K displays

  const layoutConstants = useMemo(
    () => getLayoutConstants(screenWidth),
    [screenWidth],
  );

  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  const scrollbarStyle = useMemo(
    () => ({
      __html: `
      .philosophy-scrollbar::-webkit-scrollbar {
        width: 12px !important;
        display: block !important;
      }
      .philosophy-scrollbar::-webkit-scrollbar-track {
        background: ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.8)};
        border-radius: 6px;
      }
      .philosophy-scrollbar::-webkit-scrollbar-thumb {
        background: ${hexToRgbaString(theme.colors.ACCENT_GOLD, 1)};
        border-radius: 6px;
        border: 2px solid ${hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.8)};
      }
      .philosophy-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 1)};
      }
    `,
    }),
    [theme],
  );

  const colors = useMemo(
    () => ({
      background: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.95),
      headerBg: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.9),
      sectionBg: hexToRgbaString(theme.colors.UI_BACKGROUND_LIGHT, 0.8),
      borderGold: hexToRgbaString(theme.colors.ACCENT_GOLD, 0.8),
      borderCyan: hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.6),
      borderMagenta: hexToRgbaString(theme.colors.SECONDARY_MAGENTA, 0.6),
      borderRed: hexToRgbaString(theme.colors.KOREAN_RED, 0.6),
      textPrimary: `#${theme.colors.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
      textSecondary: `#${theme.colors.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
      textTertiary: `#${theme.colors.TEXT_TERTIARY.toString(16).padStart(6, "0")}`,
      accentGold: `#${theme.colors.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
      accentCyan: `#${theme.colors.PRIMARY_CYAN.toString(16).padStart(6, "0")}`,
    }),
    [theme],
  );

  useEffect(() => {
    const startMusic = async () => {
      await audio.fadeIn("underground_theme", 2000);
    };
    void startMusic().catch((err) =>
      console.warn("Failed to start philosophy music:", err),
    );

    return () => {
      void audio
        .fadeOut(2000)
        .then(() => audio.stopMusic())
        .catch((err) => console.warn("Failed to stop philosophy music:", err));
    };
  }, [audio]);

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

  const handleBackClick = useCallback(() => {
    audio.playSFX("menu_back");
    onReturnToMenu();
  }, [audio, onReturnToMenu]);

  const handleISMSClick = useCallback(() => {
    audio.playSFX("menu_select");
    window.open("https://github.com/Hack23/ISMS-PUBLIC", "_blank");
  }, [audio]);

  const martialValues = useMemo(
    () => Object.entries(KoreanCulture.MARTIAL_VALUES),
    [],
  );

  const trigramPhilosophies = useMemo(
    () =>
      Object.entries(TRIGRAM_DATA).map(([stance, data]) => ({
        stance: stance as TrigramStance,
        ...data,
      })),
    [],
  );

  const archetypes = useMemo(() => Object.entries(PLAYER_ARCHETYPES_DATA), []);

  const valuesPerRow = isMobile ? 3 : isTablet ? 4 : isLargeDesktop ? 8 : 6;
  const trigramsPerRow = isMobile ? 2 : isTablet ? 3 : isLargeDesktop ? 5 : 4;

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
          gl.setClearColor(theme.colors.UI_BACKGROUND_DARK, 1);
        }}
      >
        {/* 3D Background Scene */}
        <BackgroundScene3D theme="philosophy" />
      </Canvas>

      {/* UI Overlay (positioned absolutely over Canvas) - matches CombatScreen pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: Z_INDEX.HUD,
        }}
        data-testid="philosophy-hud-overlay"
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            color: colors.textPrimary,
            fontFamily: theme.koreanTypography.fontFamily,
            lineHeight: theme.koreanTypography.lineHeight,
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
                  theme.colors.ACCENT_GOLD,
                  0.6,
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

          {/* WebKit Scrollbar Styling - Using !important to override global hide */}
          <style dangerouslySetInnerHTML={scrollbarStyle} />

          {/* Content Area - Scrollable */}
          <div
            className="philosophy-scrollbar"
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
                        theme.colors.UI_BACKGROUND_DARK,
                        0.7,
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
                      background: hexToRgbaString(trigram.theme.primary, 0.25),
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
                background: hexToRgbaString(theme.colors.ACCENT_GOLD, 0.15),
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
            <LinkButton
              onClick={handleISMSClick}
              korean="공개 보안 정책"
              english="View Security Policies"
              icon="🔐"
              isMobile={isMobile}
              testId="isms-public-link"
            />

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
              <BackButton
                onClick={handleBackClick}
                korean="돌아가기"
                english="Return"
                isMobile={isMobile}
                testId="philosophy-back-button"
              />

              {/* Keyboard Hint */}
              <div
                style={{
                  background: hexToRgbaString(
                    theme.colors.UI_BACKGROUND_MEDIUM,
                    0.9,
                  ),
                  borderRadius: "6px",
                  padding: "8px 12px",
                  fontSize: isMobile ? "11px" : "12px",
                  fontWeight: "bold",
                  color: `#${theme.colors.SECONDARY_MAGENTA.toString(
                    16,
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
      </div>
    </div>
  );
};

export default PhilosophyScreen3D;
