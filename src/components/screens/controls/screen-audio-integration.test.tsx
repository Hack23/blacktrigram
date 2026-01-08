/**
 * Tests for screen audio integration
 * Validates that Training, Philosophy, and Controls screens properly integrate audio
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { audioAssetRegistry } from "../../../audio/AudioAssetRegistry";

describe("Screen Audio Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AudioAssetRegistry", () => {
    it("should have underground_theme registered for PhilosophyScreen", () => {
      const undergroundTheme = audioAssetRegistry.getMusic("underground_theme");
      expect(undergroundTheme).toBeDefined();
      expect(undergroundTheme?.id).toBe("underground_theme");
      expect(undergroundTheme?.type).toBe("music");
      expect(undergroundTheme?.loop).toBe(true);
      expect(undergroundTheme?.volume).toBe(0.4);
      expect(undergroundTheme?.fadeInTime).toBe(2000);
      expect(undergroundTheme?.fadeOutTime).toBe(2000);
    });

    it("should have cyberpunk_fusion registered for TrainingScreen", () => {
      const cyberpunkFusion = audioAssetRegistry.getMusic("cyberpunk_fusion");
      expect(cyberpunkFusion).toBeDefined();
      expect(cyberpunkFusion?.id).toBe("cyberpunk_fusion");
      expect(cyberpunkFusion?.type).toBe("music");
      expect(cyberpunkFusion?.loop).toBe(true);
      expect(cyberpunkFusion?.volume).toBe(0.4);
      expect(cyberpunkFusion?.fadeInTime).toBe(2000);
      expect(cyberpunkFusion?.fadeOutTime).toBe(2000);
    });

    it("should have ki_charge registered for training techniques", () => {
      const kiCharge = audioAssetRegistry.getSFX("ki_charge");
      expect(kiCharge).toBeDefined();
      expect(kiCharge?.id).toBe("ki_charge");
      expect(kiCharge?.type).toBe("sound");
      expect(kiCharge?.volume).toBe(0.7);
      expect(kiCharge?.variations).toBeDefined();
      expect(kiCharge?.variations?.length).toBeGreaterThan(0);
    });

    it("should have ki_release registered for training techniques", () => {
      const kiRelease = audioAssetRegistry.getSFX("ki_release");
      expect(kiRelease).toBeDefined();
      expect(kiRelease?.id).toBe("ki_release");
      expect(kiRelease?.type).toBe("sound");
      expect(kiRelease?.volume).toBe(0.7);
      expect(kiRelease?.variations).toBeDefined();
      expect(kiRelease?.variations?.length).toBeGreaterThan(0);
    });

    it("should have ki_charge variations (1-4) registered", () => {
      for (let i = 1; i <= 4; i++) {
        const kiCharge = audioAssetRegistry.getSFX(`ki_charge_${i}`);
        expect(kiCharge).toBeDefined();
        expect(kiCharge?.id).toBe(`ki_charge_${i}`);
        expect(kiCharge?.volume).toBe(0.7);
      }
    });

    it("should have ki_release variations (1-4) registered", () => {
      for (let i = 1; i <= 4; i++) {
        const kiRelease = audioAssetRegistry.getSFX(`ki_release_${i}`);
        expect(kiRelease).toBeDefined();
        expect(kiRelease?.id).toBe(`ki_release_${i}`);
        expect(kiRelease?.volume).toBe(0.7);
      }
    });

    it("should have screen_music asset group defined", () => {
      const screenMusicGroup = audioAssetRegistry.getAssetGroup("screen_music");
      expect(screenMusicGroup).toBeDefined();
      expect(screenMusicGroup?.priority).toBe("normal");
      expect(screenMusicGroup?.lazyLoad).toBe(true);
      expect(screenMusicGroup?.assets).toContain("underground_theme");
      expect(screenMusicGroup?.assets).toContain("cyberpunk_fusion");
    });

    it("should have training_sfx asset group defined", () => {
      const trainingSfxGroup = audioAssetRegistry.getAssetGroup("training_sfx");
      expect(trainingSfxGroup).toBeDefined();
      expect(trainingSfxGroup?.priority).toBe("normal");
      expect(trainingSfxGroup?.lazyLoad).toBe(true);
      expect(trainingSfxGroup?.assets).toContain("ki_charge");
      expect(trainingSfxGroup?.assets).toContain("ki_release");
    });

    it("should have menu sounds registered for UI interactions", () => {
      const menuSounds = [
        "menu_select",
        "menu_back",
        "menu_navigate",
        "menu_click",
      ];

      menuSounds.forEach((soundId) => {
        const sound = audioAssetRegistry.getSFX(soundId);
        expect(sound).toBeDefined();
        expect(sound?.type).toBe("sound");
      });
    });

    it("should have stance_change sounds registered", () => {
      for (let i = 1; i <= 4; i++) {
        const stanceChange = audioAssetRegistry.getSFX(`stance_change_${i}`);
        expect(stanceChange).toBeDefined();
        expect(stanceChange?.id).toBe(`stance_change_${i}`);
        expect(stanceChange?.volume).toBe(0.7);
      }
    });
  });

  describe("Asset Groups", () => {
    it("should retrieve all assets in screen_music group", () => {
      const assets = audioAssetRegistry.getAssetsInGroup("screen_music");
      expect(assets).toBeDefined();
      expect(assets.length).toBeGreaterThan(0);
      
      const assetIds = assets.map((asset) => asset.id);
      expect(assetIds).toContain("underground_theme");
      expect(assetIds).toContain("cyberpunk_fusion");
    });

    it("should retrieve all assets in training_sfx group", () => {
      const assets = audioAssetRegistry.getAssetsInGroup("training_sfx");
      expect(assets).toBeDefined();
      expect(assets.length).toBeGreaterThan(0);
      
      const assetIds = assets.map((asset) => asset.id);
      expect(assetIds).toContain("ki_charge");
      expect(assetIds).toContain("ki_release");
    });

    it("should filter asset groups by priority", () => {
      const normalPriorityGroups = audioAssetRegistry.getAssetGroupsByPriority("normal");
      expect(normalPriorityGroups).toBeDefined();
      expect(normalPriorityGroups.length).toBeGreaterThan(0);
      
      const groupIds = normalPriorityGroups.map((group) => group.id);
      expect(groupIds).toContain("screen_music");
      expect(groupIds).toContain("training_sfx");
    });
  });

  describe("Audio Format Support", () => {
    it("should support webm format for all screen music", () => {
      const screenMusic = [
        audioAssetRegistry.getMusic("underground_theme"),
        audioAssetRegistry.getMusic("cyberpunk_fusion"),
      ];

      screenMusic.forEach((music) => {
        expect(music?.formats).toBeDefined();
        expect(music?.formats).toContain("audio/webm");
      });
    });

    it("should support mp3 format fallback for all screen music", () => {
      const screenMusic = [
        audioAssetRegistry.getMusic("underground_theme"),
        audioAssetRegistry.getMusic("cyberpunk_fusion"),
      ];

      screenMusic.forEach((music) => {
        expect(music?.formats).toBeDefined();
        expect(music?.formats).toContain("audio/mp3");
      });
    });

    it("should have multiple variations for ki sounds", () => {
      const kiCharge = audioAssetRegistry.getSFX("ki_charge");
      const kiRelease = audioAssetRegistry.getSFX("ki_release");

      expect(kiCharge?.variations).toBeDefined();
      expect(kiCharge?.variations?.length).toBeGreaterThanOrEqual(4);
      
      expect(kiRelease?.variations).toBeDefined();
      expect(kiRelease?.variations?.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("Volume Configuration", () => {
    it("should have appropriate volume levels for background music", () => {
      const undergroundTheme = audioAssetRegistry.getMusic("underground_theme");
      const cyberpunkFusion = audioAssetRegistry.getMusic("cyberpunk_fusion");

      expect(undergroundTheme?.volume).toBeLessThanOrEqual(0.7);
      expect(cyberpunkFusion?.volume).toBeLessThanOrEqual(0.7);
    });

    it("should have appropriate volume levels for SFX", () => {
      const kiCharge = audioAssetRegistry.getSFX("ki_charge");
      const kiRelease = audioAssetRegistry.getSFX("ki_release");
      const menuSelect = audioAssetRegistry.getSFX("menu_select");

      expect(kiCharge?.volume).toBeLessThanOrEqual(1.0);
      expect(kiRelease?.volume).toBeLessThanOrEqual(1.0);
      expect(menuSelect?.volume).toBeLessThanOrEqual(1.0);
    });

    it("should have proper fade times for music tracks", () => {
      const undergroundTheme = audioAssetRegistry.getMusic("underground_theme");
      const cyberpunkFusion = audioAssetRegistry.getMusic("cyberpunk_fusion");

      expect(undergroundTheme?.fadeInTime).toBeGreaterThanOrEqual(1000);
      expect(undergroundTheme?.fadeOutTime).toBeGreaterThanOrEqual(1000);
      expect(cyberpunkFusion?.fadeInTime).toBeGreaterThanOrEqual(1000);
      expect(cyberpunkFusion?.fadeOutTime).toBeGreaterThanOrEqual(1000);
    });
  });
});
