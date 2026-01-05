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
import { CombatSystem } from "@/systems/CombatSystem";
import { Position, TrigramStance, Technique } from "@/types";
import { HitEffectType } from "@/systems/effects";
import { useCallback, useRef } from "react";
import { CombatScreenState, CombatActions } from "./useCombatState";
import { AttackIntensity } from "./useCombatAudio";
import { KoreanTechnique } from "@/systems/vitalpoint/types";
import { KoreanTechniquesSystem } from "@/systems/trigram/KoreanTechniques";
import { getVitalPointById } from "@/systems/vitalpoint/KoreanVitalPoints";
import { movementPenaltySystem } from "@/systems/bodypart";
import { StanceManager } from "@/systems/trigram";
import { checkForFall, getFallTypeName } from "@/systems/combat/FallIntegration";
import type { AnimationState } from "@/systems/animation/types";

/**
 * Hit position variation range for randomizing strike heights
 * Produces ±0.2 absolute units (±10% of 2.0 character height)
 */
const HIT_Y_VARIATION_RANGE = 0.4;

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

export interface UseCombatActionsConfig {
  readonly validPlayers: readonly [PlayerState, PlayerState];
  readonly playerPositions: readonly [Position, Position];
  readonly combatState: CombatScreenState;
  readonly combatActions: CombatActions;
  readonly combatSystem: CombatSystem;
  readonly onPlayerUpdate: (playerIndex: number, updates: Partial<PlayerState>) => void;
  readonly addCombatMessage: (korean: string, english: string) => void;
  readonly addHitEffect: (type: HitEffectType, position: Position, intensity?: number) => void;
  readonly arenaBounds: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly combatAudio?: {
    readonly playAttackSound: (intensity?: AttackIntensity) => Promise<void>;
    readonly playHitSound: (damage: number) => Promise<void>;
    readonly playBoneImpactSound: (options: {
      region?: import("../../../audio/types").AudioBodyRegion;
      intensity?: import("../../../audio/types").ImpactIntensity;
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
    readonly player1: { readonly transitionTo: (state: AnimationState) => boolean };
    readonly player2: { readonly transitionTo: (state: AnimationState) => boolean };
  };
}

export interface UseCombatActionsReturn {
  readonly handleAttack: (technique?: Technique) => void;
  readonly handleDefend: () => void;
  readonly handleTechniqueExecute: () => void;
  readonly handleStanceSwitch: (stance: TrigramStance) => void;
  readonly handleStanceSideSwitch: (playerIndex: 0 | 1) => void;
  readonly handleAIAttack: (technique?: KoreanTechnique, targetVitalPoint?: string) => void;
  readonly handleAIDefend: () => void;
  readonly handleAITechnique: (technique?: KoreanTechnique, targetVitalPoint?: string) => void;
  readonly moveAIPlayer: (targetPos: Position) => void;
}

/**
 * Helper function to convert Technique to KoreanTechnique format
 * @param technique - The technique to convert
 * @param stance - Current player stance
 * @returns KoreanTechnique compatible with CombatSystem
 */
function convertTechniqueToKorean(technique: Technique, stance: TrigramStance): KoreanTechnique {
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
    range: 1.0,
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
export function useCombatActions(config: UseCombatActionsConfig): UseCombatActionsReturn {
  const {
    validPlayers,
    playerPositions,
    combatState,
    combatActions,
    combatSystem,
    onPlayerUpdate,
    addCombatMessage,
    addHitEffect,
    arenaBounds,
    combatAudio,
  } = config;

  // Player attack handler
  const handleAttack = useCallback((technique?: Technique) => {
    if (combatState.isExecutingTechnique || !combatState.roundStarted || combatState.roundEnded) return;

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
      const availableTechniques = KoreanTechniquesSystem.getAllAvailableTechniques(
        currentStance,
        archetype
      );

      if (availableTechniques.length === 0) {
        console.warn(`No techniques found for stance: ${currentStance}, archetype: ${archetype}`);
        addCombatMessage("기술 없음", "No techniques available");
        return;
      }

      // Select primary technique (first in list)
      const selectedTechnique = availableTechniques[0];

      // Check if player has sufficient resources
      if (!KoreanTechniquesSystem.canExecuteTechnique(player, selectedTechnique)) {
        addCombatMessage("기력/체력 부족", "Insufficient Ki/Stamina");
        return;
      }

      attackTechnique = selectedTechnique;
    }

    combatActions.setExecutingTechnique(true);

    // Play attack sound based on technique damage/intensity
    const damage = attackTechnique.damage ?? 10;
    const intensity: AttackIntensity = 
      damage >= 40 ? "critical" : 
      damage >= 25 ? "heavy" : 
      damage >= 10 ? "medium" : "light";
    combatAudio?.playAttackSound(intensity);

    // Use combat system for proper calculation
    const result = combatSystem.resolveAttack(
      validPlayers[0],
      validPlayers[1],
      attackTechnique
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
      const newCombo = timeSinceLastHit < 2000 ? combatState.comboCount + 1 : 1;
      combatActions.setComboCount(newCombo);
      combatActions.setLastHitTime(now);

      // Apply damage through combat system
      const { updatedAttacker, updatedDefender } =
        combatSystem.applyCombatResult(
          result,
          validPlayers[0],
          validPlayers[1]
        );

      onPlayerUpdate(0, updatedAttacker);
      onPlayerUpdate(1, updatedDefender);

      // Check if defender should fall after taking damage
      if (config.playerAnimations?.player2) {
        const fallCheck = checkForFall(
          updatedDefender,
          combatSystem,
          undefined, // lastImpactAngle not tracked yet
          undefined  // attackAngle not tracked yet
        );

        if (fallCheck.shouldFall && fallCheck.animationState) {
          config.playerAnimations.player2.transitionTo(fallCheck.animationState);
          const fallName = getFallTypeName(fallCheck.fallType!);
          addCombatMessage(
            `${fallName.korean}!`,
            `${fallName.english}!`
          );
        }
      }

      // Display technique name in combat log
      const techniqueNameKorean = attackTechnique.koreanName || attackTechnique.name.korean;
      const techniqueNameEnglish = attackTechnique.englishName || attackTechnique.name.english;

      if (result.isCritical) {
        addCombatMessage(
          `치명타! ${techniqueNameKorean}`,
          `Critical Hit! ${techniqueNameEnglish}`
        );
      } else if (newCombo > 2) {
        addCombatMessage(
          `${newCombo} 연속! ${techniqueNameKorean}`,
          `${newCombo} Combo! ${techniqueNameEnglish}`
        );
      } else {
        addCombatMessage(
          `${techniqueNameKorean} 성공!`,
          `${techniqueNameEnglish} Hit!`
        );
      }
    } else {
      combatActions.resetCombo();
      const techniqueNameKorean = attackTechnique.koreanName || attackTechnique.name.korean;
      const techniqueNameEnglish = attackTechnique.englishName || attackTechnique.name.english;
      addCombatMessage(
        `${techniqueNameKorean} 빗나감`,
        `${techniqueNameEnglish} Missed`
      );
    }

    setTimeout(() => combatActions.setExecutingTechnique(false), 500);
  }, [
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
    addCombatMessage,
    addHitEffect,
    combatAudio,
  ]);

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
    if (combatState.isExecutingTechnique || !combatState.roundStarted || combatState.roundEnded) return;
    if (validPlayers[0].ki < 10 || validPlayers[0].stamina < 15) {
      addCombatMessage("기력/체력 부족", "Insufficient Ki/Stamina");
      return;
    }

    combatActions.setExecutingTechnique(true);

    // Play special technique sound
    combatAudio?.playSpecialTechniqueSound();

    addHitEffect(HitEffectType.CRITICAL_HIT, playerPositions[0], 1.5);

    // Screen shake effect for impact
    const shakeIntensity = 8;
    const shakeFrames = [
      { x: shakeIntensity, y: -shakeIntensity * 0.5 },
      { x: -shakeIntensity * 0.7, y: shakeIntensity * 0.8 },
      { x: shakeIntensity * 0.5, y: shakeIntensity * 0.3 },
      { x: -shakeIntensity * 0.3, y: -shakeIntensity * 0.6 },
      { x: 0, y: 0 },
    ];

    shakeFrames.forEach((shake, index) => {
      setTimeout(() => combatActions.setScreenShake(shake), index * 50);
    });

    const distance = Math.sqrt(
      Math.pow(playerPositions[0].x - playerPositions[1].x, 2) +
        Math.pow(playerPositions[0].y - playerPositions[1].y, 2)
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
    ]
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
      const currentLaterality = combatState.playerLaterality[playerIndex];
      
      const result = stanceManagerRef.current.switchStanceSide(player, currentLaterality);

      if (result.success && result.laterality) {
        // Update player state with new stamina
        onPlayerUpdate(playerIndex, result.updatedPlayer);

        // Update laterality state with value from StanceManager
        combatActions.setPlayerLateralityIndex(playerIndex, result.laterality);

        // Audio feedback
        combatAudio?.playStanceChangeSound?.();

        // Visual feedback
        const koreanText = result.laterality === "left" ? "왼발서기" : "오른발서기";
        const englishText = result.laterality === "left" ? "Left Stance" : "Right Stance";
        addCombatMessage(koreanText, englishText);

        // Visual effect
        addHitEffect(HitEffectType.STATUS_EFFECT, playerPositions[playerIndex], 0.5);
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
      combatActions,
      combatAudio,
      addCombatMessage,
      addHitEffect,
      playerPositions,
    ]
  );

  /**
   * Helper function to create AI technique objects
   * Reduces code duplication between basic attacks and special techniques
   */
  const createAITechnique = useCallback(
    (type: 'basic' | 'special', aiPlayer: PlayerState) => {
      if (type === 'basic') {
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
          range: 1.2,
          executionTime: 400,
          recoveryTime: 300,
          critChance: 0.1,
          critMultiplier: 1.5,
          effects: [],
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
          description: { korean: "AI 특수 기술", english: "AI special technique" },
          stance: aiPlayer.currentStance,
          type: "technique" as const,
          damageType: "physical" as const,
          damage: 25,
          kiCost: 10,
          staminaCost: 15,
          accuracy: 0.85,
          range: 1.5,
          executionTime: 600,
          recoveryTime: 800,
          critChance: 0.15,
          critMultiplier: 1.8,
          effects: [],
        };
      }
    },
    []
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
    []
  );

