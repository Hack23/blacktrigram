import type { TrigramStance, KoreanTechnique } from "../../types";

/**
 * Comprehensive Korean Martial Arts Techniques System
 * Based on traditional Korean martial arts (Taekwondo, Hapkido, Tangsudo)
 * Integrated with I-Ching trigram philosophy
 */

// Enhanced Korean technique with combat chains and cultural context
export interface EnhancedKoreanTechnique extends KoreanTechnique {
  readonly culturalContext: {
    readonly origin: string; // Which Korean martial art
    readonly philosophy: string; // Associated philosophy
    readonly traditionalUse: string; // Historical application
  };
  readonly comboChains: readonly string[]; // Technique IDs that can follow
  readonly counters: readonly string[]; // Techniques that counter this
  readonly prerequisites: {
    readonly minKi: number;
    readonly minStamina: number;
    readonly requiredStance?: TrigramStance;
    readonly forbiddenStances?: readonly TrigramStance[];
  };
  readonly timingProperties: {
    readonly startupFrames: number;
    readonly activeFrames: number;
    readonly recoveryFrames: number;
    readonly cancelWindows: readonly number[];
  };
}

// Comprehensive Korean technique database for each trigram
export const KOREAN_TECHNIQUES_DATABASE: Record<
  TrigramStance,
  readonly EnhancedKoreanTechnique[]
