/**
 * Unit tests for TrainingBottomHUD component
 * Tests the bottom side HUD containing technique bar and feedback messages
 *
 * @korean TrainingBottomHUD 단위 테스트 - 기술 바 및 피드백 메시지 테스트
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlayerArchetype } from "../../../../../types/common";
import { TrainingBottomHUD } from "./TrainingBottomHUD";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock the child components
vi.mock("../../../../shared/three/ui/TechniqueBarContainer", () => ({
  TechniqueBarContainer: ({
    visible,
    selectedIndex,
    isMobile,
    screenWidth,
    screenHeight,
  }: {
    visible: boolean;
    selectedIndex: number;
    isMobile: boolean;
    screenWidth: number;
    screenHeight: number;
  }) => (
    <div
      data-testid="mock-technique-bar"
      data-visible={visible}
      data-selected-index={selectedIndex}
      data-mobile={isMobile}
      data-screen-width={screenWidth}
      data-screen-height={screenHeight}
    >
      Technique Bar
    </div>
  ),
}));

vi.mock("../TrainingFeedbackOverlayHtml", () => ({
  default: ({ message, isMobile }: { message: string; isMobile: boolean }) => (
    <div
      data-testid="mock-feedback-overlay"
      data-message={message}
      data-mobile={isMobile}
    >
      {message}
    </div>
  ),
}));

describe("TrainingBottomHUD", () => {
  // Create a mock player state
  const mockPlayer = {
    id: "training-player",
    name: { korean: "훈련생", english: "Trainee" },
    archetype: PlayerArchetype.MUSA,
    health: 100,
    maxHealth: 100,
    ki: 100,
    maxKi: 100,
    stamina: 100,
    maxStamina: 100,
    energy: 100,
    maxEnergy: 100,
    attackPower: 10,
    defense: 10,
    speed: 10,
    technique: 10,
    pain: 0,
    consciousness: 100,
    balance: 100,
    momentum: 0,
    currentStance: "geon" as const,
    combatState: "idle" as const,
    position: { x: 0, y: 0 },
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
    misses: 0,
    accuracy: 0,
    comboCount: 0,
  };

  const defaultProps = {
    width: 1200,
    height: 800,
    isMobile: false,
    positionScale: 1.0,
    techniques: [] as never[],
    player: mockPlayer,
    selectedIndex: 0,
    cooldowns: new Map<string, number>(),
    onTechniqueSelect: vi.fn(),
    showFeedback: false,
    feedbackMessage: "",
  };

  describe("Basic Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<TrainingBottomHUD {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it("should render bottom HUD container with correct testid", () => {
      render(<TrainingBottomHUD {...defaultProps} />);
      expect(screen.getByTestId("training-bottom-hud")).toBeInTheDocument();
    });

    it("should render technique section with correct testid", () => {
      render(<TrainingBottomHUD {...defaultProps} />);
      expect(
        screen.getByTestId("training-bottom-hud-technique-section"),
      ).toBeInTheDocument();
    });

    it("should render technique bar component", () => {
      render(<TrainingBottomHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-technique-bar")).toBeInTheDocument();
    });
  });

  describe("Feedback Message", () => {
    it("should not show feedback when showFeedback is false", () => {
      render(<TrainingBottomHUD {...defaultProps} showFeedback={false} />);
      expect(
        screen.queryByTestId("mock-feedback-overlay"),
      ).not.toBeInTheDocument();
    });

    it("should show feedback when showFeedback is true", () => {
      render(
        <TrainingBottomHUD
          {...defaultProps}
          showFeedback={true}
          feedbackMessage="Great hit! | 좋은 타격!"
        />,
      );
      expect(screen.getByTestId("mock-feedback-overlay")).toBeInTheDocument();
    });

    it("should pass correct message to feedback overlay", () => {
      const message = "Perfect strike! | 완벽한 타격!";
      render(
        <TrainingBottomHUD
          {...defaultProps}
          showFeedback={true}
          feedbackMessage={message}
        />,
      );
      expect(screen.getByTestId("mock-feedback-overlay")).toHaveAttribute(
        "data-message",
        message,
      );
    });

    it("should pass isMobile to feedback overlay", () => {
      render(
        <TrainingBottomHUD
          {...defaultProps}
          showFeedback={true}
          feedbackMessage="Test"
          isMobile={true}
        />,
      );
      expect(screen.getByTestId("mock-feedback-overlay")).toHaveAttribute(
        "data-mobile",
        "true",
      );
    });
  });

  describe("Props Handling", () => {
    it("should pass screen dimensions to technique bar", () => {
      render(
        <TrainingBottomHUD {...defaultProps} width={1920} height={1080} />,
      );
      const bar = screen.getByTestId("mock-technique-bar");
      expect(bar).toHaveAttribute("data-screen-width", "1920");
      expect(bar).toHaveAttribute("data-screen-height", "1080");
    });

    it("should pass isMobile to technique bar", () => {
      render(<TrainingBottomHUD {...defaultProps} isMobile={true} />);
      expect(screen.getByTestId("mock-technique-bar")).toHaveAttribute(
        "data-mobile",
        "true",
      );
    });

    it("should pass selected index to technique bar", () => {
      render(<TrainingBottomHUD {...defaultProps} selectedIndex={3} />);
      expect(screen.getByTestId("mock-technique-bar")).toHaveAttribute(
        "data-selected-index",
        "3",
      );
    });

    it("should always show technique bar as visible", () => {
      render(<TrainingBottomHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-technique-bar")).toHaveAttribute(
        "data-visible",
        "true",
      );
    });
  });

  describe("Layout", () => {
    it("should use flex column layout", () => {
      render(<TrainingBottomHUD {...defaultProps} />);
      const container = screen.getByTestId("training-bottom-hud");
      expect(container).toHaveStyle({
        display: "flex",
        flexDirection: "column",
      });
    });

    it("should center items horizontally", () => {
      render(<TrainingBottomHUD {...defaultProps} />);
      const container = screen.getByTestId("training-bottom-hud");
      expect(container).toHaveStyle({ alignItems: "center" });
    });

    it("should have pointerEvents none on container", () => {
      render(<TrainingBottomHUD {...defaultProps} />);
      const container = screen.getByTestId("training-bottom-hud");
      expect(container).toHaveStyle({ pointerEvents: "none" });
    });

    it("should position at bottom of screen", () => {
      render(<TrainingBottomHUD {...defaultProps} />);
      const container = screen.getByTestId("training-bottom-hud");
      expect(container).toHaveStyle({ position: "absolute", bottom: "0px" });
    });

    it("should span full width", () => {
      render(<TrainingBottomHUD {...defaultProps} />);
      const container = screen.getByTestId("training-bottom-hud");
      expect(container).toHaveStyle({ width: "100%" });
    });
  });

  describe("Technique Section", () => {
    it("should have pointer-events all to allow interaction", () => {
      render(<TrainingBottomHUD {...defaultProps} />);
      const section = screen.getByTestId(
        "training-bottom-hud-technique-section",
      );
      expect(section).toHaveStyle({ pointerEvents: "all" });
    });
  });
});
