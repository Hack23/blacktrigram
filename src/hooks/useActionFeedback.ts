/**
 * useActionFeedback Hook - Player Action Feedback State Management
 * 
 * Manages state for floating damage numbers, combo counter, technique names,
 * and action indicators (Perfect, Critical, Blocked, Dodged).
 *
 * @module hooks/useActionFeedback
 * @category Combat UI
 * @korean 액션피드백
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Position } from "../types";

/**
 * Types of action feedback indicators
 */
export type ActionFeedbackType = 
  | "perfect"
  | "critical"
  | "blocked"
  | "dodged"
  | "technique"
  | "combo_milestone";

/**
 * Damage number type for color coding
 */
export type DamageType = "normal" | "critical" | "vital";

/**
 * Represents a floating damage number
 */
export interface DamageNumber {
  readonly id: string;
  readonly damage: number;
  readonly position: Position;
  readonly type: DamageType;
  readonly timestamp: number;
}

/**
 * Represents an action feedback indicator
 */
export interface ActionFeedback {
  readonly id: string;
  readonly type: ActionFeedbackType;
  readonly text: string;
  readonly textKorean: string;
  readonly position: Position;
  readonly timestamp: number;
}

/**
 * Action feedback state
 */
export interface ActionFeedbackState {
  readonly damageNumbers: DamageNumber[];
  readonly actionFeedbacks: ActionFeedback[];
  readonly comboCount: number;
  readonly lastHitTime: number;
  readonly currentTechnique: { korean: string; english: string } | null;
  readonly techniqueShowTime: number;
}

/**
 * Action feedback actions interface
 */
export interface ActionFeedbackActions {
  readonly addDamageNumber: (damage: number, position: Position, type?: DamageType) => void;
  readonly addActionFeedback: (type: ActionFeedbackType, text: string, textKorean: string, position: Position) => void;
  readonly incrementCombo: () => void;
  readonly resetCombo: () => void;
  readonly showTechnique: (korean: string, english: string) => void;
  readonly hideTechnique: () => void;
  readonly clearExpired: () => void;
}

/**
 * Configuration for useActionFeedback hook
 */
export interface UseActionFeedbackConfig {
  /** Duration in ms for damage numbers to display (default: 1500) */
  readonly damageNumberDuration?: number;
  /** Duration in ms for action feedback to display (default: 1200) */
  readonly actionFeedbackDuration?: number;
  /** Duration in ms for technique name to display (default: 2000) */
  readonly techniqueDuration?: number;
  /** Duration in ms before combo resets after no hits (default: 2000) */
  readonly comboResetTime?: number;
}

/** Default configuration */
const DEFAULT_CONFIG: Required<UseActionFeedbackConfig> = {
  damageNumberDuration: 1500,
  actionFeedbackDuration: 1200,
  techniqueDuration: 2000,
  comboResetTime: 2000,
};

/**
 * useActionFeedback Hook
 * 
 * Manages combat action feedback including:
 * - Floating damage numbers with color coding (normal, critical, vital)
 * - Combo counter with automatic reset
 * - Technique name display (Korean | English)
 * - Action indicators (Perfect, Critical, Blocked, Dodged)
 *
 * @param config - Optional configuration for durations and timing
 * @returns Action feedback state and actions
 *
 * @example
 * ```typescript
 * const { state, actions } = useActionFeedback({
 *   damageNumberDuration: 1500,
 *   comboResetTime: 2000,
 * });
 *
 * // Add damage number
 * actions.addDamageNumber(25, { x: 100, y: 200 }, 'critical');
 *
 * // Show technique name
 * actions.showTechnique('천둥벽력', 'Thunder Strike');
 *
 * // Increment combo
 * actions.incrementCombo();
 * ```
 */
