import type {
  VitalPoint,
  AnatomicalRegionIdentifier,
  VitalPointCategory,
  AnatomicalRegion,
  Position,
} from "../../types"; // Assuming types are now unified in ../../types

/**
 * Korean Martial Arts Anatomical Regions System
 * Based on traditional Korean martial arts vital point knowledge (급소술 - Geupso-sul)
 * Implements authentic pressure point locations and effects
 */

// Define vital points first
const HEAD_VITAL_POINTS = {
  baihui: {
    id: "baihui",
    name: { korean: "백회", english: "Baihui" },
    koreanName: "백회",
    region: "head" as AnatomicalRegionIdentifier,
    position: { x: 50, y: 15 },
    category: "consciousness" as VitalPointCategory,
    difficulty: 0.9,
    damageMultiplier: 2.5,
    effects: [
      {
        type: "dizziness",
        duration: 3000,
        magnitude: 0.8,
        chance: 0.7,
        source: "baihui_strike",
      },
    ],
    description: {
      korean: "정수리 중앙, 의식과 정신력을 관장하는 핵심 경혈",
      english: "Crown of the head, governs consciousness and mental power",
    },
  } as VitalPoint,

  yintang: {
    id: "yintang",
    name: { korean: "인당", english: "Yintang" },
    koreanName: "인당",
    region: "head" as AnatomicalRegionIdentifier,
    position: { x: 50, y: 35 },
    category: "consciousness" as VitalPointCategory,
    difficulty: 0.7,
    damageMultiplier: 2.0,
    effects: [
      {
        type: "disorientation",
        duration: 2000,
        magnitude: 0.6,
        chance: 0.8,
        source: "yintang_strike",
      },
    ],
    description: {
      korean: "미간 중앙, 정신 집중력과 의식을 관장",
      english: "Center of eyebrows, governs mental focus and consciousness",
    },
  } as VitalPoint,
};

const NECK_VITAL_POINTS = {
  renying: {
    id: "renying",
    name: { korean: "인영", english: "Renying" },
    koreanName: "인영",
    region: "neck" as AnatomicalRegionIdentifier,
    position: { x: 30, y: 135 },
    category: "circulation" as VitalPointCategory,
    difficulty: 0.8,
    damageMultiplier: 3.0,
    effects: [
      {
        type: "blood_flow_disruption",
        duration: 4000,
        magnitude: 0.9,
        chance: 0.9,
        source: "renying_pressure",
      },
    ],
    description: {
      korean: "목 옆쪽 경동맥 부위, 혈액 순환의 핵심 경혈",
      english: "Carotid artery area, critical for blood circulation",
    },
  } as VitalPoint,

  tiantu: {
    id: "tiantu",
    name: { korean: "천돌", english: "Tiantu" },
    koreanName: "천돌",
    region: "neck" as AnatomicalRegionIdentifier,
    position: { x: 50, y: 140 },
    category: "breathing" as VitalPointCategory,
    difficulty: 0.6,
    damageMultiplier: 2.8,
    effects: [
      {
        type: "breathing_difficulty",
        duration: 5000,
        magnitude: 0.8,
        chance: 0.85,
        source: "tiantu_strike",
      },
    ],
    description: {
      korean: "목 앞쪽 움푹 들어간 곳, 호흡과 발성을 관장",
      english: "Throat hollow, governs breathing and speech",
    },
  } as VitalPoint,
};

