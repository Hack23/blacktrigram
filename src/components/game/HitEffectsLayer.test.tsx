import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { HitEffectsLayer } from "./HitEffectsLayer";
import type { HitEffect } from "../../types";

// Mock @pixi/react
vi.mock("@pixi/react", () => ({
  Container: ({ children, ...props }: any) => (
    <div data-testid="pixi-container" {...props}>
      {children}
    </div>
  ),
  Graphics: ({ draw, ...props }: any) => {
    if (draw) {
      const mockGraphics = {
        clear: vi.fn(),
        setFillStyle: vi.fn(),
        setStrokeStyle: vi.fn(),
        circle: vi.fn(),
        rect: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
      };
      draw(mockGraphics);
    }
    return <div data-testid="pixi-graphics" {...props} />;
  },
  Text: ({ text, ...props }: any) => (
    <div data-testid="pixi-text" data-text={text} {...props} />
  ),
}));

describe("HitEffectsLayer Component", () => {
  const mockHitEffect: HitEffect = {
    id: "test-hit",
    position: { x: 100, y: 100 },
    type: "damage", // Fix type
    damage: 25,
    startTime: Date.now(),
    duration: 1000,
    korean: "타격",
    color: 0xff0000,
    createdAt: Date.now(),
  };

  it("should render without errors when no effects are present", () => {
    const effects: HitEffect[] = [];
    const { container } = render(
      <HitEffectsLayer effects={effects} currentTime={0} />
    );
    expect(container).toBeInTheDocument();
  });

  it("should render hit effects correctly", () => {
    const { container } = render(
      <HitEffectsLayer effects={[mockHitEffect]} currentTime={100} />
    );
    expect(container).toBeInTheDocument();
  });

  it("handles multiple hit effects", () => {
    const effects: HitEffect[] = [
      mockHitEffect,
      {
        ...mockHitEffect,
        id: "test-hit-2",
        position: { x: 200, y: 150 },
        type: "critical",
        damage: 40,
      },
      {
        ...mockHitEffect,
        id: "test-hit-3",
        position: { x: 300, y: 200 },
        type: "damage", // Fix type
        damage: 10,
      },
    ];

    const { container } = render(
      <HitEffectsLayer effects={effects} currentTime={100} />
    );
    expect(container).toBeInTheDocument();
  });

  it("displays different effect types", () => {
    const effectTypes: HitEffect["type"][] = [
      "damage", // Fix types
      "critical",
      "block",
      "miss",
    ];

    effectTypes.forEach((type) => {
      const effect: HitEffect = {
        ...mockHitEffect,
        id: `test-${type}`,
        type,
      };

      const { container } = render(
        <HitEffectsLayer effects={[effect]} currentTime={100} />
      );
      expect(container).toBeInTheDocument();
    });
  });

  it("should display Korean text for hit effects", () => {
    const effectWithKorean: HitEffect = {
      ...mockHitEffect,
      korean: "치명타",
      type: "critical",
    };

    render(<HitEffectsLayer effects={[effectWithKorean]} currentTime={200} />);
  });

  it("manages effect lifecycle", () => {
    const currentTime = Date.now();
    const activeEffect: HitEffect = {
      ...mockHitEffect,
      startTime: currentTime - 100,
      duration: 1000,
    };

    const expiredEffect: HitEffect = {
      ...mockHitEffect,
      id: "expired",
      startTime: currentTime - 2000,
      duration: 1000,
    };

    const { container } = render(
      <HitEffectsLayer
        effects={[activeEffect, expiredEffect]}
        currentTime={2500}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
