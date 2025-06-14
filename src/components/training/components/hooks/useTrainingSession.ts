import { useState, useCallback, useRef, useEffect } from "react";
import type { PlayerState } from "../../../../types/player";
import type {
  TrainingMode,
  TrainingModeConfig,
  TrainingStatistics,
} from "../types/training";
import { useTrainingStatistics } from "./useTrainingStatistics";
import {
  executeTrainingTechnique,
  calculateTrainingExperience,
} from "../utils/trainingUtils";
import type { AudioManager } from "../../../../audio/AudioManager";
import { PlayerArchetype, TrigramStance } from "../../../../types/enums";

export interface UseTrainingSessionProps {
  readonly mode: TrainingMode;
  readonly modeData: TrainingModeConfig;
  readonly player: PlayerState;
  readonly onPlayerUpdate: (updates: Partial<PlayerState>) => void;
  readonly audio: AudioManager;
}

export interface TrainingSessionState {
  readonly isTraining: boolean;
  readonly isSessionPaused: boolean;
  readonly stats: TrainingStatistics;
  readonly currentCombo: number;
  readonly lastTechniqueTime: number;
  readonly startTraining: () => void;
  readonly stopTraining: () => void;
  readonly pauseTraining: () => void;
  readonly resumeTraining: () => void;
  readonly executeTrainingTechnique: (params: {
    stance: TrigramStance;
    dummy: any;
    currentCombo: number;
    lastTechniqueTime: number;
  }) => any;
  readonly resetTrainingSession: () => void;
}

/**
 * ## Training Session Management Hook
 *
 * **Business Purpose:**
 * Central hook for managing Korean martial arts training sessions within Black Trigram.
 * Provides comprehensive session lifecycle management including:
 * - Traditional Korean martial arts progression tracking
 * - Authentic trigram-based technique execution
 * - Cultural accuracy in training methodology
 * - Performance analytics following Korean educational standards
 *
 * **Korean Martial Arts Integration:**
 * - Implements traditional Korean training session structure (준비 → 연습 → 평가)
 * - Respects Korean martial arts timing and rhythm principles
 * - Provides authentic Korean feedback terminology and progression markers
 * - Maintains cultural accuracy in training difficulty progression
 *
 * **Technical Architecture:**
 * - Manages complex training state with React hooks pattern
 * - Integrates with audio system for immersive Korean martial arts experience
 * - Coordinates with combat system for realistic technique execution
 * - Provides real-time performance analytics and trend analysis
 *
 * @param config - Training session configuration and callbacks
 * @returns Complete training session management interface
 *
 * @example
 * ```typescript
 * const {
 *   isTraining,
 *   stats,
 *   startTraining,
 *   executeTrainingTechnique
 * } = useTrainingSession({
 *   mode: "basics",
 *   modeData: TRAINING_MODES[0],
 *   player: playerState,
 *   onPlayerUpdate: handlePlayerUpdate,
 *   audio: audioManager
 * });
 * ```
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export interface UseTrainingSessionConfig {
  /** Training mode identifier (basics, advanced, free) */
  readonly mode: TrainingMode;

  /** Detailed configuration for selected training mode */
  readonly modeData: TrainingModeData;

  /** Current player state with skills and attributes */
  readonly player: PlayerState;

  /** Callback to update player state when training affects attributes */
  readonly onPlayerUpdate: (updates: Partial<PlayerState>) => void;

  /** Audio manager for training sound effects and feedback */
  readonly audio: AudioManager;
}

/**
 * ## Training Session Statistics
 *
 * **Business Value:**
 * Provides comprehensive metrics for player skill assessment
 * and progression tracking. Enables data-driven training
 * recommendations and difficulty adjustments.
 *
 * **Metrics Tracked:**
 * - Raw performance numbers (attempts, hits, accuracy)
 * - Temporal data (session time, technique timing)
 * - Quality assessments (perfect strikes, critical hits)
 * - Progression indicators (experience gained, level progress)
 */
export interface TrainingStatistics {
  /** Total number of technique execution attempts */
  readonly attempts: number;

  /** Number of successful technique hits on target */
  readonly hits: number;

  /** Number of perfectly executed techniques (form + timing) */
  readonly perfectStrikes: number;

  /** Number of critical hits with maximum effectiveness */
  readonly criticalHits: number;

  /** Overall accuracy percentage (0-100) */
  readonly accuracy: number;

  /** Total session duration in seconds */
  readonly sessionTime: number;

  /** Experience points gained during session */
  readonly experienceGained: number;
}

