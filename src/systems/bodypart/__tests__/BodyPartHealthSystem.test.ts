/**
 * Unit tests for Body Part Health System
 * 
 * **Korean**: 신체부위 체력 시스템 단위 테스트
 * 
 * Tests the body part health tracking, damage distribution, and combat effect
 * calculations to ensure realistic localized damage mechanics.
 * 
 * @module systems/bodypart/__tests__/BodyPartHealthSystem.test
 */

import { BodyRegion } from "@/types";
import { describe, expect, it } from "vitest";
import {
  BodyPartHealthSystem,
  bodyPartHealthSystem,
} from "../BodyPartHealthSystem";
import {
  BodyPart,
  BODY_PART_EFFECT_CONSTANTS,
  DEFAULT_BODY_PART_CONFIG,
} from "../types";

describe("BodyPartHealthSystem", () => {
  describe("createDefaultBodyPartHealth", () => {
    it("should create default body part health with all parts at 100 HP", () => {
      const system = new BodyPartHealthSystem();
      const health = system.createDefaultBodyPartHealth();

      expect(health.head).toBe(100);
      expect(health.neck).toBe(100);
      expect(health.torsoUpper).toBe(100);
      expect(health.torsoLower).toBe(100);
      expect(health.armLeft).toBe(100);
      expect(health.armRight).toBe(100);
      expect(health.legLeft).toBe(100);
      expect(health.legRight).toBe(100);
    });

    it("should allow custom max health", () => {
      const system = new BodyPartHealthSystem();
      const health = system.createDefaultBodyPartHealth(150);

      expect(health.head).toBe(150);
      expect(health.armLeft).toBe(150);
    });
  });

  describe("applyDamageToBodyPart", () => {
    it("should reduce health of specific body part", () => {
      const system = new BodyPartHealthSystem();
      const initial = system.createDefaultBodyPartHealth();

      const damaged = system.applyDamageToBodyPart(
        initial,
        BodyPart.HEAD,
        30
      );

      expect(damaged.head).toBe(70);
      expect(damaged.neck).toBe(100); // Other parts unchanged
    });

    it("should not reduce health below 0", () => {
      const system = new BodyPartHealthSystem();
      const initial = system.createDefaultBodyPartHealth();

      const damaged = system.applyDamageToBodyPart(
        initial,
        BodyPart.HEAD,
        150
      );

      expect(damaged.head).toBe(0);
    });
  });

  describe("getDamageDistribution", () => {
    it("should distribute head damage primarily to head", () => {
      const system = new BodyPartHealthSystem();
      const distribution = system.getDamageDistribution(BodyRegion.HEAD);

      expect(distribution.primary.part).toBe(BodyPart.HEAD);
      expect(distribution.primary.percentage).toBeGreaterThan(0.8);
      expect(distribution.secondary.length).toBeGreaterThan(0);
    });

    it("should split torso damage between upper and lower", () => {
      const system = new BodyPartHealthSystem();
      const distribution = system.getDamageDistribution(BodyRegion.TORSO);

      expect(distribution.primary.part).toBe(BodyPart.TORSO_UPPER);
      expect(distribution.secondary.some(s => s.part === BodyPart.TORSO_LOWER)).toBe(true);
    });
  });

  describe("applyDistributedDamage", () => {
    it("should apply damage to primary and secondary body parts", () => {
      const system = new BodyPartHealthSystem();
      const initial = system.createDefaultBodyPartHealth();

      const damaged = system.applyDistributedDamage(
        initial,
        BodyRegion.HEAD,
        50
      );

      // Head should take primary damage (90%)
      expect(damaged.head).toBeLessThan(100);
      expect(damaged.head).toBeGreaterThanOrEqual(50);
      
      // Neck should take secondary damage (10%)
      expect(damaged.neck).toBeLessThan(100);
      expect(damaged.neck).toBeGreaterThan(90);
    });
  });

  describe("calculateBodyPartEffects", () => {
    it("should apply no penalties when all parts are healthy", () => {
      const system = new BodyPartHealthSystem();
      const health = system.createDefaultBodyPartHealth();

      const effects = system.calculateBodyPartEffects(health);

      expect(effects.consciousnessModifier).toBe(1.0);
      expect(effects.staminaRegenModifier).toBe(1.0);
      expect(effects.attackDamageModifier).toBe(1.0);
      expect(effects.movementSpeedModifier).toBe(1.0);
    });

    it("should apply consciousness penalty when head < 50%", () => {
      const system = new BodyPartHealthSystem();
      const health = {
        ...system.createDefaultBodyPartHealth(),
        head: 40, // Below 50% threshold
      };

      const effects = system.calculateBodyPartEffects(health);

      expect(effects.consciousnessModifier).toBeLessThan(1.0);
      expect(effects.consciousnessModifier).toBe(
        BODY_PART_EFFECT_CONSTANTS.HEAD.CONSCIOUSNESS_PENALTY_AT_50
      );
    });

    it("should apply stamina regen penalty when torso < 50%", () => {
      const system = new BodyPartHealthSystem();
      const health = {
        ...system.createDefaultBodyPartHealth(),
        torsoUpper: 40,
        torsoLower: 40,
      };

      const effects = system.calculateBodyPartEffects(health);

      expect(effects.staminaRegenModifier).toBeLessThan(1.0);
      expect(effects.staminaRegenModifier).toBe(
        BODY_PART_EFFECT_CONSTANTS.TORSO.STAMINA_REGEN_PENALTY_AT_50
      );
    });

    it("should apply attack damage penalty when arms < 50%", () => {
      const system = new BodyPartHealthSystem();
      const health = {
        ...system.createDefaultBodyPartHealth(),
        armLeft: 40,
        armRight: 40,
      };

      const effects = system.calculateBodyPartEffects(health);

      expect(effects.attackDamageModifier).toBeLessThan(1.0);
      expect(effects.attackDamageModifier).toBe(
        BODY_PART_EFFECT_CONSTANTS.ARMS.ATTACK_DAMAGE_PENALTY_AT_50
      );
    });

    it("should apply movement speed penalty when legs < 50%", () => {
      const system = new BodyPartHealthSystem();
      const health = {
        ...system.createDefaultBodyPartHealth(),
        legLeft: 40,
        legRight: 40,
      };

      const effects = system.calculateBodyPartEffects(health);

      expect(effects.movementSpeedModifier).toBeLessThan(1.0);
      expect(effects.movementSpeedModifier).toBe(
        BODY_PART_EFFECT_CONSTANTS.LEGS.MOVEMENT_SPEED_PENALTY_AT_50
      );
    });
  });

  describe("calculateAggregateHealth", () => {
    it("should return 100 when all parts are at 100", () => {
      const system = new BodyPartHealthSystem();
      const health = system.createDefaultBodyPartHealth();

      const aggregate = system.calculateAggregateHealth(health);

      expect(aggregate).toBe(100);
    });

    it("should return average of all body part health", () => {
      const system = new BodyPartHealthSystem();
      const health = {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 0, // One part completely damaged
        legRight: 100,
      };

      const aggregate = system.calculateAggregateHealth(health);

      // Average should be 700/8 = 87.5
      expect(aggregate).toBeCloseTo(87.5, 1);
    });
  });

  describe("isIncapacitated", () => {
    it("should return false when healthy", () => {
      const system = new BodyPartHealthSystem();
      const health = system.createDefaultBodyPartHealth();

      const incapacitated = system.isIncapacitated(health);

      expect(incapacitated).toBe(false);
    });

    it("should return true when head is at 0 (unconscious)", () => {
      const system = new BodyPartHealthSystem();
      const health = {
        ...system.createDefaultBodyPartHealth(),
        head: 0,
      };

      const incapacitated = system.isIncapacitated(health);

      expect(incapacitated).toBe(true);
    });

    it("should return true when both legs are at 0 (cannot move)", () => {
      const system = new BodyPartHealthSystem();
      const health = {
        ...system.createDefaultBodyPartHealth(),
        legLeft: 0,
        legRight: 0,
      };

      const incapacitated = system.isIncapacitated(health);

      expect(incapacitated).toBe(true);
    });
  });

  describe("Singleton instance", () => {
    it("should provide global bodyPartHealthSystem instance", () => {
      expect(bodyPartHealthSystem).toBeInstanceOf(BodyPartHealthSystem);
    });

    it("should use default config", () => {
      const health = bodyPartHealthSystem.createDefaultBodyPartHealth();
      expect(health.head).toBe(DEFAULT_BODY_PART_CONFIG.defaultMaxHealth);
    });
  });
});
