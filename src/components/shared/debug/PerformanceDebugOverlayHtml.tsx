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
import { hexToRgbaString, hexColorToCSS } from "../../../utils/colorUtils";

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
 * Optimized with React.memo for 60fps performance:
 * - Memoized to prevent parent re-renders from affecting it
 * - Internal state updates only via interval
 *
 * @returns Performance overlay or null in production
 * @korean 성능디버그오버레이컴포넌트
 */
export const PerformanceDebugOverlayHtml = React.memo(() => {
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
      ? hexColorToCSS(KOREAN_COLORS.POSITIVE_GREEN) // Green: Target met
      : metrics.avgFrameTime < 8
      ? hexColorToCSS(KOREAN_COLORS.WARNING_YELLOW) // Yellow: Warning
      : hexColorToCSS(KOREAN_COLORS.ACCENT_RED); // Red: Critical

  const cacheColor =
    metrics.cacheHitRate > 0.9
      ? hexColorToCSS(KOREAN_COLORS.POSITIVE_GREEN) // Green: Excellent
      : metrics.cacheHitRate > 0.7
      ? hexColorToCSS(KOREAN_COLORS.WARNING_YELLOW) // Yellow: Good
      : hexColorToCSS(KOREAN_COLORS.ACCENT_RED); // Red: Poor
  
  const poolColor = (available: number, threshold: number) =>
    available > threshold
      ? hexColorToCSS(KOREAN_COLORS.POSITIVE_GREEN)
      : hexColorToCSS(KOREAN_COLORS.WARNING_YELLOW);

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.85),
        color: hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN),
        padding: "12px",
        fontFamily: "monospace",
        fontSize: "11px",
        lineHeight: "1.4",
        zIndex: 9999,
        border: `1px solid ${hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN)}`,
        borderRadius: "4px",
        minWidth: "200px",
        userSelect: "none",
        pointerEvents: "none",
      }}
      data-testid="performance-debug-overlay"
    >
      <div style={{ fontWeight: "bold", marginBottom: "8px", color: hexColorToCSS(KOREAN_COLORS.TEXT_PRIMARY) }}>
        🎯 Animation Performance
      </div>
      <div style={{ borderBottom: `1px solid ${hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN)}`, marginBottom: "6px" }} />

      {/* Frame Times */}
      <div style={{ marginBottom: "4px" }}>
        <span style={{ color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY) }}>Avg Frame: </span>
        <span style={{ color: frameTimeColor, fontWeight: "bold" }}>
          {metrics.avgFrameTime.toFixed(2)}ms
        </span>
        <span style={{ color: hexColorToCSS(KOREAN_COLORS.UI_BACKGROUND_LIGHT), fontSize: "9px", marginLeft: "4px" }}>
          (target: &lt;5ms)
        </span>
      </div>
      <div style={{ marginBottom: "6px" }}>
        <span style={{ color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY) }}>Max Frame: </span>
        <span style={{ color: frameTimeColor }}>
          {metrics.maxFrameTime.toFixed(2)}ms
        </span>
      </div>

      {/* Cache Performance */}
      <div style={{ marginBottom: "4px" }}>
        <span style={{ color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY) }}>Cache Hit: </span>
        <span style={{ color: cacheColor, fontWeight: "bold" }}>
          {(metrics.cacheHitRate * 100).toFixed(1)}%
        </span>
        <span style={{ color: hexColorToCSS(KOREAN_COLORS.UI_BACKGROUND_LIGHT), fontSize: "9px", marginLeft: "4px" }}>
          (target: &gt;90%)
        </span>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <span style={{ color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY) }}>Cached: </span>
        <span>{metrics.cacheEntries} keyframes</span>
      </div>

      <div style={{ borderBottom: `1px solid ${hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN)}`, marginBottom: "6px" }} />

      {/* Object Pools */}
      <div style={{ fontSize: "10px", color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY), marginBottom: "4px" }}>
        Object Pools (available)
      </div>
      <div style={{ marginBottom: "2px" }}>
        <span style={{ color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY) }}>Euler: </span>
        <span style={{ color: poolColor(pools.euler, 100) }}>
          {pools.euler}
        </span>
      </div>
      <div style={{ marginBottom: "2px" }}>
        <span style={{ color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY) }}>Vector3: </span>
        <span style={{ color: poolColor(pools.vector3, 100) }}>
          {pools.vector3}
        </span>
      </div>
      <div style={{ marginBottom: "2px" }}>
        <span style={{ color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY) }}>Matrix4: </span>
        <span style={{ color: poolColor(pools.matrix4, 50) }}>
          {pools.matrix4}
        </span>
      </div>
      <div style={{ marginBottom: "2px" }}>
        <span style={{ color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY) }}>Quaternion: </span>
        <span style={{ color: poolColor(pools.quaternion, 50) }}>
          {pools.quaternion}
        </span>
      </div>

      {/* Performance Status */}
      <div
        style={{
          borderTop: `1px solid ${hexColorToCSS(KOREAN_COLORS.PRIMARY_CYAN)}`,
          marginTop: "8px",
          paddingTop: "6px",
        }}
      >
        <div style={{ fontSize: "10px" }}>
          <span style={{ color: hexColorToCSS(KOREAN_COLORS.TEXT_SECONDARY) }}>Status: </span>
          {metrics.avgFrameTime < 5 && metrics.cacheHitRate > 0.9 ? (
            <span style={{ color: hexColorToCSS(KOREAN_COLORS.POSITIVE_GREEN), fontWeight: "bold" }}>✓ OPTIMAL</span>
          ) : metrics.avgFrameTime < 8 && metrics.cacheHitRate > 0.7 ? (
            <span style={{ color: hexColorToCSS(KOREAN_COLORS.WARNING_YELLOW) }}>⚠ GOOD</span>
          ) : (
            <span style={{ color: hexColorToCSS(KOREAN_COLORS.ACCENT_RED) }}>✗ NEEDS OPTIMIZATION</span>
          )}
        </div>
      </div>
    </div>
  );
});

PerformanceDebugOverlayHtml.displayName = "PerformanceDebugOverlayHtml";
