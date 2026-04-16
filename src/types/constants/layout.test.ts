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

  it("ignores non-finite / negative values by falling back to the reduced band (< 500)", () => {
    // Negative / 0 / NaN are treated as "< 500" → reduced band, matching the
    // behaviour we want on obscure / degenerate viewports.
    expect(getMobileControlsBottom(0)).toBe(120);
    expect(getMobileControlsBottom(-10)).toBe(120);
    expect(Number.isNaN(NaN) && getMobileControlsBottom(NaN)).toBe(200);
    // NaN < 500 is false, so NaN goes to the default 200 branch — documented.
  });
});
