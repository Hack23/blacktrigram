/**
 * ArchetypeCard - Three.js-compatible character archetype card
 * 
 * Displays player archetype information with Korean theming
 * 
 * @module components/three
 */

import { Html } from "@react-three/drei";
import React, { useCallback, useMemo, useState } from "react";
import { PlayerArchetype } from "../../../../types/common";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { PLAYER_ARCHETYPES_DATA } from "../../../../systems/types";

/**
 * Props for ArchetypeCard component
 */
export interface ArchetypeCardProps {
  readonly archetype: PlayerArchetype;
  readonly onSelect?: (archetype: PlayerArchetype) => void;
  readonly isSelected?: boolean;
  readonly position?: [number, number, number];
  readonly width?: number;
  readonly showStats?: boolean;
  readonly testId?: string;
}

/**
 * ArchetypeCard Component
 * 
 * A card component for displaying player archetypes with Korean martial arts styling.
 * Includes archetype name, description, and optional stats.
 * 
 * @example
 * ```tsx
 * <ArchetypeCard
 *   archetype={PlayerArchetype.MUSA}
 *   onSelect={(archetype) => console.log(archetype)}
 *   showStats
 * />
 * ```
 */
export const ArchetypeCard: React.FC<ArchetypeCardProps> = ({
  archetype,
  onSelect,
  isSelected = false,
  position = [0, 0, 0],
  width = 320,
  showStats = true,
  testId,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const archetypeData = useMemo(
    () => PLAYER_ARCHETYPES_DATA[archetype],
    [archetype]
  );

  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(archetype);
    }
  }, [onSelect, archetype]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Memoize card styles for performance
  const cardStyle = useMemo<React.CSSProperties>(() => {
    let background = hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95);
    let borderColor = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.4);
    let boxShadow = `0 2px 8px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.3)}`;

    if (isSelected) {
      background = hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.15);
      borderColor = hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.9);
      boxShadow = `
        0 4px 12px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)},
        0 0 20px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.4)}
      `;
    } else if (isHovered) {
      background = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.1);
      borderColor = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.7);
      boxShadow = `
        0 4px 12px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.4)},
        0 0 15px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.3)}
      `;
    }

    return {
      width: `${width}px`,
      background,
      border: `2px solid ${borderColor}`,
      borderRadius: "8px",
      padding: "16px",
      cursor: onSelect ? "pointer" : "default",
      transition: "all 0.3s ease",
      boxShadow,
      transform: isHovered && onSelect ? "translateY(-4px)" : "translateY(0)",
      userSelect: "none",
      WebkitUserSelect: "none",
    };
  }, [width, isSelected, isHovered, onSelect]);

  // Memoize header styles for performance
  const headerStyle = useMemo<React.CSSProperties>(
    () => ({
      marginBottom: "12px",
      paddingBottom: "8px",
      borderBottom: `1px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.3)}`,
    }),
    []
  );

  const titleStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: "20px",
      fontWeight: "bold",
      color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD),
      textShadow: `0 2px 4px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)}`,
      marginBottom: "4px",
    }),
    []
  );

  const subtitleStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: "14px",
      fontStyle: "italic",
      color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY),
      opacity: 0.8,
    }),
    []
  );

  const descriptionStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: "14px",
      lineHeight: "1.6",
      color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY),
      marginBottom: showStats ? "12px" : "0",
    }),
    [showStats]
  );

  const statsContainerStyle = useMemo<React.CSSProperties>(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "8px",
      marginTop: "12px",
    }),
    []
  );

  const statItemStyle = useMemo<React.CSSProperties>(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    }),
    []
  );

  const statLabelStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: "12px",
      color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY),
      fontWeight: "bold",
    }),
    []
  );

  const statValueStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: "16px",
      color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN),
      fontWeight: "bold",
    }),
    []
  );

  return (
    <Html position={position} center>
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={cardStyle}
        data-testid={testId ?? `archetype-card-${archetype}`}
      >
        {/* Header */}
        <div style={headerStyle}>
          <div style={titleStyle}>{archetypeData.name.korean}</div>
          <div style={subtitleStyle}>{archetypeData.name.english}</div>
        </div>

        {/* Description */}
        <div style={descriptionStyle}>
          {archetypeData.description.korean}
        </div>

        {/* Stats */}
        {showStats && (
          <div style={statsContainerStyle}>
            <div style={statItemStyle}>
              <div style={statLabelStyle}>공격 | Attack</div>
              <div style={statValueStyle}>{archetypeData.stats.attackPower}</div>
            </div>
            <div style={statItemStyle}>
              <div style={statLabelStyle}>방어 | Defense</div>
              <div style={statValueStyle}>{archetypeData.stats.defense}</div>
            </div>
            <div style={statItemStyle}>
              <div style={statLabelStyle}>속도 | Speed</div>
              <div style={statValueStyle}>{archetypeData.stats.speed}</div>
            </div>
            <div style={statItemStyle}>
              <div style={statLabelStyle}>기력 | Ki</div>
              <div style={statValueStyle}>{archetypeData.baseKi}</div>
            </div>
          </div>
        )}
      </div>
    </Html>
  );
};

ArchetypeCard.displayName = "ArchetypeCard";
