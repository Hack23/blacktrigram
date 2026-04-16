import { describe, expect, it } from "vitest";
import { getMobileControlsBottom } from "./layout";

describe("getMobileControlsBottom", () => {
  it("returns the default 200 px band when no viewport height is provided", () => {
    expect(getMobileControlsBottom()).toBe(200);
  });

  it.each([500, 667, 812, 1024, 1080, 1440])(
    "returns 200 px on viewport height %i (tablet, desktop, high-end portrait phone)",
    (height) => {
      expect(getMobileControlsBottom(height)).toBe(200);
    },
  );

  it.each([320, 375, 411, 499])(
    "returns a reduced 120 px band on short viewport height %i (landscape phone)",
    (height) => {
      expect(getMobileControlsBottom(height)).toBe(120);
    },
  );

  it("treats the 500 px boundary as the start of the 'tall' branch", () => {
    expect(getMobileControlsBottom(499)).toBe(120);
    expect(getMobileControlsBottom(500)).toBe(200);
  });

  it("treats non-positive inputs as 'short viewport' and returns the reduced band", () => {
    // `0`, negatives are all `< 500`, so they get the reduced 120 px band.
    // This matches the intent: any realistic viewport short-circuits to the
    // comfortable default only when it's actually tall enough.
    expect(getMobileControlsBottom(0)).toBe(120);
    expect(getMobileControlsBottom(-10)).toBe(120);
  });

  it("treats NaN as a 'tall' viewport and returns the default 200 px band", () => {
    // `NaN < 500` is `false`, so `NaN` falls through to the default branch.
    // Documented here so callers know degenerate/unknown inputs stay safe.
    expect(getMobileControlsBottom(NaN)).toBe(200);
  });
});
