/**
 * Core enums for Black Trigram Korean martial arts system
 */

// Game modes
export enum GameMode {
  VERSUS = "versus",
  TRAINING = "training",
  TUTORIAL = "tutorial",
  PRACTICE = "practice",
  STORY = "story",
  ARCADE = "arcade",
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
  MUSA = "musa", // 무사 - Traditional Warrior
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

// Effect types for status effects
export enum EffectType {
  STUN = "stun",
  WEAKNESS = "weakness",
  STAMINA_DRAIN = "stamina_drain",
  VULNERABILITY = "vulnerability",
  BLEEDING = "bleeding",
  BUFF = "buff",
  DEBUFF = "debuff",
  PARALYSIS = "paralysis",
  POISON = "poison",
  BURN = "burn",
  FREEZE = "freeze",
  CONFUSION = "confusion",
}

// Effect intensity levels
export enum EffectIntensity {
  WEAK = "weak",
  MEDIUM = "medium",
  HIGH = "high",
  EXTREME = "extreme",
}

// Hit effect types for visual feedback
export enum HitEffectType {
  DAMAGE = "damage",
  CRITICAL = "critical",
  BLOCK = "block",
  MISS = "miss",
  VITAL_POINT = "vital_point",
  COUNTER = "counter",
  PARRY = "parry",
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
