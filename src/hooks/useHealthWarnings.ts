/**
 * useHealthWarnings Hook - Low health and stamina warning system
 * 
 * Provides warning states and audio feedback for:
 * - Low health (<30%)
 * - Critical health (<20%)
 * - Low stamina (<30%)
 * - Critical stamina (<20%)
 */

import { useEffect, useCallback, useRef } from "react";
import { useAudio } from "../audio/AudioProvider";

export interface HealthWarningsConfig {
  /** Threshold for low health warning (percentage) */
  readonly lowHealthThreshold?: number;
  /** Threshold for critical health warning (percentage) */
  readonly criticalHealthThreshold?: number;
  /** Threshold for low stamina warning (percentage) */
  readonly lowStaminaThreshold?: number;
  /** Threshold for critical stamina warning (percentage) */
  readonly criticalStaminaThreshold?: number;
  /** Minimum time between audio warnings (ms) */
  readonly audioWarningCooldown?: number;
}

export interface HealthWarningState {
  /** Whether health is in low state */
  readonly isLowHealth: boolean;
  /** Whether health is in critical state */
  readonly isCriticalHealth: boolean;
  /** Whether stamina is in low state */
  readonly isLowStamina: boolean;
  /** Whether stamina is in critical state */
  readonly isCriticalStamina: boolean;
}

/**
 * useHealthWarnings - Monitor player health and stamina for warning states
 * 
 * @param currentHealth - Current health value
 * @param maxHealth - Maximum health value
 * @param currentStamina - Current stamina value
 * @param maxStamina - Maximum stamina value
 * @param config - Optional configuration for thresholds
 * @returns Warning state object
 */
export const useHealthWarnings = (
  currentHealth: number,
  maxHealth: number,
  currentStamina: number,
  maxStamina: number,
  config: HealthWarningsConfig = {}
): HealthWarningState => {
  const {
    lowHealthThreshold = 30,
    criticalHealthThreshold = 20,
    lowStaminaThreshold = 30,
    criticalStaminaThreshold = 20,
    audioWarningCooldown = 3000,
  } = config;

  const audio = useAudio();
  const lastWarningTime = useRef<number>(0);

  // Calculate percentages
  const healthPercent = (currentHealth / maxHealth) * 100;
  const staminaPercent = (currentStamina / maxStamina) * 100;

  // Determine warning states
  const isLowHealth = healthPercent < lowHealthThreshold;
  const isCriticalHealth = healthPercent < criticalHealthThreshold;
  const isLowStamina = staminaPercent < lowStaminaThreshold;
  const isCriticalStamina = staminaPercent < criticalStaminaThreshold;

  // Play audio warnings with cooldown
  const playWarningSound = useCallback(
    (soundKey: string) => {
      const now = Date.now();
      if (now - lastWarningTime.current > audioWarningCooldown) {
        audio.playSFX(soundKey);
        lastWarningTime.current = now;
      }
    },
    [audio, audioWarningCooldown]
  );

  // Monitor for critical health transitions
  useEffect(() => {
    if (isCriticalHealth) {
      playWarningSound("health_critical");
    }
  }, [isCriticalHealth, playWarningSound]);

  // Monitor for critical stamina transitions
  useEffect(() => {
    if (isCriticalStamina) {
      playWarningSound("stamina_low");
    }
  }, [isCriticalStamina, playWarningSound]);

  return {
    isLowHealth,
    isCriticalHealth,
    isLowStamina,
    isCriticalStamina,
  };
};

export default useHealthWarnings;
