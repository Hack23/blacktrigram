import { useCallback, useEffect, useRef } from "react";
import type { useCombatAudio } from "../../combat/hooks/useCombatAudio";
import type { useAudio } from "../../../../audio/AudioProvider";
import { getArchetypePhysicalAttributes } from "../../../../data/archetypePhysicalAttributes";
import type { usePlayerAnimation } from "../../../../hooks/usePlayerAnimation";
import { resolveTechniqueAnimation } from "../../../../systems/animation";
import { getAnimationForTechniqueOrDefault } from "../../../../systems/animation/core/TechniqueAnimationMapping";
import { physicalReachCalculator } from "../../../../systems/physics";
import { KoreanTechniquesSystem } from "../../../../systems/trigram/KoreanTechniques";
import { TRIGRAM_STANCES_ORDER } from "../../../../systems/trigram/types";
import type { PlayerState } from "../../../../systems/player";
import type { PlayerArchetype, TrigramStance } from "../../../../types/common";
import type { Technique } from "../../../../types/technique";
import { DEFAULT_BODY_RADIUS_METERS } from "../../../../types/physicsConstants";
import { getAttackPresentation } from "../../../../utils/attackPresentation";
import { calculateDistance3D } from "../../../../utils/math";
import type { TrainingActions, TrainingScreenState } from "./useTrainingState";

type TrainingPoint = [number, number, number];

/** Snapshot of one accepted game animation; changing the selection does not modify it. */
export interface TrainingAttack {
  readonly animation: string;
  readonly duration: number;
  readonly impactFrame: number;
  readonly reach: number;
  readonly key: number;
}

/** Resolve the same authored clip shown in Combat and the matching practice range. */
export function getTrainingTechnique(
  technique: Technique,
  archetype: PlayerArchetype,
  stance: TrigramStance,
): Omit<TrainingAttack, "key"> {
  const definition = KoreanTechniquesSystem.getTechniqueById(technique.id);
  const animation = resolveTechniqueAnimation(definition ?? technique);
  return {
    animation,
    ...getAttackPresentation(animation),
    reach: physicalReachCalculator.calculateMaxReach(
      getArchetypePhysicalAttributes(archetype),
      definition?.animationType ?? getAnimationForTechniqueOrDefault(technique.id).type,
      stance,
      definition?.reachConfig,
    ),
  };
}

interface TrainingActionOptions {
  readonly state: TrainingScreenState;
  readonly actions: TrainingActions;
  readonly player: TrainingPoint;
  readonly dummy: TrainingPoint;
  readonly archetype: PlayerArchetype;
  readonly stance: TrigramStance;
  readonly audio: Pick<ReturnType<typeof useAudio>, "playSFX">;
  readonly sounds: Pick<ReturnType<typeof useCombatAudio>, "playAttackSound" | "playBoneImpactSound">;
  readonly animation: Pick<ReturnType<typeof usePlayerAnimation>, "currentState" | "transitionToAttack" | "transitionToStanceGuard">;
  readonly onPlayerUpdate: (updates: Partial<PlayerState>) => void;
  readonly onStartAttack: (attack: TrainingAttack) => void;
}

function registerPracticeImpact(options: TrainingActionOptions, reach: number): void {
  const { state, actions, player, dummy, audio, sounds } = options;
  if (!state.isTraining || state.dummyHealth <= 0) return;
  const gap = Math.max(0, calculateDistance3D(player, dummy) - DEFAULT_BODY_RADIUS_METERS);
  const position: TrainingPoint = [dummy[0], 1.25, dummy[2]];
  if (gap > reach || reach <= 0) {
    actions.registerMiss();
    actions.setFeedback("사정거리 밖 | Out of reach");
    actions.addHitEffect({ position, type: "miss", visible: true });
    void audio.playSFX("menu_navigate");
    return;
  }
  const accuracy = 1 - gap / reach * 0.3;
  const damage = Math.round(accuracy * 15);
  const perfect = accuracy > 0.9;
  actions.registerHit(Math.round(accuracy * 100), damage, perfect);
  actions.setFeedback(perfect ? "완벽한 타격! | Perfect Strike!" : "타격 성공 | Strike Success");
  actions.addHitEffect({ position, type: perfect ? "perfect" : "success", visible: true, damage });
  void sounds.playBoneImpactSound({
    damage, remainingHealth: Math.max(0, state.dummyHealth - damage),
    hitPosition: { x: position[0], y: position[1], z: position[2] },
  });
}

