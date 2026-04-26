import { describe, expect, it } from "vitest";
import { getMobileControlsBottom } from "./layout";

describe("getMobileControlsBottom", () => {
  it("returns the default 200 px band when no viewport height is provided", () => {
    expect(getMobileControlsBottom()).toBe(200);
  });

  it.each([
    [500, 128],
    [667, 128],
    [812, 138],
    [1024, 174],
    [1080, 184],
    [1440, 200],
  ])(
    "returns responsive tall-viewport band for height %i",
    (height, expected) => {
      expect(getMobileControlsBottom(height)).toBe(expected);
    },
  );

  it.each([
    [320, 96],
    [375, 96],
    [411, 99],
    [499, 120],
  ])(
    "returns a compact landscape band on short viewport height %i",
    (height, expected) => {
      expect(getMobileControlsBottom(height)).toBe(expected);
    },
  );

  it("treats the 500 px boundary as the start of the 'tall' branch", () => {
    expect(getMobileControlsBottom(499)).toBe(120);
    expect(getMobileControlsBottom(500)).toBe(128);
  });

  it("treats non-positive inputs as 'short viewport' and returns the minimum band", () => {
    // `0`, negatives are all `< 500`, so they get the 96 px minimum band.
    // This matches the intent: any realistic viewport short-circuits to the
    // comfortable default only when it's actually tall enough.
    expect(getMobileControlsBottom(0)).toBe(96);
    expect(getMobileControlsBottom(-10)).toBe(96);
  });

  it("treats NaN as a 'tall' viewport and returns the default 200 px band", () => {
    // `NaN < 500` is `false`, so `NaN` falls through to the default branch.
    // Documented here so callers know degenerate/unknown inputs stay safe.
    expect(getMobileControlsBottom(NaN)).toBe(200);
  });
});
