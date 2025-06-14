/**
 * ## Training Modes Configuration
 *
 * **Business Purpose:**
 * Defines the structured progression of Korean martial arts training modes
 * following traditional Korean martial arts educational methodology. Each mode
 * represents a distinct learning phase:
 * - **기본 (Basics)**: Foundation building with core Korean martial arts principles
 * - **고급 (Advanced)**: Complex techniques requiring mastery of fundamentals
 * - **자유 (Free)**: Open practice allowing creative application of learned skills
 *
 * **Korean Martial Arts Integration:**
 * - Follows traditional Korean martial arts belt progression structure
 * - Implements authentic Korean training methodology and terminology
 * - Respects cultural accuracy in skill requirement definitions
 * - Maintains traditional Korean martial arts learning hierarchy
 *
 * **Educational Framework:**
 * - Progressive difficulty scaling following Korean teaching principles
 * - Balanced stance access ensuring comprehensive trigram education
 * - Culturally appropriate focus areas reflecting Korean martial arts values
 * - Level requirements supporting authentic skill development progression
 *
 * @fileoverview Korean martial arts training modes configuration
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

import { TrigramStance } from "../../../../types/enums";
import type { TrainingMode, TrainingModeData } from "../types/training";

/**
 * **Business Logic:** Complete training mode definitions following Korean martial arts
 * educational standards and traditional progression methodology
 *
 * **Korean Martial Arts Integration:**
 * - Each mode represents authentic Korean martial arts learning phase
 * - Stance access follows traditional trigram mastery progression
 * - Focus areas reflect Korean martial arts core competencies
 * - Level requirements respect traditional Korean martial arts hierarchy
 */
export const TRAINING_MODES: readonly TrainingModeData[] = [
  {
    id: "basics" as TrainingMode,
    name: {
      korean: "기본 훈련",
      english: "Basic Training",
    },
    description: {
      korean:
        "한국 무술의 기본 자세와 기법을 배웁니다. 정확한 폼과 균형 감각을 기르는 것이 목표입니다.",
      english:
        "Learn fundamental Korean martial arts stances and techniques. Focus on proper form and balance development.",
    },
    maxAttempts: 20,
    difficulty: 1,
    requiredLevel: 1,
    availableStances: [
      TrigramStance.GEON, // Heaven - Foundation of all stances
      TrigramStance.GON, // Earth - Grounding and stability
      TrigramStance.GAN, // Mountain - Defensive principles
    ],
    focusAreas: [
      "accuracy", // 정확도 - Essential for Korean martial arts precision
      "balance", // 균형 - Core Korean martial arts principle
      "stance", // 자세 - Foundation of all Korean martial arts
    ],
    rewards: {
      experienceMultiplier: 1.0,
      unlocks: ["advanced"],
      achievements: ["first_steps", "steady_foundation"],
    },
  },
  {
    id: "advanced" as TrainingMode,
    name: {
      korean: "고급 훈련",
      english: "Advanced Training",
    },
    description: {
      korean:
        "복합적인 기법과 연속 동작을 마스터합니다. 팔괘의 진정한 힘을 이해하게 됩니다.",
      english:
        "Master complex techniques and combination movements. Understand the true power of the eight trigrams.",
    },
    maxAttempts: 15,
    difficulty: 3,
    requiredLevel: 5,
    availableStances: [
      TrigramStance.GEON, // Heaven - Advanced applications
      TrigramStance.TAE, // Lake - Flow and adaptation
      TrigramStance.LI, // Fire - Precision and power
      TrigramStance.JIN, // Thunder - Dynamic techniques
      TrigramStance.SON, // Wind - Continuous movement
      TrigramStance.GAM, // Water - Advanced flow principles
    ],
    focusAreas: [
      "power", // 힘 - Advanced power generation
      "speed", // 속도 - Combat timing and reflexes
      "technique", // 기술 - Complex technique mastery
      "flow", // 흐름 - Traditional Korean martial arts flow
    ],
    rewards: {
      experienceMultiplier: 1.5,
      unlocks: ["free", "master_techniques"],
      achievements: ["trigram_warrior", "flow_master"],
    },
  },
  {
    id: "free" as TrainingMode,
    name: {
      korean: "자유 수련",
      english: "Free Practice",
    },
    description: {
      korean:
        "모든 팔괘 자세를 자유롭게 사용하여 개인만의 무술 스타일을 개발합니다. 창의성과 직관을 기릅니다.",
      english:
        "Use all eight trigram stances freely to develop your personal martial arts style. Cultivate creativity and intuition.",
    },
    maxAttempts: 30,
    difficulty: 5,
    requiredLevel: 10,
    availableStances: Object.values(TrigramStance), // All eight trigrams available
    focusAreas: [
      "creativity", // 창의성 - Personal style development
      "mastery", // 숙련도 - Complete technique mastery
      "wisdom", // 지혜 - Understanding deeper principles
      "harmony", // 조화 - Balance of all elements
    ],
    rewards: {
      experienceMultiplier: 2.0,
      unlocks: ["master_class", "teaching_qualification"],
      achievements: ["trigram_master", "path_walker", "eight_gates_opened"],
    },
  },
] as const;

/**
 * **Business Logic:** Gets training mode by identifier with Korean martial arts validation
 *
 * @param modeId - Training mode identifier
 * @returns Training mode data or null if not found
 */
export const getTrainingModeById = (
  modeId: TrainingMode
): TrainingModeData | null => {
  return TRAINING_MODES.find((mode) => mode.id === modeId) || null;
};

/**
 * **Business Logic:** Gets available training modes for player level following
 * Korean martial arts progression standards
 *
 * @param playerLevel - Current player experience level
 * @returns Array of accessible training modes
 */
export const getAvailableTrainingModes = (
  playerLevel: number
): readonly TrainingModeData[] => {
  return TRAINING_MODES.filter((mode) => playerLevel >= mode.requiredLevel);
};

/**
 * **Business Logic:** Validates if player meets Korean martial arts requirements
 * for specific training mode
 *
 * @param modeId - Training mode to validate access for
 * @param playerLevel - Current player experience level
 * @returns Whether player can access the training mode
 */
export const canAccessTrainingMode = (
  modeId: TrainingMode,
  playerLevel: number
): boolean => {
  const mode = getTrainingModeById(modeId);
  return mode ? playerLevel >= mode.requiredLevel : false;
};

/**
 * **Business Logic:** Gets next available training mode in Korean martial arts progression
 *
 * @param currentLevel - Player's current experience level
 * @returns Next training mode to unlock or null if all unlocked
 */
export const getNextTrainingMode = (
  currentLevel: number
): TrainingModeData | null => {
  const availableModes = TRAINING_MODES.filter(
    (mode) => mode.requiredLevel > currentLevel
  );
  return availableModes.length > 0
    ? availableModes.reduce((next, mode) =>
        mode.requiredLevel < next.requiredLevel ? mode : next
      )
    : null;
};

export default TRAINING_MODES;
