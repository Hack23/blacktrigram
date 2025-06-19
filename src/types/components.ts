/**
 * @fileoverview Component prop interfaces for Korean martial arts game
 */

import type { ReactNode } from "react";
import type * as PIXI from "pixi.js";
import type { PlayerState } from "./player";
import type { GameMode } from "./game";
import type { TrigramStance } from "./enums";

// Base component props interface
export interface BaseComponentProps {
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly visible?: boolean;
  readonly interactive?: boolean;
  readonly alpha?: number;
  readonly rotation?: number;
  readonly scale?: number | { x: number; y: number };
  readonly anchor?: number | { x: number; y: number };
  readonly pivot?: number | { x: number; y: number };
  readonly tint?: number;
  readonly blendMode?: PIXI.BLEND_MODES;
  readonly filters?: PIXI.Filter[];
  readonly mask?: PIXI.Container; // Fix: Use Container instead of DisplayObject
  readonly renderable?: boolean;
  readonly zIndex?: number;
  readonly name?: string;
  readonly accessibleTitle?: string;
  readonly accessibleHint?: string;
  readonly tabIndex?: number;
}

// Screen component props
export interface IntroScreenProps extends BaseComponentProps {
  readonly onMenuSelect: (mode: GameMode) => void;
  readonly onArchetypeSelect?: (archetype: PlayerArchetype) => void;
  readonly selectedArchetype?: PlayerArchetype;
}

export interface TrainingScreenProps extends BaseComponentProps {
  readonly onReturnToMenu: () => void;
  readonly player?: PlayerState; // Fix: Add optional player prop
  readonly selectedArchetype?: PlayerArchetype; // Fix: Add optional selectedArchetype prop
  readonly onPlayerUpdate?: (updates: Partial<PlayerState>) => void; // Fix: Add optional onPlayerUpdate prop
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

export interface CombatScreenProps extends BaseComponentProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly currentRound: number;
  readonly timeRemaining: number;
  readonly isPaused: boolean;
  readonly onPlayerUpdate: (
    playerIndex: number, // Fix: Use number instead of 0|1
    updates: Partial<PlayerState> // Fix: Use Partial<PlayerState> instead of PlayerState
  ) => void;
  readonly onReturnToMenu: () => void;
  readonly onGameEnd: (winner: number) => void;
  readonly gameMode?: GameMode;
  readonly matchStatistics?: MatchStatistics; // Fix: Add missing prop
  readonly width?: number;
  readonly height?: number;
}

export interface EndScreenProps extends BaseComponentProps {
  readonly winner?: PlayerState | null; // Fix: Use PlayerState instead of number
  readonly matchStatistics: MatchStatistics;
  readonly onReturnToMenu: () => void;
  readonly onRestart?: () => void; // Fix: Make optional
  readonly onPlayAgain?: () => void; // Fix: Add onPlayAgain prop
  readonly width?: number;
  readonly height?: number;
}

