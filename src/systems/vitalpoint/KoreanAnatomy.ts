import type {
  EnergyMeridian,
  ElementalRelations,
  KoreanAnatomicalZone,
  StatusEffect,
  VitalPoint,
} from "../../types";

/**
 * Korean Martial Arts Anatomy System
 * Traditional Korean medical knowledge applied to vital point targeting
 * Based on TCM meridian theory and Korean martial arts philosophy
 */

export const KOREAN_MERIDIANS: Record<string, EnergyMeridian> = {
  lungMeridian: {
    id: "lung",
    korean: "수태음폐경",
    english: "Lung Meridian",
    element: "metal",
    points: [
      "zhongfu",
      "yunmen",
      "tianfu",
      "xiabai",
      "chize",
      "kongzui",
      "lieque",
      "jingqu",
      "taiyuan",
      "yuji",
      "shaoshang",
    ],
    startPoint: { x: 20, y: 180 },
    endPoint: { x: 15, y: 250 },
  },

  largeIntestineMeridian: {
    id: "large_intestine",
    korean: "수양명대장경",
    english: "Large Intestine Meridian",
    element: "metal",
    points: [
      "shangyang",
      "erjian",
      "sanjian",
      "hegu",
      "yangxi",
      "pianli",
      "wenliu",
      "xialian",
      "shanglian",
      "shousanli",
    ],
    startPoint: { x: 15, y: 250 },
    endPoint: { x: 75, y: 30 },
  },

  stomachMeridian: {
    id: "stomach",
    korean: "족양명위경",
    english: "Stomach Meridian",
    element: "earth",
    points: [
      "chengqi",
      "sibai",
      "juliao",
      "dicang",
      "daying",
      "jiache",
      "xiaguan",
      "touwei",
      "renying",
      "shuitu",
    ],
    startPoint: { x: 45, y: 25 },
    endPoint: { x: 35, y: 600 },
  },

  spleenMeridian: {
    id: "spleen",
    korean: "족태음비경",
    english: "Spleen Meridian",
    element: "earth",
    points: [
      "yinbai",
      "dadu",
      "taibai",
      "gongsun",
      "shangqiu",
      "sanyinjiao",
      "lougu",
      "diji",
      "yinlingquan",
      "xuehai",
    ],
    startPoint: { x: 55, y: 600 },
    endPoint: { x: 40, y: 170 },
  },

  heartMeridian: {
    id: "heart",
    korean: "수소음심경",
    english: "Heart Meridian",
    element: "fire",
    points: [
      "jiquan",
      "qingling",
      "shaohai",
      "lingdao",
      "tongli",
      "yinxi",
      "shenmen",
      "shaofu",
      "shaochong",
    ],
    startPoint: { x: 30, y: 180 },
    endPoint: { x: 12, y: 250 },
  },

  smallIntestineMeridian: {
    id: "small_intestine",
    korean: "수태양소장경",
    english: "Small Intestine Meridian",
    element: "fire",
    points: [
      "shaoze",
      "qiangu",
      "houxi",
      "wangu",
      "yanggu",
      "yanglao",
      "zhizheng",
      "xiaohai",
      "jianzhen",
      "naoshu",
    ],
    startPoint: { x: 12, y: 250 },
    endPoint: { x: 40, y: 30 },
  },

  bladderMeridian: {
    id: "bladder",
    korean: "족태양방광경",
    english: "Bladder Meridian",
    element: "water",
    points: [
      "jingming",
      "cuanzhu",
      "meichong",
      "quchai",
      "wuchu",
      "chengguang",
      "tongtian",
      "luoque",
      "yuzhen",
      "tianzhu",
    ],
    startPoint: { x: 52, y: 25 },
    endPoint: { x: 45, y: 650 },
  },

  kidneyMeridian: {
    id: "kidney",
    korean: "족소음신경",
    english: "Kidney Meridian",
    element: "water",
    points: [
      "yongquan",
      "rangu",
      "taixi",
      "dazhong",
      "shuiquan",
      "zhaohai",
      "fuliu",
      "jiaoxin",
      "zhubin",
      "yingu",
    ],
    startPoint: { x: 50, y: 650 },
    endPoint: { x: 45, y: 170 },
  },
};

