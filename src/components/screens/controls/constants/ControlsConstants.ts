/**
 * Control constants and layouts for Black Trigram (흑괘)
 * Defines keyboard layouts, gamepad mappings, and control categories
 * 
 * @module components/screens/controls/constants
 */

import { KOREAN_COLORS } from "../../../../types/constants/colors";

/**
 * Keyboard key data structure
 */
export interface KeyData {
  readonly code: string;
  readonly label: string;
  readonly labelKorean?: string;
  readonly row: number;
  readonly col: number;
  readonly width?: number; // Default is 1
  readonly category: KeyCategory;
  readonly description?: string;
  readonly descriptionKorean?: string;
}

/**
 * Control categories for organizing controls
 */
export type KeyCategory = 'stance' | 'movement' | 'combat' | 'system' | 'technique' | 'modifier' | 'normal';

/**
 * Control category configuration
 */
export interface ControlCategory {
  readonly id: string;
  readonly korean: string;
  readonly english: string;
  readonly icon: string;
  readonly color: number;
}

/**
 * Gamepad button mapping
 */
export interface GamepadButton {
  readonly index: number;
  readonly korean: string;
  readonly english: string;
  readonly action: string;
  readonly actionKorean: string;
  readonly color: number;
}

/**
 * Control categories for tab navigation
 */
export const CONTROL_CATEGORIES: readonly ControlCategory[] = [
  {
    id: 'combat',
    korean: '전투',
    english: 'Combat',
    icon: '⚔️',
    color: KOREAN_COLORS.ACCENT_GOLD,
  },
  {
    id: 'movement',
    korean: '이동',
    english: 'Movement',
    icon: '🏃',
    color: KOREAN_COLORS.PRIMARY_CYAN,
  },
  {
    id: 'system',
    korean: '시스템',
    english: 'System',
    icon: '⚙️',
    color: KOREAN_COLORS.ACCENT_PURPLE,
  },
] as const;

/**
 * Keyboard layout - all important keys for the game
 * Positioned based on physical keyboard layout
 */
export const KEYBOARD_LAYOUT: readonly KeyData[] = [
  { code: 'Digit1', label: '1', labelKorean: '건', row: 0, col: 0, category: 'stance', description: 'Geon (Heaven)', descriptionKorean: '건 (Heaven)' },
  { code: 'Digit2', label: '2', labelKorean: '태', row: 0, col: 1, category: 'stance', description: 'Tae (Lake)', descriptionKorean: '태 (Lake)' },
  { code: 'Digit3', label: '3', labelKorean: '리', row: 0, col: 2, category: 'stance', description: 'Li (Fire)', descriptionKorean: '리 (Fire)' },
  { code: 'Digit4', label: '4', labelKorean: '진', row: 0, col: 3, category: 'stance', description: 'Jin (Thunder)', descriptionKorean: '진 (Thunder)' },
  { code: 'Digit5', label: '5', labelKorean: '손', row: 0, col: 4, category: 'stance', description: 'Son (Wind)', descriptionKorean: '손 (Wind)' },
  { code: 'Digit6', label: '6', labelKorean: '감', row: 0, col: 5, category: 'stance', description: 'Gam (Water)', descriptionKorean: '감 (Water)' },
  { code: 'Digit7', label: '7', labelKorean: '간', row: 0, col: 6, category: 'stance', description: 'Gan (Mountain)', descriptionKorean: '간 (Mountain)' },
  { code: 'Digit8', label: '8', labelKorean: '곤', row: 0, col: 7, category: 'stance', description: 'Gon (Earth)', descriptionKorean: '곤 (Earth)' },
  
  { code: 'KeyQ', label: 'Q', row: 1, col: 0, category: 'technique', description: 'Technique 1', descriptionKorean: '기술 1' },
  { code: 'KeyW', label: 'W', labelKorean: '전진', row: 1, col: 1, category: 'movement', description: 'Move Forward', descriptionKorean: '전진' },
  { code: 'KeyE', label: 'E', row: 1, col: 2, category: 'technique', description: 'Technique 2', descriptionKorean: '기술 2' },
  { code: 'KeyR', label: 'R', row: 1, col: 3, category: 'technique', description: 'Technique 3', descriptionKorean: '기술 3' },
  { code: 'KeyT', label: 'T', row: 1, col: 4, category: 'technique', description: 'Technique 4', descriptionKorean: '기술 4' },
  { code: 'KeyY', label: 'Y', row: 1, col: 5, category: 'technique', description: 'Technique 5', descriptionKorean: '기술 5' },
  
  { code: 'KeyA', label: 'A', labelKorean: '좌', row: 2, col: 0, category: 'movement', description: 'Move Left', descriptionKorean: '좌측 이동' },
  { code: 'KeyS', label: 'S', labelKorean: '후퇴', row: 2, col: 1, category: 'movement', description: 'Move Back', descriptionKorean: '후퇴' },
  { code: 'KeyD', label: 'D', labelKorean: '우', row: 2, col: 2, category: 'movement', description: 'Move Right', descriptionKorean: '우측 이동' },
  { code: 'KeyF', label: 'F', row: 2, col: 3, category: 'technique', description: 'Technique 6', descriptionKorean: '기술 6' },
  { code: 'KeyG', label: 'G', row: 2, col: 4, category: 'technique', description: 'Technique 7', descriptionKorean: '기술 7' },
  
  { code: 'KeyZ', label: 'Z', row: 3, col: 0, category: 'technique', description: 'Technique 8', descriptionKorean: '기술 8' },
  { code: 'KeyX', label: 'X', row: 3, col: 1, category: 'technique', description: 'Technique 9', descriptionKorean: '기술 9' },
  { code: 'KeyC', label: 'C', row: 3, col: 2, category: 'technique', description: 'Technique 10', descriptionKorean: '기술 10' },
  { code: 'KeyV', label: 'V', labelKorean: '급소', row: 3, col: 3, category: 'combat', description: 'Vital Points', descriptionKorean: '급소 표시' },
  { code: 'KeyB', label: 'B', labelKorean: '방어', row: 3, col: 4, category: 'combat', description: 'Block/Guard', descriptionKorean: '방어' },
  
  { code: 'Space', label: 'Space', labelKorean: '공격', row: 4, col: 2, width: 3, category: 'combat', description: 'Attack', descriptionKorean: '공격' },
  
  { code: 'ShiftLeft', label: 'Shift', labelKorean: '전술', row: 3, col: -1, width: 1, category: 'modifier', description: 'Tactical Step', descriptionKorean: '전술 보법' },
  { code: 'ControlLeft', label: 'Ctrl', labelKorean: '보법', row: 4, col: -1, width: 1, category: 'modifier', description: 'Advanced Footwork', descriptionKorean: '고급 보법' },
  
  { code: 'ArrowUp', label: '↑', labelKorean: '전진', row: 1, col: 10, category: 'movement', description: 'Move Forward', descriptionKorean: '전진' },
  { code: 'ArrowLeft', label: '←', labelKorean: '좌', row: 2, col: 9, category: 'movement', description: 'Move Left', descriptionKorean: '좌측 이동' },
  { code: 'ArrowDown', label: '↓', labelKorean: '후퇴', row: 2, col: 10, category: 'movement', description: 'Move Back', descriptionKorean: '후퇴' },
  { code: 'ArrowRight', label: '→', labelKorean: '우', row: 2, col: 11, category: 'movement', description: 'Move Right', descriptionKorean: '우측 이동' },
  
  { code: 'Escape', label: 'ESC', labelKorean: '일시정지', row: 0, col: -2, category: 'system', description: 'Pause Menu', descriptionKorean: '일시정지' },
  { code: 'KeyM', label: 'M', labelKorean: '메뉴', row: 2, col: 6, category: 'system', description: 'Menu', descriptionKorean: '메뉴' },
  { code: 'Tab', label: 'Tab', labelKorean: '전환', row: 1, col: -1, width: 1, category: 'system', description: 'Switch Archetype', descriptionKorean: '전환' },
] as const;

