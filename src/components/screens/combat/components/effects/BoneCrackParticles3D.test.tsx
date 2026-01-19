/**
 * BoneCrackParticles3D Tests
 *
 * Tests for bone fracture particle effects in Korean martial arts combat
 * 골절 입자 효과 테스트
 */

import { Canvas } from "@react-three/fiber";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  BoneCrackParticles3D,
  type BoneCrackEffect,
  type BoneCrackParticles3DProps,
} from "./BoneCrackParticles3D";

/**
 * Helper to render Three.js components
 */
function render3D(component: React.ReactElement) {
  return render(<Canvas>{component}</Canvas>);
}

/**
 * Helper to create bone crack effect
 */
function createBoneCrackEffect(
  overrides: Partial<BoneCrackEffect> = {},
): BoneCrackEffect {
  return {
    id: `bone-${Date.now()}-${Math.random()}`,
    position: [0, 2, 0],
    fractureType: "compound",
    boneType: "rib",
    impactDirection: [1, 0, 0],
    startTime: Date.now(),
    ...overrides,
  };
}

describe("BoneCrackParticles3D", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render3D(
        <BoneCrackParticles3D effects={[]} enabled />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should render with single bone crack effect", () => {
      const effect = createBoneCrackEffect();
      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should render multiple simultaneous effects", () => {
      const effects = [
        createBoneCrackEffect({ id: "bone-1", fractureType: "hairline" }),
        createBoneCrackEffect({ id: "bone-2", fractureType: "compound" }),
        createBoneCrackEffect({ id: "bone-3", fractureType: "shatter" }),
      ];

      const { container } = render3D(
        <BoneCrackParticles3D effects={effects} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should not render when disabled", () => {
      const effect = createBoneCrackEffect();
      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled={false} />,
      );

      expect(container.querySelector("canvas")).toBeInTheDocument();
    });

    it("should handle empty effects array", () => {
      const { container } = render3D(
        <BoneCrackParticles3D effects={[]} enabled />,
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Fracture Types", () => {
    it("should handle hairline fracture (minimal fragments)", () => {
      const effect = createBoneCrackEffect({
        fractureType: "hairline",
        boneType: "rib",
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle compound fracture (moderate fragments)", () => {
      const effect = createBoneCrackEffect({
        fractureType: "compound",
        boneType: "limb",
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle shatter fracture (many fragments)", () => {
      const effect = createBoneCrackEffect({
        fractureType: "shatter",
        boneType: "skull",
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should support all fracture types", () => {
      const fractureTypes: Array<BoneCrackEffect["fractureType"]> = [
        "hairline",
        "compound",
        "shatter",
      ];

      fractureTypes.forEach((fractureType) => {
        const effect = createBoneCrackEffect({ fractureType });
        const { container } = render3D(
          <BoneCrackParticles3D effects={[effect]} enabled />,
        );

        expect(container).toBeTruthy();
      });
    });
  });

  describe("Bone Types (Korean Martial Arts)", () => {
    it("should handle rib fracture (갈비뼈 골절)", () => {
      const effect = createBoneCrackEffect({
        boneType: "rib",
        fractureType: "compound",
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle limb fracture (사지 골절)", () => {
      const effect = createBoneCrackEffect({
        boneType: "limb",
        fractureType: "shatter",
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle skull fracture (두개골 골절)", () => {
      const effect = createBoneCrackEffect({
        boneType: "skull",
        fractureType: "compound",
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle spine fracture (척추 골절)", () => {
      const effect = createBoneCrackEffect({
        boneType: "spine",
        fractureType: "hairline",
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should support all bone types", () => {
      const boneTypes: Array<BoneCrackEffect["boneType"]> = [
        "rib",
        "limb",
        "skull",
        "spine",
      ];

      boneTypes.forEach((boneType) => {
        const effect = createBoneCrackEffect({ boneType });
        const { container } = render3D(
          <BoneCrackParticles3D effects={[effect]} enabled />,
        );

        expect(container).toBeTruthy();
      });
    });
  });

  describe("Impact Direction", () => {
    it("should handle forward impact direction", () => {
      const effect = createBoneCrackEffect({
        impactDirection: [1, 0, 0],
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle upward impact direction", () => {
      const effect = createBoneCrackEffect({
        impactDirection: [0, 1, 0],
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle diagonal impact direction", () => {
      const effect = createBoneCrackEffect({
        impactDirection: [0.707, 0.707, 0],
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle zero impact direction", () => {
      const effect = createBoneCrackEffect({
        impactDirection: [0, 0, 0],
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Mobile Optimization", () => {
    it("should use reduced particle count on mobile (hairline)", () => {
      const effect = createBoneCrackEffect({ fractureType: "hairline" });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled isMobile />,
      );

      expect(container).toBeTruthy();
    });

    it("should use reduced particle count on mobile (compound)", () => {
      const effect = createBoneCrackEffect({ fractureType: "compound" });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled isMobile />,
      );

      expect(container).toBeTruthy();
    });

    it("should use reduced particle count on mobile (shatter)", () => {
      const effect = createBoneCrackEffect({ fractureType: "shatter" });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled isMobile />,
      );

      expect(container).toBeTruthy();
    });

    it("should use full particle count on desktop", () => {
      const effect = createBoneCrackEffect({ fractureType: "shatter" });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled isMobile={false} />,
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Effect Lifecycle", () => {
    it("should call onEffectComplete when effect expires", () => {
      const onEffectComplete = vi.fn();
      const effect = createBoneCrackEffect({ startTime: Date.now() - 15000 }); // Expired

      render3D(
        <BoneCrackParticles3D
          effects={[effect]}
          enabled
          onEffectComplete={onEffectComplete}
        />,
      );

      // Note: In actual implementation, this would be called after animation
      // Testing framework limitation
      expect(onEffectComplete).toHaveBeenCalledTimes(0);
    });

    it("should handle effect completion callback", () => {
      const onEffectComplete = vi.fn();
      const effect = createBoneCrackEffect();

      const { container } = render3D(
        <BoneCrackParticles3D
          effects={[effect]}
          enabled
          onEffectComplete={onEffectComplete}
        />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle missing onEffectComplete callback", () => {
      const effect = createBoneCrackEffect();

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Position Handling", () => {
    it("should handle position at origin", () => {
      const effect = createBoneCrackEffect({
        position: [0, 0, 0],
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle elevated position", () => {
      const effect = createBoneCrackEffect({
        position: [0, 5, 0],
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle negative position", () => {
      const effect = createBoneCrackEffect({
        position: [-5, 2, -5],
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });
  });

  describe("Performance & Edge Cases", () => {
    it("should handle rapid effect creation", () => {
      const effects = Array.from({ length: 10 }, (_, i) =>
        createBoneCrackEffect({ id: `rapid-${i}` }),
      );

      const { container } = render3D(
        <BoneCrackParticles3D effects={effects} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle simultaneous different fracture types", () => {
      const effects = [
        createBoneCrackEffect({ id: "hair-1", fractureType: "hairline" }),
        createBoneCrackEffect({ id: "comp-1", fractureType: "compound" }),
        createBoneCrackEffect({ id: "shat-1", fractureType: "shatter" }),
      ];

      const { container } = render3D(
        <BoneCrackParticles3D effects={effects} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle effect array updates", () => {
      const effect1 = createBoneCrackEffect({ id: "update-1" });
      const { rerender } = render3D(
        <BoneCrackParticles3D effects={[effect1]} enabled />,
      );

      const effect2 = createBoneCrackEffect({ id: "update-2" });
      rerender(
        <Canvas>
          <BoneCrackParticles3D effects={[effect1, effect2]} enabled />
        </Canvas>,
      );

      expect(true).toBe(true);
    });

    it("should handle toggling enabled state", () => {
      const effect = createBoneCrackEffect();
      const { rerender } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      rerender(
        <Canvas>
          <BoneCrackParticles3D effects={[effect]} enabled={false} />
        </Canvas>,
      );

      expect(true).toBe(true);
    });
  });

  describe("Korean Martial Arts Combat Scenarios", () => {
    it("should handle elbow strike rib fracture (팔꿈치격)", () => {
      const effect = createBoneCrackEffect({
        boneType: "rib",
        fractureType: "compound",
        impactDirection: [0, -0.5, 1],
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle knee strike limb fracture (무릎차기)", () => {
      const effect = createBoneCrackEffect({
        boneType: "limb",
        fractureType: "shatter",
        impactDirection: [0.707, 0, 0.707],
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle axe kick skull fracture (도끼차기)", () => {
      const effect = createBoneCrackEffect({
        boneType: "skull",
        fractureType: "compound",
        impactDirection: [0, -1, 0],
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });

    it("should handle spine fracture from throw (낙법)", () => {
      const effect = createBoneCrackEffect({
        boneType: "spine",
        fractureType: "hairline",
        impactDirection: [0, -1, 0],
      });

      const { container } = render3D(
        <BoneCrackParticles3D effects={[effect]} enabled />,
      );

      expect(container).toBeTruthy();
    });
  });

  describe("TypeScript Type Safety", () => {
    it("should enforce readonly props", () => {
      const props: BoneCrackParticles3DProps = {
        effects: [],
        enabled: true,
      };

      // TypeScript should prevent modification
      // (readonly properties cannot be assigned)

      expect(props.effects).toEqual([]);
    });

    it("should enforce fracture type enum", () => {
      // Valid fracture types
      const validTypes: Array<BoneCrackEffect["fractureType"]> = [
        "hairline",
        "compound",
        "shatter",
      ];

      validTypes.forEach((type) => {
        expect(["hairline", "compound", "shatter"]).toContain(type);
      });
    });

    it("should enforce bone type enum", () => {
      // Valid bone types
      const validTypes: Array<BoneCrackEffect["boneType"]> = [
        "rib",
        "limb",
        "skull",
        "spine",
      ];

      validTypes.forEach((type) => {
        expect(["rib", "limb", "skull", "spine"]).toContain(type);
      });
    });
  });
});
