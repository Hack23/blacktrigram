/**
 * Combat Injury Integration
 * 
 * **Korean**: 전투 부상 통합
 * 
 * Integrates InjuryTracker with combat damage events to automatically
 * record injuries and trigger visual trauma effects during combat.
 * 
 * @module systems/bodypart/CombatInjuryIntegration
 * @category Body Part System
 * @korean 전투부상통합
 */

import * as THREE from "three";
import { BodyRegion, DamageType } from "../../types/common";
import { InjuryTracker } from "./InjuryTracker";
import {
  getInjuryPositionWithOffset,
  mapBodyRegionToBodyPart,
} from "./BodyPartPositionMapping";
import { InjuryType } from "../../types/injury";

/**
 * Combat damage event data.
 * 
 * **Korean**: 전투 피해 이벤트 데이터
 * 
 * @public
 */
export interface CombatDamageEvent {
  /** Damage amount (0-100) */
  readonly damage: number;
  /** Body region hit */
  readonly bodyRegion: BodyRegion;
  /** Damage type */
  readonly damageType?: DamageType;
  /** Optional specific position override */
  readonly position?: THREE.Vector3;
  /** Whether this is a critical hit */
  readonly isCritical?: boolean;
}

/**
 * Configuration for combat injury integration.
 * 
 * @public
 */
export interface CombatInjuryConfig {
  /** Enable automatic injury tracking */
  readonly enabled: boolean;
  /** Minimum damage to create injury */
  readonly minDamage: number;
  /** Damage threshold for blood effects */
  readonly bloodThreshold: number;
  /** Use InjuryTracker singleton */
  readonly tracker?: InjuryTracker;
}

/**
 * Default combat injury configuration.
 * 
 * @public
 */
export const DEFAULT_COMBAT_INJURY_CONFIG: CombatInjuryConfig = {
  enabled: true,
  minDamage: 5,
  bloodThreshold: 30,
} as const;

/**
 * Combat Injury Integration Handler.
 * 
 * **Korean**: 전투 부상 통합 핸들러
 * 
 * Processes combat damage events and records injuries for visualization.
 * Automatically maps damage types to injury types and applies blood effects.
 * 
 * @example
 * ```typescript
 * const handler = new CombatInjuryIntegration();
 * 
 * // On combat hit
 * handler.recordCombatDamage({
 *   damage: 35,
 *   bodyRegion: BodyRegion.TORSO,
 *   damageType: DamageType.BLUNT,
 * });
 * 
 * // Get injuries for visualization
 * const injuries = handler.getInjuries();
 * ```
 * 
 * @public
 */
export class CombatInjuryIntegration {
  private tracker: InjuryTracker;
  private config: CombatInjuryConfig;

  constructor(config: CombatInjuryConfig = DEFAULT_COMBAT_INJURY_CONFIG) {
    this.config = config;
    // Require explicit tracker - do not fall back to deprecated singleton
    // Use PlayerInjuryTrackingManager to get per-character trackers instead
    if (!config.tracker) {
      throw new Error(
        'CombatInjuryIntegration requires an explicit InjuryTracker. ' +
        'Use PlayerInjuryTrackingManager.getIntegrationForPlayer(playerId) instead of ' +
        'creating instances directly, or pass { tracker: new InjuryTracker() } for testing.'
      );
    }
    this.tracker = config.tracker;
  }

  /**
   * Record injury from combat damage event.
   * 
   * **Korean**: 전투 피해로부터 부상 기록
   * 
   * Automatically determines injury type from damage type and applies
   * appropriate visual effects.
   * 
   * @param event - Combat damage event
   * @returns Whether injury was recorded (false if damage too low)
   * 
   * @public
   */
  recordCombatDamage(event: CombatDamageEvent): boolean {
    if (!this.config.enabled) {
      return false;
    }

    if (event.damage < this.config.minDamage) {
      return false;
    }

    // Determine injury type from damage type
    const injuryType = this.getInjuryTypeFromDamage(event.damageType);

    // Get position for injury
    const position =
      event.position ?? getInjuryPositionWithOffset(event.bodyRegion, 0.15);

    // Map body region to body part
    const bodyPart = mapBodyRegionToBodyPart(event.bodyRegion);

    // Record injury
    const recordedInjury = this.tracker.recordInjury(
      bodyPart,
      event.bodyRegion,
      position,
      event.damage,
      injuryType
    );

    // Return true only if the injury was actually recorded
    return recordedInjury !== null;
  }

  /**
   * Check if damage should trigger blood effects.
   * 
   * **Korean**: 피해가 출혈 효과를 발생시켜야 하는지 확인
   * 
   * @param damage - Damage amount
   * @returns Whether to show blood effects
   * 
   * @public
   */
  shouldShowBloodEffect(damage: number): boolean {
    return damage > this.config.bloodThreshold;
  }

  /**
   * Get injury type from damage type.
   * 
   * **Korean**: 피해 타입으로부터 부상 타입 가져오기
   * 
   * @param damageType - Type of damage dealt
   * @returns Corresponding injury type for visualization
   * 
   * @private
   */
  private getInjuryTypeFromDamage(damageType?: DamageType): InjuryType {
    if (!damageType) {
      return InjuryType.BRUISE; // Default to bruise
    }

    switch (damageType) {
      case DamageType.BLUNT:
      case DamageType.IMPACT:
      case DamageType.CRUSHING:
        return InjuryType.BRUISE;

      case DamageType.PIERCING:
      case DamageType.SHARP:
        return InjuryType.CUT;

      case DamageType.SLASHING:
        return InjuryType.LACERATION;

      case DamageType.JOINT:
        return InjuryType.FRACTURE;

      default:
        return InjuryType.BRUISE;
    }
  }

  /**
   * Get all tracked injuries.
   * 
   * **Korean**: 모든 추적된 부상 가져오기
   * 
   * @returns Array of injuries
   * 
   * @public
   */
  getInjuries() {
    return this.tracker.getInjuries();
  }

  /**
   * Get tracker instance.
   * 
   * @returns InjuryTracker instance
   * 
   * @public
   */
  getTracker(): InjuryTracker {
    return this.tracker;
  }

  /**
   * Clear all injuries (for new round/match).
   * 
   * **Korean**: 모든 부상 초기화
   * 
   * @public
   */
  clearInjuries(): void {
    this.tracker.clearInjuries();
  }

  /**
   * Remove expired injuries.
   * 
   * **Korean**: 만료된 부상 제거
   * 
   * @public
   */
  removeExpiredInjuries(): void {
    this.tracker.removeExpiredInjuries();
  }
}

/**
 * @deprecated Use {@link PlayerInjuryTrackingManager} instead to get per-player instances.
 * 
 * Creating a singleton is no longer supported because it mixes injuries between
 * multiple characters. Use `playerInjuryManager.getIntegrationForPlayer(playerId)`
 * to get a properly scoped integration instance.
 * 
 * **Korean**: PlayerInjuryTrackingManager를 사용하여 플레이어별 인스턴스를 가져오세요
 * 
 * @example
 * ```typescript
 * // OLD (deprecated):
 * // import { combatInjuryIntegration } from '@/systems/bodypart';
 * 
 * // NEW (correct):
 * import { playerInjuryManager } from '@/systems/bodypart';
 * const integration = playerInjuryManager.getIntegrationForPlayer(playerId);
 * ```
 * 
 * @public
 */
// Singleton export removed - use PlayerInjuryTrackingManager instead
