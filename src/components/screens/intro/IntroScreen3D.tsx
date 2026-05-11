import { Canvas } from "@react-three/fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAudio } from "../../../audio/AudioProvider";
import { useWebGLContextLossHandler } from "../../../hooks/useWebGLContextLossHandler";
import { useWindowSize } from "../../../hooks/useWindowSize";
import { getScreenSize } from "../../../systems/ResponsiveScaling";
import { PLAYER_ARCHETYPES_DATA } from "../../../systems/types";
import { GameMode, PlayerArchetype } from "../../../types/common";
import {
  ARCHETYPE_BACKGROUNDS,
  getKoreanFontSize,
  getPerformanceSettings,
} from "../../../types/constants";
import { Z_INDEX } from "../../../types/LayoutTypes";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { shouldUseMobileControls } from "../../../utils/deviceDetection";
import { getArchetypeAssets } from "../../../utils/playerUtils";
import { useKoreanTheme } from "../../shared/base/useKoreanTheme";
import { BackgroundScene3D } from "../../shared/three";
import { VolumeControl } from "../../shared/ui/VolumeControl";
import { ArchetypeDisplayOverlayHtml } from "./components/ArchetypeDisplayOverlayHtml";
import { EnhancedArchetypeDisplay } from "./components/EnhancedArchetypeDisplayOverlayHtml";
import { MenuSectionOverlayHtml } from "./components/MenuSectionOverlayHtml";

const APP_VERSION = import.meta.env.APP_VERSION;

export interface IntroScreen3DProps {
  readonly onMenuSelect: (mode: GameMode, archetype?: PlayerArchetype) => void;
  readonly onArchetypeSelect?: (archetype: PlayerArchetype) => void;
  readonly selectedArchetype?: PlayerArchetype;
  readonly width?: number;
  readonly height?: number;
  readonly useEnhancedArchetypeDisplay?: boolean; // Use enhanced card display
}

const MENU_ITEMS: { mode: GameMode; korean: string; english: string }[] = [
  { mode: GameMode.VERSUS, korean: "대전", english: "Combat" },
  { mode: GameMode.TRAINING, korean: "훈련", english: "Training" },
  { mode: GameMode.CONTROLS, korean: "조작", english: "Controls" },
  { mode: GameMode.PHILOSOPHY, korean: "철학", english: "Philosophy" },
];

const ARCHETYPE_TEXTURE_MAPPING: Record<PlayerArchetype, string> = {
  [PlayerArchetype.MUSA]: "musa",
  [PlayerArchetype.AMSALJA]: "amsalja",
  [PlayerArchetype.HACKER]: "hacker",
  [PlayerArchetype.JEONGBO_YOWON]: "jeongbo_yowon",
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: "jojik_pokryeokbae",
};

const getArchetypeIndex = (archetype: PlayerArchetype): number => {
  const archetypeKeys = Object.keys(
    PLAYER_ARCHETYPES_DATA,
  ) as PlayerArchetype[];
  return archetypeKeys.indexOf(archetype);
};

const getArchetypeFromIndex = (index: number): PlayerArchetype => {
  const archetypeKeys = Object.keys(
    PLAYER_ARCHETYPES_DATA,
  ) as PlayerArchetype[];
  return archetypeKeys[index] ?? PlayerArchetype.MUSA;
};

/**
 * Three.js-based IntroScreen Component
 */
