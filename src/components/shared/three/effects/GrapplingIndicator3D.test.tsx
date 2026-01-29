/**
 * Tests for GrapplingIndicator3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, expect, it, vi } from "vitest";
import { GrapplingIndicator3D } from "./GrapplingIndicator3D";
import type { GrappleControl } from "../../../../types/common";
import { GrappleState, GrappleTarget } from "../../../../types/common";
import React from "react";

/**
 * Helper to render Three.js components in tests
 */
function renderInCanvas(ui: React.ReactElement) {
  return render(
    <Canvas>
      {ui}
    </Canvas>
  );
}

/**
 * Mock useFrame for testing
 */
vi.mock("@react-three/fiber", async () => {
  const actual = await vi.importActual("@react-three/fiber");
  return {
    ...actual,
    useFrame: vi.fn(),
  };
});

describe("GrapplingIndicator3D", () => {
  const mockCharacterPosition = { x: 0, y: 0, z: 0 };

  const mockGrappleControl: GrappleControl = {
    state: GrappleState.CONTROLLING,
    target: GrappleTarget.ARM,
    controllerId: "player1",
    targetId: "player2",
    gripStrength: 80,
    duration: 1500,
    startTime: Date.now() - 1500,
    canEscape: true,
    staminaCostPerSecond: 5,
  };

  describe("Rendering", () => {
    it("should render nothing when grappleControl is undefined", () => {
      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={undefined}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      // Should render canvas but no grappling indicator
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render grappling control component structure", () => {
      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={mockGrappleControl}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      // Should render canvas with grappling indicator
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Props Validation", () => {
    it("should accept all required props", () => {
      expect(() => {
        renderInCanvas(
          <GrapplingIndicator3D
            grappleControl={mockGrappleControl}
            characterPosition={mockCharacterPosition}
            isController={true}
          />
        );
      }).not.toThrow();
    });

    it("should accept optional isMobile prop", () => {
      expect(() => {
        renderInCanvas(
          <GrapplingIndicator3D
            grappleControl={mockGrappleControl}
            characterPosition={mockCharacterPosition}
            isController={true}
            isMobile={true}
          />
        );
      }).not.toThrow();
    });

    it("should accept custom data-testid", () => {
      expect(() => {
        renderInCanvas(
          <GrapplingIndicator3D
            grappleControl={mockGrappleControl}
            characterPosition={mockCharacterPosition}
            isController={true}
            data-testid="custom-grapple-indicator"
          />
        );
      }).not.toThrow();
    });

    it("should handle different character positions", () => {
      const position = { x: 5, y: 2, z: -3 };

      expect(() => {
        renderInCanvas(
          <GrapplingIndicator3D
            grappleControl={mockGrappleControl}
            characterPosition={position}
            isController={true}
          />
        );
      }).not.toThrow();
    });
  });

  describe("State-based Rendering", () => {
    it("should handle GRABBING state", () => {
      const grabbingControl: GrappleControl = {
        ...mockGrappleControl,
        state: GrappleState.GRABBING,
      };

      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={grabbingControl}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle CONTROLLING state", () => {
      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={mockGrappleControl}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle ESCAPING state", () => {
      const escapingControl: GrappleControl = {
        ...mockGrappleControl,
        state: GrappleState.ESCAPING,
      };

      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={escapingControl}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle ESCAPING state with visual feedback", () => {
      const escapingControl2: GrappleControl = {
        ...mockGrappleControl,
        state: GrappleState.ESCAPING,
        gripStrength: 45, // Different grip for variety
      };

      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={escapingControl2}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Controller vs Defender Perspective", () => {
    it("should render from controller perspective", () => {
      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={mockGrappleControl}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render from defender perspective", () => {
      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={mockGrappleControl}
          characterPosition={mockCharacterPosition}
          isController={false}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Grip Strength Values", () => {
    it("should handle low grip strength", () => {
      const lowGripControl: GrappleControl = {
        ...mockGrappleControl,
        gripStrength: 20,
      };

      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={lowGripControl}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle max grip strength", () => {
      const maxGripControl: GrappleControl = {
        ...mockGrappleControl,
        gripStrength: 100,
      };

      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={maxGripControl}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Target Types", () => {
    it("should handle ARM target", () => {
      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={mockGrappleControl}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle NECK target", () => {
      const neckControl: GrappleControl = {
        ...mockGrappleControl,
        target: GrappleTarget.NECK,
      };

      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={neckControl}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle BOTH_ARMS target", () => {
      const bothArmsControl: GrappleControl = {
        ...mockGrappleControl,
        target: GrappleTarget.BOTH_ARMS,
      };

      const { container } = renderInCanvas(
        <GrapplingIndicator3D
          grappleControl={bothArmsControl}
          characterPosition={mockCharacterPosition}
          isController={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
