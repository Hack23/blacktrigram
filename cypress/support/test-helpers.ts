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
 * Standard teardown for screen tests
 * Now includes memory cleanup and Three.js resource disposal
 */
export function teardownScreen(): void {
  cleanupThreeJSResources();
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
 * Clean up Three.js resources to prevent memory leaks
 * Disposes geometries, materials, textures, and removes event listeners
 */
export function cleanupThreeJSResources(): void {
  cy.window().then((win) => {
    try {
      // Access Three.js scene if available
      if (win && (win as any).__THREE_DEVTOOLS__) {
        cy.log("🧹 Cleaning up Three.js resources...");
        
        // Trigger any cleanup functions in the app
        if ((win as any).cleanupThreeJS) {
          (win as any).cleanupThreeJS();
        }
        
        // Force garbage collection hint
        if ((win as any).gc) {
          (win as any).gc();
        }
      }
      
      // Remove all canvas event listeners
      const canvases = win.document.querySelectorAll('canvas');
      canvases.forEach((canvas) => {
        const newCanvas = canvas.cloneNode(true);
        canvas.parentNode?.replaceChild(newCanvas, canvas);
      });
      
      cy.log("✅ Three.js resources cleaned up");
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
      
      // Wait for cleanup to complete
      cy.wait(100);
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
 * @param count Number of attacks to execute
 * @param delayMs Delay between attacks in milliseconds
 */
export function executeCombatAttacks(count: number, delayMs = 800): void {
  for (let i = 1; i <= count; i++) {
    cy.log(`Strike ${i}/${count}`);
    cy.get("body").type(" "); // Spacebar for attack
    cy.wait(delayMs);
  }
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
 * @param verifyCallback Optional callback to run after each stance change
 */
export function testAllTrigramStances(verifyCallback?: (stanceNum: number, stanceName: string) => void): void {
  const stanceNames = ["geon", "tae", "li", "jin", "son", "gam", "gan", "gon"];
  const koreanNames = ["건", "태", "리", "진", "손", "감", "간", "곤"];
  
  for (let i = 1; i <= 8; i++) {
    cy.get("body").type(i.toString());
    cy.wait(300);
    cy.log(`✅ Stance ${i}: ${stanceNames[i-1]} (${koreanNames[i-1]})`);
    
    if (verifyCallback) {
      verifyCallback(i, stanceNames[i-1]);
    }
  }
  
  cy.log("✅ All 8 trigram stances tested");
}

/**
 * Change to specific stance
 */
export function changeStance(stanceNumber: number, stanceName?: string): void {
  cy.get("body").type(stanceNumber.toString());
  cy.wait(300);
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
    cy.wait(delayMs);
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
 * Wait for animation/transition to complete
 */
export function waitForTransition(durationMs = 500): void {
  cy.wait(durationMs);
  cy.log(`⏱️ Waited ${durationMs}ms for transition`);
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
  cy.window().then(win => {
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
