/*
 * Copyright © 2020 Cask Data, Inc.
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

import { format, TYPES } from '../index';

describe('DataFormatter', () => {
  describe('string type', () => {
    it('should format a string', () => {
      expect(format('Hello world', TYPES.STRING)).toBe('Hello world');
    });

    it('should format a string in concise mode', () => {
      expect(format('Hello world', TYPES.STRING, { concise: true })).toBe('Hello world');
    });
  });

  describe('number type', () => {
    it('should format a number', () => {
      expect(format(8128437, TYPES.NUMBER)).toBe('8,128,437');
    });

    it('should format a number in concise mode', () => {
      expect(format(8128437, TYPES.NUMBER, { concise: true })).toBe('8.1M');
    });
  });

  // TODO The following tests will only work on machines in the Pacific timezone
  describe.skip('timestamp_millis type', () => {
    it('should format a timestamp', () => {
      expect(format(1623104962602, TYPES.TIMESTAMP_MILLIS)).toBe('June 7, 2021 at 3:29:22 PM');
    });

    it('should format a timestamp in concise mode', () => {
      expect(format(1623104962602, TYPES.TIMESTAMP_MILLIS, { concise: true })).toBe('6/7/21, 3:29:22 PM');
    });
  });

  describe('date_local_iso type', () => {
    it('should format a date', () => {
      expect(format('2021-06-07', TYPES.DATE_ISO_LOCAL)).toBe('June 7, 2021');
    });

    it('should format a date in concise mode', () => {
      expect(format('2021-06-07', TYPES.DATE_ISO_LOCAL, { concise: true })).toBe('6/7/2021');
    });
  });

  describe('file_size type', () => {
    it('should format a file size', () => {
      expect(format(8128437, TYPES.FILE_SIZE)).toBe('8,128,437 byte');
    });

    it('should format a number in concise mode', () => {
      expect(format(8128437, TYPES.FILE_SIZE, { concise: true })).toBe('7.8 MB');
    });
  });

  describe('unknown type', () => {
    it('should use toString if available', () => {
      const obj = { a: 'foo', toString: () => 'output of toString' };
      expect(format(obj, 'UNKNOWN')).toBe('output of toString');
    });
  });
});