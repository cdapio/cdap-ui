/*
 * Copyright © 2021 Cask Data, Inc.
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

import {
  IColumnsList,
  IColumnImmutable,
  ITableInfo,
  IAddColumnsToTransforms,
  ITransformation,
  ITableAssessmentColumn,
} from 'components/Replicator/types';
import { Observable } from 'rxjs/Observable';

export interface ISelectColumnsProps {
  tableInfo?: ITableInfo;
  onSave: (tableInfo: ITableInfo, columns: IColumnsList) => void;
  initialSelected: IColumnsList;
  toggle: () => void;
  saveDraft: () => Observable<any>;
  draftId: string;
  addColumnsToTransforms: (opts: IAddColumnsToTransforms) => void;
  deleteColumnsFromTransforms: (tableName: string, colTransIndex: number) => void;
  transformations: ITransformation;
  tableAssessments: undefined | { [colName: string]: ITableAssessmentColumn };
  handleAssessTable: (tableName: string, columnAltered?: string) => void;
}

interface IColumn {
  name: string;
  type: string;
  nullable: boolean;
}

export enum ReplicateSelect {
  all = 'ALL',
  individual = 'INDIVIDUAL',
}

export interface ISelectColumnsState {
  columns: IColumn[];
  filteredColumns: IColumn[];
  primaryKeys: string[];
  selectedReplication: ReplicateSelect;
  selectedColumns: Map<string, IColumnImmutable>;
  loading: boolean;
  error: any;
  filterErrs: string[];
  search: string;
}

export interface ITransformAddProps {
  row: IColumn;
  tableInfo: ITableInfo;
  addColumnsToTransforms: (opts: IAddColumnsToTransforms) => void;
}

export interface ITransformDeleteProps {
  row: IColumn;
  tableInfo: ITableInfo;
  transforms: ITransformation;
  deleteColumnsFromTransforms: (tableName: string, colTransIndex: number) => void;
}
