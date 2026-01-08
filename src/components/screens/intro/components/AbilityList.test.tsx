import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KOREAN_COLORS } from "../../../../../types/constants";
import { AbilityList } from "./AbilityList";

describe("AbilityList", () => {
  it("should render list header in Korean and English", () => {
    const abilities = ["Shadow Strike", "Vital Point Mastery"];
    render(<AbilityList abilities={abilities} />);
    
    const header = screen.getByTestId("ability-list-header");
    expect(header).toBeInTheDocument();
    expect(header.textContent).toBe("특수 능력 | Special Abilities");
  });

  it("should render string abilities with Korean fallback", () => {
    const abilities = ["Honor Strike", "Defensive Mastery"];
    render(<AbilityList abilities={abilities} />);
    
    const ability0 = screen.getByTestId("ability-0-name");
    expect(ability0).toBeInTheDocument();
    expect(ability0.textContent).toBe("Honor Strike | Honor Strike");
  });

  it("should render object abilities with Korean and English", () => {
    const abilities = [
      {
        korean: "그림자 타격",
        english: "Shadow Strike",
      },
      {
        korean: "급소 숙련",
        english: "Vital Point Mastery",
      },
    ];
    render(<AbilityList abilities={abilities} />);
    
    const ability0 = screen.getByTestId("ability-0-name");
    expect(ability0.textContent).toBe("그림자 타격 | Shadow Strike");
    
    const ability1 = screen.getByTestId("ability-1-name");
    expect(ability1.textContent).toBe("급소 숙련 | Vital Point Mastery");
  });

  it("should render ability descriptions when provided", () => {
    const abilities = [
      {
        korean: "시스템 오버라이드",
        english: "System Override",
        description: {
          korean: "적의 방어 시스템을 해킹합니다",
          english: "Hack enemy defense systems",
        },
      },
    ];
    render(<AbilityList abilities={abilities} />);
    
    const description = screen.getByTestId("ability-0-description");
    expect(description).toBeInTheDocument();
    expect(description.textContent).toContain("적의 방어 시스템을 해킹합니다");
    expect(description.textContent).toContain("Hack enemy defense systems");
  });

  it("should limit displayed abilities to maxAbilities", () => {
    const abilities = [
      "Ability 1",
      "Ability 2",
      "Ability 3",
      "Ability 4",
      "Ability 5",
    ];
    render(<AbilityList abilities={abilities} maxAbilities={2} />);
    
    expect(screen.getByTestId("ability-0")).toBeInTheDocument();
    expect(screen.getByTestId("ability-1")).toBeInTheDocument();
    expect(screen.queryByTestId("ability-2")).not.toBeInTheDocument();
  });

  it("should use custom color for abilities", () => {
    const customColor = KOREAN_COLORS.ACCENT_GOLD;
    const abilities = ["Test Ability"];
    render(<AbilityList abilities={abilities} color={customColor} />);
    
    const header = screen.getByTestId("ability-list-header");
    expect(header).toHaveStyle({
      color: `#${customColor.toString(16).padStart(6, "0")}`,
    });
  });

  it("should render in mobile mode with smaller dimensions", () => {
    const abilities = ["Mobile Ability"];
    render(<AbilityList abilities={abilities} isMobile={true} />);
    
    const header = screen.getByTestId("ability-list-header");
    expect(header).toHaveStyle({ fontSize: "12px" });
    
    const abilityName = screen.getByTestId("ability-0-name");
    expect(abilityName).toHaveStyle({ fontSize: "10px" });
  });

  it("should render nothing when abilities array is empty", () => {
    const { container } = render(<AbilityList abilities={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("should handle mixed ability formats", () => {
    const abilities: any[] = [
      "String Ability",
      {
        korean: "객체 능력",
        english: "Object Ability",
      },
    ];
    render(<AbilityList abilities={abilities} />);
    
    const ability0 = screen.getByTestId("ability-0-name");
    expect(ability0.textContent).toBe("String Ability | String Ability");
    
    const ability1 = screen.getByTestId("ability-1-name");
    expect(ability1.textContent).toBe("객체 능력 | Object Ability");
  });

  it("should default to showing 3 abilities when maxAbilities not specified", () => {
    const abilities = ["Ability 1", "Ability 2", "Ability 3", "Ability 4"];
    render(<AbilityList abilities={abilities} />);
    
    expect(screen.getByTestId("ability-0")).toBeInTheDocument();
    expect(screen.getByTestId("ability-1")).toBeInTheDocument();
    expect(screen.getByTestId("ability-2")).toBeInTheDocument();
    expect(screen.queryByTestId("ability-3")).not.toBeInTheDocument();
  });
});
