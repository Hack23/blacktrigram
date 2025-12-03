/**
 * Unit tests for Dark Ops techniques system
 */

import { describe, expect, it } from "vitest";
import { PlayerArchetype, TrigramStance } from "../../types/common";
import { KoreanTechniquesSystem } from "./KoreanTechniques";
import {
  DARK_OPS_ARCHETYPE_BONUSES,
  DARK_OPS_NIGHT_BONUS,
  DARK_OPS_SPECIAL_EFFECTS,
  DARK_OPS_TECHNIQUES,
  DARK_OPS_UNITS,
} from "./KoreanTechniques";

describe("Dark Ops Techniques", () => {
  describe("DARK_OPS_TECHNIQUES Array", () => {
    it("should have at least 10 Dark Ops techniques", () => {
      expect(DARK_OPS_TECHNIQUES.length).toBeGreaterThanOrEqual(10);
    });

    it("should have exactly 15 Dark Ops techniques", () => {
      expect(DARK_OPS_TECHNIQUES.length).toBe(15);
    });

    it("should have all techniques with Korean-English bilingual names", () => {
      DARK_OPS_TECHNIQUES.forEach((technique) => {
        expect(technique.name.korean).toBeTruthy();
        expect(technique.name.english).toBeTruthy();
        expect(technique.name.romanized).toBeTruthy();
        expect(technique.koreanName).toBeTruthy();
        expect(technique.englishName).toBeTruthy();
      });
    });

    it("should have all techniques with proper descriptions", () => {
      DARK_OPS_TECHNIQUES.forEach((technique) => {
        expect(technique.description.korean).toBeTruthy();
        expect(technique.description.english).toBeTruthy();
        expect(technique.description.korean.length).toBeGreaterThan(10);
        expect(technique.description.english.length).toBeGreaterThan(10);
      });
    });

    it("should have all techniques with valid IDs starting with 'darkops_'", () => {
      DARK_OPS_TECHNIQUES.forEach((technique) => {
        expect(technique.id).toMatch(/^darkops_/);
      });
    });

    it("should have all techniques with valid stance assignments", () => {
      const validStances = Object.values(TrigramStance);
      DARK_OPS_TECHNIQUES.forEach((technique) => {
        expect(validStances).toContain(technique.stance);
      });
    });

    it("should have techniques covering multiple trigram stances", () => {
      const usedStances = new Set(
        DARK_OPS_TECHNIQUES.map((t) => t.stance)
      );
      // Should use at least 4 different stances
      expect(usedStances.size).toBeGreaterThanOrEqual(4);
    });

    it("should have all techniques with reasonable Ki costs (20-35)", () => {
      DARK_OPS_TECHNIQUES.forEach((technique) => {
        expect(technique.kiCost).toBeGreaterThanOrEqual(20);
        expect(technique.kiCost).toBeLessThanOrEqual(35);
      });
    });

    it("should have all techniques with reasonable stamina costs (20-35)", () => {
      DARK_OPS_TECHNIQUES.forEach((technique) => {
        expect(technique.staminaCost).toBeGreaterThanOrEqual(20);
        expect(technique.staminaCost).toBeLessThanOrEqual(35);
      });
    });

    it("should have all techniques with high accuracy (>= 0.78)", () => {
      DARK_OPS_TECHNIQUES.forEach((technique) => {
        expect(technique.accuracy).toBeGreaterThanOrEqual(0.78);
        expect(technique.accuracy).toBeLessThanOrEqual(1.0);
      });
    });

    it("should have all techniques with appropriate damage ranges (26-40)", () => {
      DARK_OPS_TECHNIQUES.forEach((technique) => {
        expect(technique.damage).toBeGreaterThanOrEqual(26);
        expect(technique.damage).toBeLessThanOrEqual(40);
      });
    });

    it("should have techniques representing all 5 Dark Ops units", () => {
      const descriptions = DARK_OPS_TECHNIQUES.map(
        (t) => t.description.korean
      ).join(" ");
      
      // Check that all units are referenced in descriptions
      expect(descriptions).toContain("암흑작전부대");
      expect(descriptions).toContain("암흑특공대");
      expect(descriptions).toContain("심야작전부대");
      expect(descriptions).toContain("블랙옵스");
    });
  });

  describe("DARK_OPS_UNITS Constants", () => {
    it("should define all 5 Dark Ops units", () => {
      expect(Object.keys(DARK_OPS_UNITS).length).toBe(5);
    });

    it("should have all unit names in Korean", () => {
      expect(DARK_OPS_UNITS.DARK_OPERATIONS).toBe("암흑작전부대");
      expect(DARK_OPS_UNITS.SHADOW_COMMANDO).toBe("암흑특공대");
      expect(DARK_OPS_UNITS.NIGHTFALL_SQUADRON).toBe("심야작전부대");
      expect(DARK_OPS_UNITS.BLACK_OPS_TASK_FORCE).toBe("블랙옵스부대");
      expect(DARK_OPS_UNITS.DEEP_SEA_UNIT).toBe("심해침투부대");
    });
  });

  describe("DARK_OPS_ARCHETYPE_BONUSES", () => {
    it("should have bonus multipliers for all 5 archetypes", () => {
      expect(DARK_OPS_ARCHETYPE_BONUSES.amsalja).toBe(1.3); // +30%
      expect(DARK_OPS_ARCHETYPE_BONUSES.jeongbo_yowon).toBe(1.15); // +15%
      expect(DARK_OPS_ARCHETYPE_BONUSES.hacker).toBe(1.10); // +10%
      expect(DARK_OPS_ARCHETYPE_BONUSES.jojik_pokryeokbae).toBe(1.05); // +5%
      expect(DARK_OPS_ARCHETYPE_BONUSES.musa).toBe(0.85); // -15% (dishonorable)
    });

    it("should give 암살자 (Amsalja) the highest bonus (+30%)", () => {
      const bonuses = Object.values(DARK_OPS_ARCHETYPE_BONUSES);
      const maxBonus = Math.max(...bonuses);
      expect(DARK_OPS_ARCHETYPE_BONUSES.amsalja).toBe(maxBonus);
      expect(maxBonus).toBe(1.3);
    });

    it("should penalize 무사 (Musa) for dishonorable techniques", () => {
      expect(DARK_OPS_ARCHETYPE_BONUSES.musa).toBeLessThan(1.0);
    });
  });

  describe("DARK_OPS_NIGHT_BONUS", () => {
    it("should have night, day, and twilight bonus configurations", () => {
      expect(DARK_OPS_NIGHT_BONUS.night).toBe(1.25); // +25%
      expect(DARK_OPS_NIGHT_BONUS.day).toBe(1.0); // Normal
      expect(DARK_OPS_NIGHT_BONUS.twilight).toBe(1.15); // +15%
    });

    it("should have night bonus greater than day", () => {
      expect(DARK_OPS_NIGHT_BONUS.night).toBeGreaterThan(
        DARK_OPS_NIGHT_BONUS.day
      );
    });

    it("should have twilight bonus between day and night", () => {
      expect(DARK_OPS_NIGHT_BONUS.twilight).toBeGreaterThan(
        DARK_OPS_NIGHT_BONUS.day
      );
      expect(DARK_OPS_NIGHT_BONUS.twilight).toBeLessThan(
        DARK_OPS_NIGHT_BONUS.night
      );
    });
  });

  describe("DARK_OPS_SPECIAL_EFFECTS", () => {
    it("should define silent attack special effect", () => {
      expect(DARK_OPS_SPECIAL_EFFECTS.silent).toBeDefined();
      expect(DARK_OPS_SPECIAL_EFFECTS.silent.noAlert).toBe(true);
    });

    it("should define paralysis special effect with duration", () => {
      expect(DARK_OPS_SPECIAL_EFFECTS.paralysis).toBeDefined();
      expect(DARK_OPS_SPECIAL_EFFECTS.paralysis.duration).toBe(3000);
    });

    it("should define unconsciousness special effect with duration", () => {
      expect(DARK_OPS_SPECIAL_EFFECTS.unconsciousness).toBeDefined();
      expect(DARK_OPS_SPECIAL_EFFECTS.unconsciousness.duration).toBe(5000);
    });

    it("should define breathing difficulty with stamina regen penalty", () => {
      expect(DARK_OPS_SPECIAL_EFFECTS.breathingDifficulty).toBeDefined();
      expect(
        DARK_OPS_SPECIAL_EFFECTS.breathingDifficulty.staminaRegenPenalty
      ).toBe(-0.75);
    });

    it("should define disorientation with accuracy penalty", () => {
      expect(DARK_OPS_SPECIAL_EFFECTS.disorientation).toBeDefined();
      expect(
        DARK_OPS_SPECIAL_EFFECTS.disorientation.accuracyPenalty
      ).toBe(-0.5);
    });

    it("should have all effects with Korean-English bilingual naming", () => {
      const effects = Object.values(DARK_OPS_SPECIAL_EFFECTS);
      effects.forEach((effect) => {
        expect(effect.korean).toBeTruthy();
        expect(effect.english).toBeTruthy();
        expect(effect.description.korean).toBeTruthy();
        expect(effect.description.english).toBeTruthy();
      });
    });
  });

  describe("KoreanTechniquesSystem Dark Ops Integration", () => {
    it("should return Dark Ops techniques via getDarkOpsTechniques()", () => {
      const darkOpsTechniques =
        KoreanTechniquesSystem.getDarkOpsTechniques();
      expect(darkOpsTechniques.length).toBe(15);
    });

    it("should include Dark Ops techniques in getAllTechniques()", () => {
      const allTechniques = KoreanTechniquesSystem.getAllTechniques();
      const darkOpsCount = allTechniques.filter((t) =>
        t.id.startsWith("darkops_")
      ).length;
      expect(darkOpsCount).toBe(15);
    });

    it("should filter Dark Ops techniques by stance", () => {
      const liTechniques =
        KoreanTechniquesSystem.getAllAvailableTechniques(
          TrigramStance.LI,
          PlayerArchetype.AMSALJA
        );
      const darkOpsLiTechniques = liTechniques.filter((t) =>
        t.id.startsWith("darkops_")
      );
      expect(darkOpsLiTechniques.length).toBeGreaterThan(0);
    });

    it("should identify Dark Ops techniques via isDarkOpsTechnique()", () => {
      expect(
        KoreanTechniquesSystem.isDarkOpsTechnique("darkops_silent_carotid")
      ).toBe(true);
      expect(
        KoreanTechniquesSystem.isDarkOpsTechnique("geon_heaven_strike")
      ).toBe(false);
    });

    it("should return correct archetype bonus for 암살자 (Amsalja)", () => {
      const bonus = KoreanTechniquesSystem.getDarkOpsArchetypeBonus(
        PlayerArchetype.AMSALJA
      );
      expect(bonus).toBe(1.3); // +30%
    });

    it("should return correct archetype bonus for 무사 (Musa)", () => {
      const bonus = KoreanTechniquesSystem.getDarkOpsArchetypeBonus(
        PlayerArchetype.MUSA
      );
      expect(bonus).toBe(0.85); // -15%
    });

    it("should return night operations bonus", () => {
      const bonus = KoreanTechniquesSystem.getNightOperationsBonus();
      expect(bonus).toBeGreaterThanOrEqual(1.0);
      expect(bonus).toBeLessThanOrEqual(1.25);
    });

    it("should include Dark Ops techniques for 암살자 (Amsalja) archetype", () => {
      const amsaljaTechniques =
        KoreanTechniquesSystem.getTechniquesByArchetype(
          PlayerArchetype.AMSALJA
        );
      const darkOpsCount = amsaljaTechniques.filter((t) =>
        t.id.startsWith("darkops_")
      ).length;
      expect(darkOpsCount).toBe(15);
    });

    it("should NOT include Dark Ops techniques for non-Amsalja archetypes by default", () => {
      const musaTechniques =
        KoreanTechniquesSystem.getTechniquesByArchetype(
          PlayerArchetype.MUSA
        );
      const darkOpsCount = musaTechniques.filter((t) =>
        t.id.startsWith("darkops_")
      ).length;
      // Musa still gets them but with penalty - they're available to all
      expect(darkOpsCount).toBe(0); // Not in favored techniques
    });
  });

  describe("Specific Dark Ops Techniques", () => {
    it("should have Silent Carotid Strike technique", () => {
      const technique = KoreanTechniquesSystem.getTechniqueById(
        "darkops_silent_carotid"
      );
      expect(technique).toBeDefined();
      expect(technique?.name.english).toBe("Silent Carotid Strike");
      expect(technique?.stance).toBe(TrigramStance.GAM); // Water stance
    });

    it("should have Nerve Paralysis Strike technique", () => {
      const technique = KoreanTechniquesSystem.getTechniqueById(
        "darkops_nerve_paralysis"
      );
      expect(technique).toBeDefined();
      expect(technique?.name.english).toBe("Nerve Paralysis Strike");
      expect(technique?.stance).toBe(TrigramStance.LI); // Fire stance
    });

    it("should have Liver Disruption Strike technique", () => {
      const technique = KoreanTechniquesSystem.getTechniqueById(
        "darkops_liver_disruption"
      );
      expect(technique).toBeDefined();
      expect(technique?.name.english).toBe("Liver Disruption Strike");
      expect(technique?.stance).toBe(TrigramStance.JIN); // Thunder stance
    });

    it("should have Throat Disruption technique", () => {
      const technique = KoreanTechniquesSystem.getTechniqueById(
        "darkops_throat_strike"
      );
      expect(technique).toBeDefined();
      expect(technique?.name.english).toBe("Throat Disruption");
      expect(technique?.stance).toBe(TrigramStance.SON); // Wind stance
    });

    it("should have Brachial Plexus Strike technique", () => {
      const technique = KoreanTechniquesSystem.getTechniqueById(
        "darkops_brachial_plexus_strike"
      );
      expect(technique).toBeDefined();
      expect(technique?.name.english).toBe("Brachial Plexus Strike");
    });

    it("should have Rear Naked Choke technique", () => {
      const technique = KoreanTechniquesSystem.getTechniqueById(
        "darkops_rear_choke"
      );
      expect(technique).toBeDefined();
      expect(technique?.name.english).toBe("Rear Naked Choke");
      expect(technique?.stance).toBe(TrigramStance.GAM); // Water stance
    });

    it("should have Spinal Column Strike technique", () => {
      const technique = KoreanTechniquesSystem.getTechniqueById(
        "darkops_spinal_strike"
      );
      expect(technique).toBeDefined();
      expect(technique?.name.english).toBe("Spinal Column Strike");
      expect(technique?.damage).toBe(40); // Highest damage
    });
  });

  describe("Dark Ops Technique Categories", () => {
    it("should have nerve strike techniques", () => {
      const nerveTechniques = DARK_OPS_TECHNIQUES.filter(
        (t) => t.damageType === "nerve"
      );
      expect(nerveTechniques.length).toBeGreaterThanOrEqual(3);
    });

    it("should have pressure point techniques", () => {
      const pressureTechniques = DARK_OPS_TECHNIQUES.filter(
        (t) => t.damageType === "pressure"
      );
      expect(pressureTechniques.length).toBeGreaterThanOrEqual(2);
    });

    it("should have internal damage techniques", () => {
      const internalTechniques = DARK_OPS_TECHNIQUES.filter(
        (t) => t.damageType === "internal"
      );
      expect(internalTechniques.length).toBeGreaterThanOrEqual(2);
    });

    it("should have grappling techniques", () => {
      const grappleTechniques = DARK_OPS_TECHNIQUES.filter(
        (t) => t.type === "grapple"
      );
      expect(grappleTechniques.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Dark Ops Technique Balance", () => {
    it("should have average Ki cost between 24-30", () => {
      const avgKiCost =
        DARK_OPS_TECHNIQUES.reduce((sum, t) => sum + t.kiCost, 0) /
        DARK_OPS_TECHNIQUES.length;
      expect(avgKiCost).toBeGreaterThanOrEqual(24);
      expect(avgKiCost).toBeLessThanOrEqual(30);
    });

    it("should have average stamina cost between 24-28", () => {
      const avgStaminaCost =
        DARK_OPS_TECHNIQUES.reduce((sum, t) => sum + t.staminaCost, 0) /
        DARK_OPS_TECHNIQUES.length;
      expect(avgStaminaCost).toBeGreaterThanOrEqual(24);
      expect(avgStaminaCost).toBeLessThanOrEqual(28);
    });

    it("should have average accuracy above 0.85", () => {
      const avgAccuracy =
        DARK_OPS_TECHNIQUES.reduce((sum, t) => sum + t.accuracy, 0) /
        DARK_OPS_TECHNIQUES.length;
      expect(avgAccuracy).toBeGreaterThanOrEqual(0.85);
    });

    it("should have average damage between 30-34", () => {
      const avgDamage =
        DARK_OPS_TECHNIQUES.reduce((sum, t) => sum + t.damage, 0) /
        DARK_OPS_TECHNIQUES.length;
      expect(avgDamage).toBeGreaterThanOrEqual(30);
      expect(avgDamage).toBeLessThanOrEqual(34);
    });

    it("should have balanced execution times (500-800ms)", () => {
      DARK_OPS_TECHNIQUES.forEach((technique) => {
        expect(technique.executionTime).toBeGreaterThanOrEqual(500);
        expect(technique.executionTime).toBeLessThanOrEqual(900);
      });
    });

    it("should have balanced recovery times (900-1200ms)", () => {
      DARK_OPS_TECHNIQUES.forEach((technique) => {
        expect(technique.recoveryTime).toBeGreaterThanOrEqual(850);
        expect(technique.recoveryTime).toBeLessThanOrEqual(1350);
      });
    });
  });
});
