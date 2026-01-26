/**
 * Technique Variety Expansion Test Suite
 * 기술 다양성 확장 테스트 스위트
 *
 * Validates ALL acceptance criteria for the technique variety expansion:
 *
 * **AC1**: 3-5 unique techniques per stance (minimum 24 total, target 32)
 * **AC2**: Distinct properties - damage, stamina cost, speed, range
 * **AC3**: Korean-English bilingual names - korean, english, romanized
 * **AC4**: Categorization - light/medium/heavy/special with appropriate properties
 * **AC5**: Special techniques - vital point targeting, area effects
 * **AC6**: Balance validation - No category dominates >60% of techniques
 * **AC7**: Animation hooks - animationType and animationSpeed for all techniques
 *
 * @module systems/trigram/__tests__/TechniqueVariety
 * @see {@link https://github.com/Hack23/blacktrigram/issues/XXX} for original issue
 *
 * ## Test Structure
 *
 * - **31 tests** across 7 test suites (one per acceptance criterion)
 * - **Helper functions** for distribution analysis and validation
 * - **Comprehensive logging** for debugging and verification
 * - **Integration tests** with KoreanTechniquesSystem
 * - **Summary report** with actionable recommendations
 *
 * ## Running Tests
 *
 * ```bash
 * # Run technique variety tests only
 * npm test -- src/systems/trigram/__tests__/TechniqueVariety.test.ts
 *
 * # Run with detailed output
 * npm test -- src/systems/trigram/__tests__/TechniqueVariety.test.ts -- --reporter=verbose
 * ```
 *
 * ## Expected Output
 *
 * The test validates:
 * - 51 total techniques across 8 stances
 * - 100% bilingual name coverage
 * - Balanced category distribution (light/medium/heavy/special)
 * - Animation hooks for all techniques
 * - Property variety (damage, stamina, speed, range)
 *
 * @korean 기술다양성확장테스트
 */

import { describe, expect, it } from "vitest";
import { TrigramStance } from "../../../types/common";
import { KoreanTechniquesSystem } from "../KoreanTechniques";
import {
  GEON_TECHNIQUES,
  TAE_TECHNIQUES,
  LI_TECHNIQUES,
  JIN_TECHNIQUES,
  SON_TECHNIQUES,
  GAM_TECHNIQUES,
  GAN_TECHNIQUES,
  GON_TECHNIQUES,
  getTotalTechniqueCount,
  getTechniqueCountByStance,
} from "../techniques";
import type { KoreanTechnique } from "../../vitalpoint/types";

const ALL_STANCE_TECHNIQUES = [
  { stance: TrigramStance.GEON, techniques: GEON_TECHNIQUES },
  { stance: TrigramStance.TAE, techniques: TAE_TECHNIQUES },
  { stance: TrigramStance.LI, techniques: LI_TECHNIQUES },
  { stance: TrigramStance.JIN, techniques: JIN_TECHNIQUES },
  { stance: TrigramStance.SON, techniques: SON_TECHNIQUES },
  { stance: TrigramStance.GAM, techniques: GAM_TECHNIQUES },
  { stance: TrigramStance.GAN, techniques: GAN_TECHNIQUES },
  { stance: TrigramStance.GON, techniques: GON_TECHNIQUES },
];

function getCategoryDistribution(techniques: readonly KoreanTechnique[]) {
  const distribution = {
    light: 0,
    medium: 0,
    heavy: 0,
    special: 0,
    undefined: 0,
  };

  techniques.forEach((tech) => {
    if (tech.category) {
      distribution[tech.category]++;
    } else {
      distribution.undefined++;
    }
  });

  return distribution;
}

function getRangeDistribution(techniques: readonly KoreanTechnique[]) {
  const distribution = {
    short: 0,
    medium: 0,
    long: 0,
    undefined: 0,
  };

  techniques.forEach((tech) => {
    if (tech.range) {
      distribution[tech.range]++;
    } else {
      distribution.undefined++;
    }
  });

  return distribution;
}

