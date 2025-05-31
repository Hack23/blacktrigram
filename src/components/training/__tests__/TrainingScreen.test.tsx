import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
// Remove Stage import since it doesn't exist in @pixi/react
import { TrainingScreen } from "../TrainingScreen";

// Mock the missing Stage component
vi.mock("@pixi/react", () => ({
  Application: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pixi-app">{children}</div>
  ),
}));

describe("TrainingScreen", () => {
  const defaultProps = {
    onGamePhaseChange: vi.fn(),
    onStanceChange: vi.fn(),
  };

  it("should render training interface", () => {
    render(<TrainingScreen {...defaultProps} />);

    expect(screen.getByText("무술 수련장")).toBeInTheDocument();
  });
});
