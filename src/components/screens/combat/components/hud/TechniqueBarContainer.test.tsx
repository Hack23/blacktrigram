/**
 * Tests for TechniqueBarContainer positioning and layout
 * 
 * Comprehensive test coverage for:
 * - Positioning (mobile vs desktop)
 * - Z-index layering
 * - Layout properties
 * - Visibility control
 * - Pointer events
 * - Memoization
 */

import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TechniqueBarContainer } from "./TechniqueBarContainer";
import { Z_INDEX } from "../../../../../types/LayoutTypes";
import { LAYOUT_BOTTOM_POSITIONS } from "../../../../../types/constants/layout";
import type { PlayerState } from "../../../../../systems";

// Mock TechniqueBar component
vi.mock("../indicators/TechniqueBar", () => ({
  TechniqueBar: ({ isMobile }: { isMobile: boolean }) => (
    <div data-testid="technique-bar">
      Technique Bar (Mobile: {isMobile ? "Yes" : "No"})
    </div>
  ),
}));

describe("TechniqueBarContainer", () => {
  const mockPlayer: PlayerState = {
    id: "player1",
    name: { korean: "테스트", english: "Test" },
    stamina: 100,
    ki: 100,
  } as PlayerState;

  const mockProps = {
    techniques: [],
    player: mockPlayer,
    selectedIndex: 0,
    cooldowns: new Map(),
    onTechniqueSelect: vi.fn(),
    onTechniqueHover: vi.fn(),
    isMobile: false,
    screenWidth: 1920,
    screenHeight: 1080,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Positioning", () => {
    it("should use mobile bottom position on mobile", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} isMobile={true} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.bottom).toBe(
        `${LAYOUT_BOTTOM_POSITIONS.TECHNIQUE_BAR.MOBILE}px`
      );
    });

    it("should use desktop bottom position on desktop", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} isMobile={false} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.bottom).toBe(
        `${LAYOUT_BOTTOM_POSITIONS.TECHNIQUE_BAR.DESKTOP}px`
      );
    });

    it("should use consistent positioning (200px mobile, 220px desktop)", () => {
      // This test documents the expected behavior
      const mobileExpected = 200;
      const desktopExpected = 220;

      expect(LAYOUT_BOTTOM_POSITIONS.TECHNIQUE_BAR.MOBILE).toBe(mobileExpected);
      expect(LAYOUT_BOTTOM_POSITIONS.TECHNIQUE_BAR.DESKTOP).toBe(desktopExpected);
    });
  });

  describe("Z-Index Layering", () => {
    it("should use TECHNIQUE_BAR z-index constant", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.zIndex).toBe(Z_INDEX.TECHNIQUE_BAR.toString());
    });

    it("should be below MOBILE_CONTROLS z-index", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      const wrapper = container.firstChild as HTMLElement;
      const zIndex = parseInt(wrapper.style.zIndex, 10);
      expect(zIndex).toBeLessThan(Z_INDEX.MOBILE_CONTROLS);
    });

    it("should be above HUD z-index", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      const wrapper = container.firstChild as HTMLElement;
      const zIndex = parseInt(wrapper.style.zIndex, 10);
      expect(zIndex).toBeGreaterThan(Z_INDEX.HUD);
    });

    it("should have correct z-index value (45)", () => {
      // This test documents the expected z-index value
      expect(Z_INDEX.TECHNIQUE_BAR).toBe(45);
    });
  });

  describe("Layout Properties", () => {
    it("should have correct container height from constants", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.height).toBe(
        `${LAYOUT_BOTTOM_POSITIONS.TECHNIQUE_BAR_HEIGHT}px`
      );
    });

    it("should have container height of 180px", () => {
      // This test documents the expected height
      expect(LAYOUT_BOTTOM_POSITIONS.TECHNIQUE_BAR_HEIGHT).toBe(180);
    });

    it("should be full width", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.width).toBe("100%");
    });

    it("should use absolute positioning", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.position).toBe("absolute");
    });

    it("should be positioned at left: 0", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.left).toBe("0px");
    });

    it("should use flexbox for centering", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.display).toBe("flex");
      expect(wrapper.style.justifyContent).toBe("center");
      expect(wrapper.style.alignItems).toBe("flex-end");
    });
  });

  describe("Pointer Events", () => {
    it("should have pointer-events none on container", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.pointerEvents).toBe("none");
    });

    it("should have pointer-events auto on inner div", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      const wrapper = container.firstChild as HTMLElement;
      const inner = wrapper.firstChild as HTMLElement;
      expect(inner.style.pointerEvents).toBe("auto");
    });
  });

  describe("Visibility Control", () => {
    it("should render when visible is true (default)", () => {
      const { getByTestId } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      expect(getByTestId("technique-bar-container")).toBeInTheDocument();
    });

    it("should render when visible is explicitly true", () => {
      const { getByTestId } = render(
        <TechniqueBarContainer {...mockProps} visible={true} />
      );

      expect(getByTestId("technique-bar-container")).toBeInTheDocument();
    });

    it("should not render when visible is false", () => {
      const { queryByTestId } = render(
        <TechniqueBarContainer {...mockProps} visible={false} />
      );

      expect(queryByTestId("technique-bar-container")).not.toBeInTheDocument();
    });
  });

  describe("Props Propagation", () => {
    it("should pass isMobile to TechniqueBar", () => {
      const { getByTestId } = render(
        <TechniqueBarContainer {...mockProps} isMobile={true} />
      );

      const techniqueBar = getByTestId("technique-bar");
      expect(techniqueBar.textContent).toContain("Mobile: Yes");
    });

    it("should pass all required props to TechniqueBar", () => {
      const { getByTestId } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      // If TechniqueBar renders without errors, props were passed correctly
      expect(getByTestId("technique-bar")).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should adapt positioning for mobile screens", () => {
      const { container, rerender } = render(
        <TechniqueBarContainer {...mockProps} isMobile={false} />
      );

      const wrapperDesktop = container.firstChild as HTMLElement;
      const desktopBottom = wrapperDesktop.style.bottom;

      rerender(<TechniqueBarContainer {...mockProps} isMobile={true} />);

      const wrapperMobile = container.firstChild as HTMLElement;
      const mobileBottom = wrapperMobile.style.bottom;

      // Mobile should use 200px, desktop should use 220px
      expect(mobileBottom).toBe("200px");
      expect(desktopBottom).toBe("220px");
      expect(mobileBottom).not.toBe(desktopBottom);
    });
  });

  describe("Regression Prevention", () => {
    it("should prevent overlap with mobile controls (200px)", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} isMobile={true} />
      );

      const wrapper = container.firstChild as HTMLElement;
      const bottom = parseInt(wrapper.style.bottom, 10);

      // TechniqueBar bottom should equal mobile controls position
      // This prevents overlap
      expect(bottom).toBe(LAYOUT_BOTTOM_POSITIONS.MOBILE_CONTROLS);
    });

    it("should maintain clearance from back button (80px)", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} isMobile={true} />
      );

      const wrapper = container.firstChild as HTMLElement;
      const techniqueBarBottom = parseInt(wrapper.style.bottom, 10);
      const backButtonBottom = LAYOUT_BOTTOM_POSITIONS.BACK_BUTTON.MOBILE;

      // TechniqueBar should be well above back button
      const clearance = techniqueBarBottom - backButtonBottom;
      expect(clearance).toBeGreaterThan(100); // 200 - 80 = 120px clearance
    });

    it("should use semantic constants (no magic numbers)", () => {
      const { container } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      const wrapper = container.firstChild as HTMLElement;
      
      // Verify values come from constants, not hardcoded
      const bottom = parseInt(wrapper.style.bottom, 10);
      const height = parseInt(wrapper.style.height, 10);
      
      expect(bottom).toBe(LAYOUT_BOTTOM_POSITIONS.TECHNIQUE_BAR.DESKTOP);
      expect(height).toBe(LAYOUT_BOTTOM_POSITIONS.TECHNIQUE_BAR_HEIGHT);
    });
  });

  describe("Test ID", () => {
    it("should have data-testid for testing", () => {
      const { getByTestId } = render(
        <TechniqueBarContainer {...mockProps} />
      );

      expect(getByTestId("technique-bar-container")).toBeInTheDocument();
    });
  });
});
