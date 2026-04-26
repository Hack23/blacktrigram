/**
 * useCombatActions Hook - Combat Action Handlers
 *
 * Custom hook for managing combat action handlers.
 * Consolidates player attack, defend, technique, and AI action logic.
 *
 * Performance:
 * - Memoized callbacks to prevent recreation
 * - Centralized action logic for better maintainability
 * - Reduces main component complexity
 *
 * @param config Combat action configuration
 * @returns Combat action handlers
 *
 * @example
 * ```typescript
 * const {
 *   handleAttack,
 *   handleDefend,
 *   handleTechniqueExecute,
 *   handleStanceSwitch,
 *   handleAIAttack,
 *   handleAIDefend,
 *   handleAITechnique,
 *   moveAIPlayer
 * } = useCombatActions({
 *   validPlayers,
 *   playerPositions,
 *   combatState,
 *   combatActions,
 *   combatSystem,
 *   onPlayerUpdate,
 *   addCombatMessage,
 *   addHitEffect,
 *   arenaBounds
 * });
 * ```
 */

import { PlayerState } from "@/systems";
import {
  AnimationType,
  getAnimationHitTiming,
  type AnimationState,
} from "@/systems/animation";
import { movementPenaltySystem } from "@/systems/bodypart";
import { clampToArenaBounds, type PhysicsArenaBounds } from "@/types/PhysicsTypes";
import {
  checkForFall,
  getFallTypeName,
} from "@/systems/combat/FallIntegration";
import type { CombatResult } from "@/systems/combat/types";
import { CombatSystem } from "@/systems/CombatSystem";
import { HitEffectType } from "@/systems/effects";
import { KnockbackPhysics } from "@/systems/physics";
import { StanceManager } from "@/systems/trigram";
import { KoreanTechniquesSystem } from "@/systems/trigram/KoreanTechniques";
import { getVitalPointById } from "@/systems/vitalpoint/KoreanVitalPoints";
import { KoreanTechnique } from "@/systems/vitalpoint/types";
import { Position, Technique, TrigramStance, BodyRegion } from "@/types";
import { Injury, InjuryType } from "@/types/injury";
import { useCallback, useEffect, useRef } from "react";
import { AttackIntensity } from "./useCombatAudio";
import { CombatActions, CombatScreenState } from "./useCombatState";

/**
 * Hit position variation range for randomizing strike heights
 * Produces ±0.2 absolute units (±10% of 2.0 character height)
 */
const HIT_Y_VARIATION_RANGE = 0.4;

export const SCREEN_SHAKE_FRAME_INTERVAL_MS = 50;
export const SCREEN_SHAKE_FRAME_COUNT = 5;

/**
 * Clears every timeout in a tracked set and empties the set afterwards.
 *
 * @param timeoutIds Timeout identifiers to clear and remove
 */
function clearTimeoutSet(timeoutIds: Set<ReturnType<typeof setTimeout>>): void {
  timeoutIds.forEach((timeoutId) => {
    clearTimeout(timeoutId);
  });
  timeoutIds.clear();
}

/**
 * Calculate randomized hit position based on defender position
 * Adds vertical variation to simulate different strike heights
 *
 * @param defenderPos - Position of the defender being struck
 * @returns Hit position with randomized Y coordinate
 */
function calculateHitPosition(defenderPos: Position): { x: number; y: number } {
  const hitYVariation = (Math.random() - 0.5) * HIT_Y_VARIATION_RANGE; // ±0.2 units
  return {
    x: defenderPos.x,
    y: Math.max(0.3, Math.min(1.8, defenderPos.y + hitYVariation)),
  };
}

/**
 * Determine injury type from combat result and technique damage type
 * 전투 결과와 기술 피해 유형으로 부상 유형 결정
 *
 * @param result - Combat result with damage information
 * @param technique - Technique that was executed
 * @returns InjuryType to create
 */
function determineInjuryType(
  result: CombatResult,
  technique: KoreanTechnique,
): InjuryType {
  // Slashing damage creates cuts (damageType is a string, not enum)
  if (technique.damageType === "slashing") {
    return result.damage > 20 ? InjuryType.LACERATION : InjuryType.CUT;
  }

  // Heavy damage creates severe bruising
  if (result.damage > 25) {
    return InjuryType.BRUISE;
  }

  // Medium damage creates moderate bruising
  if (result.damage > 15) {
    return InjuryType.BRUISE;
  }

  // Light damage creates light bruising
  return InjuryType.BRUISE;
}

/**
 * Map body region to 3D position offset on character model
 * 신체 부위를 캐릭터 모델의 3D 위치 오프셋으로 매핑
 *
 * @param region - Body region that was hit
 * @returns Position offset [x, y, z] relative to character center
 */
function getBodyRegionPosition(region: BodyRegion): [number, number, number] {
  // Map body regions to approximate positions on character model
  // Character is ~2 units tall, centered at [0, 0, 0]
  switch (region) {
    case BodyRegion.HEAD:
      return [0, 1.6, 0];
    case BodyRegion.NECK:
      return [0, 1.3, 0];
    case BodyRegion.TORSO:
    case BodyRegion.CORE:
      return [0, 0.8, 0];
    case BodyRegion.LEFT_ARM:
      return [-0.4, 1.0, 0];
    case BodyRegion.RIGHT_ARM:
      return [0.4, 1.0, 0];
    case BodyRegion.LEFT_LEG:
      return [-0.2, 0.2, 0];
    case BodyRegion.RIGHT_LEG:
      return [0.2, 0.2, 0];
    default:
      return [0, 0.8, 0]; // Default to torso
  }
}

/**
 * Create injury from combat damage result
 * 전투 피해 결과로부터 부상 생성
 *
 * @param result - Combat result with damage details
 * @param technique - Technique that caused the damage
 * @param defenderHealth - Current defender health after damage (0-100 scale)
 * @param targetPlayerIndex - Index of the player who was hit (0 or 1)
 * @returns Injury object for visualization
 */
