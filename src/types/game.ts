/**
 * @fileoverview Core game state and flow management for Black Trigram Korean martial arts simulator
 * @description Comprehensive type system for game mechanics, match management, and Korean martial arts context
 *
 * @author Black Trigram Development Team
 * @version 1.0.0
 */

import type { CombatEventData } from "./combat";
import type { PlayerState, KoreanText, CombatResult, TrigramStance } from "./index";
import type { PlayerMatchStats } from "./player";
import { GameMode, GamePhase } from "./enums";

/**
 * @interface GameState
 * @description Main game state with Korean martial arts match context
 *
 * @example
 * ```tsx
 * const gameState: GameState = {
 *   mode: GameMode.VERSUS,
 *   phase: GamePhase.COMBAT,
 *   players: [musaWarrior, shadowAssassin],
 *   currentRound: 2,
 *   maxRounds: 3,
 *   timeRemaining: 120,
 *   isPaused: false,
 *   matchStatistics: matchStats,
 *   winner: null
 * };
 * ```
 */
export interface GameState {
  readonly mode: GameMode;
  readonly phase: GamePhase;
  readonly players: readonly [PlayerState, PlayerState];
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly timeRemaining: number;
  readonly isPaused: boolean;
  readonly matchStatistics: MatchStatistics;
  readonly winner?: PlayerState | null;
}

/**
 * @interface MatchStatistics
 * @description Complete match statistics with Korean martial arts metrics
 */
export interface MatchStatistics {
  readonly totalDamageDealt: number;
  readonly totalDamageTaken: number;
  readonly criticalHits: number;
  readonly vitalPointHits: number;
  readonly techniquesUsed: number;
  readonly perfectStrikes: number;
  readonly consecutiveWins: number;
  readonly matchDuration: number; // seconds
  readonly totalMatches: number;
  readonly maxRounds: number;
  readonly winner: number;
  readonly totalRounds: number;
  readonly currentRound: number;
  readonly timeRemaining: number;
  readonly combatEvents: readonly CombatResult[];
  readonly finalScore: {
    readonly player1: number;
    readonly player2: number;
  };
  readonly roundsWon: {
    readonly player1: number;
    readonly player2: number;
  };
  readonly player1: PlayerMatchStats;
  readonly player2: PlayerMatchStats;
}

/**
 * @interface RoundResult
 * @description Korean martial arts round result with traditional victory methods
 */
export interface RoundResult {
  readonly roundNumber: number;
  readonly winner: PlayerState | null;
  readonly victoryMethod: "knockout" | "submission" | "vital_point" | "time_limit" | "forfeit" | "technical";
  readonly victoryDescription: KoreanText;
  readonly duration: number; // seconds
  readonly damageDealt: {
    readonly player1: number;
    readonly player2: number;
  };
  readonly techniquesUsed: {
    readonly player1: readonly string[];
    readonly player2: readonly string[];
  };
  readonly vitalPointHits: {
    readonly player1: number;
    readonly player2: number;
  };
  readonly criticalHits: {
    readonly player1: number;
    readonly player2: number;
  };
  readonly perfectStrikes: {
    readonly player1: number;
    readonly player2: number;
  };
  readonly stanceChanges: {
    readonly player1: number;
    readonly player2: number;
  };
  readonly martialArtsRating: {
    readonly player1: number; // 0-100 based on technique execution
    readonly player2: number;
  };
}

/**
 * @interface MatchConfig
 * @description Complete match configuration with Korean martial arts settings
 */
export interface MatchConfig {
  readonly mode: GameMode;
  readonly rounds: number;
  readonly roundDuration: number; // seconds
  readonly player1Archetype: string;
  readonly player2Archetype: string;
  readonly stage: string;
  readonly difficulty?: "easy" | "medium" | "hard" | "expert";
  readonly allowVitalPoints?: boolean;
  readonly traditionalRules?: boolean;
  readonly koreanTerminology?: boolean;
  readonly enableCommentary?: boolean;
  readonly audioLanguage?: "korean" | "english" | "bilingual";
  readonly visualEffects?: "minimal" | "standard" | "enhanced";
  readonly realism?: "arcade" | "simulation" | "authentic";
  readonly timeLimit?: number; // total match time limit in seconds
  readonly healthMode?: "standard" | "realistic" | "training";
  readonly kiSystem?: "traditional" | "modern" | "disabled";
  readonly balanceSystem?: boolean;
  readonly consciousnessSystem?: boolean;
  readonly painSystem?: boolean;
  readonly injurySystem?: boolean;
  readonly weatherConditions?: "clear" | "rain" | "snow" | "wind";
  readonly timeOfDay?: "dawn" | "morning" | "noon" | "evening" | "night";
  readonly crowdNoise?: "silent" | "quiet" | "moderate" | "loud";
  readonly judgeSystem?: "automatic" | "traditional" | "modern";
}

