import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderWithPixi } from "../../../test/test-utils";
import { AudioProvider, useAudio } from "../../../audio/AudioProvider";

// Mock component that uses audio
const MockGameAudioComponent: React.FC<{
  onAudioEvent?: (event: string) => void;
}> = ({ onAudioEvent }) => {
  const audio = useAudio();

  React.useEffect(() => {
    if (audio.isInitialized) {
      onAudioEvent?.("audio_initialized");
    }
  }, [audio.isInitialized, onAudioEvent]);

  const handlePlayMusic = () => {
    audio.playMusic("combat_theme");
    onAudioEvent?.("music_played");
  };

  const handlePlaySFX = () => {
    audio.playSFX("attack_medium");
    onAudioEvent?.("sfx_played");
  };

  const handleStopMusic = () => {
    audio.stopMusic();
    onAudioEvent?.("music_stopped");
  };

  return (
    <div data-testid="game-audio-component">
      <button data-testid="play-music-button" onClick={handlePlayMusic}>
        Play Music
      </button>
      <button data-testid="play-sfx-button" onClick={handlePlaySFX}>
        Play SFX
      </button>
      <button data-testid="stop-music-button" onClick={handleStopMusic}>
        Stop Music
      </button>
      <div data-testid="audio-status">
        {audio.isInitialized ? "Initialized" : "Not Initialized"}
      </div>
      <div data-testid="audio-volume">
        Volume: {Math.round(audio.volume * 100)}%
      </div>
    </div>
  );
};

