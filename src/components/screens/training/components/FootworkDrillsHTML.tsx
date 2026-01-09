/**
 * FootworkDrillsHTML - Training component for footwork drills
 * 
 * Provides specialized footwork training exercises for Korean martial arts
 * footwork patterns (보법, Bobeop).
 * 
 * @module components/screens/training/components/FootworkDrillsHTML
 * @category Training Components
 * @korean 보법훈련컴포넌트
 */

import React, { useCallback, useEffect, useState } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";

/**
 * Footwork drill types for training
 * 
 * @korean 보법훈련타입
 */
export type FootworkDrill = 
  | "circular_left"      // 원형보 좌 - Circle left around target
  | "circular_right"     // 원형보 우 - Circle right around target
  | "pivot_combo"        // 축족회전 - Pivot left-right combo
  | "triangle_step"      // 삼각보법 - Triangle stepping pattern
  | "slide_drill"        // 미끄럼보 - Four-direction slide drill
  | "shuffle_practice"   // 섞음보 - Quick shuffle adjustments
  | "free_practice";     // 자유 연습 - Free practice mode

/**
 * Drill information with Korean terminology
 * 
 * @korean 훈련정보
 */
const DRILL_INFO: Record<FootworkDrill, { 
  korean: string; 
  english: string; 
  description: string;
  pattern: string[];
  keyHints: string;
}> = {
  circular_left: {
    korean: "원형보 좌회전",
    english: "Circular Left",
    description: "원형보 좌측 | Circle stepping left",
    pattern: ["Ctrl+A", "Ctrl+A", "Ctrl+A", "Ctrl+A"],
    keyHints: "Hold Ctrl+A to circle left",
  },
  circular_right: {
    korean: "원형보 우회전",
    english: "Circular Right",
    description: "원형보 우측 | Circle stepping right",
    pattern: ["Ctrl+D", "Ctrl+D", "Ctrl+D", "Ctrl+D"],
    keyHints: "Hold Ctrl+D to circle right",
  },
  pivot_combo: {
    korean: "축족회전 연속",
    english: "Pivot Combo",
    description: "좌우 연속 회전 | Continuous pivot rotations",
    pattern: ["Shift+Ctrl+A", "Shift+Ctrl+D", "Shift+Ctrl+A", "Shift+Ctrl+D"],
    keyHints: "Alternate Shift+Ctrl+A/D",
  },
  triangle_step: {
    korean: "삼각보법",
    english: "Triangle Step",
    description: "삼각형 발놀림 | Triangle footwork pattern",
    pattern: ["Ctrl+W", "Shift+Ctrl+D", "Ctrl+S", "Shift+Ctrl+A"],
    keyHints: "Forward → Pivot → Back → Pivot",
  },
  slide_drill: {
    korean: "미끄럼보 사방",
    english: "Slide Drill",
    description: "사방 미끄럼 | Four-direction slides",
    pattern: ["Ctrl+W", "Alt+D", "Ctrl+S", "Alt+A"],
    keyHints: "Slide in all four directions",
  },
  shuffle_practice: {
    korean: "섞음보 연습",
    english: "Shuffle Practice",
    description: "빠른 조정 | Quick micro-adjustments",
    pattern: ["Shift+Ctrl+W", "Shift+Ctrl+W", "Shift+Ctrl+W"],
    keyHints: "Rapid Shift+Ctrl+W/S",
  },
  free_practice: {
    korean: "자유 연습",
    english: "Free Practice",
    description: "자유 보법 | Free footwork exploration",
    pattern: [],
    keyHints: "Use any footwork combination",
  },
};

/**
 * Props for FootworkDrillsHTML component
 */
