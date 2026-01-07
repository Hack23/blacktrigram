/**
 * Knockback Physics System for realistic force-based displacement.
 * 
 * **Korean**: 밀침 물리 시스템 (Knockback Physics System)
 * 
 * Implements realistic combat knockback mechanics that calculate force-based
 * displacement when players are hit. The system integrates with BalanceSystem
 * for authentic stumbling/falling reactions.
 * 
 * ## Knockback Mechanics
 * 
 * Knockback force is determined by:
 * - Attack damage and technique type
 * - Impact angle and direction
 * - Current balance state
 * - Stance resistance modifiers (8 trigram stances)
 * 
 * ## Balance Integration
 * 
 * - High balance (>70%): Reduced knockback by 30%
 * - Medium balance (40-70%): Normal knockback
 * - Low balance (<40%): Increased knockback by 50%, stumbling
 * - Critical balance (<20%): Guaranteed fall, 2s recovery
 * 
 * ## Performance
 * 
 * Optimized for 60fps with efficient vector calculations and smooth
 * easing curves for realistic knockback feel.
 * 
 * @module systems/physics/KnockbackPhysics
 * @category Physics System
 * @korean 밀침물리
 */

import * as THREE from 'three';
import { TrigramStance } from '@/types/common';

/**
 * Balance state information for knockback calculations.
 * 
 * **Korean**: 균형 상태 (Balance State)
 * 
 * @public
 * @korean 균형상태
 */
export interface BalanceState {
  /** Current balance value (0-100) */
  readonly current: number;
  /** Maximum balance value (typically 100) */
  readonly max: number;
}

/**
 * Configuration for knockback force calculation.
 * 
 * **Korean**: 밀침 설정 (Knockback Configuration)
 * 
 * @public
 * @korean 밀침설정
 */
export interface KnockbackConfig {
  /** Force magnitude in Newtons */
  readonly force: number;
  /** Normalized attack direction vector (attacker → defender) */
  readonly direction: THREE.Vector3;
  /** Duration of knockback effect in seconds */
  readonly duration: number;
  /** Current balance state */
  readonly balanceState: BalanceState;
  /** Current trigram stance */
  readonly currentStance: TrigramStance;
}

/**
 * Result of knockback calculation.
 * 
 * **Korean**: 밀침 결과 (Knockback Result)
 * 
 * Contains displacement vector, animation timing, and fall determination.
 * 
 * @public
 * @korean 밀침결과
 */
export interface KnockbackResult {
  /** Total knockback displacement vector in world space */
  readonly displacement: THREE.Vector3;
  /** Duration of knockback animation in seconds */
  readonly duration: number;
  /** Vulnerable state duration after knockback ends in seconds */
  readonly recoveryWindow: number;
  /** Whether fall animation should trigger */
  readonly shouldFall: boolean;
}

/**
 * Knockback Physics Engine.
 * 
 * **Korean**: 밀침 물리 엔진
 * 
 * Calculates realistic knockback displacement based on attack force,
 * stance resistance, and balance state. Integrates with BalanceSystem
 * for stumbling and falling mechanics.
 * 
 * @example
 * ```typescript
 * const physics = new KnockbackPhysics();
 * 
 * // Calculate knockback from heavy strike
 * const config: KnockbackConfig = {
 *   force: 800, // 80 damage
 *   direction: new THREE.Vector3(1, 0, 0).normalize(),
 *   duration: 0.8,
 *   balanceState: { current: 35, max: 100 }, // Low balance
 *   currentStance: TrigramStance.LI, // Fire stance (low resistance)
 * };
 * 
 * const result = physics.calculateKnockback(config, 80);
 * // Result: 2.5m base * 1.3 (Fire penalty) * 1.5 (low balance) = ~4.9m
 * // shouldFall: false (balance > 20%)
 * // recoveryWindow: 1.05s (0.7s * 1.5 for low balance)
 * ```
 * 
 * @public
 * @korean 밀침물리
 */
