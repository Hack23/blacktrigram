/**
 * Shared constants for event listener management
 * 이벤트 리스너 관리를 위한 공유 상수
 */

/**
 * Events that should automatically use passive listeners for performance
 * 성능을 위해 자동으로 패시브 리스너를 사용해야 하는 이벤트
 *
 * Passive listeners indicate to the browser that the event handler will not
 * call preventDefault(), allowing the browser to optimize scrolling performance.
 * 패시브 리스너는 이벤트 핸들러가 preventDefault()를 호출하지 않음을 브라우저에
 * 알려 브라우저가 스크롤 성능을 최적화할 수 있도록 합니다.
 *
 * This list is shared between EventManager and the audit script to ensure
 * consistent behavior across runtime and static analysis.
 * 이 목록은 EventManager와 감사 스크립트 간에 공유되어 런타임과 정적 분석 간에
 * 일관된 동작을 보장합니다.
 */
export const PASSIVE_EVENT_TYPES = [
  "scroll",
  "wheel",
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
  "mousewheel",
] as const;

/**
 * Set of passive event types for efficient lookup
 * 효율적인 조회를 위한 패시브 이벤트 유형 세트
 */
export const PASSIVE_EVENTS = new Set<string>(PASSIVE_EVENT_TYPES);
