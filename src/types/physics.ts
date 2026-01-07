/**
 * Physics and collision detection type definitions for Black Trigram combat system.
 * 
 * **Korean**: 물리 및 충돌 타입 정의
 * 
 * This module provides type definitions for the collision detection system, including
 * bounding boxes, attack reach calculations, and raycasting results.
 * 
 * @module types/physics
 * @category Type Definitions
 * @korean 물리타입
 */

import type { TrigramStance } from "./common";
import type { VitalPoint } from "../systems/vitalpoint/types";

/**
 * Anatomical regions for collision detection.
 * 
 * **Korean**: 해부학적 영역
 * 
 * The five main body regions used for bounding box collision detection.
 * Each region contains multiple vital points.
 * 
 * @public
 * @category Collision Types
 * @korean 해부영역
 */
export type AnatomicalRegionPhysics = 
  | "head"    // 머리 (Meori)
  | "neck"    // 목 (Mok)
  | "torso"   // 몸통 (Momtong)
  | "arms"    // 팔 (Pal)
  | "legs";   // 다리 (Dari)

/**
 * Bounding box shape types for collision detection.
 * 
 * **Korean**: 경계 상자 형태
 * 
 * @public
 * @category Collision Types
 * @korean 경계형태
 */
export type BoundingBoxType = "sphere" | "box" | "capsule";

/**
 * Technique types for attack reach calculation.
 * 
 * **Korean**: 기술 유형
 * 
 * @public
 * @category Combat Types
 * @korean 기술유형
 */
export type TechniqueType = 
  | "punch"           // 주먹 (Jumeok)
  | "kick"            // 발차기 (Balchagi)
  | "elbow"           // 팔꿈치 (Palkkumchi)
  | "knee"            // 무릎 (Mureup)
  | "pressure_point"; // 급소 (Geupso)

/**
 * Bounding box definition for an anatomical region.
 * 
 * **Korean**: 경계 상자
 * 
 * Defines the collision volume for an anatomical region using either a sphere,
 * box, or capsule shape. Used for broad-phase collision detection.
 * 
 * @example
 * ```typescript
 * const headBox: BoundingBox = {
 *   type: "sphere",
 *   center: { x: 0, y: 1.7, z: 0 },
 *   dimensions: { x: 0.125, y: 0, z: 0 }, // radius only
 *   region: "head"
 * };
 * ```
 * 
 * @public
 * @category Collision Types
 * @korean 경계상자
 */
export interface BoundingBox {
  /** Shape type of the bounding box */
  readonly type: BoundingBoxType;
  
  /** Center position of the bounding box in 3D space */
  readonly center: Position3D;
  
  /** Dimensions: radius for sphere, width/height/depth for box, radius/height for capsule */
  readonly dimensions: Position3D;
  
  /** Anatomical region this bounding box represents */
  readonly region: AnatomicalRegionPhysics;
}

/**
 * Position in 3D space.
 * 
 * **Korean**: 3D 위치
 * 
 * Extends the 2D Position type with a z-coordinate for Three.js integration.
 * 
 * @public
 * @category Core Types
 * @korean 3D위치
 */
export interface Position3D {
  /** X coordinate in meters */
  readonly x: number;
  
  /** Y coordinate in meters */
  readonly y: number;
  
  /** Z coordinate in meters */
  readonly z: number;
}

/**
 * Attack reach calculation result.
 * 
 * **Korean**: 공격 범위
 * 
 * Contains the effective attack range considering technique type and stance modifiers.
 * 
 * @example
 * ```typescript
 * const kickReach: AttackReach = {
 *   technique: "kick",
 *   baseReach: 1.0,
 *   stance: TrigramStance.LI,
 *   stanceModifier: 1.20,
 *   effectiveReach: 1.2
 * };
 * ```
 * 
 * @public
 * @category Combat Types
 * @korean 공격범위
 */
export interface AttackReach {
  /** Type of technique being used */
  readonly technique: TechniqueType;
  
  /** Base reach in meters without modifiers */
  readonly baseReach: number;
  
  /** Current trigram stance */
  readonly stance: TrigramStance;
  
  /** Stance-specific reach modifier (0.9 - 1.2) */
  readonly stanceModifier: number;
  
  /** Final effective reach: baseReach × stanceModifier */
  readonly effectiveReach: number;
}

/**
 * Collision detection result.
 * 
 * **Korean**: 충돌 결과
 * 
 * Contains comprehensive information about a collision, including whether it hit,
 * which region and vital point were struck, distance, and accuracy.
 * 
 * @example
 * ```typescript
 * const result: CollisionResult = {
 *   hit: true,
 *   region: "head",
 *   vitalPoint: templePoint,
 *   distance: 0.8,
 *   accuracy: 0.95
 * };
 * ```
 * 
 * @public
 * @category Collision Types
 * @korean 충돌결과
 */
export interface CollisionResult {
  /** Whether the attack hit */
  readonly hit: boolean;
  
  /** Anatomical region hit (if any) */
  readonly region?: AnatomicalRegionPhysics;
  
  /** Specific vital point hit (if any) */
  readonly vitalPoint?: VitalPoint;
  
  /** Actual distance from attacker to target in meters */
  readonly distance: number;
  
  /** Hit accuracy (0-1), based on targeting precision */
  readonly accuracy: number;
  
  /** 3D point of intersection (if hit) */
  readonly hitPoint?: Position3D;
}

