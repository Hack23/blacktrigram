import "@pixi/layout";
import { LayoutContainer } from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend } from "@pixi/react";
import { Button, FancyButton } from "@pixi/ui";
import { Container, Graphics, Sprite, Text, TilingSprite } from "pixi.js";

// Register custom components for use as JSX tags in @pixi/react
extend({
  Container,
  Graphics,
  Text,
  Sprite,
  TilingSprite,
  Button,
  FancyButton,
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

const APP_VERSION = import.meta.env.APP_VERSION;

// Lazy load heavy sections
const PhilosophySection = lazy(() => import("./components/PhilosophySection"));
const ControlsSection = lazy(() => import("./components/ControlsSection"));

import { useAudio } from "../../audio/AudioProvider";
import { PLAYER_ARCHETYPES_DATA } from "../../systems/types";
import { GameMode, PlayerArchetype } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";
import ArchetypeDisplay from "./components/ArchetypeDisplay";

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

// Asset loading hook
function useIntroAssets() {
  const [bgTexture, setBgTexture] = useState<PIXI.Texture | null>(null);
  const [logoTexture, setLogoTexture] = useState<PIXI.Texture | null>(null);
  const [dojangWallTexture, setDojangWallTexture] =
    useState<PIXI.Texture | null>(null);
  const [archetypeTextures, setArchetypeTextures] = useState<
    Partial<Record<PlayerArchetype, PIXI.Texture>>
  >({});

  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Load background
        const bgTex = await PIXI.Assets.load(
          "/assets/visual/bg/intro/intro_bg_loop.png"
        );
        setBgTexture(bgTex);

        // Load logo
        const logoTex = await PIXI.Assets.load(
          "/assets/visual/logo/black-trigram.png"
        );
        setLogoTexture(logoTex);

        // Load dojang texture
        const dojangTex = await PIXI.Assets.load(
          "/assets/visual/bg/dojang/dojang_wall_tex.png"
        );
        setDojangWallTexture(dojangTex);

        // Load archetype textures with proper PlayerArchetype keys
        const textureMapping: Record<PlayerArchetype, string> = {
          [PlayerArchetype.MUSA]: "/assets/visual/archetypes/musa.png",
          [PlayerArchetype.AMSALJA]: "/assets/visual/archetypes/amsalja.png",
          [PlayerArchetype.HACKER]: "/assets/visual/archetypes/hacker.png",
          [PlayerArchetype.JEONGBO_YOWON]:
            "/assets/visual/archetypes/jeongbo_yowon.png",
          [PlayerArchetype.JOJIK_POKRYEOKBAE]:
            "/assets/visual/archetypes/jojik_pokryeokbae.png",
        };

        const loadedTextures: Partial<Record<PlayerArchetype, PIXI.Texture>> =
          {};
        for (const [archetype, path] of Object.entries(textureMapping)) {
          try {
            const texture = await PIXI.Assets.load(path);
            loadedTextures[archetype as PlayerArchetype] = texture;
          } catch (error) {
            console.warn(`Failed to load texture for ${archetype}: ${error}`);
          }
        }

        setArchetypeTextures(loadedTextures);
      } catch (error) {
        console.error("Error loading intro assets:", error);
      }
    };

    loadAssets();
  }, []);

  return { bgTexture, logoTexture, dojangWallTexture, archetypeTextures };
}

export interface IntroScreenProps {
  readonly onMenuSelect: (mode: GameMode) => void;
  readonly width?: number;
  readonly height?: number;
}

// Constants moved to top level
const MENU_ITEMS: { mode: GameMode; korean: string; english: string }[] = [
  { mode: GameMode.VERSUS, korean: "대전", english: "Combat" },
  { mode: GameMode.TRAINING, korean: "훈련", english: "Training" },
  { mode: GameMode.CONTROLS, korean: "조작", english: "Controls" },
  { mode: GameMode.PHILOSOPHY, korean: "철학", english: "Philosophy" },
];