export class KnockbackPhysics {
  /**
   * Calculates knockback displacement and effects.
   * 
   * **Korean**: 밀침 계산 (Calculate Knockback)
   * 
   * Determines knockback distance, duration, and fall state based on:
   * 1. Base knockback from damage amount
   * 2. Stance resistance modifier (8 trigram effects)
   * 3. Balance state modifier (stumbling/falling)
   * 4. Recovery window (vulnerable state after)
   * 
   * @param config - Knockback configuration with force and state
   * @param attackDamage - Damage dealt by attack (0-100+)
   * @returns Knockback result with displacement and timing
   * 
   * @example
   * ```typescript
   * // Light strike on stable player
   * const light = physics.calculateKnockback({
   *   force: 300,
   *   direction: attackVector,
   *   duration: 0.3,
   *   balanceState: { current: 85, max: 100 },
   *   currentStance: TrigramStance.GEON,
   * }, 30);
   * // Result: ~0.3m knockback (0.5m * 0.9 Geon * 0.7 high balance)
   * 
   * // Critical strike on low-balance player
   * const critical = physics.calculateKnockback({
   *   force: 1200,
   *   direction: attackVector,
   *   duration: 1.2,
   *   balanceState: { current: 15, max: 100 },
   *   currentStance: TrigramStance.SON,
   * }, 110);
   * // Result: ~9.6m knockback, shouldFall: true, 3.0s recovery
   * ```
   * 
   * @public
   * @korean 밀침계산
   */
  calculateKnockback(config: KnockbackConfig, attackDamage: number): KnockbackResult {
    // 1. Base knockback distance from damage
    let baseDistance = this.getBaseKnockbackDistance(attackDamage);
    
    // 2. Apply stance resistance modifier
    const stanceResistance = this.getStanceResistanceModifier(config.currentStance);
    baseDistance *= (1 - stanceResistance);
    
    // 3. Apply balance modifier (stumbling/falling)
    const balanceModifier = this.getBalanceModifier(config.balanceState);
    const finalDistance = baseDistance * balanceModifier;
    
    // 4. Calculate displacement vector
    const displacement = config.direction.clone().multiplyScalar(finalDistance);
    
    // 5. Determine duration based on distance
    const duration = this.calculateKnockbackDuration(finalDistance);
    
    // 6. Calculate recovery window (vulnerable state)
    const recoveryWindow = this.calculateRecoveryWindow(attackDamage, config.balanceState);
    
    // 7. Check if balance is critical (should fall)
    const shouldFall = config.balanceState.current < 20;
    
    return {
      displacement,
      duration,
      recoveryWindow,
      shouldFall,
    };
  }

  /**
   * Gets base knockback distance from damage amount.
   * 
   * **Korean**: 기본 밀침 거리 (Base Knockback Distance)
   * 
   * Damage thresholds:
   * - Light (20-40): 0.5m knockback, 0.3s duration
   * - Medium (40-70): 1.2m knockback, 0.5s duration
   * - Heavy (70-100): 2.5m knockback, 0.8s duration
   * - Critical (100+): 4.0m knockback, 1.2s duration + fall
   * 
   * @param damage - Attack damage amount
   * @returns Base knockback distance in meters
   * 
   * @private
   * @korean 기본밀침거리
   */
  private getBaseKnockbackDistance(damage: number): number {
    if (damage < 40) return 0.5;  // Light strike
    if (damage < 70) return 1.2;  // Medium strike
    if (damage < 100) return 2.5; // Heavy strike
    return 4.0; // Critical strike
  }

