// UI-specific types for Black Trigram Korean martial arts game

import type { ReactNode } from "react";
import type {
  PlayerState,
  MatchStatistics,
  GameMode,
  HitEffect,
  TrigramStance,
} from "./index";
import type { KoreanText } from "./korean-text";

// Base UI component props
export interface BaseUIProps {
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly alpha?: number;
  readonly visible?: boolean;
  readonly children?: ReactNode;
}

// UI theme configuration
export interface UITheme {
  readonly primary: number;
  readonly secondary: number;
  readonly accent: number;
  readonly background: number;
  readonly text: number;
  readonly border: number;
}

// Menu item definition
export interface MenuItem {
  readonly id: string;
  readonly label: KoreanText;
  readonly action: () => void;
  readonly disabled?: boolean;
  readonly icon?: string;
}

// Modal props
export interface ModalProps extends BaseUIProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: KoreanText;
  readonly content: ReactNode;
}

// Notification system
export interface Notification {
  readonly id: string;
  readonly type: "info" | "success" | "warning" | "error";
  readonly title: KoreanText;
  readonly message: KoreanText;
  readonly duration?: number;
  readonly timestamp: number;
}

// Game settings
export interface GameSettings {
  readonly volume: {
    readonly master: number;
    readonly music: number;
    readonly sfx: number;
  };
  readonly graphics: {
    readonly quality: "low" | "medium" | "high";
    readonly fullscreen: boolean;
    readonly vsync: boolean;
  };
  readonly controls: {
    readonly keyboardLayout: "qwerty" | "dvorak" | "colemak";
    readonly mouseSensitivity: number;
  };
  readonly language: "korean" | "english" | "both";
}

// Screen navigation
export interface ScreenNavigation {
  readonly currentScreen: string;
  readonly previousScreen?: string;
  readonly navigate: (screen: string) => void;
  readonly goBack: () => void;
}

// Loading state
export interface LoadingState {
  readonly isLoading: boolean;
  readonly progress?: number;
  readonly message?: KoreanText;
}

// Error state
export interface ErrorState {
  readonly hasError: boolean;
  readonly error?: Error;
  readonly message?: KoreanText;
  readonly retry?: () => void;
}

// Screen component props
export interface EndScreenProps {
  readonly winner: PlayerState | null;
  readonly matchStatistics: MatchStatistics;
  readonly onRestart: () => void;
  readonly onMainMenu: () => void;
  readonly children?: ReactNode;
}

export interface IntroScreenProps {
  readonly onStartGame: () => void;
  readonly onShowTraining: () => void;
  readonly onShowSettings: () => void;
  readonly children?: ReactNode;
}

export interface TrainingScreenProps {
  readonly onBack: () => void;
  readonly player: PlayerState;
  readonly onPlayerUpdate: (updates: Partial<PlayerState>) => void;
  readonly children?: ReactNode;
  readonly width?: number;
  readonly height?: number;
  readonly trigramSystem?: any; // Fix: Add missing props
  readonly vitalPointSystem?: any; // Fix: Add missing props
  readonly onReturnToMenu: () => void; // Fix: Add missing props
}

// Component props that might be missing
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

export interface HealthBarProps {
  readonly current: number;
  readonly max: number;
  readonly playerName: string;
  readonly position?: "left" | "right" | "center";
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly screenWidth: number;
  readonly screenHeight: number;
  readonly showText?: boolean;
  readonly animated?: boolean;
  readonly showDamageIndicator?: boolean;
}

export interface StanceIndicatorProps {
  readonly stance: TrigramStance;
  readonly size?: number;
  readonly showText?: boolean;
  readonly x?: number;
  readonly y?: number;
}

export interface TrigramWheelProps {
  readonly currentStance: TrigramStance; // Fix: Make required
  readonly onStanceChange: (stance: TrigramStance) => void;
  readonly selectedStance?: TrigramStance;
  readonly onStanceSelect?: (stance: TrigramStance) => void;
  readonly size?: number;
  readonly interactive?: boolean;
  readonly disabledStances?: readonly TrigramStance[];
  readonly x?: number;
  readonly y?: number;
}

// Additional screen props that may be referenced
export interface LoadingScreenProps {
  readonly progress: number;
  readonly message?: KoreanText;
}

export interface MainMenuScreenProps {
  readonly onNewGame: () => void;
  readonly onLoadGame: () => void;
  readonly onSettings: () => void;
  readonly onExit: () => void;
}

export interface SettingsScreenProps {
  readonly onBack: () => void;
  readonly onApply: (settings: any) => void;
}

export interface TrainingModeUIProps {
  readonly player: PlayerState;
  readonly onPlayerUpdate: (updates: Partial<PlayerState>) => void;
  readonly onReset: () => void;
}

export interface VictoryPoseScreenProps {
  readonly winner: PlayerState;
  readonly onContinue: () => void;
}

export interface VitalPointDisplayProps {
  readonly vitalPoints: readonly string[];
  readonly onVitalPointSelect: (pointId: string) => void;
  readonly selectedPoint?: string;
}

// Add missing GameUIProps export
export interface GameUIProps extends BaseUIProps {
  player1: PlayerState;
  player2: PlayerState;
  timeRemaining: number;
  currentRound: number;
  maxRounds: number;
  combatEffects: readonly HitEffect[];
}

// UI component interfaces
export interface UIComponentProps {
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
  readonly visible?: boolean;
  readonly interactive?: boolean;
}

// Health bar interface
export interface HealthBarProps extends UIComponentProps {
  readonly currentHealth: number;
  readonly maxHealth: number;
  readonly showText?: boolean;
  readonly variant?: "default" | "compact" | "detailed";
}

// Stance indicator interface
export interface StanceIndicatorProps extends UIComponentProps {
  readonly stance: TrigramStance;
  readonly size?: number;
  readonly showText?: boolean;
  readonly isActive?: boolean;
}

// Progress tracker interface
export interface ProgressTrackerProps extends UIComponentProps {
  readonly progress: number;
  readonly maxProgress: number;
  readonly label?: string;
  readonly showPercentage?: boolean;
}

// Score display interface
export interface ScoreDisplayProps extends UIComponentProps {
  readonly player1Score: number;
  readonly player2Score: number;
  readonly player1Name: string;
  readonly player2Name: string;
}

// Round timer interface
export interface RoundTimerProps extends UIComponentProps {
  readonly timeRemaining: number;
  readonly totalTime: number; // Fix: Change from maxTime to totalTime
  readonly isRunning?: boolean;
}

// End screen interface
export interface EndScreenProps extends UIComponentProps {
  readonly winner: PlayerState | null;
  readonly matchStats: {
    readonly duration: number;
    readonly totalRounds: number;
    readonly player1Wins: number;
    readonly player2Wins: number;
  };
  readonly onRestart: () => void;
  readonly onReturnToMenu: () => void;
}

// Archetype display interface
export interface ArchetypeDisplayProps extends UIComponentProps {
  readonly player: PlayerState;
  readonly showDetails?: boolean;
  readonly compact?: boolean;
}

// Fix: Add missing ComponentState export
export interface ComponentState {
  readonly visible: boolean;
  readonly interactive: boolean;
  readonly loading: boolean;
  readonly error?: string;
}

// Fix: Add missing InteractionEvent export
export interface InteractionEvent {
  readonly type: string;
  readonly target: string;
  readonly timestamp: number;
  readonly data?: any;
}
