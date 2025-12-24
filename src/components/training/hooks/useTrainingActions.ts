/**
 * useTrainingActions Hook - Training Action Handlers
 *
 * Custom hook for managing training action handlers.
 * Mirrors useCombatActions pattern for consistency.
 *
 * @korean 훈련액션훅 - 훈련 액션 핸들러 관리
 */

import { useCallback, useRef } from "react";
import { AnimationState } from "../../../systems/animation/types";
import { TRIGRAM_STANCES_ORDER } from "../../../systems/trigram/types";
import { Position, TrigramStance } from "../../../types/common";
import { TrainingActions, TrainingScreenState } from "./useTrainingState";

export interface UseTrainingActionsConfig {
  readonly state: TrainingScreenState;
  readonly actions: TrainingActions;
  readonly playerPosition: Position;
  readonly player3DPosition: [number, number, number];
  readonly dummyPosition: [number, number, number];
  readonly audio: {
    readonly playSFX: (sound: string) => void;
  };
  readonly onPlayerUpdate: (updates: {
    currentStance?: TrigramStance;
    lastActionTime?: number;
    position?: Position;
  }) => void;
  readonly playerAnimation: {
    readonly transitionTo: (state: AnimationState) => boolean;
    readonly currentState: string;
  };
}

export interface UseTrainingActionsReturn {
  readonly handleStartTraining: () => void;
  readonly handleStopTraining: () => void;
  readonly handleDummyHit: (vitalPointId: string) => boolean;
  readonly handleDummyDefeated: () => void;
  readonly handleStanceChange: (stanceIndex: number) => void;
  readonly handleAttack: () => void;
  readonly pendingAttackRef: React.MutableRefObject<{
    accuracy: number;
    vitalPoint: string;
  } | null>;
}

/**
 * Calculate hit accuracy based on distance from player to dummy
 * Uses squared distance to avoid expensive Math.sqrt
 */
function calculateHitAccuracy(
  playerPos: [number, number, number],
  dummyPos: [number, number, number]
): number {
  const dx = playerPos[0] - dummyPos[0];
  const dz = playerPos[2] - dummyPos[2];
  const squaredDistance = dx * dx + dz * dz;
  // Max effective range is 8 units (squared = 64)
  return Math.max(0, 1 - squaredDistance / 64);
}

/**
 * useTrainingActions hook
 * Provides training action handlers with proper memoization
 */
export function useTrainingActions(
  config: UseTrainingActionsConfig
): UseTrainingActionsReturn {
  const {
    state,
    actions,
    player3DPosition,
    dummyPosition,
    audio,
    onPlayerUpdate,
    playerAnimation,
  } = config;

  // Ref to store pending attack data (for frame 6 execution)
  const pendingAttackRef = useRef<{
    accuracy: number;
    vitalPoint: string;
  } | null>(null);

  // Ref to store timeout for dummy reset
  const dummyResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartTraining = useCallback(() => {
    actions.startTraining();
    audio.playSFX("menu_select");
  }, [actions, audio]);

  const handleStopTraining = useCallback(() => {
    // Clear any pending dummy reset timeout
    if (dummyResetTimeoutRef.current) {
      clearTimeout(dummyResetTimeoutRef.current);
      dummyResetTimeoutRef.current = null;
    }
    actions.stopTraining();
    audio.playSFX("menu_back");
  }, [actions, audio]);

  const handleDummyDefeated = useCallback(() => {
    actions.setFeedback("훈련 더미 무력화! | Dummy Defeated!");
    audio.playSFX("ki_release");

    // Clear any existing timeout
    if (dummyResetTimeoutRef.current) {
      clearTimeout(dummyResetTimeoutRef.current);
    }

    // Reset dummy health after delay
    dummyResetTimeoutRef.current = setTimeout(() => {
      actions.resetDummy();
    }, 2000);
  }, [actions, audio]);

  const handleDummyHit = useCallback(
    (_vitalPointId: string): boolean => {
      if (!state.isTraining) return false;

      const accuracy = calculateHitAccuracy(player3DPosition, dummyPosition);

      // Determine hit position (dummy center)
      const hitPosition: [number, number, number] = [
        dummyPosition[0],
        1.5,
        dummyPosition[2],
      ];

      if (accuracy > 0.5) {
        const points = Math.round(accuracy * 100);
        const damage = Math.round(accuracy * 15); // 0-15 damage based on accuracy
        const isPerfect = accuracy > 0.9;

        // Register hit with state
        actions.registerHit(points, damage, isPerfect);

        // Determine feedback and sound
        let effectType: "success" | "perfect";
        if (isPerfect) {
          actions.setFeedback("완벽한 타격! | Perfect Strike!");
          audio.playSFX("ki_release");
          effectType = "perfect";
        } else if (accuracy > 0.7) {
          actions.setFeedback("좋은 타격! | Good Strike!");
          audio.playSFX("ki_charge");
          effectType = "success";
        } else {
          actions.setFeedback("타격 성공 | Strike Success");
          audio.playSFX("menu_click");
          effectType = "success";
        }

        // Add hit effect
        actions.addHitEffect({
          position: hitPosition,
          type: effectType,
          visible: true,
          damage,
        });

        return true;
      } else {
        // Register miss
        actions.registerMiss();
        actions.setFeedback("빗나감 | Miss");
        audio.playSFX("menu_navigate");

        // Add miss effect
        actions.addHitEffect({
          position: hitPosition,
          type: "miss",
          visible: true,
        });

        return false;
      }
    },
    [state.isTraining, player3DPosition, dummyPosition, actions, audio]
  );

  const handleStanceChange = useCallback(
    (stanceIndex: number) => {
      actions.setStanceIndex(stanceIndex);
      const stance = TRIGRAM_STANCES_ORDER[stanceIndex];
      if (stance) {
        playerAnimation.transitionTo("stance_change");
        onPlayerUpdate({ currentStance: stance });
        audio.playSFX("stance_change");
      }
    },
    [actions, onPlayerUpdate, audio, playerAnimation]
  );

  const handleAttack = useCallback(() => {
    if (state.isTraining) {
      // Calculate attack accuracy and store it
      const accuracy = calculateHitAccuracy(player3DPosition, dummyPosition);
      pendingAttackRef.current = {
        accuracy,
        vitalPoint: state.selectedVitalPoint ?? "generic",
      };
      // Trigger attack animation
      playerAnimation.transitionTo("attack");
    }
  }, [
    state.isTraining,
    state.selectedVitalPoint,
    player3DPosition,
    dummyPosition,
    playerAnimation,
  ]);

  return {
    handleStartTraining,
    handleStopTraining,
    handleDummyHit,
    handleDummyDefeated,
    handleStanceChange,
    handleAttack,
    pendingAttackRef,
  };
}

