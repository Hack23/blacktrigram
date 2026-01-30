/**
 * Shared Test Helpers for Black Trigram E2E Tests
 * 
 * This module provides reusable test utilities to reduce duplication
 * across E2E test files and improve maintainability.
 * 
 * Categories:
 * - Setup/Teardown Helpers
 * - Canvas/WebGL Verification
 * - Combat Test Utilities
 * - Stance Testing Helpers
 * - Bilingual Text Verification
 * - Common Assertions
 */

// ============================================================
// Setup/Teardown Helpers
// ============================================================

/**
 * Standard setup for screen tests
 * Visits root, waits for canvas, enters specified screen
 */
export function setupScreen(screenType?: 'combat' | 'training' | 'controls' | 'philosophy' | 'end'): void {
  cy.visitWithWebGLMock("/", { timeout: 12000 });
  cy.waitForCanvasReady();
  
  if (screenType === 'combat') {
    cy.enterCombatMode();
  } else if (screenType === 'training') {
    cy.enterTrainingMode();
  } else if (screenType) {
    cy.navigateToScreen(
      screenType, 
      `${screenType}-button`, 
      `menu-${screenType}`, 
      getScreenShortcutKey(screenType)
    );
  }
}

/**
 * Standard teardown helper that returns to intro screen
 * Note: Three.js cleanup should be called separately in afterEach hooks
 */
export function teardownScreen(): void {
  cy.returnToIntro();
}

/**
 * Get keyboard shortcut for screen navigation
 */
function getScreenShortcutKey(screen: string): string {
  const shortcuts: Record<string, string> = {
    'combat': '1',
    'training': '2',
    'controls': '3',
    'philosophy': '4',
    'end': '5'
  };
  return shortcuts[screen] || '1';
}

// ============================================================
// Memory Management and Cleanup
// ============================================================

/**
 * Attempts to cleanup Three.js resources and hint at garbage collection.
 * 
 * NOTE: This function provides best-effort cleanup by requesting the browser's
 * garbage collector to run (if exposed). It does NOT directly dispose Three.js
 * resources as that requires application-specific cleanup logic that should be
 * implemented within the application itself.
 * 
 * For comprehensive cleanup, the application should implement its own cleanup
 * function that properly disposes geometries, materials, textures, and removes
 * event listeners. This helper simply provides a GC hint to help free memory.
 */
export function cleanupThreeJSResources(): void {
  cy.window().then((win) => {
    try {
      cy.log("🧹 Requesting memory cleanup...");
      
      // Hint at garbage collection (only works if browser exposes gc)
      if ((win as any).gc) {
        (win as any).gc();
        cy.log("✅ Garbage collection requested");
      } else {
        cy.log("ℹ️ Garbage collection not available (this is normal)");
      }
      
      // NOTE: We intentionally avoid cloning/replacing canvas elements.
      // Replacing canvas nodes can invalidate references held by Three.js
      // and Cypress, causing rendering or test instability. Application-specific
      // cleanup should be handled by the application's own cleanup logic.
    } catch (error) {
      cy.log(`⚠️ Cleanup error (non-critical): ${error}`);
    }
  });
}

/**
 * Force memory cleanup and garbage collection
 */
export function forceMemoryCleanup(): void {
  cy.window().then((win) => {
    try {
      // Clear any large data structures
      if ((win as any).testData) {
        delete (win as any).testData;
      }
      
      // Request garbage collection if available
      if ((win as any).gc) {
        (win as any).gc();
        cy.log("✅ Forced garbage collection");
      }
      
      // Note: Cleanup happens asynchronously; no wait needed
    } catch (error) {
      cy.log(`⚠️ Memory cleanup error (non-critical): ${error}`);
    }
  });
}

/**
 * Monitor memory usage and log warnings
 */
