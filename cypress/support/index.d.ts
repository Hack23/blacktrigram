/// <reference types="cypress" />

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
    getPixiApp(): Chainable<any>;
    getPixiObject(selector: string): Chainable<any>;
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
