/**
 * Combat control configuration for Korean martial arts
 */

// Fix: Import TrigramStance as value
import { TrigramStance } from "../enums";

// Fix: Define CombatControlsConfig locally to avoid circular dependency
export interface CombatControlsConfig {
  readonly stanceControls: Record<
    string,
    { stance: string; korean: string; technique: string }
  >;
  readonly movement: Record<string, string>;
  readonly combat: Record<string, string>;
  readonly system: Record<string, string>;
}

// Combat control mapping for Korean martial arts
export const COMBAT_CONTROLS = {
  // Trigram stance system (1-8 keys)
  stanceControls: {
    "1": { stance: "geon", korean: "건", technique: "천둥벽력" },
    "2": { stance: "tae", korean: "태", technique: "유수연타" },
    "3": { stance: "li", korean: "리", technique: "화염지창" },
    "4": { stance: "jin", korean: "진", technique: "벽력일섬" },
    "5": { stance: "son", korean: "손", technique: "선풍연격" },
    "6": { stance: "gam", korean: "감", technique: "수류반격" },
    "7": { stance: "gan", korean: "간", technique: "반석방어" },
    "8": { stance: "gon", korean: "곤", technique: "대지포옹" },
  },

  // Movement and combat actions
  movement: {
    WASD: "Tactical positioning and footwork",
    ArrowKeys: "Alternative movement system",
  },

  combat: {
    SPACE: "Execute current stance technique",
    SHIFT: "Defensive guard/block position",
    CTRL: "Precision vital point targeting mode",
    TAB: "Cycle through player archetypes",
  },

  // System controls
  system: {
    ESC: "Pause menu / Return to intro",
    F1: "Help / Controls guide",
    M: "Mute / Audio settings",
  },
} as const;

// Key mapping for easier lookup
export const KEYBOARD_MAPPING = {
  // Stance keys
  STANCE_1: "1",
  STANCE_2: "2",
  STANCE_3: "3",
  STANCE_4: "4",
  STANCE_5: "5",
  STANCE_6: "6",
  STANCE_7: "7",
  STANCE_8: "8",

  // Combat actions
  EXECUTE_TECHNIQUE: " ", // Space
  BLOCK: "Shift",
  TARGET_MODE: "Control",
  ARCHETYPE_CYCLE: "Tab",

  // Movement
  MOVE_UP: "w",
  MOVE_DOWN: "s",
  MOVE_LEFT: "a",
  MOVE_RIGHT: "d",

  // System
  PAUSE: "Escape",
  HELP: "F1",
  MUTE: "m",
} as const;

/**
 * Get the stance associated with a given key.
 *
 * @param key - The key to lookup.
 * @returns The corresponding stance, or null if not found.
 */
export function getStanceFromKey(key: string): TrigramStance | null {
  const stanceMap: Record<string, TrigramStance> = {
    "1": TrigramStance.GEON,
    "2": TrigramStance.TAE,
    "3": TrigramStance.LI,
    "4": TrigramStance.JIN,
    "5": TrigramStance.SON,
    "6": TrigramStance.GAM,
    "7": TrigramStance.GAN,
    "8": TrigramStance.GON,
  };
  return stanceMap[key] || null;
}
