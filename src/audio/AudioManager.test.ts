import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioManager } from "./AudioManager";
import type { AudioConfig, SoundEffectId, MusicTrackId } from "../types/audio";
import { AudioCategory } from "../types/audio";

// Enhanced mock for HTML Audio Element
const createMockHTMLAudioElement = () => ({
  play: vi.fn(() => Promise.resolve()),
  pause: vi.fn(),
  load: vi.fn(),
  canPlayType: vi.fn((type: string) => {
    if (type.includes("mp3")) return "probably";
    if (type.includes("wav")) return "maybe";
    return "";
  }),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  volume: 1,
  currentTime: 0,
  duration: 100,
  paused: false,
  ended: false,
  src: "",
  crossOrigin: null,
  preload: "auto",
  onended: null,
  onerror: null,
  onloadeddata: null,
});

// Mock Web Audio API
const mockAudioContext = {
  createBuffer: vi.fn(),
  createBufferSource: vi.fn(),
  createGain: vi.fn(),
  destination: {},
  sampleRate: 44100,
};

// Mock global Audio constructor
global.Audio = vi.fn(() => createMockHTMLAudioElement()) as any;
global.AudioContext = vi.fn(() => mockAudioContext) as any;
(global as any).webkitAudioContext = vi.fn(() => mockAudioContext);

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
});
