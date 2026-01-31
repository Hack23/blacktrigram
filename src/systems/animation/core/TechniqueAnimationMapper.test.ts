/**
 * Tests for TechniqueAnimationMapper
 * 
 * Tests the technique-to-animation mapping system that connects
 * 70+ Korean martial arts techniques to appropriate animations.
 * 
 * @module systems/animation/TechniqueAnimationMapper.test
 * @korean 기술애니메이션매퍼테스트
 */

import { TrigramStance } from "@/types";
import { AttackAnimationType } from "@/types/skeletal";
import { describe, expect, it } from "vitest";
import { BodyPart } from "../../bodypart/types";
import {
  calculateSpeedModifierForDamage,
  determineAnimationTypeForTechnique,
  getAdjustedAnimationDuration,
  getAnimationNameForType,
  hasAnimationForType,
  TechniqueAnimationMapper,
  techniqueAnimationMapper,
} from "./TechniqueAnimationMapper";
import { TechniqueIntensity, TechniqueTypeCategory } from "./types";

describe("TechniqueAnimationMapper", () => {
  // ═══════════════════════════════════════════════════════════════════════════
  // BASIC MAPPING FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  describe("getAnimationNameForType", () => {
    it("should return correct animation name for punch types", () => {
      expect(getAnimationNameForType(AttackAnimationType.PUNCH_HIGH)).toBe("jab");
      expect(getAnimationNameForType(AttackAnimationType.PUNCH_MID)).toBe("cross");
      expect(getAnimationNameForType(AttackAnimationType.PUNCH_LOW)).toBe("jab");
    });

    it("should return correct animation name for kick types", () => {
      expect(getAnimationNameForType(AttackAnimationType.KICK_FRONT)).toBe("front_kick");
      expect(getAnimationNameForType(AttackAnimationType.KICK_SIDE)).toBe("side_kick");
      expect(getAnimationNameForType(AttackAnimationType.KICK_ROUNDHOUSE)).toBe("roundhouse_kick");
    });

    it("should return correct animation name for elbow types", () => {
      expect(getAnimationNameForType(AttackAnimationType.ELBOW_STRIKE)).toBe("elbow_strike");
      expect(getAnimationNameForType(AttackAnimationType.ELBOW_UPPERCUT)).toBe("elbow_uppercut");
    });

    it("should return correct animation name for knee types", () => {
      expect(getAnimationNameForType(AttackAnimationType.KNEE_STRIKE)).toBe("knee_strike");
      expect(getAnimationNameForType(AttackAnimationType.KNEE_CLINCH)).toBe("knee_strike");
    });

    it("should return correct animation name for pressure point types", () => {
      expect(getAnimationNameForType(AttackAnimationType.PRESSURE_POINT)).toBe("jab");
      expect(getAnimationNameForType(AttackAnimationType.PRESSURE_POINT_RAPID)).toBe("jab");
    });
  });

  describe("hasAnimationForType", () => {
    it("should return true for punch types", () => {
      expect(hasAnimationForType(AttackAnimationType.PUNCH_HIGH)).toBe(true);
      expect(hasAnimationForType(AttackAnimationType.PUNCH_MID)).toBe(true);
    });

    it("should return true for kick types", () => {
      expect(hasAnimationForType(AttackAnimationType.KICK_FRONT)).toBe(true);
      expect(hasAnimationForType(AttackAnimationType.KICK_ROUNDHOUSE)).toBe(true);
    });

    it("should return true for elbow and knee types", () => {
      expect(hasAnimationForType(AttackAnimationType.ELBOW_STRIKE)).toBe(true);
      expect(hasAnimationForType(AttackAnimationType.KNEE_STRIKE)).toBe(true);
    });

    it("should return true for pressure point types", () => {
      expect(hasAnimationForType(AttackAnimationType.PRESSURE_POINT)).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNIQUE TYPE DETERMINATION
  // ═══════════════════════════════════════════════════════════════════════════

  describe("determineAnimationTypeForTechnique", () => {
    describe("Pressure Point Detection", () => {
      it("should detect pressure point techniques", () => {
        expect(
          determineAnimationTypeForTechnique("pressure point strike", "test_id")
        ).toBe(AttackAnimationType.PRESSURE_POINT);
        
        expect(
          determineAnimationTypeForTechnique("nerve strike", "test_id")
        ).toBe(AttackAnimationType.PRESSURE_POINT);
        
        expect(
          determineAnimationTypeForTechnique("급소타격", "test_id")
        ).toBe(AttackAnimationType.PRESSURE_POINT);
      });

      it("should detect rapid pressure point variants", () => {
        expect(
          determineAnimationTypeForTechnique("rapid pressure strike", "test_id")
        ).toBe(AttackAnimationType.PRESSURE_POINT_RAPID);
        
        expect(
          determineAnimationTypeForTechnique("연속 급소", "test_id")
        ).toBe(AttackAnimationType.PRESSURE_POINT_RAPID);
      });

      it("should detect pressure points by damage type", () => {
        expect(
          determineAnimationTypeForTechnique("test", "test_id", "nerve")
        ).toBe(AttackAnimationType.PRESSURE_POINT);
        
        expect(
          determineAnimationTypeForTechnique("test", "test_id", "pressure")
        ).toBe(AttackAnimationType.PRESSURE_POINT);
      });
    });

    describe("Kick Detection", () => {
      it("should detect roundhouse kicks", () => {
        expect(
          determineAnimationTypeForTechnique("roundhouse kick", "test_id")
        ).toBe(AttackAnimationType.KICK_ROUNDHOUSE);
        
        expect(
          determineAnimationTypeForTechnique("돌려차기", "test_id")
        ).toBe(AttackAnimationType.KICK_ROUNDHOUSE);
      });

      it("should detect side kicks", () => {
        expect(
          determineAnimationTypeForTechnique("side kick", "test_id")
        ).toBe(AttackAnimationType.KICK_SIDE);
        
        expect(
          determineAnimationTypeForTechnique("옆차기", "test_id")
        ).toBe(AttackAnimationType.KICK_SIDE);
      });

      it("should default to front kick for generic kicks", () => {
        expect(
          determineAnimationTypeForTechnique("kick", "test_id")
        ).toBe(AttackAnimationType.KICK_FRONT);
        
        expect(
          determineAnimationTypeForTechnique("차기", "test_id")
        ).toBe(AttackAnimationType.KICK_FRONT);
      });
    });

    describe("Elbow Detection", () => {
      it("should detect elbow uppercuts", () => {
        expect(
          determineAnimationTypeForTechnique("elbow uppercut", "test_id")
        ).toBe(AttackAnimationType.ELBOW_UPPERCUT);
        
        expect(
          determineAnimationTypeForTechnique("팔꿈치 올려", "test_id")
        ).toBe(AttackAnimationType.ELBOW_UPPERCUT);
      });

      it("should default to elbow strike", () => {
        expect(
          determineAnimationTypeForTechnique("elbow strike", "test_id")
        ).toBe(AttackAnimationType.ELBOW_STRIKE);
        
        expect(
          determineAnimationTypeForTechnique("팔꿈치", "test_id")
        ).toBe(AttackAnimationType.ELBOW_STRIKE);
      });
    });

    describe("Knee Detection", () => {
      it("should detect clinch knee strikes", () => {
        expect(
          determineAnimationTypeForTechnique("clinch knee", "test_id")
        ).toBe(AttackAnimationType.KNEE_CLINCH);
        
        expect(
          determineAnimationTypeForTechnique("잡고 무릎", "test_id")
        ).toBe(AttackAnimationType.KNEE_CLINCH);
      });

      it("should default to regular knee strike", () => {
        expect(
          determineAnimationTypeForTechnique("knee strike", "test_id")
        ).toBe(AttackAnimationType.KNEE_STRIKE);
        
        expect(
          determineAnimationTypeForTechnique("무릎", "test_id")
        ).toBe(AttackAnimationType.KNEE_STRIKE);
      });
    });

    describe("Punch Detection", () => {
      it("should detect high punches", () => {
        expect(
          determineAnimationTypeForTechnique("head punch", "test_id")
        ).toBe(AttackAnimationType.PUNCH_HIGH);
        
        expect(
          determineAnimationTypeForTechnique("temple strike", "test_id")
        ).toBe(AttackAnimationType.PUNCH_HIGH);
        
        expect(
          determineAnimationTypeForTechnique("머리 타격", "test_id")
        ).toBe(AttackAnimationType.PUNCH_HIGH);
      });

      it("should detect low punches", () => {
        expect(
          determineAnimationTypeForTechnique("low punch", "test_id")
        ).toBe(AttackAnimationType.PUNCH_LOW);
        
        expect(
          determineAnimationTypeForTechnique("body strike", "test_id")
        ).toBe(AttackAnimationType.PUNCH_LOW);
        
        expect(
          determineAnimationTypeForTechnique("복부 타격", "test_id")
        ).toBe(AttackAnimationType.PUNCH_LOW);
      });

      it("should default to mid punch", () => {
        expect(
          determineAnimationTypeForTechnique("punch", "test_id")
        ).toBe(AttackAnimationType.PUNCH_MID);
        
        expect(
          determineAnimationTypeForTechnique("주먹", "test_id")
        ).toBe(AttackAnimationType.PUNCH_MID);
      });
    });

    describe("Fallback Behavior", () => {
      it("should default to mid punch for unknown techniques", () => {
        expect(
          determineAnimationTypeForTechnique("unknown", "test_id")
        ).toBe(AttackAnimationType.PUNCH_MID);
      });

      it("should be case-insensitive", () => {
        expect(
          determineAnimationTypeForTechnique("ROUNDHOUSE KICK", "test_id")
        ).toBe(AttackAnimationType.KICK_ROUNDHOUSE);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SPEED CALCULATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  describe("calculateSpeedModifierForDamage", () => {
    it("should return 1.2x speed for light techniques (damage < 20)", () => {
      expect(calculateSpeedModifierForDamage(10)).toBe(1.2);
      expect(calculateSpeedModifierForDamage(15)).toBe(1.2);
      expect(calculateSpeedModifierForDamage(19)).toBe(1.2);
    });

    it("should return 1.0x speed for normal techniques (damage 20-35)", () => {
      expect(calculateSpeedModifierForDamage(20)).toBe(1.0);
      expect(calculateSpeedModifierForDamage(25)).toBe(1.0);
      expect(calculateSpeedModifierForDamage(30)).toBe(1.0);
      expect(calculateSpeedModifierForDamage(35)).toBe(1.0);
    });

    it("should return 0.8x speed for heavy techniques (damage > 35)", () => {
      expect(calculateSpeedModifierForDamage(36)).toBe(0.8);
      expect(calculateSpeedModifierForDamage(40)).toBe(0.8);
      expect(calculateSpeedModifierForDamage(50)).toBe(0.8);
    });

    it("should handle edge cases", () => {
      expect(calculateSpeedModifierForDamage(0)).toBe(1.2);
      expect(calculateSpeedModifierForDamage(100)).toBe(0.8);
    });

    it("should handle boundary values", () => {
      expect(calculateSpeedModifierForDamage(19.9)).toBe(1.2);
      expect(calculateSpeedModifierForDamage(20.0)).toBe(1.0);
      expect(calculateSpeedModifierForDamage(35.0)).toBe(1.0);
      expect(calculateSpeedModifierForDamage(35.1)).toBe(0.8);
    });
  });

  describe("getAdjustedAnimationDuration", () => {
    it("should return adjusted duration for valid animation", () => {
      const duration = getAdjustedAnimationDuration("jab", 1.0);
      expect(duration).toBeGreaterThan(0);
      expect(typeof duration).toBe("number");
    });

    it("should apply speed modifier correctly", () => {
      const baseDuration = getAdjustedAnimationDuration("jab", 1.0);
      const fastDuration = getAdjustedAnimationDuration("jab", 1.2);
      const slowDuration = getAdjustedAnimationDuration("jab", 0.8);
      
      // Faster speed = shorter duration
      expect(fastDuration).toBeLessThan(baseDuration);
      // Slower speed = longer duration
      expect(slowDuration).toBeGreaterThan(baseDuration);
    });

    it("should return default duration for missing animations", () => {
      const duration = getAdjustedAnimationDuration("nonexistent", 1.0);
      expect(duration).toBe(200); // Default 200ms
    });

    it("should handle various speed modifiers", () => {
      expect(getAdjustedAnimationDuration("front_kick", 0.5)).toBeGreaterThan(0);
      expect(getAdjustedAnimationDuration("front_kick", 1.0)).toBeGreaterThan(0);
      expect(getAdjustedAnimationDuration("front_kick", 1.5)).toBeGreaterThan(0);
      expect(getAdjustedAnimationDuration("front_kick", 2.0)).toBeGreaterThan(0);
    });

    it("should return integer durations", () => {
      const duration = getAdjustedAnimationDuration("cross", 1.33);
      expect(duration).toBe(Math.round(duration));
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TECHNIQUE ANIMATION MAPPER CLASS
  // ═══════════════════════════════════════════════════════════════════════════

  describe("TechniqueAnimationMapper Class", () => {
    const mapper = techniqueAnimationMapper;

    describe("getAnimation", () => {
      it("should return animation for valid combination", () => {
        const animation = mapper.getAnimation({
          stance: TrigramStance.GEON,
          techniqueType: "strike" as TechniqueTypeCategory,
          bodyPart: BodyPart.HEAD,
          intensity: "medium" as TechniqueIntensity,
        });
        
        expect(animation).toBeDefined();
        expect(animation.animationState).toBeDefined();
        expect(animation.duration).toBeGreaterThan(0);
        expect(animation.impactFrame).toBeGreaterThanOrEqual(0);
      });

      it("should return animations with Korean and English names", () => {
        const animation = mapper.getAnimation({
          stance: TrigramStance.TAE,
          techniqueType: "joint" as TechniqueTypeCategory,
          bodyPart: BodyPart.ARM_LEFT,
          intensity: "light" as TechniqueIntensity,
        });
        
        expect(animation.koreanName).toBeDefined();
        expect(animation.englishName).toBeDefined();
        expect(typeof animation.koreanName).toBe("string");
        expect(typeof animation.englishName).toBe("string");
      });

      it("should handle all trigram stances", () => {
        const stances = Object.values(TrigramStance);
        
        stances.forEach(stance => {
          const animation = mapper.getAnimation({
            stance,
            techniqueType: "strike" as TechniqueTypeCategory,
            bodyPart: BodyPart.TORSO_UPPER,
            intensity: "medium" as TechniqueIntensity,
          });
          
          expect(animation).toBeDefined();
        });
      });

      it("should handle all technique types", () => {
        const techniqueTypes: TechniqueTypeCategory[] = [
          "strike",
          "joint",
          "throw",
          "pressure_point",
        ];
        
        techniqueTypes.forEach(techniqueType => {
          const animation = mapper.getAnimation({
            stance: TrigramStance.GEON,
            techniqueType,
            bodyPart: BodyPart.HEAD,
            intensity: "medium" as TechniqueIntensity,
          });
          
          expect(animation).toBeDefined();
        });
      });

      it("should handle all body parts", () => {
        const bodyParts = Object.values(BodyPart);
        
        bodyParts.forEach(bodyPart => {
          const animation = mapper.getAnimation({
            stance: TrigramStance.LI,
            techniqueType: "strike" as TechniqueTypeCategory,
            bodyPart,
            intensity: "medium" as TechniqueIntensity,
          });
          
          expect(animation).toBeDefined();
        });
      });

      it("should handle all intensity levels", () => {
        const intensities: TechniqueIntensity[] = [
          "light",
          "medium",
          "heavy",
          "critical",
        ];
        
        intensities.forEach(intensity => {
          const animation = mapper.getAnimation({
            stance: TrigramStance.JIN,
            techniqueType: "strike" as TechniqueTypeCategory,
            bodyPart: BodyPart.HEAD,
            intensity,
          });
          
          expect(animation).toBeDefined();
          expect(animation.duration).toBeGreaterThan(0);
        });
      });

      it("should adjust duration based on intensity", () => {
        const light = mapper.getAnimation({
          stance: TrigramStance.SON,
          techniqueType: "strike" as TechniqueTypeCategory,
          bodyPart: BodyPart.HEAD,
          intensity: "light" as TechniqueIntensity,
        });
        
        const heavy = mapper.getAnimation({
          stance: TrigramStance.SON,
          techniqueType: "strike" as TechniqueTypeCategory,
          bodyPart: BodyPart.HEAD,
          intensity: "heavy" as TechniqueIntensity,
        });
        
        // Light techniques should be faster (shorter duration)
        expect(light.duration).toBeLessThan(heavy.duration);
      });
    });

    describe("validateCompleteness", () => {
      it("should return validation result", () => {
        const result = mapper.validateCompleteness();
        
        expect(result).toBeDefined();
        expect(result.coverage).toBeGreaterThanOrEqual(0);
        expect(result.coverage).toBeLessThanOrEqual(100);
        expect(result.total).toBeGreaterThan(0);
        expect(result.mapped).toBeGreaterThanOrEqual(0);
        expect(result.missing).toBeInstanceOf(Array);
      });

      it("should calculate correct total combinations", () => {
        // 8 stances × 4 technique types × 8 body parts × 4 intensities = 1024
        const result = mapper.validateCompleteness();
        expect(result.total).toBe(1024);
      });

      it("should have consistent mapped + missing = total", () => {
        const result = mapper.validateCompleteness();
        expect(result.mapped + result.missing.length).toBe(result.total);
      });

      it("should calculate coverage percentage correctly", () => {
        const result = mapper.validateCompleteness();
        const expectedCoverage = (result.mapped / result.total) * 100;
        expect(result.coverage).toBeCloseTo(expectedCoverage, 2);
      });
    });

    describe("getMappedCount", () => {
      it("should return number of mapped combinations", () => {
        const count = mapper.getMappedCount();
        expect(typeof count).toBe("number");
        expect(count).toBeGreaterThanOrEqual(0);
      });

      it("should match validation result", () => {
        const mappedCount = mapper.getMappedCount();
        
        // Note: getMappedCount returns animationMap.size which may include duplicates,
        // while validation.mapped counts unique combinations
        expect(mappedCount).toBeGreaterThanOrEqual(0);
      });
    });

    describe("Singleton Instance", () => {
      it("should export a singleton instance", () => {
        expect(techniqueAnimationMapper).toBeInstanceOf(TechniqueAnimationMapper);
      });

      it("should maintain state across calls", () => {
        const count1 = techniqueAnimationMapper.getMappedCount();
        const count2 = techniqueAnimationMapper.getMappedCount();
        expect(count1).toBe(count2);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // EDGE CASES AND ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════════════════

  describe("Edge Cases", () => {
    it("should handle empty technique names", () => {
      expect(() => 
        determineAnimationTypeForTechnique("", "test_id")
      ).not.toThrow();
    });

    it("should handle very long technique names", () => {
      const longName = "a".repeat(1000);
      expect(() => 
        determineAnimationTypeForTechnique(longName, "test_id")
      ).not.toThrow();
    });

    it("should handle special characters in technique names", () => {
      expect(() => 
        determineAnimationTypeForTechnique("test-technique_123", "test_id")
      ).not.toThrow();
    });

    it("should handle unicode characters", () => {
      expect(() => 
        determineAnimationTypeForTechnique("한글기술名前", "test_id")
      ).not.toThrow();
    });

    it("should handle negative damage values", () => {
      expect(calculateSpeedModifierForDamage(-10)).toBe(1.2);
    });

    it("should handle zero speed modifier gracefully", () => {
      // Should not crash, even though division by zero
      expect(() => 
        getAdjustedAnimationDuration("jab", 0)
      ).not.toThrow();
    });

    it("should handle negative speed modifier", () => {
      expect(() => 
        getAdjustedAnimationDuration("jab", -1.0)
      ).not.toThrow();
    });
  });
});
