/**
 * ☶ Gan (Mountain) Techniques Test Suite
 * 간괘 기술 테스트
 *
 * Tests for the enhanced Gan (Mountain) trigram techniques with
 * immovable defense mechanics including block timing, damage reduction,
 * stability bonuses, and rooting effects.
 *
 * @module systems/trigram/techniques/GanTechniques.test
 * @korean 간괘기술테스트
 */

import { describe, expect, it } from "vitest";
import { CombatAttackType, TrigramStance } from "../../../types/common";
import {
  GAN_TECHNIQUES,
  GAN_TECHNIQUE_COUNT,
  getGanTechniqueById,
  getGanTechniquesByType,
} from "./GanTechniques";

describe("GanTechniques", () => {
  describe("Technique Count", () => {
    it("should have 6 techniques", () => {
      expect(GAN_TECHNIQUE_COUNT).toBe(6);
      expect(GAN_TECHNIQUES.length).toBe(6);
    });

    it("should have all techniques in GAN stance", () => {
      GAN_TECHNIQUES.forEach((technique) => {
        expect(technique.stance).toBe(TrigramStance.GAN);
      });
    });
  });

  describe("Defensive Mechanics Properties", () => {
    it("should have blockWindow property on block techniques", () => {
      const blockTechniques = GAN_TECHNIQUES.filter(
        (t) => t.type === CombatAttackType.BLOCK
      );

      expect(blockTechniques.length).toBeGreaterThan(0);

      blockTechniques.forEach((technique) => {
        expect(technique.blockWindow).toBeDefined();
        expect(technique.blockWindow).toBeGreaterThan(0);
        expect(technique.blockWindow).toBeGreaterThanOrEqual(200);
        expect(technique.blockWindow).toBeLessThanOrEqual(500);
      });
    });

    it("should have perfectBlockWindow property on block techniques", () => {
      const blockTechniques = GAN_TECHNIQUES.filter(
        (t) => t.type === CombatAttackType.BLOCK
      );

      blockTechniques.forEach((technique) => {
        expect(technique.perfectBlockWindow).toBeDefined();
        expect(technique.perfectBlockWindow).toBeGreaterThan(0);
        expect(technique.perfectBlockWindow).toBeLessThan(
          technique.blockWindow!
        );
      });
    });

    it("should have damageReduction between 0.5 and 0.75", () => {
      const defensiveTechniques = GAN_TECHNIQUES.filter(
        (t) =>
          t.type === CombatAttackType.BLOCK ||
          t.type === CombatAttackType.COUNTER_ATTACK ||
          t.type === CombatAttackType.GRAPPLE
      );

      defensiveTechniques.forEach((technique) => {
        expect(technique.damageReduction).toBeDefined();
        expect(technique.damageReduction).toBeGreaterThanOrEqual(0.5);
        expect(technique.damageReduction).toBeLessThanOrEqual(0.75);
      });
    });

    it("should have stabilityBonus between 1.2 and 1.8", () => {
      GAN_TECHNIQUES.forEach((technique) => {
        if (technique.stabilityBonus !== undefined) {
          expect(technique.stabilityBonus).toBeGreaterThanOrEqual(1.2);
          expect(technique.stabilityBonus).toBeLessThanOrEqual(1.8);
        }
      });
    });

    it("should have rooting effect on appropriate techniques", () => {
      const rootingTechniques = GAN_TECHNIQUES.filter(
        (t) => t.rootingEffect === true
      );

      // Should have at least 4 rooting techniques (blocks, stance, reversals)
      expect(rootingTechniques.length).toBeGreaterThanOrEqual(4);

      // All BLOCK types should have rooting
      const blockTechniques = GAN_TECHNIQUES.filter(
        (t) => t.type === CombatAttackType.BLOCK
      );
      blockTechniques.forEach((technique) => {
        expect(technique.rootingEffect).toBe(true);
      });
    });
  });

  describe("Execution Time Optimization", () => {
    it("should have fast executionTime for BLOCK techniques (280-700ms)", () => {
      const blockTechniques = GAN_TECHNIQUES.filter(
        (t) => t.type === CombatAttackType.BLOCK
      );

      // BLOCK techniques specifically optimized for fast defensive reactions
      // Updated ranges after 40% timing increase for better visibility
      blockTechniques.forEach((technique) => {
        expect(technique.executionTime).toBeGreaterThanOrEqual(280);
        expect(technique.executionTime).toBeLessThanOrEqual(700);
      });
    });

    it("should have fastest response on immovable_stance", () => {
      const immovableStance = getGanTechniqueById("gan_immovable_stance");
      expect(immovableStance).toBeDefined();
      // Updated from 250ms to 350ms after 40% timing increase for visibility
      expect(immovableStance!.executionTime).toBe(350);
    });
  });

  describe("Korean Bilingual Naming", () => {
    it("should have Korean and English names for all techniques", () => {
      GAN_TECHNIQUES.forEach((technique) => {
        expect(technique.name.korean).toBeDefined();
        expect(technique.name.korean.length).toBeGreaterThan(0);
        expect(technique.name.english).toBeDefined();
        expect(technique.name.english.length).toBeGreaterThan(0);
        expect(technique.name.romanized).toBeDefined();
        expect(technique.name.romanized.length).toBeGreaterThan(0);
      });
    });

    it("should have Korean descriptions", () => {
      GAN_TECHNIQUES.forEach((technique) => {
        expect(technique.description.korean).toBeDefined();
        expect(technique.description.korean.length).toBeGreaterThan(0);
        expect(technique.description.english).toBeDefined();
        expect(technique.description.english.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Technique Distribution", () => {
    it("should have 3 BLOCK techniques", () => {
      const blockTechniques = getGanTechniquesByType(CombatAttackType.BLOCK);
      expect(blockTechniques.length).toBe(3);
    });

    it("should have 2 COUNTER_ATTACK techniques", () => {
      const counterTechniques = getGanTechniquesByType(
        CombatAttackType.COUNTER_ATTACK
      );
      expect(counterTechniques.length).toBe(2);
    });

    it("should have 1 GRAPPLE technique", () => {
      const grappleTechniques = getGanTechniquesByType(
        CombatAttackType.GRAPPLE
      );
      expect(grappleTechniques.length).toBe(1);
    });
  });

  describe("Technique Retrieval Functions", () => {
    it("should retrieve technique by ID", () => {
      const technique = getGanTechniqueById("gan_rock_defense");
      expect(technique).toBeDefined();
      expect(technique!.id).toBe("gan_rock_defense");
      expect(technique!.name.korean).toBe("반석방어");
    });

    it("should return undefined for invalid ID", () => {
      const technique = getGanTechniqueById("invalid_gan_technique");
      expect(technique).toBeUndefined();
    });

    it("should retrieve techniques by type", () => {
      const blockTechniques = getGanTechniquesByType(CombatAttackType.BLOCK);
      expect(blockTechniques.length).toBeGreaterThan(0);
      blockTechniques.forEach((technique) => {
        expect(technique.type).toBe(CombatAttackType.BLOCK);
      });
    });
  });

  describe("Immovable Defense Philosophy", () => {
    it("should embody mountain-like stability in technique properties", () => {
      // All techniques should have defensive characteristics
      GAN_TECHNIQUES.forEach((technique) => {
        // BLOCK techniques should have comprehensive defensive properties
        if (technique.type === CombatAttackType.BLOCK) {
          expect(technique.blockWindow).toBeDefined();
          expect(technique.damageReduction).toBeDefined();
          expect(technique.stabilityBonus).toBeDefined();
          expect(technique.rootingEffect).toBeDefined();
        } else {
          // COUNTER_ATTACK and GRAPPLE techniques should have at least some defensive properties
          const hasDefensiveProps =
            technique.blockWindow ||
            technique.damageReduction ||
            technique.stabilityBonus ||
            technique.rootingEffect;
          expect(hasDefensiveProps).toBeTruthy();
        }
      });
    });

    it("should have highest damage reduction on immovable_stance", () => {
      const immovableStance = getGanTechniqueById("gan_immovable_stance");
      expect(immovableStance).toBeDefined();
      expect(immovableStance!.damageReduction).toBe(0.75);

      // Should be highest among all GAN techniques
      GAN_TECHNIQUES.forEach((technique) => {
        if (technique.damageReduction) {
          expect(technique.damageReduction).toBeLessThanOrEqual(0.75);
        }
      });
    });

    it("should have highest stability on immovable_stance", () => {
      const immovableStance = getGanTechniqueById("gan_immovable_stance");
      expect(immovableStance).toBeDefined();
      expect(immovableStance!.stabilityBonus).toBe(1.8);

      // Should be highest among all GAN techniques
      GAN_TECHNIQUES.forEach((technique) => {
        if (technique.stabilityBonus) {
          expect(technique.stabilityBonus).toBeLessThanOrEqual(1.8);
        }
      });
    });
  });

  describe("Animation Properties", () => {
    it("should have animation configuration for all techniques", () => {
      GAN_TECHNIQUES.forEach((technique) => {
        expect(technique.animationCategory).toBeDefined();
        expect(technique.animationId).toBeDefined();
        expect(technique.animationType).toBeDefined();
        expect(technique.animationSpeed).toBeDefined();
      });
    });

    it("should have appropriate animation categories", () => {
      const validCategories = [
        "defensive",
        "stance",
        "counter",
        "grapple",
      ];

      GAN_TECHNIQUES.forEach((technique) => {
        if (technique.animationCategory) {
          expect(validCategories).toContain(technique.animationCategory);
        }
      });
    });
  });

  describe("Balance Properties", () => {
    it("should have required categorization fields", () => {
      GAN_TECHNIQUES.forEach((technique) => {
        expect(technique.category).toBeDefined();
        expect(technique.range).toBeDefined();
        expect(technique.speed).toBeDefined();
      });
    });

    it("should have appropriate Ki and Stamina costs", () => {
      GAN_TECHNIQUES.forEach((technique) => {
        expect(technique.kiCost).toBeGreaterThan(0);
        expect(technique.kiCost).toBeLessThanOrEqual(25);
        expect(technique.staminaCost).toBeGreaterThan(0);
        expect(technique.staminaCost).toBeLessThanOrEqual(30);
      });
    });
  });
});
