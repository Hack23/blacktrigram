import {
  TrigramStance,
  VitalPointCategory,
  VitalPointEffectType,
  VitalPointSeverity,
} from "@/types";
import type { KoreanText, Position } from "../../types/common";
import { EffectIntensity } from "../effects";
import { StatusEffect } from "../types";
import { AnatomicalRegion, VitalPoint, VitalPointEffect } from "./types";
import { getVitalPointsForMeridian } from "./MeridianVitalPointMapping";

/**
 * Korean Martial Arts Anatomy System
 * Traditional Korean medical knowledge applied to vital point targeting
 * Based on TCM meridian theory and Korean martial arts philosophy
 */

// Enhanced energy meridian for Korean martial arts Ki flow
export interface EnergyMeridian {
  readonly id: string;
  readonly koreanName: string;
  readonly chineseName: string;
  readonly englishName: string;
  readonly element: string;
  readonly direction: "ascending" | "descending" | "bilateral";
  readonly points: readonly string[]; // Vital point IDs along this meridian
  readonly kiFlow: number; // Energy flow rate (0-100)
  readonly description: {
    readonly korean: string;
    readonly english: string;
  };
  // Add missing properties for meridian effects
  readonly effectType?: string;
  readonly duration?: number;
  readonly intensity?: number;
  readonly relatedVitalPoints: readonly string[]; // Add missing property
}

interface ElementalRelationDetail {
  [element: string]: string; // e.g. fire: "화재" (Fire produces Ash/Earth)
}
interface ElementalRelations {
  producing: ElementalRelationDetail;
  controlling: ElementalRelationDetail;
  // element property was redundant here, it's the key in the main record
}

interface KoreanAnatomicalZone {
  id: string;
  koreanName: string; // Plain string
  englishName: string; // Plain string
  vitalPoints: string[]; // IDs of VitalPoints in this zone
  meridians: string[]; // IDs of EnergyMeridians passing through
  description: KoreanText; // Object { korean, english }
  vulnerabilityNotes?: KoreanText;
  boundaries: { top: number; bottom: number; left: number; right: number }; // Added
  vulnerability: number; // Added
  traditionalImportance: number; // Added
}

export const KOREAN_ANATOMICAL_ZONES_ARRAY: readonly KoreanAnatomicalZone[] = [
  // Renamed to avoid conflict if used as map key
  {
    id: "upper_torso",
    koreanName: "상체",
    englishName: "Upper Torso",
    boundaries: { top: 120, bottom: 300, left: 10, right: 90 },
    vulnerability: 1.6,
    meridians: ["lung", "heart", "large_intestine"],
    vitalPoints: ["tanzhong", "yunmen", "jiquan"],
    traditionalImportance: 0.9,
    description: {
      korean: "심장과 폐의 중요 혈자리가 위치한 치명적인 부위입니다.",
      english: "Critical region housing heart and lung vital points",
    },
  },
  {
    id: "lower_torso",
    koreanName: "하체",
    englishName: "Lower Torso",
    boundaries: { top: 300, bottom: 450, left: 15, right: 85 },
    vulnerability: 1.4,
    meridians: ["stomach", "spleen", "kidney"],
    vitalPoints: ["qihai", "guanyuan", "zhongwan"],
    traditionalImportance: 0.8,
    description: {
      korean: "단전과 소화기관이 포함된 에너지 중심부입니다.",
      english: "Energy center containing dan tian and digestive organs",
    },
  },
  {
    id: "head_neck",
    koreanName: "두경부",
    englishName: "Head and Neck",
    boundaries: { top: 0, bottom: 150, left: 20, right: 80 },
    vulnerability: 2.0,
    meridians: ["bladder", "gallbladder", "governing_vessel"],
    vitalPoints: ["baihui", "yintang", "fengchi"],
    traditionalImportance: 1.0,
    description: {
      korean: "의식에 영향을 미치는 중요 혈자리가 있는 가장 취약한 부위입니다.",
      english: "Most vulnerable region with consciousness-affecting points",
    },
  },
  {
    id: "arms",
    koreanName: "상지",
    englishName: "Upper Limbs",
    boundaries: { top: 120, bottom: 400, left: -30, right: 130 },
    vulnerability: 1.0,
    meridians: ["lung", "large_intestine", "heart", "small_intestine"],
    vitalPoints: ["hegu", "quchi", "shenmen"],
    traditionalImportance: 0.6,
    description: {
      korean: "관절 잠금 및 신경 타격에 사용되는 팔다리 끝 혈자리입니다.",
      english: "Extremity points for joint locks and nerve strikes",
    },
  },
  {
    id: "legs",
    koreanName: "하지",
    englishName: "Lower Limbs",
    boundaries: { top: 400, bottom: 700, left: 10, right: 90 },
    vulnerability: 0.8,
    meridians: ["stomach", "spleen", "bladder", "kidney"],
    vitalPoints: ["zusanli", "sanyinjiao", "yongquan"],
    traditionalImportance: 0.7,
    description: {
      korean: "안정성과 이동성에 영향을 미치는 기초 혈자리입니다.",
      english: "Foundation points affecting stability and mobility",
    },
  },
];

