/**
 * ## Korean Techniques System
 *
 * **Business Purpose:**
 * Comprehensive database and management system for authentic Korean martial arts
 * techniques integrated with I Ching trigram philosophy. Provides:
 * - Traditional Korean martial arts technique catalog
 * - Trigram-based technique classification system
 * - Cultural accuracy in technique names and descriptions
 * - Progressive skill development pathways
 *
 * **Korean Martial Arts Integration:**
 * - Authentic Korean technique names with proper Hanja origins
 * - Traditional Korean martial arts movement patterns
 * - Respectful cultural representation of Korean fighting methods
 * - Integration with Korean martial arts grading system
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

import { TrigramStance, PlayerArchetype } from "../../types/enums";
import type { KoreanText } from "../../types/korean-text";

export interface KoreanTechnique {
  readonly id: string;
  readonly name: KoreanText;
  readonly stance: TrigramStance;
  readonly category: "strike" | "block" | "throw" | "pressure_point" | "flow";
  readonly difficulty: 1 | 2 | 3 | 4 | 5;
  readonly damage: number;
  readonly kiCost: number;
  readonly staminaCost: number;
  readonly accuracy: number;
  readonly description: KoreanText;
  readonly culturalContext: string;
  readonly requiredLevel: number;
  readonly prerequisites: readonly string[];
  readonly archetypeBonus?: Partial<Record<PlayerArchetype, number>>;
}

/**
 * **Business Logic:** Complete catalog of authentic Korean martial arts techniques
 * organized by trigram stance with cultural accuracy
 */
export const KOREAN_TECHNIQUES: readonly KoreanTechnique[] = [
  // Heaven (건) Techniques - Direct force and power
  {
    id: "cheon_dung_byeok_ryeok",
    name: {
      korean: "천둥벽력",
      english: "Thunderous Heaven Strike",
    },
    stance: TrigramStance.GEON,
    category: "strike",
    difficulty: 3,
    damage: 35,
    kiCost: 15,
    staminaCost: 10,
    accuracy: 0.8,
    description: {
      korean: "하늘의 위력을 담은 강력한 직격타",
      english: "Powerful direct strike embodying heavenly might",
    },
    culturalContext:
      "천둥벽력은 조선시대 궁중 무예에서 전해진 기법으로, 하늘의 절대적 권위를 상징합니다.",
    requiredLevel: 5,
    prerequisites: [],
    archetypeBonus: {
      [PlayerArchetype.MUSA]: 1.2,
    },
  },
  {
    id: "gang_gi_pa_cheon",
    name: {
      korean: "강기파천",
      english: "Strong Energy Heaven Break",
    },
    stance: TrigramStance.GEON,
    category: "strike",
    difficulty: 4,
    damage: 45,
    kiCost: 25,
    staminaCost: 15,
    accuracy: 0.75,
    description: {
      korean: "강한 내공으로 하늘을 찢는 듯한 공격",
      english: "Attack that tears through heaven with strong internal energy",
    },
    culturalContext: "내가 수련의 정점을 나타내는 고급 기법입니다.",
    requiredLevel: 10,
    prerequisites: ["cheon_dung_byeok_ryeok"],
    archetypeBonus: {
      [PlayerArchetype.MUSA]: 1.3,
      [PlayerArchetype.JOJIK_POKRYEOKBAE]: 1.1,
    },
  },

  // Lake (태) Techniques - Fluid and adaptive
  {
    id: "yu_su_yeon_ta",
    name: {
      korean: "유수연타",
      english: "Flowing Water Combo",
    },
    stance: TrigramStance.TAE,
    category: "flow",
    difficulty: 2,
    damage: 20,
    kiCost: 12,
    staminaCost: 8,
    accuracy: 0.85,
    description: {
      korean: "물처럼 흘러가는 연속 공격",
      english: "Continuous attacks flowing like water",
    },
    culturalContext: "태극의 유연함을 무예에 적용한 전통 기법입니다.",
    requiredLevel: 3,
    prerequisites: [],
    archetypeBonus: {
      [PlayerArchetype.AMSALJA]: 1.2,
      [PlayerArchetype.JEONGBO_YOWON]: 1.1,
    },
  },

  // Fire (리) Techniques - Precision and speed
  {
    id: "hwa_yeom_ji_chang",
    name: {
      korean: "화염지창",
      english: "Flame Finger Spear",
    },
    stance: TrigramStance.LI,
    category: "pressure_point",
    difficulty: 3,
    damage: 30,
    kiCost: 18,
    staminaCost: 12,
    accuracy: 0.9,
    description: {
      korean: "불꽃처럼 빠르고 정확한 지압 공격",
      english: "Fast and precise pressure point attack like flame",
    },
    culturalContext: "한의학의 경혈 이론과 무예가 결합된 정교한 기법입니다.",
    requiredLevel: 6,
    prerequisites: [],
    archetypeBonus: {
      [PlayerArchetype.HACKER]: 1.3,
      [PlayerArchetype.AMSALJA]: 1.2,
    },
  },

  // Thunder (진) Techniques - Explosive power
  {
    id: "byeok_ryeok_il_seom",
    name: {
      korean: "벽력일섬",
      english: "Thunder Flash Strike",
    },
    stance: TrigramStance.JIN,
    category: "strike",
    difficulty: 4,
    damage: 50,
    kiCost: 30,
    staminaCost: 20,
    accuracy: 0.7,
    description: {
      korean: "번개처럼 빠르고 강력한 일격",
      english: "Lightning-fast and powerful single strike",
    },
    culturalContext:
      "진(震)의 폭발적 에너지를 무예로 구현한 최고 난이도 기법입니다.",
    requiredLevel: 12,
    prerequisites: ["cheon_dung_byeok_ryeok"],
    archetypeBonus: {
      [PlayerArchetype.MUSA]: 1.2,
      [PlayerArchetype.JOJIK_POKRYEOKBAE]: 1.3,
    },
  },

  // Wind (손) Techniques - Continuous pressure
  {
    id: "seon_pung_yeon_gyeok",
    name: {
      korean: "선풍연격",
      english: "Whirlwind Barrage",
    },
    stance: TrigramStance.SON,
    category: "flow",
    difficulty: 3,
    damage: 25,
    kiCost: 20,
    staminaCost: 15,
    accuracy: 0.8,
    description: {
      korean: "회오리바람 같은 연속 공격",
      english: "Continuous attacks like a whirlwind",
    },
    culturalContext:
      "바람의 지속적이고 침투적인 특성을 무예로 표현한 기법입니다.",
    requiredLevel: 7,
    prerequisites: [],
    archetypeBonus: {
      [PlayerArchetype.AMSALJA]: 1.4,
      [PlayerArchetype.HACKER]: 1.1,
    },
  },

  // Water (감) Techniques - Adaptive flow
  {
    id: "su_ryu_ban_gyeok",
    name: {
      korean: "수류반격",
      english: "Water Flow Counter",
    },
    stance: TrigramStance.GAM,
    category: "block",
    difficulty: 2,
    damage: 15,
    kiCost: 10,
    staminaCost: 5,
    accuracy: 0.9,
    description: {
      korean: "물의 흐름으로 상대 공격을 되돌리는 반격",
      english: "Counter that redirects opponent's attack with water flow",
    },
    culturalContext:
      "태극권의 유연한 반격 원리를 한국 무예에 적용한 기법입니다.",
    requiredLevel: 4,
    prerequisites: [],
    archetypeBonus: {
      [PlayerArchetype.JEONGBO_YOWON]: 1.3,
      [PlayerArchetype.AMSALJA]: 1.1,
    },
  },

  // Mountain (간) Techniques - Defensive mastery
  {
    id: "ban_seok_bang_eo",
    name: {
      korean: "반석방어",
      english: "Bedrock Defense",
    },
    stance: TrigramStance.GAN,
    category: "block",
    difficulty: 2,
    damage: 10,
    kiCost: 8,
    staminaCost: 12,
    accuracy: 0.95,
    description: {
      korean: "반석처럼 견고한 방어 자세",
      english: "Solid defensive stance like bedrock",
    },
    culturalContext:
      "산의 불변성과 견고함을 방어 무예로 구현한 기본 기법입니다.",
    requiredLevel: 2,
    prerequisites: [],
    archetypeBonus: {
      [PlayerArchetype.MUSA]: 1.2,
    },
  },

  // Earth (곤) Techniques - Grounding and balance
  {
    id: "dae_ji_po_ong",
    name: {
      korean: "대지포옹",
      english: "Earth's Embrace",
    },
    stance: TrigramStance.GON,
    category: "throw",
    difficulty: 3,
    damage: 35,
    kiCost: 16,
    staminaCost: 18,
    accuracy: 0.75,
    description: {
      korean: "대지의 포용력으로 상대를 제압하는 기법",
      english: "Technique that subdues opponents with earth's embrace",
    },
    culturalContext:
      "곤(坤)의 모성적 포용력을 무예의 제압 기법으로 승화시킨 기법입니다.",
    requiredLevel: 8,
    prerequisites: [],
    archetypeBonus: {
      [PlayerArchetype.MUSA]: 1.1,
      [PlayerArchetype.JOJIK_POKRYEOKBAE]: 1.2,
    },
  },
] as const;

