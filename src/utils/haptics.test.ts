/**
 * Unit tests for haptics utility
 * Tests vibration feedback system and combat haptic patterns
 * 
 * @category Testing
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isHapticSupported,
  triggerHaptic,
  triggerCustomHaptic,
  stopHaptic,
  CombatHaptics,
} from './haptics';

describe('haptics', () => {
  let vibrateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Mock navigator.vibrate
    vibrateSpy = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      writable: true,
      configurable: true,
      value: vibrateSpy,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('isHapticSupported', () => {
    it('should return true when vibrate API is available', () => {
      expect(isHapticSupported()).toBe(true);
    });

    it('should return false when vibrate API is not available', () => {
      // @ts-expect-error Testing missing API
      delete navigator.vibrate;
      expect(isHapticSupported()).toBe(false);
    });
  });

  describe('triggerHaptic', () => {
    it('should trigger light haptic feedback', () => {
      triggerHaptic('light');
      expect(vibrateSpy).toHaveBeenCalledWith([10]);
    });

    it('should trigger medium haptic feedback', () => {
      triggerHaptic('medium');
      expect(vibrateSpy).toHaveBeenCalledWith([50]);
    });

    it('should trigger heavy haptic feedback', () => {
      triggerHaptic('heavy');
      expect(vibrateSpy).toHaveBeenCalledWith([100]);
    });

    it('should not throw when vibrate API is not supported', () => {
      // @ts-expect-error Testing missing API
      delete navigator.vibrate;
      expect(() => triggerHaptic('medium')).not.toThrow();
    });

    it('should not call vibrate when API is not supported', () => {
      // @ts-expect-error Testing missing API
      delete navigator.vibrate;
      triggerHaptic('medium');
      expect(vibrateSpy).not.toHaveBeenCalled();
    });
  });

  describe('triggerCustomHaptic', () => {
    it('should trigger custom haptic pattern', () => {
      const pattern = [30, 20, 30];
      triggerCustomHaptic(pattern);
      expect(vibrateSpy).toHaveBeenCalledWith(pattern);
    });

    it('should handle single value pattern', () => {
      triggerCustomHaptic([200]);
      expect(vibrateSpy).toHaveBeenCalledWith([200]);
    });

    it('should handle complex pattern', () => {
      const pattern = [50, 30, 100, 30, 50];
      triggerCustomHaptic(pattern);
      expect(vibrateSpy).toHaveBeenCalledWith(pattern);
    });

    it('should not throw when vibrate API is not supported', () => {
      // @ts-expect-error Testing missing API
      delete navigator.vibrate;
      expect(() => triggerCustomHaptic([100])).not.toThrow();
    });
  });

  describe('stopHaptic', () => {
    it('should stop ongoing vibration', () => {
      stopHaptic();
      expect(vibrateSpy).toHaveBeenCalledWith(0);
    });

    it('should not throw when vibrate API is not supported', () => {
      // @ts-expect-error Testing missing API
      delete navigator.vibrate;
      expect(() => stopHaptic()).not.toThrow();
    });
  });

  describe('CombatHaptics', () => {
    it('should trigger attack haptic', () => {
      CombatHaptics.attack();
      expect(vibrateSpy).toHaveBeenCalledWith([50]);
    });

    it('should trigger block haptic', () => {
      CombatHaptics.block();
      expect(vibrateSpy).toHaveBeenCalledWith([10]);
    });

    it('should trigger critical hit haptic with pattern', () => {
      CombatHaptics.criticalHit();
      expect(vibrateSpy).toHaveBeenCalledWith([50, 30, 100]);
    });

    it('should trigger vital point strike haptic', () => {
      CombatHaptics.vitalPointStrike();
      expect(vibrateSpy).toHaveBeenCalledWith([100]);
    });

    it('should trigger stance change haptic', () => {
      CombatHaptics.stanceChange();
      expect(vibrateSpy).toHaveBeenCalledWith([10]);
    });

    it('should trigger combo increment haptic', () => {
      CombatHaptics.comboIncrement();
      expect(vibrateSpy).toHaveBeenCalledWith([10]);
    });

    it('should trigger knockout haptic with extended pattern', () => {
      CombatHaptics.knockout();
      expect(vibrateSpy).toHaveBeenCalledWith([100, 50, 100, 50, 200]);
    });

    it('should trigger error haptic with pattern', () => {
      CombatHaptics.error();
      expect(vibrateSpy).toHaveBeenCalledWith([20, 10, 20]);
    });

    it('should work with all combat haptics when API not supported', () => {
      // @ts-expect-error Testing missing API
      delete navigator.vibrate;
      
      expect(() => {
        CombatHaptics.attack();
        CombatHaptics.block();
        CombatHaptics.criticalHit();
        CombatHaptics.vitalPointStrike();
        CombatHaptics.stanceChange();
        CombatHaptics.comboIncrement();
        CombatHaptics.knockout();
        CombatHaptics.error();
      }).not.toThrow();
    });
  });

  describe('Haptic feedback sequence', () => {
    it('should handle rapid successive calls', () => {
      triggerHaptic('light');
      triggerHaptic('medium');
      triggerHaptic('heavy');

      expect(vibrateSpy).toHaveBeenCalledTimes(3);
      expect(vibrateSpy).toHaveBeenNthCalledWith(1, [10]);
      expect(vibrateSpy).toHaveBeenNthCalledWith(2, [50]);
      expect(vibrateSpy).toHaveBeenNthCalledWith(3, [100]);
    });

    it('should allow stopping mid-sequence', () => {
      triggerHaptic('heavy');
      stopHaptic();

      expect(vibrateSpy).toHaveBeenCalledTimes(2);
      expect(vibrateSpy).toHaveBeenLastCalledWith(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty custom pattern', () => {
      triggerCustomHaptic([]);
      expect(vibrateSpy).toHaveBeenCalledWith([]);
    });

    it('should handle zero duration in custom pattern', () => {
      triggerCustomHaptic([0, 50, 0]);
      expect(vibrateSpy).toHaveBeenCalledWith([0, 50, 0]);
    });

    it('should handle very long patterns', () => {
      const longPattern = Array(100).fill(10);
      triggerCustomHaptic(longPattern);
      expect(vibrateSpy).toHaveBeenCalledWith(longPattern);
    });
  });
});
