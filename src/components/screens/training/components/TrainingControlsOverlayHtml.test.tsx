/**
 * Tests for TrainingControlsOverlayHtml component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TrainingControlsOverlayHtml } from "./TrainingControlsOverlayHtml";
import { FONT_FAMILY } from "../../../../types/constants";

describe("TrainingControlsOverlayHtml", () => {
  it("should render without crashing", () => {
    render(
      <TrainingControlsOverlayHtml
        isTraining={false}
        onStartTraining={vi.fn()}
        onStopTraining={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByTestId("training-controls-html")).toBeInTheDocument();
  });

  it("should render bilingual status text", () => {
    render(
      <TrainingControlsOverlayHtml
        isTraining={false}
        onStartTraining={vi.fn()}
        onStopTraining={vi.fn()}
        isMobile={false}
      />
    );

    // Status uses formatBilingualText with pipe format
    expect(screen.getByText("훈련 대기 | Training Stopped")).toBeInTheDocument();
  });

  it("should show start button with bilingual text when not training", () => {
    render(
      <TrainingControlsOverlayHtml
        isTraining={false}
        onStartTraining={vi.fn()}
        onStopTraining={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByText("시작 | Start")).toBeInTheDocument();
  });

  it("should show stop button with bilingual text when training", () => {
    render(
      <TrainingControlsOverlayHtml
        isTraining={true}
        onStartTraining={vi.fn()}
        onStopTraining={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByText("중지 | Stop")).toBeInTheDocument();
  });

  it("should call onStartTraining when start button is clicked", () => {
    const mockStart = vi.fn();

    render(
      <TrainingControlsOverlayHtml
        isTraining={false}
        onStartTraining={mockStart}
        onStopTraining={vi.fn()}
        isMobile={false}
      />
    );

    const button = screen.getByTestId("training-toggle-button");
    fireEvent.click(button);

    expect(mockStart).toHaveBeenCalledTimes(1);
  });

  it("should call onStopTraining when stop button is clicked", () => {
    const mockStop = vi.fn();

    render(
      <TrainingControlsOverlayHtml
        isTraining={true}
        onStartTraining={vi.fn()}
        onStopTraining={mockStop}
        isMobile={false}
      />
    );

    const button = screen.getByTestId("training-toggle-button");
    fireEvent.click(button);

    expect(mockStop).toHaveBeenCalledTimes(1);
  });

  it("should display info text only when training is inactive", () => {
    const { rerender } = render(
      <TrainingControlsOverlayHtml
        isTraining={false}
        onStartTraining={vi.fn()}
        onStopTraining={vi.fn()}
        isMobile={false}
      />
    );

    // Info text is displayed when inactive
    expect(screen.getByText("모드 변경시 자동 재시작")).toBeInTheDocument();
    expect(screen.getByText("Auto-restarts on mode change")).toBeInTheDocument();

    rerender(
      <TrainingControlsOverlayHtml
        isTraining={true}
        onStartTraining={vi.fn()}
        onStopTraining={vi.fn()}
        isMobile={false}
      />
    );

    // Info text is hidden when active
    expect(screen.queryByText("모드 변경시 자동 재시작")).not.toBeInTheDocument();
    expect(screen.queryByText("Auto-restarts on mode change")).not.toBeInTheDocument();
  });

  it("should apply Korean font family consistently throughout the component", () => {
    const { container } = render(
      <TrainingControlsOverlayHtml
        isTraining={false}
        onStartTraining={vi.fn()}
        onStopTraining={vi.fn()}
        isMobile={false}
      />
    );

    const mainContainer = screen.getByTestId("training-controls-html");
    const computedStyle = window.getComputedStyle(mainContainer);
    expect(computedStyle.fontFamily).toContain(FONT_FAMILY.KOREAN.split(",")[0].replace(/"/g, ""));
  });

  it("should use mobile-optimized layout when isMobile is true", () => {
    render(
      <TrainingControlsOverlayHtml
        isTraining={false}
        onStartTraining={vi.fn()}
        onStopTraining={vi.fn()}
        isMobile={true}
      />
    );

    const container = screen.getByTestId("training-controls-html");
    expect(container).toHaveStyle({ width: "200px" });
  });

  it("should use desktop layout when isMobile is false", () => {
    render(
      <TrainingControlsOverlayHtml
        isTraining={false}
        onStartTraining={vi.fn()}
        onStopTraining={vi.fn()}
        isMobile={false}
      />
    );

    const container = screen.getByTestId("training-controls-html");
    expect(container).toHaveStyle({ width: "220px" });
  });

  it("should show appropriate status text based on training state", () => {
    const { rerender } = render(
      <TrainingControlsOverlayHtml
        isTraining={false}
        onStartTraining={vi.fn()}
        onStopTraining={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByText("훈련 대기 | Training Stopped")).toBeInTheDocument();

    rerender(
      <TrainingControlsOverlayHtml
        isTraining={true}
        onStartTraining={vi.fn()}
        onStopTraining={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByText("훈련 진행중 | Training Active")).toBeInTheDocument();
  });
});

