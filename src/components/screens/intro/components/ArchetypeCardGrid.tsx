import React, { useCallback, useMemo } from "react";
import { PlayerArchetype } from "../../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString, hexColorToCSS } from "../../../../utils/colorUtils";
import { ArchetypeCard, ArchetypeCardData } from "./ArchetypeCard";

export interface ArchetypeCardGridProps {
  readonly archetypes: readonly ArchetypeCardData[];
  readonly selectedArchetype: PlayerArchetype;
  readonly onArchetypeChange: (archetype: PlayerArchetype) => void;
  readonly onArchetypeConfirm?: (archetype: PlayerArchetype) => void;
  readonly onPlaySFX: (sound: string) => void;
  readonly width?: number;
  readonly height?: number;
  readonly isMobile?: boolean;
}

/**
 * ArchetypeCardGrid - Grid layout for displaying multiple archetype cards
 * Provides an enhanced selection interface with detailed preview cards
 */
export const ArchetypeCardGrid: React.FC<ArchetypeCardGridProps> = React.memo(
  ({
    archetypes,
    selectedArchetype,
    onArchetypeChange,
    onArchetypeConfirm,
    onPlaySFX,
    width = 900,
    height = 600,
    isMobile = false,
  }) => {
    // Find selected archetype index
    const selectedIndex = useMemo(() => {
      return archetypes.findIndex((a) => a.archetype === selectedArchetype);
    }, [archetypes, selectedArchetype]);

    // Calculate card dimensions based on container and screen size
    const cardWidth = useMemo(() => {
      if (isMobile) return Math.min(280, width - 40);
      const isLargeContainer = width >= 1100;
      return isLargeContainer ? 340 : 380;
    }, [isMobile, width]);

    // Memoize colors
    const colors = useMemo(
      () => ({
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
        border: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.7),
        headerColor: hexColorToCSS(KOREAN_COLORS.ACCENT_GOLD),
      }),
      []
    );

    // Handle card selection
    const handleCardSelect = useCallback(
      (archetype: PlayerArchetype) => {
        onArchetypeChange(archetype);
        onPlaySFX("menu_hover");
      },
      [onArchetypeChange, onPlaySFX]
    );

    // Handle card confirmation
    const handleCardConfirm = useCallback(
      (archetype: PlayerArchetype) => {
        onArchetypeConfirm?.(archetype);
        onPlaySFX("menu_select");
      },
      [onArchetypeConfirm, onPlaySFX]
    );

    // Handle keyboard navigation (scoped to container)
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          const newIndex =
            selectedIndex === 0 ? archetypes.length - 1 : selectedIndex - 1;
          const newArchetype = archetypes[newIndex].archetype;
          handleCardSelect(newArchetype);
        } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          const newIndex = (selectedIndex + 1) % archetypes.length;
          const newArchetype = archetypes[newIndex].archetype;
          handleCardSelect(newArchetype);
        } else if (event.key === "Enter") {
          event.preventDefault();
          if (onArchetypeConfirm) {
            handleCardConfirm(selectedArchetype);
          }
        }
      },
      [
        selectedIndex,
        archetypes,
        selectedArchetype,
        handleCardSelect,
        handleCardConfirm,
        onArchetypeConfirm,
      ]
    );

    // Calculate grid layout
    const columnsCount = isMobile ? 1 : width >= 1400 ? 3 : 2;
    const gap = isMobile ? 16 : 20;

    // Custom focus style for keyboard navigation
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: `${width}px`,
          minHeight: `${height}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: `${gap}px`,
          background: colors.background,
          borderRadius: "12px",
          border: `2px solid ${colors.border}`,
          padding: isMobile ? "16px" : "24px",
          overflow: "auto",
          maxHeight: `${height}px`,
          outline: isFocused ? `3px solid ${colors.headerColor}` : "none",
          outlineOffset: "2px",
        }}
        data-testid="archetype-card-grid"
        role="region"
        aria-label="Archetype selection grid"
      >
        {/* Header */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            marginBottom: `${gap / 2}px`,
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "20px" : "28px",
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
              color: colors.headerColor,
              margin: 0,
              textAlign: "center",
            }}
            data-testid="grid-header"
          >
            원형 선택 | Select Archetype
          </h2>

          <div
            style={{
              fontSize: isMobile ? "12px" : "14px",
              fontFamily: FONT_FAMILY.KOREAN,
              color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY),
              textAlign: "center",
              fontStyle: "italic",
            }}
            data-testid="grid-hint"
          >
            {isMobile
              ? "카드를 탭하여 선택"
              : "화살표 키로 탐색, 엔터로 확인 | Arrow keys to navigate, Enter to confirm"}
          </div>
        </div>

        {/* Card Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
            gap: `${gap}px`,
            width: "100%",
            justifyItems: "center",
          }}
          data-testid="card-grid-container"
        >
          {archetypes.map((archetype) => (
            <ArchetypeCard
              key={archetype.id}
              data={archetype}
              isSelected={archetype.archetype === selectedArchetype}
              onSelect={() => handleCardSelect(archetype.archetype)}
              onConfirm={
                onArchetypeConfirm
                  ? () => handleCardConfirm(archetype.archetype)
                  : undefined
              }
              isMobile={isMobile}
              width={cardWidth}
              showSelectButton={!!onArchetypeConfirm}
            />
          ))}
        </div>

        {/* Footer navigation hint */}
        {!isMobile && (
          <div
            style={{
              marginTop: `${gap}px`,
              fontSize: "12px",
              fontFamily: FONT_FAMILY.KOREAN,
              color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY),
              textAlign: "center",
              fontStyle: "italic",
            }}
            data-testid="grid-footer"
          >
            ← → 또는 ↑ ↓ 키로 원형 변경 | Use ← → or ↑ ↓ keys to change
            archetype
          </div>
        )}
      </div>
    );
  }
);

ArchetypeCardGrid.displayName = "ArchetypeCardGrid";

export default ArchetypeCardGrid;