// Convert array to Record for easier lookup by ID
export const KOREAN_ANATOMICAL_ZONES: Record<string, KoreanAnatomicalZone> =
  KOREAN_ANATOMICAL_ZONES_ARRAY.reduce((acc, zone) => {
    acc[zone.id] = zone;
    return acc;
  }, {} as Record<string, KoreanAnatomicalZone>);

/**
 * Get the list of vital points related to a meridian
 * This function dynamically retrieves vital points from the mapping system
 */
function getRelatedVitalPoints(meridianId: string): readonly string[] {
  return getVitalPointsForMeridian(meridianId);
}

export const ENERGY_MERIDIANS_ARRAY: readonly EnergyMeridian[] = [
  // Renamed
  {
    id: "lung",
    koreanName: "수태음폐경",
    chineseName: "手太陰肺經",
    englishName: "Lung Meridian",
    element: "metal",
    direction: "descending",
    points: ["LU1", "LU5", "LU9", "LU11"],
    kiFlow: 85,
    description: {
      korean: "호흡과 기 순환을 담당하는 경락",
      english: "Meridian governing breathing and Ki circulation",
    },
    relatedVitalPoints: getRelatedVitalPoints("lung"),
  },
  {
    id: "large_intestine",
    koreanName: "수양명대장경",
    chineseName: "手陽明大腸經",
    englishName: "Large Intestine Meridian",
    element: "metal",
    direction: "ascending",
    points: ["LI4", "LI11", "LI15", "LI20"],
    kiFlow: 75,
    description: {
      korean: "배설과 정화를 담당하는 경락",
      english: "Meridian governing elimination and purification",
    },
    relatedVitalPoints: getRelatedVitalPoints("large_intestine"),
  },
  {
    id: "stomach",
    koreanName: "족양명위경",
    chineseName: "足陽明胃經",
    englishName: "Stomach Meridian",
    element: "earth",
    direction: "descending",
    points: ["ST3", "ST9", "ST25", "ST36"],
    kiFlow: 90,
    description: {
      korean: "소화와 영양 흡수를 담당하는 경락",
      english: "Meridian governing digestion and nutrient absorption",
    },
    relatedVitalPoints: getRelatedVitalPoints("stomach"),
  },
  {
    id: "spleen",
    koreanName: "족태음비경",
    chineseName: "足太陰脾經",
    englishName: "Spleen Meridian",
    element: "earth",
    direction: "ascending",
    points: ["SP3", "SP6", "SP10", "SP21"],
    kiFlow: 80,
    description: {
      korean: "혈액 생성과 면역을 담당하는 경락",
      english: "Meridian governing blood formation and immunity",
    },
    relatedVitalPoints: getRelatedVitalPoints("spleen"),
  },
  {
    id: "heart",
    koreanName: "수소음심경",
    chineseName: "手少陰心經",
    englishName: "Heart Meridian",
    element: "fire",
    direction: "descending",
    points: ["HE3", "HE5", "HE7", "HE9"],
    kiFlow: 95,
    description: {
      korean: "순환과 정신을 담당하는 경락",
      english: "Meridian governing circulation and mental activity",
    },
    relatedVitalPoints: getRelatedVitalPoints("heart"),
  },
  {
    id: "small_intestine",
    koreanName: "수태양소장경",
    chineseName: "手太陽小腸經",
    englishName: "Small Intestine Meridian",
    element: "fire",
    direction: "ascending",
    points: ["SI3", "SI8", "SI11", "SI19"],
    kiFlow: 70,
    description: {
      korean: "영양분 흡수와 분별을 담당하는 경락",
      english: "Meridian governing nutrient absorption and discernment",
    },
    relatedVitalPoints: getRelatedVitalPoints("small_intestine"),
  },
  {
    id: "bladder",
    koreanName: "족태양방광경",
    chineseName: "足太陽膀胱經",
    englishName: "Bladder Meridian",
    element: "water",
    direction: "descending",
    points: ["BL2", "BL10", "BL23", "BL67"],
    kiFlow: 85,
    description: {
      korean: "배설과 정화를 담당하는 경락",
      english: "Meridian governing excretion and purification",
    },
    relatedVitalPoints: getRelatedVitalPoints("bladder"),
  },
  {
    id: "kidney",
    koreanName: "족소음신경",
    chineseName: "足少陰腎經",
    englishName: "Kidney Meridian",
    element: "water",
    direction: "ascending",
    points: ["KI1", "KI3", "KI7", "KI27"],
    kiFlow: 100,
    description: {
      korean: "생명력과 정기를 담당하는 경락",
      english: "Meridian governing vital essence and life force",
    },
    relatedVitalPoints: getRelatedVitalPoints("kidney"),
  },
  {
    id: "pericardium",
    koreanName: "수궐음심포경",
    chineseName: "手厥陰心包經",
    englishName: "Pericardium Meridian",
    element: "fire",
    direction: "descending",
    points: ["PC1", "PC3", "PC6", "PC9"],
    kiFlow: 90,
    description: {
      korean: "심장 보호와 정서 안정을 담당하는 경락",
      english: "Meridian governing heart protection and emotional stability",
    },
    relatedVitalPoints: getRelatedVitalPoints("pericardium"),
  },
  {
    id: "triple_burner",
    koreanName: "수소양삼초경",
    chineseName: "手少陽三焦經",
    englishName: "Triple Burner Meridian",
    element: "fire",
    direction: "ascending",
    points: ["TB1", "TB5", "TB10", "TB23"],
    kiFlow: 75,
    description: {
      korean: "체온 조절과 에너지 분배를 담당하는 경락",
      english: "Meridian governing temperature regulation and energy distribution",
    },
    relatedVitalPoints: getRelatedVitalPoints("triple_burner"),
  },
  {
    id: "gallbladder",
    koreanName: "족소양담경",
    chineseName: "足少陽膽經",
    englishName: "Gallbladder Meridian",
    element: "wood",
    direction: "descending",
    points: ["GB1", "GB20", "GB21", "GB34"],
    kiFlow: 85,
    description: {
      korean: "결단력과 용기를 담당하는 경락",
      english: "Meridian governing decisiveness and courage",
    },
    relatedVitalPoints: getRelatedVitalPoints("gallbladder"),
  },
  {
    id: "liver",
    koreanName: "족궐음간경",
    chineseName: "足厥陰肝經",
    englishName: "Liver Meridian",
    element: "wood",
    direction: "ascending",
    points: ["LV1", "LV3", "LV8", "LV14"],
    kiFlow: 95,
    description: {
      korean: "혈액 저장과 정서 조절을 담당하는 경락",
      english: "Meridian governing blood storage and emotional regulation",
    },
    relatedVitalPoints: getRelatedVitalPoints("liver"),
  },
];

