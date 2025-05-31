import { useState } from "react";
import { KOREAN_COLORS, KOREAN_FONT_FAMILY } from "../../../types";

export interface BaseButtonProps {
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
  readonly variant?: "primary" | "secondary" | "danger" | "success";
  readonly size?: "small" | "medium" | "large";
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly koreanText?: string;
  readonly englishText?: string;
  readonly icon?: string;
  readonly style?: React.CSSProperties;
}

export function BaseButton({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  koreanText,
  englishText,
  icon,
  style = {},
}: BaseButtonProps): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getVariantColors = () => {
    switch (variant) {
      case "primary":
        return {
          background: `#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`,
          color: `#${KOREAN_COLORS.BLACK.toString(16).padStart(6, "0")}`,
          border: `#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`,
          hoverBackground: `#${KOREAN_COLORS.CYAN.toString(16).padStart(
            6,
            "0"
          )}`,
          hoverColor: `#${KOREAN_COLORS.BLACK.toString(16).padStart(6, "0")}`,
        };
      case "secondary":
        return {
          background: `#${KOREAN_COLORS.ACCENT_BLUE.toString(16).padStart(
            6,
            "0"
          )}`,
          color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
          border: `#${KOREAN_COLORS.CYAN.toString(16).padStart(6, "0")}`,
          hoverBackground: `#${KOREAN_COLORS.CYAN.toString(16).padStart(
            6,
            "0"
          )}`,
          hoverColor: `#${KOREAN_COLORS.BLACK.toString(16).padStart(6, "0")}`,
        };
      case "danger":
        return {
          background: `#${KOREAN_COLORS.Red.toString(16).padStart(6, "0")}`,
          color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
          border: `#${KOREAN_COLORS.Red.toString(16).padStart(6, "0")}`,
          hoverBackground: `#${KOREAN_COLORS.CRITICAL_RED.toString(16).padStart(
            6,
            "0"
          )}`,
          hoverColor: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
        };
      case "success":
        return {
          background: `#${KOREAN_COLORS.Green.toString(16).padStart(6, "0")}`,
          color: `#${KOREAN_COLORS.BLACK.toString(16).padStart(6, "0")}`,
          border: `#${KOREAN_COLORS.Green.toString(16).padStart(6, "0")}`,
          hoverBackground: `#${KOREAN_COLORS.CYAN.toString(16).padStart(
            6,
            "0"
          )}`,
          hoverColor: `#${KOREAN_COLORS.BLACK.toString(16).padStart(6, "0")}`,
        };
      default:
        return {
          background: `#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`,
          color: `#${KOREAN_COLORS.BLACK.toString(16).padStart(6, "0")}`,
          border: `#${KOREAN_COLORS.GOLD.toString(16).padStart(6, "0")}`,
          hoverBackground: `#${KOREAN_COLORS.CYAN.toString(16).padStart(
            6,
            "0"
          )}`,
          hoverColor: `#${KOREAN_COLORS.BLACK.toString(16).padStart(6, "0")}`,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          padding: "0.4rem 0.8rem",
          fontSize: "0.8rem",
        };
      case "large":
        return {
          padding: "1rem 2rem",
          fontSize: "1.1rem",
        };
      default:
        return {
          padding: "0.7rem 1.5rem",
          fontSize: "1rem",
        };
    }
  };

  const colors = getVariantColors();
  const sizeStyles = getSizeStyles();

  const buttonStyle: React.CSSProperties = {
    fontFamily: KOREAN_FONT_FAMILY,
    border: `2px solid ${colors.border}`,
    borderRadius: "6px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    fontWeight: "bold",
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    background: disabled
      ? `#${KOREAN_COLORS.GRAY_DARK.toString(16).padStart(6, "0")}`
      : isPressed
      ? colors.hoverBackground
      : isHovered
      ? colors.hoverBackground
      : colors.background,
    color: disabled
      ? `#${KOREAN_COLORS.GRAY_LIGHT.toString(16).padStart(6, "0")}`
      : isPressed || isHovered
      ? colors.hoverColor
      : colors.color,
    opacity: disabled ? 0.6 : 1,
    transform: isPressed ? "scale(0.98)" : "scale(1)",
    boxShadow: isHovered && !disabled ? `0 0 10px ${colors.border}66` : "none",
    ...sizeStyles,
    ...style,
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled}
    >
      {/* Loading spinner */}
      {loading && (
        <span
          style={{
            display: "inline-block",
            width: "1rem",
            height: "1rem",
            border: `2px solid ${colors.color}33`,
            borderTop: `2px solid ${colors.color}`,
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
      )}

      {/* Icon */}
      {icon && !loading && <span style={{ fontSize: "1.2em" }}>{icon}</span>}

      {/* Button content */}
      <span>
        {koreanText && englishText ? (
          <div style={{ textAlign: "center" }}>
            <div>{koreanText}</div>
            <div
              style={{
                fontSize: "0.8em",
                opacity: 0.8,
                fontStyle: "italic",
              }}
            >
              {englishText}
            </div>
          </div>
        ) : (
          children
        )}
      </span>
    </button>
  );
}

// Add CSS animation for loading spinner
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject the CSS if it doesn't exist
if (
  typeof document !== "undefined" &&
  !document.getElementById("button-animations")
) {
  const style = document.createElement("style");
  style.id = "button-animations";
  style.textContent = spinKeyframes;
  document.head.appendChild(style);
}
