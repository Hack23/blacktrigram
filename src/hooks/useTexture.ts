import { useState, useEffect } from "react";
import { Texture, Assets } from "pixi.js"; // Import Texture and Assets

interface UseTextureState {
  texture: Texture | null;
  loading: boolean;
  error: Error | null;
}

export function useTexture(url: string | undefined): UseTextureState {
  const [state, setState] = useState<UseTextureState>({
    texture: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!url) {
      setState({ texture: Texture.EMPTY, loading: false, error: null });
      return;
    }

    let isMounted = true;
    setState({ texture: null, loading: true, error: null });

    Assets.load(url)
      .then((loadedTexture: Texture) => {
        if (isMounted) {
          setState({ texture: loadedTexture, loading: false, error: null });
        }
      })
      .catch((e: Error) => {
        if (isMounted) {
          console.error(`Failed to load texture: ${url}`, e);
          setState({ texture: Texture.EMPTY, loading: false, error: e });
        }
      });

    return () => {
      isMounted = false;
      // Optional: Assets.unload(url) if PixiJS supports it and it's needed
    };
  }, [url]);

  return state;
}

// Texture cache to prevent reloading
const textureCache = new Map<string, Texture>();

// Preload commonly used textures
export async function preloadGameTextures(): Promise<void> {
  const commonTextures = [
    "assets/visual/logo/black-trigram-256.png",
    // "/trigram-effects.png", // Removed: Not found in provided asset list
    // "/vital-points.png", // Removed: Not found in provided asset list
  ];

  try {
    await Promise.all(
      commonTextures.map(async (url) => {
        if (!textureCache.has(url)) {
          const texture = await Assets.load(url);
          textureCache.set(url, texture);
        }
      })
    );
  } catch (error) {
    console.warn(
      "[preloadGameTextures] Some textures failed to preload:",
      error
    );
  }
}
