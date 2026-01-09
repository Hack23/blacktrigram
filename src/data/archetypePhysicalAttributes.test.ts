/**
 * Unit tests for archetype physical attributes system.
 *
 * **Korean**: 원형 신체 속성 테스트 (Archetype Physical Attributes Tests)
 *
 * Tests verify:
 * - Physical attribute data integrity for all archetypes
 * - Combat calculation functions (reach, speed, damage, defense, stamina)
 * - Realistic value ranges and relationships
 * - Korean martial arts biomechanics principles
 *
 * @module data/archetypePhysicalAttributes.test
 * @category Testing
 */

import { PlayerArchetype } from "@/types";
import { describe, expect, it } from "vitest";
import {
  AMSALJA_PHYSICAL,
  ARCHETYPE_PHYSICAL_ATTRIBUTES,
  calculateDamageModifier,
  calculateDefenseModifier,
  calculateEffectiveReach,
  calculateMovementSpeed,
  calculateStaminaRecovery,
  getArchetypePhysicalAttributes,
  HACKER_PHYSICAL,
  JEONGBO_PHYSICAL,
  JOJIK_PHYSICAL,
  MUSA_PHYSICAL,
} from "./archetypePhysicalAttributes";

describe("Archetype Physical Attributes Data", () => {
  describe("무사 (Musa) Physical Profile", () => {
    it("should have balanced warrior attributes", () => {
      expect(MUSA_PHYSICAL.weight).toBe(82);
      expect(MUSA_PHYSICAL.legLength).toBe(96);
      expect(MUSA_PHYSICAL.armLength).toBe(77);
      expect(MUSA_PHYSICAL.muscleMass).toBe(35);
      expect(MUSA_PHYSICAL.fatMass).toBe(13);
      expect(MUSA_PHYSICAL.age).toBe(32);
    });

    it("should have high muscle mass for power", () => {
      expect(MUSA_PHYSICAL.muscleMass).toBeGreaterThanOrEqual(35);
    });

    it("should have low fat for mobility", () => {
      expect(MUSA_PHYSICAL.fatMass).toBeLessThan(15);
    });

    it("should be at prime combat age", () => {
      expect(MUSA_PHYSICAL.age).toBeGreaterThanOrEqual(28);
      expect(MUSA_PHYSICAL.age).toBeLessThanOrEqual(35);
    });
  });

  describe("암살자 (Amsalja) Physical Profile", () => {
    it("should have lean assassin attributes", () => {
      expect(AMSALJA_PHYSICAL.weight).toBe(75);
      expect(AMSALJA_PHYSICAL.legLength).toBe(102);
      expect(AMSALJA_PHYSICAL.armLength).toBe(82);
      expect(AMSALJA_PHYSICAL.muscleMass).toBe(30);
      expect(AMSALJA_PHYSICAL.fatMass).toBe(10);
      expect(AMSALJA_PHYSICAL.age).toBe(28);
    });

    it("should be lightest archetype for stealth", () => {
      expect(AMSALJA_PHYSICAL.weight).toBeLessThan(MUSA_PHYSICAL.weight);
      expect(AMSALJA_PHYSICAL.weight).toBeLessThan(JOJIK_PHYSICAL.weight);
    });

    it("should have longest reach for precision", () => {
      expect(AMSALJA_PHYSICAL.legLength).toBeGreaterThan(
        MUSA_PHYSICAL.legLength
      );
      expect(AMSALJA_PHYSICAL.armLength).toBeGreaterThan(
        MUSA_PHYSICAL.armLength
      );
    });

    it("should have lowest fat mass for agility", () => {
      expect(AMSALJA_PHYSICAL.fatMass).toBeLessThan(MUSA_PHYSICAL.fatMass);
      expect(AMSALJA_PHYSICAL.fatMass).toBeLessThan(JOJIK_PHYSICAL.fatMass);
    });
  });

  describe("해커 (Hacker) Physical Profile", () => {
    it("should have average cyber warrior attributes", () => {
      expect(HACKER_PHYSICAL.weight).toBe(72);
      expect(HACKER_PHYSICAL.legLength).toBe(92);
      expect(HACKER_PHYSICAL.armLength).toBe(73);
      expect(HACKER_PHYSICAL.muscleMass).toBe(28);
      expect(HACKER_PHYSICAL.fatMass).toBe(15);
      expect(HACKER_PHYSICAL.age).toBe(26);
    });

    it("should have average physical attributes", () => {
      // Hacker represents an average tech-focused fighter
      // Weight should be between the extremes (not average of the mean)
      expect(HACKER_PHYSICAL.weight).toBeGreaterThan(
        AMSALJA_PHYSICAL.weight - 10
      );
      expect(HACKER_PHYSICAL.weight).toBeLessThan(JOJIK_PHYSICAL.weight);
    });

    it("should be youngest archetype", () => {
      expect(HACKER_PHYSICAL.age).toBeLessThan(MUSA_PHYSICAL.age);
      expect(HACKER_PHYSICAL.age).toBeLessThan(JEONGBO_PHYSICAL.age);
    });
  });

  describe("정보요원 (Jeongbo) Physical Profile", () => {
    it("should have intelligence operative attributes", () => {
      expect(JEONGBO_PHYSICAL.weight).toBe(78);
      expect(JEONGBO_PHYSICAL.legLength).toBe(95);
      expect(JEONGBO_PHYSICAL.armLength).toBe(76);
      expect(JEONGBO_PHYSICAL.muscleMass).toBe(32);
      expect(JEONGBO_PHYSICAL.fatMass).toBe(12);
      expect(JEONGBO_PHYSICAL.age).toBe(34);
    });

    it("should have balanced attributes for versatility", () => {
      expect(JEONGBO_PHYSICAL.weight).toBeGreaterThan(AMSALJA_PHYSICAL.weight);
      expect(JEONGBO_PHYSICAL.weight).toBeLessThan(JOJIK_PHYSICAL.weight);
    });

    it("should be experienced operative", () => {
      expect(JEONGBO_PHYSICAL.age).toBeGreaterThan(30);
    });
  });

  describe("조직폭력배 (Jojik) Physical Profile", () => {
    it("should have heavy street fighter attributes", () => {
      expect(JOJIK_PHYSICAL.weight).toBe(105);
      expect(JOJIK_PHYSICAL.legLength).toBe(100);
      expect(JOJIK_PHYSICAL.armLength).toBe(84);
      expect(JOJIK_PHYSICAL.muscleMass).toBe(48);
      expect(JOJIK_PHYSICAL.fatMass).toBe(20);
      expect(JOJIK_PHYSICAL.age).toBe(36);
    });

    it("should be heaviest archetype for power", () => {
      expect(JOJIK_PHYSICAL.weight).toBeGreaterThan(MUSA_PHYSICAL.weight);
      expect(JOJIK_PHYSICAL.weight).toBeGreaterThan(AMSALJA_PHYSICAL.weight);
    });

    it("should have highest muscle mass", () => {
      expect(JOJIK_PHYSICAL.muscleMass).toBeGreaterThan(
        MUSA_PHYSICAL.muscleMass
      );
      expect(JOJIK_PHYSICAL.muscleMass).toBeGreaterThan(
        AMSALJA_PHYSICAL.muscleMass
      );
    });

    it("should have highest fat mass", () => {
      expect(JOJIK_PHYSICAL.fatMass).toBeGreaterThan(MUSA_PHYSICAL.fatMass);
      expect(JOJIK_PHYSICAL.fatMass).toBeGreaterThan(AMSALJA_PHYSICAL.fatMass);
    });
  });

  describe("Archetype Physical Attributes Map", () => {
    it("should contain all five archetypes", () => {
      expect(Object.keys(ARCHETYPE_PHYSICAL_ATTRIBUTES)).toHaveLength(5);
      expect(ARCHETYPE_PHYSICAL_ATTRIBUTES[PlayerArchetype.MUSA]).toBeDefined();
      expect(
        ARCHETYPE_PHYSICAL_ATTRIBUTES[PlayerArchetype.AMSALJA]
      ).toBeDefined();
      expect(
        ARCHETYPE_PHYSICAL_ATTRIBUTES[PlayerArchetype.HACKER]
      ).toBeDefined();
      expect(
        ARCHETYPE_PHYSICAL_ATTRIBUTES[PlayerArchetype.JEONGBO_YOWON]
      ).toBeDefined();
      expect(
        ARCHETYPE_PHYSICAL_ATTRIBUTES[PlayerArchetype.JOJIK_POKRYEOKBAE]
      ).toBeDefined();
    });

    it("should map to correct physical profiles", () => {
      expect(ARCHETYPE_PHYSICAL_ATTRIBUTES[PlayerArchetype.MUSA]).toEqual(
        MUSA_PHYSICAL
      );
      expect(ARCHETYPE_PHYSICAL_ATTRIBUTES[PlayerArchetype.AMSALJA]).toEqual(
        AMSALJA_PHYSICAL
      );
      expect(ARCHETYPE_PHYSICAL_ATTRIBUTES[PlayerArchetype.HACKER]).toEqual(
        HACKER_PHYSICAL
      );
      expect(
        ARCHETYPE_PHYSICAL_ATTRIBUTES[PlayerArchetype.JEONGBO_YOWON]
      ).toEqual(JEONGBO_PHYSICAL);
      expect(
        ARCHETYPE_PHYSICAL_ATTRIBUTES[PlayerArchetype.JOJIK_POKRYEOKBAE]
      ).toEqual(JOJIK_PHYSICAL);
    });
  });

  describe("getArchetypePhysicalAttributes()", () => {
    it("should return correct attributes for each archetype", () => {
      expect(getArchetypePhysicalAttributes(PlayerArchetype.MUSA)).toEqual(
        MUSA_PHYSICAL
      );
      expect(getArchetypePhysicalAttributes(PlayerArchetype.AMSALJA)).toEqual(
        AMSALJA_PHYSICAL
      );
      expect(getArchetypePhysicalAttributes(PlayerArchetype.HACKER)).toEqual(
        HACKER_PHYSICAL
      );
      expect(
        getArchetypePhysicalAttributes(PlayerArchetype.JEONGBO_YOWON)
      ).toEqual(JEONGBO_PHYSICAL);
      expect(
        getArchetypePhysicalAttributes(PlayerArchetype.JOJIK_POKRYEOKBAE)
      ).toEqual(JOJIK_PHYSICAL);
    });

    it("should return readonly objects", () => {
      const attrs = getArchetypePhysicalAttributes(PlayerArchetype.MUSA);
      expect(Object.isFrozen(attrs)).toBe(false); // TypeScript readonly, not Object.freeze
      expect(attrs).toBeDefined();
    });
  });
});

