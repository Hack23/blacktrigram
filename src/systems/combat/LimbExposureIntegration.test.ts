/**
 * Integration Tests for Limb Exposure and Counter-Attack System
 *
 * Tests the complete flow from technique execution through limb exposure
 * detection to counter-attack opportunity and AI decision-making.
 *
 * @module systems/combat/__tests__/LimbExposureIntegration.test
 */

import { describe, it, expect } from "vitest";
import {
  calculateCounterOpportunity,
  calculateVulnerabilityMultiplier,
  generateLimbExposureWindow,
  calculateBreakingResult,
} from "./LimbExposureSystem";
import {
  analyzeCounterOpportunity,
  calculateCounterPriority,
  CounterAttackPriority,
  selectCounterTechnique,
} from "./AICounterAttackIntegration";
import type { KoreanTechnique } from "../vitalpoint/types";
import type { PlayerState } from "../player";
import { TrigramStance } from "../../types/common";

/**
 * Create a test technique with full exposure configuration
 */
function createKickTechnique(): KoreanTechnique {
  return {
    id: "test_roundhouse_kick",
    name: {
      korean: "돌려차기",
      english: "Roundhouse Kick",
      romanized: "dolryeo-chagi",
    },
    koreanName: "돌려차기",
    englishName: "Roundhouse Kick",
    romanized: "dolryeo-chagi",
    description: {
      korean: "강력한 회전 발차기",
      english: "Powerful spinning kick",
    },
    stance: TrigramStance.GEON,
    type: "kick",
    damageType: "blunt",
    damage: 35,
    kiCost: 20,
    staminaCost: 25,
    accuracy: 0.78,
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 1.1,
      exposureWindow: {
        exposedLimb: "right_leg",
        startTime: 0.5,
        duration: 350,
        vulnerabilityMultiplier: 2.0,
        allowsBreaking: true,
      },
    },
    executionTime: 800,
    recoveryTime: 1100,
    critChance: 0.18,
    critMultiplier: 1.8,
    effects: [],
    category: "heavy",
    range: "medium",
    speed: 0.9,
  };
}

/**
 * Create a counter technique for testing
 */
function createCounterTechnique(): KoreanTechnique {
  return {
    id: "test_knee_break",
    name: {
      korean: "무릎찍기",
      english: "Knee Stomp",
      romanized: "mureup-jjikgi",
    },
    koreanName: "무릎찍기",
    englishName: "Knee Stomp",
    romanized: "mureup-jjikgi",
    description: {
      korean: "상대 무릎을 강하게 밟아 부수는 기술",
      english: "Stomp to break opponent's knee",
    },
    stance: TrigramStance.GAN,
    type: "kick",
    damageType: "blunt",
    damage: 45,
    kiCost: 30,
    staminaCost: 35,
    accuracy: 0.7,
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 0.75,
      exposureWindow: {
        exposedLimb: "right_leg",
        startTime: 0.35,
        duration: 250,
        vulnerabilityMultiplier: 1.3,
        allowsBreaking: false,
      },
    },
    executionTime: 600,
    recoveryTime: 900,
    critChance: 0.3,
    critMultiplier: 2.5,
    effects: [],
    category: "special",
    range: "short",
    speed: 1.0,
  };
}

/**
 * Create a minimal player state for testing
 */
function createTestPlayer(
  overrides: Partial<PlayerState> = {}
): PlayerState {
  return {
    archetype: "musa",
    health: 100,
    stamina: 80,
    ki: 70,
    position: { x: 0, y: 0 },
    stance: TrigramStance.GEON,
    ...overrides,
  } as PlayerState;
}

