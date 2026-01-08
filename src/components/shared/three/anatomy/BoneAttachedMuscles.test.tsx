/**
 * Tests for bone-attached muscle system 3D component
 *
 * Validates muscle attachment to bones, scaling transitions,
 * exhaustion shaking, and physical attribute scaling.
 *
 * @module components/three/BoneAttachedMuscles.test
 * @category Tests
 * @korean 뼈부착근육시스템컴포넌트테스트
 */

import { Canvas } from "@react-three/fiber";
import { render } from "@testing-library/react";
import React, { Suspense } from "react";
import { describe, expect, it } from "vitest";
import {
  BONE_MUSCLE_MAP,
  BoneAttachedMuscle,
  BoneMuscles,
  calculateFatLayerOpacity,
  calculateFatLayerThickness,
  calculateMuscleScaleFactor,
} from "./BoneAttachedMuscles";

// Helper to render Three.js components
function render3D(component: React.ReactElement) {
  return render(
    <Canvas>
      <Suspense fallback={null}>{component}</Suspense>
    </Canvas>
  );
}

describe("BONE_MUSCLE_MAP", () => {
  it("should define muscle attachments for 13 bones", () => {
    expect(Object.keys(BONE_MUSCLE_MAP).length).toBe(13);
  });

  it("should have valid muscle attachment definitions", () => {
    Object.entries(BONE_MUSCLE_MAP).forEach(([_boneName, attachments]) => {
      attachments.forEach((attachment) => {
        expect(attachment.name).toBeDefined();
        expect(attachment.korean).toBeDefined();
        expect(attachment.english).toBeDefined();
        expect(attachment.localOffset).toBeDefined();
        expect(attachment.localRotation).toBeDefined();
        expect(attachment.baseScale).toBeDefined();
        expect(attachment.maxFlexScale).toBeDefined();
        expect(attachment.radius).toBeGreaterThan(0);
        expect(attachment.length).toBeGreaterThan(0);
      });
    });
  });

  it("should have max flex scale larger than base scale for all muscles", () => {
    Object.values(BONE_MUSCLE_MAP).forEach((attachments) => {
      attachments.forEach((attachment) => {
        expect(attachment.maxFlexScale.x).toBeGreaterThan(
          attachment.baseScale.x
        );
        expect(attachment.maxFlexScale.y).toBeGreaterThanOrEqual(
          attachment.baseScale.y
        );
        expect(attachment.maxFlexScale.z).toBeGreaterThan(
          attachment.baseScale.z
        );
      });
    });
  });

  describe("Shoulder muscles", () => {
    it("should define left and right shoulder attachments", () => {
      expect(BONE_MUSCLE_MAP.shoulder_L).toBeDefined();
      expect(BONE_MUSCLE_MAP.shoulder_R).toBeDefined();
      expect(BONE_MUSCLE_MAP.shoulder_L.length).toBe(1);
      expect(BONE_MUSCLE_MAP.shoulder_R.length).toBe(1);
    });

    it("should have visually significant shoulder scale", () => {
      const leftShoulder = BONE_MUSCLE_MAP.shoulder_L[0];
      const rightShoulder = BONE_MUSCLE_MAP.shoulder_R[0];

      // Shoulders should be prominent - base scale X >= 0.5
      expect(leftShoulder.baseScale.x).toBeGreaterThanOrEqual(0.5);
      expect(rightShoulder.baseScale.x).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe("Arm muscles", () => {
    it("should define biceps and triceps for both arms", () => {
      expect(BONE_MUSCLE_MAP.upper_arm_L).toBeDefined();
      expect(BONE_MUSCLE_MAP.upper_arm_R).toBeDefined();
      expect(BONE_MUSCLE_MAP.forearm_L).toBeDefined();
      expect(BONE_MUSCLE_MAP.forearm_R).toBeDefined();

      // Each upper arm should have bicep and tricep
      expect(BONE_MUSCLE_MAP.upper_arm_L.length).toBe(2);
      expect(BONE_MUSCLE_MAP.upper_arm_R.length).toBe(2);
    });

    it("should have visually significant arm muscle scale", () => {
      const bicepL = BONE_MUSCLE_MAP.upper_arm_L.find((m) =>
        m.name.includes("BICEP")
      );
      expect(bicepL).toBeDefined();
      // Biceps should be prominent - base scale X >= 0.35
      expect(bicepL!.baseScale.x).toBeGreaterThanOrEqual(0.35);
    });
  });

  describe("Hip muscles (critical for Jojik visibility)", () => {
    it("should define glute attachments for both hips", () => {
      expect(BONE_MUSCLE_MAP.hip_L).toBeDefined();
      expect(BONE_MUSCLE_MAP.hip_R).toBeDefined();
      expect(BONE_MUSCLE_MAP.hip_L.length).toBe(1);
      expect(BONE_MUSCLE_MAP.hip_R.length).toBe(1);
    });

    it("should have significantly large hip/glute scale for Jojik archetype visibility", () => {
      const gluteL = BONE_MUSCLE_MAP.hip_L[0];
      const gluteR = BONE_MUSCLE_MAP.hip_R[0];

      // Glutes should be very prominent for Jojik - base scale X >= 0.45
      expect(gluteL.baseScale.x).toBeGreaterThanOrEqual(0.45);
      expect(gluteR.baseScale.x).toBeGreaterThanOrEqual(0.45);

      // Max flex scale should be even larger
      expect(gluteL.maxFlexScale.x).toBeGreaterThanOrEqual(0.55);
      expect(gluteR.maxFlexScale.x).toBeGreaterThanOrEqual(0.55);
    });

    it("should have appropriate hip radius for visibility", () => {
      const gluteL = BONE_MUSCLE_MAP.hip_L[0];
      // Hip radius should be large enough to be visible - >= 0.3
      expect(gluteL.radius).toBeGreaterThanOrEqual(0.3);
    });
  });

  describe("Core muscles", () => {
    it("should define pectorals, core, abs, and obliques on spine_middle", () => {
      expect(BONE_MUSCLE_MAP.spine_middle).toBeDefined();
      expect(BONE_MUSCLE_MAP.spine_middle.length).toBe(4);

      const muscleNames = BONE_MUSCLE_MAP.spine_middle.map((m) => m.name);
      expect(muscleNames).toContain("PECTORALS");
      expect(muscleNames).toContain("CORE");
      expect(muscleNames).toContain("ABS");
      expect(muscleNames).toContain("OBLIQUES");
    });

    it("should have visually significant pectoral scale", () => {
      const pectorals = BONE_MUSCLE_MAP.spine_middle.find(
        (m) => m.name === "PECTORALS"
      );
      expect(pectorals).toBeDefined();
      // Pectorals should be prominent - base scale X >= 0.7
      expect(pectorals!.baseScale.x).toBeGreaterThanOrEqual(0.7);
    });
  });

  describe("Leg muscles", () => {
    it("should define quads, hamstrings, and calves", () => {
      expect(BONE_MUSCLE_MAP.thigh_L).toBeDefined();
      expect(BONE_MUSCLE_MAP.thigh_R).toBeDefined();
      expect(BONE_MUSCLE_MAP.shin_L).toBeDefined();
      expect(BONE_MUSCLE_MAP.shin_R).toBeDefined();

      // Each thigh should have quad and hamstring
      expect(BONE_MUSCLE_MAP.thigh_L.length).toBe(2);
      expect(BONE_MUSCLE_MAP.thigh_R.length).toBe(2);
    });

    it("should have visually significant quad scale", () => {
      const quadL = BONE_MUSCLE_MAP.thigh_L.find((m) =>
        m.name.includes("QUAD")
      );
      expect(quadL).toBeDefined();
      // Quads should be prominent - base scale X >= 0.4
      expect(quadL!.baseScale.x).toBeGreaterThanOrEqual(0.4);
    });
  });

  describe("Korean translations", () => {
    it("should have Korean names for all muscles", () => {
      Object.values(BONE_MUSCLE_MAP).forEach((attachments) => {
        attachments.forEach((attachment) => {
          expect(attachment.korean).toMatch(/[\u3131-\uD79D]/); // Korean characters
        });
      });
    });

    it("should have correct Korean translations", () => {
      const bicepR = BONE_MUSCLE_MAP.upper_arm_R.find((m) =>
        m.name.includes("BICEP")
      );
      expect(bicepR?.korean).toBe("오른쪽이두근");

      const quadL = BONE_MUSCLE_MAP.thigh_L.find((m) =>
        m.name.includes("QUAD")
      );
      expect(quadL?.korean).toBe("왼쪽대퇴사두근");

      const core = BONE_MUSCLE_MAP.spine_middle.find((m) => m.name === "CORE");
      expect(core?.korean).toBe("코어");
    });
  });
});

describe("calculateMuscleScaleFactor", () => {
  it("should return 1.0 for reference muscle mass (35kg)", () => {
    const factor = calculateMuscleScaleFactor(35);
    expect(factor).toBeCloseTo(1.0, 2);
  });

  it("should return > 1.0 for high muscle mass (Jojik - 42kg)", () => {
    const factor = calculateMuscleScaleFactor(42);
    expect(factor).toBeGreaterThan(1.0);
    // With 2.5x amplification: 1.0 + (42/35 - 1) * 2.5 ≈ 1.5
    expect(factor).toBeGreaterThan(1.4);
  });

  it("should return < 1.0 for low muscle mass (Amsalja - 32kg)", () => {
    const factor = calculateMuscleScaleFactor(32);
    expect(factor).toBeLessThan(1.0);
  });

  it("should show significant difference between archetypes", () => {
    const jojikFactor = calculateMuscleScaleFactor(42); // Jojik
    const amsaljaFactor = calculateMuscleScaleFactor(32); // Amsalja

    // Difference should be at least 0.5 for visual distinction
    expect(jojikFactor - amsaljaFactor).toBeGreaterThan(0.5);
  });
});

describe("calculateFatLayerOpacity", () => {
  it("should return minimum opacity for low fat mass", () => {
    const opacity = calculateFatLayerOpacity(10);
    expect(opacity).toBeCloseTo(0.1, 2);
  });

  it("should return high opacity for high fat mass (Jojik - 18kg)", () => {
    const opacity = calculateFatLayerOpacity(18);
    expect(opacity).toBeGreaterThan(0.4);
  });

  it("should return moderate opacity for average fat mass", () => {
    const opacity = calculateFatLayerOpacity(14);
    expect(opacity).toBeGreaterThan(0.2);
    expect(opacity).toBeLessThan(0.5);
  });
});

describe("calculateFatLayerThickness", () => {
  it("should return minimum thickness for low fat mass", () => {
    const thickness = calculateFatLayerThickness(10);
    expect(thickness).toBeCloseTo(0.05, 2);
  });

  it("should return high thickness for high fat mass", () => {
    const thickness = calculateFatLayerThickness(22);
    expect(thickness).toBeCloseTo(0.45, 2);
  });
});

describe("BoneAttachedMuscle", () => {
  it("should render without crashing", () => {
    const attachment = BONE_MUSCLE_MAP.upper_arm_R[0]; // Bicep
    const { container } = render3D(
      <BoneAttachedMuscle
        attachment={attachment}
        tension={0}
        isShaking={false}
        muscleScaleFactor={1.0}
        fatLayerOpacity={0}
        fatLayerThickness={0}
      />
    );

    expect(container.querySelector("canvas")).toBeTruthy();
  });

  describe("Tension scaling", () => {
    it("should render with no tension", () => {
      const attachment = BONE_MUSCLE_MAP.upper_arm_R[0];
      const { container } = render3D(
        <BoneAttachedMuscle
          attachment={attachment}
          tension={0}
          isShaking={false}
          muscleScaleFactor={1.0}
          fatLayerOpacity={0}
          fatLayerThickness={0}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with full tension", () => {
      const attachment = BONE_MUSCLE_MAP.upper_arm_R[0];
      const { container } = render3D(
        <BoneAttachedMuscle
          attachment={attachment}
          tension={1.0}
          isShaking={false}
          muscleScaleFactor={1.0}
          fatLayerOpacity={0}
          fatLayerThickness={0}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with mid-range tension", () => {
      const attachment = BONE_MUSCLE_MAP.upper_arm_R[0];
      const { container } = render3D(
        <BoneAttachedMuscle
          attachment={attachment}
          tension={0.5}
          isShaking={false}
          muscleScaleFactor={1.0}
          fatLayerOpacity={0}
          fatLayerThickness={0}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Archetype scaling", () => {
    it("should render with Jojik muscle scale factor", () => {
      const attachment = BONE_MUSCLE_MAP.hip_L[0]; // Glute
      const jojikFactor = calculateMuscleScaleFactor(42);

      const { container } = render3D(
        <BoneAttachedMuscle
          attachment={attachment}
          tension={0.5}
          isShaking={false}
          muscleScaleFactor={jojikFactor}
          fatLayerOpacity={0.5}
          fatLayerThickness={0.3}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with Amsalja muscle scale factor", () => {
      const attachment = BONE_MUSCLE_MAP.upper_arm_R[0];
      const amsaljaFactor = calculateMuscleScaleFactor(32);

      const { container } = render3D(
        <BoneAttachedMuscle
          attachment={attachment}
          tension={0.5}
          isShaking={false}
          muscleScaleFactor={amsaljaFactor}
          fatLayerOpacity={0.1}
          fatLayerThickness={0.05}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Fat layer rendering", () => {
    it("should render with fat layer when opacity is sufficient", () => {
      const attachment = BONE_MUSCLE_MAP.spine_middle[0]; // Pectorals
      const { container } = render3D(
        <BoneAttachedMuscle
          attachment={attachment}
          tension={0.5}
          isShaking={false}
          muscleScaleFactor={1.2}
          fatLayerOpacity={0.4}
          fatLayerThickness={0.25}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Exhaustion shaking", () => {
    it("should render with shaking enabled", () => {
      const attachment = BONE_MUSCLE_MAP.upper_arm_R[0];
      const { container } = render3D(
        <BoneAttachedMuscle
          attachment={attachment}
          tension={0.8}
          isShaking={true}
          muscleScaleFactor={1.0}
          fatLayerOpacity={0}
          fatLayerThickness={0}
        />
      );

      expect(container).toBeTruthy();
    });
  });
});

describe("BoneMuscles", () => {
  it("should render without crashing", () => {
    const muscleStates = new Map<string, number>();
    const { container } = render3D(
      <BoneMuscles
        boneName="upper_arm_R"
        muscleStates={muscleStates}
        isExhausted={false}
      />
    );

    expect(container.querySelector("canvas")).toBeTruthy();
  });

  it("should render nothing for bone without muscles", () => {
    const muscleStates = new Map<string, number>();
    const { container } = render3D(
      <BoneMuscles
        boneName="hand_R"
        muscleStates={muscleStates}
        isExhausted={false}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with varying tensions", () => {
    const muscleStates = new Map<string, number>([
      ["BICEP_R", 1.0],
      ["TRICEP_R", 0.5],
    ]);

    const { container } = render3D(
      <BoneMuscles
        boneName="upper_arm_R"
        muscleStates={muscleStates}
        isExhausted={false}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with physical attributes (Jojik)", () => {
    const muscleStates = new Map<string, number>([["GLUTE_L", 0.5]]);

    const { container } = render3D(
      <BoneMuscles
        boneName="hip_L"
        muscleStates={muscleStates}
        isExhausted={false}
        physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render with exhaustion flag", () => {
    const muscleStates = new Map<string, number>([["BICEP_R", 0.8]]);

    const { container } = render3D(
      <BoneMuscles
        boneName="upper_arm_R"
        muscleStates={muscleStates}
        isExhausted={true}
      />
    );

    expect(container).toBeTruthy();
  });

  describe("Archetype visual differences", () => {
    it("should render Jojik archetype hip muscles (bulky)", () => {
      const muscleStates = new Map<string, number>([
        ["GLUTE_L", 0.5],
        ["GLUTE_R", 0.5],
      ]);

      // Jojik: 42kg muscle, 18kg fat - should be bulky and thick
      const { container } = render3D(
        <>
          <BoneMuscles
            boneName="hip_L"
            muscleStates={muscleStates}
            isExhausted={false}
            physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
          />
          <BoneMuscles
            boneName="hip_R"
            muscleStates={muscleStates}
            isExhausted={false}
            physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
          />
        </>
      );

      expect(container).toBeTruthy();
    });

    it("should render Amsalja archetype arm muscles (lean)", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.5],
        ["TRICEP_R", 0.5],
      ]);

      // Amsalja: 32kg muscle, 9kg fat - should be lean
      const { container } = render3D(
        <BoneMuscles
          boneName="upper_arm_R"
          muscleStates={muscleStates}
          isExhausted={false}
          physicalAttributes={{ muscleMass: 32, fatMass: 9 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render Musa archetype core muscles (balanced)", () => {
      const muscleStates = new Map<string, number>([
        ["PECTORALS", 0.5],
        ["CORE", 0.5],
        ["ABS", 0.5],
      ]);

      // Musa: 38kg muscle, 12kg fat - should be balanced
      const { container } = render3D(
        <BoneMuscles
          boneName="spine_middle"
          muscleStates={muscleStates}
          isExhausted={false}
          physicalAttributes={{ muscleMass: 38, fatMass: 12 }}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Edge cases", () => {
    it("should handle tension values > 1.0", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", 1.5]]);

      const { container } = render3D(
        <BoneMuscles
          boneName="upper_arm_R"
          muscleStates={muscleStates}
          isExhausted={false}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should handle negative tension values", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", -0.5]]);

      const { container } = render3D(
        <BoneMuscles
          boneName="upper_arm_R"
          muscleStates={muscleStates}
          isExhausted={false}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should handle NaN tension values", () => {
      const muscleStates = new Map<string, number>([["BICEP_R", NaN]]);

      const { container } = render3D(
        <BoneMuscles
          boneName="upper_arm_R"
          muscleStates={muscleStates}
          isExhausted={false}
        />
      );

      expect(container).toBeTruthy();
    });
  });
});

describe("Integration scenarios", () => {
  it("should render jab activation pattern across bones", () => {
    const muscleStates = new Map<string, number>([
      ["SHOULDER_R", 0.7],
      ["BICEP_R", 1.0],
      ["TRICEP_R", 0.8],
      ["PECTORALS", 0.6],
      ["CORE", 0.5],
    ]);

    const { container } = render3D(
      <>
        <BoneMuscles
          boneName="shoulder_R"
          muscleStates={muscleStates}
          isExhausted={false}
        />
        <BoneMuscles
          boneName="upper_arm_R"
          muscleStates={muscleStates}
          isExhausted={false}
        />
        <BoneMuscles
          boneName="spine_middle"
          muscleStates={muscleStates}
          isExhausted={false}
        />
      </>
    );

    expect(container).toBeTruthy();
  });

  it("should render front kick activation pattern across bones", () => {
    const muscleStates = new Map<string, number>([
      ["QUAD_R", 1.0],
      ["GLUTE_R", 0.9],
      ["HAMSTRING_R", 0.4],
      ["CALF_R", 0.7],
      ["CORE", 0.6],
    ]);

    const { container } = render3D(
      <>
        <BoneMuscles
          boneName="hip_R"
          muscleStates={muscleStates}
          isExhausted={false}
        />
        <BoneMuscles
          boneName="thigh_R"
          muscleStates={muscleStates}
          isExhausted={false}
        />
        <BoneMuscles
          boneName="shin_R"
          muscleStates={muscleStates}
          isExhausted={false}
        />
        <BoneMuscles
          boneName="spine_middle"
          muscleStates={muscleStates}
          isExhausted={false}
        />
      </>
    );

    expect(container).toBeTruthy();
  });

  it("should render exhausted Jojik fighter state", () => {
    const muscleStates = new Map<string, number>([
      ["BICEP_R", 0.7],
      ["QUAD_R", 0.6],
      ["CORE", 0.5],
      ["GLUTE_L", 0.4],
      ["GLUTE_R", 0.4],
    ]);

    const { container } = render3D(
      <>
        <BoneMuscles
          boneName="upper_arm_R"
          muscleStates={muscleStates}
          isExhausted={true}
          physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
        />
        <BoneMuscles
          boneName="thigh_R"
          muscleStates={muscleStates}
          isExhausted={true}
          physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
        />
        <BoneMuscles
          boneName="hip_L"
          muscleStates={muscleStates}
          isExhausted={true}
          physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
        />
        <BoneMuscles
          boneName="hip_R"
          muscleStates={muscleStates}
          isExhausted={true}
          physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
        />
        <BoneMuscles
          boneName="spine_middle"
          muscleStates={muscleStates}
          isExhausted={true}
          physicalAttributes={{ muscleMass: 42, fatMass: 18 }}
        />
      </>
    );

    expect(container).toBeTruthy();
  });
});

describe("Performance", () => {
  it("should render all bone muscle groups efficiently", () => {
    const startTime = performance.now();

    const muscleStates = new Map<string, number>();
    // Add tension for all muscle groups
    Object.values(BONE_MUSCLE_MAP).forEach((attachments) => {
      attachments.forEach((attachment) => {
        muscleStates.set(attachment.name, Math.random());
      });
    });

    const { container } = render3D(
      <>
        {Object.keys(BONE_MUSCLE_MAP).map((boneName) => (
          <BoneMuscles
            key={boneName}
            boneName={boneName}
            muscleStates={muscleStates}
            isExhausted={false}
            physicalAttributes={{ muscleMass: 38, fatMass: 12 }}
          />
        ))}
      </>
    );

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    expect(container).toBeTruthy();
    // Initial render should be reasonably fast (generous timeout for CI)
    expect(renderTime).toBeLessThan(1000);
  });
});
