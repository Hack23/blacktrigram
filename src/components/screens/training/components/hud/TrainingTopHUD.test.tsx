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

vi.mock("../../../../shared/ui/VolumeControl", () => ({
  VolumeControl: ({
    position,
    compact,
  }: {
    position: string;
    compact: boolean;
  }) => (
    <div
      data-testid="mock-volume-control"
      data-position={position}
      data-compact={compact}
    >
      Volume Control
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
    currentMode: "basics" as const,
    onModeChange: vi.fn(),
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

    it("should render mode section with correct testid", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(
        screen.getByTestId("training-top-hud-mode-section"),
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

    it("should render mode selector component", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-mode-selector")).toBeInTheDocument();
    });

    it("should render right section with correct testid", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(
        screen.getByTestId("training-top-hud-right-section"),
      ).toBeInTheDocument();
    });

    it("should render volume control component", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-volume-control")).toBeInTheDocument();
    });

    it("should render return to menu button", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-return-button")).toBeInTheDocument();
    });
  });

  describe("Vital Point Hint", () => {
    it("should show vital point hint when overlay is not visible", () => {
      render(<TrainingTopHUD {...defaultProps} overlayVisible={false} />);
      expect(screen.getByText(/급소 오버레이/)).toBeInTheDocument();
      expect(screen.getByText(/Vital Point Overlay/)).toBeInTheDocument();
    });

    it("should hide vital point hint when overlay is visible", () => {
      render(<TrainingTopHUD {...defaultProps} overlayVisible={true} />);
      expect(screen.queryByText(/급소 오버레이/)).not.toBeInTheDocument();
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

    it("should pass currentMode to mode selector", () => {
      render(<TrainingTopHUD {...defaultProps} currentMode="vital_point" />);
      expect(screen.getByTestId("mock-mode-selector")).toHaveAttribute(
        "data-mode",
        "vital_point",
      );
    });

    it("should pass isMobile to all child components", () => {
      render(<TrainingTopHUD {...defaultProps} isMobile={true} />);

      expect(screen.getByTestId("mock-training-controls")).toHaveAttribute(
        "data-mobile",
        "true",
      );
      expect(screen.getByTestId("mock-archetype-buttons")).toHaveAttribute(
        "data-mobile",
        "true",
      );
      expect(screen.getByTestId("mock-mode-selector")).toHaveAttribute(
        "data-mobile",
        "true",
      );
      expect(screen.getByTestId("mock-return-button")).toHaveAttribute(
        "data-mobile",
        "true",
      );
      expect(screen.getByTestId("mock-volume-control")).toHaveAttribute(
        "data-compact",
        "true",
      );
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

  describe("Volume Control", () => {
    it("should render volume control in top-right position", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-volume-control")).toHaveAttribute(
        "data-position",
        "top-right",
      );
    });

    it("should pass compact mode based on isMobile", () => {
      render(<TrainingTopHUD {...defaultProps} isMobile={false} />);
      expect(screen.getByTestId("mock-volume-control")).toHaveAttribute(
        "data-compact",
        "false",
      );
    });
  });

  describe("Layout", () => {
    it("should use flex column layout", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      const container = screen.getByTestId("training-top-hud");
      expect(container).toHaveStyle({
        display: "flex",
        flexDirection: "column",
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
      expect(screen.getByText(/원형 선택/)).toBeInTheDocument();
    });

    it("should display English archetype label", () => {
      render(<TrainingTopHUD {...defaultProps} />);
      // Use getAllByText since both label and mocked component contain "Archetype"
      const elements = screen.getAllByText(/Archetype/);
      expect(elements.length).toBeGreaterThan(0);
    });
  });
});
