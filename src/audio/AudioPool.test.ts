import { beforeEach, describe, expect, it, vi } from "vitest";
import { AudioElementPool, ObjectPool } from "./AudioPool";

// Mock Audio element
class MockAudioElement {
  src = "";
  preload = "auto";
  currentTime = 0;
  paused = true;
  play = vi.fn(() => Promise.resolve());
  pause = vi.fn();
  load = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();

  constructor(src?: string) {
    if (src) {
      this.src = src;
    }
  }
}

global.Audio = MockAudioElement as any;

describe("ObjectPool", () => {
  it("should create pool with initial size", () => {
    const pool = new ObjectPool(
      () => ({ value: 0 }),
      (obj) => {
        obj.value = 0;
      },
      { initialSize: 5, maxSize: 10, autoExpand: true }
    );

    const stats = pool.getStatistics();
    expect(stats.available).toBe(5);
    expect(stats.inUse).toBe(0);
    expect(stats.total).toBe(5);
  });

  it("should acquire objects from pool", () => {
    const pool = new ObjectPool(
      () => ({ value: 0 }),
      (obj) => {
        obj.value = 0;
      },
      { initialSize: 3, maxSize: 10, autoExpand: true }
    );

    const obj1 = pool.acquire();
    const obj2 = pool.acquire();

    expect(obj1).not.toBeNull();
    expect(obj2).not.toBeNull();
    expect(obj1).not.toBe(obj2);

    const stats = pool.getStatistics();
    expect(stats.available).toBe(1);
    expect(stats.inUse).toBe(2);
  });

  it("should release objects back to pool", () => {
    const pool = new ObjectPool(
      () => ({ value: 0 }),
      (obj) => {
        obj.value = 0;
      },
      { initialSize: 3, maxSize: 10, autoExpand: true }
    );

    const obj = pool.acquire();
    expect(obj).not.toBeNull();

    if (obj) {
      obj.value = 42;
      pool.release(obj);

      // Object should be reset
      const stats = pool.getStatistics();
      expect(stats.available).toBe(3);
      expect(stats.inUse).toBe(0);
    }
  });

  it("should auto-expand when pool is exhausted", () => {
    const pool = new ObjectPool(
      () => ({ value: 0 }),
      (obj) => {
        obj.value = 0;
      },
      { initialSize: 2, maxSize: 5, autoExpand: true }
    );

    // Acquire all initial objects
    pool.acquire();
    pool.acquire();

    // Should create new object
    const obj3 = pool.acquire();
    expect(obj3).not.toBeNull();

    const stats = pool.getStatistics();
    expect(stats.total).toBe(3);
    expect(stats.created).toBe(3); // 2 initial + 1 expanded
  });

  it("should not expand beyond max size", () => {
    const pool = new ObjectPool(
      () => ({ value: 0 }),
      (obj) => {
        obj.value = 0;
      },
      { initialSize: 2, maxSize: 2, autoExpand: true }
    );

    pool.acquire();
    pool.acquire();

    // Should return null when max size reached
    const obj3 = pool.acquire();
    expect(obj3).toBeNull();
  });

  it("should not expand when autoExpand is false", () => {
    const pool = new ObjectPool(
      () => ({ value: 0 }),
      (obj) => {
        obj.value = 0;
      },
      { initialSize: 2, maxSize: 5, autoExpand: false }
    );

    pool.acquire();
    pool.acquire();

    // Should return null when pool exhausted
    const obj3 = pool.acquire();
    expect(obj3).toBeNull();
  });

  it("should release all objects", () => {
    const pool = new ObjectPool(
      () => ({ value: 0 }),
      (obj) => {
        obj.value = 0;
      },
      { initialSize: 3, maxSize: 10, autoExpand: true }
    );

    pool.acquire();
    pool.acquire();
    pool.acquire();

    const statsBefore = pool.getStatistics();
    expect(statsBefore.inUse).toBe(3);

    pool.releaseAll();

    const statsAfter = pool.getStatistics();
    expect(statsAfter.inUse).toBe(0);
    expect(statsAfter.available).toBe(3);
  });

  it("should track acquisition and release counts", () => {
    const pool = new ObjectPool(
      () => ({ value: 0 }),
      (obj) => {
        obj.value = 0;
      },
      { initialSize: 3, maxSize: 10, autoExpand: true }
    );

    const obj1 = pool.acquire();
    const obj2 = pool.acquire();

    if (obj1) pool.release(obj1);
    if (obj2) pool.release(obj2);

    const stats = pool.getStatistics();
    expect(stats.acquisitions).toBe(2);
    expect(stats.releases).toBe(2);
  });

  it("should clear pool", () => {
    const pool = new ObjectPool(
      () => ({ value: 0 }),
      (obj) => {
        obj.value = 0;
      },
      { initialSize: 3, maxSize: 10, autoExpand: true }
    );

    pool.acquire();
    pool.acquire();

    pool.clear();

    const stats = pool.getStatistics();
    expect(stats.available).toBe(0);
    expect(stats.inUse).toBe(0);
    expect(stats.total).toBe(0);
  });

  it("should warn when releasing object not in use", () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const pool = new ObjectPool(
      () => ({ value: 0 }),
      (obj) => {
        obj.value = 0;
      },
      { initialSize: 3, maxSize: 10, autoExpand: true }
    );

    const fakeObj = { value: 999 };
    pool.release(fakeObj);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Attempted to release object not in use"
    );

    consoleWarnSpy.mockRestore();
  });

  it("should warn when pool exhausted", () => {
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const pool = new ObjectPool(
      () => ({ value: 0 }),
      (obj) => {
        obj.value = 0;
      },
      { initialSize: 1, maxSize: 1, autoExpand: false }
    );

    pool.acquire();
    pool.acquire(); // Should fail

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Pool exhausted and cannot expand"
    );

    consoleWarnSpy.mockRestore();
  });
});

