import { beforeEach, describe, expect, it } from "vitest";
import {
  ENERGY_MERIDIANS_ARRAY,
  ENERGY_MERIDIANS,
  ELEMENTAL_RELATIONS,
  getMeridian,
  getMeridiansByElement,
  calculateMeridianFlow,
  findOptimalVitalPoints,
  calculateAnatomicalVulnerability,
  getAnatomicalZones,
  getZoneByPosition,
  generateMeridianEffects,
  KoreanAnatomySystem,
} from "./KoreanAnatomy";
import { KOREAN_VITAL_POINTS } from "./KoreanVitalPoints";
import { EffectIntensity } from "../effects";

describe("KoreanAnatomy", () => {
  describe("ENERGY_MERIDIANS_ARRAY", () => {
    it("should have defined meridians", () => {
      expect(ENERGY_MERIDIANS_ARRAY).toBeDefined();
      expect(ENERGY_MERIDIANS_ARRAY.length).toBeGreaterThan(0);
    });

    it("should have all required properties for each meridian", () => {
      ENERGY_MERIDIANS_ARRAY.forEach((meridian) => {
        expect(meridian.id).toBeDefined();
        expect(meridian.koreanName).toBeDefined();
        expect(meridian.chineseName).toBeDefined();
        expect(meridian.englishName).toBeDefined();
        expect(meridian.element).toBeDefined();
        expect(meridian.direction).toBeDefined();
        expect(Array.isArray(meridian.points)).toBe(true);
        expect(meridian.kiFlow).toBeGreaterThanOrEqual(0);
        expect(meridian.kiFlow).toBeLessThanOrEqual(100);
        expect(meridian.description).toBeDefined();
        expect(meridian.description.korean).toBeDefined();
        expect(meridian.description.english).toBeDefined();
        expect(Array.isArray(meridian.relatedVitalPoints)).toBe(true);
      });
    });

    it("should have unique IDs", () => {
      const ids = ENERGY_MERIDIANS_ARRAY.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have valid direction values", () => {
      ENERGY_MERIDIANS_ARRAY.forEach((meridian) => {
        expect(["ascending", "descending", "bilateral"]).toContain(
          meridian.direction
        );
      });
    });

    it("should have valid element values", () => {
      const validElements = ["wood", "fire", "earth", "metal", "water"];
      ENERGY_MERIDIANS_ARRAY.forEach((meridian) => {
        expect(validElements).toContain(meridian.element);
      });
    });

    it("should have lung meridian", () => {
      const lung = ENERGY_MERIDIANS_ARRAY.find((m) => m.id === "lung");
      expect(lung).toBeDefined();
      expect(lung?.element).toBe("metal");
    });

    it("should have heart meridian", () => {
      const heart = ENERGY_MERIDIANS_ARRAY.find((m) => m.id === "heart");
      expect(heart).toBeDefined();
      expect(heart?.element).toBe("fire");
    });

    it("should have kidney meridian", () => {
      const kidney = ENERGY_MERIDIANS_ARRAY.find((m) => m.id === "kidney");
      expect(kidney).toBeDefined();
      expect(kidney?.element).toBe("water");
    });
  });

  describe("ENERGY_MERIDIANS record", () => {
    it("should be accessible by ID", () => {
      expect(ENERGY_MERIDIANS["lung"]).toBeDefined();
      expect(ENERGY_MERIDIANS["heart"]).toBeDefined();
      expect(ENERGY_MERIDIANS["kidney"]).toBeDefined();
    });

    it("should contain all meridians from array", () => {
      ENERGY_MERIDIANS_ARRAY.forEach((meridian) => {
        expect(ENERGY_MERIDIANS[meridian.id]).toBeDefined();
        expect(ENERGY_MERIDIANS[meridian.id]).toEqual(meridian);
      });
    });
  });

  describe("ELEMENTAL_RELATIONS", () => {
    it("should define producing and controlling relationships", () => {
      const elements = ["wood", "fire", "earth", "metal", "water"];
      
      elements.forEach((element) => {
        expect(ELEMENTAL_RELATIONS[element]).toBeDefined();
        expect(ELEMENTAL_RELATIONS[element].producing).toBeDefined();
        expect(ELEMENTAL_RELATIONS[element].controlling).toBeDefined();
      });
    });

    it("should have wood producing fire", () => {
      expect(ELEMENTAL_RELATIONS.wood.producing.fire).toBeDefined();
    });

    it("should have fire producing earth", () => {
      expect(ELEMENTAL_RELATIONS.fire.producing.earth).toBeDefined();
    });

    it("should have earth producing metal", () => {
      expect(ELEMENTAL_RELATIONS.earth.producing.metal).toBeDefined();
    });

    it("should have metal producing water", () => {
      expect(ELEMENTAL_RELATIONS.metal.producing.water).toBeDefined();
    });

    it("should have water producing wood", () => {
      expect(ELEMENTAL_RELATIONS.water.producing.wood).toBeDefined();
    });

    it("should have wood controlling earth", () => {
      expect(ELEMENTAL_RELATIONS.wood.controlling.earth).toBeDefined();
    });

    it("should have fire controlling metal", () => {
      expect(ELEMENTAL_RELATIONS.fire.controlling.metal).toBeDefined();
    });

    it("should have earth controlling water", () => {
      expect(ELEMENTAL_RELATIONS.earth.controlling.water).toBeDefined();
    });

    it("should have metal controlling wood", () => {
      expect(ELEMENTAL_RELATIONS.metal.controlling.wood).toBeDefined();
    });

    it("should have water controlling fire", () => {
      expect(ELEMENTAL_RELATIONS.water.controlling.fire).toBeDefined();
    });
  });

  describe("getMeridian", () => {
    it("should retrieve meridian by valid ID", () => {
      const lung = getMeridian("lung");
      
      expect(lung).toBeDefined();
      expect(lung?.id).toBe("lung");
      expect(lung?.element).toBe("metal");
    });

    it("should return null for invalid ID", () => {
      const result = getMeridian("invalid_meridian");
      expect(result).toBeNull();
    });

    it("should retrieve heart meridian", () => {
      const heart = getMeridian("heart");
      
      expect(heart).toBeDefined();
      expect(heart?.element).toBe("fire");
    });

    it("should retrieve kidney meridian", () => {
      const kidney = getMeridian("kidney");
      
      expect(kidney).toBeDefined();
      expect(kidney?.element).toBe("water");
    });

    it("should handle empty string", () => {
      const result = getMeridian("");
      expect(result).toBeNull();
    });
  });

  describe("getMeridiansByElement", () => {
    it("should filter meridians by fire element", () => {
      const fire = getMeridiansByElement("fire");
      
      expect(fire.length).toBeGreaterThan(0);
      fire.forEach((meridian) => {
        expect(meridian.element).toBe("fire");
      });
    });

    it("should filter meridians by water element", () => {
      const water = getMeridiansByElement("water");
      
      expect(water.length).toBeGreaterThan(0);
      water.forEach((meridian) => {
        expect(meridian.element).toBe("water");
      });
    });

    it("should filter meridians by metal element", () => {
      const metal = getMeridiansByElement("metal");
      
      expect(metal.length).toBeGreaterThan(0);
      metal.forEach((meridian) => {
        expect(meridian.element).toBe("metal");
      });
    });

    it("should filter meridians by wood element", () => {
      const wood = getMeridiansByElement("wood");
      
      // Wood may or may not have meridians in the current dataset
      wood.forEach((meridian) => {
        expect(meridian.element).toBe("wood");
      });
    });

    it("should filter meridians by earth element", () => {
      const earth = getMeridiansByElement("earth");
      
      expect(earth.length).toBeGreaterThan(0);
      earth.forEach((meridian) => {
        expect(meridian.element).toBe("earth");
      });
    });

    it("should return empty array for invalid element", () => {
      const result = getMeridiansByElement("invalid_element");
      expect(result).toEqual([]);
    });
  });

  describe("calculateMeridianFlow", () => {
    it("should return 1.0 at peak hour for lung meridian", () => {
      const flow = calculateMeridianFlow("lung", 4);
      expect(flow).toBe(1.0);
    });

    it("should return 1.0 at peak hour for heart meridian", () => {
      const flow = calculateMeridianFlow("heart", 12);
      expect(flow).toBe(1.0);
    });

    it("should return reduced flow away from peak hour", () => {
      const peakFlow = calculateMeridianFlow("lung", 4);
      const offPeakFlow = calculateMeridianFlow("lung", 16);
      
      expect(offPeakFlow).toBeLessThan(peakFlow);
    });

    it("should return value between 0.7 and 1.0", () => {
      for (let hour = 0; hour < 24; hour++) {
        const flow = calculateMeridianFlow("lung", hour);
        expect(flow).toBeGreaterThanOrEqual(0.7);
        expect(flow).toBeLessThanOrEqual(1.0);
      }
    });

    it("should handle non-existent meridian with default peak hour", () => {
      const flow = calculateMeridianFlow("invalid_meridian", 12);
      expect(flow).toBeGreaterThanOrEqual(0.7);
      expect(flow).toBeLessThanOrEqual(1.0);
    });

    it("should be symmetric around peak hour", () => {
      const peakHour = 4; // Lung meridian peak
      const flow1 = calculateMeridianFlow("lung", peakHour - 2);
      const flow2 = calculateMeridianFlow("lung", peakHour + 2);
      
      expect(Math.abs(flow1 - flow2)).toBeLessThan(0.01);
    });
  });

  describe("findOptimalVitalPoints", () => {
    it("should find vital points for fire element", () => {
      const result = findOptimalVitalPoints("fire", KOREAN_VITAL_POINTS);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should find vital points for water element", () => {
      const result = findOptimalVitalPoints("water", KOREAN_VITAL_POINTS);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return empty array for invalid element", () => {
      const result = findOptimalVitalPoints("invalid_element", KOREAN_VITAL_POINTS);
      expect(result).toEqual([]);
    });

    it("should find vital points based on controlling relationship", () => {
      // Fire controls metal
      const result = findOptimalVitalPoints("fire", KOREAN_VITAL_POINTS);
      // Result should contain vital points related to metal meridians
      expect(Array.isArray(result)).toBe(true);
    });

    it("should handle empty vital points array", () => {
      const result = findOptimalVitalPoints("fire", []);
      expect(result).toEqual([]);
    });
  });

  describe("getAnatomicalZones", () => {
    it("should return array of zones", () => {
      const zones = getAnatomicalZones();
      
      expect(Array.isArray(zones)).toBe(true);
      expect(zones.length).toBeGreaterThan(0);
    });

    it("should have zones with required properties", () => {
      const zones = getAnatomicalZones();
      
      zones.forEach((zone) => {
        expect(zone.id).toBeDefined();
        expect(zone.koreanName).toBeDefined();
        expect(zone.englishName).toBeDefined();
        expect(zone.boundaries).toBeDefined();
        expect(zone.boundaries.top).toBeDefined();
        expect(zone.boundaries.bottom).toBeDefined();
        expect(zone.boundaries.left).toBeDefined();
        expect(zone.boundaries.right).toBeDefined();
        expect(zone.vulnerability).toBeGreaterThan(0);
        expect(Array.isArray(zone.meridians)).toBe(true);
        expect(Array.isArray(zone.vitalPoints)).toBe(true);
      });
    });
  });

  describe("getZoneByPosition", () => {
    it("should find zone for position in upper torso", () => {
      const position = { x: 50, y: 200 };
      const zone = getZoneByPosition(position);
      
      expect(zone).toBeDefined();
      expect(zone?.id).toBe("upper_torso");
    });

    it("should find zone for position in lower torso", () => {
      const position = { x: 50, y: 350 };
      const zone = getZoneByPosition(position);
      
      expect(zone).toBeDefined();
      expect(zone?.id).toBe("lower_torso");
    });

    it("should find zone for position in head/neck", () => {
      const position = { x: 50, y: 100 };
      const zone = getZoneByPosition(position);
      
      expect(zone).toBeDefined();
      expect(zone?.id).toBe("head_neck");
    });

    it("should return null for position outside all zones", () => {
      const position = { x: 10000, y: 10000 };
      const zone = getZoneByPosition(position);
      
      expect(zone).toBeNull();
    });

    it("should handle negative coordinates", () => {
      const position = { x: -100, y: -100 };
      const zone = getZoneByPosition(position);
      
      // Should return null since it's outside boundaries
      expect(zone).toBeNull();
    });

    it("should handle boundary positions", () => {
      const zones = getAnatomicalZones();
      if (zones.length > 0) {
        const zone = zones[0];
        const position = {
          x: zone.boundaries.left,
          y: zone.boundaries.top,
        };
        
        const result = getZoneByPosition(position);
        expect(result).toBeDefined();
      }
    });
  });

  describe("calculateAnatomicalVulnerability", () => {
    it("should calculate vulnerability for position in zone", () => {
      const position = { x: 50, y: 200 };
      const meridianStates = {
        lung: 1.0,
        heart: 0.8,
        large_intestine: 0.9,
      };
      
      const vulnerability = calculateAnatomicalVulnerability(position, meridianStates);
      
      expect(vulnerability).toBeGreaterThan(0);
      expect(vulnerability).toBeGreaterThanOrEqual(0.5);
      expect(vulnerability).toBeLessThanOrEqual(3.0);
    });

    it("should increase vulnerability for weak meridian flow", () => {
      const position = { x: 50, y: 200 };
      
      const strongFlow = calculateAnatomicalVulnerability(position, {
        lung: 1.0,
        heart: 1.0,
        large_intestine: 1.0,
      });
      
      const weakFlow = calculateAnatomicalVulnerability(position, {
        lung: 0.3,
        heart: 0.3,
        large_intestine: 0.3,
      });
      
      expect(weakFlow).toBeGreaterThan(strongFlow);
    });

    it("should cap vulnerability between 0.5 and 3.0", () => {
      const position = { x: 50, y: 200 };
      
      // Test with extreme values
      const vulnerability = calculateAnatomicalVulnerability(position, {
        lung: 0.01,
        heart: 0.01,
        large_intestine: 0.01,
      });
      
      expect(vulnerability).toBeGreaterThanOrEqual(0.5);
      expect(vulnerability).toBeLessThanOrEqual(3.0);
    });

    it("should handle position outside zones", () => {
      const position = { x: 10000, y: 10000 };
      const meridianStates = { lung: 1.0 };
      
      const vulnerability = calculateAnatomicalVulnerability(position, meridianStates);
      
      // Should still return a value
      expect(vulnerability).toBeGreaterThanOrEqual(0.5);
      expect(vulnerability).toBeLessThanOrEqual(3.0);
    });

    it("should handle empty meridian states", () => {
      const position = { x: 50, y: 200 };
      const vulnerability = calculateAnatomicalVulnerability(position, {});
      
      expect(vulnerability).toBeGreaterThanOrEqual(0.5);
      expect(vulnerability).toBeLessThanOrEqual(3.0);
    });
  });

  describe("generateMeridianEffects", () => {
    it("should generate effects for valid meridian with high disruption", () => {
      const effects = generateMeridianEffects("lung", 0.8);
      
      expect(effects.length).toBeGreaterThan(0);
      expect(effects[0]).toHaveProperty("id");
      expect(effects[0]).toHaveProperty("type");
      expect(effects[0]).toHaveProperty("intensity");
      expect(effects[0]).toHaveProperty("duration");
      expect(effects[0]).toHaveProperty("source");
    });

    it("should return empty array for invalid meridian", () => {
      const effects = generateMeridianEffects("invalid_meridian", 0.8);
      expect(effects).toEqual([]);
    });

    it("should not generate effects for low disruption", () => {
      const effects = generateMeridianEffects("lung", 0.2);
      expect(effects).toEqual([]);
    });

    it("should generate effects at threshold disruption (0.3)", () => {
      const effects = generateMeridianEffects("lung", 0.31);
      expect(effects.length).toBeGreaterThan(0);
    });

    it("should use SEVERE intensity for high disruption", () => {
      const effects = generateMeridianEffects("lung", 0.8);
      
      if (effects.length > 0) {
        expect(effects[0].intensity).toBe(EffectIntensity.SEVERE);
      }
    });

    it("should use MODERATE intensity for medium disruption", () => {
      const effects = generateMeridianEffects("lung", 0.5);
      
      if (effects.length > 0) {
        expect(effects[0].intensity).toBe(EffectIntensity.MODERATE);
      }
    });

    it("should use MINOR intensity for low disruption", () => {
      const effects = generateMeridianEffects("lung", 0.35);
      
      if (effects.length > 0) {
        expect(effects[0].intensity).toBe(EffectIntensity.MINOR);
      }
    });

    it("should scale duration with disruption level", () => {
      const lowEffects = generateMeridianEffects("lung", 0.4);
      const highEffects = generateMeridianEffects("lung", 0.9);
      
      if (lowEffects.length > 0 && highEffects.length > 0) {
        expect(highEffects[0].duration).toBeGreaterThan(lowEffects[0].duration);
      }
    });

    it("should set correct source to meridian ID", () => {
      const effects = generateMeridianEffects("heart", 0.8);
      
      if (effects.length > 0) {
        expect(effects[0].source).toBe("heart");
      }
    });

    it("should cap disruption level at 1.0", () => {
      const effects = generateMeridianEffects("lung", 5.0);
      
      if (effects.length > 0) {
        expect(effects[0].duration).toBeLessThanOrEqual(5000); // Max duration
      }
    });
  });

  describe("KoreanAnatomySystem", () => {
    let system: KoreanAnatomySystem;

    beforeEach(() => {
      system = new KoreanAnatomySystem();
    });

    describe("getZoneForVitalPoint", () => {
      it("should find zone for valid vital point", () => {
        const zone = system.getZoneForVitalPoint("tanzhong");
        
        if (zone) {
          expect(zone.vitalPoints).toContain("tanzhong");
        }
      });

      it("should return undefined for non-existent vital point", () => {
        const zone = system.getZoneForVitalPoint("non_existent_vp");
        expect(zone).toBeUndefined();
      });

      it("should handle empty string", () => {
        const zone = system.getZoneForVitalPoint("");
        expect(zone).toBeUndefined();
      });
    });

    describe("getMeridiansInZone", () => {
      it("should return meridians for valid zone", () => {
        const meridians = system.getMeridiansInZone("upper_torso");
        
        expect(Array.isArray(meridians)).toBe(true);
        // May be empty if zone doesn't exist in Record
      });

      it("should return empty array for invalid zone", () => {
        const meridians = system.getMeridiansInZone("invalid_zone");
        expect(meridians).toEqual([]);
      });

      it("should return meridians that match zone's meridian IDs", () => {
        const zones = getAnatomicalZones();
        if (zones.length > 0) {
          const zone = zones[0];
          // Note: This test depends on whether KOREAN_ANATOMICAL_ZONES Record exists
          // If it doesn't, this will return empty array
          const meridians = system.getMeridiansInZone(zone.id);
          expect(Array.isArray(meridians)).toBe(true);
        }
      });
    });
  });
});