export const IntroScreen3D: React.FC<IntroScreen3DProps> = ({
  onMenuSelect,
  onArchetypeSelect,
  selectedArchetype = PlayerArchetype.MUSA,
  width: propWidth,
  height: propHeight,
  useEnhancedArchetypeDisplay = true, // Default to enhanced display
}) => {
  const audio = useAudio();
  const introMusicStarted = useRef(false);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);

  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn("⚠️ WebGL context lost in IntroScreen");
    },
    onContextRestored: () => {
      console.log("✓ WebGL context restored in IntroScreen");
    },
    autoRestore: true,
  });

  const [currentArchetype, setCurrentArchetype] =
    useState<PlayerArchetype>(selectedArchetype);
  const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState<number>(
    getArchetypeIndex(selectedArchetype),
  );

  const { width, height } = useWindowSize();

  const screenWidth = propWidth ?? (width || 1200);
  const screenHeight = propHeight ?? (height || 800);

  const archetypeData = useMemo(() => {
    return Object.entries(PLAYER_ARCHETYPES_DATA).map(([key, data]) => {
      const archetypeEnum = key as PlayerArchetype;
      return {
        id: key.toLowerCase(),
        korean: data.name.korean,
        english: data.name.english,
        description: data.description.korean,
        color: data.colors.primary,
        textureKey: ARCHETYPE_TEXTURE_MAPPING[archetypeEnum],
        stats: data.stats,
        philosophy: data.philosophy,
        specialAbilities: data.specialAbilities, // Include special abilities
      };
    });
  }, []);

  useEffect(() => {
    setCurrentArchetype(selectedArchetype);
    setSelectedArchetypeIndex(getArchetypeIndex(selectedArchetype));
  }, [selectedArchetype]);

  const handleMenuItemSelect = useCallback(
    (mode: GameMode) => {
      onMenuSelect(mode, currentArchetype);
    },
    [onMenuSelect, currentArchetype],
  );

  const handleArchetypeIndexChange = useCallback(
    (index: number) => {
      const newArchetype = getArchetypeFromIndex(index);
      setSelectedArchetypeIndex(index);
      setCurrentArchetype(newArchetype);
      onArchetypeSelect?.(newArchetype);

      if (audio.isAudioReady) {
        audio.playSFX("menu_hover");

        const archetypeAssets = getArchetypeAssets(newArchetype);
        audio.stopMusic();
        audio.playMusic(archetypeAssets.themeId);
      }
    },
    [onArchetypeSelect, audio],
  );

  useEffect(() => {
    const startMusic = () => {
      if (audio.isAudioReady && !introMusicStarted.current) {
        introMusicStarted.current = true;
        audio.playMusic("intro_theme");
      }
    };
    window.addEventListener("keydown", startMusic, { once: true });
    window.addEventListener("mousedown", startMusic, { once: true });
    window.addEventListener("touchstart", startMusic, { once: true, passive: true });

    return () => {
      if (audio.isInitialized) {
        audio.stopMusic();
      }
    };
  }, [audio]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        const newIndex =
          selectedArchetypeIndex === 0
            ? archetypeData.length - 1
            : selectedArchetypeIndex - 1;
        handleArchetypeIndexChange(newIndex);
      } else if (event.key === "ArrowRight") {
        const newIndex = (selectedArchetypeIndex + 1) % archetypeData.length;
        handleArchetypeIndexChange(newIndex);
      } else {
        switch (event.key.toLowerCase()) {
          case "c":
            handleMenuItemSelect(GameMode.CONTROLS);
            break;
          case "p":
            handleMenuItemSelect(GameMode.PHILOSOPHY);
            break;
          case "t":
            handleMenuItemSelect(GameMode.TRAINING);
            break;
          case "v":
            handleMenuItemSelect(GameMode.VERSUS);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    audio,
    archetypeData.length,
    selectedArchetypeIndex,
    handleArchetypeIndexChange,
    handleMenuItemSelect,
  ]);

  const isMobile = useMemo(() => shouldUseMobileControls(), []);

  const theme = useKoreanTheme({
    variant: "primary",
    size: "md",
    isMobile,
  });

  const colors = useMemo(
    () => ({
      trigramTextShadow: `0 0 10px ${hexToRgbaString(
        theme.colors.PRIMARY_CYAN,
        0.8,
      )}`,
      footerBackground: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.9),
      footerBorder: hexToRgbaString(theme.colors.ACCENT_GOLD, 0.3),
    }),
    [theme],
  );

  const performanceSettings = useMemo(() => {
    return getPerformanceSettings(screenWidth, isMobile);
  }, [screenWidth, isMobile]);

  const screenSize = useMemo(() => getScreenSize(screenWidth), [screenWidth]);

  const logoSize = useMemo(() => {
    const minDim = Math.min(screenWidth, screenHeight);
    const logoScale = {
      mobile: 0.28,
      tablet: 0.22,
      desktop: 0.18,
      large: 0.15,
      xlarge: 0.12,
    }[screenSize];
    return Math.min(minDim * logoScale, screenSize === "xlarge" ? 250 : 300);
  }, [screenWidth, screenHeight, screenSize]);

  const layoutHeights = useMemo(() => {
    const availableHeight = screenHeight;

    const titleHeight = screenWidth < 768 ? 32 : 38;

    const trigramHeight = screenWidth < 768 ? 16 : 22;
    const logoAreaHeight = logoSize + trigramHeight;

    const footerHeight = Math.max(availableHeight * 0.05, 48);

    const contentHeight =
      availableHeight - titleHeight - logoAreaHeight - footerHeight;

    const menuMinHeight = screenWidth < 768 ? 180 : 120;
    const menuPercent = screenWidth < 768 ? 0.38 : 0.25;
    const menuHeight = Math.max(contentHeight * menuPercent, menuMinHeight);
    const archetypeHeight = contentHeight - menuHeight - 8; // 8px gap

    const gap = Math.max(screenHeight * 0.002, 2);

    return {
      titleHeight,
      logoAreaHeight,
      menuHeight,
      archetypeHeight,
      footerHeight,
      gap,
    };
  }, [screenHeight, screenWidth, logoSize]);
  return (
    <div
      style={{
        width: screenWidth,
        height: screenHeight,
        position: "relative",
        overflow: "hidden",
      }}
      data-testid="intro-screen"
    >
      {/* Archetype background image (very subtle, behind 3D scene) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${ARCHETYPE_BACKGROUNDS.overview})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.08,
          filter: "blur(4px)",
          zIndex: Z_INDEX.BACKGROUND,
        }}
        data-testid="archetype-background"
      />

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
          antialias: performanceSettings.antialias,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={performanceSettings.dpr}
        camera={{ position: [0, 5, 10], fov: 75 }}
        onCreated={({ gl }) => {
          gl.setClearColor(theme.colors.UI_BACKGROUND_DARK, 0.95);
        }}
      >
        {/* 3D Background Scene */}
        <BackgroundScene3D theme="intro" />
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
        data-testid="intro-hud-overlay"
      >
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 0,
            pointerEvents: "none",
            zIndex: Z_INDEX.HUD,
            overflow: "hidden",
          }}
        >
          {/* Title - Small, above logo */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              pointerEvents: "none",
              marginTop: "4px",
              flexShrink: 0,
            }}
            data-testid="main-title-container"
          >
            <div
              style={{
                fontSize: screenWidth < 768 ? "14px" : "16px",
                fontWeight: "bold",
                fontFamily: theme.koreanTypography.fontFamily,
                lineHeight: theme.koreanTypography.lineHeight,
                letterSpacing: theme.koreanTypography.letterSpacing,
                wordBreak: theme.koreanTypography.wordBreak,
                color: `#${theme.colors.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
                textShadow: "0 0 10px rgba(255, 170, 0, 0.5)",
              }}
            >
              흑괘 | Black Trigram
            </div>
            <div
              style={{
                fontSize: screenWidth < 768 ? "10px" : "11px",
                fontFamily: theme.koreanTypography.fontFamily,
                color: `#${theme.colors.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
              }}
            >
              한국 무술 시뮬레이터 | Korean Martial Arts Simulator
            </div>
          </div>

          {/* Logo Section - Primary branding */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: `${layoutHeights.logoAreaHeight}px`,
              pointerEvents: "none",
            }}
            data-testid="logo-section"
          >
            {/* Logo Image - Prominent */}
            <img
              src="/assets/visual/logo/black-trigram.png"
              alt="Black Trigram Logo"
              style={{
                width: `${logoSize}px`,
                height: `${logoSize}px`,
                objectFit: "contain",
                filter: "drop-shadow(0 0 30px rgba(0, 255, 255, 0.6))",
              }}
              data-testid="main-logo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />

            {/* Trigram Symbols */}
            <div
              style={{
                fontSize: screenWidth < 768 ? "16px" : "18px",
                color: `#${theme.colors.PRIMARY_CYAN.toString(16).padStart(
                  6,
                  "0",
                )}`,
                letterSpacing: screenWidth < 768 ? "6px" : "8px",
                textAlign: "center",
                marginTop: screenWidth < 768 ? "8px" : "10px",
                textShadow: colors.trigramTextShadow,
              }}
              data-testid="trigram-symbols"
            >
              ☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷
            </div>
          </div>

          {/* Main Content Area */}
          <div
            style={{
              width: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "4px",
              paddingLeft: screenWidth < 768 ? "8px" : "16px",
              paddingRight: screenWidth < 768 ? "8px" : "16px",
              overflow: "hidden",
              pointerEvents: "auto",
              minHeight: 0,
            }}
            data-testid="main-content"
          >
            {/* Menu Section - Compact */}
            <div
              style={{
                width: screenWidth < 768 ? "95%" : "70%",
                maxWidth: screenWidth < 768 ? "100%" : "600px",
              }}
              data-testid="menu-section-container"
            >
              <MenuSectionOverlayHtml
                menuItems={MENU_ITEMS}
                selectedIndex={selectedMenuIndex}
                onModeSelect={handleMenuItemSelect}
                onSelectedIndexChange={setSelectedMenuIndex}
                onPlaySFX={audio.playSFX}
                width={
                  screenWidth < 768
                    ? screenWidth * 0.9
                    : screenWidth < 1024
                      ? Math.min(500, screenWidth * 0.6)
                      : Math.min(550, screenWidth * 0.4)
                }
                height={layoutHeights.menuHeight}
                isMobile={isMobile}
              />
            </div>

            {/* Archetype Selection - Scrollable container */}
            <div
              style={{
                width: screenWidth < 768 ? "100%" : "85%",
                maxWidth: screenWidth < 768 ? "100%" : "900px",
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
              }}
              data-testid="archetype-section-container"
            >
              {useEnhancedArchetypeDisplay ? (
                <EnhancedArchetypeDisplay
                  archetypes={archetypeData}
                  selectedIndex={selectedArchetypeIndex}
                  onArchetypeChange={handleArchetypeIndexChange}
                  onPlaySFX={audio.playSFX}
                  width={
                    screenWidth < 768
                      ? screenWidth * 0.9
                      : screenWidth < 1024
                        ? Math.min(700, screenWidth * 0.7)
                        : Math.min(850, screenWidth * 0.55)
                  }
                  height={Math.max(layoutHeights.archetypeHeight - 40, 200)}
                  isMobile={isMobile}
                  allowDetailedView={screenWidth >= 768}
                />
              ) : (
                <ArchetypeDisplayOverlayHtml
                  archetypes={archetypeData}
                  selectedIndex={selectedArchetypeIndex}
                  onArchetypeChange={handleArchetypeIndexChange}
                  onPlaySFX={audio.playSFX}
                  width={
                    screenWidth < 768
                      ? screenWidth * 0.9
                      : screenWidth < 1024
                        ? Math.min(700, screenWidth * 0.7)
                        : Math.min(850, screenWidth * 0.55)
                  }
                  height={Math.max(layoutHeights.archetypeHeight - 40, 200)}
                  isMobile={isMobile}
                />
              )}
            </div>
          </div>

          {/* Footer - Compact with all info */}
          <div
            style={{
              width: "100%",
              minHeight: `${layoutHeights.footerHeight}px`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1px",
              background: `linear-gradient(to bottom, rgba(0, 0, 0, 0), ${colors.footerBackground})`,
              borderTop: `1px solid ${colors.footerBorder}`,
              pointerEvents: "auto",
              paddingBottom: "2px",
              flexShrink: 0,
            }}
            data-testid="intro-footer"
          >
            {/* Motto */}
            <div
              style={{
                fontSize: `${Math.max(getKoreanFontSize("SMALL", screenWidth) - 3, 10)}px`,
                color: `#${theme.colors.ACCENT_CYAN.toString(16).padStart(6, "0")}`,
                fontFamily: theme.koreanTypography.fontFamily,
                fontStyle: "italic",
                textAlign: "center",
              }}
              data-testid="footer-motto"
            >
              흑괘의 길을 걸어라 - Walk the Path of the Black Trigram
            </div>
            {/* Open Source Link */}
            <div
              style={{
                fontSize: `${Math.max(getKoreanFontSize("SMALL", screenWidth) - 4, 9)}px`,
                color: `#${theme.colors.ACCENT_BLUE.toString(16).padStart(6, "0")}`,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                window.open("https://github.com/Hack23/blacktrigram", "_blank")
              }
              data-testid="footer-link"
            >
              Open Source Korean Martial Arts Game by Hack23
            </div>
            {/* Version */}
            <div
              style={{
                fontSize: `${Math.max(getKoreanFontSize("SMALL", screenWidth) - 5, 8)}px`,
                color: `#${theme.colors.ACCENT_BLUE.toString(16).padStart(6, "0")}`,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() =>
                window.open(
                  `https://github.com/Hack23/blacktrigram/releases/tag/v${APP_VERSION}`,
                  "_blank",
                )
              }
              data-testid="footer-version"
            >
              v{APP_VERSION}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen3D;
