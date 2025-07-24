# .devcontainer/init-xvfb.sh - Enhanced version
#!/bin/bash
set -e

export DISPLAY=:99

# Install necessary packages if they are not present
if ! dpkg -s xvfb >/dev/null 2>&1; then
    echo "🔧 Installing GUI and display dependencies..."
    sudo apt-get update
    sudo apt-get install -y --no-install-recommends \
        xvfb \
        dbus-x11 \
        libgtk-3-0 \
        libnotify-dev \
        libnss3 \
        libxss1 \
        libasound2 \
        libxtst6 \
        xauth graphviz libgtk2.0-0 libgtk-3-0 ffmpeg libgbm-dev libnotify-dev fonts-noto fonts-noto-cjk fonts-noto-cjk-extra

   sudo apt-get update \
    && sudo apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub \
        | sudo apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" \
        | sudo tee /etc/apt/sources.list.d/google-chrome.list \
    && sudo apt-get update \
    && sudo apt-get install -y google-chrome-stable

fi

# Check if Xvfb is already running
if pgrep -x "Xvfb" > /dev/null; then
    echo "✅ Xvfb already running."
else
    echo "🖥️ Starting Xvfb on display $DISPLAY..."
    #Xvfb $DISPLAY -screen 0 1280x1024x24 -ac +extension GLX &
    
    # Wait for Xvfb to be ready
   # for i in {1..10}; do
    #    if xdpyinfo -display $DISPLAY >/dev/null 2>&1; then
     #       echo "✅ Xvfb is ready."
      #      break
       # fi
       # echo "Waiting for Xvfb..."
       # sleep 1
    done
fi


echo "✅ Display environment is ready."