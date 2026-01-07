import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useKeyboardControls } from "../useKeyboardControls";

/**
 * Tests for useKeyboardControls hook
 * 
 * Verifies that keyboard event handling logic works correctly,
 * especially for modifier key combinations (Shift+Ctrl, Ctrl, Shift).
 */

describe("useKeyboardControls - Modifier Key Handling", () => {
  let mockOnAction: ReturnType<typeof vi.fn>;
  let mockOnStanceChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnAction = vi.fn();
    mockOnStanceChange = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Shift+Ctrl modifier combinations", () => {
    it("should trigger pivot_left when Shift+Ctrl+A is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      // Simulate Shift+Ctrl+A keyboard event
      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "a",
          shiftKey: true,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      // Verify that pivot_left action is triggered
      expect(mockOnAction).toHaveBeenCalledWith("footwork_pivot_left");
      expect(mockOnAction).toHaveBeenCalledTimes(1);
      
      // Verify queued inputs are updated
      expect(result.current.queuedInputs).toHaveLength(1);
      expect(result.current.queuedInputs[0].action).toContain("Pivot Left");
    });

    it("should trigger pivot_right when Shift+Ctrl+D is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "d",
          shiftKey: true,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      expect(mockOnAction).toHaveBeenCalledWith("footwork_pivot_right");
      expect(mockOnAction).toHaveBeenCalledTimes(1);
      expect(result.current.queuedInputs[0].action).toContain("Pivot Right");
    });

    it("should trigger shuffle when Shift+Ctrl+W is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "w",
          shiftKey: true,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      expect(mockOnAction).toHaveBeenCalledWith("footwork_shuffle");
      expect(mockOnAction).toHaveBeenCalledTimes(1);
      expect(result.current.queuedInputs[0].action).toContain("Shuffle");
    });

    it("should trigger shuffle when Shift+Ctrl+S is pressed", () => {
      const { result } = renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "s",
          shiftKey: true,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      expect(mockOnAction).toHaveBeenCalledWith("footwork_shuffle");
      expect(mockOnAction).toHaveBeenCalledTimes(1);
      expect(result.current.queuedInputs[0].action).toContain("Shuffle");
    });
  });

  describe("Ctrl-only combinations should not trigger when Shift+Ctrl is pressed", () => {
    it("should NOT trigger circular_left when Shift+Ctrl+A is pressed", () => {
      renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "a",
          shiftKey: true,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      // Should trigger pivot_left, NOT circular_left
      expect(mockOnAction).toHaveBeenCalledWith("footwork_pivot_left");
      expect(mockOnAction).not.toHaveBeenCalledWith("footwork_circular_left");
    });

    it("should NOT trigger circular_right when Shift+Ctrl+D is pressed", () => {
      renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "d",
          shiftKey: true,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      expect(mockOnAction).toHaveBeenCalledWith("footwork_pivot_right");
      expect(mockOnAction).not.toHaveBeenCalledWith("footwork_circular_right");
    });

    it("should NOT trigger slide_forward when Shift+Ctrl+W is pressed", () => {
      renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "w",
          shiftKey: true,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      expect(mockOnAction).toHaveBeenCalledWith("footwork_shuffle");
      expect(mockOnAction).not.toHaveBeenCalledWith("footwork_slide_forward");
    });
  });

  describe("Ctrl-only combinations", () => {
    it("should trigger circular_left when Ctrl+A is pressed (without Shift)", () => {
      renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "a",
          shiftKey: false,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      expect(mockOnAction).toHaveBeenCalledWith("footwork_circular_left");
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });

    it("should trigger circular_right when Ctrl+D is pressed (without Shift)", () => {
      renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "d",
          shiftKey: false,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      expect(mockOnAction).toHaveBeenCalledWith("footwork_circular_right");
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });

    it("should trigger slide_forward when Ctrl+W is pressed (without Shift)", () => {
      renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "w",
          shiftKey: false,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      expect(mockOnAction).toHaveBeenCalledWith("footwork_slide_forward");
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });

    it("should trigger slide_back when Ctrl+S is pressed (without Shift)", () => {
      renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "s",
          shiftKey: false,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      expect(mockOnAction).toHaveBeenCalledWith("footwork_slide_back");
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("Modifier check order verification", () => {
    it("should demonstrate the correct check order: Shift+Ctrl before Ctrl alone", () => {
      renderHook(() =>
        useKeyboardControls({
          onAction: mockOnAction,
          onStanceChange: mockOnStanceChange,
          enabled: true,
        })
      );

      // First, test Shift+Ctrl combination
      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "a",
          shiftKey: true,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      expect(mockOnAction).toHaveBeenCalledWith("footwork_pivot_left");
      mockOnAction.mockClear();

      // Then test Ctrl-only
      act(() => {
        const event = new KeyboardEvent("keydown", {
          key: "a",
          shiftKey: false,
          ctrlKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      });

      expect(mockOnAction).toHaveBeenCalledWith("footwork_circular_left");
      
      // Verify they trigger different actions
      expect(mockOnAction).not.toHaveBeenCalledWith("footwork_pivot_left");
    });
  });
});

describe("useKeyboardControls - Stance Side Switch", () => {
  let mockOnAction: ReturnType<typeof vi.fn>;
  let mockOnStanceChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnAction = vi.fn();
    mockOnStanceChange = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should trigger stance_side_switch when H key is pressed", () => {
    const { result } = renderHook(() =>
      useKeyboardControls({
        onAction: mockOnAction,
        onStanceChange: mockOnStanceChange,
        enabled: true,
      })
    );

    act(() => {
      const event = new KeyboardEvent("keydown", {
        key: "h",
        bubbles: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockOnAction).toHaveBeenCalledWith("stance_side_switch");
    expect(mockOnAction).toHaveBeenCalledTimes(1);
    expect(result.current.queuedInputs[0].action).toContain("발 바꿈");
  });

  it("should handle uppercase H key correctly", () => {
    renderHook(() =>
      useKeyboardControls({
        onAction: mockOnAction,
        onStanceChange: mockOnStanceChange,
        enabled: true,
      })
    );

    act(() => {
      const event = new KeyboardEvent("keydown", {
        key: "H",
        bubbles: true,
      });
      document.dispatchEvent(event);
    });

    // Key detection should work for uppercase
    expect(mockOnAction).toHaveBeenCalledWith("stance_side_switch");
  });
});

describe("useKeyboardControls - Disabled State", () => {
  it("should not trigger actions when disabled", () => {
    const mockOnAction = vi.fn();
    const mockOnStanceChange = vi.fn();

    renderHook(() =>
      useKeyboardControls({
        onAction: mockOnAction,
        onStanceChange: mockOnStanceChange,
        enabled: false, // Hook disabled
      })
    );

    act(() => {
      const event = new KeyboardEvent("keydown", {
        key: "a",
        shiftKey: true,
        ctrlKey: true,
        bubbles: true,
      });
      document.dispatchEvent(event);
    });

    // Should not trigger any action when disabled
    expect(mockOnAction).not.toHaveBeenCalled();
  });
});

describe("useKeyboardControls - Hints Toggle", () => {
  it("should toggle hints with F1 key", () => {
    const mockOnAction = vi.fn();
    const mockOnStanceChange = vi.fn();

    const { result } = renderHook(() =>
      useKeyboardControls({
        onAction: mockOnAction,
        onStanceChange: mockOnStanceChange,
        enabled: true,
      })
    );

    // Initially hints should be hidden
    expect(result.current.showHints).toBe(false);

    // Press F1
    act(() => {
      const event = new KeyboardEvent("keydown", {
        key: "F1",
        bubbles: true,
      });
      document.dispatchEvent(event);
    });

    // Hints should now be visible
    expect(result.current.showHints).toBe(true);

    // Press F1 again
    act(() => {
      const event = new KeyboardEvent("keydown", {
        key: "F1",
        bubbles: true,
      });
      document.dispatchEvent(event);
    });

    // Hints should be hidden again
    expect(result.current.showHints).toBe(false);
  });
});
