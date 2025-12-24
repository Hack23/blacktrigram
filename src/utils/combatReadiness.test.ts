/**
 * Combat Readiness Calculation Tests
 */

import { describe, it, expect } from "vitest";
import {
  calculateCombatReadiness,
  calculateBodyHealthPercentage,
  getCombatReadinessColor,
  getCombatReadinessLabel,
  getCombatReadinessBars,
  COMBAT_READINESS_THRESHOLDS,
} from "./combatReadiness";
import { createMockPlayerState } from "../test/test-utils";

describe("calculateBodyHealthPercentage", () => {
  it("should return 100% for full health on all body parts", () => {
    const bodyHealth = {
      head: 100,
      torsoUpper: 100,
      torsoLower: 100,
      armLeft: 100,
      armRight: 100,
      legLeft: 100,
      legRight: 100,
    };
    
    expect(calculateBodyHealthPercentage(bodyHealth)).toBe(100);
  });

  it("should return 0% when all body parts are at 0", () => {
    const bodyHealth = {
      head: 0,
      torsoUpper: 0,
      torsoLower: 0,
      armLeft: 0,
      armRight: 0,
      legLeft: 0,
      legRight: 0,
    };
    
    expect(calculateBodyHealthPercentage(bodyHealth)).toBe(0);
  });

  it("should calculate correct average for mixed health values", () => {
    const bodyHealth = {
      head: 80,
      torsoUpper: 90,
      torsoLower: 70,
      armLeft: 85,
      armRight: 75,
      legLeft: 65,
      legRight: 95,
    };
    
    // Average = (80+90+70+85+75+65+95)/7 = 560/7 = 80
    expect(calculateBodyHealthPercentage(bodyHealth)).toBe(80);
  });

  it("should handle one critically damaged body part", () => {
    const bodyHealth = {
      head: 20, // Critical damage
      torsoUpper: 100,
      torsoLower: 100,
      armLeft: 100,
      armRight: 100,
      legLeft: 100,
      legRight: 100,
    };
    
    // Average = (20+600)/7 = 620/7 ≈ 88.57 → 89 (rounded)
    const result = calculateBodyHealthPercentage(bodyHealth);
    expect(result).toBeGreaterThanOrEqual(88);
    expect(result).toBeLessThanOrEqual(89);
  });

  it("should throw error for null bodyHealth", () => {
    expect(() => calculateBodyHealthPercentage(null as any)).toThrow(
      "bodyHealth cannot be null or undefined"
    );
  });

  it("should throw error for undefined bodyHealth", () => {
    expect(() => calculateBodyHealthPercentage(undefined as any)).toThrow(
      "bodyHealth cannot be null or undefined"
    );
  });
});

