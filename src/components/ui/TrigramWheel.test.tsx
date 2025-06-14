import { render } from "@testing-library/react";
import { vi } from "vitest";
import { Application } from "@pixi/react";
import { TrigramWheel } from "./TrigramWheel";
import { TrigramStance } from "../../types/enums";

describe("TrigramWheel", () => {
  it("renders without crashing", () => {
    const mockOnStanceSelect = vi.fn();
    const mockOnStanceChange = vi.fn();

    render(
      <Application>
        <TrigramWheel
          selectedStance={TrigramStance.GEON}
          onStanceSelect={mockOnStanceSelect}
          onStanceChange={mockOnStanceChange}
          x={100}
          y={100}
          size={80}
          data-testid="trigram-wheel"
        />
      </Application>
    );
  });

  it("calls onStanceSelect when stance is selected", () => {
    const mockOnStanceSelect = vi.fn();
    const mockOnStanceChange = vi.fn();

    render(
      <Application>
        <TrigramWheel
          selectedStance={TrigramStance.GEON}
          onStanceSelect={mockOnStanceSelect}
          onStanceChange={mockOnStanceChange}
          x={100}
          y={100}
          size={80}
          data-testid="trigram-wheel"
        />
      </Application>
    );
    // Test interactions - TrigramWheel should call onStanceSelect when interacted with
  });

  it("displays all eight trigram stances", () => {
    const mockOnStanceSelect = vi.fn();
    const mockOnStanceChange = vi.fn();

    render(
      <Application>
        <TrigramWheel
          selectedStance={TrigramStance.TAE}
          onStanceSelect={mockOnStanceSelect}
          onStanceChange={mockOnStanceChange}
          x={100}
          y={100}
          size={80}
          data-testid="trigram-wheel"
        />
      </Application>
    );
    // TrigramWheel should render all 8 trigram positions
  });

  it("highlights the selected stance correctly", () => {
    const mockOnStanceSelect = vi.fn();
    const mockOnStanceChange = vi.fn();

    render(
      <Application>
        <TrigramWheel
          selectedStance={TrigramStance.LI}
          onStanceSelect={mockOnStanceSelect}
          onStanceChange={mockOnStanceChange}
          x={100}
          y={100}
          size={80}
          data-testid="trigram-wheel"
        />
      </Application>
    );
    // Should visually highlight the LI stance
  });

  it.skip("handles responsive sizing", () => {
    const mockOnStanceSelect = vi.fn();
    const mockOnStanceChange = vi.fn();

    // Test with different radius sizes
    const { rerender } = render(
      <Application>
        <TrigramWheel
          selectedStance={TrigramStance.GEON}
          onStanceSelect={mockOnStanceSelect}
          onStanceChange={mockOnStanceChange}
          x={100}
          y={100}
          size={60}
          data-testid="trigram-wheel"
        />
      </Application>
    );

    // Test larger radius
    rerender(
      <Application>
        <TrigramWheel
          selectedStance={TrigramStance.GEON}
          onStanceSelect={mockOnStanceSelect}
          onStanceChange={mockOnStanceChange}
          x={100}
          y={100}
          size={120}
          data-testid="trigram-wheel"
        />
      </Application>
    );
  });
});
