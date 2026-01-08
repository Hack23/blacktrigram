/**
 * GuardIndicator Component Tests
 * 
 * @module components/combat/components/GuardIndicator.test
 * @category Combat UI Tests
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GuardIndicator } from "./GuardIndicator";
import { TrigramStance } from "../../../../../types/common";

describe("GuardIndicator", () => {
  describe("Rendering", () => {
    it("should render nothing when not in guard state", () => {
      const { container } = render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={false}
          position="left"
          isMobile={false}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it("should render guard indicator when in guard state", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByTestId("guard-indicator")).toBeInTheDocument();
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should display GUARD title with trigram symbol", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText(/☰ GUARD/)).toBeInTheDocument();
    });
  });

  describe("All Eight Trigram Stances", () => {
    it("should render Geon (Heaven) guard with correct info", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText("앞서기")).toBeInTheDocument(); // Korean name
      expect(screen.getByText("Ap Seogi")).toBeInTheDocument(); // Romanized
      expect(screen.getByText("High")).toBeInTheDocument(); // Height
      expect(screen.getByText("전방")).toBeInTheDocument(); // Korean weight
      expect(screen.getByText("forward")).toBeInTheDocument(); // English weight
    });

    it("should render Tae (Lake) guard with correct info", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.TAE}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText("앞굽이")).toBeInTheDocument();
      expect(screen.getByText("Ap Koobi")).toBeInTheDocument();
      expect(screen.getByText("전방")).toBeInTheDocument(); // Korean weight
      expect(screen.getByText("forward")).toBeInTheDocument(); // English weight
    });

    it("should render Li (Fire) guard with correct info", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.LI}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText("주춤")).toBeInTheDocument();
      expect(screen.getByText("Juchum Seogi")).toBeInTheDocument();
      expect(screen.getByText("중립")).toBeInTheDocument(); // Korean weight
      expect(screen.getByText("neutral")).toBeInTheDocument(); // English weight
    });

    it("should render Jin (Thunder) guard with correct info", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.JIN}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText("뒤굽이")).toBeInTheDocument();
      expect(screen.getByText("Dwi Koobi")).toBeInTheDocument();
      expect(screen.getByText("후방")).toBeInTheDocument(); // Korean weight
      expect(screen.getByText("back")).toBeInTheDocument(); // English weight
    });

    it("should render Son (Wind) guard with correct info", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.SON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText("범서기")).toBeInTheDocument();
      expect(screen.getByText("Beom Seogi")).toBeInTheDocument();
      expect(screen.getByText("중립")).toBeInTheDocument(); // Korean weight
      expect(screen.getByText("neutral")).toBeInTheDocument(); // English weight
    });

    it("should render Gam (Water) guard with correct info", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.GAM}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText("학다리")).toBeInTheDocument();
      expect(screen.getByText("Hak Dari Seogi")).toBeInTheDocument();
      expect(screen.getByText("중립")).toBeInTheDocument(); // Korean weight
      expect(screen.getByText("neutral")).toBeInTheDocument(); // English weight
    });

    it("should render Gan (Mountain) guard with correct info", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.GAN}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText("모아서기")).toBeInTheDocument();
      expect(screen.getByText("Moa Seogi")).toBeInTheDocument();
      expect(screen.getByText("중립")).toBeInTheDocument(); // Korean weight
      expect(screen.getByText("neutral")).toBeInTheDocument(); // English weight
    });

    it("should render Gon (Earth) guard with correct info", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.GON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText("중하")).toBeInTheDocument();
      expect(screen.getByText("Joong Ha Seogi")).toBeInTheDocument();
      expect(screen.getByText("Low")).toBeInTheDocument();
      expect(screen.getByText("중립")).toBeInTheDocument(); // Korean weight
      expect(screen.getByText("neutral")).toBeInTheDocument(); // English weight
    });
  });

  describe("Weight Distribution Display", () => {
    it("should display forward weight icon for forward stance", () => {
      const { container } = render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(container.textContent).toContain("▲"); // Forward icon
      expect(container.textContent).toContain("전방"); // Korean forward
    });

    it("should display back weight icon for back stance", () => {
      const { container } = render(
        <GuardIndicator
          currentStance={TrigramStance.JIN}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(container.textContent).toContain("▼"); // Back icon
      expect(container.textContent).toContain("후방"); // Korean back
    });

    it("should display neutral weight icon for neutral stance", () => {
      const { container } = render(
        <GuardIndicator
          currentStance={TrigramStance.SON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(container.textContent).toContain("●"); // Neutral icon
      expect(container.textContent).toContain("중립"); // Korean neutral
    });
  });

  describe("Guard Height Classification", () => {
    it("should classify Geon as high guard", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText("고위")).toBeInTheDocument(); // Korean high
      expect(screen.getByText("High")).toBeInTheDocument();
    });

    it("should classify Tae as mid guard", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.TAE}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText("중위")).toBeInTheDocument(); // Korean mid
      expect(screen.getByText("Mid")).toBeInTheDocument();
    });

    it("should classify Gon as low guard", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.GON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      expect(screen.getByText("저위")).toBeInTheDocument(); // Korean low
      expect(screen.getByText("Low")).toBeInTheDocument();
    });
  });

  describe("Player Positioning", () => {
    it("should position indicator on left for left player", () => {
      const { container } = render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      const indicator = container.firstChild as HTMLElement;
      expect(indicator.style.left).toBeTruthy();
      expect(indicator.style.right).toBe("auto");
    });

    it("should position indicator on right for right player", () => {
      const { container } = render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="right"
          isMobile={false}
        />
      );

      const indicator = container.firstChild as HTMLElement;
      expect(indicator.style.right).toBeTruthy();
      expect(indicator.style.left).toBe("auto");
    });
  });

  describe("Mobile Responsiveness", () => {
    it("should use mobile sizing when isMobile is true", () => {
      const { container } = render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={true}
        />
      );

      const indicator = container.firstChild as HTMLElement;
      expect(indicator.style.minWidth).toBe("140px");
    });

    it("should use desktop sizing when isMobile is false", () => {
      const { container } = render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      const indicator = container.firstChild as HTMLElement;
      expect(indicator.style.minWidth).toBe("180px");
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      const indicator = screen.getByRole("status");
      expect(indicator).toHaveAttribute("aria-live", "polite");
      expect(indicator).toHaveAttribute("aria-label");
      
      const label = indicator.getAttribute("aria-label");
      expect(label).toContain("Guard position");
      expect(label).toContain("Ap Seogi");
      expect(label).toContain("High guard");
      expect(label).toContain("forward weight");
    });

    it("should include guard height in aria-label", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.GON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      const indicator = screen.getByRole("status");
      const label = indicator.getAttribute("aria-label");
      expect(label).toContain("Low guard");
    });
  });

  describe("Visual Style", () => {
    it("should apply Korean cyberpunk styling", () => {
      const { container } = render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      const indicator = container.firstChild as HTMLElement;
      expect(indicator.style.border).toContain("rgba");
      expect(indicator.style.boxShadow).toBeTruthy();
      expect(indicator.style.backgroundColor).toContain("rgba");
    });

    it("should have pointer-events none for non-interactive display", () => {
      const { container } = render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      const indicator = container.firstChild as HTMLElement;
      expect(indicator.style.pointerEvents).toBe("none");
    });
  });

  describe("Korean Martial Arts Terminology", () => {
    it("should display authentic traditional stance names", () => {
      const traditionalStances = [
        { stance: TrigramStance.GEON, korean: "앞서기", english: "Ap Seogi" },
        { stance: TrigramStance.TAE, korean: "앞굽이", english: "Ap Koobi" },
        { stance: TrigramStance.LI, korean: "주춤", english: "Juchum Seogi" },
        { stance: TrigramStance.JIN, korean: "뒤굽이", english: "Dwi Koobi" },
        { stance: TrigramStance.SON, korean: "범서기", english: "Beom Seogi" },
        { stance: TrigramStance.GAM, korean: "학다리", english: "Hak Dari Seogi" },
        { stance: TrigramStance.GAN, korean: "모아서기", english: "Moa Seogi" },
        { stance: TrigramStance.GON, korean: "중하", english: "Joong Ha Seogi" },
      ];

      traditionalStances.forEach(({ stance, korean, english }) => {
        const { unmount } = render(
          <GuardIndicator
            currentStance={stance}
            isInGuard={true}
            position="left"
            isMobile={false}
          />
        );

        expect(screen.getByText(korean)).toBeInTheDocument();
        expect(screen.getByText(english)).toBeInTheDocument();
        
        unmount();
      });
    });

    it("should display guard characteristics in Korean", () => {
      render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={true}
          position="left"
          isMobile={false}
        />
      );

      // Korean height term
      expect(screen.getByText("고위")).toBeInTheDocument();
      // Korean weight term
      expect(screen.getByText("전방")).toBeInTheDocument();
    });
  });

  describe("Performance Optimization", () => {
    it("should not re-render when isInGuard stays false", () => {
      const { rerender, container } = render(
        <GuardIndicator
          currentStance={TrigramStance.GEON}
          isInGuard={false}
          position="left"
          isMobile={false}
        />
      );

      expect(container.firstChild).toBeNull();

      rerender(
        <GuardIndicator
          currentStance={TrigramStance.TAE}
          isInGuard={false}
          position="left"
          isMobile={false}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });
});
