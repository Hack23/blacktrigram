/**
 * Unit Tests for Laterality Transform System
 * 
 * **Korean**: 측면성 변환 시스템 테스트
 * 
 * Tests laterality transformation of skeletal animations for authentic
 * Korean martial arts left/right stance mirroring.
 * 
 * Test Coverage:
 * - ✅ applyLaterality() with right/left laterality
 * - ✅ Bone name mirroring (_L ↔ _R, left_ ↔ right_)
 * - ✅ Bone rotation mirroring (negate Y/Z, preserve X)
 * - ✅ Bone position mirroring (negate Y coordinate)
 * - ✅ Animation metadata preservation
 * - ✅ Performance benchmarks (<1ms requirement)
 * - ✅ Edge cases and validation
 * 
 * @module systems/animation/LateralityTransform.test
 * @category Animation Tests
 * @korean 측면성변환테스트
 */

import { describe, expect, it, beforeEach } from "vitest";
import * as THREE from "three";
import type { SkeletalAnimation } from "../../types/skeletal";
import {
  applyLaterality,
  getAnimationLaterality,
  areLateralityVariants,
} from "./LateralityTransform";

/**
 * Create a test skeletal animation for testing
 */
function createTestAnimation(name: string): SkeletalAnimation {
  return {
    name,
    koreanName: `테스트 ${name}`,
    duration: 0.35,
    loop: false,
    type: "attack",
    keyframes: [
      {
        time: 0,
        boneRotations: new Map([
          ["shoulder_L", new THREE.Euler(-1.2, 0.5, 0.6)],
          ["shoulder_R", new THREE.Euler(-1.2, -0.5, -0.6)],
          ["elbow_L", new THREE.Euler(0, 0, -2.2)],
          ["elbow_R", new THREE.Euler(0, 0, 2.2)],
          ["spine_upper", new THREE.Euler(0.12, -0.3, 0)],
        ]),
        bonePositions: new Map([
          ["hand_L", new THREE.Vector3(0.3, 0.5, 0)],
          ["hand_R", new THREE.Vector3(0.3, -0.5, 0)],
        ]),
        easing: "ease-out",
      },
      {
        time: 0.15,
        boneRotations: new Map([
          ["shoulder_L", new THREE.Euler(-1.5, 0.8, 0.7)],
          ["shoulder_R", new THREE.Euler(-1.0, -0.3, -0.4)],
          ["elbow_L", new THREE.Euler(0, 0, -1.8)],
          ["elbow_R", new THREE.Euler(0, 0, 2.4)],
          ["spine_upper", new THREE.Euler(0.15, -0.4, 0)],
        ]),
        bonePositions: new Map([
          ["hand_L", new THREE.Vector3(0.5, 0.6, 0.1)],
          ["hand_R", new THREE.Vector3(0.2, -0.4, 0)],
        ]),
        easing: "linear",
      },
      {
        time: 0.35,
        boneRotations: new Map([
          ["shoulder_L", new THREE.Euler(-1.2, 0.5, 0.6)],
          ["shoulder_R", new THREE.Euler(-1.2, -0.5, -0.6)],
          ["elbow_L", new THREE.Euler(0, 0, -2.2)],
          ["elbow_R", new THREE.Euler(0, 0, 2.2)],
          ["spine_upper", new THREE.Euler(0.12, -0.3, 0)],
        ]),
        bonePositions: new Map(),
        easing: "ease-in",
      },
    ],
  };
}

