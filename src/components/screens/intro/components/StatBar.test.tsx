import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KOREAN_COLORS } from "../../../../types/constants";
import { StatBar } from "./StatBar";

describe("StatBar", () => {
  it("should render with Korean and English label", () => {
    render(<StatBar label="공격 | Attack" value={75} max={100} />);
    
    const label = screen.getByTestId("stat-label");
    expect(label).toBeInTheDocument();
    expect(label.textContent).toBe("공격 | Attack");
  });

  it("should display correct percentage width for stat bar", () => {
    render(<StatBar label="방어 | Defense" value={50} max={100} />);
    
    const fill = screen.getByTestId("stat-bar-fill");
    expect(fill).toHaveStyle({ width: "50%" });
  });

  it("should display numeric value when showValue is true", () => {
    render(<StatBar label="속도 | Speed" value={85} max={100} showValue={true} />);
    
    const value = screen.getByTestId("stat-value");
    expect(value).toBeInTheDocument();
    expect(value.textContent).toBe("85");
  });

  it("should not display numeric value when showValue is false", () => {
    render(<StatBar label="기술 | Technique" value={90} max={100} showValue={false} />);
    
    const value = screen.queryByTestId("stat-value");
    expect(value).not.toBeInTheDocument();
  });

  it("should handle values exceeding max by capping at 100%", () => {
    render(<StatBar label="공격 | Attack" value={150} max={100} />);
    
    const fill = screen.getByTestId("stat-bar-fill");
    expect(fill).toHaveStyle({ width: "100%" });
  });

  it("should handle negative values by capping at 0%", () => {
    render(<StatBar label="방어 | Defense" value={-10} max={100} />);
    
    const fill = screen.getByTestId("stat-bar-fill");
    expect(fill).toHaveStyle({ width: "0%" });
  });

  it("should use custom color when provided", () => {
    const customColor = KOREAN_COLORS.ACCENT_GOLD;
    render(<StatBar label="속도 | Speed" value={60} max={100} color={customColor} />);
    
    const value = screen.getByTestId("stat-value");
    expect(value).toHaveStyle({ 
      color: `#${customColor.toString(16).padStart(6, "0")}` 
    });
  });

  it("should use custom height when provided", () => {
    render(<StatBar label="기술 | Technique" value={70} max={100} height={20} />);
    
    const container = screen.getByTestId("stat-bar-container");
    expect(container).toHaveStyle({ height: "20px" });
  });

  it("should render in mobile mode with smaller dimensions", () => {
    render(<StatBar label="공격 | Attack" value={80} max={100} isMobile={true} />);
    
    const label = screen.getByTestId("stat-label");
    expect(label).toBeInTheDocument();
    expect(label).toHaveStyle({ fontSize: "9px" });
  });

  it("should have correct test id based on Korean label", () => {
    render(<StatBar label="공격 | Attack" value={75} max={100} />);
    
    const statBar = screen.getByTestId("stat-bar-공격");
    expect(statBar).toBeInTheDocument();
  });

  it("should calculate percentage correctly with custom max", () => {
    render(<StatBar label="방어 | Defense" value={60} max={120} />);
    
    const fill = screen.getByTestId("stat-bar-fill");
    expect(fill).toHaveStyle({ width: "50%" }); // 60/120 = 0.5 = 50%
  });
});
