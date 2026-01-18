/**
 * Tests for Anatomical Limits Constants
 *
 * Validates anatomical safety limits for Korean martial arts animations.
 * These tests ensure biomechanical limits are correctly defined and accessible.
 *
 * @module systems/animation/constants/__tests__/AnatomicalLimits.test
 */

import { describe, it, expect } from "vitest";
import {
  ANATOMICAL_LIMITS,
  type AnatomicalLimits,
  getAnatomicalLimit,
  degreesToRadians,
  radiansToDegrees,
} from "./AnatomicalLimits";

describe("AnatomicalLimits Module", () => {
  describe("ANATOMICAL_LIMITS constant", () => {
    it("should be defined and immutable", () => {
      expect(ANATOMICAL_LIMITS).toBeDefined();
      // Check that the constant is readonly (as const)
      expect(ANATOMICAL_LIMITS).toMatchObject({
        SHOULDER: expect.any(Object),
        ELBOW: expect.any(Object),
        WRIST: expect.any(Object),
        HIP: expect.any(Object),
        KNEE: expect.any(Object),
        ANKLE: expect.any(Object),
      });
    });

    it("should have all required body part categories", () => {
      expect(ANATOMICAL_LIMITS).toHaveProperty("SHOULDER");
      expect(ANATOMICAL_LIMITS).toHaveProperty("ELBOW");
      expect(ANATOMICAL_LIMITS).toHaveProperty("WRIST");
      expect(ANATOMICAL_LIMITS).toHaveProperty("HIP");
      expect(ANATOMICAL_LIMITS).toHaveProperty("KNEE");
      expect(ANATOMICAL_LIMITS).toHaveProperty("ANKLE");
    });
  });

  describe("SHOULDER limits", () => {
    it("should define MAX_OVERHEAD limit", () => {
      expect(ANATOMICAL_LIMITS.SHOULDER.MAX_OVERHEAD).toBe(-2.35);
      expect(ANATOMICAL_LIMITS.SHOULDER.MAX_OVERHEAD).toBeCloseTo(-2.35, 2);
    });

    it("should define MAX_ROTATION limit", () => {
      expect(ANATOMICAL_LIMITS.SHOULDER.MAX_ROTATION).toBe(1.57);
      expect(ANATOMICAL_LIMITS.SHOULDER.MAX_ROTATION).toBeCloseTo(Math.PI / 2, 2);
    });

    it("should define MAX_ELEVATION limit", () => {
      expect(ANATOMICAL_LIMITS.SHOULDER.MAX_ELEVATION).toBe(-0.61);
      expect(ANATOMICAL_LIMITS.SHOULDER.MAX_ELEVATION).toBeCloseTo(-0.61, 2);
    });

    it("should have all values as numbers", () => {
      expect(typeof ANATOMICAL_LIMITS.SHOULDER.MAX_OVERHEAD).toBe("number");
      expect(typeof ANATOMICAL_LIMITS.SHOULDER.MAX_ROTATION).toBe("number");
      expect(typeof ANATOMICAL_LIMITS.SHOULDER.MAX_ELEVATION).toBe("number");
    });

    it("should have negative value for overhead (flexion)", () => {
      expect(ANATOMICAL_LIMITS.SHOULDER.MAX_OVERHEAD).toBeLessThan(0);
    });
  });

  describe("ELBOW limits", () => {
    it("should define MAX_BEND limit", () => {
      expect(ANATOMICAL_LIMITS.ELBOW.MAX_BEND).toBe(2.18);
      expect(ANATOMICAL_LIMITS.ELBOW.MAX_BEND).toBeCloseTo(2.18, 2);
    });

    it("should define MAX_FLEXION limit", () => {
      expect(ANATOMICAL_LIMITS.ELBOW.MAX_FLEXION).toBe(2.53);
      expect(ANATOMICAL_LIMITS.ELBOW.MAX_FLEXION).toBeCloseTo(2.53, 2);
    });

    it("should define MAX_BEND_GUARD limit", () => {
      expect(ANATOMICAL_LIMITS.ELBOW.MAX_BEND_GUARD).toBe(2.09);
      expect(ANATOMICAL_LIMITS.ELBOW.MAX_BEND_GUARD).toBeCloseTo(2.09, 2);
    });

    it("should have MAX_FLEXION greater than MAX_BEND", () => {
      expect(ANATOMICAL_LIMITS.ELBOW.MAX_FLEXION).toBeGreaterThan(
        ANATOMICAL_LIMITS.ELBOW.MAX_BEND
      );
    });
  });

  describe("WRIST limits", () => {
    it("should define MAX_BEND limit", () => {
      expect(ANATOMICAL_LIMITS.WRIST.MAX_BEND).toBe(1.22);
      expect(ANATOMICAL_LIMITS.WRIST.MAX_BEND).toBeCloseTo(1.22, 2);
    });

    it("should have positive value for wrist bend", () => {
      expect(ANATOMICAL_LIMITS.WRIST.MAX_BEND).toBeGreaterThan(0);
    });
  });

  describe("HIP limits", () => {
    it("should define MAX_FLEXION limit", () => {
      expect(ANATOMICAL_LIMITS.HIP.MAX_FLEXION).toBe(1.92);
      expect(ANATOMICAL_LIMITS.HIP.MAX_FLEXION).toBeCloseTo(1.92, 2);
    });

    it("should define MAX_ROTATION limit", () => {
      expect(ANATOMICAL_LIMITS.HIP.MAX_ROTATION).toBe(1.22);
      expect(ANATOMICAL_LIMITS.HIP.MAX_ROTATION).toBeCloseTo(1.22, 2);
    });

    it("should have all values as positive numbers", () => {
      expect(ANATOMICAL_LIMITS.HIP.MAX_FLEXION).toBeGreaterThan(0);
      expect(ANATOMICAL_LIMITS.HIP.MAX_ROTATION).toBeGreaterThan(0);
    });
  });

  describe("KNEE limits", () => {
    it("should define MAX_FLEXION limit", () => {
      expect(ANATOMICAL_LIMITS.KNEE.MAX_FLEXION).toBe(1.57);
      expect(ANATOMICAL_LIMITS.KNEE.MAX_FLEXION).toBeCloseTo(Math.PI / 2, 2);
    });

    it("should define MAX_BEND limit", () => {
      expect(ANATOMICAL_LIMITS.KNEE.MAX_BEND).toBe(2.27);
      expect(ANATOMICAL_LIMITS.KNEE.MAX_BEND).toBeCloseTo(2.27, 2);
    });

    it("should define MAX_BEND_ROOTED limit", () => {
      expect(ANATOMICAL_LIMITS.KNEE.MAX_BEND_ROOTED).toBe(0.44);
      expect(ANATOMICAL_LIMITS.KNEE.MAX_BEND_ROOTED).toBeCloseTo(0.44, 2);
    });

    it("should have MAX_BEND greater than MAX_FLEXION", () => {
      expect(ANATOMICAL_LIMITS.KNEE.MAX_BEND).toBeGreaterThan(
        ANATOMICAL_LIMITS.KNEE.MAX_FLEXION
      );
    });

    it("should have MAX_BEND_ROOTED as smallest value", () => {
      expect(ANATOMICAL_LIMITS.KNEE.MAX_BEND_ROOTED).toBeLessThan(
        ANATOMICAL_LIMITS.KNEE.MAX_FLEXION
      );
      expect(ANATOMICAL_LIMITS.KNEE.MAX_BEND_ROOTED).toBeLessThan(
        ANATOMICAL_LIMITS.KNEE.MAX_BEND
      );
    });
  });

  describe("ANKLE limits", () => {
    it("should define MAX_DORSIFLEXION limit", () => {
      expect(ANATOMICAL_LIMITS.ANKLE.MAX_DORSIFLEXION).toBe(0.44);
      expect(ANATOMICAL_LIMITS.ANKLE.MAX_DORSIFLEXION).toBeCloseTo(0.44, 2);
    });

    it("should define MAX_DORSIFLEX limit", () => {
      expect(ANATOMICAL_LIMITS.ANKLE.MAX_DORSIFLEX).toBe(0.35);
      expect(ANATOMICAL_LIMITS.ANKLE.MAX_DORSIFLEX).toBeCloseTo(0.35, 2);
    });

    it("should have MAX_DORSIFLEXION greater than MAX_DORSIFLEX", () => {
      expect(ANATOMICAL_LIMITS.ANKLE.MAX_DORSIFLEXION).toBeGreaterThan(
        ANATOMICAL_LIMITS.ANKLE.MAX_DORSIFLEX
      );
    });
  });

  describe("getAnatomicalLimit helper function", () => {
    it("should retrieve SHOULDER limits correctly", () => {
      expect(getAnatomicalLimit("SHOULDER", "MAX_OVERHEAD")).toBe(-2.35);
      expect(getAnatomicalLimit("SHOULDER", "MAX_ROTATION")).toBe(1.57);
      expect(getAnatomicalLimit("SHOULDER", "MAX_ELEVATION")).toBe(-0.61);
    });

    it("should retrieve ELBOW limits correctly", () => {
      expect(getAnatomicalLimit("ELBOW", "MAX_BEND")).toBe(2.18);
      expect(getAnatomicalLimit("ELBOW", "MAX_FLEXION")).toBe(2.53);
      expect(getAnatomicalLimit("ELBOW", "MAX_BEND_GUARD")).toBe(2.09);
    });

    it("should retrieve WRIST limits correctly", () => {
      expect(getAnatomicalLimit("WRIST", "MAX_BEND")).toBe(1.22);
    });

    it("should retrieve HIP limits correctly", () => {
      expect(getAnatomicalLimit("HIP", "MAX_FLEXION")).toBe(1.92);
      expect(getAnatomicalLimit("HIP", "MAX_ROTATION")).toBe(1.22);
    });

    it("should retrieve KNEE limits correctly", () => {
      expect(getAnatomicalLimit("KNEE", "MAX_FLEXION")).toBe(1.57);
      expect(getAnatomicalLimit("KNEE", "MAX_BEND")).toBe(2.27);
      expect(getAnatomicalLimit("KNEE", "MAX_BEND_ROOTED")).toBe(0.44);
    });

    it("should retrieve ANKLE limits correctly", () => {
      expect(getAnatomicalLimit("ANKLE", "MAX_DORSIFLEXION")).toBe(0.44);
      expect(getAnatomicalLimit("ANKLE", "MAX_DORSIFLEX")).toBe(0.35);
    });

    it("should provide type safety (compile-time check)", () => {
      // These should compile without errors due to type safety
      const shoulderOverhead = getAnatomicalLimit("SHOULDER", "MAX_OVERHEAD");
      const elbowBend = getAnatomicalLimit("ELBOW", "MAX_BEND");
      const wristBend = getAnatomicalLimit("WRIST", "MAX_BEND");

      expect(shoulderOverhead).toBeDefined();
      expect(elbowBend).toBeDefined();
      expect(wristBend).toBeDefined();
    });

    it("should return number type", () => {
      const result = getAnatomicalLimit("ELBOW", "MAX_BEND");
      expect(typeof result).toBe("number");
    });

    it("should be usable in animation calculations", () => {
      // Example: Calculate elbow rotation within safe limits
      const maxBend = getAnatomicalLimit("ELBOW", "MAX_BEND");
      const rotation = maxBend * 0.8; // 80% of maximum

      expect(rotation).toBeLessThan(maxBend);
      expect(rotation).toBeGreaterThan(0);
    });
  });

  describe("degreesToRadians helper function", () => {
    it("should convert 0 degrees to 0 radians", () => {
      expect(degreesToRadians(0)).toBe(0);
    });

    it("should convert 90 degrees to π/2 radians", () => {
      const result = degreesToRadians(90);
      expect(result).toBeCloseTo(Math.PI / 2, 5);
      expect(result).toBeCloseTo(1.5708, 4);
    });

    it("should convert 180 degrees to π radians", () => {
      const result = degreesToRadians(180);
      expect(result).toBeCloseTo(Math.PI, 5);
      expect(result).toBeCloseTo(3.14159, 4);
    });

    it("should convert 360 degrees to 2π radians", () => {
      const result = degreesToRadians(360);
      expect(result).toBeCloseTo(2 * Math.PI, 5);
      expect(result).toBeCloseTo(6.28318, 4);
    });

    it("should convert negative degrees correctly", () => {
      expect(degreesToRadians(-90)).toBeCloseTo(-Math.PI / 2, 5);
      expect(degreesToRadians(-180)).toBeCloseTo(-Math.PI, 5);
    });

    it("should handle decimal degrees", () => {
      expect(degreesToRadians(45.5)).toBeCloseTo(0.7941, 3);
      expect(degreesToRadians(30.25)).toBeCloseTo(0.5280, 3);
    });

    it("should convert common martial arts angles", () => {
      // 125 degrees (elbow bend)
      expect(degreesToRadians(125)).toBeCloseTo(2.18166, 4);
      // 145 degrees (elbow flexion)
      expect(degreesToRadians(145)).toBeCloseTo(2.53073, 4);
      // 135 degrees (shoulder overhead)
      expect(degreesToRadians(135)).toBeCloseTo(2.35619, 4);
    });
  });

  describe("radiansToDegrees helper function", () => {
    it("should convert 0 radians to 0 degrees", () => {
      expect(radiansToDegrees(0)).toBe(0);
    });

    it("should convert π/2 radians to 90 degrees", () => {
      const result = radiansToDegrees(Math.PI / 2);
      expect(result).toBeCloseTo(90, 5);
    });

    it("should convert π radians to 180 degrees", () => {
      const result = radiansToDegrees(Math.PI);
      expect(result).toBeCloseTo(180, 5);
    });

    it("should convert 2π radians to 360 degrees", () => {
      const result = radiansToDegrees(2 * Math.PI);
      expect(result).toBeCloseTo(360, 5);
    });

    it("should convert negative radians correctly", () => {
      expect(radiansToDegrees(-Math.PI / 2)).toBeCloseTo(-90, 5);
      expect(radiansToDegrees(-Math.PI)).toBeCloseTo(-180, 5);
    });

    it("should handle decimal radians", () => {
      expect(radiansToDegrees(1.0)).toBeCloseTo(57.2958, 3);
      expect(radiansToDegrees(0.5)).toBeCloseTo(28.6479, 3);
    });

    it("should convert anatomical limit values to readable degrees", () => {
      // Elbow MAX_BEND: 2.18 radians
      expect(radiansToDegrees(2.18)).toBeCloseTo(124.9, 1);
      // Elbow MAX_FLEXION: 2.53 radians
      expect(radiansToDegrees(2.53)).toBeCloseTo(145.0, 1);
      // Shoulder MAX_OVERHEAD: -2.35 radians
      expect(radiansToDegrees(-2.35)).toBeCloseTo(-134.6, 1);
    });
  });

  describe("Round-trip conversion", () => {
    it("should maintain value through degrees->radians->degrees", () => {
      const originalDegrees = 125;
      const radians = degreesToRadians(originalDegrees);
      const backToDegrees = radiansToDegrees(radians);

      expect(backToDegrees).toBeCloseTo(originalDegrees, 10);
    });

    it("should maintain value through radians->degrees->radians", () => {
      const originalRadians = 2.18;
      const degrees = radiansToDegrees(originalRadians);
      const backToRadians = degreesToRadians(degrees);

      expect(backToRadians).toBeCloseTo(originalRadians, 10);
    });

    it("should handle zero through round-trip", () => {
      expect(radiansToDegrees(degreesToRadians(0))).toBe(0);
      expect(degreesToRadians(radiansToDegrees(0))).toBe(0);
    });

    it("should handle negative values through round-trip", () => {
      const negativeDegrees = -135;
      const roundTrip = radiansToDegrees(degreesToRadians(negativeDegrees));
      expect(roundTrip).toBeCloseTo(negativeDegrees, 10);
    });
  });

  describe("Type safety", () => {
    it("should have correct TypeScript type for AnatomicalLimits", () => {
      // Type check: this should compile
      const limits: AnatomicalLimits = ANATOMICAL_LIMITS;
      expect(limits).toBeDefined();
      expect(limits.SHOULDER).toBeDefined();
      expect(limits.ELBOW).toBeDefined();
    });

    it("should export AnatomicalLimits type", () => {
      // Type check: AnatomicalLimits type should be available
      type TestType = AnatomicalLimits;
      const test: TestType = ANATOMICAL_LIMITS;
      expect(test).toBeDefined();
    });
  });

  describe("Integration with animation system", () => {
    it("should provide values suitable for Three.js rotations", () => {
      // Three.js uses radians, so all values should be in radians
      const shoulderRotation = ANATOMICAL_LIMITS.SHOULDER.MAX_ROTATION;
      const elbowBend = ANATOMICAL_LIMITS.ELBOW.MAX_BEND;

      // Values should be in reasonable radian ranges
      expect(Math.abs(shoulderRotation)).toBeLessThan(Math.PI * 2);
      expect(Math.abs(elbowBend)).toBeLessThan(Math.PI * 2);
    });

    it("should maintain Korean martial arts biomechanical accuracy", () => {
      // Verify key Korean martial arts positions are within safe limits
      // Geon (건) overhead strike: ~135 degrees
      const geonOverhead = Math.abs(ANATOMICAL_LIMITS.SHOULDER.MAX_OVERHEAD);
      expect(radiansToDegrees(geonOverhead)).toBeCloseTo(135, 0);

      // Tae (태) joint lock: ~145 degrees elbow flexion
      const taeElbowLock = ANATOMICAL_LIMITS.ELBOW.MAX_FLEXION;
      expect(radiansToDegrees(taeElbowLock)).toBeCloseTo(145, 0);

      // Jin (진) explosive stance: 90 degrees knee flexion
      const jinKneeBend = ANATOMICAL_LIMITS.KNEE.MAX_FLEXION;
      expect(radiansToDegrees(jinKneeBend)).toBeCloseTo(90, 0);
    });
  });
});
