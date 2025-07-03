// 🔧 CRITICAL FIX: Ensure extensions are loaded before any other imports.
import "../../utils/pixiExtensions";

import * as PIXI from "pixi.js";
import React, { Suspense, useEffect, useRef, useState } from "react";

import { useAudio } from "../../audio/AudioProvider";
import { PLAYER_ARCHETYPES_DATA } from "../../systems/types";
import { GameMode, PlayerArchetype } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";

// Import sub-components for different sections
import {
  ArchetypeDisplay,
  ControlsSection,
  MenuSection,
  PhilosophySection,
} from "./components";

/* ------------------------------------------------------------------ */
/*  1. Asset Definitions & Loader Hook                                */
/* ------------------------------------------------------------------ */

// Centralize asset paths to ensure they match available assets
const INTRO_ASSET_PATHS = {
  background: "/assets/visual/bg/intro/intro_bg_loop.png",
  logo: "/assets/visual/logo/black-trigram.png",
  archetypes: {
    [PlayerArchetype.MUSA]: "/assets/visual/archetypes/musa.png",
    [PlayerArchetype.AMSALJA]: "/assets/visual/archetypes/amsalja.png",
    [PlayerArchetype.HACKER]: "/assets/visual/archetypes/hacker.png",
    [PlayerArchetype.JEONGBO_YOWON]:
      "/assets/visual/archetypes/jeongbo_yowon.png",
    [PlayerArchetype.JOJIK_POKRYEOKBAE]:
      "/assets/visual/archetypes/jojik_pokryeokbae.png",
  },
};

type IntroAssetState = {
  bgTexture: PIXI.Texture;
  logoTexture: PIXI.Texture;
  archetypeTextures: Record<PlayerArchetype, PIXI.Texture>;
};

// A more robust asset loading hook with clear states
function useIntroAssets() {
  const [assets, setAssets] = useState<IntroAssetState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAssets = async () => {
      try {
        // Load all assets in parallel for efficiency
        const [bg, logo, ...archetypeEntries] = await Promise.all([
          PIXI.Assets.load<PIXI.Texture>(INTRO_ASSET_PATHS.background),
          PIXI.Assets.load<PIXI.Texture>(INTRO_ASSET_PATHS.logo),
          ...Object.entries(INTRO_ASSET_PATHS.archetypes).map(
            async ([key, path]) => {
              const texture = await PIXI.Assets.load<PIXI.Texture>(path);
              return [key as PlayerArchetype, texture ?? PIXI.Texture.EMPTY];
            }
          ),
        ]);

        if (isMounted) {
          setAssets({
            bgTexture: bg ?? PIXI.Texture.EMPTY,
            logoTexture: logo ?? PIXI.Texture.EMPTY,
            archetypeTextures: Object.fromEntries(archetypeEntries) as Record<
              PlayerArchetype,
              PIXI.Texture
            >,
          });
        }
      } catch (err) {
        console.error("Intro asset loading failed:", err);
        if (isMounted) {
          setError("Failed to load critical assets. Please refresh.");
          // Provide fallback empty textures to prevent render errors
          setAssets({
            bgTexture: PIXI.Texture.EMPTY,
            logoTexture: PIXI.Texture.EMPTY,
            archetypeTextures: Object.fromEntries(
              Object.keys(INTRO_ASSET_PATHS.archetypes).map((k) => [
                k,
                PIXI.Texture.EMPTY,
              ])
            ) as Record<PlayerArchetype, PIXI.Texture>,
          });
        }
      }
    };

    loadAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  return { assets, isLoading: !assets && !error, error };
}

/* ------------------------------------------------------------------ */
/*  2.  Constants & Fallbacks                                         */
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

