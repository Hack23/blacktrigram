/**
 * Unit tests for player3DHelpers utility functions
 */

import { describe, it, expect } from "vitest";
import {
  getBalanceState,
  getPlayerAnimation,
  convertPlayerStateToProps,
} from "./player3DHelpers";
import type { PlayerState } from "../systems";
import { PlayerArchetype, TrigramStance, CombatState } from "../types/common";

describe("player3DHelpers", () => {
  describe("getBalanceState", () => {
    it("should return READY for balance >= 80", () => {
      expect(getBalanceState(100)).toBe("READY");
      expect(getBalanceState(80)).toBe("READY");
    });

    it("should return SHAKEN for balance 50-79", () => {
      expect(getBalanceState(79)).toBe("SHAKEN");
      expect(getBalanceState(50)).toBe("SHAKEN");
    });

    it("should return VULNERABLE for balance 20-49", () => {
      expect(getBalanceState(49)).toBe("VULNERABLE");
      expect(getBalanceState(20)).toBe("VULNERABLE");
    });

    it("should return HELPLESS for balance < 20", () => {
      expect(getBalanceState(19)).toBe("HELPLESS");
      expect(getBalanceState(0)).toBe("HELPLESS");
    });
  });

  describe("getPlayerAnimation", () => {
    const basePlayer: PlayerState = {
      id: "test",
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
      attackPower: 10,
      defense: 10,
      speed: 10,
      technique: 10,
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

    it("should return 'hit' when stunned", () => {
      const player = { ...basePlayer, isStunned: true };
      expect(getPlayerAnimation(player)).toBe("hit");
    });

    it("should return 'defend' when blocking", () => {
      const player = { ...basePlayer, isBlocking: true };
      expect(getPlayerAnimation(player)).toBe("defend");
    });

    it("should return 'counter' when countering", () => {
      const player = { ...basePlayer, isCountering: true };
      expect(getPlayerAnimation(player)).toBe("counter");
    });

    it("should return 'attack' when in attacking state", () => {
      const player = { ...basePlayer, combatState: CombatState.ATTACKING };
      expect(getPlayerAnimation(player)).toBe("attack");
    });

    it("should return 'defend' when in defending state", () => {
      const player = { ...basePlayer, combatState: CombatState.DEFENDING };
      expect(getPlayerAnimation(player)).toBe("defend");
    });

    it("should return 'idle' when in idle state", () => {
      const player = { ...basePlayer, combatState: CombatState.IDLE };
      expect(getPlayerAnimation(player)).toBe("idle");
    });

    it("should return 'idle' when in recovering state", () => {
      const player = { ...basePlayer, combatState: CombatState.RECOVERING };
      expect(getPlayerAnimation(player)).toBe("idle");
    });
  });

  describe("convertPlayerStateToProps", () => {
    const basePlayer: PlayerState = {
      id: "test-player",
      name: { korean: "무사", english: "Musa" },
      archetype: PlayerArchetype.MUSA,
      health: 80,
      maxHealth: 100,
      ki: 60,
      maxKi: 100,
      stamina: 70,
      maxStamina: 100,
      energy: 100,
      maxEnergy: 100,
      attackPower: 15,
      defense: 12,
      speed: 10,
      technique: 14,
      pain: 20,
      consciousness: 100,
      balance: 75,
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

    it("should convert PlayerState to Player3DUnifiedProps", () => {
      const props = convertPlayerStateToProps(basePlayer, [0, 0, 0], 0);

      expect(props.playerId).toBe("test-player");
      expect(props.archetype).toBe(PlayerArchetype.MUSA);
      expect(props.stance).toBe(TrigramStance.GEON);
      expect(props.health).toBe(80);
      expect(props.maxHealth).toBe(100);
      expect(props.stamina).toBe(70);
      expect(props.ki).toBe(60);
      expect(props.pain).toBe(20);
      expect(props.consciousness).toBe(100);
      expect(props.balance).toBe("SHAKEN"); // 75 -> SHAKEN
      expect(props.currentAnimation).toBe("idle");
    });

    it("should handle custom position and rotation", () => {
      const props = convertPlayerStateToProps(
        basePlayer,
        [-3, 0, 2],
        Math.PI / 2
      );

      expect(props.position).toEqual([-3, 0, 2]);
      expect(props.rotation).toBe(Math.PI / 2);
    });

    it("should handle options", () => {
      const props = convertPlayerStateToProps(
        basePlayer,
        [0, 0, 0],
        0,
        {
          isMobile: true,
          showVitalPoints: true,
          facing: "left",
          scale: 1.5,
        }
      );

      expect(props.isMobile).toBe(true);
      expect(props.showVitalPoints).toBe(true);
      expect(props.facing).toBe("left");
      expect(props.scale).toBe(1.5);
    });

    it("should handle attacking state", () => {
      const attackingPlayer = {
        ...basePlayer,
        combatState: CombatState.ATTACKING,
      };
      const props = convertPlayerStateToProps(attackingPlayer, [0, 0, 0], 0);

      expect(props.isAttacking).toBe(true);
      expect(props.currentAnimation).toBe("attack");
    });

    it("should handle blocking state", () => {
      const blockingPlayer = {
        ...basePlayer,
        isBlocking: true,
      };
      const props = convertPlayerStateToProps(blockingPlayer, [0, 0, 0], 0);

      expect(props.isBlocking).toBe(true);
      expect(props.currentAnimation).toBe("defend");
    });
  });
});
