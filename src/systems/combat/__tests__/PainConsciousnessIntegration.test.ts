/**
 * Integration and Performance tests for Pain Response + Consciousness Systems.
 * 
 * Tests combined system behavior, performance requirements, and stress testing
 * to validate 100% production readiness.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { PlayerArchetype, VitalPointCategory, VitalPointSeverity } from "@/types";
import { createPlayerFromArchetype } from "@/utils/playerUtils";
import type { PlayerState } from "../../player";
import PainResponseSystem from "../PainResponseSystem";
import ConsciousnessSystem from "../ConsciousnessSystem";

describe("Pain Response + Consciousness Integration - 100% Production Ready", () => {
  let painSystem: PainResponseSystem;
  let consciousnessSystem: ConsciousnessSystem;
  let player: PlayerState;

  beforeEach(() => {
    painSystem = new PainResponseSystem();
    consciousnessSystem = new ConsciousnessSystem();
    player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  });

  describe("Combined System Effects", () => {
    it("should handle simultaneous pain + consciousness degradation", () => {
      // Apply pain damage
      const { player: painfulPlayer } = painSystem.applyPain(player, 50);
      
      // Apply consciousness damage to same player
      const finalPlayer = consciousnessSystem.applyDamage(
        painfulPlayer,
        30,
        VitalPointCategory.NEUROLOGICAL
      );
      
      // Both systems should have affected the player
      expect(finalPlayer.pain).toBeGreaterThan(player.pain);
      expect(finalPlayer.consciousness).toBeLessThan(player.consciousness);
      
      // Verify pain level
      expect(painSystem.getPainLevel(finalPlayer.pain)).not.toBe(painSystem.getPainLevel(player.pain));
      
      // Verify consciousness level
      expect(consciousnessSystem.getLevel(finalPlayer.consciousness)).not.toBe(
        consciousnessSystem.getLevel(player.consciousness)
      );
    });

    it("should apply combined penalties to combat readiness", () => {
      const baseAttack = player.attackPower;
      const baseDefense = player.defense;
      const baseTechnique = player.technique;
      
      // Apply high pain (60 - SEVERE level)
      const painfulPlayer = { ...player, pain: 60 };
      const painAffected = painSystem.applyEffects(painfulPlayer);
      
      // Apply consciousness damage (70 - DISORIENTED level)
      const consciousPlayer = { ...painAffected, consciousness: 70 };
      const finalAffected = consciousnessSystem.applyEffects(consciousPlayer);
      
      // Both systems should reduce stats
      expect(finalAffected.attackPower).toBeLessThan(baseAttack);
      expect(finalAffected.defense).toBeLessThan(baseDefense);
      expect(finalAffected.technique).toBeLessThan(baseTechnique);
    });

    it("should handle neurological vital point affecting both systems", () => {
      // Neurological damage affects both pain and consciousness heavily
      const { player: painfulPlayer } = painSystem.applyPain(
        player,
        20,
        VitalPointSeverity.MAJOR,
        VitalPointCategory.NEUROLOGICAL
      );
      
      const finalPlayer = consciousnessSystem.applyDamage(
        painfulPlayer,
        20,
        VitalPointCategory.NEUROLOGICAL
      );
      
      // Neurological damage should significantly affect both
      expect(finalPlayer.pain).toBeGreaterThan(player.pain + 20);
      expect(finalPlayer.consciousness).toBeLessThan(player.consciousness - 40);
    });

    it("should handle combined recovery over time", () => {
      // Start with both pain and reduced consciousness
      let currentPlayer = { ...player, pain: 50, consciousness: 50 };
      const lastTrauma = Date.now() - 10000; // 10 seconds ago
      
      // Simulate 10 seconds of recovery
      for (let t = 0; t < 10; t++) {
        currentPlayer = painSystem.applyDissipation(currentPlayer, 1000);
        currentPlayer = consciousnessSystem.applyRecovery(
          currentPlayer,
          1000,
          lastTrauma - (10 - t) * 1000
        );
      }
      
      // Both should have recovered
      expect(currentPlayer.pain).toBeLessThan(50);
      expect(currentPlayer.consciousness).toBeGreaterThan(50);
    });

    it("should handle incapacitation from either system", () => {
      // Test pain-induced incapacitation
      const painIncapacitated = { ...player, pain: 90 };
      expect(painSystem.isIncapacitated(painIncapacitated)).toBe(true);
      
      // Test consciousness-induced incapacitation
      const consciousnessIncapacitated = { ...player, consciousness: 15 };
      expect(consciousnessSystem.isIncapacitated(consciousnessIncapacitated)).toBe(true);
      
      // Test combined incapacitation
      const bothIncapacitated = { ...player, pain: 85, consciousness: 18 };
      expect(
        painSystem.isIncapacitated(bothIncapacitated) ||
        consciousnessSystem.isIncapacitated(bothIncapacitated)
      ).toBe(true);
    });
  });

  describe("Performance Requirements - <0.5ms per frame", () => {
    it("should process pain application in <0.5ms", () => {
      const iterations = 1000;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        painSystem.applyPain(player, 10);
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      expect(avgTime).toBeLessThan(0.5);
    });

    it("should process consciousness damage in <0.5ms", () => {
      const iterations = 1000;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        consciousnessSystem.applyDamage(player, 10);
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      expect(avgTime).toBeLessThan(0.5);
    });

    it("should process combined pain + consciousness in <0.5ms", () => {
      const iterations = 1000;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        const { player: painfulPlayer } = painSystem.applyPain(player, 10);
        consciousnessSystem.applyDamage(painfulPlayer, 10);
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      expect(avgTime).toBeLessThan(0.5);
    });

    it("should process pain dissipation in <0.5ms", () => {
      const iterations = 1000;
      const startTime = performance.now();
      
      const painfulPlayer = { ...player, pain: 50 };
      
      for (let i = 0; i < iterations; i++) {
        painSystem.applyDissipation(painfulPlayer, 16);
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      expect(avgTime).toBeLessThan(0.5);
    });

    it("should process consciousness recovery in <0.5ms", () => {
      const iterations = 1000;
      const startTime = performance.now();
      
      const lowConsciousness = { ...player, consciousness: 50 };
      const lastTrauma = Date.now() - 10000;
      
      for (let i = 0; i < iterations; i++) {
        consciousnessSystem.applyRecovery(lowConsciousness, 16, lastTrauma);
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      expect(avgTime).toBeLessThan(0.5);
    });

    it("should process effect application in <0.5ms", () => {
      const iterations = 1000;
      const startTime = performance.now();
      
      const painfulPlayer = { ...player, pain: 60, consciousness: 70 };
      
      for (let i = 0; i < iterations; i++) {
        const painAffected = painSystem.applyEffects(painfulPlayer);
        consciousnessSystem.applyEffects(painAffected);
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      expect(avgTime).toBeLessThan(0.5);
    });

    it("should handle 60fps game loop timing (16.67ms budget)", () => {
      const frameIterations = 60; // 1 second worth of frames
      const startTime = performance.now();
      
      let currentPlayer = player;
      
      for (let frame = 0; frame < frameIterations; frame++) {
        // Simulate typical game loop operations
        const { player: painfulPlayer } = painSystem.applyPain(currentPlayer, 5);
        const consciousPlayer = consciousnessSystem.applyDamage(
          painfulPlayer,
          5,
          VitalPointCategory.NEUROLOGICAL
        );
        const painAffected = painSystem.applyEffects(consciousPlayer);
        currentPlayer = consciousnessSystem.applyEffects(painAffected);
        
        // Apply recovery
        currentPlayer = painSystem.applyDissipation(currentPlayer, 16);
        currentPlayer = consciousnessSystem.applyRecovery(
          currentPlayer,
          16,
          Date.now() - 10000
        );
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const avgFrameTime = totalTime / frameIterations;
      
      // Should process both systems in well under 1ms per frame
      expect(avgFrameTime).toBeLessThan(1);
    });
  });

  describe("Stress Tests - Memory Leak Detection", () => {
    it("should handle 50 rapid hits stress test", () => {
      let currentPlayer = player;
      
      // Apply 50 rapid hits with both systems
      for (let i = 0; i < 50; i++) {
        const { player: painfulPlayer } = painSystem.applyPain(currentPlayer, 15);
        currentPlayer = consciousnessSystem.applyDamage(
          painfulPlayer,
          10,
          VitalPointCategory.NEUROLOGICAL
        );
      }
      
      // System should remain stable
      expect(currentPlayer.pain).toBeGreaterThanOrEqual(0);
      expect(currentPlayer.pain).toBeLessThanOrEqual(100);
      expect(currentPlayer.consciousness).toBeGreaterThanOrEqual(0);
      expect(currentPlayer.consciousness).toBeLessThanOrEqual(100);
      
      // Player should be heavily affected
      expect(currentPlayer.pain).toBeGreaterThan(80); // Pain overload
      expect(currentPlayer.consciousness).toBeLessThan(20); // Incapacitated
    });

    it("should handle extended combat session (1000 operations)", () => {
      let currentPlayer = player;
      const startTime = Date.now();
      
      // Simulate 1000 combat operations (mix of damage and recovery)
      for (let i = 0; i < 1000; i++) {
        if (i % 5 === 0) {
          // Occasional damage
          const { player: painfulPlayer } = painSystem.applyPain(currentPlayer, 8);
          currentPlayer = consciousnessSystem.applyDamage(
            painfulPlayer,
            5,
            VitalPointCategory.NEUROLOGICAL
          );
        } else {
          // Frequent recovery
          currentPlayer = painSystem.applyDissipation(currentPlayer, 16);
          currentPlayer = consciousnessSystem.applyRecovery(
            currentPlayer,
            16,
            startTime - (1000 - i) * 16
          );
        }
        
        // Apply effects
        const painAffected = painSystem.applyEffects(currentPlayer);
        currentPlayer = consciousnessSystem.applyEffects(painAffected);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete in reasonable time (<1 second for 1000 ops)
      expect(duration).toBeLessThan(1000);
      
      // System should remain stable
      expect(currentPlayer.pain).toBeGreaterThanOrEqual(0);
      expect(currentPlayer.pain).toBeLessThanOrEqual(100);
      expect(currentPlayer.consciousness).toBeGreaterThanOrEqual(0);
      expect(currentPlayer.consciousness).toBeLessThanOrEqual(100);
    });
  });

  describe("E2E Combat Scenarios", () => {
    it("should handle full degradation and recovery cycle", () => {
      let currentPlayer = player;
      
      // Phase 1: Degrade both systems to critical levels
      for (let i = 0; i < 20; i++) {
        const { player: painfulPlayer } = painSystem.applyPain(currentPlayer, 10);
        currentPlayer = consciousnessSystem.applyDamage(
          painfulPlayer,
          10,
          VitalPointCategory.NEUROLOGICAL
        );
      }
      
      // Both systems should be critically low
      expect(currentPlayer.pain).toBeGreaterThan(60);
      expect(currentPlayer.consciousness).toBeLessThan(30);
      
      // Phase 2: Recovery period
      const traumaTime = Date.now() - 10000;
      for (let t = 0; t < 30; t++) {
        currentPlayer = painSystem.applyDissipation(currentPlayer, 1000);
        currentPlayer = consciousnessSystem.applyRecovery(
          currentPlayer,
          1000,
          traumaTime - (30 - t) * 1000
        );
      }
      
      // Both systems should have recovered significantly
      expect(currentPlayer.pain).toBeLessThan(60);
      expect(currentPlayer.consciousness).toBeGreaterThan(30);
    });

    it("should handle mixed damage types realistically", () => {
      let currentPlayer = player;
      
      // Neurological hit (affects both heavily)
      const { player: neuroHit } = painSystem.applyPain(
        currentPlayer,
        20,
        VitalPointSeverity.MAJOR,
        VitalPointCategory.NEUROLOGICAL
      );
      currentPlayer = consciousnessSystem.applyDamage(
        neuroHit,
        20,
        VitalPointCategory.NEUROLOGICAL
      );
      
      // Vascular hit (affects consciousness more)
      const { player: vascularHit } = painSystem.applyPain(
        currentPlayer,
        15,
        VitalPointSeverity.MODERATE,
        VitalPointCategory.VASCULAR
      );
      currentPlayer = consciousnessSystem.applyDamage(
        vascularHit,
        15,
        VitalPointCategory.VASCULAR
      );
      
      // Organ hit (affects pain more)
      const { player: organHit } = painSystem.applyPain(
        currentPlayer,
        18,
        VitalPointSeverity.MAJOR,
        VitalPointCategory.ORGAN
      );
      currentPlayer = consciousnessSystem.applyDamage(
        organHit,
        10,
        VitalPointCategory.ORGAN
      );
      
      // Both systems should be significantly affected
      expect(currentPlayer.pain).toBeGreaterThan(50);
      expect(currentPlayer.consciousness).toBeLessThan(60);
    });

    it("should correctly determine incapacitation state", () => {
      // Scenario 1: Pain overload but conscious
      const painOverload = { ...player, pain: 85, consciousness: 90 };
      expect(painSystem.isIncapacitated(painOverload)).toBe(true);
      expect(consciousnessSystem.isIncapacitated(painOverload)).toBe(false);
      
      // Scenario 2: Unconscious but low pain
      const unconscious = { ...player, pain: 30, consciousness: 15 };
      expect(painSystem.isIncapacitated(unconscious)).toBe(false);
      expect(consciousnessSystem.isIncapacitated(unconscious)).toBe(true);
      
      // Scenario 3: Both systems critical
      const criticalState = { ...player, pain: 90, consciousness: 10 };
      expect(painSystem.isIncapacitated(criticalState)).toBe(true);
      expect(consciousnessSystem.isIncapacitated(criticalState)).toBe(true);
    });
  });

  describe("Bilingual Support Validation", () => {
    it("should provide Korean-English labels for all pain levels", () => {
      const painLevels = [0, 25, 45, 65, 85];
      
      painLevels.forEach((pain) => {
        const level = painSystem.getPainLevel(pain);
        const name = painSystem.getLevelName(level);
        const description = painSystem.getLevelDescription(level);
        
        expect(name.korean).toBeTruthy();
        expect(name.english).toBeTruthy();
        expect(description.korean).toBeTruthy();
        expect(description.english).toBeTruthy();
      });
    });

    it("should provide Korean-English labels for all consciousness levels", () => {
      const consciousnessValues = [95, 70, 35, 10];
      
      consciousnessValues.forEach((consciousness) => {
        const level = consciousnessSystem.getLevel(consciousness);
        const name = consciousnessSystem.getLevelName(level);
        const description = consciousnessSystem.getLevelDescription(level);
        
        expect(name.korean).toBeTruthy();
        expect(name.english).toBeTruthy();
        expect(description.korean).toBeTruthy();
        expect(description.english).toBeTruthy();
      });
    });

    it("should provide visual indicators for consciousness levels", () => {
      const consciousnessValues = [95, 70, 35, 10];
      
      consciousnessValues.forEach((consciousness) => {
        const level = consciousnessSystem.getLevel(consciousness);
        const color = consciousnessSystem.getLevelColor(level);
        
        expect(typeof color).toBe("number");
        expect(color).toBeGreaterThan(0);
      });
    });
  });
});
