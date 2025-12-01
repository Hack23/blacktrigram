/**
 * Unit tests for CombatScreen3D component
 * Tests the Three.js-based combat screen with 3D characters and effects
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CombatScreen3D } from "./CombatScreen3D";
import { PlayerState } from "../../systems";
import { PlayerArchetype, TrigramStance } from "../../types/common";
import { createPlayerFromArchetype } from "../../utils/playerUtils";

// Mock AudioProvider
vi.mock("../../audio/AudioProvider", () => ({
  useAudio: () => ({
    isInitialized: true,
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    playSFX: vi.fn(),
    setSFXVolume: vi.fn(),
    setMusicVolume: vi.fn(),
  }),
}));

// Mock Three.js Canvas and related components
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: () => ({
    gl: {},
    scene: {},
    camera: {},
  }),
}));

// Mock @react-three/drei
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
  OrbitControls: () => null,
}));

// Mock Three.js
vi.mock("three", () => ({
  Group: class MockGroup {},
  Mesh: class MockMesh {},
  Vector3: class MockVector3 {
    constructor(public x = 0, public y = 0, public z = 0) {}
  },
  MeshStandardMaterial: class MockMeshStandardMaterial {},
  DoubleSide: 2,
  Color: class MockColor {},
  BoxGeometry: class MockBoxGeometry {},
  SphereGeometry: class MockSphereGeometry {},
}));

describe("CombatScreen3D", () => {
  let mockPlayers: PlayerState[];
  let mockOnPlayerUpdate: ReturnType<typeof vi.fn>;
  let mockOnReturnToMenu: ReturnType<typeof vi.fn>;
  let mockOnGameEnd: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create two test players
    mockPlayers = [
      createPlayerFromArchetype(PlayerArchetype.MUSA, 0),
      createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1),
    ];

    // Create mock callbacks
    mockOnPlayerUpdate = vi.fn();
    mockOnReturnToMenu = vi.fn();
    mockOnGameEnd = vi.fn();
  });

  it("should render without crashing", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render Three.js canvas", () => {
    render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
  });

  it("should render with custom dimensions", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
        width={1920}
        height={1080}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with default dimensions", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render in paused state", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={true}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render in unpaused state", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with different round numbers", () => {
    const rounds = [1, 2, 3];

    rounds.forEach((round) => {
      const { unmount } = render(
        <CombatScreen3D
          players={mockPlayers}
          onPlayerUpdate={mockOnPlayerUpdate}
          currentRound={round}
          timeRemaining={120}
          isPaused={false}
          onReturnToMenu={mockOnReturnToMenu}
          onGameEnd={mockOnGameEnd}
        />
      );

      expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
      unmount();
    });
  });

  it("should render with different time remaining values", () => {
    const times = [120, 60, 30, 10];

    times.forEach((time) => {
      const { unmount } = render(
        <CombatScreen3D
          players={mockPlayers}
          onPlayerUpdate={mockOnPlayerUpdate}
          currentRound={1}
          timeRemaining={time}
          isPaused={false}
          onReturnToMenu={mockOnReturnToMenu}
          onGameEnd={mockOnGameEnd}
        />
      );

      expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
      unmount();
    });
  });

  it("should render with two players of different archetypes and show correct labels", () => {
    const players = [
      createPlayerFromArchetype(PlayerArchetype.MUSA, 0),
      createPlayerFromArchetype(PlayerArchetype.HACKER, 1),
    ];

    const { unmount } = render(
      <CombatScreen3D
        players={players}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
    // Check for Korean-English archetype labels for both players
    expect(screen.getAllByText(/무사|Musa/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/해커|Hacker/i).length).toBeGreaterThan(0);
    unmount();
  });

  it("should render with two players of the same archetype and show correct label", () => {
    const players = [
      createPlayerFromArchetype(PlayerArchetype.AMSALJA, 0),
      createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1),
    ];

    const { unmount } = render(
      <CombatScreen3D
        players={players}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
    // Check for Korean-English archetype label for both players
    expect(screen.getAllByText(/암살자|Amsalja/i).length).toBeGreaterThanOrEqual(2);
    unmount();
  });

  it("should render with players having different stances", () => {
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
      const players = [
        { ...mockPlayers[0], currentStance: stance },
        { ...mockPlayers[1], currentStance: stance },
      ];

      const { unmount } = render(
        <CombatScreen3D
          players={players}
          onPlayerUpdate={mockOnPlayerUpdate}
          currentRound={1}
          timeRemaining={120}
          isPaused={false}
          onReturnToMenu={mockOnReturnToMenu}
          onGameEnd={mockOnGameEnd}
        />
      );

      expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
      unmount();
    });
  });

  it("should render with players at low health", () => {
    const lowHealthPlayers = mockPlayers.map((player) => ({
      ...player,
      health: 10,
      maxHealth: 100,
    }));

    const { container } = render(
      <CombatScreen3D
        players={lowHealthPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with mobile dimensions", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
        width={375}
        height={667}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with tablet dimensions", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
        width={768}
        height={1024}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with desktop dimensions", () => {
    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
        width={1920}
        height={1080}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should handle exactly 2 players", () => {
    expect(mockPlayers).toHaveLength(2);

    const { container } = render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render return-to-menu button", () => {
    render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockOnReturnToMenu}
        onGameEnd={mockOnGameEnd}
      />
    );
    expect(screen.getByTestId("return-to-menu-button")).toBeInTheDocument();
  });

  it("should call onReturnToMenu when button clicked", () => {
    const mockCallback = vi.fn();
    render(
      <CombatScreen3D
        players={mockPlayers}
        onPlayerUpdate={mockOnPlayerUpdate}
        currentRound={1}
        timeRemaining={120}
        isPaused={false}
        onReturnToMenu={mockCallback}
        onGameEnd={mockOnGameEnd}
      />
    );
    const button = screen.getByTestId("return-to-menu-button");
    button.click();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
