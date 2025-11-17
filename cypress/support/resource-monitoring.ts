/**
 * Resource Monitoring Utilities for Black Trigram
 * Detects resource leaks (audio, canvas, memory, event listeners)
 * to help identify tests that don't clean up properly.
 */

interface ResourceSnapshot {
  audioElements: number;
  canvasElements: number;
  eventListenerCount: number;
  memoryUsage: number;
  timestamp: number;
}

interface ResourceLeak {
  type: string;
  message: string;
  delta: number;
}

/**
 * ResourceMonitor class tracks resource usage before and after tests
 * to detect leaks and help maintain test reliability.
 */
export class ResourceMonitor {
  private static initialResources: ResourceSnapshot | null = null;

  /**
   * Start monitoring resources at the beginning of a test
   */
  static startMonitoring(): void {
    cy.window().then((win) => {
      ResourceMonitor.initialResources = {
        audioElements: document.getElementsByTagName("audio").length,
        canvasElements: document.getElementsByTagName("canvas").length,
        eventListenerCount: ResourceMonitor.countEventListeners(win),
        memoryUsage: ResourceMonitor.getMemoryUsage(win),
        timestamp: Date.now(),
      };

      cy.log(
        `📊 Resource Monitoring Started - Audio: ${ResourceMonitor.initialResources.audioElements}, Canvas: ${ResourceMonitor.initialResources.canvasElements}`
      );
    });
  }

  /**
   * Detect resource leaks by comparing current state to initial snapshot
   * Logs warnings if leaks are detected
   */
  static detectLeaks(): void {
    if (!ResourceMonitor.initialResources) {
      cy.log("⚠️ Resource monitoring was not started");
      return;
    }

    cy.window().then((win) => {
      const currentResources: ResourceSnapshot = {
        audioElements: document.getElementsByTagName("audio").length,
        canvasElements: document.getElementsByTagName("canvas").length,
        eventListenerCount: ResourceMonitor.countEventListeners(win),
        memoryUsage: ResourceMonitor.getMemoryUsage(win),
        timestamp: Date.now(),
      };

      const leaks: ResourceLeak[] = [];

      // Check for audio element leaks
      if (currentResources.audioElements > ResourceMonitor.initialResources.audioElements) {
        leaks.push({
          type: "Audio",
          message: `Audio elements leaked: ${
            currentResources.audioElements -
            ResourceMonitor.initialResources.audioElements
          }`,
          delta:
            currentResources.audioElements -
            ResourceMonitor.initialResources.audioElements,
        });
      }

      // Check for canvas element leaks
      if (currentResources.canvasElements > ResourceMonitor.initialResources.canvasElements) {
        leaks.push({
          type: "Canvas",
          message: `Canvas elements leaked: ${
            currentResources.canvasElements -
            ResourceMonitor.initialResources.canvasElements
          }`,
          delta:
            currentResources.canvasElements -
            ResourceMonitor.initialResources.canvasElements,
        });
      }

      // Check for event listener leaks
      const listenerDelta =
        currentResources.eventListenerCount -
        ResourceMonitor.initialResources.eventListenerCount;
      if (listenerDelta > 5) {
        // Allow some tolerance
        leaks.push({
          type: "EventListeners",
          message: `Event listeners leaked: ${listenerDelta}`,
          delta: listenerDelta,
        });
      }

      // Check for memory leaks (> 10MB growth)
      const memoryGrowthMB =
        (currentResources.memoryUsage -
          ResourceMonitor.initialResources.memoryUsage) /
        (1024 * 1024);
      if (memoryGrowthMB > 10) {
        leaks.push({
          type: "Memory",
          message: `Memory leaked: ${memoryGrowthMB.toFixed(2)}MB`,
          delta: memoryGrowthMB,
        });
      }

      // Log results
      if (leaks.length > 0) {
        cy.log("⚠️ Resource leaks detected:");
        leaks.forEach((leak) => {
          cy.log(`  - ${leak.message}`);
        });

        // Also log to task for CI reporting
        cy.task("log", `⚠️ Resource leaks: ${leaks.map((l) => l.message).join(", ")}`);
      } else {
        cy.log("✅ No resource leaks detected");
      }

      // Log memory usage details
      const duration = currentResources.timestamp - ResourceMonitor.initialResources.timestamp;
      cy.log(
        `📊 Test Duration: ${duration}ms, Memory Growth: ${memoryGrowthMB.toFixed(2)}MB`
      );
    });
  }

