/**
 * Procedural fabric texture generation for realistic clothing
 *
 * **Korean**: 절차적 직물 텍스처 (Procedural Fabric Textures)
 *
 * Generates canvas-based textures for realistic dobok (도복) martial arts
 * uniform rendering without external image assets. Uses Three.js CanvasTexture
 * for efficient GPU-based texture mapping.
 *
 * **Features**:
 * - Procedural weave patterns for fabric realism
 * - Normal maps for surface detail and depth
 * - Roughness maps for material variation
 * - Memory-safe with proper cleanup
 *
 * @module utils/fabricTextures
 * @category Visual Effects
 * @korean 직물텍스처유틸
 */

import * as THREE from "three";

/**
 * Fabric texture configuration
 */
export interface FabricTextureConfig {
  /** Base color for the fabric */
  readonly baseColor: string;
  /** Weave pattern density (higher = finer weave) */
  readonly weaveDensity: number;
  /** Texture resolution (power of 2 recommended) */
  readonly resolution: number;
  /** Thread variation intensity (0-1) */
  readonly threadVariation: number;
  /** Whether to generate normal map */
  readonly generateNormalMap: boolean;
  /** Whether to generate roughness map */
  readonly generateRoughnessMap: boolean;
}

/**
 * Generated fabric texture set
 */
export interface FabricTextureSet {
  /** Color/diffuse map */
  readonly colorMap: THREE.CanvasTexture;
  /** Normal map for surface detail (optional) */
  readonly normalMap?: THREE.CanvasTexture;
  /** Roughness map for material variation (optional) */
  readonly roughnessMap?: THREE.CanvasTexture;
  /** Cleanup function to dispose all textures */
  readonly dispose: () => void;
}

/**
 * Default fabric texture configurations for different materials
 */
export const FABRIC_PRESETS: Record<string, Partial<FabricTextureConfig>> = {
  /** Traditional cotton dobok (도복) */
  dobok: {
    weaveDensity: 32,
    threadVariation: 0.15,
    resolution: 256,
    generateNormalMap: true,
    generateRoughnessMap: true,
  },
  /** Tactical synthetic fabric */
  tactical: {
    weaveDensity: 48,
    threadVariation: 0.08,
    resolution: 256,
    generateNormalMap: true,
    generateRoughnessMap: true,
  },
  /** Leather material */
  leather: {
    weaveDensity: 16,
    threadVariation: 0.25,
    resolution: 256,
    generateNormalMap: true,
    generateRoughnessMap: false,
  },
  /** Silk/satin material */
  silk: {
    weaveDensity: 64,
    threadVariation: 0.05,
    resolution: 256,
    generateNormalMap: true,
    generateRoughnessMap: true,
  },
};

/**
 * Convert hex color to RGB components
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 128, g: 128, b: 128 };
};

/**
 * Simple seeded random for reproducible textures
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/**
 * Check if we're in a browser environment with canvas support
 */
const canCreateCanvas = (): boolean => {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return canvas.getContext("2d") !== null;
  } catch {
    return false;
  }
};

/**
 * Create a fallback texture for test environments
 * Uses a minimal texture that works in all environments
 */
const createFallbackTexture = (): THREE.CanvasTexture => {
  // In test environments, THREE mocks may not have all features
  // Create a minimal mock that satisfies the interface
  try {
    const data = new Uint8Array([128, 128, 128, 255]);
    const dataTexture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    dataTexture.needsUpdate = true;
    return dataTexture as unknown as THREE.CanvasTexture;
  } catch {
    // Ultimate fallback - create a minimal mock texture object
    // Use numeric constants instead of THREE constants for test compatibility
    const mockTexture = {
      dispose: () => {},
      needsUpdate: true,
      wrapS: 1000, // THREE.RepeatWrapping value
      wrapT: 1000,
      repeat: { set: () => {} },
      uuid: "mock-fabric-texture",
      isTexture: true,
    };
    return mockTexture as unknown as THREE.CanvasTexture;
  }
};

/**
 * Generate a procedural fabric weave color map
 *
 * Creates a canvas-based texture with realistic thread patterns
 * simulating woven fabric like cotton dobok material.
 *
 * @param config - Fabric texture configuration
 * @returns CanvasTexture with weave pattern
 *
 * @korean 직물색상맵생성
 */
