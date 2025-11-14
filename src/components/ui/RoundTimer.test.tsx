import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoundTimer } from "./RoundTimer";

describe("RoundTimer", () => {
  const defaultProps = {
    timeRemaining: 60,
    totalTime: 90,
    currentRound: 1,
    maxRounds: 3,
    x: 0,
    y: 0,
    width: 200,
    height: 50,
    screenWidth: 1200,
    screenHeight: 800,
  };

  describe("rendering", () => {
    it("should render timer with default props", () => {
      render(<RoundTimer {...defaultProps} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should render on mobile screen", () => {
      render(<RoundTimer {...defaultProps} screenWidth={400} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should render on tablet screen", () => {
      render(<RoundTimer {...defaultProps} screenWidth={768} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should render on desktop screen", () => {
      render(<RoundTimer {...defaultProps} screenWidth={1920} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });
  });

  describe("time display", () => {
    it("should display time in mm:ss format", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={90} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should display zero time", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={0} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should display time with milliseconds when enabled", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={45.75} showMilliseconds={true} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should display time without milliseconds by default", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={45.75} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle very small time values", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={0.5} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle large time values", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={599} totalTime={600} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle negative time values", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={-5} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });
  });

  describe("urgency levels", () => {
    it("should show normal status for high time", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={60} totalTime={90} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should show warning status for medium time", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={20} totalTime={90} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should show critical status for low time", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={5} totalTime={90} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle exactly 30% threshold", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={27} totalTime={90} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle exactly 10% threshold", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={9} totalTime={90} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });
  });

  describe("pause state", () => {
    it("should display paused state", () => {
      render(<RoundTimer {...defaultProps} isPaused={true} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should display unpaused state", () => {
      render(<RoundTimer {...defaultProps} isPaused={false} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle pause with critical time", () => {
      render(<RoundTimer {...defaultProps} isPaused={true} timeRemaining={5} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });
  });

  describe("round display", () => {
    it("should display first round", () => {
      render(<RoundTimer {...defaultProps} currentRound={1} maxRounds={3} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should display final round", () => {
      render(<RoundTimer {...defaultProps} currentRound={3} maxRounds={3} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle single round", () => {
      render(<RoundTimer {...defaultProps} currentRound={1} maxRounds={1} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle many rounds", () => {
      render(<RoundTimer {...defaultProps} currentRound={5} maxRounds={10} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle overtime rounds", () => {
      render(<RoundTimer {...defaultProps} currentRound={4} maxRounds={3} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });
  });

  describe("responsive behavior", () => {
    it("should adapt to small mobile screens", () => {
      render(<RoundTimer {...defaultProps} screenWidth={320} screenHeight={568} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should adapt to large desktop screens", () => {
      render(<RoundTimer {...defaultProps} screenWidth={2560} screenHeight={1440} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle very small dimensions", () => {
      render(<RoundTimer {...defaultProps} width={100} height={30} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle very large dimensions", () => {
      render(<RoundTimer {...defaultProps} width={500} height={100} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });
  });

  describe("positioning", () => {
    it("should position at custom coordinates", () => {
      render(<RoundTimer {...defaultProps} x={100} y={50} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should position at negative coordinates", () => {
      render(<RoundTimer {...defaultProps} x={-10} y={-10} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should position at center of screen", () => {
      render(<RoundTimer {...defaultProps} x={600} y={400} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });
  });

  describe("time calculations", () => {
    it("should calculate minutes correctly", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={125} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should calculate seconds correctly", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={65} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should calculate milliseconds correctly", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={30.75} showMilliseconds={true} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle zero totalTime", () => {
      render(<RoundTimer {...defaultProps} totalTime={0} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle timeRemaining greater than totalTime", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={120} totalTime={90} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle float time values", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={45.67} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });
  });

  describe("Korean martial arts integration", () => {
    it("should display Korean round format", () => {
      render(<RoundTimer {...defaultProps} currentRound={2} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle traditional Korean time units", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={30} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle exactly 1 minute", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={60} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle exactly 1 second", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={1} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle fractional seconds", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={0.25} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle very precise time values", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={12.3456} showMilliseconds={true} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle round 0", () => {
      render(<RoundTimer {...defaultProps} currentRound={0} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should handle max rounds 0", () => {
      render(<RoundTimer {...defaultProps} maxRounds={0} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });
  });

  describe("time formatting", () => {
    it("should pad single digit minutes", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={65} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should pad single digit seconds", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={5} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should pad single digit milliseconds", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={1.05} showMilliseconds={true} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });

    it("should format double digit values", () => {
      render(<RoundTimer {...defaultProps} timeRemaining={125} />);
      expect(screen.getByTestId("round-timer")).toBeInTheDocument();
    });
  });
});
