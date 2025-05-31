import type { TrigramStance } from "../../types";

/**
 * Korean Martial Arts Philosophy and Cultural Integration
 * Traditional Korean wisdom applied to trigram combat system
 */

export interface KoreanPhilosophy {
  readonly id: string;
  readonly korean: string;
  readonly english: string;
  readonly concept: string;
  readonly principle: string;
  readonly application: string;
  readonly stance: TrigramStance;
  readonly description: {
    readonly korean: string;
    readonly english: string;
  };
  readonly modernInterpretation: string;
}

export interface StanceWisdom {
  readonly korean: string;
  readonly english: string;
  readonly advice: string;
  readonly category: "basic" | "intermediate" | "advanced" | "master";
}

// Korean martial arts philosophies for each trigram stance
export const KOREAN_PHILOSOPHIES: readonly KoreanPhilosophy[] = [
  {
    id: "geon_heaven",
    korean: "건괘 - 천",
    english: "Heaven Trigram",
    concept: "Creative Force",
    principle: "Strong and persistent action",
    application: "Leadership through moral strength",
    stance: "geon",
    description: {
      korean: "하늘의 기운으로 강인함을 나타내며 창조적 에너지의 근원이다",
      english:
        "Represents strength through heavenly energy and source of creative power",
    },
    modernInterpretation: "Taking initiative with unwavering determination",
  },
  {
    id: "tae_lake",
    korean: "태괘 - 택",
    english: "Lake Trigram",
    concept: "Joyful Expression",
    principle: "Gentle yet powerful influence",
    application: "Achieving goals through charisma and persuasion",
    stance: "tae",
    description: {
      korean: "호수의 기운으로 기쁨과 소통을 나타내며 부드러운 힘을 상징한다",
      english:
        "Represents joy and communication through lake energy, symbolizing gentle power",
    },
    modernInterpretation: "Leading through inspiration and positive influence",
  },
  {
    id: "li_fire",
    korean: "리괘 - 화",
    english: "Fire Trigram",
    concept: "Illumination",
    principle: "Brightness and clarity of purpose",
    application: "Revealing truth through direct action",
    stance: "li",
    description: {
      korean: "불의 기운으로 밝음과 명료함을 나타내며 진실을 드러낸다",
      english:
        "Represents brightness and clarity through fire energy, revealing truth",
    },
    modernInterpretation:
      "Pursuing goals with clarity and passionate determination",
  },
  {
    id: "jin_thunder",
    korean: "진괘 - 뇌",
    english: "Thunder Trigram",
    concept: "Shocking Movement",
    principle: "Swift and decisive action",
    application: "Breaking through obstacles with sudden force",
    stance: "jin",
    description: {
      korean: "천둥의 기운으로 움직임과 충격을 나타내며 돌파력을 상징한다",
      english:
        "Represents movement and shock through thunder energy, symbolizing breakthrough power",
    },
    modernInterpretation: "Acting decisively when opportunities arise",
  },
  {
    id: "son_wind",
    korean: "손괘 - 풍",
    english: "Wind Trigram",
    concept: "Gentle Penetration",
    principle: "Persistent gentle influence",
    application: "Achieving goals through patience and consistency",
    stance: "son",
    description: {
      korean: "바람의 기운으로 부드러운 침투력을 나타내며 끈기를 상징한다",
      english:
        "Represents gentle penetration through wind energy, symbolizing persistence",
    },
    modernInterpretation: "Making gradual progress through consistent effort",
  },
  {
    id: "gam_water",
    korean: "감괘 - 수",
    english: "Water Trigram",
    concept: "Dangerous Depth",
    principle: "Flowing around obstacles",
    application: "Overcoming challenges through adaptability",
    stance: "gam",
    description: {
      korean: "물의 기운으로 깊이와 위험을 나타내며 적응력을 상징한다",
      english:
        "Represents depth and danger through water energy, symbolizing adaptability",
    },
    modernInterpretation: "Adapting strategy to overcome difficult situations",
  },
  {
    id: "gan_mountain",
    korean: "간괘 - 산",
    english: "Mountain Trigram",
    concept: "Stillness",
    principle: "Knowing when to stop and wait",
    application: "Strategic patience and timing",
    stance: "gan",
    description: {
      korean: "산의 기운으로 정지와 견고함을 나타내며 인내력을 상징한다",
      english:
        "Represents stillness and solidity through mountain energy, symbolizing endurance",
    },
    modernInterpretation:
      "Choosing the right moment for action through patience",
  },
  {
    id: "gon_earth",
    korean: "곤괘 - 지",
    english: "Earth Trigram",
    concept: "Receptive Devotion",
    principle: "Supporting and nurturing growth",
    application: "Achieving through cooperation and support",
    stance: "gon",
    description: {
      korean: "땅의 기운으로 수용과 순응을 나타내며 포용력을 상징한다",
      english:
        "Represents receptivity and devotion through earth energy, symbolizing inclusiveness",
    },
    modernInterpretation:
      "Building success through collaboration and mutual support",
  },
];

// TRIGRAM_STANCES_ORDER for ordering operations
const TRIGRAM_STANCES_ORDER: readonly TrigramStance[] = [
  "geon",
  "tae",
  "li",
  "jin",
  "son",
  "gam",
  "gan",
  "gon",
] as const;

/**
 * Get philosophy for specific trigram stance
 */
