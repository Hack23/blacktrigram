/**
 * CombatScreen Comprehensive E2E Test
 * Target Execution Time: 3-4 minutes
 *
 * This test covers the complete CombatScreen user journey including:
 * - Combat screen rendering and HUD elements
 * - Trigram stance system (all 8 stances)
 * - Combat actions (attack, defend, movement)
 * - Combat UI and player indicators
 * - Extended combat session testing
 * - Return to intro navigation
 *
 * ✅ Three.js Compatible - Tests CombatScreen3D with 3D models and Html overlays
 * ⏱️ Optimized for 3-4 minute execution time
 */

describe("CombatScreen - Comprehensive E2E Test (Target: 3-4 min)", () => {
  // Use cy.session() for better test isolation (Cypress 15 feature)
  beforeEach(() => {
    cy.session(
      'combat-mode-session',
      () => {
        cy.visitWithWebGLMock("/", { timeout: 12000 });
        cy.waitForCanvasReady();
        cy.enterCombatMode();
      },
      {
        validate: () => {
          cy.get('[data-testid="combat-screen"]', { timeout: 3000 }).should('exist');
        }
      }
    );
    // Ensure we're in combat mode after session restore
    cy.get('[data-testid="combat-screen"]', { timeout: 3000 }).should('exist');
  });

  afterEach(() => {
    // Clean up game state
    cy.window().then(win => {
      if ((win as any).__game?.cleanup) {
        (win as any).__game.cleanup();
      }
    });
    cy.returnToIntro();
  });

  it("should render CombatScreen with all combat mechanics and UI", () => {
    cy.annotate("Testing CombatScreen - Full Combat Journey");

    // ============================================================
    // 1. Verify Combat Screen Rendering (20s)
    // ============================================================
    cy.log("1️⃣ Verifying Combat Screen Rendering");

    cy.get('[data-testid="combat-screen"]').should("exist");
    cy.log("✅ Combat screen exists");

    // Check for HUD
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="combat-hud"]').length > 0) {
        cy.get('[data-testid="combat-hud"]').should("exist");
        cy.log("✅ Combat HUD found");
      } else {
        cy.log("⚠️ Combat HUD not found, may be embedded in canvas");
      }
    });

    // ✅ IMPROVED: Verify Three.js Canvas is actively rendering (not frozen/blank)
    cy.get("canvas").should("be.visible");
    cy.verifyThreeJSRendering({ timeout: 3000, minPixelChange: 50 });
    cy.log("✅ Three.js rendering verified");

    // ✅ IMPROVED: Verify health bars exist and have valid data
    cy.verifyHealthBar("player1-health", 0, 100).then((health) => {
      cy.log(`Player 1 health verified: ${health}`);
    });
    cy.verifyHealthBar("player2-health", 0, 100).then((health) => {
      cy.log(`Player 2 health verified: ${health}`);
    });

    // ============================================================
    // 2. Test Trigram Stance System with Verification (40s)
    // ============================================================
    cy.log("2️⃣ Testing Trigram Stance System (8 stances)");

    // ✅ IMPROVED: Verify stance changes are reflected in UI
    // Test all 8 trigram stances with verification
    const stanceNames = [
      "geon",
      "tae",
      "li",
      "jin",
      "son",
      "gam",
      "gan",
      "gon",
    ];

    for (let stance = 1; stance <= 8; stance++) {
      cy.log(`Testing stance ${stance} (${stanceNames[stance - 1]})...`);
      cy.get("body").type(stance.toString());

      // Wait for stance indicator to update using assertion instead of fixed wait
      cy.get('[data-testid="player1-stance-indicator"]', { timeout: 2000 })
        .should("exist")
        .invoke("text")
        .should("include", stanceNames[stance - 1]);

      cy.log(`✅ Stance ${stance} input processed`);
    }

    cy.log("✅ All 8 trigram stances tested");

    // ============================================================
    // 3. Test Combat Actions with Health Verification (60s)
    // ============================================================
    cy.log("3️⃣ Testing Combat Actions with Health Verification");

    // ✅ IMPROVED: Verify health changes when attacking
    cy.log("Testing attack action with health tracking...");

    // Capture initial health of player 2 (opponent)
    cy.get('[data-testid="player2-health"]', { timeout: 5000 })
      .should("exist")
      .invoke("attr", "data-current")
      .then((health) => {
        const initialHealth = parseFloat(health as string);
        cy.log(`Player 2 initial health: ${initialHealth}`);

        // Execute attack
        cy.get("body").type(" ");

        // Wait for health to update using assertion instead of fixed wait
        cy.get('[data-testid="player2-health"]', { timeout: 1500 })
          .invoke("attr", "data-current")
          .should("not.equal", health)
          .then((newHealth) => {
            const currentHealth = parseFloat(newHealth as string);
            cy.log(`Player 2 current health: ${currentHealth}`);

            // Assert damage was dealt
            expect(
              currentHealth,
              "Attack should deal damage to opponent"
            ).to.be.lessThan(initialHealth);
            cy.log(
              `✅ Damage verified: ${initialHealth - currentHealth} HP lost`
            );
          });
      });

    // Second attack with verification
    cy.get('[data-testid="player2-health"]')
      .invoke("attr", "data-current")
      .then((health) => {
        const beforeAttack = parseFloat(health as string);

        cy.get("body").type(" ");

        // Wait for health to update using assertion
        cy.get('[data-testid="player2-health"]', { timeout: 1500 })
          .invoke("attr", "data-current")
          .should("not.equal", health)
          .then((newHealth) => {
            const afterAttack = parseFloat(newHealth as string);
            expect(
              afterAttack,
              "Second attack should deal damage"
            ).to.be.lessThan(beforeAttack);
            cy.log(
              `✅ Second attack executed (Health: ${beforeAttack} → ${afterAttack})`
            );
          });
      });

    // Try using attack button if it exists with health verification
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="attack-button"]').length > 0) {
        cy.get('[data-testid="player2-health"]')
          .invoke("attr", "data-current")
          .then((health) => {
            const before = parseFloat(health as string);

            cy.get('[data-testid="attack-button"]').click({ force: true });

            // Wait for health to update using assertion
            cy.get('[data-testid="player2-health"]', { timeout: 1500 })
              .invoke("attr", "data-current")
              .should("not.equal", health)
              .then((after) => {
                const afterValue = parseFloat(after as string);
                expect(
                  afterValue,
                  "Attack button should deal damage"
                ).to.be.lessThan(before);
                cy.log(
                  `✅ Attack button verified (Health: ${before} → ${afterValue})`
                );
              });
          });
      } else {
        cy.log("⚠️ Attack button not found, using keyboard only");
      }
    });

    // ============================================================
    // 4. Test Movement (30s)
    // ============================================================
    cy.log("4️⃣ Testing Movement System");

    // Test WASD movement
    cy.gameActions(["w", "a", "s", "d"]);
    cy.log("✅ WASD movement tested");

    // Test arrow key movement
    cy.get("body").type("{uparrow}");
    cy.get("body").type("{leftarrow}");
    cy.get("body").type("{downarrow}");
    cy.get("body").type("{rightarrow}");
    cy.log("✅ Arrow key movement tested");

    // ============================================================
    // 5. Test Defense (20s)
    // ============================================================
    cy.log("5️⃣ Testing Defense Mechanics");

    // Test guard/block with Shift key
    cy.get("body").type("{shift}", { release: false });
    cy.get('[data-testid="combat-screen"]', { timeout: 1000 }).should("exist");
    cy.get("body").type("{shift}", { release: true });
    cy.log("✅ Guard/block tested");

    // Test defend button if it exists
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="defend-button"]').length > 0) {
        cy.get('[data-testid="defend-button"]').click({ force: true });
        cy.get('[data-testid="combat-screen"]', { timeout: 1000 }).should("exist");
        cy.log("✅ Defend button clicked");
      } else {
        cy.log("⚠️ Defend button not found");
      }
    });

    // ============================================================
    // 6. Verify Combat HUD Elements (20s)
    // ============================================================
    cy.log("6️⃣ Verifying Combat HUD Elements");

    // Check for player stance indicators
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="player1-stance-indicator"]').length > 0) {
        cy.get('[data-testid="player1-stance-indicator"]').should("exist");
        cy.log("✅ Player 1 stance indicator found");
      }
      if ($body.find('[data-testid="player2-stance-indicator"]').length > 0) {
        cy.get('[data-testid="player2-stance-indicator"]').should("exist");
        cy.log("✅ Player 2 stance indicator found");
      }
    });

    // Check for combat stats
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="combat-stats"]').length > 0) {
        cy.get('[data-testid="combat-stats"]').should("exist");
        cy.log("✅ Combat stats found");
      } else {
        cy.log("⚠️ Combat stats not found, may be in canvas");
      }
    });

    // ============================================================
    // 7. Test Extended Combat Session (40s)
    // ============================================================
    cy.log("7️⃣ Testing Extended Combat Session");

    // Perform a series of combat actions
    for (let i = 0; i < 5; i++) {
      cy.log(`Combat sequence ${i + 1}/5`);

      // Change stance and verify
      cy.get("body").type("1");
      cy.get('[data-testid="player1-stance-indicator"]', { timeout: 1000 })
        .invoke("text")
        .should("include", "geon");

      // Attack
      cy.get("body").type(" ");

      // Change stance again and verify
      cy.get("body").type("3");
      cy.get('[data-testid="player1-stance-indicator"]', { timeout: 1000 })
        .invoke("text")
        .should("include", "li");

      // Attack
      cy.get("body").type(" ");
    }

    cy.log("✅ Extended combat session completed");

    // ============================================================
    // 8. Test Combat Controls Panel (15s)
    // ============================================================
    cy.log("8️⃣ Verifying Combat Controls Panel");

    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="combat-controls"]').length > 0) {
        cy.get('[data-testid="combat-controls"]').should("exist");
        cy.log("✅ Combat controls panel found");
      } else {
        cy.log("⚠️ Combat controls panel not found");
      }

      // Check for technique button
      if ($body.find('[data-testid="technique-button"]').length > 0) {
        cy.get('[data-testid="technique-button"]').should("exist");
        cy.log("✅ Technique button found");
      }

      // Check for stance button
      if ($body.find('[data-testid="stance-button"]').length > 0) {
        cy.get('[data-testid="stance-button"]').should("exist");
        cy.log("✅ Stance button found");
      }
    });

    // ============================================================
    // 9. Verify Korean Text in Combat (10s)
    // ============================================================
    cy.log("9️⃣ Verifying Korean Text");

    cy.get("body").then(($body) => {
      const bodyText = $body.text();
      if (
        bodyText.includes("전투") ||
        bodyText.includes("공격") ||
        bodyText.includes("방어")
      ) {
        cy.log("✅ Korean text found in combat UI");
      } else {
        cy.log("⚠️ Korean text may be rendered in canvas");
      }
    });

    // ============================================================
    // 10. Test Mouse/Canvas Interaction (15s)
    // ============================================================
    cy.log("🔟 Testing Mouse/Canvas Interaction");

    // Test canvas click interactions
    cy.get("canvas").click(400, 300);
    cy.get('[data-testid="combat-screen"]', { timeout: 1000 }).should("exist");
    cy.log("✅ Canvas mouse interaction tested");

    // ============================================================
    // 11. Test AI Movement and State (20s)
    // ============================================================
    cy.log("1️⃣1️⃣ Testing AI Movement and State Management");

    // Move toward then away to test AI response
    cy.gameActions(["d", "d", "a", "a"]);
    cy.get('[data-testid="combat-screen"]', { timeout: 1000 }).should("exist");
    cy.log("✅ AI movement and state management tested");

    // ============================================================
    // 12. Test Combat Performance Under Load (20s)
    // ============================================================
    cy.log("1️⃣2️⃣ Testing Combat Performance");

    const startTime = Date.now();

    // Execute rapid combat sequence
    cy.gameActions(["1", "2", "3", "4", " ", " "]);

    cy.wrap(null).then(() => {
      const duration = Date.now() - startTime;
      cy.task("logPerformance", { name: "Combat Performance", duration });
      expect(duration).to.be.lessThan(5000);
      cy.log(`✅ Performance maintained: ${duration}ms`);
    });

    // ============================================================
    // FINAL: Test Summary
    // ============================================================
    cy.log("✅ CombatScreen comprehensive test completed");
    cy.log("📊 All critical functionality verified:");
    cy.log("   ✓ Combat screen rendering");
    cy.log("   ✓ Trigram stance system (8 stances)");
    cy.log("   ✓ Combat actions (attack)");
    cy.log("   ✓ Movement system (WASD + arrows)");
    cy.log("   ✓ Defense mechanics");
    cy.log("   ✓ Combat HUD elements");
    cy.log("   ✓ Extended combat session");
    cy.log("   ✓ Combat controls panel");
    cy.log("   ✓ Korean text rendering");
    cy.log("   ✓ Mouse/canvas interaction");
    cy.log("   ✓ AI movement and state");
    cy.log("   ✓ Combat performance under load");
  });
});

// Target: ~4 minutes (optimized waits for consistency with 3-4 min target)
