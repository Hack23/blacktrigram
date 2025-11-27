import { Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useAudio } from "../../audio/AudioProvider";
import { useWebGLContextLossHandler } from "../../hooks/useWebGLContextLossHandler";
import { PLAYER_ARCHETYPES_DATA } from "../../systems/types";
import { GameMode, PlayerArchetype } from "../../types/common";
import { ARCHETYPE_BACKGROUNDS, FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";
import { getArchetypeAssets } from "../../utils/playerUtils";
import { KoreanHeaderHTML } from "../ui/KoreanHeaderHTML";
import { VolumeControl } from "../ui/VolumeControl";
import { ArchetypeDisplayHTML } from "./components/ArchetypeDisplayHTML";
import { MenuSectionHTML } from "./components/MenuSectionHTML";

const APP_VERSION = import.meta.env.APP_VERSION;

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

export interface IntroScreenThreeJSProps {
  readonly onMenuSelect: (mode: GameMode, archetype?: PlayerArchetype) => void;
  readonly onArchetypeSelect?: (archetype: PlayerArchetype) => void;
  readonly selectedArchetype?: PlayerArchetype;
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
  [PlayerArchetype.JEONGBO_YOWON]: "jeongbo_yowon",
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: "jojik_pokryeokbae",
};

// Helper function to convert PlayerArchetype enum to array index
const getArchetypeIndex = (archetype: PlayerArchetype): number => {
  const archetypeKeys = Object.keys(
    PLAYER_ARCHETYPES_DATA
  ) as PlayerArchetype[];
  return archetypeKeys.indexOf(archetype);
};

// Helper function to convert array index to PlayerArchetype enum
const getArchetypeFromIndex = (index: number): PlayerArchetype => {
  const archetypeKeys = Object.keys(
    PLAYER_ARCHETYPES_DATA
  ) as PlayerArchetype[];
  return archetypeKeys[index] ?? PlayerArchetype.MUSA;
};

/**
 * Three.js-based Background Scene Component
 * Renders cyberpunk Korean-themed 3D background
 */
const BackgroundScene: React.FC = () => {
  const gridRef = useRef<THREE.GridHelper>(null);

  // Animate grid using useFrame for proper sync with render loop
  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} color={KOREAN_COLORS.PRIMARY_CYAN} />

      {/* Directional lights for Korean aesthetic */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
      <pointLight
        position={[-10, 5, -5]}
        intensity={0.5}
        color={KOREAN_COLORS.ACCENT_BLUE}
      />

      {/* Cyberpunk grid plane */}
      <gridHelper
        ref={gridRef}
        args={[100, 50, KOREAN_COLORS.PRIMARY_CYAN, KOREAN_COLORS.UI_BACKGROUND_MEDIUM]}
        position={[0, -5, 0]}
        rotation={[0, 0, 0]}
      />

      {/* Fog for depth */}
      <fog attach="fog" args={[KOREAN_COLORS.UI_BACKGROUND_DARK, 10, 50]} />
    </>
  );
};

/**
 * Three.js-based IntroScreen Component
 */
