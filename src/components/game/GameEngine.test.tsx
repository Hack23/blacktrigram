import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GameEngine } from "./GameEngine";
import { createPlayerState } from "../../utils/playerUtils";
import type { PlayerState, KoreanText, Position } from "../../types";
import { Application } from "@pixi/react";

const mockPlayer1Name: KoreanText = { korean: "선수1", english: "Player1" };
const mockPlayer2Name: KoreanText = { korean: "선수2", english: "Player2" };
const mockPosition: Position = { x: 0, y: 0 };

const mockPlayer1: PlayerState = createPlayerState(
  "player1",
  "musa",
  mockPlayer1Name,
  mockPosition
);
const mockPlayer2: PlayerState = createPlayerState(
  "player2",
  "amsalja",
  mockPlayer2Name,
  mockPosition
);

describe("GameEngine", () => {
  const defaultProps = {
    player1: mockPlayer1,
    player2: mockPlayer2,
    gamePhase: "combat" as const,
    onGameStateChange: vi.fn(),
    onPlayerUpdate: vi.fn(),
    onGamePhaseChange: vi.fn(),
    gameMode: "versus" as const,
  };

  it("renders without crashing", () => {
    const { container } = render(
      <Application>
        <GameEngine {...defaultProps} />
      </Application>
    );
    expect(container).toBeInTheDocument();
  });

  it("initializes game systems", () => {
    render(
      <Application>
        <GameEngine {...defaultProps} />
      </Application>
    );

    expect(defaultProps.onGameStateChange).toHaveBeenCalled();
  });

  it("initializes with correct game phase", () => {
    const { container } = render(
      <Application>
        <GameEngine {...defaultProps} gamePhase="training" />
      </Application>
    );
    expect(container).toBeInTheDocument();
  });
});
