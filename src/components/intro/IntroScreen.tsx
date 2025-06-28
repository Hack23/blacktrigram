/* eslint-disable react-hooks/exhaustive-deps */
// filepath: /workspaces/blacktrigram/src/components/intro/IntroScreen.tsx
import "@pixi/layout";
import {
  LayoutContainer,
  LayoutGraphics,
  LayoutTilingSprite, // ①  NEW import
} from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend } from "@pixi/react";
import { Button, FancyButton } from "@pixi/ui";
import { Container, Graphics, Sprite, Text, TilingSprite } from "pixi.js";

extend({
  //  🏗  Register the tags we'll reference in JSX
  Container, // <pixiContainer />
  LayoutContainer, // <layoutContainer />
  Graphics, // <pixiGraphics />
  Sprite, // <pixiSprite />
  Text, // <pixiText />
  TilingSprite, // <pixiTilingSprite />
  Button, // <pixiButton />
  FancyButton, // <pixiFancyButton />
  LayoutGraphics, // <layoutGraphics />
  LayoutTilingSprite, // ①  Register so <layoutTilingSprite /> is recognised
});

import * as PIXI from "pixi.js";
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";

import ArchetypeDisplay from "./components/ArchetypeDisplay";
import { MenuSection } from "./components/MenuSection";

import { useAudio } from "../../audio/AudioProvider";
import { PLAYER_ARCHETYPES_DATA } from "../../systems/types";
import { GameMode, PlayerArchetype } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";

/* ------------------------------------------------------------------ */
/*  1.  Utility hooks (unchanged)                                     */
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
/*  2.  Asset-loader hook (unchanged)                                 */
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
/*  3.  Constants (unchanged)                                         */
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
/*  4.  Lazy components (unchanged)                                   */
/* ------------------------------------------------------------------ */
const PhilosophySection = lazy(() => import("./components/PhilosophySection"));
const ControlsSection = lazy(() => import("./components/ControlsSection"));

const APP_VERSION = import.meta.env.APP_VERSION;