export const ENERGY_MERIDIANS: Record<string, EnergyMeridian> =
  ENERGY_MERIDIANS_ARRAY.reduce((acc, meridian) => {
    acc[meridian.id] = meridian;
    return acc;
  }, {} as Record<string, EnergyMeridian>);

/**
 * Five Elements (五行 - Wu Xing) relationships for Korean martial arts
 * 
 * Traditional Korean medicine uses the Five Elements theory (오행) to
 * understand energy relationships between meridians and vital points.
 * 
 * **Korean**: 오행 관계 (목화토금수)
 * 
 * Elements and their relationships:
 * - 木 (Wood/목) → 火 (Fire/화): Wood feeds Fire (木生火)
 * - 火 (Fire/화) → 土 (Earth/토): Fire creates Earth (火生土)
 * - 土 (Earth/토) → 金 (Metal/금): Earth bears Metal (土生金)
 * - 金 (Metal/금) → 水 (Water/수): Metal collects Water (金生水)
 * - 水 (Water/수) → 木 (Wood/목): Water nourishes Wood (水生木)
 * 
 * Controlling cycle (상극):
 * - 木 (Wood/목) → 土 (Earth/토): Wood penetrates Earth (木克土)
 * - 土 (Earth/토) → 水 (Water/수): Earth dams Water (土克水)
 * - 水 (Water/수) → 火 (Fire/화): Water extinguishes Fire (水克火)
 * - 火 (Fire/화) → 金 (Metal/금): Fire melts Metal (火克金)
 * - 金 (Metal/금) → 木 (Wood/목): Metal chops Wood (金克木)
 */
