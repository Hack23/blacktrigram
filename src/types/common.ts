/**
 * Common utility types for Korean martial arts game
 */

// Position in 2D space
export interface Position {
  x: number;
  y: number;
}

// Size dimensions
export interface Size {
  readonly width: number;
  readonly height: number;
}

// Rectangle bounds
export interface Bounds extends Position, Size {}

// Color as hex number
export type Color = number;

// Time duration in milliseconds
export type Duration = number;

// Percentage value (0-1)
export type Percentage = number;

// ID string
export type ID = string;

// Generic callback function
export type Callback<T = void> = () => T;

// Event handler
export type EventHandler<T = any> = (event: T) => void;

// Optional properties helper
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Required properties helper
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Deep readonly
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Korean text support
export interface KoreanText {
  readonly korean: string;
  readonly english: string;
  readonly romanized?: string;
}

// Base entity with Korean naming
export interface KoreanEntity {
  readonly id: ID;
  readonly name: KoreanText;
  readonly description?: KoreanText;
}

// Korean text sizing
export enum KoreanTextSize {
  XSMALL = "xsmall",
  TINY = "tiny",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  XLARGE = "xlarge",
  XXLARGE = "xxlarge",
  HUGE = "huge",
  TITLE = "title",
}

// Korean text weights
export enum KoreanTextWeight {
  LIGHT = "light",
  NORMAL = "normal",
  REGULAR = "regular",
  MEDIUM = "medium",
  SEMIBOLD = "semibold",
  BOLD = "bold",
  HEAVY = "heavy",
}

export interface KoreanText {
  readonly korean: string;
  readonly english: string;
  readonly romanized?: string;
}

// Korean text styles for different contexts
export interface KoreanTextStyle {
  readonly size: KoreanTextSize; // Import from enums
  readonly weight: KoreanTextWeight; // Import from enums
  readonly color: number;
  readonly alignment: KoreanTextAlignment;
}

// REMOVE: KoreanTextSize, KoreanTextWeight enums (use from enums.ts)
// REMOVE: TrigramStance type (use from enums.ts)

export type KoreanTextAlignment = "left" | "center" | "right";

// Damage range
export interface DamageRange {
  readonly min: number;
  readonly max: number;
  readonly type?: DamageType;
  readonly average?: number;
}

export interface UIGameSettings {
  // or GameSettingsUI
  readonly volume: {
    readonly master: number;
    readonly music: number;
    readonly sfx: number;
  };
  readonly graphics: {
    readonly quality: "low" | "medium" | "high";
    readonly fullscreen: boolean;
    readonly vsync: boolean;
  };
  readonly controls: {
    readonly keyboardLayout: "qwerty" | "dvorak" | "colemak";
    readonly mouseSensitivity: number;
  };
  readonly language: "korean" | "english" | "both";
}

// Status effect duration
export interface EffectDuration {
  readonly startTime: number;
  readonly endTime: number;
  readonly duration: number;
}

// Generic game entity
export interface GameEntity extends KoreanEntity {
  readonly position?: Position;
  readonly size?: Size;
  readonly active?: boolean;
  readonly visible?: boolean;
}

// Transition data
export interface Transition {
  readonly from: string;
  readonly to: string;
  readonly duration: Duration;
  readonly easing?: string;
}

// Theme colors
export interface Theme {
  readonly primary: Color;
  readonly secondary: Color;
  readonly accent?: Color;
  readonly background?: Color;
  readonly text?: Color;
}

// Configuration object
export interface Config {
  readonly [key: string]: any;
}

// Result with success/error
export interface Result<T, E = Error> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: E;
  readonly message?: string;
}

// Validation result
export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings?: readonly string[];
}


export enum GameMode {
  VERSUS = "versus",
  TRAINING = "training",
  TUTORIAL = "tutorial",
  PRACTICE = "practice",
  STORY = "story",
  ARCADE = "arcade",
  CONTROLS = "controls", // Added for controls section
  PHILOSOPHY = "philosophy", // Added for philosophy section
}

// Game phases
export enum GamePhase {
  INTRO = "intro",
  MENU = "menu",
  CHARACTER_SELECT = "character_select",
  COMBAT = "combat",
  TRAINING = "training",
  VICTORY = "victory",
  DEFEAT = "defeat",
  PAUSED = "paused",
  GAME_OVER = "game_over",
  LOADING = "loading",
}