> = {
  // 건 (Heaven/Sky) - Creative Force Techniques
  geon: [
    {
      name: "천둥벽력",
      koreanName: "천둥벽력",
      englishName: "Heavenly Thunder Strike",
      description: {
        korean: "하늘의 기운을 모아 강력한 일격을 가하는 기술",
        english: "Gathering heavenly energy for a powerful devastating strike",
      },
      kiCost: 15,
      staminaCost: 10,
      range: 60,
      accuracy: 0.8,
      stance: "geon",
      damage: 28,
      type: "strike",
      critChance: 0.15,
      critMultiplier: 1.5,
      effects: [
        {
          type: "vital_stunning",
          duration: 2000,
          magnitude: 0.8,
          chance: 0.3,
          source: "천둥벽력",
        },
      ],
      culturalContext: {
        origin: "전통 택견",
        philosophy: "창조적 에너지의 발현",
        traditionalUse: "결정적 순간의 마지막 일격",
      },
      comboChains: ["하늘찌르기", "천지개벽"],
      counters: ["수류반격", "대지포옹"],
      prerequisites: {
        minKi: 15,
        minStamina: 10,
        requiredStance: "geon",
      },
      timingProperties: {
        startupFrames: 12,
        activeFrames: 6,
        recoveryFrames: 18,
        cancelWindows: [8, 14],
      },
    },
    {
      name: "하늘찌르기",
      koreanName: "하늘찌르기",
      englishName: "Sky Piercing Thrust",
      description: {
        korean: "하늘을 찌르는 듯한 강력한 상단 공격",
        english: "Powerful upward thrust that seems to pierce the heavens",
      },
      kiCost: 12,
      staminaCost: 8,
      range: 45,
      accuracy: 0.85,
      stance: "geon",
      damage: 22,
      type: "punch",
      critChance: 0.12,
      critMultiplier: 1.4,
      culturalContext: {
        origin: "한국 전통 무술",
        philosophy: "상승하는 양의 기운",
        traditionalUse: "적의 상단 급소 공격",
      },
      comboChains: ["천둥벽력", "천지개벽"],
      counters: ["선풍연격", "반석방어"],
      prerequisites: {
        minKi: 12,
        minStamina: 8,
      },
      timingProperties: {
        startupFrames: 8,
        activeFrames: 4,
        recoveryFrames: 12,
        cancelWindows: [6, 10],
      },
    },
    {
      name: "천지개벽",
      koreanName: "천지개벽",
      englishName: "Heaven and Earth Opening",
      description: {
        korean: "천지를 가르는 강력한 연속 공격",
        english: "Powerful combination attack that splits heaven and earth",
      },
      kiCost: 25,
      staminaCost: 20,
      range: 55,
      accuracy: 0.75,
      stance: "geon",
      damage: 35,
      type: "combination",
      critChance: 0.2,
      critMultiplier: 1.8,
      effects: [
        {
          type: "knockdown",
          duration: 3000,
          magnitude: 1.0,
          chance: 0.4,
          source: "천지개벽",
        },
      ],
      culturalContext: {
        origin: "합기도",
        philosophy: "창조와 파괴의 균형",
        traditionalUse: "최종 결정타",
      },
      comboChains: [],
      counters: ["수류반격"],
      prerequisites: {
        minKi: 25,
        minStamina: 20,
        requiredStance: "geon",
      },
      timingProperties: {
        startupFrames: 15,
        activeFrames: 8,
        recoveryFrames: 25,
        cancelWindows: [12],
      },
    },
  ],

  // 태 (Lake) - Joyful Flow Techniques
  tae: [
    {
      name: "유수연타",
      koreanName: "유수연타",
      englishName: "Flowing Water Combo",
      description: {
        korean: "물이 흐르듯 자연스럽고 연속적인 공격",
        english: "Natural and continuous attacks flowing like water",
      },
      kiCost: 12,
      staminaCost: 8,
      range: 50,
      accuracy: 0.85,
      stance: "tae",
      damage: 18,
      type: "combination",
      critChance: 0.1,
      critMultiplier: 1.3,
      effects: [
        {
          type: "flow_state",
          duration: 5000,
          magnitude: 1.2,
          chance: 0.5,
          source: "유수연타",
        },
      ],
      culturalContext: {
        origin: "태권도",
        philosophy: "기쁨과 조화의 표현",
        traditionalUse: "연속 공격으로 적을 압박",
      },
      comboChains: ["물살치기", "호수의춤"],
      counters: ["반석방어", "간산막기"],
      prerequisites: {
        minKi: 12,
        minStamina: 8,
      },
      timingProperties: {
        startupFrames: 6,
        activeFrames: 12,
        recoveryFrames: 8,
        cancelWindows: [4, 8, 12, 16],
      },
    },
    {
      name: "물살치기",
      koreanName: "물살치기",
      englishName: "Rushing Current Strike",
      description: {
        korean: "급류처럼 빠르고 강한 연속 타격",
        english: "Fast and powerful continuous strikes like rushing current",
      },
      kiCost: 10,
      staminaCost: 12,
      range: 40,
      accuracy: 0.9,
      stance: "tae",
      damage: 15,
      type: "combination",
      critChance: 0.15,
      critMultiplier: 1.4,
      culturalContext: {
        origin: "택견",
        philosophy: "자연의 흐름을 따르는 무술",
        traditionalUse: "적의 방어를 무너뜨리는 연타",
      },
      comboChains: ["유수연타", "호수의춤"],
      counters: ["벽력일섬", "대지포옹"],
      prerequisites: {
        minKi: 10,
        minStamina: 12,
      },
      timingProperties: {
        startupFrames: 5,
        activeFrames: 10,
        recoveryFrames: 6,
        cancelWindows: [3, 6, 9, 12],
      },
    },
  ],

  // 리 (Fire) - Brilliant Flame Techniques
  li: [
    {
      name: "화염지창",
      koreanName: "화염지창",
      englishName: "Flame Spear Thrust",
      description: {
        korean: "불꽃처럼 빠르고 정확한 급소 공격",
        english: "Swift and precise vital point attack like a flame spear",
      },
      kiCost: 20,
      staminaCost: 15,
      range: 55,
      accuracy: 0.75,
      stance: "li",
      damage: 35,
      type: "pressure_point",
      critChance: 0.2,
      critMultiplier: 1.7,
      effects: [
        {
          type: "burning",
          duration: 4000,
          magnitude: 0.6,
          chance: 0.7,
          source: "화염지창",
        },
        {
          type: "vital_weakness",
          duration: 6000,
          magnitude: 0.8,
          chance: 0.4,
          source: "화염지창",
        },
      ],
      culturalContext: {
        origin: "한국 전통 무술",
        philosophy: "명료함과 정확성의 추구",
        traditionalUse: "결정적 급소 공격",
      },
      comboChains: ["불꽃난무", "화룡점정"],
      counters: ["수류반격", "간산막기"],
      prerequisites: {
        minKi: 20,
        minStamina: 15,
        requiredStance: "li",
      },
      timingProperties: {
        startupFrames: 10,
        activeFrames: 3,
        recoveryFrames: 15,
        cancelWindows: [8],
      },
    },
    {
      name: "불꽃난무",
      koreanName: "불꽃난무",
      englishName: "Dancing Flames",
      description: {
        korean: "불꽃이 춤추듯 화려하고 빠른 연속 공격",
        english: "Spectacular and swift continuous attacks like dancing flames",
      },
      kiCost: 18,
      staminaCost: 14,
      range: 48,
      accuracy: 0.8,
      stance: "li",
      damage: 28,
      type: "combination",
      critChance: 0.18,
      critMultiplier: 1.6,
      effects: [
        {
          type: "dazzled",
          duration: 3000,
          magnitude: 0.7,
          chance: 0.5,
          source: "불꽃난무",
        },
      ],
      culturalContext: {
        origin: "태권도",
        philosophy: "밝음과 화려함의 조화",
        traditionalUse: "적의 시선을 현혹시키는 기술",
      },
      comboChains: ["화염지창", "화룡점정"],
      counters: ["선풍연격", "반석방어"],
      prerequisites: {
        minKi: 18,
        minStamina: 14,
      },
      timingProperties: {
        startupFrames: 8,
        activeFrames: 14,
        recoveryFrames: 10,
        cancelWindows: [6, 10, 14],
      },
    },
  ],

  // 진 (Thunder) - Explosive Power Techniques
  jin: [
    {
      name: "벽력일섬",
      koreanName: "벽력일섬",
      englishName: "Lightning Flash Kick",
      description: {
        korean: "번개처럼 빠르고 강력한 일격",
        english: "Swift and powerful strike like a lightning flash",
      },
      kiCost: 25,
      staminaCost: 20,
      range: 45,
      accuracy: 0.7,
      stance: "jin",
      damage: 40,
      type: "kick",
      critChance: 0.25,
      critMultiplier: 1.8,
      effects: [
        {
          type: "paralysis",
          duration: 2500,
          magnitude: 0.9,
          chance: 0.6,
          source: "벽력일섬",
        },
      ],
      culturalContext: {
        origin: "태권도",
        philosophy: "순간적 폭발력의 극대화",
        traditionalUse: "기습적 결정타",
      },
      comboChains: ["뇌전격", "천둥발차기"],
      counters: ["대지포옹", "반석방어"],
      prerequisites: {
        minKi: 25,
        minStamina: 20,
        requiredStance: "jin",
      },
      timingProperties: {
        startupFrames: 6,
        activeFrames: 2,
        recoveryFrames: 20,
        cancelWindows: [4],
      },
    },
    {
      name: "천둥발차기",
      koreanName: "천둥발차기",
      englishName: "Thunder Kick",
      description: {
        korean: "천둥소리처럼 강력한 발차기",
        english: "Powerful kick that resonates like thunder",
      },
      kiCost: 22,
      staminaCost: 18,
      range: 50,
      accuracy: 0.75,
      stance: "jin",
      damage: 36,
      type: "kick",
      critChance: 0.22,
      critMultiplier: 1.7,
      effects: [
        {
          type: "knockback",
          duration: 1500,
          magnitude: 1.5,
          chance: 0.8,
          source: "천둥발차기",
        },
      ],
      culturalContext: {
        origin: "태권도",
        philosophy: "충격과 움직임의 힘",
        traditionalUse: "거리 조절과 강력한 공격",
      },
      comboChains: ["벽력일섬", "뇌전격"],
      counters: ["수류반격", "선풍연격"],
      prerequisites: {
        minKi: 22,
        minStamina: 18,
      },
      timingProperties: {
        startupFrames: 9,
        activeFrames: 5,
        recoveryFrames: 16,
        cancelWindows: [7, 11],
      },
    },
  ],

  // 손 (Wind) - Gentle Penetration Techniques
  son: [
    {
      name: "선풍연격",
      koreanName: "선풍연격",
      englishName: "Whirlwind Barrage",
      description: {
        korean: "선풍처럼 빠르고 연속적인 공격",
        english: "Swift and continuous attacks like a whirlwind",
      },
      kiCost: 10,
      staminaCost: 12,
      range: 40,
      accuracy: 0.9,
      stance: "son",
      damage: 15,
      type: "combination",
      critChance: 0.15,
      critMultiplier: 1.4,
      effects: [
        {
          type: "evasion_boost",
          duration: 4000,
          magnitude: 1.3,
          chance: 0.6,
          source: "선풍연격",
        },
      ],
      culturalContext: {
        origin: "택견",
        philosophy: "온순함과 침투력의 조화",
        traditionalUse: "적의 방어를 서서히 무너뜨림",
      },
      comboChains: ["바람의칼날", "회오리발차기"],
      counters: ["천둥벽력", "화염지창"],
      prerequisites: {
        minKi: 10,
        minStamina: 12,
      },
      timingProperties: {
        startupFrames: 4,
        activeFrames: 16,
        recoveryFrames: 6,
        cancelWindows: [2, 6, 10, 14, 18],
      },
    },
    {
      name: "바람의칼날",
      koreanName: "바람의칼날",
      englishName: "Wind Blade",
      description: {
        korean: "바람처럼 빠르고 날카로운 타격",
        english: "Swift and sharp strike like a wind blade",
      },
      kiCost: 14,
      staminaCost: 10,
      range: 52,
      accuracy: 0.88,
      stance: "son",
      damage: 20,
      type: "strike",
      critChance: 0.17,
      critMultiplier: 1.5,
      culturalContext: {
        origin: "한국 전통 무술",
        philosophy: "부드러움 속의 날카로움",
        traditionalUse: "정확한 절단 공격",
      },
      comboChains: ["선풍연격", "회오리발차기"],
      counters: ["반석방어", "대지포옹"],
      prerequisites: {
        minKi: 14,
        minStamina: 10,
      },
      timingProperties: {
        startupFrames: 6,
        activeFrames: 4,
        recoveryFrames: 8,
        cancelWindows: [5, 9],
      },
    },
  ],

  // 감 (Water) - Flowing Adaptation Techniques
  gam: [
    {
      name: "수류반격",
      koreanName: "수류반격",
      englishName: "Water Current Counter",
      description: {
        korean: "물의 흐름처럼 자연스럽게 반격하는 기술",
        english: "Natural counter-attack flowing like water current",
      },
      kiCost: 15,
      staminaCost: 10,
      range: 35,
      accuracy: 0.85,
      stance: "gam",
      damage: 25,
      type: "grapple",
      critChance: 0.1,
      critMultiplier: 1.6,
      effects: [
        {
          type: "redirect",
          duration: 2000,
          magnitude: 1.2,
          chance: 0.7,
          source: "수류반격",
        },
      ],
      culturalContext: {
        origin: "합기도",
        philosophy: "적의 힘을 이용한 반격",
        traditionalUse: "방어와 동시에 반격",
      },
      comboChains: ["물의소용돌이", "심연의손"],
      counters: ["벽력일섬", "천둥벽력"],
      prerequisites: {
        minKi: 15,
        minStamina: 10,
        requiredStance: "gam",
      },
      timingProperties: {
        startupFrames: 3,
        activeFrames: 8,
        recoveryFrames: 5,
        cancelWindows: [2, 6],
      },
    },
    {
      name: "심연의손",
      koreanName: "심연의손",
      englishName: "Abyssal Grasp",
      description: {
        korean: "깊은 바다처럼 깊숙이 파고드는 잡기 기술",
        english: "Deep grappling technique that penetrates like the abyss",
      },
      kiCost: 18,
      staminaCost: 15,
      range: 30,
      accuracy: 0.8,
      stance: "gam",
      damage: 30,
      type: "grapple",
      critChance: 0.12,
      critMultiplier: 1.8,
      effects: [
        {
          type: "immobilize",
          duration: 4000,
          magnitude: 1.0,
          chance: 0.6,
          source: "심연의손",
        },
      ],
      culturalContext: {
        origin: "합기도",
        philosophy: "깊이와 위험의 활용",
        traditionalUse: "적을 제압하는 잡기",
      },
      comboChains: ["수류반격", "물의소용돌이"],
      counters: ["선풍연격", "바람의칼날"],
      prerequisites: {
        minKi: 18,
        minStamina: 15,
      },
      timingProperties: {
        startupFrames: 8,
        activeFrames: 6,
        recoveryFrames: 12,
        cancelWindows: [6],
      },
    },
  ],

  // 간 (Mountain) - Solid Defense Techniques
  gan: [
    {
      name: "반석방어",
      koreanName: "반석방어",
      englishName: "Solid Rock Defense",
      description: {
        korean: "반석처럼 견고한 방어 후 반격",
        english: "Solid defense like bedrock followed by counter-attack",
      },
      kiCost: 12,
      staminaCost: 8,
      range: 30,
      accuracy: 0.95,
      stance: "gan",
      damage: 12,
      type: "elbow",
      critChance: 0.05,
      critMultiplier: 1.2,
      effects: [
        {
          type: "defense_boost",
          duration: 6000,
          magnitude: 1.5,
          chance: 0.8,
          source: "반석방어",
        },
      ],
      culturalContext: {
        origin: "전통 무술",
        philosophy: "정지와 견고함의 힘",
        traditionalUse: "완벽한 방어 후 반격",
      },
      comboChains: ["산사태", "철벽진"],
      counters: ["화염지창", "벽력일섬"],
      prerequisites: {
        minKi: 12,
        minStamina: 8,
        requiredStance: "gan",
      },
      timingProperties: {
        startupFrames: 2,
        activeFrames: 12,
        recoveryFrames: 4,
        cancelWindows: [10, 14],
      },
    },
    {
      name: "철벽진",
      koreanName: "철벽진",
      englishName: "Iron Wall Formation",
      description: {
        korean: "철벽같은 방어와 강력한 반격",
        english: "Iron wall defense with powerful counter-attack",
      },
      kiCost: 16,
      staminaCost: 12,
      range: 25,
      accuracy: 0.9,
      stance: "gan",
      damage: 18,
      type: "elbow",
      critChance: 0.08,
      critMultiplier: 1.4,
      effects: [
        {
          type: "armor",
          duration: 8000,
          magnitude: 1.8,
          chance: 0.9,
          source: "철벽진",
        },
      ],
      culturalContext: {
        origin: "전통 무술",
        philosophy: "완전한 정지와 인내",
        traditionalUse: "절대 방어 기술",
      },
      comboChains: ["반석방어", "산사태"],
      counters: ["유수연타", "선풍연격"],
      prerequisites: {
        minKi: 16,
        minStamina: 12,
      },
      timingProperties: {
        startupFrames: 5,
        activeFrames: 15,
        recoveryFrames: 8,
        cancelWindows: [12, 18],
      },
    },
  ],

  // 곤 (Earth) - Nurturing Support Techniques
  gon: [
    {
      name: "대지포옹",
      koreanName: "대지포옹",
      englishName: "Earth's Embrace",
      description: {
        korean: "대지가 품듯 강력하게 감싸는 잡기 기술",
        english: "Powerful grappling technique that embraces like the earth",
      },
      kiCost: 18,
      staminaCost: 15,
      range: 25,
      accuracy: 0.9,
      stance: "gon",
      damage: 30,
      type: "throw",
      critChance: 0.1,
      critMultiplier: 1.5,
      effects: [
        {
          type: "ground_slam",
          duration: 3000,
          magnitude: 1.2,
          chance: 0.7,
          source: "대지포옹",
        },
      ],
      culturalContext: {
        origin: "씨름/유도",
        philosophy: "포용과 수용의 힘",
        traditionalUse: "적을 제압하는 투기 기술",
      },
      comboChains: ["지진타격", "대지의뿌리"],
      counters: ["선풍연격", "바람의칼날"],
      prerequisites: {
        minKi: 18,
        minStamina: 15,
        requiredStance: "gon",
      },
      timingProperties: {
        startupFrames: 10,
        activeFrames: 8,
        recoveryFrames: 15,
        cancelWindows: [8],
      },
    },
    {
      name: "대지의뿌리",
      koreanName: "대지의뿌리",
      englishName: "Earth's Roots",
      description: {
        korean: "대지에 뿌리내린 듯 안정적인 기술",
        english: "Stable technique rooted deep in the earth",
      },
      kiCost: 14,
      staminaCost: 12,
      range: 35,
      accuracy: 0.88,
      stance: "gon",
      damage: 22,
      type: "strike",
      critChance: 0.12,
      critMultiplier: 1.4,
      effects: [
        {
          type: "stability_boost",
          duration: 5000,
          magnitude: 1.4,
          chance: 0.8,
          source: "대지의뿌리",
        },
      ],
      culturalContext: {
        origin: "전통 무술",
        philosophy: "안정성과 지속성",
        traditionalUse: "기반을 다지는 기술",
      },
      comboChains: ["대지포옹", "지진타격"],
      counters: ["벽력일섬", "화염지창"],
      prerequisites: {
        minKi: 14,
        minStamina: 12,
      },
      timingProperties: {
        startupFrames: 7,
        activeFrames: 6,
        recoveryFrames: 10,
        cancelWindows: [6, 11],
      },
    },
  ],
} as const;

