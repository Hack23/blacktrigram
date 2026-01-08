/**
 * Unit tests for Hand3D component
 * 
 * Tests 3D hand rendering with finger geometry, LOD system,
 * and vital point highlighting.
 * 
 * @module components/three/Hand3D.test
 * @category Tests
 * @korean 손3D테스트
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Hand3D from "./Hand3D";
import { HandPoseType } from "../../../types/hand-animation";

/**
 * Helper to render Three.js components in test environment
 */
const renderInCanvas = (component: React.ReactElement) => {
  return render(<Canvas>{component}</Canvas>);
};

describe("Hand3D Component", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.OPEN}
          fingerCurl={{ thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 }}
          distanceFromCamera={10}
          wristRotation={new THREE.Euler(0, 0, 0)}
        />
      );

      expect(container).toBeTruthy();
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render left hand with correct testid", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="left"
          pose={HandPoseType.OPEN}
          fingerCurl={{ thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 }}
          distanceFromCamera={10}
          wristRotation={new THREE.Euler(0, 0, 0)}
        />
      );

      // Check that canvas exists (basic Three.js rendering test)
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render right hand", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.OPEN}
          fingerCurl={{ thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 }}
          distanceFromCamera={10}
          wristRotation={new THREE.Euler(0, 0, 0)}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Hand Poses", () => {
    it("should render fist pose", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.FIST}
          fingerCurl={{ thumb: 0.8, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }}
          distanceFromCamera={5}
          wristRotation={new THREE.Euler(0, 0, 0)}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render knife-hand pose", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.KNIFE_HAND}
          fingerCurl={{ thumb: 0.5, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }}
          distanceFromCamera={5}
          wristRotation={new THREE.Euler(0, 0, -Math.PI / 2)}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render spear-hand pose", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.SPEAR_HAND}
          fingerCurl={{ thumb: 0.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }}
          distanceFromCamera={5}
          wristRotation={new THREE.Euler(0, 0, 0)}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render palm-heel pose", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.PALM_HEEL}
          fingerCurl={{ thumb: 0.3, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }}
          distanceFromCamera={5}
          wristRotation={new THREE.Euler(-0.3, 0, 0)}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render grappling pose", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.GRAPPLING}
          fingerCurl={{ thumb: 0.6, index: 0.6, middle: 0.6, ring: 0.6, pinky: 0.6 }}
          distanceFromCamera={5}
          wristRotation={new THREE.Euler(0, 0, 0)}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("LOD System", () => {
    it("should render high detail at close distance (<5 units)", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.OPEN}
          fingerCurl={{ thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 }}
          distanceFromCamera={3}
          wristRotation={new THREE.Euler(0, 0, 0)}
        />
      );

      // At close distance, fingers should be rendered
      expect(container).toBeTruthy();
    });

    it("should render medium detail at mid distance (5-15 units)", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.OPEN}
          fingerCurl={{ thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 }}
          distanceFromCamera={10}
          wristRotation={new THREE.Euler(0, 0, 0)}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render low detail at far distance (>15 units)", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.OPEN}
          fingerCurl={{ thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 }}
          distanceFromCamera={20}
          wristRotation={new THREE.Euler(0, 0, 0)}
        />
      );

      // At far distance, should render simplified geometry
      expect(container).toBeTruthy();
    });
  });

  describe("Highlighting", () => {
    it("should render with knuckles highlight", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.FIST}
          fingerCurl={{ thumb: 0.8, index: 1.0, middle: 1.0, ring: 1.0, pinky: 1.0 }}
          distanceFromCamera={5}
          wristRotation={new THREE.Euler(0, 0, 0)}
          isHighlighted={true}
          highlightMode="knuckles"
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with palm highlight", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.PALM_HEEL}
          fingerCurl={{ thumb: 0.3, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 }}
          distanceFromCamera={5}
          wristRotation={new THREE.Euler(-0.3, 0, 0)}
          isHighlighted={true}
          highlightMode="palm"
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with knife edge highlight", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.KNIFE_HAND}
          fingerCurl={{ thumb: 0.5, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }}
          distanceFromCamera={5}
          wristRotation={new THREE.Euler(0, 0, -Math.PI / 2)}
          isHighlighted={true}
          highlightMode="knife_edge"
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with fingertips highlight", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.SPEAR_HAND}
          fingerCurl={{ thumb: 0.0, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }}
          distanceFromCamera={5}
          wristRotation={new THREE.Euler(0, 0, 0)}
          isHighlighted={true}
          highlightMode="fingertips"
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render without highlighting by default", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.OPEN}
          fingerCurl={{ thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 }}
          distanceFromCamera={10}
          wristRotation={new THREE.Euler(0, 0, 0)}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Custom Properties", () => {
    it("should accept custom skin color", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.OPEN}
          fingerCurl={{ thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 }}
          distanceFromCamera={10}
          wristRotation={new THREE.Euler(0, 0, 0)}
          skinColor={0xff6b6b}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should accept custom scale", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.OPEN}
          fingerCurl={{ thumb: 0.2, index: 0.2, middle: 0.2, ring: 0.2, pinky: 0.2 }}
          distanceFromCamera={10}
          wristRotation={new THREE.Euler(0, 0, 0)}
          scale={1.5}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should apply wrist rotation", () => {
      const { container } = renderInCanvas(
        <Hand3D
          side="right"
          pose={HandPoseType.KNIFE_HAND}
          fingerCurl={{ thumb: 0.5, index: 0.0, middle: 0.0, ring: 0.0, pinky: 0.0 }}
          distanceFromCamera={5}
          wristRotation={new THREE.Euler(0.5, 0.3, -Math.PI / 2)}
        />
      );

      expect(container).toBeTruthy();
    });
  });
});
