/**
 * Combat component exports with proper typing
 */

import React from "react";

export { CombatArena } from "./CombatArena";
export { CombatHUD } from "./CombatHUD";
export { CombatControls } from "./CombatControls";

// Fix: Create proper React functional components instead of invalid JSX
export const PlayerStatusPanel: React.FC<any> = ({
  player,
  position,
  ...props
}) => {
  return React.createElement(
    "pixiContainer",
    props,
    React.createElement("pixiText", {
      text: `${player.name.korean} - ${position}`,
      style: { fontSize: 14, fill: 0xffffff },
    })
  );
};

export const CombatStats: React.FC<any> = ({
  players,
  combatLog,
  ...props
}) => {
  return React.createElement(
    "pixiContainer",
    props,
    React.createElement("pixiText", {
      text: "Combat Stats",
      style: { fontSize: 16, fill: 0xffd700 },
    }),
    ...(combatLog || []).slice(0, 3).map((entry: string, index: number) =>
      React.createElement("pixiText", {
        key: index,
        text: entry,
        style: { fontSize: 12, fill: 0xcccccc },
        y: 20 + index * 15,
      })
    )
  );
};

// Export types for combat components
export type {
  CombatArenaProps,
  CombatHUDProps,
  CombatControlsProps,
  PlayerStatusPanelProps,
  CombatStatsProps,
} from "../../../types/combat";

// Default exports
export { default as CombatArenaDefault } from "./CombatArena";
export { default as CombatHUDDefault } from "./CombatHUD";
export { default as CombatControlsDefault } from "./CombatControls";
