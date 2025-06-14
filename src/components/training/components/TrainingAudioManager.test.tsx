import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderWithPixi } from "../../../test/test-utils";
import { TrainingAudioManager } from "./TrainingAudioManager";
import { TrigramStance } from "../../../types/enums";

const mockAudio = {
  playSFX: vi.fn(),
  playMusic: vi.fn(),
  stopMusic: vi.fn(),
  setVolume: vi.fn(),
  isInitialized: true,
};

const defaultProps = {
  audio: mockAudio,
  isTraining: false,
  selectedStance: TrigramStance.GEON,
  accuracy: 0,
  currentCombo: 0,
};

describe("TrainingAudioManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without visual elements", () => {
    renderWithPixi(<TrainingAudioManager {...defaultProps} />);

    // Audio manager should not render visible elements
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should play training music when training starts", () => {
    const { rerender } = renderWithPixi(<TrainingAudioManager {...defaultProps} />);

    rerender(<TrainingAudioManager {...defaultProps} isTraining={true} />);

    expect(mockAudio.playMusic).toHaveBeenCalledWith("training_theme");
  });

  it("should stop music when training ends", () => {
    const { rerender } = renderWithPixi(
      <TrainingAudioManager {...defaultProps} isTraining={true} />
    );

    rerender(<TrainingAudioManager {...defaultProps} isTraining={false} />);

    expect(mockAudio.stopMusic).toHaveBeenCalled();
  });

  it("should play stance change sound", () => {
    const { rerender } = renderWithPixi(
      <TrainingAudioManager {...defaultProps} isTraining={true} />
    );

    rerender(
      <TrainingAudioManager
        {...defaultProps}
        isTraining={true}
        selectedStance={TrigramStance.TAE}
      />
    );

    expect(mockAudio.playSFX).toHaveBeenCalledWith("stance_change");
  });

  it("should play combo sounds for multiple hits", () => {
    const { rerender } = renderWithPixi(<TrainingAudioManager {...defaultProps} />);

    rerender(<TrainingAudioManager {...defaultProps} currentCombo={3} />);

    expect(mockAudio.playSFX).toHaveBeenCalledWith("combo_hit");
  });

  it("should play accuracy feedback sounds", () => {
    const { rerender } = renderWithPixi(<TrainingAudioManager {...defaultProps} />);

    // High accuracy
    rerender(<TrainingAudioManager {...defaultProps} accuracy={95} />);
    expect(mockAudio.playSFX).toHaveBeenCalledWith("perfect_accuracy");

    // Good accuracy
    rerender(<TrainingAudioManager {...defaultProps} accuracy={75} />);
    expect(mockAudio.playSFX).toHaveBeenCalledWith("good_accuracy");
  });
});
      renderTrainingAudioManager();

      expect(screen.getByTestId("audio-status-text")).toBeInTheDocument();
    });
  });

  describe("Training State Integration", () => {
    it("should update audio when training starts", () => {
      renderTrainingAudioManager({ isTraining: true });

      expect(screen.getByTestId("audio-visualization")).toBeInTheDocument();
    });

    it("should handle combo progression audio", () => {
      const mockOnAudioEvent = vi.fn();
      const { rerender } = renderTrainingAudioManager({ 
        onAudioEvent: mockOnAudioEvent,
        currentCombo: 1 
      });

      // Increase combo
      rerender(
        <AudioProvider>
          <TrainingAudioManager 
            {...defaultProps} 
            onAudioEvent={mockOnAudioEvent}
            currentCombo={3}
          />
        </AudioProvider>
      );

      expect(mockAudio.playSFX).toHaveBeenCalledWith("combo_3");
    });

    it("should play milestone sounds for special combos", () => {
      const { rerender } = renderTrainingAudioManager({ currentCombo: 4 });

      // Reach 5 combo milestone
      rerender(
        <AudioProvider>
          <TrainingAudioManager {...defaultProps} currentCombo={5} />
        </AudioProvider>
      );

      expect(mockAudio.playSFX).toHaveBeenCalledWith("combo_milestone_5");
    });

    it("should play legendary combo sound for high combos", () => {
      const { rerender } = renderTrainingAudioManager({ currentCombo: 19 });

      // Reach 20+ combo
      rerender(
        <AudioProvider>
          <TrainingAudioManager {...defaultProps} currentCombo={20} />
        </AudioProvider>
      );

      expect(mockAudio.playSFX).toHaveBeenCalledWith("combo_legendary");
    });
  });

  describe("Accuracy-Based Audio Feedback", () => {
    it("should play improving accuracy sound", () => {
      const initialStats = { ...mockStats, accuracy: 60 };
      const { rerender } = renderTrainingAudioManager({ 
        stats: initialStats,
        isTraining: true 
      });

      // Improve accuracy significantly
      const improvedStats = { ...mockStats, accuracy: 80, attempts: 10 };
      rerender(
        <AudioProvider>
          <TrainingAudioManager 
            {...defaultProps} 
            stats={improvedStats}
            isTraining={true}
          />
        </AudioProvider>
      );

      expect(mockAudio.playSFX).toHaveBeenCalledWith("accuracy_improving");
    });

    it("should play declining accuracy sound", () => {
      const initialStats = { ...mockStats, accuracy: 80 };
      const { rerender } = renderTrainingAudioManager({ 
        stats: initialStats,
        isTraining: true 
      });

      // Accuracy declines significantly
      const declinedStats = { ...mockStats, accuracy: 60, attempts: 10 };
      rerender(
        <AudioProvider>
          <TrainingAudioManager 
            {...defaultProps} 
            stats={declinedStats,
            isTraining: true}
          />
        </AudioProvider>
      );

      expect(mockAudio.playSFX).toHaveBeenCalledWith("accuracy_declining");
    });

    it("should not play accuracy sounds with insufficient attempts", () => {
      const lowAttemptsStats = { ...mockStats, attempts: 3 };
      renderTrainingAudioManager({ 
        stats: lowAttemptsStats,
        isTraining: true 
      });

      expect(mockAudio.playSFX).not.toHaveBeenCalledWith("accuracy_improving");
      expect(mockAudio.playSFX).not.toHaveBeenCalledWith("accuracy_declining");
    });
  });

  describe("Stance-Specific Audio", () => {
    it("should play stance ambient sounds during training", () => {
      vi.useFakeTimers();
      renderTrainingAudioManager({ 
        isTraining: true,
        selectedStance: TrigramStance.GEON 
      });

      // Fast-forward to trigger ambient sound
      vi.advanceTimersByTime(15000);

      expect(mockAudio.playSFX).toHaveBeenCalledWith("ambient_heaven");
    });

    it.each([
      [TrigramStance.GEON, "ambient_heaven"],
      [TrigramStance.TAE, "ambient_lake"],
      [TrigramStance.LI, "ambient_fire"],
      [TrigramStance.JIN, "ambient_thunder"],
      [TrigramStance.SON, "ambient_wind"],
      [TrigramStance.GAM, "ambient_water"],
      [TrigramStance.GAN, "ambient_mountain"],
      [TrigramStance.GON, "ambient_earth"],
    ])("should play correct ambient sound for %s stance", (stance, expectedSound) => {
      vi.useFakeTimers();
      renderTrainingAudioManager({ 
        isTraining: true,
        selectedStance: stance 
      });

      vi.advanceTimersByTime(15000);

      expect(mockAudio.playSFX).toHaveBeenCalledWith(expectedSound);
    });
  });

  describe("Audio Controls", () => {
    it("should render Korean praise button", () => {
      renderTrainingAudioManager();

      expect(screen.getByTestId("audio-praise-button")).toBeInTheDocument();
      expect(screen.getByTestId("audio-praise-text")).toBeInTheDocument();
      expect(screen.getByTestId("audio-praise-text").getAttribute("text")).toBe("좋다");
    });

    it("should play praise sound when button clicked", () => {
      const mockOnAudioEvent = vi.fn();
      renderTrainingAudioManager({ onAudioEvent: mockOnAudioEvent });

      const praiseButton = screen.getByTestId("audio-praise-button");
      fireEvent.click(praiseButton);

      expect(mockOnAudioEvent).toHaveBeenCalledWith("korean_command", {
        command: "good",
        korean: "좋다"
      });
    });
  });

  describe("Visual Audio Representation", () => {
    it("should show audio bars during training", () => {
      renderTrainingAudioManager({ isTraining: true });

      expect(screen.getByTestId("audio-visualization")).toBeInTheDocument();
    });

    it("should show stance energy visualization", () => {
      renderTrainingAudioManager({ 
        isTraining: true,
        currentCombo: 5,
        selectedStance: TrigramStance.JIN 
      });

      expect(screen.getByTestId("audio-visualization")).toBeInTheDocument();
    });

    it("should update visualization with current combo and accuracy", () => {
      renderTrainingAudioManager({ 
        isTraining: true,
        currentCombo: 8,
        stats: { ...mockStats, accuracy: 90 }
      });

      const visualization = screen.getByTestId("audio-visualization");
      expect(visualization).toBeInTheDocument();
    });
  });

  describe("Training Session Audio Management", () => {
    it("should handle training start events", () => {
      const mockOnAudioEvent = vi.fn();
      renderTrainingAudioManager({ onAudioEvent: mockOnAudioEvent });

      // Simulate training start
      mockOnAudioEvent("training_started");

      expect(mockAudio.playMusic).toHaveBeenCalledWith("training_dojang_theme");
      expect(mockAudio.playSFX).toHaveBeenCalledWith("training_bell_start");
    });

    it("should handle training completion with different performance levels", () => {
      const mockOnAudioEvent = vi.fn();

      // Test excellent performance
      renderTrainingAudioManager({ 
        onAudioEvent: mockOnAudioEvent,
        stats: { ...mockStats, accuracy: 95 }
      });

      mockOnAudioEvent("training_completed", { accuracy: 95 });
      expect(mockAudio.playSFX).toHaveBeenCalledWith("training_master_level");

      // Test good performance
      mockAudio.playSFX.mockClear();
      renderTrainingAudioManager({ 
        onAudioEvent: mockOnAudioEvent,
        stats: { ...mockStats, accuracy: 80 }
      });

      mockOnAudioEvent("training_completed", { accuracy: 80 });
      expect(mockAudio.playSFX).toHaveBeenCalledWith("training_excellent");
    });
  });

  describe("Status Display", () => {
    it("should show current stance and combo in status", () => {
      renderTrainingAudioManager({ 
        selectedStance: TrigramStance.TAE,
        currentCombo: 3 
      });

      const statusText = screen.getByTestId("audio-status-text");
      expect(statusText.getAttribute("text")).toContain("TAE");
      expect(statusText.getAttribute("text")).toContain("3");
    });

    it("should update status when stance changes", () => {
      const { rerender } = renderTrainingAudioManager({ 
        selectedStance: TrigramStance.GEON 
      });

      rerender(
        <AudioProvider>
          <TrainingAudioManager 
            {...defaultProps} 
            selectedStance={TrigramStance.LI}
          />
        </AudioProvider>
      );

      const statusText = screen.getByTestId("audio-status-text");
      expect(statusText.getAttribute("text")).toContain("LI");
    });
  });

  describe("Error Handling", () => {
    it("should handle audio initialization failure gracefully", () => {
      const brokenAudio = { ...mockAudio, isInitialized: false };
      vi.mocked(mockAudio).isInitialized = false;

      renderTrainingAudioManager();

      expect(screen.getByTestId("training-audio-manager")).toBeInTheDocument();
    });

    it("should handle missing audio event handler", () => {
      renderTrainingAudioManager({ onAudioEvent: undefined });

      const praiseButton = screen.getByTestId("audio-praise-button");
      fireEvent.click(praiseButton);

      // Should not crash
      expect(screen.getByTestId("training-audio-manager")).toBeInTheDocument();
    });
  });

  describe("Performance Optimization", () => {
    it("should clean up intervals on unmount", () => {
      const { unmount } = renderTrainingAudioManager({ isTraining: true });

      unmount();

      // Should not continue playing sounds after unmount
      vi.advanceTimersByTime(15000);
      expect(mockAudio.playSFX).not.toHaveBeenCalledWith(expect.stringContaining("ambient"));
    });
  });
});
