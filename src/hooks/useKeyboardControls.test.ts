/**
 * Unit tests for useKeyboardControls hook
 * 
 * @module hooks/useKeyboardControls.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useKeyboardControls, UseKeyboardControlsProps } from "./useKeyboardControls";

describe("useKeyboardControls", () => {
  let onStanceChange: ReturnType<typeof vi.fn>;
  let onAction: ReturnType<typeof vi.fn>;
  let playSFX: ReturnType<typeof vi.fn>;
  let onToggleHints: ReturnType<typeof vi.fn>;

  const defaultProps: UseKeyboardControlsProps = {
    onStanceChange: vi.fn(),
    onAction: vi.fn(),
    enabled: true,
    currentStance: 0,
    playSFX: vi.fn(),
    onToggleHints: vi.fn(),
  };

  beforeEach(() => {
    onStanceChange = vi.fn();
    onAction = vi.fn();
    playSFX = vi.fn();
    onToggleHints = vi.fn();

    // Mock localStorage
    const localStorageMock: Record<string, string> = {};
    global.localStorage = {
      getItem: vi.fn((key: string) => localStorageMock[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with default state", () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
        })
      );

      expect(result.current.queuedInputs).toEqual([]);
      expect(result.current.showHints).toBe(false);
      expect(result.current.controlMapper).toBeDefined();
    });

    it("should have a toggleHints function", () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
        })
      );

      expect(typeof result.current.toggleHints).toBe("function");
    });
  });

  describe("Stance Changes", () => {
    it("should detect stance change from 1-8 keys", () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
          playSFX,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", { key: "3" });
        window.dispatchEvent(event);
      });

      expect(onStanceChange).toHaveBeenCalledWith(2); // 0-indexed
      expect(playSFX).toHaveBeenCalledWith("stance_change");
    });

    it("should add stance change to input queue", async () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
          currentStance: 0,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", { key: "5" });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.queuedInputs).toHaveLength(1);
      });

      expect(result.current.queuedInputs[0].action).toBe("Stance 5");
      expect(result.current.queuedInputs[0].key).toBe("5");
    });

    it("should prevent switching to the same stance", () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
          currentStance: 2, // Currently on stance 3 (0-indexed)
          playSFX,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", { key: "3" });
        window.dispatchEvent(event);
      });

      expect(onStanceChange).not.toHaveBeenCalled();
      expect(playSFX).toHaveBeenCalledWith("menu_error");
    });

    it("should throttle rapid stance changes", () => {
      vi.useFakeTimers();

      const { result } = renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
          currentStance: 0,
        })
      );

      // First stance change
      act(() => {
        const event1 = new KeyboardEvent("keydown", { key: "2" });
        window.dispatchEvent(event1);
      });

      // Immediate second stance change (should be throttled)
      act(() => {
        const event2 = new KeyboardEvent("keydown", { key: "3" });
        window.dispatchEvent(event2);
      });

      expect(onStanceChange).toHaveBeenCalledTimes(1);

      // Wait for throttle period (133ms)
      act(() => {
        vi.advanceTimersByTime(150);
      });

      // Third stance change (should work)
      act(() => {
        const event3 = new KeyboardEvent("keydown", { key: "4" });
        window.dispatchEvent(event3);
      });

      expect(onStanceChange).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });
  });

  describe("F1 Toggle", () => {
    it("should toggle hints on F1 keypress", () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
          onToggleHints,
          playSFX,
        })
      );

      expect(result.current.showHints).toBe(false);

      act(() => {
        const event = new KeyboardEvent("keydown", { key: "F1" });
        window.dispatchEvent(event);
      });

      expect(result.current.showHints).toBe(true);
      expect(onToggleHints).toHaveBeenCalled();
      expect(playSFX).toHaveBeenCalledWith("menu_select");

      // Toggle again
      act(() => {
        const event = new KeyboardEvent("keydown", { key: "F1" });
        window.dispatchEvent(event);
      });

      expect(result.current.showHints).toBe(false);
    });

    it("should close hints on Escape when hints are visible", () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
        })
      );

      // Open hints first
      act(() => {
        result.current.toggleHints();
      });

      expect(result.current.showHints).toBe(true);

      // Press Escape
      act(() => {
        const event = new KeyboardEvent("keydown", { key: "Escape" });
        window.dispatchEvent(event);
      });

      expect(result.current.showHints).toBe(false);
    });
  });

  describe("Combat Actions", () => {
    it("should handle attack key", () => {
      renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
          playSFX,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", { key: " " }); // Spacebar
        window.dispatchEvent(event);
      });

      expect(onAction).toHaveBeenCalledWith("attack");
      expect(playSFX).toHaveBeenCalledWith("attack_light");
    });

    it("should handle block key", () => {
      renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
          playSFX,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", { key: "b" });
        window.dispatchEvent(event);
      });

      expect(onAction).toHaveBeenCalledWith("block");
      expect(playSFX).toHaveBeenCalledWith("block");
    });

    it("should handle movement keys", () => {
      renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
        })
      );

      const movementKeys = ["w", "a", "s", "d"];
      const expectedActions = [
        "move_up",
        "move_left",
        "move_down",
        "move_right",
      ];

      movementKeys.forEach((key, index) => {
        onAction.mockClear();

        act(() => {
          const event = new KeyboardEvent("keydown", { key });
          window.dispatchEvent(event);
        });

        expect(onAction).toHaveBeenCalledWith(expectedActions[index]);
      });
    });

    it("should handle special keys", () => {
      renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
          playSFX,
        })
      );

      // Precision mode
      act(() => {
        const event = new KeyboardEvent("keydown", { key: "Control" });
        window.dispatchEvent(event);
      });
      expect(onAction).toHaveBeenCalledWith("precision");

      onAction.mockClear();

      // Quick switch
      act(() => {
        const event = new KeyboardEvent("keydown", { key: "q" });
        window.dispatchEvent(event);
      });
      expect(onAction).toHaveBeenCalledWith("quick_switch");
    });
  });

  describe("Input Queue Management", () => {
    it("should add inputs to queue", async () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", { key: "2" });
        window.dispatchEvent(event);
      });

      await waitFor(() => {
        expect(result.current.queuedInputs).toHaveLength(1);
      });
    });

    it("should limit queue to 3 items", async () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
          currentStance: 0,
        })
      );

      // Add 4 inputs
      act(() => {
        [2, 3, 4, 5].forEach((stance) => {
          const event = new KeyboardEvent("keydown", {
            key: stance.toString(),
          });
          window.dispatchEvent(event);
        });
      });

      await waitFor(() => {
        expect(result.current.queuedInputs.length).toBeLessThanOrEqual(3);
      });
    });

    it("should add multiple inputs to queue", async () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
          currentStance: 0,
        })
      );

      // Add first input
      act(() => {
        const event1 = new KeyboardEvent("keydown", { key: "2" });
        window.dispatchEvent(event1);
      });

      await waitFor(() => {
        expect(result.current.queuedInputs.length).toBeGreaterThan(0);
      });

      // Advance current stance and add second input
      act(() => {
        const event2 = new KeyboardEvent("keydown", { key: " " });
        window.dispatchEvent(event2);
      });

      await waitFor(() => {
        expect(result.current.queuedInputs.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("Enabled State", () => {
    it("should not process inputs when disabled", () => {
      renderHook(() =>
        useKeyboardControls({
          ...defaultProps,
          onStanceChange,
          onAction,
          enabled: false,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", { key: "3" });
        window.dispatchEvent(event);
      });

      expect(onStanceChange).not.toHaveBeenCalled();
    });

    it("should resume processing when re-enabled", () => {
      const { rerender } = renderHook(
        (props) => useKeyboardControls(props),
        {
          initialProps: {
            ...defaultProps,
            onStanceChange,
            onAction,
            enabled: false,
          },
        }
      );

      // Try while disabled
      act(() => {
        const event = new KeyboardEvent("keydown", { key: "3" });
        window.dispatchEvent(event);
      });
      expect(onStanceChange).not.toHaveBeenCalled();

      // Re-enable
      rerender({
        ...defaultProps,
        onStanceChange,
        onAction,
        enabled: true,
      });

      // Try while enabled
      act(() => {
        const event = new KeyboardEvent("keydown", { key: "3" });
        window.dispatchEvent(event);
      });
      expect(onStanceChange).toHaveBeenCalledWith(2);
    });
  });
});