const LoadingFallback = ({ text }: { text: string }) => (
  <layoutContainer
    layout={{
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <pixiText
      text={text}
      anchor={0.5}
      style={{
        fill: KOREAN_COLORS.ACCENT_CYAN,
        fontSize: 24,
        fontFamily: "Noto Sans KR, sans-serif",
      }}
    />
  </layoutContainer>
);

/* ------------------------------------------------------------------ */
/*  3.  IntroScreen Component                                         */
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

  const { assets, isLoading, error } = useIntroAssets();

  const [section, setSection] = useState<"menu" | "controls" | "philosophy">(
    "menu"
  );
  const [menuIdx, setMenuIdx] = useState(0);
  const [archIdx, setArchIdx] = useState(0);
  const introMusicStarted = useRef(false);

  const currentArchetype = ARCHETYPE_ORDER[archIdx];
  const currentArchData = PLAYER_ARCHETYPES_DATA[currentArchetype];

  // --- Responsive Sizing ---
  const isMobile = screenW < 768;
  const sizing = {
    logo: isMobile ? 100 : 150,
    titleFont: isMobile ? 28 : 48,
    sloganFont: isMobile ? 14 : 18,
    footerFont: isMobile ? 12 : 16,
    padding: isMobile ? 15 : 30,
    gap: isMobile ? 15 : 25,
  };

  // --- Effects ---
  useEffect(() => {
    if (audio.isInitialized && !introMusicStarted.current) {
      introMusicStarted.current = true;
      audio.playMusic("intro").catch(console.error);
    }
  }, [audio]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (section !== "menu") {
        if (e.key === "Escape") {
          setSection("menu");
          audio.playSFX("ui_cancel");
        }
        return;
      }

      let newMenuIdx = menuIdx;
      let newArchIdx = archIdx;

      switch (e.key) {
        case "ArrowUp":
          newMenuIdx = (menuIdx + MENU_ITEMS.length - 1) % MENU_ITEMS.length;
          break;
        case "ArrowDown":
          newMenuIdx = (menuIdx + 1) % MENU_ITEMS.length;
          break;
        case "ArrowLeft":
          newArchIdx =
            (archIdx + ARCHETYPE_ORDER.length - 1) % ARCHETYPE_ORDER.length;
          break;
        case "ArrowRight":
          newArchIdx = (archIdx + 1) % ARCHETYPE_ORDER.length;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleMenuSelect(MENU_ITEMS[menuIdx].mode);
          return;
      }

      if (newMenuIdx !== menuIdx) {
        setMenuIdx(newMenuIdx);
        audio.playSFX("ui_navigate");
      }
      if (newArchIdx !== archIdx) {
        setArchIdx(newArchIdx);
        audio.playSFX("ui_navigate");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [section, menuIdx, archIdx, audio, onMenuSelect]);

  // --- Handlers ---
  const handleMenuSelect = (mode: GameMode): void => {
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

  const handleArchetypeChange = (direction: "prev" | "next") => {
    const delta = direction === "prev" ? -1 : 1;
    setArchIdx(
      (p) => (p + ARCHETYPE_ORDER.length + delta) % ARCHETYPE_ORDER.length
    );
    audio.playSFX("ui_navigate");
  };

  // --- Render Logic ---
  if (isLoading) return <LoadingFallback text="로딩 중... (Loading...)" />;
  if (error) return <LoadingFallback text={`오류: ${error}`} />;
  if (!assets) return <LoadingFallback text="에셋을 불러올 수 없습니다." />;

  if (section === "controls") {
    return (
      <Suspense fallback={<LoadingFallback text="로딩 중..." />}>
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
      <Suspense fallback={<LoadingFallback text="로딩 중..." />}>
        <PhilosophySection
          onBack={() => setSection("menu")}
          width={screenW}
          height={screenH}
        />
      </Suspense>
    );
  }

  // --- FIX: Use a single full-screen layoutContainer for all content ---
  return (
    <pixiContainer>
      {/* Background Sprite: always full screen */}
      <pixiSprite
        texture={assets.bgTexture}
        width={screenW}
        height={screenH}
        alpha={0.9}
      />

      {/* Overlay for logo, header, menu, archetype, and footer */}
      <layoutContainer
        layout={{
          position: "absolute",
          top: 0,
          left: 0,
          width: screenW,
          height: screenH,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 0,
          gap: 0,
        }}
        data-testid="intro-screen"
      >
        {/* --- Header: Centered Logo and Title --- */}
        <layoutContainer
          layout={{
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: isMobile ? 24 : 40,
            marginBottom: isMobile ? 8 : 16,
            gap: 8,
          }}
        >
          <layoutSprite
            texture={assets.logoTexture}
            layout={{
              width: sizing.logo,
              height: sizing.logo,
              alignSelf: "center",
            }}
          />
          <layoutText
            text="흑괘 Black Trigram"
            style={{
              fontFamily: "Noto Sans KR, sans-serif",
              fontSize: sizing.titleFont,
              fill: KOREAN_COLORS.ACCENT_CYAN,
              fontWeight: "bold",
              align: "center",
              dropShadow: {
                color: 0x000000,
                blur: 4,
                distance: 2,
              },
            }}
            layout={{
              alignSelf: "center",
            }}
          />
          {/* Trigram symbols row */}
          <layoutContainer
            layout={{
              flexDirection: "row",
              gap: 10,
              marginTop: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"].map((symbol, i) => (
              <layoutText
                key={symbol}
                text={symbol}
                style={{
                  fontSize: isMobile ? 18 : 24,
                  fill: KOREAN_COLORS.ACCENT_GOLD,
                  fontWeight: "bold",
                  fontFamily: "Noto Sans KR, sans-serif",
                  align: "center",
                }}
                layout={{
                  marginLeft: i === 0 ? 0 : 4,
                }}
              />
            ))}
          </layoutContainer>
        </layoutContainer>

        {/* --- Center: Menu + Archetype --- */}
        <layoutContainer
          layout={{
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: isMobile ? 24 : 48,
            width: "100%",
            maxWidth: 1100,
            flexGrow: 1,
          }}
        >
          <layoutView
            layout={{
              width: isMobile ? screenW * 0.95 : 340,
              height: isMobile ? 260 : 420,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <MenuSection
              menuItems={MENU_ITEMS}
              selectedIndex={menuIdx}
              onModeSelect={handleMenuSelect}
              width={isMobile ? screenW * 0.95 : 340}
              height={isMobile ? 260 : 420}
            />
          </layoutView>

          <layoutView
            layout={{
              width: isMobile ? screenW * 0.95 : 520,
              height: isMobile ? 320 : 420,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <ArchetypeDisplay
              archetype={currentArchetype}
              archetypeData={currentArchData}
              texture={assets.archetypeTextures[currentArchetype]}
              total={ARCHETYPE_ORDER.length}
              index={archIdx}
              onPrev={() => handleArchetypeChange("prev")}
              onNext={() => handleArchetypeChange("next")}
              width={isMobile ? screenW * 0.95 : 520}
              height={isMobile ? 320 : 420}
            />
          </layoutView>
        </layoutContainer>

        {/* --- Footer: Centered Slogan --- */}
        <layoutContainer
          layout={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: isMobile ? 10 : 24,
            marginTop: isMobile ? 8 : 16,
          }}
        >
          <pixiText
            text="흑괘의 길을 걸어라 - Walk the Path of the Black Trigram"
            style={{
              fontSize: sizing.footerFont,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontStyle: "italic",
              align: "center",
              fontFamily: "Noto Sans KR, sans-serif",
            }}
            anchor={0.5}
          />
        </layoutContainer>
      </layoutContainer>
    </pixiContainer>
  );
};

export default IntroScreen;
