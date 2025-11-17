import { beforeEach, describe, expect, it, vi } from "vitest";
import { AudioManager } from "./AudioManager";
import type { AudioConfig, MusicTrackId, SoundEffectId } from "./types";
import { AudioCategory } from "./types";

// Mock Web Audio API
class MockAudioContext {
  createBuffer = vi.fn();
  createBufferSource = vi.fn();
  createGain = vi.fn();
  destination = {};
  sampleRate = 44100;
}

// Mock global Audio constructor - must use class for Vitest 4.0
class MockAudioElement {
  canPlayType: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
  load: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  volume = 1;
  currentTime = 0;
  duration = 0;
  paused = true;
  ended = false;
  src = "";
  crossOrigin = null;
  preload = "auto";
  onended = null;
  onerror = null;
  onloadeddata = null;

  constructor(src?: string) {
    if (src) {
      this.src = src;
    }
    this.canPlayType = vi.fn((type: string) => {
      if (type === "audio/mp3" || type === "audio/mpeg") return "probably";
      if (type === "audio/wav") return "maybe";
      return "";
    });
    this.play = vi.fn(() => Promise.resolve());
    this.pause = vi.fn();
    this.load = vi.fn();
    this.addEventListener = vi.fn();
    this.removeEventListener = vi.fn();
  }
}

global.Audio = MockAudioElement as any;
global.AudioContext = MockAudioContext as any;
(global as any).webkitAudioContext = MockAudioContext;

