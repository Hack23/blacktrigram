/**
 * Archetype-specific clothing configurations
 *
 * **Korean**: 원형별 의류 설정 (Archetype Clothing Configurations)
 *
 * Defines characteristic clothing sets for each of the five player archetypes,
 * combining traditional Korean martial arts attire with cyberpunk aesthetics.
 *
 * @module data/archetypeClothing
 * @category Player & Archetypes
 * @korean 원형의류데이터
 */

import { PlayerArchetype } from "@/types";
import { KOREAN_COLORS } from "@/types/constants";
import type { ClothingSet, ClothingItem } from "@/types/clothing";

/**
 * 무사 (Musa) - Traditional Warrior Clothing Set
 *
 * **Philosophy**: Honor through disciplined strength
 * **Style**: Military dobok with tactical enhancements
 * **Aesthetic**: Traditional Korean martial arts uniform modernized with military elements
 *
 * @korean 무사의류
 */
const MUSA_CLOTHING_ITEMS: readonly ClothingItem[] = [
  {
    id: "musa_torso_gi",
    nameKorean: "전투 도복 상의",
    nameEnglish: "Combat Dobok Top",
    type: "torso",
    material: "fabric",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, // Dark gray base
    colorSecondary: KOREAN_COLORS.ACCENT_GOLD,
    colorEmissive: KOREAN_COLORS.ACCENT_GOLD,
    emissiveIntensity: 0.1,
    metalness: 0.1,
    roughness: 0.8,
    attachedBones: ["torso", "left_upper_arm", "right_upper_arm", "left_shoulder", "right_shoulder"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "musa_pants",
    nameKorean: "전투 도복 하의",
    nameEnglish: "Combat Dobok Pants",
    type: "pants",
    material: "fabric",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
    colorSecondary: KOREAN_COLORS.ACCENT_GOLD,
    metalness: 0.1,
    roughness: 0.8,
    attachedBones: ["pelvis", "left_upper_leg", "right_upper_leg", "left_lower_leg", "right_lower_leg"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "musa_belt",
    nameKorean: "검은 띠",
    nameEnglish: "Black Belt",
    type: "belt",
    material: "fabric",
    fit: "tight",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    colorSecondary: KOREAN_COLORS.ACCENT_GOLD,
    colorEmissive: KOREAN_COLORS.ACCENT_GOLD,
    emissiveIntensity: 0.2,
    metalness: 0.0,
    roughness: 0.9,
    attachedBones: ["pelvis"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "musa_boots",
    nameKorean: "전투 부츠",
    nameEnglish: "Combat Boots",
    type: "boots",
    material: "leather",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    metalness: 0.3,
    roughness: 0.7,
    attachedBones: ["left_foot", "right_foot"],
    castShadow: true,
    receiveShadow: true,
  },
];

export const MUSA_CLOTHING: ClothingSet = {
  archetype: PlayerArchetype.MUSA,
  nameKorean: "무사 군복",
  nameEnglish: "Military Warrior Uniform",
  descriptionKorean: "전통 도복과 현대 군복을 결합한 전사의 의상",
  descriptionEnglish: "Traditional dobok combined with modern military uniform",
  items: MUSA_CLOTHING_ITEMS,
  themeColors: {
    primary: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
    secondary: KOREAN_COLORS.ACCENT_GOLD,
    accent: KOREAN_COLORS.KOREAN_BLACK,
  },
};

/**
 * 암살자 (Amsalja) - Shadow Assassin Clothing Set
 *
 * **Philosophy**: Efficiency through invisibility
 * **Style**: Stealth bodysuit with cyber enhancements
 * **Aesthetic**: Sleek, form-fitting with neon cyan accents
 *
 * @korean 암살자의류
 */
const AMSALJA_CLOTHING_ITEMS: readonly ClothingItem[] = [
  {
    id: "amsalja_bodysuit",
    nameKorean: "스텔스 바디슈트",
    nameEnglish: "Stealth Bodysuit",
    type: "torso",
    material: "synthetic",
    fit: "tight",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    colorSecondary: KOREAN_COLORS.PRIMARY_CYAN,
    colorEmissive: KOREAN_COLORS.PRIMARY_CYAN,
    emissiveIntensity: 0.3,
    metalness: 0.4,
    roughness: 0.5,
    attachedBones: ["torso", "left_upper_arm", "right_upper_arm", "left_lower_arm", "right_lower_arm", "left_shoulder", "right_shoulder"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "amsalja_pants",
    nameKorean: "스텔스 팬츠",
    nameEnglish: "Stealth Pants",
    type: "pants",
    material: "synthetic",
    fit: "tight",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    colorSecondary: KOREAN_COLORS.PRIMARY_CYAN,
    colorEmissive: KOREAN_COLORS.PRIMARY_CYAN,
    emissiveIntensity: 0.2,
    metalness: 0.4,
    roughness: 0.5,
    attachedBones: ["pelvis", "left_upper_leg", "right_upper_leg", "left_lower_leg", "right_lower_leg"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "amsalja_vest",
    nameKorean: "사이버 조끼",
    nameEnglish: "Cyber Vest",
    type: "vest",
    material: "armored",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.UI_BACKGROUND_DARK,
    colorSecondary: KOREAN_COLORS.PRIMARY_CYAN,
    colorEmissive: KOREAN_COLORS.PRIMARY_CYAN,
    emissiveIntensity: 0.4,
    metalness: 0.7,
    roughness: 0.3,
    attachedBones: ["torso"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "amsalja_boots",
    nameKorean: "스텔스 부츠",
    nameEnglish: "Stealth Boots",
    type: "boots",
    material: "synthetic",
    fit: "tight",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    colorEmissive: KOREAN_COLORS.PRIMARY_CYAN,
    emissiveIntensity: 0.15,
    metalness: 0.5,
    roughness: 0.4,
    attachedBones: ["left_foot", "right_foot"],
    castShadow: true,
    receiveShadow: true,
  },
];

export const AMSALJA_CLOTHING: ClothingSet = {
  archetype: PlayerArchetype.AMSALJA,
  nameKorean: "암살자 전투복",
  nameEnglish: "Shadow Assassin Suit",
  descriptionKorean: "사이버 기술이 통합된 은밀한 암살자 복장",
  descriptionEnglish: "Stealthy assassin outfit with integrated cyber technology",
  items: AMSALJA_CLOTHING_ITEMS,
  themeColors: {
    primary: KOREAN_COLORS.KOREAN_BLACK,
    secondary: KOREAN_COLORS.PRIMARY_CYAN,
    accent: KOREAN_COLORS.UI_BACKGROUND_DARK,
  },
};

/**
 * 해커 (Hacker) - Cyber Warrior Clothing Set
 *
 * **Philosophy**: Information as power through technology
 * **Style**: Casual tech wear with augmented reality elements
 * **Aesthetic**: Street style with holographic accents
 *
 * @korean 해커의류
 */
const HACKER_CLOTHING_ITEMS: readonly ClothingItem[] = [
  {
    id: "hacker_hoodie",
    nameKorean: "사이버 후드티",
    nameEnglish: "Cyber Hoodie",
    type: "torso",
    material: "synthetic",
    fit: "loose",
    colorPrimary: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
    colorSecondary: KOREAN_COLORS.SECONDARY_PURPLE,
    colorEmissive: KOREAN_COLORS.SECONDARY_PURPLE,
    emissiveIntensity: 0.25,
    metalness: 0.2,
    roughness: 0.7,
    attachedBones: ["torso", "left_upper_arm", "right_upper_arm", "left_shoulder", "right_shoulder"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "hacker_pants",
    nameKorean: "테크 팬츠",
    nameEnglish: "Tech Pants",
    type: "pants",
    material: "tactical",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    colorSecondary: KOREAN_COLORS.SECONDARY_PURPLE,
    colorEmissive: KOREAN_COLORS.SECONDARY_PURPLE,
    emissiveIntensity: 0.15,
    metalness: 0.3,
    roughness: 0.6,
    attachedBones: ["pelvis", "left_upper_leg", "right_upper_leg", "left_lower_leg", "right_lower_leg"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "hacker_gloves",
    nameKorean: "데이터 글러브",
    nameEnglish: "Data Gloves",
    type: "gloves",
    material: "cybernetic",
    fit: "tight",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    colorSecondary: KOREAN_COLORS.SECONDARY_PURPLE,
    colorEmissive: KOREAN_COLORS.SECONDARY_PURPLE,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2,
    attachedBones: ["left_hand", "right_hand"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "hacker_boots",
    nameKorean: "스마트 스니커즈",
    nameEnglish: "Smart Sneakers",
    type: "boots",
    material: "synthetic",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.UI_BACKGROUND_DARK,
    colorSecondary: KOREAN_COLORS.SECONDARY_PURPLE,
    colorEmissive: KOREAN_COLORS.SECONDARY_PURPLE,
    emissiveIntensity: 0.2,
    metalness: 0.4,
    roughness: 0.5,
    attachedBones: ["left_foot", "right_foot"],
    castShadow: true,
    receiveShadow: true,
  },
];

export const HACKER_CLOTHING: ClothingSet = {
  archetype: PlayerArchetype.HACKER,
  nameKorean: "해커 전투복",
  nameEnglish: "Hacker Combat Wear",
  descriptionKorean: "첨단 기술이 융합된 사이버 전사 복장",
  descriptionEnglish: "Cyber warrior outfit with cutting-edge technology",
  items: HACKER_CLOTHING_ITEMS,
  themeColors: {
    primary: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
    secondary: KOREAN_COLORS.SECONDARY_PURPLE,
    accent: KOREAN_COLORS.KOREAN_BLACK,
  },
};

/**
 * 정보요원 (Jeongbo Yowon) - Intelligence Operative Clothing Set
 *
 * **Philosophy**: Knowledge through observation and strategy
 * **Style**: Professional tactical suit
 * **Aesthetic**: Clean, functional, government operative
 *
 * @korean 정보요원의류
 */
const JEONGBO_CLOTHING_ITEMS: readonly ClothingItem[] = [
  {
    id: "jeongbo_jacket",
    nameKorean: "작전 재킷",
    nameEnglish: "Tactical Jacket",
    type: "torso",
    material: "tactical",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.UI_BACKGROUND_DARK,
    colorSecondary: KOREAN_COLORS.ACCENT_BLUE,
    colorEmissive: KOREAN_COLORS.ACCENT_BLUE,
    emissiveIntensity: 0.15,
    metalness: 0.2,
    roughness: 0.7,
    attachedBones: ["torso", "left_upper_arm", "right_upper_arm", "left_shoulder", "right_shoulder"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "jeongbo_pants",
    nameKorean: "작전 팬츠",
    nameEnglish: "Tactical Pants",
    type: "pants",
    material: "tactical",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.UI_BACKGROUND_DARK,
    colorSecondary: KOREAN_COLORS.ACCENT_BLUE,
    metalness: 0.2,
    roughness: 0.7,
    attachedBones: ["pelvis", "left_upper_leg", "right_upper_leg", "left_lower_leg", "right_lower_leg"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "jeongbo_vest",
    nameKorean: "작전 조끼",
    nameEnglish: "Tactical Vest",
    type: "vest",
    material: "armored",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
    colorSecondary: KOREAN_COLORS.ACCENT_BLUE,
    colorEmissive: KOREAN_COLORS.ACCENT_BLUE,
    emissiveIntensity: 0.2,
    metalness: 0.5,
    roughness: 0.5,
    attachedBones: ["torso"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "jeongbo_belt",
    nameKorean: "전술 벨트",
    nameEnglish: "Tactical Belt",
    type: "belt",
    material: "tactical",
    fit: "tight",
    colorPrimary: KOREAN_COLORS.UI_BACKGROUND_DARK,
    colorSecondary: KOREAN_COLORS.ACCENT_BLUE,
    metalness: 0.4,
    roughness: 0.6,
    attachedBones: ["pelvis"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "jeongbo_boots",
    nameKorean: "작전 부츠",
    nameEnglish: "Tactical Boots",
    type: "boots",
    material: "leather",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    metalness: 0.3,
    roughness: 0.7,
    attachedBones: ["left_foot", "right_foot"],
    castShadow: true,
    receiveShadow: true,
  },
];

export const JEONGBO_CLOTHING: ClothingSet = {
  archetype: PlayerArchetype.JEONGBO_YOWON,
  nameKorean: "정보요원 작전복",
  nameEnglish: "Intelligence Operative Gear",
  descriptionKorean: "정부 요원을 위한 전문 작전 장비",
  descriptionEnglish: "Professional tactical gear for government operatives",
  items: JEONGBO_CLOTHING_ITEMS,
  themeColors: {
    primary: KOREAN_COLORS.UI_BACKGROUND_DARK,
    secondary: KOREAN_COLORS.ACCENT_BLUE,
    accent: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
  },
};

/**
 * 조직폭력배 (Jojik Pokryeokbae) - Organized Crime Clothing Set
 *
 * **Philosophy**: Survival through ruthlessness and brutality
 * **Style**: Street gang attire with intimidating elements
 * **Aesthetic**: Heavy, brutal, street fighter
 *
 * @korean 조직폭력배의류
 */
const JOJIK_CLOTHING_ITEMS: readonly ClothingItem[] = [
  {
    id: "jojik_leather_jacket",
    nameKorean: "가죽 재킷",
    nameEnglish: "Leather Jacket",
    type: "torso",
    material: "leather",
    fit: "oversized",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    colorSecondary: KOREAN_COLORS.ACCENT_RED,
    colorEmissive: KOREAN_COLORS.ACCENT_RED,
    emissiveIntensity: 0.2,
    metalness: 0.6,
    roughness: 0.4,
    attachedBones: ["torso", "left_upper_arm", "right_upper_arm", "left_shoulder", "right_shoulder"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "jojik_pants",
    nameKorean: "카고 팬츠",
    nameEnglish: "Cargo Pants",
    type: "pants",
    material: "fabric",
    fit: "loose",
    colorPrimary: KOREAN_COLORS.UI_BACKGROUND_DARK,
    colorSecondary: KOREAN_COLORS.ACCENT_RED,
    metalness: 0.1,
    roughness: 0.8,
    attachedBones: ["pelvis", "left_upper_leg", "right_upper_leg", "left_lower_leg", "right_lower_leg"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "jojik_belt",
    nameKorean: "체인 벨트",
    nameEnglish: "Chain Belt",
    type: "belt",
    material: "leather",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    colorSecondary: KOREAN_COLORS.UI_STEEL_GRAY,
    colorEmissive: KOREAN_COLORS.ACCENT_RED,
    emissiveIntensity: 0.15,
    metalness: 0.8,
    roughness: 0.3,
    attachedBones: ["pelvis"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "jojik_gloves",
    nameKorean: "스터드 장갑",
    nameEnglish: "Studded Gloves",
    type: "gloves",
    material: "leather",
    fit: "tight",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    colorSecondary: KOREAN_COLORS.UI_STEEL_GRAY,
    metalness: 0.7,
    roughness: 0.4,
    attachedBones: ["left_hand", "right_hand"],
    castShadow: true,
    receiveShadow: true,
  },
  {
    id: "jojik_boots",
    nameKorean: "전투 부츠",
    nameEnglish: "Combat Boots",
    type: "boots",
    material: "leather",
    fit: "fitted",
    colorPrimary: KOREAN_COLORS.KOREAN_BLACK,
    metalness: 0.4,
    roughness: 0.6,
    attachedBones: ["left_foot", "right_foot"],
    castShadow: true,
    receiveShadow: true,
  },
];

export const JOJIK_CLOTHING: ClothingSet = {
  archetype: PlayerArchetype.JOJIK_POKRYEOKBAE,
  nameKorean: "조직폭력배 복장",
  nameEnglish: "Street Fighter Gear",
  descriptionKorean: "거리의 무법자를 위한 위협적인 복장",
  descriptionEnglish: "Intimidating outfit for street-hardened fighters",
  items: JOJIK_CLOTHING_ITEMS,
  themeColors: {
    primary: KOREAN_COLORS.KOREAN_BLACK,
    secondary: KOREAN_COLORS.ACCENT_RED,
    accent: KOREAN_COLORS.UI_BACKGROUND_DARK,
  },
};

/**
 * Archetype clothing lookup map
 *
 * **Korean**: 원형 의류 맵 (Archetype Clothing Map)
 *
 * @public
 * @korean 원형의류맵
 */
export const ARCHETYPE_CLOTHING: Record<PlayerArchetype, ClothingSet> = {
  [PlayerArchetype.MUSA]: MUSA_CLOTHING,
  [PlayerArchetype.AMSALJA]: AMSALJA_CLOTHING,
  [PlayerArchetype.HACKER]: HACKER_CLOTHING,
  [PlayerArchetype.JEONGBO_YOWON]: JEONGBO_CLOTHING,
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: JOJIK_CLOTHING,
};

/**
 * Get clothing set for a specific archetype
 *
 * **Korean**: 원형 의류 가져오기 (Get Archetype Clothing)
 *
 * @param archetype - Player archetype
 * @returns Clothing set for the archetype
 * @public
 * @korean 원형의류가져오기
 */
export function getArchetypeClothing(archetype: PlayerArchetype): ClothingSet {
  return ARCHETYPE_CLOTHING[archetype];
}
