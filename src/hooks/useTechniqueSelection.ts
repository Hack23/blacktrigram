/**
 * Custom hook for managing technique selection and execution.
 *
 * **Korean**: 기술 선택 관리 (Technique Selection Management)
 *
 * Handles technique selection state, keyboard shortcuts, cooldown tracking,
 * and validation of technique execution based on player resources and stance.
 *
 * @module hooks/useTechniqueSelection
 * @category Combat Hooks
 * @korean 기술선택훅
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getTechniquesForStanceAndArchetype } from "../data/techniques";
import { PlayerState } from "../systems/player";
import {
  Technique,
  TechniqueCooldown,
  TechniqueKey,
  TechniqueValidation,
} from "../types";

/**
 * Configuration for technique selection hook.
 */
export interface UseTechniqueSelectionConfig {
  /** Player state with resources and stance */
  readonly player: PlayerState;

  /** Whether technique selection is enabled */
  readonly enabled?: boolean;

  /** Callback when technique is selected */
  readonly onTechniqueSelected?: (technique: Technique) => void;

  /** Callback when technique execution is attempted */
  readonly onTechniqueExecute?: (technique: Technique) => void;
}

/**
 * Technique selection state and actions.
 */
export interface UseTechniqueSelectionResult {
  /** Available techniques for player archetype */
  readonly availableTechniques: readonly Technique[];

  /** Currently selected technique index */
  readonly selectedIndex: number;

  /** Active cooldowns for techniques */
  readonly activeCooldowns: readonly TechniqueCooldown[];

  /** Select technique by index */
  readonly selectTechnique: (index: number) => void;

  /** Execute currently selected technique */
  readonly executeTechnique: (indexOverride?: number) => void;

  /** Check if technique can be executed */
  readonly validateTechnique: (technique: Technique) => TechniqueValidation;

  /** Check if technique is on cooldown */
  readonly isOnCooldown: (techniqueId: string) => boolean;

  /** Get remaining cooldown time in ms */
  readonly getRemainingCooldown: (techniqueId: string) => number;

  /** Check if player has sufficient resources */
  readonly hasResources: (technique: Technique) => boolean;
}

/**
 * Custom hook for managing technique selection and execution.
 *
 * @param config - Configuration options
 * @returns Technique selection state and actions
 *
 * @example
 * ```typescript
 * const techniqueSelection = useTechniqueSelection({
 *   player: playerState,
 *   enabled: !isPaused && combatActive,
 *   onTechniqueExecute: (technique) => {
 *     // Execute technique logic
 *     executeCombatTechnique(playerState, opponent, technique);
 *   }
 * });
 * ```
 *
 * @public
 */
