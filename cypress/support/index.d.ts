/// <reference types="cypress" />
/// <reference types="pixi.js" />

declare namespace Cypress {
  interface Chainable {
    // Canvas and game testing commands
    checkCanvasVisibility(): Chainable<void>;
    waitForGameReady(): Chainable<void>;
    navigateToTraining(): Chainable<void>;
    visitWithWebGLMock(
      url: string,
      options?: Partial<Cypress.VisitOptions>
    ): Chainable<void>;
    waitForCanvasReady(): Chainable<void>;
    annotate(message: string): Chainable<void>;

    // PixiJS testing commands
    getPixiApp(): Chainable<PIXI.Application>;
    findPixiObject(data: Record<string, any>): Chainable<PIXI.DisplayObject>;
    waitForPixiObject(
      data: Record<string, any>,
      timeout?: number
    ): Chainable<PIXI.DisplayObject>;
    waitForNoPixiObject(
      data: Record<string, any>,
      timeout?: number
    ): Chainable<void>;
    clickPixiObject(selector: string): Chainable<void>;
    testPixiStance(stance: string): Chainable<void>;
    testPixiPlayer(playerId: string): Chainable<void>;
    testPixiText(text: string): Chainable<void>;
    testPixiPerformance(): Chainable<void>;

    // Korean martial arts specific commands
    selectArchetype(archetype: string): Chainable<void>;
    executeTrigramTechnique(technique: string): Chainable<void>;
    testVitalPointTargeting(): Chainable<void>;
    checkKoreanTextRendering(): Chainable<void>;

    // Test isolation commands
    isolateTest(): Chainable<void>;
    cleanupTest(): Chainable<void>;
    captureState(): Chainable<void>;
    restoreState(): Chainable<void>;

    // Resource monitoring commands
    startResourceMonitoring(): Chainable<void>;
    detectResourceLeaks(): Chainable<void>;
    logResourceReport(): Chainable<void>;
    forceResourceCleanup(): Chainable<void>;
  }
}

// Global window extensions for testing
declare global {
  interface Window {
    blackTrigramApp?: any;
    pixiApp?: any;
    __PIXI_APP__?: any;
  }
}

export {};
