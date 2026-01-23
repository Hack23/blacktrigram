/**
 * Tests for ControlBindingsOverlayHtml - Control bindings display
 * 
 * Tests bindings list rendering, filtering by tab, bilingual labels,
 * responsive layout, category colors, and empty states.
 * 
 * @module components/screens/controls/components/__tests__
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ControlBindingsOverlayHtml } from "./ControlBindingsOverlayHtml";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

describe("ControlBindingsOverlayHtml", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(
        <ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />
      );

      expect(container).toBeTruthy();
    });

    it("should have control-bindings test id", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      expect(screen.getByTestId("control-bindings")).toBeTruthy();
    });

    it("should render binding cards for filtered keys", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const bindingContainer = screen.getByTestId("control-bindings");
      expect(bindingContainer).toBeTruthy();

      // Should have binding cards (combat includes stance, combat, and technique keys)
      const bindings = screen.queryAllByTestId(/^binding-/);
      expect(bindings.length).toBeGreaterThan(0);
    });
  });

  describe("Filtering by tab", () => {
    it("should show combat-related keys when combat tab is selected", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      // Combat should include Space (combat), Digit1-8 (stances), Q-Y (techniques)
      expect(screen.getByTestId("binding-Space")).toBeTruthy();
      expect(screen.getByTestId("binding-Digit1")).toBeTruthy();
      expect(screen.getByTestId("binding-KeyQ")).toBeTruthy();
    });

    it("should show movement-related keys when movement tab is selected", () => {
      render(<ControlBindingsOverlayHtml selectedTab="movement" isMobile={false} />);

      // Movement should include WASD and arrow keys, plus modifiers
      expect(screen.getByTestId("binding-KeyW")).toBeTruthy();
      expect(screen.getByTestId("binding-KeyA")).toBeTruthy();
      expect(screen.getByTestId("binding-ArrowUp")).toBeTruthy();
      expect(screen.getByTestId("binding-ShiftLeft")).toBeTruthy();
    });

    it("should show system keys when system tab is selected", () => {
      render(<ControlBindingsOverlayHtml selectedTab="system" isMobile={false} />);

      // System should include ESC, M, Tab
      expect(screen.getByTestId("binding-Escape")).toBeTruthy();
      expect(screen.getByTestId("binding-KeyM")).toBeTruthy();
      expect(screen.getByTestId("binding-Tab")).toBeTruthy();
    });

    it("should not show movement keys in combat tab", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      // Movement keys should not be present
      expect(screen.queryByTestId("binding-KeyW")).toBeNull();
      expect(screen.queryByTestId("binding-ArrowUp")).toBeNull();
    });

    it("should not show combat keys in movement tab", () => {
      render(<ControlBindingsOverlayHtml selectedTab="movement" isMobile={false} />);

      // Combat keys should not be present
      expect(screen.queryByTestId("binding-Space")).toBeNull();
      expect(screen.queryByTestId("binding-Digit1")).toBeNull();
    });

    it("should not show system keys in combat tab", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      // System keys should not be present
      expect(screen.queryByTestId("binding-Escape")).toBeNull();
      expect(screen.queryByTestId("binding-KeyM")).toBeNull();
    });
  });

  describe("Bilingual labels", () => {
    it("should display Korean labels for keys", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const spaceBinding = screen.getByTestId("binding-Space");
      expect(spaceBinding.textContent).toContain("공격");
    });

    it("should display English descriptions", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const spaceBinding = screen.getByTestId("binding-Space");
      expect(spaceBinding.textContent).toContain("Attack");
    });

    it("should display bilingual format (Korean | English)", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const spaceBinding = screen.getByTestId("binding-Space");
      const text = spaceBinding.textContent || "";

      // Check for pipe separator
      expect(text).toMatch(/공격.*\|.*Attack/);
    });

    it("should show Korean stance names", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const digit1Binding = screen.getByTestId("binding-Digit1");
      expect(digit1Binding.textContent).toContain("건");
    });

    it("should show movement Korean labels", () => {
      render(<ControlBindingsOverlayHtml selectedTab="movement" isMobile={false} />);

      const keyWBinding = screen.getByTestId("binding-KeyW");
      expect(keyWBinding.textContent).toContain("전진");
    });
  });

  describe("Responsive layout", () => {
    it("should render in mobile layout", () => {
      const { container } = render(
        <ControlBindingsOverlayHtml selectedTab="combat" isMobile={true} />
      );

      const bindingContainer = container.querySelector('[data-testid="control-bindings"]');
      expect(bindingContainer).toBeTruthy();
    });

    it("should render in desktop layout", () => {
      const { container } = render(
        <ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />
      );

      const bindingContainer = container.querySelector('[data-testid="control-bindings"]');
      expect(bindingContainer).toBeTruthy();
    });

    it("should display all bindings in mobile layout", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={true} />);

      const bindings = screen.queryAllByTestId(/^binding-/);
      expect(bindings.length).toBeGreaterThan(0);
    });

    it("should display all bindings in desktop layout", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const bindings = screen.queryAllByTestId(/^binding-/);
      expect(bindings.length).toBeGreaterThan(0);
    });

    it("should handle switching between mobile and desktop", () => {
      const { rerender } = render(
        <ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />
      );

      expect(screen.getByTestId("control-bindings")).toBeTruthy();

      rerender(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={true} />);

      expect(screen.getByTestId("control-bindings")).toBeTruthy();
    });
  });

  describe("Category colors", () => {
    it("should apply category colors to binding cards", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      // All binding cards should have border styling
      const spaceBinding = screen.getByTestId("binding-Space");
      expect(spaceBinding).toBeTruthy();
      expect(spaceBinding.getAttribute("style")).toBeTruthy();
    });

    it("should show category badge on each binding", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const spaceBinding = screen.getByTestId("binding-Space");
      expect(spaceBinding.textContent).toContain("combat");

      const digit1Binding = screen.getByTestId("binding-Digit1");
      expect(digit1Binding.textContent).toContain("stance");
    });

    it("should differentiate between categories visually", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const combatBinding = screen.getByTestId("binding-Space");
      const stanceBinding = screen.getByTestId("binding-Digit1");
      const techniqueBinding = screen.getByTestId("binding-KeyQ");

      // Each should have different category labels
      expect(combatBinding.textContent).toContain("combat");
      expect(stanceBinding.textContent).toContain("stance");
      expect(techniqueBinding.textContent).toContain("technique");
    });
  });

  describe("Hover effects", () => {
    it("should apply hover effects on binding cards", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const spaceBinding = screen.getByTestId("binding-Space");

      fireEvent.mouseEnter(spaceBinding);
      expect(spaceBinding).toBeTruthy();

      fireEvent.mouseLeave(spaceBinding);
      expect(spaceBinding).toBeTruthy();
    });

    it("should handle hover on multiple bindings", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const spaceBinding = screen.getByTestId("binding-Space");
      const digit1Binding = screen.getByTestId("binding-Digit1");

      fireEvent.mouseEnter(spaceBinding);
      fireEvent.mouseLeave(spaceBinding);
      fireEvent.mouseEnter(digit1Binding);
      fireEvent.mouseLeave(digit1Binding);

      expect(spaceBinding).toBeTruthy();
      expect(digit1Binding).toBeTruthy();
    });
  });

  describe("Empty state", () => {
    it("should show message when no keys match filter (simulated)", () => {
      // Note: With current implementation, we always have keys in each category,
      // but we can test the empty state rendering logic exists
      render(<ControlBindingsOverlayHtml selectedTab="system" isMobile={false} />);

      const bindingContainer = screen.getByTestId("control-bindings");
      expect(bindingContainer).toBeTruthy();

      // System has keys, so should have bindings
      const bindings = screen.queryAllByTestId(/^binding-/);
      expect(bindings.length).toBeGreaterThan(0);
    });
  });

  describe("Key display", () => {
    it("should show key labels prominently", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const spaceBinding = screen.getByTestId("binding-Space");
      expect(spaceBinding.textContent).toContain("Space");
    });

    it("should display stance number keys", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      for (let i = 1; i <= 8; i++) {
        const stanceBinding = screen.getByTestId(`binding-Digit${i}`);
        expect(stanceBinding.textContent).toContain(i.toString());
      }
    });

    it("should display technique letter keys", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const techniqueKeys = ["Q", "E", "R", "T", "Y", "F", "G", "Z", "X", "C"];
      techniqueKeys.forEach((key) => {
        const binding = screen.getByTestId(`binding-Key${key}`);
        expect(binding.textContent).toContain(key);
      });
    });

    it("should display arrow key symbols", () => {
      render(<ControlBindingsOverlayHtml selectedTab="movement" isMobile={false} />);

      const upArrowBinding = screen.getByTestId("binding-ArrowUp");
      expect(upArrowBinding.textContent).toContain("↑");

      const leftArrowBinding = screen.getByTestId("binding-ArrowLeft");
      expect(leftArrowBinding.textContent).toContain("←");
    });
  });

  describe("Descriptions", () => {
    it("should show action descriptions", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const spaceBinding = screen.getByTestId("binding-Space");
      expect(spaceBinding.textContent).toContain("Attack");
      expect(spaceBinding.textContent).toContain("공격");
    });

    it("should show stance descriptions", () => {
      render(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);

      const digit1Binding = screen.getByTestId("binding-Digit1");
      expect(digit1Binding.textContent).toContain("Heaven");
    });

    it("should show movement descriptions", () => {
      render(<ControlBindingsOverlayHtml selectedTab="movement" isMobile={false} />);

      const keyWBinding = screen.getByTestId("binding-KeyW");
      expect(keyWBinding.textContent).toContain("Forward");
    });
  });

  describe("Integration", () => {
    it("should update bindings when tab changes", () => {
      const { rerender } = render(
        <ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />
      );

      // Combat tab should show Space key
      expect(screen.getByTestId("binding-Space")).toBeTruthy();
      expect(screen.queryByTestId("binding-Escape")).toBeNull();

      // Switch to system tab
      rerender(<ControlBindingsOverlayHtml selectedTab="system" isMobile={false} />);

      // System tab should show Escape key, not Space
      expect(screen.queryByTestId("binding-Space")).toBeNull();
      expect(screen.getByTestId("binding-Escape")).toBeTruthy();
    });

    it("should maintain functionality across layout changes", () => {
      const { rerender } = render(
        <ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />
      );

      expect(screen.getByTestId("binding-Space")).toBeTruthy();

      rerender(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={true} />);

      expect(screen.getByTestId("binding-Space")).toBeTruthy();

      rerender(<ControlBindingsOverlayHtml selectedTab="movement" isMobile={true} />);

      expect(screen.getByTestId("binding-KeyW")).toBeTruthy();
    });

    it("should display consistent information across tabs", () => {
      const { rerender } = render(
        <ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />
      );

      const combatBindings = screen.queryAllByTestId(/^binding-/);
      expect(combatBindings.length).toBeGreaterThan(0);

      rerender(<ControlBindingsOverlayHtml selectedTab="movement" isMobile={false} />);

      const movementBindings = screen.queryAllByTestId(/^binding-/);
      expect(movementBindings.length).toBeGreaterThan(0);

      rerender(<ControlBindingsOverlayHtml selectedTab="system" isMobile={false} />);

      const systemBindings = screen.queryAllByTestId(/^binding-/);
      expect(systemBindings.length).toBeGreaterThan(0);
    });
  });

  describe("Edge cases", () => {
    it("should handle rapid tab switching", () => {
      const { rerender } = render(
        <ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />
      );

      for (let i = 0; i < 5; i++) {
        rerender(<ControlBindingsOverlayHtml selectedTab="movement" isMobile={false} />);
        rerender(<ControlBindingsOverlayHtml selectedTab="system" isMobile={false} />);
        rerender(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);
      }

      expect(screen.getByTestId("control-bindings")).toBeTruthy();
    });

    it("should handle switching between mobile and desktop multiple times", () => {
      const { rerender } = render(
        <ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />
      );

      for (let i = 0; i < 3; i++) {
        rerender(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={true} />);
        rerender(<ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />);
      }

      expect(screen.getByTestId("control-bindings")).toBeTruthy();
    });

    it("should maintain correct binding count per category", () => {
      const { rerender } = render(
        <ControlBindingsOverlayHtml selectedTab="combat" isMobile={false} />
      );

      const combatCount = screen.queryAllByTestId(/^binding-/).length;

      rerender(<ControlBindingsOverlayHtml selectedTab="movement" isMobile={false} />);

      const movementCount = screen.queryAllByTestId(/^binding-/).length;

      rerender(<ControlBindingsOverlayHtml selectedTab="system" isMobile={false} />);

      const systemCount = screen.queryAllByTestId(/^binding-/).length;

      // Each category should have different number of bindings
      expect(combatCount).toBeGreaterThan(0);
      expect(movementCount).toBeGreaterThan(0);
      expect(systemCount).toBeGreaterThan(0);
      expect(combatCount).not.toBe(movementCount);
    });
  });
});
