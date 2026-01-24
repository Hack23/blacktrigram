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
      archetype: "hacker",
      bodyPartHealth: {
        head: 100,
        torso: 100,
        leftArm: 100,
        rightArm: 100,
        leftLeg: 100,
        rightLeg: 100,
      },
    }),
    laterality: "southpaw" as const,
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

  it("should apply mobile layout when isMobile is true", () => {
    render(<CombatRightHUD {...defaultProps} isMobile={true} />);
    
    const rightHud = screen.getByTestId("combat-right-hud");
    // Mobile width: 18% of 1920 = 345.6px rounded to 346px
    expect(rightHud).toHaveStyle({ width: "346px" });
  });

  it("should apply desktop layout by default", () => {
    render(<CombatRightHUD {...defaultProps} />);
    
    const rightHud = screen.getByTestId("combat-right-hud");
    // Desktop width: 14% of 1920 = 268.8px rounded to 269px
    expect(rightHud).toHaveStyle({ width: "269px" });
  });

  it("should calculate available height correctly", () => {
    render(<CombatRightHUD {...defaultProps} height={1080} />);
    
    const rightHud = screen.getByTestId("combat-right-hud");
    // Available height = 1080 - topHud(70) - bottomHud(120) = 890px
    expect(rightHud).toHaveStyle({ height: "890px" });
  });

  it("should scale layout with positionScale", () => {
    render(<CombatRightHUD {...defaultProps} positionScale={1.5} />);
    
    const rightHud = screen.getByTestId("combat-right-hud");
    // Desktop top offset: 70 * 1.5 = 105px
    expect(rightHud).toHaveStyle({ top: "105px" });
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