/* ------------------------------------------------------------------ */
/*  5.  IntroScreen Component                                         */
/* ------------------------------------------------------------------ */
export interface IntroScreenProps {
  readonly onMenuSelect: (mode: GameMode) => void;
  readonly width?: number;
  readonly height?: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onMenuSelect,
  width: explicitW,
  height: explicitH,
}) => {
  /* Window + audio helpers */
  const { width: ww, height: wh } = useWindowSize();
  const screenW = explicitW ?? ww;
  const screenH = explicitH ?? wh;
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

  /* Music on mount */
  useEffect(() => {
    if (audio.isInitialized && !introMusicStarted.current) {
      introMusicStarted.current = true;
      audio.playMusic("intro").catch(console.error);
    }
  }, [audio]);

  /* Keyboard navigation (unchanged) */
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
    if (mode === GameMode.CONTROLS) setSection("controls");
    else if (mode === GameMode.PHILOSOPHY) setSection("philosophy");
    else onMenuSelect(mode);
    audio.playSFX("ui_confirm");
  };

  /* ----------------------------------------------------------------
   *  Sub-screens (Controls / Philosophy)
   * ---------------------------------------------------------------- */
  if (section === "controls" || section === "philosophy") {
    const Screen = section === "controls" ? ControlsSection : PhilosophySection;
    return (
      <Suspense fallback={<pixiText text="Loading..." />}>
        <Screen
          onBack={() => {
            setSection("menu");
            audio.playSFX("ui_cancel");
          }}
          width={screenW}
          height={screenH}
        />
      </Suspense>
    );
  }

  /* ----------------------------------------------------------------
   *  Layout helpers
   * ---------------------------------------------------------------- */
  const rootLayout = {
    width: screenW,
    height: screenH,
    flexDirection: "column" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    gap: 24,
    padding: 0,
  };

  const logoSize =
    (isMobile ? 0.35 : isTablet ? 0.25 : 0.2) *
    Math.min(screenW, screenH) *
    0.75;

  /* ----------------------------------------------------------------
   *  Main Render
   * ---------------------------------------------------------------- */
  return (
    <layoutContainer data-testid="intro-screen" layout={rootLayout}>
      {/* ---- Absolute background layers ---- */}
      <pixiGraphics draw={backgroundPainter(screenW, screenH, isMobile)} />
      {bgTexture && (
        <layoutTilingSprite
          texture={bgTexture}
          width={screenW}
          height={screenH}
          tileScale={{ x: 0.3, y: 0.3 }}
          alpha={0.05}
        />
      )}
      {dojangWallTexture && (
        <layoutTilingSprite
          texture={dojangWallTexture}
          width={screenW}
          height={screenH}
          tileScale={{ x: 0.5, y: 0.5 }}
          alpha={0.1}
        />
      )}

      {/* ---- Logo & Title ---- */}
      <layoutContainer
        layout={{
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          marginTop: 32,
        }}
      >
        {logoTexture && (
          <pixiSprite
            texture={logoTexture}
            width={logoSize}
            height={logoSize}
            anchor={0.5}
          />
        )}
        <pixiText
          text="흑괘 무술 도장"
          style={{
            fontFamily: "Noto Sans KR, NanumGothic, sans-serif",
            fontSize: isMobile ? 28 : isTablet ? 36 : 48,
            fill: KOREAN_COLORS.ACCENT_GOLD,
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
          }}
          anchor={0.5}
        />
        <pixiText
          text="☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷"
          style={{
            fontSize: isMobile ? 20 : 28,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
            letterSpacing: isMobile ? 8 : 12,
          }}
          anchor={0.5}
        />
      </layoutContainer>

      {/* ---- Menu ---- */}
      <MenuSection
        menuItems={MENU_ITEMS}
        selectedIndex={menuIdx}
        onModeSelect={handleMenu}
        width={isMobile ? screenW * 0.9 : 400}
        height={220}
        x={0}
        y={0}
      />

      {/* ---- Archetype Display ---- */}
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

      {/* ---- Footer ---- */}
      <layoutContainer
        layout={{
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          marginBottom: isMobile ? 20 : 32,
        }}
      >
        <pixiText
          text="흑괘의 길을 걸어라 - Walk the Path of the Black Trigram"
          style={{
            fontSize: isMobile ? 10 : 14,
            fill: KOREAN_COLORS.ACCENT_CYAN,
            fontStyle: "italic",
          }}
          anchor={0.5}
        />
        <pixiText
          interactive
          cursor="pointer"
          text="Open Source Korean Martial Arts Game by Hack23"
          style={{
            fontSize: isMobile ? 9 : 12,
            fill: KOREAN_COLORS.SECONDARY_MAGENTA,
            fontWeight: "bold",
          }}
          onPointerTap={() =>
            window.open("https://github.com/Hack23/blacktrigram", "_blank")
          }
          anchor={0.5}
        />
        <pixiText
          interactive
          cursor="pointer"
          text={`Version ${APP_VERSION || "1.0.0"}`}
          style={{
            fontSize: isMobile ? 9 : 12,
            fill: KOREAN_COLORS.SECONDARY_MAGENTA,
            fontWeight: "bold",
          }}
          onPointerTap={() =>
            window.open(
              `https://github.com/Hack23/blacktrigram/releases/tag/v${
                APP_VERSION || "1.0.0"
              }`,
              "_blank"
            )
          }
          anchor={0.5}
        />
      </layoutContainer>
    </layoutContainer>
  );
};

/* ------------------------------------------------------------------ */
/*  6.  Background painter (unchanged)                                */
/* ------------------------------------------------------------------ */
const backgroundPainter =
  (w: number, h: number, mobile: boolean) => (g: Graphics) => {
    g.clear();
    const steps = 10;
    for (let i = 0; i < steps; i += 1) {
      const r = i / steps;
      g.fill({
        color: lerpColor(
          KOREAN_COLORS.UI_BACKGROUND_DARK,
          KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          r
        ),
      });
      g.rect(0, (h / steps) * i, w, h / steps + 1);
      g.fill();
    }

    // grid
    g.stroke({
      width: 1,
      color: KOREAN_COLORS.PRIMARY_CYAN,
      alpha: 0.15,
    });
    const grid = mobile ? 40 : 60;
    for (let x = 0; x < w; x += grid) {
      g.moveTo(x, 0);
      g.lineTo(x, h);
    }
    for (let y = 0; y < h; y += grid) {
      g.moveTo(0, y);
      g.lineTo(w, y);
    }
    g.stroke();
  };

function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff;
  const ag = (a >> 8) & 0xff;
  const ab = a & 0xff;
  const br = (b >> 16) & 0xff;
  const bg = (b >> 8) & 0xff;
  const bb = b & 0xff;
  return (
    ((ar + (br - ar) * t) << 16) |
    ((ag + (bg - ag) * t) << 8) |
    (ab + (bb - ab) * t)
  );
}

export default IntroScreen;
