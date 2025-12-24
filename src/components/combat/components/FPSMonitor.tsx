/**
 * FPSMonitor - Real-time performance monitoring component
 *
 * Displays current FPS (frames per second) and provides performance warnings
 * when frame rate drops below target thresholds. Helps verify 60fps target
 * and identify performance bottlenecks during combat.
 *
 * @module components/combat/components/FPSMonitor
 * @category Performance Monitoring
 * @korean FPS모니터
 */

import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import React, { useRef, useState, useCallback } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";

export interface FPSMonitorProps {
  /** Whether to show the FPS monitor */
  readonly enabled?: boolean;
  /** FPS threshold for warning (default: 50) */
  readonly warningThreshold?: number;
  /** FPS threshold for critical warning (default: 30) */
  readonly criticalThreshold?: number;
  /** Callback when FPS drops below threshold */
  readonly onFPSDrop?: (fps: number) => void;
  /** Position from top in pixels (default: 10) */
  readonly top?: number;
  /** Position from right in pixels (default: 10) */
  readonly right?: number;
}

/**
 * FPSMonitor Component
 *
 * Monitors and displays real-time FPS during combat. Uses Three.js useFrame
 * to calculate frames per second and provides visual feedback:
 * - Green: 60+ fps (excellent)
 * - Yellow: 50-59 fps (warning)
 * - Orange: 30-49 fps (poor)
 * - Red: <30 fps (critical)
 *
 * @example
 * ```tsx
 * <FPSMonitor
 *   enabled={showPerformanceStats}
 *   warningThreshold={50}
 *   onFPSDrop={(fps) => console.warn(`Performance drop: ${fps} fps`)}
 * />
 * ```
 */
export const FPSMonitor: React.FC<FPSMonitorProps> = ({
  enabled = true,
  warningThreshold = 50,
  criticalThreshold = 30,
  onFPSDrop,
  top = 10,
  right = 10,
}) => {
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const lastWarningTimeRef = useRef(0);

  const updateFPS = useCallback(() => {
    frameCountRef.current++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;

    // Update FPS every second
    if (deltaTime >= 1000) {
      const currentFps = Math.round((frameCountRef.current * 1000) / deltaTime);
      setFps(currentFps);
      
      // Trigger warning callback if FPS drops (max once per 3 seconds)
      if (onFPSDrop && currentFps < warningThreshold) {
        const timeSinceLastWarning = currentTime - lastWarningTimeRef.current;
        if (timeSinceLastWarning >= 3000) {
          onFPSDrop(currentFps);
          lastWarningTimeRef.current = currentTime;
        }
      }

      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }
  }, [onFPSDrop, warningThreshold]);

  useFrame(() => {
    if (enabled) {
      updateFPS();
    }
  });

  if (!enabled) {
    return null;
  }

  // Determine color based on FPS
  const getColor = () => {
    if (fps >= 60) return KOREAN_COLORS.ACCENT_GOLD; // Excellent
    if (fps >= warningThreshold) return 0xffff00; // Warning (yellow)
    if (fps >= criticalThreshold) return 0xff8800; // Poor (orange)
    return KOREAN_COLORS.PRIMARY_RED; // Critical (red)
  };

  const getStatus = () => {
    if (fps >= 60) return "우수 | Excellent";
    if (fps >= warningThreshold) return "경고 | Warning";
    if (fps >= criticalThreshold) return "저하 | Poor";
    return "심각 | Critical";
  };

  return (
    <Html fullscreen>
      <div
        data-testid="fps-monitor"
        style={{
          position: "absolute",
          top: `${top}px`,
          right: `${right}px`,
          padding: "8px 12px",
          background: "rgba(0, 0, 0, 0.8)",
          border: `2px solid #${getColor().toString(16).padStart(6, "0")}`,
          borderRadius: "4px",
          fontFamily: FONT_FAMILY.KOREAN,
          fontSize: "12px",
          color: `#${getColor().toString(16).padStart(6, "0")}`,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "2px" }}>
          FPS: {fps}
        </div>
        <div style={{ fontSize: "10px", opacity: 0.9 }}>
          {getStatus()}
        </div>
      </div>
    </Html>
  );
};

export default FPSMonitor;
