# .devcontainer/init-xvfb.sh - Enhanced for Three.js/WebGL support
#!/bin/bash
set -e

export DISPLAY=:99

# Install necessary packages if they are not present
if ! dpkg -s xvfb >/dev/null 2>&1; then
    echo "🔧 Installing Three.js test environment dependencies..."
    sudo apt-get update
    sudo apt-get install -y --no-install-recommends \
        xvfb dbus-x11 \
        libgtk-3-0 libgtk2.0-0 \
        libnotify-dev libnss3 libxss1 \
        libasound2 libxtst6 xauth \
        graphviz ffmpeg libgbm-dev \
        fonts-noto fonts-noto-cjk fonts-noto-cjk-extra \
        ca-certificates fonts-liberation \
        libatk-bridge2.0-0 libatk1.0-0 \
        libcups2 libdbus-1-3 libdrm2 \
        libnspr4 libx11-xcb1 \
        libxcomposite1 libxdamage1 libxfixes3 \
        libxrandr2 libxrender1 libxshmfence1 \
        xdg-utils wget

    # Install Chrome for Three.js WebGL support
    echo "🌐 Installing Google Chrome for WebGL rendering..."
    sudo apt-get update \
        && sudo apt-get install -y wget gnupg \
        && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub \
            | sudo apt-key add - \
        && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" \
            | sudo tee /etc/apt/sources.list.d/google-chrome.list \
        && sudo apt-get update \
        && sudo apt-get install -y google-chrome-stable
    
    echo "✅ Dependencies installed successfully"
fi

# Setup D-Bus if not running
if ! pgrep -x "dbus-daemon" > /dev/null; then
    echo "🔧 Starting D-Bus..."
    sudo mkdir -p /var/run/dbus
    sudo dbus-daemon --system --fork
    echo "✅ D-Bus started"
fi

# Check if Xvfb is already running
if pgrep -x "Xvfb" > /dev/null; then
    echo "✅ Xvfb already running on display $DISPLAY"
else
    echo "🖥️ Starting Xvfb with Three.js/WebGL support on display $DISPLAY..."
    # Enhanced Xvfb flags for Three.js:
    # - GLX extension: Required for WebGL
    # - RANDR extension: Required for display management
    # - render: Hardware acceleration support
    # - ac: Disable access control
    Xvfb $DISPLAY -screen 0 1280x720x24 -ac +extension GLX +extension RANDR +render &
    
    # Wait for Xvfb to be ready
    for i in {1..10}; do
        if xdpyinfo -display $DISPLAY >/dev/null 2>&1; then
            echo "✅ Xvfb is ready with Three.js/WebGL support"
            break
        fi
        echo "⏳ Waiting for Xvfb... ($i/10)"
        sleep 1
    done
    
    # Verify Xvfb started successfully
    if ! xdpyinfo -display $DISPLAY >/dev/null 2>&1; then
        echo "❌ Failed to start Xvfb"
        exit 1
    fi
fi

# Display environment info
echo "========================================="
echo "Three.js Test Environment Ready"
echo "========================================="
echo "Display: $DISPLAY"
echo "Xvfb: $(pgrep -x Xvfb >/dev/null && echo '✅ Running' || echo '❌ Not running')"
echo "D-Bus: $(pgrep -x dbus-daemon >/dev/null && echo '✅ Running' || echo '❌ Not running')"
echo "Chrome: $(google-chrome --version 2>/dev/null || echo '⚠️ Not installed')"
echo "========================================="
echo "Ready for Three.js E2E testing with:"
echo "- WebGL rendering via SwiftShader"
echo "- Target: 30-60fps"
echo "- Memory: 4GB Node.js heap"
echo "========================================="

