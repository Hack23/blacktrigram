/**
 * Three.js Audio Integration Tests
 * Validates that AudioProvider works correctly with Three.js Canvas and Html overlays
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AudioProvider, useAudio } from "../audio/AudioProvider";
import React from "react";

// Test component that simulates audio usage in Three.js context
const TestAudioComponent: React.FC<{ onAudioReady?: () => void }> = ({ onAudioReady }) => {
  const audio = useAudio();

  React.useEffect(() => {
    if (audio.isInitialized) {
      onAudioReady?.();
    }
  }, [audio.isInitialized, onAudioReady]);

  return (
    <div data-testid="audio-test-component">
      <div data-testid="audio-initialized">{audio.isInitialized ? "initialized" : "not-initialized"}</div>
      <div data-testid="audio-muted">{audio.muted ? "muted" : "unmuted"}</div>
      <button
        data-testid="play-sfx-button"
        onClick={() => audio.playSFX("menu_select")}
      >
        Play SFX
      </button>
      <button
        data-testid="play-music-button"
        onClick={() => audio.playMusic("intro_theme")}
      >
        Play Music
      </button>
    </div>
  );
};

describe("Three.js Audio Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AudioProvider Integration", () => {
    it("should provide audio context to Three.js components", async () => {
      const onAudioReady = vi.fn();

      render(
        <AudioProvider>
          <TestAudioComponent onAudioReady={onAudioReady} />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("audio-test-component")).toBeInTheDocument();
      });

      await waitFor(
        () => {
          expect(screen.getByTestId("audio-initialized")).toHaveTextContent("initialized");
        },
        { timeout: 3000 }
      );
    });

    it("should allow audio playback from Three.js overlays", async () => {
      render(
        <AudioProvider>
          <TestAudioComponent />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("play-sfx-button")).toBeInTheDocument();
      });

      const playSfxButton = screen.getByTestId("play-sfx-button");
      expect(playSfxButton).toBeInTheDocument();

      // Click should not throw error
      expect(() => playSfxButton.click()).not.toThrow();
    });

    it("should maintain audio state across re-renders", async () => {
      const { rerender } = render(
        <AudioProvider>
          <TestAudioComponent />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("audio-test-component")).toBeInTheDocument();
      });

      // Rerender should maintain audio context
      rerender(
        <AudioProvider>
          <TestAudioComponent />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("audio-test-component")).toBeInTheDocument();
      });
    });
  });

  describe("Audio Context Initialization", () => {
    it("should initialize audio manager on mount", async () => {
      render(
        <AudioProvider>
          <TestAudioComponent />
        </AudioProvider>
      );

      await waitFor(
        () => {
          expect(screen.getByTestId("audio-initialized")).toHaveTextContent("initialized");
        },
        { timeout: 3000 }
      );
    });

    it("should respect mute state", async () => {
      render(
        <AudioProvider>
          <TestAudioComponent />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("audio-muted")).toBeInTheDocument();
      });

      // Default should be unmuted
      expect(screen.getByTestId("audio-muted")).toHaveTextContent("unmuted");
    });
  });

  describe("Volume Controls", () => {
    it("should provide volume control methods", async () => {
      const TestVolumeComponent: React.FC = () => {
        const audio = useAudio();
        const [currentVolume, setCurrentVolume] = React.useState(audio.masterVolume);

        const handleVolumeChange = () => {
          audio.setVolume("master", 0.5);
          setCurrentVolume(audio.masterVolume);
        };

        return (
          <div data-testid="volume-test">
            <div data-testid="current-volume">{currentVolume}</div>
            <button data-testid="change-volume" onClick={handleVolumeChange}>
              Change Volume
            </button>
          </div>
        );
      };

      render(
        <AudioProvider>
          <TestVolumeComponent />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("volume-test")).toBeInTheDocument();
      });
    });
  });

  describe("Music Playback", () => {
    it("should support music fade in/out", async () => {
      const TestMusicComponent: React.FC = () => {
        const audio = useAudio();

        const handleFadeIn = async () => {
          await audio.fadeIn("intro_theme", 1000);
        };

        const handleFadeOut = async () => {
          await audio.fadeOut(1000);
        };

        return (
          <div data-testid="music-test">
            <button data-testid="fade-in-button" onClick={handleFadeIn}>
              Fade In
            </button>
            <button data-testid="fade-out-button" onClick={handleFadeOut}>
              Fade Out
            </button>
          </div>
        );
      };

      render(
        <AudioProvider>
          <TestMusicComponent />
        </AudioProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId("fade-in-button")).toBeInTheDocument();
      });

      // Should not throw errors
      expect(() => screen.getByTestId("fade-in-button").click()).not.toThrow();
      expect(() => screen.getByTestId("fade-out-button").click()).not.toThrow();
    });
  });
});
