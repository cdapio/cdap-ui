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
  context: string;
  workspaceId: string;
}

export interface IDataTypeOfColumns {
  [key: string]: string;
}

interface IRowData {
  [key: string]: string;
}

export interface IPercentOfDataTypeValues {
  [key: string]: number;
}

export interface IDataOfStatistics {
  [key: string]: string;
}

interface ISummary {
  statistics: IDataOfStatistics;
  validations: IDataOfStatistics;
}

export interface IExecuteAPIResponse {
  headers: string[];
  types: IDataTypeOfColumns;
  values: IRowData[];
  summary: ISummary;
}
