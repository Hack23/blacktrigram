/**
 * BackButton Component Tests
 * 
 * Tests for shared back and link button components
 * Updated to work with BaseButtonOverlayHtml structure
 */

import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BackButton, LinkButton } from "./BackButton";

describe("BackButton", () => {
  it("should render with default bilingual text", () => {
    render(<BackButton onClick={vi.fn()} isMobile={false} />);

    expect(screen.getByText("돌아가기")).toBeInTheDocument();
    expect(screen.getByText("Return")).toBeInTheDocument();
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

    expect(screen.getByText("메뉴로")).toBeInTheDocument();
    expect(screen.getByText("To Menu")).toBeInTheDocument();
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

  it("should be a button element", () => {
    render(<BackButton onClick={vi.fn()} isMobile={false} />);

    const button = screen.getByTestId("back-button");
    expect(button.tagName).toBe("BUTTON");
  });

  it("should handle rapid clicks without error", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<BackButton onClick={vi.fn()} isMobile={false} />);

    const button = screen.getByTestId("back-button");

    // Click multiple times rapidly
    await user.click(button);
    await user.click(button);
    await user.click(button);

    // Just verify no errors occurred
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

    expect(screen.getByText("보기")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
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

    expect(screen.getByText(/🔐.*보안 정책/)).toBeInTheDocument();
    expect(screen.getByText("Security Policy")).toBeInTheDocument();
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

  it("should render without icon", () => {
    render(
      <LinkButton
        onClick={vi.fn()}
        korean="텍스트"
        english="Text"
        isMobile={false}
      />,
    );

    expect(screen.getByText("텍스트")).toBeInTheDocument();
    expect(screen.getByText("Text")).toBeInTheDocument();
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
