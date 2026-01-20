/**
 * Distance Culling Usage Examples
 *
 * This document shows how to integrate the useDistanceCulling hook
 * into HTML overlay components for 60fps performance optimization.
 *
 * @module hooks/useDistanceCulling
 * @category Performance
 */

import React from "react";
import { Html } from "@react-three/drei";
import { useDistanceCulling } from "./useDistanceCulling";

/**
 * Example 1: Basic Distance Culling
 *
 * Cull overlay when camera is >20m away.
 */
export const Example1_BasicCulling: React.FC = () => {
  const isVisible = useDistanceCulling([10, 0, 0], { cullDistance: 20 });

  if (!isVisible) return null;

  return (
    <Html position={[10, 0, 0]} center>
      <div style={{ color: "white", fontSize: "16px" }}>
        Visible when within 20m
      </div>
    </Html>
  );
};

/**
 * Example 2: Overlay with Position Props
 *
 * Component accepts position as prop for flexible placement.
 */
interface OverlayProps {
  readonly position: [number, number, number];
  readonly content: string;
}

export const Example2_PositionalOverlay: React.FC<OverlayProps> = ({
  position,
  content,
}) => {
  const isVisible = useDistanceCulling(position, { cullDistance: 20 });

  if (!isVisible) return null;

  return (
    <Html position={position} center>
      <div style={{ color: "white", fontSize: "14px" }}>{content}</div>
    </Html>
  );
};

/**
 * Example 3: Performance-Optimized Training Stats
 *
 * Shows how to integrate culling into TrainingStatsOverlayHtml.
 * Only render stats when player is near training dummy.
 */
interface TrainingStatsProps {
  readonly dummyPosition: [number, number, number];
  readonly stats: { score: number; hits: number };
}

export const Example3_TrainingStats: React.FC<TrainingStatsProps> = ({
  dummyPosition,
  stats,
}) => {
  // Cull stats overlay when >15m from dummy
  const isVisible = useDistanceCulling(dummyPosition, { cullDistance: 15 });

  if (!isVisible) return null;

  return (
    <Html
      position={[dummyPosition[0], dummyPosition[1] + 2, dummyPosition[2]]}
      center
    >
      <div
        style={{
          background: "rgba(0, 0, 0, 0.8)",
          padding: "10px",
          borderRadius: "4px",
          color: "white",
        }}
      >
        <div>Score: {stats.score}</div>
        <div>Hits: {stats.hits}</div>
      </div>
    </Html>
  );
};

/**
 * Example 4: Multiple Overlays with Different Cull Distances
 *
 * Different overlays can have different cull distances based on importance.
 */
export const Example4_MultipleOverlays: React.FC = () => {
  // Important HUD - always visible (large distance)
  const hudVisible = useDistanceCulling([0, 2, 0], { cullDistance: 100 });

  // Enemy nameplate - medium distance
  const nameplateVisible = useDistanceCulling([10, 1, 0], { cullDistance: 30 });

  // Environmental detail - short distance
  const detailVisible = useDistanceCulling([20, 0, 0], { cullDistance: 10 });

  return (
    <>
      {hudVisible && (
        <Html position={[0, 2, 0]} center>
          <div>HUD - Always visible</div>
        </Html>
      )}

      {nameplateVisible && (
        <Html position={[10, 1, 0]} center>
          <div>Enemy Nameplate (30m)</div>
        </Html>
      )}

      {detailVisible && (
        <Html position={[20, 0, 0]} center>
          <div>Detail (10m)</div>
        </Html>
      )}
    </>
  );
};

/**
 * Example 5: Disable Culling for Critical UI
 *
 * Some overlays should never be culled (e.g., player health bar).
 */
export const Example5_NoCulling: React.FC = () => {
  // enabled: false means always render
  const isVisible = useDistanceCulling([0, 0, 0], { enabled: false });

  // Always true, but maintains consistent API
  return isVisible ? (
    <Html position={[0, 0, 0]} center>
      <div>Player Health - Always visible</div>
    </Html>
  ) : null;
};

/**
 * Performance Impact Estimate:
 *
 * Before optimization:
 * - 32 overlays × 3ms render = 96ms (fails 60fps budget)
 *
 * After distance culling:
 * - 10 visible overlays × 3ms = 30ms (marginal)
 * - 22 culled overlays × 0ms = 0ms
 * - Total: 30ms (improved but still needs React.memo)
 *
 * Combined (React.memo + distance culling):
 * - 10 visible overlays × 2ms (memoized) = 20ms
 * - 22 culled overlays × 0ms = 0ms
 * - Total: 20ms (under 60fps budget of 16.67ms with other optimizations)
 */
