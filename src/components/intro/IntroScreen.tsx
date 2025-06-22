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
  useRef,
  useState,
} from "react";
import { MenuSection } from "./components/MenuSection";

// Lazy load heavy sections
const PhilosophySection = lazy(() => import("./components/PhilosophySection"));
const ControlsSection = lazy(() => import("./components/ControlsSection"));

import { useAudio } from "../../audio/AudioProvider";
import { KOREAN_COLORS } from "../../types/constants";
import { GameMode } from "../../types/enums";
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

const ARCHETYPE_DATA = [
  {
    id: "musa",
    korean: "무사",
    english: "Warrior",
    description: "전통적인 명예로운 전사",
    color: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    textureKey: "musa",
  },
  {
    id: "amsalja",
    korean: "암살자",
    english: "Shadow Assassin",
    description: "은밀한 그림자 전투원",
    color: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    textureKey: "amsalja",
  },
  {
    id: "hacker",
    korean: "해커",
    english: "Cyber Warrior",
    description: "기술 강화 사이버 전사",
    color: KOREAN_COLORS.PRIMARY_CYAN,
    textureKey: "hacker",
  },
  {
    id: "jeongbo_yowon",
    korean: "정보요원",
    english: "Intelligence Operative",
    description: "전략적 정보 분석가",
    color: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    textureKey: "jeongboYowon",
  },
  {
    id: "jojik_pokryeokbae",
    korean: "조직폭력배",
    english: "Organized Crime",
    description: "무자비한 거리 생존자",
    color: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    textureKey: "jojikPokryeokbae",
  },
] as const;

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

  // Enhanced keyboard input for menu navigation and controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (currentSection !== "menu" && event.key === "Escape") {
        setCurrentSection("menu");
        audio.playSFX("menu_back");
        return;
      }

      if (currentSection === "menu") {
        // Menu navigation with arrow keys
        if (event.key === "ArrowUp") {
          setSelectedMenuIndex((prev) => {
            const next = prev === 0 ? MENU_ITEMS.length - 1 : prev - 1;
            audio.playSFX("menu_hover");
            return next;
          });
        } else if (event.key === "ArrowDown") {
          setSelectedMenuIndex((prev) => {
            const next = prev === MENU_ITEMS.length - 1 ? 0 : prev + 1;
            audio.playSFX("menu_hover");
            return next;
          });
        } else if (event.key === " " || event.key === "Enter") {
          // Select the current menu item
          audio.playSFX("menu_select");
          handleMenuItemSelect(MENU_ITEMS[selectedMenuIndex].mode);
        } else if (event.key === "ArrowLeft") {
          // Navigate archetype selection
          setSelectedArchetype((prev) =>
            prev === 0 ? ARCHETYPE_DATA.length - 1 : prev - 1
          );
          audio.playSFX("menu_hover");
        } else if (event.key === "ArrowRight") {
          // Navigate archetype selection
          setSelectedArchetype((prev) => (prev + 1) % ARCHETYPE_DATA.length);
          audio.playSFX("menu_hover");
        } else {
          // Numeric shortcuts
          switch (event.key) {
            case "1":
              setSelectedMenuIndex(0);
              audio.playSFX("menu_select");
              handleMenuItemSelect(GameMode.VERSUS);
              break;
            case "2":
              setSelectedMenuIndex(1);
              audio.playSFX("menu_select");
              handleMenuItemSelect(GameMode.TRAINING);
              break;
            case "3":
              setSelectedMenuIndex(2);
              audio.playSFX("menu_select");
              handleMenuItemSelect(GameMode.CONTROLS);
              break;
            case "4":
              setSelectedMenuIndex(3);
              audio.playSFX("menu_select");
              handleMenuItemSelect(GameMode.PHILOSOPHY);
              break;
            case "c":
            case "C":
              setCurrentSection("controls");
              audio.playSFX("menu_select");
              break;
            case "p":
            case "P":
              setCurrentSection("philosophy");
              audio.playSFX("menu_select");
              break;
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onMenuSelect, currentSection, audio, selectedMenuIndex]);

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

  // Menu click handler with audio feedback
  const handleMenuClick = useCallback(
    (mode: GameMode) => {
      const idx = MENU_ITEMS.findIndex((item) => item.mode === mode);
      setSelectedMenuIndex(idx >= 0 ? idx : 0);
      audio.playSFX("menu_select");
      handleMenuItemSelect(mode);
    },
    [audio, handleMenuItemSelect]
  );

  // Section navigation with audio feedback
  const handleBackToMenu = useCallback(() => {
    setCurrentSection("menu");
    audio.playSFX("menu_back");
  }, [audio]);

  // Responsive logo and layout calculations
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;

  // Reduce logo size to 75% of current
  const logoSize = isMobile
    ? Math.min(screenWidth, screenHeight) * 0.35 * 0.75
    : isTablet
    ? Math.min(screenWidth, screenHeight) * 0.25 * 0.75
    : Math.min(screenWidth, screenHeight) * 0.2 * 0.75;

  // Adjust layout for better positioning
  const menuStartY = screenHeight * (isMobile ? 0.48 : isTablet ? 0.43 : 0.38);
  const archetypeStartY = menuStartY + (isMobile ? 260 : isTablet ? 280 : 300);

  // Enhanced cyberpunk background with neon grid
  const drawEnhancedBackground = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Base dark gradient
      const gradient = new PIXI.FillGradient(0, 0, screenWidth, screenHeight);
      gradient.addColorStop(0, 0x0a0a0f);
      gradient.addColorStop(0.5, 0x1a1a2e);
      gradient.addColorStop(1, 0x0f0f23);
      g.fill(gradient);
      g.rect(0, 0, screenWidth, screenHeight);
      g.fill();

      // Cyberpunk neon grid
      g.stroke({ width: 1, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.15 });
      const gridSize = isMobile ? 30 : 40;
      for (let i = 0; i < screenWidth; i += gridSize) {
        g.moveTo(i, 0);
        g.lineTo(i, screenHeight);
      }
      for (let i = 0; i < screenHeight; i += gridSize) {
        g.moveTo(0, i);
        g.lineTo(screenWidth, i);
      }
      g.stroke();

      // Pulsing accent lines
      g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.3 });
      g.moveTo(0, screenHeight * 0.2);
      g.lineTo(screenWidth, screenHeight * 0.2);
      g.moveTo(0, screenHeight * 0.8);
      g.lineTo(screenWidth, screenHeight * 0.8);
      g.stroke();
    },
    [screenWidth, screenHeight, isMobile]
  );

  // Calculate optimal archetype image dimensions - increased for more visibility
  const getArchetypeImageDimensions = () => {
    // Increased size by approximately 20%
    const baseWidth = isMobile ? 140 : isTablet ? 180 : 220;
    const baseHeight = isMobile ? 230 : isTablet ? 290 : 360;

    return {
      width: baseWidth,
      height: baseHeight,
      scale: baseWidth / 331, // Based on original image width
    };
  };

  // Increased archetype display width
  const archetypeDisplayWidth = isMobile
    ? screenWidth * 0.95
    : isTablet
    ? screenWidth * 0.8
    : screenWidth * 0.5;

  const archImageDims = getArchetypeImageDimensions();

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
      width={screenWidth}
      height={screenHeight}
      data-testid="intro-screen"
      layout={{
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        gap: 16,
      }}
    >
      {/* Enhanced Background Layers */}
      <pixiGraphics
        draw={drawEnhancedBackground}
        data-testid="intro-background"
      />

      {/* Main background texture */}
      {bgTexture && (
        <pixiSprite
          texture={bgTexture}
          x={0}
          y={0}
          width={screenWidth}
          height={screenHeight}
          alpha={0.4}
          data-testid="intro-bg-texture"
        />
      )}

      {/* Dojang wall accent texture */}
      {dojangWallTexture && (
        <pixiSprite
          texture={dojangWallTexture}
          x={screenWidth * 0.8}
          y={0}
          width={screenWidth * 0.3}
          height={screenHeight}
          alpha={0.2}
          data-testid="dojang-wall-accent"
        />
      )}

      {/* Logo Section - Centered at top and reduced to 75% size */}
      <pixiContainer
        x={screenWidth / 2}
        y={screenHeight * 0.16} // Positioned higher
        data-testid="logo-section"
      >
        {logoTexture && (
          <pixiSprite
            texture={logoTexture}
            x={0}
            y={0}
            scale={{ x: logoSize / 512, y: logoSize / 512 }}
            anchor={{ x: 0.5, y: 0.5 }}
            alpha={1}
            data-testid="main-logo"
          />
        )}

        {/* Enhanced glow effect around logo */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({
              color: KOREAN_COLORS.PRIMARY_CYAN,
              alpha: 0.1,
            });
            g.circle(0, 0, logoSize * 0.6);
            g.fill();
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.6,
            });
            g.circle(0, 0, logoSize * 0.8);
            g.stroke();
          }}
          data-testid="logo-glow-effect"
        />

        {/* Trigram Symbols with Better Spacing */}
        <pixiContainer y={logoSize * 0.7} data-testid="trigram-symbols">
          <pixiText
            text="☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷"
            style={{
              fontSize: isMobile ? 20 : 28,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              align: "center",
              letterSpacing: isMobile ? 8 : 12,
            }}
            anchor={0.5}
            data-testid="trigram-symbols-text"
          />
        </pixiContainer>
      </pixiContainer>

      {/* Enhanced Title with Better Typography */}
      <KoreanHeader
        title={{ korean: "흑괘", english: "Black Trigram" }}
        subtitle={{
          korean: "한국 무술 시뮬레이터",
          english: "Korean Martial Arts Simulator",
        }}
        x={screenWidth / 2}
        y={screenHeight * (isMobile ? 0.33 : 0.3)} // Adjusted position
        data-testid="main-title"
      />

      {/* Main Menu Section - Only shown when in menu mode */}
      {currentSection === "menu" && (
        <>
          {/* Menu Section */}
          <MenuSection
            menuItems={MENU_ITEMS}
            selectedIndex={selectedMenuIndex}
            onModeSelect={handleMenuClick}
            width={
              isMobile ? screenWidth * 0.9 : isTablet ? screenWidth * 0.6 : 400
            }
            height={320} // Increased height
            x={
              screenWidth / 2 -
              (isMobile
                ? screenWidth * 0.45
                : isTablet
                ? screenWidth * 0.3
                : 200)
            }
            y={menuStartY}
            data-testid="main-menu-section"
          />

          {/* Archetype Selection - Now positioned below menu with increased size */}
          <pixiContainer
            x={screenWidth / 2 - archetypeDisplayWidth / 2}
            y={archetypeStartY}
            data-testid="archetype-group"
          >
            {/* Archetype Selection Header */}
            <pixiContainer data-testid="archetype-header">
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                    alpha: 0.9,
                  });
                  g.roundRect(0, 0, archetypeDisplayWidth, 40, 8);
                  g.fill();
                  g.stroke({
                    width: 2,
                    color: KOREAN_COLORS.ACCENT_GOLD,
                    alpha: 0.8,
                  });
                  g.roundRect(0, 0, archetypeDisplayWidth, 40, 8);
                  g.stroke();
                }}
              />
              <pixiText
                text="무사 선택 - Archetype Selection"
                style={{
                  fontSize: isMobile ? 12 : 16,
                  fill: KOREAN_COLORS.ACCENT_GOLD,
                  align: "center",
                  fontWeight: "bold",
                }}
                x={archetypeDisplayWidth / 2}
                y={20}
                anchor={0.5}
              />
            </pixiContainer>

            {/* Archetype Display - Side by Side Layout with increased size */}
            <pixiContainer y={50} data-testid="archetype-display">
              {/* Background panel */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  const selectedData = ARCHETYPE_DATA[selectedArchetype];
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                    alpha: 0.9,
                  });
                  g.roundRect(
                    0,
                    0,
                    archetypeDisplayWidth,
                    isMobile ? 300 : 240, // Increased height
                    8
                  );
                  g.fill();
                  g.stroke({
                    width: 2,
                    color: selectedData.color,
                    alpha: 0.8,
                  });
                  g.roundRect(
                    0,
                    0,
                    archetypeDisplayWidth,
                    isMobile ? 300 : 240, // Increased height
                    8
                  );
                  g.stroke();
                }}
              />

              {/* Side-by-side or stacked layout depending on screen size */}
              {archetypeTextures[
                ARCHETYPE_DATA[selectedArchetype]
                  .textureKey as keyof typeof archetypeTextures
              ] && (
                <pixiSprite
                  texture={
                    archetypeTextures[
                      ARCHETYPE_DATA[selectedArchetype]
                        .textureKey as keyof typeof archetypeTextures
                    ]!
                  }
                  width={archImageDims.width}
                  height={archImageDims.height}
                  x={
                    isMobile
                      ? (archetypeDisplayWidth - archImageDims.width) / 2
                      : 30
                  }
                  y={isMobile ? 10 : 20}
                  interactive={true}
                  onPointerDown={() => {
                    setSelectedArchetype(
                      (prev) => (prev + 1) % ARCHETYPE_DATA.length
                    );
                    audio.playSFX("menu_hover");
                  }}
                  data-testid="archetype-image"
                />
              )}

              {/* Archetype Info positioned based on screen size */}
              <pixiContainer
                x={isMobile ? 0 : archImageDims.width + 60}
                y={isMobile ? archImageDims.height + 20 : 20}
                data-testid="archetype-info"
              >
                <pixiText
                  text={`${ARCHETYPE_DATA[selectedArchetype].korean} - ${ARCHETYPE_DATA[selectedArchetype].english}`}
                  style={{
                    fontSize: isMobile ? 14 : 16,
                    fill: ARCHETYPE_DATA[selectedArchetype].color,
                    fontWeight: "bold",
                    align: "center",
                  }}
                  x={isMobile ? archetypeDisplayWidth / 2 : 0}
                  y={0}
                  anchor={isMobile ? { x: 0.5, y: 0 } : { x: 0, y: 0 }}
                />

                <pixiText
                  text={ARCHETYPE_DATA[selectedArchetype].description}
                  style={{
                    fontSize: isMobile ? 12 : 14,
                    fill: KOREAN_COLORS.TEXT_SECONDARY,
                    align: isMobile ? "center" : "left",
                    wordWrap: true,
                    wordWrapWidth: isMobile
                      ? archetypeDisplayWidth - 40
                      : archetypeDisplayWidth - archImageDims.width - 90,
                  }}
                  x={isMobile ? archetypeDisplayWidth / 2 : 0}
                  y={isMobile ? 30 : 30}
                  anchor={isMobile ? { x: 0.5, y: 0 } : { x: 0, y: 0 }}
                />

                <pixiText
                  text={`${selectedArchetype + 1} / ${ARCHETYPE_DATA.length}`}
                  style={{
                    fontSize: 12,
                    fill: KOREAN_COLORS.TEXT_SECONDARY,
                    align: isMobile ? "center" : "left",
                  }}
                  x={isMobile ? archetypeDisplayWidth / 2 : 0}
                  y={isMobile ? 80 : 100}
                  anchor={isMobile ? { x: 0.5, y: 0 } : { x: 0, y: 0 }}
                />
              </pixiContainer>
            </pixiContainer>

            {/* Archetype Navigation Buttons with responsive positioning */}
            <pixiContainer
              y={isMobile ? 360 : 300}
              data-testid="archetype-navigation"
            >
              {/* Previous Button */}
              <pixiContainer
                x={archetypeDisplayWidth * 0.25 - 30}
                data-testid="prev-archetype-button"
              >
                <pixiGraphics
                  draw={(g) => {
                    g.clear();
                    g.fill({
                      color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                      alpha: 0.8,
                    });
                    g.roundRect(0, 0, 60, 30, 5);
                    g.fill();
                  }}
                  interactive={true}
                  onPointerDown={() => {
                    setSelectedArchetype((prev) =>
                      prev === 0 ? ARCHETYPE_DATA.length - 1 : prev - 1
                    );
                    audio.playSFX("menu_hover");
                  }}
                />
                <pixiText
                  text="◀ 이전"
                  style={{
                    fontSize: 12,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    align: "center",
                  }}
                  x={30}
                  y={15}
                  anchor={0.5}
                />
              </pixiContainer>

              {/* Next Button */}
              <pixiContainer
                x={archetypeDisplayWidth * 0.75 - 30}
                data-testid="next-archetype-button"
              >
                <pixiGraphics
                  draw={(g) => {
                    g.clear();
                    g.fill({
                      color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                      alpha: 0.8,
                    });
                    g.roundRect(0, 0, 60, 30, 5);
                    g.fill();
                  }}
                  interactive={true}
                  onPointerDown={() => {
                    setSelectedArchetype(
                      (prev) => (prev + 1) % ARCHETYPE_DATA.length
                    );
                    audio.playSFX("menu_hover");
                  }}
                />
                <pixiText
                  text="다음 ▶"
                  style={{
                    fontSize: 12,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    align: "center",
                  }}
                  x={30}
                  y={15}
                  anchor={0.5}
                />
              </pixiContainer>
            </pixiContainer>
          </pixiContainer>
        </>
      )}

      {/* Philosophy and Controls sections */}
      {currentSection !== "menu" && renderSectionContent()}

      {/* Enhanced Footer with Better Mobile Layout */}
      <pixiContainer
        x={screenWidth / 2}
        y={screenHeight - (isMobile ? 40 : 60)}
        data-testid="intro-footer"
      >
        <pixiText
          text="흑괘의 길을 걸어라 - Walk the Path of the Black Trigram"
          style={{
            fontSize: isMobile ? 10 : 14,
            fill: KOREAN_COLORS.ACCENT_CYAN,
            align: "center",
            fontStyle: "italic",
          }}
          x={0}
          y={isMobile ? -20 : -25}
          anchor={0.5}
          data-testid="footer-motto"
        />

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
          x={0}
          y={isMobile ? -8 : -10}
          anchor={0.5}
          data-testid="footer-link"
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default IntroScreen;
