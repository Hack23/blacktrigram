// Service Worker Registration - Extracted for CSP compliance (no inline scripts)

// Async font loading: swap media from 'print' to 'all' when loaded (CSP-compliant)
(function () {
  var fontLink = document.getElementById("google-fonts");
  if (fontLink) {
    fontLink.addEventListener("load", function () {
      fontLink.media = "all";
    });
    // Fallback: if the link is already loaded (cached), swap immediately
    if (fontLink.sheet) {
      fontLink.media = "all";
    }
  }
})();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    // Check for development environment
    var isDevelopment =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.startsWith("192.168.") ||
      window.location.hostname.startsWith("10.") ||
      window.location.hostname.includes(".app.github.dev") ||
      window.location.hostname.includes("gitpod.io") ||
      window.location.port !== "";

    // Skip SW in development to avoid caching issues
    if (isDevelopment) {
      console.log(
        "Development environment detected - skipping ServiceWorker registration"
      );
      // Unregister any existing SW
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        registrations.forEach(function (registration) {
          registration.unregister();
          console.log("ServiceWorker unregistered for development");
        });
      });
      return;
    }

    var swPath = "./sw.js";
    navigator.serviceWorker
      .register(swPath)
      .then(function (registration) {
        console.log("ServiceWorker registration successful:", registration);

        // Check for updates every 60 seconds
        var updateCheckInterval = setInterval(function () {
          registration.update();
        }, 60000);

        // Clean up interval on page unload to prevent memory leaks
        window.addEventListener("beforeunload", function () {
          clearInterval(updateCheckInterval);
        });

        // Listen for new service worker waiting to activate
        registration.addEventListener("updatefound", function () {
          var newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", function () {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New version available - show update notification
                console.log("New version available! Reloading to update...");

                // Create update banner with accessibility support
                var updateBanner = document.createElement("div");
                updateBanner.id = "update-banner";
                updateBanner.setAttribute("role", "alert");
                updateBanner.setAttribute("aria-live", "assertive");
                updateBanner.setAttribute("tabindex", "0");
                updateBanner.className = "update-banner";
                updateBanner.innerHTML =
                  "\uD83C\uDFAE New version available! Tap to reload and get the latest features \uD83D\uDE80";

                // Guard to prevent double reload
                var hasReloaded = false;

                // Reload on click
                updateBanner.addEventListener("click", function () {
                  if (!hasReloaded) {
                    hasReloaded = true;
                    window.location.reload();
                  }
                });

                // Reload on keyboard interaction (Enter or Space)
                updateBanner.addEventListener("keydown", function (e) {
                  if ((e.key === "Enter" || e.key === " ") && !hasReloaded) {
                    e.preventDefault();
                    hasReloaded = true;
                    window.location.reload();
                  }
                });

                document.body.appendChild(updateBanner);

                // Auto-reload after 5 seconds if user doesn't click
                setTimeout(function () {
                  if (!hasReloaded) {
                    hasReloaded = true;
                    window.location.reload();
                  }
                }, 5000);
              }
            });
          }
        });
      })
      .catch(function (err) {
        console.log("ServiceWorker registration failed:", err);
      });
  });
}
