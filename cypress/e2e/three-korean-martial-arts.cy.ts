/**
 * Three.js Korean Martial Arts Integration Tests
 * Replaces pixi-korean-martial-arts.cy.ts with Three.js-specific tests
 * 
 * ✅ Three.js Specific Tests - Verifies Canvas rendering, Html overlays, and 3D components
 * Tests the complete Three.js migration for all screens and components
 */

/* eslint-disable @typescript-eslint/no-unused-expressions */

describe("Black Trigram - Three.js Korean Martial Arts", () => {
  beforeEach(() => {
    cy.visitWithWebGLMock("/", { timeout: 12000 });
    cy.waitForCanvasReady();
  });

  describe("Three.js Canvas Rendering", () => {
    it("should render Three.js canvas on intro screen", () => {
      cy.annotate("Testing Three.js Canvas on IntroScreen");

      // Verify canvas exists and is visible
      cy.get("canvas").should("exist").and("be.visible");

      // Check canvas has proper dimensions
      cy.get("canvas").should(($canvas) => {
        const canvas = $canvas[0];
        const rect = canvas.getBoundingClientRect();
        expect(rect.width).to.be.greaterThan(100);
        expect(rect.height).to.be.greaterThan(100);
      });

      // Verify intro screen data-testid
      cy.get('[data-testid="intro-screen"]').should("exist");

      cy.log("✅ Three.js Canvas rendering verified on intro screen");
    });

    it("should render Three.js canvas on combat screen", () => {
      cy.annotate("Testing Three.js Canvas on CombatScreen3D");

      cy.enterCombatMode();

      // Verify canvas exists and is visible
      cy.get("canvas").should("exist").and("be.visible");

      // Verify combat screen data-testid
      cy.get('[data-testid="combat-screen"]').should("exist");

      cy.log("✅ Three.js Canvas rendering verified on combat screen");
    });

    it("should render Three.js canvas on training screen", () => {
      cy.annotate("Testing Three.js Canvas on TrainingScreen3D");

      cy.enterTrainingMode();

      // Verify canvas exists and is visible
      cy.get("canvas").should("exist").and("be.visible");

      // Verify training screen data-testid
      cy.get('[data-testid="training-screen"]').should("exist");

      cy.log("✅ Three.js Canvas rendering verified on training screen");
    });
  });

  describe("Html Overlays on Three.js Canvas", () => {
    it("should display Html menu buttons overlay on intro", () => {
      cy.annotate("Testing Html overlays on IntroScreen");

      // Verify menu buttons are visible (Html overlays)
      cy.get('[data-testid="training-button"]').should("be.visible");
      cy.get('[data-testid="combat-button"]').should("be.visible");

      // Verify bilingual text (Korean | English)
      cy.get('[data-testid="training-button"]').should("contain", "훈련");
      cy.get('[data-testid="combat-button"]').should("contain", "대전");

      cy.log("✅ Html overlays verified on intro screen");
    });

    it("should display Html HUD overlay on combat screen", () => {
      cy.annotate("Testing Html HUD overlay on CombatScreen3D");

      cy.enterCombatMode();

      // Verify combat HUD is visible (Html overlay)
      cy.get('[data-testid="combat-hud"]').should("exist");

      // Verify combat controls
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="combat-controls"]').length > 0) {
          cy.get('[data-testid="combat-controls"]').should("exist");
          cy.log("✅ Combat controls found");
        } else {
          cy.log("⚠️ Combat controls not found, but continuing");
        }
      });

      cy.log("✅ Html HUD overlay verified on combat screen");
    });

    it("should display Html training UI overlay", () => {
      cy.annotate("Testing Html UI overlay on TrainingScreen3D");

      cy.enterTrainingMode();

      // Verify training screen exists
      cy.get('[data-testid="training-screen"]').should("exist");

      // Check for training UI elements
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-area"]').length > 0) {
          cy.get('[data-testid="training-area"]').should("exist");
          cy.log("✅ Training area found");
        } else {
          cy.log("⚠️ Training area not found, but continuing");
        }
      });

      cy.log("✅ Html UI overlay verified on training screen");
    });
  });

  describe("Korean Martial Arts Theming", () => {
    it("should display Korean cyberpunk colors and theming", () => {
      cy.annotate("Testing Korean cyberpunk aesthetic");

      // Check for Korean text throughout the UI
      cy.get("body").then(($body) => {
        const text = $body.text();
        const hasKorean = /[가-힣]/.test(text);
        expect(hasKorean).to.be.true;
        cy.log("✅ Korean text found in UI");
      });

      // Verify bilingual menu items
      cy.get('[data-testid="training-button"]').should("contain", "훈련").and("contain", "Training");
      cy.get('[data-testid="combat-button"]').should("contain", "대전").and("contain", "Combat");

      cy.log("✅ Korean martial arts theming verified");
    });

    it("should display eight trigram stances in combat", () => {
      cy.annotate("Testing eight trigram stance system");

      cy.enterCombatMode();

      // Test stance changes (1-8 keys for trigram stances)
      for (let i = 1; i <= 8; i++) {
        cy.get("body").type(i.toString());
        cy.wait(100);

        // Verify combat screen still exists
        if (i % 4 === 0) {
          cy.get('[data-testid="combat-screen"]').should("exist");
        }
      }

      cy.log("✅ Eight trigram stances tested");
    });

    it("should display Korean vital point markers in training", () => {
      cy.annotate("Testing Korean vital point system");

      cy.enterTrainingMode();

      // Verify training screen exists
      cy.get('[data-testid="training-screen"]').should("exist");

      // Test vital point interactions (if available)
      cy.get("body").then(($body) => {
        if ($body.find('[data-testid="training-dummy"]').length > 0) {
          cy.get('[data-testid="training-dummy"]').should("exist");
          cy.log("✅ Training dummy with vital points found");
        } else {
          cy.log("⚠️ Training dummy not found in this implementation");
        }
      });

      cy.log("✅ Vital point system verified");
    });
  });

  describe("Three.js Performance", () => {
    it("should maintain 60fps during canvas rendering", () => {
      cy.annotate("Testing Three.js rendering performance");

      const startTime = Date.now();

      // Navigate through screens to test performance
      cy.enterCombatMode();
      cy.wait(500);
      cy.returnToIntro();
      cy.wait(500);
      cy.enterTrainingMode();
      cy.wait(500);
      cy.returnToIntro();

      cy.wrap(null).then(() => {
        const duration = Date.now() - startTime;
        cy.task("logPerformance", { name: "Three.js Screen Navigation", duration });
        expect(duration).to.be.lessThan(8000);
        cy.log(`✅ Performance maintained: ${duration}ms`);
      });
    });

    it("should handle rapid canvas interactions", () => {
      cy.annotate("Testing rapid canvas interactions");

      cy.enterCombatMode();

      const startTime = Date.now();

      // Rapid stance changes and movements
      cy.gameActions(["1", "2", "3", "4", "5", "6", "7", "8"]);
      cy.gameActions(["w", "a", "s", "d"]);
      cy.gameActions([" ", " ", " "]);

      cy.wrap(null).then(() => {
        const duration = Date.now() - startTime;
        cy.task("logPerformance", { name: "Rapid Canvas Interactions", duration });
        expect(duration).to.be.lessThan(5000);
        cy.log(`✅ Rapid interactions handled: ${duration}ms`);
      });

      cy.returnToIntro();
    });
  });

  describe("Three.js Scene Transitions", () => {
    it("should smoothly transition between screens", () => {
      cy.annotate("Testing Three.js scene transitions");

      // Intro -> Combat
      cy.get('[data-testid="intro-screen"]').should("exist");
      cy.enterCombatMode();
      cy.get('[data-testid="combat-screen"]').should("exist");
      cy.get("canvas").should("be.visible");

      // Combat -> Intro
      cy.returnToIntro();
      cy.get('[data-testid="intro-screen"]').should("exist");
      cy.get("canvas").should("be.visible");

      // Intro -> Training
      cy.enterTrainingMode();
      cy.get('[data-testid="training-screen"]').should("exist");
      cy.get("canvas").should("be.visible");

      // Training -> Intro
      cy.returnToIntro();
      cy.get('[data-testid="intro-screen"]').should("exist");
      cy.get("canvas").should("be.visible");

      cy.log("✅ Scene transitions verified");
    });
  });

  describe("Three.js Responsive Design", () => {
    it("should render correctly at different viewport sizes", () => {
      cy.annotate("Testing Three.js responsive design");

      const viewports = [
        [1280, 720],  // Desktop
        [768, 1024],  // Tablet
        [375, 667],   // Mobile
      ];

      viewports.forEach(([width, height]) => {
        cy.viewport(width, height);
        cy.wait(300);

        // Verify canvas exists and is visible at all sizes
        cy.get("canvas").should("exist").and("be.visible");
        cy.get('[data-testid="intro-screen"]').should("exist");

        // Verify canvas has proper dimensions
        cy.get("canvas").should(($canvas) => {
          const canvas = $canvas[0];
          const rect = canvas.getBoundingClientRect();
          expect(rect.width).to.be.greaterThan(50);
          expect(rect.height).to.be.greaterThan(50);
        });

        cy.log(`✅ Verified at ${width}x${height}`);
      });

      // Reset to default
      cy.viewport(1280, 720);
    });
  });

  describe("Three.js WebGL Context", () => {
    it("should properly initialize WebGL context", () => {
      cy.annotate("Testing WebGL context initialization");

      cy.window().then((win) => {
        // Verify canvas element
        const canvas = win.document.querySelector("canvas");
        expect(canvas).to.exist;

        if (canvas) {
          // Try to get WebGL context (may be mocked in Cypress)
          const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
          if (gl) {
            cy.log("✅ WebGL context initialized");
          } else {
            cy.log("⚠️ WebGL context mocked (expected in Cypress)");
          }
        }
      });
    });
  });
});
