/**
 * Visual and Audio Feedback Types for Breathing Disruption System.
 * 
 * **Korean**: 호흡곤란 시각/청각 피드백
 * 
 * Type definitions for visual indicators, animations, and audio effects
 * that provide player feedback for breathing disruption status.
 * 
 * @module systems/breathing/feedback
 * @category Combat Systems
 * @korean 호흡곤란피드백
 */

import { KoreanText } from "@/types";
import { BreathingDisruptionLevel } from "./BreathingDisruptionSystem";

/**
 * Visual indicator configuration for breathing disruption HUD display.
 * 
 * **Korean**: 호흡곤란 HUD 표시기
 * 
 * Displays breathing difficulty status with color-coded lungs icon (🫁)
 * and severity-based visual styling.
 */
export interface BreathingIndicatorConfig {
  /** Whether to show the breathing indicator */
  readonly visible: boolean;
  
  /** Current breathing disruption level */
  readonly level: BreathingDisruptionLevel;
  
  /** Icon to display (default: 🫁 lungs emoji) */
  readonly icon: string;
  
  /** Color based on severity */
  readonly color: number;
  
  /** Opacity for pulsing effect (0-1) */
  readonly opacity: number;
  
  /** Scale for emphasis (1.0 = normal) */
  readonly scale: number;
  
  /** Bilingual text label */
  readonly label: KoreanText;
  
  /** Time remaining until recovery (milliseconds) */
  readonly timeRemaining: number;
  
  /** Whether recovery is in progress */
  readonly isRecovering: boolean;
}

/**
 * Animation state for character posture during breathing disruption.
 * 
 * **Korean**: 호흡곤란 자세 애니메이션
 * 
 * Defines character posture and movement patterns based on breathing difficulty.
 */
export interface BreathingPostureState {
  /** Breathing disruption level affecting posture */
  readonly level: BreathingDisruptionLevel;
  
  /** Body bend angle (degrees) - 0 = upright, positive = bent forward */
  readonly bendAngle: number;
  
  /** Breathing rhythm speed multiplier (0-1) */
  readonly breathingSpeed: number;
  
  /** Chest expansion intensity (0-1) */
  readonly chestExpansion: number;
  
  /** Shoulder rise/fall intensity (0-1) */
  readonly shoulderMovement: number;
  
  /** Whether character is gasping (rapid breathing) */
  readonly isGasping: boolean;
  
  /** Whether character is holding chest/torso */
  readonly isHoldingTorso: boolean;
  
  /** Movement speed penalty (0-1, where 1 = no penalty) */
  readonly movementPenalty: number;
}

/**
 * Audio effect configuration for breathing sounds.
 * 
 * **Korean**: 호흡 소리 효과
 * 
 * Defines audio playback for breathing difficulty sounds.
 */
export interface BreathingAudioEffect {
  /** Breathing disruption level */
  readonly level: BreathingDisruptionLevel;
  
  /** Audio file ID or URL */
  readonly audioId: string;
  
  /** Volume level (0-1) */
  readonly volume: number;
  
  /** Playback speed multiplier */
  readonly playbackRate: number;
  
  /** Whether to loop the sound */
  readonly loop: boolean;
  
  /** Fade in duration (milliseconds) */
  readonly fadeIn: number;
  
  /** Fade out duration (milliseconds) */
  readonly fadeOut: number;
  
  /** Korean voice callout (optional) */
  readonly voiceCallout?: {
    readonly text: string;
    readonly audioId: string;
  };
}

/**
 * Predefined breathing indicator configurations for each severity level.
 */
export const BREATHING_INDICATOR_CONFIGS: Record<
  Exclude<BreathingDisruptionLevel, BreathingDisruptionLevel.NONE>,
  Omit<BreathingIndicatorConfig, "visible" | "timeRemaining" | "isRecovering">
> = {
  [BreathingDisruptionLevel.WINDED]: {
    level: BreathingDisruptionLevel.WINDED,
    icon: "🫁",
    color: 0xffd700, // Gold - mild warning
    opacity: 0.7,
    scale: 1.0,
    label: {
      korean: "바람맞음",
      english: "Winded",
      romanized: "baram-maeum",
    },
  },
  [BreathingDisruptionLevel.GASPING]: {
    level: BreathingDisruptionLevel.GASPING,
    icon: "🫁",
    color: 0xffa500, // Orange - moderate warning
    opacity: 0.85,
    scale: 1.1,
    label: {
      korean: "헐떡임",
      english: "Gasping",
      romanized: "heoltteogim",
    },
  },
  [BreathingDisruptionLevel.SEVERELY_WINDED]: {
    level: BreathingDisruptionLevel.SEVERELY_WINDED,
    icon: "🫁",
    color: 0xff4444, // Red - severe warning
    opacity: 1.0,
    scale: 1.2,
    label: {
      korean: "심각한 호흡곤란",
      english: "Severely Winded",
      romanized: "simgakhan hoheup gonnan",
    },
  },
};

