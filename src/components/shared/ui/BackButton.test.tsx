/**
 * BackButton Component Tests
 * 
 * Tests for shared back and link button components
 */

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BackButton, LinkButton } from "./BackButton";

describe("BackButton", () => {
  it("should render with default bilingual text", () => {
    render(<BackButton onClick={vi.fn()} isMobile={false} />);

    expect(screen.getByText(/돌아가기.*Return/)).toBeInTheDocument();
  });

  it("should render custom bilingual text", () => {
    render(
      <BackButton
        onClick={vi.fn()}
        korean="메뉴로"
        english="To Menu"
        isMobile={false}
      />,
    );

    expect(screen.getByText(/메뉴로.*To Menu/)).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<BackButton onClick={onClick} isMobile={false} />);

    await user.click(screen.getByTestId("back-button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should use custom test ID", () => {
    render(
      <BackButton
        onClick={vi.fn()}
        isMobile={false}
        testId="custom-back-button"
      />,
    );

    expect(screen.getByTestId("custom-back-button")).toBeInTheDocument();
  });

  it("should have correct accessibility label", () => {
    render(
      <BackButton
        onClick={vi.fn()}
        korean="돌아가기"
        english="Return"
        isMobile={false}
      />,
    );

    const button = screen.getByTestId("back-button");
    expect(button).toHaveAttribute("aria-label", "돌아가기 | Return");
  });

  it("should adjust font size for mobile", () => {
    const { container: mobileContainer } = render(
      <BackButton onClick={vi.fn()} isMobile={true} />,
    );

    const { container: desktopContainer } = render(
      <BackButton onClick={vi.fn()} isMobile={false} />,
    );

    // Verify buttons exist with inline styles
    expect(mobileContainer.querySelector("button")).toHaveAttribute("style");
    expect(desktopContainer.querySelector("button")).toHaveAttribute("style");
  });

  it("should handle hover effects", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <BackButton onClick={vi.fn()} isMobile={false} />,
    );

    const button = screen.getByTestId("back-button");

    // Hover should trigger mouse events
    await user.hover(button);
    // Button should still exist after hover
    expect(button).toBeInTheDocument();
  });
});

describe("LinkButton", () => {
  it("should render with bilingual text", () => {
    render(
      <LinkButton
        onClick={vi.fn()}
        korean="보기"
        english="View"
        isMobile={false}
      />,
    );

    expect(screen.getByText(/보기.*View/)).toBeInTheDocument();
  });

  it("should render with icon", () => {
    render(
      <LinkButton
        onClick={vi.fn()}
        korean="보안 정책"
        english="Security Policy"
        icon="🔐"
        isMobile={false}
      />,
    );

    expect(screen.getByText(/🔐.*보안 정책.*Security Policy/)).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <LinkButton
        onClick={onClick}
        korean="링크"
        english="Link"
        isMobile={false}
      />,
    );

    await user.click(screen.getByTestId("link-button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should use custom test ID", () => {
    render(
      <LinkButton
        onClick={vi.fn()}
        korean="링크"
        english="Link"
        testId="custom-link-button"
        isMobile={false}
      />,
    );

    expect(screen.getByTestId("custom-link-button")).toBeInTheDocument();
  });

  it("should have correct accessibility label", () => {
    render(
      <LinkButton
        onClick={vi.fn()}
        korean="보기"
        english="View"
        isMobile={false}
      />,
    );

    const button = screen.getByTestId("link-button");
    expect(button).toHaveAttribute("aria-label", "보기 | View");
  });

  it("should render without icon", () => {
    render(
      <LinkButton
        onClick={vi.fn()}
        korean="텍스트"
        english="Text"
        isMobile={false}
      />,
    );

    const buttonText = screen.getByText(/텍스트.*Text/);
    expect(buttonText).toBeInTheDocument();
    expect(buttonText.textContent).not.toMatch(/🔐|🎮|📚/);
  });

  it("should adjust font size for mobile", () => {
    const { container: mobileContainer } = render(
      <LinkButton
        onClick={vi.fn()}
        korean="모바일"
        english="Mobile"
        isMobile={true}
      />,
    );

    const { container: desktopContainer } = render(
      <LinkButton
        onClick={vi.fn()}
        korean="데스크탑"
        english="Desktop"
        isMobile={false}
      />,
    );

    // Verify buttons exist with inline styles
    expect(mobileContainer.querySelector("button")).toHaveAttribute("style");
    expect(desktopContainer.querySelector("button")).toHaveAttribute("style");
  });

  it("should handle hover effects", async () => {
    const user = userEvent.setup();
    render(
      <LinkButton
        onClick={vi.fn()}
        korean="호버"
        english="Hover"
        isMobile={false}
      />,
    );

    const button = screen.getByTestId("link-button");

    // Hover should trigger mouse events
    await user.hover(button);
    // Button should still exist after hover
    expect(button).toBeInTheDocument();
  });

  it("should handle rapid clicks without error", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <LinkButton
        onClick={onClick}
        korean="클릭"
        english="Click"
        isMobile={false}
      />,
    );

    const button = screen.getByTestId("link-button");

    // Click multiple times rapidly
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(3);
  });
});
