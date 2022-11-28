/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

export const mockData = {
  message: 'Success',
  count: 84,
  values: [
    {
      directive: 'encode',
      usage: "encode 'method' :column",
      description: 'Encodes column values using one of base32, base64, or hex.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'encode',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'method',
            type: 'TEXT',
          },
          {
            ordinal: 1,
            optional: false,
            name: 'column',
            type: 'COLUMN_NAME',
          },
        ],
      },
      categories: ['transform'],
    },
    {
      directive: 'uppercase',
      usage: 'uppercase :column',
      description: 'Changes the column values to uppercase.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'uppercase',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'column',
            type: 'COLUMN_NAME',
          },
        ],
      },
      categories: ['transform'],
    },
    {
      directive: 'send-to-error',
      usage: "send-to-error exp:{<condition>}  [metric] ['message']",
      description: 'Send records that match condition to the error collector.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'send-to-error',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'condition',
            type: 'EXPRESSION',
          },
          {
            ordinal: 1,
            optional: true,
            name: 'metric',
            type: 'IDENTIFIER',
          },
          {
            ordinal: 2,
            optional: true,
            name: 'message',
            type: 'TEXT',
          },
        ],
      },
      categories: ['row', 'data-quality'],
    },
    {
      directive: 'parse-xml-to-json',
      usage: 'parse-xml-to-json :column  [depth]',
      description: 'Parses a XML document to JSON representation.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'parse-xml-to-json',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'column',
            type: 'COLUMN_NAME',
          },
          {
            ordinal: 1,
            optional: true,
            name: 'depth',
            type: 'NUMERIC',
          },
        ],
      },
      categories: ['xml'],
    },
    {
      directive: 'split-to-rows',
      usage: "split-to-rows :column 'regex'",
      description: 'Splits a column into multiple rows, copies the rest of the columns.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'split-to-rows',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'column',
            type: 'COLUMN_NAME',
          },
          {
            ordinal: 1,
            optional: false,
            name: 'regex',
            type: 'TEXT',
          },
        ],
      },
      categories: ['row'],
    },
    {
      directive: 'fill-null-or-empty',
      usage: "fill-null-or-empty :column 'value'",
      description: 'Fills a value of a column with a fixed value if it is either null or empty.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'fill-null-or-empty',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'column',
            type: 'COLUMN_NAME',
          },
          {
            ordinal: 1,
            optional: false,
            name: 'value',
            type: 'TEXT',
          },
        ],
      },
      categories: ['transform'],
    },
    {
      directive: 'decode',
      usage: "decode 'method' :column",
      description: 'Decodes column values using one of base32, base64, or hex.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'decode',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'method',
            type: 'TEXT',
          },
          {
            ordinal: 1,
            optional: false,
            name: 'column',
            type: 'COLUMN_NAME',
          },
        ],
      },
      categories: ['transform'],
    },
    {
      directive: 'flatten',
      usage: 'flatten :column [,:column  ]*',
      description:
        'Separates array elements of one or more columns into individual records, copying the other columns.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'flatten',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'column',
            type: 'COLUMN_NAME_LIST',
          },
        ],
      },
      categories: ['row'],
    },
    {
      directive: 'parse-as-log',
      usage: "parse-as-log :column 'format'",
      description: 'Parses Apache HTTPD and NGINX logs.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'parse-as-log',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'column',
            type: 'COLUMN_NAME',
          },
          {
            ordinal: 1,
            optional: false,
            name: 'format',
            type: 'TEXT',
          },
        ],
      },
      categories: ['parser', 'logs'],
    },
    {
      directive: 'split',
      usage: "split :source 'delimiter' :column1 :column2",
      description: "Use 'split-to-columns' or 'split-to-rows'.",
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'split',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'source',
            type: 'COLUMN_NAME',
          },
          {
            ordinal: 1,
            optional: false,
            name: 'delimiter',
            type: 'TEXT',
          },
          {
            ordinal: 2,
            optional: false,
            name: 'column1',
            type: 'COLUMN_NAME',
          },
          {
            ordinal: 3,
            optional: false,
            name: 'column2',
            type: 'COLUMN_NAME',
          },
        ],
      },
      categories: ['readable'],
    },
    {
      directive: 'trim',
      usage: 'trim :column',
      description: 'Trimming whitespace from both sides of a string.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'trim',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'column',
            type: 'COLUMN_NAME',
          },
        ],
      },
      categories: ['transform'],
    },
    {
      directive: 'merge',
      usage: "merge :column1 :column2 :destination 'separator'",
      description: 'Merges values from two columns using a separator into a new column.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'merge',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'column1',
            type: 'COLUMN_NAME',
          },
          {
            ordinal: 1,
            optional: false,
            name: 'column2',
            type: 'COLUMN_NAME',
          },
          {
            ordinal: 2,
            optional: false,
            name: 'destination',
            type: 'COLUMN_NAME',
          },
          {
            ordinal: 3,
            optional: false,
            name: 'separator',
            type: 'TEXT',
          },
        ],
      },
      categories: ['column'],
    },
    {
      directive: 'titlecase',
      usage: 'titlecase :column',
      description: 'Changes the column values to title case.',
      excluded: false,
      alias: false,
      scope: 'SYSTEM',
      arguments: {
        directive: 'titlecase',
        tokens: [
          {
            ordinal: 0,
            optional: false,
            name: 'column',
            type: 'COLUMN_NAME',
          },
        ],
      },
      categories: ['transform'],
    },
  ],
};
