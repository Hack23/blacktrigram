import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AudioManager } from "../../audio/AudioManager";
import { AudioContext } from "../../audio/AudioProvider";
import { VolumeControl } from "./VolumeControl";

// Mock audio manager
class MockAudioManager {
  public isInitialized = true;
  public masterVolume = 1.0;
  public sfxVolume = 0.8;
  public musicVolume = 0.7;
  public muted = false;

  public setVolume = vi.fn();
  public mute = vi.fn();
  public unmute = vi.fn();
  public initialize = vi.fn();
  public loadAsset = vi.fn();
  public playSoundEffect = vi.fn();
  public playSFX = vi.fn();
  public playMusic = vi.fn();
  public stopMusic = vi.fn();
  public fadeIn = vi.fn();
  public fadeOut = vi.fn();
  public playKoreanTechniqueSound = vi.fn();
  public playTrigramStanceSound = vi.fn();
  public playVitalPointHitSound = vi.fn();
  public playDojiangAmbience = vi.fn();

  get currentMusicTrack() {
    return null;
  }

  get fallbackMode() {
    return false;
  }
}

describe("VolumeControl", () => {
  const mockManager = new MockAudioManager() as unknown as AudioManager;

  const renderWithAudio = (component: React.ReactElement) => {
    // Create a mock context value that includes isAudioReady
    const mockContextValue = {
      ...mockManager,
      isAudioReady: true,
      initializeAudio: vi.fn(),
    };

    return render(
      <AudioContext.Provider value={mockContextValue as any}>
        {component}
      </AudioContext.Provider>
    );
  };

  it("should render volume control with all sliders", () => {
    renderWithAudio(<VolumeControl />);

    expect(screen.getByTestId("volume-control")).toBeInTheDocument();
    expect(screen.getByTestId("master-volume-slider")).toBeInTheDocument();
    expect(screen.getByTestId("music-volume-slider")).toBeInTheDocument();
    expect(screen.getByTestId("sfx-volume-slider")).toBeInTheDocument();
    expect(screen.getByTestId("mute-toggle-button")).toBeInTheDocument();
  });

  it("should display Korean and English labels", () => {
    renderWithAudio(<VolumeControl />);

    // Check for Korean text
    expect(screen.getByText(/음량/)).toBeInTheDocument();
    expect(screen.getByText(/Volume/)).toBeInTheDocument();
    expect(screen.getByText(/전체/)).toBeInTheDocument();
    expect(screen.getByText(/Master/)).toBeInTheDocument();
  });

  it("should call setVolume when master volume changes", () => {
    renderWithAudio(<VolumeControl />);

    const masterSlider = screen.getByTestId("master-volume-slider");
    fireEvent.change(masterSlider, { target: { value: "0.5" } });

    expect(mockManager.setVolume).toHaveBeenCalledWith("master", 0.5);
  });

  it("should call setVolume when music volume changes", () => {
    renderWithAudio(<VolumeControl />);

    const musicSlider = screen.getByTestId("music-volume-slider");
    fireEvent.change(musicSlider, { target: { value: "0.3" } });

    expect(mockManager.setVolume).toHaveBeenCalledWith("music", 0.3);
  });

  it("should call setVolume when SFX volume changes", () => {
    renderWithAudio(<VolumeControl />);

    const sfxSlider = screen.getByTestId("sfx-volume-slider");
    fireEvent.change(sfxSlider, { target: { value: "0.9" } });

    expect(mockManager.setVolume).toHaveBeenCalledWith("sfx", 0.9);
  });

  it("should toggle mute when button is clicked", () => {
    renderWithAudio(<VolumeControl />);

    const muteButton = screen.getByTestId("mute-toggle-button");

    // First click should mute
    fireEvent.click(muteButton);
    expect(mockManager.mute).toHaveBeenCalled();

    // Second click should unmute
    fireEvent.click(muteButton);
    expect(mockManager.unmute).toHaveBeenCalled();
  });

  it("should render in compact mode", () => {
    renderWithAudio(<VolumeControl compact={true} />);

    // In compact mode, only master volume slider is shown
    expect(screen.getByTestId("master-volume-slider")).toBeInTheDocument();
    expect(screen.queryByTestId("music-volume-slider")).not.toBeInTheDocument();
    expect(screen.queryByTestId("sfx-volume-slider")).not.toBeInTheDocument();
  });

  it("should display audio ready status", () => {
    renderWithAudio(<VolumeControl />);

    // In test, isAudioReady is true, so should show ready status
    expect(screen.getByText(/Audio Ready/)).toBeInTheDocument();
  });

  it("should support custom positioning", () => {
    const { container } = renderWithAudio(
      <VolumeControl position="bottom-right" />
    );

    const volumeControl = container.querySelector(
      '[data-testid="volume-control"]'
    );
    expect(volumeControl).toHaveStyle({ position: "absolute" });
  });

  it("should display volume percentage", () => {
    renderWithAudio(<VolumeControl />);

    // Master volume at 100%
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
