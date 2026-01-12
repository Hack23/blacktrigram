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

describe("calculateMuscleScaleFactor (Jojik enhancement)", () => {
  it("should return 1.0 for reference muscle mass (35kg - Musa baseline)", () => {
describe("calculateMuscleScaleFactor (non-linear)", () => {
  it("should return 1.0 for reference muscle mass (35kg - Musa)", () => {
    const factor = calculateMuscleScaleFactor(35);
    expect(factor).toBeCloseTo(1.0, 2);
  });

  it("should make Jojik dramatically larger than Musa", () => {
    const musaScale = calculateMuscleScaleFactor(35); // 1.0
    const jojikScale = calculateMuscleScaleFactor(48); // 1.84

    expect(jojikScale).toBeGreaterThan(1.8); // At least 80% larger
    expect(jojikScale / musaScale).toBeGreaterThan(1.75); // 75%+ difference
  });

  it("should make Jojik overwhelmingly larger than Hacker", () => {
    const hackerScale = calculateMuscleScaleFactor(28); // 0.67
    const jojikScale = calculateMuscleScaleFactor(48); // 1.84

    expect(jojikScale / hackerScale).toBeGreaterThan(2.5); // 150%+ difference
  });

  it("should create clear visual hierarchy across all archetypes", () => {
    const scales = [
      { name: "Hacker", mass: 28, scale: calculateMuscleScaleFactor(28) },
      { name: "Amsalja", mass: 30, scale: calculateMuscleScaleFactor(30) },
      { name: "Jeongbo", mass: 32, scale: calculateMuscleScaleFactor(32) },
      { name: "Musa", mass: 35, scale: calculateMuscleScaleFactor(35) },
      { name: "Jojik", mass: 48, scale: calculateMuscleScaleFactor(48) },
    ];

    // Verify each archetype is noticeably larger than the previous
    for (let i = 1; i < scales.length; i++) {
      const diff =
        (scales[i].scale - scales[i - 1].scale) / scales[i - 1].scale;
      expect(diff).toBeGreaterThan(0.04); // At least 4% difference (Jeongbo-Musa is smallest gap)
    }

    // Verify Jojik is the most dramatic jump
    const jojikJump = (scales[4].scale - scales[3].scale) / scales[3].scale;
    expect(jojikJump).toBeGreaterThan(0.5); // At least 50% jump
  });

  it("should make Hacker visibly skinny (< 0.75 scale)", () => {
    const hackerScale = calculateMuscleScaleFactor(28);
    expect(hackerScale).toBeLessThan(0.75);
    expect(hackerScale).toBeGreaterThan(0.65); // Realistic skinny range
  });

  it("should make Amsalja lean (< 0.85 scale)", () => {
    const amsaljaScale = calculateMuscleScaleFactor(30);
    expect(amsaljaScale).toBeLessThan(0.85);
    expect(amsaljaScale).toBeGreaterThan(0.75);
  });

  it("should return < 1.0 for below-average muscle mass", () => {
  it("should make Hacker noticeably skinnier than Musa", () => {
    const hackerScale = calculateMuscleScaleFactor(28); // Hacker
    const musaScale = calculateMuscleScaleFactor(35); // Musa

    // Hacker should be around 0.64 scale (skinny)
    expect(hackerScale).toBeGreaterThan(0.6);
    expect(hackerScale).toBeLessThan(0.7);
    // Difference should be at least 50% for visual distinction
    expect(musaScale / hackerScale).toBeGreaterThan(1.4);
  });

  it("should make Amsalja lean athlete (0.78 scale)", () => {
    const amsaljaScale = calculateMuscleScaleFactor(30); // Amsalja

    // Amsalja should be around 0.78 scale (lean but athletic)
    expect(amsaljaScale).toBeGreaterThan(0.75);
    expect(amsaljaScale).toBeLessThan(0.85);
  });

  it("should make Jojik dramatically larger than Musa", () => {
    const musaScale = calculateMuscleScaleFactor(35); // Musa
    const jojikScale = calculateMuscleScaleFactor(48); // Jojik

    // Jojik should be around 1.9 scale (massive)
    expect(jojikScale).toBeGreaterThan(1.85);
    expect(jojikScale).toBeLessThan(2.0);
    // Should be 90% larger than Musa
    expect(jojikScale / musaScale).toBeGreaterThan(1.85);
  });

  it("should create clear visual hierarchy across all archetypes", () => {
    const scales = [
      { name: "Hacker", scale: calculateMuscleScaleFactor(28) },
      { name: "Amsalja", scale: calculateMuscleScaleFactor(30) },
      { name: "Jeongbo", scale: calculateMuscleScaleFactor(32) },
      { name: "Musa", scale: calculateMuscleScaleFactor(35) },
      { name: "Jojik", scale: calculateMuscleScaleFactor(48) },
    ];

    // Verify ascending order
    for (let i = 1; i < scales.length; i++) {
      expect(scales[i].scale).toBeGreaterThan(scales[i - 1].scale);
    }

    // Verify minimum 10% difference between adjacent archetypes
    for (let i = 1; i < scales.length; i++) {
      const diff = (scales[i].scale - scales[i - 1].scale) / scales[i - 1].scale;
      expect(diff).toBeGreaterThan(0.1);
    }
  });

  it("should return < 1.0 for low muscle mass (Jeongbo - 32kg)", () => {
    const factor = calculateMuscleScaleFactor(32);
    expect(factor).toBeLessThan(1.0);
    expect(factor).toBeGreaterThan(0.8); // Should be 0.89
  });

  it("should use exponential amplification for extreme values", () => {
    // Test that deviation from baseline is exponential, not linear
    const deviation28 = calculateMuscleScaleFactor(28) - 1.0; // -7kg from baseline
    const deviation48 = calculateMuscleScaleFactor(48) - 1.0; // +13kg from baseline

    // Positive deviation should be amplified more than negative
    expect(Math.abs(deviation48)).toBeGreaterThan(Math.abs(deviation28) * 2);
  });
});

describe("calculateFatLayerOpacity (Jojik enhancement)", () => {
  it("should return minimum opacity for low fat mass (Amsalja - 10kg)", () => {
    const opacity = calculateFatLayerOpacity(10);
    expect(opacity).toBeCloseTo(0.05, 2);
    expect(opacity).toBeLessThan(0.1); // Nearly invisible
  });

  it("should make Jojik fat layer highly visible", () => {
    const jojikFatOpacity = calculateFatLayerOpacity(20);
    expect(jojikFatOpacity).toBeGreaterThan(0.7); // Clearly visible
    expect(jojikFatOpacity).toBeLessThan(0.85); // Not fully opaque
  it("should show dramatic difference between extremes (Hacker vs Jojik)", () => {
    const hackerFactor = calculateMuscleScaleFactor(28); // Hacker
    const jojikFactor = calculateMuscleScaleFactor(48); // Jojik

    // Jojik should be about 3x larger than Hacker
    expect(jojikFactor / hackerFactor).toBeGreaterThan(2.9);
  });
});

describe("calculateFatLayerOpacity (enhanced range)", () => {
  it("should make Amsalja fat layer nearly invisible", () => {
    const amsaljaOpacity = calculateFatLayerOpacity(10);
    // Should be 0.05 (very transparent)
    expect(amsaljaOpacity).toBeLessThan(0.1);
    expect(amsaljaOpacity).toBeCloseTo(0.05, 2);
  });

  it("should make Jojik fat layer very visible", () => {
    const jojikOpacity = calculateFatLayerOpacity(20);
    // Should be > 0.7 (clearly visible)
    expect(jojikOpacity).toBeGreaterThan(0.7);
  });

  it("should return maximum opacity for highest fat mass", () => {
    const opacity = calculateFatLayerOpacity(22);
    expect(opacity).toBeCloseTo(0.85, 2);
  });

  it("should make Jojik fat layer much more visible than Musa", () => {
    const musaFatOpacity = calculateFatLayerOpacity(13); // 0.25
    const jojikFatOpacity = calculateFatLayerOpacity(20); // 0.72

    expect(jojikFatOpacity).toBeGreaterThan(musaFatOpacity * 2.5);
  });

  it("should return moderate opacity for average fat mass (Musa - 13kg)", () => {
    const opacity = calculateFatLayerOpacity(13);
    expect(opacity).toBeGreaterThan(0.2);
    expect(opacity).toBeLessThan(0.35);
  });

  it("should cap at maximum opacity (0.85)", () => {
    const opacity = calculateFatLayerOpacity(22); // Max fat
    expect(opacity).toBeLessThanOrEqual(0.85);
    expect(opacity).toBeGreaterThan(0.75);
  });

  it("should show clear progression across fat mass ranges", () => {
    const opacities = [
      { mass: 10, opacity: calculateFatLayerOpacity(10) },
      { mass: 13, opacity: calculateFatLayerOpacity(13) },
      { mass: 16, opacity: calculateFatLayerOpacity(16) },
      { mass: 20, opacity: calculateFatLayerOpacity(20) },
      { mass: 22, opacity: calculateFatLayerOpacity(22) },
    ];

    // Each should be progressively more opaque
    for (let i = 1; i < opacities.length; i++) {
      expect(opacities[i].opacity).toBeGreaterThan(opacities[i - 1].opacity);
    }
  });

  it("should create clear fat visibility progression", () => {
    const amsaljaOpacity = calculateFatLayerOpacity(10); // 0.05
    const hackerOpacity = calculateFatLayerOpacity(15); // ~0.38
    const jojikOpacity = calculateFatLayerOpacity(20); // ~0.72

    // Each archetype should have distinctly different opacity
    expect(hackerOpacity - amsaljaOpacity).toBeGreaterThan(0.3);
    expect(jojikOpacity - hackerOpacity).toBeGreaterThan(0.3);
  });
});

describe("calculateFatLayerThickness (Jojik enhancement)", () => {
  it("should return minimum thickness for low fat mass (Amsalja - 10kg)", () => {
    const thickness = calculateFatLayerThickness(10);
    expect(thickness).toBeCloseTo(0.02, 2);
    expect(thickness).toBeLessThan(0.05);
  });

  it("should make Jojik fat layer add significant bulk", () => {
    const jojikFatThickness = calculateFatLayerThickness(20);
    expect(jojikFatThickness).toBeGreaterThan(0.45); // Thick padding
    expect(jojikFatThickness).toBeLessThan(0.6);
  });

  it("should return moderate thickness for average fat mass (Musa - 13kg)", () => {
    const thickness = calculateFatLayerThickness(13);
    expect(thickness).toBeGreaterThan(0.05);
    expect(thickness).toBeLessThan(0.15);
  });

  it("should return maximum thickness for max fat mass", () => {
    const thickness = calculateFatLayerThickness(22);
    expect(thickness).toBeCloseTo(0.6, 1);
    expect(thickness).toBeLessThanOrEqual(0.6);
  });

  it("should use exponential curve for thickness growth", () => {
    const thickness10 = calculateFatLayerThickness(10); // Min
    const thickness16 = calculateFatLayerThickness(16); // Mid
    const thickness22 = calculateFatLayerThickness(22); // Max

    // Growth should be exponential - larger difference at high values
    const lowRangeGrowth = thickness16 - thickness10;
    const highRangeGrowth = thickness22 - thickness16;

    expect(highRangeGrowth).toBeGreaterThan(lowRangeGrowth * 1.5);
  });

  it("should show clear progression across fat mass ranges", () => {
    const thicknesses = [
      { mass: 10, thickness: calculateFatLayerThickness(10) },
      { mass: 13, thickness: calculateFatLayerThickness(13) },
      { mass: 16, thickness: calculateFatLayerThickness(16) },
      { mass: 20, thickness: calculateFatLayerThickness(20) },
      { mass: 22, thickness: calculateFatLayerThickness(22) },
    ];

    // Each should be progressively thicker
    for (let i = 1; i < thicknesses.length; i++) {
      expect(thicknesses[i].thickness).toBeGreaterThan(
        thicknesses[i - 1].thickness
      );
    }
describe("calculateFatLayerThickness (exponential)", () => {
  it("should return minimum thickness for low fat mass (Amsalja)", () => {
    const thickness = calculateFatLayerThickness(10);
    // New minimum: 0.02 (very thin)
    expect(thickness).toBeCloseTo(0.02, 2);
  });

  it("should return maximum thickness for high fat mass (Jojik)", () => {
    const thickness = calculateFatLayerThickness(22);
    // New maximum: 0.60 (very thick)
    expect(thickness).toBeCloseTo(0.6, 2);
  });

  it("should use exponential curve for dramatic differences", () => {
    const lowFatThickness = calculateFatLayerThickness(10); // 0.02
    const midFatThickness = calculateFatLayerThickness(16); // ~0.17
    const highFatThickness = calculateFatLayerThickness(22); // 0.60

    // Exponential curve means high-fat values grow faster
    const lowToMidDiff = midFatThickness - lowFatThickness;
    const midToHighDiff = highFatThickness - midFatThickness;

    // High-end difference should be larger (but may not be 2x due to exponential shape)
    expect(midToHighDiff).toBeGreaterThan(lowToMidDiff);
  });

  it("should create visible fat layer progression across archetypes", () => {
    const amsaljaThickness = calculateFatLayerThickness(10); // Very thin
    const musaThickness = calculateFatLayerThickness(13); // Moderate
    const jojikThickness = calculateFatLayerThickness(20); // Very thick

    // Each should be visibly different
    expect(musaThickness).toBeGreaterThan(amsaljaThickness * 2);
    expect(jojikThickness).toBeGreaterThan(musaThickness * 2);
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
    it("should render with Jojik muscle scale factor (48kg)", () => {
      const attachment = BONE_MUSCLE_MAP.hip_L[0]; // Glute
      const jojikFactor = calculateMuscleScaleFactor(48); // Changed from 42kg to 48kg
    it("should render with Jojik muscle scale factor (48kg muscle)", () => {
      const attachment = BONE_MUSCLE_MAP.hip_L[0]; // Glute
      const jojikFactor = calculateMuscleScaleFactor(48); // Jojik: 48kg muscle

      const { container } = render3D(
        <BoneAttachedMuscle
          attachment={attachment}
          tension={0.5}
          isShaking={false}
          muscleScaleFactor={jojikFactor}
          fatLayerOpacity={calculateFatLayerOpacity(20)}
          fatLayerThickness={calculateFatLayerThickness(20)}
          fatLayerOpacity={0.72}
          fatLayerThickness={0.45}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with Hacker muscle scale factor (28kg muscle - skinny)", () => {
      const attachment = BONE_MUSCLE_MAP.upper_arm_R[0];
      const hackerFactor = calculateMuscleScaleFactor(28); // Hacker: 28kg muscle

      const { container } = render3D(
        <BoneAttachedMuscle
          attachment={attachment}
          tension={0.5}
          isShaking={false}
          muscleScaleFactor={hackerFactor}
          fatLayerOpacity={0.38}
          fatLayerThickness={0.12}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with Amsalja muscle scale factor (30kg)", () => {
      const attachment = BONE_MUSCLE_MAP.upper_arm_R[0];
      const amsaljaFactor = calculateMuscleScaleFactor(30); // Changed from 32kg
    it("should render with Amsalja muscle scale factor (30kg muscle - lean)", () => {
      const attachment = BONE_MUSCLE_MAP.upper_arm_R[0];
      const amsaljaFactor = calculateMuscleScaleFactor(30); // Amsalja: 30kg muscle

      const { container } = render3D(
        <BoneAttachedMuscle
          attachment={attachment}
          tension={0.5}
          isShaking={false}
          muscleScaleFactor={amsaljaFactor}
          fatLayerOpacity={0.05}
          fatLayerThickness={0.02}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render with Hacker muscle scale factor (28kg - very skinny)", () => {
      const attachment = BONE_MUSCLE_MAP.upper_arm_R[0];
      const hackerFactor = calculateMuscleScaleFactor(28);

      const { container } = render3D(
        <BoneAttachedMuscle
          attachment={attachment}
          tension={0.5}
          isShaking={false}
          muscleScaleFactor={hackerFactor}
          fatLayerOpacity={0.35}
          fatLayerThickness={0.15}
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

  it("should render with physical attributes (Jojik - 48kg muscle, 20kg fat)", () => {
    const muscleStates = new Map<string, number>([["GLUTE_L", 0.5]]);

    const { container } = render3D(
      <BoneMuscles
        boneName="hip_L"
        muscleStates={muscleStates}
        isExhausted={false}
        physicalAttributes={{ muscleMass: 48, fatMass: 20 }}
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
    it("should render Jojik archetype hip muscles (bulky - 48kg muscle, 20kg fat)", () => {
      const muscleStates = new Map<string, number>([
        ["GLUTE_L", 0.5],
        ["GLUTE_R", 0.5],
      ]);

      // Jojik: 48kg muscle, 20kg fat - should be bulky and thick
      // Jojik: 48kg muscle, 20kg fat - should be massive and thick
      const { container } = render3D(
        <>
          <BoneMuscles
            boneName="hip_L"
            muscleStates={muscleStates}
            isExhausted={false}
            physicalAttributes={{ muscleMass: 48, fatMass: 20 }}
          />
          <BoneMuscles
            boneName="hip_R"
            muscleStates={muscleStates}
            isExhausted={false}
            physicalAttributes={{ muscleMass: 48, fatMass: 20 }}
          />
        </>
      );

      expect(container).toBeTruthy();
    });

    it("should render Hacker archetype arm muscles (skinny - 28kg muscle, 15kg fat)", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.5],
        ["TRICEP_R", 0.5],
      ]);

      // Hacker: 28kg muscle, 15kg fat - should be skinny
      const { container } = render3D(
        <BoneMuscles
          boneName="upper_arm_R"
          muscleStates={muscleStates}
          isExhausted={false}
          physicalAttributes={{ muscleMass: 28, fatMass: 15 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render Amsalja archetype arm muscles (lean - 30kg muscle, 10kg fat)", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.5],
        ["TRICEP_R", 0.5],
      ]);

      // Amsalja: 30kg muscle, 10kg fat - should be lean
      // Amsalja: 30kg muscle, 10kg fat - should be very lean
      const { container } = render3D(
        <BoneMuscles
          boneName="upper_arm_R"
          muscleStates={muscleStates}
          isExhausted={false}
          physicalAttributes={{ muscleMass: 30, fatMass: 10 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render Musa archetype core muscles (balanced - 35kg muscle, 13kg fat)", () => {
      const muscleStates = new Map<string, number>([
        ["PECTORALS", 0.5],
        ["CORE", 0.5],
        ["ABS", 0.5],
      ]);

      // Musa: 35kg muscle, 13kg fat - should be balanced
      const { container } = render3D(
        <BoneMuscles
          boneName="spine_middle"
          muscleStates={muscleStates}
          isExhausted={false}
          physicalAttributes={{ muscleMass: 35, fatMass: 13 }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should render Hacker archetype (skinny - 28kg muscle, 12kg fat)", () => {
      const muscleStates = new Map<string, number>([
        ["BICEP_R", 0.5],
        ["TRICEP_R", 0.5],
      ]);

      // Hacker: 28kg muscle, 12kg fat - should be very skinny
      const { container } = render3D(
        <BoneMuscles
          boneName="upper_arm_R"
          muscleStates={muscleStates}
          isExhausted={false}
          physicalAttributes={{ muscleMass: 28, fatMass: 12 }}
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

  it("should render exhausted Jojik fighter state (48kg muscle, 20kg fat)", () => {
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
          physicalAttributes={{ muscleMass: 48, fatMass: 20 }}
        />
        <BoneMuscles
          boneName="thigh_R"
          muscleStates={muscleStates}
          isExhausted={true}
          physicalAttributes={{ muscleMass: 48, fatMass: 20 }}
        />
        <BoneMuscles
          boneName="hip_L"
          muscleStates={muscleStates}
          isExhausted={true}
          physicalAttributes={{ muscleMass: 48, fatMass: 20 }}
        />
        <BoneMuscles
          boneName="hip_R"
          muscleStates={muscleStates}
          isExhausted={true}
          physicalAttributes={{ muscleMass: 48, fatMass: 20 }}
        />
        <BoneMuscles
          boneName="spine_middle"
          muscleStates={muscleStates}
          isExhausted={true}
          physicalAttributes={{ muscleMass: 48, fatMass: 20 }}
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
            physicalAttributes={{ muscleMass: 35, fatMass: 13 }}
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
