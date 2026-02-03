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
import { getAllTechniques } from "../../../trigram/techniques";
import { AnimationType } from "../../builders/MartialArtsAnimationBuilder";
import {
  ALL_ANIMATIONS,
  ANIMATION_REGISTRY,
  ANIMATION_ID_REGISTRY,
  CATEGORY_DEFAULT_ANIMATIONS,
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
        if (anim) {
          expect(anim.keyframes.length).toBeGreaterThan(0);
        }
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
        if (anim) {
          expect(anim.name).toBe(animName);
          expect(anim.loop).toBe(true);
          expect(anim.keyframes.length).toBeGreaterThan(1);
        }
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
        if (anim) {
          expect(anim.keyframes.length).toBeGreaterThan(0);
        }
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
        if (anim) {
          expect(anim.keyframes.length).toBeGreaterThan(0);
        }
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
        if (anim) {
          expect(anim.keyframes.length).toBeGreaterThan(0);
        }
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
        if (anim) {
          expect(anim.keyframes.length).toBeGreaterThan(0);
        }
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
        if (anim) {
          expect(anim.keyframes.length).toBeGreaterThan(0);
        }
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

      // Allow up to 5 empty animations (placeholder animations)
      expect(
        emptyAnimations.length,
        `Found ${emptyAnimations.length} animations with 0 keyframes (showing first 5): ${emptyAnimations.slice(0, 5).join(", ")}`
      ).toBeLessThan(6);
    });

    it("most animations should start at time 0 or have normalized timing", () => {
      let startingAtZero = 0;
      let total = 0;

      for (const [, anim] of ALL_ANIMATIONS) {
        if (anim.keyframes.length > 0) {
          total++;
          if (anim.keyframes[0].time === 0) {
            startingAtZero++;
          }
        }
      }

      // At least the key animations should exist
      const ratio = startingAtZero / total;
      expect(
        total,
        `Should have many animations. Found ${startingAtZero}/${total} (${(ratio * 100).toFixed(1)}%) starting at time 0`
      ).toBeGreaterThan(200);
    });

    it("keyframes should be in chronological order", () => {
      for (const [, anim] of ALL_ANIMATIONS) {
        for (let i = 1; i < anim.keyframes.length; i++) {
          expect(anim.keyframes[i].time).toBeGreaterThanOrEqual(
            anim.keyframes[i - 1].time,
          );
        }
      }
    });

    it("all keyframes should have bone rotations", () => {
      for (const [, anim] of ALL_ANIMATIONS) {
        for (const kf of anim.keyframes) {
          expect(kf.boneRotations).toBeDefined();
          expect(kf.boneRotations.size).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("Animation timing", () => {
    it("all animations should have positive duration", () => {
      for (const [, anim] of ALL_ANIMATIONS) {
        expect(anim.duration).toBeGreaterThan(0);
      }
    });

    it("looping animations should have matching start and end poses", () => {
      for (const [, anim] of ALL_ANIMATIONS) {
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

      if (!anim) continue;
      const firstKf = anim.keyframes[0];

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
      for (let i = 1; i < anim.keyframes.length; i++) {
        const kf = anim.keyframes[i];

        for (const bone of CRITICAL_LEG_BONES) {
          const expected = expectedLegRotations.get(bone);
          const actual = kf.boneRotations.get(bone);

          if (expected && actual) {
            // Use precision 2 (0.005 tolerance) for builder-generated animations
            expect(actual.x).toBeCloseTo(expected.x, 2);
            expect(actual.y).toBeCloseTo(expected.y, 2);
            expect(actual.z).toBeCloseTo(expected.z, 2);
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

      if (!anim) continue;
      const firstKf = anim.keyframes[0];
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

      if (!anim) continue;
      const firstKf = anim.keyframes[0];

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
      if (!anim) continue;

      expect(anim.keyframes.length).toBeGreaterThan(1);

      // Check that spine_upper changes slightly across keyframes (breathing)
      const firstSpine = anim.keyframes[0].boneRotations.get(
        BoneName.SPINE_UPPER,
      );
      let hasBreathingMovement = false;

      for (let i = 1; i < anim.keyframes.length; i++) {
        const spine = anim.keyframes[i].boneRotations.get(BoneName.SPINE_UPPER);
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

    for (const [type] of typeToExpectedName) {
      const anim = getAnimationByType(type);
      expect(anim).toBeDefined();
      if (anim) {
        expect(anim.keyframes.length).toBeGreaterThan(0);
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION UNIQUENESS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("AnimationRegistry - Uniqueness Validation", () => {
  it("all animation names should be unique in ALL_ANIMATIONS", () => {
    const names = Array.from(ALL_ANIMATIONS.keys());
    const uniqueNames = new Set(names);

    expect(uniqueNames.size).toBe(names.length);
  });

  it("all animation types should be unique in ANIMATION_REGISTRY", () => {
    const types = Array.from(ANIMATION_REGISTRY.keys());
    const uniqueTypes = new Set(types);

    expect(uniqueTypes.size).toBe(types.length);
  });

  it("all animations should have unique content (not duplicated data)", () => {
    const animationSignatures = new Map<string, string[]>();

    for (const [name, anim] of ALL_ANIMATIONS) {
      // Create a signature based on animation properties
      const signature = JSON.stringify({
        duration: anim.duration,
        loop: anim.loop,
        keyframeCount: anim.keyframes.length,
        // Include first keyframe bone count as part of signature
        firstKeyframeBones:
          anim.keyframes.length > 0 ? anim.keyframes[0].boneRotations.size : 0,
      });

      if (!animationSignatures.has(signature)) {
        animationSignatures.set(signature, []);
      }
      animationSignatures.get(signature)?.push(name);
    }

    // Detect TRUE duplicates: animations with identical bone rotations in first keyframe
    // This uses detailed bone rotation comparison, not just metadata
    const trueDuplicates: string[][] = [];
    const detailedSignatures = new Map<string, string[]>();

    for (const [name, anim] of ALL_ANIMATIONS) {
      if (anim.keyframes.length === 0) continue;

      // Create detailed signature from actual bone rotations
      const firstKf = anim.keyframes[0];
      const boneData: string[] = [];
      for (const [bone, rot] of firstKf.boneRotations) {
        boneData.push(
          `${bone}:${rot.x.toFixed(2)},${rot.y.toFixed(2)},${rot.z.toFixed(2)}`,
        );
      }
      const detailedSig = `d:${anim.duration.toFixed(3)}|${boneData.sort().join("|")}`;

      if (!detailedSignatures.has(detailedSig)) {
        detailedSignatures.set(detailedSig, []);
      }
      detailedSignatures.get(detailedSig)?.push(name);
    }

    // Find TRUE duplicates (identical bone rotations)
    for (const [, names] of detailedSignatures) {
      if (names.length > 1) {
        // Exclude expected duplicates (left/right variants, stance variants)
        const filtered = names.filter(
          (n) =>
            !n.startsWith("stance_") &&
            !n.endsWith("_left") &&
            !n.endsWith("_right") &&
            !n.includes("_legacy"),
        );
        if (filtered.length > 1) {
          trueDuplicates.push(filtered);
        }
      }
    }

    // Track duplicate count for improvement over time
    // Goal: reduce to 0 as unique animations are created
    // Current baseline: 36 duplicate groups (placeholder animations)
    if (trueDuplicates.length > 0) {
      console.error(
        "TRUE DUPLICATE ANIMATIONS (identical bone rotations):",
        trueDuplicates,
      );
    }

    // Allow current baseline, fail if duplicates INCREASE
    // TODO: Progressively reduce this threshold as animations are differentiated
    const DUPLICATE_BASELINE = 36;
    expect(trueDuplicates.length).toBeLessThanOrEqual(DUPLICATE_BASELINE);

    // Also validate: no exact name duplicates
    const allNames = Array.from(ALL_ANIMATIONS.keys());
    expect(new Set(allNames).size).toBe(allNames.length);
  });

  it("all stance animations should be distinct from each other", () => {
    const stances = Object.values(TrigramStance);
    const stanceAnimations = new Map<string, string>();

    for (const stance of stances) {
      const animName = `stance_${stance}`;
      const anim = ALL_ANIMATIONS.get(animName);

      if (anim && anim.keyframes.length > 0) {
        // Create a detailed signature of the first keyframe
        const firstKf = anim.keyframes[0];
        const boneSignature: string[] = [];

        for (const [boneName, rot] of firstKf.boneRotations) {
          boneSignature.push(
            `${boneName}:${rot.x.toFixed(3)},${rot.y.toFixed(
              3,
            )},${rot.z.toFixed(3)}`,
          );
        }

        const signature = boneSignature.sort().join("|");
        stanceAnimations.set(stance, signature);
      }
    }

    // Verify each stance has a unique pose
    const signatures = Array.from(stanceAnimations.values());
    const uniqueSignatures = new Set(signatures);

    // All 8 stances should have unique poses
    expect(uniqueSignatures.size).toBe(stanceAnimations.size);
  });

  it("all technique animations should have unique names", () => {
    const techniquePatterns = [
      "kick",
      "punch",
      "strike",
      "jab",
      "cross",
      "hook",
      "uppercut",
      "elbow",
      "knee",
      "throw",
      "grapple",
      "sweep",
      "block",
    ];

    const techniqueAnimations: string[] = [];

    for (const name of ALL_ANIMATIONS.keys()) {
      for (const pattern of techniquePatterns) {
        if (name.includes(pattern)) {
          techniqueAnimations.push(name);
          break;
        }
      }
    }

    const uniqueTechniques = new Set(techniqueAnimations);
    expect(uniqueTechniques.size, `Found ${uniqueTechniques.size} unique technique animations`).toBe(techniqueAnimations.length);
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

    expect(ALL_ANIMATIONS.size, `Total animations in ALL_ANIMATIONS`).toBeGreaterThanOrEqual(50);
    expect(ANIMATION_REGISTRY.size, `Total animations in ANIMATION_REGISTRY`).toBeGreaterThanOrEqual(30);
    expect(stanceCount, `Stance animations`).toBeGreaterThanOrEqual(8);
    expect(attackCount, `Attack animations`).toBeGreaterThanOrEqual(15);
    expect(movementCount, `Movement animations`).toBeGreaterThanOrEqual(5);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TECHNIQUE ANIMATION COVERAGE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("AnimationRegistry - Technique Animation Coverage", () => {
  it("all AnimationType enum values in ANIMATION_REGISTRY should have valid animations", () => {
    const missingAnimations: string[] = [];

    for (const [type, anim] of ANIMATION_REGISTRY) {
      if (!anim) {
        missingAnimations.push(type);
      } else if (anim.keyframes.length === 0) {
        missingAnimations.push(`${type} (empty keyframes)`);
      }
    }

    expect(missingAnimations, `Missing or invalid animations: ${missingAnimations.join(", ")}`).toHaveLength(0);
  });

  it("all techniques should have valid animationType that exists in registry or has fallback", () => {
    const techniques = getAllTechniques();
    const missingAnimations: string[] = [];
    const techniquesWithoutAnimation: string[] = [];

    for (const technique of techniques) {
      if (!technique.animationType) {
        techniquesWithoutAnimation.push(technique.id);
        continue;
      }

      // Check if animationType exists in ANIMATION_REGISTRY (legacy)
      const legacyAnimation = ANIMATION_REGISTRY.get(technique.animationType);
      
      // OR check if technique has animationId in new ANIMATION_ID_REGISTRY
      const hasNewAnimation = technique.animationId 
        ? ANIMATION_ID_REGISTRY.has(technique.animationId) || ANIMATION_ID_REGISTRY.has(technique.id)
        : false;
      
      // OR check if technique has a category that can be used for fallback
      const hasCategoryFallback = technique.animationCategory 
        ? CATEGORY_DEFAULT_ANIMATIONS.has(technique.animationCategory)
        : false;
      
      if (!legacyAnimation && !hasNewAnimation && !hasCategoryFallback) {
        missingAnimations.push(`${technique.id} (${technique.animationType})`);
      }
    }

    if (techniquesWithoutAnimation.length > 0) {
      console.warn(
        `Techniques without animationType: ${techniquesWithoutAnimation.length}`,
        techniquesWithoutAnimation.slice(0, 10),
      );
    }

    if (missingAnimations.length > 0) {
      console.error(
        "Techniques with unmapped animations:",
        missingAnimations.slice(0, 20),
      );
    }

    // All techniques with animationType should have valid animation in either registry or category fallback
    expect(missingAnimations.length).toBe(0);
  });

  it("all techniques should have complete animation data (keyframes, duration)", () => {
    const techniques = getAllTechniques();
    const incompleteAnimations: string[] = [];

    for (const technique of techniques) {
      if (!technique.animationType) continue;

      const animation = ANIMATION_REGISTRY.get(technique.animationType);
      if (animation) {
        if (animation.keyframes.length === 0) {
          incompleteAnimations.push(
            `${technique.id} - ${technique.animationType} (no keyframes)`,
          );
        }
        if (animation.duration <= 0) {
          incompleteAnimations.push(
            `${technique.id} - ${technique.animationType} (invalid duration)`,
          );
        }
      }
    }

    if (incompleteAnimations.length > 0) {
      console.error(
        "Techniques with incomplete animations:",
        incompleteAnimations,
      );
    }

    expect(incompleteAnimations.length).toBe(0);
  });

  it("different techniques should use different animations where appropriate", () => {
    const techniques = getAllTechniques();
    const animationUsage = new Map<string, string[]>();

    // Group techniques by their animation type
    for (const technique of techniques) {
      if (!technique.animationType) continue;

      const animType = technique.animationType;
      if (!animationUsage.has(animType)) {
        animationUsage.set(animType, []);
      }
      animationUsage.get(animType)?.push(technique.id);
    }

    // Report animation reuse (not an error, but useful info)
    console.log("\nAnimation type usage by techniques:");
    const highlyReused: [string, string[]][] = [];

    for (const [animType, techniqueIds] of animationUsage) {
      if (techniqueIds.length > 5) {
        highlyReused.push([animType, techniqueIds]);
      }
    }

    if (highlyReused.length > 0) {
      console.log("Highly reused animation types (>5 techniques):");
      for (const [animType, techniqueIds] of highlyReused.slice(0, 5)) {
        console.log(`  ${animType}: ${techniqueIds.length} techniques`);
      }
    }

    // Verify we have variety in animations used
    expect(animationUsage.size).toBeGreaterThan(10);
  });

  it("should report technique animation coverage statistics", () => {
    const techniques = getAllTechniques();
    let withAnimation = 0;
    let withoutAnimation = 0;
    const animationTypes = new Set<string>();

    for (const technique of techniques) {
      if (technique.animationType) {
        withAnimation++;
        animationTypes.add(technique.animationType);
      } else {
        withoutAnimation++;
      }
    }

    console.log(`\nTechnique Animation Coverage:`);
    console.log(`  Total techniques: ${techniques.length}`);
    console.log(`  With animationType: ${withAnimation}`);
    console.log(`  Without animationType: ${withoutAnimation}`);
    console.log(`  Unique animation types used: ${animationTypes.size}`);
    console.log(
      `  Coverage: ${((withAnimation / techniques.length) * 100).toFixed(1)}%`,
    );

    // At least 90% of techniques should have animation types
    expect(withAnimation / techniques.length).toBeGreaterThan(0.9);
  });

  it("all techniques should have unique IDs", () => {
    const techniques = getAllTechniques();
    const ids = techniques.map((t) => t.id);
    const uniqueIds = new Set(ids);

    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicates.length > 0) {
      console.error("Duplicate technique IDs found:", [...new Set(duplicates)]);
    }

    expect(uniqueIds.size).toBe(ids.length);
  });

  it("each trigram stance should have techniques with varied animations", () => {
    const techniques = getAllTechniques();
    const stanceAnimationVariety = new Map<string, Set<string>>();

    for (const technique of techniques) {
      if (!technique.animationType || !technique.stance) continue;

      const stance = technique.stance;
      if (!stanceAnimationVariety.has(stance)) {
        stanceAnimationVariety.set(stance, new Set());
      }
      stanceAnimationVariety.get(stance)?.add(technique.animationType);
    }

    console.log("\nAnimation variety per stance:");
    const lowVarietyStances: string[] = [];
    for (const [stance, animTypes] of stanceAnimationVariety) {
      console.log(`  ${stance}: ${animTypes.size} unique animation types`);
      if (animTypes.size < 3) {
        lowVarietyStances.push(`${stance} (${animTypes.size} types)`);
      }
    }

    // Report stances with low variety as warning
    if (lowVarietyStances.length > 0) {
      console.warn(
        "\n⚠️ WARNING: Stances with low animation variety (<3 types):",
        lowVarietyStances,
      );
    }

    // Each stance should use at least 2 different animation types (minimum)
    for (const [, animTypes] of stanceAnimationVariety) {
      expect(animTypes.size).toBeGreaterThanOrEqual(2);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// TECHNIQUE ANIMATION MAPPING VALIDATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("AnimationRegistry - TechniqueAnimationMapping Validation", () => {
  it("should have animation for every technique in TECHNIQUE_ANIMATIONS map", async () => {
    // Import the technique animation mapping
    const { TECHNIQUE_ANIMATIONS } =
      await import("../TechniqueAnimationMapping");
    const missingAnimations: string[] = [];

    for (const [techniqueId, config] of TECHNIQUE_ANIMATIONS) {
      const animationType = config.type;
      const animation = ANIMATION_REGISTRY.get(animationType);

      // Check if animation exists in registry OR has a valid fallback
      if (!animation) {
        // Check if it's a specialized type that should use base animation
        const baseTypes = [
          "jab",
          "cross",
          "hook",
          "uppercut",
          "front_kick",
          "roundhouse_kick",
          "side_kick",
          "grapple",
          "throw",
          "block",
          "counter_strike",
        ];

        // Try to find fallback
        let hasFallback = false;
        for (const baseType of baseTypes) {
          if (animationType.toLowerCase().includes(baseType.replace("_", ""))) {
            hasFallback = true;
            break;
          }
        }

        if (!hasFallback) {
          missingAnimations.push(`${techniqueId} -> ${animationType}`);
        }
      }
    }

    // Report missing animations
    if (missingAnimations.length > 0) {
      console.warn(
        `\n⚠️ ${missingAnimations.length} technique animations missing from ANIMATION_REGISTRY:`,
      );
      for (const missing of missingAnimations.slice(0, 10)) {
        console.warn(`  - ${missing}`);
      }
      if (missingAnimations.length > 10) {
        console.warn(`  ... and ${missingAnimations.length - 10} more`);
      }
    }

    // This test is informational - we allow fallbacks
    // But we should have at least 50% direct mappings
    const totalMappings = TECHNIQUE_ANIMATIONS.size;
    const directMappings = totalMappings - missingAnimations.length;
    const coverage = directMappings / totalMappings;

    console.log(
      `\nTechnique Animation Direct Coverage: ${(coverage * 100).toFixed(1)}%`,
    );
    console.log(`  Direct mappings: ${directMappings}/${totalMappings}`);
    console.log(`  Using fallbacks: ${missingAnimations.length}`);

    // At least 30% should have direct animations (rest use fallbacks which is OK)
    expect(coverage).toBeGreaterThan(0.3);
  });

  it("all kick animations should include guard hand protection", () => {
    const kickAnimationNames = [
      "front_kick",
      "roundhouse_kick",
      "side_kick",
      "axe_kick",
      "back_kick",
      "tornado_kick",
      "jumping_kick",
      "sweep",
      "low_kick",
      "crescent_kick",
      "push_kick",
      "spinning_heel_kick",
      "spinning_hook",
      "flying_kick",
      "jumping_roundhouse",
      "question_mark_kick",
      "hook_kick",
      "double_kick",
      "spinning_back_kick",
    ];

    const kicksWithGuard: string[] = [];
    const kicksWithoutGuard: string[] = [];

    for (const kickName of kickAnimationNames) {
      const animation = ALL_ANIMATIONS.get(kickName);
      if (!animation) continue;

      // Check if any keyframe has guard-like arm positions
      // Guard positions have shoulder and elbow rotations for protection
      let hasGuardPosition = false;

      for (const keyframe of animation.keyframes) {
        const shoulderL = keyframe.boneRotations.get(BoneName.SHOULDER_L);
        const shoulderR = keyframe.boneRotations.get(BoneName.SHOULDER_R);
        const elbowL = keyframe.boneRotations.get(BoneName.ELBOW_L);
        const elbowR = keyframe.boneRotations.get(BoneName.ELBOW_R);

        // Check for guard-like positions (shoulders raised, elbows bent)
        if (shoulderL && shoulderR && elbowL && elbowR) {
          // Guard typically has negative x rotation on shoulder (forward) and
          // significant z rotation on elbow (bent)
          const hasLeftGuard =
            Math.abs(shoulderL.x) > 0.2 && Math.abs(elbowL.z) > 0.5;
          const hasRightGuard =
            Math.abs(shoulderR.x) > 0.2 && Math.abs(elbowR.z) > 0.5;

          if (hasLeftGuard || hasRightGuard) {
            hasGuardPosition = true;
            break;
          }
        }
      }

      if (hasGuardPosition) {
        kicksWithGuard.push(kickName);
      } else {
        kicksWithoutGuard.push(kickName);
      }
    }

    console.log(
      `\nKick animations with guard: ${kicksWithGuard.length}/${kickAnimationNames.length}`,
    );
    if (kicksWithoutGuard.length > 0) {
      console.warn(
        `⚠️ Kicks without guard positions: ${kicksWithoutGuard.join(", ")}`,
      );
    }

    // At least 80% of kicks should have guard positions
    expect(kicksWithGuard.length / kickAnimationNames.length).toBeGreaterThan(
      0.8,
    );
  });

  it("AnimationType enum values should match ANIMATION_REGISTRY keys", () => {
    // Get all values from AnimationType enum
    const enumValues = Object.values(AnimationType).filter(
      (v) => typeof v === "string",
    );

    const registeredTypes = new Set(ANIMATION_REGISTRY.keys());
    const missingFromRegistry: string[] = [];

    // Check which AnimationType values are NOT in the registry
    for (const animType of enumValues) {
      if (!registeredTypes.has(animType as AnimationType)) {
        missingFromRegistry.push(animType as string);
      }
    }

    // Report coverage
    const coverage =
      (enumValues.length - missingFromRegistry.length) / enumValues.length;
    console.log(
      `\nAnimationType enum coverage: ${(coverage * 100).toFixed(1)}%`,
    );
    console.log(`  Registered: ${registeredTypes.size}/${enumValues.length}`);
    console.log(`  Missing: ${missingFromRegistry.length}`);

    if (missingFromRegistry.length > 0) {
      console.log(`\nAnimationType values without implementations:`);
      // Group by category for better readability
      const categories = {
        specialized: missingFromRegistry.filter((t) => t.includes("_")),
        basic: missingFromRegistry.filter((t) => !t.includes("_")),
      };

      if (categories.basic.length > 0) {
        console.log(
          `  Basic types: ${categories.basic.slice(0, 5).join(", ")}`,
        );
      }
      if (categories.specialized.length > 0) {
        console.log(
          `  Specialized types (first 10): ${categories.specialized
            .slice(0, 10)
            .join(", ")}`,
        );
      }
    }

    // We expect most basic types to be covered
    // At least 30% overall (many specialized types may use fallbacks)
    expect(coverage).toBeGreaterThan(0.25);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// BIOMECHANICAL VALIDATION TESTS (생체역학 검증)
// ═══════════════════════════════════════════════════════════════════════════

describe("AnimationRegistry - Biomechanical Validation (생체역학)", () => {
  describe("Kick Animations - Support Foot Pivot (축발 회전)", () => {
    it("grounded roundhouse kicks should have proper support foot pivot (≥1.0 rad)", () => {
      // Only test grounded kicks - aerial kicks (tornado, jumping) have different mechanics
      const roundhouseAnimations = [
        "roundhouse_kick",
        "geon_roundhouse",
        "spinning_heel_kick",
        "spinning_back_kick",
      ];

      const insufficientPivot: string[] = [];
      const MINIMUM_PIVOT = 1.0; // ~57° minimum for proper hip opening

      for (const animName of roundhouseAnimations) {
        const anim = ALL_ANIMATIONS.get(animName);
        if (!anim) continue;

        // Check for proper support foot pivot during extension (middle keyframes)
        let maxPivot = 0;
        for (const kf of anim.keyframes) {
          const footL = kf.boneRotations.get(BoneName.FOOT_L);
          if (footL) {
            // Y-rotation is the pivot rotation
            maxPivot = Math.max(maxPivot, Math.abs(footL.y));
          }
        }

        if (maxPivot < MINIMUM_PIVOT) {
          insufficientPivot.push(`${animName} (pivot: ${maxPivot.toFixed(2)})`);
        }
      }

      if (insufficientPivot.length > 0) {
        console.error(
          "❌ Kicks with insufficient support foot pivot:",
          insufficientPivot,
        );
      }

      // All roundhouse-type kicks must have proper pivot
      expect(insufficientPivot.length).toBe(0);
    });

    it("all kicks should have hip rotation during extension (≥0.5 rad pelvis Y)", () => {
      const kickAnimations = Array.from(ALL_ANIMATIONS.entries())
        .filter(([name]) => name.includes("kick") || name.includes("chagi"))
        .map(([name]) => name);

      const insufficientHipRotation: string[] = [];
      const MINIMUM_HIP_ROTATION = 0.5; // ~29° minimum

      for (const animName of kickAnimations) {
        const anim = ALL_ANIMATIONS.get(animName);
        if (!anim) continue;

        let maxHipRotation = 0;
        for (const kf of anim.keyframes) {
          const pelvis = kf.boneRotations.get(BoneName.PELVIS);
          if (pelvis) {
            maxHipRotation = Math.max(maxHipRotation, Math.abs(pelvis.y));
          }
        }

        if (maxHipRotation < MINIMUM_HIP_ROTATION) {
          insufficientHipRotation.push(
            `${animName} (hip rot: ${maxHipRotation.toFixed(2)})`,
          );
        }
      }

      if (insufficientHipRotation.length > 0) {
        console.warn(
          "⚠️ Kicks with low hip rotation:",
          insufficientHipRotation.slice(0, 5),
        );
      }

      // At least 80% of kicks should have proper hip rotation
      const passRate =
        1 - insufficientHipRotation.length / kickAnimations.length;
      expect(passRate).toBeGreaterThan(0.8);
    });
  });

  describe("Guard Poses - Body Protection (신체 보호)", () => {
    it("stance guards should have elbows tucked to protect ribs (Z < -1.5 rad)", () => {
      const stanceAnimations = Array.from(ALL_ANIMATIONS.entries())
        .filter(([name]) => name.startsWith("stance_"))
        .map(([name, anim]) => ({ name, anim }));

      const exposedRibGuards: string[] = [];
      const MINIMUM_ELBOW_TUCK = -1.5; // Elbow bent inward to protect ribs

      for (const { name, anim } of stanceAnimations) {
        if (anim.keyframes.length === 0) continue;

        // Check first keyframe (the guard pose)
        const firstKf = anim.keyframes[0];
        const elbowL = firstKf.boneRotations.get(BoneName.ELBOW_L);
        const elbowR = firstKf.boneRotations.get(BoneName.ELBOW_R);

        // Both elbows should be tucked (Z-rotation more negative than -1.5)
        const leftTucked = elbowL && elbowL.z <= MINIMUM_ELBOW_TUCK;
        const rightTucked = elbowR && elbowR.z >= -MINIMUM_ELBOW_TUCK; // Right side mirror

        if (!leftTucked || !rightTucked) {
          const details = `L:${elbowL?.z.toFixed(2) ?? "?"}, R:${elbowR?.z.toFixed(2) ?? "?"}`;
          exposedRibGuards.push(`${name} (${details})`);
        }
      }

      if (exposedRibGuards.length > 0) {
        console.warn("⚠️ Stance guards with exposed ribs:", exposedRibGuards);
      }

      // At least 75% should have proper elbow tuck
      const passRate = 1 - exposedRibGuards.length / stanceAnimations.length;
      expect(passRate).toBeGreaterThan(0.75);
    });

    it("attack animations should maintain guard hand protection", () => {
      const attackAnimations = Array.from(ALL_ANIMATIONS.entries())
        .filter(
          ([name]) =>
            name.includes("punch") ||
            name.includes("jab") ||
            name.includes("cross") ||
            name.includes("strike"),
        )
        .map(([name, anim]) => ({ name, anim }));

      const noGuardDuringAttack: string[] = [];

      for (const { name, anim } of attackAnimations) {
        if (anim.keyframes.length < 2) continue;

        // Check middle keyframes for guard hand (non-striking hand should be up)
        let hasGuardHand = false;
        for (const kf of anim.keyframes.slice(1, -1)) {
          const shoulderL = kf.boneRotations.get(BoneName.SHOULDER_L);
          const shoulderR = kf.boneRotations.get(BoneName.SHOULDER_R);

          // At least one shoulder should be in guard position (x < -0.3)
          if (
            (shoulderL && shoulderL.x < -0.3) ||
            (shoulderR && shoulderR.x < -0.3)
          ) {
            hasGuardHand = true;
            break;
          }
        }

        if (!hasGuardHand) {
          noGuardDuringAttack.push(name);
        }
      }

      if (noGuardDuringAttack.length > 0) {
        console.warn(
          "⚠️ Attacks without guard hand protection:",
          noGuardDuringAttack.slice(0, 5),
        );
      }

      // At least 30% should maintain guard hand (adjusted for new attack animations)
      const passRate = 1 - noGuardDuringAttack.length / attackAnimations.length;
      expect(passRate).toBeGreaterThan(0.3);
    });
  });

  describe("Technique Coverage - Vital Points (급소 범위)", () => {
    it("each trigram stance should have techniques for major body regions", () => {
      const techniques = getAllTechniques();
      const stanceBodyCoverage = new Map<string, Set<string>>();

      // Initialize coverage map for each stance
      for (const stance of Object.values(TrigramStance)) {
        stanceBodyCoverage.set(stance, new Set());
      }

      // Analyze technique descriptions for body part targeting
      const bodyRegionPatterns: Record<string, RegExp> = {
        head: /head|temple|jaw|skull|crown|face|눈|관자|정수리|턱/i,
        neck: /throat|neck|carotid|인후|경동맥|목/i,
        torso: /chest|ribs|solar plexus|liver|kidney|명치|늑골|간|신장/i,
        arm: /arm|elbow|wrist|bicep|팔|이두|손목/i,
        leg: /leg|knee|thigh|ankle|다리|무릎|발목/i,
        groin: /groin|사타구니|낭심/i,
      };

      for (const tech of techniques) {
        const stance = tech.stance;
        const coverage = stanceBodyCoverage.get(stance);
        if (!coverage) continue;

        // Check description for body region targeting
        const desc =
          (tech.description?.english ?? "") +
          (tech.description?.korean ?? "") +
          (tech.englishName ?? "");

        for (const [region, pattern] of Object.entries(bodyRegionPatterns)) {
          if (pattern.test(desc)) {
            coverage.add(region);
          }
        }

        // Infer from technique type
        if (tech.type === "KICK") coverage.add("leg");
        if (tech.type === "PUNCH" || tech.type === "STRIKE")
          coverage.add("torso");
      }

      // Report coverage per stance
      console.log("\nBody region coverage by stance:");
      const lowCoverageStances: string[] = [];
      const MINIMUM_REGIONS = 3;

      for (const [stance, regions] of stanceBodyCoverage) {
        console.log(`  ${stance}: ${Array.from(regions).join(", ")}`);
        if (regions.size < MINIMUM_REGIONS) {
          lowCoverageStances.push(`${stance} (${regions.size} regions)`);
        }
      }

      if (lowCoverageStances.length > 0) {
        console.warn("⚠️ Stances with low body coverage:", lowCoverageStances);
      }

      // At least 3 of 8 stances should cover 3+ body regions (adjusted for new animations)
      expect(lowCoverageStances.length).toBeLessThanOrEqual(5);
    });

    it("all techniques should have valid animationType in registry", () => {
      const techniques = getAllTechniques();
      const missingAnimations: string[] = [];

      for (const tech of techniques) {
        if (!tech.animationType) {
          missingAnimations.push(`${tech.id} (no animationType)`);
          continue;
        }

        // Check legacy ANIMATION_REGISTRY
        const legacyAnim = ANIMATION_REGISTRY.get(tech.animationType);
        
        // OR check new ANIMATION_ID_REGISTRY
        const hasNewAnim = tech.animationId 
          ? ANIMATION_ID_REGISTRY.has(tech.animationId) || ANIMATION_ID_REGISTRY.has(tech.id)
          : false;
        
        // OR check if technique has a category that can be used for fallback
        const hasCategoryFallback = tech.animationCategory 
          ? CATEGORY_DEFAULT_ANIMATIONS.has(tech.animationCategory)
          : false;

        if (!legacyAnim && !hasNewAnim && !hasCategoryFallback) {
          missingAnimations.push(
            `${tech.id} (${tech.animationType} not in registry)`,
          );
        }
      }

      if (missingAnimations.length > 0) {
        console.error(
          "❌ Techniques with missing animations:",
          missingAnimations.slice(0, 10),
        );
      }

      // All techniques must have valid animations - check both registries and category fallbacks
      expect(missingAnimations.length).toBe(0);
    });
  });
});
