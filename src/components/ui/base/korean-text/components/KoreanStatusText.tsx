import React from "react";
import type { KoreanStatusTextProps } from "../../../../../types";
import { KoreanText } from "./KoreanText";
import { KOREAN_COLORS } from "../../../../../types/constants";

const getStatusColor = (
  statusKey: KoreanStatusTextProps["statusKey"],
  value: number,
  maxValue: number,
  criticalThreshold?: number,
  warningThreshold?: number
): string | number => {
  const percentage = maxValue > 0 ? value / maxValue : 0;

  if (criticalThreshold !== undefined && percentage <= criticalThreshold) {
    return KOREAN_COLORS.NEGATIVE_RED;
  }
  if (warningThreshold !== undefined && percentage <= warningThreshold) {
    return KOREAN_COLORS.WARNING_ORANGE;
  }

  if (statusKey.startsWith("health")) return KOREAN_COLORS.POSITIVE_GREEN;
  if (statusKey.startsWith("ki")) return KOREAN_COLORS.PRIMARY_BLUE;
  if (statusKey.startsWith("stamina")) return KOREAN_COLORS.SECONDARY_YELLOW;
  if (statusKey === "pain") return KOREAN_COLORS.WARNING_ORANGE;
  if (statusKey === "stunned") return KOREAN_COLORS.STATUS_STUNNED_YELLOW;
  if (statusKey === "bleeding") return KOREAN_COLORS.NEGATIVE_RED_LIGHT;

  // Fallback colors for general statuses
  if (statusKey.includes("critical") || statusKey.includes("failure"))
    return KOREAN_COLORS.NEGATIVE_RED;
  if (
    statusKey.includes("warning") ||
    statusKey.includes("low") ||
    statusKey.includes("depleted")
  )
    return KOREAN_COLORS.WARNING_YELLOW;
  if (
    statusKey.includes("success") ||
    statusKey.includes("ready") ||
    statusKey.includes("active")
  )
    return KOREAN_COLORS.POSITIVE_GREEN;

  return KOREAN_COLORS.TEXT_SECONDARY; // Default color
};

export const KoreanStatusText: React.FC<KoreanStatusTextProps> = ({
  korean, // This prop might be the label or part of the statusKey's translation
  statusKey,
  value,
  maxValue,
  showPercentage = false,
  criticalThreshold = 0.2, // Default 20%
  warningThreshold = 0.5, // Default 50%
  ...props
}) => {
  // const statusInfo = KOREAN_STATUS_TRANSLATIONS[statusKey] || { korean: statusKey, english: statusKey }; // Fallback if not found
  const statusInfo = {
    korean: typeof korean === "string" ? korean : korean.korean,
    english:
      typeof korean === "string"
        ? props.english || statusKey
        : korean.english || statusKey,
  };

  let displayValue = `${value}/${maxValue}`;
  if (showPercentage) {
    const percentage = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
    displayValue = `${percentage}% (${value}/${maxValue})`;
  }

  const color = getStatusColor(
    statusKey,
    value,
    maxValue,
    criticalThreshold,
    warningThreshold
  );

  return (
    <KoreanText
      korean={`${statusInfo.korean}: ${displayValue}`}
      english={props.english ? `${props.english}: ${displayValue}` : undefined}
      color={color}
      variant="status"
      {...props}
    />
  );
};
