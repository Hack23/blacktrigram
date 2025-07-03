// 🔧 CRITICAL FIX: Ensure extensions are loaded before any other imports.
import "../../utils/pixiExtensions";

import * as PIXI from "pixi.js";
import React, { Suspense, useEffect, useRef, useState } from "react";

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
      }
    })();
  }, []);

  return { bgTexture, logoTexture, archetypeTextures };
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

const LoadingFallback = () => (
  <pixiText
    text="로딩 중..."
    anchor={0.5}
    style={{ fill: "white", fontSize: 24 }}
  />
);

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

  const { bgTexture, logoTexture, archetypeTextures } = useIntroAssets();

  const [section, setSection] = useState<"menu" | "controls" | "philosophy">(
    "menu"
  );
  const [menuIdx, setMenuIdx] = useState(0);
  const [archIdx, setArchIdx] = useState(0);
  const introMusicStarted = useRef(false);

  const currentArchetype = ARCHETYPE_ORDER[archIdx];
  const currentArchData = PLAYER_ARCHETYPES_DATA[currentArchetype];

  // --- Improved Responsive Sizing ---
  const isMobile = screenW < 768;
  const isTablet = screenW >= 768 && screenW < 1280;

  const sizing = {
    logo: isMobile ? 120 : isTablet ? 180 : 250,
    titleFont: isMobile ? 32 : isTablet ? 48 : 64,
    subtitleFont: isMobile ? 16 : isTablet ? 22 : 28,
    trigramFont: isMobile ? 22 : isTablet ? 28 : 36,
    footerFont: isMobile ? 10 : isTablet ? 14 : 16,
    padding: isMobile ? 16 : isTablet ? 32 : 48,
    gap: isMobile ? 16 : isTablet ? 24 : 32,
    trigramGap: isMobile ? 8 : isTablet ? 12 : 16,
  };
  // --- End of Sizing ---

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

  if (section === "controls") {
    return (
      <Suspense fallback={<LoadingFallback />}>
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
      <Suspense fallback={<LoadingFallback />}>
        <PhilosophySection
          onBack={() => setSection("menu")}
          width={screenW}
          height={screenH}
        />
      </Suspense>
    );
  }

  return (
    <pixiContainer data-testid="intro-screen">
      <pixiSprite
        texture={bgTexture ?? PIXI.Texture.EMPTY}
        alpha={bgTexture ? 0.9 : 0}
        width={screenW}
        height={screenH}
      />
      <layoutContainer
        layout={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <layoutContainer layout={{ margin: 5, flexGrow: 0.2 }}>
          <layoutSprite
            texture={logoTexture ?? PIXI.Texture.EMPTY}
            layout={{
              marginBottom: 24,
              alignSelf: "center",
            }}
          />
          <layoutText
            text="흑괘 Black Trigram"
            style={{
              fontFamily: "Noto Sans KR, sans-serif",
              fontSize: 36,
              fill: 0xffffff,
              fontWeight: "bold",
              letterSpacing: 2,
            }}
            layout={{
              alignSelf: "center",
            }}
          />
        </layoutContainer>

        <layoutContainer layout={{ margin: 5, flexGrow: 0.3 }}>
          <layoutView
            layout={{
              width: isMobile ? "90%" : 340,
              minHeight: 280,
              backgroundColor: "rgba(20,22,40,0.85)",
              borderRadius: 18,
              padding: sizing.gap,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MenuSection
              menuItems={MENU_ITEMS}
              selectedIndex={menuIdx}
              onModeSelect={handleMenu}
              width={screenW}
              height={screenH}
            />
          </layoutView>
        </layoutContainer>

        <layoutContainer layout={{ margin: 5, flexGrow: 0.4 }}>
          {/* Archetype Display */}
          <layoutView
            layout={{
              width: isMobile ? "90%" : 340,
              minHeight: 280,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArchetypeDisplay
              archetype={currentArchetype}
              archetypeData={currentArchData}
              texture={
                archetypeTextures[currentArchetype] ?? PIXI.Texture.EMPTY
              }
              total={ARCHETYPE_ORDER.length}
              index={archIdx}
              onPrev={() => {
                setArchIdx(
                  (p) =>
                    (p + ARCHETYPE_ORDER.length - 1) % ARCHETYPE_ORDER.length
                );
                audio.playSFX("ui_navigate");
              }}
              onNext={() => {
                setArchIdx((p) => (p + 1) % ARCHETYPE_ORDER.length);
                audio.playSFX("ui_navigate");
              }}
            />
          </layoutView>
        </layoutContainer>

        <layoutContainer layout={{ margin: 5, flexGrow: 0.1 }}>
          <layoutView
            layout={{
              width: "100%",
              marginTop: sizing.gap,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <pixiText
              text="흑괘의 길을 걸어라 - Walk the Path of the Black Trigram"
              style={{
                fontSize: sizing.footerFont * 1.2,
                fill: KOREAN_COLORS.ACCENT_CYAN,
                fontStyle: "italic",
                align: "center",
                dropShadow: true,
              }}
              anchor={0.5}
            />
          </layoutView>
        </layoutContainer>
      </layoutContainer>
    </pixiContainer>
  );
};

export default IntroScreen;
