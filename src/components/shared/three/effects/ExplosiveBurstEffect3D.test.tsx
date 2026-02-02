/**
 * Tests for ExplosiveBurstEffect3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect, vi } from "vitest";
import { ExplosiveBurstEffect3D } from "./ExplosiveBurstEffect3D";
import { Suspense, type ComponentProps } from "react";
import { KOREAN_COLORS } from "../../../../types/constants";

describe("ExplosiveBurstEffect3D", () => {
  const renderBurstEffect = (props: ComponentProps<typeof ExplosiveBurstEffect3D>) => {
    return render(
      <Canvas>
        <Suspense fallback={null}>
          <ExplosiveBurstEffect3D {...props} />
        </Suspense>
      </Canvas>
    );
  };

  it("should render without crashing", () => {
    const { container } = renderBurstEffect({
      position: [0, 1, 0],
      active: true,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should respect active prop", () => {
    const { container } = renderBurstEffect({
      position: [0, 1, 0],
      active: false,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should call onComplete callback", () => {
    const onComplete = vi.fn();
    const { container } = renderBurstEffect({
      position: [0, 1, 0],
      duration: 100,
      onComplete,
      active: true,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with custom particle count", () => {
    const { container } = renderBurstEffect({
      position: [0, 1, 0],
      particleCount: 100,
      active: true,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with custom intensity", () => {
    const { container } = renderBurstEffect({
      position: [0, 1, 0],
      intensity: 0.5,
      active: true,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with custom color", () => {
    const { container } = renderBurstEffect({
      position: [0, 1, 0],
      color: KOREAN_COLORS.ACCENT_RED,
      active: true,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render at different positions", () => {
    const { container } = renderBurstEffect({
      position: [3, 2, -5],
      active: true,
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
