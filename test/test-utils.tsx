import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Application } from "@pixi/react";
import { AudioProvider } from "../src/audio/AudioProvider";
import type { IAudioManager } from "../src/types/audio";

// Mock audio manager for testing
class MockAudioManager implements IAudioManager {
  isInitialized = true;

  async init() {}
  playSFX() {
    return null;
  }
  playMusic() {
    return null;
  }
  stopMusic() {}
  setMasterVolume() {}
  setSFXVolume() {}
  setMusicVolume() {}
  setMuted() {}
  getState() {
    return {
      masterVolume: 0.7,
      sfxVolume: 0.8,
      musicVolume: 0.5,
      muted: false,
      currentMusicTrack: null,
      isInitialized: true,
      fallbackMode: false,
    };
  }
  playAttackSound() {}
  playHitSound() {}
  playTechniqueSound() {}
  playStanceChangeSound() {}
  playBlockSound() {}
  stopAllSounds() {}
  async loadAudioAsset() {}
  isMusicPlaying() {
    return false;
  }
}

// Test wrapper with providers
interface TestWrapperProps {
  children: React.ReactNode;
}

function TestWrapper({ children }: TestWrapperProps) {
  const mockAudioManager = new MockAudioManager();

  return (
    <AudioProvider manager={mockAudioManager}>
      <Application width={800} height={600}>
        {children}
      </Application>
    </AudioProvider>
  );
}

// Custom render function
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: TestWrapper, ...options });
}

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