  /**
   * AI attack handler with technique and vital point targeting
   * 
   * @param technique - Optional Korean martial arts technique to execute. If not provided, creates a basic attack.
   * @param targetVitalPoint - Optional vital point ID to target for increased damage effectiveness.
   */
  const handleAIAttack = useCallback((technique?: KoreanTechnique, targetVitalPoint?: string) => {
    const aiPlayer = validPlayers[1];
    const targetPlayer = validPlayers[0];

    // Use provided technique or create basic attack technique
    const attackTechnique = technique ?? createAITechnique('basic', aiPlayer);

    // Play attack sound based on technique damage/intensity (consistent with player)
    const damage = attackTechnique.damage ?? 10;
    const intensity: AttackIntensity = 
      damage >= 40 ? "critical" : 
      damage >= 25 ? "heavy" : 
      damage >= 10 ? "medium" : "light";
    combatAudio?.playAttackSound(intensity);

    // Use combat system for proper calculation with vital point targeting
    const result = combatSystem.resolveAttack(
      aiPlayer,
      targetPlayer,
      attackTechnique,
      targetVitalPoint // Pass vital point ID for targeting
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
        combatSystem.applyCombatResult(
          result,
          aiPlayer,
          targetPlayer
        );

      onPlayerUpdate(1, updatedAttacker);
      onPlayerUpdate(0, updatedDefender);

      // Check if player should fall after taking damage from AI
      if (config.playerAnimations?.player1) {
        const fallCheck = checkForFall(
          updatedDefender,
          combatSystem,
          undefined, // lastImpactAngle not tracked yet
          undefined  // attackAngle not tracked yet
        );

        if (fallCheck.shouldFall && fallCheck.animationState) {
          config.playerAnimations.player1.transitionTo(fallCheck.animationState);
          const fallName = getFallTypeName(fallCheck.fallType!);
          addCombatMessage(
            `${fallName.korean}!`,
            `${fallName.english}!`
          );
        }
      }

      // Enhanced combat message with vital point info
      if (result.vitalPointHit && targetVitalPoint) {
        const vitalPoint = getVitalPointById(targetVitalPoint);
        const vpName = vitalPoint ? vitalPoint.names.korean : targetVitalPoint;
        addCombatMessage(
          `AI 급소 타격! ${vpName}`,
          `AI Vital Point Hit! ${vitalPoint?.names.english ?? targetVitalPoint}`
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
  }, [
    validPlayers,
    playerPositions,
    combatSystem,
    onPlayerUpdate,
    addCombatMessage,
    addHitEffect,
    combatAudio,
    createAITechnique,
    getHitEffectType,
  ]);

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
  const handleAITechnique = useCallback((technique?: KoreanTechnique, targetVitalPoint?: string) => {
    const aiPlayer = validPlayers[1];
    const targetPlayer = validPlayers[0];

    // Use provided technique or create special technique
    const specialTechnique = technique ?? createAITechnique('special', aiPlayer);

    // Check if AI has sufficient resources for the technique
    if (aiPlayer.ki < specialTechnique.kiCost || aiPlayer.stamina < specialTechnique.staminaCost) {
      handleAIAttack(undefined, targetVitalPoint); // Fallback to basic attack with same targeting
      return;
    }

    // Play special technique sound
    combatAudio?.playSpecialTechniqueSound();

    // Use combat system for proper calculation with vital point targeting
    const result = combatSystem.resolveAttack(
      aiPlayer,
      targetPlayer,
      specialTechnique,
      targetVitalPoint // Pass vital point ID for targeting
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
        vitalPoint: result.isCritical || !!targetVitalPoint, // Special techniques often target vital points
        hitPosition,
      });

      // Apply damage through combat system (deducts resources)
      const { updatedAttacker, updatedDefender } =
        combatSystem.applyCombatResult(
          result,
          aiPlayer,
          targetPlayer
        );

      onPlayerUpdate(1, updatedAttacker);
      onPlayerUpdate(0, updatedDefender);

      // Check if player should fall after taking damage from AI technique
      if (config.playerAnimations?.player1) {
        const fallCheck = checkForFall(
          updatedDefender,
          combatSystem,
          undefined, // lastImpactAngle not tracked yet
          undefined  // attackAngle not tracked yet
        );

        if (fallCheck.shouldFall && fallCheck.animationState) {
          config.playerAnimations.player1.transitionTo(fallCheck.animationState);
          const fallName = getFallTypeName(fallCheck.fallType!);
          addCombatMessage(
            `${fallName.korean}!`,
            `${fallName.english}!`
          );
        }
      }

      // Enhanced combat message with vital point info
      if (result.vitalPointHit && targetVitalPoint) {
        const vitalPoint = getVitalPointById(targetVitalPoint);
        const vpName = vitalPoint ? vitalPoint.names.korean : targetVitalPoint;
        addCombatMessage(
          `AI 특수 급소 기술! ${vpName}`,
          `AI Special Vital Point Technique! ${vitalPoint?.names.english ?? targetVitalPoint}`
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
  }, [
    validPlayers,
    playerPositions,
    combatSystem,
    onPlayerUpdate,
    addCombatMessage,
    addHitEffect,
    handleAIAttack,
    combatAudio,
    createAITechnique,
  ]);

  // AI movement handler with injury-based movement penalties
  const moveAIPlayer = useCallback(
    (targetPos: Position) => {
      const currentPos = playerPositions[1];
      const aiPlayer = validPlayers[1];
      
      // Movement speed calibrated for 8m×8m arena with realistic combat closing speed
      // Arena width is dynamic: arenaBounds.width is in pixels and represents an 8m-wide arena, so pixelsPerMeter = arenaBounds.width / 8
      // Combat closing speed: ~2.5 m/s (fast tactical approach, not slow walking)
      // Real fights are over in 4-5 seconds - AI must close distance quickly
      // Calculation: 2.5 m/s × pixelsPerMeter / 20 calls/s = px/call
      const pixelsPerMeter = arenaBounds.width / 8;
      const baseSpeed = (2.5 * pixelsPerMeter) / 20;

      // Calculate movement direction vector
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
          movementDirection
        );
      }

      if (distance > 5) {
        const newPos = {
          x: currentPos.x + (dx / distance) * finalSpeed,
          y: currentPos.y + (dy / distance) * finalSpeed,
        };

        // Keep AI within bounds
        newPos.x = Math.max(
          arenaBounds.x,
          Math.min(arenaBounds.x + arenaBounds.width - 60, newPos.x)
        );
        newPos.y = Math.max(
          arenaBounds.y,
          Math.min(arenaBounds.y + arenaBounds.height - 180, newPos.y)
        );

        // Update position through parent - this should trigger playerPositions state update in parent
        onPlayerUpdate(1, { position: newPos });
      }
    },
    [playerPositions, validPlayers, arenaBounds, onPlayerUpdate]
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
