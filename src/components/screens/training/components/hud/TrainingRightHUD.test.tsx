/**
 * Unit tests for TrainingRightHUD component
 * Tests the right side HUD containing stats and vital point/footwork panels
 * Note: Volume Control and Return to Menu have been moved to TrainingTopHUD
 *
 * @korean TrainingRightHUD 단위 테스트 - 통계, 급소 선택 테스트
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TrainingRightHUD } from "./TrainingRightHUD";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock the child components
vi.mock("../TrainingStatsOverlayHtml", () => ({
  default: ({
    isMobile,
    distanceToDummy,
    effectiveReach,
  }: {
    isMobile: boolean;
    distanceToDummy: number;
    effectiveReach: number;
  }) => (
    <div
      data-testid="mock-stats-overlay"
      data-mobile={isMobile}
      data-distance={distanceToDummy}
      data-reach={effectiveReach}
    >
      Training Stats
    </div>
  ),
}));

vi.mock("../VitalPointTrainingOverlayHtml", () => ({
  default: ({
    selectedVitalPoint,
    isMobile,
  }: {
    selectedVitalPoint: string | null;
    isMobile: boolean;
  }) => (
    <div
      data-testid="mock-vital-point-overlay"
      data-selected={selectedVitalPoint ?? "none"}
      data-mobile={isMobile}
    >
      Vital Point Training
    </div>
  ),
}));

vi.mock("../FootworkDrillsOverlayHtml", () => ({
  default: ({
    currentDrill,
    currentStep,
    isActive,
    isMobile,
  }: {
    currentDrill: string;
    currentStep: number;
    isActive: boolean;
    isMobile: boolean;
  }) => (
    <div
      data-testid="mock-footwork-drills"
      data-drill={currentDrill}
      data-step={currentStep}
      data-active={isActive}
      data-mobile={isMobile}
    >
      Footwork Drills
    </div>
  ),
}));

describe("TrainingRightHUD", () => {
  const defaultProps = {
    width: 1200,
    height: 800,
    isMobile: false,
    positionScale: 1.0,
    stats: {
      score: 500,
      combo: 5,
      hits: 10,
      misses: 2,
      accuracy: 83.3,
      sessionDuration: 120,
      bestCombo: 8,
      perfectStrikes: 3,
    },
    distanceToDummy: 1.5,
    effectiveReach: 0.8,
    trainingMode: "basics" as const,
    selectedVitalPoint: null as string | null,
    onVitalPointSelect: vi.fn(),
    footworkDrillType: "circular_left" as const,
    footworkDrillStep: 0,
    footworkDrillActive: false,
    onStartFootworkDrill: vi.fn(),
    onStopFootworkDrill: vi.fn(),
    onAdvanceFootworkStep: vi.fn(),
  };

  describe("Basic Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<TrainingRightHUD {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it("should render right HUD container with correct testid", () => {
      render(<TrainingRightHUD {...defaultProps} />);
      expect(screen.getByTestId("training-right-hud")).toBeInTheDocument();
    });

    it("should render stats section with correct testid", () => {
      render(<TrainingRightHUD {...defaultProps} />);
      expect(
        screen.getByTestId("training-right-hud-stats-section"),
      ).toBeInTheDocument();
    });

    it("should render bottom section with correct testid", () => {
      render(<TrainingRightHUD {...defaultProps} />);
      expect(
        screen.getByTestId("training-right-hud-bottom-section"),
      ).toBeInTheDocument();
    });

    it("should render stats overlay", () => {
      render(<TrainingRightHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-stats-overlay")).toBeInTheDocument();
    });
  });

  describe("Training Mode Switching", () => {
    it("should show vital point overlay for basics mode", () => {
      render(<TrainingRightHUD {...defaultProps} trainingMode="basics" />);
      expect(
        screen.getByTestId("mock-vital-point-overlay"),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("mock-footwork-drills"),
      ).not.toBeInTheDocument();
    });

    it("should show vital point overlay for advanced mode", () => {
      render(<TrainingRightHUD {...defaultProps} trainingMode="advanced" />);
      expect(
        screen.getByTestId("mock-vital-point-overlay"),
      ).toBeInTheDocument();
    });

    it("should show vital point overlay for vital_point mode", () => {
      render(<TrainingRightHUD {...defaultProps} trainingMode="vital_point" />);
      expect(
        screen.getByTestId("mock-vital-point-overlay"),
      ).toBeInTheDocument();
    });

    it("should show footwork drills for footwork mode", () => {
      render(<TrainingRightHUD {...defaultProps} trainingMode="footwork" />);
      expect(screen.getByTestId("mock-footwork-drills")).toBeInTheDocument();
      expect(
        screen.queryByTestId("mock-vital-point-overlay"),
      ).not.toBeInTheDocument();
    });

    it("should show footwork drills for combo_practice mode", () => {
      render(
        <TrainingRightHUD {...defaultProps} trainingMode="combo_practice" />,
      );
      expect(
        screen.getByTestId("mock-vital-point-overlay"),
      ).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should pass isMobile to stats overlay", () => {
      render(<TrainingRightHUD {...defaultProps} isMobile={true} />);
      expect(screen.getByTestId("mock-stats-overlay")).toHaveAttribute(
        "data-mobile",
        "true",
      );
    });

    it("should pass distance to stats overlay", () => {
      render(<TrainingRightHUD {...defaultProps} distanceToDummy={2.5} />);
      expect(screen.getByTestId("mock-stats-overlay")).toHaveAttribute(
        "data-distance",
        "2.5",
      );
    });

    it("should pass effective reach to stats overlay", () => {
      render(<TrainingRightHUD {...defaultProps} effectiveReach={1.2} />);
      expect(screen.getByTestId("mock-stats-overlay")).toHaveAttribute(
        "data-reach",
        "1.2",
      );
    });

    it("should pass selected vital point to vital point overlay", () => {
      render(
        <TrainingRightHUD {...defaultProps} selectedVitalPoint="head_temple" />,
      );
      expect(screen.getByTestId("mock-vital-point-overlay")).toHaveAttribute(
        "data-selected",
        "head_temple",
      );
    });

    it("should pass footwork drill state when in footwork mode", () => {
      render(
        <TrainingRightHUD
          {...defaultProps}
          trainingMode="footwork"
          footworkDrillType="triangle_step"
          footworkDrillStep={2}
          footworkDrillActive={true}
        />,
      );
      const drills = screen.getByTestId("mock-footwork-drills");
      expect(drills).toHaveAttribute("data-drill", "triangle_step");
      expect(drills).toHaveAttribute("data-step", "2");
      expect(drills).toHaveAttribute("data-active", "true");
    });
  });

  describe("Layout", () => {
    it("should use flex column layout", () => {
      render(<TrainingRightHUD {...defaultProps} />);
      const container = screen.getByTestId("training-right-hud");
      expect(container).toHaveStyle({
        display: "flex",
        flexDirection: "column",
      });
    });

    it("should align items to flex-end (right)", () => {
      render(<TrainingRightHUD {...defaultProps} />);
      const container = screen.getByTestId("training-right-hud");
      expect(container).toHaveStyle({ alignItems: "flex-end" });
    });

    it("should have pointerEvents none on container", () => {
      render(<TrainingRightHUD {...defaultProps} />);
      const container = screen.getByTestId("training-right-hud");
      expect(container).toHaveStyle({ pointerEvents: "none" });
    });

    it("should position at right with top offset for top HUD", () => {
      render(<TrainingRightHUD {...defaultProps} />);
      const container = screen.getByTestId("training-right-hud");
      expect(container).toHaveStyle({
        position: "absolute",
        // top offset = 140px (TOP_HUD_HEIGHT_DESKTOP * positionScale)
        top: "140px",
        right: "0px",
      });
    });
  });

  describe("Mobile Layout", () => {
    it("should pass isMobile to child components", () => {
      render(<TrainingRightHUD {...defaultProps} isMobile={true} />);

      expect(screen.getByTestId("mock-stats-overlay")).toHaveAttribute(
        "data-mobile",
        "true",
      );
    });

    it("should pass isMobile to vital point overlay", () => {
      render(<TrainingRightHUD {...defaultProps} isMobile={true} />);

      expect(screen.getByTestId("mock-vital-point-overlay")).toHaveAttribute(
        "data-mobile",
        "true",
      );
    });

    it("should pass isMobile to footwork drills when in footwork mode", () => {
      render(
        <TrainingRightHUD
          {...defaultProps}
          isMobile={true}
          trainingMode="footwork"
        />,
      );

      expect(screen.getByTestId("mock-footwork-drills")).toHaveAttribute(
        "data-mobile",
        "true",
      );
    });
  });
});
