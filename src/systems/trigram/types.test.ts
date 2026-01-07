/**
 * Tests for trigram type utilities
 * 
 * Validates helper functions for stance+laterality operations.
 * 
 * @module systems/trigram/types.test.ts
 */

import { describe, it, expect } from "vitest";
import { TrigramStance } from "../../types/common";
import {
  parseStanceWithSide,
  combineStanceWithSide,
  type StanceLaterality,
} from "./types";

describe("Stance Laterality Utilities", () => {
  describe("combineStanceWithSide", () => {
    it("should combine stance and laterality correctly", () => {
      const result = combineStanceWithSide(TrigramStance.GEON, "left");
      expect(result).toBe("geon_left");
    });

    it("should work with all trigram stances", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const leftResult = combineStanceWithSide(stance, "left");
        const rightResult = combineStanceWithSide(stance, "right");
        
        expect(leftResult).toBe(`${stance}_left`);
        expect(rightResult).toBe(`${stance}_right`);
      });
    });

    it("should create valid StanceWithSide type", () => {
      const result = combineStanceWithSide(TrigramStance.TAE, "right");
      // TypeScript should accept this as StanceWithSide
      const _typeCheck: string = result;
      expect(_typeCheck).toBe("tae_right");
    });
  });

  describe("parseStanceWithSide", () => {
    it("should parse valid stance+laterality strings", () => {
      const result = parseStanceWithSide("geon_left");
      
      expect(result).not.toBeNull();
      expect(result?.stance).toBe(TrigramStance.GEON);
      expect(result?.laterality).toBe("left");
    });

    it("should parse all valid combinations", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const leftResult = parseStanceWithSide(`${stance}_left`);
        const rightResult = parseStanceWithSide(`${stance}_right`);
        
        expect(leftResult?.stance).toBe(stance);
        expect(leftResult?.laterality).toBe("left");
        
        expect(rightResult?.stance).toBe(stance);
        expect(rightResult?.laterality).toBe("right");
      });
    });

    it("should return null for invalid format", () => {
      expect(parseStanceWithSide("invalid")).toBeNull();
      expect(parseStanceWithSide("geon")).toBeNull();
      expect(parseStanceWithSide("geon_middle")).toBeNull();
      expect(parseStanceWithSide("unknown_left")).toBeNull();
      expect(parseStanceWithSide("")).toBeNull();
    });

    it("should return null for invalid stance", () => {
      const result = parseStanceWithSide("invalidstance_left");
      expect(result).toBeNull();
    });

    it("should return null for invalid laterality", () => {
      const result = parseStanceWithSide("geon_center");
      expect(result).toBeNull();
    });

    it("should return null for too many parts", () => {
      const result = parseStanceWithSide("geon_left_extra");
      expect(result).toBeNull();
    });
  });

  describe("Round-trip conversion", () => {
    it("should maintain data through combine and parse", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const lateralities: StanceLaterality[] = ["left", "right"];
        
        lateralities.forEach((laterality) => {
          const combined = combineStanceWithSide(stance, laterality);
          const parsed = parseStanceWithSide(combined);
          
          expect(parsed).not.toBeNull();
          expect(parsed?.stance).toBe(stance);
          expect(parsed?.laterality).toBe(laterality);
        });
      });
    });
  });
});
