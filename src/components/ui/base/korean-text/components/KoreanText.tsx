import React, { useMemo } from "react";
import type {
  KoreanTextProps,
  // KoreanText as KoreanTextType, // Unused
} from "../../../../../types";
import { useKoreanTextStyle } from "../hooks/useKoreanTextStyle"; // Assuming this hook returns CSSProperties or similar
import type { KoreanTextStyleOptions } from "./KoreanPixiTextUtils"; // For options type

export const KoreanText: React.FC<KoreanTextProps> = ({
  korean,
  english,
  size,
  weight,
  color,
  variant, // Used by useKoreanTextStyle
  emphasis,
  align,
  className,
  style: customStyle, // React CSSProperties
  children,
  ...props // Other HTML attributes
}) => {
  const textContent = typeof korean === "string" ? korean : korean.korean;
  const titleContent =
    typeof korean === "string" ? english : korean.english || english;

  // This hook is for PIXI styles. For React DOM, we need a CSS properties hook or direct styling.
  // For simplicity, we'll pass some props directly to style or use className.
  // const pixiStyleOptions: KoreanTextStyleOptions = { size, weight, color, variant, emphasis, align };
  // const resolvedPixiStyle = useKoreanTextStyle(pixiStyleOptions); // This returns PIXI.TextStyle

  // Create React CSSProperties based on props
  const reactStyle: React.CSSProperties = useMemo(() => {
    const style: React.CSSProperties = { ...customStyle };
    if (align) style.textAlign = align;
    if (color && typeof color === "string") style.color = color; // Only apply if string (hex/named color)
    // Size and weight would typically be handled by CSS classes or more complex logic
    // For example, mapping KoreanTextSize to font-size values
    // if (size && typeof size === 'string') style.fontSize = mapKoreanSizeToCSS(size);
    // if (weight) style.fontWeight = mapKoreanWeightToCSS(weight);
    return style;
  }, [customStyle, align, color, size, weight]);

  return (
    <span
      title={titleContent}
      className={className} // Apply className for CSS styling
      style={reactStyle} // Apply direct styles
      {...props}
    >
      {textContent}
      {children}
    </span>
  );
};

export default KoreanText;
