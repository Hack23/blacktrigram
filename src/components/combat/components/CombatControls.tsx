import React, { useCallback, useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import "@pixi/layout";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import type { PlayerState } from "../../../types/player";
import type { KoreanTechnique } from "../../../types/combat";
import type { TrigramStance } from "../../../types/enums";
import { KOREAN_COLORS } from "../../../types/constants";
import { TRIGRAM_DATA } from "../../../types/constants/trigram";
import { DamageType } from "../../../types/enums";
import { KoreanButton } from "../../ui/base/KoreanLayoutComponents";

extend({ Container, Graphics, Text });

export interface CombatControlsProps {
  readonly onAttack: () => void;
  readonly onDefend: () => void;
  readonly onSwitchStance: (stance: TrigramStance) => void;
  readonly player: PlayerState;
  readonly onTechniqueExecute?: (technique: KoreanTechnique) => void;
  readonly isExecutingTechnique?: boolean;
  readonly onPauseToggle?: () => void;
  readonly isPaused?: boolean;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

export const CombatControls: React.FC<CombatControlsProps> = ({
  onAttack,
  onDefend,
  player,
  onTechniqueExecute,
  isExecutingTechnique = false,
  onPauseToggle,
  isPaused = false,
  width = 400,
  height = 100,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  const isMobile = width < 500;

  // Safe access to stance data
  const currentStanceData = useMemo(() => {
    if (!player?.currentStance) return null;
    return TRIGRAM_DATA[player.currentStance] || null;
  }, [player?.currentStance]);

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

  const buttonLayout = {
    width: isMobile ? width - 20 : (width - 40) / 4,
    height: isMobile ? 35 : 45,
  };

  return (
    <pixiContainer x={x} y={y} data-testid="combat-controls">
      {/* Control Panel Background with Korean aesthetics */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
          g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
          g.roundRect(0, 0, width, height, 8);
          g.fill();
          g.stroke();

          // Korean corner decorations
          g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
          g.rect(8, 8, 15, 2);
          g.rect(8, 8, 2, 15);
          g.rect(width - 23, 8, 15, 2);
          g.rect(width - 10, 8, 2, 15);
          g.fill();
        }}
      />

      {/* Action Buttons */}
      <pixiContainer x={10} y={10}>
        {/* Attack Button */}
        <KoreanButton
          text={{ korean: "공격", english: "Attack" }}
          onClick={onAttack}
          width={buttonLayout.width}
          height={buttonLayout.height}
          variant="combat"
          disabled={isExecutingTechnique}
          data-testid="attack-button"
        />

        {/* Defend Button */}
        <pixiContainer x={buttonLayout.width + 10}>
          <KoreanButton
            text={{ korean: "방어", english: "Defend" }}
            onClick={onDefend}
            width={buttonLayout.width}
            height={buttonLayout.height}
            variant="stance"
            disabled={isExecutingTechnique}
            data-testid="defend-button"
          />
        </pixiContainer>

        {/* Technique Button */}
        {availableTechniques.length > 0 && (
          <pixiContainer x={(buttonLayout.width + 10) * 2}>
            <KoreanButton
              text={{
                korean: availableTechniques[0].name.korean,
                english: availableTechniques[0].name.english,
              }}
              onClick={() => handleTechniqueExecute(availableTechniques[0])}
              width={buttonLayout.width * 1.2}
              height={buttonLayout.height}
              variant="primary"
              disabled={isExecutingTechnique}
              data-testid="technique-button"
            />
          </pixiContainer>
        )}

        {/* Pause Button */}
        {onPauseToggle && (
          <pixiContainer x={width - buttonLayout.width - 20}>
            <KoreanButton
              text={{
                korean: isPaused ? "계속" : "정지",
                english: isPaused ? "Resume" : "Pause",
              }}
              onClick={onPauseToggle}
              width={buttonLayout.width}
              height={buttonLayout.height}
              variant="secondary"
              data-testid="pause-button"
            />
          </pixiContainer>
        )}
      </pixiContainer>

      {/* Status Display */}
      <pixiContainer x={10} y={height - 25}>
        {/* Current Stance Display */}
        <pixiText
          text={`현재 자세: ${currentStanceData?.name.korean || "없음"}`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Noto Sans KR",
          }}
        />

        {/* Technique Execution Status */}
        {isExecutingTechnique && (
          <pixiText
            text="기술 실행 중... - Executing Technique..."
            style={{
              fontSize: isMobile ? 8 : 10,
              fill: KOREAN_COLORS.WARNING_YELLOW,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
            x={200}
          />
        )}

        {/* Resource Status */}
        <pixiContainer x={width - 200}>
          <pixiText
            text={`기력: ${Math.round(player.ki)}/${player.maxKi}`}
            style={{
              fontSize: isMobile ? 7 : 8,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
            }}
          />
          <pixiText
            text={`체력: ${Math.round(player.stamina)}/${player.maxStamina}`}
            style={{
              fontSize: isMobile ? 7 : 8,
              fill: KOREAN_COLORS.SECONDARY_YELLOW,
            }}
            x={80}
          />
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
};

export default CombatControls;
