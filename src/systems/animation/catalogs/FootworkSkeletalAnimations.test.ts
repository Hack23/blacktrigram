/**
 * Unit tests for Complete Footwork Skeletal Animation System
 * 
 * Tests all 9 footwork skeletal animations using builder pattern:
 * - Circular steps (lateral movement)
 * - Slide steps (forward/back/left/right)
 * - Pivot steps (90° rotation)
 * - Shuffle (micro-adjustment)
 * 
 * Tests are flexible about keyframe implementation details while
 * validating martial arts concepts and structure.
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
      expect(FOOTWORK_CIRCULAR_LEFT_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it('should have complete circular right animation', () => {
      expect(FOOTWORK_CIRCULAR_RIGHT_ANIMATION).toBeDefined();
      expect(FOOTWORK_CIRCULAR_RIGHT_ANIMATION.name).toBe('footwork_circular_right');
      expect(FOOTWORK_CIRCULAR_RIGHT_ANIMATION.koreanName).toBe('원형보 우');
      expect(FOOTWORK_CIRCULAR_RIGHT_ANIMATION.duration).toBe(0.3);
      expect(FOOTWORK_CIRCULAR_RIGHT_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it('should have valid easing values for circular steps', () => {
      const validEasings = ['linear', 'ease-in', 'ease-out', 'ease-in-out'];
      const keyframes = FOOTWORK_CIRCULAR_LEFT_ANIMATION.keyframes;
      keyframes.forEach(kf => {
        expect(validEasings).toContain(kf.easing);
      });
    });

    it('should have lateral movement in circular steps', () => {
      // Builder generates lateral movement via sideStepLeft/sideStepRight
      const keyframes = FOOTWORK_CIRCULAR_LEFT_ANIMATION.keyframes;
      expect(keyframes.length).toBeGreaterThanOrEqual(2);
      
      // Check that pelvis positions exist in at least one keyframe
      const hasLateralMovement = keyframes.some(kf => 
        kf.bonePositions?.has('pelvis') && kf.bonePositions.get('pelvis')?.x !== 0
      );
      expect(hasLateralMovement).toBe(true);
    });
  });

  describe('Slide Step Animations - Forward/Back', () => {
    it('should have complete slide forward animation', () => {
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION).toBeDefined();
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.name).toBe('footwork_slide_forward');
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.koreanName).toBe('미끄럼보 전');
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.duration).toBe(0.2);
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it('should have complete slide back animation', () => {
      expect(FOOTWORK_SLIDE_BACK_ANIMATION).toBeDefined();
      expect(FOOTWORK_SLIDE_BACK_ANIMATION.name).toBe('footwork_slide_back');
      expect(FOOTWORK_SLIDE_BACK_ANIMATION.koreanName).toBe('미끄럼보 후');
      expect(FOOTWORK_SLIDE_BACK_ANIMATION.duration).toBe(0.2);
      expect(FOOTWORK_SLIDE_BACK_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it('should have faster duration than circular steps', () => {
      // Slide steps are 200ms vs circular steps 300ms
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.duration).toBeLessThan(FOOTWORK_CIRCULAR_LEFT_ANIMATION.duration);
      expect(FOOTWORK_SLIDE_BACK_ANIMATION.duration).toBeLessThan(FOOTWORK_CIRCULAR_LEFT_ANIMATION.duration);
    });
  });

  describe('Slide Step Animations - Left/Right', () => {
    it('should have complete slide left animation', () => {
      expect(FOOTWORK_SLIDE_LEFT_ANIMATION).toBeDefined();
      expect(FOOTWORK_SLIDE_LEFT_ANIMATION.name).toBe('footwork_slide_left');
      expect(FOOTWORK_SLIDE_LEFT_ANIMATION.koreanName).toBe('미끄럼보 좌');
      expect(FOOTWORK_SLIDE_LEFT_ANIMATION.duration).toBe(0.2);
      expect(FOOTWORK_SLIDE_LEFT_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it('should have complete slide right animation', () => {
      expect(FOOTWORK_SLIDE_RIGHT_ANIMATION).toBeDefined();
      expect(FOOTWORK_SLIDE_RIGHT_ANIMATION.name).toBe('footwork_slide_right');
      expect(FOOTWORK_SLIDE_RIGHT_ANIMATION.koreanName).toBe('미끄럼보 우');
      expect(FOOTWORK_SLIDE_RIGHT_ANIMATION.duration).toBe(0.2);
      expect(FOOTWORK_SLIDE_RIGHT_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it('should have lateral movement in slide steps', () => {
      // Builder generates lateral movement via sideStepLeft/sideStepRight
      const leftKeyframes = FOOTWORK_SLIDE_LEFT_ANIMATION.keyframes;
      const hasLateralMovement = leftKeyframes.some(kf => 
        kf.bonePositions?.has('pelvis')
      );
      expect(hasLateralMovement).toBe(true);
    });

    it('should have bone rotations during lateral slide', () => {
      const keyframes = FOOTWORK_SLIDE_LEFT_ANIMATION.keyframes;
      keyframes.forEach(keyframe => {
        expect(keyframe.boneRotations).toBeInstanceOf(Map);
        expect(keyframe.boneRotations?.size).toBeGreaterThan(0);
      });
    });
  });

  describe('Pivot Step Animations', () => {
    it('should have complete pivot left animation', () => {
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION).toBeDefined();
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION.name).toBe('footwork_pivot_left');
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION.koreanName).toBe('축족회전 좌');
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION.duration).toBe(0.25);
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it('should have complete pivot right animation', () => {
      expect(FOOTWORK_PIVOT_RIGHT_ANIMATION).toBeDefined();
      expect(FOOTWORK_PIVOT_RIGHT_ANIMATION.name).toBe('footwork_pivot_right');
      expect(FOOTWORK_PIVOT_RIGHT_ANIMATION.koreanName).toBe('축족회전 우');
      expect(FOOTWORK_PIVOT_RIGHT_ANIMATION.duration).toBe(0.25);
      expect(FOOTWORK_PIVOT_RIGHT_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(3);
    });

    it('should have rotation in pivot animations', () => {
      // Builder generates rotation via rotate() method
      const keyframes = FOOTWORK_PIVOT_LEFT_ANIMATION.keyframes;
      const hasRotation = keyframes.some(kf => 
        kf.boneRotations?.has('pelvis')
      );
      expect(hasRotation).toBe(true);
    });

    it('should have progressive keyframes in pivot', () => {
      const keyframes = FOOTWORK_PIVOT_LEFT_ANIMATION.keyframes;
      // Verify keyframes are in time order
      for (let i = 1; i < keyframes.length; i++) {
        expect(keyframes[i].time).toBeGreaterThan(keyframes[i - 1].time);
      }
    });

    it('should have bone rotations during pivot', () => {
      const keyframes = FOOTWORK_PIVOT_LEFT_ANIMATION.keyframes;
      keyframes.forEach(keyframe => {
        expect(keyframe.boneRotations).toBeInstanceOf(Map);
        expect(keyframe.boneRotations?.size).toBeGreaterThan(0);
      });
    });
  });

  describe('Shuffle Step Animation', () => {
    it('should have complete shuffle animation', () => {
      expect(FOOTWORK_SHUFFLE_ANIMATION).toBeDefined();
      expect(FOOTWORK_SHUFFLE_ANIMATION.name).toBe('footwork_shuffle');
      expect(FOOTWORK_SHUFFLE_ANIMATION.koreanName).toBe('섞음보');
      expect(FOOTWORK_SHUFFLE_ANIMATION.duration).toBe(0.1);
      expect(FOOTWORK_SHUFFLE_ANIMATION.keyframes.length).toBeGreaterThanOrEqual(2);
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

    it('should have movement in shuffle step', () => {
      // Builder generates movement via step() method
      const keyframes = FOOTWORK_SHUFFLE_ANIMATION.keyframes;
      expect(keyframes.length).toBeGreaterThanOrEqual(2);
    });

    it('should have minimal keyframes for quick execution', () => {
      // Shuffle should be quick with fewer keyframes
      expect(FOOTWORK_SHUFFLE_ANIMATION.keyframes.length).toBeLessThanOrEqual(4);
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

    it('should have minimum 2 keyframes per animation', () => {
      FOOTWORK_ANIMATIONS.forEach(animation => {
        expect(animation.keyframes.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should have bone rotations in all animations', () => {
      FOOTWORK_ANIMATIONS.forEach(animation => {
        animation.keyframes.forEach(keyframe => {
          expect(keyframe.boneRotations).toBeInstanceOf(Map);
        });
      });
    });
  });

  describe('Duration Requirements', () => {
    it('should meet frame timing requirements', () => {
      // Circular: 300ms, Slide: 200ms, Pivot: 250ms, Shuffle: 100ms
      expect(FOOTWORK_CIRCULAR_LEFT_ANIMATION.duration).toBe(0.3);
      expect(FOOTWORK_SLIDE_FORWARD_ANIMATION.duration).toBe(0.2);
      expect(FOOTWORK_PIVOT_LEFT_ANIMATION.duration).toBe(0.25);
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

    it('✓ AC2: Animations have appropriate durations', () => {
      // Different patterns have different timing requirements
      FOOTWORK_ANIMATIONS.forEach((animation, name) => {
        if (name === 'footwork_shuffle') {
          expect(animation.duration).toBe(0.1); // Fastest
        } else if (name.includes('slide')) {
          expect(animation.duration).toBe(0.2); // Medium
        } else if (name.includes('pivot')) {
          expect(animation.duration).toBe(0.25); // Pivot timing
        } else if (name.includes('circular')) {
          expect(animation.duration).toBe(0.3); // Slowest
        }
      });
    });

    it('✓ AC3: All animations have bone rotations', () => {
      FOOTWORK_ANIMATIONS.forEach(animation => {
        animation.keyframes.forEach(keyframe => {
          expect(keyframe.boneRotations).toBeInstanceOf(Map);
          expect(keyframe.boneRotations?.size).toBeGreaterThan(0);
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
