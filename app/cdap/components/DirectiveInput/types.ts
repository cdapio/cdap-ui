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

import { IHeaderNamesList } from 'components/GridTable/types';

export interface IDirectiveInputProps {
  columnNamesList: IHeaderNamesList[];
  onDirectiveInputHandler: (value: string) => void;
  onClose: () => void;
  openDirectivePanel: boolean;
}

export interface IDirectiveUsage {
  item: IDirectiveUsageItem;
  matches: IDirectiveUsageMatches;
  score: number;
  uniqueId: string;
  usage?: string;
}

export interface IDirectiveUsageMatches {
  arrayIndex: number;
  indices: number[][];
  key: string;
  value: string;
}

export interface IDirectiveUsageItem {
  alias: boolean;
  arguments: IDirectiveUsageItemArguments;
  categories: string[];
  description: string;
  directive: string;
  excluded: boolean;
  scope: string;
  usage: string;
  label?: string;
}

export interface IDirectiveUsageItemArguments {
  directive: string;
  tokens: IUsageDirectivesArgumentsTokens[];
}

export interface IUsageDirectivesArgumentsTokens {
  name: string;
  optional: boolean;
  ordinal: number;
  type: string;
}

export interface IDirectivesList {
  alias: boolean;
  arguments: IDirectiveUsageItemArguments;
  categories: string[];
  description: string;
  directive: string;
  excluded: boolean;
  scope: string;
  usage: string;
}