/**
 * @interface GameEvent
 * @description Game event system with Korean martial arts context
 */
export interface GameEvent {
  readonly id: string;
  readonly type: GameEventType;
  readonly timestamp: number;
  readonly playerId?: string;
  readonly data: Record<string, any>;
  readonly message?: KoreanText;
  readonly koreanDescription?: string;
  readonly martialArtsContext?: string;
}

/**
 * @enum GameEventType
 * @description Korean martial arts specific game events
 */
export enum GameEventType {
  GAME_START = "game_start",
  ROUND_START = "round_start",
  ROUND_END = "round_end",
  MATCH_END = "match_end",
  PLAYER_ATTACK = "player_attack",
  PLAYER_HIT = "player_hit",
  STANCE_CHANGE = "stance_change",
  TECHNIQUE_EXECUTE = "technique_execute",
  VITAL_POINT_HIT = "vital_point_hit",
  STATUS_EFFECT = "status_effect",
  CRITICAL_HIT = "critical_hit",
  PERFECT_STRIKE = "perfect_strike",
  COUNTER_ATTACK = "counter_attack",
  BLOCK_SUCCESS = "block_success",
  KI_TECHNIQUE = "ki_technique",
  TRIGRAM_MASTERY = "trigram_mastery"
}

/**
 * @interface GameSession
 * @description Complete game session with Korean martial arts progression
 */
export interface GameSession {
  readonly sessionId: string;
  readonly startTime: number;
  readonly endTime?: number;
  readonly playerProgress: {
    readonly player1: SessionProgress;
    readonly player2?: SessionProgress;
  };
  readonly matchesPlayed: readonly MatchStatistics[];
  readonly overallStats: {
    readonly totalPlayTime: number;
    readonly techniquesLearned: readonly string[];
    readonly stanceMastery: Record<TrigramStance, number>;
    readonly achievements: readonly Achievement[];
  };
}

/**
 * @interface SessionProgress
 * @description Player progression in Korean martial arts training
 */
export interface SessionProgress {
  readonly playerId: string;
  readonly experienceGained: number;
  readonly skillPoints: number;
  readonly newTechniques: readonly string[];
  readonly stanceProgress: Record<TrigramStance, number>;
  readonly martialArtsRank: string;
  readonly koreanTermsLearned: readonly string[];
}

/**
 * @interface Achievement
 * @description Korean martial arts achievements and honors
 */
export interface Achievement {
  readonly id: string;
  readonly name: KoreanText;
  readonly description: KoreanText;
  readonly category: "combat" | "training" | "cultural" | "mastery";
  readonly unlockedAt: number;
  readonly rarity: "common" | "rare" | "epic" | "legendary";
  readonly martialArtsSignificance?: string;
  readonly culturalContext?: string;
}

/**
 * @interface TrainingSession
 * @description Korean martial arts training session data
 */
export interface TrainingSession {
  readonly sessionId: string;
  readonly mode: "basics" | "advanced" | "free" | "vital_points" | "sparring" | "meditation";
  readonly duration: number; // seconds
  readonly accuracy: number; // 0-1
  readonly improvement: number; // percentage improvement
  readonly masterInstructions: readonly KoreanText[];
  readonly traditionContext: string;
  readonly skillPointsEarned: number;
  readonly experienceGained: number;
  readonly stanceMastery: Record<TrigramStance, number>;
  readonly mistakesMade: number;
  readonly perfectExecutions: number;
  readonly focusLevel: number; // 0-100
  readonly endurance: number; // 0-100
  readonly mentalClarity: number; // 0-100
  readonly spiritualGrowth: number; // 0-100
  readonly teacherFeedback: KoreanText;
  readonly nextRecommendation: string;
  readonly meditationTime: number; // seconds
  readonly breathingExercises: number;
  readonly formCorrections: readonly string[];
  readonly philosophyLessons: readonly string[];
}

/**
 * @namespace GameConstants
 * @description Game-related constants and configuration
 */
