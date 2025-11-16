/**
 * Common utility types for Korean martial arts game.
 * 
 * This module provides foundational types used throughout the Black Trigram (흑괘) game,
 * including geometric types, Korean text support, and utility type helpers.
 * 
 * @module types/common
 * @category Type Definitions
 * @korean 공통타입
 */

/**
 * Represents a position in 2D space.
 * 
 * @public
 * @category Core Types
 */
export interface Position {
  /** X coordinate in pixels */
  x: number;
  /** Y coordinate in pixels */
  y: number;
}

/**
 * Represents size dimensions for game objects.
 * 
 * @public
 * @category Core Types
 */
export interface Size {
  /** Width in pixels */
  readonly width: number;
  /** Height in pixels */
  readonly height: number;
}

/**
 * Represents rectangle bounds combining position and size.
 * 
 * @public
 * @category Core Types
 */
export interface Bounds extends Position, Size {}

/**
 * Color represented as a hexadecimal number (e.g., 0xFF0000 for red).
 * 
 * @example
 * ```typescript
 * const primaryCyan: Color = 0x00FFFF;
 * const accentGold: Color = 0xFFAA00;
 * ```
 * 
 * @public
 * @category Core Types
 */
export type Color = number;

/**
 * Time duration in milliseconds.
 * 
 * @public
 * @category Core Types
 */
export type Duration = number;

/**
 * Percentage value represented as a decimal (0.0 to 1.0).
 * 
 * @example
 * ```typescript
 * const halfHealth: Percentage = 0.5;
 * const fullAccuracy: Percentage = 1.0;
 * ```
 * 
 * @public
 * @category Core Types
 */
export type Percentage = number;

/**
 * Unique identifier string.
 * 
 * @public
 * @category Core Types
 */
export type ID = string;

/**
 * Generic callback function type.
 * 
 * @typeParam T - Return type of the callback, defaults to void
 * 
 * @public
 * @category Core Types
 */
export type Callback<T = void> = () => T;

/**
 * Event handler function type.
 * 
 * @typeParam T - Type of event data, defaults to any
 * 
 * @public
 * @category Core Types
 */
export type EventHandler<T = any> = (event: T) => void;

/**
 * Utility type to make specific properties optional.
 * 
 * @typeParam T - The base type
 * @typeParam K - Keys of T to make optional
 * 
 * @public
 * @category Utility Types
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Utility type to make specific properties required.
 * 
 * @typeParam T - The base type
 * @typeParam K - Keys of T to make required
 * 
 * @public
 * @category Utility Types
 */
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Utility type to make all properties deeply readonly.
 * 
 * @typeParam T - The type to make deeply readonly
 * 
 * @public
 * @category Utility Types
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Represents bilingual Korean-English text content.
 * 
 * Used throughout the game to provide authentic Korean terminology with English translations,
 * supporting the cultural authenticity of the Korean martial arts theme.
 * 
 * @example
 * ```typescript
 * const techniqueName: KoreanText = {
 *   korean: "천둥벽력",
 *   english: "Thunder Strike",
 *   romanized: "cheondu byeokryeok"
 * };
 * ```
 * 
 * @public
 * @category Korean Martial Arts
 * @korean 한글텍스트
 */
export interface KoreanText {
  /** Korean text in Hangul */
  readonly korean: string;
  /** English translation */
  readonly english: string;
  /** Optional romanized Korean pronunciation */
  readonly romanized?: string;
}

/**
 * Base entity interface with Korean naming support.
 * 
 * Provides a foundation for game entities with bilingual identification.
 * 
 * @public
 * @category Korean Martial Arts
 * @korean 한글개체
 */
export interface KoreanEntity {
  /** Unique identifier */
  readonly id: ID;
  /** Bilingual name */
  readonly name: KoreanText;
  /** Optional bilingual description */
  readonly description?: KoreanText;
}

/**
 * Font sizes for Korean text rendering.
 * 
 * Provides consistent typography sizing across the game interface.
 * 
 * @public
 * @category UI
 * @korean 글자크기
 */
