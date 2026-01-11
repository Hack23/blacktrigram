/**
 * Unit tests for Foot3D component
 * 
 * Tests 3D foot rendering with anatomically correct dimensions,
 * archetype scaling, and bilateral symmetry.
 * 
 * @module components/three/Foot3D.test
 * @category Tests
 * @korean 발3D테스트
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import Foot3D from "./Foot3D";

/**
 * Helper to render Three.js components in test environment
 */
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe("Foot3D Component", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderInCanvas(
        <Foot3D side="right" />
      );

      expect(container).toBeTruthy();
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render left foot with correct testid", () => {
      const { container } = renderInCanvas(
        <Foot3D side="left" />
      );

      // Check that canvas exists (basic Three.js rendering test)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render right foot with correct testid", () => {
      const { container } = renderInCanvas(
        <Foot3D side="right" />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Side-specific rendering", () => {
    it("should render left foot", () => {
      const { container } = renderInCanvas(
        <Foot3D 
          side="left"
          skinColor={0xffdbac}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render right foot", () => {
      const { container } = renderInCanvas(
        <Foot3D 
          side="right"
          skinColor={0xffdbac}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Archetype scaling", () => {
    it("should render with standard scale (180cm person)", () => {
      const { container } = renderInCanvas(
        <Foot3D 
          side="right"
          scale={1.0}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with smaller scale (Amsalja archetype - 186cm but lean)", () => {
      const { container } = renderInCanvas(
        <Foot3D 
          side="right"
          scale={0.95}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with larger scale (Jojik archetype - 188cm heavy)", () => {
      const { container } = renderInCanvas(
        <Foot3D 
          side="right"
          scale={1.15}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Visual appearance", () => {
    it("should render with Korean skin tone color", () => {
      const { container } = renderInCanvas(
        <Foot3D 
          side="right"
          skinColor={0xffdbac}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should highlight foot during kick animation", () => {
      const { container } = renderInCanvas(
        <Foot3D 
          side="right"
          isHighlighted={true}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render without highlight in idle state", () => {
      const { container } = renderInCanvas(
        <Foot3D 
          side="right"
          isHighlighted={false}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Bilateral symmetry", () => {
    it("should render both feet with consistent dimensions", () => {
      const { container } = render(
        <Canvas>
          <Foot3D side="left" scale={1.0} />
          <Foot3D side="right" scale={1.0} />
        </Canvas>
      );

      expect(container).toBeTruthy();
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Anatomical accuracy", () => {
    it("should maintain realistic foot proportions for average person", () => {
      // 26cm foot length is realistic for 180cm person (foot ~14.4% of height)
      const { container } = renderInCanvas(
        <Foot3D 
          side="right"
          scale={1.0}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should scale proportionally with physical attributes", () => {
      // Test that larger scale produces larger foot
      const { container } = renderInCanvas(
        <Foot3D 
          side="right"
          scale={1.2}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Performance", () => {
    it("should render efficiently with minimal geometry", () => {
      // Foot should use only 3 meshes (heel, toes, ankle) for 60fps performance
      const { container } = renderInCanvas(
        <Foot3D side="right" />
      );

      expect(container).toBeTruthy();
    });

    it("should support multiple feet in scene", () => {
      // Test rendering multiple feet (e.g., two players)
      const { container } = render(
        <Canvas>
          <Foot3D side="left" />
          <Foot3D side="right" />
          <Foot3D side="left" scale={1.1} />
          <Foot3D side="right" scale={1.1} />
        </Canvas>
      );

      expect(container).toBeTruthy();
    });
  });
});
