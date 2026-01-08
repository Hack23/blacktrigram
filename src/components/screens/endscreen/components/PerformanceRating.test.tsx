import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PerformanceRating } from "./PerformanceRating";
import { AudioProvider } from "../../../audio/AudioProvider";
import { MatchStatistics } from "../../../../systems/combat";

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

describe("PerformanceRating", () => {
  const createMockMatchStats = (overrides: Partial<MatchStatistics> = {}): MatchStatistics => ({
    totalDamageDealt: 150,
    totalDamageTaken: 100,
    criticalHits: 3,
    vitalPointHits: 2,
    techniquesUsed: 8,
    perfectStrikes: 1,
    consecutiveWins: 1,
    matchDuration: 120,
    totalMatches: 1,
    maxRounds: 3,
    winner: 0,
    totalRounds: 2,
    currentRound: 2,
    timeRemaining: 0,
    combatEvents: [],
    finalScore: { player1: 2, player2: 0 },
    roundsWon: { player1: 2, player2: 0 },
    player1: {
      wins: 1,
      losses: 0,
      hitsTaken: 5,
      hitsLanded: 15,
      totalDamageDealt: 150,
      totalDamageReceived: 100,
      techniques: ["천둥벽력", "유수연타"],
      perfectStrikes: 1,
      vitalPointHits: 2,
      consecutiveWins: 1,
      matchDuration: 120,
    },
    player2: {
      wins: 0,
      losses: 1,
      hitsTaken: 15,
      hitsLanded: 5,
      totalDamageDealt: 100,
      totalDamageReceived: 150,
      techniques: ["화염지창", "벽력일섬"],
      perfectStrikes: 0,
      vitalPointHits: 1,
      consecutiveWins: 0,
      matchDuration: 120,
    },
    ...overrides,
  });

  it("should render without crashing", () => {
    const mockStats = createMockMatchStats();

    const { container } = render(
      <AudioProvider>
        <PerformanceRating
          matchStats={mockStats}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(container).toBeTruthy();
  });

  it("should display performance rating component", () => {
    const mockStats = createMockMatchStats();

    const { getByTestId } = render(
      <AudioProvider>
        <PerformanceRating
          matchStats={mockStats}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(getByTestId("performance-rating")).toBeInTheDocument();
  });

  it("should display rating label in Korean and English", () => {
    const mockStats = createMockMatchStats();

    const { getByTestId } = render(
      <AudioProvider>
        <PerformanceRating
          matchStats={mockStats}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const ratingLabel = getByTestId("rating-label");
    expect(ratingLabel).toBeInTheDocument();
    expect(ratingLabel).toHaveTextContent("전투 등급");
    expect(ratingLabel).toHaveTextContent("Performance Rating");
  });

  it("should display rating letter (S, A, B, or C)", () => {
    const mockStats = createMockMatchStats();

    const { getByTestId } = render(
      <AudioProvider>
        <PerformanceRating
          matchStats={mockStats}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const ratingLetter = getByTestId("rating-letter");
    expect(ratingLetter).toBeInTheDocument();
    expect(ratingLetter.textContent).toMatch(/^[SABC]$/);
  });

  it("should award S rating for excellent performance", () => {
    const mockStats = createMockMatchStats({
      player1: {
        wins: 1,
        losses: 0,
        hitsTaken: 2,
        hitsLanded: 20,
        totalDamageDealt: 200,
        totalDamageReceived: 30,
        techniques: ["천둥벽력"],
        perfectStrikes: 10,
        vitalPointHits: 8,
        consecutiveWins: 1,
        matchDuration: 45,
      },
      criticalHits: 8,
      vitalPointHits: 8,
      perfectStrikes: 10,
      matchDuration: 45,
    });

    const { getByTestId } = render(
      <AudioProvider>
        <PerformanceRating
          matchStats={mockStats}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const ratingLetter = getByTestId("rating-letter");
    expect(ratingLetter).toHaveTextContent("S");
  });

  it("should award C rating for poor performance", () => {
    const mockStats = createMockMatchStats({
      player1: {
        wins: 1,
        losses: 0,
        hitsTaken: 15,
        hitsLanded: 5,
        totalDamageDealt: 50,
        totalDamageReceived: 150,
        techniques: ["천둥벽력"],
        perfectStrikes: 0,
        vitalPointHits: 0,
        consecutiveWins: 1,
        matchDuration: 180,
      },
      criticalHits: 0,
      vitalPointHits: 0,
      perfectStrikes: 0,
      matchDuration: 180,
    });

    const { getByTestId } = render(
      <AudioProvider>
        <PerformanceRating
          matchStats={mockStats}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const ratingLetter = getByTestId("rating-letter");
    expect(ratingLetter).toHaveTextContent("C");
  });

  it("should display rating description", () => {
    const mockStats = createMockMatchStats();

    const { getByTestId } = render(
      <AudioProvider>
        <PerformanceRating
          matchStats={mockStats}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const ratingDescription = getByTestId("rating-description");
    expect(ratingDescription).toBeInTheDocument();
  });

  it("should display performance score", () => {
    const mockStats = createMockMatchStats();

    const { getByTestId } = render(
      <AudioProvider>
        <PerformanceRating
          matchStats={mockStats}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const performanceScore = getByTestId("performance-score");
    expect(performanceScore).toBeInTheDocument();
    expect(parseInt(performanceScore.textContent || "0")).toBeGreaterThanOrEqual(0);
    expect(parseInt(performanceScore.textContent || "100")).toBeLessThanOrEqual(100);
  });

  it("should display score breakdown with combat stats", () => {
    const mockStats = createMockMatchStats({
      criticalHits: 5,
      player1: {
        wins: 1,
        losses: 0,
        hitsTaken: 5,
        hitsLanded: 15,
        totalDamageDealt: 150,
        totalDamageReceived: 100,
        techniques: ["천둥벽력", "유수연타", "화염지창"],
        perfectStrikes: 2,
        vitalPointHits: 3,
        consecutiveWins: 1,
        matchDuration: 120,
      },
    });

    const { getByTestId } = render(
      <AudioProvider>
        <PerformanceRating
          matchStats={mockStats}
          isMobile={false}
          isTablet={false}
        />
      </AudioProvider>
    );

    const scoreBreakdown = getByTestId("score-breakdown");
    expect(scoreBreakdown).toBeInTheDocument();
    expect(scoreBreakdown).toHaveTextContent("2"); // perfect strikes (player1)
    expect(scoreBreakdown).toHaveTextContent("3"); // vital point hits (player1)
    expect(scoreBreakdown).toHaveTextContent("3"); // techniques used (player1)
    expect(scoreBreakdown).toHaveTextContent("5"); // critical hits (match-level)
  });

  it("should adapt layout for mobile", () => {
    const mockStats = createMockMatchStats();

    const { getByTestId } = render(
      <AudioProvider>
        <PerformanceRating
          matchStats={mockStats}
          isMobile={true}
          isTablet={false}
        />
      </AudioProvider>
    );

    expect(getByTestId("performance-rating")).toBeInTheDocument();
  });

  it("should adapt layout for tablet", () => {
    const mockStats = createMockMatchStats();

    const { getByTestId } = render(
      <AudioProvider>
        <PerformanceRating
          matchStats={mockStats}
          isMobile={false}
          isTablet={true}
        />
      </AudioProvider>
    );

    expect(getByTestId("performance-rating")).toBeInTheDocument();
  });
});
