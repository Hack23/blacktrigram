/**
 * Tests for combat system type guards
 */

import { describe, expect, it } from "vitest";
import { PlayerArchetype, VitalPointCategory, VitalPointSeverity } from "../../types/common";
import { VitalPoint } from "../vitalpoint/types";
import {
  isValidArchetype,
  isVitalPoint,
  isVitalPointCategory,
} from "./typeGuards";

describe("Combat Type Guards", () => {
  describe("isValidArchetype", () => {
    it("should return true for valid PlayerArchetype values", () => {
      expect(isValidArchetype(PlayerArchetype.MUSA)).toBe(true);
      expect(isValidArchetype(PlayerArchetype.AMSALJA)).toBe(true);
      expect(isValidArchetype(PlayerArchetype.HACKER)).toBe(true);
      expect(isValidArchetype(PlayerArchetype.JEONGBO_YOWON)).toBe(true);
      expect(isValidArchetype(PlayerArchetype.JOJIK_POKRYEOKBAE)).toBe(true);
    });

    it("should return false for invalid archetype values", () => {
      expect(isValidArchetype("invalid_archetype")).toBe(false);
      expect(isValidArchetype("")).toBe(false);
      expect(isValidArchetype("warrior")).toBe(false);
    });

    it("should return false for non-string values", () => {
      expect(isValidArchetype(123)).toBe(false);
      expect(isValidArchetype(null)).toBe(false);
      expect(isValidArchetype(undefined)).toBe(false);
      expect(isValidArchetype({})).toBe(false);
      expect(isValidArchetype([])).toBe(false);
      expect(isValidArchetype(true)).toBe(false);
    });
  });

  describe("isVitalPointCategory", () => {
    it("should return true for valid VitalPointCategory values", () => {
      expect(isVitalPointCategory(VitalPointCategory.NEUROLOGICAL)).toBe(true);
      expect(isVitalPointCategory(VitalPointCategory.SKELETAL)).toBe(true);
      expect(isVitalPointCategory(VitalPointCategory.VASCULAR)).toBe(true);
      expect(isVitalPointCategory(VitalPointCategory.RESPIRATORY)).toBe(true);
    });

    it("should return false for invalid category values", () => {
      expect(isVitalPointCategory("invalid_category")).toBe(false);
      expect(isVitalPointCategory("")).toBe(false);
      expect(isVitalPointCategory("brain")).toBe(false);
    });

    it("should return false for non-string values", () => {
      expect(isVitalPointCategory(123)).toBe(false);
      expect(isVitalPointCategory(null)).toBe(false);
      expect(isVitalPointCategory(undefined)).toBe(false);
      expect(isVitalPointCategory({})).toBe(false);
      expect(isVitalPointCategory([])).toBe(false);
    });
  });

  describe("isVitalPoint", () => {
    const validVitalPoint: VitalPoint = {
      id: "test_vital_point",
      names: {
        korean: "백회",
        english: "Baihui",
        romanized: "Baekhe",
      },
      position: { x: 0, y: 0 },
      category: VitalPointCategory.NEUROLOGICAL,
      severity: VitalPointSeverity.CRITICAL,
      effects: [],
      description: {
        korean: "머리 꼭대기",
        english: "Top of head",
      },
      targetingDifficulty: 0.8,
      effectiveStances: [],
    };

    it("should return true for valid VitalPoint objects", () => {
      expect(isVitalPoint(validVitalPoint)).toBe(true);
    });

    it("should return false for objects missing required properties", () => {
      const { id, ...missingId } = validVitalPoint;
      expect(isVitalPoint(missingId)).toBe(false);

      const { category, ...missingCategory } = validVitalPoint;
      expect(isVitalPoint(missingCategory)).toBe(false);

      const { position, ...missingPosition } = validVitalPoint;
      expect(isVitalPoint(missingPosition)).toBe(false);

      const { effects, ...missingEffects } = validVitalPoint;
      expect(isVitalPoint(missingEffects)).toBe(false);
    });

    it("should return false for objects with invalid property types", () => {
      const invalidId = { ...validVitalPoint, id: 123 };
      expect(isVitalPoint(invalidId)).toBe(false);

      const invalidCategory = { ...validVitalPoint, category: "invalid" };
      expect(isVitalPoint(invalidCategory)).toBe(false);

      const invalidPosition = { ...validVitalPoint, position: "not_an_object" };
      expect(isVitalPoint(invalidPosition)).toBe(false);

      const invalidEffects = { ...validVitalPoint, effects: "not_an_array" };
      expect(isVitalPoint(invalidEffects)).toBe(false);
    });

    it("should return false for non-object values", () => {
      expect(isVitalPoint(null)).toBe(false);
      expect(isVitalPoint(undefined)).toBe(false);
      expect(isVitalPoint("string")).toBe(false);
      expect(isVitalPoint(123)).toBe(false);
      expect(isVitalPoint([])).toBe(false);
      expect(isVitalPoint(true)).toBe(false);
    });

    it("should return false for empty objects", () => {
      expect(isVitalPoint({})).toBe(false);
    });
  });
});
