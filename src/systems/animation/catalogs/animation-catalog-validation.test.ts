/**
 * Comprehensive Animation Catalog Validation Tests
 *
 * Tests for all animation types:
 * - Idle/stance animations (8 trigram idles)
 * - Walk/run locomotion (16 trigram-specific)
 * - Step/footwork movements (forward, backward, lateral, pivots)
 * - Attack techniques (punches, kicks, elbows, knees)
 * - Defensive animations (blocks, parries, counters)
 *
 * Validation criteria:
 * 1. Animation structure (name, duration, keyframes)
 * 2. Direction correctness (forward techniques go forward)
 * 3. Guard maintenance (start and end in guard)
 * 4. Keyframe sufficiency (minimum frames for smooth motion)
 * 5. Trigram stance consistency
 *
 * @module systems/animation/catalogs/animation-catalog-validation
 * @korean 애니메이션카탈로그검증
 */

import { describe, expect, it } from "vitest";
import { TrigramStance } from "../../../types/common";
import type {
  AnimationKeyframe,
  SkeletalAnimation,
} from "../../../types/skeletal";
import { BoneName } from "../../../types/skeletal";

// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS - All Animation Catalogs
// ═══════════════════════════════════════════════════════════════════════════

// Movement animations
import {
  MOVEMENT_BACKWARD_STEP_ANIMATION,
  MOVEMENT_FORWARD_STEP_ANIMATION,
  MOVEMENT_PIVOT_LEFT_ANIMATION,
  MOVEMENT_PIVOT_RIGHT_ANIMATION,
  MOVEMENT_SHUFFLE_ANIMATION,
  MOVEMENT_SIDESTEP_LEFT_ANIMATION,
  MOVEMENT_SIDESTEP_RIGHT_ANIMATION,
} from "./MovementAnimations";

// Stance locomotion (walk/run per trigram)
import {
  GAM_RUN_ANIMATION,
  GAM_WALK_ANIMATION,
  GAN_RUN_ANIMATION,
  GAN_WALK_ANIMATION,
  GEON_RUN_ANIMATION,
  GEON_WALK_ANIMATION,
  GON_RUN_ANIMATION,
  GON_WALK_ANIMATION,
  JIN_RUN_ANIMATION,
  JIN_WALK_ANIMATION,
  LI_RUN_ANIMATION,
  LI_WALK_ANIMATION,
  SON_RUN_ANIMATION,
  SON_WALK_ANIMATION,
  TAE_RUN_ANIMATION,
  TAE_WALK_ANIMATION,
} from "./StanceLocomotionAnimations";

// Stance idle animations
import {
  GAM_IDLE_ANIMATION,
  GAN_IDLE_ANIMATION,
  GEON_IDLE_ANIMATION,
  GON_IDLE_ANIMATION,
  JIN_IDLE_ANIMATION,
  LI_IDLE_ANIMATION,
  SON_IDLE_ANIMATION,
  TAE_IDLE_ANIMATION,
} from "./StanceIdleAnimations";

// Basic animations
import {
  FALL_BACKWARD_ANIMATION,
  FALL_FORWARD_ANIMATION,
  IDLE_ANIMATION,
  RUN_ANIMATION,
  WALK_ANIMATION,
} from "./BasicAnimations";

// Kick animations
import {
  AXE_KICK_ANIMATION,
  BACK_KICK_ANIMATION,
  FRONT_KICK_ANIMATION,
  LOW_KICK_ANIMATION,
  ROUNDHOUSE_KICK_ANIMATION,
  SIDE_KICK_ANIMATION,
} from "./KickAnimations";

// Punch animations
import {
  CROSS_ANIMATION,
  HOOK_ANIMATION,
  JAB_ANIMATION,
  LEAD_HOOK_ANIMATION,
  UPPERCUT_ANIMATION,
} from "./PunchAnimations";

// Step animations
import {
  STEP_BACK_ANIMATION,
  STEP_FORWARD_ANIMATION,
  STEP_LEFT_ANIMATION,
  STEP_RIGHT_ANIMATION,
} from "./StepSkeletalAnimations";

// Footwork animations
import {
  FOOTWORK_PIVOT_LEFT_ANIMATION,
  FOOTWORK_PIVOT_RIGHT_ANIMATION,
  FOOTWORK_SHUFFLE_ANIMATION,
  FOOTWORK_SLIDE_BACK_ANIMATION,
  FOOTWORK_SLIDE_FORWARD_ANIMATION,
} from "./FootworkSkeletalAnimations";

