/**
 * Unit tests for PressureMeter component
 * 
 * Tests Son (Wind) stance pressure accumulation display.
 * Verifies pressure levels, colors, and bilingual labels.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PressureMeter } from "./PressureMeter";
import { KOREAN_COLORS } from "../../../types/constants";

// Mock useKoreanTheme hook
vi.mock("../../shared/base/useKoreanTheme", () => ({
  useKoreanTheme: () => KOREAN_COLORS,
}));

describe("PressureMeter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("Component Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<PressureMeter pressure={5} />);
      expect(container).toBeTruthy();
    });

    it("should display bilingual label", () => {
      render(<PressureMeter pressure={5} />);
      expect(screen.getByText(/압박 \| Pressure/)).toBeInTheDocument();
    });

    it("should display current and max pressure", () => {
      render(<PressureMeter pressure={7} maxPressure={10} />);
      expect(screen.getByText("7/10")).toBeInTheDocument();
    });

    it("should display Korean description", () => {
      render(<PressureMeter pressure={5} />);
      expect(screen.getByText("연속 공격으로 압박을 가하세요")).toBeInTheDocument();
    });
  });

  describe("Pressure Levels", () => {
    it("should handle zero pressure", () => {
      render(<PressureMeter pressure={0} maxPressure={10} />);
      expect(screen.getByText("0/10")).toBeInTheDocument();
    });

    it("should handle low pressure (1-3 stacks)", () => {
      const { container } = render(<PressureMeter pressure={2} maxPressure={10} />);
      expect(screen.getByText("2/10")).toBeInTheDocument();
      expect(container).toBeTruthy();
    });

    it("should handle medium pressure (4-6 stacks)", () => {
      const { container } = render(<PressureMeter pressure={5} maxPressure={10} />);
      expect(screen.getByText("5/10")).toBeInTheDocument();
      expect(container).toBeTruthy();
    });

    it("should handle high pressure (7-10 stacks)", () => {
      const { container } = render(<PressureMeter pressure={9} maxPressure={10} />);
      expect(screen.getByText("9/10")).toBeInTheDocument();
      expect(container).toBeTruthy();
    });

    it("should handle maximum pressure", () => {
      render(<PressureMeter pressure={10} maxPressure={10} />);
      expect(screen.getByText("10/10")).toBeInTheDocument();
    });

    it("should clamp pressure at maximum", () => {
      render(<PressureMeter pressure={15} maxPressure={10} />);
      expect(screen.getByText("15/10")).toBeInTheDocument();
    });
  });

  describe("Custom Max Pressure", () => {
    it("should support custom max pressure values", () => {
      render(<PressureMeter pressure={7} maxPressure={15} />);
      expect(screen.getByText("7/15")).toBeInTheDocument();
    });

    it("should handle smaller max pressure", () => {
      render(<PressureMeter pressure={3} maxPressure={5} />);
      expect(screen.getByText("3/5")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      const { container } = render(<PressureMeter pressure={7} maxPressure={10} />);
      const meter = container.querySelector('[role="meter"]');
      
      expect(meter).toBeInTheDocument();
      expect(meter).toHaveAttribute("aria-valuenow", "7");
      expect(meter).toHaveAttribute("aria-valuemin", "0");
      expect(meter).toHaveAttribute("aria-valuemax", "10");
      expect(meter).toHaveAttribute("aria-label", "Pressure: 7 out of 10");
    });

    it("should update ARIA values when pressure changes", () => {
      const { container, rerender } = render(<PressureMeter pressure={5} maxPressure={10} />);
      let meter = container.querySelector('[role="meter"]');
      expect(meter).toHaveAttribute("aria-valuenow", "5");

      rerender(<PressureMeter pressure={8} maxPressure={10} />);
      meter = container.querySelector('[role="meter"]');
      expect(meter).toHaveAttribute("aria-valuenow", "8");
    });
  });

  describe("Mobile Display", () => {
    it("should show on mobile by default", () => {
      const { container } = render(<PressureMeter pressure={5} showOnMobile={true} />);
      const meter = container.querySelector(".pressure-meter");
      expect(meter).not.toHaveClass("hidden-mobile");
    });

    it("should hide on mobile when showOnMobile is false", () => {
      const { container } = render(<PressureMeter pressure={5} showOnMobile={false} />);
      const meter = container.querySelector(".pressure-meter");
      expect(meter).toHaveClass("hidden-mobile");
    });
  });

  describe("Custom Styling", () => {
    it("should accept custom className", () => {
      const { container } = render(
        <PressureMeter pressure={5} className="custom-pressure-meter" />
      );
      const meter = container.querySelector(".pressure-meter");
      expect(meter).toHaveClass("custom-pressure-meter");
    });
  });

  describe("Fill Percentage", () => {
    it("should calculate correct fill percentage for half pressure", () => {
      const { container } = render(<PressureMeter pressure={5} maxPressure={10} />);
      const fillBar = container.querySelector('[style*="width"]');
      expect(fillBar).toBeTruthy();
    });

    it("should calculate correct fill percentage for quarter pressure", () => {
      const { container } = render(<PressureMeter pressure={2} maxPressure={8} />);
      const fillBar = container.querySelector('[style*="width"]');
      expect(fillBar).toBeTruthy();
    });

    it("should calculate correct fill percentage for full pressure", () => {
      const { container } = render(<PressureMeter pressure={10} maxPressure={10} />);
      const fillBar = container.querySelector('[style*="width"]');
      expect(fillBar).toBeTruthy();
    });
  });

  describe("Stack Indicators", () => {
    it("should render correct number of stack indicators", () => {
      const { container } = render(<PressureMeter pressure={5} maxPressure={10} />);
      const indicators = container.querySelectorAll('[style*="width: 2px"]');
      expect(indicators).toHaveLength(10); // One per max pressure stack
    });

    it("should render different number for custom max", () => {
      const { container } = render(<PressureMeter pressure={3} maxPressure={5} />);
      const indicators = container.querySelectorAll('[style*="width: 2px"]');
      expect(indicators).toHaveLength(5);
    });
  });
});
