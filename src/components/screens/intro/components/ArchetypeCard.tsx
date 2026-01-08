import React, { useCallback, useMemo } from "react";
import { PlayerArchetype } from "../../../../../types/common";
import { FALLBACK_ARCHETYPE_IMAGE, FONT_FAMILY, KOREAN_COLORS } from "../../../../../types/constants";
import { hexToRgbaString, hexColorToCSS } from "../../../../../utils/colorUtils";
import { AbilityList } from "./AbilityList";
import { StatBar } from "./StatBar";

export interface ArchetypeCardData {
  readonly archetype: PlayerArchetype;
  readonly id: string;
  readonly korean: string;
  readonly english: string;
  readonly description: string;
  readonly color: number;
  readonly textureKey: string;
  readonly stats: {
    readonly attackPower: number;
    readonly defense: number;
    readonly speed: number;
    readonly technique: number;
  };
  readonly philosophy: {
    readonly korean: string;
    readonly english: string;
  };
  readonly specialAbilities?: readonly string[];
}

export interface ArchetypeCardProps {
  readonly data: ArchetypeCardData;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
  readonly onConfirm?: () => void;
  readonly isMobile?: boolean;
  readonly width?: number;
  readonly showSelectButton?: boolean;
}

/**
 * ArchetypeCard component - Displays detailed archetype preview card
 * Shows stats, abilities, philosophy, and selection interface
 */
