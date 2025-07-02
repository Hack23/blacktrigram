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
      g.setStrokeStyle({ color: gridColor, width: 1, alpha: 0.08 });

      for (let i = 0; i < screenW / gridSize; i++) {
        g.moveTo(i * gridSize, 0);
        g.lineTo(i * gridSize, screenH);
      }
      for (let i = 0; i < screenH / gridSize; i++) {
        g.moveTo(0, i * gridSize);
        g.lineTo(screenW, i * gridSize);
      }
      g.stroke();
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

  // Fixed: Wrap all non-layout-aware components in layoutView
  return (
    <pixiContainer data-testid="intro-screen">
      {/* Background layers - keep these as regular pixiContainer children */}
      <pixiGraphics draw={drawGrid} />

      <pixiSprite
        texture={bgTexture || PIXI.Texture.EMPTY}
        alpha={bgTexture ? 0.05 : 0}
        width={screenW}
        height={screenH}
      />

      <pixiSprite
        texture={dojangWallTexture || PIXI.Texture.EMPTY}
        alpha={dojangWallTexture ? 0.1 : 0}
        width={screenW}
        height={screenH}
      />

      {/* Main content using layoutContainer for proper yoga layout */}
      <layoutContainer
        layout={{
          width: screenW,
          height: screenH,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: isMobile ? 12 : 32,
          gap: isMobile ? 10 : 24,
        }}
      >
        {/* Logo & Trigrams - wrapped in layoutView */}
        <layoutView
          layout={{
            minHeight: isMobile ? 100 : 180,
            width: "100%",
            flexGrow: 0,
            flexShrink: 0,
          }}
        >
          <layoutContainer
            layout={{
              width: "100%",
              height: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: isMobile ? 8 : 32,
            }}
          >
            <layoutView>
              <pixiSprite
                texture={logoTexture || PIXI.Texture.EMPTY}
                anchor={0.5}
                width={logoSize}
                height={logoSize}
              />
            </layoutView>
            <layoutView>
              <pixiText
                text="흑괘 무술 도장"
                style={{
                  fontFamily: "Noto Sans KR, NanumGothic, sans-serif",
                  fontSize: isMobile ? 28 : 48,
                  fill: KOREAN_COLORS.ACCENT_GOLD,
                  fontWeight: "bold",
                }}
                anchor={0.5}
              />
            </layoutView>
            <layoutView>
              <pixiText
                text="Black Trigram Dojo"
                style={{
                  fontSize: isMobile ? 14 : 22,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                }}
                anchor={0.5}
              />
            </layoutView>
            <layoutContainer
              layout={{
                flexDirection: "row",
                gap: isMobile ? 6 : 12,
                marginTop: 4,
              }}
            >
              {/* Render each trigram as a separate text for spacing */}
              {["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"].map((t, i) => (
                <layoutView key={i}>
                  <pixiText
                    text={t}
                    style={{
                      fontSize: isMobile ? 20 : 32,
                      fill: KOREAN_COLORS.PRIMARY_CYAN,
                      letterSpacing: isMobile ? 2 : 4,
                    }}
                    anchor={0.5}
                  />
                </layoutView>
              ))}
            </layoutContainer>
          </layoutContainer>
        </layoutView>

        {/* Main Content Area: Menu + Archetype */}
        <layoutContainer
          layout={{
            width: "100%",
            flexGrow: 1,
            flexDirection: isMobile ? "column" : "row",
            alignItems: "stretch",
            justifyContent: "center",
            gap: isMobile ? 12 : 32,
            minHeight: isMobile ? 320 : 400,
          }}
        >
          <layoutView layout={{ flex: 1, minWidth: 220, maxWidth: 400 }}>
            <MenuSection
              menuItems={MENU_ITEMS}
              selectedIndex={menuIdx}
              onModeSelect={handleMenu}
              width={isMobile ? screenW * 0.9 : 400}
              height={isMobile ? 280 : 320}
            />
          </layoutView>
          <layoutView layout={{ flex: 2, minWidth: 260, maxWidth: 600 }}>
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
              width={isMobile ? screenW * 0.9 : 600}
              height={isMobile ? 250 : 200}
            />
          </layoutView>
        </layoutContainer>

        {/* Footer - wrapped in layoutView */}
        <layoutView
          layout={{
            marginTop: "auto",
            marginBottom: isMobile ? 10 : 20,
          }}
        >
          <layoutContainer
            layout={{
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <layoutView>
              <pixiText
                text="흑괘의 길을 걸어라 - Walk the Path of the Black Trigram"
                style={{
                  fontSize: isMobile ? 10 : 14,
                  fill: KOREAN_COLORS.ACCENT_CYAN,
                  fontStyle: "italic",
                }}
                anchor={0.5}
              />
            </layoutView>
          </layoutContainer>
        </layoutView>
      </layoutContainer>
    </pixiContainer>
  );
};

export default IntroScreen;
