/**
 * BackgroundScene3D - Shared cyberpunk Korean-themed 3D background scene
 *
 * @korean 배경씬3D - 공유 사이버펑크 한국 테마 3D 배경 씬
 *
 * Eliminates duplication across IntroScreen, ControlsScreen, and PhilosophyScreen
 */

import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../types/constants";

/**
 * Color theme variants for background scenes
 */
export type BackgroundTheme = "intro" | "controls" | "philosophy" | "default";

export interface BackgroundScene3DProps {
  /**
   * Color theme for the background
   * @default "default"
   */
  readonly theme?: BackgroundTheme;

  /**
   * Grid rotation speed (radians per frame)
   * @default 0.0005
   */
  readonly gridRotationSpeed?: number;

  /**
   * Grid position Y offset
   * @default -8
   */
  readonly gridPositionY?: number;

  /**
   * Grid size
   * @default 80
   */
  readonly gridSize?: number;

  /**
   * Grid divisions
   * @default 40
   */
  readonly gridDivisions?: number;

  /**
   * Fog near distance
   * @default 5
   */
  readonly fogNear?: number;

  /**
   * Fog far distance
   * @default 40
   */
  readonly fogFar?: number;

  /**
   * Ambient light intensity
   * @default 0.4
   */
  readonly ambientIntensity?: number;

  /**
   * Directional light intensity
   * @default 1
   */
  readonly directionalIntensity?: number;

  /**
   * Point light intensity
   * @default 0.5
   */
  readonly pointIntensity?: number;
}

/**
 * Theme color configurations
 */
const THEME_COLORS: Record<
  BackgroundTheme,
  {
    ambient: number;
    grid: number;
    point: number;
    ambientIntensity: number;
    directionalIntensity: number;
    pointIntensity: number;
  }
> = {
  intro: {
    ambient: KOREAN_COLORS.PRIMARY_CYAN,
    grid: KOREAN_COLORS.PRIMARY_CYAN,
    point: KOREAN_COLORS.ACCENT_BLUE,
    ambientIntensity: 0.4,
    directionalIntensity: 1,
    pointIntensity: 0.5,
  },
  controls: {
    ambient: KOREAN_COLORS.PRIMARY_CYAN,
    grid: KOREAN_COLORS.PRIMARY_CYAN,
    point: KOREAN_COLORS.ACCENT_BLUE,
    ambientIntensity: 0.3,
    directionalIntensity: 0.8,
    pointIntensity: 0.4,
  },
  philosophy: {
    ambient: KOREAN_COLORS.ACCENT_GOLD,
    grid: KOREAN_COLORS.ACCENT_GOLD,
    point: KOREAN_COLORS.PRIMARY_CYAN,
    ambientIntensity: 0.3,
    directionalIntensity: 0.8,
    pointIntensity: 0.4,
  },
  default: {
    ambient: KOREAN_COLORS.PRIMARY_CYAN,
    grid: KOREAN_COLORS.PRIMARY_CYAN,
    point: KOREAN_COLORS.ACCENT_BLUE,
    ambientIntensity: 0.4,
    directionalIntensity: 1,
    pointIntensity: 0.5,
  },
};

/**
 * Shared 3D Background Scene Component
 *
 * Renders cyberpunk Korean-themed 3D background with rotating grid,
 * atmospheric lighting, and fog effects.
 *
 * @korean 사이버펑크 한국 테마의 3D 배경을 렌더링합니다.
 * 회전하는 그리드, 분위기 있는 조명, 안개 효과를 포함합니다.
 */
export const BackgroundScene3D: React.FC<BackgroundScene3DProps> = ({
  theme = "default",
  gridRotationSpeed = 0.0005,
  gridPositionY = -8,
  gridSize = 80,
  gridDivisions = 40,
  fogNear = 5,
  fogFar = 40,
  ambientIntensity,
  directionalIntensity,
  pointIntensity,
}) => {
  const gridRef = useRef<THREE.GridHelper>(null);

  // Get theme colors
  const themeColors = THEME_COLORS[theme];

  // Use props or theme defaults
  const finalAmbientIntensity =
    ambientIntensity ?? themeColors.ambientIntensity;
  const finalDirectionalIntensity =
    directionalIntensity ?? themeColors.directionalIntensity;
  const finalPointIntensity = pointIntensity ?? themeColors.pointIntensity;

  // Animate grid using useFrame for proper sync with render loop
  useFrame(() => {
    if (gridRef.current) {
      gridRef.current.rotation.y += gridRotationSpeed;
    }
  });

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight
        intensity={finalAmbientIntensity}
        color={themeColors.ambient}
      />

      {/* Directional lights for Korean aesthetic */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={finalDirectionalIntensity}
        color={KOREAN_COLORS.ACCENT_GOLD}
      />
      <pointLight
        position={[-10, 5, -5]}
        intensity={finalPointIntensity}
        color={themeColors.point}
      />

      {/* Cyberpunk grid plane - positioned lower with fog to hide edges */}
      <gridHelper
        ref={gridRef}
        args={[
          gridSize,
          gridDivisions,
          themeColors.grid,
          KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
        ]}
        position={[0, gridPositionY, 0]}
        rotation={[0, 0, 0]}
      />

      {/* Fog for depth - starts closer to hide grid edges */}
      <fog
        attach="fog"
        args={[KOREAN_COLORS.UI_BACKGROUND_DARK, fogNear, fogFar]}
      />
    </>
  );
};

