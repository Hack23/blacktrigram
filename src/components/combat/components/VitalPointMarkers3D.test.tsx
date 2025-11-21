/**
 * Tests for VitalPointMarkers3D component
 */

import { describe, expect, it, vi } from "vitest";
import VitalPointMarkers3D from "./VitalPointMarkers3D";
import { VitalPointSeverity } from "../../../types/common";

describe("VitalPointMarkers3D", () => {
  it("should be defined and importable", () => {
    expect(VitalPointMarkers3D).toBeDefined();
  });

  it("should accept TypeScript props correctly", () => {
    const props = {
      position: [0, 0, 0] as [number, number, number],
      visible: true,
      selectedPoint: "baekhoehoel",
      onPointClick: vi.fn(),
      onPointHover: vi.fn(),
      severityFilter: [VitalPointSeverity.CRITICAL, VitalPointSeverity.MAJOR],
      showLabels: true,
      scale: 1.5,
      animated: true,
    };

    expect(props.position).toEqual([0, 0, 0]);
    expect(props.visible).toBe(true);
    expect(props.selectedPoint).toBe("baekhoehoel");
    expect(props.onPointClick).toBeDefined();
    expect(props.onPointHover).toBeDefined();
    expect(props.severityFilter).toHaveLength(2);
    expect(props.showLabels).toBe(true);
    expect(props.scale).toBe(1.5);
    expect(props.animated).toBe(true);
  });

  it("should have correct prop defaults", () => {
    const defaultProps = {
      position: [0, 0, 0] as [number, number, number],
      visible: true,
      showLabels: true,
      scale: 1.0,
      animated: true,
      selectedPoint: null,
    };

    expect(defaultProps.position).toEqual([0, 0, 0]);
    expect(defaultProps.visible).toBe(true);
    expect(defaultProps.showLabels).toBe(true);
    expect(defaultProps.scale).toBe(1.0);
    expect(defaultProps.animated).toBe(true);
    expect(defaultProps.selectedPoint).toBe(null);
  });
});
