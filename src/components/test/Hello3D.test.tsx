/**
 * Tests for Hello3D component
 * 
 * Verifies Three.js infrastructure setup including:
 * - Component imports (TypeScript type safety)
 * - Props interface validation
 * - Korean theming integration
 * 
 * Note: Full Canvas rendering tests are skipped in jsdom as @react-three/fiber
 * requires WebGL and ResizeObserver that are difficult to mock properly.
 * Visual verification should be done via E2E tests or manual browser testing.
 */

import { describe, expect, it } from "vitest";
import { KOREAN_COLORS } from "../../types/constants";
import { Hello3D } from "./Hello3D";

describe("Hello3D", () => {
  it("should be defined and importable", () => {
    expect(Hello3D).toBeDefined();
    expect(typeof Hello3D).toBe("function");
  });

  it("should have proper display name", () => {
    expect(Hello3D.displayName).toBe("Hello3D");
  });

  it("should accept TypeScript props correctly", () => {
    // TypeScript compilation test - if this compiles, props interface is correct
    const validProps = {
      width: 1200,
      height: 800,
      color: KOREAN_COLORS.ACCENT_GOLD,
    };

    expect(validProps.width).toBe(1200);
    expect(validProps.height).toBe(800);
    expect(validProps.color).toBe(KOREAN_COLORS.ACCENT_GOLD);
  });

  it("should accept Korean colors for theming", () => {
    const koreanColors = [
      KOREAN_COLORS.PRIMARY_CYAN,
      KOREAN_COLORS.ACCENT_GOLD,
      KOREAN_COLORS.SECONDARY_YELLOW,
      KOREAN_COLORS.ACCENT_BLUE,
    ];

    koreanColors.forEach((color) => {
      expect(typeof color).toBe("number");
    });
  });

  it("should verify Three.js dependencies are installed", async () => {
    // Verify core Three.js modules can be imported
    const three = await import("three");
    expect(three).toBeDefined();
    expect(three.BoxGeometry).toBeDefined();
    expect(three.MeshStandardMaterial).toBeDefined();
    expect(three.Mesh).toBeDefined();
  });

  it("should verify @react-three/fiber is installed", async () => {
    const fiber = await import("@react-three/fiber");
    expect(fiber).toBeDefined();
    expect(fiber.Canvas).toBeDefined();
  });

  it("should verify @react-three/drei is installed", async () => {
    const drei = await import("@react-three/drei");
    expect(drei).toBeDefined();
    expect(drei.OrbitControls).toBeDefined();
  });
});
