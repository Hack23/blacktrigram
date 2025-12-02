/**
 * useMatchCountdown Hook - Manages match start countdown sequence
 * 
 * Korean: 매치 시작 카운트다운 훅 (Match Start Countdown Hook)
 * 
 * Handles the state machine for match start countdown:
 * - idle: Waiting to start
 * - ready: Showing "Ready?" message
 * - counting: Counting down "3... 2... 1..."
 * - fight: Showing "Fight!" announcement
 * - complete: Countdown finished, combat can begin
 * 
 * @module hooks/useMatchCountdown
 * @category Combat Hooks
 */

import { useState, useCallback, useEffect, useRef } from "react";

/**
 * Match countdown states
 * 
 * Korean: 매치 카운트다운 상태
 */
export type MatchCountdownState =
  | "idle"
  | "ready"
  | "counting"
  | "fight"
  | "complete";

/**
 * Match countdown configuration
 */
export interface MatchCountdownConfig {
  /** Duration of "Ready?" display in seconds */
  readonly readyDuration?: number;
  /** Duration of each countdown number in seconds */
  readonly countdownInterval?: number;
  /** Duration of "Fight!" display in seconds */
  readonly fightDuration?: number;
  /** Starting countdown number */
  readonly startNumber?: number;
}

/**
 * Match countdown hook state
 */
export interface UseMatchCountdownResult {
  /** Current countdown state */
  readonly state: MatchCountdownState;
  /** Current countdown number (3, 2, 1, or 0) */
  readonly currentNumber: number;
  /** Start countdown sequence */
  readonly startCountdown: () => void;
  /** Skip countdown and proceed immediately */
  readonly skipCountdown: () => void;
  /** Reset countdown to idle state */
  readonly resetCountdown: () => void;
  /** Whether countdown is in progress */
  readonly isActive: boolean;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<MatchCountdownConfig> = {
  readyDuration: 1,
  countdownInterval: 1,
  fightDuration: 1,
  startNumber: 3,
};

/**
 * useMatchCountdown Hook
 * 
 * Manages the complete match start countdown flow:
 * 1. Idle state waiting for match start
 * 2. Ready state shows "Ready?" message (1s)
 * 3. Counting state counts down from 3 to 1 (1s intervals)
 * 4. Fight state shows "Fight!" message (1s)
 * 5. Complete state signals combat can begin
 * 
 * @param config - Configuration for countdown timings
 * @param onComplete - Callback when countdown completes
 * @returns Match countdown state and control functions
 * 
 * @example
 * ```typescript
 * const {
 *   state,
 *   currentNumber,
 *   startCountdown,
 *   skipCountdown,
 * } = useMatchCountdown(
 *   { startNumber: 3 },
 *   () => {
 *     // Enable combat inputs
 *     enableCombatControls();
 *   }
 * );
 * 
 * // When match initializes
 * startCountdown();
 * ```
 */
export function useMatchCountdown(
  config: MatchCountdownConfig = {},
  onComplete?: () => void
): UseMatchCountdownResult {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const [state, setState] = useState<MatchCountdownState>("idle");
  const [currentNumber, setCurrentNumber] = useState(mergedConfig.startNumber);

  // Use refs to track active timers
  const readyTimer = useRef<NodeJS.Timeout | null>(null);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);
  const fightTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Clear all active timers
   */
  const clearTimers = useCallback(() => {
    if (readyTimer.current) {
      clearTimeout(readyTimer.current);
      readyTimer.current = null;
    }
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
    }
    if (fightTimer.current) {
      clearTimeout(fightTimer.current);
      fightTimer.current = null;
    }
  }, []);

  /**
   * Start the countdown sequence
   */
  const startCountdown = useCallback(() => {
    clearTimers();
    setState("ready");
    setCurrentNumber(mergedConfig.startNumber);

    // Show "Ready?" message
    readyTimer.current = setTimeout(() => {
      setState("counting");
      setCurrentNumber(mergedConfig.startNumber);

      // Countdown timer
      let count = mergedConfig.startNumber;
      countdownTimer.current = setInterval(() => {
        count -= 1;
        setCurrentNumber(count);

        if (count <= 0) {
          if (countdownTimer.current) {
            clearInterval(countdownTimer.current);
            countdownTimer.current = null;
          }

          // Show "Fight!" message
          setState("fight");

          fightTimer.current = setTimeout(() => {
            setState("complete");
            onComplete?.();
          }, mergedConfig.fightDuration * 1000);
        }
      }, mergedConfig.countdownInterval * 1000);
    }, mergedConfig.readyDuration * 1000);
  }, [clearTimers, mergedConfig, onComplete]);

  /**
   * Skip countdown and proceed immediately to fight state
   */
  const skipCountdown = useCallback(() => {
    clearTimers();
    setState("complete");
    onComplete?.();
  }, [clearTimers, onComplete]);

  /**
   * Reset countdown to idle state
   */
  const resetCountdown = useCallback(() => {
    clearTimers();
    setState("idle");
    setCurrentNumber(mergedConfig.startNumber);
  }, [clearTimers, mergedConfig.startNumber]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return {
    state,
    currentNumber,
    startCountdown,
    skipCountdown,
    resetCountdown,
    isActive: state !== "idle" && state !== "complete",
  };
}

export default useMatchCountdown;
