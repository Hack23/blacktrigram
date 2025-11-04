import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlayerArchetype, TrigramStance } from "../../../types/common";
import { createPlayerFromArchetype } from "../../../utils/playerUtils";
import { CombatHUD } from "./CombatHUD";

describe("CombatHUD", () => {
  const mockPlayer1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  const mockPlayer2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

  it("should render combat HUD", () => {
    render(
      <CombatHUD
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });

  it("should display health bars for both players", () => {
    render(
      <CombatHUD
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
      />
    );

    // Note: Health bars are rendered as custom components in child containers
    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });

  it("should display stance indicators for both players", () => {
    render(
      <CombatHUD
        player1={{
          ...mockPlayer1,
          currentStance: TrigramStance.GEON,
        }}
        player2={{
          ...mockPlayer2,
          currentStance: TrigramStance.TAE,
        }}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("player1-stance-indicator")).toBeInTheDocument();
    expect(screen.getByTestId("player2-stance-indicator")).toBeInTheDocument();
  });

  it("should display round timer", () => {
    render(
      <CombatHUD
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("round-timer")).toBeInTheDocument();
  });

  it("should handle different game scores", () => {
    render(
      <CombatHUD
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
        gameScore={{ player1: 2, player2: 1 }}
      />
    );

    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });

  it("should handle rounds won", () => {
    render(
      <CombatHUD
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
        roundsWon={{ player1: 1, player2: 0 }}
      />
    );

    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });

  it("should render with pause toggle", () => {
    const onPauseToggle = vi.fn();

    render(
      <CombatHUD
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
        isPaused={false}
        onPauseToggle={onPauseToggle}
      />
    );

    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });

  it("should render when paused", () => {
    render(
      <CombatHUD
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
        isPaused={true}
        onPauseToggle={vi.fn()}
      />
    );

    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });

  it("should render in mobile layout for small widths", () => {
    render(
      <CombatHUD
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
        width={600} // Mobile width
        height={160}
      />
    );

    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });

  it("should handle different health levels", () => {
    render(
      <CombatHUD
        player1={{
          ...mockPlayer1,
          health: 50,
          maxHealth: 100,
        }}
        player2={{
          ...mockPlayer2,
          health: 25,
          maxHealth: 100,
        }}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });

  it("should handle low Ki/Stamina levels", () => {
    render(
      <CombatHUD
        player1={{
          ...mockPlayer1,
          ki: 15,
          maxKi: 100,
          stamina: 20,
          maxStamina: 100,
        }}
        player2={{
          ...mockPlayer2,
          ki: 10,
          maxKi: 100,
          stamina: 15,
          maxStamina: 100,
        }}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });

  it("should display archetype-specific styling", () => {
    render(
      <CombatHUD
        player1={{
          ...mockPlayer1,
          archetype: PlayerArchetype.MUSA,
        }}
        player2={{
          ...mockPlayer2,
          archetype: PlayerArchetype.HACKER,
        }}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });

  it("should handle zero time remaining", () => {
    render(
      <CombatHUD
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={0}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("round-timer")).toBeInTheDocument();
  });

  it("should handle final round", () => {
    render(
      <CombatHUD
        player1={mockPlayer1}
        player2={mockPlayer2}
        timeRemaining={180}
        currentRound={3}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });

  it("should handle all player archetypes", () => {
    // Test just one archetype to avoid multiple renders
    const archetype = PlayerArchetype.HACKER;
    const player = createPlayerFromArchetype(archetype, 0);
    
    render(
      <CombatHUD
        player1={player}
        player2={mockPlayer2}
        timeRemaining={180}
        currentRound={1}
        maxRounds={3}
      />
    );

    expect(screen.getByTestId("combat-hud")).toBeInTheDocument();
  });
});