export const ELEMENTAL_RELATIONS: Record<string, ElementalRelations> = {
  wood: {
    strengthens: "fire",
    weakens: "earth",
    strengthenedBy: "water",
    weakenedBy: "metal",
    element: "wood",
  },

  fire: {
    strengthens: "earth",
    weakens: "metal",
    strengthenedBy: "wood",
    weakenedBy: "water",
    element: "fire",
  },

  earth: {
    strengthens: "metal",
    weakens: "water",
    strengthenedBy: "fire",
    weakenedBy: "wood",
    element: "earth",
  },

  metal: {
    strengthens: "water",
    weakens: "wood",
    strengthenedBy: "earth",
    weakenedBy: "fire",
    element: "metal",
  },

  water: {
    strengthens: "wood",
    weakens: "fire",
    strengthenedBy: "metal",
    weakenedBy: "earth",
    element: "water",
  },
};

// Korean anatomical zones for precise targeting
export const ANATOMICAL_ZONES: Record<string, KoreanAnatomicalZone> = {
  upper_torso: {
    id: "upper_torso",
    korean: "상체",
    english: "Upper Torso",
    boundaries: { top: 120, bottom: 300, left: 10, right: 90 },
    vulnerability: 1.6,
    meridians: ["lung", "heart", "large_intestine"],
    vitalPoints: ["tanzhong", "yunmen", "jiquan"], // Keep as string IDs
    traditionalImportance: 0.9,
    description: "Critical region housing heart and lung vital points",
  },

  lower_torso: {
    id: "lower_torso",
    korean: "하체",
    english: "Lower Torso",
    boundaries: { top: 300, bottom: 450, left: 15, right: 85 },
    vulnerability: 1.4,
    meridians: ["stomach", "spleen", "kidney"],
    vitalPoints: ["qihai", "guanyuan", "zhongwan"],
    traditionalImportance: 0.8,
    description: "Energy center containing dan tian and digestive organs",
  },

  head_neck: {
    id: "head_neck",
    korean: "두경부",
    english: "Head and Neck",
    boundaries: { top: 0, bottom: 150, left: 20, right: 80 },
    vulnerability: 2.0,
    meridians: ["bladder", "gallbladder", "governing_vessel"],
    vitalPoints: ["baihui", "yintang", "fengchi"],
    traditionalImportance: 1.0,
    description: "Most vulnerable region with consciousness-affecting points",
  },

  arms: {
    id: "arms",
    korean: "상지",
    english: "Upper Limbs",
    boundaries: { top: 120, bottom: 400, left: -30, right: 130 },
    vulnerability: 1.0,
    meridians: ["lung", "large_intestine", "heart", "small_intestine"],
    vitalPoints: ["hegu", "quchi", "shenmen"],
    traditionalImportance: 0.6,
    description: "Extremity points for joint locks and nerve strikes",
  },

  legs: {
    id: "legs",
    korean: "하지",
    english: "Lower Limbs",
    boundaries: { top: 400, bottom: 700, left: 10, right: 90 },
    vulnerability: 0.8,
    meridians: ["stomach", "spleen", "bladder", "kidney"],
    vitalPoints: ["zusanli", "sanyinjiao", "yongquan"],
    traditionalImportance: 0.7,
    description: "Foundation points affecting stability and mobility",
  },
};

/**
 * Get meridian information by ID
 */
export function getMeridian(meridianId: string): EnergyMeridian | null {
  return KOREAN_MERIDIANS[meridianId] || null;
}

/**
 * Get all meridians associated with a specific element
 */
export function getMeridiansByElement(
  element: string
): readonly EnergyMeridian[] {
  return Object.values(KOREAN_MERIDIANS).filter(
    (meridian) => meridian.element === element
  );
}

/**
 * Calculate meridian flow effectiveness based on time of day
 * Traditional Korean medicine considers meridian peak hours
 */
export function calculateMeridianFlow(
  meridianId: string,
  hour: number
): number {
  const meridianPeakHours: Record<string, number> = {
    lung: 4, // 3-5 AM
    large_intestine: 6, // 5-7 AM
    stomach: 8, // 7-9 AM
    spleen: 10, // 9-11 AM
    heart: 12, // 11 AM-1 PM
    small_intestine: 14, // 1-3 PM
    bladder: 16, // 3-5 PM
    kidney: 18, // 5-7 PM
  };

  const peakHour = meridianPeakHours[meridianId] || 12;
  const hourDifference = Math.abs(hour - peakHour);
  const effectivenessReduction = Math.min(hourDifference / 12, 0.3);

  return Math.max(0.7, 1.0 - effectivenessReduction);
}

