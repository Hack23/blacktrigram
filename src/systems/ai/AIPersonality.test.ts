/**
 * Tests for AI Personality System
 */

import { PlayerArchetype } from "@/types";
import { describe, expect, it } from "vitest";
import {
  AI_PERSONALITIES,
  getAllPersonalities,
  getPersonalityByArchetype,
  getPersonalityByName,
  getRandomPersonality,
} from "./AIPersonality";

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

    it("DEFENSIVE_SPECIALIST should have moderate defense (enhanced for aggression)", () => {
      // DEFENSIVE_SPECIALIST now has reduced defense preference for more active combat
      // but still maintains defensive focus through favored stances (GAN, GON, GAM)
      const defensive = AI_PERSONALITIES.DEFENSIVE_SPECIALIST;
      expect(defensive.defensePreference).toBeGreaterThan(0.5);
      expect(defensive.aggressionLevel).toBeLessThan(0.6);
    });

    it("TECHNICAL_MASTER should have high feint chance", () => {
      // TECHNICAL_MASTER now has reduced stance switch frequency for precision commitment
      const technical = AI_PERSONALITIES.TECHNICAL_MASTER;
      expect(technical.feintChance).toBeGreaterThan(0.3);
      // Reduced stanceSwitchFrequency: precision strikers commit to their stance
      expect(technical.stanceSwitchFrequency).toBeLessThan(0.3);
    });

    it("BALANCED_FIGHTER should have balanced stats", () => {
      // BALANCED_FIGHTER now has enhanced aggression for decisive action
      const balanced = AI_PERSONALITIES.BALANCED_FIGHTER;
      expect(balanced.aggressionLevel).toBeGreaterThan(0.5);
      // Enhanced aggression may push this above 0.7
      expect(balanced.aggressionLevel).toBeLessThan(0.8);
      expect(balanced.defensePreference).toBeGreaterThan(0.3);
      expect(balanced.defensePreference).toBeLessThan(0.5);
    });

    it("CHAOS_WARRIOR should have high unpredictability", () => {
      // CHAOS_WARRIOR now expresses chaos through attacks, not stance dancing
      const chaos = AI_PERSONALITIES.CHAOS_WARRIOR;
      // Reduced stanceSwitchFrequency: chaos is in attacks, not stance dancing
      expect(chaos.stanceSwitchFrequency).toBeLessThan(0.4);
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