export const IntroScreenThreeJS: React.FC<IntroScreenThreeJSProps> = ({
  onMenuSelect,
  onArchetypeSelect,
  selectedArchetype = PlayerArchetype.MUSA,
  width: propWidth,
  height: propHeight,
}) => {
  const audio = useAudio();
  const introMusicStarted = useRef(false);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);

  // Handle WebGL context loss and restoration
  useWebGLContextLossHandler({
    onContextLost: () => {
      console.warn('⚠️ WebGL context lost in IntroScreen');
    },
    onContextRestored: () => {
      console.log('✅ WebGL context restored in IntroScreen');
    },
    autoRestore: true,
  });

  // Add local state for archetype management
  const [currentArchetype, setCurrentArchetype] =
    useState<PlayerArchetype>(selectedArchetype);
  const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState<number>(
    getArchetypeIndex(selectedArchetype)
  );

  const { width, height } = useWindowSize();

  // Use prop dimensions if provided, otherwise use window size
  const screenWidth = propWidth ?? width;
  const screenHeight = propHeight ?? height;

  // Memoize colors for performance
  const colors = useMemo(() => ({
    trigramTextShadow: `0 0 10px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
    footerBackground: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
    footerBorder: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.3),
  }), []);

  // Create archetype data with texture keys from PLAYER_ARCHETYPES_DATA
  const archetypeData = useMemo(() => {
    return Object.entries(PLAYER_ARCHETYPES_DATA).map(([key, data]) => {
      const archetypeEnum = key as PlayerArchetype;
      return {
        id: key.toLowerCase(),
        korean: data.name.korean,
        english: data.name.english,
        description: data.description.korean,
        color: data.colors.primary,
        textureKey: ARCHETYPE_TEXTURE_MAPPING[archetypeEnum],
        stats: data.stats,
        philosophy: data.philosophy,
      };
    });
  }, []);

  // Sync with prop changes
  useEffect(() => {
    setCurrentArchetype(selectedArchetype);
    setSelectedArchetypeIndex(getArchetypeIndex(selectedArchetype));
  }, [selectedArchetype]);

  // Direct menu selection - MOVED BEFORE useEffect that uses it
  const handleMenuItemSelect = useCallback(
    (mode: GameMode) => {
      onMenuSelect(mode, currentArchetype);
    },
    [onMenuSelect, currentArchetype]
  );

  // Handle archetype change by index - MOVED BEFORE useEffect that uses it
  const handleArchetypeIndexChange = useCallback(
    (index: number) => {
      const newArchetype = getArchetypeFromIndex(index);
      setSelectedArchetypeIndex(index);
      setCurrentArchetype(newArchetype);
      onArchetypeSelect?.(newArchetype);
      
      // Safe audio calls - check if methods exist
      if (audio?.playSFX) {
        audio.playSFX("menu_hover");
      }
      
      // Play archetype theme music preview when archetype changes
      // Use getArchetypeAssets utility for proper error handling and fallback
      const archetypeAssets = getArchetypeAssets(newArchetype);
      // Stop intro music and play archetype theme
      if (audio?.stopMusic) {
        audio.stopMusic();
      }
      if (audio?.playMusic) {
        audio.playMusic(archetypeAssets.themeId);
      }
    },
    [onArchetypeSelect, audio]
  );

  // Play intro music after first user interaction
  useEffect(() => {
    const startMusic = () => {
      if (audio.isInitialized && !introMusicStarted.current && audio?.playMusic) {
        introMusicStarted.current = true;
        audio.playMusic("intro_theme");
      }
    };
    // Event listeners with { once: true } are automatically removed after triggering
    window.addEventListener("keydown", startMusic, { once: true });
    window.addEventListener("mousedown", startMusic, { once: true });
    window.addEventListener("touchstart", startMusic, { once: true });
    
    return () => {
      // Safe cleanup - check if method exists
      if (audio?.stopMusic) {
        audio.stopMusic();
      }
    };
  }, [audio.isInitialized, audio]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Archetype navigation (handleArchetypeIndexChange already plays menu_hover SFX)
      if (event.key === "ArrowLeft") {
        const newIndex =
          selectedArchetypeIndex === 0
            ? archetypeData.length - 1
            : selectedArchetypeIndex - 1;
        handleArchetypeIndexChange(newIndex);
      } else if (event.key === "ArrowRight") {
        const newIndex = (selectedArchetypeIndex + 1) % archetypeData.length;
        handleArchetypeIndexChange(newIndex);
      } else {
        // Direct game mode shortcuts
        switch (event.key.toLowerCase()) {
          case "c":
            handleMenuItemSelect(GameMode.CONTROLS);
            break;
          case "p":
            handleMenuItemSelect(GameMode.PHILOSOPHY);
            break;
          case "t":
            handleMenuItemSelect(GameMode.TRAINING);
            break;
          case "v":
            handleMenuItemSelect(GameMode.VERSUS);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [audio, archetypeData.length, selectedArchetypeIndex, handleArchetypeIndexChange, handleMenuItemSelect]);

  // Responsive layout calculations
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;

  const logoSize = isMobile
    ? Math.min(screenWidth, screenHeight) * 0.3
    : isTablet
    ? Math.min(screenWidth, screenHeight) * 0.24
    : Math.min(screenWidth, screenHeight) * 0.2;

  return (
    <div
      style={{
        width: screenWidth,
        height: screenHeight,
        position: "relative",
        overflow: "hidden",
      }}
      data-testid="intro-screen"
    >
      {/* Archetype background image (subtle, behind 3D scene) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${ARCHETYPE_BACKGROUNDS.overview})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.15,
          filter: "blur(2px)",
          zIndex: 0,
        }}
        data-testid="archetype-background"
      />
      
      {/* Three.js Canvas for 3D background */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 5, 10], fov: 75 }}
        onCreated={({ gl }) => {
          gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95);
        }}
      >
        {/* 3D Background Scene */}
        <BackgroundScene />

        {/* HTML Overlay for UI */}
        <Html fullscreen>
          <div
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: 0,
              gap: isMobile ? "8px" : "16px",
              pointerEvents: "none",
            }}
          >
            {/* Main Title */}
            <div
              style={{
                marginTop: isMobile ? "20px" : "40px",
                pointerEvents: "none",
              }}
              data-testid="main-title-container"
            >
              <KoreanHeaderHTML
                title={{ korean: "흑괘", english: "Black Trigram" }}
                subtitle={{
                  korean: "한국 무술 시뮬레이터",
                  english: "Korean Martial Arts Simulator",
                }}
                size="large"
                alignment="center"
                animated={true}
              />
            </div>

            {/* Logo Section */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                marginTop: isMobile ? "10px" : "20px",
                pointerEvents: "none",
              }}
              data-testid="logo-section"
            >
              {/* Logo Image */}
              <img
                src="/assets/visual/logo/black-trigram.png"
                alt="Black Trigram Logo"
                style={{
                  width: `${logoSize}px`,
                  height: `${logoSize}px`,
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))",
                }}
                data-testid="main-logo"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              {/* Trigram Symbols */}
              <div
                style={{
                  fontSize: isMobile ? "20px" : "28px",
                  color: `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`,
                  letterSpacing: isMobile ? "8px" : "12px",
                  textAlign: "center",
                  marginTop: "20px",
                  textShadow: colors.trigramTextShadow,
                }}
                data-testid="trigram-symbols"
              >
                ☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷
              </div>
            </div>

            {/* Main Content Area */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: isMobile ? "12px" : "20px",
                paddingLeft: isMobile ? "20px" : "40px",
                paddingRight: isMobile ? "20px" : "40px",
                paddingBottom: "10px",
                pointerEvents: "auto",
              }}
              data-testid="main-content"
            >
              {/* Menu Section */}
              <div
                style={{
                  width: isMobile ? "100%" : "70%",
                  maxWidth: "800px",
                }}
                data-testid="menu-section-container"
              >
                <MenuSectionHTML
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
                  height={isMobile ? 300 : 350}
                />
              </div>

              {/* Archetype Selection */}
              <div
                style={{
                  width: isMobile ? "100%" : "70%",
                  maxWidth: "800px",
                }}
                data-testid="archetype-section-container"
              >
                <ArchetypeDisplayHTML
                  archetypes={archetypeData}
                  selectedIndex={selectedArchetypeIndex}
                  onArchetypeChange={handleArchetypeIndexChange}
                  onPlaySFX={audio.playSFX}
                  width={
                    isMobile
                      ? screenWidth * 0.9
                      : Math.min(800, screenWidth * 0.7)
                  }
                  height={isMobile ? 300 : 350}
                  isMobile={isMobile}
                />
              </div>
            </div>

            {/* Volume Control */}
            <VolumeControl position="top-right" compact={isMobile} />

            {/* Footer */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                paddingBottom: "10px",
                background: `linear-gradient(to bottom, rgba(0, 0, 0, 0), ${colors.footerBackground})`,
                borderTop: `1px solid ${colors.footerBorder}`,
                pointerEvents: "auto",
              }}
              data-testid="intro-footer"
            >
              {/* Motto */}
              <div
                style={{
                  fontSize: isMobile ? "11px" : "14px",
                  color: `#${KOREAN_COLORS.ACCENT_CYAN.toString(16).padStart(6, "0")}`,
                  fontFamily: FONT_FAMILY.KOREAN,
                  fontStyle: "italic",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                data-testid="footer-motto"
              >
                흑괘의 길을 걸어라 - Walk the Path of the Black Trigram
              </div>

              {/* GitHub link */}
              <div
                style={{
                  fontSize: isMobile ? "9px" : "12px",
                  color: `#${KOREAN_COLORS.SECONDARY_MAGENTA.toString(16).padStart(6, "0")}`,
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() =>
                  window.open("https://github.com/Hack23/blacktrigram", "_blank")
                }
                data-testid="footer-link"
              >
                Open Source Korean Martial Arts Game by Hack23
              </div>

              {/* Version */}
              <div
                style={{
                  fontSize: isMobile ? "9px" : "12px",
                  color: `#${KOREAN_COLORS.SECONDARY_MAGENTA.toString(16).padStart(6, "0")}`,
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() =>
                  window.open(
                    `https://github.com/Hack23/blacktrigram/releases/tag/v${APP_VERSION}`,
                    "_blank"
                  )
                }
                data-testid="footer-version"
              >
                Version {APP_VERSION}
              </div>
            </div>
          </div>
        </Html>
      </Canvas>
    </div>
  );
};

export default IntroScreenThreeJS;