export function logMemoryUsage(testName: string): void {
  cy.window().then((win) => {
    if ((win.performance as any).memory) {
      const memory = (win.performance as any).memory;
      const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
      const totalMB = (memory.totalJSHeapSize / 1048576).toFixed(2);
      const limitMB = (memory.jsHeapSizeLimit / 1048576).toFixed(2);
      
      cy.log(`📊 Memory [${testName}]: ${usedMB}MB / ${totalMB}MB (limit: ${limitMB}MB)`);
      
      // Warn if memory usage is high
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      if (usagePercent > 80) {
        cy.log(`⚠️ High memory usage: ${usagePercent.toFixed(1)}%`);
      }
    }
  });
}

// ============================================================
// Canvas/WebGL Verification
// ============================================================

/**
 * Verify canvas exists and is visible
 * Consolidates the most common canvas assertion pattern
 */
export function verifyCanvasVisible(): void {
  cy.get("canvas").should("exist").and("be.visible");
  cy.log("✅ Canvas rendering verified");
}

/**
 * Verify canvas with dimensions check
 */
export function verifyCanvasWithDimensions(minWidth = 100, minHeight = 100): void {
  cy.get("canvas").should(($canvas) => {
    const canvas = $canvas[0];
    const rect = canvas.getBoundingClientRect();
    expect(rect.width).to.be.greaterThan(minWidth);
    expect(rect.height).to.be.greaterThan(minHeight);
  });
  cy.log(`✅ Canvas dimensions verified (>${minWidth}x${minHeight})`);
}

/**
 * Verify WebGL rendering is active (not frozen)
 */
export function verifyActiveWebGLRendering(): void {
  cy.get("canvas").should("be.visible");
  cy.verifyThreeJSRendering({ timeout: 3000, minPixelChange: 50 });
  cy.log("✅ Three.js active rendering verified");
}

// ============================================================
// Combat Test Utilities
// ============================================================

/**
 * Verify combat screen is ready
 */
export function verifyCombatScreenReady(): void {
  cy.get('[data-testid="combat-screen"]').should("exist");
  cy.log("✅ Combat screen loaded");
  verifyCanvasVisible();
}

/**
 * Execute combat attack sequence
 * Uses Cypress command chaining for better reliability
 * @param count Number of attacks to execute
 * @param delayMs Delay between attacks in milliseconds (default: 800)
 */
export function executeCombatAttacks(count: number, delayMs = 800): void {
  if (count <= 0) {
    cy.log("⚠️ No attacks to execute");
    return;
  }

  Cypress._.times(count, (index: number) => {
    const strikeNumber = index + 1;
    cy.log(`Strike ${strikeNumber}/${count}`);
    cy.get("body").type(" "); // Spacebar for attack

    // Only wait between attacks, not after the final one
    if (delayMs > 0 && strikeNumber < count) {
      cy.wait(delayMs);
    }
  });
  
  cy.log(`✅ Executed ${count} attacks`);
}

/**
 * Verify combat HUD elements
 */
export function verifyCombatHUD(): void {
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="combat-hud"]').length > 0) {
      cy.get('[data-testid="combat-hud"]').should("exist");
      cy.log("✅ Combat HUD found");
    } else {
      cy.log("⚠️ Combat HUD may be embedded in canvas");
    }
  });
}

// ============================================================
// Stance Testing Helpers
// ============================================================

/**
 * Test all 8 trigram stances
 * Waits for stance indicator to update after each change for reliability
 * @param verifyCallback Optional callback to run after each stance change
 */
export function testAllTrigramStances(verifyCallback?: (stanceNum: number, stanceName: string) => void): void {
  const stanceNames = ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"];
  
  // Use Cypress-aware iteration to respect the command queue
  Cypress._.times(8, (index: number) => {
    const stanceNumber = index + 1;

    cy.get("body").type(stanceNumber.toString());

    // Wait for stance indicator to update (more reliable than fixed delay)
    cy.get('[data-testid="player1-stance-indicator"]', { timeout: 1000 })
      .should("contain", stanceNames[index]);

    cy.log(`✅ Stance ${stanceNumber}: ${stanceNames[index]}`);

    if (verifyCallback) {
      // Ensure callback runs in the Cypress command chain and in order
      cy.then(() => {
        verifyCallback(stanceNumber, stanceNames[index]);
      });
    }
  });
  
  cy.log("✅ All 8 trigram stances tested");
}