export const ELEMENTAL_RELATIONS: Record<string, ElementalRelations> = {
  wood: {
    producing: { fire: "목생화 (Wood creates Fire)" },
    controlling: { earth: "목극토 (Wood controls Earth)" },
  },
  fire: {
    producing: { earth: "화생토 (Fire creates Earth/Ash)" },
    controlling: { metal: "화극금 (Fire controls Metal)" },
  },
  earth: {
    producing: { metal: "토생금 (Earth creates Metal)" },
    controlling: { water: "토극수 (Earth controls Water)" },
  },
  metal: {
    producing: { water: "금생수 (Metal creates Water)" },
    controlling: { wood: "금극목 (Metal controls Wood)" },
  },
  water: {
    producing: { wood: "수생목 (Water creates Wood)" },
    controlling: { fire: "수극화 (Water controls Fire)" },
  },
};

/**
 * Get meridian information by ID
 */
export function getMeridian(meridianId: string): EnergyMeridian | null {
  return ENERGY_MERIDIANS[meridianId] || null;
}

/**
 * Get all meridians associated with a specific element
 */
export function getMeridiansByElement(
  element: string
): readonly EnergyMeridian[] {
  return Object.values(ENERGY_MERIDIANS).filter(
    (meridian) => meridian.element === element
  );
}

/**
 * Calculate meridian flow effectiveness based on time of day
 * Traditional Korean medicine considers meridian peak hours
 */
/**
 * Default peak hour for meridians without a specific entry (午時 - noon)
 */
const DEFAULT_PEAK_HOUR = 12;

/**
 * Calculate meridian flow effectiveness based on time of day (子午流注)
 * 
 * Traditional Korean medicine considers meridian peak hours based on
 * the traditional Chinese Medicine (TCM) circadian clock. Each meridian
 * has a 2-hour peak period during which strikes are most effective.
 * 
 * **Korean**: 자오유주 시간대별 경락 유효성 계산
 * 
 * @param meridianId - ID of the meridian to calculate flow for
 * @param hour - Hour of day (0-23)
 * @returns Flow effectiveness multiplier (0.7-1.3), with 1.3 at peak hours
 * 
 * @example
 * ```typescript
 * // Lung meridian is most effective at 3-5 AM
 * const morningFlow = calculateMeridianFlow("lung", 4); // Returns ~1.3
 * const eveningFlow = calculateMeridianFlow("lung", 18); // Returns ~0.7
 * ```
 */
