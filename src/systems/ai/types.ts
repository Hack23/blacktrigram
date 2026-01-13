/**
 * AI Combat System Type Definitions
 * 
 * Core types for AI decision-making and combat behavior.
 * Separated to avoid circular dependencies between modules.
 * 
 * @module systems/ai/types
 * @category AI Combat
 * @korean AI 전투 시스템 타입 정의
 */

import { Position, TrigramStance } from "@/types";
import { BalanceState } from "@/types/player-visual";

/**
 * AI action types
 * 
 * @korean AI 행동 유형
 */
export enum AIActionType {
  ATTACK = "attack",
  TECHNIQUE = "technique",
  DEFEND = "defend",
  COUNTER = "counter",
  RETREAT = "retreat",
  APPROACH = "approach",
  CIRCLE = "circle",
  STANCE_CHANGE = "stance_change",
  FEINT = "feint",
  WAIT = "wait",
  COMBO = "combo",
}

/**
 * AI decision result
 * 
 * @korean AI 결정 결과
 */
export interface AIDecision {
  readonly action: AIActionType;
  readonly targetPosition?: Position;
  readonly targetStance?: TrigramStance;
  readonly targetVitalPoint?: string; // ID of vital point to target
  readonly priority: number; // 0-10: Decision confidence
  readonly reason: string; // For debugging/analysis
}

/**
 * Vulnerability assessment context for exploitation tactics
 * 
 * Comprehensive analysis of opponent's defenseless states:
 * - **isHelpless**: Balance === HELPLESS (90% takedown priority)
 * - **isVulnerable**: Balance === VULNERABLE or HELPLESS (70% aggressive attack priority)
 * - **isShaken**: Balance === SHAKEN, VULNERABLE, or HELPLESS (50% pressure tactics priority)
 * - **hasLowStamina**: Stamina < 20% (60% exploitation priority)
 * - **hasNoKi**: Ki < 10% (50% technique spam priority)
 * - **overallVulnerability**: Composite vulnerability score (0.0-1.0)
 * 
 * @korean 취약성 평가 컨텍스트
 */
export interface VulnerabilityContext {
  readonly isHelpless: boolean; // balance === HELPLESS
  readonly isVulnerable: boolean; // balance === VULNERABLE or HELPLESS
  readonly isShaken: boolean; // balance === SHAKEN, VULNERABLE, or HELPLESS
  readonly hasLowStamina: boolean; // stamina < 20%
  readonly hasNoKi: boolean; // ki < 10%
  readonly overallVulnerability: number; // 0.0-1.0 composite score
}

/**
 * Combat context for decision making
 * 
 * @korean 전투 컨텍스트
 */
export interface CombatContext {
  readonly playerPosition: Position;
  readonly opponentPosition: Position;
  readonly playerHealth: number;
  readonly playerMaxHealth: number;
  readonly playerKi: number;
  readonly playerMaxKi: number;
  readonly playerStamina: number;
  readonly playerMaxStamina: number;
  readonly opponentHealth: number;
  readonly opponentStance: TrigramStance;
  readonly playerStance: TrigramStance;
  readonly distanceToOpponent: number;
  readonly timeInMatch: number;
  readonly isOpponentAttacking: boolean;
  readonly recentDamageTaken: number;
  readonly opponentBalance?: BalanceState; // Balance state: "READY" | "SHAKEN" | "VULNERABLE" | "HELPLESS"
  readonly opponentStamina?: number; // Opponent stamina for exploitation
  readonly opponentMaxStamina?: number; // Opponent max stamina
  readonly opponentKi?: number; // Opponent ki for exploitation
  readonly opponentMaxKi?: number; // Opponent max ki
  readonly stanceFatigue?: {
    readonly timeInStance: number; // Milliseconds in current stance
  };
  readonly arenaBounds: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
}
