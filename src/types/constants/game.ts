// General game engine and application constants

export const DEFAULT_GAME_SPEED = 1.0;

/**
 * Core game configuration constants for Black Trigram
 */

// Game configuration
export const GAME_CONFIG = {
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 800,
  TARGET_FPS: 60,
  ROUND_DURATION_SECONDS: 120,
  MAX_ROUNDS: 3,

  // Player defaults
  DEFAULT_HEALTH: 100,
  DEFAULT_KI: 100,
  DEFAULT_STAMINA: 100,

  // Combat settings
  DAMAGE_CALCULATION_PRECISION: 2,
  STATUS_EFFECT_TICK_RATE: 100, // ms
  COMBO_TIMEOUT: 2000, // ms
  STANCE_CHANGE_COOLDOWN: 500, // ms

  // Visual settings
  VITAL_POINT_INDICATOR_SIZE: 8,
  HIT_EFFECT_DURATION: 800, // ms
  UI_ANIMATION_DURATION: 300, // ms
  SHOW_VITAL_POINTS_DEBUG: false, // Added missing constant
  BACKGROUND_COLOR: 0x000000, // Added missing background color

  // Audio settings
  MASTER_VOLUME: 0.7,
  SFX_VOLUME: 0.8,
  MUSIC_VOLUME: 0.5,

  // Performance settings
  MAX_PARTICLES: 50,
  MAX_HIT_EFFECTS: 10,
  PHYSICS_TICK_RATE: 60, // Hz

  // Game title
  GAME_TITLE: {
    korean: "흑괘",
    english: "Black Trigram",
  },
} as const;

// Game version and metadata
export const GAME_METADATA = {
  VERSION: "1.0.0",
  BUILD: "2024.1",
  TITLE: "흑괘 (Black Trigram)",
  SUBTITLE: "Korean Martial Arts Combat Simulator",
  DEVELOPER: "Black Trigram Team",
  COPYRIGHT: "© 2024 Black Trigram",
} as const;

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  LOW_FPS_WARNING: 30,
  MEMORY_WARNING_MB: 512,
  AUDIO_LATENCY_WARNING_MS: 50,
  RENDER_TIME_WARNING_MS: 16.67, // 60fps = 16.67ms per frame
} as const;

// Debug settings
export const DEBUG_CONFIG = {
  SHOW_FPS: false,
  SHOW_MEMORY_USAGE: false,
  SHOW_HITBOXES: false,
  SHOW_VITAL_POINTS: false,
  LOG_COMBAT_EVENTS: false,
  LOG_AUDIO_EVENTS: false,
} as const;

// Korean martial arts philosophy integration
export const PHILOSOPHY_CONFIG = {
  // 팔괘 (Eight Trigrams) display timing
  TRIGRAM_DISPLAY_DURATION: 2000,
  TRIGRAM_TRANSITION_TIME: 500,

  // 음양 (Yin-Yang) balance indicators
  BALANCE_INDICATOR_SENSITIVITY: 0.1,
  BALANCE_RESTORATION_TIME: 3000,

  // 기 (Ki) energy visualization
  KI_PARTICLE_COUNT: 20,
  KI_FLOW_ANIMATION_SPEED: 1.5,
  KI_AURA_INTENSITY: 0.7,

  // 도장 (Dojang) environment
  DOJANG_LIGHTING_CYCLE: 300000, // 5 minutes day/night cycle
  MEDITATION_MODE_DURATION: 60000, // 1 minute meditation
  RESPECT_BOW_DURATION: 1500, // Traditional bow timing
} as const;

// Difficulty settings for Korean martial arts training
export const DIFFICULTY_SETTINGS = {
  BEGINNER: {
    korean: "초급",
    english: "Beginner",
    autoBlock: true,
    vitalPointHighlight: true,
    techniqueHints: true,
    slowerCombat: true,

    // Damage modifiers
    playerDamageMultiplier: 1.5,
    enemyDamageMultiplier: 0.7,

    // Timing assistance
    extendedBlockWindow: 1.5,
    extendedCounterWindow: 1.3,

    // Learning aids
    showCombatAnalysis: true,
    displayTechniqueNames: true,
    culturalContext: true,
  },

  INTERMEDIATE: {
    korean: "중급",
    english: "Intermediate",
    autoBlock: false,
    vitalPointHighlight: false,
    techniqueHints: true,
    slowerCombat: false,
    playerDamageMultiplier: 1.0,
    enemyDamageMultiplier: 1.0,
    extendedBlockWindow: 1.0,
    extendedCounterWindow: 1.0,
    showCombatAnalysis: true,
    displayTechniqueNames: false,
    culturalContext: true,
  },

  EXPERT: {
    korean: "전문가",
    english: "Expert",

    // No assistance
    autoBlock: false,
    vitalPointHighlight: false,
    techniqueHints: false,
    slowerCombat: false,

    // Realistic damage
    playerDamageMultiplier: 1.0,
    enemyDamageMultiplier: 1.2,

    // Precise timing required
    extendedBlockWindow: 0.8,
    extendedCounterWindow: 0.9,

    // Minimal aids
    showCombatAnalysis: false,
    displayTechniqueNames: false,
    culturalContext: false,
  },

  MASTER: {
    korean: "대가",
    english: "Master",

    // Maximum challenge
    autoBlock: false,
    vitalPointHighlight: false,
    techniqueHints: false,
    slowerCombat: false,

    // Punishing damage
    playerDamageMultiplier: 0.8,
    enemyDamageMultiplier: 1.5,

    // Strict timing
    extendedBlockWindow: 0.7,
    extendedCounterWindow: 0.8,

    // No aids
    showCombatAnalysis: false,
    displayTechniqueNames: false,
    culturalContext: false,
  },
} as const;

