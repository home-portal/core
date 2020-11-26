#!/bin/bash

RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
WHITE=$(tput setaf 7)
NORMAL=$(tput sgr0)
BOLD=$(tput bold)

VERSION_FILE=~/VERSION
if [ -f ${VERSION_FILE} ]; then
	APP_VERSION=`cat $VERSION_FILE`
else
	APP_VERSION="NOT FOUND!"
fi

printf "\n"
printf "Welcome to Home Portal Device (on %s)!\n" "$(uname -a)"
printf "Version: ${GREEN}${BOLD}${APP_VERSION}${NORMAL}"
printf "\n\n\n"

date=`date`
load=`cat /proc/loadavg | awk '{print $1}'`
root_usage=`df -h / | awk '/\// {print $(NF-1)}'`
memory_usage=`free -m | awk '/Mem:/ { printf("%3.1f%%", $3/$2*100)}'`
total_memory=`free -h | awk '/Mem\:/ { print $2 }'`
time=`uptime | grep -ohe 'up .*' | sed 's/,/\ hours/g' | awk '{ printf $2" "$3 }'`
processes=`ps aux | wc -l`
ip=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'`
temp=`/opt/vc/bin/vcgencmd measure_temp | cut -d= -f2 | awk '{print $1}'`
backend=`if [[ $(ps aux | grep home-portal | grep node | wc -l) > 0 ]] ; then echo "${GREEN}${BOLD}Running${NORMAL}"; else echo "${GREEN}${BOLD}Not running${NORMAL}"; fi`

echo "System information:"
echo "----------------------------------"
printf "IP Address:\t${YELLOW}${BOLD}%s ${NORMAL}\n" $ip
printf "System load:\t%s\n" $load
printf "CPU temp:\t%s\n" $temp
printf "Memory usage:\t%s of %s\n" $memory_usage $total_memory
printf "Processes:\t%s\n" $processes
printf "Disk usage:\t%s\n" $root_usage
printf "Uptime:\t\t%s\n" "$time"
printf "Backend:\t%s\n" "$backend"
echo "----------------------------------"
echo