  /**
   * Gets stance resistance modifier for knockback.
   * 
   * **Korean**: 자세 저항 배율 (Stance Resistance Modifier)
   * 
   * Trigram stance resistance modifiers:
   * - ☶ 간 (Gan/Mountain): +40% resistance (defensive mastery)
   * - ☷ 곤 (Gon/Earth): +30% resistance (grounded techniques)
   * - ☰ 건 (Geon/Heaven): +10% resistance (balanced force)
   * - ☵ 감 (Gam/Water): 0% (neutral, adaptive)
   * - ☱ 태 (Tae/Lake): 0% (neutral, fluid)
   * - ☳ 진 (Jin/Thunder): -10% resistance (explosive power)
   * - ☴ 손 (Son/Wind): -20% resistance (fluid, mobile)
   * - ☲ 리 (Li/Fire): -30% resistance (aggressive, exposed)
   * 
   * @param stance - Current trigram stance
   * @returns Resistance modifier (-0.3 to +0.4)
   * 
   * @private
   * @korean 자세저항배율
   */
  private getStanceResistanceModifier(stance: TrigramStance): number {
    const resistances: Record<TrigramStance, number> = {
      [TrigramStance.GAN]: 0.40,  // Mountain: +40% resistance
      [TrigramStance.GON]: 0.30,  // Earth: +30% resistance
      [TrigramStance.GEON]: 0.10, // Heaven: +10% resistance
      [TrigramStance.GAM]: 0.00,  // Water: neutral
      [TrigramStance.TAE]: 0.00,  // Lake: neutral
      [TrigramStance.JIN]: -0.10, // Thunder: -10% resistance
      [TrigramStance.SON]: -0.20, // Wind: -20% resistance (fluid)
      [TrigramStance.LI]: -0.30,  // Fire: -30% resistance (aggressive)
    };
    return resistances[stance];
  }

  /**
   * Gets balance modifier for knockback distance.
   * 
   * **Korean**: 균형 배율 (Balance Modifier)
   * 
   * Balance thresholds:
   * - High balance (>70%): 0.70x (30% reduction)
   * - Medium balance (40-70%): 1.00x (normal)
   * - Low balance (20-40%): 1.50x (50% increase, stumbling)
   * - Critical balance (<20%): 2.00x (100% increase, falling)
   * 
   * @param balanceState - Current balance state
   * @returns Balance multiplier (0.7 to 2.0)
   * 
   * @private
   * @korean 균형배율
   */
  private getBalanceModifier(balanceState: BalanceState): number {
    const balancePercent = (balanceState.current / balanceState.max) * 100;
    
    if (balancePercent > 70) return 0.70; // High balance: -30% knockback
    if (balancePercent > 40) return 1.00; // Normal knockback
    if (balancePercent > 20) return 1.50; // Low balance: +50% knockback
    return 2.00; // Critical balance: +100% knockback
  }

  /**
   * Calculates knockback animation duration.
   * 
   * **Korean**: 밀침 지속시간 계산 (Calculate Knockback Duration)
   * 
   * Linear relationship between distance and duration:
   * - 0.5m = 0.3s (light)
   * - 1.2m = 0.48s
   * - 2.5m = 0.86s
   * - 4.0m = 1.2s (critical)
   * 
   * @param distance - Knockback distance in meters
   * @returns Duration in seconds
   * 
   * @private
   * @korean 밀침지속시간계산
   */
  private calculateKnockbackDuration(distance: number): number {
    // Linear relationship: 0.5m = 0.3s, 4.0m = 1.2s
    return 0.3 + (distance / 4.0) * 0.9;
  }

  /**
   * Calculates recovery window (vulnerability duration).
   * 
   * **Korean**: 회복 대기시간 계산 (Calculate Recovery Window)
   * 
   * Recovery windows by damage:
   * - Light (<40): 0.2s vulnerability
   * - Medium (40-70): 0.4s vulnerability
   * - Heavy (70-100): 0.7s vulnerability
   * - Critical (100+): 1.5s vulnerability + grounded
   * 
   * Low balance increases vulnerability by 50%.
   * 
   * @param damage - Attack damage amount
   * @param balanceState - Current balance state
   * @returns Vulnerability duration in seconds
   * 
   * @private
   * @korean 회복대기시간계산
   */
  private calculateRecoveryWindow(damage: number, balanceState: BalanceState): number {
    // Base recovery time from damage
    const baseRecoveryTime = damage < 40 ? 0.2 : damage < 70 ? 0.4 : damage < 100 ? 0.7 : 1.5;
    
    // Increase recovery time if balance is low (more vulnerable)
    const balancePercent = (balanceState.current / balanceState.max) * 100;
    const balanceModifier = balancePercent < 40 ? 1.5 : 1.0;
    
    return baseRecoveryTime * balanceModifier;
  }