describe("LimbExposureSystem Integration", () => {
  describe("Complete Attack-Counter Flow", () => {
    it("should detect exposure during kick and enable counter", () => {
      const kickTechnique = createKickTechnique();

      // Attacker starts kick
      const windUpTime = 200; // Before exposure window
      let opportunity = calculateCounterOpportunity(
        kickTechnique,
        windUpTime
      );
      expect(opportunity).toBeUndefined(); // Too early

      // Mid-kick - peak extension
      const peakTime = 500; // 800 * 0.5 + 100ms = within window
      opportunity = calculateCounterOpportunity(kickTechnique, peakTime);
      expect(opportunity).toBeDefined();
      expect(opportunity?.exposedLimb).toBe("right_leg");
      expect(opportunity?.allowsBreaking).toBe(true);
      expect(opportunity?.vulnerabilityMultiplier).toBe(2.0);

      // Recovery phase - window closed
      const recoveryTime = 900; // After exposure window
      opportunity = calculateCounterOpportunity(kickTechnique, recoveryTime);
      expect(opportunity).toBeUndefined();
    });

    it("should calculate increasing vulnerability through technique phases", () => {
      const technique = createKickTechnique();

      // Wind-up phase (before exposure)
      const windUpVulnerability = calculateVulnerabilityMultiplier(
        technique,
        200
      );
      expect(windUpVulnerability).toBe(1.1); // Slight vulnerability

      // Peak extension (during exposure)
      const peakVulnerability = calculateVulnerabilityMultiplier(
        technique,
        500
      );
      expect(peakVulnerability).toBe(2.0); // Maximum vulnerability

      // Mid-recovery (after execution, during recovery)
      const recoveryVulnerability = calculateVulnerabilityMultiplier(
        technique,
        1200
      );
      expect(recoveryVulnerability).toBeGreaterThan(1.0);
      expect(recoveryVulnerability).toBeLessThan(2.0); // Decreasing

      // Fully recovered
      const recoveredVulnerability = calculateVulnerabilityMultiplier(
        technique,
        2000
      );
      expect(recoveredVulnerability).toBe(1.0); // Back to baseline
    });

    it("should successfully execute breaking technique during opportunity", () => {
      const kickTechnique = createKickTechnique();
      const counterTechnique = createCounterTechnique();

      // Get counter opportunity at peak kick extension
      const opportunity = calculateCounterOpportunity(kickTechnique, 500);
      expect(opportunity).toBeDefined();

      // Execute breaking technique
      const result = calculateBreakingResult(
        counterTechnique,
        opportunity!,
        45 // High force
      );

      expect(result.success).toBe(true);
      expect(result.target).toBe("knee");
      expect(result.severity).toBeGreaterThan(0.8); // Severe break
      expect(result.mobilityReduction).toBeGreaterThanOrEqual(0.6);
      expect(result.statusEffects).toContain("pain");
      expect(result.statusEffects).toContain("severe_injury");
    });
  });

  describe("AI Integration Flow", () => {
    it("should analyze combat context and detect counter opportunity", () => {
      const attacker = createTestPlayer({ archetype: "musa" });
      const defender = createTestPlayer({ archetype: "amsalja", stamina: 80 });

      const context = analyzeCounterOpportunity(attacker, defender, 0.8);

      expect(context.player).toBe(attacker);
      expect(context.opponent).toBe(defender);
      expect(context.distance).toBe(0.8);
      expect(context.opponentVulnerability).toBe(1.0); // No technique executing
    });

    it("should calculate high counter priority for assassin archetype", () => {
      const kickTechnique = createKickTechnique();
      const opportunity = calculateCounterOpportunity(kickTechnique, 500);

      const attacker = createTestPlayer();
      const defender = createTestPlayer({ archetype: "amsalja" });

      const context = {
        player: defender,
        opponent: attacker,
        distance: 0.7,
        counterOpportunity: opportunity,
        opponentVulnerability: 2.0,
      };

      const priority = calculateCounterPriority(
        context,
        "amsalja",
        { defensiveness: 0.8, aggression: 0.3 }
      );

      expect(priority).toBeGreaterThanOrEqual(CounterAttackPriority.HIGH);
    });

    it("should calculate low counter priority for aggressive musa", () => {
      const kickTechnique = createKickTechnique();
      const opportunity = calculateCounterOpportunity(kickTechnique, 500);

      const attacker = createTestPlayer();
      const defender = createTestPlayer({ archetype: "musa" });

      const context = {
        player: defender,
        opponent: attacker,
        distance: 0.7,
        counterOpportunity: opportunity,
        opponentVulnerability: 1.5,
      };

      const priority = calculateCounterPriority(
        context,
        "musa",
        { defensiveness: 0.3, aggression: 0.9 } // Very aggressive
      );

      expect(priority).toBeLessThanOrEqual(CounterAttackPriority.MEDIUM);
    });

    it("should select appropriate counter technique from available moves", () => {
      const kickTechnique = createKickTechnique();
      const counterTechnique = createCounterTechnique();
      const opportunity = calculateCounterOpportunity(kickTechnique, 500);

      const attacker = createTestPlayer();
      const defender = createTestPlayer({ stamina: 80 });

      const context = {
        player: defender,
        opponent: attacker,
        distance: 0.7,
        counterOpportunity: opportunity,
        opponentVulnerability: 2.0,
      };

      const availableTechniques = [
        kickTechnique, // Normal kick
        counterTechnique, // Breaking technique
      ];

      const selected = selectCounterTechnique(context, availableTechniques);

      expect(selected).toBeDefined();
      expect(selected?.id).toBe("test_knee_break");
    });

    it("should return undefined when stamina insufficient for counter", () => {
      const kickTechnique = createKickTechnique();
      const counterTechnique = createCounterTechnique();
      const opportunity = calculateCounterOpportunity(kickTechnique, 500);

      const attacker = createTestPlayer();
      const defender = createTestPlayer({ stamina: 20 }); // Too low

      const context = {
        player: defender,
        opponent: attacker,
        distance: 0.7,
        counterOpportunity: opportunity,
        opponentVulnerability: 2.0,
      };

      const selected = selectCounterTechnique(context, [counterTechnique]);

      expect(selected).toBeUndefined(); // Can't afford counter
    });

    it("should return undefined when distance too far for counter", () => {
      const kickTechnique = createKickTechnique();
      const counterTechnique = createCounterTechnique();
      const opportunity = calculateCounterOpportunity(kickTechnique, 500);

      const attacker = createTestPlayer();
      const defender = createTestPlayer({ stamina: 80 });

      const context = {
        player: defender,
        opponent: attacker,
        distance: 1.5, // Too far
        counterOpportunity: opportunity,
        opponentVulnerability: 2.0,
      };

      const selected = selectCounterTechnique(context, [counterTechnique]);

      expect(selected).toBeUndefined(); // Too far away
    });
  });

  describe("Technique Exposure Window Generation", () => {
    it("should generate appropriate exposure for high-extension kick", () => {
      const technique = createKickTechnique();
      const generated = generateLimbExposureWindow(technique);

      expect(generated.exposedLimb).toBe("right_leg");
      expect(generated.vulnerabilityMultiplier).toBeGreaterThanOrEqual(2.0);
      expect(generated.allowsBreaking).toBe(true);
      expect(generated.duration).toBeGreaterThan(250);
    });

    it("should generate lower exposure for close-range technique", () => {
      const elbowTechnique: KoreanTechnique = {
        ...createKickTechnique(),
        id: "test_elbow",
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "elbow",
          baseExtension: 0.5, // Low extension
        },
        executionTime: 500,
      };

      const generated = generateLimbExposureWindow(elbowTechnique);

      expect(generated.vulnerabilityMultiplier).toBeLessThanOrEqual(1.3);
      expect(generated.allowsBreaking).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle technique without exposure window gracefully", () => {
      const technique: KoreanTechnique = {
        ...createKickTechnique(),
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "punch",
          baseExtension: 0.9,
          // No exposureWindow defined
        },
      };

      const opportunity = calculateCounterOpportunity(technique, 400);
      expect(opportunity).toBeUndefined();

      const vulnerability = calculateVulnerabilityMultiplier(technique, 400);
      expect(vulnerability).toBe(1.0); // Baseline
    });

    it("should reject breaking when force too low", () => {
      const kickTechnique = createKickTechnique();
      const counterTechnique = createCounterTechnique();
      const opportunity = calculateCounterOpportunity(kickTechnique, 500);

      const result = calculateBreakingResult(
        counterTechnique,
        opportunity!,
        15 // Very low force
      );

      expect(result.success).toBe(false);
      expect(result.severity).toBe(0);
      expect(result.mobilityReduction).toBe(0);
    });

    it("should reject breaking when allowsBreaking is false", () => {
      const technique = createKickTechnique();
      const counterTechnique = createCounterTechnique();

      // Modify opportunity to disallow breaking
      const opportunity = {
        exposedLimb: "right_arm" as const,
        windowStart: 320,
        windowDuration: 300,
        vulnerabilityMultiplier: 1.5,
        allowsBreaking: false, // Not a breaking opportunity
      };

      const result = calculateBreakingResult(
        counterTechnique,
        opportunity,
        50 // High force, but breaking not allowed
      );

      expect(result.success).toBe(false);
      expect(result.damage).toBeGreaterThan(0); // Still deals reduced damage
    });
  });
});
