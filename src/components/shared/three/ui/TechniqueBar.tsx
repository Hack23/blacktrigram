/**
 * TechniqueBar Component
 *
 * **Korean**: 기술 바 컴포넌트 (Technique Bar Component)
 *
 * Horizontal bar displaying 3-5 technique cards at the bottom-center of combat HUD.
 * Manages technique selection, resource availability, and cooldown states.
 *
 * @module components/shared/three/ui/TechniqueBar
 * @category Shared UI
 * @korean 기술바
 */

import React, { useMemo } from "react";
import { PlayerState } from "../../../../systems/player";
import { Technique } from "../../../../types";
import { TechniqueCard } from "./TechniqueCard";

/**
 * Props for TechniqueBar component.
 */
export interface TechniqueBarProps {
  /** Available techniques for player */
  readonly techniques: readonly Technique[];

  /** Player state with resources */
  readonly player: PlayerState;

  /** Index of currently selected technique */
  readonly selectedIndex: number;

  /** Active cooldowns map (techniqueId -> remaining ms) */
  readonly cooldowns: ReadonlyMap<string, number>;

  /** Callback when technique is selected */
  readonly onTechniqueSelect: (index: number) => void;

  /** Callback when hovering technique (for tooltip) */
  readonly onTechniqueHover: (technique: Technique | null) => void;

  /** Whether rendering for mobile device */
  readonly isMobile: boolean;

  /** Screen width for positioning */
  readonly screenWidth: number;

  /** Screen height for positioning */
  readonly screenHeight: number;

  /** Whether to use embedded mode (relative positioning, no absolute) */
  readonly embedded?: boolean;
}

/**
 * TechniqueBar Component
 *
 * Displays a horizontal bar of technique cards positioned at the bottom-center
 * of the combat screen. Each card shows technique details and availability.
 *
 * @param props - Component props
 * @returns TechniqueBar component
 */
export const TechniqueBar: React.FC<TechniqueBarProps> = ({
  techniques,
  player,
  selectedIndex,
  cooldowns,
  onTechniqueSelect,
  onTechniqueHover,
  isMobile,
  screenWidth,
  screenHeight,
  embedded = false,
}) => {
  // Calculate card sizing and spacing
  const layout = useMemo(() => {
    const cardWidth = isMobile ? 70 : 90;
    const cardHeight = isMobile ? 80 : 100;
    const gap = isMobile ? 8 : 12;
    const totalWidth = Math.max(
      0,
      techniques.length * cardWidth + (techniques.length - 1) * gap,
    );

    const reservedSideWidth = embedded ? (isMobile ? 96 : 190) : 0;
    const availableWidth = Math.max(
      cardWidth,
      screenWidth - reservedSideWidth * 2,
    );
    const visualScale =
      totalWidth > 0 ? Math.min(1, availableWidth / totalWidth) : 1;

    return {
      cardWidth,
      cardHeight,
      gap,
      totalWidth,
      visualScale,
      startX: (screenWidth - totalWidth) / 2,
      startY: screenHeight - cardHeight - (isMobile ? 100 : 120),
    };
  }, [techniques.length, isMobile, screenWidth, screenHeight, embedded]);

  // Check if player has sufficient resources for a technique
  const hasResources = (tech: Technique): boolean => {
    return player.stamina >= tech.staminaCost && player.ki >= tech.kiCost;
  };

  // Check if technique is available (has resources and not on cooldown)
  const isAvailable = (tech: Technique): boolean => {
    const onCooldown = (cooldowns.get(tech.id) ?? 0) > 0;
    return hasResources(tech) && !onCooldown;
  };

  // Calculate bottom position for proper placement (only used in non-embedded mode)
  const bottomOffset = isMobile ? 100 : 120;

  // Embedded mode: relative positioning inside parent container
  // Non-embedded: absolute positioning for standalone use
  const containerStyle: React.CSSProperties = embedded
      ? {
          position: "relative",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: `${layout.cardHeight * layout.visualScale}px`,
          pointerEvents: "auto",
          overflow: "visible",
        }
    : {
        position: "absolute",
        left: "50%",
        bottom: `${bottomOffset}px`,
        transform: "translateX(-50%)",
        width: `${layout.totalWidth}px`,
        height: `${layout.cardHeight}px`,
        display: "flex",
        gap: `${layout.gap}px`,
        pointerEvents: "auto",
        zIndex: 100,
      };

  return (
    <>
      {/* Technique Bar Container */}
      <div style={containerStyle} data-testid="technique-bar">
        <div
          style={{
            display: "flex",
            gap: `${layout.gap}px`,
            justifyContent: "center",
            transform: `scale(${layout.visualScale})`,
            transformOrigin: "center bottom",
          }}
        >
          {techniques.map((technique, index) => {
            const cardX = index * (layout.cardWidth + layout.gap);
            const cooldownRemaining = cooldowns.get(technique.id) ?? 0;
            const available = isAvailable(technique);

            return (
              <div key={technique.id} data-testid={`technique-slot-${index}`}>
                <TechniqueCard
                  technique={technique}
                  isSelected={selectedIndex === index}
                  isAvailable={available}
                  staminaCost={technique.staminaCost}
                  kiCost={technique.kiCost}
                  remainingCooldown={cooldownRemaining}
                  keyboardShortcut={technique.keyboardShortcut}
                  onClick={() => onTechniqueSelect(index)}
                  onHover={onTechniqueHover}
                  isMobile={isMobile}
                  playerArchetype={player.archetype}
                  playerStance={player.currentStance}
                  position={{ x: cardX, y: 0 }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard Hints - only shown in embedded mode or non-mobile */}
      {!isMobile && (
        <div
          style={{
            position: embedded ? "relative" : "absolute",
            left: embedded ? undefined : "50%",
            bottom: embedded
              ? undefined
              : `${bottomOffset - layout.cardHeight - 20}px`,
            transform: embedded ? undefined : "translateX(-50%)",
            width: embedded ? "100%" : `${layout.totalWidth}px`,
            textAlign: "center",
            fontSize: "11px",
            color: "#aaa",
            fontFamily: "monospace",
            pointerEvents: "none",
            textShadow: "0 0 4px rgba(0,0,0,0.8)",
            marginTop: embedded ? "8px" : undefined,
          }}
        >
          기술 실행: Q-E-R-T-Y-F-G-Z-X-C | Press technique keys to execute
        </div>
      )}
    </>
  );
};

export default TechniqueBar;
