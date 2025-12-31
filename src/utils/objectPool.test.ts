/**
 * Tests for objectPool utility
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ObjectPool, Poolable, prewarmPool } from './objectPool';

class TestObject implements Poolable {
  value = 0;
  name = '';

  reset(value: number, name: string): void {
    this.value = value;
    this.name = name;
  }
}

describe('ObjectPool', () => {
  let pool: ObjectPool<TestObject>;

  beforeEach(() => {
    pool = new ObjectPool(() => new TestObject(), 10);
  });

  it('should create new objects when pool is empty', () => {
    const obj = pool.acquire();
    expect(obj).toBeInstanceOf(TestObject);
    expect(pool.size).toBe(0);
  });

  it('should reuse objects from pool', () => {
    const obj1 = pool.acquire();
    obj1.reset(100, 'test');
    pool.release(obj1);

    expect(pool.size).toBe(1);

    const obj2 = pool.acquire();
    expect(obj2).toBe(obj1); // Same object reference
    expect(pool.size).toBe(0);
  });

  it('should respect max pool size', () => {
    const smallPool = new ObjectPool(() => new TestObject(), 2);

    const obj1 = smallPool.acquire();
    const obj2 = smallPool.acquire();
    const obj3 = smallPool.acquire();

    smallPool.release(obj1);
    smallPool.release(obj2);
    smallPool.release(obj3); // Should be discarded

    expect(smallPool.size).toBe(2);
  });

  it('should clear all objects', () => {
    const obj1 = pool.acquire();
    const obj2 = pool.acquire();
    
    pool.release(obj1);
    pool.release(obj2);
    
    expect(pool.size).toBe(2);
    
    pool.clear();
    
    expect(pool.size).toBe(0);
  });

  it('should return correct capacity', () => {
    expect(pool.capacity).toBe(10);
  });

  it('should handle multiple acquire/release cycles', () => {
    const objects: TestObject[] = [];

    // Acquire multiple objects
    for (let i = 0; i < 5; i++) {
      const obj = pool.acquire();
      obj.reset(i, `object${i}`);
      objects.push(obj);
    }

    expect(pool.size).toBe(0);

    // Release all objects
    objects.forEach(obj => pool.release(obj));

    expect(pool.size).toBe(5);

    // Acquire again
    const reused = pool.acquire();
    expect(objects).toContain(reused);
  });

  describe('prewarmPool', () => {
    it('should populate pool with objects', () => {
      const newPool = new ObjectPool(() => new TestObject(), 50);
      
      expect(newPool.size).toBe(0);
      
      prewarmPool(newPool, 20);
      
      expect(newPool.size).toBe(20);
    });

    it('should respect pool max size when prewarming', () => {
      const smallPool = new ObjectPool(() => new TestObject(), 10);
      
      prewarmPool(smallPool, 20); // Try to prewarm more than capacity
      
      expect(smallPool.size).toBe(10); // Should cap at max size
    });
  });

  describe('real-world usage scenario', () => {
    it('should efficiently handle damage number pooling', () => {
      class DamageNumber implements Poolable {
        damage = 0;
        x = 0;
        y = 0;
        timestamp = 0;

        reset(damage: number, x: number, y: number): void {
          this.damage = damage;
          this.x = x;
          this.y = y;
          this.timestamp = Date.now();
        }
      }

      const damagePool = new ObjectPool(() => new DamageNumber(), 100);
      prewarmPool(damagePool, 50);

      // Simulate damage numbers being created/destroyed rapidly
      const activeDamages: DamageNumber[] = [];

      // Create 10 damage numbers
      for (let i = 0; i < 10; i++) {
        const damage = damagePool.acquire();
        damage.reset(100 + i, i * 10, i * 5);
        activeDamages.push(damage);
      }

      expect(damagePool.size).toBe(40); // 50 - 10 acquired

      // Release damage numbers after animation
      activeDamages.forEach(damage => damagePool.release(damage));

      expect(damagePool.size).toBe(50); // Back to prewarmed size

      // Verify objects are reused
      const reused = damagePool.acquire();
      expect(activeDamages).toContain(reused);
    });
  });
});
