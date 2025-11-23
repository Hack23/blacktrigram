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
      const state = system.determineState(basePlayer);
      expect(state).toBe(CombatReadinessState.READY);
    });

    it("should return SHAKEN state when health drops to 70%", () => {
      const player = { ...basePlayer, health: 70 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.SHAKEN);
    });

    it("should return VULNERABLE state when health drops to 50%", () => {
      const player = { ...basePlayer, health: 50 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should return HELPLESS state when health drops to 30%", () => {
      const player = { ...basePlayer, health: 30 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.HELPLESS);
    });

    it("should return SHAKEN state when pain reaches 30", () => {
      const player = { ...basePlayer, pain: 30 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.SHAKEN);
    });

    it("should return VULNERABLE state when pain reaches 50", () => {
      const player = { ...basePlayer, pain: 50 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should return HELPLESS state when pain reaches 80", () => {
      const player = { ...basePlayer, pain: 80 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.HELPLESS);
    });

    it("should return SHAKEN state when consciousness drops to 70", () => {
      const player = { ...basePlayer, consciousness: 70 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.SHAKEN);
    });

    it("should return VULNERABLE state when consciousness drops to 50", () => {
      const player = { ...basePlayer, consciousness: 50 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should return HELPLESS state when consciousness drops to 15", () => {
      const player = { ...basePlayer, consciousness: 15 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.HELPLESS);
    });

    it("should return SHAKEN state when balance drops to 70", () => {
      const player = { ...basePlayer, balance: 70 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.SHAKEN);
    });

    it("should return VULNERABLE state when balance drops to 50", () => {
      const player = { ...basePlayer, balance: 50 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should return HELPLESS state when balance drops to 15", () => {
      const player = { ...basePlayer, balance: 15 };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.HELPLESS);
    });

    it("should use worst-case state when multiple factors are degraded", () => {
      const player = {
        ...basePlayer,
        health: 70, // SHAKEN
        pain: 50, // VULNERABLE
      };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.VULNERABLE);
    });

    it("should return HELPLESS when any factor is critical", () => {
      const player = {
        ...basePlayer,
        health: 90, // READY
        pain: 85, // HELPLESS
      };
      const state = system.determineState(player);
      expect(state).toBe(CombatReadinessState.HELPLESS);
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

    it("should return 80% capability for SHAKEN state", () => {
      const capability = system.getCapability(CombatReadinessState.SHAKEN);
      expect(capability.capability).toBe(0.8);
      expect(capability.accuracyModifier).toBe(0.8);
      expect(capability.canBlock).toBe(true);
      expect(capability.canExecuteTechniques).toBe(true);
    });

    it("should return 60% capability for VULNERABLE state", () => {
      const capability = system.getCapability(CombatReadinessState.VULNERABLE);
      expect(capability.capability).toBe(0.6);
      expect(capability.defenseModifier).toBe(0.6);
      expect(capability.canBlock).toBe(true);
      expect(capability.canExecuteTechniques).toBe(true);
    });

    it("should return 20% capability for HELPLESS state", () => {
      const capability = system.getCapability(CombatReadinessState.HELPLESS);
      expect(capability.capability).toBe(0.2);
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

    it("should reduce attack power by 20% in SHAKEN state", () => {
      const modified = system.applyStateModifiers(
        basePlayer,
        CombatReadinessState.SHAKEN
      );
      expect(modified.attackPower).toBe(Math.floor(15 * 0.8)); // 12
    });

    it("should reduce defense by 40% in VULNERABLE state", () => {
      const modified = system.applyStateModifiers(
        basePlayer,
        CombatReadinessState.VULNERABLE
      );
      expect(modified.defense).toBe(Math.floor(12 * 0.6)); // 7
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
      expect(system.determineState(player)).toBe(CombatReadinessState.READY);
      
      // Light pain - SHAKEN
      player = { ...player, pain: 30 };
      expect(system.determineState(player)).toBe(CombatReadinessState.SHAKEN);
      
      // Moderate pain - VULNERABLE
      player = { ...player, pain: 50 };
      expect(system.determineState(player)).toBe(CombatReadinessState.VULNERABLE);
      
      // Severe pain - HELPLESS
      player = { ...player, pain: 85 };
      expect(system.determineState(player)).toBe(CombatReadinessState.HELPLESS);
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
});
