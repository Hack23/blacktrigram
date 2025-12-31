/**
 * Tests for useThrottle hook
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useThrottle } from './useThrottle';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throttle function calls', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottle(callback, 100));
    const throttled = result.current;

    // Call multiple times rapidly
    act(() => {
      throttled();
      throttled();
      throttled();
    });

    // Should only call once immediately
    expect(callback).toHaveBeenCalledTimes(1);

    // Advance time
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should call once more after delay
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments to callback', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottle(callback, 100));
    const throttled = result.current;

    act(() => {
      throttled('test', 123);
    });

    expect(callback).toHaveBeenCalledWith('test', 123);
  });

  it('should respect delay parameter', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottle(callback, 200));
    const throttled = result.current;

    act(() => {
      throttled();
      vi.advanceTimersByTime(100);
      throttled();
    });

    // Should only call once (100ms < 200ms delay)
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should call again after full delay
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should handle rapid calls at 60fps', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useThrottle(callback, 16)); // ~60fps
    const throttled = result.current;

    // Simulate 60fps calls (16.67ms per frame)
    for (let i = 0; i < 10; i++) {
      act(() => {
        throttled();
        vi.advanceTimersByTime(16);
      });
    }

    // Should throttle to approximately one call per 16ms
    expect(callback).toHaveBeenCalledTimes(10);
  });
});