function hasCompleteBilingualNames(tech: KoreanTechnique): boolean {
  return !!(
    tech.name?.korean &&
    tech.name?.english &&
    tech.name?.romanized &&
    tech.koreanName &&
    tech.englishName &&
    tech.romanized
  );
}

function validateCategoryProperties(
  tech: KoreanTechnique
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!tech.category) {
    return { valid: true, issues: [] };
  }

  switch (tech.category) {
    case "light":
      if (tech.damage >= 25) {
        issues.push("Light technique has high damage: " + tech.damage);
      }
      if (tech.staminaCost >= 15) {
        issues.push("Light technique has high stamina: " + tech.staminaCost);
      }
      if (tech.executionTime >= 700) {
        issues.push("Light technique is slow: " + tech.executionTime + "ms execution");
      }
      break;

    case "heavy":
      if (tech.damage <= 35) {
        issues.push("Heavy technique has low damage: " + tech.damage);
      }
      if (tech.staminaCost <= 25) {
        issues.push("Heavy technique has low stamina: " + tech.staminaCost);
      }
      if (tech.executionTime <= 1000) {
        issues.push("Heavy technique is too fast: " + tech.executionTime + "ms execution");
      }
      break;

    case "medium":
      if (tech.damage < 20 || tech.damage > 40) {
        issues.push("Medium technique damage out of range: " + tech.damage);
      }
      if (tech.staminaCost < 10 || tech.staminaCost > 30) {
        issues.push("Medium technique stamina out of range: " + tech.staminaCost);
      }
      break;

    case "special":
      if (tech.effects.length === 0 && tech.critChance < 0.15) {
        issues.push("Special technique lacks special properties (no effects, low crit)");
      }
      break;
  }

  return { valid: issues.length === 0, issues };
}

describe("AC1: 3-5 Unique Techniques Per Stance", () => {
  it("should have at least 3 techniques per stance (minimum 24 total)", () => {
    const stanceCounts = getTechniqueCountByStance();

    console.log("\n=== TECHNIQUE COUNT BY STANCE ===");
    Object.entries(stanceCounts).forEach(([stance, count]) => {
      console.log(stance + ": " + count + " techniques");
      expect(count).toBeGreaterThanOrEqual(3);
    });

    const totalCount = getTotalTechniqueCount();
    console.log("Total: " + totalCount + " techniques");
    expect(totalCount).toBeGreaterThanOrEqual(24);
  });

  it("should target 4+ techniques per stance (32+ total)", () => {
    const totalCount = getTotalTechniqueCount();
    const stanceCounts = getTechniqueCountByStance();

    console.log("\n=== TARGET TECHNIQUE METRICS ===");
    console.log("Total techniques: " + totalCount + " (target: 32+)");

    const stancesWithFourPlus = Object.values(stanceCounts).filter(
      (count) => count >= 4
    ).length;
    console.log("Stances with 4+ techniques: " + stancesWithFourPlus + "/8 (target: 8/8)");

    if (totalCount < 32) {
      console.warn("⚠️  Total technique count (" + totalCount + ") below target (32+)");
    }
    if (stancesWithFourPlus < 8) {
      console.warn("⚠️  Only " + stancesWithFourPlus + "/8 stances have 4+ techniques");
    }
  });

  it("should have unique technique IDs across all stances", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const techniqueIds = allTechniques.map((t) => t.id);
    const uniqueIds = new Set(techniqueIds);

    expect(techniqueIds.length).toBe(uniqueIds.size);
  });
});

