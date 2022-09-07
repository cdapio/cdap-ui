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
  {
    value: 'string',
    label: 'string',
  },
  {
    value: 'boolean',
    label: 'boolean',
  },
  {
    value: 'integer',
    label: 'integer',
  },
  {
    value: 'long',
    label: 'long',
  },
  {
    value: 'short',
    label: 'short',
  },
  {
    value: 'float',
    label: 'float',
  },
  {
    value: 'double',
    label: 'double',
  },
  {
    value: 'decimal',
    label: 'decimal',
  },
  {
    value: 'bytes',
    label: 'bytes',
  },
];

export const MENU_OPTIONS = [
  {
    value: 'changeDatatype',
    label: 'Change data type',
    options: DATATYPE_OPTIONS,
  },
  {
    value: 'setQualifiler',
    label: 'Set qualifier',
  },
  {
    value: 'divider',
  },
  {
    value: 'text',
    label: 'Text',
    options: [
      { value: 'heading', label: 'Remove' },
      { value: 'letters', label: 'Letters' },
      { value: 'numbers', label: 'Numbers' },
      { value: 'specialCharacters', label: 'Special Characters' },
      { value: 'numbers', label: 'Leading white spaces' },
      { value: 'numbers', label: 'Trailing White spaces' },
      { value: 'divider' },
      { value: 'heading', label: 'Format' },
      { value: 'numbers', label: 'UPPERCASE' },
      { value: 'numbers', label: 'Lowercase' },
      { value: 'numbers', label: 'Title Case' },
    ],
  },
  {
    value: 'dateAndTime',
    label: 'Date and Time',
  },
  {
    value: 'findAndReplace',
    label: 'Find and Replace',
  },
  {
    value: 'filter',
    label: 'Filter',
  },
  {
    value: 'delete',
    label: 'Delete column',
  },
  {
    value: 'keep',
    label: 'Keep column',
  },
];
