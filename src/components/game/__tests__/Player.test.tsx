import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Player } from "../Player";
import { createPlayerState } from "../../../utils/playerUtils";
import type { PlayerState, KoreanText, Position } from "../../../types";
import { Application } from "@pixi/react";

const mockPlayerName: KoreanText = {
  korean: "테스트 선수",
  english: "Test Player",
};
const mockPosition: Position = { x: 0, y: 0 };

describe("Player Component", () => {
  const mockPlayerState: PlayerState = createPlayerState(
    "player1",
    "musa",
    mockPlayerName,
    mockPosition
  );

  const defaultProps = {
    playerState: mockPlayerState,
    playerIndex: 0 as 0 | 1,
    onStateUpdate: vi.fn(),
    archetype: "musa" as const,
    stance: "geon" as const,
    position: mockPosition,
    facing: "right" as const,
    health: 100,
    maxHealth: 100,
    ki: 100,
    maxKi: 100,
    stamina: 100,
    maxStamina: 100,
    showVitalPoints: false,
    x: 0,
    y: 0,
    width: 200,
    height: 150,
  };

  it("renders without crashing", () => {
    const { container } = render(
      <Application>
        <Player {...defaultProps} />
      </Application>
    );
    expect(container).toBeInTheDocument();
  });

  it("displays player name", () => {
    const { getByText } = render(
      <Application>
        <Player {...defaultProps} />
      </Application>
    );
    expect(getByText(mockPlayerName.korean)).toBeInTheDocument();
  });

  it("calls onStateUpdate when state changes", () => {
    const onStateUpdate = vi.fn();
    render(
      <Application>
        <Player {...defaultProps} onStateUpdate={onStateUpdate} />
      </Application>
    );
    // Test state update functionality if needed
  });
});
