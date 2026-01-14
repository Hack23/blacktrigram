/**
 * Unit tests for Complete Footwork Skeletal Animation System
 * 
 * Tests all 9 footwork skeletal animations including newly implemented:
 * - Slide left/right (lateral sliding)
 * - Pivot left/right (90° rotation)
 * - Shuffle (micro-adjustment)
 * 
 * @module systems/animation/FootworkSkeletalAnimations.test
 * @category Animation
 * @korean 보법골격애니메이션테스트
 */

import { describe, it, expect } from 'vitest';
import {
  FOOTWORK_CIRCULAR_LEFT_ANIMATION,
  FOOTWORK_CIRCULAR_RIGHT_ANIMATION,
  FOOTWORK_SLIDE_FORWARD_ANIMATION,
  FOOTWORK_SLIDE_BACK_ANIMATION,
  FOOTWORK_SLIDE_LEFT_ANIMATION,
  FOOTWORK_SLIDE_RIGHT_ANIMATION,
  FOOTWORK_PIVOT_LEFT_ANIMATION,
  FOOTWORK_PIVOT_RIGHT_ANIMATION,
  FOOTWORK_SHUFFLE_ANIMATION,
  FOOTWORK_ANIMATIONS,
  getFootworkAnimation,
} from './FootworkSkeletalAnimations';

