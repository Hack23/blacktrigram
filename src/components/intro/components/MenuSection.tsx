import React from "react";
import { KOREAN_COLORS, type GamePhase } from "../../../types";

export interface MenuSectionProps {
  readonly onGamePhaseChange: (phase: GamePhase) => void;
}

export function MenuSection({
  onGamePhaseChange,
}: MenuSectionProps): React.ReactElement {
  return (
    <div className="menu-section">
      <h2
        className="korean-title"
        style={{
          color: `#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`,
        }}
      >
        흑괘 무술 도장
      </h2>

      <div className="menu-buttons">
        <button
          className="menu-button primary"
          onClick={() => onGamePhaseChange("combat")}
          style={{
            backgroundColor: `#${KOREAN_COLORS.TRADITIONAL_RED.toString(
              16
            ).padStart(6, "0")}`,
            color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
          }}
        >
          <span className="korean-text">대전 모드</span>
          <span className="english-text">Combat Mode</span>
        </button>

        <button
          className="menu-button secondary"
          onClick={() => onGamePhaseChange("training")}
          style={{
            backgroundColor: `#${KOREAN_COLORS.DOJANG_BLUE.toString(
              16
            ).padStart(6, "0")}`,
            color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
          }}
        >
          <span className="korean-text">수련 모드</span>
          <span className="english-text">Training Mode</span>
        </button>

        <button
          className="menu-button tertiary"
          onClick={() => onGamePhaseChange("philosophy")}
          style={{
            backgroundColor: `#${KOREAN_COLORS.GOLD.toString(16).padStart(
              6,
              "0"
            )}`,
            color: `#${KOREAN_COLORS.BLACK.toString(16).padStart(6, "0")}`,
          }}
        >
          <span className="korean-text">철학 연구</span>
          <span className="english-text">Philosophy Study</span>
        </button>
      </div>
    </div>
  );
}
