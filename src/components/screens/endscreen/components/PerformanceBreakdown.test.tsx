import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PerformanceBreakdown } from "./PerformanceBreakdown";
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
  techniques: ["천둥벽력", "화염지창", "수류반격", "천둥벽력", "화염지창"],
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

describe("PerformanceBreakdown", () => {
  it("should render without crashing", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("performance-breakdown")).toBeInTheDocument();
  });

  it("should display breakdown title", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("breakdown-title")).toBeInTheDocument();
    expect(screen.getByTestId("breakdown-title")).toHaveTextContent("전투 분석");
    expect(screen.getByTestId("breakdown-title")).toHaveTextContent("Performance Breakdown");
  });

  it("should display category ratings", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("category-ratings")).toBeInTheDocument();
  });

  it("should display offense category", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("category-offense")).toBeInTheDocument();
    expect(screen.getByTestId("category-offense")).toHaveTextContent("공격");
    expect(screen.getByTestId("category-offense")).toHaveTextContent("Offense");
  });

  it("should display defense category", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("category-defense")).toBeInTheDocument();
    expect(screen.getByTestId("category-defense")).toHaveTextContent("방어");
    expect(screen.getByTestId("category-defense")).toHaveTextContent("Defense");
  });

  it("should display technique category", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("category-technique")).toBeInTheDocument();
    expect(screen.getByTestId("category-technique")).toHaveTextContent("기술");
    expect(screen.getByTestId("category-technique")).toHaveTextContent("Technique");
  });

  it("should display efficiency category", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("category-efficiency")).toBeInTheDocument();
    expect(screen.getByTestId("category-efficiency")).toHaveTextContent("효율");
    expect(screen.getByTestId("category-efficiency")).toHaveTextContent("Efficiency");
  });

  it("should display progress bars for each category", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("progress-offense")).toBeInTheDocument();
    expect(screen.getByTestId("progress-defense")).toBeInTheDocument();
    expect(screen.getByTestId("progress-technique")).toBeInTheDocument();
    expect(screen.getByTestId("progress-efficiency")).toBeInTheDocument();
  });

  it("should display technique analysis section", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("technique-analysis")).toBeInTheDocument();
    expect(screen.getByTestId("technique-analysis")).toHaveTextContent("기술 사용 분석");
    expect(screen.getByTestId("technique-analysis")).toHaveTextContent("Technique Analysis");
  });

  it("should display technique counts", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    const analysisSection = screen.getByTestId("technique-analysis");
    expect(analysisSection).toHaveTextContent("5"); // Total uses
    expect(analysisSection).toHaveTextContent("3"); // Unique techniques
  });

  it("should display vital hits count", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    const analysisSection = screen.getByTestId("technique-analysis");
    expect(analysisSection).toHaveTextContent("3"); // Vital hits
  });

  it("should display effectiveness summary", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    expect(screen.getByTestId("effectiveness-summary")).toBeInTheDocument();
    expect(screen.getByTestId("effectiveness-summary")).toHaveTextContent("전투 효율성");
    expect(screen.getByTestId("effectiveness-summary")).toHaveTextContent("Combat Effectiveness");
  });

  it("should adapt layout for mobile", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={true}
        isTablet={false}
      />
    );
    const breakdown = screen.getByTestId("performance-breakdown");
    expect(breakdown).toHaveStyle({ width: "95%" });
  });

  it("should adapt layout for tablet", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={true}
      />
    );
    const breakdown = screen.getByTestId("performance-breakdown");
    expect(breakdown).toHaveStyle({ width: "80%" });
  });

  it("should handle winner as player 1", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    // Should display player 1's stats
    expect(screen.getByTestId("performance-breakdown")).toBeInTheDocument();
  });

  it("should handle winner as player 2", () => {
    const statsWithPlayer2Winner: MatchStatistics = {
      ...mockMatchStats,
      winner: 1,
    };
    render(
      <PerformanceBreakdown
        matchStats={statsWithPlayer2Winner}
        isMobile={false}
        isTablet={false}
      />
    );
    // Should display player 2's stats
    expect(screen.getByTestId("performance-breakdown")).toBeInTheDocument();
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
      <PerformanceBreakdown
        matchStats={statsWithNoTechniques}
        isMobile={false}
        isTablet={false}
      />
    );
    const analysisSection = screen.getByTestId("technique-analysis");
    expect(analysisSection).toHaveTextContent("0"); // Total uses should be 0
  });

  it("should display up to 5 techniques", () => {
    const statsWithManyTechniques: MatchStatistics = {
      ...mockMatchStats,
      player1: {
        ...mockPlayerStats,
        techniques: ["기술1", "기술2", "기술3", "기술4", "기술5", "기술6", "기술7"],
      },
    };
    render(
      <PerformanceBreakdown
        matchStats={statsWithManyTechniques}
        isMobile={false}
        isTablet={false}
      />
    );
    const analysisSection = screen.getByTestId("technique-analysis");
    expect(analysisSection).toHaveTextContent("..."); // Should indicate more techniques
  });

  it("should calculate unique techniques correctly", () => {
    render(
      <PerformanceBreakdown
        matchStats={mockMatchStats}
        isMobile={false}
        isTablet={false}
      />
    );
    // Mock data has 5 total techniques but only 3 unique ones
    const analysisSection = screen.getByTestId("technique-analysis");
    expect(analysisSection).toHaveTextContent("3"); // Unique count
  });
});
