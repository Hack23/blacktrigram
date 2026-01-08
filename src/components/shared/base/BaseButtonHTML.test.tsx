/**
 * Tests for BaseButtonHTML component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BaseButtonHTML } from "./BaseButtonHTML";

describe("BaseButtonHTML", () => {
  it("should be defined and importable", () => {
    expect(BaseButtonHTML).toBeDefined();
    expect(typeof BaseButtonHTML).toBe("function");
  });

  it("should have proper display name", () => {
    expect(BaseButtonHTML.displayName).toBe("BaseButtonHTML");
  });

  it("should render Korean and English text", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="공격"
        english="Attack"
        onClick={handleClick}
      />
    );

    expect(screen.getByText("공격")).toBeInTheDocument();
    expect(screen.getByText("Attack")).toBeInTheDocument();
  });

  it("should call onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="클릭"
        english="Click"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="비활성"
        english="Disabled"
        onClick={handleClick}
        disabled={true}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should render with custom test ID", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="테스트"
        english="Test"
        onClick={handleClick}
        testId="custom-button-html"
      />
    );

    expect(screen.getByTestId("custom-button-html")).toBeInTheDocument();
  });

  it("should render with default test ID when not provided", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="기본"
        english="Default"
        onClick={handleClick}
      />
    );

    expect(screen.getByTestId("base-button-html")).toBeInTheDocument();
  });

  it("should render with primary variant", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="주요"
        english="Primary"
        onClick={handleClick}
        variant="primary"
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should render with secondary variant", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="보조"
        english="Secondary"
        onClick={handleClick}
        variant="secondary"
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should render with danger variant", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="위험"
        english="Danger"
        onClick={handleClick}
        variant="danger"
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should render with small size", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="작음"
        english="Small"
        onClick={handleClick}
        size="sm"
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should render with medium size", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="중간"
        english="Medium"
        onClick={handleClick}
        size="md"
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should render with large size", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="큼"
        english="Large"
        onClick={handleClick}
        size="lg"
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should render full width button", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="전체 너비"
        english="Full Width"
        onClick={handleClick}
        fullWidth={true}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ width: "100%" });
  });

  it("should handle mouse hover events", () => {
    const handleClick = vi.fn();
    const handleHover = vi.fn();
    render(
      <BaseButtonHTML
        korean="호버"
        english="Hover"
        onClick={handleClick}
        onMouseEnter={handleHover}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);
    
    expect(handleHover).toHaveBeenCalledTimes(1);
  });

  it("should handle mouse down and up events", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="클릭"
        english="Click"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.mouseDown(button);
    fireEvent.mouseUp(button);

    expect(button).toBeInTheDocument();
  });

  it("should render for mobile", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="모바일"
        english="Mobile"
        onClick={handleClick}
        isMobile={true}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should accept custom className", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="클래스"
        english="Class"
        onClick={handleClick}
        className="custom-class"
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("should accept custom style", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="스타일"
        english="Style"
        onClick={handleClick}
        style={{ marginTop: "20px" }}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ marginTop: "20px" });
  });

  it("should apply custom styles last (allowing overrides)", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="재정의"
        english="Override"
        onClick={handleClick}
        style={{ flex: "1", padding: "50px" }}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ flex: "1", padding: "50px" });
  });

  it("should support autoFocus prop", () => {
    const handleClick = vi.fn();
    render(
      <BaseButtonHTML
        korean="자동 포커스"
        english="Auto Focus"
        onClick={handleClick}
        autoFocus={true}
      />
    );

    const button = screen.getByRole("button");
    // Check that button has autoFocus property
    expect(button).toEqual(document.activeElement);
  });
});
