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
export const DATATYPE_OPTIONS = [
  'string',
  'boolean',
  'integer',
  'long',
  'short',
  'float',
  'double',
  'decimal',
  'bytes',
];

export const MENU_OPTIONS = [
  {
    key: 'changeDatatype',
    label: 'Change data type',
    options: DATATYPE_OPTIONS.map((option) => ({ key: option, label: option })),
  },
  {
    key: 'setQualifiler',
    label: 'Set qualifier',
  },
  {
    key: 'divider',
  },
  {
    key: 'text',
    label: 'Text',
    options: [
      { key: 'heading', label: 'Remove' },
      { key: 'letters', label: 'Letters' },
      { key: 'numbers', label: 'Numbers' },
      { key: 'specialCharacters', label: 'Special Characters' },
      { key: 'numbers', label: 'Leading white spaces' },
      { key: 'numbers', label: 'Trailing White spaces' },
      { key: 'divider' },
      { key: 'heading', label: 'Format' },
      { key: 'numbers', label: 'UPPERCASE' },
      { key: 'numbers', label: 'Lowercase' },
      { key: 'numbers', label: 'Title Case' },
    ],
  },
  {
    key: 'dateAndTime',
    label: 'Date and Time',
  },
  {
    key: 'findAndReplace',
    label: 'Find and Replace',
  },
  {
    key: 'filter',
    label: 'Filter',
  },
  {
    key: 'delete',
    label: 'Delete column',
  },
  {
    key: 'keep',
    label: 'Keep column',
  },
];
