import React, { useMemo } from "react";
import type { KoreanTitleProps } from "../../../../../types";
import {
  KOREAN_FONT_SIZES,
  KOREAN_FONT_WEIGHTS,
  KOREAN_COLORS,
  FONT_FAMILY,
} from "../../../../../types/constants";

export const KoreanTitle: React.FC<KoreanTitleProps> = ({
  korean,
  english,
  subtitle,
  level = 1,
  // showLogo, // Not directly used in this text-based component
  style: customStyle,
  // onBackButtonClick, // Not handled here
  className,
  ...props
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const titleFontSize = useMemo(() => {
    if (typeof props.size === "number") return props.size;
    const sizeKey = (props.size ||
      (level === 1
        ? "title"
        : level === 2
        ? "xlarge"
        : "large")) as keyof typeof KOREAN_FONT_SIZES;
    return KOREAN_FONT_SIZES[sizeKey] || KOREAN_FONT_SIZES.large;
  }, [level, props.size]);

  const titleStyle: React.CSSProperties = useMemo(
    () => ({
      fontFamily: FONT_FAMILY.PRIMARY,
      fontSize: titleFontSize,
      fontWeight: KOREAN_FONT_WEIGHTS.bold,
      color: props.color?.toString() || KOREAN_COLORS.TEXT_PRIMARY.toString(16), // Ensure color is string
      margin: 0,
      ...customStyle,
    }),
    [titleFontSize, props.color, customStyle]
  );

  const subtitleStyle: React.CSSProperties = useMemo(
    () => ({
      fontFamily: FONT_FAMILY.SECONDARY,
      fontSize: KOREAN_FONT_SIZES.medium,
      fontWeight: KOREAN_FONT_WEIGHTS.regular,
      color: KOREAN_COLORS.TEXT_SECONDARY.toString(16), // Use existing color
      marginTop: "0.25em",
      marginBottom: "0.5em",
    }),
    []
  );

  return (
    <div className={className} {...props}>
      <Tag style={titleStyle}>{korean}</Tag>
      {english && (
        <p
          style={{
            ...subtitleStyle,
            fontSize: KOREAN_FONT_SIZES.small,
            marginTop: "-0.25em",
            marginBottom: "0.5em",
          }}
        >
          {english}
        </p>
      )}
      {subtitle && (
        <p style={subtitleStyle}>
          {typeof subtitle === "string" ? subtitle : subtitle.korean}
        </p>
      )}
    </div>
  );
};

export default KoreanTitle;