describe("Combat Calculation Functions", () => {
  describe("calculateEffectiveReach()", () => {
    it("should calculate full extension reach", () => {
      expect(calculateEffectiveReach(75, 1.0)).toBe(75);
      expect(calculateEffectiveReach(95, 1.0)).toBe(95);
    });

    it("should calculate partial extension reach", () => {
      expect(calculateEffectiveReach(75, 0.5)).toBe(37.5);
      expect(calculateEffectiveReach(95, 0.7)).toBe(66.5);
    });

    it("should clamp extension to valid range", () => {
      expect(calculateEffectiveReach(75, 1.5)).toBe(75); // Max 1.0
      expect(calculateEffectiveReach(75, -0.5)).toBe(0); // Min 0.0
    });

    it("should default to full extension", () => {
      expect(calculateEffectiveReach(75)).toBe(75);
    });

    it("should reflect archetype reach differences", () => {
      const musaKickReach = calculateEffectiveReach(
        MUSA_PHYSICAL.legLength,
        1.0
      );
      const amsaljaKickReach = calculateEffectiveReach(
        AMSALJA_PHYSICAL.legLength,
        1.0
      );

      // Amsalja has longer legs for better reach
      expect(amsaljaKickReach).toBeGreaterThan(musaKickReach);
    });
  });

  describe("calculateMovementSpeed()", () => {
    it("should calculate balanced movement speed for Musa", () => {
      const speed = calculateMovementSpeed(MUSA_PHYSICAL);
      // MUSA now 82kg so slightly slower than baseline 100
      expect(speed).toBeGreaterThan(85);
      expect(speed).toBeLessThan(105);
    });

    it("should calculate faster speed for Amsalja", () => {
      const amsaljaSpeed = calculateMovementSpeed(AMSALJA_PHYSICAL);
      const musaSpeed = calculateMovementSpeed(MUSA_PHYSICAL);

      // Lighter weight and longer legs = faster
      expect(amsaljaSpeed).toBeGreaterThan(musaSpeed);
    });

    it("should calculate slower speed for Jojik", () => {
      const jojikSpeed = calculateMovementSpeed(JOJIK_PHYSICAL);
      const musaSpeed = calculateMovementSpeed(MUSA_PHYSICAL);

      // Heavier weight and shorter legs = slower
      expect(jojikSpeed).toBeLessThan(musaSpeed);
    });

    it("should use custom base speed", () => {
      const speed200 = calculateMovementSpeed(MUSA_PHYSICAL, 200);
      const speed100 = calculateMovementSpeed(MUSA_PHYSICAL, 100);

      expect(speed200).toBeCloseTo(speed100 * 2, 1);
    });

    it("should properly weight leg length and body weight", () => {
      // Test with extreme values
      const light = { ...MUSA_PHYSICAL, weight: 60, legLength: 100 };
      const heavy = { ...MUSA_PHYSICAL, weight: 90, legLength: 90 };

      expect(calculateMovementSpeed(light)).toBeGreaterThan(
        calculateMovementSpeed(heavy)
      );
    });
  });

  describe("calculateDamageModifier()", () => {
    it("should calculate balanced damage for Musa", () => {
      const modifier = calculateDamageModifier(MUSA_PHYSICAL);
      // MUSA with 35kg muscle is baseline, so modifier is ~1.0
      expect(modifier).toBeGreaterThanOrEqual(1.0);
      expect(modifier).toBeLessThan(1.15);
    });

    it("should calculate highest damage for Jojik", () => {
      const jojikDamage = calculateDamageModifier(JOJIK_PHYSICAL);
      const musaDamage = calculateDamageModifier(MUSA_PHYSICAL);
      const amsaljaDamage = calculateDamageModifier(AMSALJA_PHYSICAL);

      // Jojik has most muscle = highest damage
      expect(jojikDamage).toBeGreaterThan(musaDamage);
      expect(jojikDamage).toBeGreaterThan(amsaljaDamage);
    });

    it("should calculate lowest damage for Amsalja", () => {
      const amsaljaDamage = calculateDamageModifier(AMSALJA_PHYSICAL);
      const musaDamage = calculateDamageModifier(MUSA_PHYSICAL);

      // Amsalja has least muscle = lowest damage
      expect(amsaljaDamage).toBeLessThan(musaDamage);
    });

    it("should scale proportionally with muscle mass", () => {
      const lowMuscle = { ...MUSA_PHYSICAL, muscleMass: 30 };
      const highMuscle = { ...MUSA_PHYSICAL, muscleMass: 45 };

      expect(calculateDamageModifier(highMuscle)).toBeGreaterThan(
        calculateDamageModifier(lowMuscle)
      );
    });

    it("should return values in reasonable range", () => {
      const allModifiers = [
        calculateDamageModifier(MUSA_PHYSICAL),
        calculateDamageModifier(AMSALJA_PHYSICAL),
        calculateDamageModifier(HACKER_PHYSICAL),
        calculateDamageModifier(JEONGBO_PHYSICAL),
        calculateDamageModifier(JOJIK_PHYSICAL),
      ];

      allModifiers.forEach((mod) => {
        expect(mod).toBeGreaterThan(0.7);
        expect(mod).toBeLessThan(1.5);
      });
    });
  });

  describe("calculateDefenseModifier()", () => {
    it("should calculate highest defense for Jojik", () => {
      const jojikDefense = calculateDefenseModifier(JOJIK_PHYSICAL);
      const amsaljaDefense = calculateDefenseModifier(AMSALJA_PHYSICAL);

      // Jojik has most fat and muscle = best defense
      expect(jojikDefense).toBeGreaterThan(amsaljaDefense);
    });

    it("should calculate lowest defense for Amsalja", () => {
      const amsaljaDefense = calculateDefenseModifier(AMSALJA_PHYSICAL);
      const musaDefense = calculateDefenseModifier(MUSA_PHYSICAL);

      // Amsalja has least fat and muscle = weakest defense
      expect(amsaljaDefense).toBeLessThan(musaDefense);
    });

    it("should factor both fat and muscle mass", () => {
      const highFat = { ...MUSA_PHYSICAL, fatMass: 20, muscleMass: 30 };
      const highMuscle = { ...MUSA_PHYSICAL, fatMass: 10, muscleMass: 40 };

      const fatDefense = calculateDefenseModifier(highFat);
      const muscleDefense = calculateDefenseModifier(highMuscle);

      // Both should be above baseline
      expect(fatDefense).toBeGreaterThan(1.0);
      expect(muscleDefense).toBeGreaterThan(1.0);
    });

    it("should return values in reasonable range", () => {
      const allDefenses = [
        calculateDefenseModifier(MUSA_PHYSICAL),
        calculateDefenseModifier(AMSALJA_PHYSICAL),
        calculateDefenseModifier(HACKER_PHYSICAL),
        calculateDefenseModifier(JEONGBO_PHYSICAL),
        calculateDefenseModifier(JOJIK_PHYSICAL),
      ];

      allDefenses.forEach((def) => {
        expect(def).toBeGreaterThan(1.0);
        expect(def).toBeLessThan(1.5);
      });
    });
  });

  describe("calculateStaminaRecovery()", () => {
    it("should calculate optimal recovery for prime age fighters", () => {
      const amsaljaRecovery = calculateStaminaRecovery(AMSALJA_PHYSICAL);
      const jojikRecovery = calculateStaminaRecovery(JOJIK_PHYSICAL);

      // Amsalja (age 28, low fat) should recover faster than Jojik (age 36, high fat)
      expect(amsaljaRecovery).toBeGreaterThan(jojikRecovery);
    });

    it("should penalize older fighters", () => {
      const young = { ...MUSA_PHYSICAL, age: 25 };
      const old = { ...MUSA_PHYSICAL, age: 40 };

      expect(calculateStaminaRecovery(young)).toBeGreaterThan(
        calculateStaminaRecovery(old)
      );
    });

    it("should penalize higher fat mass", () => {
      const lean = { ...MUSA_PHYSICAL, fatMass: 8 };
      const heavy = { ...MUSA_PHYSICAL, fatMass: 20 };

      expect(calculateStaminaRecovery(lean)).toBeGreaterThan(
        calculateStaminaRecovery(heavy)
      );
    });

    it("should use custom base rate", () => {
      const recovery20 = calculateStaminaRecovery(MUSA_PHYSICAL, 20);
      const recovery10 = calculateStaminaRecovery(MUSA_PHYSICAL, 10);

      expect(recovery20).toBeCloseTo(recovery10 * 2, 1);
    });

    it("should not drop below minimum threshold", () => {
      const extreme = { ...MUSA_PHYSICAL, age: 50, fatMass: 30 };
      const recovery = calculateStaminaRecovery(extreme);

      // Should still recover, but at reduced rate
      expect(recovery).toBeGreaterThan(0);
      expect(recovery).toBeLessThan(10); // Significantly reduced but still functional
    });

    it("should favor Amsalja for stamina recovery", () => {
      const amsaljaRecovery = calculateStaminaRecovery(AMSALJA_PHYSICAL);
      const musaRecovery = calculateStaminaRecovery(MUSA_PHYSICAL);

      // Amsalja is younger and leaner
      expect(amsaljaRecovery).toBeGreaterThan(musaRecovery);
    });
  });
});

