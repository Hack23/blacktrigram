import { beforeEach, describe, expect, it } from "vitest";
import type { PlayerState } from "../../types";
import { PlayerArchetype, TrigramStance } from "../../types/common";
import { createPlayerFromArchetype } from "../../utils/playerUtils";
import { StanceManager } from "./StanceManager";

describe("StanceManager", () => {
  let stanceManager: StanceManager;
  let player: PlayerState;

  beforeEach(() => {
    stanceManager = new StanceManager();
    player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  });

  it("should initialize with no active stance", () => {
    expect(stanceManager.getCurrent()).toBeUndefined();
  });

  describe("changeStance", () => {
    it("should successfully change to a different stance", () => {
      const newStance = TrigramStance.TAE;
      const result = stanceManager.changeStance(player, newStance);

      expect(result.success).toBe(true);
      expect(result.updatedPlayer.currentStance).toBe(newStance);
      expect(result.updatedPlayer.lastStanceChangeTime).toBeGreaterThan(0);
    });

    it("should consume resources when changing stance", () => {
      const originalKi = player.ki;
      const originalStamina = player.stamina;

      const result = stanceManager.changeStance(player, TrigramStance.LI);

      if (result.success) {
        expect(result.updatedPlayer.ki).toBeLessThanOrEqual(originalKi);
        expect(result.updatedPlayer.stamina).toBeLessThanOrEqual(
          originalStamina
        );
      }
    });

    it("should fail if player lacks resources", () => {
      // Fix: Create new player with low resources
      const lowResourcePlayer: PlayerState = {
        ...player,
        ki: 1,
        stamina: 1,
      };

      const result = stanceManager.changeStance(
        lowResourcePlayer,
        TrigramStance.GON
      );

      expect(result.success).toBe(false);
      expect(result.updatedPlayer.currentStance).toBe(
        lowResourcePlayer.currentStance
      );
    });

    it("should handle same stance gracefully", () => {
      const result = stanceManager.changeStance(player, player.currentStance);

      expect(result.success).toBe(true);
      expect(result.cost.ki).toBe(0);
      expect(result.cost.stamina).toBe(0);
    });
  });

  describe("canChangeStance", () => {
    it("should return true for valid stance changes", () => {
      const canChange = stanceManager.canChangeStance(
        player,
        TrigramStance.TAE
      );

      expect(canChange).toBe(true);
    });

    it("should return false for insufficient resources", () => {
      const lowResourcePlayer = {
        ...player,
        ki: 0,
        stamina: 0,
      };

      const canChange = stanceManager.canChangeStance(
        lowResourcePlayer,
        TrigramStance.GAM
      );

      expect(canChange).toBe(false);
    });

    it("should respect cooldown periods", () => {
      const recentChangePlayer = {
        ...player,
        lastStanceChangeTime: Date.now() - 50, // Recent change
      };

      const canChange = stanceManager.canChangeStance(
        recentChangePlayer,
        TrigramStance.TAE
      );

      // Should respect cooldown
      expect(canChange).toBe(false);
    });
  });

  describe("getStanceTransitionCost", () => {
    it("should return zero cost for same stance", () => {
      const cost = stanceManager.getStanceTransitionCost(
        player.currentStance,
        player.currentStance,
        player
      );

      expect(cost.ki).toBe(0);
      expect(cost.stamina).toBe(0);
      expect(cost.timeMilliseconds).toBe(0); // Fix: Use timeMilliseconds
    });

    it("should calculate cost for different stances", () => {
      const cost = stanceManager.getStanceTransitionCost(
        TrigramStance.GEON,
        TrigramStance.GON,
        player
      );

      expect(cost.ki).toBeGreaterThan(0);
      expect(cost.stamina).toBeGreaterThan(0);
      expect(cost.timeMilliseconds).toBeGreaterThan(0); // Fix: Use timeMilliseconds
    });

    it("should apply archetype modifiers", () => {
      const musaCost = stanceManager.getStanceTransitionCost(
        TrigramStance.GEON,
        TrigramStance.GAN, // MUSA favored stance
        player
      );

      const hacker = createPlayerFromArchetype(PlayerArchetype.HACKER, 1);
      const hackerCost = stanceManager.getStanceTransitionCost(
        TrigramStance.GEON,
        TrigramStance.GAN,
        hacker
      );

      // MUSA should have lower cost for favored stances
      expect(musaCost.ki).toBeLessThanOrEqual(hackerCost.ki);
    });
  });

  describe("getOptimalStance", () => {
    it("should recommend stance based on opponent", () => {
      // Fix: Create new player instead of modifying readonly property
      const opponent: PlayerState = {
        ...createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1),
        currentStance: TrigramStance.SON,
      };

      const recommendation = stanceManager.getOptimalStance(player, opponent);

      expect(Object.values(TrigramStance)).toContain(recommendation);
    });

    it("should consider player archetype preferences", () => {
      const recommendation = stanceManager.getOptimalStance(player);

      expect(Object.values(TrigramStance)).toContain(recommendation);
    });
  });

  describe("Laterality Support", () => {
    it("should initialize with right laterality by default", () => {
      expect(stanceManager.getCurrentLaterality()).toBe("right");
    });

    it("should switch stance side successfully", () => {
      const result = stanceManager.switchStanceSide(player, "right");

      expect(result.success).toBe(true);
      expect(result.laterality).toBe("left");
      expect(stanceManager.getCurrentLaterality()).toBe("left");
    });

    it("should toggle between left and right", () => {
      // First switch: right -> left
      const firstSwitch = stanceManager.switchStanceSide(player, "right");
      expect(firstSwitch.laterality).toBe("left");

      // Wait for cooldown to expire
      const playerAfterCooldown: PlayerState = {
        ...firstSwitch.updatedPlayer,
        lastStanceChangeTime: Date.now() - 600, // 600ms ago (> 500ms cooldown)
      };

      // Second switch: left -> right
      const secondSwitch = stanceManager.switchStanceSide(playerAfterCooldown, "left");
      expect(secondSwitch.success).toBe(true);
      expect(secondSwitch.laterality).toBe("right");
      expect(stanceManager.getCurrentLaterality()).toBe("right");
    });

    it("should cost 2 stamina for stance side switch", () => {
      const originalStamina = player.stamina;
      const result = stanceManager.switchStanceSide(player, "right");

      expect(result.success).toBe(true);
      expect(result.cost.stamina).toBe(2);
      expect(result.cost.ki).toBe(0);
      expect(result.updatedPlayer.stamina).toBe(originalStamina - 2);
    });

    it("should take 400ms for stance side switch", () => {
      const result = stanceManager.switchStanceSide(player, "right");

      expect(result.success).toBe(true);
      expect(result.cost.timeMilliseconds).toBe(400);
    });

    it("should fail if player has insufficient stamina", () => {
      const lowStaminaPlayer: PlayerState = {
        ...player,
        stamina: 1,
      };

      const result = stanceManager.switchStanceSide(lowStaminaPlayer, "right");

      expect(result.success).toBe(false);
      expect(result.message).toContain("Insufficient stamina");
      expect(stanceManager.getCurrentLaterality()).toBe("right"); // Should not change
    });

    it("should respect cooldown period", () => {
      // First switch
      const firstResult = stanceManager.switchStanceSide(player, "right");
      expect(firstResult.success).toBe(true);

      // Immediate second switch (should fail due to cooldown)
      const secondResult = stanceManager.switchStanceSide(firstResult.updatedPlayer, "left");
      expect(secondResult.success).toBe(false);
      expect(secondResult.message).toContain("cooldown");
    });

    it("should include laterality in stance change results", () => {
      const result = stanceManager.changeStance(player, TrigramStance.TAE);

      expect(result.laterality).toBe("right"); // Default laterality
    });

    it("should maintain laterality when changing trigram stance", () => {
      // Switch to left laterality
      const lateralitySwitch = stanceManager.switchStanceSide(player, "right");
      expect(lateralitySwitch.laterality).toBe("left");

      // Wait for cooldown
      const updatedPlayer: PlayerState = {
        ...lateralitySwitch.updatedPlayer,
        lastStanceChangeTime: Date.now() - 600, // 600ms ago
      };

      // Change trigram stance
      const stanceChange = stanceManager.changeStance(updatedPlayer, TrigramStance.LI);
      
      // Laterality should remain left
      expect(stanceChange.laterality).toBe("left");
      expect(stanceManager.getCurrentLaterality()).toBe("left");
    });

    it("should allow stance side switch and stance change independently", () => {
      // Change stance first
      const stanceChange = stanceManager.changeStance(player, TrigramStance.TAE);
      expect(stanceChange.success).toBe(true);
      expect(stanceManager.getCurrent()).toBe(TrigramStance.TAE);

      // Wait for cooldown
      const updatedPlayer: PlayerState = {
        ...stanceChange.updatedPlayer,
        lastStanceChangeTime: Date.now() - 600,
      };

      // Switch laterality
      const lateralitySwitch = stanceManager.switchStanceSide(updatedPlayer, "right");
      expect(lateralitySwitch.success).toBe(true);
      expect(lateralitySwitch.laterality).toBe("left");
      
      // Stance should remain TAE
      expect(stanceManager.getCurrent()).toBe(TrigramStance.TAE);
    });
  });
});