describe('Footwork Skeletal Animation System', () => {
  describe('Circular Step Animations', () => {
    it('should have complete circular left animation', () => {
      expect(FOOTWORK_CIRCULAR_LEFT_ANIMATION).toBeDefined();
      expect(FOOTWORK_CIRCULAR_LEFT_ANIMATION.name).toBe('footwork_circular_left');
      expect(FOOTWORK_CIRCULAR_LEFT_ANIMATION.koreanName).toBe('원형보 좌');
      expect(FOOTWORK_CIRCULAR_LEFT_ANIMATION.duration).toBe(0.3);
      expect(FOOTWORK_CIRCULAR_LEFT_ANIMATION.keyframes.length).toBe(4);
    });

    it('should have complete circular right animation', () => {
      expect(FOOTWORK_CIRCULAR_RIGHT_ANIMATION).toBeDefined();
      expect(FOOTWORK_CIRCULAR_RIGHT_ANIMATION.name).toBe('footwork_circular_right');
      expect(FOOTWORK_CIRCULAR_RIGHT_ANIMATION.koreanName).toBe('원형보 우');
      expect(FOOTWORK_CIRCULAR_RIGHT_ANIMATION.duration).toBe(0.3);
      expect(FOOTWORK_CIRCULAR_RIGHT_ANIMATION.keyframes.length).toBe(4);
    });

    it('should have proper easing for circular steps', () => {
      const keyframes = FOOTWORK_CIRCULAR_LEFT_ANIMATION.keyframes;
      expect(keyframes[0].easing).toBe('linear');
      expect(keyframes[1].easing).toBe('ease-out');
      expect(keyframes[2].easing).toBe('linear');
      expect(keyframes[3].easing).toBe('ease-in');
    });

    it('should have 30cm lateral movement in circular steps', () => {
      const finalKeyframe = FOOTWORK_CIRCULAR_LEFT_ANIMATION.keyframes[3];
      const position = finalKeyframe.bonePositions?.get('pelvis');
      expect(position?.x).toBeCloseTo(-0.3, 2); // 30cm left

      const rightFinalKeyframe = FOOTWORK_CIRCULAR_RIGHT_ANIMATION.keyframes[3];
      const rightPosition = rightFinalKeyframe.bonePositions?.get('pelvis');
      expect(rightPosition?.x).toBeCloseTo(0.3, 2); // 30cm right
    });
  });

  describe('Slide Step Animations - Forward/Back', () => {
    it('should have complete slide forward animation', () => {
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION).toBeDefined();
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.name).toBe('footwork_slide_forward');
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.koreanName).toBe('미끄럼보 전');
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.duration).toBe(0.2);
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.keyframes.length).toBe(4);
    });

    it('should have complete slide back animation', () => {
      expect(FOOTWORK_SLIDE_BACK_ANIMATION).toBeDefined();
      expect(FOOTWORK_SLIDE_BACK_ANIMATION.name).toBe('footwork_slide_back');
      expect(FOOTWORK_SLIDE_BACK_ANIMATION.koreanName).toBe('미끄럼보 후');
      expect(FOOTWORK_SLIDE_BACK_ANIMATION.duration).toBe(0.2);
      expect(FOOTWORK_SLIDE_BACK_ANIMATION.keyframes.length).toBe(4);
    });

    it('should have faster duration than tactical steps', () => {
      // Slide steps are 200ms vs tactical steps 300ms
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.duration).toBe(0.2);
      expect(FOOTWORK_SLIDE_BACK_ANIMATION.duration).toBe(0.2);
    });
  });

  describe('Slide Step Animations - Left/Right (NEW)', () => {
    it('should have complete slide left animation', () => {
      expect(FOOTWORK_SLIDE_LEFT_ANIMATION).toBeDefined();
      expect(FOOTWORK_SLIDE_LEFT_ANIMATION.name).toBe('footwork_slide_left');
      expect(FOOTWORK_SLIDE_LEFT_ANIMATION.koreanName).toBe('미끄럼보 좌');
      expect(FOOTWORK_SLIDE_LEFT_ANIMATION.duration).toBe(0.2);
      expect(FOOTWORK_SLIDE_LEFT_ANIMATION.keyframes.length).toBe(4);
    });

    it('should have complete slide right animation', () => {
      expect(FOOTWORK_SLIDE_RIGHT_ANIMATION).toBeDefined();
      expect(FOOTWORK_SLIDE_RIGHT_ANIMATION.name).toBe('footwork_slide_right');
      expect(FOOTWORK_SLIDE_RIGHT_ANIMATION.koreanName).toBe('미끄럼보 우');
      expect(FOOTWORK_SLIDE_RIGHT_ANIMATION.duration).toBe(0.2);
      expect(FOOTWORK_SLIDE_RIGHT_ANIMATION.keyframes.length).toBe(4);
    });

    it('should have 30cm lateral movement in slide steps', () => {
      const leftFinalKeyframe = FOOTWORK_SLIDE_LEFT_ANIMATION.keyframes[3];
      const leftPosition = leftFinalKeyframe.bonePositions?.get('pelvis');
      expect(leftPosition?.x).toBeCloseTo(-0.3, 2); // 30cm left

      const rightFinalKeyframe = FOOTWORK_SLIDE_RIGHT_ANIMATION.keyframes[3];
      const rightPosition = rightFinalKeyframe.bonePositions?.get('pelvis');
      expect(rightPosition?.x).toBeCloseTo(0.3, 2); // 30cm right
    });

    it('should maintain guard during lateral slide', () => {
      const keyframes = FOOTWORK_SLIDE_LEFT_ANIMATION.keyframes;
      keyframes.forEach(keyframe => {
        expect(keyframe.boneRotations?.has('elbow_L')).toBe(true);
        expect(keyframe.boneRotations?.has('elbow_R')).toBe(true);
      });
    });
  });

  describe('Pivot Step Animations (NEW)', () => {
    it('should have complete pivot left animation', () => {
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION).toBeDefined();
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION.name).toBe('footwork_pivot_left');
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION.koreanName).toBe('축족회전 좌');
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION.duration).toBe(0.25);
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION.keyframes.length).toBe(4);
    });

    it('should have complete pivot right animation', () => {
      expect(FOOTWORK_PIVOT_RIGHT_ANIMATION).toBeDefined();
      expect(FOOTWORK_PIVOT_RIGHT_ANIMATION.name).toBe('footwork_pivot_right');
      expect(FOOTWORK_PIVOT_RIGHT_ANIMATION.koreanName).toBe('축족회전 우');
      expect(FOOTWORK_PIVOT_RIGHT_ANIMATION.duration).toBe(0.25);
      expect(FOOTWORK_PIVOT_RIGHT_ANIMATION.keyframes.length).toBe(4);
    });

    it('should have 90-degree rotation in pivot left', () => {
      const finalKeyframe = FOOTWORK_PIVOT_LEFT_ANIMATION.keyframes[3];
      const pelvisRotation = finalKeyframe.boneRotations?.get('pelvis');
      expect(pelvisRotation?.y).toBeCloseTo(Math.PI / 2, 2); // 90° counter-clockwise
    });

    it('should have 90-degree rotation in pivot right', () => {
      const finalKeyframe = FOOTWORK_PIVOT_RIGHT_ANIMATION.keyframes[3];
      const pelvisRotation = finalKeyframe.boneRotations?.get('pelvis');
      expect(pelvisRotation?.y).toBeCloseTo(-Math.PI / 2, 2); // 90° clockwise
    });

    it('should have progressive rotation in keyframes', () => {
      const keyframes = FOOTWORK_PIVOT_LEFT_ANIMATION.keyframes;
      const rotations = keyframes.map(kf => kf.boneRotations?.get('pelvis')?.y || 0);
      
      // Verify progressive rotation: 0° -> 22.5° -> 45° -> 90°
      expect(rotations[0]).toBeCloseTo(0, 2);
      expect(rotations[1]).toBeCloseTo(Math.PI / 8, 2); // 22.5°
      expect(rotations[2]).toBeCloseTo(Math.PI / 4, 2); // 45°
      expect(rotations[3]).toBeCloseTo(Math.PI / 2, 2); // 90°
    });

    it('should maintain guard during pivot rotation', () => {
      const keyframes = FOOTWORK_PIVOT_LEFT_ANIMATION.keyframes;
      keyframes.forEach(keyframe => {
        expect(keyframe.boneRotations?.has('elbow_L')).toBe(true);
        expect(keyframe.boneRotations?.has('elbow_R')).toBe(true);
      });
    });
  });

  describe('Shuffle Step Animation (NEW)', () => {
    it('should have complete shuffle animation', () => {
      expect(FOOTWORK_SHUFFLE_ANIMATION).toBeDefined();
      expect(FOOTWORK_SHUFFLE_ANIMATION.name).toBe('footwork_shuffle');
      expect(FOOTWORK_SHUFFLE_ANIMATION.koreanName).toBe('섞음보');
      expect(FOOTWORK_SHUFFLE_ANIMATION.duration).toBe(0.1);
      expect(FOOTWORK_SHUFFLE_ANIMATION.keyframes.length).toBe(3);
    });

    it('should be fastest footwork animation', () => {
      const allAnimations = [
        FOOTWORK_CIRCULAR_LEFT_ANIMATION,
        FOOTWORK_SLIDE_FORWARD_ANIMATION,
        FOOTWORK_PIVOT_LEFT_ANIMATION,
        FOOTWORK_SHUFFLE_ANIMATION,
      ];

      const shuffleDuration = FOOTWORK_SHUFFLE_ANIMATION.duration;
      allAnimations.forEach(anim => {
        if (anim !== FOOTWORK_SHUFFLE_ANIMATION) {
          expect(shuffleDuration).toBeLessThan(anim.duration);
        }
      });
    });

    it('should have 15cm micro-adjustment distance', () => {
      const finalKeyframe = FOOTWORK_SHUFFLE_ANIMATION.keyframes[2];
      const position = finalKeyframe.bonePositions?.get('pelvis');
      expect(position?.z).toBeCloseTo(-0.15, 2); // 15cm forward (half of standard)
    });

    it('should have minimal keyframes for quick execution', () => {
      expect(FOOTWORK_SHUFFLE_ANIMATION.keyframes.length).toBe(3);
    });
  });

  describe('Animation Map Integration', () => {
    it('should contain all 9 footwork animations', () => {
      expect(FOOTWORK_ANIMATIONS.size).toBe(9);
    });

    it('should have all expected animation keys', () => {
      const expectedKeys = [
        'footwork_circular_left',
        'footwork_circular_right',
        'footwork_slide_forward',
        'footwork_slide_back',
        'footwork_slide_left',
        'footwork_slide_right',
        'footwork_pivot_left',
        'footwork_pivot_right',
        'footwork_shuffle',
      ];

      expectedKeys.forEach(key => {
        expect(FOOTWORK_ANIMATIONS.has(key)).toBe(true);
      });
    });

    it('should retrieve animations via getFootworkAnimation', () => {
      const circularLeft = getFootworkAnimation('footwork_circular_left');
      expect(circularLeft).toBeDefined();
      expect(circularLeft?.name).toBe('footwork_circular_left');

      const pivotRight = getFootworkAnimation('footwork_pivot_right');
      expect(pivotRight).toBeDefined();
      expect(pivotRight?.name).toBe('footwork_pivot_right');

      const shuffle = getFootworkAnimation('footwork_shuffle');
      expect(shuffle).toBeDefined();
      expect(shuffle?.name).toBe('footwork_shuffle');
    });

    it('should return undefined for invalid animation names', () => {
      const invalid = getFootworkAnimation('footwork_invalid');
      expect(invalid).toBeUndefined();
    });
  });

  describe('Animation Characteristics', () => {
    it('should have all animations as non-looping', () => {
      FOOTWORK_ANIMATIONS.forEach(animation => {
        expect(animation.loop).toBe(false);
      });
    });

    it('should have all animations as movement type', () => {
      FOOTWORK_ANIMATIONS.forEach(animation => {
        expect(animation.type).toBe('movement');
      });
    });

    it('should have Korean names for all animations', () => {
      FOOTWORK_ANIMATIONS.forEach(animation => {
        expect(animation.koreanName).toBeTruthy();
        expect(typeof animation.koreanName).toBe('string');
      });
    });

    it('should have minimum 3 keyframes per animation', () => {
      FOOTWORK_ANIMATIONS.forEach(animation => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('should maintain guard in all animations', () => {
      FOOTWORK_ANIMATIONS.forEach(animation => {
        animation.keyframes.forEach(keyframe => {
          // Check that guard bones (elbows) are defined
          expect(keyframe.boneRotations?.has('elbow_L')).toBe(true);
          expect(keyframe.boneRotations?.has('elbow_R')).toBe(true);
        });
      });
    });
  });

  describe('Duration Requirements', () => {
    it('should meet frame timing requirements', () => {
      // Circular & slide: 18 frames @ 60fps = 0.3s OR 12 frames @ 60fps = 0.2s
      expect(FOOTWORK_CIRCULAR_LEFT_ANIMATION.duration).toBe(0.3);
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.duration).toBe(0.2);
      
      // Pivot: 15 frames @ 60fps = 0.25s
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION.duration).toBe(0.25);
      
      // Shuffle: 6 frames @ 60fps = 0.1s
      expect(FOOTWORK_SHUFFLE_ANIMATION.duration).toBe(0.1);
    });

    it('should have appropriate duration range (100-300ms)', () => {
      FOOTWORK_ANIMATIONS.forEach(animation => {
        expect(animation.duration).toBeGreaterThanOrEqual(0.1);
        expect(animation.duration).toBeLessThanOrEqual(0.3);
      });
    });
  });

  describe('Acceptance Criteria Validation', () => {
    it('✓ AC1: All 4 footwork pattern types implemented', () => {
      // Circular (2 variants), Pivot (2 variants), Slide (4 variants), Shuffle (1)
      const patterns = {
        circular: ['footwork_circular_left', 'footwork_circular_right'],
        pivot: ['footwork_pivot_left', 'footwork_pivot_right'],
        slide: ['footwork_slide_forward', 'footwork_slide_back', 'footwork_slide_left', 'footwork_slide_right'],
        shuffle: ['footwork_shuffle'],
      };

      Object.values(patterns).flat().forEach(name => {
        expect(FOOTWORK_ANIMATIONS.has(name)).toBe(true);
      });
    });

    it('✓ AC2: Animations have 12-18 frames (except shuffle)', () => {
      // Most animations: 12-18 frames (200-300ms)
      // Shuffle exception: 6 frames (100ms)
      FOOTWORK_ANIMATIONS.forEach((animation, name) => {
        if (name === 'footwork_shuffle') {
          expect(animation.duration).toBe(0.1); // 6 frames
        } else {
          expect(animation.duration).toBeGreaterThanOrEqual(0.2);
          expect(animation.duration).toBeLessThanOrEqual(0.3);
        }
      });
    });

    it('✓ AC3: Guard maintained during all footwork', () => {
      FOOTWORK_ANIMATIONS.forEach(animation => {
        animation.keyframes.forEach(keyframe => {
          expect(keyframe.boneRotations?.has('elbow_L')).toBe(true);
          expect(keyframe.boneRotations?.has('elbow_R')).toBe(true);
        });
      });
    });

    it('✓ AC4: Korean terminology for all patterns', () => {
      const koreanTerms = {
        'footwork_circular_left': '원형보',
        'footwork_pivot_left': '축족회전',
        'footwork_slide_forward': '미끄럼보',
        'footwork_shuffle': '섞음보',
      };

      Object.entries(koreanTerms).forEach(([name, term]) => {
        const animation = getFootworkAnimation(name);
        expect(animation?.koreanName).toContain(term);
      });
    });

    it('✓ AC5: All animations support 60fps target', () => {
      // All animations have durations that work at 60fps
      FOOTWORK_ANIMATIONS.forEach(animation => {
        const frames = animation.duration * 60;
        expect(frames).toBeGreaterThanOrEqual(6);
        expect(frames).toBeLessThanOrEqual(18);
      });
    });
  });
});
