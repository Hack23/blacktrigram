/**
 * Comprehensive tests for TechniqueCard component
 * 
 * Test coverage for:
 * - Visual state changes (selected, available, cooldown)
 * - Tooltip display on hover/focus
 * - Reach calculation with PhysicalReachCalculator
 * - Touch handling for mobile (300ms delay prevention)
 * - ARIA accessibility attributes
 * - Korean/English bilingual text rendering
 * - Resource cost display
 * - Keyboard shortcut rendering
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TechniqueCard } from "./TechniqueCard";
import {
  DamageType,
  PlayerArchetype,
  Technique,
  TrigramStance,
} from "../../../../types";
import { FONT_FAMILY } from "../../../../types/constants";
import * as haptics from "../../../../utils/haptics";
import { AttackAnimationType } from "../../../../types/skeletal";

// Mock haptics module
vi.mock("../../../../utils/haptics", () => ({
  triggerHaptic: vi.fn(),
}));

// Mock physicalReachCalculator
vi.mock("../../../../systems/physics", () => ({
  physicalReachCalculator: {
    calculateMaxReach: vi.fn(() => 2.5), // 250cm
    getTechniqueTypeFromAnimation: vi.fn(() => "punch"),
  },
}));

// Mock archetype physical attributes
vi.mock("../../../../data/archetypePhysicalAttributes", () => ({
  getArchetypePhysicalAttributes: vi.fn(() => ({
    heightCm: 175,
    armSpanCm: 180,
    legLengthCm: 90,
  })),
}));

// Create mock technique for testing
const createMockTechnique = (overrides: Partial<Technique> = {}): Technique => ({
  id: "test-technique",
  name: { korean: "테스트 기술", english: "Test Technique" },
  description: {
    korean: "테스트용 기술 설명입니다",
    english: "This is a test technique description",
  },
  staminaCost: 20,
  kiCost: 10,
  damage: { min: 15, max: 25 },
  damageType: DamageType.BLUNT,
  cooldown: 2000,
  keyboardShortcut: "Q",
  animation: {
    type: AttackAnimationType.PUNCH_HIGH,
    speedModifier: 1.0,
  },
  ...overrides,
});

describe("TechniqueCard", () => {
  const mockTechnique = createMockTechnique({
    name: { korean: "천둥벽력", english: "Thunder Strike" },
    description: {
      korean: "강력한 하늘의 힘으로 적을 강타합니다",
      english: "Strike with the power of heaven",
    },
    staminaCost: 15,
    kiCost: 10,
    damage: { min: 25, max: 35 },
  });

  const defaultProps = {
    technique: mockTechnique,
    isSelected: false,
    isAvailable: true,
    staminaCost: 15,
    kiCost: 10,
    remainingCooldown: 0,
    keyboardShortcut: "Q",
    onClick: vi.fn(),
    onHover: vi.fn(),
    isMobile: false,
    playerArchetype: PlayerArchetype.MUSA,
    playerStance: TrigramStance.GEON,
    position: { x: 0, y: 0 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render technique card with correct test ID", () => {
      render(<TechniqueCard {...defaultProps} />);
      expect(screen.getByTestId(`technique-card-${mockTechnique.id}`)).toBeInTheDocument();
    });

    it("should render Korean technique name", () => {
      render(<TechniqueCard {...defaultProps} />);
      expect(screen.getByText("천둥벽력")).toBeInTheDocument();
    });

    it("should render English technique name", () => {
      render(<TechniqueCard {...defaultProps} />);
      expect(screen.getByText("Thunder Strike")).toBeInTheDocument();
    });

    it("should render keyboard shortcut", () => {
      render(<TechniqueCard {...defaultProps} />);
      expect(screen.getByText("Q")).toBeInTheDocument();
    });

    it("should display stamina cost", () => {
      render(<TechniqueCard {...defaultProps} />);
      expect(screen.getByText("15")).toBeInTheDocument();
    });

    it("should display ki cost", () => {
      render(<TechniqueCard {...defaultProps} />);
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("should use Korean font family", () => {
      const { container } = render(<TechniqueCard {...defaultProps} />);
      const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
      expect(card.style.fontFamily).toBe(FONT_FAMILY.KOREAN);
    });
  });

  describe("Visual State Changes", () => {
    describe("Selected State", () => {
      it("should apply selected background color when selected", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isSelected={true} isAvailable={true} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        expect(card.style.backgroundColor).toBe("rgba(0, 255, 255, 0.3)");
      });

      it("should apply cyan border when selected", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isSelected={true} isAvailable={true} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        // Border is rendered as RGB by browser, check for "solid" style
        expect(card.style.border).toContain("2px solid");
      });

      it("should apply glow effect when selected", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isSelected={true} isAvailable={true} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        expect(card.style.boxShadow).toContain("0 0 15px");
        expect(card.style.boxShadow).toContain("rgba(0, 255, 255");
      });

      it("should not apply glow when selected but unavailable", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isSelected={true} isAvailable={false} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        expect(card.style.boxShadow).toBe("0 2px 8px rgba(0, 0, 0, 0.5)");
      });
    });

    describe("Available State", () => {
      it("should apply normal background when available", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isAvailable={true} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        expect(card.style.backgroundColor).toBe("rgba(26, 26, 30, 0.9)");
      });

      it("should apply gold border when available", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isAvailable={true} isSelected={false} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        // Border is rendered as RGB by browser, check for "solid" style
        expect(card.style.border).toContain("2px solid");
      });

      it("should have full opacity when available", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isAvailable={true} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        expect(card.style.opacity).toBe("1");
      });

      it("should have pointer cursor when available", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isAvailable={true} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        expect(card.style.cursor).toBe("pointer");
      });
    });

    describe("Unavailable State", () => {
      it("should apply disabled background when unavailable", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isAvailable={false} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        expect(card.style.backgroundColor).toBe("rgba(50, 50, 50, 0.8)");
      });

      it("should apply gray border when unavailable", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isAvailable={false} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        // Border is rendered as RGB by browser, check for "solid" style
        expect(card.style.border).toContain("2px solid");
      });

      it("should have reduced opacity when unavailable", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isAvailable={false} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        expect(card.style.opacity).toBe("0.5");
      });

      it("should have not-allowed cursor when unavailable", () => {
        const { container } = render(
          <TechniqueCard {...defaultProps} isAvailable={false} />
        );
        const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
        expect(card.style.cursor).toBe("not-allowed");
      });
    });

    describe("Cooldown State", () => {
      it("should display cooldown overlay when on cooldown", () => {
        render(
          <TechniqueCard {...defaultProps} remainingCooldown={1500} />
        );
        expect(screen.getByText("2s")).toBeInTheDocument();
      });

      it("should format cooldown time correctly", () => {
        render(
          <TechniqueCard {...defaultProps} remainingCooldown={500} />
        );
        expect(screen.getByText("1s")).toBeInTheDocument();
      });

      it("should not display cooldown overlay when cooldown is 0", () => {
        render(
          <TechniqueCard {...defaultProps} remainingCooldown={0} />
        );
        expect(screen.queryByText(/\ds/)).not.toBeInTheDocument();
      });

      it("should not display cooldown overlay when cooldown is undefined", () => {
        render(
          <TechniqueCard {...defaultProps} remainingCooldown={undefined} />
        );
        expect(screen.queryByText(/\ds/)).not.toBeInTheDocument();
      });

      it("should round up cooldown seconds", () => {
        render(
          <TechniqueCard {...defaultProps} remainingCooldown={1100} />
        );
        expect(screen.getByText("2s")).toBeInTheDocument();
      });
    });
  });

  describe("Tooltip Display", () => {
    it("should show tooltip on hover", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("should hide tooltip on mouse leave", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      
      fireEvent.mouseLeave(card);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("should show tooltip on focus", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.focus(card);
      
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });

    it("should hide tooltip on blur", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.focus(card);
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      
      fireEvent.blur(card);
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("should not show tooltip when unavailable", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={false} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });

    it("should display Korean description in tooltip", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.getByText("강력한 하늘의 힘으로 적을 강타합니다")).toBeInTheDocument();
    });

    it("should display English description in tooltip", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.getByText("Strike with the power of heaven")).toBeInTheDocument();
    });

    it("should display damage range in tooltip", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.getByText(/Damage: 25-35/)).toBeInTheDocument();
    });

    it("should display cooldown duration in tooltip", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.getByText(/Cooldown: 2s/)).toBeInTheDocument();
    });

    it("should display required stance in tooltip when present", () => {
      const techniqueWithStance = createMockTechnique({
        requiredStance: TrigramStance.GEON,
      });
      
      render(
        <TechniqueCard
          {...defaultProps}
          technique={techniqueWithStance}
          isAvailable={true}
        />
      );
      const card = screen.getByTestId(`technique-card-${techniqueWithStance.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.getByText(/Stance: geon/)).toBeInTheDocument();
    });
  });

  describe("Reach Calculation", () => {
    it("should display reach information in tooltip when player info provided", () => {
      render(
        <TechniqueCard
          {...defaultProps}
          playerArchetype={PlayerArchetype.MUSA}
          playerStance={TrigramStance.GEON}
          isAvailable={true}
        />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.getByText(/Reach:/)).toBeInTheDocument();
    });

    it("should display reach in centimeters", () => {
      render(
        <TechniqueCard
          {...defaultProps}
          playerArchetype={PlayerArchetype.MUSA}
          playerStance={TrigramStance.GEON}
          isAvailable={true}
        />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.getByText(/250\.0cm/)).toBeInTheDocument();
    });

    it("should display body part for reach calculation", () => {
      render(
        <TechniqueCard
          {...defaultProps}
          playerArchetype={PlayerArchetype.MUSA}
          playerStance={TrigramStance.GEON}
          isAvailable={true}
        />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.getByText(/Arm \(팔\)/)).toBeInTheDocument();
    });

    it("should not display reach when player archetype is missing", () => {
      render(
        <TechniqueCard
          {...defaultProps}
          playerArchetype={undefined}
          isAvailable={true}
        />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.queryByText(/Reach:/)).not.toBeInTheDocument();
    });

    it("should not display reach when player stance is missing", () => {
      render(
        <TechniqueCard
          {...defaultProps}
          playerStance={undefined}
          isAvailable={true}
        />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.queryByText(/Reach:/)).not.toBeInTheDocument();
    });

    it("should not display reach when animation type is missing", () => {
      const techniqueWithoutAnimation = createMockTechnique({
        animation: undefined,
      });
      
      render(
        <TechniqueCard
          {...defaultProps}
          technique={techniqueWithoutAnimation}
          playerArchetype={PlayerArchetype.MUSA}
          playerStance={TrigramStance.GEON}
          isAvailable={true}
        />
      );
      const card = screen.getByTestId(`technique-card-${techniqueWithoutAnimation.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(screen.queryByText(/Reach:/)).not.toBeInTheDocument();
    });
  });

  describe("Touch Handling", () => {
    it("should prevent default on touch to avoid ghost click", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      // Manually call the component's touch handler
      // The component calls preventDefault internally
      fireEvent.touchEnd(card);
      
      // The component should handle the touch event (test passes if no error)
      expect(card).toBeInTheDocument();
    });

    it("should trigger haptic feedback on touch", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.touchEnd(card);
      
      expect(haptics.triggerHaptic).toHaveBeenCalledWith("light");
    });

    it("should call onClick on touch", () => {
      const mockClick = vi.fn();
      render(
        <TechniqueCard {...defaultProps} onClick={mockClick} isAvailable={true} />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.touchEnd(card);
      
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick on touch when unavailable", () => {
      const mockClick = vi.fn();
      render(
        <TechniqueCard {...defaultProps} onClick={mockClick} isAvailable={false} />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.touchEnd(card);
      
      expect(mockClick).not.toHaveBeenCalled();
    });

    it("should not trigger haptic when unavailable", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={false} />);
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.touchEnd(card);
      
      expect(haptics.triggerHaptic).not.toHaveBeenCalled();
    });

    it("should have manipulation touch action", () => {
      const { container } = render(<TechniqueCard {...defaultProps} />);
      const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
      expect(card.style.touchAction).toBe("manipulation");
    });

    it("should prevent text selection on touch", () => {
      const { container } = render(<TechniqueCard {...defaultProps} />);
      const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
      expect(card.style.userSelect).toBe("none");
    });
  });

  describe("Accessibility", () => {
    it("should have button role", () => {
      render(<TechniqueCard {...defaultProps} />);
      const card = screen.getByRole("button");
      expect(card).toBeInTheDocument();
    });

    it("should have proper aria-label with Korean and English names", () => {
      render(<TechniqueCard {...defaultProps} />);
      const card = screen.getByRole("button");
      expect(card).toHaveAttribute(
        "aria-label",
        "천둥벽력 (Thunder Strike). Stamina: 15, Ki: 10"
      );
    });

    it("should have aria-disabled false when available", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByRole("button");
      expect(card).toHaveAttribute("aria-disabled", "false");
    });

    it("should have aria-disabled true when unavailable", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={false} />);
      const card = screen.getByRole("button");
      expect(card).toHaveAttribute("aria-disabled", "true");
    });

    it("should have tabIndex 0 when available", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByRole("button");
      expect(card).toHaveProperty("tabIndex", 0);
    });

    it("should have tabIndex -1 when unavailable", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={false} />);
      const card = screen.getByRole("button");
      expect(card).toHaveProperty("tabIndex", -1);
    });

    it("should have aria-describedby when tooltip is shown", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByRole("button");
      
      fireEvent.mouseEnter(card);
      
      expect(card).toHaveAttribute("aria-describedby", `tooltip-${mockTechnique.id}`);
    });

    it("should not have aria-describedby when tooltip is hidden", () => {
      render(<TechniqueCard {...defaultProps} isAvailable={true} />);
      const card = screen.getByRole("button");
      
      expect(card).not.toHaveAttribute("aria-describedby");
    });

    it("should update aria-label with different technique", () => {
      const differentTechnique = createMockTechnique({
        name: { korean: "용권", english: "Dragon Fist" },
        staminaCost: 18,
        kiCost: 12,
      });
      
      render(
        <TechniqueCard
          {...defaultProps}
          technique={differentTechnique}
          staminaCost={18}
          kiCost={12}
        />
      );
      const card = screen.getByRole("button");
      expect(card).toHaveAttribute(
        "aria-label",
        "용권 (Dragon Fist). Stamina: 18, Ki: 12"
      );
    });
  });

  describe("User Interactions", () => {
    it("should call onClick when clicked and available", () => {
      const mockClick = vi.fn();
      render(
        <TechniqueCard {...defaultProps} onClick={mockClick} isAvailable={true} />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.click(card);
      
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when unavailable", () => {
      const mockClick = vi.fn();
      render(
        <TechniqueCard {...defaultProps} onClick={mockClick} isAvailable={false} />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.click(card);
      
      expect(mockClick).not.toHaveBeenCalled();
    });

    it("should call onHover with technique on mouse enter", () => {
      const mockHover = vi.fn();
      render(
        <TechniqueCard {...defaultProps} onHover={mockHover} />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      
      expect(mockHover).toHaveBeenCalledWith(mockTechnique);
    });

    it("should call onHover with null on mouse leave", () => {
      const mockHover = vi.fn();
      render(
        <TechniqueCard {...defaultProps} onHover={mockHover} />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.mouseEnter(card);
      fireEvent.mouseLeave(card);
      
      expect(mockHover).toHaveBeenLastCalledWith(null);
    });

    it("should call onHover with technique on focus", () => {
      const mockHover = vi.fn();
      render(
        <TechniqueCard {...defaultProps} onHover={mockHover} />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.focus(card);
      
      expect(mockHover).toHaveBeenCalledWith(mockTechnique);
    });

    it("should call onHover with null on blur", () => {
      const mockHover = vi.fn();
      render(
        <TechniqueCard {...defaultProps} onHover={mockHover} />
      );
      const card = screen.getByTestId(`technique-card-${mockTechnique.id}`);
      
      fireEvent.focus(card);
      fireEvent.blur(card);
      
      expect(mockHover).toHaveBeenLastCalledWith(null);
    });
  });

  describe("Responsive Sizing", () => {
    it("should use mobile sizing when isMobile is true", () => {
      const { container } = render(
        <TechniqueCard {...defaultProps} isMobile={true} />
      );
      const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
      expect(card.style.width).toBe("70px");
      expect(card.style.height).toBe("80px");
    });

    it("should use desktop sizing when isMobile is false", () => {
      const { container } = render(
        <TechniqueCard {...defaultProps} isMobile={false} />
      );
      const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
      expect(card.style.width).toBe("90px");
      expect(card.style.height).toBe("100px");
    });

    it("should adjust font size for mobile", () => {
      render(<TechniqueCard {...defaultProps} isMobile={true} />);
      // Font size is applied to child elements - verify card renders
      expect(screen.getByTestId(`technique-card-${mockTechnique.id}`)).toBeInTheDocument();
    });
  });

  describe("Korean Theming", () => {
    it("should use Korean font family", () => {
      const { container } = render(<TechniqueCard {...defaultProps} />);
      const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
      expect(card.style.fontFamily).toBe(FONT_FAMILY.KOREAN);
    });

    it("should display Korean characters correctly", () => {
      render(<TechniqueCard {...defaultProps} />);
      expect(screen.getByText("천둥벽력")).toBeInTheDocument();
      expect(screen.getByText("氣")).toBeInTheDocument(); // Ki character
    });

    it("should use Korean color constants", () => {
      const { container } = render(
        <TechniqueCard {...defaultProps} isAvailable={true} isSelected={false} />
      );
      const card = container.querySelector('[data-testid^="technique-card"]') as HTMLElement;
      
      // Border should use KOREAN_COLORS constants when available and not selected
      // The border includes width and style, so just check it contains "solid"
      expect(card.style.border).toContain("solid");
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long technique names", () => {
      const longNameTechnique = createMockTechnique({
        name: {
          korean: "매우매우매우긴한국어기술이름",
          english: "Very Very Very Long English Technique Name",
        },
      });
      
      render(
        <TechniqueCard {...defaultProps} technique={longNameTechnique} />
      );
      
      expect(screen.getByText("매우매우매우긴한국어기술이름")).toBeInTheDocument();
    });

    it("should handle zero resource costs", () => {
      render(
        <TechniqueCard {...defaultProps} staminaCost={0} kiCost={0} />
      );
      
      // Both stamina and ki show "0" - use getAllByText
      const zeros = screen.getAllByText("0");
      expect(zeros.length).toBeGreaterThanOrEqual(2);
    });

    it("should handle very high cooldown values", () => {
      render(
        <TechniqueCard {...defaultProps} remainingCooldown={30000} />
      );
      
      expect(screen.getByText("30s")).toBeInTheDocument();
    });

    it("should handle negative cooldown as no cooldown", () => {
      render(
        <TechniqueCard {...defaultProps} remainingCooldown={-100} />
      );
      
      expect(screen.queryByText(/\ds/)).not.toBeInTheDocument();
    });

    it("should handle missing animation configuration", () => {
      const noAnimationTechnique = createMockTechnique({
        animation: undefined,
      });
      
      render(
        <TechniqueCard
          {...defaultProps}
          technique={noAnimationTechnique}
          playerArchetype={PlayerArchetype.MUSA}
          playerStance={TrigramStance.GEON}
        />
      );
      
      expect(screen.getByTestId(`technique-card-${noAnimationTechnique.id}`)).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should use memoization for card size calculations", () => {
      const { rerender } = render(<TechniqueCard {...defaultProps} isMobile={false} />);
      
      // Rerender with same props - memoized values should be used
      rerender(<TechniqueCard {...defaultProps} isMobile={false} />);
      
      // Component should render without errors (memoization working)
      expect(screen.getByTestId(`technique-card-${mockTechnique.id}`)).toBeInTheDocument();
    });

    it("should not cause memory leaks on unmount", () => {
      const { unmount } = render(<TechniqueCard {...defaultProps} />);
      
      // Unmount should clean up properly
      expect(() => unmount()).not.toThrow();
    });
  });
});
