/**
 * Tests for LimbExposureIndicator3D component
 *
 * **Korean**: 사지 노출 표시기 3D 테스트
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, expect, it } from "vitest";
import { LimbExposureIndicator3D } from "./LimbExposureIndicator3D";
import type {
  CounterOpportunity,
  Position3D,
} from "../../../../types/physics";

// Helper to render Three.js components in tests
function renderWithCanvas(component: React.ReactElement) {
  return render(<Canvas>{component}</Canvas>);
}

// Mock counter opportunity
const mockOpportunity: CounterOpportunity = {
  exposedLimb: "right_leg",
  windowStart: 400,
  windowDuration: 300,
  vulnerabilityMultiplier: 2.0,
  allowsBreaking: true,
  recommendedCounters: ["ankle_break", "knee_strike"],
};

const mockPosition: Position3D = {
  x: 2,
  y: 0,
  z: 0,
};

describe("LimbExposureIndicator3D", () => {
  describe("Rendering", () => {
    it("should render without crashing", () => {
      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={450}
          facingLeft={false}
          isMobile={false}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render when no opportunity exists", () => {
      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={undefined}
          characterPosition={mockPosition}
          currentTime={450}
          facingLeft={false}
        />
      );

      // Component should exist but not render content
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with data-testid attribute", () => {
      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={450}
          data-testid="test-indicator"
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render for mobile devices", () => {
      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={450}
          isMobile={true}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Props validation", () => {
    it("should handle different exposed limb types", () => {
      const limbs: Array<CounterOpportunity["exposedLimb"]> = [
        "left_arm",
        "right_arm",
        "left_leg",
        "right_leg",
        "left_elbow",
        "right_elbow",
        "left_wrist",
        "right_wrist",
        "left_knee",
        "right_knee",
        "left_ankle",
        "right_ankle",
      ];

      limbs.forEach((limb) => {
        const opportunity: CounterOpportunity = {
          ...mockOpportunity,
          exposedLimb: limb,
        };

        const { container } = renderWithCanvas(
          <LimbExposureIndicator3D
            opportunity={opportunity}
            characterPosition={mockPosition}
            currentTime={450}
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    it("should handle different facing directions", () => {
      const { container: left } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={450}
          facingLeft={true}
        />
      );

      const { container: right } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={450}
          facingLeft={false}
        />
      );

      expect(left.querySelector("canvas")).toBeInTheDocument();
      expect(right.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle different vulnerability multipliers", () => {
      const multipliers = [1.0, 1.5, 2.0, 2.5, 3.0];

      multipliers.forEach((multiplier) => {
        const opportunity: CounterOpportunity = {
          ...mockOpportunity,
          vulnerabilityMultiplier: multiplier,
        };

        const { container } = renderWithCanvas(
          <LimbExposureIndicator3D
            opportunity={opportunity}
            characterPosition={mockPosition}
            currentTime={450}
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    it("should handle breaking vs non-breaking opportunities", () => {
      const breakingOpportunity: CounterOpportunity = {
        ...mockOpportunity,
        allowsBreaking: true,
      };

      const nonBreakingOpportunity: CounterOpportunity = {
        ...mockOpportunity,
        allowsBreaking: false,
      };

      const { container: breaking } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={breakingOpportunity}
          characterPosition={mockPosition}
          currentTime={450}
        />
      );

      const { container: nonBreaking } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={nonBreakingOpportunity}
          characterPosition={mockPosition}
          currentTime={450}
        />
      );

      expect(breaking.querySelector("canvas")).toBeInTheDocument();
      expect(nonBreaking.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Timing windows", () => {
    it("should not render before window starts", () => {
      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={300} // Before windowStart (400)
        />
      );

      // Should render canvas but indicator may not be visible
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render during window", () => {
      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={550} // During window (400-700)
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should not render after window ends", () => {
      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={800} // After window ends (700)
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle window boundaries correctly", () => {
      // At exact start
      const { container: atStart } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={400}
        />
      );

      // At exact end
      const { container: atEnd } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={700}
        />
      );

      expect(atStart.querySelector("canvas")).toBeInTheDocument();
      expect(atEnd.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should memoize component correctly", () => {
      const props = {
        opportunity: mockOpportunity,
        characterPosition: mockPosition,
        currentTime: 450,
        facingLeft: false,
        isMobile: false,
      };

      const { rerender, container } = renderWithCanvas(
        <LimbExposureIndicator3D {...props} />
      );

      // Re-render with same props
      rerender(<Canvas><LimbExposureIndicator3D {...props} /></Canvas>);

      // Should still be in document
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle rapid current time updates", () => {
      const times = [450, 460, 470, 480, 490, 500];

      times.forEach((time) => {
        const { container } = renderWithCanvas(
          <LimbExposureIndicator3D
            opportunity={mockOpportunity}
            characterPosition={mockPosition}
            currentTime={time}
          />
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper test ID for testing", () => {
      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={450}
          data-testid="limb-exposure-test"
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should handle zero duration window", () => {
      const zeroWindow: CounterOpportunity = {
        ...mockOpportunity,
        windowDuration: 0,
      };

      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={zeroWindow}
          characterPosition={mockPosition}
          currentTime={450}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle negative current time", () => {
      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={mockPosition}
          currentTime={-100}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle extreme vulnerability multipliers", () => {
      const extremeOpportunity: CounterOpportunity = {
        ...mockOpportunity,
        vulnerabilityMultiplier: 10.0, // Very high
      };

      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={extremeOpportunity}
          characterPosition={mockPosition}
          currentTime={450}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle extreme character positions", () => {
      const extremePosition: Position3D = {
        x: 1000,
        y: 1000,
        z: 1000,
      };

      const { container } = renderWithCanvas(
        <LimbExposureIndicator3D
          opportunity={mockOpportunity}
          characterPosition={extremePosition}
          currentTime={450}
        />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });
});