// Achievement and progression system
export const ACHIEVEMENT_CONFIG = {
  // Korean martial arts mastery levels
  TECHNIQUE_MASTERY_THRESHOLD: 100, // Uses before mastery
  STANCE_MASTERY_THRESHOLD: 50, // Successful stance changes
  COMBO_MASTERY_THRESHOLD: 25, // Perfect combos executed

  // Cultural understanding achievements
  PHILOSOPHY_COMPLETION: 8, // All trigram philosophies learned
  RESPECT_POINTS_MAX: 1000, // Maximum respect/honor points
  MEDITATION_HOURS: 10, // Hours in meditation mode

  // Combat achievements
  PERFECT_ROUNDS: 10, // Rounds won without taking damage
  VITAL_POINT_MASTERY: 70, // All vital points discovered
  ARCHETYPE_MASTERY: 5, // All player archetypes mastered

  // Progression milestones
  TOTAL_MATCHES: 100, // Career matches played
  WIN_STREAK_RECORD: 10, // Consecutive wins
  COMEBACK_VICTORIES: 5, // Wins from critical health
} as const;

// Game constants for Black Trigram

export const DEFAULT_STANCE_COOLDOWN_MS = 500;

export const GAME_CONSTANTS = {
  MAX_HEALTH: 100,
  MAX_KI: 100,
  MAX_STAMINA: 100,
  MAX_CONSCIOUSNESS: 100,
  MAX_PAIN: 100,
  MAX_BALANCE: 100,
  MAX_BLOOD_LOSS: 100,

  CRITICAL_HEALTH_THRESHOLD: 20,
  LOW_HEALTH_THRESHOLD: 50,

  BASE_DAMAGE_MULTIPLIER: 1.0,
  CRITICAL_HIT_MULTIPLIER: 1.5,

  DEFAULT_ACCURACY: 0.8,
  DEFAULT_TECHNIQUE_RANGE: 1.0,

  KI_REGEN_RATE: 1.5,
  STAMINA_REGEN_RATE: 2.0,
  HEALTH_REGEN_RATE: 0.1,
} as const;

// Game state persistence
export const SAVE_CONFIG = {
  AUTOSAVE_INTERVAL: 60000, // Autosave every minute
  MAX_SAVE_SLOTS: 3, // Number of save slots
  SAVE_COMPRESSION: true, // Compress save data
  CLOUD_SYNC: false, // Cloud save sync (future feature)

  // Data retention
  MATCH_HISTORY_LIMIT: 50, // Recent matches to keep
  REPLAY_STORAGE_LIMIT: 10, // Replay files to store
  SCREENSHOT_LIMIT: 20, // Screenshots to keep
} as const;

// Performance monitoring thresholds
export const PERFORMANCE_THRESHOLDS = {
  // Frame rate monitoring
  MIN_FPS: 30, // Minimum acceptable FPS
  TARGET_FPS: 60, // Target FPS
  FPS_SAMPLE_SIZE: 60, // Frames to average for FPS calculation

  // Memory usage alerts
  MAX_MEMORY_MB: 512,
  MEMORY_WARNING_THRESHOLD: 0.8,
  GARBAGE_COLLECTION_THRESHOLD: 0.9,
  MAX_AUDIO_LATENCY: 100,
  AUDIO_BUFFER_SIZE: 4096,
  MAX_DRAW_CALLS: 100,
  TEXTURE_CACHE_LIMIT: 50,
} as const;

// Export individual constants (no duplicates)
// These are already part of GAME_CONFIG, so direct export might be redundant
// unless specifically needed for tree-shaking or direct import clarity.
// export const {
//   MAX_TRANSITION_COST_KI,
//   MAX_TRANSITION_COST_STAMINA,
//   MAX_TRANSITION_TIME_MILLISECONDS,
// } = GAME_CONFIG;