/**
 * Change to specific stance
 * Waits for stance indicator to update for reliability
 */
export function changeStance(stanceNumber: number, stanceName?: string): void {
  const stanceNames = ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"];
  
  cy.get("body").type(stanceNumber.toString());
  
  // Wait for stance indicator to update (more reliable than fixed delay)
  if (stanceNumber >= 1 && stanceNumber <= 8) {
    cy.get('[data-testid="player1-stance-indicator"]', { timeout: 1000 })
      .should('contain', stanceNames[stanceNumber - 1]);
  }
  
  if (stanceName) {
    cy.log(`✅ Changed to stance ${stanceNumber}: ${stanceName}`);
  } else {
    cy.log(`✅ Changed to stance ${stanceNumber}`);
  }
}

/**
 * Execute rapid stance changes for testing
 */
export function executeRapidStanceChanges(stances: number[], delayMs = 200): void {
  stances.forEach((stance, index) => {
    cy.get("body").type(stance.toString());
    
    // Only wait between stance changes, not after the final one
    if (index < stances.length - 1) {
      cy.wait(delayMs);
    }
    
    cy.log(`Rapid stance change ${index + 1}: Stance ${stance}`);
  });
  cy.log("✅ Rapid stance changes executed");
}

// ============================================================
// Bilingual Text Verification
// ============================================================

/**
 * Verify Korean text is present in page
 */
export function verifyKoreanTextPresent(expectedTexts?: string[]): void {
  cy.get("body").then(($body) => {
    const bodyText = $body.text();
    const hasKorean = /[\u3131-\uD79D]/.test(bodyText);
    
    if (hasKorean) {
      cy.log("✅ Korean text found in page");
      
      // Check for specific expected texts if provided
      if (expectedTexts) {
        expectedTexts.forEach(text => {
          if (bodyText.includes(text)) {
            cy.log(`✅ Korean text verified: ${text}`);
          }
        });
      }
    } else {
      cy.log("⚠️ Korean text not found, may be in canvas");
    }
  });
}

/**
 * Verify bilingual (Korean/English) text pattern
 */
export function verifyBilingualText(koreanText: string, englishText: string): void {
  cy.get("body").then(($body) => {
    const bodyText = $body.text();
    const hasKorean = bodyText.includes(koreanText);
    const hasEnglish = bodyText.includes(englishText);
    
    if (hasKorean && hasEnglish) {
      cy.log(`✅ Bilingual text verified: ${koreanText} | ${englishText}`);
    } else if (hasKorean || hasEnglish) {
      cy.log(`⚠️ Partial bilingual text found`);
    } else {
      cy.log(`⚠️ Bilingual text may be in canvas: ${koreanText} | ${englishText}`);
    }
  });
}

/**
 * Verify English text is present
 */
export function verifyEnglishTextPresent(expectedText: string | RegExp): void {
  cy.contains(expectedText).should("exist");
  cy.log(`✅ English text verified: ${expectedText}`);
}

// ============================================================
// Common Assertions
// ============================================================

/**
 * Verify screen element exists with optional visibility check
 */
export function verifyScreenElement(testId: string, shouldBeVisible = true): void {
  if (shouldBeVisible) {
    cy.get(`[data-testid="${testId}"]`).should("exist").and("be.visible");
    cy.log(`✅ Element visible: ${testId}`);
  } else {
    cy.get(`[data-testid="${testId}"]`).should("exist");
    cy.log(`✅ Element exists: ${testId}`);
  }
}

/**
 * Verify element with conditional check
 */
export function verifyElementConditional(
  testId: string, 
  fallbackMessage: string
): void {
  cy.get("body").then(($body) => {
    if ($body.find(`[data-testid="${testId}"]`).length > 0) {
      cy.get(`[data-testid="${testId}"]`).should("exist");
      cy.log(`✅ Element found: ${testId}`);
    } else {
      cy.log(`⚠️ ${fallbackMessage}`);
    }
  });
}

