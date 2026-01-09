/**
 * Tests for MatchCountdown component
 */

import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MatchCountdown } from "./MatchCountdown";

// Mock Audio Provider
vi.mock("../../../../../audio/AudioProvider", () => ({
  useAudio: () => ({
    isAudioReady: true,
    playSFX: vi.fn(),
    fadeIn: vi.fn(() => Promise.resolve()),
    fadeOut: vi.fn(() => Promise.resolve()),
  }),
}));

// Mock hook functions
const mockStartCountdown = vi.fn();
const mockSkipCountdown = vi.fn();

let mockHookState = {
  state: "ready" as const,
  currentNumber: 3,
  startCountdown: mockStartCountdown,
  skipCountdown: mockSkipCountdown,
  resetCountdown: vi.fn(),
  isActive: true,
};

// Helper to get a fresh copy of mock state
const getMockHookState = () => ({ ...mockHookState });

// Mock useMatchCountdown hook
vi.mock("../../../../../hooks/useMatchCountdown", () => ({
  useMatchCountdown: () => getMockHookState(),
}));

beforeEach(() => {
  vi.useFakeTimers();
  mockStartCountdown.mockClear();
  mockSkipCountdown.mockClear();

  // Reset to default state
  mockHookState = {
    state: "ready",
    currentNumber: 3,
    startCountdown: mockStartCountdown,
    skipCountdown: mockSkipCountdown,
    resetCountdown: vi.fn(),
    isActive: true,
  };
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("MatchCountdown", () => {
  it("should render countdown overlay when active", () => {
    const onComplete = vi.fn();
    render(<MatchCountdown onComplete={onComplete} isMobile={false} />);

    const overlay = screen.getByTestId("match-countdown");
    expect(overlay).toBeInTheDocument();
  });

  it("should display bilingual text", () => {
    const onComplete = vi.fn();
    render(<MatchCountdown onComplete={onComplete} isMobile={false} />);

    const countdownText = screen.getByTestId("countdown-text");
    expect(countdownText).toBeInTheDocument();
    // Should contain both Korean and English text
    expect(countdownText.textContent).toMatch(/준비\?/);
    expect(countdownText.textContent).toMatch(/Ready\?/);
  });

  it("should start countdown on mount", () => {
    const onComplete = vi.fn();
    render(<MatchCountdown onComplete={onComplete} isMobile={false} />);

    expect(mockStartCountdown).toHaveBeenCalledTimes(1);
  });

  it("should adapt for mobile screens", () => {
    const onComplete = vi.fn();
    render(<MatchCountdown onComplete={onComplete} isMobile={true} />);

    // Check that mobile-specific styles are applied
    const countdownText = screen.getByTestId("countdown-text");
    expect(countdownText).toHaveStyle({
      fontSize: expect.stringContaining("px"),
    });
  });

  it("should show skip button when enabled and not in fight state", () => {
    const onComplete = vi.fn();
    const onSkip = vi.fn();
    render(
      <MatchCountdown
        onComplete={onComplete}
        isMobile={false}
        showSkip={true}
        onSkip={onSkip}
      />
    );

    const skipButton = screen.queryByTestId("skip-countdown-button");
    expect(skipButton).toBeInTheDocument();
  });

  it("should not show skip button when disabled", () => {
    const onComplete = vi.fn();
    render(
      <MatchCountdown
        onComplete={onComplete}
        isMobile={false}
        showSkip={false}
      />
    );

    const skipButton = screen.queryByTestId("skip-countdown-button");
    expect(skipButton).toBeNull();
  });

  it("should not render when countdown is not active", () => {
    // Set mock to inactive state
    mockHookState.isActive = false;

    const onComplete = vi.fn();
    const { container } = render(
      <MatchCountdown onComplete={onComplete} isMobile={false} />
    );

    // Should not render content when not active (returns null)
    expect(container.firstChild).toBeNull();
  });

  it("should apply Korean cyberpunk styling", () => {
    const onComplete = vi.fn();
    render(<MatchCountdown onComplete={onComplete} isMobile={false} />);

    const overlay = screen.getByTestId("match-countdown");

    // Check for cyberpunk background
    expect(overlay).toHaveStyle({
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "1000",
    });
  });

  it("should display countdown number", () => {
    mockHookState.state = "counting";
    mockHookState.currentNumber = 3;

    const onComplete = vi.fn();
    render(<MatchCountdown onComplete={onComplete} isMobile={false} />);

    const countdownText = screen.getByTestId("countdown-text");
    expect(countdownText.textContent).toMatch(/3/);
  });

  it("should display fight announcement", () => {
    mockHookState.state = "fight";

    const onComplete = vi.fn();
    render(<MatchCountdown onComplete={onComplete} isMobile={false} />);

    const countdownText = screen.getByTestId("countdown-text");
    expect(countdownText.textContent).toMatch(/전투!/);
    expect(countdownText.textContent).toMatch(/Fight!/);
  });
});
