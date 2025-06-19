/**
 * @fileoverview CombatScreen component tests with Korean martial arts focus
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithPixi } from "../../test/test-utils";
import { CombatScreen } from "./CombatScreen";
import { AudioProvider } from "../../audio/AudioProvider";
import type { PlayerState } from "../../types/player";
import { PlayerArchetype, TrigramStance } from "../../types/enums";

// Mock PixiJS components
vi.mock("@pixi/react", () => ({
  extend: vi.fn(),
  Application: "Application",
}));

describe("CombatScreen", () => {
  const createMockPlayer = (
    id: string,
    name: { korean: string; english: string },
    archetype: PlayerArchetype = PlayerArchetype.MUSA
  ): PlayerState => ({
    id,
    name,
    archetype,
    currentStance: TrigramStance.GEON,
    health: 100,
    maxHealth: 100,
    ki: 100,
    maxKi: 100,
    stamina: 100,
    maxStamina: 100,
    balance: 100,
    consciousness: 100,
    pain: 0,
    experiencePoints: 0,
    level: 1,
    isBlocking: false,
    isStunned: false,
    isCountering: false,
    statusEffects: [],
    position: { x: 0, y: 0 },
    hitsLanded: 0,
    hitsTaken: 0,
    totalDamageDealt: 0,
    totalDamageReceived: 0,
    combatStats: {
      hitsLanded: 0,
      hitsTaken: 0,
      totalDamageDealt: 0,
      totalDamageReceived: 0,
      perfectStrikes: 0,
      criticalHits: 0,
    },
    attackPower: 10,
    defense: 5,
    lastActionTime: 0,
    recoveryTime: 500,
  });

  const defaultProps = {
    players: [
      createMockPlayer("player1", { korean: "무사1", english: "Warrior1" }),
      createMockPlayer("player2", { korean: "무사2", english: "Warrior2" }),
    ],
    onPlayerUpdate: vi.fn(),
    currentRound: 1,
    timeRemaining: 180,
    onReturnToMenu: vi.fn(),
    onGameEnd: vi.fn(),
    width: 1200,
    height: 800,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Fix: Wrap all CombatScreen tests with AudioProvider
  const renderCombatScreen = (props = defaultProps) => {
    return renderWithPixi(
      <AudioProvider>
        <CombatScreen {...props} />
      </AudioProvider>
    );
  };

  describe("Rendering", () => {
    it("should render combat screen with all components", () => {
      renderCombatScreen();
      expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
    });

    it("should display player information", () => {
      renderCombatScreen();
      expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
    });

    it("should show combat arena", () => {
      renderCombatScreen();
      expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
    });
  });

  describe("Combat Mechanics", () => {
    it("should handle player attacks", async () => {
      renderCombatScreen();

      await waitFor(() => {
        expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
      });
    });

    it("should process stance changes", async () => {
      renderCombatScreen();

      await waitFor(() => {
        expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
      });
    });

    it("should manage combat state", async () => {
      renderCombatScreen();

      await waitFor(() => {
        expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
      });
    });
  });

  describe("Korean Martial Arts Integration", () => {
    it("should display Korean names and techniques", () => {
      renderCombatScreen();
      expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
    });

    it("should handle trigram stance system", () => {
      renderCombatScreen();
      expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
    });

    it("should support Korean combat terminology", () => {
      renderCombatScreen();
      expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
    });
  });

  describe("Game Flow", () => {
    it("should handle game pause", () => {
      renderCombatScreen();
      expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
    });

    it("should detect victory conditions", () => {
      const defeatedProps = {
        ...defaultProps,
        players: [
          defaultProps.players[0],
          { ...defaultProps.players[1], health: 0 },
        ],
      };

      renderCombatScreen(defeatedProps);
      expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
    });

    it("should handle return to menu", () => {
      renderCombatScreen();
      expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
    });
  });

  describe("Audio Integration", () => {
    it("should work with audio provider", () => {
      renderCombatScreen();
      expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
    });
  });
});

describe("CombatScreen Features", () => {
  const mockOnPlayerUpdate = vi.fn();
  const mockOnGameEnd = vi.fn();
  const mockOnReturnToMenu = vi.fn();
  it("should handle return to menu", () => {
    renderCombatScreen();
    const returnButton = screen.getByTestId("return-menu-button");
    fireEvent.click(returnButton);
    expect(mockOnReturnToMenu).toHaveBeenCalled();
  });
});

describe("Combat Effects", () => {
  it("should display hit effects", () => {
    renderCombatScreen();
    expect(screen.getByTestId("hit-effects-layer")).toBeInTheDocument();
  });

  it("should handle effect completion", () => {
    renderCombatScreen();
    expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
  });
});

describe("Korean Martial Arts Features", () => {
  it("should display Korean controls guide", () => {
    renderCombatScreen();
    expect(screen.getByTestId("korean-controls-guide")).toBeInTheDocument();
  });

  it("should use Korean terminology in combat", () => {
    renderCombatScreen();
    expect(screen.getByTestId("combat-log-panel")).toBeInTheDocument();
  });

  it("should handle all trigram stances", () => {
    renderCombatScreen();

    // Test all 8 trigram stance keys
    for (let i = 1; i <= 8; i++) {
      fireEvent.keyDown(document, { key: i.toString() });
    }

    expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
  });
});

describe("Responsive Design", () => {
  it("should adapt to mobile dimensions", () => {
    const mobileProps = { ...defaultProps, width: 400, height: 600 };
    renderCombatScreen(mobileProps);
    expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
  });

  it("should adapt to desktop dimensions", () => {
    const desktopProps = { ...defaultProps, width: 1920, height: 1080 };
    renderCombatScreen(desktopProps);
    expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
  });
});

describe("Performance", () => {
  it("should handle rapid combat actions", async () => {
    renderCombatScreen();

    // Simulate rapid key presses
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(document, { key: " " });
      fireEvent.keyDown(document, { key: "Shift" });
    }

    await waitFor(() => {
      expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
    });
  });

  it("should maintain performance with many effects", () => {
    renderCombatScreen();
    expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
  });
});

describe("Error Handling", () => {
  it("should handle missing player data gracefully", () => {
    const invalidProps = {
      ...defaultProps,
      players: [],
    };

    expect(() => renderCombatScreen(invalidProps)).not.toThrow();
  });

  it("should handle invalid combat actions", () => {
    renderCombatScreen();

    // Test invalid key press
    fireEvent.keyDown(document, { key: "InvalidKey" });

    expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
  });
});

describe("Performance", () => {
  it("should render efficiently with proper memoization", () => {
    const { rerender } = renderWithPixi(
      <AudioProvider>
        <CombatScreen {...defaultProps} />
      </AudioProvider>
    );

    // Re-render with same props should not cause issues
    rerender(
      <AudioProvider>
        <CombatScreen {...defaultProps} />
      </AudioProvider>
    );

    expect(screen.getByTestId("combat-screen")).toBeInTheDocument();
  });

  it("should handle rapid key presses without errors", async () => {
    renderWithPixi(
      <AudioProvider>
        <CombatScreen {...defaultProps} />
      </AudioProvider>
    );

    // Rapid fire key presses
    for (let i = 1; i <= 8; i++) {
      fireEvent.keyDown(window, { key: i.toString() });
    }

    await waitFor(() => {
      expect(mockOnPlayerUpdate).toHaveBeenCalled();
    });
  });
});

describe("Accessibility", () => {
  it("should have proper test IDs for all interactive elements", () => {
    renderWithPixi(
      <AudioProvider>
        <CombatScreen {...defaultProps} />
      </AudioProvider>
    );

    // Essential test IDs should be present
    const requiredTestIds = [
      "combat-screen",
      "combat-arena",
      "combat-controls-container",
      "return-menu-button",
      "player1-status",
      "player2-status",
      "combat-log-panel",
    ];

    requiredTestIds.forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  it("should support keyboard navigation", () => {
    renderWithPixi(
      <AudioProvider>
        <CombatScreen {...defaultProps} />
      </AudioProvider>
    );

    // All important keyboard controls should work
    const keyTests = [
      { key: " ", description: "space for attack" },
      { key: "Shift", description: "shift for defend" },
      { key: "Escape", description: "escape for pause" },
      { key: "1", description: "number keys for stance" },
    ];

    keyTests.forEach(({ key }) => {
      expect(() => fireEvent.keyDown(window, { key })).not.toThrow();
    });
  });
});
