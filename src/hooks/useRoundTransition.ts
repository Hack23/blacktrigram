/**
 * useRoundTransition Hook - Manages round transition state and timing
 *
 * Korean: 라운드 전환 훅 (Round Transition Hook)
 *
 * Handles the state machine for round transitions:
 * - idle: Normal combat state
 * - announcing: Showing round announcement
 * - countdown: Counting down to next round
 * - transitioning: Brief transition to next round
 *
 * @module hooks/useRoundTransition
 * @category Combat Hooks
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayerState } from "../systems";

/**
 * Round transition states
 *
 * Korean: 라운드 전환 상태
 */
export type RoundTransitionState =
  | "idle"
  | "announcing"
  | "countdown"
  | "transitioning";

/**
 * Round transition configuration
 */
export interface RoundTransitionConfig {
  /** Duration of announcement display in seconds */
  readonly announcementDuration?: number;
  /** Duration of countdown in seconds */
  readonly countdownDuration?: number;
  /** Duration of transition phase in milliseconds */
  readonly transitionDuration?: number;
}

/**
 * Round transition hook state
 */
export interface UseRoundTransitionResult {
  /** Current transition state */
  readonly transitionState: RoundTransitionState;
  /** Whether announcement should be visible */
  readonly showAnnouncement: boolean;
  /** Start round transition sequence */
  readonly startTransition: (
    winner: PlayerState | null,
    roundNumber: number
  ) => void;
  /** Skip countdown and proceed immediately */
  readonly skipCountdown: () => void;
  /** Reset transition state to idle */
  readonly resetTransition: () => void;
  /** Round winner for current transition */
  readonly roundWinner: PlayerState | null;
  /** Round number for current transition */
  readonly currentRoundNumber: number;
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<RoundTransitionConfig> = {
  announcementDuration: 2,
  countdownDuration: 3,
  transitionDuration: 500,
};

/**
 * useRoundTransition Hook
 *
 * Manages the complete round transition flow:
 * 1. Idle state during normal combat
 * 2. Announcing state shows round results
 * 3. Countdown state counts down to next round
 * 4. Transitioning state briefly transitions to next round
 * 5. Returns to idle for next round
 *
 * @param config - Configuration for transition timings
 * @param onTransitionComplete - Callback when transition completes
 * @returns Round transition state and control functions
 *
 * @example
 * ```typescript
 * const {
 *   transitionState,
 *   showAnnouncement,
 *   startTransition,
 *   skipCountdown,
 * } = useRoundTransition(
 *   { countdownDuration: 3 },
 *   () => {
 *     // Start next round
 *     initializeNextRound();
 *   }
 * );
 *
 * // When round ends
 * startTransition(winner, roundNumber);
 * ```
 */
export function useRoundTransition(
  config: RoundTransitionConfig = {},
  onTransitionComplete?: () => void
): UseRoundTransitionResult {
  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );

  const [transitionState, setTransitionState] =
    useState<RoundTransitionState>("idle");
  const [roundWinner, setRoundWinner] = useState<PlayerState | null>(null);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(0);

  // Use ref to track if we should continue countdown
  const countdownActive = useRef(false);
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);
  const transitionTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Clear all active timers
   */
  const clearTimers = useCallback(() => {
    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
    }
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
    }
  }, []);

  /**
   * Start the transition sequence
   */
  const startTransition = useCallback(
    (winner: PlayerState | null, roundNumber: number) => {
      clearTimers();
      setRoundWinner(winner);
      setCurrentRoundNumber(roundNumber);
      setTransitionState("announcing");

      // Move to countdown after announcement
      const announcementTimer = setTimeout(() => {
        setTransitionState("countdown");
        countdownActive.current = true;

        // Countdown will be managed by the RoundAnnouncement component
        // After countdownDuration, move to transitioning state
        countdownTimer.current = setTimeout(() => {
          countdownActive.current = false;
          setTransitionState("transitioning");

          // Complete transition after brief delay
          transitionTimer.current = setTimeout(() => {
            setTransitionState("idle");
            onTransitionComplete?.();
          }, mergedConfig.transitionDuration);
        }, mergedConfig.countdownDuration * 1000);
      }, mergedConfig.announcementDuration * 1000);

      // Store timer ref for cleanup
      transitionTimer.current = announcementTimer;
    },
    [clearTimers, mergedConfig, onTransitionComplete]
  );

  /**
   * Skip countdown and proceed immediately to next round
   */
  const skipCountdown = useCallback(() => {
    if (transitionState === "announcing" || transitionState === "countdown") {
      clearTimers();
      countdownActive.current = false;
      setTransitionState("transitioning");

      // Complete transition after brief delay
      transitionTimer.current = setTimeout(() => {
        setTransitionState("idle");
        onTransitionComplete?.();
      }, mergedConfig.transitionDuration);
    }
  }, [
    transitionState,
    clearTimers,
    mergedConfig.transitionDuration,
    onTransitionComplete,
  ]);

  /**
   * Reset transition to idle state
   */
  const resetTransition = useCallback(() => {
    clearTimers();
    countdownActive.current = false;
    setTransitionState("idle");
    setRoundWinner(null);
    setCurrentRoundNumber(0);
  }, [clearTimers]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      clearTimers();
      countdownActive.current = false;
    };
  }, [clearTimers]);

  return {
    transitionState,
    showAnnouncement:
      transitionState === "announcing" || transitionState === "countdown",
    startTransition,
    skipCountdown,
    resetTransition,
    roundWinner,
    currentRoundNumber,
  };
}

export default useRoundTransition;