export enum KoreanTextSize {
  /** Extra small: 10px */
  XSMALL = "xsmall",
  /** Tiny: 12px */
  TINY = "tiny",
  /** Small: 14px */
  SMALL = "small",
  /** Medium: 16px */
  MEDIUM = "medium",
  /** Large: 18px */
  LARGE = "large",
  /** Extra large: 20px */
  XLARGE = "xlarge",
  /** Double extra large: 24px */
  XXLARGE = "xxlarge",
  /** Huge: 32px */
  HUGE = "huge",
  /** Title: 48px */
  TITLE = "title",
}

/**
 * Font weights for Korean text rendering.
 * 
 * Provides consistent typography weights for Korean Hangul characters.
 * 
 * @public
 * @category UI
 * @korean 글자무게
 */
export enum KoreanTextWeight {
  /** Light weight: 300 */
  LIGHT = "light",
  /** Normal weight: 400 */
  NORMAL = "normal",
  /** Regular weight: 400 (alias for NORMAL) */
  REGULAR = "regular",
  /** Medium weight: 500 */
  MEDIUM = "medium",
  /** Semi-bold weight: 600 */
  SEMIBOLD = "semibold",
  /** Bold weight: 700 */
  BOLD = "bold",
  /** Heavy weight: 900 */
  HEAVY = "heavy",
}

/**
 * Text alignment options for Korean text.
 * 
 * @public
 * @category UI
 */
export type KoreanTextAlignment = "left" | "center" | "right";

/**
 * Styling configuration for Korean text rendering.
 * 
 * @public
 * @category UI
 * @korean 글자스타일
 */
export interface KoreanTextStyle {
  /** Text size */
  readonly size: KoreanTextSize;
  /** Font weight */
  readonly weight: KoreanTextWeight;
  /** Text color as hex number */
  readonly color: number;
  /** Horizontal alignment */
  readonly alignment: KoreanTextAlignment;
}

/**
 * Represents a range of damage values for combat calculations.
 * 
 * Used for techniques and vital point strikes to define variable damage output.
 * 
 * @public
 * @category Combat
 * @korean 피해범위
 */
export interface DamageRange {
  /** Minimum damage value */
  readonly min: number;
  /** Maximum damage value */
  readonly max: number;
  /** Type of damage dealt */
  readonly type?: DamageType;
  /** Pre-calculated average damage */
  readonly average?: number;
}

/**
 * Game settings configuration interface for UI controls.
 * 
 * Manages volume, graphics quality, control schemes, and language preferences.
 * 
 * @public
 * @category UI
 * @korean 게임설정
 */
export interface UIGameSettings {
  /** Audio volume settings */
  readonly volume: {
    /** Master volume (0.0 - 1.0) */
    readonly master: number;
    /** Music volume (0.0 - 1.0) */
    readonly music: number;
    /** Sound effects volume (0.0 - 1.0) */
    readonly sfx: number;
  };
  /** Graphics settings */
  readonly graphics: {
    /** Graphics quality preset */
    readonly quality: "low" | "medium" | "high";
    /** Fullscreen mode enabled */
    readonly fullscreen: boolean;
    /** Vertical sync enabled */
    readonly vsync: boolean;
  };
  /** Control settings */
  readonly controls: {
    /** Keyboard layout preference */
    readonly keyboardLayout: "qwerty" | "dvorak" | "colemak";
    /** Mouse sensitivity multiplier */
    readonly mouseSensitivity: number;
  };
  /** Language preference */
  readonly language: "korean" | "english" | "both";
}

/**
 * Duration tracking for status effects.
 * 
 * Tracks when an effect started, when it ends, and its total duration.
 * 
 * @public
 * @category Combat
 * @korean 효과지속시간
 */
export interface EffectDuration {
  /** Effect start timestamp (milliseconds) */
  readonly startTime: number;
  /** Effect end timestamp (milliseconds) */
  readonly endTime: number;
  /** Total duration (milliseconds) */
  readonly duration: number;
}

