/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Initializes the SmartHome.
function SmartHome() {
  document.addEventListener('DOMContentLoaded', function () {
    // Shortcuts to DOM Elements.
    this.denyButton = document.getElementById('demo-deny-button');
    this.userWelcome = document.getElementById('user-welcome');

    // Bind events.
    this.updateButton = document.getElementById('demo-plex-update');
    this.updateButton.addEventListener('click', this.updateState.bind(this));
    this.plex = document.getElementById('demo-plex');
    this.requestSync = document.getElementById('request-sync');
    this.requestSync.addEventListener('click', async () => {
      try {
        const response = await fetch('/requestsync');
        console.log(response.status == 200 ?
          'Request SYNC success!' : `Request SYNC unexpected status: ${response.status}`);
      } catch (err) {
        console.error('Request SYNC error', err);
      }
    });

    this.initFirebase();
    this.initPlex();
  }.bind(this));
}

SmartHome.prototype.initFirebase = () => {
  // Initiates Firebase.
  console.log("Initialized Firebase");
};

SmartHome.prototype.initPlex = () => {
  console.log("Logged in as default user");
  this.uid = "123";
  this.smarthome.userWelcome.innerHTML = "Welcome user 123!";

  this.smarthome.handleData();
  this.smarthome.plex.style.display = "block";
}

SmartHome.prototype.setToken = (token) => {
  document.cookie = '__session=' + token + ';max-age=3600';
};

SmartHome.prototype.handleData = () => {
  const uid = this.uid;
  const elOnOff = document.getElementById('demo-plex-onOff');
  const elCurrentVolume = document.getElementById('demo-plex-currentVolume-in');
  const elIsMuted = document.getElementById('demo-plex-isMuted');
  const elActivityState = document.getElementById('demo-plex-activityState-in');
  const elPlaybackState = document.getElementById('demo-plex-playbackState-in');

  firebase.database().ref('/').child('plex').on("value", (snapshot) => {
    if (snapshot.exists()) {
      const plexState = snapshot.val();
      console.log(plexState)

      if (plexState.OnOff.on) elOnOff.MaterialSwitch.on();
      else elOnOff.MaterialSwitch.off();

      if (plexState.Volume.currentVolume) elCurrentVolume.value = plexState.Volume.currentVolume;
      else elCurrentVolume.value = 0;

      if (plexState.Volume.isMuted) elIsMuted.MaterialSwitch.on();
      else elIsMuted.MaterialSwitch.off();

      if (plexState.MediaState.activityState) elActivityState.value = plexState.MediaState.activityState;
      if (plexState.MediaState.playbackState) elPlaybackState.value = plexState.MediaState.playbackState;

    }
  })
}

SmartHome.prototype.updateState = () => {
  const elOnOff = document.getElementById('demo-plex-onOff');
  const elCurrentVolume = document.getElementById('demo-plex-currentVolume-in');
  const elIsMuted = document.getElementById('demo-plex-isMuted');
  const elActivityState = document.getElementById('demo-plex-activityState-in');
  const elPlaybackState = document.getElementById('demo-plex-playbackState-in');

  const pkg = {
    OnOff: { on: elOnOff.classList.contains('is-checked') },
    Volume: { 
        currentVolume: elCurrentVolume.value,
        isMuted: elIsMuted.classList.contains('is-checked')  
    },
    MediaState: {
      activityState: elActivityState.value,
      playbackState: elPlaybackState.value,
    }
  };


  console.log(pkg);
  firebase.database().ref('/').child('plex').set(pkg);
}

// Load the SmartHome.
window.smarthome = new SmartHome();
