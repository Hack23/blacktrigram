/**
 * useTrainingActions Hook - Training Action Handlers
 *
 * Custom hook for managing training action handlers.
 * Mirrors useCombatActions pattern for consistency.
 *
 * @korean 훈련액션훅 - 훈련 액션 핸들러 관리
 */

import { useCallback, useRef } from "react";
import {
  AudioBodyRegion,
  ImpactIntensity,
} from "../../../../audio/types";
import type { AttackIntensity } from "../../../screens/combat/hooks/useCombatAudio";
import { getArchetypePhysicalAttributes } from "../../../../data/archetypePhysicalAttributes";
import {
  AnimationState,
  AnimationType,
  getAnimationForTechnique,
} from "../../../../systems/animation";
import { physicalReachCalculator } from "../../../../systems/physics";
import { getTechniquesByStance } from "../../../../systems/trigram/techniques";
import { KoreanTechniquesSystem } from "../../../../systems/trigram/KoreanTechniques";
import { TRIGRAM_STANCES_ORDER } from "../../../../systems/trigram/types";
import type { KoreanTechnique } from "../../../../systems/vitalpoint/types";
import {
  CombatAttackType,
  DamageType,
  PlayerArchetype,
  Position,
  TrigramStance,
} from "../../../../types/common";
import {
  DEFAULT_BODY_RADIUS_METERS,
  METERS_TO_TRAINING_UNITS,
} from "../../../../types/physicsConstants";
import { calculateDistance3D } from "../../../../utils/math";
// Note: calculateBodyRadius is available for PvP combat where targets have archetypes
// import { calculateBodyRadius } from "../../../../utils/skeletonScaling";
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
    readonly playSFX: (sound: string, volume?: number) => Promise<void>;
  };
  /** Attack sound function from useCombatAudio for playing attack whoosh sounds */
  readonly playAttackSound?: (intensity: AttackIntensity) => Promise<void>;
  /** Bone impact audio function from useCombatAudio or similar hook */
  readonly playBoneImpactSound?: (options: {
    region?: AudioBodyRegion;
    intensity?: ImpactIntensity;
    damage?: number;
    remainingHealth?: number;
    vitalPoint?: boolean;
    hitPosition?: { x: number; y: number; z?: number };
  }) => Promise<void>;
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
  /** Currently selected technique ID (from technique bar) */
  readonly selectedTechniqueId?: string;
  /** Callback to set the visual attack animation */
  readonly setAttackAnimation?: (animationName: string | undefined) => void;
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
 * Get the best default technique for an archetype based on current stance.
 *
 * Each archetype has preferred combat styles:
 * - MUSA: Direct strikes, joint techniques (BLUNT/JOINT damage)
 * - AMSALJA: Nerve strikes, pressure points (NERVE/PRESSURE damage)
 * - HACKER: Precise calculated strikes (high accuracy)
 * - JEONGBO_YOWON: Psychological pressure, submissions (PRESSURE/JOINT)
 * - JOJIK_POKRYEOKBAE: High damage brutal strikes
 *
 * @korean 원형별 기본 기술 선택 - 8개 자세에 따른 최적 기술
 */
