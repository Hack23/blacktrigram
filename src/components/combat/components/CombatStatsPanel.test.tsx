import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlayerArchetype } from "../../../types/common";
import { createPlayerFromArchetype } from "../../../utils/playerUtils";
import { CombatStatsPanel, CombatLogEntry } from "./CombatStatsPanel";

describe("CombatStatsPanel", () => {
  const mockPlayer1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
  const mockPlayer2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

  const mockCombatLog: CombatLogEntry[] = [
    {
      id: "1",
      timestamp: Date.now() - 1000,
      korean: "공격 성공!",
      english: "Attack Hit!",
      type: "attack",
    },
    {
      id: "2",
      timestamp: Date.now() - 2000,
      korean: "방어 자세",
      english: "Defensive Stance",
      type: "defend",
    },
    {
      id: "3",
      timestamp: Date.now() - 3000,
      korean: "특수 기술 성공!",
      english: "Special Technique Hit!",
      type: "technique",
    },
  ];

  it("should render combat stats panel", () => {
    render(
      <CombatStatsPanel
        players={[mockPlayer1, mockPlayer2]}
        combatLog={mockCombatLog}
        matchDuration={65}
        totalDamageDealt={{ player1: 150, player2: 120 }}
        criticalHits={{ player1: 3, player2: 2 }}
        perfectStrikes={{ player1: 1, player2: 0 }}
      />
    );

    expect(screen.getByTestId("combat-stats")).toBeInTheDocument();
  });

  it("should render with empty combat log", () => {
    render(
      <CombatStatsPanel
        players={[mockPlayer1, mockPlayer2]}
        combatLog={[]}
        matchDuration={10}
        totalDamageDealt={{ player1: 0, player2: 0 }}
        criticalHits={{ player1: 0, player2: 0 }}
        perfectStrikes={{ player1: 0, player2: 0 }}
      />
    );

    expect(screen.getByTestId("combat-stats")).toBeInTheDocument();
  });

  it("should render with long combat log", () => {
    const longLog: CombatLogEntry[] = Array.from({ length: 10 }, (_, i) => ({
      id: `entry-${i}`,
      timestamp: Date.now() - i * 1000,
      korean: `기록 ${i + 1}`,
      english: `Log ${i + 1}`,
      type: "info" as const,
    }));

    render(
      <CombatStatsPanel
        players={[mockPlayer1, mockPlayer2]}
        combatLog={longLog}
        matchDuration={65}
        totalDamageDealt={{ player1: 150, player2: 120 }}
        criticalHits={{ player1: 3, player2: 2 }}
        perfectStrikes={{ player1: 1, player2: 0 }}
        width={400} // Desktop width
      />
    );

    // Should show log entries
    expect(screen.getByTestId("log-entry-0")).toBeInTheDocument();
  });

  it("should render in mobile layout for small widths", () => {
    render(
      <CombatStatsPanel
        players={[mockPlayer1, mockPlayer2]}
        combatLog={mockCombatLog}
        matchDuration={65}
        totalDamageDealt={{ player1: 150, player2: 120 }}
        criticalHits={{ player1: 3, player2: 2 }}
        perfectStrikes={{ player1: 1, player2: 0 }}
        width={300} // Mobile width
        height={180}
      />
    );

    expect(screen.getByTestId("combat-stats")).toBeInTheDocument();
  });

  it("should render with player wins", () => {
    render(
      <CombatStatsPanel
        players={[
          { ...mockPlayer1, wins: 2 },
          { ...mockPlayer2, wins: 1 },
        ]}
        combatLog={mockCombatLog}
        matchDuration={65}
        totalDamageDealt={{ player1: 150, player2: 120 }}
        criticalHits={{ player1: 3, player2: 2 }}
        perfectStrikes={{ player1: 1, player2: 0 }}
      />
    );

    expect(screen.getByTestId("combat-stats")).toBeInTheDocument();
  });

  it("should render with different log entry types", () => {
    const typedLog: CombatLogEntry[] = [
      {
        id: "attack",
        timestamp: Date.now(),
        korean: "공격",
        english: "Attack",
        type: "attack",
      },
      {
        id: "defend",
        timestamp: Date.now(),
        korean: "방어",
        english: "Defend",
        type: "defend",
      },
      {
        id: "technique",
        timestamp: Date.now(),
        korean: "기술",
        english: "Technique",
        type: "technique",
      },
      {
        id: "stance",
        timestamp: Date.now(),
        korean: "자세 변경",
        english: "Stance Change",
        type: "stance",
      },
      {
        id: "damage",
        timestamp: Date.now(),
        korean: "피해",
        english: "Damage",
        type: "damage",
      },
    ];

    render(
      <CombatStatsPanel
        players={[mockPlayer1, mockPlayer2]}
        combatLog={typedLog}
        matchDuration={65}
        totalDamageDealt={{ player1: 150, player2: 120 }}
        criticalHits={{ player1: 3, player2: 2 }}
        perfectStrikes={{ player1: 1, player2: 0 }}
      />
    );

    // Each log entry should be rendered
    expect(screen.getByTestId("log-entry-0")).toBeInTheDocument();
    expect(screen.getByTestId("log-entry-1")).toBeInTheDocument();
    expect(screen.getByTestId("log-entry-2")).toBeInTheDocument();
  });

  it("should handle zero statistics", () => {
    render(
      <CombatStatsPanel
        players={[mockPlayer1, mockPlayer2]}
        combatLog={[]}
        matchDuration={0}
        totalDamageDealt={{ player1: 0, player2: 0 }}
        criticalHits={{ player1: 0, player2: 0 }}
        perfectStrikes={{ player1: 0, player2: 0 }}
      />
    );

    expect(screen.getByTestId("combat-stats")).toBeInTheDocument();
  });

  it("should handle high statistics", () => {
    render(
      <CombatStatsPanel
        players={[mockPlayer1, mockPlayer2]}
        combatLog={mockCombatLog}
        matchDuration={600} // 10 minutes
        totalDamageDealt={{ player1: 1000, player2: 950 }}
        criticalHits={{ player1: 25, player2: 20 }}
        perfectStrikes={{ player1: 15, player2: 12 }}
      />
    );

    expect(screen.getByTestId("combat-stats")).toBeInTheDocument();
  });

  it("should handle different player archetypes", () => {
    // Test just one archetype to avoid multiple renders
    const archetype = PlayerArchetype.HACKER;
    const player = createPlayerFromArchetype(archetype, 0);
    
    render(
      <CombatStatsPanel
        players={[player, mockPlayer2]}
        combatLog={mockCombatLog}
        matchDuration={65}
        totalDamageDealt={{ player1: 150, player2: 120 }}
        criticalHits={{ player1: 3, player2: 2 }}
        perfectStrikes={{ player1: 1, player2: 0 }}
      />
    );

    expect(screen.getByTestId("combat-stats")).toBeInTheDocument();
  });

  it("should handle custom dimensions", () => {
    render(
      <CombatStatsPanel
        players={[mockPlayer1, mockPlayer2]}
        combatLog={mockCombatLog}
        matchDuration={65}
        totalDamageDealt={{ player1: 150, player2: 120 }}
        criticalHits={{ player1: 3, player2: 2 }}
        perfectStrikes={{ player1: 1, player2: 0 }}
        x={50}
        y={100}
        width={500}
        height={250}
      />
    );

    expect(screen.getByTestId("combat-stats")).toBeInTheDocument();
  });
});
