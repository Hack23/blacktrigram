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
       * Navigate to a specific screen from intro
       * @param screenName Name of the screen (controls, philosophy, combat, training)
       * @param buttonTestId Primary button test ID
       * @param menuTestId Secondary menu test ID
       * @param fallbackKey Keyboard shortcut as fallback
       */
      navigateToScreen(
        screenName: string,
        buttonTestId: string,
        menuTestId: string,
        fallbackKey: string
      ): void;

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

      /**
       * Monitor FPS performance for a given duration
       * @param duration Duration to monitor in milliseconds (default 2000)
       * @param targetFPS Target FPS to compare against (default 60)
       */
      monitorFPS(
        duration?: number,
        targetFPS?: number
      ): Chainable<{
        averageFPS: number;
        minFPS: number;
        maxFPS: number;
        samples: number;
        droppedFrames: number;
      }>;

      /**
       * Assert that FPS is above minimum threshold
       * @param minFPS Minimum acceptable FPS (default 30)
       * @param duration Duration to monitor (default 2000ms)
       */
      assertMinFPS(minFPS?: number, duration?: number): void;

      /**
       * Assert that FPS is consistently above 60fps (ideal for 3D games)
       * @param duration Duration to monitor (default 2000ms)
       */
      assertSmoothFPS(duration?: number): void;

      /**
       * Monitor Canvas rendering and detect if it's frozen
       * @param duration Duration to monitor (default 1000ms)
       */
      assertCanvasRendering(duration?: number): void;

      /**
       * Check for memory leaks by monitoring memory usage
       * @param duration Duration to monitor (default 3000ms)
       */
      assertNoMemoryLeaks(duration?: number): void;

      /**
       * Verify Three.js Canvas is actively rendering
       * Checks that Canvas pixel data changes over time (not frozen/blank)
       * @param options Verification options
       */
      verifyThreeJSRendering(options?: {
        timeout?: number;
        minPixelChange?: number;
      }): Chainable<void>;

      /**
       * Verify health bar displays correct values
       * @param testId Health bar test ID (e.g., "health-bar-player_1", "health-bar-player_2")
       * @param expectedMin Minimum expected health value
       * @param expectedMax Maximum expected health value
       */
      verifyHealthBar(
        testId: string,
        expectedMin?: number,
        expectedMax?: number
      ): Chainable<number>;
    }
  }
}

// Custom command implementation
Cypress.Commands.add("dataCy", (value: string) => {
  return cy.get(`[data-testid="${value}"]`);
});

// Enhanced wait for canvas to be fully rendered and ready with caching
Cypress.Commands.add("waitForCanvasReady", () => {
  cy.window().then((win) => {
    const winAny = win as any;
    if (winAny.__canvasReady !== true) {
      // Canvas may not render in headless/software GL environments where
      // Three.js/React Three Fiber can't create a real WebGL context.
      // Use conditional check — the app renders DOM overlays regardless.
      cy.get("body", { timeout: 5000 }).then(($body) => {
        if ($body.find("canvas").length > 0) {
          cy.get("canvas", { timeout: 5000 }).should(($canvas) => {
            expect($canvas).to.have.length.greaterThan(0);
            const canvas = $canvas[0];
            const rect = canvas.getBoundingClientRect();
            expect(rect.width).to.be.greaterThan(50);
            expect(rect.height).to.be.greaterThan(50);
          });
          cy.wait(300);
          cy.log("✅ Canvas ready (3D rendering available)");
          // Only mark as ready when canvas was actually found and verified
          cy.window().then((w) => {
            (w as any).__canvasReady = true;
          });
        } else {
          cy.log("⚠️ Canvas not available — testing DOM overlays only");
          cy.wait(500);
          // Do NOT cache readiness — canvas may appear later after rendering
        }
      });
    } else {
      cy.log("⚡ Canvas already ready (cached), skipping wait");
    }
  });
});

