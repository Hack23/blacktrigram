import { describe, it, expect, beforeEach } from "vitest";
import { TransitionCalculator } from "./TransitionCalculator";
import { TrigramStance, PlayerArchetype } from "../../types/enums";
import type { PlayerState } from "../../types/player";

/**
 * ## Transition Calculator Test Suite
 *
 * **Business Purpose:**
 * Validates the stance transition system that enables fluid Korean martial arts
 * combat movement. Tests ensure that:
 * - Stance transitions follow traditional Korean martial arts flow principles
 * - Resource costs reflect realistic Korean martial arts energy management
 * - Transition timing respects authentic Korean martial arts rhythm
 * - Player archetype specializations provide meaningful combat advantages
 *
 * **Korean Martial Arts Integration:**
 * - Tests traditional Korean martial arts stance flow patterns
 * - Validates authentic ki and stamina costs for stance changes
 * - Ensures cultural accuracy in transition difficulty calculations
 * - Verifies traditional Korean martial arts combat timing principles
 *
 * **Business Value:**
 * These tests ensure stance transitions provide smooth, authentic Korean martial arts
 * gameplay while maintaining competitive balance and strategic depth.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("TransitionCalculator", () => {
  let calculator: TransitionCalculator;

  const createMockPlayer = (
    overrides: Partial<PlayerState> = {}
  ): PlayerState => ({
    id: "test-player",
    name: { korean: "테스트 무사", english: "Test Warrior" },
    archetype: PlayerArchetype.MUSA,
    health: 100,
    maxHealth: 100,
    ki: 100,
    maxKi: 100,
    stamina: 100,
    maxStamina: 100,
    energy: 100,
    maxEnergy: 100,
    attackPower: 75,
    defense: 75,
    speed: 75,
    technique: 75,
    pain: 0,
    consciousness: 100,
    balance: 100,
    momentum: 0,
    currentStance: TrigramStance.GEON,
    combatState: 0,
    position: { x: 300, y: 400 },
    isBlocking: false,
    isStunned: false,
    isCountering: false,
    lastActionTime: 0,
    recoveryTime: 0,
    lastStanceChangeTime: 0,
    statusEffects: [],
    activeEffects: [],
    vitalPoints: [],
    totalDamageReceived: 0,
    totalDamageDealt: 0,
    hitsTaken: 0,
    hitsLanded: 0,
    perfectStrikes: 0,
    vitalPointHits: 0,
    experiencePoints: 0,
    ...overrides,
  });

  beforeEach(() => {
    calculator = new TransitionCalculator();
  });

  /**
   * **Business Requirement:** Stance transition calculations must follow
   * traditional Korean martial arts flow and energy principles
   */
  describe("Stance Transition Calculations", () => {
    it("should calculate transition costs based on Korean martial arts principles", () => {
      const player = createMockPlayer({ currentStance: TrigramStance.GEON });

      const adjacentCost = calculator.calculateTransitionCost(
        player,
        TrigramStance.TAE
      );

      const oppositeCost = calculator.calculateTransitionCost(
        player,
        TrigramStance.GON
      );

      expect(oppositeCost.ki).toBeGreaterThan(adjacentCost.ki);
      expect(oppositeCost.stamina).toBeGreaterThan(adjacentCost.stamina);
    });

    it("should validate transition possibility based on player state", () => {
      const exhaustedPlayer = createMockPlayer({
        ki: 5,
        stamina: 10,
        currentStance: TrigramStance.GEON,
      });

      const canTransition = calculator.canTransition(
        exhaustedPlayer,
        TrigramStance.GON
      );

      expect(canTransition).toBe(false);
    });

    it("should calculate optimal transition paths", () => {
      const player = createMockPlayer({ currentStance: TrigramStance.GEON });

      const path = calculator.findOptimalPath(player, TrigramStance.GAM);

      expect(path.length).toBeGreaterThan(0);
      expect(path[0]).toBe(TrigramStance.GEON);
      expect(path[path.length - 1]).toBe(TrigramStance.GAM);
    });
  });

  /**
   * **Business Requirement:** Archetype specializations must provide meaningful
   * advantages in stance transition efficiency and cost
   */
  describe("Archetype Transition Specializations", () => {
    it("should apply archetype bonuses to transition calculations", () => {
      const assassin = createMockPlayer({
        archetype: PlayerArchetype.AMSALJA,
        currentStance: TrigramStance.SON,
      });

      const warrior = createMockPlayer({
        archetype: PlayerArchetype.MUSA,
        currentStance: TrigramStance.SON,
      });

      const assassinCost = calculator.calculateTransitionCost(
        assassin,
        TrigramStance.GAM
      );
      const warriorCost = calculator.calculateTransitionCost(
        warrior,
        TrigramStance.GAM
      );

      // Assassins should be more efficient with Wind-Water transitions
      expect(assassinCost.ki).toBeLessThanOrEqual(warriorCost.ki);
    });

    it("should calculate archetype mastery bonuses", () => {
      const hacker = createMockPlayer({ archetype: PlayerArchetype.HACKER });

      const masteryBonus = calculator.getArchetypeMastery(
        hacker.archetype,
        TrigramStance.LI
      );

      // Hackers should have mastery with Fire stance
      expect(masteryBonus).toBeGreaterThan(1.0);
    });
  });

  /**
   * **Business Requirement:** Transition timing must respect Korean martial arts
   * combat rhythm and provide strategic depth
   */
  describe("Transition Timing", () => {
    it("should enforce minimum cooldown periods", () => {
      const player = createMockPlayer({
        lastStanceChangeTime: Date.now() - 100,
      });

      const canTransitionImmediately = calculator.canTransition(
        player,
        TrigramStance.TAE
      );

      expect(canTransitionImmediately).toBe(false);
    });

    it("should calculate transition duration based on complexity", () => {
      const simpleDuration = calculator.calculateTransitionDuration(
        TrigramStance.GEON,
        TrigramStance.TAE
      );

      const complexDuration = calculator.calculateTransitionDuration(
        TrigramStance.GEON,
        TrigramStance.GON
      );

      expect(complexDuration).toBeGreaterThan(simpleDuration);
    });
  });
});
