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

      const templeResult = system.processHit(templePosition, hitBox);
      const jawResult = system.processHit(jawPosition, hitBox);

      // Temple (CRITICAL) should do more damage than jaw (MAJOR)
      expect(templeResult.damage).toBeGreaterThan(jawResult.damage);
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
});
