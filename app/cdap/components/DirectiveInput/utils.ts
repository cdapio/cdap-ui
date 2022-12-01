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

import Fuse from 'fuse.js';
import uuidV4 from 'uuid/v4';
import { IDirectivesList } from 'components/DirectiveInput/types';

/**
 * @param  {string} directiveInput
 * @param  {IDirectivesList[]} directivesList
 * @returns {array}
 * most appropriate match is returned from directives list so it can be used to show how the directive is used
 */
export const formatDirectiveUsageData = (
  directiveInput: string,
  directivesList: IDirectivesList[]
) => {
  const inputSplit: string[] = directiveInput.replace(/^\s+/g, '').split(' ');
  const fuseOptions = {
    includeScore: true,
    includeMatches: true,
    caseSensitive: false,
    threshold: 0,
    location: 0,
    shouldSort: true,
    distance: 100,
    minMatchCharLength: 1,
    maxPatternLength: 32,
    keys: ['directive'],
  };
  const fuse = new Fuse(directivesList, fuseOptions);
  return fuse.search(inputSplit[0]).map((row) => {
    row.uniqueId = uuidV4();
    return row;
  });
};

/**
 * @param  {string} searchString
 * @returns {string}
 * after the directive selection, the input typed is used to show dropdown of column list
 */
export const getLastWordOfSearchItem = (searchString: string) => {
  const lastWord = searchString.split(' ');
  if (lastWord[lastWord.length - 1].includes(',')) {
    const newSplit = lastWord[lastWord.length - 1].split(',:'); // Special case when syntax is drop :col [,:col]* after every : we write column name so to make column drop down appear again
    return newSplit[newSplit.length - 1];
  } else {
    const characterToSearch = lastWord[lastWord.length - 1].includes(':')
      ? lastWord[lastWord.length - 1].slice(1)
      : lastWord[lastWord.length - 1].slice(0);
    return characterToSearch;
  }
};

/**
 * @param  {string} inputText
 * @param  {string} newString
 * @returns {string}
 * On enter or on clicking list item, need to catch value and do amendments in input tag value according to directive syntax
 */
export const getFormattedSyntax = (inputText: string, newString: string) => {
  const lastWord = inputText.split(' ');
  if (lastWord[lastWord.length - 1].includes(',')) {
    // Special case when syntax is drop :col [,:col]* after every : we write column name so to make column drop down appear again
    const newSplit = lastWord[lastWord.length - 1].split(',');
    const newSplitInput = newSplit.slice(0, newSplit.length - 1).concat(`:${newString}`);
    const formattedInput = inputText
      .slice(0, inputText.length - lastWord.slice(-1)[0].length)
      .concat(`${newSplitInput}`);
    return formattedInput;
  } else if (lastWord[lastWord.length - 1].includes(':')) {
    // When syntax is uppercase :col after every : we write column name so to make column drop down appear
    const formattedInput = inputText
      .slice(0, inputText.length - lastWord.slice(-1)[0].length)
      .concat(`:${newString}`);
    return formattedInput;
  } else {
    // When column name begins just after a directive name space
    const formattedInput = inputText
      .slice(0, inputText.length - lastWord.slice(-1)[0].length)
      .concat(`${newString}`);
    return formattedInput;
  }
};
