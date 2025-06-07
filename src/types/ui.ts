import type { ReactNode } from "react";
import type { ColorValue, Position } from "./common";
import type { TrigramStance, GamePhase } from "./enums";
import type { PlayerState } from "./player";
import type { KoreanText } from "./korean-text";
import type { PlayerArchetype } from "./player";

// Base component props
export interface BaseComponentProps {
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly children?: ReactNode;
}

// Base UI component props
export interface BaseUIComponentProps {
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly testId?: string;
}

// Progress tracker props
export interface ProgressTrackerProps extends BaseUIComponentProps {
  readonly label: string;
  readonly value: number;
  readonly maxValue: number;
  readonly barColor?: ColorValue;
  readonly backgroundColor?: ColorValue;
  readonly borderColor?: ColorValue; // Added
  readonly width?: number; // Added
  readonly height?: number; // Added
  readonly showText?: boolean; // Added
  readonly textColor?: ColorValue; // Added
  readonly borderWidth?: number; // Added
  readonly color?: string; // CSS color alternative
}

// Trigram wheel props - FIXED: Match implementation signature
export interface TrigramWheelProps extends BaseUIComponentProps {
  readonly currentStance: TrigramStance;
  readonly onStanceSelect: (stance: TrigramStance) => void;
  readonly size?: number;
  readonly position?: Position; // Added
  readonly interactive?: boolean; // Added
  readonly time?: number; // Added
}

// Korean text styling for PIXI
export interface KoreanPixiTextConfig {
  readonly fontFamily?: string;
  readonly fontSize?: number;
  readonly fill?: ColorValue;
  readonly align?: "left" | "center" | "right";
  readonly wordWrap?: boolean;
  readonly wordWrapWidth?: number;
}

// Menu section props - FIXED: Ensure consistent with components.ts
export interface MenuSectionProps extends BaseUIComponentProps {
  readonly onGamePhaseChange: (phase: GamePhase | string) => void;
  readonly title?: string; // Added
  readonly onSelect?: (option: string) => void; // Added
}

// Philosophy section props - FIXED: Ensure consistent with components.ts
export interface PhilosophySectionProps extends BaseUIComponentProps {
  readonly onGamePhaseChange: (phase: GamePhase) => void;
  readonly title?: string;
  readonly selectedArchetype?: PlayerArchetype;
  readonly onArchetypeSelect?: (archetype: PlayerArchetype) => void;
  readonly onArchetypeChange?: (archetype: PlayerArchetype) => void;
}

// Training screen props
export interface TrainingScreenProps extends BaseUIComponentProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly onGamePhaseChange: (phase: GamePhase) => void;
  readonly onPlayerUpdate: (
    playerIndex: number,
    updates: Partial<PlayerState>
  ) => void;
  readonly onStanceChange: (stance: TrigramStance) => void;
  readonly selectedStance: TrigramStance;
  readonly gameTime: number;
  readonly currentRound: number;
}

// Game UI props
export interface GameUIProps extends BaseUIComponentProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly gamePhase: GamePhase;
  readonly onGamePhaseChange: (phase: GamePhase) => void; // Changed from GamePhase | string
  readonly gameTime: number;
  readonly currentRound: number;
  readonly timeRemaining: number;
  readonly onStanceChange: (playerIndex: number, stance: TrigramStance) => void;
  readonly combatLog: readonly string[];
  readonly onStartMatch?: () => void; // Added
  readonly onResetMatch?: () => void; // Added
  readonly onTogglePause?: () => void; // Added
  readonly onPlayerUpdate: (
    // Added
    playerIndex: number,
    updates: Partial<PlayerState>
  ) => void;
  readonly isPaused?: boolean; // Added
}

// Intro screen props
export interface IntroScreenProps extends BaseUIComponentProps {
  readonly onGamePhaseChange: (phase: GamePhase | string) => void; // Ensure this matches string usage in App.tsx
  readonly currentSection?: string;
}

// UI Theme
export interface UITheme {
  readonly colors: {
    readonly primary: string;
    readonly secondary: string;
    readonly accent: string;
    readonly background: string;
    readonly text: string;
  };
  readonly fonts: {
    readonly primary: string;
    readonly secondary: string; // Added
    readonly monospace: string; // Added
  };
}

export interface ColorScheme {
  readonly name: string;
  readonly colors: Record<string, string>;
}

export interface KoreanUIElement {
  readonly text: KoreanText;
  readonly style: UIElementStyle;
  readonly interactive?: boolean; // Added
  readonly trigram?: TrigramStance; // Added
}

export interface UIElementStyle {
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly fontWeight: number; // Changed from string
  readonly color: number;
  readonly backgroundColor?: number;
  readonly border?: BorderStyle;
  readonly cyberpunkGlow?: boolean; // Added
}

export interface BorderStyle {
  readonly width: number;
  readonly color: number;
  readonly style: "solid" | "dashed" | "neon"; // Added "neon"
}

export interface TrigramWheelData {
  readonly stance: TrigramStance;
  readonly symbol: string;
  readonly name: KoreanText;
  readonly color: number;
  readonly available: boolean; // Added
  readonly cost: {
    // Added
    readonly ki: number;
    readonly stamina: number;
  };
}

export interface ArchetypeDisplayData {
  readonly archetype: PlayerArchetype;
  readonly name: KoreanText;
  readonly specialization: KoreanText;
  readonly preferredTrigrams: readonly TrigramStance[];
  readonly philosophy: KoreanText; // Added
}

export interface CombatUIState {
  readonly playerHealth: number;
  readonly playerKi: number;
  readonly playerStamina: number;
  readonly currentStance: TrigramStance;
  readonly availableStances: readonly TrigramStance[]; // Added
  readonly combatLog: readonly KoreanText[];
  readonly vitalPointsVisible: boolean; // Added
}
