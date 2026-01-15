/**
 * Performance Debug Overlay
 *
 * Shows real-time animation performance metrics in development mode.
 * Displays frame times, cache hit rate, and object pool status.
 *
 * Only visible in development mode.
 *
 * @module components/shared/debug/PerformanceDebugOverlayHtml
 * @category Debug
 * @korean 성능디버그오버레이
 */

import React, { useEffect, useState } from "react";
import { performanceMonitor } from "../../../systems/animation";
import { ThreeObjectPools } from "../../../utils/threeObjectPool";
import { KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";

/**
 * Performance metrics interface
 * @korean 성능지표
 */
interface PerformanceMetrics {
  avgFrameTime: number;
  maxFrameTime: number;
  cacheHitRate: number;
  cacheEntries: number;
}

/**
 * Pool status interface
 * @korean 풀상태
 */
interface PoolStatus {
  euler: number;
  vector3: number;
  matrix4: number;
  quaternion: number;
}

/**
 * Performance Debug Overlay Component
 *
 * Shows real-time animation performance metrics:
 * - Average/max frame times
 * - Cache hit rate
 * - Object pool utilization
 *
 * Only renders in development mode.
 *
 * @returns Performance overlay or null in production
 * @korean 성능디버그오버레이컴포넌트
 */
export const PerformanceDebugOverlayHtml: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    avgFrameTime: 0,
    maxFrameTime: 0,
    cacheHitRate: 0,
    cacheEntries: 0,
  });
  const [pools, setPools] = useState<PoolStatus>({
    euler: 0,
    vector3: 0,
    matrix4: 0,
    quaternion: 0,
  });

  useEffect(() => {
    // Update metrics every second
    const interval = setInterval(() => {
      const newMetrics = performanceMonitor.getMetrics();
      setMetrics({
        avgFrameTime: newMetrics.avgFrameTime,
        maxFrameTime: newMetrics.maxFrameTime,
        cacheHitRate: newMetrics.cacheHitRate,
        cacheEntries: newMetrics.cacheEntries,
      });
      setPools(ThreeObjectPools.getStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  // Color coding for frame times using KOREAN_COLORS
  const frameTimeColor =
    metrics.avgFrameTime < 5
      ? `#${KOREAN_COLORS.POSITIVE_GREEN.toString(16).padStart(6, "0")}` // Green: Target met
      : metrics.avgFrameTime < 8
      ? `#${KOREAN_COLORS.WARNING_YELLOW.toString(16).padStart(6, "0")}` // Yellow: Warning
      : `#${KOREAN_COLORS.ACCENT_RED.toString(16).padStart(6, "0")}`; // Red: Critical

  const cacheColor =
    metrics.cacheHitRate > 0.9
      ? `#${KOREAN_COLORS.POSITIVE_GREEN.toString(16).padStart(6, "0")}` // Green: Excellent
      : metrics.cacheHitRate > 0.7
      ? `#${KOREAN_COLORS.WARNING_YELLOW.toString(16).padStart(6, "0")}` // Yellow: Good
      : `#${KOREAN_COLORS.ACCENT_RED.toString(16).padStart(6, "0")}`; // Red: Poor
  
  const poolColor = (available: number, threshold: number) =>
    available > threshold
      ? `#${KOREAN_COLORS.POSITIVE_GREEN.toString(16).padStart(6, "0")}`
      : `#${KOREAN_COLORS.WARNING_YELLOW.toString(16).padStart(6, "0")}`;

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.85),
        color: `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`,
        padding: "12px",
        fontFamily: "monospace",
        fontSize: "11px",
        lineHeight: "1.4",
        zIndex: 9999,
        border: `1px solid #${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`,
        borderRadius: "4px",
        minWidth: "200px",
        userSelect: "none",
        pointerEvents: "none",
      }}
      data-testid="performance-debug-overlay"
    >
      <div style={{ fontWeight: "bold", marginBottom: "8px", color: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}` }}>
        🎯 Animation Performance
      </div>
      <div style={{ borderBottom: `1px solid #${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`, marginBottom: "6px" }} />

      {/* Frame Times */}
      <div style={{ marginBottom: "4px" }}>
        <span style={{ color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}` }}>Avg Frame: </span>
        <span style={{ color: frameTimeColor, fontWeight: "bold" }}>
          {metrics.avgFrameTime.toFixed(2)}ms
        </span>
        <span style={{ color: `#${KOREAN_COLORS.UI_BACKGROUND_LIGHT.toString(16).padStart(6, "0")}`, fontSize: "9px", marginLeft: "4px" }}>
          (target: &lt;5ms)
        </span>
      </div>
      <div style={{ marginBottom: "6px" }}>
        <span style={{ color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}` }}>Max Frame: </span>
        <span style={{ color: frameTimeColor }}>
          {metrics.maxFrameTime.toFixed(2)}ms
        </span>
      </div>

      {/* Cache Performance */}
      <div style={{ marginBottom: "4px" }}>
        <span style={{ color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}` }}>Cache Hit: </span>
        <span style={{ color: cacheColor, fontWeight: "bold" }}>
          {(metrics.cacheHitRate * 100).toFixed(1)}%
        </span>
        <span style={{ color: `#${KOREAN_COLORS.UI_BACKGROUND_LIGHT.toString(16).padStart(6, "0")}`, fontSize: "9px", marginLeft: "4px" }}>
          (target: &gt;90%)
        </span>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <span style={{ color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}` }}>Cached: </span>
        <span>{metrics.cacheEntries} keyframes</span>
      </div>

      <div style={{ borderBottom: `1px solid #${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`, marginBottom: "6px" }} />

      {/* Object Pools */}
      <div style={{ fontSize: "10px", color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`, marginBottom: "4px" }}>
        Object Pools (available)
      </div>
      <div style={{ marginBottom: "2px" }}>
        <span style={{ color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}` }}>Euler: </span>
        <span style={{ color: poolColor(pools.euler, 100) }}>
          {pools.euler}
        </span>
      </div>
      <div style={{ marginBottom: "2px" }}>
        <span style={{ color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}` }}>Vector3: </span>
        <span style={{ color: poolColor(pools.vector3, 100) }}>
          {pools.vector3}
        </span>
      </div>
      <div style={{ marginBottom: "2px" }}>
        <span style={{ color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}` }}>Matrix4: </span>
        <span style={{ color: poolColor(pools.matrix4, 50) }}>
          {pools.matrix4}
        </span>
      </div>
      <div style={{ marginBottom: "2px" }}>
        <span style={{ color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}` }}>Quaternion: </span>
        <span style={{ color: poolColor(pools.quaternion, 50) }}>
          {pools.quaternion}
        </span>
      </div>

      {/* Performance Status */}
      <div
        style={{
          borderTop: `1px solid #${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, "0")}`,
          marginTop: "8px",
          paddingTop: "6px",
        }}
      >
        <div style={{ fontSize: "10px" }}>
          <span style={{ color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}` }}>Status: </span>
          {metrics.avgFrameTime < 5 && metrics.cacheHitRate > 0.9 ? (
            <span style={{ color: `#${KOREAN_COLORS.POSITIVE_GREEN.toString(16).padStart(6, "0")}`, fontWeight: "bold" }}>✓ OPTIMAL</span>
          ) : metrics.avgFrameTime < 8 && metrics.cacheHitRate > 0.7 ? (
            <span style={{ color: `#${KOREAN_COLORS.WARNING_YELLOW.toString(16).padStart(6, "0")}` }}>⚠ GOOD</span>
          ) : (
            <span style={{ color: `#${KOREAN_COLORS.ACCENT_RED.toString(16).padStart(6, "0")}` }}>✗ NEEDS OPTIMIZATION</span>
          )}
        </div>
      </div>
    </div>
  );
};
