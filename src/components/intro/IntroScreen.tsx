// 🔧 CRITICAL FIX: Ensure extensions are loaded before any other imports.
import "../../utils/pixiExtensions";

import * as PIXI from "pixi.js";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";

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

// ✅ FIXED: Use existing asset paths that are actually available
const INTRO_ASSET_PATHS = {
  background: "assets/visual/bg/intro/intro_bg_loop.png",
  logo: "/assets/visual/logo/black-trigram.png",
  archetypes: {
    [PlayerArchetype.MUSA]: "assets/visual/archetypes/musa.png",
    [PlayerArchetype.AMSALJA]: "assets/visual/archetypes/amsalja.png",
    [PlayerArchetype.HACKER]: "assets/visual/archetypes/hacker.png",
    [PlayerArchetype.JEONGBO_YOWON]: "/assets/visual/archetypes/jeongbo_yowon.png",
    [PlayerArchetype.JOJIK_POKRYEOKBAE]: "/assets/visual/archetypes/jojik_pokryeokbae.png",
  },
};

type IntroAssetState = {
  bgTexture: PIXI.Texture;
  logoTexture: PIXI.Texture;
  archetypeTextures: Record<PlayerArchetype, PIXI.Texture>;
};

// A more robust asset loading hook with fallbacks
function useIntroAssets() {
  const [assets, setAssets] = useState<IntroAssetState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAssets = async () => {
      try {
        console.log("🎨 Loading intro assets...");

        // Create fallback textures immediately
        const fallbackAssets: IntroAssetState = {
          bgTexture: PIXI.Texture.EMPTY,
          logoTexture: PIXI.Texture.EMPTY,
          archetypeTextures: Object.fromEntries(
            Object.keys(INTRO_ASSET_PATHS.archetypes).map((k) => [
              k,
              PIXI.Texture.EMPTY,
            ])
          ) as Record<PlayerArchetype, PIXI.Texture>,
        };

        // Try to load real assets, but fallback gracefully
        try {
          const [bg, logo, ...archetypeEntries] = await Promise.allSettled([
            PIXI.Assets.load<PIXI.Texture>(INTRO_ASSET_PATHS.background),
            PIXI.Assets.load<PIXI.Texture>(INTRO_ASSET_PATHS.logo),
            ...Object.entries(INTRO_ASSET_PATHS.archetypes).map(
              async ([key, path]) => {
                try {
                  const texture = await PIXI.Assets.load<PIXI.Texture>(path);
                  return [
                    key as PlayerArchetype,
                    texture ?? PIXI.Texture.EMPTY,
                  ];
                } catch {
                  return [key as PlayerArchetype, PIXI.Texture.EMPTY];
                }
              }
            ),
          ]);

          // Use loaded assets or fallbacks
          if (isMounted) {
            setAssets({
              bgTexture:
                bg.status === "fulfilled"
                  ? bg.value ?? PIXI.Texture.EMPTY
                  : PIXI.Texture.EMPTY,
              logoTexture:
                logo.status === "fulfilled"
                  ? logo.value ?? PIXI.Texture.EMPTY
                  : PIXI.Texture.EMPTY,
              archetypeTextures: Object.fromEntries(
                archetypeEntries.map((entry, i) => {
                  const key = Object.keys(INTRO_ASSET_PATHS.archetypes)[i];
                  const texture =
                    entry.status === "fulfilled"
                      ? entry.value[1]
                      : PIXI.Texture.EMPTY;
                  return [key, texture];
                })
              ) as Record<PlayerArchetype, PIXI.Texture>,
            });
            console.log("✅ Intro assets loaded successfully");
          }
        } catch (loadError) {
          console.warn("⚠️ Asset loading failed, using fallbacks:", loadError);
          if (isMounted) {
            setAssets(fallbackAssets);
          }
        }
      } catch (err) {
        console.error("❌ Critical asset loading error:", err);
        if (isMounted) {
          setError("Failed to initialize assets");
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
    <layoutText
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
  const isTablet = screenW >= 768 && screenW < 1024;

  // ✅ FIXED: Proper responsive sizing
  const sizing = {
    logo: isMobile ? 80 : isTablet ? 120 : 140,
    titleFont: isMobile ? 24 : isTablet ? 32 : 38,
    sloganFont: isMobile ? 12 : isTablet ? 14 : 16,
    footerFont: isMobile ? 10 : isTablet ? 12 : 14,
    padding: isMobile ? 16 : isTablet ? 24 : 32,
    gap: isMobile ? 8 : isTablet ? 12 : 16,
  };

  // ✅ FIXED: Constrained layout with proper header/footer allocation
  const layoutConfig = useMemo(() => {
    const headerHeight = isMobile ? 200 : isTablet ? 240 : 280;
    const footerHeight = isMobile ? 60 : 80;
    const contentHeight = screenH - headerHeight - footerHeight - 40; // Add some margin

    return {
      root: {
        width: screenW,
        height: screenH,
        flexDirection: "column" as const,
        backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
        padding: 0,
      },
      header: {
        width: screenW,
        height: headerHeight,
        flexDirection: "column" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        padding: sizing.padding,
        gap: sizing.gap,
        flexShrink: 0,
        backgroundColor: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
      },
      mainContent: {
        width: screenW,
        height: contentHeight,
        maxWidth: screenW,
        alignSelf: "center" as const,
        flexDirection: isMobile ? ("column" as const) : ("row" as const),
        justifyContent: "center" as const,
        alignItems: "center" as const,
        gap: isMobile ? 16 : 32,
        padding: sizing.padding,
        flexShrink: 0,
        flexGrow: 1,
      },
      footer: {
        width: screenW,
        height: footerHeight,
        flexDirection: "column" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        padding: sizing.padding / 2,
        gap: 4,
        flexShrink: 0,
        backgroundColor: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
      },
    };
  }, [screenW, screenH, isMobile, isTablet, sizing]);

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

  // ✅ FIXED: Main menu layout with visible header and footer
  return (
    <layoutContainer layout={layoutConfig.root} data-testid="intro-screen">
      {/* ✅ FIXED: Header Section - NOW VISIBLE */}
      <layoutContainer layout={layoutConfig.header}>
        {/* Logo and title in row for mobile, column for desktop */}
        <layoutContainer
          layout={{
            width: "100%",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: sizing.gap,
          }}
        >
          {/* Logo section */}
          <layoutContainer
            layout={{
              width: sizing.logo,
              height: sizing.logo,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
              borderRadius: 8,
            }}
          >
            {/* ✅ FIXED: Fallback to Korean text if no logo texture */}
            {assets?.logoTexture && assets.logoTexture !== PIXI.Texture.EMPTY ? (
              <layoutSprite
                texture={assets.logoTexture}
                width={sizing.logo - 10}
                height={sizing.logo - 10}
                anchor={0.5}
              />
            ) : (
              <layoutText
                text="흑괘"
                style={{
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontSize: sizing.logo / 2.5,
                  fill: KOREAN_COLORS.ACCENT_GOLD,
                  fontWeight: "bold",
                }}
                anchor={0.5}
              />
            )}
          </layoutContainer>

          {/* Title section */}
          <layoutContainer
            layout={{
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <layoutText
              text="흑괘 Black Trigram"
              style={{
                fontFamily: "Noto Sans KR, sans-serif",
                fontSize: sizing.titleFont,
                fill: KOREAN_COLORS.ACCENT_CYAN,
                fontWeight: "bold",
                align: "center",
              }}
            />

            <layoutText
              text="한국 무술 시뮬레이터"
              style={{
                fontFamily: "Noto Sans KR, sans-serif",
                fontSize: sizing.sloganFont,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
                align: "center",
              }}
            />
          </layoutContainer>
        </layoutContainer>

        {/* Trigram indicators */}
        <layoutContainer
          layout={{
            flexDirection: "row",
            gap: isMobile ? 4 : 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"].map((symbol, i) => (
            <layoutText
              key={symbol}
              text={symbol}
              style={{
                fontSize: isMobile ? 14 : 16,
                fill: i === archIdx ? KOREAN_COLORS.ACCENT_GOLD : KOREAN_COLORS.TEXT_SECONDARY,
                fontWeight: i === archIdx ? "bold" : "normal",
              }}
            />
          ))}
        </layoutContainer>
      </layoutContainer>

      {/* ✅ FIXED: Main Content Area */}
      <layoutContainer layout={layoutConfig.mainContent}>
        {/* Menu Section */}
        <layoutContainer
          layout={{
            width: isMobile ? screenW * 0.9 : 380,
            height: isMobile ? 280 : 320,
            backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <MenuSection
            menuItems={MENU_ITEMS}
            selectedIndex={menuIdx}
            onModeSelect={handleMenuSelect}
            width={isMobile ? screenW * 0.9 - 32 : 348}
            height={isMobile ? 248 : 288}
          />
        </layoutContainer>

        {/* ✅ FIXED: Archetype Display with proper texture and fallback */}
        <layoutContainer
          layout={{
            width: isMobile ? screenW * 0.9 : 480,
            height: isMobile ? 300 : 360,
            backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
            borderRadius: 12,
            padding: 16,
          }}
        >
          <ArchetypeDisplay
            archetype={currentArchetype}
            archetypeData={currentArchData}
            texture={
              assets?.archetypeTextures?.[currentArchetype] && 
              assets.archetypeTextures[currentArchetype] !== PIXI.Texture.EMPTY
                ? assets.archetypeTextures[currentArchetype]
                : null
            }
            total={ARCHETYPE_ORDER.length}
            index={archIdx}
            onPrev={() => handleArchetypeChange("prev")}
            onNext={() => handleArchetypeChange("next")}
            width={isMobile ? screenW * 0.9 - 32 : 448}
            height={isMobile ? 268 : 328}
          />
        </layoutContainer>
      </layoutContainer>

      {/* ✅ FIXED: Footer Section - NOW VISIBLE */}
      <layoutContainer layout={layoutConfig.footer}>
        <layoutText
          text="흑괘의 길을 걸어라 - Walk the Path of the Black Trigram"
          style={{
            fontSize: sizing.footerFont,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontStyle: "italic",
            align: "center",
            fontFamily: "Noto Sans KR, sans-serif",
          }}
        />

        <layoutContainer
          layout={{
            flexDirection: "row",
            gap: 16,
            alignItems: "center",
          }}
        >
          <layoutText
            text="Open Source Korean Martial Arts Game"
            style={{
              fontSize: sizing.footerFont - 2,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
            }}
          />

          <layoutText
            text={`v${import.meta.env.APP_VERSION || "1.0.0"}`}
            style={{
              fontSize: sizing.footerFont - 2,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
            }}
          />
        </layoutContainer>
      </layoutContainer>
    </layoutContainer>
  );
};

export default IntroScreen;