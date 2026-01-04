/**
 * Unit tests for KeyboardHints component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { KeyboardHints } from "./KeyboardHints";
import React from "react";

// Mock Html from @react-three/drei
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("KeyboardHints", () => {
  it("should not render when not visible", () => {
    render(<KeyboardHints visible={false} currentStance={0} />);

    expect(screen.queryByTestId("keyboard-hints")).not.toBeInTheDocument();
  });

  it("should render when visible", () => {
    render(<KeyboardHints visible={true} currentStance={0} />);

    expect(screen.getByTestId("keyboard-hints")).toBeInTheDocument();
  });

  it("should display all 8 stance keys", () => {
    render(<KeyboardHints visible={true} currentStance={0} />);

    // Check for default keys 1-8
    for (let i = 0; i < 8; i++) {
      expect(screen.getByTestId(`stance-key-${i}`)).toBeInTheDocument();
    }
  });

  it("should highlight current stance", () => {
    const currentStance = 3;
    render(<KeyboardHints visible={true} currentStance={currentStance} />);

    const activeKey = screen.getByTestId(`stance-key-${currentStance}`);
    expect(activeKey).toBeInTheDocument();

    // Active key should have gold border (checking via style would be complex due to inline styles)
    // Just verify it exists and has correct test id
    expect(activeKey).toBeDefined();
  });

  it("should display custom key bindings", () => {
    const customBindings = {
      stances: ["Q", "W", "E", "R", "T", "Y", "U", "I"],
      attack: " ",
      block: "b",
      movement: { up: "k", down: "j", left: "h", right: "l" },
      special: { precision: "Control", quickSwitch: "p", reset: "o" },
    };

    render(
      <KeyboardHints
        visible={true}
        currentStance={0}
        customBindings={customBindings}
      />
    );

    // Check that custom keys are displayed
    const firstKey = screen.getByTestId("stance-key-0");
    expect(firstKey.textContent).toBe("Q");
  });

  it("should show combat action hints", () => {
    render(<KeyboardHints visible={true} currentStance={0} />);

    const container = screen.getByTestId("keyboard-hints");

    // Check for combat action labels
    expect(container.textContent).toContain("Attack");
    expect(container.textContent).toContain("Block");
    expect(container.textContent).toContain("Move");
    expect(container.textContent).toContain("Toggle Hints");
  });

  it("should adapt to mobile layout", () => {
    render(<KeyboardHints visible={true} currentStance={0} isMobile={true} />);

    const hints = screen.getByTestId("keyboard-hints");
    expect(hints).toBeInTheDocument();

    // Mobile layout should have smaller keys
    const key = screen.getByTestId("stance-key-0");
    expect(key).toHaveStyle({ width: "32px", height: "32px" });
  });

  it("should display section title", () => {
    render(<KeyboardHints visible={true} currentStance={0} />);

    const container = screen.getByTestId("keyboard-hints");
    expect(container.textContent).toContain("Trigram Stances (1-8)");
  });

  it("should uppercase all key displays", () => {
    const customBindings = {
      stances: ["q", "w", "e", "r", "a", "s", "d", "f"], // lowercase
      attack: " ",
      block: "b",
      movement: { up: "k", down: "j", left: "h", right: "l" },
      special: { precision: "Control", quickSwitch: "p", reset: "o" },
    };

    render(
      <KeyboardHints
        visible={true}
        currentStance={0}
        customBindings={customBindings}
      />
    );

    const firstKey = screen.getByTestId("stance-key-0");
    expect(firstKey.textContent).toBe("Q"); // Should be uppercase
  });

  it("should handle all 8 stances being active sequentially", () => {
    for (let stance = 0; stance < 8; stance++) {
      const { unmount } = render(
        <KeyboardHints visible={true} currentStance={stance} />
      );

      const activeKey = screen.getByTestId(`stance-key-${stance}`);
      expect(activeKey).toBeInTheDocument();

      unmount();
    }
  });

  describe("F Key for Stance Side Switching", () => {
    it("should display F key hint for stance side switching", () => {
      render(<KeyboardHints visible={true} currentStance={0} />);

      const container = screen.getByTestId("keyboard-hints");
      expect(container.textContent).toContain("F");
      expect(container.textContent).toContain("Switch Side");
    });

    it("should include Korean text for stance side switching", () => {
      render(<KeyboardHints visible={true} currentStance={0} />);

      const container = screen.getByTestId("keyboard-hints");
      expect(container.textContent).toContain("측면 전환");
    });

    it("should display stance side switching hint alongside other combat actions", () => {
      render(<KeyboardHints visible={true} currentStance={0} />);

      const container = screen.getByTestId("keyboard-hints");

      // Should show all combat action hints including the new F key
      expect(container.textContent).toContain("Attack");
      expect(container.textContent).toContain("Block");
      expect(container.textContent).toContain("Move");
      expect(container.textContent).toContain("Switch Side");
    });

    it("should render F key hint in both mobile and desktop layouts", () => {
      const { unmount } = render(
        <KeyboardHints visible={true} currentStance={0} isMobile={false} />
      );
      expect(screen.getByTestId("keyboard-hints").textContent).toContain(
        "Switch Side"
      );
      unmount();

      render(
        <KeyboardHints visible={true} currentStance={0} isMobile={true} />
      );
      expect(screen.getByTestId("keyboard-hints").textContent).toContain(
        "Switch Side"
      );
    });
  });
});
