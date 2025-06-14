import { screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { renderWithPixi } from "../../../test/test-utils";
import { TrainingArtDisplay } from "./TrainingArtDisplay";
import { TrigramStance, PlayerArchetype } from "../../../types/enums";

const defaultProps = {
  selectedStance: TrigramStance.GEON,
  playerArchetype: PlayerArchetype.MUSA,
  trainingMode: "basics",
  isTraining: false,
  accuracy: 0,
  currentCombo: 0,
  x: 0,
  y: 0,
  width: 800,
  height: 600,
  screenWidth: 1200,
  screenHeight: 800,
};

describe("TrainingArtDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing", () => {
    renderWithPixi(<TrainingArtDisplay {...defaultProps} />);

    expect(screen.getByTestId("training-art-display")).toBeInTheDocument();
  });

  it("should display dojang background", () => {
    renderWithPixi(<TrainingArtDisplay {...defaultProps} />);

    expect(screen.getByTestId("dojang-background")).toBeInTheDocument();
  });

  it("should show Korean archetype and stance names", () => {
    renderWithPixi(<TrainingArtDisplay {...defaultProps} />);

    expect(screen.getByTestId("archetype-korean-name")).toBeInTheDocument();
    expect(screen.getByTestId("stance-korean-name")).toBeInTheDocument();
  });

  it("should display performance indicators when training", () => {
    renderWithPixi(
      <TrainingArtDisplay
        {...defaultProps}
        isTraining={true}
        accuracy={75}
        currentCombo={3}
      />
    );

    expect(screen.getByTestId("performance-indicators")).toBeInTheDocument();
    expect(screen.getByTestId("accuracy-korean")).toBeInTheDocument();
    expect(screen.getByTestId("combo-korean")).toBeInTheDocument();
  });

  it("should adapt to different screen sizes", () => {
    const { rerender } = renderWithPixi(
      <TrainingArtDisplay {...defaultProps} />
    );

    // Mobile layout
    rerender(
      <TrainingArtDisplay
        {...defaultProps}
        screenWidth={400}
        screenHeight={600}
      />
    );

    expect(screen.getByTestId("training-art-display")).toBeInTheDocument();
  });

  it("should display trigram symbol", () => {
    renderWithPixi(<TrainingArtDisplay {...defaultProps} />);

    expect(screen.getByTestId("trigram-symbol")).toBeInTheDocument();
  });
});
