/**
 * ActionButtons Component
 *
 * Touch-optimized action buttons for combat (Attack and Block)
 * Provides tactile combat controls with visual feedback and haptic response
 *
 * WCAG 2.1 Level AA Compliance:
 * - ARIA labels for screen readers
 * - Keyboard navigation (Enter, Space)
 * - Visible focus indicators (2px cyan border)
 * - 80x80px and 70x70px touch targets (exceeds 44x44px minimum)
 *
 * @module components/mobile/ActionButtons
 * @category Mobile Controls
 * @korean 액션 버튼
 */

import { Html } from "@react-three/drei";
import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { KOREAN_COLORS } from "@/types/constants";
import { triggerOptimizedHaptic } from "./HapticController";
import {
  applyOptimizedUpdate,
  createTransformStyle,
  createFilterStyle,
} from "./TouchOptimizer";
import { getColorRGB } from "../../../utils/colorHelpers";
import { handleKeyboardNav, getFocusStyle } from "../../../utils/accessibility";
import { createBilingualLabel } from "../../../types/AccessibilityTypes";
import { useThrottle } from "../../../hooks/useThrottle";

/**
 * Event type for button interactions
 */
export type ButtonEventType = "start" | "end";

/**
 * Props for ActionButtons component
 */
export interface ActionButtonsProps {
  /** Callback when attack button is pressed */
  readonly onAttack: () => void;
  /** Callback when block button is pressed/released */
  readonly onBlock: (eventType: ButtonEventType) => void;
  /** Whether buttons are disabled */
  readonly disabled?: boolean;
  /** Position from bottom in pixels (default: 34 for safe area) */
  readonly bottom?: number;
  /** Position from right in pixels (default: 20) */
  readonly right?: number;
  /** Opacity of buttons (default: 0.8) */
  readonly opacity?: number;
}

/**
 * ActionButtons Component
 *
 * Provides two primary combat action buttons:
 * - Attack Button (⚡): Primary combat action, 80x80px
 * - Block Button (🛡️): Defensive action, 70x70px
 *
 * Features:
 * - Touch-optimized with minimum 44x44px targets
 * - Attack button: 80x80px for primary action
 * - Block button: 70x70px for secondary action
 * - Visual feedback on press
 * - Haptic feedback for tactile response
 * - Korean cyberpunk theming
 * - Hold-to-block support
 *
 * Usage in Combat:
 * - Attack: Executes current stance technique
 * - Block: Activates defensive guard (hold for sustained block)
 *
 * @example
 * ```tsx
 * <ActionButtons
 *   onAttack={() => executeTechnique()}
 *   onBlock={(eventType) => {
 *     if (eventType === 'start') {
 *       activateBlock();
 *     } else {
 *       deactivateBlock();
 *     }
 *   }}
 *   disabled={isPaused}
 * />
 * ```
 *
 * @korean 액션버튼
 */
