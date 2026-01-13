/**
 * Tests for Archetype Behavior Enforcement System
 * 
 * Validates that each of the 5 player archetypes has distinct, immediately
 * recognizable combat behavior patterns enforced through the ArchetypeEnforcer.
 * 
 * @korean 원형 행동 강화 시스템 테스트
 */

import { describe, it, expect } from "vitest";
import {
  ARCHETYPE_ENFORCEMENT,
  enforceArchetypeBehavior,
  getSignatureMove,
  shouldExecuteSignatureMove,
  getActionFrequency,
  isActionProhibited,
} from "./ArchetypeEnforcer";
import { AIActionType, CombatContext } from "./DecisionTree";
import { PlayerArchetype } from "@/types";

/**
 * Create a mock combat context for testing
 */
function createMockContext(overrides: Partial<CombatContext> = {}): CombatContext {
  return {
    playerPosition: { x: 100, y: 100 },
    opponentPosition: { x: 200, y: 200 },
    playerHealth: 100,
    playerMaxHealth: 100,
    playerKi: 100,
    playerMaxKi: 100,
    playerStamina: 100,
    playerMaxStamina: 100,
    opponentHealth: 100,
    opponentStance: 0,
    playerStance: 0,
    distanceToOpponent: 141,
    timeInMatch: 0,
    isOpponentAttacking: false,
    recentDamageTaken: 0,
    opponentBalance: "READY",
    opponentStamina: 100,
    opponentMaxStamina: 100,
    opponentKi: 100,
    opponentMaxKi: 100,
    arenaBounds: { x: 0, y: 0, width: 1200, height: 800 },
    ...overrides,
  };
}

/**
 * Create a mock AI decision for testing
 */
function createMockDecision(
  action: AIActionType,
  priority: number = 5,
  reason: string = "test decision"
) {
  return {
    action,
    priority,
    reason,
  };
}

