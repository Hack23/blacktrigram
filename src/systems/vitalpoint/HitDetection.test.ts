import { beforeEach, describe, expect, it } from "vitest";
import {
  VitalPointCategory,
  VitalPointEffectType,
  VitalPointSeverity,
} from "../../types/common";
import { EffectIntensity } from "../effects";
import { HitDetection } from "./HitDetection";
import { VitalPoint } from "./types";

describe("HitDetection", () => {
  let hitDetection: HitDetection;
  let mockVitalPoint: VitalPoint;

  beforeEach(() => {
    hitDetection = new HitDetection();

    mockVitalPoint = {
      id: "test_vital_point",
      names: {
        korean: "테스트 혈자리",
        english: "Test Vital Point",
        romanized: "teseuteu hyeoljali",
      },
      position: { x: 100, y: 100 },
      radius: 15,
      requiredForce: 50,
      category: VitalPointCategory.NEUROLOGICAL,
      severity: VitalPointSeverity.MAJOR,
      baseDamage: 25,
      targetingDifficulty: 0.7,
      effectiveStances: [],
      effects: [
        {
          id: "stun_effect",
          type: VitalPointEffectType.STUN,
          intensity: EffectIntensity.MEDIUM,
          duration: 2000,
          description: { korean: "기절 효과", english: "Stun effect" },
          stackable: false,
        },
      ],
      description: {
        korean: "테스트용 혈자리",
        english: "Test vital point for testing",
      },
    };
  });

  describe("processVitalPointHit", () => {
    it("should detect hit within radius", () => {
      const hitPosition = { x: 105, y: 105 }; // Within 15 unit radius
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        60
      );

      expect(result.hit).toBe(true);
      expect(result.vitalPoint).toBeDefined();
      expect(result.damage).toBeGreaterThan(0);
    });

    it("should miss when outside radius", () => {
      const missPosition = { x: 200, y: 200 }; // Far outside radius
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        missPosition,
        60
      );

      expect(result.hit).toBe(false);
      expect(result.damage).toBe(0);
      expect(result.effects).toEqual([]);
    });

    it("should calculate damage based on force", () => {
      const hitPosition = { x: 100, y: 100 }; // Exact position

      const lowForceResult = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        30
      );

      const highForceResult = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        100
      );

      expect(highForceResult.damage).toBeGreaterThan(lowForceResult.damage);
    });

    it("should cap force multiplier at 2.0", () => {
      const hitPosition = { x: 100, y: 100 };

      const normalForceResult = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        50 // Exactly required force
      );

      const extremeForceResult = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        500 // 10x required force
      );

      // Extreme force should be capped at 2x damage
      expect(extremeForceResult.damage).toBeLessThanOrEqual(
        normalForceResult.damage * 2
      );
    });

    it("should convert vital point effects to status effects", () => {
      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        60
      );

      expect(result.effects).toBeDefined();
      expect(result.effects.length).toBeGreaterThan(0);

      const effect = result.effects[0];
      expect(effect).toHaveProperty("id");
      expect(effect).toHaveProperty("type");
      expect(effect).toHaveProperty("intensity");
      expect(effect).toHaveProperty("duration");
      expect(effect).toHaveProperty("startTime");
      expect(effect).toHaveProperty("endTime");
      expect(effect).toHaveProperty("source");
    });

    it("should return severity from vital point", () => {
      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        60
      );

      expect(result.severity).toBe(VitalPointSeverity.MAJOR);
    });

    it("should handle vital point at boundary of radius", () => {
      const boundaryPosition = { x: 115, y: 100 }; // Exactly at radius edge
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        boundaryPosition,
        60
      );

      expect(result.hit).toBe(true);
    });

    it("should handle vital point just outside radius", () => {
      const outsidePosition = { x: 116, y: 100 }; // Just outside radius
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        outsidePosition,
        60
      );

      expect(result.hit).toBe(false);
    });

    it("should use default radius if undefined", () => {
      const noRadiusVP = { ...mockVitalPoint, radius: undefined };
      const hitPosition = { x: 105, y: 105 };

      const result = hitDetection.processVitalPointHit(
        noRadiusVP,
        hitPosition,
        60
      );

      // Should use default radius of 10
      expect(result).toBeDefined();
    });

    it("should use default required force if undefined", () => {
      const noForceVP = { ...mockVitalPoint, requiredForce: undefined };
      const hitPosition = { x: 100, y: 100 };

      const result = hitDetection.processVitalPointHit(
        noForceVP,
        hitPosition,
        60
      );

      expect(result.damage).toBeGreaterThan(0);
    });

    it("should use default base damage if undefined", () => {
      const noDamageVP = { ...mockVitalPoint, baseDamage: undefined };
      const hitPosition = { x: 100, y: 100 };

      const result = hitDetection.processVitalPointHit(
        noDamageVP,
        hitPosition,
        60
      );

      expect(result.damage).toBeGreaterThan(0);
    });

    it("should floor damage to integer", () => {
      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        45
      );

      expect(result.damage).toBe(Math.floor(result.damage));
    });

    it("should handle zero force", () => {
      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        0
      );

      expect(result.hit).toBe(true);
      expect(result.damage).toBeGreaterThanOrEqual(0);
    });

    it("should handle negative coordinates", () => {
      const negativeVP = { ...mockVitalPoint, position: { x: -50, y: -50 } };
      const hitPosition = { x: -45, y: -45 };

      const result = hitDetection.processVitalPointHit(
        negativeVP,
        hitPosition,
        60
      );

      expect(result.hit).toBe(true);
    });

    it("should correctly calculate diagonal distance", () => {
      const diagonalPosition = { x: 110, y: 110 }; // ~14.14 units away diagonally
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        diagonalPosition,
        60
      );

      expect(result.hit).toBe(true); // Within 15 unit radius
    });
  });

  describe("effect conversion", () => {
    it("should map UNCONSCIOUSNESS to stun effect", () => {
      const vpWithEffect = {
        ...mockVitalPoint,
        effects: [
          {
            id: "ko_effect",
            type: VitalPointEffectType.UNCONSCIOUSNESS,
            intensity: EffectIntensity.HIGH,
            duration: 5000,
            description: { korean: "의식 상실", english: "Unconsciousness" },
            stackable: false,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithEffect,
        hitPosition,
        60
      );

      expect(result.effects[0].type).toBe("stun");
    });

    it("should map BREATHLESSNESS to stamina_drain effect", () => {
      const vpWithEffect = {
        ...mockVitalPoint,
        effects: [
          {
            id: "breath_effect",
            type: VitalPointEffectType.BREATHLESSNESS,
            intensity: EffectIntensity.MEDIUM,
            duration: 3000,
            description: { korean: "호흡 곤란", english: "Breathlessness" },
            stackable: false,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithEffect,
        hitPosition,
        60
      );

      expect(result.effects[0].type).toBe("stamina_drain");
    });

    it("should map PAIN to weakened effect", () => {
      const vpWithEffect = {
        ...mockVitalPoint,
        effects: [
          {
            id: "pain_effect",
            type: VitalPointEffectType.PAIN,
            intensity: EffectIntensity.SEVERE,
            duration: 4000,
            description: { korean: "통증", english: "Pain" },
            stackable: true,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithEffect,
        hitPosition,
        60
      );

      expect(result.effects[0].type).toBe("weakened");
    });

    it("should map PARALYSIS to paralysis effect", () => {
      const vpWithEffect = {
        ...mockVitalPoint,
        effects: [
          {
            id: "paralysis_effect",
            type: VitalPointEffectType.PARALYSIS,
            intensity: EffectIntensity.CRITICAL,
            duration: 6000,
            description: { korean: "마비", english: "Paralysis" },
            stackable: false,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithEffect,
        hitPosition,
        60
      );

      expect(result.effects[0].type).toBe("paralysis");
    });

    it("should map DISORIENTATION to confusion effect", () => {
      const vpWithEffect = {
        ...mockVitalPoint,
        effects: [
          {
            id: "dizzy_effect",
            type: VitalPointEffectType.DISORIENTATION,
            intensity: EffectIntensity.MODERATE,
            duration: 2500,
            description: { korean: "혼란", english: "Disorientation" },
            stackable: false,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithEffect,
        hitPosition,
        60
      );

      expect(result.effects[0].type).toBe("confusion");
    });

    it("should map BLOOD_FLOW_RESTRICTION to bleed effect", () => {
      const vpWithEffect = {
        ...mockVitalPoint,
        effects: [
          {
            id: "bleed_effect",
            type: VitalPointEffectType.BLOOD_FLOW_RESTRICTION,
            intensity: EffectIntensity.HIGH,
            duration: 10000,
            description: { korean: "출혈", english: "Bleeding" },
            stackable: true,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithEffect,
        hitPosition,
        60
      );

      expect(result.effects[0].type).toBe("bleed");
    });

    it("should map NERVE_DISRUPTION to paralysis effect", () => {
      const vpWithEffect = {
        ...mockVitalPoint,
        effects: [
          {
            id: "nerve_effect",
            type: VitalPointEffectType.NERVE_DISRUPTION,
            intensity: EffectIntensity.SEVERE,
            duration: 5000,
            description: { korean: "신경 차단", english: "Nerve disruption" },
            stackable: false,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithEffect,
        hitPosition,
        60
      );

      expect(result.effects[0].type).toBe("paralysis");
    });

    it("should map ORGAN_DISRUPTION to vulnerability effect", () => {
      const vpWithEffect = {
        ...mockVitalPoint,
        effects: [
          {
            id: "organ_effect",
            type: VitalPointEffectType.ORGAN_DISRUPTION,
            intensity: EffectIntensity.CRITICAL,
            duration: 8000,
            description: { korean: "장기 손상", english: "Organ disruption" },
            stackable: false,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithEffect,
        hitPosition,
        60
      );

      expect(result.effects[0].type).toBe("vulnerability");
    });

    it("should preserve effect intensity", () => {
      const vpWithEffect = {
        ...mockVitalPoint,
        effects: [
          {
            id: "test_effect",
            type: VitalPointEffectType.PAIN,
            intensity: EffectIntensity.HIGH,
            duration: 3000,
            description: { korean: "테스트", english: "Test" },
            stackable: false,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithEffect,
        hitPosition,
        60
      );

      expect(result.effects[0].intensity).toBe(EffectIntensity.HIGH);
    });

    it("should preserve effect duration", () => {
      const duration = 4500;
      const vpWithEffect = {
        ...mockVitalPoint,
        effects: [
          {
            id: "test_effect",
            type: VitalPointEffectType.STUN,
            intensity: EffectIntensity.MEDIUM,
            duration,
            description: { korean: "테스트", english: "Test" },
            stackable: false,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithEffect,
        hitPosition,
        60
      );

      expect(result.effects[0].duration).toBe(duration);
    });

    it("should preserve stackable property", () => {
      const vpWithStackable = {
        ...mockVitalPoint,
        effects: [
          {
            id: "stack_effect",
            type: VitalPointEffectType.PAIN,
            intensity: EffectIntensity.MEDIUM,
            duration: 3000,
            description: { korean: "누적 효과", english: "Stackable effect" },
            stackable: true,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithStackable,
        hitPosition,
        60
      );

      expect(result.effects[0].stackable).toBe(true);
    });

    it("should set source to vital point ID", () => {
      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        60
      );

      expect(result.effects[0].source).toBe(mockVitalPoint.id);
    });

    it("should set startTime to current timestamp", () => {
      const hitPosition = { x: 100, y: 100 };
      const beforeTime = Date.now();
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        60
      );
      const afterTime = Date.now();

      expect(result.effects[0].startTime).toBeGreaterThanOrEqual(beforeTime);
      expect(result.effects[0].startTime).toBeLessThanOrEqual(afterTime);
    });

    it("should set endTime correctly based on duration", () => {
      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        hitPosition,
        60
      );

      const expectedEndTime =
        result.effects[0].startTime + result.effects[0].duration;
      expect(result.effects[0].endTime).toBe(expectedEndTime);
    });

    it("should handle multiple effects", () => {
      const vpWithMultipleEffects = {
        ...mockVitalPoint,
        effects: [
          {
            id: "effect1",
            type: VitalPointEffectType.STUN,
            intensity: EffectIntensity.MEDIUM,
            duration: 2000,
            description: { korean: "효과1", english: "Effect 1" },
            stackable: false,
          },
          {
            id: "effect2",
            type: VitalPointEffectType.PAIN,
            intensity: EffectIntensity.HIGH,
            duration: 4000,
            description: { korean: "효과2", english: "Effect 2" },
            stackable: true,
          },
        ],
      };

      const hitPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        vpWithMultipleEffects,
        hitPosition,
        60
      );

      expect(result.effects.length).toBe(2);
      expect(result.effects[0].type).toBe("stun");
      expect(result.effects[1].type).toBe("weakened");
    });

    it("should handle empty effects array", () => {
      const vpNoEffects = { ...mockVitalPoint, effects: [] };
      const hitPosition = { x: 100, y: 100 };

      const result = hitDetection.processVitalPointHit(
        vpNoEffects,
        hitPosition,
        60
      );

      expect(result.effects).toEqual([]);
    });
  });

  describe("edge cases", () => {
    it("should handle exact position match", () => {
      const exactPosition = { x: 100, y: 100 };
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        exactPosition,
        60
      );

      expect(result.hit).toBe(true);
      expect(result.damage).toBeGreaterThan(0);
    });

    it("should handle very large coordinates", () => {
      const largeVP = { ...mockVitalPoint, position: { x: 9999, y: 9999 } };
      const hitPosition = { x: 10000, y: 10000 };

      const result = hitDetection.processVitalPointHit(
        largeVP,
        hitPosition,
        60
      );

      expect(result).toBeDefined();
    });

    it("should handle very small radius", () => {
      const smallRadiusVP = { ...mockVitalPoint, radius: 1 };
      const hitPosition = { x: 100, y: 100 };

      const result = hitDetection.processVitalPointHit(
        smallRadiusVP,
        hitPosition,
        60
      );

      expect(result.hit).toBe(true);
    });

    it("should handle very large radius", () => {
      const largeRadiusVP = { ...mockVitalPoint, radius: 1000 };
      const farPosition = { x: 500, y: 500 };

      const result = hitDetection.processVitalPointHit(
        largeRadiusVP,
        farPosition,
        60
      );

      expect(result.hit).toBe(true);
    });

    it("should return MINOR severity for miss", () => {
      const missPosition = { x: 1000, y: 1000 };
      const result = hitDetection.processVitalPointHit(
        mockVitalPoint,
        missPosition,
        60
      );

      expect(result.severity).toBe(VitalPointSeverity.MINOR);
    });
  });
});
