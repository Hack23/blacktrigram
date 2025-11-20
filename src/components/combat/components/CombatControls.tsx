import { extend } from "@pixi/react";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import React, { useCallback, useMemo, useState } from "react";
import { TrigramStance } from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";

// Import PlayerState type and create a mock CombatSystem for now
import type { PlayerState } from "@/systems";

// Mock CombatSystem class until the actual implementation is ready
class MockCombatSystem {
  getAvailableTechniques(player: PlayerState) {
    // Mock implementation - return empty array or basic techniques
    return [
      {
        name: "Basic Strike",
        kiCost: 10,
        staminaCost: 5,
        stance: player.currentStance,
      },
    ];
  }
}

// Register PixiJS components
extend({ Container, Graphics, Sprite, Text });

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
  readonly combatSystem?: MockCombatSystem;
}

// Korean names for trigram stances
const STANCE_NAMES = {
  [TrigramStance.GEON]: { korean: "건", english: "Heaven", symbol: "☰" },
  [TrigramStance.TAE]: { korean: "태", english: "Lake", symbol: "☱" },
  [TrigramStance.LI]: { korean: "리", english: "Fire", symbol: "☲" },
  [TrigramStance.JIN]: { korean: "진", english: "Thunder", symbol: "☳" },
  [TrigramStance.SON]: { korean: "손", english: "Wind", symbol: "☴" },
  [TrigramStance.GAM]: { korean: "감", english: "Water", symbol: "☵" },
  [TrigramStance.GAN]: { korean: "간", english: "Mountain", symbol: "☶" },
  [TrigramStance.GON]: { korean: "곤", english: "Earth", symbol: "☷" },
};

