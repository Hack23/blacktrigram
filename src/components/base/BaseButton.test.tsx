/**
 * Tests for BaseButton component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BaseButton } from "./BaseButton";

// Mock @react-three/drei Html component
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
}));

describe("BaseButton", () => {
  it("should be defined and importable", () => {
    expect(BaseButton).toBeDefined();
    expect(typeof BaseButton).toBe("function");
  });

  it("should have proper display name", () => {
    expect(BaseButton.displayName).toBe("BaseButton");
  });

  it("should render Korean and English text", () => {
    const handleClick = vi.fn();
    render(
      <BaseButton
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
      <BaseButton
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
      <BaseButton
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
      <BaseButton
        korean="테스트"
        english="Test"
        onClick={handleClick}
        testId="custom-button"
      />
    );

    expect(screen.getByTestId("custom-button")).toBeInTheDocument();
  });

  it("should render with default test ID when not provided", () => {
    const handleClick = vi.fn();
    render(
      <BaseButton
        korean="기본"
        english="Default"
        onClick={handleClick}
      />
    );

    expect(screen.getByTestId("base-button")).toBeInTheDocument();
  });

  it("should render with primary variant", () => {
    const handleClick = vi.fn();
    render(
      <BaseButton
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
      <BaseButton
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
      <BaseButton
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
      <BaseButton
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
      <BaseButton
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
      <BaseButton
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
      <BaseButton
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
    render(
      <BaseButton
        korean="호버"
        english="Hover"
        onClick={handleClick}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.mouseEnter(button);
    fireEvent.mouseLeave(button);

    expect(button).toBeInTheDocument();
  });

  it("should handle mouse down and up events", () => {
    const handleClick = vi.fn();
    render(
      <BaseButton
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
      <BaseButton
        korean="모바일"
        english="Mobile"
        onClick={handleClick}
        isMobile={true}
      />
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });
});