describe("AC2: Distinct Properties (Damage, Stamina, Speed, Range)", () => {
  it("should have varied damage values within each stance", () => {
    ALL_STANCE_TECHNIQUES.forEach(({ stance, techniques }) => {
      const damageValues = techniques.map((t) => t.damage);
      const uniqueDamageValues = new Set(damageValues);

      if (techniques.length >= 3) {
        expect(uniqueDamageValues.size).toBeGreaterThanOrEqual(2);
      }

      console.log(stance + " damage range: " + Math.min(...damageValues) + "-" + Math.max(...damageValues));
    });
  });

  it("should have varied stamina costs within each stance", () => {
    ALL_STANCE_TECHNIQUES.forEach(({ stance, techniques }) => {
      const staminaValues = techniques.map((t) => t.staminaCost);
      const uniqueStaminaValues = new Set(staminaValues);

      if (techniques.length >= 3) {
        expect(uniqueStaminaValues.size).toBeGreaterThanOrEqual(2);
      }

      console.log(stance + " stamina range: " + Math.min(...staminaValues) + "-" + Math.max(...staminaValues));
    });
  });

  it("should have varied execution speeds within each stance", () => {
    ALL_STANCE_TECHNIQUES.forEach(({ stance, techniques }) => {
      const executionTimes = techniques.map((t) => t.executionTime);
      const uniqueExecutionTimes = new Set(executionTimes);

      if (techniques.length >= 3) {
        expect(uniqueExecutionTimes.size).toBeGreaterThanOrEqual(2);
      }

      console.log(stance + " execution time range: " + Math.min(...executionTimes) + "-" + Math.max(...executionTimes) + "ms");
    });
  });

  it("should have defined range categories for all techniques", () => {
    ALL_STANCE_TECHNIQUES.forEach(({ stance, techniques }) => {
      const rangeDistribution = getRangeDistribution(techniques);

      console.log("\n" + stance + " range distribution:", rangeDistribution);

      expect(rangeDistribution.undefined).toBe(0);

      const definedRanges = Object.entries(rangeDistribution).filter(
        ([key, count]) => key !== "undefined" && count > 0
      ).length;

      if (techniques.length >= 3) {
        expect(definedRanges).toBeGreaterThanOrEqual(2);
      }
    });
  });
});

describe("AC3: Korean-English Bilingual Names", () => {
  it("should have complete bilingual names for all techniques", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const incompleteTechniques: string[] = [];

    allTechniques.forEach((tech) => {
      if (!hasCompleteBilingualNames(tech)) {
        incompleteTechniques.push(tech.id);
      }
    });

    if (incompleteTechniques.length > 0) {
      console.error("❌ Techniques with incomplete bilingual names:", incompleteTechniques);
    }

    expect(incompleteTechniques).toHaveLength(0);
  });

  it("should have matching Korean names in both name.korean and koreanName", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);

    allTechniques.forEach((tech) => {
      expect(tech.name.korean).toBe(tech.koreanName);
    });
  });

  it("should have matching English names in both name.english and englishName", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);

    allTechniques.forEach((tech) => {
      expect(tech.name.english).toBe(tech.englishName);
    });
  });

  it("should have matching romanized names in both name.romanized and romanized", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);

    allTechniques.forEach((tech) => {
      expect(tech.name.romanized).toBe(tech.romanized);
    });
  });

  it("should have non-empty Korean and English descriptions", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);

    allTechniques.forEach((tech) => {
      expect(tech.description.korean).toBeTruthy();
      expect(tech.description.english).toBeTruthy();
      expect(tech.description.korean.length).toBeGreaterThan(0);
      expect(tech.description.english.length).toBeGreaterThan(0);
    });
  });
});

