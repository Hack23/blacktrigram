// General game engine and application constants

export const DEFAULT_GAME_SPEED = 1.0;

/**
 * Core game configuration constants for Black Trigram
 */

// Game configuration
export const GAME_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 1920,
  CANVAS_HEIGHT: 1080,
  FPS: 60, // Ensure FPS is present

  // Game timing
  ROUND_DURATION_SECONDS: 180, // Renamed from ROUND_DURATION
  MAX_ROUNDS: 3,

  // Player positioning
  PLAYER_START_POS_X_1: 480,
  PLAYER_START_POS_X_2: 1440,
  PLAYER_START_POS_Y: 800, // Example starting Y for both players
  GROUND_LEVEL_Y: 900, // Y-coordinate for the ground
  GRAVITY: 0.5, // Basic gravity for jumps/falls

  // Player visuals
  PLAYER_VISUAL_WIDTH: 100,
  PLAYER_VISUAL_HEIGHT: 150,
  HEALTH_BAR_WIDTH: 200,
  HEALTH_BAR_HEIGHT: 20,
  KI_BAR_WIDTH: 150,
  KI_BAR_HEIGHT: 15,
  STAMINA_BAR_WIDTH: 150,
  STAMINA_BAR_HEIGHT: 15,

  // HUD
  HUD_PADDING: 20,

  // Combat mechanics
  MAX_COMBO_COUNT: 10,
  CRITICAL_HIT_CHANCE: 0.1,
  VITAL_POINT_MULTIPLIER: 1.5,

  // Performance
  TARGET_FPS: 60,
  MAX_PARTICLES: 100,

  // Audio
  MASTER_VOLUME: 0.7,
  SFX_VOLUME: 0.8,
  MUSIC_VOLUME: 0.5,

  // Player movement and action
  PLAYER_MOVE_SPEED: 5,
  PLAYER_JUMP_FORCE: 15,
  MAX_KI: 100,
  MAX_STAMINA: 100,
  KI_REGEN_RATE: 0.5, // Ki points per second
  STAMINA_REGEN_RATE: 2, // Stamina points per second - Added
  STAMINA_COST_MOVE: 0.1,
  STAMINA_COST_JUMP: 10,
  STAMINA_COST_ATTACK: 15,
  STAMINA_COST_BLOCK: 5,

  // Hit effects
  HIT_EFFECT_DURATION: 500, // milliseconds

  // Default font
  DEFAULT_FONT_FAMILY: "Noto Sans KR, Arial, sans-serif", // Added

  // Audio settings
  AUDIO_ENABLED: true,
} as const;

// Add missing player colors
export const PLAYER_COLORS = {
  PLAYER_1_COLOR: 0x0099ff, // Blue
  PLAYER_2_COLOR: 0xff9900, // Orange
} as const;

// Fix: Re-export KOREAN_COLORS for convenience
export { KOREAN_COLORS } from "./colors";

// Difficulty settings
export const DIFFICULTY_SETTINGS = {
  BEGINNER: {
    AI_REACTION_TIME: 800,
    DAMAGE_MULTIPLIER: 0.7,
    TECHNIQUE_SUCCESS_RATE: 0.6,
  },
  INTERMEDIATE: {
    AI_REACTION_TIME: 600,
    DAMAGE_MULTIPLIER: 1.0,
    TECHNIQUE_SUCCESS_RATE: 0.8,
  },
  EXPERT: {
    AI_REACTION_TIME: 400,
    DAMAGE_MULTIPLIER: 1.3,
    TECHNIQUE_SUCCESS_RATE: 0.9,
  },
  MASTER: {
    AI_REACTION_TIME: 200,
    DAMAGE_MULTIPLIER: 1.5,
    TECHNIQUE_SUCCESS_RATE: 0.95,
  },
} as const;

// Game phases
export const GAME_PHASES = {
  INTRO: "intro",
  TRAINING: "training",
  COMBAT: "combat",
  VICTORY: "victory",
  DEFEAT: "defeat",
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
  TARGET_FPS: 60,
  MIN_FPS: 30,
  FRAME_TIME_WARNING: 20, // ms
  MEMORY_WARNING: 100, // MB
  GARBAGE_COLLECTION_THRESHOLD: 50, // MB
} as const;

// Combat timing constants
export const COMBAT_TIMING = {
  TECHNIQUE_EXECUTION_TIME: 500, // ms
  STANCE_CHANGE_TIME: 200, // ms
  RECOVERY_TIME: 300, // ms
  BLOCK_WINDOW: 150, // ms
  COUNTER_WINDOW: 200, // ms
  CRITICAL_TIMING_WINDOW: 50, // ms
} as const;