/**
 * Gamepad button mappings (Xbox-style controller)
 */
export const GAMEPAD_BUTTONS: readonly GamepadButton[] = [
  { index: 0, korean: 'A', english: 'A', action: 'Attack', actionKorean: '공격', color: KOREAN_COLORS.ACCENT_GREEN },
  { index: 1, korean: 'B', english: 'B', action: 'Block', actionKorean: '방어', color: KOREAN_COLORS.ACCENT_RED },
  { index: 2, korean: 'X', english: 'X', action: 'Technique 1', actionKorean: '기술 1', color: KOREAN_COLORS.ACCENT_BLUE },
  { index: 3, korean: 'Y', english: 'Y', action: 'Technique 2', actionKorean: '기술 2', color: KOREAN_COLORS.ACCENT_YELLOW },
  { index: 4, korean: 'LB', english: 'LB', action: 'Previous Stance', actionKorean: '이전 자세', color: KOREAN_COLORS.UI_STEEL_GRAY },
  { index: 5, korean: 'RB', english: 'RB', action: 'Next Stance', actionKorean: '다음 자세', color: KOREAN_COLORS.UI_STEEL_GRAY },
  { index: 6, korean: 'LT', english: 'LT', action: 'Vital Points', actionKorean: '급소 표시', color: KOREAN_COLORS.UI_STEEL_GRAY_DARK },
  { index: 7, korean: 'RT', english: 'RT', action: 'Special Attack', actionKorean: '특수 공격', color: KOREAN_COLORS.UI_STEEL_GRAY_DARK },
  { index: 8, korean: 'Back', english: 'Back', action: 'Menu', actionKorean: '메뉴', color: KOREAN_COLORS.UI_BORDER },
  { index: 9, korean: 'Start', english: 'Start', action: 'Pause', actionKorean: '일시정지', color: KOREAN_COLORS.UI_BORDER },
  { index: 10, korean: 'L3', english: 'L3', action: 'Lock Target', actionKorean: '목표 고정', color: KOREAN_COLORS.UI_DISABLED_TEXT },
  { index: 11, korean: 'R3', english: 'R3', action: 'Camera Reset', actionKorean: '카메라 리셋', color: KOREAN_COLORS.UI_DISABLED_TEXT },
] as const;

/**
 * Get key category color
 */
export function getKeyCategoryColor(category: KeyCategory): number {
  switch (category) {
    case 'stance':
      return KOREAN_COLORS.ACCENT_GOLD;
    case 'movement':
      return KOREAN_COLORS.PRIMARY_CYAN;
    case 'combat':
      return KOREAN_COLORS.ACCENT_RED;
    case 'technique':
      return KOREAN_COLORS.ACCENT_PURPLE;
    case 'system':
      return KOREAN_COLORS.ACCENT_ORANGE;
    case 'modifier':
      return KOREAN_COLORS.ACCENT_BLUE;
    default:
      return KOREAN_COLORS.UI_STEEL_GRAY;
  }
}

/**
 * Filter keys by category
 */
export function filterKeysByCategory(keys: readonly KeyData[], category: string): readonly KeyData[] {
  return keys.filter(key => {
    if (category === 'combat') {
      return key.category === 'combat' || key.category === 'stance' || key.category === 'technique';
    }
    if (category === 'movement') {
      return key.category === 'movement' || key.category === 'modifier';
    }
    if (category === 'system') {
      return key.category === 'system';
    }
    return false;
  });
}
