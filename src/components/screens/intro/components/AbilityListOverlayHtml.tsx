/**
 * AbilityList - Enhanced ability list component with Korean theming
 * 
 * Refactored to use useKoreanTheme hook for consistent styling
 * Displays a list of special abilities with bilingual support
 * 
 * Performance optimized with React.memo and useMemo
 * 
 * @module components/screens/intro
 * @category Intro UI
 * @korean 능력리스트
 */

import React, { useMemo } from "react";
import { useKoreanTheme } from "../../../shared/base/useKoreanTheme";
import { KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString, hexColorToCSS } from "../../../../utils/colorUtils";

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
 * 
 * Refactored to use useKoreanTheme for consistent Korean theming:
 * - Uses Korean typography configuration
 * - Applies Korean color palette
 * - Responsive sizing based on device type
 * - Memoized for optimal performance
 * 
 * Used in archetype cards to show key techniques and skills
 * 
 * @example
 * ```tsx
 * <AbilityList
 *   abilities={[
 *     { korean: "급소격", english: "Vital Strike" },
 *     { korean: "연격", english: "Chain Attack" }
 *   ]}
 *   color={KOREAN_COLORS.PRIMARY_CYAN}
 *   isMobile={false}
 * />
 * ```
 */
export const AbilityList: React.FC<AbilityListProps> = React.memo(
  ({ abilities, maxAbilities = 3, color = KOREAN_COLORS.ACCENT_GOLD, isMobile = false }) => {
    const { koreanTypography, calculateResponsiveSize, fontFamily } = useKoreanTheme({
      size: "small",
      isMobile,
    });

    const normalizedAbilities = useMemo(() => {
      return abilities.slice(0, maxAbilities).map((ability, index) => {
        if (typeof ability === "string") {
          return {
            id: `ability-${index}`,
            english: ability,
            korean: ability, // TEMPORARY: English used as Korean fallback
          };
        } else {
          return {
            id: `ability-${index}`,
            english: ability.english,
            korean: ability.korean,
            description: ability.description,
          };
        }
      });
    }, [abilities, maxAbilities]);

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

    const fontSize = calculateResponsiveSize(isMobile ? 10 : 12);
    const descFontSize = calculateResponsiveSize(isMobile ? 8 : 10);
    const padding = isMobile ? `${calculateResponsiveSize(6)}px ${calculateResponsiveSize(10)}px` : `${calculateResponsiveSize(8)}px ${calculateResponsiveSize(12)}px`;

    if (normalizedAbilities.length === 0) {
      return null;
    }

    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: `${calculateResponsiveSize(8)}px`,
        }}
        data-testid="ability-list"
      >
        {/* Header with Korean typography */}
        <div
          style={{
            fontSize: `${calculateResponsiveSize(isMobile ? 12 : 14)}px`,
            fontWeight: "bold",
            fontFamily: fontFamily.KOREAN,
            color: colors.abilityText,
            lineHeight: koreanTypography.lineHeight,
            letterSpacing: koreanTypography.letterSpacing,
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
            gap: `${calculateResponsiveSize(6)}px`,
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
                gap: `${calculateResponsiveSize(4)}px`,
              }}
              data-testid={ability.id}
            >
              {/* Ability name with Korean typography */}
              <div
                style={{
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                  fontFamily: fontFamily.KOREAN,
                  color: colors.abilityText,
                  lineHeight: koreanTypography.lineHeight,
                  letterSpacing: koreanTypography.letterSpacing,
                  wordBreak: koreanTypography.wordBreak,
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
                    fontFamily: fontFamily.KOREAN,
                    color: colors.descriptionText,
                    lineHeight: koreanTypography.lineHeight,
                    letterSpacing: koreanTypography.letterSpacing,
                    wordBreak: koreanTypography.wordBreak,
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
