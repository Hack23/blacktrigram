import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GameUI } from "./GameUI";
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

describe("GameUI", () => {
  const defaultProps = {
    players: [mockPlayer1, mockPlayer2] as [PlayerState, PlayerState],
    gameTime: 0,
    currentRound: 1,
    gamePhase: "combat" as const,
    onStanceChange: vi.fn(),
    onPlayerUpdate: vi.fn(),
    onGamePhaseChange: vi.fn(),
    timeRemaining: 60,
    isPaused: false,
    combatLog: [],
  };

  it("renders without crashing", () => {
    const { container } = render(
      <Application>
        <GameUI {...defaultProps} />
      </Application>
    );
    expect(container).toBeInTheDocument();
  });

  it("displays player information", () => {
    const { getByText } = render(
      <Application>
        <GameUI {...defaultProps} />
      </Application>
    );
    expect(
      getByText(mockPlayer1.name.korean, { exact: false })
    ).toBeInTheDocument();
    expect(
      getByText(mockPlayer2.name.korean, { exact: false })
    ).toBeInTheDocument();
  });

  it("displays game timer and round", () => {
    const { getByText } = render(
      <Application>
        <GameUI {...defaultProps} timeRemaining={55} currentRound={2} />
      </Application>
    );
    expect(getByText(/55/)).toBeInTheDocument();
    expect(getByText(/Round 2/i)).toBeInTheDocument();
  });
});
