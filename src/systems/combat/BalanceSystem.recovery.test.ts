/**
 * Tests for Balance System Recovery Functions
 * 
 * Validates recovery-related functionality including:
 * - Grounded state detection
 * - Ground state extraction
 * - Stamina cost checking
 * - Damage reduction during recovery
 * 
 * @module systems/combat/BalanceSystem.recovery.test
 * @category Combat System Tests
 * @korean 균형시스템회복테스트
 */

import { describe, it, expect, beforeEach } from "vitest";
import { BalanceSystem } from "./BalanceSystem";
import { PlayerState } from "../player";
import { TrigramStance, PlayerArchetype, CombatState } from "@/types";

describe("BalanceSystem - Recovery Functions", () => {
  let balanceSystem: BalanceSystem;
  let mockPlayer: PlayerState;

  beforeEach(() => {
    balanceSystem = new BalanceSystem();
    
    // Create mock player with sufficient stamina
    mockPlayer = {
      id: "test-player",
      name: { korean: "테스트", english: "Test" },
      archetype: PlayerArchetype.MUSA,
      health: 100,
      maxHealth: 100,
      ki: 100,
      maxKi: 100,
      stamina: 50, // Sufficient for roll recovery (costs 20)
      maxStamina: 100,
      energy: 100,
      maxEnergy: 100,
      attackPower: 10,
      defense: 10,
      speed: 10,
      technique: 10,
      pain: 0,
      consciousness: 100,
      balance: 50,
      momentum: 0,
      currentStance: TrigramStance.GEON,
      combatState: CombatState.IDLE,
      position: { x: 0, y: 0 },
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
    };
  });

  describe("isGrounded", () => {
    it("should return true for ground_prone animation state", () => {
      expect(balanceSystem.isGrounded("ground_prone")).toBe(true);
    });

    it("should return true for ground_supine animation state", () => {
      expect(balanceSystem.isGrounded("ground_supine")).toBe(true);
    });

    it("should return true for ground_side_left animation state", () => {
      expect(balanceSystem.isGrounded("ground_side_left")).toBe(true);
    });

    it("should return true for ground_side_right animation state", () => {
      expect(balanceSystem.isGrounded("ground_side_right")).toBe(true);
    });

    it("should return false for idle animation state", () => {
      expect(balanceSystem.isGrounded("idle")).toBe(false);
    });

    it("should return false for attack animation state", () => {
      expect(balanceSystem.isGrounded("attack")).toBe(false);
    });

    it("should return false for fall animation states", () => {
      expect(balanceSystem.isGrounded("fall_forward")).toBe(false);
      expect(balanceSystem.isGrounded("fall_backward")).toBe(false);
      expect(balanceSystem.isGrounded("fall_side_left")).toBe(false);
      expect(balanceSystem.isGrounded("fall_side_right")).toBe(false);
    });

    it("should return false for recovery animation states", () => {
      expect(balanceSystem.isGrounded("recovery_prone_standup")).toBe(false);
      expect(balanceSystem.isGrounded("recovery_supine_standup")).toBe(false);
      expect(balanceSystem.isGrounded("recovery_roll")).toBe(false);
      expect(balanceSystem.isGrounded("recovery_defensive")).toBe(false);
    });
  });

  describe("getGroundState", () => {
    it("should return 'prone' for ground_prone animation state", () => {
      expect(balanceSystem.getGroundState("ground_prone")).toBe("prone");
    });

    it("should return 'supine' for ground_supine animation state", () => {
      expect(balanceSystem.getGroundState("ground_supine")).toBe("supine");
    });

    it("should return 'side_left' for ground_side_left animation state", () => {
      expect(balanceSystem.getGroundState("ground_side_left")).toBe("side_left");
    });

    it("should return 'side_right' for ground_side_right animation state", () => {
      expect(balanceSystem.getGroundState("ground_side_right")).toBe("side_right");
    });

    it("should return null for non-ground animation states", () => {
      expect(balanceSystem.getGroundState("idle")).toBeNull();
      expect(balanceSystem.getGroundState("attack")).toBeNull();
      expect(balanceSystem.getGroundState("defend")).toBeNull();
      expect(balanceSystem.getGroundState("walk")).toBeNull();
    });

    it("should return null for fall animation states", () => {
      expect(balanceSystem.getGroundState("fall_forward")).toBeNull();
      expect(balanceSystem.getGroundState("fall_backward")).toBeNull();
      expect(balanceSystem.getGroundState("fall_side_left")).toBeNull();
      expect(balanceSystem.getGroundState("fall_side_right")).toBeNull();
    });

    it("should return null for recovery animation states", () => {
      expect(balanceSystem.getGroundState("recovery_prone_standup")).toBeNull();
      expect(balanceSystem.getGroundState("recovery_supine_standup")).toBeNull();
      expect(balanceSystem.getGroundState("recovery_roll")).toBeNull();
      expect(balanceSystem.getGroundState("recovery_defensive")).toBeNull();
    });
  });

  describe("canRecoverWithType", () => {
    it("should return true for prone_standup with any stamina (no cost)", () => {
      const lowStaminaPlayer = { ...mockPlayer, stamina: 5 };
      expect(balanceSystem.canRecoverWithType(lowStaminaPlayer, "prone_standup")).toBe(true);
    });

    it("should return true for supine_standup with any stamina (no cost)", () => {
      const lowStaminaPlayer = { ...mockPlayer, stamina: 5 };
      expect(balanceSystem.canRecoverWithType(lowStaminaPlayer, "supine_standup")).toBe(true);
    });

    it("should return true for defensive_getup with any stamina (no cost)", () => {
      const lowStaminaPlayer = { ...mockPlayer, stamina: 5 };
      expect(balanceSystem.canRecoverWithType(lowStaminaPlayer, "defensive_getup")).toBe(true);
    });

    it("should return true for roll_recovery with sufficient stamina (costs 20)", () => {
      const sufficientStaminaPlayer = { ...mockPlayer, stamina: 20 };
      expect(balanceSystem.canRecoverWithType(sufficientStaminaPlayer, "roll_recovery")).toBe(true);
    });

    it("should return false for roll_recovery with insufficient stamina", () => {
      const insufficientStaminaPlayer = { ...mockPlayer, stamina: 15 };
      expect(balanceSystem.canRecoverWithType(insufficientStaminaPlayer, "roll_recovery")).toBe(false);
    });

    it("should return false for roll_recovery with zero stamina", () => {
      const zeroStaminaPlayer = { ...mockPlayer, stamina: 0 };
      expect(balanceSystem.canRecoverWithType(zeroStaminaPlayer, "roll_recovery")).toBe(false);
    });

    it("should return true for roll_recovery with exactly 20 stamina", () => {
      const exactStaminaPlayer = { ...mockPlayer, stamina: 20 };
      expect(balanceSystem.canRecoverWithType(exactStaminaPlayer, "roll_recovery")).toBe(true);
    });
  });

  describe("applyRecoveryCost", () => {
    it("should not change stamina for prone_standup (no cost)", () => {
      const result = balanceSystem.applyRecoveryCost(mockPlayer, "prone_standup");
      expect(result.stamina).toBe(mockPlayer.stamina);
    });

    it("should not change stamina for supine_standup (no cost)", () => {
      const result = balanceSystem.applyRecoveryCost(mockPlayer, "supine_standup");
      expect(result.stamina).toBe(mockPlayer.stamina);
    });

    it("should not change stamina for defensive_getup (no cost)", () => {
      const result = balanceSystem.applyRecoveryCost(mockPlayer, "defensive_getup");
      expect(result.stamina).toBe(mockPlayer.stamina);
    });

    it("should deduct 20 stamina for roll_recovery", () => {
      const result = balanceSystem.applyRecoveryCost(mockPlayer, "roll_recovery");
      expect(result.stamina).toBe(mockPlayer.stamina - 20);
      expect(result.stamina).toBe(30);
    });

    it("should not allow stamina to go below zero", () => {
      const lowStaminaPlayer = { ...mockPlayer, stamina: 10 };
      const result = balanceSystem.applyRecoveryCost(lowStaminaPlayer, "roll_recovery");
      expect(result.stamina).toBe(0);
    });

    it("should maintain other player properties", () => {
      const result = balanceSystem.applyRecoveryCost(mockPlayer, "roll_recovery");
      expect(result.health).toBe(mockPlayer.health);
      expect(result.ki).toBe(mockPlayer.ki);
      expect(result.balance).toBe(mockPlayer.balance);
      expect(result.id).toBe(mockPlayer.id);
    });
  });

  describe("getRecoveryDamageMultiplier", () => {
    it("should return 1.0 for prone_standup during vulnerable frames (no reduction)", () => {
      const multiplier = balanceSystem.getRecoveryDamageMultiplier("prone_standup", 10);
      expect(multiplier).toBe(1.0);
    });

    it("should return 1.0 for supine_standup during vulnerable frames (no reduction)", () => {
      const multiplier = balanceSystem.getRecoveryDamageMultiplier("supine_standup", 15);
      expect(multiplier).toBe(1.0);
    });

    it("should return 1.0 for roll_recovery during vulnerable frames (no reduction)", () => {
      const multiplier = balanceSystem.getRecoveryDamageMultiplier("roll_recovery", 10);
      expect(multiplier).toBe(1.0);
    });

    it("should return 0.5 for defensive_getup during vulnerable frames (50% reduction)", () => {
      const multiplier = balanceSystem.getRecoveryDamageMultiplier("defensive_getup", 20);
      expect(multiplier).toBe(0.5);
    });

    it("should return 1.0 for prone_standup during non-vulnerable frames", () => {
      // Last 6 frames (24-30) are not vulnerable
      const multiplier = balanceSystem.getRecoveryDamageMultiplier("prone_standup", 25);
      expect(multiplier).toBe(1.0);
    });

    it("should return 1.0 for defensive_getup during non-vulnerable frames", () => {
      // Last 6 frames (36-42) are not vulnerable
      const multiplier = balanceSystem.getRecoveryDamageMultiplier("defensive_getup", 37);
      expect(multiplier).toBe(1.0);
    });
  });

  describe("Integration - Ground State to Recovery", () => {
    it("should provide correct recovery path for prone ground state", () => {
      const animState = "ground_prone";
      
      expect(balanceSystem.isGrounded(animState)).toBe(true);
      
      const groundState = balanceSystem.getGroundState(animState);
      expect(groundState).toBe("prone");
      
      // Can recover with prone_standup (no stamina cost)
      expect(balanceSystem.canRecoverWithType(mockPlayer, "prone_standup")).toBe(true);
    });

    it("should provide correct recovery path for supine ground state", () => {
      const animState = "ground_supine";
      
      expect(balanceSystem.isGrounded(animState)).toBe(true);
      
      const groundState = balanceSystem.getGroundState(animState);
      expect(groundState).toBe("supine");
      
      // Can recover with supine_standup (no stamina cost)
      expect(balanceSystem.canRecoverWithType(mockPlayer, "supine_standup")).toBe(true);
    });

    it("should provide correct recovery path for side ground states", () => {
      const animStateLeft = "ground_side_left";
      const animStateRight = "ground_side_right";
      
      expect(balanceSystem.isGrounded(animStateLeft)).toBe(true);
      expect(balanceSystem.isGrounded(animStateRight)).toBe(true);
      
      const groundStateLeft = balanceSystem.getGroundState(animStateLeft);
      const groundStateRight = balanceSystem.getGroundState(animStateRight);
      expect(groundStateLeft).toBe("side_left");
      expect(groundStateRight).toBe("side_right");
      
      // Can recover with roll_recovery if stamina sufficient
      expect(balanceSystem.canRecoverWithType(mockPlayer, "roll_recovery")).toBe(true);
    });

    it("should handle low stamina scenario for roll recovery", () => {
      const lowStaminaPlayer = { ...mockPlayer, stamina: 15 };
      const animState = "ground_side_left";
      
      expect(balanceSystem.isGrounded(animState)).toBe(true);
      
      // Cannot use roll recovery due to insufficient stamina
      expect(balanceSystem.canRecoverWithType(lowStaminaPlayer, "roll_recovery")).toBe(false);
      
      // But can use defensive_getup as fallback
      expect(balanceSystem.canRecoverWithType(lowStaminaPlayer, "defensive_getup")).toBe(true);
    });
  });
});
