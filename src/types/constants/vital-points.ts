/**
 * Vital points data for Korean martial arts targeting system
 */

import type { VitalPoint, RegionData } from "../anatomy";
import type {
  BodyRegion,
  VitalPointCategory,
  VitalPointSeverity,
} from "../enums";

// Korean vital points based on traditional martial arts
export const VITAL_POINTS_DATA: readonly VitalPoint[] = [
  // Head region vital points
  {
    id: "temple_left",
    name: { korean: "좌측 관자놀이", english: "Left Temple" },
    koreanName: "좌측 관자놀이",
    englishName: "Left Temple",
    category: "head" as VitalPointCategory,
    description: {
      korean: "측두골 부위의 급소",
      english: "Temporal bone pressure point",
    },
    location: { x: 15, y: 25, region: "head" },
    severity: "severe" as VitalPointSeverity,
    baseAccuracy: 0.6,
    baseDamage: 35,
    damageMultiplier: 1.5,
    effects: [
      {
        id: "temple_stun",
        type: "stun",
        intensity: "severe",
        duration: 2000,
        description: {
          korean: "현기증과 혼란",
          english: "Dizziness and confusion",
        },
        stackable: false,
      },
    ],
    techniques: ["li_nerve_strike", "son_pressure_point"],
  },
  {
    id: "temple_right",
    name: { korean: "우측 관자놀이", english: "Right Temple" },
    koreanName: "우측 관자놀이",
    englishName: "Right Temple",
    category: "head" as VitalPointCategory,
    description: {
      korean: "측두골 부위의 급소",
      english: "Temporal bone pressure point",
    },
    location: { x: 85, y: 25, region: "head" },
    severity: "severe" as VitalPointSeverity,
    baseAccuracy: 0.6,
    baseDamage: 35,
    damageMultiplier: 1.5,
    effects: [
      {
        id: "temple_stun",
        type: "stun",
        intensity: "severe",
        duration: 2000,
        description: {
          korean: "현기증과 혼란",
          english: "Dizziness and confusion",
        },
        stackable: false,
      },
    ],
    techniques: ["li_nerve_strike", "son_pressure_point"],
  },
  // Neck region
  {
    id: "carotid_artery",
    name: { korean: "경동맥", english: "Carotid Artery" },
    koreanName: "경동맥",
    englishName: "Carotid Artery",
    category: "vascular" as VitalPointCategory,
    description: { korean: "목의 주요 혈관", english: "Major neck artery" },
    location: { x: 30, y: 40, region: "neck" },
    severity: "critical" as VitalPointSeverity,
    baseAccuracy: 0.4,
    baseDamage: 50,
    damageMultiplier: 2.0,
    effects: [
      {
        id: "blood_flow_restriction",
        type: "stun",
        intensity: "critical",
        duration: 3000,
        description: { korean: "혈류 차단", english: "Blood flow restriction" },
        stackable: false,
      },
    ],
    techniques: ["gam_pressure_strike"],
  },
  // Torso region
  {
    id: "solar_plexus",
    name: { korean: "명치", english: "Solar Plexus" },
    koreanName: "명치",
    englishName: "Solar Plexus",
    category: "nerve" as VitalPointCategory,
    description: {
      korean: "복부의 중요한 신경총",
      english: "Important abdominal nerve cluster",
    },
    location: { x: 50, y: 65, region: "torso" },
    severity: "moderate" as VitalPointSeverity,
    baseAccuracy: 0.8,
    baseDamage: 30,
    damageMultiplier: 1.3,
    effects: [
      {
        id: "wind_knocked_out",
        type: "exhausted",
        intensity: "moderate",
        duration: 2500,
        description: { korean: "숨이 막힘", english: "Winded" },
        stackable: false,
      },
    ],
    techniques: ["geon_direct_strike", "jin_thrust"],
  },
  // Add more vital points as needed...
] as const;

// Region data mapping
export const ANATOMICAL_REGIONS: Record<BodyRegion, RegionData> = {
  head: {
    name: { korean: "머리", english: "Head" },
    subRegions: ["forehead", "temples", "jaw"],
    vitalPoints: VITAL_POINTS_DATA.filter(
      (vp) => vp.location.region === "head"
    ),
    vulnerability: 1.5,
    pressure_points: ["temple_left", "temple_right"],
  },
  face_upper: {
    name: { korean: "상안면", english: "Upper Face" },
    subRegions: ["eyes", "nose", "forehead"],
    vitalPoints: VITAL_POINTS_DATA.filter(
      (vp) => vp.location.region === "face_upper"
    ),
    vulnerability: 1.3,
    pressure_points: [],
  },
  neck: {
    name: { korean: "목", english: "Neck" },
    subRegions: ["throat", "nape", "sides"],
    vitalPoints: VITAL_POINTS_DATA.filter(
      (vp) => vp.location.region === "neck"
    ),
    vulnerability: 1.8,
    pressure_points: ["carotid_artery"],
  },
  chest: {
    name: { korean: "가슴", english: "Chest" },
    subRegions: ["upper_chest", "lower_chest", "ribs"],
    vitalPoints: VITAL_POINTS_DATA.filter(
      (vp) => vp.location.region === "chest"
    ),
    vulnerability: 1.2,
    pressure_points: [],
  },
  abdomen: {
    name: { korean: "복부", english: "Abdomen" },
    subRegions: ["upper_abdomen", "lower_abdomen"],
    vitalPoints: VITAL_POINTS_DATA.filter(
      (vp) => vp.location.region === "abdomen"
    ),
    vulnerability: 1.4,
    pressure_points: ["solar_plexus"],
  },
  torso: {
    name: { korean: "몸통", english: "Torso" },
    subRegions: ["chest", "abdomen", "back"],
    vitalPoints: VITAL_POINTS_DATA.filter(
      (vp) => vp.location.region === "torso"
    ),
    vulnerability: 1.0,
    pressure_points: ["solar_plexus"],
  },
  left_arm: {
    name: { korean: "왼팔", english: "Left Arm" },
    subRegions: ["shoulder", "upper_arm", "elbow", "forearm"],
    vitalPoints: VITAL_POINTS_DATA.filter(
      (vp) => vp.location.region === "left_arm"
    ),
    vulnerability: 0.8,
    pressure_points: [],
  },
  right_arm: {
    name: { korean: "오른팔", english: "Right Arm" },
    subRegions: ["shoulder", "upper_arm", "elbow", "forearm"],
    vitalPoints: VITAL_POINTS_DATA.filter(
      (vp) => vp.location.region === "right_arm"
    ),
    vulnerability: 0.8,
    pressure_points: [],
  },
  left_leg: {
    name: { korean: "왼다리", english: "Left Leg" },
    subRegions: ["thigh", "knee", "shin", "calf"],
    vitalPoints: VITAL_POINTS_DATA.filter(
      (vp) => vp.location.region === "left_leg"
    ),
    vulnerability: 0.9,
    pressure_points: [],
  },
  right_leg: {
    name: { korean: "오른다리", english: "Right Leg" },
    subRegions: ["thigh", "knee", "shin", "calf"],
    vitalPoints: VITAL_POINTS_DATA.filter(
      (vp) => vp.location.region === "right_leg"
    ),
    vulnerability: 0.9,
    pressure_points: [],
  },
};
