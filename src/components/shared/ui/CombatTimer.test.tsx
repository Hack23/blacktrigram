/**
 * Tests for CombatTimer component
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CombatTimer } from "./CombatTimer";

describe("CombatTimer", () => {
  it("should render timer with formatted time", () => {
    render(
      <CombatTimer
        formattedTime="03:45"
        warningLevel="none"
        isTimeUp={false}
        isMobile={false}
      />
    );

    const timer = screen.getByTestId("combat-timer");
    expect(timer).toBeInTheDocument();
    expect(timer).toHaveTextContent("03:45");
  });

  it("should display time label when not time up", () => {
    render(
      <CombatTimer
        formattedTime="02:30"
        warningLevel="none"
        isTimeUp={false}
        isMobile={false}
      />
    );

    const timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveTextContent("시간 | TIME");
  });

  it("should display 'Time's Up!' message when time is up", () => {
    render(
      <CombatTimer
        formattedTime="00:00"
        warningLevel="urgent"
        isTimeUp={true}
        isMobile={false}
      />
    );

    const timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveTextContent("시간 종료 | Time's Up!");
    expect(timer).not.toHaveTextContent("시간 | TIME");
  });

  it("should have cyan color when warning level is none", () => {
    render(
      <CombatTimer
        formattedTime="03:00"
        warningLevel="none"
        isTimeUp={false}
        isMobile={false}
      />
    );

    const timer = screen.getByTestId("combat-timer");
    // Check for cyan color in computed styles (rgb format) - WCAG AA compliant
    expect(timer).toHaveStyle({ color: "rgb(0, 230, 230)" }); // Updated from rgb(0, 255, 255)
  });

  it("should have yellow color when warning level is warning", () => {
    render(
      <CombatTimer
        formattedTime="00:09"
        warningLevel="warning"
        isTimeUp={false}
        isMobile={false}
      />
    );

    const timer = screen.getByTestId("combat-timer");
    // Check for yellow color in computed styles (rgb format) - WCAG AA compliant
    expect(timer).toHaveStyle({ color: "rgb(255, 255, 51)" }); // Updated from rgb(255, 255, 0)
  });

  it("should have red color when warning level is urgent", () => {
    render(
      <CombatTimer
        formattedTime="00:04"
        warningLevel="urgent"
        isTimeUp={false}
        isMobile={false}
      />
    );

    const timer = screen.getByTestId("combat-timer");
    // Check for red color in computed styles (rgb format)
    expect(timer).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("should have pulse animation when warning level is urgent", () => {
    render(
      <CombatTimer
        formattedTime="00:03"
        warningLevel="urgent"
        isTimeUp={false}
        isMobile={false}
      />
    );

    const timer = screen.getByTestId("combat-timer");
    const style = timer.style.animation;
    expect(style).toContain("pulse");
  });

  it("should have pulse animation when time is up", () => {
    render(
      <CombatTimer
        formattedTime="00:00"
        warningLevel="urgent"
        isTimeUp={true}
        isMobile={false}
      />
    );

    const timer = screen.getByTestId("combat-timer");
    const style = timer.style.animation;
    expect(style).toContain("pulse");
  });

  it("should not have pulse animation when warning level is none or warning", () => {
    const { rerender } = render(
      <CombatTimer
        formattedTime="03:00"
        warningLevel="none"
        isTimeUp={false}
        isMobile={false}
      />
    );

    let timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveStyle({ animation: "none" });

    rerender(
      <CombatTimer
        formattedTime="00:09"
        warningLevel="warning"
        isTimeUp={false}
        isMobile={false}
      />
    );

    timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveStyle({ animation: "none" });
  });

  it("should adapt sizing for mobile", () => {
    const { rerender } = render(
      <CombatTimer
        formattedTime="03:00"
        warningLevel="none"
        isTimeUp={false}
        isMobile={false}
      />
    );

    let timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveStyle({ fontSize: "48px" });

    rerender(
      <CombatTimer
        formattedTime="03:00"
        warningLevel="none"
        isTimeUp={false}
        isMobile={true}
      />
    );

    timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveStyle({ fontSize: "32px" });
  });

  it("should have proper accessibility attributes", () => {
    render(
      <CombatTimer
        formattedTime="02:15"
        warningLevel="none"
        isTimeUp={false}
        isMobile={false}
      />
    );

    const timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveAttribute("role", "timer");
    expect(timer).toHaveAttribute("aria-live", "polite");
    expect(timer).toHaveAttribute("aria-atomic", "true");
    expect(timer).toHaveAttribute(
      "aria-label",
      "Time remaining: 02:15"
    );
  });

  it("should be positioned at top center", () => {
    render(
      <CombatTimer
        formattedTime="03:00"
        warningLevel="none"
        isTimeUp={false}
        isMobile={false}
      />
    );

    const timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveStyle({
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
    });
  });

  it("should accept custom style prop", () => {
    const customStyle = {
      top: "20px",
      zIndex: 200,
    };

    render(
      <CombatTimer
        formattedTime="03:00"
        warningLevel="none"
        isTimeUp={false}
        isMobile={false}
        style={customStyle}
      />
    );

    const timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveStyle({
      top: "20px",
      zIndex: 200,
    });
  });

  it("should render with all time formats", () => {
    const { rerender } = render(
      <CombatTimer
        formattedTime="00:00"
        warningLevel="urgent"
        isTimeUp={false}
        isMobile={false}
      />
    );

    let timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveTextContent("00:00");

    rerender(
      <CombatTimer
        formattedTime="00:59"
        warningLevel="urgent"
        isTimeUp={false}
        isMobile={false}
      />
    );

    timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveTextContent("00:59");

    rerender(
      <CombatTimer
        formattedTime="01:00"
        warningLevel="warning"
        isTimeUp={false}
        isMobile={false}
      />
    );

    timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveTextContent("01:00");

    rerender(
      <CombatTimer
        formattedTime="09:59"
        warningLevel="none"
        isTimeUp={false}
        isMobile={false}
      />
    );

    timer = screen.getByTestId("combat-timer");
    expect(timer).toHaveTextContent("09:59");
  });
});