export function useTechniqueSelection(
  config: UseTechniqueSelectionConfig
): UseTechniqueSelectionResult {
  const {
    player,
    enabled = true,
    onTechniqueSelected,
    onTechniqueExecute,
  } = config;

  // Get available techniques based on player's current stance and archetype
  const availableTechniques = useMemo(
    () =>
      getTechniquesForStanceAndArchetype(
        player.currentStance,
        player.archetype
      ),
    [player.currentStance, player.archetype]
  );

  // Selected technique state
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Cooldown tracking
  const [activeCooldowns, setActiveCooldowns] = useState<TechniqueCooldown[]>(
    []
  );

  // Ref for cleanup
  const cooldownUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update cooldowns every 100ms
  useEffect(() => {
    if (activeCooldowns.length === 0) {
      // Clear any existing interval when no cooldowns
      if (cooldownUpdateIntervalRef.current) {
        clearInterval(cooldownUpdateIntervalRef.current);
        cooldownUpdateIntervalRef.current = null;
      }
      return;
    }

    let isMounted = true;
    cooldownUpdateIntervalRef.current = setInterval(() => {
      if (!isMounted) return;
      const now = Date.now();
      setActiveCooldowns((prev) => {
        return prev
          .map((cd) => ({
            ...cd,
            remaining: Math.max(0, cd.startTime + cd.duration - now),
          }))
          .filter((cd) => cd.remaining > 0);
      });
    }, 100);

    return () => {
      isMounted = false;
      if (cooldownUpdateIntervalRef.current) {
        clearInterval(cooldownUpdateIntervalRef.current);
        cooldownUpdateIntervalRef.current = null;
      }
    };
  }, [activeCooldowns.length]);

  // Check if technique is on cooldown
  const isOnCooldown = useCallback(
    (techniqueId: string): boolean => {
      return activeCooldowns.some(
        (cd) => cd.techniqueId === techniqueId && cd.remaining > 0
      );
    },
    [activeCooldowns]
  );

  // Get remaining cooldown time
  const getRemainingCooldown = useCallback(
    (techniqueId: string): number => {
      const cooldown = activeCooldowns.find(
        (cd) => cd.techniqueId === techniqueId
      );
      return cooldown?.remaining ?? 0;
    },
    [activeCooldowns]
  );

  // Check if player has sufficient resources
  const hasResources = useCallback(
    (technique: Technique): boolean => {
      return (
        player.stamina >= technique.staminaCost && player.ki >= technique.kiCost
      );
    },
    [player.stamina, player.ki]
  );

  // Validate technique execution
  const validateTechnique = useCallback(
    (technique: Technique): TechniqueValidation => {
      // Check stamina
      if (player.stamina < technique.staminaCost) {
        return {
          canExecute: false,
          reason: "Insufficient stamina",
          insufficientStamina: true,
        };
      }

      // Check Ki
      if (player.ki < technique.kiCost) {
        return {
          canExecute: false,
          reason: "Insufficient Ki",
          insufficientKi: true,
        };
      }

      // Check cooldown
      if (isOnCooldown(technique.id)) {
        return {
          canExecute: false,
          reason: "Technique on cooldown",
          onCooldown: true,
        };
      }

      // Check required stance
      if (
        technique.requiredStance &&
        player.currentStance !== technique.requiredStance
      ) {
        return {
          canExecute: false,
          reason: `Requires ${technique.requiredStance} stance`,
          wrongStance: true,
        };
      }

      return {
        canExecute: true,
      };
    },
    [player.stamina, player.ki, player.currentStance, isOnCooldown]
  );

  // Select technique by index
  const selectTechnique = useCallback(
    (index: number) => {
      if (index < 0 || index >= availableTechniques.length) return;
      if (!enabled) return;

      setSelectedIndex(index);
      const technique = availableTechniques[index];
      onTechniqueSelected?.(technique);
    },
    [availableTechniques, enabled, onTechniqueSelected]
  );

  // Execute currently selected technique
  const executeTechnique = useCallback(
    (indexOverride?: number) => {
      if (!enabled) return;

      const index = indexOverride ?? selectedIndex;
      const technique = availableTechniques[index];
      if (!technique) return;

      // Validate technique execution
      const validation = validateTechnique(technique);
      if (!validation.canExecute) {
        console.warn(`Cannot execute technique: ${validation.reason}`);
        return;
      }

      // Start cooldown
      const now = Date.now();
      const cooldown: TechniqueCooldown = {
        techniqueId: technique.id,
        startTime: now,
        duration: technique.cooldown,
        remaining: technique.cooldown,
      };
      setActiveCooldowns((prev) => [...prev, cooldown]);

      // Execute technique
      onTechniqueExecute?.(technique);
    },
    [
      enabled,
      availableTechniques,
      selectedIndex,
      validateTechnique,
      onTechniqueExecute,
    ]
  );

  // Keyboard shortcut handler
  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't capture if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key.toUpperCase() as TechniqueKey;

      // Technique keys - top row Q through P (10 keys)
      const techniqueKeys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];

      // Prevent default for all technique keys during combat
      if (techniqueKeys.includes(key)) {
        event.preventDefault();
      }

      // Map keys to technique indices
      const keyMap: Record<TechniqueKey, number> = {
        Q: 0,
        W: 1,
        E: 2,
        R: 3,
        T: 4,
        Y: 5,
        U: 6,
        I: 7,
        O: 8,
        P: 9,
      };

      const index = keyMap[key];
      if (index !== undefined && index < availableTechniques.length) {
        selectTechnique(index);
        executeTechnique(index);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [enabled, availableTechniques, selectTechnique, executeTechnique]);

  return {
    availableTechniques,
    selectedIndex,
    activeCooldowns,
    selectTechnique,
    executeTechnique,
    validateTechnique,
    isOnCooldown,
    getRemainingCooldown,
    hasResources,
  };
}

export default useTechniqueSelection;
