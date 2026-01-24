/**
 * Tests for CombatRightHUD component
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createMockPlayerState } from "../../../../../test/test-utils";
import { CombatRightHUD } from "./CombatRightHUD";

describe("CombatRightHUD", () => {
  const defaultProps = {
    width: 1920,
    height: 1080,
    isMobile: false,
    positionScale: 1,
    player: createMockPlayerState({
      name: { korean: "AI", english: "AI" },
      bodyPartHealth: {
        head: 100,
        neck: 100,
        torsoUpper: 100,
        torsoLower: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
      },
    }),
    laterality: "right" as const,
    difficultyTier: 3,
    speedModifiers: {
      finalSpeed: 1.0,
      baseSpeed: 1.0,
    },
  };

  it("should render with correct test id", () => {
    render(<CombatRightHUD {...defaultProps} />);
    
    expect(screen.getByTestId("combat-right-hud")).toBeInTheDocument();
  });

  it("should render all sections including difficulty indicator", () => {
    render(<CombatRightHUD {...defaultProps} />);
    
    expect(screen.getByTestId("combat-right-hud-player-section")).toBeInTheDocument();
    expect(screen.getByTestId("combat-right-hud-difficulty-section")).toBeInTheDocument();
    expect(screen.getByTestId("combat-right-hud-speed-section")).toBeInTheDocument();
    expect(screen.getByTestId("combat-right-hud-bodypart-section")).toBeInTheDocument();
  });

  it("should position correctly on the right side", () => {
    render(<CombatRightHUD {...defaultProps} />);
    
    const rightHud = screen.getByTestId("combat-right-hud");
    expect(rightHud).toHaveStyle({ position: "absolute", right: "0" });
  });

  it("should use resolution-based width sizing (isMobile only affects theme, not sizing)", () => {
    // At 1920px width, resolution-based sizing uses desktop value (14%) regardless of isMobile flag
    render(<CombatRightHUD {...defaultProps} isMobile={true} />);
    
    const rightHud = screen.getByTestId("combat-right-hud");
    // Resolution-based width at 1920px: 14% = 268.8px rounded to 269px
    expect(rightHud).toHaveStyle({ width: "269px" });
  });

  it("should apply desktop layout by default", () => {
    render(<CombatRightHUD {...defaultProps} />);
    
    const rightHud = screen.getByTestId("combat-right-hud");
    // Desktop width: 14% of 1920 = 268.8px rounded to 269px
    expect(rightHud).toHaveStyle({ width: "269px" });
  });

  it("should calculate available height correctly with resolution-based sizing", () => {
    render(<CombatRightHUD {...defaultProps} height={1080} />);
    
    const rightHud = screen.getByTestId("combat-right-hud");
    // Combat context: top ~8% (86.4px), bottom ~12% (129.6px)
    // Available height = 1080 - 86.4 - 129.6 = 864px (with clamping gives 873.6px)
    expect(rightHud).toHaveStyle({ height: "873.6px" });
  });

  it("should scale layout with positionScale", () => {
    render(<CombatRightHUD {...defaultProps} positionScale={1.5} />);
    
    const rightHud = screen.getByTestId("combat-right-hud");
    // Combat top offset: getHUDHeight(1080, 0.08) * 1.5 = 86.4 * 1.5 = 129.6px
    const topValue = parseFloat(rightHud.style.top || "0");
    expect(topValue).toBeCloseTo(129.6, 1);
  });

  it("should not render body part health when not available", () => {
    const playerWithoutBodyParts = createMockPlayerState({
      bodyPartHealth: undefined,
    });
    render(<CombatRightHUD {...defaultProps} player={playerWithoutBodyParts} />);
    
    expect(screen.queryByTestId("combat-right-hud-bodypart-section")).not.toBeInTheDocument();
  });

  it("should handle different difficulty tiers", () => {
    const { rerender } = render(<CombatRightHUD {...defaultProps} difficultyTier={1} />);
    expect(screen.getByTestId("combat-right-hud-difficulty-section")).toBeInTheDocument();

    rerender(<CombatRightHUD {...defaultProps} difficultyTier={5} />);
    expect(screen.getByTestId("combat-right-hud-difficulty-section")).toBeInTheDocument();
  });
});