export namespace GameConstants {
  /** Default match configuration */
  export const DEFAULT_MATCH_CONFIG: MatchConfig = {
    mode: GameMode.VERSUS,
    rounds: 3,
    roundDuration: 180,
    player1Archetype: "musa",
    player2Archetype: "amsalja",
    stage: "traditional_dojang",
    difficulty: "medium",
    allowVitalPoints: true,
    traditionalRules: true,
    koreanTerminology: true,
    enableCommentary: true,
    audioLanguage: "bilingual",
    visualEffects: "enhanced",
    realism: "simulation",
    timeLimit: 600, // 10 minutes total
    healthMode: "realistic",
    kiSystem: "traditional",
    balanceSystem: true,
    consciousnessSystem: true,
    painSystem: true,
    injurySystem: false, // disabled for safety
    weatherConditions: "clear",
    timeOfDay: "evening",
    crowdNoise: "moderate",
    judgeSystem: "traditional",
  };

  /** Korean martial arts ranking system */
  export const MARTIAL_ARTS_RANKS = [
    "입문자", // Beginner
    "초급자", // Novice
    "중급자", // Intermediate
    "고급자", // Advanced
    "유단자", // Black Belt
    "사범",   // Instructor
    "관장",   // Master
    "종사"    // Grandmaster
  ] as const;

  /** Victory conditions in Korean martial arts context */
  export const VICTORY_CONDITIONS = {
    KNOCKOUT: { korean: "기절", english: "Knockout" },
    SUBMISSION: { korean: "항복", english: "Submission" },
    VITAL_POINT: { korean: "급소타격", english: "Vital Point Strike" },
    TIME_LIMIT: { korean: "시간승", english: "Time Victory" },
    FORFEIT: { korean: "기권", english: "Forfeit" },
    TECHNICAL: { korean: "기술승", english: "Technical Victory" },
    RING_OUT: { korean: "장외", english: "Ring Out" },
    DISQUALIFICATION: { korean: "실격", english: "Disqualification" },
    JUDGES_DECISION: { korean: "판정승", english: "Judges' Decision" },
    PERFECT_VICTORY: { korean: "완전승", english: "Perfect Victory" },
  } as const;

  /** Combat difficulty multipliers */
  export const DIFFICULTY_MULTIPLIERS = {
    easy: {
      playerDamage: 1.2,
      aiDamage: 0.8,
      aiAccuracy: 0.7,
      aiReactionTime: 1.5,
    },
    medium: {
      playerDamage: 1.0,
      aiDamage: 1.0,
      aiAccuracy: 0.8,
      aiReactionTime: 1.0,
    },
    hard: {
      playerDamage: 0.9,
      aiDamage: 1.2,
      aiAccuracy: 0.9,
      aiReactionTime: 0.8,
    },
    expert: {
      playerDamage: 0.8,
      aiDamage: 1.4,
      aiAccuracy: 0.95,
      aiReactionTime: 0.6,
    },
  } as const;

  /** Korean martial arts philosophy principles */
  export const MARTIAL_PHILOSOPHY = {
    RESPECT: { korean: "예의", english: "Courtesy" },
    INTEGRITY: { korean: "염치", english: "Integrity" },
    PERSEVERANCE: { korean: "인내", english: "Perseverance" },
    SELF_CONTROL: { korean: "극기", english: "Self-Control" },
    INDOMITABLE_SPIRIT: { korean: "불굴", english: "Indomitable Spirit" },
    HUMILITY: { korean: "겸손", english: "Humility" },
    DISCIPLINE: { korean: "훈련", english: "Discipline" },
    HONOR: { korean: "명예", english: "Honor" },
  } as const;

  /** Traditional Korean time periods */
  export const TIME_PERIODS = {
    DAWN: { korean: "새벽", english: "Dawn", hours: [5, 6] },
    MORNING: { korean: "아침", english: "Morning", hours: [7, 8, 9, 10, 11] },
    NOON: { korean: "정오", english: "Noon", hours: [12] },
    AFTERNOON: { korean: "오후", english: "Afternoon", hours: [13, 14, 15, 16, 17] },
    EVENING: { korean: "저녁", english: "Evening", hours: [18, 19, 20] },
    NIGHT: { korean: "밤", english: "Night", hours: [21, 22, 23, 0, 1, 2, 3, 4] },
  } as const;

