/**
 * Tests for CombatLeftHUD component
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createMockPlayerState } from "../../../../../test/test-utils";
import { CombatLeftHUD } from "./CombatLeftHUD";

describe("CombatLeftHUD", () => {
  const defaultProps = {
    width: 1920,
    height: 1080,
    isMobile: false,
    positionScale: 1,
    player: createMockPlayerState({
      name: { korean: "무사", english: "Warrior" },
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
    laterality: "left" as const,
    isInGuard: false,
    speedModifiers: {
      finalSpeed: 1.0,
      baseSpeed: 1.0,
    },
  };

  it("should render with correct test id", () => {
    render(<CombatLeftHUD {...defaultProps} />);
    
    expect(screen.getByTestId("combat-left-hud")).toBeInTheDocument();
  });

  it("should render all sections", () => {
    render(<CombatLeftHUD {...defaultProps} />);
    
    expect(screen.getByTestId("combat-left-hud-player-section")).toBeInTheDocument();
    expect(screen.getByTestId("combat-left-hud-speed-section")).toBeInTheDocument();
    expect(screen.getByTestId("combat-left-hud-bodypart-section")).toBeInTheDocument();
    expect(screen.getByTestId("combat-left-hud-guard-section")).toBeInTheDocument();
  });

  it("should position correctly on the left side", () => {
    render(<CombatLeftHUD {...defaultProps} />);
    
    const leftHud = screen.getByTestId("combat-left-hud");
    expect(leftHud).toHaveStyle({ position: "absolute", left: "0" });
  });

  it("should apply mobile layout when isMobile is true", () => {
    render(<CombatLeftHUD {...defaultProps} isMobile={true} />);
    
    const leftHud = screen.getByTestId("combat-left-hud");
    // Mobile width: 18% of 1920 = 345.6px rounded to 346px
    expect(leftHud).toHaveStyle({ width: "346px" });
  });

  it("should apply desktop layout by default", () => {
    render(<CombatLeftHUD {...defaultProps} />);
    
    const leftHud = screen.getByTestId("combat-left-hud");
    // Desktop width: 14% of 1920 = 268.8px rounded to 269px
    expect(leftHud).toHaveStyle({ width: "269px" });
  });

  it("should calculate available height correctly", () => {
    render(<CombatLeftHUD {...defaultProps} height={1080} />);
    
    const leftHud = screen.getByTestId("combat-left-hud");
    // Available height = 1080 - topHud(70) - bottomHud(120) = 890px
    expect(leftHud).toHaveStyle({ height: "890px" });
  });

  it("should scale layout with positionScale", () => {
    render(<CombatLeftHUD {...defaultProps} positionScale={1.5} />);
    
    const leftHud = screen.getByTestId("combat-left-hud");
    // Desktop top offset: 70 * 1.5 = 105px
    expect(leftHud).toHaveStyle({ top: "105px" });
  });

  it("should not render body part health when not available", () => {
    const playerWithoutBodyParts = createMockPlayerState({
      bodyPartHealth: undefined,
    });
    render(<CombatLeftHUD {...defaultProps} player={playerWithoutBodyParts} />);
    
    expect(screen.queryByTestId("combat-left-hud-bodypart-section")).not.toBeInTheDocument();
  });
});