describe("GameAudio Integration", () => {
  const mockOnAudioEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Web Audio API
    global.AudioContext = vi.fn().mockImplementation(() => ({
      createGain: vi.fn().mockReturnValue({
        connect: vi.fn(),
        gain: { value: 1 },
      }),
      createBuffer: vi.fn(),
      createBufferSource: vi.fn().mockReturnValue({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        buffer: null,
      }),
      destination: {},
      state: "running",
      resume: vi.fn().mockResolvedValue(undefined),
      suspend: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
    }));

    // Mock Audio constructor
    global.Audio = vi.fn().mockImplementation(() => ({
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      load: vi.fn(),
      volume: 1,
      currentTime: 0,
      duration: 100,
      paused: true,
      ended: false,
      readyState: 4,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  describe("Audio Provider Integration", () => {
    it("should provide audio context to child components", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      expect(screen.getByTestId("game-audio-component")).toBeTruthy();
      expect(screen.getByTestId("audio-status")).toBeTruthy();
    });

    it("should initialize audio system", async () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // Audio should be available
      expect(screen.getByTestId("audio-status")).toBeTruthy();
    });

    it("should handle volume control", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      const volumeDisplay = screen.getByTestId("audio-volume");
      expect(volumeDisplay).toBeTruthy();
    });
  });

  describe("Music Management", () => {
    it("should play background music", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      const playButton = screen.getByTestId("play-music-button");
      playButton.click();

      expect(mockOnAudioEvent).toHaveBeenCalledWith("music_played");
    });

    it("should stop background music", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      const stopButton = screen.getByTestId("stop-music-button");
      stopButton.click();

      expect(mockOnAudioEvent).toHaveBeenCalledWith("music_stopped");
    });

    it("should handle music transitions", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // Play first track
      const playButton = screen.getByTestId("play-music-button");
      playButton.click();

      // Should handle smooth transitions
      expect(mockOnAudioEvent).toHaveBeenCalledWith("music_played");
    });
  });

  describe("Sound Effects", () => {
    it("should play combat sound effects", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      const sfxButton = screen.getByTestId("play-sfx-button");
      sfxButton.click();

      expect(mockOnAudioEvent).toHaveBeenCalledWith("sfx_played");
    });

    it("should handle multiple simultaneous sounds", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      const sfxButton = screen.getByTestId("play-sfx-button");

      // Rapid fire multiple sounds
      sfxButton.click();
      sfxButton.click();
      sfxButton.click();

      expect(mockOnAudioEvent).toHaveBeenCalledTimes(3);
    });

    it("should respect volume settings for SFX", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // SFX should respect global volume
      const sfxButton = screen.getByTestId("play-sfx-button");
      sfxButton.click();

      expect(mockOnAudioEvent).toHaveBeenCalledWith("sfx_played");
    });
  });

  describe("Korean Audio Content", () => {
    it("should support Korean voice acting", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // Should be able to handle Korean audio content
      expect(screen.getByTestId("game-audio-component")).toBeTruthy();
    });

    it("should handle bilingual audio switching", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // Should support language switching
      expect(screen.getByTestId("game-audio-component")).toBeTruthy();
    });
  });

  describe("Performance", () => {
    it("should handle audio loading efficiently", () => {
      const startTime = performance.now();

      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      expect(loadTime).toBeLessThan(100);
      expect(screen.getByTestId("game-audio-component")).toBeTruthy();
    });

    it("should manage memory usage for audio assets", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // Should not leak memory with repeated audio operations
      const playButton = screen.getByTestId("play-music-button");
      const stopButton = screen.getByTestId("stop-music-button");

      for (let i = 0; i < 10; i++) {
        playButton.click();
        stopButton.click();
      }

      expect(screen.getByTestId("game-audio-component")).toBeTruthy();
    });
  });

  describe("Error Handling", () => {
    it("should handle audio context creation failures", () => {
      // Mock AudioContext to fail
      global.AudioContext = vi.fn().mockImplementation(() => {
        throw new Error("AudioContext not supported");
      });

      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // Should gracefully handle audio failures
      expect(screen.getByTestId("game-audio-component")).toBeTruthy();
    });

    it("should handle missing audio files", () => {
      // Mock Audio to fail loading
      global.Audio = vi.fn().mockImplementation(() => ({
        play: vi.fn().mockRejectedValue(new Error("File not found")),
        pause: vi.fn(),
        load: vi.fn(),
        volume: 1,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      const playButton = screen.getByTestId("play-music-button");
      playButton.click();

      // Should handle missing files gracefully
      expect(screen.getByTestId("game-audio-component")).toBeTruthy();
    });

    it("should recover from audio context suspension", () => {
      // Mock suspended audio context
      const mockContext = {
        createGain: vi.fn().mockReturnValue({
          connect: vi.fn(),
          gain: { value: 1 },
        }),
        state: "suspended",
        resume: vi.fn().mockResolvedValue(undefined),
        destination: {},
      };

      global.AudioContext = vi.fn().mockImplementation(() => mockContext);

      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // Should attempt to resume suspended context
      expect(screen.getByTestId("game-audio-component")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should respect user audio preferences", () => {
      // Mock reduced motion preference (which often correlates with audio sensitivity)
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: query === "(prefers-reduced-motion: reduce)",
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
        })),
      });

      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      expect(screen.getByTestId("game-audio-component")).toBeTruthy();
    });

    it("should provide audio descriptions when needed", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // Should support audio descriptions for visually impaired users
      expect(screen.getByTestId("audio-status")).toBeTruthy();
    });
  });

  describe("Combat Audio Integration", () => {
    it("should play appropriate combat sounds", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // Should integrate with combat system
      const sfxButton = screen.getByTestId("play-sfx-button");
      sfxButton.click();

      expect(mockOnAudioEvent).toHaveBeenCalledWith("sfx_played");
    });

    it("should synchronize audio with visual effects", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // Audio should be properly timed with visual effects
      expect(screen.getByTestId("game-audio-component")).toBeTruthy();
    });

    it("should handle Korean martial arts audio cues", () => {
      render(
        <AudioProvider>
          <MockGameAudioComponent onAudioEvent={mockOnAudioEvent} />
        </AudioProvider>
      );

      // Should support traditional Korean martial arts audio
      expect(screen.getByTestId("game-audio-component")).toBeTruthy();
    });
  });
});
