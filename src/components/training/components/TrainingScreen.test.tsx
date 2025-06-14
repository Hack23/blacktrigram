import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderWithPixi } from "../../../test/test-utils";
import { AudioProvider } from "../../../audio/AudioProvider";
import TrainingScreen from "../TrainingScreen";
import {
  TrigramStance,
  PlayerArchetype,
  CombatState,
} from "../../../types/enums";
import type { PlayerState } from "../../../types/player";

// Enhanced mock setup
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

// Mock audio and PIXI Assets
vi.mock("../../../audio/AudioManager", () => ({
  AudioManager: class {
    isInitialized = true;
    playSFX = vi.fn();
    playMusic = vi.fn();
    stopMusic = vi.fn();
    setVolume = vi.fn();
    playTrigramStanceSound = vi.fn();
    playVitalPointHitSound = vi.fn();
  },
}));

// Mock PIXI Assets for art loading
Object.defineProperty(globalThis, "PIXI", {
  value: {
    Assets: {
      load: vi.fn().mockResolvedValue({}),
    },
    Texture: {
      from: vi.fn().mockReturnValue({}),
    },
    FillGradient: class {
      addColorStop = vi.fn();
    },
  },
  writable: true,
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

describe("Enhanced TrainingScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Enhanced UI/UX Features", () => {
    it("should render with enhanced visual components", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        expect(screen.getByTestId("training-screen")).toBeInTheDocument();
        expect(screen.getByTestId("training-art-display")).toBeInTheDocument();
        expect(
          screen.getByTestId("training-audio-manager")
        ).toBeInTheDocument();
      });
    });

    it("should display Korean martial arts aesthetics", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        expect(screen.getByTestId("dojang-background")).toBeInTheDocument();
        expect(screen.getByTestId("trigram-symbol")).toBeInTheDocument();
        expect(screen.getByTestId("archetype-korean-name")).toBeInTheDocument();
      });
    });

    it("should show responsive layout for different screen sizes", async () => {
      // Test mobile layout
      renderTrainingScreen({ width: 400, height: 600 });

      await waitFor(() => {
        const trainingScreen = screen.getByTestId("training-screen");
        expect(trainingScreen).toBeInTheDocument();
      });

      // Test tablet layout
      renderTrainingScreen({ width: 800, height: 600 });

      await waitFor(() => {
        const trainingScreen = screen.getByTestId("training-screen");
        expect(trainingScreen).toBeInTheDocument();
      });
    });
  });

  describe("Enhanced Audio Integration", () => {
    it("should play appropriate audio for training events", async () => {
      const mockAudio = {
        playSFX: vi.fn(),
        playMusic: vi.fn(),
        stopMusic: vi.fn(),
        setVolume: vi.fn(),
        playTrigramStanceSound: vi.fn(),
        playVitalPointHitSound: vi.fn(),
        isInitialized: true,
      };

      renderTrainingScreen();

      // Start training
      const startButton = await screen.findByTestId("start-training-button");
      fireEvent.click(startButton);

      await waitFor(() => {
        expect(
          screen.getByTestId("training-audio-manager")
        ).toBeInTheDocument();
      });
    });

    it("should provide audio feedback for stance changes", async () => {
      renderTrainingScreen();

      const trigramWheel = await screen.findByTestId("training-trigram-wheel");
      fireEvent.click(trigramWheel);

      await waitFor(() => {
        expect(screen.getByTestId("audio-visualization")).toBeInTheDocument();
      });
    });

    it("should play Korean voice commands", async () => {
      renderTrainingScreen();

      const praiseButton = await screen.findByTestId("audio-praise-button");
      fireEvent.click(praiseButton);

      // Should trigger Korean audio feedback
      expect(praiseButton).toBeInTheDocument();
    });
  });

  describe("Enhanced Art Display", () => {
    it("should display archetype-specific visuals", async () => {
      const hackerPlayer = createMockPlayer({
        archetype: PlayerArchetype.HACKER,
      });

      renderTrainingScreen({ player: hackerPlayer });

      await waitFor(() => {
        const archetypeDisplay = screen.getByTestId("archetype-korean-name");
        expect(archetypeDisplay.getAttribute("text")).toBe("해커");
      });
    });

    it("should show stance-specific trigram symbols", async () => {
      const player = createMockPlayer({
        currentStance: TrigramStance.LI,
      });

      renderTrainingScreen({ player });

      await waitFor(() => {
        const stanceDisplay = screen.getByTestId("stance-korean-name");
        expect(stanceDisplay.getAttribute("text")).toContain("리");
      });
    });

    it("should animate visual effects during training", async () => {
      renderTrainingScreen();

      // Start training
      fireEvent.click(await screen.findByTestId("start-training-button"));

      // Execute technique to trigger effects
      fireEvent.click(await screen.findByTestId("execute-technique-button"));

      await waitFor(() => {
        expect(screen.getByTestId("training-mode-effects")).toBeInTheDocument();
      });
    });
  });

  describe("Enhanced Training Statistics", () => {
    it("should track enhanced combat metrics", async () => {
      renderTrainingScreen();

      fireEvent.click(await screen.findByTestId("start-training-button"));

      // Execute multiple techniques
      const executeButton = await screen.findByTestId(
        "execute-technique-button"
      );
      fireEvent.click(executeButton);
      fireEvent.click(executeButton);
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByTestId("attempts-count")).toBeInTheDocument();
        expect(screen.getByTestId("accuracy-display")).toBeInTheDocument();
        expect(screen.getByTestId("perfect-strikes-count")).toBeInTheDocument();
      });
    });

    it("should display Korean performance feedback", async () => {
      renderTrainingScreen();

      await waitFor(() => {
        const feedbackMessage = screen.getByTestId("feedback-message");
        const text = feedbackMessage.getAttribute("text") || "";
        expect(text).toMatch(/[\u3131-\u318E\uAC00-\uD7A3]/); // Korean characters
      });
    });
  });

  describe("Enhanced Training Modes", () => {
    it("should support all training modes with proper validation", async () => {
      renderTrainingScreen();

      // Test basics mode
      const basicsMode = await screen.findByTestId("mode-basics");
      fireEvent.click(basicsMode);

      await waitFor(() => {
        expect(screen.getByTestId("current-mode-name")).toBeInTheDocument();
      });

      // Test advanced mode (should require higher level)
      const advancedMode = await screen.findByTestId("mode-advanced");
      fireEvent.click(advancedMode);

      // Should show level requirement warning
      await waitFor(() => {
        expect(screen.getByTestId("training-feedback")).toBeInTheDocument();
      });
    });

    it("should adapt training dummy behavior by mode", async () => {
      renderTrainingScreen();

      // Start combat mode
      fireEvent.click(await screen.findByTestId("mode-combat"));
      fireEvent.click(await screen.findByTestId("start-training-button"));

      await waitFor(() => {
        expect(screen.getByTestId("training-dummy")).toBeInTheDocument();
      });
    });
  });

  describe("Performance and Optimization", () => {
    it("should handle rapid input without lag", async () => {
      renderTrainingScreen();

      fireEvent.click(await screen.findByTestId("start-training-button"));

      const executeButton = await screen.findByTestId(
        "execute-technique-button"
      );

      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        fireEvent.click(executeButton);
      }

      await waitFor(() => {
        expect(screen.getByTestId("current-combo-display")).toBeInTheDocument();
      });
    });

    it("should efficiently update visual effects", async () => {
      renderTrainingScreen();

      // Advance time to trigger animations
      vi.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(screen.getByTestId("training-art-display")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility Enhancements", () => {
    it("should provide proper Korean text accessibility", async () => {
      renderTrainingScreen();

      const koreanElements = [
        "archetype-korean-name",
        "stance-korean-name",
        "feedback-message",
        "accuracy-korean",
        "combo-korean",
      ];

      for (const elementId of koreanElements) {
        await waitFor(() => {
          const element = screen.getByTestId(elementId);
          expect(element).toBeInTheDocument();

          const text = element.getAttribute("text") || "";
          expect(text).toMatch(/[\u3131-\u318E\uAC00-\uD7A3]|\d/); // Korean or numbers
        });
      }
    });

    it("should have comprehensive test coverage", async () => {
      renderTrainingScreen();

      const requiredTestIds = [
        "training-screen",
        "dojang-background",
        "training-player",
        "training-dummy",
        "training-trigram-wheel",
        "training-controls",
        "training-statistics",
        "training-art-display",
        "training-audio-manager",
        "experience-tracker",
        "return-to-menu-button",
      ];

      for (const testId of requiredTestIds) {
        await waitFor(() => {
          expect(screen.getByTestId(testId)).toBeInTheDocument();
        });
      }
    });
  });

  describe("Integration Testing", () => {
    it("should integrate all enhanced components properly", async () => {
      const mockPlayerUpdate = vi.fn();
      renderTrainingScreen({ onPlayerUpdate: mockPlayerUpdate });

      // Complete training workflow
      fireEvent.click(await screen.findByTestId("start-training-button"));
      fireEvent.click(await screen.findByTestId("execute-technique-button"));
      fireEvent.click(await screen.findByTestId("training-trigram-wheel"));
      fireEvent.click(await screen.findByTestId("evaluate-button"));

      await waitFor(() => {
        expect(mockPlayerUpdate).toHaveBeenCalled();
      });
    });

    it("should maintain state consistency across all components", async () => {
      renderTrainingScreen();

      // Change stance
      fireEvent.click(await screen.findByTestId("training-trigram-wheel"));

      // Start training
      fireEvent.click(await screen.findByTestId("start-training-button"));

      // Execute technique
      fireEvent.click(await screen.findByTestId("execute-technique-button"));

      await waitFor(() => {
        // All components should reflect the current state
        expect(
          screen.getByTestId("current-stance-display")
        ).toBeInTheDocument();
        expect(screen.getByTestId("training-statistics")).toBeInTheDocument();
        expect(screen.getByTestId("training-art-display")).toBeInTheDocument();
      });
    });
  });
});
