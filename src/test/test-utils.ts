import React from "react";
import { render } from "@testing-library/react";
import type { PlayerState } from "../types/player";
import { PlayerArchetype, TrigramStance } from "../types/enums";
import type { RenderOptions } from "@testing-library/react";
import { CombatState } from "../types/enums";

export function renderWithPixi(ui: React.ReactElement) {
  return render(ui);
}
export function createMockPlayerState(): PlayerState {
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

export { customRender as render };
export * from "@testing-library/react";