// Combat component props
export interface CombatArenaProps {
  readonly players: readonly PlayerState[];
  readonly onPlayerClick?: (idx: number) => void;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

export interface CombatHUDProps {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly timeRemaining: number;
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly isPaused?: boolean;
  readonly onPauseToggle?: () => void;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

export interface CombatControlsProps {
  readonly onAttack: () => void;
  readonly onDefend: () => void;
  readonly onSwitchStance: (stance: TrigramStance) => void;
  readonly player: PlayerState;
  readonly onTechniqueExecute?: (technique: KoreanTechnique) => void;
  readonly isExecutingTechnique?: boolean;
  readonly onPauseToggle?: () => void;
  readonly isPaused?: boolean;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

export interface CombatStatsProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly combatLog: readonly string[];
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
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

export interface GameEngineProps {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly onPlayerUpdate: (
    playerId: string,
    updates: Partial<PlayerState>
  ) => void;
  readonly width: number;
  readonly height: number;
  readonly isPaused?: boolean;
  readonly gameMode?: string;
}

export interface PlayerProps {
  readonly playerState: PlayerState;
  readonly playerIndex: number;
  readonly onClick: () => void;
  readonly x?: number;
  readonly y?: number;
  readonly gridPosition?: GridPosition;
  readonly gridSize?: number;
  readonly isActive?: boolean;
}

export interface PlayerVisualsProps {
  readonly playerState: PlayerState;
  readonly x?: number;
  readonly y?: number;
  readonly animationState?: string;
  readonly scale?: number;
  readonly showDetails?: boolean;
  readonly showHitboxes?: boolean;
}

export interface HitEffectsLayerProps {
  readonly effects: readonly HitEffect[];
  readonly onEffectComplete: (effectId: string) => void;
}

/**
 * Props for combat-related UI components
 */
export interface CombatStatsProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly combatLog: readonly string[];
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
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

// UI component props
export interface ControlsSectionProps extends BaseComponentProps {
  readonly onBack: () => void;
}

export interface KoreanHeaderProps extends BaseComponentProps {
  readonly title: KoreanText;
  readonly subtitle?: KoreanText;
  readonly size?: "small" | "medium" | "large";
  readonly alignment?: "left" | "center" | "right";
  readonly fontSize?: number;
  readonly textColor?: number;
  readonly accentColor?: number;
  readonly showUnderline?: boolean;
  readonly align?: "left" | "center" | "right";
}

export interface TrigramWheelProps extends BaseComponentProps {
  readonly currentStance: TrigramStance; // Fix: Make required instead of optional
  readonly onStanceSelect?: (stance: TrigramStance) => void;
  readonly size?: number;
  readonly radius?: number;
  readonly interactive?: boolean;
  readonly showLabels?: boolean;
}

export interface BaseButtonProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  koreanText?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
  children?: React.ReactNode;
  testId?: string;
}

export interface StanceIndicatorProps extends BaseComponentProps {
  readonly stance: TrigramStance;
  readonly size?: number;
  readonly showText?: boolean;
  readonly glowEffect?: boolean;
}

export interface ProgressTrackerProps extends BaseComponentProps {
  readonly progress: number;
  readonly maxProgress: number;
  readonly label?: string;
  readonly showPercentage?: boolean;
}

export interface RoundTimerProps extends BaseComponentProps {
  readonly timeRemaining: number;
  readonly totalTime: number; // Fix: Change from maxTime to totalTime
  readonly isPaused?: boolean;
  readonly showWarning?: boolean;
}

export interface ScoreDisplayProps extends BaseComponentProps {
  readonly player1Score: number;
  readonly player2Score: number;
  readonly maxScore?: number;
}

// Game component props
export interface PlayerProps extends BaseComponentProps {
  readonly playerState: PlayerState;
  readonly playerIndex: number;
  readonly onClick?: () => void;
}

export interface PlayerVisualsProps extends BaseComponentProps {
  readonly playerState: PlayerState;
  readonly animationState?: string;
  readonly showHitboxes?: boolean;
}

export interface DojangBackgroundProps extends BaseComponentProps {
  readonly animate?: boolean;
  readonly lighting?: "normal" | "cyberpunk" | "traditional";
}

// Fix: Add missing GameEngineProps
export interface GameEngineProps {
  readonly players: readonly PlayerState[];
  readonly onPlayerUpdate: (
    playerIndex: number,
    updates: Partial<PlayerState>
  ) => void;
  readonly onCombatResult: (result: CombatResultType) => void; // Fix: Use imported type
  readonly onGameEvent: (event: string, data?: any) => void;
  readonly isPaused?: boolean;
  readonly gameMode?: GameMode;
  readonly width?: number;
  readonly height?: number;
}

// Fix: Add missing MenuSectionProps
export interface MenuSectionProps {
  readonly selectedMode: GameMode;
  readonly onModeSelect: (mode: GameMode) => void;
  readonly onStartGame: () => void;
  readonly onShowPhilosophy: () => void;
  readonly onShowControls: () => void;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

// Fix: Update GameUIProps to include gameState property
export interface GameUIProps {
  readonly gameState: {
    readonly players: readonly [PlayerState, PlayerState];
    readonly timeRemaining: number;
    readonly currentRound: number;
    readonly maxRounds: number;
    readonly isPaused: boolean;
  };
  readonly onStateChange: (newState: any) => void;
  readonly onReturnToMenu: () => void;
  readonly onPlayerUpdate: (updates: any) => void;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

// Export common PIXI components for convenience
export type PixiContainer = PIXI.Container;
export type PixiGraphics = PIXI.Graphics;
export type PixiText = PIXI.Text;
export type PixiSprite = PIXI.Sprite;
export type PixiTextStyle = PIXI.TextStyle;

// Re-export useful types
export type {
  PlayerState,
  GameMode,
  MatchStatistics,
  KoreanText,
  KoreanTechnique,
  TrigramStance,
  PlayerArchetype,
} from "./index";

// Fix: Remove duplicate CombatResult interface - use the one from combat.ts
export type CombatResult = CombatResultType;

// Fix: Unify HitEffect interfaces - use the one from effects.ts
export type { HitEffect } from "./effects";
export type PixiText = PIXI.Text;
export type PixiSprite = PIXI.Sprite;
export type PixiTextStyle = PIXI.TextStyle;

// Re-export useful types
export type {
  PlayerState,
  GameMode,
  MatchStatistics,
  KoreanText,
  KoreanTechnique,
  TrigramStance,
  PlayerArchetype,
} from "./index";

// Fix: Remove duplicate CombatResult interface - use the one from combat.ts
export type CombatResult = CombatResultType;

// Fix: Unify HitEffect interfaces - use the one from effects.ts
export type { HitEffect } from "./effects";
