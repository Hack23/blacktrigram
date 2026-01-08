import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WinnerDisplay } from "./WinnerDisplay";
import { AudioProvider } from "../../../../audio/AudioProvider";
import { PlayerArchetype } from "../../../../types/common";
import { createPlayerFromArchetype } from "../../../../utils/playerUtils";

// Mock AudioProvider
vi.mock("../../../../audio/AudioProvider", () => ({
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
  useAudio: () => ({
    isInitialized: true,
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    playSFX: vi.fn(),
  }),
}));

describe("WinnerDisplay", () => {
  it("should render without crashing", () => {
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { container } = render(
      <AudioProvider>
        <WinnerDisplay
          winner={winner}
          isVictory={true}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(container).toBeTruthy();
  });

  it("should display victory title for winner", () => {
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { getByTestId } = render(
      <AudioProvider>
        <WinnerDisplay
          winner={winner}
          isVictory={true}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const resultTitle = getByTestId("result-title");
    expect(resultTitle).toBeInTheDocument();
    expect(resultTitle).toHaveTextContent("승리!");
    expect(resultTitle).toHaveTextContent("Victory!");
  });

  it("should display defeat title for loser", () => {
    const winner = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

    const { getByTestId } = render(
      <AudioProvider>
        <WinnerDisplay
          winner={winner}
          isVictory={false}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const resultTitle = getByTestId("result-title");
    expect(resultTitle).toBeInTheDocument();
    expect(resultTitle).toHaveTextContent("패배");
    expect(resultTitle).toHaveTextContent("Defeat");
  });

  it("should display winner name in Korean and English", () => {
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { getByTestId } = render(
      <AudioProvider>
        <WinnerDisplay
          winner={winner}
          isVictory={true}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const winnerName = getByTestId("winner-name");
    expect(winnerName).toBeInTheDocument();
    expect(winnerName).toHaveTextContent(winner.name.korean);
    expect(winnerName).toHaveTextContent(winner.name.english);
  });

  it("should display archetype information", () => {
    const winner = createPlayerFromArchetype(PlayerArchetype.HACKER, 0);

    const { getByTestId } = render(
      <AudioProvider>
        <WinnerDisplay
          winner={winner}
          isVictory={true}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const archetypeDisplay = getByTestId("winner-archetype-display");
    const archetypeCode = getByTestId("archetype-code");

    expect(archetypeDisplay).toBeInTheDocument();
    expect(archetypeCode).toBeInTheDocument();
    expect(archetypeCode).toHaveTextContent("HACKER");
  });

  it("should display combat stats summary", () => {
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
    // Set some stats
    winner.health = 75;
    winner.ki = 60;
    winner.stamina = 80;

    const { getByTestId } = render(
      <AudioProvider>
        <WinnerDisplay
          winner={winner}
          isVictory={true}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const combatStats = getByTestId("combat-stats-summary");
    expect(combatStats).toBeInTheDocument();
    expect(combatStats).toHaveTextContent("75"); // health
    expect(combatStats).toHaveTextContent("60"); // ki
    expect(combatStats).toHaveTextContent("80"); // stamina
  });

  it("should adapt layout for mobile", () => {
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { getByTestId } = render(
      <AudioProvider>
        <WinnerDisplay
          winner={winner}
          isVictory={true}
          isMobile={true}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(getByTestId("winner-display")).toBeInTheDocument();
  });

  it("should adapt layout for tablet", () => {
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { getByTestId } = render(
      <AudioProvider>
        <WinnerDisplay
          winner={winner}
          isVictory={true}
          isMobile={false}
          isTablet={true}
        />
      </AudioProvider>
    );

    expect(getByTestId("winner-display")).toBeInTheDocument();
  });

  it("should use correct archetype asset for each archetype", () => {
    const archetypes = [
      PlayerArchetype.MUSA,
      PlayerArchetype.AMSALJA,
      PlayerArchetype.HACKER,
      PlayerArchetype.JEONGBO_YOWON,
      PlayerArchetype.JOJIK_POKRYEOKBAE,
    ];

    archetypes.forEach((archetype) => {
      const winner = createPlayerFromArchetype(archetype, 0);

      const { getByTestId, unmount } = render(
        <AudioProvider>
          <WinnerDisplay
            winner={winner}
            isVictory={true}
            isMobile={false}
            isTablet={false}
          />
        </AudioProvider>
      );

      const archetypeCode = getByTestId("archetype-code");
      expect(archetypeCode).toHaveTextContent(archetype.toUpperCase());
      
      // Clean up after each render
      unmount();
    });
  });
});
