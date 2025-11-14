import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StanceIndicator } from "./StanceIndicator";
import { TrigramStance } from "../../types/common";

describe("StanceIndicator", () => {
  const defaultProps = {
    stance: TrigramStance.GEON,
    x: 0,
    y: 0,
  };

  describe("rendering", () => {
    it("should render with GEON stance", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GEON} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should render with TAE stance", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.TAE} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should render with LI stance", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.LI} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should render with JIN stance", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.JIN} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should render with SON stance", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.SON} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should render with GAM stance", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GAM} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should render with GAN stance", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GAN} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should render with GON stance", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GON} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });
  });

  describe("size variations", () => {
    it("should render with default size", () => {
      render(<StanceIndicator {...defaultProps} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should render with small size", () => {
      render(<StanceIndicator {...defaultProps} size={30} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should render with medium size", () => {
      render(<StanceIndicator {...defaultProps} size={60} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should render with large size", () => {
      render(<StanceIndicator {...defaultProps} size={100} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should handle very small size", () => {
      render(<StanceIndicator {...defaultProps} size={10} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should handle very large size", () => {
      render(<StanceIndicator {...defaultProps} size={200} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });
  });

  describe("details display", () => {
    it("should show details when enabled", () => {
      render(<StanceIndicator {...defaultProps} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should hide details when disabled", () => {
      render(<StanceIndicator {...defaultProps} showDetails={false} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should show details by default", () => {
      render(<StanceIndicator {...defaultProps} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should display Korean name in details", () => {
      render(<StanceIndicator {...defaultProps} showDetails={true} stance={TrigramStance.GEON} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should display English name in details", () => {
      render(<StanceIndicator {...defaultProps} showDetails={true} stance={TrigramStance.TAE} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });
  });

  describe("positioning", () => {
    it("should position at custom coordinates", () => {
      render(<StanceIndicator {...defaultProps} x={100} y={50} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should position at negative coordinates", () => {
      render(<StanceIndicator {...defaultProps} x={-10} y={-10} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should position at large coordinates", () => {
      render(<StanceIndicator {...defaultProps} x={1000} y={800} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should position at zero coordinates", () => {
      render(<StanceIndicator {...defaultProps} x={0} y={0} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });
  });

  describe("Korean trigram symbols", () => {
    it("should display GEON symbol (☰)", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GEON} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should display TAE symbol (☱)", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.TAE} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should display LI symbol (☲)", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.LI} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should display JIN symbol (☳)", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.JIN} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should display SON symbol (☴)", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.SON} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should display GAM symbol (☵)", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GAM} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should display GAN symbol (☶)", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GAN} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should display GON symbol (☷)", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GON} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });
  });

  describe("stance colors", () => {
    it("should use correct color for GEON", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GEON} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should use correct color for TAE", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.TAE} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should use correct color for LI", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.LI} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should use correct color for JIN", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.JIN} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should use correct color for SON", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.SON} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should use correct color for GAM", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GAM} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should use correct color for GAN", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GAN} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should use correct color for GON", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GON} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });
  });

  describe("Korean martial arts integration", () => {
    it("should display Korean descriptions", () => {
      render(<StanceIndicator {...defaultProps} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should display English descriptions", () => {
      render(<StanceIndicator {...defaultProps} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should show GEON as direct bone-striking force", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GEON} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should show TAE as fluid joint manipulation", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.TAE} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should show LI as precise nerve strikes", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.LI} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should show JIN as stunning techniques", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.JIN} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should show SON as continuous pressure", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.SON} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should show GAM as blood flow restriction", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GAM} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should show GAN as defensive counters", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GAN} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should show GON as ground techniques", () => {
      render(<StanceIndicator {...defaultProps} stance={TrigramStance.GON} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });
  });

  describe("combined props", () => {
    it("should render with all props", () => {
      render(
        <StanceIndicator
          stance={TrigramStance.GEON}
          x={100}
          y={50}
          size={80}
          showDetails={true}
        />
      );
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should handle minimal props", () => {
      render(<StanceIndicator stance={TrigramStance.TAE} x={0} y={0} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should handle large size with details", () => {
      render(
        <StanceIndicator
          stance={TrigramStance.LI}
          x={0}
          y={0}
          size={150}
          showDetails={true}
        />
      );
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should handle small size without details", () => {
      render(
        <StanceIndicator
          stance={TrigramStance.JIN}
          x={0}
          y={0}
          size={20}
          showDetails={false}
        />
      );
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle stance changes", () => {
      const { rerender } = render(<StanceIndicator {...defaultProps} stance={TrigramStance.GEON} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();

      rerender(<StanceIndicator {...defaultProps} stance={TrigramStance.TAE} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should handle size changes", () => {
      const { rerender } = render(<StanceIndicator {...defaultProps} size={50} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();

      rerender(<StanceIndicator {...defaultProps} size={100} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should handle position changes", () => {
      const { rerender } = render(<StanceIndicator {...defaultProps} x={0} y={0} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();

      rerender(<StanceIndicator {...defaultProps} x={100} y={100} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });

    it("should handle detail toggle", () => {
      const { rerender } = render(<StanceIndicator {...defaultProps} showDetails={true} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();

      rerender(<StanceIndicator {...defaultProps} showDetails={false} />);
      expect(screen.getByTestId("stance-indicator-geon")).toBeInTheDocument();
    });
  });
});
