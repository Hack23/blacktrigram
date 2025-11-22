/**
 * PerformanceOverlay3D - Development-only performance stats overlay for Three.js
 * 
 * Displays real-time FPS, memory, and draw call statistics
 * Only visible in development mode
 */

import { Html } from '@react-three/drei';
import React from 'react';
import { usePerformanceMonitor } from './usePerformanceMonitor';

export interface PerformanceOverlay3DProps {
  readonly position?: [number, number, number];
  readonly visible?: boolean;
}

/**
 * 3D Performance overlay component for development
 * Shows FPS, memory, draw calls, and warnings
 */
export const PerformanceOverlay3D: React.FC<PerformanceOverlay3DProps> = ({
  position = [0, 0, 0],
  visible = import.meta.env.DEV,
}) => {
  const { metrics, isGood, warnings } = usePerformanceMonitor({
    enabled: visible,
    updateInterval: 500, // Update UI every 500ms
  });

  if (!visible) {
    return null;
  }

  const fpsColor = isGood ? '#00ff88' : metrics.avgFps < 30 ? '#ff4444' : '#ffaa00';

  return (
    <Html position={position} style={{ pointerEvents: 'none' }}>
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          border: '2px solid #00ffff',
          borderRadius: '8px',
          padding: '12px 16px',
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#00ffff',
          minWidth: '280px',
          userSelect: 'none',
        }}
        data-testid="performance-overlay"
      >
        {/* Title */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px',
            borderBottom: '1px solid #00ffff',
            paddingBottom: '4px',
          }}
        >
          ⚡ Performance Monitor
        </div>

        {/* FPS Stats */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span>FPS:</span>
            <span style={{ color: fpsColor, fontWeight: 'bold' }}>
              {metrics.fps.toFixed(1)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span>Avg FPS:</span>
            <span style={{ color: fpsColor }}>
              {metrics.avgFps.toFixed(1)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span>Min/Max:</span>
            <span>
              {metrics.minFps.toFixed(1)} / {metrics.maxFps.toFixed(1)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Frame Time:</span>
            <span>{metrics.frameTime.toFixed(2)}ms</span>
          </div>
        </div>

        {/* System Stats */}
        <div style={{ marginBottom: '8px', borderTop: '1px solid #444', paddingTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span>Memory:</span>
            <span
              style={{
                color: metrics.memoryMB > 250 ? '#ffaa00' : metrics.memoryMB > 300 ? '#ff4444' : '#00ffff',
              }}
            >
              {metrics.memoryMB > 0 ? `${metrics.memoryMB.toFixed(1)}MB` : 'N/A'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span>Draw Calls:</span>
            <span
              style={{
                color: metrics.drawCalls > 100 ? '#ffaa00' : metrics.drawCalls > 150 ? '#ff4444' : '#00ffff',
              }}
            >
              {metrics.drawCalls}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Triangles:</span>
            <span>{(metrics.triangles / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* Performance Status */}
        <div style={{ borderTop: '1px solid #444', paddingTop: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: isGood ? '#00ff88' : '#ff4444',
                display: 'inline-block',
              }}
            />
            <span style={{ fontWeight: 'bold' }}>
              {isGood ? 'Performance Good' : 'Performance Degraded'}
            </span>
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div
            style={{
              marginTop: '8px',
              borderTop: '1px solid #ff4444',
              paddingTop: '8px',
            }}
          >
            <div style={{ color: '#ff4444', fontWeight: 'bold', marginBottom: '4px' }}>
              ⚠️ Warnings:
            </div>
            {warnings.map((warning, index) => (
              <div key={index} style={{ fontSize: '11px', color: '#ffaa00', marginBottom: '2px' }}>
                {warning}
              </div>
            ))}
          </div>
        )}
      </div>
    </Html>
  );
};

export default PerformanceOverlay3D;
