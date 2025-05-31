import {
  KOREAN_COLORS,
  KOREAN_FONT_FAMILY,
  TRIGRAM_DATA,
  type ProgressTrackerProps,
} from "../../types";

export function ProgressTracker({
  label,
  current,
  maximum,
  currentStance,
}: ProgressTrackerProps): React.ReactElement {
  const percentage = Math.round((current / maximum) * 100);
  const barColor = currentStance
    ? `#${TRIGRAM_DATA[currentStance].color.toString(16).padStart(6, "0")}`
    : `#${KOREAN_COLORS.CYAN.toString(16).padStart(6, "0")}`;

  return (
    <div
      className="progress-tracker"
      style={{
        marginBottom: "0.8rem",
        width: "100%",
        color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
        fontFamily: KOREAN_FONT_FAMILY,
      }}
    >
      {/* Label */}
      <div
        className="progress-label"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.3rem",
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            color: `#${KOREAN_COLORS.WHITE.toString(16).padStart(6, "0")}`,
            fontFamily: KOREAN_FONT_FAMILY,
            fontWeight: "bold",
          }}
        >
          {label}
        </span>

        <span
          style={{
            fontSize: "0.75rem",
            color: `#${KOREAN_COLORS.GRAY_LIGHT.toString(16).padStart(6, "0")}`,
            fontFamily: KOREAN_FONT_FAMILY,
          }}
        >
          {current}/{maximum}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "12px",
          background: `#${KOREAN_COLORS.GRAY_DARK.toString(16).padStart(
            6,
            "0"
          )}`,
          borderRadius: "6px",
          border: `1px solid #${KOREAN_COLORS.GOLD.toString(16).padStart(
            6,
            "0"
          )}`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Progress Fill */}
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
            borderRadius: "5px",
            transition: "width 0.3s ease",
            position: "relative",
          }}
        >
          {/* Glow effect for full bars */}
          {percentage > 90 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent, ${barColor}44, transparent)`,
                animation: "pulse 2s infinite",
              }}
            />
          )}
        </div>

        {/* Low value warning */}
        {percentage < 25 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(90deg, #${KOREAN_COLORS.Red.toString(
                16
              ).padStart(6, "0")}44, transparent)`,
              animation: "pulse 1s infinite",
            }}
          />
        )}
      </div>

      {/* Stance indicator if applicable */}
      <div
        className="progress-info"
        style={{
          marginTop: "0.2rem",
          fontSize: "0.7rem",
          color: `#${KOREAN_COLORS.CYAN.toString(16).padStart(6, "0")}`,
          fontFamily: KOREAN_FONT_FAMILY,
        }}
      >
        {currentStance && (
          <div>
            현재 자세: {TRIGRAM_DATA[currentStance].korean}{" "}
            {TRIGRAM_DATA[currentStance].symbol}
          </div>
        )}
      </div>
    </div>
  );
}
