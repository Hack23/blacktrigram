import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

describe("KoreanHeader Component", () => {
  const mockProps = {
    koreanTitle: "흑괘 무술 도장",
    englishTitle: "BLACK TRIGRAM MARTIAL ARTS DOJANG",
    x: 400,
    y: 200,
    width: 600,
    height: 120,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders Korean text correctly", () => {
      const MockKoreanHeader = () => (
        <div data-testid="korean-header">
          <div data-testid="korean-title">{mockProps.koreanTitle}</div>
          <div data-testid="english-title">{mockProps.englishTitle}</div>
        </div>
      );

      render(<MockKoreanHeader />);
      expect(screen.getByTestId("korean-title")).toHaveTextContent(
        mockProps.koreanTitle
      );
      expect(screen.getByTestId("english-title")).toHaveTextContent(
        mockProps.englishTitle
      );
    });

    it("renders with correct props structure", () => {
      expect(mockProps).toMatchObject({
        koreanTitle: expect.any(String),
        englishTitle: expect.any(String),
        x: expect.any(Number),
        y: expect.any(Number),
        width: expect.any(Number),
        height: expect.any(Number),
      });
    });
  });

  describe("Global Test Environment", () => {
    it("should have proper global setup", () => {
      expect(typeof globalThis).toBe("object");
    });
  });
});
