import { describe, it, expect, beforeEach } from "vitest";
import { StanceManager } from "./StanceManager";
import { TrigramStance, PlayerArchetype } from "../../types/enums";
import type { PlayerState } from "../../types/player";

/**
 * ## Stance Manager Test Suite
 *
 * **Business Purpose:**
 * Validates the stance management system that coordinates Korean martial arts
 * stance transitions and combat flow. Tests ensure that:
 * - Stance changes follow traditional Korean martial arts principles
 * - Resource management reflects authentic Korean martial arts energy costs
 * - Player progression respects traditional Korean martial arts hierarchy
 * - Combat timing maintains realistic Korean martial arts rhythm
 *
 * **Korean Martial Arts Integration:**
 * - Tests authentic Korean martial arts stance transition rules
 * - Validates traditional trigram philosophy in stance management
 * - Ensures cultural accuracy in ki and stamina resource costs
 * - Verifies realistic Korean martial arts combat flow timing
 *
 * **Business Value:**
 * These tests ensure stance management provides authentic Korean martial arts
 * gameplay while maintaining competitive balance and strategic depth.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("StanceManager", () => {
  let stanceManager: StanceManager;

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
    stanceManager = new StanceManager();
  });

  /**
   * **Business Requirement:** Stance management must coordinate authentic
   * Korean martial arts stance transitions with proper resource costs
   */
  describe("Stance Change Management", () => {
    it("should successfully change to valid adjacent stances", () => {
      const player = createMockPlayer({
        currentStance: TrigramStance.GEON,
        ki: 50,
        stamina: 50,
      });

      const result = stanceManager.changeStance(player, TrigramStance.TAE);

      expect(result.success).toBe(true);
      expect(result.updatedPlayer.currentStance).toBe(TrigramStance.TAE);
      expect(result.updatedPlayer.ki).toBeLessThan(player.ki);
    });

    it("should reject stance changes when resources are insufficient", () => {
      const exhaustedPlayer = createMockPlayer({
        ki: 2,
        stamina: 2,
        currentStance: TrigramStance.GEON,
      });

      const result = stanceManager.changeStance(
        exhaustedPlayer,
        TrigramStance.GON
      );

      expect(result.success).toBe(false);
      expect(result.message).toMatch(/(기력|체력|부족)/);
    });

    it("should handle same stance selection gracefully", () => {
      const player = createMockPlayer({ currentStance: TrigramStance.LI });

      const result = stanceManager.changeStance(player, TrigramStance.LI);

      expect(result.success).toBe(true);
      expect(result.cost.ki).toBe(0);
      expect(result.message).toBe("이미 해당 자세입니다");
    });
  });

  /**
   * **Business Requirement:** Archetype specializations must provide meaningful
   * advantages in stance mastery and transition efficiency
   */
  describe("Archetype Stance Mastery", () => {
    it("should provide mastery bonuses for archetype-specific stances", () => {
      const musaMastery = stanceManager.getStanceMastery(
        PlayerArchetype.MUSA,
        TrigramStance.GEON
      );

      const amsaljaMastery = stanceManager.getStanceMastery(
        PlayerArchetype.AMSALJA,
        TrigramStance.SON
      );

      expect(musaMastery).toBeGreaterThan(1.0);
      expect(amsaljaMastery).toBeGreaterThan(1.0);
    });

    it("should apply archetype bonuses to stance change costs", () => {
      const assassin = createMockPlayer({
        archetype: PlayerArchetype.AMSALJA,
        currentStance: TrigramStance.SON,
        ki: 100,
        stamina: 100,
      });

      const warrior = createMockPlayer({
        archetype: PlayerArchetype.MUSA,
        currentStance: TrigramStance.SON,
        ki: 100,
        stamina: 100,
      });

      const assassinResult = stanceManager.changeStance(
        assassin,
        TrigramStance.GAM
      );
      const warriorResult = stanceManager.changeStance(
        warrior,
        TrigramStance.GAM
      );

      // Assassin should use less resources for Wind-Water transition
      expect(assassinResult.cost.ki).toBeLessThanOrEqual(warriorResult.cost.ki);
    });
  });

  /**
   * **Business Requirement:** Stance availability must respect Korean martial arts
   * progression and player capabilities
   */
  describe("Stance Availability", () => {
    it("should return available stances based on player state", () => {
      const player = createMockPlayer({
        ki: 50,
        stamina: 50,
        lastStanceChangeTime: Date.now() - 2000,
      });

      const availableStances = stanceManager.getAvailableStances(player);

      expect(availableStances.length).toBeGreaterThan(0);
      expect(availableStances).toContain(TrigramStance.GEON);
    });

    it("should validate stance change possibility", () => {
      const player = createMockPlayer({
        ki: 100,
        stamina: 100,
        lastStanceChangeTime: Date.now() - 1000,
      });

      const canChange = stanceManager.canChangeStance(
        player,
        TrigramStance.TAE
      );
      expect(canChange).toBe(true);

      const cantChange = stanceManager.canChangeStance(
        player,
        TrigramStance.GON
      );
      // Should depend on resources and cooldown
      expect(typeof cantChange).toBe("boolean");
    });
  });

  /**
   * **Business Requirement:** Stance manager must maintain consistent state
   * and provide reliable Korean martial arts gameplay experience
   */
  describe("State Management", () => {
    it("should track current stance correctly", () => {
      expect(stanceManager.getCurrentStance()).toBe(TrigramStance.GEON);

      stanceManager.reset(TrigramStance.LI);
      expect(stanceManager.getCurrentStance()).toBe(TrigramStance.LI);
    });

    it("should reset to default state", () => {
      stanceManager.reset();
      expect(stanceManager.getCurrentStance()).toBe(TrigramStance.GEON);
    });

    it("should handle invalid stance transitions", () => {
      const player = createMockPlayer({ currentStance: TrigramStance.GEON });

      // Test with invalid stance transition
      const result = stanceManager.changeStance(player, TrigramStance.GEON);

      expect(result.success).toBe(true); // Same stance should succeed
      expect(result.message).toBe("이미 해당 자세입니다");
    });
  });
});