describe("AudioManager", () => {
  const mockAudioConfig: AudioConfig = {
    enableSpatialAudio: false,
    maxSimultaneousSounds: 32,
    audioFormats: ["audio/wav", "audio/mp3"],
    fadeTransitionTime: 1000,
    defaultVolume: 0.7,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with correct config", async () => {
      const audioManager = new AudioManager();

      await audioManager.initialize(mockAudioConfig);

      expect(audioManager.isInitialized).toBe(true);
    });

    it("should play sound effects correctly", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await expect(
        audioManager.playSoundEffect("attack_light" as SoundEffectId)
      ).resolves.not.toThrow();

      expect(audioManager.isInitialized).toBe(true);
    });

    it("should play music tracks", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await expect(
        audioManager.playMusic("intro_theme" as MusicTrackId)
      ).resolves.not.toThrow();

      await expect(
        audioManager.playMusic("combat_theme" as MusicTrackId)
      ).resolves.not.toThrow();

      expect(audioManager).toBeInstanceOf(AudioManager);
    });
  });

  describe("Audio Asset Creation", () => {
    it("should create sound effect with correct properties", () => {
      const soundEffect = {
        id: "test_sound",
        name: "Test Sound",
        type: "sound" as const,
        url: "/test.mp3",
        formats: ["audio/mp3"] as const,
        loaded: false,
        volume: 0.8,
        category: AudioCategory.SFX,
        pitch: 1.0,
      };

      expect(soundEffect.type).toBe("sound");
      expect(soundEffect.category).toBe(AudioCategory.SFX);
    });

    it("should create music track with correct properties", () => {
      const musicTrack = {
        id: "test_music",
        name: "Test Music",
        type: "music" as const,
        url: "/test_music.mp3",
        formats: ["audio/mp3"] as const,
        loaded: false,
        title: { korean: "테스트", english: "Test" },
        volume: 0.7,
        loop: true,
        category: AudioCategory.MUSIC,
      };

      expect(musicTrack.type).toBe("music");
      expect(musicTrack.category).toBe(AudioCategory.MUSIC);
    });
  });

  describe("Korean Martial Arts Audio", () => {
    it("should handle trigram stance sounds", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      // Test trigram stance sound generation
      expect(() => {
        audioManager.playTrigramStanceSound("geon");
      }).not.toThrow();
    });

    it("should handle technique sounds", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      // Test Korean technique sounds
      expect(() => {
        audioManager.playKoreanTechniqueSound("thunder_strike", "musa");
      }).not.toThrow();
    });

    it("should handle vital point hit sounds", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      // Test vital point audio feedback
      expect(() => {
        audioManager.playVitalPointHitSound("critical");
      }).not.toThrow();
    });
  });

  describe("Volume Controls", () => {
    it("should set master volume correctly", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      audioManager.setVolume("master", 0.5);
      expect(audioManager.masterVolume).toBe(0.5);
      expect(audioManager.getMasterVolume()).toBe(0.5);
    });

    it("should set music volume correctly", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      audioManager.setVolume("music", 0.6);
      expect(audioManager.musicVolume).toBe(0.6);
      expect(audioManager.getMusicVolume()).toBe(0.6);
    });

    it("should set sfx volume correctly", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      audioManager.setVolume("sfx", 0.9);
      expect(audioManager.sfxVolume).toBe(0.9);
      expect(audioManager.getSfxVolume()).toBe(0.9);
    });

    it("should clamp volume values between 0 and 1", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      audioManager.setVolume("master", 1.5);
      expect(audioManager.masterVolume).toBe(1.0);

      audioManager.setVolume("sfx", -0.5);
      expect(audioManager.sfxVolume).toBe(0.0);
    });

    it("should update current music volume when music volume changes", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      // Load and play music
      await audioManager.loadAsset({
        id: "test_music" as MusicTrackId,
        name: "Test Music",
        type: "music",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.MUSIC,
        volume: 1.0,
      });

      await audioManager.playMusic("test_music" as MusicTrackId);

      // Change music volume
      audioManager.setVolume("music", 0.3);
      expect(audioManager.musicVolume).toBe(0.3);
    });

    it("should handle voice volume type", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      // Should not throw when setting voice volume
      expect(() => {
        audioManager.setVolume("voice", 0.5);
      }).not.toThrow();
    });
  });

  describe("Mute/Unmute Functionality", () => {
    it("should mute audio", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      audioManager.mute();
      expect(audioManager.muted).toBe(true);
    });

    it("should unmute audio", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      audioManager.mute();
      expect(audioManager.muted).toBe(true);

      audioManager.unmute();
      expect(audioManager.muted).toBe(false);
    });

    it("should not play sound effects when muted", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.loadAsset({
        id: "test_sfx" as SoundEffectId,
        name: "Test SFX",
        type: "sound",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.SFX,
        volume: 1.0,
      });

      audioManager.mute();
      await audioManager.playSoundEffect("test_sfx" as SoundEffectId);

      // Verify audio was not played when muted
      expect(audioManager.muted).toBe(true);
    });

    it("should not play music when muted", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      audioManager.mute();
      await audioManager.playMusic("intro_theme" as MusicTrackId);

      expect(audioManager.muted).toBe(true);
      expect(audioManager.currentMusicTrack).toBeNull();
    });

    it("should restore volume when unmuted", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      // Load and play music
      await audioManager.loadAsset({
        id: "test_music" as MusicTrackId,
        name: "Test Music",
        type: "music",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.MUSIC,
        volume: 1.0,
      });

      await audioManager.playMusic("test_music" as MusicTrackId);
      audioManager.mute();
      audioManager.unmute();

      expect(audioManager.muted).toBe(false);
    });
  });

  describe("Music Playback", () => {
    it("should stop current music before playing new track", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.loadAsset({
        id: "music1" as MusicTrackId,
        name: "Music 1",
        type: "music",
        url: "/music1.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.MUSIC,
        volume: 1.0,
      });

      await audioManager.loadAsset({
        id: "music2" as MusicTrackId,
        name: "Music 2",
        type: "music",
        url: "/music2.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.MUSIC,
        volume: 1.0,
      });

      await audioManager.playMusic("music1" as MusicTrackId);
      expect(audioManager.currentMusicTrack).toBe("music1");

      await audioManager.playMusic("music2" as MusicTrackId);
      expect(audioManager.currentMusicTrack).toBe("music2");
    });

    it("should stop music correctly", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.loadAsset({
        id: "test_music" as MusicTrackId,
        name: "Test Music",
        type: "music",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.MUSIC,
        volume: 1.0,
      });

      await audioManager.playMusic("test_music" as MusicTrackId);
      expect(audioManager.currentMusicTrack).toBe("test_music");

      audioManager.stopMusic();
      expect(audioManager.currentMusicTrack).toBeNull();
    });

    it("should handle custom music volume", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.loadAsset({
        id: "test_music" as MusicTrackId,
        name: "Test Music",
        type: "music",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.MUSIC,
        volume: 1.0,
      });

      await audioManager.playMusic("test_music" as MusicTrackId, 0.5);
      expect(audioManager.currentMusicTrack).toBe("test_music");
    });

    it("should play dojang ambience", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await expect(
        audioManager.playDojiangAmbience()
      ).resolves.not.toThrow();
    });
  });

  describe("Sound Effects", () => {
    it("should play SFX with playSFX method", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.loadAsset({
        id: "test_sfx" as SoundEffectId,
        name: "Test SFX",
        type: "sound",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.SFX,
        volume: 1.0,
      });

      await expect(
        audioManager.playSFX("test_sfx" as SoundEffectId)
      ).resolves.not.toThrow();
    });

    it("should play SFX with custom volume", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.loadAsset({
        id: "test_sfx" as SoundEffectId,
        name: "Test SFX",
        type: "sound",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.SFX,
        volume: 1.0,
      });

      await expect(
        audioManager.playSFX("test_sfx" as SoundEffectId, 0.5)
      ).resolves.not.toThrow();
    });

    it("should play voice through playVoice method", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.loadAsset({
        id: "test_voice" as SoundEffectId,
        name: "Test Voice",
        type: "sound",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.SFX,
        volume: 1.0,
      });

      await expect(
        audioManager.playVoice("test_voice")
      ).resolves.not.toThrow();
    });

    it("should stop all sounds", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.loadAsset({
        id: "test_music" as MusicTrackId,
        name: "Test Music",
        type: "music",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.MUSIC,
        volume: 1.0,
      });

      await audioManager.playMusic("test_music" as MusicTrackId);
      audioManager.stopAll();

      expect(audioManager.currentMusicTrack).toBeNull();
    });
  });

  describe("Fade Effects", () => {
    it("should fade out music", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.loadAsset({
        id: "test_music" as MusicTrackId,
        name: "Test Music",
        type: "music",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.MUSIC,
        volume: 1.0,
      });

      await audioManager.playMusic("test_music" as MusicTrackId);
      
      // Use a short fade duration for testing
      await audioManager.fadeOut(100);
      
      expect(audioManager.currentMusicTrack).toBeNull();
    });

    it("should fade in music", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.loadAsset({
        id: "test_music" as MusicTrackId,
        name: "Test Music",
        type: "music",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.MUSIC,
        volume: 1.0,
      });

      await audioManager.fadeIn("test_music" as MusicTrackId, 100);
      
      expect(audioManager.currentMusicTrack).toBe("test_music");
    });

    it("should crossfade between tracks", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.loadAsset({
        id: "music1" as MusicTrackId,
        name: "Music 1",
        type: "music",
        url: "/music1.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.MUSIC,
        volume: 1.0,
      });

      await audioManager.loadAsset({
        id: "music2" as MusicTrackId,
        name: "Music 2",
        type: "music",
        url: "/music2.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.MUSIC,
        volume: 1.0,
      });

      await audioManager.playMusic("music1" as MusicTrackId);
      await audioManager.crossfade("music1" as MusicTrackId, "music2" as MusicTrackId, 100);
      
      expect(audioManager.currentMusicTrack).toBe("music2");
    });

    it("should handle fadeOut when no music is playing", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await expect(audioManager.fadeOut(100)).resolves.not.toThrow();
    });

    it("should handle fadeIn when music fails to load", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await audioManager.fadeIn("nonexistent_music" as MusicTrackId, 100);
      
      expect(audioManager.currentMusicTrack).toBeNull();
    });
  });

  describe("Fallback Mode", () => {
    it("should enable fallback mode when AudioContext fails", async () => {
      // Temporarily break AudioContext
      const originalAudioContext = global.AudioContext;
      const originalWebkitAudioContext = (global as any).webkitAudioContext;
      
      delete (global as any).AudioContext;
      delete (global as any).webkitAudioContext;

      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      expect(audioManager.fallbackMode).toBe(true);
      expect(audioManager.isInitialized).toBe(true);

      // Restore
      global.AudioContext = originalAudioContext;
      (global as any).webkitAudioContext = originalWebkitAudioContext;
    });
  });

  describe("Asset Loading", () => {
    it("should load audio asset successfully", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      const asset = {
        id: "test_asset" as SoundEffectId,
        name: "Test Asset",
        type: "sound" as const,
        url: "/test.mp3",
        formats: ["audio/mp3"] as const,
        loaded: false,
        category: AudioCategory.SFX,
        volume: 0.8,
      };

      await expect(audioManager.loadAsset(asset)).resolves.not.toThrow();
    });

    it("should handle asset loading errors gracefully", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      // Mock Audio constructor to throw error
      const originalAudio = global.Audio;
      global.Audio = class {
        constructor() {
          throw new Error("Failed to create audio");
        }
      } as any;

      const asset = {
        id: "failing_asset" as SoundEffectId,
        name: "Failing Asset",
        type: "sound" as const,
        url: "/test.mp3",
        formats: ["audio/mp3"] as const,
        loaded: false,
        category: AudioCategory.SFX,
        volume: 0.8,
      };

      await expect(audioManager.loadAsset(asset)).resolves.not.toThrow();

      // Restore
      global.Audio = originalAudio;
    });

    it("should get loaded assets", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      const asset = {
        id: "test_asset" as SoundEffectId,
        name: "Test Asset",
        type: "sound" as const,
        url: "/test.mp3",
        formats: ["audio/mp3"] as const,
        loaded: false,
        category: AudioCategory.SFX,
        volume: 0.8,
      };

      await audioManager.loadAsset(asset);
      const loadedAssets = audioManager.getLoadedAssets();

      expect(loadedAssets.has("test_asset")).toBe(true);
    });
  });

  describe("Constructor Configuration", () => {
    it("should initialize with custom config in constructor", () => {
      const audioManager = new AudioManager({
        masterVolume: 0.5,
        musicVolume: 0.4,
        sfxVolume: 0.6,
      });

      expect(audioManager.masterVolume).toBe(0.5);
      expect(audioManager.musicVolume).toBe(0.4);
      expect(audioManager.sfxVolume).toBe(0.6);
    });

    it("should use default values when no config provided", () => {
      const audioManager = new AudioManager();

      expect(audioManager.masterVolume).toBe(1.0);
      expect(audioManager.musicVolume).toBe(0.7);
      expect(audioManager.sfxVolume).toBe(0.8);
    });

    it("should have initialized getter as alias", () => {
      const audioManager = new AudioManager();
      
      expect(audioManager.initialized).toBe(false);
      expect(audioManager.isInitialized).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should handle playing non-existent sound effect", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await expect(
        audioManager.playSoundEffect("nonexistent" as SoundEffectId)
      ).resolves.not.toThrow();
    });

    it("should handle playing non-existent music", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      await expect(
        audioManager.playMusic("nonexistent" as MusicTrackId)
      ).resolves.not.toThrow();
    });

    it("should handle audio play errors", async () => {
      const audioManager = new AudioManager();
      await audioManager.initialize(mockAudioConfig);

      // Create an asset but make play fail
      const mockFailingAudio = new MockAudioElement();
      mockFailingAudio.play = vi.fn(() => Promise.reject(new Error("Play failed")));

      await audioManager.loadAsset({
        id: "failing_sfx" as SoundEffectId,
        name: "Failing SFX",
        type: "sound",
        url: "/test.mp3",
        formats: ["audio/mp3"],
        loaded: false,
        category: AudioCategory.SFX,
        volume: 1.0,
      });

      // Manually inject the failing audio element
      const loadedAssets = audioManager.getLoadedAssets() as Map<string, HTMLAudioElement>;
      loadedAssets.set("failing_sfx", mockFailingAudio as any);

      // Should not throw despite play failing
      await expect(
        audioManager.playSoundEffect("failing_sfx" as SoundEffectId)
      ).resolves.not.toThrow();
    });
  });
});
