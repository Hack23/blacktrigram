/**
 * Control Mapping System for Black Trigram
 * Manages keyboard control bindings with localStorage persistence
 * 
 * @module utils/controlMapping
 * @category Input System
 * @korean 컨트롤 매핑 시스템
 */

import { TrigramStance } from "../types/common";
import { TRIGRAM_STANCES_ORDER } from "../systems/trigram/types";

/**
 * Control binding configuration
 * Maps game actions to keyboard keys
 * 
 * @category Input System
 * @korean 컨트롤 바인딩
 */
export interface ControlBinding {
  /** Stance selection keys (1-8 by default) */
  readonly stances: readonly string[];
  /** Attack action key */
  readonly attack: string;
  /** Block/Guard action key */
  readonly block: string;
  /** Movement keys */
  readonly movement: {
    readonly up: string;
    readonly down: string;
    readonly left: string;
    readonly right: string;
  };
  /** Special action keys */
  readonly special: {
    readonly precision: string;
    readonly quickSwitch: string;
    readonly reset: string;
  };
}

/**
 * Storage key for localStorage persistence
 */
const STORAGE_KEY = "blacktrigram_controls";

/**
 * Default control bindings following game design specifications
 * Based on game-design.md lines 942-947
 */
const DEFAULT_BINDINGS: ControlBinding = {
  stances: ["1", "2", "3", "4", "5", "6", "7", "8"],
  attack: " ", // Spacebar
  block: "b",
  movement: {
    up: "w",
    down: "s",
    left: "a",
    right: "d",
  },
  special: {
    precision: "Control",
    quickSwitch: "q",
    reset: "r",
  },
};

/**
 * Control Mapper class for managing keyboard bindings
 * Handles loading, saving, and querying control mappings
 * 
 * @example
 * ```typescript
 * const mapper = new ControlMapper();
 * 
 * // Get stance for key press
 * const stance = mapper.getStanceForKey("3"); // Returns 2 (0-indexed)
 * 
 * // Update bindings
 * mapper.saveBindings({
 *   ...mapper.getBindings(),
 *   stances: ['q', 'w', 'e', 'r', 'a', 's', 'd', 'f']
 * });
 * ```
 * 
 * @public
 * @korean 컨트롤매퍼
 */
export class ControlMapper {
  private bindings: ControlBinding;

  /**
   * Creates a new ControlMapper instance
   * Automatically loads bindings from localStorage
   */
  constructor() {
    this.bindings = this.loadBindings();
  }

