import * as PIXI from "pixi.js";

// Test metadata structure for PixiJS nodes
export interface PixiTestData {
  readonly type: string;
  readonly [key: string]: any;
}

// Extend PIXI objects to include test data
declare module "pixi.js" {
  interface Container {
    pixiData?: PixiTestData;
  }
  interface DisplayObject {
    pixiData?: PixiTestData;
  }
}

// Global window extension for PixiJS app access
declare global {
  interface Window {
    blackTrigramApp?: PIXI.Application;
    pixiApp?: PIXI.Application; // Keep compatibility with article naming
  }
}

/**
 * Attach PixiJS Application to window for Cypress access
 */
export function exposePixiAppForTesting(app: PIXI.Application): void {
  if (typeof window !== "undefined") {
    window.blackTrigramApp = app;
    window.pixiApp = app; // Compatibility with article approach
    (window as any).__PIXI_APP__ = app;

    // Also expose for Korean martial arts specific testing
    (window as any).blackTrigramApp = {
      pixiApp: app,
      version: "1.0.0",
      gameState: "intro",
    };

    console.log("🎯 PixiJS app exposed for testing");
  }
}

/**
 * Check if PixiJS object matches required test data
 */
export function pixiObjectMatches(
  pixiObject: PIXI.Container | PIXI.DisplayObject,
  requiredData: Partial<PixiTestData>
): boolean {
  const pixiData = pixiObject.pixiData;

  for (const [key, value] of Object.entries(requiredData)) {
    // Check in pixi-data first
    if (pixiData && pixiData[key] !== undefined) {
      if (pixiData[key] !== value) return false;
    }
    // Fall back to PixiJS object properties
    else if ((pixiObject as any)[key] !== value) {
      return false;
    }
  }

  return true;
}

/**
 * Find PixiJS object in tree that matches criteria
 */
export function findPixiObject(
  container: PIXI.Container,
  requiredData: Partial<PixiTestData>
): PIXI.Container | PIXI.DisplayObject | null {
  // Check current container
  if (pixiObjectMatches(container, requiredData)) {
    return container;
  }

  // Search children
  for (const child of container.children) {
    if (child instanceof PIXI.Container) {
      const found = findPixiObject(child, requiredData);
      if (found) return found;
    } else if (pixiObjectMatches(child, requiredData)) {
      return child;
    }
  }

  return null;
}

/**
 * Get all PixiJS objects that match criteria
 */
export function findAllPixiObjects(
  container: PIXI.Container,
  requiredData: Partial<PixiTestData>
): (PIXI.Container | PIXI.DisplayObject)[] {
  const results: (PIXI.Container | PIXI.DisplayObject)[] = [];

  if (pixiObjectMatches(container, requiredData)) {
    results.push(container);
  }

  for (const child of container.children) {
    if (child instanceof PIXI.Container) {
      results.push(...findAllPixiObjects(child, requiredData));
    } else if (pixiObjectMatches(child, requiredData)) {
      results.push(child);
    }
  }

  return results;
}

/**
 * Mock WebGL context for testing
 */
export function mockWebGLContext(): Partial<WebGLRenderingContext> {
  const canvas = document.createElement("canvas");
  const context: Partial<WebGLRenderingContext> = {
    getExtension: () => null,
    getParameter: () => 4096,
    createProgram: () => ({} as WebGLProgram),
    createShader: () => ({} as WebGLShader),
    attachShader: () => {},
    linkProgram: () => {},
    useProgram: () => {},
    getUniformLocation: () => ({} as WebGLUniformLocation),
    uniform1f: () => {},
    uniform2f: () => {},
    uniform3f: () => {},
    uniform4f: () => {},
    uniformMatrix4fv: () => {},
    createBuffer: () => ({} as WebGLBuffer),
    bindBuffer: () => {},
    bufferData: () => {},
    enableVertexAttribArray: () => {},
    vertexAttribPointer: () => {},
    drawArrays: () => {},
    clear: () => {},
    clearColor: () => {},
    enable: () => {},
    disable: () => {},
    blendFunc: () => {},
    viewport: () => {},
  };

  // Fix: Use proper type assertion for canvas getContext
  (canvas as any).getContext = () => context;
  return context;
}
