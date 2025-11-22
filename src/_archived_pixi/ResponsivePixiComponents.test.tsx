import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ResponsivePixiButton,
  ResponsivePixiPanel,
  ResponsivePixiContainer,
} from "./ResponsivePixiComponents";
import { renderWithPixi } from "../../../test/test-utils";

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
          testId="test-button"
          x={0}
          y={0}
        />
      );

      expect(screen.getByTestId("test-button")).toBeTruthy();
      const txt = screen.getByTestId("test-button-text");
      expect(txt.getAttribute("text")).toBe("Test Button");
    });

    it("should handle click events", () => {
      const handleClick = vi.fn();
      renderWithPixi(
        <ResponsivePixiButton
          text="Click"
          testId="clickable-button"
          onClick={handleClick}
        />
      );
      fireEvent.click(screen.getByTestId("clickable-button"));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe("ResponsivePixiPanel", () => {
    it("should render panel with title", () => {
      renderWithPixi(
        <ResponsivePixiPanel title="Test Panel" testId="test-panel">
          <div>Panel Content</div>
        </ResponsivePixiPanel>
      );
      expect(screen.getByTestId("test-panel")).toBeTruthy();
      const title = screen.getByTestId("test-panel-title");
      expect(title.getAttribute("text")).toBe("Test Panel");
      expect(screen.getByText("Panel Content")).toBeTruthy();
    });
  });

  describe("ResponsivePixiContainer", () => {
    it("should render container with children", () => {
      renderWithPixi(
        <ResponsivePixiContainer testId="test-container">
          <div>Child</div>
        </ResponsivePixiContainer>
      );
      expect(screen.getByTestId("test-container")).toBeTruthy();
      expect(screen.getByText("Child")).toBeTruthy();
    });
  });
});
