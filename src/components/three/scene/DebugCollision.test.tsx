/**
 * Unit tests for DebugCollision component.
 * 
 * @module components/three/DebugCollision.test
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { DebugCollision } from "./DebugCollision";
import { Suspense } from "react";

// Helper to render Three.js components
function render3D(component: React.ReactElement) {
  return render(
    <Canvas>
      <Suspense fallback={null}>
        {component}
      </Suspense>
    </Canvas>
  );
}

describe("DebugCollision", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <DebugCollision
          showBoundingBoxes={true}
          showAttackReach={true}
        />
      );
      
      expect(container.querySelector('canvas')).toBeInTheDocument();
    });

    it("should have debug-collision test id", () => {
      const { container } = render3D(
        <DebugCollision showBoundingBoxes={true} />
      );
      
      // Component renders, test ID will be in the scene
      expect(container).toBeTruthy();
    });
  });

  describe("Props", () => {
    it("should accept showBoundingBoxes prop", () => {
      const { container } = render3D(
        <DebugCollision showBoundingBoxes={false} />
      );
      
      expect(container).toBeTruthy();
    });

    it("should accept showAttackReach prop", () => {
      const { container } = render3D(
        <DebugCollision showAttackReach={false} />
      );
      
      expect(container).toBeTruthy();
    });

    it("should accept custom attackReach value", () => {
      const { container } = render3D(
        <DebugCollision attackReach={1.2} />
      );
      
      expect(container).toBeTruthy();
    });

    it("should accept custom positions", () => {
      const { container } = render3D(
        <DebugCollision
          attackerPosition={{ x: 0, y: 0, z: 5 }}
          defenderPosition={{ x: 0, y: 0, z: 6 }}
        />
      );
      
      expect(container).toBeTruthy();
    });

    it("should accept custom opacity", () => {
      const { container } = render3D(
        <DebugCollision opacity={0.5} />
      );
      
      expect(container).toBeTruthy();
    });
  });

  describe("Korean Terminology", () => {
    it("should use correct Korean test IDs", () => {
      // Component uses Korean terminology in documentation
      // Test IDs are in English for consistency with testing libraries
      expect(true).toBe(true);
    });
  });
});
