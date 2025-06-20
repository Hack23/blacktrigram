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

export const createMockPlayer = (overrides: Partial<PlayerState> = {}): PlayerState => ({
  id: "test-player",
  name: { korean: "테스트", english: "Test Player" },
  archetype: PlayerArchetype.MUSA,
  health: 100,
  maxHealth: 100,
  ki: 100,
  maxKi: 100,
  stamina: 100,
  maxStamina: 100,
  balance: 100,
  maxBalance: 100,
  consciousness: 100,
  maxConsciousness: 100,
  pain: 0,
  maxPain: 100,
  currentStance: TrigramStance.GEON,
  position: { x: 0, y: 0 },
  isAlive: true,
  isBlocking: false,
  isExecutingTechnique: false,
  statusEffects: [],
  combatStats: {
    totalDamage: 0,
    criticalHits: 0,
    vitalPointHits: 0,
    techniquesUsed: 0,
    stamina: 100,
    ki: 100,
  },
  energy: 100,
  maxEnergy: 100,
  attackPower: 75,
  defense: 75,
  speed: 75,
  technique: 75,
  accuracy: 0.8,
  criticalChance: 0.1,
  effectiveness: 1.0,
  momentum: 0,
  focus: 100,
  injuries: [],
  skills: [],
  techniques: [],
  equipment: null,
  experience: 0,
  level: 1,
  training: {
    sessions: 0,
    totalTime: 0,
    skillPoints: 0,
  },
  ...overrides,
});

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
