/**
 * Tests for MartialPoseApplicator
 *
 * @module systems/animation/__tests__/MartialPoseApplicator.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  applyMartialPoseToConfig,
  applyMartialPoseToKeyframe,
  getMartialPose,
  type MartialPose,
} from './MartialPoseApplicator';
import { KeyframeConfig } from './KeyframeConfig';
import type { AnimationKeyframe } from '@/types/skeletal';
import { BoneName } from '@/types/skeletal';
import { MARTIAL_POSES } from './MartialArtsConstants';

describe('MartialPoseApplicator', () => {
  describe('applyMartialPoseToConfig', () => {
    let config: KeyframeConfig;

    beforeEach(() => {
      config = new KeyframeConfig();
    });

    it('should apply guard pose to config', () => {
      const pose = MARTIAL_POSES.GUARD;
      applyMartialPoseToConfig(config, pose);

      // Verify upper body bones are set
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_L)).toBe(true);
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
    });

    it('should apply high guard pose correctly', () => {
      const pose = MARTIAL_POSES.HIGH_GUARD;
      applyMartialPoseToConfig(config, pose);

      // Verify pose-specific rotations
      const leftShoulder = config.rotations.get(BoneName.SHOULDER_L);
      expect(leftShoulder).toBeDefined();
      expect(leftShoulder?.x).toBe(pose.leftShoulder[0]);
      expect(leftShoulder?.y).toBe(pose.leftShoulder[1]);
      expect(leftShoulder?.z).toBe(pose.leftShoulder[2]);
    });

    it('should apply clinch pose correctly', () => {
      const pose = MARTIAL_POSES.CLINCH;
      applyMartialPoseToConfig(config, pose);

      // Verify all upper body bones
      expect(config.rotations.size).toBeGreaterThan(0);
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
    });

    it('should apply grapple entry pose correctly', () => {
      const pose = MARTIAL_POSES.GRAPPLE_ENTRY;
      applyMartialPoseToConfig(config, pose);

      // Verify extension-specific rotations
      expect(config.rotations.has(BoneName.ELBOW_R)).toBe(true);
    });

    it('should handle pose with missing optional bones', () => {
      // Create a minimal pose with only required bones
      const minimalPose = {
        leftShoulder: [0.1, 0.2, 0.3] as const,
        leftElbow: [0.4, 0.5, 0.6] as const,
        rightShoulder: [0.7, 0.8, 0.9] as const,
        rightElbow: [1.0, 1.1, 1.2] as const,
      } as unknown as MartialPose;

      applyMartialPoseToConfig(config, minimalPose);

      expect(config.rotations.size).toBe(4);
    });
  });

  describe('applyMartialPoseToKeyframe', () => {
    let keyframe: AnimationKeyframe;

    beforeEach(() => {
      keyframe = {
        time: 0,
        easing: 'linear',
        boneRotations: new Map(),
        bonePositions: new Map(),
      };
    });

    it('should apply guard pose to keyframe', () => {
      const pose = MARTIAL_POSES.GUARD;
      applyMartialPoseToKeyframe(keyframe, pose);

      // Verify rotations are THREE.Euler objects
      const leftShoulder = keyframe.boneRotations.get(BoneName.SHOULDER_L);
      expect(leftShoulder).toBeInstanceOf(THREE.Euler);
      expect(leftShoulder?.x).toBe(pose.leftShoulder[0]);
    });

    it('should apply high guard pose to keyframe', () => {
      const pose = MARTIAL_POSES.HIGH_GUARD;
      applyMartialPoseToKeyframe(keyframe, pose);

      // Verify all upper body bones
      expect(keyframe.boneRotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(keyframe.boneRotations.has(BoneName.SHOULDER_R)).toBe(true);
      expect(keyframe.boneRotations.has(BoneName.ELBOW_L)).toBe(true);
      expect(keyframe.boneRotations.has(BoneName.ELBOW_R)).toBe(true);
    });

    it('should create proper THREE.Euler rotations', () => {
      const pose = MARTIAL_POSES.GUARD;
      applyMartialPoseToKeyframe(keyframe, pose);

      const rotation = keyframe.boneRotations.get(BoneName.SHOULDER_R);
      expect(rotation).toBeInstanceOf(THREE.Euler);
      expect(typeof rotation?.x).toBe('number');
      expect(typeof rotation?.y).toBe('number');
      expect(typeof rotation?.z).toBe('number');
    });

    it('should overwrite existing bone rotations', () => {
      // Set initial rotation
      keyframe.boneRotations.set(
        BoneName.SHOULDER_L,
        new THREE.Euler(1, 1, 1)
      );

      // Apply pose (should overwrite)
      const pose = MARTIAL_POSES.GUARD;
      applyMartialPoseToKeyframe(keyframe, pose);

      const rotation = keyframe.boneRotations.get(BoneName.SHOULDER_L);
      expect(rotation?.x).toBe(pose.leftShoulder[0]);
      expect(rotation?.x).not.toBe(1);
    });

    it('should apply clinch pose correctly', () => {
      const pose = MARTIAL_POSES.CLINCH;
      applyMartialPoseToKeyframe(keyframe, pose);

      expect(keyframe.boneRotations.size).toBeGreaterThan(0);
    });

    it('should apply neutral pose correctly', () => {
      const pose = MARTIAL_POSES.NEUTRAL;
      applyMartialPoseToKeyframe(keyframe, pose);

      expect(keyframe.boneRotations.has(BoneName.ELBOW_R)).toBe(true);
    });
  });

  describe('getMartialPose', () => {
    it('should return guard pose', () => {
      const pose = getMartialPose('GUARD');
      expect(pose).toBe(MARTIAL_POSES.GUARD);
      expect(pose).toHaveProperty('leftShoulder');
      expect(pose).toHaveProperty('rightShoulder');
    });

    it('should return high guard pose', () => {
      const pose = getMartialPose('HIGH_GUARD');
      expect(pose).toBe(MARTIAL_POSES.HIGH_GUARD);
    });

    it('should return clinch pose', () => {
      const pose = getMartialPose('CLINCH');
      expect(pose).toBe(MARTIAL_POSES.CLINCH);
    });

    it('should return neutral pose', () => {
      const pose = getMartialPose('NEUTRAL');
      expect(pose).toBe(MARTIAL_POSES.NEUTRAL);
    });

    it('should return grapple entry pose', () => {
      const pose = getMartialPose('GRAPPLE_ENTRY');
      expect(pose).toBe(MARTIAL_POSES.GRAPPLE_ENTRY);
    });
  });

  describe('Integration - Multiple poses', () => {
    it('should apply different poses to same keyframe', () => {
      const keyframe: AnimationKeyframe = {
        time: 0,
        easing: 'linear',
        boneRotations: new Map(),
        bonePositions: new Map(),
      };

      // Apply guard first
      applyMartialPoseToKeyframe(keyframe, MARTIAL_POSES.GUARD);
      const initialSize = keyframe.boneRotations.size;

      // Apply high guard (should overwrite)
      applyMartialPoseToKeyframe(keyframe, MARTIAL_POSES.HIGH_GUARD);

      expect(keyframe.boneRotations.size).toBe(initialSize);
      const leftShoulder = keyframe.boneRotations.get(BoneName.SHOULDER_L);
      expect(leftShoulder?.x).toBe(MARTIAL_POSES.HIGH_GUARD.leftShoulder[0]);
    });

    it('should work with KeyframeConfig fluent API', () => {
      const config = new KeyframeConfig();

      // Apply pose through config
      applyMartialPoseToConfig(config, MARTIAL_POSES.GUARD);

      // Add additional rotations
      config.rotate(BoneName.PELVIS, 0, 0.5, 0);

      // Verify both pose and pelvis rotation are set
      expect(config.rotations.has(BoneName.SHOULDER_L)).toBe(true);
      expect(config.rotations.has(BoneName.PELVIS)).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty keyframe gracefully', () => {
      const keyframe: AnimationKeyframe = {
        time: 0,
        easing: 'linear',
        boneRotations: new Map(),
        bonePositions: new Map(),
      };

      expect(() => {
        applyMartialPoseToKeyframe(keyframe, MARTIAL_POSES.GUARD);
      }).not.toThrow();

      expect(keyframe.boneRotations.size).toBeGreaterThan(0);
    });

    it('should handle pose with undefined optional properties', () => {
      const config = new KeyframeConfig();
      const poseWithOptionals = {
        leftShoulder: [0, 0, 0] as const,
        leftElbow: [0, 0, 0] as const,
        rightShoulder: [0, 0, 0] as const,
        rightElbow: [0, 0, 0] as const,
        leftWrist: undefined,
        rightWrist: undefined,
      } as unknown as MartialPose;

      expect(() => {
        applyMartialPoseToConfig(config, poseWithOptionals);
      }).not.toThrow();
    });

    it('should apply all available MARTIAL_POSES without errors', () => {
      Object.keys(MARTIAL_POSES).forEach((poseKey) => {
        const testConfig = new KeyframeConfig();
        expect(() => {
          applyMartialPoseToConfig(
            testConfig,
            MARTIAL_POSES[poseKey as keyof typeof MARTIAL_POSES]
          );
        }).not.toThrow();
      });
    });
  });
});