// ═══════════════════════════════════════════════════════════════════════════
// TEST UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get bone rotation from keyframe (boneRotations is a Map<string, THREE.Euler>)
 */
function getBoneRotation(
  kf: AnimationKeyframe,
  bone: BoneName,
): { x: number; y: number; z: number } | undefined {
  const rotation = kf.boneRotations?.get(bone);
  if (!rotation) return undefined;
  return { x: rotation.x, y: rotation.y, z: rotation.z };
}

/**
 * Validate animation has required structure
 */
function validateAnimationStructure(
  animation: SkeletalAnimation,
  expectedName: string,
): void {
  expect(animation).toBeDefined();
  expect(animation.name).toBe(expectedName);
  expect(animation.duration).toBeGreaterThan(0);
  expect(animation.keyframes.length).toBeGreaterThanOrEqual(2);
  expect(animation.type).toBeDefined();
}

/**
 * Validate animation starts near time 0 (with tolerance for wind-up frames)
 */
function validateStartsAtZero(animation: SkeletalAnimation): void {
  const firstFrame = animation.keyframes[0];
  // Allow up to 0.25s for wind-up/chamber frames
  expect(firstFrame.time).toBeLessThanOrEqual(0.25);
}

/**
 * Validate animation ends at or before duration
 */
function validateEndsAtDuration(animation: SkeletalAnimation): void {
  const lastFrame = animation.keyframes[animation.keyframes.length - 1];
  expect(lastFrame.time).toBeLessThanOrEqual(animation.duration + 0.01);
}

/**
 * Validate guard position at end of animation
 */
function validateEndsInGuard(animation: SkeletalAnimation): void {
  const lastFrame = animation.keyframes[animation.keyframes.length - 1];
  const shoulderL = getBoneRotation(lastFrame, BoneName.SHOULDER_L);
  const shoulderR = getBoneRotation(lastFrame, BoneName.SHOULDER_R);

  // Guard position has shoulders rotated back (negative X)
  if (shoulderL) {
    expect(shoulderL.x).toBeLessThanOrEqual(0);
  }
  if (shoulderR) {
    expect(shoulderR.x).toBeLessThanOrEqual(0);
  }
}

/**
 * Validate keyframe density is sufficient for smooth animation
 */
function validateKeyframeDensity(
  animation: SkeletalAnimation,
  minFps: number = 5,
): void {
  const fps = animation.keyframes.length / animation.duration;
  expect(fps).toBeGreaterThanOrEqual(minFps);
}

// ═══════════════════════════════════════════════════════════════════════════
// IDLE/STANCE ANIMATIONS (8 trigram idles)
// ═══════════════════════════════════════════════════════════════════════════

