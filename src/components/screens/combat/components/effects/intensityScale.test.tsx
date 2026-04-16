import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PainVignette } from "./PainVignette";
import { ConsciousnessBlur } from "./ConsciousnessBlur";
import { BloodLossOverlayHtml } from "./BloodLossOverlayHtml";

/**
 * Tests for the `intensityScale` prop added to fullscreen player-state
 * effects. The prop is designed to attenuate the effects' visual weight
 * when the 3D arena is already visually compressed (e.g. portrait mobile).
 */
describe("Fullscreen effect intensityScale attenuation", () => {
  describe("PainVignette", () => {
    it("renders with full-strength shadow at intensityScale=1 (default)", () => {
      const { getByTestId, rerender } = render(
        <PainVignette pain={80} isMobile={false} />,
      );
      const fullScale = getByTestId("pain-vignette") as HTMLDivElement;
      const fullShadow = fullScale.style.boxShadow;

      rerender(
        <PainVignette pain={80} isMobile={false} intensityScale={1} />,
      );
      expect(
        (getByTestId("pain-vignette") as HTMLDivElement).style.boxShadow,
      ).toBe(fullShadow);
    });

    it("attenuates shadow opacity when intensityScale=0.5", () => {
      const { getByTestId, rerender } = render(
        <PainVignette pain={80} isMobile={false} intensityScale={1} />,
      );
      const fullShadow = (
        getByTestId("pain-vignette") as HTMLDivElement
      ).style.boxShadow;

      rerender(
        <PainVignette pain={80} isMobile={false} intensityScale={0.5} />,
      );
      const halfShadow = (
        getByTestId("pain-vignette") as HTMLDivElement
      ).style.boxShadow;

      // Both should be non-empty strings, but the attenuated one should
      // encode a smaller alpha in its rgba(...) component.
      expect(fullShadow).not.toEqual("");
      expect(halfShadow).not.toEqual("");
      expect(halfShadow).not.toEqual(fullShadow);

      const fullAlpha = Number(fullShadow.match(/rgba\([^)]*,\s*([\d.]+)\)/)?.[1] ?? "0");
      const halfAlpha = Number(halfShadow.match(/rgba\([^)]*,\s*([\d.]+)\)/)?.[1] ?? "0");
      expect(halfAlpha).toBeLessThan(fullAlpha);
      // ~50 % attenuation, allowing small FP error.
      expect(halfAlpha).toBeCloseTo(fullAlpha / 2, 3);
    });

    it("does not render when intensityScale=0 and pain is low enough to hide the vignette anyway", () => {
      const { queryByTestId } = render(
        <PainVignette pain={4} isMobile={false} intensityScale={0} />,
      );
      expect(queryByTestId("pain-vignette")).not.toBeInTheDocument();
    });
  });

  describe("ConsciousnessBlur", () => {
    it("produces a smaller blur radius when intensityScale=0.5", () => {
      const { getByTestId, rerender } = render(
        <ConsciousnessBlur
          consciousness={20}
          isMobile={false}
          intensityScale={1}
        />,
      );
      const full = getByTestId("consciousness-blur") as HTMLDivElement;
      const fullBlur = full.style.backdropFilter;

      rerender(
        <ConsciousnessBlur
          consciousness={20}
          isMobile={false}
          intensityScale={0.5}
        />,
      );
      const half = getByTestId("consciousness-blur") as HTMLDivElement;
      const halfBlur = half.style.backdropFilter;

      const fullPx = Number(fullBlur.match(/blur\((\d+(?:\.\d+)?)px\)/)?.[1] ?? "0");
      const halfPx = Number(halfBlur.match(/blur\((\d+(?:\.\d+)?)px\)/)?.[1] ?? "0");

      expect(halfPx).toBeLessThan(fullPx);
    });
  });

  describe("BloodLossOverlayHtml", () => {
    it("reduces the pulse base opacity when intensityScale=0.5", () => {
      // Use a bloodLoss value above the 50 threshold so the overlay renders.
      const { container, rerender } = render(
        <BloodLossOverlayHtml
          bloodLoss={90}
          isMobile={false}
          intensityScale={1}
        />,
      );
      const fullNode = container.querySelector(
        '[data-testid="bloodloss-overlay"]',
      ) as HTMLDivElement | null;
      const fullOpacity = Number(
        fullNode?.style.getPropertyValue("--base-opacity") ?? "NaN",
      );

      rerender(
        <BloodLossOverlayHtml
          bloodLoss={90}
          isMobile={false}
          intensityScale={0.5}
        />,
      );
      const halfNode = container.querySelector(
        '[data-testid="bloodloss-overlay"]',
      ) as HTMLDivElement | null;
      const halfOpacity = Number(
        halfNode?.style.getPropertyValue("--base-opacity") ?? "NaN",
      );

      expect(fullOpacity).toBeGreaterThan(0);
      expect(halfOpacity).toBeGreaterThan(0);
      expect(halfOpacity).toBeLessThan(fullOpacity);
      expect(halfOpacity).toBeCloseTo(fullOpacity / 2, 3);
    });
  });
});