/**
 * Predefined posture states for each breathing disruption level.
 */
export const BREATHING_POSTURE_STATES: Record<
  Exclude<BreathingDisruptionLevel, BreathingDisruptionLevel.NONE>,
  BreathingPostureState
> = {
  [BreathingDisruptionLevel.WINDED]: {
    level: BreathingDisruptionLevel.WINDED,
    bendAngle: 5, // Slight forward lean
    breathingSpeed: 1.3, // 30% faster breathing
    chestExpansion: 0.6,
    shoulderMovement: 0.5,
    isGasping: false,
    isHoldingTorso: false,
    movementPenalty: 0.95, // 5% movement penalty
  },
  [BreathingDisruptionLevel.GASPING]: {
    level: BreathingDisruptionLevel.GASPING,
    bendAngle: 15, // Noticeable forward bend
    breathingSpeed: 1.8, // 80% faster breathing
    chestExpansion: 0.4,
    shoulderMovement: 0.7,
    isGasping: true,
    isHoldingTorso: false,
    movementPenalty: 0.85, // 15% movement penalty
  },
  [BreathingDisruptionLevel.SEVERELY_WINDED]: {
    level: BreathingDisruptionLevel.SEVERELY_WINDED,
    bendAngle: 30, // Bent over significantly
    breathingSpeed: 2.5, // 150% faster breathing
    chestExpansion: 0.2,
    shoulderMovement: 0.9,
    isGasping: true,
    isHoldingTorso: true,
    movementPenalty: 0.70, // 30% movement penalty
  },
};

/**
 * Audio effect configurations for breathing sounds.
 */
export const BREATHING_AUDIO_EFFECTS: Record<
  Exclude<BreathingDisruptionLevel, BreathingDisruptionLevel.NONE>,
  BreathingAudioEffect
> = {
  [BreathingDisruptionLevel.WINDED]: {
    level: BreathingDisruptionLevel.WINDED,
    audioId: "breathing_heavy",
    volume: 0.5,
    playbackRate: 1.2,
    loop: true,
    fadeIn: 200,
    fadeOut: 500,
  },
  [BreathingDisruptionLevel.GASPING]: {
    level: BreathingDisruptionLevel.GASPING,
    audioId: "breathing_gasping",
    volume: 0.7,
    playbackRate: 1.5,
    loop: true,
    fadeIn: 150,
    fadeOut: 500,
    voiceCallout: {
      text: "헉헉", // Gasp sound
      audioId: "voice_gasping_kr",
    },
  },
  [BreathingDisruptionLevel.SEVERELY_WINDED]: {
    level: BreathingDisruptionLevel.SEVERELY_WINDED,
    audioId: "breathing_severe",
    volume: 0.9,
    playbackRate: 2.0,
    loop: true,
    fadeIn: 100,
    fadeOut: 500,
    voiceCallout: {
      text: "호흡곤란!", // Breathing difficulty!
      audioId: "voice_breathing_difficulty_kr",
    },
  },
};

/**
 * Create breathing indicator config for current player state.
 * 
 * @param level - Current breathing disruption level
 * @param timeRemaining - Milliseconds until effect expires
 * @param isRecovering - Whether recovery is in progress
 * @returns Complete BreathingIndicatorConfig for HUD display
 */
export function createBreathingIndicator(
  level: BreathingDisruptionLevel,
  timeRemaining: number,
  isRecovering: boolean
): BreathingIndicatorConfig {
  if (level === BreathingDisruptionLevel.NONE) {
    return {
      visible: false,
      level,
      icon: "🫁",
      color: 0x00ff00,
      opacity: 0,
      scale: 1.0,
      label: { korean: "정상", english: "Normal", romanized: "jeongsang" },
      timeRemaining: 0,
      isRecovering: false,
    };
  }

  const baseConfig = BREATHING_INDICATOR_CONFIGS[level];
  
  return {
    ...baseConfig,
    visible: true,
    timeRemaining,
    isRecovering,
  };
}

/**
 * Get posture state for current breathing disruption level.
 * 
 * @param level - Current breathing disruption level
 * @returns BreathingPostureState for character animation
 */
export function getBreathingPosture(
  level: BreathingDisruptionLevel
): BreathingPostureState | null {
  if (level === BreathingDisruptionLevel.NONE) {
    return null;
  }
  
  return BREATHING_POSTURE_STATES[level];
}

/**
 * Get audio effect for current breathing disruption level.
 * 
 * @param level - Current breathing disruption level
 * @returns BreathingAudioEffect for audio playback
 */
export function getBreathingAudio(
  level: BreathingDisruptionLevel
): BreathingAudioEffect | null {
  if (level === BreathingDisruptionLevel.NONE) {
    return null;
  }
  
  return BREATHING_AUDIO_EFFECTS[level];
}
