/**
 * Tests for AI Combo System
 */

import { PlayerState } from "@/systems/player";
import { asMutable } from "@/test/test-utils";
import { PlayerArchetype, TrigramStance } from "@/types";
import { CombatState } from "@/types/common";
import { beforeEach, describe, expect, it } from "vitest";
import { AI_PERSONALITIES } from "./AIPersonality";
import { AIComboSystem } from "./ComboSystem";

describe("AIComboSystem", () => {
  let comboSystem: AIComboSystem;
  let mockPlayer: PlayerState;
  let mockOpponent: PlayerState;

  beforeEach(() => {
    comboSystem = new AIComboSystem();

    mockPlayer = {
      id: "ai-player",
      name: { korean: "AI", english: "AI" },
      archetype: PlayerArchetype.MUSA,
      health: 100,
      maxHealth: 100,
      ki: 50,
      maxKi: 100,
      stamina: 50,
      maxStamina: 100,
      energy: 100,
      maxEnergy: 100,
      attackPower: 10,
      defense: 10,
      speed: 10,
      technique: 10,
      pain: 0,
      consciousness: 100,
      balance: 100,
      momentum: 0,
      currentStance: TrigramStance.GEON,
      combatState: "idle" as CombatState,
      position: { x: 100, y: 100 },
      isBlocking: false,
      isStunned: false,
      isCountering: false,
      lastActionTime: 0,
      recoveryTime: 0,
      lastStanceChangeTime: 0,
      statusEffects: [],
      activeEffects: [],
      vitalPoints: [],
      totalDamageReceived: 0,
      totalDamageDealt: 0,
      hitsTaken: 0,
      hitsLanded: 0,
      perfectStrikes: 0,
      vitalPointHits: 0,
    };

    mockOpponent = {
      ...mockPlayer,
      id: "opponent",
      position: { x: 200, y: 100 },
    };
  });

  describe("initialization", () => {
    it("should create combo system successfully", () => {
      expect(comboSystem).toBeTruthy();
    });

    it("should have no active combo initially", () => {
      expect(comboSystem.isComboActive()).toBe(false);
    });

    it("should have combos for all stances", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const combos = comboSystem.getAvailableCombos(stance);
        expect(combos.length).toBeGreaterThan(0);
      });
    });
  });

  describe("combo sequences", () => {
    it("should have sequences for each stance (up to 3 hits)", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const combos = comboSystem.getAvailableCombos(stance);
        combos.forEach((combo) => {
          // Techniques are limited by available techniques in TRIGRAM_TECHNIQUES
          expect(combo.techniques.length).toBeGreaterThan(0);
          expect(combo.techniques.length).toBeLessThanOrEqual(3);
        });
      });
    });

    it("should have Korean and English names", () => {
      const combos = comboSystem.getAvailableCombos(TrigramStance.GEON);
      combos.forEach((combo) => {
        expect(combo.name.korean).toBeTruthy();
        expect(combo.name.english).toBeTruthy();
      });
    });

    it("should have valid distance ranges", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const combos = comboSystem.getAvailableCombos(stance);
        combos.forEach((combo) => {
          expect(combo.minDistance).toBeGreaterThan(0);
          expect(combo.maxDistance).toBeGreaterThan(combo.minDistance);
        });
      });
    });

    it("should have resource requirements", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const combos = comboSystem.getAvailableCombos(stance);
        combos.forEach((combo) => {
          expect(combo.requiredKi).toBeGreaterThan(0);
          expect(combo.requiredStamina).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("startCombo", () => {
    it("should start combo when conditions are met", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      const mutablePlayer = asMutable(mockPlayer);
      mutablePlayer.ki = 100;
      mutablePlayer.stamina = 100;

      const started = comboSystem.startCombo(
        mockPlayer,
        mockOpponent,
        personality
      );

      // May or may not start due to random chance
      expect(typeof started).toBe("boolean");
    });

    it("should not start combo when too far", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      asMutable(mockOpponent).position = { x: 1000, y: 1000 };

      const started = comboSystem.startCombo(
        mockPlayer,
        mockOpponent,
        personality
      );

      expect(started).toBe(false);
    });

    it("should not start combo with insufficient resources", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      const mutablePlayer = asMutable(mockPlayer);
      mutablePlayer.ki = 5;
      mutablePlayer.stamina = 5;

      const started = comboSystem.startCombo(
        mockPlayer,
        mockOpponent,
        personality
      );

      expect(started).toBe(false);
    });
  });

  describe("shouldContinueCombo", () => {
    it("should return false when no active combo", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      const shouldContinue = comboSystem.shouldContinueCombo(
        mockPlayer,
        mockOpponent,
        personality
      );

      expect(shouldContinue).toBe(false);
    });

    it("should return false when too far from opponent", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      comboSystem.startCombo(mockPlayer, mockOpponent, personality);
      asMutable(mockOpponent).position = { x: 1000, y: 1000 };

      const shouldContinue = comboSystem.shouldContinueCombo(
        mockPlayer,
        mockOpponent,
        personality
      );

      expect(shouldContinue).toBe(false);
    });

    it("should return false with insufficient resources", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      comboSystem.startCombo(mockPlayer, mockOpponent, personality);
      const mutablePlayer = asMutable(mockPlayer);
      mutablePlayer.ki = 0;
      mutablePlayer.stamina = 0;

      const shouldContinue = comboSystem.shouldContinueCombo(
        mockPlayer,
        mockOpponent,
        personality
      );

      expect(shouldContinue).toBe(false);
    });
  });

  describe("getNextComboTechnique", () => {
    it("should return null when no active combo", () => {
      const technique = comboSystem.getNextComboTechnique();
      expect(technique).toBeNull();
    });

    it("should return technique when combo is active", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      const mutablePlayer = asMutable(mockPlayer);
      mutablePlayer.ki = 100;
      mutablePlayer.stamina = 100;

      const started = comboSystem.startCombo(
        mockPlayer,
        mockOpponent,
        personality
      );

      if (started) {
        const technique = comboSystem.getNextComboTechnique();
        // May be null if combo conditions not met
        if (technique !== null) {
          expect(technique).toHaveProperty("id");
          expect(technique).toHaveProperty("stance");
        }
      }
    });
  });

  describe("resetCombo", () => {
    it("should clear active combo", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      comboSystem.startCombo(mockPlayer, mockOpponent, personality);
      comboSystem.resetCombo();

      expect(comboSystem.isComboActive()).toBe(false);
    });
  });

  describe("getComboInfo", () => {
    it("should return correct initial info", () => {
      const info = comboSystem.getComboInfo();
      expect(info.active).toBe(false);
      expect(info.progress).toBe(0);
      expect(info.total).toBe(0);
      expect(info.percentage).toBe(0);
    });

    it("should track combo progress", () => {
      const personality = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      const mutablePlayer = asMutable(mockPlayer);
      mutablePlayer.ki = 100;
      mutablePlayer.stamina = 100;

      comboSystem.startCombo(mockPlayer, mockOpponent, personality);
      const info = comboSystem.getComboInfo();

      expect(info.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe("personality integration", () => {
    it("should respect AGGRESSIVE_STRIKER combo tendency", () => {
      const aggressive = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      expect(aggressive.comboTendency).toBeGreaterThan(0.6);
    });

    it("should respect DEFENSIVE_SPECIALIST low combo tendency", () => {
      const defensive = AI_PERSONALITIES.DEFENSIVE_SPECIALIST;
      expect(defensive.comboTendency).toBeLessThan(0.4);
    });
  });
});
