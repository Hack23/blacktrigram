import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AudioProvider } from "../../../audio/AudioProvider";
import { MatchStatistics } from "../../../systems/combat";
import { PlayerArchetype } from "../../../types/common";
import { createPlayerFromArchetype } from "../../../utils/playerUtils";
import { EndScreen3D } from "./EndScreen3D";

// Mock AudioProvider
vi.mock("../../audio/AudioProvider", () => ({
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
  useAudio: () => ({
    isInitialized: true,
    playMusic: vi.fn(),
    stopMusic: vi.fn(),
    playSFX: vi.fn(),
  }),
}));

// Mock Three.js Canvas
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
}));

// Mock @react-three/drei
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
  PerspectiveCamera: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="perspective-camera">{children}</div>
  ),
}));

describe("EndScreen3D", () => {
  const mockMatchStats: MatchStatistics = {
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
      hitsLanded: 8,
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
      hitsTaken: 8,
      hitsLanded: 5,
      totalDamageDealt: 100,
      totalDamageReceived: 150,
      techniques: ["화염지창", "벽력일섬"],
      perfectStrikes: 0,
      vitalPointHits: 1,
      consecutiveWins: 0,
      matchDuration: 120,
    },
  };

  it("should render without crashing", () => {
    const mockOnReturnToMenu = vi.fn();
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { container } = render(
      <AudioProvider>
        <EndScreen3D
          winner={winner}
          matchStats={mockMatchStats}
          onReturnToMenu={mockOnReturnToMenu}
          width={1920}
          height={1080}
        />
      </AudioProvider>
    );

    expect(container).toBeTruthy();
  });

  it("should render with victory screen for player 0", () => {
    const mockOnReturnToMenu = vi.fn();
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { getByTestId } = render(
      <AudioProvider>
        <EndScreen3D
          winner={winner}
          matchStats={mockMatchStats}
          onReturnToMenu={mockOnReturnToMenu}
        />
      </AudioProvider>
    );

    expect(getByTestId("end-screen-3d")).toBeInTheDocument();
    expect(getByTestId("three-canvas")).toBeInTheDocument();
    expect(getByTestId("end-screen-overlay")).toBeInTheDocument();
  });

  it("should display winner name and archetype", () => {
    const mockOnReturnToMenu = vi.fn();
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { getByTestId } = render(
      <AudioProvider>
        <EndScreen3D
          winner={winner}
          matchStats={mockMatchStats}
          onReturnToMenu={mockOnReturnToMenu}
        />
      </AudioProvider>
    );

    const winnerName = getByTestId("winner-name");
    const winnerArchetype = getByTestId("archetype-code");

    expect(winnerName).toBeInTheDocument();
    expect(winnerArchetype).toBeInTheDocument();
    expect(winnerArchetype).toHaveTextContent(
      PlayerArchetype.MUSA.toUpperCase()
    );
  });

  it("should render action buttons", () => {
    const mockOnReturnToMenu = vi.fn();
    const mockOnRematch = vi.fn();
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { getByTestId } = render(
      <AudioProvider>
        <EndScreen3D
          winner={winner}
          matchStats={mockMatchStats}
          onReturnToMenu={mockOnReturnToMenu}
          onRematch={mockOnRematch}
        />
      </AudioProvider>
    );

    expect(getByTestId("return-to-menu-button")).toBeInTheDocument();
    expect(getByTestId("rematch-button")).toBeInTheDocument();
  });

  it("should render match statistics toggle button", () => {
    const mockOnReturnToMenu = vi.fn();
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { getByTestId } = render(
      <AudioProvider>
        <EndScreen3D
          winner={winner}
          matchStats={mockMatchStats}
          onReturnToMenu={mockOnReturnToMenu}
        />
      </AudioProvider>
    );

    expect(getByTestId("toggle-stats-button")).toBeInTheDocument();
  });

  it("should render with defeat screen for player 1", () => {
    const mockOnReturnToMenu = vi.fn();
    const winner = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

    const { getByTestId } = render(
      <AudioProvider>
        <EndScreen3D
          winner={winner}
          matchStats={mockMatchStats}
          onReturnToMenu={mockOnReturnToMenu}
        />
      </AudioProvider>
    );

    expect(getByTestId("end-screen-3d")).toBeInTheDocument();
  });

  it("should handle responsive layouts", () => {
    const mockOnReturnToMenu = vi.fn();
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    // Mobile width
    const { rerender } = render(
      <AudioProvider>
        <EndScreen3D
          winner={winner}
          matchStats={mockMatchStats}
          onReturnToMenu={mockOnReturnToMenu}
          width={400}
          height={800}
        />
      </AudioProvider>
    );

    expect(
      document.querySelector('[data-testid="end-screen-3d"]')
    ).toBeInTheDocument();

    // Desktop width
    rerender(
      <AudioProvider>
        <EndScreen3D
          winner={winner}
          matchStats={mockMatchStats}
          onReturnToMenu={mockOnReturnToMenu}
          width={1920}
          height={1080}
        />
      </AudioProvider>
    );

    expect(
      document.querySelector('[data-testid="end-screen-3d"]')
    ).toBeInTheDocument();
  });

  it("should render optional rematch button when provided", () => {
    const mockOnReturnToMenu = vi.fn();
    const mockOnRematch = vi.fn();
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { getByTestId } = render(
      <AudioProvider>
        <EndScreen3D
          winner={winner}
          matchStats={mockMatchStats}
          onReturnToMenu={mockOnReturnToMenu}
          onRematch={mockOnRematch}
        />
      </AudioProvider>
    );

    expect(getByTestId("rematch-button")).toBeInTheDocument();
  });

  it("should render optional view replay button when provided", () => {
    const mockOnReturnToMenu = vi.fn();
    const mockOnViewReplay = vi.fn();
    const winner = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);

    const { getByTestId } = render(
      <AudioProvider>
        <EndScreen3D
          winner={winner}
          matchStats={mockMatchStats}
          onReturnToMenu={mockOnReturnToMenu}
          onViewReplay={mockOnViewReplay}
        />
      </AudioProvider>
    );

    expect(getByTestId("view-replay-button")).toBeInTheDocument();
  });
});
