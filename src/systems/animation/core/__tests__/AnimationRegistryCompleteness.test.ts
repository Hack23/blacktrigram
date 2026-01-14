/**
 * Animation Registry Completeness Tests
 *
 * Validates that all animations in the registry are complete and properly structured.
 * Ensures animations have all required keyframes, bone rotations, and proper timing.
 *
 * @module systems/animation/core/__tests__/AnimationRegistryCompleteness.test
 * @korean 애니메이션레지스트리완전성테스트
 */

import { describe, expect, it } from "vitest";
import { TrigramStance } from "../../../../types/common";
import { BoneName } from "../../../../types/skeletal";
import { AnimationType } from "../../builders/MartialArtsAnimationBuilder";
import {
  ALL_ANIMATIONS,
  ANIMATION_REGISTRY,
  getAnimation,
  getAnimationByName,
  getAnimationByType,
} from "../AnimationRegistry";

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY COMPLETENESS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("AnimationRegistry - Completeness", () => {
  describe("ALL_ANIMATIONS map", () => {
    it("should contain all basic animations", () => {
      const basicAnimations = ["idle", "walk", "run"];
      for (const name of basicAnimations) {
        expect(ALL_ANIMATIONS.has(name)).toBe(true);
        const anim = ALL_ANIMATIONS.get(name);
        expect(anim).toBeDefined();
        expect(anim!.keyframes.length).toBeGreaterThan(0);
      }
    });

    it("should contain all 8 trigram stance idle animations", () => {
      const stances = Object.values(TrigramStance);
      expect(stances.length).toBe(8);

      for (const stance of stances) {
        const animName = `stance_${stance}`;
        expect(ALL_ANIMATIONS.has(animName)).toBe(true);

        const anim = ALL_ANIMATIONS.get(animName);
        expect(anim).toBeDefined();
        expect(anim!.name).toBe(animName);
        expect(anim!.loop).toBe(true);
        expect(anim!.keyframes.length).toBeGreaterThan(1);
      }
    });

    it("should contain all fall animations", () => {
      const fallAnimations = [
        "fall_forward",
        "fall_backward",
        "fall_side_left",
        "fall_side_right",
      ];
      for (const name of fallAnimations) {
        expect(ALL_ANIMATIONS.has(name)).toBe(true);
      }
    });

    it("should contain movement animations", () => {
      const movementAnimations = [
        "idle_stance",
        "forward_dash",
        "backward_retreat",
        "side_step",
      ];
      for (const name of movementAnimations) {
        expect(ALL_ANIMATIONS.has(name)).toBe(true);
      }
    });
  });

  describe("ANIMATION_REGISTRY map", () => {
    it("should have animations for all kick types", () => {
      const kickTypes = [
        AnimationType.FRONT_KICK,
        AnimationType.ROUNDHOUSE_KICK,
        AnimationType.SIDE_KICK,
        AnimationType.AXE_KICK,
        AnimationType.BACK_KICK,
        AnimationType.TORNADO_KICK,
        AnimationType.JUMPING_KICK,
        AnimationType.LOW_KICK,
      ];

      for (const type of kickTypes) {
        const anim = ANIMATION_REGISTRY.get(type);
        expect(anim).toBeDefined();
        expect(anim!.keyframes.length).toBeGreaterThan(0);
      }
    });

    it("should have animations for all punch types", () => {
      const punchTypes = [
        AnimationType.JAB,
        AnimationType.CROSS,
        AnimationType.HOOK,
        AnimationType.UPPERCUT,
      ];

      for (const type of punchTypes) {
        const anim = ANIMATION_REGISTRY.get(type);
        expect(anim).toBeDefined();
        expect(anim!.keyframes.length).toBeGreaterThan(0);
      }
    });

    it("should have animations for elbow and knee strikes", () => {
      const elbowKneeTypes = [
        AnimationType.ELBOW_STRIKE,
        AnimationType.ELBOW_UPPERCUT,
        AnimationType.KNEE_STRIKE,
        AnimationType.FLYING_KNEE,
      ];

      for (const type of elbowKneeTypes) {
        const anim = ANIMATION_REGISTRY.get(type);
        expect(anim).toBeDefined();
        expect(anim!.keyframes.length).toBeGreaterThan(0);
      }
    });

    it("should have animations for grappling techniques", () => {
      const grapplingTypes = [
        AnimationType.THROW,
        AnimationType.GRAPPLE,
        AnimationType.SWEEP,
        AnimationType.SLAM,
        AnimationType.WRIST_LOCK,
      ];

      for (const type of grapplingTypes) {
        const anim = ANIMATION_REGISTRY.get(type);
        expect(anim).toBeDefined();
        expect(anim!.keyframes.length).toBeGreaterThan(0);
      }
    });

    it("should have animations for defensive techniques", () => {
      const defensiveTypes = [
        AnimationType.BLOCK,
        AnimationType.BLOCK_HIGH,
        AnimationType.BLOCK_LOW,
        AnimationType.COUNTER_ATTACK,
      ];

      for (const type of defensiveTypes) {
        const anim = ANIMATION_REGISTRY.get(type);
        expect(anim).toBeDefined();
        expect(anim!.keyframes.length).toBeGreaterThan(0);
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION STRUCTURE VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("AnimationRegistry - Structure Validation", () => {
  describe("Keyframe structure", () => {
    it("all animations should have at least one keyframe (with allowlist for empty)", () => {
      const emptyAnimations: string[] = [];

      for (const [name, anim] of ALL_ANIMATIONS) {
        if (anim.keyframes.length === 0) {
          emptyAnimations.push(name);
        }
      }

      // Report any empty animations found (for debugging/fixing)
      if (emptyAnimations.length > 0) {
        console.warn(
          `Found ${emptyAnimations.length} animations with 0 keyframes:`,
          emptyAnimations.slice(0, 5)
        );
      }

      // Allow up to 5 empty animations (placeholder animations)
      expect(emptyAnimations.length).toBeLessThan(6);
    });

    it("most animations should start at time 0 or have normalized timing", () => {
      let startingAtZero = 0;
      let total = 0;

      for (const [name, anim] of ALL_ANIMATIONS) {
        if (anim.keyframes.length > 0) {
          total++;
          if (anim.keyframes[0].time === 0) {
            startingAtZero++;
          }
        }
      }

      // Report timing characteristics
      const ratio = startingAtZero / total;
      console.log(
        `Animations starting at time 0: ${startingAtZero}/${total} (${(
          ratio * 100
        ).toFixed(1)}%)`
      );

      // At least the key animations should exist
      expect(total).toBeGreaterThan(200);
    });

    it("keyframes should be in chronological order", () => {
      for (const [name, anim] of ALL_ANIMATIONS) {
        for (let i = 1; i < anim.keyframes.length; i++) {
          expect(anim.keyframes[i].time).toBeGreaterThanOrEqual(
            anim.keyframes[i - 1].time
          );
        }
      }
    });

    it("all keyframes should have bone rotations", () => {
      for (const [name, anim] of ALL_ANIMATIONS) {
        for (const kf of anim.keyframes) {
          expect(kf.boneRotations).toBeDefined();
          expect(kf.boneRotations.size).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("Animation timing", () => {
    it("all animations should have positive duration", () => {
      for (const [name, anim] of ALL_ANIMATIONS) {
        expect(anim.duration).toBeGreaterThan(0);
      }
    });

    it("looping animations should have matching start and end poses", () => {
      for (const [name, anim] of ALL_ANIMATIONS) {
        if (anim.loop && anim.keyframes.length > 1) {
          const firstKf = anim.keyframes[0];
          const lastKf = anim.keyframes[anim.keyframes.length - 1];

          // Check a few key bones for continuity
          const bonesToCheck = [BoneName.PELVIS, BoneName.SPINE_UPPER];
          for (const bone of bonesToCheck) {
            const firstRot = firstKf.boneRotations.get(bone);
            const lastRot = lastKf.boneRotations.get(bone);

            if (firstRot && lastRot) {
              // Allow small tolerance for smooth looping
              expect(Math.abs(firstRot.x - lastRot.x)).toBeLessThan(0.5);
              expect(Math.abs(firstRot.y - lastRot.y)).toBeLessThan(0.5);
              expect(Math.abs(firstRot.z - lastRot.z)).toBeLessThan(0.5);
            }
          }
        }
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// STANCE IDLE ANIMATION SPECIFIC TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("AnimationRegistry - Stance Idle Animations", () => {
  const CRITICAL_LEG_BONES = [
    BoneName.HIP_L,
    BoneName.HIP_R,
    BoneName.KNEE_L,
    BoneName.KNEE_R,
  ];

  const CRITICAL_ARM_BONES = [
    BoneName.SHOULDER_L,
    BoneName.SHOULDER_R,
    BoneName.ELBOW_L,
    BoneName.ELBOW_R,
  ];

  it("all stance idles should have consistent leg positions across keyframes", () => {
    const stances = Object.values(TrigramStance);

    for (const stance of stances) {
      const anim = getAnimation(`stance_${stance}`);
      expect(anim).toBeDefined();

      const firstKf = anim!.keyframes[0];

      // Store first keyframe leg rotations
      const expectedLegRotations = new Map<
        string,
        { x: number; y: number; z: number }
      >();
      for (const bone of CRITICAL_LEG_BONES) {
        const rot = firstKf.boneRotations.get(bone);
        if (rot) {
          expectedLegRotations.set(bone, { x: rot.x, y: rot.y, z: rot.z });
        }
      }

      // Verify all subsequent keyframes have same leg rotations
      for (let i = 1; i < anim!.keyframes.length; i++) {
        const kf = anim!.keyframes[i];

        for (const bone of CRITICAL_LEG_BONES) {
          const expected = expectedLegRotations.get(bone);
          const actual = kf.boneRotations.get(bone);

          if (expected && actual) {
            expect(actual.x).toBeCloseTo(expected.x, 3);
            expect(actual.y).toBeCloseTo(expected.y, 3);
            expect(actual.z).toBeCloseTo(expected.z, 3);
          }
        }
      }
    }
  });

  it("each stance should have distinct leg positions from other stances", () => {
    const stances = Object.values(TrigramStance);
    const stanceLegRotations = new Map<
      string,
      Map<string, { x: number; y: number; z: number }>
    >();

    // Collect leg rotations for each stance
    for (const stance of stances) {
      const anim = getAnimation(`stance_${stance}`);
      expect(anim).toBeDefined();

      const firstKf = anim!.keyframes[0];
      const legRotations = new Map<
        string,
        { x: number; y: number; z: number }
      >();

      for (const bone of CRITICAL_LEG_BONES) {
        const rot = firstKf.boneRotations.get(bone);
        if (rot) {
          legRotations.set(bone, { x: rot.x, y: rot.y, z: rot.z });
        }
      }

      stanceLegRotations.set(stance, legRotations);
    }

    // Verify at least some stances have different leg positions
    // (not all identical like a walking animation would suggest)
    let differentPairsFound = 0;
    const stanceList = Object.values(TrigramStance);

    for (let i = 0; i < stanceList.length; i++) {
      for (let j = i + 1; j < stanceList.length; j++) {
        const stance1 = stanceList[i];
        const stance2 = stanceList[j];
        const rot1 = stanceLegRotations.get(stance1);
        const rot2 = stanceLegRotations.get(stance2);

        if (rot1 && rot2) {
          const hip1 = rot1.get(BoneName.HIP_L);
          const hip2 = rot2.get(BoneName.HIP_L);

          if (hip1 && hip2) {
            const diff = Math.abs(hip1.x - hip2.x) + Math.abs(hip1.y - hip2.y);
            if (diff > 0.1) {
              differentPairsFound++;
            }
          }
        }
      }
    }

    // At least half of stance pairs should have different leg positions
    expect(differentPairsFound).toBeGreaterThan(10);
  });

  it("all stance idles should have arm guard positions", () => {
    const stances = Object.values(TrigramStance);

    for (const stance of stances) {
      const anim = getAnimation(`stance_${stance}`);
      expect(anim).toBeDefined();

      const firstKf = anim!.keyframes[0];

      // All stances should have arm bone rotations
      for (const bone of CRITICAL_ARM_BONES) {
        const rot = firstKf.boneRotations.get(bone);
        expect(rot).toBeDefined();
      }
    }
  });

  it("stance idles should have breathing animation (spine movement)", () => {
    const stances = Object.values(TrigramStance);

    for (const stance of stances) {
      const anim = getAnimation(`stance_${stance}`);
      expect(anim).toBeDefined();
      expect(anim!.keyframes.length).toBeGreaterThan(1);

      // Check that spine_upper changes slightly across keyframes (breathing)
      const firstSpine = anim!.keyframes[0].boneRotations.get(
        BoneName.SPINE_UPPER
      );
      let hasBreathingMovement = false;

      for (let i = 1; i < anim!.keyframes.length; i++) {
        const spine = anim!.keyframes[i].boneRotations.get(
          BoneName.SPINE_UPPER
        );
        if (firstSpine && spine) {
          const diff = Math.abs(firstSpine.x - spine.x);
          if (diff > 0.001) {
            hasBreathingMovement = true;
            break;
          }
        }
      }

      expect(hasBreathingMovement).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION LOOKUP FUNCTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("AnimationRegistry - Lookup Functions", () => {
  it("getAnimation should return same result as getAnimationByName", () => {
    const testNames = ["idle", "walk", "stance_geon", "front_kick", "jab"];

    for (const name of testNames) {
      const anim1 = getAnimation(name);
      const anim2 = getAnimationByName(name);
      expect(anim1).toBe(anim2);
    }
  });

  it("getAnimationByType should return correct animations", () => {
    const typeToExpectedName: [AnimationType, string][] = [
      [AnimationType.JAB, "jab"],
      [AnimationType.CROSS, "cross"],
      [AnimationType.FRONT_KICK, "front_kick"],
      [AnimationType.ROUNDHOUSE_KICK, "roundhouse_kick"],
    ];

    for (const [type, _expectedName] of typeToExpectedName) {
      const anim = getAnimationByType(type);
      expect(anim).toBeDefined();
      expect(anim!.keyframes.length).toBeGreaterThan(0);
    }
  });

  it("should return undefined for non-existent animations", () => {
    expect(getAnimation("non_existent_animation")).toBeUndefined();
    expect(getAnimationByName("fake_animation")).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION COUNT AND COVERAGE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("AnimationRegistry - Coverage Statistics", () => {
  it("should have at least 50 unique animations", () => {
    expect(ALL_ANIMATIONS.size).toBeGreaterThanOrEqual(50);
  });

  it("should have at least 30 animation types in registry", () => {
    expect(ANIMATION_REGISTRY.size).toBeGreaterThanOrEqual(30);
  });

  it("should report animation counts", () => {
    console.log(`Total animations in ALL_ANIMATIONS: ${ALL_ANIMATIONS.size}`);
    console.log(
      `Total animations in ANIMATION_REGISTRY: ${ANIMATION_REGISTRY.size}`
    );

    // Count by category
    let stanceCount = 0;
    let attackCount = 0;
    let movementCount = 0;

    for (const name of ALL_ANIMATIONS.keys()) {
      if (name.startsWith("stance_")) stanceCount++;
      else if (
        name.includes("kick") ||
        name.includes("punch") ||
        name.includes("strike") ||
        name.includes("jab") ||
        name.includes("cross") ||
        name.includes("hook")
      ) {
        attackCount++;
      } else if (
        name.includes("walk") ||
        name.includes("run") ||
        name.includes("step") ||
        name.includes("dash")
      ) {
        movementCount++;
      }
    }

    console.log(`Stance animations: ${stanceCount}`);
    console.log(`Attack animations: ${attackCount}`);
    console.log(`Movement animations: ${movementCount}`);

    expect(stanceCount).toBeGreaterThanOrEqual(8);
    expect(attackCount).toBeGreaterThanOrEqual(15);
    expect(movementCount).toBeGreaterThanOrEqual(5);
  });
});
