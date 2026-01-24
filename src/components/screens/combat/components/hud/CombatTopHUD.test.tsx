/**
 * Tests for CombatTopHUD component
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CombatTopHUD } from "./CombatTopHUD";
import type { UseCombatTimerReturn } from "../../../../../hooks/useCombatTimer";

// Mock timer state
const mockTimerState: UseCombatTimerReturn = {
  timeRemaining: 90,
  formattedTime: "1:30",
  warningLevel: "none",
  isTimeUp: false,
  startTimer: vi.fn(),
  pauseTimer: vi.fn(),
  resetTimer: vi.fn(),
  addTime: vi.fn(),
};

describe("CombatTopHUD", () => {
  const defaultProps = {
    width: 1920,
    isMobile: false,
    positionScale: 1,
    currentRound: 1,
    totalRounds: 3,
    timerState: mockTimerState,
    showTimer: true,
    onReturnToMenu: vi.fn(),
    isPaused: false,
  };

  it("should render with correct test id", () => {
    render(<CombatTopHUD {...defaultProps} />);
    
    expect(screen.getByTestId("combat-top-hud")).toBeInTheDocument();
  });

  it("should display round information", () => {
    render(<CombatTopHUD {...defaultProps} />);
    
    expect(screen.getByText("전투 | Combat")).toBeInTheDocument();
    expect(screen.getByText("라운드 1/3")).toBeInTheDocument();
  });

  it("should display timer when showTimer is true", () => {
    render(<CombatTopHUD {...defaultProps} />);
    
    expect(screen.getByTestId("combat-top-hud-center-section")).toBeInTheDocument();
  });

  it("should not display timer when showTimer is false", () => {
    render(<CombatTopHUD {...defaultProps} showTimer={false} />);
    
    // Timer component won't be rendered
    const centerSection = screen.getByTestId("combat-top-hud-center-section");
    expect(centerSection.children.length).toBe(0);
  });

  it("should render return to menu button", () => {
    render(<CombatTopHUD {...defaultProps} />);
    
    expect(screen.getByTestId("combat-top-hud-right-section")).toBeInTheDocument();
  });

  it("should handle different rounds", () => {
    const { rerender } = render(<CombatTopHUD {...defaultProps} currentRound={2} />);
    expect(screen.getByText("라운드 2/3")).toBeInTheDocument();

    rerender(<CombatTopHUD {...defaultProps} currentRound={3} />);
    expect(screen.getByText("라운드 3/3")).toBeInTheDocument();
  });

  it("should apply mobile layout when isMobile is true", () => {
    render(<CombatTopHUD {...defaultProps} isMobile={true} />);
    
    const topHud = screen.getByTestId("combat-top-hud");
    // Mobile height should be 55px
    expect(topHud).toHaveStyle({ height: "55px" });
  });

  it("should apply desktop layout by default", () => {
    render(<CombatTopHUD {...defaultProps} />);
    
    const topHud = screen.getByTestId("combat-top-hud");
    // Desktop height should be 70px
    expect(topHud).toHaveStyle({ height: "70px" });
  });

  it("should scale layout with positionScale", () => {
    render(<CombatTopHUD {...defaultProps} positionScale={1.5} />);
    
    const topHud = screen.getByTestId("combat-top-hud");
    // Desktop height * positionScale = 70 * 1.5 = 105px
    expect(topHud).toHaveStyle({ height: "105px" });
  });
});
