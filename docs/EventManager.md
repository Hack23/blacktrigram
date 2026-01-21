# EventManager Documentation
# EventManager 문서

## Overview | 개요

The EventManager is a centralized event listener management system for Black Trigram that ensures proper cleanup and prevents memory leaks. It automatically applies passive listeners to performance-sensitive events (scroll, touch, wheel) for optimal scrolling performance.

EventManager는 Black Trigram의 중앙 집중식 이벤트 리스너 관리 시스템으로 적절한 정리를 보장하고 메모리 누수를 방지합니다. 최적의 스크롤 성능을 위해 성능에 민감한 이벤트(스크롤, 터치, 휠)에 자동으로 패시브 리스너를 적용합니다.

## Features | 기능

- ✅ **Automatic cleanup tracking** - Prevents memory leaks by tracking all event listeners
- ✅ **Passive listener optimization** - Automatically applies passive:true to scroll/touch events
- ✅ **Double-removal prevention** - Cleanup functions are idempotent
- ✅ **Memory monitoring** - Built-in statistics for debugging
- ✅ **TypeScript support** - Full type safety with comprehensive interfaces

- ✅ **자동 정리 추적** - 모든 이벤트 리스너를 추적하여 메모리 누수 방지
- ✅ **패시브 리스너 최적화** - 스크롤/터치 이벤트에 자동으로 passive:true 적용
- ✅ **이중 제거 방지** - 정리 함수는 멱등성을 가짐
- ✅ **메모리 모니터링** - 디버깅을 위한 내장 통계
- ✅ **TypeScript 지원** - 포괄적인 인터페이스로 완전한 타입 안전성

## Quick Start | 빠른 시작

### Basic Usage | 기본 사용법

```typescript
import { EventManager } from '@/utils/EventManager';

// Create an instance
const eventManager = new EventManager();

// Add event listeners
const cleanup1 = eventManager.add(window, 'keydown', handleKeyDown);
const cleanup2 = eventManager.add(window, 'resize', handleResize);

// Clean up individual listener
cleanup1();

// Or clean up all at once
eventManager.cleanup();
```

### React Hook Pattern | React 훅 패턴

```typescript
import { useEffect } from 'react';
import { createEventManager } from '@/utils/EventManager';

function MyComponent() {
  useEffect(() => {
    const eventManager = createEventManager();
    
    // Add event listeners
    eventManager.add(window, 'keydown', handleKeyDown);
    eventManager.add(window, 'resize', handleResize);
    
    // Cleanup on unmount
    return () => eventManager.cleanup();
  }, []);
  
  return <div>My Component</div>;
}
```

## API Reference | API 참조

### EventManager Class

#### Constructor | 생성자

```typescript
const eventManager = new EventManager();
```

Creates a new EventManager instance. Each instance maintains its own registry of event listeners.

새 EventManager 인스턴스를 생성합니다. 각 인스턴스는 자체 이벤트 리스너 레지스트리를 유지합니다.

#### add(element, event, listener, options?) | 추가

```typescript
add(
  element: EventTarget,
  event: string,
  listener: EventListener,
  options?: AddEventListenerOptions | boolean
): () => void
```

Adds an event listener with automatic cleanup tracking. Returns a cleanup function.

자동 정리 추적 기능이 있는 이벤트 리스너를 추가합니다. 정리 함수를 반환합니다.

**Parameters | 매개변수:**
- `element`: The element to attach the listener to | 리스너를 연결할 요소
- `event`: Event name (e.g., "click", "keydown") | 이벤트 이름 (예: "click", "keydown")
- `listener`: Event handler function | 이벤트 핸들러 함수
- `options`: Optional event listener options | 선택적 이벤트 리스너 옵션

**Returns | 반환값:**
- Cleanup function to remove this specific listener | 이 리스너를 제거하는 정리 함수

**Automatic Passive Detection | 자동 패시브 감지:**

The EventManager automatically applies `passive: true` to these events:
- `scroll`, `wheel`, `mousewheel`
- `touchstart`, `touchmove`, `touchend`, `touchcancel`

