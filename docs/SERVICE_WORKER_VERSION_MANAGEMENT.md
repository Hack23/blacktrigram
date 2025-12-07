# Service Worker Version Management

## Overview

Black Trigram uses a version-based service worker caching strategy that ensures users always get the latest version while maintaining offline functionality. This document explains how the system works and how to manage it.

## Quick Start

### For Developers

1. **Update version**: Increment version in `package.json`
2. **Build**: Run `npm run build`
3. **Deploy**: The service worker will automatically use the new version

### For Users

When a new version is deployed:
1. The app automatically checks for updates every 60 seconds
2. A green banner appears: "🎮 New version available! Tap to reload"
3. The page auto-reloads after 5 seconds (or tap banner to reload immediately)
4. Old cached content is automatically deleted

## Architecture

### Version Injection Flow

```
package.json (v0.5.13)
       ↓
vite.config.ts (reads version)
       ↓
public/sw.js (__APP_VERSION__ placeholder)
       ↓
Build: injectVersionPlugin
       ↓
dist/sw.js (const APP_VERSION = "0.5.13")
```

### Cache Strategy

```
User Request → Network First → Success? → Cache & Return
                     ↓
                   Failed?
                     ↓
                 Check Cache → Found? → Return Cached
                     ↓
                   Not Found? → Offline Error
```

## How It Works

### 1. Build-Time Version Injection

The `vite.config.ts` includes a custom plugin that:
- Reads version from `package.json`
- Copies `public/sw.js` to `dist/sw.js`
- Replaces `__APP_VERSION__` placeholder with actual version

```typescript
function injectVersionPlugin(): Plugin {
  return {
    name: 'inject-version-to-sw',
    apply: 'build',
    writeBundle() {
      const swContent = readFileSync('./public/sw.js', 'utf8');
      const updatedContent = swContent.replace(
        /__APP_VERSION__/g,
        packageJson.version
      );
      writeFileSync('./dist/sw.js', updatedContent, 'utf8');
    }
  };
}
```

### 2. Version-Based Cache Names

Cache name format: `black-trigram-v${APP_VERSION}`

Examples:
- v0.5.13 → `black-trigram-v0.5.13`
- v0.6.0 → `black-trigram-v0.6.0`

This ensures:
- Each version has a unique cache
- Old caches are automatically identified and deleted
- No conflicts between versions

### 3. Minimal Caching Strategy

**What gets cached:**
- `/`, `/index.html`, and `/manifest.json` (pre-cached on install)
- All successfully fetched resources (on demand)

**What doesn't get cached initially:**
- JavaScript bundles (cached on first use via network-first)
- CSS files (cached on first use via network-first)
- Assets (cached on first use via network-first)

This minimizes:
- Initial cache size
- Update time
- Storage usage

### 4. Network-First Strategy

All resources use network-first strategy:

```javascript
fetch(event.request)
  .then(response => {
    // Cache the fresh response
    caches.open(CACHE_NAME).then(cache => {
      cache.put(event.request, response.clone());
    });
    return response;
  })
  .catch(() => {
    // Only use cache when offline
    return caches.match(event.request);
  });
```

Benefits:
- Users always get fresh content when online
- Cache serves as offline fallback only
- No stale content issues

### 5. Aggressive Cache Cleanup

On activation, the service worker:
1. Gets all cache names
2. Deletes any cache matching `black-trigram-*` that isn't current version
3. Takes control of all pages immediately

```javascript
caches.keys().then(cacheNames => {
  return Promise.all(
    cacheNames.map(cacheName => {
      if (cacheName.startsWith("black-trigram-") && 
          cacheName !== CACHE_NAME) {
        return caches.delete(cacheName);
      }
    })
  );
});
```

### 6. Automatic Update Detection

The `index.html` registration script:

```javascript
// Check for updates every 60 seconds
setInterval(() => {
  registration.update();
}, 60000);

// Listen for new versions
registration.addEventListener("updatefound", () => {
  // Show update banner
  // Auto-reload after 5 seconds
});
```

## Cache Lifecycle

### First Visit
1. Service worker installs
2. Caches `/manifest.json`
3. User browses, resources cached on demand
4. Cache name: `black-trigram-v0.5.13`

### Version Update (v0.5.13 → v0.6.0)
1. User visits site, SW checks for updates
2. New SW detected with different version
3. New SW installs in background
4. Update banner appears
5. Page reloads (auto or manual)
6. New SW activates
7. Old cache `black-trigram-v0.5.13` deleted
8. New cache `black-trigram-v0.6.0` created

