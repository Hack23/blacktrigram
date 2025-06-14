/**
 * Combat controls and input types for Korean martial arts
 */

// Fix: Add proper interface export
export interface CombatControlsConfig {
  readonly stanceControls: Record<
    string,
    { stance: string; korean: string; technique: string }
  >;
  readonly movement: Record<string, string>;
  readonly combat: Record<string, string>;
  readonly system: Record<string, string>;
}

// Export COMBAT_CONTROLS from constants
export { COMBAT_CONTROLS } from "./constants/controls";

// Input handling types
export interface InputEvent {
  readonly type: "keydown" | "keyup" | "pointerdown" | "pointerup";
  readonly key?: string;
  readonly position?: { x: number; y: number };
  readonly timestamp: number;
}

export interface CombatInput {
  readonly player: number;
  readonly action: string;
  readonly data?: any;
}

// Gesture types
export interface Gesture {
  readonly type: "tap" | "hold" | "swipe" | "combo";
  readonly duration?: number;
  readonly direction?: "up" | "down" | "left" | "right";
  readonly sequence?: string[];
}
