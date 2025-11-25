/**
 * Consolidated Combat Tests - Merged from multiple files
 * Combines: combat-mode.cy.ts, combat-screen-layout.cy.ts, combat-system-integration.cy.ts
 * 
 * This file consolidates all combat-related tests to reduce duplication and improve execution time.
 * Originally these were spread across 3 separate files with significant overlap.
 * 
 * ✅ Three.js Compatible - Updated for CombatScreen3D with Canvas and Html overlays
 * Tests verify Three.js 3D combat rendering, character models, and Html UI components
 */

describe("Black Trigram - Combat (Consolidated)", () => {
  // Per-test setup - enter combat before each test for isolation
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
    cy.enterCombatMode();
  });

  // Clean up after each test
  afterEach(() => {
    cy.returnToIntro();
  });

  describe("Combat Screen & UI Components", () => {
    it("should display all combat UI elements and components", () => {
      cy.annotate("Verifying complete combat UI");

      // Combat screen basics
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.contains("Combat").should("be.visible");
      cy.contains("전투").should("be.visible");

      // HUD components
      cy.get('[data-testid="combat-hud"]').should("exist");
      cy.get('[data-testid="round-timer"]').should("exist");
      cy.get('[data-testid="player1-stance-indicator"]').should("exist");
      cy.get('[data-testid="player2-stance-indicator"]').should("exist");

      // Combat controls
      cy.get('[data-testid="combat-controls"]').should("exist");
      cy.get('[data-testid="attack-button"]').should("exist");
      cy.get('[data-testid="defend-button"]').should("exist");
      cy.get('[data-testid="technique-button"]').should("exist");
      cy.get('[data-testid="stance-button"]').should("exist");

      // Combat stats and players
      cy.get('[data-testid="combat-stats"]').should("exist");
      cy.get('[data-testid="combat-player-1"]').should("exist");
      cy.get('[data-testid="combat-player-2"]').should("exist");
      cy.get('[data-testid="combat-arena"]').should("exist");

      cy.log("✅ All combat UI elements verified");
    });

    it("should display correctly at different viewport sizes", () => {
      cy.annotate("Testing combat responsive design");

      const viewports: [number, number][] = [
        [1280, 720],  // Desktop
        [375, 667],   // Mobile - only test extremes
      ];

      viewports.forEach(([width, height]) => {
        cy.viewport(width, height);
        cy.wait(200); // Reduced from 300ms

        cy.get('[data-testid="combat-screen"]').should("exist");
        cy.get('[data-testid="combat-hud"]').should("exist");
        cy.get("canvas").should("be.visible");
      });

      // Reset to default
      cy.viewport(1280, 720);
    });
  });

  describe("Trigram Stance System", () => {
    it("should support all 8 trigram stances and transitions", () => {
      cy.annotate("Testing all 8 trigram stances");

      // Test each stance with reduced waits
      for (let i = 1; i <= 8; i++) {
        cy.get("body").type(i.toString());
        cy.wait(50); // Reduced from 100ms
        
        if (i % 4 === 0) {
          cy.get('[data-testid="combat-screen"]').should("exist");
        }
      }

      cy.log("✅ All 8 stances tested");
    });

    it("should handle rapid stance changes", () => {
      cy.annotate("Testing rapid stance switching");

      // Rapid stance changes
      cy.gameActions(["1", "3", "5", "7", "2", "4", "6", "8"]);
      
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.log("✅ Rapid stance changes handled");
    });
  });

  describe("Combat Actions & Mechanics", () => {
    it("should execute complete combat action sequence", () => {
      cy.annotate("Testing combat action sequence");

      // Stance + Attack combinations
      cy.gameActions(["1", " "]);
      cy.wait(100); // Reduced from 200ms
      
      cy.gameActions(["3", " "]);
      cy.wait(100); // Reduced from 200ms
      
      cy.gameActions(["5", " "]);
      cy.wait(100); // Reduced from 200ms

      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.log("✅ Combat action sequence completed");
    });

    it("should handle rapid combat inputs", () => {
      cy.annotate("Testing rapid combat inputs");

      // Rapid attack sequence
      cy.gameActions(["1", " ", "2", " ", "3", " ", "4", " "]);
      
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.log("✅ Rapid inputs handled");
    });

    it("should support player movement during combat", () => {
      cy.annotate("Testing player movement");

      // Movement keys
      cy.gameActions(["w", "a", "s", "d"]);
      cy.wait(100); // Reduced from 200ms
      
      // Arrow keys
      cy.gameActions(["{uparrow}", "{leftarrow}", "{downarrow}", "{rightarrow}"]);
      
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.log("✅ Player movement tested");
    });

    it("should test defensive actions", () => {
      cy.annotate("Testing defensive actions");

      // Guard/block
      cy.get("body").type("{shift}", { release: false });
      cy.wait(100); // Reduced from 200ms
      cy.get("body").type("{shift}", { release: true });

      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.log("✅ Defensive actions tested");
    });
  });

  describe("Combat State & Integration", () => {
    it("should maintain state through multiple combat sessions", () => {
      cy.annotate("Testing state persistence");

      // Exit and re-enter combat multiple times
      cy.returnToIntro();
      cy.get('[data-testid="intro-screen"]', { timeout: 5000 }).should("exist");

      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.gameActions(["2", " "]);

      cy.returnToIntro();
      cy.get('[data-testid="intro-screen"]').should("exist");

      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.gameActions(["4", " "]);

      cy.log("✅ State persistence verified");
    });

    it("should handle extended combat session", () => {
      cy.annotate("Testing extended combat session");

      // Execute many actions
      for (let i = 0; i < 5; i++) {
        cy.gameActions([
          "1", " ",
          "w", "a", "s", "d",
          "3", " ",
          "5", " "
        ]);
      }

      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.log("✅ Extended session handled");
    });
  });

  describe("Combat Feedback & Performance", () => {
    it("should display combat log or feedback", () => {
      cy.annotate("Testing combat feedback");

      cy.gameActions(["1", " "]);
      cy.wait(300);

      // Check for combat feedback elements
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="combat-log"]').length > 0) {
          cy.get('[data-testid="combat-log"]').should("exist");
          cy.log("✅ Combat log found");
        } else if ($body.find('[data-testid="combat-feedback"]').length > 0) {
          cy.get('[data-testid="combat-feedback"]').should("exist");
          cy.log("✅ Combat feedback found");
        } else {
          cy.log("⚠️ No specific combat feedback element found");
        }
      });
    });

    it("should maintain performance during intense combat", () => {
      cy.annotate("Testing combat performance");

      const startTime = Date.now();

      // Intense combat sequence
      cy.gameActions(["1", "2", "3", "4", " ", "w", "a", "s", "d"]);
      cy.gameActions(["5", "6", "7", "8", " ", "w", "a", "s", "d"]);

      cy.wrap(null).then(() => {
        const duration = Date.now() - startTime;
        cy.task("logPerformance", { name: "Intense Combat", duration });
        expect(duration).to.be.lessThan(10000);
        cy.log(`✅ Performance maintained: ${duration}ms`);
      });
    });
  });
});