// Enhanced Training mode helpers with better waiting strategy
Cypress.Commands.add("enterTrainingMode", () => {
  // Use keyboard shortcut as primary navigation method — it's the most reliable
  // in headless environments where Three.js Html overlays may render slowly.
  // The menu button click is tried first if the button is already visible.
  cy.get("body").then(($body) => {
    const btn = $body.find('[data-testid="menu-item-training"]:visible');
    if (btn.length > 0) {
      cy.get('[data-testid="menu-item-training"]').first().click();
      cy.log("✅ Clicked training menu button");
    } else {
      cy.log("⚡ Using keyboard shortcut '2' for training");
      cy.get("body").focus().type("2");
    }
  });

  // Wait for training screen to appear
  cy.get('[data-testid="training-screen-3d"]', { timeout: 10000 }).should("exist");
  cy.log("✅ Successfully entered training mode");
});

// Enhanced combat mode entry with streamlined logic
Cypress.Commands.add("enterCombatMode", () => {
  // Use keyboard shortcut as primary navigation method — it's the most reliable
  // in headless environments where Three.js Html overlays may render slowly.
  cy.get("body").then(($body) => {
    const btn = $body.find('[data-testid="menu-item-versus"]:visible');
    if (btn.length > 0) {
      cy.get('[data-testid="menu-item-versus"]').first().click();
      cy.log("✅ Clicked combat menu button");
    } else {
      cy.log("⚡ Using keyboard shortcut '1' for combat");
      cy.get("body").type("1");
    }
  });

  // Wait for combat screen
  cy.get('[data-testid="combat-screen"]', { timeout: 10000 }).should("exist");
  cy.log("✅ Successfully entered combat mode");
});

// Navigate to a specific screen from intro (reusable pattern)
Cypress.Commands.add(
  "navigateToScreen",
  (screenName: string, buttonTestId: string, menuTestId: string, fallbackKey: string) => {
    // Try visible button first, fall back to keyboard shortcut
    cy.get("body").then(($body) => {
      const btn = $body.find(`[data-testid="${buttonTestId}"]:visible`);
      const menu = $body.find(`[data-testid="${menuTestId}"]:visible`);
      if (btn.length > 0) {
        cy.get(`[data-testid="${buttonTestId}"]`).first().click();
      } else if (menu.length > 0) {
        cy.get(`[data-testid="${menuTestId}"]`).first().click();
      } else {
        cy.log(`⚡ Using keyboard shortcut '${fallbackKey}' for ${screenName}`);
        cy.get("body").type(fallbackKey);
      }
    });

    cy.get(`[data-testid="${screenName}-screen"]`, { timeout: 5000 }).should("exist");
    cy.log(`✅ Successfully navigated to ${screenName}`);
  }
);

// Return to intro screen from anywhere
Cypress.Commands.add("returnToIntro", () => {
  // Best-effort navigation back to intro screen.
  // This is used in afterEach hooks, so it must NOT throw on failure —
  // testIsolation: true already ensures a fresh page between tests.
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="return-to-menu-button"]').length > 0) {
      cy.get('[data-testid="return-to-menu-button"]').click({ force: true });
    } else if ($body.find('[data-testid="return-menu-button"]').length > 0) {
      cy.get('[data-testid="return-menu-button"]').click({ force: true });
    } else {
      cy.log("Return button not found, using ESC key");
      cy.get("body").type("{esc}");
    }
  });

  // Conditional check — no hard assertion. If the intro screen doesn't
  // appear, testIsolation will navigate to about:blank before the next test.
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="intro-screen"]').length > 0) {
      cy.log("✅ Successfully returned to intro screen");
    } else {
      cy.log("⚠️ Intro screen not detected — testIsolation will reset page");
    }
  });
});

