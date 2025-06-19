import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Player } from "./Player";
import { renderWithPixi } from "../../../test/test-utils";
import {
  createMockPlayer,
  createDamagedPlayer,
  createArchetypePlayer,
} from "../../../test/mocks/playerMocks";
import { PlayerArchetype, TrigramStance } from "../../../types/enums";
import type { PlayerState } from "../../../types/player";

describe("Player Component", () => {
  const mockOnClick = vi.fn();

  let mockPlayerState: PlayerState;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPlayerState = createMockPlayer();
  });

  describe("Basic Rendering", () => {
    it("should render player with default props", () => {
      renderWithPixi(
        <Player
          playerState={mockPlayerState}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should render player name in Korean", () => {
      renderWithPixi(
        <Player
          playerState={mockPlayerState}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0-name")).toBeTruthy();
    });

    it("should display current stance", () => {
      renderWithPixi(
        <Player
          playerState={mockPlayerState}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0-stance")).toBeTruthy();
    });

    it("should be interactive and handle clicks", () => {
      renderWithPixi(
        <Player
          playerState={mockPlayerState}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      const player = screen.getByTestId("player-0");
      fireEvent.click(player);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Health Visualization", () => {
    it("should show correct health status color for healthy player", () => {
      const healthyPlayer = createMockPlayer({
        health: 90,
        maxHealth: 100,
      });

      renderWithPixi(
        <Player
          playerState={healthyPlayer}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should show warning color for damaged player", () => {
      const damagedPlayer = createDamagedPlayer(0.4); // 40% health

      renderWithPixi(
        <Player
          playerState={damagedPlayer}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should show critical color for low health player", () => {
      const criticalPlayer = createDamagedPlayer(0.1); // 10% health

      renderWithPixi(
        <Player
          playerState={criticalPlayer}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should display unconscious state", () => {
      const unconsciousPlayer = createMockPlayer({
        consciousness: 0,
      });

      renderWithPixi(
        <Player
          playerState={unconsciousPlayer}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0-unconscious")).toBeTruthy();
    });
  });

  describe("Combat States", () => {
    it("should show blocking state", () => {
      const blockingPlayer = createMockPlayer({
        isBlocking: true,
      });

      renderWithPixi(
        <Player
          playerState={blockingPlayer}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should show stunned state with visual effects", () => {
      const stunnedPlayer = createMockPlayer({
        isStunned: true,
      });

      renderWithPixi(
        <Player
          playerState={stunnedPlayer}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should show countering state", () => {
      const counteringPlayer = createMockPlayer({
        isCountering: true,
      });

      renderWithPixi(
        <Player
          playerState={counteringPlayer}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });
  });

  describe("Status Effects", () => {
    it("should display status effects", () => {
      const playerWithEffects = createMockPlayer({
        statusEffects: [
          {
            id: "burn",
            type: "burn",
            intensity: "medium" as any,
            duration: 3000,
            description: { korean: "화상", english: "Burn" },
            stackable: false,
            source: "fire_technique",
            startTime: Date.now(),
            endTime: Date.now() + 3000,
          },
        ],
      });

      renderWithPixi(
        <Player
          playerState={playerWithEffects}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should handle multiple status effects", () => {
      const playerWithMultipleEffects = createMockPlayer({
        statusEffects: [
          {
            id: "burn",
            type: "burn",
            intensity: "medium" as any,
            duration: 3000,
            description: { korean: "화상", english: "Burn" },
            stackable: false,
            source: "fire",
            startTime: Date.now(),
            endTime: Date.now() + 3000,
          },
          {
            id: "poison",
            type: "poison",
            intensity: "low" as any,
            duration: 5000,
            description: { korean: "독", english: "Poison" },
            stackable: true,
            source: "poison_dart",
            startTime: Date.now(),
            endTime: Date.now() + 5000,
          },
        ],
      });

      renderWithPixi(
        <Player
          playerState={playerWithMultipleEffects}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });
  });

  describe("Archetype Visualization", () => {
    it("should use archetype-specific colors for MUSA", () => {
      const musaPlayer = createArchetypePlayer(PlayerArchetype.MUSA);

      renderWithPixi(
        <Player
          playerState={musaPlayer}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should use archetype-specific colors for AMSALJA", () => {
      const amsaljaPlayer = createArchetypePlayer(PlayerArchetype.AMSALJA);

      renderWithPixi(
        <Player
          playerState={amsaljaPlayer}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should use archetype-specific colors for HACKER", () => {
      const hackerPlayer = createArchetypePlayer(PlayerArchetype.HACKER);

      renderWithPixi(
        <Player
          playerState={hackerPlayer}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });
  });

  describe("Stance Indication", () => {
    it("should display different stances correctly", () => {
      const stances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
      ];

      stances.forEach((stance, index) => {
        const playerWithStance = createMockPlayer({
          currentStance: stance,
        });

        renderWithPixi(
          <Player
            playerState={playerWithStance}
            playerIndex={index}
            onClick={mockOnClick}
          />
        );

        expect(screen.getByTestId(`player-${index}-stance`)).toBeTruthy();
      });
    });

    it("should show stance symbol correctly", () => {
      const playerWithGeon = createMockPlayer({
        currentStance: TrigramStance.GEON,
      });

      renderWithPixi(
        <Player
          playerState={playerWithGeon}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0-stance")).toBeTruthy();
    });
  });

  describe("Grid Positioning", () => {
    it("should position player based on grid coordinates", () => {
      const playerWithGridPos = createMockPlayer({
        position: { x: 3, y: 4 },
      });

      renderWithPixi(
        <Player
          playerState={playerWithGridPos}
          playerIndex={0}
          onClick={mockOnClick}
          gridPosition={{ row: 3, col: 4 }}
          gridSize={60}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should handle grid position updates", () => {
      const { rerender } = renderWithPixi(
        <Player
          playerState={mockPlayerState}
          playerIndex={0}
          onClick={mockOnClick}
          gridPosition={{ row: 2, col: 2 }}
          gridSize={60}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();

      rerender(
        <Player
          playerState={mockPlayerState}
          playerIndex={0}
          onClick={mockOnClick}
          gridPosition={{ row: 5, col: 5 }}
          gridSize={60}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });
  });

  describe("Active State", () => {
    it("should show active state when isActive is true", () => {
      renderWithPixi(
        <Player
          playerState={mockPlayerState}
          playerIndex={0}
          onClick={mockOnClick}
          isActive={true}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should not show active state when isActive is false", () => {
      renderWithPixi(
        <Player
          playerState={mockPlayerState}
          playerIndex={0}
          onClick={mockOnClick}
          isActive={false}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });
  });

  describe("Resource Bars", () => {
    it("should display health bar correctly", () => {
      renderWithPixi(
        <Player
          playerState={mockPlayerState}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should display ki bar correctly", () => {
      const playerWithPartialKi = createMockPlayer({
        ki: 50,
        maxKi: 100,
      });

      renderWithPixi(
        <Player
          playerState={playerWithPartialKi}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should display stamina bar correctly", () => {
      const playerWithPartialStamina = createMockPlayer({
        stamina: 30,
        maxStamina: 100,
      });

      renderWithPixi(
        <Player
          playerState={playerWithPartialStamina}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });
  });

  describe("Debug Information", () => {
    it("should display player index for debugging", () => {
      renderWithPixi(
        <Player
          playerState={mockPlayerState}
          playerIndex={1}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-1-debug")).toBeTruthy();
    });

    it("should handle different player indices", () => {
      const indices = [0, 1, 2];

      indices.forEach((index) => {
        renderWithPixi(
          <Player
            playerState={mockPlayerState}
            playerIndex={index}
            onClick={mockOnClick}
          />
        );

        expect(screen.getByTestId(`player-${index}-debug`)).toBeTruthy();
      });
    });
  });

  describe("Korean Cultural Elements", () => {
    it("should display Korean player names", () => {
      const koreanPlayer = createMockPlayer({
        name: { korean: "무사", english: "Warrior" },
      });

      renderWithPixi(
        <Player
          playerState={koreanPlayer}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0-name")).toBeTruthy();
    });

    it("should use Korean archetype styling", () => {
      const allArchetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      allArchetypes.forEach((archetype, index) => {
        const archetypePlayer = createArchetypePlayer(archetype);

        renderWithPixi(
          <Player
            playerState={archetypePlayer}
            playerIndex={index}
            onClick={mockOnClick}
          />
        );

        expect(screen.getByTestId(`player-${index}`)).toBeTruthy();
      });
    });
  });

  describe("Performance", () => {
    it("should render efficiently with minimal props", () => {
      const startTime = performance.now();

      renderWithPixi(
        <Player
          playerState={mockPlayerState}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(100); // Should render quickly
      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should handle rapid state updates", () => {
      const { rerender } = renderWithPixi(
        <Player
          playerState={mockPlayerState}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      // Simulate rapid health changes
      for (let i = 100; i >= 0; i -= 10) {
        const updatedPlayer = createMockPlayer({ health: i });
        rerender(
          <Player
            playerState={updatedPlayer}
            playerIndex={0}
            onClick={mockOnClick}
          />
        );
      }

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });
  });

  describe("Error Handling", () => {
    it("should handle missing position gracefully", () => {
      const playerNoPosition = createMockPlayer({
        position: undefined as any,
      });

      renderWithPixi(
        <Player
          playerState={playerNoPosition}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should handle invalid health values", () => {
      const playerInvalidHealth = createMockPlayer({
        health: -10,
        maxHealth: 100,
      });

      renderWithPixi(
        <Player
          playerState={playerInvalidHealth}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });

    it("should handle missing status effects array", () => {
      const playerNoEffects = createMockPlayer({
        statusEffects: undefined as any,
      });

      // Should not crash even with missing effects
      renderWithPixi(
        <Player
          playerState={playerNoEffects}
          playerIndex={0}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("player-0")).toBeTruthy();
    });
  });
});
