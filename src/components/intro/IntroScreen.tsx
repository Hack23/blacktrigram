import "@pixi/layout";
import { LayoutContainer } from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend } from "@pixi/react";
import { Container } from "pixi.js";

// Register custom components for use as JSX tags in @pixi/react
extend({
  Container,
  LayoutContainer,
});

import * as PIXI from "pixi.js";
import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArchetypeDisplay } from "./components/ArchetypeDisplay";
import { MenuSection } from "./components/MenuSection";

const APP_VERSION = import.meta.env.APP_VERSION;

// Lazy load heavy sections
const PhilosophySection = lazy(() => import("./components/PhilosophySection"));
const ControlsSection = lazy(() => import("./components/ControlsSection"));

import { useAudio } from "../../audio/AudioProvider";
import { PLAYER_ARCHETYPES_DATA } from "../../systems/types";
import { GameMode, PlayerArchetype } from "../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import { KoreanHeader } from "../ui/KoreanHeader";

// Responsive dimensions
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

export interface IntroScreenProps {
  readonly onMenuSelect: (mode: GameMode) => void;
  readonly width?: number;
  readonly height?: number;
}

const MENU_ITEMS: { mode: GameMode; korean: string; english: string }[] = [
  { mode: GameMode.VERSUS, korean: "대전", english: "Combat" },
  { mode: GameMode.TRAINING, korean: "훈련", english: "Training" },
  { mode: GameMode.CONTROLS, korean: "조작", english: "Controls" },
  { mode: GameMode.PHILOSOPHY, korean: "철학", english: "Philosophy" },
];

