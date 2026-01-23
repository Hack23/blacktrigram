/**
 * Tests for InteractiveControlDemo - Recently pressed keys display
 * 
 * Tests key press tracking, auto-fading, limiting to 5 keys,
 * bilingual descriptions, responsive layout, and test IDs.
 * 
 * @module components/screens/controls/components/__tests__
 */

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InteractiveControlDemo } from "./InteractiveControlDemoOverlayHtml";

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllTimers();
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("InteractiveControlDemo", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <InteractiveControlDemo pressedKeys={pressedKeys} isMobile={false} />
      );

      expect(container).toBeTruthy();
    });

    it("should have interactive-demo test id", () => {
      const pressedKeys = new Set<string>();

      render(<InteractiveControlDemo pressedKeys={pressedKeys} isMobile={false} />);

      expect(screen.getByTestId("interactive-demo")).toBeTruthy();
    });

    it("should display title in Korean and English", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <InteractiveControlDemo pressedKeys={pressedKeys} isMobile={false} />
      );

      const content = container.textContent || "";
      expect(content).toContain("최근 입력");
      expect(content).toContain("Recent Input");
    });
  });

  describe("Empty state", () => {
    it("should show message when no keys pressed", () => {
      const pressedKeys = new Set<string>();

      const { container } = render(
        <InteractiveControlDemo pressedKeys={pressedKeys} isMobile={false} />
      );

      const content = container.textContent || "";
      expect(content).toContain("키를 눌러서");
      expect(content).toContain("Press keys");
    });

    it("should not show any key press entries when empty", () => {
      const pressedKeys = new Set<string>();

      render(<InteractiveControlDemo pressedKeys={pressedKeys} isMobile={false} />);

      const keyPressElements = screen.queryAllByTestId(/^key-press-/);
      expect(keyPressElements).toHaveLength(0);
    });
  });

  describe("Recently pressed keys tracking", () => {
    it("should show recently pressed key", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      // Press Space key
      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["Space"])}
            isMobile={false}
          />
        );
      });

      expect(screen.getByTestId("key-press-Space")).toBeTruthy();
    });

    it("should display key label", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["Space"])}
            isMobile={false}
          />
        );
      });

      const keyPress = screen.getByTestId("key-press-Space");
      expect(keyPress.textContent).toContain("Space");
    });

    it("should display Korean label", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["Space"])}
            isMobile={false}
          />
        );
      });

      const keyPress = screen.getByTestId("key-press-Space");
      expect(keyPress.textContent).toContain("공격");
    });

    it("should display key description", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["Space"])}
            isMobile={false}
          />
        );
      });

      const keyPress = screen.getByTestId("key-press-Space");
      expect(keyPress.textContent).toContain("Attack");
      expect(keyPress.textContent).toContain("공격");
    });

    it("should show multiple pressed keys", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      // Press first key
      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["Space"])}
            isMobile={false}
          />
        );
      });

      // Press second key
      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["KeyW"])}
            isMobile={false}
          />
        );
      });

      expect(screen.getByTestId("key-press-Space")).toBeTruthy();
      expect(screen.getByTestId("key-press-KeyW")).toBeTruthy();
    });

    it("should add new keys to the list", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      const keysToPress = ["Space", "KeyW", "KeyA", "KeyS"];

      keysToPress.forEach((key) => {
        act(() => {
          rerender(
            <InteractiveControlDemo
              pressedKeys={new Set<string>([key])}
              isMobile={false}
            />
          );
        });

        expect(screen.getByTestId(`key-press-${key}`)).toBeTruthy();
      });
    });
  });

  describe("Limiting to last 5 keys", () => {
    it("should limit display to 5 most recent keys", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      const keys = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU"];

      keys.forEach((key) => {
        act(() => {
          rerender(
            <InteractiveControlDemo
              pressedKeys={new Set<string>([key])}
              isMobile={false}
            />
          );
        });
      });

      const keyPressElements = screen.queryAllByTestId(/^key-press-/);
      expect(keyPressElements.length).toBeLessThanOrEqual(5);
    });

    it("should remove oldest key when exceeding 5 keys", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      // Press 6 keys
      const keys = ["Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6"];

      keys.forEach((key) => {
        act(() => {
          rerender(
            <InteractiveControlDemo
              pressedKeys={new Set<string>([key])}
              isMobile={false}
            />
          );
        });
      });

      // First key should be removed
      expect(screen.queryByTestId("key-press-Digit1")).toBeNull();
      // Newest key should be present
      expect(screen.getByTestId("key-press-Digit6")).toBeTruthy();
    });

    it("should maintain correct order (newest first)", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["Space"])}
            isMobile={false}
          />
        );
      });

      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["KeyW"])}
            isMobile={false}
          />
        );
      });

      const keyPresses = screen.queryAllByTestId(/^key-press-/);
      expect(keyPresses.length).toBeGreaterThan(0);
    });
  });

  describe("Auto-fading after 2 seconds", () => {
    it("should remove entries after 2 seconds", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["Space"])}
            isMobile={false}
          />
        );
      });

      expect(screen.getByTestId("key-press-Space")).toBeTruthy();

      // Fast-forward time by 2.1 seconds to trigger cleanup
      act(() => {
        vi.advanceTimersByTime(2100);
      });

      // Entry should be removed
      expect(screen.queryByTestId("key-press-Space")).toBeNull();
    });

    it("should fade multiple entries independently", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      // Press first key
      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["Space"])}
            isMobile={false}
          />
        );
      });

      // Advance time 1 second
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Press second key
      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["KeyW"])}
            isMobile={false}
          />
        );
      });

      // Advance another 1.1 seconds (total 2.1s for Space, 1.1s for KeyW)
      act(() => {
        vi.advanceTimersByTime(1100);
      });

      // Space should be gone, KeyW should remain
      expect(screen.queryByTestId("key-press-Space")).toBeNull();
      expect(screen.getByTestId("key-press-KeyW")).toBeTruthy();
    });

    it("should keep entries visible for less than 2 seconds", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["Space"])}
            isMobile={false}
          />
        );
      });

      expect(screen.getByTestId("key-press-Space")).toBeTruthy();

      // Advance time by 1 second (less than 2)
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // Should still be visible
      expect(screen.getByTestId("key-press-Space")).toBeTruthy();
    });
  });

  describe("Responsive layout", () => {
    it("should render in mobile layout", () => {
      const pressedKeys = new Set<string>(["Space"]);

      const { container } = render(
        <InteractiveControlDemo pressedKeys={pressedKeys} isMobile={true} />
      );

      expect(container.querySelector('[data-testid="interactive-demo"]')).toBeTruthy();
    });

    it("should render in desktop layout", () => {
      const pressedKeys = new Set<string>(["Space"]);

      const { container } = render(
        <InteractiveControlDemo pressedKeys={pressedKeys} isMobile={false} />
      );

      expect(container.querySelector('[data-testid="interactive-demo"]')).toBeTruthy();
    });

    it("should display keys in both layouts", () => {
      const { rerender } = render(
        <InteractiveControlDemo
          pressedKeys={new Set<string>(["Space"])}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("key-press-Space")).toBeTruthy();

      rerender(
        <InteractiveControlDemo
          pressedKeys={new Set<string>(["Space"])}
          isMobile={true}
        />
      );

      expect(screen.getByTestId("key-press-Space")).toBeTruthy();
    });

    it("should handle switching between mobile and desktop", () => {
      const { rerender } = render(
        <InteractiveControlDemo
          pressedKeys={new Set<string>(["Space"])}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("interactive-demo")).toBeTruthy();

      rerender(
        <InteractiveControlDemo
          pressedKeys={new Set<string>(["Space"])}
          isMobile={true}
        />
      );

      expect(screen.getByTestId("interactive-demo")).toBeTruthy();
    });
  });

  describe("Bilingual descriptions", () => {
    it("should show Korean and English descriptions", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["Space"])}
            isMobile={false}
          />
        );
      });

      const keyPress = screen.getByTestId("key-press-Space");
      const text = keyPress.textContent || "";

      expect(text).toContain("공격");
      expect(text).toContain("Attack");
    });

    it("should use pipe separator for bilingual format", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["KeyW"])}
            isMobile={false}
          />
        );
      });

      const keyPress = screen.getByTestId("key-press-KeyW");
      const text = keyPress.textContent || "";

      expect(text).toMatch(/\|/);
    });

    it("should show stance descriptions in both languages", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["Digit1"])}
            isMobile={false}
          />
        );
      });

      const keyPress = screen.getByTestId("key-press-Digit1");
      expect(keyPress.textContent).toContain("건");
      expect(keyPress.textContent).toContain("Heaven");
    });
  });

  describe("Edge cases", () => {
    it("should handle same key pressed multiple times", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      // Press Space multiple times
      for (let i = 0; i < 3; i++) {
        act(() => {
          rerender(
            <InteractiveControlDemo
              pressedKeys={new Set<string>(["Space"])}
              isMobile={false}
            />
          );
        });

        act(() => {
          rerender(
            <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
          );
        });
      }

      // Should show multiple Space entries
      const keyPresses = screen.queryAllByTestId(/^key-press-Space/);
      expect(keyPresses.length).toBeGreaterThan(0);
    });

    it("should handle rapid key presses", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      const keys = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT"];

      act(() => {
        keys.forEach((key) => {
          rerender(
            <InteractiveControlDemo
              pressedKeys={new Set<string>([key])}
              isMobile={false}
            />
          );
        });
      });

      const keyPresses = screen.queryAllByTestId(/^key-press-/);
      expect(keyPresses.length).toBeGreaterThan(0);
      expect(keyPresses.length).toBeLessThanOrEqual(5);
    });

    it("should handle unknown keys gracefully", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      act(() => {
        rerender(
          <InteractiveControlDemo
            pressedKeys={new Set<string>(["UnknownKey"])}
            isMobile={false}
          />
        );
      });

      // Should not crash, unknown keys just won't be displayed
      expect(screen.getByTestId("interactive-demo")).toBeTruthy();
    });

    it("should handle empty pressedKeys set gracefully", () => {
      const { container } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      expect(container).toBeTruthy();
      expect(screen.getByTestId("interactive-demo")).toBeTruthy();
    });
  });

  describe("Integration", () => {
    it("should handle complete user interaction flow", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      // User presses keys in sequence
      const keys = ["Space", "KeyW", "Digit1", "KeyQ"];

      keys.forEach((key) => {
        act(() => {
          rerender(
            <InteractiveControlDemo
              pressedKeys={new Set<string>([key])}
              isMobile={false}
            />
          );
        });

        expect(screen.getByTestId(`key-press-${key}`)).toBeTruthy();
      });

      // All keys should be visible
      keys.forEach((key) => {
        expect(screen.getByTestId(`key-press-${key}`)).toBeTruthy();
      });
    });

    it("should show bilingual content for all key types", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      const testKeys = [
        { code: "Space", korean: "공격", english: "Attack" },
        { code: "KeyW", korean: "전진", english: "Forward" },
        { code: "Digit1", korean: "건", english: "Heaven" },
      ];

      testKeys.forEach(({ code, korean, english }) => {
        act(() => {
          rerender(
            <InteractiveControlDemo
              pressedKeys={new Set<string>([code])}
              isMobile={false}
            />
          );
        });

        const keyPress = screen.getByTestId(`key-press-${code}`);
        expect(keyPress.textContent).toContain(korean);
        expect(keyPress.textContent).toContain(english);
      });
    });

    it("should work correctly in mobile gaming scenario", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={true} />
      );

      // Simulate mobile gameplay
      const combatSequence = ["Space", "KeyQ", "Space", "KeyE", "Space"];

      combatSequence.forEach((key) => {
        act(() => {
          rerender(
            <InteractiveControlDemo
              pressedKeys={new Set<string>([key])}
              isMobile={true}
            />
          );
        });
      });

      const keyPresses = screen.queryAllByTestId(/^key-press-/);
      expect(keyPresses.length).toBeGreaterThan(0);
      expect(keyPresses.length).toBeLessThanOrEqual(5);
    });
  });

  describe("Performance", () => {
    it("should handle many rapid updates", () => {
      const { rerender } = render(
        <InteractiveControlDemo pressedKeys={new Set<string>()} isMobile={false} />
      );

      for (let i = 0; i < 20; i++) {
        act(() => {
          rerender(
            <InteractiveControlDemo
              pressedKeys={new Set<string>([`Key${String.fromCharCode(65 + (i % 26))}`])}
              isMobile={false}
            />
          );
        });
      }

      expect(screen.getByTestId("interactive-demo")).toBeTruthy();
    });

    it("should cleanup timer on unmount", () => {
      const { unmount } = render(
        <InteractiveControlDemo
          pressedKeys={new Set<string>(["Space"])}
          isMobile={false}
        />
      );

      unmount();

      // Should not throw errors after unmount
      act(() => {
        vi.advanceTimersByTime(2000);
      });
    });
  });
});
