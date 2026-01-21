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
 * Note: EffectsComposer should be rendered as a sibling to scene content,
 * not as a wrapper, since EffectComposer processes the entire scene.
 */
const render3D = (component: React.ReactElement, sceneContent?: React.ReactElement) => {
  return render(
    <Canvas>
      <Suspense fallback={null}>
        {sceneContent}
        {component}
      </Suspense>
    </Canvas>,
  );
};

// Test scene content
const TestMesh = () => (
  <mesh>
    <boxGeometry />
    <meshBasicMaterial color={0x00ffff} />
  </mesh>
);

const TestSphereMesh = () => (
  <mesh>
    <sphereGeometry />
    <meshBasicMaterial color={0xffd700} />
  </mesh>
);

describe("EffectsComposer", () => {
  describe("rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <EffectsComposer />,
        <TestMesh />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with bloom enabled by default", () => {
      const { container } = render3D(
        <EffectsComposer />,
        <TestSphereMesh />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render without bloom when disabled", () => {
      const { container } = render3D(
        <EffectsComposer enableBloom={false} />,
        <TestSphereMesh />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("bloom configuration", () => {
    it("should accept custom bloom intensity", () => {
      const { container } = render3D(
        <EffectsComposer bloomIntensity={2.0} />,
        <TestSphereMesh />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept custom luminance threshold", () => {
      const { container } = render3D(
        <EffectsComposer luminanceThreshold={0.8} />,
        <TestSphereMesh />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept custom luminance smoothing", () => {
      const { container } = render3D(
        <EffectsComposer luminanceSmoothing={0.8} />,
        <TestSphereMesh />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept custom kernel size", () => {
      const { container } = render3D(
        <EffectsComposer kernelSize={KernelSize.LARGE} />,
        <TestSphereMesh />,
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
        />,
        <TestSphereMesh />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("scene processing", () => {
    it("should process multiple objects in the scene", () => {
      const { container } = render3D(
        <EffectsComposer />,
        <group>
          <mesh>
            <sphereGeometry />
            <meshBasicMaterial color={0xff0000} />
          </mesh>
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color={0x00ff00} />
          </mesh>
        </group>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should work without scene content", () => {
      const { container } = render3D(<EffectsComposer />);

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("performance", () => {
    it("should handle multiple emissive objects", () => {
      const { container } = render3D(
        <EffectsComposer />,
        <group>
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} position={[i, 0, 0]}>
              <sphereGeometry args={[0.5]} />
              <meshBasicMaterial color={0x00ffff} toneMapped={false} />
            </mesh>
          ))}
        </group>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should toggle bloom efficiently", () => {
      const { container, rerender } = render3D(
        <EffectsComposer enableBloom={true} />,
        <TestSphereMesh />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <TestSphereMesh />
            <EffectsComposer enableBloom={false} />
          </Suspense>
        </Canvas>,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
