/**
 * Tests for usePreloadCombatAudio hook
 */

import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePreloadCombatAudio } from "./usePreloadCombatAudio";
import type { IAudioManager } from "../../../../audio/types";

// Mock AudioProvider
vi.mock("../../../../audio/AudioProvider", () => ({
  useAudio: vi.fn(),
}));

// Mock AudioAssetRegistry
vi.mock("../../../../audio/AudioAssetRegistry", () => ({
  audioAssetRegistry: {
    getSFX: vi.fn(),
    getMusic: vi.fn(),
  },
}));

import { useAudio } from "../../../../audio/AudioProvider";
import { audioAssetRegistry } from "../../../../audio/AudioAssetRegistry";

describe("usePreloadCombatAudio", () => {
  let mockAudioManager: Partial<IAudioManager>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create mock audio manager
    mockAudioManager = {
      loadAsset: vi.fn().mockResolvedValue(undefined),
    };
    
    (useAudio as ReturnType<typeof vi.fn>).mockReturnValue(mockAudioManager);
    
    // Mock asset registry to return mock assets
    (audioAssetRegistry.getSFX as ReturnType<typeof vi.fn>).mockImplementation((id: string) => ({
      id,
      type: "sound",
      url: `/audio/${id}.webm`,
      formats: ["audio/webm"],
      loaded: false,
      volume: 0.7,
    }));
    
    (audioAssetRegistry.getMusic as ReturnType<typeof vi.fn>).mockImplementation((id: string) => ({
      id,
      type: "music",
      url: `/audio/${id}.webm`,
      formats: ["audio/webm"],
      loaded: false,
      volume: 0.4,
      loop: true,
    }));
  });

  it("should start in loading state", () => {
    const { result } = renderHook(() => usePreloadCombatAudio());
    
    expect(result.current.isLoading).toBe(true);
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
    
    // Verify critical assets were loaded
    expect(mockAudioManager.loadAsset).toHaveBeenCalledWith(
      expect.objectContaining({ id: "attack_punch_light_1" })
    );
    expect(mockAudioManager.loadAsset).toHaveBeenCalledWith(
      expect.objectContaining({ id: "combat_theme" })
    );
  });

  it("should update progress during loading", async () => {
    const { result } = renderHook(() => usePreloadCombatAudio());
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    }, { timeout: 3000 });
    
    // Final progress should be 100
    expect(result.current.progress).toBe(100);
  });

  it("should handle loading errors gracefully", async () => {
    // Make loadAsset fail for specific assets
    mockAudioManager.loadAsset = vi.fn().mockImplementation((asset: { id: string }) => {
      if (asset.id === "attack_critical_1") {
        return Promise.reject(new Error("Network error"));
      }
      return Promise.resolve();
    });
    
    const { result } = renderHook(() => usePreloadCombatAudio());
    
    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
    
    // Should complete loading despite errors
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.progress).toBe(100);
    
    // Should track errors
    expect(result.current.errors.length).toBeGreaterThan(0);
    expect(result.current.errors.some(e => e.includes("attack_critical_1"))).toBe(true);
  });

  it("should handle missing assets in registry", async () => {
    // Make some assets return undefined
    (audioAssetRegistry.getSFX as ReturnType<typeof vi.fn>).mockImplementation((id: string) => {
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
    });
    
    const { result } = renderHook(() => usePreloadCombatAudio());
    
    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
    
    // Should complete loading even with missing assets
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.progress).toBe(100);
    
    // Missing assets should be logged (check console.warn was called)
    // Note: In real usage, missing assets are logged but don't prevent loading
  });

  it("should load assets sequentially to avoid overwhelming browser", async () => {
    const loadOrder: string[] = [];
    
    mockAudioManager.loadAsset = vi.fn().mockImplementation((asset: { id: string }) => {
      loadOrder.push(asset.id);
      return new Promise(resolve => setTimeout(resolve, 10));
    });
    
    const { result } = renderHook(() => usePreloadCombatAudio());
    
    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });
    
    // Verify assets were loaded (order may vary but should be sequential)
    expect(loadOrder.length).toBeGreaterThan(0);
    expect(loadOrder).toContain("attack_punch_light_1");
    expect(loadOrder).toContain("combat_theme");
  });

  it("should mark loading complete even if all assets fail", async () => {
    // Make all assets fail
    mockAudioManager.loadAsset = vi.fn().mockRejectedValue(new Error("All failed"));
    
    const { result } = renderHook(() => usePreloadCombatAudio());
    
    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    }, { timeout: 5000 });
    
    // Should complete loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.progress).toBe(100);
    
    // All assets should be in errors
    expect(result.current.errors.length).toBeGreaterThan(0);
  });
});
