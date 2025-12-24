/**
 * Unit tests for Pain and Consciousness utilities.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { PlayerArchetype, VitalPointCategory } from "@/types";
import { createPlayerFromArchetype } from "@/utils/playerUtils";
import type { PlayerState } from "../player";
import { PainResponseSystem, PainLevel, ShockPainEffect } from "./PainResponseSystem";
import { ConsciousnessSystem, ConsciousnessLevel } from "./ConsciousnessSystem";
import {
  getPainConsciousnessStatus,
  isHeadTraumaHit,
  extractVitalPointCategory,
  getRecommendedRecoveryTime,
  isShockPainActive,
  getShockPainRemainingDuration,
  formatPainConsciousnessDisplay,
} from "./painConsciousnessUtils";
import { CombatResult } from "./types";

describe("Pain and Consciousness Utilities", () => {
  let painSystem: PainResponseSystem;
  let consciousnessSystem: ConsciousnessSystem;
  let player: PlayerState;

  beforeEach(() => {
    painSystem = new PainResponseSystem();
    consciousnessSystem = new ConsciousnessSystem();
    player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  });

  describe("getPainConsciousnessStatus", () => {
    it("should return comprehensive status for healthy player", () => {
      const status = getPainConsciousnessStatus(player, painSystem, consciousnessSystem);

      expect(status.painLevel).toBe(PainLevel.MINIMAL);
      expect(status.consciousnessLevel).toBe(ConsciousnessLevel.COMBAT_ALERT);
      expect(status.isInPainOverload).toBe(false);
      expect(status.isIncapacitated).toBe(false);
      expect(status.isCombatEffective).toBe(true);
      expect(status.combatEffectiveness).toBeGreaterThan(0.9);
    });

    it("should detect pain overload", () => {
      const painfulPlayer = { ...player, pain: 85 };
      const status = getPainConsciousnessStatus(painfulPlayer, painSystem, consciousnessSystem);

      expect(status.isInPainOverload).toBe(true);
      expect(status.statusDescription.english).toContain("Pain Overload");
    });

    it("should detect incapacitation", () => {
      const incapacitatedPlayer = { ...player, consciousness: 15 };
      const status = getPainConsciousnessStatus(incapacitatedPlayer, painSystem, consciousnessSystem);

      expect(status.isIncapacitated).toBe(true);
      expect(status.statusDescription.english).toContain("Incapacitated");
    });

    it("should calculate combat effectiveness correctly", () => {
      const impairedPlayer = { ...player, pain: 50, consciousness: 60 };
      const status = getPainConsciousnessStatus(impairedPlayer, painSystem, consciousnessSystem);

      expect(status.combatEffectiveness).toBeLessThan(1.0);
      expect(status.combatEffectiveness).toBeGreaterThan(0.0);
    });

    it("should provide bilingual status descriptions", () => {
      const status = getPainConsciousnessStatus(player, painSystem, consciousnessSystem);

      expect(status.statusDescription.korean).toBeTruthy();
      expect(status.statusDescription.english).toBeTruthy();
    });
  });

  describe("isHeadTraumaHit", () => {
    it("should detect neurological hits as head trauma", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 15,
        criticalHit: false,
        vitalPointHit: true,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: {} as any,
        defender: {} as any,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      expect(isHeadTraumaHit(mockResult, VitalPointCategory.NEUROLOGICAL)).toBe(true);
    });

    it("should detect high vascular damage as head trauma", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 20,
        criticalHit: false,
        vitalPointHit: true,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: {} as any,
        defender: {} as any,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      expect(isHeadTraumaHit(mockResult, VitalPointCategory.VASCULAR)).toBe(true);
    });

    it("should detect high damage as potential head trauma", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 30,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: {} as any,
        defender: {} as any,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      expect(isHeadTraumaHit(mockResult)).toBe(true);
    });

    it("should detect critical vital point hits as head trauma", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 15,
        criticalHit: false,
        vitalPointHit: true,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: {} as any,
        defender: {} as any,
        success: true,
        isCritical: true,
        isBlocked: false,
      };

      expect(isHeadTraumaHit(mockResult)).toBe(true);
    });

    it("should NOT detect low damage hits as head trauma", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 10,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: {} as any,
        defender: {} as any,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      expect(isHeadTraumaHit(mockResult, VitalPointCategory.MUSCULAR)).toBe(false);
    });
  });

  describe("extractVitalPointCategory", () => {
    it("should extract neurological category from effect source", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 20,
        criticalHit: false,
        vitalPointHit: true,
        effects: [
          {
            id: "test",
            type: "weakened",
            intensity: "moderate" as any,
            duration: 2000,
            description: { korean: "신경 타격", english: "Nerve strike" },
            stackable: false,
            source: "neurological_strike",
            startTime: Date.now(),
            endTime: Date.now() + 2000,
          },
        ],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: {} as any,
        defender: {} as any,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      expect(extractVitalPointCategory(mockResult)).toBe(VitalPointCategory.NEUROLOGICAL);
    });

    it("should extract vascular category from effect source", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 20,
        criticalHit: false,
        vitalPointHit: true,
        effects: [
          {
            id: "test",
            type: "weakened",
            intensity: "moderate" as any,
            duration: 2000,
            description: { korean: "혈관 타격", english: "Vascular strike" },
            stackable: false,
            source: "vascular_blood_flow",
            startTime: Date.now(),
            endTime: Date.now() + 2000,
          },
        ],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: {} as any,
        defender: {} as any,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      expect(extractVitalPointCategory(mockResult)).toBe(VitalPointCategory.VASCULAR);
    });

    it("should return undefined for non-vital-point hits", () => {
      const mockResult: CombatResult = {
        hit: true,
        damage: 20,
        criticalHit: false,
        vitalPointHit: false,
        effects: [],
        timestamp: Date.now(),
        technique: {} as any,
        attacker: {} as any,
        defender: {} as any,
        success: true,
        isCritical: false,
        isBlocked: false,
      };

      expect(extractVitalPointCategory(mockResult)).toBeUndefined();
    });
  });

  describe("getRecommendedRecoveryTime", () => {
    it("should calculate recovery time for pain", () => {
      const painfulPlayer = { ...player, pain: 50 };
      const recoveryTime = getRecommendedRecoveryTime(painfulPlayer, consciousnessSystem);

      // 50 pain / 5 per second = 10 seconds
      expect(recoveryTime).toBe(10);
    });

    it("should calculate recovery time for consciousness", () => {
      const lowConsciousnessPlayer = { ...player, consciousness: 80 };
      const recoveryTime = getRecommendedRecoveryTime(lowConsciousnessPlayer, consciousnessSystem);

      // 20 consciousness to recover / 5 per second + 5 second delay = 9 seconds
      expect(recoveryTime).toBeGreaterThanOrEqual(9);
    });

    it("should account for slower recovery at low consciousness", () => {
      const stunnedPlayer = { ...player, consciousness: 30, pain: 0 };
      const alertPlayer = { ...player, consciousness: 95, pain: 0 };

      const stunnedRecovery = getRecommendedRecoveryTime(stunnedPlayer, consciousnessSystem);
      const alertRecovery = getRecommendedRecoveryTime(alertPlayer, consciousnessSystem);

      expect(stunnedRecovery).toBeGreaterThan(alertRecovery);
    });
  });

  describe("Shock Pain Utilities", () => {
    let shockEffect: ShockPainEffect;

    beforeEach(() => {
      shockEffect = {
        intensity: 0.2,
        duration: 2000,
        startTime: Date.now(),
        causedByDamage: 20,
      };
    });

    it("should detect active shock pain", () => {
      expect(isShockPainActive(shockEffect)).toBe(true);
    });

    it("should detect expired shock pain", () => {
      const expiredEffect = {
        ...shockEffect,
        startTime: Date.now() - 3000,
      };

      expect(isShockPainActive(expiredEffect)).toBe(false);
    });

    it("should calculate remaining duration", () => {
      const remaining = getShockPainRemainingDuration(shockEffect);

      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(2000);
    });

    it("should return 0 for expired effects", () => {
      const expiredEffect = {
        ...shockEffect,
        startTime: Date.now() - 3000,
      };

      expect(getShockPainRemainingDuration(expiredEffect)).toBe(0);
    });
  });

  describe("formatPainConsciousnessDisplay", () => {
    it("should format values for display", () => {
      const testPlayer = { ...player, pain: 45.7, consciousness: 82.3 };
      const display = formatPainConsciousnessDisplay(testPlayer);

      expect(display.pain).toBe("Pain: 45/100");
      expect(display.consciousness).toBe("Consciousness: 82/100");
    });

    it("should provide bilingual display strings", () => {
      const display = formatPainConsciousnessDisplay(player);

      expect(display.painKorean).toContain("고통");
      expect(display.consciousnessKorean).toContain("의식");
    });
  });
});
