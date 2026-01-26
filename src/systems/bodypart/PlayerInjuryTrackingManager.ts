/**
 * Player Injury Tracking Manager
 * 
 * **Korean**: 플레이어 부상 추적 관리자
 * 
 * Manages per-player injury tracking to prevent mixing injuries between
 * multiple characters in combat scenarios. Each player gets their own
 * InjuryTracker instance.
 * 
 * @module systems/bodypart
 * @category Injury Tracking
 * @korean 부상추적
 */

import { InjuryTracker } from "./InjuryTracker";
import { CombatInjuryIntegration } from "./CombatInjuryIntegration";

/**
 * Manager for per-player injury tracking.
 * 
 * **Korean**: 플레이어별 부상 추적 관리자
 * 
 * Maintains separate {@link InjuryTracker} and {@link CombatInjuryIntegration}
 * instances for each player to ensure injuries don't get mixed between characters.
 * 
 * @example
 * ```typescript
 * const manager = new PlayerInjuryTrackingManager();
 * 
 * // Get or create tracker for a player
 * const player1Tracker = manager.getTrackerForPlayer('player-1');
 * const player1Integration = manager.getIntegrationForPlayer('player-1');
 * 
 * // Record injury for specific player
 * player1Integration.recordCombatDamage({
 *   damage: 35,
 *   bodyRegion: BodyRegion.TORSO,
 *   damageType: DamageType.BLUNT,
 * });
 * 
 * // Clear injuries for a player (e.g., between rounds)
 * manager.clearPlayerInjuries('player-1');
 * ```
 * 
 * @public
 */
export class PlayerInjuryTrackingManager {
  private trackers = new Map<string, InjuryTracker>();
  private integrations = new Map<string, CombatInjuryIntegration>();

  /**
   * Get the InjuryTracker for a specific player, creating it if needed.
   * 
   * **Korean**: 특정 플레이어의 InjuryTracker 가져오기 (필요시 생성)
   * 
   * @param playerId - Unique player identifier (string or number)
   * @returns InjuryTracker instance for the player
   * 
   * @public
   */
  getTrackerForPlayer(playerId: string | number): InjuryTracker {
    const key = String(playerId);
    let tracker = this.trackers.get(key);
    if (!tracker) {
      tracker = new InjuryTracker();
      this.trackers.set(key, tracker);
    }
    return tracker;
  }

  /**
   * Get the CombatInjuryIntegration for a specific player, creating it if needed.
   * 
   * **Korean**: 특정 플레이어의 CombatInjuryIntegration 가져오기 (필요시 생성)
   * 
   * @param playerId - Unique player identifier (string or number)
   * @returns CombatInjuryIntegration instance for the player
   * 
   * @public
   */
  getIntegrationForPlayer(playerId: string | number): CombatInjuryIntegration {
    const key = String(playerId);
    let integration = this.integrations.get(key);
    if (!integration) {
      const tracker = this.getTrackerForPlayer(playerId);
      // Pass complete config with tracker override
      integration = new CombatInjuryIntegration({
        enabled: true,
        minDamage: 5,
        bloodThreshold: 30,
        tracker,
      });
      this.integrations.set(key, integration);
    }
    return integration;
  }

  /**
   * Clear all injuries for a specific player.
   * 
   * **Korean**: 특정 플레이어의 모든 부상 제거
   * 
   * Useful for round resets or when a player is defeated.
   * 
   * @param playerId - Unique player identifier (string or number)
   * 
   * @public
   */
  clearPlayerInjuries(playerId: string | number): void {
    const key = String(playerId);
    const tracker = this.trackers.get(key);
    if (tracker) {
      tracker.clearInjuries();
    }
  }

  /**
   * Remove tracking data for a player (e.g., when they leave the game).
   * 
   * **Korean**: 플레이어 추적 데이터 제거
   * 
   * @param playerId - Unique player identifier (string or number)
   * 
   * @public
   */
  removePlayer(playerId: string | number): void {
    const key = String(playerId);
    this.trackers.delete(key);
    this.integrations.delete(key);
  }

  /**
   * Clear all player tracking data.
   * 
   * **Korean**: 모든 플레이어 추적 데이터 제거
   * 
   * Useful for resetting the entire game state.
   * 
   * @public
   */
  clearAll(): void {
    this.trackers.clear();
    this.integrations.clear();
  }

  /**
   * Get all active player IDs being tracked.
   * 
   * **Korean**: 추적 중인 모든 플레이어 ID 가져오기
   * 
   * @returns Array of player IDs
   * 
   * @public
   */
  getActivePlayerIds(): string[] {
    return Array.from(this.trackers.keys());
  }
}

/**
 * Global singleton manager for player injury tracking.
 * 
 * **Korean**: 플레이어 부상 추적을 위한 전역 싱글톤 관리자
 * 
 * This singleton manages per-player injury trackers to ensure injuries
 * from different characters don't get mixed together.
 * 
 * @example
 * ```typescript
 * import { playerInjuryManager } from '@/systems/bodypart';
 * 
 * // In combat code:
 * const defenderIntegration = playerInjuryManager.getIntegrationForPlayer(defender.id);
 * defenderIntegration.recordCombatDamage({
 *   damage: result.damage,
 *   bodyRegion,
 *   damageType,
 * });
 * ```
 * 
 * @public
 */
export const playerInjuryManager = new PlayerInjuryTrackingManager();
