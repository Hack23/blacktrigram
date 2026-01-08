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
import React, { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../../../types/constants";

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
  const lastTimeRef = useRef(0);
  const lastWarningTimeRef = useRef(0);
  const initializedRef = useRef(false);
  
  // Initialize performance.now() after mount to avoid impure function call during render
  useEffect(() => {
    lastTimeRef.current = performance.now();
    initializedRef.current = true;
  }, []);

  const updateFPS = useCallback(() => {
    // Skip FPS calculation until properly initialized
    if (!initializedRef.current) return;
    
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

  // Calculate color as hex string based on FPS (memoized to avoid repeated conversions)
  // Note: Returns a 24-bit RGB hex color with no alpha channel.
  // The conversion below is intentionally hex-only; if alpha support is added
  // in the future, this logic will need to be updated accordingly.
  const colorHex = useMemo(() => {
    let color: number;
    if (fps >= 60) {
      color = KOREAN_COLORS.ACCENT_GOLD; // Excellent
    } else if (fps >= warningThreshold) {
      color = 0xffff00; // Warning (yellow)
    } else if (fps >= criticalThreshold) {
      color = 0xff8800; // Poor (orange)
    } else {
      color = KOREAN_COLORS.PRIMARY_RED; // Critical (red)
    }
    return `#${color.toString(16).padStart(6, "0")}`;
  }, [fps, warningThreshold, criticalThreshold]);

  const getStatus = () => {
    if (fps >= 60) return "우수 | Excellent";
    if (fps >= warningThreshold) return "경고 | Warning";
    if (fps >= criticalThreshold) return "저하 | Poor";
    return "심각 | Critical";
  };

  if (!enabled) {
    return null;
  }

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
          border: `2px solid ${colorHex}`,
          borderRadius: "4px",
          fontFamily: FONT_FAMILY.KOREAN,
          fontSize: "12px",
          color: colorHex,
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
