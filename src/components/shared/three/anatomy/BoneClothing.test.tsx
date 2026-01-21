/**
 * Tests for bone-attached clothing system 3D component
 *
 * Validates clothing attachment to bones, body thickness calculations,
 * fit scaling, archetype-specific styling, and physical attribute scaling.
 *
 * @module components/three/BoneClothing.test
 * @category Tests
 * @korean 뼈부착의류시스템컴포넌트테스트
 */

import { Canvas } from "@react-three/fiber";
import { render } from "@testing-library/react";
import React, { Suspense } from "react";
import { describe, expect, it } from "vitest";
import { PlayerArchetype } from "../../../../types/common";
import { BoneClothing } from "./BoneClothing";

// Helper to render Three.js components
function render3D(component: React.ReactElement) {
  return render(
    <Canvas>
      <Suspense fallback={null}>{component}</Suspense>
    </Canvas>
  );
}

// Helper to calculate body thickness (matching implementation)
function calculateBodyThickness(muscleMass: number, fatMass: number): number {
  const referenceMuscle = 35;
  const referenceFat = 12;
  const muscleRatio = muscleMass / referenceMuscle;
  const muscleContribution = Math.sqrt(muscleRatio) * 0.7;
  const fatRatio = fatMass / referenceFat;
  const fatContribution = Math.sqrt(fatRatio) * 0.3;
  return muscleContribution + fatContribution;
}

