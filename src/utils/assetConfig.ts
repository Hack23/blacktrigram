/**
 * Asset path configuration for Black Trigram library consumers.
 *
 * By default, all asset URLs are root-relative (e.g. /assets/audio/*).
 * Library consumers who host assets at a different path can call
 * {@link setAssetBasePath} to prefix all asset URLs.
 *
 * @example
 * ```ts
 * import { setAssetBasePath } from 'blacktrigram';
 * // Serve assets from a CDN
 * setAssetBasePath('https://cdn.example.com');
 * ```
 *
 * @module utils
 * @category Utilities
 */

let assetBasePath = "";

/**
 * Set the base path for all game assets.
 * Call this before initializing any game components.
 *
 * @param basePath - The base URL/path prefix (e.g. `"https://cdn.example.com"` or `"/my-app"`)
 */
export function setAssetBasePath(basePath: string): void {
  // Remove trailing slash for consistency
  assetBasePath = basePath.replace(/\/+$/, "");
}

/**
 * Get the current asset base path.
 */
export function getAssetBasePath(): string {
  return assetBasePath;
}

/**
 * Resolve an asset path by prepending the configured base path.
 *
 * @param path - Root-relative asset path starting with a forward slash
 * @returns The resolved URL with the configured base path prepended
 */
export function resolveAssetPath(path: string): string {
  if (!assetBasePath) {
    return path;
  }
  // Ensure path starts with / for correct concatenation
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${assetBasePath}${normalizedPath}`;
}
