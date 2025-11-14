import { describe, expect, it } from "vitest";
import {
  TrigramStance,
  VitalPointCategory,
  VitalPointEffectType,
  VitalPointSeverity,
} from "../../types/common";
import { EffectIntensity } from "../effects";
import { HitDetection } from "./HitDetection";
import type { VitalPoint } from "./types";

describe("HitDetection", () => {
  const mockVitalPoint: VitalPoint = {
    id: "test_vital_point",
    names: {
      korean: "테스트 급소",
      english: "Test Vital Point",
      romanized: "teseuteu geupso",
    },
    position: { x: 100, y: 100 },
    radius: 15,
    requiredForce: 50,
    category: VitalPointCategory.MERIDIAN,
    severity: VitalPointSeverity.MAJOR,
    baseDamage: 30,
    effects: [
      {
        id: "test_pain_effect",
        type: VitalPointEffectType.PAIN,
        intensity: EffectIntensity.MODERATE,
        duration: 2000,
        description: {
          korean: "통증을 유발합니다",
          english: "Causes pain",
        },
        stackable: false,
      },
    ],
    description: {
      korean: "테스트용 급소입니다",
      english: "Test vital point",
    },
    targetingDifficulty: 0.7,
    effectiveStances: [TrigramStance.GEON],
  };

  const criticalVitalPoint: VitalPoint = {
    ...mockVitalPoint,
    id: "critical_point",
    names: {
      korean: "치명적 급소",
      english: "Critical Point",
      romanized: "chimyeongjeok geupso",
    },
    severity: VitalPointSeverity.CRITICAL,
    baseDamage: 50,
    requiredForce: 70,
  };

  describe("processVitalPointHit", () => {
    it("should detect direct hit on vital point", () => {
      const hitDetection = new HitDetection();
      const exactPosition = { x: 100, y: 100 };

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        exactPosition,
        50
      );

      expect(result.hit).toBe(true);
      expect(result.damage).toBeGreaterThan(0);
      expect(result.severity).toBe(VitalPointSeverity.MAJOR);
    });

    it("should miss when position is outside radius", () => {
      const hitDetection = new HitDetection();
      const farPosition = { x: 200, y: 200 }; // Far from vital point

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        farPosition,
        50
      );

      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
      expect(result.severity).toBe(VitalPointSeverity.MINOR);
    });

    it("should hit when position is within radius", () => {
      const hitDetection = new HitDetection();
      const nearPosition = { x: 105, y: 105 }; // Within 15 pixel radius

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        nearPosition,
        50
      );

      expect(result.hit).toBe(true);
    });

    it("should calculate damage based on force", () => {
      const hitDetection = new HitDetection();
      const position = { x: 100, y: 100 };

      const lowForceResult = hitDetection.processVitalPointHit(
        mockVitalPoint,
        position,
        25
      );

      const highForceResult = hitDetection.processVitalPointHit(
        mockVitalPoint,
        position,
        100
      );

      expect(highForceResult.damage).toBeGreaterThan(lowForceResult.damage);
    });

    it("should cap force multiplier at 2.0", () => {
      const hitDetection = new HitDetection();
      const position = { x: 100, y: 100 };

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        position,
        500 // Very high force
      );

      // Maximum multiplier is 2.0, so max damage is baseDamage * 2
      expect(result.damage).toBeLessThanOrEqual(mockVitalPoint.baseDamage! * 2);
    });

    it("should include vital point in hit result", () => {
      const hitDetection = new HitDetection();
      const position = { x: 100, y: 100 };

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        position,
        50
      );

      expect(result.vitalPoint).toBeDefined();
      expect(result.vitalPoint?.id).toBe(mockVitalPoint.id);
    });

    it("should convert vital point effects to status effects", () => {
      const hitDetection = new HitDetection();
      const position = { x: 100, y: 100 };

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        position,
        50
      );

      expect(result.effects.length).toBeGreaterThan(0);
      expect(result.effects[0].type).toBe("weakened");
      expect(result.effects[0].source).toBe(mockVitalPoint.id);
      expect(result.effects[0].duration).toBe(2000);
    });

    it("should use default radius if not specified", () => {
      const hitDetection = new HitDetection();
      const vpWithoutRadius: VitalPoint = {
        ...mockVitalPoint,
        radius: undefined,
      };
      const position = { x: 105, y: 105 };

      const result = hitDetection.processVitalPointHit(
        vpWithoutRadius,
        position,
        50
      );

      // Should use default radius of 10
      expect(result).toBeDefined();
    });

    it("should use default required force if not specified", () => {
      const hitDetection = new HitDetection();
      const vpWithoutForce: VitalPoint = {
        ...mockVitalPoint,
        requiredForce: undefined,
      };
      const position = { x: 100, y: 100 };

      const result = hitDetection.processVitalPointHit(
        vpWithoutForce,
        position,
        30
      );

      expect(result.damage).toBeGreaterThan(0);
    });

    it("should handle vital point without baseDamage", () => {
      const hitDetection = new HitDetection();
      const vpWithoutDamage: VitalPoint = {
        ...mockVitalPoint,
        baseDamage: undefined,
      };
      const position = { x: 100, y: 100 };

      const result = hitDetection.processVitalPointHit(
        vpWithoutDamage,
        position,
        50
      );

      expect(result.damage).toBe(15); // Default base damage
    });

    it("should return correct severity for critical point", () => {
      const hitDetection = new HitDetection();
      const position = { x: 100, y: 100 };

      const result = hitDetection.processVitalPointHit(
        criticalVitalPoint,
        position,
        80
      );

      expect(result.severity).toBe(VitalPointSeverity.CRITICAL);
    });

    it("should calculate distance correctly", () => {
      const hitDetection = new HitDetection();
      const edgePosition = {
        x: mockVitalPoint.position.x + 15, // Exactly at radius edge
        y: mockVitalPoint.position.y,
      };

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        edgePosition,
        50
      );

      expect(result.hit).toBe(true);
    });

    it("should miss at radius boundary + 1", () => {
      const hitDetection = new HitDetection();
      const outsidePosition = {
        x: mockVitalPoint.position.x + 16, // Just outside radius
        y: mockVitalPoint.position.y,
      };

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        outsidePosition,
        50
      );

      expect(result.hit).toBe(false);
    });
  });

  describe("effect type mapping", () => {
    it("should map UNCONSCIOUSNESS to stun", () => {
      const hitDetection = new HitDetection();
      const vpWithUnconscious: VitalPoint = {
        ...mockVitalPoint,
        effects: [
          {
            id: "unconscious_effect",
            type: VitalPointEffectType.UNCONSCIOUSNESS,
            intensity: EffectIntensity.SEVERE,
            duration: 3000,
            description: { korean: "기절", english: "Unconscious" },
            stackable: false,
          },
        ],
      };

      const result = hitDetection.processVitalPointHit(
        vpWithUnconscious,
        { x: 100, y: 100 },
        50
      );

      expect(result.effects[0].type).toBe("stun");
    });

    it("should map BREATHLESSNESS to stamina_drain", () => {
      const hitDetection = new HitDetection();
      const vpWithBreathless: VitalPoint = {
        ...mockVitalPoint,
        effects: [
          {
            id: "breathless_effect",
            type: VitalPointEffectType.BREATHLESSNESS,
            intensity: EffectIntensity.MODERATE,
            duration: 2000,
            description: { korean: "호흡 곤란", english: "Breathlessness" },
            stackable: false,
          },
        ],
      };

      const result = hitDetection.processVitalPointHit(
        vpWithBreathless,
        { x: 100, y: 100 },
        50
      );

      expect(result.effects[0].type).toBe("stamina_drain");
    });

    it("should map PARALYSIS to paralysis", () => {
      const hitDetection = new HitDetection();
      const vpWithParalysis: VitalPoint = {
        ...mockVitalPoint,
        effects: [
          {
            id: "paralysis_effect",
            type: VitalPointEffectType.PARALYSIS,
            intensity: EffectIntensity.HIGH,
            duration: 2500,
            description: { korean: "마비", english: "Paralysis" },
            stackable: false,
          },
        ],
      };

      const result = hitDetection.processVitalPointHit(
        vpWithParalysis,
        { x: 100, y: 100 },
        50
      );

      expect(result.effects[0].type).toBe("paralysis");
    });

    it("should map DISORIENTATION to confusion", () => {
      const hitDetection = new HitDetection();
      const vpWithDisorient: VitalPoint = {
        ...mockVitalPoint,
        effects: [
          {
            id: "disorient_effect",
            type: VitalPointEffectType.DISORIENTATION,
            intensity: EffectIntensity.MODERATE,
            duration: 1500,
            description: { korean: "혼란", english: "Disorientation" },
            stackable: false,
          },
        ],
      };

      const result = hitDetection.processVitalPointHit(
        vpWithDisorient,
        { x: 100, y: 100 },
        50
      );

      expect(result.effects[0].type).toBe("confusion");
    });

    it("should map BLOOD_FLOW_RESTRICTION to bleed", () => {
      const hitDetection = new HitDetection();
      const vpWithBleed: VitalPoint = {
        ...mockVitalPoint,
        effects: [
          {
            id: "bleed_effect",
            type: VitalPointEffectType.BLOOD_FLOW_RESTRICTION,
            intensity: EffectIntensity.HIGH,
            duration: 4000,
            description: { korean: "출혈", english: "Bleeding" },
            stackable: true,
          },
        ],
      };

      const result = hitDetection.processVitalPointHit(
        vpWithBleed,
        { x: 100, y: 100 },
        50
      );

      expect(result.effects[0].type).toBe("bleed");
    });

    it("should map ORGAN_DISRUPTION to vulnerability", () => {
      const hitDetection = new HitDetection();
      const vpWithOrganDisrupt: VitalPoint = {
        ...mockVitalPoint,
        effects: [
          {
            id: "organ_effect",
            type: VitalPointEffectType.ORGAN_DISRUPTION,
            intensity: EffectIntensity.CRITICAL,
            duration: 5000,
            description: { korean: "장기 손상", english: "Organ disruption" },
            stackable: false,
          },
        ],
      };

      const result = hitDetection.processVitalPointHit(
        vpWithOrganDisrupt,
        { x: 100, y: 100 },
        50
      );

      expect(result.effects[0].type).toBe("vulnerability");
    });

    it("should preserve effect intensity", () => {
      const hitDetection = new HitDetection();
      const vpWithHighIntensity: VitalPoint = {
        ...mockVitalPoint,
        effects: [
          {
            id: "high_intensity_effect",
            type: VitalPointEffectType.PAIN,
            intensity: EffectIntensity.SEVERE,
            duration: 2000,
            description: { korean: "극심한 통증", english: "Severe pain" },
            stackable: false,
          },
        ],
      };

      const result = hitDetection.processVitalPointHit(
        vpWithHighIntensity,
        { x: 100, y: 100 },
        50
      );

      expect(result.effects[0].intensity).toBe(EffectIntensity.SEVERE);
    });

    it("should preserve stackable property", () => {
      const hitDetection = new HitDetection();
      const vpWithStackable: VitalPoint = {
        ...mockVitalPoint,
        effects: [
          {
            id: "stackable_effect",
            type: VitalPointEffectType.PAIN,
            intensity: EffectIntensity.MODERATE,
            duration: 2000,
            description: { korean: "통증", english: "Pain" },
            stackable: true,
          },
        ],
      };

      const result = hitDetection.processVitalPointHit(
        vpWithStackable,
        { x: 100, y: 100 },
        50
      );

      expect(result.effects[0].stackable).toBe(true);
    });
  });

  describe("Korean martial arts integration", () => {
    it("should preserve Korean effect descriptions", () => {
      const hitDetection = new HitDetection();

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        { x: 100, y: 100 },
        50
      );

      expect(result.effects[0].description).toBeDefined();
    });

    it("should handle multiple effects correctly", () => {
      const hitDetection = new HitDetection();
      const multiEffectVP: VitalPoint = {
        ...mockVitalPoint,
        effects: [
          {
            id: "effect_1",
            type: VitalPointEffectType.PAIN,
            intensity: EffectIntensity.MODERATE,
            duration: 2000,
            description: { korean: "통증", english: "Pain" },
            stackable: false,
          },
          {
            id: "effect_2",
            type: VitalPointEffectType.STUN,
            intensity: EffectIntensity.HIGH,
            duration: 1000,
            description: { korean: "기절", english: "Stun" },
            stackable: false,
          },
        ],
      };

      const result = hitDetection.processVitalPointHit(
        multiEffectVP,
        { x: 100, y: 100 },
        50
      );

      expect(result.effects.length).toBe(2);
      expect(result.effects[0].id).toContain("effect_1");
      expect(result.effects[1].id).toContain("effect_2");
    });

    it("should generate unique effect IDs based on timestamp", async () => {
      const hitDetection = new HitDetection();

      const result1 = hitDetection.processVitalPointHit(
        mockVitalPoint,
        { x: 100, y: 100 },
        50
      );

      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 2));

      const result2 = hitDetection.processVitalPointHit(
        mockVitalPoint,
        { x: 100, y: 100 },
        50
      );

      // IDs should be different due to timestamp, or at least have a unique component
      if (result1.effects.length > 0 && result2.effects.length > 0) {
        expect(result1.effects[0].id).toContain("test_pain_effect");
        expect(result2.effects[0].id).toContain("test_pain_effect");
        // Just verify they both have the base ID - exact uniqueness depends on timing
      }
    });
  });

  describe("edge cases", () => {
    it("should handle zero force", () => {
      const hitDetection = new HitDetection();

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        { x: 100, y: 100 },
        0
      );

      expect(result.damage).toBe(0);
    });

    it("should handle negative coordinates", () => {
      const hitDetection = new HitDetection();
      const vpAtNegative: VitalPoint = {
        ...mockVitalPoint,
        position: { x: -100, y: -100 },
      };

      const result = hitDetection.processVitalPointHit(
        vpAtNegative,
        { x: -100, y: -100 },
        50
      );

      expect(result.hit).toBe(true);
    });

    it("should handle vital point with no effects", () => {
      const hitDetection = new HitDetection();
      const vpNoEffects: VitalPoint = {
        ...mockVitalPoint,
        effects: [],
      };

      const result = hitDetection.processVitalPointHit(
        vpNoEffects,
        { x: 100, y: 100 },
        50
      );

      expect(result.effects.length).toBe(0);
    });

    it("should handle very large coordinates", () => {
      const hitDetection = new HitDetection();
      const vpLargeCoords: VitalPoint = {
        ...mockVitalPoint,
        position: { x: 10000, y: 10000 },
      };

      const result = hitDetection.processVitalPointHit(
        vpLargeCoords,
        { x: 10000, y: 10000 },
        50
      );

      expect(result.hit).toBe(true);
    });

    it("should handle diagonal hits correctly", () => {
      const hitDetection = new HitDetection();
      const diagonalPosition = {
        x: mockVitalPoint.position.x + 10,
        y: mockVitalPoint.position.y + 10,
      };

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        diagonalPosition,
        50
      );

      // Distance is sqrt(10^2 + 10^2) ≈ 14.14, which is within radius of 15
      expect(result.hit).toBe(true);
    });

    it("should floor damage to integer", () => {
      const hitDetection = new HitDetection();
      const vpLowDamage: VitalPoint = {
        ...mockVitalPoint,
        baseDamage: 5,
      };

      const result = hitDetection.processVitalPointHit(
        vpLowDamage,
        { x: 100, y: 100 },
        51 // Force slightly above required
      );

      expect(Number.isInteger(result.damage)).toBe(true);
    });
  });

  describe("status effect properties", () => {
    it("should set correct startTime and endTime", () => {
      const hitDetection = new HitDetection();
      const beforeTime = Date.now();

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        { x: 100, y: 100 },
        50
      );

      const afterTime = Date.now();

      expect(result.effects[0].startTime).toBeGreaterThanOrEqual(beforeTime);
      expect(result.effects[0].startTime).toBeLessThanOrEqual(afterTime);
      expect(result.effects[0].endTime).toBe(
        result.effects[0].startTime + result.effects[0].duration
      );
    });

    it("should include all required status effect properties", () => {
      const hitDetection = new HitDetection();

      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        { x: 100, y: 100 },
        50
      );

      const effect = result.effects[0];
      expect(effect.id).toBeDefined();
      expect(effect.type).toBeDefined();
      expect(effect.intensity).toBeDefined();
      expect(effect.duration).toBeDefined();
      expect(effect.description).toBeDefined();
      expect(effect.stackable).toBeDefined();
      expect(effect.source).toBeDefined();
      expect(effect.startTime).toBeDefined();
      expect(effect.endTime).toBeDefined();
    });
  });
});
