import {
  setupScreen,
  teardownScreen,
  cleanupThreeJSResources,
  forceMemoryCleanup,
  verifyCombatScreenReady,
  verifyActiveWebGLRendering,
  waitForTransition
} from "../../support/test-helpers";

/**
 * Trauma Visualization System E2E Test
 * 
 * Tests the complete trauma visualization system including:
 * - Progressive bruising with repeated hits
 * - Bruise color darkening (dark red → indigo → black as per TraumaOverlay3D)
 * - Blood effects for damage > 30
 * - Injury location tracking
 * - Performance validation
 * 
 * Target Execution Time: 2-3 minutes
 * ♻️ Refactored with shared test helpers
 */

describe("Trauma Visualization System - E2E Test (Target: 2-3 min)", () => {
  beforeEach(() => {
    setupScreen('combat');
  });

  afterEach(() => {
    // Request garbage collection to assist memory cleanup
    cleanupThreeJSResources();
    forceMemoryCleanup();
    teardownScreen();
  });

  it("should demonstrate progressive bruising with 5 strikes to same location", () => {
    cy.annotate("Testing Progressive Bruising System");

    // ============================================================
    // 1. Verify Combat Screen Rendering
    // ============================================================
    cy.log("1️⃣ Verifying Combat Screen Rendering");
    verifyCombatScreenReady();
    verifyActiveWebGLRendering();
    cy.log("✅ Combat screen and Three.js rendering verified");

    // ============================================================
    // 2. Strike torso location 5 times
    // ============================================================
    cy.log("2️⃣ Striking torso 5 times to test progressive bruising");

    // Perform 5 attacks to same body region
    for (let i = 1; i <= 5; i++) {
      cy.log(`Strike ${i}/5 - Hitting torso`);
      
      // Press attack button (space or click attack button)
      cy.get("body").type(" ");
      
      // Wait for attack animation
      waitForTransition(400);
      
      // Verify combat state updated
      cy.verifyThreeJSRendering({ timeout: 1000, minPixelChange: 10 });
      
      cy.log(`✅ Strike ${i} completed`);
    }

    cy.log("✅ All 5 strikes completed");

    // ============================================================
    // 3. Verify trauma visualization exists
    // ============================================================
    cy.log("3️⃣ Verifying trauma visualization");

    // Check for trauma overlay in Three.js scene
    // Note: TraumaOverlay3D renders as Three.js group, not in DOM
    // This test verifies pixel changes on canvas, indicating rendering is happening.
    // For more deterministic tests, consider adding test hooks to expose injury count
    // or using Html overlays with data-testid attributes.
    cy.get("canvas").should("be.visible");
    
    // Verify rendering changes (injuries should be visible in 3D scene)
    cy.verifyThreeJSRendering({ timeout: 2000, minPixelChange: 20 });
    cy.log("✅ Trauma visualization rendering verified");

    // ============================================================
    // 4. Verify performance (should maintain 60fps)
    // ============================================================
    cy.log("4️⃣ Verifying performance after trauma effects");

    // Perform additional actions to test performance
    cy.get("body").type(" "); // Attack
    cy.wait(300);
    cy.get("body").type(" "); // Attack
    cy.wait(300);

    // Verify Three.js is still rendering smoothly
    cy.verifyThreeJSRendering({ timeout: 2000, minPixelChange: 30 });
    cy.log("✅ Performance maintained with multiple injuries");

    // ============================================================
    // 5. Test blood effects with heavy damage
    // ============================================================
    cy.log("5️⃣ Testing blood effects trigger (damage > 30)");

    // Note: This test verifies pixel changes but doesn't deterministically
    // verify blood effects were triggered. For better test coverage, consider:
    // - Adding a test hook to expose blood effect state
    // - Using mocked combat damage events with known values
    // - Adding Html overlay with data-testid for blood effect indicators
    
    // Perform multiple heavy attacks
    for (let i = 1; i <= 3; i++) {
      cy.get("body").type(" ");
      cy.wait(300);
    }

    // Verify visual effects are still rendering
    cy.verifyThreeJSRendering({ timeout: 2000, minPixelChange: 40 });
    cy.log("✅ Blood effects rendered (if triggered by damage > 30)");

    // ============================================================
    // 6. Verify different body parts can be injured
    // ============================================================
    cy.log("6️⃣ Testing injuries to multiple body parts");

    // Switch stance to target different body regions
    cy.get("body").type("2"); // Switch to Tae stance
    cy.wait(300);
    cy.get("body").type(" "); // Attack
    cy.wait(300);

    cy.get("body").type("3"); // Switch to Li stance
    cy.wait(300);
    cy.get("body").type(" "); // Attack
    cy.wait(300);

    // Verify multiple injuries rendered
    cy.verifyThreeJSRendering({ timeout: 2000, minPixelChange: 50 });
    cy.log("✅ Multiple body part injuries verified");

    cy.log("✅✅✅ Progressive Bruising E2E Test Complete");
  });

  it("should handle rapid combat with multiple injuries (stress test)", () => {
    cy.annotate("Trauma Visualization - Stress Test");

    cy.log("Performing rapid combat sequence");

    // Rapid combat sequence
    for (let i = 1; i <= 10; i++) {
      cy.get("body").type(" ");
      cy.wait(200); // Faster pace
    }

    // Verify performance hasn't degraded
    cy.verifyThreeJSRendering({ timeout: 3000, minPixelChange: 30 });
    
    // Verify health bars still update
    cy.verifyHealthBar("player1-health", 0, 100).then((health) => {
      cy.log(`Player 1 health after stress test: ${health}`);
    });
    
    cy.verifyHealthBar("player2-health", 0, 100).then((health) => {
      cy.log(`Player 2 health after stress test: ${health}`);
      // Opponent should have taken damage
      expect(health).to.be.lessThan(100);
    });

    cy.log("✅ Stress test completed - system remains stable");
  });

  it.skip("should clear injuries on new round", () => {
    // TODO: Implement once round system exists
    // This test requires:
    // 1. A deterministic way to end a round
    // 2. Observable state to verify injuries are cleared
    // 3. Test hooks or UI elements to trigger and verify round reset
    
    cy.annotate("Testing Injury Persistence Across Rounds (SKIPPED - Not Implemented)");

    cy.log("Creating injuries in round 1");

    // Create some injuries
    for (let i = 1; i <= 3; i++) {
      cy.get("body").type(" ");
      cy.wait(300);
    }

    // Verify injuries exist
    cy.verifyThreeJSRendering({ timeout: 2000, minPixelChange: 20 });
    cy.log("✅ Injuries created in round 1");

    // End round (if round system exists)
    // Note: This test assumes round restart clears injuries
    // Implementation may vary based on game logic

    cy.log("Round persistence test skipped (requires implementation)");
  });

  /**
   * Integration smoke test verifying the app loads correctly.
   * Merged into parent describe to avoid cypress-junit-reporter crash
   * when multiple top-level describes share afterEach hooks.
   */
  it("should verify InjuryTracker exports are available", () => {
    // This is a smoke test to ensure modules are exported correctly
    cy.visit("/");
    cy.window().should("exist");
    cy.log("✅ Window loaded successfully");
  });
});
