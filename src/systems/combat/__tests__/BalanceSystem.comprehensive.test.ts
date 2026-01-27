/**
 * Comprehensive Unit Tests for Balance System
 *
 * Tests all new balance system mechanics:
 * - Stance transition vulnerability (0.5s window, 1.5x damage)
 * - Dynamic balance calculation (body part damage)
 * - Knockback resistance (stance-based)
 * - Rapid stance change penalty (>2 changes in 3s = 20% penalty)
 * - Combined vulnerability multipliers
 * - Edge cases and boundary conditions
 *
 * @module systems/combat/__tests__/BalanceSystem.comprehensive.test
 * @category Combat System
 * @korean 균형시스템종합테스트
 */

import { describe, expect, it, beforeEach } from "vitest";
import { createMockPlayerState } from "../../../test/test-utils";
import { TrigramStance, BodyRegion } from "../../../types";
import type { PlayerState } from "../../player";
import BalanceSystem, { type BalancePlayerState } from "../BalanceSystem";

// Helper to create test player state with balance features
function createBalancePlayerState(
  overrides: Partial<BalancePlayerState> = {}
): BalancePlayerState {
  const base = createMockPlayerState({
    balance: 100,
    stamina: 100,
    maxStamina: 100,
    currentStance: TrigramStance.GEON,
    ...overrides,
  });

  return {
    ...base,
    transitionState: overrides.transitionState,
    stanceChangeHistory: overrides.stanceChangeHistory || [],
    rapidChangePenaltyEnd: overrides.rapidChangePenaltyEnd,
    bodyPartHealth: overrides.bodyPartHealth,
    bodyPartMaxHealth: overrides.bodyPartMaxHealth,
  };
}

