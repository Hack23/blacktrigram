/**
 * Unit tests for TrainingTopHUD component
 * Tests the top side HUD containing training controls, archetype selector, and mode selector
 *
 * @korean TrainingTopHUD 단위 테스트 - 훈련 제어, 원형 선택, 모드 선택 테스트
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PlayerArchetype } from "../../../../../types/common";
import { TrainingTopHUD } from "./TrainingTopHUD";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock the child components
vi.mock("../TrainingControlsOverlayHtml", () => ({
  default: ({
    isTraining,
    isMobile,
  }: {
    isTraining: boolean;
    isMobile: boolean;
  }) => (
    <div
      data-testid="mock-training-controls"
      data-is-training={isTraining}
      data-mobile={isMobile}
    >
      Training Controls
    </div>
  ),
}));

vi.mock("../TrainingButtonsOverlayHtml", () => ({
  ArchetypeSelectionButtons: ({
    selectedArchetype,
    isMobile,
  }: {
    selectedArchetype: string;
    isMobile: boolean;
  }) => (
    <div
      data-testid="mock-archetype-buttons"
      data-selected={selectedArchetype}
      data-mobile={isMobile}
    >
      Archetype Buttons
    </div>
  ),
  ReturnToMenuButton: ({
    onClick,
    isMobile,
  }: {
    onClick: () => void;
    isMobile: boolean;
  }) => (
    <button
      data-testid="mock-return-button"
      data-mobile={isMobile}
      onClick={onClick}
    >
      Return to Menu
    </button>
  ),
}));

vi.mock("../TrainingModeSelectorOverlayHtml", () => ({
  default: ({
    currentMode,
    isMobile,
  }: {
    currentMode: string;
    isMobile: boolean;
  }) => (
    <div
      data-testid="mock-mode-selector"
      data-mode={currentMode}
      data-mobile={isMobile}
    >
      Mode Selector
    </div>
  ),
}));

describe("TrainingTopHUD", () => {
  const defaultProps = {
    width: 1200,
    height: 800,
    isMobile: false,
    positionScale: 1.0,
    isTraining: false,
    onStartTraining: vi.fn(),
    onStopTraining: vi.fn(),
    selectedArchetype: PlayerArchetype.MUSA,
    onArchetypeSelect: vi.fn(),
    overlayVisible: false,
    onReturnToMenu: vi.fn(),
    onPlaySFX: vi.fn(),
  };

  describe("Basic Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<TrainingTopHUD {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it("should render top HUD container with correct testid", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(screen.getByTestId("training-top-hud")).toBeInTheDocument();
    });

    it("should render left section with correct testid", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(
        screen.getByTestId("training-top-hud-left-section"),
      ).toBeInTheDocument();
    });

    it("should render center section with correct testid", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(
        screen.getByTestId("training-top-hud-center-section"),
      ).toBeInTheDocument();
    });

    it("should render training controls component", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-training-controls")).toBeInTheDocument();
    });

    it("should render archetype buttons component", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-archetype-buttons")).toBeInTheDocument();
    });

    it("should render right section with correct testid", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(
        screen.getByTestId("training-top-hud-right-section"),
      ).toBeInTheDocument();
    });

    it("should render return to menu button", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-return-button")).toBeInTheDocument();
    });

    it("should render vital point hint when overlay not visible", () => {
      render(<TrainingTopHUD {...defaultProps} overlayVisible={false} />);
      expect(screen.getByTestId("vital-point-hint")).toBeInTheDocument();
    });

    it("should hide vital point hint when overlay is visible", () => {
      render(<TrainingTopHUD {...defaultProps} overlayVisible={true} />);
      expect(screen.queryByTestId("vital-point-hint")).not.toBeInTheDocument();
    });

    it("should show V key instruction", () => {
      render(<TrainingTopHUD {...defaultProps} overlayVisible={false} />);
      expect(screen.getByText("V")).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should pass isTraining to training controls", () => {
      render(<TrainingTopHUD {...defaultProps} isTraining={true} />);
      expect(screen.getByTestId("mock-training-controls")).toHaveAttribute(
        "data-is-training",
        "true",
      );
    });

    it("should pass selectedArchetype to archetype buttons", () => {
      render(
        <TrainingTopHUD
          {...defaultProps}
          selectedArchetype={PlayerArchetype.AMSALJA}
        />,
      );
      expect(screen.getByTestId("mock-archetype-buttons")).toHaveAttribute(
        "data-selected",
        PlayerArchetype.AMSALJA,
      );
    });

    it("should pass isMobile to child components (mobile hides archetype)", () => {
      render(<TrainingTopHUD {...defaultProps} isMobile={true} />);

      expect(screen.getByTestId("mock-training-controls")).toHaveAttribute(
        "data-mobile",
        "true",
      );
      // Archetype buttons are hidden on mobile (moved to BottomHUD)
      expect(
        screen.queryByTestId("mock-archetype-buttons"),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("mock-return-button")).toHaveAttribute(
        "data-mobile",
        "true",
      );
    });

    it("should show archetype buttons on desktop", () => {
      render(<TrainingTopHUD {...defaultProps} isMobile={false} />);
      expect(screen.getByTestId("mock-archetype-buttons")).toBeInTheDocument();
    });
  });

  describe("Return to Menu Button", () => {
    it("should call onReturnToMenu when clicked", async () => {
      const onReturnToMenu = vi.fn();
      render(
        <TrainingTopHUD {...defaultProps} onReturnToMenu={onReturnToMenu} />,
      );

      const button = screen.getByTestId("mock-return-button");
      button.click();
      expect(onReturnToMenu).toHaveBeenCalledTimes(1);
    });

    it("should pass isMobile to return button", () => {
      render(<TrainingTopHUD {...defaultProps} isMobile={true} />);
      expect(screen.getByTestId("mock-return-button")).toHaveAttribute(
        "data-mobile",
        "true",
      );
    });
  });

  describe("Layout", () => {
    it("should use flex row layout", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      const container = screen.getByTestId("training-top-hud");
      expect(container).toHaveStyle({
        display: "flex",
        flexDirection: "row",
      });
    });

    it("should span full width", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      const container = screen.getByTestId("training-top-hud");
      expect(container).toHaveStyle({ width: "100%" });
    });

    it("should have pointerEvents none on container", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      const container = screen.getByTestId("training-top-hud");
      expect(container).toHaveStyle({ pointerEvents: "none" });
    });
  });

  describe("Bilingual Text", () => {
    it("should display Korean archetype label", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(screen.getByText(/원형/)).toBeInTheDocument();
    });

    it("should display English archetype label", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      // Use getAllByText since both label and mocked component contain "Archetype"
      const elements = screen.getAllByText(/Archetype/);
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});
