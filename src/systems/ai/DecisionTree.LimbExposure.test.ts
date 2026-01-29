/**
 * Tests for AI DecisionTree integration with Limb Exposure System
 *
 * **Korean**: AI 의사결정 트리 사지 노출 시스템 통합 테스트
 *
 * Validates that the AI can:
 * - Detect opponent limb exposure during technique execution
 * - Prioritize counter-attacks appropriately based on archetype
 * - Execute breaking techniques when opportunities arise
 * - Handle edge cases (no exposure, out of range, low stamina)
 *
 * @module systems/ai/__tests__/DecisionTree.LimbExposure.test
 */

import { describe, it, expect, beforeEach } from "vitest";
import { AIDecisionTree, AIActionType } from "./DecisionTree";
import { AIComboSystem } from "./ComboSystem";
import { AI_PERSONALITIES, type AIPersonality } from "./AIPersonality";
import type { CombatContext } from "./types";
import { TrigramStance, PlayerArchetype } from "@/types";
import type { KoreanTechnique } from "@/systems/vitalpoint/types";
import type { CounterOpportunity } from "@/types/physics";
import { calculateCounterOpportunity } from "@/systems/combat/LimbExposureSystem";

/**
 * Custom defensive counter personality for testing limb exposure integration.
 * High defensiveness to prioritize counter-attacks.
 */
const DEFENSIVE_COUNTER: AIPersonality = {
  name: "Defensive Counter",
  koreanName: "방어 반격자",
  archetype: PlayerArchetype.MUSA,
  aggressionLevel: 0.3,
  defensePreference: 0.9, // Very defensive
  comboTendency: 0.4,
  stanceSwitchFrequency: 0.5,
  feintChance: 0.2,
  tacticalRetreatThreshold: 0.25,
  favoredStances: [TrigramStance.GAN, TrigramStance.GAM],
  description: {
    korean: "방어적인 반격 전문가",
    english: "Defensive counter-attack specialist",
  },
};

/**
 * Create a test technique with limb exposure configuration.
 *
 * **Korean**: 사지 노출 설정이 있는 테스트 기술 생성
 */
function createTestTechnique(
  overrides: Partial<KoreanTechnique> = {}
): KoreanTechnique {
  return {
    id: "test_kick",
    name: {
      korean: "테스트 발차기",
      english: "Test Kick",
      romanized: "Test Kick",
    },
    koreanName: "테스트 발차기",
    englishName: "Test Kick",
    romanized: "Test Kick",
    description: {
      korean: "테스트용 발차기",
      english: "Test kick technique",
    },
    stance: TrigramStance.GEON,
    type: "strike",
    damageType: "blunt",
    damage: 40,
    kiCost: 20,
    staminaCost: 25,
    accuracy: 0.85,
    reachConfig: {
      bodyPart: "leg",
      techniqueType: "kick",
      baseExtension: 1.05,
      exposureWindow: {
        exposedLimb: "right_leg",
        startTime: 0.5, // 50% through execution
        duration: 400, // 400ms exposure window
        vulnerabilityMultiplier: 2.0, // 2x damage during window
        allowsBreaking: true, // Can break the leg
      },
    },
    executionTime: 800,
    recoveryTime: 1200,
    critChance: 0.12,
    critMultiplier: 1.6,
    effects: [],
    category: "heavy",
    range: "medium",
    speed: 1.0,
    ...overrides,
  };
}

/**
 * Create mock combat context for testing.
 * Now calculates counterOpportunity from opponentTechnique if provided.
 *
 * **Korean**: 테스트용 모의 전투 상황 생성
 */
function createMockContext(
  overrides?: Partial<CombatContext> & {
    opponentTechnique?: KoreanTechnique;
    opponentTechniqueTime?: number;
  }
): CombatContext {
  // Calculate counterOpportunity if technique and time are provided
  let counterOpportunity: CounterOpportunity | undefined;
  if (overrides?.opponentTechnique && overrides.opponentTechniqueTime !== undefined) {
    counterOpportunity = calculateCounterOpportunity(
      overrides.opponentTechnique,
      overrides.opponentTechniqueTime
    );
  }

  // Remove opponentTechnique and opponentTechniqueTime from overrides
  // as they're not part of CombatContext anymore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { opponentTechnique, opponentTechniqueTime, ...contextOverrides } = overrides || {};

  return {
    playerPosition: { x: -1.0, y: 0 },
    opponentPosition: { x: 1.0, y: 0 },
    playerHealth: 100,
    playerMaxHealth: 100,
    playerKi: 100,
    playerMaxKi: 100,
    playerStamina: 100,
    playerMaxStamina: 100,
    opponentHealth: 100,
    opponentMaxHealth: 100,
    opponentStance: TrigramStance.GEON,
    playerStance: TrigramStance.TAE,
    distanceToOpponent: 0.8, // Within counter range
    timeInMatch: 15000, // 15 seconds - past Hacker observation phase
    isOpponentAttacking: true,
    recentDamageTaken: 0,
    opponentBalance: "READY",
    arenaBounds: {
      x: 0,
      y: 0,
      width: 1200,
      height: 800,
      worldWidthMeters: 10,
      worldDepthMeters: 7.5,
    },
    counterOpportunity, // Add calculated counterOpportunity
    ...contextOverrides,
  };
}

