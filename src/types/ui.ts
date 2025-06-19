/**
 * @fileoverview UI component type definitions for Black Trigram Korean martial arts game
 * @description Comprehensive type system for all UI components with Korean martial arts context
 *
 * @author Black Trigram Development Team
 * @version 1.0.0
 */

import type { ReactNode } from "react";
import type {
  PlayerState,
  MatchStatistics,
  GameMode,
  TrigramStance,
  HitEffect,
  KoreanText,
} from "./index";

/**
 * @interface LoadingState
 * @description Loading state management for async operations
 */
export interface LoadingState {
  readonly isLoading: boolean;
  readonly progress?: number;
  readonly message?: KoreanText;
}

/**
 * @interface ErrorState
 * @description Error state management with Korean/English messaging
 */
export interface ErrorState {
  readonly hasError: boolean;
  readonly error?: Error;
  readonly message?: KoreanText;
  readonly retry?: () => void;
}

/**
 * @interface BaseUIProps
 * @description Base properties for all UI components with Korean aesthetics
 */
export interface BaseUIProps {
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
  readonly visible?: boolean;
  readonly alpha?: number;
  readonly screenWidth?: number;
  readonly screenHeight?: number;
  readonly "data-testid"?: string;
}

/**
 * @interface EndScreenProps
 * @description Victory/defeat screen with Korean martial arts context
 */
export interface EndScreenProps extends BaseUIProps {
  readonly winner: PlayerState | null;
  readonly matchStatistics: MatchStatistics;
  readonly onRestart: () => void;
  readonly onMainMenu: () => void;
  readonly children?: ReactNode;
}

/**
 * @interface IntroScreenProps
 * @description Main menu screen with Korean martial arts theme
 */
export interface IntroScreenProps extends BaseUIProps {
  readonly onStartGame: () => void;
  readonly onShowTraining: () => void;
  readonly onShowSettings: () => void;
  readonly children?: ReactNode;
}

/**
 * @interface TrainingScreenProps
 * @description Korean martial arts training dojang interface
 */
export interface TrainingScreenProps extends BaseUIProps {
  readonly onBack: () => void;
  readonly player: PlayerState;
  readonly onPlayerUpdate: (updates: Partial<PlayerState>) => void;
  readonly children?: ReactNode;
  readonly trigramSystem?: any;
  readonly vitalPointSystem?: any;
  readonly onReturnToMenu: () => void;
}

/**
 * @interface CombatScreenProps
 * @description Main combat interface props for Korean martial arts combat system
 *
 * @example
 * ```tsx
 * <CombatScreen
 *   players={[player1, player2]}
 *   currentRound={1}
 *   timeRemaining={180}
 *   isPaused={false}
 *   onPlayerUpdate={handlePlayerUpdate}
 *   onReturnToMenu={handleReturnToMenu}
 *   onGameEnd={handleGameEnd}
 *   matchStatistics={stats}
 * />
 * ```
 */
export interface CombatScreenProps extends BaseUIProps {
  /** Array of player states (minimum 2 required) */
  readonly players: readonly PlayerState[];
  /** Callback for updating player state during combat */
  readonly onPlayerUpdate: (
    playerIndex: number,
    updates: Partial<PlayerState>
  ) => void;
  /** Current round number (1-based) */
  readonly currentRound: number;
  /** Time remaining in seconds for current round */
  readonly timeRemaining: number;
  /** Whether the game is currently paused */
  readonly isPaused: boolean;
  /** Callback for returning to main menu */
  readonly onReturnToMenu: () => void;
  /** Callback when game ends with winner index */
  readonly onGameEnd: (winner: number) => void;
  /** Optional game mode specification */
  readonly gameMode?: GameMode;
  /** Match statistics for display and tracking */
  readonly matchStatistics?: MatchStatistics;
}

/**
 * @interface HealthBarProps
 * @description Health visualization with Korean martial arts status indicators
 */
export interface HealthBarProps extends BaseUIProps {
  readonly current: number;
  readonly max: number;
  readonly playerName: string;
  readonly position?: "left" | "right" | "center";
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly showText?: boolean;
  readonly animated?: boolean;
  readonly showDamageIndicator?: boolean;
}

/**
 * @interface StanceIndicatorProps
 * @description Korean trigram stance visualization (팔괘 자세)
 */
export interface StanceIndicatorProps extends BaseUIProps {
  readonly stance: TrigramStance;
  readonly size?: number;
  readonly showText?: boolean;
  readonly isActive?: boolean;
}

/**
 * @interface TrigramWheelProps
 * @description Interactive eight trigram stance selector (팔괘 휠)
 */
export interface TrigramWheelProps extends BaseUIProps {
  readonly currentStance: TrigramStance;
  readonly onStanceChange: (stance: TrigramStance) => void;
  readonly selectedStance?: TrigramStance;
  readonly onStanceSelect?: (stance: TrigramStance) => void;
  readonly size?: number;
  readonly interactive?: boolean;
  readonly disabledStances?: readonly TrigramStance[];
}

