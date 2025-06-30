/* eslint-disable react-hooks/exhaustive-deps */
import "@pixi/layout";
import "@pixi/layout/react";
import * as PIXI from "pixi.js";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAudio } from "../../audio/AudioProvider";
import { PLAYER_ARCHETYPES_DATA } from "../../systems/types";
import { GameMode, PlayerArchetype } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";

// Import components correctly
import {
  ArchetypeDisplay,
  ControlsSection,
  MenuSection,
  PhilosophySection,
} from "./components";

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
    (async () => {
      try {
        setBgTexture(
          (await PIXI.Assets.load(
            "/assets/visual/bg/intro/intro_bg_loop.png"
          )) ?? PIXI.Texture.EMPTY
        );
        setLogoTexture(
          (await PIXI.Assets.load("/assets/visual/logo/black-trigram.png")) ??
            PIXI.Texture.EMPTY
        );
        setDojangWallTexture(
          (await PIXI.Assets.load(
            "/assets/visual/bg/dojang/dojang_wall_tex.png"
          )) ?? PIXI.Texture.EMPTY
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
            loaded[k as PlayerArchetype] =
              (await PIXI.Assets.load(p)) ?? PIXI.Texture.EMPTY;
          })
        );
        setArchetypeTextures(loaded);
      } catch (err) {
        console.error("Intro asset load error:", err);
        setBgTexture(PIXI.Texture.EMPTY);
        setLogoTexture(PIXI.Texture.EMPTY);
        setDojangWallTexture(PIXI.Texture.EMPTY);
      }
    })();
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
  const screenW = width || window.innerWidth;
  const screenH = height || window.innerHeight;
  const audio = useAudio();

  const { bgTexture, logoTexture, dojangWallTexture, archetypeTextures } =
    useIntroAssets();

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

  useEffect(() => {
    if (audio.isInitialized && !introMusicStarted.current) {
      introMusicStarted.current = true;
      audio.playMusic("intro").catch(console.error);
    }
  }, [audio]);

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
  }, [section, menuIdx, archIdx, audio]);

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

  const drawGrid = useCallback(
    (g: PIXI.Graphics) => {
      const gridSize = 30;
      const gridColor = KOREAN_COLORS.PRIMARY_CYAN;

      g.clear();
      for (let i = 0; i < screenW / gridSize; i++) {
        g.rect(i * gridSize, 0, 1, screenH);
      }
      for (let i = 0; i < screenH / gridSize; i++) {
        g.rect(0, i * gridSize, screenW, 1);
      }
      g.fill({ color: gridColor, alpha: 0.08 });
    },
    [screenW, screenH]
  );

  if (section === "controls") {
    return (
      <Suspense fallback={null}>
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
      <Suspense fallback={null}>
        <PhilosophySection
          onBack={() => setSection("menu")}
          width={screenW}
          height={screenH}
        />
      </Suspense>
    );
  }

  return (
    // 1. This is the main container for the entire screen.
    //    It should NOT have sortableChildren. Its job is just to hold layers.
    <layoutContainer
      layout={{
        width: screenW,
        height: screenH,
        position: "relative", // Establishes a positioning context for children
        backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
      }}
    >
      {/* 2. Create a DEDICATED container for background layers. */}
      {/*    This container handles the z-index sorting. */}
      <layoutContainer
        sortableChildren={true}
        layout={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {/* Place all z-indexed background elements inside this container */}
        <pixiGraphics
          draw={drawGrid}
          zIndex={-3}
          // No layout prop needed here, parent container handles positioning
        />
        <pixiSprite
          texture={bgTexture || PIXI.Texture.EMPTY}
          alpha={bgTexture ? 0.05 : 0}
          zIndex={-2}
          width={screenW}
          height={screenH}
          // No layout prop needed here
        />
        <pixiSprite
          texture={dojangWallTexture || PIXI.Texture.EMPTY}
          alpha={dojangWallTexture ? 0.1 : 0}
          zIndex={-1}
          width={screenW}
          height={screenH}
          // No layout prop needed here
        />
      </layoutContainer>

      {/* 3. This is your main content container. It is a sibling to the background container. */}
      {/*    It will render on top by default. */}
      <layoutContainer
        layout={{
          // This container now fills the screen and handles the main flex layout
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: isMobile ? 20 : 40,
          gap: isMobile ? 15 : 20,
        }}
      >
        {/* Logo & Title */}
        <layoutContainer
          layout={{
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            marginTop: isMobile ? 16 : 32,
          }}
        >
          <pixiSprite
            texture={logoTexture || PIXI.Texture.EMPTY}
            anchor={0.5}
            alpha={logoTexture ? 1 : 0}
            layout={{
              width: logoSize,
              height: logoSize,
            }}
          />
          <pixiText
            text="흑괘 무술 도장"
            style={{
              fontFamily: "Noto Sans KR, NanumGothic, sans-serif",
              fontSize: isMobile ? 28 : isTablet ? 36 : 48,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          />
          <pixiText
            text="Black Trigram Dojo"
            style={{
              fontFamily: "Noto Sans KR, NanumGothic, sans-serif",
              fontSize: isMobile ? 16 : isTablet ? 20 : 24,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          />
          <pixiText
            text="☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷"
            style={{
              fontSize: isMobile ? 20 : 28,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              letterSpacing: isMobile ? 8 : 12,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
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
          texture={archetypeTextures[currentArchetype] ?? PIXI.Texture.EMPTY}
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
          width={isMobile ? screenW * 0.9 : 600}
          height={isMobile ? 250 : 200}
        />

        {/* Footer */}
        <layoutContainer
          layout={{
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            marginTop: "auto", // Pushes footer to the bottom
            marginBottom: isMobile ? 10 : 20,
          }}
        >
          <pixiText
            text="흑괘의 길을 걸어라 - Walk the Path of the Black Trigram"
            style={{
              fontSize: isMobile ? 10 : 14,
              fill: KOREAN_COLORS.ACCENT_CYAN,
              fontStyle: "italic",
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        </layoutContainer>
      </layoutContainer>
    </layoutContainer>
  );
};

export default IntroScreen;
