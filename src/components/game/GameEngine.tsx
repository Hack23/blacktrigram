import { useCallback, useState } from "react";
import { Player } from "./Player";
import {
  type GameEngineProps,
  type TrigramStance,
  KOREAN_COLORS,
} from "../../types";

export function GameEngine({
  players,
  gamePhase,
  onStanceChange,
}: GameEngineProps): React.ReactElement {
  const [hitEffects, setHitEffects] = useState<any[]>([]);

  const handlePlayerAttack = useCallback(
    (damage: number, position: { x: number; y: number }): void => {
      // Create hit effect
      const effect = {
        id: `hit-${Date.now()}`,
        position,
        damage,
        startTime: Date.now(),
        duration: 1000,
        type: damage > 20 ? "heavy" : "light",
        color: damage > 20 ? KOREAN_COLORS.Red : KOREAN_COLORS.YELLOW,
      };

      setHitEffects((prev) => [...prev, effect]);

      // Remove effect after duration
      setTimeout(() => {
        setHitEffects((prev) => prev.filter((e) => e.id !== effect.id));
      }, effect.duration);
    },
    []
  );

  const handlePlayerStanceChange = useCallback(
    (playerIndex: number, stance: TrigramStance): void => {
      onStanceChange(playerIndex, stance);
    },
    [onStanceChange]
  );

  if (gamePhase !== "combat") {
    return <div>Game engine only active during combat</div>;
  }

  return (
    <div className="game-engine">
      {players.map((playerState, index) => (
        <Player
          key={`player-${index}`}
          playerState={playerState}
          isPlayer1={index === 0}
          onAttack={handlePlayerAttack}
          onStanceChange={(stance) => handlePlayerStanceChange(index, stance)}
        />
      ))}

      {/* Hit effects would be rendered here */}
      {hitEffects.length > 0 && (
        <div className="hit-effects">{/* Render hit effects */}</div>
      )}
    </div>
  );
}