export function calculateMeridianFlow(
  meridianId: string,
  hour: number
): number {
  // Traditional 12 meridian circadian clock (자오유주)
  const meridianPeakHours: Record<string, number> = {
    lung: 4, // 3-5 AM (寅時)
    large_intestine: 6, // 5-7 AM (卯時)
    stomach: 8, // 7-9 AM (辰時)
    spleen: 10, // 9-11 AM (巳時)
    heart: 12, // 11 AM-1 PM (午時)
    small_intestine: 14, // 1-3 PM (未時)
    bladder: 16, // 3-5 PM (申時)
    kidney: 18, // 5-7 PM (酉時)
    pericardium: 20, // 7-9 PM (戌時)
    triple_burner: 22, // 9-11 PM (亥時)
    gallbladder: 0, // 11 PM-1 AM (子時)
    liver: 2, // 1-3 AM (丑時)
  };

  const peakHour = meridianPeakHours[meridianId] ?? DEFAULT_PEAK_HOUR;
  
  // Calculate hour difference (handle wrapping around midnight)
  let hourDifference = Math.abs(hour - peakHour);
  if (hourDifference > 12) {
    hourDifference = 24 - hourDifference;
  }
  
  // At peak hour (±1 hour): +30% effectiveness (1.3x multiplier)
  // At 6 hours away: neutral (1.0x multiplier)
  // At 12 hours away (opposite time): -30% effectiveness (0.7x multiplier)
  const effectiveness = 1.3 - (hourDifference / 12) * 0.6;

  return Math.max(0.7, Math.min(1.3, effectiveness));
}

/**
 * Find optimal vital points based on elemental relationships
 */
export function findOptimalVitalPoints(
  attackerElement: string,
  allVitalPoints: readonly VitalPoint[] // Pass all VPs
): readonly VitalPoint[] {
  const elementalRelation = ELEMENTAL_RELATIONS[attackerElement];
  if (!elementalRelation) return [];

  const optimalPoints: VitalPoint[] = [];

  const controlledElement = Object.keys(elementalRelation.controlling)[0]; // Get the element it controls

  allVitalPoints.forEach((vp) => {
    // Find meridians related to this vital point
    const relatedMeridians = Object.values(ENERGY_MERIDIANS).filter((m) =>
      m.relatedVitalPoints.includes(vp.id)
    );
    // If any related meridian belongs to the element controlled by the attacker's element
    if (relatedMeridians.some((m) => m.element === controlledElement)) {
      optimalPoints.push(vp);
    }
  });

  return optimalPoints;
}

/**
 * Calculate anatomical vulnerability based on position and meridian flow
 */
