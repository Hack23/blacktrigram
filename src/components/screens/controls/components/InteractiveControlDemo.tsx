/**
 * InteractiveControlDemo - Display recently pressed keys and their actions
 * 
 * Shows the last 5 pressed keys with their descriptions in a bottom overlay.
 * Keys auto-fade after 2 seconds for a clean, non-intrusive display.
 * 
 * @module components/screens/controls/components
 */

import React, { useEffect, useMemo, useState } from "react";
import { FONT_FAMILY } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../shared/base/useKoreanTheme";
import { getKeyCategoryColor, KEYBOARD_LAYOUT, type KeyData } from "../constants/ControlsConstants";

/**
 * Props for InteractiveControlDemo component
 */
export interface InteractiveControlDemoProps {
  /** Set of currently pressed key codes */
  readonly pressedKeys: Set<string>;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * Key press entry with timestamp
 */
interface KeyPressEntry {
  readonly keyData: KeyData;
  readonly timestamp: number;
  readonly id: string;
}

/**
 * InteractiveControlDemo Component
 * 
 * Displays recently pressed keys with their actions.
 * Auto-fades entries after 2 seconds and maintains last 5 keys.
 * 
 * @example
 * ```tsx
 * <InteractiveControlDemo
 *   pressedKeys={new Set(['Space', 'KeyW'])}
 *   isMobile={false}
 * />
 * ```
 */
export const InteractiveControlDemo: React.FC<InteractiveControlDemoProps> = ({
  pressedKeys,
  isMobile,
}) => {
  const theme = useKoreanTheme({ variant: 'primary', size: 'md', isMobile });
  const [keyPresses, setKeyPresses] = useState<KeyPressEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  // Update current time for opacity calculations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Track pressed keys and add to history
  useEffect(() => {
    // Find newly pressed keys
    const currentCodes = Array.from(pressedKeys);
    const now = Date.now();
    
    currentCodes.forEach((code) => {
      // Check if key is not already in the recent list
      const alreadyRecorded = keyPresses.some(
        (entry) => entry.keyData.code === code && now - entry.timestamp < 100
      );
      
      if (!alreadyRecorded) {
        // Find key data
        const keyData = KEYBOARD_LAYOUT.find((k) => k.code === code);
        if (keyData) {
          setKeyPresses((prev) => {
            const newEntry: KeyPressEntry = {
              keyData,
              timestamp: now,
              id: `${code}-${now}`,
            };
            
            // Add new entry and keep only last 5
            const updated = [newEntry, ...prev].slice(0, 5);
            return updated;
          });
        }
      }
    });
  }, [pressedKeys]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-remove entries after 2 seconds
  useEffect(() => {
    setKeyPresses((prev) =>
      prev.filter((entry) => currentTime - entry.timestamp < 2000)
    );
  }, [currentTime]);

  // Calculate opacity based on age
  const getOpacity = (timestamp: number): number => {
    const age = currentTime - timestamp;
    const maxAge = 2000;
    return Math.max(0, 1 - age / maxAge);
  };

  // Container style
  const containerStyle = useMemo(() => ({
    position: 'fixed' as const,
    bottom: isMobile ? '15px' : '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: isMobile ? '8px' : '10px',
    maxWidth: isMobile ? '90%' : '600px',
    width: '100%',
    padding: isMobile ? '12px' : '15px',
    background: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.95),
    borderRadius: '12px',
    border: `2px solid ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.6)}`,
    boxShadow: `
      0 4px 20px ${hexToRgbaString(theme.colors.BLACK_SOLID, 0.5)},
      0 0 15px ${hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.3)}
    `,
    pointerEvents: 'none' as const,
    zIndex: 1000,
  }), [isMobile, theme]);

  // Title style
  const titleStyle = useMemo(() => ({
    fontFamily: FONT_FAMILY.KOREAN,
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: 'bold' as const,
    color: hexToRgbaString(theme.colors.ACCENT_GOLD),
    textAlign: 'center' as const,
    marginBottom: '4px',
    textShadow: `0 0 8px ${hexToRgbaString(theme.colors.ACCENT_GOLD, 0.5)}`,
  }), [isMobile, theme]);

  return (
    <div style={containerStyle} data-testid="interactive-demo">
      {/* Title */}
      <div style={titleStyle}>
        최근 입력 | Recent Input
      </div>

      {/* Key press entries */}
      {keyPresses.map((entry) => {
        const opacity = getOpacity(entry.timestamp);
        const categoryColor = getKeyCategoryColor(entry.keyData.category);

        return (
          <div
            key={entry.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '8px' : '12px',
              padding: isMobile ? '8px' : '10px',
              background: hexToRgbaString(theme.colors.UI_BACKGROUND_MEDIUM, opacity * 0.9),
              borderRadius: '8px',
              border: `2px solid ${hexToRgbaString(categoryColor, opacity * 0.7)}`,
              transition: 'opacity 0.3s ease',
              opacity,
            }}
            data-testid={`key-press-${entry.keyData.code}`}
          >
            {/* Key label */}
            <div
              style={{
                fontFamily: FONT_FAMILY.KOREAN,
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 'bold' as const,
                color: hexToRgbaString(categoryColor),
                padding: '6px 12px',
                background: hexToRgbaString(categoryColor, 0.2),
                borderRadius: '6px',
                minWidth: isMobile ? '50px' : '60px',
                textAlign: 'center' as const,
                boxShadow: `0 0 10px ${hexToRgbaString(categoryColor, opacity * 0.5)}`,
              }}
            >
              {entry.keyData.label}
            </div>

            {/* Key description */}
            <div style={{ flex: 1 }}>
              {/* Korean label */}
              {entry.keyData.labelKorean && (
                <div
                  style={{
                    fontFamily: FONT_FAMILY.KOREAN,
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: 'bold' as const,
                    color: hexToRgbaString(theme.colors.ACCENT_GOLD, opacity),
                    marginBottom: '2px',
                  }}
                >
                  {entry.keyData.labelKorean}
                </div>
              )}

              {/* Description (Korean | English) */}
              {entry.keyData.descriptionKorean && entry.keyData.description && (
                <div
                  style={{
                    fontFamily: FONT_FAMILY.KOREAN,
                    fontSize: isMobile ? '11px' : '12px',
                    color: hexToRgbaString(theme.colors.TEXT_SECONDARY, opacity),
                    lineHeight: 1.3,
                  }}
                >
                  {entry.keyData.descriptionKorean} | {entry.keyData.description}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Empty state */}
      {keyPresses.length === 0 && (
        <div
          style={{
            fontFamily: FONT_FAMILY.KOREAN,
            fontSize: isMobile ? '12px' : '13px',
            color: hexToRgbaString(theme.colors.TEXT_TERTIARY),
            textAlign: 'center' as const,
            padding: '15px',
          }}
        >
          키를 눌러서 액션을 확인하세요 | Press keys to see actions
        </div>
      )}
    </div>
  );
};

export default InteractiveControlDemo;
