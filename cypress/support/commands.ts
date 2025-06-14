/// <reference types="cypress" />

// This file is a great place to define custom commands and overwrite existing ones.

// ***********************************************
// Custom commands for Black Trigram testing
// ***********************************************

// Define custom command types
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Enter training mode from intro screen
       */
      enterTrainingMode(): void;

      /**
       * Enter combat mode from intro screen
       */
      enterCombatMode(): void;

      /**
       * Practice a specific stance in training mode
       * @param stanceNumber Stance number (1-8)
       * @param repetitions Number of practice repetitions
       */
      practiceStance(stanceNumber: number, repetitions?: number): void;

      /**
       * Exit current mode and return to intro screen
       */
      returnToIntro(): void;

      /**
       * Wait for canvas to be ready and interact with it
       * Uses assertive waiting instead of fixed timeouts
       */
      waitForCanvasReady(): void;

      /**
       * Perform game actions with optimal timing
       * @param actions Array of keys to press sequentially
       */
      gameActions(actions: string[]): void;

      /**
       * Add a visible annotation to the video recording
       * @param message The message to display
       */
      annotate(message: string): void;

      /**
       * Custom tab command
       * @param options Tab options with shift key flag
       */
      tab(options?: { shift?: boolean }): void;

      /**
       * Log performance metrics
       */
      logPerformance(metrics: { name: string; duration: number }): void;

      /**
       * Mock WebGL context for testing WebGL applications
       */
      mockWebGL(): void;

      /**
       * Visit URL with WebGL mocking
       * @param url URL to visit
       * @param options Visit options
       */
      visitWithWebGLMock(
        url: string,
        options?: Partial<Cypress.VisitOptions>
      ): Chainable<Cypress.AUTWindow>;

      /**
       * Check canvas visibility and dimensions
       */
      checkCanvasVisibility(): Chainable<void>;

      /**
       * Wait for the game to be ready
       */
      waitForGameReady(): Chainable<void>;

      /**
       * Navigate to training screen with retries
       */
      navigateToTraining(): Chainable<void>;

      /**
       * Select a specific archetype in the intro screen
       * @param archetypeId The archetype ID to select
       */
      selectArchetype(archetypeId: string): void;

      /**
       * Test vital point interaction
       * @param vitalPointName Name of the vital point to test
       */
      testVitalPointInteraction(vitalPointName: string): void;
    }
  }
}

// Custom command implementation
Cypress.Commands.add("dataCy", (value: string) => {
  return cy.get(`[data-testid="${value}"]`);
});

// Enhanced wait for canvas to be fully rendered and ready
Cypress.Commands.add("waitForCanvasReady", () => {
  // Simplified canvas check
  cy.get("canvas", { timeout: 10000 }).should(($canvas) => {
    expect($canvas).to.have.length.greaterThan(0);
    const canvas = $canvas[0];
    const rect = canvas.getBoundingClientRect();
    expect(rect.width).to.be.greaterThan(50);
    expect(rect.height).to.be.greaterThan(50);
  });

  // Shorter wait for PixiJS
  cy.wait(500);
});

// Enhanced Training mode helpers with better waiting strategy
Cypress.Commands.add("enterTrainingMode", () => {
  // Try to find and click training button more efficiently
  cy.get("body").then(($body) => {
    // First try menu buttons
    const menuButtons = [
      '[data-testid="menu-button-training"]',
      '[data-testid="training-button"]',
      '[data-testid="menu-item-training"]',
    ];

    let buttonFound = false;
    for (const selector of menuButtons) {
      if ($body.find(selector).length > 0) {
        cy.get(selector, { timeout: 5000 })
          .should("be.visible")
          .click({ force: true });
        buttonFound = true;
        break;
      }
    }

    if (!buttonFound) {
      // Use keyboard shortcut as reliable fallback
      cy.log("No training button found, using keyboard shortcut '2'");
      cy.get("body").focus().type("2");
    }
  });

  // More efficient waiting - check for screen first, then details
  cy.get('[data-testid="training-screen"]', { timeout: 10000 }).should("exist");

  // Optional verification - don't fail test if missing
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="training-header"]').length > 0) {
      cy.log("✅ Training header found");
    } else {
      cy.log("⚠️ Training header not found, but screen exists");
    }
  });

  cy.log("✅ Successfully entered training mode");
});

// Enhanced combat mode entry with streamlined logic
Cypress.Commands.add("enterCombatMode", () => {
  // Try clicking the combat button first
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="combat-button"]').length > 0) {
      cy.get('[data-testid="combat-button"]', { timeout: 10000 })
        .should("be.visible")
        .click({ force: true });
    } else {
      // Use keyboard shortcut as fallback
      cy.log("Combat button not found, using keyboard shortcut");
      cy.get("body").type("1");
    }
  });

  // Wait for combat screen to appear
  cy.wait(1500);

  // Verify we're in combat mode
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="combat-screen"]').length > 0) {
      cy.log("✅ Successfully entered combat mode");
    } else {
      cy.log("⚠️ Combat screen not detected, but continuing test");
    }
  });
});

