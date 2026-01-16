/**
 * useTrainingActions Hook - Training Action Handlers
 *
 * Custom hook for managing training action handlers.
 * Mirrors useCombatActions pattern for consistency.
 *
 * @korean 훈련액션훅 - 훈련 액션 핸들러 관리
 */

import { useCallback, useRef } from "react";
import { getArchetypePhysicalAttributes } from "../../../../data/archetypePhysicalAttributes";
import { AnimationState, AnimationType } from "../../../../systems/animation";
import { physicalReachCalculator } from "../../../../systems/physics";
import { TRIGRAM_STANCES_ORDER } from "../../../../systems/trigram/types";
import { Position, TrigramStance } from "../../../../types/common";
import { METERS_TO_TRAINING_UNITS } from "../../../../types/physicsConstants";
import { calculateDistance3D } from "../../../../utils/math";
import { TrainingActions, TrainingScreenState } from "./useTrainingState";

export interface UseTrainingActionsConfig {
  readonly state: TrainingScreenState;
  readonly actions: TrainingActions;
  readonly playerPosition: Position;
  readonly player3DPosition: [number, number, number];
  readonly dummyPosition: [number, number, number];
  readonly playerArchetype: import("../../../../types/common").PlayerArchetype;
  readonly playerStance: TrigramStance;
  /** Ref to current selected technique's animation type for distance-based hit detection */
  readonly currentTechniqueAnimationTypeRef: React.MutableRefObject<AnimationType>;
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
    readonly transitionToStanceGuard: (stance: TrigramStance) => boolean;
    readonly currentState: string;
  };
  /** External ref to store pending attack data - shared with animation events */
  readonly pendingAttackRef: React.MutableRefObject<{
    accuracy: number;
    vitalPoint: string;
    animationType?: AnimationType;
    startTime?: number;
  } | null>;
}

export interface UseTrainingActionsReturn {
  readonly handleStartTraining: () => void;
  readonly handleStopTraining: () => void;
  readonly handleDummyHit: (vitalPointId: string) => boolean;
  readonly handleDummyDefeated: () => void;
  readonly handleStanceChange: (stanceIndex: number) => void;
  readonly handleAttack: () => void;
}

/**
 * Calculate hit accuracy based on distance and effective reach.
 * Uses PhysicalReachCalculator for animation-aware reach calculation.
 *
 * Distance logic matches CombatSystem: if out of reach, guaranteed miss (accuracy 0).
 * Training scene coordinates are in meters, using METERS_TO_TRAINING_UNITS = 1.0.
 *
 * @korean 거리 기반 명중률 계산 - 사정거리 밖이면 빗나감
 */
function calculateHitAccuracy(
  playerPos: [number, number, number],
  dummyPos: [number, number, number],
  archetype: import("../../../../types/common").PlayerArchetype,
  stance: TrigramStance,
  animationType?: AnimationType,
  animationTime?: number,
): number {
  // Calculate 3D distance between player and dummy (in training scene units = meters)
  const distance = calculateDistance3D(playerPos, dummyPos);

  // If animation info available, use physics-based reach calculation
  if (animationType !== undefined && animationTime !== undefined) {
    const physicalAttributes = getArchetypePhysicalAttributes(archetype);
    const reachResult = physicalReachCalculator.calculateReach(
      physicalAttributes,
      animationType,
      animationTime,
      stance,
    );

    const effectiveReachMeters = reachResult.effectiveReach;

    // Convert reach from meters to training scene units.
    // Training scenes are authored in real-world meters, so we intentionally
    // use a 1:1 conversion here (METERS_TO_TRAINING_UNITS = 1.0).
    // Combat AI uses METERS_TO_PIXELS_SCALE (100) for pixel coordinates.
    const reachInUnits = effectiveReachMeters * METERS_TO_TRAINING_UNITS;

    // STRICT DISTANCE CHECK (matches CombatSystem behavior):
    // Out of reach = guaranteed miss with accuracy 0
    if (distance > reachInUnits) {
      return 0;
    }

    // Within reach: accuracy based on how centered the hit is
    // Closer = higher accuracy (0.7 to 1.0 range)
    return Math.max(0.7, 1.0 - (distance / reachInUnits) * 0.3);
  }

  // Fallback: use default punch reach (0.7 meters) for legacy behavior
  const defaultReach = 0.7 * METERS_TO_TRAINING_UNITS;
  if (distance > defaultReach) {
    return 0; // Out of reach = miss
  }
  // Within default reach: linear accuracy based on distance
  return Math.max(0.5, 1.0 - (distance / defaultReach) * 0.5);
}

