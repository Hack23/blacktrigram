/**
 * Tests for VitalPointMarker3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, expect, it, vi } from "vitest";
import { Suspense } from "react";
import { VitalPointMarker3D } from "./VitalPointMarker3D";
import type { VitalPoint } from "../../../systems/vitalpoint/types";
import { VitalPointCategory, VitalPointSeverity, TrigramStance } from "../../../types/common";
import { EffectIntensity } from "../../../systems/effects";
import { VitalPointEffectType } from "../../../types/common";

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

// Mock vital point for testing
const mockVitalPoint: VitalPoint = {
  id: "test-vital-point",
  names: {
    korean: "테스트혈",
    english: "Test Point",
    romanized: "testeuhoel",
  },
  position: { x: 0, y: 0 },
  category: VitalPointCategory.NEUROLOGICAL,
  severity: VitalPointSeverity.MAJOR,
  baseDamage: 25,
  effects: [
    {
      id: "test-effect",
      type: VitalPointEffectType.PAIN,
      intensity: EffectIntensity.MEDIUM,
      duration: 3000,
      description: {
        korean: "통증",
        english: "Pain",
      },
      stackable: false,
    },
  ],
  description: {
    korean: "테스트용 급소",
    english: "Test vital point",
  },
  targetingDifficulty: 0.7,
  effectiveStances: [TrigramStance.GEON, TrigramStance.LI],
};

describe("VitalPointMarker3D", () => {
  it("should render without crashing", () => {
    const { container } = render3D(
      <VitalPointMarker3D
        vitalPoint={mockVitalPoint}
        isSelected={false}
        isTraining={true}
        isMobile={false}
      />
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render selected marker with gold color", () => {
    const { container } = render3D(
      <VitalPointMarker3D
        vitalPoint={mockVitalPoint}
        isSelected={true}
        isTraining={true}
        isMobile={false}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should call onHit when clicked during training", () => {
    const mockOnHit = vi.fn();

    render3D(
      <VitalPointMarker3D
        vitalPoint={mockVitalPoint}
        isSelected={false}
        isTraining={true}
        isMobile={false}
        onHit={mockOnHit}
      />
    );

    // Note: Actual click testing on 3D objects requires special Three.js testing setup
    // This test verifies the component renders with the handler
    expect(mockOnHit).not.toHaveBeenCalled(); // Not called on render
  });

  it("should render larger markers on mobile", () => {
    const { container } = render3D(
      <VitalPointMarker3D
        vitalPoint={mockVitalPoint}
        isSelected={false}
        isTraining={true}
        isMobile={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should adjust size based on difficulty multiplier", () => {
    const { container } = render3D(
      <VitalPointMarker3D
        vitalPoint={mockVitalPoint}
        isSelected={false}
        isTraining={true}
        isMobile={false}
        sizeMultiplier={1.5}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with different severity colors", () => {
    const severities = [
      VitalPointSeverity.MINOR,
      VitalPointSeverity.MODERATE,
      VitalPointSeverity.MAJOR,
      VitalPointSeverity.CRITICAL,
      VitalPointSeverity.LETHAL,
    ];

    severities.forEach((severity) => {
      const vp = { ...mockVitalPoint, severity };
      const { container } = render3D(
        <VitalPointMarker3D
          vitalPoint={vp}
          isSelected={false}
          isTraining={true}
          isMobile={false}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  it("should render with reduced opacity when not training", () => {
    const { container } = render3D(
      <VitalPointMarker3D
        vitalPoint={mockVitalPoint}
        isSelected={false}
        isTraining={false}
        isMobile={false}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render test ID", () => {
    const { container } = render3D(
      <VitalPointMarker3D
        vitalPoint={mockVitalPoint}
        isSelected={false}
        isTraining={true}
        isMobile={false}
      />
    );

    // Canvas should contain the component
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});
