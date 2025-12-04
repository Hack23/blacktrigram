import React, { useMemo } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString, hexColorToCSS } from "../../../utils/colorUtils";

export interface Ability {
  readonly korean: string;
  readonly english: string;
  readonly description?: {
    readonly korean: string;
    readonly english: string;
  };
}

export interface AbilityListProps {
  readonly abilities: readonly string[] | readonly Ability[];
  readonly maxAbilities?: number; // Maximum abilities to show
  readonly color?: number; // Accent color for abilities
  readonly isMobile?: boolean;
}

/**
 * AbilityList component - Displays a list of special abilities
 * Used in archetype cards to show key techniques and skills
 */
export const AbilityList: React.FC<AbilityListProps> = React.memo(
  ({ abilities, maxAbilities = 3, color = KOREAN_COLORS.ACCENT_GOLD, isMobile = false }) => {
    // Normalize abilities to consistent format
    const normalizedAbilities = useMemo(() => {
      return abilities.slice(0, maxAbilities).map((ability, index) => {
        if (typeof ability === "string") {
          // TEMPORARY: This fallback violates PRIO 2 bilingual support guidelines.
          // All abilities should use the object format with Korean/English fields.
          // See: src/systems/types.ts PLAYER_ARCHETYPES_DATA for correct format.
          // Replace with proper bilingual objects as soon as translations are available.
          return {
            id: `ability-${index}`,
            english: ability,
            korean: ability, // TEMPORARY: English used as Korean fallback
          };
        } else {
          // Object format with Korean/English
          return {
            id: `ability-${index}`,
            english: ability.english,
            korean: ability.korean,
            description: ability.description,
          };
        }
      });
    }, [abilities, maxAbilities]);

    // Memoize color calculations
    const colors = useMemo(
      () => ({
        abilityBorder: hexToRgbaString(color, 0.5),
        abilityBackground: hexToRgbaString(
          KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          0.7
        ),
        abilityText: hexColorToCSS(color),
        descriptionText: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY),
      }),
      [color]
    );

    // Responsive sizing
    const fontSize = isMobile ? 10 : 12;
    const descFontSize = isMobile ? 8 : 10;
    const padding = isMobile ? "6px 10px" : "8px 12px";

    if (normalizedAbilities.length === 0) {
      return null;
    }

    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
        data-testid="ability-list"
      >
        {/* Header */}
        <div
          style={{
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
            color: colors.abilityText,
          }}
          data-testid="ability-list-header"
        >
          특수 능력 | Special Abilities
        </div>

        {/* Ability items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {normalizedAbilities.map((ability) => (
            <div
              key={ability.id}
              style={{
                padding,
                background: colors.abilityBackground,
                border: `1px solid ${colors.abilityBorder}`,
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
              data-testid={ability.id}
            >
              {/* Ability name */}
              <div
                style={{
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                  fontFamily: FONT_FAMILY.KOREAN,
                  color: colors.abilityText,
                }}
                data-testid={`${ability.id}-name`}
              >
                {ability.korean} | {ability.english}
              </div>

              {/* Ability description (if available) */}
              {ability.description && (
                <div
                  style={{
                    fontSize: `${descFontSize}px`,
                    fontStyle: "italic",
                    fontFamily: FONT_FAMILY.KOREAN,
                    color: colors.descriptionText,
                    lineHeight: "1.3",
                  }}
                  data-testid={`${ability.id}-description`}
                >
                  {ability.description.korean}
                  {ability.description.english && (
                    <>
                      <br />
                      {ability.description.english}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

AbilityList.displayName = "AbilityList";

export default AbilityList;
