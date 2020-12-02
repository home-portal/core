#!/bin/bash

set -euo pipefail

# Usage:
#   curl -Lo- https://cutt.ly/install-home-portal | bash
# or
#   curl -Lo- https://cutt.ly/install-home-portal | ENV_VAR=... bash -
#
# Example:
#  Install Home Portal with a remote configuration
#    curl -Lo- https://cutt.ly/install-home-portal | CONFIGURATION_URL=... bash -
#
#  Install Home Portal and download configuration from a URL
#    curl -Lo- https://cutt.ly/install-home-portal | DOWNLOAD_CONFIGURATION_URL=... bash -
#
#  Update Home Portal to a specified version
#    curl -Lo- https://cutt.ly/install-home-portal | UPDATE_ONLY=true HP_VERSION=v0.2.4 bash -
#
#
# Available environment variables
#   - CONFIGURATION_URL=https://.....
#	  Using a remote configuration file.
#
#   - DOWNLOAD_CONFIGURATION_URL=https://.....
#	  Download a remote configuration file from the url and copy to the Home Portal installation folder.
#
#   - HP_VERSION=(v0.2.4|latest|master)
#	  Retrict the Home Portal App version number. It should be an existing release tag on Github.
#	  Special values:
#	    - "latest" - Find the latest stable release. It is the default.
#	    - "master" - Download the latest files from the master git branch.
#
#   - NO_RESTART=true|false
#     Disable restarting at the enf of installation.
#
#   - UPDATE_ONLY=true|false
#     Only update Home Portal application instead of installation.
#
#   - SET_HOSTNAME=homeportal-1
#     Set the hostname of the device
#
#   - NO_ZRAM=true|false
#     Disable ZRAM feature

GITHUB_REPO="home-portal/core"
TARGET_DIR="/opt/home-portal"
HP_VERSION=${HP_VERSION:-latest}
NO_RESTART=${NO_RESTART:-false}
UPDATE_ONLY=${UPDATE_ONLY:-false}
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
	if [ "${UPDATE_ONLY}" != true ];
	then
	    echo -e "${YELLOW}${BOLD}Installing Home Portal application...${NORMAL}"
	else
		echo -e "${YELLOW}${BOLD}Updating Home Portal application...${NORMAL}"
	fi
}

getSystemInfo() {
	echo ""
    echo "${CYAN}Getting system information...${NORMAL}"
    case $ARCH in
        armv7*)
                ARCH="arm7";;
        aarch64)
                ARCH="arm64";;
        x86_64)
                ARCH="amd64";;
    esac

    echo "Your device is running ${OS} on ${ARCH} CPU architecture."
}

installDependencies() {
	echo ""
    echo "${CYAN}Install dependencies...${NORMAL}"

    sudo apt-get update

    # Install unclutter
    sudo apt-get install -y --fix-missing --no-install-recommends unclutter

	if ! command -v node &> /dev/null
    then
		# Install Node.js
		echo ""
		echo "${CYAN}Installing Node.js...${NORMAL}"
		curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
		sudo apt-get install -y nodejs
		echo "${DONE}"
	fi
    echo "Installed Node.js version: `node -v`"
    echo "Installed NPM version: `npm -v`"
}

