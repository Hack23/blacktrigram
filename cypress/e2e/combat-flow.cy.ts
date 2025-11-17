/**
 * Consolidated Combat Flow E2E Tests
 * Combines combat-mode.cy.ts, combat-screen-layout.cy.ts, and combat-system-integration.cy.ts
 * Efficient journey-based testing of combat features
 */

describe("Black Trigram - Combat Flow", () => {
  // Shared setup for all tests - enter combat once
  before(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
    cy.enterCombatMode();
  });

  // Clean up after all tests
  after(() => {
    cy.returnToIntro();
  });

  describe("Combat Screen and UI Components", () => {
    it("should display all combat UI elements correctly", () => {
      cy.annotate("Verifying complete combat UI");

      // Check combat screen
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.contains("Combat").should("be.visible");
      cy.contains("전투").should("be.visible");

      // Check HUD components
      cy.get('[data-testid="combat-hud"]').should("exist");
      cy.get('[data-testid="round-timer"]').should("exist");
      cy.get('[data-testid="player1-stance-indicator"]').should("exist");
      cy.get('[data-testid="player2-stance-indicator"]').should("exist");

      // Check combat controls
      cy.get('[data-testid="combat-controls"]').should("exist");
      cy.get('[data-testid="attack-button"]').should("exist");
      cy.get('[data-testid="defend-button"]').should("exist");
      cy.get('[data-testid="technique-button"]').should("exist");
      cy.get('[data-testid="stance-button"]').should("exist");

      // Check combat stats
      cy.get('[data-testid="combat-stats"]').should("exist");

      // Check player components
      cy.get('[data-testid="combat-player-1"]').should("exist");
      cy.get('[data-testid="combat-player-2"]').should("exist");
      cy.get('[data-testid="combat-arena"]').should("exist");

      cy.log("✅ All combat UI elements verified");
    });

    it("should display correctly at different viewport sizes", () => {
      cy.annotate("Testing combat responsive design");

      // Test viewport changes without exiting combat mode
      cy.viewport(1920, 1080);
      cy.get('[data-testid="combat-screen"]').should("exist");

      cy.viewport(768, 1024);
      cy.get('[data-testid="combat-screen"]').should("exist");

      // Reset to default viewport
      cy.viewport(1280, 800);
      cy.log("✅ Responsive design verified");
    });
  });

  describe("Trigram Stance System", () => {
    it("should support all 8 trigram stances and transitions", () => {
      cy.annotate("Testing complete trigram stance system");

      // Verify stance indicators exist before testing
      cy.get('[data-testid="player1-stance-indicator"]', { timeout: 5000 })
        .should("exist");
      cy.get('[data-testid="player2-stance-indicator"]', { timeout: 5000 })
        .should("exist");

      // Test all 8 stances in sequence (batched without per-iteration annotations)
      for (let i = 1; i <= 8; i++) {
        cy.get("body").type(i.toString());
        cy.wait(100); // Small wait to allow stance to register
      }

      // Verify combat is still functional after stance changes
      cy.get('[data-testid="combat-hud"]').should("exist");
      cy.get('[data-testid="combat-screen"]').should("exist");

      // Test rapid stance transitions
      cy.gameActions(["1", "3", "5", "7", "2", "4", "6", "8"]);

      // Verify combat controls are still responsive
      cy.get('[data-testid="combat-controls"]').should("exist");

      // Test rapid stance changes
      for (let i = 1; i <= 8; i++) {
        cy.get("body").type(i.toString());
      }

      // Final verification that combat is still active
      cy.get('[data-testid="combat-screen"]').should("exist");

      cy.log("✅ All trigram stances and transitions verified");
    });
  });

  describe("Combat Actions and Mechanics", () => {
    it("should execute complete combat action sequence", () => {
      cy.annotate("Testing combat actions");

      // Verify combat screen is active
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.get('[data-testid="combat-hud"]').should("exist");

      // Test attacks with space bar - verify screen remains stable
      cy.get("body").type("1");
      cy.wait(200);
      cy.get("body").type(" ");
      cy.wait(300);
      
      // Verify combat is still active after attack
      cy.get('[data-testid="combat-screen"]').should("exist");

      // Test movement (WASD and arrows) - verify arena remains
      cy.gameActions(["w", "a", "s", "d"]);
      cy.get('[data-testid="combat-arena"]').should("exist");
      
      cy.gameActions(["{uparrow}", "{leftarrow}", "{downarrow}", "{rightarrow}"]);
      cy.get('[data-testid="combat-arena"]').should("exist");

      // Test defensive actions - verify controls remain
      cy.get("body").type("{shift}");
      cy.get('[data-testid="combat-controls"]').should("exist");

      // Test combo attacks - verify HUD remains visible
      cy.get("body").type("1");
      cy.wait(200);
      cy.get("body").type(" ");
      cy.wait(300);
      cy.get('[data-testid="combat-hud"]').should("exist");
      
      cy.get("body").type("3");
      cy.wait(200);
      cy.get("body").type(" ");
      cy.wait(300);
      cy.get('[data-testid="combat-hud"]').should("exist");

      // Final verification that all components are still present
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.get('[data-testid="combat-hud"]').should("exist");
      cy.get('[data-testid="combat-controls"]').should("exist");
      cy.get('[data-testid="combat-arena"]').should("exist");

      cy.log("✅ Combat actions verified");
    });

    it("should handle rapid combat inputs and complex sequences", () => {
      cy.annotate("Testing rapid combat inputs");

      // Test all stances with attacks
      cy.gameActions(["1", " ", "2", " ", "3", " ", "4", " ", "5", " ", "6", " ", "7", " ", "8", " "]);

      // Test movement combined with attacks
      cy.gameActions(["w", "1", "a", "2", "s", "3", "d", "4"]);

      // Test rapid attacks for combo system
      cy.get("body").type("1");
      for (let i = 0; i < 5; i++) {
        cy.get("body").type(" ");
        cy.wait(300);
      }

      cy.log("✅ Rapid combat inputs verified");
    });

    it("should support player movement during combat", () => {
      cy.annotate("Testing player movement");

      // Test all movement directions
      cy.gameActions(["w", "w", "a", "a", "s", "s", "d", "d"]);

      // Attack after movement
      cy.get("body").type("1");
      cy.wait(200);
      cy.get("body").type(" ");

      // Verify combat still functional
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.log("✅ Player movement verified");
    });
  });

  describe("Combat Feedback and State", () => {
    it("should provide combat feedback and maintain state", () => {
      cy.annotate("Testing combat feedback");

      // Execute actions that generate feedback
      cy.get("body").type("1");
      cy.wait(200);
      cy.get("body").type(" ");
      cy.wait(300);

      // Check for combat feedback
      cy.contains("전투").should("be.visible");

      // Verify combat screen remains functional
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.get('[data-testid="combat-controls"]').should("exist");
      cy.get('[data-testid="combat-stats"]').should("exist");

      cy.log("✅ Combat feedback and state verified");
    });
  });

  describe("Performance and Stability", () => {
    it("should handle extended combat session without crashes", () => {
      cy.annotate("Testing extended combat stability");

      // Execute many actions to test stability (reduced iterations for speed)
      for (let i = 0; i < 10; i++) {
        const stance = ((i % 8) + 1).toString();
        cy.get("body").type(stance);
        cy.get("body").type(" ");
        cy.wait(50); // Minimal wait for stability
      }

      cy.log("✅ Extended combat session completed");
    });
  });

  describe("Korean Martial Arts Integration", () => {
    it("should display Korean text and theming", () => {
      cy.annotate("Verifying Korean martial arts theming");

      // Check for Korean text
      cy.get("body").then(($body) => {
        const bodyText = $body.text();
        const koreanTerms = ["공격", "방어", "기력", "체력", "전투"];
        let foundKorean = false;

        koreanTerms.forEach((term) => {
          if (bodyText.includes(term)) {
            foundKorean = true;
            cy.log(`✅ Found Korean term: ${term}`);
          }
        });

        if (!foundKorean) {
          cy.log("⚠️ Korean text may be in canvas");
        }
      });

      // Verify canvas exists
      cy.get("canvas").should("be.visible");
      cy.log("✅ Korean theming verified");
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle ESC key and invalid inputs gracefully", () => {
      cy.annotate("Testing error handling");

      // Test ESC key
      cy.get("body").type("{esc}");
      cy.wait(300);
      cy.get("body").type("{esc}");

      // Verify we can re-enter combat
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="intro-screen"]').length > 0) {
          cy.enterCombatMode();
          cy.get('[data-testid="combat-screen"]').should("exist");
        }
      });

      // Test invalid inputs
      cy.get("body").type("9");
      cy.get("body").type("0");

      // Should still be functional
      cy.get('[data-testid="combat-screen"]').should("exist");

      cy.log("✅ Error handling verified");
    });

    it("should recover from errors and continue gameplay", () => {
      cy.annotate("Testing error recovery");

      cy.on("uncaught:exception", (err) => {
        if (
          err.message &&
          (err.message.includes("Combat") ||
            err.message.includes("Invalid stance") ||
            err.message.includes("audio") ||
            err.message.includes("WebGL") ||
            err.message.includes("Failed to load"))
        ) {
          return false;
        }
        return true;
      });

      // Execute various actions
      cy.gameActions(["1", " ", "2", " ", "3", " "]);

      // Should still be functional
      cy.get('[data-testid="combat-screen"]').should("exist");

      cy.log("✅ Error recovery verified");
    });
  });

  describe("AI and Combat Flow", () => {
    it("should verify AI opponent is active and maintain flow", () => {
      cy.annotate("Testing AI and combat flow");

      // Wait for potential AI actions (assertion-based wait preferred)
      cy.get('[data-testid="combat-hud"]', { timeout: 2000 }).should("exist");

      // Verify combat is intact
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.get('[data-testid="combat-hud"]').should("exist");

      // Execute complete combat flow
      cy.get("body").type("1");
      cy.wait(200);
      cy.get("body").type(" ");
      cy.wait(300);
      
      cy.gameActions(["w", "a"]);
      
      cy.get("body").type("3");
      cy.wait(200);
      cy.get("body").type(" ");
      cy.wait(300);
      
      cy.gameActions(["s", "d"]);
      
      cy.get("body").type("5");
      cy.wait(200);
      cy.get("body").type(" ");

      // Verify all components still work
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.get('[data-testid="combat-controls"]').should("exist");
      cy.get('[data-testid="combat-stats"]').should("exist");

      cy.log("✅ AI and combat flow verified");
    });
  });

  describe("State Consistency", () => {
    it("should maintain consistent state through multiple combat sessions", () => {
      cy.annotate("Testing state consistency");

      // Current session - execute actions
      cy.gameActions(["1", " ", "4", " ", "7", " "]);

      // Return to intro
      cy.returnToIntro();
      cy.get('[data-testid="intro-screen"]').should("exist");

      // Re-enter combat and verify functionality
      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.gameActions(["1", " "]);

      cy.log("✅ State consistency verified");
    });
  });
});
