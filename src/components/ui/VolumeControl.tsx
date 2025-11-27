import React, { useCallback, useState, useMemo } from "react";
import { useAudio } from "../../audio/AudioProvider";
import { KOREAN_COLORS } from "../../types/constants";
import { toHex, hexToRgbaString } from "../../utils/colorUtils";

export interface VolumeControlProps {
  readonly position?: "top-right" | "bottom-right" | "top-left" | "bottom-left" | "custom";
  readonly style?: React.CSSProperties;
  readonly showLabels?: boolean;
  readonly compact?: boolean;
}

/**
 * Volume Control Component
 * 
 * Provides controls for:
 * - Master volume
 * - Music volume
 * - SFX volume
 * - Mute/unmute toggle
 * 
 * Inspired by template game (https://github.com/Hack23/game)
 */
export const VolumeControl: React.FC<VolumeControlProps> = ({
  position = "top-right",
  style,
  showLabels = true,
  compact = false,
}) => {
  const audio = useAudio();
  
  // Local state to track values for UI (prevents issues if audio not ready)
  const [masterVolume, setMasterVolume] = useState(audio.masterVolume ?? 1.0);
  const [musicVolume, setMusicVolume] = useState(audio.musicVolume ?? 0.7);
  const [sfxVolume, setSfxVolume] = useState(audio.sfxVolume ?? 0.8);
  const [isMuted, setIsMuted] = useState(audio.muted ?? false);

  // Sync local state with audio manager state changes
  React.useEffect(() => {
    setMasterVolume(audio.masterVolume ?? 1.0);
    setMusicVolume(audio.musicVolume ?? 0.7);
    setSfxVolume(audio.sfxVolume ?? 0.8);
    setIsMuted(audio.muted ?? false);
  }, [audio.masterVolume, audio.musicVolume, audio.sfxVolume, audio.muted]);

  // Get position styles (memoized)
  const getPositionStyle = useMemo((): React.CSSProperties => {
    if (position === "custom") return {};
    
    const baseStyle: React.CSSProperties = {
      position: "absolute",
      zIndex: 1000,
      padding: compact ? "8px 12px" : "12px 16px",
    };

    switch (position) {
      case "top-right":
        return { ...baseStyle, top: "20px", right: "20px" };
      case "bottom-right":
        return { ...baseStyle, bottom: "20px", right: "20px" };
      case "top-left":
        return { ...baseStyle, top: "20px", left: "20px" };
      case "bottom-left":
        return { ...baseStyle, bottom: "20px", left: "20px" };
      default:
        return baseStyle;
    }
  }, [position, compact]);

  const containerStyle = useMemo((): React.CSSProperties => ({
    ...getPositionStyle,
    display: "flex",
    flexDirection: compact ? "row" : "column",
    alignItems: "center",
    gap: compact ? "12px" : "8px",
    background: "rgba(33, 38, 45, 0.85)",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
    border: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2)}`,
    ...style,
  }), [getPositionStyle, compact, style]);

  const handleMasterVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      setMasterVolume(value);
      if (audio.isAudioReady) {
        audio.setVolume("master", value);
      }
    },
    [audio]
  );

  const handleMusicVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      setMusicVolume(value);
      if (audio.isAudioReady) {
        audio.setVolume("music", value);
      }
    },
    [audio]
  );

  const handleSfxVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      setSfxVolume(value);
      if (audio.isAudioReady) {
        audio.setVolume("sfx", value);
      }
    },
    [audio]
  );

  const handleMuteToggle = useCallback(() => {
    setIsMuted((prevMuted) => {
      const newMuted = !prevMuted;
      if (audio.isAudioReady) {
        if (newMuted) {
          audio.mute();
        } else {
          audio.unmute();
        }
      }
      return newMuted;
    });
  }, [audio]);

  const sliderStyle = useMemo((): React.CSSProperties => ({
    width: compact ? "60px" : "100px",
    cursor: "pointer",
    accentColor: `#${toHex(KOREAN_COLORS.PRIMARY_CYAN)}`,
  }), [compact]);

  const labelStyle = useMemo((): React.CSSProperties => ({
    color: "#ffffff",
    fontSize: compact ? "11px" : "12px",
    fontWeight: "bold",
    minWidth: compact ? "40px" : "50px",
    textAlign: "left",
  }), [compact]);

  const valueStyle = useMemo((): React.CSSProperties => ({
    color: `#${toHex(KOREAN_COLORS.ACCENT_GOLD)}`,
    fontSize: compact ? "10px" : "11px",
    minWidth: "35px",
    textAlign: "right",
  }), [compact]);

  const controlRowStyle = useMemo((): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
  }), []);

  if (compact) {
    return (
      <div style={containerStyle} data-testid="volume-control">
        <button
          onClick={handleMuteToggle}
          data-testid="mute-toggle-button"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          style={{
            background: isMuted ? "#666666" : `#${toHex(KOREAN_COLORS.PRIMARY_CYAN)}`,
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
          title={isMuted ? "음소거 해제 | Unmute" : "음소거 | Mute"}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={handleMasterVolumeChange}
          data-testid="master-volume-slider"
          aria-label="마스터 볼륨 | Master Volume"
          style={sliderStyle}
          title="마스터 볼륨 | Master Volume"
        />
        <span style={valueStyle}>{Math.round(masterVolume * 100)}%</span>
      </div>
    );
  }

  return (
    <div style={containerStyle} data-testid="volume-control">
      {showLabels && (
        <div
          style={{
            color: `#${toHex(KOREAN_COLORS.PRIMARY_CYAN)}`,
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "4px",
            textAlign: "center",
          }}
        >
          🎵 음량 | Volume
        </div>
      )}

      {/* Master Volume */}
      <div style={controlRowStyle}>
        <label htmlFor="master-volume" style={labelStyle}>
          전체 | Master
        </label>
        <input
          id="master-volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={masterVolume}
          onChange={handleMasterVolumeChange}
          data-testid="master-volume-slider"
          style={sliderStyle}
        />
        <span style={valueStyle}>{Math.round(masterVolume * 100)}%</span>
      </div>

      {/* Music Volume */}
      <div style={controlRowStyle}>
        <label htmlFor="music-volume" style={labelStyle}>
          음악 | Music
        </label>
        <input
          id="music-volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={musicVolume}
          onChange={handleMusicVolumeChange}
          data-testid="music-volume-slider"
          style={sliderStyle}
        />
        <span style={valueStyle}>{Math.round(musicVolume * 100)}%</span>
      </div>

      {/* SFX Volume */}
      <div style={controlRowStyle}>
        <label htmlFor="sfx-volume" style={labelStyle}>
          효과음 | SFX
        </label>
        <input
          id="sfx-volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={sfxVolume}
          onChange={handleSfxVolumeChange}
          data-testid="sfx-volume-slider"
          style={sliderStyle}
        />
        <span style={valueStyle}>{Math.round(sfxVolume * 100)}%</span>
      </div>

      {/* Mute Toggle */}
      <button
        onClick={handleMuteToggle}
        data-testid="mute-toggle-button"
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        style={{
          background: isMuted ? "#666666" : `#${toHex(KOREAN_COLORS.PRIMARY_CYAN)}`,
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          marginTop: "4px",
          width: "100%",
        }}
        title={isMuted ? "음소거 해제 | Unmute" : "음소거 | Mute"}
      >
        {isMuted ? "🔇 음소거 해제 | Unmute" : "🔊 음소거 | Mute"}
      </button>

      {/* Audio Status Indicator */}
      <div
        style={{
          color: audio.isAudioReady ? `#${toHex(KOREAN_COLORS.ACCENT_GOLD)}` : "#999",
          fontSize: "10px",
          marginTop: "4px",
          textAlign: "center",
        }}
      >
        {audio.isAudioReady ? "✓ 오디오 준비됨 | Audio Ready" : "⏳ 초기화 중... | Initializing..."}
      </div>
    </div>
  );
};