describe("AudioElementPool", () => {
  let audioPool: AudioElementPool;

  beforeEach(() => {
    audioPool = new AudioElementPool();
    vi.clearAllMocks();
  });

  describe("pool creation", () => {
    it("should create pool for audio asset", () => {
      const pool = audioPool.createPool("test_sound", "/test.mp3");

      expect(pool).toBeDefined();
      expect(audioPool.hasPool("test_sound")).toBe(true);
    });

    it("should return existing pool if already created", () => {
      const pool1 = audioPool.createPool("test_sound", "/test.mp3");
      const pool2 = audioPool.createPool("test_sound", "/test.mp3");

      expect(pool1).toBe(pool2);
    });

    it("should create pool with custom config", () => {
      const pool = audioPool.createPool("test_sound", "/test.mp3", {
        initialSize: 10,
        maxSize: 50,
        autoExpand: false,
      });

      const stats = pool.getStatistics();
      expect(stats.available).toBe(10);
    });

    it("should use default config when not provided", () => {
      const pool = audioPool.createPool("test_sound", "/test.mp3");

      const stats = pool.getStatistics();
      expect(stats.available).toBe(5); // Default initialSize
    });
  });

  describe("audio acquisition and release", () => {
    it("should acquire audio element from pool", () => {
      audioPool.createPool("test_sound", "/test.mp3");
      const audio = audioPool.acquire("test_sound");

      expect(audio).not.toBeNull();
      expect(audio).toBeInstanceOf(MockAudioElement);
    });

    it("should release audio element back to pool", () => {
      audioPool.createPool("test_sound", "/test.mp3");
      const audio = audioPool.acquire("test_sound");

      expect(audio).not.toBeNull();

      if (audio) {
        audioPool.release("test_sound", audio);

        const pool = audioPool.getPool("test_sound");
        const stats = pool?.getStatistics();
        expect(stats?.inUse).toBe(0);
      }
    });

    it("should reset audio element on release", () => {
      audioPool.createPool("test_sound", "/test.mp3");
      const audio = audioPool.acquire("test_sound");

      if (audio) {
        audio.currentTime = 5.0;
        audioPool.release("test_sound", audio);

        expect(audio.pause).toHaveBeenCalled();
        expect(audio.currentTime).toBe(0);
      }
    });

    it("should warn when acquiring from non-existent pool", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const audio = audioPool.acquire("nonexistent");

      expect(audio).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "No pool exists for asset: nonexistent"
      );

      consoleWarnSpy.mockRestore();
    });

    it("should warn when releasing to non-existent pool", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const audio = new MockAudioElement();
      audioPool.release("nonexistent", audio as any);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "No pool exists for asset: nonexistent"
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe("pool management", () => {
    it("should get pool for asset", () => {
      audioPool.createPool("test_sound", "/test.mp3");
      const pool = audioPool.getPool("test_sound");

      expect(pool).toBeDefined();
    });

    it("should return undefined for non-existent pool", () => {
      const pool = audioPool.getPool("nonexistent");

      expect(pool).toBeUndefined();
    });

    it("should remove pool", () => {
      audioPool.createPool("test_sound", "/test.mp3");
      expect(audioPool.hasPool("test_sound")).toBe(true);

      const removed = audioPool.removePool("test_sound");

      expect(removed).toBe(true);
      expect(audioPool.hasPool("test_sound")).toBe(false);
    });

    it("should return false when removing non-existent pool", () => {
      const removed = audioPool.removePool("nonexistent");

      expect(removed).toBe(false);
    });

    it("should clear all pools", () => {
      audioPool.createPool("sound1", "/sound1.mp3");
      audioPool.createPool("sound2", "/sound2.mp3");
      audioPool.createPool("sound3", "/sound3.mp3");

      expect(audioPool.getPoolCount()).toBe(3);

      audioPool.clearAll();

      expect(audioPool.getPoolCount()).toBe(0);
    });

    it("should release all audio in all pools", () => {
      audioPool.createPool("sound1", "/sound1.mp3");
      audioPool.createPool("sound2", "/sound2.mp3");

      audioPool.acquire("sound1");
      audioPool.acquire("sound1");
      audioPool.acquire("sound2");

      audioPool.releaseAll();

      const stats1 = audioPool.getPoolStatistics("sound1");
      const stats2 = audioPool.getPoolStatistics("sound2");

      expect(stats1?.inUse).toBe(0);
      expect(stats2?.inUse).toBe(0);
    });
  });

  describe("statistics", () => {
    it("should get statistics for specific pool", () => {
      audioPool.createPool("test_sound", "/test.mp3");
      audioPool.acquire("test_sound");
      audioPool.acquire("test_sound");

      const stats = audioPool.getPoolStatistics("test_sound");

      expect(stats).toBeDefined();
      expect(stats?.inUse).toBe(2);
      expect(stats?.available).toBe(3); // 5 initial - 2 acquired
    });

    it("should return undefined for non-existent pool statistics", () => {
      const stats = audioPool.getPoolStatistics("nonexistent");

      expect(stats).toBeUndefined();
    });

    it("should get statistics for all pools", () => {
      audioPool.createPool("sound1", "/sound1.mp3");
      audioPool.createPool("sound2", "/sound2.mp3");

      audioPool.acquire("sound1");
      audioPool.acquire("sound2");

      const allStats = audioPool.getAllStatistics();

      expect(allStats.size).toBe(2);
      expect(allStats.has("sound1")).toBe(true);
      expect(allStats.has("sound2")).toBe(true);
    });
  });

  describe("pool existence checks", () => {
    it("should check if pool exists", () => {
      expect(audioPool.hasPool("test_sound")).toBe(false);

      audioPool.createPool("test_sound", "/test.mp3");

      expect(audioPool.hasPool("test_sound")).toBe(true);
    });

    it("should get pool count", () => {
      expect(audioPool.getPoolCount()).toBe(0);

      audioPool.createPool("sound1", "/sound1.mp3");
      audioPool.createPool("sound2", "/sound2.mp3");

      expect(audioPool.getPoolCount()).toBe(2);
    });
  });

  describe("audio element properties", () => {
    it("should create audio elements with correct src", () => {
      audioPool.createPool("test_sound", "/test.mp3");
      const audio = audioPool.acquire("test_sound");

      expect(audio).not.toBeNull();
      expect(audio?.src).toBe("/test.mp3");
      expect(audio?.preload).toBe("auto");
    });

    it("should preload audio elements", () => {
      audioPool.createPool("test_sound", "/test.mp3");
      const audio = audioPool.acquire("test_sound");

      expect(audio?.load).toHaveBeenCalled();
    });
  });

  describe("multiple acquisitions", () => {
    it("should handle multiple acquisitions from same pool", () => {
      audioPool.createPool("test_sound", "/test.mp3", { initialSize: 10 });

      const audios: HTMLAudioElement[] = [];
      for (let i = 0; i < 5; i++) {
        const audio = audioPool.acquire("test_sound");
        if (audio) audios.push(audio);
      }

      expect(audios).toHaveLength(5);

      const stats = audioPool.getPoolStatistics("test_sound");
      expect(stats?.inUse).toBe(5);
      expect(stats?.available).toBe(5); // 10 initial - 5 acquired
    });

    it("should handle pool expansion", () => {
      audioPool.createPool("test_sound", "/test.mp3", {
        initialSize: 2,
        maxSize: 10,
        autoExpand: true,
      });

      // Acquire more than initial size
      const audio1 = audioPool.acquire("test_sound");
      const audio2 = audioPool.acquire("test_sound");
      const audio3 = audioPool.acquire("test_sound");

      expect(audio1).not.toBeNull();
      expect(audio2).not.toBeNull();
      expect(audio3).not.toBeNull();

      const stats = audioPool.getPoolStatistics("test_sound");
      expect(stats?.total).toBe(3);
    });
  });
});
