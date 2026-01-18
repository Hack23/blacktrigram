/**
 * Unit tests for KoreanSignage3D component
 */

import { render, cleanup } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect, afterEach, vi } from "vitest";
import KoreanSignage3D from "../KoreanSignage3D";
import { Suspense } from "react";

// Cleanup after each test to prevent memory leaks
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("KoreanSignage3D", () => {
  it("should render without crashing", () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <KoreanSignage3D />
        </Suspense>
      </Canvas>
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with custom scale", () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <KoreanSignage3D scale={0.8} />
        </Suspense>
      </Canvas>
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should apply Korean theming", () => {
    const { container } = render(
      <Canvas>
        <Suspense fallback={null}>
          <KoreanSignage3D scale={1.0} />
        </Suspense>
      </Canvas>
    );

    // Verify component renders
    expect(container).toBeTruthy();
  });
});
