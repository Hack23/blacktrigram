/**
 * useCombatTimer - Hook for managing combat round timer
 *
 * Korean: 전투 라운드 타이머 훅 (Combat Round Timer Hook)
 *
 * Manages countdown timer for combat rounds with:
 * - Pause/resume support
 * - Warning thresholds at 10s and 5s
 * - Audio alerts for warnings
 * - Time's up callback
 *
 * @module hooks/useCombatTimer
 * @category Combat Hooks
 */

import { useEffect, useRef, useState } from "react";
import { useAudio } from "../audio/AudioProvider";

/**
 * Timer warning level indicating urgency
 */
export type TimerWarningLevel = "none" | "warning" | "urgent";

/**
 * Configuration for the combat timer hook
 */
export interface UseCombatTimerConfig {
  /** Initial time in seconds */
  readonly initialTime: number;
  /** Whether the timer is paused */
  readonly isPaused: boolean;
  /** Callback when timer reaches 0 */
  readonly onTimeUp: () => void;
  /** Warning threshold in seconds (default: 10) */
  readonly warningThreshold?: number;
  /** Urgent warning threshold in seconds (default: 5) */
  readonly urgentThreshold?: number;
  /** Optional key to force timer reset (e.g., round number) */
  readonly resetKey?: string;
}

/**
 * Return value from useCombatTimer hook
 */
export interface UseCombatTimerReturn {
  /** Current time remaining in seconds */
  readonly timeRemaining: number;
  /** Current warning level */
  readonly warningLevel: TimerWarningLevel;
  /** Whether timer has reached 0 */
  readonly isTimeUp: boolean;
  /** Formatted time string (MM:SS) */
  readonly formattedTime: string;
}

/**
 * Format seconds into MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted string (e.g., "03:45", "00:05")
 */
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Get warning level based on time remaining
 */
function getWarningLevel(
  timeRemaining: number,
  warningThreshold: number,
  urgentThreshold: number
): TimerWarningLevel {
  if (timeRemaining <= urgentThreshold) {
    return "urgent";
  }
  if (timeRemaining <= warningThreshold) {
    return "warning";
  }
  return "none";
}

/**
 * useCombatTimer Hook
 *
 * Manages combat round countdown timer with pause support and audio warnings.
 *
 * Features:
 * - Counts down from initial time to 0
 * - Pauses/resumes based on isPaused prop
 * - Plays audio warning at warning threshold (default 10s)
 * - Plays urgent audio warning at urgent threshold (default 5s)
 * - Calls onTimeUp when timer reaches 0
 * - Provides formatted time string (MM:SS)
 * - Returns current warning level for UI styling
 *
 * Korean: 전투 라운드 타이머 관리 훅
 *
 * @example
 * ```tsx
 * const { timeRemaining, warningLevel, formattedTime } = useCombatTimer({
 *   initialTime: 180, // 3 minutes
 *   isPaused: false,
 *   onTimeUp: () => handleRoundEnd(),
 *   warningThreshold: 10,
 *   urgentThreshold: 5,
 * });
 * ```
 */
export function useCombatTimer(
  config: UseCombatTimerConfig
): UseCombatTimerReturn {
  const {
    initialTime,
    isPaused,
    onTimeUp,
    warningThreshold = 10,
    urgentThreshold = 5,
    resetKey,
  } = config;

  const audio = useAudio();
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const lastWarningRef = useRef<TimerWarningLevel>("none");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer when initialTime or resetKey changes (new round)
  useEffect(() => {
    setTimeRemaining(initialTime);
    setIsTimeUp(false);
    lastWarningRef.current = "none";
  }, [initialTime, resetKey]);

  // Timer countdown logic
  useEffect(() => {
    // Don't run if paused or time is up
    if (isPaused || isTimeUp) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Track start time for precise elapsed time calculation
    const startTimeRef = Date.now();
    const startingTimeRemaining = timeRemaining;

    // Start interval
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef) / 1000;
      const next = Math.max(0, startingTimeRemaining - elapsed);

      setTimeRemaining(next);

      // Check if time just reached 0
      if (next <= 0 && !isTimeUp) {
        setIsTimeUp(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        onTimeUp();
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, isTimeUp, onTimeUp]);

  // Warning level calculation
  const warningLevel = getWarningLevel(
    timeRemaining,
    warningThreshold,
    urgentThreshold
  );

  // Audio warnings
  useEffect(() => {
    if (!audio.isAudioReady) return;
    if (isPaused) return;

    // Play warning sound at threshold
    if (
      warningLevel === "warning" &&
      lastWarningRef.current === "none" &&
      timeRemaining <= warningThreshold &&
      timeRemaining > urgentThreshold
    ) {
      audio.playSFX("attack_light"); // Placeholder - will be timer_warning_10s
      lastWarningRef.current = "warning";
    }

    // Play urgent warning sound at urgent threshold
    if (
      warningLevel === "urgent" &&
      lastWarningRef.current !== "urgent" &&
      timeRemaining <= urgentThreshold &&
      timeRemaining > 0
    ) {
      audio.playSFX("attack_heavy"); // Placeholder - will be timer_warning_5s
      lastWarningRef.current = "urgent";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    warningLevel,
    timeRemaining,
    audio.isAudioReady,
    isPaused,
    warningThreshold,
    urgentThreshold,
  ]); // audio.playSFX is stable after initialization, omitted to prevent unnecessary re-renders

  // Format time for display
  const formattedTime = formatTime(timeRemaining);

  return {
    timeRemaining,
    warningLevel,
    isTimeUp,
    formattedTime,
  };
}
