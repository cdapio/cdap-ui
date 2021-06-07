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

export const TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  DATE_ISO_LOCAL: 'date_iso_local',
  TIMESTAMP_MILLIS: 'timestamp_millis',
  FILE_SIZE: 'file_size',
};

// TODO format options here need TS 4.1+

const numberFormatter = Intl.NumberFormat();
const conciseNumberFormatter = Intl.NumberFormat(undefined, {
  // @ts-ignore
  notation: 'compact',
});

const dateFormatter = Intl.DateTimeFormat(undefined, {
  // @ts-ignore
  dateStyle: 'long',
});
const conciseDateFormatter = Intl.DateTimeFormat(undefined, {
  // @ts-ignore
  dateTyle: 'short',
});

const dateTimeFormatter = Intl.DateTimeFormat(undefined, {
  // @ts-ignore
  dateStyle: 'long',
  timeStyle: 'medium',
});
const conciseDateTimeFormatter = Intl.DateTimeFormat(undefined, {
  // @ts-ignore
  dateStyle: 'short',
  timeStyle: 'medium',
});

const byteFormatter = Intl.NumberFormat(undefined, {
  style: 'unit',
  // @ts-ignore
  unit: 'byte',
});

const byteSizeUnits = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'];
const conciseByteSizeFormatters = byteSizeUnits.map((unit) =>
  Intl.NumberFormat(undefined, {
    // @ts-ignore
    notation: 'compact',
    style: 'unit',
    unit,
  })
);

function formatConciseByteSize(value) {
  const exponent = Math.min(Math.floor(Math.log(value) / Math.log(1024)), 5);
  const decimal = value / Math.pow(1024, exponent);
  return conciseByteSizeFormatters[exponent].format(decimal);
}

export function format(value, type, options) {
  switch (type) {
    case TYPES.STRING:
      return value;
    case TYPES.NUMBER:
      if (options.concise) {
        return conciseNumberFormatter.format(value);
      }
      return numberFormatter.format(value);
    case TYPES.TIMESTAMP_MILLIS:
      const timestampDate = new Date(value);
      if (options.concise) {
        return conciseDateTimeFormatter.format(timestampDate);
      }
      return dateTimeFormatter.format(timestampDate);
    case TYPES.DATE_ISO_LOCAL:
      const localDate = moment(value).toDate();
      if (options.concise) {
        return conciseDateFormatter.format(localDate);
      }
      return dateFormatter.format(localDate);
    case TYPES.FILE_SIZE:
      if (options.concise) {
        return formatConciseByteSize(value);
      }
      return byteFormatter.format(value);
    default:
      return value.toString ? value.toString() : JSON.stringify(value);
  }
}
