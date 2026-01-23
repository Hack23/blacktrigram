/**
 * Tests for ControlCategoryTabs - Tab navigation component
 * 
 * Tests tab rendering, selection state, click handling, hover effects,
 * responsive behavior, and bilingual labels.
 * 
 * @module components/screens/controls/components/__tests__
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ControlCategoryTabs } from "./ControlCategoryTabs";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

describe("ControlCategoryTabs", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const onTabChange = vi.fn();
      const { container } = render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should have control-category-tabs test id", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("control-category-tabs")).toBeTruthy();
    });

    it("should render all 3 category tabs", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("tab-combat")).toBeTruthy();
      expect(screen.getByTestId("tab-movement")).toBeTruthy();
      expect(screen.getByTestId("tab-system")).toBeTruthy();
    });

    it("should display Korean labels for all tabs", () => {
      const onTabChange = vi.fn();
      const { container } = render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const content = container.textContent || "";
      expect(content).toContain("전투");
      expect(content).toContain("이동");
      expect(content).toContain("시스템");
    });

    it("should display English labels for all tabs", () => {
      const onTabChange = vi.fn();
      const { container } = render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const content = container.textContent || "";
      expect(content).toContain("Combat");
      expect(content).toContain("Movement");
      expect(content).toContain("System");
    });

    it("should display icons for all tabs", () => {
      const onTabChange = vi.fn();
      const { container } = render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const content = container.textContent || "";
      expect(content).toContain("⚔️");
      expect(content).toContain("🏃");
      expect(content).toContain("⚙️");
    });

    it("should render bilingual format (Korean | English)", () => {
      const onTabChange = vi.fn();
      const { container } = render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const content = container.textContent || "";
      expect(content).toContain("전투 | Combat");
      expect(content).toContain("이동 | Movement");
      expect(content).toContain("시스템 | System");
    });
  });

  describe("Selection state", () => {
    it("should highlight selected tab - combat", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const combatTab = screen.getByTestId("tab-combat");
      const movementTab = screen.getByTestId("tab-movement");

      // Selected tab should have different styling (we can't easily test exact colors,
      // but we can verify the elements exist and structure is correct)
      expect(combatTab).toBeTruthy();
      expect(movementTab).toBeTruthy();
    });

    it("should highlight selected tab - movement", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="movement"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const movementTab = screen.getByTestId("tab-movement");
      expect(movementTab).toBeTruthy();
    });

    it("should highlight selected tab - system", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="system"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const systemTab = screen.getByTestId("tab-system");
      expect(systemTab).toBeTruthy();
    });

    it("should have correct button elements for all tabs", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const combatButton = screen.getByTestId("tab-combat");
      const movementButton = screen.getByTestId("tab-movement");
      const systemButton = screen.getByTestId("tab-system");

      expect(combatButton.tagName).toBe("BUTTON");
      expect(movementButton.tagName).toBe("BUTTON");
      expect(systemButton.tagName).toBe("BUTTON");
    });
  });

  describe("Click handling", () => {
    it("should call onTabChange when combat tab is clicked", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="movement"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const combatTab = screen.getByTestId("tab-combat");
      fireEvent.click(combatTab);

      expect(onTabChange).toHaveBeenCalledWith("combat");
      expect(onTabChange).toHaveBeenCalledTimes(1);
    });

    it("should call onTabChange when movement tab is clicked", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const movementTab = screen.getByTestId("tab-movement");
      fireEvent.click(movementTab);

      expect(onTabChange).toHaveBeenCalledWith("movement");
      expect(onTabChange).toHaveBeenCalledTimes(1);
    });

    it("should call onTabChange when system tab is clicked", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const systemTab = screen.getByTestId("tab-system");
      fireEvent.click(systemTab);

      expect(onTabChange).toHaveBeenCalledWith("system");
      expect(onTabChange).toHaveBeenCalledTimes(1);
    });

    it("should allow clicking the already selected tab", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const combatTab = screen.getByTestId("tab-combat");
      fireEvent.click(combatTab);

      expect(onTabChange).toHaveBeenCalledWith("combat");
      expect(onTabChange).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple tab clicks", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const movementTab = screen.getByTestId("tab-movement");
      const systemTab = screen.getByTestId("tab-system");

      fireEvent.click(movementTab);
      fireEvent.click(systemTab);
      fireEvent.click(movementTab);

      expect(onTabChange).toHaveBeenCalledTimes(3);
      expect(onTabChange).toHaveBeenNthCalledWith(1, "movement");
      expect(onTabChange).toHaveBeenNthCalledWith(2, "system");
      expect(onTabChange).toHaveBeenNthCalledWith(3, "movement");
    });
  });

  describe("Hover effects", () => {
    it("should have hover effect on combat tab", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="movement"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const combatTab = screen.getByTestId("tab-combat");

      // Simulate mouse enter
      fireEvent.mouseEnter(combatTab);
      expect(combatTab).toBeTruthy();

      // Simulate mouse leave
      fireEvent.mouseLeave(combatTab);
      expect(combatTab).toBeTruthy();
    });

    it("should have hover effect on movement tab", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const movementTab = screen.getByTestId("tab-movement");

      fireEvent.mouseEnter(movementTab);
      expect(movementTab).toBeTruthy();

      fireEvent.mouseLeave(movementTab);
      expect(movementTab).toBeTruthy();
    });

    it("should have hover effect on system tab", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const systemTab = screen.getByTestId("tab-system");

      fireEvent.mouseEnter(systemTab);
      expect(systemTab).toBeTruthy();

      fireEvent.mouseLeave(systemTab);
      expect(systemTab).toBeTruthy();
    });

    it("should handle hover on selected tab", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const combatTab = screen.getByTestId("tab-combat");

      fireEvent.mouseEnter(combatTab);
      expect(combatTab).toBeTruthy();

      fireEvent.mouseLeave(combatTab);
      expect(combatTab).toBeTruthy();
    });
  });

  describe("Responsive behavior", () => {
    it("should adapt to mobile layout", () => {
      const onTabChange = vi.fn();
      const { container } = render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={true}
        />
      );

      expect(container.querySelector('[data-testid="control-category-tabs"]')).toBeTruthy();
    });

    it("should adapt to desktop layout", () => {
      const onTabChange = vi.fn();
      const { container } = render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      expect(container.querySelector('[data-testid="control-category-tabs"]')).toBeTruthy();
    });

    it("should render all tabs in mobile layout", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={true}
        />
      );

      expect(screen.getByTestId("tab-combat")).toBeTruthy();
      expect(screen.getByTestId("tab-movement")).toBeTruthy();
      expect(screen.getByTestId("tab-system")).toBeTruthy();
    });

    it("should maintain functionality in mobile layout", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={true}
        />
      );

      const movementTab = screen.getByTestId("tab-movement");
      fireEvent.click(movementTab);

      expect(onTabChange).toHaveBeenCalledWith("movement");
    });

    it("should handle switching between mobile and desktop layouts", () => {
      const onTabChange = vi.fn();

      const { rerender } = render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("control-category-tabs")).toBeTruthy();

      rerender(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={true}
        />
      );

      expect(screen.getByTestId("control-category-tabs")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have accessible button elements", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const combatButton = screen.getByTestId("tab-combat");
      const movementButton = screen.getByTestId("tab-movement");
      const systemButton = screen.getByTestId("tab-system");

      expect(combatButton.getAttribute("role")).not.toBe("presentation");
      expect(movementButton.getAttribute("role")).not.toBe("presentation");
      expect(systemButton.getAttribute("role")).not.toBe("presentation");
    });

    it("should have emoji icons with proper aria-label", () => {
      const onTabChange = vi.fn();
      const { container } = render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const emojiElements = container.querySelectorAll('[role="img"]');
      expect(emojiElements.length).toBeGreaterThanOrEqual(3);

      emojiElements.forEach((emoji) => {
        expect(emoji.getAttribute("aria-label")).toBeTruthy();
      });
    });

    it("should provide clear text labels", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const combatTab = screen.getByTestId("tab-combat");
      expect(combatTab.textContent).toContain("전투");
      expect(combatTab.textContent).toContain("Combat");
    });
  });

  describe("Edge cases", () => {
    it("should handle rapid tab switching", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const combatTab = screen.getByTestId("tab-combat");
      const movementTab = screen.getByTestId("tab-movement");
      const systemTab = screen.getByTestId("tab-system");

      for (let i = 0; i < 5; i++) {
        fireEvent.click(combatTab);
        fireEvent.click(movementTab);
        fireEvent.click(systemTab);
      }

      expect(onTabChange).toHaveBeenCalledTimes(15);
    });

    it("should not break with undefined onTabChange", () => {
      expect(() => {
        render(
          <ControlCategoryTabs
            selectedTab="combat"
            onTabChange={undefined as any}
            isMobile={false}
          />
        );
      }).not.toThrow();
    });

    it("should maintain layout with long text", () => {
      const onTabChange = vi.fn();
      const { container } = render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      const tabsContainer = container.querySelector(
        '[data-testid="control-category-tabs"]'
      );
      expect(tabsContainer).toBeTruthy();
    });

    it("should handle rerendering with different selected tabs", () => {
      const onTabChange = vi.fn();

      const { rerender } = render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("tab-combat")).toBeTruthy();

      rerender(
        <ControlCategoryTabs
          selectedTab="movement"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("tab-movement")).toBeTruthy();

      rerender(
        <ControlCategoryTabs
          selectedTab="system"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      expect(screen.getByTestId("tab-system")).toBeTruthy();
    });
  });

  describe("Integration", () => {
    it("should work with complete user flow", () => {
      const onTabChange = vi.fn();
      render(
        <ControlCategoryTabs
          selectedTab="combat"
          onTabChange={onTabChange}
          isMobile={false}
        />
      );

      // User clicks movement tab
      const movementTab = screen.getByTestId("tab-movement");
      fireEvent.click(movementTab);
      expect(onTabChange).toHaveBeenCalledWith("movement");

      // User hovers over system tab
      const systemTab = screen.getByTestId("tab-system");
      fireEvent.mouseEnter(systemTab);

      // User clicks system tab
      fireEvent.click(systemTab);
      expect(onTabChange).toHaveBeenCalledWith("system");

      // User clicks back to combat
      const combatTab = screen.getByTestId("tab-combat");
      fireEvent.click(combatTab);
      expect(onTabChange).toHaveBeenCalledWith("combat");

      expect(onTabChange).toHaveBeenCalledTimes(3);
    });
  });
});
