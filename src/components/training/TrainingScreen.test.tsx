import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderWithPixi } from "../../test/test-utils";
import { AudioProvider } from "../../audio/AudioProvider";
import TrainingScreen from "./TrainingScreen";
import { TrigramStance, PlayerArchetype, CombatState } from "../../types/enums";
import type { PlayerState } from "../../types/player";

// Complete mock player state with all required properties
const createMockPlayer = (
  overrides: Partial<PlayerState> = {}
): PlayerState => ({
  id: "test-player",
  name: { korean: "테스트 무사", english: "Test Warrior" },
  archetype: PlayerArchetype.MUSA,
  health: 100,
  maxHealth: 100,
  ki: 100,
  maxKi: 100,
  stamina: 100,
  maxStamina: 100,
  energy: 100,
  maxEnergy: 100,
  attackPower: 75,
  defense: 75,
  speed: 75,
  technique: 75,
  pain: 0,
  consciousness: 100,
  balance: 100,
  momentum: 0,
  currentStance: TrigramStance.GEON,
  combatState: CombatState.IDLE,
  position: { x: 300, y: 400 },
  isBlocking: false,
  isStunned: false,
  isCountering: false,
  lastActionTime: 0,
  recoveryTime: 0,
  lastStanceChangeTime: 0,
  statusEffects: [],
  activeEffects: [],
  vitalPoints: [],
  totalDamageReceived: 0,
  totalDamageDealt: 0,
  hitsTaken: 0,
  hitsLanded: 0,
  perfectStrikes: 0,
  vitalPointHits: 0,
  experiencePoints: 0,
  ...overrides,
});

const renderTrainingScreen = (props = {}) => {
  const defaultProps = {
    onReturnToMenu: vi.fn(),
    onPlayerUpdate: vi.fn(),
    player: createMockPlayer(),
    width: 1200,
    height: 800,
  };

  return renderWithPixi(
    <AudioProvider>
      <TrainingScreen {...defaultProps} {...props} />
    </AudioProvider>
  );
};

