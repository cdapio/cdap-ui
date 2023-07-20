/*
 * Copyright © 2016-2017 Cask Data, Inc.
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

import moment from 'moment';
class MyPipelineSummaryCtrl {
  constructor($scope, $interval, GLOBALS, $stateParams) {
    this.$stateParams = $stateParams;
    this.runs = [];
    this.programId = '';
    this.programType = '';
    this.appId = '';
    this.moment = moment;
    this.setState();
    this.store.registerOnChangeListener(this.setState.bind(this));
  }
  setState() {
    this.totalRunsCount = this.store.getRunsCount();
    this.runs = this.store.getRuns();
    var params = this.store.getParams();
    this.programType = params.programType.toUpperCase();
    this.programId = params.programName;
    this.appId = params.app;
    this.namespaceId = this.$stateParams.namespace;

    var averageRunTime = this.store.getStatistics().avgRunTime;
    // We get time as seconds from backend. So multiplying it by 1000 to give moment.js in milliseconds.
    if (averageRunTime) {
      this.avgRunTime = this.moment.utc( averageRunTime * 1000 ).format('HH:mm:ss');
    } else {
      this.avgRunTime = 'N/A';
    }

    var nextRunTime = this.store.getNextRunTime();
    if (nextRunTime && nextRunTime.length) {
      this.nextRunTime = nextRunTime[0].time? nextRunTime[0].time: null;
    } else {
      this.nextRunTime = 'N/A';
    }

  }
}
MyPipelineSummaryCtrl.$inject = ['$scope', '$interval', 'GLOBALS', '$stateParams'];

 angular.module(PKG.name + '.commons')
  .controller('MyPipelineSummaryCtrl', MyPipelineSummaryCtrl);
