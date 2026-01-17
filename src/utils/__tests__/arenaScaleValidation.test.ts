/**
 * Unit tests for arena scale validation utility
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { getValidatedArenaScale } from '../arenaScaleValidation';
import {
  MOBILE_ARENA_SCALE,
  TABLET_ARENA_SCALE,
  DESKTOP_ARENA_SCALE,
} from '../../test/arenaScaleConstants';

describe('getValidatedArenaScale', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('Valid Scale Values', () => {
    it('should return desktop scale (1.0) unchanged', () => {
      const result = getValidatedArenaScale(DESKTOP_ARENA_SCALE, 'test');
      expect(result).toBe(DESKTOP_ARENA_SCALE);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should return mobile scale (0.3125) unchanged', () => {
      const result = getValidatedArenaScale(MOBILE_ARENA_SCALE, 'test');
      expect(result).toBe(MOBILE_ARENA_SCALE);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should return tablet scale (0.5) unchanged', () => {
      const result = getValidatedArenaScale(TABLET_ARENA_SCALE, 'test');
      expect(result).toBe(TABLET_ARENA_SCALE);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should accept very small positive scales', () => {
      const result = getValidatedArenaScale(0.001, 'test');
      expect(result).toBe(0.001);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should accept very large positive scales', () => {
      const result = getValidatedArenaScale(100, 'test');
      expect(result).toBe(100);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('Invalid Scale Values', () => {
    it('should return 1.0 for zero scale and warn', () => {
      const result = getValidatedArenaScale(0, 'inputSystem');
      expect(result).toBe(1.0);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[inputSystem] Invalid arena scale: 0, falling back to 1.0'
      );
    });

    it('should return 1.0 for negative scale and warn', () => {
      const result = getValidatedArenaScale(-1.5, 'useAICombat');
      expect(result).toBe(1.0);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[useAICombat] Invalid arena scale: -1.5, falling back to 1.0'
      );
    });

    it('should return 1.0 for NaN and warn', () => {
      const result = getValidatedArenaScale(NaN, 'useCombatActions');
      expect(result).toBe(1.0);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[useCombatActions] Invalid arena scale: NaN, falling back to 1.0'
      );
    });

    it('should return 1.0 for Infinity and warn', () => {
      const result = getValidatedArenaScale(Infinity, 'test');
      expect(result).toBe(1.0);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[test] Invalid arena scale: Infinity, falling back to 1.0'
      );
    });

    it('should return 1.0 for -Infinity and warn', () => {
      const result = getValidatedArenaScale(-Infinity, 'test');
      expect(result).toBe(1.0);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[test] Invalid arena scale: -Infinity, falling back to 1.0'
      );
    });
  });

  describe('Undefined Input', () => {
    it('should return 1.0 for undefined without warning', () => {
      const result = getValidatedArenaScale(undefined, 'test');
      expect(result).toBe(1.0);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('Component Name in Warning', () => {
    it('should include component name in warning message', () => {
      getValidatedArenaScale(0, 'MyComponent');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[MyComponent] Invalid arena scale: 0, falling back to 1.0'
      );
    });

    it('should handle different component names correctly', () => {
      getValidatedArenaScale(NaN, 'AnotherComponent');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[AnotherComponent] Invalid arena scale: NaN, falling back to 1.0'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small negative numbers', () => {
      const result = getValidatedArenaScale(-0.0001, 'test');
      expect(result).toBe(1.0);
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should accept Number.MIN_VALUE (smallest positive)', () => {
      const result = getValidatedArenaScale(Number.MIN_VALUE, 'test');
      expect(result).toBe(Number.MIN_VALUE);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should accept Number.MAX_VALUE', () => {
      const result = getValidatedArenaScale(Number.MAX_VALUE, 'test');
      expect(result).toBe(Number.MAX_VALUE);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
