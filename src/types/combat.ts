/**
 * @fileoverview Combat system types for Korean martial arts game
 */

import type { DamageRange, KoreanText } from "./common";
import type { StatusEffect, HitEffect } from "./effects";
import type { PlayerState } from "./player";
import { TrigramStance, CombatAttackType, DamageType, GameMode } from "./enums";

// Korean martial arts technique
export interface KoreanTechnique {
  readonly id: string;
  readonly name: KoreanText;
  readonly koreanName: string;
  readonly englishName: string;
  readonly romanized: string;
  readonly description: KoreanText;

  // Combat properties
  readonly stance: TrigramStance;
  readonly type: CombatAttackType; // Fix: Use correct enum
  readonly damageType: DamageType;
  readonly damage?: number; // Made optional to fix null issues
  readonly damageRange?: DamageRange;
  readonly range: number;
  readonly kiCost: number;
  readonly staminaCost: number;
  readonly accuracy: number;
  readonly executionTime: number;
  readonly recoveryTime: number;
  readonly critChance: number;
  readonly critMultiplier: number;
  readonly effects: readonly StatusEffect[];
}

// Combat result - Fix: Ensure all properties are properly defined
export interface CombatResult {
  readonly totalDamage: number;
  readonly isCritical: boolean;
  readonly critical: boolean; // Legacy property for backward compatibility
  readonly vitalPointsHit: readonly VitalPoint[];
  readonly vitalPointHit: boolean; // Legacy property for backward compatibility
  readonly criticalHit: boolean; // Legacy property for backward compatibility
  readonly effects: readonly HitEffect[];
  readonly stunChance: number;
  readonly consciousnessLoss: number;
  readonly balanceLoss: number;
  readonly techniqueEffectiveness: number;
  readonly hitType: HitType;
  readonly hitLocation: Position;
  readonly hitDirection: number;
  readonly attacker: PlayerState;
  readonly defender: PlayerState;
}

// Training-specific combat result extension
export interface TrainingCombatResult extends CombatResult {
  readonly trainingData?: {
    readonly accuracy: number;
    readonly damageCalculation: number;
    readonly stanceEffectiveness: number;
    readonly techniqueTiming: number;
  };
}

// Fix: Remove duplicate TrainingCombatResult interface
export interface TrainingCombatResult extends CombatResult {
  readonly accuracyScore: number;
  readonly techniqueScore: number;
  readonly formScore: number;
  readonly improvementAreas: readonly string[];
  readonly nextTrainingGoals: readonly string[];
}

// Fix: Define CombatEventData interface that's used in MatchStatistics
export interface CombatEventData {
  readonly id: string;
  readonly timestamp: number;
  readonly type:
    | "attack"
    | "block"
    | "critical"
    | "vital_point"
    | "stance_change";
  readonly attacker: number; // Player index
  readonly defender: number; // Player index
  readonly damage: number;
  readonly technique?: string;
  readonly result: "hit" | "miss" | "blocked" | "critical";
  readonly effects?: readonly string[];
}

// Combat statistics
export interface CombatStats {
  readonly totalDamage: number;
  readonly criticalHits: number;
  readonly vitalPointHits: number;
  readonly techniquesUsed: number;
  readonly stamina: number;
  readonly ki: number;
}

// Fix: Move combat-specific component props here
export interface CombatScreenProps {
  readonly players: readonly PlayerState[];
  readonly onPlayerUpdate: (
    playerIndex: number,
    updates: Partial<PlayerState>
  ) => void;
  readonly currentRound: number;
  readonly timeRemaining: number;
  readonly isPaused: boolean;
  readonly onReturnToMenu: () => void;
  readonly onGameEnd: (winner: number) => void;
  readonly gameMode?: GameMode;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

export interface CombatArenaProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
  readonly onPlayerClick?: (playerIndex: number) => void;
}

export interface CombatHUDProps {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly currentRound: number;
  readonly timeRemaining: number;
  readonly maxRounds: number;
  readonly isPaused: boolean;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
  readonly onPauseToggle?: () => void;
}

export interface CombatControlsProps {
  readonly onAttack: () => void;
  readonly onDefend: () => void;
  readonly onSwitchStance?: (stance: TrigramStance) => void;
  readonly onPauseToggle: () => void;
  readonly isPaused: boolean;
  readonly player: PlayerState;
  readonly onTechniqueExecute?: (technique: KoreanTechnique) => void;
  readonly onGuard?: () => void;
  readonly isExecutingTechnique?: boolean;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

export interface PlayerStatusPanelProps {
  readonly player: PlayerState;
  readonly position: "left" | "right";
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly isSelected?: boolean;
}

export interface CombatStatsProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly combatLog: readonly string[];
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

export interface Position {
  readonly x: number;
  readonly y: number;
}

// Fix GridPosition to ensure all properties are required
export interface GridPosition {
  readonly x: number;
  readonly y: number;
  readonly row: number;
  readonly col: number;
}

// Add helper to create complete GridPosition
export const createGridPosition = (row: number, col: number): GridPosition => ({
  x: col,
  y: row,
  row,
  col,
});

/**
 * Octagonal grid for traditional Korean martial arts combat
 */
export interface OctagonalGrid {
  readonly size: number;
  readonly validPositions: readonly (readonly boolean[])[];
  readonly centerPosition?: GridPosition; // Add missing property
}

export interface GameEngineProps {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly onPlayerUpdate: (
    playerId: string,
    updates: Partial<PlayerState>
  ) => void;
  readonly width?: number;
  readonly height?: number;
  readonly gameMode?: "versus" | "training";
  readonly realismMode?: boolean;
}

export interface PlayerProps {
  readonly playerState: PlayerState;
  readonly playerIndex: number;
  readonly onClick?: () => void;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly visible?: boolean;
  readonly alpha?: number;
}

export interface PlayerVisualsProps {
  readonly player: PlayerState;
  readonly animationTime?: number;
  readonly showEffects?: boolean;
}

export interface HitEffectsLayerProps {
  readonly effects: readonly HitEffect[];
  readonly onEffectComplete: (effectId: string) => void;
}
