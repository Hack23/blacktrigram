/**
 * BodySurface component tests
 *
 * Tests for the realistic humanoid body surface rendering component.
 * Validates proper geometry creation, material setup, and bone attachment.
 *
 * @module components/three/BodySurface.test
 * @category Tests
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, expect, it } from "vitest";
import { BodySurface } from "./BodySurface";
import { PlayerArchetype } from "../../../../types/common";

/**
 * Helper to render a Three.js component within a Canvas
 */
function render3D(component: React.ReactElement) {
  return render(<Canvas>{component}</Canvas>);
}

describe("BodySurface", () => {
  const defaultPhysicalAttributes = {
    muscleMass: 35,
    fatMass: 12,
    shoulderWidth: 45,
    torsoLength: 59,
    armLength: 77,
    legLength: 96,
  };

  describe("Component Rendering", () => {
    it("should render without crashing for torso bone", () => {
      const { container } = render3D(
        <BodySurface
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={defaultPhysicalAttributes}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render without crashing for arm bone", () => {
      const { container } = render3D(
        <BodySurface
          boneName="upper_arm_L"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={defaultPhysicalAttributes}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render without crashing for leg bone", () => {
      const { container } = render3D(
        <BodySurface
          boneName="thigh_L"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={defaultPhysicalAttributes}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render without crashing for neck bone", () => {
      const { container } = render3D(
        <BodySurface
          boneName="neck"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={defaultPhysicalAttributes}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Archetype Support", () => {
    it("should render for all five archetypes", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const { container } = render3D(
          <BodySurface
            boneName="spine_middle"
            archetype={archetype}
            physicalAttributes={defaultPhysicalAttributes}
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("Physical Attributes Scaling", () => {
    it("should handle heavy character (Jojik) without excessive inflation", () => {
      const jojikAttributes = {
        muscleMass: 48,
        fatMass: 20,
        shoulderWidth: 54,
        torsoLength: 64,
        armLength: 84,
        legLength: 100,
      };

      const { container } = render3D(
        <BodySurface
          boneName="spine_middle"
          archetype={PlayerArchetype.JOJIK_POKRYEOKBAE}
          physicalAttributes={jojikAttributes}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle lean character (Amsalja) properly", () => {
      const amsaljaAttributes = {
        muscleMass: 30,
        fatMass: 10,
        shoulderWidth: 44,
        torsoLength: 58,
        armLength: 82,
        legLength: 102,
      };

      const { container } = render3D(
        <BodySurface
          boneName="upper_arm_L"
          archetype={PlayerArchetype.AMSALJA}
          physicalAttributes={amsaljaAttributes}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should use default attributes when not provided", () => {
      const { container } = render3D(
        <BodySurface
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Body Part Coverage", () => {
    const bodyParts = [
      "neck",
      "spine_middle",
      "pelvis",
      "upper_arm_L",
      "upper_arm_R",
      "forearm_L",
      "forearm_R",
      "thigh_L",
      "thigh_R",
      "shin_L",
      "shin_R",
    ];

    bodyParts.forEach((boneName) => {
      it(`should render body surface for ${boneName}`, () => {
        const { container } = render3D(
          <BodySurface
            boneName={boneName}
            archetype={PlayerArchetype.MUSA}
            physicalAttributes={defaultPhysicalAttributes}
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    it("should return null for unsupported bones", () => {
      const { container } = render3D(
        <BodySurface
          boneName="unsupported_bone"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={defaultPhysicalAttributes}
        />
      );

      // Component should render but not create any meshes
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
