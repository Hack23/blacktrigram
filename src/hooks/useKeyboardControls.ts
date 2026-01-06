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
import { FOOTWORK_KOREAN_TERMS } from "../systems/animation/types";

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

// Footwork pattern Korean terminology - maps animation states to display names
// Reuses FOOTWORK_KOREAN_TERMS from types.ts but adds specific animation state labels
const FOOTWORK_DISPLAY_TERMS: Record<string, string> = {
  "footwork_circular_left": `${FOOTWORK_KOREAN_TERMS.circular.korean} 좌 (Circular Left)`,
  "footwork_circular_right": `${FOOTWORK_KOREAN_TERMS.circular.korean} 우 (Circular Right)`,
  "footwork_pivot_left": `${FOOTWORK_KOREAN_TERMS.pivot.korean} 좌 (Pivot Left)`,
  "footwork_pivot_right": `${FOOTWORK_KOREAN_TERMS.pivot.korean} 우 (Pivot Right)`,
  "footwork_slide_forward": `${FOOTWORK_KOREAN_TERMS.slide.korean} 전 (Slide Forward)`,
  "footwork_slide_back": `${FOOTWORK_KOREAN_TERMS.slide.korean} 후 (Slide Back)`,
  "footwork_slide_left": `${FOOTWORK_KOREAN_TERMS.slide.korean} 좌 (Slide Left)`,
  "footwork_slide_right": `${FOOTWORK_KOREAN_TERMS.slide.korean} 우 (Slide Right)`,
  "footwork_shuffle": `${FOOTWORK_KOREAN_TERMS.shuffle.korean} (Shuffle)`,
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
  /** Current animation state for grounded detection */
  readonly currentAnimationState?: string;
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
  currentAnimationState,
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

      // Recovery input detection (기상 입력 감지)
      // When player is in ground state, any button triggers recovery options
      const isGrounded = currentAnimationState?.startsWith("ground_");
      
      if (isGrounded) {
        // Space: Quick/default recovery
        if (e.key === " ") {
          e.preventDefault();
          onAction("recovery_quick");
          addToQueue("기상 (Quick Recovery)", "Space");
          if (playSFX) playSFX("stance_change");
          return;
        }
        
        // R or Enter: Roll recovery (회전기상) - fast but costs stamina
        if (e.key.toLowerCase() === "r" || e.key === "Enter") {
          e.preventDefault();
          onAction("recovery_roll");
          addToQueue("회전기상 (Roll Recovery)", e.key);
          if (playSFX) playSFX("stance_change");
          return;
        }
        
        // Shift: Defensive getup (방어기상) - slow but protected
        if (e.key === "Shift") {
          e.preventDefault();
          onAction("recovery_defensive");
          addToQueue("방어기상 (Defensive Getup)", "Shift");
          if (playSFX) playSFX("stance_change");
          return;
        }
        
        // If grounded, don't process other inputs (can't attack/move while down)
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
            // Check for Ctrl modifier for footwork patterns (보법)
            if (e.ctrlKey) {
              // Footwork patterns with Ctrl+WASD
              // Note: Currently only circular and slide patterns have controls.
              // Pivot and shuffle patterns are configured but awaiting keybinding.
              let footworkAction: string | null = null;
              
              if (action === "move_left") {
                // Ctrl+A: Circular step left (원형보)
                footworkAction = "footwork_circular_left";
              } else if (action === "move_right") {
                // Ctrl+D: Circular step right (원형보)
                footworkAction = "footwork_circular_right";
              } else if (action === "move_up") {
                // Ctrl+W: Slide forward (미끄럼보)
                footworkAction = "footwork_slide_forward";
              } else if (action === "move_down") {
                // Ctrl+S: Slide back (미끄럼보)
                footworkAction = "footwork_slide_back";
              }
              
              if (footworkAction) {
                onAction(footworkAction);
                addToQueue(
                  FOOTWORK_DISPLAY_TERMS[footworkAction] ?? "Footwork",
                  `Ctrl+${e.key}`
                );
                if (playSFX) playSFX("footstep");
              }
            } else if (e.shiftKey) {
              // Check if Shift is held for tactical step instead of walk
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
              addToQueue(action, e.key);
            }
            break;

          case "vital_points_overlay":
            // Vital points overlay toggle
            onAction("vital_points_overlay");
            addToQueue("Vital Points", e.key);
            if (playSFX) playSFX("menu_select");
            break;

          case "pause":
            // Pause menu toggle
            onAction("pause");
            addToQueue("Pause", e.key);
            if (playSFX) playSFX("menu_select");
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
