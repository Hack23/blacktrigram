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
      await audioManager.initialize(); // no args
      
      // Preload all placeholder assets
      const list = Object.values(placeholderAssets).flat() as AudioAsset[];
      await Promise.all(list.map((a) => audioManager.loadAsset(a)));

      // Preload menu UI sounds from registry (critical for intro screen)
      const menuSounds = [
        audioAssetRegistry.getSFX("menu_hover"),
        audioAssetRegistry.getSFX("menu_select"),
        audioAssetRegistry.getSFX("menu_click"),
        audioAssetRegistry.getSFX("menu_navigate"),
        audioAssetRegistry.getSFX("menu_back"),
      ];

      const menuAssets = menuSounds.filter((asset) => asset !== undefined) as AudioAsset[];
      await Promise.all(menuAssets.map((a) => audioManager.loadAsset(a)));

      // Preload intro music
      const introMusic = audioAssetRegistry.getMusic("intro_theme");
      if (introMusic) {
        await audioManager.loadAsset(introMusic as AudioAsset);
      }
    })();
  }, [audioManager]);

  return (
    <AudioContext.Provider value={audioManager}>
      {children}
    </AudioContext.Provider>
  );
};
