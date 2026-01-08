/**
 * QuickSettings Component - In-game settings panel
 * 
 * Features:
 * - Volume controls (SFX, Music)
 * - Audio toggle
 * - Korean/English bilingual labels
 * - Cyberpunk Korean theming
 */

import React from "react";
import { useAudio } from "../../../../../audio/AudioProvider";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../../../types/constants";
import { hexToRgbaString } from "../../../../../utils/colorUtils";

export interface QuickSettingsProps {
  readonly onClose: () => void;
  readonly isMobile: boolean;
}

/**
 * QuickSettings - In-game settings overlay for audio controls
 */
export const QuickSettings: React.FC<QuickSettingsProps> = ({
  onClose,
  isMobile,
}) => {
  const audio = useAudio();

  return (
    <div
      data-testid="quick-settings"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: isMobile ? "24px" : "32px",
        backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
        borderRadius: "12px",
        minWidth: isMobile ? "280px" : "360px",
        boxShadow: `0 0 30px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
        zIndex: 1000,
      }}
    >
      {/* Title */}
      <h2
        data-testid="settings-title"
        style={{
          fontSize: isMobile ? "20px" : "24px",
          color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
          fontFamily: FONT_FAMILY.KOREAN,
          fontWeight: "bold",
          margin: "0 0 24px 0",
          textAlign: "center",
          textShadow: `0 0 10px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.4)}`,
        }}
      >
        설정 | Settings
      </h2>

      {/* Volume Controls */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "16px" : "20px",
        }}
      >
        {/* SFX Volume */}
        <div data-testid="sfx-volume-control">
          <label
            style={{
              display: "block",
              fontSize: isMobile ? "14px" : "16px",
              color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
              fontFamily: FONT_FAMILY.KOREAN,
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            효과음 | SFX Volume
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={audio.sfxVolume * 100}
            onChange={(e) => {
              const value = parseInt(e.target.value) / 100;
              audio.setVolume("sfx", value);
            }}
            data-testid="sfx-volume-slider"
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "3px",
              outline: "none",
              cursor: "pointer",
            }}
          />
          <div
            data-testid="sfx-volume-value"
            style={{
              fontSize: isMobile ? "12px" : "14px",
              color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY, 1),
              fontFamily: FONT_FAMILY.KOREAN,
              marginTop: "4px",
              textAlign: "right",
            }}
          >
            {Math.round(audio.sfxVolume * 100)}%
          </div>
        </div>

        {/* Music Volume */}
        <div data-testid="music-volume-control">
          <label
            style={{
              display: "block",
              fontSize: isMobile ? "14px" : "16px",
              color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
              fontFamily: FONT_FAMILY.KOREAN,
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            음악 | Music Volume
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={audio.musicVolume * 100}
            onChange={(e) => {
              const value = parseInt(e.target.value) / 100;
              audio.setVolume("music", value);
            }}
            data-testid="music-volume-slider"
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "3px",
              outline: "none",
              cursor: "pointer",
            }}
          />
          <div
            data-testid="music-volume-value"
            style={{
              fontSize: isMobile ? "12px" : "14px",
              color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY, 1),
              fontFamily: FONT_FAMILY.KOREAN,
              marginTop: "4px",
              textAlign: "right",
            }}
          >
            {Math.round(audio.musicVolume * 100)}%
          </div>
        </div>

        {/* Mute Toggle */}
        <div
          data-testid="mute-toggle-control"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <label
            style={{
              fontSize: isMobile ? "14px" : "16px",
              color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
              fontFamily: FONT_FAMILY.KOREAN,
              fontWeight: "bold",
            }}
          >
            음소거 | Mute All
          </label>
          <button
            onClick={() => {
              if (audio.muted) {
                audio.unmute();
              } else {
                audio.mute();
              }
              audio.playSFX("menu_click");
            }}
            onMouseEnter={() => audio.playSFX("menu_hover")}
            data-testid="mute-toggle-button"
            style={{
              padding: isMobile ? "8px 16px" : "10px 20px",
              fontSize: isMobile ? "14px" : "16px",
              backgroundColor: audio.muted
                ? hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1)
                : hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 1),
              color: audio.muted
                ? hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1)
                : hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
              border: audio.muted
                ? "none"
                : `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
              borderRadius: "6px",
              fontFamily: FONT_FAMILY.KOREAN,
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {audio.muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => {
          audio.playSFX("menu_back");
          onClose();
        }}
        onMouseEnter={() => audio.playSFX("menu_hover")}
        data-testid="settings-close-button"
        style={{
          marginTop: isMobile ? "24px" : "32px",
          width: "100%",
          padding: isMobile ? "10px" : "12px",
          fontSize: isMobile ? "14px" : "16px",
          backgroundColor: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
          color: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1),
          border: "none",
          borderRadius: "6px",
          fontFamily: FONT_FAMILY.KOREAN,
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = hexToRgbaString(
            KOREAN_COLORS.ACCENT_GOLD,
            1
          );
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = hexToRgbaString(
            KOREAN_COLORS.PRIMARY_CYAN,
            1
          );
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        닫기 | Close
      </button>
    </div>
  );
};

export default QuickSettings;
