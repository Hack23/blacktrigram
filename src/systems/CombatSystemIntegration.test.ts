/**
 * Integration tests for Combat System with Pain Response and Consciousness.
 * 
 * Tests the integration of pain and consciousness systems with the combat system.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { PlayerArchetype } from "@/types";
import { createPlayerFromArchetype } from "@/utils/playerUtils";
import type { PlayerState } from "./player";
import CombatSystem from "./CombatSystem";
import { CombatResult } from "./combat/types";

describe("CombatSystem Integration with Pain & Consciousness", () => {
  let combatSystem: CombatSystem;
  let player1: PlayerState;
  let player2: PlayerState;

  beforeEach(() => {
    combatSystem = new CombatSystem();
    player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);
  });

  describe("Pain Integration", () => {
    it("should apply pain when damage is dealt", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 20,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: player1,
        defender: player2,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      const { updatedDefender } = combatSystem.applyCombatResult(
        mockResult,
        player1,
        player2
      );

      expect(updatedDefender.pain).toBeGreaterThan(player2.pain);
    });

    it("should trigger shock pain on significant damage", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 30, // Significant damage
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: player1,
        defender: player2,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      const { updatedDefender: defender1 } = combatSystem.applyCombatResult(
        mockResult,
        player1,
        player2
      );

      // Pain should be applied
      expect(defender1.pain).toBeGreaterThan(0);

      // Stats should be reduced due to pain effects
      expect(defender1.attackPower).toBeLessThanOrEqual(player2.attackPower);
    });

    it("should accumulate pain over multiple hits", () => {
      let currentDefender = player2;

      for (let i = 0; i < 3; i++) {
        const mockResult: CombatResult = {
          hit: true,
          damage: 15,
          criticalHit: false,
          vitalPointHit: false,
          effects: [],
          timestamp: Date.now(),
          technique: {} as any,
          attacker: player1,
          defender: currentDefender,
          success: true,
          isCritical: false,
          isBlocked: false,
        };

        const { updatedDefender } = combatSystem.applyCombatResult(
          mockResult,
          player1,
          currentDefender
        );
        currentDefender = updatedDefender;
      }

      expect(currentDefender.pain).toBeGreaterThan(player2.pain);
    });

    it("should apply pain overload stun at high pain", () => {
      // Start with high pain
      const highPainPlayer = { ...player2, pain: 85 };

      const mockResult: CombatResult = {
        hit: true,
        damage: 20,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: player1,
        defender: highPainPlayer,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      // Test multiple times due to probabilistic stun
      let stunOccurred = false;
      for (let i = 0; i < 20; i++) {
        const { updatedDefender } = combatSystem.applyCombatResult(
          mockResult,
          player1,
          highPainPlayer
        );

        if (updatedDefender.isStunned) {
          stunOccurred = true;
          break;
        }
      }

      // With 30% chance over 20 attempts, should stun at least once
      expect(stunOccurred).toBe(true);
    });
  });

  describe("Consciousness Integration", () => {
    it("should apply consciousness damage for head trauma", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 30, // High damage to trigger head trauma
        criticalHit: false,
        vitalPointHit: true,
        effects: [
          {
            id: "neuro-effect",
            type: "weakened",
            intensity: "moderate" as any,
            duration: 2000,
            description: { korean: "신경 타격", english: "Nerve strike" },
            stackable: false,
            source: "neurological_strike",
            startTime: Date.now(),
            endTime: Date.now() + 2000,
          },
        ],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: player1,
        defender: player2,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      const { updatedDefender } = combatSystem.applyCombatResult(
        mockResult,
        player1,
        player2
      );

      expect(updatedDefender.consciousness).toBeLessThan(player2.consciousness);
    });

    it("should trigger incapacitation at low consciousness", () => {
      // Start with low consciousness
      const lowConsciousnessPlayer = { ...player2, consciousness: 15 };

      const mockResult: CombatResult = {
        hit: true,
        damage: 30,
        criticalHit: false,
        vitalPointHit: true,
        effects: [
          {
            id: "neuro-effect",
            type: "weakened",
            intensity: "moderate" as any,
            duration: 2000,
            description: { korean: "신경 타격", english: "Nerve strike" },
            stackable: false,
            source: "neurological_strike",
            startTime: Date.now(),
            endTime: Date.now() + 2000,
          },
        ],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: player1,
        defender: lowConsciousnessPlayer,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      const { updatedDefender } = combatSystem.applyCombatResult(
        mockResult,
        player1,
        lowConsciousnessPlayer
      );

      // Should be incapacitated (stunned)
      expect(updatedDefender.isStunned).toBe(true);
    });

    it("should reduce stats based on consciousness level", () => {
      // Start with disoriented consciousness level
      const disorientedPlayer = { ...player2, consciousness: 70 };

      const mockResult: CombatResult = {
        hit: true,
        damage: 5, // Small damage to trigger effects without major changes
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: player1,
        defender: disorientedPlayer,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      const { updatedDefender } = combatSystem.applyCombatResult(
        mockResult,
        player1,
        disorientedPlayer
      );

      // Stats should be reduced due to consciousness effects
      expect(updatedDefender.attackPower).toBeLessThan(disorientedPlayer.attackPower);
      expect(updatedDefender.defense).toBeLessThan(disorientedPlayer.defense);
    });
  });

  describe("Recovery System", () => {
    it("should recover pain over time", () => {
      // Start with pain
      const painfulPlayer = { ...player2, pain: 50 };

      // Apply recovery for 1 second
      const recovered = combatSystem.applyRecovery(painfulPlayer, 1000);

      expect(recovered.pain).toBeLessThan(painfulPlayer.pain);
      // Should reduce by approximately 5 points
      expect(Math.abs(recovered.pain - 45)).toBeLessThan(1);
    });

    it("should recover consciousness after 5 seconds without head trauma", () => {
      // Start with reduced consciousness
      const lowConsciousnessPlayer = { ...player2, consciousness: 70 };

      // Apply recovery with old trauma time (>5 seconds ago)
      const recovered = combatSystem.applyRecovery(lowConsciousnessPlayer, 1000);

      expect(recovered.consciousness).toBeGreaterThan(lowConsciousnessPlayer.consciousness);
    });

    it("should not recover consciousness immediately after head trauma", () => {
      // Apply head trauma first
      const mockResult: CombatResult = {
        hit: true,
        damage: 30,
        criticalHit: false,
        vitalPointHit: true,
        effects: [
          {
            id: "neuro-effect",
            type: "weakened",
            intensity: "moderate" as any,
            duration: 2000,
            description: { korean: "신경 타격", english: "Nerve strike" },
            stackable: false,
            source: "neurological_strike",
            startTime: Date.now(),
            endTime: Date.now() + 2000,
          },
        ],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: player1,
        defender: player2,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      const { updatedDefender } = combatSystem.applyCombatResult(
        mockResult,
        player1,
        player2
      );

      const initialConsciousness = updatedDefender.consciousness;

      // Try to recover immediately (should not work)
      const attempted = combatSystem.applyRecovery(updatedDefender, 1000);

      expect(attempted.consciousness).toBe(initialConsciousness);
    });
  });

  describe("Combined Pain and Consciousness Effects", () => {
    it("should apply both pain and consciousness penalties", () => {
      // Start with moderate pain and consciousness issues
      const impairedPlayer = {
        ...player2,
        pain: 50,
        consciousness: 60,
        attackPower: 100,
        defense: 100,
        technique: 100,
      };

      const mockResult: CombatResult = {
        hit: true,
        damage: 5,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: player1,
        defender: impairedPlayer,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      const { updatedDefender } = combatSystem.applyCombatResult(
        mockResult,
        player1,
        impairedPlayer
      );

      // Both systems should reduce stats
      expect(updatedDefender.attackPower).toBeLessThan(100);
      expect(updatedDefender.defense).toBeLessThan(100);
      expect(updatedDefender.technique).toBeLessThan(100);
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero damage hits", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 0,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: player1,
        defender: player2,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      const { updatedDefender } = combatSystem.applyCombatResult(
        mockResult,
        player1,
        player2
      );

      // Pain and consciousness should not change
      expect(updatedDefender.pain).toBe(player2.pain);
      expect(updatedDefender.consciousness).toBe(player2.consciousness);
    });

    it("should handle missed attacks", () => {
      const mockResult: CombatResult = {
        hit: false,
        damage: 0,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: player1,
        defender: player2,
        success: false,
        isCritical: false,
        isBlocked: false,
      };

      const { updatedDefender } = combatSystem.applyCombatResult(
        mockResult,
        player1,
        player2
      );

      // No changes to pain or consciousness
      expect(updatedDefender.pain).toBe(player2.pain);
      expect(updatedDefender.consciousness).toBe(player2.consciousness);
    });
  });
});
