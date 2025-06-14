/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) => {
  // Task for logging performance metrics
  on("task", {
    logPerformance(metrics: { name: string; duration: number }) {
      console.log(`[Performance] ${metrics.name}: ${metrics.duration}ms`);
      return null;
    },

    log(message: string) {
      console.log(message);
      return null;
    },
  });

  // Video recording optimization for Korean martial arts game
  on("before:browser:launch", (browser, launchOptions) => {
    if (browser.name === "chrome") {
      // Optimize Chrome for PixiJS testing
      launchOptions.args.push("--disable-web-security");
      launchOptions.args.push("--disable-features=VizDisplayCompositor");
      launchOptions.args.push("--disable-background-timer-throttling");
      launchOptions.args.push("--disable-backgrounding-occluded-windows");
    }

    return launchOptions;
  });

  return config;
};
