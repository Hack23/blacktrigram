import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MatchStatisticsDisplay } from "./MatchStatisticsDisplay";
import { MatchStatistics } from "../../../../systems/combat";
import { PlayerMatchStats } from "../../../../systems/player";

// Mock match stats for testing
const mockPlayerStats: PlayerMatchStats = {
  wins: 1,
  losses: 0,
  totalDamageDealt: 150,
  totalDamageReceived: 50,
  hitsLanded: 25,
  hitsTaken: 10,
  perfectStrikes: 5,
  vitalPointHits: 3,
  consecutiveWins: 1,
  matchDuration: 90000,
  techniques: ["천둥벽력", "화염지창", "수류반격"],
};

const mockMatchStats: MatchStatistics = {
  matchDuration: 90,
  currentRound: 1,
  maxRounds: 3,
  winner: 0,
  player1: mockPlayerStats,
  player2: {
    wins: 0,
    losses: 1,
    totalDamageDealt: 50,
    totalDamageReceived: 150,
    hitsLanded: 10,
    hitsTaken: 25,
    perfectStrikes: 1,
    vitalPointHits: 0,
    consecutiveWins: 0,
    matchDuration: 90000,
    techniques: ["벽력일섬"],
  },
  finalScore: {
    player1: 100,
    player2: 50,
  },
  criticalHits: 8,
  vitalPointHits: 3,
  totalDamageDealt: 150,
  totalDamageTaken: 100,
  techniquesUsed: 8,
  perfectStrikes: 1,
  consecutiveWins: 1,
  totalMatches: 1,
  totalRounds: 2,
  timeRemaining: 0,
  combatEvents: [],
  roundsWon: { player1: 2, player2: 0 },
};

describe("MatchStatisticsDisplay", () => {
  it("should render without crashing", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("match-statistics-display")).toBeInTheDocument();
  });

  it("should display title in Korean and English", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    const display = screen.getByTestId("match-statistics-display");
    expect(display).toHaveTextContent("경기 통계");
    expect(display).toHaveTextContent("Match Statistics");
  });

  it("should display overall match stats", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("overall-stats")).toBeInTheDocument();
  });

  it("should display rounds information", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    const overallStats = screen.getByTestId("overall-stats");
    expect(overallStats).toHaveTextContent("1 / 3"); // currentRound / maxRounds
  });

  it("should display match duration", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    const overallStats = screen.getByTestId("overall-stats");
    expect(overallStats).toHaveTextContent("1:30"); // 90 seconds = 1:30
  });

  it("should display critical hits count", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    const overallStats = screen.getByTestId("overall-stats");
    expect(overallStats).toHaveTextContent("8"); // criticalHits
  });

  it("should display vital point hits", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    const overallStats = screen.getByTestId("overall-stats");
    expect(overallStats).toHaveTextContent("3"); // vitalPointHits
  });

  it("should display player 1 stats", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("player1-stats")).toBeInTheDocument();
  });

  it("should display player 2 stats", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("player2-stats")).toBeInTheDocument();
  });

  it("should show winner trophy for player 1", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    const player1Stats = screen.getByTestId("player1-stats");
    expect(player1Stats).toHaveTextContent("🏆");
  });

  it("should not show trophy for losing player", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    const player2Stats = screen.getByTestId("player2-stats");
    expect(player2Stats).not.toHaveTextContent("🏆");
  });

  it("should display final score", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("final-score")).toBeInTheDocument();
    expect(screen.getByTestId("final-score")).toHaveTextContent("100 - 50");
  });

  it("should adapt layout for mobile", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={true}
        isTablet={false}
      />
    );
    const display = screen.getByTestId("match-statistics-display");
    expect(display).toHaveStyle({ width: "95%" });
  });

  it("should adapt layout for tablet", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={true}
      />
    );
    const display = screen.getByTestId("match-statistics-display");
    expect(display).toHaveStyle({ width: "80%" });
  });

  it("should display techniques for player 1", () => {
    render(
      <MatchStatisticsDisplay
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    const player1Stats = screen.getByTestId("player1-stats");
    expect(player1Stats).toHaveTextContent("천둥벽력");
    expect(player1Stats).toHaveTextContent("화염지창");
  });

  it("should show winner as player 2 when winner is 1", () => {
    const statsWithPlayer2Winner: MatchStatistics = {
      ...mockMatchStats,
      winner: 1,
    };
    render(
      <MatchStatisticsDisplay
        matchStats={statsWithPlayer2Winner}
        isMobile={false}
        isTablet={false}
      />
    );
    const player2Stats = screen.getByTestId("player2-stats");
    expect(player2Stats).toHaveTextContent("🏆");
  });

  it("should handle empty techniques array", () => {
    const statsWithNoTechniques: MatchStatistics = {
      ...mockMatchStats,
      player1: {
        ...mockPlayerStats,
        techniques: [],
      },
    };
    render(
      <MatchStatisticsDisplay
        matchStats={statsWithNoTechniques}
        isMobile={false}
        isTablet={false}
      />
    );
    const player1Stats = screen.getByTestId("player1-stats");
    expect(player1Stats).not.toHaveTextContent("사용한 기술");
  });

  it("should truncate long technique lists", () => {
    const statsWithManyTechniques: MatchStatistics = {
      ...mockMatchStats,
      player1: {
        ...mockPlayerStats,
        techniques: ["기술1", "기술2", "기술3", "기술4", "기술5", "기술6"],
      },
    };
    render(
      <MatchStatisticsDisplay
        matchStats={statsWithManyTechniques}
        isMobile={false}
        isTablet={false}
      />
    );
    const player1Stats = screen.getByTestId("player1-stats");
    expect(player1Stats).toHaveTextContent("...");
  });
});
