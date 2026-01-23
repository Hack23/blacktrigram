/**
 * useControlsState - State management hook for Controls Screen
 * 
 * Manages keyboard press detection, gamepad state, and category selection
 * 
 * @module components/screens/controls/hooks
 */

import { useCallback, useEffect, useState } from "react";

/**
 * Controls state interface
 */
export interface ControlsState {
  readonly pressedKeys: Set<string>;
  readonly category: 'keyboard' | 'gamepad';
  readonly selectedTab: 'combat' | 'movement' | 'system';
}

/**
 * Hook return type
 */
export interface UseControlsStateReturn {
  readonly pressedKeys: Set<string>;
  readonly category: 'keyboard' | 'gamepad';
  readonly selectedTab: 'combat' | 'movement' | 'system';
  readonly setCategory: (category: 'keyboard' | 'gamepad') => void;
  readonly setSelectedTab: (tab: 'combat' | 'movement' | 'system') => void;
}

/**
 * Custom hook for managing controls screen state
 * 
 * Features:
 * - Keyboard press detection with cleanup
 * - Category switching (keyboard/gamepad)
 * - Tab selection for control categories
 * 
 * @example
 * ```tsx
 * const { pressedKeys, category, selectedTab, setCategory, setSelectedTab } = useControlsState();
 * 
 * // Check if key is pressed
 * const isSpacePressed = pressedKeys.has('Space');
 * 
 * // Switch to gamepad view
 * setCategory('gamepad');
 * ```
 */
export function useControlsState(): UseControlsStateReturn {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState<'keyboard' | 'gamepad'>('keyboard');
  const [selectedTab, setSelectedTab] = useState<'combat' | 'movement' | 'system'>('combat');

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't track if user is typing in input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      setPressedKeys(prev => {
        const next = new Set(prev);
        next.add(event.code);
        return next;
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(event.code);
        return next;
      });
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Memoized category setter
  const handleSetCategory = useCallback((newCategory: 'keyboard' | 'gamepad') => {
    setCategory(newCategory);
  }, []);

  // Memoized tab setter
  const handleSetSelectedTab = useCallback((tab: 'combat' | 'movement' | 'system') => {
    setSelectedTab(tab);
  }, []);

  return {
    pressedKeys,
    category,
    selectedTab,
    setCategory: handleSetCategory,
    setSelectedTab: handleSetSelectedTab,
  };
}
