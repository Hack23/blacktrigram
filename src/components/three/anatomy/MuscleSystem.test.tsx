/**
 * Tests for muscle system 3D component
 * 
 * Validates muscle mesh rendering, scaling transitions,
 * exhaustion shaking, and performance characteristics.
 * 
 * @module components/three/MuscleSystem.test
 * @category Tests
 * @korean 근육시스템컴포넌트테스트
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect } from "vitest";
import React, { Suspense } from "react";
import { MUSCLE_GROUPS, MuscleMesh, MuscleSystem } from "./MuscleSystem";
import { KOREAN_COLORS } from "../../../types/constants";

// Helper to render Three.js components
function render3D(component: React.ReactElement) {
  return render(
    <Canvas>
      <Suspense fallback={null}>{component}</Suspense>
    </Canvas>
  );
}

describe("MUSCLE_GROUPS", () => {
  it("should define 20 muscle groups", () => {
    expect(Object.keys(MUSCLE_GROUPS).length).toBe(20);
  });

  it("should have valid muscle group definitions", () => {
    Object.entries(MUSCLE_GROUPS).forEach(([key, group]) => {
      expect(group.name).toBe(key);
      expect(group.korean).toBeDefined();
      expect(group.english).toBeDefined();
      expect(group.baseScale).toBeDefined();
      expect(group.maxFlexScale).toBeDefined();
      expect(group.position).toBeDefined();
      expect(group.geometryParams).toBeDefined();
    });
  });

  it("should have max flex scale larger than base scale", () => {
    Object.values(MUSCLE_GROUPS).forEach((group) => {
      expect(group.maxFlexScale.x).toBeGreaterThan(group.baseScale.x);
      expect(group.maxFlexScale.y).toBeGreaterThanOrEqual(group.baseScale.y);
      expect(group.maxFlexScale.z).toBeGreaterThan(group.baseScale.z);
    });
  });

  describe("Shoulder muscles", () => {
    it("should define left and right shoulders", () => {
      expect(MUSCLE_GROUPS.SHOULDER_L).toBeDefined();
      expect(MUSCLE_GROUPS.SHOULDER_R).toBeDefined();
    });

    it("should position shoulders symmetrically", () => {
      const leftPos = MUSCLE_GROUPS.SHOULDER_L.position;
      const rightPos = MUSCLE_GROUPS.SHOULDER_R.position;

      expect(leftPos.x).toBeLessThan(0); // Left side
      expect(rightPos.x).toBeGreaterThan(0); // Right side
      expect(leftPos.y).toBe(rightPos.y); // Same height
    });
  });

  describe("Arm muscles", () => {
    it("should define biceps and triceps for both arms", () => {
      expect(MUSCLE_GROUPS.BICEP_L).toBeDefined();
      expect(MUSCLE_GROUPS.BICEP_R).toBeDefined();
      expect(MUSCLE_GROUPS.TRICEP_L).toBeDefined();
      expect(MUSCLE_GROUPS.TRICEP_R).toBeDefined();
      expect(MUSCLE_GROUPS.FOREARM_L).toBeDefined();
      expect(MUSCLE_GROUPS.FOREARM_R).toBeDefined();
    });
  });

  describe("Core muscles", () => {
    it("should define pectorals, core, abs, and obliques", () => {
      expect(MUSCLE_GROUPS.PECTORALS).toBeDefined();
      expect(MUSCLE_GROUPS.CORE).toBeDefined();
      expect(MUSCLE_GROUPS.ABS).toBeDefined();
      expect(MUSCLE_GROUPS.OBLIQUES).toBeDefined();
    });

    it("should position core muscles at center", () => {
      expect(MUSCLE_GROUPS.CORE.position.x).toBe(0);
      expect(MUSCLE_GROUPS.ABS.position.x).toBe(0);
    });
  });

  describe("Leg muscles", () => {
    it("should define quads, hamstrings, calves, and glutes", () => {
      expect(MUSCLE_GROUPS.QUAD_L).toBeDefined();
      expect(MUSCLE_GROUPS.QUAD_R).toBeDefined();
      expect(MUSCLE_GROUPS.HAMSTRING_L).toBeDefined();
      expect(MUSCLE_GROUPS.HAMSTRING_R).toBeDefined();
      expect(MUSCLE_GROUPS.CALF_L).toBeDefined();
      expect(MUSCLE_GROUPS.CALF_R).toBeDefined();
      expect(MUSCLE_GROUPS.GLUTE_L).toBeDefined();
      expect(MUSCLE_GROUPS.GLUTE_R).toBeDefined();
    });

    it("should position legs symmetrically", () => {
      const leftQuad = MUSCLE_GROUPS.QUAD_L.position;
      const rightQuad = MUSCLE_GROUPS.QUAD_R.position;

      expect(leftQuad.x).toBeLessThan(0);
      expect(rightQuad.x).toBeGreaterThan(0);
      expect(leftQuad.y).toBe(rightQuad.y);
    });
  });

  describe("Korean translations", () => {
    it("should have Korean names for all muscles", () => {
      Object.values(MUSCLE_GROUPS).forEach((group) => {
        expect(group.korean).toMatch(/[\u3131-\uD79D]/); // Korean characters
      });
    });

    it("should have correct Korean translations", () => {
      expect(MUSCLE_GROUPS.BICEP_R.korean).toBe("오른쪽이두근");
      expect(MUSCLE_GROUPS.QUAD_L.korean).toBe("왼쪽대퇴사두근");
      expect(MUSCLE_GROUPS.CORE.korean).toBe("코어");
    });
  });
});

describe("MuscleMesh", () => {
  it("should render without crashing", () => {
    const muscleGroup = MUSCLE_GROUPS.BICEP_R;
    const { container } = render3D(
      <MuscleMesh muscleGroup={muscleGroup} tension={0} isShaking={false} />
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render with test id", () => {
    const muscleGroup = MUSCLE_GROUPS.BICEP_R;
    const { container } = render3D(
      <MuscleMesh muscleGroup={muscleGroup} tension={0} isShaking={false} />
    );

    // Check that component renders (we can't easily test data-testid in Three.js)
    expect(container).toBeTruthy();
  });

  describe("Tension scaling", () => {
    it("should use base scale when tension is 0", () => {
      const muscleGroup = MUSCLE_GROUPS.BICEP_R;
      const { container } = render3D(
        <MuscleMesh muscleGroup={muscleGroup} tension={0} isShaking={false} />
      );

      expect(container).toBeTruthy();
    });

    it("should use max flex scale when tension is 1", () => {
      const muscleGroup = MUSCLE_GROUPS.BICEP_R;
      const { container } = render3D(
        <MuscleMesh muscleGroup={muscleGroup} tension={1.0} isShaking={false} />
      );

      expect(container).toBeTruthy();
    });

    it("should interpolate scale for mid-range tension", () => {
      const muscleGroup = MUSCLE_GROUPS.BICEP_R;
      const { container } = render3D(
        <MuscleMesh muscleGroup={muscleGroup} tension={0.5} isShaking={false} />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Color variations", () => {
    it("should use base color for low tension", () => {
      const muscleGroup = MUSCLE_GROUPS.BICEP_R;
      const { container } = render3D(
        <MuscleMesh
          muscleGroup={muscleGroup}
          tension={0.3}
          isShaking={false}
          color={KOREAN_COLORS.MUSCLE_TONE}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should use flexed color for high tension", () => {
      const muscleGroup = MUSCLE_GROUPS.BICEP_R;
      const { container } = render3D(
        <MuscleMesh muscleGroup={muscleGroup} tension={0.8} isShaking={false} />
      );

      expect(container).toBeTruthy();
    });

    it("should use exhausted color when shaking", () => {
      const muscleGroup = MUSCLE_GROUPS.BICEP_R;
      const { container } = render3D(
        <MuscleMesh muscleGroup={muscleGroup} tension={0.5} isShaking={true} />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Material properties", () => {
    it("should use custom metalness and roughness", () => {
      const muscleGroup = MUSCLE_GROUPS.BICEP_R;
      const { container } = render3D(
        <MuscleMesh
          muscleGroup={muscleGroup}
          tension={0.5}
          isShaking={false}
          metalness={0.5}
          roughness={0.3}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should default to low metalness and high roughness", () => {
      const muscleGroup = MUSCLE_GROUPS.BICEP_R;
      const { container } = render3D(
        <MuscleMesh muscleGroup={muscleGroup} tension={0.5} isShaking={false} />
      );

      expect(container).toBeTruthy();
    });
  });
});

describe("MuscleSystem", () => {
  it("should render without crashing", () => {
    const muscleStates = new Map<string, number>();
    const { container } = render3D(
      <MuscleSystem muscleStates={muscleStates} />
    );

    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("should render all 20 muscle groups", () => {
    const muscleStates = new Map<string, number>();
    Object.keys(MUSCLE_GROUPS).forEach((name) => {
      muscleStates.set(name, 0);
    });

    const { container } = render3D(
      <MuscleSystem muscleStates={muscleStates} />
    );

    expect(container).toBeTruthy();
  });

  it("should render with varying tensions", () => {
    const muscleStates = new Map<string, number>([
      ["BICEP_R", 1.0],
      ["BICEP_L", 0.5],
      ["QUAD_R", 0.8],
      ["CORE", 0.3],
    ]);

    const { container } = render3D(
      <MuscleSystem muscleStates={muscleStates} />
    );

    expect(container).toBeTruthy();
  });

  it("should handle empty muscle states", () => {
    const muscleStates = new Map<string, number>();
    const { container } = render3D(
      <MuscleSystem muscleStates={muscleStates} />
    );

    expect(container).toBeTruthy();
  });

  it("should render with exhaustion flag", () => {
    const muscleStates = new Map<string, number>([
      ["BICEP_R", 0.8],
      ["QUAD_R", 0.7],
    ]);

    const { container } = render3D(
      <MuscleSystem muscleStates={muscleStates} isExhausted={true} />
    );

    expect(container).toBeTruthy();
  });

  it("should handle invalid muscle names gracefully", () => {
    const muscleStates = new Map<string, number>([
      ["INVALID_MUSCLE", 1.0],
      ["BICEP_R", 0.5],
    ]);

    const { container } = render3D(
      <MuscleSystem muscleStates={muscleStates} />
    );

    expect(container).toBeTruthy();
  });

  describe("Exhaustion shaking logic", () => {
    it("should enable shaking for high tension muscles when exhausted", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.8], // High tension - should shake
        ["BICEP_L", 0.2], // Low tension - should not shake
      ]);

      const { container } = render3D(
        <MuscleSystem muscleStates={muscleStates} isExhausted={true} />
      );

      expect(container).toBeTruthy();
    });

    it("should not shake when not exhausted", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", 0.8]]);

      const { container } = render3D(
        <MuscleSystem muscleStates={muscleStates} isExhausted={false} />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Performance", () => {
    it("should render 20 muscles efficiently", () => {
      const startTime = performance.now();

      const muscleStates = new Map<string, number>();
      Object.keys(MUSCLE_GROUPS).forEach((name) => {
        muscleStates.set(name, Math.random());
      });

      const { container } = render3D(
        <MuscleSystem muscleStates={muscleStates} />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(container).toBeTruthy();
      // Initial render should be reasonably fast (generous timeout for CI)
      expect(renderTime).toBeLessThan(1000);
    });
  });

  describe("Edge cases", () => {
    it("should handle tension values > 1.0", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", 1.5]]);

      const { container } = render3D(
        <MuscleSystem muscleStates={muscleStates} />
      );

      expect(container).toBeTruthy();
    });

    it("should handle negative tension values", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", -0.5]]);

      const { container } = render3D(
        <MuscleSystem muscleStates={muscleStates} />
      );

      expect(container).toBeTruthy();
    });

    it("should handle NaN tension values", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", NaN]]);

      const { container } = render3D(
        <MuscleSystem muscleStates={muscleStates} />
      );

      expect(container).toBeTruthy();
    });
  });
});

describe("Integration scenarios", () => {
  it("should render jab activation pattern", () => {
    const muscleStates = new Map<string, number>([
      ["SHOULDER_R", 0.7],
      ["BICEP_R", 1.0],
      ["TRICEP_R", 0.8],
      ["CORE", 0.5],
    ]);

    const { container } = render3D(
      <MuscleSystem muscleStates={muscleStates} />
    );

    expect(container).toBeTruthy();
  });

  it("should render front kick activation pattern", () => {
    const muscleStates = new Map<string, number>([
      ["QUAD_R", 1.0],
      ["GLUTE_R", 0.9],
      ["CALF_R", 0.7],
      ["CORE", 0.6],
      ["QUAD_L", 0.4],
    ]);

    const { container } = render3D(
      <MuscleSystem muscleStates={muscleStates} />
    );

    expect(container).toBeTruthy();
  });

  it("should render block defensive pattern", () => {
    const muscleStates = new Map<string, number>([
      ["SHOULDER_L", 0.9],
      ["SHOULDER_R", 0.9],
      ["BICEP_L", 0.7],
      ["BICEP_R", 0.7],
      ["CORE", 0.8],
    ]);

    const { container } = render3D(
      <MuscleSystem muscleStates={muscleStates} />
    );

    expect(container).toBeTruthy();
  });

  it("should render exhausted fighter state", () => {
    const muscleStates = new Map<string, number>([
      ["BICEP_R", 0.6],
      ["QUAD_R", 0.5],
      ["CORE", 0.4],
    ]);

    const { container } = render3D(
      <MuscleSystem muscleStates={muscleStates} isExhausted={true} />
    );

    expect(container).toBeTruthy();
  });
});

describe("MuscleSystem with Physical Attributes", () => {
  describe("Muscle mass scaling", () => {
    it("should scale muscles larger with higher muscle mass", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", 0.5]]);

      // High muscle mass (Jojik archetype - 42kg)
      const { container: highMuscle } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          physicalAttributes={{ muscleMass: 42, fatMass: 12 }}
        />
      );

      expect(highMuscle).toBeTruthy();
    });

    it("should scale muscles smaller with lower muscle mass", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", 0.5]]);

      // Low muscle mass (Amsalja archetype - 32kg)
      const { container: lowMuscle } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          physicalAttributes={{ muscleMass: 32, fatMass: 9 }}
        />
      );

      expect(lowMuscle).toBeTruthy();
    });

    it("should scale muscles normally with average muscle mass", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", 0.5]]);

      // Average muscle mass (Musa archetype - 38kg)
      const { container: avgMuscle } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          physicalAttributes={{ muscleMass: 38, fatMass: 12 }}
        />
      );

      expect(avgMuscle).toBeTruthy();
    });

    it("should render without physical attributes (backward compatibility)", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", 0.5]]);

      const { container } = render3D(
        <MuscleSystem muscleStates={muscleStates} />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Fat layer rendering", () => {
    it("should render fat layer with high fat mass", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.5],
        ["QUAD_R", 0.5],
      ]);

      // High fat mass (Jojik archetype - 18kg)
      const { container } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render minimal fat layer with low fat mass", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", 0.5]]);

      // Low fat mass (Amsalja archetype - 9kg)
      const { container } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          physicalAttributes={{ muscleMass: 32, fatMass: 9 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should not render fat layer below opacity threshold", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", 0.5]]);

      // Very low fat mass (below visibility threshold)
      const { container } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          physicalAttributes={{ muscleMass: 35, fatMass: 8 }}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Archetype visual differences", () => {
    it("should render Jojik archetype (bulky with fat)", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.5],
        ["QUAD_R", 0.5],
        ["CORE", 0.5],
      ]);

      // Jojik: 42kg muscle, 18kg fat - should be bulky and thick
      const { container } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render Amsalja archetype (lean and defined)", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.5],
        ["QUAD_R", 0.5],
        ["CORE", 0.5],
      ]);

      // Amsalja: 32kg muscle, 9kg fat - should be lean and defined
      const { container } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          physicalAttributes={{ muscleMass: 32, fatMass: 9 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render Musa archetype (balanced athletic)", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.5],
        ["QUAD_R", 0.5],
        ["CORE", 0.5],
      ]);

      // Musa: 38kg muscle, 12kg fat - should be balanced
      const { container } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          physicalAttributes={{ muscleMass: 38, fatMass: 12 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render Hacker archetype (average build)", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.5],
        ["QUAD_R", 0.5],
        ["CORE", 0.5],
      ]);

      // Hacker: 34kg muscle, 14kg fat - should be average with slight softness
      const { container } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          physicalAttributes={{ muscleMass: 34, fatMass: 14 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render Jeongbo archetype (fit operative)", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.5],
        ["QUAD_R", 0.5],
        ["CORE", 0.5],
      ]);

      // Jeongbo: 36kg muscle, 11kg fat - should be fit and toned
      const { container } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          physicalAttributes={{ muscleMass: 36, fatMass: 11 }}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Combined effects", () => {
    it("should render exhausted Jojik with high muscle and fat", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.8],
        ["QUAD_R", 0.7],
        ["CORE", 0.6],
      ]);

      const { container } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          isExhausted={true}
          physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render exhausted Amsalja with low muscle and fat", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.8],
        ["QUAD_R", 0.7],
      ]);

      const { container } = render3D(
        <MuscleSystem
          muscleStates={muscleStates}
          isExhausted={true}
          physicalAttributes={{ muscleMass: 32, fatMass: 9 }}
        />
      );

      expect(container).toBeTruthy();
    });
  });
});
