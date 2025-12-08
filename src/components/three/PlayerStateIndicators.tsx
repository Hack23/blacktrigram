/**
 * PlayerStateIndicators - Html overlay for player stats
 * 
 * Displays health, stamina, Ki, balance state, and other combat metrics
 * as an Html overlay above the 3D player model.
 * 
 * @module components/three/PlayerStateIndicators
 * @category 3D Components
 * @korean 플레이어상태표시기
 */

import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../types/constants";
import type { PlayerStateIndicatorsProps, BalanceState } from "../../types/player-visual";
import { toHexColor } from "../../utils/colorHelpers";

/**
 * Get color for balance state
 * 
 * @param balance - Current balance state
 * @returns CSS color string
 * @korean 균형색상가져오기
 */
const getBalanceColor = (balance: BalanceState): string => {
  switch (balance) {
    case "READY":
      return "#00cc44"; // Green - ready for combat
    case "SHAKEN":
      return "#ffcc00"; // Yellow - slightly compromised
    case "VULNERABLE":
      return "#ff8800"; // Orange - significantly exposed
    case "HELPLESS":
      return "#cc0000"; // Red - complete vulnerability
    default:
      return "#00cc44";
  }
};

/**
 * Get Korean text for balance state
 * 
 * @param balance - Current balance state
 * @returns Korean text
 * @korean 균형한글가져오기
 */
const getBalanceText = (balance: BalanceState): string => {
  switch (balance) {
    case "READY":
      return "준비완료";
    case "SHAKEN":
      return "동요상태";
    case "VULNERABLE":
      return "취약상태";
    case "HELPLESS":
      return "무력상태";
    default:
      return "준비완료";
  }
};

/**
 * PlayerStateIndicators Component
 * 
 * Renders an Html overlay with health bar, stamina bar, Ki indicator,
 * balance state, and consciousness level.
 * 
 * @example
 * ```tsx
 * <PlayerStateIndicators
 *   health={85}
 *   maxHealth={100}
 *   stamina={60}
 *   ki={40}
 *   balance="READY"
 *   consciousness={100}
 *   isMobile={false}
 * />
 * ```
 * 
 * @korean 플레이어상태표시기컴포넌트
 */
