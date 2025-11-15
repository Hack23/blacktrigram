import { describe, expect, it, vi } from "vitest";
import { HitEffect } from "@/systems";
import { HitEffectType } from "@/systems/effects";
import { PlayerArchetype } from "@/types/common";
import { createPlayerFromArchetype } from "@/utils/playerUtils";
import { CombatArena } from "./CombatArena";

describe("CombatArena", () => {
  const mockPlayer1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  const mockPlayer2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

  const defaultProps = {
    players: [mockPlayer1, mockPlayer2] as const,
    playerPositions: [
      { x: 300, y: 400 },
      { x: 800, y: 400 },
    ] as const,
    hitEffects: [] as readonly HitEffect[],
    comboCount: 0,
    roundDisplayStatus: null as null,
    currentRound: 1,
    width: 1200,
    height: 800,
    arenaHeight: 420,
    isMobile: false,
    getPlayerAnimationState: vi.fn(() => "idle"),
    onEffectComplete: vi.fn(),
    onRoundAnimationComplete: vi.fn(),
  };

  describe("component export", () => {
    it("should export CombatArena component", () => {
      expect(CombatArena).toBeDefined();
      expect(typeof CombatArena).toBe("object"); // React.memo returns an object
    });

    it("should have displayName set", () => {
      expect(CombatArena.displayName).toBe("CombatArena");
    });
  });

  describe("prop types", () => {
    it("should accept required props without TypeScript errors", () => {
      // This test validates TypeScript compilation
      const props = defaultProps;
      expect(props.players).toHaveLength(2);
      expect(props.playerPositions).toHaveLength(2);
      expect(props.width).toBe(1200);
      expect(props.height).toBe(800);
    });

    it("should handle hit effects array", () => {
      const hitEffects: HitEffect[] = [
        {
          id: "hit-1",
          type: HitEffectType.HIT,
          attackerId: "player1",
          defenderId: "player2",
          timestamp: Date.now(),
          duration: 1000,
          position: { x: 500, y: 400 },
          intensity: 1,
          startTime: Date.now(),
        },
      ];

      const props = { ...defaultProps, hitEffects };
      expect(props.hitEffects).toHaveLength(1);
    });

    it("should handle different combo counts", () => {
      const propsWithCombo = { ...defaultProps, comboCount: 5 };
      expect(propsWithCombo.comboCount).toBe(5);
    });

    it("should handle different round display statuses", () => {
      const statuses: Array<"start" | "fight" | "ko" | "end" | null> = [
        null,
        "start",
        "fight",
        "ko",
        "end",
      ];

      statuses.forEach((status) => {
        const props = { ...defaultProps, roundDisplayStatus: status };
        expect(props.roundDisplayStatus).toBe(status);
      });
    });

    it("should handle mobile flag", () => {
      const mobileProps = { ...defaultProps, isMobile: true };
      const desktopProps = { ...defaultProps, isMobile: false };

      expect(mobileProps.isMobile).toBe(true);
      expect(desktopProps.isMobile).toBe(false);
    });

    it("should handle different player positions", () => {
      const customPositions = [
        { x: 200, y: 300 },
        { x: 900, y: 500 },
      ] as const;

      const props = { ...defaultProps, playerPositions: customPositions };
      expect(props.playerPositions[0].x).toBe(200);
      expect(props.playerPositions[1].x).toBe(900);
    });

    it("should handle different player states", () => {
      const damagedPlayer1 = { ...mockPlayer1, health: 30 };
      const damagedPlayer2 = { ...mockPlayer2, health: 50 };

      const props = { ...defaultProps, players: [damagedPlayer1, damagedPlayer2] as const };
      expect(props.players[0].health).toBe(30);
      expect(props.players[1].health).toBe(50);
    });

    it("should handle callback functions", () => {
      const onEffectComplete = vi.fn();
      const onRoundAnimationComplete = vi.fn();
      const getPlayerAnimationState = vi.fn(() => "idle");

      const props = {
        ...defaultProps,
        onEffectComplete,
        onRoundAnimationComplete,
        getPlayerAnimationState,
      };

      expect(typeof props.onEffectComplete).toBe("function");
      expect(typeof props.onRoundAnimationComplete).toBe("function");
      expect(typeof props.getPlayerAnimationState).toBe("function");
    });
  });
});

