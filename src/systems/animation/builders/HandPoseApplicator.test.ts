/**
 * Tests for HandPoseApplicator
 *
 * @module systems/animation/__tests__/HandPoseApplicator.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import {
  applyHandPoseToConfig,
  applyHandPoseToKeyframe,
  getHandPose,
  type HandSelection,
} from './HandPoseApplicator';
import { KeyframeConfig } from './KeyframeConfig';
import type { AnimationKeyframe } from '@/types/skeletal';
import { BoneName } from '@/types/skeletal';
import { HAND_POSES } from './MartialArtsConstants';

describe('HandPoseApplicator', () => {
  describe('applyHandPoseToConfig', () => {
    let config: KeyframeConfig;

    beforeEach(() => {
      config = new KeyframeConfig();
    });

    it('should apply fist pose to right hand', () => {
      const pose = HAND_POSES.FIST;
      applyHandPoseToConfig(config, pose, 'right');

      // Verify right hand bones are set
      expect(config.rotations.has(BoneName.THUMB_META_R)).toBe(true);
      expect(config.rotations.has(BoneName.INDEX_PROX_R)).toBe(true);
      expect(config.rotations.has(BoneName.MIDDLE_PROX_R)).toBe(true);

      // Verify left hand bones are not set
      expect(config.rotations.has(BoneName.THUMB_META_L)).toBe(false);
    });

    it('should apply pose to left hand', () => {
      const pose = HAND_POSES.FIST;
      applyHandPoseToConfig(config, pose, 'left');

      // Verify left hand bones are set
      expect(config.rotations.has(BoneName.THUMB_META_L)).toBe(true);
      expect(config.rotations.has(BoneName.INDEX_PROX_L)).toBe(true);

      // Verify right hand bones are not set
      expect(config.rotations.has(BoneName.THUMB_META_R)).toBe(false);
    });

    it('should apply pose to both hands', () => {
      const pose = HAND_POSES.FIST;
      applyHandPoseToConfig(config, pose, 'both');

      // Verify both hands are set
      expect(config.rotations.has(BoneName.THUMB_META_R)).toBe(true);
      expect(config.rotations.has(BoneName.THUMB_META_L)).toBe(true);
      expect(config.rotations.has(BoneName.INDEX_PROX_R)).toBe(true);
      expect(config.rotations.has(BoneName.INDEX_PROX_L)).toBe(true);
    });

    it('should apply grab pose correctly', () => {
      const pose = HAND_POSES.GRAB;
      applyHandPoseToConfig(config, pose, 'right');

      // Verify grab pose rotation values are applied
      const thumbRotation = config.rotations.get(BoneName.THUMB_META_R);
      expect(thumbRotation).toBeDefined();
      expect(thumbRotation?.x).toBe(pose.thumb_meta[0]);
      expect(thumbRotation?.y).toBe(pose.thumb_meta[1]);
      expect(thumbRotation?.z).toBe(pose.thumb_meta[2]);
    });

    it('should apply open hand pose correctly', () => {
      const pose = HAND_POSES.OPEN_PALM;
      applyHandPoseToConfig(config, pose, 'left');

      // Verify all finger bones are set
      expect(config.rotations.size).toBeGreaterThan(15); // 19 bones per hand
    });

    it('should apply knife hand pose correctly', () => {
      const pose = HAND_POSES.KNIFE_HAND;
      applyHandPoseToConfig(config, pose, 'right');

      // Verify knife hand specific rotations
      const indexRotation = config.rotations.get(BoneName.INDEX_PROX_R);
      expect(indexRotation).toBeDefined();
    });
  });

  describe('applyHandPoseToKeyframe', () => {
    let keyframe: AnimationKeyframe;

    beforeEach(() => {
      keyframe = {
        time: 0,
        easing: 'linear',
        boneRotations: new Map(),
        bonePositions: new Map(),
      };
    });

    it('should apply fist pose to keyframe right hand', () => {
      const pose = HAND_POSES.FIST;
      applyHandPoseToKeyframe(keyframe, pose, 'right');

      // Verify right hand bones are set with THREE.Euler objects
      const thumbRotation = keyframe.boneRotations.get(BoneName.THUMB_META_R);
      expect(thumbRotation).toBeInstanceOf(THREE.Euler);
      expect(thumbRotation?.x).toBe(pose.thumb_meta[0]);
      expect(thumbRotation?.y).toBe(pose.thumb_meta[1]);
      expect(thumbRotation?.z).toBe(pose.thumb_meta[2]);
    });

    it('should apply pose to keyframe left hand', () => {
      const pose = HAND_POSES.GRAB;
      applyHandPoseToKeyframe(keyframe, pose, 'left');

      // Verify left hand bones are set
      expect(keyframe.boneRotations.has(BoneName.THUMB_META_L)).toBe(true);
      expect(keyframe.boneRotations.has(BoneName.INDEX_PROX_L)).toBe(true);
    });

    it('should apply pose to keyframe both hands', () => {
      const pose = HAND_POSES.OPEN_PALM;
      applyHandPoseToKeyframe(keyframe, pose, 'both');

      // Verify both hands have rotations
      expect(keyframe.boneRotations.has(BoneName.THUMB_META_R)).toBe(true);
      expect(keyframe.boneRotations.has(BoneName.THUMB_META_L)).toBe(true);
      expect(keyframe.boneRotations.size).toBeGreaterThan(30); // 19 bones x 2 hands
    });

    it('should create proper THREE.Euler rotations', () => {
      const pose = HAND_POSES.FIST;
      applyHandPoseToKeyframe(keyframe, pose, 'right');

      const rotation = keyframe.boneRotations.get(BoneName.INDEX_PROX_R);
      expect(rotation).toBeInstanceOf(THREE.Euler);
      expect(typeof rotation?.x).toBe('number');
      expect(typeof rotation?.y).toBe('number');
      expect(typeof rotation?.z).toBe('number');
    });

    it('should overwrite existing bone rotations', () => {
      // Set initial rotation
      keyframe.boneRotations.set(
        BoneName.THUMB_META_R,
        new THREE.Euler(1, 1, 1)
      );

      // Apply pose (should overwrite)
      const pose = HAND_POSES.FIST;
      applyHandPoseToKeyframe(keyframe, pose, 'right');

      const rotation = keyframe.boneRotations.get(BoneName.THUMB_META_R);
      expect(rotation?.x).toBe(pose.thumb_meta[0]);
      expect(rotation?.x).not.toBe(1);
    });
  });

  describe('getHandPose', () => {
    it('should return fist pose', () => {
      const pose = getHandPose('FIST');
      expect(pose).toBe(HAND_POSES.FIST);
      expect(pose).toHaveProperty('thumb_meta');
      expect(pose).toHaveProperty('index_prox');
    });

    it('should return open palm pose', () => {
      const pose = getHandPose('OPEN_PALM');
      expect(pose).toBe(HAND_POSES.OPEN_PALM);
    });

    it('should return grab pose', () => {
      const pose = getHandPose('GRAB');
      expect(pose).toBe(HAND_POSES.GRAB);
    });

    it('should return knife hand pose', () => {
      const pose = getHandPose('KNIFE_HAND');
      expect(pose).toBe(HAND_POSES.KNIFE_HAND);
    });

    it('should return spear hand pose', () => {
      const pose = getHandPose('SPEAR_HAND');
      expect(pose).toBe(HAND_POSES.SPEAR_HAND);
    });
  });

  describe('Integration - Multiple poses', () => {
    it('should apply different poses to different hands on same keyframe', () => {
      const keyframe: AnimationKeyframe = {
        time: 0,
        easing: 'linear',
        boneRotations: new Map(),
        bonePositions: new Map(),
      };

      // Left hand: fist, Right hand: open palm
      applyHandPoseToKeyframe(keyframe, HAND_POSES.FIST, 'left');
      applyHandPoseToKeyframe(keyframe, HAND_POSES.OPEN_PALM, 'right');

      // Verify both hands have different poses
      const leftThumb = keyframe.boneRotations.get(BoneName.THUMB_META_L);
      const rightThumb = keyframe.boneRotations.get(BoneName.THUMB_META_R);

      expect(leftThumb).toBeDefined();
      expect(rightThumb).toBeDefined();
      expect(leftThumb?.x).toBe(HAND_POSES.FIST.thumb_meta[0]);
      expect(rightThumb?.x).toBe(HAND_POSES.OPEN_PALM.thumb_meta[0]);
    });

    it('should work with KeyframeConfig fluent API', () => {
      const config = new KeyframeConfig();

      // Apply pose through config
      applyHandPoseToConfig(config, HAND_POSES.FIST, 'both');

      // Add additional rotations
      config.rotate(BoneName.SHOULDER_R, 0, 0, 0.5);

      // Verify both hand pose and shoulder rotation are set
      expect(config.rotations.has(BoneName.THUMB_META_R)).toBe(true);
      expect(config.rotations.has(BoneName.SHOULDER_R)).toBe(true);
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
        applyHandPoseToKeyframe(keyframe, HAND_POSES.FIST, 'right');
      }).not.toThrow();

      expect(keyframe.boneRotations.size).toBeGreaterThan(0);
    });

    it('should handle all hand selection types', () => {
      const selections: HandSelection[] = ['left', 'right', 'both'];

      selections.forEach((selection) => {
        const testKeyframe: AnimationKeyframe = {
          time: 0,
          easing: 'linear',
          boneRotations: new Map(),
          bonePositions: new Map(),
        };

        expect(() => {
          applyHandPoseToKeyframe(testKeyframe, HAND_POSES.FIST, selection);
        }).not.toThrow();

        expect(testKeyframe.boneRotations.size).toBeGreaterThan(0);
      });
    });
  });
});
