import { describe, it, expect, beforeEach } from "vitest";
import {
  setAssetBasePath,
  getAssetBasePath,
  resolveAssetPath,
} from "./assetConfig";

describe("assetConfig", () => {
  beforeEach(() => {
    // Reset to default (empty) base path
    setAssetBasePath("");
  });

  describe("getAssetBasePath", () => {
    it("returns empty string by default", () => {
      expect(getAssetBasePath()).toBe("");
    });

    it("returns configured base path", () => {
      setAssetBasePath("https://cdn.example.com");
      expect(getAssetBasePath()).toBe("https://cdn.example.com");
    });
  });

  describe("setAssetBasePath", () => {
    it("sets the base path", () => {
      setAssetBasePath("/my-app");
      expect(getAssetBasePath()).toBe("/my-app");
    });

    it("strips trailing slashes", () => {
      setAssetBasePath("https://cdn.example.com/");
      expect(getAssetBasePath()).toBe("https://cdn.example.com");
    });

    it("strips multiple trailing slashes", () => {
      setAssetBasePath("/base///");
      expect(getAssetBasePath()).toBe("/base");
    });
  });

  describe("resolveAssetPath", () => {
    it("returns path unchanged when no base path set", () => {
      expect(resolveAssetPath("/assets/audio/music/intro_theme.mp3")).toBe(
        "/assets/audio/music/intro_theme.mp3",
      );
    });

    it("normalizes missing leading slash when no base path set", () => {
      expect(resolveAssetPath("assets/audio/music/intro_theme.mp3")).toBe(
        "/assets/audio/music/intro_theme.mp3",
      );
    });

    it("prepends base path", () => {
      setAssetBasePath("https://cdn.example.com");
      expect(resolveAssetPath("/assets/audio/music/intro_theme.mp3")).toBe(
        "https://cdn.example.com/assets/audio/music/intro_theme.mp3",
      );
    });

    it("handles relative base paths", () => {
      setAssetBasePath("/my-app");
      expect(resolveAssetPath("/assets/visual/logo/black-trigram.png")).toBe(
        "/my-app/assets/visual/logo/black-trigram.png",
      );
    });

    it("normalizes paths without leading slash", () => {
      setAssetBasePath("https://cdn.example.com");
      expect(resolveAssetPath("assets/audio/music/intro_theme.mp3")).toBe(
        "https://cdn.example.com/assets/audio/music/intro_theme.mp3",
      );
    });
  });
});
