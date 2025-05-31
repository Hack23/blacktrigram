import React from "react";

// AudioManager class implementation
export class AudioManager {
  private isInitialized = false;
  private masterVolume = 0.7;
  private muted = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      this.isInitialized = true;
    } catch (error) {
      console.warn("Audio initialization failed:", error);
    }
  }

  async playMusic(trackName: string): Promise<void> {
    console.log(`Playing music: ${trackName}`);
  }

  playAttackSound(damage: number): void {
    console.log(`Playing attack sound with damage: ${damage}`);
  }

  playHitSound(damage: number, isVitalPoint?: boolean): void {
    console.log(`Playing hit sound: damage=${damage}, vital=${isVitalPoint}`);
  }

  playComboSound(comboCount: number): void {
    console.log(`Playing combo sound: ${comboCount}`);
  }

  playStanceChangeSound(): void {
    console.log("Playing stance change sound");
  }

  playSFX(soundId: string): void {
    console.log(`Playing SFX: ${soundId}`);
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  isEnabled(): boolean {
    return this.isInitialized;
  }

  getState(): {
    volume: number;
    enabled: boolean;
    masterVolume: number;
    isMuted: boolean;
    isEnabled: boolean;
  } {
    return {
      volume: this.masterVolume,
      enabled: this.isInitialized,
      masterVolume: this.masterVolume,
      isMuted: this.muted,
      isEnabled: this.isInitialized,
    };
  }

  toggleMute(): void {
    this.muted = !this.muted;
    if (this.muted) {
      // Store current volume and set to 0
      this.masterVolume = 0;
    } else {
      // Restore volume
      this.masterVolume = 0.7;
    }
  }
}

// Create the audio manager instance
const audioManager = new AudioManager();

// Create context for the audio manager
const AudioContext = React.createContext<AudioManager>(audioManager);

// Hook to use audio manager
export function useAudio(): AudioManager {
  return React.useContext(AudioContext);
}

// Provider component props
export interface AudioManagerProviderProps {
  readonly children: React.ReactNode;
}

// Provider component - THIS IS THE MISSING EXPORT
export function AudioManagerProvider({
  children,
}: AudioManagerProviderProps): React.ReactElement {
  return (
    <AudioContext.Provider value={audioManager}>
      {children}
    </AudioContext.Provider>
  );
}

// Add alias for tests
export const AudioProvider = AudioManagerProvider;
