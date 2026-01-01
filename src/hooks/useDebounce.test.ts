/**
 * Tests for useDebounce hook
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should debounce function calls', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));
    const debounced = result.current;

    // Call multiple times rapidly
    act(() => {
      debounced();
      debounced();
      debounced();
    });

    // Should not call immediately
    expect(callback).toHaveBeenCalledTimes(0);

    // Advance time
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should call once after delay
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on subsequent calls', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));
    const debounced = result.current;

    act(() => {
      debounced();
      vi.advanceTimersByTime(50);
      debounced(); // Reset timer
      vi.advanceTimersByTime(50);
    });

    // Should not have called yet (timer was reset)
    expect(callback).toHaveBeenCalledTimes(0);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Should call after full delay from last call
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to callback', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));
    const debounced = result.current;

    act(() => {
      debounced('test', 123);
      vi.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledWith('test', 123);
  });

  it('should use latest arguments when timer expires', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));
    const debounced = result.current;

    act(() => {
      debounced('first');
      debounced('second');
      debounced('third');
      vi.advanceTimersByTime(100);
    });

    // Should call with latest arguments
    expect(callback).toHaveBeenCalledWith('third');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should handle search input scenario', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));
    const debounced = result.current;

    // Simulate user typing
    act(() => {
      debounced('h');
      vi.advanceTimersByTime(50);
      debounced('he');
      vi.advanceTimersByTime(50);
      debounced('hel');
      vi.advanceTimersByTime(50);
      debounced('hell');
      vi.advanceTimersByTime(50);
      debounced('hello');
    });

    // Should not have called yet (user still typing)
    expect(callback).toHaveBeenCalledTimes(0);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should call once with final value
    expect(callback).toHaveBeenCalledWith('hello');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
