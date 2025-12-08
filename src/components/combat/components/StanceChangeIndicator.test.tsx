/**
 * Unit tests for StanceChangeIndicator component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { StanceChangeIndicator } from "./StanceChangeIndicator";
import React from "react";

// Mock Html from @react-three/drei
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("StanceChangeIndicator", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not render when stance has not changed", () => {
    render(
      <StanceChangeIndicator currentStance={0} previousStance={0} />
    );

    expect(screen.queryByTestId("stance-change-indicator")).not.toBeInTheDocument();
  });

  it("should render when stance changes", () => {
    const { rerender } = render(
      <StanceChangeIndicator currentStance={0} previousStance={0} />
    );

    // Change stance
    rerender(
      <StanceChangeIndicator currentStance={1} previousStance={0} />
    );

    expect(screen.getByTestId("stance-change-indicator")).toBeInTheDocument();
  });

  it("should display Korean and English stance names", () => {
    render(
      <StanceChangeIndicator currentStance={1} previousStance={0} />
    );

    const indicator = screen.getByTestId("stance-change-indicator");
    expect(indicator).toBeInTheDocument();

    // Check for Korean text (태 - Tae/Lake)
    expect(indicator.textContent).toContain("태");
    expect(indicator.textContent).toContain("Lake");
  });

  it.todo("should hide after duration expires", async () => {
    // TODO: Fix timer-based test
    const duration = 1000;
    render(
      <StanceChangeIndicator
        currentStance={1}
        previousStance={0}
        duration={duration}
      />
    );

    expect(screen.getByTestId("stance-change-indicator")).toBeInTheDocument();

    // Fast-forward past duration
    vi.advanceTimersByTime(duration + 100);

    await waitFor(() => {
      expect(
        screen.queryByTestId("stance-change-indicator")
      ).not.toBeInTheDocument();
    });
  });

  it("should adapt to mobile layout", () => {
    render(
      <StanceChangeIndicator
        currentStance={1}
        previousStance={0}
        isMobile={true}
      />
    );

    const indicator = screen.getByTestId("stance-change-indicator");
    expect(indicator).toBeInTheDocument();

    // Check that mobile styles are applied (fontSize should be smaller)
    const textElement = indicator.querySelector("div");
    expect(textElement).toHaveStyle({ fontSize: "24px" });
  });

  it("should show all 8 trigram stances correctly", () => {
    const stanceNames = [
      "건", // Heaven
      "태", // Lake
      "리", // Fire
      "진", // Thunder
      "손", // Wind
      "감", // Water
      "간", // Mountain
      "곤", // Earth
    ];

    stanceNames.forEach((koreanName, index) => {
      const { unmount } = render(
        <StanceChangeIndicator currentStance={index} previousStance={-1} />
      );

      const indicator = screen.getByTestId("stance-change-indicator");
      expect(indicator.textContent).toContain(koreanName);

      unmount();
    });
  });

  it("should include trigram symbol", () => {
    render(
      <StanceChangeIndicator currentStance={0} previousStance={-1} />
    );

    const indicator = screen.getByTestId("stance-change-indicator");
    // Heaven trigram symbol ☰
    expect(indicator.textContent).toContain("☰");
  });

  it.todo("should reset timer on rapid stance changes", async () => {
    // TODO: Fix timer-based test
    const duration = 1000;
    const { rerender } = render(
      <StanceChangeIndicator
        currentStance={1}
        previousStance={0}
        duration={duration}
      />
    );

    expect(screen.getByTestId("stance-change-indicator")).toBeInTheDocument();

    // Advance time partially
    vi.advanceTimersByTime(500);

    // Change stance again (should reset timer)
    rerender(
      <StanceChangeIndicator
        currentStance={2}
        previousStance={1}
        duration={duration}
      />
    );

    // Advance time by the original duration from first change
    vi.advanceTimersByTime(600);

    // Should still be visible (timer was reset)
    expect(screen.getByTestId("stance-change-indicator")).toBeInTheDocument();

    // Now advance past the full duration from second change
    vi.advanceTimersByTime(500);

    await waitFor(() => {
      expect(
        screen.queryByTestId("stance-change-indicator")
      ).not.toBeInTheDocument();
    });
  });
});
