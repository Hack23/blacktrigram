/**
 * Test Isolation Utilities for Black Trigram
 * Provides comprehensive state management and cleanup between tests
 * to ensure zero flaky tests and complete test independence.
 */

/**
 * TestIsolation class manages test state and provides cleanup utilities
 * to ensure each test starts with a clean, predictable environment.
 */
export class TestIsolation {
  private static originalState: {
    localStorage: Record<string, string>;
    sessionStorage: Record<string, string>;
    location: string;
    gameState: unknown;
  } | null = null;

  /**
   * Captures the current browser state for potential restoration
   */
  static captureState(): void {
    cy.window().then((win) => {
      const localStorageCopy: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          localStorageCopy[key] = localStorage.getItem(key) || "";
        }
      }

      const sessionStorageCopy: Record<string, string> = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          sessionStorageCopy[key] = sessionStorage.getItem(key) || "";
        }
      }

      TestIsolation.originalState = {
        localStorage: localStorageCopy,
        sessionStorage: sessionStorageCopy,
        location: win.location.href,
        gameState: (win as unknown as { __gameState?: unknown }).__gameState
          ? { ...(win as unknown as { __gameState: unknown }).__gameState }
          : null,
      };
    });
  }

  /**
   * Restores the previously captured browser state
   */
  static restoreState(): void {
    if (!TestIsolation.originalState) {
      return;
    }

    cy.window().then((win) => {
      const state = TestIsolation.originalState;
      if (!state) return;

      // Restore localStorage
      localStorage.clear();
      Object.keys(state.localStorage).forEach((key) => {
        localStorage.setItem(key, state.localStorage[key]);
      });

      // Restore sessionStorage
      sessionStorage.clear();
      Object.keys(state.sessionStorage).forEach((key) => {
        sessionStorage.setItem(key, state.sessionStorage[key]);
      });

      // Restore game state
      if (state.gameState) {
        (win as unknown as { __gameState: unknown }).__gameState = {
          ...state.gameState,
        };
      }
    });
  }

  /**
   * Resets browser to a clean initial state
   * Clears all storage, timers, and game-specific state
   */
  static resetToCleanState(): void {
    cy.window().then((win) => {
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Reset game state to initial
      const gameStateWin = win as unknown as {
        __gameState?: {
          player1: null;
          player2: null;
          currentScreen: string;
          combat: {
            isActive: boolean;
            turn: number;
          };
        };
      };

      if (gameStateWin.__gameState) {
        gameStateWin.__gameState = TestIsolation.getInitialGameState();
      }

      // Timer cleanup is intentionally omitted.
      // Rely on Cypress/browser isolation between tests to clear timers.
      // If explicit timer cleanup is needed, track timer IDs in a registry and clear only those.

      // Reset scroll position
      win.scrollTo(0, 0);

      // Clear any event listeners tracked by the app
      const eventListenersWin = win as unknown as {
        __eventListeners?: Array<() => void>;
      };
      if (eventListenersWin.__eventListeners) {
        eventListenersWin.__eventListeners.forEach((cleanup) => cleanup());
        eventListenersWin.__eventListeners = [];
      }
    });
  }

  /**
   * Returns the initial game state
   */
  static getInitialGameState(): {
    player1: null;
    player2: null;
    currentScreen: string;
    combat: {
      isActive: boolean;
      turn: number;
    };
  } {
    return {
      player1: null,
      player2: null,
      currentScreen: "intro",
      combat: {
        isActive: false,
        turn: 0,
      },
    };
  }

  /**
   * Cleans up all audio elements from the DOM
   */
  static cleanupAudio(): void {
    cy.document().then((doc) => {
      const audioElements = doc.getElementsByTagName("audio");
      Array.from(audioElements).forEach((audio) => {
        audio.pause();
        audio.remove();
      });
    });
  }

  /**
   * Cleans up PixiJS resources
   */
  static cleanupPixi(): void {
    cy.window().then((win) => {
      const pixiWin = win as unknown as {
        PIXI?: unknown;
        __pixiApp?: {
          destroy: (
            removeView: boolean,
            options?: { children?: boolean; texture?: boolean }
          ) => void;
        };
      };

      if (pixiWin.PIXI && pixiWin.__pixiApp) {
        try {
          pixiWin.__pixiApp.destroy(true, { children: true, texture: true });
          delete pixiWin.__pixiApp;
        } catch (error) {
          cy.log("Warning: PixiJS cleanup failed", error);
        }
      }
    });
  }

  /**
   * Complete cleanup - audio, PixiJS, and state
   */
  static cleanupAll(): void {
    TestIsolation.cleanupAudio();
    TestIsolation.cleanupPixi();
    TestIsolation.resetToCleanState();
  }
}

// Declare custom Cypress commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Isolate test environment by resetting to clean state
       */
      isolateTest(): Chainable<void>;

      /**
       * Cleanup test environment after test completion
       */
      cleanupTest(): Chainable<void>;

      /**
       * Capture current state for potential restoration
       */
      captureState(): Chainable<void>;

      /**
       * Restore previously captured state
       */
      restoreState(): Chainable<void>;
    }
  }
}

// Custom Cypress commands implementation
Cypress.Commands.add("isolateTest", () => {
  TestIsolation.resetToCleanState();
});

Cypress.Commands.add("cleanupTest", () => {
  TestIsolation.cleanupAll();
});

Cypress.Commands.add("captureState", () => {
  TestIsolation.captureState();
});

Cypress.Commands.add("restoreState", () => {
  TestIsolation.restoreState();
});