describe("LateralityTransform", () => {
  describe("applyLaterality()", () => {
    let testAnimation: SkeletalAnimation;

    beforeEach(() => {
      testAnimation = createTestAnimation("test_punch");
    });

    describe("Right Laterality (Default)", () => {
      it("should return original animation unchanged", () => {
        const result = applyLaterality(testAnimation, "right");
        
        // Should return same reference (no transformation)
        expect(result).toBe(testAnimation);
        expect(result.name).toBe("test_punch");
        expect(result.koreanName).toBe("테스트 test_punch");
      });

      it("should preserve all keyframes", () => {
        const result = applyLaterality(testAnimation, "right");
        
        expect(result.keyframes).toBe(testAnimation.keyframes);
        expect(result.keyframes.length).toBe(3);
      });

      it("should preserve bone rotations", () => {
        const result = applyLaterality(testAnimation, "right");
        const firstKeyframe = result.keyframes[0];
        
        const leftShoulder = firstKeyframe.boneRotations.get("shoulder_L");
        expect(leftShoulder).toBeDefined();
        expect(leftShoulder?.x).toBeCloseTo(-1.2);
        expect(leftShoulder?.y).toBeCloseTo(0.5);
        expect(leftShoulder?.z).toBeCloseTo(0.6);
      });
    });

    describe("Left Laterality (Mirrored)", () => {
      it("should create mirrored animation with updated name", () => {
        const result = applyLaterality(testAnimation, "left");
        
        expect(result.name).toBe("test_punch_left");
        expect(result.koreanName).toBe("테스트 test_punch (왼발)");
        expect(result.duration).toBe(0.35);
        expect(result.type).toBe("attack");
        expect(result.loop).toBe(false);
      });

      it("should mirror all keyframes", () => {
        const result = applyLaterality(testAnimation, "left");
        
        expect(result.keyframes.length).toBe(3);
        expect(result.keyframes[0].time).toBe(0);
        expect(result.keyframes[1].time).toBe(0.15);
        expect(result.keyframes[2].time).toBe(0.35);
      });

      it("should preserve easing functions", () => {
        const result = applyLaterality(testAnimation, "left");
        
        expect(result.keyframes[0].easing).toBe("ease-out");
        expect(result.keyframes[1].easing).toBe("linear");
        expect(result.keyframes[2].easing).toBe("ease-in");
      });

      it("should swap left and right bone names", () => {
        const result = applyLaterality(testAnimation, "left");
        const firstKeyframe = result.keyframes[0];
        
        // Original left shoulder should become right shoulder
        const rightShoulder = firstKeyframe.boneRotations.get("shoulder_R");
        expect(rightShoulder).toBeDefined();
        
        // Original right shoulder should become left shoulder
        const leftShoulder = firstKeyframe.boneRotations.get("shoulder_L");
        expect(leftShoulder).toBeDefined();
        
        // Both should be present
        expect(firstKeyframe.boneRotations.has("shoulder_L")).toBe(true);
        expect(firstKeyframe.boneRotations.has("shoulder_R")).toBe(true);
      });

      it("should preserve centerline bone names", () => {
        const result = applyLaterality(testAnimation, "left");
        const firstKeyframe = result.keyframes[0];
        
        // Spine (no laterality marker) should keep same name
        const spine = firstKeyframe.boneRotations.get("spine_upper");
        expect(spine).toBeDefined();
      });

      it("should negate Y and Z rotations", () => {
        const result = applyLaterality(testAnimation, "left");
        const firstKeyframe = result.keyframes[0];
        
        // Get mirrored left shoulder (was originally right shoulder)
        const mirroredLeftShoulder = firstKeyframe.boneRotations.get("shoulder_L");
        expect(mirroredLeftShoulder).toBeDefined();
        
        // Original right shoulder: (-1.2, -0.5, -0.6)
        // Mirrored to left:       (-1.2,  0.5,  0.6)
        expect(mirroredLeftShoulder?.x).toBeCloseTo(-1.2); // X preserved
        expect(mirroredLeftShoulder?.y).toBeCloseTo(0.5);  // Y negated
        expect(mirroredLeftShoulder?.z).toBeCloseTo(0.6);  // Z negated
      });

      it("should preserve X rotations (forward/back bend)", () => {
        const result = applyLaterality(testAnimation, "left");
        
        // Check all keyframes
        result.keyframes.forEach((keyframe, index) => {
          const originalKeyframe = testAnimation.keyframes[index];
          
          // For mirrored left shoulder (originally right)
          const mirroredLeft = keyframe.boneRotations.get("shoulder_L");
          const originalRight = originalKeyframe.boneRotations.get("shoulder_R");
          
          if (mirroredLeft && originalRight) {
            expect(mirroredLeft.x).toBeCloseTo(originalRight.x);
          }
        });
      });

      it("should mirror bone positions", () => {
        const result = applyLaterality(testAnimation, "left");
        const firstKeyframe = result.keyframes[0];
        
        // Original left hand: (0.3, 0.5, 0)
        // Mirrored to right:  (0.3, -0.5, 0) - Y negated
        const mirroredRightHand = firstKeyframe.bonePositions.get("hand_R");
        expect(mirroredRightHand).toBeDefined();
        expect(mirroredRightHand?.x).toBeCloseTo(0.3);   // X preserved
        expect(mirroredRightHand?.y).toBeCloseTo(-0.5);  // Y negated
        expect(mirroredRightHand?.z).toBeCloseTo(0);     // Z preserved
      });

      it("should handle keyframes without bone positions", () => {
        const result = applyLaterality(testAnimation, "left");
        const lastKeyframe = result.keyframes[2];
        
        // Last keyframe has empty positions map
        expect(lastKeyframe.bonePositions).toBeDefined();
        expect(lastKeyframe.bonePositions.size).toBe(0);
      });
    });

    describe("Multiple Keyframe Consistency", () => {
      it("should mirror all keyframes consistently", () => {
        const result = applyLaterality(testAnimation, "left");
        
        // Check that all keyframes have mirrored bones
        result.keyframes.forEach((keyframe) => {
          expect(keyframe.boneRotations.has("shoulder_L")).toBe(true);
          expect(keyframe.boneRotations.has("shoulder_R")).toBe(true);
          expect(keyframe.boneRotations.has("elbow_L")).toBe(true);
          expect(keyframe.boneRotations.has("elbow_R")).toBe(true);
          expect(keyframe.boneRotations.has("spine_upper")).toBe(true);
        });
      });

      it("should maintain bone count across keyframes", () => {
        const result = applyLaterality(testAnimation, "left");
        
        result.keyframes.forEach((keyframe, index) => {
          const originalKeyframe = testAnimation.keyframes[index];
          expect(keyframe.boneRotations.size).toBe(originalKeyframe.boneRotations.size);
        });
      });
    });
  });

  describe("Bone Name Mirroring", () => {
    it("should mirror _L suffix to _R", () => {
      const anim = createTestAnimation("test");
      const result = applyLaterality(anim, "left");
      
      const firstKeyframe = result.keyframes[0];
      expect(firstKeyframe.boneRotations.has("shoulder_R")).toBe(true);
      expect(firstKeyframe.boneRotations.has("elbow_R")).toBe(true);
    });

    it("should mirror _R suffix to _L", () => {
      const anim = createTestAnimation("test");
      const result = applyLaterality(anim, "left");
      
      const firstKeyframe = result.keyframes[0];
      expect(firstKeyframe.boneRotations.has("shoulder_L")).toBe(true);
      expect(firstKeyframe.boneRotations.has("elbow_L")).toBe(true);
    });

    it("should handle bones without laterality markers", () => {
      const anim = createTestAnimation("test");
      const result = applyLaterality(anim, "left");
      
      const firstKeyframe = result.keyframes[0];
      expect(firstKeyframe.boneRotations.has("spine_upper")).toBe(true);
    });

    it("should handle left_ prefix pattern", () => {
      const anim: SkeletalAnimation = {
        name: "test_prefix",
        koreanName: "테스트",
        duration: 0.2,
        loop: false,
        type: "attack",
        keyframes: [
          {
            time: 0,
            boneRotations: new Map([
              ["left_hand", new THREE.Euler(0.5, 0.3, 0.2)],
              ["right_hand", new THREE.Euler(0.5, -0.3, -0.2)],
            ]),
            bonePositions: new Map(),
          },
        ],
      };
      
      const result = applyLaterality(anim, "left");
      const keyframe = result.keyframes[0];
      
      expect(keyframe.boneRotations.has("right_hand")).toBe(true);
      expect(keyframe.boneRotations.has("left_hand")).toBe(true);
    });
  });

  describe("getAnimationLaterality()", () => {
    it("should detect right laterality by default", () => {
      const anim = createTestAnimation("test_punch");
      expect(getAnimationLaterality(anim)).toBe("right");
    });

    it("should detect left laterality from _left suffix", () => {
      const anim = createTestAnimation("test_punch_left");
      expect(getAnimationLaterality(anim)).toBe("left");
    });

    it("should work with transformed animations", () => {
      const original = createTestAnimation("test_punch");
      const mirrored = applyLaterality(original, "left");
      
      expect(getAnimationLaterality(original)).toBe("right");
      expect(getAnimationLaterality(mirrored)).toBe("left");
    });
  });

  describe("areLateralityVariants()", () => {
    it("should identify laterality variants", () => {
      const right = createTestAnimation("test_punch");
      const left = applyLaterality(right, "left");
      
      expect(areLateralityVariants(right, left)).toBe(true);
      expect(areLateralityVariants(left, right)).toBe(true);
    });

    it("should reject different base animations", () => {
      const punch = createTestAnimation("test_punch");
      const kick = createTestAnimation("test_kick");
      
      expect(areLateralityVariants(punch, kick)).toBe(false);
    });

    it("should reject same laterality animations", () => {
      const right1 = createTestAnimation("test_punch");
      const right2 = createTestAnimation("test_punch");
      
      expect(areLateralityVariants(right1, right2)).toBe(false);
    });

    it("should handle animations with _left suffix in base name", () => {
      const anim1 = createTestAnimation("move_left_step");
      const anim2 = createTestAnimation("move_left_step_left");
      
      expect(areLateralityVariants(anim1, anim2)).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle animation with single keyframe", () => {
      const anim: SkeletalAnimation = {
        name: "single_frame",
        koreanName: "단일 프레임",
        duration: 0.1,
        loop: false,
        type: "stance",
        keyframes: [
          {
            time: 0,
            boneRotations: new Map([
              ["shoulder_L", new THREE.Euler(0, 0, 0)],
            ]),
            bonePositions: new Map(),
          },
        ],
      };
      
      const result = applyLaterality(anim, "left");
      
      expect(result.keyframes.length).toBe(1);
      expect(result.keyframes[0].boneRotations.has("shoulder_R")).toBe(true);
    });

    it("should handle animation with no bone positions", () => {
      const anim: SkeletalAnimation = {
        name: "no_positions",
        koreanName: "위치 없음",
        duration: 0.2,
        loop: false,
        type: "attack",
        keyframes: [
          {
            time: 0,
            boneRotations: new Map([
              ["shoulder_L", new THREE.Euler(0, 0, 0)],
            ]),
            bonePositions: new Map(),
          },
        ],
      };
      
      const result = applyLaterality(anim, "left");
      
      expect(result.keyframes[0].bonePositions).toBeDefined();
      expect(result.keyframes[0].bonePositions.size).toBe(0);
    });

    it("should handle zero rotations", () => {
      const anim: SkeletalAnimation = {
        name: "zero_rotation",
        koreanName: "영 회전",
        duration: 0.1,
        loop: false,
        type: "idle",
        keyframes: [
          {
            time: 0,
            boneRotations: new Map([
              ["shoulder_L", new THREE.Euler(0, 0, 0)],
              ["shoulder_R", new THREE.Euler(0, 0, 0)],
            ]),
            bonePositions: new Map(),
          },
        ],
      };
      
      const result = applyLaterality(anim, "left");
      const keyframe = result.keyframes[0];
      
      const leftShoulder = keyframe.boneRotations.get("shoulder_L");
      const rightShoulder = keyframe.boneRotations.get("shoulder_R");
      
      expect(leftShoulder?.x).toBeCloseTo(0);
      expect(leftShoulder?.y).toBeCloseTo(0);
      expect(leftShoulder?.z).toBeCloseTo(0);
      expect(rightShoulder?.x).toBeCloseTo(0);
      expect(rightShoulder?.y).toBeCloseTo(0);
      expect(rightShoulder?.z).toBeCloseTo(0);
    });

    it("should handle empty bone rotations map", () => {
      const anim: SkeletalAnimation = {
        name: "empty_map",
        koreanName: "빈 맵",
        duration: 0.1,
        loop: false,
        type: "idle",
        keyframes: [
          {
            time: 0,
            boneRotations: new Map(),
            bonePositions: new Map(),
          },
        ],
      };
      
      const result = applyLaterality(anim, "left");
      
      expect(result.keyframes[0].boneRotations.size).toBe(0);
    });
  });

  describe("Performance", () => {
    it("should transform animation in less than 1ms", () => {
      const anim = createTestAnimation("performance_test");
      
      const startTime = performance.now();
      applyLaterality(anim, "left");
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(1.0); // <1ms requirement
    });

    it("should handle complex animation with many bones efficiently", () => {
      // Create animation with 20 bones and 10 keyframes
      const complexAnim: SkeletalAnimation = {
        name: "complex_animation",
        koreanName: "복잡한 애니메이션",
        duration: 1.0,
        loop: false,
        type: "attack",
        keyframes: Array.from({ length: 10 }, (_, i) => ({
          time: i * 0.1,
          boneRotations: new Map([
            ["shoulder_L", new THREE.Euler(0.5, 0.3, 0.2)],
            ["shoulder_R", new THREE.Euler(0.5, -0.3, -0.2)],
            ["elbow_L", new THREE.Euler(0, 0, -1.5)],
            ["elbow_R", new THREE.Euler(0, 0, 1.5)],
            ["wrist_L", new THREE.Euler(0.2, 0.1, 0)],
            ["wrist_R", new THREE.Euler(0.2, -0.1, 0)],
            ["hip_L", new THREE.Euler(0.3, 0.2, 0)],
            ["hip_R", new THREE.Euler(0.3, -0.2, 0)],
            ["knee_L", new THREE.Euler(0.5, 0, 0)],
            ["knee_R", new THREE.Euler(0.5, 0, 0)],
            ["ankle_L", new THREE.Euler(-0.1, 0, 0)],
            ["ankle_R", new THREE.Euler(-0.1, 0, 0)],
            ["spine_lower", new THREE.Euler(0.1, 0.2, 0)],
            ["spine_upper", new THREE.Euler(0.15, 0.25, 0)],
            ["neck", new THREE.Euler(0.05, 0.1, 0)],
            ["head", new THREE.Euler(0.02, 0.05, 0)],
          ]),
          bonePositions: new Map([
            ["hand_L", new THREE.Vector3(0.3, 0.5, 0)],
            ["hand_R", new THREE.Vector3(0.3, -0.5, 0)],
            ["foot_L", new THREE.Vector3(0.1, 0.2, 0)],
            ["foot_R", new THREE.Vector3(0.1, -0.2, 0)],
          ]),
          easing: "linear",
        })),
      };
      
      const startTime = performance.now();
      applyLaterality(complexAnim, "left");
      const endTime = performance.now();
      
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(1.0); // <1ms even for complex animations
    });

    it("should not create unnecessary object copies for right laterality", () => {
      const anim = createTestAnimation("no_copy_test");
      const result = applyLaterality(anim, "right");
      
      // Should be same reference (no transformation overhead)
      expect(result).toBe(anim);
      expect(result.keyframes).toBe(anim.keyframes);
    });
  });

  describe("Korean Terminology Integration", () => {
    it("should add Korean laterality marker for left animations", () => {
      const anim = createTestAnimation("test_technique");
      anim.koreanName = "건 뼈부러뜨리기";
      
      const result = applyLaterality(anim, "left");
      
      expect(result.koreanName).toBe("건 뼈부러뜨리기 (왼발)");
      expect(result.koreanName).toContain("왼발"); // Left foot forward marker
    });

    it("should preserve original Korean name for right laterality", () => {
      const anim = createTestAnimation("test_technique");
      anim.koreanName = "건 뼈부러뜨리기";
      
      const result = applyLaterality(anim, "right");
      
      expect(result.koreanName).toBe("건 뼈부러뜨리기");
    });
  });
});