export function calculateAnatomicalVulnerability(
  position: { x: number; y: number },
  meridianStates: Record<string, number> // flow effectiveness (0-1)
): number {
  let totalVulnerability = 1.0;

  const zone = getZoneByPosition(position);
  if (zone) {
    totalVulnerability *= zone.vulnerability;

    zone.meridians.forEach((meridianId) => {
      const meridianFlowEffectiveness = meridianStates[meridianId] || 1.0; // Default to 1.0 if not specified
      // Vulnerability increases if meridian flow is weak (e.g., 1 / flow_effectiveness)
      // Or some other logic, e.g. if flow is high, it's more sensitive.
      // Let's assume higher flow (closer to 1.0) means normal, lower flow means more vulnerable.
      // So, if flow is 0.5, vulnerability multiplier is 1 / 0.5 = 2.
      // To prevent extreme values, cap it.
      const flowModifier =
        meridianFlowEffectiveness > 0.1 ? 1 / meridianFlowEffectiveness : 10;
      totalVulnerability *= Math.min(flowModifier, 2.5); // Cap modifier
    });
  }

  return Math.max(0.5, Math.min(3.0, totalVulnerability)); // Overall cap
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
  meridianId: string,
  disruptionLevel: number
): readonly StatusEffect[] {
  const meridian = ENERGY_MERIDIANS[meridianId];
  if (!meridian) return [];

  const effects: StatusEffect[] = [];
  const intensityValue = Math.min(1.0, disruptionLevel);

  // Fix: Use proper EffectIntensity enum values from types/enums.ts
  let effectIntensity: EffectIntensity = EffectIntensity.MINOR;
  if (intensityValue > 0.7) effectIntensity = EffectIntensity.SEVERE;
  else if (intensityValue > 0.4) effectIntensity = EffectIntensity.MODERATE;
  else effectIntensity = EffectIntensity.MINOR;

  if (disruptionLevel > 0.3) {
    const effect: StatusEffect = {
      id: `meridian_disruption_${meridianId}_${Date.now()}`,
      type: "weakened",
      intensity: effectIntensity, // Now uses proper enum
      duration: Math.floor(2000 + intensityValue * 3000),
      description: {
        korean: "경락 차단 효과",
        english: "Meridian disruption effect",
      },
      stackable: false,
      source: meridianId,
      startTime: Date.now(),
      endTime: Date.now() + Math.floor(2000 + intensityValue * 3000),
    };

    effects.push(effect);
  }

  return effects;
}

/**
 * Get all anatomical zones
 */
export function getAnatomicalZones(): readonly KoreanAnatomicalZone[] {
  // Return array
  return KOREAN_ANATOMICAL_ZONES_ARRAY;
}

/**
 * Get zone by position
 */
export function getZoneByPosition(position: {
  x: number;
  y: number;
}): KoreanAnatomicalZone | null {
  for (const zone of KOREAN_ANATOMICAL_ZONES_ARRAY) {
    // Iterate array
    if (isPositionInZone(position, zone)) {
      return zone;
    }
  }
  return null;
}

export class KoreanAnatomySystem {
  // ... (constructor and methods)

  getZoneForVitalPoint(vitalPointId: string): KoreanAnatomicalZone | undefined {
    return KOREAN_ANATOMICAL_ZONES_ARRAY.find(
      (
        zone // Iterate array
      ) => zone.vitalPoints.includes(vitalPointId)
    );
  }

  getMeridiansInZone(zoneId: string): EnergyMeridian[] {
    const zone = KOREAN_ANATOMICAL_ZONES[zoneId]; // Use Record for direct lookup
    if (!zone) return [];
    return ENERGY_MERIDIANS_ARRAY.filter(
      (
        meridian // Iterate array
      ) => zone.meridians.includes(meridian.id)
    );
  }
}

// Helper function to create vital point effects with proper type
export function createVitalPointEffect(
  id: string,
  type: VitalPointEffectType,
  intensity: EffectIntensity, // Use proper enum type
  duration: number,
  description: KoreanText,
  stackable: boolean = false
): VitalPointEffect {
  return {
    id,
    type,
    intensity,
    duration,
    description,
    stackable,
    source: "vital_point_system",
  };
}

