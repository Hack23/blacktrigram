import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  COMBAT_BOTTOM_HUD_HEIGHT_PERCENT,
  COMBAT_TOP_HUD_HEIGHT_PERCENT,
  TRAINING_BOTTOM_HUD_HEIGHT_PERCENT,
  TRAINING_TOP_HUD_HEIGHT_PERCENT,
} from "../types/constants/layout";
import { getHUDHeight } from "../utils/responsiveLayout";
import { useHUDLayout } from "./useHUDLayout";

describe("useHUDLayout", () => {
  it("aligns combat side HUD offsets with combat top and bottom bars", () => {
    const width = 1280;
    const height = 800;
    const { result } = renderHook(() =>
      useHUDLayout(width, height, 1, "left", "combat"),
    );

    const topHudHeight = getHUDHeight(height, COMBAT_TOP_HUD_HEIGHT_PERCENT);
    const bottomHudHeight = getHUDHeight(
      height,
      COMBAT_BOTTOM_HUD_HEIGHT_PERCENT,
    );

    expect(result.current.topOffset).toBe(topHudHeight);
    expect(result.current.bottomOffset).toBe(bottomHudHeight);
    expect(result.current.availableHeight).toBe(
      height - topHudHeight - bottomHudHeight,
    );
  });

  it("aligns training side HUD offsets with training top and bottom bars", () => {
    const width = 1280;
    const height = 800;
    const { result } = renderHook(() =>
      useHUDLayout(width, height, 1, "right", "training"),
    );

    const topHudHeight = getHUDHeight(height, TRAINING_TOP_HUD_HEIGHT_PERCENT);
    const bottomHudHeight = getHUDHeight(
      height,
      TRAINING_BOTTOM_HUD_HEIGHT_PERCENT,
    );

    expect(result.current.topOffset).toBe(topHudHeight);
    expect(result.current.bottomOffset).toBe(bottomHudHeight);
    expect(result.current.availableHeight).toBe(
      height - topHudHeight - bottomHudHeight,
    );
  });
});
