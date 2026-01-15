/**
 * Tests for TrainingStatsOverlayHtml component
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TrainingStatsOverlayHtml } from "./TrainingStatsOverlayHtml";
import { FONT_FAMILY } from "../../../../types/constants";

describe("TrainingStatsOverlayHtml", () => {
  const mockStats = {
    score: 1500,
    combo: 5,
    hits: 25,
    misses: 3,
    accuracy: 89.3,
  };

  it("should render without crashing", () => {
    render(
      <TrainingStatsOverlayHtml
        stats={mockStats}
        isMobile={false}
      />
    );

    expect(screen.getByTestId("training-stats-html")).toBeInTheDocument();
  });

  it("should render bilingual header text", () => {
    render(
      <TrainingStatsOverlayHtml
        stats={mockStats}
        isMobile={false}
      />
    );

    // Header uses formatBilingualText with pipe format
    expect(screen.getByText("훈련 통계 | Training Statistics")).toBeInTheDocument();
  });

  it("should display all stat labels in Korean and English", () => {
    render(
      <TrainingStatsOverlayHtml
        stats={mockStats}
        isMobile={false}
      />
    );

    // Check for Korean labels
    expect(screen.getByText("점수")).toBeInTheDocument();
    expect(screen.getByText("콤보")).toBeInTheDocument();
    expect(screen.getByText("성공")).toBeInTheDocument();
    expect(screen.getByText("실패")).toBeInTheDocument();
    expect(screen.getByText("정확도")).toBeInTheDocument();

    // Check for English labels
    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("Combo")).toBeInTheDocument();
    expect(screen.getByText("Hits")).toBeInTheDocument();
    expect(screen.getByText("Misses")).toBeInTheDocument();
    expect(screen.getByText("Accuracy")).toBeInTheDocument();
  });

  it("should display stat values correctly", () => {
    render(
      <TrainingStatsOverlayHtml
        stats={mockStats}
        isMobile={false}
      />
    );

    expect(screen.getByText("1,500")).toBeInTheDocument(); // Score with formatting
    expect(screen.getByText("5x")).toBeInTheDocument(); // Combo
    expect(screen.getByText("25")).toBeInTheDocument(); // Hits
    expect(screen.getByText("3")).toBeInTheDocument(); // Misses
    expect(screen.getByText("89.3%")).toBeInTheDocument(); // Accuracy
  });

  it("should apply Korean font family consistently throughout the component", () => {
    render(
      <TrainingStatsOverlayHtml
        stats={mockStats}
        isMobile={false}
      />
    );

    // The main container should use Korean font
    const mainContainer = screen.getByTestId("training-stats-html");
    const computedStyle = window.getComputedStyle(mainContainer);
    expect(computedStyle.fontFamily).toContain(FONT_FAMILY.KOREAN.split(",")[0].replace(/"/g, ""));
  });

  it("should use smaller width for mobile", () => {
    render(
      <TrainingStatsOverlayHtml
        stats={mockStats}
        isMobile={true}
      />
    );

    const mainContainer = screen.getByTestId("training-stats-html");
    expect(mainContainer).toHaveStyle({ width: "240px" });
  });

  it("should use wider width for desktop", () => {
    render(
      <TrainingStatsOverlayHtml
        stats={mockStats}
        isMobile={false}
      />
    );

    const mainContainer = screen.getByTestId("training-stats-html");
    expect(mainContainer).toHaveStyle({ width: "260px" });
  });
});

