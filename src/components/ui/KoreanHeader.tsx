import React from "react";
import { KOREAN_COLORS, type GamePhase } from "../../types";

export interface KoreanHeaderProps {
  readonly currentPhase: GamePhase;
  readonly onPhaseChange: (phase: GamePhase) => void;
  readonly gameTime?: number;
  readonly playerNames?: readonly [string, string];
  readonly title?: string;
  readonly subtitle?: string;
  readonly showBackButton?: boolean;
  readonly onBack?: () => void;
}

export function KoreanHeader({
  currentPhase,
  onPhaseChange,
  gameTime = 0,
  playerNames = ["플레이어 1", "플레이어 2"],
  title,
  subtitle,
  showBackButton = false,
  onBack,
}: KoreanHeaderProps): React.ReactElement {
  return (
    <header
      className="korean-header"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f172a 100%)",
        borderBottom: "2px solid #ffd700",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
        fontFamily: "Noto Sans KR, Arial, sans-serif",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      }}
    >
      {showBackButton && onBack && (
        <button
          onClick={onBack}
          style={{
            color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "0.5rem",
          }}
        >
          ← 뒤로
        </button>
      )}

      <nav
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => onPhaseChange("intro")}
          style={{
            background:
              currentPhase === "intro"
                ? `#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`
                : "transparent",
            color: `#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`,
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
        >
          {title || "흑괘 무술 (Black Trigram)"}
        </button>
      </nav>

      {subtitle && (
        <div
          style={{
            color: `#${KOREAN_COLORS.CYAN.toString(16).padStart(6, "0")}`,
            fontSize: "0.9rem",
            fontStyle: "italic",
            textAlign: "center",
            flex: 1,
          }}
        >
          {subtitle}
        </div>
      )}

      <div
        style={{
          color: `#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`,
          fontSize: "0.9rem",
          textAlign: "right",
        }}
      >
        <div>
          게임 시간: {Math.floor(gameTime / 60)}:
          {(gameTime % 60).toString().padStart(2, "0")}
        </div>
        <div>
          {playerNames[0]} vs {playerNames[1]}
        </div>
      </div>
    </header>
  );
}

export default KoreanHeader;
