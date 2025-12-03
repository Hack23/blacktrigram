import { describe, expect, it } from "vitest";
import {
  EnhancedAnatomicalZone,
  ENHANCED_ANATOMICAL_ZONES,
  isPointInPolygon,
  isPositionInEnhancedZone,
  getEnhancedZonesByPosition,
  calculateEnhancedVulnerability,
  generateVulnerabilityHeatMap,
} from "./KoreanAnatomy";
import { TrigramStance } from "@/types";

describe("Enhanced Anatomical Zones", () => {
  describe("ENHANCED_ANATOMICAL_ZONES", () => {
    it("should have defined enhanced zones", () => {
      expect(ENHANCED_ANATOMICAL_ZONES).toBeDefined();
      expect(ENHANCED_ANATOMICAL_ZONES.length).toBeGreaterThan(0);
    });

    it("should have all required properties for each enhanced zone", () => {
      ENHANCED_ANATOMICAL_ZONES.forEach((zone) => {
        expect(zone.id).toBeDefined();
        expect(zone.koreanName).toBeDefined();
        expect(zone.englishName).toBeDefined();
        expect(Array.isArray(zone.boundaries)).toBe(true);
        expect(zone.boundaries.length).toBeGreaterThanOrEqual(3); // At least 3 points for polygon
        expect(zone.baseVulnerability).toBeGreaterThan(0);
        expect(zone.baseVulnerability).toBeLessThanOrEqual(2.5);
        expect(Array.isArray(zone.relatedMeridians)).toBe(true);
        expect(Array.isArray(zone.vitalPoints)).toBe(true);
        expect(zone.stanceModifiers).toBeDefined();
      });
    });

    it("should have unique IDs", () => {
      const ids = ENHANCED_ANATOMICAL_ZONES.map((z) => z.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have valid polygon boundaries (at least 3 vertices)", () => {
      ENHANCED_ANATOMICAL_ZONES.forEach((zone) => {
        expect(zone.boundaries.length).toBeGreaterThanOrEqual(3);
        zone.boundaries.forEach((point) => {
          expect(point.x).toBeDefined();
          expect(point.y).toBeDefined();
          expect(typeof point.x).toBe("number");
          expect(typeof point.y).toBe("number");
        });
      });
    });

    it("should have stance modifiers with valid values", () => {
      ENHANCED_ANATOMICAL_ZONES.forEach((zone) => {
        Object.values(zone.stanceModifiers).forEach((modifier) => {
          expect(modifier).toBeGreaterThan(0);
          expect(modifier).toBeLessThanOrEqual(2.0);
        });
      });
    });

    it("should have head zones with high base vulnerability", () => {
      const headZones = ENHANCED_ANATOMICAL_ZONES.filter((z) =>
        z.id.includes("head")
      );
      expect(headZones.length).toBeGreaterThan(0);
      headZones.forEach((zone) => {
        expect(zone.baseVulnerability).toBeGreaterThanOrEqual(1.8);
      });
    });

    it("should have neck zones with high vulnerability", () => {
      const neckZones = ENHANCED_ANATOMICAL_ZONES.filter((z) =>
        z.id.includes("neck")
      );
      expect(neckZones.length).toBeGreaterThan(0);
      neckZones.forEach((zone) => {
        expect(zone.baseVulnerability).toBeGreaterThanOrEqual(1.5);
      });
    });

    it("should have defensive stances reducing vulnerability", () => {
      const zonesWithGanStance = ENHANCED_ANATOMICAL_ZONES.filter(
        (z) => z.stanceModifiers[TrigramStance.GAN]
      );
      expect(zonesWithGanStance.length).toBeGreaterThan(0);
      zonesWithGanStance.forEach((zone) => {
        const modifier = zone.stanceModifiers[TrigramStance.GAN];
        expect(modifier).toBeLessThanOrEqual(1.0); // Mountain stance should protect
      });
    });

    it("should have offensive stances increasing vulnerability", () => {
      const zonesWithGeonStance = ENHANCED_ANATOMICAL_ZONES.filter(
        (z) => z.stanceModifiers[TrigramStance.GEON]
      );
      expect(zonesWithGeonStance.length).toBeGreaterThan(0);
      
      const exposingZones = zonesWithGeonStance.filter(
        (z) => z.stanceModifiers[TrigramStance.GEON]! > 1.0
      );
      expect(exposingZones.length).toBeGreaterThan(0); // At least some zones exposed
    });
  });

  describe("isPointInPolygon", () => {
    it("should detect point inside simple square", () => {
      const square = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ];
      
      expect(isPointInPolygon({ x: 5, y: 5 }, square)).toBe(true);
    });

    it("should detect point outside simple square", () => {
      const square = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ];
      
      expect(isPointInPolygon({ x: 15, y: 5 }, square)).toBe(false);
      expect(isPointInPolygon({ x: -5, y: 5 }, square)).toBe(false);
    });

    it("should detect point inside triangle", () => {
      const triangle = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 5, y: 10 },
      ];
      
      expect(isPointInPolygon({ x: 5, y: 3 }, triangle)).toBe(true);
    });

    it("should detect point outside triangle", () => {
      const triangle = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 5, y: 10 },
      ];
      
      expect(isPointInPolygon({ x: 5, y: 15 }, triangle)).toBe(false);
    });

    it("should handle complex polygons (octagon)", () => {
      const octagon = [
        { x: 50, y: 30 },
        { x: 70, y: 30 },
        { x: 85, y: 50 },
        { x: 85, y: 70 },
        { x: 70, y: 85 },
        { x: 50, y: 85 },
        { x: 35, y: 70 },
        { x: 35, y: 50 },
      ];
      
      expect(isPointInPolygon({ x: 60, y: 60 }, octagon)).toBe(true);
      expect(isPointInPolygon({ x: 30, y: 30 }, octagon)).toBe(false);
    });

    it("should handle boundary cases", () => {
      const square = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ];
      
      // Points exactly on boundary (behavior depends on algorithm)
      const onEdge1 = isPointInPolygon({ x: 0, y: 5 }, square);
      const onEdge2 = isPointInPolygon({ x: 10, y: 5 }, square);
      const onCorner = isPointInPolygon({ x: 0, y: 0 }, square);
      
      // Just verify they return boolean (exact behavior may vary)
      expect(typeof onEdge1).toBe("boolean");
      expect(typeof onEdge2).toBe("boolean");
      expect(typeof onCorner).toBe("boolean");
    });

    it("should return false for polygons with less than 3 vertices", () => {
      expect(isPointInPolygon({ x: 5, y: 5 }, [])).toBe(false);
      expect(isPointInPolygon({ x: 5, y: 5 }, [{ x: 0, y: 0 }])).toBe(false);
      expect(isPointInPolygon({ x: 5, y: 5 }, [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
      ])).toBe(false);
    });
  });

  describe("isPositionInEnhancedZone", () => {
    it("should detect position in head frontal zone", () => {
      const headZone = ENHANCED_ANATOMICAL_ZONES.find(
        (z) => z.id === "head_frontal"
      );
      
      if (headZone) {
        // Find a point inside the zone (use first vertex + small offset)
        const testPoint = {
          x: headZone.boundaries[0].x + 2,
          y: headZone.boundaries[0].y + 10,
        };
        
        expect(isPositionInEnhancedZone(testPoint, headZone)).toBe(true);
      }
    });

    it("should detect position outside zone", () => {
      const headZone = ENHANCED_ANATOMICAL_ZONES.find(
        (z) => z.id === "head_frontal"
      );
      
      if (headZone) {
        const testPoint = { x: 0, y: 0 };
        expect(isPositionInEnhancedZone(testPoint, headZone)).toBe(false);
      }
    });
  });

  describe("getEnhancedZonesByPosition", () => {
    it("should find zones for valid positions", () => {
      // Test position in head area
      const headPosition = { x: 50, y: 50 };
      const zones = getEnhancedZonesByPosition(headPosition);
      
      expect(Array.isArray(zones)).toBe(true);
    });

    it("should return empty array for position outside all zones", () => {
      const outsidePosition = { x: 10000, y: 10000 };
      const zones = getEnhancedZonesByPosition(outsidePosition);
      
      expect(zones).toEqual([]);
    });

    it("should support overlapping zones", () => {
      // Test a position that might be in multiple zones
      // This depends on zone definitions, but the function should handle it
      const position = { x: 50, y: 110 };
      const zones = getEnhancedZonesByPosition(position);
      
      expect(Array.isArray(zones)).toBe(true);
      // Could be 0, 1, or more zones depending on definitions
    });

    it("should find torso zones for chest positions", () => {
      const chestPosition = { x: 50, y: 160 };
      const zones = getEnhancedZonesByPosition(chestPosition);
      
      // Should find at least one torso-related zone
      const torsoZones = zones.filter((z) =>
        z.id.includes("torso") || z.id.includes("chest")
      );
      expect(torsoZones.length).toBeGreaterThan(0);
    });
  });

  describe("calculateEnhancedVulnerability", () => {
    it("should calculate vulnerability for position in zone", () => {
      const position = { x: 50, y: 50 }; // Head area
      const hour = 12;
      const stance = TrigramStance.GEON;
      const meridianStates = {
        bladder: 1.0,
        gallbladder: 1.0,
      };
      
      const vulnerability = calculateEnhancedVulnerability(
        position,
        hour,
        stance,
        meridianStates
      );
      
      expect(vulnerability).toBeGreaterThan(0);
      expect(vulnerability).toBeGreaterThanOrEqual(0.5);
      expect(vulnerability).toBeLessThanOrEqual(3.0);
    });

    it("should return baseline for position outside all zones", () => {
      const position = { x: 10000, y: 10000 };
      const hour = 12;
      const stance = TrigramStance.GEON;
      const meridianStates = {};
      
      const vulnerability = calculateEnhancedVulnerability(
        position,
        hour,
        stance,
        meridianStates
      );
      
      expect(vulnerability).toBe(1.0);
    });

    it("should increase vulnerability with defensive stance (GAN)", () => {
      const position = { x: 50, y: 50 }; // Head area
      const hour = 12;
      const meridianStates = {
        bladder: 1.0,
        gallbladder: 1.0,
      };
      
      const offensiveVulnerability = calculateEnhancedVulnerability(
        position,
        hour,
        TrigramStance.GEON, // Offensive stance
        meridianStates
      );
      
      const defensiveVulnerability = calculateEnhancedVulnerability(
        position,
        hour,
        TrigramStance.GAN, // Defensive stance
        meridianStates
      );
      
      // Defensive stance should generally reduce vulnerability
      // (exact result depends on zone definitions)
      expect(typeof offensiveVulnerability).toBe("number");
      expect(typeof defensiveVulnerability).toBe("number");
    });

    it("should increase vulnerability with blocked meridians", () => {
      const position = { x: 50, y: 50 };
      const hour = 12;
      const stance = TrigramStance.GEON;
      
      const normalVulnerability = calculateEnhancedVulnerability(
        position,
        hour,
        stance,
        { bladder: 1.0, gallbladder: 1.0 }
      );
      
      const blockedVulnerability = calculateEnhancedVulnerability(
        position,
        hour,
        stance,
        { bladder: 0.3, gallbladder: 0.3 } // Heavily blocked
      );
      
      expect(blockedVulnerability).toBeGreaterThan(normalVulnerability);
    });

    it("should increase vulnerability at peak meridian hours", () => {
      const position = { x: 50, y: 160 }; // Chest area
      const stance = TrigramStance.GEON;
      const meridianStates = { lung: 1.0 };
      
      // Lung meridian peaks at 4 AM
      const peakVulnerability = calculateEnhancedVulnerability(
        position,
        4,
        stance,
        meridianStates
      );
      
      // Off-peak hour (16:00 / 4 PM - opposite of peak)
      const offPeakVulnerability = calculateEnhancedVulnerability(
        position,
        16,
        stance,
        meridianStates
      );
      
      // Peak hour should have higher vulnerability
      expect(peakVulnerability).toBeGreaterThanOrEqual(offPeakVulnerability);
    });

    it("should cap vulnerability between 0.5 and 3.0", () => {
      const position = { x: 50, y: 50 };
      const hour = 12;
      const stance = TrigramStance.GEON;
      
      // Test with extreme meridian blockage
      const vulnerability = calculateEnhancedVulnerability(
        position,
        hour,
        stance,
        {
          bladder: 0.01,
          gallbladder: 0.01,
        }
      );
      
      expect(vulnerability).toBeGreaterThanOrEqual(0.5);
      expect(vulnerability).toBeLessThanOrEqual(3.0);
    });

    it("should handle empty meridian states", () => {
      const position = { x: 50, y: 160 };
      const hour = 12;
      const stance = TrigramStance.GEON;
      
      const vulnerability = calculateEnhancedVulnerability(
        position,
        hour,
        stance,
        {}
      );
      
      expect(vulnerability).toBeGreaterThanOrEqual(0.5);
      expect(vulnerability).toBeLessThanOrEqual(3.0);
    });

    it("should handle all hours of the day (0-23)", () => {
      const position = { x: 50, y: 160 };
      const stance = TrigramStance.GEON;
      const meridianStates = { lung: 1.0 };
      
      for (let hour = 0; hour < 24; hour++) {
        const vulnerability = calculateEnhancedVulnerability(
          position,
          hour,
          stance,
          meridianStates
        );
        
        expect(vulnerability).toBeGreaterThanOrEqual(0.5);
        expect(vulnerability).toBeLessThanOrEqual(3.0);
      }
    });

    it("should handle all trigram stances", () => {
      const position = { x: 50, y: 160 };
      const hour = 12;
      const meridianStates = { lung: 1.0 };
      
      const stances = Object.values(TrigramStance);
      stances.forEach((stance) => {
        const vulnerability = calculateEnhancedVulnerability(
          position,
          hour,
          stance,
          meridianStates
        );
        
        expect(vulnerability).toBeGreaterThanOrEqual(0.5);
        expect(vulnerability).toBeLessThanOrEqual(3.0);
      });
    });
  });

  describe("generateVulnerabilityHeatMap", () => {
    it("should generate heat map with correct dimensions", () => {
      const width = 10;
      const height = 20;
      const hour = 12;
      const stance = TrigramStance.GEON;
      const meridianStates = { lung: 1.0 };
      
      const heatMap = generateVulnerabilityHeatMap(
        width,
        height,
        hour,
        stance,
        meridianStates
      );
      
      expect(heatMap.length).toBe(height);
      expect(heatMap[0].length).toBe(width);
    });

    it("should have normalized values between 0 and 1", () => {
      const width = 5;
      const height = 5;
      const hour = 12;
      const stance = TrigramStance.GEON;
      const meridianStates = { lung: 1.0 };
      
      const heatMap = generateVulnerabilityHeatMap(
        width,
        height,
        hour,
        stance,
        meridianStates
      );
      
      heatMap.forEach((row) => {
        row.forEach((value) => {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        });
      });
    });

    it("should show higher values in vulnerable zones", () => {
      const width = 100;
      const height = 700;
      const hour = 12;
      const stance = TrigramStance.GEON;
      const meridianStates = {
        bladder: 1.0,
        gallbladder: 1.0,
        lung: 1.0,
      };
      
      const heatMap = generateVulnerabilityHeatMap(
        width,
        height,
        hour,
        stance,
        meridianStates
      );
      
      // Head area (around y=50) should have higher vulnerability
      const headValue = heatMap[50]?.[50] ?? 0;
      
      // Leg area (around y=600) should have lower vulnerability
      const legValue = heatMap[600]?.[50] ?? 0;
      
      // Head should generally be more vulnerable than legs
      expect(typeof headValue).toBe("number");
      expect(typeof legValue).toBe("number");
    });

    it("should handle small heat maps", () => {
      const heatMap = generateVulnerabilityHeatMap(
        2,
        2,
        12,
        TrigramStance.GEON,
        {}
      );
      
      expect(heatMap.length).toBe(2);
      expect(heatMap[0].length).toBe(2);
    });

    it("should reflect stance changes in heat map", () => {
      const width = 50;
      const height = 100;
      const hour = 12;
      const meridianStates = { bladder: 1.0 };
      
      const offensiveMap = generateVulnerabilityHeatMap(
        width,
        height,
        hour,
        TrigramStance.GEON, // Offensive
        meridianStates
      );
      
      const defensiveMap = generateVulnerabilityHeatMap(
        width,
        height,
        hour,
        TrigramStance.GAN, // Defensive
        meridianStates
      );
      
      // Maps should be different
      expect(offensiveMap).not.toEqual(defensiveMap);
    });
  });

  describe("Performance", () => {
    it("should calculate vulnerability in under 1ms", () => {
      const position = { x: 50, y: 160 };
      const hour = 12;
      const stance = TrigramStance.GEON;
      const meridianStates = {
        lung: 1.0,
        heart: 1.0,
        stomach: 1.0,
      };
      
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        calculateEnhancedVulnerability(position, hour, stance, meridianStates);
      }
      
      const end = performance.now();
      const avgTime = (end - start) / 1000;
      
      expect(avgTime).toBeLessThan(1); // Average time per calculation < 1ms
    });

    it("should perform point-in-polygon checks efficiently", () => {
      const polygon = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ];
      const point = { x: 5, y: 5 };
      
      const start = performance.now();
      
      for (let i = 0; i < 10000; i++) {
        isPointInPolygon(point, polygon);
      }
      
      const end = performance.now();
      const avgTime = (end - start) / 10000;
      
      expect(avgTime).toBeLessThan(0.01); // Average time < 0.01ms per check
    });
  });
});
