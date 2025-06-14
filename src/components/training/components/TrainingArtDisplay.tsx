import React, { useCallback, useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text, Sprite } from "pixi.js";
import { KOREAN_COLORS } from "../../../types/constants";
import { TrigramStance, PlayerArchetype } from "../../../types/enums";
import type { TrainingStatistics } from "./types/training";

// Extend PIXI components
extend({ Container, Graphics, Text, Sprite });

/**
 * ## Training Art Display Component
 *
 * **Business Purpose:**
 * Provides an immersive visual display for Korean martial arts training sessions.
 * Creates an authentic dojang (training hall) atmosphere with:
 * - Traditional Korean architectural elements
 * - Real-time archetype character visualization
 * - Dynamic trigram stance energy displays
 * - Performance feedback through visual effects
 *
 * **Korean Martial Arts Integration:**
 * - Authentic dojang floor and wall textures from traditional Korean architecture
 * - Real-time trigram symbol visualization based on I Ching philosophy
 * - Archetype-specific visual styling reflecting Korean martial traditions
 * - Performance indicators using Korean terminology and aesthetic
 *
 * **Architecture:**
 * - Responsive design adapting to mobile, tablet, and desktop layouts
 * - PixiJS graphics for high-performance rendering of traditional patterns
 * - Component composition with extracted art asset management
 * - Real-time visual feedback synchronized with training session state
 *
 * @component
 * @example
 * ```tsx
 * <TrainingArtDisplay
 *   selectedStance={TrigramStance.GEON}
 *   playerArchetype={PlayerArchetype.MUSA}
 *   trainingMode="basics"
 *   isTraining={true}
 *   accuracy={85}
 *   currentCombo={3}
 *   x={100}
 *   y={50}
 *   width={800}
 *   height={600}
 *   screenWidth={1200}
 *   screenHeight={800}
 * />
 * ```
 *
 * @see {@link useTrainingSession} For training session state management
 * @see {@link TrainingModeSelector} For training mode context
 * @see {@link TrigramStance} For stance enumeration values
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export interface TrainingArtDisplayProps {
  /** Current trigram stance being practiced (affects visual styling and energy display) */
  readonly selectedStance: TrigramStance;
  
  /** Player's chosen archetype (determines character visual representation) */
  readonly playerArchetype: PlayerArchetype;
  
  /** Active training mode identifier (affects background and UI styling) */
  readonly trainingMode: string;
  
  /** Whether training session is currently active (enables dynamic visual effects) */
  readonly isTraining: boolean;
  
  /** Current accuracy percentage (0-100, affects visual feedback colors) */
  readonly accuracy: number;
  
  /** Current technique combo count (affects visual combo indicators) */
  readonly currentCombo: number;
  
  /** X position offset for component placement */
  readonly x: number;
  
  /** Y position offset for component placement */
  readonly y: number;
  
  /** Component width for responsive layout calculations */
  readonly width: number;
  
  /** Component height for responsive layout calculations */
  readonly height: number;
  
  /** Screen width for responsive breakpoint calculations */
  readonly screenWidth: number;
  
  /** Screen height for responsive breakpoint calculations */
  readonly screenHeight: number;
}

/**
 * ## Training Art Display Implementation
 *
 * **Business Logic:**
 * - Renders authentic Korean dojang environment with traditional patterns
 * - Displays real-time archetype character with stance-appropriate animations
 * - Shows training performance through color-coded visual feedback
 * - Integrates trigram philosophy through symbolic visual elements
 *
 * **Technical Architecture:**
 * - Responsive design with mobile-first approach
 * - High-performance PixiJS graphics for smooth animations
 * - Asset management with fallback rendering for missing textures
 * - Color-coded feedback system based on traditional Korean aesthetics
 *
 * **Performance Considerations:**
 * - Memoized calculations prevent unnecessary re-renders
 * - Efficient graphics drawing with proper cleanup
 * - Optimized texture loading with progressive enhancement
 *
 * @param props - Training art display configuration and state
 * @returns JSX.Element representing the complete dojang visual environment
 */