export function useActionFeedback(config: UseActionFeedbackConfig = {}): {
  state: ActionFeedbackState;
  actions: ActionFeedbackActions;
} {
  const {
    damageNumberDuration,
    actionFeedbackDuration,
    techniqueDuration,
    comboResetTime,
  } = { ...DEFAULT_CONFIG, ...config };

  // State
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  const [actionFeedbacks, setActionFeedbacks] = useState<ActionFeedback[]>([]);
  const [comboCount, setComboCount] = useState(0);
  const [lastHitTime, setLastHitTime] = useState(0);
  const [currentTechnique, setCurrentTechnique] = useState<{ korean: string; english: string } | null>(null);
  const [techniqueShowTime, setTechniqueShowTime] = useState(0);

  // Refs for timers
  const comboResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const techniqueTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idCounterRef = useRef(0);

  // Generate unique ID using counter and timestamp for guaranteed uniqueness
  const generateId = useCallback(() => {
    idCounterRef.current += 1;
    return `feedback_${Date.now()}_${idCounterRef.current}`;
  }, []);

  // Add damage number
  const addDamageNumber = useCallback((
    damage: number,
    position: Position,
    type: DamageType = "normal"
  ) => {
    const damageNumber: DamageNumber = {
      id: generateId(),
      damage,
      position,
      type,
      timestamp: Date.now(),
    };
    setDamageNumbers(prev => [...prev, damageNumber]);
  }, [generateId]);

  // Add action feedback
  const addActionFeedback = useCallback((
    type: ActionFeedbackType,
    text: string,
    textKorean: string,
    position: Position
  ) => {
    const feedback: ActionFeedback = {
      id: generateId(),
      type,
      text,
      textKorean,
      position,
      timestamp: Date.now(),
    };
    setActionFeedbacks(prev => [...prev, feedback]);
  }, [generateId]);

  // Increment combo counter
  const incrementCombo = useCallback(() => {
    setComboCount(prev => prev + 1);
    setLastHitTime(Date.now());

    // Clear existing reset timer
    if (comboResetTimerRef.current) {
      clearTimeout(comboResetTimerRef.current);
    }

    // Set new reset timer
    comboResetTimerRef.current = setTimeout(() => {
      setComboCount(0);
    }, comboResetTime);
  }, [comboResetTime]);

  // Reset combo counter
  const resetCombo = useCallback(() => {
    setComboCount(0);
    if (comboResetTimerRef.current) {
      clearTimeout(comboResetTimerRef.current);
      comboResetTimerRef.current = null;
    }
  }, []);

  // Show technique name
  const showTechnique = useCallback((korean: string, english: string) => {
    setCurrentTechnique({ korean, english });
    setTechniqueShowTime(Date.now());

    // Clear existing timer
    if (techniqueTimerRef.current) {
      clearTimeout(techniqueTimerRef.current);
    }

    // Set hide timer
    techniqueTimerRef.current = setTimeout(() => {
      setCurrentTechnique(null);
    }, techniqueDuration);
  }, [techniqueDuration]);

  // Hide technique name
  const hideTechnique = useCallback(() => {
    setCurrentTechnique(null);
    if (techniqueTimerRef.current) {
      clearTimeout(techniqueTimerRef.current);
      techniqueTimerRef.current = null;
    }
  }, []);

  // Clear expired items
  const clearExpired = useCallback(() => {
    const now = Date.now();

    setDamageNumbers(prev =>
      prev.filter(d => now - d.timestamp < damageNumberDuration)
    );

    setActionFeedbacks(prev =>
      prev.filter(f => now - f.timestamp < actionFeedbackDuration)
    );
  }, [damageNumberDuration, actionFeedbackDuration]);

  // Setup cleanup interval
  useEffect(() => {
    cleanupIntervalRef.current = setInterval(clearExpired, 100);

    return () => {
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
      if (comboResetTimerRef.current) {
        clearTimeout(comboResetTimerRef.current);
      }
      if (techniqueTimerRef.current) {
        clearTimeout(techniqueTimerRef.current);
      }
    };
  }, [clearExpired]);

  return {
    state: {
      damageNumbers,
      actionFeedbacks,
      comboCount,
      lastHitTime,
      currentTechnique,
      techniqueShowTime,
    },
    actions: {
      addDamageNumber,
      addActionFeedback,
      incrementCombo,
      resetCombo,
      showTechnique,
      hideTechnique,
      clearExpired,
    },
  };
}