// Complete vital points data with proper types
export const SAMPLE_VITAL_POINTS: readonly VitalPoint[] = [
  {
    id: "baekhoehoel",
    names: {
      korean: "백회혈",
      english: "Crown Point",
      romanized: "Baekhoehyeol", // Add missing romanized property
    },
    anatomicalName: "Anterior Fontanelle",
    category: VitalPointCategory.NEUROLOGICAL,
    severity: VitalPointSeverity.CRITICAL,
    position: { x: 0, y: -50 },
    radius: 15,
    effects: [
      createVitalPointEffect(
        "unconsciousness_effect",
        VitalPointEffectType.UNCONSCIOUSNESS,
        EffectIntensity.HIGH,
        5000,
        { korean: "의식 잃음", english: "Loss of consciousness" }
      ),
    ],
    damage: { min: 40, max: 60, average: 50 },
    description: {
      korean: "머리 정수리의 중요 혈점",
      english: "Critical pressure point at crown of head",
    },
    difficulty: 0.9,
    requiredForce: 30,
    safetyWarning: "Extremely dangerous - can cause death",
    targetingDifficulty: 0.9,
    effectiveStances: [TrigramStance.GEON, TrigramStance.JIN], // Use proper enum values
  },
  {
    id: "inmyeong",
    names: {
      korean: "인영",
      english: "Man's Welcome",
      romanized: "Inmyeong", // Add missing romanized property
    },
    anatomicalName: "Carotid Artery",
    category: VitalPointCategory.VASCULAR,
    severity: VitalPointSeverity.MAJOR,
    position: { x: -30, y: 70 },
    radius: 20,
    effects: [
      createVitalPointEffect(
        "blood_flow_restriction",
        VitalPointEffectType.BLOOD_FLOW_RESTRICTION,
        EffectIntensity.HIGH,
        3000,
        { korean: "혈류 제한", english: "Blood flow restriction" }
      ),
    ],
    damage: { min: 25, max: 40, average: 32 },
    description: {
      korean: "목 옆의 중요 혈관",
      english: "Critical blood vessel on side of neck",
    },
    difficulty: 0.7,
    requiredForce: 20,
    safetyWarning: "Can cause unconsciousness",
    targetingDifficulty: 0.7,
    effectiveStances: [TrigramStance.TAE, TrigramStance.GAM], // Use proper enum values
  },
  {
    id: "myeongmun",
    names: {
      korean: "명문",
      english: "Gate of Life",
      romanized: "Myeongmun", // Add missing romanized property
    },
    anatomicalName: "L2-L3 Vertebrae",
    category: VitalPointCategory.NEUROLOGICAL,
    severity: VitalPointSeverity.MAJOR,
    position: { x: 0, y: 250 },
    radius: 25,
    effects: [
      createVitalPointEffect(
        "severe_pain_effect",
        VitalPointEffectType.PAIN,
        EffectIntensity.HIGH,
        4000,
        { korean: "극심한 통증", english: "Severe pain" }
      ),
    ],
    damage: { min: 30, max: 50, average: 40 },
    description: {
      korean: "등 아래쪽의 중요 혈점",
      english: "Critical point on lower back",
    },
    difficulty: 0.8,
    requiredForce: 25,
    safetyWarning: "Can cause temporary paralysis",
    targetingDifficulty: 0.8,
    effectiveStances: [TrigramStance.GAN, TrigramStance.GON], // Use proper enum values
  },
  {
    id: "jungwan",
    names: {
      korean: "중완",
      english: "Middle Cavity",
      romanized: "Jungwan", // Add missing romanized property
    },
    anatomicalName: "Solar Plexus",
    category: VitalPointCategory.ORGAN,
    severity: VitalPointSeverity.MAJOR,
    position: { x: 0, y: 200 },
    radius: 30,
    effects: [
      createVitalPointEffect(
        "breathlessness_effect",
        VitalPointEffectType.BREATHLESSNESS,
        EffectIntensity.MEDIUM,
        3500,
        { korean: "호흡 곤란", english: "Breathing difficulty" }
      ),
    ],
    damage: { min: 20, max: 35, average: 27 },
    description: {
      korean: "가슴 중앙의 중요 혈점",
      english: "Critical point at center of chest",
    },
    difficulty: 0.6,
    requiredForce: 18,
    safetyWarning: "Can cause breathing difficulties",
    targetingDifficulty: 0.6,
    effectiveStances: [TrigramStance.LI, TrigramStance.SON], // Use proper enum values
  },
  {
    id: "tanjoong",
    names: {
      korean: "단중",
      english: "Chest Center",
      romanized: "Danjoong", // Add missing romanized property
    },
    anatomicalName: "Sternum",
    category: VitalPointCategory.RESPIRATORY,
    severity: VitalPointSeverity.MODERATE,
    position: { x: 0, y: 180 },
    radius: 25,
    effects: [
      createVitalPointEffect(
        "stun_effect",
        VitalPointEffectType.STUN,
        EffectIntensity.MEDIUM,
        2000,
        { korean: "기절", english: "Stun" }
      ),
    ],
    damage: { min: 15, max: 25, average: 20 },
    description: {
      korean: "가슴 중앙의 호흡 혈점",
      english: "Breathing point at chest center",
    },
    difficulty: 0.5,
    requiredForce: 15,
    safetyWarning: "Can cause temporary stunning",
    targetingDifficulty: 0.5,
    effectiveStances: [TrigramStance.GEON, TrigramStance.LI], // Use proper enum values
  },
] as const;