  /**
   * Count event listeners in the window
   * Note: This is a simplified approximation
   */
  private static countEventListeners(win: Window): number {
    // Try to use Chrome's getEventListeners if available (in Chromium browsers)
    const windowWithGetEventListeners = win as Window & {
      getEventListeners?: (element: EventTarget) => Record<string, unknown[]>;
    };

    if (windowWithGetEventListeners.getEventListeners) {
      try {
        const listeners = windowWithGetEventListeners.getEventListeners(win.document);
        return Object.values(listeners).reduce(
          (sum, arr) => sum + arr.length,
          0
        );
      } catch {
        // Fall through to fallback
      }
    }

    // Fallback: use app-tracked listeners if available
    const windowWithTracking = win as Window & {
      __eventListenerCount?: number;
    };

    return windowWithTracking.__eventListenerCount ?? 0;
  }

  /**
   * Get current memory usage from performance API
   */
  private static getMemoryUsage(win: Window): number {
    const performance = win.performance as Performance & {
      memory?: {
        usedJSHeapSize: number;
      };
    };

    return performance.memory?.usedJSHeapSize ?? 0;
  }

  /**
   * Log detailed resource report
   */
  static logResourceReport(): void {
    cy.window().then((win) => {
      const audioCount = document.getElementsByTagName("audio").length;
      const canvasCount = document.getElementsByTagName("canvas").length;
      const listenerCount = ResourceMonitor.countEventListeners(win);
      const memoryMB = ResourceMonitor.getMemoryUsage(win) / (1024 * 1024);

      cy.log("📊 Resource Report:");
      cy.log(`  Audio elements: ${audioCount}`);
      cy.log(`  Canvas elements: ${canvasCount}`);
      cy.log(`  Event listeners: ${listenerCount}`);
      cy.log(`  Memory usage: ${memoryMB.toFixed(2)}MB`);

      // Log to task for CI
      cy.task(
        "log",
        `Resource Report - Audio: ${audioCount}, Canvas: ${canvasCount}, Memory: ${memoryMB.toFixed(2)}MB`
      );
    });
  }

  /**
   * Force cleanup of all detectable resources
   */
  static forceCleanup(): void {
    cy.window().then((win) => {
      // Clean up audio elements
      const audioElements = document.getElementsByTagName("audio");
      Array.from(audioElements).forEach((audio) => {
        try {
          audio.pause();
          audio.src = "";
          audio.load();
          audio.remove();
        } catch (error) {
          cy.log("Warning: Failed to clean up audio element", error);
        }
      });

      // Clean up PixiJS if present
      const pixiWin = win as Window & {
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
          cy.log("Warning: Failed to clean up PixiJS", error);
        }
      }

      cy.log("✅ Forced resource cleanup complete");
    });
  }
}

// Declare custom Cypress commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Start monitoring resources at the beginning of a test
       */
      startResourceMonitoring(): Chainable<void>;

      /**
       * Detect and log any resource leaks
       */
      detectResourceLeaks(): Chainable<void>;

      /**
       * Log detailed resource usage report
       */
      logResourceReport(): Chainable<void>;

      /**
       * Force cleanup of all detectable resources
       */
      forceResourceCleanup(): Chainable<void>;
    }
  }
}

// Custom Cypress commands implementation
Cypress.Commands.add("startResourceMonitoring", () => {
  ResourceMonitor.startMonitoring();
});

Cypress.Commands.add("detectResourceLeaks", () => {
  ResourceMonitor.detectLeaks();
});

Cypress.Commands.add("logResourceReport", () => {
  ResourceMonitor.logResourceReport();
});

Cypress.Commands.add("forceResourceCleanup", () => {
  ResourceMonitor.forceCleanup();
});
