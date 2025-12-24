/**
 * Tests for BodyPartHealthDisplay component
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BodyPartHealthDisplay } from "./BodyPartHealthDisplay";
import { BodyPart, BodyPartHealth } from "../../../systems/bodypart/types";

describe("BodyPartHealthDisplay", () => {
  const mockBodyPartHealth: BodyPartHealth = {
    [BodyPart.HEAD]: 100,
    [BodyPart.NECK]: 90,
    [BodyPart.TORSO_UPPER]: 80,
    [BodyPart.TORSO_LOWER]: 70,
    [BodyPart.ARM_LEFT]: 60,
    [BodyPart.ARM_RIGHT]: 50,
    [BodyPart.LEG_LEFT]: 40,
    [BodyPart.LEG_RIGHT]: 30,
  };

  it("should render all 8 body parts", () => {
    render(
      <BodyPartHealthDisplay
        bodyPartHealth={mockBodyPartHealth}
        playerId="player-1"
        position="left"
        isMobile={false}
      />
    );

    // Check that component renders
    const display = screen.getByTestId("body-part-health-player-1");
    expect(display).toBeInTheDocument();

    // Check that all body parts are present
    expect(screen.getByTestId("body-part-player-1-head")).toBeInTheDocument();
    expect(screen.getByTestId("body-part-player-1-neck")).toBeInTheDocument();
    expect(screen.getByTestId("body-part-player-1-torsoUpper")).toBeInTheDocument();
    expect(screen.getByTestId("body-part-player-1-torsoLower")).toBeInTheDocument();
    expect(screen.getByTestId("body-part-player-1-armLeft")).toBeInTheDocument();
    expect(screen.getByTestId("body-part-player-1-armRight")).toBeInTheDocument();
    expect(screen.getByTestId("body-part-player-1-legLeft")).toBeInTheDocument();
    expect(screen.getByTestId("body-part-player-1-legRight")).toBeInTheDocument();
  });

  it("should display bilingual labels", () => {
    render(
      <BodyPartHealthDisplay
        bodyPartHealth={mockBodyPartHealth}
        playerId="player-1"
        position="left"
        isMobile={false}
      />
    );

    // Check for Korean and English labels
    expect(screen.getByText(/신체 \| Body Parts/i)).toBeInTheDocument();
    expect(screen.getByText(/상체 \| Upper/i)).toBeInTheDocument();
    expect(screen.getByText(/팔 \| Arms/i)).toBeInTheDocument();
    expect(screen.getByText(/다리 \| Legs/i)).toBeInTheDocument();
  });

  it("should display health percentages", () => {
    render(
      <BodyPartHealthDisplay
        bodyPartHealth={mockBodyPartHealth}
        playerId="player-1"
        position="left"
        isMobile={false}
      />
    );

    // Check for percentage displays
    expect(screen.getByText("100%")).toBeInTheDocument(); // Head
    expect(screen.getByText("90%")).toBeInTheDocument();  // Neck
    expect(screen.getByText("80%")).toBeInTheDocument();  // Torso Upper
    expect(screen.getByText("30%")).toBeInTheDocument();  // Leg Right
  });

  it("should position correctly for left player", () => {
    const { container } = render(
      <BodyPartHealthDisplay
        bodyPartHealth={mockBodyPartHealth}
        playerId="player-1"
        position="left"
        isMobile={false}
      />
    );

    const display = container.querySelector('[data-testid="body-part-health-player-1"]') as HTMLElement;
    expect(display.style.left).toBe("12px");
    expect(display.style.right).toBe("auto");
  });

  it("should position correctly for right player", () => {
    const { container } = render(
      <BodyPartHealthDisplay
        bodyPartHealth={mockBodyPartHealth}
        playerId="player-2"
        position="right"
        isMobile={false}
      />
    );

    const display = container.querySelector('[data-testid="body-part-health-player-2"]') as HTMLElement;
    expect(display.style.left).toBe("auto");
    expect(display.style.right).toBe("12px");
  });

  it("should use mobile sizing when isMobile is true", () => {
    const { container } = render(
      <BodyPartHealthDisplay
        bodyPartHealth={mockBodyPartHealth}
        playerId="player-1"
        position="left"
        isMobile={true}
      />
    );

    const display = container.querySelector('[data-testid="body-part-health-player-1"]') as HTMLElement;
    expect(display.style.left).toBe("8px"); // Mobile positioning
  });

  it("should show critical health styling for low health", () => {
    const lowHealthParts: BodyPartHealth = {
      [BodyPart.HEAD]: 15,
      [BodyPart.NECK]: 10,
      [BodyPart.TORSO_UPPER]: 5,
      [BodyPart.TORSO_LOWER]: 20,
      [BodyPart.ARM_LEFT]: 18,
      [BodyPart.ARM_RIGHT]: 12,
      [BodyPart.LEG_LEFT]: 8,
      [BodyPart.LEG_RIGHT]: 3,
    };

    render(
      <BodyPartHealthDisplay
        bodyPartHealth={lowHealthParts}
        playerId="player-1"
        position="left"
        isMobile={false}
      />
    );

    // Component should render with critical health values
    expect(screen.getByText("15%")).toBeInTheDocument();
    expect(screen.getByText("10%")).toBeInTheDocument();
    expect(screen.getByText("5%")).toBeInTheDocument();
  });
});
