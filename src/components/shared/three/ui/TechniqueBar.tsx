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
import {
  HUD_SIDE_CONTROL_RESERVES,
  TECHNIQUE_BAR_MIN_READABLE_SCALE,
} from "../../../../types/constants/layout";
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

  /**
   * Actual available pixel width of the container when in embedded mode.
   *
   * Embedded parents (TrainingBottomHUD, CombatBottomHUD) reserve space for
   * side controls via margins/padding, so the real container width is smaller
   * than `screenWidth`. Passing the pre-computed pixel width here ensures
   * the rawScale / shouldScroll decision is accurate and prevents cards from
   * overflowing back under side controls.
   *
   * When omitted in embedded mode, the component falls back to
   * `screenWidth − 2 × HUD_SIDE_CONTROL_RESERVES` (previous behaviour).
   */
  readonly containerWidth?: number;
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
  containerWidth,
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

    // When embedded and the parent supplies its actual pixel width, use that
    // directly so rawScale / shouldScroll reflects the real available space.
    // Falls back to screenWidth − 2× side-reserve when containerWidth is not
    // provided (non-embedded or legacy callers).
    let availableWidth: number;
    if (embedded && containerWidth !== undefined) {
      availableWidth = Math.max(cardWidth, containerWidth);
    } else {
      const reservedSideWidth = embedded
        ? (isMobile
            ? HUD_SIDE_CONTROL_RESERVES.TECHNIQUE_BAR_MOBILE
            : HUD_SIDE_CONTROL_RESERVES.TECHNIQUE_BAR_DESKTOP)
        : 0;
      availableWidth = Math.max(cardWidth, screenWidth - reservedSideWidth * 2);
    }
    const rawScale =
      totalWidth > 0 ? Math.min(1, availableWidth / totalWidth) : 1;
    const shouldScroll =
      embedded && rawScale < TECHNIQUE_BAR_MIN_READABLE_SCALE;
    const visualScale = shouldScroll ? 1 : rawScale;

    return {
      cardWidth,
      cardHeight,
      gap,
      totalWidth,
      visualScale,
      shouldScroll,
      startX: (screenWidth - totalWidth) / 2,
      startY: screenHeight - cardHeight - (isMobile ? 100 : 120),
    };
  }, [techniques.length, isMobile, screenWidth, screenHeight, embedded, containerWidth]);

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
        justifyContent: layout.shouldScroll ? "flex-start" : "center",
        width: "100%",
        maxWidth: "100%",
        height: `${layout.cardHeight * layout.visualScale}px`,
        pointerEvents: "auto",
        overflowX: layout.shouldScroll ? "auto" : "visible",
        overflowY: "visible",
        // iOS momentum + scroll-snap for tactile feel
        scrollSnapType: layout.shouldScroll ? "x proximity" : undefined,
        WebkitOverflowScrolling: layout.shouldScroll ? "touch" : undefined,
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
            transform: embedded ? `scale(${layout.visualScale})` : undefined,
            transformOrigin: embedded
              ? layout.shouldScroll
                ? "left center"
                : "center bottom"
              : undefined,
            paddingInline: layout.shouldScroll ? "8px" : undefined,
            flexShrink: 0,
          }}
        >
          {techniques.map((technique, index) => {
            const cardX = index * (layout.cardWidth + layout.gap);
            const cooldownRemaining = cooldowns.get(technique.id) ?? 0;
            const available = isAvailable(technique);

            return (
              <div
                key={technique.id}
                data-testid={`technique-slot-${index}`}
                style={layout.shouldScroll ? { scrollSnapAlign: "start" } : undefined}
              >
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