function getDefaultTechniqueForArchetype(
  archetype: PlayerArchetype,
  stance: TrigramStance,
): KoreanTechnique | undefined {
  const techniques = getTechniquesByStance(stance);
  if (techniques.length === 0) return undefined;

  // Score each technique based on archetype preference
  const scoredTechniques = techniques.map((tech) => {
    let score = 0;
    const damageType = tech.damageType;
    const attackType = tech.type;
    const isAdvanced =
      (tech.kiCost || 0) >= 10 || (tech.staminaCost || 0) >= 15;

    switch (archetype) {
      case PlayerArchetype.MUSA:
        // Musa prefers: strikes, blocks, counter-attacks (BLUNT/JOINT/CRUSHING)
        if (damageType === DamageType.JOINT) score += 30;
        if (damageType === DamageType.CRUSHING) score += 25;
        if (damageType === DamageType.BLUNT) score += 20;
        if (attackType === CombatAttackType.STRIKE) score += 15;
        if (attackType === CombatAttackType.PUNCH) score += 10;
        if (isAdvanced) score += 10;
        break;

      case PlayerArchetype.AMSALJA:
        // Amsalja prefers: nerve strikes, pressure points, thrusts
        if (damageType === DamageType.NERVE) score += 35;
        if (damageType === DamageType.PRESSURE) score += 30;
        if (attackType === CombatAttackType.NERVE_STRIKE) score += 25;
        if (attackType === CombatAttackType.PRESSURE_POINT) score += 25;
        if (attackType === CombatAttackType.THRUST) score += 15;
        if ((tech.accuracy || 0) >= 0.9) score += 10;
        break;

      case PlayerArchetype.HACKER:
        // Hacker prefers: high accuracy, calculated strikes
        if ((tech.accuracy || 0) >= 0.9) score += 30;
        if ((tech.accuracy || 0) >= 0.8) score += 15;
        if (damageType === DamageType.NERVE) score += 20;
        if (damageType === DamageType.INTERNAL) score += 20;
        if (attackType === CombatAttackType.PRESSURE_POINT) score += 15;
        break;

      case PlayerArchetype.JEONGBO_YOWON:
        // Jeongbo prefers: psychological pressure, submissions
        if (damageType === DamageType.PRESSURE) score += 30;
        if (damageType === DamageType.JOINT) score += 25;
        if (attackType === CombatAttackType.GRAPPLE) score += 20;
        if (attackType === CombatAttackType.PRESSURE_POINT) score += 15;
        break;

      case PlayerArchetype.JOJIK_POKRYEOKBAE:
        // Jojik prefers: high damage, brutal techniques
        if ((tech.damage || 0) >= 35) score += 35;
        if ((tech.damage || 0) >= 30) score += 20;
        if (damageType === DamageType.SLASHING) score += 20;
        if (damageType === DamageType.PIERCING) score += 15;
        if (damageType === DamageType.CRUSHING) score += 15;
        if (attackType === CombatAttackType.KICK) score += 10;
        break;
    }

    return { technique: tech, score };
  });

  // Sort by score descending, return highest scoring technique
  scoredTechniques.sort((a, b) => b.score - a.score);
  return scoredTechniques[0]?.technique;
}

/**
 * Calculate hit accuracy based on distance and effective reach.
 * Uses PhysicalReachCalculator for animation-aware reach calculation.
 *
 * Distance logic matches CombatSystem: if out of reach, guaranteed miss (accuracy 0).
 * Training scene coordinates are in meters, using METERS_TO_TRAINING_UNITS = 1.0.
 *
 * **IMPORTANT**: Distance calculation accounts for body radius.
 * Center-to-center distance is adjusted by subtracting target body radius
 * because attacks hit the body surface, not the center point.
 * The target body radius is calculated from physical attributes for archetypes,
 * or uses DEFAULT_BODY_RADIUS_METERS for training dummies.
 *
 * Example: If player center is 1.5m from dummy center, but dummy body
 * extends 0.23m from center, the effective distance to hit is 1.27m.
 *
 * @korean 거리 기반 명중률 계산 - 사정거리 밖이면 빗나감
 */
