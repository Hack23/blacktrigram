/**
 * Unit tests for Consciousness System.
 * 
 * Tests consciousness levels, incapacitation threshold, recovery mechanics,
 * and head trauma effects.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { PlayerArchetype, VitalPointCategory } from "@/types";
import { createPlayerFromArchetype } from "@/utils/playerUtils";
import type { PlayerState } from "../player";
import { ConsciousnessSystem, ConsciousnessLevel } from "./ConsciousnessSystem";

describe("ConsciousnessSystem", () => {
  let consciousnessSystem: ConsciousnessSystem;
  let player: PlayerState;

  beforeEach(() => {
    consciousnessSystem = new ConsciousnessSystem();
    player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  });

  describe("Consciousness Level Determination", () => {
    it("should identify COMBAT_ALERT level (90-100)", () => {
      expect(consciousnessSystem.getLevel(90)).toBe(ConsciousnessLevel.COMBAT_ALERT);
      expect(consciousnessSystem.getLevel(95)).toBe(ConsciousnessLevel.COMBAT_ALERT);
      expect(consciousnessSystem.getLevel(100)).toBe(ConsciousnessLevel.COMBAT_ALERT);
    });

    it("should identify DISORIENTED level (50-89)", () => {
      expect(consciousnessSystem.getLevel(50)).toBe(ConsciousnessLevel.DISORIENTED);
      expect(consciousnessSystem.getLevel(70)).toBe(ConsciousnessLevel.DISORIENTED);
      expect(consciousnessSystem.getLevel(89)).toBe(ConsciousnessLevel.DISORIENTED);
    });

    it("should identify STUNNED level (20-49)", () => {
      expect(consciousnessSystem.getLevel(20)).toBe(ConsciousnessLevel.STUNNED);
      expect(consciousnessSystem.getLevel(35)).toBe(ConsciousnessLevel.STUNNED);
      expect(consciousnessSystem.getLevel(49)).toBe(ConsciousnessLevel.STUNNED);
    });

    it("should identify UNCONSCIOUS level (0-19) - incapacitation threshold", () => {
      expect(consciousnessSystem.getLevel(0)).toBe(ConsciousnessLevel.UNCONSCIOUS);
      expect(consciousnessSystem.getLevel(10)).toBe(ConsciousnessLevel.UNCONSCIOUS);
      expect(consciousnessSystem.getLevel(19)).toBe(ConsciousnessLevel.UNCONSCIOUS);
    });
  });

  describe("Consciousness Damage Application", () => {
    it("should apply consciousness damage from normal hits", () => {
      const newPlayer = consciousnessSystem.applyDamage(player, 20);
      
      expect(newPlayer.consciousness).toBeLessThan(player.consciousness);
      expect(newPlayer.consciousness).toBeGreaterThanOrEqual(0);
    });

    it("should apply more consciousness damage for neurological hits", () => {
      const normalHit = consciousnessSystem.applyDamage(player, 20);
      const neuroHit = consciousnessSystem.applyDamage(
        player,
        20,
        VitalPointCategory.NEUROLOGICAL
      );

      expect(neuroHit.consciousness).toBeLessThan(normalHit.consciousness);
    });

    it("should apply more consciousness damage for vascular hits", () => {
      const normalHit = consciousnessSystem.applyDamage(player, 20);
      const vascularHit = consciousnessSystem.applyDamage(
        player,
        20,
        VitalPointCategory.VASCULAR
      );

      expect(vascularHit.consciousness).toBeLessThan(normalHit.consciousness);
    });

    it("should apply moderate consciousness damage for respiratory hits", () => {
      const normalHit = consciousnessSystem.applyDamage(player, 20);
      const respiratoryHit = consciousnessSystem.applyDamage(
        player,
        20,
        VitalPointCategory.RESPIRATORY
      );

      expect(respiratoryHit.consciousness).toBeLessThan(normalHit.consciousness);
    });

    it("should clamp consciousness to 0-100 range", () => {
      const maxDamage = consciousnessSystem.applyDamage(player, 1000);
      expect(maxDamage.consciousness).toBe(0);

      const noDamage = consciousnessSystem.applyDamage(
        { ...player, consciousness: 100 },
        -100
      );
      expect(noDamage.consciousness).toBe(100);
    });

    it("should accumulate consciousness damage over multiple hits", () => {
      let currentPlayer = player;
      
      for (let i = 0; i < 3; i++) {
        currentPlayer = consciousnessSystem.applyDamage(currentPlayer, 10);
      }

      expect(currentPlayer.consciousness).toBeLessThan(player.consciousness);
    });
  });

  describe("Incapacitation Threshold (<20% consciousness)", () => {
    it("should detect incapacitation below 20% consciousness", () => {
      const incapacitatedPlayer = { ...player, consciousness: 15 };
      
      expect(consciousnessSystem.isAtIncapacitationThreshold(incapacitatedPlayer)).toBe(true);
    });

    it("should NOT detect incapacitation at 20% or above", () => {
      const normalPlayer = { ...player, consciousness: 20 };
      
      expect(consciousnessSystem.isAtIncapacitationThreshold(normalPlayer)).toBe(false);
    });

    it("should return helpless duration between 3-5 seconds", () => {
      const duration = consciousnessSystem.getHelplessDuration();
      
      expect(duration).toBeGreaterThanOrEqual(3000);
      expect(duration).toBeLessThanOrEqual(5000);
    });

    it("should return random helpless durations", () => {
      const durations = new Set<number>();
      
      // Generate multiple durations to verify randomness
      for (let i = 0; i < 10; i++) {
        durations.add(consciousnessSystem.getHelplessDuration());
      }
      
      // Should have some variation (not all the same)
      expect(durations.size).toBeGreaterThan(1);
    });

    it("should identify player as incapacitated at unconscious level", () => {
      const unconsciousPlayer = { ...player, consciousness: 5 };
      
      expect(consciousnessSystem.isIncapacitated(unconsciousPlayer)).toBe(true);
    });

    it("should NOT identify player as incapacitated above unconscious level", () => {
      const stunnedPlayer = { ...player, consciousness: 30 };
      
      expect(consciousnessSystem.isIncapacitated(stunnedPlayer)).toBe(false);
    });
  });

  describe("Consciousness Recovery (5 seconds after head trauma)", () => {
    it("should recover consciousness after 5 seconds without trauma", () => {
      const lowConsciousness = { ...player, consciousness: 50 };
      const lastTrauma = Date.now() - 6000; // 6 seconds ago
      
      const recovered = consciousnessSystem.applyRecovery(
        lowConsciousness,
        1000,
        lastTrauma
      );
      
      expect(recovered.consciousness).toBeGreaterThan(lowConsciousness.consciousness);
    });

    it("should NOT recover consciousness within 5 seconds of trauma", () => {
      const lowConsciousness = { ...player, consciousness: 50 };
      const lastTrauma = Date.now() - 3000; // 3 seconds ago
      
      const notRecovered = consciousnessSystem.applyRecovery(
        lowConsciousness,
        1000,
        lastTrauma
      );
      
      expect(notRecovered.consciousness).toBe(lowConsciousness.consciousness);
    });

    it("should recover at 5 points per second", () => {
      const lowConsciousness = { ...player, consciousness: 50 };
      const lastTrauma = Date.now() - 10000; // 10 seconds ago (safe to recover)
      
      const recovered = consciousnessSystem.applyRecovery(
        lowConsciousness,
        1000,
        lastTrauma
      );
      
      // Should recover approximately 5 points
      expect(Math.abs(recovered.consciousness - 55)).toBeLessThan(0.5);
    });

    it("should recover slower when stunned", () => {
      const stunnedPlayer = { ...player, consciousness: 30 }; // STUNNED level
      const alertPlayer = { ...player, consciousness: 92 }; // COMBAT_ALERT level
      const lastTrauma = Date.now() - 10000; // Safe to recover
      
      const stunnedRecovery = consciousnessSystem.applyRecovery(
        stunnedPlayer,
        1000,
        lastTrauma
      );
      const alertRecovery = consciousnessSystem.applyRecovery(
        alertPlayer,
        1000,
        lastTrauma
      );
      
      const stunnedDelta = stunnedRecovery.consciousness - stunnedPlayer.consciousness;
      const alertDelta = alertRecovery.consciousness - alertPlayer.consciousness;
      
      expect(stunnedDelta).toBeLessThan(alertDelta);
    });

    it("should recover very slowly when unconscious", () => {
      const unconsciousPlayer = { ...player, consciousness: 10 }; // UNCONSCIOUS
      const lastTrauma = Date.now() - 10000; // Safe to recover
      
      const recovered = consciousnessSystem.applyRecovery(
        unconsciousPlayer,
        1000,
        lastTrauma
      );
      
      const delta = recovered.consciousness - unconsciousPlayer.consciousness;
      
      // Should recover at only 20% rate (1 point per second)
      expect(delta).toBeLessThan(2);
    });

    it("should not exceed 100 consciousness", () => {
      const highConsciousness = { ...player, consciousness: 98 };
      const lastTrauma = Date.now() - 10000;
      
      const recovered = consciousnessSystem.applyRecovery(
        highConsciousness,
        1000,
        lastTrauma
      );
      
      expect(recovered.consciousness).toBe(100);
    });

    it("should not recover if already at full consciousness", () => {
      const fullConsciousness = { ...player, consciousness: 100 };
      const lastTrauma = Date.now() - 10000;
      
      const recovered = consciousnessSystem.applyRecovery(
        fullConsciousness,
        1000,
        lastTrauma
      );
      
      expect(recovered.consciousness).toBe(100);
    });

    it("should check if recovery is allowed based on trauma time", () => {
      const recentTrauma = Date.now() - 3000; // 3 seconds ago
      const oldTrauma = Date.now() - 6000; // 6 seconds ago
      
      expect(consciousnessSystem.canRecover(recentTrauma)).toBe(false);
      expect(consciousnessSystem.canRecover(oldTrauma)).toBe(true);
    });
  });

  describe("Consciousness Effects on Performance", () => {
    it("should not affect performance at COMBAT_ALERT", () => {
      const effects = consciousnessSystem.getEffects(ConsciousnessLevel.COMBAT_ALERT);
      
      expect(effects.reactionTimeMultiplier).toBe(1.0);
      expect(effects.accuracyPenalty).toBe(0.0);
      expect(effects.defensePenalty).toBe(0.0);
      expect(effects.canAct).toBe(true);
      expect(effects.visionClarity).toBe(1.0);
    });

    it("should reduce performance at DISORIENTED (30% slower, -20% accuracy, -15% defense)", () => {
      const effects = consciousnessSystem.getEffects(ConsciousnessLevel.DISORIENTED);
      
      expect(effects.reactionTimeMultiplier).toBe(1.3);
      expect(effects.accuracyPenalty).toBe(0.2);
      expect(effects.defensePenalty).toBe(0.15);
      expect(effects.canAct).toBe(true);
      expect(effects.visionClarity).toBe(0.7);
    });

    it("should severely reduce performance at STUNNED", () => {
      const effects = consciousnessSystem.getEffects(ConsciousnessLevel.STUNNED);
      
      expect(effects.reactionTimeMultiplier).toBe(2.0);
      expect(effects.accuracyPenalty).toBe(0.5);
      expect(effects.defensePenalty).toBe(0.4);
      expect(effects.canAct).toBe(true);
      expect(effects.visionClarity).toBe(0.4);
    });

    it("should completely disable at UNCONSCIOUS", () => {
      const effects = consciousnessSystem.getEffects(ConsciousnessLevel.UNCONSCIOUS);
      
      expect(effects.reactionTimeMultiplier).toBe(Infinity);
      expect(effects.accuracyPenalty).toBe(1.0);
      expect(effects.defensePenalty).toBe(1.0);
      expect(effects.canAct).toBe(false);
      expect(effects.visionClarity).toBe(0.0);
    });

    it("should apply consciousness effects to player stats", () => {
      const disoriented = { 
        ...player, 
        consciousness: 70, // DISORIENTED
        attackPower: 100,
        defense: 100,
        technique: 100,
      };
      
      const affected = consciousnessSystem.applyEffects(disoriented);
      
      // DISORIENTED: -20% accuracy, -15% defense
      expect(affected.attackPower).toBe(80); // 100 * (1 - 0.2)
      expect(affected.defense).toBe(85); // 100 * (1 - 0.15)
      expect(affected.technique).toBe(80); // 100 * (1 - 0.2)
    });

    it("should mark player as stunned at UNCONSCIOUS or STUNNED levels", () => {
      const unconscious = { ...player, consciousness: 10 };
      const stunned = { ...player, consciousness: 30 };
      const alert = { ...player, consciousness: 95 };
      
      const affectedUnconscious = consciousnessSystem.applyEffects(unconscious);
      const affectedStunned = consciousnessSystem.applyEffects(stunned);
      const affectedAlert = consciousnessSystem.applyEffects(alert);
      
      expect(affectedUnconscious.isStunned).toBe(true);
      expect(affectedStunned.isStunned).toBe(true);
      expect(affectedAlert.isStunned).toBe(false);
    });
  });

  describe("Consciousness Level Names and Descriptions", () => {
    it("should provide bilingual names for all consciousness levels", () => {
      const levels = [
        ConsciousnessLevel.COMBAT_ALERT,
        ConsciousnessLevel.DISORIENTED,
        ConsciousnessLevel.STUNNED,
        ConsciousnessLevel.UNCONSCIOUS,
      ];

      levels.forEach((level) => {
        const name = consciousnessSystem.getLevelName(level);
        expect(name.korean).toBeTruthy();
        expect(name.english).toBeTruthy();
      });
    });

    it("should provide bilingual descriptions for all consciousness levels", () => {
      const levels = [
        ConsciousnessLevel.COMBAT_ALERT,
        ConsciousnessLevel.DISORIENTED,
        ConsciousnessLevel.STUNNED,
        ConsciousnessLevel.UNCONSCIOUS,
      ];

      levels.forEach((level) => {
        const description = consciousnessSystem.getLevelDescription(level);
        expect(description.korean).toBeTruthy();
        expect(description.english).toBeTruthy();
      });
    });
  });

  describe("Category-Based Consciousness Damage", () => {
    it("should apply highest consciousness damage for neurological hits", () => {
      const normal = consciousnessSystem.applyDamage(player, 10);
      const neuro = consciousnessSystem.applyDamage(
        player,
        10,
        VitalPointCategory.NEUROLOGICAL
      );

      const normalDelta = player.consciousness - normal.consciousness;
      const neuroDelta = player.consciousness - neuro.consciousness;

      expect(neuroDelta).toBeGreaterThan(normalDelta);
    });

    it("should apply moderate-high consciousness damage for vascular hits", () => {
      const normal = consciousnessSystem.applyDamage(player, 10);
      const vascular = consciousnessSystem.applyDamage(
        player,
        10,
        VitalPointCategory.VASCULAR
      );

      const normalDelta = player.consciousness - normal.consciousness;
      const vascularDelta = player.consciousness - vascular.consciousness;

      expect(vascularDelta).toBeGreaterThan(normalDelta);
    });
  });

  describe("Edge Cases", () => {
    it("should handle recovery with no last trauma time", () => {
      const lowConsciousness = { ...player, consciousness: 50 };
      
      // No lastTraumaTime provided - should recover immediately
      const recovered = consciousnessSystem.applyRecovery(
        lowConsciousness,
        1000
      );
      
      expect(recovered.consciousness).toBeGreaterThan(lowConsciousness.consciousness);
    });

    it("should handle multiple damage applications leading to unconsciousness", () => {
      let currentPlayer = player;
      
      // Apply damage until unconscious
      for (let i = 0; i < 20; i++) {
        currentPlayer = consciousnessSystem.applyDamage(
          currentPlayer,
          10,
          VitalPointCategory.NEUROLOGICAL
        );
        
        if (consciousnessSystem.isIncapacitated(currentPlayer)) {
          break;
        }
      }
      
      expect(consciousnessSystem.isIncapacitated(currentPlayer)).toBe(true);
      expect(currentPlayer.consciousness).toBeLessThan(20);
    });
  });
});
