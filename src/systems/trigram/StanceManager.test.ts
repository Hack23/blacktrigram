import { describe, it, expect, beforeEach, vi as vitestVi } from "vitest";
import { StanceManager } from "./StanceManager";
import type {
  PlayerState,
  TrigramStance,
  TransitionPath,
  CombatReadiness,
  CombatState,
  // TrigramTransitionCost, // Unused
  // KoreanText, // Unused
} from "../../types";
import { STANCE_EFFECTIVENESS_MATRIX } from "../../types/constants";
import { TrigramCalculator } from "./TrigramCalculator"; // Import actual TrigramCalculator

// Mock PlayerState
const createMockPlayerState = (
  stance: TrigramStance,
  ki = 100,
  stamina = 100,
  lastStanceChangeTime = 0
): PlayerState => ({
  id: "player1",
  name: { korean: "테스트 플레이어", english: "Test Player" },
  archetype: "musa",
  position: { x: 0, y: 0 },
  currentStance: stance,
  facing: "right",
  health: 100,
  maxHealth: 100,
  ki,
  maxKi: 100,
  stamina,
  maxStamina: 100,
  consciousness: 100,
  pain: 0,
  balance: 100,
  bloodLoss: 0,
  lastStanceChangeTime,
  combatReadiness: "ready" as CombatReadiness,
  activeEffects: [],
  combatState: "idle" as CombatState,
  comboCount: 0,
  lastActionTime: 0,
  vitalPointDamage: {},
  bodyPartStatus: {
    head: "healthy",
    face_upper: "healthy",
    chest: "healthy",
    abdomen: "healthy",
    neck: "healthy",
    torso: "healthy",
    left_arm: "healthy",
    right_arm: "healthy",
    left_leg: "healthy",
    right_leg: "healthy",
  },
  knownTechniques: [],
  currentTargetId: null,
  attributes: {
    strength: 10,
    agility: 10,
    endurance: 10,
    intelligence: 10,
    focus: 10,
    resilience: 10,
  },
  skills: {
    striking: 10,
    kicking: 10,
    grappling: 10,
    weaponry: 0,
    meditation: 5,
    strategy: 5,
  },
});