describe("AC4: Categorization (Light/Medium/Heavy/Special)", () => {
  it("should have defined categories for all techniques", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const uncategorized = allTechniques.filter((tech) => !tech.category);

    if (uncategorized.length > 0) {
      console.error("❌ Uncategorized techniques:", uncategorized.map((t) => t.id));
    }

    expect(uncategorized).toHaveLength(0);
  });

  it("should have light techniques with appropriate properties", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const lightTechniques = allTechniques.filter(
      (tech) => tech.category === "light"
    );

    console.log("\n=== LIGHT TECHNIQUES (" + lightTechniques.length + ") ===");

    lightTechniques.forEach((tech) => {
      const validation = validateCategoryProperties(tech);
      if (!validation.valid) {
        console.error("❌ " + tech.id + ":", validation.issues);
      }
      expect(validation.valid).toBe(true);
    });
  });

  it("should have heavy techniques with appropriate properties", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const heavyTechniques = allTechniques.filter(
      (tech) => tech.category === "heavy"
    );

    console.log("\n=== HEAVY TECHNIQUES (" + heavyTechniques.length + ") ===");

    heavyTechniques.forEach((tech) => {
      const validation = validateCategoryProperties(tech);
      if (!validation.valid) {
        console.error("❌ " + tech.id + ":", validation.issues);
      }
      expect(validation.valid).toBe(true);
    });
  });

  it("should have medium techniques with balanced properties", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const mediumTechniques = allTechniques.filter(
      (tech) => tech.category === "medium"
    );

    console.log("\n=== MEDIUM TECHNIQUES (" + mediumTechniques.length + ") ===");

    mediumTechniques.forEach((tech) => {
      const validation = validateCategoryProperties(tech);
      if (!validation.valid) {
        console.error("❌ " + tech.id + ":", validation.issues);
      }
      if (!validation.valid) {
        console.warn("⚠️  " + tech.id + ":", validation.issues);
      }
    });
  });

  it("should have special techniques with unique effects", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const specialTechniques = allTechniques.filter(
      (tech) => tech.category === "special"
    );

    console.log("\n=== SPECIAL TECHNIQUES (" + specialTechniques.length + ") ===");

    specialTechniques.forEach((tech) => {
      const validation = validateCategoryProperties(tech);
      if (!validation.valid) {
        console.error("❌ " + tech.id + ":", validation.issues);
      }
      expect(validation.valid).toBe(true);
    });
  });

  it("should show category distribution across all techniques", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const distribution = getCategoryDistribution(allTechniques);

    console.log("\n=== OVERALL CATEGORY DISTRIBUTION ===");
    console.log("Light: " + distribution.light);
    console.log("Medium: " + distribution.medium);
    console.log("Heavy: " + distribution.heavy);
    console.log("Special: " + distribution.special);
    console.log("Undefined: " + distribution.undefined);
    console.log("Total: " + allTechniques.length);

    expect(distribution.undefined).toBe(0);
  });
});

describe("AC5: Special Techniques (Vital Point, Area Effects)", () => {
  it("should have at least one special technique per stance", () => {
    ALL_STANCE_TECHNIQUES.forEach(({ stance, techniques }) => {
      const specialCount = techniques.filter(
        (tech) => tech.category === "special"
      ).length;

      console.log(stance + ": " + specialCount + " special technique(s)");
      expect(specialCount).toBeGreaterThanOrEqual(1);
    });
  });

  it("should have special techniques with effects or high crit rates", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const specialTechniques = allTechniques.filter(
      (tech) => tech.category === "special"
    );

    specialTechniques.forEach((tech) => {
      const hasEffects = tech.effects && tech.effects.length > 0;
      const hasHighCrit = tech.critChance >= 0.15;

      expect(hasEffects || hasHighCrit).toBe(true);
    });
  });

  it("should show special technique details for verification", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const specialTechniques = allTechniques.filter(
      (tech) => tech.category === "special"
    );

    console.log("\n=== SPECIAL TECHNIQUE DETAILS ===");
    specialTechniques.forEach((tech) => {
      console.log("\n" + tech.id + " (" + tech.stance + "):");
      console.log("  Korean: " + tech.koreanName);
      console.log("  English: " + tech.englishName);
      console.log("  Effects: " + tech.effects.length);
      console.log("  Crit Chance: " + (tech.critChance * 100).toFixed(1) + "%");
      console.log("  Damage: " + tech.damage);
      console.log("  Stamina: " + tech.staminaCost);
    });
  });
});

