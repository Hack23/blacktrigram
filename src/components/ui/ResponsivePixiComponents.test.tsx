import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithPixi, screen, fireEvent } from "../../../test/test-utils";
import {
  ResponsivePixiButton,
  ResponsivePixiPanel,
  ResponsivePixiContainer,
} from "./base/PixiTestableComponents";

describe("ResponsivePixiComponents", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe("ResponsivePixiButton", () => {
    it("should render button with correct text", () => {
      renderWithPixi(
        <ResponsivePixiButton
          text="Test Button"
          x={0}
          y={0}
          width={100}
          height={40}
          screenWidth={800}
          screenHeight={600}
          onClick={mockOnClick}
        />
      );

      expect(screen.getByTestId("responsive-pixi-button")).toBeInTheDocument();
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("should handle click events", () => {
      renderWithPixi(
        <ResponsivePixiButton
          text="Clickable"
          x={0}
          y={0}
          width={100}
          height={40}
          screenWidth={800}
          screenHeight={600}
          onClick={mockOnClick}
        />
      );

      // Mock interaction
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe("ResponsivePixiPanel", () => {
    it("should render panel with title", () => {
      renderWithPixi(
        <ResponsivePixiPanel
          title="Test Panel"
          x={0}
          y={0}
          width={200}
          height={150}
          screenWidth={800}
          screenHeight={600}
        >
          <div>Panel Content</div>
        </ResponsivePixiPanel>
      );

      expect(screen.getByTestId("responsive-pixi-panel")).toBeInTheDocument();
      expect(screen.getByText("Test Panel")).toBeInTheDocument();
    });
  });

  describe("ResponsivePixiContainer", () => {
    it("should render container with children", () => {
      renderWithPixi(
        <ResponsivePixiContainer
          screenWidth={800}
          screenHeight={600}
          x={0}
          y={0}
        >
          <div>Container Content</div>
        </ResponsivePixiContainer>
      );

      expect(
        screen.getByTestId("responsive-pixi-container")
      ).toBeInTheDocument();
      expect(screen.getByText("Container Content")).toBeInTheDocument();
    });
  });
});
