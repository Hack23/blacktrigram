/**
 * AI Personality System for Korean Martial Arts Combat
 * Defines behavioral archetypes that guide AI decision-making
 */

import { PlayerArchetype, TrigramStance } from "@/types";

/**
 * Movement pattern types for archetype behavior
 * 
 * @korean 이동 패턴 타입
 */
export type MovementPattern = "aggressive" | "evasive" | "analytical" | "unpredictable";

/**
 * Vital target priority for archetype-specific combat strategies
 * 
 * @korean 급소 우선순위
 */
export type VitalTargetPriority = "health" | "pain" | "consciousness" | "balanced";

/**
 * Technique category types for archetype preferences
 * 
 * @korean 기술 범주
 */
export type TechniqueCategory = 
  | "joint_manipulation" 
  | "bone_strikes" 
  | "nerve_strikes"
  | "silent_takedowns"
  | "anatomical_analysis"
  | "calculated_strikes"
  | "psychological_pressure"
  | "submission_induction"
  | "dirty_techniques"
  | "environmental_usage";

/**
 * Archetype-specific behavior profile
 * 
 * Defines combat preferences, movement patterns, and tactical decision-making
 * unique to each of the 5 player archetypes.
 * 
 * @korean 원형별 행동 프로필
 */
export interface ArchetypeBehavior {
  /** Preferred trigram stances for this archetype */
  readonly preferredStances: readonly TrigramStance[];
  /** Optimal combat range in grid cells (1 cell = ~40px) */
  readonly optimalRange: number;
  /** Health percentage threshold to trigger retreat behavior */
  readonly retreatThreshold: number;
  /** Technique categories this archetype favors */
  readonly techniqueSelectionBias: readonly TechniqueCategory[];
  /** Movement pattern characteristic of this archetype */
  readonly movementPattern: MovementPattern;
  /** Whether archetype follows honor code (affects retreat behavior) */
  readonly honorCode: boolean;
  /** Priority system for vital point targeting */
  readonly vitalTargetPriority: VitalTargetPriority;
}

/**
 * AI personality profile defining combat behavior
 */
export interface AIPersonality {
  readonly name: string;
  readonly koreanName: string;
  readonly archetype: PlayerArchetype;
  readonly aggressionLevel: number; // 0.0-1.0: How often AI attacks
  readonly defensePreference: number; // 0.0-1.0: Tendency to block/counter
  readonly comboTendency: number; // 0.0-1.0: Likelihood to continue combos
  readonly stanceSwitchFrequency: number; // 0.0-1.0: How often changes stance
  readonly feintChance: number; // 0.0-1.0: Probability of fake attacks
  readonly tacticalRetreatThreshold: number; // Health % to retreat
  readonly favoredStances: readonly TrigramStance[];
  readonly description: {
    readonly korean: string;
    readonly english: string;
  };
}

/**
 * Archetype-specific behavior profiles
 * 
 * Maps each of the 5 player archetypes to their unique combat behaviors,
 * movement patterns, and tactical preferences based on Korean martial arts
 * traditions and game design philosophy.
 * 
 * @korean 원형별 행동 프로필
 */
export const ARCHETYPE_BEHAVIORS: Record<PlayerArchetype, ArchetypeBehavior> = {
  [PlayerArchetype.MUSA]: {
    preferredStances: [TrigramStance.GEON, TrigramStance.JIN, TrigramStance.GAN], // Heaven, Thunder, Mountain
    optimalRange: 1, // Close quarters (1 cell = ~40px)
    retreatThreshold: 5, // Enhanced: fights to near-death (honor code)
    techniqueSelectionBias: ["joint_manipulation", "bone_strikes"],
    movementPattern: "aggressive",
    honorCode: true, // Never retreats above threshold
    vitalTargetPriority: "balanced",
  },
  [PlayerArchetype.AMSALJA]: {
    preferredStances: [TrigramStance.SON, TrigramStance.GAM], // Wind, Water
    optimalRange: 1, // Stealth melee (1 cell)
    retreatThreshold: 20, // Enhanced: tactical retreat, not cowardice
    techniqueSelectionBias: ["nerve_strikes", "silent_takedowns"],
    movementPattern: "evasive",
    honorCode: false,
    vitalTargetPriority: "consciousness",
  },
  [PlayerArchetype.HACKER]: {
    preferredStances: [TrigramStance.LI, TrigramStance.TAE], // Fire, Lake
    optimalRange: 3, // Mid-range analysis (3 cells = ~120px)
    retreatThreshold: 50,
    techniqueSelectionBias: ["anatomical_analysis", "calculated_strikes"],
    movementPattern: "analytical",
    honorCode: false,
    vitalTargetPriority: "balanced",
  },
  [PlayerArchetype.JEONGBO_YOWON]: {
    preferredStances: [TrigramStance.GAN, TrigramStance.GON], // Mountain, Earth
    optimalRange: 2, // Tactical mid-range (2 cells = ~80px)
    retreatThreshold: 40,
    techniqueSelectionBias: ["psychological_pressure", "submission_induction"],
    movementPattern: "analytical",
    honorCode: false,
    vitalTargetPriority: "pain",
  },
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: {
    preferredStances: [TrigramStance.JIN, TrigramStance.GAM], // Thunder, Water (adaptable)
    optimalRange: 1, // Close brutal combat (1 cell)
    retreatThreshold: 70, // Retreats pragmatically
    techniqueSelectionBias: ["dirty_techniques", "environmental_usage"],
    movementPattern: "unpredictable",
    honorCode: false,
    vitalTargetPriority: "health",
  },
};

