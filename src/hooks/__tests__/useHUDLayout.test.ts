/**
 * Tests for useHUDLayout hook
 */

import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useHUDLayout } from '../useHUDLayout';

describe('useHUDLayout', () => {
  describe('left position', () => {
    it('should calculate desktop layout for training context', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, false, 'left', 'training')
      );

      expect(result.current.hudWidthPercent).toBe(0.14);
      expect(result.current.hudWidth).toBe(Math.round(1920 * 0.14));
      expect(result.current.topOffset).toBe(70);
      expect(result.current.bottomOffset).toBe(130);
      expect(result.current.availableHeight).toBe(1080 - 70 - 130);
      expect(result.current.padding).toBe(15);
      expect(result.current.gap).toBe(18);
    });

    it('should calculate mobile layout for training context', () => {
      const { result } = renderHook(() =>
        useHUDLayout(375, 667, 1.0, true, 'left', 'training')
      );

      expect(result.current.hudWidthPercent).toBe(0.18);
      expect(result.current.hudWidth).toBe(Math.round(375 * 0.18));
      expect(result.current.topOffset).toBe(50);
      expect(result.current.bottomOffset).toBe(110);
      expect(result.current.availableHeight).toBe(667 - 50 - 110);
      expect(result.current.padding).toBe(10);
      expect(result.current.gap).toBe(12);
    });

    it('should calculate desktop layout for combat context', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, false, 'left', 'combat')
      );

      expect(result.current.hudWidthPercent).toBe(0.14);
      expect(result.current.topOffset).toBe(70);
      expect(result.current.bottomOffset).toBe(120);
      expect(result.current.availableHeight).toBe(1080 - 70 - 120);
    });

    it('should scale dimensions with positionScale', () => {
      const { result } = renderHook(() =>
        useHUDLayout(3840, 2160, 1.5, false, 'left', 'training')
      );

      expect(result.current.topOffset).toBe(70 * 1.5);
      expect(result.current.bottomOffset).toBe(130 * 1.5);
      expect(result.current.padding).toBe(15 * 1.5);
      expect(result.current.gap).toBe(18 * 1.5);
    });
  });

  describe('right position', () => {
    it('should calculate same dimensions as left', () => {
      const leftResult = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, false, 'left', 'training')
      ).result;

      const rightResult = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, false, 'right', 'training')
      ).result;

      expect(leftResult.current.hudWidth).toBe(rightResult.current.hudWidth);
      expect(leftResult.current.availableHeight).toBe(rightResult.current.availableHeight);
    });
  });

  describe('top position', () => {
    it('should calculate full width for top HUD', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, false, 'top', 'training')
      );

      expect(result.current.hudWidthPercent).toBe(1.0);
      expect(result.current.hudWidth).toBe(1920);
      expect(result.current.hudHeight).toBe(70);
    });

    it('should use mobile dimensions on mobile', () => {
      const { result } = renderHook(() =>
        useHUDLayout(375, 667, 1.0, true, 'top', 'training')
      );

      expect(result.current.hudHeight).toBe(50);
    });
  });

  describe('bottom position', () => {
    it('should calculate full width for bottom HUD', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, false, 'bottom', 'training')
      );

      expect(result.current.hudWidthPercent).toBe(1.0);
      expect(result.current.hudWidth).toBe(1920);
      expect(result.current.hudHeight).toBe(130);
    });

    it('should use combat dimensions in combat context', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, false, 'bottom', 'combat')
      );

      expect(result.current.hudHeight).toBe(120);
    });
  });

  describe('memoization', () => {
    it('should return same result for same inputs', () => {
      const { result, rerender } = renderHook(() =>
        useHUDLayout(1920, 1080, 1.0, false, 'left', 'training')
      );

      const firstResult = result.current;
      rerender();
      const secondResult = result.current;

      expect(firstResult).toBe(secondResult);
    });

    it('should recalculate when inputs change', () => {
      const { result, rerender } = renderHook(
        ({ width }) => useHUDLayout(width, 1080, 1.0, false, 'left', 'training'),
        { initialProps: { width: 1920 } }
      );

      const firstResult = result.current;
      
      rerender({ width: 1280 });
      const secondResult = result.current;

      expect(firstResult.hudWidth).not.toBe(secondResult.hudWidth);
    });
  });

  describe('edge cases', () => {
    it('should handle very small screens', () => {
      const { result } = renderHook(() =>
        useHUDLayout(320, 568, 1.0, true, 'left', 'training')
      );

      expect(result.current.hudWidth).toBeGreaterThan(0);
      expect(result.current.availableHeight).toBeGreaterThan(0);
    });

    it('should handle 4K displays', () => {
      const { result } = renderHook(() =>
        useHUDLayout(3840, 2160, 1.5, false, 'left', 'training')
      );

      expect(result.current.hudWidth).toBeGreaterThan(0);
      expect(result.current.availableHeight).toBeGreaterThan(0);
      expect(result.current.topOffset).toBe(105); // 70 * 1.5
    });

    it('should handle zero positionScale gracefully', () => {
      const { result } = renderHook(() =>
        useHUDLayout(1920, 1080, 0, false, 'left', 'training')
      );

      expect(result.current.topOffset).toBe(0);
      expect(result.current.padding).toBe(0);
    });
  });
});