/**
 * Generic game entity with positioning and visibility.
 * 
 * Extends {@link KoreanEntity} with spatial and state properties.
 * 
 * @public
 * @category Core Types
 * @korean 게임개체
 */
export interface GameEntity extends KoreanEntity {
  /** Position in game world */
  readonly position?: Position;
  /** Size dimensions */
  readonly size?: Size;
  /** Whether entity is active */
  readonly active?: boolean;
  /** Whether entity is visible */
  readonly visible?: boolean;
}

/**
 * Animation transition configuration.
 * 
 * Defines how to transition between two states with timing and easing.
 * 
 * @public
 * @category UI
 * @korean 전환
 */
export interface Transition {
  /** Starting state identifier */
  readonly from: string;
  /** Target state identifier */
  readonly to: string;
  /** Transition duration in milliseconds */
  readonly duration: Duration;
  /** Optional easing function name */
  readonly easing?: string;
}

/**
 * Theme color configuration.
 * 
 * Defines primary colors used throughout the game UI.
 * 
 * @public
 * @category UI
 * @korean 테마
 */
export interface Theme {
  /** Primary color */
  readonly primary: Color;
  /** Secondary color */
  readonly secondary: Color;
  /** Accent color */
  readonly accent?: Color;
  /** Background color */
  readonly background?: Color;
  /** Text color */
  readonly text?: Color;
}

/**
 * Generic configuration object.
 * 
 * @public
 * @category Core Types
 */
export interface Config {
  readonly [key: string]: any;
}

/**
 * Generic result wrapper for operations that may succeed or fail.
 * 
 * @typeParam T - Type of successful result data
 * @typeParam E - Type of error, defaults to Error
 * 
 * @example
 * ```typescript
 * const result: Result<PlayerState> = {
 *   success: true,
 *   data: playerState
 * };
 * ```
 * 
 * @public
 * @category Core Types
 */
export interface Result<T, E = Error> {
  /** Whether operation succeeded */
  readonly success: boolean;
  /** Result data if successful */
  readonly data?: T;
  /** Error if operation failed */
  readonly error?: E;
  /** Optional message */
  readonly message?: string;
}

/**
 * Validation result with errors and warnings.
 * 
 * @public
 * @category Core Types
 */
export interface ValidationResult {
  /** Whether validation passed */
  readonly valid: boolean;
  /** List of validation errors */
  readonly errors: readonly string[];
  /** Optional list of warnings */
  readonly warnings?: readonly string[];
}

/**
 * Game modes available in Black Trigram.
 * 
 * Each mode offers different gameplay experiences and training opportunities.
 * 
 * @public
 * @category Game Systems
 * @korean 게임모드
 */
export enum GameMode {
  /** Versus mode: Player vs AI or Player vs Player */
  VERSUS = "versus",
  /** Training mode: Practice techniques against training dummy */
  TRAINING = "training",
  /** Tutorial mode: Learn game mechanics and controls */
  TUTORIAL = "tutorial",
  /** Practice mode: Free form combat practice */
  PRACTICE = "practice",
  /** Story mode: Campaign with narrative */
  STORY = "story",
  /** Arcade mode: Progressive difficulty challenges */
  ARCADE = "arcade",
  /** Controls screen: View and customize controls */
  CONTROLS = "controls",
  /** Philosophy screen: Learn about Korean martial arts philosophy */
  PHILOSOPHY = "philosophy",
}

/**
 * Game phases representing the current state of the game.
 * 
 * Controls which screen is displayed and what game logic is active.
 * 
 * @public
 * @category Game Systems
 * @korean 게임단계
 */
export enum GamePhase {
  /** Intro/splash screen */
  INTRO = "intro",
  /** Main menu */
  MENU = "menu",
  /** Character selection screen */
  CHARACTER_SELECT = "character_select",
  /** Active combat */
  COMBAT = "combat",
  /** Training mode */
  TRAINING = "training",
  /** Victory screen */
  VICTORY = "victory",
  /** Defeat screen */
  DEFEAT = "defeat",
  /** Game paused */
  PAUSED = "paused",
  /** Game over screen */
  GAME_OVER = "game_over",
  /** Loading screen */
  LOADING = "loading",
}

