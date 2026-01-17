/**
 * Animation Factory Presets Tests
 *
 * Tests for the animation factory functions that reduce code duplication.
 *
 * @module systems/animation/builders/AnimationFactoryPresets.test
 * @korean 애니메이션팩토리프리셋테스트
 */

import { describe, expect, it } from "vitest";
import { TrigramStance } from "../../../types/common";
import {
  createBothStances,
  createComboAnimation,
  createDefenseAnimation,
  createKickAnimation,
  createPunchAnimation,
  createTrigramBreathing,
  createTrigramLocomotion,
  PRESET_COMBOS,
  PRESET_KICKS,
  PRESET_PUNCHES,
  TIMING_PRESETS,
} from "./AnimationFactoryPresets";

// ═══════════════════════════════════════════════════════════════════════════
// KICK FACTORY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("createKickAnimation", () => {
  it("should create a front kick animation", () => {
    const kick = createKickAnimation({
      name: "test_front_kick",
      koreanName: "테스트앞차기",
      timing: TIMING_PRESETS.MEDIUM_LIGHT,
      kickType: "front",
    });

    expect(kick).toBeDefined();
    expect(kick.name).toBe("test_front_kick");
    expect(kick.koreanName).toBe("테스트앞차기");
    expect(kick.duration).toBe(TIMING_PRESETS.MEDIUM_LIGHT.total);
    expect(kick.type).toBe("attack");
    expect(kick.keyframes.length).toBeGreaterThanOrEqual(2);
  });

  it("should create a roundhouse kick animation", () => {
    const kick = createKickAnimation({
      name: "test_roundhouse",
      koreanName: "테스트돌려차기",
      timing: TIMING_PRESETS.HEAVY_LIGHT,
      kickType: "roundhouse",
      guardDuringKick: "high",
      guardAtPeak: "high",
    });

    expect(kick).toBeDefined();
    expect(kick.name).toBe("test_roundhouse");
    expect(kick.duration).toBe(TIMING_PRESETS.HEAVY_LIGHT.total);
  });

  it("should create a side kick animation", () => {
    const kick = createKickAnimation({
      name: "test_side_kick",
      koreanName: "테스트옆차기",
      timing: TIMING_PRESETS.MEDIUM_HEAVY,
      kickType: "side",
    });

    expect(kick).toBeDefined();
    expect(kick.name).toBe("test_side_kick");
  });

  it("should create all kick types without error", () => {
    const kickTypes = [
      "front",
      "roundhouse",
      "side",
      "axe",
      "back",
      "low",
      "crescent",
      "spin",
    ] as const;

    kickTypes.forEach((kickType) => {
      const kick = createKickAnimation({
        name: `test_${kickType}`,
        koreanName: `테스트${kickType}`,
        timing: TIMING_PRESETS.MEDIUM,
        kickType,
      });

      expect(kick).toBeDefined();
      expect(kick.keyframes.length).toBeGreaterThanOrEqual(2);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PUNCH FACTORY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("createPunchAnimation", () => {
  it("should create a jab animation", () => {
    const punch = createPunchAnimation({
      name: "test_jab",
      koreanName: "테스트잽",
      timing: TIMING_PRESETS.FAST,
      punchType: "jab",
      hand: "left",
    });

    expect(punch).toBeDefined();
    expect(punch.name).toBe("test_jab");
    expect(punch.duration).toBe(TIMING_PRESETS.FAST.total);
    expect(punch.type).toBe("attack");
  });

  it("should create a cross animation", () => {
    const punch = createPunchAnimation({
      name: "test_cross",
      koreanName: "테스트크로스",
      timing: TIMING_PRESETS.MEDIUM,
      punchType: "cross",
      hand: "right",
    });

    expect(punch).toBeDefined();
    expect(punch.name).toBe("test_cross");
  });

  it("should create all punch types without error", () => {
    const punchTypes = [
      "jab",
      "cross",
      "hook",
      "uppercut",
      "palm",
      "backfist",
    ] as const;

    punchTypes.forEach((punchType) => {
      const punch = createPunchAnimation({
        name: `test_${punchType}`,
        koreanName: `테스트${punchType}`,
        timing: TIMING_PRESETS.MEDIUM,
        punchType,
        hand: "left",
      });

      expect(punch).toBeDefined();
      expect(punch.keyframes.length).toBeGreaterThanOrEqual(2);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DEFENSE FACTORY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("createDefenseAnimation", () => {
  it("should create a high block animation", () => {
    const defense = createDefenseAnimation({
      name: "test_high_block",
      koreanName: "테스트상단막기",
      timing: TIMING_PRESETS.FAST,
      defenseType: "block",
      height: "high",
    });

    expect(defense).toBeDefined();
    expect(defense.type).toBe("defense");
  });

  it("should create all defense types without error", () => {
    const defenseTypes = ["block", "parry", "slip", "bob", "weave"] as const;
    const heights = ["high", "middle", "low"] as const;

    defenseTypes.forEach((defenseType) => {
      heights.forEach((height) => {
        const defense = createDefenseAnimation({
          name: `test_${defenseType}_${height}`,
          koreanName: `테스트${defenseType}${height}`,
          timing: TIMING_PRESETS.FAST,
          defenseType,
          height,
        });

        expect(defense).toBeDefined();
      });
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LOCOMOTION FACTORY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("createTrigramLocomotion", () => {
  it("should create walk animation for each trigram", () => {
    const stances: TrigramStance[] = [
      TrigramStance.GEON,
      TrigramStance.TAE,
      TrigramStance.LI,
      TrigramStance.JIN,
    ];

    stances.forEach((stance) => {
      const walk = createTrigramLocomotion({
        stance,
        type: "walk",
      });

      expect(walk).toBeDefined();
      expect(walk.type).toBe("movement");
      expect(walk.loop).toBe(true);
    });
  });

  it("should create idle animation", () => {
    const idle = createTrigramLocomotion({
      stance: TrigramStance.GEON,
      type: "idle",
    });

    expect(idle).toBeDefined();
    expect(idle.type).toBe("idle");
    expect(idle.loop).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// COMBO FACTORY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("createComboAnimation", () => {
  it("should create jab-cross combo", () => {
    const combo = createComboAnimation("jab_cross", "잽크로스", [
      "jab",
      "cross",
    ]);

    expect(combo).toBeDefined();
    expect(combo.name).toBe("jab_cross");
    expect(combo.type).toBe("attack");
    expect(combo.keyframes.length).toBeGreaterThanOrEqual(4);
  });

  it("should create multi-technique combo", () => {
    const combo = createComboAnimation("multi_combo", "멀티콤보", [
      "jab",
      "cross",
      "hook",
      "front_kick",
    ]);

    expect(combo).toBeDefined();
    expect(combo.keyframes.length).toBeGreaterThanOrEqual(8);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// STANCE MIRRORING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("createBothStances", () => {
  it("should create both orthodox and southpaw versions", () => {
    const kick = createKickAnimation({
      name: "test_kick",
      koreanName: "테스트킥",
      timing: TIMING_PRESETS.MEDIUM,
      kickType: "front",
    });

    const { orthodox, southpaw } = createBothStances(kick);

    expect(orthodox).toBeDefined();
    expect(southpaw).toBeDefined();
    expect(orthodox.name).toBe("test_kick");
    expect(southpaw.name).toBe("test_kick_southpaw");
    expect(southpaw.koreanName).toContain("사우스포");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TRIGRAM BREATHING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("createTrigramBreathing", () => {
  it("should create breathing animation for each trigram", () => {
    const stances: TrigramStance[] = [
      TrigramStance.GEON,
      TrigramStance.TAE,
      TrigramStance.LI,
      TrigramStance.JIN,
      TrigramStance.SON,
      TrigramStance.GAM,
      TrigramStance.GAN,
      TrigramStance.GON,
    ];

    stances.forEach((stance) => {
      const breathing = createTrigramBreathing(stance);

      expect(breathing).toBeDefined();
      expect(breathing.type).toBe("idle");
      expect(breathing.loop).toBe(true);
      expect(breathing.duration).toBe(3.0);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PRESET ANIMATIONS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("PRESET_KICKS", () => {
  it("should have all preset kick animations", () => {
    expect(PRESET_KICKS.FRONT_KICK).toBeDefined();
    expect(PRESET_KICKS.ROUNDHOUSE_KICK).toBeDefined();
    expect(PRESET_KICKS.SIDE_KICK).toBeDefined();
    expect(PRESET_KICKS.LOW_KICK).toBeDefined();
  });

  it("should have proper names for preset kicks", () => {
    expect(PRESET_KICKS.FRONT_KICK.name).toBe("front_kick");
    expect(PRESET_KICKS.ROUNDHOUSE_KICK.name).toBe("roundhouse_kick");
  });
});

describe("PRESET_PUNCHES", () => {
  it("should have all preset punch animations", () => {
    expect(PRESET_PUNCHES.JAB).toBeDefined();
    expect(PRESET_PUNCHES.CROSS).toBeDefined();
    expect(PRESET_PUNCHES.LEAD_HOOK).toBeDefined();
    expect(PRESET_PUNCHES.REAR_UPPERCUT).toBeDefined();
  });
});

describe("PRESET_COMBOS", () => {
  it("should have all preset combo animations", () => {
    expect(PRESET_COMBOS.JAB_CROSS).toBeDefined();
    expect(PRESET_COMBOS.ONE_TWO_HOOK).toBeDefined();
    expect(PRESET_COMBOS.JAB_CROSS_KICK).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TIMING PRESETS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("TIMING_PRESETS", () => {
  it("should have all standard timing presets", () => {
    expect(TIMING_PRESETS.FAST).toBeDefined();
    expect(TIMING_PRESETS.FAST_MEDIUM).toBeDefined();
    expect(TIMING_PRESETS.MEDIUM_LIGHT).toBeDefined();
    expect(TIMING_PRESETS.MEDIUM).toBeDefined();
    expect(TIMING_PRESETS.MEDIUM_HEAVY).toBeDefined();
    expect(TIMING_PRESETS.HEAVY_LIGHT).toBeDefined();
    expect(TIMING_PRESETS.HEAVY_MEDIUM).toBeDefined();
    expect(TIMING_PRESETS.HEAVY).toBeDefined();
  });

  it("should have consistent timing structure", () => {
    Object.entries(TIMING_PRESETS).forEach(([_name, timing]) => {
      expect(timing.chamber).toBeGreaterThan(0);
      expect(timing.extend).toBeGreaterThan(0);
      expect(timing.peak).toBeGreaterThan(0);
      expect(timing.retract).toBeGreaterThan(0);
      expect(timing.recover).toBeGreaterThan(0);
      expect(timing.total).toBeGreaterThan(0);

      // Total should be approximately the sum of phases
      const sum =
        timing.chamber +
        timing.extend +
        timing.peak +
        timing.retract +
        timing.recover;
      expect(timing.total).toBeCloseTo(sum, 1);
    });
  });
});
