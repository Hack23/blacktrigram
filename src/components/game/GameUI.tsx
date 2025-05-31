import { Application } from "@pixi/react";
import { GameEngine } from "./GameEngine";
import { DojangBackground } from "./DojangBackground";
import { ProgressTracker } from "../ui/ProgressTracker";
import { TrigramWheel } from "../ui/TrigramWheel";
import { KoreanHeader } from "../ui/KoreanHeader";
import { BaseButton } from "../ui/base/BaseButton";
import type { GameUIProps } from "../../types";
import { KOREAN_COLORS, KOREAN_FONT_FAMILY } from "../../types";

export function GameUI({
  players,
  gamePhase,
  onGamePhaseChange,
  gameTime,
  currentRound,
  timeRemaining,
  onStanceChange,
  combatLog,
  onStartMatch,
  onResetMatch,
  onTogglePause,
}: GameUIProps): React.ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: `linear-gradient(135deg, #${KOREAN_COLORS.DARK_BLUE.toString(
          16
        ).padStart(6, "0")}, #${KOREAN_COLORS.BLACK.toString(16).padStart(
          6,
          "0"
        )})`,
        fontFamily: KOREAN_FONT_FAMILY,
        color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with game controls */}
      <div
        style={{
          padding: "1rem 2rem",
          borderBottom: `1px solid #${KOREAN_COLORS.GRAY_DARK.toString(
            16
          ).padStart(6, "0")}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <KoreanHeader
          title="전투 모드"
          subtitle="Combat Mode"
          onBack={() => onGamePhaseChange("intro")}
          currentPhase="combat"
          onPhaseChange={onGamePhaseChange}
        />

        {/* Game Controls */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <BaseButton onClick={onStartMatch} variant="primary" size="small">
            시작 (Start)
          </BaseButton>
          <BaseButton onClick={onTogglePause} variant="secondary" size="small">
            일시정지 (Pause)
          </BaseButton>
          <BaseButton onClick={onResetMatch} variant="secondary" size="small">
            재시작 (Reset)
          </BaseButton>
        </div>

        {/* Timer */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {Math.floor(timeRemaining / 60)}:
            {(timeRemaining % 60).toString().padStart(2, "0")}
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
            라운드 {currentRound} | {gameTime}초
          </div>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        <Application
          width={window.innerWidth}
          height={window.innerHeight - 100}
          backgroundColor={KOREAN_COLORS.BLACK}
        >
          <DojangBackground
            width={window.innerWidth}
            height={window.innerHeight - 100}
          />
          <GameEngine
            players={players}
            gamePhase={gamePhase}
            onGamePhaseChange={onGamePhaseChange}
            onPlayerUpdate={() => {}} // Placeholder
            onStanceChange={onStanceChange}
          />
        </Application>

        {/* UI Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 100,
          }}
        >
          {/* Player 1 Stats */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "rgba(0,0,0,0.8)",
              padding: "1rem",
              borderRadius: "8px",
              border: `2px solid #${KOREAN_COLORS.PLAYER_1_BLUE.toString(
                16
              ).padStart(6, "0")}`,
              pointerEvents: "auto",
            }}
          >
            <h4
              style={{
                margin: "0 0 0.5rem 0",
                color: `#${KOREAN_COLORS.PLAYER_1_BLUE.toString(16).padStart(
                  6,
                  "0"
                )}`,
              }}
            >
              플레이어 1
            </h4>
            <ProgressTracker
              label="체력"
              current={players[0].health}
              maximum={players[0].maxHealth}
            />
            <ProgressTracker
              label="기력"
              current={players[0].ki}
              maximum={players[0].maxKi}
            />
            <ProgressTracker
              label="스태미나"
              current={players[0].stamina}
              maximum={players[0].maxStamina}
            />
          </div>

          {/* Player 2 Stats */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(0,0,0,0.8)",
              padding: "1rem",
              borderRadius: "8px",
              border: `2px solid #${KOREAN_COLORS.PLAYER_2_RED.toString(
                16
              ).padStart(6, "0")}`,
              pointerEvents: "auto",
            }}
          >
            <h4
              style={{
                margin: "0 0 0.5rem 0",
                color: `#${KOREAN_COLORS.PLAYER_2_RED.toString(16).padStart(
                  6,
                  "0"
                )}`,
              }}
            >
              플레이어 2
            </h4>
            <ProgressTracker
              label="체력"
              current={players[1].health}
              maximum={players[1].maxHealth}
            />
            <ProgressTracker
              label="기력"
              current={players[1].ki}
              maximum={players[1].maxKi}
            />
            <ProgressTracker
              label="스태미나"
              current={players[1].stamina}
              maximum={players[1].maxStamina}
            />
          </div>

          {/* Trigram Wheel */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "auto",
            }}
          >
            <TrigramWheel
              selectedStance={players[0].stance}
              onStanceChange={(stance) => onStanceChange(0, stance)}
              playerKi={players[0].ki}
              playerMaxKi={players[0].maxKi}
            />
          </div>

          {/* Combat Log */}
          <div
            style={{
              position: "absolute",
              bottom: "120px",
              left: "20px",
              right: "20px",
              background: "rgba(0,0,0,0.9)",
              padding: "1rem",
              borderRadius: "8px",
              border: `1px solid #${KOREAN_COLORS.CYAN.toString(16).padStart(
                6,
                "0"
              )}`,
              maxHeight: "150px",
              overflow: "auto",
              pointerEvents: "auto",
            }}
          >
            <h4
              style={{
                margin: "0 0 0.5rem 0",
                color: `#${KOREAN_COLORS.CYAN.toString(16).padStart(6, "0")}`,
              }}
            >
              전투 로그
            </h4>
            {combatLog.slice(-5).map((entry, index) => (
              <div
                key={index}
                style={{
                  fontSize: "0.8rem",
                  color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(
                    6,
                    "0"
                  )}`,
                }}
              >
                {entry}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            fontSize: "0.7rem",
            color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Press 1-8 to change stances • ESC to return to menu
        </div>
      </div>
    </div>
  );
}