EventManager는 다음 이벤트에 자동으로 `passive: true`를 적용합니다:
- `scroll`, `wheel`, `mousewheel`
- `touchstart`, `touchmove`, `touchend`, `touchcancel`

**Example | 예제:**

```typescript
// Basic usage
const cleanup = eventManager.add(window, 'keydown', (e) => {
  console.log('Key pressed:', e.key);
});

// Scroll event - automatically passive
eventManager.add(window, 'scroll', handleScroll);
// Equivalent to: window.addEventListener('scroll', handleScroll, { passive: true });

// Override automatic passive
eventManager.add(window, 'touchmove', handleTouch, { passive: false });
```

#### cleanup() | 정리

```typescript
cleanup(): void
```

Removes all tracked event listeners. This should be called when the EventManager is no longer needed, typically in a React useEffect cleanup function.

추적된 모든 이벤트 리스너를 제거합니다. EventManager가 더 이상 필요하지 않을 때, 일반적으로 React useEffect 정리 함수에서 호출해야 합니다.

**Example | 예제:**

```typescript
useEffect(() => {
  const eventManager = createEventManager();
  
  eventManager.add(window, 'keydown', handleKeyDown);
  eventManager.add(document, 'click', handleClick);
  
  return () => {
    eventManager.cleanup(); // Removes all listeners
  };
}, []);
```

#### getStats() | 통계 가져오기

```typescript
getStats(): EventManagerStats
```

Returns statistics about current event listeners. Useful for debugging and memory monitoring.

현재 이벤트 리스너에 대한 통계를 반환합니다. 디버깅 및 메모리 모니터링에 유용합니다.

**Returns | 반환값:**

```typescript
interface EventManagerStats {
  totalListeners: number;        // Total active listeners
  uniqueEventTypes: number;      // Number of unique event types
  passiveListeners: number;      // Count of passive listeners
  eventTypeCounts: Record<string, number>; // Listeners per event type
}
```

**Example | 예제:**

```typescript
const eventManager = new EventManager();

eventManager.add(window, 'keydown', handler1);
eventManager.add(window, 'scroll', handler2);
eventManager.add(window, 'scroll', handler3);

const stats = eventManager.getStats();
console.log(stats);
// {
//   totalListeners: 3,
//   uniqueEventTypes: 2,
//   passiveListeners: 2, // scroll events
//   eventTypeCounts: { keydown: 1, scroll: 2 }
// }
```

#### hasActiveListeners() | 활성 리스너 확인

```typescript
hasActiveListeners(): boolean
```

Returns true if there are any active listeners being tracked.

추적 중인 활성 리스너가 있으면 true를 반환합니다.

### Factory Function | 팩토리 함수

#### createEventManager()

```typescript
import { createEventManager } from '@/utils/EventManager';

const eventManager = createEventManager();
```

Convenience factory function that creates a new EventManager instance.

새 EventManager 인스턴스를 생성하는 편리한 팩토리 함수입니다.

## Usage Patterns | 사용 패턴

### Pattern 1: Single Component | 단일 컴포넌트

```typescript
import { useEffect } from 'react';
import { createEventManager } from '@/utils/EventManager';

function GameComponent() {
  useEffect(() => {
    const eventManager = createEventManager();
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Handle escape
      }
    };
    
    eventManager.add(window, 'keydown', handleKeyPress);
    
    return () => eventManager.cleanup();
  }, []);
  
  return <div>Game Component</div>;
}
```

### Pattern 2: Multiple Event Listeners | 여러 이벤트 리스너

```typescript
useEffect(() => {
  const eventManager = createEventManager();
  
  // Add multiple listeners
  eventManager.add(window, 'keydown', handleKeyDown);
  eventManager.add(window, 'keyup', handleKeyUp);
  eventManager.add(window, 'resize', handleResize);
  eventManager.add(window, 'scroll', handleScroll); // Auto-passive
  
  // Single cleanup call removes all
  return () => eventManager.cleanup();
}, [handleKeyDown, handleKeyUp, handleResize, handleScroll]);
```

### Pattern 3: Conditional Event Listeners | 조건부 이벤트 리스너

