/**
 * Regression tests for the portrait-mobile arena visibility bug.
 *
 * The pre-fix layout would render the Combat arena behind the bottom HUD
 * (technique bar) and the on-screen D-Pad on portrait phones, and would
 * force a 4:3 (width > height) aspect ratio even when the viewport was
 * taller than it was wide. The arena then either overflowed the viewport
 * or became so small that it was essentially hidden by side HUDs.
 *
 * These tests cover a matrix of real-device viewports and enforce:
 *  - arena stays fully inside the viewport on both axes,
 *  - arena has a meaningful renderable area (> 10 000 px²),
 *  - arena's aspect ratio follows the device orientation (3:4 portrait,
 *    4:3 landscape) so both fighters are framed correctly.
 *
 * 세로 모드 가시성 회귀 테스트
 */

import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  landscapeMobileControlsBottomClearance,
  portraitMobileControlsBottomBand,
} from "../../../../utils/responsiveOrientationConstants";
import { getCombatLayoutConstants } from "../../../../utils/responsiveLayoutHelpers";
import * as deviceDetection from "../../../../utils/deviceDetection";
import { useCombatLayout } from "./useCombatLayout";

interface Viewport {
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly expectPortrait: boolean;
}

const PHONE_VIEWPORTS: readonly Viewport[] = [
  // Portrait
  { name: "iPhone SE 320×568", width: 320, height: 568, expectPortrait: true },
  { name: "iPhone 8 375×667", width: 375, height: 667, expectPortrait: true },
  {
    name: "iPhone 12 Pro 390×844",
    width: 390,
    height: 844,
    expectPortrait: true,
  },
  { name: "iPhone XR 414×896", width: 414, height: 896, expectPortrait: true },
  {
    name: "iPhone 14 Pro Max 430×932",
    width: 430,
    height: 932,
    expectPortrait: true,
  },
  {
    name: "iPad portrait 768×1024",
    width: 768,
    height: 1024,
    expectPortrait: true,
  },
  // Landscape
  {
    name: "iPhone 8 landscape 667×375",
    width: 667,
    height: 375,
    expectPortrait: false,
  },
  {
    name: "iPhone XR landscape 896×414",
    width: 896,
    height: 414,
    expectPortrait: false,
  },
  {
    name: "iPad landscape 1024×768",
    width: 1024,
    height: 768,
    expectPortrait: false,
  },
  {
    name: "Desktop 1920×1080",
    width: 1920,
    height: 1080,
    expectPortrait: false,
  },
];

describe("useCombatLayout responsive viewport matrix", () => {
  beforeEach(() => {
    // Mock as mobile device; the portrait-force rule still fires on narrow
    // portrait viewports regardless.
    vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  for (const vp of PHONE_VIEWPORTS) {
    it(`${vp.name} keeps the arena inside the viewport`, () => {
      const { result } = renderHook(() => useCombatLayout(vp.width, vp.height));
      const { arenaBounds, isPortrait } = result.current;

      expect(isPortrait).toBe(vp.expectPortrait);

      // Arena is fully on-screen on both axes.
      expect(arenaBounds.x).toBeGreaterThanOrEqual(0);
      expect(arenaBounds.y).toBeGreaterThanOrEqual(0);
      expect(arenaBounds.x + arenaBounds.width).toBeLessThanOrEqual(vp.width);
      expect(arenaBounds.y + arenaBounds.height).toBeLessThanOrEqual(vp.height);

      // Mobile arenas must also stay above the reserved touch-control band,
      // not merely inside the viewport. This prevents the "white arena/icons
      // only" mobile failure mode where the playable floor is hidden behind
      // the technique bar and D-Pad.
      if (vp.width < 1024) {
        const layout = getCombatLayoutConstants(vp.width, true);
        const isExtraSmall = vp.width < 380;
        const bottomClearance = vp.expectPortrait
          ? portraitMobileControlsBottomBand(
              layout.controlsHeight,
              layout.footerHeight,
              isExtraSmall,
              "combat",
            )
          : landscapeMobileControlsBottomClearance(isExtraSmall, "combat");
        expect(arenaBounds.y + arenaBounds.height).toBeLessThanOrEqual(
          vp.height - bottomClearance,
        );
      }

      // Arena is actually visible (not a zero-area degenerate rectangle).
      // Minimum area scales with viewport: the iPhone SE 320×568 is
      // deliberately on the edge of our support matrix (the "high-end
      // mobile" requirement targets ≥ 380 px wide), so we accept a
      // smaller but still visible arena on extra-small phones and a
      // more generous floor on everything else.
      expect(arenaBounds.width).toBeGreaterThan(0);
      expect(arenaBounds.height).toBeGreaterThan(0);
      const minArenaArea = vp.width < 380 ? 5_000 : 10_000;
      expect(arenaBounds.width * arenaBounds.height).toBeGreaterThan(
        minArenaArea,
      );

      // Arena's aspect ratio follows orientation.
      const aspectRatio = arenaBounds.width / arenaBounds.height;
      if (vp.expectPortrait) {
        // 3:4 portrait (taller than wide)
        expect(aspectRatio).toBeLessThan(1);
      } else {
        // 4:3 landscape (wider than tall)
        expect(aspectRatio).toBeGreaterThan(1);
      }
    });
  }

  it("desktop 1920×1080 is not promoted to portrait mobile", () => {
    vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(false);
    const { result } = renderHook(() => useCombatLayout(1920, 1080));
    expect(result.current.isMobile).toBe(false);
    expect(result.current.isPortrait).toBe(false);
  });
});