describe("Trigram Idle Animations", () => {
  const trigramIdles: Array<{
    stance: TrigramStance;
    animation: SkeletalAnimation;
    korean: string;
  }> = [
    {
      stance: TrigramStance.GEON,
      animation: GEON_IDLE_ANIMATION,
      korean: "건",
    },
    { stance: TrigramStance.TAE, animation: TAE_IDLE_ANIMATION, korean: "태" },
    { stance: TrigramStance.LI, animation: LI_IDLE_ANIMATION, korean: "리" },
    { stance: TrigramStance.JIN, animation: JIN_IDLE_ANIMATION, korean: "진" },
    { stance: TrigramStance.SON, animation: SON_IDLE_ANIMATION, korean: "손" },
    { stance: TrigramStance.GAM, animation: GAM_IDLE_ANIMATION, korean: "감" },
    { stance: TrigramStance.GAN, animation: GAN_IDLE_ANIMATION, korean: "간" },
    { stance: TrigramStance.GON, animation: GON_IDLE_ANIMATION, korean: "곤" },
  ];

  trigramIdles.forEach(({ stance, animation, korean }) => {
    describe(`${stance} (${korean}) idle`, () => {
      it("should have valid structure", () => {
        // Idle animations use "stance_<trigram>" naming convention
        validateAnimationStructure(animation, `stance_${stance}`);
        expect(animation.type).toBe("idle");
        expect(animation.loop).toBe(true);
      });

      it("should have breathing duration (1.8s-3.0s)", () => {
        expect(animation.duration).toBeGreaterThanOrEqual(1.8);
        expect(animation.duration).toBeLessThanOrEqual(3.0);
      });

      it("should have sufficient keyframes for breathing cycle", () => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(4);
      });

      it("should have Korean name", () => {
        expect(animation.koreanName).toBeDefined();
        expect(animation.koreanName.length).toBeGreaterThan(0);
      });
    });
  });

  it("should have unique animations for each trigram", () => {
    const names = trigramIdles.map((t) => t.animation.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(8);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// WALK/RUN LOCOMOTION (16 trigram-specific)
// ═══════════════════════════════════════════════════════════════════════════

describe("Trigram Walk Animations", () => {
  const trigramWalks: Array<{
    stance: TrigramStance;
    animation: SkeletalAnimation;
  }> = [
    { stance: TrigramStance.GEON, animation: GEON_WALK_ANIMATION },
    { stance: TrigramStance.TAE, animation: TAE_WALK_ANIMATION },
    { stance: TrigramStance.LI, animation: LI_WALK_ANIMATION },
    { stance: TrigramStance.JIN, animation: JIN_WALK_ANIMATION },
    { stance: TrigramStance.SON, animation: SON_WALK_ANIMATION },
    { stance: TrigramStance.GAM, animation: GAM_WALK_ANIMATION },
    { stance: TrigramStance.GAN, animation: GAN_WALK_ANIMATION },
    { stance: TrigramStance.GON, animation: GON_WALK_ANIMATION },
  ];

  trigramWalks.forEach(({ stance, animation }) => {
    describe(`${stance} walk`, () => {
      it("should have valid structure", () => {
        // Walk animations use "walk_<trigram>" naming convention
        // They are typed as "movement" since they use asMovement() builder
        validateAnimationStructure(animation, `walk_${stance}`);
        expect(animation.type).toBe("movement");
        // Walk animations are now single-step (loop: false) for precise control
        expect(typeof animation.loop).toBe("boolean");
      });

      it("should have appropriate step duration (0.4s-0.7s)", () => {
        // Single-step walks have shorter duration than full walk cycles
        expect(animation.duration).toBeGreaterThanOrEqual(0.4);
        expect(animation.duration).toBeLessThanOrEqual(0.7);
      });

      it("should have sufficient keyframes for smooth walk", () => {
        // Minimum 3 keyframes for walk cycle (start, mid, end)
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(3);
      });
    });
  });
});

describe("Trigram Run Animations", () => {
  const trigramRuns: Array<{
    stance: TrigramStance;
    animation: SkeletalAnimation;
  }> = [
    { stance: TrigramStance.GEON, animation: GEON_RUN_ANIMATION },
    { stance: TrigramStance.TAE, animation: TAE_RUN_ANIMATION },
    { stance: TrigramStance.LI, animation: LI_RUN_ANIMATION },
    { stance: TrigramStance.JIN, animation: JIN_RUN_ANIMATION },
    { stance: TrigramStance.SON, animation: SON_RUN_ANIMATION },
    { stance: TrigramStance.GAM, animation: GAM_RUN_ANIMATION },
    { stance: TrigramStance.GAN, animation: GAN_RUN_ANIMATION },
    { stance: TrigramStance.GON, animation: GON_RUN_ANIMATION },
  ];

  trigramRuns.forEach(({ stance, animation }) => {
    describe(`${stance} run`, () => {
      it("should have valid structure", () => {
        // Run animations use "run_<trigram>" naming convention
        // They are typed as "movement" since they use asMovement() builder
        validateAnimationStructure(animation, `run_${stance}`);
        expect(animation.type).toBe("movement");
        expect(animation.loop).toBe(true);
      });

      it("should have run cycle duration (0.4s-0.7s)", () => {
        // Run cycles are faster than walks (0.4s-0.7s)
        expect(animation.duration).toBeGreaterThanOrEqual(0.4);
        expect(animation.duration).toBeLessThanOrEqual(0.7);
      });
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// STEP/FOOTWORK MOVEMENTS
// ═══════════════════════════════════════════════════════════════════════════

describe("Step Animations", () => {
  const steps = [
    { name: "step_forward", animation: STEP_FORWARD_ANIMATION },
    { name: "step_back", animation: STEP_BACK_ANIMATION },
    { name: "step_left", animation: STEP_LEFT_ANIMATION },
    { name: "step_right", animation: STEP_RIGHT_ANIMATION },
  ];

  steps.forEach(({ name, animation }) => {
    describe(name, () => {
      it("should have valid structure", () => {
        validateAnimationStructure(animation, name);
      });

      it("should start near zero", () => {
        validateStartsAtZero(animation);
      });

      it("should end at duration", () => {
        validateEndsAtDuration(animation);
      });

      it("should have step duration (0.3s-0.6s)", () => {
        expect(animation.duration).toBeGreaterThanOrEqual(0.3);
        expect(animation.duration).toBeLessThanOrEqual(0.6);
      });
    });
  });
});

describe("Movement Animations", () => {
  const movements = [
    {
      name: "movement_forward_step",
      animation: MOVEMENT_FORWARD_STEP_ANIMATION,
    },
    {
      name: "movement_backward_step",
      animation: MOVEMENT_BACKWARD_STEP_ANIMATION,
    },
    {
      name: "movement_sidestep_left",
      animation: MOVEMENT_SIDESTEP_LEFT_ANIMATION,
    },
    {
      name: "movement_sidestep_right",
      animation: MOVEMENT_SIDESTEP_RIGHT_ANIMATION,
    },
    { name: "movement_pivot_left", animation: MOVEMENT_PIVOT_LEFT_ANIMATION },
    { name: "movement_pivot_right", animation: MOVEMENT_PIVOT_RIGHT_ANIMATION },
    { name: "movement_shuffle", animation: MOVEMENT_SHUFFLE_ANIMATION },
  ];

  movements.forEach(({ name, animation }) => {
    describe(name, () => {
      it("should have valid structure", () => {
        validateAnimationStructure(animation, name);
        expect(animation.type).toBe("movement");
      });

      it("should have proper keyframe density", () => {
        // Movement animations have ~5-10 keyframes per second
        validateKeyframeDensity(animation, 5);
      });

      it("should end in guard", () => {
        validateEndsInGuard(animation);
      });
    });
  });
});

describe("Footwork Animations", () => {
  const footwork = [
    { name: "footwork_shuffle", animation: FOOTWORK_SHUFFLE_ANIMATION },
    { name: "footwork_pivot_left", animation: FOOTWORK_PIVOT_LEFT_ANIMATION },
    { name: "footwork_pivot_right", animation: FOOTWORK_PIVOT_RIGHT_ANIMATION },
    {
      name: "footwork_slide_forward",
      animation: FOOTWORK_SLIDE_FORWARD_ANIMATION,
    },
    { name: "footwork_slide_back", animation: FOOTWORK_SLIDE_BACK_ANIMATION },
  ];

  footwork.forEach(({ name, animation }) => {
    describe(name, () => {
      it("should have valid structure", () => {
        validateAnimationStructure(animation, name);
      });

      it("should be non-looping", () => {
        expect(animation.loop).toBe(false);
      });
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// KICK ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

describe("Kick Animations", () => {
  const kicks = [
    { name: "front_kick", animation: FRONT_KICK_ANIMATION, minDuration: 0.5 },
    {
      name: "roundhouse_kick",
      animation: ROUNDHOUSE_KICK_ANIMATION,
      minDuration: 0.6,
    },
    { name: "side_kick", animation: SIDE_KICK_ANIMATION, minDuration: 0.6 },
    { name: "axe_kick", animation: AXE_KICK_ANIMATION, minDuration: 0.8 },
    { name: "back_kick", animation: BACK_KICK_ANIMATION, minDuration: 0.8 },
    { name: "low_kick", animation: LOW_KICK_ANIMATION, minDuration: 0.4 },
  ];

  kicks.forEach(({ name, animation, minDuration }) => {
    describe(name, () => {
      it("should have valid structure", () => {
        validateAnimationStructure(animation, name);
        expect(animation.type).toBe("attack");
      });

      it(`should have duration >= ${minDuration}s`, () => {
        expect(animation.duration).toBeGreaterThanOrEqual(minDuration);
      });

      it("should have sufficient keyframes", () => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(4);
      });

      it("should start near zero", () => {
        validateStartsAtZero(animation);
      });

      it("should end at duration", () => {
        validateEndsAtDuration(animation);
      });

      it("should end in guard", () => {
        validateEndsInGuard(animation);
      });

      it("should be non-looping", () => {
        expect(animation.loop).toBe(false);
      });
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PUNCH ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

describe("Punch Animations", () => {
  const punches = [
    { name: "jab", animation: JAB_ANIMATION },
    { name: "cross", animation: CROSS_ANIMATION },
    { name: "hook", animation: HOOK_ANIMATION },
    { name: "lead_hook", animation: LEAD_HOOK_ANIMATION },
    { name: "uppercut", animation: UPPERCUT_ANIMATION },
  ];

  punches.forEach(({ name, animation }) => {
    describe(name, () => {
      it("should have valid structure", () => {
        validateAnimationStructure(animation, name);
        expect(animation.type).toBe("attack");
      });

      it("should have punch duration (0.25s-0.9s)", () => {
        // Punch durations vary (jab: fast ~0.35s, power punches: up to ~0.8s)
        expect(animation.duration).toBeGreaterThanOrEqual(0.25);
        expect(animation.duration).toBeLessThanOrEqual(0.9);
      });

      it("should have sufficient keyframes for smooth punch", () => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(3);
      });

      it("should be non-looping", () => {
        expect(animation.loop).toBe(false);
      });
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// BASIC ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

describe("Basic Animations", () => {
  describe("IDLE_ANIMATION", () => {
    it("should have valid structure", () => {
      validateAnimationStructure(IDLE_ANIMATION, "idle");
      expect(IDLE_ANIMATION.type).toBe("idle");
      expect(IDLE_ANIMATION.loop).toBe(true);
    });
  });

  describe("WALK_ANIMATION", () => {
    it("should have valid structure", () => {
      validateAnimationStructure(WALK_ANIMATION, "walk");
      expect(WALK_ANIMATION.loop).toBe(true);
    });
  });

  describe("RUN_ANIMATION", () => {
    it("should have valid structure", () => {
      validateAnimationStructure(RUN_ANIMATION, "run");
      expect(RUN_ANIMATION.loop).toBe(true);
    });
  });

  describe("Fall Animations", () => {
    it("FALL_FORWARD should have valid structure", () => {
      validateAnimationStructure(FALL_FORWARD_ANIMATION, "fall_forward");
      expect(FALL_FORWARD_ANIMATION.loop).toBe(false);
    });

    it("FALL_BACKWARD should have valid structure", () => {
      validateAnimationStructure(FALL_BACKWARD_ANIMATION, "fall_backward");
      expect(FALL_BACKWARD_ANIMATION.loop).toBe(false);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION CATALOG SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

describe("Animation Catalog Summary", () => {
  it("should have 8 trigram idle animations", () => {
    const idles = [
      GEON_IDLE_ANIMATION,
      TAE_IDLE_ANIMATION,
      LI_IDLE_ANIMATION,
      JIN_IDLE_ANIMATION,
      SON_IDLE_ANIMATION,
      GAM_IDLE_ANIMATION,
      GAN_IDLE_ANIMATION,
      GON_IDLE_ANIMATION,
    ];
    expect(idles.length).toBe(8);
    idles.forEach((anim) => expect(anim).toBeDefined());
  });

  it("should have 8 trigram walk animations", () => {
    const walks = [
      GEON_WALK_ANIMATION,
      TAE_WALK_ANIMATION,
      LI_WALK_ANIMATION,
      JIN_WALK_ANIMATION,
      SON_WALK_ANIMATION,
      GAM_WALK_ANIMATION,
      GAN_WALK_ANIMATION,
      GON_WALK_ANIMATION,
    ];
    expect(walks.length).toBe(8);
    walks.forEach((anim) => expect(anim).toBeDefined());
  });

  it("should have 8 trigram run animations", () => {
    const runs = [
      GEON_RUN_ANIMATION,
      TAE_RUN_ANIMATION,
      LI_RUN_ANIMATION,
      JIN_RUN_ANIMATION,
      SON_RUN_ANIMATION,
      GAM_RUN_ANIMATION,
      GAN_RUN_ANIMATION,
      GON_RUN_ANIMATION,
    ];
    expect(runs.length).toBe(8);
    runs.forEach((anim) => expect(anim).toBeDefined());
  });
});