// Damage calculation constants
export const DAMAGE_CONSTANTS = {
  BASE_DAMAGE: 10,
  CRITICAL_MULTIPLIER: 2.0,
  VITAL_POINT_MULTIPLIER: 1.5,
  ARMOR_REDUCTION: 0.1,
  STANCE_DEFENSE_BONUS: 0.2,
  BALANCE_IMPACT_MULTIPLIER: 0.3,
  CONSCIOUSNESS_THRESHOLD: 30,
  PAIN_THRESHOLD: 80,
  BASE_CRIT_CHANCE: 0.1, // Added: Base critical hit chance (e.g., 10%)
  TECHNIQUE_ACCURACY_MODIFIER: 1.0, // Added
  STANCE_EFFECTIVENESS_RANGE: { MIN: 0.5, MAX: 1.5 }, // Added
  PERFECT_TIMING_BONUS: 0.3, // Added
} as const;

// Animation timings
export const ANIMATION_TIMINGS = {
  STANCE_TRANSITION: 300,
  TECHNIQUE_STARTUP: 150,
  TECHNIQUE_ACTIVE: 100,
  TECHNIQUE_RECOVERY: 250,
  HIT_STUN: 200,
  BLOCK_STUN: 100,
  KNOCKDOWN_RECOVERY: 1000,
} as const;

// UI Layout constants
export const UI_LAYOUT = {
  HUD_HEIGHT: 80,
  CONTROLS_HEIGHT: 120,
  SIDEBAR_WIDTH: 200,
  MARGIN: 20,
  BUTTON_HEIGHT: 50,
  BUTTON_WIDTH: 150,
} as const;

// Audio volume defaults
export const AUDIO_DEFAULTS = {
  MASTER_VOLUME: 0.7,
  SFX_VOLUME: 0.8,
  MUSIC_VOLUME: 0.5,
  AMBIENT_VOLUME: 0.3,
} as const;

// Calculated constants based on GAME_CONFIG
export const HALF_CANVAS_WIDTH = GAME_CONFIG.CANVAS_WIDTH / 2;
export const HALF_CANVAS_HEIGHT = GAME_CONFIG.CANVAS_HEIGHT / 2;
export const CANVAS_ASPECT_RATIO =
  GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.CANVAS_HEIGHT;
export const FRAME_TIME = 1000 / GAME_CONFIG.TARGET_FPS;
export const TICK_RATE = GAME_CONFIG.TARGET_FPS;

// Player distance calculations
export const PLAYER_DISTANCE =
  GAME_CONFIG.PLAYER_START_POS_X_2 - GAME_CONFIG.PLAYER_START_POS_X_1;
export const CENTER_POSITION_X =
  (GAME_CONFIG.PLAYER_START_POS_X_1 + GAME_CONFIG.PLAYER_START_POS_X_2) / 2;

// Combat ranges
export const COMBAT_RANGES = {
  MELEE_RANGE: 80,
  CLOSE_RANGE: 120,
  MEDIUM_RANGE: 200,
  LONG_RANGE: 300,
  MAX_RANGE: PLAYER_DISTANCE,
} as const;

// Game state constants
export const GAME_STATES = {
  LOADING: "loading",
  MENU: "menu",
  CHARACTER_SELECT: "character_select",
  TRAINING: "training",
  COMBAT: "combat",
  PAUSED: "paused",
  GAME_OVER: "game_over",
} as const;

// Input constants
export const INPUT_CONSTANTS = {
  DOUBLE_TAP_TIME: 300, // ms
  HOLD_THRESHOLD: 500, // ms
  GESTURE_TIMEOUT: 1000, // ms
  COMBO_TIMEOUT: 2000, // ms
} as const;

// Visual effect constants
export const VISUAL_EFFECTS = {
  HIT_FLASH_DURATION: 100,
  SCREEN_SHAKE_INTENSITY: 5,
  PARTICLE_LIFETIME: 1000,
  GLOW_PULSE_SPEED: 2,
  STANCE_GLOW_OPACITY: 0.3,
} as const;

// Training mode constants
export const TRAINING_CONFIG = {
  DUMMY_HEALTH: 1000,
  AUTO_RESET_TIME: 5000, // ms
  SHOW_FRAME_DATA: true,
  SHOW_HITBOXES: true,
  INFINITE_KI: true,
  INFINITE_STAMINA: true,
} as const;

export default GAME_CONFIG;
