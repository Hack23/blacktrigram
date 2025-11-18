/**
 * AudioAssetLoader - Handles audio asset loading with retry logic and format fallback
 * Implements production-ready asset loading strategies for Black Trigram
 */

import type { AudioAsset } from "./types";

export type LoadPriority = "critical" | "high" | "normal" | "low";

export interface LoadOptions {
  readonly priority?: LoadPriority;
  readonly maxRetries?: number;
  readonly retryDelay?: number;
  readonly timeout?: number;
}

export interface LoadResult {
  readonly success: boolean;
  readonly audio?: HTMLAudioElement;
  readonly error?: Error;
  readonly attemptCount: number;
  readonly loadTime: number;
  readonly formatUsed?: string;
}

export interface BatchLoadProgress {
  readonly total: number;
  readonly loaded: number;
  readonly failed: number;
  readonly currentAsset?: string;
  readonly progress: number;
}

export class AudioAssetLoader {
  private loadAttempts: Map<string, number> = new Map();
  private loadCache: Map<string, HTMLAudioElement> = new Map();
  private loadingPromises: Map<string, Promise<LoadResult>> = new Map();

  /**
   * Load a single audio asset with retry logic and format fallback
   */
  async loadAsset(
    asset: AudioAsset,
    options: LoadOptions = {}
  ): Promise<LoadResult> {
    const {
      priority = "normal",
      maxRetries = 3,
      retryDelay = 1000,
      timeout = 10000,
    } = options;

    // Check cache first
    const cached = this.loadCache.get(asset.id);
    if (cached) {
      return {
        success: true,
        audio: cached,
        attemptCount: 0,
        loadTime: 0,
        formatUsed: cached.src,
      };
    }

    // Check if already loading
    const existingPromise = this.loadingPromises.get(asset.id);
    if (existingPromise) {
      return existingPromise;
    }

    const startTime = performance.now();
    const loadPromise = this.loadWithRetry(
      asset,
      maxRetries,
      retryDelay,
      timeout,
      priority
    );

    this.loadingPromises.set(asset.id, loadPromise);

    try {
      const result = await loadPromise;
      this.loadingPromises.delete(asset.id);

      if (result.success && result.audio) {
        this.loadCache.set(asset.id, result.audio);
      }

      return {
        ...result,
        loadTime: performance.now() - startTime,
      };
    } catch (error) {
      this.loadingPromises.delete(asset.id);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        attemptCount: this.loadAttempts.get(asset.id) ?? 0,
        loadTime: performance.now() - startTime,
      };
    }
  }

  /**
   * Load asset with exponential backoff retry
   */
  private async loadWithRetry(
    asset: AudioAsset,
    maxRetries: number,
    baseRetryDelay: number,
    timeout: number,
    priority: LoadPriority
  ): Promise<LoadResult> {
    let lastError: Error | null = null;
    const attemptCount = this.loadAttempts.get(asset.id) ?? 0;
    this.loadAttempts.set(asset.id, attemptCount + 1);

    // Try all available formats with fallback
    const formats = this.getFormatsToTry(asset);

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      for (const format of formats) {
        try {
          const audio = await this.tryLoadFormat(format, timeout, priority);
          this.loadAttempts.delete(asset.id);
          return {
            success: true,
            audio,
            attemptCount: attempt + 1,
            loadTime: 0, // Will be set by caller
            formatUsed: format,
          };
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          console.warn(
            `Failed to load ${asset.id} format ${format} on attempt ${attempt + 1}:`,
            error
          );
        }
      }

      // Exponential backoff before retry
      if (attempt < maxRetries - 1) {
        const delay = baseRetryDelay * Math.pow(2, attempt);
        await this.sleep(delay);
      }
    }

    // All retries failed, return silent placeholder
    console.error(
      `All attempts failed for ${asset.id}, using silent placeholder`
    );
    return {
      success: false,
      audio: this.createSilentPlaceholder(),
      error: lastError ?? new Error("All load attempts failed"),
      attemptCount: maxRetries,
      loadTime: 0,
      formatUsed: "placeholder",
    };
  }

  /**
   * Get formats to try in order of preference
   */
  private getFormatsToTry(asset: AudioAsset): string[] {
    const formats: string[] = [];

    // Try asset URL first
    if (asset.url) {
      formats.push(asset.url);
    }

    // Try variations if available
    if ("variations" in asset && Array.isArray(asset.variations)) {
      formats.push(...asset.variations);
    }

    // Format fallback: webm → mp3 → wav
    if (asset.url.endsWith(".webm")) {
      const mp3Url = asset.url.replace(".webm", ".mp3");
      if (!formats.includes(mp3Url)) {
        formats.push(mp3Url);
      }
    }

    return formats;
  }

  /**
   * Try loading a specific format with timeout
   */
  private tryLoadFormat(
    url: string,
    timeout: number,
    _priority: LoadPriority
  ): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.preload = "auto";

      const timeoutId = setTimeout(() => {
        audio.src = "";
        reject(new Error(`Load timeout after ${timeout}ms`));
      }, timeout);

      audio.addEventListener("canplaythrough", () => {
        clearTimeout(timeoutId);
        resolve(audio);
      });

      audio.addEventListener("error", () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load: ${url}`));
      });

      audio.src = url;
      audio.load();
    });
  }

  /**
   * Batch load multiple assets
   */
  async batchLoad(
    assets: readonly AudioAsset[],
    options: LoadOptions = {},
    onProgress?: (progress: BatchLoadProgress) => void
  ): Promise<LoadResult[]> {
    const results: LoadResult[] = [];
    let loaded = 0;
    let failed = 0;

    for (const asset of assets) {
      onProgress?.({
        total: assets.length,
        loaded,
        failed,
        currentAsset: asset.id,
        progress: (loaded + 1) / assets.length, // +1 to reflect current asset being loaded
      });

      const result = await this.loadAsset(asset, options);
      results.push(result);

      if (result.success) {
        loaded++;
      } else {
        failed++;
      }
    }

    onProgress?.({
      total: assets.length,
      loaded,
      failed,
      progress: 1.0,
    });

    return results;
  }

  /**
   * Preload assets by priority level
   */
  async preloadByPriority(
    assets: readonly AudioAsset[],
    priority: LoadPriority
  ): Promise<LoadResult[]> {
    // Filter assets by priority if they have metadata
    const priorityAssets = assets.filter(
      (asset) =>
        "preloadPriority" in asset && asset.preloadPriority === priority
    );

    if (priorityAssets.length === 0) {
      return [];
    }

    return this.batchLoad(priorityAssets, { priority });
  }

  /**
   * Unload an asset and free memory
   */
  unloadAsset(assetId: string): boolean {
    const audio = this.loadCache.get(assetId);
    if (audio) {
      audio.pause();
      audio.src = "";
      audio.load(); // Reset to release memory
      this.loadCache.delete(assetId);
      this.loadAttempts.delete(assetId);
      return true;
    }
    return false;
  }

  /**
   * Get cached audio element
   */
  getCached(assetId: string): HTMLAudioElement | undefined {
    return this.loadCache.get(assetId);
  }

  /**
   * Check if asset is cached
   */
  isCached(assetId: string): boolean {
    return this.loadCache.has(assetId);
  }

  /**
   * Get total number of cached assets
   */
  getCacheSize(): number {
    return this.loadCache.size;
  }

  /**
   * Clear all cached assets
   */
  clearCache(): void {
    this.loadCache.forEach((audio) => {
      audio.pause();
      audio.src = "";
      audio.load();
    });
    this.loadCache.clear();
    this.loadAttempts.clear();
    this.loadingPromises.clear();
  }

  /**
   * Create a silent audio placeholder for failed loads
   */
  private createSilentPlaceholder(): HTMLAudioElement {
    const audio = new Audio();
    // 8-bit 8kHz silent WAV file (0.01s duration), used as a silent placeholder for failed audio loads
    // Base64-encoded minimal silent audio data URI to ensure audio element is valid
    audio.src =
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
    return audio;
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get loading statistics
   */
  getStatistics(): {
    readonly cached: number;
    readonly loading: number;
    readonly totalAttempts: number;
  } {
    return {
      cached: this.loadCache.size,
      loading: this.loadingPromises.size,
      totalAttempts: Array.from(this.loadAttempts.values()).reduce(
        (sum, val) => sum + val,
        0
      ),
    };
  }
}
