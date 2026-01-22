/**
 * EventManager Tests
 * EventManager 테스트
 *
 * Comprehensive test suite for the EventManager class covering:
 * - Basic add/remove functionality
 * - Automatic passive listener detection
 * - Cleanup functionality
 * - Memory leak prevention
 * - Statistics and monitoring
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createEventManager, EventManager } from "./EventManager";

describe("EventManager", () => {
  let eventManager: EventManager;
  let mockElement: EventTarget;

  beforeEach(() => {
    eventManager = new EventManager();
    // Create a mock element with proper EventTarget interface
    mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  });

  describe("Basic Functionality", () => {
    it("should add event listener to element", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "click", handler);

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "click",
        handler,
        undefined,
      );
    });

    it("should return cleanup function when adding listener", () => {
      const handler = vi.fn();

      const cleanup = eventManager.add(mockElement, "click", handler);

      expect(cleanup).toBeInstanceOf(Function);
    });

    it("should remove listener when cleanup function is called", () => {
      const handler = vi.fn();

      const cleanup = eventManager.add(mockElement, "click", handler);
      cleanup();

      expect(mockElement.removeEventListener).toHaveBeenCalledWith(
        "click",
        handler,
        undefined,
      );
    });

    it("should track multiple listeners for same event", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      eventManager.add(mockElement, "click", handler1);
      eventManager.add(mockElement, "click", handler2);

      const stats = eventManager.getStats();
      expect(stats.totalListeners).toBe(2);
    });

    it("should track listeners for different events", () => {
      const clickHandler = vi.fn();
      const keydownHandler = vi.fn();

      eventManager.add(mockElement, "click", clickHandler);
      eventManager.add(mockElement, "keydown", keydownHandler);

      const stats = eventManager.getStats();
      expect(stats.totalListeners).toBe(2);
      expect(stats.uniqueEventTypes).toBe(2);
    });
  });

  describe("Passive Listener Detection", () => {
    it("should automatically apply passive to scroll events", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "scroll", handler);

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "scroll",
        handler,
        { passive: true },
      );
    });

    it("should automatically apply passive to wheel events", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "wheel", handler);

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "wheel",
        handler,
        { passive: true },
      );
    });

    it("should automatically apply passive to touchstart events", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "touchstart", handler);

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "touchstart",
        handler,
        { passive: true },
      );
    });

    it("should automatically apply passive to touchmove events", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "touchmove", handler);

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "touchmove",
        handler,
        { passive: true },
      );
    });

    it("should automatically apply passive to touchend events", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "touchend", handler);

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "touchend",
        handler,
        { passive: true },
      );
    });

    it("should not apply passive to non-scroll/touch events", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "click", handler);

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "click",
        handler,
        undefined,
      );
    });

    it("should respect explicitly set passive: false", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "scroll", handler, { passive: false });

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "scroll",
        handler,
        { passive: false },
      );
    });

    it("should merge passive with existing options", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "scroll", handler, { capture: true });

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "scroll",
        handler,
        { capture: true, passive: true },
      );
    });

    it("should handle boolean options (capture)", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "scroll", handler, true);

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "scroll",
        handler,
        { capture: true, passive: true },
      );
    });
  });

  describe("Cleanup Functionality", () => {
    it("should remove all listeners on cleanup", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      eventManager.add(mockElement, "click", handler1);
      eventManager.add(mockElement, "keydown", handler2);

      eventManager.cleanup();

      expect(mockElement.removeEventListener).toHaveBeenCalledTimes(2);
      expect(mockElement.removeEventListener).toHaveBeenCalledWith(
        "click",
        handler1,
        undefined,
      );
      expect(mockElement.removeEventListener).toHaveBeenCalledWith(
        "keydown",
        handler2,
        undefined,
      );
    });

    it("should clear internal listener tracking on cleanup", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "click", handler);
      expect(eventManager.getStats().totalListeners).toBe(1);

      eventManager.cleanup();
      expect(eventManager.getStats().totalListeners).toBe(0);
    });

    it("should not throw error if cleanup called multiple times", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "click", handler);

      expect(() => {
        eventManager.cleanup();
        eventManager.cleanup();
      }).not.toThrow();
    });

    it("should handle cleanup errors gracefully", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const handler = vi.fn();

      // Mock removeEventListener to throw error
      const mockElementWithError = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(() => {
          throw new Error("Element removed from DOM");
        }),
        dispatchEvent: vi.fn(),
      };

      eventManager.add(mockElementWithError, "click", handler);

      expect(() => eventManager.cleanup()).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe("Statistics and Monitoring", () => {
    it("should return correct total listener count", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();

      eventManager.add(mockElement, "click", handler1);
      eventManager.add(mockElement, "keydown", handler2);
      eventManager.add(mockElement, "scroll", handler3);

      const stats = eventManager.getStats();
      expect(stats.totalListeners).toBe(3);
    });

    it("should count unique event types", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "click", handler);
      eventManager.add(mockElement, "click", vi.fn());
      eventManager.add(mockElement, "keydown", handler);

      const stats = eventManager.getStats();
      expect(stats.uniqueEventTypes).toBe(2);
    });

    it("should count passive listeners", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "scroll", handler); // Passive
      eventManager.add(mockElement, "touchmove", handler); // Passive
      eventManager.add(mockElement, "click", handler); // Not passive

      const stats = eventManager.getStats();
      expect(stats.passiveListeners).toBe(2);
    });

    it("should provide event type counts", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "click", handler);
      eventManager.add(mockElement, "click", vi.fn());
      eventManager.add(mockElement, "keydown", handler);

      const stats = eventManager.getStats();
      expect(stats.eventTypeCounts).toEqual({
        click: 2,
        keydown: 1,
      });
    });

    it("should report hasActiveListeners correctly", () => {
      expect(eventManager.hasActiveListeners()).toBe(false);

      const handler = vi.fn();
      eventManager.add(mockElement, "click", handler);

      expect(eventManager.hasActiveListeners()).toBe(true);

      eventManager.cleanup();
      expect(eventManager.hasActiveListeners()).toBe(false);
    });
  });

  describe("Memory Leak Prevention", () => {
    it("should allow individual listener removal without affecting others", () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      const cleanup1 = eventManager.add(mockElement, "click", handler1);
      eventManager.add(mockElement, "click", handler2);

      expect(eventManager.getStats().totalListeners).toBe(2);

      cleanup1();

      expect(eventManager.getStats().totalListeners).toBe(1);
      expect(mockElement.removeEventListener).toHaveBeenCalledWith(
        "click",
        handler1,
        undefined,
      );
    });

    it("should not double-remove listeners", () => {
      const handler = vi.fn();

      const cleanup = eventManager.add(mockElement, "click", handler);

      cleanup();
      cleanup(); // Call twice

      // removeEventListener should only be called once
      expect(mockElement.removeEventListener).toHaveBeenCalledTimes(1);
    });

    it("should handle cleanup of already removed element", () => {
      const handler = vi.fn();
      const mockRemovedElement = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(() => {
          throw new Error("Element no longer exists");
        }),
        dispatchEvent: vi.fn(),
      };

      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      eventManager.add(mockRemovedElement, "click", handler);

      expect(() => eventManager.cleanup()).not.toThrow();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe("Real-world Integration Tests", () => {
    it("should work with window object", () => {
      const handler = vi.fn();

      const cleanup = eventManager.add(window, "keydown", handler);

      expect(window.addEventListener).toBeDefined();
      cleanup();
    });

    it("should work with document object", () => {
      const handler = vi.fn();

      const cleanup = eventManager.add(document, "click", handler);

      expect(document.addEventListener).toBeDefined();
      cleanup();
    });

    it("should handle React useEffect pattern", () => {
      // Simulate React useEffect lifecycle
      const handler = vi.fn();

      // Mount
      eventManager.add(mockElement, "click", handler);
      expect(eventManager.getStats().totalListeners).toBe(1);

      // Unmount
      eventManager.cleanup();
      expect(eventManager.getStats().totalListeners).toBe(0);
    });

    it("should handle multiple mount/unmount cycles", () => {
      const handler = vi.fn();

      // First mount
      eventManager.add(mockElement, "click", handler);
      expect(eventManager.getStats().totalListeners).toBe(1);

      // First unmount
      eventManager.cleanup();
      expect(eventManager.getStats().totalListeners).toBe(0);

      // Second mount
      eventManager.add(mockElement, "click", handler);
      expect(eventManager.getStats().totalListeners).toBe(1);

      // Second unmount
      eventManager.cleanup();
      expect(eventManager.getStats().totalListeners).toBe(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle events with hyphens in name", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "custom-event", handler);

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "custom-event",
        handler,
        undefined,
      );
    });

    it("should handle multiple elements with same event", () => {
      const mockElement2 = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };

      const handler = vi.fn();

      eventManager.add(mockElement, "click", handler);
      eventManager.add(mockElement2, "click", handler);

      const stats = eventManager.getStats();
      expect(stats.totalListeners).toBe(2);
    });

    it("should handle options with once: true", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "click", handler, { once: true });

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "click",
        handler,
        { once: true },
      );
    });

    it("should handle options with capture and once", () => {
      const handler = vi.fn();

      eventManager.add(mockElement, "scroll", handler, {
        capture: true,
        once: true,
      });

      expect(mockElement.addEventListener).toHaveBeenCalledWith(
        "scroll",
        handler,
        { capture: true, once: true, passive: true },
      );
    });
  });
});

describe("createEventManager factory function", () => {
  it("should create new EventManager instance", () => {
    const manager1 = createEventManager();
    const manager2 = createEventManager();

    expect(manager1).toBeInstanceOf(EventManager);
    expect(manager2).toBeInstanceOf(EventManager);
    expect(manager1).not.toBe(manager2);
  });
});
