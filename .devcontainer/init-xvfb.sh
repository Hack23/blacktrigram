# .devcontainer/init-xvfb.sh - Enhanced for Three.js/WebGL support
#!/bin/bash
set -e

export DISPLAY=:99
# Suppress xkbcomp warnings
export XKB_DEFAULT_RULES=evdev
export XKB_DEFAULT_MODEL=pc105  
export XKB_DEFAULT_LAYOUT=us

# Install necessary packages if they are not present
if ! dpkg -s xvfb >/dev/null 2>&1; then
    echo "🔧 Installing Three.js test environment dependencies..."
    sudo apt-get update
    sudo apt-get install -y \
        xvfb dbus dbus-x11 x11-utils \
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
        xdg-utils wget gnupg libxkbcommon0 xkb-data
    
    echo "✅ Dependencies installed successfully"
fi

# Install Chrome separately - check if Chrome is installed
if ! command -v google-chrome >/dev/null 2>&1; then
    echo "🌐 Installing Google Chrome for WebGL rendering..."
    
    # Use modern GPG keyring approach (apt-key is deprecated)
    sudo mkdir -p /etc/apt/keyrings
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub \
        | sudo gpg --dearmor -o /etc/apt/keyrings/google-chrome.gpg
    
    echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
        | sudo tee /etc/apt/sources.list.d/google-chrome.list
    
    sudo apt-get update
    sudo apt-get install -y google-chrome-stable
    
    # Verify installation succeeded
    if command -v google-chrome >/dev/null 2>&1; then
        echo "✅ Chrome installed successfully: $(google-chrome --version)"
    else
        echo "❌ Chrome installation failed!"
        exit 1
    fi
fi

# Setup D-Bus - use session bus for dev container (more appropriate than system bus)
if [ -z "$DBUS_SESSION_BUS_ADDRESS" ]; then
    echo "🔧 Starting D-Bus session bus..."
    
    # Try to start a session bus
    if command -v dbus-launch >/dev/null 2>&1; then
        eval $(dbus-launch --sh-syntax)
        export DBUS_SESSION_BUS_ADDRESS
        echo "✅ D-Bus session bus started: $DBUS_SESSION_BUS_ADDRESS"
    else
        echo "⚠️ dbus-launch not available, skipping D-Bus setup"
    fi
else
    echo "✅ D-Bus session bus already available: $DBUS_SESSION_BUS_ADDRESS"
fi

# Ensure X11 socket directory exists with proper permissions
sudo mkdir -p /tmp/.X11-unix
sudo chmod 1777 /tmp/.X11-unix
sudo chown root:root /tmp/.X11-unix

# Kill any existing Xvfb on display :99
pkill -f "Xvfb $DISPLAY" 2>/dev/null || true
sleep 1

# Check if Xvfb is already running
if pgrep -x "Xvfb" > /dev/null; then
    echo "✅ Xvfb already running on display $DISPLAY"
else
    echo "🖥️ Starting Xvfb with Three.js/WebGL support on display $DISPLAY..."
    
    # Start Xvfb with GLX extension for WebGL rendering
    # +extension GLX: OpenGL support for WebGL
    # +extension RANDR: Screen resize/rotate for responsive testing
    # +render: X Render extension for compositing
    # -nolisten tcp: Suppress keyboard configuration warnings
    Xvfb $DISPLAY -screen 0 1280x720x24 -ac +extension GLX +extension RANDR +render -nolisten tcp &
    XVFB_PID=$!
    
    # Give Xvfb time to initialize
    sleep 2
    
    # Check if process is still running
    if ! kill -0 $XVFB_PID 2>/dev/null; then
        echo "❌ Xvfb process died immediately"
        echo "Trying alternative Xvfb configuration..."
        
        # Try simpler configuration
        Xvfb $DISPLAY -screen 0 1024x768x24 &
        XVFB_PID=$!
        sleep 2
    fi
    
    # Wait for Xvfb to be ready
    for i in 1 2 3 4 5 6 7 8 9 10; do
        if kill -0 $XVFB_PID 2>/dev/null && xdpyinfo -display $DISPLAY >/dev/null 2>&1; then
            echo "✅ Xvfb is ready with Three.js/WebGL support (PID: $XVFB_PID)"
            break
        fi
        echo "⏳ Waiting for Xvfb... ($i/10)"
        sleep 1
    done
    
    # Final verification
    if ! xdpyinfo -display $DISPLAY >/dev/null 2>&1; then
        echo "⚠️ Xvfb may not be fully ready, but continuing..."
        echo "Xvfb process status: $(kill -0 $XVFB_PID 2>&1 && echo 'running' || echo 'not running')"
        # Don't exit with error - let the container start anyway
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

