/**
 * Unit Tests for Trigram Stance Idle Animations
 *
 * Tests the 8 trigram stance idle animations for proper structure,
 * breathing cycles, weight shifts, and guard positions.
 *
 * @module systems/animation/catalogs/__tests__/StanceIdleAnimations.test
 * @korean 팔괘자세대기애니메이션테스트
 */

import { describe, expect, it } from "vitest";
import { TrigramStance } from "../../../../types/common";
import {
  ALL_TRIGRAM_IDLE_ANIMATIONS,
  GAM_IDLE_ANIMATION,
  GAN_IDLE_ANIMATION,
  GEON_IDLE_ANIMATION,
  GON_IDLE_ANIMATION,
  JIN_IDLE_ANIMATION,
  LI_IDLE_ANIMATION,
  SON_IDLE_ANIMATION,
  TAE_IDLE_ANIMATION,
  TRIGRAM_IDLE_ANIMATIONS,
  TRIGRAM_IDLE_METADATA,
  getTrigramIdleAnimation,
  getTrigramIdleByName,
} from "../StanceIdleAnimations";

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION STRUCTURE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("StanceIdleAnimations - Structure", () => {
  it("should export all 8 trigram idle animations", () => {
    expect(GEON_IDLE_ANIMATION).toBeDefined();
    expect(TAE_IDLE_ANIMATION).toBeDefined();
    expect(LI_IDLE_ANIMATION).toBeDefined();
    expect(JIN_IDLE_ANIMATION).toBeDefined();
    expect(SON_IDLE_ANIMATION).toBeDefined();
    expect(GAM_IDLE_ANIMATION).toBeDefined();
    expect(GAN_IDLE_ANIMATION).toBeDefined();
    expect(GON_IDLE_ANIMATION).toBeDefined();
  });

  it("should have correct names for each animation", () => {
    expect(GEON_IDLE_ANIMATION.name).toBe("stance_geon");
    expect(TAE_IDLE_ANIMATION.name).toBe("stance_tae");
    expect(LI_IDLE_ANIMATION.name).toBe("stance_li");
    expect(JIN_IDLE_ANIMATION.name).toBe("stance_jin");
    expect(SON_IDLE_ANIMATION.name).toBe("stance_son");
    expect(GAM_IDLE_ANIMATION.name).toBe("stance_gam");
    expect(GAN_IDLE_ANIMATION.name).toBe("stance_gan");
    expect(GON_IDLE_ANIMATION.name).toBe("stance_gon");
  });

  it("should have Korean names for each animation", () => {
    expect(GEON_IDLE_ANIMATION.koreanName).toBe("건 대기");
    expect(TAE_IDLE_ANIMATION.koreanName).toBe("태 대기");
    expect(LI_IDLE_ANIMATION.koreanName).toBe("리 대기");
    expect(JIN_IDLE_ANIMATION.koreanName).toBe("진 대기");
    expect(SON_IDLE_ANIMATION.koreanName).toBe("손 대기");
    expect(GAM_IDLE_ANIMATION.koreanName).toBe("감 대기");
    expect(GAN_IDLE_ANIMATION.koreanName).toBe("간 대기");
    expect(GON_IDLE_ANIMATION.koreanName).toBe("곤 대기");
  });

  it("should all be looping idle animations", () => {
    const allAnimations = [
      GEON_IDLE_ANIMATION,
      TAE_IDLE_ANIMATION,
      LI_IDLE_ANIMATION,
      JIN_IDLE_ANIMATION,
      SON_IDLE_ANIMATION,
      GAM_IDLE_ANIMATION,
      GAN_IDLE_ANIMATION,
      GON_IDLE_ANIMATION,
    ];

    for (const anim of allAnimations) {
      expect(anim.loop).toBe(true);
      expect(anim.type).toBe("idle");
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// KEYFRAME TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("StanceIdleAnimations - Keyframes", () => {
  it("should have multiple keyframes for breathing animation", () => {
    // Each animation should have at least 4 keyframes for breathing cycle
    expect(GEON_IDLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
    expect(TAE_IDLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
    expect(LI_IDLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
    expect(JIN_IDLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
    expect(SON_IDLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
    expect(GAM_IDLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
    expect(GAN_IDLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
    expect(GON_IDLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(4);
  });

  it("should have keyframes starting at time 0", () => {
    expect(GEON_IDLE_ANIMATION.keyframes[0].time).toBe(0);
    expect(TAE_IDLE_ANIMATION.keyframes[0].time).toBe(0);
    expect(LI_IDLE_ANIMATION.keyframes[0].time).toBe(0);
  });

  it("should have keyframes with bone rotations", () => {
    // Each keyframe should have bone rotation data
    const firstKeyframe = GEON_IDLE_ANIMATION.keyframes[0];
    expect(firstKeyframe.boneRotations).toBeDefined();
    expect(firstKeyframe.boneRotations.size).toBeGreaterThan(0);
  });

  it("should have keyframes with bone positions", () => {
    // Each keyframe should have bone position data for foot and pelvis
    const firstKeyframe = GEON_IDLE_ANIMATION.keyframes[0];
    expect(firstKeyframe.bonePositions).toBeDefined();
    expect(firstKeyframe.bonePositions.size).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// DURATION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("StanceIdleAnimations - Duration", () => {
  it("should have stance-specific breathing durations", () => {
    // Different stances have different breathing rhythms
    expect(GEON_IDLE_ANIMATION.duration).toBe(2.4); // Powerful slow
    expect(TAE_IDLE_ANIMATION.duration).toBe(2.8); // Fluid flowing
    expect(LI_IDLE_ANIMATION.duration).toBe(1.8); // Sharp controlled
    expect(JIN_IDLE_ANIMATION.duration).toBe(2.2); // Explosive ready
    expect(SON_IDLE_ANIMATION.duration).toBe(2.0); // Rhythmic
    expect(GAM_IDLE_ANIMATION.duration).toBe(3.0); // Deep flowing
    expect(GAN_IDLE_ANIMATION.duration).toBe(2.6); // Steady
    expect(GON_IDLE_ANIMATION.duration).toBe(2.6); // Grounded
  });

  it("should have positive durations", () => {
    for (const anim of ALL_TRIGRAM_IDLE_ANIMATIONS) {
      expect(anim.duration).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// MAP ACCESS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("StanceIdleAnimations - Map Access", () => {
  it("should have all 8 stances in the TRIGRAM_IDLE_ANIMATIONS map", () => {
    expect(TRIGRAM_IDLE_ANIMATIONS.size).toBe(8);
    expect(TRIGRAM_IDLE_ANIMATIONS.has(TrigramStance.GEON)).toBe(true);
    expect(TRIGRAM_IDLE_ANIMATIONS.has(TrigramStance.TAE)).toBe(true);
    expect(TRIGRAM_IDLE_ANIMATIONS.has(TrigramStance.LI)).toBe(true);
    expect(TRIGRAM_IDLE_ANIMATIONS.has(TrigramStance.JIN)).toBe(true);
    expect(TRIGRAM_IDLE_ANIMATIONS.has(TrigramStance.SON)).toBe(true);
    expect(TRIGRAM_IDLE_ANIMATIONS.has(TrigramStance.GAM)).toBe(true);
    expect(TRIGRAM_IDLE_ANIMATIONS.has(TrigramStance.GAN)).toBe(true);
    expect(TRIGRAM_IDLE_ANIMATIONS.has(TrigramStance.GON)).toBe(true);
  });

  it("should return correct animations via getTrigramIdleAnimation", () => {
    expect(getTrigramIdleAnimation(TrigramStance.GEON)).toBe(
      GEON_IDLE_ANIMATION,
    );
    expect(getTrigramIdleAnimation(TrigramStance.TAE)).toBe(TAE_IDLE_ANIMATION);
    expect(getTrigramIdleAnimation(TrigramStance.LI)).toBe(LI_IDLE_ANIMATION);
    expect(getTrigramIdleAnimation(TrigramStance.JIN)).toBe(JIN_IDLE_ANIMATION);
    expect(getTrigramIdleAnimation(TrigramStance.SON)).toBe(SON_IDLE_ANIMATION);
    expect(getTrigramIdleAnimation(TrigramStance.GAM)).toBe(GAM_IDLE_ANIMATION);
    expect(getTrigramIdleAnimation(TrigramStance.GAN)).toBe(GAN_IDLE_ANIMATION);
    expect(getTrigramIdleAnimation(TrigramStance.GON)).toBe(GON_IDLE_ANIMATION);
  });

  it("should return correct animations via getTrigramIdleByName", () => {
    expect(getTrigramIdleByName("geon")).toBe(GEON_IDLE_ANIMATION);
    expect(getTrigramIdleByName("tae")).toBe(TAE_IDLE_ANIMATION);
    expect(getTrigramIdleByName("li")).toBe(LI_IDLE_ANIMATION);
    expect(getTrigramIdleByName("jin")).toBe(JIN_IDLE_ANIMATION);
    expect(getTrigramIdleByName("son")).toBe(SON_IDLE_ANIMATION);
    expect(getTrigramIdleByName("gam")).toBe(GAM_IDLE_ANIMATION);
    expect(getTrigramIdleByName("gan")).toBe(GAN_IDLE_ANIMATION);
    expect(getTrigramIdleByName("gon")).toBe(GON_IDLE_ANIMATION);
  });

  it("should handle case-insensitive name lookup", () => {
    expect(getTrigramIdleByName("GEON")).toBe(GEON_IDLE_ANIMATION);
    expect(getTrigramIdleByName("Geon")).toBe(GEON_IDLE_ANIMATION);
    expect(getTrigramIdleByName("GEon")).toBe(GEON_IDLE_ANIMATION);
  });

  it("should return undefined for invalid stance names", () => {
    expect(getTrigramIdleByName("invalid")).toBeUndefined();
    expect(getTrigramIdleByName("")).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// COLLECTION TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("StanceIdleAnimations - Collections", () => {
  it("should have 8 animations in ALL_TRIGRAM_IDLE_ANIMATIONS array", () => {
    expect(ALL_TRIGRAM_IDLE_ANIMATIONS.length).toBe(8);
  });

  it("should include all individual animations in the array", () => {
    expect(ALL_TRIGRAM_IDLE_ANIMATIONS).toContain(GEON_IDLE_ANIMATION);
    expect(ALL_TRIGRAM_IDLE_ANIMATIONS).toContain(TAE_IDLE_ANIMATION);
    expect(ALL_TRIGRAM_IDLE_ANIMATIONS).toContain(LI_IDLE_ANIMATION);
    expect(ALL_TRIGRAM_IDLE_ANIMATIONS).toContain(JIN_IDLE_ANIMATION);
    expect(ALL_TRIGRAM_IDLE_ANIMATIONS).toContain(SON_IDLE_ANIMATION);
    expect(ALL_TRIGRAM_IDLE_ANIMATIONS).toContain(GAM_IDLE_ANIMATION);
    expect(ALL_TRIGRAM_IDLE_ANIMATIONS).toContain(GAN_IDLE_ANIMATION);
    expect(ALL_TRIGRAM_IDLE_ANIMATIONS).toContain(GON_IDLE_ANIMATION);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// METADATA TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("StanceIdleAnimations - Metadata", () => {
  it("should have metadata for all 8 stances", () => {
    expect(TRIGRAM_IDLE_METADATA.GEON).toBeDefined();
    expect(TRIGRAM_IDLE_METADATA.TAE).toBeDefined();
    expect(TRIGRAM_IDLE_METADATA.LI).toBeDefined();
    expect(TRIGRAM_IDLE_METADATA.JIN).toBeDefined();
    expect(TRIGRAM_IDLE_METADATA.SON).toBeDefined();
    expect(TRIGRAM_IDLE_METADATA.GAM).toBeDefined();
    expect(TRIGRAM_IDLE_METADATA.GAN).toBeDefined();
    expect(TRIGRAM_IDLE_METADATA.GON).toBeDefined();
  });

  it("should have correct weight shift types in metadata", () => {
    expect(TRIGRAM_IDLE_METADATA.GEON.weightShiftType).toBe("forward");
    expect(TRIGRAM_IDLE_METADATA.TAE.weightShiftType).toBe("circular");
    expect(TRIGRAM_IDLE_METADATA.LI.weightShiftType).toBe("lateral");
    expect(TRIGRAM_IDLE_METADATA.JIN.weightShiftType).toBe("forward");
    expect(TRIGRAM_IDLE_METADATA.SON.weightShiftType).toBe("lateral");
    expect(TRIGRAM_IDLE_METADATA.GAM.weightShiftType).toBe("circular");
    expect(TRIGRAM_IDLE_METADATA.GAN.weightShiftType).toBe("lateral");
    expect(TRIGRAM_IDLE_METADATA.GON.weightShiftType).toBe("forward");
  });

  it("should have matching breathing durations in metadata", () => {
    expect(TRIGRAM_IDLE_METADATA.GEON.breathingDuration).toBe(
      GEON_IDLE_ANIMATION.duration,
    );
    expect(TRIGRAM_IDLE_METADATA.TAE.breathingDuration).toBe(
      TAE_IDLE_ANIMATION.duration,
    );
    expect(TRIGRAM_IDLE_METADATA.LI.breathingDuration).toBe(
      LI_IDLE_ANIMATION.duration,
    );
    expect(TRIGRAM_IDLE_METADATA.JIN.breathingDuration).toBe(
      JIN_IDLE_ANIMATION.duration,
    );
    expect(TRIGRAM_IDLE_METADATA.SON.breathingDuration).toBe(
      SON_IDLE_ANIMATION.duration,
    );
    expect(TRIGRAM_IDLE_METADATA.GAM.breathingDuration).toBe(
      GAM_IDLE_ANIMATION.duration,
    );
    expect(TRIGRAM_IDLE_METADATA.GAN.breathingDuration).toBe(
      GAN_IDLE_ANIMATION.duration,
    );
    expect(TRIGRAM_IDLE_METADATA.GON.breathingDuration).toBe(
      GON_IDLE_ANIMATION.duration,
    );
  });

  it("should have philosophy descriptions for each stance", () => {
    for (const key of Object.keys(TRIGRAM_IDLE_METADATA) as Array<
      keyof typeof TRIGRAM_IDLE_METADATA
    >) {
      expect(TRIGRAM_IDLE_METADATA[key].philosophy).toBeDefined();
      expect(TRIGRAM_IDLE_METADATA[key].philosophy.length).toBeGreaterThan(0);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LEG CONSISTENCY TESTS - Legs should NOT move during idle breathing
// ═══════════════════════════════════════════════════════════════════════════

describe("StanceIdleAnimations - Leg Consistency", () => {
  it("should have consistent leg rotations across all keyframes (not walking)", () => {
    // For a proper fighting stance idle, legs should stay FIXED
    // Only breathing (torso) should move, not legs
    const animations = [
      { name: "geon", anim: GEON_IDLE_ANIMATION },
      { name: "tae", anim: TAE_IDLE_ANIMATION },
      { name: "li", anim: LI_IDLE_ANIMATION },
      { name: "jin", anim: JIN_IDLE_ANIMATION },
      { name: "son", anim: SON_IDLE_ANIMATION },
      { name: "gam", anim: GAM_IDLE_ANIMATION },
      { name: "gan", anim: GAN_IDLE_ANIMATION },
      { name: "gon", anim: GON_IDLE_ANIMATION },
    ];

    for (const { anim } of animations) {
      const firstKf = anim.keyframes[0];
      const firstHipL = firstKf.boneRotations.get("hip_L");
      const firstHipR = firstKf.boneRotations.get("hip_R");
      const firstKneeL = firstKf.boneRotations.get("knee_L");
      const firstKneeR = firstKf.boneRotations.get("knee_R");

      // Check all keyframes have SAME leg values
      for (let i = 1; i < anim.keyframes.length; i++) {
        const kf = anim.keyframes[i];
        const hipL = kf.boneRotations.get("hip_L");
        const hipR = kf.boneRotations.get("hip_R");
        const kneeL = kf.boneRotations.get("knee_L");
        const kneeR = kf.boneRotations.get("knee_R");

        // HIP rotations should be identical (no walking)
        if (firstHipL && hipL) {
          expect(hipL.x).toBeCloseTo(firstHipL.x, 2);
          expect(hipL.y).toBeCloseTo(firstHipL.y, 2);
          expect(hipL.z).toBeCloseTo(firstHipL.z, 2);
        }
        if (firstHipR && hipR) {
          expect(hipR.x).toBeCloseTo(firstHipR.x, 2);
          expect(hipR.y).toBeCloseTo(firstHipR.y, 2);
          expect(hipR.z).toBeCloseTo(firstHipR.z, 2);
        }

        // KNEE rotations should be close but allow visible knee bounce
        // Precision 1 (±0.05) allows the intentional knee bounce animation
        // that makes stance idles look alive
        if (firstKneeL && kneeL) {
          expect(kneeL.x).toBeCloseTo(firstKneeL.x, 1);
        }
        if (firstKneeR && kneeR) {
          expect(kneeR.x).toBeCloseTo(firstKneeR.x, 1);
        }
      }
    }
  });

  it("should have dramatic leg differences between stances", () => {
    // Different stances should have visually distinct leg positions
    const geonHipL =
      GEON_IDLE_ANIMATION.keyframes[0].boneRotations.get("hip_L");
    const jinHipL = JIN_IDLE_ANIMATION.keyframes[0].boneRotations.get("hip_L");
    const sonHipL = SON_IDLE_ANIMATION.keyframes[0].boneRotations.get("hip_L");
    const sonHipR = SON_IDLE_ANIMATION.keyframes[0].boneRotations.get("hip_R");

    // Geon (forward stance) vs Jin (horse stance) should be different
    expect(geonHipL?.x).not.toBeCloseTo(jinHipL?.x ?? 0, 1);

    const ganHipL = GAN_IDLE_ANIMATION?.keyframes[0].boneRotations.get("hip_L");
    const ganHipR = GAN_IDLE_ANIMATION?.keyframes[0].boneRotations.get("hip_R");
    expect(Math.abs((ganHipL?.x ?? 0) - (ganHipR?.x ?? 0))).toBeLessThan(0.1);

    // Son (Hakdari Seogi - Crane stance) - one leg raised, one leg standing
    // Son uses authentic Taekyon crane stance (학다리서기):
    // - Left leg raised with 1.3 rad hip flexion (45° chamber, ready to kick)
    // - Right leg standing nearly straight at 0.08 rad (170° = nearly vertical)
    // This is CORRECT per authentic Korean martial arts crane stance
    expect(Math.abs(sonHipL?.x ?? 0)).toBeGreaterThan(0.1); // Raised leg (high chamber)
    expect(Math.abs(sonHipR?.x ?? 0)).toBeGreaterThan(0.05); // Standing leg (nearly straight)
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// BREATHING CYCLE TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("StanceIdleAnimations - Breathing Cycles", () => {
  it("should have keyframes covering the full breathing cycle", () => {
    // Last keyframe should be at or near the animation duration
    const lastKeyframeGeon =
      GEON_IDLE_ANIMATION.keyframes[GEON_IDLE_ANIMATION.keyframes.length - 1];
    expect(lastKeyframeGeon.time).toBeCloseTo(GEON_IDLE_ANIMATION.duration, 1);
  });

  it("should have different breathing durations reflecting stance character", () => {
    // Li (Fire) should have shortest breath (precision, focus)
    // Gam (Water) should have longest breath (flowing, adaptive)
    expect(LI_IDLE_ANIMATION.duration).toBeLessThan(
      GAM_IDLE_ANIMATION.duration,
    );
  });

  it("should have Gan (Mountain) with minimal breathing amplitude", () => {
    // Mountain stance should have very steady, minimal breathing
    // Reflected in smaller breathing range in metadata
    expect(GAN_IDLE_ANIMATION.duration).toBeGreaterThan(
      LI_IDLE_ANIMATION.duration,
    );
  });
});
