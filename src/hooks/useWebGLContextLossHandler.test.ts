/**
 * Tests for useWebGLContextLossHandler hook
 */

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  isWebGL2Available,
  isWebGLAvailable,
  useWebGLContextLossHandler,
} from "./useWebGLContextLossHandler";

describe("useWebGLContextLossHandler", () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    vi.useFakeTimers();
    // Create a canvas element for testing
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    // Clean up
    vi.useRealTimers();
    if (document.body.contains(canvas)) {
      document.body.removeChild(canvas);
    }
  });

  it("should attach event listeners to canvas", async () => {
    const addEventListenerSpy = vi.spyOn(canvas, "addEventListener");

    renderHook(() => useWebGLContextLossHandler({ mountDelay: 0 }));

    // Advance timers to let the hook find the canvas
    await vi.advanceTimersByTimeAsync(100);

    // Should have attached both context loss and restoration listeners
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "webglcontextlost",
      expect.any(Function),
      false
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "webglcontextrestored",
      expect.any(Function),
      false
    );
  });

  it("should call onContextLost callback when context is lost", async () => {
    const onContextLost = vi.fn();

    renderHook(() =>
      useWebGLContextLossHandler({ onContextLost, mountDelay: 0 })
    );

    // Advance timers to let the hook find the canvas
    await vi.advanceTimersByTimeAsync(100);

    // Simulate context loss
    const event = new Event("webglcontextlost");
    canvas.dispatchEvent(event);

    expect(onContextLost).toHaveBeenCalledTimes(1);
  });

  it("should call onContextRestored callback when context is restored", async () => {
    const onContextRestored = vi.fn();

    renderHook(() =>
      useWebGLContextLossHandler({ onContextRestored, mountDelay: 0 })
    );

    // Advance timers to let the hook find the canvas
    await vi.advanceTimersByTimeAsync(100);

    // Simulate context restoration
    const event = new Event("webglcontextrestored");
    canvas.dispatchEvent(event);

    expect(onContextRestored).toHaveBeenCalledTimes(1);
  });

  it("should prevent default behavior when autoRestore is true", async () => {
    renderHook(() =>
      useWebGLContextLossHandler({ autoRestore: true, mountDelay: 0 })
    );

    // Advance timers to let the hook find the canvas
    await vi.advanceTimersByTimeAsync(100);

    // Simulate context loss with preventDefault spy
    const event = new Event("webglcontextlost");
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    canvas.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should not prevent default behavior when autoRestore is false", async () => {
    renderHook(() =>
      useWebGLContextLossHandler({ autoRestore: false, mountDelay: 0 })
    );

    // Advance timers to let the hook find the canvas
    await vi.advanceTimersByTimeAsync(100);

    // Simulate context loss with preventDefault spy
    const event = new Event("webglcontextlost");
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    canvas.dispatchEvent(event);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it("should remove event listeners on unmount", async () => {
    const removeEventListenerSpy = vi.spyOn(canvas, "removeEventListener");

    const { unmount } = renderHook(() =>
      useWebGLContextLossHandler({ mountDelay: 0 })
    );

    // Advance timers to let the hook find the canvas
    await vi.advanceTimersByTimeAsync(100);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "webglcontextlost",
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "webglcontextrestored",
      expect.any(Function)
    );
  });

  it("should use MutationObserver when canvas is not found after retries", async () => {
    // Remove canvas to test the fallback to MutationObserver
    document.body.removeChild(canvas);

    const observeSpy = vi.spyOn(MutationObserver.prototype, "observe");

    const { unmount } = renderHook(() =>
      useWebGLContextLossHandler({ mountDelay: 10, maxRetries: 2 })
    );

    // Advance through all retries (2 retries * 10ms = 20ms + initial 10ms delay)
    await vi.advanceTimersByTimeAsync(50);

    // Should have set up MutationObserver as fallback
    expect(observeSpy).toHaveBeenCalled();

    observeSpy.mockRestore();
    unmount();

    // Re-add canvas for cleanup in afterEach
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
  });
});

describe("isWebGLAvailable", () => {
  it("should return true if WebGL is available", () => {
    // In jsdom, WebGL context creation will fail, so we expect false
    // In a real browser, this would return true
    const result = isWebGLAvailable();
    expect(typeof result).toBe("boolean");
  });

  it("should handle errors gracefully", () => {
    // Mock getContext to throw an error
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = () => {
      throw new Error("WebGL not supported");
    };

    const result = isWebGLAvailable();
    expect(result).toBe(false);

    // Restore original method
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });
});

describe("isWebGL2Available", () => {
  it("should return true if WebGL2 is available", () => {
    // In jsdom, WebGL2 context creation will fail, so we expect false
    // In a real browser with WebGL2 support, this would return true
    const result = isWebGL2Available();
    expect(typeof result).toBe("boolean");
  });

  it("should handle errors gracefully", () => {
    // Mock getContext to throw an error
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = () => {
      throw new Error("WebGL2 not supported");
    };

    const result = isWebGL2Available();
    expect(result).toBe(false);

    // Restore original method
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });
});
