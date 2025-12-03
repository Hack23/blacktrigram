/**
 * @module hooks
 * @category Hooks
 * 
 */

export { useRoundTransition } from "./useRoundTransition";
export type {
  RoundTransitionState,
  RoundTransitionConfig,
  UseRoundTransitionResult,
} from "./useRoundTransition";

export { useMatchCountdown } from "./useMatchCountdown";
export type {
  MatchCountdownState,
  MatchCountdownConfig,
  UseMatchCountdownResult,
} from "./useMatchCountdown";

export { useWebGLContextLossHandler } from "./useWebGLContextLossHandler";

export { useActionFeedback } from "./useActionFeedback";
export type {
  ActionFeedbackType,
  DamageType,
  DamageNumber,
  ActionFeedback,
  ActionFeedbackState,
  ActionFeedbackActions,
  UseActionFeedbackConfig,
} from "./useActionFeedback";

export { useCombatTimer } from "./useCombatTimer";
export type {
  TimerWarningLevel,
  UseCombatTimerConfig,
  UseCombatTimerReturn,
} from "./useCombatTimer";

