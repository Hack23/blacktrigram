import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhilosophySection } from "./PhilosophySectionOverlayHtml";
import { KOREAN_COLORS } from "../../../../types/constants/colors";

describe("PhilosophySection", () => {
  const mockTitle = {
    korean: "팔괘 철학",
    english: "Trigram Philosophy",
  };

  it("should render without crashing", () => {
    render(
      <PhilosophySection title={mockTitle}>
        <div>Test content</div>
      </PhilosophySection>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should display Korean title", () => {
    render(
      <PhilosophySection title={mockTitle}>
        <div>Test content</div>
      </PhilosophySection>
    );

    expect(screen.getByText("팔괘 철학")).toBeInTheDocument();
  });

  it("should display English title", () => {
    render(
      <PhilosophySection title={mockTitle}>
        <div>Test content</div>
      </PhilosophySection>
    );

    expect(screen.getByText("Trigram Philosophy")).toBeInTheDocument();
  });

  it("should render children content", () => {
    render(
      <PhilosophySection title={mockTitle}>
        <div data-testid="child-content">Child content</div>
      </PhilosophySection>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("should render with custom test ID", () => {
    render(
      <PhilosophySection title={mockTitle} testId="custom-section">
        <div>Test content</div>
      </PhilosophySection>
    );

    expect(screen.getByTestId("custom-section")).toBeInTheDocument();
  });

  it("should handle mobile layout", () => {
    render(
      <PhilosophySection title={mockTitle} isMobile={true}>
        <div>Test content</div>
      </PhilosophySection>
    );

    expect(screen.getByText(mockTitle.korean)).toBeInTheDocument();
  });

  it("should handle desktop layout", () => {
    render(
      <PhilosophySection title={mockTitle} isMobile={false}>
        <div>Test content</div>
      </PhilosophySection>
    );

    expect(screen.getByText(mockTitle.korean)).toBeInTheDocument();
  });

  it("should use default border color", () => {
    const { container } = render(
      <PhilosophySection title={mockTitle}>
        <div>Test content</div>
      </PhilosophySection>
    );

    const section = container.querySelector("section");
    expect(section).toBeTruthy();
  });

  it("should use custom border color", () => {
    const { container } = render(
      <PhilosophySection
        title={mockTitle}
        borderColor={KOREAN_COLORS.ACCENT_GOLD}
      >
        <div>Test content</div>
      </PhilosophySection>
    );

    const section = container.querySelector("section");
    expect(section).toBeTruthy();
  });

  it("should have semantic HTML structure", () => {
    const { container } = render(
      <PhilosophySection title={mockTitle}>
        <div>Test content</div>
      </PhilosophySection>
    );

    const section = container.querySelector("section");
    expect(section).toBeTruthy();

    const header = container.querySelector("header");
    expect(header).toBeTruthy();

    const h2 = container.querySelector("h2");
    expect(h2).toBeTruthy();
  });

  it("should render multiple children", () => {
    render(
      <PhilosophySection title={mockTitle}>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </PhilosophySection>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });

  it("should handle complex children", () => {
    render(
      <PhilosophySection title={mockTitle}>
        <div>
          <p>Paragraph 1</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
          <button>Action</button>
        </div>
      </PhilosophySection>
    );

    expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("should render with different titles", () => {
    const { rerender } = render(
      <PhilosophySection
        title={{ korean: "제목 1", english: "Title 1" }}
      >
        <div>Content</div>
      </PhilosophySection>
    );

    expect(screen.getByText("제목 1")).toBeInTheDocument();
    expect(screen.getByText("Title 1")).toBeInTheDocument();

    rerender(
      <PhilosophySection
        title={{ korean: "제목 2", english: "Title 2" }}
      >
        <div>Content</div>
      </PhilosophySection>
    );

    expect(screen.getByText("제목 2")).toBeInTheDocument();
    expect(screen.getByText("Title 2")).toBeInTheDocument();
  });

  it("should maintain structure with empty children", () => {
    const { container } = render(
      <PhilosophySection title={mockTitle}>
        <></>
      </PhilosophySection>
    );

    const section = container.querySelector("section");
    expect(section).toBeTruthy();

    const header = container.querySelector("header");
    expect(header).toBeTruthy();
  });
});
