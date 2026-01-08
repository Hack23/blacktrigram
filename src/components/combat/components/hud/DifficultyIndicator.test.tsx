/**
 * DifficultyIndicator Component Tests
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DifficultyIndicator } from "./DifficultyIndicator";
import { DifficultyTier } from "../../../../systems/ai";

describe("DifficultyIndicator", () => {
  it("should render difficulty indicator", () => {
    render(<DifficultyIndicator tier={DifficultyTier.INTERMEDIATE} isMobile={false} />);
    
    expect(screen.getByTestId("difficulty-indicator")).toBeInTheDocument();
    expect(screen.getByTestId("difficulty-label")).toHaveTextContent("AI Difficulty");
  });

  it("should display beginner tier correctly", () => {
    render(<DifficultyIndicator tier={DifficultyTier.BEGINNER} isMobile={false} />);
    
    const tierElement = screen.getByTestId("difficulty-tier");
    expect(tierElement).toHaveTextContent("초보 | Beginner");
  });

  it("should display novice tier correctly", () => {
    render(<DifficultyIndicator tier={DifficultyTier.NOVICE} isMobile={false} />);
    
    const tierElement = screen.getByTestId("difficulty-tier");
    expect(tierElement).toHaveTextContent("입문 | Novice");
  });

  it("should display intermediate tier correctly", () => {
    render(<DifficultyIndicator tier={DifficultyTier.INTERMEDIATE} isMobile={false} />);
    
    const tierElement = screen.getByTestId("difficulty-tier");
    expect(tierElement).toHaveTextContent("중급 | Intermediate");
  });

  it("should display advanced tier correctly", () => {
    render(<DifficultyIndicator tier={DifficultyTier.ADVANCED} isMobile={false} />);
    
    const tierElement = screen.getByTestId("difficulty-tier");
    expect(tierElement).toHaveTextContent("고급 | Advanced");
  });

  it("should display expert tier correctly", () => {
    render(<DifficultyIndicator tier={DifficultyTier.EXPERT} isMobile={false} />);
    
    const tierElement = screen.getByTestId("difficulty-tier");
    expect(tierElement).toHaveTextContent("전문 | Expert");
  });

  it("should apply mobile styles when isMobile is true", () => {
    render(<DifficultyIndicator tier={DifficultyTier.INTERMEDIATE} isMobile={true} />);
    
    const indicator = screen.getByTestId("difficulty-indicator");
    expect(indicator).toHaveStyle({ fontSize: "11px" });
  });

  it("should apply desktop styles when isMobile is false", () => {
    render(<DifficultyIndicator tier={DifficultyTier.INTERMEDIATE} isMobile={false} />);
    
    const indicator = screen.getByTestId("difficulty-indicator");
    expect(indicator).toHaveStyle({ fontSize: "13px" });
  });

  it("should have correct color for beginner tier", () => {
    render(<DifficultyIndicator tier={DifficultyTier.BEGINNER} isMobile={false} />);
    
    const indicator = screen.getByTestId("difficulty-indicator");
    // Browser converts hex to rgb format (POSITIVE_GREEN = 0x00ff00 → rgb(0, 255, 0))
    expect(indicator.style.color).toBe("rgb(0, 255, 0)");
    expect(indicator.style.border).toContain("rgb(0, 255, 0)");
  });

  it("should have correct color for expert tier", () => {
    render(<DifficultyIndicator tier={DifficultyTier.EXPERT} isMobile={false} />);
    
    const indicator = screen.getByTestId("difficulty-indicator");
    // Browser converts hex to rgb format (NEGATIVE_RED = 0xff0000 → rgb(255, 0, 0))
    expect(indicator.style.color).toBe("rgb(255, 0, 0)");
    expect(indicator.style.border).toContain("rgb(255, 0, 0)");
  });
});
