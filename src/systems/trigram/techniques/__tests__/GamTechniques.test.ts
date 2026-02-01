/**
 * Tests for Gam (Water) Trigram Techniques
 * ☵ 감괘 기술 테스트
 *
 * Tests counter-attack properties, flow types, and timing windows
 * for the Gam (Water) trigram techniques.
 *
 * @module systems/trigram/techniques/__tests__/GamTechniques
 */

import { describe, it, expect } from "vitest";
import {
  GAM_TECHNIQUES,
  GAM_TECHNIQUE_COUNT,
  getGamTechniqueById,
  getGamTechniquesByType,
} from "../GamTechniques";
import { CombatAttackType, TrigramStance } from "../../../../types/common";

describe("☵ Gam (Water) Trigram Techniques", () => {
  describe("Technique Count", () => {
    it("should have exactly 6 techniques", () => {
      expect(GAM_TECHNIQUE_COUNT).toBe(6);
      expect(GAM_TECHNIQUES.length).toBe(6);
    });
  });

  describe("Technique Structure", () => {
    it("should have all required properties for each technique", () => {
      GAM_TECHNIQUES.forEach((technique) => {
        // Core identification
        expect(technique.id).toBeDefined();
        expect(technique.name).toBeDefined();
        expect(technique.name.korean).toBeDefined();
        expect(technique.name.english).toBeDefined();
        expect(technique.name.romanized).toBeDefined();

        // Combat stats
        expect(technique.damage).toBeGreaterThan(0);
        expect(technique.kiCost).toBeGreaterThan(0);
        expect(technique.staminaCost).toBeGreaterThan(0);
        expect(technique.accuracy).toBeGreaterThan(0);
        expect(technique.accuracy).toBeLessThanOrEqual(1);

        // Timing
        expect(technique.executionTime).toBeGreaterThan(0);
        expect(technique.recoveryTime).toBeGreaterThan(0);

        // Stance
        expect(technique.stance).toBe(TrigramStance.GAM);
      });
    });
  });

  describe("Counter-Attack Properties", () => {
    describe("Primary Counter - Water Counter (수류반격)", () => {
      it("should have counter timing properties", () => {
        const technique = getGamTechniqueById("gam_water_counter");

        expect(technique).toBeDefined();
        expect(technique?.counterWindow).toBe(200); // 200ms standard window
        expect(technique?.perfectWindow).toBe(50); // 50ms perfect window
        expect(technique?.counterMultiplier).toBe(1.8); // 1.8x damage bonus
        expect(technique?.flowType).toBe("adaptive"); // Adaptive flow
      });

      it("should have optimized execution time for reactive flow", () => {
        const technique = getGamTechniqueById("gam_water_counter");

        expect(technique).toBeDefined();
        // Optimized from 600ms to 400ms for quick reactive flow
        expect(technique?.executionTime).toBe(400);
        expect(technique?.executionTime).toBeGreaterThanOrEqual(300); // Min 300ms
        expect(technique?.executionTime).toBeLessThanOrEqual(600); // Max 600ms
      });

      it("should have enhanced Korean description with flow terminology", () => {
        const technique = getGamTechniqueById("gam_water_counter");

        expect(technique).toBeDefined();
        expect(technique?.description.korean).toContain("적응형 흐름");
        expect(technique?.description.english).toContain("Adaptive flow");
      });
    });

    describe("Circular Parry (원형받기)", () => {
      it("should have counter timing properties with flowing type", () => {
        const technique = getGamTechniqueById("gam_circular_parry");

        expect(technique).toBeDefined();
        expect(technique?.counterWindow).toBe(200); // Standard window
        expect(technique?.perfectWindow).toBe(50); // Perfect window
        expect(technique?.counterMultiplier).toBe(1.6); // 1.6x damage bonus
        expect(technique?.flowType).toBe("flowing"); // Flowing circular motion
      });

      it("should have optimized execution time for circular flow", () => {
        const technique = getGamTechniqueById("gam_circular_parry");

        expect(technique).toBeDefined();
        // Optimized from 550ms to 500ms
        expect(technique?.executionTime).toBe(500);
        expect(technique?.type).toBe(CombatAttackType.COUNTER_ATTACK);
      });
    });

    describe("Wrist Twist Counter (손목비틀기반격)", () => {
      it("should have counter timing properties with reactive type", () => {
        const technique = getGamTechniqueById("gam_wrist_twist_counter");

        expect(technique).toBeDefined();
        expect(technique?.counterWindow).toBe(200); // Standard window
        expect(technique?.perfectWindow).toBe(50); // Perfect window
        expect(technique?.counterMultiplier).toBe(2.0); // 2.0x damage bonus (highest)
        expect(technique?.flowType).toBe("reactive"); // Reactive instant capture
      });

      it("should have optimized execution time for reactive joint lock", () => {
        const technique = getGamTechniqueById("gam_wrist_twist_counter");

        expect(technique).toBeDefined();
        // Optimized from 700ms to 550ms
        expect(technique?.executionTime).toBe(550);
        expect(technique?.type).toBe(CombatAttackType.COUNTER_ATTACK);
      });

      it("should have highest counter multiplier for joint lock", () => {
        const technique = getGamTechniqueById("gam_wrist_twist_counter");

        expect(technique).toBeDefined();
        expect(technique?.counterMultiplier).toBe(2.0);

        // Should be highest among counter techniques
        const waterCounter = getGamTechniqueById("gam_water_counter");
        const circularParry = getGamTechniqueById("gam_circular_parry");

        expect(technique?.counterMultiplier).toBeGreaterThan(
          waterCounter?.counterMultiplier ?? 0
        );
        expect(technique?.counterMultiplier).toBeGreaterThan(
          circularParry?.counterMultiplier ?? 0
        );
      });
    });
  });

  describe("Flow Types (흐름 유형)", () => {
    it("should have valid flow types for counter techniques", () => {
      const counterTechniques = getGamTechniquesByType(
        CombatAttackType.COUNTER_ATTACK
      );

      counterTechniques.forEach((technique) => {
        if (technique.flowType) {
          expect(["adaptive", "flowing", "reactive"]).toContain(
            technique.flowType
          );
        }
      });
    });

    it("should have adaptive flow for primary counter", () => {
      const technique = getGamTechniqueById("gam_water_counter");
      expect(technique?.flowType).toBe("adaptive");
    });

    it("should have flowing type for circular parry", () => {
      const technique = getGamTechniqueById("gam_circular_parry");
      expect(technique?.flowType).toBe("flowing");
    });

    it("should have reactive type for joint locks", () => {
      const technique = getGamTechniqueById("gam_wrist_twist_counter");
      expect(technique?.flowType).toBe("reactive");
    });
  });

  describe("Counter Timing Windows (반격 타이밍 윈도우)", () => {
    it("should have standard 200ms counter window for all counter techniques", () => {
      const counterTechniques = getGamTechniquesByType(
        CombatAttackType.COUNTER_ATTACK
      );

      counterTechniques.forEach((technique) => {
        if (technique.counterWindow) {
          expect(technique.counterWindow).toBe(200);
        }
      });
    });

    it("should have standard 50ms perfect window for all counter techniques", () => {
      const counterTechniques = getGamTechniquesByType(
        CombatAttackType.COUNTER_ATTACK
      );

      counterTechniques.forEach((technique) => {
        if (technique.perfectWindow) {
          expect(technique.perfectWindow).toBe(50);
        }
      });
    });

    it("should have perfect window smaller than counter window", () => {
      const counterTechniques = getGamTechniquesByType(
        CombatAttackType.COUNTER_ATTACK
      );

      counterTechniques.forEach((technique) => {
        if (technique.counterWindow && technique.perfectWindow) {
          expect(technique.perfectWindow).toBeLessThan(
            technique.counterWindow
          );
        }
      });
    });
  });

  describe("Counter Damage Multipliers (반격 데미지 배수)", () => {
    it("should have counter multipliers between 1.5x and 2.0x", () => {
      const counterTechniques = getGamTechniquesByType(
        CombatAttackType.COUNTER_ATTACK
      );

      counterTechniques.forEach((technique) => {
        if (technique.counterMultiplier) {
          expect(technique.counterMultiplier).toBeGreaterThanOrEqual(1.5);
          expect(technique.counterMultiplier).toBeLessThanOrEqual(2.0);
        }
      });
    });

    it("should have joint lock with highest counter multiplier", () => {
      const wristTwist = getGamTechniqueById("gam_wrist_twist_counter");
      const waterCounter = getGamTechniqueById("gam_water_counter");
      const circularParry = getGamTechniqueById("gam_circular_parry");

      expect(wristTwist?.counterMultiplier).toBe(2.0);
      expect(waterCounter?.counterMultiplier).toBe(1.8);
      expect(circularParry?.counterMultiplier).toBe(1.6);
    });
  });

  describe("Execution Time Optimization (실행 시간 최적화)", () => {
    it("should have counter techniques within 300-600ms range", () => {
      const counterTechniques = getGamTechniquesByType(
        CombatAttackType.COUNTER_ATTACK
      );

      counterTechniques.forEach((technique) => {
        expect(technique.executionTime).toBeGreaterThanOrEqual(300);
        expect(technique.executionTime).toBeLessThanOrEqual(600);
      });
    });

    it("should have fastest counter as primary water counter", () => {
      const waterCounter = getGamTechniqueById("gam_water_counter");
      const counterTechniques = getGamTechniquesByType(
        CombatAttackType.COUNTER_ATTACK
      );

      expect(waterCounter?.executionTime).toBe(400);

      // Should be among the fastest
      counterTechniques.forEach((technique) => {
        if (technique.id !== "gam_water_counter") {
          expect(waterCounter?.executionTime).toBeLessThanOrEqual(
            technique.executionTime
          );
        }
      });
    });
  });

  describe("Technique Lookup Functions", () => {
    it("should find technique by ID", () => {
      const technique = getGamTechniqueById("gam_water_counter");

      expect(technique).toBeDefined();
      expect(technique?.id).toBe("gam_water_counter");
      expect(technique?.name.korean).toBe("수류반격");
    });

    it("should return undefined for non-existent ID", () => {
      const technique = getGamTechniqueById("non_existent_technique");
      expect(technique).toBeUndefined();
    });

    it("should find all counter techniques by type", () => {
      const counterTechniques = getGamTechniquesByType(
        CombatAttackType.COUNTER_ATTACK
      );

      expect(counterTechniques.length).toBeGreaterThan(0);
      counterTechniques.forEach((technique) => {
        expect(technique.type).toBe(CombatAttackType.COUNTER_ATTACK);
      });
    });

    it("should find throw techniques", () => {
      const throwTechniques = getGamTechniquesByType(CombatAttackType.THROW);

      expect(throwTechniques.length).toBe(2); // redirect_throw and hip_throw
      throwTechniques.forEach((technique) => {
        expect(technique.type).toBe(CombatAttackType.THROW);
      });
    });
  });

  describe("Korean Terminology (한국어 용어)", () => {
    it("should have bilingual names with romanization", () => {
      GAM_TECHNIQUES.forEach((technique) => {
        expect(technique.name.korean).toBeDefined();
        expect(technique.name.korean.length).toBeGreaterThan(0);

        expect(technique.name.english).toBeDefined();
        expect(technique.name.english.length).toBeGreaterThan(0);

        expect(technique.name.romanized).toBeDefined();
        expect(technique.name.romanized.length).toBeGreaterThan(0);
      });
    });

    it("should have bilingual descriptions", () => {
      GAM_TECHNIQUES.forEach((technique) => {
        expect(technique.description.korean).toBeDefined();
        expect(technique.description.korean.length).toBeGreaterThan(0);

        expect(technique.description.english).toBeDefined();
        expect(technique.description.english.length).toBeGreaterThan(0);
      });
    });

    it("should have Korean flow terminology in counter descriptions", () => {
      const waterCounter = getGamTechniqueById("gam_water_counter");
      const circularParry = getGamTechniqueById("gam_circular_parry");
      const wristTwist = getGamTechniqueById("gam_wrist_twist_counter");

      expect(waterCounter?.description.korean).toContain("적응형 흐름");
      expect(circularParry?.description.korean).toContain("흐르는 원형");
      expect(wristTwist?.description.korean).toContain("반응형 포착");
    });
  });

  describe("Animation Configuration", () => {
    it("should have animation category and ID for all techniques", () => {
      GAM_TECHNIQUES.forEach((technique) => {
        expect(technique.animationCategory).toBeDefined();
        expect(technique.animationId).toBeDefined();
        expect(technique.animationId).toBe(technique.id); // 1-1 mapping
      });
    });

    it("should have counter techniques with counter animation category", () => {
      const waterCounter = getGamTechniqueById("gam_water_counter");
      expect(waterCounter?.animationCategory).toBe("counter");
    });

    it("should have throw techniques with throw animation category", () => {
      const redirectThrow = getGamTechniqueById("gam_redirect_throw");
      const hipThrow = getGamTechniqueById("gam_hip_throw");

      expect(redirectThrow?.animationCategory).toBe("throw");
      expect(hipThrow?.animationCategory).toBe("throw");
    });
  });

  describe("Water Philosophy (물의 철학)", () => {
    it("should embody adaptability in counter techniques", () => {
      const counterTechniques = getGamTechniquesByType(
        CombatAttackType.COUNTER_ATTACK
      );

      // All counter techniques should have counter properties
      counterTechniques.forEach((technique) => {
        expect(technique.counterWindow).toBeDefined();
        expect(technique.perfectWindow).toBeDefined();
        expect(technique.counterMultiplier).toBeDefined();
        expect(technique.flowType).toBeDefined();
      });
    });

    it("should have balanced damage for flow-based techniques", () => {
      GAM_TECHNIQUES.forEach((technique) => {
        // Water techniques should not be the highest damage
        // (they rely on redirection and counter timing)
        expect(technique.damage).toBeLessThan(50);
      });
    });

    it("should favor accuracy over raw damage", () => {
      const counterTechniques = getGamTechniquesByType(
        CombatAttackType.COUNTER_ATTACK
      );

      // Counter techniques should have high accuracy
      counterTechniques.forEach((technique) => {
        expect(technique.accuracy).toBeGreaterThanOrEqual(0.85);
      });
    });
  });
});
