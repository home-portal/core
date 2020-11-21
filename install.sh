#!/bin/bash

set -euo pipefail

# Usage:
#   curl -Lo- https://cutt.ly/get-home-portal | bash
# or
#   curl -Lo- https://cutt.ly/get-home-portal | ENV_VAR=... bash -
#
# Example:
#  Install Home Portal with a remote configuration
#    curl -Lo- https://cutt.ly/get-home-portal | CONFIGURATION_URL=... bash -
#
#  Install Home Portal and download configuration from a URL
#    curl -Lo- https://cutt.ly/get-home-portal | DONWLOAD_CONFIGURATION_URL=... bash -

GITHUB_REPO="home-portal/core"
TARGET_DIR="/opt/home-portal"
HTTP_PORT=4000

# -----------------------------------------------------------------

ARCH=$(uname -m)
OS=$(echo `uname`|tr '[:upper:]' '[:lower:]')

BLACK=$(tput setaf 0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
LIME_YELLOW=$(tput setaf 190)
POWDER_BLUE=$(tput setaf 153)
BLUE=$(tput setaf 4)
MAGENTA=$(tput setaf 5)
CYAN=$(tput setaf 6)
WHITE=$(tput setaf 7)
NORMAL=$(tput sgr0)
BLINK=$(tput blink)
REVERSE=$(tput smso)
UNDERLINE=$(tput smul)
BOLD=$(tput bold)

DONE="...${GREEN}done!${NORMAL}"
SKIP="...${YELLOW}skip!${NORMAL}"

startBanner() {
    echo -e "${YELLOW}Installing Home Portal application...${NORMAL}"
}

getSystemInfo() {
    echo "Getting system information..."
    case $ARCH in
        armv7*)
                ARCH="arm7";;
        aarch64)
                ARCH="arm64";;
        x86_64)
                ARCH="amd64";;
    esac

    echo "Your machine is running ${OS} on ${ARCH} CPU architecture."
}

installDependencies() {
    sudo apt-get update

    # Install unclutter
    sudo apt-get install -y unclutter

    # Install Node.js
    echo "Installing Node.js..."
    curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
    sudo apt-get install -y nodejs
    echo "Installed Node.js version: `node -v`"
    echo "Installed NPM version: `npm -v`"
}

