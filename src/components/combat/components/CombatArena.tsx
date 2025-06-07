import React, { useCallback, useMemo, useState } from "react";
import { Container, useTick } from "@pixi/react";
import type {
  CombatArenaProps,
  HitEffect,
  Position,
  VitalPoint,
} from "../../../types";
import PlayerVisuals from "../../game/PlayerVisuals"; // Changed to default import
import { HitEffectsLayer } from "../../game/HitEffectsLayer";
import { KOREAN_COLORS, GAME_CONFIG } from "../../../types/constants";

export const CombatArena: React.FC<CombatArenaProps> = ({
  players,
  onTechniqueExecute,
  combatEffects: externalCombatEffects, // Renamed to avoid conflict
  isExecutingTechnique,
  showVitalPoints,
  showDebugInfo,
  width = GAME_CONFIG.CANVAS_WIDTH,
  height = GAME_CONFIG.CANVAS_HEIGHT - 200, // Adjusted for HUD and Controls
  ...props
}) => {
  const [internalCombatEffects, setInternalCombatEffects] = useState<
    readonly HitEffect[]
  >([]);
  const [selectedTarget, setSelectedTarget] = useState<{
    playerId: string;
    vitalPointId?: string;
  } | null>(null);

  const allCombatEffects = useMemo(() => {
    return [...(externalCombatEffects || []), ...internalCombatEffects].slice(
      -10
    );
  }, [externalCombatEffects, internalCombatEffects]);

  const handlePlayerClick = useCallback(
    async (playerIndex: 0 | 1, vitalPoint?: VitalPoint) => {
      const targetPlayer = players[playerIndex];
      if (!targetPlayer) return;

      // For now, let's assume a default technique or the currently selected one
      // This part needs more logic for technique selection by the active player
      const activePlayerIndex = players[0].combatState !== "idle" ? 0 : 1; // Simplified active player
      const activePlayer = players[activePlayerIndex];

      // Find a sample technique (e.g., the first known one)
      const techniqueToExecute =
        activePlayer.knownTechniques.length > 0
          ? CombatSystem.getTechniqueById(activePlayer.knownTechniques[0]) // Assuming CombatSystem.getTechniqueById exists
          : undefined;

      if (techniqueToExecute && activePlayer.id !== targetPlayer.id) {
        // Cannot attack self
        setSelectedTarget({
          playerId: targetPlayer.id,
          vitalPointId: vitalPoint?.id,
        });
        // Pass the actual KoreanTechnique object
        const result = await onTechniqueExecute(
          activePlayerIndex,
          techniqueToExecute
        );
        if (result && result.hit) {
          const newEffect: HitEffect = {
            id: `hit-effect-${Date.now()}`,
            type: result.critical ? "critical" : "medium",
            position: result.hitPosition || targetPlayer.position,
            damage: result.damage,
            timestamp: Date.now(),
            duration: 500,
            color: KOREAN_COLORS.ACCENT_RED, // Example color
            playerId: targetPlayer.id,
          };
          setInternalCombatEffects((prev) => [...prev, newEffect]);
        }
      }
    },
    [players, onTechniqueExecute]
  );

  // Animation/update logic if needed
  useTick(() => {
    // Animation logic here
  });

  const player1 = players[0];
  const player2 = players[1];

  if (!player1 || !player2) return <Container />;

  // Simplified positioning for now
  const player1Position: Position = { x: width * 0.25, y: height * 0.65 };
  const player2Position: Position = { x: width * 0.75, y: height * 0.65 };

  return (
    <Container width={width} height={height} {...props}>
      {/* Background elements can be added here */}

      {/* Player 1 Visuals */}
      <PlayerVisuals
        playerState={player1}
        playerIndex={0}
        x={player1Position.x}
        y={player1Position.y}
        showVitalPoints={showVitalPoints}
        interactive={true}
        // Use pointertap for Pixi events, ensure PlayerVisualsProps accepts it
        pointertap={() => handlePlayerClick(0)}
      />

      {/* Player 2 Visuals */}
      <PlayerVisuals
        playerState={player2}
        playerIndex={1}
        x={player2Position.x}
        y={player2Position.y}
        showVitalPoints={showVitalPoints}
        interactive={true}
        pointertap={() => handlePlayerClick(1)}
      />

      <HitEffectsLayer effects={allCombatEffects} />

      {/* Debug Info (Optional) */}
      {showDebugInfo && selectedTarget && (
        <Container>{/* Add Pixi Text component for debug output */}</Container>
      )}
    </Container>
  );
};

// Placeholder for CombatSystem if not imported, ensure it's available
const CombatSystem = {
  getTechniqueById: (id: string) =>
    ({
      id,
      name: { korean: id, english: id },
      description: { korean: "", english: "" },
      stance: "geon",
      type: "strike",
    } as any), // Mock
};