export const TrainingArtDisplay: React.FC<TrainingArtDisplayProps> = ({
  selectedStance,
  playerArchetype,
  trainingMode,
  isTraining,
  accuracy,
  currentCombo,
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
}) => {
  const isMobile = screenWidth < 768;

  const visualEffects = useMemo(
    () => ({
      stanceEnergy: KOREAN_COLORS.PRIMARY_CYAN,
      accuracyColor:
        accuracy >= 70
          ? KOREAN_COLORS.ACCENT_GREEN
          : accuracy >= 50
          ? KOREAN_COLORS.ACCENT_GOLD
          : KOREAN_COLORS.ACCENT_RED,
    }),
    [accuracy]
  );

  const drawEnhancedDojang = useCallback(
    (g: any) => {
      g.clear();
      // Enhanced dojang background with Korean patterns
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.3 });
      g.rect(0, 0, width, height);
      g.fill();

      // Traditional Korean geometric pattern
      g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.2 });
      const patternSize = 30;
      for (let i = patternSize; i < width - patternSize; i += patternSize) {
        for (let j = patternSize; j < height - patternSize; j += patternSize) {
          g.moveTo(i - 8, j);
          g.lineTo(i + 8, j);
          g.moveTo(i - 6, j - 4);
          g.lineTo(i + 6, j - 4);
          g.moveTo(i - 8, j + 4);
          g.lineTo(i + 8, j + 4);
        }
      }
      g.stroke();
    },
    [width, height]
  );

  const getArchetypeKoreanName = (archetype: PlayerArchetype): string => {
    const names = {
      [PlayerArchetype.MUSA]: "무사",
      [PlayerArchetype.AMSALJA]: "암살자",
      [PlayerArchetype.HACKER]: "해커",
      [PlayerArchetype.JEONGBO_YOWON]: "정보요원",
      [PlayerArchetype.JOJIK_POKRYEOKBAE]: "조직폭력배",
    };
    return names[archetype] || "무사";
  };

  const getStanceKoreanName = (stance: TrigramStance): string => {
    const names = {
      [TrigramStance.GEON]: "건",
      [TrigramStance.TAE]: "태",
      [TrigramStance.LI]: "리",
      [TrigramStance.JIN]: "진",
      [TrigramStance.SON]: "손",
      [TrigramStance.GAM]: "감",
      [TrigramStance.GAN]: "간",
      [TrigramStance.GON]: "곤",
    };
    return names[stance] || "건";
  };

  const drawTrigramSymbol = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      
      // Draw trigram symbol for current stance
      const stanceColors = {
        [TrigramStance.GEON]: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
        [TrigramStance.TAE]: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
        [TrigramStance.LI]: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
        [TrigramStance.JIN]: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
        [TrigramStance.SON]: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
        [TrigramStance.GAM]: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
        [TrigramStance.GAN]: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
        [TrigramStance.GON]: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
      };

      const stanceColor = stanceColors[selectedStance] || KOREAN_COLORS.ACCENT_GOLD;
      
      g.fill({ color: stanceColor, alpha: 0.8 });
      g.circle(width * 0.05 + 15, height * 0.5, 12);
      g.fill();
    },
    [selectedStance, width, height]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="training-art-display">
      {/* Enhanced Dojang Background */}
      <pixiGraphics draw={drawEnhancedDojang} data-testid="dojang-background" />

      {/* Korean Text Labels */}
      <pixiText
        text={getArchetypeKoreanName(playerArchetype)}
        style={{
          fontSize: 16,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          fontWeight: "bold",
        }}
        x={width * 0.05}
        y={height * 0.05}
        data-testid="archetype-korean-name"
      />

      <pixiText
        text={getStanceKoreanName(selectedStance)}
        style={{
          fontSize: 14,
          fill: visualEffects.stanceEnergy,
          fontWeight: "bold",
        }}
        x={width * 0.05}
        y={height * 0.4}
        data-testid="stance-korean-name"
      />

      {/* Performance Indicators */}
      {isTraining && (
        <pixiContainer
          x={width * 0.8}
          y={height * 0.05}
          data-testid="performance-indicators"
        >
          <pixiText
            text={`정확도: ${Math.round(accuracy)}%`}
            style={{
              fontSize: 12,
              fill: visualEffects.accuracyColor,
              fontWeight: "bold",
            }}
            data-testid="accuracy-korean"
          />
          <pixiText
            text={`연속: ${currentCombo}회`}
            style={{
              fontSize: 12,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
            }}
            y={40}
            data-testid="combo-korean"
          />
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default TrainingArtDisplay;

// Helper functions for art display
function getStanceEnergyColor(stance: TrigramStance): number {
  const stanceColors = {
    GEON: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    TAE: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    LI: KOREAN_COLORS.ACCENT_RED,
    JIN: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    SON: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    GAM: KOREAN_COLORS.PRIMARY_CYAN,
    GAN: KOREAN_COLORS.WARNING_ORANGE,
    GON: KOREAN_COLORS.WARNING_YELLOW,
  };

  return stanceColors[stance] || KOREAN_COLORS.TEXT_PRIMARY;
}

function getStancePose(stance: TrigramStance): {
  offsetX: number;
  offsetY: number;
} {
  const poses = {
    GEON: { offsetX: 0, offsetY: -10 },
    TAE: { offsetX: -5, offsetY: 0 },
    LI: { offsetX: 5, offsetY: -5 },
    JIN: { offsetX: 0, offsetY: -15 },
    SON: { offsetX: -8, offsetY: 5 },
    GAM: { offsetX: 3, offsetY: 8 },
    GAN: { offsetX: 0, offsetY: 10 },
    GON: { offsetX: 0, offsetY: 15 },
  };

  return poses[stance] || { offsetX: 0, offsetY: 0 };
}

function getTrigramLines(stance: TrigramStance): boolean[] {
  const patterns = {
    GEON: [true, true, true], // ☰ Heaven
    TAE: [false, true, true], // ☱ Lake
    LI: [true, false, true], // ☲ Fire
    JIN: [false, false, true], // ☳ Thunder
    SON: [true, true, false], // ☴ Wind
    GAM: [false, true, false], // ☵ Water
    GAN: [true, false, false], // ☶ Mountain
    GON: [false, false, false], // ☷ Earth
  };

  return patterns[stance] || [true, true, true];
}

function getArchetypeKoreanName(archetype: PlayerArchetype): string {
  const names = {
    [PlayerArchetype.MUSA]: "무사",
    [PlayerArchetype.AMSALJA]: "암살자",
    [PlayerArchetype.HACKER]: "해커",
    [PlayerArchetype.JEONGBO_YOWON]: "정보요원",
    [PlayerArchetype.JOJIK_POKRYEOKBAE]: "조직폭력배",
  };

  return names[archetype] || archetype;
}

function getStanceKoreanName(stance: TrigramStance): string {
  const names = {
    GEON: "건 (天)",
    TAE: "태 (澤)",
    LI: "리 (火)",
    JIN: "진 (雷)",
    SON: "손 (風)",
    GAM: "감 (水)",
    GAN: "간 (山)",
    GON: "곤 (地)",
  };

  return names[stance] || stance;
}
      <pixiGraphics
        draw={drawTrainingModeEffects}
        data-testid="training-mode-effects"
      />

      {/* Archetype Character Display */}
      {artAssets.archetypeTextures[playerArchetype] ? (
        <pixiSprite
          texture={artAssets.archetypeTextures[playerArchetype]!}
          x={width * 0.6}
          y={height * 0.3}
          width={width * 0.35}
          height={height * 0.6}
          anchor={{ x: 0.5, y: 0.5 }}
          alpha={0.8}
          data-testid="archetype-character"
        />
      ) : (
        <pixiGraphics
          draw={drawArchetypeCharacter}
          data-testid="archetype-character-fallback"
        />
      )}

      {/* Trigram Stance Symbol */}
      <pixiGraphics draw={drawTrigramSymbol} data-testid="trigram-symbol" />

      {/* Korean Text Labels */}
      <pixiText
        text={getArchetypeKoreanName(playerArchetype)}
        style={{
          fontSize: 16,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          fontWeight: "bold",
        }}
        x={width * 0.05}
        y={height * 0.05}
        data-testid="archetype-korean-name"
      />

      <pixiText
        text={getStanceKoreanName(selectedStance)}
        style={{
          fontSize: 14,
          fill: visualEffects.stanceEnergy,
          fontWeight: "bold",
        }}
        x={width * 0.05}
        y={height * 0.4}
        data-testid="stance-korean-name"
      />

      {/* Performance Indicators */}
      {isTraining && (
        <pixiContainer
          x={width * 0.8}
          y={height * 0.05}
          data-testid="performance-indicators"
        >
          <pixiText
            text={`정확도: ${Math.round(accuracy)}%`}
            style={{
              fontSize: 12,
              fill: visualEffects.accuracyColor,
              fontWeight: "bold",
            }}
            data-testid="accuracy-korean"
          />

          <pixiText
            text={`연속: ${currentCombo}회`}
            style={{
              fontSize: 12,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
            }}
            y={40}
            data-testid="combo-korean"
          />
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default TrainingArtDisplay;

// Helper functions for art display
function getStanceEnergyColor(stance: TrigramStance): number {
  const stanceColors = {
    GEON: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    TAE: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    LI: KOREAN_COLORS.ACCENT_RED,
    JIN: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    SON: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    GAM: KOREAN_COLORS.PRIMARY_CYAN,
    GAN: KOREAN_COLORS.WARNING_ORANGE,
    GON: KOREAN_COLORS.WARNING_YELLOW,
  };

  return stanceColors[stance] || KOREAN_COLORS.TEXT_PRIMARY;
}

function getStancePose(stance: TrigramStance): {
  offsetX: number;
  offsetY: number;
} {
  const poses = {
    GEON: { offsetX: 0, offsetY: -10 },
    TAE: { offsetX: -5, offsetY: 0 },
    LI: { offsetX: 5, offsetY: -5 },
    JIN: { offsetX: 0, offsetY: -15 },
    SON: { offsetX: -8, offsetY: 5 },
    GAM: { offsetX: 3, offsetY: 8 },
    GAN: { offsetX: 0, offsetY: 10 },
    GON: { offsetX: 0, offsetY: 15 },
  };

  return poses[stance] || { offsetX: 0, offsetY: 0 };
}

function getTrigramLines(stance: TrigramStance): boolean[] {
  const patterns = {
    GEON: [true, true, true], // ☰ Heaven
    TAE: [false, true, true], // ☱ Lake
    LI: [true, false, true], // ☲ Fire
    JIN: [false, false, true], // ☳ Thunder
    SON: [true, true, false], // ☴ Wind
    GAM: [false, true, false], // ☵ Water
    GAN: [true, false, false], // ☶ Mountain
    GON: [false, false, false], // ☷ Earth
  };

  return patterns[stance] || [true, true, true];
}

function getArchetypeKoreanName(archetype: PlayerArchetype): string {
  const names = {
    [PlayerArchetype.MUSA]: "무사",
    [PlayerArchetype.AMSALJA]: "암살자",
    [PlayerArchetype.HACKER]: "해커",
    [PlayerArchetype.JEONGBO_YOWON]: "정보요원",
    [PlayerArchetype.JOJIK_POKRYEOKBAE]: "조직폭력배",
  };

  return names[archetype] || archetype;
}

function getStanceKoreanName(stance: TrigramStance): string {
  const names = {
    GEON: "건 (天)",
    TAE: "태 (澤)",
    LI: "리 (火)",
    JIN: "진 (雷)",
    SON: "손 (風)",
    GAM: "감 (水)",
    GAN: "간 (山)",
    GON: "곤 (地)",
  };

  return names[stance] || stance;
}
