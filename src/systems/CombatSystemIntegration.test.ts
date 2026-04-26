/**
 * Integration tests for Combat System with Pain Response and Consciousness.
 * 
 * Tests the integration of pain and consciousness systems with the combat system.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PlayerArchetype, DamageType } from "@/types";
import { createPlayerFromArchetype } from "@/utils/playerUtils";
import type { PlayerState } from "./player";
import CombatSystem from "./CombatSystem";
import { CombatResult } from "./combat/types";
import { playerInjuryManager } from "./bodypart";

describe("CombatSystem Integration with Pain & Consciousness", () => {
  let combatSystem: CombatSystem;
  let player1: PlayerState;
  let player2: PlayerState;

  beforeEach(() => {
    combatSystem = new CombatSystem();
    player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);
    // Clear all player injuries between tests to prevent leakage
    playerInjuryManager.clearAll();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
      const overloadStunRoll = 0.29;
      const mockRandom = vi.spyOn(Math, "random").mockReturnValue(overloadStunRoll);

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

      const { updatedDefender } = combatSystem.applyCombatResult(
        mockResult,
        player1,
        highPainPlayer
      );

      expect(mockRandom).toHaveBeenCalled();
      expect(updatedDefender.pain).toBeGreaterThanOrEqual(80);
      expect(updatedDefender.isStunned).toBe(true);
    });

    it("should not apply pain overload stun when roll exceeds stun chance", () => {
      const highPainPlayer = { ...player2, pain: 85 };
      const nonStunRoll = 0.99;
      vi.spyOn(Math, "random").mockReturnValue(nonStunRoll);

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

      const { updatedDefender } = combatSystem.applyCombatResult(
        mockResult,
        player1,
        highPainPlayer
      );

      expect(updatedDefender.pain).toBeGreaterThanOrEqual(80);
      expect(updatedDefender.isStunned).toBe(false);
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

  describe("Injury Tracking Integration (외상 시각화)", () => {
    it("should record injuries when damage is applied with technique", () => {
      // Clear any existing injuries for the defender
      playerInjuryManager.clearPlayerInjuries(player2.id);
      
      const mockResult: CombatResult = {
        hit: true,
        damage: 35, // Above threshold for blood effects
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {
          id: "test_technique",
          name: { korean: "타격", english: "Strike", romanized: "Tagyeok" },
          damageType: DamageType.BLUNT,
        } as any as CombatResult["technique"],
        attacker: player1,
        defender: player2,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      combatSystem.applyCombatResult(mockResult, player1, player2);

      // Verify injury was recorded for the defender
      const defenderIntegration = playerInjuryManager.getIntegrationForPlayer(player2.id);
      const injuries = defenderIntegration.getInjuries();
      expect(injuries.length).toBeGreaterThan(0);
      expect(injuries[0].severity).toBe(35);
      
      // Verify blood effect would be triggered
      expect(defenderIntegration.shouldShowBloodEffect(35)).toBe(true);
    });

    it("should accumulate injuries on repeated hits", () => {
      playerInjuryManager.clearPlayerInjuries(player2.id);
      
      // Mock Math.random to ensure injuries at the same location merge
      const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.5);

      const mockResult: CombatResult = {
        hit: true,
        damage: 25,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {
          id: "test_punch",
          name: { korean: "펀치", english: "Punch", romanized: "Peonchi" },
          damageType: DamageType.IMPACT,
        } as any as CombatResult["technique"],
        attacker: player1,
        defender: player2,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      // Apply same attack 3 times
      for (let i = 0; i < 3; i++) {
        combatSystem.applyCombatResult(mockResult, player1, player2);
      }

      const defenderIntegration = playerInjuryManager.getIntegrationForPlayer(player2.id);
      const injuries = defenderIntegration.getInjuries();
      
      // Should have cumulative injuries recorded
      expect(injuries.length).toBeGreaterThan(0);
      
      // First injury should have increased severity from multiple hits
      const firstInjury = injuries[0];
      expect(firstInjury.severity).toBeGreaterThan(25);
      expect(firstInjury.hitCount).toBeGreaterThan(1);
      
      // Clean up mock
      mockRandom.mockRestore();
    });

    it("should not record injuries when attack misses", () => {
      playerInjuryManager.clearPlayerInjuries(player2.id);

      const mockResult: CombatResult = {
        hit: false, // Miss
        damage: 0,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {
          id: "test_kick",
          name: { korean: "킥", english: "Kick", romanized: "Kik" },
          damageType: DamageType.BLUNT,
        } as any as CombatResult["technique"],
        attacker: player1,
        defender: player2,
        success: false,
        isCritical: false,
        isBlocked: false,
      };

      combatSystem.applyCombatResult(mockResult, player1, player2);

      // Should not record any injury for a miss
      const defenderIntegration = playerInjuryManager.getIntegrationForPlayer(player2.id);
      const injuries = defenderIntegration.getInjuries();
      expect(injuries.length).toBe(0);
    });
  });
});
