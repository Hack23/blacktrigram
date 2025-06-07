/**
 * Combat control configuration for Korean martial arts
 */

import type { CombatControlsConfig } from "../controls";

// Define the combat controls configuration
export const COMBAT_CONTROLS: CombatControlsConfig = {
  stanceControls: {
    "1": { stance: "geon", korean: "건", technique: "천둥벽력" },
    "2": { stance: "tae", korean: "태", technique: "유수연타" },
    "3": { stance: "li", korean: "리", technique: "화염지창" },
    "4": { stance: "jin", korean: "진", technique: "벽력일섬" },
    "5": { stance: "son", korean: "손", technique: "선풍연격" },
    "6": { stance: "gam", korean: "감", technique: "수류반격" },
    "7": { stance: "gan", korean: "간", technique: "반석방어" },
    "8": { stance: "gon", korean: "곤", technique: "대지포옹" },
  },
  movement: {
    KeyW: "전진 (Forward)",
    KeyA: "좌측 이동 (Move Left)",
    KeyS: "후진 (Backward)",
    KeyD: "우측 이동 (Move Right)",
    ArrowUp: "전진 (Forward)",
    ArrowLeft: "좌측 이동 (Move Left)",
    ArrowDown: "후진 (Backward)",
    ArrowRight: "우측 이동 (Move Right)",
  },
  combat: {
    Space: "기술 실행 (Execute Technique)",
    ShiftLeft: "방어 자세 (Defensive Guard)",
    ControlLeft: "급소 조준 모드 (Vital Point Targeting)",
    Tab: "플레이어 전환 (Switch Player)",
    Enter: "확인 (Confirm)",
  },
  system: {
    Escape: "일시정지 / 메뉴 (Pause / Menu)",
    F1: "도움말 (Help)",
    KeyM: "음소거 (Mute)",
    F11: "전체화면 (Fullscreen)",
  },
};

// Key mapping for easier lookup
export const KEY_MAPPINGS = {
  STANCE_KEYS: ["1", "2", "3", "4", "5", "6", "7", "8"],
  MOVEMENT_KEYS: [
    "KeyW",
    "KeyA",
    "KeyS",
    "KeyD",
    "ArrowUp",
    "ArrowLeft",
    "ArrowDown",
    "ArrowRight",
  ],
  COMBAT_KEYS: ["Space", "ShiftLeft", "ControlLeft"],
  SYSTEM_KEYS: ["Escape", "F1", "KeyM", "F11"],
} as const;

// Input action types
export const INPUT_ACTIONS = {
  STANCE_CHANGE: "stance_change",
  ATTACK: "attack",
  DEFEND: "defend",
  MOVE: "move",
  SPECIAL: "special",
  PAUSE: "pause",
  TARGET: "target",
} as const;
