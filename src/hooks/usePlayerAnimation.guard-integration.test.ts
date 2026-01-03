import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlayerAnimation } from './usePlayerAnimation';
import { TrigramStance } from '../types/common';

describe('Guard Animation Integration', () => {
  it('should transition to stance guard', () => {
    const { result } = renderHook(() => usePlayerAnimation());

    // Direct transition to guard (not from stance_change)
    act(() => {
      result.current.transitionToStanceGuard(TrigramStance.GEON);
    });

    expect(result.current.currentState).toBe('stance_guard_geon');
    expect(result.current.isInStanceGuard()).toBe(true);
    expect(result.current.getCurrentGuardStance()).toBe(TrigramStance.GEON);
  });

  it('should support all 8 trigram stance guards', () => {
    const { result } = renderHook(() => usePlayerAnimation());

    const stances: TrigramStance[] = [
      TrigramStance.GEON,
      TrigramStance.TAE,
      TrigramStance.LI,
      TrigramStance.JIN,
      TrigramStance.SON,
      TrigramStance.GAM,
      TrigramStance.GAN,
      TrigramStance.GON,
    ];

    stances.forEach((stance) => {
      act(() => {
        result.current.transitionToStanceGuard(stance);
      });

      expect(result.current.isInStanceGuard()).toBe(true);
      expect(result.current.getCurrentGuardStance()).toBe(stance);
    });
  });

  it('should allow guard-to-guard transitions', () => {
    const { result } = renderHook(() => usePlayerAnimation());

    act(() => {
      result.current.transitionToStanceGuard(TrigramStance.GEON);
    });

    expect(result.current.currentState).toBe('stance_guard_geon');

    // Direct transition to different guard
    act(() => {
      result.current.transitionToStanceGuard(TrigramStance.LI);
    });

    expect(result.current.currentState).toBe('stance_guard_li');
    expect(result.current.getCurrentGuardStance()).toBe(TrigramStance.LI);
  });
});
