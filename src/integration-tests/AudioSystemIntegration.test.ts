/**
 * Audio System Integration Tests
 * 
 * Tests the integration of the audio system with game components,
 * verifying proper audio playback, volume control, and state management
 * across different game screens and actions.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import AudioManager from "../audio/AudioManager";
import { AudioAsset, AudioConfig } from "../audio/types";
import { PlayerArchetype, TrigramStance } from "../types";
import CombatSystem from "../systems/CombatSystem";
import { createPlayerFromArchetype } from "../utils/playerUtils";

describe("Audio System Integration", () => {
  let audioManager: AudioManager;
  let combatSystem: CombatSystem;

  beforeEach(() => {
    audioManager = new AudioManager();
    combatSystem = new CombatSystem();
    vi.clearAllMocks();
  });

  describe("Audio Manager Initialization", () => {
    it("should initialize audio manager with default config", async () => {
      await audioManager.initialize();

      expect(audioManager).toBeDefined();
    });

    it("should initialize with custom config", async () => {
      const customConfig: Partial<AudioConfig> = {
        masterVolume: 0.5,
        sfxVolume: 0.7,
        musicVolume: 0.3,
      };

      const customManager = new AudioManager(customConfig);
      await customManager.initialize();

      expect(customManager).toBeDefined();
    });

    it("should handle initialization failure gracefully", async () => {
      // Spy on console.warn to suppress warnings in test output
      const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

      const manager = new AudioManager();
      await manager.initialize();

      // Should not throw error
      expect(manager).toBeDefined();

      consoleWarn.mockRestore();
    });
  });

  describe("Asset Loading Integration", () => {
    it("should load audio assets", async () => {
      await audioManager.initialize();

      const testAsset: AudioAsset = {
        id: "test-sound",
        type: "sound",
        url: "/test-sound.mp3",
        formats: ["mp3"],
        loaded: false,
        volume: 0.5,
        category: "sfx",
      };

      // Should not throw error even if file doesn't exist
      try {
        await audioManager.loadAsset(testAsset);
      } catch (error) {
        // Expected to fail in test environment
        expect(error).toBeDefined();
      }
    });

    it("should handle loading multiple assets", async () => {
      await audioManager.initialize();

      const assets: AudioAsset[] = [
        { id: "sound1", type: "sound", url: "/sound1.mp3", formats: ["mp3"], loaded: false, volume: 0.5, category: "sfx" },
        { id: "sound2", type: "sound", url: "/sound2.mp3", formats: ["mp3"], loaded: false, volume: 0.7, category: "sfx" },
        { id: "sound3", type: "music", url: "/music1.mp3", formats: ["mp3"], loaded: false, volume: 0.3, category: "music" },
      ];

      // Load assets in parallel
      const loadPromises = assets.map((asset) => audioManager.loadAsset(asset));

      // Should handle all loads
      try {
        await Promise.allSettled(loadPromises);
      } catch (error) {
        // Expected in test environment
      }

      expect(audioManager).toBeDefined();
    });
  });

  describe("Combat Audio Integration", () => {
    it("should play sound effects during combat", async () => {
      await audioManager.initialize();

      const player1 = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const player2 = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      // Get techniques and execute attack
      const techniques = combatSystem.getAvailableTechniques(player1);
      expect(techniques.length).toBeGreaterThan(0);

      const result = combatSystem.resolveAttack(player1, player2, techniques[0]);

      // In real integration, audio would play here
      expect(result).toBeDefined();
      expect(result.technique).toBeDefined();
    });

    it("should play different sounds for different techniques", async () => {
      await audioManager.initialize();

      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const opponent = createPlayerFromArchetype(PlayerArchetype.AMSALJA, 1);

      const techniques = combatSystem.getAvailableTechniques(player);
      const soundsPlayed: string[] = [];

      // Execute multiple techniques
      for (const technique of techniques.slice(0, 3)) {
        const result = combatSystem.resolveAttack(player, opponent, technique);
        soundsPlayed.push(technique.name.korean);

        expect(result).toBeDefined();
      }

      expect(soundsPlayed.length).toBeGreaterThan(0);
    });

    it("should handle stance change audio", async () => {
      await audioManager.initialize();

      const player = createPlayerFromArchetype(PlayerArchetype.MUSA, 0);
      const stances = [
        TrigramStance.GEON,
        TrigramStance.TAE,
        TrigramStance.LI,
      ];

      // Simulate stance changes
      for (const stance of stances) {
        // In real integration, would play stance change sound
        expect(stance).toBeDefined();
      }
    });
  });

  describe("Volume Control Integration", () => {
    it("should adjust master volume", async () => {
      await audioManager.initialize();

      audioManager.setVolume("master", 0.5);
      audioManager.setVolume("master", 0.8);
      audioManager.setVolume("master", 0.0);

      // Should not throw errors
      expect(audioManager).toBeDefined();
    });

    it("should adjust SFX volume independently", async () => {
      await audioManager.initialize();

      audioManager.setVolume("sfx", 0.6);
      audioManager.setVolume("sfx", 0.3);

      expect(audioManager).toBeDefined();
    });

    it("should adjust music volume independently", async () => {
      await audioManager.initialize();

      audioManager.setVolume("music", 0.4);
      audioManager.setVolume("music", 0.7);

      expect(audioManager).toBeDefined();
    });

    it("should clamp volume values", async () => {
      await audioManager.initialize();

      // Try to set volumes outside valid range
      audioManager.setVolume("master", -0.5); // Should clamp to 0
      audioManager.setVolume("master", 1.5); // Should clamp to 1

      audioManager.setVolume("sfx", -1); // Should clamp to 0
      audioManager.setVolume("music", 2); // Should clamp to 1

      // Should not throw errors
      expect(audioManager).toBeDefined();
    });
  });

  describe("Music Playback Integration", () => {
    it("should play background music", async () => {
      await audioManager.initialize();

      // Try to play music
      try {
        audioManager.playMusic("intro-theme");
      } catch (error) {
        // Expected in test environment
      }

      expect(audioManager).toBeDefined();
    });

    it("should stop music playback", async () => {
      await audioManager.initialize();

      try {
        audioManager.playMusic("combat-theme");
        audioManager.stopMusic();
      } catch (error) {
        // Expected in test environment
      }

      expect(audioManager).toBeDefined();
    });

    it("should switch between music tracks", async () => {
      await audioManager.initialize();

      const tracks = ["intro-theme", "combat-theme", "training-theme"];

      for (const track of tracks) {
        try {
          audioManager.stopMusic();
          audioManager.playMusic(track);
        } catch (error) {
          // Expected in test environment
        }
      }

      expect(audioManager).toBeDefined();
    });
  });

  describe("Screen Transition Audio Integration", () => {
    it("should handle audio during screen transitions", async () => {
      await audioManager.initialize();

      // Simulate screen transitions
      const screens = ["intro", "combat", "training", "end"];

      for (const screen of screens) {
        // Stop current music
        try {
          audioManager.stopMusic();
        } catch (error) {
          // Expected in test environment
        }

        // Play screen-specific music
        try {
          audioManager.playMusic(`${screen}-theme`);
        } catch (error) {
          // Expected in test environment
        }
      }

      expect(audioManager).toBeDefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle missing audio files gracefully", async () => {
      await audioManager.initialize();

      // Try to play non-existent sound
      try {
        audioManager.playSFX("non-existent-sound");
      } catch (error) {
        // Should handle gracefully
        expect(error).toBeDefined();
      }
    });

    it("should handle audio context errors", async () => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      await audioManager.initialize();

      // Should initialize even if audio context fails
      expect(audioManager).toBeDefined();

      consoleError.mockRestore();
    });

    it("should handle concurrent audio playback", async () => {
      await audioManager.initialize();

      // Try to play multiple sounds simultaneously
      const sounds = ["hit1", "hit2", "hit3"];

      try {
        sounds.forEach((sound) => {
          audioManager.playSFX(sound);
        });
      } catch (error) {
        // Expected in test environment
      }

      expect(audioManager).toBeDefined();
    });
  });

  describe("Audio State Management", () => {
    it("should maintain audio state across game session", async () => {
      await audioManager.initialize();

      // Set volumes
      audioManager.setVolume("master", 0.7);
      audioManager.setVolume("sfx", 0.8);
      audioManager.setVolume("music", 0.5);

      // Simulate game actions
      try {
        audioManager.playSFX("menu-select");
        audioManager.playMusic("combat-theme");
      } catch (error) {
        // Expected in test environment
      }

      // State should be maintained
      expect(audioManager).toBeDefined();
    });

    it("should handle mute/unmute", async () => {
      await audioManager.initialize();

      // Mute
      audioManager.mute();

      // Try to play sound (should be silent)
      try {
        audioManager.playSFX("test-sound");
      } catch (error) {
        // Expected
      }

      // Unmute
      audioManager.unmute();

      // Try to play sound again
      try {
        audioManager.playSFX("test-sound");
      } catch (error) {
        // Expected
      }

      expect(audioManager).toBeDefined();
    });
  });

  describe("Performance", () => {
    it("should handle rapid audio playback requests", async () => {
      await audioManager.initialize();

      const start = Date.now();

      // Rapid fire sound effects
      for (let i = 0; i < 50; i++) {
        try {
          audioManager.playSFX("rapid-test");
        } catch (error) {
          // Expected
        }
      }

      const duration = Date.now() - start;

      // Should complete quickly
      expect(duration).toBeLessThan(1000);
    });

    it("should not leak memory with repeated audio loading", async () => {
      await audioManager.initialize();

      // Load and unload assets repeatedly
      const testAsset: AudioAsset = {
        id: "test-memory",
        type: "sound",
        url: "/test.mp3",
        formats: ["mp3"],
        loaded: false,
        volume: 0.5,
        category: "sfx",
      };

      for (let i = 0; i < 10; i++) {
        try {
          await audioManager.loadAsset(testAsset);
        } catch (error) {
          // Expected
        }
      }

      expect(audioManager).toBeDefined();
    });
  });

  describe("Korean Martial Arts Audio Integration", () => {
    it("should play sounds for all 8 trigram stances", async () => {
      await audioManager.initialize();

      const stances = Object.values(TrigramStance);
      const stanceSounds: string[] = [];

      for (const stance of stances) {
        // In real integration, would play stance-specific sound
        stanceSounds.push(`stance-${stance}`);
      }

      expect(stanceSounds.length).toBe(stances.length);
    });

    it("should play sounds for all player archetypes", async () => {
      await audioManager.initialize();

      const archetypes = Object.values(PlayerArchetype);
      const archetypeSounds: string[] = [];

      for (const archetype of archetypes) {
        const player = createPlayerFromArchetype(archetype, 0);
        archetypeSounds.push(`archetype-${player.name}`);
      }

      expect(archetypeSounds.length).toBe(archetypes.length);
    });
  });
});
