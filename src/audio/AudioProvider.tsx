import React, { createContext, useContext, useEffect, useState } from "react";
import AudioManager from "./AudioManager";
import { audioAssetRegistry } from "./AudioAssetRegistry";
import placeholderAssets from "./placeholder-sounds";
import { AudioAsset, AudioConfig, IAudioManager } from "./types";

export interface AudioProviderProps {
  children: React.ReactNode;
  config?: Partial<AudioConfig>;
  manager?: IAudioManager;
}

export const AudioContext = createContext<IAudioManager | null>(null);

export const useAudio = (): IAudioManager => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error("useAudio must be inside AudioProvider");
  return ctx;
};

export const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  config,
  manager,
}) => {
  const [audioManager] = useState<IAudioManager>(
    () => manager || new AudioManager(config)
  );

  useEffect(() => {
    (async () => {
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
        const archetypeThemes = [
          audioAssetRegistry.getMusic("musa_warrior_theme"),
          audioAssetRegistry.getMusic("amsalja_shadow_theme"),
          audioAssetRegistry.getMusic("hacker_cyber_theme"),
          audioAssetRegistry.getMusic("jeongbo_intel_theme"),
          audioAssetRegistry.getMusic("jojik_street_theme"),
        ];

        const archetypeAssets = archetypeThemes.filter((asset) => asset !== undefined) as AudioAsset[];
        await Promise.all(archetypeAssets.map((a) => audioManager.loadAsset(a).catch(err => {
          console.warn(`Failed to load archetype theme: ${a.id}`, err);
        })));
      } catch (error) {
        console.error("Failed to initialize audio manager:", error);
        // Continue without audio - silent mode fallback
      }
    })();
  }, [audioManager]);

  return (
    <AudioContext.Provider value={audioManager}>
      {children}
    </AudioContext.Provider>
  );
};
