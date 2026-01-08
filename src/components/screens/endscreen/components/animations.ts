/**
 * Shared CSS animations for EndScreen components
 * Defines reusable keyframe animations with Korean cyberpunk theming
 */

/**
 * Fade in animation - entrance effect
 */
export const fadeInAnimation = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

/**
 * Scale in animation - emphasis effect
 */
export const scaleInAnimation = `
@keyframes scaleIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
`;

/**
 * Slide up animation - entrance from bottom
 */
export const slideUpAnimation = `
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

/**
 * Pulse animation - breathing effect
 */
export const pulseAnimation = `
@keyframes ratingPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}
`;

/**
 * All animations combined for easy injection
 */
export const allAnimations = `
${fadeInAnimation}
${scaleInAnimation}
${slideUpAnimation}
${pulseAnimation}
`;
