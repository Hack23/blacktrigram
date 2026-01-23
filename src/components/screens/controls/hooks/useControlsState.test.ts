/**
 * Tests for useControlsState - Controls state management hook
 * 
 * Tests keyboard event handling, category switching, tab selection,
 * and proper cleanup of event listeners.
 * 
 * @module components/screens/controls/hooks/__tests__
 */

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useControlsState } from "./useControlsState";

describe("useControlsState", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe("Initialization", () => {
    it("should initialize with empty pressedKeys Set", () => {
      const { result } = renderHook(() => useControlsState());

      expect(result.current.pressedKeys).toBeInstanceOf(Set);
      expect(result.current.pressedKeys.size).toBe(0);
    });

    it("should initialize with keyboard category", () => {
      const { result } = renderHook(() => useControlsState());

      expect(result.current.category).toBe("keyboard");
    });

    it("should initialize with combat tab selected", () => {
      const { result } = renderHook(() => useControlsState());

      expect(result.current.selectedTab).toBe("combat");
    });

    it("should provide setCategory function", () => {
      const { result } = renderHook(() => useControlsState());

      expect(result.current.setCategory).toBeDefined();
      expect(typeof result.current.setCategory).toBe("function");
    });

    it("should provide setSelectedTab function", () => {
      const { result } = renderHook(() => useControlsState());

      expect(result.current.setSelectedTab).toBeDefined();
      expect(typeof result.current.setSelectedTab).toBe("function");
    });
  });

  describe("Keyboard event handling", () => {
    it("should detect keydown events and add to pressedKeys", () => {
      const { result } = renderHook(() => useControlsState());

      // Simulate keydown event
      act(() => {
        const event = new KeyboardEvent("keydown", { code: "Space" });
        window.dispatchEvent(event);
      });

      expect(result.current.pressedKeys.has("Space")).toBe(true);
      expect(result.current.pressedKeys.size).toBe(1);
    });

    it("should detect keyup events and remove from pressedKeys", () => {
      const { result } = renderHook(() => useControlsState());

      // Simulate keydown event
      act(() => {
        const event = new KeyboardEvent("keydown", { code: "Space" });
        window.dispatchEvent(event);
      });

      expect(result.current.pressedKeys.has("Space")).toBe(true);

      // Simulate keyup event
      act(() => {
        const event = new KeyboardEvent("keyup", { code: "Space" });
        window.dispatchEvent(event);
      });

      expect(result.current.pressedKeys.has("Space")).toBe(false);
      expect(result.current.pressedKeys.size).toBe(0);
    });

    it("should handle multiple simultaneous key presses", () => {
      const { result } = renderHook(() => useControlsState());

      // Press multiple keys
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyA" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
      });

      expect(result.current.pressedKeys.has("KeyW")).toBe(true);
      expect(result.current.pressedKeys.has("KeyA")).toBe(true);
      expect(result.current.pressedKeys.has("Space")).toBe(true);
      expect(result.current.pressedKeys.size).toBe(3);
    });

    it("should handle releasing one key while others remain pressed", () => {
      const { result } = renderHook(() => useControlsState());

      // Press multiple keys
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyA" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
      });

      // Release one key
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyA" }));
      });

      expect(result.current.pressedKeys.has("KeyW")).toBe(true);
      expect(result.current.pressedKeys.has("KeyA")).toBe(false);
      expect(result.current.pressedKeys.has("Space")).toBe(true);
      expect(result.current.pressedKeys.size).toBe(2);
    });

    it("should not add duplicate keys when pressed multiple times", () => {
      const { result } = renderHook(() => useControlsState());

      // Press same key multiple times
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
      });

      expect(result.current.pressedKeys.has("Space")).toBe(true);
      expect(result.current.pressedKeys.size).toBe(1);
    });

    it("should handle special keys correctly", () => {
      const { result } = renderHook(() => useControlsState());

      const specialKeys = ["Escape", "ShiftLeft", "ControlLeft", "ArrowUp"];

      act(() => {
        specialKeys.forEach((code) => {
          window.dispatchEvent(new KeyboardEvent("keydown", { code }));
        });
      });

      specialKeys.forEach((code) => {
        expect(result.current.pressedKeys.has(code)).toBe(true);
      });
      expect(result.current.pressedKeys.size).toBe(specialKeys.length);
    });
  });

  describe("Input element filtering", () => {
    it("should ignore keydown events in input elements", () => {
      const { result } = renderHook(() => useControlsState());

      // Create input element
      const input = document.createElement("input");
      document.body.appendChild(input);

      // Simulate keydown on input
      act(() => {
        const event = new KeyboardEvent("keydown", {
          code: "Space",
          bubbles: true,
        });
        Object.defineProperty(event, "target", { value: input });
        window.dispatchEvent(event);
      });

      expect(result.current.pressedKeys.has("Space")).toBe(false);
      expect(result.current.pressedKeys.size).toBe(0);

      document.body.removeChild(input);
    });

    it("should ignore keydown events in textarea elements", () => {
      const { result } = renderHook(() => useControlsState());

      // Create textarea element
      const textarea = document.createElement("textarea");
      document.body.appendChild(textarea);

      // Simulate keydown on textarea
      act(() => {
        const event = new KeyboardEvent("keydown", {
          code: "KeyA",
          bubbles: true,
        });
        Object.defineProperty(event, "target", { value: textarea });
        window.dispatchEvent(event);
      });

      expect(result.current.pressedKeys.has("KeyA")).toBe(false);
      expect(result.current.pressedKeys.size).toBe(0);

      document.body.removeChild(textarea);
    });

    it("should still track keyup events for keys pressed outside inputs", () => {
      const { result } = renderHook(() => useControlsState());

      // Press key on window
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
      });

      expect(result.current.pressedKeys.has("Space")).toBe(true);

      // Create input and release key there (keyup is not filtered)
      const input = document.createElement("input");
      document.body.appendChild(input);

      act(() => {
        const event = new KeyboardEvent("keyup", {
          code: "Space",
          bubbles: true,
        });
        window.dispatchEvent(event);
      });

      expect(result.current.pressedKeys.has("Space")).toBe(false);

      document.body.removeChild(input);
    });

    it("should track keys pressed on non-input elements", () => {
      const { result } = renderHook(() => useControlsState());

      // Create div element
      const div = document.createElement("div");
      document.body.appendChild(div);

      // Simulate keydown on div
      act(() => {
        const event = new KeyboardEvent("keydown", {
          code: "KeyW",
          bubbles: true,
        });
        Object.defineProperty(event, "target", { value: div });
        window.dispatchEvent(event);
      });

      expect(result.current.pressedKeys.has("KeyW")).toBe(true);

      document.body.removeChild(div);
    });
  });

  describe("Category state management", () => {
    it("should update category when setCategory is called", () => {
      const { result } = renderHook(() => useControlsState());

      expect(result.current.category).toBe("keyboard");

      act(() => {
        result.current.setCategory("gamepad");
      });

      expect(result.current.category).toBe("gamepad");
    });

    it("should switch back to keyboard from gamepad", () => {
      const { result } = renderHook(() => useControlsState());

      act(() => {
        result.current.setCategory("gamepad");
      });

      expect(result.current.category).toBe("gamepad");

      act(() => {
        result.current.setCategory("keyboard");
      });

      expect(result.current.category).toBe("keyboard");
    });

    it("should maintain category across multiple switches", () => {
      const { result } = renderHook(() => useControlsState());

      act(() => {
        result.current.setCategory("gamepad");
        result.current.setCategory("keyboard");
        result.current.setCategory("gamepad");
      });

      expect(result.current.category).toBe("gamepad");
    });

    it("should not affect pressed keys when changing category", () => {
      const { result } = renderHook(() => useControlsState());

      // Press some keys
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
      });

      expect(result.current.pressedKeys.has("Space")).toBe(true);

      // Change category
      act(() => {
        result.current.setCategory("gamepad");
      });

      // Keys should still be tracked
      expect(result.current.pressedKeys.has("Space")).toBe(true);
    });
  });

  describe("Tab state management", () => {
    it("should update selectedTab when setSelectedTab is called", () => {
      const { result } = renderHook(() => useControlsState());

      expect(result.current.selectedTab).toBe("combat");

      act(() => {
        result.current.setSelectedTab("movement");
      });

      expect(result.current.selectedTab).toBe("movement");
    });

    it("should switch between all tab options", () => {
      const { result } = renderHook(() => useControlsState());

      act(() => {
        result.current.setSelectedTab("movement");
      });
      expect(result.current.selectedTab).toBe("movement");

      act(() => {
        result.current.setSelectedTab("system");
      });
      expect(result.current.selectedTab).toBe("system");

      act(() => {
        result.current.setSelectedTab("combat");
      });
      expect(result.current.selectedTab).toBe("combat");
    });

    it("should not affect pressed keys when changing tab", () => {
      const { result } = renderHook(() => useControlsState());

      // Press some keys
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
      });

      expect(result.current.pressedKeys.has("KeyW")).toBe(true);

      // Change tab
      act(() => {
        result.current.setSelectedTab("system");
      });

      // Keys should still be tracked
      expect(result.current.pressedKeys.has("KeyW")).toBe(true);
    });

    it("should not affect category when changing tab", () => {
      const { result } = renderHook(() => useControlsState());

      act(() => {
        result.current.setCategory("gamepad");
      });

      expect(result.current.category).toBe("gamepad");

      act(() => {
        result.current.setSelectedTab("movement");
      });

      expect(result.current.category).toBe("gamepad");
    });
  });

  describe("Cleanup on unmount", () => {
    it("should remove event listeners on unmount", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = renderHook(() => useControlsState());

      // Verify listeners were added
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keyup",
        expect.any(Function)
      );

      // Unmount
      unmount();

      // Verify listeners were removed
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "keyup",
        expect.any(Function)
      );
    });

    it("should not track keys after unmount", () => {
      const { result, unmount } = renderHook(() => useControlsState());

      // Verify tracking works before unmount
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
      });

      expect(result.current.pressedKeys.has("Space")).toBe(true);

      // Unmount
      unmount();

      // Try to press key after unmount (should not update)
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
      });

      // Result should remain at last known state
      expect(result.current.pressedKeys.has("Space")).toBe(true);
      expect(result.current.pressedKeys.has("KeyW")).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle rapid key presses", () => {
      const { result } = renderHook(() => useControlsState());

      act(() => {
        for (let i = 0; i < 10; i++) {
          window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
          window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space" }));
        }
      });

      expect(result.current.pressedKeys.has("Space")).toBe(false);
      expect(result.current.pressedKeys.size).toBe(0);
    });

    it("should handle all keys being released", () => {
      const { result } = renderHook(() => useControlsState());

      // Press multiple keys
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyA" }));
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
      });

      expect(result.current.pressedKeys.size).toBe(3);

      // Release all keys
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyW" }));
        window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyA" }));
        window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space" }));
      });

      expect(result.current.pressedKeys.size).toBe(0);
    });

    it("should handle keyup without corresponding keydown", () => {
      const { result } = renderHook(() => useControlsState());

      // Release key that was never pressed
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space" }));
      });

      expect(result.current.pressedKeys.has("Space")).toBe(false);
      expect(result.current.pressedKeys.size).toBe(0);
    });

    it("should preserve immutability of pressedKeys Set", () => {
      const { result, rerender } = renderHook(() => useControlsState());

      const firstSetReference = result.current.pressedKeys;

      // Press a key
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
      });

      rerender();

      // Reference should be different (new Set created)
      expect(result.current.pressedKeys).not.toBe(firstSetReference);
    });

    it("should handle function references being stable", () => {
      const { result, rerender } = renderHook(() => useControlsState());

      const setCategoryRef1 = result.current.setCategory;
      const setSelectedTabRef1 = result.current.setSelectedTab;

      // Trigger re-render by pressing key
      act(() => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
      });

      rerender();

      const setCategoryRef2 = result.current.setCategory;
      const setSelectedTabRef2 = result.current.setSelectedTab;

      // Function references should be stable (same reference)
      expect(setCategoryRef1).toBe(setCategoryRef2);
      expect(setSelectedTabRef1).toBe(setSelectedTabRef2);
    });
  });
});
