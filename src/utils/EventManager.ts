import { PASSIVE_EVENTS } from "./eventConstants";

/**
 * EventManager - Centralized event listener management system
 * 이벤트 관리자 - 중앙 집중식 이벤트 리스너 관리 시스템
 *
 * This class provides a centralized way to manage event listeners across the application,
 * ensuring proper cleanup and preventing memory leaks. It automatically applies passive
 * listeners to scroll and touch events for optimal performance.
 *
 * 이 클래스는 애플리케이션 전체의 이벤트 리스너를 관리하는 중앙 집중식 방법을 제공하여
 * 적절한 정리를 보장하고 메모리 누수를 방지합니다. 최적의 성능을 위해 스크롤 및 터치
 * 이벤트에 자동으로 패시브 리스너를 적용합니다.
 *
 * @example
 * ```typescript
 * // Create an event manager instance
 * const eventManager = new EventManager();
 *
 * // Add event listeners (passive automatically applied to scroll/touch)
 * const cleanup1 = eventManager.add(window, "keydown", handleKeyDown);
 * const cleanup2 = eventManager.add(window, "scroll", handleScroll); // Passive: true
 *
 * // Cleanup individual listener
 * cleanup1();
 *
 * // Or cleanup all at once
 * eventManager.cleanup();
 * ```
 *
 * @example
 * ```typescript
 * // Use in React useEffect
 * useEffect(() => {
 *   const eventManager = new EventManager();
 *
 *   eventManager.add(window, "keydown", handleKeyDown);
 *   eventManager.add(window, "resize", handleResize);
 *
 *   return () => eventManager.cleanup();
 * }, [handleKeyDown, handleResize]);
 * ```
 */

/**
 * Tracks a single event listener with its element and handler
 * 단일 이벤트 리스너를 해당 요소 및 핸들러와 함께 추적
 */
interface TrackedListener {
  /** The element the listener is attached to / 리스너가 연결된 요소 */
  readonly element: EventTarget;
  /** The event handler function / 이벤트 핸들러 함수 */
  readonly listener: EventListener;
  /** Options used when adding the listener / 리스너 추가 시 사용된 옵션 */
  readonly options?: AddEventListenerOptions | boolean;
}

/**
 * Statistics about event listeners managed by EventManager
 * EventManager가 관리하는 이벤트 리스너에 대한 통계
 */
export interface EventManagerStats {
  /** Total number of active listeners / 활성 리스너 총 개수 */
  readonly totalListeners: number;
  /** Number of unique event types / 고유한 이벤트 유형 수 */
  readonly uniqueEventTypes: number;
  /** Number of listeners using passive mode / 패시브 모드를 사용하는 리스너 수 */
  readonly passiveListeners: number;
  /** Event types and their listener counts / 이벤트 유형 및 해당 리스너 수 */
  readonly eventTypeCounts: Record<string, number>;
}

/**
 * EventManager class for centralized event listener management
 * 중앙 집중식 이벤트 리스너 관리를 위한 EventManager 클래스
 */
export class EventManager {
  /**
   * Map of event keys to their tracked listeners
   * Format: "ElementType-eventName" -> TrackedListener[]
   * 이벤트 키를 추적된 리스너에 매핑
   * 형식: "ElementType-eventName" -> TrackedListener[]
   */
  private listeners: Map<string, TrackedListener[]> = new Map();

  /**
   * Add an event listener with automatic cleanup tracking
   * 자동 정리 추적 기능이 있는 이벤트 리스너 추가
   *
   * @param element - The element to attach the listener to / 리스너를 연결할 요소
   * @param event - The event name (e.g., "click", "keydown") / 이벤트 이름 (예: "click", "keydown")
   * @param listener - The event handler function / 이벤트 핸들러 함수
   * @param options - Optional event listener options / 선택적 이벤트 리스너 옵션
   * @returns A cleanup function to remove this specific listener / 이 리스너를 제거하는 정리 함수
   *
   * @example
   * ```typescript
   * const cleanup = eventManager.add(window, "keydown", (e) => {
   *   console.log("Key pressed:", e.key);
   * });
   *
   * // Later, remove just this listener
   * cleanup();
   * ```
   */
  add(
    element: EventTarget,
    event: string,
    listener: EventListener,
    options?: AddEventListenerOptions | boolean,
  ): () => void {
    // Generate a unique key for this event type
    // 이 이벤트 유형에 대한 고유 키 생성
    const key = this.generateKey(element, event);

    // Determine if this should be a passive listener
    // 이것이 패시브 리스너여야 하는지 결정
    const shouldBePassive = this.shouldBePassive(event, options);
    const finalOptions = shouldBePassive
      ? this.mergePassiveOption(options)
      : options;

    // Add the event listener to the element
    // 요소에 이벤트 리스너 추가
    element.addEventListener(event, listener, finalOptions);

    // Track this listener for cleanup
    // 정리를 위해 이 리스너 추적
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }

    const tracked: TrackedListener = {
      element,
      listener,
      options: finalOptions,
    };

    this.listeners.get(key)!.push(tracked);

