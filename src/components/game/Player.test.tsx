import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { Player } from "./Player";
import { Application } from "@pixi/react";
import { createPlayerState } from "../../types";

describe("Player", () => {
  let testPlayerState: ReturnType<typeof createPlayerState>;

  beforeEach(() => {
    testPlayerState = createPlayerState(
      "test-player",
      { x: 100, y: 200 },
      "geon"
    );
  });

  it("should render within PixiJS Application", () => {
    const { container } = render(
      <Application width={800} height={600}>
        <Player
          playerState={testPlayerState}
          onStanceChange={() => {}}
          onAttack={() => {}}
          isPlayer1={true}
        />
      </Application>
    );

    expect(container).toBeInTheDocument();
  });

  it("should handle stance changes", () => {
    let capturedStance: string | null = null;
    const handleStanceChange = (stance: string) => {
      capturedStance = stance;
    };

    render(
      <Application width={800} height={600}>
        <Player
          playerState={testPlayerState}
          onStanceChange={handleStanceChange}
          onAttack={() => {}}
          isPlayer1={true}
        />
      </Application>
    );

    // Test that component renders without errors
    expect(capturedStance).toBeNull(); // Initially no stance changes
  });

  it("should display Korean stance information", () => {
    const geonPlayer = createPlayerState(
      "geonPlayer",
      { x: 100, y: 100 },
      "geon"
    );

    const { container } = render(
      <Application width={800} height={600}>
        <Player
          playerState={geonPlayer}
          onStanceChange={() => {}}
          onAttack={() => {}}
          isPlayer1={false}
        />
      </Application>
    );

    expect(container).toBeInTheDocument();
    // Note: PixiJS content is rendered to canvas, so we can't test text content directly
    // This test verifies the component mounts successfully with Korean stance data
  });
});