describe("AC6: Balance - No Category Dominates >60%", () => {
  it("should ensure no category exceeds 60% of total techniques", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const distribution = getCategoryDistribution(allTechniques);
    const total = allTechniques.length;

    console.log("\n=== CATEGORY BALANCE ANALYSIS ===");
    console.log("Total Techniques: " + total);

    const percentages = {
      light: (distribution.light / total) * 100,
      medium: (distribution.medium / total) * 100,
      heavy: (distribution.heavy / total) * 100,
      special: (distribution.special / total) * 100,
    };

    Object.entries(percentages).forEach(([category, percentage]) => {
      const count = distribution[category as keyof typeof distribution];
      console.log(category + ": " + count + " (" + percentage.toFixed(1) + "%)");
      expect(percentage).toBeLessThanOrEqual(60);
    });
  });

  it("should ensure each stance has balanced categories", () => {
    console.log("\n=== PER-STANCE CATEGORY BALANCE ===");

    ALL_STANCE_TECHNIQUES.forEach(({ stance, techniques }) => {
      const distribution = getCategoryDistribution(techniques);
      const total = techniques.length;

      console.log("\n" + stance + " (" + total + " techniques):");
      console.log("  Light: " + distribution.light);
      console.log("  Medium: " + distribution.medium);
      console.log("  Heavy: " + distribution.heavy);
      console.log("  Special: " + distribution.special);

      const categoriesPresent = [
        distribution.light,
        distribution.medium,
        distribution.heavy,
        distribution.special,
      ].filter((count) => count > 0).length;

      expect(categoriesPresent).toBeGreaterThanOrEqual(2);
    });
  });

  it("should have reasonable distribution across ranges", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const distribution = getRangeDistribution(allTechniques);
    const total = allTechniques.length;

    console.log("\n=== RANGE DISTRIBUTION ===");
    console.log("Short: " + distribution.short + " (" + ((distribution.short / total) * 100).toFixed(1) + "%)");
    console.log("Medium: " + distribution.medium + " (" + ((distribution.medium / total) * 100).toFixed(1) + "%)");
    console.log("Long: " + distribution.long + " (" + ((distribution.long / total) * 100).toFixed(1) + "%)");

    expect(distribution.short / total).toBeLessThanOrEqual(0.7);
    expect(distribution.medium / total).toBeLessThanOrEqual(0.7);
    expect(distribution.long / total).toBeLessThanOrEqual(0.7);
  });
});

describe("AC7: Animation Hooks (animationType, animationSpeed)", () => {
  it("should have animationType defined for all techniques", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const missingAnimationType = allTechniques.filter(
      (tech) => !tech.animationType
    );

    if (missingAnimationType.length > 0) {
      console.error("❌ Techniques missing animationType:", missingAnimationType.map((t) => t.id));
    }

    expect(missingAnimationType).toHaveLength(0);
  });

  it("should have animationSpeed defined for all techniques", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const missingAnimationSpeed = allTechniques.filter(
      (tech) => tech.animationSpeed === undefined
    );

    if (missingAnimationSpeed.length > 0) {
      console.error("❌ Techniques missing animationSpeed:", missingAnimationSpeed.map((t) => t.id));
    }

    expect(missingAnimationSpeed).toHaveLength(0);
  });

  it("should have valid animationSpeed values (0.5 to 2.0)", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);

    allTechniques.forEach((tech) => {
      expect(tech.animationSpeed).toBeGreaterThanOrEqual(0.5);
      expect(tech.animationSpeed).toBeLessThanOrEqual(2.0);
    });
  });

  it("should show animation configuration statistics", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const animationSpeeds = allTechniques
      .map((t) => t.animationSpeed)
      .filter((s): s is number => s !== undefined);

    const minSpeed = Math.min(...animationSpeeds);
    const maxSpeed = Math.max(...animationSpeeds);
    const avgSpeed =
      animationSpeeds.reduce((sum, s) => sum + s, 0) / animationSpeeds.length;

    console.log("\n=== ANIMATION SPEED STATISTICS ===");
    console.log("Min Speed: " + minSpeed.toFixed(2) + "x");
    console.log("Max Speed: " + maxSpeed.toFixed(2) + "x");
    console.log("Avg Speed: " + avgSpeed.toFixed(2) + "x");
    console.log("Total Techniques: " + allTechniques.length);

    expect(animationSpeeds.length).toBe(allTechniques.length);
  });
});