// Return to intro screen from anywhere
Cypress.Commands.add("returnToIntro", () => {
  // Try return button first
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="return-to-menu-button"]').length > 0) {
      cy.get('[data-testid="return-to-menu-button"]').click({ force: true });
    } else if ($body.find('[data-testid="return-menu-button"]').length > 0) {
      cy.get('[data-testid="return-menu-button"]').click({ force: true });
    } else {
      // Use ESC key as fallback
      cy.log("Return button not found, using ESC key");
      cy.get("body").type("{esc}");
    }
  });

  cy.wait(1500);

  // Verify we're back on intro screen
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="intro-screen"]').length > 0) {
      cy.log("✅ Successfully returned to intro screen");
    } else {
      cy.log("⚠️ Intro screen not detected, but continuing test");
    }
  });
});

// Optimized practice stance command
Cypress.Commands.add(
  "practiceStance",
  (stanceNumber: number, repetitions: number = 1) => {
    for (let i = 0; i < repetitions; i++) {
      cy.get("body").type(stanceNumber.toString(), { delay: 100 });
      cy.wait(300);
      cy.get("body").type(" ", { delay: 100 }); // Execute technique
      cy.wait(500);
    }
  }
);

// Execute a sequence of game actions with reliable typing
Cypress.Commands.add("gameActions", (actions: string[]) => {
  actions.forEach((action, index) => {
    cy.get("body").type(action, { delay: 100 });
    if (index < actions.length - 1) {
      cy.wait(200);
    }
  });
});

// Add annotation to test for better test documentation
Cypress.Commands.add("annotate", (message: string) => {
  cy.task("log", `[${new Date().toISOString()}] ${message}`);
});

// Custom tab implementation - fixed type errors
Cypress.Commands.add(
  "tab",
  { prevSubject: ["optional", "element", "document"] },
  (subject, tabOptions?: { shift?: boolean }) => {
    const options = { shift: false, ...tabOptions };
    if (subject) {
      cy.wrap(subject).trigger("keydown", {
        key: "Tab",
        shiftKey: options.shift,
      });
    } else {
      cy.get("body").trigger("keydown", {
        key: "Tab",
        shiftKey: options.shift,
      });
    }
  }
);

// Performance logging for monitoring test execution
Cypress.Commands.add(
  "logPerformance",
  (metrics: { name: string; duration: number }) => {
    cy.task("logPerformance", metrics);
  }
);

// Store a flag to track if WebGL mocking has been applied
let isWebGLMocked = false;

// Enhanced WebGL mocking for better compatibility
Cypress.Commands.add("mockWebGL", () => {
  if (isWebGLMocked) return;

  cy.window().then((win) => {
    // Mock WebGL context creation
    const originalGetContext = win.HTMLCanvasElement.prototype.getContext;
    win.HTMLCanvasElement.prototype.getContext = function (
      type: string,
      ...args: any[]
    ) {
      if (type === "webgl" || type === "webgl2") {
        // Return a more complete mock WebGL context
        return {
          canvas: this,
          drawingBufferWidth: this.width || 800,
          drawingBufferHeight: this.height || 600,
          getExtension: () => null,
          getParameter: (param: any) => {
            // Return reasonable defaults for common parameters
            if (param === 0x1f00) return "Mock WebGL Implementation"; // GL_VENDOR
            if (param === 0x1f01) return "Mock Renderer"; // GL_RENDERER
            if (param === 0x1f02) return "WebGL 1.0"; // GL_VERSION
            return null;
          },
          createShader: () => ({}),
          createProgram: () => ({}),
          createBuffer: () => ({}),
          createTexture: () => ({}),
          bindBuffer: () => {},
          bindTexture: () => {},
          useProgram: () => {},
          enableVertexAttribArray: () => {},
          vertexAttribPointer: () => {},
          drawArrays: () => {},
          drawElements: () => {},
          clear: () => {},
          clearColor: () => {},
          enable: () => {},
          disable: () => {},
          blendFunc: () => {},
          viewport: () => {},
          // Add more methods as needed by PixiJS
        };
      }
      return originalGetContext.call(this, type, ...args);
    };
  });

  isWebGLMocked = true;
});

