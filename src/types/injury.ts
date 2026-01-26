/**
 * Shared Injury Types
 * 
 * **Korean**: 공유 부상 타입
 * 
 * Common injury types and data structures used across the trauma visualization
 * system. Separated from React components to avoid coupling system logic to UI.
 * 
 * @module types/injury
 * @category Types
 * @korean 부상타입
 */

import { BodyRegion } from "./common";

/**
 * Injury type classification
 * 
 * **Korean**: 부상 유형 분류
 * 
 * @public
 */
export enum InjuryType {
  /** Blunt force trauma */
  BRUISE = "bruise",
  /** Sharp weapon/strike */
  CUT = "cut",
  /** Deep cut with blood trail */
  LACERATION = "laceration",
  /** Bone damage indicator */
  FRACTURE = "fracture",
}

/**
 * Individual injury data for visualization
 * 
 * **Korean**: 시각화를 위한 개별 부상 데이터
 * 
 * Used by both the injury tracking system and trauma visualization components.
 * 
 * @public
 */
export interface Injury {
  /** Unique identifier */
  readonly id: string;
  /** Body region affected */
  readonly region: BodyRegion;
  /** Type of injury */
  readonly type: InjuryType;
  /** Position on body [x, y, z] relative to character center */
  readonly position: [number, number, number];
  /** Severity (0.0 to 1.0) */
  readonly severity: number;
  /** Number of hits to same location (for progressive bruising) */
  readonly hitCount: number;
  /** Timestamp when injury was created */
  readonly timestamp: number;
  /** Optional player ID for multi-player scenarios */
  readonly playerId?: string | number;
}
