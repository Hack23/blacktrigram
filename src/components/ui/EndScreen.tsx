import React, { useMemo } from "react";
import { FillGradient } from "pixi.js";
import { PlayerState } from "../../types/player";
import { MatchStatistics } from "../../types/game";
import { KOREAN_COLORS } from "../../types/constants";
import {
  ResponsivePixiContainer,
  ResponsivePixiButton,
  ResponsivePixiPanel,
} from "./base/ResponsivePixiComponents";

export interface EndScreenProps {
  readonly winner: PlayerState;
  readonly matchStatistics: MatchStatistics;
  readonly onReturnToMenu: () => void;
  readonly onRestart: () => void;
  readonly width: number;
  readonly height: number;
}

export const EndScreen: React.FC<EndScreenProps> = ({
  winner,
  matchStatistics,
  onReturnToMenu,
  onRestart,
  width,
  height,
}) => {
  const { isMobile } = useMemo(() => {
    const isMobile = width < 768;
    return { isMobile };
  }, [width]);

  return (
    <ResponsivePixiContainer
      screenWidth={width}
      screenHeight={height}
      data-testid="end-screen"
    >
      {/* Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          const gradient = new FillGradient(0, 0, width, height);
          gradient.addColorStop(0, 0x0a0a0f);
          gradient.addColorStop(0.5, 0x1a1a2e);
          gradient.addColorStop(1, 0x0f0f23);
          g.fill(gradient);
          g.rect(0, 0, width, height);
          g.fill();
        }}
      />

      {/* Victory Title */}
      <pixiContainer
        x={width / 2}
        y={isMobile ? 60 : 100}
        data-testid="victory-title"
      >
        <pixiText
          text="승리! - Victory!"
          style={{
            fontSize: isMobile ? 32 : 48,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            align: "center",
          }}
          anchor={0.5}
        />

        <pixiText
          text={`${winner.name.korean} (${winner.name.english})`}
          style={{
            fontSize: isMobile ? 20 : 28,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
            align: "center",
          }}
          x={0}
          y={isMobile ? 40 : 60}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Match Statistics */}
      <ResponsivePixiPanel
        title="전투 통계 - Match Statistics"
        x={width / 2 - (isMobile ? width * 0.45 : 200)}
        y={isMobile ? 150 : 200}
        width={isMobile ? width * 0.9 : 400}
        height={isMobile ? 250 : 300}
        screenWidth={width}
        screenHeight={height}
        data-testid="match-statistics"
      >
        <pixiText
          text={`경기 시간: ${Math.floor(
            matchStatistics.matchDuration / 60
          )}:${(matchStatistics.matchDuration % 60)
            .toString()
            .padStart(2, "0")}`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
          }}
          x={20}
          y={40}
        />

        <pixiText
          text={`총 라운드: ${matchStatistics.totalRounds}`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
          }}
          x={20}
          y={60}
        />

        <pixiText
          text={`치명타: ${matchStatistics.criticalHits}`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.SECONDARY_MAGENTA,
          }}
          x={20}
          y={80}
        />

        <pixiText
          text={`급소 공격: ${matchStatistics.vitalPointHits}`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.ACCENT_CYAN,
          }}
          x={20}
          y={100}
        />

        <pixiText
          text={`완벽한 일격: ${matchStatistics.perfectStrikes}`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.ACCENT_GOLD,
          }}
          x={20}
          y={120}
        />

        <pixiText
          text={`사용된 기술: ${matchStatistics.techniquesUsed}`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          x={20}
          y={140}
        />

        {/* Winner Details */}
        <pixiText
          text="승자 세부 정보 - Winner Details"
          style={{
            fontSize: isMobile ? 14 : 16,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
          x={20}
          y={170}
        />

        <pixiText
          text={`유형: ${winner.archetype}`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
          }}
          x={20}
          y={195}
        />

        <pixiText
          text={`최종 체력: ${winner.health}/${winner.maxHealth}`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
          }}
          x={20}
          y={215}
        />
      </ResponsivePixiPanel>

      {/* Action Buttons */}
      <ResponsivePixiContainer
        x={width / 2}
        y={height - (isMobile ? 100 : 120)}
        screenWidth={width}
        screenHeight={height}
        data-testid="end-screen-actions"
      >
        <ResponsivePixiButton
          text="다시 시작 - Restart"
          x={-(isMobile ? 100 : 120)}
          y={0}
          width={isMobile ? 90 : 110}
          height={isMobile ? 40 : 50}
          screenWidth={width}
          screenHeight={height}
          variant="primary"
          onClick={onRestart}
          data-testid="restart-button"
        />

        <ResponsivePixiButton
          text="메뉴로 - Menu"
          x={isMobile ? 20 : 20}
          y={0}
          width={isMobile ? 90 : 110}
          height={isMobile ? 40 : 50}
          screenWidth={width}
          screenHeight={height}
          variant="secondary"
          onClick={onReturnToMenu}
          data-testid="return-menu-button"
        />
      </ResponsivePixiContainer>

      {/* Footer Message */}
      <pixiContainer
        x={width / 2}
        y={height - (isMobile ? 40 : 50)}
        data-testid="end-screen-footer"
      >
        <pixiText
          text="흑괘의 길을 완주하셨습니다 - You have completed the Path of the Black Trigram"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
            fontStyle: "italic",
          }}
          anchor={0.5}
        />
      </pixiContainer>
    </ResponsivePixiContainer>
  );
};

export default EndScreen;