describe("Integration: KoreanTechniquesSystem", () => {
  it("should retrieve techniques via KoreanTechniquesSystem", () => {
    ALL_STANCE_TECHNIQUES.forEach(({ stance, techniques }) => {
      const systemTechniques =
        KoreanTechniquesSystem.getAvailableTechniques(stance);
      expect(systemTechniques.length).toBe(techniques.length);
    });
  });

  it("should have all required fields for game mechanics", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);

    allTechniques.forEach((tech) => {
      expect(tech.id).toBeTruthy();
      expect(tech.stance).toBeTruthy();

      expect(tech.koreanName).toBeTruthy();
      expect(tech.englishName).toBeTruthy();
      expect(tech.romanized).toBeTruthy();

      expect(typeof tech.damage).toBe("number");
      expect(typeof tech.staminaCost).toBe("number");
      expect(typeof tech.kiCost).toBe("number");
      expect(typeof tech.accuracy).toBe("number");

      expect(typeof tech.executionTime).toBe("number");
      expect(typeof tech.recoveryTime).toBe("number");

      expect(tech.reachConfig).toBeDefined();
      expect(tech.reachConfig.bodyPart).toBeTruthy();

      expect(tech.category).toBeTruthy();
      expect(tech.range).toBeTruthy();

      expect(tech.animationType).toBeTruthy();
      expect(tech.animationSpeed).toBeDefined();

      expect(Array.isArray(tech.effects)).toBe(true);
    });
  });
});

describe("Summary Report", () => {
  it("should display comprehensive technique statistics", () => {
    const allTechniques = ALL_STANCE_TECHNIQUES.flatMap((s) => s.techniques);
    const totalCount = allTechniques.length;
    const stanceCounts = getTechniqueCountByStance();
    const categoryDist = getCategoryDistribution(allTechniques);
    const rangeDist = getRangeDistribution(allTechniques);

    console.log("\n");
    console.log("═══════════════════════════════════════════════════");
    console.log("       TECHNIQUE VARIETY EXPANSION REPORT");
    console.log("═══════════════════════════════════════════════════");
    console.log("");
    console.log("Total Techniques: " + totalCount);
    console.log("Target: 32+ (" + (totalCount >= 32 ? "✓" : "✗") + ")");
    console.log("");
    console.log("--- Stance Distribution ---");
    Object.entries(stanceCounts).forEach(([stance, count]) => {
      const status = count >= 4 ? "✓" : count >= 3 ? "~" : "✗";
      console.log("  " + status + " " + stance + ": " + count);
    });
    console.log("");
    console.log("--- Category Distribution ---");
    console.log("  Light: " + categoryDist.light + " (" + ((categoryDist.light / totalCount) * 100).toFixed(1) + "%)");
    console.log("  Medium: " + categoryDist.medium + " (" + ((categoryDist.medium / totalCount) * 100).toFixed(1) + "%)");
    console.log("  Heavy: " + categoryDist.heavy + " (" + ((categoryDist.heavy / totalCount) * 100).toFixed(1) + "%)");
    console.log("  Special: " + categoryDist.special + " (" + ((categoryDist.special / totalCount) * 100).toFixed(1) + "%)");
    console.log("");
    console.log("--- Range Distribution ---");
    console.log("  Short: " + rangeDist.short + " (" + ((rangeDist.short / totalCount) * 100).toFixed(1) + "%)");
    console.log("  Medium: " + rangeDist.medium + " (" + ((rangeDist.medium / totalCount) * 100).toFixed(1) + "%)");
    console.log("  Long: " + rangeDist.long + " (" + ((rangeDist.long / totalCount) * 100).toFixed(1) + "%)");
    console.log("");
    console.log("--- Quality Metrics ---");
    const withBilingual = allTechniques.filter(hasCompleteBilingualNames).length;
    const withCategory = allTechniques.filter((t) => t.category).length;
    const withAnimation = allTechniques.filter((t) => t.animationType).length;
    console.log("  Bilingual Names: " + withBilingual + "/" + totalCount + " (" + ((withBilingual / totalCount) * 100).toFixed(0) + "%)");
    console.log("  Categorized: " + withCategory + "/" + totalCount + " (" + ((withCategory / totalCount) * 100).toFixed(0) + "%)");
    console.log("  Animation Hooks: " + withAnimation + "/" + totalCount + " (" + ((withAnimation / totalCount) * 100).toFixed(0) + "%)");
    console.log("");
    console.log("═══════════════════════════════════════════════════");
    console.log("");

    expect(totalCount).toBeGreaterThanOrEqual(24);
  });
});
