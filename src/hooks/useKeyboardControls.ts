/**
 * Custom hook for keyboard controls with visual feedback
 * Manages keyboard input for trigram stance switching and combat actions
 * 
 * @module hooks/useKeyboardControls
 * @category Input System
 * @korean 키보드 컨트롤 훅
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ControlMapper } from "../utils/controlMapping";

/**
 * Queued input for input buffer display
 */
export interface QueuedInput {
  readonly action: string;
  readonly key: string;
  readonly timestamp: number;
}

/**
 * Props for useKeyboardControls hook
 */
export interface UseKeyboardControlsProps {
  /** Callback when stance changes (receives stance index 0-7) */
  readonly onStanceChange: (stance: number) => void;
  /** Callback for combat actions (attack, block, etc.) */
  readonly onAction: (action: string) => void;
  /** Whether keyboard input is enabled */
  readonly enabled?: boolean;
  /** Current stance index (0-7) for validation */
  readonly currentStance?: number;
  /** Callback when hints toggle is requested */
  readonly onToggleHints?: () => void;
  /** Play sound effect function */
  readonly playSFX?: (soundId: string) => void;
}

/**
 * Return type for useKeyboardControls hook
 */
export interface UseKeyboardControlsReturn {
  /** Queued inputs for display */
  readonly queuedInputs: readonly QueuedInput[];
  /** Whether hints are visible */
  readonly showHints: boolean;
  /** Toggle hints visibility */
  readonly toggleHints: () => void;
}

/**
 * Maximum number of inputs to keep in queue
 */
const MAX_QUEUE_SIZE = 3;

/**
 * Time to keep inputs in queue (milliseconds)
 */
const QUEUE_RETENTION_TIME = 2000;

/**
 * Custom hook for handling keyboard controls with visual feedback
 * 
 * Features:
 * - Trigram stance switching (1-8 keys or custom bindings)
 * - Combat action handling (attack, block, movement)
 * - Input queue visualization
 * - Keyboard hints toggle (F1)
 * - Invalid input prevention
 * - Audio feedback integration
 * 
 * @example
 * ```typescript
 * const { queuedInputs, showHints, toggleHints } = useKeyboardControls({
 *   onStanceChange: (stance) => handleStanceChange(stance),
 *   onAction: (action) => handleAction(action),
 *   enabled: !isPaused,
 *   currentStance: player.stance,
 *   playSFX: audio.playSFX,
 * });
 * ```
 * 
 * @public
 * @korean 키보드컨트롤사용
 */
export function useKeyboardControls({
  onStanceChange,
  onAction,
  enabled = true,
  currentStance = 0,
  onToggleHints,
  playSFX,
}: UseKeyboardControlsProps): UseKeyboardControlsReturn {
  const [queuedInputs, setQueuedInputs] = useState<readonly QueuedInput[]>([]);
  const [showHints, setShowHints] = useState(false);
  const controlMapperRef = useRef<ControlMapper>(new ControlMapper());
  const lastStanceChangeRef = useRef<number>(0);

  /**
   * Toggle hints visibility
   */
  const toggleHints = useCallback(() => {
    setShowHints((prev) => {
      const newState = !prev;
      if (onToggleHints) {
        onToggleHints();
      }
      // Play UI sound
      if (playSFX) {
        playSFX("menu_select");
      }
      return newState;
    });
  }, [onToggleHints, playSFX]);

  /**
   * Add input to queue
   */
  const addToQueue = useCallback((action: string, key: string) => {
    const newInput: QueuedInput = {
      action,
      key,
      timestamp: Date.now(),
    };

    setQueuedInputs((prev) => {
      const updated = [newInput, ...prev].slice(0, MAX_QUEUE_SIZE);
      return updated;
    });
  }, []);

  /**
   * Clean up old queued inputs
   * Single interval for component lifetime to avoid recreating on every input
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setQueuedInputs((prev) => {
        if (prev.length === 0) return prev;
        return prev.filter((input) => now - input.timestamp < QUEUE_RETENTION_TIME);
      });
    }, 500);

    return () => clearInterval(interval);
  }, []); // Empty deps - single interval for component lifetime

  /**
   * Handle keyboard input
   */
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const mapper = controlMapperRef.current;

      // F1: Toggle hints (prevent default browser help)
      if (e.key === "F1") {
        e.preventDefault();
        toggleHints();
        return;
      }

      // Escape: Close hints if open
      if (e.key === "Escape" && showHints) {
        e.preventDefault();
        setShowHints(false);
        return;
      }

      // Check for stance change (1-8 or custom bindings)
      const stanceIndex = mapper.getStanceForKey(e.key);
      if (stanceIndex !== null) {
        e.preventDefault();

        // Prevent switching to the same stance
        if (stanceIndex === currentStance) {
          // Invalid input feedback (shake animation trigger)
          addToQueue(`Stance ${stanceIndex + 1} (already active)`, e.key);

          // Play error sound
          if (playSFX) {
            playSFX("menu_error");
          }
          return;
        }

        // Throttle stance changes (minimum 8 frames at 60fps = 133ms)
        const now = Date.now();
        if (now - lastStanceChangeRef.current < 133) {
          return;
        }
        lastStanceChangeRef.current = now;

        // Execute stance change
        onStanceChange(stanceIndex);
        addToQueue(`Stance ${stanceIndex + 1}`, e.key);

        // Play stance change sound
        if (playSFX) {
          playSFX("stance_change");
        }
        return;
      }

      // Handle other actions
      const action = mapper.getActionForKey(e.key);
      if (action) {
        e.preventDefault();

        switch (action) {
          case "attack":
            onAction("attack");
            addToQueue("Attack", e.key);
            if (playSFX) playSFX("attack_light");
            break;

          case "block":
            onAction("block");
            addToQueue("Block", e.key);
            if (playSFX) playSFX("block");
            break;

          case "move_up":
          case "move_down":
          case "move_left":
          case "move_right":
            onAction(action);
            break;

          case "precision":
            onAction("precision");
            addToQueue("Precision Mode", e.key);
            if (playSFX) playSFX("menu_select");
            break;

          case "quick_switch":
            onAction("quick_switch");
            addToQueue("Quick Switch", e.key);
            if (playSFX) playSFX("stance_change");
            break;

          case "reset":
            onAction("reset");
            addToQueue("Reset", e.key);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    enabled,
    currentStance,
    onStanceChange,
    onAction,
    addToQueue,
    toggleHints,
    showHints,
    playSFX,
  ]);

  return {
    queuedInputs,
    showHints,
    toggleHints,
  };
}
