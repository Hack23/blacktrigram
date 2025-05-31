import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { GameUI } from "./GameUI";
import type { GameUIProps, PlayerState, GamePhase } from "../../types";
import { createPlayerState } from "../../types";

// Mock @pixi/react components
vi.mock("@pixi/react", () => ({
  Container: ({ children, ...props }: any) => (
    <div data-testid="pixi-container" {...props}>
      {children}
    </div>
  ),
  Text: ({ text, style, alpha, ...props }: any) => (
    <div
      data-testid="pixi-text"
      data-text={text}
      data-alpha={alpha}
      style={style}
      {...props}
    />
  ),
}));

// Mock Korean colors and constants
vi.mock("../../types", async () => {
  const actual = await vi.importActual("../../types");
  return {
    ...actual,
    KOREAN_COLORS: {
      GOLD: "#ffd700",
      WHITE: "#ffffff",
      PLAYER_1_BLUE: "#4a89e2",
      PLAYER_2_RED: "#8a0000",
      CRITICAL_RED: "#ff0000",
      CYAN: "#00ffff",
      YELLOW: "#ffff00",
      ORANGE: "#ffa500",
      BLACK: "#000000",
    },
    KOREAN_FONT_FAMILY: "Noto Sans KR, Arial, sans-serif",
  };
});

