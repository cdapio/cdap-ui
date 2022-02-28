/*
 * Copyright © 2021 Cask Data, Inc.
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
import { convertBytesToHumanReadable, humanReadableNumber, truncateNumber } from 'services/helpers';

export const TYPES = {
  STRING: 'STRING',
  NUMBER: 'NUMBER',
  DATE_LOCAL_ISO: 'DATE_LOCAL_ISO',
  TIMESTAMP_MILLIS: 'TIMESTAMP_MILLIS',
  SIZE_BYTES: 'SIZE_BYTES',
};

const EMPTY_DATE = '--';

interface IDateTimeFormatOptions {
  localeMatcher?: 'lookup' | 'best fit';
  weekday?: 'long' | 'short' | 'narrow';
  era?: 'long' | 'short' | 'narrow';
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  timeZoneName?: 'long' | 'short';
  formatMatcher?: 'basic' | 'best fit';
  hour12?: boolean;
  timeZone?: string;
}

/**
 * Method to format date & time.
 *
 * @param date - Input date object or date string or milliseconds.
 * @param options - Date time format options.
 * @returns Formatted date string.
 */
export function dateTimeFormat(
  date: string | number | Date,
  options: IDateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
) {
  if (!(date instanceof Date)) {
    if (typeof date === 'string') {
      date = date.replace(/-/g, '/');
    }
    date = new Date(date);
  }
  if (date.toString() !== 'Invalid Date') {
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else {
    return 'Invalid date';
  }
}

// TODO Replace moment.format with Intl.DateTimeFormat
function formatDate(momentInstance) {
  return momentInstance.format('MM-DD-YYYY');
}

function formatDateTime(momentInstance) {
  return momentInstance.format('MM-DD-YYYY hh:mm:ss A');
}

export function format(value, type, options: { concise?: boolean } = {}) {
  switch (type) {
    case TYPES.STRING:
      return value;
    case TYPES.NUMBER: {
      const numVal = parseInt(value, 10);
      if (options.concise) {
        return truncateNumber(numVal);
      }
      return humanReadableNumber(numVal);
    }
    case TYPES.TIMESTAMP_MILLIS: {
      if (!value) {
        return EMPTY_DATE;
      }
      const timestampMoment = moment(parseInt(value, 10));
      return formatDateTime(timestampMoment);
    }
    case TYPES.DATE_LOCAL_ISO: {
      if (!value) {
        return EMPTY_DATE;
      }
      const localMoment = moment(value);
      return formatDate(localMoment);
    }
    case TYPES.SIZE_BYTES: {
      const numVal = parseInt(value, 10);
      return convertBytesToHumanReadable(numVal);
    }
    default:
      return value.toString ? value.toString() : JSON.stringify(value);
  }
}

export function formatAsPercentage(str: string) {
  return `${str}%`;
}
