/**
 * Clothing system types for fighter archetypes
 *
 * **Korean**: 의류 시스템 타입 (Clothing System Types)
 *
 * Defines clothing items, materials, and configurations for each of the five
 * player archetypes. Clothing provides visual distinction, cultural context,
 * and reinforces archetype identity while maintaining the cyberpunk Korean aesthetic.
 *
 * @module types/clothing
 * @category Type Definitions
 * @korean 의류타입
 */

import type { PlayerArchetype, PhysicalAttributes } from "./common";
import type { Bone } from "./skeletal";

/**
 * Clothing item type categories
 *
 * @public
 * @category Clothing
 * @korean 의류종류
 */
export type ClothingType =
  | "torso" // Upper body garment (shirt, jacket, gi)
  | "pants" // Lower body garment
  | "belt" // Waist accessory (martial arts belt, tactical belt)
  | "boots" // Footwear
  | "gloves" // Hand protection
  | "headgear" // Headwear (hat, mask, helmet)
  | "vest" // Protective vest or armor
  | "accessory"; // Additional accessories (pouches, holsters)

/**
 * Clothing material types affecting appearance
 *
 * @public
 * @category Clothing
 * @korean 소재
 */
export type ClothingMaterial =
  | "fabric" // Traditional cloth (dobok, hanbok)
  | "leather" // Leather gear
  | "tactical" // Modern tactical fabric
  | "synthetic" // Synthetic materials
  | "armored" // Armored plating
  | "cybernetic"; // Tech-enhanced materials

/**
 * Clothing fit style
 *
 * @public
 * @category Clothing
 * @korean 착용스타일
 */
export type ClothingFit = "tight" | "fitted" | "loose" | "oversized";

/**
 * Individual clothing item configuration
 *
 * @public
 * @category Clothing
 * @korean 의류아이템
 */
export interface ClothingItem {
  /**
   * Unique identifier for the clothing item
   * @korean ID
   */
  readonly id: string;

  /**
   * Korean name for the clothing item
   * @korean 한글이름
   */
  readonly nameKorean: string;

  /**
   * English name for the clothing item
   * @korean 영문이름
   */
  readonly nameEnglish: string;

  /**
   * Type of clothing item
   * @korean 종류
   */
  readonly type: ClothingType;

  /**
   * Material of the clothing
   * @korean 소재
   */
  readonly material: ClothingMaterial;

  /**
   * Fit style of the clothing
   * @korean 착용스타일
   */
  readonly fit: ClothingFit;

  /**
   * Primary color (hex number)
   * @korean 기본색상
   */
  readonly colorPrimary: number;

  /**
   * Secondary/accent color (hex number)
   * @korean 강조색상
   */
  readonly colorSecondary?: number;

  /**
   * Emissive color for glowing effects (hex number)
   * @korean 발광색상
   */
  readonly colorEmissive?: number;

  /**
   * Emissive intensity (0-1)
   * @korean 발광강도
   */
  readonly emissiveIntensity?: number;

  /**
   * Metalness (0-1)
   * @korean 금속성
   */
  readonly metalness?: number;

  /**
   * Roughness (0-1)
   * @korean 거칠기
   */
  readonly roughness?: number;

  /**
   * Scale multiplier for body proportions
   * @korean 크기배율
   */
  readonly scaleMultiplier?: number;

  /**
   * Bones to attach this clothing to
   * @korean 부착뼈
   */
  readonly attachedBones: string[];

  /**
   * Whether clothing should cast shadows
   * @korean 그림자표시
   */
  readonly castShadow?: boolean;

  /**
   * Whether clothing should receive shadows
   * @korean 그림자수신
   */
  readonly receiveShadow?: boolean;
}

/**
 * Complete clothing set for an archetype
 *
 * @public
 * @category Clothing
 * @korean 의류세트
 */
export interface ClothingSet {
  /**
   * Archetype this clothing set belongs to
   * @korean 원형
   */
  readonly archetype: PlayerArchetype;

  /**
   * Korean name for the clothing set
   * @korean 한글이름
   */
  readonly nameKorean: string;

  /**
   * English name for the clothing set
   * @korean 영문이름
   */
  readonly nameEnglish: string;

  /**
   * Description in Korean
   * @korean 한글설명
   */
  readonly descriptionKorean: string;

  /**
   * Description in English
   * @korean 영문설명
   */
  readonly descriptionEnglish: string;

  /**
   * Clothing items in this set
   * @korean 의류아이템들
   */
  readonly items: readonly ClothingItem[];

  /**
   * Overall theme colors for the set
   * @korean 테마색상
   */
  readonly themeColors: {
    readonly primary: number;
    readonly secondary: number;
    readonly accent: number;
  };
}

/**
 * LOD (Level of Detail) settings for performance optimization
 *
 * @public
 * @category Clothing
 * @korean LOD설정
 */
export interface ClothingLODSettings {
  /**
   * Enable LOD system
   * @korean LOD활성화
   */
  readonly enableLOD: boolean;
  
  /**
   * Distance thresholds for LOD levels [near, medium, far]
   * @korean 거리임계값
   */
  readonly distances: readonly [number, number, number];
  
  /**
   * Segments for high detail (close viewing)
   * @korean 고품질세그먼트
   */
  readonly highDetailSegments: number;
  
  /**
   * Segments for medium detail
   * @korean 중품질세그먼트
   */
  readonly mediumDetailSegments: number;
  
  /**
   * Segments for low detail (far viewing)
   * @korean 저품질세그먼트
   */
  readonly lowDetailSegments: number;
}

/**
 * Material preset configurations for common clothing types
 *
 * @public
 * @category Clothing
 * @korean 재료프리셋
 */
export interface MaterialPreset {
  /**
   * Metalness (0-1)
   * @korean 금속성
   */
  readonly metalness: number;
  
  /**
   * Roughness (0-1)
   * @korean 거칠기
   */
  readonly roughness: number;
  
  /**
   * Emissive intensity (0-1)
   * @korean 발광강도
   */
  readonly emissiveIntensity?: number;
}

/**
 * Props for ClothingSystem component
 *
 * @public
 * @category Component Props
 * @korean 의류시스템속성
 */
export interface ClothingSystemProps {
  /**
   * Player archetype to render clothing for
   * @korean 원형
   */
  readonly archetype: PlayerArchetype;

  /**
   * Physical attributes for scaling clothing
   * @korean 신체속성
   */
  readonly physicalAttributes: PhysicalAttributes;

  /**
   * Bone map from skeletal rig for attachment
   * @korean 뼈맵
   */
  readonly boneMap: Map<string, Bone>;

  /**
   * Overall scale multiplier
   * @korean 크기배율
   */
  readonly scale?: number;

  /**
   * Whether to show clothing (can disable for debug)
   * @korean 표시여부
   */
  readonly visible?: boolean;
  
  /**
   * Optional LOD settings for performance optimization
   * @korean LOD설정
   */
  readonly lodSettings?: ClothingLODSettings;
}

/**
 * Props for individual clothing item component
 *
 * @public
 * @category Component Props
 * @korean 의류아이템속성
 */
export interface ClothingItemProps {
  /**
   * Clothing item configuration
   * @korean 의류아이템
   */
  readonly item: ClothingItem;

  /**
   * Physical attributes for scaling
   * @korean 신체속성
   */
  readonly physicalAttributes: PhysicalAttributes;

  /**
   * Overall scale multiplier
   * @korean 크기배율
   */
  readonly scale?: number;
}