getLatestRelease() {
    local release_url="https://api.github.com/repos/${GITHUB_REPO}/releases"
    local latest_release=""

    echo "Getting the latest release"
    latest_release=$(curl -s $release_url | grep \"tag_name\" | awk 'NR==1{print $2}' |  sed -n 's/\"\(.*\)\",/\1/p')
    echo -e "${YELLOW}Latest Home Portal release: ${latest_release}${NORMAL}"

    LATEST_RELEASE_TAG=$latest_release
    DOWNLOAD_URL="https://api.github.com/repos/${GITHUB_REPO}/tarball/${LATEST_RELEASE_TAG}"

    TMP_ROOT=$(mktemp -dt home-portal-install-XXXXXX)
    TMP_FILE="$TMP_ROOT/home-portal-core-${LATEST_RELEASE_TAG}.tar.gz"
    echo "Temp file: ${TMP_FILE}"

    echo "Downloading $DOWNLOAD_URL ..."
    curl -SsL "$DOWNLOAD_URL" -o "$TMP_FILE"

    if [ ! -f "$TMP_FILE" ]; then
        echo "Failed to download $DOWNLOAD_URL ..."
        exit 1
    fi
}

installApp() {
    echo "Target directory: $TARGET_DIR"
    # mkdir if not exists
    if [ ! -d $TARGET_DIR ]; then
	sudo mkdir -p $TARGET_DIR
        sudo chown $USER:$USER $TARGET_DIR
    fi

    echo "Unpacking tarball..."
    tar xf "$TMP_FILE" -C "$TARGET_DIR" --strip-components=1

    echo "Register Home Portal as a service..."
    cat <<EOF >$HOME/home-portal.service
[Unit]
Description=Home Portal
After=network.target

[Service]
Environment="PORT=${HTTP_PORT}"
Environment="NODE_ENV=production"
Environment="${CONFIGURATION_URL:-}"
Type=simple
WorkingDirectory=/opt/home-portal
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=5

StandardOutput=syslog
StandardError=syslog

[Install]
WantedBy=multi-user.target
EOF
    sudo mv $HOME/home-portal.service /lib/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable home-portal

    echo "Installing NPM dependencies..."
    pushd $TARGET_DIR
    npm i --production
    popd

	if [ -z "$DONWLOAD_CONFIGURATION_URL" ]
	then
		echo "Downloading Home Portal configuration from '${DONWLOAD_CONFIGURATION_URL}'..."
		curl -Ls $DONWLOAD_CONFIGURATION_URL --output $TARGET_DIR/configuration.yaml
		echo $DONE
	fi
}

autoStartWithoutDesktop() {
    cat <<EOF >$HOME/.xsession
#!/bin/bash
# Disable screensaver
xset s off

# Disable black border
xset s noblank

# Disable electric save (black screen)
xset -dpms

# Chrome switches: https://peter.sh/experiments/chromium-command-line-switches/
# sleep 5
echo "Waiting for backend..."
while [[ "\$(curl -s -o /dev/null -w '%{response_code}' http://localhost:$HTTP_PORT/)" != "200" ]]; do sleep 1; echo "Waiting..."; done

openbox-session & chromium-browser --noerrdialogs --kiosk http://localhost:$HTTP_PORT?mode=local --incognito --disable-translate --disable-pinch --overscroll-history-navigation=0

EOF
}

autoStartWithDesktop() {
    mkdir -p  /home/pi/.config/lxsession/LXDE-pi
    cat <<EOF >/home/pi/.config/lxsession/LXDE-pi/autostart
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xset s off
@xset -dpms
@xset s noblank
@chromium-browser --noerrdialogs --kiosk http://localhost:$HTTP_PORT?mode=local --incognito --disable-translate --disable-pinch --overscroll-history-navigation=0

EOF
}

initRaspbian() {
	# Change hostname
	local IP=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n 1`
	local NEWHOST=homeportal-`echo $ip | awk -F"." '{ printf $3$4 }'`
	sudo hostnamectl set-hostname ${NEWHOST}

    # Disable lecture message
    sudo touch /var/lib/sudo/lectured/pi

    # Disable SSH password warning
	#   Credits: https://raspberrypisig.com/blog/raspbian/2019/02/26/disable-ssh-warning/
	sudo rm -rf /etc/profile.d/sshpwd.sh
	sudo rm -rf /etc/xdg/lxsession/LXDE-pi/sshpwd.sh
	sudo rm -rf /etc/xdg/autostart/pprompt.desktop

    # TODO: Install ZRam

    # Disable welcome wizard
    sudo rm -rf /etc/xdg/autostart/piwiz.desktop

    # Add Auto nightly restart
    echo "0 2 * * * /sbin/shutdown -r now" | sudo crontab

    # Autostart Chromium
    autoStartWithDesktop
}

createVersionFile() {
    echo " Create VERSION file..."
    echo "$LATEST_RELEASE_TAG" > ~/VERSION
}

setupTerminalBanner() {
    echo "Create banner script..."
    cat <<'EOF' | sudo tee /etc/motd >/dev/null
  _   _                        ____            _        _
 | | | | ___  _ __ ___   ___  |  _ \ ___  _ __| |_ __ _| |
 | |_| |/ _ \| '_ ` _ \ / _ \ | |_) / _ \| '__| __/ _` | |
 |  _  | (_) | | | | | |  __/ |  __/ (_) | |  | || (_| | |
 |_| |_|\___/|_| |_| |_|\___| |_|   \___/|_|   \__\__,_|_|

EOF
    local BANNER_SCRIPT=$TARGET_DIR/banner.sh
    chmod +x ${BANNER_SCRIPT}
    echo ${DONE}

    echo " Add banner script to .profile..."
	PROFILE_FILE=~/.profile
	if [ `cat ${PROFILE_FILE} | grep banner.sh | wc -l` = 0 ]; then
		cp ${PROFILE_FILE} ${PROFILE_FILE}.bak
		echo "export DISPLAY=:0.0"$'\n' >> ${PROFILE_FILE}
		echo "source ${BANNER_SCRIPT}"$'\n' >> ${PROFILE_FILE}

		echo ${DONE}
	else
		echo ${SKIP}
	fi
}

fail_trap() {
    result=$?
    if [ "$result" != "0" ]; then
        echo -e "${RED}Failed to install Home Portal!${NORMAL}"
    fi
    cleanup
    exit $result
}

cleanup() {
    if [[ -d "${TMP_ROOT:-}" ]]; then
        rm -rf "$TMP_ROOT"
    fi
}

# catch errors and print help
trap "fail_trap" EXIT

finishBanner() {
    echo -e "${GREEN}Home Portal ${LATEST_RELEASE_TAG} installed successfully. Restarting after 5 seconds...${NORMAL}"
    sleep 5
    sudo reboot
}

startBanner
getSystemInfo
installDependencies
initRaspbian
getLatestRelease
installApp
setupTerminalBanner
cleanup
createVersionFile
finishBanner

