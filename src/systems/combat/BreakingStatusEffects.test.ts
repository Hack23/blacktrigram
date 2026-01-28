/**
 * Tests for Breaking Status Effects Constants
 *
 * Validates that status effect IDs are properly defined and can be used
 * for type-safe status effect management.
 *
 * @module systems/combat/__tests__/BreakingStatusEffects.test
 */

import { describe, it, expect } from "vitest";
import {
  BREAKING_STATUS_EFFECT_IDS,
  isBreakingStatusEffectId,
  getAllBreakingStatusEffectIds,
  type BreakingStatusEffectId,
} from "./BreakingStatusEffects";

describe("BreakingStatusEffects", () => {
  describe("BREAKING_STATUS_EFFECT_IDS", () => {
    it("should define all required status effect IDs", () => {
      expect(BREAKING_STATUS_EFFECT_IDS.PAIN).toBe("pain");
      expect(BREAKING_STATUS_EFFECT_IDS.SEVERE_INJURY).toBe("severe_injury");
      expect(BREAKING_STATUS_EFFECT_IDS.DISABLED_LIMB).toBe("disabled_limb");
      expect(BREAKING_STATUS_EFFECT_IDS.INJURED_LIMB).toBe("injured_limb");
      expect(BREAKING_STATUS_EFFECT_IDS.SPRAINED_JOINT).toBe("sprained_joint");
      expect(BREAKING_STATUS_EFFECT_IDS.IMPAIRED_MOBILITY).toBe(
        "impaired_mobility"
      );
      expect(BREAKING_STATUS_EFFECT_IDS.BLEEDING).toBe("bleeding");
    });

    it("should have all IDs as const values", () => {
      // Type check - this should compile without errors
      const pain: "pain" = BREAKING_STATUS_EFFECT_IDS.PAIN;
      expect(pain).toBe("pain");
    });

    it("should export exactly 7 status effect IDs", () => {
      const ids = Object.keys(BREAKING_STATUS_EFFECT_IDS);
      expect(ids).toHaveLength(7);
    });
  });

  describe("isBreakingStatusEffectId", () => {
    it("should return true for valid status effect IDs", () => {
      expect(isBreakingStatusEffectId("pain")).toBe(true);
      expect(isBreakingStatusEffectId("severe_injury")).toBe(true);
      expect(isBreakingStatusEffectId("disabled_limb")).toBe(true);
      expect(isBreakingStatusEffectId("injured_limb")).toBe(true);
      expect(isBreakingStatusEffectId("sprained_joint")).toBe(true);
      expect(isBreakingStatusEffectId("impaired_mobility")).toBe(true);
      expect(isBreakingStatusEffectId("bleeding")).toBe(true);
    });

    it("should return false for invalid status effect IDs", () => {
      expect(isBreakingStatusEffectId("invalid")).toBe(false);
      expect(isBreakingStatusEffectId("unknown_effect")).toBe(false);
      expect(isBreakingStatusEffectId("")).toBe(false);
      expect(isBreakingStatusEffectId("PAIN")).toBe(false); // Wrong case
    });

    it("should provide type narrowing", () => {
      const id: string = "pain";

      if (isBreakingStatusEffectId(id)) {
        // Type should be narrowed to BreakingStatusEffectId
        const narrowed: BreakingStatusEffectId = id;
        expect(narrowed).toBe("pain");
      }
    });
  });

  describe("getAllBreakingStatusEffectIds", () => {
    it("should return all 7 status effect IDs", () => {
      const allIds = getAllBreakingStatusEffectIds();
      expect(allIds).toHaveLength(7);
    });

    it("should include all defined IDs", () => {
      const allIds = getAllBreakingStatusEffectIds();

      expect(allIds).toContain("pain");
      expect(allIds).toContain("severe_injury");
      expect(allIds).toContain("disabled_limb");
      expect(allIds).toContain("injured_limb");
      expect(allIds).toContain("sprained_joint");
      expect(allIds).toContain("impaired_mobility");
      expect(allIds).toContain("bleeding");
    });

    it("should return a readonly array", () => {
      const allIds = getAllBreakingStatusEffectIds();

      // TypeScript enforces readonly at compile time
      // Runtime behavior: array is still mutable in JS, but type system prevents it
      expect(Array.isArray(allIds)).toBe(true);
      expect(allIds.length).toBeGreaterThan(0);
    });

    it("should not contain duplicate IDs", () => {
      const allIds = getAllBreakingStatusEffectIds();
      const uniqueIds = new Set(allIds);

      expect(allIds.length).toBe(uniqueIds.size);
    });
  });

  describe("Type Safety", () => {
    it("should allow using constants as BreakingStatusEffectId type", () => {
      const pain: BreakingStatusEffectId = BREAKING_STATUS_EFFECT_IDS.PAIN;
      const bleeding: BreakingStatusEffectId =
        BREAKING_STATUS_EFFECT_IDS.BLEEDING;

      expect(pain).toBe("pain");
      expect(bleeding).toBe("bleeding");
    });

    it("should work in string arrays", () => {
      const effects: string[] = [
        BREAKING_STATUS_EFFECT_IDS.PAIN,
        BREAKING_STATUS_EFFECT_IDS.BLEEDING,
      ];

      expect(effects).toContain("pain");
      expect(effects).toContain("bleeding");
    });

    it("should work in readonly arrays", () => {
      const effects: readonly string[] = [
        BREAKING_STATUS_EFFECT_IDS.SEVERE_INJURY,
        BREAKING_STATUS_EFFECT_IDS.DISABLED_LIMB,
      ];

      expect(effects).toHaveLength(2);
      expect(effects[0]).toBe("severe_injury");
    });
  });

  describe("Integration with LimbExposureSystem", () => {
    it("should provide IDs compatible with StatusEffect.id field", () => {
      // StatusEffect.id is of type string
      const statusEffectId: string = BREAKING_STATUS_EFFECT_IDS.PAIN;
      expect(typeof statusEffectId).toBe("string");
    });

    it("should support building status effect ID arrays", () => {
      const statusEffects: string[] = [BREAKING_STATUS_EFFECT_IDS.PAIN];

      // Add more based on severity
      statusEffects.push(
        BREAKING_STATUS_EFFECT_IDS.SEVERE_INJURY,
        BREAKING_STATUS_EFFECT_IDS.DISABLED_LIMB
      );

      expect(statusEffects).toHaveLength(3);
      expect(statusEffects).toContain("pain");
      expect(statusEffects).toContain("severe_injury");
      expect(statusEffects).toContain("disabled_limb");
    });
  });
});
