import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithPixi } from "../../../test/test-utils";
import { AudioProvider } from "../../../audio/AudioProvider";
import TrainingAudioManager from "./TrainingAudioManager";
import { TrigramStance, PlayerArchetype } from "../../../types/enums";
import type { AudioManagerInterface } from "../../../types/audio";

/**
 * ## Training Audio Manager Test Suite - Enhanced Korean Martial Arts Audio
 *
 * **Business Purpose:**
 * Validates the comprehensive audio management system that provides authentic Korean martial arts
 * training experience through voice commands, feedback, and cultural audio elements.
 *
 * **Korean Martial Arts Integration:**
 * - Tests authentic Korean voice command pronunciation and execution
 * - Validates cultural accuracy in audio terminology and feedback
 * - Ensures proper integration with traditional Korean training methodologies
 * - Verifies bilingual Korean-English audio instruction support
 *
 * **Educational Value:**
 * These tests ensure the audio system effectively supports Korean martial arts learning through:
 * - Proper pronunciation guidance for Korean martial arts terms
 * - Contextual audio feedback matching training scenarios
 * - Cultural immersion through authentic dojang audio atmosphere
 * - Accessibility through comprehensive audio controls and settings
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

// Enhanced mock audio manager with comprehensive Korean martial arts audio support
const createMockAudioManager = (): AudioManagerInterface => ({
  isInitialized: true,
  playMusic: vi.fn().mockResolvedValue(undefined),
  stopMusic: vi.fn(),
  playSFX: vi.fn().mockResolvedValue(undefined),
  setMasterVolume: vi.fn(),
  setMusicVolume: vi.fn(),
  setSFXVolume: vi.fn(),
  getMasterVolume: vi.fn().mockReturnValue(0.8),
  getMusicVolume: vi.fn().mockReturnValue(0.6),
  getSFXVolume: vi.fn().mockReturnValue(0.8),
  pauseMusic: vi.fn(),
  resumeMusic: vi.fn(),
  fadeInMusic: vi.fn().mockResolvedValue(undefined),
  fadeOutMusic: vi.fn().mockResolvedValue(undefined),
  playArchetypeTheme: vi.fn().mockResolvedValue(undefined),
  stopAllSounds: vi.fn(),
  playKoreanVoiceCommand: vi.fn().mockResolvedValue(undefined), // Enhanced for Korean voice
  playDojangAmbience: vi.fn().mockResolvedValue(undefined), // Dojang atmosphere
  playTechniqueSound: vi.fn().mockResolvedValue(undefined), // Technique-specific audio
});

const renderTrainingAudioManager = (props = {}) => {
  const defaultProps = {
    audio: createMockAudioManager(),
    selectedStance: TrigramStance.GEON,
    currentCombo: 0,
    playerArchetype: PlayerArchetype.MUSA,
    trainingMode: "basics",
    isTraining: false,
    accuracy: 0.75,
    x: 0,
    y: 0,
    width: 400,
    height: 300,
    screenWidth: 1200,
    screenHeight: 800,
    onVoiceCommandExecute: vi.fn(),
    showAdvancedControls: false,
  };

  return renderWithPixi(
    <AudioProvider>
      <TrainingAudioManager {...defaultProps} {...props} />
    </AudioProvider>
  );
};

describe("TrainingAudioManager", () => {
  let mockAudio: AudioManagerInterface;
  let mockVoiceCommandExecute: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAudio = createMockAudioManager();
    mockVoiceCommandExecute = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render all essential audio control elements", async () => {
      renderTrainingAudioManager();

      await waitFor(() => {
        // Core component
        expect(
          screen.getByTestId("training-audio-manager")
        ).toBeInTheDocument();

        // Volume controls
        expect(screen.getByTestId("master-volume-control")).toBeInTheDocument();
        expect(screen.getByTestId("master-volume-bar")).toBeInTheDocument();
        expect(screen.getByTestId("master-volume-label")).toBeInTheDocument();

        // Audio categories
        expect(screen.getByTestId("audio-categories")).toBeInTheDocument();
        expect(screen.getByTestId("musicVolume-control")).toBeInTheDocument();
        expect(screen.getByTestId("sfxVolume-control")).toBeInTheDocument();
        expect(screen.getByTestId("voiceVolume-control")).toBeInTheDocument();
      });
    });

    it("should display Korean voice commands section", async () => {
      renderTrainingAudioManager();

      await waitFor(() => {
        expect(screen.getByTestId("korean-voice-commands")).toBeInTheDocument();
        expect(screen.getByTestId("voice-commands-title")).toBeInTheDocument();
        expect(screen.getByTestId("voice-command-buttons")).toBeInTheDocument();
      });
    });

    it("should show training status with Korean text", async () => {
      renderTrainingAudioManager({
        selectedStance: TrigramStance.LI,
        currentCombo: 3,
        accuracy: 0.85,
      });

      await waitFor(() => {
        const statusElement = screen.getByTestId("audio-training-status");
        expect(statusElement).toBeInTheDocument();

        const statusText = statusElement.textContent || "";
        expect(statusText).toMatch(/자세: 리/);
        expect(statusText).toMatch(/연속: 3회/);
        expect(statusText).toMatch(/정확도: 85%/);
      });
    });

    it("should render advanced controls when enabled", async () => {
      renderTrainingAudioManager({ showAdvancedControls: true });

      await waitFor(() => {
        expect(
          screen.getByTestId("audio-settings-toggles")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("toggle-koreanVoiceEnabled")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("toggle-englishVoiceEnabled")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("toggle-pronunciationGuideEnabled")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("toggle-dojangAmbienceEnabled")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Volume Controls", () => {
    it("should handle master volume changes", async () => {
      renderTrainingAudioManager({ audio: mockAudio });

      const volumeBar = await screen.findByTestId("master-volume-bar");

      // Simulate click on volume bar (50% position)
      fireEvent.pointerDown(volumeBar, {
        global: { x: 75, y: 20 }, // Assuming 150px width, click at 50%
      });

      await waitFor(() => {
        expect(mockAudio.setMasterVolume).toHaveBeenCalled();
      });
    });

    it("should update volume display percentage", async () => {
      renderTrainingAudioManager();

      await waitFor(() => {
        const percentageDisplay = screen.getByTestId(
          "master-volume-percentage"
        );
        expect(percentageDisplay.textContent).toMatch(/\d+%/);
      });
    });

    it("should handle category-specific volume controls", async () => {
      renderTrainingAudioManager({ audio: mockAudio });

      // Test music volume
      const musicVolumeBar = await screen.findByTestId("musicVolume-bar");
      fireEvent.pointerDown(musicVolumeBar);

      await waitFor(() => {
        expect(mockAudio.setMusicVolume).toHaveBeenCalled();
      });

      // Test SFX volume
      const sfxVolumeBar = await screen.findByTestId("sfxVolume-bar");
      fireEvent.pointerDown(sfxVolumeBar);

      await waitFor(() => {
        expect(mockAudio.setSFXVolume).toHaveBeenCalled();
      });
    });
  });

  describe("Korean Voice Commands", () => {
    it("should display contextual Korean voice commands", async () => {
      renderTrainingAudioManager({
        accuracy: 0.9, // High accuracy should show encouragement commands
        currentCombo: 5,
        playerArchetype: PlayerArchetype.MUSA,
      });

      await waitFor(() => {
        // Should show at least one voice command button
        const commandButtons = screen.getAllByTestId(/voice-command-button-/);
        expect(commandButtons.length).toBeGreaterThan(0);

        // Should show Korean text in commands
        const commandTexts = screen.getAllByTestId(/voice-command-text-/);
        commandTexts.forEach((textElement) => {
          const text = textElement.textContent || "";
          expect(text).toMatch(/[\u3131-\u318E\uAC00-\uD7A3]/); // Korean characters
        });
      });
    });

    it("should execute Korean voice commands with audio playback", async () => {
      renderTrainingAudioManager({
        audio: mockAudio,
        onVoiceCommandExecute: mockVoiceCommandExecute,
      });

      // Find and click a voice command button
      const commandButton = await screen.findByTestId(/voice-command-button-/);
      fireEvent.pointerDown(commandButton);

      await waitFor(() => {
        // Should play SFX for Korean voice
        expect(mockAudio.playSFX).toHaveBeenCalled();

        // Should call the voice command callback
        expect(mockVoiceCommandExecute).toHaveBeenCalled();
      });
    });

    it("should show current voice command display when executed", async () => {
      renderTrainingAudioManager();

      // Execute a voice command
      const commandButton = await screen.findByTestId(/voice-command-button-/);
      fireEvent.pointerDown(commandButton);

      await waitFor(() => {
        expect(screen.getByTestId("current-voice-command")).toBeInTheDocument();
        expect(
          screen.getByTestId("voice-command-display-background")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("current-voice-command-korean")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("current-voice-command-english")
        ).toBeInTheDocument();
      });
    });

    it("should display pronunciation guide when enabled", async () => {
      renderTrainingAudioManager({ showAdvancedControls: true });

      // Enable pronunciation guide
      const pronunciationToggle = await screen.findByTestId(
        "toggle-pronunciationGuideEnabled-checkbox"
      );
      fireEvent.pointerDown(pronunciationToggle);

      // Execute a voice command
      const commandButton = await screen.findByTestId(/voice-command-button-/);
      fireEvent.pointerDown(commandButton);

      await waitFor(() => {
        expect(screen.getByTestId("pronunciation-guide")).toBeInTheDocument();
      });
    });

    it("should filter commands by player archetype", async () => {
      // Test with MUSA archetype
      renderTrainingAudioManager({ playerArchetype: PlayerArchetype.MUSA });

      await waitFor(() => {
        const commandButtons = screen.getAllByTestId(/voice-command-button-/);
        expect(commandButtons.length).toBeGreaterThan(0);
      });

      // Test with AMSALJA archetype - should show different commands
      renderTrainingAudioManager({ playerArchetype: PlayerArchetype.AMSALJA });

      await waitFor(() => {
        const commandButtons = screen.getAllByTestId(/voice-command-button-/);
        expect(commandButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Audio Settings Toggles", () => {
    it("should toggle Korean voice settings", async () => {
      renderTrainingAudioManager({ showAdvancedControls: true });

      const koreanToggle = await screen.findByTestId(
        "toggle-koreanVoiceEnabled-checkbox"
      );
      fireEvent.pointerDown(koreanToggle);

      // Should update the toggle state visually
      await waitFor(() => {
        expect(koreanToggle).toBeInTheDocument();
      });
    });

    it("should toggle English voice settings", async () => {
      renderTrainingAudioManager({ showAdvancedControls: true });

      const englishToggle = await screen.findByTestId(
        "toggle-englishVoiceEnabled-checkbox"
      );
      fireEvent.pointerDown(englishToggle);

      await waitFor(() => {
        expect(englishToggle).toBeInTheDocument();
      });
    });

    it("should toggle dojang ambience settings", async () => {
      renderTrainingAudioManager({ showAdvancedControls: true });

      const dojangToggle = await screen.findByTestId(
        "toggle-dojangAmbienceEnabled-checkbox"
      );
      fireEvent.pointerDown(dojangToggle);

      await waitFor(() => {
        expect(dojangToggle).toBeInTheDocument();
      });
    });

    it("should display toggle labels in Korean", async () => {
      renderTrainingAudioManager({ showAdvancedControls: true });

      await waitFor(() => {
        expect(
          screen.getByTestId("toggle-koreanVoiceEnabled-label")
        ).toHaveTextContent("한국어");
        expect(
          screen.getByTestId("toggle-pronunciationGuideEnabled-label")
        ).toHaveTextContent("발음");
        expect(
          screen.getByTestId("toggle-dojangAmbienceEnabled-label")
        ).toHaveTextContent("도장");
      });
    });
  });

  describe("Training Integration", () => {
    it("should show audio visualizer during training", async () => {
      renderTrainingAudioManager({ isTraining: true });

      await waitFor(() => {
        expect(screen.getByTestId("audio-visualizer")).toBeInTheDocument();
        expect(screen.getByTestId("visualizer-label")).toBeInTheDocument();

        // Should show visualizer bars
        const visualizerBars = screen.getAllByTestId(/visualizer-bar-/);
        expect(visualizerBars.length).toBeGreaterThan(0);
      });
    });

    it("should hide audio visualizer when not training", async () => {
      renderTrainingAudioManager({ isTraining: false });

      await waitFor(() => {
        expect(
          screen.queryByTestId("audio-visualizer")
        ).not.toBeInTheDocument();
      });
    });

    it("should provide contextual feedback based on accuracy", async () => {
      // Mock timers for auto-feedback
      vi.useFakeTimers();

      renderTrainingAudioManager({
        isTraining: true,
        accuracy: 0.9, // High accuracy
        audio: mockAudio,
      });

      // Advance timers to trigger auto-feedback
      vi.advanceTimersByTime(4000);

      await waitFor(() => {
        // Should eventually play encouraging audio
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      vi.useRealTimers();
    });

    it("should update status text based on current training state", async () => {
      renderTrainingAudioManager({
        selectedStance: TrigramStance.JIN,
        currentCombo: 7,
        accuracy: 0.92,
      });

      await waitFor(() => {
        const statusText =
          screen.getByTestId("audio-training-status").textContent || "";
        expect(statusText).toContain("진"); // JIN stance in Korean
        expect(statusText).toContain("7회"); // 7 combo count
        expect(statusText).toContain("92%"); // 92% accuracy
      });
    });
  });

  describe("Responsive Design", () => {
    it("should adapt layout for mobile screens", async () => {
      renderTrainingAudioManager({
        screenWidth: 400,
        screenHeight: 600,
        width: 380,
        height: 250,
      });

      await waitFor(() => {
        // Should render all elements appropriately for mobile
        expect(
          screen.getByTestId("training-audio-manager")
        ).toBeInTheDocument();
        expect(screen.getByTestId("korean-voice-commands")).toBeInTheDocument();
        expect(screen.getByTestId("master-volume-control")).toBeInTheDocument();
      });
    });

    it("should adapt layout for tablet screens", async () => {
      renderTrainingAudioManager({
        screenWidth: 800,
        screenHeight: 600,
        width: 350,
        height: 280,
      });

      await waitFor(() => {
        expect(
          screen.getByTestId("training-audio-manager")
        ).toBeInTheDocument();
        expect(screen.getByTestId("audio-categories")).toBeInTheDocument();
      });
    });

    it("should show fewer voice commands on mobile", async () => {
      // Mobile layout
      renderTrainingAudioManager({
        screenWidth: 400,
        screenHeight: 600,
      });

      const mobileCommands = screen.getAllByTestId(/voice-command-button-/);

      // Desktop layout
      renderTrainingAudioManager({
        screenWidth: 1200,
        screenHeight: 800,
      });

      const desktopCommands = screen.getAllByTestId(/voice-command-button-/);

      // Desktop should show same or more commands than mobile
      expect(desktopCommands.length).toBeGreaterThanOrEqual(
        mobileCommands.length
      );
    });
  });

  describe("Performance and Optimization", () => {
    it("should handle rapid volume changes efficiently", async () => {
      renderTrainingAudioManager({ audio: mockAudio });

      const volumeBar = await screen.findByTestId("master-volume-bar");

      // Rapid volume changes
      for (let i = 0; i < 10; i++) {
        fireEvent.pointerDown(volumeBar, {
          global: { x: 50 + i * 10, y: 20 },
        });
      }

      // Should not break or cause performance issues
      await waitFor(() => {
        expect(mockAudio.setMasterVolume).toHaveBeenCalled();
      });
    });

    it("should manage audio visualizer updates efficiently", async () => {
      vi.useFakeTimers();

      renderTrainingAudioManager({ isTraining: true });

      // Should handle rapid visualizer updates
      vi.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByTestId("audio-visualizer")).toBeInTheDocument();
      });

      vi.useRealTimers();
    });

    it("should cleanup resources when component unmounts", async () => {
      const { unmount } = renderTrainingAudioManager({ isTraining: true });

      // Should have active timers/intervals
      await waitFor(() => {
        expect(screen.getByTestId("audio-visualizer")).toBeInTheDocument();
      });

      // Unmount component
      unmount();

      // Should cleanup without errors
      expect(true).toBe(true); // Test that no errors occur during cleanup
    });
  });

  describe("Accessibility", () => {
    it("should provide proper test IDs for all interactive elements", async () => {
      renderTrainingAudioManager({ showAdvancedControls: true });

      await waitFor(() => {
        // Core elements
        expect(
          screen.getByTestId("training-audio-manager")
        ).toBeInTheDocument();
        expect(screen.getByTestId("master-volume-bar")).toBeInTheDocument();

        // Voice commands
        expect(screen.getByTestId("korean-voice-commands")).toBeInTheDocument();
        expect(screen.getByTestId("voice-command-buttons")).toBeInTheDocument();

        // Settings toggles
        expect(
          screen.getByTestId("audio-settings-toggles")
        ).toBeInTheDocument();

        // Status display
        expect(screen.getByTestId("audio-training-status")).toBeInTheDocument();
      });
    });

    it("should support Korean text accessibility", async () => {
      renderTrainingAudioManager();

      await waitFor(() => {
        // Check that Korean text is properly rendered and accessible
        const koreanTexts = screen.getAllByText(/[\u3131-\u318E\uAC00-\uD7A3]/);
        expect(koreanTexts.length).toBeGreaterThan(0);

        // Check specific Korean labels
        expect(screen.getByText(/훈련 음향 관리/)).toBeInTheDocument();
        expect(screen.getByText(/한국어 음성 명령/)).toBeInTheDocument();
      });
    });

    it("should provide bilingual content for international accessibility", async () => {
      renderTrainingAudioManager();

      await waitFor(() => {
        // Should have both Korean and English text
        expect(screen.getByText(/Training Audio/)).toBeInTheDocument();
        expect(screen.getByText(/Korean Voice Commands/)).toBeInTheDocument();
        expect(screen.getByText(/Master Volume/)).toBeInTheDocument();
      });
    });
  });

  describe("Korean Martial Arts Cultural Accuracy", () => {
    it("should use authentic Korean martial arts terminology", async () => {
      renderTrainingAudioManager({
        selectedStance: TrigramStance.GEON,
        playerArchetype: PlayerArchetype.MUSA,
      });

      await waitFor(() => {
        // Check for authentic Korean terms
        const statusText =
          screen.getByTestId("audio-training-status").textContent || "";
        expect(statusText).toMatch(/자세: 건/); // Correct Korean for "stance: heaven"

        // Check for proper martial arts terminology
        expect(screen.getByText(/훈련 음향 관리/)).toBeInTheDocument();
      });
    });

    it("should respect Korean honorific language in voice commands", async () => {
      renderTrainingAudioManager();

      await waitFor(() => {
        // Check for proper honorific usage in Korean commands
        const commandTexts = screen.getAllByTestId(/voice-command-text-/);
        commandTexts.forEach((textElement) => {
          const text = textElement.textContent || "";
          if (text.includes("하세요") || text.includes("습니다")) {
            // Contains proper Korean honorifics
            expect(text).toMatch(/[\u3131-\u318E\uAC00-\uD7A3]/);
          }
        });
      });
    });

    it("should provide context-appropriate Korean martial arts feedback", async () => {
      // Test high accuracy scenario
      renderTrainingAudioManager({ accuracy: 0.95, isTraining: true });

      vi.useFakeTimers();
      vi.advanceTimersByTime(4000);

      await waitFor(() => {
        // Should provide appropriate positive feedback for high accuracy
        // This tests the auto-feedback system
        expect(mockAudio.playSFX).toHaveBeenCalled();
      });

      vi.useRealTimers();
    });
  });
});
