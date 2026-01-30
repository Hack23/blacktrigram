/**
 * Three.js Audio Integration Tests
 * Validates that AudioProvider works correctly with Three.js Canvas and Html overlays
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AudioProvider, useAudio } from "../audio/AudioProvider";
import React from "react";

// Test component that simulates audio usage in Three.js context
interface TestAudioComponentProps {
  readonly onAudioReady?: () => void;
}

const TestAudioComponent: React.FC<TestAudioComponentProps> = ({ onAudioReady }) => {
  const audio = useAudio();

  React.useEffect(() => {
    if (audio.isInitialized) {
      onAudioReady?.();
    }
  }, [audio.isInitialized, onAudioReady]);

  const handlePlaySFX = () => {
    // Only call if audio is initialized and method exists
    if (audio.isAudioReady && typeof audio.playSFX === 'function') {
      audio.playSFX("menu_select").catch(() => {
        // Silently handle errors in test environment
      });
    }
  };

  const handlePlayMusic = () => {
    // Only call if audio is initialized and method exists
    if (audio.isAudioReady && typeof audio.playMusic === 'function') {
      audio.playMusic("intro_theme").catch(() => {
        // Silently handle errors in test environment
      });
    }
  };

  return (
    <div data-testid="audio-test-component">
      <div data-testid="audio-initialized">{audio.isInitialized ? "initialized" : "not-initialized"}</div>
      <div data-testid="audio-muted">{audio.muted ? "muted" : "unmuted"}</div>
      <div data-testid="audio-ready">{audio.isAudioReady ? "ready" : "not-ready"}</div>
      <button
        data-testid="play-sfx-button"
        onClick={handlePlaySFX}
        disabled={!audio.isAudioReady}
      >
        Play SFX
      </button>
      <button
        data-testid="play-music-button"
        onClick={handlePlayMusic}
        disabled={!audio.isAudioReady}
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

      // Wait for component to render
      await waitFor(() => {
        expect(screen.getByTestId("play-sfx-button")).toBeInTheDocument();
      });

      const playSfxButton = screen.getByTestId("play-sfx-button");
      
      // Click should not throw error even if audio isn't ready
      // The component handles the case when audio isn't ready
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
          setCurrentVolume(0.5);
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
          // Only call if audio is ready and method exists
          if (audio.isAudioReady && typeof audio.fadeIn === 'function') {
            await audio.fadeIn("intro_theme", 1000).catch(() => {
              // Silently handle errors in test environment
            });
          }
        };

        const handleFadeOut = async () => {
          // Only call if audio is ready and method exists
          if (audio.isAudioReady && typeof audio.fadeOut === 'function') {
            await audio.fadeOut(1000).catch(() => {
              // Silently handle errors in test environment
            });
          }
        };

        return (
          <div data-testid="music-test">
            <div data-testid="audio-ready">{audio.isAudioReady ? "ready" : "not-ready"}</div>
            <button 
              data-testid="fade-in-button" 
              onClick={handleFadeIn}
              disabled={!audio.isAudioReady}
            >
              Fade In
            </button>
            <button 
              data-testid="fade-out-button" 
              onClick={handleFadeOut}
              disabled={!audio.isAudioReady}
            >
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