// Game configuration constants for Black Trigram

export const GAME_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 1920,
  CANVAS_HEIGHT: 1080,

  // Background
  BACKGROUND_COLOR: 0x0a0a0a,

  // Player defaults
  DEFAULT_HEALTH: 100,
  DEFAULT_KI: 100,
  DEFAULT_STAMINA: 100,

  // Player starting positions
  PLAYER_START_POS_X_1: 400,
  PLAYER_START_POS_X_2: 1520,
  PLAYER_START_POS_Y: 540,

  // Combat settings
  MAX_COMBAT_TIME: 180000, // 3 minutes in milliseconds
  ROUND_TIME: 99000, // 99 seconds per round
  MAX_ROUNDS: 3,

  // Audio settings
  MASTER_VOLUME: 0.7,
  SFX_VOLUME: 0.8,
  MUSIC_VOLUME: 0.6,

  // Performance
  TARGET_FPS: 60,
  MAX_PARTICLES: 1000,

  // Korean martial arts specific
  VITAL_POINTS_COUNT: 70,
  TRIGRAM_STANCES_COUNT: 8,
  PLAYER_ARCHETYPES_COUNT: 5,

  // UI scaling
  UI_SCALE: 1.0,
  FONT_SCALE: 1.0,

  // Animation timing
  STANCE_CHANGE_DURATION: 500,
  TECHNIQUE_EXECUTION_TIME: 1000,
  HIT_EFFECT_DURATION: 800,

  // Damage calculation
  BASE_DAMAGE_MULTIPLIER: 1.0,
  CRITICAL_HIT_MULTIPLIER: 2.0,
  VITAL_POINT_MULTIPLIER: 1.5,

  // Status effects
  MAX_ACTIVE_EFFECTS: 10,
  EFFECT_TICK_RATE: 100, // milliseconds

  // Cyberpunk aesthetic
  NEON_GLOW_INTENSITY: 0.8,
  SCAN_LINE_SPEED: 2.0,
  GLITCH_FREQUENCY: 0.1,
} as const;

// Derived constants
export const HALF_CANVAS_WIDTH = GAME_CONFIG.CANVAS_WIDTH / 2;
export const HALF_CANVAS_HEIGHT = GAME_CONFIG.CANVAS_HEIGHT / 2;
export const ASPECT_RATIO =
  GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.CANVAS_HEIGHT;

// Game timing constants
export const FRAME_TIME = 1000 / GAME_CONFIG.TARGET_FPS;
export const TICK_RATE = GAME_CONFIG.TARGET_FPS;

// Player positioning helpers
export const PLAYER_DISTANCE =
  GAME_CONFIG.PLAYER_START_POS_X_2 - GAME_CONFIG.PLAYER_START_POS_X_1;
export const CENTER_X =
  (GAME_CONFIG.PLAYER_START_POS_X_1 + GAME_CONFIG.PLAYER_START_POS_X_2) / 2;

// Game configuration constants

export const GAME_CONFIG = {
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 800,
  DEFAULT_HEALTH: 100,
  DEFAULT_KI: 100,
  DEFAULT_STAMINA: 100,
  SHOW_VITAL_POINTS_DEBUG: false,
  MAX_PLAYERS: 2,
  DEFAULT_ROUND_TIME: 120, // seconds
  MAX_ROUNDS: 3,
  PHYSICS_TIMESTEP: 1 / 60, // 60 FPS
  COLLISION_PRECISION: 0.1,
  DAMAGE_SCALING: 1.0,
  KI_REGENERATION_RATE: 0.5, // per second
  STAMINA_REGENERATION_RATE: 1.0, // per second
  PAIN_DECAY_RATE: 0.2, // per second
} as const;

export const SCREEN_DIMENSIONS = {
  MIN_WIDTH: 800,
  MIN_HEIGHT: 600,
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
} as const;

export const ANIMATION_CONFIG = {
  DEFAULT_FRAME_RATE: 60,
  TRANSITION_DURATION: 300, // milliseconds
  FADE_DURATION: 500,
  STANCE_CHANGE_DURATION: 200,
  ATTACK_ANIMATION_DURATION: 400,
  HIT_EFFECT_DURATION: 150,
} as const;

export const COMBAT_CONFIG = {
  BASE_DAMAGE: 20,
  CRITICAL_MULTIPLIER: 1.5,
  VITAL_POINT_MULTIPLIER: 2.0,
  COMBO_DAMAGE_BONUS: 0.1, // 10% per combo hit
  MAX_COMBO_BONUS: 1.0, // 100% max bonus
  GUARD_DAMAGE_REDUCTION: 0.5, // 50% damage reduction when guarding
  COUNTER_ATTACK_WINDOW: 300, // milliseconds
  STUN_DURATION: 500,
  KNOCKDOWN_DURATION: 1000,
} as const;