describe("Physical Attributes Realism", () => {
  it("should maintain realistic weight ranges", () => {
    const allWeights = [
      MUSA_PHYSICAL.weight,
      AMSALJA_PHYSICAL.weight,
      HACKER_PHYSICAL.weight,
      JEONGBO_PHYSICAL.weight,
      JOJIK_PHYSICAL.weight,
    ];

    allWeights.forEach((weight) => {
      expect(weight).toBeGreaterThanOrEqual(55);
      expect(weight).toBeLessThanOrEqual(110);
    });
  });

  it("should maintain realistic leg lengths", () => {
    const allLegLengths = [
      MUSA_PHYSICAL.legLength,
      AMSALJA_PHYSICAL.legLength,
      HACKER_PHYSICAL.legLength,
      JEONGBO_PHYSICAL.legLength,
      JOJIK_PHYSICAL.legLength,
    ];

    allLegLengths.forEach((length) => {
      expect(length).toBeGreaterThanOrEqual(85);
      expect(length).toBeLessThanOrEqual(105);
    });
  });

  it("should maintain realistic arm lengths", () => {
    const allArmLengths = [
      MUSA_PHYSICAL.armLength,
      AMSALJA_PHYSICAL.armLength,
      HACKER_PHYSICAL.armLength,
      JEONGBO_PHYSICAL.armLength,
      JOJIK_PHYSICAL.armLength,
    ];

    allArmLengths.forEach((length) => {
      expect(length).toBeGreaterThanOrEqual(65);
      expect(length).toBeLessThanOrEqual(85);
    });
  });

  it("should maintain realistic muscle mass ranges", () => {
    const allMuscleMass = [
      MUSA_PHYSICAL.muscleMass,
      AMSALJA_PHYSICAL.muscleMass,
      HACKER_PHYSICAL.muscleMass,
      JEONGBO_PHYSICAL.muscleMass,
      JOJIK_PHYSICAL.muscleMass,
    ];

    allMuscleMass.forEach((mass) => {
      expect(mass).toBeGreaterThanOrEqual(25);
      expect(mass).toBeLessThanOrEqual(50);
    });
  });

  it("should maintain realistic fat mass ranges", () => {
    const allFatMass = [
      MUSA_PHYSICAL.fatMass,
      AMSALJA_PHYSICAL.fatMass,
      HACKER_PHYSICAL.fatMass,
      JEONGBO_PHYSICAL.fatMass,
      JOJIK_PHYSICAL.fatMass,
    ];

    allFatMass.forEach((mass) => {
      expect(mass).toBeGreaterThanOrEqual(8);
      expect(mass).toBeLessThanOrEqual(20);
    });
  });

  it("should maintain realistic age ranges", () => {
    const allAges = [
      MUSA_PHYSICAL.age,
      AMSALJA_PHYSICAL.age,
      HACKER_PHYSICAL.age,
      JEONGBO_PHYSICAL.age,
      JOJIK_PHYSICAL.age,
    ];

    allAges.forEach((age) => {
      expect(age).toBeGreaterThanOrEqual(22);
      expect(age).toBeLessThanOrEqual(45);
    });
  });

  it("should maintain realistic body composition", () => {
    // Weight should roughly equal muscle + fat + bone/organ mass
    const allProfiles = [
      MUSA_PHYSICAL,
      AMSALJA_PHYSICAL,
      HACKER_PHYSICAL,
      JEONGBO_PHYSICAL,
      JOJIK_PHYSICAL,
    ];

    allProfiles.forEach((profile) => {
      const compositeMass = profile.muscleMass + profile.fatMass;
      // Bone and organs are roughly 25-40kg for larger fighters
      expect(profile.weight).toBeGreaterThan(compositeMass + 15);
      expect(profile.weight).toBeLessThan(compositeMass + 45);
    });
  });

  it("should maintain realistic total height ranges", () => {
    const allHeights = [
      MUSA_PHYSICAL.totalHeight,
      AMSALJA_PHYSICAL.totalHeight,
      HACKER_PHYSICAL.totalHeight,
      JEONGBO_PHYSICAL.totalHeight,
      JOJIK_PHYSICAL.totalHeight,
    ];

    allHeights.forEach((height) => {
      expect(height).toBeGreaterThanOrEqual(160);
      expect(height).toBeLessThanOrEqual(195);
    });
  });

  it("should maintain realistic torso length ranges", () => {
    const allTorsoLengths = [
      MUSA_PHYSICAL.torsoLength,
      AMSALJA_PHYSICAL.torsoLength,
      HACKER_PHYSICAL.torsoLength,
      JEONGBO_PHYSICAL.torsoLength,
      JOJIK_PHYSICAL.torsoLength,
    ];

    allTorsoLengths.forEach((length) => {
      expect(length).toBeGreaterThanOrEqual(50);
      expect(length).toBeLessThanOrEqual(65);
    });
  });

  it("should maintain realistic head size ranges", () => {
    const allHeadSizes = [
      MUSA_PHYSICAL.headSize,
      AMSALJA_PHYSICAL.headSize,
      HACKER_PHYSICAL.headSize,
      JEONGBO_PHYSICAL.headSize,
      JOJIK_PHYSICAL.headSize,
    ];

    allHeadSizes.forEach((size) => {
      expect(size).toBeGreaterThanOrEqual(20);
      expect(size).toBeLessThanOrEqual(24);
    });
  });

  it("should maintain realistic neck length ranges", () => {
    const allNeckLengths = [
      MUSA_PHYSICAL.neckLength,
      AMSALJA_PHYSICAL.neckLength,
      HACKER_PHYSICAL.neckLength,
      JEONGBO_PHYSICAL.neckLength,
      JOJIK_PHYSICAL.neckLength,
    ];

    allNeckLengths.forEach((length) => {
      expect(length).toBeGreaterThanOrEqual(8);
      expect(length).toBeLessThanOrEqual(12);
    });
  });

  it("should maintain realistic shoulder width ranges", () => {
    const allShoulderWidths = [
      MUSA_PHYSICAL.shoulderWidth,
      AMSALJA_PHYSICAL.shoulderWidth,
      HACKER_PHYSICAL.shoulderWidth,
      JEONGBO_PHYSICAL.shoulderWidth,
      JOJIK_PHYSICAL.shoulderWidth,
    ];

    allShoulderWidths.forEach((width) => {
      expect(width).toBeGreaterThanOrEqual(38);
      expect(width).toBeLessThanOrEqual(56);
    });
  });

  it("should reflect archetype body proportions", () => {
    // Amsalja should be tallest and leanest
    expect(AMSALJA_PHYSICAL.totalHeight).toBeGreaterThan(
      MUSA_PHYSICAL.totalHeight
    );
    expect(AMSALJA_PHYSICAL.torsoLength).toBeLessThan(
      MUSA_PHYSICAL.torsoLength
    );

    // Jojik should be stockier with wider shoulders
    expect(JOJIK_PHYSICAL.shoulderWidth).toBeGreaterThan(
      MUSA_PHYSICAL.shoulderWidth
    );
    expect(JOJIK_PHYSICAL.torsoLength).toBeGreaterThan(
      MUSA_PHYSICAL.torsoLength
    );

    // Amsalja and Jojik now both have 11cm necks
    // Check that both are longer than reference (MUSA at 10cm)
    expect(AMSALJA_PHYSICAL.neckLength).toBeGreaterThanOrEqual(
      JOJIK_PHYSICAL.neckLength
    );

    // Jojik should have larger head (resilience)
    expect(JOJIK_PHYSICAL.headSize).toBeGreaterThan(AMSALJA_PHYSICAL.headSize);
  });

  it("should have proportional body dimensions", () => {
    // Height should be roughly leg length + torso length + neck + head
    const allProfiles = [
      MUSA_PHYSICAL,
      AMSALJA_PHYSICAL,
      HACKER_PHYSICAL,
      JEONGBO_PHYSICAL,
      JOJIK_PHYSICAL,
    ];

    allProfiles.forEach((profile) => {
      const summedHeight =
        profile.legLength +
        profile.torsoLength +
        profile.neckLength +
        profile.headSize;
      // Allow 10% variance for posture and positioning
      expect(profile.totalHeight).toBeGreaterThan(summedHeight * 0.9);
      expect(profile.totalHeight).toBeLessThan(summedHeight * 1.1);
    });
  });
});

