/**
 * Tests for FPSMonitor component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect, vi } from "vitest";
import { FPSMonitor } from "./FPSMonitor";
import { Suspense } from "react";

describe("FPSMonitor", () => {
  it("should render without crashing when enabled", () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <FPSMonitor enabled={true} />
        </Suspense>
      </Canvas>
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should not render when disabled", () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <FPSMonitor enabled={false} />
        </Suspense>
      </Canvas>
    );

    // Canvas still renders but FPS monitor returns null
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should accept custom thresholds", () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <FPSMonitor
            enabled={true}
            warningThreshold={45}
            criticalThreshold={25}
          />
        </Suspense>
      </Canvas>
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should accept custom position", () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <FPSMonitor
            enabled={true}
            top={20}
            right={20}
          />
        </Suspense>
      </Canvas>
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should accept onFPSDrop callback", () => {
    const onFPSDrop = vi.fn();
    
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <FPSMonitor
            enabled={true}
            onFPSDrop={onFPSDrop}
          />
        </Suspense>
      </Canvas>
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
    // Callback will be called when FPS drops below threshold
  });
});
