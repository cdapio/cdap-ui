/*
 * Copyright © 2020 Cask Data, Inc.
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

import { PluginProperties } from 'components/ConfigurationGroup/types';
import { List, Map, Set } from 'immutable';

export interface IColumn {
  name: string;
  type: string;
  suppressWarning?: boolean;
}

/**
 * IColumnImmutable is the immutable form of IColumn
 */
export type IColumnImmutable = Map<string, string | boolean>;
export type IColumnsList = List<IColumnImmutable>;
export type IColumnsStore = Map<string, IColumnsList>;

export interface ITableInfo {
  database: string;
  table: string;
  schema?: string;
}

export interface ITable extends ITableInfo {
  numColumns?: number;
}

/**
 * ITableImmutable is the immutable form of ITable
 */
export type ITableImmutable = Map<string, string>;
export type ITablesStore = Map<string, ITableImmutable>;

export enum DML {
  insert = 'INSERT',
  update = 'UPDATE',
  delete = 'DELETE',
}

export type IDMLStore = Map<string, Set<DML>>;

export interface ITableObj {
  database: string;
  table: string;
  schema?: string;
  columns?: IColumn[];
  dmlBlacklist?: DML[];
}

export type IPluginConfig = Record<string, string>;

export interface IArtifactInfo {
  name: string;
  version: string;
  scope: string;
}

export interface IPluginInfo {
  name: string;
  type: string;
  artifact: IArtifactInfo;
  properties: PluginProperties;
}

interface IMetricData {
  time: number;
  value: number;
}

interface IMetricSeries {
  metricName: string;
  data: IMetricData[];
  grouping: Record<string, string>;
}

export interface IRawMetricData {
  startTime: number;
  endTime: number;
  resolution: string;
  series: IMetricSeries[];
}

export interface ITransformInformation extends IColumnTransformation {
  tableName: string;
}

export interface IColumnTransformation {
  columnName: string;
  directive: string;
}

export interface ITransformation {
  tableName: string;
  columnTransformations: IColumnTransformation[];
}

export interface IAddColumnsToTransforms {
  tableName: string;
  columnTransformation: IColumnTransformation;
}
