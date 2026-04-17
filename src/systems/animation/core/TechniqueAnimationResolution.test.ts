/**
 * Tests for the technique → animation resolver.
 *
 * These tests protect against a past regression where every stance-specific
 * attack collapsed to the generic "jab" animation because only
 * `technique.name.english` was fed into `getAnimationForTechnique`, which
 * matched the broad `/strike/` / `/punch/` rules first.
 *
 * 기술-애니메이션 해결 테스트
 */

import { describe, expect, it } from "vitest";
import { TRIGRAM_TECHNIQUES } from "../../trigram/techniques";
import {
  ALL_ANIMATIONS,
  getAnimationForTechnique,
  resolveTechniqueAnimation,
} from "./AnimationRegistry";

describe("resolveTechniqueAnimation", () => {
  it("returns 'jab' for null/undefined input", () => {
    expect(resolveTechniqueAnimation(null)).toBe("jab");
    expect(resolveTechniqueAnimation(undefined)).toBe("jab");
  });

  it("prefers animationId over id and english name", () => {
    expect(
      resolveTechniqueAnimation({
        id: "something_else",
        animationId: "geon_heaven_strike",
        name: { english: "Thunder Strike" },
      }),
    ).toBe("geon_heaven_strike");
  });

  it("falls back to id when animationId is absent", () => {
    expect(
      resolveTechniqueAnimation({
        id: "li_temple_strike",
        name: { english: "Temple Strike" },
      }),
    ).toBe("li_temple_strike");
  });

  it("does NOT collapse stance-specific English names to the generic 'jab'", () => {
    // Regression guard: previously "Thunder Strike" matched /strike/ → "jab".
    // In the real code path the resolver receives the full technique object
    // (id/animationId + english name), so it gets the specific animation.
    const techniques = [
      { id: "geon_heaven_strike", name: { english: "Thunder Strike" } },
      { id: "geon_heavenly_fist", name: { english: "Heavenly Fist" } },
      { id: "jin_lightning_flash", name: { english: "Shocking Strike" } },
      { id: "li_nerve_strike", name: { english: "Nerve Strike" } },
    ];
    for (const tech of techniques) {
      const resolved = resolveTechniqueAnimation(tech);
      expect(resolved).not.toBe("jab");
      // And each must also be a registered animation key.
      expect(ALL_ANIMATIONS.has(resolved)).toBe(true);
    }
  });

  it("returns a key registered in ALL_ANIMATIONS for every trigram technique", () => {
    for (const techniques of Object.values(TRIGRAM_TECHNIQUES)) {
      for (const tech of techniques) {
        const anim = resolveTechniqueAnimation(tech);
        expect(ALL_ANIMATIONS.has(anim)).toBe(true);
      }
    }
  });

  it("produces distinct animation keys across distinct technique ids", () => {
    // If every technique maps to the same animation key we have the old bug
    // back. We don't require a strict 1-1 — sharing reasonable base animations
    // (e.g., multiple front kicks reusing "front_kick") is fine — but the set
    // of resolved animations should have more than one element per stance.
    for (const [stance, techniques] of Object.entries(TRIGRAM_TECHNIQUES)) {
      if (techniques.length < 2) continue;
      const resolved = new Set(
        techniques.map((t) => resolveTechniqueAnimation(t)),
      );
      expect(
        resolved.size,
        `Stance ${stance} collapses all techniques to a single animation`,
      ).toBeGreaterThan(1);
    }
  });
});

describe("getAnimationForTechnique (regex/normalized fallback)", () => {
  it("routes 'Heaven Strike' to the heaven_strike animation, not jab", () => {
    expect(getAnimationForTechnique("Heaven Strike")).toBe("heaven_strike");
  });

  it("routes 'Nerve Strike' to nerve_strike, not jab", () => {
    expect(getAnimationForTechnique("Nerve Strike")).toBe("nerve_strike");
  });

  it("routes 'Pressure Point Strike' to pressure_point_strike, not jab", () => {
    expect(getAnimationForTechnique("Pressure Point Strike")).toBe(
      "pressure_point_strike",
    );
  });

  it("normalizes spaced English names that exactly match an animation key", () => {
    // "front kick" → "front_kick" is a registered animation; must not fall
    // through to the regex alone.
    expect(ALL_ANIMATIONS.has("front_kick")).toBe(true);
    expect(getAnimationForTechnique("Front Kick")).toBe("front_kick");
  });

  it("still returns 'jab' only for truly generic unknown inputs", () => {
    expect(getAnimationForTechnique("")).toBe("jab");
    expect(getAnimationForTechnique("some_unknown_generic_attack")).toBe(
      "jab",
    );
  });
});
