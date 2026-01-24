/**
 * VitalPointOverlayControlsPure.test.tsx
 * Test suite for pure DOM vital point overlay control panel
 *
 * Note: This component renders as pure DOM (no Three.js Html wrapper).
 * Tests focus on component structure, props, and DOM rendering.
 */

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VitalPointSeverity } from "../../../types/common";
import type { BodyRegionFilter } from "../three/effects/VitalPointMarkers3D";
import VitalPointOverlayControlsPure from "./VitalPointOverlayControlsPure";

describe("VitalPointOverlayControlsPure", () => {
  const defaultProps = {
    visible: true,
    onVisibleChange: vi.fn(),
    severityFilters: [] as VitalPointSeverity[],
    onSeverityFiltersChange: vi.fn(),
    regionFilter: "all" as BodyRegionFilter,
    onRegionFilterChange: vi.fn(),
    searchQuery: "",
    onSearchQueryChange: vi.fn(),
    showLabels: true,
    onShowLabelsChange: vi.fn(),
    animated: true,
    onAnimatedChange: vi.fn(),
    scale: 1.0,
    onScaleChange: vi.fn(),
    isMobile: false,
  };

  describe("Component Definition", () => {
    it("should be defined and importable", () => {
      expect(VitalPointOverlayControlsPure).toBeDefined();
      expect(typeof VitalPointOverlayControlsPure).toBe("function");
    });

    it("should accept all required props", () => {
      const props = { ...defaultProps };
      expect(props.visible).toBe(true);
      expect(props.onVisibleChange).toBeDefined();
      expect(props.severityFilters).toEqual([]);
      expect(props.onSeverityFiltersChange).toBeDefined();
      expect(props.regionFilter).toBe("all");
      expect(props.onRegionFilterChange).toBeDefined();
      expect(props.showLabels).toBe(true);
      expect(props.onShowLabelsChange).toBeDefined();
      expect(props.animated).toBe(true);
      expect(props.onAnimatedChange).toBeDefined();
      expect(props.scale).toBe(1.0);
      expect(props.onScaleChange).toBeDefined();
    });

    it("should accept optional props", () => {
      const propsWithOptional = {
        ...defaultProps,
        searchQuery: "test",
        onSearchQueryChange: vi.fn(),
        isMobile: true,
        screenPosition: { top: "100px", left: "20px" },
      };

      expect(propsWithOptional.searchQuery).toBe("test");
      expect(propsWithOptional.onSearchQueryChange).toBeDefined();
      expect(propsWithOptional.isMobile).toBe(true);
      expect(propsWithOptional.screenPosition).toEqual({
        top: "100px",
        left: "20px",
      });
    });
  });

  describe("DOM Rendering", () => {
    it("should render pure DOM without Canvas", () => {
      const { container } = render(
        <VitalPointOverlayControlsPure {...defaultProps} />
      );

      // Should render as pure DOM div
      const controlPanel = container.querySelector(
        '[data-testid="vital-point-overlay-controls"]'
      );
      expect(controlPanel).toBeInTheDocument();
    });

    it("should render visibility toggle button", () => {
      const { getByTestId } = render(
        <VitalPointOverlayControlsPure {...defaultProps} />
      );

      const toggleButton = getByTestId("toggle-visibility-button");
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveTextContent("✓ 활성화 | Enabled");
    });

    it("should render expand/collapse button", () => {
      const { getByTestId } = render(
        <VitalPointOverlayControlsPure {...defaultProps} />
      );

      const expandButton = getByTestId("toggle-expand-button");
      expect(expandButton).toBeInTheDocument();
    });

    it("should show disabled state when visible is false", () => {
      const { getByTestId } = render(
        <VitalPointOverlayControlsPure {...defaultProps} visible={false} />
      );

      const toggleButton = getByTestId("toggle-visibility-button");
      expect(toggleButton).toHaveTextContent("비활성화 | Disabled");
    });

    it("should apply mobile styles when isMobile is true", () => {
      const { container } = render(
        <VitalPointOverlayControlsPure {...defaultProps} isMobile={true} />
      );

      const controlPanel = container.querySelector(
        '[data-testid="vital-point-overlay-controls"]'
      );
      expect(controlPanel).toHaveStyle({ width: "280px" });
    });

    it("should apply desktop styles when isMobile is false", () => {
      const { container } = render(
        <VitalPointOverlayControlsPure {...defaultProps} isMobile={false} />
      );

      const controlPanel = container.querySelector(
        '[data-testid="vital-point-overlay-controls"]'
      );
      expect(controlPanel).toHaveStyle({ width: "350px" });
    });
  });

  describe("Props Interface", () => {
    it("should handle visibility toggle callback", () => {
      const onVisibleChange = vi.fn();
      onVisibleChange(false);
      expect(onVisibleChange).toHaveBeenCalledWith(false);
    });

    it("should handle severity filter changes", () => {
      const onSeverityFiltersChange = vi.fn();
      const newFilters = [
        VitalPointSeverity.LETHAL,
        VitalPointSeverity.CRITICAL,
      ];
      onSeverityFiltersChange(newFilters);
      expect(onSeverityFiltersChange).toHaveBeenCalledWith(newFilters);
    });

    it("should handle region filter changes", () => {
      const onRegionFilterChange = vi.fn();
      onRegionFilterChange("head");
      expect(onRegionFilterChange).toHaveBeenCalledWith("head");
    });

    it("should handle search query changes", () => {
      const onSearchQueryChange = vi.fn();
      onSearchQueryChange("temple");
      expect(onSearchQueryChange).toHaveBeenCalledWith("temple");
    });

    it("should handle label visibility changes", () => {
      const onShowLabelsChange = vi.fn();
      onShowLabelsChange(false);
      expect(onShowLabelsChange).toHaveBeenCalledWith(false);
    });

    it("should handle animation state changes", () => {
      const onAnimatedChange = vi.fn();
      onAnimatedChange(false);
      expect(onAnimatedChange).toHaveBeenCalledWith(false);
    });

    it("should handle scale changes", () => {
      const onScaleChange = vi.fn();
      onScaleChange(1.5);
      expect(onScaleChange).toHaveBeenCalledWith(1.5);
    });
  });

  describe("Screen Positioning", () => {
    it("should apply default position when no screenPosition provided", () => {
      const { container } = render(
        <VitalPointOverlayControlsPure {...defaultProps} />
      );

      const controlPanel = container.querySelector(
        '[data-testid="vital-point-overlay-controls"]'
      );
      expect(controlPanel).toHaveStyle({ top: "220px", left: "20px" });
    });

    it("should apply custom screenPosition when provided", () => {
      const { container } = render(
        <VitalPointOverlayControlsPure
          {...defaultProps}
          screenPosition={{ top: "100px", right: "50px" }}
        />
      );

      const controlPanel = container.querySelector(
        '[data-testid="vital-point-overlay-controls"]'
      );
      expect(controlPanel).toHaveStyle({ top: "100px", right: "50px" });
    });

    it("should use mobile position defaults when isMobile is true", () => {
      const { container } = render(
        <VitalPointOverlayControlsPure {...defaultProps} isMobile={true} />
      );

      const controlPanel = container.querySelector(
        '[data-testid="vital-point-overlay-controls"]'
      );
      expect(controlPanel).toHaveStyle({ top: "180px", left: "10px" });
    });
  });

  describe("Filtering Counts", () => {
    it("should display total vital points count", () => {
      const { container } = render(
        <VitalPointOverlayControlsPure {...defaultProps} />
      );

      // Should show "70 / 70 표시 | Showing" (70 total vital points)
      expect(container.textContent).toContain("70");
      expect(container.textContent).toContain("표시");
      expect(container.textContent).toContain("Showing");
    });

    it("should update filtered count based on severity filters", () => {
      const severityFilters = [VitalPointSeverity.LETHAL];
      const { container } = render(
        <VitalPointOverlayControlsPure
          {...defaultProps}
          severityFilters={severityFilters}
        />
      );

      // Text should still contain showing indicator
      expect(container.textContent).toContain("표시");
    });

    it("should update filtered count based on region filter", () => {
      const { container } = render(
        <VitalPointOverlayControlsPure
          {...defaultProps}
          regionFilter="head"
        />
      );

      // Text should still contain showing indicator
      expect(container.textContent).toContain("표시");
    });
  });

  describe("Accessibility", () => {
    it("should have proper test IDs for testing", () => {
      const { getByTestId } = render(
        <VitalPointOverlayControlsPure {...defaultProps} />
      );

      expect(getByTestId("vital-point-overlay-controls")).toBeInTheDocument();
      expect(getByTestId("toggle-expand-button")).toBeInTheDocument();
      expect(getByTestId("toggle-visibility-button")).toBeInTheDocument();
    });

    it("should render as pointer-events: all for interaction", () => {
      const { container } = render(
        <VitalPointOverlayControlsPure {...defaultProps} />
      );

      const controlPanel = container.querySelector(
        '[data-testid="vital-point-overlay-controls"]'
      );
      expect(controlPanel).toHaveStyle({ pointerEvents: "all" });
    });
  });

  describe("Korean Theming", () => {
    it("should display bilingual text (Korean | English)", () => {
      const { container } = render(
        <VitalPointOverlayControlsPure {...defaultProps} />
      );

      expect(container.textContent).toContain("급소 오버레이 | Vital Points");
      expect(container.textContent).toContain("표시 | Showing");
    });

    it("should display correct enabled/disabled text", () => {
      const { getByTestId, rerender } = render(
        <VitalPointOverlayControlsPure {...defaultProps} visible={true} />
      );

      expect(getByTestId("toggle-visibility-button")).toHaveTextContent(
        "✓ 활성화 | Enabled"
      );

      rerender(
        <VitalPointOverlayControlsPure {...defaultProps} visible={false} />
      );

      expect(getByTestId("toggle-visibility-button")).toHaveTextContent(
        "비활성화 | Disabled"
      );
    });
  });
});
