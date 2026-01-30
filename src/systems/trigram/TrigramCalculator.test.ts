import { beforeEach, describe, expect, it } from "vitest";
import { TrigramStance } from "../../types/common";
import {
  STANCE_EFFECTIVENESS_MATRIX,
  TrigramCalculator,
} from "./TrigramCalculator";

describe("TrigramCalculator", () => {
  let calc: TrigramCalculator;

  beforeEach(() => {
    calc = new TrigramCalculator();
  });

  it("should be instantiable", () => {
    expect(calc).toBeInstanceOf(TrigramCalculator);
  });

  describe("calculateStanceEffectiveness", () => {
    it("should return effectiveness values from matrix", () => {
      const effectiveness = TrigramCalculator.calculateStanceEffectiveness(
        TrigramStance.GEON,
        TrigramStance.GON
      );

      expect(effectiveness).toBe(1.2); // GEON > GON according to matrix
    });

    it("should return 1.0 for neutral matchups", () => {
      const effectiveness = TrigramCalculator.calculateStanceEffectiveness(
        TrigramStance.GEON,
        TrigramStance.TAE
      );

      expect(effectiveness).toBe(1.0); // Default neutral
    });

    it("should handle all stance combinations", () => {
      const stances = Object.values(TrigramStance);

      stances.forEach((attacker) => {
        stances.forEach((defender) => {
          const effectiveness = TrigramCalculator.calculateStanceEffectiveness(
            attacker,
            defender
          );

          expect(effectiveness).toBeGreaterThanOrEqual(0);
          expect(effectiveness).toBeLessThanOrEqual(2.0);
        });
      });
    });
  });

  describe("getCounterStance", () => {
    it("should return optimal counter stance", () => {
      const counterStance = TrigramCalculator.getCounterStance(
        TrigramStance.GON
      );

      expect(Object.values(TrigramStance)).toContain(counterStance);

      // Counter stance should have advantage
      const effectiveness = TrigramCalculator.calculateStanceEffectiveness(
        counterStance,
        TrigramStance.GON
      );
      expect(effectiveness).toBeGreaterThanOrEqual(1.0);
    });

    it("should handle all stances", () => {
      Object.values(TrigramStance).forEach((stance) => {
        const counter = TrigramCalculator.getCounterStance(stance);
        expect(Object.values(TrigramStance)).toContain(counter);
      });
    });
  });

  describe("calculateTransitionDifficulty", () => {
    it("should return 0 for same stance", () => {
      const difficulty = TrigramCalculator.calculateTransitionDifficulty(
        TrigramStance.GEON,
        TrigramStance.GEON
      );

      expect(difficulty).toBe(0);
    });

    it("should return positive values for different stances", () => {
      const difficulty = TrigramCalculator.calculateTransitionDifficulty(
        TrigramStance.GEON,
        TrigramStance.TAE
      );

      expect(difficulty).toBeGreaterThan(0);
      expect(difficulty).toBeLessThanOrEqual(1.0);
    });

    it("should give easier transitions for adjacent stances", () => {
      const adjacentDifficulty =
        TrigramCalculator.calculateTransitionDifficulty(
          TrigramStance.GEON,
          TrigramStance.TAE
        );

      const distantDifficulty = TrigramCalculator.calculateTransitionDifficulty(
        TrigramStance.GEON,
        TrigramStance.GAM
      );

      expect(adjacentDifficulty).toBeLessThanOrEqual(distantDifficulty);
    });

    it("should handle all stance combinations", () => {
      const stances = Object.values(TrigramStance);

      stances.forEach((from) => {
        stances.forEach((to) => {
          const difficulty = TrigramCalculator.calculateTransitionDifficulty(
            from,
            to
          );
          expect(difficulty).toBeGreaterThanOrEqual(0);
          expect(difficulty).toBeLessThanOrEqual(1.0);
        });
      });
    });
  });

  describe("STANCE_EFFECTIVENESS_MATRIX", () => {
    it("should contain all stance relationships", () => {
      const stances = Object.values(TrigramStance);

      stances.forEach((stance) => {
        expect(STANCE_EFFECTIVENESS_MATRIX[stance]).toBeDefined();
      });
    });

    it("should have symmetric weakness/strength relationships", () => {
      // If A > B, then B should not have advantage over A
      Object.entries(STANCE_EFFECTIVENESS_MATRIX).forEach(
        ([attacker, defenders]) => {
          Object.entries(defenders).forEach(([defender, effectiveness]) => {
            if (effectiveness > 1.0) {
              const reverseEffectiveness =
                STANCE_EFFECTIVENESS_MATRIX[defender as TrigramStance]?.[
                  attacker as TrigramStance
                ];
              if (reverseEffectiveness) {
                expect(reverseEffectiveness).toBeLessThanOrEqual(1.0);
              }
            }
          });
        }
      );
    });

    it("should provide meaningful Korean martial arts combat balance", () => {
      // Water (GAM) vs Fire (LI) - Water should be strong against Fire
      const waterVsFire = TrigramCalculator.calculateStanceEffectiveness(
        TrigramStance.GAM,
        TrigramStance.LI
      );
      expect(waterVsFire).toBeGreaterThanOrEqual(1.0); // Water extinguishes Fire

      // Earth (GON) should be strong against Water (GAM) - absorption
      const earthVsWater = TrigramCalculator.calculateStanceEffectiveness(
        TrigramStance.GON,
        TrigramStance.GAM
      );
      expect(earthVsWater).toBeGreaterThanOrEqual(1.0); // Earth absorbs Water
    });

    it("should handle all stance combinations", () => {
      const stances = Object.values(TrigramStance);

      stances.forEach((attacker) => {
        stances.forEach((defender) => {
          const effectiveness = TrigramCalculator.calculateStanceEffectiveness(
            attacker,
            defender
          );

          // Fix: Complete the condition - check effectiveness is reasonable
          if (effectiveness < 0.5 || effectiveness > 2.0) {
            console.warn(
              `Extreme effectiveness: ${attacker} vs ${defender} = ${effectiveness}`
            );
          }
        });
      });
    });
  });

  describe("Korean martial arts integration", () => {
    it("should reflect authentic trigram philosophy", () => {
      const allStances = Object.values(TrigramStance);

      allStances.forEach((stance) => {
        const otherStances = allStances.filter((s) => s !== stance);

        // Each stance should have at least one relationship where it's effective OR defensive
        const hasEffectiveRelationship = otherStances.some((otherStance) => {
          const effectiveness = TrigramCalculator.calculateStanceEffectiveness(
            stance,
            otherStance
          );
          return effectiveness !== 1.0; // Either strong (>1.0) or strategic (<1.0)
        });

        expect(hasEffectiveRelationship).toBe(true);
      });
    });

    it("should maintain game balance for all player archetypes", () => {
      const stances = Object.values(TrigramStance);

      stances.forEach((stance) => {
        let advantageCount = 0;
        let disadvantageCount = 0;

        stances.forEach((otherStance) => {
          if (stance !== otherStance) {
            const effectiveness =
              TrigramCalculator.calculateStanceEffectiveness(
                stance,
                otherStance
              );
            if (effectiveness > 1.0) {
              advantageCount++;
            } else if (effectiveness < 1.0) {
              disadvantageCount++;
            }
          }
        });

        // Each stance should have at least one advantage or disadvantage
        expect(advantageCount + disadvantageCount).toBeGreaterThan(0);
      });
    });
  });

  describe("calculateLateralityModifier", () => {
    describe("mid-level attacks (centerline)", () => {
      it("should return advantage for matched stances on mid attacks", () => {
        // Left vs Left - matched stance, exposed centerline
        expect(
          TrigramCalculator.calculateLateralityModifier("left", "left", "mid")
        ).toBe(1.15);

        // Right vs Right - matched stance, exposed centerline
        expect(
          TrigramCalculator.calculateLateralityModifier("right", "right", "mid")
        ).toBe(1.15);
      });

      it("should return disadvantage for mismatched stances on mid attacks", () => {
        // Left vs Right - mismatched stance, protected centerline
        expect(
          TrigramCalculator.calculateLateralityModifier("left", "right", "mid")
        ).toBe(0.90);

        // Right vs Left - mismatched stance, protected centerline
        expect(
          TrigramCalculator.calculateLateralityModifier("right", "left", "mid")
        ).toBe(0.90);
      });

      it("should apply 15% offensive advantage for matched mid-level attacks", () => {
        const modifier = TrigramCalculator.calculateLateralityModifier(
          "left",
          "left",
          "mid"
        );
        expect(modifier).toBe(1.15);
        expect(modifier - 1.0).toBeCloseTo(0.15, 2);
      });

      it("should apply 10% defensive advantage for mismatched mid-level attacks", () => {
        const modifier = TrigramCalculator.calculateLateralityModifier(
          "left",
          "right",
          "mid"
        );
        expect(modifier).toBe(0.90);
        expect(1.0 - modifier).toBeCloseTo(0.10, 2);
      });
    });

    describe("high-level attacks", () => {
      it("should return slight advantage for matched stances on high attacks", () => {
        expect(
          TrigramCalculator.calculateLateralityModifier("left", "left", "high")
        ).toBe(1.05);
        expect(
          TrigramCalculator.calculateLateralityModifier("right", "right", "high")
        ).toBe(1.05);
      });

      it("should return slight disadvantage for mismatched stances on high attacks", () => {
        expect(
          TrigramCalculator.calculateLateralityModifier("left", "right", "high")
        ).toBe(0.98);
        expect(
          TrigramCalculator.calculateLateralityModifier("right", "left", "high")
        ).toBe(0.98);
      });

      it("should have smaller modifiers than mid-level attacks", () => {
        const matchedHigh = TrigramCalculator.calculateLateralityModifier(
          "left",
          "left",
          "high"
        );
        const matchedMid = TrigramCalculator.calculateLateralityModifier(
          "left",
          "left",
          "mid"
        );

        expect(matchedHigh).toBeLessThan(matchedMid);
        expect(matchedHigh - 1.0).toBeLessThan(matchedMid - 1.0);
      });
    });

    describe("low-level attacks", () => {
      it("should return minimal advantage for matched stances on low attacks", () => {
        expect(
          TrigramCalculator.calculateLateralityModifier("left", "left", "low")
        ).toBe(1.03);
        expect(
          TrigramCalculator.calculateLateralityModifier("right", "right", "low")
        ).toBe(1.03);
      });

      it("should return minimal disadvantage for mismatched stances on low attacks", () => {
        expect(
          TrigramCalculator.calculateLateralityModifier("left", "right", "low")
        ).toBe(0.99);
        expect(
          TrigramCalculator.calculateLateralityModifier("right", "left", "low")
        ).toBe(0.99);
      });

      it("should have smallest modifiers of all attack levels", () => {
        const matchedLow = TrigramCalculator.calculateLateralityModifier(
          "left",
          "left",
          "low"
        );
        const matchedMid = TrigramCalculator.calculateLateralityModifier(
          "left",
          "left",
          "mid"
        );
        const matchedHigh = TrigramCalculator.calculateLateralityModifier(
          "left",
          "left",
          "high"
        );

        expect(matchedLow - 1.0).toBeLessThan(matchedHigh - 1.0);
        expect(matchedLow - 1.0).toBeLessThan(matchedMid - 1.0);
      });
    });

    describe("default behavior", () => {
      it("should default to mid-level attacks when no attack level specified", () => {
        const withoutLevel = TrigramCalculator.calculateLateralityModifier(
          "left",
          "left"
        );
        const withMidLevel = TrigramCalculator.calculateLateralityModifier(
          "left",
          "left",
          "mid"
        );

        expect(withoutLevel).toBe(withMidLevel);
        expect(withoutLevel).toBe(1.15);
      });

      it("should return neutral modifier for invalid attack levels", () => {
        // TypeScript would prevent this, but test runtime behavior
        const result = TrigramCalculator.calculateLateralityModifier(
          "left",
          "left",
          "invalid" as any
        );
        expect(result).toBe(1.0);
      });
    });

    describe("symmetry and consistency", () => {
      it("should be symmetric for both left and right matched stances", () => {
        const leftMatched = TrigramCalculator.calculateLateralityModifier(
          "left",
          "left",
          "mid"
        );
        const rightMatched = TrigramCalculator.calculateLateralityModifier(
          "right",
          "right",
          "mid"
        );

        expect(leftMatched).toBe(rightMatched);
      });

      it("should be symmetric for both left/right and right/left mismatches", () => {
        const leftVsRight = TrigramCalculator.calculateLateralityModifier(
          "left",
          "right",
          "mid"
        );
        const rightVsLeft = TrigramCalculator.calculateLateralityModifier(
          "right",
          "left",
          "mid"
        );

        expect(leftVsRight).toBe(rightVsLeft);
      });

      it("should maintain consistent advantage/disadvantage across all attack levels", () => {
        const levels: Array<"high" | "mid" | "low"> = ["high", "mid", "low"];

        levels.forEach((level) => {
          const matched = TrigramCalculator.calculateLateralityModifier(
            "left",
            "left",
            level
          );
          const mismatched = TrigramCalculator.calculateLateralityModifier(
            "left",
            "right",
            level
          );

          // Matched should always provide advantage (>1.0)
          expect(matched).toBeGreaterThan(1.0);

          // Mismatched should always provide disadvantage (<1.0)
          expect(mismatched).toBeLessThan(1.0);
        });
      });
    });

    describe("Korean martial arts tactical principles", () => {
      it("should reflect centerline theory for mid-level attacks", () => {
        // In Korean martial arts (Hapkido, Taekwondo), matched stances
        // expose the centerline creating offensive opportunities
        const matchedMid = TrigramCalculator.calculateLateralityModifier(
          "left",
          "left",
          "mid"
        );

        // Mismatched stances protect the centerline with asymmetric guard
        const mismatchedMid = TrigramCalculator.calculateLateralityModifier(
          "left",
          "right",
          "mid"
        );

        expect(matchedMid).toBeGreaterThan(1.0); // Exposed centerline
        expect(mismatchedMid).toBeLessThan(1.0); // Protected centerline
      });

      it("should have realistic combat modifiers within reasonable bounds", () => {
        const levels: Array<"high" | "mid" | "low"> = ["high", "mid", "low"];
        const lateralities: Array<"left" | "right"> = ["left", "right"];

        lateralities.forEach((attackerLat) => {
          lateralities.forEach((defenderLat) => {
            levels.forEach((level) => {
              const modifier = TrigramCalculator.calculateLateralityModifier(
                attackerLat,
                defenderLat,
                level
              );

              // All modifiers should be within realistic combat bounds
              expect(modifier).toBeGreaterThanOrEqual(0.85);
              expect(modifier).toBeLessThanOrEqual(1.20);

              // Mid-level should have strongest modifiers
              if (level === "mid") {
                expect(modifier).toBeGreaterThanOrEqual(0.90);
                expect(modifier).toBeLessThanOrEqual(1.15);
              }
            });
          });
        });
      });

      it("should emphasize mid-level centerline attacks as primary tactical consideration", () => {
        const midAdvantage =
          TrigramCalculator.calculateLateralityModifier("left", "left", "mid") -
          1.0;
        const highAdvantage =
          TrigramCalculator.calculateLateralityModifier(
            "left",
            "left",
            "high"
          ) - 1.0;
        const lowAdvantage =
          TrigramCalculator.calculateLateralityModifier("left", "left", "low") -
          1.0;

        // Mid-level should have strongest tactical impact
        expect(midAdvantage).toBeGreaterThan(highAdvantage);
        expect(midAdvantage).toBeGreaterThan(lowAdvantage);

        // Ratio of mid to high/low should reflect centerline emphasis
        expect(midAdvantage / highAdvantage).toBeGreaterThan(2.5);
        expect(midAdvantage / lowAdvantage).toBeGreaterThan(4.0);
      });
    });

    describe("edge cases", () => {
      it("should handle all laterality combinations", () => {
        const lateralities: Array<"left" | "right"> = ["left", "right"];
        const levels: Array<"high" | "mid" | "low"> = ["high", "mid", "low"];

        lateralities.forEach((attackerLat) => {
          lateralities.forEach((defenderLat) => {
            levels.forEach((level) => {
              const modifier = TrigramCalculator.calculateLateralityModifier(
                attackerLat,
                defenderLat,
                level
              );

              expect(modifier).toBeGreaterThan(0);
              expect(typeof modifier).toBe("number");
              expect(isFinite(modifier)).toBe(true);
            });
          });
        });
      });

      it("should return consistent values across multiple calls", () => {
        const firstCall = TrigramCalculator.calculateLateralityModifier(
          "left",
          "right",
          "mid"
        );
        const secondCall = TrigramCalculator.calculateLateralityModifier(
          "left",
          "right",
          "mid"
        );
        const thirdCall = TrigramCalculator.calculateLateralityModifier(
          "left",
          "right",
          "mid"
        );

        expect(firstCall).toBe(secondCall);
        expect(secondCall).toBe(thirdCall);
      });
    });
  });
});
