import * as PIXI from "pixi.js";

// Enhanced test metadata for better component identification
export interface EnhancedPixiTestData {
  readonly type: string;
  readonly component: string;
  readonly testId: string;
  readonly responsive: boolean;
  readonly screenSize: "mobile" | "tablet" | "desktop";
  readonly position: { x: number; y: number };
  readonly size: { width: number; height: number };
  readonly [key: string]: any;
}

// Responsive breakpoints for testing
export const RESPONSIVE_BREAKPOINTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 },
} as const;

// Enhanced component finder with responsive support
export function findPixiComponentByTestId(
  container: PIXI.Container,
  testId: string,
  screenSize?: keyof typeof RESPONSIVE_BREAKPOINTS
): PIXI.Container | null {
  function search(obj: PIXI.Container): PIXI.Container | null {
    // Check pixi-data for test information
    const pixiData = (obj as any).pixiData as EnhancedPixiTestData | undefined;

    if (pixiData?.testId === testId) {
      // If screenSize specified, check if component supports it
      if (screenSize && pixiData.responsive) {
        return pixiData.screenSize === screenSize ? obj : null;
      }
      return obj;
    }

    // Search children recursively
    for (let i = 0; i < obj.children.length; i++) {
      const child = obj.children[i];
      if (child instanceof PIXI.Container) {
        const result = search(child);
        if (result) return result;
      }
    }
    return null;
  }

  return search(container);
}

// Test responsive component positioning
export function validateResponsivePosition(
  component: PIXI.Container,
  expectedPositions: Record<string, { x: number; y: number }>
): boolean {
  const pixiData = (component as any).pixiData as
    | EnhancedPixiTestData
    | undefined;
  if (!pixiData?.responsive) return true;

  const screenSize = pixiData.screenSize;
  const expected = expectedPositions[screenSize];
  if (!expected) return true;

  const tolerance = 5; // 5px tolerance
  return (
    Math.abs(component.x - expected.x) <= tolerance &&
    Math.abs(component.y - expected.y) <= tolerance
  );
}

// Enhanced test component creator
export function createTestablePixiComponent(
  type: string,
  testId: string,
  options: {
    responsive?: boolean;
    screenSize?: keyof typeof RESPONSIVE_BREAKPOINTS;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
    component?: string;
  } = {}
): PIXI.Container {
  const container = new PIXI.Container();

  // Add enhanced test metadata
  (container as any).pixiData = {
    type,
    component: options.component || type,
    testId,
    responsive: options.responsive || false,
    screenSize: options.screenSize || "desktop",
    position: options.position || { x: 0, y: 0 },
    size: options.size || { width: 100, height: 100 },
  } as EnhancedPixiTestData;

  // Set position
  if (options.position) {
    container.x = options.position.x;
    container.y = options.position.y;
  }

  return container;
}
