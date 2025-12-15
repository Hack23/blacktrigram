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
import { Position, TrigramStance } from "@/types";
import { HitEffectType } from "@/systems/effects";
import { useCallback } from "react";
import { CombatScreenState, CombatActions } from "./useCombatState";
import { AttackIntensity } from "./useCombatAudio";

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
    readonly playBlockSound: (guardBroken?: boolean) => Promise<void>;
    readonly playDodgeSound: () => Promise<void>;
    readonly playStanceChangeSound: () => Promise<void>;
    readonly playSpecialTechniqueSound: () => Promise<void>;
  };
}

export interface UseCombatActionsReturn {
  readonly handleAttack: () => void;
  readonly handleDefend: () => void;
  readonly handleTechniqueExecute: () => void;
  readonly handleStanceSwitch: (stance: TrigramStance) => void;
  readonly handleAIAttack: () => void;
  readonly handleAIDefend: () => void;
  readonly handleAITechnique: () => void;
  readonly moveAIPlayer: (targetPos: Position) => void;
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
  const handleAttack = useCallback(() => {
    if (combatState.isExecutingTechnique || !combatState.roundStarted || combatState.roundEnded) return;

    combatActions.setExecutingTechnique(true);

    // Create basic attack technique
    const basicAttack = {
      id: "basic_attack",
      name: {
        korean: "기본공격",
        english: "Basic Attack",
        romanized: "gibon_gonggyeok",
      },
      koreanName: "기본공격",
      englishName: "Basic Attack",
      romanized: "gibon_gonggyeok",
      description: { korean: "기본 공격", english: "Basic attack" },
      stance: validPlayers[0].currentStance,
      type: "attack" as const,
      damageType: "physical" as const,
      damage: 15,
      kiCost: 5,
      staminaCost: 8,
      accuracy: 0.8,
      range: 1.0,
      executionTime: 400,
      recoveryTime: 300,
      critChance: 0.1,
      critMultiplier: 1.5,
      effects: [],
    };

    // Play attack sound based on technique damage/intensity
    const damage = basicAttack.damage ?? 10;
    const intensity: AttackIntensity = 
      damage >= 40 ? "critical" : 
      damage >= 25 ? "heavy" : 
      damage >= 10 ? "medium" : "light";
    combatAudio?.playAttackSound(intensity);

    // Use combat system for proper calculation
    const result = combatSystem.resolveAttack(
      validPlayers[0],
      validPlayers[1],
      basicAttack
    );

    const effectType = result.hit
      ? result.isCritical
        ? HitEffectType.CRITICAL_HIT
        : HitEffectType.HIT
      : HitEffectType.MISS;

    addHitEffect(effectType, playerPositions[0], result.hit ? 1 : 0.5);

    if (result.hit) {
      // Play hit sound based on damage
      combatAudio?.playHitSound(result.damage);

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

      if (result.isCritical) {
        addCombatMessage("치명타 공격!", "Critical Hit!");
      } else if (newCombo > 2) {
        addCombatMessage(`${newCombo} 연속 공격!`, `${newCombo} Hit Combo!`);
      } else {
        addCombatMessage("공격 성공!", "Attack Hit!");
      }
    } else {
      combatActions.resetCombo();
      addCombatMessage("공격 빗나감", "Attack Missed");
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
      // Play heavy hit sound for technique
      combatAudio?.playHitSound(30);

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

  // AI attack handler
  const handleAIAttack = useCallback(() => {
    const aiPlayer = validPlayers[1];
    const targetPlayer = validPlayers[0];

    // Create basic attack technique for AI using helper
    const basicAttack = createAITechnique('basic', aiPlayer);

    // Play attack sound based on technique damage/intensity (consistent with player)
    const damage = basicAttack.damage ?? 10;
    const intensity: AttackIntensity = 
      damage >= 40 ? "critical" : 
      damage >= 25 ? "heavy" : 
      damage >= 10 ? "medium" : "light";
    combatAudio?.playAttackSound(intensity);

    // Use combat system for proper calculation
    const result = combatSystem.resolveAttack(
      aiPlayer,
      targetPlayer,
      basicAttack
    );

    const effectType = result.hit
      ? result.isCritical
        ? HitEffectType.CRITICAL_HIT
        : HitEffectType.HIT
      : HitEffectType.MISS;

    addHitEffect(effectType, playerPositions[1], result.hit ? 1 : 0.5);

    if (result.hit) {
      // Play hit sound based on damage
      combatAudio?.playHitSound(result.damage);

      // Apply damage through combat system (deducts resources)
      const { updatedAttacker, updatedDefender } =
        combatSystem.applyCombatResult(
          result,
          aiPlayer,
          targetPlayer
        );

      onPlayerUpdate(1, updatedAttacker);
      onPlayerUpdate(0, updatedDefender);

      if (result.isCritical) {
        addCombatMessage("AI 치명타!", "AI Critical Hit!");
      } else {
        addCombatMessage("AI 공격 성공!", "AI Attack Hit!");
      }
    } else {
      // Consume resources on miss for consistency with technique behavior
      onPlayerUpdate(1, {
        ki: Math.max(0, aiPlayer.ki - basicAttack.kiCost),
        stamina: Math.max(0, aiPlayer.stamina - basicAttack.staminaCost),
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

  // AI technique handler
  const handleAITechnique = useCallback(() => {
    const aiPlayer = validPlayers[1];
    const targetPlayer = validPlayers[0];

    // Check if AI has sufficient resources
    if (aiPlayer.ki < 10 || aiPlayer.stamina < 15) {
      handleAIAttack(); // Fallback to basic attack
      return;
    }

    // Create special technique for AI using helper
    const specialTechnique = createAITechnique('special', aiPlayer);

    // Play special technique sound
    combatAudio?.playSpecialTechniqueSound();

    // Use combat system for proper calculation
    const result = combatSystem.resolveAttack(
      aiPlayer,
      targetPlayer,
      specialTechnique
    );

    const effectType = result.hit
      ? HitEffectType.CRITICAL_HIT
      : HitEffectType.MISS;

    addHitEffect(effectType, playerPositions[1], result.hit ? 1.5 : 0.5);

    if (result.hit) {
      // Play heavy hit sound for technique
      combatAudio?.playHitSound(result.damage);

      // Apply damage through combat system (deducts resources)
      const { updatedAttacker, updatedDefender } =
        combatSystem.applyCombatResult(
          result,
          aiPlayer,
          targetPlayer
        );

      onPlayerUpdate(1, updatedAttacker);
      onPlayerUpdate(0, updatedDefender);

      addCombatMessage("AI 특수 기술!", "AI Special Technique!");
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

  // AI movement handler
  const moveAIPlayer = useCallback(
    (targetPos: Position) => {
      const currentPos = playerPositions[1];
      const speed = 4;

      const dx = targetPos.x - currentPos.x;
      const dy = targetPos.y - currentPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 5) {
        const newPos = {
          x: currentPos.x + (dx / distance) * speed,
          y: currentPos.y + (dy / distance) * speed,
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
    [playerPositions, arenaBounds, onPlayerUpdate]
  );

  return {
    handleAttack,
    handleDefend,
    handleTechniqueExecute,
    handleStanceSwitch,
    handleAIAttack,
    handleAIDefend,
    handleAITechnique,
    moveAIPlayer,
  };
}