/**
 * Player archetypes representing Korean martial arts combat specialists.
 * 
 * **Korean**: 플레이어 원형 (Player Archetypes)
 * 
 * Each archetype has unique combat styles, favored stances, and philosophical approaches
 * rooted in Korean martial arts traditions and modern cyberpunk adaptation.
 * 
 * @example
 * ```typescript
 * const player = createPlayer({
 *   archetype: PlayerArchetype.MUSA,
 *   name: { korean: "이순신", english: "Yi Sun-sin" }
 * });
 * ```
 * 
 * @public
 * @category Player & Archetypes
 * @korean 플레이어원형
 */
export enum PlayerArchetype {
  /**
   * 무사 (Musa) - Traditional Warrior
   * 
   * Honor-bound martial artist following traditional Korean warrior codes.
   * Favors direct confrontation and disciplined techniques.
   */
  MUSA = "musa",
  
  /**
   * 암살자 (Amsalja) - Shadow Assassin
   * 
   * Precision striker focused on vital point targeting and silent elimination.
   * Specializes in nerve strikes and pressure point techniques.
   */
  AMSALJA = "amsalja",
  
  /**
   * 해커 (Hacker) - Cyber Warrior
   * 
   * Technology-enhanced combatant blending modern cybernetics with traditional techniques.
   * Uses augmented reflexes and data-driven combat analysis.
   */
  HACKER = "hacker",
  
  /**
   * 정보요원 (Jeongbo Yowon) - Intelligence Operative
   * 
   * Strategic analyst who uses combat intelligence and tactical advantage.
   * Excels at reading opponent patterns and exploiting weaknesses.
   */
  JEONGBO_YOWON = "jeongbo_yowon",
  
  /**
   * 조직폭력배 (Jojik Pokryeokbae) - Organized Crime
   * 
   * Ruthless pragmatist who ignores traditional honor codes.
   * Uses brutal, efficient techniques with no concern for ethics.
   */
  JOJIK_POKRYEOKBAE = "jojik_pokryeokbae",
}

/**
 * Eight Trigram stances (팔괘) representing fundamental combat principles.
 * 
 * **Korean**: 팔괘 자세 (Eight Trigram Stances)
 * **Origin**: I Ching (易經 / Yijing) divination system adapted for Korean martial arts
 * 
 * The Eight Trigrams (Bagua / 八卦) form the foundation of the combat system.
 * Each trigram represents a natural element and combat philosophy, influencing
 * available techniques, movement patterns, and strategic advantages.
 * 
 * ## Trigram Philosophy
 * 
 * - **☰ 건 (Geon)** - Heaven: Yang energy, direct aggression, overwhelming force
 * - **☱ 태 (Tae)** - Lake: Joy and fluidity, joint locks and flow techniques
 * - **☲ 리 (Li)** - Fire: Precision and speed, nerve strikes and rapid attacks
 * - **☳ 진 (Jin)** - Thunder: Explosive power, shocking techniques
 * - **☴ 손 (Son)** - Wind: Continuous pressure, evasion and mobility
 * - **☵ 감 (Gam)** - Water: Adaptive flow, counters and redirection
 * - **☶ 간 (Gan)** - Mountain: Immovable defense, endurance and patience
 * - **☷ 곤 (Gon)** - Earth: Grounding techniques, takedowns and throws
 * 
 * @example
 * ```typescript
 * // Change to Heaven stance for aggressive attack
 * player.currentStance = TrigramStance.GEON;
 * 
 * // Execute heaven-aligned technique
 * const technique = getTrigramTechniques(TrigramStance.GEON)[0];
 * executeTechnique(player, opponent, technique);
 * ```
 * 
 * @see {@link https://en.wikipedia.org/wiki/Bagua | Bagua (Eight Trigrams) - Wikipedia}
 * @see {@link https://en.wikipedia.org/wiki/I_Ching | I Ching - Wikipedia}
 * 
 * @public
 * @category Trigram System
 * @category Korean Martial Arts
 * @korean 팔괘
 */
