import React from "react";
import type { KoreanTextProps } from "../../../../types"; // Assuming KoreanTextType is the object form
import {
  KOREAN_FONT_FAMILY,
  KOREAN_TEXT_SIZES,
  KOREAN_FONT_WEIGHTS, // Corrected: Was KOREAN_TEXT_WEIGHTS
} from "../../../../types/constants";

export const KoreanText: React.FC<KoreanTextProps> = ({
  korean,
  english,
  size = "medium",
  weight = "regular",
  color,
  emphasis = "none",
  align = "left",
  className,
  style: customStyle,
}) => {
  // Determine the text content to render
  // If 'korean' is an object, use its 'korean' property, otherwise use 'korean' as is (if string)
  const textToRender = typeof korean === "string" ? korean : korean.korean;
  const titleAttribute =
    typeof korean === "string" ? english : korean.english || english;

  const fontSize = typeof size === "number" ? size : KOREAN_TEXT_SIZES[size];

  // Ensure weight is a key of KOREAN_FONT_WEIGHTS or a number
  let resolvedFontWeight: string | number;
  if (typeof weight === "number") {
    resolvedFontWeight = weight;
  } else if (
    weight &&
    KOREAN_FONT_WEIGHTS[weight as keyof typeof KOREAN_FONT_WEIGHTS]
  ) {
    resolvedFontWeight =
      KOREAN_FONT_WEIGHTS[weight as keyof typeof KOREAN_FONT_WEIGHTS];
  } else {
    resolvedFontWeight = KOREAN_FONT_WEIGHTS.regular;
  }

  const styles: React.CSSProperties = {
    fontFamily: KOREAN_FONT_FAMILY,
    fontSize: `${fontSize}px`,
    fontWeight: resolvedFontWeight,
    textAlign: align,
    // Convert color to string if it's a number (hex value)
    color:
      typeof color === "number"
        ? `#${color.toString(16).padStart(6, "0")}`
        : color,
    ...customStyle,
  };

  if (emphasis === "bold") styles.fontWeight = KOREAN_FONT_WEIGHTS.bold;
  if (emphasis === "italic") styles.fontStyle = "italic";
  if (emphasis === "underline") styles.textDecoration = "underline";
  // Note: 'glow', 'shadow', 'outline' would require more complex CSS (e.g., text-shadow, filters) or SVG.

  // Variant-specific styling could be added here
  // Example: if (variant === 'title') { styles.color = KOREAN_COLORS.GOLD; }
  // This would require KOREAN_COLORS to be imported and used.

  return (
    <span
      className={className}
      style={styles}
      title={titleAttribute}
      data-testid="korean-text-component"
    >
      {textToRender} {/* Corrected: Ensure a string is rendered */}
    </span>
  );
};
