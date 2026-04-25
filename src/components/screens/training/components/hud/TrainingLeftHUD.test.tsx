/**
 * Unit tests for TrainingLeftHUD component
 * Tests the left side HUD containing anatomy controls and guard indicator
 *
 * @korean TrainingLeftHUD 단위 테스트 - 해부학 표시 및 가드 표시기 테스트
 */

import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TrainingLeftHUD } from "./TrainingLeftHUD";

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock the child components
vi.mock("../AnatomyControlsOverlayHtml", () => ({
  default: ({ isMobile, width }: { isMobile: boolean; width?: number }) => (
    <div
      data-testid="mock-anatomy-controls"
      data-mobile={isMobile}
      data-width={width ?? ""}
    >
      Anatomy Controls
    </div>
  ),
}));

vi.mock("../../../../shared/three/indicators/GuardIndicator", () => ({
  GuardIndicator: ({
    currentStance,
    isInGuard,
    isMobile,
  }: {
    currentStance: string;
    isInGuard: boolean;
    isMobile: boolean;
  }) => (
    <div
      data-testid="mock-guard-indicator"
      data-stance={currentStance}
      data-in-guard={isInGuard}
      data-mobile={isMobile}
    >
      Guard Indicator
    </div>
  ),
}));

describe("TrainingLeftHUD", () => {
  const defaultProps = {
    width: 1200,
    height: 800,
    isMobile: false,
    positionScale: 1.0,
    visibleAnatomyLayers: [] as (
      | "skeleton"
      | "nerves"
      | "vascular"
      | "surface"
    )[],
    onAnatomyLayerToggle: vi.fn(),
    currentStanceIndex: 0,
    isInGuard: false,
  };

  describe("Basic Rendering", () => {
    it("should render without crashing", () => {
      const { container } = render(<TrainingLeftHUD {...defaultProps} />);
      expect(container).toBeTruthy();
    });

    it("should render left HUD container with correct testid", () => {
      render(<TrainingLeftHUD {...defaultProps} />);
      expect(screen.getByTestId("training-left-hud")).toBeInTheDocument();
    });

    it("should render anatomy section with correct testid", () => {
      render(<TrainingLeftHUD {...defaultProps} />);
      expect(
        screen.getByTestId("training-left-hud-anatomy-section"),
      ).toBeInTheDocument();
    });

    it("should render guard section with correct testid", () => {
      render(<TrainingLeftHUD {...defaultProps} />);
      expect(
        screen.getByTestId("training-left-hud-guard-section"),
      ).toBeInTheDocument();
    });

    it("should render anatomy controls component", () => {
      render(<TrainingLeftHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-anatomy-controls")).toBeInTheDocument();
    });

    it("should render guard indicator component", () => {
      render(<TrainingLeftHUD {...defaultProps} />);
      expect(screen.getByTestId("mock-guard-indicator")).toBeInTheDocument();
    });
  });

  describe("Props Handling", () => {
    it("should pass isMobile to child components", () => {
      render(<TrainingLeftHUD {...defaultProps} isMobile={true} />);

      expect(screen.getByTestId("mock-anatomy-controls")).toHaveAttribute(
        "data-mobile",
        "true",
      );
      expect(screen.getByTestId("mock-guard-indicator")).toHaveAttribute(
        "data-mobile",
        "true",
      );
    });

    it("should pass isInGuard to guard indicator", () => {
      render(<TrainingLeftHUD {...defaultProps} isInGuard={true} />);

      expect(screen.getByTestId("mock-guard-indicator")).toHaveAttribute(
        "data-in-guard",
        "true",
      );
    });

    it("should convert stance index to stance name for guard indicator", () => {
      // Stance index 0 = "geon"
      render(<TrainingLeftHUD {...defaultProps} currentStanceIndex={0} />);
      expect(screen.getByTestId("mock-guard-indicator")).toHaveAttribute(
        "data-stance",
        "geon",
      );
    });

    it("should handle different stance indices", () => {
      // Stance index 3 = "jin"
      render(<TrainingLeftHUD {...defaultProps} currentStanceIndex={3} />);
      expect(screen.getByTestId("mock-guard-indicator")).toHaveAttribute(
        "data-stance",
        "jin",
      );
    });

    it("should omit anatomy controls width when inner HUD width is non-positive", () => {
      render(<TrainingLeftHUD {...defaultProps} width={20} />);

      expect(screen.getByTestId("mock-anatomy-controls")).toHaveAttribute(
        "data-width",
        "",
      );
    });
  });

  describe("Layout", () => {
    it("should use flex column layout", () => {
      render(<TrainingLeftHUD {...defaultProps} />);
      const container = screen.getByTestId("training-left-hud");
      expect(container).toHaveStyle({
        display: "flex",
        flexDirection: "column",
      });
    });

    it("should use flex column layout", () => {
      render(<TrainingLeftHUD {...defaultProps} />);
      const container = screen.getByTestId("training-left-hud");
      expect(container).toHaveStyle({
        display: "flex",
        flexDirection: "column",
      });
    });

    it("should have pointerEvents none on container", () => {
      render(<TrainingLeftHUD {...defaultProps} />);
      const container = screen.getByTestId("training-left-hud");
      expect(container).toHaveStyle({ pointerEvents: "none" });
    });
  });

  describe("Resolution-based Layout", () => {
    it("should use resolution-based gap (width 1200px between tablet and mobile)", () => {
      render(<TrainingLeftHUD {...defaultProps} />);
      const container = screen.getByTestId("training-left-hud");
      // Gap is calculated using getResponsiveSize for width=1200
      // Between mobile (768) and tablet (1280), interpolates between 12 and 15
      // Formula: 12 + (15 - 12) * ((1200 - 768) / (1280 - 768)) = 14.53125
      expect(container).toHaveStyle({ gap: "14.53125px" });
    });

    it("should use larger gap for wider screens (width 1920px)", () => {
      render(<TrainingLeftHUD {...defaultProps} width={1920} />);
      const container = screen.getByTestId("training-left-hud");
      // At desktop width (1920px), gap is 18px * positionScale(1.0) = 18px
      expect(container).toHaveStyle({ gap: "18px" });
    });

    it("should use smaller gap for narrow screens (width 400px)", () => {
      render(<TrainingLeftHUD {...defaultProps} width={400} />);
      const container = screen.getByTestId("training-left-hud");
      // Below mobile breakpoint (768px), gap is 12px * positionScale(1.0) = 12px
      expect(container).toHaveStyle({ gap: "12px" });
    });
  });
});
