import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { InteractiveTrigramGrid } from "./InteractiveTrigramGrid";
import { TrigramStance } from "../../../../types";

describe("InteractiveTrigramGrid", () => {
  it("should render without crashing", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={vi.fn()}
      />
    );

    expect(screen.getByTestId("trigram-grid")).toBeInTheDocument();
  });

  it("should render all eight trigram buttons", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={vi.fn()}
      />
    );

    const stances = ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"];
    stances.forEach((stance) => {
      expect(
        screen.getByTestId(`trigram-grid-button-${stance}`)
      ).toBeInTheDocument();
    });
  });

  it("should display trigram symbols", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={vi.fn()}
      />
    );

    expect(screen.getByText("☰")).toBeInTheDocument(); // Geon
    expect(screen.getByText("☱")).toBeInTheDocument(); // Tae
    expect(screen.getByText("☲")).toBeInTheDocument(); // Li
  });

  it("should call onTrigramSelect when a trigram is clicked", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={handleSelect}
      />
    );

    const geonButton = screen.getByTestId("trigram-grid-button-geon");
    await user.click(geonButton);

    expect(handleSelect).toHaveBeenCalledWith(TrigramStance.GEON);
  });

  it("should show selected state for selected trigram", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={TrigramStance.GEON}
        onTrigramSelect={vi.fn()}
      />
    );

    const geonButton = screen.getByTestId("trigram-grid-button-geon");
    expect(geonButton).toHaveAttribute("aria-pressed", "true");
  });

  it("should not show selected state for unselected trigrams", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={TrigramStance.GEON}
        onTrigramSelect={vi.fn()}
      />
    );

    const taeButton = screen.getByTestId("trigram-grid-button-tae");
    expect(taeButton).toHaveAttribute("aria-pressed", "false");
  });

  it("should handle mobile layout", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={vi.fn()}
        isMobile={true}
      />
    );

    expect(screen.getByTestId("trigram-grid")).toBeInTheDocument();
  });

  it("should handle desktop layout", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByTestId("trigram-grid")).toBeInTheDocument();
  });

  it("should display Korean names", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={vi.fn()}
      />
    );

    expect(screen.getByText("건")).toBeInTheDocument();
    expect(screen.getByText("태")).toBeInTheDocument();
  });

  it("should display English names", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={vi.fn()}
      />
    );

    expect(screen.getByText("Heaven")).toBeInTheDocument();
    expect(screen.getByText("Lake")).toBeInTheDocument();
  });

  it("should display Chinese characters", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={vi.fn()}
      />
    );

    expect(screen.getByText("天")).toBeInTheDocument();
    expect(screen.getByText("澤")).toBeInTheDocument();
  });

  it("should have proper ARIA attributes", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={vi.fn()}
      />
    );

    const grid = screen.getByTestId("trigram-grid");
    expect(grid).toHaveAttribute("role", "grid");
    expect(grid).toHaveAttribute("aria-label", "Trigram selection grid");
  });

  it("should have accessible button labels", () => {
    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={vi.fn()}
      />
    );

    const geonButton = screen.getByTestId("trigram-grid-button-geon");
    expect(geonButton).toHaveAttribute("aria-label");
    expect(geonButton.getAttribute("aria-label")).toContain("건");
    expect(geonButton.getAttribute("aria-label")).toContain("Heaven");
  });

  it("should allow selecting different trigrams", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={handleSelect}
      />
    );

    const taeButton = screen.getByTestId("trigram-grid-button-tae");
    await user.click(taeButton);

    expect(handleSelect).toHaveBeenCalledWith(TrigramStance.TAE);

    const liButton = screen.getByTestId("trigram-grid-button-li");
    await user.click(liButton);

    expect(handleSelect).toHaveBeenCalledWith(TrigramStance.LI);
  });

  it("should handle rapid clicking", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <InteractiveTrigramGrid
        selectedTrigram={null}
        onTrigramSelect={handleSelect}
      />
    );

    const geonButton = screen.getByTestId("trigram-grid-button-geon");
    
    await user.click(geonButton);
    await user.click(geonButton);
    await user.click(geonButton);

    expect(handleSelect).toHaveBeenCalledTimes(3);
  });
});
