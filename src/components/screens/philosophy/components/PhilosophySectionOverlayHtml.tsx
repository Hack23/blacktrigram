import React, { ReactNode } from "react";
import { KOREAN_COLORS } from "../../../../types/constants/colors";
import { hexToRgbaString } from "../../../../utils/colorUtils";

export interface PhilosophySectionProps {
  readonly title: {
    readonly korean: string;
    readonly english: string;
  };
  readonly children: ReactNode;
  readonly borderColor?: number;
  readonly isMobile?: boolean;
  readonly testId?: string;
}

/**
 * Philosophy Section Container Component
 * 
 * **Korean**: 철학 섹션 컨테이너
 * 
 * Reusable container for philosophy screen sections with:
 * - Bilingual title (Korean | English)
 * - Customizable border color
 * - Glassmorphic background styling
 * - Responsive padding and spacing
 * - Consistent Korean cyberpunk aesthetic
 * 
 * Features:
 * - Korean theming with gradient borders
 * - Smooth shadow effects
 * - Mobile-optimized layout
 * - Semantic HTML structure
 * 
 * @example
 * ```typescript
 * <PhilosophySection
 *   title={{ korean: "팔괘 철학", english: "Trigram Philosophy" }}
 *   borderColor={KOREAN_COLORS.PRIMARY_CYAN}
 *   isMobile={false}
 * >
 *   <TrigramGrid />
 * </PhilosophySection>
 * ```
 * 
 * @category Philosophy Components
 */
export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  title,
  children,
  borderColor = KOREAN_COLORS.PRIMARY_CYAN,
  isMobile = false,
  testId,
}) => {
  const colors = {
    background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.8),
    border: `#${borderColor.toString(16).padStart(6, "0")}`,
    titleGold: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
    titleSecondary: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
  };

  return (
    <section
      style={{
        marginBottom: isMobile ? "20px" : "30px",
        background: colors.background,
        backdropFilter: "blur(8px)",
        borderRadius: "12px",
        border: `2px solid ${colors.border}`,
        padding: isMobile ? "15px" : "20px",
        boxShadow: `0 4px 20px ${hexToRgbaString(borderColor, 0.2)}`,
      }}
      data-testid={testId}
    >
      {/* Section header */}
      <header
        style={{
          marginBottom: isMobile ? "15px" : "20px",
          paddingBottom: isMobile ? "10px" : "15px",
          borderBottom: `2px solid ${hexToRgbaString(borderColor, 0.4)}`,
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "bold",
            color: colors.titleGold,
            margin: "0 0 6px 0",
            textShadow: `0 0 10px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.4)}`,
          }}
        >
          {title.korean}
        </h2>
        <p
          style={{
            fontSize: isMobile ? "14px" : "16px",
            color: colors.titleSecondary,
            margin: 0,
            fontStyle: "italic",
          }}
        >
          {title.english}
        </p>
      </header>

      {/* Section content */}
      <div>{children}</div>
    </section>
  );
};

export default PhilosophySection;
