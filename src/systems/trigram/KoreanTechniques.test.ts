import { describe, it, expect } from "vitest";
import {
  KOREAN_TECHNIQUES_DATABASE,
  getTechniquesForStance,
  findTechniqueByName,
  getComboTechniques,
  getCounterTechniques,
  canExecuteTechnique,
  calculateTechniqueEffectiveness,
  generateLearningPath,
  getAllKoreanTechniques,
} from "./KoreanTechniques";
import type { TrigramStance } from "../../types";

describe("KoreanTechniques", () => {
  describe("KOREAN_TECHNIQUES_DATABASE", () => {
    it("should contain techniques for all trigram stances", () => {
      const expectedStances: TrigramStance[] = [
        "geon",
        "tae",
        "li",
        "jin",
        "son",
        "gam",
        "gan",
        "gon",
      ];

      expectedStances.forEach((stance) => {
        expect(KOREAN_TECHNIQUES_DATABASE[stance]).toBeDefined();
        expect(Array.isArray(KOREAN_TECHNIQUES_DATABASE[stance])).toBe(true);
        expect(KOREAN_TECHNIQUES_DATABASE[stance].length).toBeGreaterThan(0);
      });
    });

    it("should have valid Korean technique properties", () => {
      Object.values(KOREAN_TECHNIQUES_DATABASE).forEach((techniques) => {
        techniques.forEach((technique) => {
          expect(technique.name).toBeDefined();
          expect(technique.koreanName).toBeDefined();
          expect(technique.englishName).toBeDefined();
          expect(technique.description.korean).toBeDefined();
          expect(technique.description.english).toBeDefined();
          expect(technique.kiCost).toBeGreaterThan(0);
          expect(technique.staminaCost).toBeGreaterThan(0);
          expect(technique.range).toBeGreaterThan(0);
          expect(technique.accuracy).toBeGreaterThanOrEqual(0);
          expect(technique.accuracy).toBeLessThanOrEqual(1);
          expect(technique.damage).toBeGreaterThan(0);
          expect(technique.stance).toBeDefined();
          expect(technique.type).toBeDefined();
        });
      });
    });

    it("should have authentic Korean martial arts techniques", () => {
      const heavenTechniques = KOREAN_TECHNIQUES_DATABASE["geon"];
      const thunderStrike = heavenTechniques.find(
        (t) => t.koreanName === "천둥벽력"
      );

      expect(thunderStrike).toBeDefined();
      expect(thunderStrike?.englishName).toBe("Heavenly Thunder Strike");
      expect(thunderStrike?.culturalContext.origin).toBe("전통 택견");
      expect(thunderStrike?.stance).toBe("geon");
    });
  });

  describe("getTechniquesForStance", () => {
    it("should return techniques for valid stances", () => {
      const geonTechniques = getTechniquesForStance("geon");
      expect(geonTechniques.length).toBeGreaterThan(0);

      geonTechniques.forEach((technique) => {
        expect(technique.stance).toBe("geon");
      });
    });

    it("should return empty array for invalid stance", () => {
      const invalidTechniques = getTechniquesForStance(
        "invalid" as TrigramStance
      );
      expect(invalidTechniques).toEqual([]);
    });

    it("should include Heaven trigram signature techniques", () => {
      const geonTechniques = getTechniquesForStance("geon");
      const techniqueNames = geonTechniques.map((t) => t.koreanName);

      expect(techniqueNames).toContain("천둥벽력"); // Heavenly Thunder Strike
      expect(techniqueNames).toContain("하늘찌르기"); // Sky Piercing Thrust
      expect(techniqueNames).toContain("천지개벽"); // Heaven and Earth Opening
    });
  });

  describe("findTechniqueByName", () => {
    it("should find technique by Korean name", () => {
      const technique = findTechniqueByName("천둥벽력");
      expect(technique).toBeDefined();
      expect(technique?.koreanName).toBe("천둥벽력");
      expect(technique?.englishName).toBe("Heavenly Thunder Strike");
    });

    it("should find technique by English name", () => {
      const technique = findTechniqueByName("Flame Spear Thrust");
      expect(technique).toBeDefined();
      expect(technique?.koreanName).toBe("화염지창");
      expect(technique?.stance).toBe("li");
    });

    it("should return null for non-existent technique", () => {
      const technique = findTechniqueByName("Non-existent Technique");
      expect(technique).toBeNull();
    });
  });

  describe("getComboTechniques", () => {
    it("should return combo techniques for valid technique", () => {
      const comboTechniques = getComboTechniques("천둥벽력");
      expect(Array.isArray(comboTechniques)).toBe(true);

      if (comboTechniques.length > 0) {
        comboTechniques.forEach((technique) => {
          expect(technique.name).toBeDefined();
          expect(technique.koreanName).toBeDefined();
        });
      }
    });

    it("should return empty array for technique with no combos", () => {
      const comboTechniques = getComboTechniques("천지개벽"); // Final technique
      expect(comboTechniques).toEqual([]);
    });

    it("should return empty array for non-existent technique", () => {
      const comboTechniques = getComboTechniques("Non-existent");
      expect(comboTechniques).toEqual([]);
    });
  });

  describe("getCounterTechniques", () => {
    it("should return counter techniques for valid technique", () => {
      const counterTechniques = getCounterTechniques("천둥벽력");
      expect(Array.isArray(counterTechniques)).toBe(true);

      if (counterTechniques.length > 0) {
        counterTechniques.forEach((technique) => {
          expect(technique.name).toBeDefined();
          expect(technique.koreanName).toBeDefined();
        });
      }
    });

    it("should demonstrate martial arts rock-paper-scissors mechanics", () => {
      // Water counters Thunder in Korean martial arts philosophy
      const thunderCounters = getCounterTechniques("벽력일섬");
      const hasWaterCounter = thunderCounters.some((t) => t.stance === "gam");

      if (thunderCounters.length > 0) {
        expect(hasWaterCounter).toBe(true);
      }
    });
  });

  describe("canExecuteTechnique", () => {
    it("should allow execution with sufficient resources", () => {
      const technique = findTechniqueByName("천둥벽력");
      expect(technique).toBeDefined();

      if (technique) {
        const result = canExecuteTechnique(technique, 20, 15, "geon");
        expect(result.canExecute).toBe(true);
        expect(result.reason).toBeUndefined();
      }
    });

    it("should prevent execution with insufficient ki", () => {
      const technique = findTechniqueByName("천둥벽력");
      expect(technique).toBeDefined();

      if (technique) {
        const result = canExecuteTechnique(technique, 10, 15, "geon");
        expect(result.canExecute).toBe(false);
        expect(result.reason).toContain("기 부족");
      }
    });

    it("should prevent execution with insufficient stamina", () => {
      const technique = findTechniqueByName("천둥벽력");
      expect(technique).toBeDefined();

      if (technique) {
        const result = canExecuteTechnique(technique, 20, 5, "geon");
        expect(result.canExecute).toBe(false);
        expect(result.reason).toContain("체력 부족");
      }
    });

    it("should prevent execution with wrong stance", () => {
      const technique = findTechniqueByName("천둥벽력");
      expect(technique).toBeDefined();

      if (technique) {
        const result = canExecuteTechnique(technique, 20, 15, "tae");
        expect(result.canExecute).toBe(false);
        expect(result.reason).toContain("잘못된 자세");
      }
    });
  });

  describe("calculateTechniqueEffectiveness", () => {
    it("should calculate optimal effectiveness at close range", () => {
      const technique = findTechniqueByName("천둥벽력");
      expect(technique).toBeDefined();

      if (technique) {
        const effectiveness = calculateTechniqueEffectiveness(technique, 30, 0);
        expect(effectiveness).toBeGreaterThan(0.8);
        expect(effectiveness).toBeLessThanOrEqual(1.2);
      }
    });

    it("should reduce effectiveness at maximum range", () => {
      const technique = findTechniqueByName("천둥벽력");
      expect(technique).toBeDefined();

      if (technique) {
        const closeEffectiveness = calculateTechniqueEffectiveness(
          technique,
          30,
          0
        );
        const farEffectiveness = calculateTechniqueEffectiveness(
          technique,
          technique.range,
          0
        );

        expect(farEffectiveness).toBeLessThan(closeEffectiveness);
      }
    });

    it("should provide timing bonus for frame-perfect execution", () => {
      const technique = findTechniqueByName("천둥벽력");
      expect(technique).toBeDefined();

      if (technique) {
        const normalEffectiveness = calculateTechniqueEffectiveness(
          technique,
          30,
          0
        );
        const perfectEffectiveness = calculateTechniqueEffectiveness(
          technique,
          30,
          technique.timingProperties.cancelWindows[0] || 8
        );

        expect(perfectEffectiveness).toBeGreaterThanOrEqual(
          normalEffectiveness
        );
      }
    });
  });

  describe("generateLearningPath", () => {
    it("should recommend basic techniques for beginners", () => {
      const learningPath = generateLearningPath("geon", 1);

      expect(learningPath.recommended.length).toBeGreaterThan(0);
      expect(learningPath.description).toContain("기본 기술");

      learningPath.recommended.forEach((technique) => {
        expect(technique.prerequisites.minKi).toBeLessThanOrEqual(15);
      });
    });

    it("should recommend intermediate techniques for mid-level players", () => {
      const learningPath = generateLearningPath("li", 5);

      expect(learningPath.recommended.length).toBeGreaterThan(0);
      expect(learningPath.description).toContain("중급 기술");

      learningPath.recommended.forEach((technique) => {
        expect(technique.prerequisites.minKi).toBeGreaterThan(15);
        expect(technique.prerequisites.minKi).toBeLessThanOrEqual(20);
      });
    });

    it("should recommend advanced techniques for high-level players", () => {
      const learningPath = generateLearningPath("jin", 10);

      expect(learningPath.recommended.length).toBeGreaterThan(0);
      expect(learningPath.description).toContain("고급 기술");

      learningPath.recommended.forEach((technique) => {
        expect(technique.prerequisites.minKi).toBeGreaterThan(20);
      });
    });
  });

  describe("getAllKoreanTechniques", () => {
    it("should return all techniques from all stances", () => {
      const allTechniques = getAllKoreanTechniques();

      expect(allTechniques.length).toBeGreaterThan(0);

      // Should include techniques from all 8 stances
      const stances = new Set(allTechniques.map((t) => t.stance));
      expect(stances.size).toBe(8);

      // Should include signature techniques
      const techniqueNames = allTechniques.map((t) => t.koreanName);
      expect(techniqueNames).toContain("천둥벽력"); // Heaven
      expect(techniqueNames).toContain("화염지창"); // Fire
      expect(techniqueNames).toContain("벽력일섬"); // Thunder
      expect(techniqueNames).toContain("수류반격"); // Water
    });

    it("should maintain cultural authenticity", () => {
      const allTechniques = getAllKoreanTechniques();

      allTechniques.forEach((technique) => {
        expect(technique.culturalContext).toBeDefined();
        expect(technique.culturalContext.origin).toBeDefined();
        expect(technique.culturalContext.philosophy).toBeDefined();
        expect(technique.culturalContext.traditionalUse).toBeDefined();

        // Should have proper Korean naming
        expect(technique.koreanName).toMatch(/^[가-힣]+$/);
      });
    });

    it("should have balanced technique distribution", () => {
      const allTechniques = getAllKoreanTechniques();
      const techniquesByStance = allTechniques.reduce((acc, technique) => {
        acc[technique.stance] = (acc[technique.stance] || 0) + 1;
        return acc;
      }, {} as Record<TrigramStance, number>);

      // Each stance should have at least 2 techniques
      Object.values(techniquesByStance).forEach((count) => {
        expect(count).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("Cultural Authenticity", () => {
    it("should maintain proper Korean martial arts terminology", () => {
      const fireTechniques = getTechniquesForStance("li");
      const flameSpear = fireTechniques.find(
        (t) => t.koreanName === "화염지창"
      );

      expect(flameSpear).toBeDefined();
      expect(flameSpear?.culturalContext.origin).toBe("한국 전통 무술");
      expect(flameSpear?.culturalContext.philosophy).toBe(
        "명료함과 정확성의 추구"
      );
    });

    it("should reflect trigram philosophy in techniques", () => {
      const waterTechniques = getTechniquesForStance("gam");
      const waterCounter = waterTechniques.find(
        (t) => t.koreanName === "수류반격"
      );

      expect(waterCounter).toBeDefined();
      expect(waterCounter?.culturalContext.philosophy).toContain(
        "적의 힘을 이용"
      );
      expect(waterCounter?.type).toBe("grapple"); // Water flows and redirects
    });

    it("should have appropriate timing properties for Korean martial arts", () => {
      const thunderTechniques = getTechniquesForStance("jin");
      const lightningFlash = thunderTechniques.find(
        (t) => t.koreanName === "벽력일섬"
      );

      expect(lightningFlash).toBeDefined();
      expect(
        lightningFlash?.timingProperties.startupFrames
      ).toBeLessThanOrEqual(10); // Fast like lightning
      expect(lightningFlash?.timingProperties.activeFrames).toBeLessThanOrEqual(
        5
      ); // Brief impact
    });
  });

  describe("Combat Integration", () => {
    it("should support realistic combo chains", () => {
      const heavenTechniques = getTechniquesForStance("geon");
      const thunderStrike = heavenTechniques.find(
        (t) => t.koreanName === "천둥벽력"
      );

      expect(thunderStrike).toBeDefined();
      expect(thunderStrike?.comboChains.length).toBeGreaterThan(0);

      // Should be able to combo into other Heaven techniques
      const combos = getComboTechniques("천둥벽력");
      if (combos.length > 0) {
        combos.forEach((combo) => {
          expect(combo.stance).toBe("geon");
        });
      }
    });

    it("should implement elemental counter relationships", () => {
      // Fire techniques should be countered by Water techniques
      const fireTechnique = findTechniqueByName("화염지창");
      expect(fireTechnique).toBeDefined();

      if (fireTechnique) {
        const counters = getCounterTechniques("화염지창");
        const hasWaterCounter = counters.some((t) => t.stance === "gam");

        if (counters.length > 0) {
          expect(hasWaterCounter).toBe(true);
        }
      }
    });
  });
});
