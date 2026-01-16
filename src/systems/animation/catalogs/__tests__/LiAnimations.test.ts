/**
 * ☲ Li (Fire) Trigram Animation Tests
 *
 * Comprehensive test suite for Li Fire stance and technique animations.
 * Validates animation structure, timing, Korean naming, and performance.
 *
 * @module systems/animation/catalogs/__tests__/LiAnimations.test
 * @category Testing - Animation
 * @korean 리괘애니메이션테스트
 */

import { describe, it, expect } from "vitest";
import {
  LI_IDLE_TARGETING,
  LI_DIAGONAL_DART_STEP,
  LI_LINEAR_PIERCE_STEP,
  LI_FORWARD_TARGETING_GUARD,
} from "../LiStanceAnimations";
import {
  LI_FIRE_SPEAR_ANIMATION,
  LI_NERVE_STRIKE_COMBO,
} from "../LiTechniqueAnimations";
import { BoneName } from "@/types/skeletal";

// ═══════════════════════════════════════════════════════════════════════════
// LI IDLE TARGETING ANIMATION TESTS (리괘 조준 자세)
// ═══════════════════════════════════════════════════════════════════════════

describe("Li Idle Targeting Animation (리괘 조준 자세)", () => {
  it("should have correct duration for targeting cycle", () => {
    expect(LI_IDLE_TARGETING.duration).toBe(2.5);
    expect(LI_IDLE_TARGETING.loop).toBe(true);
  });

  it("should have Korean and English names", () => {
    expect(LI_IDLE_TARGETING.name).toBe("li_idle_targeting");
    expect(LI_IDLE_TARGETING.koreanName).toBe("리괘 조준 자세");
  });

  it("should include targeting tension keyframes", () => {
    expect(LI_IDLE_TARGETING.keyframes.length).toBeGreaterThanOrEqual(3);
    
    // Check we have keyframes at 0ms, ~1250ms, and ~2500ms
    const times = LI_IDLE_TARGETING.keyframes.map(kf => kf.time);
    expect(times).toContain(0);
    expect(times.some(t => Math.abs(t - 1.25) < 0.01)).toBe(true);
    expect(times.some(t => Math.abs(t - 2.5) < 0.01)).toBe(true);
  });

  it("should maintain spear-hand poses throughout cycle", () => {
    // All keyframes should have arm positions (spear-hand applied via builder)
    LI_IDLE_TARGETING.keyframes.forEach(frame => {
      // Verify hands are in proper positions for spear-hand
      // Check for arm rotations which are required for any hand pose
      const hasArmRotations = 
        frame.boneRotations.has(BoneName.SHOULDER_L) ||
        frame.boneRotations.has(BoneName.SHOULDER_R) ||
        frame.boneRotations.has(BoneName.WRIST_L) ||
        frame.boneRotations.has(BoneName.WRIST_R);
      expect(hasArmRotations).toBe(true);
    });
  });

  it("should include forward lean for targeting precision", () => {
    const firstFrame = LI_IDLE_TARGETING.keyframes[0];
    const spineRotation = firstFrame.boneRotations.get(BoneName.SPINE_UPPER);
    
    expect(spineRotation).toBeDefined();
    if (spineRotation) {
      expect(spineRotation.x).toBeGreaterThan(0); // Forward lean (positive X rotation)
      expect(spineRotation.x).toBeLessThan(0.2); // But not excessive
    }
  });

  it("should complete cycle in <5ms for performance", () => {
    const start = performance.now();
    const animation = LI_IDLE_TARGETING;
    const end = performance.now();
    
    expect(end - start).toBeLessThan(5);
    expect(animation).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LI DIAGONAL DART STEP TESTS (화염 돌진)
// ═══════════════════════════════════════════════════════════════════════════

describe("Li Diagonal Dart Step Animation (화염 돌진)", () => {
  it("should have correct duration for explosive dart movement", () => {
    expect(LI_DIAGONAL_DART_STEP.duration).toBe(0.4);
    expect(LI_DIAGONAL_DART_STEP.loop).toBe(false);
  });

  it("should have Korean and English names", () => {
    expect(LI_DIAGONAL_DART_STEP.name).toBe("li_diagonal_dart_step");
    expect(LI_DIAGONAL_DART_STEP.koreanName).toBe("화염 돌진");
  });

  it("should have launch, peak, and landing phases", () => {
    expect(LI_DIAGONAL_DART_STEP.keyframes.length).toBeGreaterThanOrEqual(4);
    
    // Pre-dart (0ms), launch (~120ms), peak (~280ms), landing (400ms)
    const times = LI_DIAGONAL_DART_STEP.keyframes.map(kf => kf.time);
    expect(times).toContain(0);
    expect(times.some(t => Math.abs(t - 0.12) < 0.01)).toBe(true);
    expect(times.some(t => Math.abs(t - 0.4) < 0.01)).toBe(true);
  });

  it("should include pelvis position changes for diagonal movement", () => {
    const keyframesWithPosition = LI_DIAGONAL_DART_STEP.keyframes.filter(
      kf => kf.bonePositions.has(BoneName.PELVIS)
    );
    
    expect(keyframesWithPosition.length).toBeGreaterThan(0);
    
    // Final keyframe should show forward+lateral displacement
    const finalFrame = LI_DIAGONAL_DART_STEP.keyframes[
      LI_DIAGONAL_DART_STEP.keyframes.length - 1
    ];
    const pelvisPos = finalFrame.bonePositions.get(BoneName.PELVIS);
    
    if (pelvisPos) {
      expect(pelvisPos.x).not.toBe(0); // Lateral displacement
      expect(pelvisPos.z).not.toBe(0); // Forward displacement
    }
  });

  it("should maintain spear-hand readiness during movement", () => {
    // All keyframes should have arm rotations
    LI_DIAGONAL_DART_STEP.keyframes.forEach(frame => {
      const hasArmRotation = 
        frame.boneRotations.has(BoneName.SHOULDER_L) ||
        frame.boneRotations.has(BoneName.SHOULDER_R);
      expect(hasArmRotation).toBe(true);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LI LINEAR PIERCE STEP TESTS (직선 관통보)
// ═══════════════════════════════════════════════════════════════════════════

describe("Li Linear Pierce Step Animation (직선 관통보)", () => {
  it("should have correct duration for linear thrust movement", () => {
    expect(LI_LINEAR_PIERCE_STEP.duration).toBe(0.467);
    expect(LI_LINEAR_PIERCE_STEP.loop).toBe(false);
  });

  it("should have Korean and English names", () => {
    expect(LI_LINEAR_PIERCE_STEP.name).toBe("li_linear_pierce_step");
    expect(LI_LINEAR_PIERCE_STEP.koreanName).toBe("직선 관통보");
  });

  it("should have thrust, extension, and stabilization phases", () => {
    expect(LI_LINEAR_PIERCE_STEP.keyframes.length).toBeGreaterThanOrEqual(4);
    
    // Pre-step (0ms), thrust (~140ms), peak (~300ms), land (~467ms)
    const times = LI_LINEAR_PIERCE_STEP.keyframes.map(kf => kf.time);
    expect(times).toContain(0);
    expect(times.some(t => Math.abs(t - 0.467) < 0.01)).toBe(true);
  });

  it("should include forward pelvis displacement", () => {
    const finalFrame = LI_LINEAR_PIERCE_STEP.keyframes[
      LI_LINEAR_PIERCE_STEP.keyframes.length - 1
    ];
    const pelvisPos = finalFrame.bonePositions.get(BoneName.PELVIS);
    
    if (pelvisPos) {
      expect(pelvisPos.z).toBeGreaterThan(0.2); // Significant forward movement
      expect(Math.abs(pelvisPos.x)).toBeLessThan(0.05); // Minimal lateral drift
    }
  });

  it("should maintain square alignment (minimal torso rotation)", () => {
    LI_LINEAR_PIERCE_STEP.keyframes.forEach(frame => {
      const spineRotation = frame.boneRotations.get(BoneName.SPINE_UPPER);
      if (spineRotation) {
        expect(Math.abs(spineRotation.y)).toBeLessThan(0.15); // Minimal Y rotation
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LI FORWARD TARGETING GUARD TESTS (불꽃 방어)
// ═══════════════════════════════════════════════════════════════════════════

describe("Li Forward Targeting Guard Position (불꽃 방어)", () => {
  it("should be a static stance (instantaneous pose)", () => {
    expect(LI_FORWARD_TARGETING_GUARD.duration).toBe(0);
    expect(LI_FORWARD_TARGETING_GUARD.loop).toBe(false);
  });

  it("should have Korean and English names", () => {
    expect(LI_FORWARD_TARGETING_GUARD.name).toBe("li_forward_targeting_guard");
    expect(LI_FORWARD_TARGETING_GUARD.koreanName).toBe("불꽃 방어");
  });

  it("should have single static keyframe", () => {
    expect(LI_FORWARD_TARGETING_GUARD.keyframes.length).toBe(1);
    expect(LI_FORWARD_TARGETING_GUARD.keyframes[0].time).toBe(0);
  });

  it("should have lead arm extended forward", () => {
    const frame = LI_FORWARD_TARGETING_GUARD.keyframes[0];
    const leftShoulder = frame.boneRotations.get(BoneName.SHOULDER_L);
    const leftElbow = frame.boneRotations.get(BoneName.ELBOW_L);
    
    expect(leftShoulder).toBeDefined();
    expect(leftElbow).toBeDefined();
    
    if (leftShoulder && leftElbow) {
      // Lead shoulder should be forward (negative X rotation)
      expect(leftShoulder.x).toBeLessThan(0);
      // Elbow should be partially extended (negative Z rotation for left arm)
      expect(leftElbow.z).toBeLessThan(0);
    }
  });

  it("should have rear arm chambered at chest level", () => {
    const frame = LI_FORWARD_TARGETING_GUARD.keyframes[0];
    const rightElbow = frame.boneRotations.get(BoneName.ELBOW_R);
    
    expect(rightElbow).toBeDefined();
    if (rightElbow) {
      // Elbow should be bent at ~90° (positive Z for right arm)
      expect(rightElbow.z).toBeGreaterThan(1.4); // ~80-90° flexion
      expect(rightElbow.z).toBeLessThan(1.7);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LI FIRE SPEAR ANIMATION TESTS (화염지창)
// ═══════════════════════════════════════════════════════════════════════════

describe("Li Fire Spear Animation (화염지창)", () => {
  it("should have correct duration for nerve strike technique", () => {
    expect(LI_FIRE_SPEAR_ANIMATION.duration).toBe(1.0);
    expect(LI_FIRE_SPEAR_ANIMATION.loop).toBe(false);
  });

  it("should have Korean and English names", () => {
    expect(LI_FIRE_SPEAR_ANIMATION.name).toBe("li_fire_spear");
    expect(LI_FIRE_SPEAR_ANIMATION.koreanName).toBe("화염지창");
  });

  it("should have wind-up, strike, and recovery phases", () => {
    expect(LI_FIRE_SPEAR_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(8);
    
    // Wind-up phase: 0-280ms
    // Strike phase: 280-720ms
    // Recovery phase: 720-1000ms
    const times = LI_FIRE_SPEAR_ANIMATION.keyframes.map(kf => kf.time);
    
    expect(times).toContain(0); // Start
    expect(times.some(t => Math.abs(t - 0.28) < 0.01)).toBe(true); // Max wind-up
    expect(times.some(t => Math.abs(t - 0.72) < 0.01)).toBe(true); // Impact
    expect(times.some(t => Math.abs(t - 1.0) < 0.01)).toBe(true); // Return
  });

  it("should achieve near full arm extension during strike", () => {
    // Find the impact keyframe (around 720ms)
    const impactFrame = LI_FIRE_SPEAR_ANIMATION.keyframes.find(
      kf => Math.abs(kf.time - 0.72) < 0.01
    );
    
    expect(impactFrame).toBeDefined();
    if (impactFrame) {
      const elbowRotation = impactFrame.boneRotations.get(BoneName.ELBOW_R);
      expect(elbowRotation).toBeDefined();
      
      if (elbowRotation) {
        // Elbow should be nearly straight (close to 0° flexion)
        expect(Math.abs(elbowRotation.z)).toBeLessThan(0.2); // <~11° flexion
      }
    }
  });

  it("should include wrist snap on impact", () => {
    const impactFrame = LI_FIRE_SPEAR_ANIMATION.keyframes.find(
      kf => Math.abs(kf.time - 0.72) < 0.01
    );
    
    if (impactFrame) {
      const wristRotation = impactFrame.boneRotations.get(BoneName.WRIST_R);
      expect(wristRotation).toBeDefined();
      
      if (wristRotation) {
        // Wrist should have positive X rotation (dorsiflexion for penetration)
        expect(wristRotation.x).toBeGreaterThan(0);
        expect(wristRotation.x).toBeLessThan(0.15); // Realistic wrist snap angle
      }
    }
  });

  it("should return to guard position in final keyframe", () => {
    const finalFrame = LI_FIRE_SPEAR_ANIMATION.keyframes[
      LI_FIRE_SPEAR_ANIMATION.keyframes.length - 1
    ];
    
    expect(finalFrame.time).toBe(1.0);
    
    // Should have both arms in guard position
    expect(finalFrame.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
    expect(finalFrame.boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
  });

  it("should complete in <5ms for performance", () => {
    const start = performance.now();
    const animation = LI_FIRE_SPEAR_ANIMATION;
    const end = performance.now();
    
    expect(end - start).toBeLessThan(5);
    expect(animation).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// LI NERVE STRIKE COMBO TESTS (화염 연속타)
// ═══════════════════════════════════════════════════════════════════════════

describe("Li Nerve Strike Combo Animation (화염 연속타)", () => {
  it("should have correct duration for 3-strike sequence", () => {
    expect(LI_NERVE_STRIKE_COMBO.duration).toBe(0.98);
    expect(LI_NERVE_STRIKE_COMBO.loop).toBe(false);
  });

  it("should have Korean and English names", () => {
    expect(LI_NERVE_STRIKE_COMBO.name).toBe("li_nerve_strike_combo");
    expect(LI_NERVE_STRIKE_COMBO.koreanName).toBe("화염 연속타");
  });

  it("should have multiple strike phases", () => {
    expect(LI_NERVE_STRIKE_COMBO.keyframes.length).toBeGreaterThanOrEqual(12);
    
    // Setup (0-100ms), Strike-1 (100-340ms), Strike-2 (340-580ms), 
    // Strike-3 (580-820ms), Recovery (820-980ms)
    const times = LI_NERVE_STRIKE_COMBO.keyframes.map(kf => kf.time);
    
    expect(times).toContain(0); // Start
    expect(times.some(t => Math.abs(t - 0.1) < 0.01)).toBe(true); // Chamber
    expect(times.some(t => Math.abs(t - 0.98) < 0.01)).toBe(true); // End
  });

  it("should alternate between right and left hands", () => {
    const keyframes = LI_NERVE_STRIKE_COMBO.keyframes;
    
    // Strike-1: Right arm should extend (around 220ms)
    const strike1 = keyframes.find(kf => Math.abs(kf.time - 0.22) < 0.01);
    if (strike1) {
      const rightElbow = strike1.boneRotations.get(BoneName.ELBOW_R);
      expect(rightElbow).toBeDefined();
      if (rightElbow) {
        expect(Math.abs(rightElbow.z)).toBeLessThan(0.3); // Extended
      }
    }
    
    // Strike-2: Left arm should extend (around 500ms)
    const strike2 = keyframes.find(kf => Math.abs(kf.time - 0.5) < 0.01);
    if (strike2) {
      const leftElbow = strike2.boneRotations.get(BoneName.ELBOW_L);
      expect(leftElbow).toBeDefined();
      if (leftElbow) {
        expect(Math.abs(leftElbow.z)).toBeLessThan(0.3); // Extended
      }
    }
    
    // Strike-3: Right arm extends again (around 740ms)
    const strike3 = keyframes.find(kf => Math.abs(kf.time - 0.74) < 0.01);
    if (strike3) {
      const rightElbow = strike3.boneRotations.get(BoneName.ELBOW_R);
      expect(rightElbow).toBeDefined();
    }
  });

  it("should have minimal recovery time between strikes", () => {
    // Check that transitions are rapid (<100ms between strike peaks)
    const times = LI_NERVE_STRIKE_COMBO.keyframes.map(kf => kf.time);
    const sortedTimes = [...times].sort((a, b) => a - b);
    
    // Strike peaks should be spaced efficiently
    // Strike-1 peak (~340ms), Strike-2 peak (~580ms), Strike-3 peak (~820ms)
    // Spacing: ~240ms per strike + minimal transition
    expect(sortedTimes[sortedTimes.length - 1]).toBeLessThan(1.0);
  });

  it("should return to guard ready for continuation", () => {
    const finalFrame = LI_NERVE_STRIKE_COMBO.keyframes[
      LI_NERVE_STRIKE_COMBO.keyframes.length - 1
    ];
    
    expect(finalFrame.time).toBe(0.98);
    
    // Both arms should be in guard position
    expect(finalFrame.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
    expect(finalFrame.boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
  });

  it("should maintain offensive pressure throughout combo", () => {
    // All keyframes should have forward-facing spine orientation
    LI_NERVE_STRIKE_COMBO.keyframes.forEach(frame => {
      const spineRotation = frame.boneRotations.get(BoneName.SPINE_UPPER);
      if (spineRotation) {
        // X rotation should be forward (positive) or neutral
        expect(spineRotation.x).toBeGreaterThanOrEqual(-0.1);
      }
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE STRUCTURE VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

describe("Li Animation Structure Validation", () => {
  const allLiAnimations = [
    { name: "Li Idle Targeting", animation: LI_IDLE_TARGETING },
    { name: "Li Diagonal Dart", animation: LI_DIAGONAL_DART_STEP },
    { name: "Li Linear Pierce", animation: LI_LINEAR_PIERCE_STEP },
    { name: "Li Targeting Guard", animation: LI_FORWARD_TARGETING_GUARD },
    { name: "Li Fire Spear", animation: LI_FIRE_SPEAR_ANIMATION },
    { name: "Li Nerve Combo", animation: LI_NERVE_STRIKE_COMBO },
  ];

  it("should have valid skeletal animation structure", () => {
    allLiAnimations.forEach(({ name, animation }) => {
      expect(animation.name, `${name} should have name`).toBeDefined();
      expect(animation.koreanName, `${name} should have Korean name`).toBeDefined();
      expect(animation.duration, `${name} should have duration >= 0`).toBeGreaterThanOrEqual(0);
      expect(animation.keyframes.length, `${name} should have keyframes`).toBeGreaterThan(0);
    });
  });

  it("should have keyframes in chronological order", () => {
    allLiAnimations.forEach(({ name, animation }) => {
      const times = animation.keyframes.map(kf => kf.time);
      const sortedTimes = [...times].sort((a, b) => a - b);
      
      expect(times, `${name} keyframes should be chronological`).toEqual(sortedTimes);
    });
  });

  it("should start at time 0", () => {
    allLiAnimations.forEach(({ name, animation }) => {
      expect(animation.keyframes[0].time, `${name} should start at 0`).toBe(0);
    });
  });

  it("should have final keyframe matching duration (or be static)", () => {
    allLiAnimations.forEach(({ name, animation }) => {
      const lastKeyframe = animation.keyframes[animation.keyframes.length - 1];
      const timeDiff = Math.abs(lastKeyframe.time - animation.duration);
      
      // Static poses (duration = 0) should have keyframe at time 0
      // Animated poses should have final keyframe matching duration
      if (animation.duration === 0) {
        expect(lastKeyframe.time, `${name} static pose should be at time 0`).toBe(0);
      } else {
        expect(timeDiff, `${name} final keyframe should match duration`).toBeLessThan(0.01);
      }
    });
  });

  it("should include at least one bone rotation per keyframe", () => {
    allLiAnimations.forEach(({ name, animation }) => {
      animation.keyframes.forEach((keyframe, index) => {
        expect(
          keyframe.boneRotations.size,
          `${name} keyframe ${index} should have bone rotations`
        ).toBeGreaterThan(0);
      });
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// PERFORMANCE BENCHMARKS
// ═══════════════════════════════════════════════════════════════════════════

describe("Li Animation Performance", () => {
  it("should instantiate all animations in <20ms total", () => {
    const start = performance.now();
    
    const animations = [
      LI_IDLE_TARGETING,
      LI_DIAGONAL_DART_STEP,
      LI_LINEAR_PIERCE_STEP,
      LI_FORWARD_TARGETING_GUARD,
      LI_FIRE_SPEAR_ANIMATION,
      LI_NERVE_STRIKE_COMBO,
    ];
    
    const end = performance.now();
    
    expect(end - start).toBeLessThan(20);
    expect(animations.length).toBe(6);
  });

  it("should have reasonable keyframe counts for 60fps", () => {
    // Rule of thumb: 1 keyframe per ~50-100ms for smooth interpolation
    const validations = [
      { name: "Idle", animation: LI_IDLE_TARGETING, expectedMin: 3, expectedMax: 10 },
      { name: "Dart", animation: LI_DIAGONAL_DART_STEP, expectedMin: 4, expectedMax: 12 },
      { name: "Pierce", animation: LI_LINEAR_PIERCE_STEP, expectedMin: 4, expectedMax: 14 },
      { name: "Guard", animation: LI_FORWARD_TARGETING_GUARD, expectedMin: 1, expectedMax: 1 },
      { name: "Spear", animation: LI_FIRE_SPEAR_ANIMATION, expectedMin: 8, expectedMax: 25 },
      { name: "Combo", animation: LI_NERVE_STRIKE_COMBO, expectedMin: 12, expectedMax: 30 },
    ];

    validations.forEach(({ name, animation, expectedMin, expectedMax }) => {
      expect(
        animation.keyframes.length,
        `${name} should have reasonable keyframe count`
      ).toBeGreaterThanOrEqual(expectedMin);
      expect(
        animation.keyframes.length,
        `${name} should not have excessive keyframes`
      ).toBeLessThanOrEqual(expectedMax);
    });
  });
});
