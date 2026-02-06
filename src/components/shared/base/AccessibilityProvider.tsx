/* eslint-disable react-refresh/only-export-components */
/**
 * AccessibilityProvider - Context provider for accessibility settings
 *
 * Provides high contrast mode, reduced motion support, and other accessibility features
 * Respects user preferences from prefers-reduced-motion and prefers-contrast media queries
 *
 * @module components/base
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

/**
 * Accessibility context value interface
 */
export interface AccessibilityContextValue {
  readonly highContrast: boolean;
  readonly reducedMotion: boolean;
  readonly setHighContrast: (enabled: boolean) => void;
  readonly toggleHighContrast: () => void;
}

/**
 * Accessibility context
 */
const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null,
);

/**
 * Props for AccessibilityProvider
 */
export interface AccessibilityProviderProps {
  readonly children: React.ReactNode;
}

/**
 * AccessibilityProvider Component
 *
 * Provides accessibility settings throughout the component tree
 * Automatically detects user preferences for reduced motion
 *
 * @example
 * ```tsx
 * <AccessibilityProvider>
 *   <App />
 * </AccessibilityProvider>
 * ```
 */
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect user preference for reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Apply high contrast theme globally
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }
  }, [highContrast]);

  // Toggle high contrast mode
  const toggleHighContrast = useCallback(() => {
    setHighContrast((prev) => !prev);
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<AccessibilityContextValue>(
    () => ({
      highContrast,
      reducedMotion,
      setHighContrast,
      toggleHighContrast,
    }),
    [highContrast, reducedMotion, toggleHighContrast],
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

AccessibilityProvider.displayName = "AccessibilityProvider";

/**
 * Custom hook to access accessibility context
 *
 * @throws Error if used outside of AccessibilityProvider
 * @returns Accessibility context value
 *
 * @example
 * ```tsx
 * const { highContrast, reducedMotion, toggleHighContrast } = useAccessibility();
 * ```
 */
export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider",
    );
  }

  return context;
}
