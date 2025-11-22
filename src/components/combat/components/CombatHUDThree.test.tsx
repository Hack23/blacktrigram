/**
 * Unit tests for CombatHUDThree component
 * Tests the Three.js-based combat HUD display
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CombatHUDThree } from "./CombatHUDThree";
import { PlayerState } from "../../../systems";
import { PlayerArchetype, TrigramStance } from "../../../types/common";
import { createPlayerFromArchetype } from "../../../utils/playerUtils";

// Mock @react-three/drei Html component
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
}));

describe("CombatHUDThree", () => {
  let mockPlayer1: PlayerState;
  let mockPlayer2: PlayerState;

  beforeEach(() => {
    mockPlayer1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    mockPlayer2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);
  });

  it("should render without crashing", () => {
    const { container } = render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should display round information", () => {
    render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={2}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("round-display")).toBeInTheDocument();
    expect(screen.getByText("Round 2 / 3")).toBeInTheDocument();
  });

  it("should display timer", () => {
    render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={90}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("timer-display")).toBeInTheDocument();
    expect(screen.getByText("Time: 90s")).toBeInTheDocument();
  });

  it("should display player names", () => {
    render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("player1-name")).toBeInTheDocument();
    expect(screen.getByTestId("player2-name")).toBeInTheDocument();
  });

  it("should display player health bars", () => {
    render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("player1-health")).toBeInTheDocument();
    expect(screen.getByTestId("player2-health")).toBeInTheDocument();
  });

  it("should display player ki bars", () => {
    render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("player1-ki")).toBeInTheDocument();
    expect(screen.getByTestId("player2-ki")).toBeInTheDocument();
  });

  it("should display player stamina bars", () => {
    render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("player1-stamina")).toBeInTheDocument();
    expect(screen.getByTestId("player2-stamina")).toBeInTheDocument();
  });

  it("should render with different round numbers", () => {
    const rounds = [1, 2, 3];

    rounds.forEach((round) => {
      const { unmount } = render(
        <CombatHUDThree
          player1={mockPlayer1}
          player2={mockPlayer2}
          timeRemaining={120}
          currentRound={round}
          maxRounds={3}
        />
      );

      expect(screen.getByText(`Round ${round} / 3`)).toBeInTheDocument();
      unmount();
    });
  });

  it("should render with different time values", () => {
    const times = [120, 60, 30, 10, 5];

    times.forEach((time) => {
      const { unmount } = render(
        <CombatHUDThree
          player1={mockPlayer1}
          player2={mockPlayer2}
          timeRemaining={time}
          currentRound={1}
          maxRounds={3}
        />
      );

      expect(screen.getByText(`Time: ${time}s`)).toBeInTheDocument();
      unmount();
    });
  });

  it("should render with custom position", () => {
    const position: [number, number, number] = [5, 10, 15];
    const { container } = render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
        position={position}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render in mobile mode", () => {
    const { container } = render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
        isMobile={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render in desktop mode", () => {
    const { container } = render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
        isMobile={false}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with paused state", () => {
    const { container } = render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
        isPaused={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with rounds won information", () => {
    const { container } = render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={2}
        maxRounds={3}
        roundsWon={{ player1: 1, player2: 0 }}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with different player archetypes", () => {
    const archetypes = [
      PlayerArchetype.MUSA,
      PlayerArchetype.AMSALJA,
      PlayerArchetype.HACKER,
      PlayerArchetype.JEONGBO_YOWON,
      PlayerArchetype.JOJIK_POKRYEOKBAE,
    ];

    archetypes.forEach((archetype) => {
      const player = createPlayerFromArchetype(archetype, 0);
      const { unmount } = render(
        <CombatHUDThree
          player1={player}
          player2={mockPlayer2}
          timeRemaining={120}
          currentRound={1}
          maxRounds={3}
        />
      );

      expect(screen.getByTestId("player1-name")).toBeInTheDocument();
      unmount();
    });
  });

  it("should render with players at different health levels", () => {
    const healthLevels = [100, 75, 50, 25, 10];

    healthLevels.forEach((health) => {
      const player = {
        ...mockPlayer1,
        health,
        maxHealth: 100,
      };

      const { unmount } = render(
        <CombatHUDThree
          player1={player}
          player2={mockPlayer2}
          timeRemaining={120}
          currentRound={1}
          maxRounds={3}
        />
      );

      expect(screen.getByTestId("player1-health")).toBeInTheDocument();
      unmount();
    });
  });

  it("should handle low time warning", () => {
    render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={5}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("timer-display")).toBeInTheDocument();
    expect(screen.getByText("Time: 5s")).toBeInTheDocument();
  });

  it("should display player scores", () => {
    render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
        roundsWon={{ player1: 2, player2: 1 }}
      />
    );

    expect(screen.getByTestId("player1-score")).toBeInTheDocument();
    expect(screen.getByTestId("player2-score")).toBeInTheDocument();
    expect(screen.getByText("Wins: 2")).toBeInTheDocument();
    expect(screen.getByText("Wins: 1")).toBeInTheDocument();
  });

  it("should display pause indicator when paused", () => {
    render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
        isPaused={true}
      />
    );

    expect(screen.getByTestId("pause-indicator")).toBeInTheDocument();
    expect(screen.getByText("PAUSED")).toBeInTheDocument();
  });

  it("should not display pause indicator when not paused", () => {
    render(
      <CombatHUDThree
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={120}
        currentRound={1}
        maxRounds={3}
        isPaused={false}
      />
    );

    expect(screen.queryByTestId("pause-indicator")).not.toBeInTheDocument();
  });
});