describe("GameUI", () => {
  let mockPlayers: [PlayerState, PlayerState];
  let baseProps: GameUIProps;

  beforeEach(() => {
    mockPlayers = [
      createPlayerState("Player1", { x: 300, y: 400 }, "geon", {
        health: 80,
        maxHealth: 100,
        ki: 60,
        maxKi: 100,
        stamina: 90,
        maxStamina: 100,
        conditions: [],
      }),
      createPlayerState("Player2", { x: 500, y: 400 }, "li", {
        health: 70,
        maxHealth: 100,
        ki: 40,
        maxKi: 100,
        stamina: 85,
        maxStamina: 100,
        conditions: [
          {
            type: "vulnerable",
            duration: 2000,
            magnitude: 1.5,
            source: "Player1",
          },
        ],
      }),
    ];

    baseProps = {
      players: mockPlayers,
      gamePhase: "combat" as GamePhase,
      onGamePhaseChange: vi.fn(),
      gameTime: Date.now(),
      currentRound: 1,
      timeRemaining: 45,
      onStanceChange: vi.fn(),
      combatLog: ["Player1: 천둥벽력 → 25 피해", "Player2: 화염지창 → 빗나감"],
      onStartMatch: vi.fn(),
      onResetMatch: vi.fn(),
      onTogglePause: vi.fn(),
    };
  });

  it("renders without crashing", () => {
    const { container } = render(<GameUI {...baseProps} />);
    expect(container).toBeInTheDocument();
  });

  it("displays round information correctly", () => {
    render(<GameUI {...baseProps} />);

    // Check for round display
    expect(screen.getByText("라운드 1")).toBeInTheDocument();

    // Check for timer display (0:45)
    expect(screen.getByText("0:45")).toBeInTheDocument();
  });

  it("shows player information for both players", () => {
    render(<GameUI {...baseProps} />);

    // Player 1 info
    expect(screen.getByText("Player1")).toBeInTheDocument();
    expect(screen.getByText("체력: 80/100")).toBeInTheDocument();
    expect(screen.getByText("기력: 60/100")).toBeInTheDocument();
    expect(screen.getByText("자세: GEON")).toBeInTheDocument();

    // Player 2 info
    expect(screen.getByText("Player2")).toBeInTheDocument();
    expect(screen.getByText("체력: 70/100")).toBeInTheDocument();
    expect(screen.getByText("기력: 40/100")).toBeInTheDocument();
    expect(screen.getByText("자세: LI")).toBeInTheDocument();
  });

  it("displays combat log correctly", () => {
    render(<GameUI {...baseProps} />);

    expect(screen.getByText("전투 기록")).toBeInTheDocument();
    expect(screen.getByText("Player1: 천둥벽력 → 25 피해")).toBeInTheDocument();
    expect(screen.getByText("Player2: 화염지창 → 빗나감")).toBeInTheDocument();
  });

  it("shows status effects when present", () => {
    render(<GameUI {...baseProps} />);

    // Player 2 has vulnerable condition
    expect(screen.getByText("상태 효과:")).toBeInTheDocument();
    expect(screen.getByText("• vulnerable")).toBeInTheDocument();
  });

  it("displays correct controls for intro phase", () => {
    const introProps = { ...baseProps, gamePhase: "intro" as GamePhase };
    render(<GameUI {...introProps} />);

    expect(screen.getByText("스페이스바: 게임 시작")).toBeInTheDocument();
    expect(screen.getByText("흑괘 무술 대전")).toBeInTheDocument();
  });

  it("displays correct controls for combat phase", () => {
    render(<GameUI {...baseProps} />);

    expect(screen.getByText("P: 일시정지 | R: 리셋")).toBeInTheDocument();
    expect(screen.getByText("1-8: 팔괘 자세 변경")).toBeInTheDocument();
  });

  it("displays correct controls for result phase", () => {
    const resultProps = { ...baseProps, gamePhase: "result" as GamePhase };
    render(<GameUI {...resultProps} />);

    expect(screen.getByText("R: 다시 시작")).toBeInTheDocument();
    expect(screen.getByText("스페이스바: 계속")).toBeInTheDocument();
    expect(screen.getByText("라운드 종료")).toBeInTheDocument();
  });

  it("displays victory message correctly", () => {
    const victoryProps = { ...baseProps, gamePhase: "victory" as GamePhase };
    render(<GameUI {...victoryProps} />);

    expect(screen.getByText("승리!")).toBeInTheDocument();
  });

  it("displays defeat message correctly", () => {
    const defeatProps = { ...baseProps, gamePhase: "defeat" as GamePhase };
    render(<GameUI {...defeatProps} />);

    expect(screen.getByText("패배!")).toBeInTheDocument();
  });

  it("handles low health display correctly", () => {
    const lowHealthPlayer = createPlayerState(
      "LowHealthPlayer",
      { x: 100, y: 100 },
      "geon",
      {
        health: 20,
        maxHealth: 100,
      }
    );

    const lowHealthProps = {
      ...baseProps,
      players: [lowHealthPlayer, mockPlayers[1]] as [PlayerState, PlayerState],
    };

    render(<GameUI {...lowHealthProps} />);

    expect(screen.getByText("체력: 20/100")).toBeInTheDocument();
  });

  it("shows time warning when timer is low", () => {
    const lowTimeProps = { ...baseProps, timeRemaining: 8 };
    render(<GameUI {...lowTimeProps} />);

    expect(screen.getByText("0:08")).toBeInTheDocument();
  });

  it("limits combat log to 5 entries", () => {
    const longCombatLog = [
      "Entry 1",
      "Entry 2",
      "Entry 3",
      "Entry 4",
      "Entry 5",
      "Entry 6",
      "Entry 7",
    ];

    const longLogProps = { ...baseProps, combatLog: longCombatLog };
    render(<GameUI {...longLogProps} />);

    // Should only show last 5 entries
    expect(screen.getByText("Entry 3")).toBeInTheDocument();
    expect(screen.getByText("Entry 7")).toBeInTheDocument();
    expect(screen.queryByText("Entry 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Entry 2")).not.toBeInTheDocument();
  });

  it("displays health bars visually", () => {
    render(<GameUI {...baseProps} />);

    // Check for visual health bars (Unicode characters)
    const healthBars = screen.getAllByText(/\[█+░*\]/);
    expect(healthBars.length).toBeGreaterThan(0);
  });

  it("handles empty status effects correctly", () => {
    const noEffectsPlayer = createPlayerState(
      "NoEffects",
      { x: 100, y: 100 },
      "geon",
      {
        conditions: [],
      }
    );

    const noEffectsProps = {
      ...baseProps,
      players: [noEffectsPlayer, mockPlayers[1]] as [PlayerState, PlayerState],
    };

    render(<GameUI {...noEffectsProps} />);

    // Should not crash and should render normally
    expect(screen.getByText("NoEffects")).toBeInTheDocument();
  });

  it("uses Korean fonts consistently", () => {
    render(<GameUI {...baseProps} />);

    // Korean text elements should be present
    expect(screen.getByText("라운드 1")).toBeInTheDocument();
    expect(screen.getByText("전투 기록")).toBeInTheDocument();
    expect(screen.getByText("체력: 80/100")).toBeInTheDocument();
    expect(screen.getByText("기력: 60/100")).toBeInTheDocument();
  });

  it("displays correct stance information", () => {
    render(<GameUI {...baseProps} />);

    // Check stance display for both players
    expect(screen.getByText("자세: GEON")).toBeInTheDocument();
    expect(screen.getByText("자세: LI")).toBeInTheDocument();
  });
});