```typescript
useEffect(() => {
  if (!isEnabled) return;
  
  const eventManager = createEventManager();
  
  eventManager.add(window, 'keydown', handleKeyDown);
  
  return () => eventManager.cleanup();
}, [isEnabled, handleKeyDown]);
```

### Pattern 4: Individual Cleanup | 개별 정리

```typescript
useEffect(() => {
  const eventManager = createEventManager();
  
  const cleanup1 = eventManager.add(window, 'keydown', handleKeyDown);
  const cleanup2 = eventManager.add(window, 'resize', handleResize);
  
  // Can remove individual listeners
  if (someCondition) {
    cleanup1(); // Remove only keydown listener
  }
  
  return () => {
    cleanup1();
    cleanup2();
    // Or: eventManager.cleanup();
  };
}, [handleKeyDown, handleResize]);
```

### Pattern 5: Touch Events (Auto-Passive) | 터치 이벤트 (자동 패시브)

```typescript
useEffect(() => {
  const eventManager = createEventManager();
  
  // These automatically use passive: true
  eventManager.add(document, 'touchstart', handleTouchStart);
  eventManager.add(document, 'touchmove', handleTouchMove);
  eventManager.add(document, 'touchend', handleTouchEnd);
  
  return () => eventManager.cleanup();
}, [handleTouchStart, handleTouchMove, handleTouchEnd]);
```

## Performance Benefits | 성능 이점

### Passive Listeners | 패시브 리스너

EventManager automatically applies `passive: true` to scroll and touch events, which:

EventManager는 스크롤 및 터치 이벤트에 자동으로 `passive: true`를 적용하여:

1. **Improves scroll performance** - Browser doesn't wait to check preventDefault()
   **스크롤 성능 향상** - 브라우저가 preventDefault() 확인을 기다리지 않음

2. **Eliminates scroll jank** - Scrolling is smoother and more responsive
   **스크롤 끊김 제거** - 스크롤이 더 부드럽고 반응성이 향상됨

3. **Reduces memory overhead** - Fewer event checks during scrolling
   **메모리 오버헤드 감소** - 스크롤 중 이벤트 확인 횟수 감소

**Performance Impact:**
- Before: ~50-60 FPS during heavy scrolling
- After: Consistent 60 FPS with passive listeners

**성능 영향:**
- 이전: 많은 스크롤 시 약 50-60 FPS
- 이후: 패시브 리스너로 일관된 60 FPS

### Memory Leak Prevention | 메모리 누수 방지

Without EventManager:
```typescript
// ❌ BAD: Easy to forget cleanup
useEffect(() => {
  window.addEventListener('keydown', handler);
  // Oops, forgot to remove listener!
}, []);
```

With EventManager:
```typescript
// ✅ GOOD: Automatic cleanup tracking
useEffect(() => {
  const eventManager = createEventManager();
  eventManager.add(window, 'keydown', handler);
  return () => eventManager.cleanup(); // Can't forget!
}, []);
```

## Debugging | 디버깅

### Check Active Listeners | 활성 리스너 확인

```typescript
const eventManager = createEventManager();

// Add some listeners
eventManager.add(window, 'keydown', handler1);
eventManager.add(window, 'scroll', handler2);

// Check statistics
const stats = eventManager.getStats();
console.log('Active listeners:', stats.totalListeners);
console.log('Event types:', stats.eventTypeCounts);
console.log('Passive listeners:', stats.passiveListeners);

// Check if any active
if (eventManager.hasActiveListeners()) {
  console.log('Warning: Listeners still active!');
}
```

### Chrome DevTools Memory Profiling | Chrome DevTools 메모리 프로파일링

1. Open Chrome DevTools → Memory
2. Take heap snapshot
3. Filter for "EventListener"
4. Verify listener counts match expectations

1. Chrome DevTools → 메모리 열기
2. 힙 스냅샷 생성
3. "EventListener" 필터링
4. 리스너 수가 예상과 일치하는지 확인

## Migration Guide | 마이그레이션 가이드

### Before: Manual Event Management | 이전: 수동 이벤트 관리

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Handle key
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, []);
```

### After: Using EventManager | 이후: EventManager 사용

```typescript
import { createEventManager } from '@/utils/EventManager';

