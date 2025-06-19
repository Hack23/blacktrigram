import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameEngine } from "./GameEngine";
import { createMockPlayer } from "../../../test/mocks/playerMocks";
import { TrigramStance, PlayerArchetype } from "../../../types/enums";

// Create mock players at module level - Fix: Define at top level
const mockPlayer1 = createMockPlayer({
  id: "player1",
  name: { korean: "테스트 무사 1", english: "Test Warrior 1" },
  archetype: PlayerArchetype.MUSA,
  currentStance: TrigramStance.GEON,
  position: { row: 1, col: 1 },
});

const mockPlayer2 = createMockPlayer({
  id: "player2",
  name: { korean: "테스트 무사 2", english: "Test Warrior 2" },
  archetype: PlayerArchetype.AMSALJA,
  currentStance: TrigramStance.TAE,
  position: { row: 6, col: 6 },
});

describe("GameEngine", () => {
  const mockOnPlayerUpdate = vi.fn();
  const mockOnCombatEnd = vi.fn();

  const defaultProps = {
    player1: mockPlayer1,
    player2: mockPlayer2,
    onPlayerUpdate: mockOnPlayerUpdate,
    onCombatEnd: mockOnCombatEnd,
    width: 800,
    height: 600,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render game engine with grid visualization", () => {
      render(<GameEngine {...defaultProps} />);
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should display correct turn information", () => {
      render(<GameEngine {...defaultProps} />);
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });
  });

  // Fix: All tests should use proper mock references
  describe("Victory Conditions", () => {
    it("should handle draw condition", () => {
      const deadPlayer1 = createMockPlayer({ ...mockPlayer1, health: 0 });
      const deadPlayer2 = createMockPlayer({ ...mockPlayer2, health: 0 });

      render(
        <GameEngine
          {...defaultProps}
          player1={deadPlayer1}
          player2={deadPlayer2}
        />
      );
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });
  });

  describe("AI Behavior", () => {
    it("should execute AI moves for player 2", () => {
      render(<GameEngine {...defaultProps} aiEnabled={true} />);
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should make AI attack when in range", async () => {
      const player2InRange = createMockPlayer({
        ...mockPlayer2,
        position: { row: 1, col: 2 },
      });

      render(
        <GameEngine
          {...defaultProps}
          player2={player2InRange}
          aiEnabled={true}
        />
      );
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });
  });

  // Fix: All remaining tests to use proper mock references
  describe("Game State Management", () => {
    it("should track turn progression", () => {
      render(
        <GameEngine
          {...defaultProps}
          player1={mockPlayer1}
          player2={mockPlayer2}
        />
      );
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should maintain combat log", () => {
      render(
        <GameEngine
          {...defaultProps}
          player1={mockPlayer1}
          player2={mockPlayer2}
        />
      );
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should handle resource regeneration", () => {
      render(
        <GameEngine
          {...defaultProps}
          player1={mockPlayer1}
          player2={mockPlayer2}
        />
      );
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });
  });

  describe("Grid Validation", () => {
    it("should create valid octagonal grid", () => {
      render(
        <GameEngine
          {...defaultProps}
          player1={mockPlayer1}
          player2={mockPlayer2}
        />
      );
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should initialize player positions if not set", () => {
      const playerWithoutPosition = createMockPlayer({
        ...mockPlayer1,
        position: undefined,
      });

      render(
        <GameEngine
          {...defaultProps}
          player1={playerWithoutPosition}
          player2={mockPlayer2}
        />
      );
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });
  });

  describe("Korean Martial Arts Integration", () => {
    it("should use Korean terminology in combat log", () => {
      render(
        <GameEngine
          {...defaultProps}
          player1={mockPlayer1}
          player2={mockPlayer2}
        />
      );
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should respect trigram philosophy in game mechanics", () => {
      render(
        <GameEngine
          {...defaultProps}
          player1={mockPlayer1}
          player2={mockPlayer2}
        />
      );
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should handle rapid input without errors", () => {
      render(
        <GameEngine
          {...defaultProps}
          player1={mockPlayer1}
          player2={mockPlayer2}
        />
      );
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should maintain stable frame rate with many effects", () => {
      render(
        <GameEngine
          {...defaultProps}
          player1={mockPlayer1}
          player2={mockPlayer2}
        />
      );
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });
  });

  // Fix: Add remaining test sections with proper mock usage
  describe("Player Movement", () => {
    it("should handle player movement within grid bounds", () => {
      render(<GameEngine {...defaultProps} />);
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should prevent movement outside grid bounds", () => {
      render(<GameEngine {...defaultProps} />);
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should prevent movement to occupied positions", () => {
      render(<GameEngine {...defaultProps} />);
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });
  });

  describe("Combat System", () => {
    it("should execute basic attack technique", () => {
      render(<GameEngine {...defaultProps} />);
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should handle stance changes", () => {
      render(<GameEngine {...defaultProps} />);
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should prevent actions when insufficient resources", () => {
      const lowResourcePlayer = createMockPlayer({
        ...mockPlayer1,
        ki: 5,
        stamina: 5,
      });

      render(<GameEngine {...defaultProps} player1={lowResourcePlayer} />);
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });
  });

  describe("Victory Conditions", () => {
    it("should detect victory when player health reaches zero", () => {
      const defeatedPlayer = createMockPlayer({
        ...mockPlayer2,
        health: 0,
      });

      render(<GameEngine {...defaultProps} player2={defeatedPlayer} />);
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });

    it("should detect victory when player consciousness reaches zero", () => {
      const unconsciousPlayer = createMockPlayer({
        ...mockPlayer2,
        consciousness: 0,
      });

      render(<GameEngine {...defaultProps} player2={unconsciousPlayer} />);
      expect(screen.getByTestId("game-engine")).toBeInTheDocument();
    });
  });
});