/**
 * Get all techniques for a specific trigram stance
 */
export function getTechniquesForStance(
  stance: TrigramStance
): readonly EnhancedKoreanTechnique[] {
  return KOREAN_TECHNIQUES_DATABASE[stance] || [];
}

/**
 * Find technique by name across all stances
 */
export function findTechniqueByName(
  techniqueName: string
): EnhancedKoreanTechnique | null {
  for (const stanceTechniques of Object.values(KOREAN_TECHNIQUES_DATABASE)) {
    const technique = stanceTechniques.find(
      (t) => t.name === techniqueName || t.koreanName === techniqueName
    );
    if (technique) return technique;
  }
  return null;
}

/**
 * Get techniques that can combo from the given technique
 */
export function getComboTechniques(
  techniqueName: string
): readonly EnhancedKoreanTechnique[] {
  const sourceTechnique = findTechniqueByName(techniqueName);
  if (!sourceTechnique || !sourceTechnique.comboChains.length) {
    return [];
  }

  const comboTechniques: EnhancedKoreanTechnique[] = [];
  for (const comboName of sourceTechnique.comboChains) {
    const comboTechnique = findTechniqueByName(comboName);
    if (comboTechnique) {
      comboTechniques.push(comboTechnique);
    }
  }

  return comboTechniques;
}