describe("BalanceSystem - Comprehensive Tests", () => {
  let system: BalanceSystem;
  let currentTime: number;

  beforeEach(() => {
    system = new BalanceSystem();
    currentTime = Date.now();
  });

  describe("Stance Transition Vulnerability", () => {
    it("should create transition state when starting stance change", () => {
      const player = createBalancePlayerState({
        currentStance: TrigramStance.GEON,
      });

      const result = system.startStanceTransition(
        player,
        TrigramStance.GAM,
        currentTime
      );

      expect(result.transitionState).toBeDefined();
      expect(result.transitionState?.isTransitioning).toBe(true);
      expect(result.transitionState?.vulnerabilityMultiplier).toBe(1.5);
      expect(result.transitionState?.fromStance).toBe(TrigramStance.GEON);
      expect(result.transitionState?.toStance).toBe(TrigramStance.GAM);
      expect(result.currentStance).toBe(TrigramStance.GAM);
    });

    it("should maintain 1.5x damage multiplier during transition", () => {
      let player = createBalancePlayerState({
        currentStance: TrigramStance.GEON,
      });

      player = system.startStanceTransition(
        player,
        TrigramStance.GAM,
        currentTime
      );

      const multiplier = system.getTotalVulnerabilityMultiplier(player);
      expect(multiplier).toBe(1.5); // 1.0 base * 1.5 transition
    });

    it("should end transition after 0.5 seconds (500ms)", () => {
      let player = createBalancePlayerState({
        currentStance: TrigramStance.GEON,
      });

      // Start transition
      player = system.startStanceTransition(
        player,
        TrigramStance.GAM,
        currentTime
      );

      // 400ms later - still transitioning
      player = system.updateTransition(player, currentTime + 400);
      expect(player.transitionState?.isTransitioning).toBe(true);

      // 500ms later - transition complete
      player = system.updateTransition(player, currentTime + 500);
      expect(player.transitionState?.isTransitioning).toBe(false);
      expect(player.transitionState?.vulnerabilityMultiplier).toBe(1.0);
    });

    it("should combine transition vulnerability with balance state vulnerability", () => {
      let player = createBalancePlayerState({
        balance: 30, // Off-balance: 1.5x base vulnerability
        currentStance: TrigramStance.GEON,
      });

      player = system.startStanceTransition(
        player,
        TrigramStance.GAM,
        currentTime
      );

      const multiplier = system.getTotalVulnerabilityMultiplier(player);
      expect(multiplier).toBe(1.5 * 1.5); // 2.25x total vulnerability
    });

    it("should track stance change history", () => {
      let player = createBalancePlayerState({
        currentStance: TrigramStance.GEON,
      });

      // First change
      player = system.startStanceTransition(
        player,
        TrigramStance.GAM,
        currentTime
      );
      expect(player.stanceChangeHistory?.length).toBe(1);

      // Second change
      player = system.startStanceTransition(
        player,
        TrigramStance.LI,
        currentTime + 1000
      );
      expect(player.stanceChangeHistory?.length).toBe(2);

      // Verify history content
      expect(player.stanceChangeHistory?.[0].fromStance).toBe(TrigramStance.GEON);
      expect(player.stanceChangeHistory?.[0].toStance).toBe(TrigramStance.GAM);
      expect(player.stanceChangeHistory?.[1].fromStance).toBe(TrigramStance.GAM);
      expect(player.stanceChangeHistory?.[1].toStance).toBe(TrigramStance.LI);
    });

    it("should limit stance change history to last 5 changes", () => {
      let player = createBalancePlayerState({
        currentStance: TrigramStance.GEON,
      });

      // Make 7 stance changes
      const stances = [TrigramStance.GAM, TrigramStance.LI, TrigramStance.JIN, 
                       TrigramStance.SON, TrigramStance.GAN, TrigramStance.GON, TrigramStance.TAE];
      
      for (let i = 0; i < stances.length; i++) {
        player = system.startStanceTransition(player, stances[i], currentTime + i * 100);
      }

      // Should only keep last 5
      expect(player.stanceChangeHistory?.length).toBe(5);
    });
  });

  describe("Dynamic Balance Calculation (Body Part Damage)", () => {
    it("should return 1.0 modifier with no body part damage", () => {
      const player = createBalancePlayerState({
        bodyPartHealth: {
          legLeft: 100,
          legRight: 100,
          torsoLower: 100,
          head: 100,
          neck: 100,
          torsoUpper: 100,
          armLeft: 100,
          armRight: 100,
        },
        bodyPartMaxHealth: {
          legLeft: 100,
          legRight: 100,
          torsoLower: 100,
          head: 100,
          neck: 100,
          torsoUpper: 100,
          armLeft: 100,
          armRight: 100,
        },
      });

      const modifier = system.calculateBalanceModifier(player);
      expect(modifier).toBeCloseTo(1.0, 2);
    });

    it("should reduce balance with leg damage (10-30% reduction)", () => {
      const player = createBalancePlayerState({
        bodyPartHealth: {
          head: 50,
          neck: 50,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 50,
          armRight: 50,
          legLeft: 50,
          legRight: 50,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      });

      const modifier = system.calculateBalanceModifier(player);
      
      // 50% leg health = 0.85 leg modifier (0.7 + 0.5 * 0.3)
      // 100% torso = 1.0 torso modifier
      // Combined: 0.85 * 1.0 = 0.85
      expect(modifier).toBeCloseTo(0.85, 2);
    });

    it("should apply minimum 50% balance with severe leg damage", () => {
      const player = createBalancePlayerState({
        bodyPartHealth: {
          head: 0,
          neck: 0,
          torsoUpper: 50,
          torsoLower: 50,
          armLeft: 0,
          armRight: 0,
          legLeft: 0,
          legRight: 0,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      });

      const modifier = system.calculateBalanceModifier(player);
      
      // 0% leg health = 0.7 leg modifier
      // 50% torso = 0.95 torso modifier
      // Combined: 0.7 * 0.95 = 0.665, but clamped to min 0.5
      expect(modifier).toBeGreaterThanOrEqual(0.5);
    });

    it("should consider both legs equally for balance", () => {
      const player1 = createBalancePlayerState({
        bodyPartHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 0,
          legLeft: 100,
          legRight: 0,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      });

      const player2 = createBalancePlayerState({
        bodyPartHealth: {
          head: 50,
          neck: 50,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 50,
          armRight: 50,
          legLeft: 50,
          legRight: 50,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      });

      // Both should have same avg leg health (50%)
      const modifier1 = system.calculateBalanceModifier(player1);
      const modifier2 = system.calculateBalanceModifier(player2);
      expect(modifier1).toBeCloseTo(modifier2, 2);
    });

    it("should integrate body damage with balance disruption", () => {
      const player = createBalancePlayerState({
        balance: 100,
        bodyPartHealth: {
          head: 30,
          neck: 30,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 30,
          armRight: 30,
          legLeft: 30,
          legRight: 30,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      });

      // Leg sweep with damaged legs should cause more balance loss
      const result = system.disruptBalance(
        player,
        20,
        BodyRegion.LEFT_LEG,
        currentTime
      );

      // With 30% leg health, modifier ~0.79
      // Balance loss is amplified: 20 * 2.5 (leg mult) * 0.6 (sens) * (1/0.79)
      expect(result.balance).toBeLessThan(100);
      expect(result.balance).toBeGreaterThan(50); // But not catastrophic
    });
  });

  describe("Knockback Resistance (Stance-based)", () => {
    it("should provide +50% resistance for defensive stances (Mountain, Earth)", () => {
      const ganResistance = system.getKnockbackResistance(TrigramStance.GAN); // Mountain
      const gonResistance = system.getKnockbackResistance(TrigramStance.GON); // Earth

      expect(ganResistance).toBe(1.5);
      expect(gonResistance).toBe(1.5);
    });

    it("should provide -30% resistance for offensive stances (Heaven, Fire, Thunder)", () => {
      const geonResistance = system.getKnockbackResistance(TrigramStance.GEON); // Heaven
      const liResistance = system.getKnockbackResistance(TrigramStance.LI); // Fire
      const jinResistance = system.getKnockbackResistance(TrigramStance.JIN); // Thunder

      expect(geonResistance).toBe(0.7);
      expect(liResistance).toBe(0.7);
      expect(jinResistance).toBe(0.7);
    });

    it("should provide normal resistance for balanced stances (Water, Wind, Lake)", () => {
      const gamResistance = system.getKnockbackResistance(TrigramStance.GAM); // Water
      const sonResistance = system.getKnockbackResistance(TrigramStance.SON); // Wind
      const taeResistance = system.getKnockbackResistance(TrigramStance.TAE); // Lake

      expect(gamResistance).toBe(1.0);
      expect(sonResistance).toBe(1.0);
      expect(taeResistance).toBe(1.0);
    });
  });

  describe("Rapid Stance Change Penalty", () => {
    it("should not apply penalty for 2 changes in 3 seconds", () => {
      let player = createBalancePlayerState({
        currentStance: TrigramStance.GEON,
      });

      // First change
      player = system.startStanceTransition(player, TrigramStance.GAM, currentTime);
      
      // Second change (within 3s)
      player = system.startStanceTransition(player, TrigramStance.LI, currentTime + 1000);

      expect(player.rapidChangePenaltyEnd).toBeUndefined();
      expect(system.isRapidChangePenaltyActive(player, currentTime + 1000)).toBe(false);
    });

    it("should apply 20% penalty for >2 changes in 3 seconds", () => {
      let player = createBalancePlayerState({
        currentStance: TrigramStance.GEON,
      });

      // First change
      player = system.startStanceTransition(player, TrigramStance.GAM, currentTime);
      
      // Second change
      player = system.startStanceTransition(player, TrigramStance.LI, currentTime + 500);
      
      // Third change (triggers penalty)
      player = system.startStanceTransition(player, TrigramStance.JIN, currentTime + 1000);

      expect(player.rapidChangePenaltyEnd).toBeDefined();
      expect(player.rapidChangePenaltyEnd).toBe(currentTime + 1000 + 2000); // +2s penalty
      expect(system.isRapidChangePenaltyActive(player, currentTime + 1000)).toBe(true);
    });

    it("should clear penalty after 2 seconds", () => {
      let player = createBalancePlayerState({
        currentStance: TrigramStance.GEON,
      });

      // Trigger penalty with 3 rapid changes
      player = system.startStanceTransition(player, TrigramStance.GAM, currentTime);
      player = system.startStanceTransition(player, TrigramStance.LI, currentTime + 500);
      player = system.startStanceTransition(player, TrigramStance.JIN, currentTime + 1000);

      // Check penalty is active
      expect(system.isRapidChangePenaltyActive(player, currentTime + 1500)).toBe(true);

      // Check penalty cleared after 2s
      expect(system.isRapidChangePenaltyActive(player, currentTime + 3100)).toBe(false);
    });

    it("should increase balance loss by 20% when penalty is active", () => {
      let player = createBalancePlayerState({
        balance: 100,
        currentStance: TrigramStance.GEON,
      });

      // Trigger penalty with 3 rapid changes
      player = system.startStanceTransition(player, TrigramStance.GAM, currentTime);
      player = system.startStanceTransition(player, TrigramStance.LI, currentTime + 500);
      player = system.startStanceTransition(player, TrigramStance.JIN, currentTime + 1000);

      // Apply balance disruption with penalty active
      const result = system.disruptBalance(player, 20, BodyRegion.TORSO, currentTime + 1100);

      // Base loss: 20 * 1.5 (torso) * 0.6 = 18
      // With penalty: 18 * 1.2 = 21.6
      expect(result.balance).toBeLessThan(80); // Some balance lost
    });

    it("should not count changes older than 3 seconds", () => {
      let player = createBalancePlayerState({
        currentStance: TrigramStance.GEON,
      });

      // First change (will be >3s old)
      player = system.startStanceTransition(player, TrigramStance.GAM, currentTime);
      
      // Wait 3.5 seconds, then make 2 more changes
      player = system.startStanceTransition(player, TrigramStance.LI, currentTime + 3500);
      player = system.startStanceTransition(player, TrigramStance.JIN, currentTime + 4000);

      // Should not trigger penalty (first change is too old)
      expect(player.rapidChangePenaltyEnd).toBeUndefined();
    });
  });

  describe("Balance Recovery with Body Damage", () => {
    it("should recover slower with damaged legs", () => {
      const healthyPlayer = createBalancePlayerState({
        balance: 50,
        stamina: 100,
        maxStamina: 100,
        bodyPartHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      });

      const damagedPlayer = createBalancePlayerState({
        balance: 50,
        stamina: 100,
        maxStamina: 100,
        bodyPartHealth: {
          head: 30,
          neck: 30,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 30,
          armRight: 30,
          legLeft: 30,
          legRight: 30,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      });

      const healthyRecovery = system.applyRecovery(healthyPlayer, 1000);
      const damagedRecovery = system.applyRecovery(damagedPlayer, 1000);

      // Damaged player should recover less
      const healthyGain = healthyRecovery.balance - healthyPlayer.balance;
      const damagedGain = damagedRecovery.balance - damagedPlayer.balance;
      
      expect(damagedGain).toBeLessThan(healthyGain);
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle transition update when no transition is active", () => {
      const player = createBalancePlayerState({
        transitionState: undefined,
      });

      const result = system.updateTransition(player, currentTime);
      expect(result).toEqual(player); // No change
    });

    it("should handle balance modifier when body part health is undefined", () => {
      const player = createBalancePlayerState({
        bodyPartHealth: undefined,
        bodyPartMaxHealth: undefined,
      });

      const modifier = system.calculateBalanceModifier(player);
      expect(modifier).toBe(1.0); // Default to no modifier
    });

    it("should handle rapid changes with empty history", () => {
      const player = createBalancePlayerState({
        stanceChangeHistory: [],
        currentStance: TrigramStance.GEON,
      });

      const result = system.startStanceTransition(player, TrigramStance.GAM, currentTime);
      expect(result.rapidChangePenaltyEnd).toBeUndefined();
    });

    it("should clamp balance to 0 minimum when disrupted", () => {
      const player = createBalancePlayerState({
        balance: 5,
      });

      const result = system.disruptBalance(player, 100, BodyRegion.LEFT_LEG, currentTime);
      expect(result.balance).toBeGreaterThanOrEqual(0);
    });

    it("should clamp balance to 100 maximum when recovering", () => {
      const player = createBalancePlayerState({
        balance: 95,
        stamina: 100,
        maxStamina: 100,
      });

      const result = system.applyRecovery(player, 5000);
      expect(result.balance).toBeLessThanOrEqual(100);
    });

    it("should handle multiple rapid transitions correctly", () => {
      let player = createBalancePlayerState({
        currentStance: TrigramStance.GEON,
      });

      // Rapid fire 5 transitions
      for (let i = 0; i < 5; i++) {
        const newStance = [TrigramStance.GAM, TrigramStance.LI, TrigramStance.JIN, TrigramStance.SON, TrigramStance.GAN][i];
        player = system.startStanceTransition(player, newStance, currentTime + i * 200);
        player = system.updateTransition(player, currentTime + i * 200 + 100);
      }

      // Should have penalty active
      expect(system.isRapidChangePenaltyActive(player, currentTime + 1000)).toBe(true);
      
      // History should be limited to 5
      expect(player.stanceChangeHistory?.length).toBeLessThanOrEqual(5);
    });

    it("should maintain 60fps performance with all features active", () => {
      let player = createBalancePlayerState({
        balance: 65,
        stamina: 70,
        maxStamina: 100,
        currentStance: TrigramStance.GEON,
        bodyPartHealth: {
          head: 50,
          neck: 50,
          torsoUpper: 80,
          torsoLower: 80,
          armLeft: 50,
          armRight: 60,
          legLeft: 50,
          legRight: 60,
        },
        bodyPartMaxHealth: {
          head: 100,
          neck: 100,
          torsoUpper: 100,
          torsoLower: 100,
          armLeft: 100,
          armRight: 100,
          legLeft: 100,
          legRight: 100,
        },
      });

      // Start transition
      player = system.startStanceTransition(player, TrigramStance.GAM, currentTime);

      // Measure performance of 60 frames (1 second at 60fps)
      const startTime = performance.now();
      
      for (let frame = 0; frame < 60; frame++) {
        const frameTime = currentTime + frame * 16.67; // ~60fps
        
        player = system.updateTransition(player, frameTime);
        player = system.applyRecovery(player, 16.67);
        player = system.disruptBalance(player, 5, BodyRegion.TORSO, frameTime);
        
        system.calculateBalanceModifier(player);
        system.getKnockbackResistance(player.currentStance);
        system.getTotalVulnerabilityMultiplier(player);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should complete 60 frames in well under 100ms (realistic performance threshold)
      // This allows ~1.67ms per frame on average, well within 16.67ms frame budget
      expect(totalTime).toBeLessThan(100);
    });
  });

  describe("Integration with Existing Balance System", () => {
    it("should work with existing shouldTriggerFall", () => {
      const player = createBalancePlayerState({
        balance: 15,
      });

      expect(system.shouldTriggerFall(player)).toBe(true);
    });

    it("should work with existing getBalanceLevel", () => {
      const player = createBalancePlayerState({
        balance: 30,
      });

      expect(system.getBalanceLevel(player.balance)).toBe("off_balance");
    });

    it("should work with existing isVulnerable", () => {
      const player = createBalancePlayerState({
        balance: 25,
      });

      expect(system.isVulnerable(player)).toBe(true);
    });

    it("should preserve existing knockdown check", () => {
      const player = createBalancePlayerState({
        balance: 10,
      });

      const shouldKnockdown = system.shouldKnockdown(player, () => 0.5);
      expect(shouldKnockdown).toBeDefined();
    });
  });
});