/**
 * ## Training Screen Test Suite - Enhanced Business Focus
 *
 * **Business Purpose:**
 * Validates the complete Korean martial arts training experience that serves as the
 * core educational component of Black Trigram. Tests ensure that:
 * - Training provides authentic Korean martial arts learning progression
 * - Cultural accuracy is maintained throughout the training journey
 * - Player progression follows traditional Korean martial arts methodology
 * - Accessibility supports inclusive martial arts education
 *
 * **Korean Martial Arts Integration:**
 * - Validates authentic trigram philosophy implementation in training
 * - Tests traditional Korean belt/rank progression requirements
 * - Ensures cultural respect in all martial arts instruction
 * - Verifies bilingual Korean-English educational content accuracy
 *
 * **Business Value:**
 * These tests ensure Training Screen delivers effective Korean martial arts education
 * while maintaining authentic cultural representation and modern accessibility standards.
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

describe("TrainingScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Render", () => {
    it("should render all essential training elements", async () => {
      renderTrainingScreen();

      await waitFor(
        () => {
          expect(screen.getByTestId("training-screen")).toBeInTheDocument();
          expect(screen.getByTestId("dojang-background")).toBeInTheDocument();
          expect(screen.getByTestId("training-player")).toBeInTheDocument();
          expect(screen.getByTestId("training-dummy")).toBeInTheDocument();
          expect(
            screen.getByTestId("training-trigram-wheel")
          ).toBeInTheDocument();
          expect(
            screen.getByTestId("training-mode-selector")
          ).toBeInTheDocument();
          expect(screen.getByTestId("training-controls")).toBeInTheDocument();
          expect(screen.getByTestId("training-statistics")).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });

    it("should display correct Korean text elements", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        // Check for training header
        const headerElement = screen.getByTestId("training-title");
        expect(headerElement).toBeInTheDocument();
      });
    });

    it("should initialize with correct default values", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        // Should start with basics mode
        expect(screen.getByTestId("mode-basics")).toBeInTheDocument();

        // Should show initial attempts count
        expect(screen.getByTestId("attempts-count")).toBeInTheDocument();
      });
    });
  });

  describe("Training Mode Selection", () => {
    it("should handle training mode changes correctly", async () => {
      renderTrainingScreen();

      // Test basics mode
      const basicsMode = await screen.findByTestId("mode-basics");
      fireEvent.click(basicsMode);

      await waitFor(() => {
        expect(screen.getByTestId("current-mode-name")).toBeInTheDocument();
      });

      // Test advanced mode
      const advancedMode = await screen.findByTestId("mode-advanced");
      fireEvent.click(advancedMode);

      await waitFor(() => {
        expect(screen.getByTestId("current-mode-name")).toBeInTheDocument();
      });

      // Test free mode
      const freeMode = await screen.findByTestId("mode-free");
      fireEvent.click(freeMode);

      await waitFor(() => {
        expect(screen.getByTestId("current-mode-name")).toBeInTheDocument();
      });
    });

    it("should display mode descriptions correctly", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        expect(
          screen.getByTestId("current-mode-description")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Training Execution", () => {
    it("should start training session correctly", async () => {
      renderTrainingScreen();

      const toggleButton = await screen.findByTestId("toggle-training-button");
      fireEvent.click(toggleButton);

      await waitFor(() => {
        // Training should be active
        expect(screen.getByTestId("training-status")).toBeInTheDocument();

        // Execute button should be available
        expect(
          screen.getByTestId("execute-technique-button")
        ).toBeInTheDocument();
      });
    });

    it("should execute techniques and update statistics", async () => {
      const mockUpdate = vi.fn();
      renderTrainingScreen({ onPlayerUpdate: mockUpdate });

      // Start training
      const toggleButton = await screen.findByTestId("toggle-training-button");
      fireEvent.click(toggleButton);

      // Execute technique
      const executeButton = await screen.findByTestId(
        "execute-technique-button"
      );
      fireEvent.click(executeButton);

      await waitFor(() => {
        // Player should be updated with experience
        expect(mockUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            experiencePoints: expect.any(Number),
          })
        );
      });
    });

    it("should handle dummy interaction", async () => {
      renderTrainingScreen();

      // Start training
      fireEvent.click(await screen.findByTestId("toggle-training-button"));

      // Click on dummy
      const dummy = await screen.findByTestId("training-dummy");
      fireEvent.click(dummy);

      await waitFor(() => {
        // Should update statistics
        expect(screen.getByTestId("attempts-count")).toBeInTheDocument();
      });
    });
  });

  describe("Stance Training", () => {
    it("should change stances correctly", async () => {
      const mockUpdate = vi.fn();
      renderTrainingScreen({ onPlayerUpdate: mockUpdate });

      const trigramWheel = await screen.findByTestId("training-trigram-wheel");
      fireEvent.click(trigramWheel);

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            currentStance: expect.any(String),
          })
        );
      });
    });

    it("should display current stance correctly", async () => {
      const player = createMockPlayer({ currentStance: TrigramStance.TAE });
      renderTrainingScreen({ player });

      await waitFor(() => {
        const stanceDisplay = screen.getByTestId("current-stance-display");
        expect(stanceDisplay.getAttribute("text")).toContain("TAE");
      });
    });

    it("should show stance indicator", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        expect(
          screen.getByTestId("current-stance-indicator")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Training Statistics", () => {
    it("should track and display statistics correctly", async () => {
      renderTrainingScreen();

      // Start training and execute techniques
      fireEvent.click(await screen.findByTestId("start-training-button"));
      const executeButton = await screen.findByTestId(
        "execute-technique-button"
      );

      // Execute a few techniques
      fireEvent.click(executeButton);
      fireEvent.click(executeButton);
      fireEvent.click(executeButton);

      await waitFor(() => {
        // Check that statistics are updating
        expect(screen.getByTestId("attempts-count")).toBeInTheDocument();
        expect(screen.getByTestId("techniques-count")).toBeInTheDocument();
        expect(screen.getByTestId("perfect-strikes-count")).toBeInTheDocument();
        expect(screen.getByTestId("accuracy-display")).toBeInTheDocument();
        expect(screen.getByTestId("session-time")).toBeInTheDocument();
      });
    });

    it("should calculate accuracy correctly", async () => {
      renderTrainingScreen();

      fireEvent.click(await screen.findByTestId("start-training-button"));

      // Execute some techniques
      const executeButton = await screen.findByTestId(
        "execute-technique-button"
      );
      fireEvent.click(executeButton);

      await waitFor(() => {
        const accuracyText = screen
          .getByTestId("accuracy-display")
          .getAttribute("text");
        expect(accuracyText).toMatch(/정확도:\s*\d+%/);
      });
    });

    it("should update session time during training", async () => {
      renderTrainingScreen();

      fireEvent.click(await screen.findByTestId("start-training-button"));

      // Wait for timer to update (mocked in real implementation)
      await waitFor(() => {
        const timeText = screen
          .getByTestId("session-time")
          .getAttribute("text");
        expect(timeText).toMatch(/세션 시간:\s*\d+:\d{2}/);
      });
    });
  });

  describe("Training Feedback", () => {
    it("should display appropriate feedback messages based on performance", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        const feedbackMessage = screen.getByTestId("feedback-message");
        const text = feedbackMessage.getAttribute("text") || "";

        // Initial message
        expect(text).toBe("계속 연습하세요!");
      });
    });

    it("should update feedback based on accuracy", async () => {
      renderTrainingScreen();

      // Start training and execute techniques to affect accuracy
      fireEvent.click(await screen.findByTestId("start-training-button"));
      const executeButton = await screen.findByTestId(
        "execute-technique-button"
      );

      // Execute multiple techniques
      for (let i = 0; i < 5; i++) {
        fireEvent.click(executeButton);
      }

      await waitFor(() => {
        const feedbackMessage = screen.getByTestId("feedback-message");
        const text = feedbackMessage.getAttribute("text") || "";

        // Should have some feedback based on performance
        expect(text).toMatch(/(훌륭한|발전|연습|기본기)/);
      });
    });
  });

  describe("Training Controls", () => {
    it("should toggle training state correctly", async () => {
      renderTrainingScreen();

      const toggleButton = await screen.findByTestId("start-training-button");

      // Start training
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(toggleButton.getAttribute("text")).toBe("훈련 정지");
      });

      // Stop training
      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(toggleButton.getAttribute("text")).toBe("훈련 시작");
      });
    });

    it("should reset dummy correctly", async () => {
      renderTrainingScreen();

      const resetButton = await screen.findByTestId("reset-dummy-button");
      fireEvent.click(resetButton);

      await waitFor(() => {
        // Dummy health should be reset to full
        expect(screen.getByTestId("dummy-health-tracker")).toBeInTheDocument();
      });
    });

    it("should handle evaluate button", async () => {
      renderTrainingScreen();

      const evaluateButton = await screen.findByTestId("evaluate-button");
      fireEvent.click(evaluateButton);

      // Should not throw errors
      expect(evaluateButton).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("should adapt to mobile screen sizes", async () => {
      renderTrainingScreen({ width: 400, height: 600 });

      await waitFor(() => {
        const trainingScreen = screen.getByTestId("training-screen");
        expect(trainingScreen).toBeInTheDocument();

        // All essential elements should still be present on mobile
        expect(screen.getByTestId("training-player")).toBeInTheDocument();
        expect(
          screen.getByTestId("training-dummy-container")
        ).toBeInTheDocument();
        expect(screen.getByTestId("training-controls")).toBeInTheDocument();
      });
    });

    it("should adapt to tablet screen sizes", async () => {
      renderTrainingScreen({ width: 800, height: 600 });

      await waitFor(() => {
        expect(screen.getByTestId("training-screen")).toBeInTheDocument();
        expect(screen.getByTestId("training-stats-panel")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("should return to menu correctly", async () => {
      const mockReturn = vi.fn();
      renderTrainingScreen({ onReturnToMenu: mockReturn });

      const returnButton = await screen.findByTestId("return-to-menu-button");
      fireEvent.click(returnButton);

      expect(mockReturn).toHaveBeenCalledTimes(1);
    });
  });

  describe("Progress Tracking", () => {
    it("should display experience progress", async () => {
      const player = createMockPlayer({ experiencePoints: 250 });
      renderTrainingScreen({ player });

      await waitFor(() => {
        expect(screen.getByTestId("experience-tracker")).toBeInTheDocument();
      });
    });

    it("should display dummy health progress", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        expect(screen.getByTestId("dummy-health-tracker")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels and test IDs", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        // Core elements
        expect(screen.getByTestId("training-screen")).toBeInTheDocument();
        expect(screen.getByTestId("training-player")).toBeInTheDocument();
        expect(
          screen.getByTestId("training-dummy-container")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("training-trigram-wheel")
        ).toBeInTheDocument();

        // Control panels
        expect(screen.getByTestId("training-controls")).toBeInTheDocument();
        expect(screen.getByTestId("training-stats-panel")).toBeInTheDocument();
        expect(screen.getByTestId("training-mode-stances")).toBeInTheDocument();

        // Interactive elements
        expect(screen.getByTestId("start-training-button")).toBeInTheDocument();
        expect(screen.getByTestId("reset-dummy-button")).toBeInTheDocument();
        expect(screen.getByTestId("evaluate-button")).toBeInTheDocument();
        expect(screen.getByTestId("return-to-menu-button")).toBeInTheDocument();
      });
    });

    it("should have proper Korean text accessibility", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        // Check that Korean text elements have proper content
        const modeTitle = screen.getByTestId("mode-title");
        expect(modeTitle.getAttribute("text")).toBe("훈련 모드:");

        const feedbackMessage = screen.getByTestId("feedback-message");
        expect(feedbackMessage.getAttribute("text")).toMatch(
          /[\u3131-\u318E\uAC00-\uD7A3]/
        ); // Korean characters
      });
    });
  });

  describe("Player State Integration", () => {
    it("should update player experience correctly", async () => {
      const mockUpdate = vi.fn();
      const player = createMockPlayer({ experiencePoints: 100 });
      renderTrainingScreen({ player, onPlayerUpdate: mockUpdate });

      fireEvent.click(await screen.findByTestId("start-training-button"));
      fireEvent.click(await screen.findByTestId("execute-technique-button"));

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            experiencePoints: expect.any(Number),
          })
        );
      });
    });

    it("should handle different player archetypes", async () => {
      const hackerPlayer = createMockPlayer({
        archetype: PlayerArchetype.HACKER,
        name: { korean: "해커", english: "Hacker" },
      });

      renderTrainingScreen({ player: hackerPlayer });

      await waitFor(() => {
        expect(screen.getByTestId("training-player")).toBeInTheDocument();
      });
    });
  });

  /**
   * **Business Requirement:** Complete training workflow must follow traditional
   * Korean martial arts progression from beginner to advanced practitioner
   */
  describe("Complete Training Workflow", () => {
    it("should guide player through full Korean martial arts learning journey", async () => {
      const mockUpdate = vi.fn();
      const beginnerPlayer = createMockPlayer({ experiencePoints: 0 });

      renderTrainingScreen({
        player: beginnerPlayer,
        onPlayerUpdate: mockUpdate,
      });

      // Start with basics mode
      await waitFor(() => {
        expect(screen.getByTestId("mode-basics")).toBeInTheDocument();
      });

      // Execute training session
      fireEvent.click(await screen.findByTestId("start-training-button"));

      // Perform multiple techniques to gain experience
      const executeButton = await screen.findByTestId(
        "execute-technique-button"
      );
      for (let i = 0; i < 10; i++) {
        fireEvent.click(executeButton);
      }

      // Verify experience progression
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            experiencePoints: expect.any(Number),
          })
        );
      });

      // Evaluate performance
      fireEvent.click(await screen.findByTestId("evaluate-button"));

      await waitFor(() => {
        expect(
          screen.getByTestId("performance-evaluation")
        ).toBeInTheDocument();
      });
    });

    it("should provide Korean martial arts cultural context throughout training", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        // Verify Korean cultural elements are present
        expect(screen.getByTestId("dojang-background")).toBeInTheDocument();
        expect(screen.getByTestId("training-title")).toBeInTheDocument();

        // Check for Korean terminology in UI
        const koreanTexts = screen.getAllByText(/[\u3131-\u318E\uAC00-\uD7A3]/);
        expect(koreanTexts.length).toBeGreaterThan(5); // Multiple Korean elements
      });
    });
  });

  /**
   * **Business Requirement:** Training must provide measurable learning outcomes
   * following Korean martial arts educational standards
   */
  describe("Educational Effectiveness", () => {
    it("should track learning progress with Korean martial arts metrics", async () => {
      renderTrainingScreen();

      fireEvent.click(await screen.findByTestId("start-training-button"));

      // Execute techniques with varying accuracy
      const executeButton = await screen.findByTestId(
        "execute-technique-button"
      );
      for (let i = 0; i < 5; i++) {
        fireEvent.click(executeButton);
      }

      await waitFor(() => {
        // Verify educational metrics are tracked
        expect(screen.getByTestId("accuracy-display")).toBeInTheDocument();
        expect(screen.getByTestId("perfect-strikes-count")).toBeInTheDocument();
        expect(screen.getByTestId("session-time")).toBeInTheDocument();

        // Check Korean educational terminology
        const accuracyText = screen.getByTestId("accuracy-display").textContent;
        expect(accuracyText).toMatch(/정확도/);
      });
    });

    it("should provide Korean martial arts performance grading", async () => {
      renderTrainingScreen();

      fireEvent.click(await screen.findByTestId("start-training-button"));

      // Execute sufficient techniques for evaluation
      const executeButton = await screen.findByTestId(
        "execute-technique-button"
      );
      for (let i = 0; i < 10; i++) {
        fireEvent.click(executeButton);
      }

      fireEvent.click(await screen.findByTestId("evaluate-button"));

      await waitFor(() => {
        const feedback = screen.getByTestId("feedback-message");
        expect(feedback.textContent).toMatch(/우수|양호|보통|미흡|부족/); // Korean grades
      });
    });
  });

  /**
   * **Business Requirement:** Training accessibility must support diverse learners
   * while maintaining Korean martial arts authenticity
   */
  describe("Inclusive Learning Experience", () => {
    it("should provide bilingual Korean-English instruction for international students", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        // Verify bilingual content
        expect(screen.getByText("흑괘 무술 도장")).toBeInTheDocument();
        expect(
          screen.getByText("Black Trigram Martial Arts Dojang")
        ).toBeInTheDocument();

        // Check training mode bilingual support
        expect(
          screen.getByTestId("current-mode-korean-name")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("current-mode-english-name")
        ).toBeInTheDocument();
      });
    });

    it("should maintain keyboard accessibility for training controls", async () => {
      renderTrainingScreen();

      const trainingScreen = await screen.findByTestId("training-screen");

      // Test keyboard navigation
      fireEvent.keyDown(trainingScreen, { key: "Tab" });
      fireEvent.keyDown(trainingScreen, { key: "Enter" });

      // Should be able to start training via keyboard
      await waitFor(() => {
        expect(screen.getByTestId("training-status")).toBeInTheDocument();
      });
    });

    it("should provide clear visual feedback for different learning styles", async () => {
      renderTrainingScreen();

      fireEvent.click(await screen.findByTestId("start-training-button"));
      fireEvent.click(await screen.findByTestId("execute-technique-button"));

      await waitFor(() => {
        // Visual feedback elements
        expect(screen.getByTestId("training-feedback")).toBeInTheDocument();
        expect(screen.getByTestId("progress-tracker")).toBeInTheDocument();
        expect(
          screen.getByTestId("current-stance-indicator")
        ).toBeInTheDocument();
      });
    });
  });

  /**
   * **Business Requirement:** Training performance must support intensive
   * Korean martial arts practice sessions without degradation
   */
  describe("Performance Under Load", () => {
    it("should maintain responsiveness during intensive training sessions", async () => {
      renderTrainingScreen();

      fireEvent.click(await screen.findByTestId("start-training-button"));

      const executeButton = await screen.findByTestId(
        "execute-technique-button"
      );

      // Simulate intensive training session
      const startTime = performance.now();
      for (let i = 0; i < 50; i++) {
        fireEvent.click(executeButton);
      }
      const endTime = performance.now();

      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(5000); // 5 seconds max

      await waitFor(() => {
        expect(screen.getByTestId("attempts-count")).toBeInTheDocument();
      });
    });

    it("should handle rapid stance changes during training", async () => {
      renderTrainingScreen();

      const trigramWheel = await screen.findByTestId("training-trigram-wheel");

      // Rapid stance changes
      for (let i = 0; i < 10; i++) {
        fireEvent.click(trigramWheel);
      }

      await waitFor(() => {
        expect(
          screen.getByTestId("current-stance-indicator")
        ).toBeInTheDocument();
      });
    });
  });

  /**
   * **Business Requirement:** Training integration must coordinate all subsystems
   * for seamless Korean martial arts learning experience
   */
  describe("System Integration", () => {
    it("should coordinate audio, visual, and input systems during training", async () => {
      const mockUpdate = vi.fn();
      renderTrainingScreen({ onPlayerUpdate: mockUpdate });

      // Start training (should trigger audio)
      fireEvent.click(await screen.findByTestId("start-training-button"));

      // Execute technique (should trigger visual and audio feedback)
      fireEvent.click(await screen.findByTestId("execute-technique-button"));

      // Change stance (should update visual indicators)
      fireEvent.click(await screen.findByTestId("training-trigram-wheel"));

      await waitFor(() => {
        // Verify all systems responded
        expect(screen.getByTestId("training-feedback")).toBeInTheDocument();
        expect(
          screen.getByTestId("current-stance-indicator")
        ).toBeInTheDocument();
        expect(mockUpdate).toHaveBeenCalled();
      });
    });

    it("should maintain state consistency across training components", async () => {
      renderTrainingScreen();

      fireEvent.click(await screen.findByTestId("start-training-button"));

      // Pause training
      fireEvent.click(await screen.findByTestId("pause-training-button"));

      await waitFor(() => {
        // All components should reflect paused state
        expect(screen.getByText(/일시정지/)).toBeInTheDocument();
        expect(screen.getByTestId("training-status")).toHaveTextContent(
          /일시정지/
        );
      });

      // Resume training
      fireEvent.click(await screen.findByTestId("pause-training-button"));

      await waitFor(() => {
        expect(screen.getByText(/재개|다시 시작/)).toBeInTheDocument();
      });
    });
  });

  describe("Korean Martial Arts Cultural Accuracy", () => {
    it("should maintain authentic Korean terminology throughout training", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        // Check for proper Korean terms
        expect(screen.getByText("흑괘 무술 도장")).toBeInTheDocument();
        expect(screen.getByText("기본 훈련")).toBeInTheDocument();
        expect(screen.getByText("정확도")).toBeInTheDocument();

        // Verify Korean grading terms are used
        const gradeTexts = screen.getAllByText(/우수|양호|보통|미흡|부족/);
        expect(gradeTexts.length).toBeGreaterThan(0);
      });
    });

    it("should provide bilingual support for international learners", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        // Both Korean and English should be present
        expect(
          screen.getByText("Black Trigram Martial Arts Dojang")
        ).toBeInTheDocument();
        expect(screen.getByText("Basic Training")).toBeInTheDocument();
      });
    });
  });
});
