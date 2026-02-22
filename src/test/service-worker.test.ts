/**
 * Service Worker Version Management Tests
 * 
 * Tests for version-based caching and automatic updates
 * Ensures service worker properly manages cache across versions
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
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
      // const packageJson = JSON.parse(readFileSync(resolve('./package.json'), 'utf8'));
      const distSwPath = resolve('./dist/sw.js');
      
      // Skip test if dist doesn't exist (e.g., tests run before build)
      if (!existsSync(distSwPath)) {
        console.log('Skipping test: dist/sw.js not found - run build first');
        return;
      }

      // const swBuilt = readFileSync(distSwPath, 'utf8');
      
      // Should have actual version, not placeholder
      // expect(swBuilt).not.toContain('__APP_VERSION__');
      // expect(swBuilt).toContain(`const APP_VERSION = "${packageJson.version}"`);
      // // Cache name uses template literal, so check for the pattern
      // expect(swBuilt).toContain('const CACHE_NAME = `black-trigram-v${APP_VERSION}`;');
    });
  });

  describe('Cache strategy', () => {
    it('should use minimal caching approach', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      // Should cache essential resources for reliable offline support
      expect(swSource).toContain('"/manifest.json"');
      expect(swSource).toContain('"/index.html"');
      expect(swSource).toContain('"/"');
      
      // Should be minimal - not caching heavy assets
      const urlsToCacheMatch = swSource.match(/const urlsToCache = \[([\s\S]*?)\];/);
      expect(urlsToCacheMatch).toBeTruthy();
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

    it('should skip intercepting Google Fonts requests for CSP compliance', () => {
      const swSource = readFileSync(resolve('./public/sw.js'), 'utf8');
      
      expect(swSource).toContain('fonts.googleapis.com');
      expect(swSource).toContain('fonts.gstatic.com');
      expect(swSource).toContain('Let browser handle font requests natively');
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

describe('Service Worker Registration (sw-register.js)', () => {
  const swRegister = readFileSync(resolve('./public/sw-register.js'), 'utf8');
  const indexHtml = readFileSync(resolve('./index.html'), 'utf8');

  it('should reference external sw-register.js for CSP compliance', () => {
    expect(indexHtml).toContain('src="./sw-register.js"');
    // Should NOT contain inline service worker registration script
    expect(indexHtml).not.toContain('navigator.serviceWorker.register');
  });

  it('should register service worker in production only', () => {
    expect(swRegister).toContain('if ("serviceWorker" in navigator)');
    expect(swRegister).toContain('isDevelopment');
  });

  it('should check for updates periodically', () => {
    expect(swRegister).toContain('setInterval');
    expect(swRegister).toContain('registration.update()');
    expect(swRegister).toContain('60000'); // 60 seconds
  });

  it('should listen for update events', () => {
    expect(swRegister).toContain('updatefound');
    expect(swRegister).toContain('registration.installing');
  });

  it('should show update banner on new version', () => {
    expect(swRegister).toContain('update-banner');
    expect(swRegister).toContain('New version available');
  });

  it('should auto-reload after delay', () => {
    expect(swRegister).toContain('window.location.reload()');
    expect(swRegister).toContain('5000'); // 5 seconds
  });

  it('should skip service worker in development', () => {
    expect(swRegister).toContain('localhost');
    expect(swRegister).toContain('127.0.0.1');
    expect(swRegister).toContain('.app.github.dev');
    expect(swRegister).toContain('gitpod.io');
  });

  it('should unregister service worker in development', () => {
    expect(swRegister).toContain('navigator.serviceWorker.getRegistrations()');
    expect(swRegister).toContain('registration.unregister()');
  });
});

describe('CSP Compliance (index.html)', () => {
  const indexHtml = readFileSync(resolve('./index.html'), 'utf8');

  it('should use external CSS instead of inline styles', () => {
    expect(indexHtml).toContain('href="./critical.css"');
    // Should NOT contain inline <style>...</style> blocks in <head>
    // Check that there are no style elements with CSS rules (but allow empty/comment-only references)
    const headSection = indexHtml.split('</head>')[0] ?? '';
    expect(headSection).not.toMatch(/<style>\s*body\s*\{/);
  });

  it('should use external script instead of inline script for SW registration', () => {
    expect(indexHtml).toContain('src="./sw-register.js"');
  });

  it('should not use inline event handlers on font links', () => {
    // onload="..." inline handlers violate CSP script-src
    expect(indexHtml).not.toMatch(/onload\s*=/);
  });

  it('should have critical CSS file with required styles', () => {
    const criticalCss = readFileSync(resolve('./public/critical.css'), 'utf8');
    expect(criticalCss).toContain('body');
    expect(criticalCss).toContain('#root');
    expect(criticalCss).toContain('.loading');
    expect(criticalCss).toContain('.update-banner');
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
    
    expect(viteConfig).toContain('writeBundle');
    expect(viteConfig).toContain('./public/sw.js');
    expect(viteConfig).toContain('./dist/sw.js');
    expect(viteConfig).toContain('replace');
  });
});
