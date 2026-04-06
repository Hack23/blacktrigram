/// <reference types="cypress" />

// This file is a great place to define custom commands and overwrite existing ones.

// ***********************************************
// Custom commands for Black Trigram testing
// ***********************************************

import { isRunningInCI } from "./env";

/** Delay before keyboard fallback — allows menu keyboard handler to mount */
const KEYBOARD_HANDLER_MOUNT_DELAY = 1000;
/** Timeout for detecting screen transitions in slow CI environments */
const SCREEN_DETECTION_TIMEOUT = 20000;

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
      assertMinFPS(minFPS?: number, duration?: number): Chainable<void>;

      /**
       * Assert that FPS is consistently above 60fps (ideal for 3D games)
       * @param duration Duration to monitor (default 2000ms)
       */
      assertSmoothFPS(duration?: number): Chainable<void>;

      /**
       * Monitor Canvas rendering and detect if it's frozen
       * @param duration Duration to monitor (default 1000ms)
       */
      assertCanvasRendering(duration?: number): Chainable<void>;

      /**
       * Check for memory leaks by monitoring memory usage
       * @param duration Duration to monitor (default 3000ms)
       */
      assertNoMemoryLeaks(duration?: number): Chainable<void>;

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
          cy.get("canvas", { timeout: 5000 }).then(($canvas) => {
            expect($canvas).to.have.length.greaterThan(0);
            const canvas = $canvas[0];
            const rect = canvas.getBoundingClientRect();
            const hasRenderableSize = rect.width > 50 && rect.height > 50;

            if (hasRenderableSize) {
              cy.log("✅ Canvas ready (3D rendering available)");
            } else {
              cy.log("⚠️ Canvas detected with limited layout size — continuing with DOM overlay testing");
            }
          });
          cy.wait(300);
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
      // Try clicking the button with force if it exists but isn't visible
      const btnExists = $body.find('[data-testid="menu-item-training"]');
      if (btnExists.length > 0) {
        cy.get('[data-testid="menu-item-training"]').first().click({ force: true });
        cy.log("✅ Force-clicked training menu button (not visible)");
      } else {
        // Wait a moment for keyboard handler to mount, then use IntroScreen3D
        // letter shortcut which is NOT inside an Html overlay
        cy.wait(KEYBOARD_HANDLER_MOUNT_DELAY);
        cy.log("⚡ Using keyboard shortcut 't' for training");
        cy.get("body").focus().type("t");
      }
    }
  });

  // Wait for training screen to appear — increase timeout for slow CI
  cy.get('[data-testid="training-screen-3d"]', { timeout: SCREEN_DETECTION_TIMEOUT }).should("exist");
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
      // Try clicking the button with force if it exists but isn't visible
      const btnExists = $body.find('[data-testid="menu-item-versus"]');
      if (btnExists.length > 0) {
        cy.get('[data-testid="menu-item-versus"]').first().click({ force: true });
        cy.log("✅ Force-clicked combat menu button (not visible)");
      } else {
        // Wait a moment for keyboard handler to mount, then use IntroScreen3D
        // letter shortcut which is NOT inside an Html overlay
        cy.wait(KEYBOARD_HANDLER_MOUNT_DELAY);
        cy.log("⚡ Using keyboard shortcut 'v' for combat");
        cy.get("body").type("v");
      }
    }
  });

  // Wait for combat screen — increase timeout for slow CI environments
  cy.get('[data-testid="combat-screen"]', { timeout: SCREEN_DETECTION_TIMEOUT }).should("exist");
  cy.log("✅ Successfully entered combat mode");
});

