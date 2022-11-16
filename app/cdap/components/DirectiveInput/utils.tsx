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
import { IDirectivesList } from './types';

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

export const handlePasteDirective = (directiveInput: string, directivesList: IDirectivesList[]) => {
  const inputSplit = directiveInput.replace(/^\s+/g, '').split(' ');
  const filterUsageItem =
    directivesList.length > 0 && directivesList.filter((el) => el.usage.includes(inputSplit[0]));
  const directiveUsageSplit =
    Array.isArray(filterUsageItem) && filterUsageItem.length > 0
      ? filterUsageItem[0].usage.split(' ')
      : [];
  return (
    directiveUsageSplit.length === inputSplit.length ||
    inputSplit.length > directiveUsageSplit.length
  );
};
