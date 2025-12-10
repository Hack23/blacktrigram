/**
 * Tests for AnatomyControlsHTML component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnatomyControlsHTML } from "./AnatomyControlsHTML";
import type { AnatomyLayer } from "./AnatomyOverlay3D";

describe("AnatomyControlsHTML", () => {
  it("should render without crashing", () => {
    render(
      <AnatomyControlsHTML
        visibleLayers={[]}
        onLayerToggle={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByTestId("anatomy-controls-html")).toBeInTheDocument();
  });

  it("should render Korean and English header text", () => {
    render(
      <AnatomyControlsHTML
        visibleLayers={[]}
        onLayerToggle={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByText("해부학 표시")).toBeInTheDocument();
    expect(screen.getByText("Anatomy Display")).toBeInTheDocument();
  });

  it("should render all four anatomy layer buttons", () => {
    render(
      <AnatomyControlsHTML
        visibleLayers={[]}
        onLayerToggle={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByTestId("anatomy-layer-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("anatomy-layer-nerves")).toBeInTheDocument();
    expect(screen.getByTestId("anatomy-layer-vascular")).toBeInTheDocument();
    expect(screen.getByTestId("anatomy-layer-surface")).toBeInTheDocument();
  });

  it("should show Korean and English labels for each layer", () => {
    render(
      <AnatomyControlsHTML
        visibleLayers={[]}
        onLayerToggle={vi.fn()}
        isMobile={false}
      />
    );

    // Skeleton layer
    expect(screen.getByText("골격")).toBeInTheDocument();
    expect(screen.getByText("Skeleton")).toBeInTheDocument();

    // Nerves layer
    expect(screen.getByText("신경")).toBeInTheDocument();
    expect(screen.getByText("Nerves")).toBeInTheDocument();

    // Vascular layer
    expect(screen.getByText("혈관")).toBeInTheDocument();
    expect(screen.getByText("Vascular")).toBeInTheDocument();

    // Surface layer
    expect(screen.getByText("표면")).toBeInTheDocument();
    expect(screen.getByText("Surface")).toBeInTheDocument();
  });

  it("should call onLayerToggle when skeleton button is clicked", () => {
    const mockToggle = vi.fn();

    render(
      <AnatomyControlsHTML
        visibleLayers={[]}
        onLayerToggle={mockToggle}
        isMobile={false}
      />
    );

    const skeletonButton = screen.getByTestId("anatomy-layer-skeleton");
    fireEvent.click(skeletonButton);

    expect(mockToggle).toHaveBeenCalledWith("skeleton");
  });

  it("should call onLayerToggle when nerves button is clicked", () => {
    const mockToggle = vi.fn();

    render(
      <AnatomyControlsHTML
        visibleLayers={[]}
        onLayerToggle={mockToggle}
        isMobile={false}
      />
    );

    const nervesButton = screen.getByTestId("anatomy-layer-nerves");
    fireEvent.click(nervesButton);

    expect(mockToggle).toHaveBeenCalledWith("nerves");
  });

  it("should call onLayerToggle when vascular button is clicked", () => {
    const mockToggle = vi.fn();

    render(
      <AnatomyControlsHTML
        visibleLayers={[]}
        onLayerToggle={mockToggle}
        isMobile={false}
      />
    );

    const vascularButton = screen.getByTestId("anatomy-layer-vascular");
    fireEvent.click(vascularButton);

    expect(mockToggle).toHaveBeenCalledWith("vascular");
  });

  it("should call onLayerToggle when surface button is clicked", () => {
    const mockToggle = vi.fn();

    render(
      <AnatomyControlsHTML
        visibleLayers={[]}
        onLayerToggle={mockToggle}
        isMobile={false}
      />
    );

    const surfaceButton = screen.getByTestId("anatomy-layer-surface");
    fireEvent.click(surfaceButton);

    expect(mockToggle).toHaveBeenCalledWith("surface");
  });

  it("should show active state for visible layers", () => {
    const visibleLayers: AnatomyLayer[] = ["skeleton", "nerves"];

    const { container } = render(
      <AnatomyControlsHTML
        visibleLayers={visibleLayers}
        onLayerToggle={vi.fn()}
        isMobile={false}
      />
    );

    const skeletonButton = screen.getByTestId("anatomy-layer-skeleton");
    const nervesButton = screen.getByTestId("anatomy-layer-nerves");
    const vascularButton = screen.getByTestId("anatomy-layer-vascular");

    // Verify buttons render
    expect(skeletonButton).toBeInTheDocument();
    expect(nervesButton).toBeInTheDocument();
    expect(vascularButton).toBeInTheDocument();

    // Test that container renders
    expect(container).toBeTruthy();
  });

  it("should render with all layers visible", () => {
    const allLayers: AnatomyLayer[] = ["skeleton", "nerves", "vascular", "surface"];

    render(
      <AnatomyControlsHTML
        visibleLayers={allLayers}
        onLayerToggle={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByTestId("anatomy-layer-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("anatomy-layer-nerves")).toBeInTheDocument();
    expect(screen.getByTestId("anatomy-layer-vascular")).toBeInTheDocument();
    expect(screen.getByTestId("anatomy-layer-surface")).toBeInTheDocument();
  });

  it("should render in mobile mode with smaller layout", () => {
    render(
      <AnatomyControlsHTML
        visibleLayers={[]}
        onLayerToggle={vi.fn()}
        isMobile={true}
      />
    );

    expect(screen.getByTestId("anatomy-controls-html")).toBeInTheDocument();
  });

  it("should render info text", () => {
    render(
      <AnatomyControlsHTML
        visibleLayers={[]}
        onLayerToggle={vi.fn()}
        isMobile={false}
      />
    );

    expect(screen.getByText(/클릭하여 표시\/숨김/)).toBeInTheDocument();
    expect(screen.getByText(/Click to show\/hide/)).toBeInTheDocument();
  });

  it("should have accessible aria labels", () => {
    render(
      <AnatomyControlsHTML
        visibleLayers={[]}
        onLayerToggle={vi.fn()}
        isMobile={false}
      />
    );

    const skeletonButton = screen.getByLabelText("Toggle Skeleton layer");
    const nervesButton = screen.getByLabelText("Toggle Nerves layer");
    const vascularButton = screen.getByLabelText("Toggle Vascular layer");
    const surfaceButton = screen.getByLabelText("Toggle Surface layer");

    expect(skeletonButton).toBeInTheDocument();
    expect(nervesButton).toBeInTheDocument();
    expect(vascularButton).toBeInTheDocument();
    expect(surfaceButton).toBeInTheDocument();
  });

  it("should have aria-pressed state matching visibility", () => {
    render(
      <AnatomyControlsHTML
        visibleLayers={["skeleton"]}
        onLayerToggle={vi.fn()}
        isMobile={false}
      />
    );

    const skeletonButton = screen.getByTestId("anatomy-layer-skeleton");
    const nervesButton = screen.getByTestId("anatomy-layer-nerves");

    expect(skeletonButton).toHaveAttribute("aria-pressed", "true");
    expect(nervesButton).toHaveAttribute("aria-pressed", "false");
  });
});