// Texture key mapping for archetypes
const ARCHETYPE_TEXTURE_MAPPING: Record<PlayerArchetype, string> = {
  [PlayerArchetype.MUSA]: "musa",
  [PlayerArchetype.AMSALJA]: "amsalja",
  [PlayerArchetype.HACKER]: "hacker",
  [PlayerArchetype.JEONGBO_YOWON]: "jeongboYowon",
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: "jojikPokryeokbae",
};

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onMenuSelect,
  width: propWidth,
  height: propHeight,
}) => {
  const audio = useAudio();
  const introMusicStarted = useRef(false);
  const [currentSection, setCurrentSection] = useState<string>("menu");
  const [bgTexture, setBgTexture] = useState<PIXI.Texture | null>(null);
  const [logoTexture, setLogoTexture] = useState<PIXI.Texture | null>(null);
  const [dojangWallTexture, setDojangWallTexture] =
    useState<PIXI.Texture | null>(null);
  const [archetypeTextures, setArchetypeTextures] = useState<{
    amsalja: PIXI.Texture | null;
    hacker: PIXI.Texture | null;
    jeongboYowon: PIXI.Texture | null;
    jojikPokryeokbae: PIXI.Texture | null;
    musa: PIXI.Texture | null;
  }>({
    amsalja: null,
    hacker: null,
    jeongboYowon: null,
    jojikPokryeokbae: null,
    musa: null,
  });
  const [selectedArchetype, setSelectedArchetype] = useState(0);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const { width, height } = useWindowSize();

  // Use prop dimensions if provided, otherwise use window size
  const screenWidth = propWidth ?? width;
  const screenHeight = propHeight ?? height;

  // Create archetype data with texture keys from PLAYER_ARCHETYPES_DATA
  const archetypeData = useMemo(() => {
    return Object.entries(PLAYER_ARCHETYPES_DATA).map(([key, data]) => {
      const archetypeEnum = key as PlayerArchetype;
      return {
        id: key.toLowerCase(),
        korean: data.name.korean,
        english: data.name.english,
        description: data.description.korean, // Use Korean description as string
        color: data.colors.primary,
        textureKey: ARCHETYPE_TEXTURE_MAPPING[archetypeEnum],
        // Add real stats from PLAYER_ARCHETYPES_DATA
        stats: data.stats,
        philosophy: data.philosophy,
      };
    });
  }, []);

  // Enhanced asset loading with proper error handling
  useEffect(() => {
    let destroyed = false;
    // Use proper asset path that exists in the project
    try {
      setBgTexture(
        PIXI.Texture.from("/assets/visual/bg/intro/intro_bg_placeholder.png")
      );
    } catch (err) {
      console.warn("Failed to load placeholder texture", err);
    }

    const loadAssets = async () => {
      try {
        // Use more reliable asset paths
        const bgPath = "/assets/visual/bg/intro/intro_bg_loop.png";
        const logoPath = "/assets/visual/logo/black-trigram.png";
        const dojangWallPath = "/assets/visual/bg/dojang/dojang_wall_tex.png";

        const archetypePaths = {
          amsalja: "/assets/visual/archetypes/amsalja.png",
          hacker: "/assets/visual/archetypes/hacker.png",
          jeongboYowon: "/assets/visual/archetypes/jeongbo_yowon.png",
          jojikPokryeokbae: "/assets/visual/archetypes/jojik_pokryeokbae.png",
          musa: "/assets/visual/archetypes/musa.png",
        };

        // Load main assets first
        const bgTexture = await PIXI.Assets.load(bgPath).catch(() => null);
        if (bgTexture && !destroyed) setBgTexture(bgTexture);

        // Load other assets in parallel
        const [logo, dojangWall] = await Promise.all([
          PIXI.Assets.load(logoPath).catch(() => null),
          PIXI.Assets.load(dojangWallPath).catch(() => null),
        ]);

        if (destroyed) return;
        if (logo) setLogoTexture(logo);
        if (dojangWall) setDojangWallTexture(dojangWall);

        // Load archetype textures
        const archetypeResults = await Promise.all(
          Object.entries(archetypePaths).map(async ([key, path]) => {
            const texture = await PIXI.Assets.load(path).catch(() => null);
            return { key, texture };
          })
        );

        if (destroyed) return;

        // Update archetype textures
        const newArchetypeTextures = { ...archetypeTextures };
        archetypeResults.forEach(({ key, texture }) => {
          if (texture) {
            newArchetypeTextures[key as keyof typeof archetypeTextures] =
              texture;
          }
        });

        setArchetypeTextures(newArchetypeTextures);
      } catch (err) {
        console.warn("Failed to load intro assets", err);
      }
    };

    // Load assets after a short delay
    const timeoutId = setTimeout(loadAssets, 100);

    return () => {
      clearTimeout(timeoutId);
      destroyed = true;
    };
  }, []);

  // Play intro music after first user interaction
  useEffect(() => {
    const startMusic = () => {
      if (audio.isInitialized && !introMusicStarted.current) {
        introMusicStarted.current = true;
        audio.playMusic("intro_theme");
      }
      window.removeEventListener("keydown", startMusic);
      window.removeEventListener("mousedown", startMusic);
      window.removeEventListener("touchstart", startMusic);
    };
    window.addEventListener("keydown", startMusic, { once: true });
    window.addEventListener("mousedown", startMusic, { once: true });
    window.addEventListener("touchstart", startMusic, { once: true });
    return () => {
      window.removeEventListener("keydown", startMusic);
      window.removeEventListener("mousedown", startMusic);
      window.removeEventListener("touchstart", startMusic);
      audio.stopMusic();
    };
    // eslint-disable-next-line
  }, [audio.isInitialized, audio]);

  // Enhanced keyboard input for global navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (currentSection !== "menu" && event.key === "Escape") {
        setCurrentSection("menu");
        audio.playSFX("menu_back");
        return;
      }

      if (currentSection === "menu") {
        // Archetype navigation
        if (event.key === "ArrowLeft") {
          setSelectedArchetype((prev) =>
            prev === 0 ? archetypeData.length - 1 : prev - 1
          );
          audio.playSFX("menu_hover");
        } else if (event.key === "ArrowRight") {
          setSelectedArchetype((prev) => (prev + 1) % archetypeData.length);
          audio.playSFX("menu_hover");
        } else {
          // Letter shortcuts for quick access
          switch (event.key.toLowerCase()) {
            case "c":
              setCurrentSection("controls");
              audio.playSFX("menu_select");
              break;
            case "p":
              setCurrentSection("philosophy");
              audio.playSFX("menu_select");
              break;
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSection, audio, archetypeData.length]);

  // Handle menu item selection
  const handleMenuItemSelect = useCallback(
    (mode: GameMode) => {
      if (mode === GameMode.CONTROLS) {
        setCurrentSection("controls");
      } else if (mode === GameMode.PHILOSOPHY) {
        setCurrentSection("philosophy");
      } else {
        onMenuSelect(mode);
      }
    },
    [onMenuSelect]
  );

  // Section navigation with audio feedback
  const handleBackToMenu = useCallback(() => {
    setCurrentSection("menu");
    audio.playSFX("menu_back");
  }, [audio]);

  // Responsive logo and layout calculations
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;

  // Smaller logo for full screen layout
  const logoSize = isMobile
    ? Math.min(screenWidth, screenHeight) * 0.3
    : isTablet
    ? Math.min(screenWidth, screenHeight) * 0.24
    : Math.min(screenWidth, screenHeight) * 0.2;

  // Enhanced cyberpunk background with neon grid
  const drawEnhancedBackground = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Base dark gradient using new PixiJS v8 gradient capabilities
      const gradient = new PIXI.FillGradient(0, 0, screenWidth, screenHeight);
      gradient.addColorStop(0, 0x0a0a0f);
      gradient.addColorStop(0.5, 0x1a1a2e);
      gradient.addColorStop(1, 0x0f0f23);
      g.fill(gradient);
      g.rect(0, 0, screenWidth, screenHeight);
      g.fill();

      // Cyberpunk grid overlay - optimized pattern
      g.stroke({ width: 1, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.15 });
      const gridSize = isMobile ? 40 : 60;
      for (let i = 0; i < screenWidth; i += gridSize) {
        g.moveTo(i, 0);
        g.lineTo(i, screenHeight);
      }
      for (let i = 0; i < screenHeight; i += gridSize) {
        g.moveTo(0, i);
        g.lineTo(screenWidth, i);
      }
      g.stroke();

      // Accent lines with proper theme integration
      g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.3 });
      g.moveTo(0, screenHeight * 0.2);
      g.lineTo(screenWidth, screenHeight * 0.2);
      g.moveTo(0, screenHeight * 0.8);
      g.lineTo(screenWidth, screenHeight * 0.8);
      g.stroke();
    },
    [screenWidth, screenHeight, isMobile]
  );

  // Function to render selected section content with proper fallback
  const renderSectionContent = () => {
    if (currentSection === "philosophy") {
      return (
        <Suspense
          fallback={
            <pixiContainer>
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                    alpha: 0.8,
                  });
                  g.roundRect(0, 0, screenWidth * 0.9, screenHeight * 0.5, 8);
                  g.fill();
                }}
              />
              <pixiText
                text="로딩 중..."
                style={{ fontSize: 24, fill: KOREAN_COLORS.TEXT_PRIMARY }}
                x={screenWidth * 0.45}
                y={screenHeight * 0.25}
                anchor={0.5}
              />
            </pixiContainer>
          }
        >
          <PhilosophySection
            onBack={handleBackToMenu}
            width={screenWidth * 0.9}
            height={screenHeight * 0.8}
            x={screenWidth * 0.05}
            y={screenHeight * 0.1}
            data-testid="philosophy-section"
          />
        </Suspense>
      );
    } else if (currentSection === "controls") {
      return (
        <Suspense
          fallback={
            <pixiContainer>
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                    alpha: 0.8,
                  });
                  g.roundRect(0, 0, screenWidth * 0.9, screenHeight * 0.5, 8);
                  g.fill();
                }}
              />
              <pixiText
                text="로딩 중..."
                style={{ fontSize: 24, fill: KOREAN_COLORS.TEXT_PRIMARY }}
                x={screenWidth * 0.45}
                y={screenHeight * 0.25}
                anchor={0.5}
              />
            </pixiContainer>
          }
        >
          <ControlsSection
            onBack={handleBackToMenu}
            width={screenWidth * 0.9}
            height={screenHeight * 0.8}
            x={screenWidth * 0.05}
            y={screenHeight * 0.1}
            data-testid="controls-section"
          />
        </Suspense>
      );
    }

    return null;
  };

  return (
    <pixiContainer
      data-testid="intro-screen"
      layout={{
        width: screenWidth,
        height: screenHeight,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 0,
        gap: isMobile ? 8 : 16,
      }}
    >
      {/* Enhanced Background Layers */}
      <pixiGraphics
        draw={drawEnhancedBackground}
        data-testid="intro-background"
        layout={{
          position: "absolute",
          top: 0,
          left: 0,
          width: screenWidth,
          height: screenHeight,
        }}
      />

      {/* Main background texture */}
      {bgTexture && (
        <pixiSprite
          texture={bgTexture}
          width={screenWidth}
          height={screenHeight}
          alpha={0.4}
          data-testid="intro-bg-texture"
          layout={{
            position: "absolute",
            top: 0,
            left: 0,
            width: screenWidth,
            height: screenHeight,
          }}
        />
      )}

      {/* Dojang wall accent texture */}
      {dojangWallTexture && (
        <pixiSprite
          texture={dojangWallTexture}
          width={screenWidth * 0.3}
          height={screenHeight}
          alpha={0.2}
          data-testid="dojang-wall-accent"
          layout={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "30%",
            height: "100%",
          }}
        />
      )}

      <pixiContainer
        layout={{
          position: "relative",
          alignSelf: "center",
          bottom: -40,
        }}
        data-testid="main-title-container"
      >
        {/* Animated Korean/English Title */}
        <KoreanHeader
          title={{ korean: "흑괘", english: "Black Trigram" }}
          subtitle={{
            korean: "한국 무술 시뮬레이터",
            english: "Korean Martial Arts Simulator",
          }}
          x={0}
          y={0}
          data-testid="main-title"
        />
      </pixiContainer>

      {/* Dynamic Logo with glow effect */}
      <pixiContainer
        data-testid="logo-section"
        layout={{
          flexGrow: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          bottom: -60,
        }}
      >
        {logoTexture && (
          <pixiSprite
            texture={logoTexture}
            scale={{ x: logoSize / 512, y: logoSize / 512 }}
            anchor={{ x: 0.5, y: 0.5 }}
            alpha={1}
            angle={Math.sin(Date.now() * 0.0005) * 2} // Subtle rotation
            data-testid="main-logo"
            layout={{
              alignSelf: "center",
              position: "relative",
            }}
          />
        )}

        {/* Trigram Symbols with pulse animation */}
        <pixiContainer
          layout={{
            position: "relative",
            alignSelf: "center",
            bottom: 100,
          }}
          data-testid="trigram-symbols"
        >
          <pixiText
            text="☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷"
            style={{
              fontSize: isMobile ? 20 : 28,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              align: "center",
              letterSpacing: isMobile ? 8 : 12,
              dropShadow: {
                color: KOREAN_COLORS.PRIMARY_CYAN,
                distance: 3 + Math.sin(Date.now() * 0.002) * 2,
                alpha: 0.5 + Math.sin(Date.now() * 0.002) * 0.3,
              },
            }}
            anchor={0.5}
            scale={{
              x: 1 + Math.sin(Date.now() * 0.001) * 0.05,
              y: 1 + Math.sin(Date.now() * 0.001) * 0.05,
            }}
            data-testid="trigram-symbols-text"
          />
        </pixiContainer>
      </pixiContainer>

      {/* Main Content Area - Full width, vertical layout */}
      <pixiContainer
        data-testid="main-content"
        layout={{
          width: "100%",
          flexGrow: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: isMobile ? 12 : 20,
          paddingLeft: isMobile ? 20 : 40,
          paddingRight: isMobile ? 20 : 40,
          paddingTop: 10,
          paddingBottom: 10, // Add bottom padding to prevent footer overlap
        }}
      >
        {/* Main Menu Section - Only shown when in menu mode */}
        {currentSection === "menu" && (
          <>
            {/* Menu Section - Top position, centered */}
            <pixiContainer
              layout={{
                width: isMobile ? "100%" : "70%",
                maxWidth: 800,
                flexShrink: 0,
              }}
            >
              <MenuSection
                menuItems={MENU_ITEMS}
                selectedIndex={selectedMenuIndex}
                onModeSelect={handleMenuItemSelect}
                onSelectedIndexChange={setSelectedMenuIndex}
                onPlaySFX={audio.playSFX}
                width={
                  isMobile
                    ? screenWidth * 0.9
                    : Math.min(800, screenWidth * 0.7)
                }
                height={isMobile ? 400 : 300}
                x={0}
                y={0}
                data-testid="main-menu-section"
              />
            </pixiContainer>

            {/* Archetype Selection - Below menu, centered */}
            <pixiContainer
              layout={{
                width: isMobile ? "100%" : "70%",
                maxWidth: 800,
                flexShrink: 0,
              }}
            >
              <ArchetypeDisplay
                archetypes={archetypeData}
                selectedIndex={selectedArchetype}
                textures={archetypeTextures}
                onArchetypeChange={setSelectedArchetype}
                onPlaySFX={audio.playSFX}
                width={
                  isMobile
                    ? screenWidth * 0.9
                    : Math.min(800, screenWidth * 0.7)
                }
                height={isMobile ? 400 : 300}
                x={0}
                y={0}
                isMobile={isMobile}
                data-testid="archetype-selection"
              />
            </pixiContainer>
          </>
        )}

        {/* Philosophy and Controls sections */}
        {currentSection !== "menu" && (
          <pixiContainer
            layout={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {renderSectionContent()}
          </pixiContainer>
        )}
      </pixiContainer>

      {/* Fixed Footer with proper spacing */}
      <pixiContainer
        data-testid="intro-footer"
        layout={{
          width: "100%",
          height: isMobile ? 60 : 70, // Increased height for better spacing
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          flexDirection: "column", // Stack vertically to prevent overlap
          gap: 6,
          paddingBottom: 10,
        }}
      >
        {/* Background for footer */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            // Subtle gradient background
            const gradient = new PIXI.FillGradient(0, 0, 0, isMobile ? 60 : 70);
            gradient.addColorStop(0, 0x000000);
            gradient.addColorStop(0.5, 0x1a1a2e);
            gradient.addColorStop(1, 0x0a0a0f);
            g.fill(gradient);
            g.rect(0, 0, screenWidth, isMobile ? 60 : 70);
            g.fill();

            // Top border
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.3,
            });
            g.moveTo(0, 0);
            g.lineTo(screenWidth, 0);
            g.stroke();
          }}
          layout={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />

        {/* Main motto text */}
        <pixiContainer
          layout={{
            width: "100%",
            height: 24,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            flexDirection: "row",
          }}
        >
          <pixiText
            text="흑괘의 길을 걸어라 - Walk the Path of the Black Trigram"
            style={{
              fontSize: isMobile ? 11 : 14,
              fill: KOREAN_COLORS.ACCENT_CYAN,
              align: "center",
              fontStyle: "italic",
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
            }}
            anchor={0.5}
            data-testid="footer-motto"
            x={screenWidth / 2}
            y={0}
          />
        </pixiContainer>

        {/* Version and link text */}
        <pixiContainer
          layout={{
            position: "relative",
            alignSelf: "center",
            bottom: 5,
          }}
        >
          <pixiText
            text="Open Source Korean Martial Arts Game by Hack23"
            style={{
              fontSize: isMobile ? 9 : 12,
              fill: KOREAN_COLORS.SECONDARY_MAGENTA,
              align: "center",
              fontWeight: "bold",
            }}
            interactive={true}
            onPointerTap={() =>
              window.open("https://github.com/Hack23/blacktrigram", "_blank")
            }
            anchor={0.5}
            data-testid="footer-link"
          />
        </pixiContainer>

        <pixiContainer
          layout={{
            position: "relative",
            alignSelf: "center",
            bottom: -10,
          }}
        >
          <pixiText
            text={`Version ${APP_VERSION}`}
            style={{
              fontSize: isMobile ? 9 : 12,
              fill: KOREAN_COLORS.SECONDARY_MAGENTA,
              align: "center",
              fontWeight: "bold",
            }}
            interactive={true}
            onPointerTap={() =>
              window.open(
                `https://github.com/Hack23/blacktrigram/releases/tag/v${APP_VERSION}`,
                "_blank"
              )
            }
            anchor={0.5}
            data-testid="footer-link"
          />
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
};

export default IntroScreen;
