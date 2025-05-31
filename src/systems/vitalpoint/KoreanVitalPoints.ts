import type {
  VitalPoint,
  Position,
  AnatomicalRegionIdentifier,
  VitalPointCategory,
  StatusEffect,
  // VitalPointEffect, // Unused
} from "../../types";

// Helper function to create VitalPoint objects with correct typing
function createVitalPoint(
  id: string,
  koreanName: string,
  englishName: string,
  position: Position,
  region: AnatomicalRegionIdentifier,
  damageMultiplier: number,
  category: VitalPointCategory,
  effects: StatusEffect[] = [],
  difficulty: number = 0.5,
  descriptionKorean: string = "",
  descriptionEnglish: string = "",
  meridian?: string
): VitalPoint {
  const vitalPoint: VitalPoint = {
    id,
    name: { korean: koreanName, english: englishName },
    koreanName,
    position,
    region,
    damageMultiplier,
    category,
    effects,
    difficulty,
  };

  if (descriptionKorean && descriptionEnglish) {
    vitalPoint.description = {
      korean: descriptionKorean,
      english: descriptionEnglish,
    };
  }

  if (meridian) {
    vitalPoint.meridian = meridian;
  }

  return vitalPoint;
}

export const KOREAN_VITAL_POINTS_DATA: VitalPoint[] = [
  createVitalPoint(
    "head_temple",
    "관자놀이 (Gwanjanori)",
    "Temple",
    { x: 0.1, y: 0.8 },
    "head",
    2.5,
    "primary",
    [
      {
        type: "stun",
        duration: 5,
        chance: 0.7,
        magnitude: 1,
        source: "Temple Strike", // Matches updated StatusEffect
      },
    ],
    0.7,
    "머리 옆의 매우 취약한 지점.",
    "Highly vulnerable point on the side of the head.",
    "Gallbladder"
  ),
  createVitalPoint(
    "neck_carotid",
    "목동맥 (Mokdongmaek)",
    "Carotid Artery",
    { x: 0.5, y: 0.5 },
    "neck",
    2.0,
    "secondary",
    [
      {
        type: "debuff",
        duration: 10,
        chance: 0.4,
        magnitude: 5,
        source: "Carotid Strike", // Matches updated StatusEffect
      },
      {
        type: "debuff",
        duration: 8,
        chance: 0.8,
        magnitude: 1,
        source: "Carotid Strike", // Matches updated StatusEffect
      },
    ],
    0.6,
    "목의 주요 동맥으로, 타격 시 무력화될 수 있습니다.",
    "Major artery in the neck, strike can be incapacitating.",
    "Stomach"
  ),
  createVitalPoint(
    "chest_solar_plexus",
    "명치 (Myeongchi)",
    "Solar Plexus",
    { x: 0.5, y: 0.3 },
    "chest",
    1.8,
    "primary",
    [
      {
        type: "debuff",
        duration: 6,
        chance: 0.9,
        magnitude: 1,
        source: "Solar Plexus Strike", // Matches updated StatusEffect
      },
    ],
    0.8,
    "흉골 아래 신경 다발로, 충격 시 호흡 곤란을 유발합니다.",
    "Nerve cluster below the sternum, impact causes breathlessness.",
    "Conception Vessel"
  ),
  // ... more vital points
];