export enum TrigramStance {
  /**
   * ☰ 건 (Geon) - Heaven Stance
   * 
   * **Element**: Heaven / Sky (天)
   * **Nature**: Yang, creative, strong
   * **Combat Style**: Direct force, aggressive techniques, overwhelming power
   * **Philosophy**: "The creative principle - pure yang energy that drives forward"
   * 
   * Techniques emphasize straight attacks, powerful strikes, and dominant positioning.
   */
  GEON = "geon",
  
  /**
   * ☱ 태 (Tae) - Lake Stance
   * 
   * **Element**: Lake / Marsh (澤)
   * **Nature**: Yin exterior, Yang interior - joyful movement
   * **Combat Style**: Fluid joint manipulation, flowing techniques, adaptable responses
   * **Philosophy**: "The joyful - water above earth, freedom of movement"
   * 
   * Techniques focus on joint locks, throws, and using opponent's momentum.
   */
  TAE = "tae",
  
  /**
   * ☲ 리 (Li) - Fire Stance
   * 
   * **Element**: Fire / Flame (火)
   * **Nature**: Yang exterior, Yin interior - bright and precise
   * **Combat Style**: Precise nerve strikes, rapid attacks, speed techniques
   * **Philosophy**: "The clinging - illuminating and consuming"
   * 
   * Techniques emphasize vital point targeting, quick combinations, and precision.
   */
  LI = "li",
  
  /**
   * ☳ 진 (Jin) - Thunder Stance
   * 
   * **Element**: Thunder / Arousing (雷)
   * **Nature**: Yang moving, sudden and shocking
   * **Combat Style**: Explosive power, shocking techniques, sudden movements
   * **Philosophy**: "The arousing - thunder brings shock and awakening"
   * 
   * Techniques feature explosive bursts, stunning strikes, and overwhelming force.
   */
  JIN = "jin",
  
  /**
   * ☴ 손 (Son) - Wind Stance
   * 
   * **Element**: Wind / Wood (風)
   * **Nature**: Yin, gentle but penetrating
   * **Combat Style**: Continuous pressure, evasion techniques, mobility
   * **Philosophy**: "The gentle - penetrating like wind, persistent like wood"
   * 
   * Techniques emphasize movement, pressure point chains, and wearing down opponents.
   */
  SON = "son",
  
  /**
   * ☵ 감 (Gam) - Water Stance
   * 
   * **Element**: Water / Abyss (水)
   * **Nature**: Yang surrounded by Yin - dangerous depths
   * **Combat Style**: Flow and adaptation, counter techniques, redirection
   * **Philosophy**: "The abysmal - water flows around obstacles and fills voids"
   * 
   * Techniques focus on counters, deflections, and adaptive responses.
   */
  GAM = "gam",
  
  /**
   * ☶ 간 (Gan) - Mountain Stance
   * 
   * **Element**: Mountain / Stillness (山)
   * **Nature**: Yang above Yin - firm and unyielding
   * **Combat Style**: Defensive mastery, immovable stance, endurance
   * **Philosophy**: "The keeping still - mountains are firm and unmoving"
   * 
   * Techniques emphasize blocks, parries, and defensive positioning.
   */
  GAN = "gan",
  
  /**
   * ☷ 곤 (Gon) - Earth Stance
   * 
   * **Element**: Earth / Receptive (地)
   * **Nature**: Pure Yin - receptive and yielding
   * **Combat Style**: Grounding techniques, takedowns, throws
   * **Philosophy**: "The receptive - earth receives and supports all"
   * 
   * Techniques focus on sweeps, trips, takedowns, and ground control.
   */
  GON = "gon",
}

/**
 * Combat attack types available in the game.
 * 
 * Defines the mechanical type of attack being performed, which affects
 * damage calculation, vital point targeting, and defensive options.
 * 
 * @public
 * @category Combat System
 * @korean 공격타입
 */
