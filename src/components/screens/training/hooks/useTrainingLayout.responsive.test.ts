import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as deviceDetection from "../../../../utils/deviceDetection";
import { useTrainingLayout } from "./useTrainingLayout";

describe("useTrainingLayout responsive viewport matrix", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("desktop 1280×800 frames a large dojang between HUD bars", () => {
    vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(false);

    const { result } = renderHook(() => useTrainingLayout(1280, 800));
    const { trainingAreaBounds, isMobile } = result.current;

    expect(isMobile).toBe(false);
    expect(trainingAreaBounds.y).toBeLessThanOrEqual(80);
    expect(trainingAreaBounds.width).toBeGreaterThan(740);
    expect(trainingAreaBounds.height).toBeGreaterThan(550);
    expect(trainingAreaBounds.x + trainingAreaBounds.width).toBeLessThanOrEqual(
      1280,
    );
    expect(
      trainingAreaBounds.y + trainingAreaBounds.height,
    ).toBeLessThanOrEqual(800);
  });

  it("mobile portrait keeps the dojang above touch controls", () => {
    vi.spyOn(deviceDetection, "shouldUseMobileControls").mockReturnValue(true);

    const { result } = renderHook(() => useTrainingLayout(390, 844));
    const { trainingAreaBounds, isMobile, isPortrait } = result.current;

    expect(isMobile).toBe(true);
    expect(isPortrait).toBe(true);
    expect(trainingAreaBounds.x).toBeGreaterThanOrEqual(0);
    expect(trainingAreaBounds.y).toBeGreaterThanOrEqual(0);
    expect(trainingAreaBounds.x + trainingAreaBounds.width).toBeLessThanOrEqual(
      390,
    );
    expect(
      trainingAreaBounds.y + trainingAreaBounds.height,
    ).toBeLessThanOrEqual(844);
  });
});