    // Return cleanup function for this specific listener
    // Track if already removed to prevent double removal
    // 이 특정 리스너에 대한 정리 함수 반환
    // 이중 제거를 방지하기 위해 이미 제거되었는지 추적
    let isRemoved = false;
    return () => {
      if (isRemoved) return; // Already removed, do nothing
      isRemoved = true;

      element.removeEventListener(event, listener, finalOptions);
      this.removeTracked(key, listener);
    };
  }

  /**
   * Remove all tracked event listeners
   * 추적된 모든 이벤트 리스너 제거
   *
   * This method should be called when the EventManager instance is no longer needed,
   * typically in a React useEffect cleanup function.
   * 이 메서드는 EventManager 인스턴스가 더 이상 필요하지 않을 때,
   * 일반적으로 React useEffect 정리 함수에서 호출해야 합니다.
   *
   * @example
   * ```typescript
   * useEffect(() => {
   *   const eventManager = new EventManager();
   *   // ... add listeners
   *   return () => eventManager.cleanup();
   * }, []);
   * ```
   */
  cleanup(): void {
    for (const [key, trackedListeners] of this.listeners) {
      const event = this.extractEventFromKey(key);

      for (const { element, listener, options } of trackedListeners) {
        try {
          element.removeEventListener(event, listener, options);
        } catch (error) {
          // Silently handle errors during cleanup (element may be removed from DOM)
          // 정리 중 오류를 조용히 처리 (요소가 DOM에서 제거되었을 수 있음)
          console.warn(
            `Failed to remove event listener for ${event}:`,
            error,
          );
        }
      }
    }

    this.listeners.clear();
  }

  /**
   * Get statistics about current event listeners
   * 현재 이벤트 리스너에 대한 통계 가져오기
   *
   * Useful for debugging and monitoring memory usage.
   * 디버깅 및 메모리 사용량 모니터링에 유용합니다.
   *
   * @returns Statistics object / 통계 객체
   */
  getStats(): EventManagerStats {
    let totalListeners = 0;
    let passiveListeners = 0;
    const eventTypeCounts: Record<string, number> = {};

    for (const [key, trackedListeners] of this.listeners) {
      const event = this.extractEventFromKey(key);
      const count = trackedListeners.length;

      totalListeners += count;
      eventTypeCounts[event] = (eventTypeCounts[event] ?? 0) + count;

      // Count passive listeners
      // 패시브 리스너 수 세기
      for (const tracked of trackedListeners) {
        if (this.isPassiveOption(tracked.options)) {
          passiveListeners++;
        }
      }
    }

    return {
      totalListeners,
      uniqueEventTypes: this.listeners.size,
      passiveListeners,
      eventTypeCounts,
    };
  }

  /**
   * Check if there are any active listeners
   * 활성 리스너가 있는지 확인
   *
   * @returns true if there are active listeners, false otherwise
   */
  hasActiveListeners(): boolean {
    return this.listeners.size > 0;
  }

  /**
   * Generate a unique key for an event listener
   * 이벤트 리스너에 대한 고유 키 생성
   */
  private generateKey(element: EventTarget, event: string): string {
    const elementType = element.constructor.name;
    return `${elementType}-${event}`;
  }

  /**
   * Extract event name from a key
   * 키에서 이벤트 이름 추출
   */
  private extractEventFromKey(key: string): string {
    return key.split("-").slice(1).join("-");
  }

  /**
   * Determine if an event should use passive listeners
   * 이벤트가 패시브 리스너를 사용해야 하는지 결정
   */
  private shouldBePassive(
    event: string,
    options?: AddEventListenerOptions | boolean,
  ): boolean {
    // If passive is explicitly set, respect that choice
    // 패시브가 명시적으로 설정된 경우 해당 선택 존중
    if (typeof options === "object" && options !== null) {
      if ("passive" in options && options.passive !== undefined) {
        return false; // User explicitly set passive, don't override
      }
    }

    // Auto-apply passive to known performance-sensitive events
    // 알려진 성능에 민감한 이벤트에 자동으로 패시브 적용
    return PASSIVE_EVENTS.has(event);
  }

  /**
   * Merge passive option into existing options
   * 기존 옵션에 패시브 옵션 병합
   */
  private mergePassiveOption(
    options?: AddEventListenerOptions | boolean,
  ): AddEventListenerOptions | boolean {
    if (typeof options === "boolean") {
      // If options is boolean (for useCapture), create object
      // 옵션이 부울(useCapture용)인 경우 객체 생성
      return { capture: options, passive: true };
    } else if (typeof options === "object" && options !== null) {
      // Merge with existing options
      // 기존 옵션과 병합
      return { ...options, passive: true };
    } else {
      // No options provided, just set passive
      // 옵션이 제공되지 않은 경우 패시브만 설정
      return { passive: true };
    }
  }

  /**
   * Check if options specify passive mode
   * 옵션이 패시브 모드를 지정하는지 확인
   */
  private isPassiveOption(
    options?: AddEventListenerOptions | boolean,
  ): boolean {
    return (
      typeof options === "object" && options !== null && options.passive === true
    );
  }

  /**
   * Remove a tracked listener from the internal map
   * 내부 맵에서 추적된 리스너 제거
   */
  private removeTracked(key: string, listener: EventListener): void {
    const tracked = this.listeners.get(key);
    if (tracked) {
      const index = tracked.findIndex((t) => t.listener === listener);
      if (index !== -1) {
        tracked.splice(index, 1);
      }

      // Remove the key if no more listeners
      // 더 이상 리스너가 없으면 키 제거
      if (tracked.length === 0) {
        this.listeners.delete(key);
      }
    }
  }
}

/**
 * Factory function to create a new EventManager instance
 * 새로운 EventManager 인스턴스를 생성하기 위한 팩토리 함수
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   // Create a shared EventManager instance for this component
 *   const eventManager = useMemo(() => createEventManager(), []);
 *
 *   useEffect(() => {
 *     eventManager.add(window, "keydown", handleKeyDown);
 *     return () => eventManager.cleanup();
 *   }, [eventManager, handleKeyDown]);
 * }
 * ```
 */
export function createEventManager(): EventManager {
  return new EventManager();
}