/**
 * Find optimal vital points based on elemental relationships
 */
export function findOptimalVitalPoints(
  attackerElement: string
): readonly VitalPoint[] {
  const elementalRelation = ELEMENTAL_RELATIONS[attackerElement];
  if (!elementalRelation) return [];

  const optimalPoints: VitalPoint[] = [];

  // Find points that exploit elemental weaknesses
  Object.values(ANATOMICAL_ZONES).forEach(() => {
    // Implementation for finding optimal points
    // This logic would iterate through vital points and check their properties
    // against elementalRelation to find optimal attack targets
  });

  return optimalPoints;
}

/**
 * Calculate anatomical vulnerability based on position and meridian flow
 */
export function calculateAnatomicalVulnerability(
  position: { x: number; y: number },
  meridianStates: Record<string, number>
): number {
  let totalVulnerability = 1.0;

  // Check which anatomical zone the position falls into
  for (const zone of Object.values(ANATOMICAL_ZONES)) {
    if (isPositionInZone(position, zone)) {
      totalVulnerability *= zone.vulnerability;

      // Factor in meridian flow states
      zone.meridians.forEach((meridianId) => {
        const meridianState = meridianStates[meridianId] || 1.0;
        totalVulnerability *= meridianState;
      });

      break;
    }
  }

  return Math.max(0.5, Math.min(3.0, totalVulnerability));
}

/**
 * Check if position is within anatomical zone
 */
function isPositionInZone(
  position: { x: number; y: number },
  zone: KoreanAnatomicalZone
): boolean {
  const { boundaries } = zone;
  return (
    position.x >= boundaries.left &&
    position.x <= boundaries.right &&
    position.y >= boundaries.top &&
    position.y <= boundaries.bottom
  );
}

/**
 * Generate status effects based on meridian disruption
 */
export function generateMeridianEffects(
  meridianId: string, // Fix implicit any type
  disruptionLevel: number
): readonly StatusEffect[] {
  // Returns imported StatusEffect
  const meridian = KOREAN_MERIDIANS[meridianId];
  if (!meridian) return [];

  const effects: StatusEffect[] = []; // Uses imported StatusEffect
  const intensity = Math.min(1.0, disruptionLevel); // intensity is used here, but StatusEffect uses magnitude
  const baseDuration = 3000;

  // Element-specific effects
  // These need to use 'magnitude' instead of 'intensity'
  switch (meridian.element) {
    case "metal":
      if (disruptionLevel > 0.5) {
        effects.push({
          type: "stamina_drain",
          duration: baseDuration * intensity,
          magnitude: intensity * 0.6, // Changed from intensity
          source: "meridian_disruption",
        });
      }
      break;

    case "water":
      if (disruptionLevel > 0.4) {
        effects.push({
          type: "vital_weakness",
          duration: baseDuration * intensity,
          magnitude: intensity * 0.7, // Changed from intensity
          source: "meridian_disruption",
        });
      }
      break;

    case "fire":
      if (disruptionLevel > 0.6) {
        effects.push({
          type: "vital_stunning",
          duration: baseDuration * intensity * 0.5,
          magnitude: intensity * 0.8, // Changed from intensity
          source: "meridian_disruption",
        });
      }
      break;

    case "earth":
      if (disruptionLevel > 0.3) {
        effects.push({
          type: "damage_vulnerability",
          duration: baseDuration * intensity,
          magnitude: intensity * 0.5, // Changed from intensity
          source: "meridian_disruption",
        });
      }
      break;

    case "wood":
      if (disruptionLevel > 0.4) {
        effects.push({
          type: "vital_paralysis",
          duration: baseDuration * intensity * 0.7,
          magnitude: intensity * 0.6, // Changed from intensity
          source: "meridian_disruption",
        });
      }
      break;
  }

  return effects;
}

/**
 * Get all anatomical zones
 */
export function getAnatomicalZones(): Record<string, KoreanAnatomicalZone> {
  return { ...ANATOMICAL_ZONES };
}

/**
 * Get zone by position
 */
export function getZoneByPosition(position: {
  x: number;
  y: number;
}): KoreanAnatomicalZone | null {
  for (const zone of Object.values(ANATOMICAL_ZONES)) {
    if (isPositionInZone(position, zone)) {
      return zone;
    }
  }
  return null;
}
