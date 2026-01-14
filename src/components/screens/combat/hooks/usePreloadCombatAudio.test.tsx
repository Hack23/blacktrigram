/**
 * Tests for usePreloadCombatAudio hook
 */

import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { audioAssetRegistry } from "../../../../audio/AudioAssetRegistry";
import { useAudio } from "../../../../audio/AudioProvider";
import type { IAudioManager } from "../../../../audio/types";
import { usePreloadCombatAudio } from "./usePreloadCombatAudio";

vi.mock("../../../../audio/AudioProvider", () => ({
  useAudio: vi.fn(),
}));

vi.mock("../../../../audio/AudioAssetRegistry", () => ({
  audioAssetRegistry: {
    getSFX: vi.fn(),
    getMusic: vi.fn(),
  },
}));

describe("usePreloadCombatAudio", () => {
  let mockAudioManager: Partial<IAudioManager>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockAudioManager = {
      loadAsset: vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 5));
      }),
    };

    (useAudio as ReturnType<typeof vi.fn>).mockReturnValue(mockAudioManager);

    (audioAssetRegistry.getSFX as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => ({
        id,
        type: "sound",
        url: `/audio/${id}.webm`,
        formats: ["audio/webm"],
        loaded: false,
        volume: 0.7,
      })
    );

    (
      audioAssetRegistry.getMusic as ReturnType<typeof vi.fn>
    ).mockImplementation((id: string) => ({
      id,
      type: "music",
      url: `/audio/${id}.webm`,
      formats: ["audio/webm"],
      loaded: false,
      volume: 0.4,
      loop: true,
    }));
  });

  it("should start in loading state", async () => {
    const { result } = renderHook(() => usePreloadCombatAudio());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    expect(result.current.isLoaded).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.errors).toEqual([]);
  });

  it("should load all critical combat assets", async () => {
    const { result } = renderHook(() => usePreloadCombatAudio());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.progress).toBe(100);
    expect(mockAudioManager.loadAsset).toHaveBeenCalled();

    expect(mockAudioManager.loadAsset).toHaveBeenCalledWith(
      expect.objectContaining({ id: "attack_punch_light_1" })
    );
    expect(mockAudioManager.loadAsset).toHaveBeenCalledWith(
      expect.objectContaining({ id: "combat_theme" })
    );
  });

  it("should update progress during loading", async () => {
    const { result } = renderHook(() => usePreloadCombatAudio());

    await waitFor(
      () => {
        expect(result.current.isLoaded).toBe(true);
      },
      { timeout: 3000 }
    );

    expect(result.current.progress).toBe(100);
  });

  it("should handle loading errors gracefully", async () => {
    mockAudioManager.loadAsset = vi
      .fn()
      .mockImplementation((asset: { id: string }) => {
        if (asset.id === "attack_critical_1") {
          return Promise.reject(new Error("Network error"));
        }
        return Promise.resolve();
      });

    const { result } = renderHook(() => usePreloadCombatAudio());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.progress).toBe(100);

    expect(result.current.errors.length).toBeGreaterThan(0);
    expect(
      result.current.errors.some((e) => e.includes("attack_critical_1"))
    ).toBe(true);
  });

  it("should handle missing assets in registry", async () => {
    (audioAssetRegistry.getSFX as ReturnType<typeof vi.fn>).mockImplementation(
      (id: string) => {
        if (id === "hit_light_1") {
          return undefined;
        }
        return {
          id,
          type: "sound",
          url: `/audio/${id}.webm`,
          formats: ["audio/webm"],
          loaded: false,
          volume: 0.7,
        };
      }
    );

    const { result } = renderHook(() => usePreloadCombatAudio());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.isLoaded).toBe(true);
    expect(result.current.progress).toBe(100);
  });

  it("should load assets sequentially to avoid overwhelming browser", async () => {
    const loadOrder: string[] = [];

    mockAudioManager.loadAsset = vi
      .fn()
      .mockImplementation((asset: { id: string }) => {
        loadOrder.push(asset.id);
        return new Promise((resolve) => setTimeout(resolve, 10));
      });

    const { result } = renderHook(() => usePreloadCombatAudio());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(loadOrder.length).toBeGreaterThan(0);
    expect(loadOrder).toContain("attack_punch_light_1");
    expect(loadOrder).toContain("combat_theme");
  });

  it("should mark loading complete even if all assets fail", async () => {
    mockAudioManager.loadAsset = vi
      .fn()
      .mockRejectedValue(new Error("All failed"));

    const { result } = renderHook(() => usePreloadCombatAudio());

    await waitFor(
      () => {
        expect(result.current.isLoaded).toBe(true);
      },
      { timeout: 5000 }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.progress).toBe(100);
    expect(result.current.errors.length).toBeGreaterThan(0);
  });
});
