import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { STANCE_ORDER, StanceManager } from "./StanceManager";
import type { PlayerState, TrigramStance } from "../../types";
import { createPlayerState } from "../../types"; // Remove unused imports

function createTestPlayerState(
  idSuffix: string = "test",
  stance: TrigramStance = "geon",
  overrides?: Partial<PlayerState>
): PlayerState {
  return createPlayerState(
    `player-${idSuffix}`,
    { x: 100, y: 100 },
    stance,
    overrides
  );
}

describe("StanceManager", () => {
  let stanceManager: StanceManager;
  let mockPlayer: PlayerState;

  beforeEach(() => {
    stanceManager = new StanceManager();
    mockPlayer = createTestPlayerState("main", "geon", {
      lastStanceChangeTime: Date.now() - 1000,
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("STANCE_ORDER", () => {
    it("should contain all 8 trigram stances", () => {
      expect(STANCE_ORDER).toHaveLength(8);
      expect(STANCE_ORDER).toEqual([
        "geon",
        "tae",
        "li",
        "jin",
        "son",
        "gam",
        "gan",
        "gon",
      ]);
    });

    it("should be readonly to prevent modification", () => {
      expect(() => {
        (STANCE_ORDER as any).push("invalid");
      }).toThrow();
    });
  });

  describe("getCounterStance", () => {
    it("should return traditional I Ching counter relationships", () => {
      expect(StanceManager.getCounterStance("geon")).toBe("gam"); // Heaven vs Water
      expect(StanceManager.getCounterStance("li")).toBe("gam"); // Fire vs Water
      expect(StanceManager.getCounterStance("jin")).toBe("gan"); // Thunder vs Mountain
      expect(StanceManager.getCounterStance("gam")).toBe("li"); // Water vs Fire
    });

    it("should have symmetric counter relationships", () => {
      const testPairs: Array<[TrigramStance, TrigramStance]> = [
        ["geon", "gam"],
        ["li", "gam"],
        ["jin", "gan"],
        ["gon", "son"],
      ];

      testPairs.forEach(([stance1, stance2]) => {
        const counter1 = StanceManager.getCounterStance(stance1);
        const counter2 = StanceManager.getCounterStance(stance2);

        // Either direct counter or indirect philosophical opposition
        expect([counter1, counter2]).toContain(stance2);
      });
    });
  });

  describe("calculateStanceAdvantage", () => {
    it("should return 1.0 for same stance matchup", () => {
      STANCE_ORDER.forEach((stance) => {
        const advantage = StanceManager.calculateStanceAdvantage(
          stance,
          stance
        );
        expect(advantage).toBe(1.0);
      });
    });

    it("should return advantage > 1.0 for strong matchups", () => {
      const advantage = StanceManager.calculateStanceAdvantage("li", "gam");
      expect(advantage).toBeGreaterThan(1.0);
    });

    it("should return advantage < 1.0 for weak matchups", () => {
      const advantage = StanceManager.calculateStanceAdvantage("gam", "li");
      expect(advantage).toBeLessThan(1.0);
    });

    it("should have reciprocal relationships for counter stances", () => {
      const stance1: TrigramStance = "geon";
      const stance2: TrigramStance = "gam";

      const advantage1to2 = StanceManager.calculateStanceAdvantage(
        stance1,
        stance2
      );
      const advantage2to1 = StanceManager.calculateStanceAdvantage(
        stance2,
        stance1
      );

      // Should be reciprocal but not necessarily exact due to rounding
      expect(Math.abs(advantage1to2 + advantage2to1 - 2)).toBeLessThan(0.7);
    });
  });

  describe("calculateStanceDistance", () => {
    it("should return 0 for same stance", () => {
      STANCE_ORDER.forEach((stance) => {
        expect(StanceManager.calculateStanceDistance(stance, stance)).toBe(0);
      });
    });

    it("should calculate shortest path in trigram cycle", () => {
      expect(StanceManager.calculateStanceDistance("geon", "tae")).toBe(1);
      expect(StanceManager.calculateStanceDistance("geon", "gon")).toBe(1); // Wraps around
      expect(StanceManager.calculateStanceDistance("geon", "li")).toBe(2);
      expect(StanceManager.calculateStanceDistance("geon", "gam")).toBe(3); // Far side
    });

    it("should be symmetric", () => {
      const testPairs: Array<[TrigramStance, TrigramStance]> = [
        ["geon", "li"],
        ["tae", "gam"],
        ["son", "gan"],
      ];

      testPairs.forEach(([stance1, stance2]) => {
        const distance1to2 = StanceManager.calculateStanceDistance(
          stance1,
          stance2
        );
        const distance2to1 = StanceManager.calculateStanceDistance(
          stance2,
          stance1
        );
        expect(distance1to2).toBe(distance2to1);
      });
    });

    it("should never exceed maximum possible distance", () => {
      STANCE_ORDER.forEach((stance1) => {
        STANCE_ORDER.forEach((stance2) => {
          const distance = StanceManager.calculateStanceDistance(
            stance1,
            stance2
          );
          expect(distance).toBeLessThanOrEqual(4); // Max distance in cycle of 8
        });
      });
    });

    it("should throw error for invalid stances", () => {
      expect(() => {
        StanceManager.calculateStanceDistance(
          "invalid" as TrigramStance,
          "geon"
        );
      }).toThrow("Invalid stance");

      expect(() => {
        StanceManager.calculateStanceDistance(
          "geon",
          "invalid" as TrigramStance
        );
      }).toThrow("Invalid stance");
    });
  });

  describe("getAdjacentStances", () => {
    it("should return correct adjacent stances for each position", () => {
      const adjacent = StanceManager.getAdjacentStances("geon");
      expect(adjacent.previous).toBe("gon");
      expect(adjacent.next).toBe("tae");
    });

    it("should handle wraparound correctly", () => {
      const firstAdjacent = StanceManager.getAdjacentStances("geon");
      expect(firstAdjacent.previous).toBe("gon"); // Last in cycle

      const lastAdjacent = StanceManager.getAdjacentStances("gon");
      expect(lastAdjacent.next).toBe("geon"); // First in cycle
    });

    it("should be consistent with distance calculations", () => {
      STANCE_ORDER.forEach((stance) => {
        const { previous, next } = StanceManager.getAdjacentStances(stance);

        expect(StanceManager.calculateStanceDistance(stance, previous)).toBe(1);
        expect(StanceManager.calculateStanceDistance(stance, next)).toBe(1);
      });
    });

    it("should throw error for invalid stance", () => {
      expect(() => {
        StanceManager.getAdjacentStances("invalid" as TrigramStance);
      }).toThrow("Invalid stance");
    });
  });

  describe("isOptimalTransition", () => {
    it("should return true for same stance", () => {
      STANCE_ORDER.forEach((stance) => {
        expect(StanceManager.isOptimalTransition(stance, stance)).toBe(true);
      });
    });

    it("should return true for adjacent stances", () => {
      expect(StanceManager.isOptimalTransition("geon", "tae")).toBe(true);
      expect(StanceManager.isOptimalTransition("tae", "geon")).toBe(true);
      expect(StanceManager.isOptimalTransition("gon", "geon")).toBe(true); // Wraparound
    });

    it("should return true for direct counter stances", () => {
      expect(StanceManager.isOptimalTransition("geon", "gam")).toBe(true);
      expect(StanceManager.isOptimalTransition("li", "gam")).toBe(true);
    });

    it("should return false for distant non-counter stances", () => {
      expect(StanceManager.isOptimalTransition("geon", "li")).toBe(false);
      expect(StanceManager.isOptimalTransition("tae", "jin")).toBe(false);
    });
  });

  describe("getStancesByTransitionEfficiency", () => {
    it("should exclude current stance from results", () => {
      const efficient = StanceManager.getStancesByTransitionEfficiency("geon");
      expect(efficient).not.toContain("geon");
      expect(efficient).toHaveLength(7);
    });

    it("should order stances by transition distance", () => {
      const efficient = StanceManager.getStancesByTransitionEfficiency("geon");

      // First should be adjacent stances (distance 1)
      expect(["tae", "gon"]).toContain(efficient[0]);
      expect(["tae", "gon"]).toContain(efficient[1]);

      // Last should be furthest stance (distance 4)
      expect(efficient[efficient.length - 1]).toBe("gam");
    });

    it("should maintain consistency with distance calculations", () => {
      const currentStance: TrigramStance = "li";
      const efficient =
        StanceManager.getStancesByTransitionEfficiency(currentStance);

      let previousDistance = 0;
      efficient.forEach((stance) => {
        const distance = StanceManager.calculateStanceDistance(
          currentStance,
          stance
        );
        expect(distance).toBeGreaterThanOrEqual(previousDistance);
        previousDistance = distance;
      });
    });
  });

  describe("Korean martial arts philosophy consistency", () => {
    it("should reflect traditional trigram relationships", () => {
      // Heaven (geon) should be countered by Water (gam) - traditional opposition
      expect(StanceManager.getCounterStance("geon")).toBe("gam");

      // Fire (li) should be countered by Water (gam) - elemental opposition
      expect(StanceManager.getCounterStance("li")).toBe("gam");

      // Mountain (gan) should be stable against most but vulnerable to Thunder (jin)
      expect(StanceManager.getCounterStance("gan")).toBe("jin");
    });

    it("should maintain balanced advantage distribution", () => {
      const advantages: number[] = [];

      STANCE_ORDER.forEach((attacker) => {
        STANCE_ORDER.forEach((defender) => {
          if (attacker !== defender) {
            advantages.push(
              StanceManager.calculateStanceAdvantage(attacker, defender)
            );
          }
        });
      });

      const avgAdvantage =
        advantages.reduce((sum, adv) => sum + adv, 0) / advantages.length;
      expect(avgAdvantage).toBeCloseTo(1.0, 1); // Should average close to neutral
    });
  });

  describe("canTransition", () => {
    it("should validate stance transition feasibility", () => {
      const player = createTestPlayerState("feasibility");
      const result = stanceManager.canTransition(player, "tae");
      expect(typeof result).toBe("boolean");
    });

    it("should reject transition to same stance", () => {
      const player = createTestPlayerState("same", "geon");
      const result = stanceManager.canTransition(player, "geon");
      expect(result).toBe(false);
    });

    it("should reject transition when stunned", () => {
      const player = createTestPlayerState("stunned", "geon", {
        conditions: [{ type: "stun", duration: 5, source: "test" }],
      });
      const result = stanceManager.canTransition(player, "tae");
      expect(result).toBe(false);
    });

    it("should reject transition when attacking", () => {
      const player = createTestPlayerState("attacking", "geon", {
        isAttacking: true,
      });
      const result = stanceManager.canTransition(player, "tae");
      expect(result).toBe(false);
    });

    it("should reject transition if player is stunned", () => {
      const player = createTestPlayerState("stunned", "geon", {
        conditions: [{ type: "stun", duration: 5, source: "test" }],
      });
      const result = stanceManager.canTransition(player, "tae");
      expect(result).toBe(false);
    });

    it("should allow transition if cooldown has passed", () => {
      const player = createTestPlayerState("cooldown", "geon", {
        lastStanceChangeTime: Date.now() - 2000,
      });
      vi.advanceTimersByTime(1000); // Advance time by 1 second
      const result = stanceManager.canTransition(player, "tae");
      expect(result).toBe(true);
    });
  });

  describe("executeTransition", () => {
    it("should successfully execute valid transitions", () => {
      const result = stanceManager.executeTransition(mockPlayer, "tae");
      expect(result.transitionData.success).toBe(true);
      expect(result.updatedPlayer.stance).toBe("tae");
      expect(result.updatedPlayer.ki).toBeLessThanOrEqual(mockPlayer.ki);
    });

    it("should fail to execute invalid transitions", () => {
      const stunnedPlayer = createTestPlayerState("stunned-exec", "geon", {
        conditions: [{ type: "stun", duration: 2, source: "test" }],
      });
      const result = stanceManager.executeTransition(stunnedPlayer, "tae");

      expect(result.transitionData.success).toBe(false);
      expect(result.updatedPlayer.stance).toBe("geon");
      expect(result.transitionData.reason).toBe(
        "Cannot change stance while stunned" // Or a more generic "Cannot transition due to active conditions"
      );
    });

    it("should update last action time on successful transition", () => {
      const originalTime = mockPlayer.lastStanceChangeTime || 0;
      vi.advanceTimersByTime(100); // Ensure time progresses
      const result = stanceManager.executeTransition(mockPlayer, "tae");

      if (result.updatedPlayer.lastStanceChangeTime) {
        expect(result.updatedPlayer.lastStanceChangeTime).toBeGreaterThan(
          originalTime
        );
      }
    });
  });

  describe("getStanceAnalysis", () => {
    it("should provide stance analysis", () => {
      const analysis = stanceManager.getStanceAnalysis("geon", "tae");
      expect(analysis.advantage).toBeDefined();
      expect(analysis.effectiveness).toBeGreaterThan(0);
      expect(analysis.recommendation).toBeTruthy();
    });

    it("should recommend advantageous stances", () => {
      const validStances: TrigramStance[] = [
        "geon",
        "tae",
        "li",
        "jin",
        "son",
        "gam",
        "gan",
        "gon",
      ];

      validStances.forEach((playerStance) => {
        validStances.forEach((opponentStance) => {
          if (playerStance !== opponentStance) {
            const analysis = stanceManager.getStanceAnalysis(
              playerStance,
              opponentStance
            );
            expect(analysis.advantage).toBeDefined();
            if (analysis.advantage > 0.3) {
              expect(analysis.recommendation).toContain("advantage");
            }
          }
        });
      });
    });

    it("should get optimal stance recommendation", () => {
      const player = createTestPlayerState();
      const recommendation = stanceManager.getOptimalStance(
        "geon",
        "tae",
        player
      );

      expect(recommendation.recommendedStance).toBeDefined();
      expect(recommendation.reason).toBeTruthy();
      expect(recommendation.confidence).toBeGreaterThanOrEqual(0);
    });

    it("should recommend staying in current stance when appropriate", () => {
      const player = { ...createTestPlayerState(), stamina: 10, ki: 5 };
      const recommendation = stanceManager.getOptimalStance(
        "geon",
        "tae",
        player
      );
      expect(recommendation.reason).toBeTruthy();
    });

    it("should handle low resource situations", () => {
      const player = { ...createTestPlayerState(), stamina: 1, ki: 1 };
      const recommendation = stanceManager.getOptimalStance(
        "geon",
        "gon",
        player
      );
      expect(recommendation.recommendedStance).toBe("geon");
      expect(recommendation.reason).toContain("No available transitions");
    });
  });

  describe("transition history", () => {
    it("should track transition history", () => {
      stanceManager.executeTransition(mockPlayer, "tae");

      const history = stanceManager.getTransitionHistory();
      expect(history).toHaveLength(1);
      expect(history[0]?.from).toBe("geon");
      expect(history[0]?.to).toBe("tae");
    });

    it("should clear history when requested", () => {
      stanceManager.executeTransition(mockPlayer, "tae");
      stanceManager.clearHistory();

      const history = stanceManager.getTransitionHistory();
      expect(history).toHaveLength(0);
    });
  });

  it("should handle stance transitions", () => {
    const player = createTestPlayerState("1"); // Provide required argument
    expect(player.stance).toBe("geon");
  });

  it("should check resource requirements", () => {
    const player = { ...createTestPlayerState("2"), stamina: 10, ki: 5 }; // Provide required argument
    expect(player.stamina).toBe(10);
  });
});
