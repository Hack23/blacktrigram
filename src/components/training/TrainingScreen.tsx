import React, { useCallback, useState } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import { PLAYER_DEFAULTS } from "../../types/constants/player";
import usePixiExtensions from "../../utils/pixiExtensions";
import { DojangBackground } from "../game";
import { PlayerVisuals } from "../game/PlayerVisuals";
import { KoreanHeader } from "../ui";

export const TrainingScreen: React.FC<
  import("../../types/components").TrainingScreenProps
> = ({ onStartCombat, onReturnToMenu, width = 1200, height = 800 }) => {
  usePixiExtensions();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const [playerState] = useState(() => ({
    ...PLAYER_DEFAULTS.player1,
    energy: 100,
    maxEnergy: 100,
    attackPower: 75,
    defense: 75,
    speed: 75,
    technique: 75,
    accuracy: 0.8,
    criticalChance: 0.1,
    effectiveness: 1.0,
    momentum: 0,
    focus: 100,
    injuries: [],
    skills: [],
    techniques: [],
    equipment: null,
    experience: 0,
    level: 1,
    training: {
      sessions: 0,
      totalTime: 0,
      skillPoints: 0,
    },
  }));

  const drawButton = useCallback((g: PIXI.Graphics, isHovered: boolean) => {
    g.clear();
    g.beginFill(
      isHovered
        ? KOREAN_COLORS.PRIMARY_CYAN
        : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
      0.8
    );
    g.roundRect(0, 0, 200, 50, 10);
    g.endFill();

    g.lineStyle(2, KOREAN_COLORS.ACCENT_GOLD, 1);
    g.drawRoundedRect(0, 0, 200, 50, 10);

    g.beginFill(KOREAN_COLORS.ACCENT_GOLD, 0.6);
    g.drawCircle(20, 25, 10);
    g.endFill();
  }, []);

  return (
    <pixiContainer>
      <DojangBackground width={width} height={height} lighting="traditional" />

      <KoreanHeader
        title={{ korean: "훈련 화면", english: "Training Screen" }}
        subtitle={{
          korean: "기술을 연습하고 전투 준비를 하세요",
          english: "Practice techniques and prepare for combat",
        }}
        x={width / 2}
        y={50}
        size="large"
      />

      <PlayerVisuals
        playerState={playerState}
        x={width / 2}
        y={height / 2 - 50}
        scale={1.5}
        showDetails={true}
      />

      {/* Start Combat Button */}
      {onStartCombat && (
        <>
          <pixiGraphics
            draw={(g) => drawButton(g, hoveredButton === "start")}
            interactive
            cursor="pointer"
            onPointerOver={() => setHoveredButton("start")}
            onPointerOut={() => setHoveredButton(null)}
            onPointerDown={onStartCombat}
            x={width / 2 - 100}
            y={height - 200}
          />
          <pixiText
            text="전투 시작 (Start Combat)"
            style={{
              fontFamily: FONT_FAMILY.PRIMARY,
              fontSize: 18,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: "center",
            }}
            anchor={0.5}
            x={width / 2}
            y={height - 175}
          />
        </>
      )}

      {/* Return to Menu Button */}
      <pixiGraphics
        draw={(g) => drawButton(g, hoveredButton === "menu")}
        interactive
        cursor="pointer"
        onPointerOver={() => setHoveredButton("menu")}
        onPointerOut={() => setHoveredButton(null)}
        onPointerDown={onReturnToMenu}
        x={width / 2 - 100}
        y={height - 120}
      />
      <pixiText
        text="메뉴로 돌아가기 (Return to Menu)"
        style={{
          fontFamily: FONT_FAMILY.PRIMARY,
          fontSize: 18,
          fill: KOREAN_COLORS.TEXT_PRIMARY,
          align: "center",
        }}
        anchor={0.5}
        x={width / 2}
        y={height - 95}
      />
    </pixiContainer>
  );
};

export default TrainingScreen;
