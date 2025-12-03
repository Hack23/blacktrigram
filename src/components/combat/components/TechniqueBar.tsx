/**
 * TechniqueBar Component
 * 
 * **Korean**: 기술 바 컴포넌트 (Technique Bar Component)
 * 
 * Horizontal bar displaying 3-5 technique cards at the bottom-center of combat HUD.
 * Manages technique selection, resource availability, and cooldown states.
 * 
 * @module components/combat/components/TechniqueBar
 * @category Combat UI
 * @korean 기술바
 */

import React, { useMemo } from "react";
import { Html } from "@react-three/drei";
import { Technique } from "../../../types";
import { PlayerState } from "../../../systems/player";
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
}) => {
  // Calculate card sizing and spacing
  const layout = useMemo(() => {
    const cardWidth = isMobile ? 70 : 90;
    const cardHeight = isMobile ? 80 : 100;
    const gap = isMobile ? 8 : 12;
    const totalWidth = techniques.length * cardWidth + (techniques.length - 1) * gap;
    
    return {
      cardWidth,
      cardHeight,
      gap,
      totalWidth,
      startX: (screenWidth - totalWidth) / 2,
      startY: screenHeight - cardHeight - (isMobile ? 100 : 120),
    };
  }, [techniques.length, isMobile, screenWidth, screenHeight]);
  
  // Check if player has sufficient resources for a technique
  const hasResources = useMemo(() => {
    return (tech: Technique): boolean => {
      return player.stamina >= tech.staminaCost && player.ki >= tech.kiCost;
    };
  }, [player.stamina, player.ki]);
  
  // Check if technique is available (has resources and not on cooldown)
  const isAvailable = useMemo(() => {
    return (tech: Technique): boolean => {
      const onCooldown = (cooldowns.get(tech.id) ?? 0) > 0;
      return hasResources(tech) && !onCooldown;
    };
  }, [hasResources, cooldowns]);
  
  return (
    <Html
      fullscreen
      style={{
        pointerEvents: "none",
      }}
    >
      {/* Technique Bar Container */}
      <div
        style={{
          position: "absolute",
          left: `${layout.startX}px`,
          top: `${layout.startY}px`,
          width: `${layout.totalWidth}px`,
          height: `${layout.cardHeight}px`,
          display: "flex",
          gap: `${layout.gap}px`,
          pointerEvents: "auto",
        }}
        data-testid="technique-bar"
      >
        {techniques.map((technique, index) => {
          const cardX = index * (layout.cardWidth + layout.gap);
          const cooldownRemaining = cooldowns.get(technique.id) ?? 0;
          const available = isAvailable(technique);
          
          return (
            <TechniqueCard
              key={technique.id}
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
              position={{ x: cardX, y: 0 }}
            />
          );
        })}
      </div>
      
      {/* Keyboard Hints (Optional) */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            left: `${layout.startX}px`,
            top: `${layout.startY + layout.cardHeight + 10}px`,
            width: `${layout.totalWidth}px`,
            textAlign: "center",
            fontSize: "11px",
            color: "#888",
            fontFamily: "monospace",
          }}
        >
          Press Q/W/E/R to use techniques
        </div>
      )}
    </Html>
  );
};

export default TechniqueBar;
