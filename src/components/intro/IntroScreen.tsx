/* eslint-disable react-hooks/exhaustive-deps */
import "@pixi/layout";
import {
  LayoutContainer,
  LayoutGraphics,
  LayoutSprite,
  LayoutText,
} from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend } from "@pixi/react";
import { FancyButton } from "@pixi/ui";
import { Container, Graphics, GraphicsContext, Sprite, Text } from "pixi.js";

// Register both layout and regular components
extend({
  Container,
  LayoutContainer,
  Graphics,
  LayoutGraphics,
  Sprite,
  LayoutSprite,
  Text,
  LayoutText,
  FancyButton,
});

import * as PIXI from "pixi.js";
import React, {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ArchetypeDisplay from "./components/ArchetypeDisplay";
import { MenuSection } from "./components/MenuSection";

import { useAudio } from "../../audio/AudioProvider";
import { PLAYER_ARCHETYPES_DATA } from "../../systems/types";
import { GameMode, PlayerArchetype } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";

/* ------------------------------------------------------------------ */
/*  1.  Utility hooks                                                 */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/*  2.  Asset-loader hook                                             */
/* ------------------------------------------------------------------ */
function useIntroAssets() {
  const [bgTexture, setBgTexture] = useState<PIXI.Texture | null>(null);
  const [logoTexture, setLogoTexture] = useState<PIXI.Texture | null>(null);
  const [dojangWallTexture, setDojangWallTexture] =
    useState<PIXI.Texture | null>(null);
  const [archetypeTextures, setArchetypeTextures] = useState<
    Partial<Record<PlayerArchetype, PIXI.Texture>>
  >({});

  useEffect(() => {
    /* eslint-disable @typescript-eslint/no-floating-promises */
    (async () => {
      try {
        setBgTexture(
          await PIXI.Assets.load("/assets/visual/bg/intro/intro_bg_loop.png")
        );
        setLogoTexture(
          await PIXI.Assets.load("/assets/visual/logo/black-trigram.png")
        );
        setDojangWallTexture(
          await PIXI.Assets.load("/assets/visual/bg/dojang/dojang_wall_tex.png")
        );

        const paths: Record<PlayerArchetype, string> = {
          [PlayerArchetype.MUSA]: "/assets/visual/archetypes/musa.png",
          [PlayerArchetype.AMSALJA]: "/assets/visual/archetypes/amsalja.png",
          [PlayerArchetype.HACKER]: "/assets/visual/archetypes/hacker.png",
          [PlayerArchetype.JEONGBO_YOWON]:
            "/assets/visual/archetypes/jeongbo_yowon.png",
          [PlayerArchetype.JOJIK_POKRYEOKBAE]:
            "/assets/visual/archetypes/jojik_pokryeokbae.png",
        };

        const loaded: Partial<Record<PlayerArchetype, PIXI.Texture>> = {};
        await Promise.all(
          Object.entries(paths).map(async ([k, p]) => {
            loaded[k as PlayerArchetype] = await PIXI.Assets.load(p);
          })
        );
        setArchetypeTextures(loaded);
      } catch (err) {
        console.error("Intro asset load error:", err);
      }
    })();
    /* eslint-enable */
  }, []);

  return { bgTexture, logoTexture, dojangWallTexture, archetypeTextures };
}

/* ------------------------------------------------------------------ */
/*  3.  Constants                                                     */
/* ------------------------------------------------------------------ */
const MENU_ITEMS: ReadonlyArray<{
  mode: GameMode;
  korean: string;
  english: string;
}> = [
  { mode: GameMode.VERSUS, korean: "대전", english: "Combat" },
  { mode: GameMode.TRAINING, korean: "훈련", english: "Training" },
  { mode: GameMode.CONTROLS, korean: "조작", english: "Controls" },
  { mode: GameMode.PHILOSOPHY, korean: "철학", english: "Philosophy" },
];

const ARCHETYPE_ORDER: PlayerArchetype[] = [
  PlayerArchetype.MUSA,
  PlayerArchetype.AMSALJA,
  PlayerArchetype.HACKER,
  PlayerArchetype.JEONGBO_YOWON,
  PlayerArchetype.JOJIK_POKRYEOKBAE,
];

/* ------------------------------------------------------------------ */
/*  4.  Lazy components                                               */
/* ------------------------------------------------------------------ */
const PhilosophySection = lazy(() => import("./components/PhilosophySection"));
const ControlsSection = lazy(() => import("./components/ControlsSection"));

/* ------------------------------------------------------------------ */
/*  6.  IntroScreen Component                                         */
/* ------------------------------------------------------------------ */
export interface IntroScreenProps {
  readonly onMenuSelect: (mode: GameMode) => void;
  readonly width?: number;
  readonly height?: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onMenuSelect,
  width,
  height,
}) => {
  /* Window + audio helpers */
  const { width: ww, height: wh } = useWindowSize();
  const screenW = width ?? ww;
  const screenH = height ?? wh;
  const audio = useAudio();

  const { bgTexture, logoTexture, dojangWallTexture, archetypeTextures } =
    useIntroAssets();

  /* Local state */
  const [section, setSection] = useState<"menu" | "controls" | "philosophy">(
    "menu"
  );
  const [menuIdx, setMenuIdx] = useState(0);
  const [archIdx, setArchIdx] = useState(0);
  const introMusicStarted = useRef(false);

  const currentArchetype = ARCHETYPE_ORDER[archIdx];
  const currentArchData = PLAYER_ARCHETYPES_DATA[currentArchetype];

  const isMobile = screenW < 768;
  const isTablet = screenW >= 768 && screenW < 1024;
  const logoSize = isMobile ? 80 : isTablet ? 120 : 160;

  /* Music on mount */
  useEffect(() => {
    if (audio.isInitialized && !introMusicStarted.current) {
      introMusicStarted.current = true;
      audio.playMusic("intro").catch(console.error);
    }
  }, [audio]);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (section !== "menu") {
        if (e.key === "Escape") {
          setSection("menu");
          audio.playSFX("ui_cancel");
        }
        return;
      }

      switch (e.key) {
        case "ArrowUp":
          setMenuIdx((p) => (p + MENU_ITEMS.length - 1) % MENU_ITEMS.length);
          audio.playSFX("ui_navigate");
          break;
        case "ArrowDown":
          setMenuIdx((p) => (p + 1) % MENU_ITEMS.length);
          audio.playSFX("ui_navigate");
          break;
        case "ArrowLeft":
          setArchIdx(
            (p) => (p + ARCHETYPE_ORDER.length - 1) % ARCHETYPE_ORDER.length
          );
          audio.playSFX("ui_navigate");
          break;
        case "ArrowRight":
          setArchIdx((p) => (p + 1) % ARCHETYPE_ORDER.length);
          audio.playSFX("ui_navigate");
          break;
        case "Enter":
        case " ":
          handleMenu(MENU_ITEMS[menuIdx].mode);
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [section, menuIdx, audio]);

  /* Menu selection handler */
  const handleMenu = (mode: GameMode): void => {
    switch (mode) {
      case GameMode.CONTROLS:
        setSection("controls");
        audio.playSFX("ui_select");
        break;
      case GameMode.PHILOSOPHY:
        setSection("philosophy");
        audio.playSFX("ui_select");
        break;
      default:
        onMenuSelect(mode);
        audio.playSFX("ui_confirm");
        break;
    }
  };

  // Create the grid graphics context properly
  const gridContext = useMemo(() => {
    const context = new GraphicsContext();
    const g = new Graphics(context);

    g.clear();
    const gridSize = 30;
    const gridColor = KOREAN_COLORS.PRIMARY_CYAN;

    for (let i = 0; i < screenW / gridSize; i++) {
      g.rect(i * gridSize, 0, 1, screenH);
    }
    for (let i = 0; i < screenH / gridSize; i++) {
      g.rect(0, i * gridSize, screenW, 1);
    }
    g.fill({ color: gridColor, alpha: 0.08 });

    return context;
  }, [screenW, screenH]);

  // Render different sections
  if (section === "controls") {
    return (
      <Suspense fallback={<layoutContainer />}>
        <ControlsSection
          onBack={() => setSection("menu")}
          width={screenW}
          height={screenH}
        />
      </Suspense>
    );
  }

  if (section === "philosophy") {
    return (
      <Suspense fallback={<layoutContainer />}>
        <PhilosophySection
          onBack={() => setSection("menu")}
          width={screenW}
          height={screenH}
        />
      </Suspense>
    );
  }

  return (
    <layoutContainer
      layout={{
        width: screenW,
        height: screenH,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? 20 : 40,
        backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
      }}
      data-testid="intro-screen"
    >
      {/* Background Grid - Use layoutGraphics with GraphicsContext */}
      <layoutGraphics
        context={gridContext}
        layout={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Background textures - use layoutSprites positioned absolutely */}
      {bgTexture && (
        <layoutSprite
          texture={bgTexture}
          alpha={0.05}
          layout={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}

      {dojangWallTexture && (
        <layoutSprite
          texture={dojangWallTexture}
          alpha={0.1}
          layout={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}

      {/* Logo & Title */}
      <layoutContainer
        layout={{
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          marginTop: 32,
        }}
      >
        {logoTexture && (
          <layoutSprite
            texture={logoTexture}
            layout={{
              width: logoSize,
              height: logoSize,
            }}
            anchor={0.5}
          />
        )}
        <layoutText
          text="흑괘 무술 도장"
          style={{
            fontFamily: "Noto Sans KR, NanumGothic, sans-serif",
            fontSize: isMobile ? 28 : isTablet ? 36 : 48,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
          anchor={0.5}
        />
        <layoutText
          text="Black Trigram Dojo"
          style={{
            fontFamily: "Noto Sans KR, NanumGothic, sans-serif",
            fontSize: isMobile ? 16 : isTablet ? 20 : 24,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          anchor={0.5}
        />
        <layoutText
          text="☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷"
          style={{
            fontSize: isMobile ? 20 : 28,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
            letterSpacing: isMobile ? 8 : 12,
          }}
          anchor={0.5}
        />
      </layoutContainer>

      {/* Menu */}
      <MenuSection
        menuItems={MENU_ITEMS}
        selectedIndex={menuIdx}
        onModeSelect={handleMenu}
        width={isMobile ? screenW * 0.9 : 400}
        height={isMobile ? 280 : 320}
      />

      {/* Archetype Display */}
      <ArchetypeDisplay
        archetype={currentArchetype}
        archetypeData={currentArchData}
        texture={archetypeTextures[currentArchetype]}
        total={ARCHETYPE_ORDER.length}
        index={archIdx}
        onPrev={() => {
          setArchIdx(
            (p) => (p + ARCHETYPE_ORDER.length - 1) % ARCHETYPE_ORDER.length
          );
          audio.playSFX("ui_navigate");
        }}
        onNext={() => {
          setArchIdx((p) => (p + 1) % ARCHETYPE_ORDER.length);
          audio.playSFX("ui_navigate");
        }}
        width={screenW}
        height={isMobile ? 250 : 300}
      />

      {/* Footer */}
      <layoutContainer
        layout={{
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          marginBottom: isMobile ? 20 : 32,
        }}
      >
        <layoutText
          text="흑괘의 길을 걸어라 - Walk the Path of the Black Trigram"
          style={{
            fontSize: isMobile ? 10 : 14,
            fill: KOREAN_COLORS.ACCENT_CYAN,
            fontStyle: "italic",
          }}
          anchor={0.5}
        />
        <layoutText
          text="Open Source Korean Martial Arts Game by Hack23"
          style={{
            fontSize: isMobile ? 9 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          anchor={0.5}
          interactive
          cursor="pointer"
          onPointerTap={() => {
            window.open("https://github.com/Hack23/blacktrigram", "_blank");
          }}
        />
      </layoutContainer>
    </layoutContainer>
  );
};

export default IntroScreen;
