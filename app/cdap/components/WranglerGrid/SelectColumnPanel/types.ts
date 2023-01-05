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

import { IGeneralStatistics, IParams } from 'components/GridTable/types';

export interface IRecords {
  wid?: string;
  payload?: IParams;
  body?: string;
  path?: string;
  canBrowse?: boolean;
  name?: string;
}

export interface IHeaderNamesList {
  name: string;
  label: string;
  type: string[];
}

export interface IAddTransformationProps {
  transformationDataType: string[];
  transformationName: string;
  columnsList: IHeaderNamesList[];
  missingItemsList: Record<string, IGeneralStatistics>;
  onCancel: () => void;
}

export interface IMultipleSelectedFunctionDetail {
  value:
    | 'join-columns'
    | 'swap-columns'
    | 'delete'
    | 'array-flattening'
    | 'record-flattening'
    | 'keep';
  isMoreThanTwo: boolean;
}
