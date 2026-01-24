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
};

describe("CombatTopHUD", () => {
  const defaultProps = {
    width: 1920,
    height: 1080,
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

  it("should use resolution-based height (narrow screen)", () => {
    render(<CombatTopHUD {...defaultProps} width={400} height={800} />);
    
    const topHud = screen.getByTestId("combat-top-hud");
    // Height = getHUDHeight(800, 0.06) * 1.0 = 48px (6% of 800)
    expect(topHud).toHaveStyle({ height: "48px" });
  });

  it("should use resolution-based height (desktop)", () => {
    render(<CombatTopHUD {...defaultProps} />);
    
    const topHud = screen.getByTestId("combat-top-hud");
    // Height = getHUDHeight(1080, 0.06) * 1.0 = 64.8px (6% of 1080)
    expect(topHud).toHaveStyle({ height: "64.8px" });
  });

  it("should scale layout with positionScale", () => {
    render(<CombatTopHUD {...defaultProps} positionScale={1.5} />);
    
    const topHud = screen.getByTestId("combat-top-hud");
    // Height = getHUDHeight(1080, 0.06) * 1.5 = 97.19999999999999px
    expect(topHud).toHaveStyle({ height: "97.19999999999999px" });
  });
});
