/**
 * Unit tests for PlayerEffectManager
 * 
 * Tests effect tracking, expiration, removal, combat modifiers,
 * and player state management.
 */

import { describe, it, expect } from "vitest";
import {
  addEffectsToPlayer,
  removeExpiredEffects,
  removeEffectById,
  removeEffectsByType,
  clearAllEffects,
  getEffectModifiers,
  hasEffect,
  getEffectsByType,
  getActiveEffectCount,
  canAddMoreEffects,
} from "./PlayerEffectManager";
import { PlayerArchetype, TrigramStance, VitalPointEffectType } from "../types/common";
import { EffectIntensity } from "./effects";
import { StatusEffect } from "./types";
import { PlayerState } from "./player";
import { CombatState } from "../types";
import { MAX_CONCURRENT_EFFECTS } from "./EffectCalculator";

describe("PlayerEffectManager", () => {
  const createMockPlayer = (): PlayerState => ({
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
    attackPower: 15,
    defense: 12,
    speed: 10,
    technique: 14,
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
  });

  const createMockEffect = (
    id: string,
    type: VitalPointEffectType,
    endTime: number
  ): StatusEffect => ({
    id,
    type,
    intensity: EffectIntensity.MEDIUM,
    duration: 2000,
    description: { korean: "효과", english: "Effect" },
    stackable: true,
    source: "test",
    startTime: Date.now(),
    endTime,
  });

  describe("addEffectsToPlayer", () => {
    it("should add effects to player with empty effect list", () => {
      const player = createMockPlayer();
      const effects = [
        createMockEffect("effect1", VitalPointEffectType.PAIN, Date.now() + 5000),
      ];

      const updatedPlayer = addEffectsToPlayer(player, effects);

      expect(updatedPlayer.statusEffects).toHaveLength(1);
      expect(updatedPlayer.activeEffects).toHaveLength(1);
      expect(updatedPlayer.activeEffects[0]).toBe("effect1");
    });

    it("should add multiple effects", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      const effects = [
        createMockEffect("effect1", VitalPointEffectType.PAIN, currentTime + 5000),
        createMockEffect("effect2", VitalPointEffectType.STUN, currentTime + 5000),
      ];

      const updatedPlayer = addEffectsToPlayer(player, effects);

      expect(updatedPlayer.statusEffects).toHaveLength(2);
      expect(updatedPlayer.activeEffects).toHaveLength(2);
    });

    it("should respect MAX_CONCURRENT_EFFECTS limit", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();

      // Add more effects than allowed
      const effects = Array.from({ length: 10 }, (_, i) =>
        createMockEffect(`effect${i}`, VitalPointEffectType.PAIN, currentTime + 5000)
      );

      const updatedPlayer = addEffectsToPlayer(player, effects);

      expect(updatedPlayer.statusEffects.length).toBeLessThanOrEqual(MAX_CONCURRENT_EFFECTS);
      expect(updatedPlayer.activeEffects.length).toBeLessThanOrEqual(MAX_CONCURRENT_EFFECTS);
    });
  });

  describe("removeExpiredEffects", () => {
    it("should remove effects that have expired", () => {
      const currentTime = Date.now();
      const player = createMockPlayer();
      player.statusEffects = [
        createMockEffect("expired", VitalPointEffectType.PAIN, currentTime - 1000),
        createMockEffect("active", VitalPointEffectType.STUN, currentTime + 5000),
      ];
      player.activeEffects = ["expired", "active"];

      const updatedPlayer = removeExpiredEffects(player, currentTime);

      expect(updatedPlayer.statusEffects).toHaveLength(1);
      expect(updatedPlayer.statusEffects[0].id).toBe("active");
      expect(updatedPlayer.activeEffects).toHaveLength(1);
      expect(updatedPlayer.activeEffects[0]).toBe("active");
    });

    it("should keep all effects if none expired", () => {
      const currentTime = Date.now();
      const player = createMockPlayer();
      player.statusEffects = [
        createMockEffect("effect1", VitalPointEffectType.PAIN, currentTime + 5000),
        createMockEffect("effect2", VitalPointEffectType.STUN, currentTime + 5000),
      ];
      player.activeEffects = ["effect1", "effect2"];

      const updatedPlayer = removeExpiredEffects(player, currentTime);

      expect(updatedPlayer.statusEffects).toHaveLength(2);
      expect(updatedPlayer.activeEffects).toHaveLength(2);
    });
  });

  describe("removeEffectById", () => {
    it("should remove specific effect by ID", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("effect1", VitalPointEffectType.PAIN, currentTime + 5000),
        createMockEffect("effect2", VitalPointEffectType.STUN, currentTime + 5000),
      ];
      player.activeEffects = ["effect1", "effect2"];

      const updatedPlayer = removeEffectById(player, "effect1");

      expect(updatedPlayer.statusEffects).toHaveLength(1);
      expect(updatedPlayer.statusEffects[0].id).toBe("effect2");
      expect(updatedPlayer.activeEffects).toHaveLength(1);
    });

    it("should do nothing if effect ID not found", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("effect1", VitalPointEffectType.PAIN, currentTime + 5000),
      ];
      player.activeEffects = ["effect1"];

      const updatedPlayer = removeEffectById(player, "nonexistent");

      expect(updatedPlayer.statusEffects).toHaveLength(1);
      expect(updatedPlayer.activeEffects).toHaveLength(1);
    });
  });

  describe("removeEffectsByType", () => {
    it("should remove all effects of specific type", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("pain1", VitalPointEffectType.PAIN, currentTime + 5000),
        createMockEffect("pain2", VitalPointEffectType.PAIN, currentTime + 5000),
        createMockEffect("stun", VitalPointEffectType.STUN, currentTime + 5000),
      ];
      player.activeEffects = ["pain1", "pain2", "stun"];

      const updatedPlayer = removeEffectsByType(player, VitalPointEffectType.PAIN);

      expect(updatedPlayer.statusEffects).toHaveLength(1);
      expect(updatedPlayer.statusEffects[0].type).toBe(VitalPointEffectType.STUN);
      expect(updatedPlayer.activeEffects).toHaveLength(1);
    });
  });

  describe("clearAllEffects", () => {
    it("should remove all effects from player", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("effect1", VitalPointEffectType.PAIN, currentTime + 5000),
        createMockEffect("effect2", VitalPointEffectType.STUN, currentTime + 5000),
        createMockEffect("effect3", VitalPointEffectType.PARALYSIS, currentTime + 5000),
      ];
      player.activeEffects = ["effect1", "effect2", "effect3"];

      const updatedPlayer = clearAllEffects(player);

      expect(updatedPlayer.statusEffects).toHaveLength(0);
      expect(updatedPlayer.activeEffects).toHaveLength(0);
    });
  });

  describe("getEffectModifiers", () => {
    it("should return no modifiers for player with no effects", () => {
      const player = createMockPlayer();

      const modifiers = getEffectModifiers(player);

      expect(modifiers.attackPower).toBe(1.0);
      expect(modifiers.defense).toBe(1.0);
      expect(modifiers.speed).toBe(1.0);
      expect(modifiers.technique).toBe(1.0);
      expect(modifiers.staminaRegen).toBe(1.0);
      expect(modifiers.kiRegen).toBe(1.0);
    });

    it("should apply unconsciousness effect (total incapacitation)", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("unconscious", VitalPointEffectType.UNCONSCIOUSNESS, currentTime + 5000),
      ];

      const modifiers = getEffectModifiers(player);

      expect(modifiers.attackPower).toBe(0);
      expect(modifiers.defense).toBe(0);
      expect(modifiers.speed).toBe(0);
      expect(modifiers.technique).toBe(0);
    });

    it("should apply paralysis effect (severe impairment)", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("paralysis", VitalPointEffectType.PARALYSIS, currentTime + 5000),
      ];

      const modifiers = getEffectModifiers(player);

      expect(modifiers.attackPower).toBe(0.3);
      expect(modifiers.speed).toBe(0.2);
      expect(modifiers.technique).toBe(0.4);
    });

    it("should apply pain effect (moderate impairment)", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("pain", VitalPointEffectType.PAIN, currentTime + 5000),
      ];

      const modifiers = getEffectModifiers(player);

      expect(modifiers.attackPower).toBe(0.7);
      expect(modifiers.defense).toBe(0.8);
      expect(modifiers.speed).toBe(0.8);
      expect(modifiers.technique).toBe(0.7);
    });

    it("should apply breathlessness effect (stamina focus)", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("breathless", VitalPointEffectType.BREATHLESSNESS, currentTime + 5000),
      ];

      const modifiers = getEffectModifiers(player);

      expect(modifiers.staminaRegen).toBe(0.3);
      expect(modifiers.speed).toBe(0.7);
    });

    it("should apply nerve disruption effect (ki focus)", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("nerve", VitalPointEffectType.NERVE_DISRUPTION, currentTime + 5000),
      ];

      const modifiers = getEffectModifiers(player);

      expect(modifiers.kiRegen).toBe(0.5);
      expect(modifiers.attackPower).toBe(0.8);
      expect(modifiers.technique).toBe(0.7);
    });

    it("should combine multiple effects multiplicatively", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("pain", VitalPointEffectType.PAIN, currentTime + 5000),
        createMockEffect("weakness", VitalPointEffectType.WEAKNESS, currentTime + 5000),
      ];

      const modifiers = getEffectModifiers(player);

      // Pain: 0.7, Weakness: 0.7 => Combined: 0.49
      expect(modifiers.attackPower).toBeCloseTo(0.49, 2);
    });
  });

  describe("hasEffect", () => {
    it("should return true if effect type is active", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("pain", VitalPointEffectType.PAIN, currentTime + 5000),
      ];

      expect(hasEffect(player, VitalPointEffectType.PAIN)).toBe(true);
    });

    it("should return false if effect type is not active", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("pain", VitalPointEffectType.PAIN, currentTime + 5000),
      ];

      expect(hasEffect(player, VitalPointEffectType.STUN)).toBe(false);
    });
  });

  describe("getEffectsByType", () => {
    it("should return all effects of specific type", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("pain1", VitalPointEffectType.PAIN, currentTime + 5000),
        createMockEffect("pain2", VitalPointEffectType.PAIN, currentTime + 5000),
        createMockEffect("stun", VitalPointEffectType.STUN, currentTime + 5000),
      ];

      const painEffects = getEffectsByType(player, VitalPointEffectType.PAIN);

      expect(painEffects).toHaveLength(2);
      expect(painEffects[0].type).toBe(VitalPointEffectType.PAIN);
      expect(painEffects[1].type).toBe(VitalPointEffectType.PAIN);
    });

    it("should return empty array if no effects of type", () => {
      const player = createMockPlayer();

      const effects = getEffectsByType(player, VitalPointEffectType.PAIN);

      expect(effects).toHaveLength(0);
    });
  });

  describe("getActiveEffectCount", () => {
    it("should return 0 for player with no effects", () => {
      const player = createMockPlayer();

      expect(getActiveEffectCount(player)).toBe(0);
    });

    it("should return correct count of active effects", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("effect1", VitalPointEffectType.PAIN, currentTime + 5000),
        createMockEffect("effect2", VitalPointEffectType.STUN, currentTime + 5000),
        createMockEffect("effect3", VitalPointEffectType.PARALYSIS, currentTime + 5000),
      ];

      expect(getActiveEffectCount(player)).toBe(3);
    });
  });

  describe("canAddMoreEffects", () => {
    it("should return true if under MAX_CONCURRENT_EFFECTS", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = [
        createMockEffect("effect1", VitalPointEffectType.PAIN, currentTime + 5000),
        createMockEffect("effect2", VitalPointEffectType.STUN, currentTime + 5000),
      ];

      expect(canAddMoreEffects(player)).toBe(true);
    });

    it("should return false if at MAX_CONCURRENT_EFFECTS", () => {
      const player = createMockPlayer();
      const currentTime = Date.now();
      player.statusEffects = Array.from({ length: MAX_CONCURRENT_EFFECTS }, (_, i) =>
        createMockEffect(`effect${i}`, VitalPointEffectType.PAIN, currentTime + 5000)
      );

      expect(canAddMoreEffects(player)).toBe(false);
    });
  });
});