/**
 * Five AI personality archetypes inspired by Korean martial arts philosophy
 */
export const AI_PERSONALITIES: Record<string, AIPersonality> = {
  /**
   * 맹공자 (Maenggongja) - Fierce Attacker
   * Aggressive pressure fighter using Musa archetype
   * 
   * **Enhanced Aggression (Issue #enhance-ai-aggression)**:
   * - Increased aggression: 0.85 → 0.95 (overwhelming force)
   * - Reduced defense: 0.2 → 0.1 (all-in offensive)
   * - Increased combo tendency: 0.7 → 0.8 (sustained pressure)
   * - Reduced retreat threshold: 0.15 → 0.05 (honor code: fights to near-death)
   * 
   * **Dynamic Stance Rotation (Issue #dynamic-ai-stance-rotation)**:
   * - Increased stance switch frequency: 0.3 → 0.5 (more tactical flexibility)
   */
  AGGRESSIVE_STRIKER: {
    name: "Aggressive Striker",
    koreanName: "맹공자",
    archetype: PlayerArchetype.MUSA,
    aggressionLevel: 0.95, // Enhanced from 0.85
    defensePreference: 0.1, // Reduced from 0.2
    comboTendency: 0.8, // Increased from 0.7
    stanceSwitchFrequency: 0.5, // Increased from 0.3 for dynamic stance rotation
    feintChance: 0.15,
    tacticalRetreatThreshold: 0.05, // Reduced from 0.15
    favoredStances: [
      TrigramStance.GEON, // Heaven - Direct force
      TrigramStance.JIN, // Thunder - Explosive power
      TrigramStance.LI, // Fire - Precision strikes
    ],
    description: {
      korean: "정면 돌파를 선호하는 공격적인 전사",
      english: "Aggressive warrior who prefers frontal assault",
    },
  },

  /**
   * 기술가 (Gisulga) - Technical Master
   * Precision fighter using Amsalja archetype
   * 
   * **Enhanced Aggression (Issue #enhance-ai-aggression)**:
   * - Increased aggression: 0.5 → 0.85 (instant takedown focus)
   * - Reduced defense: 0.6 → 0.3 (opportunistic aggression)
   * - Increased combo tendency: 0.4 → 0.6 (lethal sequences)
   * - Reduced retreat threshold: 0.35 → 0.20 (tactical retreat, not cowardice)
   * 
   * **Dynamic Stance Rotation (Issue #dynamic-ai-stance-rotation)**:
   * - Increased stance switch frequency: 0.7 → 0.85 (highly adaptive)
   */
  TECHNICAL_MASTER: {
    name: "Technical Master",
    koreanName: "기술가",
    archetype: PlayerArchetype.AMSALJA,
    aggressionLevel: 0.85, // Enhanced from 0.5
    defensePreference: 0.3, // Reduced from 0.6
    comboTendency: 0.6, // Increased from 0.4
    stanceSwitchFrequency: 0.85, // Increased from 0.7 for dynamic stance rotation
    feintChance: 0.35,
    tacticalRetreatThreshold: 0.20, // Reduced from 0.35
    favoredStances: [
      TrigramStance.SON, // Wind - Continuous pressure
      TrigramStance.GAM, // Water - Flow and adaptation
      TrigramStance.TAE, // Lake - Fluid manipulation
    ],
    description: {
      korean: "정밀한 기술로 약점을 노리는 달인",
      english: "Master who targets weaknesses with precise techniques",
    },
  },

  /**
   * 균형 잡힌 자 (Gyunhyeong Jabin-ja) - Balanced Fighter
   * All-around fighter using Jeongbo Yowon archetype
   * 
   * **Dynamic Stance Rotation (Issue #dynamic-ai-stance-rotation)**:
   * - Increased stance switch frequency: 0.5 → 0.7 (strategic switching)
   */
  BALANCED_FIGHTER: {
    name: "Balanced Fighter",
    koreanName: "균형 잡힌 자",
    archetype: PlayerArchetype.JEONGBO_YOWON,
    aggressionLevel: 0.6,
    defensePreference: 0.5,
    comboTendency: 0.5,
    stanceSwitchFrequency: 0.7, // Increased from 0.5 for dynamic stance rotation
    feintChance: 0.25,
    tacticalRetreatThreshold: 0.25,
    favoredStances: [
      TrigramStance.GEON, // Heaven
      TrigramStance.GAM, // Water
      TrigramStance.GAN, // Mountain
      TrigramStance.GON, // Earth
    ],
    description: {
      korean: "공격과 방어의 조화를 추구하는 전략가",
      english: "Strategist seeking harmony between offense and defense",
    },
  },

  /**
   * 방어의 달인 (Bangeo-ui Dallin) - Defensive Specialist
   * Counter-attack focused using Hacker archetype
   * 
   * **Dynamic Stance Rotation (Issue #dynamic-ai-stance-rotation)**:
   * - Increased stance switch frequency: 0.4 → 0.6 (analytical adaptation)
   */
  DEFENSIVE_SPECIALIST: {
    name: "Defensive Specialist",
    koreanName: "방어의 달인",
    archetype: PlayerArchetype.HACKER,
    aggressionLevel: 0.35,
    defensePreference: 0.8,
    comboTendency: 0.3,
    stanceSwitchFrequency: 0.6, // Increased from 0.4 for dynamic stance rotation
    feintChance: 0.4,
    tacticalRetreatThreshold: 0.4,
    favoredStances: [
      TrigramStance.GAN, // Mountain - Defensive mastery
      TrigramStance.GON, // Earth - Grounding
      TrigramStance.GAM, // Water - Adaptation
    ],
    description: {
      korean: "방어에서 반격의 기회를 찾는 전문가",
      english: "Expert who finds counter-attack opportunities through defense",
    },
  },

  /**
   * 혼돈의 전사 (Hondon-ui Jeonsa) - Chaos Warrior
   * Unpredictable fighter using Jojik Pokryeokbae archetype
   * 
   * **Dynamic Stance Rotation (Issue #dynamic-ai-stance-rotation)**:
   * - Increased stance switch frequency: 0.8 → 0.95 (unpredictable chaos)
   */
  CHAOS_WARRIOR: {
    name: "Chaos Warrior",
    koreanName: "혼돈의 전사",
    archetype: PlayerArchetype.JOJIK_POKRYEOKBAE,
    aggressionLevel: 0.75,
    defensePreference: 0.3,
    comboTendency: 0.6,
    stanceSwitchFrequency: 0.95, // Increased from 0.8 for dynamic stance rotation
    feintChance: 0.5,
    tacticalRetreatThreshold: 0.1,
    favoredStances: [
      TrigramStance.LI, // Fire - Unpredictable
      TrigramStance.SON, // Wind - Constant motion
      TrigramStance.JIN, // Thunder - Explosive
      TrigramStance.TAE, // Lake - Fluid
    ],
    description: {
      korean: "예측 불가능한 패턴으로 상대를 혼란시키는 전사",
      english: "Warrior who confuses opponents with unpredictable patterns",
    },
  },
};