function calculateHitAccuracy(
  playerPos: [number, number, number],
  dummyPos: [number, number, number],
  archetype: import("../../../../types/common").PlayerArchetype,
  stance: TrigramStance,
  animationType?: AnimationType,
): number {
  // Calculate 3D distance between player and dummy centers (in meters)
  const centerToCenterDistance = calculateDistance3D(playerPos, dummyPos);

  // Training dummy uses default body radius since it has no archetype
  // For combat between players, we would use calculateBodyRadius(targetPhysicalAttributes)
  // 훈련 더미는 원형이 없으므로 기본 몸체 반경 사용
  const targetBodyRadius = DEFAULT_BODY_RADIUS_METERS;

  // Adjust distance to account for target body radius
  // Attacks hit the body surface, not the center point
  // 타격은 중심점이 아닌 몸체 표면에 적중
  const effectiveDistance = Math.max(
    0,
    centerToCenterDistance - targetBodyRadius,
  );

  // If animation type is available, use physics-based reach calculation
  // We use calculateMaxReach (peak time reach) because:
  // 1. Training hit detection happens at animation frame 6 (~100ms)
  // 2. But technique hit timings expect longer animations (e.g., roundhouse 200-480ms)
  // 3. Using max reach ensures the technique can hit if within peak reach range
  // 4. This matches intuitive behavior - if you're close enough to be hit by the kick, it hits
  // 훈련 타격 감지는 최대 도달 거리 사용 (애니메이션 타이밍과 기술 타이밍 불일치 보정)
  if (animationType !== undefined) {
    const physicalAttributes = getArchetypePhysicalAttributes(archetype);
    const maxReachMeters = physicalReachCalculator.calculateMaxReach(
      physicalAttributes,
      animationType,
      stance,
    );

    // Convert reach from meters to training scene units.
    // Training scenes are authored in real-world meters, so we intentionally
    // use a 1:1 conversion here (METERS_TO_TRAINING_UNITS = 1.0).
    // Combat AI uses METERS_TO_PIXELS_SCALE (100) for pixel coordinates.
    const reachInUnits = maxReachMeters * METERS_TO_TRAINING_UNITS;

    // STRICT DISTANCE CHECK (matches CombatSystem behavior):
    // Out of reach = guaranteed miss with accuracy 0
    if (effectiveDistance > reachInUnits) {
      return 0;
    }

    // Within reach: accuracy based on how centered the hit is
    // Closer = higher accuracy (0.7 to 1.0 range)
    return Math.max(0.7, 1.0 - (effectiveDistance / reachInUnits) * 0.3);
  }

  // Fallback: use default punch reach (0.7 meters) for legacy behavior
  const defaultReach = 0.7 * METERS_TO_TRAINING_UNITS;
  if (effectiveDistance > defaultReach) {
    return 0; // Out of reach = miss
  }
  // Within default reach: linear accuracy based on distance
  return Math.max(0.5, 1.0 - (effectiveDistance / defaultReach) * 0.5);
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
    playBoneImpactSound,
    playAttackSound,
    onPlayerUpdate,
    playerAnimation,
    pendingAttackRef,
    selectedTechniqueId,
    setAttackAnimation,
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

      const accuracy = calculateHitAccuracy(
        player3DPosition,
        dummyPosition,
        playerArchetype,
        playerStance,
        animationType,
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

        // Play bone impact audio with anatomical feedback using proper audio system
        if (playBoneImpactSound) {
          void playBoneImpactSound({
            damage,
            remainingHealth: 100, // Dummy has 100 health
            vitalPoint: false,
            hitPosition: { x: hitPosition[0], y: hitPosition[1], z: hitPosition[2] },
          });
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
      playBoneImpactSound,
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
    // Determine which technique to use:
    // 1. If a technique is explicitly selected from the TechniqueBar, use that
    // 2. Otherwise, use the best default technique for the archetype + stance
    // 사용할 기술 결정: 명시적 선택 또는 원형+자세 기반 기본 기술
    let techniqueToUse: KoreanTechnique | undefined;
    let techniqueId = selectedTechniqueId;

    if (!techniqueId) {
      // No technique explicitly selected - get default for archetype + stance
      // 명시적 선택 없음 - 원형과 자세에 맞는 기본 기술 사용
      const defaultTechnique = getDefaultTechniqueForArchetype(
        playerArchetype,
        playerStance,
      );
      if (defaultTechnique) {
        techniqueToUse = defaultTechnique;
        techniqueId = defaultTechnique.id;
      }
    }

    // Get the animation type from the technique
    // 기술에서 애니메이션 타입 가져오기
    let animationType = currentTechniqueAnimationTypeRef.current;
    if (techniqueToUse?.animationType) {
      animationType = techniqueToUse.animationType;
      currentTechniqueAnimationTypeRef.current = animationType;
    }

    const startTime = performance.now() / 1000; // Current time in seconds

    const accuracy = calculateHitAccuracy(
      player3DPosition,
      dummyPosition,
      playerArchetype,
      playerStance,
      animationType,
    );

    pendingAttackRef.current = {
      accuracy,
      vitalPoint: state.selectedVitalPoint ?? "generic",
      animationType,
      startTime,
    };

    // Set visual attack animation based on technique (AnimationRegistry lookup)
    // This ensures the 3D model plays the correct technique animation (kick vs punch vs elbow)
    // 기술에 따른 시각적 공격 애니메이션 설정 (발차기 vs 주먹 vs 팔꿈치)
    if (setAttackAnimation && techniqueId) {
      const animationName = getAnimationForTechnique(techniqueId);
      setAttackAnimation(animationName);
    }

    // Trigger attack animation - this will fire onFrame event at frame 6
    playerAnimation.transitionTo(AnimationState.ATTACK);

    // Play attack sound based on technique damage/intensity
    // Resolve technique data if we only have an ID (from TechniqueBar selection)
    if (!techniqueToUse && selectedTechniqueId) {
      // Technique selected from TechniqueBar but not yet resolved
      techniqueToUse = KoreanTechniquesSystem.getTechniqueById(selectedTechniqueId);
    }

    if (playAttackSound) {
      // Prefer explicit technique damage when available
      const damage = techniqueToUse?.damage ?? 10;
      const intensity: AttackIntensity =
        damage >= 40
          ? "critical"
          : damage >= 25
            ? "heavy"
            : damage >= 10
              ? "medium"
              : "light";
      void playAttackSound(intensity);
    } else {
      // Fallback to generic whoosh if playAttackSound not available
      audio.playSFX("whoosh");
    }
  }, [
    state.selectedVitalPoint,
    player3DPosition,
    dummyPosition,
    playerArchetype,
    playerStance,
    currentTechniqueAnimationTypeRef,
    playerAnimation,
    audio,
    playAttackSound,
    pendingAttackRef,
    selectedTechniqueId,
    setAttackAnimation,
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