// Navigate to a specific screen from intro (reusable pattern)
Cypress.Commands.add(
  "navigateToScreen",
  (screenName: string, buttonTestId: string, menuTestId: string, fallbackKey: string) => {
    // Try visible button first, fall back to force-click, then keyboard shortcut
    cy.get("body").then(($body) => {
      const btn = $body.find(`[data-testid="${buttonTestId}"]:visible`);
      const menu = $body.find(`[data-testid="${menuTestId}"]:visible`);
      if (btn.length > 0) {
        cy.get(`[data-testid="${buttonTestId}"]`).first().click();
      } else if (menu.length > 0) {
        cy.get(`[data-testid="${menuTestId}"]`).first().click();
      } else {
        // Try force-clicking if element exists but isn't visible
        const anyBtn = $body.find(`[data-testid="${buttonTestId}"]`);
        const anyMenu = $body.find(`[data-testid="${menuTestId}"]`);
        if (anyBtn.length > 0) {
          cy.get(`[data-testid="${buttonTestId}"]`).first().click({ force: true });
        } else if (anyMenu.length > 0) {
          cy.get(`[data-testid="${menuTestId}"]`).first().click({ force: true });
        } else {
          // Wait a moment for menu keyboard handler to mount before sending key
          cy.wait(KEYBOARD_HANDLER_MOUNT_DELAY);
          cy.log(`⚡ Using keyboard shortcut '${fallbackKey}' for ${screenName}`);
          cy.get("body").type(fallbackKey);
        }
      }
    });

    cy.get(`[data-testid="${screenName}-screen"]`, { timeout: SCREEN_DETECTION_TIMEOUT }).should("exist");
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
  const ctx: Record<string, unknown> = {
    canvas,
    drawingBufferWidth: canvas.width || 800,
    drawingBufferHeight: canvas.height || 600,

    // --- WebGL constants needed by Three.js ---
    // Three.js accesses gl.VERSION, gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS, etc.
    // as properties on the context object.
    VENDOR: 0x1f00,
    RENDERER: 0x1f01,
    VERSION: 0x1f02,
    MAX_COMBINED_TEXTURE_IMAGE_UNITS: 0x8b4d,
    MAX_TEXTURE_SIZE: 0x0d33,
    MAX_CUBE_MAP_TEXTURE_SIZE: 0x851c,
    MAX_RENDERBUFFER_SIZE: 0x84e8,
    MAX_TEXTURE_IMAGE_UNITS: 0x8872,
    MAX_VERTEX_TEXTURE_IMAGE_UNITS: 0x8b4c,
    MAX_VERTEX_ATTRIBS: 0x8869,
    MAX_VARYING_VECTORS: 0x8dfc,
    MAX_VERTEX_UNIFORM_VECTORS: 0x8dfb,
    MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
    MAX_VIEWPORT_DIMS: 0x0d3a,
    SCISSOR_BOX: 0x0c10,
    VIEWPORT: 0x0ba2,
    DEPTH_TEST: 0x0b71,
    STENCIL_TEST: 0x0b90,
    BLEND: 0x0be2,
    CULL_FACE: 0x0b44,
    SCISSOR_TEST: 0x0c11,
    COLOR_ATTACHMENT0: 0x8ce0,
    FRAMEBUFFER_COMPLETE: 0x8cd5,
    TEXTURE_2D: 0x0de1,
    TEXTURE_CUBE_MAP: 0x8513,
    ARRAY_BUFFER: 0x8892,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    STATIC_DRAW: 0x88e4,
    DYNAMIC_DRAW: 0x88e8,
    FRAGMENT_SHADER: 0x8b30,
    VERTEX_SHADER: 0x8b31,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    FLOAT: 0x1406,
    UNSIGNED_BYTE: 0x1401,
    UNSIGNED_SHORT: 0x1403,
    RGBA: 0x1908,
    RGB: 0x1907,
    TRIANGLES: 0x0004,
    TRIANGLE_STRIP: 0x0005,
    LINES: 0x0001,
    POINTS: 0x0000,
    NEAREST: 0x2600,
    LINEAR: 0x2601,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    CLAMP_TO_EDGE: 0x812f,
    REPEAT: 0x2901,
    UNPACK_FLIP_Y_WEBGL: 0x9240,
    UNPACK_PREMULTIPLY_ALPHA_WEBGL: 0x9241,
    UNPACK_COLORSPACE_CONVERSION_WEBGL: 0x9243,
    NONE: 0,
    BACK: 0x0405,
    FRONT: 0x0404,
    CCW: 0x0901,
    CW: 0x0900,
    LESS: 0x0201,
    LEQUAL: 0x0203,
    ALWAYS: 0x0207,
    NEVER: 0x0200,
    ONE: 1,
    ZERO: 0,
    SRC_ALPHA: 0x0302,
    ONE_MINUS_SRC_ALPHA: 0x0303,
    FUNC_ADD: 0x8006,
    HIGH_FLOAT: 0x8df2,
    MEDIUM_FLOAT: 0x8df1,
    LOW_FLOAT: 0x8df0,

    // --- WebGL methods ---
    getExtension: (name: string) => {
      // Return mock extension objects for extensions Three.js / drei require
      if (name === "ANGLE_instanced_arrays") {
        return {
          drawArraysInstancedANGLE: () => {},
          drawElementsInstancedANGLE: () => {},
          vertexAttribDivisorANGLE: () => {},
          VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 0x88fe,
        };
      }
      if (name === "OES_vertex_array_object") {
        return {
          createVertexArrayOES: () => ({}),
          bindVertexArrayOES: () => {},
          deleteVertexArrayOES: () => {},
          isVertexArrayOES: () => false,
          VERTEX_ARRAY_BINDING_OES: 0x85b5,
        };
      }
      if (name === "OES_texture_float" || name === "OES_texture_half_float") {
        return { HALF_FLOAT_OES: 0x8d61 };
      }
      if (name === "OES_standard_derivatives") {
        return { FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 0x8b8b };
      }
      if (name === "OES_element_index_uint") return {};
      if (name === "EXT_blend_minmax") return { MIN_EXT: 0x8007, MAX_EXT: 0x8008 };
      if (name === "WEBGL_depth_texture") return { UNSIGNED_INT_24_8_WEBGL: 0x84fa };
      if (name === "EXT_texture_filter_anisotropic") {
        return {
          MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84ff,
          TEXTURE_MAX_ANISOTROPY_EXT: 0x84fe,
        };
      }
      // Return null for unknown/unsupported extensions
      return null;
    },
    getParameter: (param: number) => {
      if (param === 0x1f00) return "Mock WebGL Implementation"; // GL_VENDOR
      if (param === 0x1f01) return "Mock Renderer"; // GL_RENDERER
      if (param === 0x1f02) return "WebGL 1.0"; // GL_VERSION
      if (param === 0x8b4d) return 16; // MAX_COMBINED_TEXTURE_IMAGE_UNITS
      if (param === 0x0d33) return 4096; // MAX_TEXTURE_SIZE
      if (param === 0x851c) return 4096; // MAX_CUBE_MAP_TEXTURE_SIZE
      if (param === 0x84e8) return 4096; // MAX_RENDERBUFFER_SIZE
      if (param === 0x8872) return 16; // MAX_TEXTURE_IMAGE_UNITS
      if (param === 0x8b4c) return 16; // MAX_VERTEX_TEXTURE_IMAGE_UNITS
      if (param === 0x8869) return 16; // MAX_VERTEX_ATTRIBS
      if (param === 0x8dfc) return 16; // MAX_VARYING_VECTORS
      if (param === 0x8dfb) return 256; // MAX_VERTEX_UNIFORM_VECTORS
      if (param === 0x8dfd) return 256; // MAX_FRAGMENT_UNIFORM_VECTORS
      if (param === 0x0d3a) return new Int32Array([4096, 4096]); // MAX_VIEWPORT_DIMS
      if (param === 0x0c10) return new Int32Array([0, 0, canvas.width || 800, canvas.height || 600]); // SCISSOR_BOX
      if (param === 0x0ba2) return new Int32Array([0, 0, canvas.width || 800, canvas.height || 600]); // VIEWPORT
      return 0;
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
    disableVertexAttribArray: () => {},
    vertexAttribPointer: () => {},
    drawArrays: () => {},
    drawElements: () => {},
    clear: () => {},
    clearColor: () => {},
    clearDepth: () => {},
    clearStencil: () => {},
    enable: () => {},
    disable: () => {},
    depthFunc: () => {},
    depthMask: () => {},
    blendFunc: () => {},
    blendFuncSeparate: () => {},
    blendEquation: () => {},
    blendEquationSeparate: () => {},
    viewport: () => {},
    scissor: () => {},
    shaderSource: () => {},
    compileShader: () => {},
    attachShader: () => {},
    detachShader: () => {},
    linkProgram: () => {},
    validateProgram: () => {},
    getProgramParameter: () => true,
    getShaderParameter: () => true,
    getUniformLocation: () => ({}),
    getAttribLocation: () => 0,
    uniform1i: () => {},
    uniform1f: () => {},
    uniform2f: () => {},
    uniform2fv: () => {},
    uniform3f: () => {},
    uniform3fv: () => {},
    uniform4f: () => {},
    uniform4fv: () => {},
    uniform1iv: () => {},
    uniform2iv: () => {},
    uniform3iv: () => {},
    uniform4iv: () => {},
    uniformMatrix2fv: () => {},
    uniformMatrix3fv: () => {},
    uniformMatrix4fv: () => {},
    activeTexture: () => {},
    texImage2D: () => {},
    texSubImage2D: () => {},
    texImage3D: () => {},
    texSubImage3D: () => {},
    texStorage2D: () => {},
    texStorage3D: () => {},
    compressedTexImage2D: () => {},
    compressedTexSubImage2D: () => {},
    texParameteri: () => {},
    texParameterf: () => {},
    pixelStorei: () => {},
    bufferData: () => {},
    bufferSubData: () => {},
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
    stencilFuncSeparate: () => {},
    stencilOp: () => {},
    stencilOpSeparate: () => {},
    stencilMask: () => {},
    stencilMaskSeparate: () => {},
    lineWidth: () => {},
    polygonOffset: () => {},
    sampleCoverage: () => {},
    frontFace: () => {},
    cullFace: () => {},
    hint: () => {},
    isEnabled: () => false,
    drawBuffers: () => {},
    readPixels: () => {},
    getShaderPrecisionFormat: (_shaderType: number, _precisionType: number) => ({
      rangeMin: 127,
      rangeMax: 127,
      precision: 23,
    }),
    getShaderInfoLog: () => "",
    getProgramInfoLog: () => "",
    getShaderSource: () => "",
    getActiveAttrib: () => ({ name: "a", type: 0x1406, size: 1 }),
    getActiveUniform: () => ({ name: "u", type: 0x1406, size: 1 }),
    getSupportedExtensions: () => [],
    getContextAttributes: () => ({
      alpha: true,
      antialias: true,
      depth: true,
      failIfMajorPerformanceCaveat: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      stencil: false,
    }),
    drawingBufferColorSpace: "srgb",
    unpackColorSpace: "srgb",
  };

  // Wrap in a Proxy so any WebGL method/property not explicitly defined above
  // returns a safe fallback instead of undefined. This prevents
  // "gl.XYZ is not a function" TypeErrors from Three.js / R3F init without
  // needing to enumerate every WebGL2 method by name, while keeping unknown
  // enum-like constants numeric for renderer capability checks.
  return new Proxy(ctx, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (value !== undefined) return value;
      if (typeof prop === "string") {
        // WebGL constants are typically ALL_CAPS names such as COLOR_BUFFER_BIT.
        // Return a numeric fallback for unknown enum-like lookups to avoid
        // passing functions into Three.js constant reads.
        if (/^[A-Z0-9_]+$/.test(prop)) {
          return 0;
        }
        return () => { /* no-op stub for unknown WebGL methods */ };
      }
      return undefined;
    },
  });
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
        // Capture first snapshot — sample a 20x20 region at the center to
        // keep the comparison lightweight on large canvases.
        const cx = Math.floor(canvas.width / 2);
        const centerY = Math.floor(canvas.height / 2);
        const sampleSize = Math.min(20, canvas.width, canvas.height);
        const x0 = Math.max(0, cx - Math.floor(sampleSize / 2));
        const y0 = Math.max(0, centerY - Math.floor(sampleSize / 2));
        const imgData1 = ctx.getImageData(x0, y0, sampleSize, sampleSize);
        const snapshot1 = new Uint8Array(imgData1.data);

        // Wait a short interval for rendering to advance, then compare
        cy.wait(200).then(() => {
          const imgData2 = ctx.getImageData(x0, y0, sampleSize, sampleSize);
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
          // Only hard-assert pixel diff in non-headless, non-CI environments
          // where the GPU can actively render. In headless/CI the scene may be
          // legitimately static even though the canvas exists and has a 2D ctx.
          if (!isRunningInCI()) {
            expect(
              diffCount,
              `Expected active Three.js rendering to produce at least ${minPixelChange} pixel diffs, but detected ${diffCount}`
            ).to.be.gte(minPixelChange);
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
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(
          parseFloat(String(raw)),
          `aria-valuenow parseable on [${testId}]`
        ).to.not.be.NaN;
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