/**
 * useTrainingActions hook
 * Provides training action handlers with proper memoization
 */
export function useTrainingActions(
  config: UseTrainingActionsConfig,
): UseTrainingActionsReturn {
  const {
    state,
    actions,
    player3DPosition,
    dummyPosition,
    playerArchetype,
    playerStance,
    currentTechniqueAnimationTypeRef,
    audio,
    onPlayerUpdate,
    playerAnimation,
    pendingAttackRef,
  } = config;

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
      // Get animation context from pending attack if available
      const animationType = pendingAttackRef.current?.animationType;
      const startTime = pendingAttackRef.current?.startTime;
      const currentTime =
        startTime !== undefined
          ? Math.max(0, performance.now() / 1000 - startTime)
          : undefined;

      const accuracy = calculateHitAccuracy(
        player3DPosition,
        dummyPosition,
        playerArchetype,
        playerStance,
        animationType,
        currentTime,
      );

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

        // Register hit with state (only counts if training)
        if (state.isTraining) {
          actions.registerHit(points, damage, isPerfect);
        }

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
        // Register miss (only counts if training)
        if (state.isTraining) {
          actions.registerMiss();
        }
        actions.setFeedback("빗나감 | Miss - Out of reach!");
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
    [
      state.isTraining,
      player3DPosition,
      dummyPosition,
      playerArchetype,
      playerStance,
      actions,
      audio,
      pendingAttackRef,
    ],
  );

  const handleStanceChange = useCallback(
    (stanceIndex: number) => {
      actions.setStanceIndex(stanceIndex);
      const stance = TRIGRAM_STANCES_ORDER[stanceIndex];
      if (stance) {
        // Directly transition to stance guard animation (skips transitional animation)
        // 자세 가드 애니메이션으로 직접 전환 (전환 애니메이션 생략)
        playerAnimation.transitionToStanceGuard(stance);
        onPlayerUpdate({ currentStance: stance });
        audio.playSFX("stance_change");
      }
    },
    [actions, onPlayerUpdate, audio, playerAnimation],
  );

  const handleAttack = useCallback(() => {
    // Use the current technique's animation type for distance-based hit detection
    // This ensures kicks have longer reach than punches, elbows shorter, etc.
    // 현재 기술의 애니메이션 타입을 사용하여 거리 기반 명중 판정
    const animationType = currentTechniqueAnimationTypeRef.current;
    const startTime = performance.now() / 1000; // Current time in seconds

    const accuracy = calculateHitAccuracy(
      player3DPosition,
      dummyPosition,
      playerArchetype,
      playerStance,
      animationType,
      0, // At attack initiation, time is 0
    );

    pendingAttackRef.current = {
      accuracy,
      vitalPoint: state.selectedVitalPoint ?? "generic",
      animationType,
      startTime,
    };

    // Trigger attack animation - this will fire onFrame event at frame 6
    playerAnimation.transitionTo(AnimationState.ATTACK);

    // Play attack sound
    audio.playSFX("whoosh");
  }, [
    state.selectedVitalPoint,
    player3DPosition,
    dummyPosition,
    playerArchetype,
    playerStance,
    currentTechniqueAnimationTypeRef,
    playerAnimation,
    audio,
    pendingAttackRef,
  ]);

  return {
    handleStartTraining,
    handleStopTraining,
    handleDummyHit,
    handleDummyDefeated,
    handleStanceChange,
    handleAttack,
  };
}

export default useTrainingActions;
