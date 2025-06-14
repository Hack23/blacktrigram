import React from "react";
import * as PIXI from "pixi.js";
import { usePixiExtensions } from "../../../../../utils/pixiExtensions";
import { KOREAN_COLORS } from "../../../../../types/constants";

export interface KoreanStatusTextProps {
  readonly status: "normal" | "warning" | "danger" | "success";
  readonly message: string;
  readonly value?: number;
  readonly maxValue?: number;
  readonly x?: number;
  readonly y?: number;
}

export const KoreanStatusText: React.FC<KoreanStatusTextProps> = ({
  status,
  message,
  value,
  maxValue,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  const getStatusColor = () => {
    switch (status) {
      case "warning":
        return KOREAN_COLORS.WARNING_ORANGE;
      case "danger":
        return KOREAN_COLORS.NEGATIVE_RED;
      case "success":
        return KOREAN_COLORS.POSITIVE_GREEN;
      default:
        return KOREAN_COLORS.TEXT_PRIMARY;
    }
  };

  const textStyle = new PIXI.TextStyle({
    fontSize: 14,
    fill: getStatusColor(),
    fontWeight: status === "danger" ? "bold" : "normal",
  });

  const displayText =
    value !== undefined && maxValue !== undefined
      ? `${message}: ${value}/${maxValue}`
      : message;

  return <pixiText text={displayText} style={textStyle} x={x} y={y} />;
};

export default KoreanStatusText;
