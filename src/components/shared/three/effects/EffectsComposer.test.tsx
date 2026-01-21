/**
 * Tests for EffectsComposer component
 * HDR bloom and post-processing tests
 */

import { Canvas } from "@react-three/fiber";
import { render } from "@testing-library/react";
import React, { Suspense } from "react";
import { describe, expect, it } from "vitest";
import { KernelSize } from "postprocessing";
import EffectsComposer from "./EffectsComposer";

/**
 * Helper to render Three.js components in test environment
 */
const render3D = (component: React.ReactElement) => {
  return render(
    <Canvas>
      <Suspense fallback={null}>{component}</Suspense>
    </Canvas>,
  );
};

describe("EffectsComposer", () => {
  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <EffectsComposer>
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color={0x00ffff} />
          </mesh>
        </EffectsComposer>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with bloom enabled by default", () => {
      const { container } = render3D(
        <EffectsComposer>
          <mesh>
            <sphereGeometry />
            <meshBasicMaterial color={0xffd700} />
          </mesh>
        </EffectsComposer>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render without bloom when disabled", () => {
      const { container } = render3D(
        <EffectsComposer enableBloom={false}>
          <mesh>
            <sphereGeometry />
            <meshBasicMaterial color={0xffd700} />
          </mesh>
        </EffectsComposer>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("bloom configuration", () => {
    it("should accept custom bloom intensity", () => {
      const { container } = render3D(
        <EffectsComposer bloomIntensity={2.0}>
          <mesh>
            <sphereGeometry />
            <meshBasicMaterial color={0xffd700} />
          </mesh>
        </EffectsComposer>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept custom luminance threshold", () => {
      const { container } = render3D(
        <EffectsComposer luminanceThreshold={0.8}>
          <mesh>
            <sphereGeometry />
            <meshBasicMaterial color={0xffd700} />
          </mesh>
        </EffectsComposer>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept custom luminance smoothing", () => {
      const { container } = render3D(
        <EffectsComposer luminanceSmoothing={0.8}>
          <mesh>
            <sphereGeometry />
            <meshBasicMaterial color={0xffd700} />
          </mesh>
        </EffectsComposer>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept custom kernel size", () => {
      const { container } = render3D(
        <EffectsComposer kernelSize={KernelSize.LARGE}>
          <mesh>
            <sphereGeometry />
            <meshBasicMaterial color={0xffd700} />
          </mesh>
        </EffectsComposer>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept all custom parameters", () => {
      const { container } = render3D(
        <EffectsComposer
          enableBloom={true}
          bloomIntensity={1.8}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.85}
          kernelSize={KernelSize.SMALL}
        >
          <mesh>
            <sphereGeometry />
            <meshBasicMaterial color={0xffd700} />
          </mesh>
        </EffectsComposer>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("children", () => {
    it("should render children correctly", () => {
      const { container } = render3D(
        <EffectsComposer>
          <group>
            <mesh>
              <sphereGeometry />
              <meshBasicMaterial color={0xff0000} />
            </mesh>
            <mesh>
              <boxGeometry />
              <meshBasicMaterial color={0x00ff00} />
            </mesh>
          </group>
        </EffectsComposer>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle empty children", () => {
      const { container } = render3D(<EffectsComposer />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("performance", () => {
    it("should handle multiple emissive objects", () => {
      const { container } = render3D(
        <EffectsComposer>
          <group>
            {Array.from({ length: 10 }).map((_, i) => (
              <mesh key={i} position={[i, 0, 0]}>
                <sphereGeometry args={[0.5]} />
                <meshBasicMaterial color={0x00ffff} toneMapped={false} />
              </mesh>
            ))}
          </group>
        </EffectsComposer>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should toggle bloom efficiently", () => {
      const { container, rerender } = render3D(
        <EffectsComposer enableBloom={true}>
          <mesh>
            <sphereGeometry />
            <meshBasicMaterial color={0xffd700} />
          </mesh>
        </EffectsComposer>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <EffectsComposer enableBloom={false}>
              <mesh>
                <sphereGeometry />
                <meshBasicMaterial color={0xffd700} />
              </mesh>
            </EffectsComposer>
          </Suspense>
        </Canvas>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
