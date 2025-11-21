/**
 * IntroScreenImproved - Enhanced IntroScreen using Three.js Korean UI components
 * 
 * Replaces HTML fullscreen overlay with native Three.js UI components
 * for better integration and performance
 */

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
import { PLAYER_ARCHETYPES_DATA } from "../../systems/types";
import { GameMode, PlayerArchetype } from "../../types/common";
import { KOREAN_COLORS } from "../../types/constants";
import { KoreanText as KoreanText3D, KoreanButton } from "../three";
import { MenuSectionThree } from "./components/MenuSectionThree";
import { ArchetypeDisplayThree } from "./components/ArchetypeDisplayThree";

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

export interface IntroScreenImprovedProps {
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

// Memoized archetype keys array for efficient lookup
const ARCHETYPE_KEYS = Object.keys(PLAYER_ARCHETYPES_DATA) as PlayerArchetype[];

// Helper function to convert PlayerArchetype enum to array index
const getArchetypeIndex = (archetype: PlayerArchetype): number => {
  return ARCHETYPE_KEYS.indexOf(archetype);
};

// Helper function to convert array index to PlayerArchetype enum
const getArchetypeFromIndex = (index: number): PlayerArchetype => {
  return ARCHETYPE_KEYS[index] ?? PlayerArchetype.MUSA;
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
 * IntroScreenImproved Component
 * Uses Three.js Korean UI components for consistent theming
 */
export const IntroScreenImproved: React.FC<IntroScreenImprovedProps> = ({
  onMenuSelect,
  onArchetypeSelect,
  selectedArchetype = PlayerArchetype.MUSA,
  width: propWidth,
  height: propHeight,
}) => {
  const audio = useAudio();
  const introMusicStarted = useRef(false);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);

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

  // Convert PLAYER_ARCHETYPES_DATA to array format for ArchetypeDisplayThree
  const archetypeData = useMemo(() => {
    const archetypes = Object.keys(PLAYER_ARCHETYPES_DATA) as PlayerArchetype[];
    return archetypes.map((archetype) => {
      const data = PLAYER_ARCHETYPES_DATA[archetype];
      return {
        id: archetype.toLowerCase(),
        korean: data.name.korean,
        english: data.name.english,
        description: data.description.korean,
        color: data.colors.primary,
        textureKey: archetype.toLowerCase(),
        stats: data.stats,
        philosophy: data.philosophy,
      };
    });
  }, []);

  // Update archetype when index changes
  const handleArchetypeIndexChange = useCallback(
    (index: number) => {
      setSelectedArchetypeIndex(index);
      const newArchetype = getArchetypeFromIndex(index);
      setCurrentArchetype(newArchetype);
      onArchetypeSelect?.(newArchetype);
      audio.playSFX("menu_hover");
    },
    [onArchetypeSelect, audio]
  );

  // Handle menu item selection
  const handleMenuItemSelect = useCallback(
    (mode: GameMode) => {
      audio.playSFX("menu_select");
      onMenuSelect(mode, currentArchetype);
    },
    [onMenuSelect, currentArchetype, audio]
  );

  // Play intro music after first user interaction
  useEffect(() => {
    const startMusic = () => {
      if (audio.isInitialized && !introMusicStarted.current) {
        introMusicStarted.current = true;
        audio.playMusic("intro_theme");
      }
    };
    window.addEventListener("keydown", startMusic, { once: true });
    window.addEventListener("mousedown", startMusic, { once: true });
    window.addEventListener("touchstart", startMusic, { once: true });
    
    return () => {
      window.removeEventListener("keydown", startMusic);
      window.removeEventListener("mousedown", startMusic);
      window.removeEventListener("touchstart", startMusic);
      if (introMusicStarted.current) {
        audio.stopMusic();
      }
    };
  }, [audio]);

  const isMobile = screenWidth < 768;

  return (
    <div
      style={{
        width: screenWidth,
        height: screenHeight,
        position: "relative",
        overflow: "hidden",
      }}
      data-testid="intro-screen-improved"
    >
      {/* Three.js Canvas */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 5, 10], fov: 75 }}
        onCreated={({ gl }) => {
          gl.setClearColor(KOREAN_COLORS.UI_BACKGROUND_DARK, 1);
        }}
      >
        {/* 3D Background Scene */}
        <BackgroundScene />

        {/* Main Title */}
        <KoreanText3D
          korean="흑괘"
          english="Black Trigram"
          size="xlarge"
          position={[0, 3.5, 0]}
          weight="bold"
          color={KOREAN_COLORS.ACCENT_GOLD}
          testId="main-title"
        />

        {/* Subtitle */}
        <KoreanText3D
          korean="한국 무술 시뮬레이터"
          english="Korean Martial Arts Simulator"
          size="medium"
          position={[0, 2.8, 0]}
          color={KOREAN_COLORS.TEXT_SECONDARY}
          testId="subtitle"
        />

        {/* Trigram Symbols */}
        <KoreanText3D
          korean="☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷"
          english=""
          size="large"
          position={[0, 2, 0]}
          color={KOREAN_COLORS.PRIMARY_CYAN}
          testId="trigram-symbols"
        />

        {/* Menu Section */}
        <MenuSectionThree
          menuItems={MENU_ITEMS}
          selectedIndex={selectedMenuIndex}
          onModeSelect={handleMenuItemSelect}
          onSelectedIndexChange={setSelectedMenuIndex}
          onPlaySFX={audio.playSFX}
          position={[-4, 0, 0]}
          width={isMobile ? 250 : 300}
        />

        {/* Archetype Display */}
        <ArchetypeDisplayThree
          archetypes={archetypeData}
          selectedIndex={selectedArchetypeIndex}
          onArchetypeChange={handleArchetypeIndexChange}
          onPlaySFX={audio.playSFX}
          position={[3, 0, 0]}
          width={isMobile ? 280 : 350}
        />

        {/* Footer Text */}
        <KoreanText3D
          korean="흑괘의 길을 걸어라"
          english="Walk the Path of the Black Trigram"
          size="small"
          position={[0, -3.5, 0]}
          color={KOREAN_COLORS.ACCENT_CYAN}
          weight="bold"
          layout="horizontal"
          testId="footer-motto"
        />

        {/* Version Info */}
        <KoreanButton
          korean={`버전 ${APP_VERSION}`}
          english={`Version ${APP_VERSION}`}
          onClick={() =>
            window.open(
              `https://github.com/Hack23/blacktrigram/releases/tag/v${APP_VERSION}`,
              "_blank"
            )
          }
          variant="secondary"
          size="sm"
          position={[0, -4.2, 0]}
          testId="version-button"
        />
      </Canvas>
    </div>
  );
};

export default IntroScreenImproved;
