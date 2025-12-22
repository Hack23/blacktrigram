/**
 * Utility functions for Pain and Consciousness management in combat.
 * 
 * **Korean**: 고통 의식 관리 유틸리티
 * 
 * Provides helper functions for managing pain and consciousness effects
 * in combat scenarios, including status checking, effect application,
 * and recovery management.
 * 
 * @module systems/combat/painConsciousnessUtils
 * @category Combat System
 */

import { PlayerState } from "../player";
import { VitalPointCategory } from "@/types";
import { CombatResult } from "./types";
import PainResponseSystem, { PainLevel, ShockPainEffect } from "./PainResponseSystem";
import ConsciousnessSystem, { ConsciousnessLevel } from "./ConsciousnessSystem";

/**
 * Pain and consciousness status information.
 */
export interface PainConsciousnessStatus {
  /** Current pain level */
  readonly painLevel: PainLevel;
  /** Current consciousness level */
  readonly consciousnessLevel: ConsciousnessLevel;
  /** Whether player is in pain overload */
  readonly isInPainOverload: boolean;
  /** Whether player is at incapacitation threshold */
  readonly isIncapacitated: boolean;
  /** Whether player is combat effective */
  readonly isCombatEffective: boolean;
  /** Overall combat effectiveness percentage (0-1) */
  readonly combatEffectiveness: number;
  /** Bilingual status description */
  readonly statusDescription: {
    readonly korean: string;
    readonly english: string;
  };
}

/**
 * Gets comprehensive pain and consciousness status for a player.
 * 
 * @param player - Player to check status for
 * @param painSystem - Pain response system instance
 * @param consciousnessSystem - Consciousness system instance
 * @returns Comprehensive status information
 * 
 * @example
 * ```typescript
 * const status = getPainConsciousnessStatus(player, painSystem, consciousnessSystem);
 * console.log(`Combat effectiveness: ${status.combatEffectiveness * 100}%`);
 * console.log(`Status: ${status.statusDescription.english}`);
 * ```
 * 
 * @public
 * @korean 상태확인
 */
export function getPainConsciousnessStatus(
  player: PlayerState,
  painSystem: PainResponseSystem,
  consciousnessSystem: ConsciousnessSystem
): PainConsciousnessStatus {
  const painLevel = painSystem.getPainLevel(player.pain);
  const consciousnessLevel = consciousnessSystem.getLevel(player.consciousness);
  
  const isInPainOverload = painSystem.isInPainOverload(player);
  const isIncapacitated = consciousnessSystem.isAtIncapacitationThreshold(player);
  
  // Calculate overall combat effectiveness
  const painPenalty = painSystem.getEffects(painLevel).performancePenalty;
  const consciousnessPenalty = consciousnessSystem.getEffects(consciousnessLevel).accuracyPenalty;
  const combatEffectiveness = Math.max(0, 1 - Math.max(painPenalty, consciousnessPenalty));
  
  const isCombatEffective = combatEffectiveness > 0.5;
  
  // Generate status description
  const painName = painSystem.getLevelName(painLevel);
  const consciousnessName = consciousnessSystem.getLevelName(consciousnessLevel);
  
  let statusKorean = `고통: ${painName.korean}, 의식: ${consciousnessName.korean}`;
  let statusEnglish = `Pain: ${painName.english}, Consciousness: ${consciousnessName.english}`;
  
  if (isIncapacitated) {
    statusKorean = "무력화 상태";
    statusEnglish = "Incapacitated";
  } else if (isInPainOverload) {
    statusKorean = "고통 과부하";
    statusEnglish = "Pain Overload";
  }
  
  return {
    painLevel,
    consciousnessLevel,
    isInPainOverload,
    isIncapacitated,
    isCombatEffective,
    combatEffectiveness,
    statusDescription: {
      korean: statusKorean,
      english: statusEnglish,
    },
  };
}

/**
 * Determines if a combat result should trigger head trauma.
 * 
 * Head trauma occurs for:
 * - Neurological vital point hits
 * - Vascular hits to head region
 * - High damage hits (>25) that could cause concussion
 * - Critical hits to upper body
 * 
 * @param result - Combat result to check
 * @param category - Vital point category if known
 * @returns True if result should cause head trauma
 * 
 * @public
 * @korean 두부외상확인
 */
export function isHeadTraumaHit(
  result: CombatResult,
  category?: VitalPointCategory
): boolean {
  // Neurological hits often target head
  if (category === VitalPointCategory.NEUROLOGICAL) {
    return true;
  }
  
  // Vascular hits to head region
  if (category === VitalPointCategory.VASCULAR && result.damage > 15) {
    return true;
  }
  
  // High damage hits that could concuss
  if (result.damage > 25) {
    return true;
  }
  
  // Critical hits to vital points
  if (result.isCritical && result.vitalPointHit) {
    return true;
  }
  
  return false;
}