export const ArchetypeCard: React.FC<ArchetypeCardProps> = React.memo(
  ({
    data,
    isSelected,
    onSelect,
    onConfirm,
    isMobile = false,
    width = 380,
    showSelectButton = true,
  }) => {
    const {
      archetype,
      korean,
      english,
      color,
      textureKey,
      stats,
      philosophy,
      specialAbilities = [],
    } = data;

    // Calculate responsive dimensions
    const cardWidth = isMobile ? Math.min(280, width) : width;
    const imageSize = isMobile ? 120 : 160;
    const padding = isMobile ? 16 : 24;
    const gap = isMobile ? 10 : 16;

    // Memoize color calculations
    const colors = useMemo(
      () => ({
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
        border: hexToRgbaString(
          isSelected ? KOREAN_COLORS.ACCENT_GOLD : color,
          isSelected ? 1 : 0.7
        ),
        cardColor: hexColorToCSS(color),
        titleColor: isSelected
          ? hexColorToCSS(KOREAN_COLORS.ACCENT_GOLD)
          : hexColorToCSS(color),
        philosophyColor: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY),
        buttonBackground: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.9),
        buttonText: hexColorToCSS(KOREAN_COLORS.UI_BACKGROUND_DARK),
        imageGlow: hexToRgbaString(color, 0.3),
      }),
      [color, isSelected]
    );

    // Handle card click
    const handleCardClick = useCallback(() => {
      if (!isSelected) {
        onSelect();
      }
    }, [isSelected, onSelect]);

    // Handle confirm button click
    const handleConfirmClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        onConfirm?.();
      },
      [onConfirm]
    );

    // Get archetype image path
    const imagePath = `/assets/visual/archetypes/${textureKey}.png`;

    // Transform stats to StatBar format
    const statBars = useMemo(
      () => [
        {
          label: "공격 | Attack",
          value: stats.attackPower,
        },
        {
          label: "방어 | Defense",
          value: stats.defense,
        },
        {
          label: "속도 | Speed",
          value: stats.speed,
        },
        {
          label: "기술 | Technique",
          value: stats.technique,
        },
      ],
      [stats]
    );

    return (
      <div
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isSelected) {
            e.preventDefault();
            onSelect();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`${korean} ${english} archetype card`}
        aria-pressed={isSelected}
        style={{
          width: `${cardWidth}px`,
          padding: `${padding}px`,
          backgroundColor: colors.background,
          border: `${isSelected ? "3px" : "2px"} solid ${colors.border}`,
          borderRadius: "12px",
          cursor: isSelected ? "default" : "pointer",
          transition: "all 0.3s ease",
          transform: isSelected ? "scale(1.05)" : "scale(1)",
          boxShadow: isSelected
            ? `0 0 20px ${colors.imageGlow}, 0 4px 8px rgba(0, 0, 0, 0.3)`
            : "0 2px 4px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: `${gap}px`,
          position: "relative",
          overflow: "hidden",
        }}
        data-testid={`archetype-card-${archetype}`}
      >
        {/* Selected indicator badge */}
        {isSelected && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              padding: "4px 8px",
              background: colors.buttonBackground,
              color: colors.buttonText,
              fontSize: isMobile ? "10px" : "12px",
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
              borderRadius: "4px",
              zIndex: 10,
            }}
            data-testid="selected-badge"
          >
            선택됨 | Selected
          </div>
        )}

        {/* Character Image */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: `${gap / 2}px`,
          }}
        >
          <div
            style={{
              width: `${imageSize}px`,
              height: `${imageSize}px`,
              background: `radial-gradient(circle, ${colors.imageGlow}, transparent)`,
              borderRadius: "8px",
              border: `2px solid ${colors.cardColor}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
            data-testid="archetype-image-container"
          >
            <img
              src={imagePath}
              alt={`${korean} - ${english}`}
              style={{
                width: `${imageSize - 10}px`,
                height: `${imageSize - 10}px`,
                objectFit: "contain",
              }}
              data-testid="archetype-image"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.endsWith(FALLBACK_ARCHETYPE_IMAGE)) {
                  target.src = FALLBACK_ARCHETYPE_IMAGE;
                }
              }}
            />
          </div>
        </div>

        {/* Archetype Name */}
        <h2
          style={{
            fontSize: isMobile ? "20px" : "28px",
            color: colors.titleColor,
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "bold",
            margin: 0,
            textAlign: "center",
            textShadow: `0 0 10px ${colors.imageGlow}`,
          }}
          data-testid="archetype-name"
        >
          {korean}
          <br />
          <span
            style={{
              fontSize: isMobile ? "16px" : "22px",
            }}
          >
            {english}
          </span>
        </h2>

        {/* Philosophy/Description */}
        <p
          style={{
            fontSize: isMobile ? "12px" : "14px",
            color: colors.philosophyColor,
            fontFamily: FONT_FAMILY.KOREAN,
            margin: 0,
            lineHeight: "1.5",
            textAlign: "center",
            fontStyle: "italic",
          }}
          data-testid="archetype-philosophy"
        >
          {philosophy.korean}
          <br />
          {philosophy.english}
        </p>

        {/* Stats Visualization */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: `${gap / 2}px`,
          }}
          data-testid="archetype-stats"
        >
          <div
            style={{
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
              color: colors.cardColor,
            }}
          >
            전투 능력치 | Combat Stats
          </div>

          {statBars.map((stat) => (
            <StatBar
              key={stat.label}
              label={stat.label}
              value={stat.value}
              max={100}
              color={color}
              height={isMobile ? 10 : 12}
              showValue={true}
              isMobile={isMobile}
            />
          ))}
        </div>

        {/* Special Abilities */}
        {specialAbilities.length > 0 && (
          <div style={{ marginTop: `${gap / 2}px` }}>
            <AbilityList
              abilities={specialAbilities}
              maxAbilities={3}
              color={color}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* Select Button */}
        {isSelected && showSelectButton && onConfirm && (
          <button
            onClick={handleConfirmClick}
            style={{
              width: "100%",
              padding: isMobile ? "10px" : "14px",
              marginTop: `${gap}px`,
              fontSize: isMobile ? "14px" : "16px",
              backgroundColor: colors.buttonBackground,
              color: colors.buttonText,
              border: "none",
              borderRadius: "6px",
              fontFamily: FONT_FAMILY.KOREAN,
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: `0 2px 8px ${colors.imageGlow}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = `0 4px 12px ${colors.imageGlow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = `0 2px 8px ${colors.imageGlow}`;
            }}
            data-testid={`select-button-${archetype}`}
          >
            선택 | Select
          </button>
        )}
      </div>
    );
  }
);

ArchetypeCard.displayName = "ArchetypeCard";

export default ArchetypeCard;
