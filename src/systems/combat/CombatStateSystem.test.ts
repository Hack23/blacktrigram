/**
 * Unit tests for Combat State System.
 * 
 * Tests state determination, capability modifiers, and state transitions
 * based on health, pain, consciousness, and balance.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { CombatStateSystem, CombatReadinessState } from "./CombatStateSystem";
import { PlayerState } from "../player";
import { PlayerArchetype, TrigramStance, CombatState } from "@/types";

describe("CombatStateSystem", () => {
  let system: CombatStateSystem;
  let basePlayer: PlayerState;

  beforeEach(() => {
    system = new CombatStateSystem();

    basePlayer = {
      id: "test-player",
      name: { korean: "테스트", english: "Test" },
      archetype: PlayerArchetype.MUSA,

      // Resources
      health: 100,
      maxHealth: 100,
      ki: 100,
      maxKi: 100,
      stamina: 100,
      maxStamina: 100,
      energy: 100,
      maxEnergy: 100,

      // Attributes
      attackPower: 15,
      defense: 12,
      speed: 10,
      technique: 14,
      pain: 0,
      consciousness: 100,
      balance: 100,
      momentum: 0,

      // Combat state
      currentStance: TrigramStance.GEON,
      combatState: CombatState.IDLE,
      position: { x: 0, y: 0 },
      isBlocking: false,
      isStunned: false,
      isCountering: false,
      isInvulnerable: false,

      // Timing
      lastActionTime: 0,
      recoveryTime: 500,

      // Status effects
      statusEffects: [],

      // Statistics
      hitsLanded: 0,
      hitsTaken: 0,
      totalDamageDealt: 0,
      totalDamageReceived: 0,
      perfectBlocks: 0,
      consecutiveHits: 0,

      // Match state
      matchesWon: 0,
      matchesLost: 0,
      currentWinStreak: 0,
    };
  });

  describe("State Determination", () => {
    it("should return READY state for healthy player", () => {
      const state = system.determineState(basePlayer, Date.now());
      expect(state).toBe(CombatReadinessState.READY);
    });

    it("should return SHAKEN state when health drops to 70%", () => {
      const player = { ...basePlayer, health: 70 };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.SHAKEN);
    });

    it("should return VULNERABLE state when health drops to 50%", () => {
      const player = { ...basePlayer, health: 50 };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should return HELPLESS state when health drops to 30%", () => {
      const player = { ...basePlayer, health: 30 };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.HELPLESS);
    });

    it("should return SHAKEN state when pain reaches 30", () => {
      const player = { ...basePlayer, pain: 35 }; // Above 30 threshold
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.SHAKEN);
    });

    it("should return VULNERABLE state when pain reaches 60", () => {
      const player = { ...basePlayer, pain: 65 }; // Above 60 threshold
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should return HELPLESS state when pain reaches 80", () => {
      const player = { ...basePlayer, pain: 85 }; // Above 80 threshold
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.HELPLESS);
    });

    it("should return SHAKEN state when consciousness drops to 60", () => {
      const player = { ...basePlayer, consciousness: 60 };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.SHAKEN);
    });

    it("should return VULNERABLE state when consciousness drops to 40", () => {
      const player = { ...basePlayer, consciousness: 40 };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should return HELPLESS state when consciousness drops to 15", () => {
      const player = { ...basePlayer, consciousness: 15 };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.HELPLESS);
    });

    it("should return SHAKEN state when balance drops to 60", () => {
      const player = { ...basePlayer, balance: 60 };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.SHAKEN);
    });

    it("should return VULNERABLE state when balance drops to 40", () => {
      const player = { ...basePlayer, balance: 40 };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should return HELPLESS state when balance drops to 15", () => {
      const player = { ...basePlayer, balance: 15 };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.HELPLESS);
    });

    it("should use worst-case state when multiple factors are degraded", () => {
      const player = {
        ...basePlayer,
        health: 70, // SHAKEN
        pain: 65, // VULNERABLE
      };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should return HELPLESS when any factor is critical", () => {
      const player = {
        ...basePlayer,
        health: 90, // READY
        pain: 85, // HELPLESS
      };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.HELPLESS);
    });

    it("should return SHAKEN state after taking 2 hits", () => {
      const currentTime = Date.now();
      const player = {
        ...basePlayer,
        recentHitTimestamps: [currentTime - 2000, currentTime - 1000],
      };
      const state = system.determineState(player, currentTime);
      expect(state).toBe(CombatReadinessState.SHAKEN);
    });

    it("should return VULNERABLE state after taking 4 hits", () => {
      const currentTime = Date.now();
      const player = {
        ...basePlayer,
        recentHitTimestamps: [
          currentTime - 5000,
          currentTime - 3000,
          currentTime - 2000,
          currentTime - 1000,
        ],
      };
      const state = system.determineState(player, currentTime);
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should not count hits older than 10 seconds", () => {
      const currentTime = Date.now();
      const player = {
        ...basePlayer,
        recentHitTimestamps: [
          currentTime - 15000, // Too old
          currentTime - 12000, // Too old
        ],
      };
      const state = system.determineState(player, currentTime);
      expect(state).toBe(CombatReadinessState.READY);
    });

    it("should return HELPLESS when head health drops below 50%", () => {
      const player = {
        ...basePlayer,
        bodyPartHealth: {
          head: 40,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.HELPLESS);
    });

    it("should return VULNERABLE when any body part loses 30% health", () => {
      const player = {
        ...basePlayer,
        bodyPartHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 60, // 40% health loss
          legRight: 100,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should not return VULNERABLE when body part health loss is below 30%", () => {
      const player = {
        ...basePlayer,
        bodyPartHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 80, // Only 20% health loss
          legRight: 100,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      };
      const state = system.determineState(player, Date.now());
      expect(state).toBe(CombatReadinessState.READY);
    });
  });

  describe("Capability Modifiers", () => {
    it("should return 100% capability for READY state", () => {
      const capability = system.getCapability(CombatReadinessState.READY);
      expect(capability.capability).toBe(1.0);
      expect(capability.accuracyModifier).toBe(1.0);
      expect(capability.defenseModifier).toBe(1.0);
      expect(capability.speedModifier).toBe(1.0);
      expect(capability.canBlock).toBe(true);
      expect(capability.canExecuteTechniques).toBe(true);
    });

    it("should return 85% capability for SHAKEN state", () => {
      const capability = system.getCapability(CombatReadinessState.SHAKEN);
      expect(capability.capability).toBe(0.85);
      expect(capability.accuracyModifier).toBe(0.85);
      expect(capability.canBlock).toBe(true);
      expect(capability.canExecuteTechniques).toBe(true);
    });

    it("should return 70% capability for VULNERABLE state", () => {
      const capability = system.getCapability(CombatReadinessState.VULNERABLE);
      expect(capability.capability).toBe(0.7);
      expect(capability.defenseModifier).toBe(0.75);
      expect(capability.canBlock).toBe(true);
      expect(capability.canExecuteTechniques).toBe(true);
    });

    it("should return 0% capability for HELPLESS state", () => {
      const capability = system.getCapability(CombatReadinessState.HELPLESS);
      expect(capability.capability).toBe(0.0);
      expect(capability.canBlock).toBe(false);
      expect(capability.canExecuteTechniques).toBe(false);
    });
  });

  describe("State Modifier Application", () => {
    it("should not modify player stats in READY state", () => {
      const modified = system.applyStateModifiers(
        basePlayer,
        CombatReadinessState.READY
      );
      expect(modified.attackPower).toBe(basePlayer.attackPower);
      expect(modified.defense).toBe(basePlayer.defense);
      expect(modified.speed).toBe(basePlayer.speed);
    });

    it("should reduce attack power by 10% in SHAKEN state", () => {
      const modified = system.applyStateModifiers(
        basePlayer,
        CombatReadinessState.SHAKEN
      );
      expect(modified.attackPower).toBe(Math.floor(15 * 0.9)); // 13 (-10% from damageModifier)
    });

    it("should reduce defense by 25% in VULNERABLE state", () => {
      const modified = system.applyStateModifiers(
        basePlayer,
        CombatReadinessState.VULNERABLE
      );
      expect(modified.defense).toBe(Math.floor(12 * 0.75)); // 9 (75% of 12)
    });

    it("should disable blocking in HELPLESS state", () => {
      const blockingPlayer = { ...basePlayer, isBlocking: true };
      const modified = system.applyStateModifiers(
        blockingPlayer,
        CombatReadinessState.HELPLESS
      );
      expect(modified.isBlocking).toBe(false);
    });

    it("should stun player in HELPLESS state", () => {
      const modified = system.applyStateModifiers(
        basePlayer,
        CombatReadinessState.HELPLESS
      );
      expect(modified.isStunned).toBe(true);
    });
  });

  describe("State Names and Display", () => {
    it("should return correct Korean and English names for READY", () => {
      const name = system.getStateName(CombatReadinessState.READY);
      expect(name.korean).toBe("준비완료");
      expect(name.english).toBe("Ready");
    });

    it("should return correct Korean and English names for SHAKEN", () => {
      const name = system.getStateName(CombatReadinessState.SHAKEN);
      expect(name.korean).toBe("동요상태");
      expect(name.english).toBe("Shaken");
    });

    it("should return correct Korean and English names for VULNERABLE", () => {
      const name = system.getStateName(CombatReadinessState.VULNERABLE);
      expect(name.korean).toBe("취약상태");
      expect(name.english).toBe("Vulnerable");
    });

    it("should return correct Korean and English names for HELPLESS", () => {
      const name = system.getStateName(CombatReadinessState.HELPLESS);
      expect(name.korean).toBe("무력상태");
      expect(name.english).toBe("Helpless");
    });

    it("should return correct emoji for each state", () => {
      expect(system.getStateEmoji(CombatReadinessState.READY)).toBe("🟢");
      expect(system.getStateEmoji(CombatReadinessState.SHAKEN)).toBe("🟡");
      expect(system.getStateEmoji(CombatReadinessState.VULNERABLE)).toBe("🟠");
      expect(system.getStateEmoji(CombatReadinessState.HELPLESS)).toBe("🔴");
    });
  });

  describe("Integration Scenarios", () => {
    it("should handle progressive damage degradation", () => {
      let player = { ...basePlayer };
      
      // Full health - READY
      expect(system.determineState(player)).toBe(CombatReadinessState.READY);
      
      // Take damage - SHAKEN
      player = { ...player, health: 70 };
      expect(system.determineState(player)).toBe(CombatReadinessState.SHAKEN);
      
      // More damage - VULNERABLE
      player = { ...player, health: 50 };
      expect(system.determineState(player)).toBe(CombatReadinessState.VULNERABLE);
      
      // Critical damage - HELPLESS
      player = { ...player, health: 30 };
      expect(system.determineState(player)).toBe(CombatReadinessState.HELPLESS);
    });

    it("should handle pain accumulation", () => {
      let player = { ...basePlayer };
      
      // No pain - READY
      expect(system.determineState(player, Date.now())).toBe(CombatReadinessState.READY);
      
      // Light pain - SHAKEN
      player = { ...player, pain: 35 };
      expect(system.determineState(player, Date.now())).toBe(CombatReadinessState.SHAKEN);
      
      // Moderate pain - VULNERABLE
      player = { ...player, pain: 65 };
      expect(system.determineState(player, Date.now())).toBe(CombatReadinessState.VULNERABLE);
      
      // Severe pain - HELPLESS
      player = { ...player, pain: 85 };
      expect(system.determineState(player, Date.now())).toBe(CombatReadinessState.HELPLESS);
    });

    it("should apply cascading modifiers correctly", () => {
      const vulnerablePlayer = { ...basePlayer, health: 50 };
      const state = system.determineState(vulnerablePlayer);
      const modified = system.applyStateModifiers(vulnerablePlayer, state);
      
      expect(state).toBe(CombatReadinessState.VULNERABLE);
      expect(modified.attackPower).toBeLessThan(basePlayer.attackPower);
      expect(modified.defense).toBeLessThan(basePlayer.defense);
      expect(modified.speed).toBeLessThan(basePlayer.speed);
    });
  });

  describe("Hit Tracking", () => {
    it("should record hit with timestamp", () => {
      const currentTime = Date.now();
      const updated = system.recordHit(basePlayer, currentTime);
      
      expect(updated.recentHitTimestamps).toContain(currentTime);
      expect(updated.hitsTaken).toBe(basePlayer.hitsTaken + 1);
    });

    it("should maintain only last 10 hit timestamps", () => {
      const currentTime = Date.now();
      const player = {
        ...basePlayer,
        recentHitTimestamps: [
          currentTime - 10000,
          currentTime - 9000,
          currentTime - 8000,
          currentTime - 7000,
          currentTime - 6000,
          currentTime - 5000,
          currentTime - 4000,
          currentTime - 3000,
          currentTime - 2000,
          currentTime - 1000,
        ],
      };

      const updated = system.recordHit(player, currentTime);
      expect(updated.recentHitTimestamps?.length).toBe(10);
      expect(updated.recentHitTimestamps?.[0]).toBe(currentTime - 9000);
      expect(updated.recentHitTimestamps?.[9]).toBe(currentTime);
    });
  });

  describe("Helpless State Recovery", () => {
    it("should record timestamp when entering helpless state", () => {
      const currentTime = Date.now();
      const updated = system.enterHelplessState(basePlayer, currentTime);
      
      expect(updated.lastHelplessStateTime).toBe(currentTime);
    });

    it("should allow recovery after 5 seconds with no hits", () => {
      const currentTime = Date.now();
      const player = {
        ...basePlayer,
        lastHelplessStateTime: currentTime - 6000, // 6 seconds ago
        recentHitTimestamps: [],
      };

      const canRecover = system.canRecoverFromHelpless(player, currentTime);
      expect(canRecover).toBe(true);
    });

    it("should not allow recovery if less than 5 seconds passed", () => {
      const currentTime = Date.now();
      const player = {
        ...basePlayer,
        lastHelplessStateTime: currentTime - 3000, // 3 seconds ago
        recentHitTimestamps: [],
      };

      const canRecover = system.canRecoverFromHelpless(player, currentTime);
      expect(canRecover).toBe(false);
    });

    it("should not allow recovery if player took recent hits", () => {
      const currentTime = Date.now();
      const player = {
        ...basePlayer,
        lastHelplessStateTime: currentTime - 6000, // 6 seconds ago
        recentHitTimestamps: [currentTime - 2000], // Hit 2 seconds ago
      };

      const canRecover = system.canRecoverFromHelpless(player, currentTime);
      expect(canRecover).toBe(false);
    });

    it("should not allow recovery if never entered helpless state", () => {
      const currentTime = Date.now();
      const player = {
        ...basePlayer,
        lastHelplessStateTime: undefined,
      };

      const canRecover = system.canRecoverFromHelpless(player, currentTime);
      expect(canRecover).toBe(false);
    });

    it("should recover from HELPLESS to READY after 5 seconds with no hits", () => {
      const currentTime = Date.now();
      const player = {
        ...basePlayer,
        health: 100, // Restored health
        pain: 0, // No pain
        consciousness: 100, // Full consciousness
        balance: 100, // Restored balance
        lastHelplessStateTime: currentTime - 6000, // 6 seconds ago
        recentHitTimestamps: [], // No recent hits
      };

      const state = system.determineState(player, currentTime);
      expect(state).toBe(CombatReadinessState.READY);
    });

    it("should recover from HELPLESS even with low health after 5 seconds with no hits", () => {
      const currentTime = Date.now();
      const player = {
        ...basePlayer,
        health: 35, // Still low but above critical threshold
        pain: 50, // Moderate pain
        consciousness: 60, // Reduced consciousness
        balance: 60, // Reduced balance
        lastHelplessStateTime: currentTime - 6000, // 6 seconds ago
        recentHitTimestamps: [], // No recent hits
      };

      const state = system.determineState(player, currentTime);
      // Should recover to SHAKEN or VULNERABLE based on stats, not remain HELPLESS
      expect(state).not.toBe(CombatReadinessState.HELPLESS);
      expect([CombatReadinessState.SHAKEN, CombatReadinessState.VULNERABLE]).toContain(state);
    });

    it("should not recover from HELPLESS if still taking hits", () => {
      const currentTime = Date.now();
      const player = {
        ...basePlayer,
        health: 40, // Above critical
        pain: 50,
        lastHelplessStateTime: currentTime - 6000, // 6 seconds ago
        recentHitTimestamps: [currentTime - 2000], // Recent hit
      };

      const state = system.determineState(player, currentTime);
      // With recent hits, recovery is interrupted
      expect(state).toBe(CombatReadinessState.VULNERABLE); // Based on stats, not helpless but not fully recovered
    });
  });

  describe("Capability Modifiers - Damage Taken", () => {
    it("should have 1.0x damage taken multiplier in READY state", () => {
      const capability = system.getCapability(CombatReadinessState.READY);
      expect(capability.damageTakenMultiplier).toBe(1.0);
    });

    it("should have 1.0x damage taken multiplier in SHAKEN state", () => {
      const capability = system.getCapability(CombatReadinessState.SHAKEN);
      expect(capability.damageTakenMultiplier).toBe(1.0);
    });

    it("should have 1.5x damage taken multiplier in VULNERABLE state", () => {
      const capability = system.getCapability(CombatReadinessState.VULNERABLE);
      expect(capability.damageTakenMultiplier).toBe(1.5);
    });

    it("should have 2.0x damage taken multiplier in HELPLESS state", () => {
      const capability = system.getCapability(CombatReadinessState.HELPLESS);
      expect(capability.damageTakenMultiplier).toBe(2.0);
    });
  });

  describe("Accuracy and Damage Modifiers", () => {
    it("should apply -15% accuracy and -10% damage in SHAKEN state", () => {
      const capability = system.getCapability(CombatReadinessState.SHAKEN);
      expect(capability.accuracyModifier).toBe(0.85);
      expect(capability.damageModifier).toBe(0.9);
    });

    it("should apply -30% accuracy and -25% damage in VULNERABLE state", () => {
      const capability = system.getCapability(CombatReadinessState.VULNERABLE);
      expect(capability.accuracyModifier).toBe(0.7);
      expect(capability.damageModifier).toBe(0.75);
    });

    it("should apply 0% damage in HELPLESS state (cannot attack)", () => {
      const capability = system.getCapability(CombatReadinessState.HELPLESS);
      expect(capability.accuracyModifier).toBe(0.0);
      expect(capability.damageModifier).toBe(0.0);
      expect(capability.canExecuteTechniques).toBe(false);
      expect(capability.canBlock).toBe(false);
    });
  });

  describe("Performance", () => {
    it("should determine state in under 2ms", () => {
      const iterations = 1000;
      const currentTime = Date.now();
      
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        system.determineState(basePlayer, currentTime);
      }
      const end = performance.now();
      
      const avgTime = (end - start) / iterations;
      expect(avgTime).toBeLessThan(2);
    });
  });
});
