/**
 * Tests for TechniqueNameDisplay component
 * 
 * @module components/combat/components/TechniqueNameDisplay.test
 * @category Combat UI Tests
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { TechniqueNameDisplay } from "./TechniqueNameDisplay";

/**
 * Helper to render Three.js component in test environment
 */
function render3DComponent(component: React.ReactElement) {
  return render(<Canvas>{component}</Canvas>);
}

describe("TechniqueNameDisplay", () => {
  it("should render component without crashing", () => {
    const { container } = render3DComponent(
      <TechniqueNameDisplay
        koreanName="경동맥격"
        visible={true}
      />
    );

    // Verify Canvas renders
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it("should accept Korean technique name prop", () => {
    const { container } = render3DComponent(
      <TechniqueNameDisplay
        koreanName="경동맥격"
        visible={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should accept English technique name prop", () => {
    const { container } = render3DComponent(
      <TechniqueNameDisplay
        englishName="Carotid Strike"
        visible={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should accept both Korean and English names", () => {
    const { container } = render3DComponent(
      <TechniqueNameDisplay
        koreanName="경동맥격"
        englishName="Carotid Strike"
        visible={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should accept isCritical prop", () => {
    const { container } = render3DComponent(
      <TechniqueNameDisplay
        koreanName="치명정밀"
        isCritical={true}
        visible={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should not error when isCritical is false", () => {
    const { container } = render3DComponent(
      <TechniqueNameDisplay
        koreanName="일반타격"
        isCritical={false}
        visible={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should handle visible prop being false", () => {
    const { container } = render3DComponent(
      <TechniqueNameDisplay
        koreanName="숨겨진기술"
        visible={false}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should handle missing names gracefully", () => {
    const { container } = render3DComponent(
      <TechniqueNameDisplay visible={true} />
    );

    expect(container).toBeTruthy();
  });

  it("should accept duration prop", () => {
    const { container } = render3DComponent(
      <TechniqueNameDisplay
        koreanName="페이드아웃"
        duration={1000}
        visible={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should accept position prop as 3D coordinates", () => {
    const position: [number, number, number] = [5, 10, 2];
    
    const { container } = render3DComponent(
      <TechniqueNameDisplay
        koreanName="위치테스트"
        position={position}
        visible={true}
      />
    );

    expect(container).toBeTruthy();
  });

  it("should render in Three.js Canvas context", () => {
    const { container } = render3DComponent(
      <TechniqueNameDisplay
        koreanName="테스트"
        englishName="Test"
        visible={true}
      />
    );

    // Verify Canvas is present (Three.js rendering context)
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it("should accept all props simultaneously", () => {
    const { container } = render3DComponent(
      <TechniqueNameDisplay
        koreanName="완전한테스트"
        englishName="Complete Test"
        duration={2000}
        position={[1, 2, 3]}
        isCritical={true}
        visible={true}
      />
    );

    expect(container).toBeTruthy();
  });
});
