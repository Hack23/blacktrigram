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

// Korean terminology constants (module-level to avoid recreation on every keystroke)
const DIAGONAL_KOREAN_TERMS: Record<string, string> = {
  "step_forward_left": "전좌측보법 (Forward-Left)",
  "step_forward_right": "전우측보법 (Forward-Right)",
  "step_back_left": "후좌측보법 (Back-Left)",
  "step_back_right": "후우측보법 (Back-Right)",
};

const STEP_KOREAN_TERMS: Record<string, string> = {
  "step_forward": "전진보법 (Forward Step)",
  "step_back": "후퇴보법 (Retreat Step)",
  "step_left": "좌측면보법 (Left Step)",
  "step_right": "우측면보법 (Right Step)",
};

// Step direction mapping (all move_* actions covered explicitly)
const STEP_DIRECTION_MAP: Record<string, string> = {
  move_up: "step_forward",
  move_down: "step_back",
  move_left: "step_left",
  move_right: "step_right",
};

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
  
  // Track currently pressed keys for diagonal step detection
  const pressedKeysRef = useRef<Set<string>>(new Set());

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
   * Detect diagonal step direction from pressed keys
   * Returns step action for diagonal or null if not diagonal
   * 
   * @korean 대각선발걸음감지
   */
  const getDiagonalStepAction = useCallback((): string | null => {
    const keys = pressedKeysRef.current;
    const mapper = controlMapperRef.current;
    
    // Check for forward diagonals
    if (keys.has(mapper.getBindings().movement.up.toLowerCase())) {
      if (keys.has(mapper.getBindings().movement.left.toLowerCase())) {
        return "step_forward_left"; // 전좌측보법
      }
      if (keys.has(mapper.getBindings().movement.right.toLowerCase())) {
        return "step_forward_right"; // 전우측보법
      }
    }
    
    // Check for backward diagonals
    if (keys.has(mapper.getBindings().movement.down.toLowerCase())) {
      if (keys.has(mapper.getBindings().movement.left.toLowerCase())) {
        return "step_back_left"; // 후좌측보법
      }
      if (keys.has(mapper.getBindings().movement.right.toLowerCase())) {
        return "step_back_right"; // 후우측보법
      }
    }
    
    return null;
  }, []);

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

    // Copy ref value for cleanup
    const pressedKeys = pressedKeysRef.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      const mapper = controlMapperRef.current;
      
      // Track pressed keys for diagonal detection
      pressedKeysRef.current.add(e.key.toLowerCase());

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
            // Check if Shift is held for tactical step instead of walk
            if (e.shiftKey) {
              // Check for diagonal step first
              const diagonalStep = getDiagonalStepAction();
              
              if (diagonalStep) {
                // Diagonal tactical step
                onAction(diagonalStep);
                
                addToQueue(DIAGONAL_KOREAN_TERMS[diagonalStep] ?? "Diagonal Step", `Shift+${e.key}`);
                
                if (playSFX) playSFX("footstep");
              } else {
                // Cardinal direction tactical step
                // Map move_up/move_down to step_forward/step_back to match AnimationState
                const stepDirection = STEP_DIRECTION_MAP[action];
                onAction(stepDirection);
                
                addToQueue(STEP_KOREAN_TERMS[stepDirection] ?? "Step", `Shift+${e.key}`);
                
                if (playSFX) playSFX("footstep");
              }
            } else {
              // Regular movement
              onAction(action);
            }
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
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // Remove key from pressed keys set
      pressedKeysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      // Clear pressed keys on cleanup using copied ref value
      pressedKeys.clear();
    };
  }, [
    enabled,
    currentStance,
    onStanceChange,
    onAction,
    addToQueue,
    toggleHints,
    getDiagonalStepAction,
    showHints,
    playSFX,
  ]);

  return {
    queuedInputs,
    showHints,
    toggleHints,
  };
}
