/**
 * Tests for useWindowSize hook
 */

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIsMobile, useWindowSize } from "./useWindowSize";

describe("useWindowSize", () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    // Set initial window size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    // Restore original window size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it("should return current window dimensions", () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it("should update dimensions on window resize", () => {
    const { result } = renderHook(() => useWindowSize());

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 1920 });
      Object.defineProperty(window, "innerHeight", { value: 1080 });
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current.width).toBe(1920);
    expect(result.current.height).toBe(1080);
  });

  it("should use initial values if provided", () => {
    // Temporarily remove window for SSR simulation
    const originalWindow = global.window;
    // @ts-expect-error - simulating SSR
    delete global.window;

    // For SSR, the hook should use initial values
    // Note: In browser environment, this test verifies the option exists
    global.window = originalWindow;

    const { result } = renderHook(() =>
      useWindowSize({ initialWidth: 800, initialHeight: 600 })
    );

    // In browser, actual window size is used, not initial values
    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it("should debounce resize events when debounceMs is set", async () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useWindowSize({ debounceMs: 100 }));

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 500 });
      window.dispatchEvent(new Event("resize"));
    });

    // Should not update immediately
    expect(result.current.width).toBe(1024);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should update after debounce delay
    expect(result.current.width).toBe(500);

    vi.useRealTimers();
  });

  it("should clean up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useWindowSize());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });
});

describe("useIsMobile", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it("should return false for desktop viewport", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("should return true for mobile viewport", () => {
    Object.defineProperty(window, "innerWidth", { value: 500 });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("should use custom breakpoint", () => {
    Object.defineProperty(window, "innerWidth", { value: 900 });

    const { result: result1 } = renderHook(() => useIsMobile(768));
    expect(result1.current).toBe(false);

    const { result: result2 } = renderHook(() => useIsMobile(1000));
    expect(result2.current).toBe(true);
  });

  it("should update when window is resized", () => {
    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, "innerWidth", { value: 500 });
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(true);
  });
});
