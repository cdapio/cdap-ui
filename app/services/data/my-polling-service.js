/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

angular.module(PKG.name + '.services')
  .factory('MyPollingService', function($rootScope, uuid, $window) {
    function MyPollingService(scope) {
      scope = scope || $rootScope.$new();

      if (!(this instanceof MyPollingService)) {
        return new MyPollingService(scope);
      }

      this.bindings = {};
    }

    MyPollingService.prototype.poll = function(pollFn, interval, cb, errorCb) {
      const self = this;
      const resource = {
        pollFn,
        id: $window.uuid.v4(),
        interval,
        timeoutId: null
      };

      function performPoll() {
        self.bindings[resource.id].timeoutId = null;
        pollFn().$promise.then((response) => {
          cb(response, resource.id);

          if (self.bindings[resource.id]) {
            const timeoutId = setTimeout(performPoll, self.bindings[resource.id].interval);
            self.bindings[resource.id].timeoutId = timeoutId;
          }
        }, (error) => {
          errorCb(error, resource.id);

          self.stopPoll(resource.id);
        });
      }

      this.bindings[resource.id] = resource;

      performPoll();
    };

    MyPollingService.prototype.stopPoll = function(resourceId) {
      if (this.bindings[resourceId]) {
        clearTimeout(this.bindings[resourceId].timeoutId);
        delete this.bindings[resourceId];
      }
    };

    return MyPollingService;
  });
