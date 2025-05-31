import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DojangBackground } from "./DojangBackground";

// Mock the missing Stage component
const MockStage = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="pixi-stage">{children}</div>
);

describe("DojangBackground", () => {
  it("should render without crashing", () => {
    expect(() => {
      render(
        <MockStage>
          <DojangBackground width={800} height={600} />
        </MockStage>
      );
    }).not.toThrow();
  });

  it("should handle different dimensions", () => {
    const testDimensions = [
      { width: 1024, height: 768 },
      { width: 1920, height: 1080 },
      { width: 800, height: 600 },
    ];

    testDimensions.forEach(({ width, height }) => {
      expect(() => {
        render(
          <MockStage>
            <DojangBackground width={width} height={height} />
          </MockStage>
        );
      }).not.toThrow();
    });
  });

  it("should accept custom dimensions", () => {
    const customWidth = 1024;
    const customHeight = 768;

    expect(() => {
      render(
        <MockStage>
          <DojangBackground width={customWidth} height={customHeight} />
        </MockStage>
      );
    }).not.toThrow();
  });

  it("should render consistently across multiple renders", () => {
    for (let i = 0; i < 3; i++) {
      expect(() => {
        render(
          <MockStage>
            <DojangBackground width={800} height={600} />
          </MockStage>
        );
      }).not.toThrow();
    }
  });
});
