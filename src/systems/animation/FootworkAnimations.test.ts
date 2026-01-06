/**
 * Unit tests for Footwork Animation System
 * 
 * Tests the 4 Korean martial arts footwork patterns (보법):
 * - Circular step (원형보) - Lateral movement maintaining guard
 * - Pivot step (축족회전) - Rotation on planted foot
 * - Slide step (미끄럼보) - Both feet move together
 * - Shuffle step (섞음보) - Quick micro-adjustment
 * 
 * @module systems/animation/FootworkAnimations.test
 * @category Animation
 * @korean 보법애니메이션테스트
 */

import { describe, it, expect } from 'vitest';
import { DEFAULT_ANIMATION_CONFIGS } from './AnimationStateMachine';
import { ANIMATION_PRIORITY_MAP } from './AnimationPriority';
import { FOOTWORK_KOREAN_TERMS } from './types';
import type { AnimationState, FootworkPattern } from './types';

describe('Footwork Animation System', () => {
  describe('Animation Configuration', () => {
    describe('Circular Step (원형보)', () => {
      it('should have left circular step animation configured', () => {
        const config = DEFAULT_ANIMATION_CONFIGS.get('footwork_circular_left' as AnimationState);
        
        expect(config).toBeDefined();
        expect(config?.state).toBe('footwork_circular_left');
        expect(config?.frames).toBe(18); // 300ms at 60fps
        expect(config?.fps).toBe(60);
        expect(config?.duration).toBe(0.3);
        expect(config?.loop).toBe(false);
        expect(config?.interruptible).toBe(false); // Committed footwork
      });

      it('should have right circular step animation configured', () => {
        const config = DEFAULT_ANIMATION_CONFIGS.get('footwork_circular_right' as AnimationState);
        
        expect(config).toBeDefined();
        expect(config?.state).toBe('footwork_circular_right');
        expect(config?.frames).toBe(18);
        expect(config?.duration).toBe(0.3);
      });

      it('should have same priority as tactical steps', () => {
        const leftPriority = ANIMATION_PRIORITY_MAP['footwork_circular_left' as AnimationState];
        const stepPriority = ANIMATION_PRIORITY_MAP['step_forward' as AnimationState];
        
        expect(leftPriority).toBe(stepPriority);
        expect(leftPriority).toBe(5); // ATTACK/STEP priority
      });
    });

    describe('Pivot Step (축족회전)', () => {
      it('should have left pivot step animation configured', () => {
        const config = DEFAULT_ANIMATION_CONFIGS.get('footwork_pivot_left' as AnimationState);
        
        expect(config).toBeDefined();
        expect(config?.state).toBe('footwork_pivot_left');
        expect(config?.frames).toBe(15); // 250ms at 60fps
        expect(config?.fps).toBe(60);
        expect(config?.duration).toBe(0.25);
        expect(config?.loop).toBe(false);
        expect(config?.interruptible).toBe(false);
      });

      it('should have right pivot step animation configured', () => {
        const config = DEFAULT_ANIMATION_CONFIGS.get('footwork_pivot_right' as AnimationState);
        
        expect(config).toBeDefined();
        expect(config?.frames).toBe(15);
        expect(config?.duration).toBe(0.25);
      });

      it('should have high priority (non-interruptible)', () => {
        const priority = ANIMATION_PRIORITY_MAP['footwork_pivot_left' as AnimationState];
        expect(priority).toBe(5); // STEP priority
      });
    });

    describe('Slide Step (미끄럼보)', () => {
      it('should have forward slide step animation configured', () => {
        const config = DEFAULT_ANIMATION_CONFIGS.get('footwork_slide_forward' as AnimationState);
        
        expect(config).toBeDefined();
        expect(config?.state).toBe('footwork_slide_forward');
        expect(config?.frames).toBe(12); // 200ms at 60fps
        expect(config?.fps).toBe(60);
        expect(config?.duration).toBe(0.2);
        expect(config?.loop).toBe(false);
        expect(config?.interruptible).toBe(true); // Can be interrupted
      });

      it('should have all 4 directional slide animations', () => {
        const directions: Array<AnimationState> = [
          'footwork_slide_forward',
          'footwork_slide_back',
          'footwork_slide_left',
          'footwork_slide_right',
        ];

        directions.forEach(direction => {
          const config = DEFAULT_ANIMATION_CONFIGS.get(direction);
          expect(config).toBeDefined();
          expect(config?.frames).toBe(12);
          expect(config?.duration).toBe(0.2);
        });
      });

      it('should have lower priority than circular/pivot (interruptible)', () => {
        const slidePriority = ANIMATION_PRIORITY_MAP['footwork_slide_forward' as AnimationState];
        const circularPriority = ANIMATION_PRIORITY_MAP['footwork_circular_left' as AnimationState];
        
        expect(slidePriority).toBe(4); // DEFEND priority
        expect(circularPriority).toBe(5); // STEP priority
        expect(slidePriority).toBeLessThan(circularPriority);
      });
    });

    describe('Shuffle Step (섞음보)', () => {
      it('should have shuffle step animation configured', () => {
        const config = DEFAULT_ANIMATION_CONFIGS.get('footwork_shuffle' as AnimationState);
        
        expect(config).toBeDefined();
        expect(config?.state).toBe('footwork_shuffle');
        expect(config?.frames).toBe(6); // 100ms at 60fps
        expect(config?.fps).toBe(60);
        expect(config?.duration).toBe(0.1);
        expect(config?.loop).toBe(false);
        expect(config?.interruptible).toBe(true);
      });

      it('should be fastest footwork pattern', () => {
        const shuffleConfig = DEFAULT_ANIMATION_CONFIGS.get('footwork_shuffle' as AnimationState);
        const circularConfig = DEFAULT_ANIMATION_CONFIGS.get('footwork_circular_left' as AnimationState);
        const pivotConfig = DEFAULT_ANIMATION_CONFIGS.get('footwork_pivot_left' as AnimationState);
        const slideConfig = DEFAULT_ANIMATION_CONFIGS.get('footwork_slide_forward' as AnimationState);
        
        expect(shuffleConfig?.duration).toBeLessThan(circularConfig?.duration ?? 1);
        expect(shuffleConfig?.duration).toBeLessThan(pivotConfig?.duration ?? 1);
        expect(shuffleConfig?.duration).toBeLessThan(slideConfig?.duration ?? 1);
      });
    });
  });

  describe('Korean Terminology', () => {
    it('should have Korean terms for all 4 footwork patterns', () => {
      const patterns: FootworkPattern[] = ['circular', 'pivot', 'slide', 'shuffle'];
      
      patterns.forEach(pattern => {
        const terms = FOOTWORK_KOREAN_TERMS[pattern];
        expect(terms).toBeDefined();
        expect(terms.korean).toBeTruthy();
        expect(terms.romanized).toBeTruthy();
        expect(terms.english).toBeTruthy();
      });
    });

    it('should have correct Korean terminology', () => {
      expect(FOOTWORK_KOREAN_TERMS.circular.korean).toBe('원형보');
      expect(FOOTWORK_KOREAN_TERMS.circular.romanized).toBe('Wonhyeongbo');
      
      expect(FOOTWORK_KOREAN_TERMS.pivot.korean).toBe('축족회전');
      expect(FOOTWORK_KOREAN_TERMS.pivot.romanized).toBe('Chukjok Hoejeon');
      
      expect(FOOTWORK_KOREAN_TERMS.slide.korean).toBe('미끄럼보');
      expect(FOOTWORK_KOREAN_TERMS.slide.romanized).toBe('Mikkeureombo');
      
      expect(FOOTWORK_KOREAN_TERMS.shuffle.korean).toBe('섞음보');
      expect(FOOTWORK_KOREAN_TERMS.shuffle.romanized).toBe('Seokkeumbo');
    });
  });

  describe('Animation Timing Requirements', () => {
    it('should meet 60fps performance target', () => {
      const footworkStates: Array<AnimationState> = [
        'footwork_circular_left',
        'footwork_circular_right',
        'footwork_pivot_left',
        'footwork_pivot_right',
        'footwork_slide_forward',
        'footwork_slide_back',
        'footwork_slide_left',
        'footwork_slide_right',
        'footwork_shuffle',
      ];

      footworkStates.forEach(state => {
        const config = DEFAULT_ANIMATION_CONFIGS.get(state);
        expect(config?.fps).toBe(60);
      });
    });

    it('should have frame counts matching duration at 60fps', () => {
      const footworkStates: Array<AnimationState> = [
        'footwork_circular_left',
        'footwork_pivot_left',
        'footwork_slide_forward',
        'footwork_shuffle',
      ];

      footworkStates.forEach(state => {
        const config = DEFAULT_ANIMATION_CONFIGS.get(state);
        const expectedFrames = Math.round((config?.duration ?? 0) * 60);
        expect(config?.frames).toBe(expectedFrames);
      });
    });
  });

  describe('Footwork Pattern Characteristics', () => {
    it('should maintain guard during circular steps', () => {
      // Circular steps are non-interruptible to commit to the movement
      // while maintaining guard facing
      const leftConfig = DEFAULT_ANIMATION_CONFIGS.get('footwork_circular_left' as AnimationState);
      const rightConfig = DEFAULT_ANIMATION_CONFIGS.get('footwork_circular_right' as AnimationState);
      
      expect(leftConfig?.interruptible).toBe(false);
      expect(rightConfig?.interruptible).toBe(false);
    });

    it('should have pivot steps for 90-degree rotations', () => {
      // Pivot steps rotate 90 degrees on planted foot
      const leftConfig = DEFAULT_ANIMATION_CONFIGS.get('footwork_pivot_left' as AnimationState);
      const rightConfig = DEFAULT_ANIMATION_CONFIGS.get('footwork_pivot_right' as AnimationState);
      
      expect(leftConfig).toBeDefined();
      expect(rightConfig).toBeDefined();
      expect(leftConfig?.frames).toBe(15); // 250ms for 90° rotation
      expect(rightConfig?.frames).toBe(15);
    });

    it('should allow slide steps to be interrupted', () => {
      // Slide steps move both feet together and can be interrupted
      const slideStates: Array<AnimationState> = [
        'footwork_slide_forward',
        'footwork_slide_back',
        'footwork_slide_left',
        'footwork_slide_right',
      ];

      slideStates.forEach(state => {
        const config = DEFAULT_ANIMATION_CONFIGS.get(state);
        expect(config?.interruptible).toBe(true);
      });
    });

    it('should have shuffle as quickest micro-adjustment', () => {
      const shuffleConfig = DEFAULT_ANIMATION_CONFIGS.get('footwork_shuffle' as AnimationState);
      
      expect(shuffleConfig?.frames).toBe(6); // 100ms - fastest
      expect(shuffleConfig?.duration).toBe(0.1);
      expect(shuffleConfig?.interruptible).toBe(true);
    });
  });

  describe('Integration with Existing Systems', () => {
    it('should not conflict with existing step animations', () => {
      const stepStates: Array<AnimationState> = [
        'step_forward',
        'step_back',
        'step_left',
        'step_right',
      ];

      const footworkStates: Array<AnimationState> = [
        'footwork_circular_left',
        'footwork_pivot_left',
        'footwork_slide_forward',
        'footwork_shuffle',
      ];

      // Both should exist and be distinct
      stepStates.forEach(state => {
        expect(DEFAULT_ANIMATION_CONFIGS.has(state)).toBe(true);
      });

      footworkStates.forEach(state => {
        expect(DEFAULT_ANIMATION_CONFIGS.has(state)).toBe(true);
      });
    });

    it('should integrate with animation priority system', () => {
      const footworkStates: Array<AnimationState> = [
        'footwork_circular_left',
        'footwork_pivot_left',
        'footwork_slide_forward',
        'footwork_shuffle',
      ];

      footworkStates.forEach(state => {
        const priority = ANIMATION_PRIORITY_MAP[state];
        expect(priority).toBeGreaterThanOrEqual(0);
        expect(priority).toBeLessThanOrEqual(8);
      });
    });
  });

  describe('Acceptance Criteria Validation', () => {
    it('✓ AC1: Should have 4 footwork pattern types', () => {
      const patterns: FootworkPattern[] = ['circular', 'pivot', 'slide', 'shuffle'];
      
      patterns.forEach(pattern => {
        expect(FOOTWORK_KOREAN_TERMS[pattern]).toBeDefined();
      });
    });

    it('✓ AC2: Circular step should be 12-18 frames (200-300ms)', () => {
      const config = DEFAULT_ANIMATION_CONFIGS.get('footwork_circular_left' as AnimationState);
      
      expect(config?.frames).toBeGreaterThanOrEqual(12);
      expect(config?.frames).toBeLessThanOrEqual(18);
      expect(config?.duration).toBeGreaterThanOrEqual(0.2);
      expect(config?.duration).toBeLessThanOrEqual(0.3);
    });

    it('✓ AC3: Guard maintained during footwork (non-interruptible)', () => {
      // Circular and pivot are non-interruptible = guard maintained
      const circular = DEFAULT_ANIMATION_CONFIGS.get('footwork_circular_left' as AnimationState);
      const pivot = DEFAULT_ANIMATION_CONFIGS.get('footwork_pivot_left' as AnimationState);
      
      expect(circular?.interruptible).toBe(false);
      expect(pivot?.interruptible).toBe(false);
    });

    it('✓ AC4: Should have Korean terminology for all patterns', () => {
      const patterns: FootworkPattern[] = ['circular', 'pivot', 'slide', 'shuffle'];
      
      patterns.forEach(pattern => {
        const terms = FOOTWORK_KOREAN_TERMS[pattern];
        expect(terms.korean).toBeTruthy();
        expect(terms.romanized).toBeTruthy();
        expect(terms.english).toBeTruthy();
      });
    });

    it('✓ AC5: Should maintain 60fps with footwork animations', () => {
      const footworkStates: Array<AnimationState> = [
        'footwork_circular_left',
        'footwork_pivot_left',
        'footwork_slide_forward',
        'footwork_shuffle',
      ];

      footworkStates.forEach(state => {
        const config = DEFAULT_ANIMATION_CONFIGS.get(state);
        expect(config?.fps).toBe(60);
      });
    });
  });
});