describe("StanceManager", () => {
  let stanceManager: StanceManager;
  let playerState: PlayerState;
  let mockTrigramCalculator: TrigramCalculator; // Use actual TrigramCalculator instance

  beforeEach(() => {
    playerState = createMockPlayerState("geon");
    // Instantiate actual TrigramCalculator for more realistic tests, or a more detailed mock
    mockTrigramCalculator = new TrigramCalculator(
      // TRIGRAM_DATA, // TrigramCalculator uses imported TRIGRAM_DATA by default
      STANCE_EFFECTIVENESS_MATRIX // Pass effectiveness matrix if it's not default or for specific test setup
    );

    // Spy on methods if specific return values are needed for certain tests
    vitestVi.spyOn(mockTrigramCalculator, "calculateTransitionCost");
    vitestVi.spyOn(mockTrigramCalculator, "calculateOptimalPath");

    stanceManager = new StanceManager(mockTrigramCalculator);
  });

  afterEach(() => {
    vitestVi.restoreAllMocks(); // Clean up spies
  });

  it("should initialize with a TrigramCalculator", () => {
    expect(stanceManager).toBeDefined();
  });

  describe("changeStance", () => {
    it("should successfully change stance if conditions are met", () => {
      (mockTrigramCalculator.calculateTransitionCost as any).mockReturnValue({
        ki: 10,
        stamina: 5,
        timeMilliseconds: 300,
      });
      const result = stanceManager.changeStance(playerState, "tae");
      expect(result.success).toBe(true);
      expect(result.to).toBe("tae");
      expect(result.newState.currentStance).toBe("tae");
      expect(result.newState.ki).toBe(playerState.ki - 10);
      expect(result.newState.stamina).toBe(playerState.stamina - 5);
      expect(result.newState.lastStanceChangeTime).toBeGreaterThan(
        playerState.lastStanceChangeTime
      );
    });

    it("should fail to change stance if insufficient Ki", () => {
      playerState = createMockPlayerState("geon", 5, 100); // Low Ki
      (mockTrigramCalculator.calculateTransitionCost as any).mockReturnValue({
        // Mock the cost that would be calculated
        ki: 10,
        stamina: 5,
        timeMilliseconds: 300,
      });
      const result = stanceManager.changeStance(playerState, "tae");
      expect(result.success).toBe(false);
      expect(result.reason).toBe("insufficient_ki");
      expect(result.newState.currentStance).toBe("geon");
    });

    it("should fail to change stance if on cooldown", () => {
      const now = Date.now();
      playerState = createMockPlayerState("geon", 100, 100, now - 100); // Changed stance 100ms ago

      // No need to mock calculateTransitionCost here as cooldown check is first
      // vitestVi.spyOn(Date, 'now').mockReturnValue(now); // Keep Date.now consistent for test

      const result = stanceManager.changeStance(playerState, "li");
      expect(result.success).toBe(false);
      expect(result.reason).toBe("Stance change on cooldown");

      // vitestVi.spyOn(Date, 'now').mockRestore();
    });

    it("should allow stance change if cooldown has passed", () => {
      const now = Date.now();
      playerState = createMockPlayerState("geon", 100, 100, now - 1000); // Changed stance 1s ago (cooldown is 500ms)
      (mockTrigramCalculator.calculateTransitionCost as any).mockReturnValue({
        ki: 10,
        stamina: 5,
        timeMilliseconds: 300,
      });
      // vitestVi.spyOn(Date, 'now').mockReturnValue(now);

      const result = stanceManager.changeStance(playerState, "tae");
      expect(result.success).toBe(true);
      expect(result.newState.currentStance).toBe("tae");
      // vitestVi.spyOn(Date, 'now').mockRestore();
    });
  });

  describe("canTransitionTo", () => {
    it("should return true if transition is possible", () => {
      (mockTrigramCalculator.calculateTransitionCost as any).mockReturnValue({
        ki: 10,
        stamina: 5,
        timeMilliseconds: 300,
      });
      const canTransition = stanceManager.canTransitionTo(playerState, "tae");
      expect(canTransition.possible).toBe(true);
      expect(canTransition.cost).toBeDefined();
    });

    it("should return false and reason if transition is not possible (e.g. insufficient Ki)", () => {
      playerState = createMockPlayerState("geon", 5, 100); // Low Ki
      (mockTrigramCalculator.calculateTransitionCost as any).mockReturnValue({
        ki: 10, // Cost exceeds player's Ki
        stamina: 5,
        timeMilliseconds: 300,
      });
      const canTransition = stanceManager.canTransitionTo(playerState, "tae");
      expect(canTransition.possible).toBe(false);
      expect(canTransition.reason).toBe("insufficient_ki");
    });
  });

  describe("findOptimalStancePath", () => {
    it("should call TrigramCalculator's calculateOptimalPath and return its result", () => {
      const mockPathData: TransitionPath = {
        path: ["geon", "tae"],
        totalCost: { ki: 15, stamina: 10, timeMilliseconds: 500 },
        overallEffectiveness: 1.2,
        cumulativeRisk: 0.1,
        name: "Geon -> Tae",
        description: { korean: "건에서 태로", english: "Geon to Tae" }, // This is now valid
      };
      (mockTrigramCalculator.calculateOptimalPath as any).mockReturnValue(
        mockPathData
      );

      const targetStance: TrigramStance = "tae";
      const pathResult = stanceManager.findOptimalStancePath(
        playerState,
        targetStance, // Pass targetStance
        3
      );

      expect(pathResult).toEqual(mockPathData);
      expect(mockTrigramCalculator.calculateOptimalPath).toHaveBeenCalledWith(
        playerState.currentStance,
        targetStance,
        playerState
        // 3 // Max depth argument if calculateOptimalPath uses it
      );
    });
  });
});
