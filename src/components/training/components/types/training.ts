/**
 * ## Training System Type Definitions
 *
 * **Business Purpose:**
 * Comprehensive type definitions for Black Trigram's Korean martial arts training system.
 * Ensures type safety and cultural accuracy across all training components while
 * maintaining authentic Korean martial arts terminology and methodology.
 *
 * **Korean Martial Arts Integration:**
 * - Types reflect authentic Korean martial arts concepts and terminology
 * - Training progression follows traditional Korean martial arts hierarchy
 * - Cultural accuracy maintained in all interface definitions
 * - Supports bilingual Korean-English training experience
 *
 * **Technical Architecture:**
 * - Strict TypeScript typing for enhanced development experience
 * - Readonly properties ensuring immutable training data
 * - Comprehensive interface coverage for all training components
 * - Integration with existing Black Trigram type system
 *
 * @fileoverview Korean martial arts training system type definitions
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

import type { TrigramStance, PlayerArchetype } from "../../../../types/enums";
import type { Position, KoreanText } from "../../../../types/common";

/**
 * **Business Logic:** Supported training modes following Korean martial arts
 * educational progression from beginner to master level
 *
 * **Korean Martial Arts Integration:**
 * - "basics": 기본 훈련 - Foundation building phase
 * - "advanced": 고급 훈련 - Complex technique mastery phase
 * - "free": 자유 수련 - Creative application and personal style development
 */
export type TrainingMode = "basics" | "advanced" | "free";

/**
 * **Business Logic:** Comprehensive training mode configuration following
 * Korean martial arts educational standards and cultural accuracy
 *
 * **Korean Martial Arts Integration:**
 * - Bilingual names respecting Korean martial arts terminology
 * - Stance availability following traditional trigram progression
 * - Focus areas reflecting Korean martial arts core competencies
 * - Rewards system encouraging authentic Korean martial arts values
 */
export interface TrainingModeData {
  /** Unique identifier for the training mode */
  readonly id: TrainingMode;

  /** Bilingual name using authentic Korean martial arts terminology */
  readonly name: KoreanText;

  /** Detailed description of the training mode's educational purpose */
  readonly description: KoreanText;

  /** Maximum attempts allowed per session (prevents fatigue) */
  readonly maxAttempts: number;

  /** Difficulty level from 1 (기본) to 5 (고수) */
  readonly difficulty: number;

  /** Required player level following Korean martial arts hierarchy */
  readonly requiredLevel: number;

  /** Trigram stances available in this training mode */
  readonly availableStances: readonly TrigramStance[];

  /** Focus areas for skill development */
  readonly focusAreas: readonly string[];

  /** Rewards and progression unlocks */
  readonly rewards: {
    readonly experienceMultiplier: number;
    readonly unlocks: readonly string[];
    readonly achievements: readonly string[];
  };
}

/**
 * **Business Logic:** Training dummy state representing interactive practice target
 * with realistic Korean martial arts training equipment behavior
 *
 * **Korean Martial Arts Integration:**
 * - Health system simulating traditional Korean training dummy durability
 * - Behavioral states reflecting authentic training equipment responses
 * - Position tracking for precise Korean martial arts targeting practice
 */
export interface TrainingDummyState {
  /** Current dummy health points */
  readonly health: number;

  /** Maximum dummy health points */
  readonly maxHealth: number;

  /** Dummy position in training area */
  readonly position: Position;

  /** Whether dummy is active for training */
  readonly isActive: boolean;

  /** Timestamp of last successful hit */
  readonly lastHitTime: number;

  /** Total number of hits received this session */
  readonly hitCount: number;

  /** Whether dummy is stunned from powerful techniques */
  readonly isStunned: boolean;

  /** Whether dummy has entered defensive mode */
  readonly defensiveMode: boolean;
}

/**
 * **Business Logic:** Comprehensive training session statistics following
 * Korean martial arts assessment methodology and cultural evaluation standards
 *
 * **Korean Martial Arts Integration:**
 * - Statistics reflect traditional Korean martial arts performance metrics
 * - Accuracy tracking follows Korean martial arts precision standards
 * - Experience calculation respects Korean martial arts progression principles
 */
export interface TrainingStatistics {
  /** Total training attempts made this session */
  readonly attempts: number;

  /** Successful technique executions */
  readonly hits: number;

  /** Perfect technique executions (excellent form and timing) */
  readonly perfectStrikes: number;

  /** Overall accuracy percentage (0-100) */
  readonly accuracy: number;

  /** Training session duration in seconds */
  readonly sessionTime: number;

  /** Experience points gained this session */
  readonly experienceGained: number;
}

/**
 * **Business Logic:** Real-time feedback message system providing Korean martial arts
 * instruction and encouragement following traditional teaching methodology
 *
 * **Korean Martial Arts Integration:**
 * - Message types reflect Korean teaching communication styles
 * - Timing respects Korean martial arts attention and focus principles
 * - Content maintains cultural sensitivity and respect
 */
export interface FeedbackMessage {
  /** Unique message identifier */
  readonly id: string;

  /** Message text in Korean (with English translation when appropriate) */
  readonly text: string;

  /** Message type determining visual presentation and audio cues */
  readonly type: "success" | "warning" | "info" | "error";

  /** Message creation timestamp for lifecycle management */
  readonly timestamp: number;
}

/**
 * **Business Logic:** Training session configuration encompassing all aspects
 * of Korean martial arts training setup and management
 *
 * **Korean Martial Arts Integration:**
 * - Mode selection following Korean martial arts educational structure
 * - Player integration respecting Korean martial arts archetype specializations
 * - Audio integration for authentic Korean martial arts training environment
 */
export interface TrainingSessionConfig {
  /** Selected training mode identifier */
  readonly mode: TrainingMode;

  /** Detailed training mode configuration data */
  readonly modeData: TrainingModeData;

  /** Current player state and capabilities */
  readonly player: import("../../../../types/player").PlayerState;

  /** Callback for player state updates during training */
  readonly onPlayerUpdate: (
    updates: Partial<import("../../../../types/player").PlayerState>
  ) => void;

  /** Audio manager for Korean martial arts training sounds and music */
  readonly audio: import("../../../../audio/AudioManager").AudioManagerInterface;
}

/**
 * **Business Logic:** Enhanced training integration state providing comprehensive
 * system coordination and performance monitoring
 *
 * **Korean Martial Arts Integration:**
 * - Status tracking follows Korean martial arts training session methodology
 * - Performance metrics respect Korean martial arts evaluation standards
 * - Cultural authenticity indicators ensure respectful Korean representation
 */
export interface TrainingIntegrationState {
  /** Current training session status */
  readonly status: "idle" | "active" | "paused" | "evaluating";

  /** Real-time performance analytics */
  readonly performance: {
    readonly frameRate: number;
    readonly memoryUsage: number;
    readonly renderTime: number;
  };

  /** Cultural authenticity compliance indicators */
  readonly authenticity: {
    readonly koreanTerminologyUsage: number;
    readonly culturalAccuracy: number;
    readonly traditionalMethodology: number;
  };

  /** User experience optimization metrics */
  readonly userExperience: {
    readonly responsiveness: number;
    readonly feedbackLatency: number;
    readonly visualClarity: number;
  };
}

export default {
  TrainingMode,
  TrainingModeData,
  TrainingDummyState,
  TrainingStatistics,
  FeedbackMessage,
  TrainingSessionConfig,
  TrainingIntegrationState,
};
