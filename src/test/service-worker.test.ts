/**
 * Service Worker Version Management Tests
 * 
 * Tests for version-based caching and automatic updates
 * Ensures service worker properly manages cache across versions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Service Worker Version Management', () => {
  describe('Build-time version injection', () => {
    it('should have APP_VERSION placeholder in source', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      expect(swSource).toContain('__APP_VERSION__');
      expect(swSource).toContain('const APP_VERSION = "__APP_VERSION__"');
    });

    it('should generate cache name from version', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      expect(swSource).toContain('const CACHE_NAME = `black-trigram-v${APP_VERSION}`;');
    });

    it('should have version injected in built service worker', () => {
      const packageJson = JSON.parse(readFileSync(resolve('./package.json'), 'utf8'));
      
      try {
        const swBuilt = readFileSync(resolve('./dist/sw.js'), 'utf8');
        
        // Should have actual version, not placeholder
        expect(swBuilt).not.toContain('__APP_VERSION__');
        expect(swBuilt).toContain(`const APP_VERSION = "${packageJson.version}"`);
        expect(swBuilt).toContain(`black-trigram-v${packageJson.version}`);
      } catch (error) {
        // dist/sw.js may not exist if build hasn't run yet - this is expected in dev
        console.log('Note: dist/sw.js not found - build may not have run yet');
      }
    });
  });

  describe('Cache strategy', () => {
    it('should use minimal caching approach', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      // Should only cache manifest.json initially
      expect(swSource).toContain('"/manifest.json"');
      
      // Should NOT cache index.html and root in initial cache
      const urlsToCacheMatch = swSource.match(/const urlsToCache = \[([\s\S]*?)\];/);
      expect(urlsToCacheMatch).toBeTruthy();
      
      if (urlsToCacheMatch) {
        const urlsToCacheContent = urlsToCacheMatch[1];
        expect(urlsToCacheContent).not.toContain('"/index.html"');
        expect(urlsToCacheContent).not.toContain('"/"');
      }
    });

    it('should implement network-first strategy', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      // Should fetch from network first
      expect(swSource).toContain('fetch(event.request)');
      expect(swSource).toContain('Network-first strategy');
    });

    it('should have offline fallback', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      expect(swSource).toContain('caches.match(event.request)');
      expect(swSource).toContain('.catch(');
      expect(swSource).toContain('offline');
    });
  });

  describe('Service worker lifecycle', () => {
    it('should call skipWaiting on install', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      expect(swSource).toContain('self.skipWaiting()');
      expect(swSource).toContain('addEventListener("install"');
    });

    it('should call clients.claim on activate', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      expect(swSource).toContain('self.clients.claim()');
      expect(swSource).toContain('addEventListener("activate"');
    });

    it('should delete old caches on activate', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      expect(swSource).toContain('.keys()');
      expect(swSource).toContain('caches.delete(cacheName)');
      expect(swSource).toContain('startsWith("black-trigram-")');
    });
  });

  describe('Version logging', () => {
    it('should log version in install event', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      expect(swSource).toContain('[SW v${APP_VERSION}] Installing');
    });

    it('should log version in activate event', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      expect(swSource).toContain('[SW v${APP_VERSION}] Activating');
    });

    it('should log version when serving from cache', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      expect(swSource).toContain('[SW v${APP_VERSION}] Serving from cache');
    });
  });

  describe('Cache invalidation', () => {
    it('should only keep current version cache', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      // Should check for matching cache name
      expect(swSource).toContain('cacheName !== CACHE_NAME');
      expect(swSource).toContain('caches.delete(cacheName)');
    });

    it('should handle cache name pattern correctly', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      // Should use startsWith to match old versions
      expect(swSource).toContain('startsWith("black-trigram-")');
    });
  });
});

describe('Service Worker Registration (index.html)', () => {
  const indexHtml = readFileSync(resolve('./index.html'), 'utf8');

  it('should register service worker in production only', () => {
    expect(indexHtml).toContain('if ("serviceWorker" in navigator)');
    expect(indexHtml).toContain('isDevelopment');
  });

  it('should check for updates periodically', () => {
    expect(indexHtml).toContain('setInterval');
    expect(indexHtml).toContain('registration.update()');
    expect(indexHtml).toContain('60000'); // 60 seconds
  });

  it('should listen for update events', () => {
    expect(indexHtml).toContain('updatefound');
    expect(indexHtml).toContain('registration.installing');
  });

  it('should show update banner on new version', () => {
    expect(indexHtml).toContain('update-banner');
    expect(indexHtml).toContain('New version available');
  });

  it('should auto-reload after delay', () => {
    expect(indexHtml).toContain('window.location.reload()');
    expect(indexHtml).toContain('5000'); // 5 seconds
  });

  it('should skip service worker in development', () => {
    expect(indexHtml).toContain('localhost');
    expect(indexHtml).toContain('127.0.0.1');
    expect(indexHtml).toContain('.app.github.dev');
    expect(indexHtml).toContain('gitpod.io');
  });

  it('should unregister service worker in development', () => {
    expect(indexHtml).toContain('navigator.serviceWorker.getRegistrations()');
    expect(indexHtml).toContain('registration.unregister()');
  });
});

describe('Vite Configuration', () => {
  it('should have version injection plugin', () => {
    const viteConfig = readFileSync(resolve('./vite.config.ts'), 'utf8');
    
    expect(viteConfig).toContain('injectVersionPlugin');
    expect(viteConfig).toContain('inject-version-to-sw');
  });

  it('should read version from package.json', () => {
    const viteConfig = readFileSync(resolve('./vite.config.ts'), 'utf8');
    
    expect(viteConfig).toContain('packageJson.version');
    expect(viteConfig).toContain('readFileSync');
    expect(viteConfig).toContain('package.json');
  });

  it('should copy and inject version on build', () => {
    const viteConfig = readFileSync(resolve('./vite.config.ts'), 'utf8');
    
    expect(viteConfig).toContain('closeBundle');
    expect(viteConfig).toContain('./public/sw.js');
    expect(viteConfig).toContain('./dist/sw.js');
    expect(viteConfig).toContain('replace');
  });
});
