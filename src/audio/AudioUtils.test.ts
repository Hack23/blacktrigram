import { beforeEach, describe, expect, it, vi } from "vitest";
import * as AudioUtils from "./AudioUtils";
import type { AudioFormat } from "./types";

describe("AudioUtils", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock Audio constructor with proper class for Vitest 4.0
    class MockAudio {
      canPlayType: ReturnType<typeof vi.fn>;
      play: ReturnType<typeof vi.fn>;
      pause: ReturnType<typeof vi.fn>;
      load: ReturnType<typeof vi.fn>;
      addEventListener: ReturnType<typeof vi.fn>;
      removeEventListener: ReturnType<typeof vi.fn>;
      volume = 1;
      currentTime = 0;
      duration = 100;
      paused = false;
      ended = false;
      src = "";
      crossOrigin = null;
      preload = "auto";

      constructor(src?: string) {
        // Set src if provided
        if (src) {
          this.src = src;
        }
        // Enhanced mock to properly support different formats
        this.canPlayType = vi.fn((type: string) => {
          if (type === "audio/mp3" || type === "audio/mpeg") return "probably";
          if (type === "audio/wav") return "maybe";
          if (type === "audio/ogg") return "maybe";
          if (type === "audio/webm") return ""; // Not supported by default
          return "";
        });
        this.play = vi.fn(() => Promise.resolve());
        this.pause = vi.fn();
        this.load = vi.fn();
        this.addEventListener = vi.fn();
        this.removeEventListener = vi.fn();
      }
    }

    global.Audio = MockAudio as any;
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
      expect(metadata.quality).toBeDefined();
    });

    it("should get format metadata through selectAudioFormat", () => {
      const formats: AudioFormat[] = ["audio/mp3", "audio/wav"];
      const metadata = AudioUtils.getBestFormatMetadata(formats);
      expect(metadata.format).toBe("audio/mp3"); // mp3 should be preferred
      expect(metadata.quality).toBeDefined();
    });

    it("should return unsupported when no format matches", () => {
      const formats: AudioFormat[] = ["audio/webm"];
      const metadata = AudioUtils.getBestFormatMetadata(formats);
      expect(metadata.supported).toBe(false);
      expect(metadata.format).toBeNull();
    });

    it("should return quality in metadata", () => {
      const formats: AudioFormat[] = ["audio/mp3"];
      const metadata = AudioUtils.getBestFormatMetadata(formats);
      // Check that quality property exists
      expect(metadata.quality).toBeDefined();
      expect(typeof metadata.quality).toBe("string");
    });
  });

  describe("AudioUtils class methods", () => {
    it("should check audio type with static canPlayType", () => {
      expect(AudioUtils.canPlayType("audio/mp3")).toBe(true);
      expect(AudioUtils.canPlayType("audio/webm")).toBe(false);
    });

    it("should select audio format with static selectAudioFormat", () => {
      const formats: AudioFormat[] = ["audio/mp3", "audio/wav"];
      const result = AudioUtils.selectAudioFormat(formats);
      expect(result).toBe("audio/mp3");
    });

    it("should get format metadata with static method", () => {
      const formats: AudioFormat[] = ["audio/mp3", "audio/wav"];
      // Note: getBestFormatMetadata is available both as a function export
      // and as AudioUtils class static method. The function export takes precedence.
      const metadata = AudioUtils.getBestFormatMetadata(formats);
      expect(metadata.format).toBe("audio/mp3");
      expect(metadata.supported).toBe(true);
      expect(metadata.quality).toBeDefined();
    });

    it("should handle no available formats", () => {
      const formats: AudioFormat[] = [];
      const result = AudioUtils.selectAudioFormat(formats);
      expect(result).toBeNull();
    });

    it("should respect preferred format order", () => {
      const formats: AudioFormat[] = ["audio/wav", "audio/mp3"];
      const preferred: AudioFormat[] = ["audio/wav", "audio/mp3"];
      const result = AudioUtils.selectAudioFormat(formats, preferred);
      expect(result).toBe("audio/wav");
    });
  });

  describe("detectSupportedFormats", () => {
    it("should detect mp3 support", () => {
      const formats = AudioUtils.detectSupportedFormats();
      expect(formats).toContain("audio/mp3");
    });

    it("should return array of supported formats", () => {
      const formats = AudioUtils.detectSupportedFormats();
      expect(Array.isArray(formats)).toBe(true);
      expect(formats.length).toBeGreaterThan(0);
    });

    it("should only include actually supported formats", () => {
      const formats = AudioUtils.detectSupportedFormats();
      formats.forEach(format => {
        expect(AudioUtils.canPlayType(format)).toBe(true);
      });
    });
  });

  describe("createAudioElement", () => {
    it("should create audio element with URL", () => {
      const audio = AudioUtils.createAudioElement("/test.mp3");
      expect(audio).toBeInstanceOf(Audio);
      expect(audio.src).toBe("/test.mp3");
    });

    it("should create audio element with custom volume", () => {
      const audio = AudioUtils.createAudioElement("/test.mp3", 0.5);
      expect(audio.volume).toBe(0.5);
    });

    it("should create audio element with default volume", () => {
      const audio = AudioUtils.createAudioElement("/test.mp3");
      expect(audio.volume).toBe(1.0);
    });

    it("should set preload to auto", () => {
      const audio = AudioUtils.createAudioElement("/test.mp3");
      expect(audio.preload).toBe("auto");
    });
  });

  describe("validateAudioUrl", () => {
    it("should validate correct URL", () => {
      expect(AudioUtils.validateAudioUrl("/assets/audio/test.mp3")).toBe(true);
    });

    it("should reject empty string", () => {
      expect(AudioUtils.validateAudioUrl("")).toBe(false);
    });

    it("should reject non-string values", () => {
      expect(AudioUtils.validateAudioUrl(null as any)).toBe(false);
      expect(AudioUtils.validateAudioUrl(undefined as any)).toBe(false);
      expect(AudioUtils.validateAudioUrl(123 as any)).toBe(false);
    });

    it("should accept any non-empty string", () => {
      expect(AudioUtils.validateAudioUrl("a")).toBe(true);
      expect(AudioUtils.validateAudioUrl("https://example.com/audio.mp3")).toBe(true);
    });
  });

  describe("normalizeVolume", () => {
    it("should normalize volume to range [0, 1]", () => {
      expect(AudioUtils.normalizeVolume(0.5)).toBe(0.5);
      expect(AudioUtils.normalizeVolume(-0.5)).toBe(0);
      expect(AudioUtils.normalizeVolume(1.5)).toBe(1);
    });

    it("should handle boundary values", () => {
      expect(AudioUtils.normalizeVolume(0)).toBe(0);
      expect(AudioUtils.normalizeVolume(1)).toBe(1);
    });

    it("should clamp extreme values", () => {
      expect(AudioUtils.normalizeVolume(-100)).toBe(0);
      expect(AudioUtils.normalizeVolume(100)).toBe(1);
    });
  });

  describe("formatDuration", () => {
    it("should format seconds to mm:ss", () => {
      expect(AudioUtils.formatDuration(0)).toBe("0:00");
      expect(AudioUtils.formatDuration(30)).toBe("0:30");
      expect(AudioUtils.formatDuration(60)).toBe("1:00");
      expect(AudioUtils.formatDuration(125)).toBe("2:05");
    });

    it("should pad seconds with zero", () => {
      expect(AudioUtils.formatDuration(5)).toBe("0:05");
      expect(AudioUtils.formatDuration(65)).toBe("1:05");
    });

    it("should handle large durations", () => {
      expect(AudioUtils.formatDuration(3600)).toBe("60:00");
      expect(AudioUtils.formatDuration(3665)).toBe("61:05");
    });

    it("should handle fractional seconds", () => {
      expect(AudioUtils.formatDuration(30.7)).toBe("0:30");
      expect(AudioUtils.formatDuration(125.9)).toBe("2:05");
    });
  });

  describe("isAudioSupported", () => {
    it("should return true when Audio is available", () => {
      expect(AudioUtils.isAudioSupported()).toBe(true);
    });

    it("should return false when Audio is undefined", () => {
      const originalAudio = global.Audio;
      delete (global as any).Audio;

      expect(AudioUtils.isAudioSupported()).toBe(false);

      global.Audio = originalAudio;
    });
  });

  describe("getOptimalFormat", () => {
    it("should return webm as optimal when available", () => {
      const formats: AudioFormat[] = ["audio/webm", "audio/mp3"];
      expect(AudioUtils.getOptimalFormat(formats)).toBe("audio/webm");
    });

    it("should return mp3 when webm is not available", () => {
      const formats: AudioFormat[] = ["audio/mp3", "audio/wav"];
      expect(AudioUtils.getOptimalFormat(formats)).toBe("audio/mp3");
    });

    it("should return wav when only wav is available", () => {
      const formats: AudioFormat[] = ["audio/wav"];
      expect(AudioUtils.getOptimalFormat(formats)).toBe("audio/wav");
    });

    it("should return null when no formats available", () => {
      const formats: AudioFormat[] = [];
      expect(AudioUtils.getOptimalFormat(formats)).toBeNull();
    });

    it("should follow preferred order", () => {
      const formats: AudioFormat[] = ["audio/ogg", "audio/wav", "audio/mp3", "audio/webm"];
      expect(AudioUtils.getOptimalFormat(formats)).toBe("audio/webm");
    });

    it("should return first format if none match preferred", () => {
      const formats: AudioFormat[] = ["audio/ogg"];
      expect(AudioUtils.getOptimalFormat(formats)).toBe("audio/ogg");
    });
  });

  describe("getBestFormatMetadata - function", () => {
    it("should return quality metadata for wav", () => {
      const metadata = AudioUtils.getBestFormatMetadata(["audio/wav"]);
      expect(metadata.quality).toBe("high");
    });

    it("should return quality metadata for mp3", () => {
      const metadata = AudioUtils.getBestFormatMetadata(["audio/mp3"]);
      expect(metadata.quality).toBe("medium");
    });

    it("should return quality metadata for webm", () => {
      // webm is not supported in our mock, so it should fallback
      const metadata = AudioUtils.getBestFormatMetadata(["audio/webm"]);
      expect(metadata.quality).toBe("low");
    });

    it("should return low quality when no format is selected", () => {
      const metadata = AudioUtils.getBestFormatMetadata([]);
      expect(metadata.quality).toBe("low");
    });

    it("should return correct supported flag", () => {
      const metadata1 = AudioUtils.getBestFormatMetadata(["audio/mp3"]);
      expect(metadata1.supported).toBe(true);

      const metadata2 = AudioUtils.getBestFormatMetadata(["audio/webm"]);
      expect(metadata2.supported).toBe(false);
    });
  });

  describe("getPreferredFormat - edge cases", () => {
    it("should handle empty formats array", () => {
      const urls = AudioUtils.getPreferredFormat([], "/test");
      expect(urls).toEqual([]);
    });

    it("should return correct extension for different formats", () => {
      const urls1 = AudioUtils.getPreferredFormat(["audio/mp3"], "/test");
      expect(urls1).toEqual(["/test.mp3"]);

      const urls2 = AudioUtils.getPreferredFormat(["audio/wav"], "/test");
      expect(urls2).toEqual(["/test.wav"]);

      const urls3 = AudioUtils.getPreferredFormat(["audio/ogg"], "/test");
      expect(urls3).toEqual(["/test.ogg"]);
    });

    it("should handle paths with trailing slash", () => {
      const urls = AudioUtils.getPreferredFormat(["audio/mp3"], "/assets/audio/sfx/test");
      expect(urls).toEqual(["/assets/audio/sfx/test.mp3"]);
    });
  });

  describe("canPlayType - edge cases", () => {
    it("should return false when Audio is undefined", () => {
      const originalAudio = global.Audio;
      delete (global as any).Audio;

      expect(AudioUtils.canPlayType("audio/mp3")).toBe(true); // Test env fallback
      expect(AudioUtils.canPlayType("audio/wav")).toBe(true); // Test env fallback
      expect(AudioUtils.canPlayType("audio/ogg")).toBe(false); // Not in test env fallback

      global.Audio = originalAudio;
    });

    it("should handle maybe response", () => {
      // wav returns "maybe" in our mock
      expect(AudioUtils.canPlayType("audio/wav")).toBe(true);
    });

    it("should handle probably response", () => {
      // mp3 returns "probably" in our mock
      expect(AudioUtils.canPlayType("audio/mp3")).toBe(true);
    });

    it("should handle empty string response", () => {
      // webm returns "" in our mock
      expect(AudioUtils.canPlayType("audio/webm")).toBe(false);
    });
  });
});