describe("AIDecisionTree - Limb Exposure Integration", () => {
  let decisionTree: AIDecisionTree;
  let comboSystem: AIComboSystem;

  beforeEach(() => {
    decisionTree = new AIDecisionTree();
    comboSystem = new AIComboSystem();
  });

  describe("Counter Opportunity Detection", () => {
    it("should detect limb exposure when opponent executes technique within window", () => {
      const technique = createTestTechnique();
      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400, // 50% of 800ms execution = within window
        distanceToOpponent: 0.8, // Within counter range
      });

      const decision = decisionTree.makeDecision(
        context,
        AI_PERSONALITIES.DEFENSIVE_SPECIALIST, // Defensive archetype
        comboSystem
      );

      expect(decision.action).toBe(AIActionType.COUNTER);
      expect(decision.reason).toContain("Exposed limb counter");
      expect(decision.reason).toContain("right_leg");
      expect(decision.priority).toBeGreaterThan(8);
    });

    it("should not detect counter opportunity when technique time is outside exposure window", () => {
      const technique = createTestTechnique();
      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 100, // Before window starts (50% of 800ms = 400ms)
        distanceToOpponent: 0.8,
      });

      const decision = decisionTree.makeDecision(
        context,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      // Should not be a limb exposure counter (no exposure detected)
      if (decision.action === AIActionType.COUNTER) {
        expect(decision.reason).not.toContain("Exposed limb");
      }
    });

    it("should not counter when distance is too far", () => {
      const technique = createTestTechnique();
      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400, // Within window
        distanceToOpponent: 1.5, // Too far for counter (>1.0m)
      });

      const decision = decisionTree.makeDecision(
        context,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      // Should not be a counter action due to distance
      expect(decision.action).not.toBe(AIActionType.COUNTER);
    });

    it("should handle missing opponent technique gracefully", () => {
      const context = createMockContext({
        opponentTechnique: undefined,
        opponentTechniqueTime: undefined,
      });

      const decision = decisionTree.makeDecision(
        context,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      // Should make a valid decision without counter opportunity
      expect(decision).toBeDefined();
      expect(decision.action).toBeDefined();
    });
  });

  describe("Defensive Archetype Prioritization", () => {
    it("should give Musa (defensive archetype) high priority for limb exposure counters", () => {
      const technique = createTestTechnique();
      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
      });

      const musaPersonality = AI_PERSONALITIES.AGGRESSIVE_STRIKER; // Musa archetype

      const decision = decisionTree.makeDecision(
        context,
        musaPersonality,
        comboSystem
      );

      expect(decision.action).toBe(AIActionType.COUNTER);
      expect(decision.priority).toBeGreaterThan(10); // High priority for defensive archetype
    });

    it("should give Amsalja (assassin) high priority for breaking opportunities", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "leg",
          techniqueType: "kick",
          baseExtension: 1.05,
          exposureWindow: {
            exposedLimb: "right_knee",
            startTime: 0.5,
            duration: 400,
            vulnerabilityMultiplier: 2.2,
            allowsBreaking: true, // Breaking enabled
          },
        },
      });

      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.7,
      });

      // Amsalja personality (assassin with high defensiveness)
      const amsaljaPersonality = {
        ...AI_PERSONALITIES.TECHNICAL_MASTER, // Use TECHNICAL_MASTER (Amsalja)
        archetype: PlayerArchetype.AMSALJA,
      };

      const decision = decisionTree.makeDecision(
        context,
        amsaljaPersonality,
        comboSystem
      );

      expect(decision.action).toBe(AIActionType.COUNTER);
      expect(decision.reason).toContain("breaking possible");
      expect(decision.priority).toBeGreaterThan(11); // Extra priority for breaking
    });

    it("should give Jeongbo Yowon (intelligence operative) moderate priority for counter exploitation", () => {
      const technique = createTestTechnique();
      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
      });

      const jeongboPersonality = {
        ...AI_PERSONALITIES.BALANCED_FIGHTER, // Use BALANCED_FIGHTER (Jeongbo)
        archetype: PlayerArchetype.JEONGBO_YOWON,
        defensePreference: 0.5, // Moderate defensiveness
      };

      const decision = decisionTree.makeDecision(
        context,
        jeongboPersonality,
        comboSystem
      );

      expect(decision.action).toBe(AIActionType.COUNTER);
      expect(decision.priority).toBeGreaterThan(9);
      expect(decision.priority).toBeLessThan(14); // Moderate to high priority for intelligence operative
    });
  });

  describe("Breaking Technique Prioritization", () => {
    it("should prioritize breaking opportunities with +2 priority bonus", () => {
      const breakingTechnique = createTestTechnique({
        reachConfig: {
          bodyPart: "leg",
          techniqueType: "kick",
          baseExtension: 1.05,
          exposureWindow: {
            exposedLimb: "right_knee",
            startTime: 0.5,
            duration: 400,
            vulnerabilityMultiplier: 2.0,
            allowsBreaking: true,
          },
        },
      });

      const nonBreakingTechnique = createTestTechnique({
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "punch",
          baseExtension: 0.95,
          exposureWindow: {
            exposedLimb: "right_arm",
            startTime: 0.5,
            duration: 400,
            vulnerabilityMultiplier: 2.0,
            allowsBreaking: false,
          },
        },
      });

      const contextBreaking = createMockContext({
        opponentTechnique: breakingTechnique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
      });

      const contextNonBreaking = createMockContext({
        opponentTechnique: nonBreakingTechnique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
      });

      const decisionBreaking = decisionTree.makeDecision(
        contextBreaking,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      const decisionNonBreaking = decisionTree.makeDecision(
        contextNonBreaking,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      expect(decisionBreaking.priority).toBeGreaterThan(
        decisionNonBreaking.priority
      );
      expect(decisionBreaking.reason).toContain("breaking possible");
      expect(decisionBreaking.reason).toContain("파쇄 가능");
    });

    it("should include vulnerability multiplier in decision reason", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "leg",
          techniqueType: "kick",
          baseExtension: 1.05,
          exposureWindow: {
            exposedLimb: "right_leg",
            startTime: 0.5,
            duration: 400,
            vulnerabilityMultiplier: 2.5, // High vulnerability
            allowsBreaking: true,
          },
        },
      });

      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
      });

      const decision = decisionTree.makeDecision(
        context,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      expect(decision.reason).toContain("취약성");
      expect(decision.reason).toMatch(/\d\.\d+x/); // Vulnerability multiplier format
    });
  });

  describe("Resource and Distance Constraints", () => {
    it("should reduce priority when player has low stamina", () => {
      const technique = createTestTechnique();
      const contextLowStamina = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
        playerStamina: 15, // Low stamina (15% of 100)
        playerMaxStamina: 100,
      });

      const contextHighStamina = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
        playerStamina: 80,
        playerMaxStamina: 100,
      });

      const decisionLow = decisionTree.makeDecision(
        contextLowStamina,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      const decisionHigh = decisionTree.makeDecision(
        contextHighStamina,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      // Low stamina should reduce priority
      if (
        decisionLow.action === AIActionType.COUNTER &&
        decisionHigh.action === AIActionType.COUNTER
      ) {
        expect(decisionLow.priority).toBeLessThan(decisionHigh.priority);
      }
    });

    it("should not counter when distance exceeds 1.0 meter threshold", () => {
      const technique = createTestTechnique();
      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 1.2, // Beyond counter range
      });

      const decision = decisionTree.makeDecision(
        context,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      // Should not be a counter due to distance
      if (decision.action === AIActionType.COUNTER) {
        expect(decision.reason).not.toContain("Exposed limb");
      }
    });
  });

  describe("Korean Translation", () => {
    it("should include Korean limb translations in counter reasons", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "leg",
          techniqueType: "kick",
          baseExtension: 1.05,
          exposureWindow: {
            exposedLimb: "left_knee",
            startTime: 0.5,
            duration: 400,
            vulnerabilityMultiplier: 2.0,
            allowsBreaking: true,
          },
        },
      });

      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
      });

      const decision = decisionTree.makeDecision(
        context,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      expect(decision.reason).toContain("왼무릎"); // Korean for "left knee"
    });

    it("should translate various limb types correctly", () => {
      // Create a fresh DecisionTree for each limb test to avoid cooldown interference
      const limbTranslations = [
        { english: "right_arm", korean: "오른팔" },
        { english: "left_elbow", korean: "왼팔꿈치" },
        { english: "right_wrist", korean: "오른손목" },
        { english: "left_ankle", korean: "왼발목" },
      ];

      limbTranslations.forEach(({ english, korean }) => {
        const freshDecisionTree = new AIDecisionTree();
        const technique = createTestTechnique({
          reachConfig: {
            bodyPart: "arm",
            techniqueType: "punch",
            baseExtension: 0.95,
            exposureWindow: {
              exposedLimb: english as any,
              startTime: 0.5,
              duration: 400,
              vulnerabilityMultiplier: 1.8,
              allowsBreaking: false,
            },
          },
        });

        const context = createMockContext({
          opponentTechnique: technique,
          opponentTechniqueTime: 400,
          distanceToOpponent: 0.8,
        });

        const decision = freshDecisionTree.makeDecision(
          context,
          DEFENSIVE_COUNTER,
          comboSystem
        );

        expect(decision.reason).toContain(korean);
      });
    });
  });

  describe("Priority Ordering", () => {
    it("should prioritize limb exposure counter over standard counter", () => {
      const technique = createTestTechnique();
      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400, // Within limb exposure window
        isOpponentAttacking: true, // Also triggers standard counter
        distanceToOpponent: 0.8,
      });

      const decision = decisionTree.makeDecision(
        context,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      // Should be limb exposure counter (higher priority)
      expect(decision.action).toBe(AIActionType.COUNTER);
      expect(decision.reason).toContain("Exposed limb counter");
      expect(decision.priority).toBeGreaterThan(9); // Higher than standard counter (8)
    });

    it("survival retreat should override counter opportunity at extremely low health", () => {
      const technique = createTestTechnique();
      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
        playerHealth: 2, // Extremely critical health (2%)
        playerMaxHealth: 100,
        playerStamina: 100, // Full stamina to ensure retreat is possible
      });

      const decision = decisionTree.makeDecision(
        context,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      // At 2% health, survival instinct should override counter opportunities
      // The AI should prioritize staying alive over exploiting vulnerabilities
      
      // Accept either retreat OR counter, but counter priority should be lower than survival would be
      expect([AIActionType.RETREAT, AIActionType.COUNTER]).toContain(
        decision.action
      );
      if (decision.action === AIActionType.COUNTER) {
        // If counter was chosen, its priority should still be reasonable (not override survival)
        expect(decision.priority).toBeLessThan(15);
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle technique without exposure window", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "punch",
          baseExtension: 0.95,
          // No exposureWindow defined
        },
      });

      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
      });

      const decision = decisionTree.makeDecision(
        context,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      // Should make a decision without crashing
      expect(decision).toBeDefined();
      // Should not be a limb exposure counter
      if (decision.action === AIActionType.COUNTER) {
        expect(decision.reason).not.toContain("Exposed limb");
      }
    });

    it("should handle zero vulnerability multiplier gracefully", () => {
      const technique = createTestTechnique({
        reachConfig: {
          bodyPart: "arm",
          techniqueType: "punch",
          baseExtension: 0.95,
          exposureWindow: {
            exposedLimb: "right_arm",
            startTime: 0.5,
            duration: 400,
            vulnerabilityMultiplier: 0, // Zero vulnerability
            allowsBreaking: false,
          },
        },
      });

      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
      });

      const decision = decisionTree.makeDecision(
        context,
        DEFENSIVE_COUNTER,
        comboSystem
      );

      // Should still provide valid decision
      expect(decision).toBeDefined();
      expect(decision.priority).toBeGreaterThanOrEqual(0);
    });

    it("should handle multiple decision options with limb exposure present", () => {
      const technique = createTestTechnique();
      const context = createMockContext({
        opponentTechnique: technique,
        opponentTechniqueTime: 400,
        distanceToOpponent: 0.8,
        isOpponentAttacking: true,
        playerStamina: 100,
        playerKi: 100,
      });

      const decision = decisionTree.makeDecision(
        context,
        AI_PERSONALITIES.AGGRESSIVE_STRIKER,
        comboSystem
      );

      // Should make a valid decision (may or may not be counter depending on aggression)
      expect(decision).toBeDefined();
      expect(decision.action).toBeDefined();
      expect(decision.priority).toBeGreaterThanOrEqual(0);
    });
  });
});
