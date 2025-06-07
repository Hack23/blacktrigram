// Combat component prop interfaces for Black Trigram Korean martial arts game

import type {
  FederatedPointerEvent,
  Graphics,
  Texture,
  TextStyle, // Keep TextStyle
  DisplayObject,
  Container, // Added for onPointerTap target
} from "pixi.js";
import type React from "react";
import type { ReactNode } from "react";
import type {
  PlayerState,
  GameState,
  GamePhase,
  Position,
  KoreanText,
  HitEffect,
  VitalPoint,
  CombatResult,
  KoreanTechnique,
} from "./game";
import type { PlayerArchetype, TrigramStance } from "./enums";
import type { SoundEffectId, MusicTrackId } from "./audio";

// Base component props
export interface BaseComponentProps {
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly visible?: boolean;
  readonly alpha?: number;
  readonly interactive?: boolean;
  readonly buttonMode?: boolean;
  readonly pointertap?: () => void;
  readonly pointerover?: () => void;
  readonly pointerout?: () => void;
}

// Controls Section Props
export interface ControlsSectionProps extends BaseComponentProps {
  readonly onGamePhaseChange?: (phase: GamePhase) => void;
  readonly title?: string;
  readonly showAdvanced?: boolean;
}

// Menu Section Props
export interface MenuSectionProps extends BaseComponentProps {
  readonly onGamePhaseChange?: (phase: GamePhase) => void;
  readonly title?: string;
  readonly onSelect?: (selection: string) => void;
  readonly onStartGame?: () => void;
  readonly onEnterTraining?: () => void;
  readonly onViewControls?: () => void;
  readonly selectedArchetype?: PlayerArchetype;
  readonly onArchetypeSelect?: (archetype: PlayerArchetype) => void;
}

// Philosophy Section Props
export interface PhilosophySectionProps extends BaseComponentProps {
  readonly onGamePhaseChange?: (phase: GamePhase) => void;
  readonly title?: string;
}

// Player Props for game components
export interface PlayerProps extends BaseComponentProps {
  readonly playerState: PlayerState;
  readonly onStateUpdate: (updates: Partial<PlayerState>) => void;
  readonly archetype: PlayerArchetype;
  readonly stance: TrigramStance;
  readonly position: Position;
  readonly facing: "left" | "right";
  readonly health: number;
  readonly maxHealth: number;
  readonly ki: number;
  readonly maxKi: number;
  readonly stamina: number;
  readonly maxStamina: number;
  readonly showVitalPoints: boolean;
}

// Player Visuals Props
export interface PlayerVisualsProps extends BaseComponentProps {
  readonly playerState: PlayerState;
  readonly playerIndex: number;
  readonly showVitalPoints?: boolean;
}

// Combat Arena Props
export interface CombatArenaProps extends BaseComponentProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly onPlayerUpdate?: (
    index: number,
    updates: Partial<PlayerState>
  ) => void;
  readonly onTechniqueExecute: (
    playerIndex: 0 | 1,
    technique: KoreanTechnique
  ) => Promise<CombatResult | undefined>;
  readonly combatEffects?: readonly HitEffect[];
  readonly isExecutingTechnique: boolean;
  readonly showVitalPoints: boolean;
  readonly showDebugInfo: boolean;
}

// Combat Controls Props
export interface CombatControlsProps extends BaseComponentProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly player: PlayerState;
  readonly onStanceChange: (playerIndex: 0 | 1, stance: TrigramStance) => void;
  readonly isExecutingTechnique: boolean;
  readonly isPaused: boolean;
  readonly showVitalPoints: boolean;
}

// Combat HUD Props
export interface CombatHUDProps extends BaseComponentProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly player?: PlayerState;
  readonly opponent?: PlayerState;
  readonly timeRemaining: number;
  readonly currentRound: number;
  readonly maxRounds?: number;
  readonly gameTime?: number;
  readonly isPlayerTurn?: boolean;
  readonly isPaused: boolean;
}

// Game UI Props
export interface GameUIProps extends BaseComponentProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly currentRound: number;
  readonly gamePhase: GamePhase;
  readonly timeRemaining?: number;
  readonly isPaused: boolean;
  readonly onStanceChange: (playerIndex: number, stance: TrigramStance) => void;
  readonly onPlayerUpdate: (
    index: number,
    updates: Partial<PlayerState>
  ) => void;
  readonly onGamePhaseChange: (phase: GamePhase) => void;
  readonly combatLog?: readonly any[];
  readonly gameTime?: number;
}

// Combat Screen Props
export interface CombatScreenProps extends BaseComponentProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly onPlayerUpdate: (
    index: number,
    updates: Partial<PlayerState>
  ) => void;
  readonly currentRound: number;
  readonly timeRemaining: number;
  readonly isPaused: boolean;
}

// Game Engine Props
export interface GameEngineProps extends BaseComponentProps {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly gamePhase?: GamePhase;
  readonly onGameStateChange: (state: any) => void;
  readonly onPlayerUpdate: (
    index: number,
    updates: Partial<PlayerState>
  ) => void;
  readonly onGamePhaseChange: (phase: GamePhase) => void;
  readonly gameMode?: "versus" | "training";
}

// Dojang Background Props
export interface DojangBackgroundProps extends BaseComponentProps {
  readonly timeOfDay?: "day" | "night";
  readonly weather?: "clear" | "rain" | "snow";
  readonly textureName?: string;
  readonly lighting?: "bright" | "dim" | "atmospheric";
  readonly children?: React.ReactNode;
}