const TORSO_VITAL_POINTS = {
  tanzhong: {
    id: "tanzhong",
    name: { korean: "단중", english: "Tanzhong" },
    koreanName: "단중",
    region: "torso" as AnatomicalRegionIdentifier,
    position: { x: 50, y: 200 },
    category: "breathing" as VitalPointCategory,
    difficulty: 0.5,
    damageMultiplier: 1.8,
    effects: [
      {
        type: "breath_disruption",
        duration: 4000,
        magnitude: 0.7,
        chance: 0.8,
        source: "tanzhong_impact",
      },
    ],
    description: {
      korean: "가슴 중앙, 호흡과 심장 기능을 관장하는 중요 경혈",
      english: "Center of chest, governs breathing and heart function",
    },
  } as VitalPoint,

  qihai: {
    id: "qihai",
    name: { korean: "기해", english: "Qihai" },
    koreanName: "기해",
    region: "torso" as AnatomicalRegionIdentifier,
    position: { x: 50, y: 250 },
    category: "energy" as VitalPointCategory,
    difficulty: 0.4,
    damageMultiplier: 1.5,
    effects: [
      {
        type: "energy_depletion",
        duration: 6000,
        magnitude: 0.8,
        chance: 0.7,
        source: "qihai_disruption",
      },
    ],
    description: {
      korean: "배꼽 아래 단전, 기운과 체력의 근원지",
      english: "Below navel dantian, source of energy and vitality",
    },
  } as VitalPoint,

  zhongwan: {
    id: "zhongwan",
    name: { korean: "중완", english: "Zhongwan" },
    koreanName: "중완",
    region: "torso" as AnatomicalRegionIdentifier,
    position: { x: 50, y: 230 },
    category: "breathing" as VitalPointCategory,
    difficulty: 0.3,
    damageMultiplier: 1.4,
    effects: [
      {
        type: "nausea",
        duration: 5000,
        magnitude: 0.7,
        chance: 0.8,
        source: "zhongwan_pressure",
      },
    ],
    description: {
      korean: "명치 부위, 소화와 호흡의 조절점",
      english: "Solar plexus area, regulates digestion and breathing",
    },
  } as VitalPoint,
};

const LEG_VITAL_POINTS = {
  zusanli: {
    id: "zusanli",
    name: { korean: "족삼리", english: "Zusanli" },
    koreanName: "족삼리",
    region: "legs" as AnatomicalRegionIdentifier,
    position: { x: 25, y: 450 },
    category: "energy" as VitalPointCategory,
    difficulty: 0.6,
    damageMultiplier: 1.3,
    effects: [
      {
        type: "leg_weakness",
        duration: 4000,
        magnitude: 0.6,
        chance: 0.7,
        source: "zusanli_strike",
      },
    ],
    description: {
      korean: "무릎 아래 바깥쪽, 다리 힘과 체력을 관장",
      english: "Below knee outside, governs leg strength and stamina",
    },
  } as VitalPoint,

  yongquan: {
    id: "yongquan",
    name: { korean: "용천", english: "Yongquan" },
    koreanName: "용천",
    region: "legs" as AnatomicalRegionIdentifier,
    position: { x: 50, y: 680 },
    category: "balance" as VitalPointCategory,
    difficulty: 0.8,
    damageMultiplier: 1.6,
    effects: [
      {
        type: "balance_loss",
        duration: 3000,
        magnitude: 0.8,
        chance: 0.8,
        source: "yongquan_pressure",
      },
    ],
    description: {
      korean: "발바닥 중앙, 균형과 대지 기운을 관장",
      english: "Center of sole, governs balance and earth energy",
    },
  } as VitalPoint,
};

// Now define anatomical regions
export const KOREAN_ANATOMICAL_REGIONS: Record<
  AnatomicalRegionIdentifier,
  AnatomicalRegion
