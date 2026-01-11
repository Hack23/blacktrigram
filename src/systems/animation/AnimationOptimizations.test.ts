/**
 * Tests for Animation Optimizations
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as THREE from "three";
import {
  animationCache,
  batchUpdateBones,
  precomputeAnimation,
  interpolateKeyframeCached,
  batchTransformBones,
  calculateDirtyBones,
  performanceMonitor,
} from "./AnimationOptimizations";
import { ThreeObjectPools } from "../../utils/threeObjectPool";
import { createHumanoidRig } from "./SkeletonRig";
import { BoneName } from "../../types/skeletal";
import type { SkeletalAnimation, AnimationKeyframe } from "../../types/skeletal";

describe("Animation Optimizations", () => {
  beforeEach(() => {
    animationCache.clear();
    ThreeObjectPools.clearAll();
    performanceMonitor.reset();
  });

  afterEach(() => {
    animationCache.clear();
    ThreeObjectPools.clearAll();
  });

  describe("AnimationCacheManager", () => {
    const createTestAnimation = (): SkeletalAnimation => ({
      id: "test-anim",
      name: { korean: "테스트", english: "test" },
      duration: 1.0,
      type: "attack",
      keyframes: [
        {
          time: 0.0,
          rotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
        },
        {
          time: 0.5,
          rotations: new Map([
            [BoneName.SHOULDER_R, new THREE.Euler(Math.PI / 4, 0, 0)],
          ]),
        },
        {
          time: 1.0,
          rotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
        },
      ],
    });

    it("should cache keyframe interpolations", () => {
      const animation = createTestAnimation();

      // First call should miss cache
      const keyframe1 = interpolateKeyframeCached("test", animation, 0.25);
      expect(keyframe1).not.toBeNull();

      // Second call should hit cache
      const keyframe2 = interpolateKeyframeCached("test", animation, 0.25);
      expect(keyframe2).not.toBeNull();
      expect(keyframe2).toBe(keyframe1); // Same reference
    });

    it("should return null for empty animation", () => {
      const emptyAnimation: SkeletalAnimation = {
        id: "empty",
        name: { korean: "빈", english: "empty" },
        duration: 1.0,
        type: "idle",
        keyframes: [],
      };

      const keyframe = interpolateKeyframeCached("empty", emptyAnimation, 0.5);
      expect(keyframe).toBeNull();
    });

    it("should interpolate between keyframes correctly", () => {
      const animation = createTestAnimation();

      // Interpolate at 25% (between 0.0 and 0.5)
      const keyframe = interpolateKeyframeCached("test", animation, 0.25);
      expect(keyframe).not.toBeNull();

      const rotation = keyframe!.rotations.get(BoneName.SHOULDER_R);
      expect(rotation).toBeDefined();

      // Should be roughly halfway between 0 and PI/4
      expect(rotation!.x).toBeGreaterThan(0);
      expect(rotation!.x).toBeLessThan(Math.PI / 4);
    });

    it("should return exact keyframe when time matches", () => {
      const animation = createTestAnimation();

      const keyframe = interpolateKeyframeCached("test", animation, 0.5);
      expect(keyframe).not.toBeNull();

      const rotation = keyframe!.rotations.get(BoneName.SHOULDER_R);
      expect(rotation).toBeDefined();
      expect(rotation!.x).toBeCloseTo(Math.PI / 4, 3);
    });

    it("should cache multiple animations independently", () => {
      const anim1 = createTestAnimation();
      anim1.id = "anim1";

      const anim2 = createTestAnimation();
      anim2.id = "anim2";

      interpolateKeyframeCached("anim1", anim1, 0.25);
      interpolateKeyframeCached("anim2", anim2, 0.25);

      const stats = animationCache.getStats();
      expect(stats.totalAnimations).toBe(2);
    });

    it("should evict LRU entries when cache is full", () => {
      const animations: SkeletalAnimation[] = [];

      // Create more animations than cache size (50)
      for (let i = 0; i < 60; i++) {
        const anim = createTestAnimation();
        anim.id = `anim-${i}`;
        animations.push(anim);
        interpolateKeyframeCached(`anim-${i}`, anim, 0.5);
      }

      const stats = animationCache.getStats();
      expect(stats.totalAnimations).toBeLessThanOrEqual(50);
    });
  });

  describe("precomputeAnimation", () => {
    it("should precompute animation keyframes", () => {
      const animation: SkeletalAnimation = {
        id: "precomputed",
        name: { korean: "사전계산", english: "precomputed" },
        duration: 1.0,
        type: "attack",
        keyframes: [
          {
            time: 0.0,
            rotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
          },
          {
            time: 1.0,
            rotations: new Map([
              [BoneName.SHOULDER_R, new THREE.Euler(Math.PI, 0, 0)],
            ]),
          },
        ],
      };

      precomputeAnimation("precomputed", animation, 30); // 30 fps

      const stats = animationCache.getStats();
      expect(stats.totalKeyframes).toBeGreaterThan(0);

      // Subsequent interpolations should hit cache
      const keyframe = interpolateKeyframeCached("precomputed", animation, 0.5);
      expect(keyframe).not.toBeNull();
    });

    it("should support different sample rates", () => {
      const animation: SkeletalAnimation = {
        id: "sample-rate",
        name: { korean: "샘플율", english: "sample-rate" },
        duration: 0.5,
        type: "attack",
        keyframes: [
          {
            time: 0.0,
            rotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
          },
          {
            time: 0.5,
            rotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(Math.PI / 2, 0, 0)]]),
          },
        ],
      };

      // Precompute at 60fps
      precomputeAnimation("sample-rate", animation, 60);

      const stats = animationCache.getStats();
      expect(stats.totalKeyframes).toBeGreaterThan(0);
    });
  });

  describe("batchUpdateBones", () => {
    it("should update multiple bones efficiently", () => {
      const rig = createHumanoidRig();

      const keyframe: AnimationKeyframe = {
        time: 0.0,
        rotations: new Map([
          [BoneName.SHOULDER_R, new THREE.Euler(1, 0, 0)],
          [BoneName.SHOULDER_L, new THREE.Euler(-1, 0, 0)],
        ]),
      };

      batchUpdateBones(rig, keyframe);

      const rightShoulder = rig.bones.get(BoneName.SHOULDER_R);
      const leftShoulder = rig.bones.get(BoneName.SHOULDER_L);

      expect(rightShoulder?.rotation.x).toBe(1);
      expect(leftShoulder?.rotation.x).toBe(-1);
    });

    it("should update only dirty bones when provided", () => {
      const rig = createHumanoidRig();

      const keyframe: AnimationKeyframe = {
        time: 0.0,
        rotations: new Map([
          [BoneName.SHOULDER_R, new THREE.Euler(1, 0, 0)],
          [BoneName.SHOULDER_L, new THREE.Euler(-1, 0, 0)],
          [BoneName.ELBOW_R, new THREE.Euler(0.5, 0, 0)],
        ]),
      };

      const dirtyBones = new Set([BoneName.SHOULDER_R, BoneName.ELBOW_R]);

      batchUpdateBones(rig, keyframe, dirtyBones);

      const rightShoulder = rig.bones.get(BoneName.SHOULDER_R);
      const leftShoulder = rig.bones.get(BoneName.SHOULDER_L);
      const rightElbow = rig.bones.get(BoneName.ELBOW_R);

      expect(rightShoulder?.rotation.x).toBe(1);
      expect(rightElbow?.rotation.x).toBe(0.5);
      // Left shoulder should NOT be updated (not in dirty set)
      expect(leftShoulder?.rotation.x).toBe(0);
    });

    it("should handle missing bones gracefully", () => {
      const rig = createHumanoidRig();

      const keyframe: AnimationKeyframe = {
        time: 0.0,
        rotations: new Map([
          [BoneName.SHOULDER_R, new THREE.Euler(1, 0, 0)],
          ["non_existent_bone" as BoneName, new THREE.Euler(2, 0, 0)],
        ]),
      };

      // Should not throw
      expect(() => batchUpdateBones(rig, keyframe)).not.toThrow();
    });

    it("should update positions if provided", () => {
      const rig = createHumanoidRig();

      const keyframe: AnimationKeyframe = {
        time: 0.0,
        rotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
        positions: new Map([[BoneName.SHOULDER_R, new THREE.Vector3(1, 2, 3)]]),
      };

      batchUpdateBones(rig, keyframe);

      const rightShoulder = rig.bones.get(BoneName.SHOULDER_R);
      expect(rightShoulder?.position.x).toBe(1);
      expect(rightShoulder?.position.y).toBe(2);
      expect(rightShoulder?.position.z).toBe(3);
    });
  });

  describe("batchTransformBones", () => {
    it("should apply transforms to multiple bones", () => {
      const rig = createHumanoidRig();

      const transforms = new Map([
        [
          BoneName.SHOULDER_R,
          {
            rotation: new THREE.Euler(1, 0, 0),
            position: new THREE.Vector3(0.1, 0.2, 0.3),
          },
        ],
        [BoneName.SHOULDER_L, { rotation: new THREE.Euler(-1, 0, 0) }],
      ]);

      batchTransformBones(rig, transforms);

      const rightShoulder = rig.bones.get(BoneName.SHOULDER_R);
      const leftShoulder = rig.bones.get(BoneName.SHOULDER_L);

      expect(rightShoulder?.rotation.x).toBe(1);
      expect(rightShoulder?.position.x).toBe(0.1);
      expect(leftShoulder?.rotation.x).toBe(-1);
    });
  });

  describe("calculateDirtyBones", () => {
    it("should identify bones with changed rotations", () => {
      const keyframe1: AnimationKeyframe = {
        time: 0.0,
        rotations: new Map([
          [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)],
          [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0)],
          [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0)],
        ]),
      };

      const keyframe2: AnimationKeyframe = {
        time: 0.1,
        rotations: new Map([
          [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0)], // Changed
          [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0)], // Same
          [BoneName.ELBOW_R, new THREE.Euler(0.2, 0, 0)], // Changed
        ]),
      };

      const dirtyBones = calculateDirtyBones(keyframe1, keyframe2, 0.01);

      expect(dirtyBones.has(BoneName.SHOULDER_R)).toBe(true);
      expect(dirtyBones.has(BoneName.ELBOW_R)).toBe(true);
      expect(dirtyBones.has(BoneName.SHOULDER_L)).toBe(false);
    });

    it("should identify new bones as dirty", () => {
      const keyframe1: AnimationKeyframe = {
        time: 0.0,
        rotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
      };

      const keyframe2: AnimationKeyframe = {
        time: 0.1,
        rotations: new Map([
          [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)],
          [BoneName.SHOULDER_L, new THREE.Euler(1, 0, 0)], // New bone
        ]),
      };

      const dirtyBones = calculateDirtyBones(keyframe1, keyframe2);

      expect(dirtyBones.has(BoneName.SHOULDER_L)).toBe(true);
    });

    it("should use threshold for small changes", () => {
      const keyframe1: AnimationKeyframe = {
        time: 0.0,
        rotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
      };

      const keyframe2: AnimationKeyframe = {
        time: 0.1,
        rotations: new Map([
          [BoneName.SHOULDER_R, new THREE.Euler(0.001, 0, 0)], // Very small change
        ]),
      };

      const dirtyBones = calculateDirtyBones(keyframe1, keyframe2, 0.01);

      expect(dirtyBones.has(BoneName.SHOULDER_R)).toBe(false); // Below threshold
    });

    it("should check positions if animated", () => {
      const keyframe1: AnimationKeyframe = {
        time: 0.0,
        rotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
        positions: new Map([[BoneName.SHOULDER_R, new THREE.Vector3(0, 0, 0)]]),
      };

      const keyframe2: AnimationKeyframe = {
        time: 0.1,
        rotations: new Map([[BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)]]),
        positions: new Map([[BoneName.SHOULDER_R, new THREE.Vector3(1, 0, 0)]]), // Changed
      };

      const dirtyBones = calculateDirtyBones(keyframe1, keyframe2, 0.01);

      expect(dirtyBones.has(BoneName.SHOULDER_R)).toBe(true);
    });
  });

  describe("AnimationPerformanceMonitor", () => {
    it("should record frame times", () => {
      performanceMonitor.recordFrame(10);
      performanceMonitor.recordFrame(12);
      performanceMonitor.recordFrame(11);

      const metrics = performanceMonitor.getMetrics();

      expect(metrics.frameCount).toBe(3);
      expect(metrics.avgFrameTime).toBeCloseTo(11, 1);
      expect(metrics.maxFrameTime).toBe(12);
      expect(metrics.minFrameTime).toBe(10);
    });

    it("should track cache hit rate", () => {
      performanceMonitor.recordCacheHit();
      performanceMonitor.recordCacheHit();
      performanceMonitor.recordCacheMiss();

      const metrics = performanceMonitor.getMetrics();

      expect(metrics.cacheHitRate).toBeCloseTo(0.667, 2); // 2/3
    });

    it("should limit sample size", () => {
      // Record more than maxSamples (120)
      for (let i = 0; i < 150; i++) {
        performanceMonitor.recordFrame(10);
      }

      const metrics = performanceMonitor.getMetrics();

      expect(metrics.frameCount).toBe(120); // Capped at maxSamples
    });

    it("should reset metrics", () => {
      performanceMonitor.recordFrame(10);
      performanceMonitor.recordCacheHit();

      performanceMonitor.reset();

      const metrics = performanceMonitor.getMetrics();

      expect(metrics.frameCount).toBe(0);
      expect(metrics.cacheHitRate).toBe(0);
    });
  });

  describe("Integration test: Full animation pipeline", () => {
    it("should optimize full animation playback", () => {
      // Prewarm object pools
      ThreeObjectPools.prewarmAll();

      // Create test animation
      const animation: SkeletalAnimation = {
        id: "full-test",
        name: { korean: "통합테스트", english: "full-test" },
        duration: 1.0,
        type: "attack",
        keyframes: [
          {
            time: 0.0,
            rotations: new Map([
              [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)],
              [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0)],
            ]),
          },
          {
            time: 0.5,
            rotations: new Map([
              [BoneName.SHOULDER_R, new THREE.Euler(Math.PI / 2, 0, 0)],
              [BoneName.ELBOW_R, new THREE.Euler(Math.PI / 4, 0, 0)],
            ]),
          },
          {
            time: 1.0,
            rotations: new Map([
              [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0)],
              [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0)],
            ]),
          },
        ],
      };

      // Precompute animation
      precomputeAnimation("full-test", animation, 60);

      // Create rig
      const rig = createHumanoidRig();

      // Simulate animation playback (60 frames)
      const frameTimes: number[] = [];
      for (let frame = 0; frame < 60; frame++) {
        const time = (frame / 60) * animation.duration;

        const start = performance.now();

        // Interpolate keyframe (should hit cache most of the time)
        const keyframe = interpolateKeyframeCached("full-test", animation, time);

        if (keyframe) {
          // Calculate dirty bones
          if (frame > 0) {
            const prevKeyframe = interpolateKeyframeCached(
              "full-test",
              animation,
              ((frame - 1) / 60) * animation.duration
            );
            if (prevKeyframe) {
              const dirtyBones = calculateDirtyBones(prevKeyframe, keyframe);
              batchUpdateBones(rig, keyframe, dirtyBones);
            }
          } else {
            batchUpdateBones(rig, keyframe);
          }
        }

        const frameTime = performance.now() - start;
        frameTimes.push(frameTime);
        performanceMonitor.recordFrame(frameTime);
      }

      const metrics = performanceMonitor.getMetrics();

      // Verify performance targets
      expect(metrics.avgFrameTime).toBeLessThan(5); // Target: <5ms per frame
      expect(metrics.maxFrameTime).toBeLessThan(10); // No frame should take >10ms
      expect(metrics.frameCount).toBe(60);

      // Verify rig was updated
      const rightShoulder = rig.bones.get(BoneName.SHOULDER_R);
      expect(rightShoulder).toBeDefined();
    });
  });
});