  /** Martial arts belt progression */
  export const BELT_SYSTEM = {
    WHITE: { korean: "백띠", english: "White Belt", level: 0, experience: 0 },
    YELLOW: { korean: "노랑띠", english: "Yellow Belt", level: 1, experience: 100 },
    GREEN: { korean: "초록띠", english: "Green Belt", level: 2, experience: 300 },
    BLUE: { korean: "파랑띠", english: "Blue Belt", level: 3, experience: 600 },
    BROWN: { korean: "갈색띠", english: "Brown Belt", level: 4, experience: 1000 },
    BLACK_1DAN: { korean: "흑띠 1단", english: "1st Dan Black Belt", level: 5, experience: 1500 },
    BLACK_2DAN: { korean: "흑띠 2단", english: "2nd Dan Black Belt", level: 6, experience: 2500 },
    BLACK_3DAN: { korean: "흑띠 3단", english: "3rd Dan Black Belt", level: 7, experience: 4000 },
    MASTER: { korean: "사범", english: "Master", level: 8, experience: 7000 },
    GRANDMASTER: { korean: "종사", english: "Grandmaster", level: 9, experience: 12000 },
  } as const;
}

/**
 * @type GamePhaseTransition
 * @description Valid game phase transitions
 */
export type GamePhaseTransition = {
  [K in GamePhase]: readonly GamePhase[];
};

/**
 * @constant VALID_PHASE_TRANSITIONS
 * @description Allowed game phase transitions for proper flow control
 */
export const VALID_PHASE_TRANSITIONS: GamePhaseTransition = {
  [GamePhase.MENU]: [GamePhase.LOADING, GamePhase.TRAINING],
  [GamePhase.LOADING]: [GamePhase.COMBAT, GamePhase.TRAINING, GamePhase.MENU],
  [GamePhase.COMBAT]: [GamePhase.PAUSED, GamePhase.VICTORY, GamePhase.DEFEAT, GamePhase.MENU],
  [GamePhase.PAUSED]: [GamePhase.COMBAT, GamePhase.MENU],
  [GamePhase.TRAINING]: [GamePhase.MENU, GamePhase.COMBAT],
  [GamePhase.VICTORY]: [GamePhase.MENU, GamePhase.COMBAT],
  [GamePhase.DEFEAT]: [GamePhase.MENU, GamePhase.COMBAT]
} as const;

/**
 * @interface GameAudio
 * @description Audio context for Korean martial arts atmosphere
 */
export interface GameAudio {
  readonly backgroundMusic: string;
  readonly combatSounds: Record<string, string>;
  readonly koreanVoiceOver: Record<string, string>;
  readonly traditionalInstruments: readonly string[];
  readonly modernCyberpunk: readonly string[];
}

/**
 * @interface GameAnalytics
 * @description Analytics for game improvement and player experience
 */
export interface GameAnalytics {
  readonly sessionId: string;
  readonly playerId: string;
  readonly gameVersion: string;
  readonly platform: string;
  readonly deviceInfo: {
    readonly screenWidth: number;
    readonly screenHeight: number;
    readonly userAgent: string;
    readonly language: string;
    readonly timezone: string;
  };
  readonly performanceMetrics: {
    readonly averageFPS: number;
    readonly memoryUsage: number;
    readonly loadTime: number;
    readonly renderTime: number;
    readonly inputLatency: number;
  };
  readonly gameplayMetrics: {
    readonly totalPlayTime: number;
    readonly matchesPlayed: number;
    readonly winsLosses: {
      readonly wins: number;
      readonly losses: number;
      readonly draws: number;
    };
    readonly favoriteArchetype: string;
    readonly favoriteStance: string;
    readonly averageMatchDuration: number;
    readonly techniquesUsedCount: Record<string, number>;
    readonly difficultyProgression: readonly string[];
  };
  readonly learningMetrics: {
    readonly timeToFirstWin: number;
    readonly skillImprovement: number;
    readonly mistakePatterns: readonly string[];
    readonly strengthAreas: readonly string[];
    readonly weaknessAreas: readonly string[];
    readonly trainingTimeSpent: number;
    readonly philosophyLessonsCompleted: number;
  };
  readonly culturalEngagement: {
    readonly koreanTermsLearned: number;
    readonly philosophyInterest: number;
    readonly traditionalModeUsage: number;
    readonly audioLanguagePreference: string;
    readonly culturalContentViewed: readonly string[];
  };
  readonly userFeedback: {
    readonly enjoymentRating: number; // 1-10
    readonly difficultyRating: number; // 1-10
    readonly culturalAccuracyRating: number; // 1-10
    readonly recommendationLikelihood: number; // 1-10
    readonly suggestions: readonly string[];
    readonly reportedIssues: readonly string[];
  };
  readonly accessibilityMetrics: {
    readonly colorBlindAssist: boolean;
    readonly motionReduce: boolean;
    readonly fontSizeAdjustment: number;
    readonly audioDescriptions: boolean;
    readonly keyboardOnlyNavigation: boolean;
  };
}

