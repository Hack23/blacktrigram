/**
 * ControlsGuide Component - In-game controls reference
 * 
 * Features:
 * - Complete combat controls listing
 * - Korean/English bilingual labels
 * - Cyberpunk Korean theming
 * - Organized by action type
 */

import React from "react";
import { useAudio } from "../../../audio/AudioProvider";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";

export interface ControlsGuideProps {
  readonly onClose: () => void;
  readonly isMobile: boolean;
}

interface ControlMapping {
  readonly key: string;
  readonly actionKorean: string;
  readonly actionEnglish: string;
}

const CONTROL_MAPPINGS: ControlMapping[] = [
  { key: "WASD / ←↑↓→", actionKorean: "이동", actionEnglish: "Movement" },
  { key: "1-8", actionKorean: "팔괘 자세", actionEnglish: "Trigram Stances" },
  { key: "Space", actionKorean: "공격", actionEnglish: "Attack" },
  { key: "Shift", actionKorean: "방어", actionEnglish: "Defend" },
  { key: "Tab", actionKorean: "원형 전환", actionEnglish: "Switch Archetype" },
  { key: "ESC", actionKorean: "일시정지", actionEnglish: "Pause" },
  { key: "M", actionKorean: "음소거", actionEnglish: "Mute" },
];

/**
 * ControlsGuide - In-game controls reference overlay
 */
export const ControlsGuide: React.FC<ControlsGuideProps> = ({
  onClose,
  isMobile,
}) => {
  const audio = useAudio();

  return (
    <div
      data-testid="controls-guide"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: isMobile ? "24px" : "32px",
        backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
        borderRadius: "12px",
        minWidth: isMobile ? "280px" : "400px",
        maxHeight: isMobile ? "70vh" : "80vh",
        overflow: "auto",
        boxShadow: `0 0 30px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
        zIndex: 1000,
      }}
    >
      {/* Title */}
      <h2
        data-testid="controls-title"
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
        조작법 | Controls
      </h2>

      {/* Controls List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "12px" : "16px",
        }}
      >
        {CONTROL_MAPPINGS.map((control, index) => (
          <div
            key={index}
            data-testid={`control-item-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: isMobile ? "10px" : "12px",
              backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.5),
              border: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                flex: 1,
                fontSize: isMobile ? "12px" : "14px",
                color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
                fontFamily: FONT_FAMILY.KOREAN,
                fontWeight: "bold",
              }}
            >
              {control.actionKorean}
              <br />
              <span
                style={{
                  fontSize: isMobile ? "11px" : "13px",
                  color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY, 1),
                  fontWeight: "normal",
                }}
              >
                {control.actionEnglish}
              </span>
            </div>
            <div
              style={{
                padding: isMobile ? "6px 12px" : "8px 16px",
                fontSize: isMobile ? "12px" : "14px",
                color: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1),
                backgroundColor: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
                fontFamily: FONT_FAMILY.MONO,
                fontWeight: "bold",
                borderRadius: "4px",
                textAlign: "center",
                minWidth: isMobile ? "80px" : "100px",
              }}
            >
              {control.key}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Tips */}
      <div
        data-testid="controls-tips"
        style={{
          marginTop: isMobile ? "20px" : "24px",
          padding: isMobile ? "12px" : "16px",
          backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.3),
          border: `1px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.3)}`,
          borderRadius: "6px",
        }}
      >
        <h3
          style={{
            fontSize: isMobile ? "14px" : "16px",
            color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "bold",
            margin: "0 0 8px 0",
          }}
        >
          💡 팁 | Tips
        </h3>
        <p
          style={{
            fontSize: isMobile ? "12px" : "14px",
            color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY, 1),
            fontFamily: FONT_FAMILY.KOREAN,
            margin: 0,
            lineHeight: "1.6",
          }}
        >
          • 각 팔괘 자세는 고유한 기술과 장점이 있습니다
          <br />
          • Each trigram stance has unique techniques and advantages
          <br />
          <br />
          • 적절한 타이밍에 방어하면 반격 기회를 얻습니다
          <br />
          • Perfect timing on defense creates counter opportunities
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => {
          audio.playSFX("menu_back");
          onClose();
        }}
        onMouseEnter={() => audio.playSFX("menu_hover")}
        data-testid="controls-close-button"
        style={{
          marginTop: isMobile ? "20px" : "24px",
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

export default ControlsGuide;