downloadRelease() {
	echo ""
	echo "${CYAN}Downloading Home Portal...${NORMAL}"

	if [ "${HP_VERSION}" = "latest" ];
	then
		local release_url="https://api.github.com/repos/${GITHUB_REPO}/releases"
		local latest_release=""

		echo "Getting the latest release"
		latest_release=$(curl -s $release_url | grep \"tag_name\" | awk 'NR==1{print $2}' |  sed -n 's/\"\(.*\)\",/\1/p')
		echo -e "${YELLOW}Latest Home Portal release: ${latest_release}${NORMAL}"

		HP_VERSION=$latest_release
	fi
	DOWNLOAD_URL="https://api.github.com/repos/${GITHUB_REPO}/tarball/${HP_VERSION}"

	if [ "${HP_VERSION}" = "master" ];
	then
		DOWNLOAD_URL="https://github.com/${GITHUB_REPO}/archive/master.tar.gz"
	fi

    TMP_ROOT=$(mktemp -dt home-portal-install-XXXXXX)
    TMP_FILE="$TMP_ROOT/home-portal-core-${HP_VERSION}.tar.gz"
    echo "Temp file: ${TMP_FILE}"

    echo "Downloading from '$DOWNLOAD_URL'..."
    curl -SL "$DOWNLOAD_URL" -o "$TMP_FILE"

    if [ ! -f "$TMP_FILE" ]; then
        echo "Failed to download $DOWNLOAD_URL ..."
        exit 1
    fi
	echo "${DONE}"
}

installApp() {
    echo "Target directory: $TARGET_DIR"
    # mkdir if not exists
    if [ ! -d $TARGET_DIR ]; then
        sudo mkdir -p $TARGET_DIR
        sudo chown $USER:$USER $TARGET_DIR
    fi

	echo ""
    echo "${CYAN}Unpacking tarball...${NORMAL}"
    tar xf "$TMP_FILE" -C "$TARGET_DIR" --strip-components=1
	echo "${DONE}"

	echo ""
    echo "${CYAN}Installing NPM dependencies...${NORMAL}"
    pushd $TARGET_DIR
    npm i --production
    popd
	echo "${DONE}"

    if [ -n "${DOWNLOAD_CONFIGURATION_URL:-}" ];
    then
		if [ ! -e "${TARGET_DIR}/configuration.yaml" ];
		then
			echo "Downloading Home Portal configuration from '${DOWNLOAD_CONFIGURATION_URL}'..."
			curl -Ls $DOWNLOAD_CONFIGURATION_URL | sudo tee $TARGET_DIR/configuration.yaml >/dev/null
			echo $DONE
		else
			echo "Configuration is exist. Configuration downloading skipped."
		fi
    fi
}

registerApp() {
	echo ""
    echo "${CYAN}Register Home Portal as a service...${NORMAL}"
    cat <<EOF >$HOME/home-portal.service
[Unit]
Description=Home Portal
After=network.target

[Service]
Environment="PORT=${HTTP_PORT}"
Environment="NODE_ENV=production"
Environment="CONFIGURATION_URL=${CONFIGURATION_URL:-}"
Type=simple
WorkingDirectory=/opt/home-portal
ExecStart=/usr/bin/npm start:rd
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
	echo "${DONE}"
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

openbox-session & chromium-browser --noerrdialogs --kiosk http://localhost:$HTTP_PORT?mode=local --incognito --disable-translate --disable-pinch --overscroll-history-navigation=0 --check-for-update-interval=1 --simulate-critical-update

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
@chromium-browser --noerrdialogs --kiosk http://localhost:$HTTP_PORT?mode=local --incognito --disable-translate --disable-pinch --disable-session-crashed-bubble --overscroll-history-navigation=0 --check-for-update-interval=1 --simulate-critical-update

EOF
}

installZRAM() {
	echo ""
    echo "${CYAN}Installing ZRAM...${NORMAL}"
	if [ -f /root/zram.sh ];
	then
		echo "${SKIP}"
	else
	    cat <<EOF | sudo tee /root/zram.sh >/dev/null
#!/bin/bash

# Raspberry Pi ZRAM script
# Tuned for quad core, 1 GB RAM models

modprobe zram
echo 3 >/sys/devices/virtual/block/zram0/max_comp_streams
echo lz4 >/sys/devices/virtual/block/zram0/comp_algorithm
echo 268435456 >/sys/devices/virtual/block/zram0/mem_limit
echo 536870912 >/sys/devices/virtual/block/zram0/disksize
mkswap /dev/zram0
swapon -p 0 /dev/zram0
sysctl vm.swappiness=30
EOF
		sudo chmod +x /root/zram.sh

		# Install ZRAM script in crontab
		if [ `sudo crontab -l | grep zram.sh | wc -l` -eq 0 ];
		then
			#echo "0 2 * * * /sbin/shutdown -r now" | sudo crontab
			(sudo crontab -l 2>/dev/null; echo "@reboot /root/zram.sh")| sudo crontab -
		fi
		echo "${DONE}"
	fi
}

initRaspbian() {
    # Change hostname
	if [ -n "${SET_HOSTNAME:-}" ];
	then
		#local IP=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n 1`
		#local NEWHOST=homeportal-`echo $IP | awk -F"." '{ printf $3$4 }'`
		echo ""
		echo "${CYAN}Change device hostname to '${SET_HOSTNAME}'...${NORMAL}"
		sudo hostnamectl set-hostname ${SET_HOSTNAME}
		echo "${DONE}"
	fi

	# Disable WiFi power saving mode
	if [ `ip a |grep wlan0 | wc -l` -gt 0 ];
	then
		echo ""
		echo "${CYAN}Disable power-save mode for wlan0...${NORMAL}"
		if [ `sudo crontab -l|grep power_save |wc -l` -eq 0 ];
		then
			(sudo crontab -l 2>/dev/null; echo "@reboot /sbin/iw wlan0 set power_save off")| sudo crontab -
		    # echo "@reboot /sbin/iw wlan0 set power_save off" | sudo crontab
			echo "${DONE}"
		else
			echo "${SKIP}"
		fi
	fi

	echo ""
	echo "${CYAN}Disable Raspbian warning messages...${NORMAL}"

    # Disable lecture message
    sudo touch /var/lib/sudo/lectured/pi

    # Disable SSH password warning
    #   Credits: https://raspberrypisig.com/blog/raspbian/2019/02/26/disable-ssh-warning/
    sudo rm -rf /etc/profile.d/sshpwd.sh
    sudo rm -rf /etc/xdg/lxsession/LXDE-pi/sshpwd.sh
    sudo rm -rf /etc/xdg/autostart/pprompt.desktop

    # Disable welcome wizard
    sudo rm -rf /etc/xdg/autostart/piwiz.desktop

	echo "${DONE}"

    # Install ZRam
	if [ -z "${NO_ZRAM:-}" ];
	then
		installZRAM
	fi

    # Add Auto nightly restart
	echo ""
	echo "${CYAN}Add nightly restart...${NORMAL}"
	if [ `sudo crontab -l|grep shutdown |wc -l` -eq 0 ];
	then
	    #echo "0 2 * * * /sbin/shutdown -r now" | sudo crontab
		(sudo crontab -l 2>/dev/null; echo "0 2 * * * /sbin/shutdown -r now")| sudo crontab -
		echo "${DONE}"
	else
		echo "${SKIP}"
	fi


    # Autostart Chromium
	echo ""
	echo "${CYAN}Add Chromium to autostart...${NORMAL}"
    autoStartWithDesktop
	echo "${DONE}"
}

createVersionFile() {
	echo ""
    echo "${CYAN}Create VERSION file...${NORMAL}"
    echo "$HP_VERSION" > $TARGET_DIR/VERSION
}

setupTerminalBanner() {
	echo ""
    echo "${CYAN}Create banner script...${NORMAL}"
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

	echo ""
    echo "${CYAN}Add banner script to .profile...${NORMAL}"
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
	echo ""
	echo -e "${GREEN}${BOLD}Home Portal ${HP_VERSION} installed successfully.${NORMAL}"
	if [ "${NO_RESTART}" != true ];
	then
	    echo -e "${GREEN}${BOLD}Restarting device after 5 seconds...${NORMAL}"
		sleep 5
		sudo reboot
	fi
}

startBanner
getSystemInfo
if [ "${UPDATE_ONLY}" != true ];
then
	installDependencies
	initRaspbian
fi
downloadRelease
installApp
if [ "${UPDATE_ONLY}" != true ];
then
	registerApp
	setupTerminalBanner
fi
cleanup
createVersionFile
finishBanner

