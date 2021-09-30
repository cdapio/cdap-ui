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

import { format, TYPES, dateTimeFormat } from '../index';

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
      expect(format(8128437, TYPES.NUMBER, { concise: true })).toBe('8M');
    });
  });

  // TODO The following tests will only work on machines in the Pacific timezone
  describe.skip('timestamp_millis type', () => {
    it('should format a timestamp', () => {
      expect(format(1623104962602, TYPES.TIMESTAMP_MILLIS)).toBe('06-07-2021 3:29:22 PM');
    });

    it('should format a timestamp in concise mode', () => {
      expect(format(1623104962602, TYPES.TIMESTAMP_MILLIS, { concise: true })).toBe(
        '06-07-2021 3:29:22 PM'
      );
    });
  });

  describe('date_local_iso type', () => {
    it('should format a date', () => {
      expect(format('2021-06-07', TYPES.DATE_LOCAL_ISO)).toBe('06-07-2021');
    });

    it('should format a date in concise mode', () => {
      expect(format('2021-06-07', TYPES.DATE_LOCAL_ISO, { concise: true })).toBe('06-07-2021');
    });
  });

  describe('size_bytes type', () => {
    it('should format a file size', () => {
      expect(format('8128437', TYPES.SIZE_BYTES)).toBe('8.13MB');
    });

    it('should format a number in concise mode', () => {
      expect(format('8128437', TYPES.SIZE_BYTES, { concise: true })).toBe('8.13MB');
    });

    it('should format 0 in concise mode', () => {
      expect(format('0', TYPES.SIZE_BYTES, { concise: true })).toBe(0);
    });
  });

  describe('unknown type', () => {
    it('should use toString if available', () => {
      const obj = { a: 'foo', toString: () => 'output of toString' };
      expect(format(obj, 'UNKNOWN')).toBe('output of toString');
    });
  });

  describe('dateTimeFormat', () => {
    it('should handle invalid date', () => {
      expect(dateTimeFormat('2021-30-13')).toBe('Invalid date');
    });

    it('should format a date for given date string', () => {
      expect(dateTimeFormat('2021-09-16')).toBe('Sep 16, 2021');
    });

    it('should format a date for given milliseconds', () => {
      expect(dateTimeFormat(1631803807712)).toBe('Sep 16, 2021');
    });

    it('should format a date for given date object', () => {
      expect(dateTimeFormat(new Date(2021, 8, 16))).toBe('Sep 16, 2021');
    });

    it('should format based on given format options', () => {
      expect(
        dateTimeFormat(new Date(2021, 8, 16, 10, 33, 30), {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        })
      ).toBe('Thursday, September 16, 2021, 10:33:30 AM');
    });
  });
});