/**
 * Get techniques that counter the given technique
 */
export function getCounterTechniques(
  techniqueName: string
): readonly EnhancedKoreanTechnique[] {
  const sourceTechnique = findTechniqueByName(techniqueName);
  if (!sourceTechnique || !sourceTechnique.counters.length) {
    return [];
  }

  const counterTechniques: EnhancedKoreanTechnique[] = [];
  for (const counterName of sourceTechnique.counters) {
    const counterTechnique = findTechniqueByName(counterName);
    if (counterTechnique) {
      counterTechniques.push(counterTechnique);
    }
  }

  return counterTechniques;
}

/**
 * Check if a technique can be executed given current state
 */
export function canExecuteTechnique(
  technique: EnhancedKoreanTechnique,
  currentKi: number,
  currentStamina: number,
  currentStance: TrigramStance
): {
  canExecute: boolean;
  reason?: string;
} {
  if (currentKi < technique.prerequisites.minKi) {
    return {
      canExecute: false,
      reason: `기 부족: ${technique.prerequisites.minKi} 필요, ${currentKi} 보유`,
    };
  }

  if (currentStamina < technique.prerequisites.minStamina) {
    return {
      canExecute: false,
      reason: `체력 부족: ${technique.prerequisites.minStamina} 필요, ${currentStamina} 보유`,
    };
  }

  if (
    technique.prerequisites.requiredStance &&
    currentStance !== technique.prerequisites.requiredStance
  ) {
    return {
      canExecute: false,
      reason: `잘못된 자세: ${technique.prerequisites.requiredStance} 자세 필요`,
    };
  }

  if (technique.prerequisites.forbiddenStances?.includes(currentStance)) {
    return {
      canExecute: false,
      reason: `금지된 자세: ${currentStance}에서 사용 불가`,
    };
  }

  return { canExecute: true };
}

