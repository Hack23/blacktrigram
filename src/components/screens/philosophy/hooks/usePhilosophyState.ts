import { useCallback, useState } from "react";
import { TrigramStance } from "../../../../types";

/**
 * Philosophy topic types for navigation
 * 
 * **Korean**: 철학 주제
 */
export type PhilosophyTopic = "trigrams" | "values" | "archetypes";

/**
 * Philosophy screen state management hook
 * 
 * **Korean**: 철학 화면 상태 관리 훅
 * 
 * Manages the state for the Philosophy Screen including:
 * - Selected trigram for detailed view
 * - Current topic being viewed
 * - Navigation between different philosophy sections
 * 
 * @example
 * ```typescript
 * const {
 *   selectedTrigram,
 *   topic,
 *   selectTrigram,
 *   setTopic,
 *   clearSelection
 * } = usePhilosophyState();
 * 
 * // Select a trigram
 * selectTrigram(TrigramStance.GEON);
 * 
 * // Change topic
 * setTopic("values");
 * 
 * // Clear selection
 * clearSelection();
 * ```
 * 
 * @returns Philosophy state and control functions
 * 
 * @category Philosophy Hooks
 */
export function usePhilosophyState() {
  const [selectedTrigram, setSelectedTrigram] = useState<TrigramStance | null>(
    null
  );
  const [topic, setTopicInternal] = useState<PhilosophyTopic>("trigrams");

  /**
   * Select a trigram for detailed view
   * 
   * **Korean**: 트라이그램 선택
   */
  const selectTrigram = useCallback((stance: TrigramStance) => {
    setSelectedTrigram(stance);
  }, []);

  /**
   * Clear trigram selection
   * 
   * **Korean**: 선택 해제
   */
  const clearSelection = useCallback(() => {
    setSelectedTrigram(null);
  }, []);

  /**
   * Change the current philosophy topic
   * 
   * **Korean**: 주제 변경
   */
  const setTopic = useCallback((newTopic: PhilosophyTopic) => {
    setTopicInternal(newTopic);
    // Clear selection when changing topics
    setSelectedTrigram(null);
  }, []);

  return {
    selectedTrigram,
    topic,
    selectTrigram,
    clearSelection,
    setTopic,
  };
}