// Anatomical regions with proper boundaries
export const ANATOMICAL_REGIONS_DATA: Record<string, AnatomicalRegion> = {
  head: {
    id: "head",
    name: { korean: "머리", english: "Head" },
    boundaries: [
      { x: -100, y: -100 },
      { x: 100, y: -100 },
      { x: 100, y: 50 },
      { x: -100, y: 50 },
    ],
    vitalPoints: SAMPLE_VITAL_POINTS.filter((vp) => vp.position.y < 50),
  },
  neck: {
    id: "neck",
    name: { korean: "목", english: "Neck" },
    boundaries: [
      { x: -50, y: 50 },
      { x: 50, y: 50 },
      { x: 50, y: 100 },
      { x: -50, y: 100 },
    ],
    vitalPoints: SAMPLE_VITAL_POINTS.filter(
      (vp) => vp.position.y >= 50 && vp.position.y < 100
    ),
  },
  torso: {
    id: "torso",
    name: { korean: "몸통", english: "Torso" },
    boundaries: [
      { x: -150, y: 100 },
      { x: 150, y: 100 },
      { x: 150, y: 400 },
      { x: -150, y: 400 },
    ],
    vitalPoints: SAMPLE_VITAL_POINTS.filter(
      (vp) => vp.position.y >= 100 && vp.position.y < 400
    ),
  },
  arms: {
    id: "arms",
    name: { korean: "팔", english: "Arms" },
    boundaries: [
      { x: -250, y: 100 },
      { x: -150, y: 100 },
      { x: 250, y: 300 },
      { x: -250, y: 300 },
    ],
    vitalPoints: SAMPLE_VITAL_POINTS.filter(
      (vp) =>
        Math.abs(vp.position.x) > 150 &&
        vp.position.y >= 100 &&
        vp.position.y < 300
    ),
  },
  legs: {
    id: "legs",
    name: { korean: "다리", english: "Legs" },
    boundaries: [
      { x: -100, y: 400 },
      { x: 100, y: 400 },
      { x: 100, y: 800 },
      { x: -100, y: 800 },
    ],
    vitalPoints: SAMPLE_VITAL_POINTS.filter((vp) => vp.position.y >= 400),
  },
};

// Helper functions for anatomy system
export function getVitalPointsInRegion(
  regionId: string
): readonly VitalPoint[] {
  return ANATOMICAL_REGIONS_DATA[regionId]?.vitalPoints || [];
}

export function getRegionBoundaries(regionId: string): readonly Position[] {
  return ANATOMICAL_REGIONS_DATA[regionId]?.boundaries || [];
}

export function isPositionInRegion(
  position: Position,
  regionId: string
): boolean {
  const boundaries = getRegionBoundaries(regionId);
  if (boundaries.length < 3) return false;

  // Simple point-in-polygon test for rectangular regions
  const [topLeft, topRight, , bottomLeft] = boundaries;
  return (
    position.x >= topLeft.x &&
    position.x <= topRight.x &&
    position.y >= topLeft.y &&
    position.y <= bottomLeft.y
  );
}

export function getRegionForPosition(position: Position): string | null {
  for (const regionId of Object.keys(ANATOMICAL_REGIONS_DATA)) {
    if (isPositionInRegion(position, regionId)) {
      return regionId;
    }
  }
  return null;
}

export default SAMPLE_VITAL_POINTS;