/** Owns the accepted attack and its single impact on the shared animation clock. */
export function useTrainingActions(options: TrainingActionOptions): {
  readonly handleStartTraining: () => void;
  readonly handleStopTraining: () => void;
  readonly handleDummyDefeated: () => void;
  readonly handleStanceChange: (index: number) => void;
  readonly handleAttack: (technique: Technique) => boolean;
  readonly handleAttackFrame: (frame: number) => void;
  readonly clearAttack: () => void;
} {
  const { state, actions, archetype, stance, audio, sounds, animation, onPlayerUpdate, onStartAttack } = options;
  const pending = useRef<TrainingAttack | null>(null);
  const nextAttackKey = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearAttack = useCallback(() => { pending.current = null; }, []);
  const clearReset = useCallback(() => {
    if (resetTimer.current !== null) clearTimeout(resetTimer.current);
    resetTimer.current = null;
  }, []);
  useEffect(() => clearReset, [clearReset]);

  const handleStartTraining = useCallback(() => {
    clearReset();
    actions.startTraining();
    void audio.playSFX("menu_select");
  }, [actions, audio, clearReset]);
  const handleStopTraining = useCallback(() => {
    clearAttack();
    clearReset();
    actions.stopTraining();
    void animation.transitionToStanceGuard(stance);
    void audio.playSFX("menu_back");
  }, [actions, animation, audio, clearAttack, clearReset, stance]);
  const handleDummyDefeated = useCallback(() => {
    actions.setFeedback("훈련 더미 무력화! | Dummy Defeated!");
    void audio.playSFX("ki_release");
    clearReset();
    resetTimer.current = setTimeout(() => {
      resetTimer.current = null;
      actions.resetDummy();
    }, 2000);
  }, [actions, audio, clearReset]);
  const handleStanceChange = useCallback((index: number) => {
    const next = TRIGRAM_STANCES_ORDER[index];
    if (!next || next === stance || animation.currentState === "attack") return;
    actions.setStanceIndex(index);
    animation.transitionToStanceGuard(next);
    onPlayerUpdate({ currentStance: next });
  }, [actions, animation, onPlayerUpdate, stance]);
  const handleAttack = useCallback((technique: Technique): boolean => {
    if (!state.isTraining || state.dummyHealth <= 0 || pending.current || animation.currentState === "attack") return false;
    const presentation = getTrainingTechnique(technique, archetype, stance);
    if (!animation.transitionToAttack(presentation.duration)) return false;
    const attack = { ...presentation, key: ++nextAttackKey.current };
    pending.current = attack;
    onStartAttack(attack);
    actions.setFeedback(`${technique.name.korean} | ${technique.name.english}`);
    const damage = technique.damage.max;
    void sounds.playAttackSound(damage >= 40 ? "critical" : damage >= 25 ? "heavy" : damage >= 10 ? "medium" : "light");
    return true;
  }, [actions, animation, archetype, onStartAttack, sounds, stance, state.dummyHealth, state.isTraining]);
  const handleAttackFrame = useCallback((frame: number) => {
    const attack = pending.current;
    if (!attack || frame < attack.impactFrame) return;
    pending.current = null;
    registerPracticeImpact(options, attack.reach);
  }, [options]);

  return { handleStartTraining, handleStopTraining, handleDummyDefeated, handleStanceChange, handleAttack, handleAttackFrame, clearAttack };
}
