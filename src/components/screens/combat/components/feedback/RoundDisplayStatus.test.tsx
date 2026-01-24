/**
 * Tests for RoundDisplayStatus component
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RoundDisplayStatus } from "./RoundDisplayStatus";

describe("RoundDisplayStatus", () => {
  it("should render 'start' status message", () => {
    render(<RoundDisplayStatus status="start" />);
    
    expect(screen.getByTestId("round-display-status")).toBeInTheDocument();
    expect(screen.getByTestId("round-display-status-start")).toBeInTheDocument();
    expect(screen.getByText("라운드 시작!")).toBeInTheDocument();
  });

  it("should render 'fight' status message", () => {
    render(<RoundDisplayStatus status="fight" />);
    
    expect(screen.getByTestId("round-display-status")).toBeInTheDocument();
    expect(screen.getByTestId("round-display-status-fight")).toBeInTheDocument();
    expect(screen.getByText("전투!")).toBeInTheDocument();
  });

  it("should render 'end' status message", () => {
    render(<RoundDisplayStatus status="end" />);
    
    expect(screen.getByTestId("round-display-status")).toBeInTheDocument();
    expect(screen.getByTestId("round-display-status-end")).toBeInTheDocument();
    expect(screen.getByText("라운드 종료")).toBeInTheDocument();
  });

  it("should render 'ko' status message", () => {
    render(<RoundDisplayStatus status="ko" />);
    
    expect(screen.getByTestId("round-display-status")).toBeInTheDocument();
    expect(screen.getByTestId("round-display-status-ko")).toBeInTheDocument();
    expect(screen.getByText("K.O.!")).toBeInTheDocument();
  });

  it("should not render when status is null", () => {
    const { container } = render(<RoundDisplayStatus status={null} />);
    
    expect(container.firstChild).toBeNull();
  });

  it("should apply mobile styles when isMobile is true", () => {
    render(<RoundDisplayStatus status="fight" isMobile={true} />);
    
    const statusElement = screen.getByTestId("round-display-status-fight");
    expect(statusElement).toHaveStyle({ fontSize: "48px" });
  });

  it("should apply desktop styles by default", () => {
    render(<RoundDisplayStatus status="fight" />);
    
    const statusElement = screen.getByTestId("round-display-status-fight");
    expect(statusElement).toHaveStyle({ fontSize: "72px" });
  });
});