/**
 * Calculate technique effectiveness based on distance and timing
 */
export function calculateTechniqueEffectiveness(
  technique: EnhancedKoreanTechnique,
  distance: number,
  framesTiming: number
): number {
  // Distance effectiveness
  const optimalRange = technique.range * 0.7; // 70% of max range is optimal
  const distanceRatio = distance / technique.range;
  let distanceMultiplier = 1.0;

  if (distance <= optimalRange) {
    distanceMultiplier = 1.0; // Perfect distance
  } else if (distance <= technique.range) {
    distanceMultiplier = 1.0 - (distanceRatio - 0.7) * 0.5; // Gradual falloff
  } else {
    distanceMultiplier = 0.1; // Too far, minimal effectiveness
  }

  // Timing effectiveness (frame-perfect execution bonus)
  let timingMultiplier = 1.0;
  const isInCancelWindow = technique.timingProperties.cancelWindows.some(
    (window) => Math.abs(framesTiming - window) <= 2
  );

  if (isInCancelWindow) {
    timingMultiplier = 1.2; // 20% bonus for frame-perfect timing
  }

  return Math.max(0.1, distanceMultiplier * timingMultiplier);
}

/**
 * Generate technique learning recommendations
 */
export function generateLearningPath(
  currentStance: TrigramStance,
  playerLevel: number
): {
  recommended: readonly EnhancedKoreanTechnique[];
  description: string;
} {
  const stanceTechniques = getTechniquesForStance(currentStance);
  const basicTechniques = stanceTechniques.filter(
    (t) => t.prerequisites.minKi <= 15
  );
  const intermediateTechniques = stanceTechniques.filter(
    (t) => t.prerequisites.minKi > 15 && t.prerequisites.minKi <= 20
  );
  const advancedTechniques = stanceTechniques.filter(
    (t) => t.prerequisites.minKi > 20
  );

  if (playerLevel <= 3) {
    return {
      recommended: basicTechniques,
      description: `${currentStance} 자세의 기본 기술들을 익혀보세요`,
    };
  } else if (playerLevel <= 7) {
    return {
      recommended: intermediateTechniques,
      description: `${currentStance} 자세의 중급 기술들에 도전해보세요`,
    };
  } else {
    return {
      recommended: advancedTechniques,
      description: `${currentStance} 자세의 고급 기술들을 마스터하세요`,
    };
  }
}

/**
 * Export all Korean techniques for external use
 */
export function getAllKoreanTechniques(): readonly EnhancedKoreanTechnique[] {
  return Object.values(KOREAN_TECHNIQUES_DATABASE).flat();
}