export interface FootworkDrillsHTMLProps {
  /** Currently selected drill */
  readonly currentDrill: FootworkDrill;
  /** Callback when drill changes */
  readonly onDrillChange: (drill: FootworkDrill) => void;
  /** Current step in drill pattern (0-based) */
  readonly currentStep: number;
  /** Callback when drill step completes (optional, not yet implemented) */
  readonly onStepComplete?: () => void;
  /** Whether drill is currently active */
  readonly isActive: boolean;
  /** Callback to start/stop drill */
  readonly onToggleActive: () => void;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * FootworkDrillsHTML Component
 * 
 * Provides UI for footwork training drills with step-by-step guidance
 * and Korean martial arts terminology.
 * 
 * @korean 보법훈련UI컴포넌트
 */
export const FootworkDrillsHTML: React.FC<FootworkDrillsHTMLProps> = ({
  currentDrill,
  onDrillChange,
  currentStep,
  // onStepComplete, // TODO: Use this for drill pattern validation
  isActive,
  onToggleActive,
  isMobile,
}) => {
  const drillInfo = DRILL_INFO[currentDrill];
  const [showInstructions, setShowInstructions] = useState(true);

  // Auto-hide instructions after 5 seconds when drill is active
  useEffect(() => {
    if (isActive && showInstructions) {
      const timer = setTimeout(() => setShowInstructions(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isActive, showInstructions]);

  const handleDrillSelect = useCallback((drill: FootworkDrill) => {
    onDrillChange(drill);
    setShowInstructions(true);
  }, [onDrillChange]);

  const panelWidth = isMobile ? 280 : 340;
  const buttonFontSize = isMobile ? "10px" : "11px";
  const titleFontSize = isMobile ? "13px" : "15px";

  return (
    <div
      style={{
        width: `${panelWidth}px`,
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.9)}`,
        borderRadius: "12px",
        padding: isMobile ? "10px" : "12px",
        fontFamily: FONT_FAMILY.KOREAN,
        color: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
      }}
      data-testid="footwork-drills-html"
    >
      {/* Header */}
      <div style={{ marginBottom: "12px", textAlign: "center" }}>
        <div
          style={{
            fontSize: titleFontSize,
            fontWeight: "bold",
            color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
            marginBottom: "4px",
          }}
        >
          보법 훈련 | Footwork Drills
        </div>
        <div
          style={{
            fontSize: isMobile ? "10px" : "11px",
            color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY, 1),
          }}
        >
          {drillInfo.korean} | {drillInfo.english}
        </div>
      </div>

      {/* Drill Selection Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
          gap: "6px",
          marginBottom: "12px",
        }}
      >
        {(Object.keys(DRILL_INFO) as FootworkDrill[]).map((drill) => (
          <button
            key={drill}
            onClick={() => handleDrillSelect(drill)}
            style={{
              padding: isMobile ? "6px 4px" : "8px 6px",
              fontSize: buttonFontSize,
              fontFamily: FONT_FAMILY.KOREAN,
              fontWeight: currentDrill === drill ? "bold" : "normal",
              background: 
                currentDrill === drill
                  ? hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.9)
                  : hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8),
              color: 
                currentDrill === drill
                  ? hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1)
                  : hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 1),
              border: `1px solid ${hexToRgbaString(
                currentDrill === drill
                  ? KOREAN_COLORS.ACCENT_GOLD
                  : KOREAN_COLORS.UI_BORDER,
                0.6
              )}`,
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "center",
              lineHeight: 1.2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {DRILL_INFO[drill].korean.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Drill Description */}
      <div
        style={{
          padding: "8px",
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.6),
          borderRadius: "6px",
          marginBottom: "10px",
          fontSize: isMobile ? "10px" : "11px",
          textAlign: "center",
        }}
      >
        {drillInfo.description}
      </div>

      {/* Pattern Steps (if drill has pattern) */}
      {drillInfo.pattern.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div
            style={{
              fontSize: isMobile ? "10px" : "11px",
              fontWeight: "bold",
              color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
              marginBottom: "6px",
              textAlign: "center",
            }}
          >
            Pattern Steps:
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "4px",
              flexWrap: "wrap",
            }}
          >
            {drillInfo.pattern.map((step, index) => (
              <div
                key={index}
                style={{
                  padding: "4px 8px",
                  fontSize: isMobile ? "9px" : "10px",
                  fontFamily: FONT_FAMILY.KOREAN,
                  background: 
                    isActive && index === currentStep
                      ? hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.9)
                      : index < currentStep
                      ? hexToRgbaString(KOREAN_COLORS.ACCENT_GREEN, 0.6)
                      : hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.7),
                  color: 
                    isActive && index === currentStep
                      ? hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1)
                      : "#ffffff",
                  border: `1px solid ${hexToRgbaString(
                    isActive && index === currentStep
                      ? KOREAN_COLORS.PRIMARY_CYAN
                      : KOREAN_COLORS.UI_BORDER,
                    0.8
                  )}`,
                  borderRadius: "4px",
                  fontWeight: isActive && index === currentStep ? "bold" : "normal",
                }}
              >
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Hints */}
      {showInstructions && (
        <div
          style={{
            padding: "8px",
            background: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2),
            border: `1px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
            borderRadius: "6px",
            marginBottom: "10px",
            fontSize: isMobile ? "9px" : "10px",
            textAlign: "center",
            color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
          }}
        >
          💡 {drillInfo.keyHints}
        </div>
      )}

      {/* Start/Stop Button */}
      <button
        onClick={onToggleActive}
        style={{
          width: "100%",
          padding: isMobile ? "10px" : "12px",
          fontSize: isMobile ? "12px" : "14px",
          fontFamily: FONT_FAMILY.KOREAN,
          fontWeight: "bold",
          background: isActive
            ? hexToRgbaString(KOREAN_COLORS.ACCENT_RED, 0.9)
            : hexToRgbaString(KOREAN_COLORS.ACCENT_GREEN, 0.9),
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = `0 0 20px ${hexToRgbaString(
            isActive ? KOREAN_COLORS.ACCENT_RED : KOREAN_COLORS.ACCENT_GREEN,
            0.8
          )}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {isActive ? "훈련 중지 | Stop Drill" : "훈련 시작 | Start Drill"}
      </button>
    </div>
  );
};

export default FootworkDrillsHTML;
