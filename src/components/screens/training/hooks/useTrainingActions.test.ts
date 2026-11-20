import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getTechniquesForStanceAndArchetype } from "../../../../data/techniques";
import { AnimationState } from "../../../../systems/animation";
import { PlayerArchetype, TrigramStance } from "../../../../types/common";
import { getTrainingTechnique, useTrainingActions } from "./useTrainingActions";
import { useTrainingState } from "./useTrainingState";

function setup(distance: number, acceptsAttack = true) {
  const stance = TrigramStance.GEON;
  const archetype = PlayerArchetype.MUSA;
  const techniques = getTechniquesForStanceAndArchetype(stance, archetype);
  const animation = {
    currentState: AnimationState.IDLE,
    transitionToAttack: vi.fn(() => acceptsAttack),
    transitionToStanceGuard: vi.fn(() => true),
  };
  const onStartAttack = vi.fn();
  const sounds = {
    playAttackSound: vi.fn(async () => {}),
    playBoneImpactSound: vi.fn(async () => {}),
  };
  const audio = { playSFX: vi.fn(async () => {}) };
  const onPlayerUpdate = vi.fn();
  const { result } = renderHook(() => {
    const { state, actions } = useTrainingState();
    return {
      state,
      ...useTrainingActions({
        state, actions, player: [0, 0, 0], dummy: [distance, 0, 0], stance, archetype,
        animation, onStartAttack, audio, sounds, onPlayerUpdate,
      }),
    };
  });
  return { result, techniques, animation, onStartAttack, sounds, stance, archetype };
}

describe("training technique execution", () => {
  it("plays the requested authored clip and records exactly one hit even when frames are skipped", () => {
    const { result, techniques, animation, onStartAttack, sounds, stance, archetype } = setup(0.35);
    const [first, second] = techniques;
    const presentation = getTrainingTechnique(second, archetype, stance);
    expect(presentation.animation).not.toBe(getTrainingTechnique(first, archetype, stance).animation);
    act(() => result.current.handleStartTraining());
    act(() => {
      expect(result.current.handleAttack(second)).toBe(true);
      expect(result.current.handleAttack(first)).toBe(false);
    });
    expect(animation.transitionToAttack).toHaveBeenCalledWith(presentation.duration);
    expect(onStartAttack).toHaveBeenCalledWith(expect.objectContaining(presentation));
    act(() => result.current.handleAttackFrame(presentation.impactFrame - 1));
    expect(result.current.state.stats.hits).toBe(0);
    act(() => {
      result.current.handleAttackFrame(presentation.impactFrame + 2);
      result.current.handleAttackFrame(presentation.impactFrame + 3);
    });
    expect(result.current.state.stats.hits).toBe(1);
    expect(sounds.playBoneImpactSound).toHaveBeenCalledTimes(1);
  });

  it("does not score while stopped or after a rejected animation transition", () => {
    const { result, techniques, onStartAttack } = setup(0.35, false);
    expect(result.current.handleAttack(techniques[0])).toBe(false);
    act(() => result.current.handleStartTraining());
    expect(result.current.handleAttack(techniques[0])).toBe(false);
    act(() => result.current.handleAttackFrame(99));
    expect(onStartAttack).not.toHaveBeenCalled();
    expect(result.current.state.stats.hits).toBe(0);
  });

  it("counts an out-of-range attempt but cancels an attempt when practice stops", () => {
    const { result, techniques, sounds } = setup(9);
    act(() => result.current.handleStartTraining());
    act(() => {
      result.current.handleAttack(techniques[0]);
      result.current.handleAttackFrame(99);
    });
    expect(result.current.state.stats.misses).toBe(1);
    act(() => {
      result.current.handleAttack(techniques[1]);
      result.current.handleStopTraining();
      result.current.handleAttackFrame(99);
    });
    expect(result.current.state.stats.misses).toBe(1);
    expect(sounds.playBoneImpactSound).not.toHaveBeenCalled();
  });
});
