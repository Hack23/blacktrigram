import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioUtils } from "../AudioUtils";
import type { AudioFormat } from "../../types/audio";

// Mock HTMLAudioElement
const mockCanPlayType = vi.fn();
Object.defineProperty(HTMLAudioElement.prototype, "canPlayType", {
  value: mockCanPlayType,
  writable: true,
});

describe("AudioUtils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCanPlayType.mockReturnValue("probably");
  });

  describe("selectAudioFormat", () => {
    const preferredOrder: readonly AudioFormat[] = ["webm", "mp3"];

    it("should return null if availableFormats is empty", () => {
      mockCanPlayType.mockReturnValue("probably");
      const format = AudioUtils.selectAudioFormat([], preferredOrder);
      expect(format).toBeNull();
    });

    it("should handle mpeg for mp3", () => {
      mockCanPlayType.mockImplementation((type: string) =>
        type === "audio/mpeg" ? "probably" : ""
      );
      const format = AudioUtils.selectAudioFormat(["mp3"], ["mp3"]);
      expect(format).toBe("mp3");
    });

    it("should return preferred format when available and supported", () => {
      mockCanPlayType.mockReturnValue("probably");
      const availableFormats: readonly AudioFormat[] = ["mp3", "webm"];
      const format = AudioUtils.selectAudioFormat(availableFormats, [
        "webm",
        "mp3",
      ]);
      expect(format).toBe("webm");
    });

    it("should fallback to supported format even if not preferred", () => {
      mockCanPlayType.mockImplementation((type: string) =>
        type === "audio/mpeg" ? "probably" : ""
      );
      const availableFormats: readonly AudioFormat[] = ["webm", "mp3"];
      const format = AudioUtils.selectAudioFormat(availableFormats, ["webm"]);
      expect(format).toBe("mp3");
    });
  });

  describe("getPreferredFormat", () => {
    const available: readonly AudioFormat[] = ["webm", "mp3"];
    const basePath = "assets/audio/sfx/test_sound";

    it("should return webm URL if webm is supported", () => {
      vi.spyOn(AudioUtils, "selectAudioFormat").mockReturnValue("webm");
      const urls = AudioUtils.getPreferredFormat(available, basePath);
      expect(urls).toEqual([`${basePath}.webm`]);
    });

    it("should return mp3 URL if only mp3 is supported", () => {
      vi.spyOn(AudioUtils, "selectAudioFormat").mockReturnValue("mp3");
      const urls = AudioUtils.getPreferredFormat(available, basePath);
      expect(urls).toEqual([`${basePath}.mp3`]);
    });

    it("should fallback to first format if none supported", () => {
      vi.spyOn(AudioUtils, "selectAudioFormat").mockReturnValue(null);
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

  describe("canPlayType", () => {
    it("should return true for supported formats", () => {
      mockCanPlayType.mockReturnValue("probably");
      expect(AudioUtils.canPlayType("audio/webm")).toBe(true);
    });

    it("should return false for unsupported formats", () => {
      mockCanPlayType.mockReturnValue("");
      expect(AudioUtils.canPlayType("audio/webm")).toBe(false);
    });
  });
});