/**
 * @interface GameUIProps
 * @description Complete game UI overlay with Korean martial arts HUD
 */
export interface GameUIProps extends BaseUIProps {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly timeRemaining: number;
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly combatEffects: readonly HitEffect[];
}

/**
 * @interface UIComponentProps
 * @description Generic UI component properties
 */
export interface UIComponentProps extends BaseUIProps {
  readonly interactive?: boolean;
}

/**
 * @interface ProgressTrackerProps
 * @description Progress tracking for training and skill development
 */
export interface ProgressTrackerProps extends BaseUIProps {
  readonly progress: number;
  readonly maxProgress: number;
  readonly label?: string;
  readonly showPercentage?: boolean;
  readonly korean?: string;
}

/**
 * @interface ScoreDisplayProps
 * @description Match scoring with Korean martial arts terminology
 */
export interface ScoreDisplayProps extends BaseUIProps {
  readonly player1Score: number;
  readonly player2Score: number;
  readonly player1Name: string;
  readonly player2Name: string;
  readonly showRoundWins?: boolean;
}

/**
 * @interface LoadingScreenProps
 * @description Loading screen with Korean aesthetics
 */
export interface LoadingScreenProps extends BaseUIProps {
  readonly progress: number;
  readonly message?: KoreanText;
}

/**
 * @interface MainMenuScreenProps
 * @description Main menu navigation
 */
export interface MainMenuScreenProps extends BaseUIProps {
  readonly onNewGame: () => void;
  readonly onLoadGame: () => void;
  readonly onSettings: () => void;
  readonly onExit: () => void;
}

/**
 * @interface SettingsScreenProps
 * @description Game settings configuration
 */
export interface SettingsScreenProps extends BaseUIProps {
  readonly onBack: () => void;
  readonly onApply: (settings: any) => void;
}

/**
 * @interface TrainingModeUIProps
 * @description Training mode specific UI elements
 */
export interface TrainingModeUIProps extends BaseUIProps {
  readonly player: PlayerState;
  readonly onPlayerUpdate: (updates: Partial<PlayerState>) => void;
  readonly onReset: () => void;
}

/**
 * @interface VictoryPoseScreenProps
 * @description Victory celebration screen with Korean martial arts honors
 */
export interface VictoryPoseScreenProps extends BaseUIProps {
  readonly winner: PlayerState;
  readonly onContinue: () => void;
}

/**
 * @interface VitalPointDisplayProps
 * @description Korean martial arts vital point (급소) targeting display
 */
export interface VitalPointDisplayProps extends BaseUIProps {
  readonly vitalPoints: readonly string[];
  readonly onVitalPointSelect: (pointId: string) => void;
  readonly selectedPoint?: string;
}

/**
 * @interface HitEffectsLayerProps
 * @description Combat hit effects with Korean martial arts feedback
 */
export interface HitEffectsLayerProps extends BaseUIProps {
  readonly effects: readonly HitEffect[];
  readonly onEffectComplete: (effectId: string) => void;
}

/**
 * @interface PlayerProps
 * @description Player character visualization in combat
 */
export interface PlayerProps extends BaseUIProps {
  readonly playerState: PlayerState;
  readonly playerIndex: number;
  readonly onClick?: () => void;
  readonly gridPosition?: { row: number; col: number };
  readonly gridSize?: number;
  readonly isActive?: boolean;
}

/**
 * @interface RoundTimerProps
 * @description Round timer display and control
 */
export interface RoundTimerProps extends BaseUIProps {
  readonly timeRemaining: number;
  readonly totalTime: number;
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly isPaused?: boolean;
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly showMilliseconds?: boolean;
}

/**
 * @namespace UIConstants
 * @description UI-related constants and design tokens
 */
export namespace UIConstants {
  /** Korean typography specifications */
  export const KOREAN_FONTS = {
    PRIMARY: '"Noto Sans KR", "Malgun Gothic", sans-serif',
    DISPLAY: '"Noto Serif KR", "Batang", serif',
    MONOSPACE: '"Nanum Gothic Coding", monospace',
  } as const;

  /** Responsive breakpoints */
  export const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  } as const;

  /** Korean martial arts specific UI elements */
  export const MARTIAL_ARTS_UI = {
    TRIGRAM_SYMBOLS: ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"],
    STANCE_NAMES: {
      KOREAN: ["건", "태", "리", "진", "손", "감", "간", "곤"],
      ENGLISH: [
        "Heaven",
        "Lake",
        "Fire",
        "Thunder",
        "Wind",
        "Water",
        "Mountain",
        "Earth",
      ],
    },
  } as const;
}

/**
 * @type ResponsiveSize
 * @description Responsive sizing utility type
 */
export type ResponsiveSize = {
  mobile: number;
  tablet: number;
  desktop: number;
};

/**
 * @type UITheme
 * @description UI theming configuration
 */
export type UITheme = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    korean: string;
    english: string;
    monospace: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
};

/**
 * @type KoreanButtonVariant
 * @description Korean button variant types for UI components
 */
export type KoreanButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "stance"
  | "combat"
  | "disabled";
