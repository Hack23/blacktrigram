/**
 * ActionButtons Component
 * 
 * Touch-optimized action buttons for combat (Attack and Block)
 * Provides tactile combat controls with visual feedback and haptic response
 * 
 * @module components/mobile/ActionButtons
 * @category Mobile Controls
 * @korean 액션 버튼
 */

import { Html } from '@react-three/drei';
import React, { useCallback, useState } from 'react';
import { KOREAN_COLORS } from '../../types/constants';
import { triggerHaptic } from '../../utils/haptics';
import { getColorRGB } from '../../utils/colorHelpers';

/**
 * Event type for button interactions
 */
export type ButtonEventType = 'start' | 'end';

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
 * @public
 * @korean 액션버튼
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAttack,
  onBlock,
  disabled = false,
  bottom = 34,
  right = 20,
  opacity = 0.8,
}) => {
  const [attackPressed, setAttackPressed] = useState(false);
  const [blockPressed, setBlockPressed] = useState(false);

  /**
   * Handle attack button press (touch or mouse)
   */
  const handleAttackStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      setAttackPressed(true);
      onAttack();
      triggerHaptic('medium');
    },
    [disabled, onAttack]
  );

  /**
   * Handle attack button release (touch or mouse)
   */
  const handleAttackEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      setAttackPressed(false);
    },
    [disabled]
  );

  /**
   * Handle block button press (touch or mouse)
   */
  const handleBlockStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      setBlockPressed(true);
      onBlock('start');
      triggerHaptic('light');
    },
    [disabled, onBlock]
  );

  /**
   * Handle block button release (touch or mouse)
   */
  const handleBlockEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();

      setBlockPressed(false);
      onBlock('end');
    },
    [disabled, onBlock]
  );

  // Extract RGB colors using shared utility
  const primaryColor = getColorRGB(KOREAN_COLORS.PRIMARY_CYAN);
  const goldColor = getColorRGB(KOREAN_COLORS.ACCENT_GOLD);
  const blueColor = getColorRGB(KOREAN_COLORS.ACCENT_BLUE);

  return (
    <Html fullscreen>
      <div
        style={{
          position: 'absolute',
          bottom: `${bottom}px`,
          right: `${right}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          opacity: disabled ? 0.3 : opacity,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
        data-testid="action-buttons"
      >
        {/* Primary Attack Button */}
        <button
          onTouchStart={handleAttackStart}
          onTouchEnd={handleAttackEnd}
          onMouseDown={handleAttackStart}
          onMouseUp={handleAttackEnd}
          onMouseLeave={handleAttackEnd}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: attackPressed
              ? `rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, 1)`
              : `rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, 0.9)`,
            border: '3px solid #fff',
            fontSize: '28px',
            color: '#000',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            touchAction: 'none',
            transition: 'all 0.1s ease',
            transform: attackPressed ? 'scale(0.95)' : 'scale(1)',
            boxShadow: attackPressed
              ? `0 0 25px rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, 1), inset 0 4px 8px rgba(0, 0, 0, 0.3)`
              : `0 4px 12px rgba(0, 0, 0, 0.5), 0 0 15px rgba(${goldColor.r}, ${goldColor.g}, ${goldColor.b}, 0.6)`,
          }}
          disabled={disabled}
          data-testid="attack-button"
        >
          ⚡
        </button>

        {/* Block Button */}
        <button
          onTouchStart={handleBlockStart}
          onTouchEnd={handleBlockEnd}
          onMouseDown={handleBlockStart}
          onMouseUp={handleBlockEnd}
          onMouseLeave={handleBlockEnd}
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: blockPressed
              ? `rgba(${blueColor.r}, ${blueColor.g}, ${blueColor.b}, 1)`
              : `rgba(${blueColor.r}, ${blueColor.g}, ${blueColor.b}, 0.9)`,
            border: '2px solid #fff',
            fontSize: '24px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            touchAction: 'none',
            transition: 'all 0.1s ease',
            transform: blockPressed ? 'scale(0.95)' : 'scale(1)',
            boxShadow: blockPressed
              ? `0 0 20px rgba(${blueColor.r}, ${blueColor.g}, ${blueColor.b}, 1), inset 0 4px 8px rgba(0, 0, 0, 0.3)`
              : `0 4px 10px rgba(0, 0, 0, 0.5), 0 0 12px rgba(${blueColor.r}, ${blueColor.g}, ${blueColor.b}, 0.6)`,
          }}
          disabled={disabled}
          data-testid="block-button"
        >
          🛡️
        </button>

        {/* Button Labels (Korean + English) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            alignItems: 'center',
            fontSize: '10px',
            color: `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.9)`,
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
            fontWeight: 'bold',
            marginTop: '4px',
          }}
        >
          <span>공격 | Attack</span>
          <span style={{ fontSize: '9px' }}>방어 | Block</span>
        </div>
      </div>
    </Html>
  );
};