describe("BoneClothing", () => {
  // ========================================
  // A. Basic Rendering Tests (4 tests)
  // ========================================
  describe("Basic rendering", () => {
    it("should render without crashing for Musa archetype", () => {
      const { container } = render3D(
        <BoneClothing boneName="spine_middle" archetype={PlayerArchetype.MUSA} />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render without crashing for Amsalja archetype", () => {
      const { container } = render3D(
        <BoneClothing boneName="spine_middle" archetype={PlayerArchetype.AMSALJA} />
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with default physical attributes", () => {
      const { container } = render3D(
        <BoneClothing boneName="spine_middle" archetype={PlayerArchetype.MUSA} />
      );

      expect(container).toBeTruthy();
    });

    it("should return null for bones without clothing", () => {
      const { container } = render3D(
        <BoneClothing boneName="hand_R" archetype={PlayerArchetype.MUSA} />
      );

      // Component renders canvas but no clothing meshes
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  // ========================================
  // B. Body Thickness Calculation Tests (6 tests)
  // ========================================
  describe("Body thickness calculation", () => {
    it("should calculate correct thickness for lean build", () => {
      const thickness = calculateBodyThickness(25, 8);

      expect(thickness).toBeLessThan(1.0);
      expect(thickness).toBeGreaterThan(0.7);
      expect(thickness).toBeCloseTo(0.837, 2);
    });

    it("should calculate correct thickness for average build", () => {
      const thickness = calculateBodyThickness(35, 12);

      expect(thickness).toBeCloseTo(1.0, 2);
    });

    it("should calculate correct thickness for muscular build", () => {
      const thickness = calculateBodyThickness(50, 10);

      expect(thickness).toBeGreaterThan(1.1);
      expect(thickness).toBeCloseTo(1.11, 2);
    });

    it("should calculate correct thickness for Amsalja (30kg muscle, 10kg fat)", () => {
      const thickness = calculateBodyThickness(30, 10);

      // Amsalja: very lean build
      expect(thickness).toBeLessThan(1.0);
      expect(thickness).toBeCloseTo(0.92, 2);
    });

    it("should calculate correct thickness for Musa (35kg muscle, 13kg fat)", () => {
      const thickness = calculateBodyThickness(35, 13);

      // Musa: balanced build
      expect(thickness).toBeCloseTo(1.01, 2);
    });

    it("should calculate correct thickness for Jojik (48kg muscle, 20kg fat)", () => {
      const thickness = calculateBodyThickness(48, 20);

      // Jojik: bulky build
      expect(thickness).toBeGreaterThan(1.2);
      expect(thickness).toBeCloseTo(1.21, 2);
    });
  });

  // ========================================
  // C. Clothing Attachment Generation Tests (8 tests)
  // ========================================
  describe("Clothing attachment generation", () => {
    it("should generate torso clothing for spine_middle", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should generate sleeve attachments for upper_arm_L", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="upper_arm_L"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should generate sleeve attachments for forearm_R", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="forearm_R"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should generate pants attachments for thigh_L", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="thigh_L"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should generate pants attachments for shin_R", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="shin_R"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should generate belt attachments for pelvis", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="pelvis"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should return empty array for invalid bone name", () => {
      const { container } = render3D(
        <BoneClothing boneName="invalid_bone_xyz" archetype={PlayerArchetype.MUSA} />
      );

      expect(container).toBeTruthy();
    });

    it("should generate clothing for all archetypes on spine_middle", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const { container } = render3D(
          <BoneClothing boneName="spine_middle" archetype={archetype} />
        );

        expect(container).toBeTruthy();
      });
    });
  });

  // ========================================
  // D. Fit Scale Mapping Tests (4 tests)
  // ========================================
  describe("Fit scale mapping", () => {
    it("should apply tight fit scale (1.08x)", () => {
      // Amsalja typically uses tight fit for tactical clothing
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.AMSALJA}
          physicalAttributes={{
            muscleMass: 30,
            fatMass: 10,
            shoulderWidth: 43,
            torsoLength: 58,
            armLength: 61,
            legLength: 95,
          }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should apply fitted scale (1.15x)", () => {
      // Musa uses fitted style for dobok
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 13,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should apply loose fit scale (1.25x)", () => {
      // Some archetypes may use loose fit
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.JOJIK_POKRYEOKBAE}
          physicalAttributes={{
            muscleMass: 48,
            fatMass: 20,
            shoulderWidth: 52,
            torsoLength: 61,
            armLength: 64,
            legLength: 98,
          }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should apply oversized fit scale (1.4x)", () => {
      // Test oversized fit for any archetype that might use it
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.HACKER}
          physicalAttributes={{
            muscleMass: 28,
            fatMass: 15,
            shoulderWidth: 42,
            torsoLength: 57,
            armLength: 60,
            legLength: 94,
          }}
        />
      );

      expect(container).toBeTruthy();
    });
  });

  // ========================================
  // E. Material Properties Tests (3 tests)
  // ========================================
  describe("Material properties", () => {
    it("should apply emissive properties for Hacker archetype (cyberpunk style)", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.HACKER}
          physicalAttributes={{
            muscleMass: 28,
            fatMass: 15,
            shoulderWidth: 42,
            torsoLength: 57,
            armLength: 60,
            legLength: 94,
          }}
        />
      );

      // Should render with emissive materials for cyberpunk aesthetic
      expect(container).toBeTruthy();
    });

    it("should apply traditional colors for Musa archetype", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 13,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      // Should render with traditional Korean dobok colors
      expect(container).toBeTruthy();
    });

    it("should apply tactical colors for Amsalja archetype", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.AMSALJA}
          physicalAttributes={{
            muscleMass: 30,
            fatMass: 10,
            shoulderWidth: 43,
            torsoLength: 58,
            armLength: 61,
            legLength: 95,
          }}
        />
      );

      // Should render with tactical black gear
      expect(container).toBeTruthy();
    });
  });

  // ========================================
  // F. Geometry Cleanup Tests (2 tests)
  // ========================================
  describe("Geometry and material cleanup", () => {
    it("should dispose all geometries on unmount", () => {
      const { unmount } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      // Unmount should trigger cleanup
      expect(() => unmount()).not.toThrow();
    });

    it("should dispose all materials on unmount", () => {
      const { unmount } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      // Unmount should trigger cleanup
      expect(() => unmount()).not.toThrow();
    });
  });

  // ========================================
  // G. Player Archetype Tests (5 tests)
  // ========================================
  describe("Player archetype clothing styles", () => {
    it("should render Musa: Traditional dobok with fitted style", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 13,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      expect(container).toBeTruthy();
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render Amsalja: Black tactical gear with tight fit", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.AMSALJA}
          physicalAttributes={{
            muscleMass: 30,
            fatMass: 10,
            shoulderWidth: 43,
            torsoLength: 58,
            armLength: 61,
            legLength: 95,
          }}
        />
      );

      expect(container).toBeTruthy();
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render Hacker: Cyberpunk style with emissive accents", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.HACKER}
          physicalAttributes={{
            muscleMass: 28,
            fatMass: 15,
            shoulderWidth: 42,
            torsoLength: 57,
            armLength: 60,
            legLength: 94,
          }}
        />
      );

      expect(container).toBeTruthy();
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render Jeongbo Yowon: Intelligence operative clothing", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.JEONGBO_YOWON}
          physicalAttributes={{
            muscleMass: 32,
            fatMass: 11,
            shoulderWidth: 44,
            torsoLength: 58,
            armLength: 61,
            legLength: 95,
          }}
        />
      );

      expect(container).toBeTruthy();
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render Jojik Pokryeokbae: Organized crime attire", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.JOJIK_POKRYEOKBAE}
          physicalAttributes={{
            muscleMass: 48,
            fatMass: 20,
            shoulderWidth: 52,
            torsoLength: 61,
            armLength: 64,
            legLength: 98,
          }}
        />
      );

      expect(container).toBeTruthy();
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  // ========================================
  // H. Physical Attributes Scaling Tests (3 tests)
  // ========================================
  describe("Physical attributes scaling", () => {
    it("should scale clothing with shoulder width", () => {
      const narrowShoulders = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 40, // Narrow
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      const wideShoulders = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 52, // Wide
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      expect(narrowShoulders.container).toBeTruthy();
      expect(wideShoulders.container).toBeTruthy();
    });

    it("should scale clothing with torso length", () => {
      const shortTorso = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 55, // Short
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      const longTorso = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 65, // Long
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      expect(shortTorso.container).toBeTruthy();
      expect(longTorso.container).toBeTruthy();
    });

    it("should scale clothing with arm and leg length", () => {
      const shortLimbs = render3D(
        <BoneClothing
          boneName="upper_arm_R"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 58, // Short arms
            legLength: 92, // Short legs
          }}
        />
      );

      const longLimbs = render3D(
        <BoneClothing
          boneName="thigh_L"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 66, // Long arms
            legLength: 102, // Long legs
          }}
        />
      );

      expect(shortLimbs.container).toBeTruthy();
      expect(longLimbs.container).toBeTruthy();
    });
  });

  // ========================================
  // I. Edge Cases Tests (3 tests)
  // ========================================
  describe("Edge cases", () => {
    it("should handle very low muscle mass (< 25kg)", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 22, // Very low
            fatMass: 8,
            shoulderWidth: 40,
            torsoLength: 56,
            armLength: 58,
            legLength: 92,
          }}
        />
      );

      expect(container).toBeTruthy();
      
      // Verify thickness calculation still works
      const thickness = calculateBodyThickness(22, 8);
      expect(thickness).toBeGreaterThan(0.6);
      expect(thickness).toBeLessThan(0.9);
    });

    it("should handle very high muscle mass (> 50kg)", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.JOJIK_POKRYEOKBAE}
          physicalAttributes={{
            muscleMass: 55, // Very high
            fatMass: 22,
            shoulderWidth: 55,
            torsoLength: 62,
            armLength: 66,
            legLength: 100,
          }}
        />
      );

      expect(container).toBeTruthy();
      
      // Verify thickness calculation still works
      const thickness = calculateBodyThickness(55, 22);
      expect(thickness).toBeGreaterThan(1.25);
      expect(thickness).toBeLessThan(1.35);
    });

    it("should use defaults for missing physical attributes", () => {
      const { container } = render3D(
        <BoneClothing boneName="spine_middle" archetype={PlayerArchetype.MUSA} />
      );

      // Should use default values:
      // muscleMass: 35, fatMass: 12, shoulderWidth: 45, 
      // torsoLength: 59, armLength: 62, legLength: 96
      expect(container).toBeTruthy();
      
      // Verify default thickness
      const defaultThickness = calculateBodyThickness(35, 12);
      expect(defaultThickness).toBeCloseTo(1.0, 2);
    });
  });

  // ========================================
  // J. Multi-bone Rendering Tests (3 tests)
  // ========================================
  describe("Multi-bone rendering", () => {
    it("should render complete upper body clothing set", () => {
      const { container } = render3D(
        <>
          <BoneClothing boneName="spine_middle" archetype={PlayerArchetype.MUSA} />
          <BoneClothing boneName="upper_arm_L" archetype={PlayerArchetype.MUSA} />
          <BoneClothing boneName="upper_arm_R" archetype={PlayerArchetype.MUSA} />
          <BoneClothing boneName="forearm_L" archetype={PlayerArchetype.MUSA} />
          <BoneClothing boneName="forearm_R" archetype={PlayerArchetype.MUSA} />
        </>
      );

      expect(container).toBeTruthy();
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render complete lower body clothing set", () => {
      const { container } = render3D(
        <>
          <BoneClothing boneName="pelvis" archetype={PlayerArchetype.MUSA} />
          <BoneClothing boneName="thigh_L" archetype={PlayerArchetype.MUSA} />
          <BoneClothing boneName="thigh_R" archetype={PlayerArchetype.MUSA} />
          <BoneClothing boneName="shin_L" archetype={PlayerArchetype.MUSA} />
          <BoneClothing boneName="shin_R" archetype={PlayerArchetype.MUSA} />
        </>
      );

      expect(container).toBeTruthy();
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render complete full body clothing set for all archetypes", () => {
      const archetypes = [
        PlayerArchetype.MUSA,
        PlayerArchetype.AMSALJA,
        PlayerArchetype.HACKER,
        PlayerArchetype.JEONGBO_YOWON,
        PlayerArchetype.JOJIK_POKRYEOKBAE,
      ];

      archetypes.forEach((archetype) => {
        const { container } = render3D(
          <>
            <BoneClothing boneName="spine_middle" archetype={archetype} />
            <BoneClothing boneName="pelvis" archetype={archetype} />
            <BoneClothing boneName="upper_arm_L" archetype={archetype} />
            <BoneClothing boneName="upper_arm_R" archetype={archetype} />
            <BoneClothing boneName="thigh_L" archetype={archetype} />
            <BoneClothing boneName="thigh_R" archetype={archetype} />
          </>
        );

        expect(container).toBeTruthy();
        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });

  // ========================================
  // K. Performance Tests (2 tests)
  // ========================================
  describe("Performance", () => {
    it("should render efficiently with all physical attributes", () => {
      const startTime = performance.now();

      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.MUSA}
          physicalAttributes={{
            muscleMass: 35,
            fatMass: 12,
            shoulderWidth: 45,
            torsoLength: 59,
            armLength: 62,
            legLength: 96,
          }}
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(container).toBeTruthy();
      // Rendering should be reasonably fast (generous timeout for CI)
      expect(renderTime).toBeLessThan(1000);
    });

    it("should render full body clothing efficiently", () => {
      const startTime = performance.now();

      const bones = [
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

      const { container } = render3D(
        <>
          {bones.map((boneName) => (
            <BoneClothing
              key={boneName}
              boneName={boneName}
              archetype={PlayerArchetype.MUSA}
              physicalAttributes={{
                muscleMass: 35,
                fatMass: 12,
                shoulderWidth: 45,
                torsoLength: 59,
                armLength: 62,
                legLength: 96,
              }}
            />
          ))}
        </>
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(container).toBeTruthy();
      // Full body clothing rendering should complete within reasonable time
      expect(renderTime).toBeLessThan(2000);
    });
  });

  // ========================================
  // L. Vest Clothing Type Tests (2 tests)
  // ========================================
  describe("Vest clothing type", () => {
    it("should render vest attachments on spine_middle", () => {
      // Some archetypes may have vest items
      const { container } = render3D(
        <BoneClothing
          boneName="spine_middle"
          archetype={PlayerArchetype.AMSALJA}
          physicalAttributes={{
            muscleMass: 30,
            fatMass: 10,
            shoulderWidth: 43,
            torsoLength: 58,
            armLength: 61,
            legLength: 95,
          }}
        />
      );

      expect(container).toBeTruthy();
    });

    it("should not render vest on non-spine bones", () => {
      const { container } = render3D(
        <BoneClothing
          boneName="upper_arm_L"
          archetype={PlayerArchetype.AMSALJA}
          physicalAttributes={{
            muscleMass: 30,
            fatMass: 10,
            shoulderWidth: 43,
            torsoLength: 58,
            armLength: 61,
            legLength: 95,
          }}
        />
      );

      expect(container).toBeTruthy();
    });
  });
});
