import React, { useCallback, useMemo } from "react";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import type { CombatControlsProps } from "../../../types/components";
import type { KoreanTechnique } from "../../../types/combat";
import type { TrigramStance } from "../../../types/trigram";
import { KOREAN_COLORS } from "../../../types/constants/colors";
import { TRIGRAM_DATA } from "../../../types/constants/trigram";
import { DamageType } from "../../../types/enums";
import * as PIXI from "pixi.js";

export const CombatControls: React.FC<CombatControlsProps> = ({
  onAttack,
  onDefend,
  onSwitchStance,
  player,
  onTechniqueExecute,
  isExecutingTechnique = false,
  width = 300,
  height = 100,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  // Get current stance data safely
  const currentStanceData = player
    ? TRIGRAM_DATA[player.currentStance as TrigramStance]
    : undefined;

  const availableTechniques: KoreanTechnique[] = useMemo(() => {
    if (!currentStanceData?.techniques?.primary) return [];

    const stanceTechnique = currentStanceData.techniques.primary;
    const koreanTechnique: KoreanTechnique = {
      id: `${player.currentStance}_primary`,
      name: {
        korean: stanceTechnique.korean,
        english: stanceTechnique.english,
        romanized: stanceTechnique.korean,
      },
      koreanName: stanceTechnique.korean,
      englishName: stanceTechnique.english,
      romanized: stanceTechnique.korean,
      description: stanceTechnique.description,
      stance: player.currentStance,
      type: "strike" as any,
      damageType: DamageType.BLUNT,
      damage: stanceTechnique.damage,
      damageRange: {
        min: stanceTechnique.damage - 5,
        max: stanceTechnique.damage + 5,
      },
      range: 1.0,
      kiCost: stanceTechnique.kiCost,
      staminaCost: stanceTechnique.staminaCost,
      accuracy: stanceTechnique.hitChance,
      executionTime: 500,
      recoveryTime: 800,
      critChance: stanceTechnique.criticalChance,
      critMultiplier: 1.5,
      effects: [],
    };

    return [koreanTechnique];
  }, [currentStanceData, player.currentStance]);

  const handleTechniqueExecute = useCallback(
    (technique: KoreanTechnique) => {
      console.log("Executing technique:", technique.name.korean);
      onTechniqueExecute?.(technique);
    },
    [onTechniqueExecute]
  );

  const controlsPanelDraw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9);
      g.lineStyle(2, KOREAN_COLORS.PRIMARY_CYAN, 0.8);
      g.drawRoundedRect(0, 0, width, height, 10);
      g.endFill();
    },
    [width, height]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="combat-controls">
      {/* Control Panel Background */}
      <pixiGraphics draw={controlsPanelDraw} />

      {/* Attack Button */}
      <pixiContainer x={10} y={10}>
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.beginFill(KOREAN_COLORS.ACCENT_RED, 0.8);
            g.drawRoundedRect(0, 0, 60, 30, 5);
            g.endFill();
          }}
          interactive={true}
          onPointerDown={onAttack}
        />
        <pixiText
          text="공격"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          }}
          x={30}
          y={15}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Defend Button */}
      <pixiContainer x={80} y={10}>
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.beginFill(KOREAN_COLORS.ACCENT_BLUE, 0.8);
            g.drawRoundedRect(0, 0, 60, 30, 5);
            g.endFill();
          }}
          interactive={true}
          onPointerDown={onDefend}
        />
        <pixiText
          text="방어"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: "center",
          }}
          x={30}
          y={15}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Current Technique Button */}
      {availableTechniques.length > 0 && (
        <pixiContainer x={150} y={10}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.beginFill(KOREAN_COLORS.ACCENT_GOLD, 0.8);
              g.drawRoundedRect(0, 0, 80, 30, 5);
              g.endFill();
            }}
            interactive={true}
            onPointerDown={() => handleTechniqueExecute(availableTechniques[0])}
          />
          <pixiText
            text={availableTechniques[0].name.korean}
            style={{
              fontSize: 10,
              fill: KOREAN_COLORS.BLACK_SOLID,
              align: "center",
            }}
            x={40}
            y={15}
            anchor={0.5}
          />
        </pixiContainer>
      )}

      {/* Current Stance Display */}
      <pixiContainer x={10} y={50}>
        <pixiText
          text={`현재 자세: ${currentStanceData?.name.korean || "없음"}`}
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
        />
      </pixiContainer>

      {/* Stance Change Button */}
      {onSwitchStance && (
        <pixiContainer x={150} y={50}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.beginFill(KOREAN_COLORS.ACCENT_CYAN, 0.8);
              g.drawRoundedRect(0, 0, 80, 20, 3);
              g.endFill();
            }}
            interactive={true}
            onPointerDown={() => onSwitchStance(player.currentStance)}
          />
          <pixiText
            text="자세 변경"
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.BLACK_SOLID,
              align: "center",
            }}
            x={40}
            y={10}
            anchor={0.5}
          />
        </pixiContainer>
      )}

      {/* Execution Status */}
      {isExecutingTechnique && (
        <pixiContainer x={width / 2} y={height / 2}>
          <pixiText
            text="기술 실행 중..."
            style={{
              fontSize: 12,
              fill: KOREAN_COLORS.WARNING_YELLOW,
              align: "center",
            }}
            anchor={0.5}
          />
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default CombatControls;
