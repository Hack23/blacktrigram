/**
 * Player visual component types for unified 3D player representation
 * 
 * This module defines TypeScript interfaces for the unified Player3D component
 * used across combat and training screens, ensuring visual consistency and
 * proper integration with the combat system.
 * 
 * @module types/player-visual
 * @category Type Definitions
 * @korean 플레이어시각타입
 */

import type { PlayerArchetype, TrigramStance } from "./common";

/**
 * Balance state representing player stability in combat.
 * Drives visual indicators and affects combat effectiveness.
 * 
 * @public
 * @category Combat States
 * @korean 균형상태
 */
export type BalanceState = "READY" | "SHAKEN" | "VULNERABLE" | "HELPLESS";

/**
 * Player animation states for 3D model pose and movement.
 * 
 * @public
 * @category Animation
 * @korean 애니메이션상태
 */
export type PlayerAnimation =
  | "idle"
  | "attack"
  | "defend"
  | "hit"
  | "stance_change"
  | "technique_execute"
  | "walk"
  | "block"
  | "counter";

/**
 * Unified props for Player3D visual component.
 * 
 * This interface provides all properties needed to render a player
 * in both combat and training contexts with full state visualization.
 * 
 * @public
 * @category Component Props
 * @korean 플레이어3D속성
 */
export interface Player3DUnifiedProps {
  /**
   * Unique identifier for the player
   * @korean 플레이어ID
   */
  readonly playerId: string;

  /**
   * Player archetype determining visual style and theming
   * @korean 원형
   */
  readonly archetype: PlayerArchetype;

  /**
   * Current trigram stance (1 of 8)
   * @korean 현재자세
   */
  readonly stance: TrigramStance;

  /**
   * 3D world position [x, y, z]
   * @korean 위치
   */
  readonly position: [number, number, number];

  /**
   * Rotation in radians (Y-axis)
   * @korean 회전
   */
  readonly rotation: number;

  /**
   * Current health points (0-maxHealth)
   * @korean 건강
   */
  readonly health: number;

  /**
   * Maximum health points
   * @korean 최대건강
   */
  readonly maxHealth: number;

  /**
   * Current stamina points (0-100)
   * @korean 체력
   */
  readonly stamina: number;

  /**
   * Current Ki/energy points (0-100)
   * @korean 기
   */
  readonly ki: number;

  /**
   * Pain level affecting balance and performance (0-100)
   * @korean 통증
   */
  readonly pain: number;

  /**
   * Balance/stability state in combat
   * @korean 균형상태
   */
  readonly balance: BalanceState;

  /**
   * Consciousness level (0-100)
   * @korean 의식
   */
  readonly consciousness: number;

  /**
   * Blood loss amount (0-100)
   * Optional since not all game modes track blood loss
   * @korean 출혈
   */
  readonly bloodLoss?: number;

  /**
   * Whether player is currently blocking
   * @korean 방어중
   */
  readonly isBlocking: boolean;

  /**
   * Whether player is stunned
   * @korean 기절
   */
  readonly isStunned?: boolean;

  /**
   * Whether player is countering
   * @korean 반격중
   */
  readonly isCountering?: boolean;

  /**
   * Current animation state
   * @korean 현재애니메이션
   */
  readonly currentAnimation: PlayerAnimation;

  /**
   * Whether rendering for mobile device (affects scaling and detail)
   * @korean 모바일여부
   */
  readonly isMobile: boolean;

  /**
   * Player display name (Korean and English)
   * @korean 이름
   */
  readonly name?: {
    readonly korean: string;
    readonly english: string;
  };

  /**
   * Scale multiplier for the model (default: 1)
   * @korean 크기
   */
  readonly scale?: number;

  /**
   * Whether to show Html overlay with stats
   * @korean 세부정보표시
   */
  readonly showDetails?: boolean;

  /**
   * Direction the player is facing
   * @korean 방향
   */
  readonly facing?: "left" | "right";

  /**
   * Whether to show health bar
   * @korean 체력바표시
   */
  readonly showHealthBar?: boolean;

  /**
   * Whether to show stance indicator
   * @korean 자세표시기표시
   */
  readonly showStanceIndicator?: boolean;

  /**
   * Callback when animation completes
   * @korean 애니메이션완료콜백
   */
  readonly onAnimationComplete?: () => void;
}

/**
 * Props for PlayerStateIndicators component (Html overlay)
 * 
 * @public
 * @category Component Props
 * @korean 상태표시기속성
 */
export interface PlayerStateIndicatorsProps {
  /**
   * Current health (0-maxHealth)
   * @korean 건강
   */
  readonly health: number;

  /**
   * Maximum health
   * @korean 최대건강
   */
  readonly maxHealth: number;

  /**
   * Current stamina (0-100)
   * @korean 체력
   */
  readonly stamina: number;

  /**
   * Current Ki (0-100)
   * @korean 기
   */
  readonly ki: number;

  /**
   * Balance state
   * @korean 균형상태
   */
  readonly balance: BalanceState;

  /**
   * Consciousness level (0-100)
   * @korean 의식
   */
  readonly consciousness: number;

  /**
   * Pain level (0-100)
   * @korean 통증
   */
  readonly pain?: number;

  /**
   * Blood loss (0-100)
   * @korean 출혈
   */
  readonly bloodLoss?: number;

  /**
   * Mobile responsive mode
   * @korean 모바일여부
   */
  readonly isMobile: boolean;
}

/**
 * Props for StanceAura component (3D effect)
 * 
 * @public
 * @category Component Props
 * @korean 자세오라속성
 */
export interface StanceAuraProps {
  /**
   * Current trigram stance
   * @korean 자세
   */
  readonly stance: TrigramStance;

  /**
   * Aura intensity (0-1, typically Ki / 100)
   * @korean 강도
   */
  readonly intensity: number;

  /**
   * Whether to animate the aura
   * @korean 애니메이션여부
   */
  readonly animated?: boolean;
}


