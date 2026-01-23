import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PhilosophyTextOverlayHtml } from "./PhilosophyTextOverlayHtml";
import { TrigramStance } from "../../../../types";

describe("PhilosophyTextOverlayHtml", () => {
  it("should not render when no trigram is selected", () => {
    const { container } = render(
      <PhilosophyTextOverlayHtml selectedTrigram={null} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render when trigram is selected", () => {
    render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.GEON} />
    );

    expect(screen.getByTestId("philosophy-text-overlay")).toBeInTheDocument();
  });

  it("should display trigram symbol", () => {
    render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.GEON} />
    );

    expect(screen.getByText("☰")).toBeInTheDocument();
  });

  it("should display Korean and English names", () => {
    render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.GEON} />
    );

    // Use getAllByText since "건" appears in multiple places
    expect(screen.getAllByText(/건/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Heaven/)[0]).toBeInTheDocument();
  });

  it("should display Chinese character", () => {
    render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.GEON} />
    );

    expect(screen.getByText(/天/)).toBeInTheDocument();
  });

  it("should display meaning section", () => {
    render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.GEON} />
    );

    expect(screen.getByText(/의미 \| Meaning/)).toBeInTheDocument();
  });

  it("should display philosophy section", () => {
    render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.GEON} />
    );

    expect(screen.getByText(/철학 \| Philosophy/)).toBeInTheDocument();
  });

  it("should display combat application section", () => {
    render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.GEON} />
    );

    expect(screen.getByText(/전투 응용 \| Combat Application/)).toBeInTheDocument();
  });

  it("should display primary technique section", () => {
    render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.GEON} />
    );

    expect(screen.getByText(/기본 기술 \| Primary Technique/)).toBeInTheDocument();
  });

  it("should display technique stats", () => {
    render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.GEON} />
    );

    expect(screen.getByText(/데미지 \| Damage:/)).toBeInTheDocument();
    expect(screen.getByText(/명중률 \| Hit Chance:/)).toBeInTheDocument();
    expect(screen.getByText(/기 소모 \| Ki Cost:/)).toBeInTheDocument();
    expect(screen.getByText(/체력 소모 \| Stamina:/)).toBeInTheDocument();
  });

  it("should render close button when onClose is provided", () => {
    const handleClose = vi.fn();

    render(
      <PhilosophyTextOverlayHtml
        selectedTrigram={TrigramStance.GEON}
        onClose={handleClose}
      />
    );

    expect(screen.getByTestId("close-overlay")).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <PhilosophyTextOverlayHtml
        selectedTrigram={TrigramStance.GEON}
        onClose={handleClose}
      />
    );

    const closeButton = screen.getByTestId("close-overlay");
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should not render close button when onClose is not provided", () => {
    render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.GEON} />
    );

    expect(screen.queryByTestId("close-overlay")).not.toBeInTheDocument();
  });

  it("should handle mobile layout", () => {
    render(
      <PhilosophyTextOverlayHtml
        selectedTrigram={TrigramStance.GEON}
        isMobile={true}
      />
    );

    expect(screen.getByTestId("philosophy-text-overlay")).toBeInTheDocument();
  });

  it("should handle desktop layout", () => {
    render(
      <PhilosophyTextOverlayHtml
        selectedTrigram={TrigramStance.GEON}
        isMobile={false}
      />
    );

    expect(screen.getByTestId("philosophy-text-overlay")).toBeInTheDocument();
  });

  it("should display different trigrams correctly", () => {
    const { rerender } = render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.TAE} />
    );

    expect(screen.getByText("☱")).toBeInTheDocument();
    expect(screen.getByText(/태/)).toBeInTheDocument();

    rerender(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.LI} />
    );

    expect(screen.getByText("☲")).toBeInTheDocument();
    expect(screen.getByText(/리/)).toBeInTheDocument();
  });

  it("should have proper ARIA attributes", () => {
    render(
      <PhilosophyTextOverlayHtml selectedTrigram={TrigramStance.GEON} />
    );

    const overlay = screen.getByTestId("philosophy-text-overlay");
    expect(overlay).toHaveAttribute("role", "dialog");
    expect(overlay).toHaveAttribute("aria-modal", "true");
    expect(overlay).toHaveAttribute("aria-labelledby", "trigram-title");
  });

  it("should have accessible close button", () => {
    const handleClose = vi.fn();

    render(
      <PhilosophyTextOverlayHtml
        selectedTrigram={TrigramStance.GEON}
        onClose={handleClose}
      />
    );

    const closeButton = screen.getByTestId("close-overlay");
    expect(closeButton).toHaveAttribute("aria-label", "Close overlay");
  });
});