/**
 * Extracts vital point category from combat result.
 * 
 * Uses heuristics to determine category from effect sources and hit data.
 * 
 * @param result - Combat result
 * @returns Vital point category if determinable
 * 
 * @public
 * @korean 급소분류추출
 */
export function extractVitalPointCategory(result: CombatResult): VitalPointCategory | undefined {
  if (!result.vitalPointHit || !result.effects || result.effects.length === 0) {
    return undefined;
  }
  
  const effect = result.effects[0];
  if (!effect.source) {
    return undefined;
  }
  
  const source = effect.source.toLowerCase();
  
  // Map source strings to categories
  if (source.includes('neuro') || source.includes('nerve')) {
    return VitalPointCategory.NEUROLOGICAL;
  }
  if (source.includes('vascular') || source.includes('blood') || source.includes('artery')) {
    return VitalPointCategory.VASCULAR;
  }
  if (source.includes('respiratory') || source.includes('breath') || source.includes('lung')) {
    return VitalPointCategory.RESPIRATORY;
  }
  if (source.includes('skeletal') || source.includes('bone')) {
    return VitalPointCategory.SKELETAL;
  }
  if (source.includes('muscular') || source.includes('muscle')) {
    return VitalPointCategory.MUSCULAR;
  }
  if (source.includes('organ') || source.includes('visceral')) {
    return VitalPointCategory.ORGAN;
  }
  if (source.includes('joint')) {
    return VitalPointCategory.JOINT;
  }
  
  return undefined;
}

/**
 * Calculates recommended recovery time based on player condition.
 * 
 * @param player - Player state
 * @param consciousnessSystem - Consciousness system
 * @returns Estimated recovery time in seconds
 * 
 * @example
 * ```typescript
 * const recoveryTime = getRecommendedRecoveryTime(player, consciousnessSystem);
 * console.log(`Recovery needed: ${recoveryTime}s`);
 * ```
 * 
 * @public
 * @korean 회복시간계산
 */
export function getRecommendedRecoveryTime(
  player: PlayerState,
  consciousnessSystem: ConsciousnessSystem
): number {
  let painRecoveryTime = 0;
  let consciousnessRecoveryTime = 0;
  
  // Pain recovery time (-5 pain/second)
  if (player.pain > 0) {
    painRecoveryTime = player.pain / 5;
  }
  
  // Consciousness recovery time (5 points/second after 5s delay)
  if (player.consciousness < 100) {
    const consciousnessToRecover = 100 - player.consciousness;
    const consciousnessLevel = consciousnessSystem.getLevel(player.consciousness);
    
    // Account for slower recovery at low consciousness
    let recoveryRate = 5; // Base rate
    if (consciousnessLevel === ConsciousnessLevel.STUNNED) {
      recoveryRate = 2.5; // 50% slower
    } else if (consciousnessLevel === ConsciousnessLevel.UNCONSCIOUS) {
      recoveryRate = 1; // 20% of base
    }
    
    consciousnessRecoveryTime = 5 + (consciousnessToRecover / recoveryRate);
  }
  
  // Since pain and consciousness recover in parallel (concurrently in game loop),
  // return the maximum of the two recovery times, not the sum
  return Math.ceil(Math.max(painRecoveryTime, consciousnessRecoveryTime));
}

/**
 * Checks if shock pain effect is still active.
 * 
 * @param shockEffect - Shock pain effect to check
 * @returns True if effect is still active
 * 
 * @public
 * @korean 충격통활성확인
 */
export function isShockPainActive(shockEffect: ShockPainEffect): boolean {
  const elapsed = Date.now() - shockEffect.startTime;
  return elapsed < shockEffect.duration;
}

/**
 * Gets remaining shock pain duration.
 * 
 * @param shockEffect - Shock pain effect
 * @returns Remaining duration in milliseconds, or 0 if expired
 * 
 * @public
 * @korean 충격통잔여시간
 */
export function getShockPainRemainingDuration(shockEffect: ShockPainEffect): number {
  const elapsed = Date.now() - shockEffect.startTime;
  return Math.max(0, shockEffect.duration - elapsed);
}

/**
 * Formats pain and consciousness values for display.
 * 
 * @param player - Player state
 * @returns Formatted display strings
 * 
 * @example
 * ```typescript
 * const display = formatPainConsciousnessDisplay(player);
 * console.log(display.pain); // "Pain: 45/100"
 * console.log(display.consciousness); // "Consciousness: 85/100"
 * ```
 * 
 * @public
 * @korean 표시형식
 */
export function formatPainConsciousnessDisplay(player: PlayerState): {
  readonly pain: string;
  readonly consciousness: string;
  readonly painKorean: string;
  readonly consciousnessKorean: string;
} {
  return {
    pain: `Pain: ${Math.floor(player.pain)}/100`,
    consciousness: `Consciousness: ${Math.floor(player.consciousness)}/100`,
    painKorean: `고통: ${Math.floor(player.pain)}/100`,
    consciousnessKorean: `의식: ${Math.floor(player.consciousness)}/100`,
  };
}
