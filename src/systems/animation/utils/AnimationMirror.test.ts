/**
 * Animation Mirroring Utility Tests
 *
 * Tests for left/right stance reflection functionality.
 * Validates that:
 * - Bone swapping works correctly (left ↔ right)
 * - Rotation mirroring preserves biomechanical correctness
 * - Position mirroring works for lateral movement
 * - Full animation mirroring produces valid results
 *
 * @module systems/animation/utils/AnimationMirror.test
 * @korean 애니메이션반전테스트
 */

import * as THREE from "three";
import { describe, expect, it } from "vitest";
import {
  BoneName,
  type AnimationKeyframe,
  type SkeletalAnimation,
} from "../../../types/skeletal";
import {
  getAnimationForStance,
  getMirroredBone,
  getOppositeLeadFoot,
  getRearFoot,
  leadFootToStanceSide,
  mirrorAnimation,
  mirrorKeyframe,
  mirrorPosition,
  mirrorRotation,
  stanceSideToLeadFoot,
} from "./AnimationMirror";

// ═══════════════════════════════════════════════════════════════════════════
// BONE MIRRORING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("getMirroredBone", () => {
  describe("left-to-right swapping", () => {
    it("should swap SHOULDER_L to SHOULDER_R", () => {
      expect(getMirroredBone(BoneName.SHOULDER_L)).toBe(BoneName.SHOULDER_R);
    });

    it("should swap ELBOW_L to ELBOW_R", () => {
      expect(getMirroredBone(BoneName.ELBOW_L)).toBe(BoneName.ELBOW_R);
    });

    it("should swap HIP_L to HIP_R", () => {
      expect(getMirroredBone(BoneName.HIP_L)).toBe(BoneName.HIP_R);
    });

    it("should swap KNEE_L to KNEE_R", () => {
      expect(getMirroredBone(BoneName.KNEE_L)).toBe(BoneName.KNEE_R);
    });

    it("should swap ANKLE_L to ANKLE_R", () => {
      expect(getMirroredBone(BoneName.ANKLE_L)).toBe(BoneName.ANKLE_R);
    });

    it("should swap FOOT_L to FOOT_R", () => {
      expect(getMirroredBone(BoneName.FOOT_L)).toBe(BoneName.FOOT_R);
    });
  });

  describe("right-to-left swapping", () => {
    it("should swap SHOULDER_R to SHOULDER_L", () => {
      expect(getMirroredBone(BoneName.SHOULDER_R)).toBe(BoneName.SHOULDER_L);
    });

    it("should swap HIP_R to HIP_L", () => {
      expect(getMirroredBone(BoneName.HIP_R)).toBe(BoneName.HIP_L);
    });

    it("should swap KNEE_R to KNEE_L", () => {
      expect(getMirroredBone(BoneName.KNEE_R)).toBe(BoneName.KNEE_L);
    });
  });

  describe("center bones unchanged", () => {
    it("should keep PELVIS unchanged", () => {
      expect(getMirroredBone(BoneName.PELVIS)).toBe(BoneName.PELVIS);
    });

    it("should keep SPINE_LOWER unchanged", () => {
      expect(getMirroredBone(BoneName.SPINE_LOWER)).toBe(BoneName.SPINE_LOWER);
    });

    it("should keep SPINE_UPPER unchanged", () => {
      expect(getMirroredBone(BoneName.SPINE_UPPER)).toBe(BoneName.SPINE_UPPER);
    });

    it("should keep HEAD unchanged", () => {
      expect(getMirroredBone(BoneName.HEAD)).toBe(BoneName.HEAD);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ROTATION MIRRORING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("mirrorRotation", () => {
  describe("center bone mirroring", () => {
    it("should preserve X rotation for pelvis", () => {
      const rotation = new THREE.Euler(0.5, 0.3, 0.1);
      const mirrored = mirrorRotation(rotation, BoneName.PELVIS);
      expect(mirrored.x).toBe(0.5);
    });

    it("should negate Y rotation for pelvis", () => {
      const rotation = new THREE.Euler(0.5, 0.3, 0.1);
      const mirrored = mirrorRotation(rotation, BoneName.PELVIS);
      expect(mirrored.y).toBe(-0.3);
    });

    it("should negate Z rotation for pelvis", () => {
      const rotation = new THREE.Euler(0.5, 0.3, 0.1);
      const mirrored = mirrorRotation(rotation, BoneName.PELVIS);
      expect(mirrored.z).toBe(-0.1);
    });

    it("should apply same rules to spine", () => {
      const rotation = new THREE.Euler(0.2, -0.4, 0.15);
      const mirrored = mirrorRotation(rotation, BoneName.SPINE_UPPER);
      expect(mirrored.x).toBe(0.2);
      expect(mirrored.y).toBe(0.4);
      expect(mirrored.z).toBe(-0.15);
    });
  });

  describe("limb bone mirroring", () => {
    it("should preserve X rotation for hip flexion", () => {
      // Hip X = flexion/extension - should be preserved
      const rotation = new THREE.Euler(1.5, 0.2, 0.1);
      const mirrored = mirrorRotation(rotation, BoneName.HIP_L);
      expect(mirrored.x).toBe(1.5);
    });

    it("should negate Y rotation for hip rotation", () => {
      // Hip Y = internal/external rotation - should be negated
      const rotation = new THREE.Euler(1.5, 0.2, 0.1);
      const mirrored = mirrorRotation(rotation, BoneName.HIP_L);
      expect(mirrored.y).toBe(-0.2);
    });

    it("should negate Z rotation for hip abduction", () => {
      // Hip Z = abduction/adduction - should be negated
      const rotation = new THREE.Euler(1.5, 0.2, 0.1);
      const mirrored = mirrorRotation(rotation, BoneName.HIP_L);
      expect(mirrored.z).toBe(-0.1);
    });

    it("should preserve knee flexion (X)", () => {
      const rotation = new THREE.Euler(-1.2, 0, 0);
      const mirrored = mirrorRotation(rotation, BoneName.KNEE_L);
      expect(mirrored.x).toBe(-1.2);
    });
  });

  describe("roundtrip mirroring", () => {
    it("should return to original after double mirror (center)", () => {
      const original = new THREE.Euler(0.5, 0.3, 0.1);
      const mirrored1 = mirrorRotation(original, BoneName.PELVIS);
      const mirrored2 = mirrorRotation(mirrored1, BoneName.PELVIS);
      expect(mirrored2.x).toBeCloseTo(original.x);
      expect(mirrored2.y).toBeCloseTo(original.y);
      expect(mirrored2.z).toBeCloseTo(original.z);
    });

    it("should return to original after double mirror (limb)", () => {
      const original = new THREE.Euler(1.0, 0.2, -0.3);
      const mirrored1 = mirrorRotation(original, BoneName.HIP_L);
      const mirrored2 = mirrorRotation(mirrored1, BoneName.HIP_R);
      expect(mirrored2.x).toBeCloseTo(original.x);
      expect(mirrored2.y).toBeCloseTo(original.y);
      expect(mirrored2.z).toBeCloseTo(original.z);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// POSITION MIRRORING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("mirrorPosition", () => {
  it("should negate X position", () => {
    const position = new THREE.Vector3(0.5, 1.0, 0.3);
    const mirrored = mirrorPosition(position);
    expect(mirrored.x).toBe(-0.5);
  });

  it("should preserve Y position", () => {
    const position = new THREE.Vector3(0.5, 1.0, 0.3);
    const mirrored = mirrorPosition(position);
    expect(mirrored.y).toBe(1.0);
  });

  it("should preserve Z position", () => {
    const position = new THREE.Vector3(0.5, 1.0, 0.3);
    const mirrored = mirrorPosition(position);
    expect(mirrored.z).toBe(0.3);
  });

  it("should handle negative X", () => {
    const position = new THREE.Vector3(-0.3, 0, 0);
    const mirrored = mirrorPosition(position);
    expect(mirrored.x).toBe(0.3);
  });

  it("should return to original after double mirror", () => {
    const original = new THREE.Vector3(0.5, 1.0, 0.3);
    const mirrored = mirrorPosition(mirrorPosition(original));
    expect(mirrored.x).toBeCloseTo(original.x);
    expect(mirrored.y).toBeCloseTo(original.y);
    expect(mirrored.z).toBeCloseTo(original.z);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// KEYFRAME MIRRORING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("mirrorKeyframe", () => {
  it("should preserve time and easing", () => {
    const keyframe: AnimationKeyframe = {
      time: 0.5,
      easing: "ease-in-out",
    };
    const mirrored = mirrorKeyframe(keyframe);
    expect(mirrored.time).toBe(0.5);
    expect(mirrored.easing).toBe("ease-in-out");
  });

  it("should swap left and right bone rotations", () => {
    const boneRotations = new Map<BoneName, THREE.Euler>([
      [BoneName.HIP_L, new THREE.Euler(1.5, 0, 0)], // Front kick chamber
      [BoneName.KNEE_L, new THREE.Euler(-1.2, 0, 0)], // Knee bent
    ]);

    const keyframe: AnimationKeyframe = {
      time: 0.3,
      boneRotations,
    };

    const mirrored = mirrorKeyframe(keyframe);

    // HIP_L should now be HIP_R
    expect(mirrored.boneRotations?.get(BoneName.HIP_R)).toBeDefined();
    expect(mirrored.boneRotations?.get(BoneName.HIP_R)?.x).toBeCloseTo(1.5);

    // KNEE_L should now be KNEE_R
    expect(mirrored.boneRotations?.get(BoneName.KNEE_R)).toBeDefined();
    expect(mirrored.boneRotations?.get(BoneName.KNEE_R)?.x).toBeCloseTo(-1.2);
  });

  it("should swap bone positions for foot bones", () => {
    const keyframe: AnimationKeyframe = {
      time: 0.5,
      boneRotations: new Map(),
      bonePositions: new Map([
        [BoneName.FOOT_L, new THREE.Vector3(0.2, 0, 0.3)],
        [BoneName.FOOT_R, new THREE.Vector3(-0.2, 0, 0.1)],
      ]),
    };

    const mirrored = mirrorKeyframe(keyframe);

    // FOOT_L should become FOOT_R with X negated
    expect(mirrored.bonePositions?.get(BoneName.FOOT_R)?.x).toBeCloseTo(-0.2);
    expect(mirrored.bonePositions?.get(BoneName.FOOT_R)?.z).toBeCloseTo(0.3);

    // FOOT_R should become FOOT_L with X negated
    expect(mirrored.bonePositions?.get(BoneName.FOOT_L)?.x).toBeCloseTo(0.2);
    expect(mirrored.bonePositions?.get(BoneName.FOOT_L)?.z).toBeCloseTo(0.1);
  });

  it("should handle empty keyframe", () => {
    const keyframe: AnimationKeyframe = {
      time: 0,
      boneRotations: new Map(),
      bonePositions: new Map(),
    };
    const mirrored = mirrorKeyframe(keyframe);
    expect(mirrored.time).toBe(0);
    expect(mirrored.boneRotations.size).toBe(0);
    expect(mirrored.bonePositions.size).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// FULL ANIMATION MIRRORING TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("mirrorAnimation", () => {
  const testAnimation: SkeletalAnimation = {
    name: "front_kick",
    koreanName: "앞차기",
    type: "attack",
    duration: 0.55,
    loop: false,
    keyframes: [
      {
        time: 0,
        boneRotations: new Map([
          [BoneName.HIP_L, new THREE.Euler(0.3, 0, 0)],
          [BoneName.KNEE_L, new THREE.Euler(-0.5, 0, 0)],
        ]),
      },
      {
        time: 0.3,
        boneRotations: new Map([
          [BoneName.HIP_L, new THREE.Euler(1.7, 0, 0)],
          [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0)],
        ]),
      },
      {
        time: 0.55,
        boneRotations: new Map([
          [BoneName.HIP_L, new THREE.Euler(0, 0, 0)],
          [BoneName.KNEE_L, new THREE.Euler(0, 0, 0)],
        ]),
      },
    ],
  };

  it("should create new animation with suffix", () => {
    const mirrored = mirrorAnimation(testAnimation);
    expect(mirrored.name).toBe("front_kick_mirrored");
    expect(mirrored.koreanName).toBe("앞차기(반전)");
  });

  it("should accept custom suffix", () => {
    const mirrored = mirrorAnimation(testAnimation, {
      nameSuffix: "_southpaw",
      koreanNameSuffix: "(사우스포)",
    });
    expect(mirrored.name).toBe("front_kick_southpaw");
    expect(mirrored.koreanName).toBe("앞차기(사우스포)");
  });

  it("should preserve animation properties", () => {
    const mirrored = mirrorAnimation(testAnimation);
    expect(mirrored.type).toBe("attack");
    expect(mirrored.duration).toBe(0.55);
    expect(mirrored.loop).toBe(false);
    expect(mirrored.keyframes.length).toBe(3);
  });

  it("should swap kicking leg in all keyframes", () => {
    const mirrored = mirrorAnimation(testAnimation);

    // First keyframe: HIP_L should now be HIP_R
    const kf0 = mirrored.keyframes[0];
    expect(kf0.boneRotations?.has(BoneName.HIP_R)).toBe(true);
    expect(kf0.boneRotations?.has(BoneName.KNEE_R)).toBe(true);

    // Peak keyframe: Check kicking leg moved to right side
    const kf1 = mirrored.keyframes[1];
    expect(kf1.boneRotations?.get(BoneName.HIP_R)?.x).toBeCloseTo(1.7);
  });

  it("should apply naming suffixes correctly", () => {
    const mirrored = mirrorAnimation(testAnimation, {
      nameSuffix: "_mirrored",
      koreanNameSuffix: "(반전)",
    });
    expect(mirrored.name).toBe("front_kick_mirrored");
    expect(mirrored.koreanName).toBe("앞차기(반전)");
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// STANCE ANIMATION RETRIEVAL TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("getAnimationForStance", () => {
  const baseAnimation: SkeletalAnimation = {
    name: "jab",
    koreanName: "잽",
    type: "attack",
    duration: 0.35,
    loop: false,
    keyframes: [
      {
        time: 0,
        boneRotations: new Map([
          [BoneName.SHOULDER_L, new THREE.Euler(-0.3, 0, 0)],
        ]),
      },
    ],
  };

  it("should return original for orthodox (left foot forward)", () => {
    const result = getAnimationForStance(baseAnimation, "left");
    expect(result.name).toBe("jab");
    expect(result).toBe(baseAnimation); // Same reference
  });

  it("should return mirrored for southpaw (right foot forward)", () => {
    const result = getAnimationForStance(baseAnimation, "right");
    expect(result.name).toBe("jab_southpaw");
    expect(result.koreanName).toBe("잽(사우스포)");
  });

  it("should use cache when provided", () => {
    const cache = new Map<string, SkeletalAnimation>();

    // First call should create and cache
    const result1 = getAnimationForStance(baseAnimation, "right", cache);
    expect(cache.has("jab_southpaw")).toBe(true);

    // Second call should return cached
    const result2 = getAnimationForStance(baseAnimation, "right", cache);
    expect(result2).toBe(result1); // Same reference
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// STANCE UTILITY TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("Stance Utilities", () => {
  describe("leadFootToStanceSide", () => {
    it("should return orthodox for left foot forward", () => {
      expect(leadFootToStanceSide("left")).toBe("orthodox");
    });

    it("should return southpaw for right foot forward", () => {
      expect(leadFootToStanceSide("right")).toBe("southpaw");
    });
  });

  describe("stanceSideToLeadFoot", () => {
    it("should return left for orthodox", () => {
      expect(stanceSideToLeadFoot("orthodox")).toBe("left");
    });

    it("should return right for southpaw", () => {
      expect(stanceSideToLeadFoot("southpaw")).toBe("right");
    });
  });

  describe("getOppositeLeadFoot", () => {
    it("should return right for left", () => {
      expect(getOppositeLeadFoot("left")).toBe("right");
    });

    it("should return left for right", () => {
      expect(getOppositeLeadFoot("right")).toBe("left");
    });
  });

  describe("getRearFoot", () => {
    it("should return right when left is lead", () => {
      expect(getRearFoot("left")).toBe("right");
    });

    it("should return left when right is lead", () => {
      expect(getRearFoot("right")).toBe("left");
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// BIOMECHANICAL CORRECTNESS TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe("Biomechanical Correctness", () => {
  it("should maintain forward kick direction when mirrored", () => {
    // Orthodox front kick with left leg forward (kicks with right)
    const orthodoxKick: SkeletalAnimation = {
      name: "front_kick",
      koreanName: "앞차기",
      type: "attack",
      duration: 0.55,
      loop: false,
      keyframes: [
        {
          time: 0.3,
          boneRotations: new Map([
            [BoneName.HIP_R, new THREE.Euler(1.7, 0, 0)], // Right leg kicks forward
            [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0)],
          ]),
        },
      ],
    };

    const southpawKick = mirrorAnimation(orthodoxKick, {
      targetStance: "southpaw",
    });

    // Southpaw: should now kick with left leg
    const peakFrame = southpawKick.keyframes[0];
    expect(peakFrame.boneRotations?.get(BoneName.HIP_L)?.x).toBeCloseTo(1.7);

    // X rotation (flexion) should be preserved - kick still goes forward
    const hipRotation = peakFrame.boneRotations?.get(BoneName.HIP_L);
    expect(hipRotation?.x).toBeGreaterThan(0); // Positive X = forward
  });

  it("should maintain jab mechanics when mirrored", () => {
    // Orthodox jab (left hand punches)
    const orthodoxJab: SkeletalAnimation = {
      name: "jab",
      koreanName: "잽",
      type: "attack",
      duration: 0.35,
      loop: false,
      keyframes: [
        {
          time: 0.2,
          boneRotations: new Map([
            [BoneName.SHOULDER_L, new THREE.Euler(-0.8, 0, 0.2)], // Left arm extends
            [BoneName.ELBOW_L, new THREE.Euler(0.1, 0, 0)],
          ]),
        },
      ],
    };

    const southpawJab = mirrorAnimation(orthodoxJab, {
      targetStance: "southpaw",
    });

    // Southpaw: should now punch with right hand
    const peakFrame = southpawJab.keyframes[0];
    expect(peakFrame.boneRotations?.get(BoneName.SHOULDER_R)).toBeDefined();

    // Shoulder extension (negative X) should be preserved
    const shoulderRotation = peakFrame.boneRotations?.get(BoneName.SHOULDER_R);
    expect(shoulderRotation?.x).toBeCloseTo(-0.8);

    // Z rotation should be negated (arm angle mirrors)
    expect(shoulderRotation?.z).toBeCloseTo(-0.2);
  });
});