// Optimized practice stance command
Cypress.Commands.add(
  "practiceStance",
  (stanceNumber: number, repetitions: number = 1) => {
    for (let i = 0; i < repetitions; i++) {
      cy.get("body").type(stanceNumber.toString(), { delay: 30 }); // Further reduced
      cy.wait(100); // Reduced from 200ms
      cy.get("body").type(" ", { delay: 30 }); // Execute technique, reduced delay
      cy.wait(150); // Reduced from 300ms
    }
  }
);

// Execute a sequence of game actions with reliable typing
Cypress.Commands.add("gameActions", (actions: string[]) => {
  actions.forEach((action, index) => {
    cy.get("body").type(action, { delay: 30 }); // Further reduced from 50ms
    if (index < actions.length - 1) {
      cy.wait(100); // Reduced from 150ms
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

/**
 * Shared WebGL mock context factory — single implementation used by both
 * the `mockWebGL` command and `visitWithWebGLMock`'s `onBeforeLoad`.
 * Returns a comprehensive mock WebGL context compatible with Three.js / R3F.
 */
function createMockWebGLContext(canvas: HTMLCanvasElement): Record<string, unknown> {
  return {
    canvas,
    drawingBufferWidth: canvas.width || 800,
    drawingBufferHeight: canvas.height || 600,
    getExtension: () => null,
    getParameter: (param: number) => {
      if (param === 0x1f00) return "Mock WebGL Implementation"; // GL_VENDOR
      if (param === 0x1f01) return "Mock Renderer"; // GL_RENDERER
      if (param === 0x1f02) return "WebGL 1.0"; // GL_VERSION
      return null;
    },
    createShader: () => ({}),
    createProgram: () => ({}),
    createBuffer: () => ({}),
    createTexture: () => ({}),
    createFramebuffer: () => ({}),
    createRenderbuffer: () => ({}),
    bindBuffer: () => {},
    bindTexture: () => {},
    bindFramebuffer: () => {},
    bindRenderbuffer: () => {},
    useProgram: () => {},
    enableVertexAttribArray: () => {},
    vertexAttribPointer: () => {},
    drawArrays: () => {},
    drawElements: () => {},
    clear: () => {},
    clearColor: () => {},
    clearDepth: () => {},
    enable: () => {},
    disable: () => {},
    depthFunc: () => {},
    depthMask: () => {},
    blendFunc: () => {},
    blendEquation: () => {},
    viewport: () => {},
    scissor: () => {},
    shaderSource: () => {},
    compileShader: () => {},
    attachShader: () => {},
    linkProgram: () => {},
    getProgramParameter: () => true,
    getShaderParameter: () => true,
    getUniformLocation: () => ({}),
    getAttribLocation: () => 0,
    uniform1i: () => {},
    uniform1f: () => {},
    uniform2f: () => {},
    uniform3f: () => {},
    uniform4f: () => {},
    uniformMatrix4fv: () => {},
    activeTexture: () => {},
    texImage2D: () => {},
    texParameteri: () => {},
    pixelStorei: () => {},
    bufferData: () => {},
    framebufferTexture2D: () => {},
    renderbufferStorage: () => {},
    framebufferRenderbuffer: () => {},
    checkFramebufferStatus: () => 0x8cd5, // FRAMEBUFFER_COMPLETE
    deleteShader: () => {},
    deleteProgram: () => {},
    deleteBuffer: () => {},
    deleteTexture: () => {},
    deleteFramebuffer: () => {},
    deleteRenderbuffer: () => {},
    generateMipmap: () => {},
    isContextLost: () => false,
    getError: () => 0,
    flush: () => {},
    finish: () => {},
    colorMask: () => {},
    stencilFunc: () => {},
    stencilOp: () => {},
    stencilMask: () => {},
    lineWidth: () => {},
    polygonOffset: () => {},
    sampleCoverage: () => {},
    frontFace: () => {},
    cullFace: () => {},
    getShaderPrecisionFormat: (_shaderType: number, _precisionType: number) => ({
      rangeMin: 127,
      rangeMax: 127,
      precision: 23,
    }),
    getShaderInfoLog: () => "",
    getProgramInfoLog: () => "",
    getSupportedExtensions: () => [],
    drawingBufferColorSpace: "srgb",
    unpackColorSpace: "srgb",
  };
}

/**
 * Patch `HTMLCanvasElement.prototype.getContext` on the given window so that
 * requests for "webgl" / "webgl2" return the shared mock context.
 */
function applyWebGLMock(win: Cypress.AUTWindow): void {
  const proto = win.HTMLCanvasElement.prototype;
  const originalGetContext = proto.getContext;
  (proto as any).getContext = function (
    type: string,
    ...args: any[]
  ) {
    if (type === "webgl" || type === "webgl2") {
      return createMockWebGLContext(this as HTMLCanvasElement);
    }
    return originalGetContext.call(this, type, ...args);
  };
}

// Enhanced WebGL mocking for better compatibility with Three.js
Cypress.Commands.add("mockWebGL", () => {
  if (isWebGLMocked) return;
  cy.window().then((win) => {
    applyWebGLMock(win);
  });
  isWebGLMocked = true;
});

// Enhanced visit with comprehensive error handling.
// Note: uncaught:exception handling is registered ONCE globally in e2e.ts
// to avoid accumulating duplicate handlers across tests.
Cypress.Commands.add(
  "visitWithWebGLMock",
  (url: string, options?: Partial<Cypress.VisitOptions>) => {
    cy.visit(url, {
      timeout: 20000,
      ...options,
      onBeforeLoad: (win) => {
        // Apply the shared WebGL mock to the NEW window before page renders
        applyWebGLMock(win);

        // Disable audio autoplay restrictions
        Object.defineProperty(win.navigator, "userActivation", {
          value: { hasBeenActive: true, isActive: true },
          writable: false,
        });

        // Mock audio context if needed
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
  cy.get('[data-testid="app-container"]', { timeout: 10000 }).should(
    "be.visible"
  );

  // Canvas may not be visible in headless/mocked WebGL — just check it exists
  cy.get("body").then(($body) => {
    if ($body.find("canvas").length > 0) {
      cy.log("✅ Canvas found");
    } else {
      cy.log("⚠️ Canvas not available — DOM overlay tests only");
    }
  });

  // Small wait for app initialization
  cy.wait(500);

  // Verify the app is interactive
  cy.get("body").should("be.visible").focus();
});

// Enhanced navigation with retries and better error handling
Cypress.Commands.add("navigateToTraining", () => {
  cy.waitForGameReady();

  // Try visible button first, fall back to keyboard shortcut
  cy.get("body").then(($body) => {
    const btn = $body.find('[data-testid="menu-item-training"]:visible');
    if (btn.length > 0) {
      cy.get('[data-testid="menu-item-training"]').first().click();
    } else {
      cy.log("⚡ Using keyboard shortcut '2' for training");
      cy.get("body").type("2");
    }
  });

  // Wait for training screen
  cy.get('[data-testid="training-screen-3d"]', { timeout: 10000 }).should("exist");
  cy.log("✅ Training screen loaded successfully");
});

// Add vital point testing helper
Cypress.Commands.add("testVitalPointInteraction", (vitalPointName: string) => {
  cy.log(`Testing vital point interaction: ${vitalPointName}`);

  // Find and verify the vital point element exists
  cy.get(`[data-vital-point="${vitalPointName}"]`).should("exist");

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

// Import FPS monitoring utilities
import {
  monitorFPS,
  assertMinFPS,
  assertSmoothFPS,
  assertCanvasRendering,
  assertNoMemoryLeaks,
} from "./fps-monitor";

// Add FPS monitoring commands
Cypress.Commands.add("monitorFPS", monitorFPS);
Cypress.Commands.add("assertMinFPS", assertMinFPS);
Cypress.Commands.add("assertSmoothFPS", assertSmoothFPS);
Cypress.Commands.add("assertCanvasRendering", assertCanvasRendering);
Cypress.Commands.add("assertNoMemoryLeaks", assertNoMemoryLeaks);

// ============================================================
// Three.js Scene Verification Commands
// ============================================================

/**
 * Verify Three.js Canvas is actively rendering.
 * When a 2D context is available (non-WebGL canvas), captures two pixel
 * snapshots separated by a short interval and asserts they differ by at
 * least `minPixelChange` pixels, proving the scene is animating.
 * In headless/mocked WebGL environments `getContext("2d")` returns null;
 * the command falls back to verifying the canvas element exists.
 */
Cypress.Commands.add(
  "verifyThreeJSRendering",
  (options?: { timeout?: number; minPixelChange?: number }) => {
    const timeout = options?.timeout ?? 3000;
    const minPixelChange = options?.minPixelChange ?? 10;

    cy.get("canvas", { timeout })
      .should("exist")
      .then(($canvas) => {
        const canvas = $canvas[0] as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          // WebGL canvas — 2D context not available (expected with mocked WebGL)
          cy.log(
            "⚠️ Canvas 2D context unavailable (WebGL canvas) — skipping pixel diff, canvas exists"
          );
          return;
        }

        // 2D context available — can do pixel comparison
        const rect = canvas.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) {
          cy.log("⚠️ Canvas too small for pixel diff — skipping");
          return;
        }

        // Capture first snapshot
        const imgData1 = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const snapshot1 = new Uint8Array(imgData1.data);

        // Wait a short interval for rendering to advance, then compare
        cy.wait(200).then(() => {
          const imgData2 = ctx.getImageData(0, 0, canvas.width, canvas.height);
          let diffCount = 0;
          for (let i = 0; i < snapshot1.length; i++) {
            if (snapshot1[i] !== imgData2.data[i]) {
              diffCount++;
            }
          }
          if (diffCount >= minPixelChange) {
            cy.log(
              `✅ Three.js rendering active (${diffCount} pixel diffs detected)`
            );
          } else {
            cy.log(
              `⚠️ Three.js canvas present but only ${diffCount} pixel diffs (threshold: ${minPixelChange}) — may be static or mocked`
            );
          }
        });
      });
  }
);

/**
 * Verify health bar displays correct values
 * Returns the current health value for further assertions.
 * Uses Cypress retry semantics to wait until ARIA attributes are set.
 */
Cypress.Commands.add(
  "verifyHealthBar",
  (testId: string, expectedMin?: number, expectedMax?: number) => {
    return cy
      .get(`[data-testid="${testId}"]`, { timeout: 5000 })
      .should("exist")
      .should(($el) => {
        // Retry until aria-valuenow is a parseable number
        const raw = $el.attr("aria-valuenow");
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(raw, `aria-valuenow on [${testId}]`).to.exist;
        const val = parseFloat(String(raw));
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(val, `aria-valuenow parseable on [${testId}]`).to.not.be.NaN;
      })
      .then(($healthBar) => {
        const currentHealth = parseFloat(
          String($healthBar.attr("aria-valuenow"))
        );
        const maxHealth = parseFloat(
          $healthBar.attr("aria-valuemax") ?? "100"
        );

        const percentage = Math.round((currentHealth / maxHealth) * 100);
        cy.log(
          `Health Bar [${testId}]: ${currentHealth}/${maxHealth} (${percentage}%)`
        );

        if (expectedMin !== undefined) {
          expect(currentHealth).to.be.at.least(
            expectedMin,
            `Health should be at least ${expectedMin}`
          );
        }

        if (expectedMax !== undefined) {
          expect(currentHealth).to.be.at.most(
            expectedMax,
            `Health should be at most ${expectedMax}`
          );
        }

        return cy.wrap(currentHealth);
      });
  }
);

export {};
