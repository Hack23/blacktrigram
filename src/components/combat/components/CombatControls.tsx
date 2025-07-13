import React, { useCallback, useState } from "react";
import { TrigramStance } from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";

// Import the actual CombatSystem class, not just the type
import { PlayerState } from "@/systems";
import { CombatSystem } from "@/systems/CombatSystem"; // Import the actual class
import { extendPixiComponents } from "../../../utils/pixiExtensions";

// Ensure PixiJS components are extended
extendPixiComponents();

export interface CombatControlsProps {
  readonly onAttack: () => void;
  readonly onDefend: () => void;
  readonly onSwitchStance: (stance: TrigramStance) => void;
  readonly onTechniqueExecute: () => void;
  readonly player: PlayerState;
  readonly isExecutingTechnique: boolean;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
  readonly combatSystem?: CombatSystem; // This can stay as type annotation
}

export const CombatControls: React.FC<CombatControlsProps> = ({
  onAttack,
  onDefend,
  onSwitchStance,
  onTechniqueExecute,
  player,
  isExecutingTechnique,
  width = 400,
  height = 120,
  x = 0,
  y = 0,
  combatSystem = new CombatSystem(), // Now this works because we imported the class
}) => {
  const [showStanceMenu, setShowStanceMenu] = useState(false);

  const availableTechniques = combatSystem.getAvailableTechniques(player);

  const toggleStanceMenu = useCallback(() => {
    setShowStanceMenu((prev) => !prev);
  }, []);

  const handleStanceSelect = useCallback(
    (stance: TrigramStance) => {
      onSwitchStance(stance);
      setShowStanceMenu(false);
    },
    [onSwitchStance]
  );

  const handleTechniqueExecute = useCallback(() => {
    onTechniqueExecute();
  }, [onTechniqueExecute]);

  // Responsive layout adjustments
  const isMobile = width < 400;

  return (
    <pixiContainer x={x} y={y} data-testid="combat-controls">
      {/* Controls Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.6 });
          g.roundRect(0, 0, width, height, 8);
          g.fill();
          g.stroke({
            width: 2,
            color: KOREAN_COLORS.PRIMARY_CYAN,
            alpha: 0.6,
          });
          g.roundRect(0, 0, width, height, 8);
          g.stroke();
        }}
      />

      {/* Controls Layout - Different for mobile and desktop */}
      {isMobile ? (
        // Mobile Layout - Stack buttons horizontally
        <pixiContainer x={10} y={height / 2} data-testid="mobile-controls">
          {/* Attack Button */}
          <pixiContainer x={0} y={0} data-testid="attack-button">
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: 0.8 });
                g.roundRect(0, 0, 70, 30, 5);
                g.fill();
              }}
              interactive={true}
              onPointerDown={onAttack}
            />
            <pixiText
              text="공격"
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
              }}
              x={35}
              y={15}
              anchor={0.5}
            />
          </pixiContainer>

          {/* Defend Button */}
          <pixiContainer x={80} y={0} data-testid="defend-button">
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: 0.8 });
                g.roundRect(0, 0, 70, 30, 5);
                g.fill();
              }}
              interactive={true}
              onPointerDown={onDefend}
            />
            <pixiText
              text="방어"
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
              }}
              x={35}
              y={15}
              anchor={0.5}
            />
          </pixiContainer>

          {/* Technique Button */}
          <pixiContainer x={160} y={0} data-testid="technique-button">
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: isExecutingTechnique
                    ? KOREAN_COLORS.ACCENT_GOLD
                    : KOREAN_COLORS.PRIMARY_CYAN,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, 70, 30, 5);
                g.fill();
              }}
              interactive={!isExecutingTechnique}
              onPointerDown={() => handleTechniqueExecute()}
            />
            <pixiText
              text="기술"
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
              }}
              x={35}
              y={15}
              anchor={0.5}
            />
          </pixiContainer>

          {/* Stance Button */}
          <pixiContainer x={240} y={0} data-testid="stance-button">
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, 70, 30, 5);
                g.fill();
              }}
              interactive={true}
              onPointerDown={toggleStanceMenu}
            />
            <pixiText
              text="자세"
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
              }}
              x={35}
              y={15}
              anchor={0.5}
            />
          </pixiContainer>
        </pixiContainer>
      ) : (
        // Desktop Layout - Full controls
        <pixiContainer x={10} y={10} data-testid="desktop-controls">
          {/* Left Side - Action Buttons */}
          <pixiContainer x={0} y={0} data-testid="action-buttons">
            {/* Attack Button */}
            <pixiContainer x={0} y={0} data-testid="attack-button">
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: 0.8 });
                  g.roundRect(0, 0, 100, 40, 5);
                  g.fill();
                }}
                interactive={true}
                onPointerDown={onAttack}
              />
              <pixiText
                text="공격"
                style={{
                  fontSize: 16,
                  fill: KOREAN_COLORS.TEXT_PRIMARY,
                }}
                x={50}
                y={20}
                anchor={0.5}
              />
            </pixiContainer>

            {/* Defend Button */}
            <pixiContainer x={0} y={50} data-testid="defend-button">
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({ color: KOREAN_COLORS.ACCENT_GREEN, alpha: 0.8 });
                  g.roundRect(0, 0, 100, 40, 5);
                  g.fill();
                }}
                interactive={true}
                onPointerDown={onDefend}
              />
              <pixiText
                text="방어"
                style={{
                  fontSize: 16,
                  fill: KOREAN_COLORS.TEXT_PRIMARY,
                }}
                x={50}
                y={20}
                anchor={0.5}
              />
            </pixiContainer>
          </pixiContainer>

          {/* Center - Technique Button */}
          <pixiContainer
            x={width / 2 - 50}
            y={height / 2 - 30}
            data-testid="technique-button"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: isExecutingTechnique
                    ? KOREAN_COLORS.ACCENT_GOLD
                    : KOREAN_COLORS.PRIMARY_CYAN,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, 100, 60, 5);
                g.fill();
              }}
              interactive={!isExecutingTechnique}
              onPointerDown={() => handleTechniqueExecute()}
            />
            <pixiText
              text="기술 실행"
              style={{
                fontSize: 16,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
              }}
              x={50}
              y={20}
              anchor={0.5}
            />
            <pixiText
              text={
                player.currentStance
                  ? availableTechniques[0]?.name?.korean || "기본 기술"
                  : "기본 기술"
              }
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
              }}
              x={50}
              y={40}
              anchor={0.5}
            />
          </pixiContainer>

          {/* Right Side - Stance Button */}
          <pixiContainer
            x={width - 110}
            y={height / 2 - 30}
            data-testid="stance-button"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, 100, 60, 5);
                g.fill();
              }}
              interactive={true}
              onPointerDown={toggleStanceMenu}
            />
            <pixiText
              text="자세 변경"
              style={{
                fontSize: 16,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
              }}
              x={50}
              y={20}
              anchor={0.5}
            />
            <pixiText
              text={player.currentStance || "기본 자세"}
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
              }}
              x={50}
              y={40}
              anchor={0.5}
            />
          </pixiContainer>
        </pixiContainer>
      )}

      {/* Stance Selection Menu - Appears when showStanceMenu is true */}
      {showStanceMenu && (
        <pixiContainer
          x={isMobile ? width / 2 - 150 : width - 220}
          y={isMobile ? 40 : -60}
          data-testid="stance-menu"
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
              g.roundRect(0, 0, 200, 210, 8);
              g.fill();
              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.6,
              });
              g.roundRect(0, 0, 200, 210, 8);
              g.stroke();
            }}
          />
          <pixiText
            text="팔괘 자세 선택"
            style={{
              fontSize: 16,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              align: "center",
            }}
            x={100}
            y={20}
            anchor={0.5}
          />

          {/* Stance Options */}
          {Object.values(TrigramStance).map((stance, index) => (
            <pixiContainer
              key={stance}
              x={10}
              y={40 + index * 30}
              interactive={true}
              onPointerDown={() => handleStanceSelect(stance)}
              data-testid={`stance-option-${stance}`}
            >
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color:
                      player.currentStance === stance
                        ? KOREAN_COLORS.PRIMARY_CYAN
                        : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                    alpha: 0.8,
                  });
                  g.roundRect(0, 0, 180, 25, 4);
                  g.fill();
                }}
              />
              <pixiText
                text={`${stance}`}
                style={{
                  fontSize: 14,
                  fill: KOREAN_COLORS.TEXT_PRIMARY,
                }}
                x={10}
                y={12.5}
                anchor={{ x: 0, y: 0.5 }}
              />
            </pixiContainer>
          ))}
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default CombatControls;
