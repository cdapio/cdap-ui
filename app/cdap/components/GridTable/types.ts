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

export interface IParams {
  workspaceId: string;
  context: string | number | IRecords | boolean;
}

export interface IRecords {
  [key: string]: string | boolean | Record<string, IType>;
}
export interface IPercentOfDataTypeValues {
  [key: string]: number;
}

interface ISummary {
  statistics: IRecords;
  validations: IRecords;
}

export interface IExecuteAPIResponse {
  headers: string[];
  types: IRecords;
  values: IRecords[];
  summary: ISummary;
  message: string;
}

export interface IHeaderNamesList {
  name: string;
  label: string;
  type: Array<string | boolean | Record<string, IType>>;
}

export interface IType {
  [key: string]: string | number;
}

export interface IInvalidDataCount {
  label: string;
  count: string;
}
