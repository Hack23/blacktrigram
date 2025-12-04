import { PlayerState } from "@/systems";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import React from "react";
import { CombatState, PlayerArchetype, TrigramStance } from "../types/common";

export function createMockPlayerState(overrides?: Partial<PlayerState>): PlayerState {
  return {
    id: "test",
    name: { korean: "테스트", english: "Test" },
    archetype: PlayerArchetype.MUSA,
    health: 100,
    maxHealth: 100,
    ki: 100,
    maxKi: 100,
    stamina: 100,
    maxStamina: 100,
    energy: 100,
    maxEnergy: 100,
    attackPower: 75,
    defense: 75,
    speed: 75,
    technique: 75,
    pain: 0,
    consciousness: 100,
    balance: 100,
    momentum: 0,
    currentStance: TrigramStance.GEON,
    combatState: CombatState.IDLE,
    position: { x: 0, y: 0 },
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
    experiencePoints: 0,
    ...overrides,
  };
}

// Enhanced render function with proper options
export function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    ...options,
  });
}

export * from "@testing-library/react";
export { customRender as render };
