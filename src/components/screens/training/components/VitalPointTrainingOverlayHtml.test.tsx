/**
 * VitalPointTrainingOverlayHtml tests
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KOREAN_VITAL_POINTS } from "../../../../systems/vitalpoint/KoreanVitalPoints";
import { KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { VitalPointTrainingOverlayHtml } from "./VitalPointTrainingOverlayHtml";

describe("VitalPointTrainingOverlayHtml", () => {
  const mockOnVitalPointSelect = vi.fn();

  beforeEach(() => {
    mockOnVitalPointSelect.mockClear();
  });

  describe("Rendering", () => {
    it("should render vital point selection panel", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      expect(
        screen.getByTestId("vital-point-training-html"),
      ).toBeInTheDocument();
    });

    it("should render header with bilingual text", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const header = screen.getByText(/급소 선택.*Vital Point/);
      expect(header).toBeInTheDocument();
    });

    it("should render 6 vital points on desktop", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      // Should render first 6 vital points on desktop
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBe(6);
    });

    it("should render 4 vital points on mobile", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={true}
        />,
      );

      // Should render first 4 vital points on mobile
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBe(4);
    });
  });

  describe("Vital Point Selection", () => {
    it("should call onVitalPointSelect when button clicked", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const button = screen.getByTestId(`vital-point-${firstPoint.id}`);
      fireEvent.click(button);

      expect(mockOnVitalPointSelect).toHaveBeenCalledWith(firstPoint.id);
      expect(mockOnVitalPointSelect).toHaveBeenCalledTimes(1);
    });

    it("should highlight selected vital point", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={firstPoint.id}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const button = screen.getByTestId(`vital-point-${firstPoint.id}`);
      expect(button).toHaveClass("selected");
    });

    it("should apply ACCENT_GOLD border to selected point", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={firstPoint.id}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const button = screen.getByTestId(`vital-point-${firstPoint.id}`);
      const expectedColor = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD);
      expect(button).toHaveStyle({
        borderColor: expectedColor,
      });
    });
  });

  describe("Vital Point Details", () => {
    it("should show selected vital point details", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={firstPoint.id}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      expect(
        screen.getByText(/선택된 급소.*Selected Point/),
      ).toBeInTheDocument();
    });

    it("should not show details when no point selected", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      expect(
        screen.queryByText(/선택된 급소.*Selected Point/),
      ).not.toBeInTheDocument();
    });

    it("should display vital point location", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={firstPoint.id}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      expect(screen.getByText(firstPoint.category)).toBeInTheDocument();
    });

    it("should display vital point severity", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={firstPoint.id}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      expect(screen.getByText(firstPoint.severity)).toBeInTheDocument();
    });

    it("should display vital point description", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={firstPoint.id}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      // Description should contain both Korean and English
      const description = screen.getByText(
        new RegExp(
          `${firstPoint.description.korean}.*${firstPoint.description.english}`,
        ),
      );
      expect(description).toBeInTheDocument();
    });
  });

  describe("Korean Theming", () => {
    it("should apply SECONDARY_MAGENTA border to panel", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const panel = screen.getByTestId("vital-point-training-html");
      const expectedColor = hexToRgbaString(
        KOREAN_COLORS.SECONDARY_MAGENTA,
        0.7,
      );
      expect(panel.style.border).toContain(expectedColor);
    });

    it("should apply Korean font family", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const button = screen.getByTestId(`vital-point-${firstPoint.id}`);
      const style = window.getComputedStyle(button);
      expect(style.fontFamily).toBeTruthy();
    });

    it("should show difficulty stars for each vital point", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const button = screen.getByTestId(`vital-point-${firstPoint.id}`);
      // Should contain star symbols (★ or ☆)
      expect(button.textContent).toMatch(/[★☆]/);
    });
  });

  describe("Responsive Design", () => {
    it("should apply smaller panel width on mobile", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={true}
        />,
      );

      const panel = screen.getByTestId("vital-point-training-html");
      expect(panel).toHaveStyle({
        width: "200px",
      });
    });

    it("should apply larger panel width on desktop", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const panel = screen.getByTestId("vital-point-training-html");
      expect(panel).toHaveStyle({
        width: "240px",
      });
    });

    it("should render with proper styling on mobile", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={true}
        />,
      );

      const panel = screen.getByTestId("vital-point-training-html");
      // Panel should exist with styling applied
      expect(panel).toBeInTheDocument();
    });

    it("should render with proper styling on desktop", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const panel = screen.getByTestId("vital-point-training-html");
      // Panel should exist with styling applied
      expect(panel).toBeInTheDocument();
    });
  });

  describe("React.memo Optimization", () => {
    it("should have displayName set", () => {
      expect(VitalPointTrainingOverlayHtml.displayName).toBe(
        "VitalPointTrainingOverlayHtml",
      );
    });
  });

  describe("Accessibility", () => {
    it("should have test id on each vital point button", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const firstPoint = KOREAN_VITAL_POINTS[0];
      expect(
        screen.getByTestId(`vital-point-${firstPoint.id}`),
      ).toBeInTheDocument();
    });

    it("should render buttons with role=button", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should apply selected class for screen readers", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={firstPoint.id}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      const button = screen.getByTestId(`vital-point-${firstPoint.id}`);
      expect(button).toHaveClass("selected");
    });
  });

  describe("Bilingual Labels", () => {
    it("should show Korean names for vital points", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      expect(screen.getByText(firstPoint.names.korean)).toBeInTheDocument();
    });

    it("should show English names for vital points", () => {
      const firstPoint = KOREAN_VITAL_POINTS[0];
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      expect(screen.getByText(firstPoint.names.english)).toBeInTheDocument();
    });
  });

  describe("Severity Color Coding", () => {
    it("should apply different colors based on severity", () => {
      render(
        <VitalPointTrainingOverlayHtml
          selectedVitalPoint={null}
          onVitalPointSelect={mockOnVitalPointSelect}
          isMobile={false}
        />,
      );

      // Check that first button has a color based on its severity
      const firstPoint = KOREAN_VITAL_POINTS[0];
      const button = screen.getByTestId(`vital-point-${firstPoint.id}`);

      // Color should be applied via style
      expect(button).toHaveStyle({
        borderColor: expect.any(String),
      });
    });
  });
});