### Offline Mode
1. User goes offline
2. All requests fail to fetch
3. Service worker serves from cache
4. User can still use app with cached content

## Development Mode

Service worker is **automatically disabled** in development:
- `localhost`
- `127.0.0.1`
- `192.168.*.*` (local network)
- `10.*.*.*` (private network)
- `.app.github.dev` (GitHub Codespaces)
- `gitpod.io` (Gitpod)
- Any URL with a port number

This prevents:
- Caching issues during development
- Stale content in dev environment
- Need to manually unregister SW

## Debugging

### Check Current Version

In browser console:
```javascript
// Check service worker version
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Registrations:', regs);
});

// Check caches
caches.keys().then(names => {
  console.log('Cache names:', names);
});
```

### View Cache Contents

```javascript
caches.open('black-trigram-v0.5.13').then(cache => {
  cache.keys().then(keys => {
    console.log('Cached URLs:', keys.map(k => k.url));
  });
});
```

### Force Update

```javascript
// Manually trigger update check
navigator.serviceWorker.getRegistrations().then(regs => {
  regs[0].update();
});
```

### Clear All Caches

```javascript
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

## Troubleshooting

### Problem: Users not getting latest version

**Check:**
1. Is build version in `dist/sw.js` correct?
   ```bash
   head -5 dist/sw.js
   # Should show: const APP_VERSION = "0.5.13"
   ```

2. Is cache name updated?
   - Browser DevTools → Application → Cache Storage
   - Should see `black-trigram-v0.5.13`

3. Is update detection working?
   - Browser DevTools → Console
   - Should see update logs after 60 seconds

**Solutions:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear cache: DevTools → Application → Clear Storage
- Unregister SW: DevTools → Application → Service Workers → Unregister

### Problem: Service worker not installing

**Check:**
1. Is environment production?
   - Service worker is disabled in development
   - Check URL doesn't contain localhost or port number

2. Is HTTPS enabled?
   - Service workers require HTTPS (or localhost)
   - Check browser console for security errors

3. Is `dist/sw.js` deployed?
   - Check network tab for 404 errors
   - Verify build includes `sw.js`

### Problem: Old content still showing

**Check:**
1. Network-first strategy active?
   - Browser DevTools → Network
   - Resources should show "from network" not "from cache"

2. Cache being updated?
   - Check service worker logs in console
   - Should see version-specific cache operations

**Solutions:**
- Increment version in `package.json`
- Rebuild: `npm run build`
- Deploy new version
- Wait 60 seconds for update check

## Best Practices

### Version Bumping

Follow semantic versioning:
- **Patch** (0.5.13 → 0.5.14): Bug fixes
- **Minor** (0.5.13 → 0.6.0): New features
- **Major** (0.5.13 → 1.0.0): Breaking changes

### Testing Updates

Before deploying:
1. Build: `npm run build`
2. Check `dist/sw.js` has correct version
3. Run tests: `npm test -- service-worker.test.ts`
4. Test locally with `npm run preview`
5. Deploy to production

### Mobile Testing

Test update flow on mobile:
1. Deploy new version
2. Open app on mobile device
3. Wait 60 seconds
4. Verify update banner appears
5. Verify auto-reload works
6. Verify new version loaded

## Performance Impact

### Cache Size
- **Minimal**: Only essential assets cached
- **Growth**: Grows as user browses (cached on demand)
- **Cleanup**: Old versions automatically deleted

### Update Speed
- **Detection**: 60 seconds maximum
- **Download**: Depends on network speed
- **Activation**: Immediate (skipWaiting + clients.claim)
- **Page reload**: < 1 second

### Network Usage
- **Online**: All requests go to network first
- **Offline**: Serves from cache
- **Hybrid**: Cache misses fetch from network

## Related Files

- `public/sw.js` - Service worker source (with placeholder)
- `dist/sw.js` - Built service worker (with version)
- `vite.config.ts` - Build configuration with injection plugin
- `index.html` - Service worker registration script
- `package.json` - Version source of truth
- `src/test/service-worker.test.ts` - Test suite

## References

- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [Network-first caching strategy](https://web.dev/offline-cookbook/#network-falling-back-to-cache)
- [Service Worker lifecycle](https://web.dev/service-worker-lifecycle/)

## License

This service worker implementation is part of Black Trigram and follows the same license as the main project.

---

**흑괘의 길을 걸어라** - _Walk the Path of the Black Trigram_