// Get array of player archetypes in display order
const ARCHETYPE_ORDER: PlayerArchetype[] = [
  PlayerArchetype.MUSA,
  PlayerArchetype.AMSALJA,
  PlayerArchetype.HACKER,
  PlayerArchetype.JEONGBO_YOWON,
  PlayerArchetype.JOJIK_POKRYEOKBAE,
];

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onMenuSelect,
  width: propWidth,
  height: propHeight,
}) => {
  const audio = useAudio();
  const introMusicStarted = useRef(false);
  const [currentSection, setCurrentSection] = useState<string>("menu");
  const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState(0);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);

  const { width, height } = useWindowSize();
  const screenWidth = propWidth ?? width;
  const screenHeight = propHeight ?? height;

  const { bgTexture, logoTexture, dojangWallTexture, archetypeTextures } =
    useIntroAssets();

  // Get current archetype
  const currentArchetype = ARCHETYPE_ORDER[selectedArchetypeIndex];
  const currentArchetypeData = PLAYER_ARCHETYPES_DATA[currentArchetype];

  // Responsive calculations
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const logoSize = isMobile
    ? Math.min(screenWidth, screenHeight) * 0.35 * 0.75
    : isTablet
    ? Math.min(screenWidth, screenHeight) * 0.25 * 0.75
    : Math.min(screenWidth, screenHeight) * 0.2 * 0.75;
  const menuStartY = screenHeight * (isMobile ? 0.48 : isTablet ? 0.43 : 0.38);
  const archetypeStartY = menuStartY + (isMobile ? 260 : isTablet ? 280 : 300);

  // Start intro music - Fixed implementation
  useEffect(() => {
    if (audio.isInitialized && !introMusicStarted.current) {
      try {
        audio.playMusic("intro");
        introMusicStarted.current = true;
      } catch (error) {
        console.warn("Failed to play intro music:", error);
      }
    }
  }, [audio.isInitialized, audio]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentSection === "controls" || currentSection === "philosophy") {
        if (e.key === "Escape") {
          setCurrentSection("menu");
          audio.playSFX("ui_cancel");
        }
        return;
      }

      switch (e.key) {
        case "ArrowUp":
          setSelectedMenuIndex(
            (prev) => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length
          );
          audio.playSFX("ui_navigate");
          break;
        case "ArrowDown":
          setSelectedMenuIndex((prev) => (prev + 1) % MENU_ITEMS.length);
          audio.playSFX("ui_navigate");
          break;
        case "ArrowLeft":
          setSelectedArchetypeIndex(
            (prev) =>
              (prev - 1 + ARCHETYPE_ORDER.length) % ARCHETYPE_ORDER.length
          );
          audio.playSFX("ui_navigate");
          break;
        case "ArrowRight":
          setSelectedArchetypeIndex(
            (prev) => (prev + 1) % ARCHETYPE_ORDER.length
          );
          audio.playSFX("ui_navigate");
          break;
        case "Enter":
        case " ":
          handleMenuItemSelect(MENU_ITEMS[selectedMenuIndex].mode);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSection, selectedMenuIndex, audio]);

  // Handlers
  const handleMenuItemSelect = useCallback(
    (mode: GameMode) => {
      if (mode === GameMode.CONTROLS) {
        setCurrentSection("controls");
        audio.playSFX("ui_confirm");
      } else if (mode === GameMode.PHILOSOPHY) {
        setCurrentSection("philosophy");
        audio.playSFX("ui_confirm");
      } else {
        onMenuSelect(mode);
        audio.playSFX("ui_confirm");
      }
    },
    [onMenuSelect, audio]
  );

  const handleBackToMenu = useCallback(() => {
    setCurrentSection("menu");
    audio.playSFX("ui_cancel");
  }, [audio]);

  // Enhanced cyberpunk background with proper gradient
  const drawEnhancedBackground = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Base gradient - create manually since GradientFactory doesn't exist
      // Draw gradient rectangles from dark to medium
      const gradientSteps = 10;
      for (let i = 0; i < gradientSteps; i++) {
        const ratio = i / gradientSteps;
        const color = interpolateColor(
          KOREAN_COLORS.UI_BACKGROUND_DARK,
          KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          ratio
        );
        g.fill({ color, alpha: 1 });
        g.rect(
          0,
          (screenHeight / gradientSteps) * i,
          screenWidth,
          screenHeight / gradientSteps + 1
        );
        g.fill();
      }

      // Enhanced cyberpunk grid overlay
      g.stroke({ width: 1, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.15 });
      const gridSize = isMobile ? 40 : 60;
      for (let x = 0; x < screenWidth; x += gridSize) {
        g.moveTo(x, 0);
        g.lineTo(x, screenHeight);
      }
      for (let y = 0; y < screenHeight; y += gridSize) {
        g.moveTo(0, y);
        g.lineTo(screenWidth, y);
      }
      g.stroke();

      // Neon accent lines
      g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.3 });
      g.moveTo(0, screenHeight * 0.2);
      g.lineTo(screenWidth, screenHeight * 0.2);
      g.moveTo(0, screenHeight * 0.8);
      g.lineTo(screenWidth, screenHeight * 0.8);
      g.stroke();

      // Neon accent circles
      const numAccents = isMobile ? 3 : 5;
      for (let i = 0; i < numAccents; i++) {
        const x = (screenWidth / (numAccents + 1)) * (i + 1);
        const y = screenHeight - 50;
        g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.3 });
        g.circle(x, y, 20);
        g.fill();
      }
    },
    [screenWidth, screenHeight, isMobile]
  );

  // Render sections
  if (currentSection === "controls") {
    return (
      <Suspense fallback={<pixiText text="Loading..." />}>
        <ControlsSection
          onBack={handleBackToMenu}
          x={0}
          y={0}
          width={screenWidth}
          height={screenHeight}
        />
      </Suspense>
    );
  }

  if (currentSection === "philosophy") {
    return (
      <Suspense fallback={<pixiText text="Loading..." />}>
        <PhilosophySection
          onBack={handleBackToMenu}
          x={0}
          y={0}
          width={screenWidth}
          height={screenHeight}
        />
      </Suspense>
    );
  }

  // Main menu render
  return (
    <pixiContainer data-testid="intro-screen">
      {/* Enhanced Background */}
      <pixiGraphics draw={drawEnhancedBackground} />

      {/* Background texture if loaded */}
      {bgTexture && (
        <pixiTilingSprite
          texture={bgTexture}
          width={screenWidth}
          height={screenHeight}
          tileScale={{ x: 0.3, y: 0.3 }}
          alpha={0.05}
        />
      )}

      {/* Tiling dojang texture background */}
      {dojangWallTexture && (
        <pixiTilingSprite
          texture={dojangWallTexture}
          width={screenWidth}
          height={screenHeight}
          tileScale={{ x: 0.5, y: 0.5 }}
          alpha={0.1}
        />
      )}

      {/* Logo with enhanced glow effect */}
      <pixiContainer x={screenWidth / 2} y={screenHeight * 0.15}>
        {logoTexture && (
          <pixiSprite
            texture={logoTexture}
            x={0}
            y={0}
            width={logoSize}
            height={logoSize}
            anchor={0.5}
            data-testid="game-logo"
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

        {/* Trigram Symbols */}
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

      {/* Title */}
      <pixiContainer x={screenWidth / 2} y={screenHeight * 0.28}>
        <pixiText
          text="흑괘 무술 도장"
          style={{
            fontFamily: "Noto Sans KR, NanumGothic, sans-serif",
            fontSize: isMobile ? 28 : isTablet ? 36 : 48,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            align: "center",
            fontWeight: "bold",
          }}
          anchor={0.5}
        />
        <pixiText
          text="Black Trigram Dojo"
          style={{
            fontFamily: "Noto Sans KR, NanumGothic, sans-serif",
            fontSize: isMobile ? 16 : isTablet ? 20 : 24,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
          }}
          y={isMobile ? 35 : isTablet ? 45 : 55}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Menu Section */}
      <MenuSection
        menuItems={MENU_ITEMS}
        selectedIndex={selectedMenuIndex}
        onModeSelect={handleMenuItemSelect}
        width={isMobile ? screenWidth * 0.9 : 400}
        height={220}
        x={screenWidth / 2 - (isMobile ? screenWidth * 0.45 : 200)}
        y={menuStartY}
      />

      {/* Archetype Display - using proper PlayerArchetype and data */}
      <ArchetypeDisplay
        archetype={currentArchetype}
        archetypeData={currentArchetypeData}
        texture={archetypeTextures[currentArchetype] || null}
        total={ARCHETYPE_ORDER.length}
        index={selectedArchetypeIndex}
        onPrev={() => {
          setSelectedArchetypeIndex(
            (prev) =>
              (prev - 1 + ARCHETYPE_ORDER.length) % ARCHETYPE_ORDER.length
          );
          audio.playSFX("ui_navigate");
        }}
        onNext={() => {
          setSelectedArchetypeIndex(
            (prev) => (prev + 1) % ARCHETYPE_ORDER.length
          );
          audio.playSFX("ui_navigate");
        }}
        width={screenWidth}
        height={isMobile ? 250 : 300}
        x={0}
        y={archetypeStartY}
      />

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

        <pixiText
          text={`Version ${APP_VERSION || "1.0.0"}`}
          style={{
            fontSize: isMobile ? 9 : 12,
            fill: KOREAN_COLORS.SECONDARY_MAGENTA,
            align: "center",
            fontWeight: "bold",
          }}
          interactive={true}
          onPointerTap={() =>
            window.open(
              `https://github.com/Hack23/blacktrigram/releases/tag/v${
                APP_VERSION || "1.0.0"
              }`,
              "_blank"
            )
          }
          x={0}
          y={isMobile ? 8 : 10}
          anchor={0.5}
          data-testid="footer-version-link"
        />
      </pixiContainer>
    </pixiContainer>
  );
};

// Helper function to interpolate between two colors
function interpolateColor(
  color1: number,
  color2: number,
  ratio: number
): number {
  const r1 = (color1 >> 16) & 0xff;
  const g1 = (color1 >> 8) & 0xff;
  const b1 = color1 & 0xff;

  const r2 = (color2 >> 16) & 0xff;
  const g2 = (color2 >> 8) & 0xff;
  const b2 = color2 & 0xff;

  const r = Math.floor(r1 + (r2 - r1) * ratio);
  const g = Math.floor(g1 + (g2 - g1) * ratio);
  const b = Math.floor(b1 + (b2 - b1) * ratio);

  return (r << 16) | (g << 8) | b;
}

export default IntroScreen;