  /**
   * Applies knockback force to player position over time.
   * 
   * **Korean**: 밀침 힘 적용 (Apply Knockback Force)
   * 
   * Uses smooth ease-out cubic curve for realistic knockback feel:
   * - Fast initial displacement (impact)
   * - Gradual deceleration (friction/resistance)
   * - Smooth stop at final position
   * 
   * @param playerPosition - Current player position
   * @param result - Knockback result with displacement
   * @param deltaTime - Time elapsed since knockback started
   * @param progress - Knockback progress (0 to 1)
   * @returns New player position
   * 
   * @example
   * ```typescript
   * // In game loop (60fps)
   * const newPosition = physics.applyKnockbackForce(
   *   playerPosition,
   *   knockbackResult,
   *   deltaTime,
   *   elapsedTime / knockbackResult.duration
   * );
   * 
   * // Progress 0.0: At original position
   * // Progress 0.5: ~88% of total displacement (ease-out)
   * // Progress 1.0: At final position
   * ```
   * 
   * @public
   * @korean 밀침힘적용
   */
  applyKnockbackForce(
    playerPosition: THREE.Vector3,
    result: KnockbackResult,
    _deltaTime: number,
    progress: number
  ): THREE.Vector3 {
    // Clamp progress to [0, 1]
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    // Smooth knockback curve (ease-out cubic)
    // Fast initial impact, gradual deceleration
    const easedProgress = 1 - Math.pow(1 - clampedProgress, 3);
    
    // Calculate position along knockback path
    const currentDisplacement = result.displacement.clone().multiplyScalar(easedProgress);
    
    return playerPosition.clone().add(currentDisplacement);
  }

  /**
   * Checks if player is currently in knockback state.
   * 
   * **Korean**: 밀침 상태 확인 (Check Knockback State)
   * 
   * @param elapsedTime - Time elapsed since knockback started
   * @param duration - Total knockback duration
   * @returns True if still in knockback animation
   * 
   * @public
   * @korean 밀침상태확인
   */
  isInKnockback(elapsedTime: number, duration: number): boolean {
    return elapsedTime < duration;
  }

  /**
   * Checks if player is in recovery window (vulnerable state).
   * 
   * **Korean**: 회복 대기 확인 (Check Recovery Window)
   * 
   * @param elapsedTime - Time elapsed since knockback ended
   * @param recoveryWindow - Total recovery window duration
   * @returns True if in vulnerable recovery state
   * 
   * @public
   * @korean 회복대기확인
   */
  isInRecoveryWindow(elapsedTime: number, recoveryWindow: number): boolean {
    return elapsedTime < recoveryWindow;
  }

  /**
   * Gets bilingual Korean-English name for knockback state.
   * 
   * **Korean**: 밀침 상태 이름 (Knockback State Name)
   * 
   * @param shouldFall - Whether knockback causes fall
   * @returns Korean and English state names
   * 
   * @public
   * @korean 밀침상태이름
   */
  static getKnockbackStateName(shouldFall: boolean): { korean: string; english: string } {
    if (shouldFall) {
      return {
        korean: "넘어짐",
        english: "Falling",
      };
    }
    
    return {
      korean: "밀침",
      english: "Knockback",
    };
  }

  /**
   * Gets bilingual Korean-English name for recovery state.
   * 
   * **Korean**: 회복 상태 이름 (Recovery State Name)
   * 
   * @returns Korean and English state names
   * 
   * @public
   * @korean 회복상태이름
   */
  getRecoveryStateName(): { korean: string; english: string } {
    return {
      korean: "회복",
      english: "Recovery",
    };
  }

  /**
   * Gets bilingual Korean-English name for stumbling state.
   * 
   * **Korean**: 휘청거림 상태 이름 (Stumbling State Name)
   * 
   * @returns Korean and English state names
   * 
   * @public
   * @korean 휘청거림상태이름
   */
  getStumblingStateName(): { korean: string; english: string } {
    return {
      korean: "휘청거림",
      english: "Stumbling",
    };
  }
}

export default KnockbackPhysics;
