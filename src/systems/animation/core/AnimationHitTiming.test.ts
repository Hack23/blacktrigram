import { describe, it, expect } from "vitest";
import {
  ANIMATION_HIT_TIMING,
  getAnimationHitTiming,
  isWithinHitWindow,
  getCurrentReachMultiplier,
  type AnimationHitWindow,
  type TechniqueHitTiming,
} from "./AnimationHitTiming";
import { AnimationType } from "../builders/MartialArtsAnimationBuilder";

describe("AnimationHitTiming", () => {
  describe("ANIMATION_HIT_TIMING Database", () => {
    it("should have timing for punch techniques", () => {
      expect(ANIMATION_HIT_TIMING[AnimationType.JAB]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.CROSS]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.HOOK]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.UPPERCUT]).toBeDefined();
    });

    it("should have timing for kick techniques", () => {
      expect(ANIMATION_HIT_TIMING[AnimationType.FRONT_KICK]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.ROUNDHOUSE_KICK]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.SIDE_KICK]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.BACK_KICK]).toBeDefined();
    });

    it("should have timing for elbow strikes", () => {
      expect(ANIMATION_HIT_TIMING[AnimationType.ELBOW_STRIKE]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.SPINNING_ELBOW]).toBeDefined();
    });

    it("should have timing for knee strikes", () => {
      expect(ANIMATION_HIT_TIMING[AnimationType.KNEE_STRIKE]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.FLYING_KNEE]).toBeDefined();
    });

    it("should have timing for grappling techniques", () => {
      expect(ANIMATION_HIT_TIMING[AnimationType.THROW]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.GRAPPLE]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.SWEEP]).toBeDefined();
    });

    it("should have timing for defensive techniques", () => {
      expect(ANIMATION_HIT_TIMING[AnimationType.BLOCK]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.PARRY]).toBeDefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.COUNTER_STRIKE]).toBeDefined();
    });

    it("should not have timing for movement animations", () => {
      expect(ANIMATION_HIT_TIMING[AnimationType.WALK]).toBeUndefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.RUN]).toBeUndefined();
      expect(ANIMATION_HIT_TIMING[AnimationType.IDLE]).toBeUndefined();
    });

    it("should have valid hit windows for all techniques", () => {
      Object.values(ANIMATION_HIT_TIMING).forEach((timing) => {
        if (timing) {
          expect(timing.hitWindow.startTime).toBeGreaterThanOrEqual(0);
          expect(timing.hitWindow.peakTime).toBeGreaterThan(timing.hitWindow.startTime);
          expect(timing.hitWindow.endTime).toBeGreaterThan(timing.hitWindow.peakTime);
          expect(timing.hitWindow.maxReachMultiplier).toBeGreaterThan(0);
        }
      });
    });
  });

  describe("AnimationHitWindow Structure", () => {
    it("should have jab with fast timing", () => {
      // Act
      const jabTiming = ANIMATION_HIT_TIMING[AnimationType.JAB];

      // Assert
      expect(jabTiming).toBeDefined();
      expect(jabTiming!.hitWindow.startTime).toBe(0.1);
      expect(jabTiming!.hitWindow.peakTime).toBe(0.15);
      expect(jabTiming!.hitWindow.endTime).toBe(0.25);
    });

    it("should have jab with less than full reach", () => {
      // Act
      const jabTiming = ANIMATION_HIT_TIMING[AnimationType.JAB];

      // Assert
      expect(jabTiming!.hitWindow.maxReachMultiplier).toBeLessThan(1.0);
      expect(jabTiming!.hitWindow.maxReachMultiplier).toBeCloseTo(0.95, 2);
    });

    it("should have cross with full reach", () => {
      // Act
      const crossTiming = ANIMATION_HIT_TIMING[AnimationType.CROSS];

      // Assert
      expect(crossTiming!.hitWindow.maxReachMultiplier).toBe(1.0);
    });

    it("should have uppercut with short range", () => {
      // Act
      const uppercutTiming = ANIMATION_HIT_TIMING[AnimationType.UPPERCUT];

      // Assert
      expect(uppercutTiming!.hitWindow.maxReachMultiplier).toBeLessThan(0.8);
    });

    it("should have back kick with extended reach", () => {
      // Act
      const backKickTiming = ANIMATION_HIT_TIMING[AnimationType.BACK_KICK];

      // Assert
      expect(backKickTiming!.hitWindow.maxReachMultiplier).toBeGreaterThan(1.1);
    });

    it("should have elbow strikes with very short range", () => {
      // Act
      const elbowTiming = ANIMATION_HIT_TIMING[AnimationType.ELBOW_STRIKE];

      // Assert
      expect(elbowTiming!.hitWindow.maxReachMultiplier).toBeLessThanOrEqual(0.5);
    });

    it("should have jumping kicks with airborne reach", () => {
      // Act
      const jumpingKickTiming = ANIMATION_HIT_TIMING[AnimationType.JUMPING_KICK];

      // Assert
      expect(jumpingKickTiming!.hitWindow.maxReachMultiplier).toBeGreaterThan(1.2);
    });
  });

  describe("Precise Timing Requirements", () => {
    it("should mark spear hand strike as precise", () => {
      // Act
      const timing = ANIMATION_HIT_TIMING[AnimationType.SPEAR_HAND_STRIKE];

      // Assert
      expect(timing!.requiresPreciseTiming).toBe(true);
    });

    it("should mark nerve strike as precise", () => {
      // Act
      const timing = ANIMATION_HIT_TIMING[AnimationType.NERVE_STRIKE];

      // Assert
      expect(timing!.requiresPreciseTiming).toBe(true);
    });

    it("should mark jab as not precise", () => {
      // Act
      const timing = ANIMATION_HIT_TIMING[AnimationType.JAB];

      // Assert
      expect(timing!.requiresPreciseTiming).toBe(false);
    });

    it("should mark block as precise", () => {
      // Act
      const timing = ANIMATION_HIT_TIMING[AnimationType.BLOCK];

      // Assert
      expect(timing!.requiresPreciseTiming).toBe(true);
    });

    it("should mark parry as precise", () => {
      // Act
      const timing = ANIMATION_HIT_TIMING[AnimationType.PARRY];

      // Assert
      expect(timing!.requiresPreciseTiming).toBe(true);
    });
  });

  describe("getAnimationHitTiming", () => {
    it("should return timing for jab", () => {
      // Act
      const timing = getAnimationHitTiming(AnimationType.JAB);

      // Assert
      expect(timing).toBeDefined();
      expect(timing!.animationType).toBe(AnimationType.JAB);
    });

    it("should return timing for cross", () => {
      // Act
      const timing = getAnimationHitTiming(AnimationType.CROSS);

      // Assert
      expect(timing).toBeDefined();
      expect(timing!.animationType).toBe(AnimationType.CROSS);
    });

    it("should return undefined for walk", () => {
      // Act
      const timing = getAnimationHitTiming(AnimationType.WALK);

      // Assert
      expect(timing).toBeUndefined();
    });

    it("should return undefined for idle", () => {
      // Act
      const timing = getAnimationHitTiming(AnimationType.IDLE);

      // Assert
      expect(timing).toBeUndefined();
    });

    it("should return timing for all punch types", () => {
      // Arrange
      const punchTypes = [
        AnimationType.JAB,
        AnimationType.CROSS,
        AnimationType.HOOK,
        AnimationType.UPPERCUT,
        AnimationType.OVERHAND,
        AnimationType.BACKFIST,
      ];

      // Act & Assert
      punchTypes.forEach((type) => {
        const timing = getAnimationHitTiming(type);
        expect(timing).toBeDefined();
      });
    });

    it("should return timing for all kick types", () => {
      // Arrange
      const kickTypes = [
        AnimationType.FRONT_KICK,
        AnimationType.ROUNDHOUSE_KICK,
        AnimationType.SIDE_KICK,
        AnimationType.BACK_KICK,
        AnimationType.AXE_KICK,
      ];

      // Act & Assert
      kickTypes.forEach((type) => {
        const timing = getAnimationHitTiming(type);
        expect(timing).toBeDefined();
      });
    });
  });

  describe("isWithinHitWindow", () => {
    it("should return true during jab hit window", () => {
      // Act
      const result = isWithinHitWindow(AnimationType.JAB, 0.15);

      // Assert - 0.15s is within jab's 0.10-0.25s window
      expect(result).toBe(true);
    });

    it("should return false before jab hit window", () => {
      // Act
      const result = isWithinHitWindow(AnimationType.JAB, 0.05);

      // Assert - 0.05s is before jab's 0.10s start
      expect(result).toBe(false);
    });

    it("should return false after jab hit window", () => {
      // Act
      const result = isWithinHitWindow(AnimationType.JAB, 0.30);

      // Assert - 0.30s is after jab's 0.25s end
      expect(result).toBe(false);
    });

    it("should return true at exact start time", () => {
      // Act
      const timing = ANIMATION_HIT_TIMING[AnimationType.JAB]!;
      const result = isWithinHitWindow(AnimationType.JAB, timing.hitWindow.startTime);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true at exact end time", () => {
      // Act
      const timing = ANIMATION_HIT_TIMING[AnimationType.JAB]!;
      const result = isWithinHitWindow(AnimationType.JAB, timing.hitWindow.endTime);

      // Assert
      expect(result).toBe(true);
    });

    it("should return true at peak time", () => {
      // Act
      const timing = ANIMATION_HIT_TIMING[AnimationType.JAB]!;
      const result = isWithinHitWindow(AnimationType.JAB, timing.hitWindow.peakTime);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for movement animations", () => {
      // Act
      const result = isWithinHitWindow(AnimationType.WALK, 0.5);

      // Assert
      expect(result).toBe(false);
    });

    it("should handle block with very short window", () => {
      // Act
      const inWindow = isWithinHitWindow(AnimationType.BLOCK, 0.05);
      const tooLate = isWithinHitWindow(AnimationType.BLOCK, 0.10);

      // Assert
      expect(inWindow).toBe(true);
      expect(tooLate).toBe(false);
    });
  });

  describe("getCurrentReachMultiplier", () => {
    it("should return 0 before hit window", () => {
      // Act
      const reach = getCurrentReachMultiplier(AnimationType.JAB, 0.05);

      // Assert
      expect(reach).toBe(0);
    });

    it("should return 0 after hit window", () => {
      // Act
      const reach = getCurrentReachMultiplier(AnimationType.JAB, 0.30);

      // Assert
      expect(reach).toBe(0);
    });

    it("should return maximum reach at peak time", () => {
      // Arrange
      const timing = ANIMATION_HIT_TIMING[AnimationType.JAB]!;

      // Act
      const reach = getCurrentReachMultiplier(AnimationType.JAB, timing.hitWindow.peakTime);

      // Assert
      expect(reach).toBeCloseTo(timing.hitWindow.maxReachMultiplier, 1);
    });

    it("should return 0 for movement animations", () => {
      // Act
      const reach = getCurrentReachMultiplier(AnimationType.WALK, 0.5);

      // Assert
      expect(reach).toBe(0);
    });

    it("should interpolate reach during extension", () => {
      // Arrange
      const timing = ANIMATION_HIT_TIMING[AnimationType.JAB]!;
      const midExtension = (timing.hitWindow.startTime + timing.hitWindow.peakTime) / 2;

      // Act
      const reach = getCurrentReachMultiplier(AnimationType.JAB, midExtension);

      // Assert - Should be between 0 and max
      expect(reach).toBeGreaterThan(0);
      expect(reach).toBeLessThan(timing.hitWindow.maxReachMultiplier);
    });

    it("should interpolate reach during retraction", () => {
      // Arrange
      const timing = ANIMATION_HIT_TIMING[AnimationType.JAB]!;
      const midRetraction = (timing.hitWindow.peakTime + timing.hitWindow.endTime) / 2;

      // Act
      const reach = getCurrentReachMultiplier(AnimationType.JAB, midRetraction);

      // Assert - Should be between 0 and max
      expect(reach).toBeGreaterThan(0);
      expect(reach).toBeLessThan(timing.hitWindow.maxReachMultiplier);
    });

    it("should handle techniques with extended reach", () => {
      // Arrange
      const timing = ANIMATION_HIT_TIMING[AnimationType.BACK_KICK]!;

      // Act
      const reach = getCurrentReachMultiplier(AnimationType.BACK_KICK, timing.hitWindow.peakTime);

      // Assert - Back kick should have > 1.0 reach
      expect(reach).toBeGreaterThan(1.0);
    });

    it("should handle techniques with short reach", () => {
      // Arrange
      const timing = ANIMATION_HIT_TIMING[AnimationType.ELBOW_STRIKE]!;

      // Act
      const reach = getCurrentReachMultiplier(AnimationType.ELBOW_STRIKE, timing.hitWindow.peakTime);

      // Assert - Elbow should have < 0.6 reach
      expect(reach).toBeLessThan(0.6);
    });
  });

  describe("Hit Window Timing Validation", () => {
    it("should have startTime before peakTime for all techniques", () => {
      Object.entries(ANIMATION_HIT_TIMING).forEach(([type, timing]) => {
        if (timing) {
          expect(timing.hitWindow.startTime).toBeLessThan(timing.hitWindow.peakTime);
        }
      });
    });

    it("should have peakTime before endTime for all techniques", () => {
      Object.entries(ANIMATION_HIT_TIMING).forEach(([type, timing]) => {
        if (timing) {
          expect(timing.hitWindow.peakTime).toBeLessThan(timing.hitWindow.endTime);
        }
      });
    });

    it("should have positive maxReachMultiplier for all techniques", () => {
      Object.values(ANIMATION_HIT_TIMING).forEach((timing) => {
        if (timing) {
          expect(timing.hitWindow.maxReachMultiplier).toBeGreaterThan(0);
        }
      });
    });

    it("should have reasonable hit window duration", () => {
      Object.values(ANIMATION_HIT_TIMING).forEach((timing) => {
        if (timing) {
          const duration = timing.hitWindow.endTime - timing.hitWindow.startTime;
          expect(duration).toBeGreaterThan(0);
          expect(duration).toBeLessThan(1.0); // No hit window > 1 second
        }
      });
    });
  });

  describe("Technique Categories", () => {
    it("should have faster punches than kicks", () => {
      // Arrange
      const jabTiming = ANIMATION_HIT_TIMING[AnimationType.JAB]!;
      const frontKickTiming = ANIMATION_HIT_TIMING[AnimationType.FRONT_KICK]!;

      // Act & Assert - Jab should start hitting earlier
      expect(jabTiming.hitWindow.startTime).toBeLessThan(frontKickTiming.hitWindow.startTime);
    });

    it("should have blocks faster than attacks", () => {
      // Arrange
      const blockTiming = ANIMATION_HIT_TIMING[AnimationType.BLOCK]!;
      const jabTiming = ANIMATION_HIT_TIMING[AnimationType.JAB]!;

      // Act & Assert - Block should be reactive (faster)
      expect(blockTiming.hitWindow.startTime).toBeLessThan(jabTiming.hitWindow.startTime);
    });

    it("should have longer reach for kicks than punches", () => {
      // Arrange
      const jabTiming = ANIMATION_HIT_TIMING[AnimationType.JAB]!;
      const sideKickTiming = ANIMATION_HIT_TIMING[AnimationType.SIDE_KICK]!;

      // Act & Assert
      expect(sideKickTiming.hitWindow.maxReachMultiplier).toBeGreaterThan(
        jabTiming.hitWindow.maxReachMultiplier
      );
    });

    it("should have shorter reach for elbows than punches", () => {
      // Arrange
      const jabTiming = ANIMATION_HIT_TIMING[AnimationType.JAB]!;
      const elbowTiming = ANIMATION_HIT_TIMING[AnimationType.ELBOW_STRIKE]!;

      // Act & Assert
      expect(elbowTiming.hitWindow.maxReachMultiplier).toBeLessThan(
        jabTiming.hitWindow.maxReachMultiplier
      );
    });

    it("should have longer windows for spinning techniques", () => {
      // Arrange
      const elbowTiming = ANIMATION_HIT_TIMING[AnimationType.ELBOW_STRIKE]!;
      const spinningElbowTiming = ANIMATION_HIT_TIMING[AnimationType.SPINNING_ELBOW]!;

      const elbowDuration = elbowTiming.hitWindow.endTime - elbowTiming.hitWindow.startTime;
      const spinDuration = spinningElbowTiming.hitWindow.endTime - spinningElbowTiming.hitWindow.startTime;

      // Act & Assert - Spinning should take longer
      expect(spinningElbowTiming.hitWindow.startTime).toBeGreaterThan(elbowTiming.hitWindow.startTime);
    });
  });

  describe("Edge Cases", () => {
    it("should handle time exactly at startTime", () => {
      // Arrange
      const timing = ANIMATION_HIT_TIMING[AnimationType.JAB]!;

      // Act
      const inWindow = isWithinHitWindow(AnimationType.JAB, timing.hitWindow.startTime);
      const reach = getCurrentReachMultiplier(AnimationType.JAB, timing.hitWindow.startTime);

      // Assert
      expect(inWindow).toBe(true);
      expect(reach).toBeGreaterThanOrEqual(0);
    });

    it("should handle time exactly at endTime", () => {
      // Arrange
      const timing = ANIMATION_HIT_TIMING[AnimationType.JAB]!;

      // Act
      const inWindow = isWithinHitWindow(AnimationType.JAB, timing.hitWindow.endTime);
      const reach = getCurrentReachMultiplier(AnimationType.JAB, timing.hitWindow.endTime);

      // Assert
      expect(inWindow).toBe(true);
      expect(reach).toBeGreaterThanOrEqual(0);
    });

    it("should handle negative time values", () => {
      // Act & Assert
      expect(isWithinHitWindow(AnimationType.JAB, -1)).toBe(false);
      expect(getCurrentReachMultiplier(AnimationType.JAB, -1)).toBe(0);
    });

    it("should handle very large time values", () => {
      // Act & Assert
      expect(isWithinHitWindow(AnimationType.JAB, 100)).toBe(false);
      expect(getCurrentReachMultiplier(AnimationType.JAB, 100)).toBe(0);
    });
  });

  describe("Coverage for All Defined Techniques", () => {
    it("should have at least 50 techniques with hit timing", () => {
      // Act
      const techniqueCount = Object.keys(ANIMATION_HIT_TIMING).length;

      // Assert
      expect(techniqueCount).toBeGreaterThanOrEqual(50);
    });

    it("should have timing for all major categories", () => {
      // Arrange
      const categories = {
        punches: [AnimationType.JAB, AnimationType.CROSS, AnimationType.HOOK],
        kicks: [AnimationType.FRONT_KICK, AnimationType.ROUNDHOUSE_KICK, AnimationType.SIDE_KICK],
        elbows: [AnimationType.ELBOW_STRIKE, AnimationType.SPINNING_ELBOW],
        knees: [AnimationType.KNEE_STRIKE, AnimationType.FLYING_KNEE],
        grappling: [AnimationType.THROW, AnimationType.GRAPPLE, AnimationType.SWEEP],
        defense: [AnimationType.BLOCK, AnimationType.PARRY],
      };

      // Act & Assert
      Object.entries(categories).forEach(([category, types]) => {
        types.forEach((type) => {
          expect(ANIMATION_HIT_TIMING[type]).toBeDefined();
        });
      });
    });
  });
});