export function getPhilosophyForStance(
  stance: TrigramStance
): KoreanPhilosophy {
  const philosophy = KOREAN_PHILOSOPHIES.find((p) => p.stance === stance);
  return (
    philosophy ?? {
      id: "default",
      korean: "기본 철학",
      english: "Basic Philosophy",
      concept: "Balance",
      principle: "Harmony",
      application: "Practical wisdom",
      stance: stance,
      description: {
        korean: "기본적인 무술 철학",
        english: "Basic martial philosophy",
      },
      modernInterpretation: "Fundamental principles",
    }
  );
}

/**
 * Get philosophy by elemental concept
 */
export function getPhilosophyByElement(element: string): KoreanPhilosophy {
  const philosophy = KOREAN_PHILOSOPHIES.find((p) => p.concept === element);
  return (
    philosophy ?? {
      id: "default",
      korean: "기본 철학",
      english: "Basic Philosophy",
      concept: element,
      principle: "Balance",
      application: "Practical wisdom",
      stance: "geon",
      description: {
        korean: "기본적인 무술 철학",
        english: "Basic martial philosophy",
      },
      modernInterpretation: "Fundamental principles",
    }
  );
}

/**
 * Generate tactical wisdom based on combat situation
 */
export function getStanceWisdom(
  playerStance: TrigramStance,
  opponentStance: TrigramStance
): StanceWisdom {
  if (!playerStance || !opponentStance) {
    return {
      korean: "자세를 확인하세요",
      english: "Please check your stance",
      advice: "Maintain proper form",
      category: "basic",
    };
  }

  const playerPhilosophy = getPhilosophyForStance(playerStance);
  // Fix: Use getPhilosophyForStance instead of direct find to ensure non-undefined result
  const opponentPhilosophy = getPhilosophyForStance(opponentStance);

  // Generate contextual wisdom based on stance interactions
  const wisdomMap: Record<string, StanceWisdom> = {
    [`${playerStance}_${opponentStance}`]: {
      korean: `${playerPhilosophy.korean}으로 ${opponentPhilosophy.korean}에 대응하라`,
      english: `Use ${playerPhilosophy.english} principles against ${opponentPhilosophy.english}`,
      advice: `Apply ${playerPhilosophy.application} to counter ${opponentPhilosophy.principle}`,
      category: "intermediate",
    },
  };

  return (
    wisdomMap[`${playerStance}_${opponentStance}`] || {
      korean: "균형을 유지하며 기회를 기다려라",
      english: "Maintain balance and wait for opportunity",
      advice: "Stay centered and observe your opponent",
      category: "basic",
    }
  );
}

/**
 * Generate recommended philosophies for training scenarios
 * Fix: Remove unused opponentStance parameter
 */
export function generateRecommendedPhilosophies(currentStance: TrigramStance): {
  primary: KoreanPhilosophy;
  secondary: KoreanPhilosophy;
  application: KoreanPhilosophy;
} {
  const stanceIndex = TRIGRAM_STANCES_ORDER.indexOf(currentStance);

  if (stanceIndex === -1 || KOREAN_PHILOSOPHIES.length === 0) {
    const defaultPhilosophy: KoreanPhilosophy = {
      id: "default",
      korean: "기본 철학",
      english: "Basic Philosophy",
      concept: "Balance",
      principle: "Harmony",
      application: "Practical wisdom",
      stance: currentStance,
      description: {
        korean: "기본적인 무술 철학",
        english: "Basic martial philosophy",
      },
      modernInterpretation: "Fundamental principles",
    };

    return {
      primary: defaultPhilosophy,
      secondary: defaultPhilosophy,
      application: defaultPhilosophy,
    };
  }

  const secondaryIndex = (stanceIndex + 2) % KOREAN_PHILOSOPHIES.length;
  const applicationIndex = (stanceIndex + 4) % KOREAN_PHILOSOPHIES.length;

  // Fix: Use non-null assertion since we checked array length above
  return {
    primary: KOREAN_PHILOSOPHIES[stanceIndex]!,
    secondary: KOREAN_PHILOSOPHIES[secondaryIndex]!,
    application: KOREAN_PHILOSOPHIES[applicationIndex]!,
  };
}

/**
 * Generate random philosophy for training scenarios
 */
export function generateRandomPhilosophy(): KoreanPhilosophy {
  if (KOREAN_PHILOSOPHIES.length === 0) {
    return {
      id: "default",
      korean: "기본 철학",
      english: "Basic Philosophy",
      concept: "Balance",
      principle: "Harmony",
      application: "Practical wisdom",
      stance: "geon",
      description: {
        korean: "기본적인 무술 철학",
        english: "Basic martial philosophy",
      },
      modernInterpretation: "Fundamental principles",
    };
  }

  const randomIndex = Math.floor(Math.random() * KOREAN_PHILOSOPHIES.length);
  return KOREAN_PHILOSOPHIES[randomIndex]!; // Use non-null assertion since we checked length
}

/**
 * Export all Korean philosophies for external use
 */
export function getAllPhilosophies(): readonly KoreanPhilosophy[] {
  return KOREAN_PHILOSOPHIES;
}

/**
 * Get philosophical guidance for training
 */
export function getTrainingGuidance(stance: TrigramStance): {
  korean: string;
  english: string;
  focus: string;
} {
  const philosophy = getPhilosophyForStance(stance);

  return {
    korean: `${philosophy.korean}의 정신을 수련하라`,
    english: `Cultivate the spirit of ${philosophy.english}`,
    focus: philosophy.modernInterpretation,
  };
}