/**
 * Raycast query parameters.
 * 
 * **Korean**: 레이캐스트 쿼리
 * 
 * Defines the parameters for a raycasting operation from attacker to target.
 * 
 * @public
 * @category Collision Types
 * @korean 레이캐스트쿼리
 */
export interface RaycastQuery {
  /** Origin point of the ray (attacker position) */
  readonly origin: Position3D;
  
  /** Direction vector of the ray (normalized) */
  readonly direction: Position3D;
  
  /** Maximum distance to check in meters */
  readonly maxDistance: number;
  
  /** Target anatomical region (optional, for filtering) */
  readonly targetRegion?: AnatomicalRegionPhysics;
}

/**
 * Base reach values for different technique types.
 * 
 * **Korean**: 기본 범위 값
 * 
 * @public
 * @category Combat Constants
 * @korean 기본범위값
 */
export const BASE_REACH: Record<TechniqueType, number> = {
  punch: 0.7,           // 70cm - Standard punch range
  kick: 1.0,            // 100cm - Longer leg reach
  elbow: 0.4,           // 40cm - Close-range strike
  knee: 0.4,            // 40cm - Close-range strike
  pressure_point: 0.5,  // 50cm - Precise targeting
};

/**
 * Stance reach modifiers for the Eight Trigrams.
 * 
 * **Korean**: 팔괘 범위 수정자
 * 
 * Each stance affects attack range differently based on its combat philosophy:
 * - Aggressive stances (Fire, Thunder) extend reach
 * - Defensive stances (Mountain) reduce reach
 * - Balanced stances (Heaven, Earth) have minor adjustments
 * 
 * @public
 * @category Combat Constants
 * @korean 팔괘범위수정자
 */
export const STANCE_REACH_MODIFIERS: Record<TrigramStance, number> = {
  li: 1.20,   // ☲ Fire (리): +20% reach (aggressive)
  jin: 1.15,  // ☳ Thunder (진): +15% reach (explosive)
  geon: 1.10, // ☰ Heaven (건): +10% reach (balanced)
  son: 1.05,  // ☴ Wind (손): +5% reach (continuous)
  tae: 1.00,  // ☱ Lake (태): neutral reach
  gam: 1.00,  // ☵ Water (감): neutral reach (adaptive)
  gon: 0.95,  // ☷ Earth (곤): -5% reach (grounded)
  gan: 0.90,  // ☶ Mountain (간): -10% reach (defensive)
};

/**
 * Korean terminology for collision detection concepts.
 * 
 * **Korean**: 충돌 감지 용어
 * 
 * @public
 * @category Korean Terms
 * @korean 충돌용어
 */
export const COLLISION_KOREAN_TERMS = {
  collisionDetection: "충돌감지",     // Chungdol Gamji
  attackRange: "타격범위",            // Tagyeok Beomwi
  preciseHit: "정밀타격",             // Jeongmil Tagyeok
  boundingBox: "경계상자",            // Gyeonggye Sangja
  raycast: "광선투사",                // Gwangseon Tusa
  hitAccuracy: "타격정확도",          // Tagyeok Jeonghwakdo
  effectiveReach: "유효범위",         // Yuhyo Beomwi
} as const;

/**
 * Anatomical region dimensions in meters.
 * 
 * **Korean**: 해부 영역 치수
 * 
 * Standard dimensions for adult human anatomical regions used for bounding box creation.
 * 
 * @public
 * @category Collision Constants
 * @korean 해부영역치수
 */
export const ANATOMICAL_DIMENSIONS = {
  head: {
    type: "sphere" as const,
    radius: 0.125,        // 머리 구 반경 (Meori sphere radius) – 12.5cm radius for head sphere
    center: { x: 0, y: 1.7, z: 0 }, // 머리 중심 높이 (Meori center height) – Average adult head height
  },
  neck: {
    type: "capsule" as const,
    radius: 0.075,        // 목 캡슐 반경 (Mok capsule radius) – 7.5cm radius for neck cylinder
    height: 0.15,         // 목 캡슐 높이 (Mok capsule height) – 15cm height
    center: { x: 0, y: 1.5, z: 0 }, // 목 중심 높이 (Mok center height)
  },
  torso: {
    type: "box" as const,
    width: 0.4,           // 몸통 상자 가로 (Momtong box width) – 40cm width (shoulder to shoulder)
    height: 0.6,          // 몸통 상자 세로 (Momtong box height) – 60cm height (neck to waist)
    depth: 0.25,          // 몸통 상자 깊이 (Momtong box depth) – 25cm depth (front to back)
    center: { x: 0, y: 1.1, z: 0 }, // 몸통 중심 높이 (Momtong center height)
  },
  arms: {
    type: "capsule" as const,
    radius: 0.05,         // 팔 캡슐 반경 (Pal capsule radius) – 5cm radius for arm cylinder
    height: 0.6,          // 팔 캡슐 길이 (Pal capsule length) – 60cm length (shoulder to hand)
    center: { x: 0.3, y: 1.1, z: 0 }, // 팔 위치 오프셋 (Pal position offset) – Offset for arm position
  },
  legs: {
    type: "capsule" as const,
    radius: 0.06,         // 다리 캡슐 반경 (Dari capsule radius) – 6cm radius for leg cylinder
    height: 0.8,          // 다리 캡슐 길이 (Dari capsule length) – 80cm length (hip to foot)
    center: { x: 0.15, y: 0.4, z: 0 }, // 다리 위치 오프셋 (Dari position offset) – Offset for leg position
  },
} as const;
