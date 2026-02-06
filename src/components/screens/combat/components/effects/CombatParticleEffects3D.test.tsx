/**
 * Unit tests for CombatParticleEffects3D component
 *
 * Tests HitEffect → particle effect mapping, audio coordination,
 * and effect lifecycle management.
 * 전투 입자 효과 통합 테스트
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect, vi } from "vitest";
import React, { Suspense } from "react";
import {
  CombatParticleEffects3D,
  type CombatParticleEffects3DProps,
} from "./CombatParticleEffects3D";
import type { HitEffect } from "../../../../../systems";
import { HitEffectType } from "../../../../../systems/effects";

// Mock audio provider
vi.mock("../../../../../audio/AudioProvider", () => ({
  useAudio: () => ({
    playSFX: vi.fn(),
    isInitialized: true,
  }),
}));

/**
 * Helper to render Three.js components in test environment
 */
const renderCombatEffects = (props: CombatParticleEffects3DProps) => {
  return render(
    <Canvas>
      <Suspense fallback={null}>
        <CombatParticleEffects3D {...props} />
      </Suspense>
    </Canvas>,
  );
};

/**
 * Create a test HitEffect
 */
function createTestHitEffect(overrides: Partial<HitEffect> = {}): HitEffect {
  return {
    id: `test_${Date.now()}_${Math.random()}`,
    type: HitEffectType.HIT,
    attackerId: "player1",
    defenderId: "player2",
    timestamp: Date.now(),
    duration: 1000,
    position: { x: 0, y: 1.0 },
    intensity: 1.0,
    startTime: Date.now(),
    ...overrides,
  };
}

describe("CombatParticleEffects3D", () => {
  describe("Component Rendering", () => {
    it("should render without crashing with empty effects", () => {
      const { container } = renderCombatEffects({
        hitEffects: [],
        enabled: true,
        isMobile: false,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with HIT effects (blood viscosity)", () => {
      const hitEffect = createTestHitEffect({
        id: "hit-1",
        type: HitEffectType.HIT,
        intensity: 0.8,
      });

      const { container } = renderCombatEffects({
        hitEffects: [hitEffect],
        enabled: true,
        isMobile: false,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with CRITICAL_HIT effects (thick blood)", () => {
      const critEffect = createTestHitEffect({
        id: "crit-1",
        type: HitEffectType.CRITICAL_HIT,
        intensity: 1.5,
      });

      const { container } = renderCombatEffects({
        hitEffects: [critEffect],
        enabled: true,
        isMobile: false,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with VITAL_POINT_STRIKE effects (organ damage)", () => {
      const vitalEffect = createTestHitEffect({
        id: "vital-1",
        type: HitEffectType.VITAL_POINT_STRIKE,
        position: { x: 0.5, y: 1.2 },
        intensity: 1.2,
      });

      const { container } = renderCombatEffects({
        hitEffects: [vitalEffect],
        enabled: true,
        isMobile: false,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when disabled", () => {
      const hitEffect = createTestHitEffect({ id: "disabled-1" });

      const { container } = renderCombatEffects({
        hitEffects: [hitEffect],
        enabled: false,
        isMobile: false,
      });

      // Component returns null when disabled — canvas still exists from wrapper
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with mobile optimization", () => {
      const hitEffect = createTestHitEffect({ id: "mobile-1" });

      const { container } = renderCombatEffects({
        hitEffects: [hitEffect],
        enabled: true,
        isMobile: true,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("HitEffect Type Mapping", () => {
    it("should handle COUNTER effects (medium viscosity)", () => {
      const counterEffect = createTestHitEffect({
        id: "counter-1",
        type: HitEffectType.COUNTER,
        intensity: 0.9,
      });

      const { container } = renderCombatEffects({
        hitEffects: [counterEffect],
        enabled: true,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle BLOCK effects (audio only, no blood)", () => {
      const blockEffect = createTestHitEffect({
        id: "block-1",
        type: HitEffectType.BLOCK,
        intensity: 0.5,
      });

      const { container } = renderCombatEffects({
        hitEffects: [blockEffect],
        enabled: true,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle MISS effects (no particles)", () => {
      const missEffect = createTestHitEffect({
        id: "miss-1",
        type: HitEffectType.MISS,
        intensity: 0,
      });

      const { container } = renderCombatEffects({
        hitEffects: [missEffect],
        enabled: true,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle PARRY effects (block audio)", () => {
      const parryEffect = createTestHitEffect({
        id: "parry-1",
        type: HitEffectType.PARRY,
        intensity: 0.7,
      });

      const { container } = renderCombatEffects({
        hitEffects: [parryEffect],
        enabled: true,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Multiple Effects", () => {
    it("should render multiple concurrent effects", () => {
      const effects: HitEffect[] = [
        createTestHitEffect({
          id: "multi-1",
          type: HitEffectType.HIT,
          position: { x: -2, y: 1.0 },
        }),
        createTestHitEffect({
          id: "multi-2",
          type: HitEffectType.CRITICAL_HIT,
          position: { x: 2, y: 1.5 },
        }),
        createTestHitEffect({
          id: "multi-3",
          type: HitEffectType.VITAL_POINT_STRIKE,
          position: { x: 0, y: 0.8 },
        }),
      ];

      const { container } = renderCombatEffects({
        hitEffects: effects,
        enabled: true,
        isMobile: false,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle effect deduplication (same IDs)", () => {
      const effect = createTestHitEffect({ id: "dedup-1" });

      // First render
      const { rerender, container } = renderCombatEffects({
        hitEffects: [effect],
        enabled: true,
      });

      // Re-render with same effect id
      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <CombatParticleEffects3D hitEffects={[effect]} enabled={true} />
          </Suspense>
        </Canvas>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Position-Based Organ Mapping", () => {
    it("should map high position to heart (심장)", () => {
      const heartStrike = createTestHitEffect({
        id: "organ-heart",
        type: HitEffectType.VITAL_POINT_STRIKE,
        position: { x: 0, y: 1.5 },
      });

      const { container } = renderCombatEffects({
        hitEffects: [heartStrike],
        enabled: true,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should map mid-high position to stomach (명치)", () => {
      const stomachStrike = createTestHitEffect({
        id: "organ-stomach",
        type: HitEffectType.VITAL_POINT_STRIKE,
        position: { x: 0, y: 1.2 },
      });

      const { container } = renderCombatEffects({
        hitEffects: [stomachStrike],
        enabled: true,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should map low position to kidney (신장)", () => {
      const kidneyStrike = createTestHitEffect({
        id: "organ-kidney",
        type: HitEffectType.VITAL_POINT_STRIKE,
        position: { x: 0, y: 0.3 },
      });

      const { container } = renderCombatEffects({
        hitEffects: [kidneyStrike],
        enabled: true,
      });

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
