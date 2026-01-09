import { PlayerState } from "@/systems";
import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import React from "react";
import { CombatState, PlayerArchetype, TrigramStance } from "../types/common";

/**
 * Generic mutable type - removes readonly modifier from all properties
 * Use this type when you need to modify readonly properties in tests
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

/**
 * Mutable version of PlayerState for test setup
 * Use this type when you need to modify player properties in tests
 */
export type MutablePlayerState = Mutable<PlayerState>;

/**
 * Cast any object to a mutable version for test setup purposes
 * This allows direct property assignment during test setup on readonly properties
 */
export function asMutable<T>(obj: T): Mutable<T> {
  return obj as Mutable<T>;
}

/**
 * Arena bounds for combat testing
 */
export interface ArenaBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Create mock arena bounds
 */
export function createMockArena(): ArenaBounds {
  return {
    x: 0,
    y: 0,
    width: 1200,
    height: 800,
  };
}

export function createMockPlayerState(
  overrides?: Partial<PlayerState>
): PlayerState {
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

/**
 * Create a modified copy of player state (for tests that need to mutate state)
 * Use this instead of direct property assignment on readonly PlayerState
 */
export function withPlayerState(
  player: PlayerState,
  updates: Partial<PlayerState>
): PlayerState {
  return { ...player, ...updates };
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
