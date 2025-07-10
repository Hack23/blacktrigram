# .devcontainer/init-xvfb.sh - Enhanced version
#!/bin/bash
set -e

export DISPLAY=:99

# Check if Xvfb is already running
if pgrep -x "Xvfb" > /dev/null; then
    echo "✅ Xvfb already running"
else
    echo "🖥️ Starting Xvfb on display $DISPLAY..."
    Xvfb $DISPLAY -screen 0 1280x1024x24 -ac +extension GLX &
    
    # Wait for Xvfb to be ready
    for i in {1..10}; do
        if xdpyinfo -display $DISPLAY >/dev/null 2>&1; then
            echo "✅ Xvfb ready"
            break
        fi
        sleep 1
    done
fi

# Setup D-Bus with better error handling
echo "🔧 Setting up D-Bus..."
if [ ! -e "/var/run/dbus/system_bus_socket" ]; then
    sudo mkdir -p /var/run/dbus
    if ! pgrep dbus-daemon > /dev/null; then
        sudo dbus-daemon --system --fork
    fi
fi

echo "✅ Display environment ready"