export enum CombatAttackType {
  /** Standard striking attack */
  STRIKE = "strike",
  /** Thrusting attack with focused force */
  THRUST = "thrust",
  /** Defensive blocking action */
  BLOCK = "block",
  /** Counter-attack performed after successful defense */
  COUNTER_ATTACK = "counter_attack",
  /** Throwing technique to off-balance opponent */
  THROW = "throw",
  /** Grappling and joint control technique */
  GRAPPLE = "grapple",
  /** Precise pressure point strike */
  PRESSURE_POINT = "pressure_point",
  /** Nerve disruption strike */
  NERVE_STRIKE = "nerve_strike",
  /** Closed fist punch */
  PUNCH = "punch",
  /** Leg kick attack */
  KICK = "kick",
  /** Elbow strike */
  ELBOW = "elbow",
  /** Knee strike */
  KNEE = "knee",
}

/**
 * Damage types representing different methods of inflicting harm.
 * 
 * Each damage type interacts differently with vital points and defensive techniques.
 * Some types are more effective against specific body regions or defense styles.
 * 
 * @public
 * @category Combat System
 * @korean 피해타입
 */
export enum DamageType {
  /** Blunt force trauma */
  BLUNT = "blunt",
  /** Piercing damage penetrating tissue */
  PIERCING = "piercing",
  /** Slashing cuts */
  SLASHING = "slashing",
  /** Pressure point manipulation */
  PRESSURE = "pressure",
  /** Nerve disruption */
  NERVE = "nerve",
  /** Joint manipulation and locks */
  JOINT = "joint",
  /** Internal organ damage */
  INTERNAL = "internal",
  /** Impact shock */
  IMPACT = "impact",
  /** Crushing force */
  CRUSHING = "crushing",
  /** Sharp edge damage */
  SHARP = "sharp",
  /** Electric shock */
  ELECTRIC = "electric",
  /** Fire/heat damage */
  FIRE = "fire",
  /** Cold/freeze damage */
  ICE = "ice",
  /** Poison/toxin damage */
  POISON = "poison",
  /** Psychic/mental damage */
  PSYCHIC = "psychic",
  /** Blood loss damage */
  BLOOD = "blood",
}

/**
 * Vital point categories representing anatomical targeting systems.
 * 
 * **Korean**: 급소 범주 (Vital Point Categories)
 * 
 * The game features 70 Korean vital points (급소) based on traditional martial arts
 * knowledge and modern anatomical understanding. Each category represents different
 * physiological systems that can be targeted for combat effectiveness.
 * 
 * @example
 * ```typescript
 * const vitalPoint: VitalPoint = {
 *   id: "GB-20",
 *   category: VitalPointCategory.NEUROLOGICAL,
 *   severity: VitalPointSeverity.CRITICAL,
 *   name: { korean: "풍지", english: "Wind Pool" }
 * };
 * ```
 * 
 * @public
 * @category Vital Point System
 * @korean 급소범주
 */
export enum VitalPointCategory {
  /** Neurological system - nerve clusters and neural pathways */
  NEUROLOGICAL = "neurological",
  /** Vascular system - major blood vessels and circulation */
  VASCULAR = "vascular",
  /** Respiratory system - airways and breathing mechanisms */
  RESPIRATORY = "respiratory",
  /** Muscular system - muscle groups and tendons */
  MUSCULAR = "muscular",
  /** Skeletal system - bones and structural supports */
  SKELETAL = "skeletal",
  /** Organ system - internal organs */
  ORGAN = "organ",
  /** Circulatory system - heart and blood flow */
  CIRCULATORY = "circulatory",
  /** Lymphatic system - lymph nodes and immune response */
  LYMPHATIC = "lymphatic",
  /** Endocrine system - hormonal glands */
  ENDOCRINE = "endocrine",
  /** Joint system - articulation points */
  JOINT = "joint",
  /** Nerve system - peripheral nerves */
  NERVE = "nerve",
  /** Pressure system - pressure-sensitive areas */
  PRESSURE = "pressure",
}

