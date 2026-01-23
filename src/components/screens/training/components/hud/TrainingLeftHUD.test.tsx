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
  default: ({ isMobile }: { isMobile: boolean }) => (
    <div data-testid="mock-anatomy-controls" data-mobile={isMobile}>
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

    it("should align items to flex-start (left)", () => {
      render(<TrainingLeftHUD {...defaultProps} />);
      const container = screen.getByTestId("training-left-hud");
      expect(container).toHaveStyle({ alignItems: "flex-start" });
    });

    it("should have pointerEvents none on container", () => {
      render(<TrainingLeftHUD {...defaultProps} />);
      const container = screen.getByTestId("training-left-hud");
      expect(container).toHaveStyle({ pointerEvents: "none" });
    });
  });

  describe("Mobile Layout", () => {
    it("should use smaller gap on mobile", () => {
      render(<TrainingLeftHUD {...defaultProps} isMobile={true} />);
      const container = screen.getByTestId("training-left-hud");
      expect(container).toHaveStyle({ gap: "12px" });
    });

    it("should use larger gap on desktop", () => {
      render(<TrainingLeftHUD {...defaultProps} isMobile={false} />);
      const container = screen.getByTestId("training-left-hud");
      // 18px = 18 * positionScale(1.0) for desktop
      expect(container).toHaveStyle({ gap: "18px" });
    });
  });
});
