/**
 * Unit tests for Body Part Damage Integration
 * 
 * **Korean**: 신체부위 피해 통합 단위 테스트
 * 
 * Tests the integration of body part health system with damage calculation
 * and vital point targeting systems.
 * 
 * @module systems/bodypart/__tests__/BodyPartDamageIntegration.test
 */

import { BodyRegion, CombatState, PlayerArchetype, TrigramStance } from "@/types";
import { describe, expect, it } from "vitest";
import { PlayerState } from "../../player";
import {
  applyDamageToBodyParts,
  applyVitalPointDamageToBodyParts,
  getBodyPartCombatEffects,
  getBodyRegionFromVitalPoint,
  healBodyPartsProportionally,
  initializeBodyPartHealthForPlayer,
  isPlayerIncapacitatedByBodyDamage,
} from "../BodyPartDamageIntegration";
import { BODY_PART_EFFECT_CONSTANTS } from "../types";

// Helper to create a test player
function createTestPlayer(): PlayerState {
  return {
    id: "test-player",
    name: { korean: "테스트", english: "Test" },
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
}

describe("BodyPartDamageIntegration", () => {
  describe("initializeBodyPartHealthForPlayer", () => {
    it("should initialize body part health for player", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);

      expect(initialized.bodyPartHealth).toBeDefined();
      expect(initialized.bodyPartMaxHealth).toBeDefined();
      expect(initialized.bodyPartHealth?.head).toBe(100);
    });

    it("should not reinitialize if already present", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);
      const secondInit = initializeBodyPartHealthForPlayer(initialized);

      expect(secondInit).toBe(initialized);
    });

    it("should allow custom max health per part", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player, 150);

      expect(initialized.bodyPartMaxHealth?.head).toBe(150);
      expect(initialized.bodyPartHealth?.head).toBe(150);
    });
  });

  describe("applyDamageToBodyParts", () => {
    it("should apply damage to appropriate body parts based on region", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);

      const damaged = applyDamageToBodyParts(
        initialized,
        50,
        BodyRegion.HEAD
      );

      // Head should take most damage
      expect(damaged.bodyPartHealth?.head).toBeLessThan(100);
      expect(damaged.bodyPartHealth?.head).toBeGreaterThan(0);

      // Aggregate health should be reduced
      expect(damaged.health).toBeLessThan(100);
    });

    it("should distribute damage across primary and secondary parts", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);

      const damaged = applyDamageToBodyParts(
        initialized,
        100,
        BodyRegion.TORSO
      );

      // Both torso parts should be damaged
      expect(damaged.bodyPartHealth?.torsoUpper).toBeLessThan(100);
      expect(damaged.bodyPartHealth?.torsoLower).toBeLessThan(100);
    });

    it("should initialize body part health if not present", () => {
      const player = createTestPlayer();

      const damaged = applyDamageToBodyParts(
        player,
        30,
        BodyRegion.LEFT_ARM
      );

      expect(damaged.bodyPartHealth).toBeDefined();
      expect(damaged.bodyPartHealth?.armLeft).toBeLessThan(100);
    });
  });

  describe("getBodyRegionFromVitalPoint", () => {
    it("should map head vital points to HEAD region", () => {
      const vitalPoint = {
        id: "head_temple",
        names: { korean: "태양혈", english: "Temple", romanized: "taeyang" },
        position: { x: 0, y: 0 },
        category: "neurological" as any,
        severity: "critical" as any,
        effects: [],
        description: { korean: "관자놀이", english: "Temple" },
        targetingDifficulty: 0.8,
        effectiveStances: [],
      };

      const region = getBodyRegionFromVitalPoint(vitalPoint);
      expect(region).toBe(BodyRegion.HEAD);
    });

    it("should map neck vital points to NECK region", () => {
      const vitalPoint = {
        id: "neck_carotid",
        names: { korean: "경동맥", english: "Carotid", romanized: "carotid" },
        position: { x: 0, y: 0 },
        category: "vascular" as any,
        severity: "critical" as any,
        effects: [],
        description: { korean: "경동맥", english: "Carotid artery" },
        targetingDifficulty: 0.9,
        effectiveStances: [],
      };

      const region = getBodyRegionFromVitalPoint(vitalPoint);
      expect(region).toBe(BodyRegion.NECK);
    });

    it("should default to TORSO for unknown vital points", () => {
      const vitalPoint = {
        id: "unknown_point",
        names: { korean: "알 수 없음", english: "Unknown", romanized: "unknown" },
        position: { x: 0, y: 0 },
        category: "other" as any,
        severity: "minor" as any,
        effects: [],
        description: { korean: "알 수 없는 점", english: "Unknown point" },
        targetingDifficulty: 0.5,
        effectiveStances: [],
      };

      const region = getBodyRegionFromVitalPoint(vitalPoint);
      expect(region).toBe(BodyRegion.TORSO);
    });
  });

  describe("applyVitalPointDamageToBodyParts", () => {
    it("should apply damage based on vital point location", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);

      const vitalPoint = {
        id: "head_temple",
        names: { korean: "태양혈", english: "Temple", romanized: "taeyang" },
        position: { x: 0, y: 0 },
        category: "neurological" as any,
        severity: "critical" as any,
        effects: [],
        description: { korean: "관자놀이", english: "Temple" },
        targetingDifficulty: 0.8,
        effectiveStances: [],
      };

      const damaged = applyVitalPointDamageToBodyParts(
        initialized,
        60,
        vitalPoint
      );

      expect(damaged.bodyPartHealth?.head).toBeLessThan(100);
    });
  });

  describe("getBodyPartCombatEffects", () => {
    it("should return no effects for player without body part health", () => {
      const player = createTestPlayer();

      const effects = getBodyPartCombatEffects(player);

      expect(effects.consciousnessModifier).toBe(1.0);
      expect(effects.attackDamageModifier).toBe(1.0);
    });

    it("should return consciousness penalty for head damage", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);

      expect(initialized.bodyPartHealth).toBeDefined();
      
      const damaged = {
        ...initialized,
        bodyPartHealth: initialized.bodyPartHealth ? {
          ...initialized.bodyPartHealth,
          head: 40, // Below 50% threshold
        } : undefined,
      };

      const effects = getBodyPartCombatEffects(damaged);

      expect(effects.consciousnessModifier).toBe(
        BODY_PART_EFFECT_CONSTANTS.HEAD.CONSCIOUSNESS_PENALTY_AT_50
      );
    });

    it("should return stamina regen penalty for torso damage", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);

      expect(initialized.bodyPartHealth).toBeDefined();

      const damaged = {
        ...initialized,
        bodyPartHealth: initialized.bodyPartHealth ? {
          ...initialized.bodyPartHealth,
          torsoUpper: 40,
          torsoLower: 40,
        } : undefined,
      };

      const effects = getBodyPartCombatEffects(damaged);

      expect(effects.staminaRegenModifier).toBe(
        BODY_PART_EFFECT_CONSTANTS.TORSO.STAMINA_REGEN_PENALTY_AT_50
      );
    });
  });

  describe("isPlayerIncapacitatedByBodyDamage", () => {
    it("should return false for healthy player", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);

      const incapacitated = isPlayerIncapacitatedByBodyDamage(initialized);

      expect(incapacitated).toBe(false);
    });

    it("should return true when head is at 0", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);

      expect(initialized.bodyPartHealth).toBeDefined();

      const damaged = {
        ...initialized,
        bodyPartHealth: initialized.bodyPartHealth ? {
          ...initialized.bodyPartHealth,
          head: 0,
        } : undefined,
      };

      const incapacitated = isPlayerIncapacitatedByBodyDamage(damaged);

      expect(incapacitated).toBe(true);
    });

    it("should return true when both legs are at 0", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);

      expect(initialized.bodyPartHealth).toBeDefined();

      const damaged = {
        ...initialized,
        bodyPartHealth: initialized.bodyPartHealth ? {
          ...initialized.bodyPartHealth,
          legLeft: 0,
          legRight: 0,
        } : undefined,
      };

      const incapacitated = isPlayerIncapacitatedByBodyDamage(damaged);

      expect(incapacitated).toBe(true);
    });

    it("should return false for player without body part health", () => {
      const player = createTestPlayer();

      const incapacitated = isPlayerIncapacitatedByBodyDamage(player);

      expect(incapacitated).toBe(false);
    });
  });

  describe("healBodyPartsProportionally", () => {
    it("should distribute healing proportionally to damage", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);

      expect(initialized.bodyPartHealth).toBeDefined();

      // Damage different parts by different amounts
      const damaged = {
        ...initialized,
        bodyPartHealth: initialized.bodyPartHealth ? {
          ...initialized.bodyPartHealth,
          head: 50, // 50 missing
          armLeft: 70, // 30 missing
          legRight: 90, // 10 missing
        } : undefined,
      };

      const healed = healBodyPartsProportionally(damaged, 45);

      // Head should receive most healing (50/90 * 45 = 25)
      // Total missing health: 50 + 30 + 10 = 90
      expect(healed.bodyPartHealth?.head).toBeGreaterThan(50);
      expect(healed.bodyPartHealth?.head).toBeLessThanOrEqual(100);
    });

    it("should not heal if player has no damage", () => {
      const player = createTestPlayer();
      const initialized = initializeBodyPartHealthForPlayer(player);

      const healed = healBodyPartsProportionally(initialized, 50);

      expect(healed).toBe(initialized);
    });

    it("should handle player without body part health", () => {
      const player = createTestPlayer();

      const healed = healBodyPartsProportionally(player, 50);

      expect(healed).toBe(player);
    });
  });
});