/**
 * Vital point severity levels indicating potential impact.
 * 
 * Determines the damage multiplier and status effects applied when
 * a vital point is successfully struck.
 * 
 * ## Severity Guidelines
 * 
 * - **MINOR**: 1.1-1.3x damage, temporary discomfort
 * - **MODERATE**: 1.5-2.0x damage, brief incapacitation
 * - **MAJOR**: 2.5-3.5x damage, significant impairment
 * - **CRITICAL**: 4.0-5.0x damage, severe trauma
 * - **LETHAL**: 6.0-10.0x damage, immediate incapacitation
 * 
 * @public
 * @category Vital Point System
 * @korean 급소심각도
 */
export enum VitalPointSeverity {
  /** Minor impact - temporary pain or discomfort */
  MINOR = "minor",
  /** Moderate impact - brief stunning or reduced effectiveness */
  MODERATE = "moderate",
  /** Major impact - significant damage and impairment */
  MAJOR = "major",
  /** Critical impact - severe trauma requiring immediate response */
  CRITICAL = "critical",
  /** Lethal impact - immediate incapacitation or death */
  LETHAL = "lethal",
}

/**
 * Status effects that can result from vital point strikes.
 * 
 * Each effect type represents a physiological response to targeting
 * specific anatomical structures. Effects stack and interact with
 * combat mechanics.
 * 
 * @public
 * @category Vital Point System
 * @korean 급소효과
 */
export enum VitalPointEffectType {
  /** Loss of consciousness */
  UNCONSCIOUSNESS = "unconsciousness",
  /** Inability to breathe properly */
  BREATHLESSNESS = "breathlessness",
  /** Intense pain reducing combat effectiveness */
  PAIN = "pain",
  /** Temporary or permanent paralysis */
  PARALYSIS = "paralysis",
  /** Brief stunning preventing action */
  STUN = "stun",
  /** Reduced strength and effectiveness */
  WEAKNESS = "weakness",
  /** Confusion and impaired targeting */
  DISORIENTATION = "disorientation",
  /** Restricted blood flow to area */
  BLOOD_FLOW_RESTRICTION = "blood_flow_restriction",
  /** Nerve pathway interruption */
  NERVE_DISRUPTION = "nerve_disruption",
  /** Internal organ malfunction */
  ORGAN_DISRUPTION = "organ_disruption",
}

/**
 * Combat states representing the current action phase of a fighter.
 * 
 * Determines available actions, defensive capabilities, and animation states.
 * State transitions follow combat flow logic and timing windows.
 * 
 * @public
 * @category Combat System
 * @korean 전투상태
 */
export enum CombatState {
  /** Neutral state, all actions available */
  IDLE = "idle",
  /** Executing an attack, vulnerable to counters */
  ATTACKING = "attacking",
  /** In defensive stance, reduced offensive capability */
  DEFENDING = "defending",
  /** Temporarily incapacitated, cannot act */
  STUNNED = "stunned",
  /** Recovering from action, limited options */
  RECOVERING = "recovering",
  /** Executing a counter-attack */
  COUNTERING = "countering",
  /** Transitioning between stances */
  TRANSITIONING = "transitioning",
}

/**
 * Body regions for anatomical targeting in combat.
 * 
 * Each region contains multiple vital points and has different
 * defensive properties and vulnerability profiles.
 * 
 * @public
 * @category Combat System
 * @korean 신체부위
 */
export enum BodyRegion {
  /** Head region - contains critical neurological targets */
  HEAD = "head",
  /** Neck region - contains vascular and respiratory targets */
  NECK = "neck",
  /** Torso region - contains organ targets */
  TORSO = "torso",
  /** Left arm region - contains nerve and joint targets */
  LEFT_ARM = "left_arm",
  /** Right arm region - contains nerve and joint targets */
  RIGHT_ARM = "right_arm",
  /** Left leg region - contains structural and mobility targets */
  LEFT_LEG = "left_leg",
  /** Right leg region - contains structural and mobility targets */
  RIGHT_LEG = "right_leg",
  /** Core/center region - contains balance and power centers */
  CORE = "core",
}

export default {};
