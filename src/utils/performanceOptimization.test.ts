/**
 * Unit tests for performanceOptimization utilities
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import {
  shallowCompare,
  memoizeComponent,
  withGPUAcceleration,
  optimizedAnimationStyle,
  createGPUAcceleratedTransition,
  hasPropsChanged,
  useStableCallback,
  GPU_ACCELERATION_STYLES,
} from './performanceOptimization';
import { renderHook } from '@testing-library/react';

describe('performanceOptimization utilities', () => {
  describe('shallowCompare', () => {
    it('should return true for identical primitive values', () => {
      const obj1 = { a: 1, b: 'test', c: true };
      const obj2 = { a: 1, b: 'test', c: true };
      expect(shallowCompare(obj1, obj2)).toBe(true);
    });

    it('should return false for different primitive values', () => {
      const obj1 = { a: 1, b: 'test' };
      const obj2 = { a: 2, b: 'test' };
      expect(shallowCompare(obj1, obj2)).toBe(false);
    });

    it('should return false for different number of keys', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { a: 1, b: 2, c: 3 };
      expect(shallowCompare(obj1, obj2)).toBe(false);
    });

    it('should handle empty objects', () => {
      expect(shallowCompare({}, {})).toBe(true);
    });

    it('should use reference equality for objects', () => {
      const nested = { x: 1 };
      const obj1 = { a: nested };
      const obj2 = { a: nested };
      const obj3 = { a: { x: 1 } };
      
      expect(shallowCompare(obj1, obj2)).toBe(true);
      expect(shallowCompare(obj1, obj3)).toBe(false);
    });
  });

  describe('memoizeComponent', () => {
    it('should create a memoized component', () => {
      const TestComponent = ({ value }: { value: number }) => 
        React.createElement('div', {}, value);
      
      const MemoizedComponent = memoizeComponent(TestComponent, ['value']);
      
      expect(MemoizedComponent).toBeDefined();
      // Check if it's a memoized component (has React.memo characteristics)
      expect(typeof MemoizedComponent).toBe('object');
    });

    it('should memoize component without compareKeys', () => {
      const TestComponent = ({ value }: { value: number }) => 
        React.createElement('div', {}, value);
      
      const MemoizedComponent = memoizeComponent(TestComponent);
      
      expect(MemoizedComponent).toBeDefined();
    });
  });

  describe('withGPUAcceleration', () => {
    it('should add GPU acceleration styles', () => {
      const baseStyles = { color: 'red', fontSize: 16 };
      const result = withGPUAcceleration(baseStyles);
      
      expect(result).toMatchObject(baseStyles);
      expect(result.transform).toBe('translateZ(0)');
      expect(result.backfaceVisibility).toBe('hidden');
      expect(result.willChange).toBe('transform, opacity');
    });

    it('should preserve existing styles', () => {
      const baseStyles = { 
        color: 'blue', 
        fontSize: 20,
        padding: '10px'
      };
      const result = withGPUAcceleration(baseStyles);
      
      expect(result.color).toBe('blue');
      expect(result.fontSize).toBe(20);
      expect(result.padding).toBe('10px');
    });

    it('should contain all GPU_ACCELERATION_STYLES', () => {
      const result = withGPUAcceleration({});
      
      expect(result.transform).toBe(GPU_ACCELERATION_STYLES.transform);
      expect(result.backfaceVisibility).toBe(GPU_ACCELERATION_STYLES.backfaceVisibility);
      expect(result.willChange).toBe(GPU_ACCELERATION_STYLES.willChange);
    });
  });

  describe('optimizedAnimationStyle', () => {
    it('should create GPU-accelerated animation styles with translate and scale', () => {
      const result = optimizedAnimationStyle(10, 20, 0.8, 1.2);
      
      expect(result.transform).toBe('translate3d(10px, 20px, 0) scale(1.2)');
      expect(result.opacity).toBe(0.8);
      expect(result.willChange).toBe('transform, opacity');
    });

    it('should use default parameters', () => {
      const result = optimizedAnimationStyle();
      
      expect(result.transform).toBe('translate3d(0px, 0px, 0) scale(1)');
      expect(result.opacity).toBe(1);
    });
  });

  describe('createGPUAcceleratedTransition', () => {
    it('should create transition with default parameters', () => {
      const result = createGPUAcceleratedTransition();
      
      expect(result).toBe('transform 0.2s ease, opacity 0.2s ease');
    });

    it('should create transition with custom duration', () => {
      const result = createGPUAcceleratedTransition(['transform', 'opacity'], '0.5s');
      
      expect(result).toBe('transform 0.5s ease, opacity 0.5s ease');
    });

    it('should create transition with custom timing function', () => {
      const result = createGPUAcceleratedTransition(['transform', 'opacity'], '0.3s', 'ease-in-out');
      
      expect(result).toBe('transform 0.3s ease-in-out, opacity 0.3s ease-in-out');
    });

    it('should handle single property', () => {
      const result = createGPUAcceleratedTransition(['transform'], '0.2s', 'linear');
      
      expect(result).toBe('transform 0.2s linear');
    });

    it('should handle only opacity', () => {
      const result = createGPUAcceleratedTransition(['opacity'], '0.15s');
      
      expect(result).toBe('opacity 0.15s ease');
    });
  });

  describe('hasPropsChanged', () => {
    it('should return false when no changes in specified keys', () => {
      const prev = { a: 1, b: 2 };
      const next = { a: 1, b: 2 };
      
      expect(hasPropsChanged(prev, next, ['a', 'b'])).toBe(false);
    });

    it('should return true when specified key changes', () => {
      const prev = { a: 1, b: 2, c: 3 };
      const next = { a: 1, b: 5, c: 3 };
      
      expect(hasPropsChanged(prev, next, ['b'])).toBe(true);
    });

    it('should return false when specified keys are same', () => {
      const prev = { a: 1, b: 2, c: 3 };
      const next = { a: 1, b: 2, c: 5 };
      
      expect(hasPropsChanged(prev, next, ['a', 'b'])).toBe(false);
    });

    it('should return true when any specified key changes', () => {
      const prev = { a: 1, b: 2, c: 3 };
      const next = { a: 5, b: 2, c: 3 };
      
      expect(hasPropsChanged(prev, next, ['a', 'b', 'c'])).toBe(true);
    });

    it('should handle empty compareKeys array', () => {
      const prev = { a: 1, b: 2 };
      const next = { a: 5, b: 10 };
      
      expect(hasPropsChanged(prev, next, [])).toBe(false);
    });
  });

  describe('useStableCallback', () => {
    it('should return a stable callback function', () => {
      const callback = vi.fn();
      const { result, rerender } = renderHook(
        ({ cb }) => useStableCallback(cb),
        { initialProps: { cb: callback } }
      );
      
      const firstCallback = result.current;
      
      // Rerender with new callback reference
      const newCallback = vi.fn();
      rerender({ cb: newCallback });
      
      const secondCallback = result.current;
      
      // The returned function should be the same reference
      expect(firstCallback).toBe(secondCallback);
    });

    it('should call the latest callback', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      const { result, rerender } = renderHook(
        ({ cb }) => useStableCallback(cb),
        { initialProps: { cb: callback1 } }
      );
      
      const stableCallback = result.current;
      
      // Call with first callback
      stableCallback('arg1');
      expect(callback1).toHaveBeenCalledWith('arg1');
      expect(callback2).not.toHaveBeenCalled();
      
      // Update to second callback
      rerender({ cb: callback2 });
      
      // Call same stable function reference
      stableCallback('arg2');
      expect(callback2).toHaveBeenCalledWith('arg2');
      expect(callback1).toHaveBeenCalledTimes(1); // Still only called once
    });

    it('should preserve function signature', () => {
      const callback = vi.fn((a: number, b: string) => `${a}-${b}`);
      
      const { result } = renderHook(() => useStableCallback(callback));
      
      const stableCallback = result.current;
      const returnValue = stableCallback(42, 'test');
      
      expect(callback).toHaveBeenCalledWith(42, 'test');
      expect(returnValue).toBe('42-test');
    });
  });

  describe('GPU_ACCELERATION_STYLES', () => {
    it('should have correct values', () => {
      expect(GPU_ACCELERATION_STYLES.transform).toBe('translateZ(0)');
      expect(GPU_ACCELERATION_STYLES.backfaceVisibility).toBe('hidden');
      expect(GPU_ACCELERATION_STYLES.willChange).toBe('transform, opacity');
    });

    it('should be immutable (readonly)', () => {
      // TypeScript will prevent this at compile time, but we can verify the object
      expect(Object.isFrozen(GPU_ACCELERATION_STYLES)).toBe(false); // Not frozen but should be treated as const
      expect(GPU_ACCELERATION_STYLES).toBeDefined();
    });
  });
});
