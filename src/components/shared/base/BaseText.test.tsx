/**
 * Tests for BaseText component
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KOREAN_COLORS } from "../../../types/constants";
import { BaseText } from "./BaseText";

// Mock @react-three/drei Html component
vi.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="html-overlay">{children}</div>
  ),
}));

describe("BaseText", () => {
  it("should be defined and importable", () => {
    expect(BaseText).toBeDefined();
    expect(typeof BaseText).toBe("function");
  });

  it("should have proper display name", () => {
    expect(BaseText.displayName).toBe("BaseText");
  });

  it("should render Korean and English text", () => {
    render(
      <BaseText
        korean="안녕하세요"
        english="Hello"
      />
    );

    expect(screen.getByText("안녕하세요")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("should render with custom test ID", () => {
    render(
      <BaseText
        korean="테스트"
        english="Test"
        testId="custom-text"
      />
    );

    expect(screen.getByTestId("custom-text")).toBeInTheDocument();
  });

  it("should render with default test ID when not provided", () => {
    render(
      <BaseText
        korean="기본"
        english="Default"
      />
    );

    expect(screen.getByTestId("base-text")).toBeInTheDocument();
  });

  it("should render with small size", () => {
    render(
      <BaseText
        korean="작은 텍스트"
        english="Small Text"
        size="small"
      />
    );

    expect(screen.getByText("작은 텍스트")).toBeInTheDocument();
  });

  it("should render with medium size", () => {
    render(
      <BaseText
        korean="중간 텍스트"
        english="Medium Text"
        size="medium"
      />
    );

    expect(screen.getByText("중간 텍스트")).toBeInTheDocument();
  });

  it("should render with large size", () => {
    render(
      <BaseText
        korean="큰 텍스트"
        english="Large Text"
        size="large"
      />
    );

    expect(screen.getByText("큰 텍스트")).toBeInTheDocument();
  });

  it("should render with xlarge size", () => {
    render(
      <BaseText
        korean="아주 큰 텍스트"
        english="Extra Large Text"
        size="xlarge"
      />
    );

    expect(screen.getByText("아주 큰 텍스트")).toBeInTheDocument();
  });

  it("should render with custom color", () => {
    render(
      <BaseText
        korean="컬러"
        english="Color"
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
    );

    expect(screen.getByText("컬러")).toBeInTheDocument();
  });

  it("should render with left alignment", () => {
    render(
      <BaseText
        korean="왼쪽"
        english="Left"
        align="left"
      />
    );

    expect(screen.getByText("왼쪽")).toBeInTheDocument();
  });

  it("should render with center alignment", () => {
    render(
      <BaseText
        korean="중앙"
        english="Center"
        align="center"
      />
    );

    expect(screen.getByText("중앙")).toBeInTheDocument();
  });

  it("should render with right alignment", () => {
    render(
      <BaseText
        korean="오른쪽"
        english="Right"
        align="right"
      />
    );

    expect(screen.getByText("오른쪽")).toBeInTheDocument();
  });

  it("should render with normal weight", () => {
    render(
      <BaseText
        korean="보통"
        english="Normal"
        weight="normal"
      />
    );

    expect(screen.getByText("보통")).toBeInTheDocument();
  });

  it("should render with bold weight", () => {
    render(
      <BaseText
        korean="굵게"
        english="Bold"
        weight="bold"
      />
    );

    expect(screen.getByText("굵게")).toBeInTheDocument();
  });

  it("should render with vertical layout", () => {
    render(
      <BaseText
        korean="세로"
        english="Vertical"
        layout="vertical"
      />
    );

    expect(screen.getByText("세로")).toBeInTheDocument();
    expect(screen.getByText("Vertical")).toBeInTheDocument();
  });

  it("should render with horizontal layout", () => {
    render(
      <BaseText
        korean="가로"
        english="Horizontal"
        layout="horizontal"
      />
    );

    expect(screen.getByText("가로")).toBeInTheDocument();
    expect(screen.getByText("| Horizontal")).toBeInTheDocument();
  });

  it("should render for mobile", () => {
    render(
      <BaseText
        korean="모바일"
        english="Mobile"
        isMobile={true}
      />
    );

    expect(screen.getByText("모바일")).toBeInTheDocument();
  });

  it("should apply layer prop for z-index management", () => {
    const { container } = render(
      <BaseText
        korean="레이어"
        english="Layer"
        layer="modal"
      />
    );

    // Component should render without error when layer prop is provided
    expect(screen.getByText("레이어")).toBeInTheDocument();
    expect(container.querySelector('[data-testid="base-text"]')).toBeInTheDocument();
  });

  it("should apply occlude prop", () => {
    const { container } = render(
      <BaseText
        korean="오클루드"
        english="Occlude"
        occlude={true}
      />
    );

    // Component should render without error when occlude prop is provided
    expect(screen.getByText("오클루드")).toBeInTheDocument();
    expect(container.querySelector('[data-testid="base-text"]')).toBeInTheDocument();
  });

  it("should work with both layer and occlude props", () => {
    render(
      <BaseText
        korean="레이어 오클루드"
        english="Layer Occlude"
        layer="tooltip"
        occlude={true}
      />
    );

    expect(screen.getByText("레이어 오클루드")).toBeInTheDocument();
    expect(screen.getByText("Layer Occlude")).toBeInTheDocument();
  });
});