  /**
   * Load bindings from localStorage
   * Returns default bindings if none exist
   * 
   * @returns Control bindings from storage or defaults
   * @korean 바인딩 로드
   */
  loadBindings(): ControlBinding {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ControlBinding;
        // Validate loaded bindings
        if (this.validateBindings(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Failed to load control bindings:", error);
    }
    return this.getDefaultBindings();
  }

  /**
   * Save bindings to localStorage
   * 
   * @param bindings - Control bindings to save
   * @korean 바인딩 저장
   */
  saveBindings(bindings: ControlBinding): void {
    if (!this.validateBindings(bindings)) {
      console.error("Invalid control bindings, not saving");
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bindings));
      this.bindings = bindings;
    } catch (error) {
      console.error("Failed to save control bindings:", error);
    }
  }

  /**
   * Get default control bindings
   * 
   * @returns Default control configuration
   * @korean 기본 바인딩
   */
  getDefaultBindings(): ControlBinding {
    return { ...DEFAULT_BINDINGS };
  }

  /**
   * Get current control bindings
   * 
   * @returns Current control configuration
   * @korean 현재 바인딩
   */
  getBindings(): ControlBinding {
    return { ...this.bindings };
  }

  /**
   * Reset bindings to default
   * 
   * @korean 기본값으로 리셋
   */
  resetToDefaults(): void {
    this.saveBindings(this.getDefaultBindings());
  }

  /**
   * Get stance index for a given key
   * Returns null if key is not bound to a stance
   * 
   * @param key - Keyboard key to check
   * @returns Stance index (0-7) or null
   * @korean 키에 대한 자세 조회
   */
  getStanceForKey(key: string): number | null {
    const normalizedKey = key.toLowerCase();
    const index = this.bindings.stances.findIndex(
      (k) => k.toLowerCase() === normalizedKey
    );
    return index >= 0 ? index : null;
  }

  /**
   * Get key for a given stance index
   * 
   * @param stanceIndex - Stance index (0-7)
   * @returns Key bound to that stance
   * @korean 자세에 대한 키 조회
   */
  getKeyForStance(stanceIndex: number): string | null {
    if (stanceIndex < 0 || stanceIndex >= this.bindings.stances.length) {
      return null;
    }
    return this.bindings.stances[stanceIndex];
  }

  /**
   * Get TrigramStance enum for a given key
   * 
   * @param key - Keyboard key to check
   * @returns TrigramStance or null
   * @korean 키에 대한 팔괘 자세
   */
  getTrigramStanceForKey(key: string): TrigramStance | null {
    const index = this.getStanceForKey(key);
    if (index === null) return null;
    return TRIGRAM_STANCES_ORDER[index] ?? null;
  }

  /**
   * Check if a key is bound to an action
   * 
   * @param key - Keyboard key to check
   * @returns Action name or null
   * @korean 키 바인딩 확인
   */
  getActionForKey(key: string): string | null {
    const normalizedKey = key.toLowerCase();

    // Check stance keys
    if (this.getStanceForKey(key) !== null) {
      return "stance";
    }

    // Check other actions
    if (normalizedKey === this.bindings.attack.toLowerCase()) return "attack";
    if (normalizedKey === this.bindings.block.toLowerCase()) return "block";

    // Check movement
    const movement = this.bindings.movement;
    if (normalizedKey === movement.up.toLowerCase()) return "move_up";
    if (normalizedKey === movement.down.toLowerCase()) return "move_down";
    if (normalizedKey === movement.left.toLowerCase()) return "move_left";
    if (normalizedKey === movement.right.toLowerCase()) return "move_right";

    // Check special
    const special = this.bindings.special;
    if (normalizedKey === special.precision.toLowerCase()) return "precision";
    if (normalizedKey === special.quickSwitch.toLowerCase())
      return "quick_switch";
    if (normalizedKey === special.reset.toLowerCase()) return "reset";

    return null;
  }

  /**
   * Validate control bindings
   * Ensures no duplicate keys and all required keys are present
   * 
   * @param bindings - Bindings to validate
   * @returns True if valid
   * @korean 바인딩 검증
   */
  private validateBindings(bindings: ControlBinding): boolean {
    // Check that stances array has exactly 8 entries
    if (
      !bindings.stances ||
      !Array.isArray(bindings.stances) ||
      bindings.stances.length !== 8
    ) {
      return false;
    }

    // Check for duplicate keys
    const allKeys = [
      ...bindings.stances,
      bindings.attack,
      bindings.block,
      bindings.movement.up,
      bindings.movement.down,
      bindings.movement.left,
      bindings.movement.right,
      bindings.special.precision,
      bindings.special.quickSwitch,
      bindings.special.reset,
    ];

    const uniqueKeys = new Set(allKeys.map((k) => k.toLowerCase()));
    if (uniqueKeys.size !== allKeys.length) {
      // Duplicate keys found
      return false;
    }

    return true;
  }

  /**
   * Check if bindings have conflicts
   * Returns array of conflicting keys
   * 
   * @param bindings - Bindings to check
   * @returns Array of duplicate keys
   * @korean 바인딩 충돌 확인
   */
  getConflicts(bindings: ControlBinding): string[] {
    const keyCount = new Map<string, number>();
    const conflicts: string[] = [];

    const allKeys = [
      ...bindings.stances,
      bindings.attack,
      bindings.block,
      bindings.movement.up,
      bindings.movement.down,
      bindings.movement.left,
      bindings.movement.right,
      bindings.special.precision,
      bindings.special.quickSwitch,
      bindings.special.reset,
    ];

    allKeys.forEach((key) => {
      const normalized = key.toLowerCase();
      keyCount.set(normalized, (keyCount.get(normalized) ?? 0) + 1);
    });

    keyCount.forEach((count, key) => {
      if (count > 1) {
        conflicts.push(key);
      }
    });

    return conflicts;
  }
}
