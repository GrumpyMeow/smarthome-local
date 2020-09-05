/**
 * Copyright 2019, Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const axios = require('axios');
const logger = require('./logger');

/**
 * Representation of a Plex device.
 */
class Plex {
  /**
   * Create a new plex instance
   * @param {string} projectId Endpoint to publish state updates
   */
  constructor(projectId) {
    this.reportStateEndpointUrl = `https://${projectId}.firebaseapp.com/updatestate`;
    this._state = {
      on: false,
      isMuted: false,
      currentVolume: 0,
      currentApplication: '',
      currentApplicationName: '',
      activityState: 'ACTIVE',
      playbackState: 'PLAYING',
    };
    this.reportState();
  }

  /**
   * Update device state
   * @param {*} params Updated state attributes
   */
  set state(params) {
    this._state = Object.assign(this._state, params);
    this.print();
    this.reportState();
  }

  /**
   * Print the current device state
   */
  print() {
    logger.info(this._state);
  }

  /**
   * Publish the current state to remote endpoint
   */
  reportState() {
    axios.post(this.reportStateEndpointUrl, this._state)
      .then((res) => {
        logger.info('Report State successful');
      })
      .catch((err) => {
        logger.error(`Report State error: ${err.message}`);
      });
  }
}

module.exports = Plex;
