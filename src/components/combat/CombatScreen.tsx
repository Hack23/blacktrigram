import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import type {
  CombatResult,
  CombatScreenProps,
  KoreanTechnique,
  TrigramStance,
} from "../../types";
import {
  CYBERPUNK_PALETTE,
  GAME_CONFIG,
  TRIGRAM_DATA,
} from "../../types/constants";
import { CombatArena } from "./components/CombatArena";
import { CombatHUD } from "./components/CombatHUD";
import { CombatControls } from "./components/CombatControls";
import { CombatSystem } from "../../systems/CombatSystem";
import {
  KOREAN_FONT_FAMILY,
  KoreanText as KoreanTextType,
} from "../../types/korean-text";
import { executeTechnique } from "../../utils/playerUtils";
import { useAudio } from "../../audio/AudioProvider";

export const CombatScreen: React.FC<CombatScreenProps> = ({
  players,
  onPlayerUpdate,
  currentRound,
  timeRemaining,
  isPaused,
  width = GAME_CONFIG.CANVAS_WIDTH,
  height = GAME_CONFIG.CANVAS_HEIGHT,
}) => {
  const [combatLog, setCombatLog] = useState<KoreanTextType[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState<0 | 1>(0);
  const [isExecutingTechnique, setIsExecutingTechnique] = useState(false);
  const [roundTimer, setRoundTimer] = useState(timeRemaining);

  const audioManager = useAudio();

  // Handle timer countdown
  useEffect(() => {
    setRoundTimer(timeRemaining);

    if (timeRemaining <= 10 && timeRemaining > 0) {
      audioManager.playSFX("countdown");
    }
  }, [timeRemaining, audioManager]);

  // Check for win conditions
  useEffect(() => {
    const winner = CombatSystem.checkWinCondition(players);
    if (winner) {
      console.log(`Winner detected: ${winner}`);
      // In a full implementation, this would trigger game phase change
    }
  }, [players]);

  const handleTechniqueExecute = useCallback(
    async (
      playerIndex: 0 | 1,
      technique: KoreanTechnique
    ): Promise<CombatResult | undefined> => {
      if (isExecutingTechnique || isPaused) return;

      const attacker = players[playerIndex];
      const defender = players[1 - playerIndex];

      try {
        setIsExecutingTechnique(true);
        const result = executeTechnique(attacker, defender, technique);

        // Play appropriate audio
        audioManager.playSFX("attack_light");
        if (result.hitResult.hit) {
          audioManager.playSFX("hit_light");
        }

        // Update combat log
        const logEntry: KoreanTextType = {
          korean: `${attacker.name.korean}이(가) ${
            technique.koreanName
          } 사용! ${
            result.hitResult.hit ? `${result.hitResult.damage} 피해` : "빗나감"
          }.`,
          english: `${attacker.name.english} used ${technique.englishName}! ${
            result.hitResult.hit ? `${result.hitResult.damage} damage` : "Miss"
          }.`,
        };
        setCombatLog((prev) => [logEntry, ...prev.slice(0, 4)]);

        // Update player states
        onPlayerUpdate(playerIndex, result.updatedAttacker);
        onPlayerUpdate(1 - playerIndex, result.updatedDefender);

        // Switch active player after technique
        setActivePlayerIndex((prev) => (prev === 0 ? 1 : 0));

        return result.hitResult;
      } catch (error) {
        console.error("Failed to execute technique:", error);
        const errorLog: KoreanTextType = {
          korean: "기술 실행 실패",
          english: "Technique execution failed",
        };
        setCombatLog((prev) => [errorLog, ...prev.slice(0, 4)]);
      } finally {
        setIsExecutingTechnique(false);
      }
    },
    [players, isExecutingTechnique, isPaused, onPlayerUpdate, audioManager]
  );

  const handleStanceChange = useCallback(
    (playerIndex: 0 | 1, stance: (typeof players)[0]["currentStance"]) => {
      if (isPaused) return;

      onPlayerUpdate(playerIndex, { currentStance: stance });
      audioManager.playSFX("stance_change");

      const stanceData = TRIGRAM_DATA[stance as TrigramStance];
      const logEntry: KoreanTextType = {
        korean: `${players[playerIndex].name.korean}이(가) ${
          stanceData?.name.korean || stance
        } 자세로 변경.`,
        english: `${players[playerIndex].name.english} changed to ${
          stanceData?.name.english || stance
        } stance.`,
      };
      setCombatLog((prevLog) => [logEntry, ...prevLog.slice(0, 4)]);
    },
    [players, onPlayerUpdate, isPaused, audioManager]
  );

  const combatLogStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: KOREAN_FONT_FAMILY,
        fontSize: 14,
        fill: CYBERPUNK_PALETTE.TEXT_SECONDARY,
        align: "left",
        wordWrap: true,
        wordWrapWidth: GAME_CONFIG.CANVAS_WIDTH - 40,
      }),
    []
  );

  const backgroundDraw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(CYBERPUNK_PALETTE.UI_BACKGROUND_DARK, 0.9);
      g.drawRect(0, 0, width, height);
      g.endFill();

      // Combat arena outline
      g.lineStyle(2, CYBERPUNK_PALETTE.PRIMARY_CYAN, 0.3);
      g.moveTo(20, height - 150);
      g.lineTo(width - 20, height - 150);
    },
    [width, height]
  );

  return (
    <Container>
      <Graphics draw={backgroundDraw} />

      {/* Combat HUD */}
      <CombatHUD
        players={players}
        timeRemaining={roundTimer}
        currentRound={currentRound}
        maxRounds={3}
        isPaused={isPaused}
        isPlayerTurn={activePlayerIndex === 0}
        x={0}
        y={0}
      />

      {/* Combat Arena */}
      <CombatArena
        players={players}
        onPlayerUpdate={onPlayerUpdate}
        onTechniqueExecute={handleTechniqueExecute}
        combatEffects={[]}
        isExecutingTechnique={isExecutingTechnique}
        showVitalPoints={false}
        showDebugInfo={false}
        x={0}
        y={GAME_CONFIG.CANVAS_HEIGHT * 0.15}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT * 0.6}
      />

      {/* Combat Controls */}
      <CombatControls
        players={players}
        player={players[activePlayerIndex]}
        onStanceChange={handleStanceChange}
        isExecutingTechnique={isExecutingTechnique}
        isPaused={isPaused}
        showVitalPoints={false}
        x={0}
        y={GAME_CONFIG.CANVAS_HEIGHT - 120}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={120}
      />

      {/* Combat Log */}
      <Container y={GAME_CONFIG.CANVAS_HEIGHT - 200} x={20}>
        {combatLog.map((entry, index) => (
          <Text
            key={`log-${index}`}
            text={`${entry.korean} / ${entry.english}`}
            style={combatLogStyle}
            y={index * -18}
            x={0}
            alpha={1 - index * 0.2}
          />
        ))}
      </Container>

      {/* Pause Overlay */}
      {isPaused && (
        <Container>
          <Graphics
            draw={(g: PIXI.Graphics) => {
              g.clear();
              g.beginFill(CYBERPUNK_PALETTE.UI_BACKGROUND_DARK, 0.8);
              g.drawRect(
                0,
                0,
                GAME_CONFIG.CANVAS_WIDTH,
                GAME_CONFIG.CANVAS_HEIGHT
              );
              g.endFill();
            }}
          />
          <Container
            x={GAME_CONFIG.CANVAS_WIDTH / 2}
            y={GAME_CONFIG.CANVAS_HEIGHT / 2}
          >
            <Text
              text="일시정지 (Paused)"
              anchor={0.5}
              style={
                new PIXI.TextStyle({
                  fontFamily: KOREAN_FONT_FAMILY,
                  fontSize: 48,
                  fill: CYBERPUNK_PALETTE.TEXT_ACCENT,
                  align: "center",
                })
              }
              y={-50}
            />
            <Text
              text="SPACE: 계속 (Resume) | ESC: 메뉴 (Menu)"
              anchor={0.5}
              style={
                new PIXI.TextStyle({
                  fontFamily: KOREAN_FONT_FAMILY,
                  fontSize: 24,
                  fill: CYBERPUNK_PALETTE.TEXT_SECONDARY,
                  align: "center",
                })
              }
              y={20}
            />
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default CombatScreen;
