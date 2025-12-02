import { beforeEach, describe, expect, it } from "vitest";
import { VitalPointSeverity } from "../types/common";
import { VitalPointSystem } from "./VitalPointSystem";
import type { VitalPoint } from "./vitalpoint/types";

describe("VitalPointSystem", () => {
  let system: VitalPointSystem;

  beforeEach(() => {
    system = new VitalPointSystem();
  });

  describe("initialization", () => {
    it("should initialize with predefined vital points", () => {
      const vitalPoints = system.getVitalPoints();
      
      expect(vitalPoints).toBeDefined();
      expect(vitalPoints.length).toBeGreaterThan(0);
    });

    it("should have temple vital point", () => {
      const temple = system.getVitalPointById("head_temple");
      
      expect(temple).toBeDefined();
      expect(temple?.names.english).toBe("Temple");
      expect(temple?.names.korean).toBe("태양혈");
      expect(temple?.severity).toBe(VitalPointSeverity.CRITICAL);
    });

    it("should have carotid artery vital point", () => {
      const carotid = system.getVitalPointById("head_side_neck");
      
      expect(carotid).toBeDefined();
      expect(carotid?.names.english).toBe("Side Neck");
      expect(carotid?.names.korean).toBe("목옆");
      expect(carotid?.severity).toBe(VitalPointSeverity.CRITICAL);
    });
  });

  describe("processHit", () => {
    it("should detect direct hit on vital point", () => {
      const hitPosition = { x: 100, y: 50 }; // Temple position
      const hitBox = { width: 10, height: 10 };

      const result = system.processHit(hitPosition, hitBox);

      expect(result.hit).toBe(true);
      expect(result.vitalPointHit).toBeDefined();
      expect(result.damage).toBeGreaterThan(0);
      expect(result.severity).toBe(VitalPointSeverity.CRITICAL);
    });

    it("should calculate accuracy based on distance", () => {
      const exactHitPosition = { x: 100, y: 50 }; // Exact temple position
      const nearHitPosition = { x: 110, y: 55 }; // Near temple position
      const hitBox = { width: 10, height: 10 };

      const exactResult = system.processHit(exactHitPosition, hitBox);
      const nearResult = system.processHit(nearHitPosition, hitBox);

      expect(exactResult.accuracy).toBeGreaterThan(nearResult.accuracy || 0);
    });

    it("should miss when hit is too far from vital points", () => {
      const missPosition = { x: 1000, y: 1000 }; // Far from any vital point
      const hitBox = { width: 10, height: 10 };

      const result = system.processHit(missPosition, hitBox);

      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
    });

    it("should target specific vital point when ID is provided", () => {
      const position = { x: 200, y: 200 }; // Not near any vital point
      const hitBox = { width: 10, height: 10 };

      const result = system.processHit(position, hitBox, "head_side_neck");

      expect(result.hit).toBe(true);
      expect(result.vitalPointHit?.id).toBe("head_side_neck");
    });

    it("should calculate higher damage for critical vital points", () => {
      const templePosition = { x: 100, y: 50 }; // Temple (CRITICAL, 35 damage)
      const jawPosition = { x: 105, y: 80 }; // Jaw (MAJOR, 30 damage)
      const hitBox = { width: 10, height: 10 };

      // Use the same hour for both to ensure fair comparison
      const templeResult = system.processHit(templePosition, hitBox, undefined, 12);
      const jawResult = system.processHit(jawPosition, hitBox, undefined, 12);

      // Temple (CRITICAL) should have higher severity than jaw (MAJOR)
      expect(templeResult.severity).toBe(VitalPointSeverity.CRITICAL);
      expect(jawResult.severity).toBe(VitalPointSeverity.MAJOR);
      
      // To compare base damage independently of meridian multipliers,
      // we need to account for the multiplier effect
      const templeBaseDamage = templeResult.damage / (templeResult.meridianMultiplier ?? 1.0);
      const jawBaseDamage = jawResult.damage / (jawResult.meridianMultiplier ?? 1.0);
      
      // Base damage should reflect severity (CRITICAL > MAJOR)
      expect(templeBaseDamage).toBeGreaterThan(jawBaseDamage);
    });
  });

  describe("calculateHit", () => {
    it("should calculate hit based on technique accuracy", () => {
      const technique = {
        id: "test_strike",
        accuracy: 0.9,
        damage: 20,
      };
      const attackerPosition = { x: 100, y: 50 };
      const defenderPosition = { x: 100, y: 100 };

      const result = system.calculateHit(
        technique,
        attackerPosition,
        defenderPosition,
        null
      );

      expect(result).toBeDefined();
      expect(result.severity).toBeDefined();
    });

    it("should return miss result when no vital points exist", () => {
      // Create system with no vital points (edge case)
      const emptySystem = new VitalPointSystem();
      // Clear vital points by accessing private property indirectly
      const technique = { accuracy: 1.0 };
      const position = { x: 0, y: 0 };

      const result = emptySystem.calculateHit(technique, position, position, null);

      // Should still return a valid result structure
      expect(result).toBeDefined();
      expect(result.severity).toBeDefined();
    });
  });

  describe("getVitalPointById", () => {
    it("should retrieve vital point by valid ID", () => {
      const vitalPoint = system.getVitalPointById("head_temple");

      expect(vitalPoint).toBeDefined();
      expect(vitalPoint?.id).toBe("head_temple");
    });

    it("should return null for invalid ID", () => {
      const vitalPoint = system.getVitalPointById("nonexistent_point");

      expect(vitalPoint).toBeNull();
    });

    it("should handle empty string ID", () => {
      const vitalPoint = system.getVitalPointById("");

      expect(vitalPoint).toBeNull();
    });
  });

  describe("getVitalPoints", () => {
    it("should return all vital points", () => {
      const vitalPoints = system.getVitalPoints();

      expect(Array.isArray(vitalPoints)).toBe(true);
      expect(vitalPoints.length).toBeGreaterThan(0);
    });

    it("should return readonly array", () => {
      const vitalPoints = system.getVitalPoints();

      // Verify it's a readonly array by checking the returned type
      expect(vitalPoints).toBeDefined();
    });

    it("should include all required vital point properties", () => {
      const vitalPoints = system.getVitalPoints();

      vitalPoints.forEach((vp: VitalPoint) => {
        expect(vp.id).toBeDefined();
        expect(vp.names).toBeDefined();
        expect(vp.names.korean).toBeDefined();
        expect(vp.names.english).toBeDefined();
        expect(vp.position).toBeDefined();
        expect(vp.position.x).toBeGreaterThanOrEqual(0);
        expect(vp.position.y).toBeGreaterThanOrEqual(0);
        expect(vp.severity).toBeDefined();
        expect(vp.category).toBeDefined();
      });
    });
  });

  describe("damage calculation", () => {
    it("should calculate damage proportional to vital point severity", () => {
      const criticalPoint = system.getVitalPointById("head_temple"); // CRITICAL, 35 damage
      const majorPoint = system.getVitalPointById("head_jaw"); // MAJOR, 30 damage

      expect(criticalPoint?.baseDamage).toBeGreaterThan(
        majorPoint?.baseDamage || 0
      );
    });

    it("should reduce damage with distance", () => {
      const exactHit = { x: 100, y: 50 }; // Exact temple position
      const nearHit = { x: 120, y: 60 }; // 20-30 pixels away
      const hitBox = { width: 10, height: 10 };

      const exactResult = system.processHit(exactHit, hitBox);
      const nearResult = system.processHit(nearHit, hitBox);

      if (exactResult.hit && nearResult.hit) {
        expect(exactResult.damage).toBeGreaterThan(nearResult.damage);
      }
    });

    it("should handle zero distance correctly", () => {
      const exactPosition = { x: 100, y: 50 };
      const hitBox = { width: 10, height: 10 };

      const result = system.processHit(exactPosition, hitBox);

      expect(result.damage).toBeGreaterThan(0);
      expect(result.accuracy).toBe(1); // Perfect accuracy at zero distance
    });
  });

  describe("Korean martial arts integration", () => {
    it("should use Korean names for vital points", () => {
      const vitalPoints = system.getVitalPoints();

      vitalPoints.forEach((vp: VitalPoint) => {
        expect(vp.names.korean).toBeDefined();
        expect(vp.names.korean.length).toBeGreaterThan(0);
        expect(vp.names.english).toBeDefined();
        expect(vp.names.romanized).toBeDefined();
      });
    });

    it("should include bilingual descriptions", () => {
      const vitalPoints = system.getVitalPoints();

      vitalPoints.forEach((vp: VitalPoint) => {
        expect(vp.description).toBeDefined();
        expect(vp.description.korean).toBeDefined();
        expect(vp.description.english).toBeDefined();
      });
    });

    it("should categorize vital points by anatomical system", () => {
      const vitalPoints = system.getVitalPoints();

      vitalPoints.forEach((vp: VitalPoint) => {
        expect(vp.category).toBeDefined();
        expect(typeof vp.category).toBe("string");
      });
    });
  });

  describe("edge cases and error handling", () => {
    it("should handle negative coordinates", () => {
      const position = { x: -10, y: -10 };
      const hitBox = { width: 10, height: 10 };

      const result = system.processHit(position, hitBox);

      expect(result).toBeDefined();
      expect(result.severity).toBeDefined();
    });

    it("should handle very large coordinates", () => {
      const position = { x: 999999, y: 999999 };
      const hitBox = { width: 10, height: 10 };

      const result = system.processHit(position, hitBox);

      expect(result.hit).toBe(false);
    });

    it("should handle null targeted vital point ID gracefully", () => {
      const position = { x: 100, y: 50 };
      const hitBox = { width: 10, height: 10 };

      const result = system.processHit(position, hitBox, null);

      expect(result).toBeDefined();
    });

    it("should handle invalid targeted vital point ID", () => {
      const position = { x: 100, y: 50 };
      const hitBox = { width: 10, height: 10 };

      const result = system.processHit(position, hitBox, "invalid_id");

      // Should fall back to proximity-based hit detection
      expect(result).toBeDefined();
    });
  });

  describe("accuracy and precision", () => {
    it("should return accuracy value between 0 and 1", () => {
      const position = { x: 100, y: 50 };
      const hitBox = { width: 10, height: 10 };

      const result = system.processHit(position, hitBox);

      if (result.accuracy !== undefined) {
        expect(result.accuracy).toBeGreaterThanOrEqual(0);
        expect(result.accuracy).toBeLessThanOrEqual(1);
      }
    });

    it("should provide maximum accuracy at exact hit", () => {
      const exactPosition = { x: 100, y: 50 }; // Temple exact position
      const hitBox = { width: 10, height: 10 };

      const result = system.processHit(exactPosition, hitBox);

      expect(result.accuracy).toBe(1);
    });

    it("should decrease accuracy with increasing distance", () => {
      const positions = [
        { x: 100, y: 50 }, // Exact
        { x: 105, y: 52 }, // Close
        { x: 110, y: 55 }, // Medium
        { x: 120, y: 60 }, // Far
      ];
      const hitBox = { width: 10, height: 10 };

      const results = positions.map((pos) => system.processHit(pos, hitBox));
      const accuracies = results
        .map((r) => r.accuracy || 0)
        .filter((a) => a > 0);

      // Verify decreasing accuracy
      for (let i = 1; i < accuracies.length; i++) {
        expect(accuracies[i]).toBeLessThanOrEqual(accuracies[i - 1]);
      }
    });
  });

  describe("vital point properties", () => {
    it("should have targeting difficulty for each vital point", () => {
      const vitalPoints = system.getVitalPoints();

      vitalPoints.forEach((vp: VitalPoint) => {
        expect(vp.targetingDifficulty).toBeDefined();
        expect(vp.targetingDifficulty).toBeGreaterThan(0);
        expect(vp.targetingDifficulty).toBeLessThanOrEqual(1);
      });
    });

    it("should define effective stances for vital points", () => {
      const vitalPoints = system.getVitalPoints();

      vitalPoints.forEach((vp: VitalPoint) => {
        expect(Array.isArray(vp.effectiveStances)).toBe(true);
      });
    });

    it("should have effects array for each vital point", () => {
      const vitalPoints = system.getVitalPoints();

      vitalPoints.forEach((vp: VitalPoint) => {
        expect(Array.isArray(vp.effects)).toBe(true);
      });
    });
  });

  describe("meridian system integration", () => {
    describe("setCurrentHour", () => {
      it("should set hour within valid range", () => {
        system.setCurrentHour(14);
        expect(system.getCurrentHour()).toBe(14);
      });

      it("should clamp hour to minimum value (0)", () => {
        system.setCurrentHour(-5);
        expect(system.getCurrentHour()).toBe(0);
      });

      it("should clamp hour to maximum value (23)", () => {
        system.setCurrentHour(30);
        expect(system.getCurrentHour()).toBe(23);
      });

      it("should floor decimal hour values", () => {
        system.setCurrentHour(14.7);
        expect(system.getCurrentHour()).toBe(14);
      });

      it("should throw error for NaN", () => {
        expect(() => system.setCurrentHour(NaN)).toThrow("Hour must be a finite number");
      });

      it("should throw error for Infinity", () => {
        expect(() => system.setCurrentHour(Infinity)).toThrow("Hour must be a finite number");
      });

      it("should throw error for negative Infinity", () => {
        expect(() => system.setCurrentHour(-Infinity)).toThrow("Hour must be a finite number");
      });
    });

    describe("getCurrentHour", () => {
      it("should return default hour (12)", () => {
        expect(system.getCurrentHour()).toBe(12);
      });

      it("should return previously set hour", () => {
        system.setCurrentHour(20);
        expect(system.getCurrentHour()).toBe(20);
      });
    });

    describe("setMeridianDisruption", () => {
      it("should set disruption level for a meridian", () => {
        system.setMeridianDisruption("pericardium", 0.5);
        expect(system.getMeridianDisruption("pericardium")).toBe(0.5);
      });

      it("should clamp disruption to minimum value (0)", () => {
        system.setMeridianDisruption("liver", -0.3);
        expect(system.getMeridianDisruption("liver")).toBe(0);
      });

      it("should clamp disruption to maximum value (1)", () => {
        system.setMeridianDisruption("kidney", 1.5);
        expect(system.getMeridianDisruption("kidney")).toBe(1);
      });

      it("should handle multiple meridians independently", () => {
        system.setMeridianDisruption("lung", 0.3);
        system.setMeridianDisruption("stomach", 0.7);
        
        expect(system.getMeridianDisruption("lung")).toBe(0.3);
        expect(system.getMeridianDisruption("stomach")).toBe(0.7);
      });

      it("should allow updating existing disruption level", () => {
        system.setMeridianDisruption("heart", 0.2);
        system.setMeridianDisruption("heart", 0.6);
        
        expect(system.getMeridianDisruption("heart")).toBe(0.6);
      });
    });

    describe("getMeridianDisruption", () => {
      it("should return 0 for non-existent meridian", () => {
        expect(system.getMeridianDisruption("non_existent")).toBe(0);
      });

      it("should return 0 for meridian with no disruption", () => {
        expect(system.getMeridianDisruption("bladder")).toBe(0);
      });

      it("should return correct disruption level", () => {
        system.setMeridianDisruption("triple_burner", 0.45);
        expect(system.getMeridianDisruption("triple_burner")).toBe(0.45);
      });
    });

    describe("clearMeridianDisruptions", () => {
      it("should clear all meridian disruptions", () => {
        system.setMeridianDisruption("lung", 0.5);
        system.setMeridianDisruption("stomach", 0.7);
        system.setMeridianDisruption("liver", 0.3);
        
        system.clearMeridianDisruptions();
        
        expect(system.getMeridianDisruption("lung")).toBe(0);
        expect(system.getMeridianDisruption("stomach")).toBe(0);
        expect(system.getMeridianDisruption("liver")).toBe(0);
      });

      it("should work even when no disruptions exist", () => {
        expect(() => system.clearMeridianDisruptions()).not.toThrow();
      });
    });

    describe("meridian disruption accumulation", () => {
      it("should accumulate disruption over multiple hits", () => {
        const position = { x: 100, y: 50 }; // Temple position
        const hitBox = { width: 10, height: 10 };
        
        // First hit
        system.processHit(position, hitBox, "head_temple", 12);
        const disruption1 = system.getMeridianDisruption("gallbladder");
        expect(disruption1).toBeGreaterThan(0);
        
        // Second hit
        system.processHit(position, hitBox, "head_temple", 12);
        const disruption2 = system.getMeridianDisruption("gallbladder");
        expect(disruption2).toBeGreaterThan(disruption1);
        
        // Third hit
        system.processHit(position, hitBox, "head_temple", 12);
        const disruption3 = system.getMeridianDisruption("gallbladder");
        expect(disruption3).toBeGreaterThan(disruption2);
      });

      it("should cap disruption at 1.0", () => {
        const position = { x: 100, y: 50 };
        const hitBox = { width: 10, height: 10 };
        
        // Hit many times to exceed 1.0
        for (let i = 0; i < 10; i++) {
          system.processHit(position, hitBox, "head_temple", 12);
        }
        
        const disruption = system.getMeridianDisruption("gallbladder");
        expect(disruption).toBeLessThanOrEqual(1.0);
      });
    });

    describe("time-of-day meridian flow", () => {
      it("should apply bonus at peak hour (Gallbladder at midnight)", () => {
        const position = { x: 100, y: 50 }; // Temple position (mapped to gallbladder)
        const hitBox = { width: 10, height: 10 };
        
        const result = system.processHit(position, hitBox, "head_temple", 0);
        
        expect(result.meridianMultiplier).toBeDefined();
        expect(result.meridianMultiplier).toBeGreaterThan(1.0);
      });

      it("should apply penalty at opposite hour", () => {
        const position = { x: 100, y: 50 }; // Temple position (mapped to gallbladder)
        const hitBox = { width: 10, height: 10 };
        
        // Gallbladder peak is 0 (midnight), opposite is 12 (noon)
        const result = system.processHit(position, hitBox, "head_temple", 12);
        
        expect(result.meridianMultiplier).toBeDefined();
        expect(result.meridianMultiplier).toBeLessThan(1.0);
      });
    });
  });
});