describe("calculateCombatReadiness", () => {
  it("should return 100% for perfect condition player", () => {
    const player = createMockPlayerState({
      bodyPartHealth: {
        head: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
      pain: 0,
      consciousness: 100,
      balance: 100,
    });
    
    const readiness = calculateCombatReadiness(player);
    expect(readiness).toBe(100);
  });

  it("should return 0% for completely incapacitated player", () => {
    const player = createMockPlayerState({
      bodyPartHealth: {
        head: 0,
        torsoUpper: 0,
        torsoLower: 0,
        armLeft: 0,
        armRight: 0,
        legLeft: 0,
        legRight: 0,
      },
      pain: 100,
      consciousness: 0,
      balance: 0,
    });
    
    const readiness = calculateCombatReadiness(player);
    expect(readiness).toBe(0);
  });

  it("should correctly weight body health (40%)", () => {
    // Player with only body health affected
    const player = createMockPlayerState({
      bodyPartHealth: {
        head: 50,
        torsoUpper: 50,
        torsoLower: 50,
        armLeft: 50,
        armRight: 50,
        legLeft: 50,
        legRight: 50,
      },
      pain: 0,
      consciousness: 100,
      balance: 100,
    });
    
    // Expected: 50% body health * 0.4 + 100% * 0.6 = 20 + 60 = 80%
    const readiness = calculateCombatReadiness(player);
    expect(readiness).toBe(80);
  });

  it("should correctly weight pain (20%)", () => {
    // Player with only pain affected
    const player = createMockPlayerState({
      bodyPartHealth: {
        head: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
      pain: 50, // 50% pain
      consciousness: 100,
      balance: 100,
    });
    
    // Expected: 100% * 0.4 + 50% pain reduction * 0.2 + 100% * 0.4 = 40 + 10 + 40 = 90%
    const readiness = calculateCombatReadiness(player);
    expect(readiness).toBe(90);
  });

  it("should correctly weight consciousness (20%)", () => {
    // Player with only consciousness affected
    const player = createMockPlayerState({
      bodyPartHealth: {
        head: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
      pain: 0,
      consciousness: 50,
      balance: 100,
    });
    
    // Expected: 100% * 0.4 + 100% * 0.2 + 50% * 0.2 + 100% * 0.2 = 40 + 20 + 10 + 20 = 90%
    const readiness = calculateCombatReadiness(player);
    expect(readiness).toBe(90);
  });

  it("should correctly weight balance (20%)", () => {
    // Player with only balance affected
    const player = createMockPlayerState({
      bodyPartHealth: {
        head: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
      pain: 0,
      consciousness: 100,
      balance: 50,
    });
    
    // Expected: 100% * 0.4 + 100% * 0.2 + 100% * 0.2 + 50% * 0.2 = 40 + 20 + 20 + 10 = 90%
    const readiness = calculateCombatReadiness(player);
    expect(readiness).toBe(90);
  });

  it("should handle realistic combat scenario - moderate damage", () => {
    const player = createMockPlayerState({
      bodyPartHealth: {
        head: 80,
        torsoUpper: 70,
        torsoLower: 75,
        armLeft: 90,
        armRight: 65,
        legLeft: 85,
        legRight: 70,
      }, // Average: 76.4%
      pain: 35,
      consciousness: 85,
      balance: 70,
    });
    
    // Expected breakdown:
    // Body: 76.4 * 0.4 = 30.56
    // Pain: (100-35) * 0.2 = 13
    // Consciousness: 85 * 0.2 = 17
    // Balance: 70 * 0.2 = 14
    // Total: ~75%
    const readiness = calculateCombatReadiness(player);
    expect(readiness).toBeGreaterThanOrEqual(74);
    expect(readiness).toBeLessThanOrEqual(76);
  });

  it("should handle realistic combat scenario - heavy damage", () => {
    const player = createMockPlayerState({
      bodyPartHealth: {
        head: 45,
        torsoUpper: 60,
        torsoLower: 50,
        armLeft: 70,
        armRight: 40,
        legLeft: 55,
        legRight: 65,
      }, // Average: 55%
      pain: 65,
      consciousness: 50,
      balance: 45,
    });
    
    // Expected breakdown:
    // Body: 55 * 0.4 = 22
    // Pain: (100-65) * 0.2 = 7
    // Consciousness: 50 * 0.2 = 10
    // Balance: 45 * 0.2 = 9
    // Total: ~48%
    const readiness = calculateCombatReadiness(player);
    expect(readiness).toBeGreaterThanOrEqual(47);
    expect(readiness).toBeLessThanOrEqual(49);
  });

  it("should clamp result to 0-100 range", () => {
    // Test lower bound
    const player1 = createMockPlayerState({
      bodyPartHealth: {
        head: -10,
        torsoUpper: -10,
        torsoLower: -10,
        armLeft: -10,
        armRight: -10,
        legLeft: -10,
        legRight: -10,
      },
      pain: 150,
      consciousness: -10,
      balance: -10,
    });
    
    expect(calculateCombatReadiness(player1)).toBe(0);
    
    // Test upper bound (shouldn't exceed 100)
    const player2 = createMockPlayerState({
      bodyPartHealth: {
        head: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
      pain: 0,
      consciousness: 100,
      balance: 100,
    });
    
    expect(calculateCombatReadiness(player2)).toBe(100);
  });

  it("should complete calculation in under 1ms (performance requirement)", () => {
    const player = createMockPlayerState({});
    const iterations = 1000;
    
    const startTime = performance.now();
    for (let i = 0; i < iterations; i++) {
      calculateCombatReadiness(player);
    }
    const endTime = performance.now();
    
    const avgTime = (endTime - startTime) / iterations;
    expect(avgTime).toBeLessThan(1);
  });

  it("should throw error for null player", () => {
    expect(() => calculateCombatReadiness(null as any)).toThrow(
      "player cannot be null or undefined"
    );
  });

  it("should throw error for undefined player", () => {
    expect(() => calculateCombatReadiness(undefined as any)).toThrow(
      "player cannot be null or undefined"
    );
  });

  it("should handle player with maxHealth of 0 safely", () => {
    const player = createMockPlayerState({
      health: 50,
      maxHealth: 0, // Edge case: prevent division by zero
      pain: 0,
      consciousness: 100,
      balance: 100,
    });

    const readiness = calculateCombatReadiness(player);
    // Should not crash and should return a valid number
    expect(typeof readiness).toBe("number");
    expect(readiness).toBeGreaterThanOrEqual(0);
    expect(readiness).toBeLessThanOrEqual(100);
  });
});

describe("getCombatReadinessColor", () => {
  it("should return green for 100-80% (full capability)", () => {
    expect(getCombatReadinessColor(100)).toBe(COMBAT_READINESS_THRESHOLDS.FULL_CAPABILITY.color);
    expect(getCombatReadinessColor(90)).toBe(COMBAT_READINESS_THRESHOLDS.FULL_CAPABILITY.color);
    expect(getCombatReadinessColor(80)).toBe(COMBAT_READINESS_THRESHOLDS.FULL_CAPABILITY.color);
  });

  it("should return yellow for 79-60% (light impairment)", () => {
    expect(getCombatReadinessColor(79)).toBe(COMBAT_READINESS_THRESHOLDS.LIGHT_IMPAIRMENT.color);
    expect(getCombatReadinessColor(70)).toBe(COMBAT_READINESS_THRESHOLDS.LIGHT_IMPAIRMENT.color);
    expect(getCombatReadinessColor(60)).toBe(COMBAT_READINESS_THRESHOLDS.LIGHT_IMPAIRMENT.color);
  });

  it("should return orange for 59-40% (moderate impairment)", () => {
    expect(getCombatReadinessColor(59)).toBe(COMBAT_READINESS_THRESHOLDS.MODERATE_IMPAIRMENT.color);
    expect(getCombatReadinessColor(50)).toBe(COMBAT_READINESS_THRESHOLDS.MODERATE_IMPAIRMENT.color);
    expect(getCombatReadinessColor(40)).toBe(COMBAT_READINESS_THRESHOLDS.MODERATE_IMPAIRMENT.color);
  });

  it("should return red for 39-20% (heavy impairment)", () => {
    expect(getCombatReadinessColor(39)).toBe(COMBAT_READINESS_THRESHOLDS.HEAVY_IMPAIRMENT.color);
    expect(getCombatReadinessColor(30)).toBe(COMBAT_READINESS_THRESHOLDS.HEAVY_IMPAIRMENT.color);
    expect(getCombatReadinessColor(20)).toBe(COMBAT_READINESS_THRESHOLDS.HEAVY_IMPAIRMENT.color);
  });

  it("should return dark red for 19-0% (critical)", () => {
    expect(getCombatReadinessColor(19)).toBe(COMBAT_READINESS_THRESHOLDS.CRITICAL.color);
    expect(getCombatReadinessColor(10)).toBe(COMBAT_READINESS_THRESHOLDS.CRITICAL.color);
    expect(getCombatReadinessColor(0)).toBe(COMBAT_READINESS_THRESHOLDS.CRITICAL.color);
  });

  it("should throw error for NaN readiness", () => {
    expect(() => getCombatReadinessColor(NaN)).toThrow("readiness cannot be NaN");
  });
});

describe("getCombatReadinessLabel", () => {
  it("should return correct Korean/English labels for all thresholds", () => {
    const fullCap = getCombatReadinessLabel(85);
    expect(fullCap.korean).toBe("전투 준비");
    expect(fullCap.english).toBe("Combat Ready");

    const light = getCombatReadinessLabel(70);
    expect(light.korean).toBe("경미 손상");
    expect(light.english).toBe("Light Damage");

    const moderate = getCombatReadinessLabel(50);
    expect(moderate.korean).toBe("중간 손상");
    expect(moderate.english).toBe("Moderate Damage");

    const heavy = getCombatReadinessLabel(30);
    expect(heavy.korean).toBe("중증 손상");
    expect(heavy.english).toBe("Heavy Damage");

    const critical = getCombatReadinessLabel(10);
    expect(critical.korean).toBe("위급 상태");
    expect(critical.english).toBe("Critical");
  });

  it("should throw error for NaN readiness", () => {
    expect(() => getCombatReadinessLabel(NaN)).toThrow("readiness cannot be NaN");
  });
});

describe("getCombatReadinessBars", () => {
  it("should return 10 bars for 100% readiness", () => {
    expect(getCombatReadinessBars(100, 10)).toBe(10);
  });

  it("should return 0 bars for 0% readiness", () => {
    expect(getCombatReadinessBars(0, 10)).toBe(0);
  });

  it("should return 5 bars for 50% readiness", () => {
    expect(getCombatReadinessBars(50, 10)).toBe(5);
  });

  it("should return 8 bars for 80% readiness", () => {
    expect(getCombatReadinessBars(80, 10)).toBe(8);
  });

  it("should return 1 bar for 5% readiness (ceil)", () => {
    expect(getCombatReadinessBars(5, 10)).toBe(1);
  });

  it("should return 1 bar for 1% readiness (minimal feedback)", () => {
    expect(getCombatReadinessBars(1, 10)).toBe(1);
  });

  it("should return 1 bar for 0.1% readiness (ceil behavior)", () => {
    expect(getCombatReadinessBars(0.1, 10)).toBe(1);
  });

  it("should handle custom bar counts", () => {
    expect(getCombatReadinessBars(100, 20)).toBe(20);
    expect(getCombatReadinessBars(50, 20)).toBe(10);
    expect(getCombatReadinessBars(25, 20)).toBe(5);
  });

  it("should clamp to valid range", () => {
    expect(getCombatReadinessBars(-10, 10)).toBe(0);
    expect(getCombatReadinessBars(150, 10)).toBe(10);
  });

  it("should handle boundary values correctly", () => {
    expect(getCombatReadinessBars(10, 10)).toBe(1); // Exactly 10%
    expect(getCombatReadinessBars(99, 10)).toBe(10); // Just below 100%
    expect(getCombatReadinessBars(91, 10)).toBe(10); // 91% should show 10 bars
  });

  it("should throw error for NaN readiness", () => {
    expect(() => getCombatReadinessBars(NaN, 10)).toThrow("readiness cannot be NaN");
  });

  it("should throw error for invalid totalBars", () => {
    expect(() => getCombatReadinessBars(50, 0)).toThrow(
      "totalBars must be a positive integer"
    );
    expect(() => getCombatReadinessBars(50, -5)).toThrow(
      "totalBars must be a positive integer"
    );
    expect(() => getCombatReadinessBars(50, 5.5)).toThrow(
      "totalBars must be a positive integer"
    );
  });
});
