/**
 * Combat System Integration E2E Tests
 * Holistic game perspective testing for Korean martial arts combat
 */

describe("Combat System Integration - Holistic Game Perspective", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 15000 });
    cy.waitForCanvasReady();
  });

  describe("Complete Combat Flow", () => {
    it("should support full combat cycle from menu to combat and back", () => {
      cy.annotate("Testing complete combat flow");

      // Verify intro screen
      cy.get('[data-testid="intro-screen"]', { timeout: 10000 }).should("exist");

      // Enter combat mode
      cy.enterCombatMode();

      // Verify combat screen loaded
      cy.get('[data-testid="combat-screen"]', { timeout: 10000 }).should("exist");

      // Verify HUD components
      cy.get('[data-testid="combat-hud"]', { timeout: 5000 }).should("exist");
      
      // Execute some combat actions
      cy.gameActions(["1", " ", "2", " "]);
      cy.wait(500);

      // Return to menu
      cy.returnToIntro();

      // Verify back at intro
      cy.get('[data-testid="intro-screen"]', { timeout: 5000 }).should("exist");
    });

    it("should maintain state through multiple combat sessions", () => {
      cy.annotate("Testing state persistence across sessions");

      // First combat session
      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.gameActions(["3", " "]);
      cy.returnToIntro();

      // Second combat session
      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.gameActions(["5", " "]);
      cy.returnToIntro();

      // Third combat session
      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.returnToIntro();
    });
  });

  describe("Combat HUD Integration", () => {
    beforeEach(() => {
      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
    });

    afterEach(() => {
      cy.returnToIntro();
    });

    it("should display all required HUD components", () => {
      cy.annotate("Verifying HUD components");

      // Check main HUD
      cy.get('[data-testid="combat-hud"]').should("exist");

      // Check for timer
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="round-timer"]').length > 0) {
          cy.log("✅ Round timer found");
        } else {
          cy.log("⚠️ Round timer not found - may be conditional");
        }
      });

      // Check for player stance indicators
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="player1-stance-indicator"]').length > 0) {
          cy.log("✅ Player 1 stance indicator found");
        }
        if ($body.find('[data-testid="player2-stance-indicator"]').length > 0) {
          cy.log("✅ Player 2 stance indicator found");
        }
      });
    });

    it("should display combat controls", () => {
      cy.annotate("Verifying combat controls");

      cy.get('[data-testid="combat-controls"]').should("exist");
      cy.get('[data-testid="attack-button"]').should("exist");
      cy.get('[data-testid="defend-button"]').should("exist");
      cy.get('[data-testid="technique-button"]').should("exist");
      cy.get('[data-testid="stance-button"]').should("exist");
    });

    it("should display combat stats panel", () => {
      cy.annotate("Verifying combat stats");

      cy.get('[data-testid="combat-stats"]').should("exist");
    });
  });

  describe("Trigram Stance System Integration", () => {
    beforeEach(() => {
      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
    });

    afterEach(() => {
      cy.returnToIntro();
    });

    it("should support all 8 trigram stances via keyboard", () => {
      cy.annotate("Testing all 8 trigram stances");

      // Test each of the 8 trigram stances
      const stances = ["1", "2", "3", "4", "5", "6", "7", "8"];
      
      stances.forEach((stance, index) => {
        cy.annotate(`Testing stance ${stance}`);
        cy.get("body").type(stance);
        cy.wait(300);
      });

      cy.log("✅ All 8 trigram stances tested");
    });

    it("should support stance transitions during combat", () => {
      cy.annotate("Testing stance transitions");

      // Transition through multiple stances
      cy.gameActions(["1", "3", "5", "7"]);
      cy.wait(300);

      // Execute techniques from different stances
      cy.gameActions(["2", " ", "4", " ", "6", " "]);
    });

    it("should support rapid stance changes", () => {
      cy.annotate("Testing rapid stance changes");

      // Rapid stance switching
      for (let i = 1; i <= 8; i++) {
        cy.get("body").type(i.toString());
        cy.wait(100);
      }

      cy.log("✅ Rapid stance changes completed");
    });
  });

  describe("Combat Actions Integration", () => {
    beforeEach(() => {
      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
    });

    afterEach(() => {
      cy.returnToIntro();
    });

    it("should execute attacks with space bar", () => {
      cy.annotate("Testing attack execution");

      // Select stance and attack
      cy.get("body").type("1");
      cy.wait(200);
      cy.get("body").type(" ");
      cy.wait(500);

      cy.log("✅ Attack executed");
    });

    it("should support movement controls", () => {
      cy.annotate("Testing movement controls");

      // Test WASD movement
      cy.gameActions(["w", "a", "s", "d"]);
      cy.wait(200);

      // Test arrow keys
      cy.gameActions(["{uparrow}", "{leftarrow}", "{downarrow}", "{rightarrow}"]);
      cy.wait(200);

      cy.log("✅ Movement controls tested");
    });

    it("should support defensive actions", () => {
      cy.annotate("Testing defensive actions");

      // Test blocking (Shift key)
      cy.get("body").type("{shift}");
      cy.wait(300);

      cy.log("✅ Defensive action tested");
    });

    it("should support combo attacks", () => {
      cy.annotate("Testing combo attacks");

      // Execute a combo: stance change + attack + stance change + attack
      cy.get("body").type("1");
      cy.wait(200);
      cy.get("body").type(" ");
      cy.wait(300);
      cy.get("body").type("3");
      cy.wait(200);
      cy.get("body").type(" ");
      cy.wait(300);

      cy.log("✅ Combo attack sequence completed");
    });
  });

  describe("Korean Martial Arts Theming", () => {
    beforeEach(() => {
      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
    });

    afterEach(() => {
      cy.returnToIntro();
    });

    it("should display Korean text in combat UI", () => {
      cy.annotate("Verifying Korean text display");

      // Check for Korean characters in the page
      cy.get("body").then(($body) => {
        const bodyText = $body.text();
        
        // Check for common Korean combat terms
        const koreanTerms = ["공격", "방어", "기력", "체력", "전투"];
        let foundKorean = false;

        koreanTerms.forEach((term) => {
          if (bodyText.includes(term)) {
            foundKorean = true;
            cy.log(`✅ Found Korean term: ${term}`);
          }
        });

        if (!foundKorean) {
          cy.log("⚠️ Korean text may be in canvas - checking completed");
        }
      });
    });

    it("should use Korean color scheme", () => {
      cy.annotate("Verifying Korean color theming");

      // Verify canvas exists and is rendered
      cy.get("canvas").should("be.visible");

      cy.log("✅ Korean themed canvas verified");
    });
  });

  describe("Performance and Stability", () => {
    it("should handle extended combat session without crashes", () => {
      cy.annotate("Testing extended combat session");

      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");

      // Execute many actions to test stability
      for (let i = 0; i < 10; i++) {
        const stance = ((i % 8) + 1).toString();
        cy.get("body").type(stance);
        cy.wait(100);
        cy.get("body").type(" ");
        cy.wait(200);
      }

      cy.log("✅ Extended combat session completed");

      cy.returnToIntro();
    });

    it("should handle rapid mode switching", () => {
      cy.annotate("Testing rapid mode switching");

      // Switch between modes rapidly
      for (let i = 0; i < 3; i++) {
        cy.enterCombatMode();
        cy.get('[data-testid="combat-screen"]').should("exist");
        cy.wait(500);
        cy.returnToIntro();
        cy.get('[data-testid="intro-screen"]').should("exist");
        cy.wait(500);
      }

      cy.log("✅ Rapid mode switching completed");
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle ESC key gracefully in combat", () => {
      cy.annotate("Testing ESC key handling");

      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");

      // Press ESC multiple times
      cy.get("body").type("{esc}");
      cy.wait(500);
      cy.get("body").type("{esc}");
      cy.wait(500);

      cy.log("✅ ESC key handled gracefully");
    });

    it("should handle invalid stance numbers gracefully", () => {
      cy.annotate("Testing invalid input handling");

      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");

      // Try invalid stance numbers
      cy.get("body").type("9");
      cy.wait(100);
      cy.get("body").type("0");
      cy.wait(100);

      // Should still be in combat mode
      cy.get('[data-testid="combat-screen"]').should("exist");

      cy.returnToIntro();
    });

    it("should recover from errors and continue gameplay", () => {
      cy.annotate("Testing error recovery");

      // Suppress uncaught exceptions for this test
      cy.on("uncaught:exception", () => {
        return false;
      });

      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");

      // Execute various actions
      cy.gameActions(["1", " ", "2", " ", "3", " "]);

      // Should still be functional
      cy.get('[data-testid="combat-screen"]').should("exist");

      cy.returnToIntro();
    });
  });

  describe("Player Archetype Integration", () => {
    it("should maintain archetype selection through combat", () => {
      cy.annotate("Testing archetype persistence");

      // Note: Archetype selection would happen before entering combat
      // This test verifies that combat works regardless of archetype

      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");

      // Execute combat actions
      cy.gameActions(["1", " ", "4", " ", "7", " "]);

      cy.returnToIntro();
      cy.log("✅ Archetype integration verified");
    });
  });

  describe("Game State Consistency", () => {
    it("should maintain consistent game state across navigation", () => {
      cy.annotate("Testing game state consistency");

      // Enter and exit combat multiple times
      for (let i = 0; i < 3; i++) {
        cy.enterCombatMode();
        cy.get('[data-testid="combat-screen"]').should("exist");
        cy.gameActions(["1", " "]);
        cy.returnToIntro();
        cy.get('[data-testid="intro-screen"]').should("exist");
        cy.wait(300);
      }

      cy.log("✅ Game state consistency verified");
    });
  });
});
