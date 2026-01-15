/**
 * Tests for TrainingModeSelectorOverlayHtml component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TrainingModeSelectorOverlayHtml } from "./TrainingModeSelectorOverlayHtml";
import { FONT_FAMILY } from "../../../../types/constants";

describe("TrainingModeSelectorOverlayHtml", () => {
  it("should render without crashing", () => {
    render(
      <TrainingModeSelectorOverlayHtml
        currentMode="basics"
        onModeChange={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByTestId("training-mode-selector-html")).toBeInTheDocument();
  });

  it("should render bilingual header text", () => {
    render(
      <TrainingModeSelectorOverlayHtml
        currentMode="basics"
        onModeChange={vi.fn()}
        isMobile={false}
      />
    );

    // Header uses formatBilingualText with pipe format
    expect(screen.getByText("훈련 모드 | Training Mode")).toBeInTheDocument();
  });

  it("should render training mode options with bilingual labels", () => {
    render(
      <TrainingModeSelectorOverlayHtml
        currentMode="basics"
        onModeChange={vi.fn()}
        isMobile={false}
      />
    );

    // Check that Korean names are present (mode buttons display bilingual text)
    expect(screen.getByText(/기본 훈련/)).toBeInTheDocument();
    expect(screen.getByText(/Basic Training/)).toBeInTheDocument();
  });

  it("should call onModeChange when a mode button is clicked", () => {
    const mockOnModeChange = vi.fn();

    render(
      <TrainingModeSelectorOverlayHtml
        currentMode="basics"
        onModeChange={mockOnModeChange}
        isMobile={false}
      />
    );

    const advancedButton = screen.getByTestId("mode-advanced");
    fireEvent.click(advancedButton);

    expect(mockOnModeChange).toHaveBeenCalledWith("advanced");
  });

  it("should apply Korean font family consistently throughout the component", () => {
    const { container } = render(
      <TrainingModeSelectorOverlayHtml
        currentMode="basics"
        onModeChange={vi.fn()}
        isMobile={false}
      />
    );

    const mainContainer = screen.getByTestId("training-mode-selector-html");
    const computedStyle = window.getComputedStyle(mainContainer);
    expect(computedStyle.fontFamily).toContain(FONT_FAMILY.KOREAN.split(",")[0].replace(/"/g, ""));
  });

  it("should use mobile-optimized layout when isMobile is true", () => {
    render(
      <TrainingModeSelectorOverlayHtml
        currentMode="basics"
        onModeChange={vi.fn()}
        isMobile={true}
      />
    );

    const container = screen.getByTestId("training-mode-selector-html");
    expect(container).toHaveStyle({ width: "280px" });
  });

  it("should use desktop layout when isMobile is false", () => {
    render(
      <TrainingModeSelectorOverlayHtml
        currentMode="basics"
        onModeChange={vi.fn()}
        isMobile={false}
      />
    );

    const container = screen.getByTestId("training-mode-selector-html");
    expect(container).toHaveStyle({ width: "320px" });
  });

  it("should render all mode buttons with proper test IDs", () => {
    render(
      <TrainingModeSelectorOverlayHtml
        currentMode="basics"
        onModeChange={vi.fn()}
        isMobile={false}
      />
    );

    const modes = [
      "basics",
      "advanced",
      "free",
      "stance_training",
      "vital_point",
      "combo_practice",
      "footwork",
    ];

    modes.forEach((mode) => {
      expect(screen.getByTestId(`mode-${mode}`)).toBeInTheDocument();
    });
  });
});