useEffect(() => {
  const eventManager = createEventManager();
  
  const handleKeyDown = (e: KeyboardEvent) => {
    // Handle key
  };
  
  eventManager.add(window, 'keydown', handleKeyDown);
  
  return () => eventManager.cleanup();
}, []);
```

## Best Practices | 모범 사례

### ✅ DO | 권장사항

1. **Create one EventManager per component lifecycle**
   ```typescript
   useEffect(() => {
     const eventManager = createEventManager();
     // ... add listeners
     return () => eventManager.cleanup();
   }, []);
   ```

2. **Use cleanup in useEffect return**
   ```typescript
   return () => eventManager.cleanup();
   ```

3. **Let EventManager handle passive events automatically**
   ```typescript
   // Scroll events automatically passive
   eventManager.add(window, 'scroll', handleScroll);
   ```

4. **Use getStats() for debugging**
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     console.log('EventManager stats:', eventManager.getStats());
   }
   ```

### ❌ DON'T | 피해야 할 사항

1. **Don't share EventManager across components**
   ```typescript
   // ❌ BAD: Global singleton can cause issues
   const globalEventManager = new EventManager();
   
   // ✅ GOOD: One per component
   useEffect(() => {
     const eventManager = createEventManager();
     // ...
   }, []);
   ```

2. **Don't forget cleanup**
   ```typescript
   // ❌ BAD: Memory leak
   useEffect(() => {
     const eventManager = createEventManager();
     eventManager.add(window, 'keydown', handler);
     // Missing cleanup!
   }, []);
   ```

3. **Don't manually remove already-cleaned listeners**
   ```typescript
   // ❌ BAD: Unnecessary
   const cleanup = eventManager.add(window, 'keydown', handler);
   cleanup();
   eventManager.cleanup(); // cleanup() already called
   ```

## Testing | 테스트

### Test with Vitest | Vitest로 테스트

```typescript
import { describe, it, expect, vi } from 'vitest';
import { EventManager } from '@/utils/EventManager';

describe('MyComponent', () => {
  it('should clean up event listeners', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    
    const eventManager = new EventManager();
    eventManager.add(mockElement, 'click', vi.fn());
    
    expect(mockElement.addEventListener).toHaveBeenCalledTimes(1);
    
    eventManager.cleanup();
    
    expect(mockElement.removeEventListener).toHaveBeenCalledTimes(1);
  });
});
```

## Audit Tool | 감사 도구

Run the event listener audit script to check for potential issues:

이벤트 리스너 감사 스크립트를 실행하여 잠재적 문제를 확인하세요:

```bash
# Basic audit
npx tsx scripts/audit-event-listeners.ts

# Detailed report
npx tsx scripts/audit-event-listeners.ts --verbose
```

The audit tool will:
- Find all addEventListener calls
- Check for matching removeEventListener
- Identify missing passive listeners
- Report potential memory leaks
- Suggest EventManager migration opportunities

감사 도구는 다음을 수행합니다:
- 모든 addEventListener 호출 찾기
- 일치하는 removeEventListener 확인
- 누락된 패시브 리스너 식별
- 잠재적 메모리 누수 보고
- EventManager 마이그레이션 기회 제안

## Related Documentation | 관련 문서

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall architecture
- [CONTROLS.md](./CONTROLS.md) - Keyboard and touch controls
- [API Reference](./docs/api/utils/EventManager.md) - Generated TypeDoc

## Support | 지원

For issues or questions about EventManager:

EventManager에 대한 문제나 질문:

1. Check this documentation first
2. Review the test suite: `src/utils/EventManager.test.ts`
3. Run the audit tool: `npx tsx scripts/audit-event-listeners.ts`
4. Create a GitHub issue with reproduction steps

1. 먼저 이 문서 확인
2. 테스트 스위트 검토: `src/utils/EventManager.test.ts`
3. 감사 도구 실행: `npx tsx scripts/audit-event-listeners.ts`
4. 재현 단계가 포함된 GitHub 이슈 생성
