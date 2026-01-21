/**
 * Unit tests for TouchOptimizer
 * Tests RAF-based touch handling and performance optimizations
 *
 * @category Testing
 */

import { beforeEach, describe, expect, it, vi, afterEach, type Mock } from "vitest";
import { renderHook } from '@testing-library/react';
import { 
  useTouchOptimizer, 
  applyOptimizedUpdate, 
  createTransformStyle, 
  createFilterStyle 
} from "./TouchOptimizer";

describe("TouchOptimizer", () => {
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let idleCallbackSpy: Mock;

  beforeEach(() => {
    // Mock requestAnimationFrame
    rafSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    // Mock requestIdleCallback (add it if it doesn't exist)
    idleCallbackSpy = vi.fn((cb) => {
      cb({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
      return 0;
    });
    (window as Window & typeof globalThis).requestIdleCallback = idleCallbackSpy;

    // Mock cancelAnimationFrame
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("useTouchOptimizer", () => {
    it("should initialize with default options", () => {
      const onTouchStart = vi.fn();
      const onTouchMove = vi.fn();
      const onTouchEnd = vi.fn();

      const { result } = renderHook(() =>
        useTouchOptimizer(onTouchStart, onTouchMove, onTouchEnd)
      );

      expect(result.current.rafId).toBeNull();
      expect(result.current.isTouching).toBe(false);
    });

    it("should handle touch start with RAF", () => {
      const onTouchStart = vi.fn();
      const onTouchMove = vi.fn();
      const onTouchEnd = vi.fn();

      renderHook(() =>
        useTouchOptimizer(onTouchStart, onTouchMove, onTouchEnd, {
          useRAF: true,
        })
      );

      // Simulate touch start event
      const touchEvent = new TouchEvent('touchstart', {
        touches: [
          { clientX: 100, clientY: 200 } as Touch,
        ],
      });
      document.dispatchEvent(touchEvent);

      // RAF should be called
      expect(rafSpy).toHaveBeenCalled();
      expect(onTouchStart).toHaveBeenCalled();
    });

    it("should handle touch end with RAF", () => {
      const onTouchStart = vi.fn();
      const onTouchMove = vi.fn();
      const onTouchEnd = vi.fn();

      renderHook(() =>
        useTouchOptimizer(onTouchStart, onTouchMove, onTouchEnd, {
          useRAF: true,
        })
      );

      // First, touch start to set isTouching state
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [
          { clientX: 100, clientY: 200 } as Touch,
        ],
      });
      document.dispatchEvent(touchStartEvent);

      // Execute any pending RAF callbacks
      if (rafSpy.mock.results[0]?.value) {
        const callback = rafSpy.mock.calls[0]?.[0];
        if (callback) callback(0);
      }

      // Clear mocks to test touch end specifically
      rafSpy.mockClear();
      onTouchStart.mockClear();

      // Simulate touch end event
      const touchEndEvent = new TouchEvent('touchend', {
        changedTouches: [
          { clientX: 150, clientY: 250 } as Touch,
        ],
      });
      document.dispatchEvent(touchEndEvent);

      // Execute RAF callback for touch end
      if (rafSpy.mock.results[0]?.value) {
        const callback = rafSpy.mock.calls[0]?.[0];
        if (callback) callback(0);
      }

      expect(rafSpy).toHaveBeenCalled();
      expect(onTouchEnd).toHaveBeenCalled();
    });

    it("should handle touch move with coalescing", () => {
      const onTouchStart = vi.fn();
      const onTouchMove = vi.fn();
      const onTouchEnd = vi.fn();

      renderHook(() =>
        useTouchOptimizer(onTouchStart, onTouchMove, onTouchEnd, {
          enableCoalescing: true,
        })
      );

      // First, touch start to set isTouching state
      const touchStartEvent = new TouchEvent('touchstart', {
        touches: [
          { clientX: 100, clientY: 200 } as Touch,
        ],
      });
      document.dispatchEvent(touchStartEvent);

      // Execute RAF callback for touch start
      if (rafSpy.mock.calls[0]) {
        const callback = rafSpy.mock.calls[0][0];
        if (callback) callback(0);
      }

      // Clear mocks to test touch move specifically
      rafSpy.mockClear();
      onTouchStart.mockClear();

      // Then simulate touch move
      const moveEvent = new TouchEvent('touchmove', {
        touches: [
          { clientX: 120, clientY: 220 } as Touch,
        ],
      });
      document.dispatchEvent(moveEvent);

      // Execute RAF callback for touch move (check after mock was cleared)
      if (rafSpy.mock.calls.length > 0) {
        const callback = rafSpy.mock.calls[0][0];
        if (callback) callback(0);
      }

      expect(onTouchMove).toHaveBeenCalled();
    });

    it("should use passive listeners when specified", () => {
      const onTouchStart = vi.fn();
      const onTouchMove = vi.fn();
      const onTouchEnd = vi.fn();
      
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      renderHook(() =>
        useTouchOptimizer(onTouchStart, onTouchMove, onTouchEnd, {
          usePassiveListeners: true,
        })
      );

      // Check that passive listeners were added
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function),
        expect.objectContaining({ passive: true })
      );
    });

    it("should cleanup on unmount", () => {
      const onTouchStart = vi.fn();
      const onTouchMove = vi.fn();
      const onTouchEnd = vi.fn();
      
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() =>
        useTouchOptimizer(onTouchStart, onTouchMove, onTouchEnd)
      );

      unmount();

      // Check that listeners were removed
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchmove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchend', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchcancel', expect.any(Function));
    });
  });

  describe("applyOptimizedUpdate", () => {
    it("should apply visual update via RAF", () => {
      const element = document.createElement('div');
      const visualUpdate = vi.fn();
      const stateUpdate = vi.fn();

      applyOptimizedUpdate(element, visualUpdate, stateUpdate);

      expect(rafSpy).toHaveBeenCalled();
      expect(visualUpdate).toHaveBeenCalledWith(element);
      expect(idleCallbackSpy).toHaveBeenCalled();
      expect(stateUpdate).toHaveBeenCalled();
    });

    it("should handle null element gracefully", () => {
      const visualUpdate = vi.fn();
      const stateUpdate = vi.fn();

      applyOptimizedUpdate(null, visualUpdate, stateUpdate);

      expect(visualUpdate).not.toHaveBeenCalled();
      expect(stateUpdate).toHaveBeenCalled();
    });

    it("should fallback to setTimeout if requestIdleCallback not available", () => {
      // Save original requestIdleCallback
      const originalIdleCallback = (window as Window & typeof globalThis).requestIdleCallback;
      
      // Mock out requestIdleCallback to test fallback
      Object.defineProperty(window, 'requestIdleCallback', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const setTimeoutSpy = vi.spyOn(window, 'setTimeout').mockImplementation((cb) => {
        if (typeof cb === 'function') {
          cb();
        }
        return 0 as unknown as NodeJS.Timeout;
      });

      const element = document.createElement('div');
      const visualUpdate = vi.fn();
      const stateUpdate = vi.fn();

      applyOptimizedUpdate(element, visualUpdate, stateUpdate);

      expect(setTimeoutSpy).toHaveBeenCalled();
      expect(stateUpdate).toHaveBeenCalled();

      // Restore requestIdleCallback
      Object.defineProperty(window, 'requestIdleCallback', {
        value: originalIdleCallback,
        writable: true,
        configurable: true,
      });
    });
  });

  describe("createTransformStyle", () => {
    it("should return scale(0.95) when pressed", () => {
      const style = createTransformStyle(true, 0.95);
      expect(style).toBe('scale(0.95)');
    });

    it("should return scale(1) when not pressed", () => {
      const style = createTransformStyle(false);
      expect(style).toBe('scale(1)');
    });

    it("should use custom scale value", () => {
      const style = createTransformStyle(true, 0.9);
      expect(style).toBe('scale(0.9)');
    });
  });

  describe("createFilterStyle", () => {
    it("should return brightness(1.2) when pressed", () => {
      const style = createFilterStyle(true, 1.2);
      expect(style).toBe('brightness(1.2)');
    });

    it("should return brightness(1) when not pressed", () => {
      const style = createFilterStyle(false);
      expect(style).toBe('brightness(1)');
    });

    it("should use custom brightness value", () => {
      const style = createFilterStyle(true, 1.5);
      expect(style).toBe('brightness(1.5)');
    });
  });

  describe("Performance characteristics", () => {
    it("should minimize RAF calls with coalescing", () => {
      const onTouchStart = vi.fn();
      const onTouchMove = vi.fn();
      const onTouchEnd = vi.fn();

      renderHook(() =>
        useTouchOptimizer(onTouchStart, onTouchMove, onTouchEnd, {
          enableCoalescing: true,
          coalescingSampleRate: 3,
        })
      );

      // Start touch
      const startEvent = new TouchEvent('touchstart', {
        touches: [
          { clientX: 100, clientY: 200 } as Touch,
        ],
      });
      document.dispatchEvent(startEvent);

      // Multiple move events (should be coalesced)
      for (let i = 0; i < 10; i++) {
        const moveEvent = new TouchEvent('touchmove', {
          touches: [
            { clientX: 100 + i, clientY: 200 + i } as Touch,
          ],
        });
        document.dispatchEvent(moveEvent);
      }

      // onTouchMove should be called fewer times than events dispatched
      // due to RAF batching
      expect(onTouchMove.mock.calls.length).toBeLessThan(10);
    });

    it("should handle high-frequency touch events", () => {
      const onTouchStart = vi.fn();
      const onTouchMove = vi.fn();
      const onTouchEnd = vi.fn();

      renderHook(() =>
        useTouchOptimizer(onTouchStart, onTouchMove, onTouchEnd)
      );

      // Simulate 100 rapid touch events
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        const event = new TouchEvent('touchmove', {
          touches: [
            { clientX: i, clientY: i } as Touch,
          ],
        });
        document.dispatchEvent(event);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete quickly (< 100ms even with 100 events)
      expect(duration).toBeLessThan(100);
    });
  });

  describe("Touch cancel handling", () => {
    it("should handle touch cancel event", () => {
      const onTouchStart = vi.fn();
      const onTouchMove = vi.fn();
      const onTouchEnd = vi.fn();

      const { result } = renderHook(() =>
        useTouchOptimizer(onTouchStart, onTouchMove, onTouchEnd)
      );

      // Start touch
      const startEvent = new TouchEvent('touchstart', {
        touches: [
          { clientX: 100, clientY: 200 } as Touch,
        ],
      });
      document.dispatchEvent(startEvent);

      // Cancel touch
      const cancelEvent = new TouchEvent('touchcancel');
      document.dispatchEvent(cancelEvent);

      // Touch state should be reset
      expect(result.current.isTouching).toBe(false);
    });
  });
});