export const generateFabricColorMap = (
  config: FabricTextureConfig,
): THREE.CanvasTexture => {
  // Return fallback for test environments without canvas support
  if (!canCreateCanvas()) {
    return createFallbackTexture();
  }

  const { baseColor, weaveDensity, resolution, threadVariation } = config;

  const canvas = document.createElement("canvas");
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return createFallbackTexture();
  }

  const rgb = hexToRgb(baseColor);

  // Fill base color
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, resolution, resolution);

  // Create weave pattern
  const threadWidth = resolution / weaveDensity;

  // Horizontal threads (weft)
  for (let y = 0; y < weaveDensity; y++) {
    const yPos = y * threadWidth;
    const variation = (seededRandom(y * 17) - 0.5) * threadVariation * 255;

    const r = Math.max(0, Math.min(255, rgb.r + variation));
    const g = Math.max(0, Math.min(255, rgb.g + variation));
    const b = Math.max(0, Math.min(255, rgb.b + variation));

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

    // Draw thread with slight offset pattern
    for (let x = 0; x < weaveDensity; x++) {
      const xPos = x * threadWidth;
      // Alternating over/under pattern
      if ((x + y) % 2 === 0) {
        ctx.fillRect(xPos, yPos, threadWidth * 0.95, threadWidth * 0.45);
      }
    }
  }

  // Vertical threads (warp)
  for (let x = 0; x < weaveDensity; x++) {
    const xPos = x * threadWidth;
    const variation = (seededRandom(x * 31) - 0.5) * threadVariation * 255;

    const r = Math.max(0, Math.min(255, rgb.r + variation * 0.8));
    const g = Math.max(0, Math.min(255, rgb.g + variation * 0.8));
    const b = Math.max(0, Math.min(255, rgb.b + variation * 0.8));

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;

    for (let y = 0; y < weaveDensity; y++) {
      const yPos = y * threadWidth;
      // Opposite pattern for weave effect
      if ((x + y) % 2 === 1) {
        ctx.fillRect(xPos, yPos, threadWidth * 0.45, threadWidth * 0.95);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4); // Tile the texture
  texture.needsUpdate = true;

  return texture;
};

/**
 * Generate a normal map for fabric surface detail
 *
 * Creates subtle bumps and ridges that simulate thread
 * texture on the fabric surface for enhanced realism.
 *
 * @param config - Fabric texture configuration
 * @returns CanvasTexture normal map
 *
 * @korean 법선맵생성
 */
export const generateFabricNormalMap = (
  config: FabricTextureConfig,
): THREE.CanvasTexture => {
  // Return fallback for test environments without canvas support
  if (!canCreateCanvas()) {
    return createFallbackTexture();
  }

  const { weaveDensity, resolution } = config;

  const canvas = document.createElement("canvas");
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return createFallbackTexture();
  }

  // Neutral normal (pointing straight out)
  ctx.fillStyle = "rgb(128, 128, 255)";
  ctx.fillRect(0, 0, resolution, resolution);

  const threadWidth = resolution / weaveDensity;

  // Create normal variations for weave pattern
  for (let y = 0; y < weaveDensity; y++) {
    for (let x = 0; x < weaveDensity; x++) {
      const xPos = x * threadWidth;
      const yPos = y * threadWidth;

      // Create subtle normal variation based on weave position
      if ((x + y) % 2 === 0) {
        // Horizontal thread - slight upward normal
        ctx.fillStyle = "rgb(128, 140, 255)";
        ctx.fillRect(xPos, yPos, threadWidth * 0.9, threadWidth * 0.4);
      } else {
        // Vertical thread - slight rightward normal
        ctx.fillStyle = "rgb(140, 128, 255)";
        ctx.fillRect(xPos, yPos, threadWidth * 0.4, threadWidth * 0.9);
      }

      // Thread edge highlights
      const edgeIntensity = 20;
      ctx.fillStyle = `rgb(${128 + edgeIntensity}, ${128 + edgeIntensity}, 255)`;
      ctx.fillRect(xPos, yPos, threadWidth * 0.1, threadWidth);
      ctx.fillRect(xPos, yPos, threadWidth, threadWidth * 0.1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;

  return texture;
};

/**
 * Generate a roughness map for fabric material variation
 *
 * Creates subtle roughness variations that simulate the
 * different reflective properties of woven threads.
 *
 * @param config - Fabric texture configuration
 * @returns CanvasTexture roughness map
 *
 * @korean 거칠기맵생성
 */
export const generateFabricRoughnessMap = (
  config: FabricTextureConfig,
): THREE.CanvasTexture => {
  // Return fallback for test environments without canvas support
  if (!canCreateCanvas()) {
    return createFallbackTexture();
  }

  const { weaveDensity, resolution, threadVariation } = config;

  const canvas = document.createElement("canvas");
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return createFallbackTexture();
  }

  // Base roughness (white = rough, black = smooth)
  ctx.fillStyle = "rgb(180, 180, 180)";
  ctx.fillRect(0, 0, resolution, resolution);

  const threadWidth = resolution / weaveDensity;

  // Create roughness variation for weave pattern
  for (let y = 0; y < weaveDensity; y++) {
    for (let x = 0; x < weaveDensity; x++) {
      const xPos = x * threadWidth;
      const yPos = y * threadWidth;

      // Random roughness variation per thread
      const variation = seededRandom(x * 13 + y * 29) * threadVariation * 50;
      const roughness = Math.max(128, Math.min(230, 180 + variation));

      ctx.fillStyle = `rgb(${roughness}, ${roughness}, ${roughness})`;
      ctx.fillRect(xPos, yPos, threadWidth * 0.9, threadWidth * 0.9);

      // Thread gaps are slightly smoother
      ctx.fillStyle = "rgb(160, 160, 160)";
      ctx.fillRect(
        xPos + threadWidth * 0.9,
        yPos,
        threadWidth * 0.1,
        threadWidth,
      );
      ctx.fillRect(
        xPos,
        yPos + threadWidth * 0.9,
        threadWidth,
        threadWidth * 0.1,
      );
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.needsUpdate = true;

  return texture;
};

/**
 * Generate complete fabric texture set with all maps
 *
 * Creates a set of textures (color, normal, roughness) for
 * realistic fabric rendering with proper memory management.
 *
 * @param baseColor - Base color for the fabric (hex string)
 * @param preset - Preset name or custom config
 * @returns FabricTextureSet with all generated textures
 *
 * @example
 * ```typescript
 * const textures = generateFabricTextureSet("#2d2d2d", "dobok");
 *
 * const material = new THREE.MeshPhysicalMaterial({
 *   map: textures.colorMap,
 *   normalMap: textures.normalMap,
 *   roughnessMap: textures.roughnessMap,
 * });
 *
 * // Cleanup when done
 * textures.dispose();
 * ```
 *
 * @korean 완전직물텍스처세트생성
 */
export const generateFabricTextureSet = (
  baseColor: string,
  preset: keyof typeof FABRIC_PRESETS | Partial<FabricTextureConfig> = "dobok",
): FabricTextureSet => {
  // Merge preset with defaults
  const presetConfig =
    typeof preset === "string" ? FABRIC_PRESETS[preset] : preset;

  const config: FabricTextureConfig = {
    baseColor,
    weaveDensity: presetConfig?.weaveDensity ?? 32,
    resolution: presetConfig?.resolution ?? 256,
    threadVariation: presetConfig?.threadVariation ?? 0.15,
    generateNormalMap: presetConfig?.generateNormalMap ?? true,
    generateRoughnessMap: presetConfig?.generateRoughnessMap ?? true,
  };

  // Generate textures
  const colorMap = generateFabricColorMap(config);
  const normalMap = config.generateNormalMap
    ? generateFabricNormalMap(config)
    : undefined;
  const roughnessMap = config.generateRoughnessMap
    ? generateFabricRoughnessMap(config)
    : undefined;

  // Cleanup function
  const dispose = () => {
    colorMap.dispose();
    normalMap?.dispose();
    roughnessMap?.dispose();
  };

  return {
    colorMap,
    normalMap,
    roughnessMap,
    dispose,
  };
};

/**
 * Pre-defined dobok colors for Korean martial arts uniforms
 */
export const DOBOK_COLORS = {
  /** Traditional white dobok (흰 도복) */
  WHITE: "#f5f5f5",
  /** Black dobok for masters (검정 도복) */
  BLACK: "#1a1a1a",
  /** Navy blue tactical (남색) */
  NAVY: "#1a2744",
  /** Traditional Korean gray (회색) */
  GRAY: "#2d2d2d",
  /** Dark red for elite (암적색) */
  DARK_RED: "#4a1a1a",
  /** Cyber cyan accent */
  CYBER_CYAN: "#003333",
} as const;

export default generateFabricTextureSet;
