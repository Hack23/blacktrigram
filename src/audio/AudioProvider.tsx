import React, { createContext, useContext, useEffect, useState } from "react";
import { ARCHETYPE_ASSETS } from "../types/constants";
import AudioManager from "./AudioManager";
import { audioAssetRegistry } from "./AudioAssetRegistry";
import placeholderAssets from "./placeholder-sounds";
import { AudioAsset, AudioConfig, IAudioManager } from "./types";

export interface AudioProviderProps {
  children: React.ReactNode;
  config?: Partial<AudioConfig>;
  manager?: IAudioManager;
  /**
   * If true, defers audio initialization until initializeAudio() is called.
   * This is useful for requiring user gesture before creating AudioContext.
   */
  deferInitialization?: boolean;
}

export interface AudioContextValue extends IAudioManager {
  /**
   * Initialize audio manager. Must be called after user gesture if deferInitialization is true.
   */
  initializeAudio: () => Promise<void>;
  /**
   * Whether audio system has been fully initialized and is ready for use.
   * This includes both AudioContext creation (isInitialized) and asset preloading.
   * Use this property to determine if audio methods can be safely called.
   */
  isAudioReady: boolean;
}

export const AudioContext = createContext<AudioContextValue | null>(null);

export const useAudio = (): AudioContextValue => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be inside AudioProvider");
  return ctx;
};

export const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  config,
  manager,
  deferInitialization = false,
}) => {
  const [audioManager] = useState<IAudioManager>(
    () => manager || new AudioManager(config)
  );
  const [isAudioReady, setIsAudioReady] = useState(false);

  const initializeAudio = React.useCallback(async () => {
    if (isAudioReady) {
      return; // Already initialized
    }

    try {
      await audioManager.initialize(); // no args
        
        // Preload all placeholder assets
        const list = Object.values(placeholderAssets).flat() as AudioAsset[];
        await Promise.all(list.map((a) => audioManager.loadAsset(a).catch(err => {
          console.warn(`Failed to load placeholder asset: ${a.id}`, err);
        })));

        // Preload menu UI sounds from registry (critical for intro screen)
        const menuSounds = [
          audioAssetRegistry.getSFX("menu_hover"),
          audioAssetRegistry.getSFX("menu_select"),
          audioAssetRegistry.getSFX("menu_click"),
          audioAssetRegistry.getSFX("menu_navigate"),
          audioAssetRegistry.getSFX("menu_back"),
        ];

        const menuAssets = menuSounds.filter((asset) => asset !== undefined) as AudioAsset[];
        await Promise.all(menuAssets.map((a) => audioManager.loadAsset(a).catch(err => {
          console.warn(`Failed to load menu asset: ${a.id}`, err);
        })));

        // Preload intro music
        const introMusic = audioAssetRegistry.getMusic("intro_theme");
        if (introMusic) {
          await audioManager.loadAsset(introMusic as AudioAsset).catch(err => {
            console.warn("Failed to load intro theme music", err);
          });
        }

        // Preload archetype theme music for character selection
        const archetypeThemeIds = Object.values(ARCHETYPE_ASSETS).map(a => a.themeId);
        const archetypeThemes = archetypeThemeIds.map(id => {
          const track = audioAssetRegistry.getMusic(id);
          if (!track) {
            console.warn(`Archetype theme not registered: ${id}`);
          }
          return track;
        });

      const archetypeAssets = archetypeThemes.filter((asset) => asset !== undefined) as AudioAsset[];
      await Promise.all(archetypeAssets.map((a) => audioManager.loadAsset(a).catch(err => {
        console.warn(`Failed to load archetype theme: ${a.id}`, err);
      })));

      setIsAudioReady(true);
    } catch (error) {
      console.error("Failed to initialize audio manager:", error);
      // Continue without audio - silent mode fallback
      setIsAudioReady(true); // Mark as ready even in fallback mode
    }
  }, [audioManager]); // Removed isAudioReady to prevent unnecessary callback recreation

  // Auto-initialize if not deferred
  useEffect(() => {
    if (!deferInitialization) {
      initializeAudio();
    }
  }, [deferInitialization, initializeAudio]);

  const contextValue = React.useMemo<AudioContextValue>(
    () => ({
      ...audioManager,
      initializeAudio,
      isAudioReady,
    }),
    [audioManager, initializeAudio, isAudioReady]
  );

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};
