/**
 * LeftHUD Component Tests
 *
 * Tests for the left-side HUD container component.
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LeftHUD } from "./LeftHUD";
import { PlayerArchetype, TrigramStance } from "../../../../../types";
import { createPlayerFromArchetype } from "../../../../../utils/playerUtils";

describe("LeftHUD", () => {
  const mockPlayer = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  const mockSpeedModifiers = {
    finalSpeed: 6.0,
    baseSpeed: 6.0,
  };

  it("should render without crashing", () => {
    render(
      <LeftHUD
        player={mockPlayer}
        currentStance={TrigramStance.GEON}
        isInGuard={false}
        laterality="orthodox"
        speedModifiers={mockSpeedModifiers}
        isMobile={false}
      />
    );

    // Component renders (no crash)
    expect(document.body).toBeTruthy();
  });

  it("should render PlayerHUD with correct props", () => {
    render(
      <LeftHUD
        player={mockPlayer}
        currentStance={TrigramStance.GEON}
        isInGuard={false}
        laterality="orthodox"
        speedModifiers={mockSpeedModifiers}
        isMobile={false}
      />
    );

    // PlayerHUD should be rendered with player data
    expect(screen.getByTestId("player-hud-left")).toBeInTheDocument();
  });

  it("should render GuardIndicator", () => {
    render(
      <LeftHUD
        player={mockPlayer}
        currentStance={TrigramStance.GEON}
        isInGuard={true}
        laterality="orthodox"
        speedModifiers={mockSpeedModifiers}
        isMobile={false}
      />
    );

    // GuardIndicator should be rendered
    expect(screen.getByTestId("guard-indicator-left")).toBeInTheDocument();
  });

  it("should render SpeedIndicatorHUD when showSpeedIndicator is true", () => {
    render(
      <LeftHUD
        player={mockPlayer}
        currentStance={TrigramStance.GEON}
        isInGuard={false}
        laterality="orthodox"
        speedModifiers={mockSpeedModifiers}
        isMobile={false}
        showSpeedIndicator={true}
      />
    );

    // SpeedIndicatorHUD should be rendered
    expect(screen.getByTestId("speed-indicator-left")).toBeInTheDocument();
  });

  it("should not render SpeedIndicatorHUD when showSpeedIndicator is false", () => {
    render(
      <LeftHUD
        player={mockPlayer}
        currentStance={TrigramStance.GEON}
        isInGuard={false}
        laterality="orthodox"
        speedModifiers={mockSpeedModifiers}
        isMobile={false}
        showSpeedIndicator={false}
      />
    );

    // SpeedIndicatorHUD should not be rendered
    expect(screen.queryByTestId("speed-indicator-left")).not.toBeInTheDocument();
  });

  it("should render BodyPartHealthDisplay when bodyPartHealth is provided", () => {
    const playerWithBodyParts = {
      ...mockPlayer,
      bodyPartHealth: {
        head: 100,
        torso: 100,
        armLeft: 100,
        armRight: 100,
        legLeft: 100,
        legRight: 100,
        handLeft: 100,
        handRight: 100,
      },
    };

    render(
      <LeftHUD
        player={playerWithBodyParts}
        currentStance={TrigramStance.GEON}
        isInGuard={false}
        laterality="orthodox"
        speedModifiers={mockSpeedModifiers}
        bodyPartHealth={playerWithBodyParts.bodyPartHealth}
        isMobile={false}
      />
    );

    // BodyPartHealthDisplay should be rendered
    expect(screen.getByTestId(`body-part-health-${mockPlayer.id}`)).toBeInTheDocument();
  });

  it("should not render BodyPartHealthDisplay when bodyPartHealth is not provided", () => {
    render(
      <LeftHUD
        player={mockPlayer}
        currentStance={TrigramStance.GEON}
        isInGuard={false}
        laterality="orthodox"
        speedModifiers={mockSpeedModifiers}
        isMobile={false}
      />
    );

    // BodyPartHealthDisplay should not be rendered
    expect(screen.queryByTestId(`body-part-health-${mockPlayer.id}`)).not.toBeInTheDocument();
  });

  it("should adapt to mobile layout", () => {
    render(
      <LeftHUD
        player={mockPlayer}
        currentStance={TrigramStance.GEON}
        isInGuard={false}
        laterality="orthodox"
        speedModifiers={mockSpeedModifiers}
        isMobile={true}
      />
    );

    // All components should render in mobile mode
    expect(screen.getByTestId("player-hud-left")).toBeInTheDocument();
    expect(screen.getByTestId("guard-indicator-left")).toBeInTheDocument();
  });
});