> = {
  head: {
    id: "head",
    name: { korean: "머리", english: "Head" },
    bounds: {
      top: 0,
      bottom: 120,
      left: 0,
      right: 100,
      x: 0,
      y: 0,
      width: 100,
      height: 120,
    },
    vitalPoints: [HEAD_VITAL_POINTS.baihui, HEAD_VITAL_POINTS.yintang],
    vulnerability: 1.5,
    traditionalName: "두부",
  },

  neck: {
    id: "neck",
    name: { korean: "목", english: "Neck" },
    bounds: {
      top: 120,
      bottom: 160,
      left: 20,
      right: 80,
      x: 20,
      y: 120,
      width: 60,
      height: 40,
    },
    vitalPoints: [NECK_VITAL_POINTS.renying, NECK_VITAL_POINTS.tiantu],
    vulnerability: 2.0,
    traditionalName: "경부",
  },

  torso: {
    id: "torso",
    name: { korean: "몸통", english: "Torso" },
    bounds: {
      top: 160,
      bottom: 300,
      left: 0,
      right: 100,
      x: 0,
      y: 160,
      width: 100,
      height: 140,
    },
    vitalPoints: [
      TORSO_VITAL_POINTS.tanzhong,
      TORSO_VITAL_POINTS.qihai,
      TORSO_VITAL_POINTS.zhongwan,
    ],
    vulnerability: 1.2,
    traditionalName: "흉복부",
  },

  arms: {
    id: "arms",
    name: { korean: "팔", english: "Arms" },
    bounds: {
      top: 300,
      bottom: 420,
      left: 10,
      right: 90,
      x: 10,
      y: 300,
      width: 80,
      height: 120,
    },
    vitalPoints: [],
    vulnerability: 0.8,
    traditionalName: "상지",
  },

  chest: {
    id: "chest",
    name: { korean: "가슴", english: "Chest" },
    bounds: {
      top: 160,
      bottom: 360,
      left: -40,
      right: 140,
      x: -40,
      y: 160,
      width: 180,
      height: 200,
    },
    vitalPoints: [],
    vulnerability: 1.3,
    traditionalName: "흉부",
  },

  legs: {
    id: "legs",
    name: { korean: "다리", english: "Legs" },
    bounds: {
      top: 420,
      bottom: 700,
      left: 0,
      right: 100,
      x: 0,
      y: 420,
      width: 100,
      height: 280,
    },
    vitalPoints: [LEG_VITAL_POINTS.zusanli, LEG_VITAL_POINTS.yongquan],
    vulnerability: 0.9,
    traditionalName: "하지",
  },
};

// Combine all vital points
const ALL_VITAL_POINTS = {
  ...HEAD_VITAL_POINTS,
  ...NECK_VITAL_POINTS,
  ...TORSO_VITAL_POINTS,
  ...LEG_VITAL_POINTS,
};

export function getVitalPointsByRegion(
  regionId: AnatomicalRegionIdentifier
): readonly VitalPoint[] {
  return Object.values(ALL_VITAL_POINTS).filter(
    (point): point is VitalPoint => point.region === regionId
  );
}

export function getVitalPointsByCategory(
  category: VitalPointCategory
): readonly VitalPoint[] {
  return Object.values(ALL_VITAL_POINTS).filter(
    (point): point is VitalPoint => point.category === category
  );
}

export function isPositionInRegion(
  position: Position,
  bounds: AnatomicalRegion["bounds"]
): boolean {
  if (
    bounds.x !== undefined &&
    bounds.y !== undefined &&
    bounds.width !== undefined &&
    bounds.height !== undefined
  ) {
    return (
      position.x >= bounds.x &&
      position.x <= bounds.x + bounds.width &&
      position.y >= bounds.y &&
      position.y <= bounds.y + bounds.height
    );
  }

  return (
    position.x >= bounds.left &&
    position.x <= bounds.right &&
    position.y >= bounds.top &&
    position.y <= bounds.bottom
  );
}

export function findNearestVitalPoint(position: Position): VitalPoint | null {
  let closestPoint: VitalPoint | null = null;
  let shortestDistance = Infinity;

  Object.values(ALL_VITAL_POINTS).forEach((point) => {
    const distance = Math.sqrt(
      Math.pow(position.x - point.position.x, 2) +
        Math.pow(position.y - point.position.y, 2)
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      closestPoint = point;
    }
  });

  return closestPoint;
}

export const ANATOMICAL_REGIONS_DATA = {
  HEAD_VITAL_POINTS,
  NECK_VITAL_POINTS,
};

// Add missing functions
export function getClosestVitalPoint(
  position: { x: number; y: number },
  tolerance: number
): VitalPoint | null {
  const allPoints = [
    ...Object.values(HEAD_VITAL_POINTS),
    ...Object.values(NECK_VITAL_POINTS),
  ];

  for (const point of allPoints) {
    const distance = Math.sqrt(
      Math.pow(point.position.x - position.x, 2) +
        Math.pow(point.position.y - position.y, 2)
    );

    if (distance <= tolerance) {
      return point;
    }
  }

  return null;
}

export function calculateVitalPointDamage(
  vitalPoint: VitalPoint,
  baseDamage: number,
  accuracy: number
): number {
  return Math.round(baseDamage * vitalPoint.damageMultiplier * accuracy);
}

// Export types for use in other files
// These are now imported from types/index.ts, so local export is not needed.
// export type { VitalPoint, AnatomicalRegion, VitalPointCategory };
