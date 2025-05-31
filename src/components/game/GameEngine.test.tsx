import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { GameEngine } from "./GameEngine";
import {
  createPlayerState,
  type PlayerState,
  type GamePhase,
} from "../../types";

// Mock PlayerContainer for isolation
vi.mock("./Player", () => ({
  PlayerContainer: (props: Record<string, unknown>) => (
    <div data-testid="player-container" {...props} />
  ),
}));

describe("GameEngine", () => {
  let mockProps: any;

  beforeEach(() => {
    mockProps = {
      players: [
        createPlayerState("player1", { x: 100, y: 300 }),
        createPlayerState("player2", { x: 200, y: 300 }),
      ] as [PlayerState, PlayerState],
      gamePhase: "combat" as GamePhase,
      onPlayersChange: vi.fn(),
      onGamePhaseChange: vi.fn(),
      onExit: vi.fn(),
    };
  });

  it("renders without crashing", () => {
    const { container } = render(<GameEngine {...mockProps} />);
    expect(container).toBeInTheDocument();
  });

  it("renders game UI components", () => {
    const { getAllByTestId } = render(<GameEngine {...mockProps} />);
    // Update test expectations based on actual rendered components
    expect(getAllByTestId("game-container")).toHaveLength(1);
  });
});
