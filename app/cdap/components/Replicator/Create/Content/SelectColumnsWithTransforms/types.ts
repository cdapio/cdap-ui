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
  IColumnTransformation,
  ITransformation,
  ISelectedList,
  ITableAssessmentColumn,
} from 'components/Replicator/types';
import { Observable } from 'rxjs/Observable';

export interface ISelectColumnsProps {
  tableInfo?: ITableInfo;
  onSave: (tableInfo: ITableInfo, columns: ISelectedList) => void;
  initialSelected: IColumnsList;
  toggle: () => void;
  saveDraft: () => Observable<any>;
  draftId: string;
  transformations: { [tableName: string]: ITransformation };
  tableAssessments: undefined | { [colName: string]: ITableAssessmentColumn };
  handleAssessTable: (
    table: ITableInfo,
    transformations: IColumnTransformation[],
    columns: IColumnsList
  ) => void;
  saveTransformationsAndColumns: (
    table: ITableInfo,
    transformations?: ITransformation,
    columns?: ISelectedList
  ) => void;
  assessmentLoading: boolean;
  tinkEnabled: boolean;
  getReplicatorConfig: () => any;
}

interface IColumn {
  name: string;
  type: string;
  nullable: boolean;
  sourceName: string;
  sourceType: string;
  targetName: string;
  targetType: string;
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
  transformations: IColumnTransformation[];
  saveButtonDisabled: boolean;
}

export interface ITransformAddProps {
  row: IColumn;
  addColumnsToTransforms: (opts: IColumnTransformation) => void;
  tinkEnabled: boolean;
  currentColumnName: string;
}

export interface ITransformDeleteProps {
  row: IColumn;
  transforms: IColumnTransformation[];
  deleteColumnsFromTransforms: (colTransIndex: number) => void;
}

export interface ITransAssessmentResDesc {
  name: string;
  description: string;
  suggestion: string;
  impact: string;
  severity: string; // enum - need to add other responses if there are any
  table: string;
  column: string;
}

export interface ITransAssessmentRes {
  connectivity: any[];
  features: ITransAssessmentResDesc[];
  tables: Array<{
    numColumnsNotSupported: number;
    numColumnsPartiallySupported: number;
    database: string;
    table: string;
    numColumns: number;
  }>;
  transformationIssues: ITransAssessmentResDesc[];
}
