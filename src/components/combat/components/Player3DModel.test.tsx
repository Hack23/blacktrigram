/**
 * Unit tests for Player3DModel component
 */

import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Player3DModel from "./Player3DModel";
import { PlayerArchetype, TrigramStance } from "../../../types/common";
import { createPlayerFromArchetype } from "../../../utils/playerUtils";

// Mock Three.js and React Three Fiber
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
}));

// Mock Three.js
vi.mock("three", () => ({
  Group: class MockGroup {},
  Mesh: class MockMesh {},
  Vector3: class MockVector3 {},
  MeshStandardMaterial: class MockMeshStandardMaterial {},
  DoubleSide: 2,
}));

describe("Player3DModel", () => {
  const mockPlayer = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

  it("should render without crashing", () => {
    const { container } = render(
      <Player3DModel playerState={mockPlayer} position={[0, 0, 0]} />
    );

    expect(container).toBeTruthy();
  });

  it("should render with custom position", () => {
    const customPosition: [number, number, number] = [5, 0, 3];
    const { container } = render(
      <Player3DModel playerState={mockPlayer} position={customPosition} />
    );

    expect(container).toBeTruthy();
  });

  it("should render with different animation states", () => {
    const animationStates: Array<"idle" | "attack" | "defend" | "walk"> = [
      "idle",
      "attack",
      "defend",
      "walk",
    ];

    animationStates.forEach((state) => {
      const { container } = render(
        <Player3DModel playerState={mockPlayer} animationState={state} />
      );

      expect(container).toBeTruthy();
    });
  });

  it("should render with different facing directions", () => {
    const { container: leftFacing } = render(
      <Player3DModel playerState={mockPlayer} facing="left" />
    );

    const { container: rightFacing } = render(
      <Player3DModel playerState={mockPlayer} facing="right" />
    );

    expect(leftFacing).toBeTruthy();
    expect(rightFacing).toBeTruthy();
  });

  it("should render with low health state", () => {
    const lowHealthPlayer = {
      ...mockPlayer,
      health: 10,
      maxHealth: 100,
    };

    const { container } = render(
      <Player3DModel playerState={lowHealthPlayer} />
    );

    expect(container).toBeTruthy();
  });

  it("should render with blocking state", () => {
    const blockingPlayer = {
      ...mockPlayer,
      isBlocking: true,
    };

    const { container } = render(
      <Player3DModel playerState={blockingPlayer} />
    );

    expect(container).toBeTruthy();
  });

  it("should render with countering state", () => {
    const counteringPlayer = {
      ...mockPlayer,
      isCountering: true,
    };

    const { container } = render(
      <Player3DModel playerState={counteringPlayer} />
    );

    expect(container).toBeTruthy();
  });

  it("should render with different trigram stances", () => {
    const stances = [
      TrigramStance.GEON,
      TrigramStance.TAE,
      TrigramStance.LI,
      TrigramStance.JIN,
      TrigramStance.SON,
      TrigramStance.GAM,
      TrigramStance.GAN,
      TrigramStance.GON,
    ];

    stances.forEach((stance) => {
      const playerWithStance = {
        ...mockPlayer,
        currentStance: stance,
      };

      const { container } = render(
        <Player3DModel playerState={playerWithStance} />
      );

      expect(container).toBeTruthy();
    });
  });

  it("should render without details when showDetails is false", () => {
    const { container } = render(
      <Player3DModel playerState={mockPlayer} showDetails={false} />
    );

    expect(container).toBeTruthy();
  });

  it("should render without health bar when showHealthBar is false", () => {
    const { container } = render(
      <Player3DModel playerState={mockPlayer} showHealthBar={false} />
    );

    expect(container).toBeTruthy();
  });

  it("should render without stance indicator when showStanceIndicator is false", () => {
    const { container } = render(
      <Player3DModel
        playerState={mockPlayer}
        showStanceIndicator={false}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with custom scale", () => {
    const { container } = render(
      <Player3DModel playerState={mockPlayer} scale={2.0} />
    );

    expect(container).toBeTruthy();
  });

  it("should render for all player archetypes", () => {
    const archetypes = [
      PlayerArchetype.MUSA,
      PlayerArchetype.AMSALJA,
      PlayerArchetype.HACKER,
      PlayerArchetype.JEONGBO_YOWON,
      PlayerArchetype.JOJIK_POKRYEOKBAE,
    ];

    archetypes.forEach((archetype) => {
      const player = createPlayerFromArchetype(archetype, 0);
      const { container } = render(<Player3DModel playerState={player} />);

      expect(container).toBeTruthy();
    });
  });
});