/**
 * Get a random AI personality
 */
export function getRandomPersonality(): AIPersonality {
  const personalities = Object.values(AI_PERSONALITIES);
  return personalities[Math.floor(Math.random() * personalities.length)];
}

/**
 * Get personality by archetype
 */
export function getPersonalityByArchetype(
  archetype: PlayerArchetype
): AIPersonality {
  const personality = Object.values(AI_PERSONALITIES).find(
    (p) => p.archetype === archetype
  );
  return personality ?? AI_PERSONALITIES.BALANCED_FIGHTER;
}

/**
 * Get personality by name key
 */
export function getPersonalityByName(name: string): AIPersonality {
  return AI_PERSONALITIES[name] ?? AI_PERSONALITIES.BALANCED_FIGHTER;
}

/**
 * List all available personalities
 */
export function getAllPersonalities(): readonly AIPersonality[] {
  return Object.values(AI_PERSONALITIES);
}

/**
 * Get archetype-specific behavior profile
 * 
 * Retrieves the unique combat behavior configuration for a given archetype,
 * including movement patterns, optimal ranges, and tactical preferences.
 * 
 * @param archetype - Player archetype to get behavior for
 * @returns Archetype behavior profile
 * 
 * @korean 원형별 행동 프로필 가져오기
 */
export function getArchetypeBehavior(archetype: PlayerArchetype): ArchetypeBehavior {
  return ARCHETYPE_BEHAVIORS[archetype];
}

/**
 * Check if archetype follows honor code
 * 
 * Honor code affects retreat behavior - honor-bound archetypes like Musa
 * will not retreat above their health threshold.
 * 
 * @param archetype - Player archetype to check
 * @returns True if archetype follows honor code
 * 
 * @korean 명예 규범 확인
 */
export function followsHonorCode(archetype: PlayerArchetype): boolean {
  return ARCHETYPE_BEHAVIORS[archetype].honorCode;
}

/**
 * Get optimal combat range for archetype
 * 
 * Returns the preferred distance in grid cells (1 cell = ~40px) where
 * the archetype is most effective in combat.
 * 
 * @param archetype - Player archetype
 * @returns Optimal range in grid cells
 * 
 * @korean 최적 전투 거리 가져오기
 */
export function getOptimalRange(archetype: PlayerArchetype): number {
  return ARCHETYPE_BEHAVIORS[archetype].optimalRange;
}