describe("ArchetypeEnforcer", () => {
  describe("ARCHETYPE_ENFORCEMENT rules", () => {
    it("should define rules for all 5 archetypes", () => {
      expect(ARCHETYPE_ENFORCEMENT[PlayerArchetype.MUSA]).toBeDefined();
      expect(ARCHETYPE_ENFORCEMENT[PlayerArchetype.AMSALJA]).toBeDefined();
      expect(ARCHETYPE_ENFORCEMENT[PlayerArchetype.HACKER]).toBeDefined();
      expect(ARCHETYPE_ENFORCEMENT[PlayerArchetype.JEONGBO_YOWON]).toBeDefined();
      expect(ARCHETYPE_ENFORCEMENT[PlayerArchetype.JOJIK_POKRYEOKBAE]).toBeDefined();
    });

    it("should define signature moves for all archetypes", () => {
      expect(ARCHETYPE_ENFORCEMENT[PlayerArchetype.MUSA].signatureMove).toBe("musa_mountain_breaker");
      expect(ARCHETYPE_ENFORCEMENT[PlayerArchetype.AMSALJA].signatureMove).toBe("amsalja_silent_death");
      expect(ARCHETYPE_ENFORCEMENT[PlayerArchetype.HACKER].signatureMove).toBe("hacker_system_crash");
      expect(ARCHETYPE_ENFORCEMENT[PlayerArchetype.JEONGBO_YOWON].signatureMove).toBe("jeongbo_precision_takedown");
      expect(ARCHETYPE_ENFORCEMENT[PlayerArchetype.JOJIK_POKRYEOKBAE].signatureMove).toBe("jojik_improvised_weapon");
    });

    it("should define action frequencies for all action types", () => {
      Object.values(PlayerArchetype).forEach((archetype) => {
        const rules = ARCHETYPE_ENFORCEMENT[archetype as PlayerArchetype];
        
        // Check that all action types have defined frequencies
        Object.values(AIActionType).forEach((actionType) => {
          expect(rules.actionFrequencies[actionType as AIActionType]).toBeDefined();
          expect(rules.actionFrequencies[actionType as AIActionType]).toBeGreaterThanOrEqual(0);
          expect(rules.actionFrequencies[actionType as AIActionType]).toBeLessThanOrEqual(1);
        });
      });
    });
  });

  describe("Musa (Warrior) - Honor Code Enforcement", () => {
    const archetype = PlayerArchetype.MUSA;

    it("should prohibit feint actions (honor code: no deception)", () => {
      const decision = createMockDecision(AIActionType.FEINT, 5);
      const context = createMockContext();
      
      const enforced = enforceArchetypeBehavior(decision, archetype, context);
      
      // Feint should be replaced with a preferred action
      expect(enforced.action).not.toBe(AIActionType.FEINT);
      expect(ARCHETYPE_ENFORCEMENT[archetype].preferredActions).toContain(enforced.action);
      expect(enforced.reason).toContain("does not use");
    });

    it("should allow attacks and approaches (preferred actions)", () => {
      const attackDecision = createMockDecision(AIActionType.ATTACK, 7);
      const context = createMockContext();
      
      const enforced = enforceArchetypeBehavior(attackDecision, archetype, context);
      
      // Attack should not be modified (it's a preferred action)
      expect(enforced.action).toBe(AIActionType.ATTACK);
      expect(enforced.priority).toBe(7);
    });

    it("should trigger Mountain Breaker signature move when opponent <40% health", () => {
      const decision = createMockDecision(AIActionType.ATTACK, 5);
      const context = createMockContext({
        opponentHealth: 35, // 35% health
        playerMaxHealth: 100,
      });
      
      const enforced = enforceArchetypeBehavior(decision, archetype, context);
      
      // Should override with signature move
      expect(enforced.action).toBe(AIActionType.TECHNIQUE);
      expect(enforced.priority).toBe(10); // Maximum priority
      expect(enforced.reason).toContain("musa_mountain_breaker");
    });

    it("should have high attack frequency (70%) and low retreat frequency (2%)", () => {
      const rules = ARCHETYPE_ENFORCEMENT[archetype];
      
      expect(rules.actionFrequencies[AIActionType.ATTACK]).toBe(0.70);
      expect(rules.actionFrequencies[AIActionType.RETREAT]).toBe(0.02);
      expect(rules.actionFrequencies[AIActionType.FEINT]).toBe(0.00); // Prohibited
    });
  });

  describe("Amsalja (Assassin) - Stealth Tactics", () => {
    const archetype = PlayerArchetype.AMSALJA;

    it("should have no prohibited actions (pragmatic assassin)", () => {
      const rules = ARCHETYPE_ENFORCEMENT[archetype];
      expect(rules.prohibitedActions).toHaveLength(0);
    });

    it("should trigger Silent Death signature move when opponent is VULNERABLE", () => {
      const decision = createMockDecision(AIActionType.ATTACK, 5);
      const context = createMockContext({
        opponentBalance: "VULNERABLE",
      });
      
      const enforced = enforceArchetypeBehavior(decision, archetype, context);
      
      // Should override with signature move
      expect(enforced.action).toBe(AIActionType.TECHNIQUE);
      expect(enforced.priority).toBe(10);
      expect(enforced.reason).toContain("amsalja_silent_death");
    });

    it("should trigger Silent Death when opponent is HELPLESS", () => {
      const decision = createMockDecision(AIActionType.CIRCLE, 4);
      const context = createMockContext({
        opponentBalance: "HELPLESS",
      });
      
      const enforced = enforceArchetypeBehavior(decision, archetype, context);
      
      expect(enforced.action).toBe(AIActionType.TECHNIQUE);
      expect(enforced.reason).toContain("amsalja_silent_death");
    });

    it("should have high technique frequency (60%) and circling (20%)", () => {
      const rules = ARCHETYPE_ENFORCEMENT[archetype];
      
      expect(rules.actionFrequencies[AIActionType.TECHNIQUE]).toBe(0.60);
      expect(rules.actionFrequencies[AIActionType.CIRCLE]).toBe(0.20);
    });
  });

  describe("Hacker (Cyber Warrior) - Analytical Combat", () => {
    const archetype = PlayerArchetype.HACKER;

    it("should trigger System Crash signature move after 20 seconds", () => {
      const decision = createMockDecision(AIActionType.WAIT, 3);
      const context = createMockContext({
        timeInMatch: 20001, // 20.001 seconds
      });
      
      const enforced = enforceArchetypeBehavior(decision, archetype, context);
      
      // Should override with signature move
      expect(enforced.action).toBe(AIActionType.TECHNIQUE);
      expect(enforced.priority).toBe(10);
      expect(enforced.reason).toContain("hacker_system_crash");
    });

    it("should NOT trigger System Crash before 20 seconds", () => {
      const decision = createMockDecision(AIActionType.WAIT, 3);
      const context = createMockContext({
        timeInMatch: 19999, // 19.999 seconds
      });
      
      const enforced = enforceArchetypeBehavior(decision, archetype, context);
      
      // Should not override
      expect(enforced.action).toBe(AIActionType.WAIT);
      expect(enforced.priority).toBe(3);
    });

    it("should have high wait frequency (25%) for observation phase", () => {
      const rules = ARCHETYPE_ENFORCEMENT[archetype];
      
      expect(rules.actionFrequencies[AIActionType.WAIT]).toBe(0.25);
      expect(rules.actionFrequencies[AIActionType.TECHNIQUE]).toBe(0.40);
    });
  });

  describe("Jeongbo Yowon (Intelligence Operative) - Psychological Warfare", () => {
    const archetype = PlayerArchetype.JEONGBO_YOWON;

    it("should trigger Precision Takedown signature move when opponent is HELPLESS", () => {
      const decision = createMockDecision(AIActionType.FEINT, 4);
      const context = createMockContext({
        opponentBalance: "HELPLESS",
      });
      
      const enforced = enforceArchetypeBehavior(decision, archetype, context);
      
      // Should override with signature move
      expect(enforced.action).toBe(AIActionType.TECHNIQUE);
      expect(enforced.priority).toBe(10);
      expect(enforced.reason).toContain("jeongbo_precision_takedown");
    });

    it("should NOT trigger Precision Takedown when opponent is only VULNERABLE", () => {
      const decision = createMockDecision(AIActionType.FEINT, 5);
      const context = createMockContext({
        opponentBalance: "VULNERABLE", // Not HELPLESS
      });
      
      const enforced = enforceArchetypeBehavior(decision, archetype, context);
      
      // Should not override (different from Amsalja who triggers on VULNERABLE)
      expect(enforced.action).toBe(AIActionType.FEINT);
      expect(enforced.priority).toBe(5);
    });

    it("should have high feint frequency (30%) for psychological pressure", () => {
      const rules = ARCHETYPE_ENFORCEMENT[archetype];
      
      expect(rules.actionFrequencies[AIActionType.FEINT]).toBe(0.30);
      expect(rules.actionFrequencies[AIActionType.TECHNIQUE]).toBe(0.35);
      expect(rules.actionFrequencies[AIActionType.COUNTER]).toBe(0.20);
    });
  });

  describe("Jojik Pokryeokbae (Organized Crime) - Chaotic Survival", () => {
    const archetype = PlayerArchetype.JOJIK_POKRYEOKBAE;

    it("should trigger Improvised Weapon signature move when desperate (<30% health)", () => {
      const decision = createMockDecision(AIActionType.ATTACK, 6);
      const context = createMockContext({
        playerHealth: 25, // 25% health (desperate)
        playerMaxHealth: 100,
      });
      
      const enforced = enforceArchetypeBehavior(decision, archetype, context);
      
      // Should override with signature move
      expect(enforced.action).toBe(AIActionType.TECHNIQUE);
      expect(enforced.priority).toBe(10);
      expect(enforced.reason).toContain("jojik_improvised_weapon");
    });

    it("should NOT trigger Improvised Weapon when above 30% health", () => {
      const decision = createMockDecision(AIActionType.ATTACK, 6);
      const context = createMockContext({
        playerHealth: 35, // 35% health (not desperate yet)
        playerMaxHealth: 100,
      });
      
      const enforced = enforceArchetypeBehavior(decision, archetype, context);
      
      // Should not override
      expect(enforced.action).toBe(AIActionType.ATTACK);
      expect(enforced.priority).toBe(6);
    });

    it("should have very high stance change frequency (80%) for unpredictability", () => {
      const rules = ARCHETYPE_ENFORCEMENT[archetype];
      
      expect(rules.actionFrequencies[AIActionType.STANCE_CHANGE]).toBe(0.80);
      expect(rules.actionFrequencies[AIActionType.ATTACK]).toBe(0.50);
    });

    it("should have no prohibited actions (no rules, survival at any cost)", () => {
      const rules = ARCHETYPE_ENFORCEMENT[archetype];
      expect(rules.prohibitedActions).toHaveLength(0);
    });
  });

  describe("Utility Functions", () => {
    it("getSignatureMove() should return correct signature move ID", () => {
      expect(getSignatureMove(PlayerArchetype.MUSA)).toBe("musa_mountain_breaker");
      expect(getSignatureMove(PlayerArchetype.AMSALJA)).toBe("amsalja_silent_death");
      expect(getSignatureMove(PlayerArchetype.HACKER)).toBe("hacker_system_crash");
      expect(getSignatureMove(PlayerArchetype.JEONGBO_YOWON)).toBe("jeongbo_precision_takedown");
      expect(getSignatureMove(PlayerArchetype.JOJIK_POKRYEOKBAE)).toBe("jojik_improvised_weapon");
    });

    it("shouldExecuteSignatureMove() should evaluate signature conditions correctly", () => {
      // Musa: opponent <40% health
      expect(
        shouldExecuteSignatureMove(
          PlayerArchetype.MUSA,
          createMockContext({ opponentHealth: 35, playerMaxHealth: 100 })
        )
      ).toBe(true);
      
      // Amsalja: opponent VULNERABLE
      expect(
        shouldExecuteSignatureMove(
          PlayerArchetype.AMSALJA,
          createMockContext({ opponentBalance: "VULNERABLE" })
        )
      ).toBe(true);
      
      // Hacker: timeInMatch > 20 seconds
      expect(
        shouldExecuteSignatureMove(
          PlayerArchetype.HACKER,
          createMockContext({ timeInMatch: 25000 })
        )
      ).toBe(true);
      
      // Jeongbo: opponent HELPLESS
      expect(
        shouldExecuteSignatureMove(
          PlayerArchetype.JEONGBO_YOWON,
          createMockContext({ opponentBalance: "HELPLESS" })
        )
      ).toBe(true);
      
      // Jojik: player <30% health
      expect(
        shouldExecuteSignatureMove(
          PlayerArchetype.JOJIK_POKRYEOKBAE,
          createMockContext({ playerHealth: 25, playerMaxHealth: 100 })
        )
      ).toBe(true);
    });

    it("getActionFrequency() should return correct frequency for action types", () => {
      // Musa: high attack, low retreat
      expect(getActionFrequency(PlayerArchetype.MUSA, AIActionType.ATTACK)).toBe(0.70);
      expect(getActionFrequency(PlayerArchetype.MUSA, AIActionType.RETREAT)).toBe(0.02);
      
      // Amsalja: high technique, high circle
      expect(getActionFrequency(PlayerArchetype.AMSALJA, AIActionType.TECHNIQUE)).toBe(0.60);
      expect(getActionFrequency(PlayerArchetype.AMSALJA, AIActionType.CIRCLE)).toBe(0.20);
      
      // Jojik: very high stance change
      expect(getActionFrequency(PlayerArchetype.JOJIK_POKRYEOKBAE, AIActionType.STANCE_CHANGE)).toBe(0.80);
    });

    it("isActionProhibited() should identify prohibited actions correctly", () => {
      // Musa prohibits FEINT
      expect(isActionProhibited(PlayerArchetype.MUSA, AIActionType.FEINT)).toBe(true);
      expect(isActionProhibited(PlayerArchetype.MUSA, AIActionType.ATTACK)).toBe(false);
      
      // Amsalja has no prohibitions
      expect(isActionProhibited(PlayerArchetype.AMSALJA, AIActionType.FEINT)).toBe(false);
      expect(isActionProhibited(PlayerArchetype.AMSALJA, AIActionType.RETREAT)).toBe(false);
      
      // Hacker has no prohibitions
      expect(isActionProhibited(PlayerArchetype.HACKER, AIActionType.WAIT)).toBe(false);
    });
  });

  describe("Enforcement Edge Cases", () => {
    it("should handle multiple signature conditions met simultaneously", () => {
      // Amsalja with both HELPLESS opponent AND <30% player health
      const decision = createMockDecision(AIActionType.ATTACK, 5);
      const context = createMockContext({
        opponentBalance: "HELPLESS",
        playerHealth: 25,
        playerMaxHealth: 100,
      });
      
      // Amsalja signature should trigger (HELPLESS condition)
      const amsaljaEnforced = enforceArchetypeBehavior(
        decision,
        PlayerArchetype.AMSALJA,
        context
      );
      expect(amsaljaEnforced.reason).toContain("amsalja_silent_death");
      
      // Jojik signature should NOT trigger (different archetype)
      const jojikEnforced = enforceArchetypeBehavior(
        decision,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
        context
      );
      // Jojik cares about player health, not opponent balance
      expect(jojikEnforced.reason).toContain("jojik_improvised_weapon");
    });

    it("should preserve original decision when no enforcement needed", () => {
      const originalDecision = createMockDecision(AIActionType.CIRCLE, 6, "tactical positioning");
      const context = createMockContext();
      
      const enforced = enforceArchetypeBehavior(
        originalDecision,
        PlayerArchetype.JEONGBO_YOWON,
        context
      );
      
      // Should return identical decision
      expect(enforced.action).toBe(originalDecision.action);
      expect(enforced.priority).toBe(originalDecision.priority);
      expect(enforced.reason).toBe(originalDecision.reason);
    });

    it("should handle boundary conditions for signature move triggers", () => {
      // Musa: exactly 40% health (should NOT trigger)
      const musaDecision = createMockDecision(AIActionType.ATTACK, 5);
      const musaContext = createMockContext({
        opponentHealth: 40,
        playerMaxHealth: 100,
      });
      
      const musaEnforced = enforceArchetypeBehavior(
        musaDecision,
        PlayerArchetype.MUSA,
        musaContext
      );
      
      // < 0.40 means strictly less than 40%, so 40% should NOT trigger
      expect(musaEnforced.action).toBe(AIActionType.ATTACK);
      
      // Jojik: exactly 30% health (should NOT trigger)
      const jojikDecision = createMockDecision(AIActionType.TECHNIQUE, 5);
      const jojikContext = createMockContext({
        playerHealth: 30,
        playerMaxHealth: 100,
      });
      
      const jojikEnforced = enforceArchetypeBehavior(
        jojikDecision,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
        jojikContext
      );
      
      // < 0.30 means strictly less than 30%, so 30% should NOT trigger
      expect(jojikEnforced.action).toBe(AIActionType.TECHNIQUE);
    });
  });

  describe("Archetype Distinctiveness", () => {
    it("each archetype should have unique signature move", () => {
      const signatureMoves = Object.values(PlayerArchetype).map((archetype) =>
        getSignatureMove(archetype as PlayerArchetype)
      );
      
      // All signature moves should be unique
      const uniqueMoves = new Set(signatureMoves);
      expect(uniqueMoves.size).toBe(signatureMoves.length);
    });

    it("each archetype should have at least one action with >30% frequency", () => {
      const archetypes = Object.values(PlayerArchetype) as PlayerArchetype[];
      
      archetypes.forEach((archetype) => {
        const rules = ARCHETYPE_ENFORCEMENT[archetype];
        
        // Should have at least one preferred action
        expect(rules.preferredActions.length).toBeGreaterThan(0);
        
        // Should have at least one action with frequency > 30% (distinct behavior)
        // This ensures each archetype has a signature behavioral pattern
        const frequencies = Object.values(rules.actionFrequencies);
        const highFrequencies = frequencies.filter((freq) => freq >= 0.30);
        expect(highFrequencies.length).toBeGreaterThan(0);
      });
    });

    it("Musa should be the ONLY archetype with prohibited FEINT", () => {
      const archetypesWithFeintProhibition = Object.values(PlayerArchetype).filter(
        (archetype) =>
          ARCHETYPE_ENFORCEMENT[archetype as PlayerArchetype].prohibitedActions.includes(
            AIActionType.FEINT
          )
      );
      
      expect(archetypesWithFeintProhibition).toHaveLength(1);
      expect(archetypesWithFeintProhibition[0]).toBe(PlayerArchetype.MUSA);
    });

    it("Jojik should have the HIGHEST stance change frequency", () => {
      const archetypes = Object.values(PlayerArchetype) as PlayerArchetype[];
      
      const stanceChangeFrequencies = archetypes.map((archetype) => ({
        archetype,
        frequency: getActionFrequency(archetype, AIActionType.STANCE_CHANGE),
      }));
      
      // Sort by frequency descending
      stanceChangeFrequencies.sort((a, b) => b.frequency - a.frequency);
      
      // Jojik should be first (highest)
      expect(stanceChangeFrequencies[0].archetype).toBe(PlayerArchetype.JOJIK_POKRYEOKBAE);
      expect(stanceChangeFrequencies[0].frequency).toBe(0.80);
    });

    it("Hacker should have the HIGHEST wait/observation frequency", () => {
      const archetypes = Object.values(PlayerArchetype) as PlayerArchetype[];
      
      const waitFrequencies = archetypes.map((archetype) => ({
        archetype,
        frequency: getActionFrequency(archetype, AIActionType.WAIT),
      }));
      
      // Sort by frequency descending
      waitFrequencies.sort((a, b) => b.frequency - a.frequency);
      
      // Hacker should be first (highest wait time for data collection)
      expect(waitFrequencies[0].archetype).toBe(PlayerArchetype.HACKER);
      expect(waitFrequencies[0].frequency).toBe(0.25);
    });
  });
});