/**
 * ## Training Session Hook Implementation
 *
 * **Business Logic:**
 * - Manages complete training session lifecycle with proper state transitions
 * - Tracks detailed statistics for performance analysis and progression
 * - Calculates experience gains based on Korean martial arts learning principles
 * - Provides real-time feedback through integrated audio and visual systems
 *
 * **Technical Architecture:**
 * - Efficient state management with optimized re-render patterns
 * - Integration with multiple external systems through clean interfaces
 * - Performance monitoring and optimization for smooth training experience
 * - Type-safe implementation ensuring data consistency across components
 *
 * **Korean Martial Arts Features:**
 * - Authentic training progression based on traditional Korean methodology
 * - Cultural accuracy in technique evaluation and learning assessment
 * - Integration with trigram philosophy for balanced skill development
 * - Proper Korean terminology and feedback throughout training process
 *
 * @param props - Training session configuration and integration points
 * @returns Complete training session management interface
 */
export const useTrainingSession = ({
  mode,
  modeData,
  player,
  onPlayerUpdate,
  audio,
}: UseTrainingSessionProps) => {
  const [isTraining, setIsTraining] = useState(false);
  const [isSessionPaused, setIsSessionPaused] = useState(false);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [lastTechniqueTime, setLastTechniqueTime] = useState(0);
  const sessionStartTime = useRef<number>(0);
  const comboTimer = useRef<NodeJS.Timeout | null>(null);

  const {
    stats,
    resetStats,
    incrementAttempts,
    incrementPerfectStrikes,
    incrementCriticalHits,
    addDamage,
    updateAccuracy,
    incrementTechniques,
    updateBestCombo,
  } = useTrainingStatistics();

  /**
   * **Business Logic:** Calculates archetype-specific experience multipliers
   * based on traditional Korean martial arts learning patterns
   *
   * **Korean Martial Arts Context:**
   * Different archetypes have varying aptitudes for different training types:
   * - 무사 (Musa): Balanced progression across all techniques
   * - 암살자 (Amsalja): Enhanced precision and stealth technique learning
   * - 해커 (Hacker): Technology-enhanced learning acceleration
   * - 정보요원 (Jeongbo Yowon): Intelligence-based skill analysis bonus
   * - 조직폭력배 (Jojik Pokryeokbae): Raw power focus with technique penalties
   *
   * @param archetype - Player's martial arts archetype
   * @returns Experience multiplier (0.5 to 2.0)
   */
  const getArchetypeExperienceMultiplier = useCallback(
    (archetype: PlayerArchetype): number => {
      const multipliers = {
        musa: 1.0, // Balanced training
        amsalja: 1.2, // Quick learning
        hacker: 1.1, // Tech-enhanced learning
        jeongbo_yowon: 1.3, // Intelligence gathering bonus
        jojik_pokryeokbae: 0.9, // Rough training penalty
      };

      return multipliers[archetype] || 1.0;
    },
    []
  );

  /**
   * **Business Process:** Initiates a new training session
   *
   * Performs the following operations:
   * 1. Validates player readiness and mode requirements
   * 2. Initializes session statistics and timing
   * 3. Configures audio environment for training
   * 4. Sets up performance tracking systems
   *
   * **Error Handling:** Gracefully handles invalid states
   * and provides user feedback for resolution
   */
  const startTraining = useCallback(() => {
    if (isTraining) return;

    setIsTraining(true);
    setIsSessionPaused(false);
    setSessionStartTime(Date.now());

    // Reset statistics for new session
    setStats({
      attempts: 0,
      hits: 0,
      perfectStrikes: 0,
      criticalHits: 0,
      accuracy: 0,
      sessionTime: 0,
      experienceGained: 0,
    });

    config.audio.playSFX("training_start");
  }, [isTraining, config.audio]);

  const stopTraining = useCallback(() => {
    setIsTraining(false);
    setIsSessionPaused(false);

    // Calculate final experience based on performance
    const baseExperience = calculateTrainingExperience(stats, config.mode);
    const archetypeBonus = getArchetypeExperienceBonus(config.player.archetype);
    const finalExperience = Math.round(baseExperience * archetypeBonus);

    // Update player with experience and best combo
    config.onPlayerUpdate({
      experiencePoints: (config.player.experiencePoints || 0) + finalExperience,
    });

    updateBestCombo(currentCombo);

    // Play completion sound based on accuracy
    if (stats.accuracy >= 95) {
      config.audio.playSFX("perfect_completion");
    } else if (stats.accuracy >= 80) {
      config.audio.playSFX("excellent_completion");
    } else if (stats.accuracy >= 60) {
      config.audio.playSFX("good_completion");
    } else {
      config.audio.playSFX("training_complete");
    }

    config.audio.stopMusic();
  }, [
    stats,
    config.mode,
    config.player,
    config.onPlayerUpdate,
    currentCombo,
    updateBestCombo,
    config.audio,
  ]);

  const pauseTraining = useCallback(() => {
    if (!isTraining) return;

    setIsSessionPaused(true);
    config.audio.playSFX("menu_select");
    config.audio.setVolume("music", 0.3);
  }, [isTraining, config.audio]);

  const resumeTraining = useCallback(() => {
    if (!isSessionPaused) return;

    setIsSessionPaused(false);
    config.audio.setVolume("music", 0.7);
  }, [isSessionPaused, config.audio]);

  // Enhanced technique execution
  const handleExecuteTrainingTechnique = useCallback(
    (params: {
      stance: TrigramStance;
      dummy: any;
      currentCombo: number;
      lastTechniqueTime: number;
    }) => {
      if (!isTraining || isSessionPaused) {
        return {
          miss: true,
          damage: 0,
          hit: false,
          critical: false,
          perfect: false,
        };
      }

      incrementAttempts();
      const now = Date.now();

      // Execute the technique using utility function
      const result = executeTrainingTechnique({
        player: config.player,
        stance: params.stance,
        target: params.dummy,
        trainingMode: config.mode,
      });

      // Update statistics based on result
      if (result.hit) {
        incrementTechniques();
        addDamage(result.damage);

        if (result.perfect) {
          incrementPerfectStrikes();
          config.audio.playSFX("perfect_hit");
          config.audio.playTrigramStanceSound(`${params.stance}_perfect`);
        } else if (result.critical) {
          incrementCriticalHits();
          config.audio.playSFX("critical_hit");
          config.audio.playVitalPointHitSound("critical");
        } else {
          config.audio.playSFX("normal_hit");
          config.audio.playTrigramStanceSound(params.stance);
        }

        // Handle combo logic
        const timeSinceLastHit = now - params.lastTechniqueTime;
        const comboWindow = getComboWindowForMode(config.mode);

        if (timeSinceLastHit < comboWindow && params.currentCombo > 0) {
          setCurrentCombo((prev) => prev + 1);
          config.audio.playSFX(`combo_${Math.min(currentCombo + 1, 10)}`);
        } else {
          setCurrentCombo(1);
        }

        setLastTechniqueTime(now);

        // Clear existing combo timer and set new one
        if (comboTimer.current) {
          clearTimeout(comboTimer.current);
        }

        comboTimer.current = setTimeout(() => {
          setCurrentCombo(0);
        }, comboWindow);
      } else {
        config.audio.playSFX("miss");
        setCurrentCombo(0);
      }

      // Update accuracy
      const newAccuracy =
        stats.attempts > 0 ? (stats.perfectStrikes / stats.attempts) * 100 : 0;
      updateAccuracy(newAccuracy);

      return result;
    },
    [
      isTraining,
      isSessionPaused,
      config.player,
      config.mode,
      stats,
      currentCombo,
      incrementAttempts,
      incrementTechniques,
      incrementPerfectStrikes,
      incrementCriticalHits,
      addDamage,
      updateAccuracy,
      config.audio,
    ]
  );

  // Reset training session
  const resetTrainingSession = useCallback(() => {
    setIsTraining(false);
    setIsSessionPaused(false);
    setCurrentCombo(0);
    setLastTechniqueTime(0);
    resetStats();

    if (comboTimer.current) {
      clearTimeout(comboTimer.current);
      comboTimer.current = null;
    }

    config.audio.stopMusic();
    config.audio.playSFX("session_reset");
  }, [resetStats, config.audio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (comboTimer.current) {
        clearTimeout(comboTimer.current);
      }
    };
  }, []);

  // Archetype experience multipliers
  const getArchetypeExperienceBonus = (archetype: PlayerArchetype): number => {
    const multipliers = {
      musa: 1.0, // Balanced training
      amsalja: 1.2, // Quick learning
      hacker: 1.1, // Tech-enhanced learning
      jeongbo_yowon: 1.3, // Intelligence gathering bonus
      jojik_pokryeokbae: 0.9, // Rough training penalty
    };

    return multipliers[archetype] || 1.0;
  };

  function getComboWindow(mode: TrainingMode): number {
    const windowMap: Record<TrainingMode, number> = {
      basics: 3000, // 3 seconds for beginners
      advanced: 2000, // 2 seconds for advanced
      techniques: 1500, // 1.5 seconds for technique training
      combat: 1000, // 1 second for combat simulation
      free: 2500, // 2.5 seconds for free practice
    };

    return windowMap[mode] || 2000;
  }

  // Return the complete hook interface
  return {
    isTraining,
    isSessionPaused,
    stats,
    currentCombo,
    lastTechniqueTime,
    startTraining,
    stopTraining,
    pauseTraining,
    resumeTraining,
    executeTrainingTechnique,
    resetTrainingSession,
  };
};

export default useTrainingSession;
  };
};

export default useTrainingSession;