/**
 * @interface GameSettings
 * @description Comprehensive game settings with Korean localization
 */
export interface GameSettings {
  readonly audio: {
    readonly masterVolume: number; // 0-1
    readonly musicVolume: number; // 0-1
    readonly sfxVolume: number; // 0-1
    readonly voiceVolume: number; // 0-1
    readonly language: "korean" | "english" | "bilingual";
    readonly koreanVoiceActing: boolean;
    readonly traditionalMusic: boolean;
    readonly combatCommentary: boolean;
  };
  readonly visual: {
    readonly resolution: string; // "1920x1080", "1280x720", etc.
    readonly fullscreen: boolean;
    readonly vsync: boolean;
    readonly frameRate: number; // 30, 60, 120, unlimited
    readonly graphicsQuality: "low" | "medium" | "high" | "ultra";
    readonly particleEffects: boolean;
    readonly screenShake: boolean;
    readonly bloomEffect: boolean;
    readonly motionBlur: boolean;
  };
  readonly gameplay: {
    readonly difficulty: "easy" | "medium" | "hard" | "expert" | "custom";
    readonly inputMethod: "keyboard" | "gamepad" | "touch" | "hybrid";
    readonly autoGuard: boolean;
    readonly damageNumbers: boolean;
    readonly hitboxDisplay: boolean;
    readonly trajectoryLines: boolean;
    readonly slowMotion: boolean;
    readonly perfectTimingAssist: boolean;
  };
  readonly cultural: {
    readonly koreanTerminology: boolean;
    readonly hanjaDisplay: boolean;
    readonly philosophyQuotes: boolean;
    readonly traditionalCeremony: boolean;
    readonly respectGestures: boolean;
    readonly culturalTips: boolean;
    readonly historicalContext: boolean;
  };
  readonly accessibility: {
    readonly colorBlindSupport: boolean;
    readonly highContrast: boolean;
    readonly largeText: boolean;
    readonly reducedMotion: boolean;
    readonly audioDescriptions: boolean;
    readonly subtitles: boolean;
    readonly buttonRemapping: boolean;
    readonly oneHandedMode: boolean;
  };
  readonly training: {
    readonly aiDifficulty: "beginner" | "intermediate" | "advanced" | "master";
    readonly showHitboxes: boolean;
    readonly frameDataDisplay: boolean;
    readonly recordingMode: boolean;
    readonly slowMotionTraining: boolean;
    readonly mistakeHighlight: boolean;
    readonly formCorrection: boolean;
    readonly breathingGuide: boolean;
  };
}

/**
 * @type GameEventHandler
 * @description Function type for handling game events
 */
export type GameEventHandler = (event: GameEvent) => void;

/**
 * @interface GameEventSubscription
 * @description Event subscription management
 */
export interface GameEventSubscription {
  readonly eventType: GameEventType;
  readonly handler: GameEventHandler;
  readonly priority: number;
  readonly once: boolean;
  readonly id: string;
}

/**
 * @interface GameConfiguration
 * @description Complete game configuration combining all settings
 */
export interface GameConfiguration {
  readonly version: string;
  readonly buildDate: string;
  readonly environment: "development" | "staging" | "production";
  readonly features: {
    readonly analyticsEnabled: boolean;
    readonly debugMode: boolean;
    readonly experimentalFeatures: boolean;
    readonly betaContent: boolean;
  };
  readonly limits: {
    readonly maxPlayers: number;
    readonly maxSpectators: number;
    readonly maxMatchDuration: number; // seconds
    readonly maxTrainingTime: number; // seconds
    readonly maxReplayLength: number; // seconds
  };
  readonly validation: {
    readonly strictTypeChecking: boolean;
    readonly performanceMonitoring: boolean;
    readonly errorReporting: boolean;
    readonly usageTracking: boolean;
  };
}

// Export all game-related types
export type {
  GameEventHandler,
  GameEventSubscription,
  GameConfiguration,
  GameSettings,
};
