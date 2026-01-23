import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePhilosophyState } from "./usePhilosophyState";
import { TrigramStance } from "../../../../types";

describe("usePhilosophyState", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => usePhilosophyState());

    expect(result.current.selectedTrigram).toBeNull();
    expect(result.current.topic).toBe("trigrams");
  });

  it("should select a trigram", () => {
    const { result } = renderHook(() => usePhilosophyState());

    act(() => {
      result.current.selectTrigram(TrigramStance.GEON);
    });

    expect(result.current.selectedTrigram).toBe(TrigramStance.GEON);
  });

  it("should clear trigram selection", () => {
    const { result } = renderHook(() => usePhilosophyState());

    act(() => {
      result.current.selectTrigram(TrigramStance.GEON);
    });

    expect(result.current.selectedTrigram).toBe(TrigramStance.GEON);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedTrigram).toBeNull();
  });

  it("should change topic", () => {
    const { result } = renderHook(() => usePhilosophyState());

    act(() => {
      result.current.setTopic("values");
    });

    expect(result.current.topic).toBe("values");
  });

  it("should clear selection when changing topic", () => {
    const { result } = renderHook(() => usePhilosophyState());

    act(() => {
      result.current.selectTrigram(TrigramStance.TAE);
    });

    expect(result.current.selectedTrigram).toBe(TrigramStance.TAE);

    act(() => {
      result.current.setTopic("archetypes");
    });

    expect(result.current.topic).toBe("archetypes");
    expect(result.current.selectedTrigram).toBeNull();
  });

  it("should handle multiple trigram selections", () => {
    const { result } = renderHook(() => usePhilosophyState());

    act(() => {
      result.current.selectTrigram(TrigramStance.LI);
    });

    expect(result.current.selectedTrigram).toBe(TrigramStance.LI);

    act(() => {
      result.current.selectTrigram(TrigramStance.GAM);
    });

    expect(result.current.selectedTrigram).toBe(TrigramStance.GAM);
  });

  it("should maintain stable function references", () => {
    const { result, rerender } = renderHook(() => usePhilosophyState());

    const selectTrigram1 = result.current.selectTrigram;
    const clearSelection1 = result.current.clearSelection;
    const setTopic1 = result.current.setTopic;

    rerender();

    expect(result.current.selectTrigram).toBe(selectTrigram1);
    expect(result.current.clearSelection).toBe(clearSelection1);
    expect(result.current.setTopic).toBe(setTopic1);
  });
});
