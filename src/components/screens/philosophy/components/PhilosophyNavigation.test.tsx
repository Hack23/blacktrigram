import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PhilosophyNavigation } from "./PhilosophyNavigation";
import type { PhilosophyTopic } from "../hooks/usePhilosophyState";

describe("PhilosophyNavigation", () => {
  it("should render without crashing", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
      />
    );

    expect(screen.getByTestId("philosophy-navigation")).toBeInTheDocument();
  });

  it("should render all topic buttons", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
      />
    );

    expect(screen.getByTestId("topic-button-trigrams")).toBeInTheDocument();
    expect(screen.getByTestId("topic-button-values")).toBeInTheDocument();
    expect(screen.getByTestId("topic-button-archetypes")).toBeInTheDocument();
  });

  it("should display Korean topic names", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
      />
    );

    expect(screen.getByText("팔괘")).toBeInTheDocument();
    expect(screen.getByText("가치관")).toBeInTheDocument();
    expect(screen.getByText("무사 유형")).toBeInTheDocument();
  });

  it("should display English topic names", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
      />
    );

    expect(screen.getByText("Trigrams")).toBeInTheDocument();
    expect(screen.getByText("Values")).toBeInTheDocument();
    expect(screen.getByText("Archetypes")).toBeInTheDocument();
  });

  it("should show active state for current topic", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
      />
    );

    const trigramsButton = screen.getByTestId("topic-button-trigrams");
    // Check button itself for aria-current attribute (not parent)
    expect(trigramsButton).toHaveAttribute("aria-current", "page");
  });

  it("should not show active state for other topics", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
      />
    );

    const valuesButton = screen.getByTestId("topic-button-values");
    expect(valuesButton).not.toHaveAttribute("aria-current");
  });

  it("should call onTopicChange when topic button is clicked", async () => {
    const user = userEvent.setup();
    const handleTopicChange = vi.fn();

    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={handleTopicChange}
        onReturn={vi.fn()}
      />
    );

    const valuesButton = screen.getByTestId("topic-button-values");
    await user.click(valuesButton);

    expect(handleTopicChange).toHaveBeenCalledWith("values");
  });

  it("should call onReturn when return button is clicked", async () => {
    const user = userEvent.setup();
    const handleReturn = vi.fn();

    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={handleReturn}
      />
    );

    const returnButton = screen.getByTestId("return-button");
    await user.click(returnButton);

    expect(handleReturn).toHaveBeenCalledTimes(1);
  });

  it("should render return button", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
      />
    );

    expect(screen.getByTestId("return-button")).toBeInTheDocument();
    expect(screen.getByText("돌아가기")).toBeInTheDocument();
    expect(screen.getByText("Return")).toBeInTheDocument();
  });

  it("should handle mobile layout", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
        isMobile={true}
      />
    );

    expect(screen.getByTestId("philosophy-navigation")).toBeInTheDocument();
  });

  it("should handle desktop layout", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByTestId("philosophy-navigation")).toBeInTheDocument();
  });

  it("should show keyboard shortcuts on desktop", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByText("ESC")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("should not show keyboard shortcuts on mobile", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
        isMobile={true}
      />
    );

    expect(screen.queryByText("ESC")).not.toBeInTheDocument();
    expect(screen.queryByText("M")).not.toBeInTheDocument();
  });

  it("should allow switching between all topics", async () => {
    const user = userEvent.setup();
    const handleTopicChange = vi.fn();

    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={handleTopicChange}
        onReturn={vi.fn()}
      />
    );

    const valuesButton = screen.getByTestId("topic-button-values");
    await user.click(valuesButton);
    expect(handleTopicChange).toHaveBeenCalledWith("values");

    const archetypesButton = screen.getByTestId("topic-button-archetypes");
    await user.click(archetypesButton);
    expect(handleTopicChange).toHaveBeenCalledWith("archetypes");

    const trigramsButton = screen.getByTestId("topic-button-trigrams");
    await user.click(trigramsButton);
    expect(handleTopicChange).toHaveBeenCalledWith("trigrams");
  });

  it("should have proper ARIA attributes", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
      />
    );

    const nav = screen.getByTestId("philosophy-navigation");
    expect(nav).toHaveAttribute("role", "navigation");
    expect(nav).toHaveAttribute("aria-label", "Philosophy section navigation");
  });

  it("should have accessible button labels", () => {
    render(
      <PhilosophyNavigation
        currentTopic="trigrams"
        onTopicChange={vi.fn()}
        onReturn={vi.fn()}
      />
    );

    const returnButton = screen.getByTestId("return-button");
    expect(returnButton).toHaveAttribute("aria-label", "Return to main menu");
  });

  it("should handle different current topics", () => {
    const topics: PhilosophyTopic[] = ["trigrams", "values", "archetypes"];

    topics.forEach((topic) => {
      const { rerender } = render(
        <PhilosophyNavigation
          currentTopic={topic}
          onTopicChange={vi.fn()}
          onReturn={vi.fn()}
        />
      );

      const button = screen.getByTestId(`topic-button-${topic}`);
      // Check button itself for aria-current attribute (not parent)
      expect(button).toHaveAttribute("aria-current", "page");

      rerender(<></>);
    });
  });
});
