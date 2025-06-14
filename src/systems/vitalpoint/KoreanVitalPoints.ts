// Korean vital points for Black Trigram (흑괘)
// Complete, culturally accurate, bilingual (Korean, English, Romanization)
import type { VitalPoint } from "../../types/anatomy";
import {
  VitalPointCategory,
  VitalPointSeverity,
  VitalPointEffectType,
  EffectIntensity,
} from "../../types/enums";

/**
 * Korean vital points (급소) definitions for authentic martial arts targeting
 */

export const KOREAN_VITAL_POINTS: readonly VitalPoint[] = [
  {
    id: "baekhoehoel",
    korean: { korean: "백회혈", english: "Crown Point" },
    english: "Crown Point",
    anatomicalName: "Anterior Fontanelle",
    category: VitalPointCategory.NEUROLOGICAL,
    severity: VitalPointSeverity.CRITICAL,
    position: { x: 0, y: -50 },
    radius: 15,
    effects: [
      {
        id: "unconsciousness_effect",
        type: VitalPointEffectType.UNCONSCIOUSNESS,
        intensity: EffectIntensity.HIGH,
        duration: 5000,
        description: {
          korean: "의식 잃음",
          english: "Loss of consciousness",
        },
        stackable: false,
        source: "vital_point_system",
      },
    ],
    damage: { min: 40, max: 60, average: 50 },
    description: {
      korean: "머리 정수리의 중요 혈점",
      english: "Critical pressure point at crown of head",
    },
    difficulty: 0.9,
    requiredForce: 30,
    safetyWarning: "Extremely dangerous - can cause death",
  },
  {
    id: "inmyeong",
    korean: { korean: "인영", english: "Man's Welcome" },
    english: "Man's Welcome",
    anatomicalName: "Carotid Artery",
    category: VitalPointCategory.VASCULAR,
    severity: VitalPointSeverity.MAJOR,
    position: { x: -30, y: 70 },
    radius: 20,
    effects: [
      {
        id: "breathlessness_effect",
        type: VitalPointEffectType.BREATHLESSNESS,
        intensity: EffectIntensity.MEDIUM,
        duration: 3000,
        description: {
          korean: "호흡 곤란",
          english: "Breathing difficulty",
        },
        stackable: false,
        source: "vital_point_system",
      },
    ],
    damage: { min: 25, max: 40, average: 32 },
    description: {
      korean: "목 옆의 중요 혈관",
      english: "Critical blood vessel on side of neck",
    },
    difficulty: 0.7,
    requiredForce: 20,
    safetyWarning: "Can cause unconsciousness",
  },
  {
    id: "myeongmun",
    korean: { korean: "명문", english: "Gate of Life" },
    english: "Gate of Life",
    anatomicalName: "L2-L3 Vertebrae",
    category: VitalPointCategory.NEUROLOGICAL,
    severity: VitalPointSeverity.MAJOR,
    position: { x: 0, y: 250 },
    radius: 25,
    effects: [
      {
        id: "severe_pain_effect",
        type: VitalPointEffectType.PAIN,
        intensity: EffectIntensity.HIGH,
        duration: 4000,
        description: {
          korean: "극심한 통증",
          english: "Severe pain",
        },
        stackable: false,
        source: "vital_point_system",
      },
    ],
    damage: { min: 30, max: 50, average: 40 },
    description: {
      korean: "등 아래쪽의 중요 혈점",
      english: "Critical point on lower back",
    },
    difficulty: 0.8,
    requiredForce: 25,
    safetyWarning: "Can cause temporary paralysis",
  },
] as const;

export const getVitalPointsByCategory = (
  category: VitalPointCategory
): VitalPoint[] => {
  return KOREAN_VITAL_POINTS.filter((vp) => vp.category === category);
};

export const getVitalPointsByRegion = (region: string): VitalPoint[] => {
  return KOREAN_VITAL_POINTS.filter((vp) => vp.region === region);
};

export const getVitalPointById = (id: string): VitalPoint | undefined => {
  return KOREAN_VITAL_POINTS.find((vp) => vp.id === id);
};

export default KOREAN_VITAL_POINTS;
