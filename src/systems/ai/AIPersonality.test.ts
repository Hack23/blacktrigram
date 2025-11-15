/**
 * Tests for AI Personality System
 */

import { describe, it, expect } from "vitest";
import {
  AI_PERSONALITIES,
  getRandomPersonality,
  getPersonalityByArchetype,
  getPersonalityByName,
  getAllPersonalities,
} from "./AIPersonality";
import { PlayerArchetype } from "@/types";

describe("AIPersonality", () => {
  describe("AI_PERSONALITIES", () => {
    it("should have exactly 5 personality archetypes", () => {
      const personalities = Object.keys(AI_PERSONALITIES);
      expect(personalities).toHaveLength(5);
    });

    it("should have all required personality properties", () => {
      Object.values(AI_PERSONALITIES).forEach((personality) => {
        expect(personality).toHaveProperty("name");
        expect(personality).toHaveProperty("koreanName");
        expect(personality).toHaveProperty("archetype");
        expect(personality).toHaveProperty("aggressionLevel");
        expect(personality).toHaveProperty("defensePreference");
        expect(personality).toHaveProperty("comboTendency");
        expect(personality).toHaveProperty("stanceSwitchFrequency");
        expect(personality).toHaveProperty("feintChance");
        expect(personality).toHaveProperty("tacticalRetreatThreshold");
        expect(personality).toHaveProperty("favoredStances");
        expect(personality).toHaveProperty("description");
      });
    });

    it("should have valid stat ranges (0-1)", () => {
      Object.values(AI_PERSONALITIES).forEach((personality) => {
        expect(personality.aggressionLevel).toBeGreaterThanOrEqual(0);
        expect(personality.aggressionLevel).toBeLessThanOrEqual(1);
        expect(personality.defensePreference).toBeGreaterThanOrEqual(0);
        expect(personality.defensePreference).toBeLessThanOrEqual(1);
        expect(personality.comboTendency).toBeGreaterThanOrEqual(0);
        expect(personality.comboTendency).toBeLessThanOrEqual(1);
        expect(personality.stanceSwitchFrequency).toBeGreaterThanOrEqual(0);
        expect(personality.stanceSwitchFrequency).toBeLessThanOrEqual(1);
        expect(personality.feintChance).toBeGreaterThanOrEqual(0);
        expect(personality.feintChance).toBeLessThanOrEqual(1);
        expect(personality.tacticalRetreatThreshold).toBeGreaterThanOrEqual(0);
        expect(personality.tacticalRetreatThreshold).toBeLessThanOrEqual(1);
      });
    });

    it("should have bilingual descriptions", () => {
      Object.values(AI_PERSONALITIES).forEach((personality) => {
        expect(personality.description.korean).toBeTruthy();
        expect(personality.description.english).toBeTruthy();
        expect(typeof personality.description.korean).toBe("string");
        expect(typeof personality.description.english).toBe("string");
      });
    });

    it("AGGRESSIVE_STRIKER should have high aggression", () => {
      const aggressive = AI_PERSONALITIES.AGGRESSIVE_STRIKER;
      expect(aggressive.aggressionLevel).toBeGreaterThan(0.8);
      expect(aggressive.defensePreference).toBeLessThan(0.3);
    });

    it("DEFENSIVE_SPECIALIST should have high defense", () => {
      const defensive = AI_PERSONALITIES.DEFENSIVE_SPECIALIST;
      expect(defensive.defensePreference).toBeGreaterThan(0.7);
      expect(defensive.aggressionLevel).toBeLessThan(0.4);
    });

    it("TECHNICAL_MASTER should have high feint chance", () => {
      const technical = AI_PERSONALITIES.TECHNICAL_MASTER;
      expect(technical.feintChance).toBeGreaterThan(0.3);
      expect(technical.stanceSwitchFrequency).toBeGreaterThan(0.6);
    });

    it("BALANCED_FIGHTER should have balanced stats", () => {
      const balanced = AI_PERSONALITIES.BALANCED_FIGHTER;
      expect(balanced.aggressionLevel).toBeGreaterThan(0.5);
      expect(balanced.aggressionLevel).toBeLessThan(0.7);
      expect(balanced.defensePreference).toBeGreaterThan(0.4);
      expect(balanced.defensePreference).toBeLessThan(0.6);
    });

    it("CHAOS_WARRIOR should have high unpredictability", () => {
      const chaos = AI_PERSONALITIES.CHAOS_WARRIOR;
      expect(chaos.stanceSwitchFrequency).toBeGreaterThan(0.7);
      expect(chaos.feintChance).toBeGreaterThan(0.4);
    });
  });

  describe("getRandomPersonality", () => {
    it("should return a valid personality", () => {
      const personality = getRandomPersonality();
      expect(personality).toBeTruthy();
      expect(personality.name).toBeTruthy();
    });

    it("should return different personalities over multiple calls", () => {
      const personalities = new Set<string>();
      for (let i = 0; i < 20; i++) {
        personalities.add(getRandomPersonality().name);
      }
      // Should have at least 2 different personalities in 20 calls
      expect(personalities.size).toBeGreaterThan(1);
    });
  });

  describe("getPersonalityByArchetype", () => {
    it("should return personality matching archetype", () => {
      const musa = getPersonalityByArchetype(PlayerArchetype.MUSA);
      expect(musa.archetype).toBe(PlayerArchetype.MUSA);
    });

    it("should return BALANCED_FIGHTER for unknown archetype", () => {
      const unknown = getPersonalityByArchetype("unknown" as PlayerArchetype);
      expect(unknown.name).toBe("Balanced Fighter");
    });

    it("should handle all player archetypes", () => {
      Object.values(PlayerArchetype).forEach((archetype) => {
        const personality = getPersonalityByArchetype(archetype);
        expect(personality).toBeTruthy();
        expect(personality.name).toBeTruthy();
      });
    });
  });

  describe("getPersonalityByName", () => {
    it("should return correct personality by name", () => {
      const aggressive = getPersonalityByName("AGGRESSIVE_STRIKER");
      expect(aggressive.name).toBe("Aggressive Striker");
    });

    it("should return BALANCED_FIGHTER for unknown name", () => {
      const unknown = getPersonalityByName("UNKNOWN_TYPE");
      expect(unknown.name).toBe("Balanced Fighter");
    });

    it("should handle all personality names", () => {
      Object.keys(AI_PERSONALITIES).forEach((key) => {
        const personality = getPersonalityByName(key);
        expect(personality).toBeTruthy();
        expect(personality.name).toBeTruthy();
      });
    });
  });

  describe("getAllPersonalities", () => {
    it("should return all 5 personalities", () => {
      const all = getAllPersonalities();
      expect(all).toHaveLength(5);
    });

    it("should return readonly array", () => {
      const all = getAllPersonalities();
      expect(Array.isArray(all)).toBe(true);
    });

    it("should have unique names", () => {
      const all = getAllPersonalities();
      const names = all.map((p) => p.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });
});
