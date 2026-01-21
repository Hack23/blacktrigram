/**
 * Vite plugin to load GLSL shader files as strings
 * 
 * Supports .glsl, .vert, and .frag extensions
 * Used by both vite.config.ts and vitest.config.ts
 */

import type { Plugin } from "vite";

export function glslPlugin(): Plugin {
  return {
    name: "vite-plugin-glsl",
    transform(code, id) {
      if (id.endsWith(".glsl") || id.endsWith(".vert") || id.endsWith(".frag")) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: null,
        };
      }
    },
  };
}
