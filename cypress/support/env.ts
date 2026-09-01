/**
 * Environment detection utilities shared across Cypress support modules.
 *
 * This module is intentionally kept dependency-free so it can be imported by
 * both `commands.ts` and `fps-monitor.ts` without introducing circular imports.
 */

/**
 * Detect whether tests are running in a CI or headless environment.
 * Used to relax assertions that depend on GPU rendering (pixel diffs, FPS).
 */
export function isRunningInCI(): boolean {
  const isHeadless = Cypress.browser?.isHeadless === true;
  const ciFlag = Cypress.expose("CI");
  const githubActionsFlag = Cypress.expose("GITHUB_ACTIONS");

  if (isHeadless) return true;
  if (ciFlag === true || ciFlag === "true") return true;
  if (githubActionsFlag === true || githubActionsFlag === "true") return true;

  return false;
}