// Player archetypes (Korean martial arts specialists)
export enum PlayerArchetype {
  MUSA = "musa", // 암흑작전부대 (Amheuk Jakjeon Budae) - Dark Operations Unit
  AMSALJA = "amsalja", // 암살자 - Shadow Assassin
  HACKER = "hacker", // 해커 - Cyber Warrior
  JEONGBO_YOWON = "jeongbo_yowon", // 정보요원 - Intelligence Operative
  JOJIK_POKRYEOKBAE = "jojik_pokryeokbae", // 조직폭력배 - Organized Crime
}

// Eight Trigram stances (팔괘)
export enum TrigramStance {
  GEON = "geon", // ☰ 건 - Heaven
  TAE = "tae", // ☱ 태 - Lake
  LI = "li", // ☲ 리 - Fire
  JIN = "jin", // ☳ 진 - Thunder
  SON = "son", // ☴ 손 - Wind
  GAM = "gam", // ☵ 감 - Water
  GAN = "gan", // ☶ 간 - Mountain
  GON = "gon", // ☷ 곤 - Earth
}

// Combat attack types
export enum CombatAttackType {
  STRIKE = "strike",
  THRUST = "thrust",
  BLOCK = "block",
  COUNTER_ATTACK = "counter_attack",
  THROW = "throw",
  GRAPPLE = "grapple",
  PRESSURE_POINT = "pressure_point",
  NERVE_STRIKE = "nerve_strike",
  PUNCH = "punch",
  KICK = "kick",
  ELBOW = "elbow",
  KNEE = "knee",
}

// Damage types
export enum DamageType {
  BLUNT = "blunt",
  PIERCING = "piercing",
  SLASHING = "slashing",
  PRESSURE = "pressure",
  NERVE = "nerve",
  JOINT = "joint",
  INTERNAL = "internal",
  IMPACT = "impact",
  CRUSHING = "crushing",
  SHARP = "sharp",
  ELECTRIC = "electric",
  FIRE = "fire",
  ICE = "ice",
  POISON = "poison",
  PSYCHIC = "psychic",
  BLOOD = "blood",
}

// Vital point categories (70 Korean vital points)
export enum VitalPointCategory {
  NEUROLOGICAL = "neurological",
  VASCULAR = "vascular",
  RESPIRATORY = "respiratory",
  MUSCULAR = "muscular",
  SKELETAL = "skeletal",
  ORGAN = "organ",
  CIRCULATORY = "circulatory",
  LYMPHATIC = "lymphatic",
  ENDOCRINE = "endocrine",
  JOINT = "joint",
  NERVE = "nerve",
  PRESSURE = "pressure",
}

// Vital point severity levels
export enum VitalPointSeverity {
  MINOR = "minor",
  MODERATE = "moderate",
  MAJOR = "major",
  CRITICAL = "critical",
  LETHAL = "lethal",
}

// Vital point effect types
export enum VitalPointEffectType {
  UNCONSCIOUSNESS = "unconsciousness",
  BREATHLESSNESS = "breathlessness",
  PAIN = "pain",
  PARALYSIS = "paralysis",
  STUN = "stun",
  WEAKNESS = "weakness",
  DISORIENTATION = "disorientation",
  BLOOD_FLOW_RESTRICTION = "blood_flow_restriction",
  NERVE_DISRUPTION = "nerve_disruption",
  ORGAN_DISRUPTION = "organ_disruption",
}

// Combat states
export enum CombatState {
  IDLE = "idle",
  ATTACKING = "attacking",
  DEFENDING = "defending",
  STUNNED = "stunned",
  RECOVERING = "recovering",
  COUNTERING = "countering",
  TRANSITIONING = "transitioning",
}

// Body regions for anatomical targeting
export enum BodyRegion {
  HEAD = "head",
  NECK = "neck",
  TORSO = "torso",
  LEFT_ARM = "left_arm",
  RIGHT_ARM = "right_arm",
  LEFT_LEG = "left_leg",
  RIGHT_LEG = "right_leg",
  CORE = "core",
}

export default {};