export const PlayerStateIndicators: React.FC<PlayerStateIndicatorsProps> = ({
  health,
  maxHealth,
  stamina,
  ki,
  balance,
  consciousness,
  pain = 0,
  bloodLoss = 0,
  isMobile,
}) => {
  // Calculate percentages
  const healthPercent = useMemo(
    () => Math.max(0, Math.min(100, (health / maxHealth) * 100)),
    [health, maxHealth]
  );

  const staminaPercent = useMemo(
    () => Math.max(0, Math.min(100, stamina)),
    [stamina]
  );

  const kiPercent = useMemo(() => Math.max(0, Math.min(100, ki)), [ki]);

  const consciousnessPercent = useMemo(
    () => Math.max(0, Math.min(100, consciousness)),
    [consciousness]
  );

  // Responsive sizing
  const sizing = useMemo(
    () => ({
      width: isMobile ? "60px" : "80px",
      barHeight: isMobile ? "4px" : "6px",
      thinBarHeight: isMobile ? "3px" : "4px",
      fontSize: isMobile ? "8px" : "10px",
      gap: isMobile ? "2px" : "4px",
    }),
    [isMobile]
  );

  // Health bar color based on percentage
  const healthColor = useMemo(() => {
    if (healthPercent > 50) return "#00ff00"; // Green
    if (healthPercent > 25) return "#ffff00"; // Yellow
    return "#ff0000"; // Red
  }, [healthPercent]);

  // Balance state color
  const balanceColor = useMemo(() => getBalanceColor(balance), [balance]);
  const balanceTextKorean = useMemo(() => getBalanceText(balance), [balance]);

  return (
    <Html
      position={[0, 2.5, 0]}
      center
      distanceFactor={isMobile ? 15 : 10}
      occlude={false}
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: sizing.gap,
          minWidth: sizing.width,
          fontFamily: FONT_FAMILY.KOREAN,
        }}
        data-testid="player-state-indicators"
      >
        {/* Health bar */}
        <div
          style={{
            height: sizing.barHeight,
            background: "rgba(0,0,0,0.6)",
            borderRadius: "2px",
            overflow: "hidden",
            border: `1px solid ${toHexColor(KOREAN_COLORS.PRIMARY_CYAN)}`,
          }}
          data-testid="health-bar"
          title={`Health: ${health}/${maxHealth}`}
        >
          <div
            style={{
              width: `${healthPercent}%`,
              height: "100%",
              background: healthColor,
              transition: "width 0.3s ease, background-color 0.3s ease",
            }}
          />
        </div>

        {/* Stamina bar */}
        <div
          style={{
            height: sizing.thinBarHeight,
            background: "rgba(0,0,0,0.6)",
            borderRadius: "2px",
            overflow: "hidden",
            border: `1px solid ${toHexColor(KOREAN_COLORS.ACCENT_GOLD)}`,
          }}
          data-testid="stamina-bar"
          title={`Stamina: ${stamina}%`}
        >
          <div
            style={{
              width: `${staminaPercent}%`,
              height: "100%",
              background: toHexColor(KOREAN_COLORS.ACCENT_GOLD),
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Ki bar */}
        <div
          style={{
            height: sizing.thinBarHeight,
            background: "rgba(0,0,0,0.6)",
            borderRadius: "2px",
            overflow: "hidden",
            border: `1px solid ${toHexColor(KOREAN_COLORS.PRIMARY_CYAN)}`,
          }}
          data-testid="ki-bar"
          title={`Ki: ${ki}%`}
        >
          <div
            style={{
              width: `${kiPercent}%`,
              height: "100%",
              background: toHexColor(KOREAN_COLORS.PRIMARY_CYAN),
              transition: "width 0.3s ease",
              boxShadow:
                kiPercent > 80
                  ? `0 0 ${isMobile ? "4px" : "6px"} ${toHexColor(KOREAN_COLORS.PRIMARY_CYAN)}`
                  : "none",
            }}
          />
        </div>

        {/* Balance state indicator */}
        <div
          style={{
            fontSize: sizing.fontSize,
            color: balanceColor,
            textAlign: "center",
            fontWeight: "bold",
            textShadow: "0 0 4px rgba(0,0,0,0.8)",
            padding: "2px 4px",
            background: "rgba(0,0,0,0.4)",
            borderRadius: "2px",
          }}
          data-testid="balance-indicator"
          title={`Balance: ${balance}`}
        >
          {balanceTextKorean}
        </div>

        {/* Consciousness indicator (if below 100%) */}
        {consciousnessPercent < 100 && (
          <div
            style={{
              height: sizing.thinBarHeight,
              background: "rgba(0,0,0,0.6)",
              borderRadius: "2px",
              overflow: "hidden",
              border: `1px solid ${toHexColor(KOREAN_COLORS.CONSCIOUSNESS_PURPLE)}`,
            }}
            data-testid="consciousness-bar"
            title={`Consciousness: ${consciousness}%`}
          >
            <div
              style={{
                width: `${consciousnessPercent}%`,
                height: "100%",
                background: toHexColor(KOREAN_COLORS.CONSCIOUSNESS_PURPLE),
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}

        {/* Pain indicator (if above 20%) */}
        {pain > 20 && (
          <div
            style={{
              fontSize: sizing.fontSize,
              color: toHexColor(KOREAN_COLORS.PAIN_INDICATOR),
              textAlign: "center",
              fontWeight: "bold",
              textShadow: "0 0 4px rgba(0,0,0,0.8)",
            }}
            data-testid="pain-indicator"
            title={`Pain: ${pain}%`}
          >
            통증 {Math.round(pain)}%
          </div>
        )}

        {/* Blood loss indicator (if above 10%) */}
        {bloodLoss && bloodLoss > 10 && (
          <div
            style={{
              fontSize: sizing.fontSize,
              color: toHexColor(KOREAN_COLORS.BLOODLOSS_INDICATOR),
              textAlign: "center",
              fontWeight: "bold",
              textShadow: "0 0 4px rgba(0,0,0,0.8)",
            }}
            data-testid="bloodloss-indicator"
            title={`Blood Loss: ${bloodLoss}%`}
          >
            출혈 {Math.round(bloodLoss)}%
          </div>
        )}
      </div>
    </Html>
  );
};

export default PlayerStateIndicators;
