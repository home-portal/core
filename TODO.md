
## Common

- [x] TailwindCSS
- [x] add category to module.yaml
- [x] Idle time handling
- [ ] No animation mode
- [x] Persistent page type (don't come back to home or show screen saver)
- [ ] global font-size settings (to cover small screens to TV)
- [x] offline font
- [ ] Github Action to generate package and [publish to releases](https://github.com/tcnksm/ghr)

## Script
- [x] specifying VERSION env var in install.sh to install older versions, as well
- [x] move VERSION file to the repo
- [x] `update` mode: update only home-portal.
- [ ] `chromium-browser --check-for-update-interval=31536000 --disable-features=TranslateUI --app-auto-launched --disable-pinch --incognito --noerrdialogs --disable-suggestions-service --disable-translate --disable-save-password-bubble --disable-session-crashed-bubble --disable-infobars --touch-events=disabled --disable-gesture-typing --kiosk`
- [ ] Check installed & running service, kill it before install/update `systemctl list-units |grep "home-portal" | wc -l` & running `systemctl list-units |grep "home-portal" |grep running | wc -l`
- [ ] 

## Modules
- [ ] **Home**
  - [x] Sleep mode
  - [x] Launch icons
  - [ ] All pages page

- [x] **Weather**

- [ ] **Clock**
  - [x] Clock widget
  - [ ] Alarm clock
    - [ ] https://dribbble.com/shots/11164774-Clock-Apps-Design-Exploration/attachments/2768578?mode=media
    - [ ] https://dribbble.com/shots/7562265-Alarm-clock-dark-light-mode
    - [ ] https://dribbble.com/shots/14149622-Alarm-Clock-Minimal-App
  - [x] Clock page as screen saver

- [ ] **Traffic Map**
  - [x] Google Maps with traffic
  - [ ] HERE maps
    - [ ] https://developer.here.com/
  - [ ] Waze
    - [ ] https://www.waze.com/hu/livemap

- [ ] **Calendar**
  - [x] iCal parser calendar
  - [x] Google Calendar (https://developers.google.com/google-apps/calendar/)

- [ ] **Tasks**
  - [ ] Separated modules
    - [ ] db backend service which stores any json to any collection (universal)
    - [ ] frontend call it
  - [ ] local db list
  - [ ] Todoist
    - [ ] https://developer.todoist.com/
  - [ ] Wunderlist
    - [ ] https://developer.wunderlist.com/documentation

- [ ] **Unsplash photo downloader**
  - [ ] https://github.com/unsplash/unsplash-js
  - [ ] Show authors in the corner
  - [ ] set category of images
  - [ ] maintain the number of photos, clean older ones

- [ ] **Pexels photo downloader**
  - [ ] https://www.pexels.com/api/
  - [ ] Show authors in the corner
  - [ ] maintain the number of photos, clean older ones

- [ ] **Pixabay photo downloader**
  - [ ] https://pixabay.com/sk/service/about/api/

- [x] **Slideshow module**
  - [x] Settings
    - [x] showClock
    - [x] positionOfClock
    - [x] clockFormat
    - [x] transition: fade
    - [x] delay (secs)
    - [x] shuffle
    - [x] show current weather temp & image in corner
    - [x] brightness (black overlay in front of background image)
    - [x] show weather info (current temp & icon)
    - [x] show upcoming events

- [ ] **Music player**
  - [ ] Spotify
    - [ ] https://developer.spotify.com/documentation/web-api/
  - [ ] Deezer
    - [ ] https://developers.deezer.com/login?redirect=/api
  - [ ] Soundcloud

- [ ] **News (RSS feed)**
  - [ ] separated services
    - [x] backend is an universal rss feed service
    - [ ] frontend call it when need to show rss

- [ ] **Notifier module**

- [ ] **Sentinel** (camera pictures)
  - [ ] image or video with full screen mode
  - [ ] 

- [x] **Custom iframe module**

- [ ] **Exchange rates**
  - [ ] https://github.com/public-apis/public-apis#currency-exchange

- [ ] Voice control
  - [ ] https://cloud.ibm.com/docs/text-to-speech/getting-started.html
  - [ ] https://github.com/Uberi/speech_recognition

## Extras
- [ ] Detect default language from IP
  - [ ] https://ipgeolocationapi.com/
- [ ] Change pages with slider
  - [ ] http://kenwheeler.github.io/slick/

## Domain
- home-portal.land
- home-portal.app
- home-portal.space