/**
 * **Business Logic:** Gets all techniques available for a specific trigram stance
 */
export function getTechniquesByStance(
  stance: TrigramStance
): readonly KoreanTechnique[] {
  return KOREAN_TECHNIQUES.filter((technique) => technique.stance === stance);
}

/**
 * **Business Logic:** Gets techniques available for player based on level and archetype
 */
export function getAvailableTechniques(
  playerLevel: number,
  archetype: PlayerArchetype,
  stance?: TrigramStance
): readonly KoreanTechnique[] {
  return KOREAN_TECHNIQUES.filter((technique) => {
    const levelRequirement = technique.requiredLevel <= playerLevel;
    const stanceMatch = !stance || technique.stance === stance;
    return levelRequirement && stanceMatch;
  });
}

/**
 * **Business Logic:** Calculates technique effectiveness for specific player archetype
 */
export function calculateTechniqueEffectiveness(
  technique: KoreanTechnique,
  archetype: PlayerArchetype
): number {
  const baseEffectiveness = 1.0;
  const archetypeBonus = technique.archetypeBonus?.[archetype] || 1.0;
  return baseEffectiveness * archetypeBonus;
}

/**
 * **Business Logic:** Gets technique by ID with validation
 */
export function getTechniqueById(id: string): KoreanTechnique | null {
  return KOREAN_TECHNIQUES.find((technique) => technique.id === id) || null;
}

/**
 * **Business Logic:** Validates if player can learn/use specific technique
 */
export function canUseTechnique(
  technique: KoreanTechnique,
  playerLevel: number,
  knownTechniques: readonly string[]
): boolean {
  // Check level requirement
  if (playerLevel < technique.requiredLevel) {
    return false;
  }

  // Check prerequisites
  if (technique.prerequisites.length > 0) {
    const hasAllPrerequisites = technique.prerequisites.every((prereq) =>
      knownTechniques.includes(prereq)
    );
    if (!hasAllPrerequisites) {
      return false;
    }
  }

  return true;
}

export default {
  KOREAN_TECHNIQUES,
  getTechniquesByStance,
  getAvailableTechniques,
  calculateTechniqueEffectiveness,
  getTechniqueById,
  canUseTechnique,
};