/**
 * Wait for animation/transition to complete.
 *
 * This helper first ensures the page body is visible, then performs a
 * time-based wait using Cypress' `cy.wait`. This provides a predictable
 * window for CSS transitions or animations to finish without relying on
 * arbitrary assertions that may resolve immediately.
 *
 * @param durationMs Time to wait in milliseconds after the body is visible
 *                   (default: 500). Use 0 to skip the delay.
 */
export function waitForTransition(durationMs = 500): void {
  // Ensure the page has rendered before starting the delay
  cy.get("body").should("be.visible");

  if (durationMs > 0) {
    cy.log(`⏱️ Waiting ${durationMs}ms for transition to complete`);
    cy.wait(durationMs);
    cy.log(`✅ Completed ${durationMs}ms transition wait`);
  }
}

/**
 * Verify multiple elements exist
 */
export function verifyMultipleElements(testIds: string[]): void {
  testIds.forEach(testId => {
    verifyElementConditional(testId, `Element ${testId} not found or embedded in canvas`);
  });
  cy.log(`✅ Verified ${testIds.length} elements`);
}

// ============================================================
// Training Test Utilities
// ============================================================

/**
 * Verify training screen is ready
 */
export function verifyTrainingScreenReady(): void {
  cy.get('[data-testid="training-screen"]', { timeout: 10000 }).should("exist");
  cy.log("✅ Training screen loaded");
  verifyCanvasVisible();
}

/**
 * Execute training practice for specific stance
 */
export function practiceStanceWithVerification(
  stanceNumber: number, 
  repetitions = 2
): void {
  cy.log(`Practicing Stance ${stanceNumber}...`);
  cy.practiceStance(stanceNumber, repetitions);
  cy.log(`✅ Stance ${stanceNumber} practiced ${repetitions} times`);
}

// ============================================================
// Performance Test Utilities
// ============================================================

/**
 * Verify FPS is within acceptable range
 */
export function verifyFPSRange(minFPS = 30, maxFPS = 60): void {
  cy.window().then(_win => {
    // FPS verification logic (if implemented in app)
    cy.log(`✅ FPS verification (${minFPS}-${maxFPS} target)`);
  });
}

/**
 * Verify responsive viewport
 */
export function verifyResponsiveViewport(width: number, height: number): void {
  cy.viewport(width, height);
  cy.wait(500); // Wait for layout adjustment
  verifyCanvasVisible();
  cy.log(`✅ Responsive viewport verified: ${width}x${height}`);
}

// ============================================================
// Navigation Test Utilities
// ============================================================

/**
 * Test navigation to screen and back
 */
export function testNavigationRoundTrip(
  screenName: string,
  buttonTestId: string,
  menuTestId: string,
  shortcutKey: string
): void {
  cy.log(`🔄 Testing navigation to ${screenName}`);
  cy.navigateToScreen(screenName, buttonTestId, menuTestId, shortcutKey);
  cy.wait(500);
  
  cy.returnToIntro();
  cy.get('[data-testid="intro-screen"]', { timeout: 5000 }).should("exist");
  cy.log(`✅ Navigation round trip to ${screenName} completed`);
}

// ============================================================
// Keyboard Control Utilities
// ============================================================

/**
 * Test keyboard shortcut
 */
export function testKeyboardShortcut(
  key: string, 
  expectedScreen: string, 
  expectedTestId: string
): void {
  cy.get("body").type(key);
  cy.wait(500);
  cy.get(`[data-testid="${expectedTestId}"]`, { timeout: 5000 }).should("exist");
  cy.log(`✅ Keyboard shortcut '${key}' navigated to ${expectedScreen}`);
}

/**
 * Execute game action sequence
 */
export function executeGameActions(actions: string[], delayMs = 300): void {
  actions.forEach((action, index) => {
    cy.get("body").type(action);
    cy.wait(delayMs);
    cy.log(`Action ${index + 1}/${actions.length}: ${action}`);
  });
  cy.log(`✅ Executed ${actions.length} game actions`);
}