export const CombatControls: React.FC<CombatControlsProps> = ({
  onAttack,
  onDefend,
  onSwitchStance,
  onTechniqueExecute,
  player,
  isExecutingTechnique,
  width = 400,
  height = 140,
  x = 0,
  y = 0,
  combatSystem = new MockCombatSystem(),
}) => {
  const [showStanceMenu, setShowStanceMenu] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Get available techniques with current player state
  const availableTechniques = useMemo(
    () => combatSystem.getAvailableTechniques(player),
    [combatSystem, player, player.currentStance, player.ki, player.stamina]
  );

  const currentStanceInfo = useMemo(
    () =>
      STANCE_NAMES[player.currentStance] || STANCE_NAMES[TrigramStance.GEON],
    [player.currentStance]
  );

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

  // Check if player can afford technique
  const canExecuteTechnique = useMemo(() => {
    const technique = availableTechniques[0];
    if (!technique) return false;
    return (
      player.ki >= (technique.kiCost || 0) &&
      player.stamina >= (technique.staminaCost || 0) &&
      !isExecutingTechnique
    );
  }, [availableTechniques, player.ki, player.stamina, isExecutingTechnique]);

  // Responsive layout
  const isMobile = width < 300; // More specific mobile detection
  const buttonWidth = isMobile ? 45 : 70; // Smaller buttons for mobile
  const buttonHeight = isMobile ? 25 : 35;
  const fontSize = isMobile ? 8 : 11;

  // Enhanced button drawing with hover effects and glow
  const drawButton = useCallback(
    (
      g: PIXI.Graphics,
      color: number,
      isDisabled: boolean = false,
      isHovered: boolean = false
    ) => {
      g.clear();

      const alpha = isDisabled ? 0.4 : isHovered ? 1.0 : 0.8;
      const borderWidth = isHovered ? 3 : 2;

      // Add outer glow effect when hovered
      if (isHovered && !isDisabled) {
        g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.2 });
        g.roundRect(-2, -2, buttonWidth + 4, buttonHeight + 4, 7);
      }

      // Button background with gradient effect
      g.fill({ color, alpha });
      g.roundRect(0, 0, buttonWidth, buttonHeight, 5);

      // Border with glow
      g.stroke({
        width: borderWidth,
        color: isHovered
          ? KOREAN_COLORS.ACCENT_GOLD
          : KOREAN_COLORS.TEXT_PRIMARY,
        alpha: alpha * 0.8,
      });
      g.roundRect(0, 0, buttonWidth, buttonHeight, 5);

      // Inner highlight for depth
      if (!isDisabled) {
        g.stroke({ width: 1, color: KOREAN_COLORS.TEXT_PRIMARY, alpha: 0.3 });
        g.roundRect(1, 1, buttonWidth - 2, buttonHeight / 2, 4);
      }

      // Disabled overlay
      if (isDisabled) {
        g.fill({ color: KOREAN_COLORS.UI_GRAY, alpha: 0.5 });
        g.roundRect(0, 0, buttonWidth, buttonHeight, 5);
      }
    },
    [buttonWidth, buttonHeight]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="combat-controls">
      {/* Enhanced Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.7 });
          g.roundRect(0, 0, width, height, 8);

          // Korean traditional border pattern
          g.stroke({ width: 2, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.6 });
          g.roundRect(0, 0, width, height, 8);

          // Decorative elements
          g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.3 });
          g.moveTo(10, height / 2);
          g.lineTo(width - 10, height / 2);
          g.stroke();
        }}
      />

      {/* Player Resource Display */}
      <pixiContainer x={10} y={8}>
        <pixiText
          text={`기력: ${Math.round(player.ki)}/${
            player.maxKi
          } | Ki: ${Math.round(player.ki)}/${player.maxKi}`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
            fontFamily: "Noto Sans KR",
          }}
        />
        <pixiText
          text={`체력: ${Math.round(player.stamina)}/${
            player.maxStamina
          } | Stamina: ${Math.round(player.stamina)}/${player.maxStamina}`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.SECONDARY_YELLOW,
            fontFamily: "Noto Sans KR",
          }}
          y={12}
        />
      </pixiContainer>

      {/* Enhanced Control Buttons */}
      <pixiContainer x={5} y={isMobile ? 25 : 35}>
        {/* Attack Button */}
        <pixiContainer x={0} y={0} data-testid="attack-button">
          <pixiGraphics
            draw={(g) =>
              drawButton(
                g,
                KOREAN_COLORS.ACCENT_RED,
                false,
                hoveredButton === "attack"
              )
            }
            interactive={true}
            onPointerDown={onAttack}
            onPointerOver={() => setHoveredButton("attack")}
            onPointerOut={() => setHoveredButton(null)}
          />
          <pixiText
            text="공격"
            style={{
              fontSize: fontSize,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
            x={buttonWidth / 2}
            y={buttonHeight / 2}
            anchor={0.5}
          />
        </pixiContainer>

        {/* Defend Button */}
        <pixiContainer x={buttonWidth + 5} y={0} data-testid="defend-button">
          <pixiGraphics
            draw={(g) =>
              drawButton(
                g,
                KOREAN_COLORS.ACCENT_GREEN,
                false,
                hoveredButton === "defend"
              )
            }
            interactive={true}
            onPointerDown={onDefend}
            onPointerOver={() => setHoveredButton("defend")}
            onPointerOut={() => setHoveredButton(null)}
          />
          <pixiText
            text="방어"
            style={{
              fontSize: fontSize,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
            x={buttonWidth / 2}
            y={buttonHeight / 2}
            anchor={0.5}
          />
        </pixiContainer>

        {/* Technique Button with Resource Check */}
        <pixiContainer
          x={(buttonWidth + 5) * 2}
          y={0}
          data-testid="technique-button"
        >
          <pixiGraphics
            draw={(g) =>
              drawButton(
                g,
                canExecuteTechnique
                  ? KOREAN_COLORS.ACCENT_GOLD
                  : KOREAN_COLORS.UI_GRAY,
                !canExecuteTechnique,
                hoveredButton === "technique" && canExecuteTechnique
              )
            }
            interactive={canExecuteTechnique}
            onPointerDown={() => canExecuteTechnique && onTechniqueExecute()}
            onPointerOver={() =>
              canExecuteTechnique && setHoveredButton("technique")
            }
            onPointerOut={() => setHoveredButton(null)}
          />
          <pixiText
            text="기술"
            style={{
              fontSize: fontSize,
              fill: canExecuteTechnique
                ? KOREAN_COLORS.TEXT_PRIMARY
                : KOREAN_COLORS.TEXT_TERTIARY,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
            x={buttonWidth / 2}
            y={buttonHeight / 2}
            anchor={0.5}
          />
          <pixiText
            text="Technique"
            style={{
              fontSize: isMobile ? 7 : 9,
              fill: canExecuteTechnique
                ? KOREAN_COLORS.TEXT_SECONDARY
                : KOREAN_COLORS.TEXT_TERTIARY,
              fontStyle: "italic",
            }}
            x={buttonWidth / 2}
            y={buttonHeight / 2 + 6}
            anchor={0.5}
          />

          {/* Resource requirement indicator */}
          {!canExecuteTechnique && availableTechniques[0] && (
            <pixiText
              text={`${availableTechniques[0].kiCost || 0}기/${
                availableTechniques[0].staminaCost || 0
              }체`}
              style={{
                fontSize: 6,
                fill: KOREAN_COLORS.ACCENT_RED,
                fontFamily: "Noto Sans KR",
              }}
              x={buttonWidth / 2}
              y={buttonHeight + 5}
              anchor={0.5}
            />
          )}
        </pixiContainer>

        {/* Stance Button with Current Stance Display */}
        <pixiContainer
          x={(buttonWidth + 5) * 3}
          y={0}
          data-testid="stance-button"
        >
          <pixiGraphics
            draw={(g) =>
              drawButton(
                g,
                KOREAN_COLORS.PRIMARY_CYAN,
                false,
                hoveredButton === "stance"
              )
            }
            interactive={true}
            onPointerDown={toggleStanceMenu}
            onPointerOver={() => setHoveredButton("stance")}
            onPointerOut={() => setHoveredButton(null)}
          />
          <pixiText
            text="자세"
            style={{
              fontSize: fontSize,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
            x={buttonWidth / 2}
            y={buttonHeight / 2}
            anchor={0.5}
          />
          <pixiText
            text="Stance"
            style={{
              fontSize: isMobile ? 7 : 9,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontStyle: "italic",
            }}
            x={buttonWidth / 2}
            y={buttonHeight / 2 + 6}
            anchor={0.5}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Current Stance Display */}
      <pixiContainer x={10} y={height - 25}>
        <pixiText
          text={`현재: ${currentStanceInfo.korean} ${currentStanceInfo.symbol} | Current: ${currentStanceInfo.english}`}
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Noto Sans KR",
            fontWeight: "bold",
          }}
        />
      </pixiContainer>

      {/* Enhanced Stance Selection Menu */}
      {showStanceMenu && (
        <pixiContainer x={width - 250} y={-180} data-testid="stance-menu">
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
              g.roundRect(0, 0, 240, 170, 8);

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.8,
              });
              g.roundRect(0, 0, 240, 170, 8);
            }}
          />

          {/* Menu Header */}
          <pixiText
            text="팔괘 자세 선택"
            style={{
              fontSize: 14,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
            x={120}
            y={15}
            anchor={0.5}
          />
          <pixiText
            text="Eight Trigram Stances"
            style={{
              fontSize: 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontStyle: "italic",
            }}
            x={120}
            y={30}
            anchor={0.5}
          />

          {/* Stance Options in Grid */}
          {Object.values(TrigramStance).map((stance, index) => {
            const stanceInfo = STANCE_NAMES[stance];
            const col = index % 2;
            const row = Math.floor(index / 2);
            const isSelected = stance === player.currentStance;

            return (
              <pixiContainer
                key={stance}
                x={20 + col * 100}
                y={50 + row * 25}
                interactive={true}
                onPointerDown={() => handleStanceSelect(stance)}
                data-testid={`stance-option-${stance}`}
              >
                <pixiGraphics
                  draw={(g) => {
                    g.clear();
                    g.fill({
                      color: isSelected
                        ? KOREAN_COLORS.ACCENT_GOLD
                        : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                      alpha: 0.7,
                    });
                    g.roundRect(0, 0, 95, 20, 3);

                    g.stroke({
                      width: 1,
                      color: isSelected
                        ? KOREAN_COLORS.PRIMARY_CYAN
                        : KOREAN_COLORS.TEXT_SECONDARY,
                      alpha: 0.8,
                    });
                    g.roundRect(0, 0, 95, 20, 3);
                  }}
                />
                <pixiText
                  text={`${stanceInfo.symbol} ${stanceInfo.korean}`}
                  style={{
                    fontSize: 10,
                    fill: isSelected
                      ? KOREAN_COLORS.UI_BACKGROUND_DARK
                      : KOREAN_COLORS.TEXT_PRIMARY,
                    fontFamily: "Noto Sans KR",
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                  x={5}
                  y={5}
                />
                <pixiText
                  text={stanceInfo.english}
                  style={{
                    fontSize: 7,
                    fill: isSelected
                      ? KOREAN_COLORS.UI_BACKGROUND_MEDIUM
                      : KOREAN_COLORS.TEXT_SECONDARY,
                    fontStyle: "italic",
                  }}
                  x={5}
                  y={13}
                />
              </pixiContainer>
            );
          })}

          {/* Close button */}
          <pixiContainer
            x={210}
            y={10}
            interactive={true}
            onPointerDown={() => setShowStanceMenu(false)}
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({ color: KOREAN_COLORS.ACCENT_RED, alpha: 0.7 });
                g.circle(10, 10, 8);

                g.stroke({ width: 2, color: KOREAN_COLORS.TEXT_PRIMARY });
                g.moveTo(6, 6);
                g.lineTo(14, 14);
                g.moveTo(14, 6);
                g.lineTo(6, 14);
              }}
            />
          </pixiContainer>
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default CombatControls;