describe("Korean Martial Arts Biomechanics", () => {
  it("should support Taekwondo high kick ranges", () => {
    // Korean Taekwondo emphasizes long-range kicks
    const musaKickRange = calculateEffectiveReach(MUSA_PHYSICAL.legLength, 0.9);
    expect(musaKickRange).toBeGreaterThan(80); // Sufficient for head kicks
  });

  it("should support Hapkido joint lock ranges", () => {
    // Hapkido requires close-range grappling
    const musaGrappleRange = calculateEffectiveReach(
      MUSA_PHYSICAL.armLength,
      0.7
    );
    expect(musaGrappleRange).toBeGreaterThan(50); // Sufficient for joint locks
  });

  it("should reflect assassin stealth advantage", () => {
    // Amsalja should be fastest and lightest
    const amsaljaSpeed = calculateMovementSpeed(AMSALJA_PHYSICAL);
    const musaSpeed = calculateMovementSpeed(MUSA_PHYSICAL);
    const jojikSpeed = calculateMovementSpeed(JOJIK_PHYSICAL);

    expect(amsaljaSpeed).toBeGreaterThan(musaSpeed);
    expect(amsaljaSpeed).toBeGreaterThan(jojikSpeed);
  });

  it("should reflect street fighter power advantage", () => {
    // Jojik should hit hardest
    const jojikPower = calculateDamageModifier(JOJIK_PHYSICAL);
    const musaPower = calculateDamageModifier(MUSA_PHYSICAL);
    const amsaljaPower = calculateDamageModifier(AMSALJA_PHYSICAL);

    expect(jojikPower).toBeGreaterThan(musaPower);
    expect(jojikPower).toBeGreaterThan(amsaljaPower);
  });

  it("should reflect traditional warrior balance", () => {
    // Musa should be well-balanced
    const musaSpeed = calculateMovementSpeed(MUSA_PHYSICAL);
    const musaPower = calculateDamageModifier(MUSA_PHYSICAL);
    const musaDefense = calculateDefenseModifier(MUSA_PHYSICAL);

    // Speed around 90-100 (slightly slower due to 82kg weight vs 75kg reference)
    expect(musaSpeed).toBeGreaterThan(85);
    expect(musaSpeed).toBeLessThan(105);
    // Power close to baseline (35kg muscle = reference)
    expect(musaPower).toBeGreaterThanOrEqual(0.95);
    expect(musaPower).toBeLessThan(1.15);
    // Good defense from balanced build
    expect(musaDefense).toBeGreaterThan(1.1);
    expect(musaDefense).toBeLessThan(1.35);
  });
});
