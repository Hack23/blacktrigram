/**
 * RoundAnnouncement Component Tests
 * 
 * Tests for round announcement display and transitions
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RoundAnnouncement, RoundStats } from "./RoundAnnouncement";
import { PlayerState } from "../../../systems";
import { PlayerArchetype, TrigramStance, CombatState } from "../../../types";

describe("RoundAnnouncement", () => {
  const mockPlayer1: PlayerState = {
    id: "player1",
    name: { korean: "무사", english: "Warrior" },
    archetype: PlayerArchetype.MUSA,
    health: 80,
    maxHealth: 100,
    ki: 90,
    maxKi: 100,
    stamina: 85,
    maxStamina: 100,
    energy: 100,
    maxEnergy: 100,
    attackPower: 15,
    defense: 12,
    speed: 10,
    technique: 14,
    currentStance: TrigramStance.GEON,
    combatState: CombatState.IDLE,
    position: { x: 100, y: 200 },
    isBlocking: false,
    isStunned: false,
    isCountering: false,
    statusEffects: [],
    vitalPointsHit: {},
    hitsLanded: 5,
    hitsTaken: 3,
    comboCount: 2,
    perfectBlockCount: 1,
    totalDamageDealt: 50,
    totalDamageReceived: 30,
    vitalPointHits: 2,
  };

  const mockRoundStats: RoundStats = {
    damageDealt: 50,
    hitsLanded: 5,
    vitalPointsHit: 2,
    accuracy: 75.5,
  };

  const mockCurrentScore = { player1: 1, player2: 0 };

  let onCountdownCompleteMock: ReturnType<typeof vi.fn>;
  let onSkipMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onCountdownCompleteMock = vi.fn();
    onSkipMock = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should render round complete title", () => {
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
      />
    );

    const title = screen.getByTestId("round-complete-title");
    expect(title).toBeInTheDocument();
    expect(title.textContent).toContain("라운드 1 완료!");
    expect(title.textContent).toContain("Round 1 Complete!");
  });

  it("should display round winner", () => {
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
      />
    );

    const winner = screen.getByTestId("round-winner");
    expect(winner).toBeInTheDocument();
    expect(winner.textContent).toContain("무사");
    expect(winner.textContent).toContain("Warrior");
  });

  it("should display current score", () => {
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
      />
    );

    const score = screen.getByTestId("current-score");
    expect(score).toBeInTheDocument();
    expect(score.textContent).toContain("1");
    expect(score.textContent).toContain("0");
  });

  it("should display round statistics when provided", () => {
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        roundStats={mockRoundStats}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
      />
    );

    const stats = screen.getByTestId("round-stats");
    expect(stats).toBeInTheDocument();
    expect(stats.textContent).toContain("50");
    expect(stats.textContent).toContain("5");
    expect(stats.textContent).toContain("2");
    expect(stats.textContent).toContain("75.5");
  });

  it("should display countdown timer", () => {
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
        countdownDuration={3}
      />
    );

    const countdown = screen.getByTestId("countdown-display");
    expect(countdown).toBeInTheDocument();
    expect(countdown.textContent).toBe("3");
  });

  it("should decrement countdown every second", async () => {
    // Use real timers for this test since we're testing setInterval behavior
    vi.useRealTimers();
    
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
        countdownDuration={3}
      />
    );

    const countdown = screen.getByTestId("countdown-display");
    expect(countdown.textContent).toBe("3");

    // Wait for countdown to decrement
    await waitFor(
      () => {
        expect(countdown.textContent).toBe("2");
      },
      { timeout: 1500 }
    );

    // Wait for another decrement
    await waitFor(
      () => {
        expect(countdown.textContent).toBe("1");
      },
      { timeout: 1500 }
    );
    
    vi.useFakeTimers();
  });

  it("should call onCountdownComplete when countdown reaches zero", async () => {
    // Use real timers for this test
    vi.useRealTimers();
    
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
        countdownDuration={1}
      />
    );

    // Wait for countdown to complete
    await waitFor(
      () => {
        expect(onCountdownCompleteMock).toHaveBeenCalledTimes(1);
      },
      { timeout: 2000 }
    );
    
    vi.useFakeTimers();
  });

  it("should call onSkip when skip button is clicked", () => {
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
      />
    );

    const skipButton = screen.getByTestId("skip-countdown-button");
    fireEvent.click(skipButton);

    expect(onSkipMock).toHaveBeenCalledTimes(1);
  });

  it("should call onSkip when Enter key is pressed on skip button", () => {
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
      />
    );

    const skipButton = screen.getByTestId("skip-countdown-button");
    fireEvent.keyDown(skipButton, { key: 'Enter' });

    expect(onSkipMock).toHaveBeenCalledTimes(1);
  });

  it("should call onSkip when Space key is pressed on skip button", () => {
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
      />
    );

    const skipButton = screen.getByTestId("skip-countdown-button");
    fireEvent.keyDown(skipButton, { key: ' ' });

    expect(onSkipMock).toHaveBeenCalledTimes(1);
  });

  it("should show match point indicator when appropriate", () => {
    render(
      <RoundAnnouncement
        roundNumber={2}
        roundWinner={mockPlayer1}
        currentScore={{ player1: 1, player2: 0 }}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
        totalRounds={3}
      />
    );

    const matchPoint = screen.getByTestId("match-point-indicator");
    expect(matchPoint).toBeInTheDocument();
    expect(matchPoint.textContent).toContain("Match Point!");
  });

  it("should adapt layout for mobile screens", () => {
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={true}
      />
    );

    const title = screen.getByTestId("round-complete-title");
    expect(title).toBeInTheDocument();
    // Mobile layout uses smaller font sizes
    expect(title.style.fontSize).toBe("36px");
  });

  it("should handle null round winner", () => {
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={null}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
      />
    );

    const winner = screen.queryByTestId("round-winner");
    expect(winner).not.toBeInTheDocument();
  });

  it("should fade in on mount", async () => {
    // Use real timers for this test
    vi.useRealTimers();
    
    render(
      <RoundAnnouncement
        roundNumber={1}
        roundWinner={mockPlayer1}
        currentScore={mockCurrentScore}
        onCountdownComplete={onCountdownCompleteMock}
        onSkip={onSkipMock}
        isMobile={false}
      />
    );

    const announcement = screen.getByTestId("round-announcement");
    expect(announcement).toBeInTheDocument();
    
    // Initially should have opacity 0
    expect(announcement.style.opacity).toBe("0");

    // After 50ms delay, should start fading in
    await waitFor(
      () => {
        expect(announcement.style.opacity).toBe("1");
      },
      { timeout: 200 }
    );
    
    vi.useFakeTimers();
  });
});
