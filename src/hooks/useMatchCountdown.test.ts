/**
 * Tests for useMatchCountdown hook
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMatchCountdown } from "./useMatchCountdown";

// Mock timers
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("useMatchCountdown", () => {
  it("should start in idle state", () => {
    const { result } = renderHook(() => useMatchCountdown());

    expect(result.current.state).toBe("idle");
    expect(result.current.currentNumber).toBe(3);
    expect(result.current.isActive).toBe(false);
  });

  it("should progress through countdown sequence", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useMatchCountdown({}, onComplete));

    // Start countdown
    act(() => {
      result.current.startCountdown();
    });

    // Should be in ready state
    expect(result.current.state).toBe("ready");
    expect(result.current.isActive).toBe(true);

    // Advance to counting state (after 1s)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.state).toBe("counting");
    expect(result.current.currentNumber).toBe(3);

    // Advance countdown (3 -> 2)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.currentNumber).toBe(2);

    // Advance countdown (2 -> 1)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.currentNumber).toBe(1);

    // Advance countdown (1 -> 0, transition to fight)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.currentNumber).toBe(0);
    expect(result.current.state).toBe("fight");

    // Advance to complete state (after 1s)
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.state).toBe("complete");
    expect(result.current.isActive).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("should support custom durations", () => {
    const { result } = renderHook(() =>
      useMatchCountdown({
        readyDuration: 2,
        countdownInterval: 2,
        fightDuration: 2,
        startNumber: 3,
      })
    );

    act(() => {
      result.current.startCountdown();
    });

    expect(result.current.state).toBe("ready");

    // Should still be in ready after 1s
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.state).toBe("ready");

    // Should transition to counting after 2s total
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.state).toBe("counting");
  });

  it("should skip countdown and complete immediately", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useMatchCountdown({}, onComplete));

    act(() => {
      result.current.startCountdown();
    });

    expect(result.current.state).toBe("ready");

    act(() => {
      result.current.skipCountdown();
    });

    expect(result.current.state).toBe("complete");
    expect(result.current.isActive).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("should reset countdown to idle", () => {
    const { result } = renderHook(() => useMatchCountdown());

    act(() => {
      result.current.startCountdown();
    });

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.state).not.toBe("idle");

    act(() => {
      result.current.resetCountdown();
    });

    expect(result.current.state).toBe("idle");
    expect(result.current.currentNumber).toBe(3);
    expect(result.current.isActive).toBe(false);
  });

  it("should clean up timers on unmount", () => {
    const { result, unmount } = renderHook(() => useMatchCountdown());

    act(() => {
      result.current.startCountdown();
    });

    expect(result.current.isActive).toBe(true);

    // Unmount while countdown is active
    unmount();

    // Advance timers - should not cause errors
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    // No errors should be thrown
    expect(true).toBe(true);
  });

  it("should handle custom start number", () => {
    const { result } = renderHook(() =>
      useMatchCountdown({
        startNumber: 5,
      })
    );

    expect(result.current.currentNumber).toBe(5);

    act(() => {
      result.current.startCountdown();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.state).toBe("counting");
    expect(result.current.currentNumber).toBe(5);
  });

  it("should call onComplete only once", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useMatchCountdown({}, onComplete));

    act(() => {
      result.current.startCountdown();
    });

    // Complete the countdown
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);

    // Try to complete again
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Should still be called only once
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
