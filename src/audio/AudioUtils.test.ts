import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioUtils } from "./AudioUtils";
import type { AudioFormat } from "../types/audio";

// Enhanced mock Audio constructor for testing
const createMockAudio = (canPlayResponse: string = "probably") => {
  return {
    canPlayType: vi.fn().mockReturnValue(canPlayResponse),
    play: vi.fn(() => Promise.resolve()),
    pause: vi.fn(),
    load: vi.fn(),
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
  };
};

/**
 * ## Audio Utilities Test Suite
 *
 * **Business Purpose:**
 * Validates audio utility functions that support Korean martial arts
 * immersive audio experience and cultural sound design.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
describe("AudioUtils", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock Audio constructor with proper format support
    global.Audio = vi.fn().mockImplementation(() => {
      const mockAudio = createMockAudio();

      // Enhanced mock to properly support different formats
      mockAudio.canPlayType = vi.fn((type: string) => {
        if (type === "audio/mp3" || type === "audio/mpeg") return "probably";
        if (type === "audio/wav") return "maybe";
        if (type === "audio/ogg") return "maybe";
        if (type === "audio/webm") return ""; // Not supported by default
        return "";
      });

      return mockAudio;
    }) as any;
  });

  describe("selectAudioFormat", () => {
    it("should return null when no formats are available", () => {
      const result = AudioUtils.selectAudioFormat([]);
      expect(result).toBeNull();
    });

    it("should return the preferred format when available", () => {
      const available: AudioFormat[] = ["audio/wav", "audio/mp3"];
      const preferred: AudioFormat[] = ["audio/mp3", "audio/wav"];
      const result = AudioUtils.selectAudioFormat(available, preferred);
      expect(result).toBe("audio/mp3"); // mp3 should be selected as it's preferred and supported
    });

    it("should return mp3 when both formats are available", () => {
      const available: AudioFormat[] = ["audio/webm", "audio/mp3"];
      const result = AudioUtils.selectAudioFormat(available);
      expect(result).toBe("audio/mp3"); // mp3 is supported, webm is not
    });

    it("should return the first available format when preferred is not available", () => {
      const available: AudioFormat[] = ["audio/mp3"];
      const preferred: AudioFormat[] = ["audio/wav"];
      const result = AudioUtils.selectAudioFormat(available, preferred);
      expect(result).toBe("audio/mp3");
    });

    it("should handle empty preferred formats", () => {
      const available: AudioFormat[] = ["audio/mp3"];
      const result = AudioUtils.selectAudioFormat(available, []);
      expect(result).toBe("audio/mp3");
    });

    it("should prioritize formats correctly", () => {
      const available: AudioFormat[] = ["audio/mp3", "audio/wav"];
      const preferred: AudioFormat[] = ["audio/wav", "audio/mp3"];
      const result = AudioUtils.selectAudioFormat(available, preferred);
      // Should return wav since it's preferred and available
      expect(result).toBe("audio/wav");
    });

    it("should return null when no match is found", () => {
      const available: AudioFormat[] = ["audio/webm" as AudioFormat];
      const result = AudioUtils.selectAudioFormat(available);
      expect(result).toBeNull();
    });
  });

  describe("canPlayType", () => {
    it("should return true for supported audio types", () => {
      expect(AudioUtils.canPlayType("audio/mp3")).toBe(true); // mp3 is supported
    });

    it("should return false for unsupported audio types", () => {
      expect(AudioUtils.canPlayType("audio/webm")).toBe(false); // webm not supported in mock
    });
  });

  describe("getPreferredFormat", () => {
    it("should return mp3 URL if mp3 is supported", () => {
      const available: AudioFormat[] = ["audio/webm", "audio/mp3"];
      const basePath = "assets/audio/sfx/test_sound";
      const urls = AudioUtils.getPreferredFormat(available, basePath);
      expect(urls).toEqual([`${basePath}.mp3`]); // mp3 should be selected
    });

    it("should return mp3 URL if only mp3 is supported", () => {
      const available: AudioFormat[] = ["audio/mp3"];
      const basePath = "assets/audio/sfx/test_sound";
      const urls = AudioUtils.getPreferredFormat(available, basePath);
      expect(urls).toEqual([`${basePath}.mp3`]);
    });

    it("should fallback to first format if none supported", () => {
      const available: AudioFormat[] = ["audio/webm"];
      const basePath = "assets/audio/sfx/test_sound";
      const urls = AudioUtils.getPreferredFormat(available, basePath);
      expect(urls).toEqual([`${basePath}.webm`]);
    });
  });

  describe("clampVolume", () => {
    it("should clamp volume to valid range", () => {
      expect(AudioUtils.clampVolume(-0.5)).toBe(0);
      expect(AudioUtils.clampVolume(0.5)).toBe(0.5);
      expect(AudioUtils.clampVolume(1.5)).toBe(1);
    });
  });

  describe("Format Detection", () => {
    it("should detect supported audio formats", () => {
      const result = AudioUtils.canPlayType("audio/mp3");
      expect(result).toBe(true); // mp3 is supported in our mock
    });

    it("should get best format for browser", () => {
      const available: AudioFormat[] = ["audio/wav", "audio/mp3"];
      const bestFormat = AudioUtils.selectAudioFormat(available);
      expect(bestFormat).toBe("audio/mp3"); // mp3 should be preferred
    });

    it("should handle multiple format options", () => {
      const formats: AudioFormat[] = ["audio/webm", "audio/mp3", "audio/wav"];
      const result = AudioUtils.selectAudioFormat(formats);
      expect(result).toBe("audio/mp3"); // mp3 is supported and preferred
    });

    it("should validate format compatibility", () => {
      const metadata = AudioUtils.getBestFormatMetadata(["audio/mp3"]);
      expect(metadata.supported).toBe(true); // mp3 is supported
      expect(metadata.format).toBe("audio/mp3");
    });

    it("should get format metadata through selectAudioFormat", () => {
      const formats: AudioFormat[] = ["audio/mp3", "audio/wav"];
      const metadata = AudioUtils.getBestFormatMetadata(formats);
      expect(metadata.format).toBe("audio/mp3"); // mp3 should be preferred
    });
  });

  it("should validate audio file formats", () => {
    expect(AudioUtils.isValidAudioFormat("test.mp3")).toBe(true);
    expect(AudioUtils.isValidAudioFormat("test.webm")).toBe(true);
    expect(AudioUtils.isValidAudioFormat("test.txt")).toBe(false);
  });

  it("should generate Korean martial arts sound variations", () => {
    const variations = AudioUtils.generateSoundVariations("technique_hit");
    expect(variations.length).toBeGreaterThan(1);
    expect(variations[0]).toMatch(/technique_hit_\d+/);
  });

  it("should calculate audio fade curves", () => {
    const curve = AudioUtils.calculateFadeCurve(1000, "exponential");
    expect(curve.length).toBeGreaterThan(0);
    expect(curve[0]).toBe(1.0);
    expect(curve[curve.length - 1]).toBe(0.0);
  });
});
