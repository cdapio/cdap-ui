/*
 * Copyright © 2017-2020 Cask Data, Inc.
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

/*
  TODO: This is just a stub(mock) for jest to not invoke the actual socket connection.
  This needs to be exported as a singleton class. Will do when we actually need to mock a function.
*/

jest.unmock('rxjs/Subject');
jest.unmock('rxjs/add/operator/map');
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

const MyProgramApi = {
  runRecords: [],
  status: {},
  __isError: false,
};

const LOGS_RESPONSE = [
  {
    offset: '1',
    log: {
      timestamp: 1,
      logLevel: 'INFO',
      threadName: 'some-thread',
      className: 'some-class',
      simpleClassName: 'simple-class',
      lineNumber: 1,
      message: 'message 1',
      stackTrace: 'trace 1',
      loggerName: 'some-logger',
    },
  },
  {
    offset: '2',
    log: {
      timestamp: 2,
      logLevel: 'ERROR',
      threadName: 'some-thread',
      className: 'some-class',
      simpleClassName: 'simple-class',
      lineNumber: 2,
      message: 'message 2',
      stackTrace: 'trace 2',
      loggerName: 'some-logger',
    },
  },
];

function getLogs() {
  const subject = new Subject();
  setTimeout(() => {
    subject.next(LOGS_RESPONSE);
    subject.complete();
  });
  return subject;
}

MyProgramApi.setRunRecords = function(records, isError) {
  this.runRecords = records;
  this.__isError = isError;
};
MyProgramApi.setProgramStatus = function(status, isError) {
  this.status = status;
  this.__isError = isError;
};
MyProgramApi.generalGetter = function(property) {
  return function() {
    let subject = new Subject();
    setTimeout(() => {
      if (this.__isError) {
        subject.error(this[property]);
        return;
      }
      subject.next(this[property]);
    });
    return subject;
  }.bind(this);
};
MyProgramApi.pollRuns = MyProgramApi.generalGetter('runRecords');
MyProgramApi.runs = MyProgramApi.generalGetter('runRecords');
MyProgramApi.pollStatus = MyProgramApi.generalGetter('status');

// Logs
MyProgramApi.nextLogs = getLogs;
MyProgramApi.prevLogs = getLogs;

module.exports = { MyProgramApi };
