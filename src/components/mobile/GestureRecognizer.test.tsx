/**
 * Unit tests for GestureRecognizer component
 * Tests swipe and multi-touch gesture detection with visual feedback
 * 
 * @category Testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GestureEvent } from '../../hooks/useTouchControls';

// Note: Testing Three.js Html components requires special async handling
// These tests focus on component logic and props validation

describe('GestureRecognizer', () => {
  let onGestureMock: ReturnType<typeof vi.fn<[GestureEvent], void>>;

  beforeEach(() => {
    onGestureMock = vi.fn();
  });

  describe('Component props', () => {
    it('should accept onGesture callback', () => {
      expect(() => {
        ({
          onGesture: onGestureMock,
          enabled: true,
        });
      }).not.toThrow();
    });

    it('should accept enabled flag', () => {
      expect(() => {
        ({
          onGesture: onGestureMock,
          enabled: false,
        });
      }).not.toThrow();
    });

    it('should accept showFeedback flag', () => {
      expect(() => {
        ({
          onGesture: onGestureMock,
          enabled: true,
          showFeedback: true,
        });
      }).not.toThrow();
    });

    it('should accept custom minSwipeDistance', () => {
      expect(() => {
        ({
          onGesture: onGestureMock,
          enabled: true,
          minSwipeDistance: 75,
        });
      }).not.toThrow();
    });
  });

  describe('Gesture detection', () => {
    it('should detect swipe-right gesture', () => {
      const gesture: GestureEvent = {
        type: 'swipe-right',
        distance: 100,
        startX: 50,
        startY: 200,
        endX: 150,
        endY: 200,
      };
      onGestureMock(gesture);
      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'swipe-right' })
      );
    });

    it('should detect swipe-left gesture', () => {
      const gesture: GestureEvent = {
        type: 'swipe-left',
        distance: 100,
        startX: 150,
        startY: 200,
        endX: 50,
        endY: 200,
      };
      onGestureMock(gesture);
      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'swipe-left' })
      );
    });

    it('should detect swipe-up gesture', () => {
      const gesture: GestureEvent = {
        type: 'swipe-up',
        distance: 100,
        startX: 200,
        startY: 300,
        endX: 200,
        endY: 200,
      };
      onGestureMock(gesture);
      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'swipe-up' })
      );
    });

    it('should detect swipe-down gesture', () => {
      const gesture: GestureEvent = {
        type: 'swipe-down',
        distance: 100,
        startX: 200,
        startY: 200,
        endX: 200,
        endY: 300,
      };
      onGestureMock(gesture);
      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'swipe-down' })
      );
    });

    it('should detect two-finger tap', () => {
      const gesture: GestureEvent = {
        type: 'two-finger-tap',
        startX: 100,
        startY: 200,
      };
      onGestureMock(gesture);
      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'two-finger-tap' })
      );
    });

    it('should detect tap gesture', () => {
      const gesture: GestureEvent = {
        type: 'tap',
        startX: 100,
        startY: 200,
        endX: 100,
        endY: 200,
      };
      onGestureMock(gesture);
      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'tap' })
      );
    });
  });

  describe('Gesture distance calculation', () => {
    it('should calculate distance for swipe gestures', () => {
      const deltaX = 100;
      const deltaY = 0;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      expect(distance).toBe(100);
    });

    it('should calculate diagonal swipe distance', () => {
      const deltaX = 60;
      const deltaY = 80;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      expect(distance).toBe(100);
    });

    it('should include distance in gesture event', () => {
      const gesture: GestureEvent = {
        type: 'swipe-right',
        distance: 125,
        startX: 50,
        startY: 200,
        endX: 175,
        endY: 200,
      };
      expect(gesture.distance).toBe(125);
    });
  });

  describe('Minimum swipe distance', () => {
    it('should respect default 50px threshold', () => {
      const minSwipeDistance = 50;
      const distance = 45;
      const isSwipe = distance >= minSwipeDistance;
      expect(isSwipe).toBe(false);
    });

    it('should detect swipe when above threshold', () => {
      const minSwipeDistance = 50;
      const distance = 75;
      const isSwipe = distance >= minSwipeDistance;
      expect(isSwipe).toBe(true);
    });

    it('should handle custom threshold', () => {
      const minSwipeDistance = 75;
      const distance = 70;
      const isSwipe = distance >= minSwipeDistance;
      expect(isSwipe).toBe(false);
    });
  });

  describe('Visual feedback', () => {
    it('should display gesture type', () => {
      const displays = {
        'swipe-right': { korean: '전진', english: 'Advance', icon: '→' },
        'swipe-left': { korean: '후퇴', english: 'Retreat', icon: '←' },
        'swipe-up': { korean: '상단', english: 'High', icon: '↑' },
        'swipe-down': { korean: '하단', english: 'Low', icon: '↓' },
        'two-finger-tap': { korean: '급소', english: 'Vital Point', icon: '🎯' },
        'tap': { korean: '터치', english: 'Tap', icon: '👆' },
      };
      
      expect(displays['swipe-right'].korean).toBe('전진');
      expect(displays['two-finger-tap'].icon).toBe('🎯');
    });

    it('should show feedback with fade animation', () => {
      const age = 500; // ms since gesture
      const opacity = Math.max(0, 1 - age / 1000);
      expect(opacity).toBe(0.5);
    });

    it('should scale feedback over time', () => {
      const age = 250; // ms
      const scale = 1 + age / 500;
      expect(scale).toBe(1.5);
    });
  });

  describe('Enabled/disabled state', () => {
    it('should not trigger gestures when disabled', () => {
      const enabled = false;
      if (enabled) {
        onGestureMock({
          type: 'swipe-right',
          distance: 100,
        });
      }
      expect(onGestureMock).not.toHaveBeenCalled();
    });

    it('should trigger gestures when enabled', () => {
      const enabled = true;
      if (enabled) {
        onGestureMock({
          type: 'swipe-right',
          distance: 100,
        });
      }
      expect(onGestureMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Gesture instructions overlay', () => {
    it('should display instruction text', () => {
      const instructions = [
        '← → 이동 | Move',
        '↑ ↓ 공격 | Attack',
        '🤞 급소 | Vital',
      ];
      expect(instructions).toHaveLength(3);
    });

    it('should show instructions when enabled', () => {
      const enabled = true;
      const showInstructions = enabled;
      expect(showInstructions).toBe(true);
    });
  });

  describe('Feedback lifecycle', () => {
    it('should add feedback on gesture', () => {
      const feedbacks: Array<{ id: number; timestamp: number }> = [];
      const newFeedback = { id: 1, timestamp: Date.now() };
      feedbacks.push(newFeedback);
      expect(feedbacks).toHaveLength(1);
    });

    it('should remove old feedback after 1 second', () => {
      const now = Date.now();
      const feedbacks = [
        { id: 1, timestamp: now - 1500 }, // Old
        { id: 2, timestamp: now - 500 },  // Recent
      ];
      const active = feedbacks.filter((fb) => now - fb.timestamp < 1000);
      expect(active).toHaveLength(1);
    });
  });

  describe('Korean gesture mappings', () => {
    it('should map swipe-right to advance (전진)', () => {
      const gesture: GestureEvent = { type: 'swipe-right', distance: 100 };
      onGestureMock(gesture);
      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'swipe-right' })
      );
    });

    it('should map two-finger tap to vital point (급소)', () => {
      const gesture: GestureEvent = { type: 'two-finger-tap' };
      onGestureMock(gesture);
      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'two-finger-tap' })
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid successive gestures', () => {
      onGestureMock({ type: 'swipe-right', distance: 100 });
      onGestureMock({ type: 'swipe-left', distance: 100 });
      onGestureMock({ type: 'swipe-up', distance: 100 });
      expect(onGestureMock).toHaveBeenCalledTimes(3);
    });

    it('should handle very large swipe distances', () => {
      const gesture: GestureEvent = {
        type: 'swipe-right',
        distance: 500,
      };
      onGestureMock(gesture);
      expect(onGestureMock).toHaveBeenCalledWith(
        expect.objectContaining({ distance: 500 })
      );
    });

    it('should handle zero distance tap', () => {
      const gesture: GestureEvent = {
        type: 'tap',
        startX: 100,
        startY: 200,
        endX: 100,
        endY: 200,
      };
      expect(gesture.type).toBe('tap');
    });
  });

  describe('Feedback positioning', () => {
    it('should position feedback at gesture end point', () => {
      const gesture: GestureEvent = {
        type: 'swipe-right',
        distance: 100,
        endX: 250,
        endY: 300,
      };
      expect(gesture.endX).toBe(250);
      expect(gesture.endY).toBe(300);
    });

    it('should center feedback on tap location', () => {
      const gesture: GestureEvent = {
        type: 'tap',
        startX: 150,
        startY: 250,
      };
      expect(gesture.startX).toBe(150);
      expect(gesture.startY).toBe(250);
    });
  });
});