function createInjuryFromDamage(
  result: CombatResult,
  technique: KoreanTechnique,
  defenderHealth: number,
  targetPlayerIndex: number,
): Injury {
  // Determine body region - use torso as default if not specified
  const bodyRegion = BodyRegion.TORSO; // TODO: Extract from result when available

  // Determine injury type based on damage and technique
  let injuryType = determineInjuryType(result, technique);

  // Promote to fracture when health is critically low and damage is severe
  // to align with TraumaOverlay3D fracture behavior
  const isLowHealth = defenderHealth <= 30; // 30% health threshold
  const isSevereDamage = result.damage >= 25; // Severe damage threshold
  if (isLowHealth && isSevereDamage && injuryType !== InjuryType.FRACTURE) {
    injuryType = InjuryType.FRACTURE;
  }

  // Calculate severity (0.0 to 1.0) based on damage
  // Normalized so that a ~30-damage hit is treated as near-max severity
  const severity = Math.min(1.0, result.damage / 30);

  // Get position on character model for this body region
  const basePosition = getBodyRegionPosition(bodyRegion);

  // Add small random offset for variety
  const randomOffset: [number, number, number] = [
    (Math.random() - 0.5) * 0.1,
    (Math.random() - 0.5) * 0.1,
    (Math.random() - 0.5) * 0.1,
  ];

  const position: [number, number, number] = [
    basePosition[0] + randomOffset[0],
    basePosition[1] + randomOffset[1],
    basePosition[2] + randomOffset[2],
  ];

  return {
    id: `injury_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
    region: bodyRegion,
    type: injuryType,
    position,
    severity,
    hitCount: 1,
    timestamp: Date.now(),
    playerId: targetPlayerIndex === 0 ? "player" : "enemy",
  };
}

/**
 * Apply knockback displacement to defender position
 *
 * **Korean**: 밀침 적용 (Apply Knockback)
 *
 * Updates the defender's position based on knockback physics calculation.
 * The knockback displacement is applied in the direction of the attack vector
 * (attacker → defender), respecting arena boundaries.
 *
 * **Physics-First Architecture**: Both positions and knockback displacement
 * are in meters. Arena bounds are centered at origin (0, 0) with extent
 * ±worldWidthMeters/2 in X and ±worldDepthMeters/2 in Z.
 *
 * @param result - Combat result containing knockback data (in meters)
 * @param defenderPos - Current defender position (in meters)
 * @param arenaBounds - Arena boundary limits with meter dimensions
 * @returns Updated defender position after knockback (in meters)
 *
 * @example
 * ```typescript
 * // 10m × 7.5m arena, player at x=2m knocked back 2.5m to right
 * const newPosition = applyKnockbackDisplacement(
 *   result, // knockback.displacement.x = 2.5m
 *   { x: 2, y: 0 }, // Current position: 2m from center
 *   { worldWidthMeters: 10, worldDepthMeters: 7.5, ... }
 * );
 * // Returns: { x: 4.5, y: 0 } (2m + 2.5m = 4.5m, within ±5m boundary)
 *
 * // Same knockback but would exceed boundary
 * const clampedPosition = applyKnockbackDisplacement(
 *   result, // knockback.displacement.x = 2.5m
 *   { x: 4, y: 0 }, // Current position: 4m from center
 *   { worldWidthMeters: 10, worldDepthMeters: 7.5, ... }
 * );
 * // Returns: { x: 5, y: 0 } (4m + 2.5m = 6.5m, clamped to +5m boundary)
 * ```
 */
function applyKnockbackDisplacement(
  result: CombatResult,
  defenderPos: Position,
  arenaBounds: PhysicsArenaBounds,
): Position {
  if (!result.knockback) {
    return defenderPos;
  }

  // Apply knockback displacement (both in meters)
  // Note: knockback.displacement.z maps to position.y in 2D arena
  const newPos = {
    x: defenderPos.x + result.knockback.displacement.x,
    y: defenderPos.y + result.knockback.displacement.z,
  };

  // Clamp to arena boundaries using shared physics helper
  return clampToArenaBounds(newPos, arenaBounds);
}

export interface UseCombatActionsConfig {
  readonly validPlayers: readonly [PlayerState, PlayerState];
  readonly playerPositions: readonly [Position, Position];
  readonly combatState: CombatScreenState;
  readonly combatActions: CombatActions;
  readonly combatSystem: CombatSystem;
  readonly onPlayerUpdate: (
    playerIndex: number,
    updates: Partial<PlayerState>,
  ) => void;
  readonly onPlayerPositionUpdate?: (
    playerIndex: number,
    position: Position,
  ) => void;
  readonly onLateralityUpdate?: (
    playerIndex: number,
    laterality: "left" | "right",
  ) => void;
  readonly onInjuryCreated?: (
    injury: Injury,
    targetPlayerIndex: number,
  ) => void;
  readonly addCombatMessage: (korean: string, english: string) => void;
  readonly addHitEffect: (
    type: HitEffectType,
    position: Position,
    intensity?: number,
  ) => void;
  readonly arenaBounds: PhysicsArenaBounds;
  readonly combatAudio?: {
    readonly playAttackSound: (intensity?: AttackIntensity) => Promise<void>;
    readonly playHitSound: (damage: number) => Promise<void>;
    readonly playBoneImpactSound: (options: {
      region?: import("../../../../audio/types").AudioBodyRegion;
      intensity?: import("../../../../audio/types").ImpactIntensity;
      damage?: number;
      remainingHealth?: number;
      vitalPoint?: boolean;
      hitPosition?: { x: number; y: number; z?: number };
    }) => Promise<void>;
    readonly playBlockSound: (guardBroken?: boolean) => Promise<void>;
    readonly playDodgeSound: () => Promise<void>;
    readonly playStanceChangeSound: () => Promise<void>;
    readonly playSpecialTechniqueSound: () => Promise<void>;
  };
  readonly playerAnimations?: {
    readonly player1: {
      readonly transitionTo: (state: AnimationState) => boolean;
    };
    readonly player2: {
      readonly transitionTo: (state: AnimationState) => boolean;
    };
  };
}

export interface UseCombatActionsReturn {
  readonly handleAttack: (technique?: Technique) => void;
  readonly handleDefend: () => void;
  readonly handleTechniqueExecute: () => void;
  readonly handleStanceSwitch: (stance: TrigramStance) => void;
  readonly handleStanceSideSwitch: (playerIndex: 0 | 1) => void;
  readonly handleAIAttack: (
    technique?: KoreanTechnique,
    targetVitalPoint?: string,
  ) => void;
  readonly handleAIDefend: () => void;
  readonly handleAITechnique: (
    technique?: KoreanTechnique,
    targetVitalPoint?: string,
  ) => void;
  readonly moveAIPlayer: (targetPos: Position) => void;
}

/**
 * Helper function to convert Technique to KoreanTechnique format
 * @param technique - The technique to convert
 * @param stance - Current player stance
 * @returns KoreanTechnique compatible with CombatSystem
 */
function convertTechniqueToKorean(
  technique: Technique,
  stance: TrigramStance,
): KoreanTechnique {
  return {
    id: technique.id,
    name: {
      korean: technique.name.korean,
      english: technique.name.english,
      romanized: technique.name.romanized ?? "",
    },
    koreanName: technique.name.korean,
    englishName: technique.name.english,
    romanized: technique.name.romanized ?? "",
    description: {
      korean: technique.description.korean,
      english: technique.description.english,
    },
    stance: technique.requiredStance ?? stance,
    type: "attack",
    damageType: technique.damageType,
    damage: (technique.damage.min + technique.damage.max) / 2, // Use average damage
    kiCost: technique.kiCost,
    staminaCost: technique.staminaCost,
    accuracy: 0.85, // Default accuracy
    reachConfig: {
      bodyPart: "arm" as const,
      techniqueType: "punch" as const,
      baseExtension: 0.9,
    },
    executionTime: technique.animationDuration ?? 400,
    recoveryTime: 300,
    critChance: technique.criticalChance ?? 0.1,
    critMultiplier: 1.5,
    effects: [],
  };
}

/**
 * Custom hook for combat action handlers
 */
export function useCombatActions(
  config: UseCombatActionsConfig,
): UseCombatActionsReturn {
  const {
    validPlayers,
    playerPositions,
    combatState,
    combatActions,
    combatSystem,
    onPlayerUpdate,
    onLateralityUpdate,
    onInjuryCreated,
    addCombatMessage,
    addHitEffect,
    arenaBounds,
    combatAudio,
  } = config;

  // Refs to track knockback recovery timeouts for cleanup
  const player1KnockbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const player2KnockbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const screenShakeTimeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(
    new Set(),
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    const screenShakeTimeouts = screenShakeTimeoutsRef.current;
    return () => {
      clearTimeoutSet(screenShakeTimeouts);
      if (player1KnockbackTimeoutRef.current) {
        clearTimeout(player1KnockbackTimeoutRef.current);
      }
      if (player2KnockbackTimeoutRef.current) {
        clearTimeout(player2KnockbackTimeoutRef.current);
      }
    };
  }, []);

  // Player attack handler
  const handleAttack = useCallback(
    (technique?: Technique) => {
      if (
        combatState.isExecutingTechnique ||
        !combatState.roundStarted ||
        combatState.roundEnded
      )
        return;

      const player = validPlayers[0];
      const currentStance = player.currentStance;
      const archetype = player.archetype;

      // Use provided technique or select from stance techniques
      let attackTechnique: KoreanTechnique;

      if (technique) {
        // Convert selected technique to KoreanTechnique format
        attackTechnique = convertTechniqueToKorean(technique, currentStance);
      } else {
        // Get techniques for current stance and archetype
        const availableTechniques =
          KoreanTechniquesSystem.getAllAvailableTechniques(
            currentStance,
            archetype,
          );

        if (availableTechniques.length === 0) {
          console.warn(
            `No techniques found for stance: ${currentStance}, archetype: ${archetype}`,
          );
          addCombatMessage("기술 없음", "No techniques available");
          return;
        }

        // Select primary technique (first in list)
        const selectedTechnique = availableTechniques[0];

        // Check if player has sufficient resources
        if (
          !KoreanTechniquesSystem.canExecuteTechnique(player, selectedTechnique)
        ) {
          addCombatMessage("기력/체력 부족", "Insufficient Ki/Stamina");
          return;
        }

        attackTechnique = selectedTechnique;
      }

      combatActions.setExecutingTechnique(true);

      // Play attack sound based on technique damage/intensity
      const damage = attackTechnique.damage ?? 10;
      const intensity: AttackIntensity =
        damage >= 40
          ? "critical"
          : damage >= 25
            ? "heavy"
            : damage >= 10
              ? "medium"
              : "light";
      combatAudio?.playAttackSound(intensity);

      // Calculate animation timing context for hit detection.
      // For synchronous hit detection, we use the animation's peak time (when limb
      // is fully extended) rather than t=0 (attack start). This ensures the hit
      // window check passes when the attack would visually connect.
      // 동기식 타격 판정: 애니메이션 피크 타임 사용 (팔/다리 완전 신전 시점)
      const animationType = attackTechnique.animationType ?? AnimationType.JAB;
      const hitTiming = getAnimationHitTiming(animationType);
      const peakTime = hitTiming?.hitWindow.peakTime ?? 0.15; // Default to typical punch peak
      const animationContext = {
        animationType,
        currentTime: peakTime, // Use peak time for synchronous hit detection
      };

      // Use combat system for proper calculation with animation context
      const result = combatSystem.resolveAttack(
        validPlayers[0],
        validPlayers[1],
        attackTechnique,
        undefined,
        animationContext,
      );

      const effectType = result.hit
        ? result.isCritical
          ? HitEffectType.CRITICAL_HIT
          : HitEffectType.HIT
        : HitEffectType.MISS;

      addHitEffect(effectType, playerPositions[0], result.hit ? 1 : 0.5);

      if (result.hit) {
        // Play bone impact sound with body region and damage context
        const hitPosition = calculateHitPosition(playerPositions[1]);

        // Use bone impact audio instead of generic hit sound
        combatAudio?.playBoneImpactSound({
          damage: result.damage,
          remainingHealth: validPlayers[1].health - result.damage,
          vitalPoint: result.isCritical, // Critical hits are often vital points
          hitPosition,
        });

        // Combo tracking: reset combo if too much time passed
        const now = Date.now();
        const timeSinceLastHit = now - combatState.lastHitTime;
        const newCombo =
          timeSinceLastHit < 2000 ? combatState.comboCount + 1 : 1;
        combatActions.setComboCount(newCombo);
        combatActions.setLastHitTime(now);

        // Apply damage through combat system
        const { updatedAttacker, updatedDefender } =
          combatSystem.applyCombatResult(
            result,
            validPlayers[0],
            validPlayers[1],
          );

        onPlayerUpdate(0, updatedAttacker);
        onPlayerUpdate(1, updatedDefender);

        // Create injury for trauma visualization
        if (onInjuryCreated) {
          const injury = createInjuryFromDamage(
            result,
            attackTechnique,
            updatedDefender.health,
            1, // Player 2 (enemy) was hit
          );
          onInjuryCreated(injury, 1);
        }

        // Apply knockback displacement (밀침 적용)
        if (result.knockback && config.onPlayerPositionUpdate) {
          const newDefenderPosition = applyKnockbackDisplacement(
            result,
            playerPositions[1],
            config.arenaBounds,
          );
          config.onPlayerPositionUpdate(1, newDefenderPosition);

          // Add combat message for significant knockback
          const knockbackDistance = Math.sqrt(
            result.knockback.displacement.x ** 2 +
              result.knockback.displacement.z ** 2,
          );
          if (knockbackDistance > 1.5) {
            const knockbackName = KnockbackPhysics.getKnockbackStateName(
              result.knockback.shouldFall,
            );
            addCombatMessage(knockbackName.korean, knockbackName.english);
          }

          // Set stunned state for knockback duration (non-interruptible)
          if (result.knockback.duration > 0) {
            // Clear any existing timeout for player 2
            if (player2KnockbackTimeoutRef.current) {
              clearTimeout(player2KnockbackTimeoutRef.current);
            }

            onPlayerUpdate(1, { isStunned: true });

            // Schedule recovery after knockback duration + recovery window
            player2KnockbackTimeoutRef.current = setTimeout(
              () => {
                onPlayerUpdate(1, { isStunned: false });
                player2KnockbackTimeoutRef.current = null;
              },
              (result.knockback.duration + result.knockback.recoveryWindow) *
                1000,
            );
          }
        }

        // Check if defender should fall after taking damage
        if (config.playerAnimations?.player2) {
          const fallCheck = checkForFall(
            updatedDefender,
            combatSystem,
            undefined, // lastImpactAngle not tracked yet
            undefined, // attackAngle not tracked yet
          );

          if (
            fallCheck.shouldFall &&
            fallCheck.animationState &&
            fallCheck.fallType
          ) {
            config.playerAnimations.player2.transitionTo(
              fallCheck.animationState,
            );
            const fallName = getFallTypeName(fallCheck.fallType);
            addCombatMessage(`${fallName.korean}!`, `${fallName.english}!`);
          }
        }

        // Display technique name in combat log
        const techniqueNameKorean =
          attackTechnique.koreanName ?? attackTechnique.name.korean;
        const techniqueNameEnglish =
          attackTechnique.englishName ?? attackTechnique.name.english;

        if (result.isCritical) {
          addCombatMessage(
            `치명타! ${techniqueNameKorean}`,
            `Critical Hit! ${techniqueNameEnglish}`,
          );
        } else if (newCombo > 2) {
          addCombatMessage(
            `${newCombo} 연속! ${techniqueNameKorean}`,
            `${newCombo} Combo! ${techniqueNameEnglish}`,
          );
        } else {
          addCombatMessage(
            `${techniqueNameKorean} 성공!`,
            `${techniqueNameEnglish} Hit!`,
          );
        }
      } else {
        combatActions.resetCombo();
        const techniqueNameKorean =
          attackTechnique.koreanName ?? attackTechnique.name.korean;
        const techniqueNameEnglish =
          attackTechnique.englishName ?? attackTechnique.name.english;
        addCombatMessage(
          `${techniqueNameKorean} 빗나감`,
          `${techniqueNameEnglish} Missed`,
        );
      }

      setTimeout(() => combatActions.setExecutingTechnique(false), 500);
    },
    [
      validPlayers,
      playerPositions,
      combatState.isExecutingTechnique,
      combatState.roundStarted,
      combatState.roundEnded,
      combatState.comboCount,
      combatState.lastHitTime,
      combatActions,
      combatSystem,
      onPlayerUpdate,
      onInjuryCreated,
      addCombatMessage,
      addHitEffect,
      combatAudio,
      config,
    ],
  );

  // Player defend handler
  const handleDefend = useCallback(() => {
    if (!combatState.roundStarted || combatState.roundEnded) return;

    // Play block sound
    combatAudio?.playBlockSound(false);

    onPlayerUpdate(0, { isBlocking: true });
    addCombatMessage("방어 자세", "Defensive Stance");
    addHitEffect(HitEffectType.BLOCK, playerPositions[0], 0.8);

    setTimeout(() => {
      onPlayerUpdate(0, { isBlocking: false });
    }, 1000);
  }, [
    combatState.roundStarted,
    combatState.roundEnded,
    onPlayerUpdate,
    addCombatMessage,
    addHitEffect,
    playerPositions,
    combatAudio,
  ]);

  // Player technique handler
  const handleTechniqueExecute = useCallback(() => {
    if (
      combatState.isExecutingTechnique ||
      !combatState.roundStarted ||
      combatState.roundEnded
    )
      return;
    if (validPlayers[0].ki < 10 || validPlayers[0].stamina < 15) {
      addCombatMessage("기력/체력 부족", "Insufficient Ki/Stamina");
      return;
    }

    combatActions.setExecutingTechnique(true);

    // Play special technique sound
    combatAudio?.playSpecialTechniqueSound();

    addHitEffect(HitEffectType.CRITICAL_HIT, playerPositions[0], 1.5);

    // Screen shake effect for impact
    clearTimeoutSet(screenShakeTimeoutsRef.current);
    const shakeIntensity = 8;
    const shakeFrames = [
      { x: shakeIntensity, y: -shakeIntensity * 0.5 },
      { x: -shakeIntensity * 0.7, y: shakeIntensity * 0.8 },
      { x: shakeIntensity * 0.5, y: shakeIntensity * 0.3 },
      { x: -shakeIntensity * 0.3, y: -shakeIntensity * 0.6 },
      { x: 0, y: 0 },
    ].slice(0, SCREEN_SHAKE_FRAME_COUNT);

    shakeFrames.forEach((shake, index) => {
      const timeoutId = setTimeout(
        () => {
          // Completed timers are removed so cleanup only tracks pending callbacks.
          screenShakeTimeoutsRef.current.delete(timeoutId);
          combatActions.setScreenShake(shake);
        },
        index * SCREEN_SHAKE_FRAME_INTERVAL_MS,
      );
      screenShakeTimeoutsRef.current.add(timeoutId);
    });

    const distance = Math.sqrt(
      Math.pow(playerPositions[0].x - playerPositions[1].x, 2) +
        Math.pow(playerPositions[0].y - playerPositions[1].y, 2),
    );

    if (distance < 150) {
      // Play bone impact sound for special technique hit
      const hitPosition = calculateHitPosition(playerPositions[1]);

      combatAudio?.playBoneImpactSound({
        damage: 25,
        remainingHealth: validPlayers[1].health - 25,
        vitalPoint: false,
        hitPosition,
      });

      onPlayerUpdate(1, {
        health: Math.max(0, validPlayers[1].health - 25),
        hitsTaken: validPlayers[1].hitsTaken + 1,
      });
      addCombatMessage("특수 기술 성공!", "Special Technique Hit!");
    } else {
      addCombatMessage("기술 실패", "Technique Failed");
    }

    // Consume resources
    onPlayerUpdate(0, {
      ki: Math.max(0, validPlayers[0].ki - 10),
      stamina: Math.max(0, validPlayers[0].stamina - 15),
    });

    setTimeout(() => combatActions.setExecutingTechnique(false), 800);
  }, [
    validPlayers,
    playerPositions,
    combatState.isExecutingTechnique,
    combatState.roundStarted,
    combatState.roundEnded,
    combatActions,
    onPlayerUpdate,
    addCombatMessage,
    addHitEffect,
    combatAudio,
  ]);

  // Player stance switch handler
  const handleStanceSwitch = useCallback(
    (stance: TrigramStance) => {
      if (!combatState.roundStarted || combatState.roundEnded) return;

      // Play stance change sound
      combatAudio?.playStanceChangeSound();

      onPlayerUpdate(0, { currentStance: stance });
      addCombatMessage(`자세 변경: ${stance}`, `Stance Change: ${stance}`);
      addHitEffect(HitEffectType.STATUS_EFFECT, playerPositions[0], 0.6);
    },
    [
      combatState.roundStarted,
      combatState.roundEnded,
      onPlayerUpdate,
      addCombatMessage,
      addHitEffect,
      playerPositions,
      combatAudio,
    ],
  );

  /**
   * Handle stance side switch (left/right)
   * @korean 자세측면전환처리
   */
  // Reuse StanceManager instance for stance side switches
  const stanceManagerRef = useRef<StanceManager>(new StanceManager());

  const handleStanceSideSwitch = useCallback(
    (playerIndex: 0 | 1) => {
      if (!combatState.roundStarted || combatState.roundEnded) return;

      const player = validPlayers[playerIndex];
      // Get current laterality from combat state
      const currentLaterality = combatState.playerLaterality[playerIndex];

      const result = stanceManagerRef.current.switchStanceSide(
        player,
        currentLaterality,
      );

      if (result.success && result.laterality) {
        // Update player state with new stamina
        onPlayerUpdate(playerIndex, result.updatedPlayer);

        // Update laterality in combat state via callback
        onLateralityUpdate?.(playerIndex, result.laterality);

        // Audio feedback
        combatAudio?.playStanceChangeSound?.();

        // Visual feedback
        const koreanText =
          result.laterality === "left" ? "왼발서기" : "오른발서기";
        const englishText =
          result.laterality === "left" ? "Left Stance" : "Right Stance";
        addCombatMessage(koreanText, englishText);

        // Visual effect
        addHitEffect(
          HitEffectType.STATUS_EFFECT,
          playerPositions[playerIndex],
          0.5,
        );
      } else {
        // Feedback for failed switch
        if (result.message?.includes("stamina")) {
          addCombatMessage("체력 부족", "Insufficient Stamina");
        } else if (result.message?.includes("cooldown")) {
          addCombatMessage("대기 중", "On Cooldown");
        }
      }
    },
    [
      combatState.roundStarted,
      combatState.roundEnded,
      combatState.playerLaterality,
      validPlayers,
      onPlayerUpdate,
      onLateralityUpdate,
      combatAudio,
      addCombatMessage,
      addHitEffect,
      playerPositions,
    ],
  );

  /**
   * Helper function to create AI technique objects
   * Reduces code duplication between basic attacks and special techniques
   */
  const createAITechnique = useCallback(
    (type: "basic" | "special", aiPlayer: PlayerState) => {
      if (type === "basic") {
        return {
          id: "ai_basic_attack",
          name: {
            korean: "AI 기본공격",
            english: "AI Basic Attack",
            romanized: "ai_gibon_gonggyeok",
          },
          koreanName: "AI 기본공격",
          englishName: "AI Basic Attack",
          romanized: "ai_gibon_gonggyeok",
          description: { korean: "AI 기본 공격", english: "AI basic attack" },
          stance: aiPlayer.currentStance,
          type: "attack" as const,
          damageType: "physical" as const,
          damage: 15,
          kiCost: 5,
          staminaCost: 8,
          accuracy: 0.8,
          reachConfig: {
            bodyPart: "arm" as const,
            techniqueType: "punch" as const,
            baseExtension: 0.95,
          },
          executionTime: 400,
          recoveryTime: 300,
          critChance: 0.1,
          critMultiplier: 1.5,
          effects: [],
          animationType: AnimationType.JAB, // Default animation for basic attack
        };
      } else {
        return {
          id: "ai_special_technique",
          name: {
            korean: "AI 특수기술",
            english: "AI Special Technique",
            romanized: "ai_teuksu_gisul",
          },
          koreanName: "AI 특수기술",
          englishName: "AI Special Technique",
          romanized: "ai_teuksu_gisul",
          description: {
            korean: "AI 특수 기술",
            english: "AI special technique",
          },
          stance: aiPlayer.currentStance,
          type: "technique" as const,
          damageType: "physical" as const,
          damage: 25,
          kiCost: 10,
          staminaCost: 15,
          accuracy: 0.85,
          reachConfig: {
            bodyPart: "leg" as const,
            techniqueType: "kick" as const,
            baseExtension: 1.1,
          },
          executionTime: 600,
          recoveryTime: 800,
          critChance: 0.15,
          critMultiplier: 1.8,
          effects: [],
          animationType: AnimationType.SPINNING_HOOK, // Default animation for special technique
        };
      }
    },
    [],
  );

  /**
   * Helper function to determine hit effect type based on combat result
   * Reduces duplication between attack and technique handlers
   */
  const getHitEffectType = useCallback(
    (result: { hit: boolean; isCritical?: boolean }): HitEffectType => {
      if (!result.hit) return HitEffectType.MISS;
      return result.isCritical ? HitEffectType.CRITICAL_HIT : HitEffectType.HIT;
    },
    [],
  );

  /**
   * AI attack handler with technique and vital point targeting
   *
   * @param technique - Optional Korean martial arts technique to execute. If not provided, creates a basic attack.
   * @param targetVitalPoint - Optional vital point ID to target for increased damage effectiveness.
   */
  const handleAIAttack = useCallback(
    (technique?: KoreanTechnique, targetVitalPoint?: string) => {
      const aiPlayer = validPlayers[1];
      const targetPlayer = validPlayers[0];

      // Use provided technique or create basic attack technique
      const attackTechnique = technique ?? createAITechnique("basic", aiPlayer);

      // Play attack sound based on technique damage/intensity (consistent with player)
      const damage = attackTechnique.damage ?? 10;
      const intensity: AttackIntensity =
        damage >= 40
          ? "critical"
          : damage >= 25
            ? "heavy"
            : damage >= 10
              ? "medium"
              : "light";
      combatAudio?.playAttackSound(intensity);

      // Calculate animation timing context for AI hit detection (same as player)
      // 동기식 타격 판정: AI도 피크 타임 사용
      const animationType = attackTechnique.animationType ?? AnimationType.JAB;
      const hitTiming = getAnimationHitTiming(animationType);
      const peakTime = hitTiming?.hitWindow.peakTime ?? 0.15;
      const animationContext = {
        animationType,
        currentTime: peakTime,
      };

      // Use combat system for proper calculation with vital point targeting and animation context
      const result = combatSystem.resolveAttack(
        aiPlayer,
        targetPlayer,
        attackTechnique,
        targetVitalPoint, // Pass vital point ID for targeting
        animationContext, // Pass animation context for distance/reach check
      );

      const effectType = getHitEffectType(result);
      addHitEffect(effectType, playerPositions[1], result.hit ? 1 : 0.5);

      if (result.hit) {
        // Play bone impact sound for AI hits on player
        const hitPosition = calculateHitPosition(playerPositions[0]);

        combatAudio?.playBoneImpactSound({
          damage: result.damage,
          remainingHealth: validPlayers[0].health - result.damage,
          vitalPoint: result.isCritical,
          hitPosition,
        });

        // Apply damage through combat system (deducts resources)
        const { updatedAttacker, updatedDefender } =
          combatSystem.applyCombatResult(result, aiPlayer, targetPlayer);

        onPlayerUpdate(1, updatedAttacker);
        onPlayerUpdate(0, updatedDefender);

        // Create injury for trauma visualization (AI hit player)
        if (onInjuryCreated) {
          const injury = createInjuryFromDamage(
            result,
            attackTechnique,
            updatedDefender.health,
            0, // Player 1 (player) was hit by AI
          );
          onInjuryCreated(injury, 0);
        }

        // Apply knockback displacement for AI attacks (밀침 적용)
        if (result.knockback && config.onPlayerPositionUpdate) {
          const newDefenderPosition = applyKnockbackDisplacement(
            result,
            playerPositions[0],
            config.arenaBounds,
          );
          config.onPlayerPositionUpdate(0, newDefenderPosition);

          // Add combat message for significant knockback
          const knockbackDistance = Math.sqrt(
            result.knockback.displacement.x ** 2 +
              result.knockback.displacement.z ** 2,
          );
          if (knockbackDistance > 1.5) {
            const knockbackName = KnockbackPhysics.getKnockbackStateName(
              result.knockback.shouldFall,
            );
            addCombatMessage(
              `AI ${knockbackName.korean}`,
              `AI ${knockbackName.english}`,
            );
          }

          // Set stunned state for knockback duration (non-interruptible)
          if (result.knockback.duration > 0) {
            // Clear any existing timeout for player 1
            if (player1KnockbackTimeoutRef.current) {
              clearTimeout(player1KnockbackTimeoutRef.current);
            }

            onPlayerUpdate(0, { isStunned: true });

            // Schedule recovery after knockback duration + recovery window
            player1KnockbackTimeoutRef.current = setTimeout(
              () => {
                onPlayerUpdate(0, { isStunned: false });
                player1KnockbackTimeoutRef.current = null;
              },
              (result.knockback.duration + result.knockback.recoveryWindow) *
                1000,
            );
          }
        }

        // Check if player should fall after taking damage from AI
        if (config.playerAnimations?.player1) {
          const fallCheck = checkForFall(
            updatedDefender,
            combatSystem,
            undefined, // lastImpactAngle not tracked yet
            undefined, // attackAngle not tracked yet
          );

          if (
            fallCheck.shouldFall &&
            fallCheck.animationState &&
            fallCheck.fallType
          ) {
            config.playerAnimations.player1.transitionTo(
              fallCheck.animationState,
            );
            const fallName = getFallTypeName(fallCheck.fallType);
            addCombatMessage(`${fallName.korean}!`, `${fallName.english}!`);
          }
        }

        // Enhanced combat message with vital point info
        if (result.vitalPointHit && targetVitalPoint) {
          const vitalPoint = getVitalPointById(targetVitalPoint);
          const vpName = vitalPoint
            ? vitalPoint.names.korean
            : targetVitalPoint;
          addCombatMessage(
            `AI 급소 타격! ${vpName}`,
            `AI Vital Point Hit! ${
              vitalPoint?.names.english ?? targetVitalPoint
            }`,
          );
        } else if (result.isCritical) {
          addCombatMessage("AI 치명타!", "AI Critical Hit!");
        } else {
          addCombatMessage("AI 공격 성공!", "AI Attack Hit!");
        }
      } else {
        // Consume resources on miss for consistency with technique behavior
        onPlayerUpdate(1, {
          ki: Math.max(0, aiPlayer.ki - attackTechnique.kiCost),
          stamina: Math.max(0, aiPlayer.stamina - attackTechnique.staminaCost),
        });
        addCombatMessage("AI 공격 빗나감", "AI Attack Missed");
      }
    },
    [
      validPlayers,
      playerPositions,
      combatSystem,
      onPlayerUpdate,
      onInjuryCreated,
      addCombatMessage,
      addHitEffect,
      combatAudio,
      createAITechnique,
      getHitEffectType,
      config,
    ],
  );

  // AI defend handler
  const handleAIDefend = useCallback(() => {
    // Play block sound
    combatAudio?.playBlockSound(false);

    onPlayerUpdate(1, { isBlocking: true });
    addCombatMessage("AI 방어 자세", "AI Defensive Stance");
    addHitEffect(HitEffectType.BLOCK, playerPositions[1], 0.8);

    setTimeout(() => {
      onPlayerUpdate(1, { isBlocking: false });
    }, 1000);
  }, [
    onPlayerUpdate,
    addCombatMessage,
    addHitEffect,
    playerPositions,
    combatAudio,
  ]);

  /**
   * AI technique handler with technique and vital point targeting
   *
   * @param technique - Optional special Korean martial arts technique to execute. If not provided, creates a special technique.
   * @param targetVitalPoint - Optional vital point ID to target for increased damage effectiveness.
   */
  const handleAITechnique = useCallback(
    (technique?: KoreanTechnique, targetVitalPoint?: string) => {
      const aiPlayer = validPlayers[1];
      const targetPlayer = validPlayers[0];

      // Use provided technique or create special technique
      const specialTechnique =
        technique ?? createAITechnique("special", aiPlayer);

      // Check if AI has sufficient resources for the technique
      if (
        aiPlayer.ki < specialTechnique.kiCost ||
        aiPlayer.stamina < specialTechnique.staminaCost
      ) {
        handleAIAttack(undefined, targetVitalPoint); // Fallback to basic attack with same targeting
        return;
      }

      // Play special technique sound
      combatAudio?.playSpecialTechniqueSound();

      // Calculate animation timing context for AI technique hit detection
      // 동기식 타격 판정: AI 특수 기술도 피크 타임 사용
      const animationType =
        specialTechnique.animationType ?? AnimationType.SPINNING_HOOK;
      const hitTiming = getAnimationHitTiming(animationType);
      const peakTime = hitTiming?.hitWindow.peakTime ?? 0.25; // Special techniques often have longer peak times
      const animationContext = {
        animationType,
        currentTime: peakTime,
      };

      // Use combat system for proper calculation with vital point targeting and animation context
      const result = combatSystem.resolveAttack(
        aiPlayer,
        targetPlayer,
        specialTechnique,
        targetVitalPoint, // Pass vital point ID for targeting
        animationContext, // Pass animation context for distance/reach check
      );

      const effectType = result.hit
        ? HitEffectType.CRITICAL_HIT
        : HitEffectType.MISS;

      addHitEffect(effectType, playerPositions[1], result.hit ? 1.5 : 0.5);

      if (result.hit) {
        // Play bone impact sound for AI technique hits
        const hitPosition = calculateHitPosition(playerPositions[0]);

        combatAudio?.playBoneImpactSound({
          damage: result.damage,
          remainingHealth: validPlayers[0].health - result.damage,
          vitalPoint: result.isCritical === true || !!targetVitalPoint, // Special techniques often target vital points
          hitPosition,
        });

        // Apply damage through combat system (deducts resources)
        const { updatedAttacker, updatedDefender } =
          combatSystem.applyCombatResult(result, aiPlayer, targetPlayer);

        onPlayerUpdate(1, updatedAttacker);
        onPlayerUpdate(0, updatedDefender);

        // Create injury for trauma visualization (AI technique hit player)
        if (onInjuryCreated) {
          const injury = createInjuryFromDamage(
            result,
            specialTechnique,
            updatedDefender.health,
            0, // Player 1 (player) was hit by AI technique
          );
          onInjuryCreated(injury, 0);
        }

        // Apply knockback displacement for AI special techniques (밀침 적용)
        if (result.knockback && config.onPlayerPositionUpdate) {
          const newDefenderPosition = applyKnockbackDisplacement(
            result,
            playerPositions[0],
            config.arenaBounds,
          );
          config.onPlayerPositionUpdate(0, newDefenderPosition);

          // Add combat message for significant knockback
          const knockbackDistance = Math.sqrt(
            result.knockback.displacement.x ** 2 +
              result.knockback.displacement.z ** 2,
          );
          if (knockbackDistance > 1.5) {
            const knockbackName = KnockbackPhysics.getKnockbackStateName(
              result.knockback.shouldFall,
            );
            addCombatMessage(
              `AI 특수 ${knockbackName.korean}`,
              `AI Special ${knockbackName.english}`,
            );
          }

          // Set stunned state for knockback duration (non-interruptible)
          if (result.knockback.duration > 0) {
            // Clear any existing timeout for player 1
            if (player1KnockbackTimeoutRef.current) {
              clearTimeout(player1KnockbackTimeoutRef.current);
            }

            onPlayerUpdate(0, { isStunned: true });

            // Schedule recovery after knockback duration + recovery window
            player1KnockbackTimeoutRef.current = setTimeout(
              () => {
                onPlayerUpdate(0, { isStunned: false });
                player1KnockbackTimeoutRef.current = null;
              },
              (result.knockback.duration + result.knockback.recoveryWindow) *
                1000,
            );
          }
        }

        // Check if player should fall after taking damage from AI technique
        if (config.playerAnimations?.player1) {
          const fallCheck = checkForFall(
            updatedDefender,
            combatSystem,
            undefined, // lastImpactAngle not tracked yet
            undefined, // attackAngle not tracked yet
          );

          if (
            fallCheck.shouldFall &&
            fallCheck.animationState &&
            fallCheck.fallType
          ) {
            config.playerAnimations.player1.transitionTo(
              fallCheck.animationState,
            );
            const fallName = getFallTypeName(fallCheck.fallType);
            addCombatMessage(`${fallName.korean}!`, `${fallName.english}!`);
          }
        }

        // Enhanced combat message with vital point info
        if (result.vitalPointHit && targetVitalPoint) {
          const vitalPoint = getVitalPointById(targetVitalPoint);
          const vpName = vitalPoint
            ? vitalPoint.names.korean
            : targetVitalPoint;
          addCombatMessage(
            `AI 특수 급소 기술! ${vpName}`,
            `AI Special Vital Point Technique! ${
              vitalPoint?.names.english ?? targetVitalPoint
            }`,
          );
        } else {
          addCombatMessage("AI 특수 기술!", "AI Special Technique!");
        }
      } else {
        // Consume resources on miss (technique was attempted)
        onPlayerUpdate(1, {
          ki: Math.max(0, aiPlayer.ki - specialTechnique.kiCost),
          stamina: Math.max(0, aiPlayer.stamina - specialTechnique.staminaCost),
        });
        addCombatMessage("AI 기술 빗나감", "AI Technique Missed");
      }
    },
    [
      validPlayers,
      playerPositions,
      combatSystem,
      onPlayerUpdate,
      onInjuryCreated,
      addCombatMessage,
      addHitEffect,
      handleAIAttack,
      combatAudio,
      createAITechnique,
      config,
    ],
  );

  // AI movement handler with injury-based movement penalties
  // **UPDATED**: Now scale-aware for consistent movement and distance calculations
  // **FIX**: Positions are in METERS, not pixels - use meters-based speed
  const moveAIPlayer = useCallback(
    (targetPos: Position) => {
      const currentPos = playerPositions[1];
      const aiPlayer = validPlayers[1];

      // Movement speed calibrated for physics-first system (all in METERS)
      // Combat closing speed: ~2.5 m/s (fast tactical approach, not slow walking)
      // Real fights are over in 4-5 seconds - AI must close distance quickly
      // AI decision loop frequency (defined in useAICombat.ts)
      const AI_DECISION_FREQUENCY_HZ = 20; // 20 calls/second (50ms interval)
      // Calculation: 2.5 m/s / 20 calls/s = 0.125 meters per call
      const baseSpeed = 2.5 / AI_DECISION_FREQUENCY_HZ; // meters per call (0.125m per call)

      // Calculate movement direction vector (in meters)
      const dx = targetPos.x - currentPos.x;
      const dy = targetPos.y - currentPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Apply movement penalties from leg injuries if body part health exists
      let finalSpeed = baseSpeed;
      if (aiPlayer.bodyPartHealth && aiPlayer.bodyPartMaxHealth) {
        // Normalize movement direction
        const movementDirection = {
          x: distance > 0 ? dx / distance : 0,
          y: distance > 0 ? dy / distance : 0,
        };

        // Calculate modified speed with all penalties applied
        finalSpeed = movementPenaltySystem.calculateModifiedSpeed(
          baseSpeed,
          aiPlayer.bodyPartHealth,
          aiPlayer.bodyPartMaxHealth,
          movementDirection,
        );
      }

      // Physics-first: positions are in METERS, so distance is in meters
      // Stop moving when within 0.05 meters (5cm) of target - close enough for melee range
      const MIN_MOVEMENT_THRESHOLD_METERS = 0.05;

      if (distance > MIN_MOVEMENT_THRESHOLD_METERS) {
        const newPos = {
          x: currentPos.x + (dx / distance) * finalSpeed,
          y: currentPos.y + (dy / distance) * finalSpeed,
        };

        // Keep AI within arena bounds (positions in meters, centered at origin)
        const halfWidth = arenaBounds.worldWidthMeters / 2;
        const halfDepth = arenaBounds.worldDepthMeters / 2;
        newPos.x = Math.max(-halfWidth, Math.min(halfWidth, newPos.x));
        newPos.y = Math.max(-halfDepth, Math.min(halfDepth, newPos.y));

        // Update position through parent - this should trigger playerPositions state update in parent
        onPlayerUpdate(1, { position: newPos });
      }
    },
    [playerPositions, validPlayers, arenaBounds, onPlayerUpdate],
  );

  return {
    handleAttack,
    handleDefend,
    handleTechniqueExecute,
    handleStanceSwitch,
    handleStanceSideSwitch,
    handleAIAttack,
    handleAIDefend,
    handleAITechnique,
    moveAIPlayer,
  };
}
