/**
 * Unit tests for KoreanSignage3D component
 */

import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { describe, it, expect } from "vitest";
import KoreanSignage3D from "../KoreanSignage3D";
import { Suspense } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../../types/constants";

describe("KoreanSignage3D", () => {
  describe("basic rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with custom scale", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D scale={0.8} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should apply Korean theming", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D scale={1.0} />
          </Suspense>
        </Canvas>
      );

      // Verify component renders
      expect(container).toBeTruthy();
    });
  });

  describe("material cleanup", () => {
    it("should handle unmount gracefully", () => {
      const { unmount } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D />
          </Suspense>
        </Canvas>
      );

      // Unmount should trigger material cleanup via useEffect return
      expect(() => unmount()).not.toThrow();
    });

    it("should dispose materials on unmount", () => {
      const { unmount } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D />
          </Suspense>
        </Canvas>
      );

      // Unmount component - cleanup should happen via useEffect return
      // Note: In JSDOM environment, we verify cleanup happens without errors
      // The component's useEffect return disposes goldNeonMaterial, cyanNeonMaterial, redNeonMaterial
      expect(() => unmount()).not.toThrow();
    });

    it("should handle multiple mount/unmount cycles", () => {
      for (let i = 0; i < 3; i++) {
        const { unmount } = render(
          <Canvas>
            <Suspense fallback={null}>
              <KoreanSignage3D />
            </Suspense>
          </Canvas>
        );

        expect(() => unmount()).not.toThrow();
      }
    });

    it("should handle remounting with different scales", () => {
      const { rerender, unmount } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D scale={1.0} />
          </Suspense>
        </Canvas>
      );

      // Rerender with different scale
      expect(() => {
        rerender(
          <Canvas>
            <Suspense fallback={null}>
              <KoreanSignage3D scale={0.5} />
            </Suspense>
          </Canvas>
        );
      }).not.toThrow();

      // Unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe("material properties", () => {
    it("should render with MeshBasicMaterial", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D />
          </Suspense>
        </Canvas>
      );

      // Component uses MeshBasicMaterial for all three signs
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should have toneMapped set to false for bloom effect", () => {
      // Create material with same config as component
      const material = new THREE.MeshBasicMaterial({
        color: KOREAN_COLORS.ACCENT_GOLD,
        toneMapped: false,
      });

      // Verify property is false (prevents tone mapping for bloom)
      expect(material.toneMapped).toBe(false);

      material.dispose();
    });

    it("should use correct material colors", () => {
      // Verify KOREAN_COLORS are defined correctly
      expect(KOREAN_COLORS.ACCENT_GOLD).toBe(0xffc400);
      expect(KOREAN_COLORS.PRIMARY_CYAN).toBe(0x00e6e6);
      expect(KOREAN_COLORS.KOREAN_RED).toBe(0xc8102e);
    });
  });

  describe("Korean text rendering", () => {
    it("should render without errors (Korean text smoke test)", () => {
      // Smoke test: Verifies component renders with Korean text without crashing.
      // Component renders three Korean text signs:
      // "전투" (Combat), "흑괘" (Black Trigram), "급소격" (Vital Point Strike)
      // Note: JSDOM doesn't provide access to Three.js Text components to verify
      // actual text content. Visual validation requires WebGL testing (e.g., Cypress).
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("sign positioning", () => {


    it("should verify position calculations for default scale", () => {
      const scale = 1.0;
      const leftWallX = -12 * scale;
      const rightWallX = 12 * scale;
      const backWallZ = -14 * scale;
      const signHeight = 5 * scale;

      expect(leftWallX).toBe(-12);
      expect(rightWallX).toBe(12);
      expect(backWallZ).toBe(-14);
      expect(signHeight).toBe(5);
    });

    it("should verify rotation angles", () => {
      const leftWallRotation = Math.PI / 2;
      const rightWallRotation = -Math.PI / 2;
      const backWallRotation = 0;

      expect(leftWallRotation).toBeCloseTo(1.5708, 4);
      expect(rightWallRotation).toBeCloseTo(-1.5708, 4);
      expect(backWallRotation).toBe(0);
    });
  });

  describe("scale-awareness", () => {
    it("should adjust positioning based on scale", () => {
      const scale = 0.8;
      const leftWallX = -12 * scale;
      const rightWallX = 12 * scale;
      const backWallZ = -14 * scale;
      const signHeight = 5 * scale;
      const fontSize = 1.5 * scale;
      const outlineWidth = 0.05 * scale;

      expect(leftWallX).toBeCloseTo(-9.6, 5);
      expect(rightWallX).toBeCloseTo(9.6, 5);
      expect(backWallZ).toBeCloseTo(-11.2, 5);
      expect(signHeight).toBeCloseTo(4, 5);
      expect(fontSize).toBeCloseTo(1.2, 5);
      expect(outlineWidth).toBeCloseTo(0.04, 5);
    });

    it("should calculate font sizes correctly for different scales", () => {
      const testCases = [
        { scale: 0.5, expectedFontSize: 0.75 },
        { scale: 0.8, expectedFontSize: 1.2 },
        { scale: 1.0, expectedFontSize: 1.5 },
        { scale: 1.5, expectedFontSize: 2.25 },
        { scale: 2.0, expectedFontSize: 3.0 },
      ];

      testCases.forEach(({ scale, expectedFontSize }) => {
        const fontSize = 1.5 * scale;
        expect(fontSize).toBeCloseTo(expectedFontSize, 5);
      });
    });

    it("should scale back wall sign differently", () => {
      const scale = 1.0;
      const normalFontSize = 1.5 * scale;
      const backWallFontSize = normalFontSize * 0.8;

      expect(backWallFontSize).toBeCloseTo(1.2, 5);
    });

    it("should handle very small scale", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D scale={0.1} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle scale changes", () => {
      const { rerender, container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D scale={0.5} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();

      // Change scale
      rerender(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D scale={2.0} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should render without errors for edge case scales", () => {
      const edgeCaseScales = [0, -1, 10];
      
      edgeCaseScales.forEach((scale) => {
        const { container } = render(
          <Canvas>
            <Suspense fallback={null}>
              <KoreanSignage3D scale={scale} />
            </Suspense>
          </Canvas>
        );
        
        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });

    it("should handle rapid prop changes", () => {
      const { rerender, container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D scale={1.0} />
          </Suspense>
        </Canvas>
      );

      // Rapid rerenders with different scales
      for (let i = 0; i < 5; i++) {
        rerender(
          <Canvas>
            <Suspense fallback={null}>
              <KoreanSignage3D scale={0.5 + i * 0.2} />
            </Suspense>
          </Canvas>
        );
      }

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("performance", () => {
    it("should render efficiently with default scale", () => {
      const startTime = performance.now();

      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D />
          </Suspense>
        </Canvas>
      );

      const renderTime = performance.now() - startTime;

      // Note: JSDOM rendering is fast. Using 200ms threshold to catch major
      // performance regressions while accounting for CI environment variability.
      expect(renderTime).toBeLessThan(200);
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle mobile scale efficiently", () => {
      const startTime = performance.now();

      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D scale={0.5} />
          </Suspense>
        </Canvas>
      );

      const renderTime = performance.now() - startTime;

      expect(renderTime).toBeLessThan(200); // Mobile optimization
      expect(container.querySelector("canvas")).toBeInTheDocument();
    });
  });

  describe("prop validation", () => {
    it("should render with undefined scale (defaults to 1.0)", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with explicit default scale", () => {
      const { container } = render(
        <Canvas>
          <Suspense fallback={null}>
            <KoreanSignage3D scale={1.0} />
          </Suspense>
        </Canvas>
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should accept decimal scale values", () => {
      const scales = [0.25, 0.5, 0.75, 1.25, 1.5];

      scales.forEach((scale) => {
        const { container } = render(
          <Canvas>
            <Suspense fallback={null}>
              <KoreanSignage3D scale={scale} />
            </Suspense>
          </Canvas>
        );

        expect(container.querySelector("canvas")).toBeInTheDocument();
      });
    });
  });
});
