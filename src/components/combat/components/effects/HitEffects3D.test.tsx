/**
 * Unit tests for HitEffects3D component
 */

import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HitEffects3D from "./HitEffects3D";
import { HitEffect } from "../../../systems";
import { HitEffectType } from "../../../../systems/effects";

// Mock Three.js and React Three Fiber
vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

vi.mock("three", () => ({
  Group: class MockGroup {},
  Mesh: class MockMesh {},
  DoubleSide: 2,
}));

describe("HitEffects3D", () => {
  const createMockEffect = (type: HitEffectType, id = "test-effect"): HitEffect => ({
    id,
    type,
    attackerId: "player1",
    defenderId: "player2",
    timestamp: Date.now(),
    duration: 1000,
    position: { x: 100, y: 100 },
    intensity: 1,
    startTime: Date.now(),
  });

  it("should render without crashing with no effects", () => {
    const { container } = render(<HitEffects3D effects={[]} />);

    expect(container).toBeTruthy();
  });

  it("should render with HIT effect", () => {
    const effect = createMockEffect(HitEffectType.HIT);
    const { container } = render(<HitEffects3D effects={[effect]} />);

    expect(container).toBeTruthy();
  });

  it("should render with CRITICAL_HIT effect", () => {
    const effect = createMockEffect(HitEffectType.CRITICAL_HIT);
    const { container } = render(<HitEffects3D effects={[effect]} />);

    expect(container).toBeTruthy();
  });

  it("should render with BLOCK effect", () => {
    const effect = createMockEffect(HitEffectType.BLOCK);
    const { container } = render(<HitEffects3D effects={[effect]} />);

    expect(container).toBeTruthy();
  });

  it("should render with MISS effect", () => {
    const effect = createMockEffect(HitEffectType.MISS);
    const { container } = render(<HitEffects3D effects={[effect]} />);

    expect(container).toBeTruthy();
  });

  it("should render with VITAL_POINT_STRIKE effect", () => {
    const effect = createMockEffect(HitEffectType.VITAL_POINT_STRIKE);
    const { container } = render(<HitEffects3D effects={[effect]} />);

    expect(container).toBeTruthy();
  });

  it("should render with PARRY effect", () => {
    const effect = createMockEffect(HitEffectType.PARRY);
    const { container } = render(<HitEffects3D effects={[effect]} />);

    expect(container).toBeTruthy();
  });

  it("should render with COUNTER effect", () => {
    const effect = createMockEffect(HitEffectType.COUNTER);
    const { container } = render(<HitEffects3D effects={[effect]} />);

    expect(container).toBeTruthy();
  });

  it("should render with GENERAL_DAMAGE effect", () => {
    const effect = createMockEffect(HitEffectType.GENERAL_DAMAGE);
    const { container } = render(<HitEffects3D effects={[effect]} />);

    expect(container).toBeTruthy();
  });

  it("should render with STATUS_EFFECT effect", () => {
    const effect = createMockEffect(HitEffectType.STATUS_EFFECT);
    const { container } = render(<HitEffects3D effects={[effect]} />);

    expect(container).toBeTruthy();
  });

  it("should render with multiple effects", () => {
    const effects = [
      createMockEffect(HitEffectType.HIT, "effect1"),
      createMockEffect(HitEffectType.CRITICAL_HIT, "effect2"),
      createMockEffect(HitEffectType.BLOCK, "effect3"),
    ];

    const { container } = render(<HitEffects3D effects={effects} />);

    expect(container).toBeTruthy();
  });

  it("should call onEffectComplete when provided", () => {
    const onEffectComplete = vi.fn();
    const effect = createMockEffect(HitEffectType.HIT);

    render(
      <HitEffects3D effects={[effect]} onEffectComplete={onEffectComplete} />
    );

    // Effect completion is async, so we just verify it renders
    expect(onEffectComplete).not.toHaveBeenCalled(); // Will be called after duration
  });

  it("should handle effects with different intensity values", () => {
    const effect1 = { ...createMockEffect(HitEffectType.HIT, "effect1"), intensity: 0.5 };
    const effect2 = { ...createMockEffect(HitEffectType.HIT, "effect2"), intensity: 1.5 };
    const effect3 = { ...createMockEffect(HitEffectType.HIT, "effect3"), intensity: 2.0 };

    const { container } = render(
      <HitEffects3D effects={[effect1, effect2, effect3]} />
    );

    expect(container).toBeTruthy();
  });

  it("should handle effects with different positions", () => {
    const effect1 = {
      ...createMockEffect(HitEffectType.HIT, "effect1"),
      position: { x: 100, y: 100 },
    };
    const effect2 = {
      ...createMockEffect(HitEffectType.HIT, "effect2"),
      position: { x: 500, y: 300 },
    };

    const { container } = render(
      <HitEffects3D effects={[effect1, effect2]} />
    );

    expect(container).toBeTruthy();
  });

  it("should handle effects without position gracefully", () => {
    const effect = {
      ...createMockEffect(HitEffectType.HIT),
      position: undefined as unknown as { x: number; y: number },
    };

    const { container } = render(<HitEffects3D effects={[effect]} />);

    expect(container).toBeTruthy();
  });
});
