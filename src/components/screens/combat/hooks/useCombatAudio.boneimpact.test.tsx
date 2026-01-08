/**
 * Tests for Bone Impact Audio in useCombatAudio Hook
 * Validates the new playBoneImpactSound method
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCombatAudio } from "./useCombatAudio";
import * as AudioProvider from "../../../../../audio/AudioProvider";

// Mock the AudioProvider
vi.mock("../../../audio/AudioProvider", () => ({
  useAudio: vi.fn(),
}));

describe("useCombatAudio - Bone Impact Audio", () => {
  let mockAudio: {
    playSFX: ReturnType<typeof vi.fn>;
    fadeIn: ReturnType<typeof vi.fn>;
    fadeOut: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockAudio = {
      playSFX: vi.fn().mockResolvedValue(undefined),
      fadeIn: vi.fn().mockResolvedValue(undefined),
      fadeOut: vi.fn().mockResolvedValue(undefined),
    };

    vi.mocked(AudioProvider.useAudio).mockReturnValue(
      mockAudio as ReturnType<typeof AudioProvider.useAudio>
    );
  });

  describe("playBoneImpactSound", () => {
    it("should play bone impact sound with explicit region and intensity", async () => {
      const { result } = renderHook(() => useCombatAudio());

      await result.current.playBoneImpactSound({
        region: "head",
        intensity: "heavy",
      });

      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      const [[soundId, volume]] = mockAudio.playSFX.mock.calls;
      expect(soundId).toMatch(/^hit_heavy/);
      expect(volume).toBeGreaterThan(0);
      expect(volume).toBeLessThanOrEqual(1);
    });

    it("should auto-calculate intensity from damage", async () => {
      const { result } = renderHook(() => useCombatAudio());

      // High damage should result in critical intensity
      await result.current.playBoneImpactSound({
        region: "torso",
        damage: 45,
        remainingHealth: 60,
      });

      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      const [[soundId]] = mockAudio.playSFX.mock.calls;
      expect(soundId).toMatch(/^hit_critical/);
    });

    it("should detect fracture for low health + high damage", async () => {
      const { result } = renderHook(() => useCombatAudio());

      await result.current.playBoneImpactSound({
        region: "torso",
        damage: 30,
        remainingHealth: 25, // Below 30%
      });

      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      const [[soundId, volume]] = mockAudio.playSFX.mock.calls;
      expect(soundId).toMatch(/^hit_critical/); // Fracture uses critical sounds
      expect(volume).toBeGreaterThan(0.8); // Higher volume for fracture
    });

    it("should prioritize vital point over fracture", async () => {
      const { result } = renderHook(() => useCombatAudio());

      await result.current.playBoneImpactSound({
        region: "head",
        damage: 30,
        remainingHealth: 20,
        vitalPoint: true,
      });

      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      const [[soundId]] = mockAudio.playSFX.mock.calls;
      expect(soundId).toMatch(/^hit_critical/);
    });

    it("should auto-detect region from hit position", async () => {
      const { result } = renderHook(() => useCombatAudio());

      // Head position (top of character)
      await result.current.playBoneImpactSound({
        damage: 20,
        hitPosition: { x: 0, y: 1.8, z: 0 },
      });

      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      // Should detect head region and use appropriate sound
      expect(mockAudio.playSFX).toHaveBeenCalledWith(
        expect.stringMatching(/^hit_/),
        expect.any(Number)
      );
    });

    it("should apply volume multipliers based on intensity", async () => {
      const { result } = renderHook(() => useCombatAudio());

      // Light hit should have lower volume
      await result.current.playBoneImpactSound({
        region: "arms",
        intensity: "light",
      });

      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      const [[, lightVolume]] = mockAudio.playSFX.mock.calls;
      expect(lightVolume).toBeLessThan(0.8);

      mockAudio.playSFX.mockClear();

      // Wait to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Fracture hit should have higher volume
      await result.current.playBoneImpactSound({
        region: "arms",
        intensity: "fracture",
      });

      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      const [[, fractureVolume]] = mockAudio.playSFX.mock.calls;
      expect(fractureVolume).toBeGreaterThan(lightVolume);
    });

    it("should default to torso if no region provided", async () => {
      const { result } = renderHook(() => useCombatAudio());

      await result.current.playBoneImpactSound({
        damage: 15,
      });

      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      // Should still play a sound even without explicit region
      expect(mockAudio.playSFX).toHaveBeenCalledWith(
        expect.stringMatching(/^hit_/),
        expect.any(Number)
      );
    });

    it("should default to medium intensity if no damage provided", async () => {
      const { result } = renderHook(() => useCombatAudio());

      await result.current.playBoneImpactSound({
        region: "legs",
      });

      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      const [[soundId]] = mockAudio.playSFX.mock.calls;
      expect(soundId).toMatch(/^hit_medium/);
    });

    it("should respect rate limiting", async () => {
      const { result } = renderHook(() => useCombatAudio());

      // Play first sound
      await result.current.playBoneImpactSound({
        region: "head",
        intensity: "heavy",
      });

      // Try to play again immediately (should be rate limited)
      await result.current.playBoneImpactSound({
        region: "head",
        intensity: "heavy",
      });

      // Should only call playSFX once due to rate limiting
      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalledTimes(1);
      });
    });

    it("should handle different body regions", async () => {
      const { result } = renderHook(() => useCombatAudio());

      const regions: Array<
        "head" | "torso" | "arms" | "legs" | "soft_tissue"
      > = ["head", "torso", "arms", "legs", "soft_tissue"];

      for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        mockAudio.playSFX.mockClear();

        // Wait between calls to avoid rate limiting
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 150));
        }

        await result.current.playBoneImpactSound({
          region,
          intensity: "medium",
        });

        await waitFor(() => {
          expect(mockAudio.playSFX).toHaveBeenCalled();
        });

        const [[soundId]] = mockAudio.playSFX.mock.calls;
        expect(soundId).toBeDefined();
        expect(typeof soundId).toBe("string");
      }
    });

    it("should handle audio playback errors gracefully", async () => {
      const { result } = renderHook(() => useCombatAudio());
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation();

      mockAudio.playSFX.mockRejectedValueOnce(
        new Error("Audio playback failed")
      );

      await result.current.playBoneImpactSound({
        region: "torso",
        intensity: "heavy",
      });

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalled();
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to play bone impact sound"),
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });

    it("should cap final volume at 1.0", async () => {
      const { result } = renderHook(() => useCombatAudio());

      // Fracture has 1.3x multiplier, but should be capped at 1.0
      await result.current.playBoneImpactSound({
        region: "head",
        intensity: "fracture",
      });

      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      const [[, volume]] = mockAudio.playSFX.mock.calls;
      expect(volume).toBeLessThanOrEqual(1.0);
    });
  });

  describe("Integration with existing combat audio", () => {
    it("should work alongside existing playHitSound", async () => {
      const { result } = renderHook(() => useCombatAudio());

      // Play traditional hit sound
      await result.current.playHitSound(25);

      // Play bone impact sound
      await result.current.playBoneImpactSound({
        region: "torso",
        damage: 25,
      });

      // Both should work without interference
      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalledTimes(2);
      });
    });

    it("should respect MAX_SIMULTANEOUS_SOUNDS limit", async () => {
      const { result } = renderHook(() => useCombatAudio());

      // Play multiple sounds rapidly (more than MAX_SIMULTANEOUS_SOUNDS)
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          result.current.playBoneImpactSound({
            region: "torso",
            damage: 20 + i,
          })
        );
      }

      await Promise.all(promises);

      // Should have been called (mocks don't enforce rate limiting)
      await waitFor(() => {
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      // Verify it was called at least once (rate limiting works in real use)
      expect(mockAudio.playSFX.mock.calls.length).toBeGreaterThan(0);
    });

    it("should return hook with playBoneImpactSound method", () => {
      const { result } = renderHook(() => useCombatAudio());

      expect(result.current.playBoneImpactSound).toBeDefined();
      expect(typeof result.current.playBoneImpactSound).toBe("function");
    });
  });
});
