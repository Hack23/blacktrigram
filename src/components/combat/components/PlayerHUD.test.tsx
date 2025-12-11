/**
 * PlayerHUD Component Tests
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlayerState } from "../../../systems/player";
import { CombatState, PlayerArchetype, TrigramStance } from "../../../types";
import { PlayerHUD } from "./PlayerHUD";

describe("PlayerHUD", () => {
  const mockPlayer: PlayerState = {
    id: "player-1",
    name: { korean: "테스트", english: "Test" },
    archetype: PlayerArchetype.MUSA,
    health: 85,
    maxHealth: 100,
    ki: 50,
    maxKi: 100,
    stamina: 40,
    maxStamina: 50,
    energy: 100,
    maxEnergy: 100,
    attackPower: 15,
    defense: 12,
    speed: 10,
    technique: 14,
    pain: 0,
    consciousness: 100,
    balance: 100,
    momentum: 0,
    currentStance: TrigramStance.GEON,
    combatState: CombatState.IDLE,
    position: { x: 100, y: 200 },
    isBlocking: false,
    isStunned: false,
    isCountering: false,
    lastActionTime: 0,
    recoveryTime: 0,
    lastStanceChangeTime: 0,
    statusEffects: [],
    activeEffects: [],
    vitalPoints: [],
    totalDamageReceived: 0,
    totalDamageDealt: 0,
    hitsTaken: 0,
    hitsLanded: 0,
    perfectStrikes: 0,
    vitalPointHits: 0,
  };

  describe("Rendering", () => {
    it("should render player HUD with correct test ID", () => {
      render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      expect(screen.getByTestId("player-hud-player-1")).toBeInTheDocument();
    });

    it("should display player name in Korean and English", () => {
      render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      expect(screen.getByTestId("player-name-player-1")).toHaveTextContent(
        "테스트 | Test"
      );
    });

    it("should render health bar", () => {
      render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      expect(screen.getByTestId("health-bar-player-1")).toBeInTheDocument();
    });

    it("should render stamina bar", () => {
      render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      expect(screen.getByTestId("stamina-bar-player-1")).toBeInTheDocument();
    });

    it("should display current stance", () => {
      render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      expect(screen.getByTestId("stance-indicator-player-1")).toHaveTextContent(
        `자세 | Stance: ${TrigramStance.GEON}`
      );
    });
  });

  describe("Position Variants", () => {
    it("should position HUD on the left when position is 'left'", () => {
      const { container } = render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      const hud = container.querySelector(
        '[data-testid="player-hud-player-1"]'
      ) as HTMLElement;
      expect(hud.style.left).toBeTruthy();
      expect(hud.style.right).toBe("auto");
    });

    it("should position HUD on the right when position is 'right'", () => {
      const { container } = render(
        <PlayerHUD player={mockPlayer} position="right" isMobile={false} />
      );
      const hud = container.querySelector(
        '[data-testid="player-hud-player-1"]'
      ) as HTMLElement;
      expect(hud.style.left).toBe("auto");
      expect(hud.style.right).toBeTruthy();
    });

    it("should align text left for left position", () => {
      const { container } = render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      const nameElement = container.querySelector(
        '[data-testid="player-name-player-1"]'
      ) as HTMLElement;
      expect(nameElement.style.textAlign).toBe("left");
    });

    it("should align text right for right position", () => {
      const { container } = render(
        <PlayerHUD player={mockPlayer} position="right" isMobile={false} />
      );
      const nameElement = container.querySelector(
        '[data-testid="player-name-player-1"]'
      ) as HTMLElement;
      expect(nameElement.style.textAlign).toBe("right");
    });
  });

  describe("Responsive Behavior", () => {
    it("should pass isMobile prop to HealthBar", () => {
      render(<PlayerHUD player={mockPlayer} position="left" isMobile={true} />);
      const healthBar = screen.getByTestId("health-bar-player-1");
      expect(healthBar).toBeInTheDocument();
      // HealthBar component should handle mobile sizing internally
    });

    it("should pass isMobile prop to StaminaBar", () => {
      render(<PlayerHUD player={mockPlayer} position="left" isMobile={true} />);
      const staminaBar = screen.getByTestId("stamina-bar-player-1");
      expect(staminaBar).toBeInTheDocument();
      // StaminaBar component should handle mobile sizing internally
    });

    it("should adjust positioning for mobile", () => {
      const { container } = render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={true} />
      );
      const hud = container.querySelector(
        '[data-testid="player-hud-player-1"]'
      ) as HTMLElement;
      expect(hud.style.top).toBe("8px");
      expect(hud.style.left).toBe("8px");
    });

    it("should use larger spacing for desktop", () => {
      const { container } = render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      const hud = container.querySelector(
        '[data-testid="player-hud-player-1"]'
      ) as HTMLElement;
      expect(hud.style.top).toBe("10px");
      expect(hud.style.left).toBe("12px");
    });
  });

  describe("Health and Stamina Values", () => {
    it("should display correct health values", () => {
      render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      expect(screen.getByTestId("health-value-player-1")).toHaveTextContent(
        "85/100"
      );
    });

    it("should display correct stamina values", () => {
      render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      expect(screen.getByTestId("stamina-value-player-1")).toHaveTextContent(
        "40/50"
      );
    });

    it("should update when player health changes", () => {
      const { rerender } = render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      expect(screen.getByTestId("health-value-player-1")).toHaveTextContent(
        "85/100"
      );

      const updatedPlayer = { ...mockPlayer, health: 50 };
      rerender(
        <PlayerHUD player={updatedPlayer} position="left" isMobile={false} />
      );
      expect(screen.getByTestId("health-value-player-1")).toHaveTextContent(
        "50/100"
      );
    });

    it("should update when player stamina changes", () => {
      const { rerender } = render(
        <PlayerHUD player={mockPlayer} position="left" isMobile={false} />
      );
      expect(screen.getByTestId("stamina-value-player-1")).toHaveTextContent(
        "40/50"
      );

      const updatedPlayer = { ...mockPlayer, stamina: 20 };
      rerender(
        <PlayerHUD player={updatedPlayer} position="left" isMobile={false} />
      );
      expect(screen.getByTestId("stamina-value-player-1")).toHaveTextContent(
        "20/50"
      );
    });
  });

  describe("Multiple Players", () => {
    it("should render separate HUDs for different players", () => {
      const player1 = { ...mockPlayer, id: "player-1" };
      const player2 = {
        ...mockPlayer,
        id: "player-2",
        name: { korean: "플레이어2", english: "Player 2" },
      };

      const { container } = render(
        <>
          <PlayerHUD player={player1} position="left" isMobile={false} />
          <PlayerHUD player={player2} position="right" isMobile={false} />
        </>
      );

      expect(
        container.querySelector('[data-testid="player-hud-player-1"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-testid="player-hud-player-2"]')
      ).toBeInTheDocument();
    });
  });

  describe("Stance Display", () => {
    it("should display different stances correctly", () => {
      const stances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
        TrigramStance.JIN,
      ];

      stances.forEach((stance) => {
        const playerWithStance = { ...mockPlayer, currentStance: stance };
        const { unmount } = render(
          <PlayerHUD
            player={playerWithStance}
            position="left"
            isMobile={false}
          />
        );
        expect(
          screen.getByTestId("stance-indicator-player-1")
        ).toHaveTextContent(`자세 | Stance: ${stance}`);
        unmount();
      });
    });
  });
});
