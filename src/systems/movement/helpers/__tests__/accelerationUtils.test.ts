import { describe, it, expect } from 'vitest';
import {
  ACCELERATION_CONSTANTS,
  calculateRunThreshold,
  isDirectionConsistent,
  calculateAcceleratedSpeed,
  isSpeedChangeMeaningful,
  isRunningSpeed,
} from '../accelerationUtils';

describe('Acceleration Utilities', () => {
  describe('calculateRunThreshold', () => {
    it('should return 90% of run speed', () => {
      expect(calculateRunThreshold()).toBe(9.0);
    });
  });

  describe('isDirectionConsistent', () => {
    it('should return true for zero last direction', () => {
      expect(isDirectionConsistent({ x: 1, y: 0 }, { x: 0, y: 0 })).toBe(true);
    });

    it('should return true for same direction', () => {
      expect(isDirectionConsistent({ x: 1, y: 0 }, { x: 1, y: 0 })).toBe(true);
    });

    it('should return false for directions > 45 degrees apart', () => {
      expect(isDirectionConsistent({ x: 1, y: 0 }, { x: 0, y: 1 })).toBe(false);
    });

    it('should return false for opposite directions', () => {
      expect(isDirectionConsistent({ x: 1, y: 0 }, { x: -1, y: 0 })).toBe(false);
    });
  });

  describe('calculateAcceleratedSpeed', () => {
    it('should return walk speed at 0 seconds', () => {
      expect(calculateAcceleratedSpeed(0)).toBe(6.0);
    });

    it('should return run speed at TIME_TO_RUN seconds', () => {
      expect(calculateAcceleratedSpeed(1.5)).toBe(10.0);
    });

    it('should interpolate linearly', () => {
      expect(calculateAcceleratedSpeed(0.75)).toBe(8.0);
    });
  });

  describe('isSpeedChangeMeaningful', () => {
    it('should return true for changes >= epsilon', () => {
      expect(isSpeedChangeMeaningful(6.0, 6.06)).toBe(true);
    });

    it('should return false for changes < epsilon', () => {
      expect(isSpeedChangeMeaningful(6.0, 6.01)).toBe(false);
    });
  });

  describe('isRunningSpeed', () => {
    it('should return false for walk speed', () => {
      expect(isRunningSpeed(6.0)).toBe(false);
    });

    it('should return true at threshold', () => {
      expect(isRunningSpeed(9.0)).toBe(true);
    });

    it('should return true for run speed', () => {
      expect(isRunningSpeed(10.0)).toBe(true);
    });
  });
});