const ActionButtonsComponent: React.FC<ActionButtonsProps> = ({
  onAttack,
  onBlock,
  disabled = false,
  bottom = 34,
  right = 20,
  opacity = 0.8,
}) => {
  const [attackPressed, setAttackPressed] = useState(false);
  const [blockPressed, setBlockPressed] = useState(false);
  const [attackFocused, setAttackFocused] = useState(false);
  const [blockFocused, setBlockFocused] = useState(false);

  const attackButtonRef = useRef<HTMLButtonElement>(null);
  const blockButtonRef = useRef<HTMLButtonElement>(null);

  const throttledOnAttack = useThrottle(onAttack, 16);
  const throttledOnBlock = useThrottle(onBlock, 16);

  /**
   * Handle attack button press with optimized latency (<16ms)
   * Uses direct DOM manipulation for immediate visual feedback
   */
  const handleAttackStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      applyOptimizedUpdate(
        attackButtonRef.current,
        (element) => {
          element.style.transform = createTransformStyle(true, 0.95);
          element.style.filter = createFilterStyle(true, 1.2);
        },
        () => {
          setAttackPressed(true);
          throttledOnAttack();
          triggerOptimizedHaptic("medium");
        },
      );
    },
    [disabled, throttledOnAttack],
  );

  /**
   * Handle attack button release with optimized latency
   */
  const handleAttackEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      applyOptimizedUpdate(
        attackButtonRef.current,
        (element) => {
          element.style.transform = createTransformStyle(false);
          element.style.filter = createFilterStyle(false);
        },
        () => {
          setAttackPressed(false);
        },
      );
    },
    [disabled],
  );

  /**
   * Handle block button press with optimized latency (<16ms)
   */
  const handleBlockStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      applyOptimizedUpdate(
        blockButtonRef.current,
        (element) => {
          element.style.transform = createTransformStyle(true, 0.95);
          element.style.filter = createFilterStyle(true, 1.2);
        },
        () => {
          setBlockPressed(true);
          throttledOnBlock("start");
          triggerOptimizedHaptic("light");
        },
      );
    },
    [disabled, throttledOnBlock],
  );

  /**
   * Handle block button release with optimized latency
   */
  const handleBlockEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      applyOptimizedUpdate(
        blockButtonRef.current,
        (element) => {
          element.style.transform = createTransformStyle(false);
          element.style.filter = createFilterStyle(false);
        },
        () => {
          setBlockPressed(false);
          throttledOnBlock("end");
        },
      );
    },
    [disabled, throttledOnBlock],
  );

  /**
   * Cleanup on unmount - reset any pending visual states.
   * Note: Captures button refs at effect creation time to avoid stale closures.
   * If the buttons unmount before cleanup runs, the captured variables will still
   * reference the original DOM elements (now potentially detached), so style changes
   * are harmless but may not be visible. The null checks primarily guard against
   * refs that were never set in the first place.
   */
  useEffect(() => {
    const attackButton = attackButtonRef.current;
    const blockButton = blockButtonRef.current;

    return () => {
      if (attackButton) {
        attackButton.style.transform = createTransformStyle(false);
        attackButton.style.filter = createFilterStyle(false);
      }
      if (blockButton) {
        blockButton.style.transform = createTransformStyle(false);
        blockButton.style.filter = createFilterStyle(false);
      }
    };
  }, []);

  /**
   * Handle keyboard navigation for attack button
   */
  const handleAttackKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      handleKeyboardNav(e.nativeEvent, {
        onActivate: () => {
          setAttackPressed(true);
          onAttack();
          triggerOptimizedHaptic("medium");
          setTimeout(() => setAttackPressed(false), 150);
        },
      });
    },
    [disabled, onAttack],
  );

  /**
   * Handle keyboard navigation for block button
   */
  const handleBlockKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      handleKeyboardNav(e.nativeEvent, {
        onActivate: () => {
          setBlockPressed(true);
          onBlock("start");
          triggerOptimizedHaptic("light");
          setTimeout(() => {
            setBlockPressed(false);
            onBlock("end");
          }, 150);
        },
      });
    },
    [disabled, onBlock],
  );

  const colors = useMemo(
    () => ({
      gold: getColorRGB(KOREAN_COLORS.ACCENT_GOLD),
      blue: getColorRGB(KOREAN_COLORS.ACCENT_BLUE),
      primary: getColorRGB(KOREAN_COLORS.PRIMARY_CYAN),
    }),
    [],
  );

  return (
    <Html fullscreen>
      <div
        style={{
          position: "absolute",
          bottom: `${bottom}px`,
          right: `${right}px`,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          opacity: disabled ? 0.3 : opacity,
          pointerEvents: disabled ? "none" : "auto",
        }}
        data-testid="action-buttons"
      >
        {/* Primary Attack Button */}
        <button
          ref={attackButtonRef}
          onTouchStart={handleAttackStart}
          onTouchEnd={handleAttackEnd}
          onMouseDown={handleAttackStart}
          onMouseUp={handleAttackEnd}
          onMouseLeave={handleAttackEnd}
          onKeyDown={handleAttackKeyDown}
          onFocus={() => setAttackFocused(true)}
          onBlur={() => setAttackFocused(false)}
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: attackPressed
              ? `rgba(${colors.gold.r}, ${colors.gold.g}, ${colors.gold.b}, 1)`
              : `rgba(${colors.gold.r}, ${colors.gold.g}, ${colors.gold.b}, 0.9)`,
            border: "3px solid #fff",
            fontSize: "28px",
            color: "#000",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
            touchAction: "none",
            transition: "transform 0.1s ease-out, filter 0.1s ease-out",
            transform: createTransformStyle(attackPressed, 0.95),
            filter: createFilterStyle(attackPressed, 1.2),
            willChange: "transform, filter", // GPU hint
            boxShadow: attackPressed
              ? `0 0 25px rgba(${colors.gold.r}, ${colors.gold.g}, ${colors.gold.b}, 1), inset 0 4px 8px rgba(0, 0, 0, 0.3)`
              : `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 15px rgba(${colors.gold.r}, ${colors.gold.g}, ${colors.gold.b}, 0.6)`,
            ...getFocusStyle(attackFocused, {
              outlineWidth: 3,
              boxShadow: `0 0 0 4px rgba(${colors.primary.r}, ${colors.primary.g}, ${colors.primary.b}, 0.5), 0 0 25px rgba(${colors.gold.r}, ${colors.gold.g}, ${colors.gold.b}, 1)`,
            }),
          }}
          disabled={disabled}
          aria-label={createBilingualLabel("공격", "Attack").label}
          aria-pressed={attackPressed}
          role="button"
          tabIndex={disabled ? -1 : 0}
          data-testid="attack-button"
        >
          ⚡
        </button>

        {/* Block Button */}
        <button
          ref={blockButtonRef}
          onTouchStart={handleBlockStart}
          onTouchEnd={handleBlockEnd}
          onMouseDown={handleBlockStart}
          onMouseUp={handleBlockEnd}
          onMouseLeave={handleBlockEnd}
          onKeyDown={handleBlockKeyDown}
          onFocus={() => setBlockFocused(true)}
          onBlur={() => setBlockFocused(false)}
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: blockPressed
              ? `rgba(${colors.blue.r}, ${colors.blue.g}, ${colors.blue.b}, 1)`
              : `rgba(${colors.blue.r}, ${colors.blue.g}, ${colors.blue.b}, 0.9)`,
            border: "2px solid #fff",
            fontSize: "24px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            userSelect: "none",
            touchAction: "none",
            transition: "transform 0.1s ease-out, filter 0.1s ease-out",
            transform: createTransformStyle(blockPressed, 0.95),
            filter: createFilterStyle(blockPressed, 1.2),
            willChange: "transform, filter", // GPU hint
            boxShadow: blockPressed
              ? `0 0 20px rgba(${colors.blue.r}, ${colors.blue.g}, ${colors.blue.b}, 1), inset 0 4px 8px rgba(0, 0, 0, 0.3)`
              : `0 4px 10px rgba(0, 0, 0, 0.5), 0 0 12px rgba(${colors.blue.r}, ${colors.blue.g}, ${colors.blue.b}, 0.6)`,
            ...getFocusStyle(blockFocused, {
              outlineWidth: 3,
              boxShadow: `0 0 0 4px rgba(${colors.primary.r}, ${colors.primary.g}, ${colors.primary.b}, 0.5), 0 0 20px rgba(${colors.blue.r}, ${colors.blue.g}, ${colors.blue.b}, 1)`,
            }),
          }}
          disabled={disabled}
          aria-label={createBilingualLabel("방어", "Block").label}
          aria-pressed={blockPressed}
          role="button"
          tabIndex={disabled ? -1 : 0}
          data-testid="block-button"
        >
          🛡️
        </button>

        {/* Button Labels (Korean + English) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            alignItems: "center",
            fontSize: "10px",
            color: `rgba(${colors.primary.r}, ${colors.primary.g}, ${colors.primary.b}, 0.9)`,
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
            fontWeight: "bold",
            marginTop: "4px",
          }}
        >
          <span>공격 | Attack</span>
          <span style={{ fontSize: "9px" }}>방어 | Block</span>
        </div>
      </div>
    </Html>
  );
};

/**
 * Memoized ActionButtons with custom comparison
 * Only re-renders when props change
 */
export const ActionButtons = React.memo(
  ActionButtonsComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.disabled === nextProps.disabled &&
      prevProps.bottom === nextProps.bottom &&
      prevProps.right === nextProps.right &&
      prevProps.opacity === nextProps.opacity &&
      prevProps.onAttack === nextProps.onAttack &&
      prevProps.onBlock === nextProps.onBlock
    );
  },
);

ActionButtons.displayName = "ActionButtons";