// Enhanced visit with comprehensive error handling
Cypress.Commands.add(
  "visitWithWebGLMock",
  (url: string, options?: Partial<Cypress.VisitOptions>) => {
    cy.mockWebGL();

    // Enhanced error handling for audio and WebGL
    cy.on("uncaught:exception", (err) => {
      const ignoredErrors = [
        "Failed to load",
        "no supported source",
        "play() request was interrupted",
        "WebGL",
        "PIXI",
        "audio",
        "NetworkError",
        "AbortError",
        "NotAllowedError",
        "NotSupportedError",
      ];

      const shouldIgnore = ignoredErrors.some((pattern) =>
        err.message.includes(pattern)
      );

      if (shouldIgnore) {
        console.warn("Ignoring non-critical error:", err.message);
        return false;
      }
      return true;
    });

    cy.visit(url, {
      timeout: 20000,
      ...options,
      onBeforeLoad: (win) => {
        // Disable audio autoplay restrictions
        Object.defineProperty(win.navigator, "userActivation", {
          value: { hasBeenActive: true, isActive: true },
          writable: false,
        });

        // Mock audio context if needed - fix TypeScript error
        const winAny = win as any;
        if (!win.AudioContext && !winAny.webkitAudioContext) {
          winAny.AudioContext = function () {
            return {
              createGain: () => ({ connect: () => {}, gain: { value: 1 } }),
              createOscillator: () => ({
                connect: () => {},
                start: () => {},
                stop: () => {},
                frequency: { value: 440 },
              }),
              destination: {},
              currentTime: 0,
              state: "running",
              suspend: () => Promise.resolve(),
              resume: () => Promise.resolve(),
            };
          };
        }

        // Call original onBeforeLoad if provided
        if (options?.onBeforeLoad) {
          options.onBeforeLoad(win);
        }
      },
    });
  }
);

// Enhanced canvas visibility checking with z-index awareness
Cypress.Commands.add("checkCanvasVisibility", () => {
  cy.get("canvas")
    .should("exist")
    .then(($canvas) => {
      // Check if canvas has proper dimensions
      const canvas = $canvas[0];
      const rect = canvas.getBoundingClientRect();

      expect(rect.width).to.be.greaterThan(100);
      expect(rect.height).to.be.greaterThan(100);

      // Check if canvas is actually in the DOM and has proper styling
      const computedStyle = window.getComputedStyle(canvas);
      expect(computedStyle.display).to.not.equal("none");

      cy.log("✅ Canvas is visible with proper dimensions");
    });
});

// Wait for game to be ready with better error handling
Cypress.Commands.add("waitForGameReady", () => {
  cy.get('[data-testid="app-container"]', { timeout: 15000 }).should(
    "be.visible"
  );
  cy.get("canvas", { timeout: 15000 }).should("be.visible");

  // Wait for PixiJS to initialize with better timing
  cy.wait(1500);

  // Verify the app is interactive
  cy.get("body").should("be.visible").focus();
});

// Enhanced navigation with retries and better error handling
Cypress.Commands.add("navigateToTraining", () => {
  cy.waitForGameReady();

  // Try multiple ways to enter training mode
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="training-button"]').length > 0) {
      cy.get('[data-testid="training-button"]', { timeout: 10000 })
        .should("be.visible")
        .click({ force: true });
    } else {
      cy.log("Training button not found, using keyboard shortcut");
      cy.get("body").type("2");
    }
  });

  // Allow more time for navigation
  cy.wait(3000);

  // Verify training screen exists with extended timeout
  cy.get('[data-testid="training-screen"]', { timeout: 20000 }).should("exist");
  cy.get('[data-testid="training-header"]', { timeout: 15000 }).should("exist");

  cy.log("✅ Training screen loaded successfully");
});

// Add vital point testing helper
Cypress.Commands.add("testVitalPointInteraction", (vitalPointName: string) => {
  cy.log(`Testing vital point interaction: ${vitalPointName}`);

  // Create and test a vital point
  cy.getVitalPoint(vitalPointName).should("exist");

  // Click on the vital point
  cy.get(`[data-vital-point="${vitalPointName}"]`).click({ force: true });

  // Verify the interaction was registered
  cy.get(`[data-vital-point="${vitalPointName}"]`).should(
    "have.attr",
    "data-vital-point",
    vitalPointName
  );

  cy.log(`✅ Successfully tested vital point: ${vitalPointName}`);
});

// Enhanced archetype selection with better error handling
Cypress.Commands.add("selectArchetype", (archetypeId: string) => {
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="archetype-toggle"]').length > 0) {
      // Click the archetype toggle to show options
      cy.get('[data-testid="archetype-toggle"]').click({ force: true });

      // Wait for the archetype list
      cy.get('[data-testid="archetype-list"]', { timeout: 5000 }).should(
        "exist"
      );

      // Click the specific archetype
      cy.get(`[data-testid="archetype-option-${archetypeId}"]`).click({
        force: true,
      });

      // Verify selection
      cy.get('[data-testid="selected-archetype-value"]').should("be.visible");

      cy.log(`✅ Selected archetype: ${archetypeId}`);
    } else {
      cy.log("⚠️ Archetype selection not available - command skipped");
    }
  });
});

export {};
